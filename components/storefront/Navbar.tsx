'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isLightNav = isScrolled || !isHome

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b pb-3 pt-1 md:py-4',
        isLightNav
          ? 'bg-[#fcfbfc]/90 backdrop-blur-md border-slate-200/50 shadow-sm'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Logo - preserved original rectangular proportions */}
        <Link href="/" className="flex items-center group shrink-0">
          <img
            src="/logo.jpg"
            alt="Cherrywood Logo"
            className="w-24 h-24 md:w-20 md:h-20 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 relative py-2 group',
                  isActive
                    ? 'text-[#c9a84c]'
                    : isLightNav
                      ? 'text-slate-700 hover:text-slate-950'
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

        {/* Action Button: Enquire Now */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className={cn(
              'inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all duration-300 active:scale-95 shadow-sm font-semibold',
              isLightNav
                ? 'text-white bg-[#0d1b2e] hover:bg-[#1a2d44]'
                : 'text-[#0d1b2e] bg-[#c9a84c] hover:bg-[#b8973d]'
            )}
          >
            Enquire Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className={cn(
            'md:hidden p-2 transition-colors',
            isLightNav ? 'text-slate-800' : 'text-white'
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Drop Menu */}
        <div
          className={cn(
            'absolute top-full left-0 right-0 transition-all duration-300 ease-in-out md:hidden overflow-hidden border-b',
            mobileMenuOpen
              ? 'max-h-[350px] opacity-100 bg-[#fcfbfc]/98 backdrop-blur-md border-slate-200/50 shadow-lg p-6'
              : 'max-h-0 opacity-0 border-transparent p-0 pointer-events-none'
          )}
        >
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 hover:text-[#c9a84c] transition-colors py-1 flex items-center justify-between"
              >
                {link.name}
                <ArrowRight className="w-3.5 h-3.5 opacity-40 text-slate-400" />
              </Link>
            ))}
            <Link
              href="/contact"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-[#0d1b2e] py-3.5 rounded-xl text-center mt-3 flex items-center justify-center gap-1.5 shadow-sm"
            >
              Enquire Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>

      </div>
    </header>
  )
}
