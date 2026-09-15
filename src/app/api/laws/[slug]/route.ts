import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/laws/[slug] — full law detail with sections + amendments + related laws
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const law = await db.law.findUnique({
    where: { slug },
    include: {
      category: true,
      sections: { orderBy: { orderIndex: 'asc' } },
      amendments: { orderBy: { amendmentYear: 'asc' } },
      tags: { include: { tag: true } },
    },
  })
  if (!law) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

  // Increment view count (fire and forget)
  db.law.update({ where: { id: law.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  // Related laws: same category, excluding self
  const related = await db.law.findMany({
    where: {
      categoryId: law.categoryId,
      slug: { not: law.slug },
    },
    take: 4,
    orderBy: { viewCount: 'desc' },
  })

  return NextResponse.json({
    ...law,
    applicabilityTags: law.applicabilityTags ? JSON.parse(law.applicabilityTags as string) : [],
    related,
  })
}

// PATCH /api/laws/[slug] — update law (admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json()
  const law = await db.law.findUnique({ where: { slug } })
  if (!law) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

  const { title, titleUrdu, categoryId, yearEnacted, jurisdiction, status, summary, summaryUrdu, gazetteReference, promulgatingAuthority, applicabilityTags } = body
  const updated = await db.law.update({
    where: { id: law.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(titleUrdu !== undefined ? { titleUrdu } : {}),
      ...(categoryId !== undefined ? { categoryId } : {}),
      ...(yearEnacted !== undefined ? { yearEnacted: parseInt(yearEnacted) } : {}),
      ...(jurisdiction !== undefined ? { jurisdiction } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(summary !== undefined ? { summary } : {}),
      ...(summaryUrdu !== undefined ? { summaryUrdu } : {}),
      ...(gazetteReference !== undefined ? { gazetteReference } : {}),
      ...(promulgatingAuthority !== undefined ? { promulgatingAuthority } : {}),
      ...(applicabilityTags !== undefined ? { applicabilityTags: JSON.stringify(applicabilityTags) } : {}),
    },
  })
  return NextResponse.json({ ok: true, law: updated })
}

// DELETE /api/laws/[slug] — delete law (admin)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const law = await db.law.findUnique({ where: { slug } })
  if (!law) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  await db.law.delete({ where: { id: law.id } })
  return NextResponse.json({ ok: true })
}
