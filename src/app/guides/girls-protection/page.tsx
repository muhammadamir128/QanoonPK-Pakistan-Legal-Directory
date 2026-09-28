'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ShieldAlert, ShieldCheck, HeartHandshake, PhoneCall, Scale, BookOpen,
  AlertTriangle, Clock, ArrowRight, ChevronRight, CheckCircle2,
  FileText, ExternalLink, HelpCircle, UserCheck, Flame, Home, Info, Lock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

interface StatuteCardProps {
  number: number
  title: string
  titleUrdu: string
  year: number
  slug: string
  category: string
  categoryUrdu: string
  whyExists: string
  whyExistsUrdu: string
  keySections: {
    section: string
    title: string
    titleUrdu: string
    summary: string
    summaryUrdu: string
  }[]
  penalties: string
  penaltiesUrdu: string
}

export default function GirlsProtectionGuidePage() {
  const { t, lang } = useLanguage()
  const [activeCategory, setActiveCategory] = React.useState<number | 'all'>('all')

  const categories = [
    { id: 1, title: 'Offenses & Penalties', titleUrdu: 'جرم اور سزا کے قوانین', count: 4 },
    { id: 2, title: 'Investigation, Trial & Evidence', titleUrdu: 'تفتیش، ٹرائل اور ثبوت کے قوانین', count: 3 },
    { id: 3, title: 'Child Protection & Recovery', titleUrdu: 'بچوں کے تحفظ و بازیابی کے قوانین', count: 6 },
    { id: 4, title: 'Child Marriage Restraint', titleUrdu: 'کم عمری کی شادی کی روک تھام', count: 3 },
  ]

  const emergencyHelplines = [
    {
      number: '15',
      title: 'Police Emergency',
      titleUrdu: 'پولیس ایمرجنسی',
      desc: 'Immediate law enforcement intervention & FIR initiation',
      descUrdu: 'فوری پولیس مدد اور ایف آئی آر کے اندراج کے لیے',
      color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    },
    {
      number: '1099',
      title: 'Zainab Alert & MoHR',
      titleUrdu: 'زینب الرٹ و وزارتِ انسانی حقوق',
      desc: 'Toll-free national helpline for child abuse and missing children',
      descUrdu: 'گمشدہ بچوں اور زیادتی کے کیسز کے لیے قومی مفت ہیلپ لائن',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      number: '1121',
      title: 'Child Protection Bureau',
      titleUrdu: 'چائلڈ پروٹیکشن بیورو (پنجاب)',
      desc: '24/7 rescue, shelter, and legal custody for vulnerable children in Punjab',
      descUrdu: 'پنجاب میں متاثرہ بچوں کی بازیابی، پناہ اور قانونی امداد',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    {
      number: '1098',
      title: 'National Child Helpline',
      titleUrdu: 'قومی چائلڈ ہیلپ لائن (مددگار)',
      desc: 'Counseling, psycho-social support, and crisis intervention',
      descUrdu: 'نفساتی رہنمائی، کونسلنگ اور قانونی مشاورت',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
  ]

  const statutes: (StatuteCardProps & { catId: number })[] = [
    // Category 1
    {
      catId: 1,
      number: 1,
      title: 'Pakistan Penal Code 1860 (PPC)',
      titleUrdu: 'مجموعہ تعزیراتِ پاکستان 1860',
      year: 1860,
      slug: 'pakistan-penal-code-1860',
      category: 'Criminal Law',
      categoryUrdu: 'فوجداری قانون',
      whyExists:
        'The principal penal code defining criminal offenses against the human body. Following landmark amendments in 2016 and 2021, it establishes gender-neutral sexual assault definitions, makes intercourse with a girl under 16 statutory rape (consent is legally impossible), criminalizes gang rape with capital punishment, and penalizes child exploitation and pornography.',
      whyExistsUrdu:
        'پاکستان کا بنیادی تعزیری ضابطہ جو خواتین اور بچیوں کے خلاف جنسی جرائم کی روک تھام کرتا ہے۔ 2016 اور 2021 کی ترامیم کے تحت 16 سال سے کم عمر لڑکی کے ساتھ جنسی تعلق ہر صورت ریپ قرار دیا گیا ہے، گینگ ریپ پر سزائے موت ہے، اور چائلڈ پورنوگرافی کو سخت قابلِ تعزیر جرم بنایا گیا ہے۔',
      keySections: [
        {
          section: '375',
          title: 'Definition of Rape & Non-Consent',
          titleUrdu: 'ریپ کی تعریف و عدم رضامندی',
          summary: 'Broad definition; lack of physical resistance does NOT imply consent. Intercourse with a female under 16 is statutory rape regardless of alleged consent.',
          summaryUrdu: 'جسمانی مزاحمت نہ کرنا رضامندی نہیں مانا جائے گا۔ 16 سال سے کم عمر بچی کے معاملے میں رضامندی کا کوئی عذر قانونی طور پر قابل قبول نہیں۔',
        },
        {
          section: '375A',
          title: 'Gang Rape',
          titleUrdu: 'گینگ ریپ',
          summary: 'Rape committed by two or more individuals acting with common intention.',
          summaryUrdu: 'دو یا زائد افراد کا مل کر زیادتی کرنا؛ لازمی سزائے موت یا عمر قید۔',
        },
        {
          section: '376',
          title: 'Punishment for Rape',
          titleUrdu: 'ریپ کی سزائیں',
          summary: '10 to 25 years or life imprisonment. Strict death penalty or life imprisonment for rape of a minor child, impaired person, or abuse of authority by public servants.',
          summaryUrdu: 'عام زیادتی پر 10 سے 25 سال قید یا عمر قید۔ نابالغ بچے، معذور یا سرکاری اہلکار کی جانب سے اختیارات کے غلط استعمال پر سزا صرف موت یا عمر قید۔',
        },
        {
          section: '377A & 377B',
          title: 'Child Sexual Abuse',
          titleUrdu: 'بچوں کا جنسی استحصال',
          summary: 'Indecent touching, caressing, or sexual exploitation of any person under 18 punishable with 3 to 7 years rigorous imprisonment and fine.',
          summaryUrdu: '18 سال سے کم عمر بچے سے دست درازی یا جنسی بدسلوکی پر 3 سے 7 سال قید اور جرمانہ۔',
        },
        {
          section: '292A & 292B',
          title: 'Child Pornography & Obscenity',
          titleUrdu: 'چائلڈ پورنوگرافی و فحش مواد',
          summary: 'Producing, transmitting, or distributing obscene material involving children punishable with up to 7 years imprisonment.',
          summaryUrdu: 'بچوں کا فحش مواد بنانا، رکھنا یا پھیلانا 7 سال تک قید کی سزا ہے۔',
        },
        {
          section: '228A',
          title: 'Victim Identity Protection',
          titleUrdu: 'متاثرہ کی شناخت ظاہر کرنے پر ممانعت',
          summary: 'Printing or disclosing the name or identity of a rape victim without legal authorization is an offense carrying up to 3 years imprisonment.',
          summaryUrdu: 'متاثرہ کا نام یا شناخت ظاہر کرنا قابل تعزیر جرم ہے جس کی سزا 3 سال قید ہے۔',
        },
      ],
      penalties: 'Death Penalty, Life Imprisonment (counted as 25 years or natural life), 10–25 years rigorous imprisonment, and substantial fines.',
      penaltiesUrdu: 'سزائے موت، عمر قید، 10 سے 25 سال سخت قید، اور بھاری مالی جرمانہ۔',
    },
    {
      catId: 1,
      number: 2,
      title: 'Protection of Women (Criminal Laws Amendment) Act, 2006',
      titleUrdu: 'تحفظِ نسواں (فوجداری قوانین ترمیمی) ایکٹ 2006',
      year: 2006,
      slug: 'protection-of-women-act-2006',
      category: "Women's Rights Law",
      categoryUrdu: 'خواتین کے حقوق کا قانون',
      whyExists:
        'Passed to reverse the unjust consequences of the 1979 Hudood Ordinance. Previously, female rape victims risked being wrongfully charged with zina (fornication) if they could not produce four pious male eyewitnesses. This landmark act separated rape from Hudood and restored it to the civil Pakistan Penal Code, guaranteeing criminal trials under standard due process.',
      whyExistsUrdu:
        '1979 کے حدود آرڈیننس کے منفی اثرات ختم کرنے کے لیے منظور کیا گیا۔ پہلے زیادتی کی شکار خاتون پر چار مرد گواہ نہ لانے کی صورت میں خود زنا کا جھوٹا مقدمہ بننے کا خطرہ رہتا تھا۔ اس قانون نے ریپ کو حدود سے نکال کر عام فوجداری قانون میں شامل کیا تاکہ خواتین بلا خوف انصاف مانگ سکیں۔',
      keySections: [
        {
          section: 'Section 1',
          title: 'Removal from Hudood Framework',
          titleUrdu: 'حدود آرڈیننس سے اخراج',
          summary: 'Abolished Zina-bil-Jabr from the 1979 ordinance and placed all rape offenses under Sections 375–376 of the PPC.',
          summaryUrdu: 'زنا بالجبر کو حدود سے نکال کر پاکستان پینل کوڈ کی دفعات 375 اور 376 میں شامل کر دیا۔',
        },
        {
          section: 'Section 5',
          title: 'Due Process Safeguards',
          titleUrdu: 'ٹرائل کے حفاظتی ضوابط',
          summary: 'Protects victims from malicious counter-allegations and mandates sessions court jurisdiction.',
          summaryUrdu: 'متاثرہ کے خلاف جھوٹی کارروائیوں کا تدارک اور مقدمات کو باقاعدہ سیشن عدالت میں چلانے کا حکم۔',
        },
      ],
      penalties: 'Restores statutory trial protections and eliminates evidentiary traps previously faced by female victims.',
      penaltiesUrdu: 'خواتین کو جھوٹے جوابی مقدمات سے تحفظ فراہم کرتا ہے اور فوجداری سزاؤں کو مؤثر بناتا ہے۔',
    },
    {
      catId: 1,
      number: 3,
      title: 'Criminal Law (Amendment) (Offences in Name of Honour & Rape) Act 2016',
      titleUrdu: 'فوجداری قانون (ترمیمی) ایکٹ 2016 (ریپ، غیرت اور چائلڈ ایبیوز)',
      year: 2016,
      slug: 'criminal-law-amendment-act-2016',
      category: 'Criminal Law',
      categoryUrdu: 'فوجداری قانون',
      whyExists:
        'Enacted in response to the epidemic of honour crimes and child abuse. It made sexual assault strictly non-compoundable—meaning a victim’s family cannot be pressured into a compromise or pardon for the perpetrator. It also established DNA and modern forensics as primary corroborative evidence.',
      whyExistsUrdu:
        'غیرت کے نام پر قتل اور بچوں کے ساتھ زیادتی کے واقعات کے تدارک کے لیے نافذ ہوا۔ اس نے زیادتی کے جرائم کو سختی کے ساتھ "ناقابلِ صلح" قرار دیا تاکہ ملزم خاندان پر دباؤ ڈال کر معافی یا سمجھوتہ حاصل نہ کر سکے۔ نیز ڈی این اے ثبوت کو لازمی قانونی اہمیت دی۔',
      keySections: [
        {
          section: 'Section 3',
          title: 'Mandatory Forensic & DNA Evidence',
          titleUrdu: 'فارنزک اور ڈی این اے شواہد',
          summary: 'Mandates the preservation and lab analysis of DNA samples in sexual offenses.',
          summaryUrdu: 'زیادتی کے کیسز میں ڈی این اے اور فرانزک شواہد کی جانچ کو تفتیش کا لازمی حصہ بنایا۔',
        },
        {
          section: 'Section 7',
          title: 'Strictly Non-Compoundable',
          titleUrdu: 'ناقابلِ صلح حیثیت',
          summary: 'Prohibits out-of-court settlements, compromises, or forgiveness between perpetrator and victim’s family.',
          summaryUrdu: 'ملزم اور متاثرہ کے خاندان کے مابین کسی قسم کی صلح یا سمجھوتے پر قانونی پابندی عائد کی۔',
        },
      ],
      penalties: 'Mandatory trial continuation; no legal compromise permitted.',
      penaltiesUrdu: 'مقدمہ لازمی جاری رہے گا؛ کسی قسم کی صلح قانونی طور پر کالعدم مانی جائے گی۔',
    },
    {
      catId: 1,
      number: 4,
      title: 'Criminal Law (Amendment) Act 2021',
      titleUrdu: 'فوجداری قانون (ترمیمی) ایکٹ 2021',
      year: 2021,
      slug: 'criminal-law-amendment-act-2021',
      category: 'Criminal Law',
      categoryUrdu: 'فوجداری قانون',
      whyExists:
        'Brought Pakistan’s criminal code in line with contemporary human rights standards. It expanded the definition of rape beyond penetration to include other forms of sexual assault, clarified that submission under fear or lack of resistance is not consent, and introduced Section 375A specifically for gang rape.',
      whyExistsUrdu:
        'پاکستانی قوانین کو جدید بین الاقوامی انسانی حقوق کے معیار پر لانے کے لیے منظور ہوا۔ اس نے ریپ کی تعریف کو صنفی اعتبار سے وسیع کیا، خوف کے تحت خاموش رہنے کو رضامندی تسلیم کرنے سے روکا اور گینگ ریپ کی نئی شق شامل کی۔',
      keySections: [
        {
          section: 'Section 2',
          title: 'Modern Consent Doctrine',
          titleUrdu: 'رضامندی کا جدید قانون',
          summary: 'Explicit statutory rule that lack of physical resistance does not constitute consent.',
          summaryUrdu: 'واضح قانونی اصول کہ جسمانی مزاحمت نہ دکھانا رضامندی ہرگز نہیں ہے۔',
        },
      ],
      penalties: 'Severe penalties including death and natural life imprisonment for heinous sexual offenses.',
      penaltiesUrdu: 'سنگین جنسی جرائم پر سزائے موت اور عمر قید۔',
    },

    // Category 2
    {
      catId: 2,
      number: 5,
      title: 'Code of Criminal Procedure 1898 (CrPC)',
      titleUrdu: 'مجموعہ ضابطہ فوجداری 1898',
      year: 1898,
      slug: 'code-of-criminal-procedure-1898',
      category: 'Criminal Law',
      categoryUrdu: 'فوجداری ضابطہ',
      whyExists:
        'The procedural backbone determining how a crime against a girl is reported, investigated, and prosecuted. Contains Section 154 for immediate FIR filing, Section 164A requiring medical examination within 24 hours to preserve biological proof, Section 164 for statements before a magistrate, and Section 352 for in-camera trials to safeguard privacy.',
      whyExistsUrdu:
        'فوجداری مقدمات کو چلانے کا ضابطہ۔ اس میں دفعہ 154 کے تحت ایف آئی آر کا اندراج، دفعہ 164A کے تحت 24 گھنٹے میں میڈیکل معائنہ (ڈی این اے محفوظ کرنے کے لیے)، دفعہ 164 کے تحت مجسٹریٹ کے سامنے بیان اور دفعہ 352 کے تحت رازداری کے لیے ان کیمرہ ٹرائل کے ضوابط ہیں۔',
      keySections: [
        {
          section: '154',
          title: 'Mandatory FIR Registration',
          titleUrdu: 'ایف آئی آر کا لازمی اندراج',
          summary: 'Police are legally mandated to register an FIR immediately upon receipt of cognizable offense information.',
          summaryUrdu: 'قابل دست اندازی جرم کی اطلاع پر پولیس فوری ایف آئی آر درج کرنے کی قانونی پابند ہے۔',
        },
        {
          section: '164A',
          title: 'Prompt Medical Examination within 24 Hours',
          titleUrdu: '24 گھنٹے میں میڈیکل معائنہ',
          summary: 'Registered medical practitioner conducts examination with consent to collect forensic DNA samples.',
          summaryUrdu: 'متاثرہ یا سرپرست کی اجازت سے ڈاکٹر 24 گھنٹے میں فوری معائنہ کر کے ڈی این اے نمونے محفوظ کرے گا۔',
        },
        {
          section: '164',
          title: 'Statement Before Magistrate',
          titleUrdu: 'مجسٹریٹ کے سامنے حلفیہ بیان',
          summary: 'Victim statement recorded under oath before a Judicial Magistrate, insulating it from police tampering.',
          summaryUrdu: 'جوڈیشل مجسٹریٹ کے روبرو حلفیہ بیان جو پولیس کی مداخلت یا دباؤ سے محفوظ رہتا ہے۔',
        },
        {
          section: '352',
          title: 'In-Camera Proceedings',
          titleUrdu: 'بند کمرہ سماعت (ان کیمرہ ٹرائل)',
          summary: 'Empowers trial judge to exclude the public and media from the courtroom to protect victim dignity.',
          summaryUrdu: 'متاثرہ کی عزت اور رازداری کے لیے عام عوام اور میڈیا کی عدم موجودگی میں بند کمرے میں سماعت۔',
        },
      ],
      penalties: 'Establishes statutory deadlines and procedures; non-compliance by police officers attracts departmental and penal sanctions.',
      penaltiesUrdu: 'طریقۂ کار کی خلاف ورزی کرنے والے پولیس اہلکاروں کے خلاف محکمانہ اور قانونی سزائیں۔',
    },
    {
      catId: 2,
      number: 6,
      title: 'Qanun-e-Shahadat Order 1984',
      titleUrdu: 'قانونِ شہادت آرڈر 1984',
      year: 1984,
      slug: 'qanun-e-shahadat-order-1984',
      category: 'Criminal Law',
      categoryUrdu: 'قانونِ شہادت',
      whyExists:
        'Regulates the admissibility of evidence in court. Critical modern amendments legally prohibit defense lawyers from interrogating a female victim about her past sexual history or general character. It also formally recognizes forensic scientific evidence and DNA as primary corroborative proof.',
      whyExistsUrdu:
        'عدالت میں شواہد اور گواہی کی قبولیت کا قانون۔ اہم ترامیم کے تحت زیادتی کے مقدمات میں متاثرہ کے سابقہ کردار یا جنسی تاریخ پر سوال اٹھانے پر مکمل پابندی عائد کی گئی ہے، اور ڈی این اے و فارنزک رپورٹس کو بنیادی قانونی ثبوت تسلیم کیا گیا ہے۔',
      keySections: [
        {
          section: 'Article 151',
          title: 'Ban on Character Assassination',
          titleUrdu: 'کردار کشی پر پابندی',
          summary: 'Strictly forbids questioning the moral character or sexual history of the complainant.',
          summaryUrdu: 'متاثرہ کے اخلاقی کردار یا ماضی کی بنیاد پر جرح کرنے پر مکمل پابندی۔',
        },
        {
          section: 'Article 164',
          title: 'Admissibility of Modern Forensics',
          titleUrdu: 'سائنسی شواہد اور ویڈیو لنک',
          summary: 'Allows DNA profiling, scientific forensic tests, and video recordings as legal evidence.',
          summaryUrdu: 'ڈی این اے پروفائلنگ، سائنسی فارنزک رپورٹس اور ویڈیو ریکارڈنگ کو مکمل ثبوت مانا جائے گا۔',
        },
      ],
      penalties: 'Prohibits abusive cross-examination; evidence acquired through prohibited means is rejected.',
      penaltiesUrdu: 'توہین آمیز جرح کی ممانعت؛ غیر قانونی ذرائع سے لیے گئے سوالات مسترد کر دیے جاتے ہیں۔',
    },
    {
      catId: 2,
      number: 7,
      title: 'Anti-Rape (Investigation and Trial) Act, 2021',
      titleUrdu: 'اینٹی ریپ (تفتیش و ٹرائل) ایکٹ 2021',
      year: 2021,
      slug: 'anti-rape-investigation-and-trial-act-2021',
      category: "Women's Rights Law",
      categoryUrdu: 'خواتین کے حقوق کا قانون',
      whyExists:
        'A comprehensive reform statute addressing structural flaws in rape prosecutions. It established specialized Anti-Rape Courts with a 4-month trial mandate, Special Investigation Teams (SITs), Anti-Rape Crisis Cells (ARCC) in teaching hospitals, outlawed virginity/two-finger testing, mandated video-link testimony, created a NADRA sex offender registry, and provided free legal representation.',
      whyExistsUrdu:
        'زیادتی کے مقدمات کے نظام کی اصلاح کے لیے جامع قانون۔ اس نے 4 ماہ میں فیصلہ سنانے والی خصوصی عدالتیں، اسپیشل تفتیشی ٹیمیں، ہسپتالوں میں کرائسز سیلز، ٹو فنگر (کنوارپن) ٹیسٹ پر مکمل پابندی، ویڈیو لنک پر بیان، نادرا کے پاس جنسی مجرمان کی رجسٹری، اور مفت قانونی مدد فراہم کی۔',
      keySections: [
        {
          section: 'Section 3',
          title: 'Special Anti-Rape Courts',
          titleUrdu: 'خصوصی عدالتیں (4 ماہ کا ٹائم فریم)',
          summary: 'Specialized courts exclusively dedicated to sexual violence trials, mandated to conclude cases within 4 months.',
          summaryUrdu: 'صرف زیادتی کے کیسز سننے والی خصوصی عدالتیں جن پر 4 ماہ میں ٹرائل مکمل کرنے کی قانونی پابندی ہے۔',
        },
        {
          section: 'Section 5',
          title: 'Anti-Rape Crisis Cells (ARCC)',
          titleUrdu: 'اینٹی ریپ کرائسز سیلز',
          summary: 'One-stop emergency crisis cells in hospitals delivering medical, psychological, and legal aid together.',
          summaryUrdu: 'ہسپتالوں میں ایک ہی چھت تلے فوری طبی امداد، دماغی صحت کی کونسلنگ اور قانونی معاونت۔',
        },
        {
          section: 'Section 11',
          title: 'Absolute Ban on Virginity / Two-Finger Testing',
          titleUrdu: 'ٹو فنگر ٹیسٹ پر قطعی پابندی',
          summary: 'Conducting invasive virginity tests on victims is strictly outlawed and constitutes disciplinary misconduct.',
          summaryUrdu: 'متاثرہ لڑکیوں یا خواتین پر ٹو فنگر ٹیسٹ کروانا قانوناً ممنوع اور سنگین جرم قرار دیا گیا۔',
        },
        {
          section: 'Section 14',
          title: 'Video-Link Testimony & Screen Protection',
          titleUrdu: 'ویڈیو لنک اور پردے کے پیچھے بیان',
          summary: 'Victim does not have to face the accused directly; evidence recorded via secure video connection.',
          summaryUrdu: 'متاثرہ کو عدالت میں ملزم کے روبرو نہیں لایا جاتا بلکہ ویڈیو لنک یا پردے کے ذریعے بیان لیا جاتا ہے۔',
        },
        {
          section: 'Section 18',
          title: 'National Sex Offender Register',
          titleUrdu: 'نادرا جنسی مجرمان کی رجسٹری',
          summary: 'Centralized registry maintained with NADRA tracking convicted sex offenders.',
          summaryUrdu: 'نادرا کے پاس سزا یافتہ جنسی مجرمان کی مکمل رجسٹری تاکہ بار بار ہونے والے جرائم کی روک تھام ہو۔',
        },
      ],
      penalties: 'Officers failing to register FIRs or violating victim confidentiality face disciplinary and criminal prosecution.',
      penaltiesUrdu: 'ایف آئی آر میں تاخیر یا رازداری کی خلاف ورزی کرنے والے افسران پر تادیبی اور فوجداری کارروائی۔',
    },

    // Category 3
    {
      catId: 3,
      number: 8,
      title: 'Zainab Alert, Recovery and Response Act, 2020',
      titleUrdu: 'زینب الرٹ، بازیابی و جوابی کارروائی ایکٹ 2020',
      year: 2020,
      slug: 'zainab-alert-recovery-response-act-2020',
      category: 'Human Rights & Minority Law',
      categoryUrdu: 'انسانی حقوق و اقلیتی قانون',
      whyExists:
        'Enacted after the horrifying 2018 rape and murder of 7-year-old Zainab Ansari in Kasur. It created the Zainab Alert Response and Recovery Agency (ZARRA) to ensure missing or abducted children (under 18) trigger an immediate, nationwide multi-agency alert across broadcasts and cellular networks within hours, rather than traditional days-long police delays.',
      whyExistsUrdu:
        'قصور میں 7 سالہ معصوم زینب انصاری کے دل دہلا دینے والے واقعے کے بعد نافذ ہوا۔ اس نے زارا (ZARRA) ایجنسی قائم کی تاکہ گمشدہ یا اغوا ہونے والے بچے کی اطلاع پر چند گھنٹوں میں ٹی وی اور موبائل پر ملک گیر الرٹ جاری ہو، اور پولیس کی روایتی سستی کا خاتمہ ہو۔',
      keySections: [
        {
          section: 'Section 3',
          title: 'Establishment of ZARRA',
          titleUrdu: 'زارا (ZARRA) ایجنسی کا قیام',
          summary: 'Federal agency coordinating missing child tracking and emergency recovery.',
          summaryUrdu: 'وزارتِ انسانی حقوق کے تحت گمشدہ بچوں کی ملک گیر تلاش کا مرکزی نگران ادارہ۔',
        },
        {
          section: 'Section 4',
          title: 'Immediate Alert Mechanism & Broadcaster Broadcast',
          titleUrdu: 'فوری الرٹ اور میڈیا پر نشریات',
          summary: 'Alerts broadcast across electronic media, SMS networks, highways, and border posts within hours.',
          summaryUrdu: 'ٹی وی چینلز، ہائی ویز، اور موبائل فونز پر فوری گمشدہ بچے کی تصویر اور تفصیلات کا الرٹ۔',
        },
        {
          section: 'Section 9',
          title: 'Penalties for Police Inaction',
          titleUrdu: 'پولیس کی غفلت پر سزا',
          summary: 'Police officer delaying or refusing to lodge a missing child FIR faces up to 2 years imprisonment.',
          summaryUrdu: 'اگر کوئی پولیس افسر گمشدہ بچے کی ایف آئی آر میں تاخیر یا انکار کرے تو اسے 2 سال قید ہو سکتی ہے۔',
        },
      ],
      penalties: 'Capital punishment or life imprisonment for child abductors; up to 2 years imprisonment for negligent police officers.',
      penaltiesUrdu: 'بچوں کو اغوا کرنے والوں کو سزائے موت یا عمر قید؛ رپورٹ نہ لکھنے والے پولیس اہلکاروں کو 2 سال قید۔',
    },
    {
      catId: 3,
      number: 9,
      title: 'Juvenile Justice System Act, 2018',
      titleUrdu: 'نظامِ عدل برائے نو عمر ملزمان ایکٹ 2018',
      year: 2018,
      slug: 'juvenile-justice-system-act-2018',
      category: 'Human Rights & Minority Law',
      categoryUrdu: 'انسانی حقوق کا قانون',
      whyExists:
        'Governs criminal cases where an accused is a child (under 18 years). It mandates specialized child-friendly Juvenile Courts, separates child detainees from hardened adult convicts in prisons, explicitly abolishes capital punishment for offenders who were under 18 at the time of the crime, and emphasizes rehabilitation and diversion over punitive retribution.',
      whyExistsUrdu:
        'جب ملزم 18 سال سے کم عمر کا بچہ ہو تو یہ قانون لاگو ہوتا ہے۔ بچوں کو بڑے مجرموں کے ساتھ جیلوں میں رکھنے پر پابندی لگاتا ہے، الگ نو عمر عدالتیں قائم کرتا ہے، کم عمر ملزمان کے لیے سزائے موت پر مکمل پابندی عائد کرتا ہے اور اصلاحی نظام کو ترجیح دیتا ہے۔',
      keySections: [
        {
          section: 'Section 4',
          title: 'Specialized Juvenile Courts',
          titleUrdu: 'جووینائل عدالتیں',
          summary: 'Child-friendly courtroom environments ensuring dignity, confidential records, and specialized judges.',
          summaryUrdu: 'بچوں کے لیے دوستانہ عدالتی ماحول جہاں رازداری اور ذہنی تحفظ کو یقینی بنایا جائے۔',
        },
        {
          section: 'Section 16',
          title: 'Absolute Ban on Death Penalty for Juveniles',
          titleUrdu: 'سزائے موت کی مکمل ممانعت',
          summary: 'No juvenile offender may be sentenced to death or fettered in handcuffs.',
          summaryUrdu: '18 سال سے کم عمر ملزم کو سزائے موت دینے یا ہتھکڑیاں لگانے پر مکمل قانونی پابندی۔',
        },
      ],
      penalties: 'Diversion to observation homes, vocational training, and reformative custody.',
      penaltiesUrdu: 'اصلاحی گھروں میں تربیت اور بحالی؛ جیل کی بجائے سماجی اصلاح کا راستہ۔',
    },
    {
      catId: 3,
      number: 10,
      title: 'Punjab Destitute and Neglected Children Act 2004',
      titleUrdu: 'پنجاب ایکٹ برائے بے سہارا و لاوارث بچے 2004',
      year: 2004,
      slug: 'punjab-destitute-neglected-children-act-2004',
      category: 'Provincial-Specific Law',
      categoryUrdu: 'پنجاب کا صوبائی قانون',
      whyExists:
        'The foundational child protection law for Punjab province. It established the Child Protection and Welfare Bureau (CPWB), emergency child rescue squads, Helpline 1121, Child Protection Courts, and protective shelters for girls and boys suffering from abandonment, physical abuse, commercial sexual exploitation, or forced begging.',
      whyExistsUrdu:
        'پنجاب کا بنیادی چائلڈ پروٹیکشن قانون جس کے تحت چائلڈ پروٹیکشن اینڈ ویلفیئر بیورو (CPWB) اور 24 گھنٹے ہیلپ لائن 1121 قائم ہوئی۔ یہ لاوارث، گھریلو تشدد اور جنسی استحصال کی شکار بچیوں کو فوری ریسکیو، پناہ، تعلیم اور قانونی سرپرستی فراہم کرتا ہے۔',
      keySections: [
        {
          section: 'Section 3',
          title: 'Child Protection & Welfare Bureau (CPWB)',
          titleUrdu: 'چائلڈ پروٹیکشن بیورو کا قیام',
          summary: 'Institutional rescue, safe custody, medical rehabilitation, and legal representation of endangered minors.',
          summaryUrdu: 'متاثرہ اور خطرے سے دوچار بچوں کو ریسکیو کرنے، پناہ گاہ اور مفت قانونی وکلائی دینے کا ادارہ۔',
        },
        {
          section: 'Section 18',
          title: 'Helpline 1121 Emergency Response',
          titleUrdu: 'ہیلپ لائن 1121 اور ریسکیو اسکواڈ',
          summary: '24/7 telephone dispatch initiating immediate rescue operations for children in distress.',
          summaryUrdu: '24 گھنٹے فعال ریسکیو ٹیمیں جو بچے پر تشدد یا زیادتی کی کال پر فوراً موقع پر پہنچتی ہیں۔',
        },
      ],
      penalties: 'Child Protection Court issues protective custody orders, revoking custody from abusive guardians.',
      penaltiesUrdu: 'عدالت ظالم والدین یا سرپرست سے بچے کی حوالگی منسوخ کر کے سرکاری تحویل میں دے سکتی ہے۔',
    },
    {
      catId: 3,
      number: 11,
      title: 'Sindh Child Protection Authority Act, 2011',
      titleUrdu: 'سندھ چائلڈ پروٹیکشن اتھارٹی ایکٹ 2011',
      year: 2011,
      slug: 'sindh-child-protection-authority-act-2011',
      category: 'Provincial-Specific Law',
      categoryUrdu: 'سندھ کا صوبائی قانون',
      whyExists:
        'Provides statutory machinery in Sindh province to shield vulnerable young girls and children from cruelty, physical harm, trafficking, and sexual exploitation through the Sindh Child Protection Authority (SCPA), designated child welfare officers, and coordination with law enforcement.',
      whyExistsUrdu:
        'سندھ میں بچیوں اور بچوں کو تشدد، اسمگلنگ اور جنسی استحصال سے بچانے کے لیے سندھ چائلڈ پروٹیکشن اتھارٹی (SCPA) قائم کرتا ہے۔ یہ چائلڈ ویلفیئر افسران اور پولیس کے ساتھ مل کر فوری قانونی کارروائی اور پناہ گاہوں کا انتظام کرتا ہے۔',
      keySections: [
        {
          section: 'Section 4',
          title: 'Powers of Sindh Child Protection Authority',
          titleUrdu: 'اتھارٹی کے اختیارات و فرائض',
          summary: 'Empowered to register child abuse reports, inspect shelters, and provide free legal support.',
          summaryUrdu: 'چائلڈ ایبیوز کے خلاف ایف آئی آر درج کروانے، معائنہ کرنے اور مفت وکیل فراہم کرنے کا قانونی اختیار۔',
        },
      ],
      penalties: 'Penalties for abusing, exploiting, or exposing a child to harm, including prison terms and heavy fines.',
      penaltiesUrdu: 'بچوں سے بدسلوکی کرنے والوں کے لیے قید اور بھاری جرمانے۔',
    },
    {
      catId: 3,
      number: 12,
      title: 'Khyber Pakhtunkhwa Child Protection and Welfare Act 2010',
      titleUrdu: 'خیبر پختونخوا چائلڈ پروٹیکشن اینڈ ویلفیئر ایکٹ 2010',
      year: 2010,
      slug: 'khyber-pakhtunkhwa-child-protection-welfare-act-2010',
      category: 'Provincial-Specific Law',
      categoryUrdu: 'کے پی کا صوبائی قانون',
      whyExists:
        'Established dedicated District Child Protection Units (CPUs) across Khyber Pakhtunkhwa to tackle sexual abuse, domestic violence against young girls, forced child marriages, child labor, and human trafficking with child protection commissions.',
      whyExistsUrdu:
        'خیبر پختونخوا کے تمام اضلاع میں چائلڈ پروٹیکشن یونٹس (CPUs) قائم کرتا ہے تاکہ گھریلو ملازم بچیوں پر تشدد، جنسی ہراسانی، کم عمری کی شادیوں اور بچوں کی اسمگلنگ کے خلاف مؤثر تدارک کیا جا سکے۔',
      keySections: [
        {
          section: 'Section 5',
          title: 'District Child Protection Units (CPUs)',
          titleUrdu: 'ضلعی چائلڈ پروٹیکشن یونٹس',
          summary: 'Field teams operating in districts to receive complaints, intervene in early marriage cases, and protect children.',
          summaryUrdu: 'ہر ضلع میں فعال فیلڈ ٹیمیں جو بچیوں پر تشدد اور جبری شادی کی روک تھام کے لیے مداخلت کرتی ہیں۔',
        },
      ],
      penalties: 'Criminal liability for cruelty, child abuse, and failure to notify child protection authorities.',
      penaltiesUrdu: 'بچوں پر تشدد کرنے اور معلومات چھپانے والوں کے خلاف فوجداری سزائیں۔',
    },
    {
      catId: 3,
      number: 13,
      title: 'Balochistan Child Protection Act 2016',
      titleUrdu: 'بلوچستان چائلڈ پروٹیکشن ایکٹ 2016',
      year: 2016,
      slug: 'balochistan-child-protection-act-2016',
      category: 'Provincial-Specific Law',
      categoryUrdu: 'بلوچستان کا صوبائی قانون',
      whyExists:
        'Enacted by the Balochistan Provincial Assembly to set up the Balochistan Child Protection Commission, child protection units, and legal aid frameworks to rescue abused children and young girls from forced marriages, trafficking, and physical harm.',
      whyExistsUrdu:
        'بلوچستان چائلڈ پروٹیکشن کمیشن اور ضلعی یونٹس کا قیام، تاکہ بچیوں اور بچوں کو روایتی جبر، بدسلوکی، کم عمری کی شادی اور جنسی استحصال کے خلاف قانونی چھتری فراہم کی جا سکے۔',
      keySections: [
        {
          section: 'Section 4',
          title: 'Balochistan Child Protection Commission',
          titleUrdu: 'بلوچستان چائلڈ پروٹیکشن کمیشن',
          summary: 'Provincial commission monitoring child rights compliance and issuing intervention orders.',
          summaryUrdu: 'صوبائی کمیشن جو بچیوں اور بچوں کے حقوق اور ان کے خلاف جرائم کے خاتمے کی نگرانی کرتا ہے۔',
        },
      ],
      penalties: 'Criminal prosecution of exploiters, with mandatory judicial protective orders for victims.',
      penaltiesUrdu: 'استحصال کرنے والوں پر عدالتی کارروائی اور متاثرہ بچی کی سرکاری حفاظت کا حکم۔',
    },

    // Category 4
    {
      catId: 4,
      number: 14,
      title: 'Child Marriage Restraint Act 1929',
      titleUrdu: 'قانونِ انسدادِ کم عمری شادی 1929',
      year: 1929,
      slug: 'child-marriage-restraint-act-1929',
      category: 'Family Law',
      categoryUrdu: 'خاندانی قانون',
      whyExists:
        'The foundational federal law restraining early child marriages across Pakistan. Early marriages frequently result in severe reproductive health hazards, termination of education, and statutory sexual abuse of adolescent girls. It set the minimum legal age of marriage at 16 for females and 18 for males.',
      whyExistsUrdu:
        'کم عمری کی شادی پر پابندی کا بنیادی وفاقی قانون۔ قبل از وقت شادیاں بچیوں کی تعلیم، صحت اور مستقبل کے لیے تباہ کن اور درحقیقت جنسی استحصال کا راستہ ہوتی ہیں۔ اس قانون نے لڑکی کی کم از کم عمر 16 سال اور لڑکے کی 18 سال مقرر کی۔',
      keySections: [
        {
          section: 'Section 2',
          title: 'Definition of Child & Child Marriage',
          titleUrdu: 'بچے اور کم عمری کی شادی کی تعریف',
          summary: 'Female below 16 and male below 18 defined as a child; marriage involving either is a child marriage.',
          summaryUrdu: '16 سال سے کم عمر لڑکی اور 18 سال سے کم عمر لڑکا بچہ مانا جائے گا، اور ان کا نکاح چائلڈ میرج کہلائے گا۔',
        },
        {
          section: 'Section 4',
          title: 'Punishment for Adult Male Marrying a Child',
          titleUrdu: 'بالغ مرد کے بچے سے نکاح پر سزا',
          summary: 'Adult male who marries an underage girl liable to simple imprisonment and fine.',
          summaryUrdu: 'کم عمر لڑکی سے شادی کرنے والا بالغ مرد قید اور جرمانے کا مجرم ہوگا۔',
        },
        {
          section: 'Section 5',
          title: 'Punishment for Officiating Underage Marriage',
          titleUrdu: 'نکاح خواں کے لیے سزا',
          summary: 'Punishes the Nikah registrar, cleric, or family facilitator who solemnizes a child wedding.',
          summaryUrdu: 'کم عمری کا نکاح پڑھانے والے قاضی، نکاح خواں اور سہولت کاروں پر قید اور جرمانہ۔',
        },
      ],
      penalties: 'Imprisonment and fine for grooms, officiants, and consenting guardians.',
      penaltiesUrdu: 'دولہا، نکاح خواں اور سہولت کار سرپرستوں کے لیے قید اور جرمانہ۔',
    },
    {
      catId: 4,
      number: 15,
      title: 'Sindh Child Marriages Restraint Act, 2013',
      titleUrdu: 'سندھ چائلڈ میرجز ریسٹرینٹ ایکٹ 2013',
      year: 2013,
      slug: 'sindh-child-marriages-restraint-act-2013',
      category: 'Family Law',
      categoryUrdu: 'خاندانی قانون',
      whyExists:
        'Sindh was the first province in Pakistan to modernize marriage laws by raising the minimum age of marriage to 18 years uniformly for both girls and boys. It made underage marriage a non-bailable, cognizable offense with up to 3 years rigorous imprisonment, preventing parents from marrying off young school-aged daughters.',
      whyExistsUrdu:
        'سندھ پاکستان کا پہلا صوبہ بنا جس نے لڑکی اور لڑکے دونوں کے لیے شادی کی کم از کم عمر یکساں 18 سال لازمی قرار دی۔ اس نے کم عمری کے نکاح کو ناقابلِ ضمانت اور قابل دست اندازی پولیس جرم قرار دیا، جس میں 3 سال تک سخت قید اور 45 ہزار روپے جرمانہ مقرر کیا گیا ہے۔',
      keySections: [
        {
          section: 'Section 2',
          title: 'Uniform Age of 18 for Both Genders',
          titleUrdu: 'دونوں کے لیے 18 سال کی لازمی عمر',
          summary: 'Both girls and boys under 18 strictly classified as children, barring all underage matrimony.',
          summaryUrdu: '18 سال سے کم عمر لڑکی یا لڑکا ہر صورت بچہ ہے اور ان کا نکاح قانوناً ممنوع ہے۔',
        },
        {
          section: 'Section 3 & 4',
          title: 'Rigorous Imprisonment up to 3 Years',
          titleUrdu: '3 سال تک بامشقت قید',
          summary: 'Severe criminal liability for parents, groom, and Nikah registrar, with minimum PKR 45,000 fine.',
          summaryUrdu: 'شادی کرنے والے، والدین اور نکاح خواں پر 3 سال تک بامشقت قید اور کم از کم 45 ہزار روپے جرمانہ۔',
        },
      ],
      penalties: 'Up to 3 years rigorous imprisonment, minimum PKR 45,000 fine; non-bailable and cognizable offense.',
      penaltiesUrdu: '3 سال تک سخت قید، کم از کم 45 ہزار روپے جرمانہ، ناقابلِ ضمانت گرفتاری۔',
    },
    {
      catId: 4,
      number: 16,
      title: 'Islamabad Child Marriage Restraint Act, 2025',
      titleUrdu: 'اسلام آباد چائلڈ میرج ریسٹرینٹ ایکٹ 2025',
      year: 2025,
      slug: 'islamabad-child-marriage-restraint-act-2025',
      category: 'Family Law',
      categoryUrdu: 'خاندانی قانون',
      whyExists:
        'Enacted for the federal capital (ICT) setting 18 years as the strictly uniform minimum marriage age for girls and boys. It eliminates statutory loopholes, ensures female education retention, protects adolescent girls from premature forced childbearing, and treats underage matrimony as an actionable crime.',
      whyExistsUrdu:
        'اسلام آباد کے لیے نافذ کردہ جدید ترین قانون جس کے تحت لڑکی اور لڑکے دونوں کے لیے شادی کی عمر 18 سال مقرر کی گئی۔ اس کا مقصد بچیوں کی تعلیم، جسمانی صحت اور مستقبل کی حفاظت ہے تاکہ انہیں زبردستی کم عمری کی شادی کی دلدل میں نہ دھکیلا جا سکے۔',
      keySections: [
        {
          section: 'Section 2',
          title: 'Strict 18-Year Threshold in ICT',
          titleUrdu: 'وفاقی دارالحکومت میں 18 سال کی پابندی',
          summary: 'Mandates national identity card (CNIC) age verification before any marriage can be solemnized in Islamabad.',
          summaryUrdu: 'اسلام آباد میں کسی بھی نکاح کے لیے نادرا شناختی کارڈ سے 18 سال کی عمر کی تصدیق لازمی قرار دی گئی۔',
        },
        {
          section: 'Section 5',
          title: 'Strict Sanctions on Officiants & Parents',
          titleUrdu: 'نکاح خواں اور سرپرستوں کے لیے سزائیں',
          summary: 'Substantial imprisonment terms and severe fines for any person arranging or facilitating child marriage.',
          summaryUrdu: 'بچی کی شادی کروانے والے والدین، سرپرست اور نکاح خواں پر سخت قید اور بھاری مالی جرمانے۔',
        },
      ],
      penalties: 'Rigorous prison terms, hefty fines, and nullification of underage union solemnization attempts.',
      penaltiesUrdu: 'بامشقت قید، بھاری جرمانے اور کم عمری کے نکاح کے خلاف سخت قانونی ایکشن۔',
    },
  ]

  const filteredStatutes =
    activeCategory === 'all'
      ? statutes
      : statutes.filter((s) => s.catId === activeCategory)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span>{t('Home', 'صفحۂ اول')}</span>
        </Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <span className="text-foreground font-medium">{t('Girls Protection Laws Guide', 'بچیوں کے تحفظ کے قوانین گائیڈ')}</span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-emerald-500/10 via-card to-background p-6 md:p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>{t('Pakistan Legal Rights & Protection Portal', 'پاکستان لیگل رائٹس و تحفظ پورٹل')}</span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance text-foreground">
            {t(
              'Pakistan Laws for the Protection of Girls & Women: Complete Guide',
              'پاکستان میں بچیوں اور خواتین کے قانونی تحفظ کے قوانین: مکمل گائیڈ'
            )}
          </h1>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t(
              'A comprehensive legal reference detailing all 16 statutes enacted in Pakistan to shield girls and women from violence, statutory rape, child sexual exploitation, underage marriage, and harassment. Learn why each law exists, key statutory sections, trial protections, and emergency hotlines.',
              'پاکستان میں بچیوں اور خواتین کو زیادتی، جنسی بدسلوکی، کم عمری کی شادی اور تشدد سے بچانے کے لیے بنائے گئے تمام 16 قوانین کی تفصیلی گائیڈ۔ جانیے ہر قانون کیوں بنا، اہم دفعات، عدالتی طریقہ کار اور فوری ہنگامی ہیلپ لائنز۔'
            )}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
              <BookOpen className="h-3 w-3 mr-1" />
              {t('16 Catalogued Statutes', '16 باقاعدہ قوانین')}
            </Badge>
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
              <Scale className="h-3 w-3 mr-1" />
              {t('4 Core Legal Categories', '4 بنیادی قانونی زمرہ جات')}
            </Badge>
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
              <PhoneCall className="h-3 w-3 mr-1" />
              {t('24/7 National Emergency Helplines', '24 گھنٹے مفت قومی ہیلپ لائنز')}
            </Badge>
          </div>
        </div>
      </div>

      {/* Emergency Helplines Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-red-500 animate-pulse" />
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              {t('Emergency Support & 24/7 Helplines', 'ہنگامی امداد اور 24 گھنٹے فعال ہیلپ لائنز')}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {t('Toll-free immediate help across Pakistan', 'پورے پاکستان میں مفت فوری مدد')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {emergencyHelplines.map((hl) => (
            <Card key={hl.number} className={cn('border shadow-xs hover:border-primary/40 transition-colors', hl.color)}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black tracking-tight">{hl.number}</span>
                  <a
                    href={`tel:${hl.number}`}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-background border border-current hover:scale-105 transition-transform"
                    aria-label={`Call ${hl.number}`}
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div>
                  <h3 className="text-xs font-bold">{t(hl.title, hl.titleUrdu)}</h3>
                  <p className="text-[11px] opacity-80 leading-snug mt-0.5">{t(hl.desc, hl.descUrdu)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Do These Laws Exist? (Kyun Hai Yeh Qawaneen?) */}
      <Card className="border border-border/70 bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-base md:text-lg">
              {t('Why Do These Laws Exist? Constitutional Context & Purpose', 'یہ قوانین کیوں بنے؟ آئینی پس منظر اور مقصد')}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {t(
              'Understanding the constitutional mandate and societal milestones that produced these protections.',
              'وہ آئینی تقاضے اور تاریخی تبدیلیاں جن کی بدولت یہ حفاظتی قوانین وجود میں آئے۔'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
          <p>
            {t(
              'Under Article 25(3) of the Constitution of the Islamic Republic of Pakistan, 1973, the state is explicitly empowered to make special provisions for the protection of women and children. Furthermore, Article 9 (Security of Person) and Article 14 (Inviolability of Dignity of Man) declare that life, liberty, and personal dignity are fundamental inalienable rights.',
              '1973 کے آئینِ پاکستان کے آرٹیکل 25(3) کے تحت ریاست کو یہ خصوصی اختیار دیا گیا ہے کہ وہ خواتین اور بچوں کے تحفظ کے لیے خصوصی قوانین وضع کرے۔ مزید برآں، آرٹیکل 9 (جان کا تحفظ) اور آرٹیکل 14 (انسانی عزت و وقار کا تحفظ) بنیادی ناقابلِ تنسیخ حقوق ہیں۔'
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-border/80 bg-background/50 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{t('Eliminating Unjust Traps', 'بے جا پیچیدگیوں کا خاتمہ')}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {t(
                  'The 2006 Women Protection Act took rape out of the 1979 Hudood Ordinance, preventing victims from being counter-accused of zina.',
                  '2006 کے تحفظِ نسواں ایکٹ نے زیادتی کو حدود آرڈیننس سے نکال کر عام فوجداری قانون میں رکھا تاکہ متاثرہ پر جھوٹا جوابی مقدمہ نہ بن سکے۔'
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/50 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{t('Strict Statutory Rape Age', 'نابالغ بچیوں کا حتمی تحفظ')}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {t(
                  'Under PPC Section 375, intercourse with any girl under 16 is automatically rape; "consent" is invalid and cannot be claimed as a defense.',
                  'پی پی سی کی دفعہ 375 کے تحت 16 سال سے کم عمر بچی کے ساتھ جنسی تعلق ہر صورت ریپ ہے؛ "رضامندی" کا عذر قانوناً کالعدم ہے۔'
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/50 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{t('Zero Tolerance for Delay', 'فوری کارروائی اور ان کیمرہ ٹرائل')}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {t(
                  'Anti-Rape Act 2021 & Zainab Alert Act 2020 penalize police officers who delay FIRs and mandate fast-track 4-month Special Courts.',
                  'اینٹی ریپ ایکٹ 2021 اور زینب الرٹ ایکٹ ایف آئی آر میں تاخیر کرنے والے پولیس اہلکاروں کو سزا اور 4 ماہ میں ٹرائل کی ضمانت دیتے ہیں۔'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {t('16 Protection Statutes by Category', '16 حفاظتی قوانین بلحاظ زمرہ')}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('Click on any law to view its complete catalogued statute in the directory.', 'ڈائریکٹری میں مکمل قانون پڑھنے کے لیے متعلقہ قانون کے لنک پر کلک کریں۔')}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-muted/50 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('All 16 Laws', 'تمام 16 قوانین')}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer',
                  activeCategory === c.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t(`Cat ${c.id}: ${c.title}`, `زمرہ ${c.id}: ${c.titleUrdu}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Statutes Cards List */}
        <div className="space-y-6">
          {filteredStatutes.map((law) => (
            <Card key={law.slug} className="border border-border/80 shadow-xs hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                        {law.number}
                      </span>
                      <h3 className="text-base md:text-lg font-bold text-foreground">
                        {lang === 'ur' && law.titleUrdu ? law.titleUrdu : law.title}
                      </h3>
                    </div>
                    {lang !== 'ur' && law.titleUrdu && (
                      <p className="text-xs text-muted-foreground font-urdu" dir="rtl">
                        {law.titleUrdu}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-medium">
                      {law.year}
                    </Badge>
                    <Badge className="bg-primary/15 text-primary text-[10px] border-primary/20">
                      {t(law.category, law.categoryUrdu)}
                    </Badge>
                    <Link
                      href={`/laws/${law.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline ml-2"
                    >
                      <span>{t('View Statute', 'مکمل متن')}</span>
                      <ArrowRight className={cn('h-3.5 w-3.5', lang === 'ur' && 'rotate-180')} />
                    </Link>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 md:p-6 space-y-4">
                {/* Why it exists */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs md:text-sm space-y-1">
                  <div className="font-semibold text-primary flex items-center gap-1.5">
                    <Info className="h-4 w-4" />
                    <span>{t('Why Does This Law Exist? (Purpose & Context)', 'یہ قانون کیوں بنا؟ (مقصد اور پس منظر)')}:</span>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {t(law.whyExists, law.whyExistsUrdu)}
                  </p>
                </div>

                {/* Key Sections */}
                {law.keySections && law.keySections.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                      {t('Key Legal Sections & Provisions', 'اہم دفعات اور قانونی شقیں')}:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {law.keySections.map((sec, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-border/80 bg-card p-3 space-y-1 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-foreground">
                            <span>{sec.section.startsWith('Section') || sec.section.startsWith('Article') ? sec.section : `Section ${sec.section}`}</span>
                            <span className="text-muted-foreground font-normal text-[11px]">
                              {t(sec.title, sec.titleUrdu)}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            {t(sec.summary, sec.summaryUrdu)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Penalties */}
                <div className="flex items-start gap-2 pt-1 text-xs">
                  <Flame className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground">{t('Prescribed Penalties: ', 'مقررہ سزائیں: ')}</span>
                    <span className="text-muted-foreground">{t(law.penalties, law.penaltiesUrdu)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Practical Action Guide: If a Crime Occurs */}
      <Card className="border border-border/70 bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <CardTitle className="text-base md:text-lg">
              {t('Step-by-Step Procedure: What to Do in Case of an Incident', 'کسی واقعے کی صورت میں قانونی مرحلہ وار لائحہ عمل')}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {t(
              'Essential steps to protect evidence, initiate swift police action, and access Anti-Rape Crisis Cells.',
              'شواہد کے تحفظ، فوری ایف آئی آر کے اندراج اور اینٹی ریپ کرائسز سیلز تک رسائی کے ضروری مراحل۔'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-500 text-xs font-bold">1</span>
              <h4 className="text-xs font-bold text-foreground">{t('Immediate Safety', 'فوری تحفظ و سلامتی')}</h4>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {t(
                  'Reach a secure place. Call 15 (Police) or 1099 (MoHR). Do not delay reporting.',
                  'محفوظ مقام پر پہنچیں، فوری 15 یا 1099 پر کال کریں۔ رپورٹنگ میں تاخیر نہ کریں۔'
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">2</span>
              <h4 className="text-xs font-bold text-foreground">{t('Preserve Evidence', 'شواہد کو محفوظ رکھنا')}</h4>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {t(
                  'Do NOT wash, bathe, or change clothes before medical checkup to preserve critical DNA forensic evidence.',
                  'میڈیکل معائنے سے پہلے کپڑے نہ بدلیں اور غسل نہ کریں تاکہ ڈی این اے شواہد محفوظ رہیں۔'
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold">3</span>
              <h4 className="text-xs font-bold text-foreground">{t('Crisis Cell & Medical', 'کرائسز سیل و معائنہ')}</h4>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {t(
                  'Under CrPC 164A, medical exam within 24 hours. Two-finger test is strictly banned by law.',
                  'دفعہ 164A کے تحت 24 گھنٹے میں معائنہ کروائیں۔ ٹو فنگر ٹیسٹ قانوناً مکمل ممنوع ہے۔'
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold">4</span>
              <h4 className="text-xs font-bold text-foreground">{t('FIR (Section 154)', 'ایف آئی آر کا اندراج')}</h4>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {t(
                  'Police are legally obligated to record the FIR immediately. Delay is a punishable offense for police.',
                  'پولیس فوری ایف آئی آر درج کرنے کی پابند ہے۔ انکار یا تاخیر پر افسر کے خلاف سزا ہے۔'
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">5</span>
              <h4 className="text-xs font-bold text-foreground">{t('Special Court Trial', 'خصوصی عدالت میں سماعت')}</h4>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {t(
                  'In-camera trial, video link testimony, complete identity protection, and mandatory 4-month conclusion.',
                  'بند کمرہ ٹرائل، ویڈیو لنک گواہی، شناخت کا مکمل تحفظ اور 4 ماہ میں فیصلے کی پابندی۔'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Legal Safeguards */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 md:p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{t('Important Statutory Protections You Must Know', 'اہم قانونی حقوق جن کا جاننا ہر شہری کے لیے ضروری ہے')}</span>
        </div>
        <ul className="text-xs md:text-sm text-foreground space-y-2 list-disc pl-5 leading-relaxed">
          <li>
            <strong>{t('Non-Compoundable Offense: ', 'ناقابلِ صلح جرم: ')}</strong>
            {t(
              'Rape and child sexual abuse cases cannot be settled out of court. No family elder or compromise can legally dismiss an ongoing rape prosecution.',
              'ریپ اور بچوں کے ساتھ جنسی زیادتی کے مقدمات ناقابلِ صلح ہیں۔ کوئی پنچایت یا خاندان صلح کر کے مقدمہ ختم نہیں کروا سکتا۔'
            )}
          </li>
          <li>
            <strong>{t('Identity Protection (PPC 228A): ', 'شناخت کا تحفظ (دفعہ 228A): ')}</strong>
            {t(
              'Publishing or broadcasting the name, photograph, or address of a victim of sexual assault is an offense punishable by up to 3 years imprisonment.',
              'متاثرہ کا نام، تصویر یا رہائشی پتہ میڈیا یا سوشل میڈیا پر ظاہر کرنا 3 سال قید کا جرم ہے۔'
            )}
          </li>
          <li>
            <strong>{t('Victim Character History Inadmissible: ', 'ماضی کے کردار پر سوال اٹھانا ممنوع: ')}</strong>
            {t(
              'Under Qanun-e-Shahadat Order Article 151, defense attorneys are barred from questioning the victim regarding prior sexual history or general character.',
              'قانونِ شہادت کے آرٹیکل 151 کے تحت وکیلِ صفائی کو متاثرہ کے سابقہ کردار یا جنسی تاریخ پر جرح کرنے کی قطعی اجازت نہیں ہے۔'
            )}
          </li>
          <li>
            <strong>{t('Free Legal Representation: ', 'مفت قانونی نمائندگی: ')}</strong>
            {t(
              'Under the Anti-Rape Act 2021, victims are entitled to state-appointed special prosecutors and free legal aid committees if they cannot afford private counsel.',
              'اینٹی ریپ ایکٹ 2021 کے تحت حکومت متاثرہ کو مفت وکیل اور قانونی معاونت فراہم کرنے کی پابند ہے۔'
            )}
          </li>
        </ul>
      </div>

      {/* Legal Disclaimer */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">
          {t('Public Information Disclaimer', 'قانونی و معلوماتی دستبرداری')}
        </p>
        <p>
          {t(
            'This guide is published solely for educational, research, and public legal awareness purposes under the QanoonPK initiative. It does not constitute formal legal counsel. For specific case representation, please consult a licensed advocate of the High Court or relevant Bar Association, or contact the official Ministry of Human Rights legal aid cells.',
            'یہ گائیڈ صرف عوامی آگاہی، قانونی فہم اور تعلیمی مقاصد کے لیے شائع کی گئی ہے۔ یہ باقاعدہ قانونی مشورہ نہیں ہے۔ کسی بھی مقدمے میں باقاعدہ کارروائی کے لیے لائسنس یافتہ وکیل یا وزارتِ انسانی حقوق کے قانونی معاونتی سیلز سے رابطہ کریں۔'
          )}
        </p>
      </div>
    </div>
  )
}
