import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/admin/sections?lawId=...
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

    const sections = await db.section.findMany({
      where: { lawId },
      orderBy: { orderIndex: 'asc' },
    })

    return NextResponse.json({ ok: true, sections })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// POST /api/admin/sections — add section
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { lawId, sectionNumber, title, content, contentUrdu, orderIndex = 0 } = body

    if (!lawId || !sectionNumber || !content) {
      return NextResponse.json({ ok: false, error: 'lawId, sectionNumber, and content are required' }, { status: 400 })
    }

    const section = await db.section.create({
      data: {
        lawId,
        sectionNumber: String(sectionNumber).trim(),
        title: title ? String(title).trim() : null,
        content: String(content).trim(),
        contentUrdu: contentUrdu ? String(contentUrdu).trim() : null,
        orderIndex: Number(orderIndex) || 0,
      },
    })

    return NextResponse.json({ ok: true, section })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/sections — update section
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { id, sectionNumber, title, content, contentUrdu, orderIndex } = body

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Section id is required' }, { status: 400 })
    }

    const updated = await db.section.update({
      where: { id },
      data: {
        ...(sectionNumber !== undefined ? { sectionNumber: String(sectionNumber).trim() } : {}),
        ...(title !== undefined ? { title: title ? String(title).trim() : null } : {}),
        ...(content !== undefined ? { content: String(content).trim() } : {}),
        ...(contentUrdu !== undefined ? { contentUrdu: contentUrdu ? String(contentUrdu).trim() : null } : {}),
        ...(orderIndex !== undefined ? { orderIndex: Number(orderIndex) } : {}),
      },
    })

    return NextResponse.json({ ok: true, section: updated })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin/sections — delete section
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Section id is required' }, { status: 400 })
    }

    await db.section.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true, message: 'Section deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
