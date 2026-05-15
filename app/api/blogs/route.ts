import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requirePermission } from "@/lib/guards";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";

        const blogs = await prisma.blog.findMany({
            take: Number(limit),
            skip: (Number(page) - 1) * Number(limit),
            orderBy: { created_at: "desc" },
            where: {
                AND: [
                    {
                        OR: [
                            { title: { contains: search } },
                            { content: { contains: search } },
                        ],
                    },
                    category
                        ? {
                            category: {
                                name: { equals: category },
                            },
                        }
                        : {},
                ],
            },
            select: {
                id: true,
                title: true,
                slug: true,
                short_description: true,
                hero_image: true,
                created_at: true,
                status: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        profile_image: true,
                    },
                },
            },
        });

        const count = await prisma.blog.count();

        return NextResponse.json({
            success: true,
            data: blogs,
            page,
            limit,
            totalPages: Math.ceil(count / Number(limit)),
            totalBlogs: count,
            message: "Blogs fetched successfully",
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal Server Error",
                error: process.env.NODE_ENV === "development" ? error : undefined,
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const auth = requirePermission(request, "blogs", "create");
    if ("error" in auth) return auth.error;

    try {
        const { ...data } = await request.json();
        const blog = await prisma.blog.create({ data });
        return NextResponse.json({ success: true, data: blog }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal Server Error",
                error: process.env.NODE_ENV === "development" ? error : undefined,
            },
            { status: 500 }
        );
    }
}
