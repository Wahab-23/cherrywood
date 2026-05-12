'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredAuth, clearStoredAuth } from '@/lib/auth-context'

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const auth = getStoredAuth()
    
    if (!auth) {
      // No token found, redirect to login
      clearStoredAuth()
      router.push('/admin/login')
    } else {
      setIsChecking(false)
    }
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
