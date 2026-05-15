export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  roleName: string;
  role: {
    id: string;
    name: string;
  };
  isVerified: boolean;
  status: string;
}

/**
 * Get stored user info from sessionStorage (display purposes only).
 * The actual auth token lives in an httpOnly cookie — never in JS storage.
 */
export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;

  const user = sessionStorage.getItem('auth_user');
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

/**
 * Cache user info in sessionStorage after login (for display only).
 */
export const setStoredUser = (user: AuthUser) => {
  sessionStorage.setItem('auth_user', JSON.stringify(user));
};

/**
 * Clear cached user info on logout.
 */
export const clearStoredUser = () => {
  sessionStorage.removeItem('auth_user');
};
