import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { MapPin, ArrowRight, Building2 } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywoodbuilders.com'

export const metadata: Metadata = {
  title: 'Our Projects',
  description: 'Explore our portfolio of premium residential and commercial developments — each project an architectural landmark designed for luxury living.',
  alternates: { canonical: `${siteUrl}/projects` },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/projects`,
    title: 'Our Projects | Cherrywood Builders',
    description: 'Explore our portfolio of premium residential and commercial developments.',
    images: [{ url: `${siteUrl}/cherrywood-tower.png`, width: 1200, height: 630, alt: 'Cherrywood Projects' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Projects | Cherrywood Builders',
    description: 'Explore our portfolio of premium residential and commercial developments.',
    images: [`${siteUrl}/cherrywood-tower.png`],
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
    <div className="bg-[#fcfbf8] text-[#0d1b2e] min-h-screen selection:bg-[#0d1b2e] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <div className="relative bg-[#0d1b2e] pt-40 pb-24 lg:pt-48 lg:pb-32">
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="block w-8 h-px bg-[#c9a84c]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">
                Portfolio
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-tight tracking-tight">
              Our <em>Developments</em>
            </h1>
            <p className="text-base text-white/40 font-light leading-relaxed max-w-lg">
              Discover our curated collection of visionary developments, where elevated design meets structural brilliance.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link href={`/projects/${project.slug}`} key={project.id} className="group block">
              <div className="relative h-[350px] md:h-[450px] overflow-hidden bg-[#0d1b2e]">
                {project.hero_image ? (
                  <Image
                    src={project.hero_image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-white/20" />
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2e] via-[#0d1b2e]/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    {project.status && (
                      <span className="text-[9px] bg-[#c9a84c] text-[#0d1b2e] px-3 py-1 font-black uppercase tracking-widest">
                        {project.status}
                      </span>
                    )}
                    {project.type && (
                      <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest">
                        {project.type}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-3xl md:text-4xl font-light text-white">{project.title}</h2>
                  
                  {project.location && (
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <MapPin className="w-4 h-4 text-[#c9a84c]" />
                      {project.location}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pt-2">
                    Explore Project <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 border border-neutral-200 border-dashed bg-white">
            <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 font-semibold">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
