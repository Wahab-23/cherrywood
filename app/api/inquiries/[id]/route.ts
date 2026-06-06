import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const auth = requirePermission(request, "inquiries", "update");
    if ("error" in auth) return auth.error;

    try {
        const body = await request.json();
        const { status } = body;

        if (!status || !['new', 'contacted', 'closed'].includes(status)) {
            return NextResponse.json(
                { success: false, message: "Invalid status value. Must be 'new', 'contacted', or 'closed'." },
                { status: 400 }
            );
        }

        const inquiry = await prisma.inquiry.update({
            where: { id: params.id },
            data: { status }
        });

        return NextResponse.json({
            success: true,
            data: inquiry,
            message: "Inquiry status updated successfully"
        });
    } catch (error: any) {
        console.error(`[PATCH /api/inquiries/${params.id}]`, error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const auth = requirePermission(request, "inquiries", "delete");
    if ("error" in auth) return auth.error;

    try {
        await prisma.inquiry.delete({
            where: { id: params.id }
        });

        return NextResponse.json({
            success: true,
            message: "Inquiry deleted successfully"
        });
    } catch (error: any) {
        console.error(`[DELETE /api/inquiries/${params.id}]`, error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
