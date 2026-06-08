import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import {
  MapPin,
  Calendar,
  Building2,
  Ruler,
  AlertCircle,
  Clock,
  ChevronLeft,
  ArrowRight
} from 'lucide-react'
import { ImageGalleryLightbox } from '@/components/storefront/lightbox'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywoodbuilders.com'
  const canonical = `${siteUrl}/projects/${slug}`
  const title = project.meta_title || project.title
  const description = project.meta_description || project.description || 'A premium Cherrywood development.'
  const ogImage = project.hero_image || `${siteUrl}/cherrywood-tower.png`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ select: { slug: true } })
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      units: {
        orderBy: { unit_number: 'asc' }
      },
      project_updates: {
        orderBy: { created_at: 'desc' },
        include: { images: true }
      }
    }
  })

  if (!project) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywoodbuilders.com'
  const availableUnits = project.units.filter(u => u.status === 'available').length
  const completionPercentage = project.project_updates.length > 0 ? project.project_updates[0].progress_percentage : 0

  const isCherrywoodTower = project.title?.toLowerCase().includes('cherrywood tower') || project.slug === 'cherrywood-tower'
  const isCommercial = !isCherrywoodTower && project.type?.toLowerCase().includes('commercial')
  const isResidential = !isCherrywoodTower && project.type?.toLowerCase().includes('residential')

  const unitSystemLabel = isCommercial ? 'Shops' : isResidential ? 'Apartments' : 'Properties'
  const singularLabel = isCommercial ? 'Shop' : isResidential ? 'Apartment' : 'Property'
  const sectionTitle = `Available ${unitSystemLabel}`

  const schemaType = isCommercial ? 'ShoppingCenter' : 'ApartmentComplex'

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: project.title,
      description: project.description || undefined,
      url: `${siteUrl}/projects/${project.slug}`,
      image: project.hero_image || undefined,
      address: project.location ? {
        '@type': 'PostalAddress',
        addressLocality: project.location,
        addressRegion: 'Karachi',
        addressCountry: 'PK',
      } : undefined,
      numberOfAvailableAccommodationUnits: availableUnits,
      numberOfAccommodationUnits: project.units.length || project.total_units || undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${siteUrl}/projects` },
        { '@type': 'ListItem', position: 3, name: project.title, item: `${siteUrl}/projects/${project.slug}` },
      ],
    },
  ]

  return (
    <div className="bg-[#fcfbf8] text-[#0d1b2e] min-h-screen selection:bg-[#0d1b2e] selection:text-white">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[75vh] w-full bg-[#0d1b2e]">
        {project.hero_image ? (
          <Image
            src={project.hero_image}
            alt={`${project.title} — ${project.location || 'Cherrywood luxury development'}`}
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-20 h-20 text-white/20" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#0d1b2e] via-[#0d1b2e]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 pb-16 space-y-6">
            <Link href="/projects" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to Portfolio
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              {project.status && (
                <span className="text-[9px] bg-[#c9a84c] text-[#0d1b2e] px-3 py-1 font-black uppercase tracking-widest">
                  {project.status}
                </span>
              )}
              {project.type && (
                <span className="text-[9px] border border-white/20 text-white/70 px-3 py-1 font-bold uppercase tracking-widest">
                  {project.type}
                </span>
              )}
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-light text-white tracking-tight">
              {project.title}
            </h1>

            {project.location && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-5 h-5 text-[#c9a84c]" />
                {project.location}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-16">

          {/* About Project */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-[#c9a84c]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Overview</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-light text-[#0d1b2e]">Vision &amp; Architecture</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-sm text-neutral-500 font-light leading-relaxed">{project.description || 'No description provided.'}</p>
            </div>
          </section>

          {/* Construction Updates */}
          {project.project_updates.length > 0 && (
            <section className="space-y-8 pt-10 border-t border-neutral-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-8 h-px bg-[#c9a84c]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Timeline</span>
              </div>
              <h2 className="font-display text-3xl font-light text-[#0d1b2e]">Development Progress</h2>

              <div className="space-y-6">
                {project.project_updates.map((update) => (
                  <div key={update.id} className="bg-white border border-neutral-100 p-6 md:p-8 space-y-3 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#c9a84c]">
                        {new Date(update.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      {update.progress_percentage !== null && (
                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 px-2.5 py-1">
                          {update.progress_percentage}% Completed
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg text-[#0d1b2e]">{update.title}</h3>
                    <p className="text-sm text-neutral-500 font-light leading-relaxed line-clamp-3">{update.description}</p>

                    {update.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {update.images.slice(0, 3).map(img => (
                          <div key={img.id} className="relative bg-neutral-100">
                            <ImageGalleryLightbox
                              images={[img.image_url]}
                              initialIndex={0}
                            >
                              <div
                                className="relative w-full bg-white border border-neutral-100 overflow-hidden cursor-zoom-in group"
                                aria-label="View floor plan"
                                role="button"
                                tabIndex={0}
                              >
                                <Image
                                  src={img.image_url}
                                  alt="Update snapshot"
                                  width={500}
                                  height={500}
                                  className="w-full h-32 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            </ImageGalleryLightbox>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Units Section */}
          <section className="space-y-8 pt-10 border-t border-neutral-100">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="block w-8 h-px bg-[#c9a84c]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">{isCommercial ? 'Commercial' : isResidential ? 'Residences' : 'Properties'}</span>
                </div>
                <h2 className="font-display text-3xl font-light text-[#0d1b2e]">{sectionTitle}</h2>
              </div>
            </div>

            {project.units.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  const uniqueTypesMap = new Map();

                  project.units.forEach((unit) => {
                    const typeSlug = unit.unit_number.toLowerCase().includes('type a')
                      ? 'type-a'
                      : unit.unit_number.toLowerCase().includes('type b')
                        ? 'type-b'
                        : unit.unit_number.toLowerCase().includes('type c')
                          ? 'type-c'
                          : unit.unit_number.toLowerCase().replace(/\s+/g, '-');

                    if (!uniqueTypesMap.has(typeSlug)) {
                      uniqueTypesMap.set(typeSlug, { ...unit, _typeSlug: typeSlug });
                    } else {
                      const currentStatus = uniqueTypesMap.get(typeSlug).status;
                      if (unit.status === 'available') {
                        uniqueTypesMap.get(typeSlug).status = 'available';
                      } else if (unit.status === 'limited' && currentStatus !== 'available') {
                        uniqueTypesMap.get(typeSlug).status = 'limited';
                      } else if (unit.status === 'booked' && currentStatus !== 'available' && currentStatus !== 'limited') {
                        uniqueTypesMap.get(typeSlug).status = 'booked';
                      }
                    }
                  });

                  return Array.from(uniqueTypesMap.values()).map((unit) => {
                    const typeSlug = unit._typeSlug;

                    return (
                      <div key={typeSlug} className="p-6 border border-neutral-100 bg-white flex flex-col justify-between hover:border-[#c9a84c]/30 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-lg text-[#0d1b2e] capitalize">
                              {
                                unit.unit_number.toLowerCase().includes('type')
                                  ? unit.unit_number
                                  : (unit.type || singularLabel)
                              }
                            </h4>
                          </div>
                          {unit.status === 'available' && (
                            <span className="text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider bg-green-50 text-green-700">
                              Available
                            </span>
                          )}
                          {unit.status === 'limited' && (
                            <span className="text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider bg-amber-50 text-amber-700">
                              Limited Stock Left
                            </span>
                          )}
                          {unit.status === 'booked' && (
                            <span className="text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider bg-blue-50 text-blue-700">
                              Booked
                            </span>
                          )}
                          {unit.status === 'sold' && (
                            <span className="text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider bg-neutral-100 text-neutral-500">
                              Sold Out
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
                          {unit.size_sqft && (
                            <div className="flex items-center gap-1.5">
                              <Ruler className="w-4 h-4 text-neutral-400" />
                              {unit.size_sqft} sq.ft.
                            </div>
                          )}
                          {unit.type && (
                            <div className="flex items-center gap-1.5 capitalize">
                              <Building2 className="w-4 h-4 text-neutral-400" />
                              {unit.type}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-end pt-4 border-t border-neutral-100">
                          <Link href={`/projects/${project.slug}/${typeSlug}`} className="text-[10px] font-black uppercase tracking-widest text-[#0d1b2e] hover:text-[#c9a84c] transition-colors flex items-center gap-1">
                            View Details <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )
                  });
                })()}
              </div>
            ) : (
              <div className="p-10 border border-neutral-200 border-dashed text-center">
                <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 font-semibold">{isCommercial ? 'Shop' : isResidential ? 'Apartment' : 'Property'} details will be released soon.</p>
              </div>
            )}
          </section>

        </div>

        {/* Sidebar Sticky Area */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">

            {/* Quick Stats Card */}
            <div className="bg-white border border-neutral-100 p-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 border-b border-neutral-100 pb-4">
                Project Overview
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Timeline</p>
                    <p className="text-sm font-semibold text-[#0d1b2e]">
                      {project.start_date ? new Date(project.start_date).getFullYear() : 'TBD'} - {project.expected_completion ? new Date(project.expected_completion).getFullYear() : 'TBD'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Scale</p>
                    <p className="text-sm font-semibold text-[#0d1b2e]">
                      {project.type || 'Premium Development'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Progress</p>
                      <span className="text-[10px] font-bold text-[#0d1b2e]">{completionPercentage || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full bg-[#c9a84c] transition-all duration-1000"
                        style={{ width: `${completionPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-[#0d1b2e] p-8 text-white">
              <h3 className="font-display text-2xl font-light mb-3">Register Interest</h3>
              <p className="text-sm text-white/50 font-light mb-6 leading-relaxed">
                Receive exclusive floor plans, pricing updates, and priority viewing invitations.
              </p>
              <Link href="/contact" className="block w-full text-center bg-[#c9a84c] hover:bg-[#b8973d] text-[#0d1b2e] py-4 text-[10px] font-black uppercase tracking-widest transition-colors">
                Contact Concierge
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
