'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ShieldAlert, ShieldCheck, Scale, BookOpen, AlertTriangle,
  ArrowRight, ChevronRight, CheckCircle2, XCircle, FileText,
  HelpCircle, Home, Info, Lock, Flame, Gavel, Crosshair
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export default function SelfDefenceGuidePage() {
  const { t, lang } = useLanguage()
  const [filterType, setFilterType] = React.useState<'all' | 'body' | 'property' | 'procedure'>('all')

  const ppcSections = [
    {
      sec: '96',
      title: 'Things Done in Private Defence',
      titleUrdu: 'حقِ دفاع میں کیا گیا عمل',
      type: 'body',
      summary: 'Nothing is an offence which is done in the exercise of the right of private defence. If you act within statutory boundaries, your action is legally justified and immune from criminal culpability.',
      summaryUrdu: 'کوئی بھی عمل جو حقِ دفاعِ خود اختیاری (پرائیویٹ ڈیفنس) کے جائز استعمال میں کیا جائے وہ جرم نہیں ہے۔ اگر آپ قانونی حدود میں رہیں تو یہ عمل جرم کے دائرے سے باہر ہے۔',
      rule: 'Fundamental statutory immunity for lawful self-preservation.',
      ruleUrdu: 'اپنی حفاظت کے لیے کی گئی جائز کارروائی پر قانوناً کوئی جرم عائد نہیں ہوتا۔',
    },
    {
      sec: '97',
      title: 'Right of Body & Property',
      titleUrdu: 'اپنے اور دوسروں کے جسم و مال کا دفاع',
      type: 'body',
      summary: 'Every person has a right to defend their own body and the body of ANY other person against crimes affecting the human body. Similarly, every person may defend their own or another person’s property against theft, robbery, mischief, or criminal trespass.',
      summaryUrdu: 'ہر شہری کو نہ صرف اپنی بلکہ کسی بھی دوسرے انسان (بہن، بیٹی، پڑوسی، راہگیر) کے جسم کی حفاظت کا حق ہے۔ اسی طرح اپنے یا کسی دوسرے شخص کے مال کو چوری، ڈکیتی، شرارت یا غیر قانونی داخلے سے بچانے کا حق ہے۔',
      rule: 'Extends to protecting strangers and family members equally.',
      ruleUrdu: 'یہ حق صرف اپنی ذات تک محدود نہیں بلکہ دوسروں کی جان و مال بچانے پر بھی لاگو ہوتا ہے۔',
    },
    {
      sec: '98',
      title: 'Defence Against Non-Culpable Persons',
      titleUrdu: 'غیر ذمہ دار شخص کے خلاف بھی دفاع کا حق',
      type: 'body',
      summary: 'The right of private defence exists even if the assailant is a minor, suffering from mental illness (unsound mind), heavily intoxicated, or acting under a misconception of fact.',
      summaryUrdu: 'اگر حملہ آور کم عمری، پاگل پن، شدید نشے یا غلط فہمی کی وجہ سے قانونی طور پر مجرم نہ بھی ٹھہرایا جا سکتا ہو، تب بھی دفاع کرنے والے کو اس کے خلاف اپنے تحفظ کا وہی مکمل حق حاصل ہے۔',
      rule: 'Legal culpability of the attacker is irrelevant to your right to defend yourself.',
      ruleUrdu: 'حملہ آور کی ذہنی یا قانونی حالت جو بھی ہو، آپ کو اپنی جان بچانے کا پورا حق ہے۔',
    },
    {
      sec: '99',
      title: 'Statutory Limits & Restrictions (Crucial)',
      titleUrdu: 'حقِ دفاع کی حدود اور پابندیاں (انتہائی اہم)',
      type: 'procedure',
      summary: '1. No right against a public servant (e.g. police) acting in good faith under color of office without apprehension of death or grievous hurt. 2. No right when there is reasonable time to seek help from police or public authorities. 3. Proportionality: Force used must NEVER exceed what is strictly necessary for defense.',
      summaryUrdu: 'تین لازمی حدود: (1) پولیس یا سرکاری اہلکار کے خلاف حق نہیں ملتا جب تک جان جانے یا شدید چوٹ کا خطرہ نہ ہو۔ (2) اگر پولیس یا سرکاری مدد بلانے کا مناسب وقت ہو تو پہلے مدد لینی چاہیے۔ (3) ضرورت سے زیادہ نقصان پہنچانے کی اجازت نہیں؛ جتنی ضرورت ہو اتنی ہی طاقت استعمال کر سکتے ہیں۔',
      rule: 'Golden Rule: Excessive force or delayed retaliation turns defence into a crime.',
      ruleUrdu: 'سنہری اصول: ضرورت سے زائد طاقت کا استعمال یا خطرہ ٹلنے کے بعد جوابی کارروائی جرم بن جاتی ہے۔',
    },
    {
      sec: '100',
      title: 'Body Defence Extending to Causing Death (7 Grounds)',
      titleUrdu: 'جسم کی حفاظت میں جان لینے کی اجازت (7 صورتیں)',
      type: 'body',
      summary: 'Permits voluntarily causing death of the assailant under 7 specific threats: (1) Reasonable apprehension of death; (2) Apprehension of grievous hurt; (3) Intention of committing rape; (4) Gratifying unnatural lust; (5) Kidnapping or abduction; (6) Unlawful confinement preventing police recourse; (7) Acid throwing or attempted acid throwing.',
      summaryUrdu: 'سات سنگین صورتوں میں حملہ آور کی جان لینے کی اجازت ہے: (1) جان جانے کا معقول خطرہ۔ (2) شدید چوٹ کا خطرہ۔ (3) ریپ یا زنا بالجبر کی نیت سے حملہ۔ (4) غیر فطری جنسی زیادتی کی نیت۔ (5) اغوا یا بچے کو اٹھا لے جانے کا حملہ۔ (6) ایسا حبس بے جا جس میں پولیس مدد ناممکن ہو۔ (7) تیزاب پھینکنے یا اس کی کوشش کا حملہ۔',
      rule: 'Requires an objective, reasonable apprehension of extreme danger.',
      ruleUrdu: 'صرف وہم یا شک کافی نہیں؛ حالات ایسے ہوں جن میں واقعی شدید خطرہ محسوس ہو۔',
    },
    {
      sec: '101',
      title: 'Harm Short of Death (Body)',
      titleUrdu: 'جان کے علاوہ دیگر نقصان پہنچانے کا حق',
      type: 'body',
      summary: 'If the assault does not involve any of the 7 deadly categories in Section 100, the defender is legally entitled to inflict any harm or bodily restraint short of death to neutralize the attacker.',
      summaryUrdu: 'اگر حملہ دفعہ 100 کی 7 جان لیوا صورتوں میں سے نہ ہو، تو دفاع کرنے والے کو حملہ آور کو زخمی کرنے، روکنے یا مار پیٹ کر قابو کرنے کا حق ہے، لیکن جان لینا جائز نہیں۔',
      rule: 'Lethal force prohibited for minor, non-deadly scuffles.',
      ruleUrdu: 'معمولی جھگڑوں میں گولی چلانا یا جان لینا قتل مانا جائے گا۔',
    },
    {
      sec: '102',
      title: 'Commencement & Continuance (Body)',
      titleUrdu: 'دفاع کے حق کا آغاز اور خاتمہ',
      type: 'body',
      summary: 'Commences as soon as a reasonable apprehension of bodily danger arises (even before the first blow lands). Continues ONLY as long as such apprehension exists. When the attacker retreats or is disarmed, the right ceases immediately.',
      summaryUrdu: 'حق اسی لمحے شروع ہو جاتا ہے جب حملے کا معقول خطرہ پیدا ہو (پہلا وار ہونے کا انتظار ضروری نہیں)۔ یہ حق صرف اس وقت تک رہتا ہے جب تک خطرہ برقرار ہے۔ جیسے ہی حملہ آور بھاگ جائے یا بے بس ہو جائے، یہ حق فوراً ختم ہو جاتا ہے۔',
      rule: 'Attacking a fleeing or surrendered assailant is revenge/murder, not defence.',
      ruleUrdu: 'بھاگتے ہوئے یا قابو میں آئے حملہ آور کو مارنا سیلف ڈیفنس نہیں بلکہ انتقام اور جرم ہے۔',
    },
    {
      sec: '103',
      title: 'Property Defence Extending to Causing Death',
      titleUrdu: 'مال کی حفاظت میں جان لینے کی اجازت',
      type: 'property',
      summary: 'Causing death to protect property is permitted in 4 specific crimes: (1) Robbery (Dacoity/Armed Robbery); (2) House-breaking by night; (3) Arson/mischief by fire to a human dwelling or warehouse; (4) Theft, mischief, or trespass committed under circumstances causing fear of death or grievous hurt.',
      summaryUrdu: 'مال کے دفاع میں حملہ آور کی جان لینے کی اجازت صرف 4 صورتوں میں ہے: (1) ڈکیتی۔ (2) رات کے وقت گھر کا تالا توڑ کر یا نقب لگا کر گھسنا۔ (3) رہائشی مکان، خیمے یا مال کے گودام کو آگ لگانا۔ (4) چوری یا غیر قانونی داخلہ ایسے حالات میں جہاں جان یا شدید چوٹ کا معقول خطرہ ہو۔',
      rule: 'Cannot use lethal force against simple daytime shoplifting or sneak theft.',
      ruleUrdu: 'دن کے وقت عام چوری یا جیب کٹنے پر کسی کی جان لینا جائز نہیں۔',
    },
    {
      sec: '104',
      title: 'Harm Short of Death (Property)',
      titleUrdu: 'مال کی حفاظت میں جان کے علاوہ نقصان',
      type: 'property',
      summary: 'For ordinary daytime theft, mischief, or simple criminal trespass not falling under Section 103, force short of death may be used to protect or retrieve goods.',
      summaryUrdu: 'اگر چوری یا غیر قانونی داخلہ دفعہ 103 والی جان لیوا نوعیت کا نہ ہو، تو چور کو پکڑنے یا چوٹ پہنچانے کا حق ہے مگر جان لینا ممنوع ہے۔',
      rule: 'Prohibits lethal weapons against petty property trespass.',
      ruleUrdu: 'معمولی مال کے لیے مہلک ہتھیار کا استعمال ممنوع ہے۔',
    },
    {
      sec: '105',
      title: 'Commencement & Continuance (Property)',
      titleUrdu: 'مال کے دفاع کا دورانیہ',
      type: 'property',
      summary: 'Against theft: continues until the thief escapes with the property, public authority assistance is secured, or property is recovered. Against robbery: continues as long as robber threatens hurt or death.',
      summaryUrdu: 'چوری میں یہ حق تب تک رہتا ہے جب تک چور مال لے کر نکل نہ جائے یا پولیس نہ پہنچ جائے یا مال برآمد نہ ہو جائے۔ ڈکیتی میں جب تک ڈاکوؤں کی جانب سے موت یا چوٹ کا خطرہ باقی رہے۔',
      rule: 'Right expires once goods are either safely retrieved or the thief is out of range.',
      ruleUrdu: 'مال واپس مل جانے یا چور کے فرار ہو جانے پر حق ختم ہو جاتا ہے۔',
    },
    {
      sec: '106',
      title: 'Risk to Innocent Bystanders During Deadly Assault',
      titleUrdu: 'بے گناہ افراد کو خطرے کے دوران دفاع کا حق',
      type: 'procedure',
      summary: 'If a person faces a deadly mob or assault and cannot exercise self-defence without risking injury to an innocent bystander, the law permits running that risk without criminal liability.',
      summaryUrdu: 'اگر کسی شخص پر ایسا ہلاکت خیز ہجوم یا حملہ ہو جائے کہ اپنے دفاع کے لیے گولی چلانے یا مزاحمت کرنے میں کسی بے گناہ راہگیر کو نادانستہ نقصان پہنچنے کا خدشہ ہو، تو قانون یہ خطرہ مول لینے کی اجازت دیتا ہے اور وہ مجرم نہیں بنتا۔',
      rule: 'Exceptional defense doctrine in life-or-death mob violence situations.',
      ruleUrdu: 'ہلاکت خیز حملوں یا ہجوم کے تشدد میں جان بچانے کا استثنائی اصول۔',
    },
  ]

  const supportingStatutes = [
    {
      title: 'Pakistan Penal Code 1860 (PPC 96–106)',
      titleUrdu: 'مجموعہ تعزیراتِ پاکستان 1860',
      slug: 'pakistan-penal-code-1860',
      role: 'Substantive Law',
      roleUrdu: 'بنیادی تعزیری قانون',
      desc: 'Contains the complete statutory definitions, grounds, and boundaries of lawful self-defence for body and property.',
      descUrdu: 'جسم اور مال کی حفاظت کے حقِ دفاع کی قانونی تعریفات، حدود اور استثنیٰ کا احاطہ کرتا ہے۔',
    },
    {
      title: 'Code of Criminal Procedure 1898 (CrPC)',
      titleUrdu: 'مجموعہ ضابطہ فوجداری 1898',
      slug: 'code-of-criminal-procedure-1898',
      role: 'Procedural Law',
      roleUrdu: 'طریقۂ کار کا ضابطہ',
      desc: 'Governs FIR registration (Section 154), counter-FIRs, police investigation, bail considerations, and session court trials.',
      descUrdu: 'ایف آئی آر کا اندراج (دفعہ 154)، کراس ایف آئی آر، پولیس تفتیش، ضمانت اور ٹرائل کا طریقۂ کار۔',
    },
    {
      title: 'Qanun-e-Shahadat Order 1984',
      titleUrdu: 'قانونِ شہادت آرڈر 1984',
      slug: 'qanun-e-shahadat-order-1984',
      role: 'Law of Evidence',
      roleUrdu: 'قانونِ شہادت و ثبوت',
      desc: 'Under Article 121, the burden of proving private defence lies on the accused, but only on the balance of probabilities. Medico-legal reports, injuries on the accused, and scene photographs are vital.',
      descUrdu: 'آرٹیکل 121 کے تحت دفاع کا دعویٰ ثابت کرنے کا ثبوت ملزم پر ہوتا ہے لیکن معقول امکان کی حد تک۔ ملزم کے جسم پر چوٹیں اور میڈیکل رپورٹ سب سے قیمتی ثبوت ہوتے ہیں۔',
    },
    {
      title: 'Qisas and Diyat Provisions (PPC 299–338)',
      titleUrdu: 'قصاص و دیت کے احکام (پی پی سی 299–338)',
      slug: 'pakistan-penal-code-1860',
      role: 'Homicide Framework',
      roleUrdu: 'قتل و جراحت کا فریم ورک',
      desc: 'If self-defence is legally established under Section 96, no crime is committed. However, if the accused exceeded the right of private defence, the offense may be reduced to culpable homicide not amounting to murder, attracting Diyat or Ta\'zir.',
      descUrdu: 'اگر حقِ دفاع ثابت ہو جائے تو کوئی جرم نہیں۔ لیکن اگر دفاع میں ضرورت سے زیادہ طاقت استعمال کی جائے تو معاملہ قتلِ خطا یا تعزیر و دیت کے دائرے میں آ سکتا ہے۔',
    },
    {
      title: 'Pakistan Arms Ordinance 1965',
      titleUrdu: 'پاکستان آرمز آرڈیننس 1965',
      slug: 'arms-ordinance-1965',
      role: 'Firearms & Weapons Law',
      roleUrdu: 'اسلحہ و آتشیں ہتھیاروں کا قانون',
      desc: 'Regulates weapon licenses and carrying permits. Using an unlicensed weapon in genuine self-defense may still protect you from murder charges, but a separate criminal prosecution for unlicensed firearm possession under Section 13 will apply.',
      descUrdu: 'بغیر لائسنس ہتھیار سے اپنی جان بچانے پر قتل کے الزام سے تو بچاؤ ہو سکتا ہے مگر بغیر لائسنس اسلحہ رکھنے کا الگ فوجداری مقدمہ ضرور بنتا ہے۔',
    },
  ]

  const scenarios = [
    {
      action: 'An attacker pulls a gun or knife threatening to kill you, and you shoot or strike him to save your life.',
      actionUrdu: 'حملہ آور آپ پر بندوق یا چھری تان کر جان لینے کی کوشش کرتا ہے اور آپ جان بچانے کے لیے اس پر وار کرتے ہیں۔',
      status: 'PERMITTED',
      law: 'PPC Section 100(1)',
      reason: 'Reasonable apprehension of death justifies lethal self-defence.',
      reasonUrdu: 'موت کا معقول خطرہ ہونے پر حملہ آور کی جان لینے کی قانونی اجازت ہے۔',
    },
    {
      action: 'A woman or girl is assaulted with an intent to commit rape, and she stabs or injures the assailant fatally.',
      actionUrdu: 'کسی لڑکی یا خاتون پر زنا بالجبر (ریپ) کی نیت سے حملہ ہوتا ہے اور وہ مزاحمت میں حملہ آور کو شدید زخمی یا ہلاک کر دیتی ہے۔',
      status: 'PERMITTED',
      law: 'PPC Section 100(3)',
      reason: 'Law explicitly allows causing death to prevent rape or sexual assault.',
      reasonUrdu: 'ریپ کی کوشش پر حملہ آور کو ہلاک کرنے کی صریح قانونی اجازت موجود ہے۔',
    },
    {
      action: 'Armed robbers break into a home at night, and the resident shoots to defend his family and property.',
      actionUrdu: 'رات کے وقت مسلح ڈاکو گھر میں دروازہ توڑ کر داخل ہوتے ہیں اور مکین اپنی حفاظت میں گولی چلا دیتا ہے۔',
      status: 'PERMITTED',
      law: 'PPC Section 103(1) & (2)',
      reason: 'Robbery and house-breaking by night permit lethal force.',
      reasonUrdu: 'ڈکیتی اور رات کی نقب زنی میں مال اور جان کے دفاع میں موت تک کا حق ہے۔',
    },
    {
      action: 'A thief snatches a mobile phone and is running away down the street; you shoot him in the back.',
      actionUrdu: 'چور موبائل چھین کر سڑک پر بھاگ رہا ہے اور آپ پیچھے سے اس پر گولی چلا کر مار دیتے ہیں۔',
      status: 'PROHIBITED',
      law: 'PPC Section 99, 102 & 104',
      reason: 'Illegal: No imminent danger to life existed, theft was simple, and danger had ceased.',
      reasonUrdu: 'غیر قانونی: جان کا کوئی خطرہ نہ تھا، چوری میں جان لینے کا حق نہیں اور خطرہ ختم ہو چکا تھا۔',
    },
    {
      action: 'An assailant drops his weapon and raises his hands to surrender, but you continue beating him to death.',
      actionUrdu: 'حملہ آور کا ہتھیار گر جاتا ہے اور وہ ہاتھ اٹھا دیتا ہے مگر آپ غصے میں اسے جان سے مار دیتے ہیں۔',
      status: 'PROHIBITED',
      law: 'PPC Section 99 & 102',
      reason: 'Illegal: Right expires as soon as danger ends. This constitutes revenge/murder.',
      reasonUrdu: 'غیر قانونی: خطرہ ختم ہوتے ہی حق ختم ہو جاتا ہے۔ یہ دفاع نہیں بلکہ انتقام اور قتل ہے۔',
    },
    {
      action: 'Police arrive with an arrest warrant and you attack them claiming self-defense against arrest.',
      actionUrdu: 'پولیس گرفتاری کے لیے وارنٹ لے کر آتی ہے اور آپ پولیس پر حملہ کر کے سیلف ڈیفنس کا دعویٰ کرتے ہیں۔',
      status: 'PROHIBITED',
      law: 'PPC Section 99(1)',
      reason: 'No private defence against public servants acting in good faith under color of office.',
      reasonUrdu: 'سرکاری ملازم کی نیک نیتی پر مبنی قانونی کارروائی کے خلاف حقِ دفاع نہیں ملتا۔',
    },
  ]

  const filteredPPC =
    filterType === 'all' ? ppcSections : ppcSections.filter((s) => s.type === filterType)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span>{t('Home', 'صفحۂ اول')}</span>
        </Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <span className="text-foreground font-medium">{t('Self-Defence Laws Guide', 'حقِ دفاعِ خود اختیاری گائیڈ')}</span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-blue-600/10 via-card to-background p-6 md:p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{t('Pakistan Criminal Law & Self-Preservation Rights', 'پاکستانی فوجداری قانون و حقِ دفاعِ خود اختیاری')}</span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance text-foreground">
            {t(
              'Private Defence (Self-Defence) Laws in Pakistan: Complete Guide',
              'پاکستان میں حقِ دفاعِ خود اختیاری (سیلف ڈیفنس) کے قوانین: مکمل گائیڈ'
            )}
          </h1>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t(
              'Under Pakistan Penal Code (PPC) Sections 96 to 106 and the Constitution of Pakistan (Articles 4, 9, 14), every citizen has the inalienable legal right to use proportional force to defend their life, the life of others, and their property. Understand the exact legal boundaries, when lethal force is justified, evidentiary rules under CrPC and Qanun-e-Shahadat, and what courts require.',
              'پاکستان پینل کوڈ کی دفعات 96 تا 106 اور آئینِ پاکستان کے تحت ہر شہری کو اپنی جان، دوسروں کی جان اور اپنے مال کے دفاع کے لیے متناسب طاقت کے استعمال کا مکمل قانونی حق حاصل ہے۔ جانیے دفاع کی شرائط، کب جان لینا جائز ہے، شواہد کی اہمیت اور عدالتی طریقہ کار۔'
            )}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400">
              <Scale className="h-3 w-3 mr-1" />
              {t('5 Statutory Frameworks', '5 بنیادی قوانین')}
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400">
              <Gavel className="h-3 w-3 mr-1" />
              {t('11 Core PPC Sections (96–106)', '11 اہم دفعات (پی پی سی 96 تا 106)')}
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="h-3 w-3 mr-1" />
              {t('Constitutional Foundation: Articles 4, 9, 14', 'آئینی بنیاد: آرٹیکلز 4، 9، 14')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Constitutional Foundation Card */}
      <Card className="border border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-base md:text-lg">
              {t('Constitutional Foundation of Private Defence', 'حقِ دفاع کی آئینی بنیاد')}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {t(
              'The Constitution of Pakistan 1973 provides the supreme legal basis for self-protection.',
              '1973 کا آئینِ پاکستان شہریوں کی جان، وقار اور جائیداد کی حفاظت کی اعلیٰ ترین ضمانت دیتا ہے۔'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
          <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-1.5">
            <span className="font-bold text-foreground text-xs block">
              {t('Article 9: Security of Person', 'آرٹیکل 9: جان کا تحفظ')}
            </span>
            <p className="text-[11px] leading-relaxed">
              {t(
                'No person shall be deprived of life or liberty save in accordance with law. The state recognizes a citizen\'s right to defend their own life when under imminent unlawful threat.',
                'کسی شخص کو اس کی جان یا آزادی سے محروم نہیں کیا جائے گا۔ ریاست ہر شہری کو غیر قانونی حملے سے اپنی جان بچانے کا حق تسلیم کرتی ہے۔'
              )}
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-1.5">
            <span className="font-bold text-foreground text-xs block">
              {t('Article 4: Right to Lawful Treatment', 'آرٹیکل 4: قانون کے مطابق سلوک کا حق')}
            </span>
            <p className="text-[11px] leading-relaxed">
              {t(
                'To enjoy the protection of law and to be treated in accordance with law is the inalienable right of every citizen. An aggressor loses legal immunity when committing a crime.',
                'قانون کی حفاظت حاصل کرنا اور قانون کے مطابق سلوک پانا ہر شہری کا بنیادی حق ہے۔ حملہ آور جرم کر کے اپنے قانونی استثنیٰ سے محروم ہو جاتا ہے۔'
              )}
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-1.5">
            <span className="font-bold text-foreground text-xs block">
              {t('Article 14: Dignity of Man & Home', 'آرٹیکل 14: انسانی عزت اور گھر کا تقدس')}
            </span>
            <p className="text-[11px] leading-relaxed">
              {t(
                'The dignity of man and the privacy of home shall be inviolable. This is why PPC 103 authorizes lethal force against nighttime house-breaking and violent dwelling violations.',
                'انسان کی عزت اور گھر کا تقدس ناقابلِ تسخیر ہے۔ اسی لیے پی پی سی 103 رات کے وقت گھر کا تقدس پامال کرنے والے حملہ آور کے خلاف مہلک طاقت کی اجازت دیتی ہے۔'
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* The 5 Pillars Table */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">
          {t('The 5 Legal Pillars of Self-Defence in Pakistan', 'پاکستان میں سیلف ڈیفنس کے 5 بنیادی ستون')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {supportingStatutes.map((s, idx) => (
            <Card key={idx} className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30">
                    {t(s.role, s.roleUrdu)}
                  </Badge>
                  <Link
                    href={`/laws/${s.slug}`}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t('View Law', 'قانون دیکھیں')}</span>
                    <ArrowRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
                  </Link>
                </div>
                <h3 className="text-sm font-bold text-foreground">{t(s.title, s.titleUrdu)}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(s.desc, s.descUrdu)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* PPC Sections 96–106 Interactive Breakdown */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {t('PPC Sections 96 to 106: Detailed Section-by-Section Law', 'تعزیراتِ پاکستان کی دفعات 96 تا 106 کی تفصیلی تشریح')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('Filter by scope: body, property, or legal procedure.', 'دائرہ کار کے لحاظ سے دیکھیں: جسم، مال، یا قانونی ضابطہ۔')}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-muted/50 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setFilterType('all')}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                filterType === 'all'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('All 11 Sections', 'تمام 11 دفعات')}
            </button>
            <button
              onClick={() => setFilterType('body')}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                filterType === 'body'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('Body Defence', 'جسم کا دفاع')}
            </button>
            <button
              onClick={() => setFilterType('property')}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                filterType === 'property'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('Property Defence', 'مال کا دفاع')}
            </button>
            <button
              onClick={() => setFilterType('procedure')}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                filterType === 'procedure'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('Limits & Rules', 'حدود و قواعد')}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPPC.map((sec) => (
            <Card key={sec.sec} className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Badge className="bg-primary text-primary-foreground font-mono text-xs px-2.5 py-0.5">
                      Section {sec.sec}
                    </Badge>
                    <h3 className="text-base font-bold text-foreground">
                      {t(sec.title, sec.titleUrdu)}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-[10px] w-fit">
                    PPC 1860
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-3">
                <p className="text-xs md:text-sm text-foreground leading-relaxed">
                  {t(sec.summary, sec.summaryUrdu)}
                </p>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-xs flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground font-medium">
                    <strong className="text-foreground">{t('Key Takeaway: ', 'اہم قانونی نکتہ: ')}</strong>
                    {t(sec.rule, sec.ruleUrdu)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Practical Scenarios: What is Legal vs Illegal */}
      <Card className="border border-border/70 bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-primary" />
            <CardTitle className="text-base md:text-lg">
              {t('Practical Scenarios: Permitted vs Prohibited Self-Defence', 'عملی صورتیں: کیا جائز ہے اور کیا جرم بنتا ہے؟')}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {t(
              'Real-world legal outcomes based on superior court judgments in Pakistan.',
              'پاکستانی عدالتوں کے نظائر پر مبنی عملی صورتیں اور ان کی قانونی حیثیت۔'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-3">
          <div className="space-y-3">
            {scenarios.map((sc, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-xl border p-3.5 space-y-2 transition-colors',
                  sc.status === 'PERMITTED'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    {sc.status === 'PERMITTED' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                    )}
                    <span
                      className={cn(
                        'text-xs font-bold uppercase tracking-wider',
                        sc.status === 'PERMITTED'
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-red-700 dark:text-red-300'
                      )}
                    >
                      {sc.status === 'PERMITTED' ? t('Legally Permitted', 'قانوناً جائز') : t('Illegal & Unjustified', 'غیر قانونی و قابلِ سزا')}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] w-fit">
                    {sc.law}
                  </Badge>
                </div>

                <p className="text-xs font-medium text-foreground leading-relaxed">
                  {t(sc.action, sc.actionUrdu)}
                </p>

                <p className="text-[11px] text-muted-foreground leading-snug">
                  <strong>{t('Legal Basis: ', 'قانونی وجہ: ')}</strong>
                  {t(sc.reason, sc.reasonUrdu)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DOs */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 md:p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{t('What to Do if You Act in Self-Defence', 'سیلف ڈیفنس کی صورت میں کیا کریں')}</span>
          </div>
          <ul className="text-xs md:text-sm text-foreground space-y-2 list-disc pl-5 leading-relaxed">
            <li>
              <strong>{t('Use Only Necessary Force: ', 'صرف ضروری طاقت: ')}</strong>
              {t('Stop your defensive action the exact second the attacker drops the weapon or retreats.', 'جیسے ہی حملہ آور ہتھیار پھینک دے یا بھاگنے لگے فوراً حملہ روک دیں۔')}
            </li>
            <li>
              <strong>{t('Call 15 Police Immediately: ', 'فوری 15 پر اطلاع: ')}</strong>
              {t('Be the first to report the crime. Any delay in calling police creates suspicion of murder.', 'سب سے پہلے خود پولیس کو مطلع کریں۔ تاخیر سے مقدمے میں شکوک پیدا ہوتے ہیں۔')}
            </li>
            <li>
              <strong>{t('Get Medico-Legal Examination: ', 'میڈیکل معائنہ کروائیں: ')}</strong>
              {t('Have government doctors officially document all cuts, bruises, or fractures on your body.', 'اپنے جسم کے تمام زخموں اور چوٹوں کا سرکاری ہسپتال سے میڈیکو لیگل کروائیں۔')}
            </li>
            <li>
              <strong>{t('Preserve the Scene & Proof: ', 'شواہد اور جگہ محفوظ رکھیں: ')}</strong>
              {t('Do not move weapons, preserve CCTV recordings, and note eyewitness names.', 'جائے وقوعہ سے ہتھیار نہ ہٹائیں اور سی سی ٹی وی فوٹیج محفوظ کریں۔')}
            </li>
          </ul>
        </div>

        {/* DONTs */}
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 md:p-6 space-y-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
            <XCircle className="h-5 w-5 shrink-0" />
            <span>{t('What NEVER to Do', 'کیا ہرگز نہ کریں')}</span>
          </div>
          <ul className="text-xs md:text-sm text-foreground space-y-2 list-disc pl-5 leading-relaxed">
            <li>
              <strong>{t('Never Pursue or Seek Revenge: ', 'انتقامی کارروائی ہرگز نہ کریں: ')}</strong>
              {t('Shooting or stabbing an assailant who is running away is murder, not defence.', 'بھاگتے ہوئے چور یا حملہ آور کے پیچھے جا کر گولی چلانا قتل بن جاتا ہے۔')}
            </li>
            <li>
              <strong>{t('Never Tamper with Evidence: ', 'شواہد سے چھیڑ چھاڑ نہ کریں: ')}</strong>
              {t('Do not plant weapons, alter the crime scene, or wash bloodstains before police arrival.', 'موقع سے شواہد نہ مٹائیں اور نہ ہی کوئی جعلی ہتھیار رکھنے کی کوشش کریں۔')}
            </li>
            <li>
              <strong>{t('Never Carry Unlicensed Firearms: ', 'بغیر لائسنس اسلحہ نہ رکھیں: ')}</strong>
              {t('Even if self-defense is accepted, an unlicensed weapon attracts a separate 7-year prison term.', 'بغیر لائسنس اسلحے پر 7 سال قید کا الگ مقدمہ بنتا ہے۔')}
            </li>
            <li>
              <strong>{t('Never Give Statements Without Counsel: ', 'بغیر وکیل بیان نہ دیں: ')}</strong>
              {t('Always seek legal representation before recording formal Section 164 statements.', 'باضابطہ بیان ریکارڈ کروانے سے پہلے کسی باصلاحیت وکیل سے مشاورت کریں۔')}
            </li>
          </ul>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">
          {t('Legal Information Disclaimer', 'قانونی دستبرداری')}
        </p>
        <p>
          {t(
            'This guide is compiled for educational, research, and public legal literacy purposes under the QanoonPK directory. The law of private defence in Pakistan is fact-specific, and the burden of proving private defence rests upon the accused under Article 121 of the Qanun-e-Shahadat Order. Always consult a qualified criminal advocate of the High Court for formal legal advice.',
            'یہ گائیڈ صرف تعلیمی اور عوامی قانونی آگاہی کے لیے تیار کی گئی ہے۔ حقِ دفاع کا انحصار ہر کیس کے معروضی حالات اور شواہد پر ہوتا ہے، اور قانونِ شہادت کے آرٹیکل 121 کے تحت اس کو ثابت کرنا ضروری ہوتا ہے۔ کسی بھی معاملے میں ہائی کورٹ کے مستند فوجداری وکیل سے قانونی رہنمائی حاصل کریں۔'
          )}
        </p>
      </div>
    </div>
  )
}
