import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import {
  MapPin, ArrowRight, Phone, Mail, CheckCircle2,
  Building2, ShieldCheck, Zap, Trees, Flame, Car, Wifi,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ContactForm } from '@/components/storefront/ContactForm'
import { TowerFeatures } from '@/components/storefront/TowerFeatures'

// ── Meta ──────────────────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywoodbuilders.com'
  const canonical = siteUrl
  return {
    title: 'Cherrywood Tower — Luxury Living in the Heart of Karachi',
    description:
      'Cherrywood Tower: a landmark residential & commercial development by Ameer Hamza Builders in the heart of Saddar, Karachi. Premium apartments & double-height retail shops.',
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: 'Cherrywood Tower | Luxury Living in Saddar, Karachi',
      description:
        'Iconic mixed-use tower with 3-bedroom, 2-bedroom apartments, a rooftop garden, BBQ area, and double-height luxury retail shops.',
      images: [{ url: `${siteUrl}/cherrywood-tower.png`, width: 1200, height: 630, alt: 'Cherrywood Tower Exterior' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cherrywood Tower | Luxury Living in Saddar, Karachi',
      description: 'Iconic mixed-use tower with premium apartments and retail in Saddar, Karachi.',
      images: [`${siteUrl}/cherrywood-tower.png`],
    },
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
export default async function CherrywoodTowerPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywoodbuilders.com'

  const [project, page] = await Promise.all([
    prisma.project.findFirst({
      where: { slug: 'cherrywood-tower' },
      include: { units: { orderBy: { unit_number: 'asc' } } },
    }),
    prisma.page.findFirst({
      where: {
        OR: [
          { slug: 'home' },
          { template: 'home' }
        ]
      }
    })
  ])

  let cmsData: any = null
  if (page?.content) {
    try {
      cmsData = JSON.parse(page.content)
    } catch (e) {
      console.error("Failed to parse homepage content JSON:", e)
    }
  }

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trees': return <Trees className="w-5 h-5" />
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />
      case 'Flame': return <Flame className="w-5 h-5" />
      case 'Zap': return <Zap className="w-5 h-5" />
      case 'Car': return <Car className="w-5 h-5" />
      case 'Building2': return <Building2 className="w-5 h-5" />
      case 'Wifi': return <Wifi className="w-5 h-5" />
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />
      default: return <CheckCircle2 className="w-5 h-5" />
    }
  }

  const residentialUnits = project?.units.filter(u => u.type !== 'Double Height Retail Shop') ?? []
  const shopUnits = project?.units.filter(u => u.type === 'Double Height Retail Shop') ?? []

  const activeUnitGroups = (cmsData?.apartments?.unit_types || [
    {
      type: 'Type A', label: '3 Bedroom',
      beds: '3 Bedrooms', size: '1,656 To 1,752 Sq.Ft.',
      layoutImage: '/uploads/homepage/type-a-3-bedroom-1780295250720.png',
    },
    {
      type: 'Type B', label: '2 Bedroom (Drawing)',
      beds: '2 Bedrooms + Drawing', size: '1,248 To 1,328 Sq.Ft.',
      layoutImage: '/uploads/homepage/type-b-2-bedroom--drawing--1780295255906.png',
    },
    {
      type: 'Type C', label: '2 Bedroom + Lounge',
      beds: '2 Bedrooms + Lounge', size: '916 To 1,016 Sq.Ft.',
      layoutImage: '/uploads/homepage/type-c-2-bedroom-1780295260924.png',
    }
  ]).map((ut: any) => {
    // Override sizes and labels dynamically to ensure they match exact requirements
    let size = ut.size;
    let label = ut.label;
    if (ut.type === 'Type A' || ut.type?.includes('Type A')) {
      size = '1,656 To 1,752 Sq.Ft.';
    } else if (ut.type === 'Type B' || ut.type?.includes('Type B')) {
      size = '1,248 To 1,328 Sq.Ft.';
    } else if (ut.type === 'Type C' || ut.type?.includes('Type C')) {
      size = '916 To 1,016 Sq.Ft.';
      label = '2 Bedroom + Lounge';
    }

    const units = residentialUnits.filter((u: any) => u.unit_number.includes(ut.type));
    let status = 'available';
    if (units.length > 0) {
      if (units.some((u: any) => u.status === 'available')) {
        status = 'available';
      } else if (units.some((u: any) => u.status === 'limited')) {
        status = 'limited';
      } else if (units.some((u: any) => u.status === 'booked')) {
        status = 'booked';
      } else {
        status = 'sold';
      }
    }
    return {
      ...ut,
      label,
      size,
      units,
      status
    };
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    name: cmsData?.hero?.title ? `${cmsData.hero.title} ${cmsData.hero.italic_title}` : 'Cherrywood Tower',
    url: `${siteUrl}/projects/cherrywood-tower`,
    description: cmsData?.hero?.description || 'Luxury mixed-use residential & commercial tower in Saddar, Karachi.',
    image: `${siteUrl}/cherrywood-tower.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot No. 125 Katrak Road, Depot Lines',
      addressLocality: 'Saddar, Karachi',
      postalCode: '74200',
      addressCountry: 'PK',
    },
    telephone: '+923111854854',
    numberOfAccommodationUnits: project?.total_units ?? 48,
  }

  const defaultNocs = [
    'Survey of Pakistan (NOC)',
    'Karachi Water & Sewerage Board',
    'KE — K-Electric (NOC)',
    'Civil Aviation Authority',
    'Karachi Cantonment Board',
    'Pakistan Air Force (PAF)',
    'Sindh Environmental Protection Agency',
    'SSGC — Sui Southern Gas',
  ]

  const activeNocs = cmsData?.nocs || defaultNocs

  const defaultTeamMembers = [
    { role: 'Developer', name: 'Ameer Hamza Builders & Developers', desc: 'A renowned name in the construction industry — the mastermind behind this iconic development, bringing vision to reality.' },
    { role: 'Structural Engineer', name: 'Combiner', desc: 'Responsible for the state-of-the-art architectural structure, ensuring every floor meets the highest standards of structural integrity.' },
    { role: 'MEP Engineering', name: 'MV Nareen Associates', desc: 'Overseeing plumbing, electrical, and mechanical systems that power the building seamlessly day and night.' },
    { role: 'Electrical Engineering', name: 'Hi-Tech Engineering', desc: 'A renowned electrical engineering firm that has ensured all wiring and installations are completely shock-proof and certified.' },
    { role: 'Health, Safety & Environment', name: 'ME Pakistan', desc: 'A pioneer in environmental consultancy, ensuring internationally certified HSE standards are rigorously met throughout the project.' },
    { role: 'Architectural Visualisation', name: 'Pixarch', desc: "One of the finest architectural visualisation companies in Pakistan — closely capturing how life will feel inside Cherrywood Tower." },
  ]

  const activeTeamMembers = cmsData?.team?.members || defaultTeamMembers

  const defaultAmenities = [
    { icon: 'Trees', title: 'Rooftop Garden', desc: 'A lush rooftop garden, BBQ area, gazebo, and jogging track — your private green retreat above the city.' },
    { icon: 'ShieldCheck', title: '24/7 Security', desc: 'Round-the-clock CCTV surveillance and trained security personnel ensure complete peace of mind.' },
    { icon: 'Flame', title: 'NFPA Fire System', desc: 'Equipped with internationally certified NFPA firefighting systems — your safety is non-negotiable.' },
    { icon: 'Zap', title: 'Standby Generator', desc: 'Never experience a blackout. Full standby generator coverage keeps every floor powered at all times.' },
    { icon: 'Car', title: 'Secure Parking', desc: 'Expansive, fully secured parking area with CCTV cameras and firefighting equipment in place.' },
    { icon: 'Building2', title: 'Hi-Speed Lifts', desc: 'Multiple high-speed lifts ready to transport you to your floor swiftly and smoothly.' },
    { icon: 'Wifi', title: 'Modern Electrical', desc: 'Shock-proof electrical systems by Hi-Tech Engineering. Every circuit is safety certified.' },
    { icon: 'CheckCircle2', title: 'HSE Compliant', desc: 'Internationally certified Health, Safety & Environment standards ensured by ME Pakistan.' },
  ]

  const activeAmenities = cmsData?.amenities?.items || defaultAmenities

  return (
    <div className="bg-[#fcfbf8] text-[#0d1b2e] overflow-x-hidden relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); filter: blur(3px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes marqueescroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes lineGrow {
          from { width: 0; opacity: 0; }
          to   { width: 3rem; opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim-eyebrow  { animation: fadeUp  0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .anim-h1       { animation: fadeUp  0.9s cubic-bezier(0.16,1,0.3,1) 0.30s both; }
        .anim-tagline  { animation: fadeUp  0.8s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
        .anim-location { animation: fadeUp  0.8s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .anim-ctas     { animation: fadeUp  0.8s cubic-bezier(0.16,1,0.3,1) 0.65s both; }
        .anim-stats    { animation: fadeUp  0.8s cubic-bezier(0.16,1,0.3,1) 0.80s both; }
        .anim-image    { animation: scaleIn 1.1s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
        .anim-fade     { animation: fadeIn  1.2s ease 0.1s both; }

        .marquee-inner { animation: marqueescroll 32s linear infinite; }
        .marquee-inner:hover { animation-play-state: paused; }

        .reveal {
          opacity: 0;
          transform: translateY(24px);
          filter: blur(2px);
          transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                      transform 0.75s cubic-bezier(0.16,1,0.3,1),
                      filter 0.75s ease;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
        .reveal-left {
          opacity: 0;
          transform: translateX(-28px);
          transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                      transform 0.75s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-left.revealed { opacity: 1; transform: translateX(0); }

        .reveal-right {
          opacity: 0;
          transform: translateX(28px);
          transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                      transform 0.75s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-right.revealed { opacity: 1; transform: translateX(0); }

        .stagger > *:nth-child(1) { transition-delay: 0ms; }
        .stagger > *:nth-child(2) { transition-delay: 80ms; }
        .stagger > *:nth-child(3) { transition-delay: 160ms; }
        .stagger > *:nth-child(4) { transition-delay: 240ms; }
        .stagger > *:nth-child(5) { transition-delay: 320ms; }
        .stagger > *:nth-child(6) { transition-delay: 400ms; }
        .stagger > *:nth-child(7) { transition-delay: 480ms; }
        .stagger > *:nth-child(8) { transition-delay: 560ms; }

        .headline-shimmer {
          background: linear-gradient(90deg, #ffffff 35%, #c9a84c 50%, #ffffff 65%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          transition: -webkit-text-fill-color 0.3s;
        }
        .headline-shimmer:hover {
          -webkit-text-fill-color: transparent;
          animation: shimmerMove 1.8s linear infinite;
        }
        @keyframes shimmerMove {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }

        .card-lift {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.4s ease,
                      border-color 0.3s ease;
        }
        .card-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(13,27,46,0.12);
        }

        .gold-line {
          width: 2rem;
          height: 1px;
          background: #c9a84c;
          transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .group:hover .gold-line { width: 100%; }

        .border-sweep {
          width: 0;
          height: 1px;
          background: rgba(201,168,76,0.5);
          transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .group:hover .border-sweep { width: 100%; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .float { animation: float 7s ease-in-out infinite; }

        @keyframes scrollPulse {
          0%   { opacity: 0.4; transform: translateY(0) scaleY(1); }
          50%  { opacity: 1;   transform: translateY(4px) scaleY(1.1); }
          100% { opacity: 0.4; transform: translateY(0) scaleY(1); }
        }
        .scroll-pulse { animation: scrollPulse 2s ease-in-out infinite; }
      `}</style>

      <Script id="scroll-reveal" strategy="afterInteractive">
        {`
          (function(){
            function reveal(){
              document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function(el){
                var rect = el.getBoundingClientRect();
                if(rect.top < window.innerHeight - 60){
                  el.classList.add('revealed');
                }
              });
            }
            window.addEventListener('scroll', reveal, { passive: true });
            setTimeout(reveal, 100);
          })();
        `}
      </Script>

      {/* 1. HERO */}
      <section id="hero" className="relative min-h-screen bg-[#0d1b2e] flex flex-col lg:flex-row overflow-hidden pt-10 md:pt-12">
        <div className="anim-fade absolute inset-0 lg:left-[45%]">
          <Image
            src={cmsData?.hero?.bg_image || "/uploads/homepage/cherrywood-top.webp"}
            loading="eager"
            alt="Cherrywood Tower exterior rendering at dusk"
            fill priority
            className="object-cover object-center opacity-40 lg:opacity-80"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0d1b2e]/80 via-[#0d1b2e]/40 to-[#0d1b2e] lg:bg-linear-to-r lg:from-[#0d1b2e] lg:via-[#0d1b2e]/50 lg:to-transparent" />
        </div>

        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '128px' }}
        />

        <div aria-hidden="true" className="absolute top-0 right-0 w-px h-48 bg-linear-to-b from-[#c9a84c]/50 to-transparent hidden lg:block z-20" />

        <div className="relative z-20 w-full lg:w-[50%] flex flex-col justify-center pt-12 pb-24 lg:py-16 px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="anim-eyebrow flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-[#c9a84c]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">
              Ameer Hamza Builders &amp; Developers
            </span>
          </div>

          <h1 className="headline-shimmer text-5xl md:text-6xl xl:text-7xl text-white leading-[1.05] tracking-tight mb-6">
            <span className="font-black">{cmsData?.hero?.title || "Cherrywood"}</span><br />
            <span className="font-light italic text-[#c9a84c]">{cmsData?.hero?.italic_title || "Tower"}</span>
          </h1>

          <p className="anim-tagline text-base text-white/50 font-light leading-relaxed max-w-md mb-3">
            {cmsData?.hero?.description}
          </p>

          <div className="anim-location flex items-center gap-2 text-white/40 text-sm pb-8">
            <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0" />
            <span>{cmsData?.hero?.location}</span>
          </div>

          <div className="anim-ctas flex flex-wrap gap-4 mb-8">
            <Link href={cmsData?.hero?.cta_url || "#apartments"}
              className="group inline-flex items-center gap-3 bg-[#c9a84c] hover:bg-[#b8973d] text-[#0d1b2e] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300">
              {cmsData?.hero?.cta_label || "Explore Units"}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link href={cmsData?.hero?.cta_secondary_url || "/contact?from=cherrywood-tower&interest=register"}
              className="inline-flex items-center gap-3 border border-white/20 hover:border-[#c9a84c]/60 text-white/60 hover:text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300">
              {cmsData?.hero?.cta_secondary_label || "Register Interest"}
            </Link>
          </div>

          <div className="anim-stats flex gap-10 pt-10 border-t border-white/10">
            {[
              { value: cmsData?.hero?.stat_units_val || '48', label: cmsData?.hero?.stat_units_lbl || 'Residential Units' },
              { value: cmsData?.hero?.stat_nocs_val || '8+', label: cmsData?.hero?.stat_nocs_lbl || 'NOCs & Approvals' },
              { value: cmsData?.hero?.stat_retail_val || (shopUnits.length > 0 ? String(shopUnits.length) : '8'), label: cmsData?.hero?.stat_retail_lbl || 'Retail Shops' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black text-[#c9a84c] mb-1">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="anim-stats absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 lg:flex">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">Scroll</span>
          <div className="scroll-pulse w-px h-10 bg-linear-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* 2. MARQUEE */}
      <div className="relative z-20 bg-[#c9a84c] py-3.5 overflow-hidden">
        <div className="marquee-inner flex whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0d1b2e] pr-14">
              {cmsData?.marquee || "Cherrywood Tower • Luxury Residences • Saddar, Karachi • Premium Retail Shops • Rooftop Garden •"}
            </span>
          ))}
        </div>
      </div>

      {/* 3. LOCATION */}
      <section className="py-28 md:py-36 bg-white">
        <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            <div className="reveal-left lg:col-span-5 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Location</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#0d1b2e] leading-tight">
                {cmsData?.location?.title || "Saddar —"}<br />
                <span className="font-light italic">{cmsData?.location?.italic_title || "An Enviable Address"}</span>
              </h2>
              <div className="gold-line" />
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                {cmsData?.location?.description || "Karachi's commercial and cultural epicentre. Saddar places you moments from premier medical centres, top-class schools and colleges, and every necessity of modern life — while positioning your investment in one of the city's most sought-after addresses."}
              </p>
              <div className="flex items-start gap-3 pt-4">
                <MapPin className="w-5 h-5 text-[#c9a84c] mt-0.5 shrink-0" />
                <p className="text-sm font-semibold text-[#0d1b2e]">
                  {cmsData?.location?.address || "Plot No. 125 Katrak Road, Depot Lines, Saddar, Karachi — 74200, Pakistan"}
                </p>
              </div>
            </div>

            <div className="reveal-right lg:col-span-7">
              <div className="grid grid-cols-2 gap-3 stagger">
                {(cmsData?.location?.landmarks || [
                  { label: 'Karachi Lighthouse', dist: '0.3 km' },
                  { label: 'Empress Market', dist: '0.6 km' },
                  { label: 'Avari Towers', dist: '0.8 km' },
                  { label: "Jinnah's Mausoleum", dist: '1.2 km' },
                  { label: 'National Museum', dist: '0.9 km' },
                  { label: 'Burns Road', dist: '0.5 km' },
                  { label: 'Rainbow Centre', dist: '0.4 km' },
                  { label: 'Garden West', dist: '0.7 km' },
                ]).map((loc: any) => (
                  <div key={loc.label}
                    className="reveal flex items-center justify-between p-4 border border-neutral-100 bg-[#fcfbf8] hover:border-[#c9a84c]/40 hover:bg-white transition-all duration-300">
                    <span className="text-sm font-semibold text-[#0d1b2e]">{loc.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c]">{loc.dist}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE TOWER */}
      <section id="tower" className="relative py-28 md:py-36 bg-[#0d1b2e] text-white overflow-hidden">
        <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end mb-20">
            <div className="reveal-left lg:col-span-7 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">The Development</span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                {cmsData?.development?.title || "Modern Luxury"}<br />
                <span className="font-light italic">{cmsData?.development?.italic_title || "at the Centre of the City"}</span>
              </h2>
            </div>
            <div className="reveal-right lg:col-span-5">
              <p className="text-sm text-white/50 font-light leading-relaxed">
                {cmsData?.development?.description || "Cherrywood Tower is the perfect combination of sophistication and convenience. Elegantly styled with one of the best architectural designs, it houses premium residences above a grand lobby, wide hallways, and high-speed lifts — with double-height luxury retail shops at street level."}
              </p>
            </div>
          </div>

          <TowerFeatures features={cmsData?.development?.features} />
        </div>
      </section>

      {/* 5. APARTMENTS */}
      <section id="apartments" className="relative py-28 md:py-36 bg-[#f7f5f0] overflow-hidden">
        <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="reveal space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Residences</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#0d1b2e] leading-tight">
                <span className="font-light italic">{cmsData?.apartments?.title || "Comfort Beyond"}</span><br />
                {cmsData?.apartments?.italic_title || "Imagination"}
              </h2>
            </div>
            <p className="reveal text-sm text-neutral-500 font-light max-w-xs leading-relaxed">
              {cmsData?.apartments?.description || "Enter a spacious lounge as you turn the key to your luxury apartment. Full-length windows, onyx-topped kitchens, elegant master bedrooms, and spa-quality bathrooms await."}
            </p>
          </div>

          <div className="reveal relative w-full h-[250px] sm:h-[350px] md:h-[460px] overflow-hidden mb-16">
            <Image src={cmsData?.apartments?.image || "/uploads/homepage/spacious-lounge.webp"} alt="Cherrywood Tower luxury apartment interior"
              fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-linear-to-t from-[#f7f5f0] via-transparent to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
            {activeUnitGroups.map((group: any) => {
              return (
                <div key={group.type}
                  className="reveal card-lift bg-white border border-neutral-100 group flex flex-col justify-between">
                  <div>
                    <div className="bg-[#0d1b2e] px-8 py-6">
                      <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">{group.type}</span>
                      <h3 className="text-2xl font-black text-white mt-1">{group.label}</h3>
                    </div>
                    <div className="relative w-full h-56 bg-neutral-50/50 border-b border-neutral-100 overflow-hidden group/img flex items-center justify-center">
                      <Image
                        src={group.layoutImage}
                        alt={`${group.label} Layout Plan`}
                        fill
                        className="object-contain p-6 transition-transform duration-700 group-hover/img:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="px-8 py-8 space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Bedrooms</p>
                          <p className="text-sm font-semibold text-[#0d1b2e]">{group.beds}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Size</p>
                          <p className="text-sm font-semibold text-[#0d1b2e]">{group.size}</p>
                        </div>
                      </div>
                      <div className="flex pt-4 border-t border-neutral-100">
                        {group.status === 'available' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-50 text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                            Available for Booking
                          </span>
                        )}
                        {group.status === 'limited' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                            Limited Stock Left
                          </span>
                        )}
                        {group.status === 'booked' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            Booking Under Process
                          </span>
                        )}
                        {group.status === 'sold' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
                            Sold Out
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-8 pb-8">
                    <Link
                      href={`/projects/cherrywood-tower/${group.type.toLowerCase().replace(' ', '-')}`}
                      className="block w-full text-center border border-[#0d1b2e] hover:bg-[#0d1b2e] hover:text-white text-[#0d1b2e] py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300"
                    >
                      Explore Layout
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. RETAIL SHOPS */}
      <section className="py-28 md:py-36 bg-white">
        <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            <div className="reveal-left lg:col-span-5 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Commercial</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#0d1b2e] leading-tight">
                {cmsData?.retail?.title || "Grand Shops —"}<br />
                <span className="font-light italic">{cmsData?.retail?.italic_title || "A Smart Investment"}</span>
              </h2>
              <div className="gold-line" />
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                {cmsData?.retail?.description || "Enjoying a prime Saddar location — dubbed the commercial hub of Karachi — the project is a haven for investors. Double-height shops at the ground floor give ample business opportunity with guaranteed footfall, enabling businessmen to multiply profits rapidly."}
              </p>
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                {cmsData?.retail?.secondary_description || "Shops are exclusively designed for high-end brands and luxury items. Spacious interiors allow elegant product display, creating a one-of-a-kind experience for every customer."}
              </p>

              {shopUnits.length > 0 && (
                <div className="space-y-3 pt-4 stagger">
                  {shopUnits.map(shop => (
                    <div key={shop.id}
                      className="reveal flex items-center justify-between p-4 border border-neutral-100 hover:border-[#c9a84c]/40 transition-all duration-300">
                      <div>
                        <p className="text-sm font-bold text-[#0d1b2e]">{shop.unit_number}</p>
                        <p className="text-xs text-neutral-400">{shop.size_sqft} Sq.Ft.</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${shop.status === 'available' ? 'text-green-600' : 'text-amber-600'
                          }`}>
                          {shop.status === 'available' ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link href="/contact?from=cherrywood-tower&interest=retail-shop"
                className="group inline-flex items-center gap-3 bg-[#c9a84c] hover:bg-[#b8973d] text-[#0d1b2e] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300">
                {cmsData?.retail?.cta_label || "Invest in a Shop"}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="reveal-right lg:col-span-7">
              <div className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden bg-[#0d1b2e]">
                <Image src={cmsData?.retail?.image || "/uploads/homepage/cherrywood-shops.webp"} loading="eager" alt="Cherrywood Tower ground floor retail shops"
                  fill className="object-cover opacity-80 hover:opacity-90 transition-opacity duration-700"
                  sizes="(max-width: 1024px) 100vw, 58vw" />
                <div className="absolute inset-0 bg-linear-to-t from-[#0d1b2e]/70 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a84c]">Wide Shopping Corridors</p>
                  <p className="text-white/70 text-sm mt-1">Spacious walkways lined with classy double-height shops on both sides.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. AMENITIES */}
      <section id="amenities" className="py-28 md:py-36 bg-[#0d1b2e] text-white">
        <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="reveal max-w-3xl mb-20 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Lifestyle</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              {cmsData?.amenities?.title || "City Outside,"}<br />
              <span className="font-light italic">{cmsData?.amenities?.italic_title || "Tranquillity Inside"}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
            {activeAmenities.map((am: any, i: number) => (
              <div key={i}
                className="reveal group card-lift bg-white/5 border border-white/10 p-8 space-y-4 hover:bg-white/10 hover:border-[#c9a84c]/30">
                <div className="w-10 h-10 border border-[#c9a84c]/40 flex items-center justify-center text-[#c9a84c] group-hover:bg-[#c9a84c] group-hover:border-[#c9a84c] group-hover:text-[#0d1b2e] transition-all duration-300">
                  {getAmenityIcon(am.icon)}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#c9a84c] transition-colors duration-300">{am.title}</h3>
                <p className="text-xs text-white/50 font-light leading-relaxed">{am.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NOCs & APPROVALS */}
      <section id="approvals" className="py-24 bg-white border-y border-neutral-100">
        <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="reveal text-center mb-14 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Verified &amp; Approved</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#0d1b2e]">
              NOCs &amp; Regulatory Approvals
            </h2>
            <p className="text-sm text-neutral-400 font-light max-w-xl mx-auto">
              Every required authority has granted its certification — giving buyers and investors complete legal confidence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger">
            {activeNocs.map((noc: string) => (
              <div key={noc}
                className="reveal bg-white/5 backdrop-blur-lg flex items-center gap-3 p-4 border border-neutral-100 hover:border-[#c9a84c]/30 hover:bg-[#fcfbf8] transition-all duration-300">
                <CheckCircle2 className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <span className="text-[11px] font-semibold text-[#0d1b2e] leading-tight">{noc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. THE WINNING TEAM */}
      <section className="py-28 md:py-36 bg-[#f7f5f0]">
        <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="reveal max-w-3xl mb-16 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Expert Collaboration</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0d1b2e] leading-tight">{cmsData?.team?.title || "The Winning Team"}</h2>
            <p className="text-sm text-neutral-500 font-light max-w-xl leading-relaxed">
              {cmsData?.team?.description || "A team of highly skilled experts have joined hands to make Cherrywood Tower a success — from architecture and structure to electrical, safety, and visual excellence."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
            {activeTeamMembers.map((member: any, i: number) => (
              <div key={i}
                className="reveal group card-lift bg-white border border-neutral-100 p-8 space-y-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c9a84c]">{member.role}</span>
                <h3 className="text-lg font-bold text-[#0d1b2e] tracking-tight group-hover:text-[#c9a84c] transition-colors duration-300">
                  {member.name}
                </h3>
                <div className="gold-line" />
                <p className="text-xs text-neutral-500 font-light leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* 10. CONTACT */}
      {cmsData?.display_form !== false && (
        <section id="contact" className="py-28 md:py-36 bg-[#0d1b2e] relative overflow-hidden">
          {/* Radial gold ambient glow */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 50%, rgba(201,168,76,0.06), transparent)' }} />

          <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

              {/* Left */}
              <div className="reveal-left lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Get In Touch</span>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                    Feel the Change<br />
                    <span className="font-light italic">in Your Life</span>
                  </h2>
                </div>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Register your interest today and our team will get back to you with exclusive floor plans, updated pricing, and private viewing arrangements.
                </p>

                <div className="space-y-5 pt-4 border-t border-white/10">
                  {[
                    { icon: <Phone className="w-4 h-4" />, label: 'Phone', content: <a href="tel:+923111854854" className="text-sm font-semibold text-white hover:text-[#c9a84c] transition-colors">+92 3111 854 854</a> },
                    { icon: <Mail className="w-4 h-4" />, label: 'Email', content: <a href="mailto:info@cherrywoodbuilders.com" className="text-sm font-semibold text-white hover:text-[#c9a84c] transition-colors">info@cherrywoodbuilders.com</a> },
                    { icon: <MapPin className="w-4 h-4" />, label: 'Address', content: <p className="text-sm font-semibold text-white/80 leading-relaxed">Plot No. 125 Katrak Road,<br />Depot Lines, Saddar,<br />Karachi — 74200, Pakistan</p> },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-0.5">{item.label}</p>
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Form */}
              <div className="reveal-right lg:col-span-7">
                <ContactForm />
              </div>

            </div>
          </div>
        </section>
      )}
    </div>
  )
}
