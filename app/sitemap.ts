import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static storefront routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${base}/journal`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic project pages
  const projects = await prisma.project.findMany({
    select: { slug: true, updated_at: true },
  })

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: p.updated_at ?? new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  // Dynamic blog post pages
  const blogs = await prisma.blog.findMany({
    where: { status: 'published' },
    select: { slug: true, updated_at: true },
  })

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: b.updated_at ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Dynamic CMS pages (excluding admin-only / home)
  const pages = await prisma.page.findMany({
    where: {
      status: 'published',
      slug: { notIn: ['home'] },
    },
    select: { slug: true, updated_at: true },
  })

  const pageRoutes: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: p.updated_at ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...blogRoutes, ...pageRoutes]
}
