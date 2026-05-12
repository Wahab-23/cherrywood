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
        const data = await request.json();
        const blog = await prisma.blog.update({
            where: { id },
            data,
        });
        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
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