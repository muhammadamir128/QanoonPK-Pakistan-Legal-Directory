'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Inbox, Bot, User, Sparkles, Send, X, RefreshCw, Scale,
  BookOpen, Quote, ArrowRight, Loader2, Lightbulb, AlertTriangle,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

type Source = {
  slug: string
  title: string
  titleUrdu: string | null
  yearEnacted: number
  category: string
  url: string
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  createdAt: number
}

const SUGGESTED_QUESTIONS = [
  { en: 'What is the punishment for theft under PPC?', ur: 'PPC کے تحت چوری کی سزا کیا ہے؟' },
  { en: 'How do I file for khula in Pakistan?', ur: 'پاکستان میں خلع کی درخواست کیسے دائر کریں؟' },
  { en: 'What does PECA say about cyber harassment?', ur: 'PECA آن لائن ہراسانی کے بارے میں کیا کہتا ہے؟' },
  { en: 'What is the minimum wage law in Punjab?', ur: 'پنجاب میں کم از کم اجرت کا قانون کیا ہے؟' },
  { en: 'What are the basic rights under the 1973 Constitution?', ur: '1973 کے آئین کے تحت بنیادی حقوق کیا ہیں؟' },
]

export function AiAssistantWidget() {
  const { t, lang } = useLanguage()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Exclude from admin and auth pages
  const isExcluded =
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname?.startsWith('/auth')

  // Load conversation from localStorage
  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('qpk-chat') ?? '[]') as ChatMessage[]
      if (Array.isArray(stored) && stored.length > 0) {
        setMessages(stored)
      }
    } catch {}
  }, [])

  // Persist conversation to localStorage
  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('qpk-chat', JSON.stringify(messages.slice(-20)))
    }
  }, [messages])

  // Auto-scroll to bottom when messages update
  React.useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading, isOpen])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput('')
    setError(null)

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      createdAt: Date.now(),
    }
    const history = messages.map((m) => ({ role: m.role, content: m.content }))
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history,
          lang,
        }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error ?? 'Failed to get answer')

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        sources: data.sources ?? [],
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to get response')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    if (confirm(t('Are you sure you want to clear this conversation?', 'کیا آپ یہ گفتگو صاف کرنا چاہتے ہیں؟'))) {
      setMessages([])
      localStorage.removeItem('qpk-chat')
      setError(null)
    }
  }

  if (isExcluded) return null

  return (
    <>
      {/* Floating Chat Panel (Left Side) */}
      {isOpen && (
        <Card
          className={cn(
            'fixed z-50 left-4 sm:left-6 bottom-20 w-[calc(100vw-2rem)] sm:w-[440px] md:w-[460px] h-[580px] max-h-[calc(100vh-6.5rem)]',
            'flex flex-col overflow-hidden bg-card/95 backdrop-blur-lg border border-border/80 shadow-2xl rounded-2xl',
            'animate-in fade-in-50 slide-in-from-bottom-6 duration-200'
          )}
        >
          {/* Header Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-emerald-500 to-teal-500" />

          {/* Window Header */}
          <div className="p-3.5 border-b border-border/70 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-foreground truncate">
                    {t('Qanoon Assistant', 'قانون اسسٹنٹ')}
                  </h3>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20 shrink-0">
                    <Sparkles className="h-2.5 w-2.5 mr-0.5 inline" />
                    AI
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>{t('Legal Inbox • Citations from Pakistan laws', 'قانونی ان باکس • پاکستانی قوانین سے حوالہ جات')}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  title={t('Clear conversation', 'گفتگو صاف کریں')}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                title={t('Close Inbox', 'ان باکس بند کریں')}
                className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/15 scrollbar-thin text-xs"
          >
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center py-6 px-2 space-y-4">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                    <Scale className="h-6 w-6" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-500" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h4 className="text-sm font-bold text-foreground">
                    {t('How can I help you today?', 'آج میں آپ کی کیا مدد کر سکتا ہوں؟')}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {t(
                      'Ask any question about Pakistan laws, sections, or penalties. Answers cite legal statutes directly.',
                      'پاکستان کے قوانین، شقوں، یا سزاؤں سے متعلق کوئی بھی سوال پوچھیں۔ جوابات مستند قوانین کا حوالہ دیتے ہیں۔'
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 w-full max-w-sm pt-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-left pl-1">
                    {t('Suggested Inquiries', 'تجویز کردہ سوالات')}:
                  </span>
                  {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => send(lang === 'ur' ? q.ur : q.en)}
                      className="group text-left p-2.5 rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:bg-accent/40 transition-all text-xs flex items-start gap-2 cursor-pointer"
                    >
                      <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-foreground leading-snug line-clamp-2">
                        {lang === 'ur' ? q.ur : q.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <WidgetMessageBubble key={msg.id} msg={msg} lang={lang} t={t} />
            ))}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0 shadow-sm">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl rounded-tl-sm bg-card border border-border/70 px-3.5 py-2.5 inline-flex items-center gap-2 text-xs text-muted-foreground shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span>{t('Analyzing Pakistan statutes & thinking...', 'پاکستانی قوانین میں تلاش اور تجزیہ جاری ہے...')}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t('Error', 'خرابی')}</p>
                  <p className="text-[11px] mt-0.5">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-border/70 bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex items-center gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('Ask about any Pakistan law...', 'کسی بھی پاکستانی قانون کے بارے میں پوچھیں...')}
                className="flex-1 h-10 text-xs rounded-xl"
                disabled={loading}
                maxLength={1000}
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading || !input.trim()}
                className="h-10 w-10 p-0 rounded-xl shrink-0 shadow-sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className={cn('h-4 w-4', lang === 'ur' && 'rotate-180')} />
                )}
                <span className="sr-only">{t('Send', 'بھیجیں')}</span>
              </Button>
            </form>
            <p className="text-[9px] text-muted-foreground mt-1.5 text-center leading-tight">
              {t(
                'AI assistant for research. Not formal legal advice. Consult licensed counsel.',
                'صرف معلوماتی و تحقیقی مقاصد۔ باقاعدہ قانونی مشورہ نہیں، وکیل سے رجوع کریں۔'
              )}
            </p>
          </div>
        </Card>
      )}

      {/* Floating Trigger Button (Positioned on the Left Side) */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'group flex items-center gap-2.5 px-4 py-3 rounded-full text-xs font-bold transition-all duration-300 shadow-xl cursor-pointer border',
            isOpen
              ? 'bg-muted text-foreground border-border/80 hover:bg-accent'
              : 'bg-primary text-primary-foreground border-primary/20 hover:scale-105 active:scale-95 shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30'
          )}
          aria-label={isOpen ? t('Close Inbox', 'ان باکس بند کریں') : t('Open Legal Inbox', 'قانونی ان باکس کھولیں')}
        >
          {isOpen ? (
            <>
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              <span>{t('Close Inbox', 'ان باکس بند کریں')}</span>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <Inbox className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
              </div>
              <span className="tracking-tight">
                {t('Inbox (AI Assistant)', 'ان باکس (اے آئی اسسٹنٹ)')}
              </span>
            </>
          )}
        </button>
      </div>
    </>
  )
}

function WidgetMessageBubble({
  msg,
  lang,
  t,
}: {
  msg: ChatMessage
  lang: 'en' | 'ur'
  t: (en: string, ur?: string) => string
}) {
  const isUser = msg.role === 'user'

  return (
    <div className={cn('flex items-start gap-2.5', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-lg shrink-0 text-xs shadow-xs mt-0.5',
          isUser
            ? 'bg-accent text-accent-foreground border border-border/40'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={cn('flex-1 max-w-[85%]', isUser && 'flex flex-col items-end')}>
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs border break-words',
            isUser
              ? 'bg-primary text-primary-foreground border-primary/20 rounded-tr-xs'
              : 'bg-card text-foreground border-border/70 rounded-tl-xs'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <FormattedAnswer text={msg.content} />
          )}
        </div>

        {/* Cited Sources */}
        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div className="mt-2 space-y-1 w-full pl-1">
            <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-primary" />
              <span>{t('Statute References', 'متعلقہ قوانین')}:</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {msg.sources.map((src) => (
                <Link
                  key={src.slug}
                  href={src.url}
                  className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card px-2 py-0.5 text-[10px] hover:border-primary/40 hover:bg-accent/40 transition-colors"
                >
                  <Quote className="h-2.5 w-2.5 text-primary shrink-0" />
                  <span className="font-medium truncate max-w-[140px]">
                    {lang === 'ur' && src.titleUrdu ? src.titleUrdu : src.title}
                  </span>
                  <ArrowRight className={cn('h-2.5 w-2.5 text-muted-foreground', lang === 'ur' && 'rotate-180')} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FormattedAnswer({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return null
        if (/^\s*[-*]\s+/.test(line)) {
          const content = line.replace(/^\s*[-*]\s+/, '')
          return (
            <div key={i} className="flex gap-1.5 pl-0.5">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span className="flex-1">{renderInline(content)}</span>
            </div>
          )
        }
        if (/^\s*\d+\.\s+/.test(line)) {
          const match = line.match(/^\s*(\d+)\.\s+(.*)/)
          return (
            <div key={i} className="flex gap-1.5 pl-0.5">
              <span className="text-primary font-mono text-[10px] mt-0.5 font-bold">{match?.[1]}.</span>
              <span className="flex-1">{renderInline(match?.[2] ?? '')}</span>
            </div>
          )
        }
        return <p key={i} className="whitespace-pre-wrap">{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}
