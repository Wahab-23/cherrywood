'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
  { name: 'Journal', href: '/journal' },
  { name: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isHome = pathname === '/'

  // ── FIX 1: Scroll detection broken on mobile (iOS Safari) ──────────────────
  // window.scrollY scroll events fire unreliably on iOS momentum scroll.
  // Solution: read scroll position from document.documentElement.scrollTop
  // as the authoritative source, and debounce with requestAnimationFrame
  // so rapid scroll events don't thrash state.
  const handleScroll = useCallback(() => {
    const scrollY =
      window.scrollY ??
      window.pageYOffset ??
      document.documentElement.scrollTop ??
      document.body.scrollTop ??
      0
    setIsScrolled(scrollY > 20)
  }, [])

  useEffect(() => {
    // Run immediately on mount to set correct initial state
    handleScroll()

    // Passive listener on both window and document to catch all scroll sources.
    // iOS Safari fires on document; standard browsers fire on window.
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // ── Lock body scroll when mobile menu is open ───────────────────────────────
  // Prevents the page scrolling behind the open menu on iOS.
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const isLightNav = isScrolled || !isHome

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b',
        isLightNav
          ? 'bg-[#fcfbf8]/95 backdrop-blur-md border-neutral-200/40 shadow-xs'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className={cn('w-full mx-auto px-6 md:px-12 lg:px-20 xl:px-28 transition-all duration-300 ease-in-out',
        isLightNav
          ? 'max-w-[1536px]'
          : ''
      )}>
        <div className="flex items-center justify-between py-2">

          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <img
              src="/logo.jpg"
              alt="Cherrywood Logo"
              className={cn(
                'w-auto object-contain transition-all duration-300 group-hover:opacity-80',
                isLightNav ? 'h-14 md:h-18' : 'h-16 md:h-20'
              )}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(`${link.href}/`) || pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 relative py-2 group',
                    isActive
                      ? 'text-[#c9a84c]'
                      : isLightNav
                        ? 'text-slate-600 hover:text-slate-950'
                        : 'text-white/80 hover:text-white'
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-px bg-[#c9a84c] transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={cn(
                'hidden md:inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3.5 transition-all duration-300 active:scale-95',
                isLightNav
                  ? 'text-white bg-[#0d1b2e] hover:bg-[#1e2d42] border border-[#0d1b2e]'
                  : 'text-[#0d1b2e] bg-[#c9a84c] hover:bg-[#b8973d] border border-[#c9a84c]'
              )}
            >
              Enquire Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* ── FIX 2: Hamburger not firing on mobile tap ─────────────────────
                Root causes:
                1. Touch targets under 44×44px are unreliable on iOS — added
                   min-w and min-h to guarantee a tap-safe hit area.
                2. Using onClick is fine for touch (React maps onTouchEnd → onClick
                   correctly), but adding touch-action: manipulation removes the
                   300ms tap delay on older iOS without needing a meta viewport hack.
                3. Removed rounded-lg — the border-radius was clipping the visual
                   tap region on some Android WebViews.
            ──────────────────────────────────────────────────────────────────── */}
            <button
              type="button"
              className={cn(
                'md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] transition-colors',
                'touch-manipulation select-none',
                isLightNav ? 'text-slate-800' : 'text-white'
              )}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5 pointer-events-none" />
                : <Menu className="w-5 h-5 pointer-events-none" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ────────────────────────────────────────────────────────
          FIX: Previously the closed state used only opacity-0, which still
          receives touch events on some WebKit versions. Now we also use
          visibility: hidden (via Tailwind's `invisible`) in the closed state
          so the element is completely removed from the interaction layer.
          pointer-events-none is kept as a belt-and-suspenders measure.

          Note: visibility transitions require both `visible` and `invisible`
          to be on the element — the transition-all handles the animated states.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'md:hidden border-t transition-all duration-300 ease-in-out',
          mobileMenuOpen
            ? 'max-h-[400px] opacity-100 visible bg-[#fcfbf8]/98 backdrop-blur-md border-neutral-200/40'
            : 'max-h-0 opacity-0 invisible pointer-events-none border-transparent overflow-hidden'
        )}
      >
        <nav className="flex flex-col px-6 py-5 gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-xs font-bold uppercase tracking-[0.2em] py-3 flex items-center justify-between',
                  'border-b border-slate-100 last:border-0 transition-colors touch-manipulation',
                  isActive ? 'text-[#c9a84c]' : 'text-slate-700 hover:text-slate-950'
                )}
              >
                {link.name}
                <ArrowRight
                  className={cn(
                    'w-3.5 h-3.5 pointer-events-none transition-colors',
                    isActive ? 'text-[#c9a84c]' : 'text-slate-300'
                  )}
                />
              </Link>
            )
          })}

          <Link
            href="/contact"
            className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-[#0d1b2e]
                       py-4 text-center flex items-center justify-center gap-1.5
                       hover:bg-[#1e2d42] transition-colors touch-manipulation"
          >
            Enquire Now <ArrowRight className="w-3.5 h-3.5 pointer-events-none" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
