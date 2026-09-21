'use client'

import * as React from 'react'
import {
  HelpCircle, Search, Plus, Edit2, Trash2, FileText, CheckCircle2,
  ExternalLink, Layers, Check, Sparkles, Tag, BookText,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { ConfirmDeleteModal } from '@/components/confirm-delete-modal'
import { useLanguage } from '@/components/language-provider'
import { faqItems as initialFaqItems, FAQItem } from '@/lib/faq-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

const ITEMS_PER_PAGE = 8

export function AdminFaqTab() {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'

  const [faqs, setFaqs] = React.useState<FAQItem[]>(initialFaqItems)
  const [search, setSearch] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [page, setPage] = React.useState(1)

  // Delete modal state
  const [faqToDelete, setFaqToDelete] = React.useState<FAQItem | null>(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingFaq, setEditingFaq] = React.useState<FAQItem | null>(null)

  const [formQuestion, setFormQuestion] = React.useState('')
  const [formQuestionUrdu, setFormQuestionUrdu] = React.useState('')
  const [formAnswer, setFormAnswer] = React.useState('')
  const [formAnswerUrdu, setFormAnswerUrdu] = React.useState('')
  const [formCategory, setFormCategory] = React.useState('Criminal')
  const [formCategoryUrdu, setFormCategoryUrdu] = React.useState('فوجداری')
  const [formRelatedLaws, setFormRelatedLaws] = React.useState('')

  // Reset page on search or category filter change
  React.useEffect(() => {
    setPage(1)
  }, [search, categoryFilter])

  const categories = React.useMemo(() => {
    const set = new Set<string>()
    faqs.forEach((f) => set.add(f.category))
    return Array.from(set)
  }, [faqs])

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.questionUrdu.includes(search) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.answerUrdu.includes(search)
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE))
  const paginatedFaqs = filteredFaqs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleOpenCreate = () => {
    setEditingFaq(null)
    setFormQuestion('')
    setFormQuestionUrdu('')
    setFormAnswer('')
    setFormAnswerUrdu('')
    setFormCategory('Criminal')
    setFormCategoryUrdu('فوجداری')
    setFormRelatedLaws('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (faq: FAQItem) => {
    setEditingFaq(faq)
    setFormQuestion(faq.question)
    setFormQuestionUrdu(faq.questionUrdu)
    setFormAnswer(faq.answer)
    setFormAnswerUrdu(faq.answerUrdu)
    setFormCategory(faq.category)
    setFormCategoryUrdu(faq.categoryUrdu)
    setFormRelatedLaws((faq.relatedLaws || []).join(', '))
    setIsModalOpen(true)
  }

  const confirmDelete = () => {
    if (!faqToDelete) return
    setFaqs((prev) => prev.filter((item) => item.id !== faqToDelete.id))
    toast.success(t('FAQ deleted successfully', 'سوال کامیابی سے حذف ہو گیا'))
    setFaqToDelete(null)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formQuestion.trim() || !formQuestionUrdu.trim()) {
      toast.error(t('Please enter question in both English and Urdu', 'دونوں زبانوں میں سوال درج کریں'))
      return
    }

    const lawsArray = formRelatedLaws
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((item) =>
          item.id === editingFaq.id
            ? {
                ...item,
                question: formQuestion.trim(),
                questionUrdu: formQuestionUrdu.trim(),
                answer: formAnswer.trim(),
                answerUrdu: formAnswerUrdu.trim(),
                category: formCategory,
                categoryUrdu: formCategoryUrdu,
                relatedLaws: lawsArray,
              }
            : item
        )
      )
      toast.success(t('FAQ updated successfully', 'سوال اپ ڈیٹ ہو گیا'))
    } else {
      const newFaq: FAQItem = {
        id: formQuestion.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        question: formQuestion.trim(),
        questionUrdu: formQuestionUrdu.trim(),
        answer: formAnswer.trim(),
        answerUrdu: formAnswerUrdu.trim(),
        category: formCategory,
        categoryUrdu: formCategoryUrdu,
        relatedLaws: lawsArray,
      }
      setFaqs((prev) => [newFaq, ...prev])
      toast.success(t('New FAQ created', 'نیا سوال شامل کر دیا گیا'))
    }

    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-primary/5 to-transparent border border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-bold">
              {t('Citizen Help & Guidance', 'عوامی رہنمائی')}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {filteredFaqs.length} {t('Questions Listed', 'سوالات')}
              {filteredFaqs.length > ITEMS_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${page} / ${totalPages}`}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            {t('FAQ & Legal Help Center Management', 'عمومی سوالات و قانونی رہنمائی کا انتظام')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t(
              'Manage practical legal answers for common citizen procedures (FIR, Bail, Divorce, Property, Taxes).',
              'عوامی قانونی طریقہ کار (ایف آئی آر، ضمانت، خلع، انتقال اراضی، ٹیکس) کے رہنمائی سوالات کا انتظام کریں۔'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="h-9 gap-1.5 border-border/80">
            <Link href="/faq" target="_blank">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{t('View Public Page', 'عوامی صفحہ دیکھیں')}</span>
            </Link>
          </Button>
          <Button size="sm" onClick={handleOpenCreate} className="h-9 gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>{t('Add Question', 'سوال شامل کریں')}</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('Search FAQs by question text or legal remedy...', 'سوال کا عنوان یا قانونی حل تلاش کریں...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('all')}
            className="h-9 text-xs rounded-lg whitespace-nowrap"
          >
            {t('All', 'تمام')}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
              className="h-9 text-xs rounded-lg whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Items List */}
      {filteredFaqs.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-2xl text-muted-foreground text-sm">
          {t('No FAQs found matching your criteria.', 'کوئی سوال نہیں ملا۔')}
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedFaqs.map((faq) => (
            <Card key={faq.id} className="border-border/80 hover:border-primary/50 transition-all shadow-xs">
              <CardHeader className="py-3 px-4 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                        {isUrdu ? faq.categoryUrdu : faq.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                      {faq.question}
                    </CardTitle>
                    <p className="text-xs sm:text-sm font-semibold text-primary font-urdu" dir="rtl">
                      {faq.questionUrdu}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(faq)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                      title={t('Edit', 'ترمیم')}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFaqToDelete(faq)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                      title={t('Delete', 'حذف')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="py-3 px-4 sm:px-5 pt-0 text-xs space-y-2 border-t border-border/40 mt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] text-muted-foreground leading-relaxed">
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                    <span className="text-[9px] uppercase font-bold text-foreground/70 block mb-1">English Answer:</span>
                    {faq.answer}
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 font-urdu text-right" dir="rtl">
                    <span className="text-[9px] uppercase font-bold text-foreground/70 block mb-1 font-sans text-left" dir="ltr">اردو جواب:</span>
                    {faq.answerUrdu}
                  </div>
                </div>

                {faq.relatedLaws && faq.relatedLaws.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-muted-foreground font-medium">{t('Related Statutes:', 'متعلقہ قوانین:')}</span>
                    {faq.relatedLaws.map((slug) => (
                      <span key={slug} className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono text-foreground border border-border/60">
                        {slug}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredFaqs.length > ITEMS_PER_PAGE && (
        <div className="p-4 rounded-xl border border-border/80 bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
            {t(
              `Showing ${(page - 1) * ITEMS_PER_PAGE + 1} to ${Math.min(page * ITEMS_PER_PAGE, filteredFaqs.length)} of ${filteredFaqs.length} questions`,
              `${filteredFaqs.length} میں سے ${(page - 1) * ITEMS_PER_PAGE + 1} تا ${Math.min(page * ITEMS_PER_PAGE, filteredFaqs.length)} سوالات`
            )}
          </div>
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
            >
              <ChevronLeft className={cn('h-3.5 w-3.5', isUrdu && 'rotate-180')} />
              <span>{t('Previous', 'پچھلا')}</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(7, totalPages) }).map((_, idx) => {
                let pNum: number
                if (totalPages <= 7) {
                  pNum = idx + 1
                } else if (page <= 4) {
                  pNum = idx + 1
                } else if (page >= totalPages - 3) {
                  pNum = totalPages - 6 + idx
                } else {
                  pNum = page - 3 + idx
                }
                const isActive = pNum === page
                return (
                  <Button
                    key={pNum}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pNum)}
                    className={cn(
                      'h-8 w-8 p-0 text-xs tabular-nums cursor-pointer',
                      isActive && 'font-bold shadow-sm'
                    )}
                  >
                    {pNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
            >
              <span>{t('Next', 'اگلا')}</span>
              <ChevronRight className={cn('h-3.5 w-3.5', isUrdu && 'rotate-180')} />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={!!faqToDelete}
        onOpenChange={(open) => !open && setFaqToDelete(null)}
        title={t('Delete Legal FAQ Question', 'سوال حذف کریں')}
        titleUrdu="سوال حذف کریں"
        itemName={faqToDelete?.question}
        itemType="FAQ Question"
        itemTypeUrdu="رہنمائی سوال"
        description={t(
          `Are you sure you want to delete this FAQ question? This will remove it from the citizen guidance center.`,
          `کیا آپ واقعی اس سوال کو رہنمائی مرکز سے حذف کرنا چاہتے ہیں؟`
        )}
        onConfirm={confirmDelete}
      />

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingFaq ? t('Edit FAQ Question', 'سوال میں ترمیم') : t('Add Legal FAQ Question', 'نیا رہنمائی سوال شامل کریں')}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t('Provide citizen question and detailed procedural answers in English & Urdu.', 'عوامی قانونی طریقہ کار کا انگریزی اور اردو میں جواب درج کریں۔')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label className="text-xs">{t('Question (English)', 'سوال (انگریزی)')}</Label>
              <Input
                required
                placeholder="e.g. How do I register an FIR?"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{t('Question (Urdu)', 'سوال (اردو)')}</Label>
              <Input
                required
                placeholder="مثلاً میں ایف آئی آر کیسے درج کرواؤں؟"
                value={formQuestionUrdu}
                onChange={(e) => setFormQuestionUrdu(e.target.value)}
                className="h-9 text-xs text-right font-urdu"
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('Category', 'شعبہ')}</Label>
                <Input
                  placeholder="Criminal, Civil, Family, Tax..."
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('Related Law Slugs (comma-separated)', 'متعلقہ قانون سلگ')}</Label>
                <Input
                  placeholder="e.g. pakistan-penal-code-1860"
                  value={formRelatedLaws}
                  onChange={(e) => setFormRelatedLaws(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{t('Answer (English)', 'جواب (انگریزی)')}</Label>
              <Textarea
                required
                rows={3}
                placeholder="Step-by-step procedural explanation and legal recourse..."
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{t('Answer (Urdu)', 'جواب (اردو)')}</Label>
              <Textarea
                required
                rows={3}
                placeholder="قانونی طریقہ کار اور حل کی مکمل اردو تفصیل..."
                value={formAnswerUrdu}
                onChange={(e) => setFormAnswerUrdu(e.target.value)}
                className="text-xs text-right font-urdu"
                dir="rtl"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                {t('Cancel', 'منسوخ')}
              </Button>
              <Button type="submit" size="sm">
                {editingFaq ? t('Update FAQ', 'اپڈیٹ کریں') : t('Create FAQ', 'شامل کریں')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
