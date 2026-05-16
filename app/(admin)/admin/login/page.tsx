'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { setStoredUser } from '@/lib/auth-context'
import { AlertCircle, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [requires2FA, setRequires2FA] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if already logged in via cookie
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
          router.push('/admin/n8_nwrr2675/dashboard')
        } else {
          setCheckingAuth(false)
        }
      })
      .catch(() => setCheckingAuth(false))
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const bodyData: any = { email, password }
      if (requires2FA) {
        bodyData.twoFactorCode = twoFactorCode
      }

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (data.requires2FA) {
        setRequires2FA(true)
        return
      }

      // Cache user info for display (token is in httpOnly cookie)
      setStoredUser(data.user)

      // Redirect to dashboard
      router.push('/admin/n8_nwrr2675/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-white rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-slate-900 rounded-lg">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to access the Cherrywood admin dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {!requires2FA ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@cherrywood.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">Two-Factor Authentication Code</Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  required
                  disabled={loading}
                  maxLength={6}
                  className="tracking-widest text-center text-xl font-mono"
                />
                <p className="text-xs text-slate-500 mt-2 text-center">Open your authenticator app to view the code.</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || (requires2FA && twoFactorCode.length < 6)}
            >
              {loading ? 'Signing in...' : requires2FA ? 'Verify Code' : 'Sign In'}
            </Button>

            {requires2FA && (
              <div className="text-center mt-2">
                <Button
                  variant="link"
                  className="text-xs"
                  onClick={() => { setRequires2FA(false); setTwoFactorCode(''); setPassword(''); }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {!requires2FA && (
              <div className="text-center text-sm text-slate-600 space-y-2 pt-2">
                <p>Demo Credentials:</p>
                <p>Email: <span className="font-mono text-xs">admin@cherrywood.com</span></p>
                <p>Password: <span className="font-mono text-xs">password123</span></p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
