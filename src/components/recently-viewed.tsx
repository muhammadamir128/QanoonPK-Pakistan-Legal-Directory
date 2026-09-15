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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            {t('Recently Viewed', 'حال ہی میں دیکھے گئے')}
            <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClear} className="h-7 text-xs text-muted-foreground">
            <X className="h-3 w-3 mr-1" />
            {t('Clear', 'صاف')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {visible.map((item, i) => (
            <Link
              key={item.slug}
              href={`/laws/${item.slug}`}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <span className="text-xs font-bold text-muted-foreground tabular-nums w-5 shrink-0">{i + 1}.</span>
              <span
                className="inline-flex h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.categoryColor ?? 'var(--primary)' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {lang === 'ur' && item.titleUrdu ? item.titleUrdu : item.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{item.categoryName}</span>
                  <span>•</span>
                  <span className="tabular-nums">{item.yearEnacted}</span>
                  <span>•</span>
                  <span className="tabular-nums">{timeAgo(item.viewedAt, lang)}</span>
                </div>
              </div>
              <ArrowRight className={cn('h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0', lang === 'ur' && 'rotate-180')} />
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
