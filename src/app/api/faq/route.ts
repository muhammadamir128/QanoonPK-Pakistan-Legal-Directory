import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/faq?q=...&category=...&limit=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? 'all'
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '50'))

  const { faqItems } = await import('@/lib/faq-data')

  let filtered = faqItems
  if (category !== 'all') {
    filtered = filtered.filter((item) => item.category.toLowerCase() === category.toLowerCase())
  }
  if (q.trim()) {
    const query = q.toLowerCase()
    filtered = filtered.filter((item) =>
      item.question.toLowerCase().includes(query) ||
      item.questionUrdu.includes(q) ||
      item.answer.toLowerCase().includes(query) ||
      item.answerUrdu.includes(q) ||
      item.category.toLowerCase().includes(query)
    )
  }

  // Enrich with related laws from DB
  const allSlugs = new Set<string>()
  filtered.forEach((f) => f.relatedLaws?.forEach((s) => allSlugs.add(s)))
  const laws = allSlugs.size > 0
    ? await db.law.findMany({
        where: { slug: { in: Array.from(allSlugs) } },
        select: { slug: true, title: true, titleUrdu: true, yearEnacted: true },
      })
    : []
  const lawsBySlug = new Map(laws.map((l) => [l.slug, l]))

  return NextResponse.json({
    items: filtered.slice(0, limit).map((f) => ({
      ...f,
      relatedLaws: f.relatedLaws?.map((slug) => lawsBySlug.get(slug)).filter(Boolean) ?? [],
    })),
    total: filtered.length,
  })
}
