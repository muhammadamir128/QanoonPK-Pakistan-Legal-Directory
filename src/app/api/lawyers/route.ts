import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12')))
  const skip = (page - 1) * limit

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
