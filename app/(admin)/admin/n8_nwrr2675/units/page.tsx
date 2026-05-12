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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Units</h1>
          <p className="text-slate-600 mt-2">Manage property units</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Unit
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Units</CardTitle>
              <CardDescription>Total: {units.length} units</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search units..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.number}</TableCell>
                  <TableCell>{unit.project}</TableCell>
                  <TableCell className="capitalize">{unit.type}</TableCell>
                  <TableCell>{unit.floor}</TableCell>
                  <TableCell>{unit.price}</TableCell>
                  <TableCell>
                    <Badge className={
                      unit.status === 'available' ? 'bg-green-100 text-green-800' :
                      unit.status === 'sold' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
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
