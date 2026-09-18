'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Search, MapPin, Star, ShieldCheck, Award, Languages,
  Briefcase, Phone, Mail, Globe, ArrowRight, Building2, Filter,
  CheckCircle2, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type Lawyer = {
  id: string
  slug: string
  name: string
  nameUrdu: string | null
  bio: string | null
  bioUrdu: string | null
  specialization: string[]
  city: string
  cityUrdu: string | null
  province: string
  experienceYears: number | null
  education: string | null
  rating: number
  reviewCount: number
  verified: boolean
  featured: boolean
  acceptingCases: boolean
  imageColor: string | null
  languages: string[]
}

const CITIES = [
  { en: 'All cities', ur: 'تمام شہر', value: 'all' },
  { en: 'Islamabad', ur: 'اسلام آباد', value: 'Islamabad' },
  { en: 'Lahore', ur: 'لاہور', value: 'Lahore' },
  { en: 'Karachi', ur: 'کراچی', value: 'Karachi' },
  { en: 'Peshawar', ur: 'پشاور', value: 'Peshawar' },
  { en: 'Quetta', ur: 'کوئٹہ', value: 'Quetta' },
  { en: 'Faisalabad', ur: 'فیصل آباد', value: 'Faisalabad' },
  { en: 'Hyderabad', ur: 'حیدرآباد', value: 'Hyderabad' },
  { en: 'Multan', ur: 'ملتان', value: 'Multan' },
]

const SPECIALIZATIONS = [
  { en: 'All specializations', ur: 'تمام تخصیصات', value: 'all' },
  { en: 'Criminal Law', ur: 'فوجداری قانون', value: 'criminal-law' },
  { en: 'Family Law', ur: 'خاندانی قانون', value: 'family-law' },
  { en: 'Cyber & IT', ur: 'سائبر و آئی ٹی', value: 'cyber-it-law' },
  { en: 'Labor', ur: 'محنت', value: 'labor-employment-law' },
  { en: 'Tax', ur: 'ٹیکس', value: 'tax-law' },
  { en: 'Constitutional', ur: 'آئینی', value: 'constitutional-law' },
  { en: 'Civil', ur: 'دیوانی', value: 'civil-law' },
  { en: 'Property', ur: 'جائداد', value: 'property-land-law' },
  { en: 'Consumer', ur: 'صارفین', value: 'consumer-protection-law' },
  { en: 'Women\'s Rights', ur: 'خواتین کے حقوق', value: 'womens-rights-law' },
  { en: 'Environmental', ur: 'ماحولیاتی', value: 'environmental-law' },
]

export default function LawyersPage() {
  const { t, lang } = useLanguage()
  const [lawyers, setLawyers] = React.useState<Lawyer[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(0)

  const [q, setQ] = React.useState('')
  const [city, setCity] = React.useState('all')
  const [specialization, setSpecialization] = React.useState('all')
  const [sort, setSort] = React.useState('featured')

  React.useEffect(() => {
    setPage(1)
  }, [q, city, specialization, sort])

  React.useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city !== 'all') params.set('city', city)
    if (specialization !== 'all') params.set('specialization', specialization)
    if (sort) params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', '20')

    fetch(`/api/lawyers?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setLawyers(d.items ?? [])
        setTotal(d.total ?? 0)
        setTotalPages(d.totalPages ?? 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [q, city, specialization, sort, page])

  const clearFilters = () => {
    setQ('')
    setCity('all')
    setSpecialization('all')
    setSort('featured')
  }

  const hasFilters = q || city !== 'all' || specialization !== 'all'

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-6 md:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('Lawyers', 'وکلاء')}</span>
        </div>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md sm:shadow-lg shrink-0">
            <Briefcase className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              {t('Verified Lawyer Directory', 'تصدیق شدہ وکلاء ڈائریکٹری')}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm max-w-2xl">
              {t(
                'Find licensed lawyers across Pakistan. Filter by city and specialization. All listings are verified.',
                'پاکستان بھر میں لائسنس یافتہ وکلاء تلاش کریں۔ شہر اور تخصیص سے فلٹر کریں۔ تمام فہرستیں تصدیق شدہ ہیں۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Filters in 1 row */}
      <Card className="mb-6 border-border/60">
        <CardContent className="p-3.5 sm:p-4 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:items-center gap-2 sm:gap-2.5">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] lg:min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder={t('Search by name, bio, or city...', 'نام، بائیو، یا شہر سے تلاش...')}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9 h-10 w-full"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* City */}
            <div className="w-full lg:w-[170px] xl:w-[190px] shrink-0">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-10 w-full min-w-0">
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate"><SelectValue /></span>
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{lang === 'ur' ? c.ur : c.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialization */}
            <div className="w-full lg:w-[195px] xl:w-[220px] shrink-0">
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="h-10 w-full min-w-0">
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate"><SelectValue /></span>
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{lang === 'ur' ? s.ur : s.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-[160px] xl:w-[175px] shrink-0">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-10 w-full min-w-0">
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate"><SelectValue /></span>
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">{t('Featured first', 'نمایاں پہلے')}</SelectItem>
                  <SelectItem value="rating">{t('Highest rated', 'اعلیٰ درجہ بندی')}</SelectItem>
                  <SelectItem value="experience">{t('Most experienced', 'زیادہ تجربہ کار')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="h-10 shrink-0">
                <X className="h-3.5 w-3.5 mr-1" /> {t('Clear', 'صاف')}
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground pt-0.5">
            {total} {t('lawyers found', 'وکلاء ملے')}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-56">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : lawyers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {t('No lawyers match your filters. Try adjusting.', 'آپ کے فلٹر سے کوئی وکیل مماثل نہیں۔ تبدیل کر کے دیکھیں۔')}
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
              {t('Reset filters', 'فلٹر ری سیٹ کریں')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lawyers.map((lawyer, i) => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} delay={i * 30} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between sm:justify-center gap-2 mt-8 pt-4 border-t border-border/50 max-w-full">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 sm:px-3 text-xs sm:text-sm shrink-0"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {lang === 'ur' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                <span>{t('Prev', 'پچھلا')}</span>
              </Button>

              {/* Mobile page indicator */}
              <div className="flex sm:hidden items-center justify-center px-2.5 py-1 rounded-md bg-muted/60 text-xs font-semibold tabular-nums text-foreground shrink-0">
                {page} / {totalPages}
              </div>

              {/* Desktop / tablet numbered buttons */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }).slice(0, 7).map((_, idx) => {
                  const p = idx + 1
                  return (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      size="sm"
                      className="h-9 w-9 p-0 tabular-nums text-xs"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 sm:px-3 text-xs sm:text-sm shrink-0"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <span>{t('Next', 'اگلا')}</span>
                {lang === 'ur' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function LawyerCard({ lawyer, delay }: { lawyer: Lawyer, delay: number }) {
  const { lang, t } = useLanguage()
  const color = lawyer.imageColor ?? '#0d9488'
  return (
    <Link href={`/lawyers/${lawyer.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full overflow-hidden relative border-border/60">
        <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-3">
            <div
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full text-white text-base sm:text-lg font-bold shrink-0 shadow-md group-hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
            >
              {lawyer.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              {lawyer.featured && (
                <div className="mb-1">
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-semibold py-0.5 px-2 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                    <Award className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    <span>{lang === 'ur' ? 'نمایاں وکیل' : 'Featured'}</span>
                  </Badge>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm sm:text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
                  {lang === 'ur' && lawyer.nameUrdu ? lawyer.nameUrdu : lawyer.name}
                </h3>
                {lawyer.verified && (
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" aria-label="Verified" />
                )}
              </div>
              <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground mt-1">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/80" />
                  <span>{lang === 'ur' && lawyer.cityUrdu ? lawyer.cityUrdu : lawyer.city}</span>
                </span>
                {lawyer.experienceYears && (
                  <span className="inline-flex items-center gap-1">
                    <span>•</span>
                    <span className="whitespace-nowrap">{lawyer.experienceYears}+ {lang === 'ur' ? 'سال' : 'yrs'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1 mb-3">
            {lawyer.specialization.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="outline" className="text-[10px] capitalize font-normal px-2 py-0.5">
                {spec.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {lang === 'ur' && lawyer.bioUrdu ? lawyer.bioUrdu : lawyer.bio ?? ''}
          </p>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn('h-3.5 w-3.5', i <= Math.round(lawyer.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30')}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground tabular-nums font-medium">
                {lawyer.rating.toFixed(1)} <span className="text-muted-foreground/60">({lawyer.reviewCount})</span>
              </span>
            </div>
            <ArrowRight className={cn('h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all', lang === 'ur' && 'rotate-180')} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
