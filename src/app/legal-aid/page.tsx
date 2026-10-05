'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  PhoneCall, Shield, AlertTriangle, HeartHandshake, Phone,
  Copy, Check, ExternalLink, MapPin, Mail, ChevronRight,
  Info, Scale, Users, FileText, CheckCircle2, Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/components/language-provider'
import { toast } from 'sonner'

interface HelplineItem {
  id: string
  number: string
  nameEn: string
  nameUr: string
  category: 'police' | 'women' | 'cyber' | 'children' | 'rights' | 'emergency'
  descEn: string
  descUr: string
  timingEn: string
  timingUr: string
  tollFree: boolean
}

interface OrgItem {
  nameEn: string
  nameUr: string
  provinces: string[]
  specialtiesEn: string[]
  specialtiesUr: string[]
  phone: string
  email: string
  addressEn: string
  addressUr: string
  website?: string
  descEn: string
  descUr: string
}

const HELPLINES: HelplineItem[] = [
  {
    id: 'police',
    number: '15',
    nameEn: 'Police Emergency Helpline (Pukar 15)',
    nameUr: 'پولیس ایمرجنسی پکار 15',
    category: 'police',
    descEn: 'Immediate police response for crimes in progress, burglary, assault, or threats.',
    descUr: 'فوری پولیس مدد، جرائم، ڈکیتی، تشدد یا جان و مال کے خطرے کی صورت میں۔',
    timingEn: '24/7 Nationwide',
    timingUr: '24 گھنٹے ملک بھر میں',
    tollFree: true,
  },
  {
    id: 'cyber',
    number: '1991',
    nameEn: 'FIA Cyber Crime Wing Helpline',
    nameUr: 'ایف آئی اے سائبر کرائم ہیلپ لائن 1991',
    category: 'cyber',
    descEn: 'Report online harassment, blackmail, WhatsApp hacking, unauthorized photos, and cyber financial fraud.',
    descUr: 'آن لائن ہراسانی، بلیک میلنگ، واٹس ایپ ہیکنگ، تصاویر کا غلط استعمال اور فراڈ کی فوری رپورٹ۔',
    timingEn: '24/7 Dedicated',
    timingUr: '24 گھنٹے فعال',
    tollFree: true,
  },
  {
    id: 'mohr',
    number: '1099',
    nameEn: 'Ministry of Human Rights Helpline',
    nameUr: 'وزارت انسانی حقوق فری قانونی ہیلپ لائن 1099',
    category: 'rights',
    descEn: 'Free legal advice and redressal for human rights violations, domestic disputes, and custody matters.',
    descUr: 'انسانی حقوق کی خلاف ورزیوں، گھریلو تنازعات اور مفت قانونی مشورے کے لیے حکومتی ہیلپ لائن۔',
    timingEn: '24/7 Toll-Free',
    timingUr: '24 گھنٹے مفت کال',
    tollFree: true,
  },
  {
    id: 'children',
    number: '1121',
    nameEn: 'Child Protection & Welfare Bureau (CPWB)',
    nameUr: 'چائلڈ پروٹیکشن بیورو ہیلپ لائن 1121',
    category: 'children',
    descEn: 'Rescue, rehabilitation, and legal aid for abandoned, abused, lost, or runaway children.',
    descUr: 'لاوارث، گمشدہ، یا تشدد کا شکار بچوں کے تحفظ، قانونی امداد اور بحالی کے لیے۔',
    timingEn: '24/7 Emergency',
    timingUr: '24 گھنٹے دستیاب',
    tollFree: true,
  },
  {
    id: 'women-punjab',
    number: '1043',
    nameEn: 'Punjab Women Helpline (PCSW)',
    nameUr: 'پنجاب ویمن ہیلپ لائن 1043',
    category: 'women',
    descEn: 'Legal advice, psychological counseling, and dispute resolution for women across Punjab.',
    descUr: 'پنجاب میں خواتین کے لیے مفت قانونی مشاورت، تحفظ اور شکایات کا ازالہ۔',
    timingEn: '24/7 Dedicated',
    timingUr: '24 گھنٹے فعال',
    tollFree: true,
  },
  {
    id: 'women-sindh',
    number: '1094',
    nameEn: 'Sindh Women Protection Helpline',
    nameUr: 'سندھ ویمن پروٹیکشن ہیلپ لائن 1094',
    category: 'women',
    descEn: 'Support and legal intervention for women facing domestic violence, harassment, or forced marriages.',
    descUr: 'سندھ میں گھریلو تشدد، ہراسانی اور زبردستی کی شادیوں کے خلاف قانونی مدد۔',
    timingEn: '24/7 Dedicated',
    timingUr: '24 گھنٹے فعال',
    tollFree: true,
  },
  {
    id: 'workplace',
    number: '1056',
    nameEn: 'FOSPAH Workplace Harassment Helpline',
    nameUr: 'وفاقی محتسب برائے انسدادِ ہراسانی 1056',
    category: 'rights',
    descEn: 'Federal Ombudsman Secretariat for Protection Against Harassment of Women at Workplace.',
    descUr: 'کام کی جگہ پر خواتین کو ہراساں کیے جانے کے خلاف شکایت اور قانونی کارروائی۔',
    timingEn: 'Office Hours (Mon-Fri)',
    timingUr: 'دفتری اوقات (پیر تا جمعہ)',
    tollFree: true,
  },
  {
    id: 'rescue',
    number: '1122',
    nameEn: 'Emergency Rescue & Medical (1122)',
    nameUr: 'ریسکیو 1122 ایمرجنسی',
    category: 'emergency',
    descEn: 'Ambulance, fire, drowning, building collapse, and emergency first response across Punjab & KP.',
    descUr: 'ایمبولینس، فائر بریگیڈ اور حادثات میں فوری طبی و ایمرجنسی مدد۔',
    timingEn: '24/7 Immediate',
    timingUr: '24 گھنٹے فوری سروس',
    tollFree: true,
  },
]

const ORGANIZATIONS: OrgItem[] = [
  {
    nameEn: 'Legal Aid Society (LAS)',
    nameUr: 'لیگل ایڈ سوسائٹی (LAS)',
    provinces: ['Sindh', 'National'],
    specialtiesEn: ['Under-trial Prisoners', 'Gender Based Violence', 'Property Rights'],
    specialtiesUr: ['زیرِ سماعت قیدی', 'صنفی تشدد', 'جائیداد کے تنازعات'],
    phone: '0800-70806',
    email: 'info@lao.org.pk',
    addressEn: 'Karachi & Regional Offices across Sindh',
    addressUr: 'کراچی اور سندھ بھر کے علاقائی دفاتر',
    website: 'https://www.lao.org.pk',
    descEn: 'One of Pakistan\'s largest legal empowerment organizations providing pro-bono defense to marginalized citizens.',
    descUr: 'پاکستان کا سب سے بڑا مفت قانونی ادارہ جو بے بس شہریوں اور قیدیوں کو مفت وکیل فراہم کرتا ہے۔',
  },
  {
    nameEn: 'Asma Jahangir Legal Aid Cell (AGHS)',
    nameUr: 'عاصمہ جہانگیر لیگل ایڈ سیل (AGHS)',
    provinces: ['Punjab', 'National'],
    specialtiesEn: ['Women Rights', 'Minority Rights', 'Constitutional Petitions', 'Family Law'],
    specialtiesUr: ['خواتین کے حقوق', 'اقلیتوں کے حقوق', 'آئینی رٹ درخواستیں', 'فیملی لاء'],
    phone: '042-35763234',
    email: 'info@aghslegal.org',
    addressEn: 'Gulberg-III, Lahore, Punjab',
    addressUr: 'گلبرگ 3، لاہور، پنجاب',
    website: 'https://aghslaw.net',
    descEn: 'Founded by human rights icon Asma Jahangir, providing fearless pro-bono representation in High Courts and Supreme Court.',
    descUr: 'معروف قانون دان عاصمہ جہانگیر کا قائم کردہ ادارہ جو ہائی کورٹس اور سپریم کورٹ میں مظلوم شہریوں کی مفت وکالت کرتا ہے۔',
  },
  {
    nameEn: 'Pakistan Bar Council Free Legal Aid Committee',
    nameUr: 'پاکستان بار کونسل فری لیگل ایڈ کمیٹی',
    provinces: ['Federal', 'National'],
    specialtiesEn: ['Supreme Court Appeals', 'Capital Punishment Cases', 'Indigent Litigants'],
    specialtiesUr: ['سپریم کورٹ اپیلیں', 'سزائے موت کے کیسز', 'نادار سائلین'],
    phone: '051-9216601',
    email: 'info@pakistanbarcouncil.org',
    addressEn: 'Supreme Court Building, Constitution Avenue, Islamabad',
    addressUr: 'سپریم کورٹ بلڈنگ، کانسٹی ٹیوشن ایونیو، اسلام آباد',
    website: 'https://pakistanbarcouncil.org',
    descEn: 'Statutory body established under the Legal Practitioners & Bar Councils Act 1973 providing legal assistance to persons without means.',
    descUr: 'پاکستان بار کونسل کی باقاعدہ کمیٹی جو مالی استطاعت نہ رکھنے والے شہریوں کو تجربہ کار وکیل فراہم کرتی ہے۔',
  },
  {
    nameEn: 'Justice Project Pakistan (JPP)',
    nameUr: 'جسٹس پروجیکٹ پاکستان (JPP)',
    provinces: ['Punjab', 'National'],
    specialtiesEn: ['Death Row Prisoners', 'Torture Victims', 'Overseas Pakistani Prisoners'],
    specialtiesUr: ['سزائے موت کے قیدی', 'تشدد کے متاثرین', 'بیرون ملک قید پاکستانی'],
    phone: '042-35787680',
    email: 'info@jpp.org.pk',
    addressEn: 'Main Gulberg, Lahore',
    addressUr: 'مین گلبرگ، لاہور',
    website: 'https://jpp.org.pk',
    descEn: 'Non-profit legal action organization representing vulnerable prisoners facing capital punishment and wrongful incarceration.',
    descUr: 'مفت قانونی تنظیم جو سزائے موت کے مستحق قیدیوں اور پولیس تشدد کے متاثرین کی عدالتوں میں نمائندگی کرتی ہے۔',
  },
  {
    nameEn: 'Edhi Foundation Legal & Missing Persons Cell',
    nameUr: 'ایدھی فاؤنڈیشن لیگل و گمشدہ افراد سیل',
    provinces: ['National'],
    specialtiesEn: ['Missing Children', 'Burial & Inheritance Assistance', 'Shelter & Protection'],
    specialtiesUr: ['گمشدہ بچے', 'تدفین و وراثت معاونت', 'پناہ گاہیں و تحفظ'],
    phone: '115',
    email: 'info@edhi.org',
    addressEn: 'Boulton Market, Karachi & Nationwide centers',
    addressUr: 'بولٹن مارکیٹ، کراچی اور ملک گیر مراکز',
    website: 'https://edhi.org',
    descEn: 'Provides emergency shelter, missing persons legal liaison, and child reunion assistance throughout Pakistan.',
    descUr: 'گمشدہ افراد کی بازیابی اور پناہ گزینوں کو باوقار قانونی و سماجی تحفظ فراہم کرتا ہے۔',
  },
  {
    nameEn: 'Sahil (Protection of Children Against Abuse)',
    nameUr: 'ساحل (بچوں کے جنسی و جسمانی تحفظ کا ادارہ)',
    provinces: ['ICT', 'Punjab', 'Sindh', 'KP'],
    specialtiesEn: ['Child Sexual Abuse (PPC 292B/377A)', 'Trauma Counseling', 'Legal Prosecution Support'],
    specialtiesUr: ['بچوں سے زیادتی کے مقدمات', 'ذہنی مشاورت', 'عدالتی پیروی'],
    phone: '0800-13518',
    email: 'info@sahil.org',
    addressEn: 'Sector F-8, Islamabad & Nationwide Offices',
    addressUr: 'سیکٹر F-8، اسلام آباد اور تمام صوبائی دفاتر',
    website: 'https://sahil.org',
    descEn: 'Pioneering organization dedicated to the prevention of child abuse and offering pro-bono legal support to victim families.',
    descUr: 'بچوں کے حقوق کا سرکردہ ادارہ جو متاثرہ خاندانوں کو فری لیگل سپورٹ اور عدالتی وکیل دیتا ہے۔',
  },
]

export default function LegalAidPage() {
  const { t, lang } = useLanguage()
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [filterCategory, setFilterCategory] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [organizations, setOrganizations] = React.useState<LegalAidOrg[]>(ORGANIZATIONS)
  const [orgsLoading, setOrgsLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/legal-aid')
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setOrganizations(data.items)
        }
      })
      .catch((err) => console.error('Failed to load legal aid orgs:', err))
      .finally(() => setOrgsLoading(false))
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success(t(`Copied: ${text}`, `کاپی ہو گیا: ${text}`))
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredHelplines = HELPLINES.filter((h) => {
    if (filterCategory !== 'all' && h.category !== filterCategory) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      h.nameEn.toLowerCase().includes(q) ||
      h.nameUr.includes(q) ||
      h.number.includes(q) ||
      h.descEn.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t('Home', 'ہوم')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{t('Legal Aid & Helplines', 'قانونی امداد اور ہیلپ لائنز')}</span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-background to-primary/5 p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold">
              <Shield className="h-3.5 w-3.5" />
              <span>{t('Emergency Citizen Helpline Directory', 'ہنگامی شہری ہیلپ لائن ڈائریکٹری')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t('Pakistan Emergency Helplines & Free Legal Aid', 'پاکستان ایمرجنسی ہیلپ لائنز اور مفت قانونی امداد')}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'Direct access to official 24/7 government emergency lines, women & child protection cells, FIA Cyber Crime response, and certified pro-bono legal organizations for citizens in need.',
                'سرکاری 24 گھنٹے فعال ایمرجنسی ہیلپ لائنز، خواتین و بچوں کا تحفظ، ایف آئی اے سائبر کرائم، اور مستحق شہریوں کے لیے مفت وکیل فراہم کرنے والے مصدقہ ادارے ایک ہی جگہ۔'
              )}
            </p>
          </div>
        </div>

        {/* Constitutional Right Banner */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t('Article 37(d) of Constitution of Pakistan', 'آئینِ پاکستان کی دفعہ 37(d)')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(
                  'The State shall ensure inexpensive and expeditious justice to all citizens, including state-provided defense counsel for indigent accused facing serious criminal trials.',
                  'ریاست تمام شہریوں کو سستا اور فوری انصاف فراہم کرے گی اور مالی استطاعت نہ رکھنے والے ملزمان کو سرکاری خرچ پر وکیل مہیا کیا جاتا ہے۔'
                )}
              </p>
            </div>
          </div>
          <Link href="/laws" className="shrink-0">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
              <span>{t('Read Constitution', 'آئین پڑھیں')}</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* SECTION 1: EMERGENCY HELPLINES GRID */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-red-600" />
                <span>{t('Immediate Response Helplines (Dial Now)', 'فوری ہنگامی ہیلپ لائنز (ڈائل کریں)')}</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                {t('Toll-free or standard rate emergency dispatch numbers across Pakistan', 'ملک بھر میں مفت یا معیاری شرح پر فوری حکومتی مدد')}
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'all', labelEn: 'All', labelUr: 'تمام' },
                { id: 'police', labelEn: 'Police', labelUr: 'پولیس' },
                { id: 'cyber', labelEn: 'Cyber Crime', labelUr: 'سائبر کرائم' },
                { id: 'women', labelEn: 'Women', labelUr: 'خواتین' },
                { id: 'children', labelEn: 'Children', labelUr: 'بچے' },
                { id: 'rights', labelEn: 'Human Rights', labelUr: 'حقوق' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium ${
                    filterCategory === cat.id
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'bg-muted hover:bg-accent text-muted-foreground'
                  }`}
                >
                  {t(cat.labelEn, cat.labelUr)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredHelplines.map((item) => (
              <Card key={item.id} className="border-border/70 hover:border-red-500/40 hover:shadow-md transition-all flex flex-col justify-between">
                <CardHeader className="p-4 pb-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-red-600 dark:text-red-400 tracking-tight">
                      {item.number}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold bg-muted/50">
                      {item.timingEn.split(' ')[0]}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground leading-snug">
                    {lang === 'ur' ? item.nameUr : item.nameEn}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-1 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed min-h-12">
                    {lang === 'ur' ? item.descUr : item.descEn}
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                    <a
                      href={`tel:${item.number}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{t('Call Now', 'ابھی کال کریں')}</span>
                    </a>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(item.number, item.id)}
                      className="h-8 w-8 shrink-0 border-border/70 hover:bg-muted"
                      title={t('Copy number', 'نمبر کاپی کریں')}
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SECTION 2: PRO-BONO LEGAL AID ORGANIZATIONS */}
        <div className="space-y-4 pt-4">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary" />
              <span>{t('Certified Free Legal Aid Organizations (NGOs & Bar Councils)', 'مفت قانونی امداد کے ادارے (وکلاء و تنظیمیں)')}</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              {t('Registered non-profits providing free court representation, bail, and counseling to underprivileged citizens', 'وہ تنظیمیں جو نادار شہریوں اور خواتین کو عدالتوں میں مفت وکیل مہیا کرتی ہیں')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {organizations.map((org, idx) => (
              <Card key={idx} className="border-border/70 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between">
                <CardHeader className="p-3.5 sm:p-4 pb-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                        {lang === 'ur' ? org.nameUr : org.nameEn}
                      </CardTitle>
                      <div className="flex gap-1 flex-wrap pt-1">
                        {org.provinces.map((p) => (
                          <Badge key={p} variant="secondary" className="text-[9px] px-1.5 py-0 font-medium">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary p-1 rounded-md transition-colors"
                        title={t('Visit official website', 'ویب سائٹ ملاحظہ کریں')}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-3.5 sm:p-4 pt-1 space-y-2">
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                    {lang === 'ur' ? org.descUr : org.descEn}
                  </p>

                  {/* Specialties */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-foreground block">
                      {t('Key Areas of Assistance:', 'امدادی شعبہ جات:')}
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {(lang === 'ur' ? org.specialtiesUr : org.specialtiesEn).map((sp, sIdx) => (
                        <span key={sIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-foreground/80 font-medium">
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Box */}
                  <div className="pt-1.5 border-t border-border/50 space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-primary shrink-0" />
                      <a href={`tel:${org.phone}`} className="font-mono hover:text-primary font-medium">
                        {org.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-primary shrink-0" />
                      <a href={`mailto:${org.email}`} className="hover:text-primary truncate">
                        {org.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                      <span className="truncate">{lang === 'ur' ? org.addressUr : org.addressEn}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SECTION 3: CITIZEN LEGAL RIGHTS GUIDE */}
        <Card className="border-border/70 shadow-xs bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span>{t('How to Request a Free State-Appointed Defense Counsel in Court', 'عدالت میں سرکاری خرچ پر وکیل (State Counsel) حاصل کرنے کا طریقہ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              {t(
                'Under Section 340(1) of the Code of Criminal Procedure (CrPC) and High Court Rules, any accused person facing a trial punishable with death or life imprisonment who cannot afford a private lawyer is entitled to a defense counsel appointed and paid for by the State.',
                'ضابطہ فوجداری (CrPC) کی دفعہ 340 اور ہائی کورٹ رولز کے تحت، جب کسی ملزم پر سنگین جرم کا مقدمہ ہو اور وہ وکیل کرنے کی استطاعت نہ رکھتا ہو، تو عدالت کا فرض ہے کہ وہ سرکاری خرچ پر اس کا دفاع کرنے کے لیے وکیل مقرر کرے۔'
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                <span className="font-semibold text-foreground block">1. {t('File Written Application', 'درخواست پیش کریں')}</span>
                <p>{t('Submit a written application to the Trial Magistrate or Sessions Judge stating financial inability.', 'علاقہ مجسٹریٹ یا سیشن جج کی عدالت میں اپنی ناداری کا حلف نامہ جمع کروائیں۔')}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                <span className="font-semibold text-foreground block">2. {t('District Legal Aid Committee', 'ضلعی بار کمیٹی')}</span>
                <p>{t('Contact the District Bar Association Free Legal Aid desk present in every District Court complex.', 'ہر ڈسٹرکٹ کورٹ میں موجود ڈسٹرکٹ بار ایسوسی ایشن کے لیگل ایڈ ڈیسک سے رابطہ کریں۔')}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                <span className="font-semibold text-foreground block">3. {t('Pauper Civil Suit (Order 33)', 'دیوانی مفلس کا دعویٰ')}</span>
                <p>{t('In civil disputes, apply under Order 33 CPC to be declared an indigent person exempt from all court fees.', 'دیوانی تنازعات میں آرڈر 33 کے تحت مفلسی کی درخواست دے کر بغیر کورٹ فیس کیس لڑیں۔')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
