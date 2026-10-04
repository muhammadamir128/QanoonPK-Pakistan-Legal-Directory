'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function ScrollAnimationProvider({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()
  const progressBarRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Clean up any existing ScrollTriggers before re-initializing
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

    // 1. Top Reading Scroll Progress Bar
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.2,
        },
      })
    }

    // 2. Animate elements with [data-gsap="fade-up"] or .gsap-fade-up
    const fadeUpElements = document.querySelectorAll(
      '[data-gsap="fade-up"], .gsap-fade-up, section > div.container > div:first-child'
    )
    fadeUpElements.forEach((el) => {
      // Don't re-animate if already has ScrollTrigger
      if ((el as any)._gsapTriggered) return
      ;(el as any)._gsapTriggered = true

      gsap.fromTo(
        el,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    // 3. Stagger Grids (Cards, Categories, Quick Stats, Legal Helplines)
    const staggerContainers = document.querySelectorAll(
      '[data-gsap="stagger"], .gsap-stagger, .grid'
    )
    staggerContainers.forEach((container) => {
      const children = container.querySelectorAll(
        ':scope > div, :scope > article, :scope > a, .card, [data-card]'
      )
      if (children.length <= 1) return
      if ((container as any)._gsapTriggered) return
      ;(container as any)._gsapTriggered = true

      gsap.fromTo(
        children,
        { opacity: 0, y: 25, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    // 4. Subtle Parallax for Hero & Accent Banners
    const heroElements = document.querySelectorAll('.hero-gradient, [data-gsap="hero-parallax"]')
    heroElements.forEach((hero) => {
      gsap.to(hero, {
        y: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    })

    // 5. Section Header Badges & Titles
    const sectionHeaders = document.querySelectorAll('section h2, .section-heading')
    sectionHeaders.forEach((heading) => {
      if ((heading as any)._gsapTriggered) return
      ;(heading as any)._gsapTriggered = true

      gsap.fromTo(
        heading,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    // Refresh ScrollTrigger calculations after all layout settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [pathname])

  return (
    <>
      {/* Top Reading Scroll Progress Indicator */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-emerald-400 to-amber-400 z-[9999] origin-left scale-x-0 pointer-events-none transition-opacity"
        style={{ transformOrigin: '0% 50%' }}
      />
      {children}
    </>
  )
}
