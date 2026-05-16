'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { UserCircle, Mail, Shield, Key, Save, Loader2, ChevronLeft, FileText, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/admin/MultiImageUpload'
import { toast } from 'sonner'

export default function NewUserPage() {
  const router = useRouter()
  
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

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles?limit=100')
      const data = await response.json()
      if (data.success) {
        setRoles(data.data)
      }
    } catch (err) {
      toast.error('Failed to fetch roles')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password) {
      toast.error('Password is required for new users')
      return
    }
    
    if (!roleId) {
      toast.error('Role is required')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          role_id: roleId,
          bio,
          profile_image: profileImage,
          status,
          password
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create user')

      toast.success('User created successfully')
      router.push('/admin/n8_nwrr2675/users/list')
    } catch (err: any) {
      toast.error(err.message)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New User</h1>
            <p className="text-slate-500 font-medium">Create a new system user</p>
          </div>
        </div>
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
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleCreate} className="space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50">
                <CardTitle className="text-xl font-bold text-slate-900">User Information</CardTitle>
                <CardDescription>Set name, email, bio, and system role</CardDescription>
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
                <CardDescription>Set user password</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-bold">Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 rounded-xl border-slate-200 focus:ring-blue-500 h-11"
                      required
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
                    <UserPlus className="w-5 h-5 mr-2" />
                  )}
                  {saving ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
