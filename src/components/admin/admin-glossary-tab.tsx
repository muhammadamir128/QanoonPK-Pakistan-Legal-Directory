'use client'

import * as React from 'react'
import {
  BookOpen, Search, Plus, Edit2, Trash2, Tags, Check,
  Sparkles, AlertCircle, Languages, X, ExternalLink,
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
import { glossaryTerms as initialGlossaryTerms, GlossaryTerm } from '@/lib/glossary-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

const ITEMS_PER_PAGE = 12

export function AdminGlossaryTab() {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'

  const [terms, setTerms] = React.useState<GlossaryTerm[]>(initialGlossaryTerms)
  const [search, setSearch] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [page, setPage] = React.useState(1)

  // Delete modal state
  const [termToDelete, setTermToDelete] = React.useState<GlossaryTerm | null>(null)

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingTerm, setEditingTerm] = React.useState<GlossaryTerm | null>(null)

  const [formTerm, setFormTerm] = React.useState('')
  const [formTermUrdu, setFormTermUrdu] = React.useState('')
  const [formPronunciation, setFormPronunciation] = React.useState('')
  const [formDefinition, setFormDefinition] = React.useState('')
  const [formDefinitionUrdu, setFormDefinitionUrdu] = React.useState('')
  const [formCategory, setFormCategory] = React.useState('Criminal')
  const [formCategoryUrdu, setFormCategoryUrdu] = React.useState('فوجداری')

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1)
  }, [search, categoryFilter])

  const categories = React.useMemo(() => {
    const set = new Set<string>()
    terms.forEach((t) => set.add(t.category))
    return Array.from(set)
  }, [terms])

  const filteredTerms = terms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(search.toLowerCase()) ||
      term.termUrdu.includes(search) ||
      term.definition.toLowerCase().includes(search.toLowerCase()) ||
      term.definitionUrdu.includes(search)
    const matchesCategory = categoryFilter === 'all' || term.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.max(1, Math.ceil(filteredTerms.length / ITEMS_PER_PAGE))
  const paginatedTerms = filteredTerms.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleOpenCreate = () => {
    setEditingTerm(null)
    setFormTerm('')
    setFormTermUrdu('')
    setFormPronunciation('')
    setFormDefinition('')
    setFormDefinitionUrdu('')
    setFormCategory('Criminal')
    setFormCategoryUrdu('فوجداری')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (term: GlossaryTerm) => {
    setEditingTerm(term)
    setFormTerm(term.term)
    setFormTermUrdu(term.termUrdu)
    setFormPronunciation(term.pronunciation || '')
    setFormDefinition(term.definition)
    setFormDefinitionUrdu(term.definitionUrdu)
    setFormCategory(term.category)
    setFormCategoryUrdu(term.categoryUrdu)
    setIsModalOpen(true)
  }

  const confirmDelete = () => {
    if (!termToDelete) return
    setTerms((prev) => prev.filter((item) => item.id !== termToDelete.id))
    toast.success(t('Term deleted successfully', 'اصطلاح کامیابی سے حذف ہو گئی'))
    setTermToDelete(null)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTerm.trim() || !formTermUrdu.trim()) {
      toast.error(t('Please enter both English and Urdu term names', 'دونوں زبانوں میں نام درج کریں'))
      return
    }

    if (editingTerm) {
      setTerms((prev) =>
        prev.map((item) =>
          item.id === editingTerm.id
            ? {
                ...item,
                term: formTerm.trim(),
                termUrdu: formTermUrdu.trim(),
                pronunciation: formPronunciation.trim() || undefined,
                definition: formDefinition.trim(),
                definitionUrdu: formDefinitionUrdu.trim(),
                category: formCategory,
                categoryUrdu: formCategoryUrdu,
              }
            : item
        )
      )
      toast.success(t('Term updated successfully', 'اصطلاح اپ ڈیٹ ہو گئی'))
    } else {
      const newTerm: GlossaryTerm = {
        id: formTerm.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        term: formTerm.trim(),
        termUrdu: formTermUrdu.trim(),
        pronunciation: formPronunciation.trim() || undefined,
        definition: formDefinition.trim(),
        definitionUrdu: formDefinitionUrdu.trim(),
        category: formCategory,
        categoryUrdu: formCategoryUrdu,
      }
      setTerms((prev) => [newTerm, ...prev])
      toast.success(t('New term added to glossary', 'نئی اصطلاح فرہنگ میں شامل کر دی گئی'))
    }

    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-primary/5 to-transparent border border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-bold">
              {t('Lexicon & Definitions', 'قانونی فرہنگ')}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {filteredTerms.length} {t('Terms Active', 'اصطلاحات')}
              {filteredTerms.length > ITEMS_PER_PAGE && ` • ${t('Page', 'صفحہ')} ${page} / ${totalPages}`}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            {t('Legal Glossary Management', 'قانونی فرہنگ کا انتظام')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t(
              'Bilingual dictionary of Pakistani statutes, Islamic jurisprudence, and procedural terminology.',
              'پاکستانی قوانین، فقہ اسلامی اور عدالتی ضابطہ کار کی دو لسانی فرہنگ۔'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="h-9 gap-1.5 border-border/80">
            <Link href="/glossary" target="_blank">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{t('View Public Page', 'عوامی صفحہ دیکھیں')}</span>
            </Link>
          </Button>
          <Button size="sm" onClick={handleOpenCreate} className="h-9 gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>{t('Add Term', 'اصطلاح شامل کریں')}</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('Search terms by English or Urdu title, definition...', 'اصطلاح کا نام یا تشریح تلاش کریں...')}
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
            {t('All Categories', 'تمام اقسام')}
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

      {/* Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-2xl text-muted-foreground text-sm">
          {t('No glossary terms match your search or filter.', 'کوئی اصطلاح نہیں ملی۔')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTerms.map((term) => (
            <Card key={term.id} className="border-border/80 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-foreground">
                      {term.term}
                    </span>
                    {term.pronunciation && (
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded">
                        /{term.pronunciation}/
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0">
                    {isUrdu ? term.categoryUrdu : term.category}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-primary font-urdu pt-1 text-right" dir="rtl">
                  {term.termUrdu}
                </p>
              </CardHeader>

              <CardContent className="space-y-3 text-xs pt-0">
                <div className="p-2.5 rounded-lg bg-muted/40 space-y-1.5 border border-border/50">
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {term.definition}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-[11px] font-urdu text-right pt-1 border-t border-border/40" dir="rtl">
                    {term.definitionUrdu}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(term)}
                    className="h-8 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>{t('Edit', 'ترمیم')}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTermToDelete(term)}
                    className="h-8 px-2 text-xs gap-1 text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t('Delete', 'حذف')}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredTerms.length > ITEMS_PER_PAGE && (
        <div className="p-4 rounded-xl border border-border/80 bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
            {t(
              `Showing ${(page - 1) * ITEMS_PER_PAGE + 1} to ${Math.min(page * ITEMS_PER_PAGE, filteredTerms.length)} of ${filteredTerms.length} terms`,
              `${filteredTerms.length} میں سے ${(page - 1) * ITEMS_PER_PAGE + 1} تا ${Math.min(page * ITEMS_PER_PAGE, filteredTerms.length)} اصطلاحات`
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
        open={!!termToDelete}
        onOpenChange={(open) => !open && setTermToDelete(null)}
        title={t('Delete Legal Term', 'اصطلاح حذف کریں')}
        titleUrdu="اصطلاح حذف کریں"
        itemName={termToDelete ? `${termToDelete.term} (${termToDelete.termUrdu})` : ''}
        itemType="Glossary Term"
        itemTypeUrdu="قانونی اصطلاح"
        description={t(
          `Are you sure you want to delete "${termToDelete?.term}"? This will remove it from the public legal dictionary.`,
          `کیا آپ واقعی "${termToDelete?.term}" کو لغت سے حذف کرنا چاہتے ہیں؟`
        )}
        onConfirm={confirmDelete}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingTerm ? t('Edit Glossary Term', 'اصطلاح میں ترمیم') : t('Add Legal Term', 'نئی اصطلاح شامل کریں')}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t('Enter English and Urdu definitions and category for legal term.', 'قانونی اصطلاح کی دونوں زبانوں میں تفصیل درج کریں۔')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('English Term', 'انگریزی اصطلاح')}</Label>
                <Input
                  required
                  placeholder="e.g. Habeas Corpus"
                  value={formTerm}
                  onChange={(e) => setFormTerm(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('Urdu Term', 'اردو اصطلاح')}</Label>
                <Input
                  required
                  placeholder="مثلاً حبسِ بے جا"
                  value={formTermUrdu}
                  onChange={(e) => setFormTermUrdu(e.target.value)}
                  className="h-9 text-xs text-right font-urdu"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t('Pronunciation Guide', 'تلفظ (اختیاری)')}</Label>
                <Input
                  placeholder="e.g. hay-bee-us kor-pus"
                  value={formPronunciation}
                  onChange={(e) => setFormPronunciation(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('Category', 'شعبہ')}</Label>
                <Input
                  placeholder="Criminal, Civil, Family, Property..."
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{t('English Definition', 'انگریزی تعریف')}</Label>
              <Textarea
                required
                rows={3}
                placeholder="Comprehensive explanation of the legal concept..."
                value={formDefinition}
                onChange={(e) => setFormDefinition(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{t('Urdu Definition', 'اردو تشریح')}</Label>
              <Textarea
                required
                rows={3}
                placeholder="اصطلاح کا اردو میں جامع مفہوم..."
                value={formDefinitionUrdu}
                onChange={(e) => setFormDefinitionUrdu(e.target.value)}
                className="text-xs text-right font-urdu"
                dir="rtl"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                {t('Cancel', 'منسوخ')}
              </Button>
              <Button type="submit" size="sm">
                {editingTerm ? t('Update Term', 'اپڈیٹ کریں') : t('Create Term', 'شامل کریں')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
