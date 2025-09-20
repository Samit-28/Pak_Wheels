// backend/lib/auth.ts
import jwt from "jsonwebtoken";

const SECRET = (globalThis as any)?.process?.env?.JWT_SECRET ?? "dev-secret-change-me";

/**
 * Payload shape in JWT
 */
export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

/**
 * Sign a JWT for a given userId (7d expiration).
 */
export function signToken(userId: number) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
}

/**
 * Verify token and return payload.
 * Throws if invalid.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}

/**
 * Extract userId from Authorization header string ("Bearer <token>")
 * Throws Error if missing/invalid.
 */
export function getUserIdFromAuthHeader(authHeader?: string): number {
  if (!authHeader) throw new Error("Missing Authorization header");
  const parts = String(authHeader).split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") throw new Error("Invalid Authorization header");
  const token = parts[1];
  const payload = verifyToken(token);
  if (!payload?.userId) throw new Error("Invalid token payload");
  const id = Number(payload.userId);
  if (!Number.isFinite(id)) throw new Error("Invalid user id in token");
  return id;
}
