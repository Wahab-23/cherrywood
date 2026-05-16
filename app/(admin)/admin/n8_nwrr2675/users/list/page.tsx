'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Eye, Mail, User, Shield, CheckCircle2, XCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<any>(null)

  useEffect(() => {
    fetchUsers()
  }, [searchQuery])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users?search=${searchQuery}`)
      const data = await response.json()
      if (data.success) {
        setUsers(data.data)
        setMeta(data.meta)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (roleName: string) => {
    const role = roleName?.toLowerCase()
    if (role === 'admin') return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50'
    if (role === 'editor') return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50'
    if (role === 'author') return 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50'
    return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage platform access, roles and account verification</p>
        </div>
        <Button asChild className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none font-black h-11 px-6">
          <Link href="/admin/n8_nwrr2675/users/new">
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">All System Users</CardTitle>
            <CardDescription className="font-medium text-slate-500 dark:text-slate-400">Total: <span className="text-blue-600 dark:text-blue-400 font-bold">{meta?.total || 0}</span> users found</CardDescription>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 h-10 bg-slate-50/50 focus:bg-white transition-all"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow className="border-b border-slate-50 dark:border-slate-800">
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">User Profile</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Email</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">System Role</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Identity Status</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Joined Date</TableHead>
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={6} className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100"></div>
                        <div className="h-4 w-48 bg-slate-100 rounded"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800">
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-100">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-lg font-black uppercase text-[10px] px-2 py-0.5 border ${getRoleColor(user.role?.name)}`}>
                        {user.role?.name || 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isVerified ? (
                        <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-tight">
                          <CheckCircle2 className="w-4 h-4" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-tight">
                          <XCircle className="w-4 h-4" />
                          Pending
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400 font-bold text-xs">
                      {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                          <Link href={`/admin/n8_nwrr2675/users/${user.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                          <Link href={`/admin/n8_nwrr2675/users/${user.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-slate-200" />
                      <p className="text-slate-500 font-bold">No users found matching your search</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
