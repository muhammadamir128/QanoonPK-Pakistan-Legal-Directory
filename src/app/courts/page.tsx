'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Landmark, Gavel, Building2, Scale, FileText, ArrowRight,
  Info, MapPin, AlertTriangle, Search,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type CourtLevel = {
  id: string
  name: string
  nameUrdu: string
  icon: 'landmark' | 'gavel' | 'building' | 'scale'
  color: string
  description: string
  descriptionUrdu: string
  jurisdiction: string
  jurisdictionUrdu: string
  seats: string
  seatsUrdu: string
  examples: string[]
  examplesUrdu: string[]
  appealTo?: string
}

const COURT_LEVELS: CourtLevel[] = [
  {
    id: 'supreme',
    name: 'Supreme Court of Pakistan',
    nameUrdu: 'پاکستان کی سپریم کورٹ',
    icon: 'landmark',
    color: '#0d9488',
    description: 'The apex court of Pakistan. Final court of appeal for all civil and criminal matters. Has original, appellate, advisory and suo motu jurisdiction.',
    descriptionUrdu: 'پاکستان کی اعلیٰ ترین عدالت۔ تمام دیوانی اور فوجداری معاملات کی آخری اپیل کی عدالت۔ ابتدائی، اپیل، مشاورتی اور سو موٹو اختیار رکھتی ہے۔',
    jurisdiction: 'Federal — entire Pakistan',
    jurisdictionUrdu: 'وفاقی — پورا پاکستان',
    seats: 'Islamabad (principal seat); Karachi, Lahore, Peshawar, Quetta (branch registries)',
    seatsUrdu: 'اسلام آباد (مرکزی نشست)؛ کراچی، لاہور، پشاور، کوئٹہ (برانچ رجسٹریاں)',
    examples: ['Constitutional petitions under Art. 184(3)', 'Appeals from High Courts', 'Suo motu matters of public importance'],
    examplesUrdu: ['آرٹیکل 184(3) کے تحت آئینی درخواستیں', 'ہائی کورٹس سے اپیلیں', 'عوامی اہمیت کے سو موٹو معاملات'],
    appealTo: undefined,
  },
  {
    id: 'high',
    name: 'High Courts',
    nameUrdu: 'ہائی کورٹس',
    icon: 'gavel',
    color: '#9333ea',
    description: 'Provincial high courts — Supreme Court of each province. Have writ jurisdiction under Art. 199 of the Constitution, appellate jurisdiction over lower courts, and supervise subordinate courts.',
    descriptionUrdu: 'صوبائی ہائی کورٹس — ہر صوبے کی اعلیٰ عدالت۔ آئین کے آرٹیکل 199 کے تحت رٹ اختیار، نچلی عدالتوں پر اپیل اختیار، اور ماتحت عدالتوں کی نگرانی۔',
    jurisdiction: 'Provincial — one per province + ICT',
    jurisdictionUrdu: 'صوبائی — ایک فی صوبہ + آئی سی ٹی',
    seats: 'Lahore (Punjab), Karachi (Sindh), Peshawar (KPK), Quetta (Balochistan), Islamabad (ICT)',
    seatsUrdu: 'لاہور (پنجاب)، کراچی (سندھ)، پشاور (کے پی)، کوئٹہ (بلوچستان)، اسلام آباد (آئی سی ٹی)',
    examples: ['Writ petitions (habeas corpus, mandamus, certiorari)', 'Appeals from sessions & district courts', 'Constitutional jurisdiction'],
    examplesUrdu: ['رٹ درخواستیں (ہیبیس کارپس، مینڈیمس، سرٹیوراری)', 'سیشنز و ضلع عدالتوں سے اپیلیں', 'آئینی اختیار'],
    appealTo: 'supreme',
  },
  {
    id: 'district',
    name: 'District & Sessions Courts',
    nameUrdu: 'ضلع و سیشن کورٹس',
    icon: 'building',
    color: '#ea580c',
    description: 'The principal trial courts for civil and criminal cases. Each district has a District & Sessions Judge, Additional Sessions Judges, and Civil Judges (1st, 2nd, 3rd class).',
    descriptionUrdu: 'دیوانی اور فوجداری مقدمات کی بنیادی ٹرائل کورٹس۔ ہر ضلع میں ایک ڈسٹرکٹ و سیشن جج، ایڈیشنل سیشن ججز، اور سول ججز (پہلی، دوسری، تیسری کلاس) ہوتے ہیں۔',
    jurisdiction: 'District level — all districts of Pakistan',
    jurisdictionUrdu: 'ضلعی سطح — پاکستان کے تمام اضلاع',
    seats: 'Each district headquarters city',
    seatsUrdu: 'ہر ضلع ہیڈکوارٹر شہر',
    examples: ['Murder trials (sessions cases)', 'Civil suits above value limit', 'Family court appeals'],
    examplesUrdu: ['قتل کے مقدمات (سیشن کیسز)', 'مقدار کی حد سے اوپر دیوانی دعوے', 'فیملی کورٹ اپیلیں'],
    appealTo: 'high',
  },
  {
    id: 'magistrate',
    name: 'Judicial Magistrates',
    nameUrdu: 'جودیشل مجسٹریٹ',
    icon: 'scale',
    color: '#0891b2',
    description: 'Lowest tier of criminal courts. Handle minor offences, summons cases, bail matters, and preliminary inquiries. Empowered to impose punishments up to specified limits.',
    descriptionUrdu: 'فوجداری عدالتوں کا نچلا درجہ۔ معمولی جرائم، سمنس کیسز، ضمانت کے معاملات، اور ابتدائی تفتیش سنبھالتے ہیں۔ مقررہ حدود تک سزاؤں عائد کر سکتے ہیں۔',
    jurisdiction: 'Tehsil / district subdivision level',
    jurisdictionUrdu: 'تحصیل / ضلعی سب ڈویژن سطح',
    seats: 'Tehsil headquarters',
    seatsUrdu: 'تحصیل ہیڈکوارٹر',
    examples: ['Bail hearings', 'Petty offences', 'FIR remand decisions'],
    examplesUrdu: ['ضمانت سماعت', 'معمولی جرائم', 'ایف آئی آر ریمانڈ فیصلے'],
    appealTo: 'district',
  },
]

const SPECIAL_COURTS = [
  {
    name: 'Anti-Terrorism Courts (ATCs)',
    nameUrdu: 'اینٹی ٹیرورزم کورٹس',
    color: '#dc2626',
    description: 'Special courts for terrorism-related offences under the Anti-Terrorism Act 1997. Can impose death penalty.',
    descriptionUrdu: 'اینٹی ٹیرورزم ایکٹ 1997 کے تحت دہشت گردی سے متعلق جرائم کی خصوصی عدالت۔ موت کی سزا عائد کر سکتی ہے۔',
    established: '1997',
    jurisdiction: 'Federal — nationwide',
  },
  {
    name: 'Family Courts',
    nameUrdu: 'فیملی کورٹس',
    color: '#db2777',
    description: 'Specialized courts for marriage, divorce, dower, custody, maintenance disputes under the Family Courts Act 1964.',
    descriptionUrdu: 'فیملی کورٹس ایکٹ 1964 کے تحت نکاح، طلاق، مہر، حضانت، نان نفقہ کے تنازعات کی خصوصی عدالتیں۔',
    established: '1964',
    jurisdiction: 'District level — nationwide',
  },
  {
    name: 'NAB Courts (Accountability Courts)',
    nameUrdu: 'ایکاؤنٹیبلٹی کورٹس',
    color: '#7c3aed',
    description: 'Special courts for corruption cases under the National Accountability Ordinance 1999 (NAB).',
    descriptionUrdu: 'نیشنل اکاؤنٹیبلٹی آرڈیننس 1999 (NAB) کے تحت بدعنوانی کے مقدمات کی خصوصی عدالتیں۔',
    established: '1999',
    jurisdiction: 'Federal — nationwide',
  },
  {
    name: 'Federal Shariat Court',
    nameUrdu: 'وفاقی شرعی عدالت',
    color: '#059669',
    description: 'Reviews laws to ensure conformity with Islamic injunctions. Has appellate jurisdiction in Hudood cases.',
    descriptionUrdu: 'قوانین کو اسلامی احکامات کے مطابق جانچتی ہے۔ حدود کے معاملات میں اپیل اختیار رکھتی ہے۔',
    established: '1980',
    jurisdiction: 'Federal — entire Pakistan',
  },
  {
    name: 'Special Courts (Customs, Tax, Drugs)',
    nameUrdu: 'خصوصی کورٹس (کسٹم، ٹیکس، منشیات)',
    color: '#d97706',
    description: 'Specialized courts for customs, tax, and narcotics offences under their respective statutes.',
    descriptionUrdu: 'کسٹم، ٹیکس اور منشیات سے متعلق جرائم کی خصوصی عدالتیں۔',
    established: 'Various',
    jurisdiction: 'Federal / provincial — by type',
  },
  {
    name: 'Banking Courts',
    nameUrdu: 'بینکنگ کورٹس',
    color: '#2563eb',
    description: 'Special courts for banking and financial recovery cases under the Banking Companies Ordinance 1962.',
    descriptionUrdu: 'بینکنگ کمپنیز آرڈیننس 1962 کے تحت بینکنگ و مالی بحالی کے مقدمات کی خصوصی عدالتیں۔',
    established: '1962',
    jurisdiction: 'Federal — nationwide',
  },
]

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  landmark: Landmark,
  gavel: Gavel,
  building: Building2,
  scale: Scale,
}

export default function CourtsPage() {
  const { t, lang } = useLanguage()
  const [search, setSearch] = React.useState('')

  const filteredLevels = COURT_LEVELS.filter((l) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.name.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.examples.some((e) => e.toLowerCase().includes(q)) ||
      (l.nameUrdu.includes(search))
    )
  })

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('Court Hierarchy', 'عدالتی درجہ بندی')}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shrink-0">
            <Landmark className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('Pakistan Court Hierarchy', 'پاکستان کی عدالتی درجہ بندی')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              {t(
                'Understand the structure of Pakistan\'s judicial system — from the Supreme Court down to magistrate courts, plus special tribunals.',
                'پاکستان کے عدالتی نظام کے ڈھانچے کو سمجھیں — سپریم کورٹ سے مجسٹریٹ کورٹس تک، اور خصوصی محکمے۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Intro card */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-sm">{t('How to read this guide', 'اس رہنمائی کو کیسے پڑھیں')}</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {t(
                  'Pakistan follows a hierarchical court system. Cases typically begin at the lowest court and can be appealed upward. Different courts handle different types of cases — choose the right one based on your case type.',
                  'پاکستان میں درجہ بند عدالتی نظام ہے۔ مقدمے عموماً سب سے نچلی عدالت سے شروع ہوتے ہیں اور اوپر اپیل ہو سکتے ہیں۔ مختلف عدالتیں مختلف قسم کے مقدمات سنبھالتی ہیں۔'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('Search courts or case types...', 'عدالتیں یا کیس کی اقسام تلاش کریں...')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Court hierarchy visualization */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Landmark className="h-5 w-5 text-primary" />
        {t('Main Court Hierarchy', 'بنیادی عدالتی درجہ بندی')}
      </h2>
      <div className="space-y-4 mb-12">
        {filteredLevels.map((level, i) => {
          const Icon = ICONS[level.icon] ?? Landmark
          const isLast = i === filteredLevels.length - 1
          return (
            <React.Fragment key={level.id}>
              <CourtLevelCard level={level} index={i} lang={lang} t={t} />
              {!isLast && (
                <div className="flex items-center justify-center py-1">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <div className="w-px h-6 bg-border" />
                    <ArrowRight className={cn('h-4 w-4 rotate-90', lang === 'ur' && 'rotate-[-90deg]')} />
                    <div className="w-px h-6 bg-border" />
                    <span className="text-[10px] font-medium">
                      {t('appeals to', 'اپیل ہوتی ہے')}
                    </span>
                    <div className="w-px h-6 bg-border" />
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Special courts */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Gavel className="h-5 w-5 text-primary" />
        {t('Special & Tribunal Courts', 'خصوصی و محکمہ عدالتیں')}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {t('Specialized courts established for specific types of cases — operating parallel to the main hierarchy.', 'مخصوص قسم کے مقدمات کے لیے قائم خصوصی عدالتیں — بنیادی درجہ بندی کے متوازی۔')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {SPECIAL_COURTS.map((sc, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="h-1 w-full" style={{ backgroundColor: sc.color }} />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sc.color }} />
                <Badge variant="outline" className="text-[10px]">{sc.established}</Badge>
              </div>
              <CardTitle className="text-base leading-tight">
                {lang === 'ur' ? sc.nameUrdu : sc.name}
              </CardTitle>
              {lang === 'en' && (
                <CardDescription className="text-xs font-urdu" dir="rtl">{sc.nameUrdu}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {lang === 'ur' ? sc.descriptionUrdu : sc.description}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{sc.jurisdiction}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Process flow */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        {t('Typical Case Flow', 'عام کیس کا سفر')}
      </h2>
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'FIR / Complaint', titleUrdu: 'ایف آئی آر / استغاثہ', desc: 'Case filed at police station or magistrate', descUrdu: 'تھانے یا مجسٹریٹ میں کیس درج' },
              { step: '2', title: 'Trial Court', titleUrdu: 'ٹرائل کورٹ', desc: 'Evidence heard, verdict delivered', descUrdu: 'ثبوت سنی گئی، فیصلہ دیا گیا' },
              { step: '3', title: 'First Appeal', titleUrdu: 'پہلی اپیل', desc: 'Appeal to higher court (Sessions/High)', descUrdu: 'اعلیٰ عدالت میں اپیل' },
              { step: '4', title: 'Supreme Court', titleUrdu: 'سپریم کورٹ', desc: 'Final appeal (leave to appeal required)', descUrdu: 'آخری اپیل' },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    {s.step}
                  </span>
                  <h3 className="text-sm font-semibold">{lang === 'ur' ? s.titleUrdu : s.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                  {lang === 'ur' ? s.descUrdu : s.desc}
                </p>
                {i < 3 && (
                  <ArrowRight className={cn('hidden md:block absolute -right-2 top-3 h-4 w-4 text-muted-foreground/40', lang === 'ur' && 'rotate-180')} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-300/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              {t(
                'This guide is for educational purposes only. Jurisdiction can be complex — always consult a licensed lawyer to determine the correct court for your case.',
                'یہ رہنمائی صرف تعلیمی مقاصد کے لیے ہے۔ عدالتی اختیار پیچیدہ ہو سکتا ہے — اپنے کیس کی درست عدالت کے لیے ہمیشہ لائسنس یافتہ وکیل سے رجوع کریں۔'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CourtLevelCard({
  level, index, lang, t,
}: {
  level: CourtLevel
  index: number
  lang: 'en' | 'ur'
  t: (en: string, ur?: string) => string
}) {
  const Icon = ICONS[level.icon] ?? Landmark
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: level.color }} />
      <CardHeader>
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-white shrink-0 shadow-md"
            style={{ backgroundColor: level.color }}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Tier {index + 1}</span>
              <Badge variant="secondary" className="text-[10px]" style={{ color: level.color }}>
                {lang === 'ur' ? level.jurisdictionUrdu : level.jurisdiction}
              </Badge>
            </div>
            <CardTitle className="text-lg md:text-xl mt-1 leading-tight">
              {lang === 'ur' ? level.nameUrdu : level.name}
            </CardTitle>
            {lang === 'en' && (
              <CardDescription className="text-sm font-urdu mt-0.5" dir="rtl">{level.nameUrdu}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {lang === 'ur' ? level.descriptionUrdu : level.description}
        </p>
        <div className="grid md:grid-cols-2 gap-3 pt-3 border-t border-border/40">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3" />
              {t('Seats', 'نشستیں')}
            </p>
            <p className="text-xs leading-relaxed">{lang === 'ur' ? level.seatsUrdu : level.seats}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-1">
              <FileText className="h-3 w-3" />
              {t('Typical Cases', 'عام کیسز')}
            </p>
            <ul className="space-y-0.5">
              {level.examples.map((ex, i) => (
                <li key={i} className="text-xs leading-relaxed flex items-start gap-1.5">
                  <span className="inline-flex h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  {lang === 'ur' ? level.examplesUrdu[i] : ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
