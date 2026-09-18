'use client'

import * as React from 'react'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const { lang, t } = useLanguage()
  const [isVisible, setIsVisible] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

      // Show button after scrolling down 240px
      if (scrollY > 240) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      // Calculate scroll progress percentage (0 - 100)
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100))
        setProgress(pct)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Circular progress dimensions
  const size = 44
  const strokeWidth = 2.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div
      className={cn(
        'fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 ease-out pointer-events-none select-none',
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      )}
    >
      <div className="relative group">
        {/* Floating tooltip on hover */}
        <div
          className={cn(
            'absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap',
            'bg-foreground text-background shadow-md opacity-0 group-hover:opacity-100',
            'transition-all duration-200 pointer-events-none translate-y-1 group-hover:translate-y-0',
            lang === 'ur' && 'font-urdu'
          )}
        >
          {t('Back to Top', 'اوپر جائیں')}
          {/* Tooltip caret */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground" />
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={t('Scroll to top', 'صفحے کے اوپر جائیں')}
          className={cn(
            'relative flex items-center justify-center rounded-full',
            'w-9 h-9 sm:w-11 sm:h-11 transition-all duration-300 cursor-pointer',
            'bg-background/85 dark:bg-card/90 backdrop-blur-md border border-border/80 text-foreground',
            'shadow-lg shadow-black/5 dark:shadow-black/20',
            'hover:bg-primary hover:text-primary-foreground hover:border-primary',
            'hover:shadow-xl hover:shadow-primary/25 hover:scale-105 active:scale-95',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
          )}
        >
          {/* Circular SVG Scroll Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-[1px]"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-border/40 group-hover:text-primary-foreground/30 transition-colors"
              strokeWidth={strokeWidth}
            />
            {/* Active progress ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-primary group-hover:text-primary-foreground transition-all duration-150"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Up Arrow Icon */}
          <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 relative z-10" />
        </button>
      </div>
    </div>
  )
}
