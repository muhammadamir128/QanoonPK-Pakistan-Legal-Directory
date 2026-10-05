import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { blogPostsData } from '@/lib/new-features-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q')

  try {
    ensureDatabaseReady()
    const where: Record<string, unknown> = { published: true }

    if (category && category !== 'all' && category !== 'All Topics') {
      where.category = category
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { titleUrdu: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { summaryUrdu: { contains: q, mode: 'insensitive' } },
      ]
    }

    const posts = await db.blogPost.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    if (posts && posts.length > 0) {
      return NextResponse.json({ items: posts, total: posts.length })
    }

    // Fallback if DB is empty
    return NextResponse.json({ items: blogPostsData, total: blogPostsData.length })
  } catch (error) {
    console.error('Error fetching blog posts from DB:', error)
    return NextResponse.json({ items: blogPostsData, total: blogPostsData.length })
  }
}
