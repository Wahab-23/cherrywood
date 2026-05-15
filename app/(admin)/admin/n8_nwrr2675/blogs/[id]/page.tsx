'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import {
    Save,
    ArrowLeft,
    Globe,
    Layout,
    Eye,
    Settings2,
    Search,
    Image as ImageIcon,
    CheckCircle2,
    Clock,
    ChevronDown,
    ExternalLink
} from 'lucide-react'

import BlockNoteEditor, {
    BlockNoteEditorRef,
} from '@/components/blocknote/blocknoteEditor'

import ImageUpload from '@/components/admin/MultiImageUpload'

export default function BlogPage() {
    const router = useRouter()
    const params = useParams()
    const editorRef = useRef<BlockNoteEditorRef>(null)

    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [categories, setCategories] = useState<any[]>([])

    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [status, setStatus] = useState('draft')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [metaTitle, setMetaTitle] = useState('')
    const [metaDescription, setMetaDescription] = useState('')
    const [heroImage, setHeroImage] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogRes, catRes] = await Promise.all([
                    fetch(`/api/blogs/${params.id}`),
                    fetch('/api/blogs/categories'),
                ])

                const blogData = await blogRes.json()
                const catData = await catRes.json()

                if (blogRes.ok) {
                    setTitle(blogData.title || '')
                    setSlug(blogData.slug || '')
                    setCategoryId(blogData.category_id || '')
                    setStatus(blogData.status || 'draft')
                    setDescription(blogData.short_description || '')
                    setContent(blogData.content || '')
                    setMetaTitle(blogData.meta_title || '')
                    setMetaDescription(blogData.meta_description || '')
                    setHeroImage(blogData.hero_image || '')
                } else {
                    toast.error('Failed to load article')
                }

                if (Array.isArray(catData)) {
                    setCategories(catData)
                }
            } catch (error) {
                console.error(error)
                toast.error('Something went wrong')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) fetchData()
    }, [params.id])

    const handleUpdateBlog = async () => {
        setUpdating(true)
        try {
            const editorContent = editorRef.current
                ? await editorRef.current.getContent()
                : content

            const response = await fetch(`/api/blogs/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    status,
                    category_id: categoryId,
                    short_description: description,
                    content: editorContent,
                    meta_title: metaTitle,
                    meta_description: metaDescription,
                    hero_image: heroImage,
                }),
            })

            const data = await response.json()
            if (response.ok) {
                toast.success('Article updated')
                router.push('/admin/n8_nwrr2675/blogs')
            } else {
                toast.error(data.error || 'Failed to update article')
            }
        } catch (error) {
            console.error(error)
            toast.error('Unexpected error occurred')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-neutral-200 border-t-neutral-800 dark:border-neutral-800 dark:border-t-neutral-200" />
                    <p className="text-xs font-medium tracking-widest uppercase text-neutral-400">Loading Article</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            {/* Zen Action Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl rounded-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-2 -ml-2"
                            onClick={() => router.push('/admin/n8_nwrr2675/blogs')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Back</span>
                        </Button>
                        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Status:</span>
                            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
                                <span className={`w-1.5 h-1.5 rounded-full ${status === 'published' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-tight text-neutral-600 dark:text-neutral-400">{status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 mr-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Auto-saved</span>
                            <CheckCircle2 className="w-3 h-3 text-neutral-300" />
                        </div>
                        <Button
                            onClick={handleUpdateBlog}
                            disabled={updating}
                            className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 text-white rounded-full px-6 h-9 text-xs font-bold uppercase tracking-widest shadow-lg shadow-neutral-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                        >
                            {updating ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
                    {/* Writing Canvas */}
                    <main className="space-y-12">
                        {/* Article Info Section */}
                        <section className="space-y-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Headline</Label>
                                <textarea
                                    placeholder="The Story Title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    rows={1}
                                    className="w-full text-5xl md:text-6xl font-black tracking-tight bg-transparent border-none resize-none focus:ring-0 placeholder:text-neutral-200 dark:placeholder:text-neutral-800 transition-all leading-[1.1]"
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = target.scrollHeight + 'px';
                                    }}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                                <div className="space-y-1.5 min-w-[200px]">
                                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> URL Path
                                    </Label>
                                    <Input
                                        placeholder="article-slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="h-8 text-sm font-medium border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg px-3 focus-visible:ring-1 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-800"
                                    />
                                </div>

                                <div className="space-y-1.5 min-w-[180px]">
                                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                        <Layout className="w-3 h-3" /> Category
                                    </Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger className="h-8 border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg px-3 text-xs font-bold">
                                            <SelectValue placeholder="Categorize..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-neutral-200 dark:border-neutral-800 shadow-2xl">
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id} className="text-xs font-medium focus:bg-neutral-50 dark:focus:bg-neutral-900">
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Lead Synopsis</Label>
                                <Textarea
                                    placeholder="Write a captivating summary of your article..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[100px] text-lg bg-transparent focus:ring-0 focus-visible:outline-0 resize-none placeholder:text-neutral-300 dark:placeholder:text-neutral-700 p-2"
                                />
                            </div>
                        </section>

                        {/* Content Area */}
                        <section className="relative group">
                            <div className="bg-white rounded-2xl border border-neutral-200/50 shadow-2xl shadow-neutral-200/20 min-h-fit p-4 transition-all">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Article Content</Label>
                                <BlockNoteEditor
                                    ref={editorRef}
                                    initialContent={content}
                                    placeholder="Begin your masterpiece..."
                                />
                            </div>
                        </section>
                    </main>

                    {/* Minimal Sidebar */}
                    <aside className="space-y-12 lg:sticky lg:top-28 h-fit">
                        {/* Visibility & Settings */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">Publishing</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{status === 'published' ? 'Live' : 'Hidden'}</span>
                                    <Switch
                                        checked={status === 'published'}
                                        onCheckedChange={(checked) => setStatus(checked ? 'published' : 'draft')}
                                        className="data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Featured Image - Premium Mode */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Cover Art</Label>
                                    <ImageIcon className="w-3 h-3 text-neutral-300" />
                                </div>
                                <div className="relative group rounded-2xl p-4 overflow-hidden border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
                                    <ImageUpload
                                        mode="single"
                                        value={heroImage}
                                        onChange={(img) => setHeroImage(img || '')}
                                        uploadPath="blogs"
                                        hint="Drop cover image here"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEO Section - Minimalist */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">Search Engine</h3>
                                <Search className="w-3 h-3 text-neutral-400" />
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Meta Title</Label>
                                    <Input
                                        placeholder="SEO optimized title..."
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        className="h-10 text-xs border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Meta Snippet</Label>
                                    <Textarea
                                        placeholder="Brief blurb for Google..."
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        className="min-h-[100px] text-xs leading-relaxed border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl focus-visible:ring-1 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-800 resize-none p-4"
                                    />
                                </div>

                                {/* Google Style Preview */}
                                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/30 dark:border-neutral-800/30 space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-5 h-5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                                            <Globe className="w-2.5 h-2.5 text-neutral-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 tracking-tight">Cherrywood</span>
                                            <span className="text-[8px] text-neutral-400">cherrywood.com/blog</span>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1 leading-snug">
                                        {metaTitle || title || 'Untitled Masterpiece'}
                                    </h4>
                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-normal">
                                        {metaDescription || description || 'Start writing to see how your article appears in search results...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Extra Actions */}
                        <div className="pt-8 flex flex-col gap-2">
                            <Button variant="ghost" className="w-full justify-between text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 text-[10px] font-bold uppercase tracking-widest">
                                <span>Preview Article</span>
                                <ExternalLink className="w-3 h-3" />
                            </Button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}