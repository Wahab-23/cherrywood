'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Layout, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function NewCategoryPage() {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
    })

    const generateSlug = (value: string) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
    }

    const handleNameChange = (value: string) => {
        setFormData({
            name: value,
            slug: generateSlug(value),
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.slug) {
            toast.error('Please fill all fields')
            return
        }

        try {
            setLoading(true)

            const response = await fetch('/api/blogs/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Category created successfully')

                router.push('/admin/n8_nwrr2675/blogs/categories')
            } else {
                toast.error(data.message || 'Failed to create category')
            }
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Create Category
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Add a new category to organize your blog content
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="rounded-xl"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                            <Layout className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                            <CardTitle className="text-xl">
                                Category Details
                            </CardTitle>

                            <CardDescription>
                                Configure your new blog category
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="font-semibold">
                                Category Name
                            </Label>

                            <Input
                                placeholder="Technology"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="h-11 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold">
                                URL Slug
                            </Label>

                            <Input
                                placeholder="technology"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        slug: generateSlug(e.target.value),
                                    })
                                }
                                className="h-11 rounded-xl font-mono"
                            />

                            <p className="text-xs text-slate-500">
                                Final URL:
                                <span className="font-mono ml-1 text-blue-600 dark:text-blue-400">
                                    /blogs/categories/{formData.slug || 'category-slug'}
                                </span>
                            </p>
                        </div>

                        <div className="pt-4 flex items-center gap-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl h-11 px-6"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Category'
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="rounded-xl h-11 px-6"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}