'use client'

import * as React from 'react'
import Link from 'next/link'
import { Clock, X, ChevronRight, ArrowRight, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import { useRecentlyViewed } from '@/hooks/use-recently-viewed'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function RecentlyViewed({ maxItems = 6 }: { maxItems?: number }) {
  const { t, lang } = useLanguage()
  const { items, clearRecentlyViewed } = useRecentlyViewed()

  if (items.length === 0) return null

  const visible = items.slice(0, maxItems)

  const handleClear = () => {
    clearRecentlyViewed()
    toast.info(t('Recently viewed cleared', 'حال ہی میں دیکھے گئے صاف ہو گئے'))
  }

  return (
    <Card className="border-border/70 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                {t('Recently Viewed', 'حال ہی میں دیکھے گئے')}
                <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0">
                  {items.length}
                </Badge>
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">
                {t('Quick access to statutes you recently browsed', 'حال ہی میں دیکھے گئے قوانین تک فوری رسائی')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            {t('Clear history', 'ہسٹری صاف کریں')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {visible.map((item) => (
            <Link
              key={item.slug}
              href={`/laws/${item.slug}`}
              className="group relative flex flex-col justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:bg-accent/30 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: item.categoryColor ?? 'var(--primary)' }}
              />

              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pt-0.5">
                  <Badge variant="outline" className="text-[10px] font-medium gap-1 px-2 py-0.5 border-border/60">
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.categoryColor ?? 'var(--primary)' }}
                    />
                    <span className="truncate max-w-[120px]">{item.categoryName}</span>
                  </Badge>
                  <span className="text-[10px] text-muted-foreground tabular-nums flex items-center gap-1 shrink-0 font-medium">
                    <Clock className="h-3 w-3" />
                    {timeAgo(item.viewedAt, lang)}
                  </span>
                </div>

                <h4 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {lang === 'ur' && item.titleUrdu ? item.titleUrdu : item.title}
                </h4>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40 text-xs text-muted-foreground">
                <span className="tabular-nums font-mono text-[11px] bg-muted/60 px-1.5 py-0.5 rounded">
                  {item.yearEnacted}
                </span>
                <span className="inline-flex items-center gap-1 text-primary font-medium text-xs group-hover:translate-x-1 transition-transform">
                  {t('Read Law', 'قانون پڑھیں')}
                  <ArrowRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function timeAgo(timestamp: number, lang: 'en' | 'ur'): string {
  const diff = Date.now() - timestamp
  const min = Math.floor(diff / 60000)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)

  if (lang === 'ur') {
    if (min < 1) return 'ابھی'
    if (min < 60) return `${min} منٹ پہلے`
    if (hr < 24) return `${hr} گھنٹے پہلے`
    return `${day} دن پہلے`
  }
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  if (hr < 24) return `${hr}h ago`
  return `${day}d ago`
}
