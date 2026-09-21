'use client'

import * as React from 'react'
import { Twitter, Facebook, MessageCircle, Linkedin, Link2, Check, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/components/language-provider'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type SocialShareProps = {
  title: string
  slug?: string
  url?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon'
  className?: string
}

export function SocialShare({
  title, slug, url, variant = 'outline', size = 'sm', className,
}: SocialShareProps) {
  const { t } = useLanguage()
  const [copied, setCopied] = React.useState(false)

  // Compute the share URL — use provided url or build from slug + window origin
  const shareUrl = React.useMemo(() => {
    if (url) return url
    if (typeof window !== 'undefined' && slug) {
      return `${window.location.origin}/laws/${slug}`
    }
    return typeof window !== 'undefined' ? window.location.href : ''
  }, [url, slug])

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  const shareText = `${title} — ${t('via QanoonPK', 'قانون پی کے کے ذریعے')}`

  const links = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success(t('Link copied to clipboard', 'لنک کلپ بورڈ میں کاپی ہو گیا'))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(t('Copy failed', 'کاپی ناکام'))
    }
  }

  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl })
      } catch {}
    } else {
      copyLink()
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={size === 'icon' ? 'h-9 w-9' : ''}>
            <Share2 className="h-4 w-4" />
            {size !== 'icon' && <span className="ml-1.5 hidden sm:inline">{t('Share', 'شیئر')}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {t('Share on social media', 'سوشل میڈیا پر شیئر کریں')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 cursor-pointer">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                <Twitter className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Twitter / X</span>
                <span className="text-[10px] text-muted-foreground">{t('Post on Twitter', 'ٹوئٹر پر پوسٹ')}</span>
              </div>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 cursor-pointer">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Facebook className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Facebook</span>
                <span className="text-[10px] text-muted-foreground">{t('Share on Facebook', 'فیس بک پر شیئر')}</span>
              </div>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 cursor-pointer" data-action="share/whatsapp/share">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <MessageCircle className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">WhatsApp</span>
                <span className="text-[10px] text-muted-foreground">{t('Send via WhatsApp', 'واٹس ایپ پر بھیجیں')}</span>
              </div>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 cursor-pointer">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Linkedin className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">LinkedIn</span>
                <span className="text-[10px] text-muted-foreground">{t('Share on LinkedIn', 'لنکڈ ان پر شیئر')}</span>
              </div>
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyLink} className="flex items-center gap-3 cursor-pointer">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{copied ? t('Copied!', 'کاپی ہو گیا!') : t('Copy Link', 'لنک کاپی')}</span>
              <span className="text-[10px] text-muted-foreground">{t('Copy direct URL', 'براہ راست یو آر ایل کاپی')}</span>
            </div>
          </DropdownMenuItem>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <DropdownMenuItem onClick={nativeShare} className="flex items-center gap-3 cursor-pointer">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Share2 className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{t('More...', 'مزید...')}</span>
                <span className="text-[10px] text-muted-foreground">{t('Native share dialog', 'نئٹیو شیئرڈایل')}</span>
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
