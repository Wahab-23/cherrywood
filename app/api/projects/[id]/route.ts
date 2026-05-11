import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
    id: string;
}

interface ProjectUpdateInput {
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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const project = await prisma.project.findUnique({
            where: { id },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body: ProjectUpdateInput = await request.json();
        const project = await prisma.project.update({
            where: { id },
            data: body,
        });
        return NextResponse.json({ success: true, data: project });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const { id } = params;
        const project = await prisma.project.delete({
            where: { id },
        });
        return NextResponse.json({ success: true, data: project });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}