import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { legalAidOrgsData } from '@/lib/new-features-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // "ngo" or "government" or undefined for all

  try {
    ensureDatabaseReady()
    const where: Record<string, unknown> = {}
    if (type && type !== 'all') {
      where.type = type
    }

    const orgs = await db.legalAidOrg.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    })

    if (orgs && orgs.length > 0) {
      const formatted = orgs.map((o) => ({
        ...o,
        provinces: typeof o.provinces === 'string' ? JSON.parse(o.provinces) : o.provinces,
        specialtiesEn: typeof o.specialtiesEn === 'string' ? JSON.parse(o.specialtiesEn) : o.specialtiesEn,
        specialtiesUr: typeof o.specialtiesUr === 'string' ? JSON.parse(o.specialtiesUr) : o.specialtiesUr,
      }))
      return NextResponse.json({ items: formatted, total: formatted.length })
    }

    const fallbackFormatted = legalAidOrgsData.map((o, idx) => ({
      ...o,
      id: `fallback-${idx}`,
      provinces: JSON.parse(o.provinces),
      specialtiesEn: JSON.parse(o.specialtiesEn),
      specialtiesUr: JSON.parse(o.specialtiesUr),
    }))
    return NextResponse.json({ items: fallbackFormatted, total: fallbackFormatted.length })
  } catch (error) {
    console.error('Error fetching legal aid orgs:', error)
    const fallbackFormatted = legalAidOrgsData.map((o, idx) => ({
      ...o,
      id: `fallback-${idx}`,
      provinces: JSON.parse(o.provinces),
      specialtiesEn: JSON.parse(o.specialtiesEn),
      specialtiesUr: JSON.parse(o.specialtiesUr),
    }))
    return NextResponse.json({ items: fallbackFormatted, total: fallbackFormatted.length })
  }
}
