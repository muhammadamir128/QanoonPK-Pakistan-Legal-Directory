'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Scale, BarChart3, ShieldCheck, Zap, ArrowLeft, Languages,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type AuthLayoutProps = {
  mode: 'login' | 'register'
  children: React.ReactNode
  title: string
  subtitle: string
  icon: React.ReactNode
}

export function AuthLayout({
  mode,
  children,
  title,
  subtitle,
  icon,
}: AuthLayoutProps) {
  const { t, lang, setLang } = useLanguage()

  const handleGoogleSignIn = () => {
    toast.info(
      t(
        'Google OAuth sign-in is managed by administrator in production settings.',
        'گوگل لاگ ان پروڈکشن سیٹنگز میں ایڈمن کے ذریعے فعال ہے۔'
      )
    )
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col lg:grid lg:grid-cols-12 overflow-x-hidden">
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDE: Brand Hero & Value Proposition with Curved Wave     */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:col-span-5 relative overflow-hidden bg-gradient-to-br from-primary via-emerald-950 to-primary/85 dark:from-emerald-950 dark:via-background dark:to-primary/25 text-primary-foreground flex flex-col justify-between p-8 sm:p-12 lg:p-14 min-h-[420px] lg:min-h-screen shadow-2xl z-10">
        {/* Subtle ambient light orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Organic curved wave separator along the right edge on desktop */}
        <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-24 pointer-events-none overflow-hidden z-20">
          <svg
            className="h-full w-full fill-background text-background"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C65,180 100,320 60,500 C20,680 85,850 100,1000 L100,0 Z" />
          </svg>
        </div>

        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/15 backdrop-blur-md border border-white/20 text-white shadow-lg group-hover:scale-105 transition-transform">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
                <span>{t('QanoonPK', 'قانون پی کے')}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-white border border-white/20">
                  LEGAL
                </span>
              </div>
              <div className="text-xs text-emerald-200/80 font-medium">
                {t('Pakistan Legal Directory', 'پاکستان قانونی ڈائریکٹری')}
              </div>
            </div>
          </Link>
        </div>

        {/* Hero Middle Content */}
        <div className="relative z-10 py-10 lg:py-0 space-y-8 my-auto">
          <div className="space-y-3">
            <p className="text-xs uppercase font-bold tracking-widest text-emerald-300">
              {mode === 'login'
                ? t('Welcome back!', 'دوبارہ خوش آمدید!')
                : t('Join QanoonPK!', 'قانون پی کے میں شامل ہوں!')}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {mode === 'login'
                ? t('Good to see you Again!', 'آپ کو دوبارہ دیکھ کر خوشی ہوئی!')
                : t('Empowering Legal Knowledge.', 'قانونی شعور اور رسائی کا نیا سفر۔')}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md leading-relaxed font-light">
              {mode === 'login'
                ? t(
                    'Access authentic federal & provincial statutes, court judgments, deed templates, and intelligent legal assistance in Pakistan.',
                    'پاکستان کے تمام وفاقی و صوبائی قوانین، عدالتی نظائر اور قانونی ٹیمپلیٹس تک باآسانی رسائی حاصل کریں۔'
                  )
                : t(
                    'Create your free account to save bookmarks, download certified templates, and interact with the legal directory.',
                    'مفت اکاؤنٹ بنائیں تاکہ آپ اپنے پسندیدہ قوانین محفوظ کر سکیں اور قانونی ٹیمپلیٹس ڈاؤنلوڈ کر سکیں۔'
                  )}
            </p>
          </div>

          {/* Value Proposition Feature Items (Matching mockup cards) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3.5 group">
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-emerald-300 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {t('Comprehensive Analytics', 'جامع ڈائریکٹری و تجزیات')}
                </h4>
                <p className="text-xs text-emerald-200/70 leading-snug">
                  {t('150+ categorized Pakistan statutes with verified citations', 'مصدقہ اور جامع قوانین کی درجہ بندی')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group">
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-emerald-300 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {t('Verified Security & Data', 'مصدقہ قوانین و وکلاء')}
                </h4>
                <p className="text-xs text-emerald-200/70 leading-snug">
                  {t('Official gazette records, verified amendments & licensed counsel', 'سرکاری گزٹ اور مستند ترمیمات کا ریکارڈ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group">
              <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-emerald-300 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {t('Speed & Smart Assistance', 'تیز رفتار سرچ و AI مدد')}
                </h4>
                <p className="text-xs text-emerald-200/70 leading-snug">
                  {t('Bilingual search, AI legal assistant & free legal templates', 'اردو و انگریزی میں فوری قانونی رہنمائی')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info on left */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/70">
          <span>{t('Informational Legal Platform', 'معلوماتی قانونی پلیٹ فارم')}</span>
          <span>{t('Not Formal Legal Advice', 'باقاعدہ وکیلانہ مشورہ نہیں')}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT SIDE: Authentication Form Panel                         */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative overflow-y-auto bg-background">
        {/* Top Header Controls */}
        <div className="w-full flex items-center justify-between pb-6 gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className={cn('h-4 w-4 transition-transform group-hover:-translate-x-1', lang === 'ur' && 'rotate-180 group-hover:translate-x-1')} />
            <span>{t('Back to Home', 'ہوم پر جائیں')}</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Languages className="h-3.5 w-3.5 text-primary" />
              <span>{lang === 'en' ? 'اردو' : 'English'}</span>
            </Button>

            {/* Top Right Switch Button (matching screenshot "Sign In" button top right) */}
            {mode === 'login' ? (
              <Button
                size="sm"
                asChild
                className="h-8 text-xs font-semibold px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Link href="/register">
                  {t('Sign Up', 'نیا اکاؤنٹ')}
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                asChild
                className="h-8 text-xs font-semibold px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Link href="/login">
                  {t('Sign In', 'لاگ ان')}
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Center Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-6 space-y-6">
          {/* Glowing Center Icon Badge (Matching screenshot's circular glowing lock) */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                {icon}
              </div>
              <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-25" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Form Content (Inputs, checkboxes, continue button) */}
          <div className="space-y-5">
            {children}

            {/* Divider: ── or ── */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/80" />
              </div>
              <span className="relative bg-background px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                {t('or continue with', 'یا بذریعہ جاری رکھیں')}
              </span>
            </div>

            {/* Continue with Google button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full h-11 text-xs font-semibold gap-2.5 rounded-xl border-border/80 hover:bg-muted/60 transition-all cursor-pointer shadow-sm"
            >
              {/* Official Google 4-color 'G' icon */}
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.96 0 12s.46 3.84 1.26 5.42l4.02-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>{t('Continue with Google', 'گوگل کے ساتھ لاگ ان کریں')}</span>
            </Button>
          </div>

          {/* Bottom Help Text (matching screenshot: "Need help? Contact admin") */}
          <div className="pt-2 text-center text-xs text-muted-foreground space-y-1">
            <p>
              {t('Need help?', 'مدد کی ضرورت ہے؟')}{' '}
              <Link
                href="/faq"
                className="font-semibold text-primary hover:underline transition-colors ml-1"
              >
                {t('Contact admin', 'ایڈمن سے رابطہ کریں')}
              </Link>
            </p>
            {mode === 'login' ? (
              <p className="text-[11px]">
                {t("Don't have an account?", 'کیا آپ کا اکاؤنٹ نہیں ہے؟')}{' '}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  {t('Create one for free', 'مفت رجسٹر کریں')}
                </Link>
              </p>
            ) : (
              <p className="text-[11px]">
                {t('Already registered?', 'پہلے سے رجسٹرڈ ہیں؟')}{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  {t('Sign in to your account', 'اپنے اکاؤنٹ میں لاگ ان کریں')}
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-6 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} QanoonPK • {t('Pakistan Legal Directory', 'پاکستان قانونی ڈائریکٹری')}
        </div>
      </div>
    </div>
  )
}
