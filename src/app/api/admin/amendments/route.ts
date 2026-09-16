import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/admin/amendments?lawId=...
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const lawId = searchParams.get('lawId')

    if (!lawId) {
      return NextResponse.json({ ok: false, error: 'lawId is required' }, { status: 400 })
    }

    const amendments = await db.amendment.findMany({
      where: { lawId },
      orderBy: { amendmentYear: 'asc' },
    })

    return NextResponse.json({ ok: true, amendments })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// POST /api/admin/amendments — add amendment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { lawId, amendmentYear, amendmentTitle, gazetteReference, description, effectiveDate } = body

    if (!lawId || !amendmentYear || !amendmentTitle) {
      return NextResponse.json({ ok: false, error: 'lawId, amendmentYear, and amendmentTitle are required' }, { status: 400 })
    }

    const amendment = await db.amendment.create({
      data: {
        lawId,
        amendmentYear: Number(amendmentYear),
        amendmentTitle: String(amendmentTitle).trim(),
        gazetteReference: gazetteReference ? String(gazetteReference).trim() : null,
        description: description ? String(description).trim() : null,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
      },
    })

    return NextResponse.json({ ok: true, amendment })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/amendments — update amendment
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { id, amendmentYear, amendmentTitle, gazetteReference, description, effectiveDate } = body

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Amendment id is required' }, { status: 400 })
    }

    const updated = await db.amendment.update({
      where: { id },
      data: {
        ...(amendmentYear !== undefined ? { amendmentYear: Number(amendmentYear) } : {}),
        ...(amendmentTitle !== undefined ? { amendmentTitle: String(amendmentTitle).trim() } : {}),
        ...(gazetteReference !== undefined ? { gazetteReference: gazetteReference ? String(gazetteReference).trim() : null } : {}),
        ...(description !== undefined ? { description: description ? String(description).trim() : null } : {}),
        ...(effectiveDate !== undefined ? { effectiveDate: effectiveDate ? new Date(effectiveDate) : null } : {}),
      },
    })

    return NextResponse.json({ ok: true, amendment: updated })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin/amendments — delete amendment
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Amendment id is required' }, { status: 400 })
    }

    await db.amendment.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true, message: 'Amendment deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
