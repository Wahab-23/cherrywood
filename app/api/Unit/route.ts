import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

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
        if (search) filter.search = search;
        if (project_id) filter.project_id = project_id;
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (floor) filter.floor = floor;
        if (price) filter.price = Number(price);
        if (size_sqft) filter.size_sqft = Number(size_sqft);
        if (owner_id) filter.owner_id = owner_id;
        if (created_at) filter.created_at = created_at;
        if (updated_at) filter.updated_at = updated_at;

        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;
        const units = await prisma.unit.findMany({
            where: filter,
            include: {
                project: true,
                owner: true,
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { created_at: "desc" },
        });
        const count = await prisma.unit.count({ where: filter });
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
    try {
        const { ...data } = await request.json();
        const unit = await prisma.unit.create({
            data: {
                ...data,
                price: Number(data.price),
                size_sqft: Number(data.size_sqft),
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
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error",
            error: process.env.NODE_ENV === "development" ? error : undefined
        }, { status: 500 });
    }
}
