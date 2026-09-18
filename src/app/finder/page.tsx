'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Compass, ChevronRight, ChevronLeft, ArrowRight, RefreshCw,
  FileText, ArrowLeft, BookOpen, Scale, CheckCircle2, ShieldAlert,
  Phone, Sparkles, Building2, Gavel, HelpCircle, ExternalLink,
  CreditCard, Home, HeartHandshake, Laptop, Briefcase, Zap,
  AlertCircle, ShieldCheck, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type FinderOption = {
  id: string
  label: string
  labelUrdu?: string
  nextIdx?: number
  categoryIds?: string[]
}

type Question = {
  id: string
  question: string
  questionUrdu?: string
  options: FinderOption[]
  orderIndex: number
}

type Law = {
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted: number
  status: string
  summary: string | null
  summaryUrdu: string | null
  category: { name: string; slug: string; color?: string | null; nameUrdu: string }
}

const COMMON_ROADMAPS = [
  {
    id: 'cheque',
    category: 'financial',
    categoryName: 'Finance & Banking',
    categoryNameUrdu: 'مالیات و چیک',
    icon: CreditCard,
    color: '#dc2626',
    title: 'Dishonoured / Bounced Cheque',
    titleUrdu: 'باؤنس چیک / سیکشن 489-F',
    statute: 'Pakistan Penal Code (Section 489-F) & Negotiable Instruments Act 1881',
    statuteUrdu: 'تعزیراتِ پاکستان دفعہ 489-F اور نیگوشئیبل انسٹرومنٹس ایکٹ 1881',
    statuteSlug: 'pakistan-penal-code-1860',
    firstStep: 'Obtain written Bank Return Memo with dishonour stamp, then issue 14-day formal Legal Notice to drawer.',
    firstStepUrdu: 'بینک سے ڈس آنر میمو حاصل کریں اور کھاتہ دار کو 14 روزہ باضابطہ قانونی نوٹس بذریعہ وکیل ارسال کریں۔',
    forum: 'Area Police Station (FIR under 489-F) or Civil Court (Suit for Recovery under Order XXXVII CPC)',
    forumUrdu: 'متعلقہ تھانہ (ایف آئی آر دفعہ 489-F) یا دیوانی عدالت (آرڈر 37 ضابطہ دیوانی سمری دعویٰ)',
    templateSlug: 'legal-notice-recovery-dues',
    templateTitle: 'Recovery Notice Draft'
  },
  {
    id: 'rent',
    category: 'property',
    categoryName: 'Tenancy & Rent',
    categoryNameUrdu: 'کرایہ داری و بے دخلی',
    icon: Home,
    color: '#ea580c',
    title: 'Tenant Eviction & Rent Default',
    titleUrdu: 'کرایہ دار کی بے دخلی و کرایہ کی عدم ادائیگی',
    statute: 'Punjab Rented Premises Act 2009 / Sindh Rented Premises Ordinance 1979',
    statuteUrdu: 'پنجاب رینٹڈ پریمسز ایکٹ 2009 / سندھ رینٹڈ پریمسز آرڈیننس 1979',
    statuteSlug: 'punjab-rented-premises-act-2009',
    firstStep: 'Check tenancy expiry date or issue notice of rent default, then file Eviction Petition before Rent Tribunal / Controller.',
    firstStepUrdu: 'معاہدہ کی میعاد یا ڈیفالٹ چیک کریں اور رینٹ ٹربیونل یا رینٹ کنٹرولر کے روبرو بے دخلی کی درخواست دائر کریں۔',
    forum: 'Special Rent Tribunal / Rent Controller of the district',
    forumUrdu: 'ضلعی رینٹ ٹربیونل / اسپیشل رینٹ کنٹرولر',
    templateSlug: 'residential-tenancy-agreement',
    templateTitle: 'Tenancy Agreement'
  },
  {
    id: 'family',
    category: 'family',
    categoryName: 'Family & Custody',
    categoryNameUrdu: 'خاندانی و نکاح/خلع',
    icon: HeartHandshake,
    color: '#db2777',
    title: 'Divorce, Khula & Child Custody',
    titleUrdu: 'طلاق، خلع، خرچہ نان نفقہ و تحویل اطفال',
    statute: 'Muslim Family Laws Ordinance 1961, Family Courts Act 1964 & Guardian and Wards Act 1890',
    statuteUrdu: 'مسلم فیملی لاز آرڈیننس 1961، فیملی کورٹس ایکٹ 1964 اور گارڈین اینڈ وارڈز ایکٹ',
    statuteSlug: 'family-courts-act-1964',
    firstStep: 'For Khula/Maintenance file Plaint in Family Court; for Talaq send mandatory written notice to Chairman Union Council.',
    firstStepUrdu: 'خلع یا خرچے کے لیے فیملی کورٹ میں دعویٰ دائر کریں؛ طلاق کی صورت میں چیئرمین یونین کونسل کو تحریری نوٹس بھیجیں۔',
    forum: 'Family Court & Guardian Judge at Tehsil/District headquarters',
    forumUrdu: 'فیملی کورٹ و گارڈین جج کی عدالت',
    templateSlug: 'talaq-notice-union-council',
    templateTitle: 'Talaq Notice to Union Council'
  },
  {
    id: 'cyber',
    category: 'cyber',
    categoryName: 'Cyber & Online',
    categoryNameUrdu: 'سائبر کرائم و بلیک میلنگ',
    icon: Laptop,
    color: '#7c3aed',
    title: 'Cyber Blackmail, Harassment & Online Fraud',
    titleUrdu: 'آن لائن بلیک میلنگ، ہراسانی و سائبر فراڈ',
    statute: 'Prevention of Electronic Crimes Act (PECA) 2016 & NCCIA Act 2024',
    statuteUrdu: 'پریوینشن آف الیکٹرانک کرائمز ایکٹ (پیکا) 2016 اور این سی سی آئی اے ایکٹ 2024',
    statuteSlug: 'prevention-of-electronic-crimes-act-2016',
    firstStep: 'Take clear screenshots, save URLs, preservation of digital logs, and file online complaint at FIA Cyber Crime portal / call 1991.',
    firstStepUrdu: 'اسکرین شاٹس محفوظ کریں اور ایف آئی اے سائبر کرائم پورٹل پر آن لائن شکایت درج کرائیں یا ہیلپ لائن 1991 پر رابطہ کریں۔',
    forum: 'National Cyber Crime Investigation Agency (NCCIA) / FIA Cyber Crime Wing & Special PECA Courts',
    forumUrdu: 'این سی سی آئی اے / ایف آئی اے سائبر کرائم سیل و اسپیشل پیکا کورٹس',
    helpline: '1991'
  },
  {
    id: 'workplace',
    category: 'labour',
    categoryName: 'Labour & Workplace',
    categoryNameUrdu: 'ملازمت و تنخواہ',
    icon: Briefcase,
    color: '#0d9488',
    title: 'Workplace Harassment & Unpaid Salary',
    titleUrdu: 'دفتر میں ہراسانی و تنخواہ کی بندش',
    statute: 'Protection Against Harassment at Workplace Act 2010 & Payment of Wages Act 1936',
    statuteUrdu: 'خواتین کو جائے کار پر ہراسانی سے تحفظ کا ایکٹ 2010 اور ادائیگی اجرت ایکٹ 1936',
    statuteSlug: 'protection-against-harassment-of-women-at-workplace-act-2010',
    firstStep: 'File formal written complaint to internal Inquiry Committee or directly to the Provincial/Federal Ombudsman (Mohtasib).',
    firstStepUrdu: 'ادارے کی داخلی انکوائری کمیٹی یا براہ راست وفاقی/صوبائی محتسب برائے انسداد ہراسانی کو تحریری درخواست دیں۔',
    forum: 'Federal / Provincial Ombudsperson (Mohtasib) & Labour Courts',
    forumUrdu: 'وفاقی و صوبائی محتسب سیکرٹریٹ اور لیبر کورٹ',
    templateSlug: 'employment-contract-staff',
    templateTitle: 'Employment Contract'
  },
  {
    id: 'property',
    category: 'property',
    categoryName: 'Land & Property',
    categoryNameUrdu: 'اراضی و قبضہ مافیا',
    icon: Scale,
    color: '#0284c7',
    title: 'Property Fraud & Land Grabbing',
    titleUrdu: 'پراپرٹی فراڈ، جعلی رجسٹری و قبضہ مافیا',
    statute: 'Transfer of Property Act 1882, Specific Relief Act 1877 & Illegal Dispossession Act 2005',
    statuteUrdu: 'ٹرانسفر آف پراپرٹی ایکٹ، سپیسفک ریلیف ایکٹ اور ال لیگل ڈسپوزیشن ایکٹ 2005',
    statuteSlug: 'specific-relief-act-1877',
    firstStep: 'File suit for Declaration & Permanent Injunction with temporary stay application under Order 39 CPC.',
    firstStepUrdu: 'سول کورٹ میں دعویٰ استقرارِ حق بمع درخواست حکمِ امتناعی (اسٹے آرڈر) آرڈر 39 ضابطہ دیوانی دائر کریں۔',
    forum: 'Civil Court & Sessions Court under Illegal Dispossession Act',
    forumUrdu: 'سول کورٹ اور سیشن کورٹ',
    templateSlug: 'special-power-of-attorney-property',
    templateTitle: 'Power of Attorney'
  }
]

export default function FinderPage() {
  const { t, lang } = useLanguage()
  const [questions, setQuestions] = React.useState<Question[]>([])
  const [loading, setLoading] = React.useState(true)
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, FinderOption>>({})
  const [matchedSlugs, setMatchedSlugs] = React.useState<string[]>([])
  const [results, setResults] = React.useState<Law[] | null>(null)
  const [fetchingResults, setFetchingResults] = React.useState(false)
  const [roadmapCategory, setRoadmapCategory] = React.useState('all')

  React.useEffect(() => {
    fetch('/api/finder')
      .then((r) => r.json())
      .then((d) => { setQuestions(d.items ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredRoadmaps = React.useMemo(() => {
    if (roadmapCategory === 'all') return COMMON_ROADMAPS
    return COMMON_ROADMAPS.filter((rm) => rm.category === roadmapCategory)
  }, [roadmapCategory])

  const currentQuestion = questions[currentIdx]

  const handleAnswer = (opt: FinderOption) => {
    const newAnswers = { ...answers, [currentQuestion.id]: opt }
    setAnswers(newAnswers)

    const allSlugs = new Set<string>()
    Object.values(newAnswers).forEach((a) => {
      if (a.categoryIds) a.categoryIds.forEach((s) => allSlugs.add(s))
    })

    if (typeof opt.nextIdx === 'number' && opt.nextIdx >= 0 && opt.nextIdx < questions.length) {
      setCurrentIdx(opt.nextIdx)
      return
    }

    if (allSlugs.size > 0) {
      setMatchedSlugs(Array.from(allSlugs))
      finish(Array.from(allSlugs))
    } else {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1)
      } else {
        finish([])
      }
    }
  }

  const finish = async (slugs: string[]) => {
    setFetchingResults(true)
    try {
      const res = await fetch('/api/finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs }),
      })
      const data = await res.json()
      setResults(data.laws ?? [])
    } catch {
      setResults([])
    } finally {
      setFetchingResults(false)
    }
  }

  const restart = () => {
    setAnswers({})
    setMatchedSlugs([])
    setResults(null)
    setCurrentIdx(0)
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <span>{t('Legal Finder', 'قانونی رہنمائی')}</span>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md mb-2.5">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t('Which Law Applies to You?', 'آپ کے مسئلے پر کون سا قانون لاگو ہوتا ہے؟')}
        </h1>
        <p className="text-muted-foreground mt-1.5 text-xs sm:text-sm max-w-xl mx-auto">
          {t(
            'Interactive legal guide — take the step-by-step questionnaire or explore instant roadmaps for common Pakistani legal problems.',
            'انٹرایکٹو قانونی رہنمائی — مرحلہ وار سوال نامے کے ذریعے یا عام قانونی مسائل کے فوری روڈ میپ کے ذریعے حل تلاش کریں۔'
          )}
        </p>
      </div>

      {/* Emergency Helpline Bar */}
      <div className="mb-6 p-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-primary/5 flex items-center justify-between gap-3 flex-wrap text-xs shadow-xs">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <Phone className="h-4 w-4" />
          <span>{t('Emergency Official Helplines:', 'سرکاری ہنگامی ہیلپ لائنز:')}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap font-medium">
          <a href="tel:15" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <span>🚓</span> <span>{t('Police:', 'پولیس:')}</span> <strong className="font-mono text-primary font-bold">15</strong>
          </a>
          <a href="tel:1991" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <span>💻</span> <span>{t('Cyber Crime FIA:', 'سائبر کرائم:')}</span> <strong className="font-mono text-primary font-bold">1991</strong>
          </a>
          <a href="tel:1043" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <span>👩</span> <span>{t('Women Protection:', 'تحفظ خواتین:')}</span> <strong className="font-mono text-primary font-bold">1043</strong>
          </a>
          <a href="tel:1121" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
            <span>👶</span> <span>{t('Child Protection:', 'بچوں کا تحفظ:')}</span> <strong className="font-mono text-primary font-bold">1121</strong>
          </a>
        </div>
      </div>

      <Tabs defaultValue="roadmaps" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/60 border border-border/60">
            <TabsTrigger value="roadmaps" className="text-xs sm:text-sm cursor-pointer data-[state=active]:shadow-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              {t('Popular Roadmaps', 'فوری قانونی روڈ میپ')}
            </TabsTrigger>
            <TabsTrigger value="wizard" className="text-xs sm:text-sm cursor-pointer data-[state=active]:shadow-sm">
              <Compass className="h-3.5 w-3.5 mr-1.5 text-primary" />
              {t('Interactive Wizard', 'مرحلہ وار سوال نامہ')}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Instant Roadmaps */}
        <TabsContent value="roadmaps" className="space-y-5">
          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', en: 'All Roadmaps', ur: 'تمام مسائل' },
              { id: 'financial', en: 'Cheque & Banking', ur: 'چیک و بینکنگ' },
              { id: 'property', en: 'Tenancy & Land', ur: 'کرایہ داری و زمین' },
              { id: 'family', en: 'Family & Custody', ur: 'خاندانی و خلع' },
              { id: 'cyber', en: 'Cyber Crime', ur: 'سائبر کرائم' },
              { id: 'labour', en: 'Workplace & Salary', ur: 'ملازمت و تنخواہ' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setRoadmapCategory(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer',
                  roadmapCategory === cat.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'bg-card border-border/80 hover:bg-accent hover:border-border text-muted-foreground'
                )}
              >
                {lang === 'ur' ? cat.ur : cat.en}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoadmaps.map((rm) => {
              const Icon = rm.icon
              return (
                <Card
                  key={rm.id}
                  className="relative overflow-hidden border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: rm.color }}
                  />
                  <CardHeader className="pb-3 pt-5">
                    <div className="flex items-start gap-3.5">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                        style={{ background: `linear-gradient(135deg, ${rm.color}, ${rm.color}cc)` }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge variant="outline" className="text-[10px] font-medium px-2 py-0 border-border/60">
                            {lang === 'ur' ? rm.categoryNameUrdu : rm.categoryName}
                          </Badge>
                          {rm.helpline && (
                            <Badge variant="destructive" className="text-[10px] font-bold px-1.5 py-0 flex items-center gap-1">
                              <Phone className="h-2.5 w-2.5" /> {rm.helpline}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base font-bold group-hover:text-primary transition-colors leading-tight">
                          {lang === 'ur' ? rm.titleUrdu : rm.title}
                        </CardTitle>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1 font-medium">
                          {lang === 'ur' ? rm.statuteUrdu : rm.statute}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {/* Immediate Step Box */}
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                        <span className="font-bold text-[10px] text-primary uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="h-3 w-3 fill-primary/20 text-primary" />
                          {t('Immediate First Step:', 'پہلا فوری اقدام:')}
                        </span>
                        <p className="leading-relaxed text-foreground/90 text-xs">
                          {lang === 'ur' ? rm.firstStepUrdu : rm.firstStep}
                        </p>
                      </div>

                      {/* Forum Box */}
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-accent/20 border border-border/40 text-muted-foreground text-[11px]">
                        <Building2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">{t('Competent Forum / Court:', 'مجاز عدالت یا فورم:')}</strong>{' '}
                          <span>{lang === 'ur' ? rm.forumUrdu : rm.forum}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2 flex-wrap">
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs hover:border-primary/40 hover:text-primary">
                        <Link href={`/laws/${rm.statuteSlug}`}>
                          <BookOpen className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          {t('Read Statute', 'قانون پڑھیں')}
                        </Link>
                      </Button>
                      {rm.templateSlug && (
                        <Button asChild variant="secondary" size="sm" className="h-8 text-xs">
                          <Link href={`/templates/${rm.templateSlug}`}>
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            {t('Get Ready Template', 'تیار ٹیمپلیٹ لیں')}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Interactive Wizard */}
        <TabsContent value="wizard">
          {results ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 mb-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold">
                  {t('Recommended Laws for Your Situation', 'آپ کے مسئلے کے لیے تجویز کردہ قوانین')}
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t('Based on your answers, here are the most relevant Pakistani statutes.', 'آپ کے جوابات کی بنیاد پر یہ متعلقہ قوانین ہیں۔')}
                </p>
              </div>

              {results.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-10 text-center">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground text-sm">
                      {t('No specific match found. Please browse all laws or consult a lawyer.', 'کوئی مخصوص-match نہیں ملا۔ تمام قوانین دیکھیں یا وکیل سے رجوع کریں۔')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {results.map((law, i) => (
                    <Link key={law.slug} href={`/laws/${law.slug}`} className="block">
                      <Card className="group hover:shadow-md hover:border-primary/40 transition-all border-border/60">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-start gap-3.5">
                            <div
                              className="flex h-9 w-9 items-center justify-center rounded-full text-white shrink-0 text-xs font-bold"
                              style={{ backgroundColor: law.category.color ?? 'var(--primary)' }}
                            >
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Badge variant="outline" className="text-[10px]">{law.yearEnacted}</Badge>
                                <Badge variant="secondary" className="text-[10px]" style={law.category.color ? { color: law.category.color } : {}}>
                                  {lang === 'ur' && law.category.nameUrdu ? law.category.nameUrdu : law.category.name}
                                </Badge>
                              </div>
                              <h3 className="font-bold text-sm sm:text-base leading-snug group-hover:text-primary transition-colors">
                                {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                {lang === 'ur' && law.summaryUrdu ? law.summaryUrdu : law.summary ?? ''}
                              </p>
                            </div>
                            <ArrowRight className={cn('h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1', lang === 'ur' && 'rotate-180')} />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 justify-center pt-4">
                <Button onClick={restart} variant="outline" size="sm">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  {t('Start Over', 'دوبارہ سوال جواب کریں')}
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/laws">
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                    {t('Browse all laws', 'تمام قوانین دیکھیں')}
                  </Link>
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="py-12 space-y-4">
              <Skeleton className="h-8 w-1/2 mx-auto" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : !currentQuestion ? (
            <div className="py-16 text-center text-muted-foreground">
              {t('No questions currently available.', 'کوئی سوال دستیاب نہیں۔')}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{t('Question', 'سوال')} {currentIdx + 1} {t('of', 'از')} {questions.length}</span>
                  <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg md:text-xl leading-tight font-bold">
                    {lang === 'ur' && currentQuestion.questionUrdu ? currentQuestion.questionUrdu : currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-1">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = answers[currentQuestion.id]?.id === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleAnswer(opt)}
                        className={cn(
                          'w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer',
                          isSelected
                            ? 'bg-primary/10 border-primary text-primary font-semibold shadow-xs'
                            : 'bg-card border-border/70 hover:bg-accent hover:border-border text-foreground'
                        )}
                      >
                        <span>{lang === 'ur' && opt.labelUrdu ? opt.labelUrdu : opt.label}</span>
                        <ArrowRight className={cn('h-3.5 w-3.5 shrink-0 opacity-60', lang === 'ur' && 'rotate-180')} />
                      </button>
                    )
                  })}

                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                      className="text-xs"
                    >
                      <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                      {t('Previous', 'پچھلا سوال')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={restart} className="text-xs">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {t('Reset', 'ری سیٹ')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
