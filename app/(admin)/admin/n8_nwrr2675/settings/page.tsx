'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings, Bell, Shield, Globe, Palette, Save, Loader2, Info, Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

type Tab = 'general' | 'notifications' | 'appearance' | 'security'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const { theme, setTheme } = useTheme()

  // General settings
  const [siteName, setSiteName] = useState('Cherrywood Admin')

  // Notification settings
  const [notifications, setNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Security settings
  const [twoFactor, setTwoFactor] = useState(true)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // In a real app, this would be an API call
    }, 1000)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
          <Settings className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Configure platform preferences and global parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-slate-900 dark:bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Info className="w-24 h-24" />
            </div>
            <h4 className="font-bold mb-2 relative z-10">System Status</h4>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest">All Systems Operational</p>
            </div>
            <p className="text-xs text-blue-100 dark:text-blue-50 opacity-80 leading-relaxed font-medium relative z-10">
              Last maintenance was performed 3 days ago. No issues detected in the core infrastructure.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === 'general' && (
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  General Settings
                </CardTitle>
                <CardDescription>Global platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Site Name</Label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Control how you receive alerts and updates</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold text-slate-900 dark:text-white">Push Notifications</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Receive real-time alerts on your browser</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold text-slate-900 dark:text-white">Weekly Reports</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Receive a summary of platform activities every Monday</p>
                  </div>
                  <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label className="text-base font-bold text-slate-900 dark:text-white">Theme Preference</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === 'light'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                    >
                      <Sun className="w-6 h-6" />
                      <span className="text-sm font-bold">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === 'dark'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                    >
                      <Moon className="w-6 h-6" />
                      <span className="text-sm font-bold">Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === 'system'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                    >
                      <Monitor className="w-6 h-6" />
                      <span className="text-sm font-bold">System</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold text-slate-900 dark:text-white">High Contrast Mode</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Increase contrast for better accessibility</p>
                  </div>
                  <Switch disabled />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-slate-800">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Manage your data protection settings</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold text-slate-900 dark:text-white">Two-Factor Authentication</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Add an extra layer of security to your account</p>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 px-8 h-11 font-black shadow-lg shadow-slate-200 dark:shadow-none"
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
        </div>
      </div>
    </div>
  )
}
