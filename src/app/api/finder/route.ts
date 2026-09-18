import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { categories as fallbackCategories, laws as fallbackLaws } from '@/lib/seed-data'

const defaultQuestions = [
  {
    id: 'fq_1',
    question: 'What kind of issue are you facing?',
    questionUrdu: 'آپ کس نوعیت کا مسئلہ درپیش ہے؟',
    orderIndex: 0,
    options: [
      { id: 'a', label: 'Crime committed against me / I am accused', labelUrdu: 'میرے خلاف جرم / مجھ پر الزام', nextIdx: 1 },
      { id: 'b', label: 'Marriage, divorce, custody or maintenance', labelUrdu: 'نکاح، طلاق، حضانت یا نان نفقہ', nextIdx: 2 },
      { id: 'c', label: 'Online fraud, harassment, fake account', labelUrdu: 'آن لائن فراڈ، ہراسانی، جعلی اکاؤنٹ', categoryIds: ['prevention-of-electronic-crimes-act-2016', 'electronic-transactions-ordinance-2002'] },
      { id: 'd', label: 'Workplace or salary dispute', labelUrdu: 'دفتر یا تنخواہ کا تنازعہ', categoryIds: ['industrial-relations-act-2012', 'payment-of-wages-act-1936', 'minimum-wages-ordinance-1961', 'protection-against-harassment-of-women-at-workplace-act-2010'] },
      { id: 'e', label: 'Tax / FBR notice / Filing', labelUrdu: 'ٹیکس / FBR نوٹس / اندراج', categoryIds: ['income-tax-ordinance-2001', 'sales-tax-act-1990', 'federal-excise-act-2005'] },
      { id: 'f', label: 'Property purchase / sale / dispute', labelUrdu: 'جائداد کی خرید و فروخت / تنازعہ', categoryIds: ['transfer-of-property-act-1882', 'registration-act-1908', 'stamp-act-1899', 'land-revenue-act-1967'] },
      { id: 'g', label: 'Contract / agreement dispute', labelUrdu: 'معاہدے کا تنازعہ', categoryIds: ['contract-act-1872', 'specific-relief-act-1877'] },
      { id: 'h', label: 'Women\'s rights violation', labelUrdu: 'خواتین کے حقوق کی خلاف ورزی', categoryIds: ['protection-against-harassment-of-women-at-workplace-act-2010', 'acid-control-and-acid-crime-prevention-act-2011', 'punjab-protection-of-women-against-violence-act-2016'] },
      { id: 'i', label: 'Consumer / defective product complaint', labelUrdu: 'صارف / معیب مصنوعات کی شکایت', categoryIds: ['punjab-consumer-protection-act-2005', 'sindh-consumer-protection-act-2014'] },
      { id: 'j', label: 'Fundamental right / government action', labelUrdu: 'بنیادی حق / حکومتی اقدام', categoryIds: ['constitution-of-pakistan-1973'] },
    ],
  },
  {
    id: 'fq_2',
    question: 'What happened?',
    questionUrdu: 'کیا ہوا؟',
    orderIndex: 1,
    options: [
      { id: 'a', label: 'Theft / robbery / burglary', labelUrdu: 'چوری / ڈکیتی', categoryIds: ['pakistan-penal-code-1860', 'code-of-criminal-procedure-1898'] },
      { id: 'b', label: 'Murder / attempt to murder / injury', labelUrdu: 'قتل / قتل کی کوشش / زخم', categoryIds: ['pakistan-penal-code-1860', 'qanun-e-shahadat-order-1984'] },
      { id: 'c', label: 'Acid attack / disfigurement', labelUrdu: 'ایسڈ حملہ / چہرے کا بگاڑ', categoryIds: ['acid-control-and-acid-crime-prevention-act-2011', 'pakistan-penal-code-1860'] },
      { id: 'd', label: 'Online harassment / cyber fraud', labelUrdu: 'آن لائن ہراسانی / سائبر فراڈ', categoryIds: ['prevention-of-electronic-crimes-act-2016'] },
      { id: 'e', label: 'Defamation / insult / false accusation', labelUrdu: 'عزت آبری / تذلیل', categoryIds: ['pakistan-penal-code-1860', 'prevention-of-electronic-crimes-act-2016'] },
      { id: 'f', label: 'Drugs / narcotics', labelUrdu: 'منشیات', categoryIds: ['control-of-narcotic-substances-act-1997'] },
      { id: 'g', label: 'Terrorism / extremism', labelUrdu: 'دہشت گردی / انتہا پسندی', categoryIds: ['anti-terrorism-act-1997'] },
    ],
  },
  {
    id: 'fq_3',
    question: 'What is the family issue?',
    questionUrdu: 'خاندانی مسئلہ کیا ہے؟',
    orderIndex: 2,
    options: [
      { id: 'a', label: 'Marriage registration / Nikahnama issue', labelUrdu: 'نکاح رجسٹری', categoryIds: ['muslim-family-laws-ordinance-1961', 'enforcement-of-muslim-family-laws-rules-1961'] },
      { id: 'b', label: 'Divorce (talaq) by husband', labelUrdu: 'طلاق (شوہر کی طرف سے)', categoryIds: ['muslim-family-laws-ordinance-1961', 'family-courts-act-1964'] },
      { id: 'c', label: 'Khula (wife seeking divorce)', labelUrdu: 'خلع (بیوی طلاق چاہے)', categoryIds: ['family-courts-act-1964', 'dissolution-of-muslim-marriages-act-1939'] },
      { id: 'd', label: 'Child custody / guardianship', labelUrdu: 'بچوں کی حضانت / ولایت', categoryIds: ['guardian-and-wards-act-1890', 'family-courts-act-1964'] },
      { id: 'e', label: 'Maintenance / dower (mahr)', labelUrdu: 'نان نفقہ / مہر', categoryIds: ['muslim-family-laws-ordinance-1961', 'family-courts-act-1964'] },
      { id: 'f', label: 'Child marriage (under-age)', labelUrdu: 'بچوں کی شادی', categoryIds: ['child-marriage-restraint-act-1929'] },
      { id: 'g', label: 'Second marriage / polygamy', labelUrdu: 'دوسری شادی', categoryIds: ['muslim-family-laws-ordinance-1961'] },
    ],
  },
]

// GET /api/finder/questions — questionnaire tree
export async function GET() {
  try {
    ensureDatabaseReady()
    const qs = await db.finderQuestion.findMany({
      orderBy: { orderIndex: 'asc' },
    })
    if (qs && qs.length > 0) {
      return NextResponse.json({
        items: qs.map((q) => ({
          ...q,
          options: JSON.parse(q.optionsJson),
        })),
      })
    }
  } catch (error) {
    console.warn('[Finder API] Database error, falling back to default questions:', error)
  }

  return NextResponse.json({ items: defaultQuestions })
}

// POST /api/finder/result — submit selected law slugs, return matching laws
export async function POST(req: NextRequest) {
  const body = await req.json()
  const slugs: string[] = body.slugs ?? []
  if (!slugs.length) return NextResponse.json({ items: [], total: 0 })

  try {
    ensureDatabaseReady()
    const laws = await db.law.findMany({
      where: { slug: { in: slugs } },
      include: { category: true },
    })

    if (laws && laws.length > 0) {
      const ordered = slugs.map((s) => laws.find((l) => l.slug === s)).filter(Boolean)
      return NextResponse.json({
        items: ordered.map((l) => ({
          ...l,
          applicabilityTags: l!.applicabilityTags ? JSON.parse(l!.applicabilityTags as string) : [],
        })),
        total: ordered.length,
      })
    }
  } catch (error) {
    console.warn('[Finder Results API] Database error, matching from seed data:', error)
  }

  // Fallback matching from seed data
  const ordered = slugs
    .map((s) => fallbackLaws.find((l) => l.slug === s))
    .filter(Boolean)
    .map((l) => {
      const cat = fallbackCategories.find((c) => c.slug === l!.categorySlug)
      return {
        id: `law_${l!.slug}`,
        title: l!.title,
        titleUrdu: l!.titleUrdu,
        slug: l!.slug,
        yearEnacted: l!.yearEnacted,
        jurisdiction: l!.jurisdiction,
        status: l!.status,
        summary: l!.summary,
        summaryUrdu: l!.summaryUrdu,
        gazetteReference: l!.gazetteReference || null,
        promulgatingAuthority: l!.promulgatingAuthority || null,
        applicabilityTags: l!.applicabilityTags || [],
        category: {
          id: `cat_${l!.categorySlug}`,
          name: cat?.name || 'General',
          nameUrdu: cat?.nameUrdu || '',
          slug: cat?.slug || l!.categorySlug,
          color: cat?.color || '#0d9488',
        },
      }
    })

  return NextResponse.json({
    items: ordered,
    total: ordered.length,
  })
}
