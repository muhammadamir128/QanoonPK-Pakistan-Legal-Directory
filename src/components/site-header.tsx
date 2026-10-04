'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Search, Languages, Sun, Moon, Menu, Scale, BookText, Compass, LayoutDashboard,
  Bot, Landmark, BookOpen, ChevronDown, Briefcase, FilePlus, HelpCircle, GitCompare, Check,
  LogIn, UserPlus, LogOut, Bookmark, User, Info, ShieldCheck, ShieldAlert, GraduationCap,
  Calculator, HeartHandshake, BookmarkCheck, FileText, BellRing, PhoneCall,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/components/language-provider'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { KeyboardShortcutsHelp } from '@/components/keyboard-shortcuts-help'
import { SearchModal } from '@/components/search-modal'
import { SignOutModal } from '@/components/sign-out-modal'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/laws', labelEn: 'Laws', labelUr: 'قوانین' },
  { href: '/categories', labelEn: 'Categories', labelUr: 'اقسام' },
  { href: '/calculators', labelEn: 'Calculators', labelUr: 'کیلکولیٹرز' },
  { href: '/courts', labelEn: 'Courts', labelUr: 'عدالتیں' },
  { href: '/lawyers', labelEn: 'Lawyers', labelUr: 'وکلاء' },
  { href: '/templates', labelEn: 'Templates', labelUr: 'ٹیمپلیٹس' },
  { href: '/compare', labelEn: 'Compare', labelUr: 'موازنہ' },
  { href: '/about', labelEn: 'About', labelUr: 'تعارف' },
]

const toolsItems = [
  { href: '/calculators', labelEn: 'Legal Calculators', labelUr: 'قانونی کیلکولیٹرز', icon: 'Calculator', descEn: 'Property Stamp Duty, Inheritance & Court Fee', descUr: 'سٹامپ ڈیوٹی، وراثت و کورٹ فیس' },
  { href: '/legal-aid', labelEn: 'Legal Aid & Helplines', labelUr: 'قانونی امداد و ہیلپ لائنز', icon: 'HeartHandshake', descEn: '24/7 Emergency helplines & free legal aid', descUr: '24 گھنٹے ہنگامی ہیلپ لائنز اور مفت وکیل' },
  { href: '/bookmarks', labelEn: 'Saved Laws', labelUr: 'محفوظ قوانین', icon: 'BookmarkCheck', descEn: 'Your bookmarked statutes and sections', descUr: 'آپ کے محفوظ کردہ قوانین' },
  { href: '/blog', labelEn: 'Legal Guides & Blog', labelUr: 'قانونی رہنمائی و بلاگ', icon: 'FileText', descEn: 'FIR, Cheque Bounce, Khula, Cyber Crime', descUr: 'ایف آئی آر، چیک باؤنس، خلع اور سائبر کرائم' },
  { href: '/case-tracker', labelEn: 'Case Tracker & Causelists', labelUr: 'کیس ٹریکر و کاز لسٹ', icon: 'Landmark', descEn: 'Supreme Court & High Courts status', descUr: 'سپریم کورٹ اور ہائی کورٹس کے پورٹلز' },
  { href: '/updates', labelEn: 'Gazette & Legal Updates', labelUr: 'گزٹ الرٹس و نئی ترامیم', icon: 'BellRing', descEn: 'Recently enacted Acts & Amendments', descUr: 'تازہ ترین منظور شدہ قوانین اور ترامیم' },
  { href: '/guides/student-protection', labelEn: 'Student Protection Guide', labelUr: 'طلبہ کے تحفظ کی رہنمائی', icon: 'GraduationCap', descEn: 'Student rights, HEC policies & complaints', descUr: 'طلبہ کے حقوق، HEC پالیسیاں اور شکایات' },
  { href: '/guides/girls-protection', labelEn: 'Girls Protection Guide', labelUr: 'بچیوں کے تحفظ کے قوانین', icon: 'ShieldCheck', descEn: '16 laws, rights & emergency helplines', descUr: '16 قوانین، حقوق اور ہنگامی ہیلپ لائنز' },
  { href: '/guides/self-defence', labelEn: 'Self-Defence Guide', labelUr: 'سیلف ڈیفنس (حقِ دفاع)', icon: 'ShieldAlert', descEn: 'PPC 96-106 & lethal force rules', descUr: 'پی پی سی 96 تا 106 اور شرائط' },
  { href: '/finder', labelEn: 'Which Law Applies?', labelUr: 'کون سا قانون؟', icon: 'Compass', descEn: 'Find applicable law', descUr: 'مسئلے کا متعلقہ قانون' },
  { href: '/courts', labelEn: 'Court Hierarchy', labelUr: 'عدالتی درجہ بندی', icon: 'Landmark', descEn: 'Court system & hierarchy', descUr: 'عدالتی نظام و درجہ بندی' },
  { href: '/glossary', labelEn: 'Legal Glossary', labelUr: 'قانونی فرہنگ', icon: 'BookOpen', descEn: 'Pakistani legal terms explained', descUr: 'اہم قانونی اصطلاحات کا مفہوم' },
  { href: '/faq', labelEn: 'FAQ & Help', labelUr: 'سوالات و مدد', icon: 'HelpCircle', descEn: 'Frequently asked questions', descUr: 'عام سوالات و رہنمائی' },
  { href: '/about', labelEn: 'About QanoonPK', labelUr: 'ہمارے متعلق', icon: 'Info', descEn: 'Directory methodology & sources', descUr: 'ڈائریکٹری کا طریقہ کار' },
]


export function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [searchModalOpen, setSearchModalOpen] = React.useState(false)
  const [signOutModalOpen, setSignOutModalOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  React.useEffect(() => setMounted(true), [])

  // Listen to search modal shortcut trigger
  React.useEffect(() => {
    const handleOpenSearch = () => setSearchModalOpen(true)
    window.addEventListener('qpk-open-search', handleOpenSearch)
    return () => window.removeEventListener('qpk-open-search', handleOpenSearch)
  }, [])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) {
      router.push(`/laws?q=${encodeURIComponent(q.trim())}`)
      setOpen(false)
    }
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isExcludedPage = pathname === '/login' || pathname === '/register' || pathname?.startsWith('/auth') || pathname?.startsWith('/admin')
  if (isExcludedPage) return null

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="container mx-auto max-w-[1440px] px-2.5 sm:px-6">
          <div className="flex h-16 items-center justify-between lg:justify-center gap-1.5 sm:gap-2 xl:gap-3">
            {/* Left: Logo & Nav & Search */}
            <div className="flex items-center gap-2 xl:gap-3 shrink-0">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0 group">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                  <Scale className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-sm sm:text-base tracking-tight">
                    {t('QanoonPK', 'قانون پی کے')}
                  </span>
                  <span className="text-[10px] text-muted-foreground hidden sm:block">
                    {t('Pakistan Legal Directory', 'پاکستان قانونی ڈائریکٹری')}
                  </span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'rounded-md px-1.5 xl:px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground whitespace-nowrap shrink-0 inline-flex items-center',
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground font-semibold'
                        : 'text-foreground/80'
                    )}
                  >
                    <span>{t(item.labelEn, item.labelUr)}</span>
                  </Link>
                ))}
                {/* Tools dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'rounded-md px-1.5 xl:px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer',
                        toolsItems.some((item) => isActive(item.href)) ? 'bg-accent text-accent-foreground font-semibold' : 'text-foreground/80'
                      )}
                    >
                      {t('Tools', 'اوزار')}
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[min(32rem,calc(100vw-2rem))] max-h-[min(70vh,30rem)] overflow-y-auto overscroll-contain dropdown-scrollbar p-2.5 shadow-xl border-border/80 rounded-xl">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {t('Interactive Tools', 'انٹرایکٹو اوزار')}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="grid grid-cols-2 gap-1">
                    {toolsItems.map((item) => {
                      const Icon = iconForTool(item.icon)
                      return (
                          <DropdownMenuItem
                            asChild
                            key={item.href}
                            className={cn(
                              'h-auto min-h-14 items-start gap-3 whitespace-normal rounded-md px-2.5 py-2.5',
                              isActive(item.href) && 'bg-accent text-accent-foreground'
                            )}
                          >
                            <Link
                              href={item.href}
                              aria-current={isActive(item.href) ? 'page' : undefined}
                              className="flex w-full cursor-pointer items-start gap-3"
                            >
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="flex min-w-0 flex-col gap-0.5">
                              <span className="text-sm font-medium leading-tight">{t(item.labelEn, item.labelUr)}</span>
                              <span className="text-[10px] leading-snug text-muted-foreground">{lang === 'ur' ? item.descUr : item.descEn}</span>
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>

              {/* Search Trigger Button (normal box with just search icon) */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setSearchModalOpen(true)}
                className="hidden md:flex h-9 w-9 rounded-lg border-border/70 bg-background/60 hover:bg-accent hover:text-accent-foreground font-normal transition-colors shrink-0 shadow-xs cursor-pointer"
                aria-label={t('Search laws', 'قوانین تلاش کریں')}
                title={t('Search laws (Press / or Ctrl+K)', 'قوانین تلاش کریں (/ یا Ctrl+K دبائیں)')}
              >
                <Search className="h-4 w-4 text-foreground/80" />
              </Button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Mobile Search button */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setSearchModalOpen(true)}
                className="md:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-lg border-border/70 bg-background/60 hover:bg-accent hover:text-accent-foreground font-normal transition-colors shrink-0 shadow-xs cursor-pointer"
                aria-label={t('Search laws', 'قوانین تلاش کریں')}
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground/80" />
              </Button>
              {/* Language Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-2.5 sm:gap-1.5 border-border/70 bg-background/60 hover:bg-accent hover:text-accent-foreground font-normal transition-colors shrink-0 justify-center"
                    aria-label="Select Language"
                  >
                    <Languages className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                    <span className="text-xs font-medium hidden sm:inline">
                      {lang === 'en' ? 'English' : 'اردو'}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0 hidden sm:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={lang === 'ur' ? 'start' : 'end'} className="w-36 p-1 shadow-md">
                  <DropdownMenuItem
                    onClick={() => setLang('en')}
                    className={cn(
                      'flex items-center justify-between cursor-pointer rounded-md px-2.5 py-2 text-xs font-medium',
                      lang === 'en' ? 'bg-primary/10 text-primary font-semibold' : ''
                    )}
                  >
                    <span>English</span>
                    {lang === 'en' && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLang('ur')}
                    className={cn(
                      'flex items-center justify-between cursor-pointer rounded-md px-2.5 py-2 text-xs font-medium font-urdu',
                      lang === 'ur' ? 'bg-primary/10 text-primary font-semibold' : ''
                    )}
                  >
                    <span>اردو (Urdu)</span>
                    {lang === 'ur' && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {mounted && theme === 'dark' ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              </Button>

              {/* Auth Buttons / User Avatar */}
              {status === 'loading' ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 rounded-full pl-1.5 pr-2 gap-2 border border-border/70 hover:bg-accent focus-visible:ring-1 focus-visible:ring-primary shrink-0"
                    >
                      <Avatar className="h-7 w-7 border border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium max-w-[90px] truncate hidden md:inline">
                        {session.user.name || 'Account'}
                      </span>
                      <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={lang === 'ur' ? 'start' : 'end'} className="w-56 p-1.5 shadow-lg">
                    <div className="px-2.5 py-2 border-b border-border/50 mb-1">
                      <p className="text-xs font-semibold text-foreground truncate">{session.user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
                      {(session.user as any)?.role && (
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-wider">
                          {(session.user as any).role}
                        </span>
                      )}
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/bookmarks" className="cursor-pointer text-xs py-2 gap-2 rounded-md">
                        <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                        <span>{t('Saved Laws', 'محفوظ قوانین')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/calculators" className="cursor-pointer text-xs py-2 gap-2 rounded-md">
                        <Calculator className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{t('Legal Calculators', 'قانونی کیلکولیٹرز')}</span>
                      </Link>
                    </DropdownMenuItem>
                    {(session.user as any)?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer text-xs py-2 gap-2 rounded-md">
                          <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{t('Admin Portal', 'ایڈمن پورٹل')}</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setSignOutModalOpen(true)
                      }}
                      className="cursor-pointer text-xs py-2 gap-2 rounded-md text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{t('Sign Out', 'لاگ آؤٹ')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-9 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hidden sm:inline-flex"
                  >
                    <Link href="/login">
                      <LogIn className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {t('Sign In', 'لاگ ان')}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="h-9 px-3 text-xs font-medium shadow-sm hidden sm:inline-flex"
                  >
                    <Link href="/register">
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      {t('Register', 'رجسٹر')}
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile menu */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 lg:hidden shrink-0" aria-label="Menu">
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={lang === 'ur' ? 'right' : 'left'} className="w-[280px] overflow-hidden p-0">
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <div className="flex h-16 items-center justify-between border-b px-4">
                    <SheetClose asChild>
                      <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          <Scale className="h-4 w-4" />
                        </div>
                        <span className="font-bold">{t('QanoonPK', 'قانون پی کے')}</span>
                      </Link>
                    </SheetClose>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin] p-4 space-y-3">
                    {/* Mobile search trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        setSearchModalOpen(true)
                      }}
                      className="w-full relative flex items-center h-10 px-3 rounded-lg border border-border/70 bg-muted/40 text-muted-foreground hover:text-foreground text-xs transition-colors text-left cursor-pointer"
                    >
                      <Search className="h-4 w-4 mr-2.5 text-primary shrink-0" />
                      <span>{t('Search laws...', 'قوانین تلاش کریں...')}</span>
                    </button>
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
                        {toolsItems
                          .filter((item) => !navItems.some((n) => n.href === item.href))
                          .map((item) => {
                            const Icon = iconForTool(item.icon)
                            return (
                              <SheetClose asChild key={item.href}>
                                <Link href={item.href} className={cn(
                                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                                  isActive(item.href) ? 'bg-accent text-accent-foreground' : ''
                                )}>
                                  <Icon className="h-4 w-4 text-primary" />
                                  {t(item.labelEn, item.labelUr)}
                                </Link>
                              </SheetClose>
                            )
                          })}
                      </div>
                      {(session?.user as any)?.role === 'admin' && (
                        <div className="pt-2 mt-2 border-t border-border/40">
                          <SheetClose asChild>
                            <Link href="/admin" className={cn(
                              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                              isActive('/admin') ? 'bg-accent text-accent-foreground' : ''
                            )}>
                              <LayoutDashboard className="h-4 w-4" />
                              {t('Admin Portal', 'ایڈمن پورٹل')}
                            </Link>
                          </SheetClose>
                        </div>
                      )}

                      {/* Mobile Language Selector */}
                      <div className="pt-3 mt-2 border-t border-border/40">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground px-3 mb-2 font-semibold">
                          {t('Language', 'زبان منتخب کریں')}
                        </div>
                        <div className="grid grid-cols-2 gap-2 px-1">
                          <Button
                            variant={lang === 'en' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setLang('en')}
                            className="text-xs h-8 justify-center gap-1"
                          >
                            {lang === 'en' && <Check className="h-3.5 w-3.5" />}
                            English
                          </Button>
                          <Button
                            variant={lang === 'ur' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setLang('ur')}
                            className="text-xs h-8 justify-center gap-1 font-urdu"
                          >
                            {lang === 'ur' && <Check className="h-3.5 w-3.5" />}
                            اردو
                          </Button>
                        </div>
                      </div>

                      {/* Mobile Auth Section */}
                      <div className="pt-3 mt-2 border-t border-border/40">
                        {session?.user ? (
                          <div className="space-y-2 px-1">
                            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/60 border border-border/50">
                              <Avatar className="h-8 w-8 border border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                  {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground truncate">{session.user.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setOpen(false)
                                setSignOutModalOpen(true)
                              }}
                              className="w-full text-xs h-8 text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                              {t('Sign Out', 'لاگ آؤٹ')}
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 px-1">
                            <SheetClose asChild>
                              <Button variant="outline" size="sm" asChild className="text-xs h-8">
                                <Link href="/login">{t('Sign In', 'لاگ ان')}</Link>
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button size="sm" asChild className="text-xs h-8">
                                <Link href="/register">{t('Register', 'رجسٹر')}</Link>
                              </Button>
                            </SheetClose>
                          </div>
                        )}
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
      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
      <SignOutModal open={signOutModalOpen} onOpenChange={setSignOutModalOpen} />
    </>
  )
}

function iconFor(href: string) {
  switch (href) {
    case '/calculators': return Calculator
    case '/legal-aid': return HeartHandshake
    case '/bookmarks': return BookmarkCheck
    case '/blog': return FileText
    case '/case-tracker': return Landmark
    case '/updates': return BellRing
    case '/guides/self-defence': return ShieldAlert
    case '/guides/girls-protection': return ShieldCheck
    case '/laws': return BookText
    case '/categories': return LayoutDashboard
    case '/courts': return Landmark
    case '/finder': return Compass
    case '/lawyers': return Briefcase
    case '/templates': return FilePlus
    case '/compare': return GitCompare
    case '/about': return Info
    case '/glossary': return BookOpen
    case '/faq': return HelpCircle
    case '/admin': return LayoutDashboard
    default: return Scale
  }
}

function iconForTool(name: string) {
  switch (name) {
    case 'Calculator': return Calculator
    case 'HeartHandshake': return HeartHandshake
    case 'BookmarkCheck': return BookmarkCheck
    case 'FileText': return FileText
    case 'BellRing': return BellRing
    case 'GraduationCap': return GraduationCap
    case 'ShieldAlert': return ShieldAlert
    case 'ShieldCheck': return ShieldCheck
    case 'Compass': return Compass
    case 'GitCompare': return GitCompare
    case 'Bot': return Bot
    case 'Landmark': return Landmark
    case 'BookOpen': return BookOpen
    case 'HelpCircle': return HelpCircle
    case 'Info': return Info
    default: return Scale
  }
}
