import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requirePermission } from "@/lib/guards";
import bcrypt from "bcrypt";

export async function GET(request: NextRequest) {
    const auth = requirePermission(request, "users", "read");
    if ("error" in auth) return auth.error;

    try {
        const page = Number(request.nextUrl.searchParams.get("page")) || 1;
        const limit = Number(request.nextUrl.searchParams.get("limit")) || 10;
        const search = request.nextUrl.searchParams.get("search") || "";
        const skip = (page - 1) * limit;

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } }
                ]
            },
            skip,
            take: limit,
            include: { role: true }
        });

        const total = await prisma.user.count({
            where: {
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } }
                ]
            }
        });

        return NextResponse.json({ success: true, data: users, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = requirePermission(request, "users", "create");
    if ("error" in auth) return auth.error;

    try {
        const body = await request.json();
        
        // Hash password if provided
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        }

        const user = await prisma.user.create({
            data: body
        });
        
        const { password: _password, ...safeUser } = user;
        return NextResponse.json({ success: true, data: safeUser });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}
