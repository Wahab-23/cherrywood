import { NextRequest, NextResponse } from "next/server";
import { getSession, JWTPayload } from "./auth";

type AuthSuccess = { session: JWTPayload };
type AuthError = { error: NextResponse };

/**
 * Verifies the request has a valid JWT token.
 * Returns the session payload, or an error response if unauthenticated.
 */
export function requireAuth(request: NextRequest): AuthSuccess | AuthError {
    const session = getSession(request);
    if (!session) {
        return {
            error: NextResponse.json(
                { success: false, error: "Unauthorized. Please log in." },
                { status: 401 }
            ),
        };
    }
    return { session };
}

/**
 * Verifies the request has a valid JWT token AND the user is verified.
 */
export function requireVerified(request: NextRequest): AuthSuccess | AuthError {
    const result = requireAuth(request);
    if ("error" in result) return result;

    if (!result.session.isVerified) {
        return {
            error: NextResponse.json(
                { success: false, error: "Access denied. Please verify your account." },
                { status: 403 }
            ),
        };
    }
    return result;
}

/**
 * Verifies the request has a valid JWT token AND the user's role is one of
 * the allowed roles. Returns 401 if not logged in, 403 if wrong role.
 */
export function requireRole(
    request: NextRequest,
    roles: string[]
): AuthSuccess | AuthError {
    const result = requireAuth(request);
    if ("error" in result) return result;

    if (!roles.includes(result.session.roleName)) {
        return {
            error: NextResponse.json(
                {
                    success: false,
                    error: `Forbidden. Required role: ${roles.join(" or ")}.`,
                },
                { status: 403 }
            ),
        };
    }
    return result;
}

/**
 * Verifies the request has a valid JWT token AND the user has permission
 * for the specified resource and action.
 */
export function requirePermission(
    request: NextRequest,
    resource: string,
    action: string
): AuthSuccess | AuthError {
    const result = requireAuth(request);
    if ("error" in result) return result;

    const access = result.session.access || {};
    const resourceAccess = access[resource];

    const hasAccess =
        resourceAccess === true ||
        (Array.isArray(resourceAccess) && resourceAccess.includes(action));

    if (!hasAccess) {
        return {
            error: NextResponse.json(
                {
                    success: false,
                    error: `Forbidden. You do not have permission to ${action} ${resource}.`,
                },
                { status: 403 }
            ),
        };
    }
    return result;
}

