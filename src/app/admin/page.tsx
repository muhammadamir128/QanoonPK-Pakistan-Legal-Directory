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
  HelpCircle, CheckCircle, Clock, Landmark, BookOpen, KeyRound,
  Calendar, Globe, Hash, Save, Info, Link2,
  PanelLeftClose, PanelLeftOpen, PanelLeft,
} from 'lucide-react'
import { SignOutModal } from '@/components/sign-out-modal'
import { ConfirmDeleteModal } from '@/components/confirm-delete-modal'
import { AdminCourtsTab } from '@/components/admin/admin-courts-tab'
import { AdminGlossaryTab } from '@/components/admin/admin-glossary-tab'
import { AdminFaqTab } from '@/components/admin/admin-faq-tab'
import { AdminExportTab } from '@/components/admin/admin-export-tab'
import { AdminOverviewCharts } from '@/components/admin/admin-overview-charts'
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
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
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

type AdminTab =
  | 'overview'
  | 'laws'
  | 'categories'
  | 'courts'
  | 'glossary'
  | 'lawyers'
  | 'reviews'
  | 'templates'
  | 'finder'
  | 'faq'
  | 'analytics'
  | 'users'
  | 'subscribers'
  | 'export'
  | 'settings'

const VALID_TABS: AdminTab[] = [
  'overview',
  'laws',
  'categories',
  'courts',
  'glossary',
  'lawyers',
  'reviews',
  'templates',
  'finder',
  'faq',
  'analytics',
  'users',
  'subscribers',
  'export',
  'settings',
]

export default function AdminPage() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const { t, lang, setLang } = useLanguage()
  const router = useRouter()

  const [activeTab, setActiveTab] = React.useState<AdminTab>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [signOutModalOpen, setSignOutModalOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_sidebar_collapsed')
      if (saved !== null) {
        setSidebarCollapsed(saved === 'true')
      }
    } catch {
      // ignore
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Unified Delete Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = React.useState<{
    open: boolean
    title?: string
    titleUrdu?: string
    itemName?: string
    itemType?: string
    itemTypeUrdu?: string
    description?: string
    descriptionUrdu?: string
    onConfirm: () => Promise<void> | void
  }>({
    open: false,
    onConfirm: () => {},
  })

  const requestDelete = React.useCallback(
    (config: {
      title?: string
      titleUrdu?: string
      itemName?: string
      itemType?: string
      itemTypeUrdu?: string
      description?: string
      descriptionUrdu?: string
      onConfirm: () => Promise<void> | void
    }) => {
      setDeleteModalState({
        open: true,
        ...config,
      })
    },
    []
  )

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

  const TEMPLATES_PER_PAGE = 10
  const [templatesPage, setTemplatesPage] = React.useState(1)

  // Reset page when filters change
  React.useEffect(() => {
    setLawsPage(1)
  }, [search, selectedJurisdiction, selectedCategory])

  React.useEffect(() => {
    setLawyersPage(1)
  }, [search])

  React.useEffect(() => {
    setTemplatesPage(1)
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
  const reseed = () => {
    requestDelete({
      title: t('Reseed Database', 'ڈیٹابیس ری سیڈ کریں'),
      titleUrdu: 'ڈیٹابیس دوبارہ سید کریں',
      itemName: 'Platform Database & Initial Directory Seeds',
      itemType: 'System Database',
      itemTypeUrdu: 'سسٹم ڈیٹابیس',
      description: t(
        'Are you sure you want to reseed the database? This will reset sample laws, lawyer directories, and templates.',
        'کیا آپ واقعی ڈیٹابیس کو دوبارہ سید کرنا چاہتے ہیں؟ اس سے تمام ڈیفالٹ قوانین اور ڈائریکٹریز ری سیٹ ہو جائیں گی۔'
      ),
      onConfirm: async () => {
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
      },
    })
  }

  // --- Delete Law ---
  const deleteLaw = (law: Law) => {
    requestDelete({
      title: t('Delete Statute', 'قانون حذف کریں'),
      titleUrdu: 'قانون حذف کریں',
      itemName: law.title,
      itemType: 'Statute / Law',
      itemTypeUrdu: 'قانون / ایکٹ',
      description: t(
        `Are you sure you want to delete "${law.title}"? All related sections, bookmarks, and search index entries will be permanently removed.`,
        `کیا آپ واقعی "${law.title}" کو حذف کرنا چاہتے ہیں؟ اس سے متعلقہ تمام دفعات اور ریکارڈز ہمیشہ کے لیے ختم ہو جائیں گے۔`
      ),
      onConfirm: async () => {
        const res = await fetch(`/api/laws/${law.slug}`, { method: 'DELETE' })
        if (res.ok) {
          toast.success(t('Law deleted', 'قانون حذف ہو گیا'))
          loadAll()
        } else {
          toast.error(t('Delete failed', 'حذف ناکام'))
        }
      },
    })
  }

  // --- Delete Category ---
  const deleteCategory = (cat: Category) => {
    requestDelete({
      title: t('Delete Category', 'کیٹیگری حذف کریں'),
      titleUrdu: 'کیٹیگری حذف کریں',
      itemName: cat.name,
      itemType: 'Legal Category',
      itemTypeUrdu: 'قانونی قسم',
      description: t(
        `Are you sure you want to delete category "${cat.name}"?`,
        `کیا آپ واقعی کیٹیگری "${cat.name}" کو حذف کرنا چاہتے ہیں؟`
      ),
      onConfirm: async () => {
        const res = await fetch(`/api/categories/${cat.slug}`, { method: 'DELETE' })
        const data = await res.json()
        if (res.ok && data.ok) {
          toast.success(t('Category deleted', 'قسم حذف ہو گئی'))
          loadAll()
        } else {
          toast.error(data.error || t('Delete failed', 'حذف ناکام'))
        }
      },
    })
  }

  // --- Delete Lawyer ---
  const deleteLawyer = (lawyer: Lawyer) => {
    requestDelete({
      title: t('Delete Lawyer Profile', 'وکیل کا پروفائل حذف کریں'),
      titleUrdu: 'وکیل کا پروفائل حذف کریں',
      itemName: lawyer.name,
      itemType: 'Lawyer Profile',
      itemTypeUrdu: 'وکیل پروفائل',
      description: t(
        `Are you sure you want to delete the directory profile for "${lawyer.name}"?`,
        `کیا آپ واقعی "${lawyer.name}" کا پروفائل حذف کرنا چاہتے ہیں؟`
      ),
      onConfirm: async () => {
        const res = await fetch(`/api/admin/lawyers/${lawyer.slug}`, { method: 'DELETE' })
        if (res.ok) {
          toast.success(t('Lawyer deleted', 'وکیل حذف ہو گیا'))
          loadAll()
        } else {
          toast.error(t('Delete failed', 'حذف ناکام'))
        }
      },
    })
  }

  // --- Delete Template ---
  const deleteTemplate = (tpl: Template) => {
    requestDelete({
      title: t('Delete Legal Template', 'قانونی ٹیمپلیٹ حذف کریں'),
      titleUrdu: 'قانونی ٹیمپلیٹ حذف کریں',
      itemName: tpl.title,
      itemType: 'Legal Template',
      itemTypeUrdu: 'قانونی دستاویز',
      description: t(
        `Are you sure you want to delete document template "${tpl.title}"?`,
        `کیا آپ واقعی ٹیمپلیٹ "${tpl.title}" کو حذف کرنا چاہتے ہیں؟`
      ),
      onConfirm: async () => {
        const res = await fetch(`/api/admin/templates/${tpl.slug}`, { method: 'DELETE' })
        if (res.ok) {
          toast.success(t('Template deleted', 'ٹیمپلیٹ حذف ہو گیا'))
          loadAll()
        } else {
          toast.error(t('Delete failed', 'حذف ناکام'))
        }
      },
    })
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

  const deleteSubscriber = (sub: Subscriber) => {
    requestDelete({
      title: t('Delete Subscriber', 'سبسکرائبر حذف کریں'),
      titleUrdu: 'سبسکرائبر حذف کریں',
      itemName: sub.email,
      itemType: 'Newsletter Subscriber',
      itemTypeUrdu: 'نیوز لیٹر سبسکرائبر',
      description: t(
        `Are you sure you want to remove "${sub.email}" from the newsletter subscription list?`,
        `کیا آپ واقعی "${sub.email}" کو سبسکرپشن لسٹ سے حذف کرنا چاہتے ہیں؟`
      ),
      onConfirm: async () => {
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
      },
    })
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
  const deleteReview = (review: Review) => {
    requestDelete({
      title: t('Delete Client Review', 'ریویو حذف کریں'),
      titleUrdu: 'ریویو حذف کریں',
      itemName: `${review.authorName} (${review.rating} ★) - ${review.comment ? `"${review.comment.slice(0, 50)}..."` : ''}`,
      itemType: 'Lawyer Review',
      itemTypeUrdu: 'وکیل کا جائزہ',
      description: t(
        `Are you sure you want to delete this review by "${review.authorName}"?`,
        `کیا آپ واقعی "${review.authorName}" کا یہ جائزہ حذف کرنا چاہتے ہیں؟`
      ),
      onConfirm: async () => {
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
      },
    })
  }

  // --- Finder Question Handlers ---
  const deleteFinderQuestion = (q: FinderQuestionItem) => {
    requestDelete({
      title: t('Delete Citizen Finder Question', 'رہنمائی سوال حذف کریں'),
      titleUrdu: 'رہنمائی سوال حذف کریں',
      itemName: q.question,
      itemType: 'Citizen Guide Question',
      itemTypeUrdu: 'رہنمائی سوال',
      description: t(
        `Are you sure you want to delete this decision-tree question and all its configured answer branches?`,
        `کیا آپ واقعی یہ رہنمائی سوال اور اس کی تمام متعلقہ شاخیں حذف کرنا چاہتے ہیں؟`
      ),
      onConfirm: async () => {
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
      },
    })
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

  const totalTemplatesPages = Math.max(1, Math.ceil(filteredTemplates.length / TEMPLATES_PER_PAGE))
  const paginatedTemplates = filteredTemplates.slice((templatesPage - 1) * TEMPLATES_PER_PAGE, templatesPage * TEMPLATES_PER_PAGE)

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

  // --- SIDEBAR NAVIGATION DEFINITION (ORGANIZED BY SECTIONS) ---
  type NavSection = {
    titleEn: string
    titleUr: string
    items: Array<{
      id: AdminTab
      labelEn: string
      labelUr: string
      icon: any
      badge: string | number | null
    }>
  }

  const navSections: NavSection[] = [
    {
      titleEn: 'Main',
      titleUr: 'مرکزی',
      items: [
        {
          id: 'overview',
          labelEn: 'Dashboard Overview',
          labelUr: 'ڈیش بورڈ خلاصہ',
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      titleEn: 'Statutes & Judiciary',
      titleUr: 'قوانین و عدلیہ',
      items: [
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
          id: 'courts',
          labelEn: 'Court Hierarchy',
          labelUr: 'عدالتی درجہ بندی',
          icon: Landmark,
          badge: 9,
        },
        {
          id: 'glossary',
          labelEn: 'Legal Glossary',
          labelUr: 'قانونی فرہنگ',
          icon: BookOpen,
          badge: 45,
        },
      ],
    },
    {
      titleEn: 'Directory & Services',
      titleUr: 'ڈائریکٹری و خدمات',
      items: [
        {
          id: 'lawyers',
          labelEn: 'Lawyers Directory',
          labelUr: 'وکلاء کی ڈائریکٹری',
          icon: Briefcase,
          badge: lawyers.length,
        },
        {
          id: 'reviews',
          labelEn: 'Lawyer Reviews',
          labelUr: 'وکلاء کے جائزے',
          icon: Star,
          badge: reviews.length || null,
        },
        {
          id: 'templates',
          labelEn: 'Legal Templates',
          labelUr: 'قانونی ٹیمپلیٹس',
          icon: FilePlus,
          badge: templates.length,
        },
        {
          id: 'finder',
          labelEn: 'Legal Finder',
          labelUr: 'رہنمائی سوالات',
          icon: Compass,
          badge: finderQuestions.length || null,
        },
      ],
    },
    {
      titleEn: 'Community & Citizen Help',
      titleUr: 'کمیونٹی و رہنمائی',
      items: [
        {
          id: 'faq',
          labelEn: 'FAQ & Help Center',
          labelUr: 'سوالات و رہنمائی',
          icon: HelpCircle,
          badge: 25,
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
          id: 'analytics',
          labelEn: 'Analytics & Logs',
          labelUr: 'تجزیات و لاگز',
          icon: BarChart3,
          badge: analytics ? `${analytics.zeroResultCount} ⚠️` : null,
        },
      ],
    },
    {
      titleEn: 'System & Data',
      titleUr: 'سسٹم و ڈیٹا',
      items: [
        {
          id: 'export',
          labelEn: 'Data Export & Backup',
          labelUr: 'ڈیٹا ایکسپورٹ و بیک اپ',
          icon: HardDrive,
          badge: 'Live',
        },
        {
          id: 'settings',
          labelEn: 'Settings & Tools',
          labelUr: 'ترتیبات و اوزار',
          icon: Settings,
          badge: null,
        },
      ],
    },
  ]

  const navItems = navSections.flatMap((section) => section.items)

  // Shared Sidebar Component
  const SidebarContent = ({
    collapsed = false,
    onToggle,
  }: {
    collapsed?: boolean
    onToggle?: () => void
  }) => (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col h-full bg-card border-r border-border text-card-foreground">
        {/* Brand Header */}
        {collapsed ? (
          <div className="h-16 p-2 border-b border-border/70 flex items-center justify-center shrink-0">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggle}
                  className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 ring-1 ring-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                >
                  <ScaleIcon className="h-5 w-5 transition-transform group-hover:rotate-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side={lang === 'ur' ? 'left' : 'right'} sideOffset={10} className="font-semibold text-xs py-1.5 px-3 shadow-lg">
                <span>{t('QanoonPK Admin Portal', 'قانون پی کے ایڈمن پورٹل')}</span>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="h-16 px-4 border-b border-border/70 flex items-center shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 ring-1 ring-white/20 shrink-0">
                <ScaleIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-foreground truncate">
                    {t('QanoonPK', 'قانون پی کے')}
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>{t('Control Center', 'مرکزی کنٹرول پینل')}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-6',
            collapsed ? 'px-2 py-3 space-y-2' : 'px-2.5 py-3 space-y-4'
          )}
        >
          {collapsed ? (
            <>
              {navSections.map((section, sIdx) => (
                <div key={section.titleEn} className="space-y-1.5">
                  {sIdx > 0 && <div className="my-2 border-t border-border/60 mx-1" />}
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    const label = t(item.labelEn, item.labelUr)
                    return (
                      <Tooltip key={item.id} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => {
                              handleTabChange(item.id as AdminTab)
                              setMobileMenuOpen(false)
                            }}
                            className={cn(
                              'w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-xs font-semibold transition-all relative group cursor-pointer',
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 ring-1 ring-primary/40 font-bold'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/70'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                                isActive ? 'text-primary-foreground' : 'text-primary'
                              )}
                            />
                            {item.badge != null && (
                              <span
                                className={cn(
                                  'absolute top-1 right-1 h-2 w-2 rounded-full ring-2 ring-card',
                                  isActive ? 'bg-primary-foreground' : 'bg-emerald-500'
                                )}
                              />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side={lang === 'ur' ? 'left' : 'right'}
                          sideOffset={10}
                          className="flex items-center gap-2 font-semibold text-xs py-1.5 px-3 z-50 shadow-lg border border-border/60"
                        >
                          <span>{label}</span>
                          {item.badge != null && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground font-mono font-bold">
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              ))}

              {/* Collapsed Quick Links */}
              <div className="pt-2 border-t border-border/60 space-y-1.5">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href="/"
                      target="_blank"
                      className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors group cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4 text-blue-500 transition-transform group-hover:scale-110" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side={lang === 'ur' ? 'left' : 'right'} sideOffset={10} className="font-semibold text-xs py-1.5 px-3 shadow-lg border border-border/60">
                    {t('View Public Site', 'عوامی سائٹ')}
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href="/courts"
                      target="_blank"
                      className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors group cursor-pointer"
                    >
                      <Landmark className="h-4 w-4 text-teal-500 transition-transform group-hover:scale-110" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side={lang === 'ur' ? 'left' : 'right'} sideOffset={10} className="font-semibold text-xs py-1.5 px-3 shadow-lg border border-border/60">
                    {t('Courts Directory', 'عدالتی نظام')}
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href="/chat"
                      target="_blank"
                      className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-colors group cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-amber-500 transition-transform group-hover:scale-110" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side={lang === 'ur' ? 'left' : 'right'} sideOffset={10} className="font-semibold text-xs py-1.5 px-3 shadow-lg border border-border/60">
                    {t('AI Assistant', 'اے آئی اسسٹنٹ')}
                  </TooltipContent>
                </Tooltip>
              </div>
            </>
          ) : (
            <>
              {navSections.map((section) => (
                <div key={section.titleEn} className="space-y-1">
                  <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                    {t(section.titleEn, section.titleUr)}
                  </div>
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          handleTabChange(item.id as AdminTab)
                          setMobileMenuOpen(false)
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group text-left cursor-pointer',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold ring-1 ring-primary/30'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={cn(
                              'h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110',
                              isActive ? 'text-primary-foreground' : 'text-primary'
                            )}
                          />
                          <span className="truncate">{t(item.labelEn, item.labelUr)}</span>
                        </div>
                        {item.badge != null && (
                          <span
                            className={cn(
                              'text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1.5 font-mono',
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
                </div>
              ))}

              <div className="pt-2 border-t border-border/60">
                <div className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  {t('Quick Links', 'فوری روابط')}
                </div>
                <Link
                  href="/"
                  target="_blank"
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                    <span>{t('View Public Site', 'عوامی سائٹ')}</span>
                  </div>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
                <Link
                  href="/courts"
                  target="_blank"
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Landmark className="h-3.5 w-3.5 text-teal-500" />
                    <span>{t('Courts Directory', 'عدالتی نظام')}</span>
                  </div>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
                <Link
                  href="/chat"
                  target="_blank"
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>{t('AI Assistant', 'اے آئی اسسٹنٹ')}</span>
                  </div>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Footer / User Card & Controls */}
        {collapsed ? (
          <div className="p-2 border-t border-border/70 flex flex-col items-center gap-2 bg-muted/20 shrink-0">
            {/* Language Toggle */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
                  className="h-9 w-9 rounded-xl text-xs font-bold hover:bg-accent/70 cursor-pointer"
                >
                  <Languages className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={lang === 'ur' ? 'left' : 'right'} sideOffset={10} className="font-semibold text-xs py-1.5 px-3 shadow-lg border border-border/60">
                {lang === 'en' ? 'Switch to Urdu (اردو)' : 'Switch to English'}
              </TooltipContent>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-9 w-9 rounded-xl hover:bg-accent/70 cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-700" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={lang === 'ur' ? 'left' : 'right'} sideOffset={10} className="font-semibold text-xs py-1.5 px-3 shadow-lg border border-border/60">
                {t('Toggle Theme', 'تھیم تبدیل کریں')}
              </TooltipContent>
            </Tooltip>

            {/* Sign Out */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSignOutModalOpen(true)}
                  className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={lang === 'ur' ? 'left' : 'right'} sideOffset={10} className="font-semibold text-xs py-1.5 px-3 shadow-lg border border-border/60">
                {t('Sign Out', 'لاگ آؤٹ')}
              </TooltipContent>
            </Tooltip>

            {/* Expand toggle */}
            {onToggle && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/70 cursor-pointer"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={lang === 'ur' ? 'left' : 'right'} sideOffset={10} className="font-semibold text-xs py-1.5 px-3 shadow-lg border border-border/60">
                  {lang === 'ur' ? 'سائیڈ بار کھولیں' : 'Expand Sidebar'}
                </TooltipContent>
              </Tooltip>
            )}

            {/* Avatar with Tooltip */}
            <div className="pt-1 border-t border-border/50 w-full flex justify-center">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="cursor-pointer">
                    <Avatar
                      className="h-8 w-8 border border-primary/30 hover:ring-2 hover:ring-primary/40 transition-all"
                    >
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent side={lang === 'ur' ? 'left' : 'right'} sideOffset={10} className="text-xs py-1.5 px-3 shadow-lg border border-border/60">
                  <p className="font-bold">{session?.user?.name || 'Administrator'}</p>
                  <p className="text-[10px] opacity-80">{session?.user?.email || 'admin@qanoon.pk'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : (
        <div className="p-3.5 border-t border-border/70 space-y-3 bg-muted/20 shrink-0">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border border-border/70">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="h-8 px-2 text-xs font-semibold gap-1.5 cursor-pointer"
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
              className="h-8 w-8 text-foreground cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-slate-700" />
              )}
            </Button>

            {/* Sign Out with Confirmation Modal */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSignOutModalOpen(true)}
              className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
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
      )}
    </div>
  </TooltipProvider>
)

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20">
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 sticky top-0 h-screen z-30 shadow-sm transition-[width] duration-300 ease-in-out',
          sidebarCollapsed ? 'w-[68px]' : 'w-72'
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border/80 bg-background/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 cursor-pointer">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={lang === 'ur' ? 'right' : 'left'} className="p-0 w-72">
                <SidebarContent collapsed={false} />
              </SheetContent>
            </Sheet>

            {/* Desktop Sidebar Collapse / Expand Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden lg:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/70 rounded-xl cursor-pointer"
              title={
                sidebarCollapsed
                  ? t('Expand Sidebar', 'سائیڈ بار کھولیں')
                  : t('Collapse Sidebar', 'سائیڈ بار بند کریں')
              }
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>

            {/* Breadcrumb / Title with Live Badge */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <span className="text-muted-foreground hidden sm:inline">{t('Admin Portal', 'ایڈمن پورٹل')}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 hidden sm:inline" />
              <div className="flex items-center gap-2.5">
                <span className="text-foreground font-bold capitalize text-sm sm:text-base">
                  {t(
                    navItems.find((n) => n.id === activeTab)?.labelEn || 'Dashboard',
                    navItems.find((n) => n.id === activeTab)?.labelUr || 'ڈیش بورڈ'
                  )}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t('Live', 'فعال')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={reseed}
              className="h-8 text-xs gap-1.5 hidden md:flex border-border/70 hover:border-primary/40 hover:bg-accent cursor-pointer"
              title={t('Reseed / Reset Database', 'ڈیٹابیس ری سیٹ کریں')}
            >
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('Reseed DB', 'ڈیٹابیس ری سیٹ')}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <Link href="/" target="_blank">
                <ExternalLink className="h-3.5 w-3.5 mr-1 text-primary" />
                <span>{t('Public Site', 'ویب سائٹ')}</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-2.5">
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
                    icon={Landmark}
                    label={t('Courts', 'عدالتیں')}
                    value={9}
                    color="#0d9488"
                    onClick={() => handleTabChange('courts')}
                  />
                  <StatCard
                    icon={BookOpen}
                    label={t('Glossary', 'فرہنگ')}
                    value={45}
                    color="#2563eb"
                    onClick={() => handleTabChange('glossary')}
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
                    icon={HelpCircle}
                    label={t('FAQs', 'سوالات')}
                    value={25}
                    color="#d97706"
                    onClick={() => handleTabChange('faq')}
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

              {/* Comprehensive Visual Graphs for All Pages Data */}
              <AdminOverviewCharts
                laws={laws}
                categories={categories}
                lawyers={lawyers}
                templates={templates}
                analytics={analytics}
                reviews={reviews}
                users={users}
                subscribers={subscribers}
              />

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
              {/* Page Header: Title, Stats & Primary Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                        {t('Laws Management', 'قوانین کا انتظام')}
                      </h1>
                      <Badge variant="secondary" className="text-[11px] font-mono font-bold px-2 py-0.5">
                        {laws.length} {t('Statutes', 'قوانین')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {filteredLaws.length !== laws.length
                        ? t(`${filteredLaws.length} filtered results matching criteria`, `فلٹر کے مطابق ${filteredLaws.length} قوانین`)
                        : t('Directory of federal and provincial statutory acts, ordinances, and codes.', 'وفاقی و صوبائی قوانین، آرڈیننس اور کوڈز کی مرکزی ڈائریکٹری۔')}
                      {filteredLaws.length > LAWS_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${lawsPage} / ${totalLawsPages}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5 shadow-xs border-border/80">
                    <a href="/api/admin/export?type=laws" download>
                      <Download className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t('Export CSV', 'ایکسپورٹ CSV')}</span>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setCreatingLaw(true)}
                    className="h-9 text-xs gap-1.5 shadow-sm font-semibold cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('Add New Law', 'نیا قانون شامل کریں')}</span>
                  </Button>
                </div>
              </div>

              {/* Dedicated Filter & Search Toolbar */}
              <Card className="p-3 sm:p-3.5 border-border/80 shadow-xs bg-card">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
                  {/* Search input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder={t('Search laws by title, slug, or keywords...', 'قوانین عنوان، سلگ یا لفظ سے تلاش کریں...')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-9 pl-9 pr-8 text-xs bg-background"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Jurisdiction Filter */}
                    <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                      <SelectTrigger className="h-9 text-xs w-full sm:w-40 bg-background">
                        <SelectValue placeholder={t('Jurisdiction', 'دائرہ اختیار')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('All Jurisdictions', 'تمام دائرہ اختیار')}</SelectItem>
                        <SelectItem value="federal">Federal (وفاقی)</SelectItem>
                        <SelectItem value="punjab">Punjab (پنجاب)</SelectItem>
                        <SelectItem value="sindh">Sindh (سندھ)</SelectItem>
                        <SelectItem value="kpk">KPK (خیبر پختونخوا)</SelectItem>
                        <SelectItem value="balochistan">Balochistan (بلوچستان)</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Category Filter */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-9 text-xs w-full sm:w-44 bg-background">
                        <SelectValue placeholder={t('Category', 'قسم')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('All Categories', 'تمام اقسام')}</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.slug}>
                            <span className="flex items-center gap-1.5">
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: c.color || 'hsl(var(--primary))' }}
                              />
                              <span>{lang === 'ur' ? c.nameUrdu : c.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Reset Filters */}
                    {(search || selectedJurisdiction !== 'all' || selectedCategory !== 'all') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearch('')
                          setSelectedJurisdiction('all')
                          setSelectedCategory('all')
                        }}
                        className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        title={t('Clear Filters', 'فلٹرز ختم کریں')}
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        <span>{t('Reset', 'ری سیٹ')}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Data Table Card */}
              <Card className="border-border/80 shadow-xs overflow-hidden">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-6 space-y-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : filteredLaws.length === 0 ? (
                    <div className="p-12 text-center text-sm text-muted-foreground space-y-2">
                      <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                      <p className="font-semibold">{t('No laws found matching criteria', 'کوئی قانون نہیں ملا')}</p>
                      <p className="text-xs">{t('Try clearing the search or changing the filters.', 'سرچ یا فلٹر تبدیل کر کے دوبارہ کوشش کریں۔')}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="w-12 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/80">#</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Title / Statute', 'عنوان و قانون')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Category', 'قسم')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Year', 'سال')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Jurisdiction', 'دائرہ اختیار')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Status', 'حیثیت')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-center">{t('Views', 'مناظر')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedLaws.map((law, index) => {
                            const serialNumber = (lawsPage - 1) * LAWS_PER_PAGE + index + 1
                            return (
                              <TableRow key={law.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="text-center text-xs text-muted-foreground font-mono font-medium">{serialNumber}</TableCell>
                                <TableCell className="max-w-md py-3">
                                  <div className="font-semibold text-xs text-foreground line-clamp-1 hover:text-primary transition-colors">
                                    {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
                                    /{law.slug}
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] font-normal"
                                    style={{
                                      borderColor: law.category?.color ? `${law.category.color}60` : undefined,
                                      backgroundColor: law.category?.color ? `${law.category.color}10` : undefined,
                                    }}
                                  >
                                    {lang === 'ur' ? law.category?.nameUrdu : law.category?.name}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs font-mono py-3">{law.yearEnacted}</TableCell>
                                <TableCell className="py-3">
                                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                                    {law.jurisdiction}
                                  </span>
                                </TableCell>
                                <TableCell className="py-3">
                                  <Badge
                                    className={cn(
                                      'text-[10px] capitalize font-medium gap-1',
                                      law.status === 'active' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                                      law.status === 'repealed' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
                                      law.status === 'amended' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'h-1.5 w-1.5 rounded-full',
                                        law.status === 'active' && 'bg-emerald-500',
                                        law.status === 'repealed' && 'bg-rose-500',
                                        law.status === 'amended' && 'bg-blue-500'
                                      )}
                                    />
                                    {law.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center text-xs font-mono text-muted-foreground py-3">
                                  {law.viewCount}
                                </TableCell>
                                <TableCell className="text-right pr-4 space-x-1 py-3">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
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
                                    title={t('Edit Law', 'ترمیم کریں')}
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    asChild
                                    title={t('View Live Page', 'عوامی صفحہ دیکھیں')}
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
                                    title={t('Delete Law', 'حذف کریں')}
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
                    <div className="p-3.5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
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
                                  isActive && 'font-bold shadow-xs'
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
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
                    <Tags className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                        {t('Legal Categories', 'قانونی اقسام')}
                      </h1>
                      <Badge variant="secondary" className="text-[11px] font-mono font-bold px-2 py-0.5">
                        {categories.length} {t('Categories', 'شاخیں')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('Specialized legal branches, statute categories, and subject classifications.', 'قانونی شاخیں، موضوعات اور شعبہ جات کی درجہ بندی۔')}
                      {categories.length > CATEGORIES_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${categoriesPage} / ${totalCategoriesPages}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => setCreatingCategory(true)}
                    className="h-9 text-xs gap-1.5 shadow-sm font-semibold cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('Add Category', 'نئی قسم شامل کریں')}</span>
                  </Button>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                {paginatedCategories.map((c) => (
                  <Card key={c.id} className="hover:border-primary/50 transition-all shadow-xs relative overflow-hidden group flex flex-col justify-between">
                    <div
                      className="h-1 w-full shrink-0"
                      style={{ backgroundColor: c.color || 'hsl(var(--primary))' }}
                    />
                    <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="h-3 w-3 rounded-full shrink-0 ring-2 ring-background"
                              style={{ backgroundColor: c.color || 'hsl(var(--primary))' }}
                            />
                            <p className="text-sm font-bold text-foreground truncate">
                              {lang === 'ur' && c.nameUrdu ? c.nameUrdu : c.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              asChild
                              title={t('View Laws in Category', 'اس قسم کے قوانین دیکھیں')}
                            >
                              <Link href={`/categories/${c.slug}`} target="_blank">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              onClick={() => deleteCategory(c)}
                              title={t('Delete Category', 'حذف کریں')}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground/80 font-mono">/{c.slug}</p>

                        {(lang === 'ur' ? (c.descriptionUrdu || c.description) : c.description) && (
                          <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                            {lang === 'ur' ? (c.descriptionUrdu || c.description) : c.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Categories Pagination Controls (20 per page) */}
              {categories.length > CATEGORIES_PER_PAGE && (
                <div className="p-3.5 rounded-xl border border-border/70 bg-card flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
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
                              isActive && 'font-bold shadow-xs'
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
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                        {t('Lawyers Directory', 'وکلاء کی ڈائریکٹری')}
                      </h1>
                      <Badge variant="secondary" className="text-[11px] font-mono font-bold px-2 py-0.5">
                        {lawyers.length} {t('Advocates', 'وکلاء')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {filteredLawyers.length !== lawyers.length
                        ? t(`${filteredLawyers.length} filtered counsel matching query`, `تلاش کے مطابق ${filteredLawyers.length} وکلاء`)
                        : t('Directory of practicing advocates, high court counsel, and legal consultants.', 'پریکٹس کرنے والے وکلاء اور قانونی مشیران کی تصدیق شدہ فہرست۔')}
                      {filteredLawyers.length > LAWYERS_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${lawyersPage} / ${totalLawyersPages}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5 shadow-xs border-border/80">
                    <a href="/api/admin/export?type=lawyers" download>
                      <Download className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t('Export CSV', 'ایکسپورٹ CSV')}</span>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setCreatingLawyer(true)}
                    className="h-9 text-xs gap-1.5 shadow-sm font-semibold cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('Add Lawyer', 'وکیل شامل کریں')}</span>
                  </Button>
                </div>
              </div>

              {/* Dedicated Search Toolbar */}
              <Card className="p-3 sm:p-3.5 border-border/80 shadow-xs bg-card">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder={t('Search lawyers by name, city, province, or contact...', 'نام، شہر، صوبہ یا رابطے سے وکیل تلاش کریں...')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-9 pl-9 pr-8 text-xs bg-background"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearch('')}
                      className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      <span>{t('Reset', 'ری سیٹ')}</span>
                    </Button>
                  )}
                </div>
              </Card>

              {/* Data Table Card */}
              <Card className="border-border/80 shadow-xs overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="w-12 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/80">#</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Lawyer / Advocate', 'وکیل')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Location', 'شہر و صوبہ')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Specialization', 'شعبہ')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Verified', 'تصدیق شدہ')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Featured', 'نمایاں')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedLawyers.map((lawyer, idx) => {
                          const serialNumber = (lawyersPage - 1) * LAWYERS_PER_PAGE + idx + 1
                          return (
                            <TableRow key={lawyer.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="text-center text-xs text-muted-foreground font-mono font-medium">{serialNumber}</TableCell>
                              <TableCell className="py-3">
                                <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                                  <span>{lang === 'ur' && lawyer.nameUrdu ? lawyer.nameUrdu : lawyer.name}</span>
                                  {lawyer.verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                                  {lawyer.email || lawyer.phone || 'No direct contact'}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs py-3">
                                <span className="font-semibold text-foreground">{lawyer.city}</span>
                                <span className="text-muted-foreground">, {lawyer.province}</span>
                              </TableCell>
                              <TableCell className="text-xs py-3">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {lawyer.specialization?.slice(0, 2).map((s, i) => (
                                    <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                                      {s}
                                    </Badge>
                                  ))}
                                  {(lawyer.specialization?.length || 0) > 2 && (
                                    <span className="text-[9px] text-muted-foreground">
                                      +{lawyer.specialization.length - 2}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <Button
                                  size="sm"
                                  variant={lawyer.verified ? 'default' : 'outline'}
                                  onClick={() => toggleLawyerVerified(lawyer)}
                                  className={cn('h-6 px-2 text-[10px] rounded-full gap-1 cursor-pointer font-medium', lawyer.verified && 'bg-blue-600 hover:bg-blue-700 text-white')}
                                >
                                  <ShieldCheck className="h-3 w-3" />
                                  <span>{lawyer.verified ? t('Verified', 'تصدیق شدہ') : t('Unverified', 'غیر تصدیق')}</span>
                                </Button>
                              </TableCell>
                              <TableCell className="py-3">
                                <Button
                                  size="sm"
                                  variant={lawyer.featured ? 'default' : 'outline'}
                                  onClick={() => toggleLawyerFeatured(lawyer)}
                                  className={cn('h-6 px-2 text-[10px] rounded-full gap-1 cursor-pointer font-medium', lawyer.featured && 'bg-amber-600 hover:bg-amber-700 text-white')}
                                >
                                  <Star className="h-3 w-3" />
                                  <span>{lawyer.featured ? t('Featured', 'نمایاں') : t('Standard', 'معیاری')}</span>
                                </Button>
                              </TableCell>
                              <TableCell className="text-right pr-4 space-x-1 py-3">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                  asChild
                                  title={t('View Public Profile', 'پروفائل دیکھیں')}
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
                                  title={t('Delete Lawyer', 'حذف کریں')}
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
                    <div className="p-3.5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
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
                                  isActive && 'font-bold shadow-xs'
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
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center border border-pink-500/20 shrink-0">
                    <FilePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                        {t('Legal Document Templates', 'قانونی دستاویز ٹیمپلیٹس')}
                      </h1>
                      <Badge variant="secondary" className="text-[11px] font-mono font-bold px-2 py-0.5">
                        {templates.length} {t('Templates', 'ٹیمپلیٹس')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('Standardized legal contracts, agreements, notices, and citizen affidavits.', 'معاہدات، اقرار نامے، حلف نامے اور نوٹسز کے معیاری قانونی ڈرافٹس۔')}
                      {filteredTemplates.length > TEMPLATES_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${templatesPage} / ${totalTemplatesPages}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => setCreatingTemplate(true)}
                    className="h-9 text-xs gap-1.5 shadow-sm font-semibold cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('Add Template', 'ٹیمپلیٹ شامل کریں')}</span>
                  </Button>
                </div>
              </div>

              {/* Dedicated Search Toolbar */}
              <Card className="p-3 sm:p-3.5 border-border/80 shadow-xs bg-card">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder={t('Search templates by title or category...', 'عنوان یا قسم سے ٹیمپلیٹ تلاش کریں...')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-9 pl-9 pr-8 text-xs bg-background"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearch('')}
                      className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      <span>{t('Reset', 'ری سیٹ')}</span>
                    </Button>
                  )}
                </div>
              </Card>

              {/* Data Table Card */}
              <Card className="border-border/80 shadow-xs overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="w-12 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/80">#</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Template Title', 'عنوان')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Category', 'شعبہ')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-center">{t('Downloads', 'ڈاؤنلوڈز')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTemplates.map((tpl, i) => {
                          const serialNumber = (templatesPage - 1) * TEMPLATES_PER_PAGE + i + 1
                          return (
                            <TableRow key={tpl.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="text-center text-xs text-muted-foreground font-mono font-medium">{serialNumber}</TableCell>
                              <TableCell className="py-3">
                                <div className="font-semibold text-xs text-foreground">
                                  {lang === 'ur' && tpl.titleUrdu ? tpl.titleUrdu : tpl.title}
                                </div>
                                <div className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">/{tpl.slug}</div>
                              </TableCell>
                              <TableCell className="py-3">
                                <Badge variant="outline" className="text-[10px] font-normal">
                                  {tpl.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center font-mono text-xs text-muted-foreground py-3">
                                <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-[11px]">
                                  <Download className="h-3 w-3 text-muted-foreground" />
                                  <span>{tpl.downloads}</span>
                                </span>
                              </TableCell>
                              <TableCell className="text-right pr-4 space-x-1 py-3">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                  asChild
                                  title={t('Open Template Builder', 'ٹیمپلیٹ ایڈیٹر کھولیں')}
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
                                  title={t('Delete Template', 'حذف کریں')}
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

                  {/* Templates Pagination Controls */}
                  {filteredTemplates.length > TEMPLATES_PER_PAGE && (
                    <div className="p-3.5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                      <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                        {t(
                          `Showing ${(templatesPage - 1) * TEMPLATES_PER_PAGE + 1} to ${Math.min(templatesPage * TEMPLATES_PER_PAGE, filteredTemplates.length)} of ${filteredTemplates.length} templates`,
                          `${filteredTemplates.length} میں سے ${(templatesPage - 1) * TEMPLATES_PER_PAGE + 1} تا ${Math.min(templatesPage * TEMPLATES_PER_PAGE, filteredTemplates.length)} ٹیمپلیٹس`
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTemplatesPage((p) => Math.max(1, p - 1))}
                          disabled={templatesPage === 1}
                          className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                        >
                          <ChevronLeft className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                          <span>{t('Previous', 'پچھلا')}</span>
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(7, totalTemplatesPages) }).map((_, idx) => {
                            let pNum: number
                            if (totalTemplatesPages <= 7) {
                              pNum = idx + 1
                            } else if (templatesPage <= 4) {
                              pNum = idx + 1
                            } else if (templatesPage >= totalTemplatesPages - 3) {
                              pNum = totalTemplatesPages - 6 + idx
                            } else {
                              pNum = templatesPage - 3 + idx
                            }
                            const isActive = pNum === templatesPage
                            return (
                              <Button
                                key={pNum}
                                variant={isActive ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setTemplatesPage(pNum)}
                                className={cn(
                                  'h-8 w-8 p-0 text-xs tabular-nums cursor-pointer',
                                  isActive && 'font-bold shadow-xs'
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
                          onClick={() => setTemplatesPage((p) => Math.min(totalTemplatesPages, p + 1))}
                          disabled={templatesPage === totalTemplatesPages}
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

              {/* Visual Analytics Graphs */}
              <AdminOverviewCharts
                laws={laws}
                categories={categories}
                lawyers={lawyers}
                templates={templates}
                analytics={analytics}
                reviews={reviews}
                users={users}
                subscribers={subscribers}
              />

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
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                        {t('User Management', 'صارفین کا انتظام')}
                      </h1>
                      <Badge variant="secondary" className="text-[11px] font-mono font-bold px-2 py-0.5">
                        {users.length} {t('Accounts', 'صارفین')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('Manage registered citizens, advocates, and administrative role assignments.', 'رجسٹرڈ ممبران، وکلاء اور ایڈمن کے کرداروں کا انتظام کریں۔')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5 shadow-xs border-border/80">
                    <a href="/api/admin/export?type=users" download>
                      <Download className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t('Export CSV', 'ایکسپورٹ CSV')}</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadAll} className="h-9 text-xs gap-1.5 shadow-xs border-border/80 cursor-pointer">
                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t('Refresh Users', 'صارفین ریفریش')}</span>
                  </Button>
                </div>
              </div>

              {/* Data Table Card */}
              <Card className="border-border/80 shadow-xs overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="w-12 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/80">#</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('User', 'صارف')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Email', 'ای میل')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Registered', 'رجسٹریشن تاریخ')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Current Role', 'موجودہ کردار')}</TableHead>
                          <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-right pr-4">{t('Modify Role', 'کردار تبدیل کریں')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user, idx) => (
                          <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="text-center text-xs text-muted-foreground font-mono font-medium">{idx + 1}</TableCell>
                            <TableCell className="py-3">
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-8 w-8 border border-border shrink-0">
                                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-xs text-foreground">{user.name || 'Unnamed User'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-mono text-muted-foreground py-3">{user.email}</TableCell>
                            <TableCell className="text-xs text-muted-foreground py-3">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="py-3">
                              <Badge
                                className={cn(
                                  'text-[10px] uppercase font-bold tracking-wider',
                                  user.role === 'admin' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30',
                                  user.role === 'editor' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30',
                                  user.role === 'reviewer' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
                                  user.role === 'user' && 'bg-muted text-muted-foreground'
                                )}
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-4 py-3">
                              <Select
                                value={user.role}
                                onValueChange={(val) => handleRoleChange(user.id, val)}
                              >
                                <SelectTrigger className="h-8 text-xs w-36 ml-auto bg-background">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <Card className="border-border/80 shadow-xs relative overflow-hidden">
                  <div className="h-1 w-full bg-purple-500" />
                  <CardContent className="p-4 flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground font-semibold">{t('Total Subscribers', 'کل سبسکرائبرز')}</p>
                      <p className="text-xl sm:text-2xl font-black font-mono tracking-tight">{subscribers.length}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/80 shadow-xs relative overflow-hidden">
                  <div className="h-1 w-full bg-emerald-500" />
                  <CardContent className="p-4 flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground font-semibold">{t('Active Subscribers', 'فعال سبسکرائبرز')}</p>
                      <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                        {subscribers.filter((s) => s.active).length}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/80 shadow-xs relative overflow-hidden">
                  <div className="h-1 w-full bg-amber-500" />
                  <CardContent className="p-4 flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground font-semibold">{t('Inactive / Unsubscribed', 'غیر فعال')}</p>
                      <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
                        {subscribers.filter((s) => !s.active).length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                        {t('Newsletter Subscribers', 'نیوز لیٹر سبسکرائبرز')}
                      </h1>
                      <Badge variant="secondary" className="text-[11px] font-mono font-bold px-2 py-0.5">
                        {subscribers.length} {t('Recipients', 'قارئین')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('Subscribed email contacts receiving legal updates, gazette alerts, and amendments.', 'قانونی ترامیم اور گزٹ الرٹس وصول کرنے والے ای میل سبسکرائبرز۔')}
                      {filteredSubscribers.length > SUBSCRIBERS_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${subscribersPage} / ${totalSubscribersPages}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={copySubscribersEmails} className="h-9 text-xs gap-1.5 shadow-xs border-border/80 cursor-pointer">
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t('Copy Emails', 'ای میلز کاپی')}</span>
                  </Button>

                  <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5 shadow-xs border-border/80">
                    <a href="/api/admin/export?type=subscribers" download>
                      <Download className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t('Export CSV', 'ایکسپورٹ CSV')}</span>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setCreatingSubscriber(true)}
                    className="h-9 text-xs gap-1.5 shadow-sm font-semibold cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('Add Subscriber', 'سبسکرائبر شامل کریں')}</span>
                  </Button>
                </div>
              </div>

              {/* Dedicated Filter Toolbar */}
              <Card className="p-3 sm:p-3.5 border-border/80 shadow-xs bg-card">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder={t('Search by email or name...', 'ای میل یا نام سے تلاش کریں...')}
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                      className="h-9 pl-9 pr-8 text-xs bg-background"
                    />
                    {subscriberSearch && (
                      <button
                        onClick={() => setSubscriberSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={subscriberFilter} onValueChange={(val: any) => setSubscriberFilter(val)}>
                      <SelectTrigger className="h-9 text-xs w-full sm:w-40 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('All Status', 'تمام اسٹیٹس')}</SelectItem>
                        <SelectItem value="active">{t('Active Only', 'صرف فعال')}</SelectItem>
                        <SelectItem value="inactive">{t('Inactive Only', 'صرف غیر فعال')}</SelectItem>
                      </SelectContent>
                    </Select>

                    {(subscriberSearch || subscriberFilter !== 'all') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSubscriberSearch('')
                          setSubscriberFilter('all')
                        }}
                        className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        <span>{t('Reset', 'ری سیٹ')}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Table Card */}
              <Card className="border-border/80 shadow-xs overflow-hidden">
                <CardContent className="p-0">
                  {filteredSubscribers.length === 0 ? (
                    <div className="p-12 text-center text-sm text-muted-foreground space-y-2">
                      <Mail className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                      <p className="font-semibold">{t('No subscribers found matching query', 'کوئی سبسکرائبر نہیں ملا')}</p>
                      <p className="text-xs">{t('Try clearing the filter or adding a new subscriber.', 'فلٹر تبدیل کر کے دوبارہ کوشش کریں۔')}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="w-12 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/80">#</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Email Address', 'ای میل ایڈریس')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Subscriber Name', 'نام')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Joined Date', 'شمولیت تاریخ')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Status', 'حیثیت')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedSubscribers.map((sub, idx) => {
                            const serialNumber = (subscribersPage - 1) * SUBSCRIBERS_PER_PAGE + idx + 1
                            return (
                              <TableRow key={sub.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="text-center text-xs text-muted-foreground font-mono font-medium">{serialNumber}</TableCell>
                                <TableCell className="text-xs font-mono font-medium text-foreground py-3">{sub.email}</TableCell>
                                <TableCell className="text-xs text-muted-foreground py-3">{sub.name || '—'}</TableCell>
                                <TableCell className="text-xs text-muted-foreground py-3">
                                  {new Date(sub.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="py-3">
                                  <button
                                    onClick={() => toggleSubscriber(sub)}
                                    title={t('Click to toggle status', 'اسٹیٹس تبدیل کرنے کے لیے کلک کریں')}
                                    className="cursor-pointer"
                                  >
                                    <Badge
                                      className={cn(
                                        'text-[10px] uppercase font-bold cursor-pointer transition-transform hover:scale-105 gap-1',
                                        sub.active
                                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                          : 'bg-muted text-muted-foreground border border-border'
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          'h-1.5 w-1.5 rounded-full',
                                          sub.active ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                                        )}
                                      />
                                      {sub.active ? t('Active', 'فعال') : t('Inactive', 'غیر فعال')}
                                    </Badge>
                                  </button>
                                </TableCell>
                                <TableCell className="text-right pr-4 space-x-1 py-3">
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
                    <div className="p-3.5 border-t border-border/60 flex items-center justify-between gap-4 bg-muted/10">
                      <div className="text-xs text-muted-foreground font-medium">
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
                          className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                        >
                          <ChevronLeft className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                          <span>{t('Previous', 'پچھلا')}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubscribersPage((p) => Math.min(totalSubscribersPages, p + 1))}
                          disabled={subscribersPage === totalSubscribersPages}
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

          {/* TAB 9: LAWYER REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <Card className="border-border/80 shadow-xs relative overflow-hidden">
                  <div className="h-1 w-full bg-amber-500" />
                  <CardContent className="p-4 flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground font-semibold">{t('Total Reviews', 'کل جائزے')}</p>
                      <p className="text-xl sm:text-2xl font-black font-mono tracking-tight">{reviews.length}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/80 shadow-xs relative overflow-hidden">
                  <div className="h-1 w-full bg-emerald-500" />
                  <CardContent className="p-4 flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground font-semibold">{t('5-Star Feedback', '۵ ستارہ ریٹنگ')}</p>
                      <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                        {reviews.filter((r) => r.rating === 5).length}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/80 shadow-xs relative overflow-hidden">
                  <div className="h-1 w-full bg-blue-500" />
                  <CardContent className="p-4 flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground font-semibold">{t('Average Rating', 'اوسط ریٹنگ')}</p>
                      <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-foreground flex items-center gap-1.5">
                        <span>
                          {reviews.length > 0
                            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                            : '0.0'}
                        </span>
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                        {t('Lawyer Reviews Moderation', 'وکلاء کے جائزوں کی نگرانی')}
                      </h1>
                      <Badge variant="secondary" className="text-[11px] font-mono font-bold px-2 py-0.5">
                        {reviews.length} {t('Reviews', 'جائزے')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('Moderate client testimonials, public ratings, and advocate feedback.', 'کلائنٹس کے تبصروں، ریٹنگز اور تصدیق کا انتظام کریں۔')}
                      {filteredReviews.length > REVIEWS_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${reviewsPage} / ${totalReviewsPages}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={loadAll} className="h-9 text-xs gap-1.5 shadow-xs border-border/80 cursor-pointer">
                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t('Refresh Reviews', 'ریفریش')}</span>
                  </Button>
                </div>
              </div>

              {/* Dedicated Filter Toolbar */}
              <Card className="p-3 sm:p-3.5 border-border/80 shadow-xs bg-card">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder={t('Search lawyer, author, or comment...', 'وکیل، مصنف یا تبصرہ تلاش کریں...')}
                      value={reviewSearch}
                      onChange={(e) => setReviewSearch(e.target.value)}
                      className="h-9 pl-9 pr-8 text-xs bg-background"
                    />
                    {reviewSearch && (
                      <button
                        onClick={() => setReviewSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={reviewRatingFilter} onValueChange={setReviewRatingFilter}>
                      <SelectTrigger className="h-9 text-xs w-full sm:w-40 bg-background">
                        <SelectValue placeholder={t('Filter Rating', 'ریٹنگ فلٹر')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('All Ratings', 'تمام ریٹنگز')}</SelectItem>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ (5 Stars)</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ (4 Stars)</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ (3 Stars)</SelectItem>
                        <SelectItem value="2">⭐⭐ (2 Stars)</SelectItem>
                        <SelectItem value="1">⭐ (1 Star)</SelectItem>
                      </SelectContent>
                    </Select>

                    {(reviewSearch || reviewRatingFilter !== 'all') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReviewSearch('')
                          setReviewRatingFilter('all')
                        }}
                        className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        <span>{t('Reset', 'ری سیٹ')}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Table Card */}
              <Card className="border-border/80 shadow-xs overflow-hidden">
                <CardContent className="p-0">
                  {filteredReviews.length === 0 ? (
                    <div className="p-12 text-center text-sm text-muted-foreground space-y-2">
                      <Star className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                      <p className="font-semibold">{t('No reviews found matching criteria', 'کوئی جائزہ نہیں ملا')}</p>
                      <p className="text-xs">{t('Try clearing the search or rating filter.', 'فلٹر تبدیل کر کے دوبارہ کوشش کریں۔')}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="w-12 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/80">#</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Lawyer', 'وکیل')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Reviewer', 'تبصرہ نگار')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Rating', 'ریٹنگ')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 max-w-sm">{t('Comment', 'تبصرہ')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{t('Date', 'تاریخ')}</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-right pr-4">{t('Actions', 'اقدامات')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedReviews.map((rev, idx) => {
                            const serialNumber = (reviewsPage - 1) * REVIEWS_PER_PAGE + idx + 1
                            return (
                              <TableRow key={rev.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="text-center text-xs text-muted-foreground font-mono font-medium">{serialNumber}</TableCell>
                                <TableCell className="py-3">
                                  {rev.lawyer ? (
                                    <Link
                                      href={`/lawyers/${rev.lawyer.slug}`}
                                      target="_blank"
                                      className="font-semibold text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                      <span>{lang === 'ur' && rev.lawyer.nameUrdu ? rev.lawyer.nameUrdu : rev.lawyer.name}</span>
                                      <ExternalLink className="h-3 w-3 opacity-60" />
                                    </Link>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Unknown Lawyer</span>
                                  )}
                                  <div className="text-[10px] text-muted-foreground mt-0.5">{rev.lawyer?.city}</div>
                                </TableCell>
                                <TableCell className="text-xs font-semibold text-foreground py-3">{rev.authorName}</TableCell>
                                <TableCell className="py-3">
                                  <div className="flex items-center gap-1">
                                    <div className="flex items-center text-amber-500">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={cn(
                                            'h-3 w-3',
                                            i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'
                                          )}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-[11px] font-bold text-foreground font-mono ml-1">{rev.rating}.0</span>
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-md text-xs text-foreground/90 py-3">
                                  {rev.comment ? (
                                    <p className="line-clamp-2 italic text-muted-foreground">"{rev.comment}"</p>
                                  ) : (
                                    <span className="text-muted-foreground/60 italic">— No comment provided —</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-3">
                                  {new Date(rev.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right pr-4 py-3">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
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
                    <div className="p-3.5 border-t border-border/60 flex items-center justify-between gap-4 bg-muted/10">
                      <div className="text-xs text-muted-foreground font-medium">
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
                          className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                        >
                          <ChevronLeft className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                          <span>{t('Previous', 'پچھلا')}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewsPage((p) => Math.min(totalReviewsPages, p + 1))}
                          disabled={reviewsPage === totalReviewsPages}
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

          {/* TAB 10: LEGAL FINDER ("WHICH LAW APPLIES?") QUESTION EDITOR */}
          {activeTab === 'finder' && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                        {t('Legal Finder Decision Tree', 'قانونی رہنمائی سوالنامہ (Which Law Applies?)')}
                      </h1>
                      <Badge variant="secondary" className="text-[11px] font-mono font-bold px-2 py-0.5">
                        {finderQuestions.length} {t('Questions', 'سوالات')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t('Interactive questionnaire tree that routes citizens to relevant laws and statutes.', 'شہریوں کو ان کے مسائل کے مطابق صحیح قانون تک پہنچانے والا رہنمائی سسٹم۔')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild className="h-9 text-xs gap-1.5 shadow-xs border-border/80">
                    <Link href="/finder" target="_blank">
                      <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{t('Test Live Finder', 'لائیو ٹیسٹ کریں')}</span>
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setCreatingFinderQuestion(true)}
                    className="h-9 text-xs gap-1.5 shadow-sm font-semibold cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('Add Question', 'نیا سوال شامل کریں')}</span>
                  </Button>
                </div>
              </div>

              {/* Questions Container */}
              {finderQuestions.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-border/80 shadow-xs">
                  <Compass className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold">{t('No finder questions found', 'کوئی سوال موجود نہیں')}</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    {t('Seed database or create your first question to guide users.', 'ڈیٹابیس سید کریں یا نیا سوال بنائیں۔')}
                  </p>
                  <Button size="sm" onClick={() => setCreatingFinderQuestion(true)} className="text-xs gap-1 cursor-pointer">
                    <Plus className="h-3.5 w-3.5" />
                    <span>{t('Create Question', 'سوال بنائیں')}</span>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {finderQuestions.map((q, idx) => (
                    <Card key={q.id} className="border-border/80 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all relative overflow-hidden group">
                      <div className="h-1 w-full bg-indigo-500" />
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-mono font-bold bg-muted/60">
                              #{q.orderIndex ?? idx + 1}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-mono">ID: {q.id}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-primary hover:bg-primary/10 cursor-pointer"
                              onClick={() => setEditingFinderQuestion(q)}
                              title={t('Edit Question', 'ترمیم کریں')}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                              onClick={() => deleteFinderQuestion(q)}
                              title={t('Delete Question', 'حذف کریں')}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
                          <div className="space-y-1.5">
                            {(q.options || []).map((opt, oIdx) => (
                              <div
                                key={opt.id || oIdx}
                                className="p-2.5 rounded-lg bg-muted/40 border border-border/70 text-xs flex flex-col gap-1 hover:bg-muted/60 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-foreground">{opt.label}</span>
                                  {opt.labelUrdu && (
                                    <span className="text-[10px] text-muted-foreground font-urdu" dir="rtl">
                                      {opt.labelUrdu}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                  {opt.nextQuestionId ? (
                                    <span className="text-indigo-600 dark:text-indigo-400 font-mono font-medium">
                                      ➔ Next: {opt.nextQuestionId}
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                      ➔ Result Endpoint
                                    </span>
                                  )}
                                  {opt.categoryIds && opt.categoryIds.length > 0 && (
                                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-mono">
                                      Categories: {opt.categoryIds.join(', ')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: COURTS HIERARCHY */}
          {activeTab === 'courts' && <AdminCourtsTab />}

          {/* TAB: LEGAL GLOSSARY */}
          {activeTab === 'glossary' && <AdminGlossaryTab />}

          {/* TAB: CITIZEN FAQ & HELP */}
          {activeTab === 'faq' && <AdminFaqTab />}

          {/* TAB: DATA EXPORT & BACKUP */}
          {activeTab === 'export' && (
            <AdminExportTab
              stats={stats}
              laws={laws}
              lawyers={lawyers}
              templates={templates}
              categories={categories}
              subscribers={subscribers}
              users={users}
              onReseed={reseed}
            />
          )}

          {/* TAB 11: SETTINGS, BACKUP & MAINTENANCE */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Google OAuth 2.0 Card */}
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <KeyRound className="h-5 w-5 text-primary" />
                      {t('Google OAuth 2.0 & NextAuth Settings', 'گوگل او آتھ اور سائن ان کنفیگریشن')}
                    </CardTitle>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {t('Google Sign-In Ready', 'گوگل لاگ ان فعال')}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {t(
                      'Google Cloud single sign-on parameters for citizen & advocate portal access.',
                      'شہریوں اور وکلاء کے لیے گوگل کلاؤڈ کنسول کیز اور ری ڈائریکٹ یو آر ایل کا جائزہ لیں۔'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{t('Authorized Redirect URI:', 'منظور شدہ Redirect URI:')}</span>
                      <p className="text-[11px] text-muted-foreground">{t('Add to Google Cloud Console > Credentials', 'گوگل کلاؤڈ کنسول میں شامل کریں')}</p>
                    </div>
                    <code className="text-primary font-mono text-[11px] bg-background px-2.5 py-1 rounded border border-border/70 select-all">
                      {typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/google` : 'http://localhost:3007/api/auth/callback/google'}
                    </code>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1.5">
                      <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                        <span>{t('Open Google Cloud Console', 'گوگل کلاؤڈ کنسول')}</span>
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTabChange('export')} className="h-8 text-xs gap-1.5">
                      <HardDrive className="h-3.5 w-3.5 text-primary" />
                      <span>{t('Go to Data Export & Backup', 'ڈیٹا ایکسپورٹ ہب')}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

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
      {/* Sign Out Confirmation Modal */}
      <SignOutModal open={signOutModalOpen} onOpenChange={setSignOutModalOpen} />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={deleteModalState.open}
        onOpenChange={(open) => setDeleteModalState((prev) => ({ ...prev, open }))}
        title={deleteModalState.title}
        titleUrdu={deleteModalState.titleUrdu}
        itemName={deleteModalState.itemName}
        itemType={deleteModalState.itemType}
        itemTypeUrdu={deleteModalState.itemTypeUrdu}
        description={deleteModalState.description}
        descriptionUrdu={deleteModalState.descriptionUrdu}
        onConfirm={deleteModalState.onConfirm}
      />
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
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground p-3 transition-all duration-200 shadow-xs group',
        onClick && 'cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5'
      )}
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: color }} />
      <div className="flex items-center justify-between gap-1.5 mb-1.5 pt-0.5">
        <span className="text-[11px] font-semibold text-muted-foreground truncate" title={label}>
          {label}
        </span>
        <div
          className="h-6 w-6 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="h-3 w-3" style={{ color }} />
        </div>
      </div>
      <div className="text-xl font-bold tracking-tight text-foreground font-mono leading-none">
        {value.toLocaleString()}
      </div>
    </div>
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

  // Auto-generate slug helper
  const handleAutoSlug = () => {
    if (!form.title.trim()) return
    const generated = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    setForm((f) => ({ ...f, slug: generated }))
  }

  // Quick tag toggle helper
  const toggleTag = (tag: string) => {
    const currentTags = form.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    let newTags: string[]
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter((t) => t !== tag)
    } else {
      newTags = [...currentTags, tag]
    }
    setForm((f) => ({ ...f, tags: newTags.join(', ') }))
  }

  const SUGGESTED_TAGS = [
    'contract', 'commercial', 'criminal', 'civil', 'taxation',
    'constitutional', 'family', 'banking', 'property', 'procedural',
  ]

  const activeTagList = form.tags
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.categoryId) {
      toast.error(t('Title, Slug and Category are required', 'عنوان، سلگ اور شعبہ لازمی ہیں'))
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
      toast.success(
        law
          ? t('Law updated successfully', 'قانون کامیابی سے اپڈیٹ ہوا')
          : t('Law created successfully', 'نیا قانون کامیابی سے شامل ہوا')
      )
      onSaved()
    } else {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error || 'Failed to save law')
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-3xl max-h-[92vh] flex flex-col p-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl bg-card">
        {/* Pinned Header */}
        <DialogHeader className="px-6 py-4.5 border-b border-border/70 bg-muted/25 shrink-0">
          <div className="flex items-center gap-3.5 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {law ? t('Edit Law', 'قانون میں ترمیم') : t('Create New Law', 'نیا قانون شامل کریں')}
                </DialogTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] font-semibold uppercase tracking-wider',
                    law
                      ? 'text-primary border-primary/30 bg-primary/5'
                      : 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5'
                  )}
                >
                  {law ? law.slug : t('New Statute', 'نیا مسودہ')}
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground line-clamp-1">
                {t(
                  'Fill in statute specifications, English & Urdu translations, and applicability tags.',
                  'قانونی متن، اردو ترجمہ اور ضروری تفصیلات درج کریں۔'
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">
          {/* Section 1: Basic Information */}
          <div className="rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>{t('Primary Identification', 'بنیادی شناختی معلومات')}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                {t('Step 1 of 4', 'مرحلہ 1 از 4')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <span>{t('Title (English)', 'عنوان (انگریزی)')}</span>
                  <span className="text-destructive font-bold">*</span>
                </Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Contract Act 1872"
                  className="h-9 text-xs transition-all focus-visible:ring-primary/30"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className={cn('text-xs font-semibold flex items-center justify-between', lang === 'ur' && 'font-urdu')}>
                  <span className="flex items-center gap-1.5">
                    <Languages className="h-3 w-3 text-muted-foreground" />
                    <span>{t('Title (Urdu)', 'عنوان (اردو)')}</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">{t('Optional', 'اختیاری')}</span>
                </Label>
                <Input
                  value={form.titleUrdu}
                  onChange={(e) => setForm({ ...form, titleUrdu: e.target.value })}
                  placeholder={lang === 'ur' ? 'مثلاً قانونِ معاہدہ 1872' : 'Urdu title (optional) e.g. قانونِ معاہدہ'}
                  dir="rtl"
                  className={cn('h-9 text-xs text-right font-urdu transition-all focus-visible:ring-primary/30')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Link2 className="h-3 w-3 text-muted-foreground" />
                    <span>{t('Slug (URL Identifier)', 'سلگ (URL)')}</span>
                    <span className="text-destructive font-bold">*</span>
                  </Label>
                  {!law && (
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{t('Auto Generate', 'خودکار بنائیں')}</span>
                    </button>
                  )}
                </div>
                <div className="flex rounded-md border border-input focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary overflow-hidden bg-background">
                  <span className="inline-flex items-center px-2.5 text-[11px] text-muted-foreground bg-muted/40 border-r border-border select-none font-mono">
                    /laws/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    disabled={!!law}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="contract-act-1872"
                    className="flex-1 h-9 px-3 text-xs font-mono bg-transparent outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Tags className="h-3 w-3 text-muted-foreground" />
                  <span>{t('Category', 'شعبہ / قسم')}</span>
                  <span className="text-destructive font-bold">*</span>
                </Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(val) => setForm({ ...form, categoryId: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder={t('Select Category', 'شعبہ منتخب کریں')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: c.color || '#0d9488' }}
                          />
                          <span>{lang === 'ur' ? c.nameUrdu : c.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Jurisdiction & Legal Classification */}
          <div className="rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <Landmark className="h-3.5 w-3.5 text-primary" />
                <span>{t('Jurisdiction & Legal Status', 'دائرہ اختیار اور قانونی حیثیت')}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                {t('Step 2 of 4', 'مرحلہ 2 از 4')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>{t('Year Enacted', 'سالِ نفاذ')}</span>
                </Label>
                <Input
                  type="number"
                  value={form.yearEnacted}
                  onChange={(e) => setForm({ ...form, yearEnacted: Number(e.target.value) })}
                  className="h-9 text-xs"
                  min={1800}
                  max={2100}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <span>{t('Jurisdiction', 'دائرہ اختیار')}</span>
                </Label>
                <Select
                  value={form.jurisdiction}
                  onValueChange={(val) => setForm({ ...form, jurisdiction: val })}
                >
                  <SelectTrigger className="h-9 text-xs capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="federal">Federal (وفاقی)</SelectItem>
                    <SelectItem value="punjab">Punjab (پنجاب)</SelectItem>
                    <SelectItem value="sindh">Sindh (سندھ)</SelectItem>
                    <SelectItem value="kpk">KPK (خیبر پختونخوا)</SelectItem>
                    <SelectItem value="balochistan">Balochistan (بلوچستان)</SelectItem>
                    <SelectItem value="gilgit_baltistan">Gilgit-Baltistan (گلگت بلتستان)</SelectItem>
                    <SelectItem value="ajk">AJK (آزاد کشمیر)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                  <span>{t('Statute Status', 'حیثیت')}</span>
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(val) => setForm({ ...form, status: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Active (نافذ العمل)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="amended">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span>Amended (ترمیم شدہ)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="repealed">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span>Repealed (منسوخ شدہ)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Landmark className="h-3 w-3 text-muted-foreground" />
                  <span>{t('Promulgating Authority', 'مجاز اتھارٹی')}</span>
                </Label>
                <Input
                  value={form.promulgatingAuthority}
                  onChange={(e) => setForm({ ...form, promulgatingAuthority: e.target.value })}
                  placeholder="e.g. Parliament of Pakistan, Ministry of Law"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3 text-muted-foreground" />
                  <span>{t('Gazette Reference', 'گزٹ حوالہ')}</span>
                </Label>
                <Input
                  value={form.gazetteReference}
                  onChange={(e) => setForm({ ...form, gazetteReference: e.target.value })}
                  placeholder="e.g. Gazette of Pakistan, Extra., Part I, p. 120"
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bilingual Statutory Summaries */}
          <div className="rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <span>{t('Bilingual Statutory Summaries', 'قانونی خلاصہ و تشریح')}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                {t('Step 3 of 4', 'مرحلہ 3 از 4')}
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span>{t('Summary (English)', 'خلاصہ (انگریزی)')}</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    {form.summary.length} {t('characters', 'حروف')}
                  </span>
                </div>
                <Textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  rows={3}
                  placeholder="Brief statutory summary and practical legal context..."
                  className="text-xs leading-relaxed transition-all focus-visible:ring-primary/30"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className={cn('text-xs font-semibold flex items-center gap-1.5', lang === 'ur' && 'font-urdu')}>
                    <Languages className="h-3 w-3 text-muted-foreground" />
                    <span>{t('Summary (Urdu)', 'خلاصہ (اردو)')}</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    {form.summaryUrdu.length} {t('characters', 'حروف')}
                  </span>
                </div>
                <Textarea
                  value={form.summaryUrdu}
                  onChange={(e) => setForm({ ...form, summaryUrdu: e.target.value })}
                  rows={3}
                  dir="rtl"
                  placeholder={lang === 'ur' ? 'قانون کا اردو میں مختصر اور جامع خلاصہ...' : 'Urdu summary translation (optional)...'}
                  className={cn('text-xs leading-relaxed text-right font-urdu transition-all focus-visible:ring-primary/30')}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Applicability Tags & Indexing */}
          <div className="rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <Hash className="h-3.5 w-3.5 text-primary" />
                <span>{t('Applicability Tags & Indexing', 'متعلقہ ٹیگز اور تلاش')}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                {t('Step 4 of 4', 'مرحلہ 4 از 4')}
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Tags className="h-3 w-3 text-muted-foreground" />
                  <span>{t('Applicability Tags (comma-separated)', 'ٹیگز (کوما سے الگ کریں)')}</span>
                </Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="contract, commercial, breach of agreement, damages"
                  className="h-9 text-xs"
                />
              </div>

              {/* Quick Tag Suggestion Chips */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{t('Quick add suggested tags:', 'فوری تجویز کردہ ٹیگز:')}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TAGS.map((tag) => {
                    const isSelected = activeTagList.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          'text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none',
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-xs'
                            : 'bg-background text-muted-foreground border-border/80 hover:border-primary/50 hover:text-foreground'
                        )}
                      >
                        {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Active Tag Preview Badges */}
              {activeTagList.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-medium mr-1">
                    {t('Current tags:', 'موجودہ ٹیگز:')}
                  </span>
                  {activeTagList.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-medium"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="hover:text-destructive cursor-pointer ml-0.5"
                        title="Remove tag"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pinned Footer */}
        <DialogFooter className="px-6 py-3.5 border-t border-border/70 bg-muted/25 shrink-0 flex items-center justify-between sm:justify-between">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="text-destructive font-bold">*</span>
            <span>{t('Required legal fields', 'لازمی قانونی خانے')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={saving}
              className="h-8.5 text-xs font-medium"
            >
              {t('Cancel', 'منسوخ')}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={save}
              disabled={saving}
              className="h-8.5 text-xs font-semibold gap-1.5 shadow-sm min-w-[110px]"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>{t('Saving...', 'محفوظ ہو رہا ہے...')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{law ? t('Update Law', 'قانون اپڈیٹ کریں') : t('Save & Publish', 'قانون محفوظ کریں')}</span>
                </>
              )}
            </Button>
          </div>
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
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl bg-card">
        <DialogHeader className="px-6 py-4.5 border-b border-border/70 bg-muted/25 shrink-0">
          <div className="flex items-center gap-3.5 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
              <Tags className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-base font-bold text-foreground">
                {t('Create New Category', 'نئی قانونی قسم شامل کریں')}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t('Add a legal category or branch of law to organize statutes.', 'قوانین کی تقسیم کے لیے نیا شعبہ شامل کریں۔')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('Category Name (English) *', 'نام (انگریزی) *')}</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Constitutional Law"
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className={cn('text-xs font-semibold', lang === 'ur' && 'font-urdu')}>{t('Category Name (Urdu)', 'نام (اردو) *')}</Label>
            <Input
              value={form.nameUrdu}
              onChange={(e) => setForm({ ...form, nameUrdu: e.target.value })}
              placeholder={lang === 'ur' ? 'مثلاً آئینی قانون' : 'Urdu category name (optional) e.g. آئینی قانون'}
              dir="rtl"
              className={cn('h-9 text-xs text-right font-urdu')}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('Slug *', 'سلگ *')}</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="constitutional-law"
              className="h-9 text-xs font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('Theme Color Hex', 'رنگ کوڈ')}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="h-9 w-12 rounded cursor-pointer border border-border p-1 bg-background"
              />
              <Input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="h-9 text-xs font-mono flex-1"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('Description', 'تفصیل')}</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Brief description of this legal category..."
              className="text-xs leading-relaxed"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-3.5 border-t border-border/70 bg-muted/25 shrink-0 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving} className="h-8.5 text-xs">
            {t('Cancel', 'منسوخ')}
          </Button>
          <Button size="sm" onClick={save} disabled={saving} className="h-8.5 text-xs font-semibold gap-1.5 shadow-sm">
            {saving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>{t('Creating...', 'شامل ہو رہا ہے...')}</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>{t('Create Category', 'قسم شامل کریں')}</span>
              </>
            )}
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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl bg-card">
        <DialogHeader className="px-6 py-4.5 border-b border-border/70 bg-muted/25 shrink-0">
          <div className="flex items-center gap-3.5 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 shadow-xs">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-base font-bold text-foreground">
                {t('Add Lawyer / Legal Counsel', 'نیا وکیل شامل کریں')}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t('Register an advocate into the public verified directory.', 'تصدیق شدہ وکیل کا اندراج کریں۔')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('Name (English) *', 'نام (انگریزی) *')}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Advocate Ali Khan"
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className={cn('text-xs font-semibold', lang === 'ur' && 'font-urdu')}>{t('Name (Urdu)', 'نام (اردو)')}</Label>
              <Input
                value={form.nameUrdu}
                onChange={(e) => setForm({ ...form, nameUrdu: e.target.value })}
                placeholder={lang === 'ur' ? 'ایڈووکیٹ علی خان' : 'Urdu name (optional) e.g. علی خان'}
                dir="rtl"
                className={cn('h-9 text-xs text-right font-urdu')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('Slug *', 'سلگ *')}</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="ali-khan-advocate"
                className="h-9 text-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('City', 'شہر')}</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Lahore, Islamabad, Karachi"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('Email', 'ای میل')}</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="lawyer@example.com"
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('Phone', 'فون')}</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('Specializations', 'خصوصی شعبہ جات')}</Label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 border rounded-lg bg-muted/20 scrollbar-thin">
              {categories.map((c) => {
                const selected = form.specialization.includes(c.slug)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleSpecialization(c.slug)}
                    className={cn(
                      'text-[11px] px-2.5 py-1 rounded-md border transition-all cursor-pointer select-none',
                      selected
                        ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-xs'
                        : 'bg-background text-muted-foreground border-border hover:border-teal-500'
                    )}
                  >
                    {selected ? `✓ ${c.name}` : `+ ${c.name}`}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-border/50">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span>{t('Mark as Verified', 'تصدیق شدہ نشان زد کریں')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
              <span>{t('Mark as Featured', 'نمایاں نشان زد کریں')}</span>
            </label>
          </div>
        </div>

        <DialogFooter className="px-6 py-3.5 border-t border-border/70 bg-muted/25 shrink-0 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving} className="h-8.5 text-xs">
            {t('Cancel', 'منسوخ')}
          </Button>
          <Button size="sm" onClick={save} disabled={saving} className="h-8.5 text-xs font-semibold gap-1.5 shadow-sm">
            {saving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>{t('Saving...', 'محفوظ ہو رہا ہے...')}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{t('Save Lawyer', 'وکیل محفوظ کریں')}</span>
              </>
            )}
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
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl bg-card">
        <DialogHeader className="px-6 py-4.5 border-b border-border/70 bg-muted/25 shrink-0">
          <div className="flex items-center gap-3.5 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 shadow-xs">
              <FilePlus className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-base font-bold text-foreground">
                {t('Create Legal Template', 'نیا قانونی ٹیمپلیٹ بنائیں')}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t('Define contract draft text with placeholders like {{party_name}}.', 'ٹیمپلیٹ کا متن اور فیلڈز درج کریں۔')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('Title (English) *', 'عنوان (انگریزی) *')}</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Rent Agreement"
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className={cn('text-xs font-semibold', lang === 'ur' && 'font-urdu')}>{t('Title (Urdu)', 'عنوان (اردو)')}</Label>
              <Input
                value={form.titleUrdu}
                onChange={(e) => setForm({ ...form, titleUrdu: e.target.value })}
                placeholder={lang === 'ur' ? 'مثلاً کرایہ نامہ' : 'Urdu title (optional) e.g. کرایہ نامہ'}
                dir="rtl"
                className={cn('h-9 text-xs text-right font-urdu')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('Slug *', 'سلگ *')}</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="rent-agreement-format"
                className="h-9 text-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('Category', 'شعبہ')}</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm({ ...form, category: val })}
              >
                <SelectTrigger className="h-9 text-xs">
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

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('Template Body (use {{field}})', 'ٹیمپلیٹ کا متن')}</Label>
            <Textarea
              value={form.templateText}
              onChange={(e) => setForm({ ...form, templateText: e.target.value })}
              rows={4}
              className="text-xs font-mono leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('Fields Schema (JSON Array)', 'فیلڈز کی اسکیما')}</Label>
            <Textarea
              value={form.fieldsJson}
              onChange={(e) => setForm({ ...form, fieldsJson: e.target.value })}
              rows={4}
              className="text-xs font-mono leading-relaxed"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-3.5 border-t border-border/70 bg-muted/25 shrink-0 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving} className="h-8.5 text-xs">
            {t('Cancel', 'منسوخ')}
          </Button>
          <Button size="sm" onClick={save} disabled={saving} className="h-8.5 text-xs font-semibold gap-1.5 shadow-sm">
            {saving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>{t('Creating...', 'شامل ہو رہا ہے...')}</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>{t('Save Template', 'ٹیمپلیٹ محفوظ کریں')}</span>
              </>
            )}
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

  // Delete Target Modal State
  const [deleteTarget, setDeleteTarget] = React.useState<{
    id: string
    type: 'section' | 'amendment'
    name: string
  } | null>(null)

  // Delete Section
  const confirmDeleteSection = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sections?id=${id}`, { method: 'DELETE' })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Section deleted', 'دفعہ حذف ہو گئی'))
        loadDetails()
        onSaved()
      } else {
        toast.error(d.error || 'Failed to delete section')
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
  const confirmDeleteAmendment = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/amendments?id=${id}`, { method: 'DELETE' })
      const d = await res.json()
      if (d.ok) {
        toast.success(t('Amendment deleted', 'ترمیم حذف ہو گئی'))
        loadDetails()
        onSaved()
      } else {
        toast.error(d.error || 'Failed to delete amendment')
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
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
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
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
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
                            onClick={() => setDeleteTarget({ id: s.id, type: 'section', name: `Section ${s.sectionNumber}${s.title ? `: ${s.title}` : ''}` })}
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
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
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
                            onClick={() => setDeleteTarget({ id: a.id, type: 'amendment', name: `${a.amendmentTitle} (${a.amendmentYear})` })}
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

        {/* Delete Confirmation Modal for Sections / Amendments */}
        <ConfirmDeleteModal
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title={deleteTarget?.type === 'section' ? t('Delete Section', 'دفعہ حذف کریں') : t('Delete Amendment', 'ترمیم حذف کریں')}
          titleUrdu={deleteTarget?.type === 'section' ? 'دفعہ حذف کریں' : 'ترمیم حذف کریں'}
          itemName={deleteTarget?.name}
          itemType={deleteTarget?.type === 'section' ? 'Statute Section' : 'Legislative Amendment'}
          itemTypeUrdu={deleteTarget?.type === 'section' ? 'قانونی دفعہ' : 'قانونی ترمیم'}
          description={
            deleteTarget?.type === 'section'
              ? t('Are you sure you want to delete this section? This action is permanent.', 'کیا آپ واقعی یہ دفعہ حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہو سکتا۔')
              : t('Are you sure you want to delete this amendment record?', 'کیا آپ واقعی یہ ترمیم حذف کرنا چاہتے ہیں؟')
          }
          onConfirm={async () => {
            if (!deleteTarget) return
            if (deleteTarget.type === 'section') {
              await confirmDeleteSection(deleteTarget.id)
            } else {
              await confirmDeleteAmendment(deleteTarget.id)
            }
          }}
        />
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
      <DialogContent className="max-w-md p-0 overflow-hidden border-border/80 shadow-2xl rounded-2xl bg-card flex flex-col">
        <DialogHeader className="px-6 py-4.5 border-b border-border/70 bg-muted/25 shrink-0">
          <div className="flex items-center gap-3.5 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 shadow-xs">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-base font-bold text-foreground">
                {t('Add Newsletter Subscriber', 'نیا سبسکرائبر شامل کریں')}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {t('Manually register an email address to receive periodic legal updates.', 'قانونی اطلاعات وصول کرنے کے لیے ای میل شامل کریں۔')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('Email Address', 'ای میل ایڈریس')} *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lawyer@example.com"
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('Subscriber Name (Optional)', 'نام')}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Advocate Tariq"
              className="h-9 text-xs"
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
            <Label htmlFor="subActiveCheck" className="text-xs cursor-pointer font-medium">
              {t('Set subscriber status as Active', 'سبسکرائبر کی حیثیت فعال رکھیں')}
            </Label>
          </div>

          <DialogFooter className="px-0 pt-4 border-t border-border/70 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={saving} className="h-8.5 text-xs">
              {t('Cancel', 'منسوخ')}
            </Button>
            <Button type="submit" size="sm" disabled={saving} className="h-8.5 text-xs font-semibold gap-1.5 shadow-sm">
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>{t('Adding...', 'شامل ہو رہا ہے...')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{t('Add Subscriber', 'شامل کریں')}</span>
                </>
              )}
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

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 scrollbar-thin">
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
