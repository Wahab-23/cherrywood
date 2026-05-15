import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

        const reports = await prisma.analyticsSession.findMany({
            where: {
                created_at: { gte: startDate, lte: endDate }
            },
            take: 100,
            orderBy: {
                created_at: 'desc'
            },
            include: {
                _count: {
                    select: {
                        page_views: true,
                        events: true
                    }
                }
            }
        })

        // Clean up data for the UI
        const formattedReports = reports.map((session: any) => ({
            id: session.id,
            visitorId: session.visitorId,
            userAgent: session.userAgent,
            createdAt: session.created_at,
            pageViewsCount: session._count.page_views,
            eventsCount: session._count.events,
            duration: session.duration,
            // Add other derived fields if needed
        }))

        return NextResponse.json({ reports: formattedReports })
    } catch (error) {
        console.error('Reports API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
    }
}
