import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/stats — dashboard-style stats for homepage
export async function GET(_req: NextRequest) {
  const [lawCount, categoryCount, sectionCount, amendmentCount, lawyerCount, templateCount, trending, topSearches, zeroResultSearches] = await Promise.all([
    db.law.count(),
    db.category.count(),
    db.section.count(),
    db.amendment.count(),
    db.lawyer.count(),
    db.docTemplate.count(),
    db.law.findMany({
      orderBy: { viewCount: 'desc' },
      take: 6,
      include: { category: true },
    }),
    db.searchLog.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: 8,
    }),
    db.searchLog.findMany({
      where: { resultsCount: 0 },
      take: 20,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // Featured lawyers (top 4)
  const featuredLawyers = await db.lawyer.findMany({
    where: { verified: true },
    orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
    take: 4,
  })

  // Recently added laws (latest createdAt)
  const recentlyAdded = await db.law.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: { category: true },
  })

  // Recently updated laws (latest updatedAt, excluding recently added)
  const recentlyUpdated = await db.law.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 6,
    include: { category: true },
  })

  // Popular this week (based on viewCount — proxy for recent activity since we don't track view timestamps)
  // Sort by viewCount desc, take top 6, distinct from trending (which is also viewCount but we want this for a different placement)
  const popularThisWeek = await db.law.findMany({
    orderBy: { viewCount: 'desc' },
    take: 6,
    skip: 6, // skip first 6 since they're in "trending"
    include: { category: true },
  })

  // Law of the Day — deterministic daily pick based on day of year
  const allLawCount = await db.law.count()
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const lawOfDayIndex = dayOfYear % allLawCount
  const lawOfDay = await db.law.findFirst({
    skip: lawOfDayIndex,
    include: { category: true, sections: true },
    orderBy: { id: 'asc' },
  })

  return NextResponse.json({
    lawCount,
    categoryCount,
    sectionCount,
    amendmentCount,
    lawyerCount,
    templateCount,
    trending: trending.map((l) => ({
      slug: l.slug,
      title: l.title,
      titleUrdu: l.titleUrdu,
      yearEnacted: l.yearEnacted,
      status: l.status,
      viewCount: l.viewCount,
      category: { name: l.category.name, nameUrdu: l.category.nameUrdu, slug: l.category.slug, color: l.category.color },
    })),
    topSearches: topSearches.map((s) => ({ query: s.query, count: s._count.query })),
    zeroResultSearches: zeroResultSearches.map((s) => s.query),
    featuredLawyers: featuredLawyers.map((l) => ({
      slug: l.slug,
      name: l.name,
      nameUrdu: l.nameUrdu,
      city: l.city,
      cityUrdu: l.cityUrdu,
      rating: l.rating,
      reviewCount: l.reviewCount,
      specialization: l.specialization ? JSON.parse(l.specialization as string) : [],
      imageColor: l.imageColor,
      verified: l.verified,
    })),
    recentlyAdded: recentlyAdded.map((l) => ({
      slug: l.slug,
      title: l.title,
      titleUrdu: l.titleUrdu,
      yearEnacted: l.yearEnacted,
      status: l.status,
      createdAt: l.createdAt,
      category: { name: l.category.name, nameUrdu: l.category.nameUrdu, slug: l.category.slug, color: l.category.color },
    })),
    recentlyUpdated: recentlyUpdated.map((l) => ({
      slug: l.slug,
      title: l.title,
      titleUrdu: l.titleUrdu,
      yearEnacted: l.yearEnacted,
      status: l.status,
      updatedAt: l.updatedAt,
      category: { name: l.category.name, nameUrdu: l.category.nameUrdu, slug: l.category.slug, color: l.category.color },
    })),
    popularThisWeek: popularThisWeek.map((l) => ({
      slug: l.slug,
      title: l.title,
      titleUrdu: l.titleUrdu,
      yearEnacted: l.yearEnacted,
      viewCount: l.viewCount,
      category: { name: l.category.name, nameUrdu: l.category.nameUrdu, slug: l.category.slug, color: l.category.color },
    })),
    lawOfDay: lawOfDay ? {
      slug: lawOfDay.slug,
      title: lawOfDay.title,
      titleUrdu: lawOfDay.titleUrdu,
      yearEnacted: lawOfDay.yearEnacted,
      summary: lawOfDay.summary,
      summaryUrdu: lawOfDay.summaryUrdu,
      sectionCount: lawOfDay.sections.length,
      category: { name: lawOfDay.category.name, nameUrdu: lawOfDay.category.nameUrdu, slug: lawOfDay.category.slug, color: lawOfDay.category.color },
    } : null,
  })
}
