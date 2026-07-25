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
  Box,
  Building,
  MapPin,
  User,
  DollarSign,
  Layers,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function UnitsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [projects, setProjects] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>({ total: 0, pages: 1 })

  // Deletion state
  const [unitToDelete, setUnitToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch initial filters and units
  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    fetchUnits()
  }, [searchQuery, projectFilter, typeFilter, statusFilter, page])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?limit=100')
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch projects list:', error)
    }
  }

  const fetchUnits = async () => {
    setLoading(true)
    try {
      let url = `/api/unit?search=${encodeURIComponent(searchQuery)}&page=${page}&limit=10`
      if (projectFilter) url += `&project_id=${projectFilter}`
      if (typeFilter) url += `&type=${typeFilter}`
      if (statusFilter) url += `&status=${statusFilter}`

      const response = await fetch(url)
      if (!response.ok) {
        toast.error(`Failed to fetch units (${response.status})`)
        return
      }
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        toast.error("Failed to fetch units: invalid response format")
        return
      }
      const data = await response.json()
      if (data.success) {
        setUnits(data.data)
        setMeta({ total: data.totalUnits || data.data.length, pages: data.totalPages || 1 })
      } else {
        toast.error(data.message || 'Failed to fetch units list')
      }
    } catch (error) {
      console.error('Failed to fetch units:', error)
      toast.error('Server error fetching units')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUnit = async () => {
    if (!unitToDelete) return
    setDeleting(true)
    try {
      const response = await fetch(`/api/unit/${unitToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Unit deleted successfully')
        fetchUnits()
      } else {
        toast.error(data.error || 'Failed to delete unit')
      }
    } catch (error) {
      console.error('Failed to delete unit:', error)
      toast.error('Server error deleting unit')
    } finally {
      setDeleting(false)
      setUnitToDelete(null)
    }
  }

  const formatPrice = (priceVal: any) => {
    if (!priceVal) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(Number(priceVal))
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Properties Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Track available apartments, commercial shops, pricing, and bookings
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/n8_nwrr2675/units/new')}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-50 dark:hover:bg-blue-200 dark:text-slate-900 shadow-lg shadow-blue-200 dark:shadow-none font-bold h-11 px-6 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property Unit
        </Button>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search unit #..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="pl-10 rounded-xl border-slate-200 h-11 bg-white dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold"
          />
        </div>

        <select
          value={projectFilter}
          onChange={(e) => {
            setProjectFilter(e.target.value)
            setPage(1)
          }}
          className="px-3.5 h-11 border border-slate-200 rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Projects</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.title}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value)
            setPage(1)
          }}
          className="px-3.5 h-11 border border-slate-200 rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Property Types</option>
          <option value="apartment">Apartment</option>
          <option value="shop">Commercial Shop</option>
          <option value="parking">Parking Slot</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="px-3.5 h-11 border border-slate-200 rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="booked">Booked</option>
          <option value="sold">Sold</option>
        </select>

        <div className="flex items-center justify-end">
          <p className="text-sm font-bold text-slate-500">
            Total Tracked: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{meta.total}</span> units
          </p>
        </div>
      </div>

      {/* Units Inventory Table Card */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <TableRow className="border-none">
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Unit #</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Associated Project</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Sizing</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Type</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Status</TableHead>
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse border-b border-slate-50 dark:border-slate-800">
                    <TableCell colSpan={8} className="px-8 py-6">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : units.length > 0 ? (
                units.map((unit) => (
                  <TableRow key={unit.id} className="group hover:bg-slate-50/45 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/80">
                    {/* Unit Number */}
                    <TableCell className="px-8 py-4.5">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-extrabold text-slate-950 dark:text-white text-[15px]">
                          Unit {unit.unit_number}
                        </span>
                      </div>
                    </TableCell>

                    {/* Associated Project */}
                    <TableCell className="py-4.5 font-bold text-slate-900 dark:text-slate-100 text-[13px] hover:text-blue-600 cursor-pointer" onClick={() => router.push(`/admin/n8_nwrr2675/projects/${unit.project?.id}`)}>
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{unit.project?.title || 'Unknown Project'}</span>
                      </div>
                    </TableCell>

                    {/* Floor & Size */}
                    <TableCell className="py-4.5 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      <span><strong>{unit.size_sqft || 'N/A'}</strong> sqft</span>
                    </TableCell>

                    {/* Property Type Badge */}
                    <TableCell className="py-4.5">
                      <Badge variant="outline" className="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50 font-black uppercase text-[9px] px-2 py-0.5">
                        {unit.type || 'apartment'}
                      </Badge>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-4.5">
                      {unit.status === 'available' ? (
                        <span className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-bold text-[10px] uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Available
                        </span>
                      ) : unit.status === 'booked' ? (
                        <span className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-500 font-bold text-[10px] uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          Booked
                        </span>
                      ) : unit.status === 'sold' ? (
                        <span className="flex items-center gap-1.5 text-red-500 dark:text-red-400 font-bold text-[10px] uppercase tracking-wider">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Sold
                        </span>
                      ) : unit.status === 'limited' ? (
                        <span className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-500 font-bold text-[10px] uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          Limited
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Unknown
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-8 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/n8_nwrr2675/units/${unit.id}/edit`)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                          title="Edit Unit details"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setUnitToDelete(unit)}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          title="Delete Unit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Box className="w-12 h-12 text-slate-200 dark:text-slate-800" />
                      <div>
                        <p className="text-slate-800 dark:text-slate-200 font-bold text-lg">No Property Units Found</p>
                        <p className="text-slate-400 text-sm mt-0.5">Try adjusting your filters or register a new unit.</p>
                      </div>
                      <Button
                        onClick={() => router.push('/admin/n8_nwrr2675/units/new')}
                        className="rounded-xl mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5"
                      >
                        Create First Unit
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

      {/* Delete Unit Confirmation Dialog */}
      <Dialog open={!!unitToDelete} onOpenChange={(open) => !open && setUnitToDelete(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Delete Property Unit?</DialogTitle>
            <DialogDescription className="font-semibold text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to remove <span className="text-red-600 font-bold">Unit {unitToDelete?.unit_number}</span> from the inventory of <span className="font-bold">{unitToDelete?.project?.title}</span>? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              disabled={deleting}
              onClick={() => setUnitToDelete(null)}
              className="rounded-xl font-bold border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              disabled={deleting}
              onClick={handleDeleteUnit}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {deleting ? 'Deleting...' : 'Delete permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
