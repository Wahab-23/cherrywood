import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/guards";

export async function GET() {
    try {
        const pages = await prisma.page.findMany();
        return NextResponse.json({ success: true, data: pages });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = requirePermission(request, "pages", "create");
    if ("error" in auth) return auth.error;

    try {
        const { title, slug, content, meta_title, meta_description, og_title, og_description, og_image, status } = await request.json();
        const page = await prisma.page.create({
            data: {
                title,
                slug,
                content,
                meta_title,
                meta_description,
                og_title,
                og_description,
                og_image,
                status
            }
        });
        return NextResponse.json({ success: true, data: page }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}
