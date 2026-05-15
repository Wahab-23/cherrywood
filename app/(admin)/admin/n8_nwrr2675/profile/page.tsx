'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getStoredUser, setStoredUser } from '@/lib/auth-context'
import { UserCircle, Mail, Shield, Key, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const cachedUser = getStoredUser()
    if (cachedUser) {
      setUser(cachedUser)
      setName(cachedUser.name || '')
      setEmail(cachedUser.email || '')
    }
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const auth = getStoredUser()
    if (!auth) return

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          ...(password ? { password } : {})
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update cached user info
      setStoredUser(data.data)
      setUser(data.data)
      setSuccess(true)
      setPassword('')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
          <UserCircle className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium">Manage your profile information and security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-white shadow-sm mb-4">
                {user.name?.charAt(0) || 'A'}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{user.email}</p>
              <Badge className="bg-blue-50 text-blue-600 border-none rounded-lg px-3 py-1 font-bold">
                {user.role?.name || 'Administrator'}
              </Badge>
            </CardContent>
          </Card>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              Security Tip
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed font-medium">
              Use a strong password with at least 12 characters, including symbols and numbers to keep your account safe.
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleUpdate} className="space-y-6">
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50">
                <CardTitle className="text-xl font-bold text-slate-900">Personal Information</CardTitle>
                <CardDescription>Update your public profile details</CardDescription>
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
                    Profile updated successfully!
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
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50">
                <CardTitle className="text-xl font-bold text-slate-900">Security</CardTitle>
                <CardDescription>Change your password if needed</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-bold">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Leave blank to keep current"
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
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Saving Changes...' : 'Save Profile Settings'}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
