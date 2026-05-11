import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
    id: string;
}

interface PageUpdateInput {
    title?: string;
    slug?: string;
    content?: string;
    meta_title?: string;
    meta_description?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    status?: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const page = await prisma.page.findUnique({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
    try {
        const body: PageUpdateInput = await request.json();
        const page = await prisma.page.update({
            where: { id: params.id },
            data: body
        });
        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    try {
        const page = await prisma.page.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}
