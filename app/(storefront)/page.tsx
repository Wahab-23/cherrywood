import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { ProjectCard } from '@/components/storefront/ProjectCard'
import { ArrowRight, MapPin, Shield, Star, Heart, Home } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const homeRecord = await prisma.page.findUnique({ where: { slug: 'home' } })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'

  const title = homeRecord?.meta_title || homeRecord?.title || 'Cherrywood | Luxury Real Estate'
  const description = homeRecord?.meta_description || 'Defining the skyline of tomorrow with state-of-the-art living options.'
  const ogImage = homeRecord?.og_image || `${siteUrl}/building.png`

  return {
    title,
    description,
    alternates: { canonical: siteUrl },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: homeRecord?.og_title || title,
      description: homeRecord?.og_description || description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Cherrywood Luxury Real Estate' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface HomepageData {
  display_form?: boolean
  hero?: { title: string; subtitle: string; ctaLabel: string; ctaPath: string; bg_image: string; fg_image: string }
  features?: { title: string; description: string; icon: string }[]
  testimonial?: { quote: string; author: string; role: string }
}

// ─── Fallback content ─────────────────────────────────────────────────────────
const fallback: HomepageData = {
  display_form: false,
  hero: {
    title: 'Defining the skyline of tomorrow.',
    subtitle:
      'We create spaces that inspire, endure, and elevate the human experience. Experience architectural purity and uncompromising luxury.',
    ctaLabel: 'Explore Projects',
    ctaPath: '/projects',
    bg_image: '',
    fg_image: '',
  },
  features: [
    { title: 'Architectural Purity', description: 'Minimalist design language focusing on light, space, and structural integrity.', icon: 'home' },
    { title: 'Prime Locations', description: 'Curated environments in the world\'s most sought-after neighbourhoods.', icon: 'map-pin' },
    { title: 'Enduring Quality', description: 'Built with materials that age gracefully and stand the test of time.', icon: 'shield' },
  ],
  testimonial: {
    quote: 'Cherrywood doesn\'t just build homes; they craft sanctuaries. The attention to detail and spatial harmony is unparalleled.',
    author: 'Elena Rostova',
    role: 'Lead Architect',
  },
}

function FeatureIcon({ name }: { name: string }) {
  const cls = 'w-5 h-5'
  switch (name) {
    case 'shield': return <Shield className={cls} />
    case 'map-pin': return <MapPin className={cls} />
    case 'heart': return <Heart className={cls} />
    case 'star': return <Star className={cls} />
    default: return <Home className={cls} />
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function StorefrontPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'
  // Fetch home page from Static Pages
  const homeRecord = await prisma.page.findUnique({ where: { slug: 'home' } })

  let cms: HomepageData = fallback
  if (homeRecord?.content) {
    try {
      const parsed = JSON.parse(homeRecord.content) as HomepageData
      cms = {
        display_form: parsed.display_form || false,
        hero: {
          title: parsed.hero?.title || fallback.hero!.title,
          subtitle: parsed.hero?.subtitle || fallback.hero!.subtitle,
          ctaLabel: parsed.hero?.ctaLabel || fallback.hero!.ctaLabel,
          ctaPath: parsed.hero?.ctaPath || fallback.hero!.ctaPath || '/projects',
          bg_image: parsed.hero?.bg_image || fallback.hero!.bg_image,
          fg_image: parsed.hero?.fg_image || fallback.hero!.fg_image,
        },
        features: parsed.features?.length ? parsed.features : fallback.features,
        testimonial: {
          quote: parsed.testimonial?.quote || fallback.testimonial!.quote,
          author: parsed.testimonial?.author || fallback.testimonial!.author,
          role: parsed.testimonial?.role || fallback.testimonial!.role,
        },
      }
    } catch { /* keep fallback */ }
  }

  // FAQ from page record
  let faqs: { question: string; answer: string }[] = []
  if (homeRecord?.faqs) {
    try { faqs = JSON.parse(homeRecord.faqs) } catch { /* ignore */ }
  }

  // Latest projects
  const projects = await prisma.project.findMany({ take: 3, orderBy: { created_at: 'desc' } })

  const hero = cms.hero!
  const features = cms.features!
  const testimonial = cms.testimonial!

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Cherrywood',
    url: siteUrl,
    description: cms.hero?.subtitle || fallback.hero!.subtitle,
    image: `${siteUrl}/logo.png`,
    priceRange: '$$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '87',
    },
  }

  return (
    <div className="bg-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO  —  full-viewport dark-navy split layout
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-[#0d1b2e] flex flex-col lg:flex-row">
        {hero.bg_image && (
          <img src={hero.bg_image} alt="Cherrywood luxury residential development exterior" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        )}

        {/* Left — text column */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 lg:px-20 xl:px-28
                        pt-36 pb-24 lg:py-0 lg:w-[52%] xl:w-[48%]">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-[#c9a84c]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">
              Luxury Real Estate
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.05] mb-8">
            {hero.title}
          </h1>

          {/* Sub */}
          <p className="text-base text-white/50 font-light leading-relaxed max-w-md mb-12">
            {hero.subtitle}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href={hero.ctaPath}
              className="inline-flex items-center gap-3 bg-[#c9a84c] hover:bg-[#b8973d]
                         text-[#0d1b2e] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em]
                         transition-colors duration-300"
            >
              {hero.ctaLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 border border-white/20 hover:border-[#c9a84c]/60
                         text-white/60 hover:text-white px-8 py-4 text-[11px] font-bold uppercase
                         tracking-[0.2em] transition-all duration-300"
            >
              Our Story
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex gap-12 mt-16 pt-12 border-t border-white/10">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '200+', label: 'Units Delivered' },
              { value: '98%', label: 'Client Satisfaction' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-[#c9a84c] mb-1">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — building render */}
        <div className="relative lg:flex-1 min-h-[60vh] lg:min-h-screen flex items-center justify-center
                        overflow-hidden">
          {/* Subtle gradient on left edge to blend into text column */}
          <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#0d1b2e] to-transparent z-10 pointer-events-none" />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#0d1b2e] to-transparent z-10 pointer-events-none" />

          <Image
            src={hero.fg_image || "/building.png"}
            alt="Cherrywood Development"
            width={700}
            height={900}
            priority
            className="relative z-0 object-contain w-[90%] lg:w-full max-w-[640px]
                       drop-shadow-2xl translate-y-4"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. MARQUEE TICKER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#c9a84c] py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0d1b2e] pr-16">
              Cherrywood &nbsp;&bull;&nbsp; Premium Residences &nbsp;&bull;&nbsp; Architectural Excellence &nbsp;&bull;&nbsp; Prime Locations &nbsp;&bull;
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. FEATURES — three-column minimal grid
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 md:py-36 bg-white">
        <div className="container mx-auto px-6 md:px-12">

          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-0 mb-20">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c] mb-4">
                Why Cherrywood
              </p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#0d1b2e] leading-tight max-w-md">
                Built on three unbreakable principles.
              </h2>
            </div>
            <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-xs">
              Every decision we make, from site selection to material specification, is guided by our founding philosophy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            {features.map((f, i) => (
              <div key={i} className="py-10 md:py-0 md:px-12 first:md:pl-0 last:md:pr-0 space-y-5">
                <div className="w-10 h-10 border border-[#c9a84c]/40 flex items-center justify-center text-[#c9a84c]">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3 className="text-lg font-bold text-[#0d1b2e] tracking-tight">{f.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed font-light">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. FEATURED PROJECTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 md:py-36 bg-[#f7f5f0]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c] mb-4">
                Selected Works
              </p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#0d1b2e] leading-tight">
                Our finest developments.
              </h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em]
                         text-[#0d1b2e] pb-1 border-b border-[#0d1b2e] hover:border-[#c9a84c]
                         hover:text-[#c9a84c] transition-colors"
            >
              All Projects
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                id={p.id}
                title={p.title}
                slug={p.slug}
                location={p.location}
                status={p.status}
                heroImage={p.hero_image}
              />
            ))}
            {projects.length === 0 && (
              <p className="col-span-3 text-center py-16 text-sm text-neutral-400 font-light">
                Projects coming soon.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. TESTIMONIAL — dramatic dark quote block
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0d1b2e] py-32 md:py-48">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <div className="flex justify-center mb-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-[#c9a84c] fill-[#c9a84c]" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-4xl font-light text-white leading-relaxed tracking-tight mb-14">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#c9a84c]">
              {testimonial.author}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mt-2">
              {testimonial.role}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. FAQ — rendered only if there are entries in the database
      ══════════════════════════════════════════════════════════════════════ */}
      {faqs.length > 0 && (
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c] mb-4">
              Frequently Asked
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#0d1b2e] mb-16">
              Common questions.
            </h2>
            <div className="divide-y divide-neutral-200">
              {faqs.map((faq, i) => (
                <div key={i} className="py-8">
                  <h3 className="text-base font-bold text-[#0d1b2e] mb-3 tracking-tight">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed font-light">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          7. CONTACT FORM
      ══════════════════════════════════════════════════════════════════════ */}
      {cms.display_form && (
        <section className="py-24 bg-neutral-50 relative">
          <div className="container mx-auto px-6 md:px-12 max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-[#0d1b2e] tracking-tight mb-4">
                Get in Touch
              </h2>
              <p className="text-[#0d1b2e]/60 font-light">
                Fill out the form below and our team will get back to you shortly.
              </p>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">First Name</label>
                  <input type="text" className="w-full bg-white border border-neutral-200 p-4 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Last Name</label>
                  <input type="text" className="w-full bg-white border border-neutral-200 p-4 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
                <input type="email" className="w-full bg-white border border-neutral-200 p-4 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Message</label>
                <textarea rows={4} className="w-full bg-white border border-neutral-200 p-4 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-[#0d1b2e] hover:bg-[#162840] text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300">
                Send Message
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          8. CTA BANNER — gold closing strip
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#c9a84c] py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-[#0d1b2e] tracking-tight mb-2">
              Ready to find your home?
            </h2>
            <p className="text-[#0d1b2e]/60 font-light text-sm">
              Speak with our development team today.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-3 bg-[#0d1b2e] hover:bg-[#162840]
                       text-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em]
                       transition-colors duration-300"
          >
            Get in Touch
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  )
}