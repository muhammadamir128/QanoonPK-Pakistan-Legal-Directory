import { NextResponse } from 'next/server'

export function GET() {
  const robots = `User-agent: *
Allow: /
Allow: /laws
Allow: /categories
Allow: /lawyers
Allow: /templates
Allow: /faq
Allow: /courts
Allow: /glossary
Allow: /finder
Allow: /compare
Disallow: /admin
Disallow: /api/

Sitemap: https://qanoonpk.example/sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
