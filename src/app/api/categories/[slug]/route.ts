import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { categories as fallbackCategories, laws as fallbackLaws } from '@/lib/seed-data'

// GET /api/categories/[slug]/laws — laws under a category
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '50'))
  const sort = searchParams.get('sort') ?? 'popular'

  try {
    ensureDatabaseReady()
    const category = await db.category.findUnique({ where: { slug } })
    if (category) {
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
  } catch (error) {
    console.warn(`[Category Detail API] Database error for ${slug}, checking fallback:`, error)
  }

  // Fallback from seed data
  const fallbackCat = fallbackCategories.find((c) => c.slug === slug)
  if (!fallbackCat) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  }

  let laws = fallbackLaws.filter((l) => l.categorySlug === slug)
  if (sort === 'newest') laws.sort((a, b) => b.yearEnacted - a.yearEnacted)
  else if (sort === 'oldest') laws.sort((a, b) => a.yearEnacted - b.yearEnacted)
  else if (sort === 'az') laws.sort((a, b) => a.title.localeCompare(b.title))

  const items = laws.slice(0, limit).map((l, i) => ({
    id: `law_${l.slug}`,
    title: l.title,
    titleUrdu: l.titleUrdu,
    slug: l.slug,
    categoryId: `cat_${slug}`,
    yearEnacted: l.yearEnacted,
    jurisdiction: l.jurisdiction,
    status: l.status,
    summary: l.summary,
    summaryUrdu: l.summaryUrdu,
    gazetteReference: l.gazetteReference || null,
    promulgatingAuthority: l.promulgatingAuthority || null,
    applicabilityTags: l.applicabilityTags || [],
    viewCount: 1000 - i * 15,
  }))

  return NextResponse.json({
    category: {
      id: `cat_${fallbackCat.slug}`,
      name: fallbackCat.name,
      nameUrdu: fallbackCat.nameUrdu,
      slug: fallbackCat.slug,
      icon: fallbackCat.icon,
      color: fallbackCat.color,
      description: fallbackCat.description,
      descriptionUrdu: fallbackCat.descriptionUrdu,
      _count: { laws: laws.length },
    },
    items,
  })
}

// DELETE /api/categories/[slug]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    ensureDatabaseReady()
    const { slug } = await params
    const category = await db.category.findUnique({
      where: { slug },
      include: { _count: { select: { laws: true } } },
    })
    if (!category) return NextResponse.json({ ok: false, error: 'Category not found' }, { status: 404 })

    if (category._count.laws > 0) {
      return NextResponse.json({
        ok: false,
        error: `Cannot delete category because it has ${category._count.laws} associated laws. Reassign or delete the laws first.`
      }, { status: 400 })
    }

    await db.category.delete({ where: { slug } })
    return NextResponse.json({ ok: true, message: 'Category deleted' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Delete failed' }, { status: 500 })
  }
}
