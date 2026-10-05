import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { courtPortalsData } from '@/lib/new-features-data'

export async function GET(_req: NextRequest) {
  try {
    ensureDatabaseReady()
    const portals = await db.courtPortal.findMany({
      orderBy: { orderIndex: 'asc' },
    })

    if (portals && portals.length > 0) {
      const formatted = portals.map((p) => ({
        ...p,
        featuresEn: typeof p.featuresEn === 'string' ? JSON.parse(p.featuresEn) : p.featuresEn,
        featuresUr: typeof p.featuresUr === 'string' ? JSON.parse(p.featuresUr) : p.featuresUr,
      }))
      return NextResponse.json({ items: formatted, total: formatted.length })
    }

    const fallbackFormatted = courtPortalsData.map((p) => ({
      ...p,
      id: p.slug,
      featuresEn: JSON.parse(p.featuresEn),
      featuresUr: JSON.parse(p.featuresUr),
    }))
    return NextResponse.json({ items: fallbackFormatted, total: fallbackFormatted.length })
  } catch (error) {
    console.error('Error fetching court portals:', error)
    const fallbackFormatted = courtPortalsData.map((p) => ({
      ...p,
      id: p.slug,
      featuresEn: JSON.parse(p.featuresEn),
      featuresUr: JSON.parse(p.featuresUr),
    }))
    return NextResponse.json({ items: fallbackFormatted, total: fallbackFormatted.length })
  }
}
