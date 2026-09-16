'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Gavel, Users, ShieldCheck, HardHat, Receipt, ChevronRight, ChevronLeft, BookOpen, ArrowRight,
  Landmark, Scale, Home, ShoppingCart, HeartHandshake, Leaf, Building2, Vote, Lightbulb,
  Plane, HeartPulse, GraduationCap, Car,
  Shield, ShieldAlert, Handshake, Newspaper,
  Map, Building, Wheat,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Gavel, Users, ShieldCheck, HardHat, Receipt, BookOpen,
  Landmark, Scale, Home, ShoppingCart, HeartHandshake, Leaf, Building2, Vote, Lightbulb,
  Plane, HeartPulse, GraduationCap, Car,
  Shield, ShieldAlert, Handshake, Newspaper,
  Map, Building, Wheat,
}

type Category = {
  id: string
  name: string
  nameUrdu: string
  slug: string
  icon: string | null
  color: string | null
  description: string
  descriptionUrdu: string | null
  _count?: { laws: number }
}

export default function CategoriesPage() {
  const { t, lang } = useLanguage()
  const [categories, setCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const itemsPerPage = 20
  const topRef = React.useRef<HTMLDivElement>(null)

  const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage))
  const paginatedCategories = categories.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  React.useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => { setCategories(d.items ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div ref={topRef} className="container mx-auto max-w-7xl px-4 py-8 md:py-12 scroll-mt-20">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
            <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
            <span>{t('Categories', 'اقسام')}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              {t('Law Categories', 'قوانین کی اقسام')}
            </h1>
            {categories.length > 0 && (
              <Badge variant="secondary" className="font-mono text-xs px-2.5 py-0.5 rounded-full">
                {categories.length}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('Pakistan\'s laws grouped by subject area. Each category contains related statutes.', 'پاکستان کے قوانین موضوع کے لحاظ سے۔ ہر قسم میں متعلقہ قوانین شامل ہیں۔')}
          </p>
        </div>
        {categories.length > 0 && (
          <span className="text-xs text-muted-foreground shrink-0 font-medium">
            {t(
              `Showing ${(page - 1) * itemsPerPage + 1}–${Math.min(page * itemsPerPage, categories.length)} of ${categories.length}`,
              `${categories.length} میں سے ${(page - 1) * itemsPerPage + 1}–${Math.min(page * itemsPerPage, categories.length)} اقسام`
            )}
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-48">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paginatedCategories.map((cat, i) => {
              const Icon = cat.icon ? ICONS[cat.icon] ?? BookOpen : BookOpen
              const count = cat._count?.laws ?? 0
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group block animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <Card className="hover:shadow-lg hover:border-primary/40 transition-all duration-300 h-full overflow-hidden relative">
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ backgroundColor: cat.color ?? undefined }}
                    />
                    <CardHeader className="flex flex-row items-start gap-4 pb-3 pt-5">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: cat.color ?? 'var(--primary)' }}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight">
                          {lang === 'ur' && cat.nameUrdu ? cat.nameUrdu : cat.name}
                        </CardTitle>


                      </div>
                      <Badge variant="secondary" className="shrink-0">{count} {t('laws', 'قوانین')}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {lang === 'ur' && cat.descriptionUrdu ? cat.descriptionUrdu : cat.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-4 text-sm font-medium text-primary">
                        {t('Explore laws', 'قوانین دیکھیں')}
                        <ArrowRight className={cn('h-4 w-4 group-hover:translate-x-1 transition-transform', lang === 'ur' && 'rotate-180')} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60">
              <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                {t(
                  `Page ${page} of ${totalPages} (${categories.length} total categories)`,
                  `صفحہ ${page} از ${totalPages} (کل ${categories.length} اقسام)`
                )}
              </div>

              <nav aria-label="Category pagination" className="flex items-center gap-1.5 order-1 sm:order-2">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="h-9 px-3 gap-1 rounded-lg border-border hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ChevronLeft className={cn('h-4 w-4', lang === 'ur' && 'rotate-180')} />
                  <span className="text-xs font-medium">{t('Previous', 'پچھلا')}</span>
                </Button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNum = idx + 1
                    const isActive = pageNum === page
                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          'h-9 w-9 p-0 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 ring-2 ring-primary/20 hover:bg-primary'
                            : 'border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="h-9 px-3 gap-1 rounded-lg border-border hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <span className="text-xs font-medium">{t('Next', 'اگلا')}</span>
                  <ChevronRight className={cn('h-4 w-4', lang === 'ur' && 'rotate-180')} />
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  )
}
