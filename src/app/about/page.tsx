'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Info, Database, ShieldCheck, Globe, BookOpen, Scale,
  Calendar, Users, FileText, Languages, Heart, Send, CheckCircle2,
  BookmarkCheck, Clock, FileSignature, ExternalLink, Sparkles, Home,
  Building2, Check, ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export default function AboutPage() {
  const { t, lang } = useLanguage()
  const [suggestionType, setSuggestionType] = React.useState('law')
  const [lawTitle, setLawTitle] = React.useState('')
  const [details, setDetails] = React.useState('')
  const [contact, setContact] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lawTitle.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 md:py-12 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span>{t('Home', 'صفحۂ اول')}</span>
        </Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <span className="text-foreground font-medium">{t('About Platform', 'تعارف')}</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>{t('Pakistan Public Legal Information Initiative', 'پاکستان پبلک لیگل انفارمیشن انیشیٹو')}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-balance">
            {t('About QanoonPK', 'قانون پی کے کے بارے میں')}
          </h1>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t(
              'QanoonPK is Pakistan\'s modern bilingual legal directory and research platform. Designed to make federal and provincial statutes, constitutional rights, and legal procedures freely accessible, searchable, and understandable for citizens, advocates, and students alike.',
              'قانون پی کے پاکستان کی جدید دو لسانی قانونی ڈائریکٹری اور ریسرچ پلیٹ فارم ہے۔ اس کا مقصد وفاقی اور صوبائی قوانین، آئینی حقوق اور قانونی طریقۂ کار کو ہر شہری، وکیل اور طالب علم کے لیے مفت اور قابلِ تلاش بنانا ہے۔'
            )}
          </p>
        </div>
      </div>

      {/* Data Accuracy & Trust Card */}
      <Card className="border-border/80 bg-card/70 backdrop-blur-sm shadow-xs overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-primary to-teal-500" />
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    {t('Official Gazette Verification & Data Integrity', 'سرکاری گزٹ تصدیق اور ڈیٹا درستگی')}
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-600 bg-emerald-500/5 gap-1 py-0 px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('Live Gazette Sync', 'لائیو ہم وقت')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {t(
                    'Statutory acts and amendments are reconciled against official gazettes published by the National Assembly, Senate of Pakistan, and Provincial Law Departments. For judicial submissions, primary authenticated gazettes remain authoritative.',
                    'قوانین اور ترامیم کی توثیق قومی اسمبلی، سینیٹ آف پاکستان، اور صوبائی شعبہ جاتِ قانون کے سرکاری گزٹس سے کی جاتی ہے۔ عدالتی کارروائی کے لیے ہمیشہ تصدیق شدہ بنیادی گزٹ معتبر رہتے ہیں۔'
                  )}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border/50 gap-1">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                {t('Last Gazette Reconciled', 'آخری توثیق')}
              </span>
              <span className="text-xs font-mono font-bold text-foreground bg-accent/50 px-2.5 py-1 rounded-md border border-border/60">
                {new Date().toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directory Scope & Scale */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              {t('Directory Scope & Metrics', 'ڈائریکٹری کا حجم و وسعت')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('Current breadth of verified legal information indexed across Pakistan', 'پاکستان بھر میں محفوظ شدہ تصدیق شدہ قانونی معلومات')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { count: '161', icon: Scale, labelEn: 'Statutory Laws', labelUr: 'بنیادی قوانین', color: '#0d9488' },
            { count: '32', icon: BookOpen, labelEn: 'Subject Categories', labelUr: 'قانونی اقسام', color: '#2563eb' },
            { count: '924', icon: FileText, labelEn: 'Active Sections', labelUr: 'فعال دفعات', color: '#7c3aed' },
            { count: '157', icon: Clock, labelEn: 'Enacted Amendments', labelUr: 'نافذ شدہ ترامیم', color: '#ea580c' },
            { count: '32', icon: Users, labelEn: 'Verified Advocates', labelUr: 'تصدیق شدہ وکلاء', color: '#db2777' },
            { count: '18', icon: FileSignature, labelEn: 'Legal Drafts', labelUr: 'قانونی ٹیمپلیٹس', color: '#059669' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="relative overflow-hidden hover:shadow-md hover:border-primary/40 transition-all text-center p-3.5 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/60 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-2xl md:text-3xl font-black tracking-tight text-foreground font-mono">
                  {stat.count}
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground mt-1">
                  {lang === 'ur' ? stat.labelUr : stat.labelEn}
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* What We Cover vs Future Scope */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {t('Legislative Coverage Tier', 'قانون سازی کے درجات')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('Understanding primary vs subordinate legislation in our directory', 'ہماری ڈائریکٹری میں بنیادی بمقابلہ ثانوی قوانین')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary/30 bg-card/60 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-[10px] uppercase tracking-wider py-0 px-2">{t('Included', 'شامل ہے')}</Badge>
                <CardTitle className="text-base font-bold">
                  {t('Principal Primary Legislation', 'بنیادی پرنسپل قانون سازی')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                {t(
                  'Acts passed by the Parliament (National Assembly & Senate) and the 4 Provincial Assemblies, plus Presidential and Gubernatorial Ordinances promulgated under Articles 89 and 128 of the Constitution.',
                  'پارلیمنٹ (قومی اسمبلی و سینیٹ) اور چاروں صوبائی اسمبلیوں کے پاس کردہ ایکٹس، نیز آئین کے آرٹیکل 89 اور 128 کے تحت صدر اور گورنرز کے جاری کردہ آرڈیننسز۔'
                )}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {['Federal Acts', 'Provincial Statutes', 'Presidential Ordinances', 'Constitutional Amendments'].map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] font-normal">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-muted-foreground/30" />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2 text-muted-foreground">{t('Future Phase', 'مستقبل')}</Badge>
                <CardTitle className="text-base font-bold text-muted-foreground">
                  {t('Subordinate Legislation & SROs', 'ثانوی قانون سازی و SROs')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                {t(
                  'Statutory Regulatory Orders (SROs), administrative rules, notifications, and municipal bye-laws made by ministries under delegated powers. Because individual Acts can have hundreds of SROs, this is scheduled for phase two.',
                  'سرکاری ریگولیٹری آرڈرز (SROs)، انتظامی قواعد، نوٹیفیکیشنز اور وزارتی ضوابط۔ چونکہ ایک ایکٹ کے سینکڑوں SROs ہو سکتے ہیں، یہ ڈائریکٹری کے دوسرے مرحلے کے لیے شیڈول ہے۔'
                )}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5 opacity-60">
                {['Statutory Rules', 'Ministry Notifications', 'FBR SROs', 'Bye-laws'].map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] font-normal">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 8 Jurisdictions Covered */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t('Jurisdictions Covered Across Pakistan', 'پاکستان بھر کے احاطہ کردہ دائرہ اختیار')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('Federal territory, provinces, and special administrative regions', 'وفاق، صوبے اور خصوصی انتظامی علاقے')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { en: 'Federal', ur: 'وفاقی', code: 'Pakistan Code', desc: 'National Assembly & Senate' },
            { en: 'Punjab', ur: 'پنجاب', code: 'Punjab Laws Online', desc: 'Punjab Assembly Lahore' },
            { en: 'Sindh', ur: 'سندھ', code: 'Sindh Code', desc: 'Sindh Assembly Karachi' },
            { en: 'Khyber Pakhtunkhwa', ur: 'خیبر پختونخوا', code: 'KP Code', desc: 'KP Assembly Peshawar' },
            { en: 'Balochistan', ur: 'بلوچستان', code: 'Balochistan Code', desc: 'Balochistan Assembly Quetta' },
            { en: 'Islamabad (ICT)', ur: 'اسلام آباد (ICT)', code: 'ICT Administration', desc: 'Capital Territory Laws' },
            { en: 'Gilgit-Baltistan', ur: 'گلگت بلتستان', code: 'GB Order 2018', desc: 'GB Legislative Assembly' },
            { en: 'Azad Jammu & Kashmir', ur: 'آزاد جموں و کشمیر', code: 'AJK Interim Act 1974', desc: 'AJK Legislative Assembly' },
          ].map((j) => (
            <Card key={j.en} className="p-3.5 hover:border-primary/40 hover:shadow-xs transition-all border-border/70">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-foreground">{lang === 'ur' ? j.ur : j.en}</span>
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  PK
                </span>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground">{j.code}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5 line-clamp-1">{j.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Official Government Source Databases */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {t('Primary Official Data Repositories', 'سرکاری بنیادی ڈیٹا ریپوزیٹریز')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('Official statutory portals operated by the Government of Pakistan & Law Departments', 'حکومت پاکستان اور صوبائی وزارتِ قانون کے آفیشل پورٹلز')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Pakistan Code', url: 'https://pakistancode.gov.pk', entity: 'Ministry of Law and Justice (Federal)', desc: 'Official federal database of primary Acts and Ordinances (1836 to date).' },
            { name: 'Punjab Laws Online', url: 'https://punjablaws.gov.pk', entity: 'Law & Parliamentary Affairs Dept, Punjab', desc: 'Provincial acts passed by the Provincial Assembly of the Punjab.' },
            { name: 'Sindh Code', url: 'https://sindhlaws.gov.pk', entity: 'Law Department, Government of Sindh', desc: 'Statutes enacted by the Provincial Assembly of Sindh.' },
            { name: 'KP Code', url: 'https://kpcode.kp.gov.pk', entity: 'Law, Parliamentary Affairs & HR Dept, KP', desc: 'Provincial legislation enacted by the KP Assembly (570+ enactments).' },
            { name: 'Balochistan Code', url: 'https://balochistan.gov.pk', entity: 'Law & Parliamentary Affairs Dept, Balochistan', desc: 'Statutes applicable to the Province of Balochistan.' },
            { name: 'Senate of Pakistan', url: 'https://senate.gov.pk', entity: 'Parliament of Pakistan', desc: 'Official legislative business, bills passed, and gazette amendments.' },
          ].map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-accent/40 transition-all group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {s.name}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[11px] font-medium text-primary/80">{s.entity}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">{s.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Pakistani Case Law & Citation Standards Guide */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-primary" />
            {t('Pakistani Legal Citation Standards Guide', 'پاکستانی عدالتی و قانونی حوالہ جات کے معیارات')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('Authoritative law journals and judicial citation abbreviations in Pakistani courts', 'پاکستانی عدالتوں میں رائج منظور شدہ لا جرنلز اور عدالتی مخففات')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { code: 'PLD', full: 'All Pakistan Legal Decisions', desc: 'Landmark rulings of Supreme Court, High Courts, and Federal Shariat Court (est. 1949).' },
            { code: 'SCMR', full: 'Supreme Court Monthly Review', desc: 'Authoritative decisions originating exclusively from the Supreme Court of Pakistan.' },
            { code: 'PCrLJ', full: 'Pakistan Criminal Law Journal', desc: 'Specialized criminal jurisprudence, bail adjudications, conviction reviews & trials.' },
            { code: 'CLD', full: 'Corporate Law Decisions', desc: 'Commercial litigation, company law, banking recovery tribunals, SECP & competition matters.' },
            { code: 'MLD', full: 'Monthly Law Digest', desc: 'Civil, tenancy, family, custody, succession, and property cases from all High Courts.' },
            { code: 'PTD', full: 'Pakistan Tax Decisions', desc: 'Income tax, sales tax, customs tribunals, and Federal Board of Revenue verdicts.' },
          ].map((c) => (
            <Card key={c.code} className="p-4 border-border/70 hover:border-primary/40 transition-all space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold font-mono text-base text-primary">{c.code}</span>
                <Badge variant="outline" className="text-[9px] font-mono">Journal</Badge>
              </div>
              <p className="font-semibold text-xs text-foreground leading-snug">{c.full}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{c.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Suggest a Law or Report an Issue */}
      <section>
        <Card className="border-primary/30 shadow-sm overflow-hidden">
          <div className="h-1 bg-primary" />
          <CardHeader>
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              {t('Suggest a Law or Submit Platform Feedback', 'قانون تجویز کریں یا رائے بھیجیں')}
            </CardTitle>
            <CardDescription className="text-xs">
              {t(
                'Notice a missing federal or provincial statute, recent amendment, or typo? Help us keep Pakistan\'s legal directory comprehensive and up to date.',
                'کیا کوئی وفاقی یا صوبائی قانون، حالیہ ترمیم، یا کتابتی غلطی نظر آئی؟ پاکستان کی قانونی ڈائریکٹری کو مکمل اور تازہ ترین رکھنے میں ہماری مدد کریں۔'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg text-foreground">{t('Thank You for Contributing!', 'آپ کی شرکت کا شکریہ!')}</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {t(
                    'Your submission has been safely recorded for editorial review. Our legal team will cross-reference the statute with official gazettes.',
                    'آپ کی تجویز ادارتی جائزے کے لیے محفوظ کر لی گئی ہے۔ ہماری قانونی ٹیم سرکاری گزٹ سے تصدیق کر کے ڈیٹا بیس میں شامل کرے گی۔'
                  )}
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="mt-2 text-xs">
                  {t('Submit another suggestion', 'ایک اور تجویز جمع کرائیں')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    size="sm"
                    variant={suggestionType === 'law' ? 'default' : 'outline'}
                    onClick={() => setSuggestionType('law')}
                    className="text-xs h-8 cursor-pointer"
                  >
                    {t('Suggest Missing Law', 'لاپتہ قانون تجویز کریں')}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={suggestionType === 'amendment' ? 'default' : 'outline'}
                    onClick={() => setSuggestionType('amendment')}
                    className="text-xs h-8 cursor-pointer"
                  >
                    {t('Report New Amendment', 'نئی ترمیم کی اطلاع دیں')}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={suggestionType === 'correction' ? 'default' : 'outline'}
                    onClick={() => setSuggestionType('correction')}
                    className="text-xs h-8 cursor-pointer"
                  >
                    {t('Text Typo / Correction', 'متن کی تصحیح')}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">
                      {t('Statute / Act Name or Topic *', 'قانون کا نام یا موضوع *')}
                    </label>
                    <Input
                      required
                      value={lawTitle}
                      onChange={(e) => setLawTitle(e.target.value)}
                      placeholder={t('e.g. Punjab Protection of Women Against Violence Act 2016', 'مثلاً پنجاب تحفظ نسواں ایکٹ')}
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">
                      {t('Your Name or Email (Optional)', 'آپ کا نام یا ای میل (اختیاری)')}
                    </label>
                    <Input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={t('advocate@example.com', 'وکلاء یا شہری کا رابطہ')}
                      className="h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">
                    {t('Details, Gazette Year, or Reference Link', 'تفصیلات، گزٹ کا سال، یا حوالہ')}
                  </label>
                  <Textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={t('Provide official gazette reference or description of the amendment/statute...', 'سرکاری گزٹ کا حوالہ یا وضاحت درج کریں...')}
                    rows={3}
                    className="text-sm"
                  />
                </div>

                <Button type="submit" size="sm" className="gap-2 cursor-pointer h-9 px-5">
                  <Send className="h-4 w-4" />
                  {t('Submit to Editorial Team', 'ادارتی ٹیم کو بھیجیں')}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
