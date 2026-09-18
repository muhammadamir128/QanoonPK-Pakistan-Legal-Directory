'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ChevronRight, GitCompare, Search, ArrowRight, Calendar,
  Building2, Gavel, FileText, ScrollText, History, Eye, X, Lightbulb,
  ArrowLeftRight, Copy, Check, Printer, Sparkles, Filter, Layers,
  CheckCircle2, Scale, Tag, ArrowUpRight, BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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

type SimpleLaw = {
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted?: number
  jurisdiction?: string
  category: { name: string; nameUrdu?: string; color: string | null }
}

const POPULAR_COMPARISONS = [
  {
    slug1: 'pakistan-penal-code-1860',
    slug2: 'code-of-criminal-procedure-1898',
    title1: 'Pakistan Penal Code 1860',
    title2: 'Code of Criminal Procedure 1898',
    category: 'Criminal Law',
    categoryUrdu: 'فوجداری قانون',
    color: '#dc2626',
    descEn: 'Substantive Offenses & Penalties vs Procedural Investigation & Bail Rules',
    descUr: 'جرائم کی سزائیں بمقابلہ پولیس تفتیش، ضمانت اور ٹرائل کا ضابطہ',
  },
  {
    slug1: 'muslim-family-laws-ordinance-1961',
    slug2: 'family-courts-act-1964',
    title1: 'Muslim Family Laws Ordinance 1961',
    title2: 'Family Courts Act 1964',
    category: 'Family Law',
    categoryUrdu: 'خاندانی قانون',
    color: '#db2777',
    descEn: 'Substantive Marriage, Dower & Divorce Rights vs Family Court Jurisdiction',
    descUr: 'نکاح و خلع کے حقوق بمقابلہ فیملی کورٹ کے اختیارات اور دائرہ کار',
  },
  {
    slug1: 'prevention-of-electronic-crimes-act-2016',
    slug2: 'electronic-transactions-ordinance-2002',
    title1: 'PECA 2016',
    title2: 'Electronic Transactions Ord. 2002',
    category: 'Cyber & IT Law',
    categoryUrdu: 'سائبر و آئی ٹی قانون',
    color: '#6366f1',
    descEn: 'Cyber Crimes & Online Harassment vs Digital Signatures & E-Commerce',
    descUr: 'آن لائن جرائم و سزائیں بمقابلہ الیکٹرانک دستاویزات اور ڈیجیٹل لین دین',
  },
  {
    slug1: 'qanun-e-shahadat-order-1984',
    slug2: 'pakistan-penal-code-1860',
    title1: 'Qanun-e-Shahadat Order 1984',
    title2: 'Pakistan Penal Code 1860',
    category: 'Evidence & Penal',
    categoryUrdu: 'شہادت و تعزیرات',
    color: '#059669',
    descEn: 'Rules of Evidence & Witness Competency vs Definition of Criminal Acts',
    descUr: 'ثبوت و گواہی کے تقاضے بمقابلہ فوجداری جرائم کے اجزاء',
  },
  {
    slug1: 'industrial-relations-act-2012',
    slug2: 'factories-act-1934',
    title1: 'Industrial Relations Act 2012',
    title2: 'Factories Act 1934',
    category: 'Labor Law',
    categoryUrdu: 'مزدور قانون',
    color: '#ea580c',
    descEn: 'Trade Unions & Collective Bargaining vs Factory Safety & Working Hours',
    descUr: 'یونینز اور صنعتی تنازعات بمقابلہ کارخانوں کی حفاظت اور اوقات کار',
  },
]

export default function ComparePage() {
  return (
    <React.Suspense fallback={<div className="container mx-auto max-w-7xl px-4 py-12"><Skeleton className="h-16 w-1/3 mb-6" /><Skeleton className="h-96 w-full" /></div>}>
      <ComparePageInner />
    </React.Suspense>
  )
}

function ComparePageInner() {
  const { t, lang } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [law1, setLaw1] = React.useState<CompareLaw | null>(null)
  const [law2, setLaw2] = React.useState<CompareLaw | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [search1, setSearch1] = React.useState(searchParams.get('slug1') ?? '')
  const [search2, setSearch2] = React.useState(searchParams.get('slug2') ?? '')
  const [inputQuery1, setInputQuery1] = React.useState('')
  const [inputQuery2, setInputQuery2] = React.useState('')
  const [showPicker1, setShowPicker1] = React.useState(false)
  const [showPicker2, setShowPicker2] = React.useState(false)
  const [allLaws, setAllLaws] = React.useState<SimpleLaw[]>([])
  const [sectionFilter, setSectionFilter] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<'overview' | 'matrix' | 'sections' | 'amendments'>('overview')
  const [copied, setCopied] = React.useState(false)

  // Fetch laws directory list for autocomplete
  React.useEffect(() => {
    fetch('/api/laws?limit=300')
      .then((r) => r.json())
      .then((d) => setAllLaws(d.items ?? []))
      .catch(() => {})
  }, [])

  // Load comparison when searchParams change
  React.useEffect(() => {
    const s1 = searchParams.get('slug1')
    const s2 = searchParams.get('slug2')
    if (!s1 || !s2) {
      setLaw1(null)
      setLaw2(null)
      setLoading(false)
      return
    }
    setSearch1(s1)
    setSearch2(s2)
    setLoading(true)
    fetch(`/api/compare?slug1=${s1}&slug2=${s2}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.law1 && d.law2) {
          setLaw1(d.law1)
          setLaw2(d.law2)
        } else {
          toast.error(t('Could not load comparison for these laws.', 'ان قوانین کا موازنہ لوڈ نہیں کیا جا سکا۔'))
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error(t('Network error while comparing laws.', 'موازنہ لوڈ کرتے وقت نیٹ ورک کی خرابی۔'))
        setLoading(false)
      })
  }, [searchParams, t])

  const executeCompare = (slugA: string, slugB: string) => {
    if (!slugA || !slugB || slugA === slugB) return
    router.push(`/compare?slug1=${slugA}&slug2=${slugB}`)
  }

  const handleSwap = () => {
    if (!search1 || !search2) return
    const temp = search1
    setSearch1(search2)
    setSearch2(temp)
    if (law1 && law2) {
      const tempLaw = law1
      setLaw1(law2)
      setLaw2(tempLaw)
      window.history.pushState(null, '', `/compare?slug1=${search2}&slug2=${temp}`)
    }
  }

  const handleClear = () => {
    setLaw1(null)
    setLaw2(null)
    setSearch1('')
    setSearch2('')
    setInputQuery1('')
    setInputQuery2('')
    router.push('/compare')
  }

  const copyComparisonLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true)
        toast.success(t('Comparison link copied to clipboard!', 'موازنے کا لنک کاپی ہو گیا!'))
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  // Selected law details helper
  const selectedLaw1Info = allLaws.find((l) => l.slug === search1)
  const selectedLaw2Info = allLaws.find((l) => l.slug === search2)

  // Filtered dropdown results
  const filteredLaws1 = allLaws.filter((l) => {
    if (l.slug === search2) return false
    if (!inputQuery1) return true
    const q = inputQuery1.toLowerCase()
    return l.title.toLowerCase().includes(q) || (l.titleUrdu && l.titleUrdu.includes(q)) || l.slug.includes(q)
  }).slice(0, 8)

  const filteredLaws2 = allLaws.filter((l) => {
    if (l.slug === search1) return false
    if (!inputQuery2) return true
    const q = inputQuery2.toLowerCase()
    return l.title.toLowerCase().includes(q) || (l.titleUrdu && l.titleUrdu.includes(q)) || l.slug.includes(q)
  }).slice(0, 8)

  // Matching sections when user filters sections
  const matchingSections1 = law1 ? law1.sections.filter((s) => {
    if (!sectionFilter) return true
    const q = sectionFilter.toLowerCase()
    return s.sectionNumber.includes(q) || (s.title && s.title.toLowerCase().includes(q)) || s.content.toLowerCase().includes(q)
  }) : []

  const matchingSections2 = law2 ? law2.sections.filter((s) => {
    if (!sectionFilter) return true
    const q = sectionFilter.toLowerCase()
    return s.sectionNumber.includes(q) || (s.title && s.title.toLowerCase().includes(q)) || s.content.toLowerCase().includes(q)
  }) : []

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 md:py-6 space-y-4 sm:space-y-5">
      {/* Breadcrumb & Hero Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
          <Link href="/" className="hover:text-primary transition-colors">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <Link href="/laws" className="hover:text-primary transition-colors">{t('Laws', 'قوانین')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span className="text-foreground font-medium">{t('Compare Laws', 'قوانین کا موازنہ')}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xs shrink-0">
              <GitCompare className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                  {t('Compare Laws Side-by-Side', 'قوانین کا آمنے سامنے موازنہ')}
                </h1>
                <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                  {t('Dual Statute Analysis', 'تقابلی جائزہ')}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm max-w-2xl">
                {t(
                  'Select two Pakistani federal or provincial laws to compare jurisdiction, year enacted, amendments, sections, and legal scope side-by-side.',
                  'پاکستان کے دو وفاقی یا صوبائی قوانین منتخب کریں تاکہ ان کی تاریخ، دائرہ اختیار، ترامیم اور دفعات کا تقابلی موازنہ دیکھا جا سکے۔'
                )}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons (when comparing) */}
          {law1 && law2 && (
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleSwap} className="h-9 gap-1.5 text-xs">
                <ArrowLeftRight className="h-3.5 w-3.5" />
                {t('Swap Laws', 'تبدیل کریں')}
              </Button>
              <Button variant="outline" size="sm" onClick={copyComparisonLink} className="h-9 gap-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t('Copied!', 'کاپی شدہ') : t('Share', 'شیئر')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} className="h-9 gap-1.5 text-xs hidden sm:inline-flex">
                <Printer className="h-3.5 w-3.5" />
                {t('Print', 'پرنٹ')}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-9 text-xs text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5 mr-1" />
                {t('Reset', 'ری سیٹ')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Compact Selector Card */}
      <Card className="border-border/60 shadow-xs bg-card/80">
        <CardContent className="p-3 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
              {t('Select Two Laws to Compare', 'موازنے کے لیے دو قوانین منتخب کریں')}
            </span>
            {(search1 || search2) && (
              <button
                type="button"
                onClick={() => { setSearch1(''); setSearch2(''); setInputQuery1(''); setInputQuery2(''); }}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('Clear Selection', 'انتخاب صاف کریں')}
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* Law 1 Picker */}
            <div className="flex-1 w-full relative">
              {search1 ? (
                <div className="flex items-center justify-between h-10 px-3 rounded-lg border border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: selectedLaw1Info?.category.color ?? '#0d9488' }} />
                    <span className="font-medium text-xs sm:text-sm truncate">
                      {lang === 'ur' && selectedLaw1Info?.titleUrdu ? selectedLaw1Info.titleUrdu : (selectedLaw1Info?.title ?? search1)}
                    </span>
                    {selectedLaw1Info?.yearEnacted && (
                      <span className="text-[10px] text-muted-foreground font-mono shrink-0">({selectedLaw1Info.yearEnacted})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSearch1(''); setShowPicker1(true); }}
                    className="p-1 text-muted-foreground hover:text-foreground rounded shrink-0"
                    title={t('Change', 'تبدیل')}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder={t('Search first law by name or slug...', 'پہلا قانون تلاش کریں...')}
                    value={inputQuery1}
                    onFocus={() => setShowPicker1(true)}
                    onChange={(e) => { setInputQuery1(e.target.value); setShowPicker1(true); }}
                    className="pl-8.5 h-10 text-xs sm:text-sm"
                  />
                  {showPicker1 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
                      <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground flex justify-between items-center border-b border-border/40 mb-1">
                        <span>{t('Available Laws', 'دستیاب قوانین')} ({filteredLaws1.length})</span>
                        <button type="button" onClick={() => setShowPicker1(false)} className="hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      {filteredLaws1.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          {t('No laws found matching search', 'کوئی قانون نہیں ملا')}
                        </div>
                      ) : (
                        filteredLaws1.map((l) => (
                          <button
                            key={l.slug}
                            type="button"
                            onClick={() => {
                              setSearch1(l.slug);
                              setShowPicker1(false);
                              setInputQuery1('');
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-accent text-xs flex items-center justify-between gap-2 transition-colors"
                          >
                            <div className="min-w-0">
                              <span className="font-medium text-foreground block truncate">
                                {lang === 'ur' && l.titleUrdu ? l.titleUrdu : l.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {l.category.name} {l.yearEnacted ? `• ${l.yearEnacted}` : ''}
                              </span>
                            </div>
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: l.category.color ?? '#0d9488' }} />
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              disabled={!search1 && !search2}
              title={t('Swap Laws', 'تبدیل کریں')}
              className="h-10 w-10 shrink-0 rounded-lg border-border hover:bg-muted"
            >
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Law 2 Picker */}
            <div className="flex-1 w-full relative">
              {search2 ? (
                <div className="flex items-center justify-between h-10 px-3 rounded-lg border border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: selectedLaw2Info?.category.color ?? '#0d9488' }} />
                    <span className="font-medium text-xs sm:text-sm truncate">
                      {lang === 'ur' && selectedLaw2Info?.titleUrdu ? selectedLaw2Info.titleUrdu : (selectedLaw2Info?.title ?? search2)}
                    </span>
                    {selectedLaw2Info?.yearEnacted && (
                      <span className="text-[10px] text-muted-foreground font-mono shrink-0">({selectedLaw2Info.yearEnacted})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSearch2(''); setShowPicker2(true); }}
                    className="p-1 text-muted-foreground hover:text-foreground rounded shrink-0"
                    title={t('Change', 'تبدیل')}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder={t('Search second law by name or slug...', 'دوسرا قانون تلاش کریں...')}
                    value={inputQuery2}
                    onFocus={() => setShowPicker2(true)}
                    onChange={(e) => { setInputQuery2(e.target.value); setShowPicker2(true); }}
                    className="pl-8.5 h-10 text-xs sm:text-sm"
                  />
                  {showPicker2 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
                      <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground flex justify-between items-center border-b border-border/40 mb-1">
                        <span>{t('Available Laws', 'دستیاب قوانین')} ({filteredLaws2.length})</span>
                        <button type="button" onClick={() => setShowPicker2(false)} className="hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      {filteredLaws2.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          {t('No laws found matching search', 'کوئی قانون نہیں ملا')}
                        </div>
                      ) : (
                        filteredLaws2.map((l) => (
                          <button
                            key={l.slug}
                            type="button"
                            onClick={() => {
                              setSearch2(l.slug);
                              setShowPicker2(false);
                              setInputQuery2('');
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-accent text-xs flex items-center justify-between gap-2 transition-colors"
                          >
                            <div className="min-w-0">
                              <span className="font-medium text-foreground block truncate">
                                {lang === 'ur' && l.titleUrdu ? l.titleUrdu : l.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {l.category.name} {l.yearEnacted ? `• ${l.yearEnacted}` : ''}
                              </span>
                            </div>
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: l.category.color ?? '#0d9488' }} />
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Compare Button right on the same row! */}
            <Button
              onClick={() => executeCompare(search1, search2)}
              disabled={!search1 || !search2 || search1 === search2}
              className="h-10 px-5 text-xs sm:text-sm font-medium shrink-0 w-full md:w-auto"
            >
              <GitCompare className="h-4 w-4 mr-1.5" />
              {t('Compare Now', 'ابھی موازنہ کریں')}
            </Button>
          </div>

          {search1 && search2 && search1 === search2 && (
            <p className="text-xs text-rose-600 font-medium pt-0.5">
              {t('Please select two distinct laws', 'براہ کرم دو مختلف قوانین منتخب کریں')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Empty State: Curated Popular Comparisons */}
      {(!law1 || !law2) && !loading && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                {t('Popular & Essential Legal Comparisons', 'اہم اور مقبول قانونی موازنے')}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('Frequently researched side-by-side legal pairs by advocates, judges, and law students in Pakistan.', 'پاکستان کے وکلاء، ججز اور طلبہ کی جانب سے کثرت سے تلاش کیے جانے والے قانونی جوڑے۔')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {POPULAR_COMPARISONS.map((item, idx) => (
              <Card
                key={idx}
                className="hover:border-primary/50 hover:shadow-md transition-all duration-200 border-border/70 group flex flex-col justify-between"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      {lang === 'ur' ? item.categoryUrdu : item.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground"># {idx + 1}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span className="truncate">{item.title1}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                      <span className="text-primary font-bold">vs</span>
                      <span className="truncate">{item.title2}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {lang === 'ur' ? item.descUr : item.descEn}
                  </p>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSearch1(item.slug1);
                      setSearch2(item.slug2);
                      executeCompare(item.slug1, item.slug2);
                    }}
                    className="w-full text-xs h-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    <span>{t('Compare Pair', 'موازنہ دیکھیں')}</span>
                    <ArrowRight className={cn('h-3.5 w-3.5 ml-1', lang === 'ur' && 'rotate-180')} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Skeleton className="h-80 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      )}

      {/* Active Comparison Loaded View */}
      {law1 && law2 && !loading && (
        <div className="space-y-6">
          {/* Tabs Navigator */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <div className="border-b border-border/60 pb-2">
              <TabsList className="bg-muted/60 p-1 rounded-xl h-auto flex flex-wrap gap-1">
                <TabsTrigger value="overview" className="text-xs sm:text-sm py-1.5 px-3 gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {t('Side-by-Side Cards', 'آمنے سامنے کارڈز')}
                </TabsTrigger>
                <TabsTrigger value="matrix" className="text-xs sm:text-sm py-1.5 px-3 gap-1.5">
                  <Scale className="h-3.5 w-3.5" />
                  {t('Comparison Matrix', 'تقابلی جدول')}
                </TabsTrigger>
                <TabsTrigger value="sections" className="text-xs sm:text-sm py-1.5 px-3 gap-1.5">
                  <ScrollText className="h-3.5 w-3.5" />
                  {t('Sections Comparator', 'دفعات کا تقابل')}
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0 font-mono">
                    {law1.sections.length} vs {law2.sections.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="amendments" className="text-xs sm:text-sm py-1.5 px-3 gap-1.5">
                  <History className="h-3.5 w-3.5" />
                  {t('Amendments History', 'ترامیم کا تقابل')}
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0 font-mono">
                    {law1.amendments.length} vs {law2.amendments.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: SIDE-BY-SIDE CARDS */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <LawCompareCard law={law1} t={t} lang={lang} badgeText={t('Law 1', 'پہلا قانون')} />
                <LawCompareCard law={law2} t={t} lang={lang} badgeText={t('Law 2', 'دوسرا قانون')} />
              </div>
            </TabsContent>

            {/* TAB 2: STRUCTURED COMPARISON MATRIX TABLE */}
            <TabsContent value="matrix" className="mt-6">
              <Card className="border-border/70 overflow-hidden shadow-xs">
                <CardHeader className="bg-muted/20 border-b border-border/50 py-3 px-4 sm:px-6">
                  <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    {t('Detailed Statute Comparison Matrix', 'جامع قانونی موازنہ میٹرکس')}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('Direct feature-by-feature breakdown of both statutes side-by-side.', 'دونوں قوانین کی تمام اہم خصوصیات اور پیرامیٹرز کا موازنہ۔')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground text-xs font-semibold">
                        <th className="py-3 px-4 w-1/4 font-semibold">{t('Feature / Metric', 'پیرامیٹر')}</th>
                        <th className="py-3 px-4 w-3/8 font-semibold text-primary">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: law1.category.color ?? '#0d9488' }} />
                            {lang === 'ur' && law1.titleUrdu ? law1.titleUrdu : law1.title}
                          </span>
                        </th>
                        <th className="py-3 px-4 w-3/8 font-semibold text-primary">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: law2.category.color ?? '#0d9488' }} />
                            {lang === 'ur' && law2.titleUrdu ? law2.titleUrdu : law2.title}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-xs sm:text-sm">
                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Category', 'زمرہ')}</td>
                        <td className="py-3 px-4 font-semibold">
                          <Badge variant="secondary" style={{ backgroundColor: `${law1.category.color ?? '#0d9488'}15`, color: law1.category.color ?? '#0d9488' }}>
                            {lang === 'ur' ? law1.category.nameUrdu : law1.category.name}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          <Badge variant="secondary" style={{ backgroundColor: `${law2.category.color ?? '#0d9488'}15`, color: law2.category.color ?? '#0d9488' }}>
                            {lang === 'ur' ? law2.category.nameUrdu : law2.category.name}
                          </Badge>
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Year Enacted', 'سالِ نفاذ')}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold tabular-nums text-foreground">{law1.yearEnacted}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold tabular-nums text-foreground">{law2.yearEnacted}</span>
                          {law1.yearEnacted !== law2.yearEnacted && (
                            <span className="text-[11px] text-muted-foreground ml-2">
                              ({Math.abs(law1.yearEnacted - law2.yearEnacted)} {t('years difference', 'سال کا فرق')})
                            </span>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Jurisdiction', 'دائرہ اختیار')}</td>
                        <td className="py-3 px-4 capitalize font-medium">{law1.jurisdiction}</td>
                        <td className="py-3 px-4 capitalize font-medium">{law2.jurisdiction}</td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Legal Status', 'قانونی صورتحال')}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize text-xs" style={{ color: law1.status === 'active' ? '#059669' : '#e11d48' }}>
                            {law1.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize text-xs" style={{ color: law2.status === 'active' ? '#059669' : '#e11d48' }}>
                            {law2.status}
                          </Badge>
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Total Sections', 'کل دفعات')}</td>
                        <td className="py-3 px-4 font-mono font-semibold">
                          {law1.sections.length} {t('sections', 'دفعات')}
                          {law1.sections.length > law2.sections.length && (
                            <Badge variant="secondary" className="ml-2 text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40">
                              {t('More extensive', 'زیادہ طویل')}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold">
                          {law2.sections.length} {t('sections', 'دفعات')}
                          {law2.sections.length > law1.sections.length && (
                            <Badge variant="secondary" className="ml-2 text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40">
                              {t('More extensive', 'زیادہ طویل')}
                            </Badge>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Documented Amendments', 'درج شدہ ترامیم')}</td>
                        <td className="py-3 px-4 font-mono font-semibold">
                          {law1.amendments.length} {t('amendments', 'ترامیم')}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold">
                          {law2.amendments.length} {t('amendments', 'ترامیم')}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Promulgating Authority', 'نافذ کرنے والا ادارہ')}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {law1.promulgatingAuthority ?? '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {law2.promulgatingAuthority ?? '—'}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Gazette Reference', 'گزٹ حوالہ')}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {law1.gazetteReference ?? '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {law2.gazetteReference ?? '—'}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Applicability Scope', 'اطلاق کا دائرہ')}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {law1.applicabilityTags && law1.applicabilityTags.length > 0 ? (
                              law1.applicabilityTags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                              ))
                            ) : '—'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {law2.applicabilityTags && law2.applicabilityTags.length > 0 ? (
                              law2.applicabilityTags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                              ))
                            ) : '—'}
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-medium text-muted-foreground">{t('Directory Views', 'مشاہدات')}</td>
                        <td className="py-3 px-4 tabular-nums font-medium">{law1.viewCount}</td>
                        <td className="py-3 px-4 tabular-nums font-medium">{law2.viewCount}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: SECTIONS COMPARATOR & SEARCH */}
            <TabsContent value="sections" className="mt-6 space-y-4">
              {/* Section Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder={t('Filter sections in both laws (e.g. bail, appeal, fine, penalty)...', 'دونوں قوانین کی دفعات میں تلاش کریں (جیسے ضمانت، اپیل، جرمانہ)...')}
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="pl-9 h-10 text-xs sm:text-sm"
                />
                {sectionFilter && (
                  <button
                    type="button"
                    onClick={() => setSectionFilter('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Law 1 sections column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-border/60">
                    <span className="font-semibold text-xs sm:text-sm truncate">
                      {lang === 'ur' && law1.titleUrdu ? law1.titleUrdu : law1.title}
                    </span>
                    <Badge variant="outline" className="text-[11px]">
                      {matchingSections1.length} {t('sections', 'دفعات')}
                    </Badge>
                  </div>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                    {matchingSections1.length === 0 ? (
                      <div className="p-4 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
                        {t('No sections match filter', 'کوئی شق نہیں ملی')}
                      </div>
                    ) : (
                      matchingSections1.map((s) => (
                        <div key={s.id} className="p-3 rounded-lg border border-border/60 hover:border-primary/40 bg-card transition-colors space-y-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <Badge variant="secondary" className="font-mono text-xs px-2 py-0">
                              Sec. {s.sectionNumber}
                            </Badge>
                            {s.title && (
                              <span className="text-xs font-semibold text-foreground flex-1 truncate">
                                {s.title}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {lang === 'ur' && s.contentUrdu ? s.contentUrdu : s.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Law 2 sections column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-border/60">
                    <span className="font-semibold text-xs sm:text-sm truncate">
                      {lang === 'ur' && law2.titleUrdu ? law2.titleUrdu : law2.title}
                    </span>
                    <Badge variant="outline" className="text-[11px]">
                      {matchingSections2.length} {t('sections', 'دفعات')}
                    </Badge>
                  </div>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                    {matchingSections2.length === 0 ? (
                      <div className="p-4 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
                        {t('No sections match filter', 'کوئی شق نہیں ملی')}
                      </div>
                    ) : (
                      matchingSections2.map((s) => (
                        <div key={s.id} className="p-3 rounded-lg border border-border/60 hover:border-primary/40 bg-card transition-colors space-y-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <Badge variant="secondary" className="font-mono text-xs px-2 py-0">
                              Sec. {s.sectionNumber}
                            </Badge>
                            {s.title && (
                              <span className="text-xs font-semibold text-foreground flex-1 truncate">
                                {s.title}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {lang === 'ur' && s.contentUrdu ? s.contentUrdu : s.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: AMENDMENTS HISTORY */}
            <TabsContent value="amendments" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Law 1 Amendments */}
                <Card className="border-border/70">
                  <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs sm:text-sm font-semibold truncate">
                        {lang === 'ur' && law1.titleUrdu ? law1.titleUrdu : law1.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px]">
                        {law1.amendments.length} {t('amendments', 'ترامیم')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
                    {law1.amendments.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        {t('No amendments recorded in database', 'کوئی ترمیم درج نہیں')}
                      </div>
                    ) : (
                      law1.amendments.map((a) => (
                        <div key={a.id} className="p-3 rounded-lg border border-border/50 bg-muted/10 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-foreground">{a.amendmentTitle}</span>
                            <Badge variant="outline" className="text-[10px] font-mono">{a.amendmentYear}</Badge>
                          </div>
                          {a.description && (
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{a.description}</p>
                          )}
                          {a.gazetteReference && (
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {t('Gazette:', 'گزٹ:')} {a.gazetteReference}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Law 2 Amendments */}
                <Card className="border-border/70">
                  <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs sm:text-sm font-semibold truncate">
                        {lang === 'ur' && law2.titleUrdu ? law2.titleUrdu : law2.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px]">
                        {law2.amendments.length} {t('amendments', 'ترامیم')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
                    {law2.amendments.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        {t('No amendments recorded in database', 'کوئی ترمیم درج نہیں')}
                      </div>
                    ) : (
                      law2.amendments.map((a) => (
                        <div key={a.id} className="p-3 rounded-lg border border-border/50 bg-muted/10 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-foreground">{a.amendmentTitle}</span>
                            <Badge variant="outline" className="text-[10px] font-mono">{a.amendmentYear}</Badge>
                          </div>
                          {a.description && (
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{a.description}</p>
                          )}
                          {a.gazetteReference && (
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {t('Gazette:', 'گزٹ:')} {a.gazetteReference}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

function LawCompareCard({
  law, t, lang, badgeText,
}: {
  law: CompareLaw
  t: (en: string, ur?: string) => string
  lang: 'en' | 'ur'
  badgeText?: string
}) {
  const color = law.category.color ?? '#0d9488'
  return (
    <Card className="overflow-hidden border-border/70 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
        <CardHeader className="p-4 sm:p-5 pb-3">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {badgeText && (
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {badgeText}
                </Badge>
              )}
              <Badge variant="secondary" style={{ backgroundColor: `${color}1a`, color, border: 'none' }}>
                {lang === 'ur' ? law.category.nameUrdu : law.category.name}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />{law.yearEnacted}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs capitalize"
                style={{ color: law.status === 'active' ? '#059669' : law.status === 'repealed' ? '#e11d48' : '#d97706' }}
              >
                <Gavel className="h-3 w-3 mr-1" />{law.status}
              </Badge>
            </div>
          </div>

          <CardTitle className="text-lg md:text-xl leading-snug">
            <Link href={`/laws/${law.slug}`} className="hover:text-primary transition-colors">
              {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
            </Link>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-0.5">
            <Building2 className="h-3.5 w-3.5" />
            <span className="capitalize">{law.jurisdiction} Jurisdiction</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
          {/* Key Metrics Counters */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="rounded-lg bg-muted/40 p-2 border border-border/30">
              <Eye className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
              <div className="text-sm font-bold tabular-nums">{law.viewCount}</div>
              <div className="text-[10px] text-muted-foreground">{t('Views', 'مشاہدات')}</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-2 border border-border/30">
              <ScrollText className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
              <div className="text-sm font-bold tabular-nums">{law.sections.length}</div>
              <div className="text-[10px] text-muted-foreground">{t('Sections', 'شقیں')}</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-2 border border-border/30">
              <History className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
              <div className="text-sm font-bold tabular-nums">{law.amendments.length}</div>
              <div className="text-[10px] text-muted-foreground">{t('Amendments', 'ترامیم')}</div>
            </div>
          </div>

          {/* Summary */}
          {law.summary && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1 font-semibold">
                <FileText className="h-3 w-3" />{t('Summary', 'خلاصہ')}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {lang === 'ur' && law.summaryUrdu ? law.summaryUrdu : law.summary}
              </p>
            </div>
          )}

          {/* Promulgating Authority & Gazette */}
          {(law.promulgatingAuthority || law.gazetteReference) && (
            <div className="space-y-1 text-[11px] text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40">
              {law.promulgatingAuthority && (
                <div>
                  <span className="font-semibold text-foreground">{t('Authority:', 'اتھارٹی:')}</span> {law.promulgatingAuthority}
                </div>
              )}
              {law.gazetteReference && (
                <div>
                  <span className="font-semibold text-foreground">{t('Gazette:', 'گزٹ:')}</span> {law.gazetteReference}
                </div>
              )}
            </div>
          )}

          {/* Applicability Tags */}
          {law.applicabilityTags && law.applicabilityTags.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 font-semibold flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {t('Scope & Applicability', 'اطلاق کا دائرہ')}
              </p>
              <div className="flex flex-wrap gap-1">
                {law.applicabilityTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Key Sections Preview */}
          {law.sections.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 font-semibold">
                {t('Key Sections Preview', 'اہم شقوں کا جائزہ')}
              </p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
                {law.sections.slice(0, 4).map((s) => (
                  <div key={s.id} className="rounded border border-border/40 p-2 bg-card/60">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">Sec. {s.sectionNumber}</Badge>
                      {s.title && <span className="text-xs font-semibold truncate">{s.title}</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{s.content}</p>
                  </div>
                ))}
                {law.sections.length > 4 && (
                  <p className="text-[10px] text-muted-foreground text-center pt-1 font-medium">
                    +{law.sections.length - 4} {t('more sections available in comparator', 'مزید شقیں دستیاب ہیں')}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Footer Link to full law */}
      <div className="p-4 sm:p-5 pt-0">
        <Button asChild variant="outline" size="sm" className="w-full text-xs h-9">
          <Link href={`/laws/${law.slug}`}>
            {t('Open Full Law', 'مکمل قانون کھولیں')}
            <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
