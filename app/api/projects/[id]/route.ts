import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";
import { revalidatePath } from "next/cache";

interface Params {
    id: string;
}

interface ProjectUpdateInput {
    title?: string;
    slug?: string;
    location?: string;
    type?: string;
    status?: string;
    start_date?: string | Date | null;
    expected_completion?: string | Date | null;
    total_units?: number | null;
    hero_image?: string | null;
    description?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
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
            return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: project });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = requirePermission(request, "projects", "update");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const body = await request.json();
        
        // Parse types properly
        const updateData: any = { ...body };
        if (updateData.total_units !== undefined) {
            updateData.total_units = updateData.total_units !== null && updateData.total_units !== "" 
            ? Number(updateData.total_units) 
            : null;
        }
        
        if (updateData.start_date !== undefined) {
            updateData.start_date = updateData.start_date ? new Date(updateData.start_date) : null;
        }
        
        if (updateData.expected_completion !== undefined) {
            updateData.expected_completion = updateData.expected_completion ? new Date(updateData.expected_completion) : null;
        }

        const project = await prisma.project.update({
            where: { id },
            data: updateData,
        });

        // Revalidate storefront pages displaying project info
        revalidatePath("/");
        revalidatePath("/projects");
        if (project.slug) {
            revalidatePath(`/projects/${project.slug}`);
        }

        return NextResponse.json({ success: true, data: project });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = requirePermission(request, "projects", "delete");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const project = await prisma.project.delete({
            where: { id },
        });

        // Revalidate storefront pages displaying project info
        revalidatePath("/");
        revalidatePath("/projects");
        if (project.slug) {
            revalidatePath(`/projects/${project.slug}`);
        }

        return NextResponse.json({ success: true, data: project });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}