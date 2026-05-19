import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MapPin, ArrowRight, Building2 } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'

export const metadata: Metadata = {
  title: 'Our Projects',
  description: 'Explore our portfolio of luxury residential and commercial architecture — each development a masterclass in spatial design and structural excellence.',
  alternates: { canonical: `${siteUrl}/projects` },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/projects`,
    title: 'Our Projects | Cherrywood',
    description: 'Explore our portfolio of luxury residential and commercial architecture.',
    images: [{ url: `${siteUrl}/building.png`, width: 1200, height: 630, alt: 'Cherrywood Projects' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Projects | Cherrywood',
    description: 'Explore our portfolio of luxury residential and commercial architecture.',
    images: [`${siteUrl}/building.png`],
  },
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { created_at: 'desc' }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Cherrywood Projects',
    description: 'A curated portfolio of luxury residential and commercial architectural developments.',
    url: `${siteUrl}/projects`,
    hasPart: projects.map(p => ({
      '@type': 'ApartmentComplex',
      name: p.title,
      url: `${siteUrl}/projects/${p.slug}`,
      image: p.hero_image || undefined,
      address: p.location ? { '@type': 'PostalAddress', addressLocality: p.location } : undefined,
    })),
  }

  return (
    <div className="bg-[#fcfbfc] text-[#0d1b2e] min-h-screen pt-28 mt-16 pb-20 selection:bg-[#0d1b2e] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-6 space-y-16">

        {/* Header Section */}
        <div className="max-w-3xl space-y-4">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#c9a84c]">
            PORTFOLIO
          </span>
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-[#0d1b2e]">
            Architectural Masterpieces
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Discover our curated collection of visionary developments, where elevated design meets structural brilliance.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {projects.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.id} className="group block">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 shadow-sm transition-all duration-700">
                {project.hero_image ? (
                  <img
                    src={project.hero_image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <Building2 className="w-12 h-12 text-slate-400" />
                  </div>
                )}

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0d1b2e]/90 via-[#0d1b2e]/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    {project.status && (
                      <span className="text-[10px] bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                        {project.status}
                      </span>
                    )}
                    {project.type && (
                      <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">
                        {project.type}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-3xl font-serif text-white mb-2">{project.title}</h2>
                    {project.location && (
                      <div className="flex items-center gap-1.5 text-white/80 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-[#c9a84c]" />
                        {project.location}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Explore Project <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 border border-slate-200 border-dashed rounded-3xl bg-white">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">No architectural projects found.</p>
          </div>
        )}

      </div>
    </div>
  )
}
