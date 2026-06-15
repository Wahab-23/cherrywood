'use client'

import { useState, useEffect, use } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { UserCircle, Mail, Shield, Key, Save, Loader2, CheckCircle2, ChevronLeft, Trash2, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/admin/MultiImageUpload'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const [user, setUser] = useState<any>(null)
  const [roles, setRoles] = useState<any[]>([])
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [status, setStatus] = useState('active')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<'update' | 'delete' | null>(null)

  useEffect(() => {
    fetchInitialData()
  }, [id])

  const fetchInitialData = async () => {
    try {
      const [userRes, rolesRes] = await Promise.all([
        fetch(`/api/users/${id}`),
        fetch('/api/roles?limit=100')
      ])
      
      const userData = await userRes.json()
      const rolesData = await rolesRes.json()
      
      if (rolesData.success) {
        setRoles(rolesData.data)
      }

      if (userData.success) {
        const u = userData.data
        setUser(u)
        setName(u.name || '')
        setEmail(u.email || '')
        setRoleId(u.role_id || '')
        setBio(u.bio || '')
        setProfileImage(u.profile_image || null)
        setStatus(u.status || 'active')
      } else {
        setError(userData.error || 'User not found')
      }
    } catch (err) {
      setError('Failed to fetch user details')
    } finally {
      setLoading(false)
    }
  }

  const executeUpdate = async (passwordForAuth?: string) => {
    setSaving(true)
    setError('')

    try {
      const payload: any = {
        name,
        email,
        role_id: roleId,
        bio,
        profile_image: profileImage,
        status,
      }
      if (password) payload.password = password
      if (passwordForAuth) payload.currentPassword = passwordForAuth

      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (!response.ok) {
         if (response.status === 400 && data.error?.includes('Current password is required')) {
            setPendingAction('update')
            setShowPasswordDialog(true)
            return
         }
         throw new Error(data.error || 'Failed to update user')
      }

      toast.success('User updated successfully')
      setPassword('')
      setShowPasswordDialog(false)
      setCurrentPassword('')
    } catch (err: any) {
      toast.error(err.message)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    executeUpdate()
  }

  const executeDelete = async (passwordForAuth?: string) => {
    try {
      const payload: any = {}
      if (passwordForAuth) payload.currentPassword = passwordForAuth
      
      const response = await fetch(`/api/users/${id}`, { 
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) {
         if (response.status === 400 && data.error?.includes('Current password is required')) {
            setPendingAction('delete')
            setShowPasswordDialog(true)
            return
         }
         throw new Error(data.error || 'Failed to delete user')
      }
      toast.success('User deleted successfully')
      router.push('/admin/n8_nwrr2675/users/list')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return
    executeDelete()
  }

  const handlePasswordConfirm = () => {
    if (!currentPassword) {
      toast.error("Please enter your password")
      return
    }
    if (pendingAction === 'update') {
      executeUpdate(currentPassword)
    } else if (pendingAction === 'delete') {
      executeDelete(currentPassword)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{error}</h2>
        <Button className="rounded-xl" asChild>
          <Link href="/admin/n8_nwrr2675/users/list">Back to Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-slate-900" asChild>
            <Link href="/admin/n8_nwrr2675/users/list">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit User</h1>
            <p className="text-slate-500 font-medium">Modify account details and system permissions</p>
          </div>
        </div>
        <Button onClick={handleDelete} variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-bold">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg">Profile Picture</CardTitle>
              <CardDescription>Upload a user avatar</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ImageUpload
                  mode="single"
                  value={profileImage}
                  onChange={setProfileImage}
                  uploadPath="users_profile"
              />
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{user.email}</p>
              <Badge className="bg-blue-50 text-blue-600 border-none rounded-lg px-3 py-1 font-bold uppercase text-[10px]">
                {user.role?.name || 'Member'}
              </Badge>
              <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-1 gap-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                  <Badge className={status === 'active' ? "bg-green-50 text-green-600 border-none rounded-md text-[10px] font-black uppercase" : "bg-red-50 text-red-600 border-none rounded-md text-[10px] font-black uppercase"}>
                    {status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Joined</span>
                  <span className="text-xs font-bold text-slate-900">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleUpdate} className="space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50">
                <CardTitle className="text-xl font-bold text-slate-900">User Information</CardTitle>
                <CardDescription>Update name, email, bio, and system role</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-bold">Full Name</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 rounded-xl border-slate-200 focus:ring-blue-500 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-bold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 rounded-xl border-slate-200 focus:ring-blue-500 h-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-700 font-bold">Biography</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="pl-10 rounded-xl border-slate-200 focus:ring-blue-500 min-h-[100px] py-3"
                      placeholder="Write a short biography..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-slate-700 font-bold">System Role</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        id="role"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        className="w-full pl-10 pr-4 h-11 bg-white border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900"
                        required
                      >
                        <option value="" disabled>Select a role</option>
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-slate-700 font-bold">Account Status</Label>
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl h-11">
                      <span className="text-sm font-medium text-slate-700">{status === 'active' ? 'Active' : 'Suspended'}</span>
                      <Switch 
                        checked={status === 'active'}
                        onCheckedChange={(c) => setStatus(c ? 'active' : 'suspended')}
                      />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50">
                <CardTitle className="text-xl font-bold text-slate-900">Security</CardTitle>
                <CardDescription>Reset user password (leave blank to keep current)</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-bold">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password to reset"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 rounded-xl border-slate-200 focus:ring-blue-500 h-11"
                    />
                  </div>
                </div>
              </CardContent>
              <div className="px-8 py-6 bg-slate-50 flex justify-end">
                <Button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 h-11 font-black shadow-lg shadow-blue-200"
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {saving ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        setShowPasswordDialog(open)
        if (!open) {
          setCurrentPassword('')
          setPendingAction(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Verification Required</DialogTitle>
            <DialogDescription>
              Please enter your current admin password to confirm this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Your Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handlePasswordConfirm()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handlePasswordConfirm} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirm Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
