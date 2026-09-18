'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Landmark, Gavel, Building2, Scale, FileText, ArrowRight,
  Info, MapPin, Search, Phone, ExternalLink, ShieldCheck, CheckCircle2,
  Clock, BookOpen, Layers
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    description: 'The apex court of Pakistan. Final court of appeal for all civil, criminal and constitutional matters. Has original (Art. 184), appellate (Art. 185), advisory (Art. 186) and review jurisdiction.',
    descriptionUrdu: 'پاکستان کی اعلیٰ ترین عدالت۔ تمام دیوانی اور فوجداری معاملات کی آخری اپیل کی عدالت۔ بنیادی، اپیل، مشاورتی اور نظرثانی کا اختیار رکھتی ہے۔',
    jurisdiction: 'Federal — entire Pakistan',
    jurisdictionUrdu: 'وفاقی — پورا پاکستان',
    seats: 'Islamabad (principal seat); Branch Registries: Lahore, Karachi, Peshawar, Quetta',
    seatsUrdu: 'اسلام آباد (مرکزی نشست)؛ برانچ رجسٹریاں: لاہور، کراچی، پشاور، کوئٹہ',
    examples: ['Constitutional petitions under Art. 184(3)', 'Appeals from High Courts (Art. 185)', 'Petitions for Leave to Appeal (CPLA)'],
    examplesUrdu: ['آرٹیکل 184(3) کے تحت آئینی درخواستیں', 'ہائی کورٹس سے اپیلیں (آرٹیکل 185)', 'سی پی ایل اے درخواستیں برائے اجازت اپیل'],
    appealTo: undefined,
  },
  {
    id: 'high',
    name: 'High Courts of Pakistan',
    nameUrdu: 'ہائی کورٹس (صوبائی و وفاقی)',
    icon: 'gavel',
    color: '#9333ea',
    description: 'Constitutional high courts — one in each province plus Islamabad Capital Territory. Exercise writ jurisdiction under Article 199, supervise subordinate judiciary, and hear first and second appeals.',
    descriptionUrdu: 'صوبائی ہائی کورٹس اور اسلام آباد ہائی کورٹ۔ آئین کے آرٹیکل 199 کے تحت رٹ اختیار، نچلی عدالتوں پر اپیل اختیار، اور ماتحت عدالتوں کی نگرانی۔',
    jurisdiction: 'Provincial / ICT territory',
    jurisdictionUrdu: 'صوبائی / وفاقی دارالحکومت حدود',
    seats: 'Lahore (Punjab), Karachi (Sindh), Peshawar (KPK), Quetta (Balochistan), Islamabad (ICT)',
    seatsUrdu: 'لاہور (پنجاب)، کراچی (سندھ)، پشاور (کے پی)، کوئٹہ (بلوچستان)، اسلام آباد (آئی سی ٹی)',
    examples: ['Writ petitions (habeas corpus, mandamus, certiorari)', 'Appeals from sessions & district courts', 'Company and admiralty benches'],
    examplesUrdu: ['رٹ درخواستیں (حبس بے جا، مینڈیمس، سرٹیوراری)', 'سیشنز و ضلع عدالتوں سے اپیلیں', 'کارپوریٹ اور ایڈمرلٹی بینچ'],
    appealTo: 'supreme',
  },
  {
    id: 'district',
    name: 'District & Sessions Courts',
    nameUrdu: 'ضلع و سیشن کورٹس',
    icon: 'building',
    color: '#ea580c',
    description: 'The principal trial courts for civil and criminal cases in each administrative district. Presided over by District & Sessions Judges, Additional Sessions Judges, and Senior Civil Judges.',
    descriptionUrdu: 'دیوانی اور فوجداری مقدمات کی بنیادی ٹرائل کورٹس۔ ہر ضلع میں ایک ڈسٹرکٹ و سیشن جج، ایڈیشنل سیشن ججز، اور سول ججز ہوتے ہیں۔',
    jurisdiction: 'District level — all districts nationwide',
    jurisdictionUrdu: 'ضلعی سطح — ملک بھر کے تمام اضلاع',
    seats: 'Each district headquarters judicial complex',
    seatsUrdu: 'ہر ضلع ہیڈکوارٹر جوڈیشل کمپلیکس',
    examples: ['Homicide and murder trials (sessions cases)', 'Civil suits of high pecuniary value', 'Appeals against civil judge orders'],
    examplesUrdu: ['قتل کے مقدمات (سیشن کیسز)', 'بڑے مالیاتی دیوانی دعوے', 'سول جج کے فیصلوں کے خلاف اپیلیں'],
    appealTo: 'high',
  },
  {
    id: 'magistrate',
    name: 'Civil Judges & Judicial Magistrates',
    nameUrdu: 'سول ججز و جوڈیشل مجسٹریٹس',
    icon: 'scale',
    color: '#0891b2',
    description: 'The foundational tier of the judiciary at Tehsil and subdivision level. Civil Judges try original suits of contracts, damages, and rent; Judicial Magistrates try offences punishable up to 7 years.',
    descriptionUrdu: 'تحصیل اور سب ڈویژن سطح پر بنیادی عدالتیں۔ سول ججز معاہدات، ہرجانے کے دعوے سنتے ہیں؛ جوڈیشل مجسٹریٹ 7 سال تک کی سزا والے فوجداری کیسز سنتے ہیں۔',
    jurisdiction: 'Tehsil / district subdivision level',
    jurisdictionUrdu: 'تحصیل / ضلعی سب ڈویژن سطح',
    seats: 'Tehsil and subdivision courts',
    seatsUrdu: 'تحصیل و سب ڈویژن عدالتیں',
    examples: ['Bail hearings (pre-trial & post-arrest)', 'Civil contracts and recovery suits', 'FIR remand proceedings & search warrants'],
    examplesUrdu: ['ضمانت کی درخواستیں', 'معاہدات و وصولی کے دیوانی دعوے', 'پولیس ریمانڈ اور وارنٹ تلاشی'],
    appealTo: 'district',
  },
]

const SPECIAL_COURTS = [
  {
    name: 'Anti-Terrorism Courts (ATCs)',
    nameUrdu: 'اینٹی ٹیرورزم کورٹس (خصوصی عدالتیں)',
    color: '#dc2626',
    description: 'Specialized courts established under the Anti-Terrorism Act 1997 for speedy trial of scheduled sectarian, terrorism, and extortion offences.',
    descriptionUrdu: 'اینٹی ٹیرورزم ایکٹ 1997 کے تحت دہشت گردی، بھتہ خوری اور فرقہ وارانہ جرائم کی تیز ترین سماعت کے لیے قائم عدالتیں۔',
    established: '1997',
    jurisdiction: 'Federal & Provincial Divisions',
    appealRoute: 'High Court (Division Bench within 30 days)'
  },
  {
    name: 'Family Courts',
    nameUrdu: 'فیملی کورٹس (خاندانی عدالتیں)',
    color: '#db2777',
    description: 'Specialized family tribunals under the Family Courts Act 1964 resolving Khula, dissolution of marriage, dower, maintenance, and child custody.',
    descriptionUrdu: 'فیملی کورٹس ایکٹ 1964 کے تحت خلع، تنسیخ نکاح، حق مہر، نان و نفقہ اور بچوں کی کسٹڈی کے مقدمات کی خصوصی عدالتیں۔',
    established: '1964',
    jurisdiction: 'District / Tehsil level nationwide',
    appealRoute: 'District Judge / High Court (Writ)'
  },
  {
    name: 'Accountability Courts (NAB)',
    nameUrdu: 'احتساب عدالتیں (نیب کورٹس)',
    color: '#7c3aed',
    description: 'Special courts under the National Accountability Ordinance 1999 trying corruption, misuse of public authority, and embezzlement of public funds.',
    descriptionUrdu: 'نیشنل اکاؤنٹیبلٹی آرڈیننس 1999 (NAB) کے تحت سرکاری فنڈز میں خورد برد اور کرپشن کے مقدمات کی خصوصی عدالتیں۔',
    established: '1999',
    jurisdiction: 'Federal — all major provincial capitals',
    appealRoute: 'High Court (Division Bench)'
  },
  {
    name: 'Federal Shariat Court',
    nameUrdu: 'وفاقی شرعی عدالت',
    color: '#059669',
    description: 'Constitutional court under Chapter 3A of the Constitution reviewing laws to ensure conformity with the Injunctions of Islam and hearing Hudood appeals.',
    descriptionUrdu: 'آئین کے تحت قوانین کو قرآن و سنت کے مطابق پرکھنے اور حدود و قصاص کے فیصلوں پر اپیل سننے والی وفاقی عدالت۔',
    established: '1980',
    jurisdiction: 'Nationwide (Constitution Avenue Islamabad)',
    appealRoute: 'Shariat Appellate Bench of Supreme Court'
  },
  {
    name: 'Banking Courts',
    nameUrdu: 'بینکنگ کورٹس',
    color: '#2563eb',
    description: 'Summary procedure courts under Financial Institutions (Recovery of Finances) Ordinance 2001 for recovery of loans and mortgages.',
    descriptionUrdu: 'مالیاتی ادارے آرڈیننس 2001 کے تحت بینک قرضوں، ڈیفالٹ اور رہن شدہ جائیدادوں کی فوری ریکوری کی عدالتیں۔',
    established: '2001',
    jurisdiction: 'All commercial division headquarters',
    appealRoute: 'High Court (Division Bench within 30 days)'
  },
  {
    name: 'Environmental Protection Tribunals',
    nameUrdu: 'ماحولیاتی تحفظ ٹربیونلز',
    color: '#0891b2',
    description: 'Special statutory tribunals trying industrial emissions, smog violations, effluent discharge, and hazardous chemical contraventions.',
    descriptionUrdu: 'ماحولیاتی آلودگی، اسموگ، فیکٹریوں کے زہریلے فضلے اور ماحولیاتی قوانین کی خلاف ورزیوں پر سزائیں دینے والا ٹربیونل۔',
    established: '1997',
    jurisdiction: 'Provincial headquarters',
    appealRoute: 'High Court within 30 days'
  },
]

const HIGH_COURTS_INFO = [
  {
    id: 'sc',
    name: 'Supreme Court of Pakistan',
    nameUrdu: 'سپریم کورٹ آف پاکستان',
    principal: 'Constitution Avenue, G-5/2, Islamabad',
    chiefJustice: 'Chief Justice of Pakistan',
    branchRegistries: ['Lahore Branch (Mozang Road)', 'Karachi Branch (M.R. Kayani Road)', 'Peshawar Branch (Khyber Road)', 'Quetta Branch (Hali Road)'],
    powers: 'Appeals from all 5 High Courts, Constitutional Article 184(3), Advisory opinions, Binding precedents (Art. 189).'
  },
  {
    id: 'lhc',
    name: 'Lahore High Court (LHC)',
    nameUrdu: 'لاہور ہائی کورٹ',
    principal: 'The Mall, Lahore, Punjab',
    chiefJustice: 'Chief Justice, Lahore High Court',
    branchRegistries: ['Rawalpindi Bench', 'Multan Bench', 'Bahawalpur Bench'],
    powers: 'Superintends all 36 district judiciaries across Punjab. Largest case volume in Pakistan.'
  },
  {
    id: 'shc',
    name: 'Sindh High Court (SHC)',
    nameUrdu: 'سندھ ہائی کورٹ',
    principal: 'Court Road, Karachi, Sindh',
    chiefJustice: 'Chief Justice, High Court of Sindh',
    branchRegistries: ['Sukkur Bench', 'Circuit Court Hyderabad', 'Circuit Court Larkana', 'Circuit Court Mirpurkhas'],
    powers: 'Has original civil jurisdiction in suits above Rs. 65 Million in Karachi district.'
  },
  {
    id: 'ihc',
    name: 'Islamabad High Court (IHC)',
    nameUrdu: 'اسلام آباد ہائی کورٹ',
    principal: 'Sector G-10/1, Islamabad Capital Territory',
    chiefJustice: 'Chief Justice, Islamabad High Court',
    branchRegistries: ['Principal Seat G-10/1'],
    powers: 'Original civil jurisdiction for ICT; exercises direct judicial review over all Federal Ministries, Authorities and Regulators.'
  },
  {
    id: 'phc',
    name: 'Peshawar High Court (PHC)',
    nameUrdu: 'پشاور ہائی کورٹ',
    principal: 'Khyber Road, Peshawar, Khyber Pakhtunkhwa',
    chiefJustice: 'Chief Justice, Peshawar High Court',
    branchRegistries: ['Abbottabad Bench', 'Mingora/Swat (Dar-ul-Qaza)', 'D.I. Khan Bench', 'Bannu Bench'],
    powers: 'Jurisdiction extended over erstwhile FATA/PATA tribal districts post-25th Constitutional Amendment.'
  },
  {
    id: 'bhc',
    name: 'High Court of Balochistan (BHC)',
    nameUrdu: 'بلوچستان ہائی کورٹ',
    principal: 'Hali Road, Quetta, Balochistan',
    chiefJustice: 'Chief Justice, High Court of Balochistan',
    branchRegistries: ['Sibi Bench', 'Turbat (Makran) Circuit Bench'],
    powers: 'Judicial review over mineral licenses, provincial authorities, and district courts across Balochistan.'
  }
]

const APPEAL_PATHWAYS = [
  {
    id: 'criminal',
    title: 'Criminal Offence / FIR',
    titleUrdu: 'فوجداری مقدمہ / ایف آئی آر',
    badge: 'Criminal',
    color: '#dc2626',
    steps: [
      { court: 'Judicial Magistrate / Sessions Judge', desc: 'Trial commences post-charge framing. Evidence recorded, final judgment and sentence pronounced.' },
      { court: 'Court of Session / High Court', desc: 'Criminal Appeal filed within 30 days under Section 410/417 CrPC against conviction or acquittal.' },
      { court: 'Supreme Court of Pakistan', desc: 'Criminal Petition for Leave to Appeal (CPLA) filed under Article 185(3) within 30 days.' }
    ]
  },
  {
    id: 'civil',
    title: 'Civil Property / Contract Dispute',
    titleUrdu: 'دیوانی جائیداد / معاہداتی تنازعہ',
    badge: 'Civil',
    color: '#9333ea',
    steps: [
      { court: 'Civil Judge (Class I / II / III)', desc: 'Plaint filed, summons served, written statement, issues framed, evidence and preliminary/final decree.' },
      { court: 'District Judge / Additional District Judge', desc: 'First Regular Appeal under Section 96 CPC filed within 30 days of decree.' },
      { court: 'High Court (Civil Revision / Second Appeal)', desc: 'Civil Revision under Section 115 CPC or Second Appeal under Section 100 CPC within 90 days.' },
      { court: 'Supreme Court of Pakistan', desc: 'Civil Petition for Leave to Appeal under Article 185(3) within 60 days.' }
    ]
  },
  {
    id: 'family',
    title: 'Family, Khula, Dower & Custody',
    titleUrdu: 'خاندانی تنازعہ، خلع، مہر و کسٹڈی',
    badge: 'Family',
    color: '#db2777',
    steps: [
      { court: 'Family Court (Senior Civil Judge/Civil Judge)', desc: 'Summary trial under Family Courts Act 1964. Pre-trial reconciliation, evidence, decree.' },
      { court: 'District Judge (Appellate Family Court)', desc: 'Appeal under Section 14 within 30 days (excluding decree for Khula which is non-appealable).' },
      { court: 'High Court (Constitutional Writ Art. 199)', desc: 'No second appeal lies; challenged through Constitutional Writ Petition on grounds of jurisdictional error.' }
    ]
  },
  {
    id: 'writ',
    title: 'Constitutional Writ (Fundamental Rights)',
    titleUrdu: 'آئینی رٹ پٹیشن (بنیادی حقوق)',
    badge: 'Constitutional',
    color: '#0d9488',
    steps: [
      { court: 'High Court (Single Bench)', desc: 'Writ Petition under Article 199 filed against unlawful state action, police excess, or maladministration.' },
      { court: 'High Court (Intra-Court Appeal / Division Bench)', desc: 'Intra-Court Appeal (ICA) before Division Bench where original order was passed by Single Bench.' },
      { court: 'Supreme Court of Pakistan', desc: 'Civil Petition for Leave to Appeal against final High Court Division Bench order.' }
    ]
  },
  {
    id: 'banking',
    title: 'Banking Default & Loan Recovery',
    titleUrdu: 'بینک قرض ڈیفالٹ و ریکوری',
    badge: 'Banking',
    color: '#2563eb',
    steps: [
      { court: 'Banking Court', desc: 'Plaint filed under Section 9 of FIO 2001. Defendant must file Leave to Defend (PLA) within 30 days.' },
      { court: 'High Court (Division Bench)', desc: 'Direct First Appeal before High Court Division Bench under Section 22 within 30 days.' },
      { court: 'Supreme Court of Pakistan', desc: 'Leave to Appeal under Article 185(3) of the Constitution.' }
    ]
  }
]

const WRIT_TYPES = [
  {
    name: 'Habeas Corpus',
    nameUrdu: 'حبس بے جا (غیر قانونی حراست)',
    icon: ShieldCheck,
    color: '#dc2626',
    desc: 'Directs the release of any person unlawfully detained or confined in custody by police or private individuals without legal authority.'
  },
  {
    name: 'Mandamus',
    nameUrdu: 'مینڈیمس (حکمِ فرائض)',
    icon: CheckCircle2,
    color: '#0d9488',
    desc: 'Compels a public officer, government department, or statutory authority to perform a mandatory duty required by law.'
  },
  {
    name: 'Prohibition',
    nameUrdu: 'پروبیٹیشن (اختیار سے تجاوز کی ممانعت)',
    icon: Gavel,
    color: '#ea580c',
    desc: 'Restrains a subordinate tribunal or quasi-judicial authority from exercising jurisdiction not vested in it by law.'
  },
  {
    name: 'Certiorari',
    nameUrdu: 'سرٹیوراری (حکم کالعدم کرنا)',
    icon: Scale,
    color: '#9333ea',
    desc: 'Quashes and sets aside an illegal, ultra vires, or arbitrary order passed by an administrative body or lower tribunal.'
  },
  {
    name: 'Quo Warranto',
    nameUrdu: 'کو وارنٹو (قانونی اہلیت کی جانچ)',
    icon: Landmark,
    color: '#0284c7',
    desc: 'Inquires into the legal authority of a person holding a public office to show under what authority of law they occupy that office.'
  }
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
  const [activePathway, setActivePathway] = React.useState('criminal')

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
              {t('Pakistan Court Hierarchy & Judicial Directory', 'پاکستان کی عدالتی درجہ بندی و جوڈیشل گائیڈ')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              {t(
                'Comprehensive guide to Pakistan\'s judicial system — Supreme Court, High Courts, District Courts, special tribunals, and step-by-step appeal pathways.',
                'پاکستان کے مکمل عدالتی نظام کا جامع جائزہ — سپریم کورٹ، ہائی کورٹس، ضلعی عدالتیں، خصوصی ٹربیونلز اور اپیل کے قانونی راستے۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Appeal Pathway Simulator (NEW FEATURE) */}
      <section className="mb-12">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              {t('Interactive Appeal Pathway Simulator', 'انٹرایکٹو اپیل روٹ سمیلیٹر')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('Select a case category to see its starting court, appellate forum, and final appeal route.', 'کیس کی قسم منتخب کریں اور دیکھیں کہ کیس کہاں شروع ہوگا اور اپیل کس عدالت میں جائے گی۔')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
          {APPEAL_PATHWAYS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePathway(p.id)}
              className={cn(
                'flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer text-xs',
                activePathway === p.id
                  ? 'bg-primary/10 border-primary text-primary font-semibold shadow-xs ring-1 ring-primary/30'
                  : 'bg-card border-border/70 hover:bg-accent hover:border-border text-foreground/80'
              )}
            >
              <span className="font-semibold text-xs leading-snug">{lang === 'ur' ? p.titleUrdu : p.title}</span>
              <span className="text-[10px] text-muted-foreground mt-1">{p.badge}</span>
            </button>
          ))}
        </div>

        {/* Selected Pathway Render */}
        {(() => {
          const path = APPEAL_PATHWAYS.find((p) => p.id === activePathway) || APPEAL_PATHWAYS[0]
          return (
            <Card className="border-primary/30 bg-gradient-to-b from-card to-primary/5 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge style={{ backgroundColor: `${path.color}18`, color: path.color }} className="border-none text-xs">
                    {path.badge}
                  </Badge>
                  <h3 className="font-bold text-sm sm:text-base">
                    {lang === 'ur' ? path.titleUrdu : path.title} — {t('Judicial Appeal Pathway', 'عدالتی اپیل کا مکمل راستہ')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                  {path.steps.map((step, idx) => (
                    <div key={idx} className="relative p-4 rounded-xl bg-card border border-border/60 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            {idx === 0 ? t('Step 1: Trial Court', 'پہلا مرحلہ: ٹرائل کورٹ') : idx === 1 ? t('Step 2: Appellate Court', 'دوسرا مرحلہ: اپیل کورٹ') : t('Step 3: Apex Court', 'تیسرا مرحلہ: اعلیٰ ترین عدالت')}
                          </span>
                          <span className="flex h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold items-center justify-center">
                            {idx + 1}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-foreground mb-1.5">{step.court}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })()}
      </section>

      {/* Search Filter */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('Search courts, jurisdictions, powers...', 'عدالتیں، دائرہ اختیار تلاش کریں...')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 shadow-xs"
        />
      </div>

      {/* Main Court Hierarchy Cards */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" />
          {t('Hierarchical Structure of Courts', 'پاکستان کی بنیادی عدالتی درجہ بندی')}
        </h2>
        <div className="space-y-4">
          {filteredLevels.map((level, i) => {
            const isLast = i === filteredLevels.length - 1
            return (
              <React.Fragment key={level.id}>
                <CourtLevelCard level={level} index={i} lang={lang} t={t} />
                {!isLast && (
                  <div className="flex items-center justify-center py-0.5">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <div className="w-px h-4 bg-border" />
                      <ArrowRight className={cn('h-3.5 w-3.5 rotate-90 text-primary/70', lang === 'ur' && 'rotate-[-90deg]')} />
                      <span className="text-[9px] font-semibold text-muted-foreground tracking-wider uppercase py-0.5">
                        {t('Appeals To', 'اپیل برائے')}
                      </span>
                      <div className="w-px h-4 bg-border" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* High Courts & Benches Directory (NEW FEATURE) */}
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {t('Constitutional High Courts & Bench Directory', 'آئینی ہائی کورٹس اور برانچ رجسٹریاں')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('Principal seats, branch registries, and territorial jurisdictions across Pakistan.', 'پاکستان کے تمام صوبائی ہائی کورٹس کے مرکزی بینچ اور علاقائی رجسٹریاں۔')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGH_COURTS_INFO.map((hc) => (
            <Card key={hc.id} className="border-border/60 hover:border-primary/40 hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span>{lang === 'ur' ? hc.nameUrdu : hc.name}</span>
                </CardTitle>
                <p className="text-xs text-primary font-medium flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>{hc.principal}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-1 text-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    {t('Branch Benches / Registries:', 'برانچ بینچز و رجسٹریاں:')}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {hc.branchRegistries.map((b, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[10px] py-0 font-normal">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed pt-1 border-t border-border/40">
                  {hc.powers}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Five Types of Writs (Article 199 Guide - NEW FEATURE) */}
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {t('Guide to Writ Jurisdiction (Article 199)', 'آئین کے تحت رٹ پٹیشن کی اقسام (آرٹیکل 199)')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('The 5 constitutional writs enforceable before High Courts for the protection of fundamental citizen rights.', 'بنیادی انسانی حقوق کے تحفظ کے لیے ہائی کورٹ میں دائر کی جانے والی 5 آئینی رٹیں')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {WRIT_TYPES.map((writ, i) => (
            <Card key={i} className="border-border/60 hover:shadow-sm transition-shadow flex flex-col justify-between">
              <CardContent className="p-3.5 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${writ.color}15`, color: writ.color }}>
                    <writ.icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-xs">{writ.name}</h3>
                </div>
                <p className="text-[11px] font-medium text-primary">{writ.nameUrdu}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{writ.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Special Courts Grid */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary" />
          {t('Special & Statutory Tribunals', 'خصوصی و محکمہ عدالتیں')}
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          {t('Specialized courts established under federal & provincial statutes with specific subject-matter jurisdiction.', 'مخصوص قسم کے مقدمات کے لیے قائم خصوصی عدالتیں اور ٹربیونلز۔')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPECIAL_COURTS.map((sc, i) => (
            <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow border-border/60">
              <div className="h-1.5 w-full" style={{ backgroundColor: sc.color }} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">{sc.established}</Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {sc.jurisdiction}
                  </span>
                </div>
                <CardTitle className="text-sm sm:text-base leading-tight font-bold">
                  {lang === 'ur' ? sc.nameUrdu : sc.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === 'ur' ? sc.descriptionUrdu : sc.description}
                </p>
                <div className="pt-2 border-t border-border/40 text-[10px] text-primary font-medium flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  <span>{t('Appellate Forum:', 'اپیل فورم:')} {sc.appealRoute}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
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
      className="overflow-hidden hover:shadow-md transition-shadow border-border/60"
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: level.color }} />
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl text-white shrink-0 shadow-sm"
            style={{ backgroundColor: level.color }}
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">Tier {index + 1}</span>
              <Badge variant="secondary" className="text-[10px]" style={{ color: level.color }}>
                {lang === 'ur' ? level.jurisdictionUrdu : level.jurisdiction}
              </Badge>
            </div>
            <CardTitle className="text-base sm:text-lg md:text-xl leading-tight font-bold text-foreground">
              {lang === 'ur' ? level.nameUrdu : level.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3.5">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {lang === 'ur' ? level.descriptionUrdu : level.description}
        </p>
        <div className="grid md:grid-cols-2 gap-3 pt-3 border-t border-border/40">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-1 font-semibold">
              <MapPin className="h-3 w-3 text-primary" />
              {t('Principal Benches & Seats', 'نشستیں و رجسٹریاں')}
            </p>
            <p className="text-xs leading-relaxed text-foreground/90">{lang === 'ur' ? level.seatsUrdu : level.seats}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-1 font-semibold">
              <FileText className="h-3 w-3 text-primary" />
              {t('Jurisdiction & Examples', 'دائرہ اختیار و اہم کیسز')}
            </p>
            <ul className="space-y-1">
              {level.examples.map((ex, i) => (
                <li key={i} className="text-xs leading-relaxed flex items-start gap-1.5 text-foreground/90">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
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
