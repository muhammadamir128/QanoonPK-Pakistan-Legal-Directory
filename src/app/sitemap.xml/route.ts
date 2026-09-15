import { db } from '@/lib/db'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const baseUrl = 'https://qanoonpk.example'

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/laws', priority: '0.9', changefreq: 'daily' },
    { url: '/categories', priority: '0.9', changefreq: 'weekly' },
    { url: '/lawyers', priority: '0.8', changefreq: 'weekly' },
    { url: '/templates', priority: '0.8', changefreq: 'weekly' },
    { url: '/finder', priority: '0.7', changefreq: 'monthly' },
    { url: '/chat', priority: '0.7', changefreq: 'monthly' },
    { url: '/courts', priority: '0.7', changefreq: 'monthly' },
    { url: '/glossary', priority: '0.7', changefreq: 'weekly' },
    { url: '/faq', priority: '0.7', changefreq: 'weekly' },
    { url: '/compare', priority: '0.6', changefreq: 'monthly' },
    { url: '/help', priority: '0.5', changefreq: 'monthly' },
    { url: '/admin', priority: '0.3', changefreq: 'monthly' },
  ]

  // Fetch all laws and categories
  const [laws, categories, lawyers, templates] = await Promise.all([
    db.law.findMany({ select: { slug: true, updatedAt: true } }),
    db.category.findMany({ select: { slug: true, updatedAt: true } }),
    db.lawyer.findMany({ select: { slug: true, updatedAt: true } }),
    db.docTemplate.findMany({ select: { slug: true, updatedAt: true } }),
  ])

  const lawUrls = laws.map((l) => ({
    url: `/laws/${l.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: l.updatedAt.toISOString(),
  }))

  const categoryUrls = categories.map((c) => ({
    url: `/categories/${c.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
    lastmod: c.updatedAt.toISOString(),
  }))

  const lawyerUrls = lawyers.map((l) => ({
    url: `/lawyers/${l.slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: l.updatedAt.toISOString(),
  }))

  const templateUrls = templates.map((t) => ({
    url: `/templates/${t.slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: t.updatedAt.toISOString(),
  }))

  const allUrls = [
    ...staticPages.map((p) => ({ ...p, lastmod: new Date().toISOString() })),
    ...lawUrls,
    ...categoryUrls,
    ...lawyerUrls,
    ...templateUrls,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url>
    <loc>${baseUrl}${u.url}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
