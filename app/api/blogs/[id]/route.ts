import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

//How sent request from postman to get blog
//Method : GET
//URL : http://localhost:3000/api/blogs/1
//Headers : 
//Key : Content-Type
//Value : application/json
//Body : 
//Key : id
//Value : 1

//How sent request from postman to update blog
//Method : PATCH
//URL : http://localhost:3000/api/blogs/1
//Headers : 
//Key : Content-Type
//Value : application/json
//Body : 
//Key : id
//Value : 1
//Key : title
//Value : Title Updated
//Key : content
//Value : Content Updated

//How sent request from postman to delete blog
//Method : DELETE
//URL : http://localhost:3000/api/blogs/1
//Headers : 
//Key : Content-Type
//Value : application/json
//Body : 
//Key : id
//Value : 1

//How sent request from postman to update blog
//Method : PUT
//URL : http://localhost:3000/api/blogs/1
//Headers : 
//Key : Content-Type
//Value : application/json
//Body : 
//Key : id
//Value : 1
//Key : title
//Value : Title Updated
//Key : content
//Value : Content Updated

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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();
        const blog = await prisma.blog.update({
            where: { id },
            data,
        });
        return NextResponse.json(blog);
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
        const blog = await prisma.blog.delete({ where: { id } });
        return NextResponse.json(blog);
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
        const blog = await prisma.blog.update({
            where: { id },
            data,
        });
        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}