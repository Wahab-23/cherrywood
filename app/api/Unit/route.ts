import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

interface Filter {
    search?: string;
    project_id?: string;
    type?: string;
    status?: string;
    floor?: string;
    price?: number;
    size_sqft?: number;
    owner_id?: string;
    created_at?: string;
    updated_at?: string;
}

//get units
export async function GET(request: NextRequest) {
    const auth = requirePermission(request, "units", "read");
    if ("error" in auth) return auth.error;

    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search");
        const project_id = searchParams.get("project_id");
        const type = searchParams.get("type");
        const status = searchParams.get("status");
        const floor = searchParams.get("floor");
        const price = searchParams.get("price");
        const size_sqft = searchParams.get("size_sqft");
        const owner_id = searchParams.get("owner_id");
        const created_at = searchParams.get("created_at");
        const updated_at = searchParams.get("updated_at");

        const filter: Filter = {};
        // Note: Filter construction might need adjustment for Prisma's where object
        // but keeping it close to original for now.
        // Actually, Prisma 'where' doesn't support 'search' directly like this.
        // I'll fix the filter to be valid Prisma where input.
        const where: any = {};
        if (project_id) where.project_id = project_id;
        if (type) where.type = type;
        if (status) where.status = status;
        if (floor) where.floor = floor;
        if (price) where.price = Number(price);
        if (size_sqft) where.size_sqft = Number(size_sqft);
        if (owner_id) where.owner_id = owner_id;
        if (search) {
            where.OR = [
                { unit_number: { contains: search } },
                { type: { contains: search } },
            ];
        }

        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;
        const units = await prisma.unit.findMany({
            where,
            include: {
                project: true,
                owner: true,
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { created_at: "desc" },
        });
        const count = await prisma.unit.count({ where });
        return NextResponse.json({
            success: true,
            data: units,
            page,
            limit,
            totalPages: Math.ceil(count / Number(limit)),
            totalUnits: count,
            message: "Units fetched successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}

//create unit
export async function POST(request: NextRequest) {
    const auth = requirePermission(request, "units", "create");
    if ("error" in auth) return auth.error;

    try {
        const { ...data } = await request.json();
        const unit = await prisma.unit.create({
            data: {
                ...data,
                price: data.price ? Number(data.price) : undefined,
                size_sqft: data.size_sqft ? Number(data.size_sqft) : undefined,
            },
            include: {
                project: true,
                owner: true,
            },
        });
        return NextResponse.json({
            success: true,
            data: unit,
            message: "Unit created successfully",
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}
