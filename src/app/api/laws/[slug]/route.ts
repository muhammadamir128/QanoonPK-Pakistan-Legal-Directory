import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { categories as fallbackCategories, laws as fallbackLaws, lawTags as fallbackLawTags } from '@/lib/seed-data'

// GET /api/laws/[slug] — full law detail with sections + amendments + related laws
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    ensureDatabaseReady()
    const law = await db.law.findUnique({
      where: { slug },
      include: {
        category: true,
        sections: { orderBy: { orderIndex: 'asc' } },
        amendments: { orderBy: { amendmentYear: 'asc' } },
        tags: { include: { tag: true } },
      },
    })

    if (law) {
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
  } catch (error) {
    console.warn(`[Law Detail API] Database error for ${slug}, checking fallback:`, error)
  }

  // Graceful Fallback from seed data
  const fallback = fallbackLaws.find((l) => l.slug === slug)
  if (!fallback) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  }

  const cat = fallbackCategories.find((c) => c.slug === fallback.categorySlug)
  const tags = fallbackLawTags[fallback.slug] ?? []

  const related = fallbackLaws
    .filter((l) => l.categorySlug === fallback.categorySlug && l.slug !== fallback.slug)
    .slice(0, 4)
    .map((l) => ({
      id: `law_${l.slug}`,
      title: l.title,
      titleUrdu: l.titleUrdu,
      slug: l.slug,
      yearEnacted: l.yearEnacted,
      status: l.status,
      viewCount: 450,
    }))

  return NextResponse.json({
    id: `law_${fallback.slug}`,
    title: fallback.title,
    titleUrdu: fallback.titleUrdu,
    slug: fallback.slug,
    categoryId: `cat_${fallback.categorySlug}`,
    yearEnacted: fallback.yearEnacted,
    jurisdiction: fallback.jurisdiction,
    status: fallback.status,
    summary: fallback.summary,
    summaryUrdu: fallback.summaryUrdu,
    gazetteReference: fallback.gazetteReference || null,
    promulgatingAuthority: fallback.promulgatingAuthority || null,
    applicabilityTags: fallback.applicabilityTags || [],
    viewCount: 500,
    category: {
      id: `cat_${fallback.categorySlug}`,
      name: cat?.name || 'General',
      nameUrdu: cat?.nameUrdu || '',
      slug: cat?.slug || fallback.categorySlug,
      color: cat?.color || '#0d9488',
    },
    sections: (fallback.sections || []).map((s, idx) => ({
      id: `sec_${fallback.slug}_${idx}`,
      sectionNumber: s.sectionNumber,
      title: s.title || null,
      content: s.content,
      contentUrdu: s.contentUrdu || null,
      orderIndex: idx,
    })),
    amendments: (fallback.amendments || []).map((a, idx) => ({
      id: `amd_${fallback.slug}_${idx}`,
      amendmentYear: a.amendmentYear,
      amendmentTitle: a.amendmentTitle,
      description: a.description,
      gazetteReference: a.gazetteReference || null,
      effectiveDate: null,
    })),
    tags: tags.map((t) => ({
      tag: { id: `tag_${t}`, name: t },
    })),
    related,
  })
}

// PATCH /api/laws/[slug] — update law (admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    ensureDatabaseReady()
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
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Update failed' }, { status: 500 })
  }
}

// DELETE /api/laws/[slug] — delete law (admin)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    ensureDatabaseReady()
    const { slug } = await params
    const law = await db.law.findUnique({ where: { slug } })
    if (!law) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
    await db.law.delete({ where: { id: law.id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Delete failed' }, { status: 500 })
  }
}
