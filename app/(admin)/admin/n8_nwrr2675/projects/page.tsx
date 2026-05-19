'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Building,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ProjectsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>({ total: 0, pages: 1 })

  // Deletion Modal State
  const [projectToDelete, setProjectToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [searchQuery, statusFilter, typeFilter, page])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      let url = `/api/projects?search=${encodeURIComponent(searchQuery)}&page=${page}&limit=8`
      if (statusFilter) url += `&status=${statusFilter}`
      if (typeFilter) url += `&type=${typeFilter}`
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
        setMeta({ total: data.totalProjects, pages: data.totalPages })
      } else {
        toast.error(data.message || 'Failed to fetch projects')
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      toast.error('Server error fetching projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!projectToDelete) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Project deleted successfully')
        fetchProjects()
      } else {
        toast.error(data.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Server error deleting project')
    } finally {
      setDeleting(false)
      setProjectToDelete(null)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Real Estate Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Build and manage developments, property portfolios, and construction status
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/n8_nwrr2675/projects/new')}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-50 dark:hover:bg-blue-200 dark:text-slate-900 shadow-lg shadow-blue-200 dark:shadow-none font-bold h-11 px-6 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by title, location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="pl-10 rounded-xl border-slate-200 h-11 bg-white dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value)
            setPage(1)
          }}
          className="px-3.5 h-11 border border-slate-200 rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Project Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="mixed">Mixed Use</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="px-3.5 h-11 border border-slate-200 rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Project Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex items-center justify-end">
          <p className="text-sm font-bold text-slate-500">
            Found: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{meta.total}</span> projects
          </p>
        </div>
      </div>

      {/* Projects List Card */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <TableRow className="border-none">
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Project Info</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Location</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Type / Units</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Timeline</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Status</TableHead>
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse border-b border-slate-50 dark:border-slate-800">
                    <TableCell colSpan={6} className="px-8 py-7">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0"></div>
                        <div className="space-y-2 w-full">
                          <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                          <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={project.id} className="group hover:bg-slate-50/45 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/80">
                    {/* Project Title and Hero */}
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center">
                          {project.hero_image ? (
                            <img src={project.hero_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Briefcase className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span 
                            onClick={() => router.push(`/admin/n8_nwrr2675/projects/${project.id}`)}
                            className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer text-[15px]"
                          >
                            {project.title}
                          </span>
                          <p className="text-[11px] text-slate-400 font-bold font-mono uppercase tracking-tight mt-0.5">
                            slug: {project.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="py-5 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{project.location || 'Not Specified'}</span>
                      </div>
                    </TableCell>

                    {/* Type and Units */}
                    <TableCell className="py-5">
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-max rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50 font-black uppercase text-[9px] px-2 py-0.5">
                          {project.type || 'residential'}
                        </Badge>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                          Units: <strong className="text-slate-700 dark:text-slate-300">{project._count?.units || 0}</strong> in DB / {project.total_units || 'N/A'} total
                        </span>
                      </div>
                    </TableCell>

                    {/* Construction dates */}
                    <TableCell className="py-5">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(project.start_date)} - {formatDate(project.expected_completion)}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Timeline</span>
                      </div>
                    </TableCell>

                    {/* Project Status */}
                    <TableCell className="py-5">
                      {project.status === 'completed' ? (
                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-bold text-[10px] uppercase tracking-wider">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </div>
                      ) : project.status === 'ongoing' ? (
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider">
                          <Building className="w-4 h-4 animate-pulse" />
                          Ongoing
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 font-bold text-[10px] uppercase tracking-wider">
                          <AlertCircle className="w-4 h-4" />
                          Upcoming
                        </div>
                      )}
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => router.push(`/admin/n8_nwrr2675/projects/${project.id}`)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                          title="View Project Dashboard"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => router.push(`/admin/n8_nwrr2675/projects/${project.id}?tab=details`)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                          title="Edit Details"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setProjectToDelete(project)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Briefcase className="w-12 h-12 text-slate-200 dark:text-slate-800" />
                      <div>
                        <p className="text-slate-800 dark:text-slate-200 font-bold text-lg">No Projects Found</p>
                        <p className="text-slate-400 text-sm mt-0.5">Try adjusting your filters or create a new project development.</p>
                      </div>
                      <Button
                        onClick={() => router.push('/admin/n8_nwrr2675/projects/new')}
                        className="rounded-xl mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5"
                      >
                        Create First Project
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {meta.pages > 1 && (
            <div className="px-8 py-5 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-xl font-bold border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-500 font-mono">
                Page {page} of {meta.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(prev => Math.min(prev + 1, meta.pages))}
                disabled={page === meta.pages}
                className="rounded-xl font-bold border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Delete Project Development?</DialogTitle>
            <DialogDescription className="font-semibold text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to delete <span className="text-red-600 font-bold">{projectToDelete?.title}</span>? This action is permanent and will remove all properties and updates related to this development.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              disabled={deleting}
              onClick={() => setProjectToDelete(null)}
              className="rounded-xl font-bold border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              disabled={deleting}
              onClick={handleDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
