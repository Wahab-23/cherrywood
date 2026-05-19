'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Grid, Eye, BookOpen } from 'lucide-react'

interface JournalData {
  hero_title: string
  hero_subtitle: string
  grid_layout: 'grid' | 'masonry' | 'editorial'
  theme_color: string
  tagline: string
}

interface JournalEditorProps {
  value: string
  onChange: (newValue: string) => void
}

const defaultData: JournalData = {
  hero_title: 'The Cherrywood Journal',
  hero_subtitle: 'Perspectives on architecture, luxury spatial planning, and design thinking.',
  grid_layout: 'masonry',
  theme_color: '#0d1b2e',
  tagline: 'CREATIVE PERSPECTIVES & SPACE INSIGHTS'
}

export default function JournalEditor({ value, onChange }: JournalEditorProps) {
  const [data, setData] = useState<JournalData>(defaultData)

  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value)
        if (parsed.template === 'journal' && parsed.data) {
          setData({ ...defaultData, ...parsed.data })
        }
      } catch (e) {
        // Not JSON
      }
    }
  }, [value])

  const triggerChange = (updated: JournalData) => {
    setData(updated)
    onChange(JSON.stringify({ template: 'journal', data: updated }))
  }

  const handleFieldChange = (key: keyof JournalData, val: any) => {
    triggerChange({ ...data, [key]: val })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">
            Journal & Blog Layout Template
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">Configure your editorial landing layout, grids, and design themes</p>
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
                placeholder="e.g. The Cherrywood Journal"
                className="h-10 text-xs font-semibold rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Subtitle / Tagline</Label>
              <Textarea
                value={data.hero_subtitle}
                onChange={(e) => handleFieldChange('hero_subtitle', e.target.value)}
                placeholder="e.g. Perspectives on architecture, luxury spatial planning..."
                className="min-h-[80px] text-xs rounded-xl border-slate-200 resize-none p-3"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eyebrow Tagline</Label>
              <Input
                value={data.tagline}
                onChange={(e) => handleFieldChange('tagline', e.target.value)}
                placeholder="e.g. CREATIVE PERSPECTIVES & SPACE INSIGHTS"
                className="h-10 text-xs font-semibold rounded-xl border-slate-200 uppercase tracking-widest"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Style Layout */}
      <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <Grid className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
              Grid & Aesthetics
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Editorial Card Layout</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'grid', title: 'Clean Grid', desc: 'Classic 3-col' },
                  { id: 'masonry', title: 'Masonry', desc: 'Uneven artsy' },
                  { id: 'editorial', title: 'Editorial', desc: 'Single list view' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleFieldChange('grid_layout', item.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      data.grid_layout === item.id
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                    <span className="text-[8px] text-slate-400 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  Accent Color Hex <Eye className="w-3.5 h-3.5 text-slate-400" />
                </Label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="color"
                    value={data.theme_color || '#000000'}
                    onChange={(e) => handleFieldChange('theme_color', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer overflow-hidden p-0 bg-transparent"
                  />
                  <Input
                    value={data.theme_color}
                    onChange={(e) => handleFieldChange('theme_color', e.target.value)}
                    placeholder="#0d1b2e"
                    className="h-10 text-xs font-semibold rounded-xl border-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
