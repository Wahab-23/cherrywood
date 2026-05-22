import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

const footerLinks = {
  tower: [
    { name: 'Residences', href: '/#apartments' },
    { name: 'Retail Shops', href: '/#tower' },
    { name: 'Amenities', href: '/#amenities' },
    { name: 'Approvals & NOCs', href: '/#approvals' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Journal', href: '/journal' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

// TODO: Replace href="#" with real social URLs before going live
const socialLinks = [
  { name: 'Instagram', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'WhatsApp', href: '#' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0a1628] text-white relative overflow-hidden">

      {/* ── Decorative background element — large ghosted wordmark ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 p-4 text-[20vw] font-black uppercase tracking-tighter text-white/[0.02] leading-none hidden lg:block"
      >
        CW
      </div>

      {/* ── Top accent line ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />

      {/* ── Main content ── */}
      <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 pt-20 pb-16">

        {/* ── Top row: Brand statement + links ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 pb-16 border-b border-white/10">

          {/* Brand column */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-block group">
              <img
                src="/logo.jpg"
                alt="Cherrywood Builders Logo"
                className="h-16 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>

            <p className="text-sm text-white/40 leading-relaxed max-w-sm font-light">
              Ameer Hamza Builders & Developers — crafting iconic residential and commercial landmarks with architectural purity and uncompromising attention to detail.
            </p>

            <div className="w-8 h-px bg-[#c9a84c]" />

            {/* Contact block */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#c9a84c]" />
                <a
                  href="tel:+923111854854"
                  className="text-sm text-white/60 hover:text-[#c9a84c] transition-colors duration-200"
                >
                  +92 3111 854 854
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#c9a84c]" />
                <a
                  href="mailto:info@cherrywoodbuilders.com"
                  className="text-sm text-white/60 hover:text-[#c9a84c] transition-colors duration-200"
                >
                  info@cherrywoodbuilders.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                <p className="text-sm text-white/40 leading-relaxed">
                  Plot No. 125 Katrak Road,<br />
                  Depot Lines, Saddar,<br />
                  Karachi — 74200, Pakistan
                </p>
              </div>
            </div>
          </div>

          {/* Links columns — right side */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">

            {/* Cherrywood Tower */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c9a84c] mb-7">
                Cherrywood Tower
              </h3>
              <ul className="space-y-3.5">
                {footerLinks.tower.map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c9a84c] mb-7">
                Company
              </h3>
              <ul className="space-y-3.5">
                {footerLinks.company.map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/40 hover:text-white transition-colors duration-200"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal + Social stacked */}
            <div className="space-y-10">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c9a84c] mb-7">
                  Legal
                </h3>
                <ul className="space-y-3.5">
                  {footerLinks.legal.map((l) => (
                    <li key={l.name}>
                      <Link
                        href={l.href}
                        className="text-xs text-white/40 hover:text-white transition-colors duration-200"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c9a84c] mb-5">
                  Follow
                </h3>
                <div className="flex flex-col gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      className="text-xs text-white/40 hover:text-white transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="py-12 grid grid-cols-3 gap-8 border-b border-white/10">
          {[
            { value: '3', label: 'Apartment Types' },
            { value: 'G+', label: 'Double-Height Shops' },
            { value: '8+', label: 'NOCs & Approvals' },
          ].map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-black text-[#c9a84c] mb-1">{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            &copy; {year} Ameer Hamza Builders &amp; Developers. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            Cherrywood Tower &nbsp;&bull;&nbsp; Saddar, Karachi
          </p>
        </div>
      </div>
    </footer>
  )
}
