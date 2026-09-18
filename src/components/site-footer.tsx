'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Scale, Mail, Github, BookText, Compass,
  Briefcase, FileText, GitCompare, Bot, Landmark,
  HelpCircle, ExternalLink, MapPin, Sparkles,
  Layers, ArrowUpRight, CheckCircle
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { Badge } from '@/components/ui/badge'

export function SiteFooter() {
  const { t, lang } = useLanguage()
  const pathname = usePathname()

  const isExcludedPage = pathname === '/login' || pathname === '/register' || pathname?.startsWith('/auth') || pathname?.startsWith('/admin')
  if (isExcludedPage) return null

  return (
    <footer className="mt-auto border-t border-border/70 bg-gradient-to-b from-background via-muted/20 to-muted/50 text-foreground">
      {/* Top Value Pillars Banner */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">{t('Bilingual Access', 'دو لسانی رسائی')}</span>
                <span>{t('Available in both English and Urdu', 'اردو اور انگریزی دونوں میں دستیاب')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">{t('Verified Statutes', 'مصدقہ قوانین')}</span>
                <span>{t('Federal & Provincial acts with amendments', 'وفاقی و صوبائی قوانین بمعہ ترامیم')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">{t('Free Public Directory', 'مفت عوامی ڈائریکٹری')}</span>
                <span>{t('Open legal knowledge for every citizen', 'ہر شہری کے لیے کھلی قانونی معلومات')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Mission (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-foreground">
                    {t('QanoonPK', 'قانون پی کے')}
                  </span>
                  <Badge variant="secondary" className="text-[10px] font-medium px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                    {t('Pakistan', 'پاکستان')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {t('Pakistan Legal Directory', 'پاکستان قانونی ڈائریکٹری')}
                </p>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'Pakistan\'s comprehensive, free digital legal directory. Browse federal and provincial laws, explore court jurisdictions, generate legal templates, and connect with licensed legal practitioners.',
                'پاکستان کی جامع اور مفت ڈیجیٹل قانونی ڈائریکٹری۔ وفاقی اور صوبائی قوانین تلاش کریں، عدالتی درجہ بندی سمجھیں، قانونی ٹیمپلیٹس تیار کریں اور باصلاحیت وکلاء سے رابطہ کریں۔'
              )}
            </p>

            {/* Quick Contact & Details */}
            <div className="pt-2 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{t('Islamabad, Pakistan', 'اسلام آباد، پاکستان')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="mailto:info@qanoonpk.example" className="hover:text-foreground hover:underline transition-colors">
                  info@qanoonpk.example
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Github className="h-3.5 w-3.5 text-primary shrink-0" />
                <a
                  href="https://github.com/muhammadamir128/QanoonPK-Pakistan-Legal-Directory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline transition-colors inline-flex items-center gap-1"
                >
                  {t('Open Source on GitHub', 'گٹ ہب پر اوپن سورس')}
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Explore Links (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              {t('Explore', 'دریافت کریں')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/laws" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <BookText className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('All Laws', 'تمام قوانین')}</span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('Categories', 'اقسام')}</span>
                </Link>
              </li>
              <li>
                <Link href="/finder" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <Compass className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('Which Law Applies?', 'کون سا قانون؟')}</span>
                </Link>
              </li>
              <li>
                <Link href="/lawyers" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('Lawyers Directory', 'وکلاء ڈائریکٹری')}</span>
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('Doc Templates', 'دستاویز ٹیمپلیٹس')}</span>
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <GitCompare className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('Compare Laws', 'قوانین کا موازنہ')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Services (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              {t('Tools & Resources', 'اوزار اور وسائل')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/finder" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <Compass className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('Which Law Applies?', 'کون سا قانون؟')}</span>
                </Link>
              </li>
              <li>
                <Link href="/courts" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <Landmark className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('Court Hierarchy', 'عدالتی نظام')}</span>
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <BookText className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('Legal Glossary', 'قانونی فرہنگ')}</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                  <span>{t('FAQ & Guide', 'عام سوالات و گائیڈ')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Official Portals (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Newsletter Card */}
            <div className="rounded-xl border border-border/80 bg-card/60 p-4 shadow-sm backdrop-blur-sm space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t('Stay Updated with Gazette Alerts', 'گزٹ الرٹس اور نئی ترامیم')}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {t(
                    'Get notified whenever new legal amendments or acts are gazetted.',
                    'جب بھی کوئی نیا قانون یا ترمیم نافذ ہو اس کی فوری اطلاع پائیں۔'
                  )}
                </p>
              </div>
              <NewsletterSignup />
            </div>

            {/* Official Portals */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('Official Government Portals', 'سرکاری قانونی پورٹلز')}
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href="https://www.na.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                >
                  <span>{t('National Assembly', 'قومی اسمبلی')}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <a
                  href="https://punjablaws.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                >
                  <span>{t('Punjab Laws', 'پنجاب قوانین')}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <a
                  href="https://sindhlaws.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                >
                  <span>{t('Sindh Laws', 'سندھ قوانین')}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <a
                  href="https://fbr.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                >
                  <span>{t('FBR Revenue', 'ایف بی آر')}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>© {new Date().getFullYear()} {t('QanoonPK — Pakistan Legal Directory.', 'قانون پی کے — پاکستان قانونی ڈائریکٹری۔')}</span>
            <span className="hidden sm:inline text-muted-foreground/40">•</span>
            <span className="hidden sm:inline">{t('All laws are public record.', 'تمام قوانین عوامی ریکارڈ ہیں۔')}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/about" className="hover:text-primary transition-colors">
              {t('About Us', 'ہمارے بارے میں')}
            </Link>
            <Link href="/faq" className="hover:text-primary transition-colors">
              {t('Help & FAQs', 'مدد اور سوالات')}
            </Link>
            <Link href="/sitemap.xml" className="hover:text-primary transition-colors">
              {t('Sitemap', 'سائٹ میپ')}
            </Link>
            <Link href="/rss.xml" className="hover:text-primary transition-colors">
              {t('RSS Feed', 'آر ایس ایس')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
