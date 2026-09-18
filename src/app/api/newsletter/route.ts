import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'

// POST /api/newsletter — subscribe to newsletter
export async function POST(req: NextRequest) {
  try {
    ensureDatabaseReady()
    const body = await req.json()
    const { email, name, preferences } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'Valid email is required' }, { status: 400 })
    }

    const existing = await db.newsletterSubscriber.findUnique({ where: { email } })
    if (existing) {
      if (!existing.active) {
        // Reactivate
        await db.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            active: true,
            name: name ?? existing.name,
            preferences: preferences ? JSON.stringify(preferences) : existing.preferences,
          },
        })
        return NextResponse.json({ ok: true, message: 'Subscription reactivated', reactivated: true })
      }
      return NextResponse.json({ ok: true, message: 'Already subscribed', existing: true })
    }

    const subscriber = await db.newsletterSubscriber.create({
      data: {
        email,
        name: name ?? null,
        preferences: preferences ? JSON.stringify(preferences) : null,
        active: true,
      },
    })

    return NextResponse.json({ ok: true, message: 'Subscribed successfully', subscriberId: subscriber.id })
  } catch (e) {
    console.error('Newsletter subscription error:', e)
    return NextResponse.json({ ok: false, error: 'Failed to subscribe' }, { status: 500 })
  }
}

// DELETE /api/newsletter?email=... — unsubscribe
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ ok: false, error: 'Email required' }, { status: 400 })

  const existing = await db.newsletterSubscriber.findUnique({ where: { email } })
  if (!existing) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

  await db.newsletterSubscriber.update({
    where: { id: existing.id },
    data: { active: false },
  })
  return NextResponse.json({ ok: true, message: 'Unsubscribed' })
}
