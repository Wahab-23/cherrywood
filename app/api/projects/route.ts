import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";
        const type = searchParams.get("type") || "";

        const where: any = {};
        
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
                { location: { contains: search } },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (type) {
            where.type = type;
        }

        const projects = await prisma.project.findMany({
            where,
            take: Number(limit),
            skip: (Number(page) - 1) * Number(limit),
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                title: true,
                slug: true,
                location: true,
                type: true,
                status: true,
                start_date: true,
                expected_completion: true,
                total_units: true,
                hero_image: true,
                created_at: true,
                updated_at: true,
                _count: {
                    select: { units: true }
                }
            },
        });
        const count = await prisma.project.count({ where });
        return NextResponse.json({
            success: true,
            data: projects,
            page: Number(page),
            limit: Number(limit),
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
        const body = await request.json();
        
        // Parse types properly
        const data = { ...body };
        if (data.total_units !== undefined && data.total_units !== null && data.total_units !== "") {
            data.total_units = Number(data.total_units);
        } else {
            data.total_units = null;
        }
        
        if (data.start_date) {
            data.start_date = new Date(data.start_date);
        } else {
            data.start_date = null;
        }
        
        if (data.expected_completion) {
            data.expected_completion = new Date(data.expected_completion);
        } else {
            data.expected_completion = null;
        }

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