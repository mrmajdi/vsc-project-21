import { useRouter } from 'next/router';
import { signIn, signOut, getSession } from 'next-auth/react';
import { useState, useCallback } from 'react';

/**
 * Custom hook wrapping NextAuth authentication functions.
 * Provides login, register, logout, and session retrieval with loading/error states.
 */
export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sign in with credentials provider.
   * @param email - User email
   * @param password - User password
   */
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      // Redirect to home after successful login
      router.push('/');
    } catch (err: any) {
      setError(err.message ?? 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  }, [router]);

  /**
   * Register a new user via custom API endpoint.
   * Assumes an API route at /api/register that creates a user.
   * @param email - User email
   * @param password - User password
   * @param name - Optional user name
   */
  const register = useCallback(async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? 'خطا در ثبت‌نام');
      }
      // Auto-login after registration
      await signIn('credentials', { redirect: false, email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.message ?? 'خطا در ثبت‌نام');
    } finally {
      setLoading(false);
    }
  }, [router]);

  /**
   * Sign out the current user.
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut({ redirect: false });
      router.push('/login');
    } catch (err: any) {
      setError(err.message ?? 'خطا در خروج');
    } finally {
      setLoading(false);
    }
  }, [router]);

  /**
   * Retrieve the current session from NextAuth.
   */
  const getAuthSession = useCallback(async () => {
    const session = await getSession();
    return session;
  }, []);

  return { login, register, logout, getAuthSession, loading, error };
}