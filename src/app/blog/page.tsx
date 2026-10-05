'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BookOpen, Search, Clock, ArrowRight, Tag,
  Calendar, ChevronRight, User, ShieldCheck, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/language-provider'

interface BlogPostItem {
  id: string
  slug: string
  title: string
  titleUrdu: string
  category: string
  categoryUrdu: string
  readTime: string
  author: string
  authorUrdu?: string
  date: string
  summary: string
  summaryUrdu: string
  tags?: string[] | string
}

export default function BlogListingPage() {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [posts, setPosts] = React.useState<BlogPostItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory)
    }
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim())
    }
    fetch(`/api/blog?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.items || [])
      })
      .catch((err) => console.error('Failed to load blog posts:', err))
      .finally(() => setLoading(false))
  }, [selectedCategory, searchQuery])

  const categories = React.useMemo(() => {
    const defaultCategories = ['Criminal Law', 'Banking & Criminal Law', 'Family Law', 'Cyber & IT Law', 'Property Law']
    const set = new Set<string>(defaultCategories)
    posts.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  }, [posts])

  const filteredPosts = posts

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t('Home', 'ہوم')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{t('Legal Guides & Blog', 'قانونی رہنمائی و مضامین')}</span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-emerald-500/5 p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{t('Plain Language Pakistani Legal Insights', 'آسان زبان میں قانونی رہنمائی')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t('Pakistan Legal Guides & Case Walkthroughs', 'پاکستان قانونی گائیڈز اور تفصیلی مضامین')}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'Practical, easy-to-understand explanations of common legal challenges in Pakistan: police FIR procedure, bouncing cheques, matrimonial disputes, cyber crime complaints, property verification, and bail rules.',
                'پاکستان کے عام قانونی مسائل کا سادہ زبان میں حل: تھانے میں ایف آئی آر، چیک باؤنس کے مقدمات، طلاق و خلع، ایف آئی اے سائبر کرائم، پراپرٹی کی تصدیق اور ضمانت کے اصول۔'
              )}
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'bg-muted hover:bg-accent text-muted-foreground'
              }`}
            >
              {t('All Topics', 'تمام مضامین')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-muted hover:bg-accent text-muted-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('Search articles...', 'مضامین تلاش کریں...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-9 bg-background"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 border rounded-xl bg-card space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card/50">
            <p className="text-sm text-muted-foreground">{t('No articles found matching your criteria.', 'آپ کے مطلوبہ معیار کے مطابق کوئی مضمون نہیں ملا۔')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
            <Card key={post.slug} className="border-border/70 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between group bg-card">
              <CardHeader className="p-3.5 sm:p-4 pb-1.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium bg-primary/10 text-primary border-primary/20">
                    {isUrdu ? post.categoryUrdu : post.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <CardTitle className="text-sm sm:text-[15px] font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {isUrdu ? post.titleUrdu : post.title}
                  </CardTitle>
                </Link>
              </CardHeader>

              <CardContent className="p-3.5 sm:p-4 pt-0 space-y-2.5 flex flex-col justify-between flex-1">
                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                  {isUrdu ? post.summaryUrdu : post.summary}
                </p>

                <div className="space-y-2 pt-1.5 border-t border-border/50">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="block">
                    <Button variant="outline" size="sm" className="w-full h-7 text-[11px] py-0 gap-1 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                      <span>{t('Read Complete Guide', 'مکمل گائیڈ پڑھیں')}</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
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
