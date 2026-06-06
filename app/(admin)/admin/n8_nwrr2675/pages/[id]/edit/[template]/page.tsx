'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'

import { usePage } from '@/hooks/pages/usePage'
import { usePageEditor } from '@/hooks/pages/usePageEditor'
import { usePageSEO } from '@/hooks/pages/usePageSEO'
import { usePagePublishing } from '@/hooks/pages/usePagePublishing'

import PageEditorShell from '@/components/admin/page-editor/PageEditorShell'
import BlockNoteEditor from '@/components/blocknote/blocknoteEditor'
import HomepageEditor from '@/components/admin/HomepageEditor'
import ContactEditor from '@/components/admin/ContactEditor'
import CareersEditor from '@/components/admin/CareersEditor'
import PolicyEditor from '@/components/admin/PolicyEditor'
import JournalEditor from '@/components/admin/JournalEditor'

// ─── Loading Screen ──────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 gap-4 animate-pulse">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin dark:border-white" />
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">
        Loading Page Canvas…
      </p>
    </div>
  )
}

// ─── Template Editor Dispatcher ───────────────────────────────────────────────

function TemplateEditor({
  template,
  content,
  onContentChange,
  editorRef,
}: {
  template: string
  content: string
  onContentChange: (v: string) => void
  editorRef: React.RefObject<any>
}) {
  switch (template) {
    case 'home':
      return <HomepageEditor value={content} onChange={onContentChange} />
    case 'contact':
      return <ContactEditor value={content} onChange={onContentChange} />
    case 'careers':
      return <CareersEditor value={content} onChange={onContentChange} />
    case 'policy':
      return <PolicyEditor value={content} onChange={onContentChange} />
    case 'journal':
      return <JournalEditor value={content} onChange={onContentChange} />
    default:
      return (
        <>
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1 block mb-3">
            Page Document Body
          </Label>
          <BlockNoteEditor
            ref={editorRef}
            initialContent={content}
            placeholder="Define your beautiful static page structure..."
          />
        </>
      )
  }
}

// ─── Inner Editor Component ───────────────────────────────────────────────────

function PageEditorInner({ page, resolvedTemplate, id, urlTemplate }: any) {
  const router = useRouter()

  const editor = usePageEditor(page, resolvedTemplate)
  const seo = usePageSEO(page)
  const publishing = usePagePublishing(page)

  // If the URL template param doesn't match the resolved template, redirect
  useEffect(() => {
    if (resolvedTemplate && urlTemplate !== resolvedTemplate) {
      router.replace(`/admin/n8_nwrr2675/pages/${id}/edit/${resolvedTemplate}`)
    }
  }, [resolvedTemplate, urlTemplate, id, router])

  // ── Save handler ───────────────────────────────────────────────────────────
  const handleSave = () => {
    editor.save({
      status: publishing.status,
      ...seo.seoValues,
    })
  }

  return (
    <PageEditorShell
      saving={editor.saving}
      onSave={handleSave}
      template={resolvedTemplate}
      slug={editor.slug}
      title={editor.title}
      onTitleChange={editor.setTitle}
      onSlugChange={editor.setSlug}
      status={publishing.status}
      onStatusToggle={publishing.toggle}
      metaTitle={seo.metaTitle}
      onMetaTitleChange={seo.setMetaTitle}
      metaDescription={seo.metaDescription}
      onMetaDescriptionChange={seo.setMetaDescription}
      ogImage={seo.ogImage}
      onOgImageChange={seo.setOgImage}
      faqs={editor.faqs}
      onFaqsChange={editor.setFaqs}
    >
      <TemplateEditor
        template={resolvedTemplate}
        content={editor.content}
        onContentChange={editor.setContent}
        editorRef={editor.editorRef}
      />
    </PageEditorShell>
  )
}

// ─── Main Page Wrapper ────────────────────────────────────────────────────────

export default function PageEditorRoute() {
  const params = useParams()
  const id = params.id as string
  const urlTemplate = params.template as string

  // ── Data layer ─────────────────────────────────────────────────────────────
  const { page, template: resolvedTemplate, loading } = usePage(id)

  if (loading || !page) return <LoadingScreen />

  return (
    <PageEditorInner
      page={page}
      resolvedTemplate={resolvedTemplate}
      id={id}
      urlTemplate={urlTemplate}
    />
  )
}
