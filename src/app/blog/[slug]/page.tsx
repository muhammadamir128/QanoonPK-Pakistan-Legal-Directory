'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import {
  Calendar, Clock, User, ArrowLeft, Share2, BookOpen,
  ChevronRight, Tag, Scale, FileText, CheckCircle2,
  Info, ExternalLink, Printer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/components/language-provider'
import { BLOG_POSTS } from '@/lib/blog-data'
import { toast } from 'sonner'

export default function BlogPostDetailPage() {
  const { t, lang } = useLanguage()
  const params = useParams<{ slug: string }>()
  const isUrdu = lang === 'ur'

  const post = React.useMemo(() => {
    return BLOG_POSTS.find((p) => p.slug === params.slug)
  }, [params.slug])

  if (!post) {
    return (
      <div className="container mx-auto max-w-4xl py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">{t('Article Not Found', 'مضمون نہیں ملا')}</h2>
        <Link href="/blog">
          <Button variant="outline">{t('Back to Guides', 'واپس جائیں')}</Button>
        </Link>
      </div>
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isUrdu ? post.titleUrdu : post.title,
        text: isUrdu ? post.summaryUrdu : post.summary,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success(t('Article link copied to clipboard', 'مضمون کا لنک کاپی ہو گیا'))
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t('Home', 'ہوم')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/blog" className="hover:text-primary transition-colors">{t('Legal Guides', 'قانونی رہنمائی')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate max-w-xs">{isUrdu ? post.titleUrdu : post.title}</span>
        </div>

        {/* Article Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary border-primary/20">
              {isUrdu ? post.categoryUrdu : post.category}
            </Badge>
            <div className="flex items-center gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={handleShare} className="h-8 gap-1.5 text-xs">
                <Share2 className="h-3.5 w-3.5" />
                <span>{t('Share', 'شیئر')}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 gap-1.5 text-xs">
                <Printer className="h-3.5 w-3.5" />
                <span>{t('Print', 'پرنٹ')}</span>
              </Button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
            {isUrdu ? post.titleUrdu : post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1 border-t border-border/50">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <User className="h-3.5 w-3.5 text-primary" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Quick Summary Alert */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 flex items-start gap-3.5">
          <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              {t('Executive Summary', 'اہم خلاصہ')}
            </h4>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {isUrdu ? post.summaryUrdu : post.summary}
            </p>
          </div>
        </div>

        {/* Main Article Body */}
        <Card className="border-border/70 shadow-xs bg-card">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <article className="prose prose-sm sm:prose max-w-none text-foreground leading-relaxed whitespace-pre-line font-sans">
              {isUrdu ? post.contentUrdu : post.contentEn}
            </article>

            {/* Language switch helper note */}
            <div className="rounded-lg bg-muted/40 border border-border/60 p-4 text-xs text-muted-foreground flex items-center justify-between gap-3">
              <span>
                {isUrdu
                  ? 'یہ مضمون انگریزی میں بھی دستیاب ہے۔ اوپر ہیڈر سے زبان تبدیل کریں۔'
                  : 'This guide is also available in authentic Urdu. Toggle the language in the top navbar.'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Related Statutory Laws in QanoonPK */}
        {post.relatedLawSlugs.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <span>{t('Referenced Laws in QanoonPK Directory', 'مضمون میں مذکور متعلقہ قوانین')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {post.relatedLawSlugs.map((lawSlug) => (
                <Link key={lawSlug} href={`/laws/${lawSlug}`}>
                  <Card className="border-border/60 hover:border-primary/40 hover:shadow-xs transition-all bg-card p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-foreground capitalize block hover:text-primary">
                        {lawSlug.replace(/-/g, ' ')}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {t('Read full sections and amendments', 'مکمل دفعات اور ترامیم پڑھیں')}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation & Help CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t('Back to All Guides', 'تمام مضامین کی طرف واپس')}</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/templates">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>{t('Browse Legal Templates', 'قانونی ٹیمپلیٹس')}</span>
              </Button>
            </Link>
            <Link href="/lawyers">
              <Button size="sm" className="text-xs gap-1.5">
                <Scale className="h-3.5 w-3.5" />
                <span>{t('Consult an Advocate', 'وکیل سے مشاورت')}</span>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
