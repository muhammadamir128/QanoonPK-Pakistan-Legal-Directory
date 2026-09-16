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
  UserCheck, Settings, Lock, Sparkles, Filter, Check, Mail, Compass,
  Layers, MessageSquare, Copy, FileSpreadsheet, Server, HardDrive, Shield, Sliders,
  HelpCircle, CheckCircle, Clock,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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

type Subscriber = {
  id: string
  email: string
  name: string | null
  active: boolean
  preferences?: string | null
  createdAt: string
}

type Review = {
  id: string
  lawyerId: string
  authorName: string
  rating: number
  comment: string | null
  createdAt: string
  lawyer: {
    id: string
    name: string
    nameUrdu: string | null
    slug: string
    city: string
    rating: number
    reviewCount: number
  }
}

type FinderQuestionOption = {
  id: string
  label: string
  labelUrdu?: string
  nextQuestionId?: string
  categoryIds?: string[]
}

type FinderQuestionItem = {
  id: string
  question: string
  questionUrdu: string | null
  orderIndex: number
  options: FinderQuestionOption[]
}

type LawSection = {
  id: string
  lawId: string
  sectionNumber: string
  title: string | null
  content: string
  contentUrdu: string | null
  orderIndex: number
}

type LawAmendment = {
  id: string
  lawId: string
  amendmentYear: number
  amendmentTitle: string
  gazetteReference: string | null
  description: string | null
  effectiveDate: string | null
}

type AdminTab = 'overview' | 'laws' | 'categories' | 'lawyers' | 'templates' | 'analytics' | 'users' | 'subscribers' | 'reviews' | 'finder' | 'settings'
const VALID_TABS: AdminTab[] = ['overview', 'laws', 'categories', 'lawyers', 'templates', 'analytics', 'users', 'subscribers', 'reviews', 'finder', 'settings']

export default function AdminPage() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const { t, lang, setLang } = useLanguage()
  const router = useRouter()

  const [activeTab, setActiveTab] = React.useState<AdminTab>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Synchronize active tab with URL (?tab=...) and localStorage
  const handleTabChange = React.useCallback((tab: AdminTab) => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('qpk-admin-tab', tab)
        const url = new URL(window.location.href)
        if (tab === 'overview') {
          url.searchParams.delete('tab')
        } else {
          url.searchParams.set('tab', tab)
        }
        window.history.pushState(null, '', url.toString())
      } catch {}
    }
  }, [])

  // Restore tab on initial mount & listen to browser back/forward (popstate)
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const getInitialTab = (): AdminTab => {
      try {
        const paramTab = new URLSearchParams(window.location.search).get('tab') as AdminTab | null
        if (paramTab && VALID_TABS.includes(paramTab)) {
          localStorage.setItem('qpk-admin-tab', paramTab)
          return paramTab
        }
        const savedTab = localStorage.getItem('qpk-admin-tab') as AdminTab | null
        if (savedTab && VALID_TABS.includes(savedTab)) {
          const url = new URL(window.location.href)
          if (savedTab !== 'overview') {
            url.searchParams.set('tab', savedTab)
            window.history.replaceState(null, '', url.toString())
          }
          return savedTab
        }
      } catch {}
      return 'overview'
    }

    const initial = getInitialTab()
    setActiveTab(initial)

    const onPopState = () => {
      try {
        const currentParam = new URLSearchParams(window.location.search).get('tab') as AdminTab | null
        if (currentParam && VALID_TABS.includes(currentParam)) {
          setActiveTab(currentParam)
          localStorage.setItem('qpk-admin-tab', currentParam)
        } else {
          setActiveTab('overview')
          localStorage.setItem('qpk-admin-tab', 'overview')
        }
      } catch {}
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Data states
  const [laws, setLaws] = React.useState<Law[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [lawyers, setLawyers] = React.useState<Lawyer[]>([])
  const [templates, setTemplates] = React.useState<Template[]>([])
  const [users, setUsers] = React.useState<ManagedUser[]>([])
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>([])
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [finderQuestions, setFinderQuestions] = React.useState<FinderQuestionItem[]>([])
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState<{
    lawCount: number
    categoryCount: number
    sectionCount: number
    amendmentCount: number
    lawyerCount?: number
    templateCount?: number
    subscriberCount?: number
    reviewCount?: number
    questionCount?: number
  } | null>(null)

  // Filters & Search
  const [search, setSearch] = React.useState('')
  const [selectedJurisdiction, setSelectedJurisdiction] = React.useState<string>('all')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [subscriberFilter, setSubscriberFilter] = React.useState<'all' | 'active' | 'inactive'>('all')
  const [subscriberSearch, setSubscriberSearch] = React.useState('')
  const [reviewSearch, setReviewSearch] = React.useState('')
  const [reviewRatingFilter, setReviewRatingFilter] = React.useState<string>('all')

  // Modals
  const [editingLaw, setEditingLaw] = React.useState<Law | null>(null)
  const [creatingLaw, setCreatingLaw] = React.useState(false)
  const [creatingLawyer, setCreatingLawyer] = React.useState(false)
  const [creatingCategory, setCreatingCategory] = React.useState(false)
  const [creatingTemplate, setCreatingTemplate] = React.useState(false)
  const [creatingSubscriber, setCreatingSubscriber] = React.useState(false)
  const [creatingFinderQuestion, setCreatingFinderQuestion] = React.useState(false)
  const [editingFinderQuestion, setEditingFinderQuestion] = React.useState<FinderQuestionItem | null>(null)
  const [managingLawSections, setManagingLawSections] = React.useState<Law | null>(null)

  // Pagination states (20 items per page)
  const LAWS_PER_PAGE = 20
  const [lawsPage, setLawsPage] = React.useState(1)

  const CATEGORIES_PER_PAGE = 20
  const [categoriesPage, setCategoriesPage] = React.useState(1)

  const LAWYERS_PER_PAGE = 20
  const [lawyersPage, setLawyersPage] = React.useState(1)

  const SUBSCRIBERS_PER_PAGE = 20
  const [subscribersPage, setSubscribersPage] = React.useState(1)

  const REVIEWS_PER_PAGE = 20
  const [reviewsPage, setReviewsPage] = React.useState(1)

  // Reset page when filters change
  React.useEffect(() => {
    setLawsPage(1)
  }, [search, selectedJurisdiction, selectedCategory])

  React.useEffect(() => {
    setLawyersPage(1)
  }, [search])

  React.useEffect(() => {
    setSubscribersPage(1)
  }, [subscriberSearch, subscriberFilter])

  React.useEffect(() => {
    setReviewsPage(1)
  }, [reviewSearch, reviewRatingFilter])

  const loadAll = React.useCallback(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/laws?limit=500').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/lawyers?limit=500').then((r) => r.json()),
      fetch('/api/templates?limit=500').then((r) => r.json()),
      fetch('/api/analytics').then((r) => r.json()),
      fetch('/api/admin/users').then((r) => (r.ok ? r.json() : { ok: false, users: [] })),
      fetch('/api/admin/subscribers').then((r) => (r.ok ? r.json() : { subscribers: [] })),
      fetch('/api/admin/reviews').then((r) => (r.ok ? r.json() : { reviews: [] })),
      fetch('/api/admin/finder').then((r) => (r.ok ? r.json() : { questions: [] })),
    ])
      .then(([lawsData, catsData, s, lawyersData, templatesData, a, usersData, subsData, revsData, finderData]) => {
        setLaws(lawsData.items ?? [])
        setCategories(catsData.items ?? [])
        setLawyers(lawyersData.items ?? [])
        setTemplates(templatesData.items ?? [])
        setAnalytics(a)
        if (usersData.ok && usersData.users) {
          setUsers(usersData.users)
        }
        if (subsData?.subscribers) {
          setSubscribers(subsData.subscribers)
        }
        if (revsData?.reviews) {
          setReviews(revsData.reviews)
        }
        if (finderData?.questions) {
          setFinderQuestions(finderData.questions)
        }
        setStats({
          lawCount: s.lawCount ?? 0,
          categoryCount: s.categoryCount ?? 0,
          sectionCount: s.sectionCount ?? 0,
          amendmentCount: s.amendmentCount ?? 0,
          lawyerCount: s.lawyerCount ?? 0,
          templateCount: s.templateCount ?? 0,
          subscriberCount: subsData?.subscribers?.length ?? 0,
          reviewCount: revsData?.reviews?.length ?? 0,
          questionCount: finderData?.questions?.length ?? 0,
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

  // --- Subscriber Handlers ---
  const toggleSubscriber = async (sub: Subscriber) => {
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sub.id, active: !sub.active }),
      })
      const d = await res.json()
      if (d.ok) {
        toast.success(t(sub.active ? 'Subscriber deactivated' : 'Subscriber activated', 'سبسکرائبر کی حیثیت تبدیل ہو گئی'))
        setSubscribers((prev) => prev.map((s) => (s.id === sub.id ? { ...s, active: !s.active } : s)))
      } else {
        toast.error(d.error || 'Failed to update')
      }
    } catch {
      toast.error('Failed to update subscriber')
    }
  }

  const deleteSubscriber = async (sub: Subscriber) => {
    if (!confirm(`${t('Delete subscriber', 'حذف کریں')} "${sub.email}"?`)) return
    try {
      const res = await fetch(`/api/admin/subscribers?id=${sub.id}`, { method: 'DELETE' })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Subscriber deleted', 'سبسکرائبر حذف ہو گیا'))
        setSubscribers((prev) => prev.filter((s) => s.id !== sub.id))
      } else {
        toast.error(d.error || 'Failed to delete')
      }
    } catch {
      toast.error('Failed to delete subscriber')
    }
  }

  const copySubscribersEmails = () => {
    const activeEmails = subscribers.filter((s) => s.active).map((s) => s.email).join(', ')
    if (!activeEmails) {
      toast.info(t('No active subscribers to copy', 'کوئی فعال ای میل موجود نہیں'))
      return
    }
    navigator.clipboard.writeText(activeEmails)
    toast.success(t('Copied all active emails to clipboard!', 'تمام فعال ای میلز کاپی کر لی گئیں!'))
  }

  // --- Review Handlers ---
  const deleteReview = async (review: Review) => {
    if (!confirm(t('Delete this lawyer review?', 'کیا آپ یہ جائزہ حذف کرنا چاہتے ہیں؟'))) return
    try {
      const res = await fetch(`/api/admin/reviews?id=${review.id}`, { method: 'DELETE' })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Review deleted', 'جائزہ حذف ہو گیا'))
        setReviews((prev) => prev.filter((r) => r.id !== review.id))
      } else {
        toast.error(d.error || 'Failed to delete review')
      }
    } catch {
      toast.error('Failed to delete review')
    }
  }

  // --- Finder Question Handlers ---
  const deleteFinderQuestion = async (q: FinderQuestionItem) => {
    if (!confirm(`${t('Delete question', 'سوال حذف کریں')} "${q.question}"?`)) return
    try {
      const res = await fetch(`/api/admin/finder?id=${q.id}`, { method: 'DELETE' })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Question deleted', 'سوال حذف ہو گیا'))
        setFinderQuestions((prev) => prev.filter((item) => item.id !== q.id))
      } else {
        toast.error(d.error || 'Failed to delete')
      }
    } catch {
      toast.error('Failed to delete question')
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

  // --- PAGINATED ITEMS (20 per page) ---
  const totalLawsPages = Math.max(1, Math.ceil(filteredLaws.length / LAWS_PER_PAGE))
  const paginatedLaws = filteredLaws.slice((lawsPage - 1) * LAWS_PER_PAGE, lawsPage * LAWS_PER_PAGE)

  const totalCategoriesPages = Math.max(1, Math.ceil(categories.length / CATEGORIES_PER_PAGE))
  const paginatedCategories = categories.slice((categoriesPage - 1) * CATEGORIES_PER_PAGE, categoriesPage * CATEGORIES_PER_PAGE)

  const totalLawyersPages = Math.max(1, Math.ceil(filteredLawyers.length / LAWYERS_PER_PAGE))
  const paginatedLawyers = filteredLawyers.slice((lawyersPage - 1) * LAWYERS_PER_PAGE, lawyersPage * LAWYERS_PER_PAGE)

  // --- FILTERED SUBSCRIBERS ---
  const filteredSubscribers = subscribers.filter((sub) => {
    if (subscriberFilter === 'active' && !sub.active) return false
    if (subscriberFilter === 'inactive' && sub.active) return false
    if (!subscriberSearch) return true
    const q = subscriberSearch.toLowerCase()
    return sub.email.toLowerCase().includes(q) || (sub.name ?? '').toLowerCase().includes(q)
  })
  const totalSubscribersPages = Math.max(1, Math.ceil(filteredSubscribers.length / SUBSCRIBERS_PER_PAGE))
  const paginatedSubscribers = filteredSubscribers.slice((subscribersPage - 1) * SUBSCRIBERS_PER_PAGE, subscribersPage * SUBSCRIBERS_PER_PAGE)

  // --- FILTERED REVIEWS ---
  const filteredReviews = reviews.filter((rev) => {
    if (reviewRatingFilter !== 'all' && rev.rating !== parseInt(reviewRatingFilter)) return false
    if (!reviewSearch) return true
    const q = reviewSearch.toLowerCase()
    return (
      rev.authorName.toLowerCase().includes(q) ||
      (rev.comment ?? '').toLowerCase().includes(q) ||
      (rev.lawyer?.name ?? '').toLowerCase().includes(q)
    )
  })
  const totalReviewsPages = Math.max(1, Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE))
  const paginatedReviews = filteredReviews.slice((reviewsPage - 1) * REVIEWS_PER_PAGE, reviewsPage * REVIEWS_PER_PAGE)

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
    {
      id: 'subscribers',
      labelEn: 'Subscribers',
      labelUr: 'سبسکرائبرز',
      icon: Mail,
      badge: subscribers.length || null,
    },
    {
      id: 'reviews',
      labelEn: 'Lawyer Reviews',
      labelUr: 'وکلاء کے جائزے',
      icon: Star,
      badge: reviews.length || null,
    },
    {
      id: 'finder',
      labelEn: 'Legal Finder',
      labelUr: 'رہنمائی سوالات',
      icon: Compass,
      badge: finderQuestions.length || null,
    },
    {
      id: 'settings',
      labelEn: 'Settings & Tools',
      labelUr: 'ترتیبات و اوزار',
      icon: Settings,
      badge: null,
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
                handleTabChange(item.id as AdminTab)
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

            {activeTab === 'subscribers' && (
              <Button size="sm" onClick={() => setCreatingSubscriber(true)} className="h-8 text-xs gap-1.5 shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                <span>{t('Add Subscriber', 'سبسکرائبر شامل کریں')}</span>
              </Button>
            )}

            {activeTab === 'finder' && (
              <Button size="sm" onClick={() => setCreatingFinderQuestion(true)} className="h-8 text-xs gap-1.5 shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                <span>{t('Add Question', 'سوال شامل کریں')}</span>
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
        <main className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200 w-full">
              {/* Welcome Header */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-background border border-primary/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-bold">
                      {t('System Live', 'سسٹم متحرک')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">SQLite / Local DB</span>
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
                  <Button size="sm" onClick={() => handleTabChange('laws')} className="h-9 gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>{t('Manage Laws', 'قوانین کا انتظام')}</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTabChange('analytics')} className="h-9 gap-1.5">
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
                    onClick={() => handleTabChange('laws')}
                  />
                  <StatCard
                    icon={Tags}
                    label={t('Categories', 'اقسام')}
                    value={stats.categoryCount}
                    color="#9333ea"
                    onClick={() => handleTabChange('categories')}
                  />
                  <StatCard
                    icon={Briefcase}
                    label={t('Lawyers', 'وکلاء')}
                    value={stats.lawyerCount ?? 0}
                    color="#0d9488"
                    onClick={() => handleTabChange('lawyers')}
                  />
                  <StatCard
                    icon={FilePlus}
                    label={t('Templates', 'ٹیمپلیٹس')}
                    value={stats.templateCount ?? 0}
                    color="#db2777"
                    onClick={() => handleTabChange('templates')}
                  />
                  <StatCard
                    icon={Users}
                    label={t('Users', 'صارفین')}
                    value={users.length}
                    color="#2563eb"
                    onClick={() => handleTabChange('users')}
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
                    <Button size="sm" variant="outline" onClick={() => handleTabChange('analytics')} className="h-8 text-xs">
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
                    <Button variant="ghost" size="sm" onClick={() => handleTabChange('laws')} className="h-8 text-xs gap-1">
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
                    <Button variant="ghost" size="sm" onClick={() => handleTabChange('analytics')} className="h-8 text-xs gap-1">
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
                        {filteredLaws.length} {t('laws listed', 'قوانین درج ہیں')}
                        {filteredLaws.length > LAWS_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${lawsPage} / ${totalLawsPages}`}
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

                      <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5">
                        <a href="/api/admin/export?type=laws" download>
                          <Download className="h-3.5 w-3.5" />
                          <span>{t('Export CSV', 'ایکسپورٹ CSV')}</span>
                        </a>
                      </Button>

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
                          {paginatedLaws.map((law, index) => {
                            const serialNumber = (lawsPage - 1) * LAWS_PER_PAGE + index + 1
                            return (
                              <TableRow key={law.id} className="hover:bg-muted/30">
                                <TableCell className="text-center text-xs text-muted-foreground">{serialNumber}</TableCell>
                                <TableCell className="max-w-md">
                                  <div className="font-semibold text-xs text-foreground line-clamp-1">
                                    {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                                  </div>
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
                                    className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                                    onClick={() => setManagingLawSections(law)}
                                    title={t('Manage Sections & Amendments', 'دفعات اور ترامیم کا انتظام')}
                                  >
                                    <Layers className="h-3.5 w-3.5" />
                                  </Button>
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
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Laws Pagination Controls (20 per page) */}
                  {!loading && filteredLaws.length > LAWS_PER_PAGE && (
                    <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                      <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                        {t(
                          `Showing ${(lawsPage - 1) * LAWS_PER_PAGE + 1} to ${Math.min(lawsPage * LAWS_PER_PAGE, filteredLaws.length)} of ${filteredLaws.length} laws`,
                          `${filteredLaws.length} میں سے ${(lawsPage - 1) * LAWS_PER_PAGE + 1} تا ${Math.min(lawsPage * LAWS_PER_PAGE, filteredLaws.length)} قوانین`
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLawsPage((p) => Math.max(1, p - 1))}
                          disabled={lawsPage === 1}
                          className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                        >
                          <ChevronLeft className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                          <span>{t('Previous', 'پچھلا')}</span>
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(7, totalLawsPages) }).map((_, idx) => {
                            let pNum: number
                            if (totalLawsPages <= 7) {
                              pNum = idx + 1
                            } else if (lawsPage <= 4) {
                              pNum = idx + 1
                            } else if (lawsPage >= totalLawsPages - 3) {
                              pNum = totalLawsPages - 6 + idx
                            } else {
                              pNum = lawsPage - 3 + idx
                            }
                            const isActive = pNum === lawsPage
                            return (
                              <Button
                                key={pNum}
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setLawsPage(pNum)}
                                className={cn(
                                  'h-8 w-8 p-0 text-xs tabular-nums cursor-pointer',
                                  isActive && 'font-bold shadow-sm'
                                )}
                              >
                                {pNum}
                              </Button>
                            )
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLawsPage((p) => Math.min(totalLawsPages, p + 1))}
                          disabled={lawsPage === totalLawsPages}
                          className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                        >
                          <span>{t('Next', 'اگلا')}</span>
                          <ChevronRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                        </Button>
                      </div>
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
                    {categories.length > CATEGORIES_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${categoriesPage} / ${totalCategoriesPages}`}
                  </p>
                </div>
                <Button size="sm" onClick={() => setCreatingCategory(true)} className="h-9 text-xs gap-1.5 shadow-sm">
                  <Plus className="h-4 w-4" />
                  <span>{t('Add Category', 'نئی قسم شامل کریں')}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {paginatedCategories.map((c) => (
                  <Card key={c.id} className="hover:border-primary/40 transition-all shadow-sm">
                    <CardContent className="p-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className="h-4 w-4 rounded-full shrink-0 mt-0.5"
                          style={{ backgroundColor: c.color ?? 'var(--primary)' }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">
                            {lang === 'ur' && c.nameUrdu ? c.nameUrdu : c.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">/{c.slug}</p>
                          {(lang === 'ur' ? (c.descriptionUrdu || c.description) : c.description) && (
                            <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2">
                              {lang === 'ur' ? (c.descriptionUrdu || c.description) : c.description}
                            </p>
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

              {/* Categories Pagination Controls (20 per page) */}
              {categories.length > CATEGORIES_PER_PAGE && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
                  <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                    {t(
                      `Showing ${(categoriesPage - 1) * CATEGORIES_PER_PAGE + 1} to ${Math.min(categoriesPage * CATEGORIES_PER_PAGE, categories.length)} of ${categories.length} categories`,
                      `${categories.length} میں سے ${(categoriesPage - 1) * CATEGORIES_PER_PAGE + 1} تا ${Math.min(categoriesPage * CATEGORIES_PER_PAGE, categories.length)} اقسام`
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCategoriesPage((p) => Math.max(1, p - 1))}
                      disabled={categoriesPage === 1}
                      className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                    >
                      <ChevronLeft className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                      <span>{t('Previous', 'پچھلا')}</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalCategoriesPages }, (_, idx) => {
                        const pNum = idx + 1
                        const isActive = pNum === categoriesPage
                        return (
                          <Button
                            key={pNum}
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoriesPage(pNum)}
                            className={cn(
                              'h-8 w-8 p-0 text-xs tabular-nums cursor-pointer',
                              isActive && 'font-bold shadow-sm'
                            )}
                          >
                            {pNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCategoriesPage((p) => Math.min(totalCategoriesPages, p + 1))}
                      disabled={categoriesPage === totalCategoriesPages}
                      className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                    >
                      <span>{t('Next', 'اگلا')}</span>
                      <ChevronRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                    </Button>
                  </div>
                </div>
              )}
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
                        {filteredLawyers.length > LAWYERS_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${lawyersPage} / ${totalLawyersPages}`}
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
                      <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5">
                        <a href="/api/admin/export?type=lawyers" download>
                          <Download className="h-3.5 w-3.5" />
                          <span>{t('Export CSV', 'ایکسپورٹ CSV')}</span>
                        </a>
                      </Button>
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
                        {paginatedLawyers.map((lawyer, idx) => {
                          const serialNumber = (lawyersPage - 1) * LAWYERS_PER_PAGE + idx + 1
                          return (
                            <TableRow key={lawyer.id} className="hover:bg-muted/30">
                              <TableCell className="text-center text-xs text-muted-foreground">{serialNumber}</TableCell>
                              <TableCell>
                                <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                                  {lang === 'ur' && lawyer.nameUrdu ? lawyer.nameUrdu : lawyer.name}
                                  {lawyer.verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                                </div>
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
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Lawyers Pagination Controls (20 per page) */}
                  {!loading && filteredLawyers.length > LAWYERS_PER_PAGE && (
                    <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                      <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                        {t(
                          `Showing ${(lawyersPage - 1) * LAWYERS_PER_PAGE + 1} to ${Math.min(lawyersPage * LAWYERS_PER_PAGE, filteredLawyers.length)} of ${filteredLawyers.length} lawyers`,
                          `${filteredLawyers.length} میں سے ${(lawyersPage - 1) * LAWYERS_PER_PAGE + 1} تا ${Math.min(lawyersPage * LAWYERS_PER_PAGE, filteredLawyers.length)} وکلاء`
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLawyersPage((p) => Math.max(1, p - 1))}
                          disabled={lawyersPage === 1}
                          className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                        >
                          <ChevronLeft className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                          <span>{t('Previous', 'پچھلا')}</span>
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalLawyersPages }, (_, idx) => {
                            const pNum = idx + 1
                            const isActive = pNum === lawyersPage
                            return (
                              <Button
                                key={pNum}
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setLawyersPage(pNum)}
                                className={cn(
                                  'h-8 w-8 p-0 text-xs tabular-nums cursor-pointer',
                                  isActive && 'font-bold shadow-sm'
                                )}
                              >
                                {pNum}
                              </Button>
                            )
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLawyersPage((p) => Math.min(totalLawyersPages, p + 1))}
                          disabled={lawyersPage === totalLawyersPages}
                          className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                        >
                          <span>{t('Next', 'اگلا')}</span>
                          <ChevronRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                        </Button>
                      </div>
                    </div>
                  )}
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
                              <div className="font-semibold text-xs text-foreground">
                                {lang === 'ur' && tpl.titleUrdu ? tpl.titleUrdu : tpl.title}
                              </div>
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
                                    handleTabChange('laws')
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
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5">
                        <a href="/api/admin/export?type=users" download>
                          <Download className="h-3.5 w-3.5" />
                          <span>{t('Export CSV', 'ایکسپورٹ CSV')}</span>
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={loadAll} className="h-9 text-xs gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>{t('Refresh Users', 'صارفین ریفریش')}</span>
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

          {/* TAB 8: SUBSCRIBERS MANAGEMENT */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 border-border/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t('Total Subscribers', 'کل سبسکرائبرز')}</p>
                      <p className="text-xl font-bold">{subscribers.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-border/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t('Active Subscribers', 'فعال سبسکرائبرز')}</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {subscribers.filter((s) => s.active).length}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-border/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t('Inactive / Unsubscribed', 'غیر فعال')}</p>
                      <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        {subscribers.filter((s) => !s.active).length}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Table Card */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Mail className="h-5 w-5 text-purple-600" />
                        {t('Newsletter Subscribers', 'نیوز لیٹر سبسکرائبرز')}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {filteredSubscribers.length} {t('registered email recipients', 'ای میل صارفین درج ہیں')}
                        {filteredSubscribers.length > SUBSCRIBERS_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${subscribersPage} / ${totalSubscribersPages}`}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative w-full sm:w-60">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder={t('Search by email or name...', 'ای میل یا نام سے تلاش کریں...')}
                          value={subscriberSearch}
                          onChange={(e) => setSubscriberSearch(e.target.value)}
                          className="h-9 pl-8 text-xs"
                        />
                      </div>

                      <Select value={subscriberFilter} onValueChange={(val: any) => setSubscriberFilter(val)}>
                        <SelectTrigger className="h-9 text-xs w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('All Status', 'تمام اسٹیٹس')}</SelectItem>
                          <SelectItem value="active">{t('Active Only', 'صرف فعال')}</SelectItem>
                          <SelectItem value="inactive">{t('Inactive Only', 'صرف غیر فعال')}</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="sm" onClick={copySubscribersEmails} className="h-9 text-xs gap-1.5">
                        <Copy className="h-3.5 w-3.5" />
                        <span>{t('Copy Emails', 'ای میلز کاپی')}</span>
                      </Button>

                      <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5">
                        <a href="/api/admin/export?type=subscribers" download>
                          <Download className="h-3.5 w-3.5" />
                          <span>{t('Export CSV', 'ایکسپورٹ CSV')}</span>
                        </a>
                      </Button>

                      <Button size="sm" onClick={() => setCreatingSubscriber(true)} className="h-9 text-xs gap-1.5 shadow-sm">
                        <Plus className="h-4 w-4" />
                        <span>{t('Add Subscriber', 'سبسکرائبر شامل کریں')}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredSubscribers.length === 0 ? (
                    <div className="p-10 text-center text-sm text-muted-foreground">
                      {t('No subscribers found', 'کوئی سبسکرائبر نہیں ملا')}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            <TableHead className="w-12 text-center text-xs">#</TableHead>
                            <TableHead className="text-xs">{t('Email Address', 'ای میل ایڈریس')}</TableHead>
                            <TableHead className="text-xs">{t('Subscriber Name', 'نام')}</TableHead>
                            <TableHead className="text-xs">{t('Joined Date', 'شمولیت تاریخ')}</TableHead>
                            <TableHead className="text-xs">{t('Status', 'حیثیت')}</TableHead>
                            <TableHead className="text-xs text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedSubscribers.map((sub, idx) => {
                            const serialNumber = (subscribersPage - 1) * SUBSCRIBERS_PER_PAGE + idx + 1
                            return (
                              <TableRow key={sub.id} className="hover:bg-muted/30">
                                <TableCell className="text-center text-xs text-muted-foreground">{serialNumber}</TableCell>
                                <TableCell className="text-xs font-mono font-medium text-foreground">{sub.email}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{sub.name || '—'}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {new Date(sub.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <button
                                    onClick={() => toggleSubscriber(sub)}
                                    title={t('Click to toggle status', 'اسٹیٹس تبدیل کرنے کے لیے کلک کریں')}
                                    className="cursor-pointer"
                                  >
                                    <Badge
                                      className={cn(
                                        'text-[10px] uppercase font-bold cursor-pointer transition-transform hover:scale-105',
                                        sub.active
                                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                          : 'bg-muted text-muted-foreground border border-border'
                                      )}
                                    >
                                      {sub.active ? t('Active', 'فعال') : t('Inactive', 'غیر فعال')}
                                    </Badge>
                                  </button>
                                </TableCell>
                                <TableCell className="text-right pr-4 space-x-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    onClick={() => deleteSubscriber(sub)}
                                    title={t('Delete subscriber', 'حذف کریں')}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Pagination */}
                  {filteredSubscribers.length > SUBSCRIBERS_PER_PAGE && (
                    <div className="p-4 border-t border-border/60 flex items-center justify-between gap-4 bg-muted/10">
                      <div className="text-xs text-muted-foreground">
                        {t(
                          `Showing ${(subscribersPage - 1) * SUBSCRIBERS_PER_PAGE + 1} to ${Math.min(subscribersPage * SUBSCRIBERS_PER_PAGE, filteredSubscribers.length)} of ${filteredSubscribers.length}`,
                          `${filteredSubscribers.length} میں سے ${(subscribersPage - 1) * SUBSCRIBERS_PER_PAGE + 1} تا ${Math.min(subscribersPage * SUBSCRIBERS_PER_PAGE, filteredSubscribers.length)}`
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubscribersPage((p) => Math.max(1, p - 1))}
                          disabled={subscribersPage === 1}
                          className="h-8 px-2.5 text-xs gap-1"
                        >
                          <ChevronLeft className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                          <span>{t('Previous', 'پچھلا')}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubscribersPage((p) => Math.min(totalSubscribersPages, p + 1))}
                          disabled={subscribersPage === totalSubscribersPages}
                          className="h-8 px-2.5 text-xs gap-1"
                        >
                          <span>{t('Next', 'اگلا')}</span>
                          <ChevronRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 9: LAWYER REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 border-border/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t('Total Reviews', 'کل جائزے')}</p>
                      <p className="text-xl font-bold">{reviews.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-border/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t('5-Star Feedback', '۵ ستارہ ریٹنگ')}</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {reviews.filter((r) => r.rating === 5).length}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-border/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{t('Average Directory Rating', 'اوسط ریٹنگ')}</p>
                      <p className="text-xl font-bold">
                        {reviews.length > 0
                          ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                          : '0.0'}{' '}
                        ⭐
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500" />
                        {t('Lawyer Reviews Moderation', 'وکلاء کے جائزوں کی نگرانی')}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {filteredReviews.length} {t('client ratings and testimonials', 'کلائنٹس کی آراء و تاثرات')}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative w-full sm:w-60">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder={t('Search lawyer, author, or comment...', 'وکیل یا تبصرہ تلاش کریں...')}
                          value={reviewSearch}
                          onChange={(e) => setReviewSearch(e.target.value)}
                          className="h-9 pl-8 text-xs"
                        />
                      </div>

                      <Select value={reviewRatingFilter} onValueChange={setReviewRatingFilter}>
                        <SelectTrigger className="h-9 text-xs w-36">
                          <SelectValue placeholder={t('Filter Rating', 'ریٹنگ فلٹر')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('All Ratings', 'تمام ریٹنگز')}</SelectItem>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                          <SelectItem value="2">⭐⭐ (2)</SelectItem>
                          <SelectItem value="1">⭐ (1)</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="sm" onClick={loadAll} className="h-9 text-xs gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>{t('Refresh', 'ریفریش')}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredReviews.length === 0 ? (
                    <div className="p-10 text-center text-sm text-muted-foreground">
                      {t('No reviews found matching criteria', 'کوئی جائزہ نہیں ملا')}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40">
                            <TableHead className="w-12 text-center text-xs">#</TableHead>
                            <TableHead className="text-xs">{t('Lawyer', 'وکیل')}</TableHead>
                            <TableHead className="text-xs">{t('Reviewer', 'تبصرہ نگار')}</TableHead>
                            <TableHead className="text-xs">{t('Rating', 'ریٹنگ')}</TableHead>
                            <TableHead className="text-xs max-w-sm">{t('Comment', 'تبصرہ')}</TableHead>
                            <TableHead className="text-xs">{t('Date', 'تاریخ')}</TableHead>
                            <TableHead className="text-xs text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedReviews.map((rev, idx) => {
                            const serialNumber = (reviewsPage - 1) * REVIEWS_PER_PAGE + idx + 1
                            return (
                              <TableRow key={rev.id} className="hover:bg-muted/30">
                                <TableCell className="text-center text-xs text-muted-foreground">{serialNumber}</TableCell>
                                <TableCell>
                                  {rev.lawyer ? (
                                    <Link
                                      href={`/lawyers/${rev.lawyer.slug}`}
                                      target="_blank"
                                      className="font-semibold text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                      <span>{lang === 'ur' && rev.lawyer.nameUrdu ? rev.lawyer.nameUrdu : rev.lawyer.name}</span>
                                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                    </Link>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Unknown Lawyer</span>
                                  )}
                                  <div className="text-[10px] text-muted-foreground">{rev.lawyer?.city}</div>
                                </TableCell>
                                <TableCell className="text-xs font-medium text-foreground">{rev.authorName}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-amber-500">
                                    {Array.from({ length: rev.rating }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    ))}
                                    <span className="text-xs font-bold ml-1 text-foreground font-mono">{rev.rating}/5</span>
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-md text-xs text-foreground/90">
                                  {rev.comment ? (
                                    <p className="line-clamp-2 italic">"{rev.comment}"</p>
                                  ) : (
                                    <span className="text-muted-foreground italic">— No comment provided —</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(rev.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right pr-4">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    onClick={() => deleteReview(rev)}
                                    title={t('Delete review', 'جائزہ حذف کریں')}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {filteredReviews.length > REVIEWS_PER_PAGE && (
                    <div className="p-4 border-t border-border/60 flex items-center justify-between gap-4 bg-muted/10">
                      <div className="text-xs text-muted-foreground">
                        {t(
                          `Showing ${(reviewsPage - 1) * REVIEWS_PER_PAGE + 1} to ${Math.min(reviewsPage * REVIEWS_PER_PAGE, filteredReviews.length)} of ${filteredReviews.length}`,
                          `${filteredReviews.length} میں سے ${(reviewsPage - 1) * REVIEWS_PER_PAGE + 1} تا ${Math.min(reviewsPage * REVIEWS_PER_PAGE, filteredReviews.length)}`
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewsPage((p) => Math.max(1, p - 1))}
                          disabled={reviewsPage === 1}
                          className="h-8 px-2.5 text-xs gap-1"
                        >
                          <ChevronLeft className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                          <span>{t('Previous', 'پچھلا')}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewsPage((p) => Math.min(totalReviewsPages, p + 1))}
                          disabled={reviewsPage === totalReviewsPages}
                          className="h-8 px-2.5 text-xs gap-1"
                        >
                          <span>{t('Next', 'اگلا')}</span>
                          <ChevronRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 10: LEGAL FINDER ("WHICH LAW APPLIES?") QUESTION EDITOR */}
          {activeTab === 'finder' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Compass className="h-5 w-5 text-indigo-600" />
                        {t('Legal Finder Decision Tree', 'قانونی رہنمائی سوالنامہ (Which Law Applies?)')}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {finderQuestions.length} {t('interactive questions guiding citizens to relevant statutes', 'رہنمائی سوالات درج ہیں')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5">
                        <Link href="/finder" target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>{t('Test Live Finder', 'لائیو ٹیسٹ کریں')}</span>
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setCreatingFinderQuestion(true)}
                        className="h-9 text-xs gap-1.5 shadow-sm"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{t('Add Question', 'نیا سوال شامل کریں')}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {finderQuestions.length === 0 ? (
                    <div className="p-12 text-center border rounded-xl border-dashed border-border/80">
                      <Compass className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-semibold">{t('No finder questions found', 'کوئی سوال موجود نہیں')}</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-4">
                        {t('Seed database or create your first question to guide users.', 'ڈیٹابیس سید کریں یا نیا سوال بنائیں۔')}
                      </p>
                      <Button size="sm" onClick={() => setCreatingFinderQuestion(true)} className="text-xs gap-1">
                        <Plus className="h-3.5 w-3.5" />
                        <span>{t('Create Question', 'سوال بنائیں')}</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {finderQuestions.map((q, idx) => (
                        <Card key={q.id} className="p-4 border-border/80 flex flex-col justify-between hover:border-primary/40 transition-colors">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] font-mono">
                                  #{q.orderIndex ?? idx + 1}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground font-mono">ID: {q.id}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-primary hover:bg-primary/10"
                                  onClick={() => setEditingFinderQuestion(q)}
                                  title={t('Edit Question', 'ترمیم کریں')}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                  onClick={() => deleteFinderQuestion(q)}
                                  title={t('Delete Question', 'حذف کریں')}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-sm text-foreground">{q.question}</h4>
                              {q.questionUrdu && (
                                <p className="text-xs text-muted-foreground font-urdu mt-0.5" dir="rtl">
                                  {q.questionUrdu}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-border/60">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground">
                                {t('Answer Choices & Paths', 'جوابی اختیارات')}: ({q.options?.length || 0})
                              </p>
                              <div className="space-y-1">
                                {(q.options || []).map((opt, oIdx) => (
                                  <div
                                    key={opt.id || oIdx}
                                    className="p-2 rounded-lg bg-muted/50 border border-border/60 text-xs flex flex-col gap-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-foreground">{opt.label}</span>
                                      {opt.labelUrdu && (
                                        <span className="text-[10px] text-muted-foreground font-urdu" dir="rtl">
                                          {opt.labelUrdu}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                      {opt.nextQuestionId ? (
                                        <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                                          ➔ Next: {opt.nextQuestionId}
                                        </span>
                                      ) : (
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                          ➔ Result Endpoint
                                        </span>
                                      )}
                                      {opt.categoryIds && opt.categoryIds.length > 0 && (
                                        <span className="bg-primary/10 text-primary px-1.5 py-0.2 rounded text-[9px]">
                                          Categories: {opt.categoryIds.join(', ')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 11: SETTINGS, BACKUP & MAINTENANCE */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Diagnostics & Health Check */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    {t('System Diagnostics & Service Status', 'سسٹم معلومات و سروسز کی حالت')}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('Live infrastructure and integration health monitoring', 'لائیو انفراسٹرکچر و کنٹرول جائزہ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">{t('Database', 'ڈیٹابیس')}</span>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-sm font-bold text-foreground">SQLite (Prisma)</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> {t('Connected & Healthy', 'منسلک و فعال')}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">{t('Auth Engine', 'لاگ ان نظام')}</span>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-sm font-bold text-foreground">NextAuth.js</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> {t('JWT Sessions Active', 'سیشن فعال')}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">{t('AI RAG Assistant', 'اے آئی اسسٹنٹ')}</span>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-sm font-bold text-foreground">Qanoon RAG Engine</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> {t('Statute Retrieval Ready', 'تیار ہے')}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">{t('Search Engine', 'سرچ انجن')}</span>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-sm font-bold text-foreground">Bilingual Search</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> {t('Urdu & English Indexed', 'انڈیکس فعال')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Backup & Export Hub */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="h-5 w-5 text-indigo-600" />
                    {t('Data Export & Backup Center', 'ڈیٹا ایکسپورٹ و بیک اپ سینٹر')}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('Download one-click CSV spreadsheets and complete JSON database dumps', 'تمام ڈیٹا کی ڈاؤنلوڈ فائلز اور بیک اپ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-border/80 bg-muted/30 flex flex-col justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          {t('Laws Dataset (CSV)', 'قوانین کا ڈیٹا (CSV)')}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('All laws with titles, category, enactment years, and view counts.', 'تمام قوانین کی مکمل فہرست')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full text-xs gap-1.5">
                        <a href="/api/admin/export?type=laws" download>
                          <Download className="h-3.5 w-3.5" />
                          <span>{t('Download Laws CSV', 'ڈاؤنلوڈ CSV')}</span>
                        </a>
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-border/80 bg-muted/30 flex flex-col justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-teal-600" />
                          {t('Lawyers Directory (CSV)', 'وکلاء کی ڈائریکٹری (CSV)')}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('Verified advocates, contact details, cities, and ratings.', 'وکلاء کے رابطے اور شہر کی تفصیلات')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full text-xs gap-1.5">
                        <a href="/api/admin/export?type=lawyers" download>
                          <Download className="h-3.5 w-3.5" />
                          <span>{t('Download Lawyers CSV', 'ڈاؤنلوڈ CSV')}</span>
                        </a>
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-border/80 bg-muted/30 flex flex-col justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4 text-purple-600" />
                          {t('Subscribers List (CSV)', 'سبسکرائبرز لسٹ (CSV)')}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('Email addresses, subscription status, and join timestamps.', 'تمام نیوزلیٹر صارفین کی ای میلز')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full text-xs gap-1.5">
                        <a href="/api/admin/export?type=subscribers" download>
                          <Download className="h-3.5 w-3.5" />
                          <span>{t('Download Subscribers CSV', 'ڈاؤنلوڈ CSV')}</span>
                        </a>
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-border/80 bg-muted/30 flex flex-col justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          {t('Users & Roles (CSV)', 'صارفین کی فہرست (CSV)')}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('Platform accounts, assigned roles, and registration dates.', 'رجسٹرڈ ممبرز اور کردار')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full text-xs gap-1.5">
                        <a href="/api/admin/export?type=users" download>
                          <Download className="h-3.5 w-3.5" />
                          <span>{t('Download Users CSV', 'ڈاؤنلوڈ CSV')}</span>
                        </a>
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 sm:col-span-2 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary text-primary-foreground text-[10px]">FULL BACKUP</Badge>
                          <h4 className="font-bold text-sm text-foreground">{t('Complete Database Dump (JSON)', 'مکمل ڈیٹابیس بیک اپ (JSON)')}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t(
                            'Snapshot containing all categories, laws, sections, amendments, lawyers, templates, subscribers, and questionnaire trees.',
                            'پوری ویب سائٹ کا جامع ڈیٹابیس بیک اپ'
                          )}
                        </p>
                      </div>
                      <Button size="sm" asChild className="w-full sm:w-auto text-xs gap-1.5 shadow-sm">
                        <a href="/api/admin/export?type=backup" download>
                          <HardDrive className="h-3.5 w-3.5" />
                          <span>{t('Export Full Database Dump (.json)', 'مکمل بیک اپ ڈاؤنلوڈ کریں')}</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Database Maintenance & Seed */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-amber-500" />
                    {t('Database Maintenance & Seeds', 'ڈیٹابیس مینٹیننس و ری سیٹ')}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('Administrative actions for resetting seed records and refreshing directory cache', 'ڈیٹابیس کی تجدید و بحالی کے اقدامات')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        {t('Reseed Seed Statutes & Categories', 'ڈیٹابیس ری سیڈ (Reseed DB)')}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                        {t(
                          'Reloads core Pakistan statutes, constitutional sections, default lawyers, templates, and finder questions from seed definition.',
                          'بنیادی قوانین، وکلاء اور ٹیمپلیٹس کا ابتدائی ڈیٹا دوبارہ ری لوڈ کرتا ہے۔'
                        )}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={reseed} className="h-9 text-xs gap-1.5 border-amber-500/40 text-amber-600 hover:bg-amber-500/10">
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>{t('Execute Reseed', 'ری سیڈ چلائیں')}</span>
                    </Button>
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

      {/* Law Sections and Amendments Manager Dialog */}
      {managingLawSections && (
        <LawSectionsAndAmendmentsDialog
          law={managingLawSections}
          onClose={() => setManagingLawSections(null)}
          onSaved={() => {
            loadAll()
          }}
        />
      )}

      {/* Create Subscriber Dialog */}
      {creatingSubscriber && (
        <SubscriberCreateDialog
          onClose={() => setCreatingSubscriber(false)}
          onSaved={() => {
            setCreatingSubscriber(false)
            loadAll()
          }}
        />
      )}

      {/* Create/Edit Finder Question Dialog */}
      {(creatingFinderQuestion || editingFinderQuestion) && (
        <FinderQuestionDialog
          question={editingFinderQuestion}
          categories={categories}
          allQuestions={finderQuestions}
          onClose={() => {
            setCreatingFinderQuestion(false)
            setEditingFinderQuestion(null)
          }}
          onSaved={() => {
            setCreatingFinderQuestion(false)
            setEditingFinderQuestion(null)
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
  const { t, lang } = useLanguage()
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
              <Label className={cn('text-xs', lang === 'ur' && 'font-urdu')}>{t('Title (Urdu)', 'عنوان (اردو)')}</Label>
              <Input
                value={form.titleUrdu}
                onChange={(e) => setForm({ ...form, titleUrdu: e.target.value })}
                placeholder={lang === 'ur' ? 'مثلاً قانونِ معاہدہ 1872' : 'Urdu title (optional) e.g. قانونِ معاہدہ'}
                className={cn('text-xs', lang === 'ur' && 'font-urdu')}
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
                  <SelectValue placeholder={t('Select Category', 'شعبہ منتخب کریں')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {lang === 'ur' ? c.nameUrdu : c.name}
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
            <Label className={cn('text-xs', lang === 'ur' && 'font-urdu')}>{t('Summary (Urdu)', 'خلاصہ (اردو)')}</Label>
            <Textarea
              value={form.summaryUrdu}
              onChange={(e) => setForm({ ...form, summaryUrdu: e.target.value })}
              rows={3}
              placeholder={lang === 'ur' ? 'قانون کا اردو میں مختصر خلاصہ...' : 'Urdu summary translation (optional)...'}
              className={cn('text-xs', lang === 'ur' && 'font-urdu')}
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
  const { t, lang } = useLanguage()
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
            <Label className={cn('text-xs', lang === 'ur' && 'font-urdu')}>{t('Category Name (Urdu)', 'نام (اردو) *')}</Label>
            <Input
              value={form.nameUrdu}
              onChange={(e) => setForm({ ...form, nameUrdu: e.target.value })}
              placeholder={lang === 'ur' ? 'مثلاً آئینی قانون' : 'Urdu category name (optional) e.g. آئینی قانون'}
              className={cn('text-xs', lang === 'ur' && 'font-urdu')}
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
  const { t, lang } = useLanguage()
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
              <Label className={cn('text-xs', lang === 'ur' && 'font-urdu')}>{t('Name (Urdu)', 'نام (اردو)')}</Label>
              <Input
                value={form.nameUrdu}
                onChange={(e) => setForm({ ...form, nameUrdu: e.target.value })}
                placeholder={lang === 'ur' ? 'ایڈووکیٹ علی خان' : 'Urdu name (optional) e.g. علی خان'}
                className={cn('text-xs', lang === 'ur' && 'font-urdu')}
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
  const { t, lang } = useLanguage()
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
              <Label className={cn('text-xs', lang === 'ur' && 'font-urdu')}>{t('Title (Urdu)', 'عنوان (اردو)')}</Label>
              <Input
                value={form.titleUrdu}
                onChange={(e) => setForm({ ...form, titleUrdu: e.target.value })}
                placeholder={lang === 'ur' ? 'مثلاً کرایہ نامہ' : 'Urdu title (optional) e.g. کرایہ نامہ'}
                className={cn('text-xs', lang === 'ur' && 'font-urdu')}
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
                  <SelectValue placeholder={t('Select Category', 'شعبہ منتخب کریں')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug} className="text-xs">
                      {lang === 'ur' ? c.nameUrdu : c.name}
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

// -------------------------------------------------------------
// LAW SECTIONS & AMENDMENTS DIALOG
// -------------------------------------------------------------
function LawSectionsAndAmendmentsDialog({
  law,
  onClose,
  onSaved,
}: {
  law: Law
  onClose: () => void
  onSaved: () => void
}) {
  const { t, lang } = useLanguage()
  const [activeTab, setActiveTab] = React.useState<'sections' | 'amendments'>('sections')
  const [sections, setSections] = React.useState<LawSection[]>([])
  const [amendments, setAmendments] = React.useState<LawAmendment[]>([])
  const [loading, setLoading] = React.useState(true)

  // Section Form state
  const [editingSectionId, setEditingSectionId] = React.useState<string | null>(null)
  const [sectionForm, setSectionForm] = React.useState({
    sectionNumber: '',
    title: '',
    content: '',
    contentUrdu: '',
    orderIndex: 0,
  })
  const [savingSection, setSavingSection] = React.useState(false)

  // Amendment Form state
  const [editingAmendmentId, setEditingAmendmentId] = React.useState<string | null>(null)
  const [amendmentForm, setAmendmentForm] = React.useState({
    amendmentYear: new Date().getFullYear(),
    amendmentTitle: '',
    gazetteReference: '',
    description: '',
  })
  const [savingAmendment, setSavingAmendment] = React.useState(false)

  const loadDetails = React.useCallback(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/admin/sections?lawId=${law.id}`).then((r) => r.json()),
      fetch(`/api/admin/amendments?lawId=${law.id}`).then((r) => r.json()),
    ])
      .then(([secData, amdData]) => {
        if (secData.ok) setSections(secData.sections || [])
        if (amdData.ok) setAmendments(amdData.amendments || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [law.id])

  React.useEffect(() => {
    loadDetails()
  }, [loadDetails])

  // Save Section
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sectionForm.sectionNumber.trim() || !sectionForm.content.trim()) {
      toast.error(t('Section number and English content are required', 'دفعہ کا نمبر اور متن ضروری ہیں'))
      return
    }
    setSavingSection(true)
    try {
      const isEdit = !!editingSectionId
      const url = '/api/admin/sections'
      const method = isEdit ? 'PATCH' : 'POST'
      const body = isEdit
        ? { id: editingSectionId, ...sectionForm }
        : { lawId: law.id, ...sectionForm }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.ok) {
        toast.success(isEdit ? t('Section updated', 'دفعہ اپڈیٹ ہو گئی') : t('Section added', 'دفعہ شامل ہو گئی'))
        setEditingSectionId(null)
        setSectionForm({ sectionNumber: '', title: '', content: '', contentUrdu: '', orderIndex: sections.length + 1 })
        loadDetails()
        onSaved()
      } else {
        toast.error(d.error || 'Failed to save section')
      }
    } catch {
      toast.error('Failed to save section')
    } finally {
      setSavingSection(false)
    }
  }

  // Delete Section
  const handleDeleteSection = async (id: string) => {
    if (!confirm(t('Delete this section?', 'کیا آپ یہ دفعہ حذف کرنا چاہتے ہیں؟'))) return
    try {
      const res = await fetch(`/api/admin/sections?id=${id}`, { method: 'DELETE' })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Section deleted', 'دفعہ حذف ہو گئی'))
        loadDetails()
        onSaved()
      }
    } catch {
      toast.error('Failed to delete section')
    }
  }

  // Save Amendment
  const handleSaveAmendment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amendmentForm.amendmentTitle.trim() || !amendmentForm.amendmentYear) {
      toast.error(t('Amendment title and year are required', 'ترمیم کا عنوان اور سال ضروری ہیں'))
      return
    }
    setSavingAmendment(true)
    try {
      const isEdit = !!editingAmendmentId
      const url = '/api/admin/amendments'
      const method = isEdit ? 'PATCH' : 'POST'
      const body = isEdit
        ? { id: editingAmendmentId, ...amendmentForm }
        : { lawId: law.id, ...amendmentForm }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.ok) {
        toast.success(isEdit ? t('Amendment updated', 'ترمیم اپڈیٹ ہو گئی') : t('Amendment added', 'ترمیم شامل ہو گئی'))
        setEditingAmendmentId(null)
        setAmendmentForm({
          amendmentYear: new Date().getFullYear(),
          amendmentTitle: '',
          gazetteReference: '',
          description: '',
        })
        loadDetails()
        onSaved()
      } else {
        toast.error(d.error || 'Failed to save amendment')
      }
    } catch {
      toast.error('Failed to save amendment')
    } finally {
      setSavingAmendment(false)
    }
  }

  // Delete Amendment
  const handleDeleteAmendment = async (id: string) => {
    if (!confirm(t('Delete this amendment?', 'کیا آپ یہ ترمیم حذف کرنا چاہتے ہیں؟'))) return
    try {
      const res = await fetch(`/api/admin/amendments?id=${id}`, { method: 'DELETE' })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Amendment deleted', 'ترمیم حذف ہو گئی'))
        loadDetails()
        onSaved()
      }
    } catch {
      toast.error('Failed to delete amendment')
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="pb-2 border-b border-border/70">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs uppercase">
              {law.jurisdiction}
            </Badge>
            <DialogTitle className="text-base font-bold truncate">
              {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {t(
              'Manage statutory sections, subsections, and historical legislative amendments for this act.',
              'اس قانون کی دفعات، ذیلی دفعات اور تاریخی ترامیم کا مکمل انتظام کریں۔'
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-2 border-b border-border/60">
          <button
            onClick={() => setActiveTab('sections')}
            className={cn(
              'px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
              activeTab === 'sections'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t('Sections & Articles', 'دفعات و شقیں')} ({sections.length})
          </button>
          <button
            onClick={() => setActiveTab('amendments')}
            className={cn(
              'px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer',
              activeTab === 'amendments'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t('Legislative Amendments', 'قانونی ترامیم')} ({amendments.length})
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {activeTab === 'sections' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sections List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                    {t('Current Sections', 'موجودہ دفعات')} ({sections.length})
                  </h4>
                  {editingSectionId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingSectionId(null)
                        setSectionForm({ sectionNumber: '', title: '', content: '', contentUrdu: '', orderIndex: sections.length + 1 })
                      }}
                      className="text-xs h-7 text-primary"
                    >
                      {t('+ New Section', '+ نئی دفعہ')}
                    </Button>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : sections.length === 0 ? (
                  <div className="p-8 text-center border border-dashed rounded-lg text-xs text-muted-foreground">
                    {t('No sections recorded for this law yet. Use the form to add Section 1.', 'اس قانون کی کوئی دفعہ درج نہیں ہے۔ نیا فارم استعمال کریں۔')}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {sections.map((s) => (
                      <div
                        key={s.id}
                        className={cn(
                          'p-3 rounded-lg border text-xs transition-all flex items-start justify-between gap-3',
                          editingSectionId === s.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border/70 bg-muted/20 hover:bg-muted/40'
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary text-primary-foreground text-[10px] font-mono px-1.5 py-0.2">
                              Sec. {s.sectionNumber}
                            </Badge>
                            {s.title && <span className="font-semibold text-foreground truncate">{s.title}</span>}
                          </div>
                          <p className="text-muted-foreground line-clamp-2 mt-1 font-sans">{s.content}</p>
                          {s.contentUrdu && (
                            <p className="text-muted-foreground line-clamp-1 mt-0.5 font-urdu text-[11px]" dir="rtl">
                              {s.contentUrdu}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-primary hover:bg-primary/10"
                            onClick={() => {
                              setEditingSectionId(s.id)
                              setSectionForm({
                                sectionNumber: s.sectionNumber,
                                title: s.title || '',
                                content: s.content,
                                contentUrdu: s.contentUrdu || '',
                                orderIndex: s.orderIndex,
                              })
                            }}
                            title="Edit"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteSection(s.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add / Edit Section Form */}
              <div className="lg:col-span-5 p-4 rounded-xl border border-border/80 bg-card space-y-3">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  {editingSectionId ? t('Edit Section', 'دفعہ میں ترمیم') : t('Add New Section', 'نئی دفعہ شامل کریں')}
                </h4>
                <form onSubmit={handleSaveSection} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium">{t('Section #', 'دفعہ نمبر')} *</Label>
                      <Input
                        value={sectionForm.sectionNumber}
                        onChange={(e) => setSectionForm({ ...sectionForm, sectionNumber: e.target.value })}
                        placeholder="e.g. 302, 4-A"
                        className="h-8 text-xs font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium">{t('Order Index', 'ترتیب')}</Label>
                      <Input
                        type="number"
                        value={sectionForm.orderIndex}
                        onChange={(e) => setSectionForm({ ...sectionForm, orderIndex: parseInt(e.target.value) || 0 })}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium">{t('Section Title (Optional)', 'عنوان')}</Label>
                    <Input
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                      placeholder="e.g. Punishment of qatl-i-amd"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium">{t('English Text', 'انگریزی متن')} *</Label>
                    <Textarea
                      value={sectionForm.content}
                      onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })}
                      rows={4}
                      placeholder="Statutory text of section..."
                      className="text-xs font-sans"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium">{t('Urdu Text (Optional)', 'اردو متن')}</Label>
                    <Textarea
                      value={sectionForm.contentUrdu}
                      onChange={(e) => setSectionForm({ ...sectionForm, contentUrdu: e.target.value })}
                      rows={3}
                      dir="rtl"
                      placeholder="دفعہ کا اردو متن..."
                      className="text-xs font-urdu"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    {editingSectionId && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSectionId(null)
                          setSectionForm({ sectionNumber: '', title: '', content: '', contentUrdu: '', orderIndex: sections.length + 1 })
                        }}
                        className="h-8 text-xs"
                      >
                        {t('Cancel', 'منسوخ')}
                      </Button>
                    )}
                    <Button type="submit" size="sm" disabled={savingSection} className="h-8 text-xs gap-1">
                      {savingSection ? t('Saving...', 'محفوظ ہو رہا ہے...') : editingSectionId ? t('Update Section', 'اپڈیٹ کریں') : t('Add Section', 'دفعہ شامل کریں')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'amendments' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Amendments List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                    {t('Historical Amendments', 'تاریخی ترامیم')} ({amendments.length})
                  </h4>
                  {editingAmendmentId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingAmendmentId(null)
                        setAmendmentForm({
                          amendmentYear: new Date().getFullYear(),
                          amendmentTitle: '',
                          gazetteReference: '',
                          description: '',
                        })
                      }}
                      className="text-xs h-7 text-primary"
                    >
                      {t('+ New Amendment', '+ نئی ترمیم')}
                    </Button>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : amendments.length === 0 ? (
                  <div className="p-8 text-center border border-dashed rounded-lg text-xs text-muted-foreground">
                    {t('No amendments recorded for this act.', 'کوئی ترمیم درج نہیں ہے۔')}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {amendments.map((a) => (
                      <div
                        key={a.id}
                        className={cn(
                          'p-3 rounded-lg border text-xs transition-all flex items-start justify-between gap-3',
                          editingAmendmentId === a.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border/70 bg-muted/20 hover:bg-muted/40'
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-bold">
                              {a.amendmentYear}
                            </Badge>
                            <span className="font-semibold text-foreground truncate">{a.amendmentTitle}</span>
                          </div>
                          {a.gazetteReference && (
                            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                              Gazette: {a.gazetteReference}
                            </p>
                          )}
                          {a.description && <p className="text-muted-foreground line-clamp-2 mt-1">{a.description}</p>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-primary hover:bg-primary/10"
                            onClick={() => {
                              setEditingAmendmentId(a.id)
                              setAmendmentForm({
                                amendmentYear: a.amendmentYear,
                                amendmentTitle: a.amendmentTitle,
                                gazetteReference: a.gazetteReference || '',
                                description: a.description || '',
                              })
                            }}
                            title="Edit"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteAmendment(a.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add / Edit Amendment Form */}
              <div className="lg:col-span-5 p-4 rounded-xl border border-border/80 bg-card space-y-3">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  {editingAmendmentId ? t('Edit Amendment', 'ترمیم میں تبدیلی') : t('Add New Amendment', 'نئی ترمیم شامل کریں')}
                </h4>
                <form onSubmit={handleSaveAmendment} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium">{t('Amendment Year', 'سال')} *</Label>
                      <Input
                        type="number"
                        value={amendmentForm.amendmentYear}
                        onChange={(e) => setAmendmentForm({ ...amendmentForm, amendmentYear: parseInt(e.target.value) || new Date().getFullYear() })}
                        className="h-8 text-xs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium">{t('Gazette Ref', 'گزٹ حوالہ')}</Label>
                      <Input
                        value={amendmentForm.gazetteReference}
                        onChange={(e) => setAmendmentForm({ ...amendmentForm, gazetteReference: e.target.value })}
                        placeholder="e.g. PLD 2021 Fed. 45"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium">{t('Amendment Title', 'ترمیم کا عنوان')} *</Label>
                    <Input
                      value={amendmentForm.amendmentTitle}
                      onChange={(e) => setAmendmentForm({ ...amendmentForm, amendmentTitle: e.target.value })}
                      placeholder="e.g. Criminal Law (Amendment) Act, 2021"
                      className="h-8 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium">{t('Description / Impact', 'وضاحت / اثرات')}</Label>
                    <Textarea
                      value={amendmentForm.description}
                      onChange={(e) => setAmendmentForm({ ...amendmentForm, description: e.target.value })}
                      rows={4}
                      placeholder="Brief note on what this amendment modified..."
                      className="text-xs font-sans"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    {editingAmendmentId && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingAmendmentId(null)
                          setAmendmentForm({
                            amendmentYear: new Date().getFullYear(),
                            amendmentTitle: '',
                            gazetteReference: '',
                            description: '',
                          })
                        }}
                        className="h-8 text-xs"
                      >
                        {t('Cancel', 'منسوخ')}
                      </Button>
                    )}
                    <Button type="submit" size="sm" disabled={savingAmendment} className="h-8 text-xs gap-1">
                      {savingAmendment ? t('Saving...', 'محفوظ ہو رہا ہے...') : editingAmendmentId ? t('Update Amendment', 'اپڈیٹ کریں') : t('Add Amendment', 'ترمیم شامل کریں')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-3 border-t border-border/70">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            {t('Done & Close', 'مکمل و بند کریں')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------
// SUBSCRIBER CREATE DIALOG
// -------------------------------------------------------------
function SubscriberCreateDialog({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const { t } = useLanguage()
  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [active, setActive] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      toast.error(t('Valid email is required', 'درست ای میل ضروری ہے'))
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || null, active }),
      })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Subscriber registered successfully', 'سبسکرائبر کامیابی سے رجسٹر ہو گیا'))
        onSaved()
      } else {
        toast.error(d.error || 'Failed to create subscriber')
      }
    } catch {
      toast.error('Failed to create subscriber')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Mail className="h-4 w-4 text-purple-600" />
            {t('Add Newsletter Subscriber', 'نیا سبسکرائبر شامل کریں')}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t('Manually register an email address to receive periodic legal updates.', 'قانونی اطلاعات وصول کرنے کے لیے ای میل شامل کریں۔')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">{t('Email Address', 'ای میل ایڈریس')} *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lawyer@example.com"
              className="text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t('Subscriber Name (Optional)', 'نام')}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Advocate Tariq"
              className="text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="subActiveCheck"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <Label htmlFor="subActiveCheck" className="text-xs cursor-pointer">
              {t('Set subscriber status as Active', 'سبسکرائبر کی حیثیت فعال رکھیں')}
            </Label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={saving}>
              {t('Cancel', 'منسوخ')}
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? t('Adding...', 'شامل ہو رہا ہے...') : t('Add Subscriber', 'شامل کریں')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------
// FINDER QUESTION DIALOG
// -------------------------------------------------------------
function FinderQuestionDialog({
  question,
  categories,
  allQuestions,
  onClose,
  onSaved,
}: {
  question: FinderQuestionItem | null
  categories: Category[]
  allQuestions: FinderQuestionItem[]
  onClose: () => void
  onSaved: () => void
}) {
  const { t, lang } = useLanguage()
  const isEdit = !!question
  const [questionText, setQuestionText] = React.useState(question?.question || '')
  const [questionUrdu, setQuestionUrdu] = React.useState(question?.questionUrdu || '')
  const [orderIndex, setOrderIndex] = React.useState(question?.orderIndex || 0)
  const [options, setOptions] = React.useState<FinderQuestionOption[]>(
    question?.options && question.options.length > 0
      ? question.options
      : [
          { id: 'opt_1', label: 'Criminal Matter', labelUrdu: 'فوجداری معاملہ', categoryIds: ['criminal-law'] },
          { id: 'opt_2', label: 'Civil / Family Matter', labelUrdu: 'دیوانی یا خاندانی معاملہ', categoryIds: ['family-law'] },
        ]
  )
  const [saving, setSaving] = React.useState(false)

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: `opt_${Date.now()}`,
        label: 'New Option',
        labelUrdu: '',
        categoryIds: [],
      },
    ])
  }

  const removeOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateOption = (idx: number, patch: Partial<FinderQuestionOption>) => {
    setOptions((prev) => prev.map((opt, i) => (i === idx ? { ...opt, ...patch } : opt)))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim()) {
      toast.error(t('Question text is required', 'سوال کا متن ضروری ہے'))
      return
    }
    setSaving(true)
    try {
      const url = '/api/admin/finder'
      const method = isEdit ? 'PATCH' : 'POST'
      const body = isEdit
        ? { id: question.id, question: questionText, questionUrdu, orderIndex, options }
        : { question: questionText, questionUrdu, orderIndex, options }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.ok) {
        toast.success(isEdit ? t('Question updated', 'سوال اپڈیٹ ہو گیا') : t('Question created', 'سوال شامل ہو گیا'))
        onSaved()
      } else {
        toast.error(d.error || 'Failed to save question')
      }
    } catch {
      toast.error('Failed to save question')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Compass className="h-4 w-4 text-indigo-600" />
            {isEdit ? t('Edit Finder Question', 'سوال میں ترمیم') : t('Create Finder Question', 'نیا رہنمائی سوال')}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t('Define the question prompt and multiple branching options for the citizen guide.', 'شہریوں کی رہنمائی کے لیے سوال اور جوابی اختیارات مرتب کریں۔')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">{t('Question Prompt (English)', 'سوال (انگریزی)')} *</Label>
              <Input
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="e.g. What is the nature of your legal dispute?"
                className="text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('Order Index', 'ترتیب')}</Label>
              <Input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t('Question Prompt (Urdu)', 'سوال (اردو)')}</Label>
            <Input
              value={questionUrdu}
              onChange={(e) => setQuestionUrdu(e.target.value)}
              dir="rtl"
              placeholder="مثلاً: آپ کا قانونی معاملہ کس نوعیت کا ہے؟"
              className="text-xs font-urdu"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t('Branching Choices & Paths', 'جوابی اختیارات')} ({options.length})
              </Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption} className="h-7 text-xs gap-1">
                <Plus className="h-3 w-3" />
                <span>{t('Add Option', 'آپشن شامل کریں')}</span>
              </Button>
            </div>

            <div className="space-y-2.5">
              {options.map((opt, i) => (
                <div key={opt.id || i} className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase">Option #{i + 1}</span>
                    {options.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                        onClick={() => removeOption(i)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        value={opt.label}
                        onChange={(e) => updateOption(i, { label: e.target.value })}
                        placeholder="Option label (English)"
                        className="h-8 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        value={opt.labelUrdu || ''}
                        onChange={(e) => updateOption(i, { labelUrdu: e.target.value })}
                        dir="rtl"
                        placeholder="آپشن لیبل (اردو)"
                        className="h-8 text-xs font-urdu"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">
                        {t('Next Question ID (Leave empty if final)', 'اگلا سوال ID')}
                      </Label>
                      <Select
                        value={opt.nextQuestionId || 'final'}
                        onValueChange={(val) => updateOption(i, { nextQuestionId: val === 'final' ? undefined : val })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Next Step" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="final">➔ Final Step (Show Laws)</SelectItem>
                          {allQuestions
                            .filter((q) => q.id !== question?.id)
                            .map((q) => (
                              <SelectItem key={q.id} value={q.id} className="text-xs">
                                #{q.orderIndex}: {q.question.slice(0, 30)}...
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[10px] text-muted-foreground">
                        {t('Target Category Slug (comma separated)', 'متعلقہ کیٹیگری')}
                      </Label>
                      <Input
                        value={(opt.categoryIds || []).join(', ')}
                        onChange={(e) =>
                          updateOption(i, {
                            categoryIds: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="e.g. criminal-law, family-law"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={saving}>
              {t('Cancel', 'منسوخ')}
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? t('Saving...', 'محفوظ ہو رہا ہے...') : isEdit ? t('Update Question', 'اپڈیٹ کریں') : t('Create Question', 'سوال شامل کریں')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
