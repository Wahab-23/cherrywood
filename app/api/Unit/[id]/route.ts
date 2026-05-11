import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// How to send request from postman to get unit
// Method : GET
// URL : http://localhost:3000/api/projects/Unit/1
// Headers : 
// Key : Content-Type
// Value : application/json
// Body : 
// Key : id
// Value : 1

// How to send request from postman to update unit
// Method : PATCH
// URL : http://localhost:3000/api/projects/Unit/1
// Headers : 
// Key : Content-Type
// Value : application/json
// Body : 
// Key : id
// Value : 1
// Key : title
// Value : Title Updated
// Key : content
// Value : Content Updated

// How to send request from postman to delete unit
// Method : DELETE
// URL : http://localhost:3000/api/projects/Unit/1
// Headers : 
// Key : Content-Type
// Value : application/json
// Body : 
// Key : id
// Value : 1

// How to send request from postman to update unit
// Method : PUT
// URL : http://localhost:3000/api/projects/Unit/1
// Headers : 
// Key : Content-Type
// Value : application/json
// Body : 
// Key : id
// Value : 1
// Key : title
// Value : Title Updated
// Key : content
// Value : Content Updated

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
            return NextResponse.json({ error: "Unit not found" }, { status: 404 });
        }

        return NextResponse.json(unit);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();
        const unit = await prisma.unit.update({
            where: { id },
            data,
        });
        return NextResponse.json(unit);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const unit = await prisma.unit.delete({ where: { id } });
        return NextResponse.json(unit);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}