import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/search?q=...&page=1&limit=20 — full-text search across laws & sections
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim()
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  if (!q) return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 })

  // Search laws
  const laws = await db.law.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { titleUrdu: { contains: q } },
        { summary: { contains: q } },
        { summaryUrdu: { contains: q } },
        { promulgatingAuthority: { contains: q } },
        { gazetteReference: { contains: q } },
      ],
    },
    include: { category: true },
  })

  // Search sections
  const sections = await db.section.findMany({
    where: {
      OR: [
        { content: { contains: q } },
        { contentUrdu: { contains: q } },
        { title: { contains: q } },
        { sectionNumber: { contains: q } },
      ],
    },
    include: { law: { include: { category: true } } },
    take: limit * 2,
  })

  // Build unified results
  type Result = {
    type: 'law' | 'section'
    slug: string
    title: string
    titleUrdu?: string | null
    snippet: string
    snippetUrdu?: string | null
    category?: { name: string; slug: string; color?: string | null }
    yearEnacted?: number
    sectionNumber?: string
    sectionId?: string
  }
  const results: Result[] = []
  for (const l of laws) {
    results.push({
      type: 'law',
      slug: l.slug,
      title: l.title,
      titleUrdu: l.titleUrdu,
      snippet: (l.summary ?? '').slice(0, 200),
      snippetUrdu: l.summaryUrdu,
      category: { name: l.category.name, slug: l.category.slug, color: l.category.color },
      yearEnacted: l.yearEnacted,
    })
  }
  for (const s of sections) {
    results.push({
      type: 'section',
      slug: s.law.slug,
      title: s.law.title,
      titleUrdu: s.law.titleUrdu,
      snippet: `${s.sectionNumber} ${s.title ?? ''}: ${(s.content).slice(0, 180)}`,
      snippetUrdu: s.contentUrdu,
      category: { name: s.law.category.name, slug: s.law.category.slug, color: s.law.category.color },
      yearEnacted: s.law.yearEnacted,
      sectionNumber: s.sectionNumber,
      sectionId: s.id,
    })
  }

  // Log the search
  await db.searchLog.create({
    data: {
      query: q,
      resultsCount: results.length,
    },
  })

  // Pagination
  const total = results.length
  const start = (page - 1) * limit
  const paged = results.slice(start, start + limit)
  return NextResponse.json({
    items: paged,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
