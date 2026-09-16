'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Search, FileText, Download, ArrowRight, AlertTriangle,
  FilePlus, ShieldCheck, Filter, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type Template = {
  id: string
  slug: string
  title: string
  titleUrdu: string | null
  description: string
  descriptionUrdu: string
  category: string
  categoryUrdu: string
  fields: Array<{
    key: string
    label: string
    labelUrdu?: string
    type: string
    required?: boolean
  }>
  downloads: number
}

export default function TemplatesPage() {
  const { t, lang } = useLanguage()
  const [templates, setTemplates] = React.useState<Template[]>([])
  const [loading, setLoading] = React.useState(true)
  const [q, setQ] = React.useState('')
  const [category, setCategory] = React.useState('all')
  const [page, setPage] = React.useState(1)
  const itemsPerPage = 20

  React.useEffect(() => {
    setPage(1)
  }, [q, category])

  const categories = React.useMemo(() => {
    const set = new Map<string, { en: string; ur: string }>()
    templates.forEach((tpl) => {
      if (!set.has(tpl.category)) set.set(tpl.category, { en: tpl.category, ur: tpl.categoryUrdu })
    })
    return Array.from(set.entries())
  }, [templates])

  React.useEffect(() => {
    setLoading(true)
    fetch('/api/templates?limit=500')
      .then((r) => r.json())
      .then((d) => {
        const all = d.items ?? []
        setTemplates(all)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = React.useMemo(() => {
    const query = q.toLowerCase().trim()
    return templates.filter((tpl) => {
      if (category !== 'all' && tpl.category !== category) return false
      if (!query) return true
      return (
        tpl.title.toLowerCase().includes(query) ||
        tpl.titleUrdu?.includes(q) ||
        tpl.description.toLowerCase().includes(query) ||
        tpl.category.toLowerCase().includes(query)
      )
    })
  }, [templates, q, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginatedTemplates = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const clearFilters = () => {
    setQ('')
    setCategory('all')
  }
  const hasFilters = q || category !== 'all'

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('Templates', 'ٹیمپلیٹس')}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shrink-0">
            <FilePlus className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('Legal Document Templates', 'قانونی دستاویز ٹیمپلیٹس')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              {t(
                'Common legal documents you can fill in and download. Affidavits, agreements, and contracts in English & Urdu.',
                'عام قانونی دستاویزات جو آپ بھر کر ڈاؤن لوڈ کر سکتے ہیں۔ حلفی بیانات، معاہدے، اور کنٹریکٹس انگریزی و اردو میں۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-primary">{t('How to use these templates', 'ان ٹیمپلیٹس کا استعمال کیسے کریں')}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {t(
              '1) Pick a template • 2) Fill in the required fields • 3) Preview • 4) Download as text or printable HTML. Always have a lawyer review before signing.',
              '1) ٹیمپلیٹ منتخب کریں • 2) ضروری خانے بھریں • 3) پیش نظارہ • 4) ٹیکسٹ یا printable HTML کے طور پر ڈاؤن لوڈ کریں۔ دستخط سے پہلے ہمیشہ وکیل سے جائزہ لیں۔'
            )}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="space-y-3 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('Search templates...', 'ٹیمپلیٹس تلاش کریں...')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setCategory('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
              category === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border hover:bg-accent'
            )}
          >
            {t('All', 'تمام')} ({templates.length})
          </button>
          {categories.map(([key, label]) => {
            const count = templates.filter((t) => t.category === key).length
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                  category === key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-accent'
                )}
              >
                {lang === 'ur' ? label.ur : label.en} ({count})
              </button>
            )
          })}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 ml-2">
              <X className="h-3 w-3 mr-1" /> {t('Clear', 'صاف')}
            </Button>
          )}
        </div>
      </div>

      {/* Templates grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-56">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {t('No templates match your filters.', 'آپ کے فلٹر سے کوئی ٹیمپلیٹ مماثل نہیں۔')}
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
              {t('Reset filters', 'فلٹر ری سیٹ کریں')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTemplates.map((tpl, i) => (
              <Link
                key={tpl.id}
                href={`/templates/${tpl.slug}`}
                className="group block animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50" />
                  <CardContent className="p-5 pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{tpl.fields.length} {t('fields', 'خانے')}</Badge>
                    </div>
                    <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {lang === 'ur' && tpl.titleUrdu ? tpl.titleUrdu : tpl.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {lang === 'ur' && tpl.descriptionUrdu ? tpl.descriptionUrdu : tpl.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        {lang === 'ur' ? tpl.categoryUrdu : tpl.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        <Download className="h-3 w-3" /> {tpl.downloads}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
              <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                {t(
                  `Showing ${(page - 1) * itemsPerPage + 1} to ${Math.min(page * itemsPerPage, filtered.length)} of ${filtered.length} templates`,
                  `${filtered.length} میں سے ${(page - 1) * itemsPerPage + 1} تا ${Math.min(page * itemsPerPage, filtered.length)} ٹیمپلیٹس`
                )}
              </div>
              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                >
                  <ChevronRight className={cn('h-3.5 w-3.5', lang !== 'ur' && 'rotate-180')} />
                  <span>{t('Previous', 'پچھلا')}</span>
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNum = idx + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="h-8 w-8 p-0 text-xs tabular-nums cursor-pointer"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                >
                  <span>{t('Next', 'اگلا')}</span>
                  <ChevronRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Disclaimer */}
      <Card className="mt-8 bg-amber-50 dark:bg-amber-950/20 border-amber-300/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              {t(
                'These templates are general and may not suit your specific situation. Always have a qualified lawyer review before signing. QanoonPK is not liable for any consequences of using these templates.',
                'یہ ٹیمپلیٹس عام ہیں اور آپ کی مخصوص صورتِ حال کے لیے موزوں نہیں ہو سکتے۔ دستخط سے پہلے ہمیشہ لائسنس یافتہ وکیل سے جائزہ لیں۔ قانون پی کے ان ٹیمپلیٹس کے استعمال کے کسی بھی نتائج کا ذمہ دار نہیں۔'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
