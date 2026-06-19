'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, RefreshCw, Trash2, Loader2, ShieldAlert, CheckCircle, BarChart3, HelpCircle } from 'lucide-react'

export default function CacheManagementPage() {
  const [loading, setLoading] = useState(false)
  const [fetchingStats, setFetchingStats] = useState(true)
  const [stats, setStats] = useState<any>({
    pages: 0,
    projects: 0,
    units: 0,
    updates: 0,
    blogs: 0,
    inquiries: 0,
    sessions: 0,
  })
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const fetchStats = async () => {
    setFetchingStats(true)
    try {
      const res = await fetch('/api/admin/cache')
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (err) {
      console.error("Failed to fetch system stats", err)
    } finally {
      setFetchingStats(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleAction = async (action: string) => {
    if (action !== 'clear-cache') {
      const confirmAction = confirm(`Are you absolutely sure you want to perform this action? This will permanently delete records from the database.`)
      if (!confirmAction) return
    }

    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ text: data.message || "Action completed successfully.", type: 'success' })
        fetchStats()
      } else {
        setMessage({ text: data.error || "An error occurred.", type: 'error' })
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to execute action.", type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
          <Database className="w-9 h-9 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Cache & State</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Clear compiled pages cache and manage global application database states</p>
        </div>
      </div>

      {/* Message feedback */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400' 
            : 'bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-semibold">{message.text}</p>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Pages', val: stats.pages, bg: 'from-blue-500 to-indigo-500' },
          { label: 'Active Projects', val: stats.projects, bg: 'from-violet-500 to-purple-500' },
          { label: 'Property Inventory', val: stats.units, bg: 'from-amber-500 to-orange-500' },
          { label: 'Inquiries Received', val: stats.inquiries, bg: 'from-emerald-500 to-teal-500' },
        ].map((s, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative group">
            <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${s.bg}`} />
            <CardHeader className="p-5 pb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">{s.label}</span>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {fetchingStats ? (
                <div className="h-9 flex items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
                </div>
              ) : (
                <p className="text-3xl font-black text-slate-900 dark:text-white">{s.val}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: Cache Actions */}
        <div className="md:col-span-2 space-y-6">
          {/* Clear Storefront Cache */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                Cache Revalidation
              </CardTitle>
              <CardDescription>Purge the compiled static storefront pages</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Next.js caches pages statically in production to load instantly. If backend updates aren't appearing on the storefront (e.g. homepage layouts, project details, or NOC lists), force-clear the compiled static page cache.
              </p>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-900 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">What routes will be cleared?</p>
                  <p>• Homepage (`/`)</p>
                  <p>• Project Portfolio (`/projects`)</p>
                  <p>• Project Detail pages (`/projects/[slug]`)</p>
                  <p>• Custom pages (e.g., about, privacy, contact)</p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => handleAction('clear-cache')}
                  disabled={loading}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 font-bold shadow-lg shadow-blue-200 dark:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Clear Storefront Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database State Actions */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Database State Actions
              </CardTitle>
              <CardDescription>Reset temporary states or clear system logs</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Clear Analytics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="space-y-1 max-w-lg">
                  <p className="text-base font-bold text-slate-900 dark:text-white">Reset Visitors &amp; Analytics Data</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Removes all entries in `AnalyticsSession`, `AnalyticsPageView`, and `AnalyticsEvent` tables. Active tracking counters will reset.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleAction('clear-analytics')}
                  disabled={loading}
                  className="rounded-xl shrink-0 font-bold"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Analytics ({stats.sessions})
                </Button>
              </div>

              {/* Clear Customer Inquiries */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <p className="text-base font-bold text-slate-900 dark:text-white">Clear Customer Inquiries</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Delete all user registration/inquiry entries submitted on the storefront contact forms.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleAction('clear-inquiries')}
                  disabled={loading}
                  className="rounded-xl shrink-0 font-bold"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Inquiries ({stats.inquiries})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Status Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-slate-900 dark:bg-slate-900 rounded-2xl overflow-hidden text-white relative">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
              <Database className="w-48 h-48" />
            </div>
            <CardHeader className="p-6 pb-2 border-b border-white/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Live State Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-slate-400 font-semibold">Active Blogs</span>
                <span className="font-bold">{stats.blogs}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-slate-400 font-semibold">Project Updates</span>
                <span className="font-bold">{stats.updates}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-slate-400 font-semibold">Analytics Sessions</span>
                <span className="font-bold">{stats.sessions}</span>
              </div>
              <div className="pt-2">
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-2">Next.js Health Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400">On-Demand Cache Ready</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
