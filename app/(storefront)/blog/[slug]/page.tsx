import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react'
import BlockNoteRenderer from '@/components/blocknote/BlockNoteRenderer'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { category: true, author: true }
  })
  if (!blog) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'
  const canonical = `${siteUrl}/blog/${slug}`
  const title = blog.meta_title || blog.title
  const description = blog.meta_description || blog.short_description || 'Perspectives on architecture, luxury spatial planning, and design thinking.'
  const ogImage = blog.hero_image || `${siteUrl}/building.png`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      publishedTime: blog.published_at?.toISOString(),
      authors: blog.author?.name ? [blog.author.name] : undefined,
      tags: [blog.category.name, 'luxury real estate', 'architecture'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true
    }
  })

  if (!blog || blog.status !== 'published') {
    notFound()
  }

  // Calculate estimated reading time
  let wordCount = 0
  if (blog.content) {
    try {
      // Check if BlockNote content
      const parsed = JSON.parse(blog.content)
      wordCount = JSON.stringify(parsed).split(/\s+/).length
    } catch {
      wordCount = blog.content.split(/\s+/).length
    }
  }
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.short_description || undefined,
    image: blog.hero_image || undefined,
    url: `${siteUrl}/blog/${blog.slug}`,
    datePublished: blog.published_at?.toISOString(),
    dateModified: blog.updated_at?.toISOString(),
    author: blog.author ? {
      '@type': 'Person',
      name: blog.author.name || 'Cherrywood Staff',
    } : {
      '@type': 'Organization',
      name: 'Cherrywood',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cherrywood',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${blog.slug}` },
    articleSection: blog.category.name,
  }

  return (
    <div className="bg-[#fcfbfc] text-[#0d1b2e] min-h-screen pt-28 pb-20 selection:bg-[#0d1b2e] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-6 space-y-10">

        {/* Back Link */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
            <span className="bg-amber-50 border border-amber-200/50 text-[#c9a84c] px-3 py-1 rounded-full uppercase tracking-wider">
              {blog.category.name}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-300" />
              <span>
                {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-300" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0d1b2e] leading-tight tracking-tight">
            {blog.title}
          </h1>

          {blog.short_description && (
            <p className="text-lg text-slate-500 font-medium leading-relaxed border-l-2 border-amber-500 pl-4 py-1">
              {blog.short_description}
            </p>
          )}
        </div>

        {/* Cover Image */}
        {blog.hero_image && (
          <div className="aspect-21/9 rounded-3xl overflow-hidden bg-slate-100 shadow-sm">
            <img
              src={blog.hero_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-slate lg:prose-lg max-w-none prose-p:font-semibold prose-headings:font-serif prose-headings:text-[#0d1b2e] prose-a:text-[#0d1b2e] prose-strong:text-[#0d1b2e] pt-6">
          <BlockNoteRenderer data={blog.content || ''} />
        </div>

        {/* Author Bio Area */}
        {blog.author && (
          <div className="mt-16 pt-10 border-t border-slate-100 flex items-start gap-4">
            {blog.author.profile_image ? (
              <img
                src={blog.author.profile_image}
                alt={blog.author.name || 'Author'}
                className="w-12 h-12 rounded-full object-cover bg-slate-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#c9a84c]">
                <User className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Published By</p>
              <h4 className="font-bold text-slate-900 text-sm">{blog.author.name || 'Cherrywood Staff'}</h4>
              {blog.author.bio && (
                <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">{blog.author.bio}</p>
              )}
            </div>
          </div>
        )}

      </article>
    </div>
  )
}
