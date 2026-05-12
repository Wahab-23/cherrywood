'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Users, 
  BookOpen, 
  Briefcase, 
  FileText, 
  Box, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MoreVertical,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getStoredAuth } from '@/lib/auth-context'

interface DashboardStats {
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down'
  icon: any
  color: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats[]>([
    { label: 'Total Users', value: '...', change: '+12%', trend: 'up', icon: Users, color: 'text-blue-600' },
    { label: 'Total Blogs', value: '...', change: '+5%', trend: 'up', icon: BookOpen, color: 'text-green-600' },
    { label: 'Active Projects', value: '...', change: '+2%', trend: 'up', icon: Briefcase, color: 'text-purple-600' },
    { label: 'Total Pages', value: '...', change: '0%', trend: 'up', icon: FileText, color: 'text-orange-600' },
    { label: 'Units Listed', value: '...', change: '+8%', trend: 'up', icon: Box, color: 'text-pink-600' },
  ])
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentBlogs, setRecentBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const auth = getStoredAuth()
      const headers = {
        'Authorization': `Bearer ${auth?.token}`
      }

      try {
        const [usersRes, blogsRes, projectsRes, pagesRes, unitsRes] = await Promise.all([
          fetch('/api/users?limit=5', { headers }),
          fetch('/api/blogs?limit=5', { headers }),
          fetch('/api/projects?limit=1', { headers }),
          fetch('/api/pages?limit=1', { headers }),
          fetch('/api/unit?limit=1', { headers }),
        ])

        const usersData = await usersRes.json()
        const blogsData = await blogsRes.json()
        const projectsData = await projectsRes.json()
        const pagesData = await pagesRes.json()
        const unitsData = await unitsRes.json()

        setStats([
          { label: 'Total Users', value: usersData.meta?.total || 0, change: '+12%', trend: 'up', icon: Users, color: 'text-blue-600' },
          { label: 'Total Blogs', value: blogsData.totalBlogs || 0, change: '+5%', trend: 'up', icon: BookOpen, color: 'text-green-600' },
          { label: 'Active Projects', value: projectsData.total || projectsData.meta?.total || 0, change: '+2%', trend: 'up', icon: Briefcase, color: 'text-purple-600' },
          { label: 'Total Pages', value: pagesData.total || pagesData.meta?.total || 0, change: '0%', trend: 'up', icon: FileText, color: 'text-orange-600' },
          { label: 'Units Listed', value: unitsData.total || unitsData.meta?.total || 0, change: '+8%', trend: 'up', icon: Box, color: 'text-pink-600' },
        ])

        setRecentUsers(usersData.data || [])
        setRecentBlogs(blogsData.data || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor your application performance and activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-bold">
            Download Report
          </Button>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold">
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform duration-300", stat.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className={cn(
                    "rounded-lg font-bold border-none",
                    stat.trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-8 py-6 border-b border-slate-50">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Recent Users</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Manage and view newly registered members</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-slate-900">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="px-8 py-5 animate-pulse flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-100 rounded"></div>
                        <div className="h-3 w-48 bg-slate-50 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="px-8 py-5 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
                        <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none rounded-lg font-bold">
                        {user.role?.name || 'User'}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-12 text-center">
                  <p className="text-slate-500 font-medium">No recent users found</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50/50 flex justify-center">
              <Button variant="ghost" className="text-blue-600 font-bold hover:text-blue-700 hover:bg-blue-50 rounded-xl">
                View All Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Secondary Data */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="px-6 py-6 border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                Latest Blogs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {loading ? (
                   Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-6 animate-pulse space-y-3">
                      <div className="h-4 w-full bg-slate-100 rounded"></div>
                      <div className="h-3 w-1/2 bg-slate-50 rounded"></div>
                    </div>
                  ))
                ) : recentBlogs.length > 0 ? (
                  recentBlogs.slice(0, 3).map((blog) => (
                    <div key={blog.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{blog.title}</h4>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                             <UserCircle className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="text-xs font-bold text-slate-500 uppercase">{blog.author?.name || 'Author'}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-none rounded-lg text-[10px] font-black uppercase">
                          {blog.status || 'Published'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 font-medium">No recent blogs</div>
                )}
              </div>
              <div className="p-4 bg-slate-50/50 flex justify-center">
                <Button variant="ghost" className="text-blue-600 font-bold hover:text-blue-700 hover:bg-blue-50 rounded-xl w-full">
                  All Articles
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-blue-600 rounded-2xl overflow-hidden text-white relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <TrendingUp className="w-32 h-32" />
             </div>
             <CardContent className="p-8 relative z-10">
                <h3 className="text-xl font-black mb-2">Growth Analytics</h3>
                <p className="text-blue-100 text-sm font-medium mb-6 leading-relaxed">
                  Your platform activity increased by <span className="text-white font-black underline">15%</span> this week. Keep up the great work!
                </p>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-xl w-full shadow-lg">
                  View Full Insights
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}

function UserCircle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  )
}
