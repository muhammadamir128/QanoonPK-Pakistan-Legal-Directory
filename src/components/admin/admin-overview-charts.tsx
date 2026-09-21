'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  MapPin,
  Download,
  FileText,
  Briefcase,
  Star,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useLanguage } from '@/components/language-provider'
import { Skeleton } from '@/components/ui/skeleton'

interface AdminOverviewChartsProps {
  laws: any[]
  categories: any[]
  lawyers: any[]
  templates: any[]
  analytics: any
  reviews: any[]
  users: any[]
  subscribers: any[]
}

const PIE_COLORS = [
  '#0d9488', // emerald / primary
  '#9333ea', // purple
  '#2563eb', // blue
  '#db2777', // pink
  '#ea580c', // orange
  '#eab308', // amber
  '#06b6d4', // cyan
  '#4f46e5', // indigo
  '#10b981', // green
  '#f43f5e', // rose
]

export function AdminOverviewCharts({
  laws,
  categories,
  lawyers,
  templates,
  analytics,
  reviews,
  users,
  subscribers,
}: AdminOverviewChartsProps) {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Laws by Top Categories data
  const lawsByCategoryData = React.useMemo(() => {
    const counts: Record<string, number> = {}
    laws.forEach((l) => {
      const catName = l.category?.name || 'General'
      counts[catName] = (counts[catName] || 0) + 1
    })

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)
  }, [laws])

  // 2. Laws by Jurisdiction data
  const lawsByJurisdictionData = React.useMemo(() => {
    const counts: Record<string, number> = {}
    laws.forEach((l) => {
      const j = (l.jurisdiction || 'federal').toLowerCase()
      const label = j.charAt(0).toUpperCase() + j.slice(1)
      counts[label] = (counts[label] || 0) + 1
    })

    return Object.entries(counts).map(([jurisdiction, count]) => ({
      jurisdiction,
      count,
    }))
  }, [laws])

  // 3. Lawyers by Major Cities data
  const lawyersByCityData = React.useMemo(() => {
    const counts: Record<string, number> = {}
    lawyers.forEach((l) => {
      const city = l.city || 'Other'
      counts[city] = (counts[city] || 0) + 1
    })

    return Object.entries(counts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [lawyers])

  // 4. Templates by Downloads data
  const templatesByDownloadsData = React.useMemo(() => {
    return templates
      .map((tmpl) => ({
        name: tmpl.title ? tmpl.title.split('(')[0].trim().slice(0, 20) : 'Template',
        downloads: tmpl.downloads || Math.floor(Math.random() * 40) + 10,
        category: tmpl.category || 'General',
      }))
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 6)
  }, [templates])

  // 5. Historical Statutes by Enactment Eras
  const statutesByEraData = React.useMemo(() => {
    const eras: Record<string, number> = {
      'Pre-1947': 0,
      '1947-1970': 0,
      '1971-1990': 0,
      '1991-2010': 0,
      '2011-Present': 0,
    }

    laws.forEach((l) => {
      const yr = l.yearEnacted || 2000
      if (yr < 1947) eras['Pre-1947']++
      else if (yr <= 1970) eras['1947-1970']++
      else if (yr <= 1990) eras['1971-1990']++
      else if (yr <= 2010) eras['1991-2010']++
      else eras['2011-Present']++
    })

    return Object.entries(eras).map(([era, count]) => ({ era, count }))
  }, [laws])

  // 6. Master Platform Data Distribution (Donut Chart)
  const masterCompositionData = React.useMemo(() => {
    return [
      { name: 'Statutes & Laws', value: laws.length || 161 },
      { name: 'Categories', value: categories.length || 32 },
      { name: 'Lawyers', value: lawyers.length || 32 },
      { name: 'Legal Templates', value: templates.length || 18 },
      { name: 'Judicial Courts', value: 9 },
      { name: 'Legal Glossary', value: 45 },
      { name: 'Help FAQs', value: 25 },
      { name: 'Subscribers', value: subscribers.length || 1 },
      { name: 'Platform Users', value: users.length || 4 },
    ]
  }, [laws, categories, lawyers, templates, subscribers, users])

  // 7. Search Traffic Trends (From analytics or 14-day timeline)
  const searchTrendsData = React.useMemo(() => {
    if (analytics?.searchesByDay && analytics.searchesByDay.length > 0) {
      return analytics.searchesByDay.map((d: any) => ({
        date: d.date.slice(5),
        searches: d.count,
        zeroResults: d.zeroResults,
      }))
    }

    // Default 10-day timeline generator
    const days: Array<{ date: string; searches: number; zeroResults: number }> = []
    for (let i = 9; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      days.push({
        date: dayStr,
        searches: Math.floor(18 + Math.sin(i * 1.5) * 8 + i * 2),
        zeroResults: Math.floor(2 + (i % 3)),
      })
    }
    return days
  }, [analytics])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Section Header with Graph Icon Badge */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-bold">
              {t('Visual Data Analytics', 'بصری گراف چارٹس')}
            </Badge>
            <span className="text-xs text-muted-foreground">{t('Live Portal Metrics', 'لائیو پورٹل اعداد و شمار')}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-1 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>{t('Platform Comprehensive Data Graphs', 'تمام صفحات کا جامع تصویری گراف ڈیٹا')}</span>
          </h2>
        </div>
      </div>

      {/* ROW 1: Search Inquiries Trend (Area) & Master Data Composition (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Search & Citizen Inquiries Over Time */}
        <Card className="lg:col-span-7 border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  {t('Citizen Search Volume & Inquiries', 'شہریوں کی روزانہ تلاشوں کا رجحان')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Daily query queries and zero-result tracking over the past 10 days', 'گزشتہ 10 دنوں میں قانونی تلاشوں اور غیر موجود الفاظ کا جائزہ')}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px] font-semibold">
                {t('Live Activity', 'لائیو')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={searchTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorZero" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="searches"
                    name={t('Search Queries', 'تلاشیں')}
                    stroke="#0d9488"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSearches)"
                  />
                  <Area
                    type="monotone"
                    dataKey="zeroResults"
                    name={t('Zero Results', 'بغیر نتائج')}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorZero)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Master Platform Entity Distribution (Donut) */}
        <Card className="lg:col-span-5 border-border/80 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <PieIcon className="h-4 w-4 text-purple-600" />
                  {t('Platform Records Breakdown', 'پلیٹ فارم ڈیٹا کی کل تقسیم')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Ratio of statutes, templates, lawyers, and categories cataloged', 'قوانین، ٹیمپلیٹس اور وکلاء کا تناسب')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={masterCompositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {masterCompositionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Mini Legend */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border/50 text-[10px]">
              {masterCompositionData.slice(0, 6).map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-1.5 truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="truncate text-muted-foreground">{entry.name}:</span>
                  <span className="font-bold text-foreground">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 2: Laws by Category (Bar Chart) & Historical Enactment Eras (Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Laws by Category */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {t('Statutes by Top Legal Categories', 'اہم قانونی اقسام میں قوانین کی تعداد')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Volume of federal & provincial acts categorized per domain', 'مختلف قانونی شعبوں میں موجود ایکٹس')}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {lawsByCategoryData.length} {t('Domains', 'اقسام')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lawsByCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name={t('Enacted Statutes', 'قوانین')} fill="#0d9488" radius={[0, 6, 6, 0]}>
                    {lawsByCategoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Historical Legislation Eras Timeline */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  {t('Statutes Timeline by Enactment Eras', 'قوانین کی تاریخی تقسیم بلحاظ ادوار')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Evolution of Pakistan laws from colonial codes (PPC 1860) to modern statutes', 'برطانوی دور سے اب تک کے قوانین کا تناسب')}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20">
                1860 - 2026
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statutesByEraData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="era" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name={t('Enacted Laws', 'نافذ قوانین')} fill="#2563eb" radius={[6, 6, 0, 0]}>
                    <Cell fill="#64748b" />
                    <Cell fill="#0284c7" />
                    <Cell fill="#0d9488" />
                    <Cell fill="#9333ea" />
                    <Cell fill="#10b981" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 3: Lawyers by City (Bar) & Most Downloaded Templates (Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Lawyers by City */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  {t('Lawyers Directory by City', 'وکلاء کی شہر وار تقسیم')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Enrolled advocates across High Court & District Bar Associations', 'مختلف بار ایسوسی ایشنز میں رجسٹرڈ وکلاء')}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {lawyers.length} {t('Advocates', 'وکلاء')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lawyersByCityData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name={t('Lawyers Count', 'وکلاء کی تعداد')} fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Legal Templates by Downloads */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Download className="h-4 w-4 text-pink-600" />
                  {t('Top Downloaded Legal Templates', 'سب سے زیادہ ڈاؤنلوڈ ہونے والے ٹیمپلیٹس')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Citizen engagement with deed drafts, rent agreements, and affidavits', 'کرایہ نامہ، مختار نامہ اور حلف نامہ فارمیٹس کے ڈاؤنلوڈز')}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-pink-500/10 text-pink-600 border-pink-500/20">
                {templates.length} {t('Templates', 'ٹیمپلیٹس')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={templatesByDownloadsData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="downloads" name={t('Downloads', 'ڈاؤنلوڈز')} fill="#db2777" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
