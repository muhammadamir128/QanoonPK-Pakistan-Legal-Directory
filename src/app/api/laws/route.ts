import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { categories as fallbackCategories, laws as fallbackLaws } from '@/lib/seed-data'

// GET /api/laws?category=...&jurisdiction=...&status=...&year=...&q=...&page=1&limit=20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? undefined
  const jurisdiction = searchParams.get('jurisdiction') ?? undefined
  const status = searchParams.get('status') ?? undefined
  const year = searchParams.get('year')
  const q = searchParams.get('q') ?? undefined
  const sort = searchParams.get('sort') ?? 'popular' // popular, newest, oldest, az, za
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const skip = (page - 1) * limit

  try {
    ensureDatabaseReady()
    const where: Record<string, unknown> = {}
    if (category) where.category = { slug: category }
    if (jurisdiction) where.jurisdiction = jurisdiction
    if (status) where.status = status
    if (year) where.yearEnacted = parseInt(year)
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { titleUrdu: { contains: q } },
        { summary: { contains: q } },
        { summaryUrdu: { contains: q } },
        { promulgatingAuthority: { contains: q } },
        { gazetteReference: { contains: q } },
      ]
    }

    let orderBy: Record<string, 'asc' | 'desc'> = {}
    if (sort === 'newest') orderBy = { yearEnacted: 'desc' }
    else if (sort === 'oldest') orderBy = { yearEnacted: 'asc' }
    else if (sort === 'az') orderBy = { title: 'asc' }
    else if (sort === 'za') orderBy = { title: 'desc' }
    else orderBy = { viewCount: 'desc' } // popular

    const [total, items] = await Promise.all([
      db.law.count({ where }),
      db.law.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
    ])

    if (total > 0) {
      return NextResponse.json({
        items: items.map((l) => ({
          ...l,
          applicabilityTags: l.applicabilityTags ? JSON.parse(l.applicabilityTags as string) : [],
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      })
    }
  } catch (error) {
    console.warn('[Laws API] Database error, falling back to static seed data:', error)
  }

  // Graceful Fallback from seed data
  let filtered = [...fallbackLaws]
  if (category) filtered = filtered.filter((l) => l.categorySlug === category)
  if (jurisdiction) filtered = filtered.filter((l) => l.jurisdiction === jurisdiction)
  if (status) filtered = filtered.filter((l) => l.status === status)
  if (year) filtered = filtered.filter((l) => l.yearEnacted === parseInt(year))
  if (q) {
    const lower = q.toLowerCase()
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(lower) ||
        (l.titleUrdu && l.titleUrdu.includes(lower)) ||
        (l.summary && l.summary.toLowerCase().includes(lower))
    )
  }

  if (sort === 'newest') filtered.sort((a, b) => b.yearEnacted - a.yearEnacted)
  else if (sort === 'oldest') filtered.sort((a, b) => a.yearEnacted - b.yearEnacted)
  else if (sort === 'az') filtered.sort((a, b) => a.title.localeCompare(b.title))
  else if (sort === 'za') filtered.sort((a, b) => b.title.localeCompare(a.title))

  const total = filtered.length
  const paged = filtered.slice(skip, skip + limit)

  const mapped = paged.map((l, i) => {
    const cat = fallbackCategories.find((c) => c.slug === l.categorySlug)
    return {
      id: `law_${l.slug}`,
      title: l.title,
      titleUrdu: l.titleUrdu,
      slug: l.slug,
      categoryId: `cat_${l.categorySlug}`,
      yearEnacted: l.yearEnacted,
      jurisdiction: l.jurisdiction,
      status: l.status,
      summary: l.summary,
      summaryUrdu: l.summaryUrdu,
      fullTextUrl: null,
      gazetteReference: l.gazetteReference || null,
      promulgatingAuthority: l.promulgatingAuthority || null,
      applicabilityTags: l.applicabilityTags || [],
      viewCount: 1000 - i * 10,
      category: {
        id: `cat_${l.categorySlug}`,
        name: cat?.name || 'General',
        nameUrdu: cat?.nameUrdu || '',
        slug: cat?.slug || l.categorySlug,
        color: cat?.color || '#0d9488',
      },
    }
  })

  return NextResponse.json({
    items: mapped,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

// POST /api/laws — create a new law (admin)
export async function POST(req: NextRequest) {
  try {
    ensureDatabaseReady()
    const body = await req.json()
    const { title, titleUrdu, slug, categoryId, yearEnacted, jurisdiction, status, summary, summaryUrdu, gazetteReference, promulgatingAuthority, applicabilityTags } = body
    if (!title || !slug || !categoryId || !yearEnacted) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }
    const law = await db.law.create({
      data: {
        title,
        titleUrdu: titleUrdu ?? null,
        slug,
        categoryId,
        yearEnacted: parseInt(yearEnacted),
        jurisdiction: jurisdiction ?? 'federal',
        status: status ?? 'active',
        summary: summary ?? null,
        summaryUrdu: summaryUrdu ?? null,
        gazetteReference: gazetteReference ?? null,
        promulgatingAuthority: promulgatingAuthority ?? null,
        applicabilityTags: applicabilityTags ? JSON.stringify(applicabilityTags) : null,
      },
    })
    return NextResponse.json({ ok: true, law })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
