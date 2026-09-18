import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { categories as fallbackCategories, laws as fallbackLaws } from '@/lib/seed-data'

// GET /api/categories — all categories with law counts
export async function GET() {
  try {
    ensureDatabaseReady()
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { laws: true } },
      },
    })

    if (categories && categories.length > 0) {
      return NextResponse.json({ items: categories })
    }
  } catch (error) {
    console.warn('[Categories API] Database query error, using fallback:', error)
  }

  // Graceful Fallback from seed-data
  const items = fallbackCategories.map((c) => {
    const count = fallbackLaws.filter((l) => l.categorySlug === c.slug).length
    return {
      id: `cat_${c.slug}`,
      name: c.name,
      nameUrdu: c.nameUrdu,
      slug: c.slug,
      icon: c.icon,
      color: c.color,
      description: c.description,
      descriptionUrdu: c.descriptionUrdu,
      parentId: null,
      _count: { laws: count },
    }
  })

  return NextResponse.json({ items })
}

// POST /api/categories — create category (admin)
export async function POST(req: NextRequest) {
  try {
    ensureDatabaseReady()
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
  } catch (error: any) {
    console.error('[Categories POST API Error]:', error)
    return NextResponse.json({ ok: false, error: error?.message || 'Failed to create category' }, { status: 500 })
  }
}
