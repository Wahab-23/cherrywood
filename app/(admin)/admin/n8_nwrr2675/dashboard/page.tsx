'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
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
  Plus,
  Globe,
  Layout,
  MousePointer2,
  Eye,
  Timer,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "#2563eb",
  },
  views: {
    label: "Views",
    color: "#6366f1",
  }
} satisfies ChartConfig

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
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('custom')
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, blogsRes, projectsRes, pagesRes, unitsRes] = await Promise.all([
          fetch('/api/users?limit=5'),
          fetch('/api/blogs?limit=5'),
          fetch('/api/projects?limit=1'),
          fetch('/api/pages?limit=1'),
          fetch('/api/unit?limit=1'),
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
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (period === 'custom' && date?.from && date?.to) {
          params.append('from', date.from.toISOString())
          params.append('to', date.to.toISOString())
        } else {
          params.append('period', period)
        }
        
        const analyticsRes = await fetch(`/api/analytics/stats?${params.toString()}`)
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      } catch (e) {
        console.error('Analytics fetch failed:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [period, date])

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Monitor your application performance and activities</p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
          <div className="mr-2 animate-in fade-in slide-in-from-right-2 duration-300">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Live Site Analytics</h2>
            <Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-none font-bold px-3 py-1">
              {period === '24h' ? 'Last 24 Hours' : period === '7d' ? 'Last 7 Days' : period === '30d' ? 'Last 30 Days' : 'Custom Range'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Unique Visitors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Page Views</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Visitors</p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{loading ? '...' : analytics?.visitors || 0}</h4>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pageviews</p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{loading ? '...' : analytics?.pageViews || 0}</h4>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Duration</p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{loading ? '...' : formatDuration(analytics?.avgDuration || 0)}</h4>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conv. Rate</p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{loading ? '...' : analytics?.conversionRate || 0}%</h4>
                  </div>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <AreaChart data={analytics?.trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      className="text-slate-400 font-bold text-[10px] uppercase"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        if (period === '24h') {
                          return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                        }
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      className="text-slate-400 font-bold text-[10px]"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="var(--color-visitors)"
                      fill="url(#colorVisitors)"
                      strokeWidth={3}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                  <Layout className="w-4 h-4 text-blue-500" />
                  Top Performing Content
                </h3>
                <div className="space-y-4">
                  {analytics?.topPages?.slice(0, 4).map((page: any, i: number) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px] uppercase tracking-tight">{page.url}</span>
                        <span className="text-slate-900 dark:text-white">{page.views} views</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(page.views / (analytics?.topPages?.[0]?.views || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-green-500" />
                  Acquisition Channels
                </h3>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-400">Direct Traffic: 85%</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1 font-bold">Inferred from current sessions</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-blue-600 dark:bg-blue-900/30 rounded-2xl overflow-hidden p-8 flex flex-col items-center justify-center text-center h-full relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-48 h-48 text-white" />
              </div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 text-white border border-white/20 shadow-xl">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-xs font-bold text-blue-100 dark:text-blue-400 uppercase tracking-widest">Conversion Success</h3>
              <h2 className="text-6xl font-black text-white mt-2 tracking-tighter">{loading ? '...' : (analytics?.conversionRate || 0)}%</h2>
              <p className="text-xs text-blue-100/70 dark:text-blue-400/70 mt-8 max-w-[180px] font-medium leading-relaxed">
                Real-time conversion tracking for leads and interactions across all pages.
              </p>
              <Button variant="secondary" className="mt-10 bg-white text-blue-600 hover:bg-blue-50 border-none rounded-2xl font-black h-12 w-full shadow-2xl">
                Deep Dive Report
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-8 py-6 border-b border-slate-50 dark:border-slate-800">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Recent Users</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Manage and view newly registered members</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
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
                recentUsers.map((user: any) => (
                  <div key={user.id} className="px-8 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border-none rounded-lg font-bold">
                        {user.role?.name || 'User'}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-12 text-center">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No recent users found</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 flex justify-center border-t border-slate-50 dark:border-slate-800">
              <Button variant="ghost" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl">
                View All Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Secondary Data */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardHeader className="px-6 py-6 border-b border-slate-50 dark:border-slate-800">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-500" />
                Latest Blogs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-6 animate-pulse space-y-3">
                      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-1/2 bg-slate-50 dark:bg-slate-800/50 rounded"></div>
                    </div>
                  ))
                ) : recentBlogs.length > 0 ? (
                  recentBlogs.slice(0, 3).map((blog: any) => (
                    <div key={blog.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{blog.title}</h4>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <UserCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          </div>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{blog.author?.name || 'Author'}</span>
                        </div>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-none rounded-lg text-[10px] font-black uppercase">
                          {blog.status || 'Published'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">No recent blogs</div>
                )}
              </div>
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 flex justify-center border-t border-slate-50 dark:border-slate-800">
                <Button variant="ghost" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl w-full">
                  All Articles
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-blue-600 rounded-2xl overflow-hidden text-white relative group">
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300", stat.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className={cn(
                    "rounded-lg font-bold border-none",
                    stat.trend === 'up' ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{loading ? '...' : stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
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
