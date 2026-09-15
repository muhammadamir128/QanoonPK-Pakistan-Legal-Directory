'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Search, Languages, Sun, Moon, Menu, Scale, BookText, Compass, LayoutDashboard, X,
  Bot, Landmark, BookOpen, ChevronDown, Briefcase, FilePlus, HelpCircle, Code, GitCompare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/components/language-provider'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { KeyboardShortcutsHelp } from '@/components/keyboard-shortcuts-help'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', labelEn: 'Home', labelUr: 'صفحۂ اول' },
  { href: '/laws', labelEn: 'Laws', labelUr: 'قوانین' },
  { href: '/categories', labelEn: 'Categories', labelUr: 'اقسام' },
  { href: '/finder', labelEn: 'Which Law Applies?', labelUr: 'کون سا قانون؟' },
  { href: '/lawyers', labelEn: 'Lawyers', labelUr: 'وکلاء' },
  { href: '/templates', labelEn: 'Templates', labelUr: 'ٹیمپلیٹس' },
  { href: '/compare', labelEn: 'Compare', labelUr: 'موازنہ' },
]

const toolsItems = [
  { href: '/chat', labelEn: 'AI Assistant', labelUr: 'اے آئی اسسٹنٹ', icon: 'Bot' },
  { href: '/faq', labelEn: 'FAQ / Help', labelUr: 'سوالات و مدد', icon: 'HelpCircle' },
  { href: '/courts', labelEn: 'Court Hierarchy', labelUr: 'عدالتی درجہ بندی', icon: 'Landmark' },
  { href: '/glossary', labelEn: 'Glossary', labelUr: 'فرہنگ', icon: 'BookOpen' },
  { href: '/help', labelEn: 'API Docs', labelUr: 'اے پی آئی دستاویز', icon: 'Code' },
]

const navItemsWithAdmin = [
  ...navItems,
  { href: '/admin', labelEn: 'Admin', labelUr: 'ایڈمن' },
]

export function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const { lang, toggle, t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  React.useEffect(() => setMounted(true), [])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) {
      router.push(`/laws?q=${encodeURIComponent(q.trim())}`)
      setOpen(false)
    }
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <Scale className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base tracking-tight">
                {t('QanoonPK', 'قانون پی کے')}
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                {t('Pakistan Legal Directory', 'پاکستان قانونی ڈائریکٹری')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive(item.href) ? 'bg-accent text-accent-foreground' : 'text-foreground/80'
                )}
              >
                {t(item.labelEn, item.labelUr)}
              </Link>
            ))}
            {/* Tools dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-1',
                    ['/chat', '/courts', '/glossary'].some((p) => isActive(p)) ? 'bg-accent text-accent-foreground' : 'text-foreground/80'
                  )}
                >
                  {t('Tools', 'اوزار')}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {t('Interactive Tools', 'انٹرایکٹو اوزار')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {toolsItems.map((item) => {
                  const Icon = iconForTool(item.icon)
                  return (
                    <DropdownMenuItem asChild key={item.href}>
                      <Link href={item.href} className="flex items-center gap-3 cursor-pointer">
                        <Icon className="h-4 w-4 text-primary" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{t(item.labelEn, item.labelUr)}</span>
                          <span className="text-[10px] text-muted-foreground">{
                            item.labelEn === 'AI Assistant' ? (lang === 'ur' ? 'قانونی سوالات پوچھیں' : 'Ask legal questions')
                            : item.labelEn === 'FAQ / Help' ? (lang === 'ur' ? 'عام سوالات' : 'Common questions')
                            : item.labelEn === 'Court Hierarchy' ? (lang === 'ur' ? 'عدالتی نظام' : 'Court system')
                            : item.labelEn === 'API Docs' ? (lang === 'ur' ? 'ڈویلپرز کے لیے' : 'For developers')
                            : (lang === 'ur' ? 'قانونی اصطلاحات' : 'Legal terms')
                          }</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/admin"
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive('/admin') ? 'bg-accent text-accent-foreground' : 'text-foreground/80'
              )}
            >
              {t('Admin', 'ایڈمن')}
            </Link>
          </nav>

          {/* Search (desktop) */}
          <form onSubmit={onSearch} className="hidden md:flex relative items-center max-w-xs flex-1">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={t('Search laws, sections, keywords...', 'قوانین تلاش کریں...')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 h-9 bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggle}
              aria-label="Toggle language"
              title={lang === 'en' ? 'اردو' : 'English'}
            >
              <Languages className="h-4 w-4" />
              <span className="ml-1 text-[10px] font-bold">{lang === 'en' ? 'UR' : 'EN'}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={lang === 'ur' ? 'right' : 'left'} className="w-[280px] p-0">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="flex h-16 items-center justify-between border-b px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Scale className="h-4 w-4" />
                    </div>
                    <span className="font-bold">{t('QanoonPK', 'قانون پی کے')}</span>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
                <div className="p-4 space-y-3">
                  <form onSubmit={onSearch} className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('Search laws...', 'قوانین تلاش کریں...')}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="pl-9 h-10"
                    />
                  </form>
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                      const Icon = iconFor(item.href)
                      return (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                              isActive(item.href) ? 'bg-accent text-accent-foreground' : ''
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {t(item.labelEn, item.labelUr)}
                          </Link>
                        </SheetClose>
                      )
                    })}
                    <div className="pt-2 mt-2 border-t border-border/40">
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground px-3 mb-1 font-semibold">
                        {t('Tools', 'اوزار')}
                      </div>
                      {toolsItems.map((item) => {
                        const Icon = iconForTool(item.icon)
                        return (
                          <SheetClose asChild key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                                isActive(item.href) ? 'bg-accent text-accent-foreground' : ''
                              )}
                            >
                              <Icon className="h-4 w-4 text-primary" />
                              {t(item.labelEn, item.labelUr)}
                            </Link>
                          </SheetClose>
                        )
                      })}
                    </div>
                    <div className="pt-2 mt-2 border-t border-border/40">
                      <SheetClose asChild>
                        <Link
                          href="/admin"
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                            isActive('/admin') ? 'bg-accent text-accent-foreground' : ''
                          )}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          {t('Admin', 'ایڈمن')}
                        </Link>
                      </SheetClose>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
      <KeyboardShortcutsHelp />
    </>
  )
}

function iconFor(href: string) {
  switch (href) {
    case '/laws': return BookText
    case '/categories': return LayoutDashboard
    case '/finder': return Compass
    case '/lawyers': return Briefcase
    case '/templates': return FilePlus
    case '/compare': return GitCompare
    case '/admin': return LayoutDashboard
    default: return Scale
  }
}

function iconForTool(name: string) {
  switch (name) {
    case 'Bot': return Bot
    case 'Landmark': return Landmark
    case 'BookOpen': return BookOpen
    case 'HelpCircle': return HelpCircle
    case 'Code': return Code
    default: return Scale
  }
}
