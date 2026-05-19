import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/guards";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const blog = await prisma.blog.findUnique({
            where: { id },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        profile_image: true,
                    },
                },
            },
        });

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = requirePermission(request, "blogs", "update");
    if ("error" in authResult) return authResult.error;
    try {
        const { id } = await params;
        const body = await request.json();
        const { author_id, published_at, status, ...rest } = body;

        // Fetch existing blog to compare changes
        const existing = await prisma.blog.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
        }

        const updateData: any = {
            ...rest,
            status,
        };

        if (author_id) updateData.author_id = author_id;
        
        if (published_at) {
            updateData.published_at = new Date(published_at);
        } else if (status === "published") {
            if (!existing.published_at) {
                updateData.published_at = new Date();
            }
        }

        // Compare fields and compile history records
        const changes: { field_name: string; old_value: string | null; new_value: string | null }[] = [];
        const fieldsToCheck = [
            "title",
            "slug",
            "short_description",
            "content",
            "meta_title",
            "meta_description",
            "hero_image",
            "status",
            "author_id",
            "category_id",
            "faqs",
        ];

        for (const field of fieldsToCheck) {
            if (field in updateData) {
                const oldValue = (existing as any)[field];
                const newValue = updateData[field];
                
                const normOld = oldValue === undefined || oldValue === null ? "" : String(oldValue).trim();
                const normNew = newValue === undefined || newValue === null ? "" : String(newValue).trim();
                
                if (normOld !== normNew) {
                    changes.push({
                        field_name: field,
                        old_value: oldValue !== null && oldValue !== undefined ? String(oldValue) : null,
                        new_value: newValue !== null && newValue !== undefined ? String(newValue) : null,
                    });
                }
            }
        }

        if (updateData.published_at) {
            const oldValue = existing.published_at;
            const newValue = updateData.published_at;
            const normOld = oldValue ? new Date(oldValue).getTime() : 0;
            const normNew = new Date(newValue).getTime();
            if (normOld !== normNew) {
                changes.push({
                    field_name: "published_at",
                    old_value: oldValue ? oldValue.toISOString() : null,
                    new_value: newValue.toISOString(),
                });
            }
        }

        const blog = await prisma.blog.update({
            where: { id },
            data: updateData,
        });

        // Insert change logs if any changes were made
        if (changes.length > 0) {
            await prisma.history.createMany({
                data: changes.map(change => ({
                    entity_type: "blog",
                    entity_id: id,
                    field_name: change.field_name,
                    old_value: change.old_value,
                    new_value: change.new_value,
                    changed_by: authResult.session.userId,
                }))
            });
        }

        return NextResponse.json({ success: true, data: blog });
    } catch (error: any) {
        console.error("[PUT /api/blogs/[id]]", error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { success: false, message: "A blog with this slug already exists." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = requirePermission(request, "blogs", "delete");
    if ("error" in authResult) return authResult.error;
    try {
        const { id } = await params;
        const blog = await prisma.blog.delete({ where: { id } });
        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}