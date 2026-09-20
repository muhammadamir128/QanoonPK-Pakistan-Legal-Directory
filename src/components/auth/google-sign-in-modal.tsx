'use client'

import * as React from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useLanguage } from '@/components/language-provider'
import {
  User, CheckCircle2, ChevronRight, Settings, ExternalLink,
  Loader2, ShieldCheck, KeyRound, Sparkles, AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface GoogleSignInModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  callbackUrl?: string
  isLiveConfigured?: boolean
  onConfiguredChange?: (configured: boolean) => void
}

const PRESET_ACCOUNTS = [
  {
    name: 'Advocate Bilal Ahmed',
    email: 'bilal.ahmed@gmail.com',
    role: 'Lawyer / User',
    avatarLetter: 'B',
    avatarBg: 'bg-emerald-600 text-white',
  },
  {
    name: 'Advocate Fatima Noor',
    email: 'fatima.noor@gmail.com',
    role: 'Legal Scholar',
    avatarLetter: 'F',
    avatarBg: 'bg-indigo-600 text-white',
  },
  {
    name: 'Syed Hamza Ali',
    email: 'hamza.ali@gmail.com',
    role: 'Citizen User',
    avatarLetter: 'H',
    avatarBg: 'bg-amber-600 text-white',
  },
]

export function GoogleSignInModal({
  open,
  onOpenChange,
  callbackUrl = '/',
  isLiveConfigured = false,
  onConfiguredChange,
}: GoogleSignInModalProps) {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'

  const [loadingAccount, setLoadingAccount] = React.useState<string | null>(null)
  const [showCustomForm, setShowCustomForm] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)

  // Custom Google account state
  const [customName, setCustomName] = React.useState('')
  const [customEmail, setCustomEmail] = React.useState('')

  // OAuth Config State
  const [clientId, setClientId] = React.useState('')
  const [clientSecret, setClientSecret] = React.useState('')
  const [savingKeys, setSavingKeys] = React.useState(false)
  const [configMessage, setConfigMessage] = React.useState<string | null>(null)

  const handleInstantSignIn = async (name: string, email: string) => {
    try {
      setLoadingAccount(email)
      const res = await signIn('google-instant', {
        redirect: false,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        callbackUrl,
      })

      if (res?.error) {
        toast.error(t('Failed to sign in with Google', 'گوگل لاگ ان ناکام ہوا'))
      } else {
        toast.success(t(`Signed in as ${name}!`, `${name} کے طور پر لاگ ان کامیاب!`))
        onOpenChange(false)
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      console.error('Sign in error:', err)
      toast.error(t('An error occurred during sign in', 'لاگ ان کے دوران خرابی پیش آئی'))
    } finally {
      setLoadingAccount(null)
    }
  }

  const handleLiveOAuthSignIn = async () => {
    try {
      setLoadingAccount('live-google')
      await signIn('google', { callbackUrl })
    } catch (err) {
      console.error('Google live OAuth error:', err)
      toast.error(t('Google OAuth error', 'گوگل لاگ ان کی خرابی'))
      setLoadingAccount(null)
    }
  }

  const handleSaveGoogleKeys = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId.trim() || !clientSecret.trim()) {
      toast.error(t('Please enter both Client ID and Client Secret', 'دونوں کیز درج کریں'))
      return
    }

    setSavingKeys(true)
    setConfigMessage(null)

    try {
      const res = await fetch('/api/auth/google/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(t('Google OAuth configured successfully!', 'گوگل او آتھ کامیابی سے فعال ہو گیا!'))
        setConfigMessage(t('Credentials saved to .env. Live Google OAuth is ready!', 'سیٹنگز محفوظ ہو گئیں۔ گوگل او آتھ فعال ہے!'))
        onConfiguredChange?.(true)
        setShowSettings(false)
      } else {
        toast.error(data.error || 'Failed to save')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error saving keys')
    } finally {
      setSavingKeys(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[440px] p-6 rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xl backdrop-blur-xl gap-4"
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        <DialogHeader className="flex flex-col items-center text-center pb-1">
          {/* Official Google 4-color 'G' icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 border border-border/60 shadow-xs mb-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24">
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
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {t('Sign in with Google', 'گوگل کے ساتھ سائن ان کریں')}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {t(
              'Choose your Google account to access QanoonPK Legal Directory',
              'قانون پی کے میں لاگ ان کے لیے اپنا گوگل اکاؤنٹ منتخب کریں'
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Live OAuth button if configured */}
        {isLiveConfigured && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                {t('Live Google Cloud OAuth Ready', 'گوگل کلاؤڈ او آتھ فعال ہے')}
              </span>
            </div>
            <Button
              type="button"
              onClick={handleLiveOAuthSignIn}
              disabled={loadingAccount !== null}
              className="w-full h-10 text-xs font-semibold gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {loadingAccount === 'live-google' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                  <path fill="#ffffff" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24Z" />
                  <path fill="#ffffff" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.96 0 12s.46 3.84 1.26 5.42l4.02-3.15Z" />
                  <path fill="#ffffff" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                </svg>
              )}
              {t('Redirect to Google Accounts', 'گوگل اکاؤنٹ پیج پر جائیں')}
            </Button>
          </div>
        )}

        {/* Preset Google Accounts List */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
            {t('Select Google Account', 'اکاؤنٹ منتخب کریں')}
          </p>

          <div className="space-y-1.5">
            {PRESET_ACCOUNTS.map((acc) => {
              const isLoading = loadingAccount === acc.email
              return (
                <button
                  key={acc.email}
                  type="button"
                  disabled={loadingAccount !== null}
                  onClick={() => handleInstantSignIn(acc.name, acc.email)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-muted/60 transition-all text-left group cursor-pointer disabled:opacity-60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 border border-border/80 shrink-0">
                      <AvatarFallback className={`font-bold text-xs ${acc.avatarBg}`}>
                        {acc.avatarLetter}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {acc.name}
                        </p>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-primary/10 text-primary font-medium">
                          {acc.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {acc.email}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom Google Account Option */}
        <div className="pt-1">
          {!showCustomForm ? (
            <button
              type="button"
              onClick={() => setShowCustomForm(true)}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-border/80 hover:border-primary/50 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <User className="h-3.5 w-3.5" />
              {t('Use another Google account', 'کوئی دوسرا گوگل اکاؤنٹ استعمال کریں')}
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (customEmail.trim()) {
                  handleInstantSignIn(customName || customEmail.split('@')[0], customEmail)
                }
              }}
              className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-2.5 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {t('Custom Google Account', 'اپنا گوگل اکاؤنٹ درج کریں')}
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {t('Cancel', 'منسوخ')}
                </button>
              </div>

              <Input
                type="text"
                placeholder={t('Full Name (e.g. Advocate Ali)', 'پورا نام')}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="h-8 text-xs"
              />

              <Input
                type="email"
                required
                placeholder="name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="h-8 text-xs"
              />

              <Button
                type="submit"
                disabled={loadingAccount !== null || !customEmail.trim()}
                className="w-full h-8 text-xs font-semibold gap-2"
              >
                {loadingAccount === customEmail ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                {t('Continue with this account', 'اس اکاؤنٹ کے ساتھ جاری رکھیں')}
              </Button>
            </form>
          )}
        </div>

        {/* Developer / Admin Google Cloud OAuth Configuration */}
        <div className="border-t border-border/50 pt-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between text-[11px] text-muted-foreground hover:text-foreground py-1 px-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              {t('Configure Google Cloud Console OAuth', 'گوگل کلاؤڈ او آتھ سیٹنگز')}
            </span>
            <span className="text-[10px] text-primary underline">
              {showSettings ? t('Hide', 'چھپائیں') : t('Setup', 'سیٹ اپ')}
            </span>
          </button>

          {showSettings && (
            <form onSubmit={handleSaveGoogleKeys} className="mt-2.5 p-3 rounded-xl border border-border/70 bg-muted/40 space-y-2.5 animate-in fade-in text-left">
              <p className="text-[11px] text-muted-foreground leading-snug">
                {t(
                  'To use official Google Cloud OAuth, set the Authorized redirect URI in Google Cloud Console to:',
                  'گوگل کلاؤڈ کنسول میں یہ Redirect URI شامل کریں:'
                )}
              </p>
              <div className="p-1.5 rounded-md bg-background border border-border/70 font-mono text-[10px] select-all text-primary">
                {typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/google` : 'http://localhost:3007/api/auth/callback/google'}
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">{t('Google Client ID', 'کلائنٹ آئی ڈی')}</Label>
                <Input
                  type="text"
                  placeholder="xxxxx.apps.googleusercontent.com"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">{t('Google Client Secret', 'کلائنٹ سیکرٹ')}</Label>
                <Input
                  type="password"
                  placeholder="GOCSPX-xxxxxx"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              {configMessage && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {configMessage}
                </p>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={savingKeys}
                className="w-full h-8 text-xs font-semibold gap-1.5 mt-1"
              >
                {savingKeys ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Settings className="h-3.5 w-3.5" />}
                {t('Save Credentials to .env', 'سیٹنگز محفوظ کریں')}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
