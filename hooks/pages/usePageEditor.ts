'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { BlockNoteEditorRef } from '@/components/blocknote/blocknoteEditor'
import type { PageData } from './usePage'

export function usePageEditor(page: PageData | null, template: string) {
  const router = useRouter()
  const editorRef = useRef<BlockNoteEditorRef>(null)

  const [title, setTitle] = useState(page?.title ?? '')
  const [slug, setSlug] = useState(page?.slug ?? '')
  const [content, setContent] = useState(page?.content ?? '')
  const [faqs, setFaqs] = useState(page?.faqs ?? '[]')
  const [saving, setSaving] = useState(false)

  // Sync state when page data arrives (initial load)
  const hydrate = (p: PageData) => {
    setTitle(p.title ?? '')
    setSlug(p.slug ?? '')
    setContent(p.content ?? '')
    setFaqs(p.faqs ?? '[]')
  }

  const save = async (extras: {
    status: string
    metaTitle: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
    ogImage: string
  }) => {
    if (!title.trim()) {
      toast.error('Page Headline / Title is required')
      return false
    }
    if (!slug.trim()) {
      toast.error('URL Slug is required')
      return false
    }
    if (!page?.id) return false

    setSaving(true)
    try {
      // For BlockNote (default template) we pull content from the editor ref
      const editorContent =
        template === 'default' && editorRef.current
          ? await editorRef.current.getContent()
          : content

      const response = await fetch(`/api/pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          template,
          content: editorContent,
          faqs,
          status: extras.status,
          meta_title: extras.metaTitle || null,
          meta_description: extras.metaDescription || null,
          og_title: extras.ogTitle || extras.metaTitle || title || null,
          og_description: extras.ogDescription || extras.metaDescription || null,
          og_image: extras.ogImage || null,
        }),
      })

      const data = await response.json()
      if (response.ok && data.success) {
        toast.success('Page saved successfully!')
        router.push('/admin/n8_nwrr2675/pages')
        return true
      } else {
        toast.error(data.error || 'Failed to save page')
        return false
      }
    } catch (err) {
      console.error(err)
      toast.error('Server error saving page')
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    editorRef,
    title, setTitle,
    slug, setSlug,
    content, setContent,
    faqs, setFaqs,
    saving,
    hydrate,
    save,
  }
}
