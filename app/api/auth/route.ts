import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";
import { z } from "zod";

import { generateSecret } from "otplib";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    twoFactorCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const rateLimitResult = rateLimit(ip, { limit: 5, windowMs: 15 * 60 * 1000 }); // 5 attempts per 15 min

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { success: false, error: "Too many login attempts. Please try again later." },
                { status: 429 }
            );
        }

        const parsed = schema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Invalid input" },
                { status: 400 }
            );
        }

        const { email, password, twoFactorCode } = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        const isPasswordValid = user
            ? await bcrypt.compare(password, user.password)
            : false;

        if (!user || !isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        if (user.status === "suspended" || user.status === "deleted") {
            return NextResponse.json(
                { success: false, error: "Account suspended or deleted" },
                { status: 403 }
            );
        }

        // 2FA Logic
        if (user.two_factor_enabled && user.two_factor_secret) {
            if (!twoFactorCode) {
                // Password is correct, but 2FA is required. Don't issue token yet.
                return NextResponse.json(
                    { success: true, requires2FA: true },
                    { status: 200 }
                );
            }

            // Verify the provided 2FA code
            const isValid2FA = generateSecret.apply({
                token: twoFactorCode,
                secret: user.two_factor_secret,
            });

            if (!isValid2FA) {
                return NextResponse.json(
                    { success: false, error: "Invalid 2FA code" },
                    { status: 401 }
                );
            }
        }

        const token = signToken({
            userId: user.id,
            roleId: user.role_id,
            roleName: user.role.name,
            isVerified: user.is_verified ?? false,
            access: (user.role.access as Record<string, any>) || {},
        });

        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            roleName: user.role.name,
            isVerified: user.is_verified,
            status: user.status,
            profile_image: user.profile_image,
            two_factor_enabled: user.two_factor_enabled,
            access: (user.role.access as Record<string, any>) || {},
        };

        const response = NextResponse.json({ success: true, user: safeUser });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 3,
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("[POST /api/auth/login]", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}