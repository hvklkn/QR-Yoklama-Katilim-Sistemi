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

// Debug logging
const isDev = process.env.NODE_ENV === "development";
const log = (message: string, data?: any) => {
  if (isDev) {
    console.log(`[AdminAuth] ${message}`, data ? JSON.stringify(data, null, 2) : "");
  }
};

const error = (message: string, data?: any) => {
  console.error(`[AdminAuth] ERROR: ${message}`, data ? JSON.stringify(data, null, 2) : "");
};

/**
 * Validates admin credentials
 */
export function validateAdminCredentials(
  email: string,
  password: string
): boolean {
  log("Validating credentials", { email, providedEmail: email, storedEmail: ADMIN_EMAIL });
  log("Password validation", { providedPassword: password?.length || 0, storedPassword: ADMIN_PASSWORD?.length || 0 });
  
  const emailMatch = email === ADMIN_EMAIL;
  const passwordMatch = password === ADMIN_PASSWORD;
  
  log("Credentials validation result", { emailMatch, passwordMatch });
  
  if (!emailMatch) error("Email mismatch", { expected: ADMIN_EMAIL, received: email });
  if (!passwordMatch) error("Password mismatch");
  
  return emailMatch && passwordMatch;
}

/**
 * Creates admin session
 */
export function createAdminSession(email: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  
  log("Creating admin session", { email, tokenLength: token.length });

  activeSessions.set(token, {
    email,
    token,
    createdAt: Date.now(),
  });

  log("Session created", { sessionsCount: activeSessions.size });
  return token;
}

/**
 * Validates admin session token
 */
export function validateAdminSession(token: string): boolean {
  log("Validating session token", { token: token?.slice(0, 8) + "..." });
  
  const session = activeSessions.get(token);

  if (!session) {
    error("Session not found");
    return false;
  }

  // Check if session expired
  const expiryTime = Date.now() - session.createdAt;
  if (expiryTime > SESSION_EXPIRY) {
    log("Session expired", { age: expiryTime });
    activeSessions.delete(token);
    return false;
  }

  log("Session valid", { email: session.email, age: expiryTime });
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
