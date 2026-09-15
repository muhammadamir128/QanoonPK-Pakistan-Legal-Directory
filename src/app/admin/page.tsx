'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Plus, Search, Edit2, Trash2, ExternalLink, RefreshCw,
  FileText, Tags, Database, AlertTriangle, ChevronRight, ChevronLeft,
  Briefcase, FilePlus, Star, ShieldCheck, BarChart3, TrendingUp,
  AlertCircle, Eye, Download, Users, ShieldAlert, LogOut, Sun, Moon,
  Languages, Menu, X, ArrowLeft, ArrowUpRight, CheckCircle2,
  UserCheck, Settings, Lock, Sparkles, Filter, Check,
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
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Category = {
  id: string
  name: string
  nameUrdu: string
  slug: string
  color: string | null
  description?: string | null
  descriptionUrdu?: string | null
  _count?: { laws: number }
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
  summaryUrdu?: string | null
  gazetteReference?: string | null
  promulgatingAuthority?: string | null
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
  categoryUrdu?: string | null
  description?: string | null
  downloads: number
  fieldsJson?: string
  fields: Array<{ key: string; label: string; type: string; required?: boolean }>
}

type ManagedUser = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  _count?: { bookmarks: number }
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
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const { t, lang, setLang } = useLanguage()
  const router = useRouter()

  const [activeTab, setActiveTab] = React.useState<'overview' | 'laws' | 'categories' | 'lawyers' | 'templates' | 'analytics' | 'users'>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Data states
  const [laws, setLaws] = React.useState<Law[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [lawyers, setLawyers] = React.useState<Lawyer[]>([])
  const [templates, setTemplates] = React.useState<Template[]>([])
  const [users, setUsers] = React.useState<ManagedUser[]>([])
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState<{
    lawCount: number
    categoryCount: number
    sectionCount: number
    amendmentCount: number
    lawyerCount?: number
    templateCount?: number
  } | null>(null)

  // Filters & Search
  const [search, setSearch] = React.useState('')
  const [selectedJurisdiction, setSelectedJurisdiction] = React.useState<string>('all')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  // Modals
  const [editingLaw, setEditingLaw] = React.useState<Law | null>(null)
  const [creatingLaw, setCreatingLaw] = React.useState(false)
  const [creatingLawyer, setCreatingLawyer] = React.useState(false)
  const [creatingCategory, setCreatingCategory] = React.useState(false)
  const [creatingTemplate, setCreatingTemplate] = React.useState(false)

  const loadAll = React.useCallback(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/laws?limit=100').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/lawyers?limit=100').then((r) => r.json()),
      fetch('/api/templates?limit=100').then((r) => r.json()),
      fetch('/api/analytics').then((r) => r.json()),
      fetch('/api/admin/users').then((r) => (r.ok ? r.json() : { ok: false, users: [] })),
    ])
      .then(([lawsData, catsData, s, lawyersData, templatesData, a, usersData]) => {
        setLaws(lawsData.items ?? [])
        setCategories(catsData.items ?? [])
        setLawyers(lawyersData.items ?? [])
        setTemplates(templatesData.items ?? [])
        setAnalytics(a)
        if (usersData.ok && usersData.users) {
          setUsers(usersData.users)
        }
        setStats({
          lawCount: s.lawCount ?? 0,
          categoryCount: s.categoryCount ?? 0,
          sectionCount: s.sectionCount ?? 0,
          amendmentCount: s.amendmentCount ?? 0,
          lawyerCount: s.lawyerCount ?? 0,
          templateCount: s.templateCount ?? 0,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  React.useEffect(() => {
    if (session?.user && (session.user as any).role === 'admin') {
      loadAll()
    }
  }, [session, loadAll])

  // --- Reseed Handler ---
  const reseed = async () => {
    if (!confirm(t('Are you sure you want to reseed the database?', 'کیا آپ واقعی ڈیٹابیس کو دوبارہ سید کرنا چاہتے ہیں؟'))) return
    toast.info(t('Reseeding database...', 'ڈیٹابیس دوبارہ سید ہو رہا ہے...'))
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Database reseeded successfully', 'ڈیٹابیس کامیابی سے سید ہو گیا'))
        loadAll()
      } else {
        toast.error(t('Reseed failed', 'سید ناکام'))
      }
    } catch {
      toast.error(t('Reseed failed', 'سید ناکام'))
    }
  }

  // --- Delete Law ---
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

  // --- Delete Category ---
  const deleteCategory = async (cat: Category) => {
    if (!confirm(`${t('Delete category', 'قسم حذف کریں')} "${cat.name}"?`)) return
    const res = await fetch(`/api/categories/${cat.slug}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok && data.ok) {
      toast.success(t('Category deleted', 'قسم حذف ہو گئی'))
      loadAll()
    } else {
      toast.error(data.error || t('Delete failed', 'حذف ناکام'))
    }
  }

  // --- Delete Lawyer ---
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

  // --- Delete Template ---
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

  // --- Toggle Lawyer Status ---
  const toggleLawyerFeatured = async (lawyer: Lawyer) => {
    const res = await fetch(`/api/admin/lawyers/${lawyer.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !lawyer.featured }),
    })
    if (res.ok) {
      toast.success(t('Lawyer status updated', 'وکیل کا اسٹیٹس اپڈیٹ ہو گیا'))
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
      toast.success(t('Lawyer status updated', 'وکیل کا اسٹیٹس اپڈیٹ ہو گیا'))
      loadAll()
    }
  }

  // --- Change User Role ---
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        toast.success(t('User role updated to ' + newRole, 'صارف کا کردار تبدیل ہو گیا: ' + newRole))
        loadAll()
      } else {
        toast.error(data.error || 'Failed to update role')
      }
    } catch {
      toast.error('Failed to update role')
    }
  }

  // --- AUTH GUARD CHECKS ---
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 animate-pulse">
          <ShieldCheck className="h-8 w-8 animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          {t('Authenticating Administrator...', 'ایڈمن کی تصدیق ہو رہی ہے...')}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t('Verifying security privileges for QanoonPK Management Portal', 'سیکیورٹی مراعات اور اختیارات کی جانچ کی جا رہی ہے')}
        </p>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border/80 shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-500 via-red-500 to-rose-600" />
          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mb-3">
              <Lock className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {t('Admin Access Restricted', 'ایڈمن رسائی محدود ہے')}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {t(
                'This portal is strictly restricted to system administrators. Please sign in with authorized admin credentials to continue.',
                'یہ پورٹل صرف سسٹم ایڈمنسٹریٹرز کے لیے مختص ہے۔ آگے بڑھنے کے لیے مجاز ایڈمن اکاؤنٹ سے لاگ ان کریں۔'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-8 pt-2">
            <Button
              className="w-full h-11 text-sm font-semibold shadow-md gap-2"
              onClick={() => router.push('/login?callbackUrl=/admin')}
            >
              <ShieldCheck className="h-4 w-4" />
              {t('Sign In as Administrator', 'بطور ایڈمن لاگ ان کریں')}
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 text-sm font-medium gap-2"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              {t('Return to Public Site', 'عوامی ویب سائٹ پر واپس جائیں')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userRole = (session.user as any)?.role || 'user'
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/30 shadow-2xl overflow-hidden">
          <div className="h-2 bg-destructive" />
          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mb-3">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-destructive">
              {t('Access Forbidden (403)', 'رسائی ممنوع ہے')}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {t(
                'Your account does not possess administrator privileges. Access to the management console is denied.',
                'آپ کا اکاؤنٹ ایڈمنسٹریٹر کے اختیارات نہیں رکھتا۔ ایڈمن کنسول تک رسائی ممنوع ہے۔'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-8">
            <div className="p-3.5 rounded-lg bg-muted/60 border border-border/70 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('Logged In As:', 'لاگ ان بطور:')}</span>
                <span className="font-semibold text-foreground">{session.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('Assigned Role:', 'موجودہ کردار:')}</span>
                <span className="font-semibold uppercase text-amber-600 dark:text-amber-400">{userRole}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="destructive"
                className="w-full h-10 text-sm font-semibold gap-2"
                onClick={() => signOut({ callbackUrl: '/login?callbackUrl=/admin' })}
              >
                <LogOut className="h-4 w-4" />
                {t('Switch to Admin Account', 'ایڈمن اکاؤنٹ سے تبدیل کریں')}
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 text-sm font-medium gap-2"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="h-4 w-4" />
                {t('Return to Public Site', 'عوامی سائٹ پر واپس جائیں')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- FILTERED LAWS ---
  const filteredLaws = laws.filter((l) => {
    if (selectedJurisdiction !== 'all' && l.jurisdiction !== selectedJurisdiction) return false
    if (selectedCategory !== 'all' && l.category?.slug !== selectedCategory) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.title.toLowerCase().includes(q) ||
      l.slug.toLowerCase().includes(q) ||
      (l.titleUrdu ?? '').includes(search) ||
      (l.category?.name ?? '').toLowerCase().includes(q)
    )
  })

  // --- FILTERED LAWYERS ---
  const filteredLawyers = lawyers.filter((lawyer) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      lawyer.name.toLowerCase().includes(q) ||
      (lawyer.nameUrdu ?? '').includes(search) ||
      lawyer.city.toLowerCase().includes(q) ||
      lawyer.province.toLowerCase().includes(q)
    )
  })

  // --- FILTERED TEMPLATES ---
  const filteredTemplates = templates.filter((tpl) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      tpl.title.toLowerCase().includes(q) ||
      (tpl.titleUrdu ?? '').includes(search) ||
      tpl.category.toLowerCase().includes(q)
    )
  })

  // --- SIDEBAR NAVIGATION DEFINITION ---
  const navItems = [
    {
      id: 'overview',
      labelEn: 'Dashboard Overview',
      labelUr: 'ڈیش بورڈ خلاصہ',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'laws',
      labelEn: 'Laws Management',
      labelUr: 'قوانین کا انتظام',
      icon: FileText,
      badge: laws.length,
    },
    {
      id: 'categories',
      labelEn: 'Categories',
      labelUr: 'قانونی اقسام',
      icon: Tags,
      badge: categories.length,
    },
    {
      id: 'lawyers',
      labelEn: 'Lawyers Directory',
      labelUr: 'وکلاء کی ڈائریکٹری',
      icon: Briefcase,
      badge: lawyers.length,
    },
    {
      id: 'templates',
      labelEn: 'Legal Templates',
      labelUr: 'قانونی ٹیمپلیٹس',
      icon: FilePlus,
      badge: templates.length,
    },
    {
      id: 'analytics',
      labelEn: 'Analytics & Logs',
      labelUr: 'تجزیات و تلاش لاگز',
      icon: BarChart3,
      badge: analytics ? `${analytics.zeroResultCount} ⚠️` : null,
    },
    {
      id: 'users',
      labelEn: 'User Management',
      labelUr: 'صارفین کا انتظام',
      icon: Users,
      badge: users.length || null,
    },
  ]

  // Shared Sidebar Component
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border text-card-foreground">
      {/* Brand Header */}
      <div className="p-5 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
            <ScaleIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-foreground">
                {t('QanoonPK', 'قانون پی کے')}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('Control Center', 'مرکزی کنٹرول پینل')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
          {t('Navigation Menu', 'نیویگیشن مینو')}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any)
                setMobileMenuOpen(false)
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group text-left',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-primary-foreground' : 'text-primary')} />
                <span>{t(item.labelEn, item.labelUr)}</span>
              </div>
              {item.badge != null && (
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-muted text-muted-foreground border border-border/50'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
          {t('Quick Actions', 'فوری روابط')}
        </div>
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
            <span>{t('View Public Site', 'عوامی سائٹ کھولیں')}</span>
          </div>
          <ArrowUpRight className="h-3 w-3 opacity-60" />
        </Link>
        <Link
          href="/chat"
          target="_blank"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{t('AI Legal Assistant', 'اے آئی قانونی اسسٹنٹ')}</span>
          </div>
          <ArrowUpRight className="h-3 w-3 opacity-60" />
        </Link>
      </div>

      {/* Sidebar Footer / User Card & Controls */}
      <div className="p-3.5 border-t border-border/70 space-y-3 bg-muted/20">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border border-border/70">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            className="h-8 px-2 text-xs font-semibold gap-1.5"
            title="Switch Language"
          >
            <Languages className="h-3.5 w-3.5 text-primary" />
            <span>{lang === 'en' ? 'اردو' : 'English'}</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 text-foreground"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-slate-700" />}
          </Button>

          {/* Sign Out */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Profile Details */}
        <div className="flex items-center gap-2.5 px-1">
          <Avatar className="h-8 w-8 border border-primary/30">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate leading-tight">
              {session?.user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-muted-foreground truncate leading-tight">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col shrink-0 sticky top-0 h-screen z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border/80 bg-background/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={lang === 'ur' ? 'right' : 'left'} className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <span className="text-muted-foreground hidden sm:inline">{t('Admin Portal', 'ایڈمن پورٹل')}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground hidden sm:inline" />
              <span className="text-primary font-bold capitalize">
                {t(
                  navItems.find((n) => n.id === activeTab)?.labelEn || 'Dashboard',
                  navItems.find((n) => n.id === activeTab)?.labelUr || 'ڈیش بورڈ'
                )}
              </span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={reseed}
              className="h-8 text-xs gap-1.5 hidden md:flex border-border/70"
            >
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('Reseed DB', 'ڈیٹابیس ری سیٹ')}</span>
            </Button>

            {/* Context Action Button depending on tab */}
            {activeTab === 'laws' && (
              <Button size="sm" onClick={() => setCreatingLaw(true)} className="h-8 text-xs gap-1.5 shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                <span>{t('Add Law', 'قانون شامل کریں')}</span>
              </Button>
            )}

            {activeTab === 'categories' && (
              <Button size="sm" onClick={() => setCreatingCategory(true)} className="h-8 text-xs gap-1.5 shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                <span>{t('Add Category', 'قسم شامل کریں')}</span>
              </Button>
            )}

            {activeTab === 'lawyers' && (
              <Button size="sm" onClick={() => setCreatingLawyer(true)} className="h-8 text-xs gap-1.5 shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                <span>{t('Add Lawyer', 'وکیل شامل کریں')}</span>
              </Button>
            )}

            {activeTab === 'templates' && (
              <Button size="sm" onClick={() => setCreatingTemplate(true)} className="h-8 text-xs gap-1.5 shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                <span>{t('Add Template', 'ٹیمپلیٹ شامل کریں')}</span>
              </Button>
            )}

            {activeTab === 'overview' && (
              <Button size="sm" onClick={() => setCreatingLaw(true)} className="h-8 text-xs gap-1.5 shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                <span>{t('New Law', 'نیا قانون')}</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <Link href="/">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                <span>{t('Exit Admin', 'ایڈمن سے نکلیں')}</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Dashboard Main Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Welcome Header */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-background border border-primary/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-bold">
                      {t('System Live', 'سسٹم متحرک')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">PostgreSQL / Neon DB</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-foreground">
                    {t('Welcome, Administrator', 'خوش آمدید، ایڈمنسٹریٹر')}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                    {t(
                      'Manage Pakistan laws, verified lawyers, document templates, search logs, and registered users from this centralized console.',
                      'اس مرکزی کنسول سے پاکستانی قوانین، وکلاء، قانونی دستاویز ٹیمپلیٹس، تلاش لاگز اور صارفین کا مکمل انتظام کریں۔'
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => setActiveTab('laws')} className="h-9 gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>{t('Manage Laws', 'قوانین کا انتظام')}</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab('analytics')} className="h-9 gap-1.5">
                    <BarChart3 className="h-4 w-4" />
                    <span>{t('View Logs', 'لاگز ملاحظہ')}</span>
                  </Button>
                </div>
              </div>

              {/* KPI Stat Cards */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <StatCard
                    icon={FileText}
                    label={t('Total Laws', 'کل قوانین')}
                    value={stats.lawCount}
                    color="hsl(var(--primary))"
                    onClick={() => setActiveTab('laws')}
                  />
                  <StatCard
                    icon={Tags}
                    label={t('Categories', 'اقسام')}
                    value={stats.categoryCount}
                    color="#9333ea"
                    onClick={() => setActiveTab('categories')}
                  />
                  <StatCard
                    icon={Briefcase}
                    label={t('Lawyers', 'وکلاء')}
                    value={stats.lawyerCount ?? 0}
                    color="#0d9488"
                    onClick={() => setActiveTab('lawyers')}
                  />
                  <StatCard
                    icon={FilePlus}
                    label={t('Templates', 'ٹیمپلیٹس')}
                    value={stats.templateCount ?? 0}
                    color="#db2777"
                    onClick={() => setActiveTab('templates')}
                  />
                  <StatCard
                    icon={Users}
                    label={t('Users', 'صارفین')}
                    value={users.length}
                    color="#2563eb"
                    onClick={() => setActiveTab('users')}
                  />
                  <StatCard
                    icon={Database}
                    label={t('Sections', 'شقیں')}
                    value={stats.sectionCount}
                    color="#ea580c"
                  />
                </div>
              )}

              {/* Zero-Result Search Warnings Banner if any */}
              {analytics && analytics.zeroResultCount > 0 && (
                <Card className="border-amber-500/30 bg-amber-500/5">
                  <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {analytics.zeroResultCount} {t('Searches yielded 0 results recently', 'حالیہ تلاشوں میں نتائج نہیں ملے')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('Citizens searched for keywords that might require new laws or alias tags.', 'شہریوں نے ایسے الفاظ تلاش کیے جن کے لیے نئے قوانین یا ٹیگز درکار ہو سکتے ہیں۔')}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('analytics')} className="h-8 text-xs">
                      {t('Review Missing Queries', 'غیر موجود تلاش دیکھیں')}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Two Column Layout: Quick Law Directory & Top Searches */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Laws Widget */}
                <Card>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {t('Statutes Overview', 'قوانین کا جائزہ')}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {laws.length} {t('registered acts and ordinances', 'اندراج شدہ ایکٹس اور آرڈیننس')}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('laws')} className="h-8 text-xs gap-1">
                      <span>{t('View All', 'تمام دیکھیں')}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/60">
                      {laws.slice(0, 5).map((law) => (
                        <div key={law.id} className="p-3.5 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={`/laws/${law.slug}`} target="_blank" className="text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                              {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {law.yearEnacted}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground uppercase">{law.jurisdiction}</span>
                              <span className="text-[10px] text-muted-foreground">• {law.category?.name}</span>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setEditingLaw(law)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Search Queries Widget */}
                <Card>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        {t('Top Search Inquiries', 'سب سے زیادہ تلاش کیے گئے الفاظ')}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {t('Real-time citizen search patterns', 'شہریوں کی حقیقی تلاش')}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('analytics')} className="h-8 text-xs gap-1">
                      <span>{t('Analytics', 'تجزیات')}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/60">
                      {analytics?.topSearches && analytics.topSearches.length > 0 ? (
                        analytics.topSearches.slice(0, 5).map((q, idx) => (
                          <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="h-5 w-5 rounded bg-muted flex items-center justify-center font-bold text-[10px] text-muted-foreground">
                                {idx + 1}
                              </span>
                              <span className="font-semibold text-foreground">{q.query}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                              {q.count} {t('searches', 'تلاشیں')}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-xs text-muted-foreground">
                          {t('No searches logged yet', 'ابھی تک کوئی تلاش لاگ نہیں ہوئی')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: LAWS MANAGEMENT */}
          {activeTab === 'laws' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {t('Laws Management', 'قوانین کا انتظام')}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {filteredLaws.length} {t('of', 'از')} {laws.length} {t('laws listed', 'قوانین درج ہیں')}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Search */}
                      <div className="relative w-full sm:w-60">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder={t('Search laws...', 'قوانین تلاش کریں...')}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="h-9 pl-8 text-xs"
                        />
                      </div>

                      {/* Jurisdiction Filter */}
                      <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                        <SelectTrigger className="h-9 text-xs w-36">
                          <SelectValue placeholder={t('Jurisdiction', 'دائرہ اختیار')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('All Jurisdictions', 'تمام دائرہ اختیار')}</SelectItem>
                          <SelectItem value="federal">Federal</SelectItem>
                          <SelectItem value="punjab">Punjab</SelectItem>
                          <SelectItem value="sindh">Sindh</SelectItem>
                          <SelectItem value="kpk">Khyber Pakhtunkhwa</SelectItem>
                          <SelectItem value="balochistan">Balochistan</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Category Filter */}
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-9 text-xs w-36">
                          <SelectValue placeholder={t('Category', 'قسم')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('All Categories', 'تمام اقسام')}</SelectItem>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.slug}>
                              {lang === 'ur' ? c.nameUrdu : c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button size="sm" onClick={() => setCreatingLaw(true)} className="h-9 text-xs gap-1.5 shadow-sm">
                        <Plus className="h-4 w-4" />
                        <span>{t('Add New Law', 'نیا قانون شامل کریں')}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-6 space-y-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : filteredLaws.length === 0 ? (
                    <div className="p-10 text-center text-sm text-muted-foreground">
                      {t('No laws found matching criteria', 'کوئی قانون نہیں ملا')}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            <TableHead className="w-12 text-center text-xs">#</TableHead>
                            <TableHead className="text-xs">{t('Title / Statute', 'عنوان و قانون')}</TableHead>
                            <TableHead className="text-xs">{t('Category', 'قسم')}</TableHead>
                            <TableHead className="text-xs">{t('Year', 'سال')}</TableHead>
                            <TableHead className="text-xs">{t('Jurisdiction', 'دائرہ اختیار')}</TableHead>
                            <TableHead className="text-xs">{t('Status', 'حیثیت')}</TableHead>
                            <TableHead className="text-xs text-center">{t('Views', 'مناظر')}</TableHead>
                            <TableHead className="text-xs text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLaws.map((law, index) => (
                            <TableRow key={law.id} className="hover:bg-muted/30">
                              <TableCell className="text-center text-xs text-muted-foreground">{index + 1}</TableCell>
                              <TableCell className="max-w-md">
                                <div className="font-semibold text-xs text-foreground line-clamp-1">
                                  {law.title}
                                </div>
                                {law.titleUrdu && (
                                  <div className="text-[11px] text-muted-foreground font-urdu line-clamp-1 mt-0.5">
                                    {law.titleUrdu}
                                  </div>
                                )}
                                <div className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
                                  /{law.slug}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[10px] font-normal" style={{ borderColor: law.category?.color ?? undefined }}>
                                  {lang === 'ur' ? law.category?.nameUrdu : law.category?.name}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs font-mono">{law.yearEnacted}</TableCell>
                              <TableCell>
                                <span className="text-[11px] font-medium uppercase px-2 py-0.5 rounded bg-muted">
                                  {law.jurisdiction}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={cn(
                                    'text-[10px] capitalize font-medium',
                                    law.status === 'active' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                                    law.status === 'repealed' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
                                    law.status === 'amended' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  )}
                                >
                                  {law.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center text-xs font-mono text-muted-foreground">
                                {law.viewCount}
                              </TableCell>
                              <TableCell className="text-right pr-4 space-x-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-primary hover:bg-primary/10"
                                  onClick={() => setEditingLaw(law)}
                                  title="Edit Law"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                  asChild
                                  title="View Live"
                                >
                                  <Link href={`/laws/${law.slug}`} target="_blank">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </Link>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => deleteLaw(law)}
                                  title="Delete Law"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Tags className="h-5 w-5 text-primary" />
                    {t('Legal Categories', 'قانونی اقسام')}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {categories.length} {t('specialized legal domains', 'قانونی شاخیں و اقسام')}
                  </p>
                </div>
                <Button size="sm" onClick={() => setCreatingCategory(true)} className="h-9 text-xs gap-1.5 shadow-sm">
                  <Plus className="h-4 w-4" />
                  <span>{t('Add Category', 'نئی قسم شامل کریں')}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <Card key={c.id} className="hover:border-primary/40 transition-all shadow-sm">
                    <CardContent className="p-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className="h-4 w-4 rounded-full shrink-0 mt-0.5"
                          style={{ backgroundColor: c.color ?? 'var(--primary)' }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground font-urdu truncate">{c.nameUrdu}</p>
                          <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">/{c.slug}</p>
                          {c.description && (
                            <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2">{c.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteCategory(c)}
                          title="Delete Category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground"
                          asChild
                          title="View Laws in Category"
                        >
                          <Link href={`/categories/${c.slug}`} target="_blank">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LAWYERS DIRECTORY */}
          {activeTab === 'lawyers' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-teal-600" />
                        {t('Lawyers Directory', 'وکلاء کی ڈائریکٹری')}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {filteredLawyers.length} {t('practicing advocates and legal counsel', 'وکلاء و قانونی مشیران')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder={t('Search lawyers by name or city...', 'نام یا شہر سے وکیل تلاش کریں...')}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="h-9 pl-8 text-xs"
                        />
                      </div>
                      <Button size="sm" onClick={() => setCreatingLawyer(true)} className="h-9 text-xs gap-1.5 shadow-sm">
                        <Plus className="h-4 w-4" />
                        <span>{t('Add Lawyer', 'وکیل شامل کریں')}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-12 text-center text-xs">#</TableHead>
                          <TableHead className="text-xs">{t('Lawyer / Advocate', 'وکیل')}</TableHead>
                          <TableHead className="text-xs">{t('Location', 'شہر و صوبہ')}</TableHead>
                          <TableHead className="text-xs">{t('Specialization', 'شعبہ')}</TableHead>
                          <TableHead className="text-xs">{t('Verified', 'تصدیق شدہ')}</TableHead>
                          <TableHead className="text-xs">{t('Featured', 'نمایاں')}</TableHead>
                          <TableHead className="text-xs text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLawyers.map((lawyer, idx) => (
                          <TableRow key={lawyer.id} className="hover:bg-muted/30">
                            <TableCell className="text-center text-xs text-muted-foreground">{idx + 1}</TableCell>
                            <TableCell>
                              <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                                {lawyer.name}
                                {lawyer.verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                              </div>
                              {lawyer.nameUrdu && (
                                <div className="text-[11px] text-muted-foreground font-urdu mt-0.5">
                                  {lawyer.nameUrdu}
                                </div>
                              )}
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                {lawyer.email || lawyer.phone || 'No direct contact'}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">
                              <span className="font-medium text-foreground">{lawyer.city}</span>, {lawyer.province}
                            </TableCell>
                            <TableCell className="text-xs">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {lawyer.specialization?.slice(0, 2).map((s, i) => (
                                  <Badge key={i} variant="secondary" className="text-[9px] px-1 py-0">
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant={lawyer.verified ? 'default' : 'outline'}
                                onClick={() => toggleLawyerVerified(lawyer)}
                                className={cn('h-6 px-2 text-[10px] rounded-full gap-1', lawyer.verified && 'bg-blue-600 hover:bg-blue-700 text-white')}
                              >
                                <ShieldCheck className="h-3 w-3" />
                                <span>{lawyer.verified ? t('Verified', 'تصدیق شدہ') : t('Unverified', 'غیر تصدیق شدہ')}</span>
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant={lawyer.featured ? 'default' : 'outline'}
                                onClick={() => toggleLawyerFeatured(lawyer)}
                                className={cn('h-6 px-2 text-[10px] rounded-full gap-1', lawyer.featured && 'bg-amber-600 hover:bg-amber-700 text-white')}
                              >
                                <Star className="h-3 w-3" />
                                <span>{lawyer.featured ? t('Featured', 'نمایاں') : t('Standard', 'معیاری')}</span>
                              </Button>
                            </TableCell>
                            <TableCell className="text-right pr-4 space-x-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                asChild
                                title="View Public Profile"
                              >
                                <Link href={`/lawyers/${lawyer.slug}`} target="_blank">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => deleteLawyer(lawyer)}
                                title="Delete Lawyer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 5: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FilePlus className="h-5 w-5 text-pink-600" />
                        {t('Legal Document Templates', 'قانونی دستاویز ٹیمپلیٹس')}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {filteredTemplates.length} {t('ready-to-use agreements and legal drafts', 'قانونی معاہدات اور ڈرافٹس')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder={t('Search templates...', 'ٹیمپلیٹ تلاش کریں...')}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="h-9 pl-8 text-xs"
                        />
                      </div>
                      <Button size="sm" onClick={() => setCreatingTemplate(true)} className="h-9 text-xs gap-1.5 shadow-sm">
                        <Plus className="h-4 w-4" />
                        <span>{t('Add Template', 'ٹیمپلیٹ شامل کریں')}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-12 text-center text-xs">#</TableHead>
                          <TableHead className="text-xs">{t('Template Title', 'عنوان')}</TableHead>
                          <TableHead className="text-xs">{t('Category', 'شعبہ')}</TableHead>
                          <TableHead className="text-xs text-center">{t('Downloads', 'ڈاؤنلوڈز')}</TableHead>
                          <TableHead className="text-xs text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTemplates.map((tpl, i) => (
                          <TableRow key={tpl.id} className="hover:bg-muted/30">
                            <TableCell className="text-center text-xs text-muted-foreground">{i + 1}</TableCell>
                            <TableCell>
                              <div className="font-semibold text-xs text-foreground">{tpl.title}</div>
                              {tpl.titleUrdu && (
                                <div className="text-[11px] text-muted-foreground font-urdu mt-0.5">
                                  {tpl.titleUrdu}
                                </div>
                              )}
                              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">/{tpl.slug}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px]">
                                {tpl.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-mono text-xs text-muted-foreground">
                              {tpl.downloads}
                            </TableCell>
                            <TableCell className="text-right pr-4 space-x-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                asChild
                                title="Open Template Builder"
                              >
                                <Link href={`/templates/${tpl.slug}`} target="_blank">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => deleteTemplate(tpl)}
                                title="Delete Template"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 6: ANALYTICS & LOGS */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">{t('Total Citizen Searches', 'شہریوں کی کل تلاشیں')}</CardDescription>
                    <CardTitle className="text-2xl font-extrabold text-foreground">{analytics.totalSearches}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[11px] text-muted-foreground">{t('Past 30 days active queries', 'گزشتہ 30 دن کی تلاشیں')}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">{t('Zero Result Searches', 'بغیر نتائج تلاشیں')}</CardDescription>
                    <CardTitle className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{analytics.zeroResultCount}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[11px] text-muted-foreground">
                      {analytics.zeroResultRate}% {t('of total inquiries', 'کل تلاشوں کا تناسب')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">{t('Database Health', 'ڈیٹابیس صحت')}</CardDescription>
                    <CardTitle className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6" />
                      <span>Operational</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[11px] text-muted-foreground">PostgreSQL Neon DB live</p>
                  </CardContent>
                </Card>
              </div>

              {/* Zero Result Search Terms Table */}
              <Card className="border-amber-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-5 w-5" />
                    {t('Missing Legal Topics (0 Results Found)', 'وہ الفاظ جن کے نتائج تلاش میں نہیں ملے')}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('These terms were searched by citizens but returned 0 results. Consider adding tags or new statutes for them.', 'ان الفاظ کو شہریوں نے تلاش کیا لیکن کوئی نتیجہ نہیں ملا۔ ان کے لیے ٹیگز یا قوانین شامل کریں۔')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-12 text-center text-xs">#</TableHead>
                          <TableHead className="text-xs">{t('Search Query', 'تلاش کا لفظ')}</TableHead>
                          <TableHead className="text-xs text-center">{t('Times Searched', 'تلاش کی تعداد')}</TableHead>
                          <TableHead className="text-xs text-right pr-4">{t('Suggested Action', 'تجویز کردہ اقدام')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.zeroResultQueries && analytics.zeroResultQueries.length > 0 ? (
                          analytics.zeroResultQueries.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-center text-xs text-muted-foreground">{i + 1}</TableCell>
                              <TableCell className="font-semibold text-xs text-foreground">{item.query}</TableCell>
                              <TableCell className="text-center font-mono text-xs text-amber-600 font-bold">
                                {item.count}
                              </TableCell>
                              <TableCell className="text-right pr-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-[11px] gap-1"
                                  onClick={() => {
                                    setActiveTab('laws')
                                    setCreatingLaw(true)
                                  }}
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>{t('Add Law for this', 'اس موضوع پر قانون شامل کریں')}</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-6 text-xs text-muted-foreground">
                              {t('No zero-result searches recorded! Everything requested has matched statutes.', 'کوئی غیر موجود تلاش نہیں ملی! تمام تلاشوں کے نتائج موجود ہیں۔')}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 7: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        {t('Registered Users & Roles', 'صارفین اور ان کے کردار')}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {users.length} {t('registered members with assigned roles', 'رجسٹرڈ صارفین')}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadAll} className="h-9 text-xs gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>{t('Refresh Users', 'صارفین ریفریش')}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-12 text-center text-xs">#</TableHead>
                          <TableHead className="text-xs">{t('User', 'صارف')}</TableHead>
                          <TableHead className="text-xs">{t('Email', 'ای میل')}</TableHead>
                          <TableHead className="text-xs">{t('Registered', 'رجسٹریشن تاریخ')}</TableHead>
                          <TableHead className="text-xs">{t('Current Role', 'موجودہ کردار')}</TableHead>
                          <TableHead className="text-xs text-right pr-4">{t('Modify Role', 'کردار تبدیل کریں')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user, idx) => (
                          <TableRow key={user.id} className="hover:bg-muted/30">
                            <TableCell className="text-center text-xs text-muted-foreground">{idx + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7 border border-border">
                                  <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-xs text-foreground">{user.name || 'Unnamed User'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-mono text-muted-foreground">{user.email}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={cn(
                                  'text-[10px] uppercase font-bold',
                                  user.role === 'admin' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30',
                                  user.role === 'editor' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30',
                                  user.role === 'reviewer' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
                                  user.role === 'user' && 'bg-muted text-muted-foreground'
                                )}
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-4">
                              <Select
                                value={user.role}
                                onValueChange={(val) => handleRoleChange(user.id, val)}
                              >
                                <SelectTrigger className="h-8 text-xs w-32 ml-auto">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User (Normal)</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                  <SelectItem value="reviewer">Reviewer</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL DIALOGS --- */}

      {/* Edit Law Dialog */}
      {editingLaw && (
        <LawEditDialog
          law={editingLaw}
          categories={categories}
          onClose={() => setEditingLaw(null)}
          onSaved={() => {
            setEditingLaw(null)
            loadAll()
          }}
        />
      )}

      {/* Create Law Dialog */}
      {creatingLaw && (
        <LawEditDialog
          categories={categories}
          onClose={() => setCreatingLaw(false)}
          onSaved={() => {
            setCreatingLaw(false)
            loadAll()
          }}
        />
      )}

      {/* Create Category Dialog */}
      {creatingCategory && (
        <CategoryCreateDialog
          onClose={() => setCreatingCategory(false)}
          onSaved={() => {
            setCreatingCategory(false)
            loadAll()
          }}
        />
      )}

      {/* Create Lawyer Dialog */}
      {creatingLawyer && (
        <LawyerCreateDialog
          categories={categories}
          onClose={() => setCreatingLawyer(false)}
          onSaved={() => {
            setCreatingLawyer(false)
            loadAll()
          }}
        />
      )}

      {/* Create Template Dialog */}
      {creatingTemplate && (
        <TemplateCreateDialog
          categories={categories}
          onClose={() => setCreatingTemplate(false)}
          onSaved={() => {
            setCreatingTemplate(false)
            loadAll()
          }}
        />
      )}
    </div>
  )
}

// -------------------------------------------------------------
// HELPER COMPONENTS & MODALS
// -------------------------------------------------------------

function ScaleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  onClick,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
  onClick?: () => void
}) {
  return (
    <Card
      className={cn(
        'transition-all duration-200 border-border/80 shadow-sm',
        onClick && 'cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-muted-foreground truncate">{label}</span>
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </div>
        <div className="text-2xl font-black tracking-tight text-foreground">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}

// --- LAW EDIT / CREATE DIALOG ---
function LawEditDialog({
  law,
  categories,
  onClose,
  onSaved,
}: {
  law?: Law
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}) {
  const { t } = useLanguage()
  const [form, setForm] = React.useState({
    title: law?.title ?? '',
    titleUrdu: law?.titleUrdu ?? '',
    slug: law?.slug ?? '',
    categoryId: law?.category?.id ?? (categories[0]?.id ?? ''),
    yearEnacted: law?.yearEnacted ?? new Date().getFullYear(),
    jurisdiction: law?.jurisdiction ?? 'federal',
    status: law?.status ?? 'active',
    summary: law?.summary ?? '',
    summaryUrdu: law?.summaryUrdu ?? '',
    promulgatingAuthority: law?.promulgatingAuthority ?? '',
    gazetteReference: law?.gazetteReference ?? '',
    tags: law?.applicabilityTags ? law.applicabilityTags.join(', ') : '',
  })
  const [saving, setSaving] = React.useState(false)

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.categoryId) {
      toast.error('Title, Slug and Category are required')
      return
    }

    setSaving(true)
    const payload = {
      ...form,
      yearEnacted: Number(form.yearEnacted),
      applicabilityTags: form.tags
        ? form.tags.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    }

    const url = law ? `/api/laws/${law.slug}` : '/api/laws'
    const method = law ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)
    if (res.ok) {
      toast.success(law ? t('Law updated successfully', 'قانون کامیابی سے اپڈیٹ ہوا') : t('Law created successfully', 'نیا قانون کامیابی سے شامل ہوا'))
      onSaved()
    } else {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error || 'Failed to save law')
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {law ? t('Edit Law', 'قانون میں ترمیم') : t('Create New Law', 'نیا قانون شامل کریں')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('Fill in statute specifications, English & Urdu translations, and applicability tags.', 'قانونی متن، اردو ترجمہ اور ضروری تفصیلات درج کریں۔')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('Title (English) *', 'عنوان (انگریزی) *')}</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Contract Act 1872"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-urdu">{t('Title (Urdu)', 'عنوان (اردو)')}</Label>
              <Input
                value={form.titleUrdu}
                onChange={(e) => setForm({ ...form, titleUrdu: e.target.value })}
                placeholder="مثلاً قانونِ معاہدہ 1872"
                className="text-xs font-urdu"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('Slug (URL identifier) *', 'سلگ (URL) *')}</Label>
              <Input
                value={form.slug}
                disabled={!!law}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="contract-act-1872"
                className="text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('Category *', 'شعبہ / قسم *')}</Label>
              <Select
                value={form.categoryId}
                onValueChange={(val) => setForm({ ...form, categoryId: val })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.name} ({c.nameUrdu})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('Year Enacted', 'سال نفاذ')}</Label>
              <Input
                type="number"
                value={form.yearEnacted}
                onChange={(e) => setForm({ ...form, yearEnacted: Number(e.target.value) })}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('Jurisdiction', 'دائرہ اختیار')}</Label>
              <Select
                value={form.jurisdiction}
                onValueChange={(val) => setForm({ ...form, jurisdiction: val })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
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
            <div className="space-y-1.5">
              <Label className="text-xs">{t('Status', 'حیثیت')}</Label>
              <Select
                value={form.status}
                onValueChange={(val) => setForm({ ...form, status: val })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="repealed">Repealed</SelectItem>
                  <SelectItem value="amended">Amended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t('Promulgating Authority', 'مجاز اتھارٹی')}</Label>
            <Input
              value={form.promulgatingAuthority}
              onChange={(e) => setForm({ ...form, promulgatingAuthority: e.target.value })}
              placeholder="e.g. Parliament of Pakistan, Ministry of Law"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t('Summary (English)', 'خلاصہ (انگریزی)')}</Label>
            <Textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={3}
              placeholder="Brief statutory summary..."
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-urdu">{t('Summary (Urdu)', 'خلاصہ (اردو)')}</Label>
            <Textarea
              value={form.summaryUrdu}
              onChange={(e) => setForm({ ...form, summaryUrdu: e.target.value })}
              rows={3}
              placeholder="قانون کا اردو میں مختصر خلاصہ..."
              className="text-xs font-urdu"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t('Applicability Tags (comma-separated)', 'ٹیگز (کوما سے الگ)')}</Label>
            <Input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="contract, business, agreement, damages"
              className="text-xs"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            {t('Cancel', 'منسوخ')}
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? t('Saving...', 'محفوظ ہو رہا ہے...') : t('Save Law', 'قانون محفوظ کریں')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- CATEGORY CREATE DIALOG ---
function CategoryCreateDialog({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const { t } = useLanguage()
  const [form, setForm] = React.useState({
    name: '',
    nameUrdu: '',
    slug: '',
    color: '#0d9488',
    description: '',
    descriptionUrdu: '',
  })
  const [saving, setSaving] = React.useState(false)

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Name and Slug are required')
      return
    }

    setSaving(true)
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSaving(false)
    if (res.ok) {
      toast.success(t('Category created successfully', 'نئی قسم کامیابی سے شامل ہو گئی'))
      onSaved()
    } else {
      toast.error('Failed to create category')
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5 text-primary" />
            {t('Create New Category', 'نئی قسم شامل کریں')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('Add a legal category or branch of law to organize statutes.', 'قوانین کی تقسیم کے لیے نیا شعبہ شامل کریں۔')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label className="text-xs">{t('Category Name (English) *', 'نام (انگریزی) *')}</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Constitutional Law"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-urdu">{t('Category Name (Urdu) *', 'نام (اردو) *')}</Label>
            <Input
              value={form.nameUrdu}
              onChange={(e) => setForm({ ...form, nameUrdu: e.target.value })}
              placeholder="مثلاً آئینی قانون"
              className="text-xs font-urdu"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t('Slug *', 'سلگ *')}</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="constitutional-law"
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t('Theme Color Hex', 'رنگ کوڈ')}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="h-8 w-12 rounded cursor-pointer border border-border"
              />
              <Input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="text-xs font-mono flex-1"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t('Description', 'تفصیل')}</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="text-xs"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            {t('Cancel', 'منسوخ')}
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? t('Creating...', 'شامل ہو رہا ہے...') : t('Create Category', 'قسم شامل کریں')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- LAWYER CREATE DIALOG ---
function LawyerCreateDialog({
  categories,
  onClose,
  onSaved,
}: {
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}) {
  const { t } = useLanguage()
  const [form, setForm] = React.useState({
    name: '',
    nameUrdu: '',
    slug: '',
    city: 'Lahore',
    province: 'Punjab',
    specialization: [] as string[],
    email: '',
    phone: '',
    licenseNumber: '',
    experienceYears: 5,
    bio: '',
    bioUrdu: '',
    verified: true,
    featured: false,
  })
  const [saving, setSaving] = React.useState(false)

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Name and Slug are required')
      return
    }

    setSaving(true)
    const res = await fetch('/api/admin/lawyers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSaving(false)
    if (res.ok) {
      toast.success(t('Lawyer profile created successfully', 'وکیل کا پروفائل کامیابی سے بن گیا'))
      onSaved()
    } else {
      toast.error('Failed to create lawyer')
    }
  }

  const toggleSpecialization = (slug: string) => {
    setForm((f) => ({
      ...f,
      specialization: f.specialization.includes(slug)
        ? f.specialization.filter((s) => s !== slug)
        : [...f.specialization, slug],
    }))
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-teal-600" />
            {t('Add Lawyer / Legal Counsel', 'وکیل شامل کریں')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('Register an advocate into the public verified directory.', 'تصدیق شدہ وکیل کا اندراج کریں۔')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">{t('Name (English) *', 'نام (انگریزی) *')}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Advocate Ali Khan"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-urdu">{t('Name (Urdu)', 'نام (اردو)')}</Label>
              <Input
                value={form.nameUrdu}
                onChange={(e) => setForm({ ...form, nameUrdu: e.target.value })}
                placeholder="ایڈووکیٹ علی خان"
                className="text-xs font-urdu"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">{t('Slug *', 'سلگ *')}</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="ali-khan-advocate"
                className="text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('City', 'شہر')}</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">{t('Email', 'ای میل')}</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="lawyer@example.com"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('Phone', 'فون')}</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t('Specializations', 'خصوصی شعبہ جات')}</Label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 border rounded-md bg-muted/20">
              {categories.map((c) => {
                const selected = form.specialization.includes(c.slug)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleSpecialization(c.slug)}
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full border transition-all',
                      selected
                        ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                        : 'bg-background text-muted-foreground border-border hover:border-teal-500'
                    )}
                  >
                    {c.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                className="rounded text-primary focus:ring-primary h-4 w-4"
              />
              <span>{t('Mark as Verified', 'تصدیق شدہ نشان زد کریں')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded text-primary focus:ring-primary h-4 w-4"
              />
              <span>{t('Mark as Featured', 'نمایاں نشان زد کریں')}</span>
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            {t('Cancel', 'منسوخ')}
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? t('Saving...', 'محفوظ ہو رہا ہے...') : t('Save Lawyer', 'وکیل محفوظ کریں')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- TEMPLATE CREATE DIALOG ---
function TemplateCreateDialog({
  categories,
  onClose,
  onSaved,
}: {
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}) {
  const { t } = useLanguage()
  const [form, setForm] = React.useState({
    title: '',
    titleUrdu: '',
    slug: '',
    category: categories[0]?.slug ?? 'corporate-commercial',
    description: '',
    templateText: 'LEGAL AGREEMENT\n\nThis agreement is made between {{party_a}} and {{party_b}} on {{date}}.',
    fieldsJson: JSON.stringify([
      { key: 'party_a', label: 'First Party Name', type: 'text', required: true },
      { key: 'party_b', label: 'Second Party Name', type: 'text', required: true },
      { key: 'date', label: 'Agreement Date', type: 'date', required: true },
    ], null, 2),
  })
  const [saving, setSaving] = React.useState(false)

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Title and Slug are required')
      return
    }

    setSaving(true)
    const res = await fetch('/api/admin/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSaving(false)
    if (res.ok) {
      toast.success(t('Template created successfully', 'ٹیمپلیٹ کامیابی سے بن گیا'))
      onSaved()
    } else {
      toast.error('Failed to create template')
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePlus className="h-5 w-5 text-pink-600" />
            {t('Create Legal Template', 'نیا ٹیمپلیٹ بنائیں')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('Define contract draft text with placeholders like {{party_name}}.', 'ٹیمپلیٹ کا متن اور فیلڈز درج کریں۔')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">{t('Title (English) *', 'عنوان (انگریزی) *')}</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Rent Agreement"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-urdu">{t('Title (Urdu)', 'عنوان (اردو)')}</Label>
              <Input
                value={form.titleUrdu}
                onChange={(e) => setForm({ ...form, titleUrdu: e.target.value })}
                placeholder="مثلاً کرایہ نامہ"
                className="text-xs font-urdu"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">{t('Slug *', 'سلگ *')}</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="rent-agreement-format"
                className="text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('Category', 'شعبہ')}</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm({ ...form, category: val })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug} className="text-xs">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t('Template Body (use {{field}})', 'ٹیمپلیٹ کا متن')}</Label>
            <Textarea
              value={form.templateText}
              onChange={(e) => setForm({ ...form, templateText: e.target.value })}
              rows={4}
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t('Fields Schema (JSON Array)', 'فیلڈز کی اسکیما')}</Label>
            <Textarea
              value={form.fieldsJson}
              onChange={(e) => setForm({ ...form, fieldsJson: e.target.value })}
              rows={4}
              className="text-xs font-mono"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            {t('Cancel', 'منسوخ')}
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? t('Creating...', 'شامل ہو رہا ہے...') : t('Save Template', 'ٹیمپلیٹ محفوظ کریں')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
