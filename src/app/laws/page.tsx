'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search, SlidersHorizontal, X, ChevronRight, ChevronLeft, FileText, Calendar, Building2,
  Gavel, Filter, BookText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

// Note: useSearchParams requires a Suspense boundary in Next 16
export const dynamic = 'force-dynamic'

type Category = {
  id: string
  name: string
  nameUrdu: string
  slug: string
  color: string | null
}

type Law = {
  id: string
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted: number
  jurisdiction: string
  status: string
  summary: string | null
  summaryUrdu: string | null
  applicabilityTags: string[]
  viewCount: number
  gazetteReference: string | null
  category: Category
}

const STATUS_LABELS: Record<string, { en: string; ur: string; color: string }> = {
  active: { en: 'Active', ur: 'نافذ', color: 'emerald' },
  repealed: { en: 'Repealed', ur: 'منسوخ', color: 'rose' },
  amended: { en: 'Amended', ur: 'ترمیم شدہ', color: 'amber' },
}

const JURISDICTION_LABELS: Record<string, { en: string; ur: string }> = {
  federal: { en: 'Federal', ur: 'وفاقی' },
  punjab: { en: 'Punjab', ur: 'پنجاب' },
  sindh: { en: 'Sindh', ur: 'سندھ' },
  kpk: { en: 'KPK', ur: 'کے پی' },
  balochistan: { en: 'Balochistan', ur: 'بلوچستان' },
  gilgit_baltistan: { en: 'Gilgit-Baltistan', ur: 'گلگت بلتستان' },
  ajk: { en: 'AJK', ur: 'آزاد کشمیر' },
}

export default function LawsPage() {
  return (
    <React.Suspense fallback={<div className="container mx-auto max-w-7xl px-4 py-12"><Skeleton className="h-12 w-1/3" /></div>}>
      <LawsPageInner />
    </React.Suspense>
  )
}

function LawsPageInner() {
  const { t, lang } = useLanguage()
  const searchParams = useSearchParams()
  const [laws, setLaws] = React.useState<Law[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  // Filters
  const [q, setQ] = React.useState(searchParams.get('q') ?? '')
  const [category, setCategory] = React.useState(searchParams.get('category') ?? 'all')
  const [jurisdiction, setJurisdiction] = React.useState(searchParams.get('jurisdiction') ?? 'all')
  const [status, setStatus] = React.useState(searchParams.get('status') ?? 'all')
  const [year, setYear] = React.useState(searchParams.get('year') ?? 'all')
  const [sort, setSort] = React.useState(searchParams.get('sort') ?? 'popular')

  React.useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(d.items ?? []))
  }, [])

  React.useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category !== 'all') params.set('category', category)
    if (jurisdiction !== 'all') params.set('jurisdiction', jurisdiction)
    if (status !== 'all') params.set('status', status)
    if (year !== 'all') params.set('year', year)
    if (sort !== 'popular') params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', '20')

    setLoading(true)
    fetch(`/api/laws?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setLaws(d.items ?? [])
        setTotal(d.total ?? 0)
        setTotalPages(d.totalPages ?? 0)
      })
      .finally(() => setLoading(false))

    // Update URL
    const urlParams = new URLSearchParams()
    if (q) urlParams.set('q', q)
    if (category !== 'all') urlParams.set('category', category)
    if (jurisdiction !== 'all') urlParams.set('jurisdiction', jurisdiction)
    if (status !== 'all') urlParams.set('status', status)
    if (year !== 'all') urlParams.set('year', year)
    if (sort !== 'popular') urlParams.set('sort', sort)
    if (page > 1) urlParams.set('page', String(page))
    window.history.replaceState(null, '', `/laws${urlParams.toString() ? `?${urlParams.toString()}` : ''}`)
  }, [q, category, jurisdiction, status, year, sort, page])

  // Reset page when filters change
  React.useEffect(() => { setPage(1) }, [q, category, jurisdiction, status, year, sort])

  const years = React.useMemo(() => {
    const ys = new Set<number>()
    laws.forEach((l) => ys.add(l.yearEnacted))
    return Array.from(ys).sort((a, b) => b - a)
  }, [laws])

  const hasFilters = q || category !== 'all' || jurisdiction !== 'all' || status !== 'all' || year !== 'all'

  const clearFilters = () => {
    setQ('')
    setCategory('all')
    setJurisdiction('all')
    setStatus('all')
    setYear('all')
    setSort('popular')
  }

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 md:py-12">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('Laws', 'قوانین')}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookText className="h-7 w-7 text-primary" />
          {t('Browse All Laws', 'تمام قوانین دیکھیں')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('Filter by category, jurisdiction, status or year. Search across all laws.', 'اقسام، عدلیہ، صورتحرال یا سال سے فلٹر کریں۔ تمام قوانین میں تلاش کریں۔')}
        </p>
      </div>

      {/* Search & Filters */}
      <Card className="mb-6 border-border/60">
        <CardContent className="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
          {/* Search row */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={t('Search by name, section, keyword...', 'نام، شق، کلیدی لفظ سے تلاش...')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 h-11"
            />
          </div>

          {/* Filter grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 w-full min-w-0">
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate"><SelectValue placeholder={t('Category', 'قسم')} /></span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All categories', 'تمام اقسام')}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>{lang === 'ur' && c.nameUrdu ? c.nameUrdu : c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={jurisdiction} onValueChange={setJurisdiction}>
              <SelectTrigger className="h-10 w-full min-w-0">
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate"><SelectValue placeholder={t('Jurisdiction', 'عدلیہ')} /></span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All jurisdictions', 'تمام عدلیہ')}</SelectItem>
                {Object.entries(JURISDICTION_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{lang === 'ur' ? v.ur : v.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 w-full min-w-0">
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <Gavel className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate"><SelectValue placeholder={t('Status', 'صورتحرال')} /></span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All statuses', 'تمام صورتحرال')}</SelectItem>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{lang === 'ur' ? v.ur : v.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="h-10 w-full min-w-0">
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate"><SelectValue placeholder={t('Year', 'سال')} /></span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All years', 'تمام سال')}</SelectItem>
                {years.map((y) => (<SelectItem key={y} value={String(y)}>{y}</SelectItem>))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-full min-w-0">
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate"><SelectValue /></span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">{t('Most viewed', 'سب سے زیادہ دیکھے گئے')}</SelectItem>
                <SelectItem value="newest">{t('Newest', 'تازہ ترین')}</SelectItem>
                <SelectItem value="oldest">{t('Oldest', 'قدیم ترین')}</SelectItem>
                <SelectItem value="az">A → Z</SelectItem>
                <SelectItem value="za">Z → A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active filters summary */}
          {(hasFilters || q) && (
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                <span>{total} {t('results found', 'نتائج ملے')}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
                <X className="h-3.5 w-3.5 mr-1" /> {t('Clear filters', 'فلٹر صاف کریں')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <LawCardSkeleton key={i} />)}
        </div>
      ) : laws.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {t('No laws found. Try adjusting your filters or search terms.', 'کوئی قانون نہیں ملا۔ فلٹر یا تلاش کے الفاظ تبدیل کریں۔')}
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
              {t('Reset filters', 'فلٹر ری سیٹ کریں')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {laws.map((law, i) => <LawCard key={law.id} law={law} delay={i * 30} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between sm:justify-center gap-2 mt-8 pt-4 border-t border-border/50 max-w-full">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 sm:px-3 text-xs sm:text-sm shrink-0"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {lang === 'ur' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                <span>{t('Prev', 'پچھلا')}</span>
              </Button>

              {/* Mobile page indicator */}
              <div className="flex sm:hidden items-center justify-center px-2.5 py-1 rounded-md bg-muted/60 text-xs font-semibold tabular-nums text-foreground shrink-0">
                {page} / {totalPages}
              </div>

              {/* Desktop / tablet numbered buttons */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(7, totalPages) }).map((_, idx) => {
                  let p: number
                  if (totalPages <= 7) p = idx + 1
                  else if (page <= 4) p = idx + 1
                  else if (page >= totalPages - 3) p = totalPages - 6 + idx
                  else p = page - 3 + idx
                  return (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      size="sm"
                      className="h-9 w-9 p-0 tabular-nums text-xs"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 sm:px-3 text-xs sm:text-sm shrink-0"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <span>{t('Next', 'اگلا')}</span>
                {lang === 'ur' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function LawCard({ law, delay }: { law: Law, delay: number }) {
  const { t, lang } = useLanguage()
  const status = STATUS_LABELS[law.status] ?? STATUS_LABELS.active
  const jur = JURISDICTION_LABELS[law.jurisdiction] ?? JURISDICTION_LABELS.federal

  return (
    <Link href={`/laws/${law.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <Card className="group hover:shadow-md hover:border-primary/30 transition-all duration-200 h-full flex flex-col overflow-hidden">
        {/* Status bar */}
        <div
          className="h-1 w-full"
          style={{ backgroundColor: law.category.color ?? 'var(--primary)' }}
        />
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium"
                style={{
                  backgroundColor: `${law.category.color ?? 'var(--primary)'}1a`,
                  color: law.category.color ?? 'var(--primary)',
                }}
              >
                <span className="inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: law.category.color ?? 'var(--primary)' }} />
                {lang === 'ur' && law.category.nameUrdu ? law.category.nameUrdu : law.category.name}
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] font-semibold shrink-0">{law.yearEnacted}</Badge>
          </div>

          <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
          </h3>




          <p className="text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed flex-1">
            {lang === 'ur' && law.summaryUrdu ? law.summaryUrdu : law.summary ?? ''}
          </p>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40 flex-wrap">
            <Badge variant="secondary" className="text-[10px]">{lang === 'ur' ? jur.ur : jur.en}</Badge>
            <Badge variant="outline" className="text-[10px]" style={{ color: status.color === 'rose' ? '#e11d48' : status.color === 'amber' ? '#d97706' : '#059669' }}>
              {lang === 'ur' ? status.ur : status.en}
            </Badge>
            {law.applicabilityTags && law.applicabilityTags.length > 0 && (
              <span className="text-[10px] text-muted-foreground ml-auto">
                {law.applicabilityTags.slice(0, 2).join(', ')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function LawCardSkeleton() {
  return (
    <Card className="h-56">
      <div className="h-1 w-full bg-muted shimmer" />
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  )
}
