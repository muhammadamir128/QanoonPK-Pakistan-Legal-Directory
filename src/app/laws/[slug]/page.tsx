'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronRight, ChevronLeft, Calendar, Building2, FileText, Gavel, ScrollText,
  Search, AlertTriangle, Bookmark, BookmarkCheck, Printer, ArrowRight, Tag,
  History, Eye, BookOpen, Quote, Layers, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/components/language-provider'
import { SocialShare } from '@/components/social-share'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_LABELS: Record<string, { en: string; ur: string; color: string }> = {
  active: { en: 'Active', ur: 'نافذ', color: '#059669' },
  repealed: { en: 'Repealed', ur: 'منسوخ', color: '#e11d48' },
  amended: { en: 'Amended', ur: 'ترمیم شدہ', color: '#d97706' },
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

type Section = {
  id: string
  sectionNumber: string
  title: string | null
  content: string
  contentUrdu: string | null
}

type Amendment = {
  id: string
  amendmentYear: number
  amendmentTitle: string
  description: string | null
  gazetteReference: string | null
}

type RelatedLaw = {
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted: number
  status: string
  viewCount: number
}

type LawDetail = {
  id: string
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted: number
  jurisdiction: string
  status: string
  summary: string | null
  summaryUrdu: string | null
  gazetteReference: string | null
  promulgatingAuthority: string | null
  applicabilityTags: string[]
  viewCount: number
  category: { id: string; name: string; nameUrdu: string; slug: string; color: string | null; description: string; descriptionUrdu: string | null }
  sections: Section[]
  amendments: Amendment[]
  tags: { tag: { id: string; name: string } }[]
  related: RelatedLaw[]
}

export default function LawDetailPage() {
  const { t, lang } = useLanguage()
  const params = useParams<{ slug: string }>()
  const [law, setLaw] = React.useState<LawDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [sectionSearch, setSectionSearch] = React.useState('')
  const [bookmarked, setBookmarked] = React.useState(false)
  const [recommendations, setRecommendations] = React.useState<Array<{
    slug: string
    title: string
    titleUrdu: string | null
    yearEnacted: number
    score: number
    reason: { en: string; ur: string }
    category: { name: string; nameUrdu: string; slug: string; color: string | null }
  }>>([])
  const { addRecentlyViewed } = useRecentlyViewed()

  React.useEffect(() => {
    if (!params.slug) return
    setLoading(true)
    fetch(`/api/laws/${params.slug}`)
      .then((r) => r.json())
      .then((d) => {
        setLaw(d)
        setLoading(false)
        // Track in recently viewed
        if (d && d.slug && d.title) {
          addRecentlyViewed({
            slug: d.slug,
            title: d.title,
            titleUrdu: d.titleUrdu,
            yearEnacted: d.yearEnacted,
            categorySlug: d.category?.slug ?? '',
            categoryName: d.category?.name ?? '',
            categoryColor: d.category?.color ?? null,
          })
        }
      })
      .catch(() => setLoading(false))

    // Fetch recommendations
    fetch(`/api/recommendations?slug=${params.slug}&limit=4`)
      .then((r) => r.json())
      .then((d) => setRecommendations(d.items ?? []))
      .catch(() => {})

    // Check local bookmark
    try {
      const stored = JSON.parse(localStorage.getItem('qpk-bookmarks') ?? '[]') as string[]
      setBookmarked(stored.includes(params.slug))
    } catch {}
  }, [params.slug])

  const toggleBookmark = () => {
    if (!params.slug) return
    try {
      const stored = JSON.parse(localStorage.getItem('qpk-bookmarks') ?? '[]') as string[]
      let next: string[]
      if (stored.includes(params.slug)) {
        next = stored.filter((s) => s !== params.slug)
        setBookmarked(false)
        toast.success(t('Removed from bookmarks', 'بک مارکس سے ہٹا دیا'))
      } else {
        next = [...stored, params.slug]
        setBookmarked(true)
        toast.success(t('Saved to bookmarks', 'بک مارک میں محفوظ ہو گیا'))
      }
      localStorage.setItem('qpk-bookmarks', JSON.stringify(next))
    } catch {}
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!law) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('Law not found', 'قانون نہیں ملا')}</h1>
        <p className="text-muted-foreground mb-6">
          {t('The law you\'re looking for does not exist or has been removed.', 'یہ قانون موجود نہیں یا ہٹا دیا گیا ہے۔')}
        </p>
        <Button asChild>
          <Link href="/laws">{t('Browse all laws', 'تمام قوانین دیکھیں')}</Link>
        </Button>
      </div>
    )
  }

  const status = STATUS_LABELS[law.status] ?? STATUS_LABELS.active
  const jur = JURISDICTION_LABELS[law.jurisdiction] ?? JURISDICTION_LABELS.federal

  const filteredSections = law.sections.filter((s) => {
    if (!sectionSearch.trim()) return true
    const q = sectionSearch.toLowerCase()
    return (
      s.sectionNumber.toLowerCase().includes(q) ||
      (s.title ?? '').toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q) ||
      (s.contentUrdu ?? '').includes(sectionSearch)
    )
  })

  return (
    <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-4 md:py-8">
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Legislation',
            name: law.title,
            alternateName: law.titleUrdu ?? undefined,
            legislationDate: `${law.yearEnacted}-01-01`,
            legislationJurisdiction: 'PK',
            legislationIdentifier: law.gazetteReference ?? law.slug,
            description: law.summary ?? undefined,
            url: typeof window !== 'undefined' ? window.location.href : `https://qanoonpk.example/laws/${law.slug}`,
            publisher: {
              '@type': 'Organization',
              name: law.promulgatingAuthority ?? 'QanoonPK',
            },
            about: {
              '@type': 'Thing',
              name: law.category.name,
            },
            audience: law.applicabilityTags?.map((tag: string) => ({
              '@type': 'Audience',
              name: tag,
            })),
          }),
        }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
        <Link href="/" className="hover:text-primary shrink-0">{t('Home', 'صفحۂ اول')}</Link>
        <ChevronRight className={cn('h-3 w-3 shrink-0', lang === 'ur' && 'rotate-180')} />
        <Link href="/laws" className="hover:text-primary shrink-0">{t('Laws', 'قوانین')}</Link>
        <ChevronRight className={cn('h-3 w-3 shrink-0', lang === 'ur' && 'rotate-180')} />
        <Link href={`/categories/${law.category.slug}`} className="hover:text-primary shrink-0" style={{ color: law.category.color ?? undefined }}>
          {lang === 'ur' && law.category.nameUrdu ? law.category.nameUrdu : law.category.name}
        </Link>
        <ChevronRight className={cn('h-3 w-3 shrink-0', lang === 'ur' && 'rotate-180')} />
        <span className="truncate max-w-[120px] sm:max-w-none text-foreground font-medium">{lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}</span>
      </nav>

      {/* Title block */}
      <div
        className="rounded-2xl overflow-hidden border border-border/60 mb-6 relative"
        style={{
          background: `linear-gradient(135deg, ${law.category.color ?? '#0d9488'}18 0%, transparent 60%)`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: law.category.color ?? '#0d9488' }}
        />
        <div className="p-4 sm:p-6 md:p-8 space-y-3.5 sm:space-y-4">
          {/* Top Bar: Category on left, Actions on right */}
          <div className="flex items-center justify-between gap-2.5">
            <Badge
              variant="secondary"
              className="font-medium text-xs truncate max-w-[180px] sm:max-w-xs"
              style={{
                backgroundColor: `${law.category.color ?? '#0d9488'}1a`,
                color: law.category.color ?? '#0d9488',
                border: 'none',
              }}
            >
              {lang === 'ur' && law.category.nameUrdu ? law.category.nameUrdu : law.category.name}
            </Badge>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant={bookmarked ? 'default' : 'outline'}
                size="sm"
                onClick={toggleBookmark}
                className="h-8 px-2.5 text-xs cursor-pointer"
              >
                {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5 sm:mr-1.5 text-primary" /> : <Bookmark className="h-3.5 w-3.5 sm:mr-1.5" />}
                <span className="hidden sm:inline">{bookmarked ? t('Saved', 'محفوظ') : t('Save', 'محفوظ کریں')}</span>
              </Button>
              <SocialShare title={law.title} slug={params.slug} size="icon" className="h-8 w-8" />
              <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 w-8 hidden sm:flex cursor-pointer">
                <Printer className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Badges row: Year, Jurisdiction, Status */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              <Calendar className="h-3 w-3 mr-1" />
              {law.yearEnacted}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              <Building2 className="h-3 w-3 mr-1" />
              {lang === 'ur' ? jur.ur : jur.en}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5" style={{ color: status.color, borderColor: `${status.color}40` }}>
              <Gavel className="h-3 w-3 mr-1" />
              {lang === 'ur' ? status.ur : status.en}
            </Badge>
          </div>

          {/* Law Title: Full Width */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug sm:leading-tight text-foreground">
            {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
          </h1>

          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-border/40">
            <MetaItem icon={Eye} label={t('Views', 'مشاہدات')} value={law.viewCount} />
            <MetaItem icon={ScrollText} label={t('Sections', 'شقیں')} value={law.sections.length} />
            <MetaItem icon={History} label={t('Amendments', 'ترامیم')} value={law.amendments.length} />
            <MetaItem icon={Calendar} label={t('Enacted', 'نافذ')} value={String(law.yearEnacted)} />
          </div>

          {/* Authority + gazette */}
          {(law.promulgatingAuthority || law.gazetteReference) && (
            <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap pt-1">
              {law.promulgatingAuthority && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="font-medium">{t('Authority:', 'اتھارٹی:')}</span>
                  {law.promulgatingAuthority}
                </span>
              )}
              {law.gazetteReference && (
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="font-medium">{t('Gazette:', 'گزٹ:')}</span>
                  {law.gazetteReference}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {t('Plain-Language Summary', 'آسان خلاصہ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base leading-relaxed text-foreground/90">
                {lang === 'ur' && law.summaryUrdu ? law.summaryUrdu : law.summary ?? ''}
              </p>
            </CardContent>
          </Card>

          {/* Sections */}
          {law.sections.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      {t('Section-by-Section', 'شق وار تفصیل')}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {law.sections.length} {t('sections', 'شقیں')}
                      {sectionSearch && ` • ${filteredSections.length} ${t('matching', 'مطابق')}`}
                    </CardDescription>
                  </div>
                  {law.sections.length > 4 && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="search"
                        placeholder={t('Search within law...', 'قانون میں تلاش...')}
                        value={sectionSearch}
                        onChange={(e) => setSectionSearch(e.target.value)}
                        className="h-9 pl-8 w-64 text-sm"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredSections.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    {t('No sections match your search.', 'کوئی شق مطابق نہیں۔')}
                  </p>
                ) : (
                  filteredSections.map((section) => (
                    <div
                      key={section.id}
                      className="rounded-lg border border-border/60 p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-baseline gap-3 mb-2">
                        <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5">
                          {t('Sec.', 'شق')} {section.sectionNumber}
                        </Badge>
                        {section.title && (
                          <h3 className="font-semibold text-sm">{section.title}</h3>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                        {highlightSearch(lang === 'ur' && section.contentUrdu ? section.contentUrdu : section.content, sectionSearch)}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Amendments */}
          {law.amendments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  {t('Amendment Timeline', 'ترامیم کا ٹائم لائن')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative border-s-2 border-border/60 space-y-6 ms-3">
                  {law.amendments.map((a, i) => (
                    <li key={a.id} className="ms-6">
                      <span
                        className="absolute -start-2 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background"
                        style={{ backgroundColor: law.category.color ?? 'var(--primary)' }}
                      />
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs font-mono">{a.amendmentYear}</Badge>
                        {a.gazetteReference && (
                          <Badge variant="secondary" className="text-[10px]">{a.gazetteReference}</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mt-1.5">{a.amendmentTitle}</h3>
                      {a.description && (
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{a.description}</p>
                      )}
                      {i < law.amendments.length - 1 && (
                        <Separator className="mt-6" />
                      )}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Applicability */}
          {law.applicabilityTags && law.applicabilityTags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  {t('Who does this affect?', 'کس پر لاگو ہوتا ہے؟')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {law.applicabilityTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {law.tags && law.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  {t('Topic Tags', 'موضوعی ٹیگز')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {law.tags.map(({ tag }) => (
                    <Link key={tag.id} href={`/laws?q=${encodeURIComponent(tag.name)}`}>
                      <Badge variant="outline" className="text-xs hover:bg-accent cursor-pointer">#{tag.name}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related laws */}
          {law.related && law.related.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {t('Related Laws', 'متعلقہ قوانین')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {law.related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/laws/${r.slug}`}
                    className="block p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-accent/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {lang === 'ur' && r.titleUrdu ? r.titleUrdu : r.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <span>{r.yearEnacted}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-0.5">
                            <Eye className="h-3 w-3" /> {r.viewCount}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className={cn('h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform', lang === 'ur' && 'rotate-180')} />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* You Might Also Be Interested In */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t('You Might Also Like', 'آپ کو یہ بھی پسند آ سکتے ہیں')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recommendations.map((rec) => (
                  <Link
                    key={rec.slug}
                    href={`/laws/${rec.slug}`}
                    className="group flex items-start gap-3 p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-accent/50 transition-all"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full shrink-0 text-[10px] font-bold text-white mt-0.5"
                      style={{ backgroundColor: rec.category.color ?? 'var(--primary)' }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {lang === 'ur' && rec.titleUrdu ? rec.titleUrdu : rec.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground" style={{ color: rec.category.color ?? undefined }}>
                          {rec.category.name}
                        </span>
                        <Badge variant="outline" className="text-[9px] py-0">{lang === 'ur' ? rec.reason.ur : rec.reason.en}</Badge>
                      </div>
                    </div>
                    <ArrowRight className={cn('h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1.5', lang === 'ur' && 'rotate-180')} />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Mini disclaimer */}
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-300/50 dark:border-amber-700/40">
            <CardContent className="p-4">
              <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <p className="leading-relaxed">
                  {t(
                    'This is a directory, not legal advice. Always consult a licensed lawyer for your specific situation.',
                    'یہ ڈائریکٹری ہے، قانونی مشورہ نہیں۔ اپنے مخصوص مسئلے کے لیے ہمیشہ لائسنس یافتہ وکیل سے رجوع کریں۔'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetaItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span className="text-sm font-semibold tabular-nums mt-0.5">{value}</span>
    </div>
  )
}

function highlightSearch(text: string, q: string) {
  if (!q.trim()) return text
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return text
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + q.length)
  const after = text.slice(idx + q.length)
  return (
    <>
      {before}
      <mark className="bg-yellow-200 dark:bg-yellow-500/40 rounded px-0.5">{match}</mark>
      {after}
    </>
  )
}
