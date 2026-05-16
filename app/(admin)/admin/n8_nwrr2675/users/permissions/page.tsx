'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2, Save, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'

const RESOURCES = [
    { id: 'users', label: 'Users Management' },
    { id: 'roles', label: 'Roles & Permissions' },
    { id: 'blogs', label: 'Blogs & Articles' },
    { id: 'projects', label: 'Projects' },
    { id: 'pages', label: 'Static Pages' },
    { id: 'media', label: 'Media Library' },
]

const ACTIONS = [
    { id: 'read', label: 'Read' },
    { id: 'create', label: 'Create' },
    { id: 'update', label: 'Update' },
    { id: 'delete', label: 'Delete' },
]

export default function PermissionsPage() {
    const [roles, setRoles] = useState<any[]>([])
    const [selectedRoleId, setSelectedRoleId] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    
    // State to hold the current configured permissions
    // Format: { 'users': ['read', 'create'], 'blogs': true }
    const [permissions, setPermissions] = useState<Record<string, any>>({})

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/roles?limit=100')
            const data = await response.json()
            if (data.success) {
                setRoles(data.data)
                if (data.data.length > 0 && !selectedRoleId) {
                    setSelectedRoleId(data.data[0].id)
                    parseAccessData(data.data[0].access)
                }
            }
        } catch (error) {
            toast.error('Failed to load roles')
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = (roleId: string) => {
        setSelectedRoleId(roleId)
        const role = roles.find(r => r.id === roleId)
        if (role) {
            parseAccessData(role.access)
        }
    }

    const parseAccessData = (accessJson: any) => {
        if (!accessJson) {
            setPermissions({})
            return
        }
        
        let parsed = accessJson
        if (typeof accessJson === 'string') {
            try {
                parsed = JSON.parse(accessJson)
            } catch (e) {
                parsed = {}
            }
        }
        setPermissions(parsed || {})
    }

    const handleTogglePermission = (resourceId: string, actionId: string, checked: boolean) => {
        setPermissions(prev => {
            const current = prev[resourceId]
            
            // If currently `true` (all access), convert to an array of all actions first
            let accessArray = current === true 
                ? ACTIONS.map(a => a.id) 
                : (Array.isArray(current) ? [...current] : [])

            if (checked) {
                if (!accessArray.includes(actionId)) {
                    accessArray.push(actionId)
                }
            } else {
                accessArray = accessArray.filter(a => a !== actionId)
            }

            // If all 4 are selected, we can simplify to `true`
            if (accessArray.length === ACTIONS.length) {
                return { ...prev, [resourceId]: true }
            }

            return { ...prev, [resourceId]: accessArray }
        })
    }

    const hasPermission = (resourceId: string, actionId: string) => {
        const current = permissions[resourceId]
        if (current === true) return true
        if (Array.isArray(current) && current.includes(actionId)) return true
        return false
    }

    const handleSavePermissions = async () => {
        if (!selectedRoleId) return
        
        setSaving(true)
        try {
            const response = await fetch(`/api/roles/${selectedRoleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access: permissions })
            })
            
            const data = await response.json()
            if (data.success) {
                toast.success('Permissions updated successfully')
                // Update local roles state
                setRoles(roles.map(r => r.id === selectedRoleId ? { ...r, access: permissions } : r))
            } else {
                toast.error(data.message || 'Failed to save permissions')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    const currentRole = roles.find(r => r.id === selectedRoleId)
    const isAdmin = currentRole?.name.toLowerCase() === 'admin'

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Permissions Matrix</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Configure granular access controls for each system role</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={selectedRoleId} onValueChange={handleRoleChange} disabled={loading}>
                        <SelectTrigger className="w-[200px] h-11 rounded-xl bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {roles.map(role => (
                                <SelectItem key={role.id} value={role.id} className="capitalize rounded-lg">
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={handleSavePermissions}
                        disabled={loading || saving || isAdmin}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 font-black h-11 px-8 transition-all active:scale-95"
                    >
                        {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                        Save Access
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-neutral-800">
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                        {currentRole?.name || 'Select a role'} Permissions
                    </CardTitle>
                    <CardDescription className="font-medium text-slate-500 dark:text-slate-400">
                        Toggle specific actions for various system resources.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isAdmin ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Role</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                                    The <span className="font-bold text-slate-700 dark:text-slate-300">admin</span> role has unrestricted access to all system resources. Its permissions cannot be modified.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 dark:divide-neutral-800/50">
                            {RESOURCES.map(resource => (
                                <div key={resource.id} className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                                    <div className="w-64">
                                        <h4 className="font-bold text-slate-900 dark:text-white">{resource.label}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure access for {resource.label.toLowerCase()}</p>
                                    </div>
                                    <div className="flex-1 flex flex-wrap gap-x-8 gap-y-4">
                                        {ACTIONS.map(action => (
                                            <div key={action.id} className="flex items-center gap-3">
                                                <Switch 
                                                    id={`${resource.id}-${action.id}`}
                                                    checked={hasPermission(resource.id, action.id)}
                                                    onCheckedChange={(checked) => handleTogglePermission(resource.id, action.id, checked)}
                                                />
                                                <Label htmlFor={`${resource.id}-${action.id}`} className="font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
                                                    {action.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
