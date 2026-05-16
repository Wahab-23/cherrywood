import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const session = getSession(request);

    if (!session) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                name: true,
                email: true,
                is_verified: true,
                status: true,
                two_factor_enabled: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        access: true,
                    },
                },
                profile_image: true,
            },
        });

        if (!user || user.status === "suspended") {
            const response = NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
            // Clear stale cookie
            response.cookies.set("auth_token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 0,
                path: "/",
            });
            return response;
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roleName: user.role.name,
                role: { id: user.role.id, name: user.role.name },
                isVerified: user.is_verified,
                status: user.status,
                profile_image: user.profile_image,
                two_factor_enabled: user.two_factor_enabled,
                access: user.role.access || {},
            },
        });
    } catch (error) {
        console.error("[GET /api/auth/me]", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
