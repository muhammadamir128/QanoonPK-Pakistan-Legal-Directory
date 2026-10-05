import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { legalUpdatesData } from '@/lib/new-features-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const jurisdiction = searchParams.get('jurisdiction')
  const year = searchParams.get('year')

  try {
    ensureDatabaseReady()
    const where: Record<string, unknown> = {}

    if (jurisdiction && jurisdiction !== 'all') {
      where.jurisdiction = jurisdiction
    }

    if (year && year !== 'all') {
      where.year = parseInt(year)
    }

    const updates = await db.legalUpdate.findMany({
      where,
      orderBy: { year: 'desc' },
    })

    if (updates && updates.length > 0) {
      const formatted = updates.map((u) => ({
        ...u,
        keyChangesEn: typeof u.keyChangesEn === 'string' ? JSON.parse(u.keyChangesEn) : u.keyChangesEn,
        keyChangesUr: typeof u.keyChangesUr === 'string' ? JSON.parse(u.keyChangesUr) : u.keyChangesUr,
      }))
      return NextResponse.json({ items: formatted, total: formatted.length })
    }

    const fallbackFormatted = legalUpdatesData.map((u) => ({
      ...u,
      id: u.slug,
      keyChangesEn: JSON.parse(u.keyChangesEn),
      keyChangesUr: JSON.parse(u.keyChangesUr),
    }))
    return NextResponse.json({ items: fallbackFormatted, total: fallbackFormatted.length })
  } catch (error) {
    console.error('Error fetching legal updates:', error)
    const fallbackFormatted = legalUpdatesData.map((u) => ({
      ...u,
      id: u.slug,
      keyChangesEn: JSON.parse(u.keyChangesEn),
      keyChangesUr: JSON.parse(u.keyChangesUr),
    }))
    return NextResponse.json({ items: fallbackFormatted, total: fallbackFormatted.length })
  }
}
