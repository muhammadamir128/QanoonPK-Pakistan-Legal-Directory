'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Calculator, Building2, Users, Scale, FileText, CheckCircle2,
  Printer, ArrowRight, Info, AlertTriangle, Sparkles, RefreshCw,
  Share2, ShieldCheck, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useLanguage } from '@/components/language-provider'
import { toast } from 'sonner'

export default function CalculatorsPage() {
  const { t, lang } = useLanguage()
  const isUrdu = lang === 'ur'

  // --- 1. Property Tax Calculator State ---
  const [propProvince, setPropProvince] = React.useState('punjab')
  const [propValue, setPropValue] = React.useState<number>(5000000)
  const [propType, setPropType] = React.useState<'urban' | 'rural'>('urban')
  const [buyerStatus, setBuyerStatus] = React.useState<'filer' | 'late_filer' | 'non_filer'>('filer')
  const [sellerStatus, setSellerStatus] = React.useState<'filer' | 'non_filer'>('filer')

  // --- 2. Inheritance Calculator State ---
  const [estateValue, setEstateValue] = React.useState<number>(10000000)
  const [deceasedGender, setDeceasedGender] = React.useState<'male' | 'female'>('male')
  const [hasSpouse, setHasSpouse] = React.useState(true)
  const [numWives, setNumWives] = React.useState(1)
  const [numSons, setNumSons] = React.useState(2)
  const [numDaughters, setNumDaughters] = React.useState(1)
  const [hasFather, setHasFather] = React.useState(true)
  const [hasMother, setHasMother] = React.useState(true)

  // --- 3. Court Fee Calculator State ---
  const [suitValuation, setSuitValuation] = React.useState<number>(1000000)
  const [courtType, setCourtType] = React.useState<'civil_money' | 'property_declaration' | 'succession' | 'appeal'>('civil_money')
  const [courtProvince, setCourtProvince] = React.useState('punjab')

  // --- Calculations: Property Tax ---
  const propertyCalc = React.useMemo(() => {
    const val = Number(propValue) || 0
    if (val <= 0) return { stampDuty: 0, cvt: 0, tma: 0, fbrBuyer: 0, fbrSeller: 0, totalBuyer: 0, totalSeller: 0, grandTotal: 0 }

    let stampRate = 0.03
    let cvtRate = 0.01
    let tmaRate = 0.01

    if (propProvince === 'sindh') {
      stampRate = 0.02
      cvtRate = 0.0125
      tmaRate = 0.01
    } else if (propProvince === 'ict') {
      stampRate = 0.04
      cvtRate = 0.01
      tmaRate = 0.00
    } else if (propProvince === 'kpk') {
      stampRate = 0.02
      cvtRate = 0.01
      tmaRate = 0.01
    } else if (propProvince === 'balochistan') {
      stampRate = 0.03
      cvtRate = 0.01
      tmaRate = 0.01
    }

    if (propType === 'rural') {
      tmaRate = 0
    }

    const stampDuty = Math.round(val * stampRate)
    const cvt = Math.round(val * cvtRate)
    const tma = Math.round(val * tmaRate)

    // FBR 236K (Buyer Advance Tax)
    let fbrBuyerRate = 0.03 // Active Filer
    if (buyerStatus === 'late_filer') fbrBuyerRate = 0.06
    if (buyerStatus === 'non_filer') fbrBuyerRate = 0.12
    const fbrBuyer = Math.round(val * fbrBuyerRate)

    // FBR 236C (Seller Advance Tax)
    let fbrSellerRate = 0.03 // Filer
    if (sellerStatus === 'non_filer') fbrSellerRate = 0.10
    const fbrSeller = Math.round(val * fbrSellerRate)

    const totalBuyer = stampDuty + cvt + tma + fbrBuyer
    const totalSeller = fbrSeller

    return {
      stampDuty,
      stampRate: (stampRate * 100).toFixed(1),
      cvt,
      cvtRate: (cvtRate * 100).toFixed(2),
      tma,
      tmaRate: (tmaRate * 100).toFixed(1),
      fbrBuyer,
      fbrBuyerRate: (fbrBuyerRate * 100).toFixed(0),
      fbrSeller,
      fbrSellerRate: (fbrSellerRate * 100).toFixed(0),
      totalBuyer,
      totalSeller,
      grandTotal: totalBuyer + totalSeller,
    }
  }, [propProvince, propValue, propType, buyerStatus, sellerStatus])

  // --- Calculations: Islamic Inheritance (Shariah / MFLO 1961) ---
  const inheritanceCalc = React.useMemo(() => {
    const estate = Number(estateValue) || 0
    if (estate <= 0) return { heirs: [], totalDistributed: 0, remaining: 0 }

    const hasChildren = (numSons + numDaughters) > 0
    let remainingShare = 1.0
    const heirs: Array<{ title: string; titleUrdu: string; count: number; fraction: string; pct: number; amount: number }> = []

    // 1. Spouse Share
    if (hasSpouse) {
      if (deceasedGender === 'male') {
        // Widow share: 1/8 if children, 1/4 if no children
        const fractionNum = hasChildren ? '1/8' : '1/4'
        const share = hasChildren ? 0.125 : 0.25
        const amount = Math.round(estate * share)
        remainingShare -= share
        heirs.push({
          title: numWives > 1 ? `Widows (${numWives})` : 'Widow (Wife)',
          titleUrdu: numWives > 1 ? `بیوائیں (${numWives})` : 'بیوہ (اہلیہ)',
          count: numWives,
          fraction: fractionNum,
          pct: share * 100,
          amount,
        })
      } else {
        // Husband share: 1/4 if children, 1/2 if no children
        const fractionNum = hasChildren ? '1/4' : '1/2'
        const share = hasChildren ? 0.25 : 0.5
        const amount = Math.round(estate * share)
        remainingShare -= share
        heirs.push({
          title: 'Husband',
          titleUrdu: 'شوہر',
          count: 1,
          fraction: fractionNum,
          pct: share * 100,
          amount,
        })
      }
    }

    // 2. Mother Share: 1/6 with children, 1/3 without children
    if (hasMother) {
      const share = hasChildren ? (1 / 6) : (1 / 3)
      const fractionNum = hasChildren ? '1/6' : '1/3'
      const amount = Math.round(estate * share)
      remainingShare -= share
      heirs.push({
        title: 'Mother',
        titleUrdu: 'والدہ',
        count: 1,
        fraction: fractionNum,
        pct: Number((share * 100).toFixed(2)),
        amount,
      })
    }

    // 3. Father Share: 1/6 with children, residuary if no children
    if (hasFather) {
      if (hasChildren) {
        const share = 1 / 6
        const amount = Math.round(estate * share)
        remainingShare -= share
        heirs.push({
          title: 'Father',
          titleUrdu: 'والد',
          count: 1,
          fraction: '1/6',
          pct: Number((share * 100).toFixed(2)),
          amount,
        })
      } else if (!hasChildren && numSons === 0 && numDaughters === 0) {
        // Father gets remaining residuary
        const share = Math.max(0, remainingShare)
        const amount = Math.round(estate * share)
        remainingShare = 0
        heirs.push({
          title: 'Father (Residuary)',
          titleUrdu: 'والد (عصبہ / بقیہ ترکہ)',
          count: 1,
          fraction: 'Residuary',
          pct: Number((share * 100).toFixed(2)),
          amount,
        })
      }
    }

    // 4. Children (Sons & Daughters): 2 parts for Son, 1 part for Daughter
    if (hasChildren && remainingShare > 0) {
      const totalUnits = (numSons * 2) + (numDaughters * 1)
      if (totalUnits > 0) {
        const unitShare = remainingShare / totalUnits
        if (numSons > 0) {
          const sonsTotalShare = unitShare * 2 * numSons
          const sonsTotalAmount = Math.round(estate * sonsTotalShare)
          heirs.push({
            title: `Sons (${numSons})`,
            titleUrdu: `بیٹے (${numSons})`,
            count: numSons,
            fraction: `${numSons * 2}/${totalUnits} of Residuary`,
            pct: Number((sonsTotalShare * 100).toFixed(2)),
            amount: sonsTotalAmount,
          })
        }
        if (numDaughters > 0) {
          const daughtersTotalShare = unitShare * 1 * numDaughters
          const daughtersTotalAmount = Math.round(estate * daughtersTotalShare)
          heirs.push({
            title: `Daughters (${numDaughters})`,
            titleUrdu: `بیٹیاں (${numDaughters})`,
            count: numDaughters,
            fraction: `${numDaughters}/${totalUnits} of Residuary`,
            pct: Number((daughtersTotalShare * 100).toFixed(2)),
            amount: daughtersTotalAmount,
          })
        }
      }
    }

    const totalDistributed = heirs.reduce((sum, h) => sum + h.amount, 0)
    return { heirs, totalDistributed, remaining: estate - totalDistributed }
  }, [estateValue, deceasedGender, hasSpouse, numWives, numSons, numDaughters, hasFather, hasMother])

  // --- Calculations: Court Fee ---
  const courtFeeCalc = React.useMemo(() => {
    const val = Number(suitValuation) || 0
    let fee = 0
    let rateExplanation = ''
    let maxCeiling = 15000

    if (courtProvince === 'punjab') {
      maxCeiling = 15000
    } else if (courtProvince === 'sindh') {
      maxCeiling = 25000
    }

    if (courtType === 'civil_money') {
      if (val <= 25000) {
        fee = 0
        rateExplanation = 'Exempted (Suit valuation below Rs. 25,000)'
      } else {
        // Standard 7.5% ad-valorem up to statutory ceiling
        const calculated = Math.round(val * 0.075)
        fee = Math.min(calculated, maxCeiling)
        rateExplanation = calculated > maxCeiling
          ? `7.5% calculated exceeds statutory maximum cap of Rs. ${maxCeiling.toLocaleString()}`
          : `7.5% Ad-valorem under Court Fees Act 1870 (Schedule I)`
      }
    } else if (courtType === 'property_declaration') {
      fee = 500
      rateExplanation = 'Fixed Court Fee for Declaratory Suits under Schedule II (Art. 17)'
    } else if (courtType === 'succession') {
      // Succession Certificate: usually 2.5% to 5% up to max ceiling
      const calculated = Math.round(val * 0.03)
      fee = Math.min(calculated, maxCeiling)
      rateExplanation = `3% of the debt/security value subject to maximum ceiling of Rs. ${maxCeiling.toLocaleString()}`
    } else if (courtType === 'appeal') {
      const calculated = Math.round(val * 0.075)
      fee = Math.min(calculated, maxCeiling)
      rateExplanation = `Ad-valorem appeal fee capped at statutory max ceiling (Rs. ${maxCeiling.toLocaleString()})`
    }

    return { fee, rateExplanation, maxCeiling }
  }, [suitValuation, courtType, courtProvince])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QanoonPK Legal Calculators',
        text: 'Calculate Property Stamp Duty, FBR Taxes, Islamic Inheritance and Court Fees under Pakistani law.',
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success(t('Link copied to clipboard', 'لنک کلپ بورڈ پر کاپی ہو گیا'))
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t('Home', 'ہوم')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{t('Legal Calculators', 'قانونی کیلکولیٹرز')}</span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-amber-500/5 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <Calculator className="h-3.5 w-3.5" />
                <span>{t('Pakistani Law Financial Calculators', 'پاکستانی قانونی و مالیاتی کیلکولیٹرز')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {t('Pakistan Legal Calculators Suite', 'پاکستان قانونی کیلکولیٹرز')}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  'Accurate, instantaneous calculations for Property Stamp Duty, FBR Advance Taxes (236K/236C), Shariah Inheritance shares, and Court Fees under current Pakistani statutes.',
                  'پراپرٹی سٹامپ ڈیوٹی، ایف بی آر ایڈوانس ٹیکس، اسلامی وراثت کی شرعی تقسیم اور عدالتی فیس کا فوری اور درست حساب۔'
                )}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 print:hidden">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 text-xs">
                <Share2 className="h-3.5 w-3.5" />
                <span>{t('Share', 'شیئر')}</span>
              </Button>
              <Button variant="default" size="sm" onClick={handlePrint} className="gap-2 text-xs">
                <Printer className="h-3.5 w-3.5" />
                <span>{t('Print / Save PDF', 'پرنٹ / پی ڈی ایف')}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Tabs Container */}
        <Tabs defaultValue="property" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/60 border border-border/60 rounded-xl">
            <TabsTrigger value="property" className="py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs">
              <Building2 className="h-4 w-4 text-emerald-600" />
              <span>{t('Property Taxes & Stamp Duty', 'پراپرٹی ٹیکس و سٹامپ')}</span>
            </TabsTrigger>
            <TabsTrigger value="inheritance" className="py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs">
              <Users className="h-4 w-4 text-amber-600" />
              <span>{t('Islamic Inheritance (Viraasat)', 'اسلامی وراثت (ترکہ تقسیم)')}</span>
            </TabsTrigger>
            <TabsTrigger value="court_fee" className="py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs">
              <Scale className="h-4 w-4 text-blue-600" />
              <span>{t('Court Fee Calculator', 'کورٹ فیس کیلکولیٹر')}</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PROPERTY TAX & STAMP DUTY */}
          <TabsContent value="property" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Input Form (5 cols) */}
              <Card className="lg:col-span-5 border-border/70 shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>{t('Property Parameters', 'پراپرٹی کی تفصیلات')}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('Select province, valuation and FBR tax status.', 'صوبہ، سرکاری قیمت اور ٹیکس فائلر حیثیت منتخب کریں۔')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Province */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Province / Jurisdiction', 'صوبہ / علاقہ')}</Label>
                    <Select value={propProvince} onValueChange={setPropProvince}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="punjab">Punjab (پنجاب)</SelectItem>
                        <SelectItem value="sindh">Sindh (سندھ)</SelectItem>
                        <SelectItem value="ict">Islamabad ICT (وفاقی دارالحکومت)</SelectItem>
                        <SelectItem value="kpk">Khyber Pakhtunkhwa (خیبر پختونخوا)</SelectItem>
                        <SelectItem value="balochistan">Balochistan (بلوچستان)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Valuation / DC Rate */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">{t('Property Value / DC Rate (PKR)', 'پراپرٹی ویلیو یا ڈی سی ریٹ (روپے)')}</Label>
                      <span className="text-[11px] font-mono font-semibold text-primary">
                        PKR {Number(propValue || 0).toLocaleString()}
                      </span>
                    </div>
                    <Input
                      type="number"
                      min="100000"
                      step="100000"
                      value={propValue || ''}
                      onChange={(e) => setPropValue(Number(e.target.value))}
                      placeholder="e.g. 5000000"
                      className="text-xs font-mono"
                    />
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      {[2500000, 5000000, 10000000, 20000000].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setPropValue(v)}
                          className="px-2 py-0.5 text-[10px] rounded bg-muted hover:bg-primary/10 hover:text-primary transition-colors border border-border/60"
                        >
                          {(v / 1000000).toFixed(1)}M ({v >= 10000000 ? `${v / 10000000} Cr` : `${v / 100000} Lac`})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Area Type */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Location Type', 'علاقے کی نوعیت')}</Label>
                    <RadioGroup
                      value={propType}
                      onValueChange={(v: 'urban' | 'rural') => setPropType(v)}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="urban" id="urb" />
                        <label htmlFor="urb" className="text-xs cursor-pointer">{t('Urban (TMA Tax applies)', 'شہری (TMA لاگو)')}</label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="rural" id="rur" />
                        <label htmlFor="rur" className="text-xs cursor-pointer">{t('Rural (Dehi)', 'دیہی (مواضع)')}</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Buyer FBR Status */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Purchaser / Buyer Status (Sec 236K)', 'خریدار کی فائلر حیثیت')}</Label>
                    <Select value={buyerStatus} onValueChange={(v: any) => setBuyerStatus(v)}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="filer">{t('Active Taxpayer / Filer (3%)', 'ایکٹو فائلر (3 فیصد)')}</SelectItem>
                        <SelectItem value="late_filer">{t('Late Filer (6%)', 'لیٹ فائلر (6 فیصد)')}</SelectItem>
                        <SelectItem value="non_filer">{t('Non-Filer (12%)', 'نان فائلر (12 فیصد)')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Seller FBR Status */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Seller / Vendor Status (Sec 236C)', 'بیچنے والے کی حیثیت')}</Label>
                    <Select value={sellerStatus} onValueChange={(v: any) => setSellerStatus(v)}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="filer">{t('Active Taxpayer / Filer (3%)', 'ایکٹو فائلر (3 فیصد)')}</SelectItem>
                        <SelectItem value="non_filer">{t('Non-Filer (10%)', 'نان فائلر (10 فیصد)')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Output Results Card (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <Card className="border-primary/30 shadow-sm bg-card">
                  <CardHeader className="bg-primary/5 pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <CardTitle className="text-base text-foreground flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>{t('Transfer Taxes & Duty Breakdown', 'ٹیکس اور سٹامپ ڈیوٹی کی تفصیل')}</span>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {t('Applicable under Stamp Act 1899 & Finance Act 2024-25', 'سٹامپ ایکٹ 1899 اور فنانس ایکٹ کے تحت لاگو')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono font-bold bg-background">
                        {propProvince.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    {/* Grand Total Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-muted/40 border border-border/60">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">{t('Total Payable by Buyer', 'خریدار کے واجبات')}</span>
                        <span className="text-base sm:text-lg font-bold font-mono text-emerald-600">
                          PKR {propertyCalc.totalBuyer.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">{t('Total Payable by Seller', 'بیچنے والے کے واجبات')}</span>
                        <span className="text-base sm:text-lg font-bold font-mono text-amber-600">
                          PKR {propertyCalc.totalSeller.toLocaleString()}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border/60 sm:pl-3">
                        <span className="text-[11px] text-muted-foreground block">{t('Combined Total Tax', 'مجموعی واجب الادا ٹیکس')}</span>
                        <span className="text-base sm:text-lg font-extrabold font-mono text-primary">
                          PKR {propertyCalc.grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('Itemized Government Charges', 'حکومتی چارجز کی مدات')}
                      </h4>

                      <div className="divide-y divide-border/60 text-xs">
                        {/* Stamp Duty */}
                        <div className="py-2.5 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-foreground block">{t('Provincial Stamp Duty', 'صوبائی سٹامپ ڈیوٹی')}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {t(`Rate: ${propertyCalc.stampRate}% on DC Valuation`, `شرح: ${propertyCalc.stampRate} فیصد بمطابق ڈی سی ریٹ`)}
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-foreground">
                            PKR {propertyCalc.stampDuty.toLocaleString()}
                          </span>
                        </div>

                        {/* Capital Value Tax (CVT) */}
                        <div className="py-2.5 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-foreground block">{t('Capital Value Tax (CVT)', 'کیپیٹل ویلیو ٹیکس (CVT)')}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {t(`Rate: ${propertyCalc.cvtRate}%`, `شرح: ${propertyCalc.cvtRate} فیصد`)}
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-foreground">
                            PKR {propertyCalc.cvt.toLocaleString()}
                          </span>
                        </div>

                        {/* TMA / Corporation Tax */}
                        {propertyCalc.tma > 0 && (
                          <div className="py-2.5 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-foreground block">{t('TMA / Local Government Tax', 'لوکل گورنمنٹ / TMA ٹیکس')}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {t(`Rate: ${propertyCalc.tmaRate}% (Urban jurisdiction)`, `شرح: ${propertyCalc.tmaRate} فیصد (شہری حدود)`)}
                              </span>
                            </div>
                            <span className="font-mono font-semibold text-foreground">
                              PKR {propertyCalc.tma.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* FBR 236K (Buyer) */}
                        <div className="py-2.5 flex items-center justify-between bg-primary/5 px-2 rounded-md">
                          <div>
                            <span className="font-semibold text-primary block">
                              {t('FBR Advance Tax - Buyer (Sec 236K)', 'ایف بی آر ودہولڈنگ ٹیکس - خریدار (دفعہ 236-K)')}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {buyerStatus === 'filer' ? t('Active Filer rate (3%)', 'ایکٹو فائلر شرح (3%)') : t(`Non-Filer punitive rate (${propertyCalc.fbrBuyerRate}%)`, `نان فائلر شرح (${propertyCalc.fbrBuyerRate}%)`)}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-primary">
                            PKR {propertyCalc.fbrBuyer.toLocaleString()}
                          </span>
                        </div>

                        {/* FBR 236C (Seller) */}
                        <div className="py-2.5 flex items-center justify-between bg-amber-500/5 px-2 rounded-md">
                          <div>
                            <span className="font-semibold text-amber-700 dark:text-amber-400 block">
                              {t('FBR Advance Tax - Seller (Sec 236C)', 'ایف بی آر ودہولڈنگ ٹیکس - فروخت کنندہ (دفعہ 236-C)')}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {sellerStatus === 'filer' ? t('Active Filer rate (3%)', 'ایکٹو فائلر شرح (3%)') : t(`Non-Filer rate (${propertyCalc.fbrSellerRate}%)`, `نان فائلر شرح (${propertyCalc.fbrSellerRate}%)`)}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                            PKR {propertyCalc.fbrSeller.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer note */}
                    <div className="rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground flex gap-2">
                      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p>
                        {t(
                          'Note: Sub-registrar fee (Registration Fee) is typically Rs. 500 - 1,000 extra per deed. DC rates vary by mouza/tehsil. Advance taxes 236C & 236K are adjustable against your annual income tax returns.',
                          'نوٹ: سب رجسٹرار رجسٹریشن فیس 500 تا 1000 روپے الگ سے لاگو ہو سکتی ہے۔ ایڈوانس انکم ٹیکس (236C اور 236K) سالانہ انکم ٹیکس ریٹرن میں ایڈجسٹ ہو سکتا ہے۔'
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </TabsContent>

          {/* TAB 2: ISLAMIC INHERITANCE (VIRAASAT / AL-FARA'ID) */}
          <TabsContent value="inheritance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Input Form (5 cols) */}
              <Card className="lg:col-span-5 border-border/70 shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <span>{t('Estate & Family Members', 'ترکہ و وارثین کی تفصیل')}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('Calculated according to Islamic Shariah & Muslim Family Laws Ordinance 1961.', 'شریعتِ اسلامی اور مسلم فیملی لاء کے اصولوں کے مطابق۔')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Net Estate Value */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">{t('Net Estate Value (PKR)', 'کل ترکہ / جائیداد کی مالیت (روپے)')}</Label>
                      <span className="text-[11px] font-mono font-semibold text-primary">
                        PKR {Number(estateValue || 0).toLocaleString()}
                      </span>
                    </div>
                    <Input
                      type="number"
                      min="1000"
                      value={estateValue || ''}
                      onChange={(e) => setEstateValue(Number(e.target.value))}
                      placeholder="e.g. 10000000"
                      className="text-xs font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {t('*After deducting funeral expenses, debts, and valid will (wasiyyat max 1/3rd).', '*تدفین کے اخراجات، قرضہ جات اور جائز وصیت منہا کرنے کے بعد کی خالص رقم۔')}
                    </p>
                  </div>

                  {/* Deceased Gender */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Deceased (Marhoom / Marhooma)', 'مرحوم / مرحومہ کی جنس')}</Label>
                    <RadioGroup
                      value={deceasedGender}
                      onValueChange={(v: 'male' | 'female') => setDeceasedGender(v)}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="male" id="dec_m" />
                        <label htmlFor="dec_m" className="text-xs cursor-pointer">{t('Male (Husband / Father)', 'مرد (شوہر / باپ)')}</label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="female" id="dec_f" />
                        <label htmlFor="dec_f" className="text-xs cursor-pointer">{t('Female (Wife / Mother)', 'عورت (اہلیہ / ماں)')}</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Surviving Spouse */}
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">
                        {deceasedGender === 'male' ? t('Surviving Widow(s)?', 'کیا بیوہ حیات ہے؟') : t('Surviving Husband?', 'کیا شوہر حیات ہے؟')}
                      </Label>
                      <input
                        type="checkbox"
                        checked={hasSpouse}
                        onChange={(e) => setHasSpouse(e.target.checked)}
                        className="rounded border-gray-300 text-primary h-4 w-4"
                      />
                    </div>
                    {hasSpouse && deceasedGender === 'male' && (
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{t('Number of Widows', 'بیواؤں کی تعداد')}:</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setNumWives(n)}
                              className={`h-6 w-6 rounded text-xs font-mono font-medium ${numWives === n ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Children Counts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">{t('Number of Sons', 'بیٹوں کی تعداد')}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={numSons}
                        onChange={(e) => setNumSons(Math.max(0, parseInt(e.target.value) || 0))}
                        className="text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">{t('Number of Daughters', 'بیٹیوں کی تعداد')}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={numDaughters}
                        onChange={(e) => setNumDaughters(Math.max(0, parseInt(e.target.value) || 0))}
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Parents */}
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-2">
                    <Label className="text-xs font-semibold block">{t('Surviving Parents', 'حیات والدین')}</Label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasFather}
                          onChange={(e) => setHasFather(e.target.checked)}
                          className="rounded border-gray-300 text-primary h-4 w-4"
                        />
                        <span>{t('Father Alive', 'والد حیات ہیں')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasMother}
                          onChange={(e) => setHasMother(e.target.checked)}
                          className="rounded border-gray-300 text-primary h-4 w-4"
                        />
                        <span>{t('Mother Alive', 'والدہ حیات ہیں')}</span>
                      </label>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Output Results Card (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <Card className="border-amber-500/30 shadow-sm bg-card">
                  <CardHeader className="bg-amber-500/10 pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <CardTitle className="text-base text-foreground flex items-center gap-2">
                          <Users className="h-4 w-4 text-amber-600" />
                          <span>{t('Shariah Inheritance Share Distribution', 'شرعی و قانونی حصص کی تقسیم')}</span>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {t('As prescribed in Surah An-Nisa (Ayat 11, 12, 176) & Succession Act', 'قرآن مجید سورۃ النساء اور قانونِ وراثت کے تحت')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 font-semibold">
                        {t('Al-Fara\'id', 'علم الفرائض')}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-5">
                    {/* Summary box */}
                    <div className="p-4 rounded-xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">{t('Total Distributable Estate', 'کل قابل تقسیم ترکہ')}</span>
                        <span className="text-xl font-black font-mono text-primary">
                          PKR {Number(estateValue || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground sm:text-right">
                        <span>{t('Total Heirs Count: ', 'کل قانونی وارثین: ')}</span>
                        <span className="font-bold text-foreground">
                          {inheritanceCalc.heirs.reduce((s, h) => s + h.count, 0)} {t('persons', 'افراد')}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown table */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('Individual Heir Breakdown', 'وارثین کے انفرادی حصے')}
                      </h4>

                      <div className="divide-y divide-border/60">
                        {inheritanceCalc.heirs.map((heir, idx) => {
                          const perPersonAmount = heir.count > 1 ? Math.round(heir.amount / heir.count) : heir.amount
                          return (
                            <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-foreground">
                                    {isUrdu ? heir.titleUrdu : heir.title}
                                  </span>
                                  <Badge variant="secondary" className="text-[10px] py-0 font-mono">
                                    {heir.fraction} ({heir.pct}%)
                                  </Badge>
                                </div>
                                {heir.count > 1 && (
                                  <span className="text-[11px] text-muted-foreground block">
                                    {t(
                                      `Per individual: PKR ${perPersonAmount.toLocaleString()} each`,
                                      `فی کس حصہ: PKR ${perPersonAmount.toLocaleString()}`
                                    )}
                                  </span>
                                )}
                              </div>
                              <div className="sm:text-right">
                                <span className="font-mono font-bold text-sm text-foreground block">
                                  PKR {heir.amount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Legal note on MFLO Section 4 (Grandchildren rights) */}
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{t('Pakistani Law Note (MFLO 1961 Section 4):', 'پاکستانی قانون کا اہم نکتہ (دفعہ 4):')}</span>
                      </div>
                      <p className="leading-relaxed">
                        {t(
                          'Under Section 4 of Muslim Family Laws Ordinance 1961, orphan grandchildren inherit the share their deceased parent would have received if alive at the time of succession.',
                          'مسلم فیملی لاز آرڈیننس 1961 کی دفعہ 4 کے تحت یتیم پوتے، پوتیوں کو اپنے مرحوم والد یا والدہ کا مکمل شرعی حصہ ملتا ہے۔'
                        )}
                      </p>
                    </div>

                  </CardContent>
                </Card>
              </div>

            </div>
          </TabsContent>

          {/* TAB 3: COURT FEE CALCULATOR */}
          <TabsContent value="court_fee" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Input Form (5 cols) */}
              <Card className="lg:col-span-5 border-border/70 shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="h-4 w-4 text-blue-600" />
                    <span>{t('Suit Valuation & Court Parameters', 'مقدمے کی مالیت و تفصیل')}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('Under Court Fees Act 1870 & Suits Valuation Act 1887.', 'کورٹ فیس ایکٹ 1870 اور سوٹس ویلیو ایشن ایکٹ کے تحت۔')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Province */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Jurisdiction / Province', 'صوبہ / عدالت کا دائرہ اختیار')}</Label>
                    <Select value={courtProvince} onValueChange={setCourtProvince}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="punjab">Punjab (Max ceiling Rs. 15,000)</SelectItem>
                        <SelectItem value="sindh">Sindh (Max ceiling Rs. 25,000)</SelectItem>
                        <SelectItem value="federal">Islamabad / Federal Courts</SelectItem>
                        <SelectItem value="kpk">Khyber Pakhtunkhwa</SelectItem>
                        <SelectItem value="balochistan">Balochistan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nature of Suit */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t('Nature of Legal Suit', 'مقدمے کی نوعیت')}</Label>
                    <Select value={courtType} onValueChange={(v: any) => setCourtType(v)}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="civil_money">{t('Money Recovery / Damages (Ad-valorem 7.5%)', 'ہرجانہ یا رقم کی وصولی (7.5 فیصد)')}</SelectItem>
                        <SelectItem value="property_declaration">{t('Declaratory Suit / Title (Fixed Fee)', 'دعویٰ استقرارِ حق / ڈیکلریشن (مقررہ فیس)')}</SelectItem>
                        <SelectItem value="succession">{t('Succession Certificate / Letters of Admin', 'جانشینی سرٹیفکیٹ (Succession)')}</SelectItem>
                        <SelectItem value="appeal">{t('Civil / First Appeal (RFA)', 'اپیل دیوانی (RFA)')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Suit Claim Valuation */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">{t('Claim / Suit Valuation (PKR)', 'دعویٰ کی مالیت / دعوے کی قیمت (روپے)')}</Label>
                      <span className="text-[11px] font-mono font-semibold text-primary">
                        PKR {Number(suitValuation || 0).toLocaleString()}
                      </span>
                    </div>
                    <Input
                      type="number"
                      min="1000"
                      value={suitValuation || ''}
                      onChange={(e) => setSuitValuation(Number(e.target.value))}
                      placeholder="e.g. 1000000"
                      className="text-xs font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      {t('For money suits, this is the total claim amount.', 'پیسوں یا نقصان کے دعووں میں یہ کلیم کی گئی کل رقم ہے۔')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Output Results Card (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <Card className="border-blue-500/30 shadow-sm bg-card">
                  <CardHeader className="bg-blue-500/10 pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <CardTitle className="text-base text-foreground flex items-center gap-2">
                          <Scale className="h-4 w-4 text-blue-600" />
                          <span>{t('Estimated Court Fee Payable', 'واجب الادا کورٹ فیس ٹکٹ')}</span>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {t('Schedule I & II, Court Fees Act 1870', 'کورٹ فیس ایکٹ 1870 کے شیڈول کے تحت')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 font-mono font-semibold">
                        PKR {courtFeeCalc.fee.toLocaleString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    {/* Big Fee Display */}
                    <div className="p-5 rounded-xl bg-muted/40 border border-border/60 text-center space-y-1">
                      <span className="text-xs text-muted-foreground block">{t('Total Court Fee Stamp Required', 'کل کورٹ فیس اسٹامپ ٹکٹ')}</span>
                      <span className="text-3xl font-black font-mono text-primary block">
                        PKR {courtFeeCalc.fee.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-muted-foreground block pt-1">
                        {courtFeeCalc.rateExplanation}
                      </span>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-2 text-xs">
                      <h4 className="font-semibold text-foreground">{t('Legal Rules for Court Fees in Pakistan:', 'پاکستان میں عدالتی فیس کے قانونی اصول:')}</h4>
                      <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                        <li>
                          <strong className="text-foreground">{t('Exemption Under Rs. 25,000:', '25 ہزار روپے سے کم پر معافی:')}</strong>{' '}
                          {t('Under provincial amendments, civil suits valued up to Rs. 25,000 are exempt from court fee.', '25,000 روپے تک کے دعووں پر کوئی عدالتی فیس نہیں ہے۔')}
                        </li>
                        <li>
                          <strong className="text-foreground">{t('Maximum Statutory Cap:', 'زیادہ سے زیادہ حد (Cap):')}</strong>{' '}
                          {t('In Punjab and Federal courts, the maximum court fee ceiling is capped at Rs. 15,000 no matter how large the suit valuation is.', 'پنجاب اور اسلام آباد میں دعویٰ جتنا بھی بڑا ہو، کورٹ فیس کی زیادہ سے زیادہ حد 15,000 روپے مقرر ہے۔')}
                        </li>
                        <li>
                          <strong className="text-foreground">{t('Refund of Court Fee:', 'فیس کی واپسی:')}</strong>{' '}
                          {t('If a dispute is settled via Section 89-A CPC (Alternative Dispute Resolution / Mediation) before evidence, 100% court fee is refundable.', 'اگر مقدمہ اے ڈی آر یا راضی نامے کے ذریعے طے ہو جائے تو کورٹ فیس واپس ہو جاتی ہے۔')}
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-blue-500/10 p-3 text-[11px] text-blue-900 dark:text-blue-300 flex gap-2">
                      <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <p>
                        {t(
                          'Pauper Suits (Order 33 CPC): Citizens who cannot afford court fees can file an application to sue as an indigent person (miskeen/pauper) without paying advance court fees.',
                          'مفلسی کا دعویٰ (آرڈر 33 ضابطہ دیوانی): وہ شہری جو کورٹ فیس ادا کرنے کی استطاعت نہیں رکھتے وہ بطور مفلس بغیر فیس مقدمہ دائر کرنے کی درخواست دے سکتے ہیں۔'
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </TabsContent>

        </Tabs>

        {/* Bottom Helper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 print:hidden">
          <Card className="border-border/60 hover:border-primary/40 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                <span>{t('Legal Templates', 'قانونی ٹیمپلیٹس')}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('Need to draft an agreement, affidavit, or power of attorney?', 'بیع نامہ، کرایہ نامہ یا حلف نامہ تیار کرنا ہے؟')}
              </p>
              <Link href="/templates" className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline pt-1">
                <span>{t('Generate Document', 'دستاویز بنائیں')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/60 hover:border-primary/40 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                <Scale className="h-4 w-4 text-emerald-600" />
                <span>{t('Need a Lawyer?', 'وکیل کی ضرورت ہے؟')}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('Connect with verified advocates specializing in property or civil law.', 'پراپرٹی اور فیملی کے ماہر تصدیق شدہ وکلاء تلاش کریں۔')}
              </p>
              <Link href="/lawyers" className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium hover:underline pt-1">
                <span>{t('Browse Lawyers', 'وکلاء ملاحظہ کریں')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/60 hover:border-primary/40 transition-colors">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span>{t('Free Legal Aid', 'مفت قانونی امداد')}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('Access emergency helplines and certified pro-bono legal organizations.', 'ہنگامی ہیلپ لائنز اور مفت قانونی امداد کے ادارے دریافت کریں۔')}
              </p>
              <Link href="/legal-aid" className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium hover:underline pt-1">
                <span>{t('View Legal Aid Directory', 'قانونی امداد ڈائریکٹری')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
