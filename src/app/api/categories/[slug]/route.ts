import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/categories/[slug]/laws — laws under a category
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '50'))
  const sort = searchParams.get('sort') ?? 'popular'

  const category = await db.category.findUnique({ where: { slug } })
  if (!category) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

  let orderBy: Record<string, 'asc' | 'desc'> = {}
  if (sort === 'newest') orderBy = { yearEnacted: 'desc' }
  else if (sort === 'oldest') orderBy = { yearEnacted: 'asc' }
  else if (sort === 'az') orderBy = { title: 'asc' }
  else orderBy = { viewCount: 'desc' }

  const laws = await db.law.findMany({
    where: { categoryId: category.id },
    orderBy,
    take: limit,
  })
  return NextResponse.json({
    category,
    items: laws.map((l) => ({
      ...l,
      applicabilityTags: l.applicabilityTags ? JSON.parse(l.applicabilityTags as string) : [],
    })),
  })
}
