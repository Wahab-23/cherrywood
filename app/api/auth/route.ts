import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const user = await prisma.user.findUnique({
            where: { email: body.email },
            include: { role: true },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Invalid password" },
                { status: 401 }
            );
        }

        // Issue a signed JWT containing the user's identity and role
        const token = signToken({
            userId: user.id,
            roleId: user.role_id,
            roleName: user.role.name,
            isVerified: user.is_verified || false,
            access: user.role.access || {},
        });

        // Never return the hashed password to the client
        const { password: _password, ...safeUser } = user;

        return NextResponse.json({ success: true, token, user: safeUser });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: process.env.NODE_ENV === "development" ? error : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}