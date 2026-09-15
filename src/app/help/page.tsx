'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight, Code, ArrowRight, AlertTriangle, Copy, CheckCircle2,
  FileJson, Lock, Zap, BookOpen,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Endpoint = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  description: string
  descriptionUrdu: string
  auth?: boolean
  params?: Array<{ name: string; type: string; required?: boolean; description: string }>
  example?: string
  exampleResponse?: string
}

const ENDPOINTS: Endpoint[] = [
  // Laws
  {
    method: 'GET',
    path: '/api/laws',
    description: 'List all laws with filters and pagination',
    descriptionUrdu: 'فلٹرز اور پیجینیشن کے ساتھ تمام قوانین کی فہرست',
    params: [
      { name: 'category', type: 'string', description: 'Category slug (e.g. criminal-law)' },
      { name: 'jurisdiction', type: 'string', description: 'federal, punjab, sindh, kpk, balochistan' },
      { name: 'status', type: 'string', description: 'active, repealed, amended' },
      { name: 'year', type: 'number', description: 'Year enacted (e.g. 1860)' },
      { name: 'q', type: 'string', description: 'Search query' },
      { name: 'sort', type: 'string', description: 'popular, newest, oldest, az, za' },
      { name: 'page', type: 'number', description: 'Page number (default: 1)' },
      { name: 'limit', type: 'number', description: 'Items per page (default: 20, max: 50)' },
    ],
    example: '/api/laws?category=criminal-law&sort=popular&page=1&limit=12',
    exampleResponse: `{
  "items": [
    {
      "id": "cl...",
      "slug": "pakistan-penal-code-1860",
      "title": "Pakistan Penal Code 1860",
      "titleUrdu": "پاکستان پینل کوڈ 1860",
      "yearEnacted": 1860,
      "jurisdiction": "federal",
      "status": "amended",
      "summary": "...",
      "category": { "name": "Criminal Law", "slug": "criminal-law" }
    }
  ],
  "total": 60,
  "page": 1,
  "limit": 12,
  "totalPages": 5
}`,
  },
  {
    method: 'GET',
    path: '/api/laws/[slug]',
    description: 'Get full law detail with sections, amendments, related laws',
    descriptionUrdu: 'شقوں، ترامیم، متعلقہ قوانین کے ساتھ مکمل قانون تفصیل',
    params: [
      { name: 'slug', type: 'string', required: true, description: 'URL-friendly law identifier' },
    ],
    example: '/api/laws/pakistan-penal-code-1860',
  },
  {
    method: 'POST',
    path: '/api/laws',
    description: 'Create a new law (admin only)',
    descriptionUrdu: 'نیا قانون بنائیں (صرف ایڈمن)',
    auth: true,
    params: [
      { name: 'title', type: 'string', required: true, description: 'Law title' },
      { name: 'slug', type: 'string', required: true, description: 'URL slug (unique)' },
      { name: 'categoryId', type: 'string', required: true, description: 'Category ID' },
      { name: 'yearEnacted', type: 'number', required: true, description: 'Year of enactment' },
      { name: 'jurisdiction', type: 'string', description: 'federal | punjab | ...' },
      { name: 'status', type: 'string', description: 'active | repealed | amended' },
      { name: 'summary', type: 'string', description: 'Plain-language summary' },
    ],
  },
  {
    method: 'PATCH',
    path: '/api/laws/[slug]',
    description: 'Update an existing law (admin only)',
    descriptionUrdu: 'موجودہ قانون میں ترمیم (صرف ایڈمن)',
    auth: true,
  },
  {
    method: 'DELETE',
    path: '/api/laws/[slug]',
    description: 'Delete a law (admin only)',
    descriptionUrdu: 'قانون حذف کریں (صرف ایڈمن)',
    auth: true,
  },

  // Categories
  {
    method: 'GET',
    path: '/api/categories',
    description: 'List all categories with law counts',
    descriptionUrdu: 'قانون کاؤنٹ کے ساتھ تمام اقسام کی فہرست',
    example: '/api/categories',
  },
  {
    method: 'GET',
    path: '/api/categories/[slug]/laws',
    description: 'Get all laws under a specific category',
    descriptionUrdu: 'مخصوص قسم کے تحت تمام قوانین حاصل کریں',
    params: [
      { name: 'slug', type: 'string', required: true, description: 'Category slug' },
      { name: 'sort', type: 'string', description: 'popular, newest, oldest, az' },
      { name: 'limit', type: 'number', description: 'Max results (default: 50)' },
    ],
    example: '/api/categories/criminal-law/laws?sort=popular',
  },

  // Search
  {
    method: 'GET',
    path: '/api/search',
    description: 'Full-text search across laws and sections',
    descriptionUrdu: 'قوانین اور شقوں میں مکمل متن تلاش',
    params: [
      { name: 'q', type: 'string', required: true, description: 'Search query' },
      { name: 'page', type: 'number', description: 'Page number' },
      { name: 'limit', type: 'number', description: 'Items per page' },
    ],
    example: '/api/search?q=theft',
  },

  // Finder
  {
    method: 'GET',
    path: '/api/finder',
    description: 'Get the guided questionnaire tree',
    descriptionUrdu: 'راہنمائی شدہ سوالنامہ حاصل کریں',
  },
  {
    method: 'POST',
    path: '/api/finder',
    description: 'Submit answers to get recommended laws',
    descriptionUrdu: 'تجویز کردہ قوانین حاصل کرنے کے لیے جوابات جمع کریں',
    params: [
      { name: 'slugs', type: 'string[]', required: true, description: 'Array of law slugs selected' },
    ],
  },

  // Lawyers
  {
    method: 'GET',
    path: '/api/lawyers',
    description: 'List verified lawyers with filters',
    descriptionUrdu: 'فلٹرز کے ساتھ تصدیق شدہ وکلاء کی فہرست',
    params: [
      { name: 'city', type: 'string', description: 'City name (e.g. Lahore)' },
      { name: 'specialization', type: 'string', description: 'Category slug' },
      { name: 'verified', type: 'boolean', description: 'true for verified only' },
      { name: 'featured', type: 'boolean', description: 'true for featured only' },
      { name: 'q', type: 'string', description: 'Search query' },
      { name: 'sort', type: 'string', description: 'featured, rating, experience' },
      { name: 'page', type: 'number', description: 'Page number' },
      { name: 'limit', type: 'number', description: 'Items per page (max: 50)' },
    ],
    example: '/api/lawyers?city=Lahore&specialization=family-law&sort=rating',
  },
  {
    method: 'GET',
    path: '/api/lawyers/[slug]',
    description: 'Get lawyer detail with reviews and related lawyers',
    descriptionUrdu: 'تبصروں اور متعلقہ وکلاء کے ساتھ وکیل تفصیل',
    example: '/api/lawyers/barrister-ayesha-khan',
  },
  {
    method: 'POST',
    path: '/api/lawyers/[slug]/reviews',
    description: 'Submit a review for a lawyer',
    descriptionUrdu: 'وکیل کے لیے تبصرہ جمع کریں',
    params: [
      { name: 'authorName', type: 'string', required: true, description: 'Reviewer name' },
      { name: 'rating', type: 'number', required: true, description: 'Rating 1-5' },
      { name: 'comment', type: 'string', description: 'Optional comment (max 1000 chars)' },
    ],
  },

  // Templates
  {
    method: 'GET',
    path: '/api/templates',
    description: 'List document templates',
    descriptionUrdu: 'دستاویز ٹیمپلیٹس کی فہرست',
    params: [
      { name: 'category', type: 'string', description: 'Template category' },
      { name: 'q', type: 'string', description: 'Search query' },
    ],
  },
  {
    method: 'GET',
    path: '/api/templates/[slug]',
    description: 'Get template detail with fields',
    descriptionUrdu: 'خانوں کے ساتھ ٹیمپلیٹ تفصیل',
    example: '/api/templates/affidavit-of-identity',
  },
  {
    method: 'POST',
    path: '/api/templates/[slug]/generate',
    description: 'Fill template with values and download',
    descriptionUrdu: 'قدروں کے ساتھ ٹیمپلیٹ بھریں اور ڈاؤن لوڈ کریں',
    params: [
      { name: 'values', type: 'object', required: true, description: 'Key-value pairs for fields' },
      { name: 'lang', type: 'string', description: 'en or ur' },
      { name: 'format', type: 'string', description: 'text or html' },
    ],
  },

  // FAQ
  {
    method: 'GET',
    path: '/api/faq',
    description: 'List FAQ items with optional filters',
    descriptionUrdu: 'اختیاری فلٹرز کے ساتھ FAQ آئٹمز کی فہرست',
    params: [
      { name: 'q', type: 'string', description: 'Search query' },
      { name: 'category', type: 'string', description: 'FAQ category' },
    ],
  },

  // Stats
  {
    method: 'GET',
    path: '/api/stats',
    description: 'Get site-wide statistics for dashboard/homepage',
    descriptionUrdu: 'ڈیش بورڈ/صفحۂ اول کے لیے سائٹ گیرا اعداد و شمار',
    example: '/api/stats',
  },

  // Chat
  {
    method: 'POST',
    path: '/api/chat',
    description: 'Ask the AI legal assistant (RAG-based)',
    descriptionUrdu: 'اے آئی قانونی اسسٹنٹ سے پوچھیں (RAG پر مبنی)',
    params: [
      { name: 'message', type: 'string', required: true, description: 'User question (max 1000 chars)' },
      { name: 'history', type: 'array', description: 'Conversation history' },
      { name: 'lang', type: 'string', description: 'en or ur' },
    ],
  },
  {
    method: 'GET',
    path: '/api/compare',
    description: 'Compare two laws side-by-side (returns full details of both)',
    descriptionUrdu: 'دو قوانین کا موازنہ (دونوں کی مکمل تفصیلات)',
    params: [
      { name: 'slug1', type: 'string', required: true, description: 'First law slug' },
      { name: 'slug2', type: 'string', required: true, description: 'Second law slug' },
    ],
    example: '/api/compare?slug1=pakistan-penal-code-1860&slug2=qanun-e-shahadat-order-1984',
  },
  {
    method: 'GET',
    path: '/api/analytics',
    description: 'Search analytics dashboard data',
    descriptionUrdu: 'تلاش تجزیات ڈیش بورڈ ڈیٹا',
    params: [
      { name: 'days', type: 'number', description: 'Days to track (default: 30)' },
    ],
    example: '/api/analytics?days=30',
  },
  {
    method: 'POST',
    path: '/api/newsletter',
    description: 'Subscribe to newsletter for amendment notifications',
    descriptionUrdu: 'ترامیم کی اطلاع کے لیے نیوز لیٹر سبسکرائب',
    params: [
      { name: 'email', type: 'string', required: true, description: 'Subscriber email' },
      { name: 'name', type: 'string', description: 'Optional subscriber name' },
      { name: 'preferences', type: 'array', description: 'Category slugs to follow' },
    ],
  },
  {
    method: 'DELETE',
    path: '/api/newsletter',
    description: 'Unsubscribe from newsletter',
    descriptionUrdu: 'نیوز لیٹر سبسکرائب ختم کریں',
    params: [
      { name: 'email', type: 'string', required: true, description: 'Subscriber email' },
    ],
  },
]

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  PATCH: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  DELETE: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
}

export default function ApiDocsPage() {
  const { t, lang } = useLanguage()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(t('Copied to clipboard', 'کلپ بورڈ میں کاپی ہو گیا'))
    })
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
          <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
          <span>{t('API Docs', 'اے پی آئی دستاویز')}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shrink-0">
            <Code className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('Public API Documentation', 'پبلک اے پی آئی دستاویز')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
              {t(
                'Build applications on top of QanoonPK. RESTful endpoints for laws, lawyers, templates, search, and more.',
                'قانون پی کے پر ایپلیکیشنز بنائیں۔ قوانین، وکلاء، ٹیمپلیٹس، تلاش وغیرہ کے لیے RESTful اینڈ پوائنٹس۔'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-sm">{t('Free Tier', 'مفت سطح')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t('No API key required (yet)', 'ابھی API کلید کی ضرورت نہیں')}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <FileJson className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-sm">{t('JSON Only', 'صرف JSON')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t('All responses are JSON', 'تمام جوابات JSON ہیں')}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-sm">{t('Bilingual', 'دو لسانی')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t('English + Urdu responses', 'انگریزی + اردو جوابات')}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Base URL */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-xs text-muted-foreground mb-1">{t('Base URL', 'بنیادی یو آر ایل')}</div>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">https://[your-domain]/api</code>
            </div>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard('https://[your-domain]/api')}>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              {t('Copy', 'کاپی')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick start */}
      <Card className="mb-8 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {t('Quick Start', 'فوری آغاز')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('Try these endpoints in your browser or with curl', 'ان اینڈ پوائنٹس کو اپنے براؤزر یا curl میں آزمائیں')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-muted p-3 font-mono text-xs space-y-1.5 overflow-x-auto">
            <div className="text-muted-foreground"># List all laws</div>
            <div className="text-emerald-600 dark:text-emerald-400">curl <span className="text-foreground">'/api/laws?limit=10'</span></div>
            <div className="text-muted-foreground mt-2"># Search laws</div>
            <div className="text-emerald-600 dark:text-emerald-400">curl <span className="text-foreground">'/api/search?q=theft'</span></div>
            <div className="text-muted-foreground mt-2"># Get lawyer detail</div>
            <div className="text-emerald-600 dark:text-emerald-400">curl <span className="text-foreground">'/api/lawyers/barrister-ayesha-khan'</span></div>
            <div className="text-muted-foreground mt-2"># Generate document</div>
            <div className="text-emerald-600 dark:text-emerald-400">curl -X POST <span className="text-foreground">'/api/templates/affidavit-of-identity/generate'</span> \</div>
            <div className="ps-4">-H <span className="text-foreground">'Content-Type: application/json'</span> \</div>
            <div className="ps-4">-d <span className="text-foreground">'{"{"}"values":{"{"}"deponentName":"Ahmed"{"}"},"lang":"en","format":"text"{"}"}'</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Code className="h-5 w-5 text-primary" />
        {t('Endpoints', 'اینڈ پوائنٹس')}
        <Badge variant="secondary" className="text-xs">{ENDPOINTS.length}</Badge>
      </h2>

      <div className="space-y-3">
        {ENDPOINTS.map((ep, i) => (
          <EndpointCard key={i} endpoint={ep} lang={lang} t={t} onCopy={copyToClipboard} />
        ))}
      </div>

      {/* Rate limiting */}
      <Card className="mt-10 border-amber-300/50 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-200">
                {t('Rate Limiting & Authentication', 'ریٹ لیمٹنگ اور تصدیق')}
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                {t(
                  'Currently, all endpoints are open and free. In production, we plan to add: (1) API key authentication; (2) Rate limiting (e.g. 100 req/hour per IP for unauthenticated, 1000/hour for free tier, 10000/hour for paid); (3) Quota tracking per endpoint. POST/PATCH/DELETE on /api/laws require admin authentication in production.',
                  'فی الحال، تمام اینڈ پوائنٹس کھلے اور مفت ہیں۔ پروڈکشن میں، ہم شامل کرنے کا ارادہ رکھتے ہیں: (1) API کلید تصدیق؛ (2) ریٹ لیمٹنگ (مثلاً 100 درخواست/گھنٹہ فی IP غیر مصدقہ کے لیے، 1000/گھنٹہ مفت سطح کے لیے، 10000/گھنٹہ ادا کردہ کے لیے)؛ (3) کوٹہ ٹریکنگ فی اینڈ پوائنٹ۔ /api/laws پر POST/PATCH/DELETE پروڈکشن میں ایڈمن تصدیق کی ضرورت رکھتے ہیں۔'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="mt-6 bg-amber-50 dark:bg-amber-950/20 border-amber-300/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              {t(
                'API responses are for informational purposes only and do not constitute legal advice. Always verify information with primary sources. QanoonPK is not liable for any decisions made based on API data.',
                'API جوابات صرف معلوماتی مقاصد کے لیے ہیں اور قانونی مشورہ نہیں۔ ہمیشہ معلومات بنیادی ذرائع سے تصدیق کریں۔ قانون پی کے API ڈیٹا پر مبنی کسی بھی فیصلے کا ذمہ دار نہیں۔'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EndpointCard({
  endpoint, lang, t, onCopy,
}: {
  endpoint: Endpoint
  lang: 'en' | 'ur'
  t: (en: string, ur?: string) => string
  onCopy: (text: string) => void
}) {
  const [expanded, setExpanded] = React.useState(false)
  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="secondary" className={`font-mono text-xs ${METHOD_COLORS[endpoint.method]}`}>
            {endpoint.method}
          </Badge>
          <code className="text-sm font-mono font-medium">{endpoint.path}</code>
          {endpoint.auth && (
            <Badge variant="outline" className="text-[10px]">
              <Lock className="h-3 w-3 mr-1" />
              {t('Auth', 'تصدیق')}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {lang === 'ur' ? endpoint.descriptionUrdu : endpoint.description}
          </span>
          <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-90')} />
        </div>
      </button>
      {expanded && (
        <CardContent className="pt-0 space-y-3 border-t border-border/40">
          {/* Parameters */}
          {endpoint.params && endpoint.params.length > 0 && (
            <div className="pt-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {t('Parameters', 'پیرامیٹرز')}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-1.5 pr-4 font-medium text-muted-foreground">{t('Name', 'نام')}</th>
                      <th className="text-left py-1.5 pr-4 font-medium text-muted-foreground">{t('Type', 'قسم')}</th>
                      <th className="text-left py-1.5 font-medium text-muted-foreground">{t('Description', 'تفصیل')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.params.map((p, i) => (
                      <tr key={i} className="border-b border-border/20">
                        <td className="py-1.5 pr-4 font-mono">
                          {p.required && <span className="text-destructive">*</span>}
                          {p.name}
                        </td>
                        <td className="py-1.5 pr-4 font-mono text-muted-foreground">{p.type}</td>
                        <td className="py-1.5 text-muted-foreground">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Example request */}
          {endpoint.example && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('Example Request', 'مثال درخواست')}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => onCopy(endpoint.example!)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {t('Copy', 'کاپی')}
                </Button>
              </div>
              <pre className="rounded-md bg-muted p-3 text-xs font-mono overflow-x-auto">{endpoint.example}</pre>
            </div>
          )}

          {/* Example response */}
          {endpoint.exampleResponse && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                {t('Example Response', 'مثال جواب')}
              </h4>
              <pre className="rounded-md bg-muted p-3 text-xs font-mono overflow-x-auto max-h-64">{endpoint.exampleResponse}</pre>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
