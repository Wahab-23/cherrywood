'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Save, Building, Info, Image as ImageIcon, Search } from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/admin/MultiImageUpload'

export default function NewProjectPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  // Form states
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

  // Handle automatic slug generation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    // Slugify
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-') // remove duplicate hyphens
      .trim()
    setSlug(generatedSlug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!slug.trim()) {
      toast.error('Slug is required')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Project created successfully!')
        router.push('/admin/n8_nwrr2675/projects')
      } else {
        toast.error(data.message || 'Failed to create project')
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      toast.error('Server error creating project')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Navigation Row */}
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create Development</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Add a new real estate project to your admin portfolio
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Information Card */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800 px-8 py-5">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle className="text-[17px] font-bold text-slate-900 dark:text-white">General Information</CardTitle>
                  <CardDescription className="text-xs font-semibold">Enter basic info and slug settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Project Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Cherrywood Residency"
                    value={title}
                    onChange={handleTitleChange}
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Slug Link (URL) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="slug"
                      placeholder="e.g. cherrywood-residency"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold pr-9 font-mono text-xs"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" title="Auto-generated from title">
                      <Sparkles className="w-4 h-4 text-slate-300" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Location / Area
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. Downtown City"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Development Type
                  </Label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 h-11 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Current Status
                  </Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 h-11 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Launch Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedCompletion" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Expected Completion
                  </Label>
                  <Input
                    id="expectedCompletion"
                    type="date"
                    value={expectedCompletion}
                    onChange={(e) => setExpectedCompletion(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalUnits" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total Units Count
                  </Label>
                  <Input
                    id="totalUnits"
                    type="number"
                    placeholder="e.g. 50"
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Detailed Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide an attractive, detailed description of the development project, amenities, features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 min-h-36 focus:border-blue-500 transition-all font-semibold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Search Engine Optimization (SEO) Card */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800 px-8 py-5">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <CardTitle className="text-[17px] font-bold text-slate-900 dark:text-white">Search Engine Optimization (SEO)</CardTitle>
                  <CardDescription className="text-xs font-semibold">Improve search engine ranking and page visibility</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Meta Title
                </Label>
                <Input
                  id="metaTitle"
                  placeholder="e.g. Luxury Apartments For Sale in Downtown | Cherrywood"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 h-11 focus:border-blue-500 transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Provide a search snippet description between 150-160 characters to optimize visibility on Google searches."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 min-h-24 focus:border-blue-500 transition-all font-semibold text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Hero Image & Publish Actions */}
        <div className="space-y-8">
          {/* Hero Image Card */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800 px-8 py-5">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <CardTitle className="text-[17px] font-bold text-slate-900 dark:text-white">Hero Showcase Visual</CardTitle>
                  <CardDescription className="text-xs font-semibold">Upload an attractive high-res rendering</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <ImageUpload
                mode="single"
                value={heroImage}
                onChange={(url) => setHeroImage(url)}
                uploadPath="projects"
                hint="Preferred size: 1920x1080 (16:9) · Max 5MB"
              />
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Publish Action</h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Upon creation, the project will be recorded in the active database and will become ready to link to individual units inventory.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 dark:shadow-none"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Creating Project...' : 'Save & Publish'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/n8_nwrr2675/projects')}
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
