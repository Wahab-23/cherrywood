import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

// GET progress updates by project
export async function GET(request: NextRequest) {
    const auth = requirePermission(request, "projects", "read");
    if ("error" in auth) return auth.error;

    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("project_id");

        if (!projectId) {
            return NextResponse.json({ success: false, error: "project_id is required" }, { status: 400 });
        }

        const updates = await prisma.projectUpdate.findMany({
            where: { project_id: projectId },
            orderBy: { created_at: "desc" },
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

        return NextResponse.json({ success: true, data: updates });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST new progress update
export async function POST(request: NextRequest) {
    const auth = requirePermission(request, "projects", "update");
    if ("error" in auth) return auth.error;

    try {
        const body = await request.json();
        const { project_id, title, description, progress_percentage, visibility, images } = body;

        if (!project_id) {
            return NextResponse.json({ success: false, error: "project_id is required" }, { status: 400 });
        }
        if (!title) {
            return NextResponse.json({ success: false, error: "title is required" }, { status: 400 });
        }

        const userId = auth.session.userId;

        // Create project update
        const update = await prisma.projectUpdate.create({
            data: {
                project_id,
                title,
                description,
                progress_percentage: progress_percentage ? Number(progress_percentage) : null,
                visibility: visibility || "public",
                created_by: userId,
                images: images && Array.isArray(images) ? {
                    create: images.map((url: string) => ({
                        image_url: url
                    }))
                } : undefined
            },
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

        return NextResponse.json({ success: true, data: update }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
