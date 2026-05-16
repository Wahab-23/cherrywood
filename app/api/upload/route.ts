import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir, unlink, access, readdir, stat, rm } from 'fs/promises';
import path from 'path';
import { requirePermission } from '@/lib/guards';

export async function GET(request: NextRequest) {
    const auth = requirePermission(request, "media", "read");
    if ("error" in auth) return auth.error;

    try {
        const { searchParams } = new URL(request.url);
        const folderPath = searchParams.get('path') || '';
        
        const baseUploadDir = path.join(process.cwd(), 'public', 'uploads');
        const targetDir = path.join(baseUploadDir, folderPath);
        
        // Safety check: Ensure targetDir is within baseUploadDir
        if (!targetDir.startsWith(baseUploadDir)) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
        }

        // Check if directory exists
        try {
            await access(targetDir);
        } catch {
            return NextResponse.json([], { status: 200 });
        }

        const entries = await readdir(targetDir, { withFileTypes: true });
        const items = await Promise.all(entries.map(async (entry) => {
            const fullPath = path.join(targetDir, entry.name);
            const relativePath = path.join(folderPath, entry.name);
            const stats = await stat(fullPath);
            
            if (entry.name.startsWith('.')) return null;

            if (entry.isDirectory()) {
                return {
                    name: entry.name,
                    path: relativePath,
                    type: 'folder',
                    mtime: stats.mtime,
                };
            } else {
                return {
                    name: entry.name,
                    url: `/uploads/${relativePath.split(path.sep).join('/')}`,
                    type: 'file',
                    size: stats.size,
                    mtime: stats.mtime,
                };
            }
        }));

        const filteredItems = items.filter(item => item !== null);
        // Sort: folders first, then files by mtime
        filteredItems.sort((a: any, b: any) => {
            if (a.type === b.type) return b.mtime.getTime() - a.mtime.getTime();
            return a.type === 'folder' ? -1 : 1;
        });
        
        return NextResponse.json(filteredItems);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const action = formData.get('action') as string || 'upload';
        const uploadPath = formData.get('path') as string || '';

        // Authorization logic:
        // 1. If it's a profile picture upload, any authenticated user can do it.
        // 2. Otherwise, require 'media:create' permission.
        if (uploadPath !== 'users_profile') {
            const auth = requirePermission(request, "media", "create");
            if ("error" in auth) return auth.error;
        } else {
            // For profile images, just require being logged in
            const auth = requirePermission(request, "users", "read"); // or some basic auth check
            if ("error" in auth) return auth.error;
        }

        if (action === 'createFolder') {
            const folderName = formData.get('name') as string;
            if (!folderName) return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
            
            const newFolderPath = path.join(process.cwd(), 'public', 'uploads', uploadPath, folderName);
            await mkdir(newFolderPath, { recursive: true });
            return NextResponse.json({ success: true, name: folderName }, { status: 201 });
        }

        const file = formData.get('file');

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const ext = path.extname(file.name);
        const baseName = path.basename(file.name, ext)
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .toLowerCase();
        const uniqueName = `${baseName}-${Date.now()}${ext}`;

        // Ensure uploads directory exists with the specified path
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', uploadPath);
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, uniqueName);
        await writeFile(filePath, buffer);

        const url = `/uploads/${uploadPath}/${uniqueName}`;
        return NextResponse.json({ url, filename: uniqueName }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const auth = requirePermission(request, "media", "delete");
    if ("error" in auth) return auth.error;

    try {
        const { url, path: folderPath, type } = await request.json();

        if (!url && !folderPath) {
            return NextResponse.json({ error: 'URL or Path is required' }, { status: 400 });
        }

        const baseDir = path.join(process.cwd(), 'public', 'uploads');
        let targetPath: string;
        if (type === 'folder') {
            if (!folderPath) return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
            targetPath = path.join(baseDir, folderPath);
        } else {
            if (!url) return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
            // Correctly join with baseDir to ensure the 'uploads' segment is present
            targetPath = path.join(baseDir, url.replace(/^\/uploads\//, ''));
        }

        // Safety check: Ensure targetPath is within baseDir
        if (!targetPath.startsWith(baseDir)) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
        }

        // Check if item exists
        try {
            await access(targetPath);
        } catch {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Delete the item
        if (type === 'folder') {
            await rm(targetPath, { recursive: true, force: true });
        } else {
            await unlink(targetPath);
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}