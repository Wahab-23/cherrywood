import Link from 'next/link'

const footerLinks = {
  developments: [
    { name: 'All Projects', href: '/projects' },
    { name: 'Available Units', href: '/projects' },
    { name: 'Upcoming', href: '/projects?status=upcoming' },
    { name: 'Completed', href: '/projects?status=completed' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Journal', href: '/journal' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0a1628] text-white/50">

      {/* Main grid */}
      <div className="container mx-auto px-6 md:px-12 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/">
              <img
                src="/logo.jpg"
                alt="Cherrywood Logo"
                className="w-14 h-14 object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              We build the future of living. State-of-the-art developments designed for the modern world.
            </p>
            {/* Thin gold divider */}
            <div className="w-8 h-px bg-[#c9a84c]" />
            <div className="space-y-1">
              <p className="text-xs text-white/30">Inquiries</p>
              <a href="mailto:info@cherrywood.com" className="text-sm text-white/70 hover:text-[#c9a84c] transition-colors">
                info@cherrywood.com
              </a>
            </div>
          </div>

          {/* Developments */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c9a84c] mb-7">
              Developments
            </h3>
            <ul className="space-y-4">
              {footerLinks.developments.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors duration-200">
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
            <ul className="space-y-4">
              {footerLinks.company.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-sm hover:text-white transition-colors duration-200">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c9a84c] mb-7">
                Legal
              </h3>
              <ul className="space-y-4">
                {footerLinks.legal.map((l) => (
                  <li key={l.name}>
                    <Link href={l.href} className="text-xs hover:text-white transition-colors duration-200">
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
              <div className="flex gap-5">
                {['Instagram', 'LinkedIn'].map((s) => (
                  <a key={s} href="#" className="text-xs hover:text-white transition-colors">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
            &copy; {year} Cherrywood Developments. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
            Luxury Real Estate
          </p>
        </div>
      </div>
    </footer>
  )
}
