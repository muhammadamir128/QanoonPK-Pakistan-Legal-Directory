import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/recommendations?slug=...&limit=5
// Returns recommended laws based on: same category, shared tags, same jurisdiction, similar year range
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const limit = Math.min(10, Math.max(1, parseInt(searchParams.get('limit') ?? '5')))

  if (!slug) return NextResponse.json({ ok: false, error: 'slug is required' }, { status: 400 })

  const law = await db.law.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  })
  if (!law) return NextResponse.json({ ok: false, error: 'Law not found' }, { status: 404 })

  // Strategy: find laws that share the same category OR same tags OR same jurisdiction
  // Score each law and return top N

  const tagIds = law.tags.map((t) => t.tagId)
  const applicabilityTags = law.applicabilityTags ? JSON.parse(law.applicabilityTags as string) : []

  // Get candidate laws (same category, same jurisdiction, or sharing tags)
  const candidates = await db.law.findMany({
    where: {
      slug: { not: slug },
      OR: [
        { categoryId: law.categoryId },
        { jurisdiction: law.jurisdiction },
        ...(tagIds.length > 0 ? [{ tags: { some: { tagId: { in: tagIds } } } }] : []),
      ],
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
    take: 30, // Get a broader set then rank
  })

  // Score each candidate
  const scored = candidates.map((c) => {
    let score = 0
    // Same category: +3
    if (c.categoryId === law.categoryId) score += 3
    // Same jurisdiction: +1
    if (c.jurisdiction === law.jurisdiction) score += 1
    // Same status: +1
    if (c.status === law.status) score += 1
    // Year proximity: +2 if within 10 years, +1 if within 25 years
    const yearDiff = Math.abs(c.yearEnacted - law.yearEnacted)
    if (yearDiff <= 10) score += 2
    else if (yearDiff <= 25) score += 1
    // Shared tags: +2 per shared tag
    const cTagIds = c.tags.map((t) => t.tagId)
    const sharedTags = cTagIds.filter((id) => tagIds.includes(id))
    score += sharedTags.length * 2
    // Shared applicability tags: +1 per shared
    const cAppTags = c.applicabilityTags ? JSON.parse(c.applicabilityTags as string) : []
    const sharedApp = cAppTags.filter((tag: string) => applicabilityTags.includes(tag))
    score += sharedApp.length
    // Popularity bonus: +1 if viewCount > 5
    if (c.viewCount > 5) score += 1
    if (c.viewCount > 20) score += 1
    return { law: c, score }
  })

  // Sort by score descending, then by viewCount
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.law.viewCount - a.law.viewCount
  })

  const recommendations = scored.slice(0, limit).map(({ law: l, score }) => ({
    slug: l.slug,
    title: l.title,
    titleUrdu: l.titleUrdu,
    yearEnacted: l.yearEnacted,
    status: l.status,
    viewCount: l.viewCount,
    score,
    reason: getRecommendationReason(l, law),
    category: {
      name: l.category.name,
      nameUrdu: l.category.nameUrdu,
      slug: l.category.slug,
      color: l.category.color,
    },
  }))

  return NextResponse.json({
    items: recommendations,
    total: recommendations.length,
  })
}

function getRecommendationReason(
  candidate: { categoryId: string; jurisdiction: string; yearEnacted: number; tags: { tag: { name: string } }[] },
  source: { categoryId: string; jurisdiction: string; yearEnacted: number }
): { en: string; ur: string } {
  if (candidate.categoryId === source.categoryId) {
    return { en: 'Same category', ur: 'یکساں قسم' }
  }
  if (candidate.jurisdiction === source.jurisdiction) {
    return { en: 'Same jurisdiction', ur: 'یکساں عدلیہ' }
  }
  const yearDiff = Math.abs(candidate.yearEnacted - source.yearEnacted)
  if (yearDiff <= 10) {
    return { en: 'Similar era', ur: 'ملتے جلتے دور' }
  }
  if (candidate.tags.length > 0) {
    return { en: 'Shared topics', ur: 'مشترک موضوعات' }
  }
  return { en: 'Related', ur: 'متعلقہ' }
}
