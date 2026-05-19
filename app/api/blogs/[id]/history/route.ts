import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = requirePermission(request, "blogs", "read");
    if ("error" in authResult) return authResult.error;

    try {
        const { id } = await params;
        const history = await prisma.history.findMany({
            where: {
                entity_type: "blog",
                entity_id: id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile_image: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });

        return NextResponse.json({ success: true, data: history });
    } catch (error: any) {
        console.error("[GET /api/blogs/[id]/history]", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
