import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = requirePermission(request, "units", "read");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const unit = await prisma.unit.findUnique({
            where: { id },
            include: {
                project: true,
                owner: true,
            },
        });

        if (!unit) {
            return NextResponse.json({ success: false, error: "Unit not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: unit });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = requirePermission(request, "units", "update");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const data = await request.json();
        
        // Ensure numeric fields are correctly typed
        const updateData = { ...data };
        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.size_sqft) updateData.size_sqft = Number(updateData.size_sqft);

        const unit = await prisma.unit.update({
            where: { id },
            data: updateData,
            include: {
                project: {
                    select: {
                        slug: true
                    }
                }
            }
        });

        // Revalidate storefront pages displaying units
        revalidatePath("/");
        revalidatePath("/projects");
        if (unit.project?.slug) {
            revalidatePath(`/projects/${unit.project.slug}`);
        }

        return NextResponse.json({ success: true, data: unit });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = requirePermission(request, "units", "delete");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const unit = await prisma.unit.delete({
            where: { id },
            include: {
                project: {
                    select: {
                        slug: true
                    }
                }
            }
        });

        // Revalidate storefront pages displaying units
        revalidatePath("/");
        revalidatePath("/projects");
        if (unit.project?.slug) {
            revalidatePath(`/projects/${unit.project.slug}`);
        }

        return NextResponse.json({ success: true, data: unit });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}