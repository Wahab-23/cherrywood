import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.blogCategory.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: {
                        blogs: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: categories,
            totalCategories: categories.length,
            totalPages: 1
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch categories"
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, slug } = await request.json();
        const category = await prisma.blogCategory.create({
            data: { name, slug }
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        // Find uncategorized category
        let uncategorized = await prisma.blogCategory.findFirst({
            where: {
                slug: 'uncategorized'
            }
        });

        // Create if missing
        if (!uncategorized) {
            uncategorized = await prisma.blogCategory.create({
                data: {
                    name: 'Uncategorized',
                    slug: 'uncategorized',
                    system: true
                }
            });
        }

        // Prevent deleting Uncategorized itself
        if (id === uncategorized.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Cannot delete Uncategorized category'
                },
                { status: 400 }
            );
        }

        // Move blogs
        await prisma.blog.updateMany({
            where: {
                category_id: id
            },
            data: {
                category_id: uncategorized.id
            }
        });

        // Delete category
        await prisma.blogCategory.delete({
            where: {
                id
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete category'
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, name, slug } = await request.json();
        const category = await prisma.blogCategory.update({
            where: { id },
            data: { name, slug }
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}