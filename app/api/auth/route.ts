import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(request: NextRequest) {
    try {
        const parsed = schema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Invalid input" },
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;

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

        if (user.status === "suspended") {
            return NextResponse.json(
                { success: false, error: "Account suspended" },
                { status: 403 }
            );
        }

        const token = signToken({
            userId: user.id,
            roleId: user.role_id,
            roleName: user.role.name,
            isVerified: user.is_verified ?? false,
            access: user.role.access || {},
        });

        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            roleName: user.role.name,
            isVerified: user.is_verified,
            status: user.status,
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