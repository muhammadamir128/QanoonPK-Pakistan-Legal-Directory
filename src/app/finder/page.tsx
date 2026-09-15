'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Compass, ChevronRight, ChevronLeft, ArrowRight, RefreshCw, AlertTriangle,
  FileText, ArrowLeft, BookOpen, Scale, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type FinderOption = {
  id: string
  label: string
  labelUrdu?: string
  nextIdx?: number
  categoryIds?: string[]
}

type Question = {
  id: string
  question: string
  questionUrdu?: string
  options: FinderOption[]
  orderIndex: number
}

type Law = {
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted: number
  status: string
  summary: string | null
  summaryUrdu: string | null
  category: { name: string; slug: string; color?: string | null; nameUrdu: string }
}

export default function FinderPage() {
  const { t, lang } = useLanguage()
  const [questions, setQuestions] = React.useState<Question[]>([])
  const [loading, setLoading] = React.useState(true)
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, FinderOption>>({})
  const [matchedSlugs, setMatchedSlugs] = React.useState<string[]>([])
  const [results, setResults] = React.useState<Law[] | null>(null)
  const [fetchingResults, setFetchingResults] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/finder')
      .then((r) => r.json())
      .then((d) => { setQuestions(d.items ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const currentQuestion = questions[currentIdx]

  const handleAnswer = (opt: FinderOption) => {
    const newAnswers = { ...answers, [currentQuestion.id]: opt }
    setAnswers(newAnswers)

    // Accumulate matched slugs
    const allSlugs = new Set<string>()
    Object.values(newAnswers).forEach((a) => {
      if (a.categoryIds) a.categoryIds.forEach((s) => allSlugs.add(s))
    })

    // If option has nextIdx navigate to that question index
    if (typeof opt.nextIdx === 'number' && opt.nextIdx >= 0 && opt.nextIdx < questions.length) {
      setCurrentIdx(opt.nextIdx)
      return
    }

    // Otherwise this is a terminal option — if we have matched slugs, finish
    if (allSlugs.size > 0) {
      setMatchedSlugs(Array.from(allSlugs))
      finish(Array.from(allSlugs))
    } else {
      // No matches yet, advance to next question
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1)
      } else {
        finish([])
      }
    }
  }

  const finish = async (slugs: string[]) => {
    setFetchingResults(true)
    try {
      const res = await fetch('/api/finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs }),
      })
      const data = await res.json()
      setResults(data.items ?? [])
    } finally {
      setFetchingResults(false)
    }
  }

  const restart = () => {
    setAnswers({})
    setResults(null)
    setMatchedSlugs([])
    setCurrentIdx(0)
  }

  const back = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1)
  }

  // Results screen
  if (results) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 mb-3">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t('Recommended Laws for Your Situation', 'آپ کے مسئلے کے لیے تجویز کردہ قوانین')}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {t('Based on your answers, here are the most relevant laws.', 'آپ کے جوابات کے بنیاد پر یہ متعلقہ قوانین ہیں۔')}
          </p>
        </div>

        {results.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                {t('No specific match found. Please browse all laws or consult a lawyer.', 'کوئی مخصوص-match نہیں ملا۔ تمام قوانین دیکھیں یا وکیل سے رجوع کریں۔')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {results.map((law, i) => (
              <Link key={law.slug} href={`/laws/${law.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <Card className="group hover:shadow-md hover:border-primary/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-white shrink-0 text-sm font-bold"
                        style={{ backgroundColor: law.category.color ?? 'var(--primary)' }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge variant="outline" className="text-xs">{law.yearEnacted}</Badge>
                          <Badge variant="secondary" className="text-xs" style={law.category.color ? { color: law.category.color } : {}}>
                            {lang === 'ur' && law.category.nameUrdu ? law.category.nameUrdu : law.category.name}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                          {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {lang === 'ur' && law.summaryUrdu ? law.summaryUrdu : law.summary ?? ''}
                        </p>
                      </div>
                      <ArrowRight className={cn('h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all mt-2', lang === 'ur' && 'rotate-180')} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3 flex-wrap justify-center">
          <Button onClick={restart} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('Start Over', 'دوبارہ شروع کریں')}
          </Button>
          <Button asChild variant="ghost">
            <Link href="/laws"><BookOpen className="h-4 w-4 mr-2" />{t('Browse all laws', 'تمام قوانین دیکھیں')}</Link>
          </Button>
        </div>

        <Card className="mt-8 bg-amber-50 dark:bg-amber-950/20 border-amber-300/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold text-sm text-amber-900 dark:text-amber-200">
                  {t('Important: This is not legal advice', 'اہم: یہ قانونی مشورہ نہیں ہے')}
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                  {t('This finder is a directory tool to point you to relevant laws. Your specific situation may require additional laws or interpretation. For any legal matter, please consult a qualified, licensed lawyer in Pakistan.', 'یہ فائنڈر صرف ایک ڈائریکٹری ٹول ہے جو آپ کو متعلقہ قوانین تک پہنچاتا ہے۔ آپ کے مخصوص مسئلے پر اور قوانین یا تشریح کی ضرورت ہو سکتی ہے۔ کسی بھی قانونی معاملے کے لیے پاکستان میں لائسنس یافتہ وکیل سے رجوع کریں۔')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-4 w-1/3 mx-auto mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('No questions available.', 'کوئی سوال دستیاب نہیں۔')}</p>
      </div>
    )
  }

  const progress = ((currentIdx + 1) / questions.length) * 100
  const selectedAnswer = answers[currentQuestion.id]

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t('Which Law Applies to Me?', 'میرے مسئلے پر کون سا قانون لاگو ہوتا ہے؟')}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-xl mx-auto">
          {t('Answer a few simple questions and we\'ll point you to the most relevant laws.', 'چند آسان سوالات کا جواب دیں اور ہم آپ کو متعلقہ قوانین تک پہنچائیں گے۔')}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{t('Question', 'سوال')} {currentIdx + 1} {t('of', 'از')} {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl md:text-2xl leading-tight">
            {lang === 'ur' && currentQuestion.questionUrdu ? currentQuestion.questionUrdu : currentQuestion.question}
          </CardTitle>
          {lang === 'en' && currentQuestion.questionUrdu && (
            <CardDescription className="font-urdu text-sm mt-1" dir="rtl">{currentQuestion.questionUrdu}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-2.5">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedAnswer?.id === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt)}
                className={cn(
                  'w-full text-left rounded-xl border p-4 transition-all duration-200 flex items-center justify-between gap-3 group',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/40 hover:bg-accent/50'
                )}
              >
                <span className="flex items-center gap-3 flex-1">
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold shrink-0 transition-colors',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground group-hover:border-primary/40'
                    )}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  <span className="text-sm md:text-base font-medium">
                    {lang === 'ur' && opt.labelUrdu ? opt.labelUrdu : opt.label}
                  </span>
                </span>
                <ArrowRight className={cn('h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 shrink-0', lang === 'ur' && 'rotate-180')} />
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (currentIdx === 0 ? window.history.back() : back())}
          className="text-muted-foreground"
        >
          {lang === 'ur' ? <ChevronRight className="h-4 w-4 mr-1" /> : <ChevronLeft className="h-4 w-4 mr-1" />}
          {t('Back', 'واپس')}
        </Button>
        <Button variant="ghost" size="sm" onClick={restart} className="text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          {t('Restart', 'دوبارہ')}
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-xl border border-amber-300/40 bg-amber-50 dark:bg-amber-950/20 p-4 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          {t('This tool is informational and points to relevant laws only. It is NOT legal advice. Always consult a licensed lawyer for your specific situation.', 'یہ ٹول معلوماتی ہے اور صرف متعلقہ قوانین تک پہنچاتا ہے۔ یہ قانونی مشورہ نہیں ہے۔ مخصوص صورتِ حال کے لیے ہمیشہ لائسنس یافتہ وکیل سے رجوع کریں۔')}
        </p>
      </div>
    </div>
  )
}
