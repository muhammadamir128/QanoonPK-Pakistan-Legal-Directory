'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, BookText, ArrowRight, Sparkles, Scale, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SearchResultItem {
  type: 'law' | 'section'
  slug: string
  title: string
  titleUrdu?: string | null
  snippet?: string
  snippetUrdu?: string | null
  category?: { name: string; slug: string; color?: string | null }
  yearEnacted?: number
  sectionNumber?: string
  lawSlug?: string
}

const POPULAR_SEARCHES = [
  { en: 'Pakistan Penal Code', ur: 'مجموعہ تعزیرات پاکستان' },
  { en: 'Constitution of Pakistan', ur: 'آئینِ پاکستان' },
  { en: 'Family Courts Act', ur: 'فیملی کورٹس ایکٹ' },
  { en: 'PECA Cybercrime', ur: 'پیکا سائبر کرائم' },
  { en: 'Code of Criminal Procedure (CrPC)', ur: 'ضابطہ فوجداری' },
  { en: 'Income Tax Ordinance', ur: 'انکم ٹیکس آرڈیننس' },
  { en: 'Civil Procedure Code (CPC)', ur: 'ضابطہ دیوانی' },
]

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const { t, lang } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResultItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isUrdu = lang === 'ur'

  // Focus input on open & lock background scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = 'unset'
      }
    } else {
      document.body.style.overflow = 'unset'
      setQuery('')
      setResults([])
    }
  }, [open])

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  // Live search debounced
  React.useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=5`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.items || [])
        }
      } catch (err) {
        console.error('Search fetch error:', err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timeout)
  }, [query])

  const executeSearch = (searchQuery: string) => {
    const q = searchQuery.trim()
    if (q) {
      onOpenChange(false)
      router.push(`/laws?q=${encodeURIComponent(q)}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch(query)
  }

  const handleResultClick = (item: SearchResultItem) => {
    onOpenChange(false)
    if (item.type === 'section' && item.lawSlug) {
      router.push(`/laws/${item.lawSlug}#section-${item.sectionNumber || ''}`)
    } else {
      router.push(`/laws/${item.slug}`)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-20 bg-black/60 backdrop-blur-md animate-in fade-in-0 duration-200"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-card text-card-foreground border border-border/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-200 mt-10 sm:mt-16"
        dir={isUrdu ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Input Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center px-4 py-3.5 border-b border-border/60 bg-muted/20">
          <Search className={cn('h-5 w-5 text-primary shrink-0', isUrdu ? 'ml-3' : 'mr-3')} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              'Search laws, acts, legal provisions...',
              'قوانین، ایکٹس یا دفعات تلاش کریں...'
            )}
            className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />

          {loading && (
            <Loader2 className={cn('h-4 w-4 animate-spin text-muted-foreground shrink-0', isUrdu ? 'mr-2' : 'ml-2')} />
          )}

          {query && !loading && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className={cn(
                'p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shrink-0',
                isUrdu ? 'mr-2' : 'ml-2'
              )}
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <Button
            type="submit"
            size="sm"
            className={cn('shrink-0 h-9 px-3.5 text-xs font-semibold shadow-xs', isUrdu ? 'mr-2' : 'ml-2')}
          >
            {t('Search', 'تلاش کریں')}
          </Button>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn('p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shrink-0', isUrdu ? 'mr-1.5' : 'ml-1.5')}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Live search results */}
          {query.trim().length > 0 ? (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>{t('Matching Results', 'ملتے جلتے نتائج')}</span>
                {results.length > 0 && (
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {results.length} {t('found', 'ملے')}
                  </span>
                )}
              </div>

              {results.length > 0 ? (
                <div className="space-y-1.5">
                  {results.map((item, idx) => (
                    <button
                      key={`${item.slug}-${idx}`}
                      type="button"
                      onClick={() => handleResultClick(item)}
                      className="w-full text-left p-2.5 rounded-xl border border-transparent hover:border-border hover:bg-accent/60 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {item.type === 'law' ? <BookText className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {isUrdu && item.titleUrdu ? item.titleUrdu : item.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate mt-0.5">
                            {item.category?.name && (
                              <span className="inline-block px-1.5 py-0.2 rounded bg-muted text-[10px]">
                                {item.category.name}
                              </span>
                            )}
                            {item.yearEnacted && (
                              <span>• {item.yearEnacted}</span>
                            )}
                            {item.sectionNumber && (
                              <span>• Section {item.sectionNumber}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => executeSearch(query)}
                    className="w-full text-center py-2 text-xs font-semibold text-primary hover:underline mt-2"
                  >
                    {t(
                      `View all results for "${query.trim()}" →`,
                      `"${query.trim()}" کے تمام نتائج دیکھیں ←`
                    )}
                  </button>
                </div>
              ) : !loading ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-sm">{t('No laws found matching this query.', 'اس تلاش کے مطابق کوئی قانون نہیں ملا۔')}</p>
                  <p className="text-xs mt-1 text-muted-foreground/70">
                    {t('Press Enter to view full directory search.', 'پوری ڈائریکٹری میں تلاش کرنے کے لیے انٹر دبائیں۔')}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            /* Popular search suggestions */
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>{t('Popular Searches', 'مقبول ترین تلاشیں')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item.en}
                    type="button"
                    onClick={() => executeSearch(item.en)}
                    className="px-3 py-1.5 text-xs rounded-full bg-muted/60 hover:bg-primary/15 hover:text-primary border border-border/60 hover:border-primary/40 transition-all flex items-center gap-1.5 text-muted-foreground hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Scale className="h-3 w-3 text-primary/70" />
                    <span>{isUrdu ? item.ur : item.en}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-border/40 bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">↵</kbd>{' '}
              {t('to search', 'تلاش کے لیے')}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">esc</kbd>{' '}
              {t('to close', 'بند کرنے کے لیے')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="hover:text-foreground transition-colors cursor-pointer text-xs"
          >
            {t('Close', 'بند کریں')}
          </button>
        </div>
      </div>
    </div>
  )
}
