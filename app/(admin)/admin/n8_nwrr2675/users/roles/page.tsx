'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Shield, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function RolesPage() {
    const [roles, setRoles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    
    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
    const [currentRole, setCurrentRole] = useState<{ id?: string, name: string }>({ name: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchRoles()
    }, [searchQuery])

    const fetchRoles = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/roles?search=${searchQuery}&limit=100`)
            const data = await response.json()
            if (data.success) {
                setRoles(data.data)
            }
        } catch (error) {
            toast.error('Failed to load roles')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveRole = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const url = dialogMode === 'edit' ? `/api/roles/${currentRole.id}` : '/api/roles'
            const method = dialogMode === 'edit' ? 'PUT' : 'POST'
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: currentRole.name.toLowerCase() })
            })
            
            const data = await response.json()
            if (data.success) {
                toast.success(`Role ${dialogMode === 'edit' ? 'updated' : 'created'} successfully`)
                setIsDialogOpen(false)
                fetchRoles()
            } else {
                toast.error(data.message || data.error || 'Failed to save role')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteRole = async (id: string, name: string) => {
        if (['admin', 'editor', 'author', 'buyer'].includes(name.toLowerCase())) {
            toast.error("Cannot delete core system roles")
            return
        }
        
        if (!confirm('Are you sure you want to delete this role?')) return

        try {
            const response = await fetch(`/api/roles/${id}`, { method: 'DELETE' })
            const data = await response.json()
            if (data.success) {
                toast.success('Role deleted successfully')
                fetchRoles()
            } else {
                toast.error(data.error || 'Failed to delete role')
            }
        } catch (error) {
            toast.error('Unexpected error occurred')
        }
    }

    const openCreateDialog = () => {
        setDialogMode('create')
        setCurrentRole({ name: '' })
        setIsDialogOpen(true)
    }

    const openEditDialog = (role: any) => {
        if (['admin', 'editor', 'author', 'buyer'].includes(role.name.toLowerCase())) {
            toast.error("Core system roles cannot be renamed")
            return
        }
        setDialogMode('edit')
        setCurrentRole({ id: role.id, name: role.name })
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Roles Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Define system roles to group users logically</p>
                </div>
                <Button
                    onClick={openCreateDialog}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none font-black h-11 px-6 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Role
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">All Roles</CardTitle>
                        <CardDescription className="font-medium text-slate-500 dark:text-slate-400">
                            Total: <span className="text-blue-600 dark:text-blue-400 font-bold">{roles.length}</span> roles available
                        </CardDescription>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search roles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl border-slate-200 dark:border-neutral-800 h-10 bg-slate-50/50 dark:bg-neutral-950/50 focus:bg-white dark:focus:bg-neutral-900 transition-all"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-neutral-800">
                                <TableHead className="pl-8 h-14 font-bold text-slate-500 dark:text-slate-400">Role Name</TableHead>
                                <TableHead className="h-14 font-bold text-slate-500 dark:text-slate-400">System Role</TableHead>
                                <TableHead className="h-14 font-bold text-slate-500 dark:text-slate-400">Users</TableHead>
                                <TableHead className="pr-8 h-14 text-right font-bold text-slate-500 dark:text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : roles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        No roles found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role) => {
                                    const isSystem = ['admin', 'editor', 'author', 'buyer'].includes(role.name.toLowerCase());
                                    return (
                                        <TableRow key={role.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50 border-b border-slate-50 dark:border-neutral-800/50 group transition-colors">
                                            <TableCell className="pl-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                        <Shield className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-slate-900 dark:text-white capitalize">{role.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {isSystem ? (
                                                    <Badge className="bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-slate-300 border-none font-bold uppercase text-[10px]">System</Badge>
                                                ) : (
                                                    <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-none font-bold uppercase text-[10px]">Custom</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-slate-600 dark:text-slate-400">{role._count?.users || 0} users</span>
                                            </TableCell>
                                            <TableCell className="pr-8 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                                        onClick={() => openEditDialog(role)}
                                                        disabled={isSystem}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-9 w-9 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                                                        onClick={() => handleDeleteRole(role.id, role.name)}
                                                        disabled={isSystem}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{dialogMode === 'create' ? 'Create New Role' : 'Edit Role'}</DialogTitle>
                        <DialogDescription>
                            {dialogMode === 'create' ? 'Add a new custom role to group your users.' : 'Update the name of the role.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveRole}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="font-bold">Role Name</Label>
                                <Input
                                    id="name"
                                    value={currentRole.name}
                                    onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                                    placeholder="e.g. Moderator"
                                    className="rounded-xl h-11"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving || !currentRole.name} className="rounded-xl h-11 bg-slate-900 text-white hover:bg-slate-800">
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Role
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
