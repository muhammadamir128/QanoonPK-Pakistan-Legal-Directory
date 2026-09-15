import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/templates/[slug] — full template detail
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const tpl = await db.docTemplate.findUnique({ where: { slug } })
  if (!tpl) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

  // Increment downloads counter (as a "view count" proxy)
  db.docTemplate.update({ where: { id: tpl.id }, data: { downloads: { increment: 1 } } }).catch(() => {})

  // Related templates (same category)
  const related = await db.docTemplate.findMany({
    where: {
      category: tpl.category,
      slug: { not: tpl.slug },
    },
    take: 3,
  })

  return NextResponse.json({
    ...tpl,
    fields: JSON.parse(tpl.fieldsJson as string),
    related: related.map((r) => ({
      ...r,
      fields: JSON.parse(r.fieldsJson as string),
    })),
  })
}
