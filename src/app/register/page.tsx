'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Suspense } from 'react'
import {
  User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight,
  ShieldCheck, AlertCircle, CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthLayout } from '@/components/auth/auth-layout'
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
  const [agreeTerms, setAgreeTerms] = React.useState(true)
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

    if (!agreeTerms) {
      setErrorMessage(
        t('Please accept the Terms of Service to continue.', 'براہ کرم جاری رکھنے کے لیے شرائط و ضوابط قبول کریں۔')
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
    <AuthLayout
      mode="register"
      title={t('Create your account', 'نیا اکاؤنٹ بنائیں')}
      subtitle={t('Enter your details to create your legal directory profile', 'اپنا قانونی پروفائل بنانے کے لیے معلومات درج کریں')}
      icon={<User className="h-7 w-7 text-primary" />}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Full Name Field */}
        <div className="space-y-1">
          <Label htmlFor="name" className="text-xs font-semibold text-foreground/85">
            {t('Full Name', 'پورا نام')}
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder={t('e.g. Barrister Ali Khan', 'مثلاً: بیرسٹر علی خان')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-muted/30 border-border/80 focus-visible:ring-primary text-sm shadow-sm transition-colors"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs font-semibold text-foreground/85">
            {t('Email Address', 'ای میل ایڈریس')}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="lawyer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-muted/30 border-border/80 focus-visible:ring-primary text-sm shadow-sm transition-colors"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <Label htmlFor="password" className="text-xs font-semibold text-foreground/85">
            {t('Password', 'پاس ورڈ')}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={t('At least 6 characters', 'کم از کم 6 حروف')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 rounded-xl bg-muted/30 border-border/80 focus-visible:ring-primary text-sm shadow-sm transition-colors"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground/85">
            {t('Confirm Password', 'پاس ورڈ کی تصدیق کریں')}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={t('Re-enter your password', 'اپنا پاس ورڈ دوبارہ درج کریں')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-muted/30 border-border/80 focus-visible:ring-primary text-sm shadow-sm transition-colors"
              required
              minLength={6}
            />
          </div>
        </div>

        {/* Terms agreement checkbox */}
        <div className="flex items-start space-x-2 pt-1">
          <Checkbox
            id="terms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(!!checked)}
            className="rounded border-border mt-0.5 data-[state=checked]:bg-primary"
          />
          <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug cursor-pointer select-none">
            {t('I agree to the', 'میں متفق ہوں')}{' '}
            <Link href="/about" className="text-primary hover:underline font-medium">
              {t('Terms of Service', 'شرائط و ضوابط')}
            </Link>{' '}
            {t('&', 'اور')}{' '}
            <Link href="/about" className="text-primary hover:underline font-medium">
              {t('Privacy Policy', 'رازداری کی پالیسی')}
            </Link>
          </label>
        </div>

        {/* Create Account Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm mt-2"
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
      </form>
    </AuthLayout>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
