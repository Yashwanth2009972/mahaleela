import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "mahaleela_luxury_secret_key_2026";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  name?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("mahaleela_session")?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload) return null;

    // Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, name: true, exclusiveStatus: true },
    });

    if (!user) return null;
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AuthPayload | null> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return null;
  }
  return user;
}
