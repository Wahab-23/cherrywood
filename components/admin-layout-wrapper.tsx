'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearStoredUser, setStoredUser } from '@/lib/auth-context'

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Verify auth by checking the httpOnly cookie via API
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          // Refresh cached user info
          setStoredUser(data.user)
          setIsChecking(false)
        } else {
          // Cookie invalid or missing — redirect to login
          clearStoredUser()
          router.push('/admin/login')
        }
      })
      .catch(() => {
        clearStoredUser()
        router.push('/admin/login')
      })
  }, [router])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
