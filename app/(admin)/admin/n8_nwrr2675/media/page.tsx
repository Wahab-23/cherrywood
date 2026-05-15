'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Copy,
  Trash2,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  FolderPlus,
  Folder,
  ChevronRight,
  Home,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MediaItem {
  name: string
  url?: string
  path?: string
  type: 'file' | 'folder'
  size?: number
  mtime: string
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPath, setCurrentPath] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<MediaItem | null>(null)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)

  const fetchItems = async (path: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/upload?path=${encodeURIComponent(path)}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setItems(data)
    } catch (error) {
      toast.error('Failed to fetch media items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems(currentPath)
  }, [currentPath])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', currentPath)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        toast.success('File uploaded successfully')
        fetchItems(currentPath)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('An error occurred during upload')
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName) return
    setCreatingFolder(true)
    const formData = new FormData()
    formData.append('action', 'createFolder')
    formData.append('name', newFolderName)
    formData.append('path', currentPath)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        toast.success('Folder created successfully')
        setCreateFolderOpen(false)
        setNewFolderName('')
        fetchItems(currentPath)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to create folder')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setCreatingFolder(false)
    }
  }

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    toast.success('Link copied to clipboard')
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    if (deleteConfirm.type === 'folder' && deleteInput.toLowerCase() !== 'delete') {
      toast.error('Please type "delete" to confirm folder deletion')
      return
    }

    setDeleting(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: deleteConfirm.url,
          path: deleteConfirm.path,
          type: deleteConfirm.type
        })
      })

      if (res.ok) {
        toast.success(`${deleteConfirm.type === 'folder' ? 'Folder' : 'File'} deleted successfully`)
        setItems(items.filter(i =>
          deleteConfirm.type === 'folder' ? i.path !== deleteConfirm.path : i.url !== deleteConfirm.url
        ))
        setDeleteConfirm(null)
        setDeleteInput('')
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to delete')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setDeleting(false)
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const navigateTo = (path: string) => {
    setCurrentPath(path)
  }

  const breadcrumbs = currentPath ? currentPath.split('/').filter(Boolean) : []

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Media Library</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
            <button
              onClick={() => navigateTo('')}
              className="hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
            >
              <Home className="w-4 h-4 mr-1.5" />
              Root
            </button>
            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <button
                  onClick={() => navigateTo(breadcrumbs.slice(0, idx + 1).join('/'))}
                  className="hover:text-blue-600 font-medium transition-colors"
                >
                  {crumb}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search assets..."
              className="pl-10 w-full md:w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold flex items-center gap-2 h-11 shadow-sm"
            onClick={() => setCreateFolderOpen(true)}
          >
            <FolderPlus className="w-4 h-4 text-blue-600" />
            New Folder
          </Button>
          <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none font-black h-11 px-6" asChild>
            <label className="cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload Asset'}
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
            </label>
          </Button>
        </div>
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-blue-100 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50 transition-all">
          <div className="w-20 h-20 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-6">
            <ImageIcon className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Directory is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs text-center mt-2 font-medium">
            {searchQuery ? "No matches found for your search." : "This folder is currently empty. Start by uploading an image or creating a subfolder."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.type === 'folder' ? item.path : item.url}
              className={cn(
                "group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 rounded-2xl cursor-pointer",
                item.type === 'folder' && "hover:border-blue-200 dark:hover:border-blue-900"
              )}
              onClick={() => item.type === 'folder' && navigateTo(item.path!)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                  {item.type === 'folder' ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 transition-transform group-hover:scale-105 duration-500">
                      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900/20 transition-all">
                        <Folder className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => setDeleteConfirm(item)}
                          title="Delete Folder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={item.url!}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full w-10 h-10 bg-white/95 hover:bg-white text-slate-900 shadow-lg scale-90 group-hover:scale-100 transition-transform delay-75"
                          onClick={() => copyToClipboard(item.url!)}
                          title="Copy Link"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full w-10 h-10 bg-white/95 hover:bg-white text-slate-900 shadow-lg scale-90 group-hover:scale-100 transition-transform delay-100"
                          asChild
                          title="View Original"
                        >
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="rounded-full w-10 h-10 bg-red-500 hover:bg-red-600 text-white shadow-lg scale-90 group-hover:scale-100 transition-transform delay-150"
                          onClick={() => setDeleteConfirm(item)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800/50">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight mb-1" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {item.type === 'folder' ? 'Folder' : formatSize(item.size!)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {new Date(item.mtime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Folder Dialog */}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-slate-900">
          <div className="p-8">
            <DialogHeader className="mb-6">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                <FolderPlus className="w-7 h-7" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create New Folder</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-base mt-2">
                Enter a name for your new folder in <span className="font-bold text-blue-600">/{currentPath || 'root'}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mb-8">
              <Input
                placeholder="Folder name"
                className="h-12 px-4 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-blue-500 focus:border-blue-500 text-base font-medium"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                autoFocus
              />
            </div>

            <DialogFooter className="flex gap-3 sm:justify-end">
              <Button
                variant="ghost"
                className="rounded-xl font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all px-6 h-11"
                onClick={() => setCreateFolderOpen(false)}
                disabled={creatingFolder}
              >
                Cancel
              </Button>
              <Button
                className="rounded-xl font-bold px-8 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 bg-blue-600 hover:bg-blue-700 transition-all h-11"
                onClick={handleCreateFolder}
                disabled={creatingFolder || !newFolderName}
              >
                {creatingFolder ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Folder'
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => {
        if (!open) {
          setDeleteConfirm(null)
          setDeleteInput('')
        }
      }}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-slate-900">
          <div className="p-8">
            <DialogHeader className="mb-6">
              <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {deleteConfirm?.type === 'folder' ? 'Delete Folder?' : 'Delete Asset?'}
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-base mt-2">
                {deleteConfirm?.type === 'folder' ? (
                  <>
                    You're about to delete the folder <span className="font-bold text-slate-900 dark:text-white">"/{deleteConfirm.path}"</span> and all its contents.
                    <span className="block mt-2 text-red-500 font-bold uppercase tracking-wider text-xs">This action is irreversible.</span>
                  </>
                ) : (
                  <>
                    You're about to delete <span className="font-bold text-slate-900 dark:text-white">"{deleteConfirm?.name}"</span>.
                    This action is permanent and cannot be undone.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            {deleteConfirm?.type === 'file' && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-inner mb-6">
                <Image src={deleteConfirm.url!} alt="To delete" fill className="object-contain p-2" />
              </div>
            )}

            {deleteConfirm?.type === 'folder' && (
              <div className="space-y-3 mb-8">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Please type <span className="text-red-500 uppercase">delete</span> to confirm:
                </p>
                <Input
                  placeholder="Type 'delete' here..."
                  className="h-12 px-4 rounded-xl border-red-200 dark:border-red-900/30 focus:ring-red-500 focus:border-red-500 text-base font-medium bg-red-50/30 dark:bg-red-900/5"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <DialogFooter className="flex gap-3 sm:justify-end">
              <Button
                variant="ghost"
                className="rounded-xl font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all px-6 h-11"
                onClick={() => {
                  setDeleteConfirm(null)
                  setDeleteInput('')
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="rounded-xl font-bold px-8 shadow-lg shadow-red-200 dark:shadow-red-900/20 bg-red-600 hover:bg-red-700 transition-all h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={deleting || (deleteConfirm?.type === 'folder' && deleteInput.toLowerCase() !== 'delete')}
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  deleteConfirm?.type === 'folder' ? 'Delete Everything' : 'Delete Asset'
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
