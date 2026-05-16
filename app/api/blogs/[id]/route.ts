import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const blog = await prisma.blog.findUnique({
            where: { id },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        profile_image: true,
                    },
                },
            },
        });

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = requirePermission(request, "blogs", "update");
    if ("error" in authResult) return authResult.error;
    try {
        const { id } = await params;
        const body = await request.json();
        const { author_id, published_at, status, ...rest } = body;

        const updateData: any = {
            ...rest,
            status,
        };

        if (author_id) updateData.author_id = author_id;
        
        if (published_at) {
            updateData.published_at = new Date(published_at);
        } else if (status === "published") {
            // Check if it already has a published_at
            const existing = await prisma.blog.findUnique({ where: { id } });
            if (!existing?.published_at) {
                updateData.published_at = new Date();
            }
        }

        const blog = await prisma.blog.update({
            where: { id },
            data: updateData,
        });
        return NextResponse.json({ success: true, data: blog });
    } catch (error: any) {
        console.error("[PUT /api/blogs/[id]]", error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "A blog with this slug already exists." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = requirePermission(request, "blogs", "delete");
    if ("error" in authResult) return authResult.error;
    try {
        const { id } = await params;
        const blog = await prisma.blog.delete({ where: { id } });
        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}