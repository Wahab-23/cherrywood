import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateURI, generateSecret } from 'otplib';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
    const session = getSession(request);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Generate a new secret
        const secret = generateSecret();

        // Generate otpauth URL for Google Authenticator / Authy
        const serviceName = 'Cherrywood Admin';
        const otpauthUrl = generateURI({ issuer: serviceName, label: user.email, secret });

        // Generate QR code data URL
        const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

        // Important: We do not save the secret to the DB yet. 
        // We only save it when the user successfully verifies the first code.
        return NextResponse.json({
            success: true,
            secret,
            qrCodeUrl,
        });
    } catch (error: any) {
        console.error('[POST /api/auth/2fa/setup]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
