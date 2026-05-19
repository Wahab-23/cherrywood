'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  MessageSquare,
  Sparkles
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQManagerProps {
  value: string // Serialized JSON string from dynamic DB column
  onChange: (newValue: string) => void
}

export default function FAQManager({ value, onChange }: FAQManagerProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([])

  // Safely parse initial values
  useEffect(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
          setFaqs(parsed)
          return
        }
      }
      setFaqs([])
    } catch (e) {
      console.error("Failed to parse initial FAQ content", e)
      setFaqs([])
    }
  }, [value])

  const triggerChange = (newItems: FAQItem[]) => {
    setFaqs(newItems)
    onChange(JSON.stringify(newItems))
  }

  const handleAddFaq = () => {
    const newItems = [...faqs, { question: '', answer: '' }]
    triggerChange(newItems)
  }

  const handleRemoveFaq = (index: number) => {
    const newItems = faqs.filter((_, idx) => idx !== index)
    triggerChange(newItems)
  }

  const handleFieldChange = (index: number, key: keyof FAQItem, text: string) => {
    const newItems = faqs.map((item, idx) => {
      if (idx === index) {
        return { ...item, [key]: text }
      }
      return item
    })
    triggerChange(newItems)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...faqs]
    const current = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = current
    triggerChange(newItems)
  }

  const handleMoveDown = (index: number) => {
    if (index === faqs.length - 1) return
    const newItems = [...faqs]
    const current = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = current
    triggerChange(newItems)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">
              FAQ Accordion Section
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5">
              Add interactive Frequently Asked Questions to engage users
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={handleAddFaq}
          className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-9 px-4 text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-indigo-100 dark:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Add FAQ Item
        </Button>
      </div>

      {/* FAQ items list */}
      {faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center bg-neutral-50/20 dark:bg-neutral-900/10">
          <MessageSquare className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-2 animate-pulse" />
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">No FAQ items defined yet</p>
          <p className="text-[10px] text-neutral-400 max-w-[280px] mt-0.5 leading-normal">
            Click "Add FAQ Item" above to expand this document with dynamic accordions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className="border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group"
            >
              <CardContent className="p-5 flex flex-col md:flex-row gap-5">
                {/* Index & Sort Indicators */}
                <div className="flex items-center md:flex-col justify-between md:justify-start gap-3 md:pt-1 select-none">
                  <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-700/50">
                    {index + 1}
                  </div>
                  <div className="flex md:flex-col items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-950 dark:hover:text-slate-50 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === faqs.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-950 dark:hover:text-slate-50 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      Question Topic
                    </Label>
                    <Input
                      placeholder="e.g. Is parking space included with the units?"
                      value={faq.question}
                      onChange={(e) => handleFieldChange(index, 'question', e.target.value)}
                      className="h-10 text-xs font-semibold rounded-xl border-slate-200 focus-visible:ring-1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Answer Content
                    </Label>
                    <Textarea
                      placeholder="Provide a descriptive answer for this question..."
                      value={faq.answer}
                      onChange={(e) => handleFieldChange(index, 'answer', e.target.value)}
                      className="min-h-[80px] text-xs leading-relaxed rounded-xl border-slate-200 resize-none p-3 focus-visible:ring-1"
                    />
                  </div>
                </div>

                {/* Delete Trigger */}
                <div className="flex items-center justify-end md:items-start md:pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFaq(index)}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
