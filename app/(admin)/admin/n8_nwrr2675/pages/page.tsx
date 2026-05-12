'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'

export default function PagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)

  const pages = [
    { id: '1', title: 'About Us', slug: 'about-us', status: 'published', date: '2026-05-01' },
    { id: '2', title: 'Contact', slug: 'contact', status: 'published', date: '2026-05-01' },
    { id: '3', title: 'Terms & Conditions', slug: 'terms-conditions', status: 'draft', date: '2026-05-02' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pages</h1>
          <p className="text-slate-600 mt-2">Manage static pages</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
              <DialogDescription>Add a new static page</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Page title" />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="page-slug" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input id="metaTitle" placeholder="Meta title" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select id="status" className="w-full px-3 py-2 border border-slate-200 rounded-md">
                    <option>draft</option>
                    <option>published</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="metaDesc">Meta Description</Label>
                <Textarea id="metaDesc" placeholder="Meta description" />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Page content" className="min-h-[300px]" />
              </div>
              <Button className="w-full">Create Page</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Pages</CardTitle>
              <CardDescription>Total: {pages.length} pages</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-slate-600">/{page.slug}</TableCell>
                  <TableCell>
                    <Badge className={page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{page.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
