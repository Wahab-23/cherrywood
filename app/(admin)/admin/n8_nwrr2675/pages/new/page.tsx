'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  Globe,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react'

import BlockNoteEditor, { BlockNoteEditorRef } from '@/components/blocknote/blocknoteEditor'
import ImageUpload from '@/components/admin/MultiImageUpload'
import FAQManager from '@/components/admin/FAQManager'
import HomepageEditor from '@/components/admin/HomepageEditor'
import ContactEditor from '@/components/admin/ContactEditor'
import CareersEditor from '@/components/admin/CareersEditor'
import PolicyEditor from '@/components/admin/PolicyEditor'
import JournalEditor from '@/components/admin/JournalEditor'
import { COMPULSORY_PAGES, getInitialTemplateContent } from '@/lib/pageConstants'

export default function NewPageCreator() {
  const router = useRouter()
  const editorRef = useRef<BlockNoteEditorRef>(null)

  const [saving, setSaving] = useState(false)

  // Fields states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState('draft')
  const [content, setContent] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogImage, setOgImage] = useState('')
  const [faqs, setFaqs] = useState('[]') // Added dynamic FAQ state
  const [template, setTemplate] = useState('default')

  // Automatic slug generation from title
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slug || slug === val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generated)
    }
  }

  const handleCreatePage = async () => {
    if (!title.trim()) {
      toast.error('Page Headline/Title is required')
      return
    }
    if (!slug.trim()) {
      toast.error('URL Path/Slug is required')
      return
    }

    setSaving(true)
    try {
      // For JSON template layouts, content already holds serialized data and editorRef is not used
      const editorContent = template === 'default' && editorRef.current
        ? await editorRef.current.getContent()
        : content

      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          template,
          status,
          content: editorContent,
          meta_title: metaTitle || null,
          meta_description: metaDescription || null,
          og_title: ogTitle || metaTitle || title || null,
          og_description: ogDescription || metaDescription || null,
          og_image: ogImage || null,
          faqs // Added faqs string payload
        })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        toast.success('Static page created successfully!')
        router.push(`/admin/n8_nwrr2675/pages/${data.data.id}`)
      } else {
        toast.error(data.error || 'Failed to create page')
      }
    } catch (error) {
      console.error(error)
      toast.error('Server error saving new static page')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const slugLower = slug.toLowerCase()
    if (COMPULSORY_PAGES[slugLower]) {
      const lockedTemplate = COMPULSORY_PAGES[slugLower].template
      if (template !== lockedTemplate) {
        setTemplate(lockedTemplate)
      }
    }
  }, [slug])

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black animate-in fade-in duration-500">
      {/* Zen Action Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl rounded-xl">
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
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Status:</span>
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[10px] font-bold uppercase tracking-tight text-neutral-600 dark:text-neutral-400">{status}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleCreatePage}
              disabled={saving}
              className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 text-white rounded-full px-6 h-9 text-xs font-bold uppercase tracking-widest shadow-lg shadow-neutral-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                "Publish Page"
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
          {/* Writing Canvas */}
          <main className="space-y-12">
            <section className="space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Page Headline / Title</Label>
                <textarea
                  placeholder="e.g. Terms & Conditions, About Cherrywood..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  rows={1}
                  className="w-full text-5xl md:text-6xl font-black tracking-tight bg-transparent border-none resize-none focus:ring-0 placeholder:text-neutral-200 dark:placeholder:text-neutral-800 transition-all leading-[1.1] focus:outline-none"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = target.scrollHeight + 'px'
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <div className="space-y-1.5 min-w-[280px] flex-1">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> URL Slug Path
                  </Label>
                  <div className="flex items-center">
                    <span className="text-xs font-semibold text-slate-400 select-none mr-1.5">/page/</span>
                    <Input
                      placeholder="page-slug-identifier"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                      disabled={!!COMPULSORY_PAGES[slug.toLowerCase()]}
                      className="h-8 text-sm font-semibold border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg px-3 focus-visible:ring-1 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Dynamic visual page template: Homepage editor or Generic Blocknote canvas */}
            <section className="relative">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-200/50 dark:border-slate-800/80 shadow-sm p-6 min-h-[450px]">
                {template === 'home' && (
                  <HomepageEditor value={content} onChange={setContent} />
                )}
                {template === 'contact' && (
                  <ContactEditor value={content} onChange={setContent} />
                )}
                {template === 'careers' && (
                  <CareersEditor value={content} onChange={setContent} />
                )}
                {template === 'policy' && (
                  <PolicyEditor value={content} onChange={setContent} />
                )}
                {template === 'journal' && (
                  <JournalEditor value={content} onChange={setContent} />
                )}
                {template === 'default' && (
                  <>
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1 block mb-3">Page Document Body</Label>
                    <BlockNoteEditor
                      ref={editorRef}
                      initialContent={content}
                      placeholder="Define your beautiful static page structure..."
                    />
                  </>
                )}
              </div>
            </section>

            {/* Reusable Accordions FAQ Manager sub-form */}
            <section className="relative p-6 bg-white dark:bg-slate-900 border border-neutral-200/50 dark:border-slate-800/80 rounded-2xl shadow-sm">
              <FAQManager value={faqs} onChange={setFaqs} />
            </section>
          </main>

          {/* Settings Sidebar */}
          <aside className="space-y-12 lg:sticky lg:top-28 h-fit">
            {/* Design Template Picker */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">Design Layout Template</h3>
                <span className="text-[10px] font-bold text-neutral-400 uppercase">AESTHETIC</span>
              </div>

              {COMPULSORY_PAGES[slug.toLowerCase()] ? (
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Compulsory Page Lock</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Template locked to: <span className="underline decoration-indigo-500 decoration-2">{COMPULSORY_PAGES[slug.toLowerCase()].name}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">This layout page is critical for system integrity and cannot be modified or deleted.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Select Canvas Layout</Label>
                  <select
                    value={template}
                    onChange={(e) => {
                      const newTpl = e.target.value
                      setTemplate(newTpl)
                      setContent(getInitialTemplateContent(newTpl))
                    }}
                    className="w-full h-10 px-3 bg-neutral-100/50 dark:bg-neutral-900/50 border-none rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-200 dark:focus:ring-slate-800"
                  >
                    <option value="default">📰 Default Rich Text (BlockNote)</option>
                    <option value="contact">📞 Contact Directory Template</option>
                    <option value="careers">💼 Careers & Openings Template</option>
                    <option value="policy">⚖️ Terms & Policy Template</option>
                    <option value="journal">🎨 Journal Layout Template</option>
                  </select>
                </div>
              )}
            </div>

            {/* Publishing Settings */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">Publish Settings</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">{status === 'published' ? 'Live' : 'Hidden'}</span>
                  <Switch
                    checked={status === 'published'}
                    onCheckedChange={(checked) => setStatus(checked ? 'published' : 'draft')}
                    className="data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-white"
                  />
                </div>
              </div>

              {/* Social/OpenGraph og_image cover */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Social Cover Image</Label>
                  <ImageIcon className="w-3.5 h-3.5 text-neutral-300" />
                </div>
                <div className="relative group rounded-2xl p-4 overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                  <ImageUpload
                    mode="single"
                    value={ogImage}
                    onChange={(img) => setOgImage(img || '')}
                    uploadPath="pages"
                    hint="Choose display card banner"
                  />
                </div>
              </div>
            </div>

            {/* Premium SEO Panel */}
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">Search Engine Index</h3>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Meta Title Tag</Label>
                  <Input
                    placeholder="Search optimized header..."
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="h-10 text-xs border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl focus-visible:ring-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Meta Description Blurb</Label>
                  <Textarea
                    placeholder="Search snippet summary..."
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="min-h-[100px] text-xs leading-relaxed border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl focus-visible:ring-1 resize-none p-4"
                  />
                </div>

                {/* Google Style Preview Card */}
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/30 dark:border-neutral-800/30 space-y-2 select-none">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                      <Globe className="w-2.5 h-2.5 text-neutral-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 tracking-tight">Cherrywood</span>
                      <span className="text-[8px] text-neutral-400">cherrywood.com/page/{slug || 'slug'}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1 leading-snug">
                    {metaTitle || title || 'Untitled Static Page'}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-normal">
                    {metaDescription || 'Start drafting titles and SEO properties to inspect the live preview rendering...'}
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
