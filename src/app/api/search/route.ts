import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { categories as fallbackCategories, laws as fallbackLaws } from '@/lib/seed-data'

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

// GET /api/search?q=...&page=1&limit=20 — full-text search across laws & sections
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim()
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  if (!q) return NextResponse.json({ items: [], total: 0, page, limit, totalPages: 0 })

  try {
    ensureDatabaseReady()
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

    // Log the search (safe fire-and-forget)
    db.searchLog.create({
      data: {
        query: q,
        resultsCount: results.length,
      },
    }).catch(() => {})

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
  } catch (error) {
    console.warn('[Search API] Database error, falling back to static seed data:', error)
  }

  // Graceful Fallback search from seed data
  const lower = q.toLowerCase()
  const results: Result[] = []

  for (const l of fallbackLaws) {
    const cat = fallbackCategories.find((c) => c.slug === l.categorySlug)
    const matchesLaw =
      l.title.toLowerCase().includes(lower) ||
      (l.titleUrdu && l.titleUrdu.includes(lower)) ||
      (l.summary && l.summary.toLowerCase().includes(lower)) ||
      (l.summaryUrdu && l.summaryUrdu.includes(lower))

    if (matchesLaw) {
      results.push({
        type: 'law',
        slug: l.slug,
        title: l.title,
        titleUrdu: l.titleUrdu,
        snippet: (l.summary ?? '').slice(0, 200),
        snippetUrdu: l.summaryUrdu,
        category: { name: cat?.name || 'General', slug: cat?.slug || l.categorySlug, color: cat?.color || '#0d9488' },
        yearEnacted: l.yearEnacted,
      })
    }

    for (const s of l.sections || []) {
      const matchesSection =
        s.content.toLowerCase().includes(lower) ||
        (s.contentUrdu && s.contentUrdu.includes(lower)) ||
        (s.title && s.title.toLowerCase().includes(lower)) ||
        s.sectionNumber.toLowerCase().includes(lower)

      if (matchesSection) {
        results.push({
          type: 'section',
          slug: l.slug,
          title: l.title,
          titleUrdu: l.titleUrdu,
          snippet: `${s.sectionNumber} ${s.title ?? ''}: ${(s.content).slice(0, 180)}`,
          snippetUrdu: s.contentUrdu,
          category: { name: cat?.name || 'General', slug: cat?.slug || l.categorySlug, color: cat?.color || '#0d9488' },
          yearEnacted: l.yearEnacted,
          sectionNumber: s.sectionNumber,
          sectionId: `sec_${l.slug}_${s.sectionNumber}`,
        })
      }
    }
  }

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
