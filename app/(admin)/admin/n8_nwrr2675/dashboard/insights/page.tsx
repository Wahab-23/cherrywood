"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Monitor,
    Smartphone,
    Search,
    Filter,
    Download,
    MousePointer2,
    UserCheck,
    TrendingUp,
    TrendingDown,
    Clock,
    Users,
    Percent,
    ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import { subDays, endOfDay, format } from 'date-fns'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Report {
    id: string
    visitorId: string
    userAgent: string
    pageViewsCount: number
    eventsCount: number
    duration: number
    createdAt: string
}

interface TimeseriesPoint {
    date: string
    sessions: number
    conversions: number
}

interface OSStat {
    os: string
    avgInteractions: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEVICE_COLORS = {
    Desktop: '#378ADD',
    Mobile: '#1D9E75',
    Tablet: '#EF9F27',
}

const METRIC_COLORS = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-500 dark:text-red-400',
    neutral: 'text-slate-400',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricCard({
    icon: Icon,
    label,
    value,
    delta,
    deltaDir,
    loading,
}: {
    icon: React.ElementType
    label: string
    value: string
    delta?: string
    deltaDir?: 'up' | 'down' | 'neutral'
    loading?: boolean
}) {
    return (
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 truncate">
                            {label}
                        </p>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {loading ? (
                                <span className="inline-block w-16 h-7 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                            ) : (
                                value
                            )}
                        </h4>
                        {delta && !loading && (
                            <p
                                className={cn(
                                    'text-[11px] font-bold mt-1.5 flex items-center gap-1',
                                    METRIC_COLORS[deltaDir ?? 'neutral']
                                )}
                            >
                                {deltaDir === 'up' ? (
                                    <TrendingUp className="w-3 h-3" />
                                ) : deltaDir === 'down' ? (
                                    <TrendingDown className="w-3 h-3" />
                                ) : null}
                                {delta}
                            </p>
                        )}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg p-3 text-xs font-bold">
            <p className="text-slate-400 mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }}>
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    )
}

function SessionTableRow({ row }: { row: Report }) {
    const isMobile = row.userAgent.toLowerCase().includes('mobile')
    const os = row.userAgent.toLowerCase().includes('windows')
        ? 'Windows'
        : row.userAgent.toLowerCase().includes('mac')
            ? 'macOS'
            : row.userAgent.toLowerCase().includes('iphone')
                ? 'iOS'
                : row.userAgent.toLowerCase().includes('android')
                    ? 'Android'
                    : 'Unknown'

    const formatDuration = (s: number) => {
        if (!s) return '0s'
        if (s < 60) return `${s}s`
        return `${Math.floor(s / 60)}m ${s % 60}s`
    }

    return (
        <TableRow className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 border-slate-50 dark:border-slate-800 transition-all group">
            <TableCell className="pl-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-black text-[11px] shadow-sm group-hover:scale-105 transition-transform shrink-0">
                        {row.visitorId.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            Anonymous user
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {row.visitorId.substring(0, 14)}…
                        </p>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                        {isMobile ? (
                            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                            <Monitor className="w-3.5 h-3.5 text-slate-500" />
                        )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {os}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                    {row.pageViewsCount}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">pages</span>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                        {formatDuration(row.duration)}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {format(new Date(row.createdAt), 'MMM d')}
                </span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    {format(new Date(row.createdAt), 'hh:mm a')}
                </span>
            </TableCell>

            <TableCell className="pr-6 text-right">
                <Badge
                    className={cn(
                        'rounded-lg px-2.5 py-1 font-bold border-none text-[11px]',
                        row.eventsCount > 0
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    )}
                >
                    {row.eventsCount > 0 ? 'Converted' : 'Browsing'}
                </Badge>
            </TableCell>
        </TableRow>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InsightsPage() {
    const [reports, setReports] = useState<Report[]>([])
    const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([])
    const [osStats, setOsStats] = useState<OSStat[]>([])
    const [loading, setLoading] = useState(true)
    const [chartsLoading, setChartsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isDateLoaded, setIsDateLoaded] = useState(false)

    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: endOfDay(new Date()),
    })

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cherrywood_insights_date')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed.from && parsed.to) {
                    const fromDate = new Date(parsed.from)
                    const toDate = new Date(parsed.to)
                    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
                        setDate({
                            from: fromDate,
                            to: toDate
                        })
                    }
                }
            } catch (e) {
                console.error('Failed to parse saved date range', e)
            }
        }
        setIsDateLoaded(true)
    }, [])

    // Save to local storage on change
    useEffect(() => {
        if (isDateLoaded && date?.from && date?.to && !isNaN(date.from.getTime()) && !isNaN(date.to.getTime())) {
            localStorage.setItem('cherrywood_insights_date', JSON.stringify({
                from: date.from.toISOString(),
                to: date.to.toISOString()
            }))
        }
    }, [date, isDateLoaded])

    // ── Fetch session table ──────────────────────────────────────────────────
    const fetchReports = useCallback(async () => {
        if (!date?.from || !date?.to) return
        setLoading(true)
        try {
            const params = new URLSearchParams({
                from: date.from.toISOString(),
                to: date.to.toISOString(),
            })
            const res = await fetch(`/api/analytics/reports?${params}`)
            const data = await res.json()
            setReports(data.reports ?? [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [date])

    // ── Fetch chart data ─────────────────────────────────────────────────────
    const fetchCharts = useCallback(async () => {
        if (!date?.from || !date?.to) return
        setChartsLoading(true)
        try {
            const params = new URLSearchParams({
                from: date.from.toISOString(),
                to: date.to.toISOString(),
            })
            const [tsRes, osRes] = await Promise.all([
                fetch(`/api/analytics/timeseries?${params}`),
                fetch(`/api/analytics/os-stats?${params}`),
            ])
            const [tsData, osData] = await Promise.all([tsRes.json(), osRes.json()])
            setTimeseries(tsData.timeseries ?? [])
            setOsStats(osData.stats ?? [])
        } catch (e) {
            console.error(e)
        } finally {
            setChartsLoading(false)
        }
    }, [date])

    useEffect(() => {
        fetchReports()
        fetchCharts()
    }, [fetchReports, fetchCharts])

    // ── Derived metrics ──────────────────────────────────────────────────────
    const metrics = useMemo(() => {
        if (!reports.length)
            return {
                total: 0,
                desktopShare: 0,
                mobileShare: 0,
                avgInteractions: '0',
                avgDuration: 0,
                convRate: '0',
            }

        const desktopCount = reports.filter(
            (r) => !r.userAgent.toLowerCase().includes('mobile')
        ).length
        const totalInteractions = reports.reduce(
            (acc, r) => acc + (r.pageViewsCount || 0) + (r.eventsCount || 0),
            0
        )
        const converted = reports.filter((r) => r.eventsCount > 0).length
        const avgDur = reports.reduce((a, r) => a + (r.duration || 0), 0) / reports.length

        return {
            total: reports.length,
            desktopShare: Math.round((desktopCount / reports.length) * 100),
            mobileShare: Math.round(((reports.length - desktopCount) / reports.length) * 100),
            avgInteractions: (totalInteractions / reports.length).toFixed(1),
            avgDuration: Math.round(avgDur),
            convRate: ((converted / reports.length) * 100).toFixed(1),
        }
    }, [reports])

    const deviceData = useMemo(
        () => [
            { name: 'Desktop', value: metrics.desktopShare },
            { name: 'Mobile', value: metrics.mobileShare },
            { name: 'Tablet', value: Math.max(0, 100 - metrics.desktopShare - metrics.mobileShare) },
        ],
        [metrics]
    )

    const filteredReports = useMemo(
        () =>
            reports.filter(
                (r) =>
                    r.visitorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.userAgent.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [reports, searchQuery]
    )

    const fmtDur = (s: number) => {
        if (!s) return '0s'
        if (s < 60) return `${s}s`
        return `${Math.floor(s / 60)}m ${s % 60}s`
    }

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Visitor Insights
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">
                        Individual session behavior and conversion paths
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <DatePickerWithRange date={date} setDate={setDate} />
                </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <MetricCard
                    icon={Users}
                    label="Total visitors"
                    value={loading ? '' : metrics.total.toLocaleString()}
                    delta="+12% vs prev"
                    deltaDir="up"
                    loading={loading}
                />
                <MetricCard
                    icon={Monitor}
                    label="Desktop share"
                    value={loading ? '' : `${metrics.desktopShare}%`}
                    delta="+4 pts"
                    deltaDir="up"
                    loading={loading}
                />
                <MetricCard
                    icon={Smartphone}
                    label="Mobile share"
                    value={loading ? '' : `${metrics.mobileShare}%`}
                    delta="−4 pts"
                    deltaDir="down"
                    loading={loading}
                />
                <MetricCard
                    icon={MousePointer2}
                    label="Avg. interactions"
                    value={loading ? '' : `${metrics.avgInteractions}`}
                    delta="+0.8 / sess"
                    deltaDir="up"
                    loading={loading}
                />
                <MetricCard
                    icon={Clock}
                    label="Avg. session"
                    value={loading ? '' : fmtDur(metrics.avgDuration)}
                    delta="+22s"
                    deltaDir="up"
                    loading={loading}
                />
                <MetricCard
                    icon={Percent}
                    label="Conv. rate"
                    value={loading ? '' : `${metrics.convRate}%`}
                    delta="+1.2 pts"
                    deltaDir="up"
                    loading={loading}
                />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Sessions timeseries – spans 2 cols */}
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold">Daily sessions</CardTitle>
                        <CardDescription className="text-xs font-medium">
                            Unique visitors and conversions per day
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {chartsLoading ? (
                            <div className="h-56 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                        ) : timeseries.length === 0 ? (
                            <div className="h-56 flex items-center justify-center text-slate-400 text-sm font-medium">
                                No data for selected range
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={224}>
                                <LineChart data={timeseries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                        tickLine={false}
                                        axisLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                                        iconType="circle"
                                        iconSize={6}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sessions"
                                        stroke="#378ADD"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4, fill: '#378ADD' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="conversions"
                                        stroke="#1D9E75"
                                        strokeWidth={2}
                                        strokeDasharray="4 3"
                                        dot={false}
                                        activeDot={{ r: 4, fill: '#1D9E75' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Device breakdown */}
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold">Devices</CardTitle>
                        <CardDescription className="text-xs font-medium">
                            Sessions by device type
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {loading ? (
                            <div className="h-56 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie
                                            data={deviceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={48}
                                            outerRadius={72}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {deviceData.map((entry) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={DEVICE_COLORS[entry.name as keyof typeof DEVICE_COLORS]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: any) => [`${value}%`, '']}
                                            contentStyle={{
                                                fontSize: 12,
                                                borderRadius: 10,
                                                border: '1px solid #f1f5f9',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 mt-2">
                                    {deviceData.map((d) => (
                                        <div key={d.name} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-sm"
                                                    style={{
                                                        background:
                                                            DEVICE_COLORS[d.name as keyof typeof DEVICE_COLORS],
                                                    }}
                                                />
                                                <span className="font-medium text-slate-600 dark:text-slate-400 text-xs">
                                                    {d.name}
                                                </span>
                                            </div>
                                            <span className="font-black text-slate-900 dark:text-white text-xs">
                                                {d.value}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* OS engagement chart */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold">Engagement by OS</CardTitle>
                    <CardDescription className="text-xs font-medium">
                        Average interactions per session, grouped by operating system
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    {chartsLoading ? (
                        <div className="h-40 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                    ) : osStats.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm font-medium">
                            No data for selected range
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart
                                data={osStats}
                                layout="vertical"
                                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.04)" />
                                <XAxis
                                    type="number"
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="os"
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={60}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="avgInteractions" fill="#378ADD" radius={[0, 4, 4, 0]} name="Avg. interactions" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Session log table */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-base font-bold">Session log</CardTitle>
                            <CardDescription className="text-xs font-medium mt-0.5">
                                Real-time · last 50 visitors
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by ID or browser…"
                                className="h-10 pl-10 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/30">
                                <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                                    <TableHead className="pl-6 h-10 font-black text-slate-400 uppercase text-[9px] tracking-widest">
                                        Visitor
                                    </TableHead>
                                    <TableHead className="h-10 font-black text-slate-400 uppercase text-[9px] tracking-widest">
                                        Device / OS
                                    </TableHead>
                                    <TableHead className="h-10 font-black text-slate-400 uppercase text-[9px] tracking-widest">
                                        Pages
                                    </TableHead>
                                    <TableHead className="h-10 font-black text-slate-400 uppercase text-[9px] tracking-widest">
                                        Duration
                                    </TableHead>
                                    <TableHead className="h-10 font-black text-slate-400 uppercase text-[9px] tracking-widest">
                                        First seen
                                    </TableHead>
                                    <TableHead className="pr-6 h-10 font-black text-slate-400 uppercase text-[9px] tracking-widest text-right">
                                        Engagement
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    Array(6)
                                        .fill(0)
                                        .map((_, i) => (
                                            <TableRow key={i} className="border-slate-50 dark:border-slate-800">
                                                <TableCell colSpan={6} className="h-16 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
                                                        <div className="space-y-2 flex-1">
                                                            <div className="h-2.5 w-1/3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                                                            <div className="h-2 w-1/4 bg-slate-50 dark:bg-slate-900 rounded animate-pulse" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : filteredReports.length > 0 ? (
                                    filteredReports.map((row) => (
                                        <SessionTableRow key={row.id} row={row} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Search className="w-8 h-8 text-slate-200" />
                                                <p className="text-slate-400 font-bold text-sm">
                                                    No visitors match your search
                                                </p>
                                                <Button
                                                    variant="link"
                                                    onClick={() => setSearchQuery('')}
                                                    className="text-blue-600 font-black uppercase text-xs"
                                                >
                                                    Clear search
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}