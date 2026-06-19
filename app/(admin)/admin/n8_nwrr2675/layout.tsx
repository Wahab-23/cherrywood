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
  TrendingUp,
  Settings,
  ChevronRight,
  Bell,
  Image as ImageIcon,
  Mail,
  Database
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AdminLayoutWrapper } from '@/components/admin-layout-wrapper'
import { clearStoredUser, getStoredUser } from '@/lib/auth-context'
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
    const cachedUser = getStoredUser()
    if (cachedUser) {
      setUser(cachedUser)
    }
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignore errors — we're logging out regardless
    }
    clearStoredUser()
    router.push('/admin/login')
  }

  const hasPermission = (resource: string, action: string = 'read') => {
    if (!user) return false;
    if (user.roleName?.toLowerCase() === 'admin') return true;
    const access = user.access || {};
    const resourceAccess = access[resource];
    return resourceAccess === true || (Array.isArray(resourceAccess) && resourceAccess.includes(action));
  }

  const [openMenus, setOpenMenus] = useState<string[]>(['Dashboard'])

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/n8_nwrr2675/dashboard',
      children: [
        { href: '/admin/n8_nwrr2675/dashboard', label: 'Overview' },
        { href: '/admin/n8_nwrr2675/dashboard/insights', label: 'Insights' },
      ]
    },
    {
      label: 'Users Management',
      icon: Users,
      href: '/admin/n8_nwrr2675/users',
      resource: 'users',
      children: [
        { href: '/admin/n8_nwrr2675/users/list', label: 'All Users', resource: 'users', action: 'read' },
        { href: '/admin/n8_nwrr2675/users/new', label: 'Create User', resource: 'users', action: 'create' },
        { href: '/admin/n8_nwrr2675/users/roles', label: 'Roles', resource: 'roles', action: 'read' },
        { href: '/admin/n8_nwrr2675/users/permissions', label: 'permissions', resource: 'roles', action: 'update' },
      ]
    },
    {
      label: 'Blogs',
      icon: BookOpen,
      href: '/admin/n8_nwrr2675/blogs',
      resource: 'blogs',
      children: [
        { href: '/admin/n8_nwrr2675/blogs/all_articles', label: 'All Articles', resource: 'blogs', action: 'read' },
        { href: '/admin/n8_nwrr2675/blogs/new', label: 'Create New Article', resource: 'blogs', action: 'create' },
        { href: '/admin/n8_nwrr2675/blogs/categories', label: 'Manage Categories', resource: 'blogs', action: 'read' },
        { href: '/admin/n8_nwrr2675/blogs/new_category', label: 'Create New Category', resource: 'blogs', action: 'create' },
      ]
    },
    {
      label: 'Projects',
      icon: Briefcase,
      href: '/admin/n8_nwrr2675/projects',
      resource: 'projects',
      children: [
        { href: '/admin/n8_nwrr2675/projects', label: 'All Projects', resource: 'projects', action: 'read' },
        { href: '/admin/n8_nwrr2675/projects/new', label: 'Create Project', resource: 'projects', action: 'create' },
        { href: '/admin/n8_nwrr2675/units', label: 'Property Inventory', resource: 'units', action: 'read' },
      ]
    },
    { href: '/admin/n8_nwrr2675/pages', label: 'Pages', icon: FileText, resource: 'pages' },
    { href: '/admin/n8_nwrr2675/media', label: 'Media', icon: ImageIcon, resource: 'media' },
    { href: '/admin/n8_nwrr2675/inquiries', label: 'Inquiries', icon: Mail, resource: 'inquiries' },
  ]

  const secondaryNavItems = [
    { href: '/admin/n8_nwrr2675/profile', label: 'My Profile', icon: UserCircle },
    { href: '/admin/n8_nwrr2675/cache', label: 'Cache & State', icon: Database },
    { href: '/admin/n8_nwrr2675/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => pathname === href || (href !== '/admin/n8_nwrr2675/dashboard' && pathname.startsWith(href + '/'))
  const isParentActive = (item: any) => {
    if (item.href && isActive(item.href)) return true
    return item.children?.some((child: any) => isActive(child.href))
  }

  const toggleMenu = (label: string) => {
    setOpenMenus(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    )
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm transition-colors duration-300">
        {/* Logo/Brand */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
              <Box className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Cherrywood</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
          <div>
            <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
            <nav className="space-y-1.5">
              {navItems
                .filter(item => !item.resource || hasPermission(item.resource, 'read'))
                .map((item) => {
                  const Icon = item.icon
                  const active = isParentActive(item)
                  const filteredChildren = item.children?.filter((child: any) => !child.resource || hasPermission(child.resource, child.action || 'read'))
                  const hasChildren = filteredChildren && filteredChildren.length > 0
                  const isOpen = openMenus.includes(item.label)

                  return (
                    <div key={item.label} className="space-y-1">
                      {hasChildren ? (
                        <button
                          onClick={() => toggleMenu(item.label)}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
                            active
                              ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400'
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn("w-5 h-5", active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")} />
                            <span className="font-semibold text-sm">{item.label}</span>
                          </div>
                          <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-90")} />
                        </button>
                      ) : (
                        <Link
                          href={item.href!}
                          className={cn(
                            'flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
                            active
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn("w-5 h-5", active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")} />
                            <span className="font-semibold text-sm">{item.label}</span>
                          </div>
                          {active && <ChevronRight className="w-4 h-4" />}
                        </Link>
                      )}

                      {hasChildren && isOpen && (
                        <div className="ml-9 pl-4 border-l border-slate-100 dark:border-slate-800 space-y-1 mt-1">
                          {filteredChildren.map((child: any) => {
                            const childActive = isActive(child.href)
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  'block py-2 px-3 rounded-lg text-xs font-bold transition-colors',
                                  childActive
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                )}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
            </nav>
          </div>

          <div>
            <p className="px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Account</p>
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
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5", active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")} />
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
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden">
              {user?.profile_image ? (
                <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'A'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
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
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0 transition-colors duration-300">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {navItems.find(i => isActive(i.href))?.label ||
                secondaryNavItems.find(i => isActive(i.href))?.label ||
                'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <Link href="/admin/n8_nwrr2675/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tight">{user?.roleName || user?.role?.name || 'Administrator'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                )}
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
