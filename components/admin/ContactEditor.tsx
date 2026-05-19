'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, MapPin, Mail, Phone, Clock, HelpCircle, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DepartmentContact {
  name: string
  email: string
  phone: string
}

interface ContactData {
  hero_title: string
  hero_subtitle: string
  address_street: string
  address_city_state: string
  support_email: string
  sales_email: string
  phone_number: string
  office_hours: string
  departments: DepartmentContact[]
}

interface ContactEditorProps {
  value: string
  onChange: (newValue: string) => void
}

const defaultData: ContactData = {
  hero_title: 'Contact Our Team',
  hero_subtitle: 'Reach out to our architectural advisory team to discuss your future sanctuary.',
  address_street: '100 Cherrywood Avenue, Penthouse Level',
  address_city_state: 'New York, NY 10001',
  support_email: 'support@cherrywood.com',
  sales_email: 'concierge@cherrywood.com',
  phone_number: '+1 (800) 555-0199',
  office_hours: 'Mon - Fri: 9:00 AM - 6:00 PM EST',
  departments: [
    { name: 'General Inquiries', email: 'hello@cherrywood.com', phone: '+1 (800) 555-0100' },
    { name: 'Media & Press', email: 'press@cherrywood.com', phone: '+1 (800) 555-0120' }
  ]
}

export default function ContactEditor({ value, onChange }: ContactEditorProps) {
  const [data, setData] = useState<ContactData>(defaultData)

  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value)
        if (parsed.template === 'contact' && parsed.data) {
          setData({ ...defaultData, ...parsed.data })
        }
      } catch (e) {
        // Not JSON or legacy content
      }
    }
  }, [value])

  const triggerChange = (updated: ContactData) => {
    setData(updated)
    onChange(JSON.stringify({ template: 'contact', data: updated }))
  }

  const handleFieldChange = (key: keyof ContactData, val: any) => {
    triggerChange({ ...data, [key]: val })
  }

  const handleDepartmentChange = (index: number, key: keyof DepartmentContact, val: string) => {
    const updatedDeps = [...data.departments]
    updatedDeps[index] = { ...updatedDeps[index], [key]: val }
    triggerChange({ ...data, departments: updatedDeps })
  }

  const addDepartment = () => {
    triggerChange({
      ...data,
      departments: [...data.departments, { name: '', email: '', phone: '' }]
    })
  }

  const removeDepartment = (index: number) => {
    const updatedDeps = data.departments.filter((_, i) => i !== index)
    triggerChange({ ...data, departments: updatedDeps })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">
            Contact Directory Template
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">Configure layout, departments, and support channels</p>
        </div>
      </div>

      {/* Hero section */}
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
                placeholder="e.g. Contact Our Team"
                className="h-10 text-xs font-semibold rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Subtitle / Tagline</Label>
              <Textarea
                value={data.hero_subtitle}
                onChange={(e) => handleFieldChange('hero_subtitle', e.target.value)}
                placeholder="e.g. Reach out to our architectural advisory team..."
                className="min-h-[80px] text-xs rounded-xl border-slate-200 resize-none p-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Details */}
      <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
              Core Directory Details
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Street Address</Label>
                <Input
                  value={data.address_street}
                  onChange={(e) => handleFieldChange('address_street', e.target.value)}
                  placeholder="e.g. 100 Cherrywood Avenue"
                  className="h-10 text-xs font-semibold rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City, State, Zip Code</Label>
                <Input
                  value={data.address_city_state}
                  onChange={(e) => handleFieldChange('address_city_state', e.target.value)}
                  placeholder="e.g. New York, NY 10001"
                  className="h-10 text-xs font-semibold rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Office/Business Hours
                </Label>
                <Input
                  value={data.office_hours}
                  onChange={(e) => handleFieldChange('office_hours', e.target.value)}
                  placeholder="e.g. Mon - Fri: 9:00 AM - 6:00 PM EST"
                  className="h-10 text-xs font-semibold rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Primary Support Email
                </Label>
                <Input
                  value={data.support_email}
                  onChange={(e) => handleFieldChange('support_email', e.target.value)}
                  placeholder="e.g. support@cherrywood.com"
                  className="h-10 text-xs font-semibold rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Sales/Concierge Email
                </Label>
                <Input
                  value={data.sales_email}
                  onChange={(e) => handleFieldChange('sales_email', e.target.value)}
                  placeholder="e.g. concierge@cherrywood.com"
                  className="h-10 text-xs font-semibold rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Office Phone Number
                </Label>
                <Input
                  value={data.phone_number}
                  onChange={(e) => handleFieldChange('phone_number', e.target.value)}
                  placeholder="e.g. +1 (800) 555-0199"
                  className="h-10 text-xs font-semibold rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      <Card className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                Department advisory lines
              </h4>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDepartment}
              className="h-8 rounded-xl text-xs font-bold border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Department
            </Button>
          </div>

          <div className="space-y-4">
            {data.departments.map((dep, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 relative bg-neutral-50/50 dark:bg-neutral-900/50"
              >
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Department Name</Label>
                  <Input
                    value={dep.name}
                    onChange={(e) => handleDepartmentChange(i, 'name', e.target.value)}
                    placeholder="e.g. Media Relations"
                    className="h-9 text-xs border-slate-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Department Email</Label>
                  <Input
                    value={dep.email}
                    onChange={(e) => handleDepartmentChange(i, 'email', e.target.value)}
                    placeholder="e.g. press@cherrywood.com"
                    className="h-9 text-xs border-slate-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1 flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Department Phone</Label>
                    <Input
                      value={dep.phone}
                      onChange={(e) => handleDepartmentChange(i, 'phone', e.target.value)}
                      placeholder="e.g. +1 (800) 555-0120"
                      className="h-9 text-xs border-slate-200 rounded-lg"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDepartment(i)}
                    className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {data.departments.length === 0 && (
              <p className="text-center py-6 text-xs text-neutral-400 font-semibold">
                No custom department advisories defined. Click "Add Department" to start.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
