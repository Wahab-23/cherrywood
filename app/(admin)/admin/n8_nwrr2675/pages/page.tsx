'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, Eye, Globe } from 'lucide-react'
import { TEMPLATE_LABELS, isCompulsory, COMPULSORY_PAGES } from '@/lib/pageConstants'

export default function PagesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState<any[]>([])

  // Delete modal states
  const [pageToDelete, setPageToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pages')
      const data = await res.json()
      if (res.ok && data.success) {
        setPages(data.data || [])
      } else {
        toast.error('Failed to load static pages inventory')
      }
    } catch (e) {
      console.error(e)
      toast.error('Unexpected error loading static pages')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePage = async () => {
    if (!pageToDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/pages/${pageToDelete.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(`Static page "${pageToDelete.title}" deleted successfully`)
        setPageToDelete(null)
        fetchPages()
      } else {
        toast.error(data.error || 'Failed to delete static page')
      }
    } catch (e) {
      console.error(e)
      toast.error('Server error deleting static page')
    } finally {
      setDeleting(false)
    }
  }

  // Filter pages locally based on search
  const filteredPages = pages.filter((page) => {
    const term = searchQuery.toLowerCase()
    return (
      page.title?.toLowerCase().includes(term) ||
      page.slug?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Static Pages</h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-1">Manage marketing, support, legal policies, and platform information pages</p>
        </div>
        <Button
          onClick={() => router.push('/admin/n8_nwrr2675/pages/new')}
          className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 shadow-md font-bold h-11 px-6 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Page
        </Button>
      </div>

      {/* Pages Card Container */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Active Content Pages</CardTitle>
            <CardDescription className="font-semibold">
              Manage website metadata, content structure, and deployment status. Total: <span className="text-blue-600 font-bold">{filteredPages.length}</span>
            </CardDescription>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search pages by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 h-10 bg-slate-50/50 focus:bg-white transition-all font-semibold"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
            <TableRow className="border-none">
              <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Title</TableHead>
              <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Slug Path</TableHead>
              <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Layout Template</TableHead>
              <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Status</TableHead>
              <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Last Updated</TableHead>
              <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={6} className="px-8 py-6">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredPages.length > 0 ? (
              filteredPages.map((page) => (
                <TableRow key={page.id} className="border-b border-slate-50 dark:border-slate-800/80 transition-colors hover:bg-slate-50/45 dark:hover:bg-slate-800/30">
                  <TableCell className="px-8 py-4 font-extrabold text-[15px] text-slate-950 dark:text-white">
                    {page.title}
                  </TableCell>
                  <TableCell className="py-4 font-semibold text-slate-500 dark:text-slate-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      /{page.slug}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 font-semibold text-[13px] text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2 py-1 rounded">
                        {TEMPLATE_LABELS[page.template || 'default'] || page.template || 'Rich Text'}
                      </span>
                      {isCompulsory(page.slug || '') && (
                        <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900">
                          System
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={
                      page.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 border-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400 border-yellow-200'
                    }>
                      {page.status || 'draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                    {new Date(page.updated_at || page.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/n8_nwrr2675/pages/${page.id}/edit/${page.template || 'default'}`)}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {!isCompulsory(page.slug || '') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPageToDelete(page)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Globe className="w-10 h-10 text-slate-200" />
                    <p className="text-slate-800 dark:text-slate-200 font-bold">No static pages found</p>
                    <p className="text-slate-400 text-xs mt-0.5">Click "Create New Page" to deploy your first static policy page.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ─── MODAL DIALOG: DELETE PAGE CONFIRM ─────────────────────────────── */}
      <Dialog open={!!pageToDelete} onOpenChange={(open) => !open && setPageToDelete(null)}>
            <DialogContent className="max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Delete static page?</DialogTitle>
                <DialogDescription className="font-semibold text-slate-500 mt-2">
                  Are you sure you want to permanently delete <span className="text-red-600 font-bold">"{pageToDelete?.title}"</span>? This will take the page down immediately and remove it from search engines.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  disabled={deleting}
                  onClick={() => setPageToDelete(null)}
                  className="rounded-xl font-bold border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeletePage}
                  disabled={deleting}
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold px-5"
                >
                  {deleting ? 'Deleting...' : 'Delete permanently'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        )
}
