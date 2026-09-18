'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Gavel, Users, ShieldCheck, HardHat, Receipt, ChevronRight, ChevronLeft,
  BookOpen, Building2, Calendar, FileText, ArrowRight,
  Landmark, Scale, Home, ShoppingCart, HeartHandshake, Leaf, Vote, Lightbulb,
  Plane, HeartPulse, GraduationCap, Car,
  Shield, ShieldAlert, Handshake, Newspaper,
  Map, Building, Wheat,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Gavel, Users, ShieldCheck, HardHat, Receipt, BookOpen,
  Landmark, Scale, Home, ShoppingCart, HeartHandshake, Leaf, Building2, Vote, Lightbulb,
  Plane, HeartPulse, GraduationCap, Car,
  Shield, ShieldAlert, Handshake, Newspaper,
  Map, Building, Wheat,
}

const STATUS_LABELS: Record<string, { en: string; ur: string; color: string }> = {
  active: { en: 'Active', ur: 'نافذ', color: '#059669' },
  repealed: { en: 'Repealed', ur: 'منسوخ', color: '#e11d48' },
  amended: { en: 'Amended', ur: 'ترمیم شدہ', color: '#d97706' },
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
}

type Law = {
  id: string
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted: number
  jurisdiction: string
  status: string
  summary: string | null
  summaryUrdu: string | null
  applicabilityTags: string[]
  viewCount: number
}

export default function CategoryDetailPage() {
  const { t, lang } = useLanguage()
  const params = useParams<{ slug: string }>()
  const [category, setCategory] = React.useState<Category | null>(null)
  const [laws, setLaws] = React.useState<Law[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sort, setSort] = React.useState('popular')

  React.useEffect(() => {
    if (!params.slug) return
    setLoading(true)
    fetch(`/api/categories/${params.slug}?sort=${sort}`)
      .then((r) => r.json())
      .then((d) => {
        setCategory(d.category)
        setLaws(d.items ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug, sort])

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('Category not found', 'قسم نہیں ملی')}</h1>
        <Button asChild className="mt-4"><Link href="/categories">{t('Browse categories', 'اقسام دیکھیں')}</Link></Button>
      </div>
    )
  }

  const Icon = category.icon ? ICONS[category.icon] ?? BookOpen : BookOpen

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
        <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <Link href="/categories" className="hover:text-primary">{t('Categories', 'اقسام')}</Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <span style={{ color: category.color ?? undefined }}>{lang === 'ur' && category.nameUrdu ? category.nameUrdu : category.name}</span>
      </nav>

      {/* Header banner */}
      <div
        className="rounded-2xl overflow-hidden border border-border/60 mb-6 relative"
        style={{ background: `linear-gradient(135deg, ${category.color ?? '#0d9488'}18 0%, transparent 70%)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: category.color ?? undefined }} />
        <div className="p-6 md:p-8 flex items-start gap-5">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shrink-0 shadow-md"
            style={{ backgroundColor: category.color ?? 'var(--primary)' }}
          >
            <Icon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {lang === 'ur' && category.nameUrdu ? category.nameUrdu : category.name}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              {lang === 'ur' && category.descriptionUrdu ? category.descriptionUrdu : category.description}
            </p>
            <Badge variant="secondary" className="mt-3">
              {laws.length} {t('laws in this category', 'قوانین اس قسم میں')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-semibold">{t('Laws', 'قوانین')}</h2>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">{t('Most viewed', 'سب سے زیادہ دیکھے گئے')}</SelectItem>
            <SelectItem value="newest">{t('Newest first', 'تازہ ترین')}</SelectItem>
            <SelectItem value="oldest">{t('Oldest first', 'قدیم ترین')}</SelectItem>
            <SelectItem value="az">A → Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {laws.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {t('No laws in this category yet.', 'اس قسم میں ابھی کوئی قانون نہیں۔')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {laws.map((law, i) => {
            const status = STATUS_LABELS[law.status] ?? STATUS_LABELS.active
            return (
              <Link
                key={law.id}
                href={`/laws/${law.slug}`}
                className="block animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <Card className="group hover:shadow-md hover:border-primary/30 transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs font-mono">
                          <Calendar className="h-3 w-3 mr-1" />{law.yearEnacted}
                        </Badge>
                        <Badge variant="outline" className="text-xs" style={{ color: status.color, borderColor: `${status.color}40` }}>
                          <Gavel className="h-3 w-3 mr-1" />{lang === 'ur' ? status.ur : status.en}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Building2 className="h-3 w-3 mr-1" />{law.jurisdiction}
                        </Badge>
                      </div>
                      <ArrowRight className={cn('h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0', lang === 'ur' && 'rotate-180')} />
                    </div>
                    <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                      {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {lang === 'ur' && law.summaryUrdu ? law.summaryUrdu : law.summary ?? ''}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
