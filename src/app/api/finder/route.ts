import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/finder/questions — questionnaire tree
export async function GET() {
  const qs = await db.finderQuestion.findMany({
    orderBy: { orderIndex: 'asc' },
  })
  return NextResponse.json({
    items: qs.map((q) => ({
      ...q,
      options: JSON.parse(q.optionsJson),
    })),
  })
}

// POST /api/finder/result — submit selected law slugs, return matching laws
export async function POST(req: NextRequest) {
  const body = await req.json()
  const slugs: string[] = body.slugs ?? []
  if (!slugs.length) return NextResponse.json({ items: [], total: 0 })

  const laws = await db.law.findMany({
    where: { slug: { in: slugs } },
    include: { category: true },
  })
  // Preserve order of slugs
  const ordered = slugs.map((s) => laws.find((l) => l.slug === s)).filter(Boolean)
  return NextResponse.json({
    items: ordered.map((l) => ({
      ...l,
      applicabilityTags: l!.applicabilityTags ? JSON.parse(l!.applicabilityTags as string) : [],
    })),
    total: ordered.length,
  })
}
