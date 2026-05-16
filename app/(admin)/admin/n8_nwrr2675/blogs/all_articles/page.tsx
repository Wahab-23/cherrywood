'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit, Trash2, Eye, BookOpen, User, Calendar, FileText, Layout, CheckCircle2, Clock } from 'lucide-react'

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<any>(null)

  useEffect(() => {
    fetchBlogs()
  }, [searchQuery])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blogs?search=${searchQuery}`)
      const data = await response.json()
      if (data.success) {
        setBlogs(data.data)
        setMeta({ total: data.totalBlogs, pages: data.totalPages })
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlog = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }
  const router = useRouter()
  // handle edit blog
  const handleEditBlog = (id: string) => {
    router.push(`/admin/n8_nwrr2675/blogs/${id}`)
  }

  const handleViewBlog = (id: string) => {
    router.push(`/blogs/${id}`)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Content Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Create, edit and publish articles for your audience</p>
        </div>
        <Button
          onClick={() => router.push(`/admin/n8_nwrr2675/blogs/new`)}
          className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none font-black h-11 px-6">
          <Plus className="w-5 h-5 mr-2" />
          Write New Blog
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">All Published Articles</CardTitle>
            <CardDescription className="font-medium text-slate-500 dark:text-slate-400">Total: <span className="text-blue-600 dark:text-blue-400 font-bold">{meta?.total || 0}</span> posts</CardDescription>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 h-10 bg-slate-50/50 focus:bg-white transition-all"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow className="border-b border-slate-50 dark:border-slate-800">
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Article Information</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Author</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Category</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Visibility</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Last Updated</TableHead>
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={6} className="px-8 py-8">
                      <div className="h-4 w-full bg-slate-100 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <TableRow key={blog.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800">
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {blog.hero_image ? (
                            <img src={blog.hero_image} alt={blog.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{blog.title}</p>
                          <p className="text-[11px] text-slate-400 font-bold truncate">ID: {blog.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                          {blog.author?.profile_image ? (
                            <img src={blog.author.profile_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{blog.author?.name || 'Unknown'}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Author</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50 font-black uppercase text-[9px] px-2 py-0.5">
                        {blog.category?.name || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {blog.status === 'published' ? (
                        <div className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] uppercase tracking-tight">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Live
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-400 dark:text-orange-500 font-bold text-[10px] uppercase tracking-tight">
                          <Clock className="w-3.5 h-3.5" />
                          Draft
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400 font-bold text-[11px] uppercase tracking-tight">
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-slate-200">
                          {new Date(blog.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-[9px] opacity-70">
                          {blog.status === 'published' 
                            ? (blog.published_at && new Date(blog.published_at) > new Date() ? 'Scheduled' : 'Published')
                            : 'Draft'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleViewBlog(blog.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEditBlog(blog.id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteBlog(blog.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="w-8 h-8 text-slate-200" />
                      <p className="text-slate-500 font-bold">No articles found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
