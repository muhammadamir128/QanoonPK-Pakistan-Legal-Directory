'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Info, Database, ShieldCheck, Globe, BookOpen, Scale,
  Calendar, Users, FileText, Languages, Heart,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export default function AboutPage() {
  const { t, lang } = useLanguage()

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
    </div>
  )
}
