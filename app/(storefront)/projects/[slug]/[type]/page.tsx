import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, BedDouble, Ruler, CheckCircle2 } from 'lucide-react'
import { ContactForm } from '@/components/storefront/ContactForm'
import { ImageGalleryLightbox } from '@/components/storefront/lightbox'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

// ─── Type Metadata Registry ────────────────────────────────────────────────────
type UnitTypeData = {
  label: string
  tagline: string
  description: string
  beds: number
  baths: number
  size: string
  layoutImage: string
  galleryImages: string[]
  features: string[]
  interest: string // maps to contact form select value
}

const unitTypeRegistry: Record<string, UnitTypeData> = {
  'type-a': {
    label: 'Type A — 3 Bedroom',
    tagline: 'Grand Living, Masterfully Crafted',
    description:
      'The Type A residence is our most expansive offering — a three-bedroom sanctuary designed for families who refuse to compromise. Floor-to-ceiling windows pour natural light across open-plan living areas. The closed kitchen features hand-selected onyx surfaces and premium German appliances. A sprawling master suite with an en-suite spa bathroom completes this unmatched residence.',
    beds: 3,
    baths: 2,
    size: '1,656 To 1,752 Sq.Ft.',
    layoutImage: '/uploads/homepage/type-a-3-bedroom-1780295250720.png',
    galleryImages: [
      '/uploads/homepage/spacious-lounge.webp',
      '/uploads/homepage/Lift-Lobby.webp',
      '/uploads/homepage/wide-hallway.webp',
      '/uploads/homepage/grand-lobby.webp',
    ],
    features: [
      'Panoramic double-glazed windows',
      'Closed kitchen with onyx surfaces',
      'Expansive private balcony',
      'Master suite with spa en-suite',
      'Guest bedroom with attached bath',
      'Dedicated drawing room',
      'Premium porcelain flooring',
      'Built-in wardrobes throughout',
    ],
    interest: 'type-a',
  },
  'type-b': {
    label: 'Type B — 2 Bedroom + Drawing',
    tagline: 'Refined Comfort with Dedicated Space',
    description:
      'The Type B residence balances generous living with intelligent design. A private drawing room provides a dedicated entertainment and retreat space separate from the main living area. Two full bedrooms, double-glazed windows, and contemporary bathrooms create a luxuriously liveable home for the discerning family or professional couple.',
    beds: 2,
    baths: 2,
    size: '1,248 To 1,328 Sq.Ft.',
    layoutImage: '/uploads/homepage/type-b-2-bedroom--drawing--1780295255906.png',
    galleryImages: [
      '/uploads/homepage/spacious-lounge.webp',
      '/uploads/homepage/wide-hallway.webp',
      '/uploads/homepage/Lift-Lobby.webp',
      '/uploads/homepage/grand-lobby.webp',
    ],
    features: [
      'Private dedicated drawing room',
      'Double-glazed floor-to-ceiling windows',
      'Two full bedrooms',
      'Two contemporary bathrooms',
      'Open-plan dining and lounge area',
      'Premium fitted kitchen',
      'Natural stone bathroom surfaces',
      'Ample built-in storage',
    ],
    interest: 'type-b',
  },
  'type-c': {
    label: 'Type C — 2 Bedroom + Lounge',
    tagline: 'Elegant Efficiency, Exceptional Value',
    description:
      'The Type C residence is an exercise in spatial refinement. A bright, open-plan central lounge draws the eye from entry to the full-width windows beyond. Two generously proportioned bedrooms, a contemporary bathroom, and a well-appointed kitchen make this an exceptional choice for young professionals and savvy investors seeking premium returns.',
    beds: 2,
    baths: 1,
    size: '916 To 1,016 Sq.Ft.',
    layoutImage: '/uploads/homepage/type-c-2-bedroom-1780295260924.png',
    galleryImages: [
      '/uploads/homepage/spacious-lounge.webp',
      '/uploads/homepage/Lift-Lobby.webp',
      '/uploads/homepage/grand-lobby.webp',
      '/uploads/homepage/wide-hallway.webp',
    ],
    features: [
      'Open-plan central lounge',
      'Two well-proportioned bedrooms',
      'Contemporary bathroom finishes',
      'Fitted kitchen with quality appliances',
      'Full-width natural light windows',
      'Porcelain-tiled floors throughout',
      'Private outdoor terrace/balcony',
      'High-speed fibre infrastructure',
    ],
    interest: 'type-c',
  },
}

type PageProps = {
  params: Promise<{
    slug: string
    type: string
  }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywoodbuilders.com'

// ─── Static Params (pre-render all known types) ────────────────────────────────
export function generateStaticParams() {
  return [
    { slug: 'cherrywood-tower', type: 'type-a' },
    { slug: 'cherrywood-tower', type: 'type-b' },
    { slug: 'cherrywood-tower', type: 'type-c' },
  ]
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, type } = await params
  const typeData = unitTypeRegistry[type]

  if (!typeData) return {}

  const projectName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const title = `${typeData.label} — ${projectName} | Cherrywood`
  const description = typeData.description.slice(0, 155) + '…'
  const canonical = `${siteUrl}/projects/${slug}/${type}`
  const ogImage = typeData.galleryImages[0] || `${siteUrl}/cherrywood-tower.png`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [{ url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`, width: 1200, height: 630, alt: typeData.label }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`],
    },
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default async function ApartmentTypePage({ params }: PageProps) {
  const { slug, type } = await params
  const typeData = unitTypeRegistry[type]

  // If type not in registry, show a clean 404-style fallback
  if (!typeData) {
    return (
      <div className="bg-[#fcfbf8] min-h-screen flex flex-col items-center justify-center text-center px-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c] mb-4">
          Apartment Type
        </span>
        <h1 className="text-4xl font-black text-[#0d1b2e] mb-4">Type Not Found</h1>
        <p className="text-neutral-500 text-sm mb-8">
          This apartment type doesn't exist or hasn't been listed yet.
        </p>
        <Link
          href={`/projects/${slug}`}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0d1b2e] border border-[#0d1b2e] px-6 py-3 hover:bg-[#0d1b2e] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Project
        </Link>
      </div>
    )
  }

  const allGallery = [...typeData.galleryImages]
  const projectName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      units: {
        orderBy: { unit_number: 'asc' }
      }
    }
  })

  const typeUnits = project?.units.filter((unit) => {
    const typeSlug = unit.unit_number.toLowerCase().includes('type a')
      ? 'type-a'
      : unit.unit_number.toLowerCase().includes('type b')
        ? 'type-b'
        : unit.unit_number.toLowerCase().includes('type c')
          ? 'type-c'
          : unit.unit_number.toLowerCase().replace(/\s+/g, '-');
    return typeSlug === type;
  }) ?? [];

  let overallStatus = 'available';
  if (typeUnits.length > 0) {
    if (typeUnits.some(u => u.status === 'available')) {
      overallStatus = 'available';
    } else if (typeUnits.some(u => u.status === 'limited')) {
      overallStatus = 'limited';
    } else if (typeUnits.some(u => u.status === 'booked')) {
      overallStatus = 'booked';
    } else {
      overallStatus = 'sold';
    }
  }

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Accommodation',
      name: typeData.label,
      description: typeData.description,
      numberOfBedrooms: typeData.beds,
      numberOfBathroomsTotal: typeData.baths,
      floorSize: { '@type': 'QuantitativeValue', value: typeData.size, unitCode: 'SQF' },
      image: typeData.galleryImages.map(img => img.startsWith('http') ? img : `${siteUrl}${img}`),
      url: `${siteUrl}/projects/${slug}/${type}`,
      containedInPlace: {
        '@type': 'ApartmentComplex',
        name: projectName,
        url: `${siteUrl}/projects/${slug}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${siteUrl}/projects` },
        { '@type': 'ListItem', position: 3, name: projectName, item: `${siteUrl}/projects/${slug}` },
        { '@type': 'ListItem', position: 4, name: typeData.label.split('—')[0].trim(), item: `${siteUrl}/projects/${slug}/${type}` },
      ],
    },
  ]

  return (
    <div className="bg-[#fcfbf8] text-[#0d1b2e] min-h-screen selection:bg-[#0d1b2e] selection:text-white">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* ── Premium Hero Header ────────────────────────────────────────────── */}
      <div className="bg-[#0d1b2e] pt-40 pb-20">
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-10 text-white/30 text-[10px] font-bold uppercase tracking-widest">
            <Link href="/projects" className="hover:text-[#c9a84c] transition-colors">Projects</Link>
            <span>/</span>
            <Link href={`/projects/${slug}`} className="hover:text-[#c9a84c] transition-colors capitalize">
              {slug.replace(/-/g, ' ')}
            </Link>
            <span>/</span>
            <span className="text-[#c9a84c]">{typeData.label.split('—')[0].trim()}</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            <span className="inline-block text-[9px] bg-[#c9a84c] text-[#0d1b2e] px-3 py-1.5 font-black uppercase tracking-widest">
              Apartment Type
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-light text-white tracking-tight leading-tight">
              {typeData.label}
            </h1>
            <p className="text-white/50 text-base font-light leading-relaxed max-w-xl">
              {typeData.tagline}
            </p>

            {/* Quick stats row */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/60">
                <BedDouble className="w-4 h-4 text-[#c9a84c]" />
                <span className="text-sm font-semibold">{typeData.beds} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Ruler className="w-4 h-4 text-[#c9a84c]" />
                <span className="text-sm font-semibold">{typeData.size}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {overallStatus === 'available' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse motion-reduce:animate-none inline-block" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Available</span>
                  </>
                )}
                {overallStatus === 'limited' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse motion-reduce:animate-none inline-block" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Limited Stock Left</span>
                  </>
                )}
                {overallStatus === 'booked' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Booked</span>
                  </>
                )}
                {overallStatus === 'sold' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-neutral-400 inline-block" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Sold Out</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* ── Left: Layout + Specs + Gallery ── */}
        <div className="lg:col-span-2 space-y-16">

          {/* Layout Plan */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-[#c9a84c]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Floor Plan</span>
            </div>
            <h2 className="font-display text-3xl font-light text-[#0d1b2e]">Layout Plan</h2>

            {/* Clickable layout plan */}
            <ImageGalleryLightbox
              images={[typeData.layoutImage]}
              initialIndex={0}
            >
              <div
                className="relative w-full bg-white border border-neutral-100 overflow-hidden cursor-zoom-in group"
                style={{ aspectRatio: '4/3' }}
              >
                <Image
                  src={typeData.layoutImage}
                  alt={typeData.label}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </ImageGalleryLightbox>
          </section>

          {/* Description */}
          <section className="space-y-6 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-[#c9a84c]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Overview</span>
            </div>
            <h2 className="font-display text-3xl font-light text-[#0d1b2e]">About This Apartment</h2>
            <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-2xl">{typeData.description}</p>
          </section>

          {/* Features */}
          <section className="space-y-6 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-[#c9a84c]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Features</span>
            </div>
            <h2 className="font-display text-3xl font-light text-[#0d1b2e]">Specifications & Finishes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {typeData.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white border border-neutral-100 hover:border-[#c9a84c]/30 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#0d1b2e] font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery */}
          <section className="space-y-6 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-[#c9a84c]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Gallery</span>
            </div>
            <h2 className="font-display text-3xl font-light text-[#0d1b2e]">Interior Showcase</h2>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              {typeData.galleryImages.map((img, i) => (
                <ImageGalleryLightbox
                  key={img}
                  images={allGallery}
                  initialIndex={i}
                >
                  <div
                    className="relative w-full bg-white border border-neutral-100 overflow-hidden cursor-zoom-in group"
                    style={{ aspectRatio: i === 0 ? '16/10' : '4/3' }}
                  >
                    <Image src={img} alt={typeData.label} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  </div>
                </ImageGalleryLightbox>
              ))}
            </div>
          </section>

        </div>

        {/* ── Right: Sticky Sidebar ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">

            {/* Quick specs card */}
            <div className="bg-white border border-neutral-100 p-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 border-b border-neutral-100 pb-4">
                Apartment Overview
              </h3>
              <div className="space-y-5">
                {[
                  { label: 'Type', value: typeData.label.split('—')[0].trim() },
                  { label: 'Bedrooms', value: `${typeData.beds} Bedrooms` },
                  { label: 'Bathrooms', value: `${typeData.baths} Bathroom${typeData.baths > 1 ? 's' : ''}` },
                  { label: 'Size', value: typeData.size },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{row.label}</span>
                    <span className="text-sm font-semibold text-[#0d1b2e]">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</span>
                  {overallStatus === 'available' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-50 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse motion-reduce:animate-none shrink-0" />
                      Available
                    </span>
                  )}
                  {overallStatus === 'limited' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse motion-reduce:animate-none shrink-0" />
                      Limited Stock Left
                    </span>
                  )}
                  {overallStatus === 'booked' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      Booked
                    </span>
                  )}
                  {overallStatus === 'sold' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-[#0d1b2e]">
              <div className="px-8 py-6 border-b border-white/10">
                <h3 className="font-display text-xl font-light text-white mb-1">Send an Enquiry</h3>
                <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold">
                  {typeData.label.split('—')[0].trim()}
                </p>
              </div>
              <ContactForm defaultInterest={typeData.interest} />
            </div>

            {/* Back link */}
            <Link
              href={`/projects/${slug}`}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-[#0d1b2e] transition-colors py-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back to {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>

          </div>
        </div>

      </div>
    </div>
  )
}
