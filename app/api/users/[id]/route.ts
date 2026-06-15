import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { requirePermission } from "@/lib/guards";

interface Params {
    id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
    // Only admins can view another user's profile if they don't have read access. Wait, read is fine for anyone with users:read.
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
        console.error("GET User Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<Params> }) {
    const { id } = await params;
    let auth = requirePermission(request, "users", "update");
    
    // Check if it's a self-update (users should always be able to update their own profile)
    const readAuth = requirePermission(request, "users", "read");
    const session = ("error" in auth) ? (("error" in readAuth) ? null : readAuth.session) : auth.session;
    const isSelfUpdate = session?.userId === id;
    
    // If it's not a self-update and they don't have update permissions, return the error
    if ("error" in auth && !isSelfUpdate) return auth.error;

    // Only admins can edit other users
    if (!isSelfUpdate && session?.roleName?.toLowerCase() !== 'admin') {
        return NextResponse.json({ success: false, error: "Only admins can edit other users." }, { status: 403 });
    }

    try {
        const body = await request.json();
        let { password, currentPassword, ...rest } = body;
        
        // If updating another user, require current user's password
        if (!isSelfUpdate) {
            if (!currentPassword) {
                return NextResponse.json({ success: false, error: "Current password is required to update another user." }, { status: 400 });
            }
            const currentUser = await prisma.user.findUnique({ where: { id: session!.userId } });
            if (!currentUser || !(await bcrypt.compare(currentPassword, currentUser.password))) {
                return NextResponse.json({ success: false, error: "Invalid admin password." }, { status: 401 });
            }
        }

        // If it's a self-update and NOT an admin, prevent changing role or status
        if (isSelfUpdate && session?.roleName?.toLowerCase() !== 'admin') {
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
        console.error("PUT User Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }) {
    // Only admins can delete users
    const auth = requirePermission(request, "users", "delete");
    if ("error" in auth) return auth.error;

    if (auth.session?.roleName?.toLowerCase() !== 'admin') {
        return NextResponse.json({ success: false, error: "Only admins can delete users." }, { status: 403 });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const { currentPassword } = body;

        if (!currentPassword) {
            return NextResponse.json({ success: false, error: "Current password is required to delete a user." }, { status: 400 });
        }

        const currentUser = await prisma.user.findUnique({ where: { id: auth.session.userId } });
        if (!currentUser || !(await bcrypt.compare(currentPassword, currentUser.password))) {
            return NextResponse.json({ success: false, error: "Invalid admin password." }, { status: 401 });
        }

        const { id } = await params;
        await prisma.user.update({ where: { id }, data: { status: 'deleted' } });
        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        console.error("DELETE User Error:", error);
        if (error.code === 'P2003') {
            return NextResponse.json(
                { success: false, error: "Cannot delete user because they have associated records (e.g., blogs, history, or updates). Please re-assign or delete those records first." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
