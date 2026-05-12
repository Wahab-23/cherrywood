export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: {
    id: string;
    name: string;
  };
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export const getStoredAuth = () => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('auth_user');
  
  if (!token || !user) return null;
  
  try {
    return { token, user: JSON.parse(user) };
  } catch {
    return null;
  }
};

export const setStoredAuth = (token: string, user: AuthUser) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};
