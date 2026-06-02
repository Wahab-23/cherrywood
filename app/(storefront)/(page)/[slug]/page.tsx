import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Mail, Phone, Clock, MapPin, Briefcase, Heart, Shield, Scale, ArrowRight, Calendar, Sparkles, Compass, Hammer } from 'lucide-react'
import BlockNoteRenderer from "@/components/blocknote/BlockNoteRenderer";
import { ContactForm } from '@/components/storefront/ContactForm'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const record = await prisma.page.findUnique({ where: { slug } })
  if (!record) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'
  const canonical = `${siteUrl}/${slug}`
  const title = record.meta_title || record.title || 'Cherrywood'
  const description = record.meta_description || 'Cherrywood Architectural & Luxury Spaces'
  const ogImage = record.og_image || `${siteUrl}/building.png`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: record.og_title || title,
      description: record.og_description || description,
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

export default async function StorefrontPage({ params }: PageProps) {
  const { slug } = await params
  const page = await prisma.page.findUnique({ where: { slug } })

  if (!page || page.status !== 'published') {
    notFound()
  }

  // Parse FAQs
  let faqs: { question: string; answer: string }[] = []
  if (page.faqs) {
    try {
      faqs = JSON.parse(page.faqs)
    } catch {
      // Ignore
    }
  }

  // Determine template from content or slug
  let template = 'default'
  let data: any = {}

  if (slug === 'contact' || slug === 'contact-us') {
    template = 'contact'
  } else if (slug === 'careers') {
    template = 'careers'
  } else if (slug === 'terms' || slug === 'terms-and-conditions' || slug === 'privacy' || slug === 'privacy-policy') {
    template = 'policy'
  } else if (slug === 'journal' || slug === 'blogs' || slug === 'blog') {
    template = 'journal'
  } else if (slug === 'about' || slug === 'about-us') {
    template = 'about'
  }

  if (page.content) {
    try {
      const parsed = JSON.parse(page.content)
      if (parsed.template) {
        template = parsed.template
        data = parsed.data || {}
      }
    } catch {
      // Legacy or rich text
    }
  }

  // Fetch blogs for Journal template
  let journalArticles: any[] = []
  if (template === 'journal') {
    journalArticles = await prisma.blog.findMany({
      where: { status: 'published' },
      orderBy: { created_at: 'desc' }
    })
  }

  return (
    <div className="bg-[#fcfbf8] text-[#0d1b2e] min-h-screen pt-36 lg:pt-48 pb-20 selection:bg-[#0d1b2e] selection:text-white">
      {/* ──────────────────────────────────────────────────────────────────
          TEMPLATE 1: CONTACT DIRECTORY
      ────────────────────────────────────────────────────────────────── */}
      {template === 'contact' && (
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Reach Out</span>
            <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight text-[#0d1b2e]">
              {data.hero_title || page.title || 'Contact Our Advisory'}
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {data.hero_subtitle || 'Get in touch with Cherrywood real estate and design professionals.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact details */}
            <div className="lg:col-span-1 space-y-8 bg-[#0d1b2e] text-white p-8 rounded-3xl shadow-xl shadow-[#0d1b2e]/5">
              <h3 className="text-xl font-display text-[#c9a84c]">Concierge Desk</h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Our luxury advisors are available for spatial consultation, private previews, and investor inquiries.
              </p>

              <div className="space-y-6 pt-4 border-t border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Headquarters</span>
                    <span className="text-sm font-semibold block">{data.address_street || '100 Cherrywood Avenue'}</span>
                    <span className="text-xs text-slate-300 block">{data.address_city_state || 'New York, NY 10001'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Emails</span>
                    <span className="text-sm font-semibold block">Sales: {data.sales_email || 'concierge@cherrywood.com'}</span>
                    <span className="text-xs text-slate-300 block">Support: {data.support_email || 'support@cherrywood.com'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Call Us</span>
                    <span className="text-sm font-semibold block">{data.phone_number || '+1 (800) 555-0199'}</span>
                    <span className="text-xs text-slate-400 block">{data.office_hours || 'Mon-Fri: 9am-6pm EST'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department grid */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-display text-2xl font-light text-[#0d1b2e] pb-2 border-b border-neutral-100">Specific Advisories</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data.departments || []).map((dep: any, i: number) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <h4 className="font-bold text-slate-900 text-base">{dep.name || 'Advisory Line'}</h4>
                    <div className="mt-3 space-y-2 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dep.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dep.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Display default form right on the page */}
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-4 mt-6">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Submit spatial request</h4>
                </div>
                <ContactForm theme="light" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          TEMPLATE 2: CAREERS PAGE
      ────────────────────────────────────────────────────────────────── */}
      {template === 'careers' && (
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 space-y-20">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Join Cherrywood</span>
            <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight text-[#0d1b2e]">
              {data.hero_title || page.title || 'Shape the Future'}
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {data.hero_subtitle || 'Help us craft state-of-the-art living options and architectural masterpieces.'}
            </p>
          </div>

          {/* Perks Grid */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-[#0d1b2e] pb-2 border-b border-slate-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-500" /> Perks & Team Support
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(data.perks || []).map((perk: any, i: number) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:-translate-y-1 transition-all">
                  <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {perk.title}
                  </h4>
                  <p className="text-slate-500 font-semibold text-xs mt-2.5 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Positions */}
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-[#0d1b2e] pb-2 border-b border-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-500" /> Open Opportunities
            </h3>

            <div className="space-y-6">
              {(data.openings || []).map((job: any, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{job.department}</span>
                      <span className="text-xs bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{job.location}</span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{job.type}</span>
                    </div>
                    <h4 className="text-xl font-serif text-[#0d1b2e]">{job.title}</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed pt-1">
                      {job.description}
                    </p>
                  </div>

                  <a
                    href={`mailto:${job.apply_url || 'careers@cherrywood.com'}`}
                    className="self-start md:self-auto bg-[#0d1b2e] hover:bg-[#1a2d44] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-[#0d1b2e]/5"
                  >
                    Apply Now <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}

              {(!data.openings || data.openings.length === 0) && (
                <p className="text-slate-400 font-semibold text-center py-8">
                  We are not actively hiring, but we are always seeking creative spatial talent. Send a speculative portfolio to careers@cherrywood.com.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          TEMPLATE 3: POLICY & TERMS
      ────────────────────────────────────────────────────────────────── */}
      {template === 'policy' && (
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 space-y-12">
          <div className="max-w-4xl space-y-12">
            {/* Header */}
            <div className="space-y-4 border-b border-slate-100 pb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Policy</span>
              <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#0d1b2e] leading-tight">
                {page.title}
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Calendar className="w-4 h-4 text-slate-300" />
                <span>Last Revised: {data.last_updated || 'May 19, 2026'}</span>
              </div>
              {data.subtitle && (
                <p className="text-sm text-slate-500 font-semibold mt-2">{data.subtitle}</p>
              )}
            </div>

            {/* Legal content grid */}
            <div className="space-y-10">
              {(data.sections || []).map((sec: any, i: number) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-lg font-serif text-[#0d1b2e] font-bold">{sec.title}</h3>
                  <p className="text-sm text-slate-600 font-semibold leading-relaxed whitespace-pre-wrap">
                    {sec.content}
                  </p>
                </div>
              ))}

              {(!data.sections || data.sections.length === 0) && (
                <p className="text-slate-400 text-xs font-semibold">No clauses defined.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          TEMPLATE 4: JOURNAL / BLOG ARCHIVE FEED
      ────────────────────────────────────────────────────────────────── */}
      {template === 'journal' && (
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <span
              className="text-[10px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded bg-[#0d1b2e]/5 block w-fit"
              style={{ color: data.theme_color || '#d97706' }}
            >
              {data.tagline || 'CHERRYWOOD JOURNAL'}
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight text-[#0d1b2e]">
              {data.hero_title || page.title || 'The Cherrywood Journal'}
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {data.hero_subtitle || 'Perspectives on architecture, luxury spatial planning, and design thinking.'}
            </p>
          </div>

          {/* Grid Layouts */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}>
            {journalArticles.map((article: any) => (
              <div key={article.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                {article.cover_image && (
                  <div className="aspect-16/10 overflow-hidden relative bg-slate-100">
                    <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-all duration-700" />
                  </div>
                )}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h4 className="text-lg font-serif text-[#0d1b2e] leading-snug line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold line-clamp-3 leading-relaxed">
                      {article.summary || article.meta_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded text-slate-600 font-bold uppercase tracking-wider">
                      {article.category || 'Architecture'}
                    </span>
                    <a
                      href={`/journal/${article.slug}`}
                      className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all"
                      style={{ color: data.theme_color || '#0d1b2e' }}
                    >
                      Read Article <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {journalArticles.length === 0 && (
            <p className="text-slate-400 font-semibold text-center py-12">No publication records found in database.</p>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          TEMPLATE 5: ABOUT CHERRYWOOD
      ────────────────────────────────────────────────────────────────── */}
      {template === 'about' && (
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 space-y-24">

          {/* Header */}
          <div className="max-w-4xl space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a84c]">Our Origins</span>
            <h1 className="font-display text-5xl md:text-7xl font-light tracking-tight text-[#0d1b2e] leading-tight">
              Crafting sanctuaries of light, space, and structural purity.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-3xl">
              We are a design-led development firm focusing on state-of-the-art residential and commercial masterpieces.
            </p>
          </div>

          <div className="w-full h-px bg-slate-100" />

          {/* Core Story Two-Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-display text-3xl font-light text-[#0d1b2e] leading-tight">
                An unwavering dedication to the art of building.
              </h2>
              <div className="w-12 h-0.5 bg-amber-500" />
            </div>
            <div className="lg:col-span-7 space-y-6 text-slate-500 font-medium leading-relaxed text-sm md:text-base">
              <p>
                Founded on the belief that the spaces we inhabit shape our daily experience, Cherrywood was born to challenge the boundaries of luxury development. We treat every structure as a sculpture, balancing structural physics with organic elements.
              </p>
              <p>
                Our team collaborates with award-winning architects, master stonecarvers, and spatial consultants to execute plans that prioritize spatial flow, natural ventilation, and material honesty.
              </p>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="space-y-12 pt-12">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">OUR FOUNDATIONS</span>
              <h3 className="text-3xl font-serif text-[#0d1b2e] mt-2">Three guiding principles.</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Spatial Harmony', desc: 'We study daylight patterns and airflow to construct environments that elevate mood and energy, aligning architecture with nature.' },
                { title: 'Material Honesty', desc: 'We only use materials that age with grace. Raw stones, solid timber, and unlacquered metals that develop a character unique to their environment.' },
                { title: 'Artisanal Execution', desc: 'We partner directly with heritage workshops and independent makers, ensuring the details on every corner are crafted by hand.' }
              ].map((p, i) => (
                <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xs space-y-4">
                  <span className="block text-2xl font-serif text-amber-500/30">0{i + 1}</span>
                  <h4 className="text-lg font-bold text-slate-900">{p.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Content Fallback from CMS */}
          {page.content && page.content !== '[]' && page.content !== '""' && (
            <div className="pt-16 border-t border-slate-100 max-w-4xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Additional Notes</h4>
              <article className="prose prose-slate lg:prose-lg max-w-none prose-p:font-semibold prose-headings:font-serif prose-headings:text-[#0d1b2e] prose-a:text-[#0d1b2e] prose-strong:text-[#0d1b2e]">
                <BlockNoteRenderer data={page.content} />
              </article>
            </div>
          )}

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          TEMPLATE 6: DEFAULT RICH TEXT / DOCUMENT BODY
      ────────────────────────────────────────────────────────────────── */}
      {template === 'default' && (
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 space-y-12">
          <div className="max-w-4xl space-y-12">
            <div className="space-y-4 border-b border-slate-100 pb-8">
              <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight text-[#0d1b2e] leading-tight">
                {page.title}
              </h1>
            </div>

            <article className="prose prose-slate lg:prose-lg max-w-none prose-p:font-semibold prose-headings:font-serif prose-headings:text-[#0d1b2e] prose-a:text-[#0d1b2e] prose-strong:text-[#0d1b2e]">
              <BlockNoteRenderer data={page.content || ''} />
            </article>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          COLLAPSIBLE ACCORDION FAQ SECTION
      ────────────────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 xl:px-28 mt-24 pt-16 border-t border-slate-100 space-y-8">
          <div className="max-w-3xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">INQUIRIES</span>
              <h3 className="text-3xl font-serif text-[#0d1b2e]">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border border-slate-100 bg-white rounded-2xl p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden cursor-pointer"
                >
                  <summary className="flex items-center justify-between gap-1.5 focus:outline-none">
                    <h4 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug">{faq.question}</h4>
                    <span className="shrink-0 rounded-full bg-slate-50 p-1.5 text-slate-900 group-open:rotate-180 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-xs md:text-sm font-semibold leading-relaxed text-slate-500 border-t border-slate-50 pt-3">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
