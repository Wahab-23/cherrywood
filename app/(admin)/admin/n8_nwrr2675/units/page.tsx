'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'

export default function UnitsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)

  const units = [
    { id: '1', number: '101', project: 'Cherrywood Residency', type: 'apartment', floor: '1st', price: '$250,000', status: 'available' },
    { id: '2', number: '202', project: 'Cherrywood Residency', type: 'apartment', floor: '2nd', price: '$300,000', status: 'available' },
    { id: '3', number: '301', project: 'Metro Plaza', type: 'shop', floor: '3rd', price: '$150,000', status: 'sold' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Property Units</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage and track available inventory</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none font-black h-11 px-6">
              <Plus className="w-5 h-5 mr-2" />
              Add Property Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
              <DialogDescription>Add a new property unit</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project">Project</Label>
                  <select id="project" className="w-full px-3 py-2 border border-slate-200 rounded-md">
                    <option>Cherrywood Residency</option>
                    <option>Metro Plaza</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="unitNumber">Unit Number</Label>
                  <Input id="unitNumber" placeholder="101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select id="type" className="w-full px-3 py-2 border border-slate-200 rounded-md">
                    <option>apartment</option>
                    <option>shop</option>
                    <option>parking</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input id="floor" placeholder="1st, 2nd, etc" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size (sqft)</Label>
                  <Input id="size" type="number" placeholder="1200" />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" placeholder="250000" />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" className="w-full px-3 py-2 border border-slate-200 rounded-md">
                  <option>available</option>
                  <option>booked</option>
                  <option>sold</option>
                </select>
              </div>
              <Button className="w-full">Create Unit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Inventory Management</CardTitle>
            <CardDescription className="font-medium">Total: <span className="text-blue-600 font-bold">{units.length}</span> units tracked</CardDescription>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search units..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 h-10 bg-slate-50/50 focus:bg-white transition-all"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow className="border-b border-slate-50 dark:border-slate-800">
                <TableHead>Unit #</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id} className="border-b border-slate-50 dark:border-slate-800 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">{unit.number}</TableCell>
                  <TableCell>{unit.project}</TableCell>
                  <TableCell className="capitalize">{unit.type}</TableCell>
                  <TableCell>{unit.floor}</TableCell>
                  <TableCell>{unit.price}</TableCell>
                  <TableCell>
                    <Badge className={
                      unit.status === 'available' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-900/50' :
                      unit.status === 'sold' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900/50' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50'
                    }>
                      {unit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
