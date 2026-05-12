'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Briefcase, 
  FileText, 
  Box, 
  LogOut, 
  UserCircle, 
  Settings,
  ChevronRight,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AdminLayoutWrapper } from '@/components/admin-layout-wrapper'
import { clearStoredAuth, getStoredAuth } from '@/lib/auth-context'
import { useState, useEffect } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayoutWrapper>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminLayoutWrapper>
  )
}

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const auth = getStoredAuth()
    if (auth) {
      setUser(auth.user)
    }
  }, [])

  const handleLogout = () => {
    setLoggingOut(true)
    clearStoredAuth()
    router.push('/admin/login')
  }

  const navItems = [
    { href: '/admin/n8_nwrr2675/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/n8_nwrr2675/users', label: 'Users', icon: Users },
    { href: '/admin/n8_nwrr2675/blogs', label: 'Blogs', icon: BookOpen },
    { href: '/admin/n8_nwrr2675/projects', label: 'Projects', icon: Briefcase },
    { href: '/admin/n8_nwrr2675/pages', label: 'Pages', icon: FileText },
    { href: '/admin/n8_nwrr2675/units', label: 'Units', icon: Box },
  ]

  const secondaryNavItems = [
    { href: '/admin/n8_nwrr2675/profile', label: 'My Profile', icon: UserCircle },
    { href: '/admin/n8_nwrr2675/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        {/* Logo/Brand */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Box className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cherrywood</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
          <div>
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
                      active
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5", active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-900")} />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-4 h-4" />}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Account</p>
            <nav className="space-y-1.5">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
                      active
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5", active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-900")} />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-4 h-4" />}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Footer User Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-bold text-sm">{loggingOut ? 'Logging out...' : 'Sign Out'}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {navItems.find(i => isActive(i.href))?.label || 
               secondaryNavItems.find(i => isActive(i.href))?.label || 
               'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 rounded-full">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <Link href="/admin/n8_nwrr2675/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{user?.role?.name || 'Administrator'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-slate-600" />
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
