import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/admin/subscribers — list all subscribers
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // 'active', 'inactive', or null (all)

    const where: any = {}
    if (status === 'active') where.active = true
    if (status === 'inactive') where.active = false

    const subscribers = await db.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ ok: true, subscribers, total: subscribers.length })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// POST /api/admin/subscribers — manually create a subscriber
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { email, name, preferences, active = true } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'Valid email is required' }, { status: 400 })
    }

    const existing = await db.newsletterSubscriber.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Subscriber with this email already exists' }, { status: 409 })
    }

    const subscriber = await db.newsletterSubscriber.create({
      data: {
        email,
        name: name || null,
        preferences: preferences ? JSON.stringify(preferences) : null,
        active: Boolean(active),
      },
    })

    return NextResponse.json({ ok: true, subscriber })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/subscribers — toggle active status or update details
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { id, active, name } = body

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Subscriber id is required' }, { status: 400 })
    }

    const updated = await db.newsletterSubscriber.update({
      where: { id },
      data: {
        ...(active !== undefined ? { active: Boolean(active) } : {}),
        ...(name !== undefined ? { name } : {}),
      },
    })

    return NextResponse.json({ ok: true, subscriber: updated })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin/subscribers — remove subscriber
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Subscriber id is required' }, { status: 400 })
    }

    await db.newsletterSubscriber.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true, message: 'Subscriber deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
