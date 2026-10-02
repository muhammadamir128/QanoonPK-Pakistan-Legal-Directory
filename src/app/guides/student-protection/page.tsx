'use client'

import Link from 'next/link'
import {
  Accessibility, ArrowRight, ArrowUpRight, BookOpen, ChevronRight, ClipboardList,
  GraduationCap, Home, Landmark, ReceiptText, Scale, ShieldAlert,
  ShieldCheck, Siren,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const hecResources = [
  {
    title: 'Protection against harassment in higher education',
    titleUr: 'اعلیٰ تعلیمی اداروں میں ہراسانی سے تحفظ',
    description: 'HEC’s revised policy covers the higher-education community. Students can approach their institution’s designated focal person or inquiry committee. The HEC policy is an institutional policy, not a standalone Act.',
    descriptionUr: 'HEC کی نظرثانی شدہ پالیسی اعلیٰ تعلیمی اداروں کی کمیونٹی پر لاگو ہوتی ہے۔ طالب علم اپنے ادارے کے فوکل پرسن یا انکوائری کمیٹی سے رجوع کر سکتے ہیں۔ یہ ادارہ جاتی پالیسی ہے، الگ قانون نہیں۔',
    href: 'https://www.hec.gov.pk/english/policies/Pages/HARASSMENT-POLICY.aspx',
    icon: ShieldAlert,
    label: 'HEC Policy · Revised 2025',
    labelUr: 'HEC پالیسی · نظرثانی 2025',
  },
  {
    title: 'Student Grievance Redressal Portal',
    titleUr: 'طلبہ شکایات کے ازالے کا پورٹل',
    description: 'HEC lists complaints including admission problems, misleading information, bribery, discrimination, harassment, unfair evaluation, scholarship, fee and administrative issues.',
    descriptionUr: 'HEC کے پورٹل پر داخلے، گمراہ کن معلومات، رشوت، امتیاز، ہراسانی، غیر منصفانہ جانچ، اسکالرشپ، فیس اور انتظامی مسائل کی شکایات درج کی جا سکتی ہیں۔',
    href: 'https://www.hec.gov.pk/urdu/services/students/Pages/GRP.aspx',
    icon: ClipboardList,
    label: 'Official complaint route',
    labelUr: 'سرکاری شکایتی راستہ',
  },
  {
    title: 'Students with disabilities',
    titleUr: 'معذوری کے ساتھ طلبہ',
    description: 'HEC’s policy aims to improve equal access and participation in academic and extracurricular life at higher education institutions.',
    descriptionUr: 'HEC کی پالیسی اعلیٰ تعلیمی اداروں میں مساوی رسائی اور تعلیمی و غیر نصابی سرگرمیوں میں شرکت کو بہتر بنانے کا ہدف رکھتی ہے۔',
    href: 'https://www.hec.gov.pk/english/policies/Pages/Policy.aspx',
    icon: Accessibility,
    label: 'HEC Policy',
    labelUr: 'HEC پالیسی',
  },
  {
    title: 'National fee-refund policy',
    titleUr: 'قومی فیس واپسی پالیسی',
    description: 'HEC publishes a fee-refund policy for students withdrawing from a course or programme. Check the current policy and your institution’s rules for applicable dates and deductions.',
    descriptionUr: 'HEC کورس یا پروگرام چھوڑنے والے طلبہ کے لیے فیس واپسی کی پالیسی شائع کرتا ہے۔ قابلِ اطلاق مدت اور کٹوتیوں کے لیے تازہ پالیسی اور اپنے ادارے کے قواعد دیکھیں۔',
    href: 'https://www.hec.gov.pk/english/policies/Pages/Fee-Refund-Policy.aspx',
    icon: ReceiptText,
    label: 'HEC Policy',
    labelUr: 'HEC پالیسی',
  },
  {
    title: 'Campus security and surveillance',
    titleUr: 'کیمپس سکیورٹی اور نگرانی',
    description: 'HEC’s campus policy sets a framework for security-camera use in university public areas to support personal safety and protection of property.',
    descriptionUr: 'HEC کی کیمپس پالیسی جامعات کے عوامی مقامات میں سکیورٹی کیمروں کے استعمال کا فریم ورک دیتی ہے، جس کا مقصد ذاتی تحفظ اور املاک کی حفاظت میں مدد کرنا ہے۔',
    href: 'https://www.hec.gov.pk/english/policies/Pages/Campus-Security-Policy.aspx',
    icon: Siren,
    label: 'HEC Policy',
    labelUr: 'HEC پالیسی',
  },
  {
    title: 'Drug and tobacco abuse at higher education institutions',
    titleUr: 'اعلیٰ تعلیمی اداروں میں منشیات اور تمباکو کا استعمال',
    description: 'HEC’s policy describes institutional prevention, awareness and reporting measures. For a health concern or report, contact the focal person designated by your institution.',
    descriptionUr: 'HEC کی پالیسی اداروں میں روک تھام، آگاہی اور رپورٹنگ کے اقدامات بیان کرتی ہے۔ صحت سے متعلق مدد یا رپورٹ کے لیے اپنے ادارے کے مقرر کردہ فوکل پرسن سے رابطہ کریں۔',
    href: 'https://www.hec.gov.pk/english/Documents/Policy%20on%20drugs%20and%20tobacco%20control%20at%20HEIs.pdf',
    icon: ShieldCheck,
    label: 'HEC Policy',
    labelUr: 'HEC پالیسی',
  },
]

export default function StudentProtectionGuide() {
  const { t } = useLanguage()

  return (
    <main className="container mx-auto max-w-6xl space-y-8 px-4 py-6 md:py-10">
      <nav aria-label={t('Breadcrumb', 'صفحہ کا راستہ')} className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-primary">
          <Home className="h-3.5 w-3.5" />
          {t('Home', 'صفحۂ اول')}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">{t('Student Protection Guide', 'طلبہ کے تحفظ کی رہنمائی')}</span>
      </nav>

      <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-5 shadow-sm md:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            {t('Pakistan · Student rights and support', 'پاکستان · طلبہ کے حقوق اور معاونت')}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-balance md:text-4xl">
            {t('Student Protection Laws & Support', 'طلبہ کے تحفظ کے قوانین اور معاونت')}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {t(
              'A practical guide to education rights, HEC policies and official complaint routes for students in Pakistan. Laws and policies vary by age, province and institution, so check the source that applies to your case.',
              'پاکستان میں طلبہ کے تعلیمی حقوق، HEC پالیسیوں اور سرکاری شکایتی راستوں کی عملی رہنمائی۔ قوانین اور پالیسیاں عمر، صوبے اور ادارے کے لحاظ سے مختلف ہو سکتی ہیں، اس لیے اپنے معاملے پر لاگو اصل ماخذ دیکھیں۔'
            )}
          </p>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="laws-heading">
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 id="laws-heading" className="text-xl font-bold">{t('Laws already in the directory', 'ڈائریکٹری میں موجود قوانین')}</h2>
            <p className="text-sm text-muted-foreground">{t('These are legislation; the HEC resources below are policies and complaint services.', 'یہ قانون سازی ہے؛ نیچے HEC کے وسائل پالیسیاں اور شکایتی خدمات ہیں۔')}</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Card className="h-full">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                {t('Right to Free and Compulsory Education Act 2012', 'مفت اور لازمی تعلیم کا حق ایکٹ 2012')}
              </CardTitle>
              <CardDescription>
                {t('The directory record covers the Islamabad Capital Territory and notes that provincial versions exist. It concerns children aged 5–16.', 'ڈائریکٹری کا ریکارڈ اسلام آباد کیپیٹل ٹیریٹری کا احاطہ کرتا ہے اور بتاتا ہے کہ صوبائی قوانین بھی موجود ہیں۔ یہ 5 تا 16 سال کے بچوں سے متعلق ہے۔')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <Link href="/laws/right-to-free-compulsory-education-act-2012" className="text-sm font-semibold text-primary hover:underline">
                {t('Read this law in QanoonPK', 'یہ قانون قانون پی کے پر پڑھیں')} <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <p className="mt-2 text-xs text-muted-foreground">
                {t('This implements the constitutional right in Article 25-A.', 'یہ آئین کے آرٹیکل 25-A میں درج حق پر عمل درآمد سے متعلق ہے۔')}{' '}
                <Link href="/laws/constitution-of-pakistan-1973" className="font-semibold text-primary hover:underline">
                  {t('Read the Constitution', 'آئین پڑھیں')}
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="h-4 w-4 text-primary" aria-hidden="true" />
                {t('Protection Against Harassment of Women at the Workplace Act 2010', 'کام کی جگہ پر خواتین کو ہراسانی سے تحفظ ایکٹ 2010')}
              </CardTitle>
              <CardDescription>
                {t('The HEC harassment policy identifies this Act, as amended, as a legal route alongside institutional complaint procedures. Check its scope and current amendments for your situation.', 'HEC کی ہراسانی پالیسی ادارے کے شکایتی طریقۂ کار کے ساتھ اس ترمیم شدہ ایکٹ کو قانونی راستے کے طور پر بیان کرتی ہے۔ اپنے معاملے کے لیے اس کا دائرۂ کار اور تازہ ترامیم دیکھیں۔')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <Link href="/laws/protection-against-harassment-of-women-at-workplace-act-2010" className="text-sm font-semibold text-primary hover:underline">
                {t('Read this law in QanoonPK', 'یہ قانون قانون پی کے پر پڑھیں')} <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Landmark className="h-4 w-4 text-primary" aria-hidden="true" />
                {t('Higher Education Commission Ordinance 2002', 'ہائر ایجوکیشن کمیشن آرڈیننس 2002')}
              </CardTitle>
              <CardDescription>
                {t('Establishes HEC and its higher-education regulatory role. This is not a standalone student-safety law.', 'HEC اور اعلیٰ تعلیم میں اس کے ضابطہ جاتی کردار کی بنیاد رکھتا ہے۔ یہ طلبہ کی حفاظت کا الگ قانون نہیں ہے۔')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <Link href="/laws/higher-education-commission-ordinance-2002" className="text-sm font-semibold text-primary hover:underline">
                {t('Read this law in QanoonPK', 'یہ قانون قانون پی کے پر پڑھیں')} <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="support-heading">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 id="support-heading" className="text-xl font-bold">{t('HEC protections and support', 'HEC کا تحفظ اور معاونت')}</h2>
            <p className="text-sm text-muted-foreground">{t('Open the official HEC source for the current policy and process.', 'موجودہ پالیسی اور طریقۂ کار کے لیے HEC کا سرکاری ماخذ کھولیں۔')}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hecResources.map((resource) => {
            const Icon = resource.icon
            return (
              <Card key={resource.title} className="h-full transition-colors hover:border-primary/40">
                <CardHeader className="p-4 pb-2">
                  <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-base">{t(resource.title, resource.titleUr)}</CardTitle>
                  <CardDescription>{t(resource.description, resource.descriptionUr)}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    {t(resource.label, resource.labelUr)}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <aside className="rounded-xl border border-border/70 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
        {t(
          'For an urgent safety threat, contact local emergency services or police. For a university complaint, keep relevant records and use your institution’s published focal-person or inquiry process; the HEC grievance portal is an additional route for listed student grievances. This guide is general information, not legal advice.',
          'فوری خطرے کی صورت میں مقامی ایمرجنسی سروس یا پولیس سے رابطہ کریں۔ یونیورسٹی کی شکایت کے لیے متعلقہ ریکارڈ محفوظ رکھیں اور ادارے کے شائع کردہ فوکل پرسن یا انکوائری طریقۂ کار سے رجوع کریں؛ HEC شکایتی پورٹل درج شدہ طلبہ شکایات کے لیے اضافی راستہ ہے۔ یہ عمومی معلومات ہیں، قانونی مشورہ نہیں۔'
        )}
      </aside>
    </main>
  )
}
