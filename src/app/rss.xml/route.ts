import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  let items = ''

  if (process.env.DATABASE_URL) {
    try {
      const laws = await db.law.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { category: true },
      })

      items = laws.map((law) => `
    <item>
      <title>${escapeXml(law.title)}</title>
      <link>https://qanoonpk.example/laws/${law.slug}</link>
      <guid isPermaLink="true">https://qanoonpk.example/laws/${law.slug}</guid>
      <description>${escapeXml(law.summary ?? '')}</description>
      <category>${escapeXml(law.category.name)}</category>
      <pubDate>${new Date(law.createdAt).toUTCString()}</pubDate>
    </item>
  `).join('')
    } catch (error) {
      console.error('Error fetching laws for RSS:', error)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>QanoonPK — Pakistan Legal Directory</title>
    <link>https://qanoonpk.example</link>
    <description>Latest laws added to QanoonPK — Pakistan's bilingual legal directory</description>
    <language>en</language>
    <atom:link href="https://qanoonpk.example/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
