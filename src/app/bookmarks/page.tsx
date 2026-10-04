'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Bookmark, BookmarkCheck, Trash2, Search, ArrowRight,
  BookText, Scale, ExternalLink, Share2, Layers, Calendar,
  Eye, FileText, ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useLanguage } from '@/components/language-provider'
import { toast } from 'sonner'

interface LawItem {
  id: string
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted: number
  jurisdiction: string
  status: string
  summary: string | null
  summaryUrdu: string | null
  viewCount: number
  category?: {
    name: string
    nameUrdu: string
    slug: string
    color?: string | null
  }
  _count?: {
    sections: number
    amendments: number
  }
}

export default function BookmarksPage() {
  const { t, lang } = useLanguage()
  const [bookmarkSlugs, setBookmarkSlugs] = React.useState<string[]>([])
  const [laws, setLaws] = React.useState<LawItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [mounted, setMounted] = React.useState(false)

  // Load bookmarks from localStorage
  const loadSavedSlugs = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('qpk-bookmarks') ?? '[]') as string[]
      setBookmarkSlugs(stored)
      return stored
    } catch {
      setBookmarkSlugs([])
      return []
    }
  }

  React.useEffect(() => {
    setMounted(true)
    const slugs = loadSavedSlugs()
    if (slugs.length === 0) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch('/api/laws?limit=250')
      .then((res) => res.json())
      .then((data) => {
        const allLaws: LawItem[] = Array.isArray(data) ? data : (data.laws || [])
        const matched = allLaws.filter((l) => slugs.includes(l.slug))
        setLaws(matched)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load laws for bookmarks', err)
        setLoading(false)
      })
  }, [])

  const removeBookmark = (slug: string) => {
    const next = bookmarkSlugs.filter((s) => s !== slug)
    setBookmarkSlugs(next)
    setLaws((prev) => prev.filter((l) => l.slug !== slug))
    try {
      localStorage.setItem('qpk-bookmarks', JSON.stringify(next))
      toast.success(t('Removed from bookmarks', 'بک مارکس سے ہٹا دیا گیا'))
    } catch (e) {
      console.error(e)
    }
  }

  const clearAllBookmarks = () => {
    setBookmarkSlugs([])
    setLaws([])
    try {
      localStorage.removeItem('qpk-bookmarks')
      toast.success(t('All bookmarks cleared', 'تمام بک مارکس صاف کر دیے گئے'))
    } catch (e) {
      console.error(e)
    }
  }

  const filteredLaws = laws.filter((law) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      law.title.toLowerCase().includes(q) ||
      (law.titleUrdu && law.titleUrdu.includes(q)) ||
      (law.summary && law.summary.toLowerCase().includes(q)) ||
      (law.category?.name && law.category.name.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl space-y-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t('Home', 'ہوم')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/laws" className="hover:text-primary transition-colors">{t('Laws', 'قوانین')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{t('Saved Laws', 'محفوظ قوانین')}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <BookmarkCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                  {t('Saved Laws & Bookmarks', 'محفوظ قوانین و بک مارکس')}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Access your pinned statutes, reference sections, and favorite Pakistani laws anytime.',
                    'اپنے پسندیدہ اور محفوظ شدہ قوانین کو کسی بھی وقت ایک ہی جگہ ملاحظہ کریں۔'
                  )}
                </p>
              </div>
            </div>
          </div>

          {bookmarkSlugs.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs text-destructive hover:bg-destructive/10 gap-1.5 border-destructive/30">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t('Clear All', 'سب صاف کریں')}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('Clear all bookmarks?', 'تمام بک مارکس صاف کریں؟')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t(
                        'This will remove all saved laws from your local device storage. This action cannot be undone.',
                        'یہ آپ کے مقامی ڈیوائس اسٹوریج سے تمام محفوظ قوانین کو ہٹا دے گا۔'
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('Cancel', 'منسوخ')}</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllBookmarks} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {t('Yes, Clear All', 'ہاں، سب صاف کریں')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Link href="/laws">
                <Button size="sm" className="text-xs gap-1.5">
                  <BookText className="h-3.5 w-3.5" />
                  <span>{t('Explore More Laws', 'مزید قوانین دیکھیں')}</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Search bar inside bookmarks */}
        {bookmarkSlugs.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('Search within your saved laws...', 'اپنے محفوظ کردہ قوانین میں تلاش کریں...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-10 bg-background"
            />
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        ) : bookmarkSlugs.length === 0 ? (
          /* Empty State */
          <Card className="border-dashed border-2 border-border/70 p-12 text-center bg-card/50">
            <div className="max-w-md mx-auto space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bookmark className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-foreground">
                  {t('No Saved Laws Yet', 'ابھی تک کوئی قانون محفوظ نہیں کیا گیا')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(
                    'When browsing laws or sections, click the "Save" bookmark button to keep important statutes readily accessible here.',
                    'جب آپ کسی بھی قانون کا مطالعہ کر رہے ہوں تو "محفوظ کریں" کا بٹن دبا کر اسے یہاں اپنی فہرست میں شامل کر سکتے ہیں۔'
                  )}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <Link href="/laws">
                  <Button size="sm" className="text-xs gap-1.5">
                    <BookText className="h-3.5 w-3.5" />
                    <span>{t('Browse Directory', 'ڈائریکٹری دیکھیں')}</span>
                  </Button>
                </Link>
                <Link href="/finder">
                  <Button variant="outline" size="sm" className="text-xs gap-1.5">
                    <span>{t('Which Law Applies?', 'کون سا قانون؟')}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : filteredLaws.length === 0 ? (
          <Card className="p-8 text-center bg-card">
            <p className="text-xs text-muted-foreground">
              {t(`No saved laws match "${searchQuery}".`, `"${searchQuery}" سے مطابقت رکھنے والا کوئی محفوظ قانون نہیں ملا۔`)}
            </p>
          </Card>
        ) : (
          /* Laws List */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>{t(`Showing ${filteredLaws.length} saved statute(s)`, `کل ${filteredLaws.length} محفوظ شدہ قوانین`)}</span>
              <span>{t('Stored on this device', 'اس ڈیوائس پر محفوظ')}</span>
            </div>

            {filteredLaws.map((law) => (
              <Card key={law.slug} className="border-border/70 hover:border-primary/40 hover:shadow-xs transition-all bg-card">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {law.category && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 font-medium"
                          style={{
                            backgroundColor: law.category.color ? `${law.category.color}15` : undefined,
                            color: law.category.color || undefined,
                          }}
                        >
                          {lang === 'ur' ? law.category.nameUrdu : law.category.name}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">
                        {law.jurisdiction}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" />
                        {law.yearEnacted}
                      </span>
                    </div>

                    <div>
                      <Link href={`/laws/${law.slug}`} className="group">
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {law.title}
                        </h3>
                        {law.titleUrdu && (
                          <p className="text-xs text-muted-foreground font-urdu pt-0.5" dir="rtl">
                            {law.titleUrdu}
                          </p>
                        )}
                      </Link>
                    </div>

                    {law.summary && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {law.summary}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      {law._count?.sections !== undefined && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {law._count.sections} {t('Sections', 'دفعات')}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono">
                        <Eye className="h-3 w-3" />
                        {law.viewCount.toLocaleString()} {t('views', 'مشاہدات')}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <Link href={`/laws/${law.slug}`} className="w-full sm:w-auto">
                      <Button size="sm" className="w-full sm:w-auto text-xs gap-1.5">
                        <span>{t('Read Law', 'مطالعہ کریں')}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBookmark(law.slug)}
                      className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1"
                      title={t('Remove from bookmarks', 'بک مارکس سے ہٹائیں')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{t('Remove', 'ہٹائیں')}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
