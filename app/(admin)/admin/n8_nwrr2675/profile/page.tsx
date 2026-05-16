'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getStoredUser, setStoredUser } from '@/lib/auth-context'
import { UserCircle, Mail, Shield, Key, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ImageUpload from '@/components/admin/MultiImageUpload'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null)
  const [setupCode, setSetupCode] = useState('')
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)
  const [twoFactorError, setTwoFactorError] = useState('')

  useEffect(() => {
    const cachedUser = getStoredUser()
    if (cachedUser) {
      setUser(cachedUser)
      setName(cachedUser.name || '')
      setEmail(cachedUser.email || '')
      setProfileImage(cachedUser.profile_image || null)
    }

    // Fetch latest data from server
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const u = data.user
          setUser(u)
          setName(u.name || '')
          setEmail(u.email || '')
          setProfileImage(u.profile_image || null)
          setStoredUser(u) // Update cache
          setTwoFactorEnabled(u.two_factor_enabled || false)
        }
      })
      .catch(err => console.error('Failed to fetch user:', err))
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
          profile_image: profileImage,
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

  const handleSetup2FA = async () => {
    setTwoFactorLoading(true)
    setTwoFactorError('')
    try {
      const res = await fetch('/api/auth/2fa/setup', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setQrCodeUrl(data.qrCodeUrl)
      setTwoFactorSecret(data.secret)
    } catch (err: any) {
      setTwoFactorError(err.message)
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const handleVerify2FA = async (action: 'enable' | 'disable') => {
    setTwoFactorLoading(true)
    setTwoFactorError('')
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: setupCode,
          secret: twoFactorSecret,
          action
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setTwoFactorEnabled(action === 'enable')
      if (action === 'enable') {
        setQrCodeUrl(null)
        setTwoFactorSecret(null)
      }
      setSetupCode('')
    } catch (err: any) {
      setTwoFactorError(err.message)
    } finally {
      setTwoFactorLoading(false)
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
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg">Profile Picture</CardTitle>
              <CardDescription>Upload a custom avatar</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ImageUpload
                mode="single"
                value={profileImage}
                onChange={setProfileImage}
                uploadPath="users_profile"
              />
              <div className="mt-6 text-center">
                <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{user.email}</p>
                <Badge className="bg-blue-50 text-blue-600 border-none rounded-lg px-3 py-1 font-bold">
                  {user.role?.name || 'Administrator'}
                </Badge>
              </div>
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

          {/* 2FA Card */}
          <Card className="mt-6 border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-slate-50">
              <CardTitle className="text-xl font-bold text-slate-900">Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {twoFactorError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  {twoFactorError}
                </div>
              )}

              {twoFactorEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-600 font-bold bg-green-50 p-4 rounded-xl border border-green-100">
                    <CheckCircle2 className="w-6 h-6" />
                    Two-Factor Authentication is currently enabled.
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <Label>Enter 6-digit code to disable 2FA</Label>
                    <div className="flex gap-2">
                      <Input
                        value={setupCode}
                        onChange={(e) => setSetupCode(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        className="tracking-widest font-mono h-11"
                      />
                      <Button
                        variant="destructive"
                        className="h-11 rounded-xl"
                        onClick={() => handleVerify2FA('disable')}
                        disabled={twoFactorLoading || setupCode.length < 6}
                      >
                        {twoFactorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disable'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {!qrCodeUrl ? (
                    <div>
                      <p className="text-slate-600 text-sm mb-4">
                        Protect your account with a secondary authentication method using an app like Google Authenticator or Authy.
                      </p>
                      <Button
                        onClick={handleSetup2FA}
                        disabled={twoFactorLoading}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 font-bold"
                      >
                        {twoFactorLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                        Set Up 2FA
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6 border border-slate-200 p-6 rounded-xl bg-slate-50">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">1. Scan the QR Code</h4>
                        <p className="text-sm text-slate-600 mb-4">Open your authenticator app and scan this QR code.</p>
                        <div className="bg-white p-4 rounded-lg inline-block border border-slate-200">
                          <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                        </div>
                      </div>

                      <div className="space-y-3 max-w-sm">
                        <h4 className="font-bold text-slate-900">2. Verify the Code</h4>
                        <Label>Enter the 6-digit code from your app</Label>
                        <div className="flex gap-2">
                          <Input
                            value={setupCode}
                            onChange={(e) => setSetupCode(e.target.value)}
                            placeholder="000000"
                            maxLength={6}
                            className="tracking-widest font-mono h-11 bg-white"
                          />
                          <Button
                            className="h-11 rounded-xl font-bold px-6"
                            onClick={() => handleVerify2FA('enable')}
                            disabled={twoFactorLoading || setupCode.length < 6}
                          >
                            {twoFactorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Enable'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
