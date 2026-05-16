import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

interface Filter {
    search?: string;
}

//get roles
export async function GET(request: NextRequest) {
    const auth = requirePermission(request, "roles", "read");
    if ("error" in auth) return auth.error;

    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search");

        const filter: Filter = {};
        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
            ];
        }

        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;
        const roles = await prisma.role.findMany({
            where,
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { users: true }
                }
            }
        });
        const count = await prisma.role.count({ where });
        return NextResponse.json({
            success: true,
            data: roles,
            page,
            limit,
            totalPages: Math.ceil(count / Number(limit)),
            totalRoles: count,
            message: "Roles fetched successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}

//create role
export async function POST(request: NextRequest) {
    const auth = requirePermission(request, "roles", "create");
    if ("error" in auth) return auth.error;

    try {
        const { ...data } = await request.json();
        const role = await prisma.role.create({
            data: {
                ...data,
            },
        });
        return NextResponse.json({
            success: true,
            data: role,
            message: "Role created successfully",
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}
