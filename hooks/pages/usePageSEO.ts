'use client'

import { useState } from 'react'
import type { PageData } from './usePage'

export function usePageSEO(page?: PageData | null) {
  const [metaTitle, setMetaTitle] = useState(page?.meta_title ?? '')
  const [metaDescription, setMetaDescription] = useState(page?.meta_description ?? '')
  const [ogTitle, setOgTitle] = useState(page?.og_title ?? '')
  const [ogDescription, setOgDescription] = useState(page?.og_description ?? '')
  const [ogImage, setOgImage] = useState(page?.og_image ?? '')

  const hydrate = (p: PageData) => {
    setMetaTitle(p.meta_title ?? '')
    setMetaDescription(p.meta_description ?? '')
    setOgTitle(p.og_title ?? '')
    setOgDescription(p.og_description ?? '')
    setOgImage(p.og_image ?? '')
  }

  return {
    metaTitle, setMetaTitle,
    metaDescription, setMetaDescription,
    ogTitle, setOgTitle,
    ogDescription, setOgDescription,
    ogImage, setOgImage,
    hydrate,
    // Flat object for passing to save()
    seoValues: { metaTitle, metaDescription, ogTitle, ogDescription, ogImage },
  }
}
