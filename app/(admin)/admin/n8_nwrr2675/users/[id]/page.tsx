'use client'

import { useState, useEffect, use } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { UserCircle, Mail, Shield, Key, Save, Loader2, CheckCircle2, ChevronLeft, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${id}`)
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
        setName(data.data.name || '')
        setEmail(data.data.email || '')
        setRole(data.data.role?.name || data.data.role || 'buyer')
      } else {
        setError(data.error || 'User not found')
      }
    } catch (err) {
      setError('Failed to fetch user details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          role,
          ...(password ? { password } : {})
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update user')

      setSuccess(true)
      setPassword('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
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

  if (error && !user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{error}</h2>
        <Button className="rounded-xl">
          <Link href="/admin/n8_nwrr2675/users">Back to Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-slate-900">
            <Link href="/admin/n8_nwrr2675/users">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit User</h1>
            <p className="text-slate-500 font-medium">Modify account details and system permissions</p>
          </div>
        </div>
        <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-bold">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-blue-50 mx-auto flex items-center justify-center text-3xl font-bold text-blue-600 border-4 border-white shadow-sm mb-4">
                {user.name?.charAt(0) || 'U'}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{user.email}</p>
              <Badge className="bg-blue-50 text-blue-600 border-none rounded-lg px-3 py-1 font-bold uppercase text-[10px]">
                {user.role?.name || user.role || 'Member'}
              </Badge>
              <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-1 gap-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                  <Badge className="bg-green-50 text-green-600 border-none rounded-md text-[10px] font-black uppercase">Active</Badge>
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
                <CardDescription>Update name, email and system role</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-100 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    User updated successfully!
                  </div>
                )}

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
                  <Label htmlFor="role" className="text-slate-700 font-bold">System Role</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-10 pr-4 h-11 bg-white border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900"
                    >
                      <option value="admin">admin</option>
                      <option value="editor">editor</option>
                      <option value="author">author</option>
                      <option value="buyer">buyer</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50">
                <CardTitle className="text-xl font-bold text-slate-900">Security & Access</CardTitle>
                <CardDescription>Reset user password</CardDescription>
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
                  {saving ? 'Updating...' : 'Update User Account'}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
