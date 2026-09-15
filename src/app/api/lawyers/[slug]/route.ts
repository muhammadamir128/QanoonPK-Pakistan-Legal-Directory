import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/lawyers/[slug] — lawyer detail with reviews
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const lawyer = await db.lawyer.findUnique({
    where: { slug },
    include: {
      reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })
  if (!lawyer) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

  // Increment view count
  db.lawyer.update({ where: { id: lawyer.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  // Related lawyers (same city OR same specialization)
  const specialization = lawyer.specialization ? JSON.parse(lawyer.specialization as string) as string[] : []
  const related = await db.lawyer.findMany({
    where: {
      slug: { not: lawyer.slug },
      OR: [
        { city: lawyer.city },
        ...(specialization.length > 0
          ? specialization.map((s) => ({ specialization: { contains: s } }))
          : []),
      ],
    },
    take: 4,
    orderBy: { rating: 'desc' },
  })

  return NextResponse.json({
    ...lawyer,
    specialization,
    languages: lawyer.languages ? JSON.parse(lawyer.languages as string) : [],
    related: related.map((l) => ({
      ...l,
      specialization: l.specialization ? JSON.parse(l.specialization as string) : [],
      languages: l.languages ? JSON.parse(l.languages as string) : [],
    })),
  })
}
