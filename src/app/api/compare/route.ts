import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/compare?slug1=...&slug2=...
// Returns full details of two laws for side-by-side comparison
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug1 = searchParams.get('slug1')
  const slug2 = searchParams.get('slug2')

  if (!slug1 || !slug2) {
    return NextResponse.json(
      { ok: false, error: 'Both slug1 and slug2 parameters are required' },
      { status: 400 }
    )
  }

  const [law1, law2] = await Promise.all([
    db.law.findUnique({
      where: { slug: slug1 },
      include: {
        category: true,
        sections: { orderBy: { orderIndex: 'asc' } },
        amendments: { orderBy: { amendmentYear: 'asc' } },
      },
    }),
    db.law.findUnique({
      where: { slug: slug2 },
      include: {
        category: true,
        sections: { orderBy: { orderIndex: 'asc' } },
        amendments: { orderBy: { amendmentYear: 'asc' } },
      },
    }),
  ])

  if (!law1) return NextResponse.json({ ok: false, error: `Law "${slug1}" not found` }, { status: 404 })
  if (!law2) return NextResponse.json({ ok: false, error: `Law "${slug2}" not found` }, { status: 404 })

  const formatLaw = (l: typeof law1) => ({
    ...l,
    applicabilityTags: l!.applicabilityTags ? JSON.parse(l!.applicabilityTags as string) : [],
  })

  return NextResponse.json({
    ok: true,
    law1: formatLaw(law1),
    law2: formatLaw(law2),
  })
}
