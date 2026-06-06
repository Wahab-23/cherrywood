'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, Mail, Phone, Calendar, User, Eye, Trash2, CheckCircle, 
  Clock, XCircle, ChevronLeft, ChevronRight, Inbox, RefreshCw, MessageSquare
} from 'lucide-react'
import { toast } from 'sonner'

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [interestFilter, setInterestFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    closed: 0
  })

  const limit = 10

  useEffect(() => {
    fetchInquiries()
  }, [searchQuery, statusFilter, interestFilter, currentPage])

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : ''
      const interestParam = interestFilter !== 'all' ? `&interest=${interestFilter}` : ''
      const res = await fetch(`/api/inquiries?page=${currentPage}&limit=${limit}&search=${searchQuery}${statusParam}${interestParam}`)
      const data = await res.json()
      if (data.success) {
        setInquiries(data.data)
        setTotalPages(data.totalPages)
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        toast.error(data.message || 'Failed to fetch inquiries')
      }
    } catch (err) {
      console.error('Failed to load inquiries', err)
      toast.error('An unexpected error occurred while loading inquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Inquiry marked as ${newStatus}`)
        // Update selected inquiry status if open
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus })
        }
        fetchInquiries()
      } else {
        toast.error(data.message || 'Failed to update status')
      }
    } catch (err) {
      console.error('Error updating inquiry status', err)
      toast.error('Server error updating status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry permanently? This action cannot be undone.')) {
      return
    }
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Inquiry deleted successfully')
        setIsDetailOpen(false)
        fetchInquiries()
      } else {
        toast.error(data.message || 'Failed to delete inquiry')
      }
    } catch (err) {
      console.error('Error deleting inquiry', err)
      toast.error('Server error deleting inquiry')
    }
  }

  const openDetails = (inquiry: any) => {
    setSelectedInquiry(inquiry)
    setIsDetailOpen(true)
  }

  const getInterestLabel = (interest: string) => {
    switch (interest) {
      case 'type-a': return 'Type A (3 Bed)'
      case 'type-b': return 'Type B (2 Bed+Draw)'
      case 'type-c': return 'Type C (2 Bed)'
      case 'shop': return 'Retail Shop'
      case 'other': return 'General'
      default: return interest || 'General'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-bold uppercase text-[9px] px-2 py-0.5 rounded-md">New</Badge>
      case 'contacted':
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-[9px] px-2 py-0.5 rounded-md">Contacted</Badge>
      case 'closed':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold uppercase text-[9px] px-2 py-0.5 rounded-md">Closed</Badge>
      default:
        return <Badge className="bg-slate-500 text-white font-bold uppercase text-[9px] px-2 py-0.5 rounded-md">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Customer Inquiries</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage buyer registrations, questions, and contact requests</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchInquiries} 
          disabled={loading}
          className="rounded-xl border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 font-bold"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Inquiries', count: stats.total, color: 'text-slate-900 dark:text-white', bg: 'bg-white dark:bg-slate-900', border: 'border-slate-100 dark:border-slate-800' },
          { label: 'New / Unread', count: stats.new, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/20', border: 'border-blue-100/50 dark:border-blue-900/20' },
          { label: 'Contacted / Active', count: stats.contacted, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50/50 dark:bg-orange-950/20', border: 'border-orange-100/50 dark:border-orange-900/20' },
          { label: 'Closed', count: stats.closed, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50/50 dark:bg-green-950/20', border: 'border-green-100/50 dark:border-green-900/20' },
        ].map((stat, i) => (
          <Card key={i} className={`border-none shadow-sm ${stat.bg} ${stat.border} rounded-2xl`}>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-4xl font-extrabold mt-2 ${stat.color}`}>{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Panel */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Inquiry Directory</CardTitle>
              <CardDescription className="font-medium text-slate-500 dark:text-slate-400">Review and update records of buyer interest</CardDescription>
            </div>
            
            {/* Search and Interest Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-10 rounded-xl border-slate-200 h-10 bg-slate-50/50 focus:bg-white transition-all dark:border-slate-800 dark:bg-slate-800/50"
                />
              </div>

              <div className="w-full sm:w-48">
                <Select 
                  value={interestFilter} 
                  onValueChange={(val) => { setInterestFilter(val); setCurrentPage(1); }}
                >
                  <SelectTrigger className="rounded-xl border-slate-200 h-10 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/50">
                    <SelectValue placeholder="Filter Interest" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                    <SelectItem value="all">All Interests</SelectItem>
                    <SelectItem value="type-a">Type A — 3 Bed</SelectItem>
                    <SelectItem value="type-b">Type B — 2 Bed + Drawing</SelectItem>
                    <SelectItem value="type-c">Type C — 2 Bed</SelectItem>
                    <SelectItem value="shop">Ground Retail Shop</SelectItem>
                    <SelectItem value="other">General Enquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <Tabs value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }} className="w-full">
            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg font-bold text-xs px-4 py-2">All Statuses</TabsTrigger>
              <TabsTrigger value="new" className="rounded-lg font-bold text-xs px-4 py-2 text-blue-600 dark:text-blue-400">New</TabsTrigger>
              <TabsTrigger value="contacted" className="rounded-lg font-bold text-xs px-4 py-2 text-orange-500">Contacted</TabsTrigger>
              <TabsTrigger value="closed" className="rounded-lg font-bold text-xs px-4 py-2 text-green-600 dark:text-green-400">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <TableRow>
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Enquirer Information</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Interest</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Submitted Date</TableHead>
                <TableHead className="py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">Status</TableHead>
                <TableHead className="px-8 py-4 font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={5} className="px-8 py-8">
                      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : inquiries.length > 0 ? (
                inquiries.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                    <TableCell className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-950 dark:text-white text-sm">{item.name}</span>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {item.email}</span>
                          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {item.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-md font-bold uppercase tracking-tight text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {getInterestLabel(item.interest)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white" 
                          onClick={() => openDetails(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" 
                          onClick={() => handleDeleteInquiry(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="w-8 h-8 text-slate-200 dark:text-slate-800" />
                      <p className="text-slate-500 font-bold">No inquiries found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-8 px-3 border-slate-200 dark:border-slate-800 font-bold"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg h-8 px-3 border-slate-200 dark:border-slate-800 font-bold"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Inquiry Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-xl border-none rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-xl">
          <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Inquiry Details</DialogTitle>
                <DialogDescription className="font-semibold text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Submitted on {selectedInquiry && new Date(selectedInquiry.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-6 py-6">
              {/* Profile Details */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100/50 dark:border-slate-800/60 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400" />
                      {selectedInquiry.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interest type</span>
                    <div>
                      <Badge className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase text-[9px] px-2 py-0.5 mt-0.5">
                        {getInterestLabel(selectedInquiry.interest)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1.5 truncate">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  Message
                </span>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-800/60 min-h-[100px] text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message || <span className="text-slate-400 italic">No message provided.</span>}
                </div>
              </div>

              {/* Status Update Control */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Change Inquiry Status</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { status: 'new', label: 'Mark as New', variant: 'outline', className: 'hover:bg-blue-50 border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400' },
                    { status: 'contacted', label: 'Mark Contacted', variant: 'outline', className: 'hover:bg-orange-50 border-orange-200 dark:border-orange-900/50 text-orange-500' },
                    { status: 'closed', label: 'Mark Closed', variant: 'outline', className: 'hover:bg-green-50 border-green-200 dark:border-green-900/50 text-green-600 dark:text-green-400' }
                  ].map((btn) => (
                    <Button
                      key={btn.status}
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus(selectedInquiry.id, btn.status)}
                      className={`font-bold text-xs rounded-xl ${selectedInquiry.status === btn.status ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-white shadow-sm' : btn.className}`}
                      variant={btn.variant as any}
                    >
                      {selectedInquiry.status === btn.status && <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                      {btn.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-5 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={() => handleDeleteInquiry(selectedInquiry.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold rounded-xl mr-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Record
            </Button>
            <Button
              onClick={() => setIsDetailOpen(false)}
              className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl font-bold h-11 px-6 shadow-sm"
            >
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
