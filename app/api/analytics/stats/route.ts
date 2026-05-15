import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const period = searchParams.get('period') || '24h';

        let startDate: Date;
        let endDate: Date = new Date();

        if (from && to) {
            startDate = new Date(from);
            endDate = new Date(to);
            endDate.setHours(23, 59, 59, 999);
        } else {
            startDate = new Date();
            if (period === '24h') startDate.setHours(startDate.getHours() - 24);
            else if (period === '7d') startDate.setDate(startDate.getDate() - 7);
            else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
        }

        const dateRange = { gte: startDate, lte: endDate };

        const totalVisitors = await prisma.analyticsSession.count({
            where: { created_at: dateRange }
        });

        const totalPageViews = await prisma.analyticsPageView.count({
            where: { created_at: dateRange }
        });

        const averageDurationRes = await prisma.analyticsSession.aggregate({
            where: { created_at: dateRange },
            _avg: { duration: true }
        });

        const conversions = await prisma.analyticsSession.count({
            where: {
                created_at: dateRange,
                isConversion: true
            }
        });

        // Get top pages
        const topPages = await prisma.analyticsPageView.groupBy({
            by: ['url'],
            where: { created_at: dateRange },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        });

        // Get visitor trends (time series)
        let trends: any[] = [];
        const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

        try {
            if (diffInHours <= 48) {
                trends = await prisma.$queryRaw`
                    SELECT DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as time, COUNT(*) as count
                    FROM analytics_sessions
                    WHERE created_at >= ${startDate} AND created_at <= ${endDate}
                    GROUP BY time
                    ORDER BY time ASC
                `;
            } else {
                trends = await prisma.$queryRaw`
                    SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as time, COUNT(*) as count
                    FROM analytics_sessions
                    WHERE created_at >= ${startDate} AND created_at <= ${endDate}
                    GROUP BY time
                    ORDER BY time ASC
                `;
            }
        } catch (e) {
            console.error('Trend query failed:', e);
        }

        return NextResponse.json({
            visitors: totalVisitors,
            pageViews: totalPageViews,
            avgDuration: Math.round(averageDurationRes._avg.duration || 0),
            conversionRate: totalVisitors > 0 ? parseFloat(((conversions / totalVisitors) * 100).toFixed(2)) : 0,
            topPages: topPages.map(p => ({ url: p.url, views: p._count.id })),
            trends: trends.map((t: any) => ({
                time: t.time,
                visitors: Number(t.count)
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
