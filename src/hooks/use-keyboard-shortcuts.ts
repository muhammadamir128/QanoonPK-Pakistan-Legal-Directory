'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

const SHORTCUTS: Array<{
  key: string
  description: string
  descriptionUrdu: string
  action: (router: ReturnType<typeof useRouter>) => void
}> = [
  { key: '/', description: 'Focus search', descriptionUrdu: 'تلاش پر فوکس', action: () => focusSearch() },
  { key: 'g h', description: 'Go to Home', descriptionUrdu: 'صفحۂ اول', action: (r) => r.push('/') },
  { key: 'g l', description: 'Go to Laws', descriptionUrdu: 'قوانین', action: (r) => r.push('/laws') },
  { key: 'g c', description: 'Go to Categories', descriptionUrdu: 'اقسام', action: (r) => r.push('/categories') },
  { key: 'g f', description: 'Go to Finder', descriptionUrdu: 'فائنڈر', action: (r) => r.push('/finder') },
  { key: 'g w', description: 'Go to Lawyers', descriptionUrdu: 'وکلاء', action: (r) => r.push('/lawyers') },
  { key: 'g t', description: 'Go to Templates', descriptionUrdu: 'ٹیمپلیٹس', action: (r) => r.push('/templates') },
  { key: 'g a', description: 'Go to AI Chat', descriptionUrdu: 'اے آئی چیٹ', action: (r) => r.push('/chat') },
  { key: 'g q', description: 'Go to FAQ', descriptionUrdu: 'سوالات', action: (r) => r.push('/faq') },
  { key: 'g o', description: 'Go to Compare', descriptionUrdu: 'موازنہ', action: (r) => r.push('/compare') },
  { key: '?', description: 'Show shortcuts', descriptionUrdu: 'شارٹ کٹس دکھائیں', action: () => showHelp() },
]

function focusSearch() {
  window.dispatchEvent(new CustomEvent('qpk-open-search'))
}

function showHelp() {
  window.dispatchEvent(new CustomEvent('qpk-show-shortcuts'))
}

export function useKeyboardShortcuts() {
  const router = useRouter()
  const buffer = React.useRef('')
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K shortcut (can work even in some focus contexts or outside)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        focusSearch()
        return
      }

      // Skip if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Allow Escape to blur
        if (e.key === 'Escape') {
          target.blur()
        }
        return
      }

      // Single-key shortcuts
      if (e.key === '/') {
        e.preventDefault()
        focusSearch()
        return
      }
      if (e.key === '?') {
        e.preventDefault()
        showHelp()
        return
      }

      // Multi-key shortcuts (g + letter)
      if (e.key === 'g' || buffer.current === 'g') {
        if (buffer.current === 'g' && e.key.match(/^[hlcwtaqo]$/)) {
          const shortcut = SHORTCUTS.find((s) => s.key === `g ${e.key}`)
          if (shortcut) {
            e.preventDefault()
            shortcut.action(router)
          }
          buffer.current = ''
          if (timeout.current) clearTimeout(timeout.current)
          return
        }
        if (e.key === 'g') {
          buffer.current = 'g'
          if (timeout.current) clearTimeout(timeout.current)
          timeout.current = setTimeout(() => {
            buffer.current = ''
          }, 1000)
          return
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [router])

  return SHORTCUTS
}

export { SHORTCUTS }
