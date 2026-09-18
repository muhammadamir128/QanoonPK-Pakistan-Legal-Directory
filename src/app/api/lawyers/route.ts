import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { lawyers as fallbackLawyers } from '@/lib/lawyers-templates-data'

// GET /api/lawyers?city=...&specialization=...&verified=...&featured=...&q=...&page=1&limit=12
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city') ?? undefined
  const specialization = searchParams.get('specialization') ?? undefined
  const verified = searchParams.get('verified')
  const featured = searchParams.get('featured')
  const q = searchParams.get('q') ?? undefined
  const sort = searchParams.get('sort') ?? 'featured' // featured, rating, experience
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const skip = (page - 1) * limit

  try {
    ensureDatabaseReady()
    const where: Record<string, unknown> = {}
    if (city && city !== 'all') where.city = city
    if (specialization && specialization !== 'all') {
      where.specialization = { contains: specialization }
    }
    if (verified === 'true') where.verified = true
    if (featured === 'true') where.featured = true
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { nameUrdu: { contains: q } },
        { bio: { contains: q } },
        { city: { contains: q } },
      ]
    }

    let orderBy: Record<string, 'asc' | 'desc'> = {}
    if (sort === 'rating') orderBy = { rating: 'desc' }
    else if (sort === 'experience') orderBy = { experienceYears: 'desc' }
    else orderBy = { featured: 'desc' }

    const [total, items] = await Promise.all([
      db.lawyer.count({ where }),
      db.lawyer.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
    ])

    if (total > 0) {
      return NextResponse.json({
        items: items.map((l) => ({
          ...l,
          specialization: l.specialization ? JSON.parse(l.specialization as string) : [],
          languages: l.languages ? JSON.parse(l.languages as string) : [],
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      })
    }
  } catch (error) {
    console.warn('[Lawyers API] Database error, falling back to static data:', error)
  }

  // Fallback from lawyers-templates-data
  let filtered = [...fallbackLawyers]
  if (city && city !== 'all') filtered = filtered.filter((l) => l.city === city)
  if (specialization && specialization !== 'all') {
    filtered = filtered.filter((l) => l.specialization.includes(specialization))
  }
  if (verified === 'true') filtered = filtered.filter((l) => l.verified)
  if (featured === 'true') filtered = filtered.filter((l) => l.featured)
  if (q) {
    const lower = q.toLowerCase()
    filtered = filtered.filter(
      (l) =>
        l.name.toLowerCase().includes(lower) ||
        (l.nameUrdu && l.nameUrdu.includes(lower)) ||
        l.city.toLowerCase().includes(lower)
    )
  }

  if (sort === 'rating') filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  else if (sort === 'experience') filtered.sort((a, b) => (b.experienceYears ?? 0) - (a.experienceYears ?? 0))

  const total = filtered.length
  const paged = filtered.slice(skip, skip + limit)

  return NextResponse.json({
    items: paged.map((l) => ({
      id: `lawyer_${l.slug}`,
      ...l,
      viewCount: 200,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
