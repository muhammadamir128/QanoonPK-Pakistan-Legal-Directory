'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import {
  Scale, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, CheckCircle2,
  ArrowLeft, Languages
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/components/language-provider'
import { Suspense } from 'react'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { data: session, status } = useSession()
  const { t, lang, setLang } = useLanguage()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl)
    }
  }, [status, router, callbackUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage(t('Please enter your email address.', 'براہ کرم اپنا ای میل درج کریں۔'))
      return
    }
    if (!password) {
      setErrorMessage(t('Please enter your password.', 'براہ کرم اپنا پاس ورڈ درج کریں۔'))
      return
    }

    setLoading(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
      })

      if (res?.error) {
        setErrorMessage(
          t('Invalid email or password. Please check and try again.', 'غلط ای میل یا پاس ورڈ۔ براہ کرم دوبارہ کوشش کریں۔')
        )
        toast.error(t('Login failed', 'لاگ ان ناکام'))
      } else {
        toast.success(t('Welcome back!', 'خوش آمدید!'))
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err: any) {
      setErrorMessage(t('An unexpected error occurred. Please try again.', 'غیر متوقع خرابی پیش آگئی۔ براہ کرم دوبارہ کوشش کریں۔'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-8 bg-gradient-to-b from-muted/20 via-background to-muted/40 relative">
      {/* Top Utility Nav */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>{t('Back to Home', 'واپس ہوم پیج')}</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
          className="text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Languages className="h-3.5 w-3.5 text-primary" />
          <span>{lang === 'en' ? 'اردو' : 'English'}</span>
        </Button>
      </div>

      <div className="w-full max-w-md mx-auto space-y-6 my-auto">
        {/* Top Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
              <Scale className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-xl tracking-tight text-foreground">
                {t('QanoonPK', 'قانون پی کے')}
              </div>
              <div className="text-[11px] text-muted-foreground font-medium">
                {t('Pakistan Legal Directory', 'پاکستان قانونی ڈائریکٹری')}
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground pt-2">
            {t('Sign in to your account', 'اپنے اکاؤنٹ میں لاگ ان کریں')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('Access legal directories, saved bookmarks, and custom tools', 'قانونی ڈائریکٹری، بُک مارکس اور ٹولز تک رسائی حاصل کریں')}
          </p>
        </div>

        {/* Card */}
        <Card className="border-border/80 shadow-lg shadow-black/5 bg-card/85 backdrop-blur-md">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-lg">
                {t('Sign In', 'لاگ ان')}
              </CardTitle>
              <CardDescription>
                {t('Enter your credentials below to continue', 'جاری رکھنے کے لیے اپنی معلومات درج کریں')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2">
                  <span className="font-bold shrink-0">!</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">
                  {t('Email Address', 'ای میل ایڈریس')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10 bg-background/50 focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium">
                    {t('Password', 'پاس ورڈ')}
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 h-10 bg-background/50 focus-visible:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <label htmlFor="remember" className="text-muted-foreground cursor-pointer select-none">
                    {t('Remember me on this device', 'اس ڈیوائس پر یاد رکھیں')}
                  </label>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 font-medium shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('Signing in...', 'لاگ ان ہو رہا ہے...')}
                  </>
                ) : (
                  <>
                    {t('Sign In', 'لاگ ان کریں')}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground pt-1">
                {t('Don\'t have an account?', 'کیا آپ کا اکاؤنٹ نہیں ہے؟')}{' '}
                <Link
                  href={`/register${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {t('Register here', 'یہاں رجسٹر ہوں')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>{t('Secure, encrypted authentication for Pakistan Legal Directory', 'محفوظ اور تصدیق شدہ رسائی')}</span>
        </div>
      </div>

      {/* Bottom Minimal Copyright */}
      <div className="w-full text-center text-xs text-muted-foreground pt-8">
        © {new Date().getFullYear()} {t('QanoonPK — Pakistan Legal Directory. All rights reserved.', 'قانون پی کے — جملہ حقوق محفوظ ہیں۔')}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}

