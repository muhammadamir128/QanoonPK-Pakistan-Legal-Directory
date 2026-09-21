'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Search, HelpCircle, ChevronDown, ArrowRight,
  Lightbulb, BookOpen, ExternalLink, FileText, ThumbsUp, ThumbsDown,
  ShieldAlert, Send, Sparkles, Phone, CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { faqItems, type FAQItem } from '@/lib/faq-data'
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
  General: '#64748b',
}

export default function FAQPage() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<string>('all')
  const [openItems, setOpenItems] = React.useState<string[]>([])
  const [helpfulVotes, setHelpfulVotes] = React.useState<Record<string, 'yes' | 'no'>>({})

  // Question submission form state
  const [userQuestion, setUserQuestion] = React.useState('')
  const [userEmail, setUserEmail] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)

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

  const toggleAll = () => {
    if (openItems.length > 0) {
      setOpenItems([])
    } else {
      setOpenItems(filtered.map((item) => item.id))
    }
  }

  const voteHelpful = (id: string, type: 'yes' | 'no') => {
    setHelpfulVotes((prev) => ({ ...prev, [id]: type }))
    toast.success(
      type === 'yes'
        ? t('Thanks for your feedback!', 'آپ کی رائے کا شکریہ!')
        : t('Thank you. We will improve this answer.', 'شکریہ، ہم اس جواب کو مزید بہتر بنائیں گے۔')
    )
  }

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userQuestion.trim()) return
    setSubmitted(true)
    toast.success(t('Question submitted successfully! Our legal team will review it.', 'آپ کا سوال موصول ہو گیا ہے، جلد جائزہ لیا جائے گا۔'))
    setUserQuestion('')
    setUserEmail('')
  }

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
              {t('Frequently Asked Legal Questions', 'اکثر پوچھے جانے والے قانونی سوالات')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              {t(
                'Plain language legal answers for citizens, students, and businesses regarding Pakistani law, procedures, and rights.',
                'پاکستانی قوانین، عدالتی طریقہ کار اور بنیادی حقوق سے متعلق عام شہریوں کے اہم سوالات کے آسان زبان میں جوابات۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Box */}
      <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-5 w-5 text-primary shrink-0" />
          <div>
            <span className="font-bold text-foreground block">{t('Immediate Official Legal Helplines', 'فوری سرکاری قانونی ہیلپ لائنز')}</span>
            <span className="text-muted-foreground">{t('Toll-free 24/7 assistance across Pakistan', 'پورے پاکستان میں 24/7 مفت معاونت')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap font-medium">
          <Badge variant="outline" className="bg-background/80 py-1 text-xs">
            🚓 Police: <strong className="ml-1 text-primary">15</strong>
          </Badge>
          <Badge variant="outline" className="bg-background/80 py-1 text-xs">
            💻 FIA Cyber Crime: <strong className="ml-1 text-primary">1991</strong>
          </Badge>
          <Badge variant="outline" className="bg-background/80 py-1 text-xs">
            👩 Women Abuse Helpline: <strong className="ml-1 text-primary">1043</strong>
          </Badge>
          <Badge variant="outline" className="bg-background/80 py-1 text-xs">
            👶 Child Protection: <strong className="ml-1 text-primary">1121</strong>
          </Badge>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2.5 flex-col sm:flex-row">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={t('Search questions, bail, cheque bounce, tenancy, divorce...', 'سوالات تلاش کریں (مثلاً ضمانت، باؤنس چیک، طلاق، کرایہ)...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 shadow-xs"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleAll}
            className="h-11 px-4 shrink-0 text-xs cursor-pointer w-full sm:w-auto"
          >
            {openItems.length > 0 ? t('Collapse All', 'تمام بند کریں') : t('Expand All', 'تمام کھولیں')}
          </Button>
        </div>

        {/* Category Pills */}
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
            {t('All Topics', 'تمام موضوعات')} ({faqItems.length})
          </button>
          {categories.map(([key, label]) => {
            const count = faqItems.filter((i) => i.category === key).length
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

      {/* FAQ items grouped by category */}
      {filtered.length === 0 ? (
        <Card className="border-dashed mb-12">
          <CardContent className="py-12 text-center">
            <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">
              {t('No questions match your search.', 'آپ کی تلاش سے کوئی سوال مماثل نہیں۔')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearch(''); setCategory('all') }}
              className="mt-3 text-xs"
            >
              {t('Reset Search', 'ری سیٹ کریں')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 mb-12">
          {grouped.map(([cat, items]) => {
            const color = CATEGORY_COLORS[cat] ?? '#64748b'
            const catLabel = categories.find(([k]) => k === cat)?.[1]
            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <h2 className="text-base sm:text-lg font-bold" style={{ color }}>
                    {lang === 'ur' && catLabel ? catLabel.ur : cat}
                  </h2>
                  <span className="text-xs text-muted-foreground">({items.length})</span>
                </div>

                <Accordion
                  type="multiple"
                  value={openItems}
                  onValueChange={setOpenItems}
                  className="space-y-2.5"
                >
                  {items.map((item) => {
                    const voted = helpfulVotes[item.id]
                    return (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="border border-border/70 rounded-xl px-4 bg-card shadow-xs overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline py-3.5 text-left font-semibold text-xs sm:text-sm">
                          <span>{lang === 'ur' ? item.questionUrdu : item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1">
                          <p className="text-foreground/90 leading-relaxed mb-3">
                            {lang === 'ur' ? item.answerUrdu : item.answer}
                          </p>

                          {/* Related Law tag if present */}
                          {item.relatedLaws && item.relatedLaws.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {item.relatedLaws.map((lawSlug) => (
                                <Button key={lawSlug} asChild variant="outline" size="sm" className="h-7 text-xs">
                                  <Link href={`/laws/${lawSlug}`}>
                                    <FileText className="h-3 w-3 mr-1 text-primary" />
                                    {t('View relevant statute', 'متعلقہ قانون دیکھیں')}
                                  </Link>
                                </Button>
                              ))}
                            </div>
                          )}

                          {/* Helpful vote action */}
                          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/30 text-xs">
                            <span className="text-muted-foreground text-[11px]">
                              {t('Was this helpful?', 'کیا یہ جواب مفید تھا؟')}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => voteHelpful(item.id, 'yes')}
                                className={cn(
                                  'p-1.5 rounded-md hover:bg-accent text-xs inline-flex items-center gap-1 cursor-pointer transition-colors',
                                  voted === 'yes' ? 'text-emerald-600 font-bold bg-emerald-500/10' : 'text-muted-foreground'
                                )}
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                <span>{t('Yes', 'ہاں')}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => voteHelpful(item.id, 'no')}
                                className={cn(
                                  'p-1.5 rounded-md hover:bg-accent text-xs inline-flex items-center gap-1 cursor-pointer transition-colors',
                                  voted === 'no' ? 'text-destructive font-bold bg-destructive/10' : 'text-muted-foreground'
                                )}
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                                <span>{t('No', 'نہیں')}</span>
                              </button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            )
          })}
        </div>
      )}

      {/* Ask a Question Interactive Card (NEW FEATURE) */}
      <Card className="border-primary/30 bg-gradient-to-b from-card via-card to-primary/5 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                {t('Have a Question Not Listed Here?', 'کوئی سوال جو یہاں موجود نہیں؟')}
              </CardTitle>
              <CardDescription className="text-xs">
                {t('Submit your legal query to our research team for inclusion in future updates.', 'اپنا قانونی سوال بھیجیں تاکہ اسے آئندہ اپ ڈیٹس میں شامل کیا جا سکے۔')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuestionSubmit} className="space-y-3">
            <Textarea
              placeholder={t('Type your legal question in detail...', 'اپنا قانونی سوال تفصیل سے تحریر کریں...')}
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              rows={3}
              required
              className="text-xs sm:text-sm resize-none"
            />
            <div className="flex items-center gap-3 flex-col sm:flex-row">
              <Input
                type="email"
                placeholder={t('Your email (optional for response notification)', 'ای میل (اختیاری)')}
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="text-xs h-9"
              />
              <Button type="submit" size="sm" className="h-9 px-4 shrink-0 text-xs w-full sm:w-auto">
                <Send className="h-3.5 w-3.5 mr-1.5" />
                {t('Submit Question', 'سوال جمع کرائیں')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
