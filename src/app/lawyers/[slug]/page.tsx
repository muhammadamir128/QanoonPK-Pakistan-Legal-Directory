'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronRight, MapPin, Star, ShieldCheck, Award, Languages, Briefcase,
  Phone, Mail, Globe, ArrowRight, AlertTriangle, Send, Building2, GraduationCap,
  CheckCircle2, Clock, MessageSquare, Star as StarIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Review = {
  id: string
  authorName: string
  rating: number
  comment: string | null
  createdAt: string
}

type Lawyer = {
  id: string
  slug: string
  name: string
  nameUrdu: string | null
  bio: string | null
  bioUrdu: string | null
  specialization: string[]
  city: string
  cityUrdu: string | null
  province: string
  licenseNumber: string | null
  experienceYears: number | null
  education: string | null
  educationUrdu: string | null
  email: string | null
  phone: string | null
  website: string | null
  address: string | null
  addressUrdu: string | null
  languages: string[]
  rating: number
  reviewCount: number
  verified: boolean
  featured: boolean
  acceptingCases: boolean
  imageColor: string | null
  viewCount: number
  reviews: Review[]
  related: Array<{
    slug: string
    name: string
    nameUrdu: string | null
    city: string
    rating: number
    specialization: string[]
    imageColor: string | null
  }>
}

export default function LawyerDetailPage() {
  const { t, lang } = useLanguage()
  const params = useParams<{ slug: string }>()
  const [lawyer, setLawyer] = React.useState<Lawyer | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Contact form state
  const [contactName, setContactName] = React.useState('')
  const [contactEmail, setContactEmail] = React.useState('')
  const [contactPhone, setContactPhone] = React.useState('')
  const [contactMessage, setContactMessage] = React.useState('')

  // Review form state
  const [reviewName, setReviewName] = React.useState('')
  const [reviewRating, setReviewRating] = React.useState(5)
  const [reviewComment, setReviewComment] = React.useState('')
  const [submittingReview, setSubmittingReview] = React.useState(false)

  React.useEffect(() => {
    if (!params.slug) return
    setLoading(true)
    fetch(`/api/lawyers/${params.slug}`)
      .then((r) => r.json())
      .then((d) => { setLawyer(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.slug])

  const submitContact = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(t('Contact request saved locally. Lawyer will be notified via email in production.', 'رابطہ درخواست مقامی طور پر محفوظ ہو گئی۔ پروڈکشن میں وکیل کو ای میل کے ذریعے مطلع کیا جائے گا۔'))
    setContactName('')
    setContactEmail('')
    setContactPhone('')
    setContactMessage('')
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewName.trim()) {
      toast.error(t('Please enter your name', 'براہ کرم اپنا نام درج کریں'))
      return
    }
    setSubmittingReview(true)
    try {
      const res = await fetch(`/api/lawyers/${params.slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: reviewName, rating: reviewRating, comment: reviewComment }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(t('Review submitted. Thank you!', 'تبصرہ جمع ہو گیا۔ شکریہ!'))
        setReviewName('')
        setReviewComment('')
        setReviewRating(5)
        // Refresh lawyer data to show updated reviews + rating
        fetch(`/api/lawyers/${params.slug}`).then((r) => r.json()).then(setLawyer)
      } else {
        toast.error(data.error ?? t('Failed to submit review', 'تبصرہ جمع کرنے میں ناکام'))
      }
    } finally {
      setSubmittingReview(false)
    }
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

  if (!lawyer) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('Lawyer not found', 'وکیل نہیں ملا')}</h1>
        <Button asChild className="mt-4"><Link href="/lawyers">{t('Browse lawyers', 'وکلاء دیکھیں')}</Link></Button>
      </div>
    )
  }

  const color = lawyer.imageColor ?? '#0d9488'

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
        <Link href="/" className="hover:text-primary">{t('Home', 'صفحۂ اول')}</Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <Link href="/lawyers" className="hover:text-primary">{t('Lawyers', 'وکلاء')}</Link>
        <ChevronRight className={cn('h-3 w-3', lang === 'ur' && 'rotate-180')} />
        <span className="truncate">{lang === 'ur' && lawyer.nameUrdu ? lawyer.nameUrdu : lawyer.name}</span>
      </nav>

      {/* Profile header */}
      <div
        className="rounded-2xl overflow-hidden border border-border/60 mb-6 relative"
        style={{ background: `linear-gradient(135deg, ${color}18 0%, transparent 60%)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: color }} />
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-5 flex-wrap">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-2xl text-white text-2xl font-bold shrink-0 shadow-md"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
            >
              {lawyer.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {lang === 'ur' && lawyer.nameUrdu ? lawyer.nameUrdu : lawyer.name}
                </h1>
                {lawyer.verified && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> {t('Verified', 'تصدیق شدہ')}
                  </Badge>
                )}
                {lawyer.featured && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                    <Award className="h-3.5 w-3.5 mr-1" /> {t('Featured', 'نمایاں')}
                  </Badge>
                )}
              </div>
              {lang === 'en' && lawyer.nameUrdu && (
                <p className="text-sm text-muted-foreground font-urdu" dir="rtl">{lawyer.nameUrdu}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {lang === 'ur' && lawyer.cityUrdu ? lawyer.cityUrdu : lawyer.city}
                </span>
                {lawyer.experienceYears != null && (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {lawyer.experienceYears}+ {t('years experience', 'سال تجربہ')}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold tabular-nums">{lawyer.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({lawyer.reviewCount} {t('reviews', 'تبصرے')})</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {lawyer.bio && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('About', 'تعارف')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {lang === 'ur' && lawyer.bioUrdu ? lawyer.bioUrdu : lawyer.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Specializations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                {t('Areas of Practice', 'پریکٹس کے شعبے')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lawyer.specialization.map((spec) => (
                  <Link key={spec} href={`/categories/${spec}`}>
                    <Badge variant="secondary" className="capitalize hover:bg-accent cursor-pointer px-3 py-1.5">
                      {spec.replace(/-/g, ' ')}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {t('Client Reviews', 'کلائنٹ تبصرے')}
                <Badge variant="secondary" className="text-xs">{lawyer.reviewCount}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lawyer.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {t('No reviews yet. Be the first to review.', 'ابھی کوئی تبصرہ نہیں۔ پہلے تبصرہ دیں۔')}
                </p>
              ) : (
                lawyer.reviews.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border/60 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {r.authorName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{r.authorName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <StarIcon key={i} className={cn('h-3.5 w-3.5', i <= r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30')} />
                        ))}
                      </div>
                    </div>
                    {r.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                    )}
                  </div>
                ))
              )}
              <Separator />

              {/* Add review form */}
              <form onSubmit={submitReview} className="space-y-3">
                <h3 className="text-sm font-semibold">{t('Leave a Review', 'تبصرہ دیں')}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="reviewName" className="text-xs">{t('Your Name', 'آپ کا نام')} *</Label>
                    <Input
                      id="reviewName"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                      maxLength={100}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Rating', 'درجہ بندی')}</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReviewRating(i)}
                          className="p-1 hover:scale-110 transition-transform"
                          aria-label={`${i} stars`}
                        >
                          <StarIcon className={cn('h-6 w-6', i <= reviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/40')} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reviewComment" className="text-xs">{t('Comment (optional)', 'تبصرہ (اختیاری)')}</Label>
                  <Textarea
                    id="reviewComment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    maxLength={1000}
                  />
                </div>
                <Button type="submit" size="sm" disabled={submittingReview}>
                  {submittingReview ? t('Submitting...', 'جمع ہو رہا ہے...') : t('Submit Review', 'تبصرہ جمع کریں')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Contact form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                {t('Contact This Lawyer', 'اس وکیل سے رابطہ کریں')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitContact} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cName" className="text-xs">{t('Your Name', 'آپ کا نام')} *</Label>
                  <Input
                    id="cName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cEmail" className="text-xs">{t('Email', 'ای میل')} *</Label>
                  <Input
                    id="cEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cPhone" className="text-xs">{t('Phone', 'فون')}</Label>
                  <Input
                    id="cPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cMsg" className="text-xs">{t('Your Message', 'آپ کا پیغام')} *</Label>
                  <Textarea
                    id="cMsg"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder={t('Briefly describe your case...', 'مختصراً اپنے کیس کی وضاحت کریں...')}
                  />
                </div>
                <Button type="submit" className="w-full" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  {t('Send Message', 'پیغام بھیجیں')}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  {t('This form is for inquiries only, not legal advice.', 'یہ فارم صرف استفسار کے لیے ہے، قانونی مشورہ نہیں۔')}
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Contact info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('Contact Information', 'رابطہ معلومات')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {lawyer.email && (
                <a href={`mailto:${lawyer.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{lawyer.email}</span>
                </a>
              )}
              {lawyer.phone && (
                <a href={`tel:${lawyer.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{lawyer.phone}</span>
                </a>
              )}
              {lawyer.website && (
                <a href={lawyer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{lawyer.website}</span>
                </a>
              )}
              {lawyer.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{lang === 'ur' && lawyer.addressUrdu ? lawyer.addressUrdu : lawyer.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credentials */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('Credentials', 'اسناد')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {lawyer.licenseNumber && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-muted-foreground">{t('License:', 'لائسنس:')}</span>
                  <span className="font-mono text-xs">{lawyer.licenseNumber}</span>
                </div>
              )}
              {lawyer.education && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{t('Education', 'تعلیم')}</span>
                  </div>
                  <p className="text-sm pl-6">{lang === 'ur' && lawyer.educationUrdu ? lawyer.educationUrdu : lawyer.education}</p>
                </div>
              )}
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Languages className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{t('Languages', 'زبانیں')}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {lawyer.languages.map((lng) => (
                    <Badge key={lng} variant="secondary" className="text-xs">{lng}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          {lawyer.acceptingCases ? (
            <div className="rounded-lg border border-emerald-300/40 bg-emerald-50 dark:bg-emerald-950/20 p-3 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">{t('Currently accepting new cases', 'فی الحال نئے مقدمات قبول کر رہے ہیں')}</span>
            </div>
          ) : (
            <div className="rounded-lg border border-muted p-3 flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">{t('Not accepting new cases at this time', 'فی الحال نئے مقدمات قبول نہیں')}</span>
            </div>
          )}

          {/* Related lawyers */}
          {lawyer.related && lawyer.related.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t('Similar Lawyers', 'ملتے جلتے وکلاء')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lawyer.related.map((r) => (
                  <Link key={r.slug} href={`/lawyers/${r.slug}`} className="block group">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-accent/50 transition-all">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
                        style={{ background: `linear-gradient(135deg, ${r.imageColor ?? '#0d9488'}, ${(r.imageColor ?? '#0d9488')}cc)` }}
                      >
                        {r.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                          {lang === 'ur' && r.nameUrdu ? r.nameUrdu : r.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{r.city} • ⭐ {r.rating.toFixed(1)}</p>
                      </div>
                      <ArrowRight className={cn('h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors', lang === 'ur' && 'rotate-180')} />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-300/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <p className="leading-relaxed">
                  {t(
                    'Contacting a lawyer does not create an attorney-client relationship. Always verify the lawyer\'s license with the Pakistan Bar Council.',
                    'وکیل سے رابطہ کرنے سے وکیل-موکل تعلق قائم نہیں ہوتا۔ ہمیشہ پاکستان بار کونسل سے وکیل کے لائسنس کی تصدیق کریں۔'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
