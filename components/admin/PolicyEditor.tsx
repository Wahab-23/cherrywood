'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Scale, Calendar, Plus, Trash2, AlignLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BlockNoteEditor from '@/components/blocknote/blocknoteEditor'

interface PolicySection {
  title: string
  content: string
}

interface PolicyData {
  last_updated: string
  subtitle: string
  sections: PolicySection[]
}

interface PolicyEditorProps {
  value: string
  onChange: (newValue: string) => void
}

const defaultData: PolicyData = {
  last_updated: 'May 19, 2026',
  subtitle: 'Please review our operations policies carefully before utilizing our design spaces.',
  sections: [
    { title: '1. Use of Services', content: 'Our architectural renderings, plans, and premium physical environments are subject to international proprietary protections.' },
    { title: '2. Customer Accounts & Auditing', content: 'Administrators retain full capabilities to suspend, investigate, or terminate access for violations of Cherrywood guidelines.' }
  ]
}

export default function PolicyEditor({ value, onChange }: PolicyEditorProps) {
  const [data, setData] = useState<PolicyData>(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value)
        if (parsed.template === 'policy' && parsed.data) {
          return { ...defaultData, ...parsed.data }
        }
      } catch (e) {
        // Not JSON
      }
    }
    return defaultData
  })

  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value)
        if (parsed.template === 'policy' && parsed.data) {
          setData({ ...defaultData, ...parsed.data })
        }
      } catch (e) {
        // Not JSON
      }
    }
  }, [value])

  const triggerChange = (updated: PolicyData) => {
    setData(updated)
    onChange(JSON.stringify({ template: 'policy', data: updated }))
  }

  const handleFieldChange = (key: keyof PolicyData, val: any) => {
    triggerChange({ ...data, [key]: val })
  }

  const handleSectionChange = (index: number, key: keyof PolicySection, val: string) => {
    const updatedSecs = [...data.sections]
    updatedSecs[index] = { ...updatedSecs[index], [key]: val }
    triggerChange({ ...data, sections: updatedSecs })
  }

  const addSection = () => {
    triggerChange({
      ...data,
      sections: [...data.sections, { title: '', content: '' }]
    })
  }

  const removeSection = (index: number) => {
    const updatedSecs = data.sections.filter((_, i) => i !== index)
    triggerChange({ ...data, sections: updatedSecs })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">
            Terms & Policy Template
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">Configure structured policy terms, updates, and legal clauses</p>
        </div>
      </div>

      {/* Overview Block */}
      <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
              Overview & Timeline
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 md:col-span-1">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Revision Date</Label>
              <Input
                value={data.last_updated}
                onChange={(e) => handleFieldChange('last_updated', e.target.value)}
                placeholder="e.g. May 19, 2026"
                className="h-10 text-xs font-semibold rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Policy Introduction Blurb</Label>
              <Input
                value={data.subtitle}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                placeholder="e.g. Please review our operations policies carefully..."
                className="h-10 text-xs font-semibold rounded-xl border-slate-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Clauses List */}
      <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                Policy Sections & Clauses
              </h4>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSection}
              className="h-8 rounded-xl text-xs font-bold border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Section
            </Button>
          </div>

          <div className="space-y-6">
            {data.sections.map((section, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 relative space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clause #{i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSection(i)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Clause Header / Title</Label>
                  <Input
                    value={section.title}
                    onChange={(e) => handleSectionChange(i, 'title', e.target.value)}
                    placeholder="e.g. 1. Terms of Use"
                    className="h-9 text-xs border-slate-200 rounded-lg bg-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <AlignLeft className="w-3 h-3 text-slate-400" /> Clause Body Text
                  </Label>
                  <BlockNoteEditor
                    initialContent={section.content}
                    onChange={(html) => handleSectionChange(i, 'content', html)}
                    placeholder="Provide full legal/support content for this section..."
                  />
                </div>
              </div>
            ))}

            {data.sections.length === 0 && (
              <p className="text-center py-6 text-xs text-neutral-400 font-semibold">
                No policy clauses defined. Click "Add Section" to draft policy terms.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
