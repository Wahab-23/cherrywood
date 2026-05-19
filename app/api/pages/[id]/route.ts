import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

interface Params {
    id: string;
}

interface PageUpdateInput {
    title?: string;
    slug?: string;
    template?: string;
    content?: string;
    meta_title?: string;
    meta_description?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    status?: string;
    faqs?: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
    try {
        const { id } = await params;
        const page = await prisma.page.findUnique({
            where: { id }
        });

        if (!page) {
            return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<Params> }) {
    const auth = requirePermission(request, "pages", "update");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const body: PageUpdateInput = await request.json();
        const page = await prisma.page.update({
            where: { id },
            data: body
        });
        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }) {
    const auth = requirePermission(request, "pages", "delete");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;

        const existingPage = await prisma.page.findUnique({
            where: { id }
        });

        if (!existingPage) {
            return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
        }

        const COMPULSORY_SLUGS = ['home', 'homepage', 'contact', 'contact-us', 'careers', 'terms', 'terms-and-conditions', 'privacy', 'privacy-policy', 'journal', 'blogs', 'blog'];
        if (COMPULSORY_SLUGS.includes((existingPage.slug || '').toLowerCase())) {
            return NextResponse.json({ success: false, error: "Compulsory layout pages cannot be deleted." }, { status: 400 });
        }

        const page = await prisma.page.delete({
            where: { id }
        });
        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}
