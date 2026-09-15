'use client'

import Link from 'next/link'
import { Scale, AlertTriangle, Mail, Github, ShieldCheck, BookOpen } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { NewsletterSignup } from '@/components/newsletter-signup'

export function SiteFooter() {
  const { t, lang } = useLanguage()
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      {/* Disclaimer banner */}
      <div className="border-b border-amber-500/30 bg-amber-50 dark:bg-amber-950/30">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-start gap-3 text-sm text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              <strong className="font-semibold">
                {t('Disclaimer:', 'تنبیہ:')}
              </strong>{' '}
              {t(
                'This platform is for informational and educational purposes only. It is NOT a substitute for legal advice. For any legal matter, please consult a qualified licensed lawyer.',
                'یہ پلیٹ فارم صرف معلوماتی و تعلیمی مقاصد کے لیے ہے۔ یہ قانونی مشورے کا متبادل نہیں ہے۔ کسی بھی قانونی معاملے کے لیے لائسنس یافتہ وکیل سے رجوع کریں۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-base">{t('QanoonPK', 'قانون پی کے')}</div>
                <div className="text-[10px] text-muted-foreground">
                  {t('Pakistan Legal Directory', 'پاکستان قانونی ڈائریکٹری')}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'A free, bilingual directory of Pakistan\'s federal and provincial laws — searchable, categorized, and explained in plain language.',
                'پاکستان کے وفاقی اور صوبائی قوانین کا مفت، دو لسانی ڈائریکٹری — تلاش کے قابل، اقسام میں منظم، اور آسان زبان میں۔'
              )}
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t('Explore', 'دریافت کریں')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/laws" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('All Laws', 'تمام قوانین')}</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('Categories', 'اقسام')}</Link></li>
              <li><Link href="/finder" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('Which Law Applies?', 'کون سا قانون؟')}</Link></li>
              <li><Link href="/lawyers" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('Lawyer Directory', 'وکلاء ڈائریکٹری')}</Link></li>
              <li><Link href="/templates" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('Document Templates', 'دستاویز ٹیمپلیٹس')}</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t('Tools', 'اوزار')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/chat" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('AI Assistant', 'اے آئی اسسٹنٹ')}</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('FAQ / Help', 'سوالات و مدد')}</Link></li>
              <li><Link href="/courts" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('Court Hierarchy', 'عدالتی درجہ بندی')}</Link></li>
              <li><Link href="/glossary" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('Legal Glossary', 'قانونی فرہنگ')}</Link></li>
              <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('API Docs', 'اے پی آئی دستاویز')}</Link></li>
              <li><Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" />{t('Admin Panel', 'ایڈمن پینل')}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t('Resources', 'وسائل')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" />{t('About / Methodology', 'تعارف / طریقہ کار')}</Link></li>
              <li><a href="https://www.na.gov.pk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" />{t('National Assembly', 'قومی اسمبلی')}</a></li>
              <li><a href="https://punjablaws.gov.pk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" />{t('Punjab Laws', 'پنجاب قوانین')}</a></li>
              <li><a href="https://sindhlaws.gov.pk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" />{t('Sindh Laws', 'سندھ قوانین')}</a></li>
              <li><a href="https://fbr.gov.pk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" />{t('FBR (Tax)', 'ایف بی آر')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t('Connect', 'رابطہ')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:info@qanoonpk.example" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><Mail className="h-3.5 w-3.5" />info@qanoonpk.example</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><Github className="h-3.5 w-3.5" />{t('GitHub', 'گٹ ہب')}</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter signup row */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <div className="max-w-md">
            <NewsletterSignup />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {t('QanoonPK — Pakistan Legal Directory.', 'قانون پی کے — پاکستان قانونی ڈائریکٹری۔')}
          </p>
          <p className="font-urdu" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
            {t('All government laws are public record. Original commentary © QanoonPK.', 'تمام حکومتی قوانین عوامی ریکارڈ ہیں۔ اصل تبصرہ © قانون پی کے۔')}
          </p>
        </div>
      </div>
    </footer>
  )
}
