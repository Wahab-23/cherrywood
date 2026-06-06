import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

export async function GET(request: NextRequest) {
    const auth = requirePermission(request, "inquiries", "read");
    if ("error" in auth) return auth.error;

    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "10";
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";
        const interest = searchParams.get("interest") || "";

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        // Build where clause
        const whereClause: any = {
            AND: []
        };

        if (search) {
            whereClause.AND.push({
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } },
                    { phone: { contains: search } },
                    { message: { contains: search } }
                ]
            });
        }

        if (status) {
            whereClause.AND.push({ status });
        }

        if (interest) {
            whereClause.AND.push({ interest });
        }

        // Fetch inquiries
        const inquiries = await prisma.inquiry.findMany({
            where: whereClause,
            take,
            skip,
            orderBy: { created_at: "desc" }
        });

        // Get total count
        const count = await prisma.inquiry.count({
            where: whereClause
        });

        // Get stats for metadata
        const [totalCount, newCount, contactedCount, closedCount] = await Promise.all([
            prisma.inquiry.count(),
            prisma.inquiry.count({ where: { status: 'new' } }),
            prisma.inquiry.count({ where: { status: 'contacted' } }),
            prisma.inquiry.count({ where: { status: 'closed' } }),
        ]);

        return NextResponse.json({
            success: true,
            data: inquiries,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(count / take),
            totalInquiries: count,
            stats: {
                total: totalCount,
                new: newCount,
                contacted: contactedCount,
                closed: closedCount
            },
            message: "Inquiries fetched successfully"
        });
    } catch (error: any) {
        console.error("[GET /api/inquiries]", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal Server Error",
                error: process.env.NODE_ENV === "development" ? error : undefined,
            },
            { status: 500 }
        );
    }
}
