'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search, Scale, ArrowRight, Gavel, Users, ShieldCheck, HardHat, Receipt,
  TrendingUp, BookOpen, Compass, Sparkles, FileText, Clock, Languages, ChevronRight, ChevronLeft,
  Bot, Landmark, Briefcase, FilePlus, Star,
  Home, ShoppingCart, HeartHandshake, Leaf, Building2, Vote, Lightbulb,
  Plane, HeartPulse, GraduationCap, Car,
  Shield as ShieldIcon, ShieldAlert, Handshake, Newspaper,
  Flame, Eye, Map,
  CalendarDays,
  Building, Wheat,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'
import { RecentlyViewed } from '@/components/recently-viewed'
import { cn } from '@/lib/utils'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Gavel, Users, ShieldCheck, HardHat, Receipt,
  Landmark, Scale, Home, ShoppingCart, HeartHandshake, Leaf, Building2, Vote, Lightbulb,
  Plane, HeartPulse, GraduationCap, Car,
  Shield: ShieldIcon, ShieldAlert, Handshake, Newspaper,
  Map, Building, Wheat,
}

type Category = {
  id: string
  name: string
  nameUrdu: string
  slug: string
  icon: string | null
  color: string | null
  description: string
  descriptionUrdu: string | null
  _count?: { laws: number }
}

type Stats = {
  lawCount: number
  categoryCount: number
  sectionCount: number
  amendmentCount: number
  lawyerCount?: number
  templateCount?: number
  trending: Array<{
    slug: string
    title: string
    titleUrdu: string | null
    yearEnacted: number
    status: string
    viewCount: number
    category: { name: string; nameUrdu?: string | null; slug: string; color?: string | null }
  }>
  topSearches: Array<{ query: string; count: number }>
  featuredLawyers?: Array<{
    slug: string
    name: string
    nameUrdu: string | null
    city: string
    cityUrdu: string | null
    rating: number
    reviewCount: number
    specialization: string[]
    imageColor: string | null
    verified: boolean
  }>
  recentlyAdded?: Array<{
    slug: string
    title: string
    titleUrdu: string | null
    yearEnacted: number
    status: string
    createdAt: string
    category: { name: string; nameUrdu?: string | null; slug: string; color?: string | null }
  }>
  recentlyUpdated?: Array<{
    slug: string
    title: string
    titleUrdu: string | null
    yearEnacted: number
    status: string
    updatedAt: string
    category: { name: string; nameUrdu?: string | null; slug: string; color?: string | null }
  }>
  popularThisWeek?: Array<{
    slug: string
    title: string
    titleUrdu: string | null
    yearEnacted: number
    viewCount: number
    category: { name: string; nameUrdu?: string | null; slug: string; color?: string | null }
  }>
  lawOfDay?: {
    slug: string
    title: string
    titleUrdu: string | null
    yearEnacted: number
    summary: string | null
    summaryUrdu: string | null
    sectionCount: number
    category: { name: string; nameUrdu: string; slug: string; color: string | null }
  } | null
}

export default function HomePage() {
  const { t, lang } = useLanguage()
  const router = useRouter()
  const [q, setQ] = React.useState('')
  const [categories, setCategories] = React.useState<Category[]>([])
  const [stats, setStats] = React.useState<Stats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [categoryPage, setCategoryPage] = React.useState(1)
  const categoriesPerPage = 12
  const categoriesSectionRef = React.useRef<HTMLElement>(null)

  const totalCategoryPages = Math.max(1, Math.ceil(categories.length / categoriesPerPage))
  const paginatedCategories = categories.slice(
    (categoryPage - 1) * categoriesPerPage,
    categoryPage * categoriesPerPage
  )

  const handleCategoryPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalCategoryPages) {
      setCategoryPage(newPage)
      categoriesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  React.useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
    ]).then(([cats, s]) => {
      setCategories(cats.items ?? [])
      setStats(s)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push(`/laws?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient border-b border-border/40">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24 lg:py-28 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary animate-fade-in-up">
              <Sparkles className="h-3.5 w-3.5" />
              {t('Bilingual • Searchable • Free', 'دو لسانی • تلاش کے قابل • مفت')}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance animate-fade-in-up">
              {t('Pakistan\'s Laws,', 'پاکستان کے قوانین،')}
              <br />
              <span className="text-primary text-shadow-soft">
                {t('at your fingertips.', 'آپ کی انگلیوں پر۔')}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
              {t(
                'Searchable, categorized, and explained in plain language — for students, citizens, professionals and small businesses.',
                'تلاش کے قابل، اقسام میں منظم، اور آسان زبان میں — طلباء، شہریوں، پیشہ ورانہ اور چھوٹے کاروبار کے لیے۔'
              )}
            </p>

            {/* Search bar */}
            <form onSubmit={onSearch} className="relative max-w-2xl mx-auto animate-fade-in-up">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input type="search"
                placeholder={t('Search... ', 'تلاش کریں')}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="h-14 pl-12 pr-32 text-base shadow-lg border-primary/30 focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Button type="submit" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5">
                {t('Search', 'تلاش')}
                <ArrowRight className={cn('h-4 w-4 ml-1.5', lang === 'ur' && 'rotate-180')} />
              </Button>
            </form>

            {/* Quick stats */}
            {!loading && stats && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 max-w-4xl mx-auto pt-6 animate-fade-in-up">
                <StatChip icon={FileText} label={t('Laws', 'قوانین')} value={stats.lawCount} />
                <StatChip icon={BookOpen} label={t('Categories', 'اقسام')} value={stats.categoryCount} />
                <StatChip icon={Gavel} label={t('Sections', 'شقیں')} value={stats.sectionCount} />
                <StatChip icon={Clock} label={t('Amendments', 'ترامیم')} value={stats.amendmentCount} />
                {stats.lawyerCount != null && (
                  <StatChip icon={Briefcase} label={t('Lawyers', 'وکلاء')} value={stats.lawyerCount} />
                )}
                {stats.templateCount != null && (
                  <StatChip icon={FilePlus} label={t('Templates', 'ٹیمپلیٹس')} value={stats.templateCount} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Law of the Day */}
      {stats && stats.lawOfDay && (
        <section className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
          <Link href={`/laws/${stats.lawOfDay.slug}`} className="group block animate-fade-in-up">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 relative rounded-2xl border-border/80">
              <div className="absolute inset-0 pattern-dots opacity-[0.03] pointer-events-none" />
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: stats.lawOfDay.category.color ?? 'var(--primary)' }}
              />
              <CardContent className="p-4 sm:p-6 md:p-8 relative">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
                  {/* Top Bar for Mobile / Left Icon for Desktop */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
                    <div
                      className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl text-white shrink-0 shadow-md group-hover:scale-105 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${stats.lawOfDay.category.color ?? '#0d9488'}, ${(stats.lawOfDay.category.color ?? '#0d9488')}cc)`,
                      }}
                    >
                      <CalendarDays className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>

                    {/* Mobile Only: Top Badges */}
                    <div className="sm:hidden flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                      <Badge variant="secondary" className="text-[11px] font-semibold px-2 py-0.5">
                        <Sparkles className="h-3 w-3 mr-1 text-primary" />
                        {t('Law of the Day', 'آج کا قانون')}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 truncate max-w-[140px]" style={{ color: stats.lawOfDay.category.color ?? undefined }}>
                        {lang === 'ur' ? stats.lawOfDay.category.nameUrdu : stats.lawOfDay.category.name}
                      </Badge>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 min-w-0">
                    {/* Desktop Badges */}
                    <div className="hidden sm:flex items-center gap-2 mb-2.5 flex-wrap">
                      <Badge variant="secondary" className="text-xs font-semibold">
                        <Sparkles className="h-3 w-3 mr-1 text-primary" />
                        {t('Law of the Day', 'آج کا قانون')}
                      </Badge>
                      <Badge variant="outline" className="text-xs" style={{ color: stats.lawOfDay.category.color ?? undefined }}>
                        {lang === 'ur' ? stats.lawOfDay.category.nameUrdu : stats.lawOfDay.category.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs tabular-nums font-mono">{stats.lawOfDay.yearEnacted}</Badge>
                      <Badge variant="secondary" className="text-xs">{stats.lawOfDay.sectionCount} {t('sections', 'شقیں')}</Badge>
                    </div>

                    {/* Mobile Badges Row: Year & Sections */}
                    <div className="sm:hidden flex items-center gap-1.5 my-1.5">
                      <Badge variant="outline" className="text-[10px] tabular-nums font-mono px-2 py-0.5">{stats.lawOfDay.yearEnacted}</Badge>
                      <Badge variant="secondary" className="text-[10px] px-2 py-0.5">{stats.lawOfDay.sectionCount} {t('sections', 'شقیں')}</Badge>
                    </div>

                    {/* Title (Takes full width) */}
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug break-words">
                      {lang === 'ur' && stats.lawOfDay.titleUrdu ? stats.lawOfDay.titleUrdu : stats.lawOfDay.title}
                    </h2>

                    {/* Summary */}
                    {stats.lawOfDay.summary && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {lang === 'ur' && stats.lawOfDay.summaryUrdu ? stats.lawOfDay.summaryUrdu : stats.lawOfDay.summary}
                      </p>
                    )}
                  </div>

                  {/* Read Link */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary shrink-0 self-end sm:self-center mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 w-full sm:w-auto justify-end sm:justify-start">
                    <span>{t('Read Law', 'قانون پڑھیں')}</span>
                    <ArrowRight className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform', lang === 'ur' && 'rotate-180')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {/* Categories Grid */}
      <section ref={categoriesSectionRef} className="container mx-auto max-w-7xl px-4 py-16 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {t('Browse by Category', 'اقسام کے لحاظ سے دیکھیں')}
              </h2>
              {categories.length > 0 && (
                <Badge variant="secondary" className="font-mono text-xs px-2.5 py-0.5 rounded-full">
                  {categories.length}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('Pakistan\'s principal federal and provincial statutes, organized by subject.', 'پاکستان کے بنیادی وفاقی اور صوبائی قوانین، موضوع کے لحاظ سے۔')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {categories.length > 0 && (
              <span className="text-xs text-muted-foreground hidden md:inline-block">
                {t(
                  `Showing ${(categoryPage - 1) * categoriesPerPage + 1}–${Math.min(categoryPage * categoriesPerPage, categories.length)} of ${categories.length}`,
                  `${categories.length} میں سے ${(categoryPage - 1) * categoriesPerPage + 1}–${Math.min(categoryPage * categoriesPerPage, categories.length)} اقسام`
                )}
              </span>
            )}
            <Link href="/categories" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0">
              {t('View all', 'تمام دیکھیں')} <ChevronRight className={cn('h-4 w-4', lang === 'ur' && 'rotate-180')} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : paginatedCategories.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} delay={i * 40} />
            ))}
        </div>

        {/* Pagination Controls */}
        {!loading && totalCategoryPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60">
            <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
              {t(
                `Page ${categoryPage} of ${totalCategoryPages} (${categories.length} total categories)`,
                `صفحہ ${categoryPage} از ${totalCategoryPages} (کل ${categories.length} اقسام)`
              )}
            </div>

            <nav aria-label="Category pagination" className="flex items-center gap-1.5 order-1 sm:order-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCategoryPageChange(categoryPage - 1)}
                disabled={categoryPage === 1}
                className="h-9 px-3 gap-1 rounded-lg border-border hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronLeft className={cn('h-4 w-4', lang === 'ur' && 'rotate-180')} />
                <span className="text-xs font-medium">{t('Previous', 'پچھلا')}</span>
              </Button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalCategoryPages }, (_, idx) => {
                  const pageNum = idx + 1
                  const isActive = pageNum === categoryPage
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCategoryPageChange(pageNum)}
                      className={cn(
                        'h-9 w-9 p-0 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 ring-2 ring-primary/20 hover:bg-primary'
                          : 'border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCategoryPageChange(categoryPage + 1)}
                disabled={categoryPage === totalCategoryPages}
                className="h-9 px-3 gap-1 rounded-lg border-border hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 transition-all cursor-pointer"
              >
                <span className="text-xs font-medium">{t('Next', 'اگلا')}</span>
                <ChevronRight className={cn('h-4 w-4', lang === 'ur' && 'rotate-180')} />
              </Button>
            </nav>
          </div>
        )}
      </section>

      {/* Most Viewed Laws (Trending) */}
      {stats && stats.trending.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-16 border-t border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2.5 border border-emerald-500/20">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{t('Leaderboard', 'لیڈر بورڈ')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
                {t('Most Viewed Laws', 'سب سے زیادہ دیکھے گئے قوانین')}
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm max-w-lg">
                {t('The most frequently consulted statutes and legal codes across Pakistan.', 'پاکستان بھر میں شہریوں اور وکلاء کے سب سے زیادہ زیر مطالعہ قوانین۔')}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 h-9 rounded-lg gap-2 text-xs font-semibold shadow-2xs hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all">
              <Link href="/laws?sort=popular">
                <span>{t('Explore All Laws', 'تمام قوانین ملاحظہ کریں')}</span>
                <ArrowRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.trending.map((law, i) => {
              const rankColor =
                i === 0
                  ? 'from-amber-500/20 via-amber-500/5 to-transparent'
                  : i === 1
                  ? 'from-slate-400/20 via-slate-400/5 to-transparent'
                  : i === 2
                  ? 'from-orange-600/20 via-orange-600/5 to-transparent'
                  : 'from-primary/10 via-primary/5 to-transparent'

              return (
                <Link key={law.slug} href={`/laws/${law.slug}`} className="group block">
                  <div className={cn(
                    'relative h-full flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300',
                    'bg-card/70 hover:bg-card shadow-xs hover:shadow-xl hover:-translate-y-1',
                    'hover:border-primary/50 backdrop-blur-xs overflow-hidden border-border/80'
                  )}>
                    {/* Background subtle gradient glow for top ranks */}
                    <div className={cn(
                      'absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br blur-xl opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none',
                      rankColor
                    )} />

                    <div>
                      {/* Top Bar: Rank & Enactment Year */}
                      <div className="flex items-center justify-between gap-3 relative z-10">
                        {i === 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-extrabold shadow-2xs">
                            <span>🏆</span>
                            <span>#01</span>
                            <span className="text-[10px] font-medium opacity-80">{t('Top Ranked', 'سب سے مقبول')}</span>
                          </span>
                        ) : i === 1 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-400/30 text-xs font-extrabold shadow-2xs">
                            <span>🥈</span>
                            <span>#02</span>
                          </span>
                        ) : i === 2 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/30 text-xs font-extrabold shadow-2xs">
                            <span>🥉</span>
                            <span>#03</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-full bg-muted/80 border border-border/60 text-muted-foreground text-xs font-bold font-mono">
                            #{i + 1 < 10 ? `0${i + 1}` : i + 1}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground text-xs font-mono font-semibold border border-border/40">
                          <CalendarDays className="h-3 w-3 text-muted-foreground" />
                          {law.yearEnacted}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h3 className="font-bold text-base mt-4 text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 relative z-10">
                        {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                      </h3>
                    </div>

                    {/* Bottom Details Bar */}
                    <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: law.category?.color || 'var(--primary)' }}
                        />
                        <span className="text-xs font-medium text-muted-foreground truncate">
                          {lang === 'ur' && law.category?.nameUrdu ? law.category.nameUrdu : law.category?.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                          <Eye className="h-3 w-3" />
                          <span>{law.viewCount.toLocaleString()}</span>
                        </span>
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                          <ArrowRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Featured Lawyers */}
      {stats && stats.featuredLawyers && stats.featuredLawyers.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-16 border-t border-border/40">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                {t('Featured Lawyers', 'نمایاں وکلاء')}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {t('Verified lawyers across Pakistan, ready to help with your legal matter.', 'پاکستان بھر کے تصدیق شدہ وکلاء، آپ کے قانونی مسئلے میں مدد کے لیے تیار۔')}
              </p>
            </div>
            <Link href="/lawyers" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              {t('View all', 'تمام دیکھیں')} <ChevronRight className={cn('h-4 w-4', lang === 'ur' && 'rotate-180')} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.featuredLawyers.map((lawyer, i) => (
              <Link key={lawyer.slug} href={`/lawyers/${lawyer.slug}`} className="group block animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all h-full">
                  <CardContent className="p-4 text-center">
                    <div
                      className="flex h-16 w-16 mx-auto items-center justify-center rounded-full text-white text-lg font-bold shadow-md group-hover:scale-105 transition-transform"
                      style={{ background: `linear-gradient(135deg, ${lawyer.imageColor ?? '#0d9488'}, ${(lawyer.imageColor ?? '#0d9488')}cc)` }}
                    >
                      {lawyer.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                    </div>
                    <h3 className="font-semibold text-sm mt-3 leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {lang === 'ur' && lawyer.nameUrdu ? lawyer.nameUrdu : lawyer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{lang === 'ur' && lawyer.cityUrdu ? lawyer.cityUrdu : lawyer.city}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn('h-3 w-3', s <= Math.round(lawyer.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30')} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{lawyer.rating.toFixed(1)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recently Added & Updated Laws */}
      {stats && (stats.recentlyAdded?.length || stats.recentlyUpdated?.length) ? (
        <section className="container mx-auto max-w-7xl px-4 py-16 border-t border-border/40">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            {t('Latest Updates', 'تازہ ترین اپڈیٹس')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recently Added */}
            {stats.recentlyAdded && stats.recentlyAdded.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {t('Recently Added', 'حال میں شامل کردہ')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.recentlyAdded.slice(0, 5).map((law) => (
                    <Link
                      key={law.slug}
                      href={`/laws/${law.slug}`}
                      className="group flex items-start gap-3 p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-accent/50 transition-all"
                    >
                      <span
                        className="inline-flex h-2 w-2 rounded-full mt-2 shrink-0"
                        style={{ backgroundColor: law.category.color ?? 'var(--primary)' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-1">
                          {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <span style={{ color: law.category.color ?? undefined }}>{lang === 'ur' && law.category.nameUrdu ? law.category.nameUrdu : law.category.name}</span>
                          <span>•</span>
                          <span>{law.yearEnacted}</span>
                          {law.createdAt && (
                            <>
                              <span>•</span>
                              <span>{timeAgo(law.createdAt, lang)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ArrowRight className={cn('h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1', lang === 'ur' && 'rotate-180')} />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recently Updated */}
            {stats.recentlyUpdated && stats.recentlyUpdated.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {t('Recently Updated', 'حال میں اپڈیٹ شدہ')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.recentlyUpdated.slice(0, 5).map((law) => (
                    <Link
                      key={law.slug}
                      href={`/laws/${law.slug}`}
                      className="group flex items-start gap-3 p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-accent/50 transition-all"
                    >
                      <span
                        className="inline-flex h-2 w-2 rounded-full mt-2 shrink-0"
                        style={{ backgroundColor: law.category.color ?? 'var(--primary)' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-1">
                          {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <span style={{ color: law.category.color ?? undefined }}>{lang === 'ur' && law.category.nameUrdu ? law.category.nameUrdu : law.category.name}</span>
                          <span>•</span>
                          <span>{law.yearEnacted}</span>
                          {law.updatedAt && (
                            <>
                              <span>•</span>
                              <span>{timeAgo(law.updatedAt, lang)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ArrowRight className={cn('h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1', lang === 'ur' && 'rotate-180')} />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      ) : null}

      {/* Popular This Week */}
      {stats && stats.popularThisWeek && stats.popularThisWeek.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-16 border-t border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-2.5 border border-orange-500/20">
                <Flame className="h-3.5 w-3.5" />
                <span>{t('Trending Surge', 'ہفتہ وار رجحان')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
                {t('Popular This Week', 'اس ہفتے مقبول')}
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm max-w-lg">
                {t('Trending statutes seeing the highest increase in reader activity over the past 7 days.', 'پچھلے 7 دنوں میں سب سے زیادہ دیکھے جانے والے قوانین۔')}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 rounded-lg">
              <Link href="/laws">
                <span>{t('Browse Catalog', 'کیٹلاگ دیکھیں')}</span>
                <ArrowRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.popularThisWeek.map((law, i) => (
              <Link
                key={law.slug}
                href={`/laws/${law.slug}`}
                className="group block animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative h-full flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 dark:bg-card/40 hover:bg-card p-5 shadow-2xs hover:shadow-xl hover:-translate-y-1 hover:border-orange-500/40 transition-all duration-300 overflow-hidden">
                  <div>
                    {/* Header: Flame Rank & Year */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold font-mono border border-orange-500/20 shadow-2xs">
                        <Flame className="h-3.5 w-3.5 text-orange-500" />
                        <span>#{i + 7}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground text-xs font-mono font-medium border border-border/40">
                        <CalendarDays className="h-3 w-3 text-muted-foreground" />
                        {law.yearEnacted}
                      </span>
                    </div>

                    {/* Law Title */}
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                    </h3>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: law.category?.color ?? 'var(--primary)' }}
                      />
                      <span className="text-muted-foreground text-xs font-medium truncate">
                        {lang === 'ur' && law.category?.nameUrdu ? law.category.nameUrdu : law.category?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/40">
                        <Eye className="h-3 w-3 text-orange-500" />
                        <span>{law.viewCount}</span>
                      </span>
                      <div className="h-6 w-6 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        <ArrowRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      <section className="container mx-auto max-w-7xl px-4 py-8 border-t border-border/40">
        <RecentlyViewed maxItems={6} />
      </section>

      {/* Which Law Applies? CTA */}
      <section className="container mx-auto max-w-7xl px-4 py-16 border-t border-border/40">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12">
          <div className="absolute inset-0 pattern-grid opacity-10 pointer-events-none" />
          <div className="relative grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Compass className="h-3.5 w-3.5" />
                {t('Guided Finder', 'راہنمائی')}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
                {t('Not sure which law applies to your situation?', 'یقین نہیں آپ کے مسئلے پر کون سا قانون لاگو ہوتا ہے؟')}
              </h2>
              <p className="text-primary-foreground/85 leading-relaxed">
                {t(
                  'Answer a few simple questions and we\'ll point you to the relevant laws. This is a directory, not legal advice.',
                  'چند آسان سوالات کا جواب دیں اور ہم آپ کو متعلقہ قوانین تک پہنچائیں گے۔ یہ ڈائریکٹری ہے، قانونی مشورہ نہیں۔'
                )}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" variant="secondary" className="font-semibold">
                  <Link href="/finder">
                    <Compass className="h-4 w-4 mr-2" />
                    {t('Start the Finder', 'فائنڈر شروع کریں')}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  <Link href="/laws">
                    {t('Browse all laws', 'تمام قوانین دیکھیں')}
                    <ArrowRight className={cn('h-4 w-4 ml-2', lang === 'ur' && 'rotate-180')} />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20">
                <Scale className="h-16 w-16 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Resources */}
      <section className="container mx-auto max-w-7xl px-4 py-16 border-t border-border/40">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('Smart Tools to Help You', 'آپ کی مدد کے لیے ذہین اوزار')}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-2xl mx-auto">
            {t(
              'Beyond a directory — explore interactive features to better understand Pakistan\'s legal system.',
              'ڈائریکٹری سے آگے — پاکستان کے قانونی نظام کو بہتر سمجھنے کے لیے انٹرایکٹو خصوصیات دریافت کریں۔'
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ToolCard
            icon={Compass}
            titleEn="Which Law Applies?"
            titleUr="کون سا قانون لاگو ہوتا ہے؟"
            descriptionEn="Answer a few quick questions to find which Pakistani statutes and courts apply to your situation."
            descriptionUr="چند فوری سوالات کے جوابات دیں تاکہ معلوم ہو سکے کہ کون سا قانون آپ کی صورتحال پر لاگو ہوتا ہے۔"
            href="/finder"
            color="#2563eb"
            delay={0}
          />
          <ToolCard
            icon={Landmark}
            titleEn="Court Hierarchy Guide"
            titleUr="عدالتی درجہ بندی رہنمائی"
            descriptionEn="Visualize Pakistan's court system — Supreme Court, High Courts, Sessions Courts, Magistrates & special tribunals."
            descriptionUr="پاکستان کا عدالتی نظام بصری شکل میں — سپریم کورٹ، ہائی کورٹس، سیشن کورٹس، مجسٹریٹ اور خصوصی محکمے۔"
            href="/courts"
            color="#0d9488"
            delay={60}
          />
          <ToolCard
            icon={BookOpen}
            titleEn="Legal Glossary"
            titleUr="قانونی فرہنگ"
            descriptionEn="Bilingual dictionary of legal terms — FIR, Talaq, Khula, Qisas, and more. With audio pronunciation."
            descriptionUr="قانونی اصطلاحات کی دو لسانی فرہنگ — ایف آئی آر، طلاق، خلع، قصاص، وغیرہ۔ آڈیو تلفظ کے ساتھ۔"
            href="/glossary"
            color="#db2777"
            delay={120}
          />
        </div>
      </section>

      {/* Services: Lawyers + Templates */}
      <section className="container mx-auto max-w-7xl px-4 py-16 border-t border-border/40">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('Connect & Create', 'ربط قائم کریں اور بنائیں')}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-2xl mx-auto">
            {t(
              'Find a verified lawyer or generate common legal documents in minutes.',
              'تصدیق شدہ وکیل تلاش کریں یا منٹوں میں عام قانونی دستاویزات تیار کریں۔'
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ToolCard
            icon={Briefcase}
            titleEn="Lawyer Directory"
            titleUr="وکلاء ڈائریکٹری"
            descriptionEn="Browse verified lawyers across Pakistan by city and specialization. View ratings, contact details, and credentials."
            descriptionUr="پاکستان بھر میں تصدیق شدہ وکلاء شہر اور تخصیص کے لحاظ سے دیکھیں۔ درجہ بندی، رابطہ تفصیلات، اور اسناد۔"
            href="/lawyers"
            color="#0d9488"
            delay={0}
          />
          <ToolCard
            icon={FilePlus}
            titleEn="Document Templates"
            titleUr="دستاویز ٹیمپلیٹس"
            descriptionEn="Affidavits, tenancy agreements, NDAs, sale deeds — fill in and download common legal documents."
            descriptionUr="حلفی بیانات، کرایہ معاہدے، این ڈی اے، بیع نامے — بھریں اور عام قانونی دستاویزات ڈاؤن لوڈ کریں۔"
            href="/templates"
            color="#9333ea"
            badge="New"
            delay={60}
          />
        </div>
      </section>

      {/* Top Searches + Language Toggle */}
      {stats && stats.topSearches.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 pb-16 border-t border-border/40 pt-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-3 flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                {t('Popular Searches', 'مقبول تلاشیں')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {stats.topSearches.map((s) => (
                  <Link key={s.query} href={`/laws?q=${encodeURIComponent(s.query)}`}>
                    <Badge variant="secondary" className="px-3 py-1.5 text-sm hover:bg-accent cursor-pointer transition-colors">
                      {s.query} <span className="ml-1 text-muted-foreground">×{s.count}</span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Languages className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('Bilingual Support', 'دو لسانی تعاون')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(
                      'Toggle between English and Urdu any time using the language button in the header. All summaries, section titles, and law names are available in both languages.',
                      'ہیڈر میں موجود بٹن کے ذریعے کسی بھی وقت انگریزی اور اردو کے درمیان بدلیں۔ تمام خلاصے، شقیں اور قانون کے نام دونوں زبانوں میں دستیاب ہیں۔'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function StatChip({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 backdrop-blur px-4 py-3 flex items-center gap-3">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <div className="text-xl font-bold tabular-nums leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  )
}

function CategoryCard({ cat, delay }: { cat: Category, delay: number }) {
  const { t, lang } = useLanguage()
  const Icon = cat.icon ? ICONS[cat.icon] ?? BookOpen : BookOpen
  const count = cat._count?.laws ?? 0
  return (
    <Link href={`/categories/${cat.slug}`} className="group block animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <Card className="hover:shadow-lg hover:border-primary/40 transition-all duration-300 h-full overflow-hidden relative">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: cat.color ?? undefined }}
        />
        <CardHeader className="flex flex-row items-start gap-3 pb-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-lg text-white shrink-0"
            style={{ backgroundColor: cat.color ?? 'var(--primary)' }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base leading-tight">
              {lang === 'ur' && cat.nameUrdu ? cat.nameUrdu : cat.name}
            </CardTitle>

          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {lang === 'ur' && cat.descriptionUrdu ? cat.descriptionUrdu : cat.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">{count} {t('laws', 'قوانین')}</Badge>
            <ArrowRight className={cn('h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1', lang === 'ur' && 'rotate-180')} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function timeAgo(isoDate: string, lang: 'en' | 'ur'): string {
  const date = new Date(isoDate)
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (lang === 'ur') {
    if (diffMin < 1) return 'ابھی'
    if (diffMin < 60) return `${diffMin} منٹ پہلے`
    if (diffHr < 24) return `${diffHr} گھنٹے پہلے`
    if (diffDay < 7) return `${diffDay} دن پہلے`
    if (diffWeek < 4) return `${diffWeek} ہفتے پہلے`
    if (diffMonth < 12) return `${diffMonth} ماہ پہلے`
    return `${diffYear} سال پہلے`
  }
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  if (diffWeek < 4) return `${diffWeek}w ago`
  if (diffMonth < 12) return `${diffMonth}mo ago`
  return `${diffYear}y ago`
}

function SkeletonCard() {
  return (
    <Card className="h-48">
      <CardContent className="p-6 space-y-4">
        <div className="h-11 w-11 rounded-lg bg-muted shimmer" />
        <div className="h-5 w-3/4 rounded bg-muted shimmer" />
        <div className="h-4 w-full rounded bg-muted shimmer" />
        <div className="h-4 w-2/3 rounded bg-muted shimmer" />
      </CardContent>
    </Card>
  )
}

function ToolCard({
  icon: Icon, titleEn, titleUr, descriptionEn, descriptionUr, href, color, badge, delay,
}: {
  icon: React.ComponentType<{ className?: string }>
  titleEn: string
  titleUr: string
  descriptionEn: string
  descriptionUr: string
  href: string
  color: string
  badge?: string
  delay: number
}) {
  const { t, lang } = useLanguage()
  return (
    <Link href={href} className="block group animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <Card className="relative overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full">
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: color }} />
        <CardContent className="p-6 pt-7 space-y-4">
          <div className="flex items-start justify-between">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md group-hover:scale-110 transition-transform"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
            >
              <Icon className="h-6 w-6" />
            </div>
            {badge && (
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">{badge}</Badge>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {t(titleEn, titleUr)}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(descriptionEn, descriptionUr)}
          </p>
          <div className="flex items-center gap-1 text-sm font-medium text-primary pt-2">
            {t('Open', 'کھولیں')}
            <ArrowRight className={cn('h-4 w-4 group-hover:translate-x-1 transition-transform', lang === 'ur' && 'rotate-180')} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
