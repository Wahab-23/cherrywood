'use client'

import { useRef, type RefObject } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Globe, Image as ImageIcon, Sparkles } from 'lucide-react'
import ImageUpload from '@/components/admin/MultiImageUpload'
import FAQManager from '@/components/admin/FAQManager'
import { COMPULSORY_PAGES } from '@/lib/pageConstants'

interface PageEditorShellProps {
  /** The template-specific editor content */
  children: React.ReactNode
  /** Action bar */
  saving: boolean
  onSave: () => void
  saveLabel?: string
  /** Page identity */
  template: string
  slug: string
  /** Title */
  title: string
  onTitleChange: (v: string) => void
  titlePlaceholder?: string
  /** Slug */
  onSlugChange: (v: string) => void
  slugReadonly?: boolean
  /** Publishing */
  status: string
  onStatusToggle: (checked: boolean) => void
  /** SEO */
  metaTitle: string
  onMetaTitleChange: (v: string) => void
  metaDescription: string
  onMetaDescriptionChange: (v: string) => void
  /** OG */
  ogImage: string
  onOgImageChange: (v: string) => void
  /** FAQ */
  faqs: string
  onFaqsChange: (v: string) => void
}

export default function PageEditorShell({
  children,
  saving,
  onSave,
  saveLabel = 'Save Modifications',
  template,
  slug,
  title,
  onTitleChange,
  titlePlaceholder = 'e.g. Terms & Conditions, About Cherrywood...',
  onSlugChange,
  slugReadonly = false,
  status,
  onStatusToggle,
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  ogImage,
  onOgImageChange,
  faqs,
  onFaqsChange,
}: PageEditorShellProps) {
  const router = useRouter()
  const slugLower = slug.toLowerCase()
  const compulsoryInfo = COMPULSORY_PAGES[slugLower]

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black animate-in fade-in duration-500">
      {/* ── Sticky Action Bar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-2 -ml-2 rounded-lg"
              onClick={() => router.push('/admin/n8_nwrr2675/pages')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Back to Pages</span>
            </Button>

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

            {/* Live status badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Status:</span>
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[10px] font-bold uppercase tracking-tight text-neutral-600 dark:text-neutral-400">{status}</span>
              </div>
            </div>

            {/* Template badge */}
            <div className="hidden sm:flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">{template}</span>
            </div>
          </div>

          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 text-white rounded-full px-6 h-9 text-xs font-bold uppercase tracking-widest shadow-lg shadow-neutral-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              saveLabel
            )}
          </Button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">

          {/* ── Main Canvas ─────────────────────────────────────────────── */}
          <main className="space-y-12">
            {/* Title + Slug */}
            <section className="space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">
                  Page Headline / Title
                </Label>
                <textarea
                  placeholder={titlePlaceholder}
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  rows={1}
                  className="w-full text-5xl md:text-6xl font-black tracking-tight bg-transparent border-none resize-none focus:ring-0 placeholder:text-neutral-200 dark:placeholder:text-neutral-800 transition-all leading-[1.1] focus:outline-none"
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement
                    t.style.height = 'auto'
                    t.style.height = t.scrollHeight + 'px'
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <div className="space-y-1.5 min-w-[280px] flex-1">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> URL Slug Path
                  </Label>
                  <div className="flex items-center">
                    <span className="text-xs font-semibold text-slate-400 select-none mr-1.5">/</span>
                    <Input
                      placeholder="page-slug-identifier"
                      value={slug}
                      onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                      disabled={slugReadonly || !!compulsoryInfo}
                      className="h-8 text-sm font-semibold border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg px-3 focus-visible:ring-1 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Template-specific editor content */}
            <section className="relative">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200/50 dark:border-slate-800/80 shadow-sm p-6 min-h-[450px]">
                {children}
              </div>
            </section>

            {/* FAQ Manager */}
            <section className="relative p-6 bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800/80 rounded-2xl shadow-sm">
              <FAQManager value={faqs} onChange={onFaqsChange} />
            </section>
          </main>

          {/* ── Settings Sidebar ─────────────────────────────────────────── */}
          <aside className="space-y-12 lg:sticky lg:top-28 h-fit">

            {/* Template lock / info */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">
                  Design Layout Template
                </h3>
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Aesthetic</span>
              </div>

              {compulsoryInfo ? (
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Compulsory Page Lock</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Template locked to: <span className="underline decoration-indigo-500 decoration-2">{compulsoryInfo.name}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    This layout is critical for system integrity and cannot be deleted or re-templated.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Active Template</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">{template}</p>
                  <p className="text-[10px] text-slate-400">
                    To change the template, create a new page with the desired layout.
                  </p>
                </div>
              )}
            </div>

            {/* Publishing */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">
                  Publish Settings
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">
                    {status === 'published' ? 'Live' : 'Hidden'}
                  </span>
                  <Switch
                    checked={status === 'published'}
                    onCheckedChange={onStatusToggle}
                    className="data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-white"
                  />
                </div>
              </div>

              {/* OG / Social Cover Image */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Social Cover Image</Label>
                  <ImageIcon className="w-3.5 h-3.5 text-neutral-300" />
                </div>
                <div className="relative group rounded-2xl p-4 overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                  <ImageUpload
                    mode="single"
                    value={ogImage}
                    onChange={(img) => onOgImageChange(img || '')}
                    uploadPath="pages"
                    hint="Choose social card banner"
                  />
                </div>
              </div>
            </div>

            {/* SEO Panel */}
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">
                  Search Engine Index
                </h3>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Meta Title Tag</Label>
                  <Input
                    placeholder="Search optimized header..."
                    value={metaTitle}
                    onChange={(e) => onMetaTitleChange(e.target.value)}
                    className="h-10 text-xs border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl focus-visible:ring-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Meta Description Blurb</Label>
                  <Textarea
                    placeholder="Search snippet summary..."
                    value={metaDescription}
                    onChange={(e) => onMetaDescriptionChange(e.target.value)}
                    className="min-h-[100px] text-xs leading-relaxed border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl focus-visible:ring-1 resize-none p-4"
                  />
                </div>

                {/* Google-style preview */}
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/30 dark:border-neutral-800/30 space-y-2 select-none">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                      <Globe className="w-2.5 h-2.5 text-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 tracking-tight">Cherrywood</span>
                      <span className="text-[8px] text-neutral-400">cherrywood.com/{slug || 'slug'}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1 leading-snug">
                    {metaTitle || title || 'Untitled Static Page'}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-normal">
                    {metaDescription || 'Start drafting SEO properties to inspect the live preview rendering...'}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
