import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // 1. Rate Limiting (max 5 requests per 15 minutes per IP)
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const { success, remaining, resetTime } = rateLimit(`reset-password:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429, 
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': resetTime.toString()
        } 
      }
    );
  }

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // 2. Verify token
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    if (resetRecord.expires_at < new Date()) {
      // Token expired, delete it
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // 3. Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetRecord.email },
        data: { password: hashedPassword },
      }),
      // 4. Delete the used token
      prisma.passwordResetToken.delete({
        where: { token },
      })
    ]);

    return NextResponse.json({ success: true, message: 'Password has been successfully reset' });

  } catch (error: any) {
    console.error('[POST /api/auth/reset-password]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
