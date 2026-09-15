'use client'

import * as React from 'react'
import { Mail, CheckCircle2, Loader2, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/components/language-provider'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function NewsletterSignup() {
  const { t } = useLanguage()
  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [subscribed, setSubscribed] = React.useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error(t('Please enter a valid email', 'براہ کرم درست ای میل درج کریں'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      })
      const data = await res.json()
      if (data.ok) {
        setSubscribed(true)
        toast.success(t('Subscribed! You\'ll receive amendment notifications.', 'سبسکرائب ہو گئے! آپ کو ترامیم کی اطلاع موصول ہو گی۔'))
        setEmail('')
        setName('')
      } else {
        toast.error(data.error ?? t('Failed to subscribe', 'سبسکرائب ناکام'))
      }
    } catch {
      toast.error(t('Failed to subscribe', 'سبسکرائب ناکام'))
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span>{t('Subscribed! Thank you.', 'سبسکرائب ہو گئے! شکریہ۔')}</span>
        <button
          onClick={() => setSubscribed(false)}
          className="text-xs text-muted-foreground underline hover:text-primary"
        >
          {t('Subscribe another', 'دوسرا سبسکرائب')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={subscribe} className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Bell className="h-3.5 w-3.5" />
        {t('Get notified about new laws & amendments', 'نئے قوانین و ترامیم کی اطلاع پائیں')}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder={t('Your email', 'آپ کا ای میل')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 text-sm"
          required
        />
        <Button type="submit" size="sm" disabled={loading} className="h-9 shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4 mr-1.5" />}
          {t('Subscribe', 'سبسکرائب')}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        {t('We respect your privacy. Unsubscribe anytime.', 'ہم آپ کی پرائیویسی کا احترام کرتے ہیں۔ کسی بھی وقت سبسکرائب ختم کریں۔')}
      </p>
    </form>
  )
}
