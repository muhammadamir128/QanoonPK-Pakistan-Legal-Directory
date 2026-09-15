'use client'

import * as React from 'react'

export type RecentlyViewedItem = {
  slug: string
  title: string
  titleUrdu?: string | null
  yearEnacted: number
  categorySlug: string
  categoryName: string
  categoryColor?: string | null
  viewedAt: number
}

const STORAGE_KEY = 'qpk-recently-viewed'
const MAX_ITEMS = 8

export function useRecentlyViewed() {
  const [items, setItems] = React.useState<RecentlyViewedItem[]>([])

  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as RecentlyViewedItem[]
      if (Array.isArray(stored)) setItems(stored)
    } catch {}
  }, [])

  const addRecentlyViewed = React.useCallback((item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
    setItems((prev) => {
      // Remove existing entry with same slug
      const filtered = prev.filter((i) => i.slug !== item.slug)
      const newItem: RecentlyViewedItem = { ...item, viewedAt: Date.now() }
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }, [])

  const clearRecentlyViewed = React.useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  return { items, addRecentlyViewed, clearRecentlyViewed }
}
