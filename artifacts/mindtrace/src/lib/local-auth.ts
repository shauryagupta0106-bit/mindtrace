// Local auth system — replaces Clerk when no API key is present

const STORAGE_KEY = 'mindtrace_auth_user';

export interface LocalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  primaryEmailAddress: string;
  lastSignInAt: string;
  imageUrl: string;
  createdAt: number;
}

export const localAuth = {
  getUser: (): LocalUser | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  isSignedIn: (): boolean => {
    return localAuth.getUser() !== null;
  },

  signIn: (email: string, password: string): LocalUser => {
    // Accept any email/password for local dev
    const user: LocalUser = {
      id: 'local-user-' + Date.now(),
      email,
      firstName: email.split('@')[0],
      lastName: '',
      fullName: email.split('@')[0],
      primaryEmailAddress: email,
      lastSignInAt: new Date().toISOString(),
      imageUrl: '',
      createdAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  signUp: (email: string, password: string, firstName?: string): LocalUser => {
    const user: LocalUser = {
      id: 'local-user-' + Date.now(),
      email,
      firstName: firstName || email.split('@')[0],
      lastName: '',
      fullName: firstName || email.split('@')[0],
      primaryEmailAddress: email,
      lastSignInAt: new Date().toISOString(),
      imageUrl: '',
      createdAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  signOut: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};

// Check if real Clerk key is present and valid
export const isClerkEnabled = (): boolean => {
  try {
    const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    return Boolean(
      key &&
      typeof key === 'string' &&
      key.length > 20 &&
      (key.startsWith('pk_live_') || key.startsWith('pk_test_')) &&
      !key.includes('placeholder') &&
      !key.includes('disabled')
    );
  } catch { return false; }
};
