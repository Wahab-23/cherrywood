import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
    id: string;
}

interface BlogTagUpdateInput {
    blog_id?: string;
    tag_id?: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const blogTag = await prisma.blogTag.findUnique({
            where: { id: params.id },
            include: { blog: true, tag: true }
        });
        return NextResponse.json({ success: true, data: blogTag });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
    try {
        const body: BlogTagUpdateInput = await request.json();
        const blogTag = await prisma.blogTag.update({
            where: { id: params.id },
            data: body
        });
        return NextResponse.json({ success: true, data: blogTag });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    try {
        const blogTag = await prisma.blogTag.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true, data: blogTag });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}