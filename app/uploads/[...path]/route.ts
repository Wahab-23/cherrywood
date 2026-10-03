import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".bmp": "image/bmp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const baseUploadDir = path.resolve(process.cwd(), "public", "uploads");
    const filePath = path.resolve(baseUploadDir, ...pathSegments);

    // Security check: Path Traversal protection
    if (!filePath.startsWith(baseUploadDir + path.sep) && filePath !== baseUploadDir) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    try {
      const stats = await stat(filePath);
      if (!stats.isFile()) {
        return new NextResponse("Not Found", { status: 404 });
      }
    } catch {
      return new NextResponse("Not Found", { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse(null, { status: 404 });
    }

    const baseUploadDir = path.resolve(process.cwd(), "public", "uploads");
    const filePath = path.resolve(baseUploadDir, ...pathSegments);

    if (!filePath.startsWith(baseUploadDir + path.sep) && filePath !== baseUploadDir) {
      return new NextResponse(null, { status: 403 });
    }

    try {
      const stats = await stat(filePath);
      if (!stats.isFile()) {
        return new NextResponse(null, { status: 404 });
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      return new NextResponse(null, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": stats.size.toString(),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new NextResponse(null, { status: 404 });
    }
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
