import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/categories — all categories with law counts
export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { laws: true } },
    },
  })
  return NextResponse.json({ items: categories })
}

// POST /api/categories — create category (admin)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, nameUrdu, slug, icon, color, description, descriptionUrdu } = body
  if (!name || !slug) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  const cat = await db.category.create({
    data: {
      name,
      nameUrdu: nameUrdu ?? null,
      slug,
      icon: icon ?? null,
      color: color ?? null,
      description: description ?? null,
      descriptionUrdu: descriptionUrdu ?? null,
    },
  })
  return NextResponse.json({ ok: true, category: cat })
}
