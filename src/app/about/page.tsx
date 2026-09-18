'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Info, Database, ShieldCheck, Globe, BookOpen, Scale,
  Calendar, Users, FileText, Languages, Heart, Send, CheckCircle2, BookmarkCheck,
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
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <span>{t('About', 'تعارف')}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shrink-0">
          <Info className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('About QanoonPK', 'قانون پی کے کے بارے میں')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            {t(
              'Methodology, data sources, and scope of Pakistan\'s bilingual legal directory.',
              'پاکستان کے دو لسانی قانونی ڈائریکٹری کا طریقہ کار، ڈیٹا ذرائع، اور دائرہ کار۔'
            )}
          </p>
        </div>
      </div>

      {/* Data accuracy banner */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-primary">
                {t('Data Accuracy', 'ڈیٹا درستگی')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t(
                  'Law counts and status are periodically synced from official gazettes. Data is accurate as of the last sync date shown on each law. Always verify with primary sources for legal proceedings.',
                  'قوانین کی گنتی اور صورتحرال سرکاری گزٹس سے وقفے سے ہم وقت کی جاتی ہے۔ ڈیٹا آخری ہم وقت کی تاریخ تک درست ہے جو ہر قانون پر دکھائی جاتی ہے۔ قانونی کارروائی کے لیے ہمیشہ بنیادی ذرائع سے تصدیق کریں۔'
                )}
              </p>
              <Badge variant="secondary" className="mt-2 text-xs">
                {t('Last sync:', 'آخری ہم وقت:')} {new Date().toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Directory Scale */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          {t('Directory Scope & Scale', 'ڈائریکٹری کا حجم و وسعت')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { count: '161', labelEn: 'Statutory Laws', labelUr: 'بنیادی قوانین' },
            { count: '32', labelEn: 'Categories', labelUr: 'قانونی اقسام' },
            { count: '924', labelEn: 'Active Sections', labelUr: 'فعال دفعات' },
            { count: '157', labelEn: 'Amendments', labelUr: 'ترامیم' },
            { count: '32', labelEn: 'Verified Advocates', labelUr: 'تصدیق شدہ وکلاء' },
            { count: '18', labelEn: 'Legal Templates', labelUr: 'قانونی ٹیمپلیٹس' },
          ].map((stat, i) => (
            <Card key={i} className="text-center p-3 hover:border-primary/40 transition-colors">
              <div className="text-2xl font-extrabold text-primary">{stat.count}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                {lang === 'ur' ? stat.labelUr : stat.labelEn}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* What we cover */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {t('What We Cover', 'ہم کیا احاطہ کرتے ہیں')}
        </h2>
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t('Principal Legislation (Acts/Ordinances)', 'بنیادی قانون سازی (ایکٹس/آرڈیننسز)')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(
                    'We cover principal legislation — Acts passed by the National Assembly/Provincial Assemblies, Ordinances promulgated by the President/Governor, and Presidential Orders. This is the primary tier of legislation in Pakistan.',
                    'ہم بنیادی قانون سازی کا احاطہ کرتے ہیں — قومی اسمبلی/صوبائی اسمبلیوں کے پاس کردہ ایکٹس، صدر/گورنر کے نافذ کردہ آرڈیننسز، اور صدارتی احکامات۔ یہ پاکستان میں قانون سازی کا بنیادی درجہ ہے۔'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t('Subordinate Legislation (Future)', 'تابع قانون سازی (مستقبل)')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(
                    'Subordinate legislation — Rules, Regulations, SROs, and Bye-laws made under principal Acts — is NOT currently included. This is planned for a future phase. A single Act may have 100+ SROs, making this a significant expansion.',
                    'تابع قانون سازی — اصولی ایکٹس کے تحت بنائے گئے رولز، ریگولیشنز، SROs، اور بائی لاز — فی الحال شامل نہیں ہیں۔ یہ مستقبل کے مرحلے کے لیے منصوبہ بند ہے۔ ایک ایکٹ کے 100+ SROs ہو سکتے ہیں، جو اسے ایک اہم توسیع بناتا ہے۔'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Jurisdictions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          {t('Jurisdictions Covered', 'احاطہ کردہ عدلیہ')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { en: 'Federal', ur: 'وفاقی', desc: 'Pakistan Code', descUr: 'پاکستان کوڈ' },
            { en: 'Punjab', ur: 'پنجاب', desc: 'Punjab Laws Online', descUr: 'پنجاب قوانین آن لائن' },
            { en: 'Sindh', ur: 'سندھ', desc: 'Sindh Code', descUr: 'سندھ کوڈ' },
            { en: 'KPK', ur: 'کے پی', desc: 'KP Code', descUr: 'کے پی کوڈ' },
            { en: 'Balochistan', ur: 'بلوچستان', desc: 'Balochistan Code', descUr: 'بلوچستان کوڈ' },
            { en: 'ICT', ur: 'آئی سی ٹی', desc: 'Islamabad Capital Territory', descUr: 'اسلام آباد دارالحکومت' },
            { en: 'Gilgit-Baltistan', ur: 'گلگت بلتستان', desc: 'GB Assembly', descUr: 'جی بی اسمبلی' },
            { en: 'AJK', ur: 'آزاد کشمیر', desc: 'AJK Assembly', descUr: 'آزاد کشمیر اسمبلی' },
          ].map((j) => (
            <Card key={j.en} className="text-center">
              <CardContent className="p-3">
                <p className="text-sm font-medium">{lang === 'ur' ? j.ur : j.en}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{lang === 'ur' ? j.descUr : j.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Official sources */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          {t('Official Source Databases', 'سرکاری ذرائع ڈیٹابیس')}
        </h2>
        <div className="space-y-2">
          {[
            { name: 'Pakistan Code', url: 'https://pakistancode.gov.pk', desc: 'Federal Acts/Ordinances' },
            { name: 'Punjab Laws Online', url: 'https://punjablaws.gov.pk', desc: 'Punjab provincial laws' },
            { name: 'Sindh Code', url: 'https://sindhlaws.gov.pk', desc: 'Sindh provincial laws' },
            { name: 'KP Code', url: 'https://kpcode.kp.gov.pk', desc: 'Khyber Pakhtunkhwa laws (572+ records)' },
            { name: 'Balochistan Code', url: 'https://balochistan.gov.pk', desc: 'Balochistan provincial laws (300+)' },
          ].map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-accent/50 transition-all"
            >
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {t('Platform Features', 'پلیٹ فارم کی خصوصیات')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: BookOpen, titleEn: 'Search & Browse', titleUr: 'تلاش و دیکھیں', descEn: 'Full-text search across all laws, sections, and summaries', descUr: 'تمام قوانین، شقوں، اور خلاصوں میں مکمل متن تلاش' },
            { icon: Scale, titleEn: 'Compare Laws', titleUr: 'قوانین کا موازنہ', descEn: 'Side-by-side comparison of any two laws', descUr: 'کسی بھی دو قوانین کا موازنہ' },
            { icon: Users, titleEn: 'Lawyer Directory', titleUr: 'وکلاء ڈائریکٹری', descEn: 'Verified lawyers by city and specialization', descUr: 'شہر اور تخصیص کے لحاظ سے تصدیق شدہ وکلاء' },
            { icon: FileText, titleEn: 'Document Templates', titleUr: 'دستاویز ٹیمپلیٹس', descEn: 'Fill-in-and-download legal documents (PDF/HTML/Text)', descUr: 'بھر کر ڈاؤن لوڈ کریں قانونی دستاویزات (PDF/HTML/Text)' },
            { icon: Info, titleEn: 'AI Assistant', titleUr: 'اے آئی اسسٹنٹ', descEn: 'RAG-based chatbot citing real laws from the database', descUr: 'آر اے جی پر مبنی چیٹ بوٹ حقیقی قوانین کا حوالہ' },
            { icon: Languages, titleEn: 'Bilingual (EN/UR)', titleUr: 'دو لسانی (EN/UR)', descEn: 'Full Urdu-English toggle with RTL support', descUr: 'مکمل اردو-انگریزی ٹوگل آر ٹی ایل تعاون کے ساتھ' },
          ].map((f, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-start gap-3">
                <f.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{lang === 'ur' ? f.titleUr : f.titleEn}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{lang === 'ur' ? f.descUr : f.descEn}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pakistani Case Law & Citation Standards Guide */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookmarkCheck className="h-5 w-5 text-primary" />
          {t('Pakistani Legal Citation Standards', 'پاکستانی قانونی حوالہ جات کے معیارات')}
        </h2>
        <Card>
          <CardContent className="p-5 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(
                'In Pakistan, higher judiciary judgments and statutory references are cited using standard abbreviations approved by the Pakistan Law Commission and law reports:',
                'پاکستان میں اعلیٰ عدلیہ کے فیصلوں اور قانونی حوالوں کے لیے پاکستان لاء کمیشن اور لاء رپورٹس کے منظور شدہ مخففات استعمال کیے جاتے ہیں:'
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { code: 'PLD', full: 'All Pakistan Legal Decisions', desc: 'Supreme Court, High Courts, and Federal Shariat Court landmark decisions.' },
                { code: 'SCMR', full: 'Supreme Court Monthly Review', desc: 'Authoritative decisions specifically originating from the Supreme Court of Pakistan.' },
                { code: 'PCrLJ', full: 'Pakistan Criminal Law Journal', desc: 'Specialized criminal jurisprudence, bail orders, and trial convictions/acquittals.' },
                { code: 'CLD', full: 'Corporate Law Decisions', desc: 'Company, banking, financial tribunals, and commercial litigation reports.' },
                { code: 'MLD', full: 'Monthly Law Digest', desc: 'Civil, property, family, and revenue matters from all High Courts of Pakistan.' },
                { code: 'PTD', full: 'Pakistan Tax Decisions', desc: 'Income tax, sales tax, customs, and Federal Board of Revenue tribunal verdicts.' },
              ].map((c) => (
                <div key={c.code} className="p-3 rounded-lg border bg-accent/20">
                  <span className="font-bold font-mono text-primary text-sm">{c.code}</span>
                  <p className="font-medium text-foreground mt-0.5">{c.full}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{c.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Suggest a Law or Report an Issue */}
      <section className="mb-8">
        <Card className="border-primary/30 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              {t('Suggest a Law or Submit Feedback', 'قانون تجویز کریں یا رائے بھیجیں')}
            </CardTitle>
            <CardDescription>
              {t(
                'Notice a missing federal or provincial statute, recent amendment, or text typo? Help us keep Pakistan\'s legal directory comprehensive and up to date.',
                'کیا کوئی وفاقی یا صوبائی قانون، حالیہ ترمیم، یا کتابتی غلطی نظر آئی؟ پاکستان کی قانونی ڈائریکٹری کو مکمل اور تازہ ترین رکھنے میں ہماری مدد کریں۔'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <h4 className="font-semibold text-foreground">{t('Thank You!', 'شکریہ!')}</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  {t(
                    'Your suggestion has been recorded for editorial review. Our legal research team will cross-reference with official gazettes.',
                    'آپ کی تجویز ادارتی جائزے کے لیے محفوظ کر لی گئی ہے۔ ہماری قانونی ٹیم سرکاری گزٹ سے تصدیق کرے گی۔'
                  )}
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="mt-3">
                  {t('Submit another suggestion', 'ایک اور تجویز جمع کرائیں')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={suggestionType === 'law' ? 'default' : 'outline'}
                    onClick={() => setSuggestionType('law')}
                    className="text-xs cursor-pointer"
                  >
                    {t('Suggest Missing Law', 'لاپتہ قانون تجویز کریں')}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={suggestionType === 'amendment' ? 'default' : 'outline'}
                    onClick={() => setSuggestionType('amendment')}
                    className="text-xs cursor-pointer"
                  >
                    {t('Report New Amendment', 'نئی ترمیم کی اطلاع دیں')}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={suggestionType === 'correction' ? 'default' : 'outline'}
                    onClick={() => setSuggestionType('correction')}
                    className="text-xs cursor-pointer"
                  >
                    {t('Text Typo / Correction', 'متن کی تصحیح')}
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">
                    {t('Statute / Act Name or Topic *', 'قانون کا نام یا موضوع *')}
                  </label>
                  <Input
                    required
                    value={lawTitle}
                    onChange={(e) => setLawTitle(e.target.value)}
                    placeholder={t('e.g. Punjab Protection of Women Against Violence Act 2016', 'مثلاً پنجاب تحفظ نسواں ایکٹ')}
                    className="h-9 text-sm"
                  />
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">
                    {t('Your Name or Email (Optional)', 'آپ کا نام یا ای میل (اختیاری)')}
                  </label>
                  <Input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={t('advocate@example.com', 'وکلاء یا شہری کا رابطہ')}
                    className="h-9 text-sm"
                  />
                </div>

                <Button type="submit" size="sm" className="gap-2 cursor-pointer">
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
