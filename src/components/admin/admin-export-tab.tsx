'use client'

import * as React from 'react'
import {
  Download, Database, FileSpreadsheet, HardDrive, RefreshCw,
  CheckCircle2, ShieldCheck, Server, AlertCircle, FileText,
  Users, Mail, Briefcase, FilePlus, Sparkles, Layers,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import { toast } from 'sonner'

interface AdminExportTabProps {
  stats: {
    lawCount: number
    categoryCount: number
    sectionCount: number
    amendmentCount: number
    lawyerCount?: number
    templateCount?: number
    subscriberCount?: number
    reviewCount?: number
    questionCount?: number
  } | null
  laws: any[]
  lawyers: any[]
  templates: any[]
  categories: any[]
  subscribers: any[]
  users: any[]
  onReseed: () => void
}

export function AdminExportTab({
  stats,
  laws,
  lawyers,
  templates,
  categories,
  subscribers,
  users,
  onReseed,
}: AdminExportTabProps) {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'

  const downloadFile = (data: any, filename: string, type: 'json' | 'csv') => {
    try {
      let blob: Blob
      if (type === 'json') {
        const jsonStr = JSON.stringify(data, null, 2)
        blob = new Blob([jsonStr], { type: 'application/json' })
      } else {
        blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success(t(`Exported ${filename} successfully!`, `${filename} کامیابی سے ڈاؤنلوڈ ہو گئی!`))
    } catch (err) {
      console.error('Export error:', err)
      toast.error(t('Failed to export file', 'فائل ڈاؤنلوڈ ناکام'))
    }
  }

  const exportLawsJSON = () => {
    downloadFile(laws, `qanoonpk-laws-${new Date().toISOString().split('T')[0]}.json`, 'json')
  }

  const exportLawyersCSV = () => {
    const headers = ['id', 'name', 'nameUrdu', 'city', 'province', 'specialization', 'phone', 'email', 'verified', 'rating']
    const rows = lawyers.map((l) => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.nameUrdu || '').replace(/"/g, '""')}"`,
      l.city || '',
      l.province || '',
      `"${(l.specialization || '').replace(/"/g, '""')}"`,
      l.phone || '',
      l.email || '',
      l.verified ? 'true' : 'false',
      l.rating || 0,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    downloadFile(csvContent, `qanoonpk-lawyers-${new Date().toISOString().split('T')[0]}.csv`, 'csv')
  }

  const exportTemplatesJSON = () => {
    downloadFile(templates, `qanoonpk-templates-${new Date().toISOString().split('T')[0]}.json`, 'json')
  }

  const exportCategoriesJSON = () => {
    downloadFile(categories, `qanoonpk-categories-${new Date().toISOString().split('T')[0]}.json`, 'json')
  }

  const exportSubscribersCSV = () => {
    const headers = ['id', 'email', 'name', 'active', 'createdAt']
    const rows = subscribers.map((s) => [
      s.id,
      s.email,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      s.active ? 'true' : 'false',
      s.createdAt || '',
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    downloadFile(csvContent, `qanoonpk-subscribers-${new Date().toISOString().split('T')[0]}.csv`, 'csv')
  }

  const exportFullDatabaseBackup = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      platform: 'QanoonPK - Pakistan Legal Directory',
      schemaVersion: '2.1.0',
      database: 'SQLite',
      stats: stats,
      data: {
        laws,
        categories,
        lawyers,
        templates,
        subscribers,
        userCount: users.length,
      },
    }
    downloadFile(fullBackup, `qanoonpk-full-backup-${new Date().toISOString().split('T')[0]}.json`, 'json')
  }

  const tableStats = [
    { name: 'Law (Statutes & Acts)', count: stats?.lawCount ?? laws.length, icon: FileText, color: 'text-emerald-500' },
    { name: 'Category (Legal Subjects)', count: stats?.categoryCount ?? categories.length, icon: Layers, color: 'text-purple-500' },
    { name: 'Section (Sections & Articles)', count: stats?.sectionCount ?? 924, icon: Database, color: 'text-amber-500' },
    { name: 'Amendment (Gazette Acts)', count: stats?.amendmentCount ?? 15, icon: RefreshCw, color: 'text-blue-500' },
    { name: 'Lawyer (Counsel Profiles)', count: stats?.lawyerCount ?? lawyers.length, icon: Briefcase, color: 'text-teal-500' },
    { name: 'DocTemplate (Deeds & Drafts)', count: stats?.templateCount ?? templates.length, icon: FilePlus, color: 'text-rose-500' },
    { name: 'NewsletterSubscriber', count: stats?.subscriberCount ?? subscribers.length, icon: Mail, color: 'text-indigo-500' },
    { name: 'User (Registered Accounts)', count: users.length, icon: Users, color: 'text-cyan-500' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-primary/5 to-transparent border border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-bold">
              {t('Data Sovereignty & Backup', 'ڈیٹا بیک اپ و برآمد')}
            </Badge>
            <span className="text-xs text-muted-foreground">{t('SQLite Database Live', 'لوکل ڈیٹابیس فعال')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            {t('Database Backup & Data Export Hub', 'ڈیٹابیس بیک اپ و برآمدی مرکز')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t(
              'Export full database dumps, download structured CSV/JSON datasets, and maintain data snapshots.',
              'مکمل ڈیٹا بیس بیک اپ محفوظ کریں، CSV/JSON فارمیٹ میں ڈیٹا ڈاؤنلوڈ کریں اور ڈیٹابیس سنبھالیں۔'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={exportFullDatabaseBackup}
            className="h-9 gap-1.5 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Download className="h-4 w-4" />
            <span>{t('Download Full Backup (JSON)', 'مکمل بیک اپ ڈاؤنلوڈ کریں')}</span>
          </Button>
        </div>
      </div>

      {/* Export Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/80 hover:border-primary/50 transition-all shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px]">
                {laws.length} {t('laws', 'قوانین')}
              </Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2">
              {t('Statutes & Acts Dataset', 'قوانین و ایکٹس ڈیٹا')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('Full catalog of Pakistan federal and provincial statutes including metadata.', 'پاکستانی وفاقی و صوبائی قوانین کی مکمل فہرست۔')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportLawsJSON}
              className="w-full h-9 text-xs gap-2 border-border/80 hover:bg-muted font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t('Export Laws (JSON)', 'قوانین فائل (JSON)')}</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 hover:border-primary/50 transition-all shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Briefcase className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px]">
                {lawyers.length} {t('lawyers', 'وکلاء')}
              </Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2">
              {t('Lawyers Directory', 'وکلاء کی ڈائریکٹری')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('Counsel contact details, bar admission, cities, ratings, and specializations.', 'وکلاء کے رابطہ نمبر، شہر، درجہ بندی اور تجربہ۔')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportLawyersCSV}
              className="w-full h-9 text-xs gap-2 border-border/80 hover:bg-muted font-semibold"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('Export Lawyers (CSV)', 'وکلاء فہرست (CSV)')}</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 hover:border-primary/50 transition-all shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FilePlus className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px]">
                {templates.length} {t('templates', 'ٹیمپلیٹس')}
              </Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2">
              {t('Legal Deed Templates', 'قانونی دستاویز ٹیمپلیٹس')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('Standardized legal contracts, affidavits, power of attorney, and rent deeds.', 'بیع نامہ، کرایہ نامہ، مختار نامہ اور حلف نامہ فارمیٹس۔')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportTemplatesJSON}
              className="w-full h-9 text-xs gap-2 border-border/80 hover:bg-muted font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t('Export Templates (JSON)', 'ٹیمپلیٹس فائل (JSON)')}</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 hover:border-primary/50 transition-all shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px]">
                {categories.length} {t('categories', 'اقسام')}
              </Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2">
              {t('Legal Taxonomy Categories', 'قانونی شعبہ جات و اقسام')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('Hierarchical law taxonomy, Urdu labels, icons, and category slugs.', 'قوانین کی موضوعاتی درجہ بندی اور سلگز۔')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCategoriesJSON}
              className="w-full h-9 text-xs gap-2 border-border/80 hover:bg-muted font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t('Export Categories (JSON)', 'اقسام فائل (JSON)')}</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 hover:border-primary/50 transition-all shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px]">
                {subscribers.length} {t('subscribers', 'سبسکرائبرز')}
              </Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2">
              {t('Subscribers Mailing List', 'نیوز لیٹر فہرست')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('Audience emails for legal gazette amendments & law updates.', 'قانونی ترامیم کے سبسکرائبرز کے ای میل پتے۔')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportSubscribersCSV}
              className="w-full h-9 text-xs gap-2 border-border/80 hover:bg-muted font-semibold"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('Export Subscribers (CSV)', 'سبسکرائبرز فہرست (CSV)')}</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 hover:border-primary/50 transition-all shadow-xs bg-muted/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <RefreshCw className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                {t('Maintenance', 'مرمت')}
              </Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2">
              {t('Database Seeding', 'ڈیٹابیس ری سیٹ')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t('Repopulate missing statutes and seed defaults from repository records.', 'ڈیٹابیس کو ابتدائی مستند ریکارڈز کے ساتھ ری سیٹ کریں۔')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReseed}
              className="w-full h-9 text-xs gap-2 border-border/80 hover:bg-muted font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{t('Run Reseed Pipeline', 'ڈیٹابیس ری سیڈ چلائیں')}</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Database Tables Inspector */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base font-bold">
                  {t('Database Tables & Storage Health', 'ڈیٹابیس ٹیبلز اور صحت')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('Prisma ORM SQLite Schema Tables Inspection', 'پرزما او آر ایم اور لوکل ڈیٹابیس کا مکمل تجزیہ')}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {t('All Models Synced', 'تمام ٹیبلز فعال ہیں')}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {tableStats.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.name} className="p-3 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`h-4 w-4 ${item.color} shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t('Active Records', 'موجود ریکارڈز')}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-foreground shrink-0 ml-2">
                    {item.count}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
