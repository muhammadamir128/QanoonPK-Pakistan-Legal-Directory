'use client'

import * as React from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'

export interface ConfirmDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  titleUrdu?: string
  itemName?: string
  itemType?: string
  itemTypeUrdu?: string
  description?: string
  descriptionUrdu?: string
  onConfirm: () => Promise<void> | void
  isDeleting?: boolean
}

export function ConfirmDeleteModal({
  open,
  onOpenChange,
  title,
  titleUrdu,
  itemName,
  itemType = 'Item',
  itemTypeUrdu = 'آئٹم',
  description,
  descriptionUrdu,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'
  const [internalLoading, setInternalLoading] = React.useState(false)

  const loading = isDeleting || internalLoading

  const handleConfirm = async () => {
    try {
      setInternalLoading(true)
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !loading && onOpenChange(val)}>
      <DialogContent
        showCloseButton={!loading}
        className="sm:max-w-[440px] p-6 sm:p-7 rounded-2xl border border-destructive/20 bg-card text-card-foreground shadow-2xl backdrop-blur-xl gap-0"
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        <DialogHeader className="flex flex-col items-center text-center pb-2">
          {/* Visual Trash Warning Badge */}
          <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/25 text-destructive shadow-inner group">
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-destructive border-2 border-background" />
            </span>
            <Trash2 className="h-6 w-6 stroke-[2.2] transition-transform duration-300 group-hover:scale-110" />
          </div>

          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            {isUrdu && titleUrdu
              ? titleUrdu
              : title || t('Confirm Permanent Deletion', 'حذف کرنے کی تصدیق')}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 px-1">
            {isUrdu && descriptionUrdu
              ? descriptionUrdu
              : description ||
                t(
                  'Are you sure you want to delete this record? This action cannot be undone.',
                  'کیا آپ واقعی اس ریکارڈ کو مستقل طور پر حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں لیا جا سکتا۔'
                )}
          </DialogDescription>
        </DialogHeader>

        {/* Item Preview Card */}
        {itemName && (
          <div className="my-4 p-3.5 rounded-xl bg-destructive/5 dark:bg-destructive/10 border border-destructive/15 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className={`flex-1 min-w-0 ${isUrdu ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0 border-destructive/30 text-destructive bg-background/50"
                >
                  {isUrdu ? itemTypeUrdu : itemType}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground break-words line-clamp-2 leading-snug">
                {itemName}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {t('This entry will be permanently removed from the database.', 'یہ اندراج ڈیٹابیس سے مستقل ختم کر دیا جائے گا۔')}
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <DialogFooter className="mt-2 flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold border-border hover:bg-muted/80 cursor-pointer"
          >
            {t('Cancel', 'منسوخ کریں')}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-destructive/20 gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('Deleting...', 'حذف ہو رہا ہے...')}</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>{t('Delete Permanently', 'مستقل حذف کریں')}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
