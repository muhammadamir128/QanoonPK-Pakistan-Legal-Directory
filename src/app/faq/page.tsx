'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Search, HelpCircle, ChevronDown, ArrowRight,
  Lightbulb, BookOpen, ExternalLink, FileText, ThumbsUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { faqItems, type FAQItem } from '@/lib/faq-data'

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
  General: '#64748b',
}

export default function FAQPage() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<string>('all')

  const categories = React.useMemo(() => {
    const map = new Map<string, { en: string; ur: string }>()
    faqItems.forEach((item) => {
      if (!map.has(item.category)) map.set(item.category, { en: item.category, ur: item.categoryUrdu })
    })
    return Array.from(map.entries())
  }, [])

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim()
    return faqItems.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (!q) return true
      return (
        item.question.toLowerCase().includes(q) ||
        item.questionUrdu.includes(search) ||
        item.answer.toLowerCase().includes(q) ||
        item.answerUrdu.includes(search)
      )
    })
  }, [search, category])

  // Group filtered FAQs by category
  const grouped = React.useMemo(() => {
    const groups = new Map<string, FAQItem[]>()
    filtered.forEach((item) => {
      const arr = groups.get(item.category) ?? []
      arr.push(item)
      groups.set(item.category, arr)
    })
    return Array.from(groups.entries())
  }, [filtered])

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('FAQ', 'اکثر پوچھے گئے سوالات')}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shrink-0">
            <HelpCircle className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('Frequently Asked Questions', 'اکثر پوچھے گئے سوالات')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              {t(
                'Common legal questions answered in plain language. Browse by category or search.',
                'عام قانونی سوالات آسان زبان میں جوابات۔ اقسام کے لحاظ سے دیکھیں یا تلاش کریں۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">{faqItems.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('Questions', 'سوالات')}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">{categories.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('Categories', 'اقسام')}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20 col-span-2 md:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold tabular-nums leading-none">100%</div>
              <div className="text-xs text-muted-foreground mt-1">{t('Free', 'مفت')}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & filters */}
      <div className="space-y-3 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('Search questions...', 'سوالات تلاش کریں...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11"
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
            {t('All', 'تمام')} ({faqItems.length})
          </button>
          {categories.map(([key, label]) => {
            const count = faqItems.filter((i) => i.category === key).length
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

      {/* FAQ items grouped by category */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {t('No questions match your search.', 'آپ کی تلاش سے کوئی سوال مماثل نہیں۔')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([cat, items]) => {
            const color = CATEGORY_COLORS[cat] ?? '#64748b'
            const catLabel = categories.find(([k]) => k === cat)?.[1]
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <h2 className="text-lg font-semibold" style={{ color }}>
                    {lang === 'ur' && catLabel ? catLabel.ur : cat}
                  </h2>
                  <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {items.map((item) => (
                    <FAQAccordionItem key={item.id} item={item} lang={lang} t={t} color={color} />
                  ))}
                </Accordion>
              </div>
            )
          })}
        </div>
      )}

      {/* CTA */}
      <Card className="mt-10 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">
            {t('Didn\'t find your answer?', 'اپنا جواب نہیں ملا؟')}
          </h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            {t(
              'Find applicable laws using our interactive finder, or browse our full law directory.',
              'ہمارے انٹرایکٹو فائنڈر سے متعلقہ قوانین تلاش کریں، یا ہماری مکمل قانون ڈائریکٹری دیکھیں۔'
            )}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild size="sm">
              <Link href="/finder">
                <HelpCircle className="h-4 w-4 mr-2" />
                {t('Which Law Applies?', 'کون سا قانون لاگو ہوتا ہے؟')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/laws">
                {t('Browse All Laws', 'تمام قوانین دیکھیں')}
                <ArrowRight className={cn('h-4 w-4 ml-2', lang === 'ur' && 'rotate-180')} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FAQAccordionItem({
  item, lang, t, color,
}: {
  item: FAQItem
  lang: 'en' | 'ur'
  t: (en: string, ur?: string) => string
  color: string
}) {
  return (
    <AccordionItem
      value={item.id}
      className="border border-border/60 rounded-lg overflow-hidden bg-card hover:border-primary/30 transition-colors data-[state=open]:border-primary/40"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline text-start">
        <div className="flex items-start gap-3 text-start">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold shrink-0 mt-0.5"
            style={{ backgroundColor: color }}
          >
            <HelpCircle className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="font-medium text-sm leading-snug">
              {lang === 'ur' ? item.questionUrdu : item.question}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-0">
        <div className="ps-10 space-y-3">
          <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
            {lang === 'ur' ? item.answerUrdu : item.answer}
          </p>
          {/* Related laws */}
          {item.relatedLaws && item.relatedLaws.length > 0 && (
            <div className="pt-2 border-t border-border/40">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {t('Related Laws', 'متعلقہ قوانین')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.relatedLaws.map((law: any) => (
                  <Link
                    key={law.slug}
                    href={`/laws/${law.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 py-1 text-xs hover:border-primary/40 hover:bg-accent/50 transition-all"
                  >
                    <span className="font-medium">{lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0">{law.yearEnacted}</Badge>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
