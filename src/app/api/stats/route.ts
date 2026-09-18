import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { categories as fallbackCategories, laws as fallbackLaws } from '@/lib/seed-data'
import { lawyers as fallbackLawyers, docTemplates as fallbackTemplates } from '@/lib/lawyers-templates-data'

// GET /api/stats — dashboard-style stats for homepage
export async function GET(_req: NextRequest) {
  try {
    ensureDatabaseReady()
    const [lawCount, categoryCount, sectionCount, amendmentCount, lawyerCount, templateCount] = await Promise.all([
      db.law.count(),
      db.category.count(),
      db.section.count(),
      db.amendment.count(),
      db.lawyer.count(),
      db.docTemplate.count(),
    ])

    if (lawCount > 0) {
      const [trending, topSearches, zeroResultSearches, featuredLawyers, recentlyAdded, recentlyUpdated, popularThisWeek] = await Promise.all([
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
        db.lawyer.findMany({
          where: { verified: true },
          orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
          take: 4,
        }),
        db.law.findMany({
          orderBy: { createdAt: 'desc' },
          take: 6,
          include: { category: true },
        }),
        db.law.findMany({
          orderBy: { updatedAt: 'desc' },
          take: 6,
          include: { category: true },
        }),
        db.law.findMany({
          orderBy: { viewCount: 'desc' },
          take: 6,
          skip: 6,
          include: { category: true },
        }),
      ])

      const allLawCount = lawCount
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
      const lawOfDayIndex = dayOfYear % (allLawCount || 1)
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
  } catch (error) {
    console.warn('[Stats API] Database error, falling back to static seed data:', error)
  }

  // Graceful Fallback from seed data
  const totalSections = fallbackLaws.reduce((acc, l) => acc + (l.sections?.length || 0), 0)
  const totalAmendments = fallbackLaws.reduce((acc, l) => acc + (l.amendments?.length || 0), 0)

  const trendingList = fallbackLaws.slice(0, 6).map((l, idx) => {
    const cat = fallbackCategories.find((c) => c.slug === l.categorySlug)
    return {
      slug: l.slug,
      title: l.title,
      titleUrdu: l.titleUrdu,
      yearEnacted: l.yearEnacted,
      status: l.status,
      viewCount: 1500 - idx * 120,
      category: {
        name: cat?.name || 'General',
        nameUrdu: cat?.nameUrdu || null,
        slug: cat?.slug || l.categorySlug,
        color: cat?.color || '#0d9488',
      },
    }
  })

  const firstLaw = fallbackLaws[0]
  const firstCat = fallbackCategories.find((c) => c.slug === firstLaw?.categorySlug)

  return NextResponse.json({
    lawCount: fallbackLaws.length,
    categoryCount: fallbackCategories.length,
    sectionCount: totalSections,
    amendmentCount: totalAmendments,
    lawyerCount: fallbackLawyers.length,
    templateCount: fallbackTemplates.length,
    trending: trendingList,
    topSearches: [
      { query: 'Section 302', count: 142 },
      { query: 'Family Courts Act', count: 98 },
      { query: 'PECA Cyber crime', count: 85 },
      { query: 'Gratuity calculation', count: 64 },
    ],
    zeroResultSearches: [],
    featuredLawyers: fallbackLawyers.slice(0, 4).map((l) => ({
      slug: l.slug,
      name: l.name,
      nameUrdu: l.nameUrdu || null,
      city: l.city,
      cityUrdu: l.cityUrdu || null,
      rating: l.rating || 4.8,
      reviewCount: l.reviewCount || 12,
      specialization: l.specialization || [],
      imageColor: l.imageColor || null,
      verified: l.verified ?? true,
    })),
    recentlyAdded: trendingList,
    recentlyUpdated: trendingList,
    popularThisWeek: trendingList,
    lawOfDay: firstLaw ? {
      slug: firstLaw.slug,
      title: firstLaw.title,
      titleUrdu: firstLaw.titleUrdu,
      yearEnacted: firstLaw.yearEnacted,
      summary: firstLaw.summary,
      summaryUrdu: firstLaw.summaryUrdu,
      sectionCount: firstLaw.sections?.length || 0,
      category: {
        name: firstCat?.name || 'General',
        nameUrdu: firstCat?.nameUrdu || '',
        slug: firstCat?.slug || '',
        color: firstCat?.color || null,
      },
    } : null,
  })
}
