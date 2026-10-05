'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Landmark, Search, ExternalLink, Calendar, FileText,
  CheckCircle2, AlertCircle, Info, ChevronRight, Scale,
  BookOpen, HelpCircle, Shield, ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/components/language-provider'

interface CourtPortal {
  id: string
  nameEn: string
  nameUr: string
  jurisdiction: string
  caseStatusUrl: string
  causeListUrl: string
  featuresEn: string[]
  featuresUr: string[]
  smsAlerts?: string
  guideEn: string
  guideUr: string
}

const COURT_PORTALS: CourtPortal[] = [
  {
    id: 'scp',
    nameEn: 'Supreme Court of Pakistan',
    nameUr: 'سپریم کورٹ آف پاکستان',
    jurisdiction: 'Apex Federal Court (اسلام آباد)',
    caseStatusUrl: 'https://www.supremecourt.gov.pk',
    causeListUrl: 'https://www.supremecourt.gov.pk/cause-list/',
    featuresEn: ['Online Case Status Inquiry', 'Daily & Weekly Roster / Cause Lists', 'Certified Copy Status', 'E-Court Video Links'],
    featuresUr: ['آن لائن کیس اسٹیٹس', 'روزانہ کاز لسٹ', 'نقلِ فیصلہ کی درخواست', 'ای کورٹ ویڈیو لنک'],
    smsAlerts: 'SMS alerts available on registered Advocate-on-Record mobile numbers',
    guideEn: 'Search by Case Type (Civil Petition / Criminal Appeal), Case Number, Year, or Party / Advocate on Record name.',
    guideUr: 'کیس نمبر، سال، فریق کا نام یا وکیل کے ذریعے سپریم کورٹ پورٹل پر تلاش کریں۔',
  },
  {
    id: 'lhc',
    nameEn: 'Lahore High Court (LHC) & Benches',
    nameUr: 'لاہور ہائی کورٹ اور بینچز (ملتان، راولپنڈی، بہاولپور)',
    jurisdiction: 'Punjab (پنجاب)',
    caseStatusUrl: 'https://data.lhc.gov.pk/case_status',
    causeListUrl: 'https://data.lhc.gov.pk/causelists',
    featuresEn: ['LHC CaseFlow System', 'SMS Case Alert Service', 'Digitized Judgments', 'Bench-wise Cause Lists (Multan, Rawalpindi, Bahawalpur)'],
    featuresUr: ['ایل ایچ سی کیس فلو سسٹم', 'مفت ایس ایم ایس الرٹ سروس', 'فیصلوں کا ڈیجیٹل ریکارڈ', 'تمام علاقائی بینچز کی لسٹیں'],
    smsAlerts: 'Send "LHC <Case Type> <Case No> <Year>" to 8848 for instant SMS status',
    guideEn: 'Select Principal Seat (Lahore) or Bench, choose Case Type (e.g. W.P. for Writ Petition), and enter year.',
    guideUr: 'لاہور سیٹ یا متعلقہ بینچ کا انتخاب کریں اور رٹ پٹیشن یا اپیل نمبر کے ذریعے معلومات پائیں۔',
  },
  {
    id: 'shc',
    nameEn: 'Sindh High Court (SHC) & Benches',
    nameUr: 'سندھ ہائی کورٹ اور بینچز (کراچی، سکھر، حیدرآباد، لاڑکانہ)',
    jurisdiction: 'Sindh (سندھ)',
    caseStatusUrl: 'https://sindhhighcourt.gov.pk/case_search.php',
    causeListUrl: 'https://sindhhighcourt.gov.pk/causelist.php',
    featuresEn: ['Case Search by CNIC / Party', 'Daily Bench Roaster', 'High Court Bar Case Notice', 'District Judiciary Portal Link'],
    featuresUr: ['شناختی کارڈ یا نام سے کیس تلاش', 'روزانہ کاز لسٹ', 'فیصلوں کی نقول', 'ماتحت عدالتوں کا پورٹل'],
    guideEn: 'Search by Case Category, Advocate Name, or litigant party name across Karachi, Sukkur, Hyderabad, and Larkana.',
    guideUr: 'کراچی پرنسپل سیٹ، سکھر، حیدرآباد اور لاڑکانہ بینچ کے تمام کیسز کی تلاش کریں۔',
  },
  {
    id: 'ihc',
    nameEn: 'Islamabad High Court (IHC)',
    nameUr: 'اسلام آباد ہائی کورٹ',
    jurisdiction: 'Federal Capital Territory (اسلام آباد)',
    caseStatusUrl: 'https://mis.ihc.gov.pk/case-status',
    causeListUrl: 'https://mis.ihc.gov.pk/daily-cause-list',
    featuresEn: ['Live MIS Case Tracking', 'Court Diary', 'Daily Supplementary Lists', 'Digital Roster'],
    featuresUr: ['ایم آئی ایس لائیو ٹریکنگ', 'کورٹ ڈائری', 'ضمنی کاز لسٹ', 'ڈیجیٹل روسٹر'],
    guideEn: 'Enter Case Category (e.g., W.P. 1234/2024) to view previous orders, interim stays, and next date of hearing.',
    guideUr: 'کیس کی کیٹیگری اور نمبر درج کریں اور جاری عبوری احکامات اور اگلی تاریخِ پیشی دیکھیں۔',
  },
  {
    id: 'phc',
    nameEn: 'Peshawar High Court (PHC)',
    nameUr: 'پشاور ہائی کورٹ اور بینچز (ایبٹ آباد، سوات، ڈی آئی خان، بنوں)',
    jurisdiction: 'Khyber Pakhtunkhwa (خیبر پختونخوا)',
    caseStatusUrl: 'https://peshawarhighcourt.gov.pk/app/site/case_status',
    causeListUrl: 'https://peshawarhighcourt.gov.pk/app/site/cause_list',
    featuresEn: ['Online Case Management', 'Mobile App (PHC e-Services)', 'Cause Lists by Judge', 'District Court Automation'],
    featuresUr: ['آن لائن کیس مینجمنٹ', 'پی ایچ سی موبائل ایپ', 'جج وائز کاز لسٹ', 'ڈسٹرکٹ کورٹس ریکارڈ'],
    guideEn: 'Access case status for Peshawar Principal Seat or Abbottabad, Mingora (Swat), D.I. Khan, and Bannu benches.',
    guideUr: 'پشاور، ایبٹ آباد، سوات اور ڈی آئی خان بینچز کے مقدمات کا باآسانی مشاہدہ کریں۔',
  },
  {
    id: 'bhc',
    nameEn: 'High Court of Balochistan (BHC)',
    nameUr: 'بلوچستان ہائی کورٹ اور بینچز (کوئٹہ، سبی، تربت)',
    jurisdiction: 'Balochistan (بلوچستان)',
    caseStatusUrl: 'https://bhc.gov.pk/case-management/case-status',
    causeListUrl: 'https://bhc.gov.pk/causelists',
    featuresEn: ['Case Search System', 'Weekly Motion / Regular Lists', 'District Judiciary Reports'],
    featuresUr: ['کیس تلاش کا نظام', 'موشن اور ریگولر لسٹیں', 'ماتحت عدالتوں کی رپورٹس'],
    guideEn: 'Search cases by Case Registration Number, Litigant Title, or Advocate name.',
    guideUr: 'کوئٹہ پرنسپل سیٹ یا سبی و مکران بینچ کے لیے تلاش کریں۔',
  },
]

const CASE_ABBREVIATIONS = [
  { abbr: 'W.P.', full: 'Writ Petition', urdu: 'رٹ پٹیشن (آئینی درخواست برائے بنیادی حقوق - دفعہ 199)', desc: 'Constitutional challenge against unlawful government action or denial of fundamental rights.' },
  { abbr: 'Crl. Misc.', full: 'Criminal Miscellaneous', urdu: 'فوجداری متفرق درخواست (ضمانت وغیرہ)', desc: 'Commonly used for Pre-Arrest and Post-Arrest bail applications and quashment of FIR.' },
  { abbr: 'C.M.A.', full: 'Civil Miscellaneous Application', urdu: 'دیوانی متفرق درخواست (حکمِ امتناعی / سٹے)', desc: 'Interim stay applications, injunctions, or bringing legal heirs on record.' },
  { abbr: 'R.F.A.', full: 'Regular First Appeal', urdu: 'باقاعدہ پہلی اپیل (ڈگری کے خلاف)', desc: 'First substantive appeal against a final decree or judgment of a Civil Court.' },
  { abbr: 'F.A.O.', full: 'First Appeal Against Order', urdu: 'اپیل برخلاف عبوری حکم', desc: 'Appeal challenging an interlocutory court order under Order 43 of CPC.' },
  { abbr: 'C.P.', full: 'Civil Petition for Leave to Appeal', urdu: 'سول پٹیشن برائے اجازتِ اپیل (سپریم کورٹ)', desc: 'Petition seeking leave of the Supreme Court to appeal against a High Court final judgment.' },
  { abbr: 'C.A.', full: 'Civil Appeal', urdu: 'سول اپیل (سپریم کورٹ)', desc: 'Full civil appeal pending adjudication before the Supreme Court of Pakistan.' },
]

import { Skeleton } from '@/components/ui/skeleton'

export default function CaseTrackerPage() {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'
  const [searchFilter, setSearchFilter] = React.useState('')
  const [portals, setPortals] = React.useState<CourtPortal[]>(COURT_PORTALS)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/case-tracker')
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setPortals(data.items)
        }
      })
      .catch((err) => console.error('Failed to load court portals:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredPortals = portals.filter((p) => {
    if (!searchFilter.trim()) return true
    const q = searchFilter.toLowerCase()
    return (
      p.nameEn.toLowerCase().includes(q) ||
      p.nameUr.includes(q) ||
      p.jurisdiction.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t('Home', 'ہوم')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/courts" className="hover:text-primary transition-colors">{t('Courts', 'عدالتیں')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{t('Case Status & Cause Lists', 'کیس اسٹیٹس و کاز لسٹ')}</span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-background to-primary/5 p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <Landmark className="h-3.5 w-3.5" />
              <span>{t('National Court Information System', 'قومی عدالتی معلومات و کیس ٹریکر پورٹل')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t('Pakistan Court Case Tracker & Daily Cause Lists', 'پاکستان عدالتی کیس ٹریکر اور روزانہ کاز لسٹیں')}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'Direct gateway to official Supreme Court, High Courts, and District Court online tracking portals. Check hearing dates, interim orders, cause list position, and understand Pakistani case numbers without agents.',
                'سپریم کورٹ اور تمام صوبائی ہائی کورٹس کے سرکاری پورٹلز کے براہِ راست لنکس۔ پیشی کی اگلی تاریخ، جاری احکامات، کاز لسٹ میں کیس کا نمبر اور عدالتی مخففات کی مکمل رہنمائی۔'
              )}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('Filter by court or province...', 'عدالت یا صوبے کے نام سے تلاش کریں...')}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 text-xs h-9 bg-background"
            />
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {t('Showing official high court databases', 'سرکاری اعلیٰ عدالتی ڈیٹا بیسز')}
          </span>
        </div>

        {/* SECTION 1: COURT PORTALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortals.map((portal) => (
            <Card key={portal.id} className="border-border/70 hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between bg-card">
              <CardHeader className="p-5 pb-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-medium bg-muted/40">
                    {portal.jurisdiction}
                  </Badge>
                  <Landmark className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle className="text-base font-bold text-foreground leading-snug">
                  {isUrdu ? portal.nameUr : portal.nameEn}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isUrdu ? portal.guideUr : portal.guideEn}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                {/* Features list */}
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                    {t('Portal Services:', 'دستیاب سہولیات:')}
                  </span>
                  <div className="grid grid-cols-1 gap-1 text-[11px] text-muted-foreground">
                    {(isUrdu ? portal.featuresUr : portal.featuresEn).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SMS alert box if exists */}
                {portal.smsAlerts && (
                  <div className="p-2 rounded-md bg-blue-500/10 text-[10px] text-blue-800 dark:text-blue-300">
                    <span className="font-semibold block">{t('SMS Alert Service:', 'ایس ایم ایس سروس:')}</span>
                    <span>{portal.smsAlerts}</span>
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                  <a
                    href={portal.caseStatusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>{t('Case Status', 'کیس اسٹیٹس')}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-80" />
                  </a>

                  <a
                    href={portal.causeListUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground text-xs font-medium transition-colors"
                  >
                    <span>{t('Cause List', 'کاز لسٹ')}</span>
                    <Calendar className="h-3 w-3 opacity-60" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SECTION 2: CASE NUMBER DECODER (Cheat Sheet) */}
        <Card className="border-border/70 shadow-xs bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{t('Pakistani Legal Case Number Abbreviations Decoder', 'پاکستانی عدالتی مخففات و کیس نمبرز کی تشریح')}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {t(
                    'What letters in your case receipt mean (e.g. W.P. No. 1234/2024, Crl. Misc. No. 567/2023)',
                    'کیس سلپ پر لکھے گئے حروف (مثلاً W.P.، C.M.A.، R.F.A.) کا قانونی مفہوم کیا ہوتا ہے؟'
                  )}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                CrPC / CPC
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CASE_ABBREVIATIONS.map((item) => (
                <div key={item.abbr} className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-primary">
                      {item.abbr}
                    </span>
                    <span className="text-[11px] font-semibold text-foreground">
                      {item.full}
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-urdu" dir="rtl">
                    {item.urdu}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: CITIZEN TIPS FOR COURT DAYS */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
            <Info className="h-4 w-4" />
            <span>{t('Citizen Tips for Case Tracking & Cause Lists in Pakistan:', 'کاز لسٹ دیکھنے اور پیشی کے اہم نکات:')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="space-y-1">
              <strong className="text-foreground block">1. {t('Check Supplementary List', 'ضمنی کاز لسٹ ضرور دیکھیں')}</strong>
              <p>{t('Daily cause lists are published around 4:00 PM for the next day. Always check the "Supplementary List" in the morning for urgent matters.', 'اگلے دن کی فہرست شام چار بجے شائع ہوتی ہے۔ صبح جاری ہونے والی سپلیمنٹری لسٹ بھی لازمی چیک کریں۔')}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-foreground block">2. {t('Know Your Serial Number', 'کیس کا سیریل نمبر')}</strong>
              <p>{t('Courts take up cases according to the serial number on the bench list (e.g. Motion Cases 1 to 20 are taken first at 9:00 AM).', 'عدالتیں سیریل نمبر کے مطابق کیس سنتی ہیں۔ موشن کیسز عام طور پر صبح 9 بجے سنے جاتے ہیں۔')}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-foreground block">3. {t('Certified Copy (Naqal)', 'نقلِ فیصلہ')}</strong>
              <p>{t('Whenever an interim stay order is issued, apply immediately at the Copying Agency (Copying Branch) for a certified copy.', 'جب بھی کوئی حکم امتناعی جاری ہو تو عدالت کی نقول برانچ سے فوری مصدقہ نقل حاصل کریں۔')}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
