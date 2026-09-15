'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronRight, FileText, Download, AlertTriangle, ArrowRight, ArrowLeft,
  Eye, Copy, Printer, RefreshCw, Loader2, FilePlus, CheckCircle2, FileDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type TemplateField = {
  key: string
  label: string
  labelUrdu?: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'select'
  required?: boolean
  placeholder?: string
  options?: string[]
}

type Template = {
  id: string
  slug: string
  title: string
  titleUrdu: string | null
  description: string
  descriptionUrdu: string
  category: string
  categoryUrdu: string
  fields: TemplateField[]
  templateText: string
  templateTextUrdu: string
  previewText: string | null
  downloads: number
  related: Array<{
    slug: string
    title: string
    titleUrdu: string | null
    category: string
  }>
}

export default function TemplateDetailPage() {
  const { t, lang } = useLanguage()
  const params = useParams<{ slug: string }>()
  const [template, setTemplate] = React.useState<Template | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [preview, setPreview] = React.useState<string>('')
  const [generating, setGenerating] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('form')

  React.useEffect(() => {
    if (!params.slug) return
    setLoading(true)
    fetch(`/api/templates/${params.slug}`)
      .then((r) => r.json())
      .then((d) => {
        setTemplate(d)
        // Initialize values with empty strings
        const init: Record<string, string> = {}
        d.fields?.forEach((f: TemplateField) => { init[f.key] = '' })
        setValues(init)
        setLoading(false)
        // Set initial preview from raw template
        const raw = lang === 'ur' ? d.templateTextUrdu : d.templateText
        setPreview(raw ?? '')
      })
      .catch(() => setLoading(false))
  }, [params.slug, lang])

  // Update preview whenever values change
  React.useEffect(() => {
    if (!template) return
    const source = lang === 'ur' ? template.templateTextUrdu : template.templateText
    let filled = source ?? ''
    for (const [key, val] of Object.entries(values)) {
      filled = filled.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), val || `{{${key}}}`)
    }
    setPreview(filled)
  }, [values, template, lang])

  const handleFieldChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const generateDocument = async (format: 'text' | 'html' | 'pdf') => {
    if (!template) return
    setGenerating(true)
    try {
      const res = await fetch(`/api/templates/${template.slug}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values, lang, format }),
      })

      if (format === 'pdf') {
        // PDF is returned as binary blob
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Failed' }))
          toast.error(err.error ?? t('Failed to generate PDF', 'پی ڈی ایف بنانے میں ناکام'))
          return
        }
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = window.document.createElement('a')
        a.href = url
        const disposition = res.headers.get('Content-Disposition') ?? ''
        const filenameMatch = disposition.match(/filename="?([^"]+)"?/)
        a.download = filenameMatch?.[1] ?? `${template.slug}-${Date.now()}.pdf`
        window.document.body.appendChild(a)
        a.click()
        window.document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success(t('PDF downloaded', 'پی ڈی ایف ڈاؤن لوڈ ہو گیا'))
      } else {
        const data = await res.json()
        if (data.ok) {
          const blob = new Blob([data.content], { type: data.contentType })
          const url = URL.createObjectURL(blob)
          const a = window.document.createElement('a')
          a.href = url
          a.download = data.filename
          window.document.body.appendChild(a)
          a.click()
          window.document.body.removeChild(a)
          URL.revokeObjectURL(url)
          toast.success(format === 'html' ? t('HTML document downloaded', 'ایچ ٹی ایم ایل دستاویز ڈاؤن لوڈ ہو گئی') : t('Text file downloaded', 'ٹیکسٹ فائل ڈاؤن لوڈ ہو گئی'))
        } else {
          toast.error(data.error ?? t('Failed to generate document', 'دستاویز بنانے میں ناکام'))
        }
      }
    } finally {
      setGenerating(false)
    }
  }

  const printPreview = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${lang}" dir="${lang === 'ur' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="utf-8" />
        <title>${template?.title ?? 'Document'}</title>
        <style>
          body { font-family: ${lang === 'ur' ? "'Noto Nastaliq Urdu', serif" : "'Times New Roman', Georgia, serif"}; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 20px; }
          pre { white-space: pre-wrap; font-family: inherit; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px dashed #999; font-size: 11px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <pre>${preview}</pre>
        <div class="footer">Generated by QanoonPK — Pakistan Legal Directory</div>
      </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 500)
  }

  const copyPreview = async () => {
    try {
      await navigator.clipboard.writeText(preview)
      toast.success(t('Copied to clipboard', 'کلپ بورڈ میں کاپی ہو گیا'))
    } catch {
      toast.error(t('Copy failed', 'کاپی ناکام'))
    }
  }

  const resetForm = () => {
    if (!template) return
    const init: Record<string, string> = {}
    template.fields.forEach((f) => { init[f.key] = '' })
    setValues(init)
    toast.info(t('Form cleared', 'فارم صاف ہو گیا'))
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('Template not found', 'ٹیمپلیٹ نہیں ملا')}</h1>
        <Button asChild className="mt-4"><Link href="/templates">{t('Browse templates', 'ٹیمپلیٹس دیکھیں')}</Link></Button>
      </div>
    )
  }

  const filledCount = Object.values(values).filter((v) => v && v.trim()).length
  const progress = template.fields.length > 0 ? Math.round((filledCount / template.fields.length) * 100) : 0

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
        <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <Link href="/templates" className="hover:text-primary">{t('Templates', 'ٹیمپلیٹس')}</Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <span className="truncate">{lang === 'ur' && template.titleUrdu ? template.titleUrdu : template.title}</span>
      </nav>

      {/* Header */}
      <div className="rounded-2xl overflow-hidden border border-border/60 mb-6 bg-primary/5">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-primary/50" />
        <div className="p-6 md:p-8 flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md shrink-0">
            <FileText className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="secondary" className="text-xs">{lang === 'ur' ? template.categoryUrdu : template.category}</Badge>
              <Badge variant="outline" className="text-xs">{template.fields.length} {t('fields', 'خانے')}</Badge>
              <Badge variant="outline" className="text-xs">{template.downloads} {t('downloads', 'ڈاؤن لوڈ')}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {lang === 'ur' && template.titleUrdu ? template.titleUrdu : template.title}
            </h1>
            {lang === 'en' && template.titleUrdu && (
              <p className="text-sm text-muted-foreground font-urdu mt-1" dir="rtl">{template.titleUrdu}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              {lang === 'ur' && template.descriptionUrdu ? template.descriptionUrdu : template.description}
            </p>
          </div>
        </div>
      </div>

      {/* Form + preview tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 h-11">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            {t('Fill Form', 'فارم بھریں')}
            <Badge variant="outline" className="text-[10px] ml-2">{filledCount}/{template.fields.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {t('Preview', 'پیش نظارہ')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4">
          {/* Progress bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-muted-foreground">{t('Form Progress', 'فارم کی پیش رفت')}</span>
                <span className="font-semibold tabular-nums">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form fields */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('Document Information', 'دستاویز کی معلومات')}
                </span>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> {t('Reset', 'ری سیٹ')}
                </Button>
              </CardTitle>
              <CardDescription className="text-xs">
                {t('Fill in all required fields marked with * to generate your document.', 'تمام ضروری خانے * کے ساتھ بھریں تاکہ آپ کی دستاویز تیار ہو سکے۔')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {template.fields.map((field) => (
                  <div key={field.key} className={cn('space-y-1.5', field.type === 'textarea' && 'md:col-span-2')}>
                    <Label htmlFor={field.key} className="text-sm font-medium flex items-center gap-1.5">
                      {lang === 'ur' && field.labelUrdu ? field.labelUrdu : field.label}
                      {field.required && <span className="text-destructive">*</span>}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.key}
                        value={values[field.key] ?? ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        rows={3}
                        placeholder={field.placeholder}
                      />
                    ) : field.type === 'date' ? (
                      <Input
                        id={field.key}
                        type="date"
                        value={values[field.key] ?? ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      />
                    ) : field.type === 'number' ? (
                      <Input
                        id={field.key}
                        type="number"
                        value={values[field.key] ?? ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        type="text"
                        value={values[field.key] ?? ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="font-urdu-placeholder"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Button asChild variant="ghost" size="sm">
              <Link href="/templates">
                <ArrowLeft className={cn('h-4 w-4 mr-2', lang === 'ur' && 'rotate-180')} />
                {t('Back to templates', 'ٹیمپلیٹس پر واپس')}
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('preview')}>
                <Eye className="h-4 w-4 mr-2" />
                {t('Preview', 'پیش نظارہ')}
              </Button>
              <Button size="sm" onClick={() => generateDocument('text')} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                {t('Download Text', 'ٹیکسٹ ڈاؤن لوڈ')}
              </Button>
              <Button size="sm" onClick={() => generateDocument('html')} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                {t('Download HTML', 'ایچ ٹی ایم ایل ڈاؤن لوڈ')}
              </Button>
              <Button size="sm" variant="default" onClick={() => generateDocument('pdf')} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
                {t('Download PDF', 'پی ڈی ایف ڈاؤن لوڈ')}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-primary" />
                  {t('Live Preview', 'براہ راست پیش نظارہ')}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm" onClick={copyPreview} className="h-8">
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    {t('Copy', 'کاپی')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={printPreview} className="h-8">
                    <Printer className="h-3.5 w-3.5 mr-1.5" />
                    {t('Print', 'پرنٹ')}
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="text-xs">
                {t('Preview updates as you fill the form. Unfilled fields show as [______].', 'جیسے جیسے آپ فارم بھرتے ہیں پیش نظارہ اپ ڈیٹ ہوتا رہتا ہے۔ خالی خانے [______] کے طور پر نظر آتے ہیں۔')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'rounded-lg border border-border bg-card p-6 max-h-[600px] overflow-y-auto scrollbar-thin',
                  lang === 'ur' && 'font-urdu text-right'
                )}
                dir={lang === 'ur' ? 'rtl' : 'ltr'}
              >
                <pre className={cn('whitespace-pre-wrap text-sm leading-relaxed', lang === 'ur' && 'leading-loose')}>
                  {preview}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Button asChild variant="ghost" size="sm">
              <Link href="/templates">
                <ArrowLeft className={cn('h-4 w-4 mr-2', lang === 'ur' && 'rotate-180')} />
                {t('Back to templates', 'ٹیمپلیٹس پر واپس')}
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('form')}>
                <FilePlus className="h-4 w-4 mr-2" />
                {t('Edit Form', 'فارم میں ترمیم')}
              </Button>
              <Button size="sm" onClick={() => generateDocument('text')} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                {t('Download Text', 'ٹیکسٹ ڈاؤن لوڈ')}
              </Button>
              <Button size="sm" onClick={() => generateDocument('html')} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                {t('Download HTML', 'ایچ ٹی ایم ایل ڈاؤن لوڈ')}
              </Button>
              <Button size="sm" variant="default" onClick={() => generateDocument('pdf')} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
                {t('Download PDF', 'پی ڈی ایف ڈاؤن لوڈ')}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related templates */}
      {template.related && template.related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-3">{t('Related Templates', 'متعلقہ ٹیمپلیٹس')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {template.related.map((r) => (
              <Link key={r.slug} href={`/templates/${r.slug}`} className="block group">
                <Card className="hover:shadow-md hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <Badge variant="outline" className="text-[10px] mb-2">{r.category}</Badge>
                    <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                      {lang === 'ur' && r.titleUrdu ? r.titleUrdu : r.title}
                    </h3>
                    <div className="mt-2 text-xs text-primary inline-flex items-center gap-1">
                      {t('Open', 'کھولیں')} <ArrowRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <Card className="mt-8 bg-amber-50 dark:bg-amber-950/20 border-amber-300/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              {t(
                'This template is for educational purposes only. Have a licensed lawyer review your final document before signing. QanoonPK is not liable for any legal consequences of using this template.',
                'یہ ٹیمپلیٹ صرف تعلیمی مقاصد کے لیے ہے۔ دستخط سے پہلے اپنی حتمی دستاویز لائسنس یافتہ وکیل سے جائزہ لوانیں۔ قانون پی کے اس ٹیمپلیٹ کے استعمال کے کسی بھی قانونی نتائج کا ذمہ دار نہیں۔'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
