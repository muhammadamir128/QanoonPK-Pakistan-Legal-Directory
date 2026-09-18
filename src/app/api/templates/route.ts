import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { docTemplates as fallbackTemplates } from '@/lib/lawyers-templates-data'

// GET /api/templates?category=...&q=...&page=1&limit=20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? undefined
  const q = searchParams.get('q') ?? undefined
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const skip = (page - 1) * limit

  try {
    ensureDatabaseReady()
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

    if (total > 0) {
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
  } catch (error) {
    console.warn('[Templates API] Database error, falling back to static templates:', error)
  }

  // Fallback from lawyers-templates-data
  let filtered = [...fallbackTemplates]
  if (category && category !== 'all') filtered = filtered.filter((t) => t.category === category)
  if (q) {
    const lower = q.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        (t.titleUrdu && t.titleUrdu.includes(lower)) ||
        (t.description && t.description.toLowerCase().includes(lower))
    )
  }

  const total = filtered.length
  const paged = filtered.slice(skip, skip + limit)

  return NextResponse.json({
    items: paged.map((t) => ({
      id: `tpl_${t.slug}`,
      title: t.title,
      titleUrdu: t.titleUrdu || null,
      slug: t.slug,
      description: t.description,
      descriptionUrdu: t.descriptionUrdu || null,
      category: t.category,
      categoryUrdu: t.categoryUrdu || null,
      fields: t.fields || [],
      downloads: 45,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}
