import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

interface Filter {
    search?: string;
    blog_id?: string;
    tag_id?: string;
    id?: string;
}

export async function GET(request: NextRequest) {
    try {
        const { search, blog_id, tag_id } = Object.fromEntries(
            request.nextUrl.searchParams.entries()
        ) as Filter;
        const filter: Filter = {};
        if (search) filter.search = search;
        if (blog_id) filter.blog_id = blog_id;
        if (tag_id) filter.tag_id = tag_id;
        const where: any = {};
        if (filter.search) {
            where.OR = [
                { blog: { title: { contains: filter.search } } },
                { tag: { name: { contains: filter.search } } },
            ];
        }
        if (filter.blog_id) where.blog_id = filter.blog_id;
        if (filter.tag_id) where.tag_id = filter.tag_id;
        const blogTags = await prisma.blogTag.findMany({ where, include: { blog: true, tag: true } });
        return NextResponse.json({ success: true, data: blogTags });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authResult = requirePermission(request, "tags", "create");
    if ("error" in authResult) return authResult.error;
    try {
        const { blog_id, tag_id } = await request.json();
        const blogTag = await prisma.blogTag.create({
            data: {
                blog_id,
                tag_id
            }
        });
        return NextResponse.json({ success: true, data: blogTag });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}