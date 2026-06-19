import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guards";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
    const auth = requireRole(request, ["admin"]);
    if ("error" in auth) return auth.error;

    try {
        const [
            pagesCount,
            projectsCount,
            unitsCount,
            updatesCount,
            blogsCount,
            inquiriesCount,
            sessionsCount,
        ] = await Promise.all([
            prisma.page.count(),
            prisma.project.count(),
            prisma.unit.count(),
            prisma.projectUpdate.count(),
            prisma.blog.count(),
            prisma.inquiry.count(),
            prisma.analyticsSession.count(),
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                pages: pagesCount,
                projects: projectsCount,
                units: unitsCount,
                updates: updatesCount,
                blogs: blogsCount,
                inquiries: inquiriesCount,
                sessions: sessionsCount,
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = requireRole(request, ["admin"]);
    if ("error" in auth) return auth.error;

    try {
        const body = await request.json();
        const { action } = body;

        if (action === "clear-cache") {
            // Revalidate storefront pages
            revalidatePath("/", "layout");
            
            // Revalidate specific static page routes just to be sure
            revalidatePath("/");
            revalidatePath("/projects");
            
            // Fetch projects to revalidate each project page
            const projects = await prisma.project.findMany({ select: { slug: true } });
            for (const project of projects) {
                if (project.slug) {
                    revalidatePath(`/projects/${project.slug}`);
                    revalidatePath(`/projects/${project.slug}/type-a`);
                    revalidatePath(`/projects/${project.slug}/type-b`);
                    revalidatePath(`/projects/${project.slug}/type-c`);
                }
            }

            // Fetch custom layout pages to revalidate
            const pages = await prisma.page.findMany({ select: { slug: true } });
            for (const page of pages) {
                if (page.slug && page.slug !== "home") {
                    revalidatePath(`/${page.slug}`);
                }
            }

            return NextResponse.json({
                success: true,
                message: "Storefront caches have been invalidated and will rebuild on next load."
            });
        }

        if (action === "clear-analytics") {
            // Delete events, views, and sessions
            await prisma.analyticsEvent.deleteMany({});
            await prisma.analyticsPageView.deleteMany({});
            await prisma.analyticsSession.deleteMany({});

            return NextResponse.json({
                success: true,
                message: "All analytics tracking sessions and events have been cleared."
            });
        }

        if (action === "clear-inquiries") {
            await prisma.inquiry.deleteMany({});

            return NextResponse.json({
                success: true,
                message: "All customer inquiries have been cleared."
            });
        }

        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
