'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePage } from '@/hooks/pages/usePage'

/**
 * Legacy route: /admin/.../pages/[id]
 * Now resolves the page template and redirects to the dedicated editor:
 * /admin/.../pages/[id]/edit/[template]
 */
export default function PageEditorRedirect() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { template, loading } = usePage(id)

  useEffect(() => {
    if (!loading && template) {
      router.replace(`/admin/n8_nwrr2675/pages/${id}/edit/${template}`)
    }
  }, [loading, template, id])

  // Show a minimal spinner while resolving
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 gap-4">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin dark:border-white" />
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">
        Opening Editor…
      </p>
    </div>
  )
}
