'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Search, BookOpen, ArrowRight, Volume2, AlertTriangle,
  Languages, Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { glossaryTerms, type GlossaryTerm } from '@/lib/glossary-data'

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

export default function GlossaryPage() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<string>('all')
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set())

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
      if (category !== 'all' && term.category !== category) return false
      if (!q) return true
      return (
        term.term.toLowerCase().includes(q) ||
        term.termUrdu.includes(search) ||
        term.definition.toLowerCase().includes(q) ||
        term.definitionUrdu.includes(search) ||
        (term.pronunciation ?? '').toLowerCase().includes(q)
      )
    })
  }, [search, category])

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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
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
              {t('Legal Glossary', 'قانونی فرہنگ')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              {t(
                'Bilingual (English ↔ Urdu) dictionary of common legal terms used in Pakistan\'s courts and laws.',
                'پاکستان کی عدالتوں اور قوانین میں استعمال ہونے والے عام قانونی اصطلاحات کی دو لسانی (انگریزی ↔ اردو) فرہنگ۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">{glossaryTerms.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('Total Terms', 'کل اصطلاحات')}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Filter className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">{categories.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('Categories', 'اقسام')}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20 col-span-2 md:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <Languages className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">2</div>
              <div className="text-xs text-muted-foreground mt-1">{t('Languages', 'زبانیں')}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & filter */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={t('Search terms in English or Urdu...', 'انگریزی یا اردو میں اصطلاحات تلاش کریں...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-9"
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
            {t('All', 'تمام')} ({glossaryTerms.length})
          </button>
          {categories.map(([key, label]) => {
            const count = glossaryTerms.filter((t) => t.category === key).length
            const color = CATEGORY_COLORS[key] ?? '#64748b'
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border inline-flex items-center gap-1.5',
                  category === key
                    ? 'text-white border-transparent'
                    : 'bg-card border-border hover:bg-accent'
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
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {t('No terms found matching your search.', 'آپ کی تلاش سے مماثل کوئی اصطلاح نہیں ملی۔')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((term, i) => (
            <GlossaryTermCard
              key={term.id}
              term={term}
              lang={lang}
              t={t}
              expanded={expanded.has(term.id)}
              onToggle={() => toggle(term.id)}
              onSpeak={() => speak(lang === 'ur' ? term.termUrdu : term.term)}
            />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <Card className="mt-8 bg-amber-50 dark:bg-amber-950/20 border-amber-300/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              {t(
                'These definitions are simplified for educational purposes. Legal terms may have specific meanings depending on context. For authoritative definitions, consult a qualified lawyer or the full statute.',
                'یہ تعریفات تعلیمی مقاصد کے لیے آسان بنائی گئی ہیں۔ قانونی اصطلاحات کے مخصوص معانی متناسب ہو سکتے ہیں۔ مستند تعریفات کے لیے لائسنس یافتہ وکیل یا مکمل قانون سے رجوع کریں۔'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GlossaryTermCard({
  term, lang, t, expanded, onToggle, onSpeak,
}: {
  term: GlossaryTerm
  lang: 'en' | 'ur'
  t: (en: string, ur?: string) => string
  expanded: boolean
  onToggle: () => void
  onSpeak: () => void
}) {
  const color = CATEGORY_COLORS[term.category] ?? '#64748b'
  return (
    <Card
      className="overflow-hidden hover:shadow-md hover:border-primary/30 transition-all animate-fade-in-up"
      style={{ animationDelay: `${Math.min(300, Math.random() * 100)}ms` }}
    >
      <div className="h-0.5 w-full" style={{ backgroundColor: color }} />
      <CardHeader className="pb-2 pt-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge
                variant="secondary"
                className="text-[10px] font-medium"
                style={{ backgroundColor: `${color}1a`, color, border: 'none' }}
              >
                {lang === 'ur' ? term.categoryUrdu : term.category}
              </Badge>
              {term.pronunciation && (
                <span className="text-[10px] text-muted-foreground font-mono">/{term.pronunciation}/</span>
              )}
            </div>
            <CardTitle className="text-base leading-tight">
              <span>{lang === 'ur' && term.termUrdu ? term.termUrdu : term.term}</span>
            </CardTitle>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSpeak() }}
            className="shrink-0 p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
            aria-label="Pronounce"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <p
          className={cn(
            'text-sm text-muted-foreground leading-relaxed',
            !expanded && 'line-clamp-2'
          )}
        >
          {lang === 'ur' ? term.definitionUrdu : term.definition}
        </p>
        <button
          onClick={onToggle}
          className="mt-2 text-xs text-primary hover:underline inline-flex items-center gap-1"
        >
          {expanded ? t('Show less', 'کم دیکھیں') : t('Show more', 'مزید دیکھیں')}
          <ArrowRight className={cn('h-3 w-3', expanded && 'rotate-90', lang === 'ur' && 'rotate-180')} />
        </button>
      </CardContent>
    </Card>
  )
}
