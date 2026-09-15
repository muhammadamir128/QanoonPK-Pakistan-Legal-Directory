import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/admin/users — fetch all users for admin management
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 })
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { bookmarks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ ok: true, users })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/users — change user role (e.g. user, editor, admin)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 })
    }

    const body = await req.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json({ ok: false, error: 'userId and role are required' }, { status: 400 })
    }

    if (!['user', 'editor', 'reviewer', 'admin'].includes(role)) {
      return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 })
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json({ ok: true, user: updated })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
