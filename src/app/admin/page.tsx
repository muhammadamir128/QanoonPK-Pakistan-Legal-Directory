'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, Plus, Search, Edit2, Trash2, ExternalLink, RefreshCw,
  FileText, Tags, Database, AlertTriangle, ChevronRight, ChevronLeft,
  Briefcase, FilePlus, Star, ShieldCheck,
  BarChart3, TrendingUp, AlertCircle, Eye, Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Category = {
  id: string
  name: string
  nameUrdu: string
  slug: string
  color: string | null
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
  category: Category
  viewCount: number
  applicabilityTags: string[]
}

type Lawyer = {
  id: string
  slug: string
  name: string
  nameUrdu: string | null
  city: string
  province: string
  rating: number
  reviewCount: number
  verified: boolean
  featured: boolean
  acceptingCases: boolean
  specialization: string[]
  viewCount: number
  email: string | null
  phone: string | null
}

type Template = {
  id: string
  slug: string
  title: string
  titleUrdu: string | null
  category: string
  downloads: number
  fields: Array<{ key: string; label: string; type: string; required?: boolean }>
}

type AnalyticsData = {
  totalSearches: number
  zeroResultCount: number
  zeroResultRate: number
  topSearches: Array<{ query: string; count: number }>
  zeroResultQueries: Array<{ query: string; count: number }>
  topLaws: Array<{ slug: string; title: string; titleUrdu: string | null; yearEnacted: number; viewCount: number; category: { name: string; slug: string; color: string | null } }>
  topLawyers: Array<{ slug: string; name: string; nameUrdu: string | null; city: string; viewCount: number; rating: number }>
  topTemplates: Array<{ slug: string; title: string; titleUrdu: string | null; downloads: number; category: string }>
  searchesByDay: Array<{ date: string; count: number; zeroResults: number }>
  days: number
}

export default function AdminPage() {
  const { t, lang } = useLanguage()
  const [laws, setLaws] = React.useState<Law[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [lawyers, setLawyers] = React.useState<Lawyer[]>([])
  const [templates, setTemplates] = React.useState<Template[]>([])
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState<{ lawCount: number; categoryCount: number; sectionCount: number; amendmentCount: number; lawyerCount?: number; templateCount?: number } | null>(null)
  const [search, setSearch] = React.useState('')
  const [editingLaw, setEditingLaw] = React.useState<Law | null>(null)
  const [creating, setCreating] = React.useState(false)
  const [showCreateLawyer, setShowCreateLawyer] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('laws')

  const loadAll = React.useCallback(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/laws?limit=50').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/lawyers?limit=50').then((r) => r.json()),
      fetch('/api/templates?limit=50').then((r) => r.json()),
      fetch('/api/analytics').then((r) => r.json()),
    ]).then(([lawsData, catsData, s, lawyersData, templatesData, a]) => {
      setLaws(lawsData.items ?? [])
      setCategories(catsData.items ?? [])
      setLawyers(lawyersData.items ?? [])
      setTemplates(templatesData.items ?? [])
      setAnalytics(a)
      setStats({
        lawCount: s.lawCount,
        categoryCount: s.categoryCount,
        sectionCount: s.sectionCount,
        amendmentCount: s.amendmentCount,
        lawyerCount: s.lawyerCount,
        templateCount: s.templateCount,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  React.useEffect(() => { loadAll() }, [loadAll])

  const reseed = async () => {
    toast.info(t('Reseeding database...', 'ڈیٹابیس دوبارہ سید ہو رہا ہے...'))
    const res = await fetch('/api/seed', { method: 'POST' })
    const d = await res.json()
    if (d.ok) {
      toast.success(t('Database reseeded successfully', 'ڈیٹابیس کامیابی سے سید ہو گیا'))
      loadAll()
    } else {
      toast.error(t('Reseed failed', 'سید ناکام'))
    }
  }

  const deleteLaw = async (law: Law) => {
    if (!confirm(`${t('Delete', 'حذف کریں')} "${law.title}"?`)) return
    const res = await fetch(`/api/laws/${law.slug}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success(t('Law deleted', 'قانون حذف ہو گیا'))
      loadAll()
    } else {
      toast.error(t('Delete failed', 'حذف ناکام'))
    }
  }

  const deleteLawyer = async (lawyer: Lawyer) => {
    if (!confirm(`${t('Delete', 'حذف کریں')} "${lawyer.name}"?`)) return
    const res = await fetch(`/api/admin/lawyers/${lawyer.slug}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success(t('Lawyer deleted', 'وکیل حذف ہو گیا'))
      loadAll()
    } else {
      toast.error(t('Delete failed', 'حذف ناکام'))
    }
  }

  const deleteTemplate = async (tpl: Template) => {
    if (!confirm(`${t('Delete', 'حذف کریں')} "${tpl.title}"?`)) return
    const res = await fetch(`/api/admin/templates/${tpl.slug}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success(t('Template deleted', 'ٹیمپلیٹ حذف ہو گیا'))
      loadAll()
    } else {
      toast.error(t('Delete failed', 'حذف ناکام'))
    }
  }

  const toggleLawyerFeatured = async (lawyer: Lawyer) => {
    const res = await fetch(`/api/admin/lawyers/${lawyer.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !lawyer.featured }),
    })
    if (res.ok) {
      toast.success(t('Lawyer updated', 'وکیل اپڈیٹ ہو گیا'))
      loadAll()
    }
  }

  const toggleLawyerVerified = async (lawyer: Lawyer) => {
    const res = await fetch(`/api/admin/lawyers/${lawyer.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: !lawyer.verified }),
    })
    if (res.ok) {
      toast.success(t('Lawyer updated', 'وکیل اپڈیٹ ہو گیا'))
      loadAll()
    }
  }

  const filtered = laws.filter((l) => {
    if (!search) return true
    const q = search.toLowerCase()
    return l.title.toLowerCase().includes(q) || l.slug.toLowerCase().includes(q) || (l.titleUrdu ?? '').includes(search)
  })

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('Admin', 'ایڈمن')}</span>
        </div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <LayoutDashboard className="h-7 w-7 text-primary" />
              {t('Admin Dashboard', 'ایڈمن ڈیش بورڈ')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('Manage laws, categories, and view site analytics.', 'قوانین، اقسام اور سائٹ تجزیات دیکھیں۔')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={reseed}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('Reseed DB', 'ڈیٹابیس سید')}
            </Button>
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('Add Law', 'قانون شامل')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatCard icon={FileText} label={t('Laws', 'قوانین')} value={stats.lawCount} color="var(--primary)" />
          <StatCard icon={Tags} label={t('Categories', 'اقسام')} value={stats.categoryCount} color="#9333ea" />
          <StatCard icon={Database} label={t('Sections', 'شقیں')} value={stats.sectionCount} color="#ea580c" />
          <StatCard icon={Database} label={t('Amendments', 'ترامیم')} value={stats.amendmentCount} color="#0891b2" />
          {stats.lawyerCount != null && (
            <StatCard icon={Briefcase} label={t('Lawyers', 'وکلاء')} value={stats.lawyerCount} color="#0d9488" />
          )}
          {stats.templateCount != null && (
            <StatCard icon={FilePlus} label={t('Templates', 'ٹیمپلیٹس')} value={stats.templateCount} color="#db2777" />
          )}
        </div>
      )}

      {/* Categories management */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Tags className="h-4 w-4 text-primary" />
            {t('Categories', 'اقسام')}
          </CardTitle>
          <CardDescription className="text-xs">
            {categories.length} {t('categories available', 'اقسام دستیاب')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {categories.map((c) => (
              <Link key={c.id} href={`/categories/${c.slug}`} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-accent/50 transition-all">
                <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: c.color ?? 'var(--primary)' }} />
                <span className="text-sm font-medium flex-1">{lang === 'ur' ? c.nameUrdu : c.name}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabbed management: Laws / Lawyers / Templates / Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4 h-11">
          <TabsTrigger value="laws" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{t('Laws', 'قوانین')}</span>
            <Badge variant="secondary" className="text-[10px] ml-1">{laws.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="lawyers" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">{t('Lawyers', 'وکلاء')}</span>
            <Badge variant="secondary" className="text-[10px] ml-1">{lawyers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('Templates', 'ٹیمپلیٹس')}</span>
            <Badge variant="secondary" className="text-[10px] ml-1">{templates.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t('Analytics', 'تجزیات')}</span>
          </TabsTrigger>
        </TabsList>

        {/* LAWS TAB */}
        <TabsContent value="laws">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {t('Laws Management', 'قوانین کا انتظام')}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {filtered.length} {t('of', 'از')} {laws.length} {t('laws', 'قوانین')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('Search laws...', 'قوانین تلاش کریں...')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-9 pl-8 w-64 text-sm"
                    />
                  </div>
                  <Button size="sm" onClick={() => setCreating(true)}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    {t('Add', 'شامل')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
                  <Table>
                    <TableHeader sticky className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead className="w-[40%]">{t('Law', 'قانون')}</TableHead>
                        <TableHead>{t('Category', 'قسم')}</TableHead>
                        <TableHead>{t('Year', 'سال')}</TableHead>
                        <TableHead>{t('Status', 'صورتحرال')}</TableHead>
                        <TableHead className="text-right">{t('Views', 'مشاہدات')}</TableHead>
                        <TableHead className="text-right">{t('Actions', 'اقدامات')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((law) => (
                        <TableRow key={law.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <Link href={`/laws/${law.slug}`} className="hover:text-primary">{law.title}</Link>
                              {law.titleUrdu && (
                                <span className="text-xs text-muted-foreground font-urdu" dir="rtl">{law.titleUrdu}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs" style={{ color: law.category.color ?? undefined }}>
                              {lang === 'ur' ? law.category.nameUrdu : law.category.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm tabular-nums">{law.yearEnacted}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs capitalize">{law.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm">{law.viewCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingLaw(law)}>
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteLaw(law)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                <Link href={`/laws/${law.slug}`} target="_blank"><ExternalLink className="h-3.5 w-3.5" /></Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* LAWYERS TAB */}
        <TabsContent value="lawyers">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    {t('Lawyers Management', 'وکلاء کا انتظام')}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {lawyers.length} {t('lawyers', 'وکلاء')} • {t('Toggle verified/featured, delete, or create lawyers', 'تصدیق/نمایاں تبدیل کریں، حذف یا تخلیق کریں')}
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => { setActiveTab('lawyers'); setShowCreateLawyer(true) }}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  {t('Add Lawyer', 'وکیل شامل')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
                  <Table>
                    <TableHeader sticky className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead className="w-[35%]">{t('Lawyer', 'وکیل')}</TableHead>
                        <TableHead>{t('City', 'شہر')}</TableHead>
                        <TableHead>{t('Specializations', 'تخصیصات')}</TableHead>
                        <TableHead className="text-center">{t('Rating', 'درجہ')}</TableHead>
                        <TableHead className="text-center">{t('Verified', 'تصدیق')}</TableHead>
                        <TableHead className="text-center">{t('Featured', 'نمایاں')}</TableHead>
                        <TableHead className="text-right">{t('Actions', 'اقدامات')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lawyers.map((lawyer) => (
                        <TableRow key={lawyer.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <Link href={`/lawyers/${lawyer.slug}`} className="hover:text-primary">{lawyer.name}</Link>
                              {lawyer.nameUrdu && (
                                <span className="text-xs text-muted-foreground font-urdu" dir="rtl">{lawyer.nameUrdu}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{lawyer.city}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {lawyer.specialization.slice(0, 2).map((s) => (
                                <Badge key={s} variant="outline" className="text-[10px] capitalize">{s.replace(/-/g, ' ')}</Badge>
                              ))}
                              {lawyer.specialization.length > 2 && (
                                <Badge variant="secondary" className="text-[10px]">+{lawyer.specialization.length - 2}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-sm tabular-nums">
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              {lawyer.rating.toFixed(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <button
                              onClick={() => toggleLawyerVerified(lawyer)}
                              className={cn(
                                'inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors',
                                lawyer.verified
                                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                                  : 'bg-muted text-muted-foreground'
                              )}
                              title={lawyer.verified ? t('Verified — click to unverify', 'تصدیق شدہ — غیر تصدیق کے لیے کلک کریں') : t('Not verified — click to verify', 'غیر تصدیق شدہ — تصدیق کے لیے کلک کریں')}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                            </button>
                          </TableCell>
                          <TableCell className="text-center">
                            <button
                              onClick={() => toggleLawyerFeatured(lawyer)}
                              className={cn(
                                'inline-flex h-6 px-2 items-center justify-center rounded-md text-xs font-medium transition-colors',
                                lawyer.featured
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {lawyer.featured ? '★' : '☆'}
                            </button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteLawyer(lawyer)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                <Link href={`/lawyers/${lawyer.slug}`} target="_blank"><ExternalLink className="h-3.5 w-3.5" /></Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEMPLATES TAB */}
        <TabsContent value="templates">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FilePlus className="h-4 w-4 text-primary" />
                {t('Templates Management', 'ٹیمپلیٹس کا انتظام')}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {templates.length} {t('templates', 'ٹیمپلیٹس')} • {t('Delete templates (creation via seed for now)', 'ٹیمپلیٹس حذف کریں (ابھی سید کے ذریعے تخلیق)')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
                  <Table>
                    <TableHeader sticky className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead className="w-[40%]">{t('Template', 'ٹیمپلیٹ')}</TableHead>
                        <TableHead>{t('Category', 'قسم')}</TableHead>
                        <TableHead className="text-center">{t('Fields', 'خانے')}</TableHead>
                        <TableHead className="text-right">{t('Downloads', 'ڈاؤن لوڈ')}</TableHead>
                        <TableHead className="text-right">{t('Actions', 'اقدامات')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templates.map((tpl) => (
                        <TableRow key={tpl.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <Link href={`/templates/${tpl.slug}`} className="hover:text-primary">{tpl.title}</Link>
                              {tpl.titleUrdu && (
                                <span className="text-xs text-muted-foreground font-urdu" dir="rtl">{tpl.titleUrdu}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">{tpl.category}</Badge>
                          </TableCell>
                          <TableCell className="text-center text-sm tabular-nums">{tpl.fields.length}</TableCell>
                          <TableCell className="text-right text-sm tabular-nums">{tpl.downloads}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteTemplate(tpl)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                <Link href={`/templates/${tpl.slug}`} target="_blank"><ExternalLink className="h-3.5 w-3.5" /></Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics">
          {analytics ? (
            <div className="space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Search className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tabular-nums leading-none">{analytics.totalSearches}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t('Total Searches', 'کل تلاشیں')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tabular-nums leading-none">{analytics.zeroResultCount}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t('Zero Results', 'صفر نتائج')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tabular-nums leading-none">{analytics.zeroResultRate}%</div>
                        <div className="text-xs text-muted-foreground mt-1">{t('Gap Rate', 'خلل کی شرح')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tabular-nums leading-none">{analytics.days}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t('Days Tracked', 'دن ٹریک کیے')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search activity chart (simple bar chart) */}
              {analytics.searchesByDay.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      {t('Search Activity (Last ' + analytics.days + ' Days)', 'تلاش کی سرگرمی (پچھلے ' + analytics.days + ' دن)')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-1 h-32 overflow-x-auto scrollbar-thin">
                      {analytics.searchesByDay.map((day) => {
                        const maxCount = Math.max(...analytics.searchesByDay.map((d) => d.count), 1)
                        const height = day.count > 0 ? Math.max(2, (day.count / maxCount) * 100) : 1
                        return (
                          <div key={day.date} className="flex flex-col items-center gap-1 shrink-0" style={{ minWidth: '20px' }}>
                            <div
                              className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors"
                              style={{ height: `${height}%` }}
                              title={`${day.date}: ${day.count} searches (${day.zeroResults} zero-results)`}
                            />
                            <span className="text-[8px] text-muted-foreground tabular-nums">{day.date.slice(5)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Top searches */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Search className="h-4 w-4 text-primary" />
                      {t('Top Searches', 'مقبول تلاشیں')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics.topSearches.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">{t('No searches yet', 'ابھی کوئی تلاش نہیں')}</p>
                    ) : (
                      <div className="space-y-1.5">
                        {analytics.topSearches.slice(0, 10).map((s, i) => (
                          <div key={s.query} className="flex items-center gap-3 p-2 rounded hover:bg-accent/50 transition-colors">
                            <span className="text-xs font-bold text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                            <span className="text-sm font-medium flex-1 truncate">{s.query}</span>
                            <Badge variant="secondary" className="text-xs tabular-nums">{s.count}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Content gaps (zero-result searches) */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      {t('Content Gaps', 'مواد کے خلل')}
                      <Badge variant="secondary" className="text-xs">{analytics.zeroResultQueries.length}</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">{t('Searches with no matching results — content opportunity', 'بغیر نتائج کی تلاشیں — مواد کا موقع')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.zeroResultQueries.length === 0 ? (
                      <p className="text-sm text-emerald-600 py-4 text-center">{t('No content gaps found', 'کوئی مواد کا خلل نہیں ملا')}</p>
                    ) : (
                      <div className="space-y-1.5">
                        {analytics.zeroResultQueries.slice(0, 10).map((s, i) => (
                          <div key={s.query} className="flex items-center gap-3 p-2 rounded hover:bg-accent/50 transition-colors">
                            <span className="text-xs font-bold text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                            <span className="text-sm flex-1 truncate">{s.query}</span>
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 tabular-nums">{s.count}×</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Top viewed laws */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      {t('Most Viewed Laws', 'سب سے زیادہ دیکھے گئے قوانین')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      {analytics.topLaws.slice(0, 5).map((law, i) => (
                        <Link key={law.slug} href={`/laws/${law.slug}`} className="flex items-center gap-2 p-2 rounded hover:bg-accent/50 transition-colors">
                          <span className="text-xs font-bold text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}</p>
                            <p className="text-[10px] text-muted-foreground">{law.category.name}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs tabular-nums">{law.viewCount}</Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top viewed lawyers */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      {t('Top Lawyers', 'بہترین وکلاء')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      {analytics.topLawyers.slice(0, 5).map((lawyer, i) => (
                        <Link key={lawyer.slug} href={`/lawyers/${lawyer.slug}`} className="flex items-center gap-2 p-2 rounded hover:bg-accent/50 transition-colors">
                          <span className="text-xs font-bold text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{lang === 'ur' && lawyer.nameUrdu ? lawyer.nameUrdu : lawyer.name}</p>
                            <p className="text-[10px] text-muted-foreground">{lawyer.city}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs tabular-nums">{lawyer.viewCount}</Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top downloaded templates */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Download className="h-4 w-4 text-primary" />
                      {t('Top Templates', 'بہترین ٹیمپلیٹس')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      {analytics.topTemplates.slice(0, 5).map((tpl, i) => (
                        <Link key={tpl.slug} href={`/templates/${tpl.slug}`} className="flex items-center gap-2 p-2 rounded hover:bg-accent/50 transition-colors">
                          <span className="text-xs font-bold text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{lang === 'ur' && tpl.titleUrdu ? tpl.titleUrdu : tpl.title}</p>
                            <p className="text-[10px] text-muted-foreground">{tpl.category}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs tabular-nums">{tpl.downloads}</Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">{t('Loading analytics...', 'تجزیات لوڈ ہو رہی ہیں...')}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Warning notice */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/20 border-amber-300/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              {t('This admin panel is in public read/write mode for demo purposes. In production, role-based authentication should be enforced.', 'یہ ایڈمن پینل ڈیمو کے لیے عوامی ریڈ/رائٹ موڈ میں ہے۔ پروڈکشن میں رول بیسڈ تصدیق لازم ہے۔')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      {editingLaw && (
        <LawEditDialog
          law={editingLaw}
          categories={categories}
          onClose={() => { setEditingLaw(null); loadAll() }}
        />
      )}

      {/* Create dialog */}
      {creating && (
        <LawEditDialog
          law={null}
          categories={categories}
          onClose={() => { setCreating(false); loadAll() }}
        />
      )}

      {/* Create Lawyer dialog */}
      {showCreateLawyer && (
        <LawyerCreateDialog
          categories={categories}
          onClose={() => { setShowCreateLawyer(false); loadAll() }}
        />
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>, label: string, value: number, color: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ backgroundColor: color }}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold tabular-nums leading-none">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function LawEditDialog({
  law, categories, onClose,
}: {
  law: Law | null
  categories: Category[]
  onClose: () => void
}) {
  const { t } = useLanguage()
  const isEdit = !!law
  const [title, setTitle] = React.useState(law?.title ?? '')
  const [titleUrdu, setTitleUrdu] = React.useState(law?.titleUrdu ?? '')
  const [slug, setSlug] = React.useState(law?.slug ?? '')
  const [categoryId, setCategoryId] = React.useState(law?.category.id ?? categories[0]?.id ?? '')
  const [yearEnacted, setYearEnacted] = React.useState(String(law?.yearEnacted ?? new Date().getFullYear()))
  const [jurisdiction, setJurisdiction] = React.useState(law?.jurisdiction ?? 'federal')
  const [status, setStatus] = React.useState(law?.status ?? 'active')
  const [summary, setSummary] = React.useState(law?.summary ?? '')
  const [summaryUrdu, setSummaryUrdu] = React.useState(law?.summaryUrdu ?? '')
  const [saving, setSaving] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !categoryId) {
      toast.error(t('Missing required fields', 'ضروری خانے خالی ہیں'))
      return
    }
    setSaving(true)
    try {
      const body = {
        title, titleUrdu, slug, categoryId, yearEnacted: parseInt(yearEnacted),
        jurisdiction, status, summary, summaryUrdu, applicabilityTags: [],
      }
      const res = isEdit
        ? await fetch(`/api/laws/${law!.slug}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/laws', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await res.json()
      if (d.ok || d.law) {
        toast.success(isEdit ? t('Law updated', 'قانون اپڈیٹ ہو گیا') : t('Law created', 'قانون بنا دیا گیا'))
        onClose()
      } else {
        toast.error(d.error ?? t('Save failed', 'محفوظ نہ ہو سکا'))
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            {isEdit ? t('Edit Law', 'قانون میں ترمیم') : t('Create New Law', 'نیا قانون بنائیں')}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t('Update the law details below.', 'قانون کی تفصیلات اپڈیٹ کریں۔') : t('Fill in the form to create a new law entry.', 'نیا قانون بنانے کے لیے فارم بھریں۔')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="title">{t('Title (English)', 'عنوان (انگریزی)')} *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="titleUrdu">{t('Title (Urdu)', 'عنوان (اردو)')}</Label>
              <Input id="titleUrdu" value={titleUrdu} onChange={(e) => setTitleUrdu(e.target.value)} dir="rtl" className="font-urdu" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">{t('URL Slug', 'یو آر ایل سلگ')} *</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="pakistan-penal-code-1860" />
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>{t('Category', 'قسم')}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">{t('Year', 'سال')}</Label>
              <Input id="year" type="number" value={yearEnacted} onChange={(e) => setYearEnacted(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('Jurisdiction', 'عدلیہ')}</Label>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="sindh">Sindh</SelectItem>
                  <SelectItem value="kpk">KPK</SelectItem>
                  <SelectItem value="balochistan">Balochistan</SelectItem>
                  <SelectItem value="gilgit_baltistan">Gilgit-Baltistan</SelectItem>
                  <SelectItem value="ajk">AJK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('Status', 'صورتحرال')}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="amended">Amended</SelectItem>
                <SelectItem value="repealed">Repealed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="summary">{t('Summary (English)', 'خلاصہ (انگریزی)')}</Label>
            <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="summaryUrdu">{t('Summary (Urdu)', 'خلاصہ (اردو)')}</Label>
            <Textarea id="summaryUrdu" value={summaryUrdu} onChange={(e) => setSummaryUrdu(e.target.value)} rows={3} dir="rtl" className="font-urdu" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>{t('Cancel', 'منسوخ')}</Button>
            <Button type="submit" disabled={saving}>
              {saving ? t('Saving...', 'محفوظ ہو رہا ہے...') : isEdit ? t('Save changes', 'تبدیلیاں محفوظ کریں') : t('Create law', 'قانون بنائیں')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function LawyerCreateDialog({
  categories, onClose,
}: {
  categories: Category[]
  onClose: () => void
}) {
  const { t } = useLanguage()
  const [name, setName] = React.useState('')
  const [nameUrdu, setNameUrdu] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [bio, setBio] = React.useState('')
  const [city, setCity] = React.useState('')
  const [province, setProvince] = React.useState('punjab')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [specialization, setSpecialization] = React.useState<string[]>([])
  const [experienceYears, setExperienceYears] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  const provinces = ['federal', 'punjab', 'sindh', 'kpk', 'balochistan', 'gilgit_baltistan', 'ajk']

  const toggleSpec = (slug: string) => {
    setSpecialization((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug || !city) {
      toast.error(t('Missing required fields', 'ضروری خانے خالی ہیں'))
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/lawyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, nameUrdu: nameUrdu || undefined, slug, bio: bio || undefined,
          city, province, email: email || undefined, phone: phone || undefined,
          specialization, experienceYears: experienceYears || undefined,
          verified: true, featured: false, acceptingCases: true,
        }),
      })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Lawyer created', 'وکیل بنا دیا گیا'))
        onClose()
      } else {
        toast.error(d.error ?? t('Failed to create lawyer', 'وکیل بنانے میں ناکام'))
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {t('Create New Lawyer', 'نیا وکیل بنائیں')}
          </DialogTitle>
          <DialogDescription>{t('Add a verified lawyer to the directory.', 'ڈائریکٹری میں تصدیق شدہ وکیل شامل کریں۔')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lname">{t('Name (English)', 'نام (انگریزی)')} *</Label>
              <Input id="lname" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lnameUrdu">{t('Name (Urdu)', 'نام (اردو)')}</Label>
              <Input id="lnameUrdu" value={nameUrdu} onChange={(e) => setNameUrdu(e.target.value)} dir="rtl" className="font-urdu" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lslug">{t('URL Slug', 'یو آر ایل سلگ')} *</Label>
            <Input id="lslug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} required placeholder="e.g. barrister-ahmed-ali" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lbio">{t('Bio', 'بائیو')}</Label>
            <Textarea id="lbio" value={bio} onChange={(e) => setBio(e.target.value)} rows={2} placeholder={t('Brief professional bio...', 'مختصر پیشہ ورانہ بائیو...')} />
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lcity">{t('City', 'شہر')} *</Label>
              <Input id="lcity" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="e.g. Lahore" />
            </div>
            <div className="space-y-1.5">
              <Label>{t('Province', 'صوبہ')}</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lexp">{t('Experience (years)', 'تجربہ (سال)')}</Label>
              <Input id="lexp" type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="e.g. 10" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lemail">{t('Email', 'ای میل')}</Label>
              <Input id="lemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lawyer@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lphone">{t('Phone', 'فون')}</Label>
              <Input id="lphone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92-300-1234567" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t('Specializations', 'تخصیصات')}</Label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto scrollbar-thin border border-border/40 rounded-lg p-2">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => toggleSpec(c.slug)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                    specialization.includes(c.slug)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border hover:bg-accent'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">{specialization.length} selected</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>{t('Cancel', 'منسوخ')}</Button>
            <Button type="submit" disabled={saving}>
              {saving ? t('Saving...', 'محفوظ ہو رہا ہے...') : t('Create Lawyer', 'وکیل بنائیں')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
