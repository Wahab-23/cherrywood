'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings, Bell, Shield, Globe, Palette, Save, Loader2, Info } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [twoFactor, setTwoFactor] = useState(true)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Settings saved successfully!')
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
          <Settings className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium">Configure platform preferences and global parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <nav className="space-y-1">
              {[
                { label: 'General', icon: Globe, active: true },
                { label: 'Notifications', icon: Bell, active: false },
                { label: 'Appearance', icon: Palette, active: false },
                { label: 'Security', icon: Shield, active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Info className="w-24 h-24" />
            </div>
            <h4 className="font-bold mb-2 relative z-10">System Status</h4>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest">All Systems Operational</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium relative z-10">
              Last maintenance was performed 3 days ago. No issues detected in the core infrastructure.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-slate-50">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Control how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-900">Push Notifications</Label>
                  <p className="text-sm text-slate-500 font-medium">Receive real-time alerts on your browser</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-900">Weekly Reports</Label>
                  <p className="text-sm text-slate-500 font-medium">Receive a summary of platform activities every Monday</p>
                </div>
                <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-slate-50">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your data protection settings</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-900">Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-500 font-medium">Add an extra layer of security to your account</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>
            </CardContent>
            <div className="px-8 py-6 bg-slate-50 flex justify-end">
              <Button
                onClick={handleSave}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 h-11 font-black shadow-lg shadow-blue-200"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

