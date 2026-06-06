'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { COMPULSORY_PAGES } from '@/lib/pageConstants'

export interface PageData {
  id: string
  title: string
  slug: string
  template: string
  status: string
  content: string
  meta_title: string | null
  meta_description: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  faqs: string | null
  created_at: string
  updated_at: string
}

function resolveTemplate(page: PageData): string {
  const slug = (page.slug || '').toLowerCase()
  const compulsory = COMPULSORY_PAGES[slug]
  if (compulsory) return compulsory.template

  // Fallback: read template embedded in JSON content
  try {
    const parsed = JSON.parse(page.content || '')
    if (parsed?.template) return parsed.template
  } catch {
    // plain text content — default
  }
  return page.template || 'default'
}

export function usePage(id: string) {
  const router = useRouter()
  const [page, setPage] = useState<PageData | null>(null)
  const [template, setTemplate] = useState<string>('default')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const fetchPage = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/pages/${id}`)
        const data = await res.json()
        if (cancelled) return

        if (res.ok && data.success) {
          const resolved = resolveTemplate(data.data)
          setPage(data.data)
          setTemplate(resolved)
        } else {
          toast.error(data.error || 'Failed to load page')
          router.push('/admin/n8_nwrr2675/pages')
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e)
          toast.error('Unexpected error loading page')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPage()
    return () => { cancelled = true }
  }, [id])

  return { page, template, loading }
}
