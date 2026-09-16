import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/admin/reviews — fetch all lawyer reviews across the directory
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const reviews = await db.lawyerReview.findMany({
      include: {
        lawyer: {
          select: {
            id: true,
            name: true,
            nameUrdu: true,
            slug: true,
            city: true,
            rating: true,
            reviewCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ ok: true, reviews, total: reviews.length })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin/reviews — delete a review and recalculate lawyer rating
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Review id is required' }, { status: 400 })
    }

    const review = await db.lawyerReview.findUnique({
      where: { id },
    })

    if (!review) {
      return NextResponse.json({ ok: false, error: 'Review not found' }, { status: 404 })
    }

    const lawyerId = review.lawyerId

    // Delete review
    await db.lawyerReview.delete({ where: { id } })

    // Recalculate lawyer rating & review count
    const remainingReviews = await db.lawyerReview.findMany({
      where: { lawyerId },
    })
    const newCount = remainingReviews.length
    const newRating = newCount > 0
      ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / newCount
      : 0

    await db.lawyer.update({
      where: { id: lawyerId },
      data: {
        reviewCount: newCount,
        rating: Math.round(newRating * 10) / 10,
      },
    })

    return NextResponse.json({ ok: true, message: 'Review deleted and lawyer stats updated' })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
