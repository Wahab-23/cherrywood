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
                updated_at: true,
                published_at: true,
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
        const body = await request.json();
        const { author_id, published_at, status, ...rest } = body;

        // Validation
        if (!rest.title || !rest.slug || !rest.category_id) {
            return NextResponse.json(
                { success: false, message: "Missing required fields: title, slug, category_id" },
                { status: 400 }
            );
        }

        const blogData: any = {
            ...rest,
            status: status || "draft",
            author_id: author_id || auth.session.userId,
        };

        // Handle published_at
        if (published_at) {
            blogData.published_at = new Date(published_at);
        } else if (status === "published") {
            blogData.published_at = new Date();
        }

        const blog = await prisma.blog.create({ data: blogData });
        return NextResponse.json({ success: true, data: blog }, { status: 201 });
    } catch (error: any) {
        console.error("[POST /api/blogs]", error);
        
        // Handle unique constraint violation (e.g. slug)
        if (error.code === 'P2002') {
            return NextResponse.json(
                {
                    success: false,
                    message: "A blog with this slug already exists.",
                    error: "Slug conflict"
                },
                { status: 400 }
            );
        }

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
