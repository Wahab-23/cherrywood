import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { sendResetEmail } from '@/lib/mailer';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  // 1. Rate Limiting (max 3 requests per 15 minutes per IP)
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const { success, remaining, resetTime } = rateLimit(`forgot-password:${ip}`, { limit: 3, windowMs: 15 * 60 * 1000 });

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429, 
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': resetTime.toString()
        } 
      }
    );
  }

  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // 2. Find User
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link will be sent.' });
    }

    // 3. Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // 4. Save token to DB (upsert to allow re-requesting if one already exists)
    await prisma.passwordResetToken.upsert({
      where: { email },
      update: {
        token,
        expires_at,
        created_at: new Date(),
      },
      create: {
        email,
        token,
        expires_at,
      },
    });

    // 5. Send Email
    await sendResetEmail(email, token);

    return NextResponse.json({ success: true, message: 'If an account exists, a reset link will be sent.' });
  } catch (error: any) {
    console.error('[POST /api/auth/forgot-password]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
