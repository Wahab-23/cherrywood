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

        // Calculate average interactions (pageviews) per OS
        // Using the 'os' and 'pageViews' fields directly from the model
        const stats: any[] = await prisma.$queryRaw`
            SELECT 
                COALESCE(os, 'Unknown') as os_name,
                AVG(pageViews) as avgInteractions
            FROM analytics_sessions
            WHERE created_at >= ${startDate} AND created_at <= ${endDate}
            GROUP BY os_name
            ORDER BY avgInteractions DESC
        `;

        return NextResponse.json({
            stats: stats.map(s => ({
                os: s.os_name,
                avgInteractions: parseFloat(Number(s.avgInteractions).toFixed(1))
            }))
        });
    } catch (error: any) {
        console.error('OS Stats error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
