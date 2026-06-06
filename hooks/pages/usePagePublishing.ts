'use client'

import { useState } from 'react'
import type { PageData } from './usePage'

export function usePagePublishing(page?: PageData | null) {
  const [status, setStatus] = useState<string>(page?.status ?? 'draft')

  const hydrate = (p: PageData) => {
    setStatus(p.status ?? 'draft')
  }

  const toggle = (checked: boolean) => {
    setStatus(checked ? 'published' : 'draft')
  }

  return {
    status,
    setStatus,
    toggle,
    hydrate,
    isPublished: status === 'published',
  }
}
