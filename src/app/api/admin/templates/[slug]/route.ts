import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/admin/templates/[slug] — update template
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json()
  const tpl = await db.docTemplate.findUnique({ where: { slug } })
  if (!tpl) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

  const {
    title, titleUrdu, description, descriptionUrdu,
    category, categoryUrdu, fields, templateText, templateTextUrdu, previewText,
  } = body

  const updated = await db.docTemplate.update({
    where: { id: tpl.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(titleUrdu !== undefined ? { titleUrdu } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(descriptionUrdu !== undefined ? { descriptionUrdu } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(categoryUrdu !== undefined ? { categoryUrdu } : {}),
      ...(fields !== undefined ? { fieldsJson: JSON.stringify(fields) } : {}),
      ...(templateText !== undefined ? { templateText } : {}),
      ...(templateTextUrdu !== undefined ? { templateTextUrdu } : {}),
      ...(previewText !== undefined ? { previewText } : {}),
    },
  })
  return NextResponse.json({ ok: true, template: updated })
}

// DELETE /api/admin/templates/[slug] — delete template
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const tpl = await db.docTemplate.findUnique({ where: { slug } })
  if (!tpl) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  await db.docTemplate.delete({ where: { id: tpl.id } })
  return NextResponse.json({ ok: true })
}
