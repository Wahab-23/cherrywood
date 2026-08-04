'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  ArrowLeft,
  Building,
  MapPin,
  Box,
  Activity,
  Info,
  Plus,
  Edit,
  Trash2,
  User,
  Clock,
  Save,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Video
} from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/admin/MultiImageUpload'

export default function ProjectDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { id } = useParams() as { id: string }
  const defaultTab = searchParams.get('tab') || 'details'

  // Loading states
  const [projectLoading, setProjectLoading] = useState(true)
  const [unitsLoading, setUnitsLoading] = useState(false)
  const [updatesLoading, setUpdatesLoading] = useState(false)

  // Entities states
  const [project, setProject] = useState<any>(null)
  const [units, setUnits] = useState<any[]>([])
  const [updates, setUpdates] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  // Tab 1: Project Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('residential')
  const [status, setStatus] = useState('upcoming')
  const [startDate, setStartDate] = useState('')
  const [expectedCompletion, setExpectedCompletion] = useState('')
  const [totalUnits, setTotalUnits] = useState('')
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [savingDetails, setSavingDetails] = useState(false)

  // Tab 2: Unit Modal states
  const [unitToDelete, setUnitToDelete] = useState<any>(null)

  // Tab 3: Update Modal states
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [updateToDelete, setUpdateToDelete] = useState<any>(null)
  const [editingUpdate, setEditingUpdate] = useState<any>(null)
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateDescription, setUpdateDescription] = useState('')
  const [updatePercentage, setUpdatePercentage] = useState('')
  const [updateVisibility, setUpdateVisibility] = useState('public')
  const [updateImages, setUpdateImages] = useState<string[]>([])
  const [updateVideoUrl, setUpdateVideoUrl] = useState('')
  const [savingUpdate, setSavingUpdate] = useState(false)

  // ─── Initial Loading ────────────────────────────────────────────────────────
  useEffect(() => {
    if (id) {
      fetchProject()
      fetchUsers()
    }
  }, [id])

  const fetchProject = async () => {
    setProjectLoading(true)
    try {
      const res = await fetch(`/api/projects/${id}`)
      const data = await res.json()
      if (data.success) {
        const proj = data.data
        setProject(proj)

        // Prefill form
        setTitle(proj.title || '')
        setSlug(proj.slug || '')
        setLocation(proj.location || '')
        setType(proj.type || 'residential')
        setStatus(proj.status || 'upcoming')
        setStartDate(proj.start_date ? proj.start_date.substring(0, 10) : '')
        setExpectedCompletion(proj.expected_completion ? proj.expected_completion.substring(0, 10) : '')
        setTotalUnits(proj.total_units ? String(proj.total_units) : '')
        setHeroImage(proj.hero_image || null)
        setDescription(proj.description || '')
        setMetaTitle(proj.meta_title || '')
        setMetaDescription(proj.meta_description || '')
      } else {
        toast.error(data.error || 'Project not found')
        router.push('/admin/n8_nwrr2675/projects')
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to load project details')
    } finally {
      setProjectLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users?limit=100')
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
      }
    } catch (e) {
      console.error('Failed to load buyers list:', e)
    }
  }

  const fetchUnits = async () => {
    setUnitsLoading(true)
    try {
      const res = await fetch(`/api/unit?project_id=${id}&limit=10`)
      if (!res.ok) {
        console.error(`Failed to fetch units: status ${res.status}`)
        toast.error(`Failed to fetch units (${res.status})`)
        return
      }
      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Failed to fetch units: expected JSON response")
        toast.error("Failed to fetch units: invalid response format")
        return
      }
      const data = await res.json()
      if (data.success) {
        setUnits(data.data)
      } else {
        toast.error(data.message || 'Failed to fetch units')
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to fetch units list')
    } finally {
      setUnitsLoading(false)
    }
  }

  const fetchUpdates = async () => {
    setUpdatesLoading(true)
    try {
      const res = await fetch(`/api/project-updates?project_id=${id}`)
      const data = await res.json()
      if (data.success) {
        setUpdates(data.data)
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to load progress updates')
    } finally {
      setUpdatesLoading(false)
    }
  }

  // ─── Tab 1 Actions: Save details ──────────────────────────────────────────
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) {
      toast.error('Title and Slug are required')
      return
    }

    setSavingDetails(true)
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          location: location || null,
          type,
          status,
          start_date: startDate || null,
          expected_completion: expectedCompletion || null,
          total_units: totalUnits ? Number(totalUnits) : null,
          hero_image: heroImage,
          description: description || null,
          meta_title: metaTitle || null,
          meta_description: metaDescription || null,
        })
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Project details updated successfully!')
        setProject(data.data)
      } else {
        toast.error(data.error || 'Failed to update details')
      }
    } catch (e) {
      console.error(e)
      toast.error('Server error saving project details')
    } finally {
      setSavingDetails(false)
    }
  }

  // ─── Tab 2 Actions: Units CRUD ─────────────────────────────────────────────
  const openAddUnitModal = () => {
    router.push(`/admin/n8_nwrr2675/units/new?project_id=${id}`)
  }

  const openEditUnitModal = (unit: any) => {
    router.push(`/admin/n8_nwrr2675/units/${unit.id}/edit?project_id=${id}`)
  }

  const handleDeleteUnit = async () => {
    if (!unitToDelete) return
    try {
      const res = await fetch(`/api/unit/${unitToDelete.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Unit removed from inventory')
        setUnitToDelete(null)
        fetchUnits()
      } else {
        toast.error(data.error || 'Failed to delete unit')
      }
    } catch (e) {
      console.error(e)
      toast.error('Server error deleting unit')
    }
  }

  // ─── Tab 3 Actions: Updates CRUD ───────────────────────────────────────────
  const openAddUpdateModal = () => {
    setEditingUpdate(null)
    setUpdateTitle('')
    setUpdateDescription('')
    setUpdatePercentage('')
    setUpdateVisibility('public')
    setUpdateImages([])
    setUpdateVideoUrl('')
    setUpdateModalOpen(true)
  }

  const openEditUpdateModal = (upd: any) => {
    setEditingUpdate(upd)
    setUpdateTitle(upd.title || '')
    setUpdateDescription(upd.description || '')
    setUpdatePercentage(upd.progress_percentage ? String(upd.progress_percentage) : '')
    setUpdateVisibility(upd.visibility || 'public')
    setUpdateImages(upd.images ? upd.images.map((img: any) => img.image_url) : [])
    setUpdateVideoUrl(upd.video_url || '')
    setUpdateModalOpen(true)
  }

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!updateTitle.trim()) {
      toast.error('Title is required')
      return
    }

    setSavingUpdate(true)
    try {
      const payload = {
        project_id: id,
        title: updateTitle,
        description: updateDescription || null,
        progress_percentage: updatePercentage ? Number(updatePercentage) : null,
        visibility: updateVisibility,
        images: updateImages,
        video_url: updateVideoUrl || null,
      }

      let res, data
      if (editingUpdate) {
        res = await fetch(`/api/project-updates/${editingUpdate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/project-updates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      data = await res.json()
      if (data.success) {
        toast.success(editingUpdate ? 'Construction milestone updated!' : 'Progress update published!')
        setUpdateModalOpen(false)
        fetchUpdates()
      } else {
        toast.error(data.error || 'Failed to save progress update')
      }
    } catch (e) {
      console.error(e)
      toast.error('Server error saving update')
    } finally {
      setSavingUpdate(false)
    }
  }

  const handleDeleteUpdate = async () => {
    if (!updateToDelete) return
    try {
      const res = await fetch(`/api/project-updates/${updateToDelete.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Progress milestone deleted')
        setUpdateToDelete(null)
        fetchUpdates()
      } else {
        toast.error(data.error || 'Failed to delete update')
      }
    } catch (e) {
      console.error(e)
      toast.error('Server error deleting update')
    }
  }

  // Format monetary value
  const formatPrice = (priceVal: any) => {
    if (!priceVal) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(Number(priceVal))
  }

  if (projectLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-112.5 gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-sm">Loading Project Command Center...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/admin/n8_nwrr2675/projects')}
            className="rounded-xl border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{project.title}</h1>
              <Badge className={
                project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 border-green-200' :
                  project.status === 'ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-950/20 dark:text-orange-400 border-orange-200'
              }>
                {project.status}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs mt-1 flex items-center gap-3.5">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project.location || 'No Location'}</span>
              <span className="flex items-center gap-1 capitalize"><Building className="w-3.5 h-3.5" /> {project.type || 'residential'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-850 p-1.5 rounded-xl h-auto flex w-max gap-1">
          <TabsTrigger value="details" className="rounded-lg font-bold text-xs px-4.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Sliders className="w-4 h-4 mr-2" />
            Project Settings
          </TabsTrigger>
          <TabsTrigger value="units" onClick={fetchUnits} className="rounded-lg font-bold text-xs px-4.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Box className="w-4 h-4 mr-2" />
            Inventory ({units.length || project._count?.units || 0})
          </TabsTrigger>
          <TabsTrigger value="timeline" onClick={fetchUpdates} className="rounded-lg font-bold text-xs px-4.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Activity className="w-4 h-4 mr-2" />
            Construction Updates
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: DETAILS & SETTINGS ────────────────────────────────────── */}
        <TabsContent value="details" className="mt-0">
          <form onSubmit={handleSaveDetails} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* General Form */}
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
                <CardHeader className="border-b border-slate-50 dark:border-slate-800 px-8 py-5">
                  <CardTitle className="text-[17px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" /> General Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Title</Label>
                      <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border-slate-200 h-11 font-semibold" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-slate-500">Slug (URL)</Label>
                      <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} className="rounded-xl border-slate-200 h-11 font-mono text-xs font-semibold" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</Label>
                      <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl border-slate-200 h-11 font-semibold" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-slate-500">Development Type</Label>
                      <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3.5 h-11 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="mixed">Mixed Use</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</Label>
                      <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3.5 h-11 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-xs font-bold uppercase tracking-wider text-slate-500">Launch Date</Label>
                      <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl border-slate-200 h-11 font-semibold" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedCompletion" className="text-xs font-bold uppercase tracking-wider text-slate-500">Expected Completion</Label>
                      <Input id="expectedCompletion" type="date" value={expectedCompletion} onChange={(e) => setExpectedCompletion(e.target.value)} className="rounded-xl border-slate-200 h-11 font-semibold" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalUnits" className="text-xs font-bold uppercase tracking-wider text-slate-500">Planned Units Count</Label>
                      <Input id="totalUnits" type="number" value={totalUnits} onChange={(e) => setTotalUnits(e.target.value)} className="rounded-xl border-slate-200 h-11 font-semibold" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-500">Detailed Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl border-slate-200 min-h-36 font-semibold" />
                  </div>
                </CardContent>
              </Card>

              {/* SEO Specs */}
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
                <CardHeader className="border-b border-slate-50 dark:border-slate-800 px-8 py-5">
                  <CardTitle className="text-[17px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" /> Search Engine Optimization (SEO)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle" className="text-xs font-bold uppercase tracking-wider text-slate-500">Meta Title</Label>
                    <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="rounded-xl border-slate-200 h-11 font-semibold" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription" className="text-xs font-bold uppercase tracking-wider text-slate-500">Meta Description</Label>
                    <Textarea id="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="rounded-xl border-slate-200 min-h-24 font-semibold text-xs" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* Image Showcase Card */}
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-50 dark:border-slate-800 px-8 py-5">
                  <CardTitle className="text-[17px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-600" /> Project Showcase Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ImageUpload
                    mode="single"
                    value={heroImage}
                    onChange={(url) => setHeroImage(url)}
                    uploadPath="projects"
                  />
                </CardContent>
              </Card>

              {/* Action Save Box */}
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Save Modifications</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                  Apply updates to the database records instantly. Make sure details represent the latest portfolio specifications.
                </p>
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={savingDetails}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 dark:shadow-none"
                  >
                    <Save className="w-4 h-4" />
                    {savingDetails ? 'Saving Changes...' : 'Save Specifications'}
                  </Button>
                </div>
              </Card>
            </div>
          </form>
        </TabsContent>

        {/* ─── TAB 2: INVENTORY & PROPERTY UNITS ────────────────────────────── */}
        <TabsContent value="units" className="mt-0 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Properties Inventory</h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Manage property units, sizing, pricing, and book status.</p>
            </div>
            <Button
              onClick={openAddUnitModal}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5"
            >
              <Plus className="w-4.5 h-4.5 mr-2" /> Add Property Unit
            </Button>
          </div>

          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                  <TableRow className="border-none">
                    <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Unit #</TableHead>
                    <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Floor / Sizing</TableHead>
                    <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Type</TableHead>
                    <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Price</TableHead>
                    <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Status</TableHead>
                    <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Owner</TableHead>
                    <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unitsLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell colSpan={7} className="px-8 py-6">
                          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : units.length > 0 ? (
                    units.map((unit) => (
                      <TableRow key={unit.id} className="border-b border-slate-50 dark:border-slate-800/80 hover:bg-slate-50/45 dark:hover:bg-slate-800/30">
                        <TableCell className="px-8 py-4 font-extrabold text-[15px] text-slate-950 dark:text-white">
                          Unit {unit.unit_number}
                        </TableCell>
                        <TableCell className="py-4 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                          {unit.floor || 'N/A'} floor · <strong className="text-slate-900 dark:text-slate-200">{unit.size_sqft || 'N/A'}</strong> sqft
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50 font-black uppercase text-[9px] px-2 py-0.5">
                            {unit.type || 'apartment'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 font-bold text-slate-900 dark:text-slate-100 text-[14px]">
                          {formatPrice(unit.price)}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={
                            unit.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400 border-green-200' :
                              unit.status === 'sold' ? 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 border-red-200' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400 border-yellow-200'
                          }>
                            {unit.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          {unit.owner ? (
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{unit.owner.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-semibold">—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditUnitModal(unit)}
                              className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setUnitToDelete(unit)}
                              className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Box className="w-10 h-10 text-slate-200" />
                          <p className="text-slate-800 dark:text-slate-200 font-bold">No property units in inventory</p>
                          <p className="text-slate-400 text-xs mt-0.5">Click "Add Property Unit" to register the first inventory unit.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 3: PROGRESS & TIMELINE updates ───────────────────────────── */}
        <TabsContent value="timeline" className="mt-0 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Construction timeline milestones</h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Post developments, completion levels, and milestone photos.</p>
            </div>
            <Button
              onClick={openAddUpdateModal}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5"
            >
              <Plus className="w-4.5 h-4.5 mr-2" /> Write Progress Update
            </Button>
          </div>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4.5 pl-8 space-y-10">
            {updatesLoading ? (
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="relative animate-pulse space-y-2">
                  <div className="absolute -left-12.5 top-0 w-8 h-8 bg-slate-100 rounded-full"></div>
                  <div className="h-4 w-1/3 bg-slate-100 rounded"></div>
                  <div className="h-3 w-1/4 bg-slate-100 rounded"></div>
                </div>
              ))
            ) : updates.length > 0 ? (
              updates.map((upd) => (
                <div key={upd.id} className="relative group">

                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="px-8 py-5 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-[16px] font-bold text-slate-950 dark:text-white">{upd.title}</CardTitle>
                          <Badge variant="outline" className="rounded-lg text-[9px] uppercase font-bold py-0.5 px-2">
                            {upd.visibility || 'public'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> By {upd.creator?.name || 'Admin'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(upd.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* edit / delete update */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditUpdateModal(upd)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setUpdateToDelete(upd)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-5">
                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-300 text-[14px] font-semibold leading-relaxed">
                        {upd.description || 'No description notes.'}
                      </p>

                      {/* Percentage progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-tight">
                          <span>Construction Completion level</span>
                          <span className="text-blue-600 dark:text-blue-400 font-extrabold">{upd.progress_percentage ?? 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${upd.progress_percentage ?? 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Photo Gallery */}
                      {upd.images && upd.images.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Milestone Gallery</span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
                            {upd.images.map((img: any) => (
                              <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/80 group bg-slate-100 flex items-center justify-center">
                                <img src={img.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                                <a
                                  href={img.image_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                                >
                                  Fullscreen
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="relative">
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Activity className="w-10 h-10 text-slate-200" />
                    <p className="text-slate-800 dark:text-slate-200 font-bold">No progress milestones recorded</p>
                    <p className="text-slate-400 text-xs">Record foundation work, roofing, structure completions, etc., to keep buyers updated.</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── MODAL DIALOG: DELETE UNIT CONFIRM ─────────────────────────────── */}
      <Dialog open={!!unitToDelete} onOpenChange={(open) => !open && setUnitToDelete(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Delete unit from inventory?</DialogTitle>
            <DialogDescription className="font-semibold text-slate-500 mt-2">
              Are you sure you want to remove <span className="text-red-600 font-bold">Unit {unitToDelete?.unit_number}</span>? This inventory listing will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setUnitToDelete(null)} className="rounded-xl font-bold border-slate-200 dark:border-slate-700">Cancel</Button>
            <Button onClick={handleDeleteUnit} className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold">Delete permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL DIALOG: ADD/EDIT UPDATE PROGRESS ────────────────────────── */}
      <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
        <DialogContent className="max-w-3xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSaveUpdate}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                {editingUpdate ? 'Modify Construction Progress update' : 'Publish Progress Update'}
              </DialogTitle>
              <DialogDescription className="font-semibold text-slate-400">
                Log structure milestones, percentage completion updates, and photo galleries.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="updTitle" className="text-xs font-bold uppercase tracking-wider text-slate-500">Update Title *</Label>
                  <Input id="updTitle" placeholder="e.g. Concrete slab foundation pouring complete" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} className="rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="updPercent" className="text-xs font-bold uppercase tracking-wider text-slate-500">Completion Level (0-100%)</Label>
                  <Input id="updPercent" type="number" placeholder="e.g. 25" min="0" max="100" value={updatePercentage} onChange={(e) => setUpdatePercentage(e.target.value)} className="rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="updDesc" className="text-xs font-bold uppercase tracking-wider text-slate-500">Details & construction Notes</Label>
                  <Textarea id="updDesc" placeholder="Write logs about material quality, team updates, timeline shifts, structural specs..." value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} className="rounded-xl min-h-24" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="updVis" className="text-xs font-bold uppercase tracking-wider text-slate-500">Visibility</Label>
                  <select id="updVis" value={updateVisibility} onChange={(e) => setUpdateVisibility(e.target.value)} className="w-full px-3.5 h-10 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700">
                    <option value="public">Public (Visible to all)</option>
                    <option value="private">Private (Staff only)</option>
                  </select>
                </div>
              </div>

              {/* Video URL */}
              <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                <Label htmlFor="updVideo" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" /> Video URL (optional)
                </Label>
                <Input
                  id="updVideo"
                  type="url"
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                  value={updateVideoUrl}
                  onChange={(e) => setUpdateVideoUrl(e.target.value)}
                  className="rounded-xl font-mono text-xs"
                />
                <p className="text-[11px] text-slate-400 font-semibold">Paste a YouTube, Vimeo, or direct video URL to embed it in this update.</p>
              </div>

              {/* Progress Images */}
              <div className="space-y-2 pt-4">
                <ImageUpload
                  mode="multi"
                  value={updateImages}
                  onChange={(urls) => setUpdateImages(urls)}
                  uploadPath="project_updates"
                  maxImages={12}
                />
              </div>
            </div>
            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                disabled={savingUpdate}
                onClick={() => setUpdateModalOpen(false)}
                className="rounded-xl font-bold border-slate-200"
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={savingUpdate}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
              >
                {savingUpdate ? 'Saving Update...' : 'Publish Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL DIALOG: DELETE UPDATE CONFIRM ───────────────────────────── */}
      <Dialog open={!!updateToDelete} onOpenChange={(open) => !open && setUpdateToDelete(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Delete Construction milestone?</DialogTitle>
            <DialogDescription className="font-semibold text-slate-500 mt-2">
              Are you sure you want to remove <span className="text-red-600 font-bold">{updateToDelete?.title}</span>? This update log, its percentage tracking, and all associated gallery images will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setUpdateToDelete(null)} className="rounded-xl font-bold border-slate-200 dark:border-slate-700">Cancel</Button>
            <Button onClick={handleDeleteUpdate} className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold">Delete permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
