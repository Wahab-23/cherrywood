'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Eye, Layout, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function CategoriesPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [meta, setMeta] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchCategories()
    }, [searchQuery])

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/blogs/categories?search=${searchQuery}`)
            const data = await response.json()
            if (data.success) {
                setCategories(data.data)
                setMeta({ total: data.totalCategories, pages: data.totalPages })
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error)
            toast.error('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return

        try {
            const response = await fetch('/api/blogs/categories', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            })
            const data = await response.json()
            if (data.success) {
                toast.success('Category deleted successfully')
                fetchCategories()
            } else {
                toast.error(data.message || 'Failed to delete category')
            }
        } catch (error) {
            console.error('Failed to delete category:', error)
            toast.error('Unexpected error occurred')
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Category Architecture</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Structure and organize your publication topics</p>
                </div>
                <Button
                    onClick={() => router.push(`/admin/n8_nwrr2675/blogs/new_category`)}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none font-black h-11 px-6 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Category
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Taxonomy Overview</CardTitle>
                        <CardDescription className="font-medium text-slate-500 dark:text-slate-400">
                            Total: <span className="text-blue-600 dark:text-blue-400 font-bold">{meta?.total || 0}</span> categories
                        </CardDescription>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl border-slate-200 dark:border-neutral-800 h-10 bg-slate-50/50 dark:bg-neutral-950/50 focus:bg-white dark:focus:bg-neutral-900 transition-all"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableRow className="border-b border-slate-50 dark:border-slate-800">
                                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Category Detail</TableHead>
                                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">URL Slug</TableHead>
                                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Associations</TableHead>
                                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse">
                                        <TableCell colSpan={4} className="px-8 py-8">
                                            <div className="h-4 w-full bg-slate-100 dark:bg-neutral-800 rounded"></div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : categories.length > 0 ? (
                                categories.map((category) => (
                                    <TableRow key={category.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800">
                                        <TableCell className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                                                    <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{category.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Public Category</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-lg bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-neutral-700 font-mono text-[10px] px-2 py-0.5">
                                                /{category.slug}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-tight">
                                                <FileText className="w-3.5 h-3.5" />
                                                {category._count?.blogs || 0} Articles
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    onClick={() => router.push(`/blogs/categories/${category.slug}`)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                    onClick={() => router.push(`/admin/n8_nwrr2675/blogs/categories/${category.id}`)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Layout className="w-8 h-8 text-slate-200 dark:text-neutral-800" />
                                            <p className="text-slate-500 dark:text-slate-400 font-bold">No categories found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}