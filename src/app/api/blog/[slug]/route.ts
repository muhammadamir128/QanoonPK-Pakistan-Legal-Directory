import { NextRequest, NextResponse } from 'next/server'
import { db, ensureDatabaseReady } from '@/lib/db'
import { blogPostsData } from '@/lib/new-features-data'

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params

  try {
    ensureDatabaseReady()
    const post = await db.blogPost.findUnique({
      where: { slug },
    })

    if (post) {
      return NextResponse.json({ item: post })
    }

    const fallback = blogPostsData.find((p) => p.slug === slug)
    if (fallback) {
      return NextResponse.json({ item: fallback })
    }

    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching blog post by slug:', error)
    const fallback = blogPostsData.find((p) => p.slug === slug)
    if (fallback) {
      return NextResponse.json({ item: fallback })
    }
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}
