import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/admin/finder — list all finder questions
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const questions = await db.finderQuestion.findMany({
      orderBy: { orderIndex: 'asc' },
    })

    const items = questions.map((q) => {
      let options = []
      try {
        options = JSON.parse(q.optionsJson)
      } catch {}
      return { ...q, options }
    })

    return NextResponse.json({ ok: true, questions: items, total: items.length })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// POST /api/admin/finder — create new question
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { question, questionUrdu, options, orderIndex = 0 } = body

    if (!question) {
      return NextResponse.json({ ok: false, error: 'Question text is required' }, { status: 400 })
    }

    const created = await db.finderQuestion.create({
      data: {
        question,
        questionUrdu: questionUrdu || null,
        optionsJson: typeof options === 'string' ? options : JSON.stringify(options || []),
        orderIndex: Number(orderIndex) || 0,
      },
    })

    return NextResponse.json({ ok: true, question: created })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/finder — update question
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { id, question, questionUrdu, options, orderIndex } = body

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Question ID is required' }, { status: 400 })
    }

    const updated = await db.finderQuestion.update({
      where: { id },
      data: {
        ...(question !== undefined ? { question } : {}),
        ...(questionUrdu !== undefined ? { questionUrdu } : {}),
        ...(options !== undefined
          ? { optionsJson: typeof options === 'string' ? options : JSON.stringify(options) }
          : {}),
        ...(orderIndex !== undefined ? { orderIndex: Number(orderIndex) } : {}),
      },
    })

    return NextResponse.json({ ok: true, question: updated })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin/finder — delete question
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Question ID is required' }, { status: 400 })
    }

    await db.finderQuestion.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true, message: 'Question deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
