'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BellRing, Calendar, Sparkles, Filter, ExternalLink,
  ChevronRight, ArrowRight, Scale, BookText, FileCheck,
  Shield, Info, CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/components/language-provider'

interface LegislativeUpdate {
  id: string
  titleEn: string
  titleUr: string
  year: number
  dateEn: string
  dateUr: string
  jurisdiction: 'Federal' | 'Punjab' | 'Sindh' | 'KPK' | 'Balochistan'
  gazetteRef: string
  status: 'Enacted' | 'Ordinance' | 'Amendment'
  summaryEn: string
  summaryUr: string
  keyChangesEn: string[]
  keyChangesUr: string[]
  lawSlug?: string
}

const UPDATES: LegislativeUpdate[] = [
  {
    id: '26th-amendment',
    titleEn: 'Constitution (Twenty-Sixth Amendment) Act, 2024',
    titleUr: 'آئینِ پاکستان (چھبیسویں ترمیم) ایکٹ 2024',
    year: 2024,
    dateEn: 'October 21, 2024',
    dateUr: '21 اکتوبر 2024',
    jurisdiction: 'Federal',
    gazetteRef: 'Gazette of Pakistan, Extra., Part I, Act No. XXVI of 2024',
    status: 'Enacted',
    summaryEn: 'Historic constitutional amendment creating Constitutional Benches in the Supreme Court and High Courts, reforming the Judicial Commission of Pakistan (JCP), and establishing parliamentary evaluation for top judicial appointments.',
    summaryUr: 'سپریم کورٹ اور ہائی کورٹس میں آئینی بینچز کا قیام، جوڈیشل کمیشن کی تشکیل نو اور چیف جسٹس آف پاکستان کے تقرر کے لیے پارلیمانی کمیٹی کا نیا طریقہ کار۔',
    keyChangesEn: [
      'Establishment of separate Constitutional Benches in Supreme Court & High Courts for Article 184(3) & 199 petitions.',
      'Chief Justice of Pakistan to be appointed from a 3-member senior-most panel by a Special Parliamentary Committee.',
      'Chief Justice tenure capped at fixed 3 years.',
      'Annual performance evaluation of High Court judges introduced.',
    ],
    keyChangesUr: [
      'آئینی رٹس اور دفعہ 184(3) کے مقدمات کے لیے الگ آئینی بینچز قائم کیے گئے۔',
      'چیف جسٹس کا تقرر 3 سینیئر ترین ججز میں سے خصوصی پارلیمانی کمیٹی کرے گی۔',
      'چیف جسٹس کی مدتِ ملازمت زیادہ سے زیادہ 3 سال مقرر۔',
      'ہائی کورٹ کے ججز کی سالانہ کارکردگی کا جائزہ لینے کا طریقہ کار۔',
    ],
    lawSlug: 'constitution-of-the-islamic-republic-of-pakistan-1973',
  },
  {
    id: 'finance-act-2024',
    titleEn: 'Finance Act, 2024 (Taxation Overhaul & FBR Reforms)',
    titleUr: 'فنانس ایکٹ 2024 (نئے ٹیکس سلیبس اور نان فائلرز پر پابندیاں)',
    year: 2024,
    dateEn: 'June 30, 2024',
    dateUr: '30 جون 2024',
    jurisdiction: 'Federal',
    gazetteRef: 'Gazette of Pakistan, Extra., Part I, Act No. X of 2024',
    status: 'Enacted',
    summaryEn: 'Comprehensive federal budget enactment revising advance income tax slabs under Section 236C (sellers) and Section 236K (buyers), increased taxes on property transactions, and strict restrictions on non-filers.',
    summaryUr: 'پراپرٹی کی خرید و فروخت پر ودہولڈنگ ٹیکس کی نئی شرح (دفعہ 236-C اور 236-K)، نان فائلرز پر سخت پابندیاں اور انکم ٹیکس سلیبس میں ترامیم۔',
    keyChangesEn: [
      'Section 236K Advance Tax for property buyers set up to 12% for non-filers.',
      'Digital sales tax invoice integration made mandatory for tier-1 retailers.',
      'Overseas travel ban and mobile SIM block provisions for habitual non-filers.',
    ],
    keyChangesUr: [
      'نان فائلرز کے لیے پراپرٹی خریدنے پر ٹیکس 12 فیصد تک بڑھا دیا گیا۔',
      'ریٹیلرز کے لیے پی او ایس ڈیجیٹل انوائسنگ لازمی قرار۔',
      'نان فائلرز کے سم کارڈ بلاک اور بیرون ملک سفر پر پابندی کے اقدامات۔',
    ],
    lawSlug: 'income-tax-ordinance-2001',
  },
  {
    id: 'punjab-defamation-2024',
    titleEn: 'Punjab Defamation Act, 2024',
    titleUr: 'پنجاب ہتکِ عزت ایکٹ 2024 (خصوصی ٹربیونلز کا قیام)',
    year: 2024,
    dateEn: 'June 08, 2024',
    dateUr: '08 جون 2024',
    jurisdiction: 'Punjab',
    gazetteRef: 'Punjab Gazette (Extraordinary), Act XXII of 2024',
    status: 'Enacted',
    summaryEn: 'Enactment establishing Special Defamation Tribunals across Punjab with a statutory requirement to decide cases within 180 days, minimum general damages of Rs. 3 million, and regulation of fake news across social media.',
    summaryUr: 'پنجاب بھر میں ہتک عزت کے خصوصی ٹربیونلز، 180 دن میں مقدمے کا حتمی فیصلہ، کم از کم 30 لاکھ روپے ہرجانہ اور سوشل میڈیا پر فیک نیوز کے خلاف قانونی کارروائی۔',
    keyChangesEn: [
      'Special Defamation Tribunals mandated to conclude trials within 180 days.',
      'Minimum standard general damages of PKR 3,000,000 without requiring proof of actual pecuniary loss.',
      'Covers digital defamation on WhatsApp, YouTube, X (Twitter), and Facebook.',
    ],
    keyChangesUr: [
      '180 دن کے اندر ہتک عزت کے مقدمے کا لازمی فیصلہ۔',
      'کم از کم 30 لاکھ روپے کا بنیادی ہرجانہ مقرر۔',
      'سوشل میڈیا اور ڈیجیٹل پلیٹ فارمز پر جھوٹی مہم کے خلاف فوری ایکشن۔',
    ],
    lawSlug: 'defamation-ordinance-2002',
  },
  {
    id: 'nab-amendment-2024',
    titleEn: 'National Accountability (Amendment) Act, 2024',
    titleUr: 'قومی احتساب (نیب ترمیم) ایکٹ 2024',
    year: 2024,
    dateEn: 'August 10, 2024',
    dateUr: '10 اگست 2024',
    jurisdiction: 'Federal',
    gazetteRef: 'Gazette of Pakistan, Extra., Part I, Act No. XVIII of 2024',
    status: 'Enacted',
    summaryEn: 'Revision of NAB powers: statutory threshold for NAB corruption jurisdiction restored to Rs. 500 million, physical remand limit adjusted, and transfer of non-cognizable financial inquiries to FIA.',
    summaryUr: 'نیب کے دائرہ اختیار کی حد 50 کروڑ روپے بحال، جسمانی ریمانڈ کے قواعد اور غیر متعلقہ مالیاتی کیسز کی ایف آئی اے اور اینٹی کرپشن کو منتقلی۔',
    keyChangesEn: [
      'Minimum financial threshold for NAB intervention set at PKR 500 Million.',
      'Cabinet decisions and procedural irregularities without personal financial benefit excluded.',
      'Remand period capped and provisions for expeditious disposal restored.',
    ],
    keyChangesUr: [
      'نیب کی کارروائی کے لیے کم از کم رقم کی حد 50 کروڑ روپے مقرر۔',
      'کابینہ کے پالیسی فیصلوں کو نیب دائرہ کار سے خارج کیا گیا۔',
      'ریمانڈ کے قواعد میں ترمیم اور ٹرائل کی مدت کا تعین۔',
    ],
    lawSlug: 'national-accountability-ordinance-1999',
  },
  {
    id: 'criminal-amendment-2023',
    titleEn: 'Criminal Laws (Amendment) Act, 2023',
    titleUr: 'مجموعہ قوانینِ فوجداری (ترمیمی) ایکٹ 2023',
    year: 2023,
    dateEn: 'July 28, 2023',
    dateUr: '28 جولائی 2023',
    jurisdiction: 'Federal',
    gazetteRef: 'Gazette of Pakistan, Extra., Part I, Act No. XXXIX of 2023',
    status: 'Enacted',
    summaryEn: 'Statutory modifications to Pakistan Penal Code and CrPC enhancing punishments for public indecency, online blackmailing, and accepting digital audio/video evidence under Qanun-e-Shahadat Order.',
    summaryUr: 'تعزیراتِ پاکستان اور ضابطہ فوجداری میں ترامیم: خواتین اور بچوں کے خلاف بلیک میلنگ پر سخت سزائیں اور ڈیجیٹل آڈیو ویڈیو ثبوتوں کی عدالتی قبولیت۔',
    keyChangesEn: [
      'Stringent non-bailable penalties for cyber harassment and image morphing.',
      'Modern forensic evidence given statutory recognition in trial courts.',
      'Police investigation guidelines upgraded for forensic collection.',
    ],
    keyChangesUr: [
      'سوشل میڈیا پر خواتین کی تصاویر تبدیل کرنے پر ناقابلِ ضمانت سزائیں۔',
      'عدالتوں میں جدید فرانزک اور ڈیجیٹل آڈیو ویڈیو ثبوتوں کی منظوری۔',
      'پولیس تفتیش کے جدید سائنسی قواعد و ضوابط۔',
    ],
    lawSlug: 'pakistan-penal-code-1860',
  },
]

import { Skeleton } from '@/components/ui/skeleton'

export default function UpdatesPage() {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'
  const [selectedJurisdiction, setSelectedJurisdiction] = React.useState<string>('all')
  const [selectedYear, setSelectedYear] = React.useState<string>('all')
  const [updates, setUpdates] = React.useState<UpdateItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedJurisdiction !== 'all') {
      params.set('jurisdiction', selectedJurisdiction)
    }
    if (selectedYear !== 'all') {
      params.set('year', selectedYear)
    }
    fetch(`/api/updates?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setUpdates(data.items || [])
      })
      .catch((err) => console.error('Failed to load legal updates:', err))
      .finally(() => setLoading(false))
  }, [selectedJurisdiction, selectedYear])

  const filteredUpdates = updates

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t('Home', 'ہوم')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{t('Gazette & Legal Updates', 'نئے قوانین و گزٹ الرٹس')}</span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-amber-500/5 p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <BellRing className="h-3.5 w-3.5" />
              <span>{t('Pakistan Legislative Tracker & Gazette Alerts', 'پاکستان قانونی گزٹ اور ترامیم ٹریکر')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t('Official Gazette & Legislative Updates', 'نئے منظور شدہ قوانین اور گزٹ نوٹیفکیشنز')}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'Track recently enacted Acts, Constitutional Amendments, and provincial ordinances published in the official Gazette of Pakistan with citizen-friendly summaries and direct statute links.',
                'پارلیمنٹ اور صوبائی اسمبلیوں سے پاس ہونے والے تازہ ترین قوانین، آئینی ترامیم، اور گزٹ نوٹیفکیشنز کا آسان خلاصہ اور براہ راست قانونی لنکس۔'
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground mr-1">{t('Jurisdiction:', 'علاقہ:')}</span>
            {['all', 'Federal', 'Punjab', 'Sindh'].map((jur) => (
              <button
                key={jur}
                onClick={() => setSelectedJurisdiction(jur)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium ${
                  selectedJurisdiction === jur
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted hover:bg-accent text-muted-foreground'
                }`}
              >
                {jur === 'all' ? t('All', 'تمام') : jur}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">{t('Year:', 'سال:')}</span>
            {['all', '2024', '2023'].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium font-mono ${
                  selectedYear === yr
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted hover:bg-accent text-muted-foreground'
                }`}
              >
                {yr === 'all' ? t('All Years', 'تمام سال') : yr}
              </button>
            ))}
          </div>
        </div>

        {/* Updates Timeline / Cards */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 border rounded-xl bg-card space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : filteredUpdates.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-card/50">
              <p className="text-sm text-muted-foreground">{t('No gazette updates found for selected filters.', 'منتخب فلٹرز کے مطابق کوئی گزٹ اپڈیٹ نہیں ملی۔')}</p>
            </div>
          ) : (
            filteredUpdates.map((item) => (
            <Card key={item.id} className="border-border/70 hover:border-primary/40 hover:shadow-xs transition-all bg-card overflow-hidden">
              <div className="border-l-4 border-primary p-3.5 sm:p-4 space-y-2.5">
                
                {/* Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-semibold bg-primary/10 text-primary border-primary/20">
                      {item.jurisdiction}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold text-emerald-600 border-emerald-300">
                      {item.status}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Calendar className="h-3 w-3" />
                      {isUrdu ? item.dateUr : item.dateEn}
                    </span>
                  </div>

                  <span className="text-[10px] text-muted-foreground font-mono truncate max-w-xs">
                    {item.gazetteRef}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                    {isUrdu ? item.titleUr : item.titleEn}
                  </h2>
                  {isUrdu ? (
                    <p className="text-[11px] text-muted-foreground pt-0.5">{item.titleEn}</p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground font-urdu pt-0.5" dir="rtl">{item.titleUr}</p>
                  )}
                </div>

                {/* Summary */}
                <p className="text-xs text-foreground/85 leading-snug">
                  {isUrdu ? item.summaryUr : item.summaryEn}
                </p>

                {/* Key Changes Bullet Points */}
                <div className="p-2.5 sm:p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    {t('Key Legal Changes & Impact:', 'اہم قانونی تبدیلیاں اور اثرات:')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    {(isUrdu ? item.keyChangesUr : item.keyChangesEn).map((change, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <span className="leading-tight text-muted-foreground">{change}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Link to Law in Directory */}
                {item.lawSlug && (
                  <div className="pt-1 flex items-center justify-between">
                    <Link href={`/laws/${item.lawSlug}`} className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
                      <Scale className="h-3.5 w-3.5" />
                      <span>{t('View Updated Law in Directory', 'ڈائریکٹری میں مکمل قانون دیکھیں')}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}

              </div>
            </Card>
          ))
          )}
        </div>

      </div>
    </div>
  )
}
