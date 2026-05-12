import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

interface Params {
    id: string;
}

//get role by id
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = requirePermission(request, "roles", "read");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const role = await prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            return NextResponse.json({
                success: false,
                message: "Role not found",
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            data: role,
            message: "Role fetched successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}

//update role
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = requirePermission(request, "roles", "update");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const { ...data } = await request.json();
        const role = await prisma.role.update({
            where: { id },
            data: {
                ...data,
            },
        });
        return NextResponse.json({
            success: true,
            data: role,
            message: "Role updated successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}

//delete role
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = requirePermission(request, "roles", "delete");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        await prisma.role.delete({
            where: { id },
        });
        return NextResponse.json({
            success: true,
            message: "Role deleted successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}