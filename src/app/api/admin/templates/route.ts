import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/templates — create template
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title, titleUrdu, slug, description, descriptionUrdu,
      category, categoryUrdu, fields, templateText, templateTextUrdu, previewText,
    } = body

    if (!title || !slug || !description || !category || !templateText) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: title, slug, description, category, templateText' },
        { status: 400 }
      )
    }

    const tpl = await db.docTemplate.create({
      data: {
        title,
        titleUrdu: titleUrdu ?? null,
        slug,
        description,
        descriptionUrdu: descriptionUrdu ?? description,
        category,
        categoryUrdu: categoryUrdu ?? category,
        fieldsJson: JSON.stringify(fields ?? []),
        templateText,
        templateTextUrdu: templateTextUrdu ?? templateText,
        previewText: previewText ?? null,
      },
    })
    return NextResponse.json({ ok: true, template: tpl })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
