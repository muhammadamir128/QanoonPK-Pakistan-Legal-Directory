'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Home, BookText, Search, Scale, ArrowRight,
  Compass, Briefcase, FileText, Landmark, HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export default function NotFound() {
  const { t, lang } = useLanguage()

  const handleOpenSearch = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('qpk-open-search'))
    }
  }

  const quickLinks = [
    { href: '/laws', icon: BookText, titleEn: 'Browse Laws', titleUr: 'تمام قوانین', descEn: 'Federal & Provincial acts', descUr: 'وفاقی و صوبائی قوانین' },
    { href: '/finder', icon: Compass, titleEn: 'Which Law Applies?', titleUr: 'کون سا قانون لاگو ہے؟', descEn: 'Guided law finder tool', descUr: 'رہنما قانون فائنڈر' },
    { href: '/lawyers', icon: Briefcase, titleEn: 'Lawyers Directory', titleUr: 'وکلاء ڈائریکٹری', descEn: 'Verified legal practitioners', descUr: 'تصدیق شدہ وکلاء' },
    { href: '/templates', icon: FileText, titleEn: 'Legal Templates', titleUr: 'قانونی ٹیمپلیٹس', descEn: 'Ready-to-use documents', descUr: 'تیار قانونی دستاویزات' },
    { href: '/courts', icon: Landmark, titleEn: 'Court Hierarchy', titleUr: 'عدالتی نظام', descEn: 'Pakistan judicial structure', descUr: 'پاکستان کا عدالتی نظام' },
    { href: '/faq', icon: HelpCircle, titleEn: 'FAQ & Help', titleUr: 'سوالات و مدد', descEn: 'Common legal questions', descUr: 'عام قانونی سوالات' },
  ]

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-12 px-3 sm:px-6 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Visual Badge & 404 */}
        <div className="relative inline-flex items-center justify-center mb-4 sm:mb-6">
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/10 mb-2">
            <Scale className="h-10 w-10 sm:h-12 sm:w-12 stroke-[1.75]" />
          </div>
          <span className="absolute -bottom-2 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-primary text-primary-foreground shadow-sm">
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-3">
          {t('Page Not Found', 'صفحہ نہیں ملا')}
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-base text-muted-foreground mt-2 sm:mt-3 max-w-md mx-auto leading-relaxed">
          {t(
            "The law, document, or page you are looking for does not exist, has been removed, or the URL might be incorrect.",
            'جو قانون، دستاویز یا صفحہ آپ تلاش کر رہے ہیں وہ موجود نہیں ہے، ہٹا دیا گیا ہے، یا ایڈریس درست نہیں ہے۔'
          )}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-6 flex-wrap">
          <Button asChild size="default" className="h-10 px-4 text-xs sm:text-sm font-medium shadow-sm">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              <span>{t('Back to Home', 'صفحۂ اول پر جائیں')}</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={handleOpenSearch}
            className="h-10 px-4 text-xs sm:text-sm font-medium border-border/80 hover:border-primary/50"
          >
            <Search className="h-4 w-4 mr-2 text-primary" />
            <span>{t('Search Directory', 'ڈائریکٹری میں تلاش کریں')}</span>
          </Button>

          <Button asChild variant="ghost" size="default" className="h-10 px-4 text-xs sm:text-sm font-medium">
            <Link href="/laws">
              <BookText className="h-4 w-4 mr-2" />
              <span>{t('Browse Laws', 'تمام قوانین')}</span>
            </Link>
          </Button>
        </div>

        {/* Helpful Destinations Grid */}
        <div className="mt-10 sm:mt-12 text-left pt-6 sm:pt-8 border-t border-border/50">
          <div className="flex items-center justify-between mb-3.5 px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Explore Popular Destinations', 'مقبول ترین سیکشنز')}
            </span>
            <Link
              href="/"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>{t('View All', 'تمام دیکھیں')}</span>
              <ArrowRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group block"
                >
                  <Card className="h-full border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-all duration-200">
                    <CardContent className="p-3 sm:p-3.5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-xs sm:text-sm leading-tight text-foreground group-hover:text-primary transition-colors truncate">
                          {t(item.titleEn, item.titleUr)}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate mt-0.5">
                          {t(item.descEn, item.descUr)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
