import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";


const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

export interface JWTPayload {
    userId: string;
    roleId: string;
    roleName: string;
    isVerified: boolean;
    access: any;
}

export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: "3d" });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET!) as JWTPayload;
    } catch (error) {
        console.log("Error verification", error)
        return null;
    }
}

// For API routes — reads from HttpOnly cookie
export function getSession(request: NextRequest): JWTPayload | null {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

// For Server Components — reads from cookie store
export async function getServerSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}