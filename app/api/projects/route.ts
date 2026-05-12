import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;
        const search = searchParams.get("search") || "";
        const projects = await prisma.project.findMany({
            take: Number(limit),
            skip: (Number(page) - 1) * Number(limit),
            orderBy: { created_at: "desc" },
            where: {
                AND: [
                    {
                        OR: [
                            { title: { contains: search } },
                            { description: { contains: search } },
                        ]
                    }
                ],
            },
            select: {
                id: true,
                title: true,
                slug: true,
                hero_image: true,
                created_at: true,
            },
        });
        const count = await prisma.project.count();
        return NextResponse.json({
            success: true,
            data: projects,
            page,
            limit,
            totalPages: Math.ceil(count / Number(limit)),
            totalProjects: count,
            message: "Projects fetched successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = requirePermission(request, "projects", "create");
    if ("error" in auth) return auth.error;

    try {
        const { ...data } = await request.json();
        const project = await prisma.project.create({ data });
        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}