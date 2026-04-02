import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@localhost";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_COOKIE = "admin_session";
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface AdminSession {
  email: string;
  token: string;
  createdAt: number;
}

const activeSessions = new Map<string, AdminSession>();

/**
 * Validates admin credentials
 */
export function validateAdminCredentials(
  email: string,
  password: string
): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

/**
 * Creates admin session
 */
export function createAdminSession(email: string): string {
  const token = crypto.randomBytes(32).toString("hex");

  activeSessions.set(token, {
    email,
    token,
    createdAt: Date.now(),
  });

  return token;
}

/**
 * Validates admin session token
 */
export function validateAdminSession(token: string): boolean {
  const session = activeSessions.get(token);

  if (!session) {
    return false;
  }

  // Check if session expired
  if (Date.now() - session.createdAt > SESSION_EXPIRY) {
    activeSessions.delete(token);
    return false;
  }

  return true;
}

/**
 * Gets session from cookies
 */
export async function getAdminSessionFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}

/**
 * Sets session cookie
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY / 1000,
    path: "/",
  });
}

/**
 * Clears admin session
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Gets active sessions count (for monitoring)
 */
export function getActiveSessionsCount(): number {
  return activeSessions.size;
}
