'use client'

import * as React from 'react'

export type Language = 'en' | 'ur'

type LanguageContextValue = {
  lang: Language
  setLang: (l: Language) => void
  toggle: () => void
  dir: 'ltr' | 'rtl'
  t: (en: string, ur?: string) => string
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Language>('en')

  React.useEffect(() => {
    const stored = (typeof window !== 'undefined' && (localStorage.getItem('qpk-lang') as Language)) || 'en'
    setLangState(stored)
  }, [])

  const setLang = React.useCallback((l: Language) => {
    setLangState(l)
    if (typeof window !== 'undefined') localStorage.setItem('qpk-lang', l)
  }, [])

  const toggle = React.useCallback(() => {
    setLang(lang === 'en' ? 'ur' : 'en')
  }, [lang, setLang])

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
      document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr'
    }
  }, [lang])

  const t = React.useCallback((en: string, ur?: string) => (lang === 'ur' && ur ? ur : en), [lang])

  const value = React.useMemo(
    () => ({ lang, setLang, toggle, dir: (lang === 'ur' ? 'rtl' : 'ltr') as 'ltr' | 'rtl', t }),
    [lang, setLang, toggle, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
