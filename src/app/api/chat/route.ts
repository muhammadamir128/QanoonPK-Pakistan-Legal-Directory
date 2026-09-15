import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const maxDuration = 60

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
    // Simple keyword-based retrieval: search across law titles, summaries, and section content.
    const keywords = extractKeywords(userMessage)
    const retrieved: Array<{
      slug: string
      title: string
      titleUrdu: string | null
      yearEnacted: number
      category: { name: string }
      summary: string | null
      matchedSections: Array<{ sectionNumber: string; title: string | null; content: string }>
    }> = []

    // Search laws by title/summary
    const laws = await db.law.findMany({
      where: {
        OR: [
          ...keywords.flatMap((k) => [
            { title: { contains: k } },
            { titleUrdu: { contains: k } },
            { summary: { contains: k } },
            { summaryUrdu: { contains: k } },
          ]),
        ],
      },
      take: 8,
      include: { category: true, sections: true },
    })

    for (const law of laws) {
      const matchedSections = law.sections
        .filter((s) => keywords.some((k) => s.content.toLowerCase().includes(k.toLowerCase()) || (s.title ?? '').toLowerCase().includes(k.toLowerCase())))
        .slice(0, 2)
        .map((s) => ({ sectionNumber: s.sectionNumber, title: s.title, content: s.content.slice(0, 400) }))

      retrieved.push({
        slug: law.slug,
        title: law.title,
        titleUrdu: law.titleUrdu,
        yearEnacted: law.yearEnacted,
        category: { name: law.category.name },
        summary: law.summary ? law.summary.slice(0, 350) : null,
        matchedSections,
      })
    }

    // Also search sections directly for more specific queries
    if (retrieved.length < 5) {
      const sections = await db.section.findMany({
        where: {
          OR: keywords.flatMap((k) => [
            { content: { contains: k } },
            { title: { contains: k } },
            { sectionNumber: { contains: k } },
          ]),
        },
        take: 5,
        include: { law: { include: { category: true } } },
      })
      for (const s of sections) {
        if (retrieved.find((r) => r.slug === s.law.slug)) continue
        retrieved.push({
          slug: s.law.slug,
          title: s.law.title,
          titleUrdu: s.law.titleUrdu,
          yearEnacted: s.law.yearEnacted,
          category: { name: s.law.category.name },
          summary: null,
          matchedSections: [{ sectionNumber: s.sectionNumber, title: s.title, content: s.content.slice(0, 400) }],
        })
      }
    }

    // === Build context ===
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
1. صرف فراہم کردہ قوانین کا حوالہ دیں۔ اپنی طرف سے کوئی قانونی مشورہ نہ دیں۔
2. اگر سوال فراہم کردہ قوانین سے متعلق نہیں، تو واضح بتائیں کہ آپ اس سوال کا جواب نہیں دے سکتے۔
3. ہمیشہ حوالہ دیں: قانون کا نام، سال، اور شق نمبر (جہاں لاگو ہو)۔
4. آخر میں یہ تنبیہ ضرور شامل کریں: "یہ معلومات صرف تعلیمی مقاصد کے لیے ہیں۔ قانونی مشورے کے لیے لائسنس یافتہ وکیل سے رجوع کریں۔"
5. جواب مختصر اور واضح رکھیں (زیادہ سے زیادہ 200 الفاظ)۔

ذیل میں دیے گئے قوانین کا ڈیٹا استعمال کریں:

${contextText || 'کوئی متعلقہ قانون نہیں ملا۔'}`
      : `You are "Qanoon Assistant" — an AI legal assistant for Pakistan's legal directory. Your role is to provide information ONLY based on the laws provided in the context below.

CRITICAL RULES:
1. ONLY cite and reference the laws provided in the context. Do NOT make up laws, sections, or legal advice.
2. If the question is not answerable from the provided context, clearly say: "I cannot answer this from the laws in our current directory. Please consult a licensed lawyer."
3. ALWAYS cite your sources: law name, year, and section number (where applicable). Use format: "[Law Name, Year — Section X]"
4. Always end with this disclaimer: "This information is for educational purposes only. For legal advice, please consult a qualified licensed lawyer."
5. Keep answers concise (max 200 words) and clear.
6. If multiple laws are relevant, mention all of them.
7. Use plain, accessible language — explain legal terms when first used.

Use ONLY the law data below as your knowledge base:

${contextText || 'No relevant laws found in the database for this query.'}`

    // === Call LLM ===
    // Dynamic import to keep z-ai-web-dev-sdk server-only
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()

    const messages: Array<{ role: string; content: string }> = [
      { role: 'assistant', content: systemPrompt },
      // Include up to 4 most recent history messages (excluding system)
      ...history.slice(-4).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: userMessage },
    ]

    const completion = await zai.chat.completions.create({
      messages: messages as any,
      thinking: { type: 'disabled' },
    })

    const answer: string = completion.choices[0]?.message?.content ?? ''

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
    return NextResponse.json({
      ok: false,
      error: 'Sorry, I could not process your request right now. Please try again later.',
    }, { status: 500 })
  }
}

// Extract keywords from user query (simple, no ML)
function extractKeywords(query: string): string[] {
  const stopWords = new Set([
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
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'must', 'shall', 'can', 'what', 'how', 'why', 'when', 'where', 'who',
    'kya', 'hai', 'ho', 'hota', 'hoti', 'ka', 'ki', 'ke', 'ko', 'se', 'me',
    'men', 'par', 'aur', 'ya', 'nahi', 'kyun', 'kaise', 'kab', 'kahan',
    'ہے', 'ہو', 'ہوتا', 'ہوتی', 'کا', 'کی', 'کے', 'کو', 'سے', 'میں', 'پر',
    'اور', 'یا', 'نہیں', 'کیوں', 'کیسے', 'کب', 'کہاں',
  ])
  // Split on non-alphanumeric, keep words >=3 chars (English) or >=2 chars (Urdu/other)
  const tokens = query
    .toLowerCase()
    .split(/[\s,.;:!?'"()\-_/\\]+/)
    .filter((t) => t.length >= 2 && !stopWords.has(t))
  // Dedupe
  const unique = Array.from(new Set(tokens))
  // If no keywords, fall back to the whole query
  if (unique.length === 0 && query.trim().length > 0) return [query.trim().toLowerCase()]
  return unique.slice(0, 10)
}
