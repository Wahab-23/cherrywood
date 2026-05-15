import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        if (!from || !to) {
            return NextResponse.json({ error: 'Missing from/to dates' }, { status: 400 });
        }

        const startDate = new Date(from);
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);

        // Group by day for the line chart
        const timeseries: any[] = await prisma.$queryRaw`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                COUNT(*) as sessions,
                SUM(CASE WHEN isConversion = 1 THEN 1 ELSE 0 END) as conversions
            FROM analytics_sessions
            WHERE created_at >= ${startDate} AND created_at <= ${endDate}
            GROUP BY date
            ORDER BY date ASC
        `;

        return NextResponse.json({
            timeseries: timeseries.map(t => ({
                date: t.date,
                sessions: Number(t.sessions),
                conversions: Number(t.conversions)
            }))
        });
    } catch (error: any) {
        console.error('Timeseries error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
