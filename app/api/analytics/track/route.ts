import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, url, title, sessionId, eventName, metadata } = body;
        const ignoredPaths = ['/admin', '/api'];

        if (url && ignoredPaths.some(path => url.startsWith(path))) {
            return NextResponse.json({
                ignored: true
            });
        }

        // Get IP and User Agent
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        const ua = request.headers.get('user-agent') || '';

        // Generate a privacy-preserving visitor ID (hashed IP + salt/UA)
        const visitorId = crypto.createHash('sha256').update(ip + ua).digest('hex');

        if (type === 'pageview') {
            let session = null;

            if (sessionId) {
                session = await prisma.analyticsSession.findUnique({
                    where: { id: sessionId }
                });
            }

            if (!session) {
                // Create new session
                session = await prisma.analyticsSession.create({
                    data: {
                        visitorId,
                        userAgent: ua,
                        referrer: request.headers.get('referer') || '',
                    }
                });
            } else {
                // Update session
                await prisma.analyticsSession.update({
                    where: { id: session.id },
                    data: {
                        pageViews: { increment: 1 },
                        updated_at: new Date()
                    }
                });
            }

            // Create page view
            const pageView = await prisma.analyticsPageView.create({
                data: {
                    sessionId: session.id,
                    url: url || '',
                    title: title || ''
                }
            });

            return NextResponse.json({ sessionId: session.id, pageViewId: pageView.id });
        }

        if (type === 'heartbeat' && sessionId) {
            // Update session duration
            await prisma.analyticsSession.update({
                where: { id: sessionId },
                data: {
                    duration: { increment: 10 } // heartbeat every 10s
                }
            });
            return NextResponse.json({ success: true });
        }

        if (type === 'event' && sessionId && eventName) {
            const isConversion = eventName === 'form_submission' || eventName === 'conversion';

            await prisma.analyticsEvent.create({
                data: {
                    sessionId,
                    type: 'custom',
                    name: eventName,
                    metadata: metadata || {}
                }
            });

            if (isConversion) {
                await prisma.analyticsSession.update({
                    where: { id: sessionId },
                    data: { isConversion: true }
                });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid tracking type' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
