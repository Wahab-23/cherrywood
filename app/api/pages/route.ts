import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/guards";
import { COMPULSORY_SLUGS } from "@/lib/pageConstants";

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
        const { title, slug, template, content, meta_title, meta_description, og_title, og_description, og_image, status, faqs } = await request.json();

        // Block creation of system/compulsory pages — they are seeded and only editable
        if (COMPULSORY_SLUGS.includes((slug || '').toLowerCase())) {
            return NextResponse.json(
                { success: false, error: 'This is a system page. It cannot be created again — please edit it directly from the Pages list.' },
                { status: 400 }
            );
        }

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                template: template || 'default',
                content,
                meta_title,
                meta_description,
                og_title,
                og_description,
                og_image,
                status,
                faqs
            }
        });
        return NextResponse.json({ success: true, data: page }, { status: 201 });
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return NextResponse.json({ success: false, error: 'This URL slug is already taken. Please choose a different one.' }, { status: 409 });
        }
        return NextResponse.json({ success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" }, { status: 500 });
    }
}
