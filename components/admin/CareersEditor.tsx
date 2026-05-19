'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Briefcase, Plus, Trash2, Heart, Award, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface JobOpening {
  title: string
  department: string
  location: string
  type: string
  description: string
  apply_url: string
}

interface PerkBenefit {
  title: string
  description: string
}

interface CareersData {
  hero_title: string
  hero_subtitle: string
  openings: JobOpening[]
  perks: PerkBenefit[]
}

interface CareersEditorProps {
  value: string
  onChange: (newValue: string) => void
}

const defaultData: CareersData = {
  hero_title: 'Careers at Cherrywood',
  hero_subtitle: 'Shape the physical landmarks of future generations. Join our team of architectural and real estate experts.',
  openings: [
    { title: 'Senior Architectural Designer', department: 'Design Studio', location: 'New York, NY', type: 'Full-time', description: 'Lead high-end architectural concepts, detailing layouts, and specifications.', apply_url: 'careers@cherrywood.com' },
    { title: 'Real Estate Portfolio Manager', department: 'Advisory Operations', location: 'Remote / NYC', type: 'Full-time', description: 'Oversee corporate and premium customer portfolio growth and development.', apply_url: 'careers@cherrywood.com' }
  ],
  perks: [
    { title: 'Premium Health Coverage', description: 'Fully paid medical, dental, vision, and wellness subscriptions for our designers.' },
    { title: 'Global Architecture Safaris', description: 'Annual company retreats exploring historical and state-of-the-art architectures.' }
  ]
}

export default function CareersEditor({ value, onChange }: CareersEditorProps) {
  const [data, setData] = useState<CareersData>(defaultData)

  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value)
        if (parsed.template === 'careers' && parsed.data) {
          setData({ ...defaultData, ...parsed.data })
        }
      } catch (e) {
        // Not JSON
      }
    }
  }, [value])

  const triggerChange = (updated: CareersData) => {
    setData(updated)
    onChange(JSON.stringify({ template: 'careers', data: updated }))
  }

  const handleFieldChange = (key: keyof CareersData, val: any) => {
    triggerChange({ ...data, [key]: val })
  }

  const handleJobChange = (index: number, key: keyof JobOpening, val: string) => {
    const updatedOps = [...data.openings]
    updatedOps[index] = { ...updatedOps[index], [key]: val }
    triggerChange({ ...data, openings: updatedOps })
  }

  const addJob = () => {
    triggerChange({
      ...data,
      openings: [...data.openings, { title: '', department: '', location: '', type: 'Full-time', description: '', apply_url: '' }]
    })
  }

  const removeJob = (index: number) => {
    const updatedOps = data.openings.filter((_, i) => i !== index)
    triggerChange({ ...data, openings: updatedOps })
  }

  const handlePerkChange = (index: number, key: keyof PerkBenefit, val: string) => {
    const updatedPerks = [...data.perks]
    updatedPerks[index] = { ...updatedPerks[index], [key]: val }
    triggerChange({ ...data, perks: updatedPerks })
  }

  const addPerk = () => {
    triggerChange({
      ...data,
      perks: [...data.perks, { title: '', description: '' }]
    })
  }

  const removePerk = (index: number) => {
    const updatedPerks = data.perks.filter((_, i) => i !== index)
    triggerChange({ ...data, perks: updatedPerks })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">
            Careers & Job Openings Template
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">Configure open job listings, descriptions, and perks</p>
        </div>
      </div>

      {/* Hero settings */}
      <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
              Hero Section Banner
            </h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Main Title</Label>
              <Input
                value={data.hero_title}
                onChange={(e) => handleFieldChange('hero_title', e.target.value)}
                placeholder="e.g. Careers at Cherrywood"
                className="h-10 text-xs font-semibold rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Subtitle / Mission Tagline</Label>
              <Textarea
                value={data.hero_subtitle}
                onChange={(e) => handleFieldChange('hero_subtitle', e.target.value)}
                placeholder="e.g. Shape the physical landmarks of future generations..."
                className="min-h-[80px] text-xs rounded-xl border-slate-200 resize-none p-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits & Perks */}
      <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                Company Perks & Benefits
              </h4>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPerk}
              className="h-8 rounded-xl text-xs font-bold border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Perk
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.perks.map((perk, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 relative space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Benefit #{i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePerk(i)}
                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Perk Title</Label>
                  <Input
                    value={perk.title}
                    onChange={(e) => handlePerkChange(i, 'title', e.target.value)}
                    placeholder="e.g. Wellness allowance"
                    className="h-9 text-xs border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Perk Description</Label>
                  <Textarea
                    value={perk.description}
                    onChange={(e) => handlePerkChange(i, 'description', e.target.value)}
                    placeholder="e.g. Monthly stipend for gyms or mental health services."
                    className="min-h-[60px] text-xs border-slate-200 rounded-lg bg-white resize-none p-2.5"
                  />
                </div>
              </div>
            ))}

            {data.perks.length === 0 && (
              <p className="col-span-2 text-center py-6 text-xs text-neutral-400 font-semibold">
                No benefits or perks defined. Click "Add Perk" to show employee incentives.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Job Openings */}
      <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                Active Job Openings
              </h4>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addJob}
              className="h-8 rounded-xl text-xs font-bold border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Opening
            </Button>
          </div>

          <div className="space-y-6">
            {data.openings.map((job, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 relative space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Position #{i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeJob(i)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Job Title</Label>
                    <Input
                      value={job.title}
                      onChange={(e) => handleJobChange(i, 'title', e.target.value)}
                      placeholder="e.g. Lead Designer"
                      className="h-9 text-xs border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Department</Label>
                    <Input
                      value={job.department}
                      onChange={(e) => handleJobChange(i, 'department', e.target.value)}
                      placeholder="e.g. Engineering Studio"
                      className="h-9 text-xs border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Location</Label>
                    <Input
                      value={job.location}
                      onChange={(e) => handleJobChange(i, 'location', e.target.value)}
                      placeholder="e.g. Remote / NYC"
                      className="h-9 text-xs border-slate-200 rounded-lg bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Employment Type</Label>
                    <Input
                      value={job.type}
                      onChange={(e) => handleJobChange(i, 'type', e.target.value)}
                      placeholder="e.g. Full-time, Internship"
                      className="h-9 text-xs border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Job Description Snippet</Label>
                  <Textarea
                    value={job.description}
                    onChange={(e) => handleJobChange(i, 'description', e.target.value)}
                    placeholder="Brief summary of duties..."
                    className="min-h-[70px] text-xs border-slate-200 rounded-lg bg-white resize-none p-3"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    Application Pipeline Email/Link <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </Label>
                  <Input
                    value={job.apply_url}
                    onChange={(e) => handleJobChange(i, 'apply_url', e.target.value)}
                    placeholder="e.g. jobs@cherrywood.com"
                    className="h-9 text-xs border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>
            ))}

            {data.openings.length === 0 && (
              <p className="text-center py-6 text-xs text-neutral-400 font-semibold">
                No active openings listed. Click "Add Opening" to expand listings.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
