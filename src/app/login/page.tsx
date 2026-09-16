'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Suspense } from 'react'
import {
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthLayout } from '@/components/auth/auth-layout'
import { useLanguage } from '@/components/language-provider'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { data: session, status } = useSession()
  const { t } = useLanguage()

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
    <AuthLayout
      mode="login"
      title={t('Login to your account', 'اپنے اکاؤنٹ میں لاگ ان کریں')}
      subtitle={t('Enter your credentials below to access your legal directory dashboard', 'اپنے قانونی پورٹل میں لاگ ان کے لیے معلومات درج کریں')}
      icon={<Lock className="h-7 w-7 text-primary" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-foreground/85">
            {t('Email Address', 'ای میل ایڈریس')}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t('name@example.com', 'name@example.com')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-muted/30 border-border/80 focus-visible:ring-primary text-sm shadow-sm transition-colors"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-foreground/85">
              {t('Password', 'پاس ورڈ')}
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 rounded-xl bg-muted/30 border-border/80 focus-visible:ring-primary text-sm shadow-sm transition-colors"
              required
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

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              className="rounded border-border data-[state=checked]:bg-primary"
            />
            <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none font-medium">
              {t('Remember me', 'مجھے یاد رکھیں')}
            </label>
          </div>
          <Link
            href="/faq"
            className="text-xs text-primary hover:underline font-semibold transition-colors"
          >
            {t('Forgot password?', 'پاس ورڈ بھول گئے؟')}
          </Link>
        </div>

        {/* Continue Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl font-semibold shadow-md shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-sm mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t('Signing in...', 'لاگ ان ہو رہا ہے...')}
            </>
          ) : (
            <>
              {t('Continue', 'جاری رکھیں')}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
