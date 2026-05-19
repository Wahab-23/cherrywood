import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

// PUT edit progress update
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = requirePermission(request, "projects", "update");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const body = await request.json();
        const { title, description, progress_percentage, visibility, images } = body;

        const data: any = {};
        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        if (progress_percentage !== undefined) {
            data.progress_percentage = progress_percentage !== null && progress_percentage !== "" 
                ? Number(progress_percentage) 
                : null;
        }
        if (visibility !== undefined) data.visibility = visibility;

        // If images are specified, replace the existing gallery images
        if (images && Array.isArray(images)) {
            // Delete old associated images
            await prisma.projectUpdateImage.deleteMany({
                where: { update_id: id }
            });
            // Re-create new images
            data.images = {
                create: images.map((url: string) => ({
                    image_url: url
                }))
            };
        }

        const update = await prisma.projectUpdate.update({
            where: { id },
            data,
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile_image: true,
                    }
                },
                images: true,
            }
        });

        return NextResponse.json({ success: true, data: update });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE progress update
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = requirePermission(request, "projects", "update");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;

        // Bulletproof: delete children relation records first to avoid constraint issues
        await prisma.projectUpdateImage.deleteMany({
            where: { update_id: id }
        });

        const deleted = await prisma.projectUpdate.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, data: deleted });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
