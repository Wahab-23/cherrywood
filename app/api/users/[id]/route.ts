import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { requirePermission } from "@/lib/guards";

interface Params {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
    // Any logged-in user can view a user profile
    const auth = requirePermission(request, "users", "read");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const { password: _password, ...safeUser } = user;
        return NextResponse.json({ success: true, data: safeUser });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<Params> }) {
    const { id } = await params;
    let auth = requirePermission(request, "users", "update");
    
    // Check if it's a self-update (users should always be able to update their own profile)
    const readAuth = requirePermission(request, "users", "read");
    const isSelfUpdate = !("error" in auth) ? false : (!("error" in readAuth) && readAuth.session?.userId === id);
    
    // If it's not a self-update and they don't have update permissions, return the error
    if ("error" in auth && !isSelfUpdate) return auth.error;

    try {
        const body = await request.json();
        let { password, ...rest } = body;
        
        // If it's a self-update and NOT an admin, prevent changing role or status
        if (isSelfUpdate && ("error" in auth)) {
            delete rest.role_id;
            delete rest.status;
            delete rest.is_verified;
        }

        const data: Record<string, unknown> = { ...rest };

        // Only hash and update the password if explicitly provided
        if (password) {
            data.password = await bcrypt.hash(password, 12);
        }

        const user = await prisma.user.update({
            where: { id },
            data,
            include: { role: true },
        });

        const { password: _password, ...safeUser } = user;
        return NextResponse.json({ success: true, data: safeUser });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }) {
    // Only admins can delete users
    const auth = requirePermission(request, "users", "delete");
    if ("error" in auth) return auth.error;

    try {
        const { id } = await params;
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: process.env.NODE_ENV === "development" ? error : "Internal Server Error" },
            { status: 500 }
        );
    }
}
