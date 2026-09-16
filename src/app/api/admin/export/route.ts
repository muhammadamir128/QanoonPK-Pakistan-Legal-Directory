import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""')
  return `"${str}"`
}

// GET /api/admin/export?type=laws|lawyers|users|subscribers|backup
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'laws'

    const dateStr = new Date().toISOString().slice(0, 10)

    if (type === 'laws') {
      const laws = await db.law.findMany({
        include: { category: true },
        orderBy: { yearEnacted: 'desc' },
      })

      const headers = ['ID', 'Slug', 'Title', 'Title (Urdu)', 'Category', 'Year', 'Jurisdiction', 'Status', 'Views']
      const rows = laws.map((l) => [
        escapeCsv(l.id),
        escapeCsv(l.slug),
        escapeCsv(l.title),
        escapeCsv(l.titleUrdu || ''),
        escapeCsv(l.category?.name || ''),
        escapeCsv(l.yearEnacted),
        escapeCsv(l.jurisdiction),
        escapeCsv(l.status),
        escapeCsv(l.viewCount),
      ])

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="qanoonpk-laws-${dateStr}.csv"`,
        },
      })
    }

    if (type === 'lawyers') {
      const lawyers = await db.lawyer.findMany({
        orderBy: { name: 'asc' },
      })

      const headers = ['ID', 'Name', 'City', 'Province', 'Rating', 'Reviews', 'Verified', 'Email', 'Phone', 'Views']
      const rows = lawyers.map((l) => [
        escapeCsv(l.id),
        escapeCsv(l.name),
        escapeCsv(l.city),
        escapeCsv(l.province),
        escapeCsv(l.rating),
        escapeCsv(l.reviewCount),
        escapeCsv(l.verified ? 'Yes' : 'No'),
        escapeCsv(l.email || ''),
        escapeCsv(l.phone || ''),
        escapeCsv(l.viewCount),
      ])

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="qanoonpk-lawyers-${dateStr}.csv"`,
        },
      })
    }

    if (type === 'users') {
      const users = await db.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      })

      const headers = ['ID', 'Name', 'Email', 'Role', 'Created At']
      const rows = users.map((u) => [
        escapeCsv(u.id),
        escapeCsv(u.name || ''),
        escapeCsv(u.email),
        escapeCsv(u.role),
        escapeCsv(new Date(u.createdAt).toISOString()),
      ])

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="qanoonpk-users-${dateStr}.csv"`,
        },
      })
    }

    if (type === 'subscribers') {
      const subscribers = await db.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
      })

      const headers = ['ID', 'Email', 'Name', 'Status', 'Subscribed At']
      const rows = subscribers.map((s) => [
        escapeCsv(s.id),
        escapeCsv(s.email),
        escapeCsv(s.name || ''),
        escapeCsv(s.active ? 'Active' : 'Inactive'),
        escapeCsv(new Date(s.createdAt).toISOString()),
      ])

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="qanoonpk-subscribers-${dateStr}.csv"`,
        },
      })
    }

    if (type === 'backup') {
      const [categories, laws, lawyers, templates, users, subscribers, questions] = await Promise.all([
        db.category.findMany(),
        db.law.findMany({ include: { sections: true, amendments: true } }),
        db.lawyer.findMany({ include: { reviews: true } }),
        db.docTemplate.findMany(),
        db.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } }),
        db.newsletterSubscriber.findMany(),
        db.finderQuestion.findMany(),
      ])

      const dump = {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        system: 'QanoonPK Pakistan Legal Directory',
        data: {
          categories,
          laws,
          lawyers,
          templates,
          users,
          subscribers,
          questions,
        },
      }

      return new NextResponse(JSON.stringify(dump, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="qanoonpk-backup-${dateStr}.json"`,
        },
      })
    }

    return NextResponse.json({ ok: false, error: 'Invalid export type' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
