'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Landmark, Gavel, Building2, Scale, Search, ExternalLink,
  ShieldCheck, MapPin, ChevronRight, Layers, ArrowUpRight,
  Filter, CheckCircle2, Shield, Info,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'

export type AdminCourt = {
  id: string
  name: string
  nameUrdu: string
  tier: 'apex' | 'constitutional' | 'trial' | 'special'
  tierLabel: string
  tierLabelUrdu: string
  jurisdiction: string
  jurisdictionUrdu: string
  principalSeat: string
  principalSeatUrdu: string
  benches: string
  governingLaw: string
  totalJudges?: string
  status: 'Active' | 'Under Reform'
}

const COURTS_DATA: AdminCourt[] = [
  {
    id: 'supreme-court',
    name: 'Supreme Court of Pakistan',
    nameUrdu: 'سپریم کورٹ آف پاکستان',
    tier: 'apex',
    tierLabel: 'Apex Court',
    tierLabelUrdu: 'اعلیٰ ترین عدالت',
    jurisdiction: 'Federal / Entire Pakistan (Art. 184, 185, 186)',
    jurisdictionUrdu: 'پورے پاکستان پر محیط وفاقی دائرہ اختیار',
    principalSeat: 'Constitution Avenue, Islamabad',
    principalSeatUrdu: 'شاہراہ دستور، اسلام آباد',
    benches: 'Branch Registries: Lahore, Karachi, Peshawar, Quetta',
    governingLaw: 'Constitution of Pakistan 1973 (Part VII, Ch 2)',
    totalJudges: 'Chief Justice + 16 Judges',
    status: 'Active',
  },
  {
    id: 'federal-shariat',
    name: 'Federal Shariat Court of Pakistan',
    nameUrdu: 'وفاقی شرعی عدالت',
    tier: 'constitutional',
    tierLabel: 'Special Constitutional Court',
    tierLabelUrdu: 'خصوصی آئینی عدالت',
    jurisdiction: 'Islamic Injunctions & Hudood matters across Pakistan',
    jurisdictionUrdu: 'اسلامی احکامات اور حدود قوانین',
    principalSeat: 'Islamabad',
    principalSeatUrdu: 'اسلام آباد',
    benches: 'Branch benches in 4 provincial capitals',
    governingLaw: 'Constitution (Chapter 3A, Art. 203A-203J)',
    totalJudges: 'Chief Justice + 7 Judges (incl. Ulema)',
    status: 'Active',
  },
  {
    id: 'lahore-high-court',
    name: 'Lahore High Court (LHC)',
    nameUrdu: 'لاہور ہائی کورٹ',
    tier: 'constitutional',
    tierLabel: 'Provincial High Court',
    tierLabelUrdu: 'صوبائی ہائی کورٹ',
    jurisdiction: 'Punjab Province — Writ, Civil & Criminal Appeals',
    jurisdictionUrdu: 'پنجاب — رٹ، دیوانی اور فوجداری اپیلیں',
    principalSeat: 'The Mall, Lahore',
    principalSeatUrdu: 'مال روڈ، لاہور',
    benches: 'Benches: Rawalpindi, Multan, Bahawalpur',
    governingLaw: 'Constitution of Pakistan 1973 (Art. 192-203)',
    totalJudges: 'Chief Justice + 60 Judges sanctioned',
    status: 'Active',
  },
  {
    id: 'sindh-high-court',
    name: 'Sindh High Court (SHC)',
    nameUrdu: 'سندھ ہائی کورٹ',
    tier: 'constitutional',
    tierLabel: 'Provincial High Court',
    tierLabelUrdu: 'صوبائی ہائی کورٹ',
    jurisdiction: 'Sindh Province — Original & Appellate Jurisdiction',
    jurisdictionUrdu: 'سندھ — بنیادی اور اپیلتی دائرہ اختیار',
    principalSeat: 'Court Road, Karachi',
    principalSeatUrdu: 'کورٹ روڈ، کراچی',
    benches: 'Benches: Sukkur; Circuit Courts: Hyderabad, Larkana, Mirpurkhas',
    governingLaw: 'Constitution of Pakistan 1973 (Art. 192-203)',
    totalJudges: 'Chief Justice + 40 Judges sanctioned',
    status: 'Active',
  },
  {
    id: 'peshawar-high-court',
    name: 'Peshawar High Court (PHC)',
    nameUrdu: 'پشاور ہائی کورٹ',
    tier: 'constitutional',
    tierLabel: 'Provincial High Court',
    tierLabelUrdu: 'صوبائی ہائی کورٹ',
    jurisdiction: 'Khyber Pakhtunkhwa (incl. merged tribal districts)',
    jurisdictionUrdu: 'خیبر پختونخوا بشمول ضم شدہ اضلاع',
    principalSeat: 'Peshawar',
    principalSeatUrdu: 'پشاور',
    benches: 'Benches: Abbottabad, D.I. Khan, Mingora (Swat), Bannu',
    governingLaw: 'Constitution of Pakistan 1973 (Art. 192-203)',
    totalJudges: 'Chief Justice + 20 Judges sanctioned',
    status: 'Active',
  },
  {
    id: 'balochistan-high-court',
    name: 'Balochistan High Court (BHC)',
    nameUrdu: 'بلوچستان ہائی کورٹ',
    tier: 'constitutional',
    tierLabel: 'Provincial High Court',
    tierLabelUrdu: 'صوبائی ہائی کورٹ',
    jurisdiction: 'Balochistan Province',
    jurisdictionUrdu: 'صوبہ بلوچستان',
    principalSeat: 'Quetta',
    principalSeatUrdu: 'کوئٹہ',
    benches: 'Circuit Bench: Sibi, Turbat',
    governingLaw: 'Constitution of Pakistan 1973 (Art. 192-203)',
    totalJudges: 'Chief Justice + 15 Judges sanctioned',
    status: 'Active',
  },
  {
    id: 'islamabad-high-court',
    name: 'Islamabad High Court (IHC)',
    nameUrdu: 'اسلام آباد ہائی کورٹ',
    tier: 'constitutional',
    tierLabel: 'Federal Capital High Court',
    tierLabelUrdu: 'وفاقی دارالحکومت ہائی کورٹ',
    jurisdiction: 'Islamabad Capital Territory (ICT)',
    jurisdictionUrdu: 'وفاقی دارالحکومت اسلام آباد',
    principalSeat: 'G-5, Islamabad',
    principalSeatUrdu: 'جی فائیو، اسلام آباد',
    benches: 'Principal Seat (No Circuit Benches)',
    governingLaw: 'Islamabad High Court Act 2010',
    totalJudges: 'Chief Justice + 10 Judges sanctioned',
    status: 'Active',
  },
  {
    id: 'district-sessions-courts',
    name: 'District & Sessions Courts',
    nameUrdu: 'ضلعی و سیشن عدالتیں',
    tier: 'trial',
    tierLabel: 'Subordinate Trial Judiciary',
    tierLabelUrdu: 'ماتحت عدلیہ',
    jurisdiction: 'District Level Civil (Senior Civil Judge) & Criminal (Sessions Judge)',
    jurisdictionUrdu: 'ضلعی سطح پر دیوانی اور فوجداری مقدمات کی سماعت',
    principalSeat: 'All 150+ Districts across Pakistan',
    principalSeatUrdu: 'پاکستان کے تمام اضلاع',
    benches: 'Tehsil & District headquarters',
    governingLaw: 'Civil Courts Ordinance 1962 & CrPC 1898',
    totalJudges: '3,000+ Judicial Officers',
    status: 'Active',
  },
  {
    id: 'special-tribunals',
    name: 'Special Courts & Administrative Tribunals',
    nameUrdu: 'خصوصی عدالتیں اور ٹربیونلز',
    tier: 'special',
    tierLabel: 'Special Tribunals',
    tierLabelUrdu: 'خصوصی ٹربیونلز',
    jurisdiction: 'NAB, Anti-Terrorism (ATC), Banking, Labor, Cybercrime (PECA), Tax',
    jurisdictionUrdu: 'نیب، انسداد دہشتگردی، بینکنگ، لیبر اور سائبر کرائم',
    principalSeat: 'Major commercial & judicial hubs',
    principalSeatUrdu: 'اہم شہری و عدالتی مراکز',
    benches: 'Specialized divisional benches',
    governingLaw: 'Special enactments (ATA 1997, NAB Ord 1999, etc.)',
    totalJudges: 'Special Judges appointed by Federal/Prov Govt',
    status: 'Active',
  },
]

export function AdminCourtsTab() {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'
  const [search, setSearch] = React.useState('')
  const [selectedTier, setSelectedTier] = React.useState<string>('all')

  const filteredCourts = COURTS_DATA.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(search.toLowerCase()) ||
      court.nameUrdu.includes(search) ||
      court.jurisdiction.toLowerCase().includes(search.toLowerCase()) ||
      court.governingLaw.toLowerCase().includes(search.toLowerCase())
    const matchesTier = selectedTier === 'all' || court.tier === selectedTier
    return matchesSearch && matchesTier
  })

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent border border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] font-bold">
              {t('Judicial Hierarchy', 'عدالتی نظام')}
            </Badge>
            <span className="text-xs text-muted-foreground">{filteredCourts.length} {t('Courts Cataloged', 'عدالتیں درج ہیں')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            {t('Pakistan Courts & Judicial Hierarchy', 'پاکستانی عدالتوں کا درجہ وار نظام')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t(
              'Manage jurisdictional metadata, seats, benches, and statutory constitutional authorities.',
              'عدالتی حدود، نشستوں، برانچوں اور آئینی و قانونی احکامات کا انتظام کریں۔'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="h-9 gap-1.5 border-border/80">
            <Link href="/courts" target="_blank">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{t('View Public Page', 'عوامی صفحہ دیکھیں')}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('Search courts by name, jurisdiction, or statute...', 'عدالت کا نام، دائرہ اختیار یا قانون تلاش کریں...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'apex', 'constitutional', 'trial', 'special'] as const).map((tier) => (
            <Button
              key={tier}
              variant={selectedTier === tier ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTier(tier)}
              className="h-9 text-xs whitespace-nowrap capitalize rounded-lg"
            >
              {tier === 'all' && t('All Tiers', 'تمام درجات')}
              {tier === 'apex' && t('Apex Court', 'اعلیٰ ترین')}
              {tier === 'constitutional' && t('High Courts', 'ہائی کورٹس')}
              {tier === 'trial' && t('District Courts', 'ضلعی عدالتیں')}
              {tier === 'special' && t('Special Tribunals', 'خصوصی عدالتیں')}
            </Button>
          ))}
        </div>
      </div>

      {/* Courts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourts.map((court) => {
          const isApex = court.tier === 'apex'
          return (
            <Card key={court.id} className="border-border/80 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                    {isApex ? <Landmark className="h-5 w-5" /> : <Gavel className="h-5 w-5" />}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      isApex
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-primary/10 text-primary border-primary/30'
                    }`}
                  >
                    {isUrdu ? court.tierLabelUrdu : court.tierLabel}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-foreground mt-2 leading-snug">
                  {isUrdu ? court.nameUrdu : court.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {isUrdu ? court.jurisdictionUrdu : court.jurisdiction}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs pt-0">
                <div className="p-2.5 rounded-lg bg-muted/40 space-y-1.5 border border-border/50">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate">{isUrdu ? court.principalSeatUrdu : court.principalSeat}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground pl-4">
                    {court.benches}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('Constitutional / Statutory Basis', 'آئینی و قانونی بنیاد')}
                  </span>
                  <p className="text-[11px] font-medium text-foreground">
                    {court.governingLaw}
                  </p>
                </div>

                {court.totalJudges && (
                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                    <span className="text-muted-foreground">{t('Sanctioned Strength', 'ججز کی تعداد')}</span>
                    <span className="font-semibold text-foreground">{court.totalJudges}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
