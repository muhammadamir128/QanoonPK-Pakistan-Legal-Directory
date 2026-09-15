'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Send, Bot, User, Sparkles, AlertTriangle, RefreshCw, BookOpen,
  Scale, ArrowRight, Quote, Loader2, Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  { en: 'How do I file for khula?', ur: 'خلع کے لیے درخواست کیسے دیں؟' },
  { en: 'What does PECA say about online harassment?', ur: 'PECA آن لائن ہراسانی کے بارے میں کیا کہتا ہے؟' },
  { en: 'What is the minimum wage law in Punjab?', ur: 'پنجاب میں کم سے کم اجرت کا قانون کیا ہے؟' },
  { en: 'When is income tax filing due?', ur: 'انکم ٹیکس اندراج کب تک ہو؟' },
  { en: 'What is cyber terrorism under PECA?', ur: 'PECA کے تحت سائبر دہشت گردی کیا ہے؟' },
]

export default function ChatPage() {
  const { t, lang } = useLanguage()
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Load conversation from localStorage
  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('qpk-chat') ?? '[]') as ChatMessage[]
      if (Array.isArray(stored) && stored.length > 0) {
        setMessages(stored)
      }
    } catch {}
  }, [])

  // Persist conversation
  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('qpk-chat', JSON.stringify(messages.slice(-20)))
    }
  }, [messages])

  // Auto-scroll
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

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
      if (!data.ok) throw new Error(data.error ?? 'Failed')

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
    setMessages([])
    localStorage.removeItem('qpk-chat')
    setError(null)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 md:py-10 flex flex-col h-[calc(100vh-9rem)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('AI Assistant', 'اے آئی اسسٹنٹ')}</span>
        </div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md shrink-0">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                {t('Qanoon Assistant', 'قانون اسسٹنٹ')}
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" /> {t('AI Beta', 'اے آئی بیٹا')}
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t('Ask questions about Pakistan\'s laws. Answers cite laws from our database.', 'پاکستان کے قوانین کے بارے میں سوالات پوچھیں۔ جوابات ڈیٹابیس کے قوانین سے حوالہ دیتے ہیں۔')}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground">
              <RefreshCw className="h-4 w-4 mr-1.5" />
              {t('Clear chat', 'چیٹ صاف کریں')}
            </Button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col overflow-hidden border-border/60">
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 space-y-4 bg-muted/20"
        >
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 space-y-5">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
                  <Scale className="h-8 w-8" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-accent-foreground" />
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-lg font-semibold">
                  {t('How can I help you with Pakistan\'s laws?', 'پاکستان کے قوانین میں میں آپ کی کیسے مدد کر سکتا ہوں؟')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('Try one of these questions, or ask your own:', 'ان میں سے کوئی سوال آزمائیں، یا اپنا پوچھیں:')}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => send(lang === 'ur' ? q.ur : q.en)}
                    className="group text-left p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all text-sm flex items-start gap-2.5"
                  >
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-medium leading-snug">{lang === 'ur' ? q.ur : q.en}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} lang={lang} t={t} />
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="rounded-2xl rounded-tl-sm bg-card border border-border/60 px-4 py-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('Searching laws & thinking...', 'قوانین میں تلاش جاری ہے...')}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{t('Error', 'خرابی')}</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border/60 p-3 md:p-4 bg-card">
          <form
            onSubmit={(e) => { e.preventDefault(); send() }}
            className="flex items-end gap-2"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('Ask about any Pakistan law...', 'کسی بھی پاکستانی قانون کے بارے میں پوچھیں...')}
              className="flex-1 h-11"
              disabled={loading}
              maxLength={1000}
            />
            <Button
              type="submit"
              size="default"
              disabled={loading || !input.trim()}
              className="h-11 px-5"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className={cn('h-4 w-4', lang === 'ur' && 'rotate-180')} />}
              <span className="sr-only">{t('Send', 'بھیجیں')}</span>
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            {t('AI can make mistakes. Always verify with a licensed lawyer.', 'اے آئی غلطی کر سکتا ہے۔ ہمیشہ لائسنس یافتہ وکیل سے تصدیق کریں۔')}
          </p>
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="mt-3 rounded-lg border border-amber-300/40 bg-amber-50 dark:bg-amber-950/20 p-3 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          {t(
            'This AI assistant provides information based only on laws in our directory. It is NOT legal advice. For any legal matter, consult a qualified licensed lawyer in Pakistan.',
            'یہ اے آئی اسسٹنٹ صرف ہماری ڈائریکٹری کے قوانین پر مبنی معلومات فراہم کرتا ہے۔ یہ قانونی مشورہ نہیں ہے۔ کسی بھی قانونی معاملے کے لیے پاکستان میں لائسنس یافتہ وکیل سے رجوع کریں۔'
          )}
        </p>
      </div>
    </div>
  )
}

function MessageBubble({
  msg, lang, t,
}: {
  msg: ChatMessage
  lang: 'en' | 'ur'
  t: (en: string, ur?: string) => string
}) {
  const isUser = msg.role === 'user'
  return (
    <div className={cn('flex items-start gap-3 animate-fade-in-up', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg shrink-0 shadow-sm',
          isUser
            ? 'bg-accent text-accent-foreground'
            : 'bg-gradient-to-br from-primary to-primary/70 text-primary-foreground'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn('flex-1 max-w-2xl', isUser && 'flex flex-col items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm border',
            isUser
              ? 'bg-accent/60 border-accent/40 rounded-tr-sm'
              : 'bg-card border-border/60 rounded-tl-sm'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <FormattedAnswer text={msg.content} />
            </div>
          )}
        </div>
        {/* Sources */}
        {!isUser && msg.sources && msg.sources.length > 0 && (
          <div className="mt-2 space-y-1.5 w-full">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {t('Cited laws', 'حوالہ یافتہ قوانین')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {msg.sources.map((src) => (
                <Link
                  key={src.slug}
                  href={src.url}
                  className="group inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-2.5 py-1 text-xs hover:border-primary/40 hover:bg-accent/50 transition-all"
                >
                  <Quote className="h-3 w-3 text-primary shrink-0" />
                  <span className="font-medium truncate max-w-[200px]">
                    {lang === 'ur' && src.titleUrdu ? src.titleUrdu : src.title}
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0">{src.yearEnacted}</Badge>
                  <ArrowRight className={cn('h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform', lang === 'ur' && 'rotate-180')} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Simple markdown-like formatting: **bold**, *italic*, line breaks, lists
function FormattedAnswer({ text }: { text: string }) {
  // Split into lines and paragraphs
  const lines = text.split('\n')
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return null
        // Bullet list item
        if (/^\s*[-*]\s+/.test(line)) {
          const content = line.replace(/^\s*[-*]\s+/, '')
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-primary mt-1">•</span>
              <span className="flex-1">{renderInline(content)}</span>
            </div>
          )
        }
        // Numbered list item
        if (/^\s*\d+\.\s+/.test(line)) {
          const match = line.match(/^\s*(\d+)\.\s+(.*)/)
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-primary font-mono text-xs mt-0.5">{match?.[1]}.</span>
              <span className="flex-1">{renderInline(match?.[2] ?? '')}</span>
            </div>
          )
        }
        return <p key={i} className="whitespace-pre-wrap break-words">{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(text: string): React.ReactNode {
  // Bold **text** and italic *text*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}
