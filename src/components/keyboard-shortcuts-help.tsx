'use client'

import * as React from 'react'
import { Keyboard, X } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'
import { SHORTCUTS } from '@/hooks/use-keyboard-shortcuts'

export function KeyboardShortcutsHelp() {
  const { t, lang } = useLanguage()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('qpk-show-shortcuts', handler)
    return () => window.removeEventListener('qpk-show-shortcuts', handler)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            {t('Keyboard Shortcuts', 'کی بورڈ شارٹ کٹس')}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t('Use these shortcuts to navigate the site quickly.', 'سائٹ پر جلدی نیویگیٹ کرنے کے لیے یہ شارٹ کٹس استعمال کریں۔')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-3 p-2 rounded hover:bg-accent/50 transition-colors">
              <span className="text-sm">{lang === 'ur' ? s.descriptionUrdu : s.description}</span>
              <div className="flex items-center gap-1">
                {s.key.split(' ').map((k, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-muted-foreground text-xs">+</span>}
                    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 text-xs font-mono font-medium shadow-sm">
                      {k}
                    </kbd>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          {t('Press ? anytime to show this help', 'یہ مدد دکھانے کے لیے ? دبائیں')}
        </p>
      </DialogContent>
    </Dialog>
  )
}
