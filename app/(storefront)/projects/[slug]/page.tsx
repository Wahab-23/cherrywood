import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MapPin, Calendar, Building2, Ruler, Tag, CheckCircle2, AlertCircle, Clock, ChevronLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'
  const canonical = `${siteUrl}/projects/${slug}`
  const title = project.meta_title || project.title
  const description = project.meta_description || project.description || 'A premium Cherrywood development.'
  const ogImage = project.hero_image || `${siteUrl}/building.png`

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'
  const availableUnits = project.units.filter(u => u.status === 'available').length
  const completionPercentage = project.project_updates.length > 0 ? project.project_updates[0].progress_percentage : 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    name: project.title,
    description: project.description || undefined,
    url: `${siteUrl}/projects/${project.slug}`,
    image: project.hero_image || undefined,
    address: project.location ? {
      '@type': 'PostalAddress',
      addressLocality: project.location,
    } : undefined,
    numberOfAvailableAccommodationUnits: availableUnits,
    numberOfAccommodationUnits: project.units.length || project.total_units || undefined,
  }

  return (
    <div className="bg-[#fcfbfc] text-[#0d1b2e] min-h-screen selection:bg-[#0d1b2e] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[75vh] w-full bg-slate-900">
        {project.hero_image ? (
          <img
            src={project.hero_image}
            alt={`${project.title} — ${project.location || 'Cherrywood luxury development'}`}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0d1b2e]">
            <Building2 className="w-20 h-20 text-white/20" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#0d1b2e] via-[#0d1b2e]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 pb-16 space-y-6">
            <Link href="/projects" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to Portfolio
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              {project.status && (
                <span className="text-[10px] bg-amber-500 text-[#0d1b2e] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                  {project.status}
                </span>
              )}
              {project.type && (
                <span className="text-[10px] border border-white/20 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  {project.type}
                </span>
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight">
              {project.title}
            </h1>

            {project.location && (
              <div className="flex items-center gap-2 text-white/80 text-lg font-medium">
                <MapPin className="w-5 h-5 text-[#c9a84c]" />
                {project.location}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-16">

          {/* About Project */}
          <section className="space-y-6">
            <h2 className="text-3xl font-serif text-[#0d1b2e]">Vision & Architecture</h2>
            <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600">
              <p className="whitespace-pre-wrap">{project.description || 'No description provided.'}</p>
            </div>
          </section>

          {/* Construction Updates */}
          {project.project_updates.length > 0 && (
            <section className="space-y-8 pt-10 border-t border-slate-200">
              <h2 className="text-3xl font-serif text-[#0d1b2e]">Development Timeline</h2>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {project.project_updates.map((update, idx) => (
                  <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    </div>

                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#c9a84c] text-[10px] uppercase tracking-widest">
                          {new Date(update.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                        {update.progress_percentage !== null && (
                          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                            {update.progress_percentage}% Completed
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg text-[#0d1b2e] mb-2">{update.title}</h3>
                      <p className="text-sm font-medium text-slate-500 line-clamp-3">{update.description}</p>

                      {update.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {update.images.slice(0, 3).map(img => (
                            <img key={img.id} src={img.image_url} alt="Update snapshot" className="w-full h-16 object-cover rounded-lg" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Units Inventory */}
          <section className="space-y-8 pt-10 border-t border-slate-200">
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-serif text-[#0d1b2e]">Available Units</h2>
              <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {availableUnits} / {project.units.length} Available
              </span>
            </div>

            {project.units.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.units.map((unit) => (
                  <div key={unit.id} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between hover:border-amber-200 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-black text-xl text-[#0d1b2e]">Unit {unit.unit_number}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Floor: {unit.floor || 'N/A'}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${unit.status === 'available' ? 'bg-green-50 text-green-700' :
                          unit.status === 'booked' ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-100 text-slate-500'
                        }`}>
                        {unit.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-600 mb-6">
                      {unit.size_sqft && (
                        <div className="flex items-center gap-1.5">
                          <Ruler className="w-4 h-4 text-slate-400" />
                          {unit.size_sqft} sq.ft.
                        </div>
                      )}
                      {unit.type && (
                        <div className="flex items-center gap-1.5 capitalize">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {unit.type}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="font-serif text-xl text-[#0d1b2e]">
                        {unit.price ? `$${Number(unit.price).toLocaleString()}` : 'Price on Request'}
                      </div>
                      {unit.status === 'available' && (
                        <Link href={`/contact?unit=${unit.unit_number}&project=${project.slug}`} className="text-xs font-bold text-amber-600 uppercase tracking-widest hover:text-amber-700">
                          Inquire
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 border border-slate-200 border-dashed rounded-3xl text-center">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold">Unit inventory details will be released soon.</p>
              </div>
            )}
          </section>

        </div>

        {/* Sidebar Sticky Area */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">

            {/* Quick Stats Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-100 pb-4">
                Project Overview
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-50">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Timeline</p>
                    <p className="text-sm font-semibold text-[#0d1b2e]">
                      {project.start_date ? new Date(project.start_date).getFullYear() : 'TBD'} - {project.expected_completion ? new Date(project.expected_completion).getFullYear() : 'TBD'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-50">
                    <Building2 className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scale</p>
                    <p className="text-sm font-semibold text-[#0d1b2e]">
                      {project.total_units || project.units.length} Total Units
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-50">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</p>
                      <span className="text-[10px] font-bold text-[#0d1b2e]">{completionPercentage || 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0d1b2e] rounded-full transition-all duration-1000"
                        style={{ width: `${completionPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-[#0d1b2e] rounded-3xl p-8 shadow-xl text-white">
              <h3 className="text-2xl font-serif mb-3">Register Interest</h3>
              <p className="text-sm text-white/70 font-medium mb-6">
                Receive exclusive floor plans, pricing updates, and priority viewing invitations.
              </p>
              <Link href="/contact" className="block w-full text-center bg-[#c9a84c] hover:bg-[#b8973d] text-[#0d1b2e] py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                Contact Concierge
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
