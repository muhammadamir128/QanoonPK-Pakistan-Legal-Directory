'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Suspense } from 'react'
import {
  Scale, User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight,
  ShieldCheck, CheckCircle2, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/components/language-provider'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { data: session, status } = useSession()
  const { t } = useLanguage()

  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
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

    if (!name.trim()) {
      setErrorMessage(t('Please enter your full name.', 'براہ کرم اپنا پورا نام درج کریں۔'))
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(t('Please enter a valid email address.', 'براہ کرم درست ای میل درج کریں۔'))
      return
    }

    if (password.length < 6) {
      setErrorMessage(
        t('Password must be at least 6 characters long.', 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔')
      )
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        t('Passwords do not match. Please verify.', 'پاس ورڈز مماثل نہیں ہیں۔ براہ کرم چیک کریں۔')
      )
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        setErrorMessage(data.error || t('Failed to register. Please try again.', 'رجسٹریشن ناکام ہو گئی۔ براہ کرم دوبارہ کوشش کریں۔'))
        setLoading(false)
        return
      }

      toast.success(t('Account created! Signing you in...', 'اکاؤنٹ بن گیا! لاگ ان ہو رہا ہے...'))

      // Automatically sign in the user
      const loginRes = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
      })

      if (loginRes?.error) {
        toast.info(t('Account created. Please log in with your credentials.', 'اکاؤنٹ بن گیا۔ براہ کرم لاگ ان کریں۔'))
        router.push('/login')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err: any) {
      setErrorMessage(t('An unexpected network error occurred.', 'نیٹ ورک کی خرابی پیش آگئی۔'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-muted/20 via-background to-muted/30">
      <div className="w-full max-w-md space-y-6">
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
            {t('Create an Account', 'نیا اکاؤنٹ بنائیں')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('Join Pakistan\'s leading bilingual legal research directory', 'پاکستان کی سب سے بڑی قانونی ڈائریکٹری میں شامل ہوں')}
          </p>
        </div>

        {/* Card */}
        <Card className="border-border/80 shadow-lg shadow-black/5 bg-card/85 backdrop-blur-md">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-lg">
                {t('Register', 'رجسٹریشن')}
              </CardTitle>
              <CardDescription>
                {t('Fill out your details to get started for free', 'شروع کرنے کے لیے اپنی معلومات درج کریں')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-medium">
                  {t('Full Name', 'پورا نام')}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t('e.g. Barrister Ali Khan', 'مثلاً: بیرسٹر علی خان')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 h-10 bg-background/50 focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

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
                    placeholder="lawyer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10 bg-background/50 focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium">
                  {t('Password', 'پاس ورڈ')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('At least 6 characters', 'کم از کم 6 حروف')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 h-10 bg-background/50 focus-visible:ring-primary"
                    required
                    minLength={6}
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-medium">
                  {t('Confirm Password', 'پاس ورڈ کی تصدیق کریں')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('Re-enter your password', 'اپنا پاس ورڈ دوبارہ درج کریں')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 h-10 bg-background/50 focus-visible:ring-primary"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Security notice */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('Free forever for citizens, lawyers, and students', 'شہریوں، وکلاء اور طلباء کے لیے مکمل طور پر مفت')}</span>
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
                    {t('Creating account...', 'اکاؤنٹ بن رہا ہے...')}
                  </>
                ) : (
                  <>
                    {t('Create Account', 'اکاؤنٹ بنائیں')}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground pt-1">
                {t('Already have an account?', 'کیا آپ کا پہلے سے اکاؤنٹ ہے؟')}{' '}
                <Link
                  href={`/login${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {t('Sign in here', 'یہاں لاگ ان کریں')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>{t('Your personal data is encrypted and strictly protected', 'آپ کی معلومات مکمل محفوظ اور خفیہ ہیں')}</span>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
