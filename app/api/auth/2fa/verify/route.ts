import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verify } from 'otplib';

export async function POST(request: NextRequest) {
    const session = getSession(request);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { token, secret, action } = await request.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (action === 'enable') {
            if (!secret) return NextResponse.json({ error: 'Secret is required to enable 2FA' }, { status: 400 });

            // Verify the token against the provided secret
            const isValid = verify({ token, secret });

            if (!isValid) {
                return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 400 });
            }

            // Save secret and enable 2FA
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    two_factor_secret: secret,
                    two_factor_enabled: true,
                },
            });

            return NextResponse.json({ success: true, message: '2FA enabled successfully' });
        }
        else if (action === 'disable') {
            // Verify token against existing secret before disabling
            if (!user.two_factor_secret || !user.two_factor_enabled) {
                return NextResponse.json({ error: '2FA is not enabled' }, { status: 400 });
            }

            const isValid = verify({ token, secret: user.two_factor_secret });

            if (!isValid) {
                return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 400 });
            }

            // Disable 2FA
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    two_factor_secret: null,
                    two_factor_enabled: false,
                },
            });

            return NextResponse.json({ success: true, message: '2FA disabled successfully' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('[POST /api/auth/2fa/verify]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
