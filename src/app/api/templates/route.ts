import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/templates?category=...&q=...&page=1&limit=20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? undefined
  const q = searchParams.get('q') ?? undefined
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (category && category !== 'all') where.category = category
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { titleUrdu: { contains: q } },
      { description: { contains: q } },
      { descriptionUrdu: { contains: q } },
    ]
  }

  const [total, items] = await Promise.all([
    db.docTemplate.count({ where }),
    db.docTemplate.findMany({
      where,
      orderBy: { downloads: 'desc' },
      skip,
      take: limit,
    }),
  ])

  return NextResponse.json({
    items: items.map((t) => ({
      ...t,
      fields: JSON.parse(t.fieldsJson as string),
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
