'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, ChevronLeft, Search, BookOpen, ArrowRight, Volume2,
  Languages, Filter, Copy, Check, Scale, Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { glossaryTerms, type GlossaryTerm } from '@/lib/glossary-data'
import { toast } from 'sonner'

const CATEGORY_COLORS: Record<string, string> = {
  Criminal: '#dc2626',
  Civil: '#9333ea',
  Family: '#db2777',
  Property: '#ea580c',
  Court: '#0d9488',
  Constitutional: '#7c3aed',
  Tax: '#0891b2',
  Cyber: '#6366f1',
  Evidence: '#059669',
  Labor: '#d97706',
}

const ALPHABETS = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]

export default function GlossaryPage() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<string>('all')
  const [selectedLetter, setSelectedLetter] = React.useState<string>('ALL')
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set())
  const [page, setPage] = React.useState(1)
  const itemsPerPage = 10
  const topRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setPage(1)
  }, [search, category, selectedLetter])

  const categories = React.useMemo(() => {
    const set = new Map<string, { en: string; ur: string }>()
    glossaryTerms.forEach((term) => {
      if (!set.has(term.category)) {
        set.set(term.category, { en: term.category, ur: term.categoryUrdu })
      }
    })
    return Array.from(set.entries())
  }, [])

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim()
    return glossaryTerms.filter((term) => {
      // Category filter
      if (category !== 'all' && term.category !== category) return false

      // Letter filter
      if (selectedLetter !== 'ALL') {
        const firstLetter = term.term.trim().charAt(0).toUpperCase()
        if (firstLetter !== selectedLetter) return false
      }

      // Search query filter
      if (!q) return true
      return (
        term.term.toLowerCase().includes(q) ||
        term.termUrdu.includes(search) ||
        term.definition.toLowerCase().includes(q) ||
        term.definitionUrdu.includes(search) ||
        (term.pronunciation ?? '').toLowerCase().includes(q)
      )
    })
  }, [search, category, selectedLetter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginatedTerms = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.rate = 0.9
      window.speechSynthesis.speak(utter)
    }
  }

  const copyTerm = (term: GlossaryTerm) => {
    const text = `${term.term} (${term.termUrdu}):\n${term.definition}\n${term.definitionUrdu}\n\n— Via QanoonPK Legal Directory`
    navigator.clipboard.writeText(text)
    toast.success(t('Definition copied to clipboard', 'اصطلاح کی تعریف کاپی ہو گئی'))
  }

  return (
    <div ref={topRef} className="container mx-auto max-w-5xl px-4 py-8 md:py-12 scroll-mt-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('Glossary', 'فرہنگ')}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shrink-0">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('Pakistan Legal Glossary & Dictionary', 'پاکستانی قانونی اصطلاحات و فرہنگ')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              {t(
                'Comprehensive bilingual dictionary of key legal terms, Latin maxims, and statutory concepts used across Pakistan\'s courts.',
                'پاکستان کی عدالتوں، وکالت اور قوانین میں زیرِ استعمال قانونی اصطلاحات، لاطینی مقولوں اور فقہی مفاہیم کی دو لسانی لغت۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">{glossaryTerms.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('Total Legal Terms', 'کل اصطلاحات')}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Filter className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">{categories.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('Legal Categories', 'شعبہ ہائے قانون')}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20 col-span-2 md:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <Languages className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">English ↔ اردو</div>
              <div className="text-xs text-muted-foreground mt-1">{t('Bilingual Definitions', 'دو لسانی تشریحات')}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* A-Z Alphabetical Bar (NEW FEATURE) */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          <span className="text-xs text-muted-foreground mr-1.5 font-medium">{t('Filter A-Z:', 'حروف تہجی:')}</span>
          {ALPHABETS.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={cn(
                'h-7 min-w-7 px-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer',
                selectedLetter === letter
                  ? 'bg-primary text-primary-foreground shadow-xs scale-105'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={t('Search terms in English or Urdu (e.g., Habeas Corpus, خلع, F.I.R)...', 'اصطلاح تلاش کریں (جیسے خلع، ضمانت، FIR)...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-9 shadow-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setCategory('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border cursor-pointer',
              category === 'all'
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-card border-border/80 hover:bg-accent'
            )}
          >
            {t('All Domains', 'تمام اقسام')} ({glossaryTerms.length})
          </button>
          {categories.map(([key, label]) => {
            const count = glossaryTerms.filter((t) => t.category === key).length
            const color = CATEGORY_COLORS[key] ?? '#64748b'
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border inline-flex items-center gap-1.5 cursor-pointer',
                  category === key
                    ? 'text-white border-transparent shadow-xs'
                    : 'bg-card border-border/80 hover:bg-accent'
                )}
                style={category === key ? { backgroundColor: color } : {}}
              >
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: category === key ? 'white' : color }}
                />
                {lang === 'ur' ? label.ur : label.en} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Terms list */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 font-medium">
          <span>
            {t(
              `Showing ${(page - 1) * itemsPerPage + 1}–${Math.min(page * itemsPerPage, filtered.length)} of ${filtered.length} terms`,
              `${filtered.length} میں سے ${(page - 1) * itemsPerPage + 1}–${Math.min(page * itemsPerPage, filtered.length)} اصطلاحات`
            )}
          </span>
          {totalPages > 1 && (
            <span>
              {t(`Page ${page} of ${totalPages}`, `صفحہ ${page} از ${totalPages}`)}
            </span>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">
              {t('No terms found matching your filters.', 'کوئی اصطلاح نہیں ملی۔')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearch(''); setCategory('all'); setSelectedLetter('ALL') }}
              className="mt-3 text-xs"
            >
              {t('Clear Filters', 'فلٹرز ختم کریں')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {paginatedTerms.map((term) => (
              <GlossaryTermCard
                key={term.id}
                term={term}
                lang={lang}
                t={t}
                expanded={expanded.has(term.id)}
                onToggle={() => toggle(term.id)}
                onSpeak={() => speak(lang === 'ur' ? term.termUrdu : term.term)}
                onCopy={() => copyTerm(term)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
              <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                {t(
                  `Showing ${(page - 1) * itemsPerPage + 1} to ${Math.min(page * itemsPerPage, filtered.length)} of ${filtered.length} terms`,
                  `${filtered.length} میں سے ${(page - 1) * itemsPerPage + 1} تا ${Math.min(page * itemsPerPage, filtered.length)} اصطلاحات`
                )}
              </div>
              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                >
                  <ChevronLeft className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
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
                        onClick={() => handlePageChange(pageNum)}
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
                  onClick={() => handlePageChange(page + 1)}
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
    </div>
  )
}

function GlossaryTermCard({
  term, lang, t, expanded, onToggle, onSpeak, onCopy,
}: {
  term: GlossaryTerm
  lang: 'en' | 'ur'
  t: (en: string, ur?: string) => string
  expanded: boolean
  onToggle: () => void
  onSpeak: () => void
  onCopy: () => void
}) {
  const color = CATEGORY_COLORS[term.category] ?? '#64748b'
  return (
    <Card
      className="overflow-hidden hover:shadow-md hover:border-primary/40 transition-all border-border/70 flex flex-col justify-between"
    >
      <div>
        <div className="h-1 w-full" style={{ backgroundColor: color }} />
        <CardHeader className="pb-2 pt-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] font-medium"
                  style={{ backgroundColor: `${color}18`, color, border: 'none' }}
                >
                  {lang === 'ur' ? term.categoryUrdu : term.category}
                </Badge>
                {term.pronunciation && (
                  <span className="text-[10px] text-muted-foreground font-mono">/{term.pronunciation}/</span>
                )}
              </div>
              <CardTitle className="text-base sm:text-lg leading-tight font-bold">
                <span>{lang === 'ur' && term.termUrdu ? term.termUrdu : term.term}</span>
                {lang !== 'ur' && term.termUrdu && (
                  <span className="text-xs font-normal text-muted-foreground ml-2 font-urdu">({term.termUrdu})</span>
                )}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={onCopy}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title={t('Copy definition', 'تعریف کاپی کریں')}
                aria-label="Copy"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onSpeak}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                title={t('Listen pronunciation', 'تلفظ سنیں')}
                aria-label="Pronounce"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p
            className={cn(
              'text-xs sm:text-sm text-muted-foreground leading-relaxed',
              !expanded && 'line-clamp-2'
            )}
          >
            {lang === 'ur' ? term.definitionUrdu : term.definition}
          </p>

          {expanded && (
            <div className="mt-3 pt-2.5 border-t border-border/40 text-xs space-y-2">
              <p className="text-foreground/90 font-medium">
                <span className="text-primary font-semibold">{lang === 'ur' ? 'انگریزی مفہوم: ' : 'Urdu Translation: '}</span>
                {lang === 'ur' ? term.definition : term.definitionUrdu}
              </p>
              <div className="pt-1">
                <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                  <Link href={`/laws?q=${encodeURIComponent(term.term)}`}>
                    <Scale className="h-3 w-3 mr-1.5 text-primary" />
                    {t('View related laws', 'متعلقہ قوانین دیکھیں')}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      <div className="px-5 pb-3">
        <button
          onClick={onToggle}
          className="text-xs text-primary hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
        >
          {expanded ? t('Show less', 'کم دیکھیں') : t('Show full definition', 'مکمل تعریف دیکھیں')}
          <ArrowRight className={cn('h-3 w-3 transition-transform', expanded && 'rotate-90', lang === 'ur' && 'rotate-180')} />
        </button>
      </div>
    </Card>
  )
}
