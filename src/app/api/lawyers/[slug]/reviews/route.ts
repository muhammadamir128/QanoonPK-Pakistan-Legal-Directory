import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/lawyers/[slug]/reviews — submit a review
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json()
  const { authorName, rating, comment } = body

  if (!authorName || !rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { ok: false, error: 'Name and rating (1-5) are required' },
      { status: 400 }
    )
  }

  const lawyer = await db.lawyer.findUnique({ where: { slug } })
  if (!lawyer) return NextResponse.json({ ok: false, error: 'Lawyer not found' }, { status: 404 })

  // Create review
  const review = await db.lawyerReview.create({
    data: {
      lawyerId: lawyer.id,
      authorName: String(authorName).slice(0, 100),
      rating: parseInt(rating),
      comment: comment ? String(comment).slice(0, 1000) : null,
    },
  })

  // Update lawyer rating + review count (incremental update)
  const newCount = lawyer.reviewCount + 1
  const newRating = (lawyer.rating * lawyer.reviewCount + parseInt(rating)) / newCount
  await db.lawyer.update({
    where: { id: lawyer.id },
    data: {
      reviewCount: newCount,
      rating: Math.round(newRating * 10) / 10,
    },
  })

  return NextResponse.json({ ok: true, review })
}
