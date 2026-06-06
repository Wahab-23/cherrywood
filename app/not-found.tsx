import Link from 'next/link'
import { ArrowRight, Home, Building2, BookOpen, Phone } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d1b2e] text-white flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.06), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 text-[20vw] font-black uppercase text-white/[0.02] leading-none select-none hidden lg:block"
      >
        404
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3">
          <span className="block w-8 h-px bg-[#c9a84c]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">
            Page Not Found
          </span>
          <span className="block w-8 h-px bg-[#c9a84c]" />
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="font-display text-6xl md:text-8xl font-light text-white leading-none tracking-tight">
            404
          </h1>
          <p className="text-lg text-white/40 font-light leading-relaxed">
            The page you are looking for has moved, or doesn&apos;t exist.
            Let us guide you back.
          </p>
        </div>

        {/* Separator */}
        <div className="w-16 h-px bg-[#c9a84c]/40 mx-auto" />

        {/* Navigation options */}
        <nav aria-label="Recovery links" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { href: '/', label: 'Homepage', desc: 'Cherrywood Tower overview', icon: <Home className="w-4 h-4" /> },
            { href: '/projects', label: 'Our Projects', desc: 'View all developments', icon: <Building2 className="w-4 h-4" /> },
            { href: '/journal', label: 'Journal', desc: 'Architecture & design insights', icon: <BookOpen className="w-4 h-4" /> },
            { href: '/contact', label: 'Contact Us', desc: 'Speak with our team', icon: <Phone className="w-4 h-4" /> },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 p-5 border border-white/10 hover:border-[#c9a84c]/40 hover:bg-white/5 transition-all duration-300 text-left"
            >
              <div className="w-9 h-9 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] group-hover:bg-[#c9a84c] group-hover:border-[#c9a84c] group-hover:text-[#0d1b2e] transition-all duration-300 shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-[#c9a84c] transition-colors duration-300 flex items-center gap-1">
                  {item.label}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </p>
                <p className="text-xs text-white/40 font-light mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </nav>

        {/* Back link */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
          Cherrywood Tower &bull; Saddar, Karachi
        </p>
      </div>
    </div>
  )
}
