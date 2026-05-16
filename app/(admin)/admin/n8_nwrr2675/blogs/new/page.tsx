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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

import {
    ArrowLeft,
    Globe,
    Layout,
    Search,
    Image as ImageIcon,
    CheckCircle2,
    ExternalLink,
    User as UserIcon,
    Calendar as CalendarIcon,
} from 'lucide-react'

import BlockNoteEditor, {
    BlockNoteEditorRef,
} from '@/components/blocknote/blocknoteEditor'

import ImageUpload from '@/components/admin/MultiImageUpload'

export default function NewBlogPage() {
    const router = useRouter()
    const editorRef = useRef<BlockNoteEditorRef>(null)

    const [creating, setCreating] = useState(false)
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
    const [authors, setAuthors] = useState<any[]>([])
    const [authorId, setAuthorId] = useState('')
    const [publishedAt, setPublishedAt] = useState<Date | undefined>(new Date())
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        try {
            const [catRes, userRes, meRes] = await Promise.all([
                fetch('/api/blogs/categories'),
                fetch('/api/users?limit=100'),
                fetch('/api/auth/me')
            ])

            const catData = await catRes.json()
            const userData = await userRes.json()
            const meData = await meRes.json()

            if (catData.success && Array.isArray(catData.data)) setCategories(catData.data)
            else if (Array.isArray(catData)) setCategories(catData)
            if (userData.success && Array.isArray(userData.data)) {
                // Filter for potential authors (admin, editor, author)
                setAuthors(userData.data)
            }
            if (meData.success) {
                setCurrentUser(meData.user)
                setAuthorId(meData.user.id)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to load initial data')
        }
    }

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
    }

    const handleTitleChange = (value: string) => {
        setTitle(value)

        if (!slug) {
            setSlug(generateSlug(value))
        }
    }

    const handleCreateBlog = async () => {
        setCreating(true)

        try {
            const editorContent = editorRef.current
                ? await editorRef.current.getContent()
                : content

            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                    author_id: authorId,
                    published_at: publishedAt?.toISOString(),
                }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Article created successfully')

                router.push('/admin/n8_nwrr2675/blogs')
            } else {
                toast.error(data.error || 'Failed to create article')
            }
        } catch (error) {
            console.error(error)
            toast.error('Unexpected error occurred')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl rounded-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 px-2 -ml-2"
                            onClick={() => router.push('/admin/n8_nwrr2675/blogs')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Back</span>
                        </Button>

                        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                                Status:
                            </span>

                            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${status === 'published'
                                        ? 'bg-emerald-500'
                                        : 'bg-neutral-400'
                                        }`}
                                />

                                <span className="text-[10px] font-bold uppercase tracking-tight text-neutral-600 dark:text-neutral-400">
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 mr-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                New Article
                            </span>

                            <CheckCircle2 className="w-3 h-3 text-neutral-300" />
                        </div>

                        <Button
                            onClick={handleCreateBlog}
                            disabled={creating}
                            className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 text-white rounded-full px-6 h-9 text-xs font-bold uppercase tracking-widest"
                        >
                            {creating ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                'Publish Article'
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
                    {/* Main Content */}
                    <main className="space-y-12">
                        <section className="space-y-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                    Headline
                                </Label>

                                <textarea
                                    placeholder="The Story Title..."
                                    value={title}
                                    onChange={(e) =>
                                        handleTitleChange(e.target.value)
                                    }
                                    rows={1}
                                    className="w-full text-5xl md:text-6xl font-black tracking-tight bg-transparent border-none resize-none focus:ring-0 placeholder:text-neutral-200 dark:placeholder:text-neutral-800 leading-[1.1]"
                                    onInput={(e) => {
                                        const target =
                                            e.target as HTMLTextAreaElement

                                        target.style.height = 'auto'
                                        target.style.height =
                                            target.scrollHeight + 'px'
                                    }}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                                <div className="space-y-1.5 min-w-[200px]">
                                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                        <Globe className="w-3 h-3" />
                                        URL Path
                                    </Label>

                                    <Input
                                        placeholder="article-slug"
                                        value={slug}
                                        onChange={(e) =>
                                            setSlug(e.target.value)
                                        }
                                        className="h-8 text-sm font-medium border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg px-3"
                                    />
                                </div>

                                <div className="space-y-1.5 min-w-[180px]">
                                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                        <Layout className="w-3 h-3" />
                                        Category
                                    </Label>

                                    <Select
                                        value={categoryId}
                                        onValueChange={setCategoryId}
                                    >
                                        <SelectTrigger className="h-8 border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg px-3 text-xs font-bold">
                                            <SelectValue placeholder="Categorize..." />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.id}
                                                >
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                    Lead Synopsis
                                </Label>

                                <Textarea
                                    placeholder="Write a captivating summary..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="min-h-[100px] text-lg bg-transparent resize-none border-none"
                                />
                            </div>
                        </section>

                        {/* Editor */}
                        <section>
                            <div className="bg-white rounded-2xl border border-neutral-200/50 shadow-2xl shadow-neutral-200/20 p-4">
                                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                    Article Content
                                </Label>

                                <BlockNoteEditor
                                    ref={editorRef}
                                    initialContent={content}
                                    placeholder="Begin your masterpiece..."
                                />
                            </div>
                        </section>
                    </main>

                    {/* Sidebar */}
                    <aside className="space-y-12 lg:sticky lg:top-28 h-fit">
                        {/* Publishing */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    Publishing
                                </h3>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                                        {status === 'published'
                                            ? 'Live'
                                            : 'Hidden'}
                                    </span>

                                    <Switch
                                        checked={status === 'published'}
                                        onCheckedChange={(checked) =>
                                            setStatus(
                                                checked
                                                    ? 'published'
                                                    : 'draft'
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                        Cover Art
                                    </Label>

                                    <ImageIcon className="w-3 h-3 text-neutral-300" />
                                </div>

                                <div className="relative group rounded-2xl p-4 overflow-hidden border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                                    <ImageUpload
                                        mode="single"
                                        value={heroImage}
                                        onChange={(img) => setHeroImage(img || '')}
                                        uploadPath="blogs"
                                        hint="Drop cover image here"
                                    />
                                </div>
                            </div>

                            {/* Author Assignment */}
                            <div className="space-y-4 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                        Assigned Author
                                    </Label>
                                    <UserIcon className="w-3 h-3 text-neutral-300" />
                                </div>

                                <Select value={authorId} onValueChange={setAuthorId}>
                                    <SelectTrigger className="h-10 border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl px-3 text-xs font-medium">
                                        <SelectValue placeholder="Select author..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-neutral-200 dark:border-neutral-800 shadow-2xl">
                                        {authors.map((author) => (
                                            <SelectItem key={author.id} value={author.id} className="text-xs font-medium">
                                                <div className="flex items-center gap-2">
                                                    {author.profile_image && (
                                                        <img src={author.profile_image} alt="" className="w-4 h-4 rounded-full" />
                                                    )}
                                                    <span>{author.name}</span>
                                                    <span className="text-[9px] uppercase tracking-tighter opacity-50">({author.role.name})</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Scheduling */}
                            <div className="space-y-4 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                        Publish Date
                                    </Label>
                                    <CalendarIcon className="w-3 h-3 text-neutral-300" />
                                </div>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start text-left font-medium h-10 bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl px-3 border-none hover:bg-neutral-100 dark:hover:bg-neutral-900",
                                                !publishedAt && "text-neutral-500"
                                            )}
                                        >
                                            <span className="text-xs">
                                                {publishedAt ? format(publishedAt, "PPP") : "Pick a date"}
                                            </span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={publishedAt}
                                            onSelect={setPublishedAt}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <p className="text-[9px] text-neutral-400 leading-relaxed px-1">
                                    Schedule this article for future release or backdate it.
                                </p>
                            </div>
                        </div>

                        {/* SEO */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    Search Engine
                                </h3>

                                <Search className="w-3 h-3 text-neutral-400" />
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 ml-1">
                                        Meta Title
                                    </Label>

                                    <Input
                                        placeholder="SEO optimized title..."
                                        value={metaTitle}
                                        onChange={(e) =>
                                            setMetaTitle(e.target.value)
                                        }
                                        className="h-10 text-xs border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 ml-1">
                                        Meta Snippet
                                    </Label>

                                    <Textarea
                                        placeholder="Brief blurb for Google..."
                                        value={metaDescription}
                                        onChange={(e) =>
                                            setMetaDescription(
                                                e.target.value
                                            )
                                        }
                                        className="min-h-[100px] text-xs border-none bg-neutral-100/50 dark:bg-neutral-900/50 rounded-xl resize-none p-4"
                                    />
                                </div>

                                {/* SEO Preview */}
                                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/30 dark:border-neutral-800/30 space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-5 h-5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                                            <Globe className="w-2.5 h-2.5 text-neutral-400" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 tracking-tight">
                                                Cherrywood
                                            </span>

                                            <span className="text-[8px] text-neutral-400">
                                                cherrywood.com/blog
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1">
                                        {metaTitle ||
                                            title ||
                                            'Untitled Masterpiece'}
                                    </h4>

                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                        {metaDescription ||
                                            description ||
                                            'Start writing to preview search appearance...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="pt-8 flex flex-col gap-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-between text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 text-[10px] font-bold uppercase tracking-widest"
                            >
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