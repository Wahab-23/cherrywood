'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Building, Info, User, DollarSign, Box } from 'lucide-react'
import { toast } from 'sonner'

export default function EditUnitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { id } = useParams() as { id: string }
  const projectParam = searchParams.get('project_id')

  // Data states
  const [projects, setProjects] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [projectId, setProjectId] = useState('')
  const [unitNumber, setUnitNumber] = useState('')
  const [type, setType] = useState('apartment')
  const [floor, setFloor] = useState('')
  const [sizeSqft, setSizeSqft] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState('available')
  const [ownerId, setOwnerId] = useState('')

  useEffect(() => {
    loadDependenciesAndUnit()
  }, [id])

  const loadDependenciesAndUnit = async () => {
    setLoadingData(true)
    try {
      const [projRes, userRes, unitRes] = await Promise.all([
        fetch('/api/projects?limit=100'),
        fetch('/api/users?limit=100'),
        fetch(`/api/unit/${id}`)
      ])

      const projData = await projRes.json()
      const userData = await userRes.json()
      const unitData = await unitRes.json()

      if (projData.success) setProjects(projData.data)
      if (userData.success) setUsers(userData.data)

      if (unitData.success) {
        const u = unitData.data
        setProjectId(u.project_id || '')
        setUnitNumber(u.unit_number || '')
        setType(u.type || 'apartment')
        setFloor(u.floor || '')
        setSizeSqft(u.size_sqft ? String(u.size_sqft) : '')
        setPrice(u.price ? String(u.price) : '')
        setStatus(u.status || 'available')
        setOwnerId(u.owner_id || '')
      } else {
        toast.error('Property unit not found')
        router.push('/admin/n8_nwrr2675/units')
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to load unit details or list options')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId) {
      toast.error('Project assignment is required')
      return
    }
    if (!unitNumber.trim()) {
      toast.error('Unit Number is required')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/unit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          unit_number: unitNumber,
          type,
          floor: floor || null,
          size_sqft: sizeSqft ? Number(sizeSqft) : null,
          price: price ? Number(price) : null,
          status,
          owner_id: status !== 'available' && ownerId ? ownerId : null,
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Property unit updated successfully!')
        handleBackNavigation()
      } else {
        toast.error(data.message || 'Failed to update property unit')
      }
    } catch (error) {
      console.error('Failed to update unit:', error)
      toast.error('Server error updating unit')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackNavigation = () => {
    if (projectParam) {
      router.push(`/admin/n8_nwrr2675/projects/${projectParam}?tab=units`)
    } else {
      router.push('/admin/n8_nwrr2675/units')
    }
  }

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs">Loading unit details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Title Bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBackNavigation}
          className="rounded-xl border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Unit Specifications</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Modify structural layout, floor positioning, status, or pricing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Specifications Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800 px-8 py-5">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle className="text-[17px] font-bold text-slate-900 dark:text-white">Unit Specifications</CardTitle>
                  <CardDescription className="text-xs font-semibold">Enter property details, size, and layout settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="projectId" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Associated Development *
                  </Label>
                  <select
                    id="projectId"
                    value={projectId}
                    disabled={!!projectParam}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-3.5 h-11 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Select Project...</option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.title}
                      </option>
                    ))}
                  </select>
                  {projectParam && (
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Locked to current project context</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitNumber" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Unit Number *
                  </Label>
                  <Input
                    id="unitNumber"
                    placeholder="e.g. 101, Penthouse B"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Property Type
                  </Label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 h-11 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="shop">Commercial Shop</option>
                    <option value="parking">Parking Slot</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Floor Level
                  </Label>
                  <Input
                    id="floor"
                    placeholder="e.g. 1st, Ground"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sizeSqft" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Sizing Area (sqft)
                  </Label>
                  <Input
                    id="sizeSqft"
                    type="number"
                    placeholder="e.g. 1400"
                    value={sizeSqft}
                    onChange={(e) => setSizeSqft(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-50 dark:border-slate-800/80 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Inventory Booking Status
                  </Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 h-11 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="available">Available (Open for offers)</option>
                    <option value="booked">Booked (Under processing)</option>
                    <option value="sold">Sold (Contract signed)</option>
                  </select>
                </div>

                {status !== 'available' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Label htmlFor="ownerId" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Assigned Buyer / Owner
                    </Label>
                    <select
                      id="ownerId"
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.target.value)}
                      className="w-full px-3.5 h-11 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      <option value="">Choose User...</option>
                      {users.map((usr) => (
                        <option key={usr.id} value={usr.id}>
                          {usr.name} ({usr.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing & Publish actions */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800 px-8 py-5">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <CardTitle className="text-[17px] font-bold text-slate-900 dark:text-white">Pricing valuation</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Valuation Cost (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="250000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Publish Action</h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Save your changes to update this property unit in the database instantly.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 dark:shadow-none"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Saving Changes...' : 'Save Unit Details'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleBackNavigation}
                className="w-full rounded-xl border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 h-11 font-bold text-slate-600 dark:text-slate-400 transition-all"
              >
                Discard & Exit
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
