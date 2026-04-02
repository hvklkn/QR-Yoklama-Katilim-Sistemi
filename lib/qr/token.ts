import crypto from "crypto";

export const QR_TOKEN_LENGTH = 32;
export const DEFAULT_TOKEN_EXPIRY_MINUTES = parseInt(
  process.env.QR_TOKEN_EXPIRY_MINUTES || "5"
);

/**
 * Generates a cryptographically secure random QR token
 */
export function generateQRToken(): string {
  return crypto.randomBytes(QR_TOKEN_LENGTH).toString("hex");
}

/**
 * Calculates token expiration time
 */
export function calculateTokenExpiry(minutes: number = DEFAULT_TOKEN_EXPIRY_MINUTES): Date {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60 * 1000);
}

/**
 * Checks if a token is expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Validates QR token format
 */
export function isValidTokenFormat(token: string): boolean {
  // Must be 32-byte hex string (64 characters)
  return /^[a-f0-9]{64}$/.test(token);
}
