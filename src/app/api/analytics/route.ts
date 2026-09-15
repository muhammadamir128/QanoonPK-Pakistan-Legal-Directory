import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/analytics — search analytics dashboard data
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '30')

  // Total searches
  const totalSearches = await db.searchLog.count()

  // Searches with zero results (content gap)
  const zeroResultCount = await db.searchLog.count({ where: { resultsCount: 0 } })

  // Top search queries (with counts)
  const topSearches = await db.searchLog.groupBy({
    by: ['query'],
    _count: { query: true },
    orderBy: { _count: { query: 'desc' } },
    take: 20,
  })

  // Top zero-result queries (content gaps)
  const zeroResultQueries = await db.searchLog.groupBy({
    by: ['query'],
    where: { resultsCount: 0 },
    _count: { query: true },
    orderBy: { _count: { query: 'desc' } },
    take: 20,
  })

  // Most viewed laws (top 10)
  const topLaws = await db.law.findMany({
    orderBy: { viewCount: 'desc' },
    take: 10,
    select: {
      id: true,
      slug: true,
      title: true,
      titleUrdu: true,
      yearEnacted: true,
      viewCount: true,
      category: { select: { name: true, slug: true, color: true } },
    },
  })

  // Most viewed lawyers
  const topLawyers = await db.lawyer.findMany({
    orderBy: { viewCount: 'desc' },
    take: 5,
    select: {
      id: true,
      slug: true,
      name: true,
      nameUrdu: true,
      city: true,
      viewCount: true,
      rating: true,
    },
  })

  // Most downloaded templates
  const topTemplates = await db.docTemplate.findMany({
    orderBy: { downloads: 'desc' },
    take: 5,
    select: {
      id: true,
      slug: true,
      title: true,
      titleUrdu: true,
      downloads: true,
      category: true,
    },
  })

  // Searches per day (last N days)
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - days)
  const recentSearches = await db.searchLog.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true, resultsCount: true },
    orderBy: { createdAt: 'asc' },
  })

  // Group by day
  const searchesByDay: Array<{ date: string; count: number; zeroResults: number }> = []
  const dayMap = new Map<string, { count: number; zeroResults: number }>()
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    dayMap.set(key, { count: 0, zeroResults: 0 })
  }
  recentSearches.forEach((s) => {
    const key = s.createdAt.toISOString().slice(0, 10)
    const entry = dayMap.get(key)
    if (entry) {
      entry.count++
      if (s.resultsCount === 0) entry.zeroResults++
    }
  })
  dayMap.forEach((value, key) => {
    searchesByDay.push({ date: key, ...value })
  })

  return NextResponse.json({
    totalSearches,
    zeroResultCount,
    zeroResultRate: totalSearches > 0 ? Math.round((zeroResultCount / totalSearches) * 100) : 0,
    topSearches: topSearches.map((s) => ({ query: s.query, count: s._count.query })),
    zeroResultQueries: zeroResultQueries.map((s) => ({ query: s.query, count: s._count.query })),
    topLaws: topLaws.map((l) => ({
      slug: l.slug,
      title: l.title,
      titleUrdu: l.titleUrdu,
      yearEnacted: l.yearEnacted,
      viewCount: l.viewCount,
      category: { name: l.category.name, slug: l.category.slug, color: l.category.color },
    })),
    topLawyers: topLawyers.map((l) => ({
      slug: l.slug,
      name: l.name,
      nameUrdu: l.nameUrdu,
      city: l.city,
      viewCount: l.viewCount,
      rating: l.rating,
    })),
    topTemplates: topTemplates.map((t) => ({
      slug: t.slug,
      title: t.title,
      titleUrdu: t.titleUrdu,
      downloads: t.downloads,
      category: t.category,
    })),
    searchesByDay,
    days,
  })
}
