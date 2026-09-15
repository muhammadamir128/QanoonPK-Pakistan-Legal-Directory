'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ChevronRight, GitCompare, Search, ArrowRight, AlertTriangle, Calendar,
  Building2, Gavel, FileText, ScrollText, History, Eye, X, Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

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

type CompareLaw = {
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
  category: { id: string; name: string; nameUrdu: string; slug: string; color: string | null }
  sections: Section[]
  amendments: Amendment[]
}

export default function ComparePage() {
  return (
    <React.Suspense fallback={<div className="container mx-auto max-w-6xl px-4 py-12"><Skeleton className="h-12 w-1/2" /></div>}>
      <ComparePageInner />
    </React.Suspense>
  )
}

function ComparePageInner() {
  const { t, lang } = useLanguage()
  const searchParams = useSearchParams()
  const [law1, setLaw1] = React.useState<CompareLaw | null>(null)
  const [law2, setLaw2] = React.useState<CompareLaw | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [search1, setSearch1] = React.useState(searchParams.get('slug1') ?? '')
  const [search2, setSearch2] = React.useState(searchParams.get('slug2') ?? '')
  const [allLaws, setAllLaws] = React.useState<Array<{ slug: string; title: string; titleUrdu: string | null; category: { name: string; color: string | null } }>>([])
  const [suggestions, setSuggestions] = React.useState<Array<{ slug: string; title: string; titleUrdu: string | null; reason: { en: string; ur: string }; category: { name: string; color: string | null } }>>([])

  React.useEffect(() => {
    fetch('/api/laws?limit=200').then((r) => r.json()).then((d) => setAllLaws(d.items ?? []))
  }, [])

  // Fetch smart suggestions when first law is selected but second isn't
  React.useEffect(() => {
    if (search1 && !search2) {
      fetch(`/api/recommendations?slug=${search1}&limit=5`)
        .then((r) => r.json())
        .then((d) => setSuggestions(d.items ?? []))
        .catch(() => setSuggestions([]))
    } else {
      setSuggestions([])
    }
  }, [search1, search2])

  React.useEffect(() => {
    const s1 = searchParams.get('slug1')
    const s2 = searchParams.get('slug2')
    if (!s1 || !s2) {
      setLoading(false)
      return
    }
    setSearch1(s1)
    setSearch2(s2)
    setLoading(true)
    fetch(`/api/compare?slug1=${s1}&slug2=${s2}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setLaw1(d.law1)
          setLaw2(d.law2)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [searchParams])

  const startCompare = () => {
    if (!search1 || !search2 || search1 === search2) return
    window.history.pushState(null, '', `/compare?slug1=${search1}&slug2=${search2}`)
    // Trigger reload by dispatching popstate
    window.dispatchEvent(new PopStateEvent('popstate'))
    // Also re-fetch directly
    setLoading(true)
    fetch(`/api/compare?slug1=${search1}&slug2=${search2}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setLaw1(d.law1)
          setLaw2(d.law2)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const clearCompare = () => {
    setLaw1(null)
    setLaw2(null)
    setSearch1('')
    setSearch2('')
    window.history.pushState(null, '', '/compare')
  }

  const filtered1 = allLaws.filter((l) => {
    if (!search1) return false
    if (l.slug === search1) return false
    return l.title.toLowerCase().includes(search1.toLowerCase()) || l.slug.includes(search1.toLowerCase())
  }).slice(0, 5)

  const filtered2 = allLaws.filter((l) => {
    if (!search2) return false
    if (l.slug === search2) return false
    if (l.slug === search1) return false
    return l.title.toLowerCase().includes(search2.toLowerCase()) || l.slug.includes(search2.toLowerCase())
  }).slice(0, 5)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('Compare Laws', 'قوانین کا موازنہ')}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shrink-0">
            <GitCompare className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('Compare Laws Side-by-Side', 'قوانین کا موازنہ')}</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              {t(
                'Select two laws to compare their details, sections, and amendments side by side.',
                'دو قوانین منتخب کریں تاکہ ان کی تفصیلات، شقیں، اور ترامیم کا موازنہ کیا جا سکے۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Selection */}
      {!law1 || !law2 ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              {t('Select Two Laws to Compare', 'موازنے کے لیے دو قوانین منتخب کریں')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Law 1 selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t('First Law', 'پہلا قانون')}</label>
                <Input
                  type="search"
                  placeholder={t('Search first law by name or slug...', 'پہلا قانون نام یا سلگ سے تلاش کریں...')}
                  value={search1}
                  onChange={(e) => setSearch1(e.target.value)}
                  className="h-10"
                />
                {filtered1.length > 0 && (
                  <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin border border-border/40 rounded-lg p-1.5 bg-background">
                    {filtered1.map((l) => (
                      <button
                        key={l.slug}
                        onClick={() => setSearch1(l.slug)}
                        className="w-full text-left p-2 rounded hover:bg-accent transition-colors text-sm"
                      >
                        <span className="inline-flex h-2 w-2 rounded-full mr-2" style={{ backgroundColor: l.category.color ?? 'var(--primary)' }} />
                        <span className="font-medium">{lang === 'ur' && l.titleUrdu ? l.titleUrdu : l.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">({l.slug})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Law 2 selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t('Second Law', 'دوسرا قانون')}</label>
                <Input
                  type="search"
                  placeholder={t('Search second law by name or slug...', 'دوسرا قانون نام یا سلگ سے تلاش کریں...')}
                  value={search2}
                  onChange={(e) => setSearch2(e.target.value)}
                  className="h-10"
                />
                {filtered2.length > 0 && (
                  <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin border border-border/40 rounded-lg p-1.5 bg-background">
                    {filtered2.map((l) => (
                      <button
                        key={l.slug}
                        onClick={() => setSearch2(l.slug)}
                        className="w-full text-left p-2 rounded hover:bg-accent transition-colors text-sm"
                      >
                        <span className="inline-flex h-2 w-2 rounded-full mr-2" style={{ backgroundColor: l.category.color ?? 'var(--primary)' }} />
                        <span className="font-medium">{lang === 'ur' && l.titleUrdu ? l.titleUrdu : l.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">({l.slug})</span>
                      </button>
                    ))}
                  </div>
                )}
                {/* Smart suggestions */}
                {suggestions.length > 0 && filtered2.length === 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                      <Lightbulb className="h-3 w-3 text-primary" />
                      {t('Suggested to compare', 'موازنے کے لیے تجویز کردہ')}
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
                      {suggestions.map((s) => (
                        <button
                          key={s.slug}
                          onClick={() => setSearch2(s.slug)}
                          className="w-full text-left p-2 rounded border border-border/40 hover:border-primary/40 hover:bg-accent/50 transition-all text-sm flex items-center gap-2"
                        >
                          <span className="inline-flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.category.color ?? 'var(--primary)' }} />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium truncate block">{lang === 'ur' && s.titleUrdu ? s.titleUrdu : s.title}</span>
                            <span className="text-[10px] text-muted-foreground">{lang === 'ur' ? s.reason.ur : s.reason.en}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={startCompare} disabled={!search1 || !search2 || search1 === search2}>
                <GitCompare className="h-4 w-4 mr-2" />
                {t('Compare Now', 'ابھی موازنہ کریں')}
              </Button>
              {(search1 || search2) && (
                <Button variant="ghost" onClick={() => { setSearch1(''); setSearch2('') }}>
                  <X className="h-4 w-4 mr-1" />
                  {t('Clear', 'صاف')}
                </Button>
              )}
              {search1 && search2 && search1 === search2 && (
                <p className="text-xs text-amber-600">{t('Please select two different laws', 'براہ کرم دو مختلف قوانین منتخب کریں')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      ) : (
        <>
          {/* Clear button */}
          <div className="flex items-center justify-end mb-4">
            <Button variant="ghost" size="sm" onClick={clearCompare}>
              <X className="h-4 w-4 mr-1.5" />
              {t('Clear Comparison', 'موازنہ صاف کریں')}
            </Button>
          </div>

          {/* Comparison grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <LawCompareCard law={law1} t={t} lang={lang} />
            <LawCompareCard law={law2} t={t} lang={lang} />
          </div>
        </>
      )}

      {/* Disclaimer */}
      <Card className="mt-8 bg-amber-50 dark:bg-amber-950/20 border-amber-300/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              {t(
                'This comparison is for educational purposes. Differences in scope, amendments, and context may affect applicability. Always consult a licensed lawyer for your specific situation.',
                'یہ موازنہ صرف تعلیمی مقاصد کے لیے ہے۔ دائرہ کار، ترامیم، اور تناظر میں فرق لاگو پذیری کو متاثر کر سکتے ہیں۔ مخصوص صورتِ حال کے لیے ہمیشہ لائسنس یافتہ وکیل سے رجوع کریں۔'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LawCompareCard({
  law, t, lang,
}: {
  law: CompareLaw
  t: (en: string, ur?: string) => string
  lang: 'en' | 'ur'
}) {
  const color = law.category.color ?? '#0d9488'
  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
      <CardHeader>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="secondary" style={{ backgroundColor: `${color}1a`, color, border: 'none' }}>
            {lang === 'ur' ? law.category.nameUrdu : law.category.name}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />{law.yearEnacted}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />{law.jurisdiction}
          </Badge>
          <Badge variant="outline" className="text-xs" style={{ color: law.status === 'active' ? '#059669' : law.status === 'repealed' ? '#e11d48' : '#d97706' }}>
            <Gavel className="h-3 w-3 mr-1" />{law.status}
          </Badge>
        </div>
        <CardTitle className="text-lg md:text-xl leading-tight">
          <Link href={`/laws/${law.slug}`} className="hover:text-primary transition-colors">
            {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
          </Link>
        </CardTitle>


      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meta */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 p-2">
            <Eye className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <div className="text-sm font-bold tabular-nums">{law.viewCount}</div>
            <div className="text-[10px] text-muted-foreground">{t('Views', 'مشاہدات')}</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-2">
            <ScrollText className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <div className="text-sm font-bold tabular-nums">{law.sections.length}</div>
            <div className="text-[10px] text-muted-foreground">{t('Sections', 'شقیں')}</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-2">
            <History className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <div className="text-sm font-bold tabular-nums">{law.amendments.length}</div>
            <div className="text-[10px] text-muted-foreground">{t('Amendments', 'ترامیم')}</div>
          </div>
        </div>

        {/* Summary */}
        {law.summary && (
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
              <FileText className="h-3 w-3" />{t('Summary', 'خلاصہ')}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
              {lang === 'ur' && law.summaryUrdu ? law.summaryUrdu : law.summary}
            </p>
          </div>
        )}

        {/* Authority */}
        {law.promulgatingAuthority && (
          <div className="text-[10px] text-muted-foreground">
            <span className="font-medium">{t('Authority:', 'اتھارٹی:')}</span> {law.promulgatingAuthority}
          </div>
        )}
        {law.gazetteReference && (
          <div className="text-[10px] text-muted-foreground">
            <span className="font-medium">{t('Gazette:', 'گزٹ:')}</span> {law.gazetteReference}
          </div>
        )}

        {/* Applicability */}
        {law.applicabilityTags && law.applicabilityTags.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">{t('Applies to', 'لاگو ہوتا ہے')}</p>
            <div className="flex flex-wrap gap-1">
              {law.applicabilityTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Sections preview */}
        {law.sections.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">{t('Key Sections', 'اہم شقیں')}</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
              {law.sections.slice(0, 5).map((s) => (
                <div key={s.id} className="rounded border border-border/40 p-2">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">Sec. {s.sectionNumber}</Badge>
                    {s.title && <span className="text-xs font-medium">{s.title}</span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{s.content}</p>
                </div>
              ))}
              {law.sections.length > 5 && (
                <p className="text-[10px] text-muted-foreground text-center pt-1">
                  +{law.sections.length - 5} {t('more sections', 'مزید شقیں')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Link to full law */}
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/laws/${law.slug}`}>
            {t('View Full Law', 'مکمل قانون دیکھیں')}
            <ArrowRight className={cn('h-3.5 w-3.5 ml-1.5', lang === 'ur' && 'rotate-180')} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
