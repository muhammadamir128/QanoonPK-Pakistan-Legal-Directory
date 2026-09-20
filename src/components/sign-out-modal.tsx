'use client'

import * as React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useLanguage } from '@/components/language-provider'

interface SignOutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  callbackUrl?: string
}

export function SignOutModal({
  open,
  onOpenChange,
  callbackUrl = '/',
}: SignOutModalProps) {
  const { data: session } = useSession()
  const { t, lang } = useLanguage()
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut({ callbackUrl })
    } catch (error) {
      console.error('Failed to sign out:', error)
      setIsSigningOut(false)
    }
  }

  // Reset loading state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setIsSigningOut(false)
    }
  }, [open])

  const isUrdu = lang === 'ur'

  return (
    <Dialog open={open} onOpenChange={(val) => !isSigningOut && onOpenChange(val)}>
      <DialogContent
        showCloseButton={!isSigningOut}
        className="sm:max-w-[420px] p-6 sm:p-7 rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xl backdrop-blur-xl gap-0"
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        <DialogHeader className="flex flex-col items-center text-center pb-2">
          {/* Visual Logout Icon Badge */}
          <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive shadow-inner group">
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-destructive border-2 border-background" />
            </span>
            <LogOut className="h-6 w-6 stroke-[2.2] translate-x-0.5 transition-transform duration-300 group-hover:scale-110" />
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {t('Sign Out of QanoonPK?', 'لاگ آؤٹ کی تصدیق')}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 px-1">
            {t(
              'Are you sure you want to end your session? You will need to sign in again to access your saved laws and preferences.',
              'کیا آپ واقعی اپنا سیشن ختم کرنا چاہتے ہیں؟ محفوظ شدہ قوانین اور ترجیحات تک رسائی کے لیے آپ کو دوبارہ لاگ ان کرنا ہوگا۔'
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Current User Session Preview */}
        {session?.user && (
          <div className="my-4 p-3 rounded-xl bg-muted/50 dark:bg-muted/30 border border-border/60 flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/20 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className={`flex-1 min-w-0 ${isUrdu ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {session.user.name || t('Account User', 'صارف')}
                </p>
                {(session.user as any)?.role && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                    {(session.user as any).role}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <DialogFooter className="mt-2 pt-2 border-t border-border/40 flex flex-row gap-2.5 sm:gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isSigningOut}
            onClick={() => onOpenChange(false)}
            className="flex-1 h-10 rounded-xl font-medium text-xs sm:text-sm border-border/80 hover:bg-muted"
          >
            {t('Cancel', 'منسوخ کریں')}
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="flex-1 h-10 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-destructive/20 hover:shadow-none transition-all flex items-center justify-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('Signing Out...', 'لاگ آؤٹ ہو رہا ہے...')}</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                <span>{t('Sign Out', 'لاگ آؤٹ')}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
