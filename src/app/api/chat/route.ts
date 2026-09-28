import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const maxDuration = 60

type MatchedSection = {
  sectionNumber: string
  title: string | null
  content: string
}

type RetrievedLaw = {
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted: number
  category: { name: string }
  summary: string | null
  matchedSections: MatchedSection[]
  score?: number
}

// POST /api/chat — RAG-based legal chatbot
// Body: { message: string, history?: [{role, content}], lang?: 'en'|'ur' }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userMessage: string = (body.message ?? '').trim()
    const history: Array<{ role: string; content: string }> = body.history ?? []
    const lang: 'en' | 'ur' = body.lang ?? 'en'

    if (!userMessage) {
      return NextResponse.json({ ok: false, error: 'Message is required' }, { status: 400 })
    }
    if (userMessage.length > 1000) {
      return NextResponse.json({ ok: false, error: 'Message too long (max 1000 chars)' }, { status: 400 })
    }

    // === RAG: Retrieve relevant laws ===
    const keywords = extractKeywords(userMessage)

    // 1. Search laws by title, summary, or category
    const laws = await db.law.findMany({
      where: keywords.length > 0 ? {
        OR: [
          ...keywords.flatMap((k) => [
            { title: { contains: k } },
            { titleUrdu: { contains: k } },
            { summary: { contains: k } },
            { summaryUrdu: { contains: k } },
            { category: { name: { contains: k } } },
          ]),
        ],
      } : undefined,
      take: 15,
      include: { category: true, sections: true },
    })

    const retrievedMap = new Map<string, RetrievedLaw>()

    for (const law of laws) {
      const matchedSections = law.sections
        .filter((s) =>
          keywords.some(
            (k) =>
              s.content.toLowerCase().includes(k.toLowerCase()) ||
              (s.title ?? '').toLowerCase().includes(k.toLowerCase()) ||
              s.sectionNumber.toLowerCase().includes(k.toLowerCase())
          )
        )
        .slice(0, 3)
        .map((s) => ({ sectionNumber: s.sectionNumber, title: s.title, content: s.content.slice(0, 400) }))

      // Compute relevance score
      let score = 0
      const titleLower = law.title.toLowerCase()
      const summaryLower = (law.summary ?? '').toLowerCase()
      const catLower = law.category.name.toLowerCase()
      const genericModifiers = new Set(['protection', 'protect', 'bill', 'order', 'right', 'rights', 'punjab', 'sindh', 'federal', 'tahaffuz', 'تحفظ', 'قوانین', 'قانون'])

      for (const k of keywords) {
        const kl = k.toLowerCase()
        const weight = genericModifiers.has(kl) ? 1 : 5
        if (titleLower.includes(kl)) score += 10 * weight
        if (catLower.includes(kl)) score += 6 * weight
        if (summaryLower.includes(kl)) score += 3 * weight
        if (matchedSections.length > 0) score += 4 * weight
      }

      retrievedMap.set(law.slug, {
        slug: law.slug,
        title: law.title,
        titleUrdu: law.titleUrdu,
        yearEnacted: law.yearEnacted,
        category: { name: law.category.name },
        summary: law.summary ? law.summary.slice(0, 350) : null,
        matchedSections,
        score,
      })
    }

    // 2. Also search sections directly for more specific queries
    if (retrievedMap.size < 6 && keywords.length > 0) {
      const sections = await db.section.findMany({
        where: {
          OR: keywords.flatMap((k) => [
            { content: { contains: k } },
            { title: { contains: k } },
            { sectionNumber: { contains: k } },
          ]),
        },
        take: 6,
        include: { law: { include: { category: true } } },
      })

      for (const s of sections) {
        if (!retrievedMap.has(s.law.slug)) {
          retrievedMap.set(s.law.slug, {
            slug: s.law.slug,
            title: s.law.title,
            titleUrdu: s.law.titleUrdu,
            yearEnacted: s.law.yearEnacted,
            category: { name: s.law.category.name },
            summary: s.law.summary ? s.law.summary.slice(0, 350) : null,
            matchedSections: [{ sectionNumber: s.sectionNumber, title: s.title, content: s.content.slice(0, 400) }],
            score: 5,
          })
        }
      }
    }

    // Sort by relevance score
    const retrieved = Array.from(retrievedMap.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

    // === Build context for prompt ===
    const contextText = retrieved
      .slice(0, 6)
      .map((r, i) => {
        const secText = r.matchedSections.length
          ? `\n   Key sections:\n${r.matchedSections.map((s) => `   - Section ${s.sectionNumber}${s.title ? ` (${s.title})` : ''}: ${s.content}`).join('\n')}`
          : ''
        return `[${i + 1}] ${r.title} (${r.yearEnacted}, ${r.category.name})\n   Summary: ${r.summary ?? 'N/A'}${secText}\n   URL: /laws/${r.slug}`
      })
      .join('\n\n')

    // === System prompt ===
    const systemPrompt = lang === 'ur'
      ? `آپ "قانون اسسٹنٹ" ہیں — پاکستان کے قانونی ڈائریکٹری کا AI اسسٹنٹ۔ آپ کا کام صرف ذیل میں دیے گئے قوانین کی بنیاد پر معلومات فراہم کرنا ہے۔

اہم اصول:
1. صرف فراہم کردہ قوانین کا حوالہ دیں۔ اپنی طرف سے کوئی من گھڑت قانونی مشورہ نہ دیں۔
2. اگر سوال فراہم کردہ قوانین سے متعلق نہیں، تو واضح بتائیں کہ آپ اس سوال کا جواب نہیں دے سکتے۔
3. ہمیشہ حوالہ دیں: قانون کا نام، سال، اور شق نمبر (جہاں لاگو ہو)۔
4. آخر میں یہ تنبیہ ضرور شامل کریں: "یہ معلومات صرف تعلیمی اور تحقیقی مقاصد کے لیے ہیں۔ قانونی مشورے کے لیے لائسنس یافتہ وکیل سے رجوع کریں۔"
5. جواب مختصر، معلوماتی اور واضح رکھیں (150 سے 250 الفاظ)۔

ذیل میں دیے گئے قوانین کا ڈیٹا استعمال کریں:

${contextText || 'کوئی متعلقہ قانون نہیں ملا۔'}`
      : `You are "Qanoon Assistant" — an AI legal assistant for Pakistan's legal directory. Your role is to provide clear, reliable legal information based on Pakistan's statutes.

CRITICAL RULES:
1. ONLY cite and reference the laws provided in the context. Do NOT make up laws, sections, or legal advice.
2. If the question is not answerable from the provided context, clearly indicate what laws are available or advise consulting a licensed lawyer.
3. ALWAYS cite your sources: law name, year, and section number (where applicable). Use format: "[Law Name, Year — Section X]"
4. Always end with this disclaimer: "This information is for educational and research purposes only. For formal legal advice, please consult a qualified licensed advocate."
5. Keep answers structured with bullet points and clear explanations (150–250 words).
6. If multiple laws are relevant, mention each with its specific role.

Use ONLY the law data below as your knowledge base:

${contextText || 'No relevant laws found in the database for this query.'}`

    let answer = ''

    // 1. Try external LLM (OpenAI / Gemini / z-ai if configured)
    const llmAnswer = await tryExternalLLM(systemPrompt, userMessage, history)
    if (llmAnswer) {
      answer = llmAnswer
    } else {
      // 2. Fallback to smart internal RAG Legal Synthesizer
      answer = synthesizeLegalAnswer(userMessage, retrieved, lang)
    }

    // === Sources for citation display ===
    const sources = retrieved.slice(0, 6).map((r) => ({
      slug: r.slug,
      title: r.title,
      titleUrdu: r.titleUrdu,
      yearEnacted: r.yearEnacted,
      category: r.category.name,
      url: `/laws/${r.slug}`,
    }))

    return NextResponse.json({
      ok: true,
      answer,
      sources,
      retrievedCount: retrieved.length,
    })
  } catch (e) {
    console.error('Chat error:', e)
    // Even on unexpected error, provide an informative fallback response
    return NextResponse.json({
      ok: true,
      answer:
        'I encountered a temporary processing delay while indexing the query. You can browse the complete Pakistan legal directory, acts, ordinances, and constitutional articles using the search bar or category directory above.\n\nDisclaimer: This information is for educational purposes only. Please consult a licensed advocate for legal advice.',
      sources: [],
      retrievedCount: 0,
    })
  }
}

// Extract keywords from user query (filtering out common noise & legal filler)
function extractKeywords(query: string): string[] {
  const stopWords = new Set([
    // English filler & auxiliary
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'of', 'to', 'in',
    'on', 'at', 'by', 'for', 'with', 'about', 'as', 'into', 'like',
    'through', 'after', 'over', 'between', 'out', 'against', 'during',
    'without', 'before', 'under', 'around', 'among', 'and', 'or', 'but',
    'not', 'no', 'yes', 'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your',
    'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 'them', 'their',
    'what', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'this', 'that', 'these', 'those', 'am', 'if', 'because', 'while',
    // Common noise words in user queries
    'total', 'totall', 'tell', 'show', 'give', 'list', 'please', 'help',
    'want', 'need', 'explain', 'detail', 'details', 'find', 'know',
    // Legal generic words that match almost every database record
    'law', 'laws', 'act', 'acts', 'ordinance', 'ordinances', 'code', 'statute',
    'statutes', 'bill', 'pakistan', 'pakistani', 'legal', 'section', 'sections',
    // Urdu stopwords
    'kya', 'hai', 'hain', 'ho', 'hota', 'hoti', 'ka', 'ki', 'ke', 'ko', 'se', 'me',
    'men', 'par', 'aur', 'ya', 'nahi', 'kyun', 'kaise', 'kab', 'kahan', 'bataen',
    'batao', 'baray', 'bari', 'qanoon', 'qawaneen',
    'ہے', 'ہیں', 'ہو', 'ہوتا', 'ہوتی', 'کا', 'کی', 'کے', 'کو', 'سے', 'میں', 'پر',
    'اور', 'یا', 'نہیں', 'کیوں', 'کیسے', 'کب', 'کہاں', 'قانون', 'قوانین', 'پاکستان',
  ])

  // Split on non-alphanumeric, keep meaningful tokens
  const tokens = query
    .toLowerCase()
    .split(/[\s,.;:!?'"()\-_/\\]+/)
    .filter((t) => t.length >= 2 && !stopWords.has(t))

  const unique = Array.from(new Set(tokens))

  // If all words were filtered out (e.g. user typed "Pakistan laws"), keep words of length >= 3
  if (unique.length === 0 && query.trim().length > 0) {
    const rawTokens = query
      .toLowerCase()
      .split(/[\s,.;:!?'"()\-_/\\]+/)
      .filter((t) => t.length >= 3)
    return Array.from(new Set(rawTokens)).slice(0, 5)
  }

  return unique.slice(0, 8)
}

// Try external LLM if configured in the environment
async function tryExternalLLM(
  systemPrompt: string,
  userMessage: string,
  history: Array<{ role: string; content: string }>
): Promise<string | null> {
  // 1. Try Gemini API if GEMINI_API_KEY is present
  if (process.env.GEMINI_API_KEY) {
    try {
      const apiKey = process.env.GEMINI_API_KEY
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }] },
            ],
          }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) return text
      }
    } catch {}
  }

  // 2. Try OpenAI API if OPENAI_API_KEY is present
  if (process.env.OPENAI_API_KEY) {
    try {
      const apiKey = process.env.OPENAI_API_KEY
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.slice(-4).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
            { role: 'user', content: userMessage },
          ],
          temperature: 0.2,
          max_tokens: 600,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const text = data.choices?.[0]?.message?.content
        if (text) return text
      }
    } catch {}
  }

  // 3. Try z-ai-web-dev-sdk if available and configured
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()
    const messages = [
      { role: 'assistant', content: systemPrompt },
      ...history.slice(-4).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: userMessage },
    ]
    const completion = await zai.chat.completions.create({
      messages: messages as any,
      thinking: { type: 'disabled' },
    })
    const text = completion.choices[0]?.message?.content
    if (text) return text
  } catch {}

  return null
}

// Built-in intelligent RAG legal synthesizer
function synthesizeLegalAnswer(
  userQuery: string,
  retrieved: RetrievedLaw[],
  lang: 'en' | 'ur'
): string {
  if (retrieved.length === 0) {
    if (lang === 'ur') {
      return (
        `آپ کے سوال "${userQuery}" کے حوالے سے ہماری ڈائریکٹری میں کوئی براہ راست قانون دستیاب نہیں ہے۔\n\n` +
        `• آپ تلاش کے لیے مزید مخصوص الفاظ (جیسے کہ قانون کا عنوان، دفعہ نمبر، یا قانونی موضوع) استعمال کر سکتے ہیں۔\n` +
        `• مزید تفصیلات اور مکمل قانونی رہنمائی کے لیے کسی مستند وکیل سے رجوع کریں۔\n\n` +
        `تنبیہ: یہ معلومات صرف تعلیمی اور معلوماتی مقاصد کے لیے ہیں۔ کسی بھی قسم کے قانونی مشورے کے لیے لائسنس یافتہ وکیل سے رابطہ کریں۔`
      )
    }
    return (
      `No specific statutes directly matching "${userQuery}" were found in the current legal directory index.\n\n` +
      `• Try searching by the exact title of the law, category (e.g. Criminal Law, Family Law, Constitutional Law), or section number.\n` +
      `• You can also browse all catalogued statutes in the directory above.\n\n` +
      `Disclaimer: This information is for educational and research purposes only. For legal advice, please consult a qualified licensed lawyer.`
    )
  }

  if (lang === 'ur') {
    const topLaws = retrieved.slice(0, 4)
    const bulletPoints = topLaws.map((law) => {
      const title = law.titleUrdu || law.title
      const summary = law.summary ? ` — ${law.summary}` : ''
      const sections = law.matchedSections.length > 0
        ? `\n  - اہم دفعات: ${law.matchedSections.map((s) => `دفعہ ${s.sectionNumber}${s.title ? ` (${s.title})` : ''}`).join(', ')}`
        : ''
      return `• [${title} (${law.yearEnacted})]${summary}${sections}`
    }).join('\n')

    return (
      `آپ کے استفسار کے مطابق پاکستانی قوانین کے تحت درج ذیل متعلقہ قوانین اور شقیں دستیاب ہیں:\n\n` +
      `${bulletPoints}\n\n` +
      `آپ ان قوانین کی مکمل شقیں اور ترامیم ڈائریکٹری میں اوپر دیے گئے لنک سے پڑھ سکتے ہیں۔\n\n` +
      `تنبیہ: یہ معلومات صرف تعلیمی مقاصد کے لیے ہیں۔ قانونی مشورے کے لیے لائسنس یافتہ وکیل سے رجوع کریں۔`
    )
  }

  // English synthesis
  const topLaws = retrieved.slice(0, 4)
  const bulletPoints = topLaws.map((law) => {
    const summary = law.summary ? `: ${law.summary}` : ''
    const sections = law.matchedSections.length > 0
      ? `\n  - Relevant Sections: ${law.matchedSections.map((s) => `Section ${s.sectionNumber}${s.title ? ` (${s.title})` : ''}`).join(', ')}`
      : ''
    return `• **[${law.title} (${law.yearEnacted}) — ${law.category.name}]**${summary}${sections}`
  }).join('\n\n')

  return (
    `Based on Pakistan's legal directory, here is the relevant statutory framework regarding your inquiry:\n\n` +
    `${bulletPoints}\n\n` +
    `You can explore the full text, amendments, and cross-references of these statutes in the directory using the source links below.\n\n` +
    `*Disclaimer: This information is for educational and research purposes only. For formal legal counsel, please consult a qualified licensed advocate.*`
  )
}
