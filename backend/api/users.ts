// backend/api/users.ts
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { setCors } from "../lib/cors";
import { isValidEmail, isValidPhone, isNonEmptyString } from "../lib/validation";
import { Prisma } from "@prisma/client";
import { signToken, getUserIdFromAuthHeader } from "../lib/auth";

interface ReqLike { method?: string; query?: any; body?: any }
interface ResLike { status: (code: number) => ResLike; json: (body: any) => ResLike; setHeader: (name: string, value: any) => void; end: (body?: any) => void }

export default async function handler(req: ReqLike, res: ResLike) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      // Protect user list: require authorization
      const authHeader = (req as any).headers?.authorization ?? (req as any).headers?.Authorization;
      try {
        getUserIdFromAuthHeader(authHeader);
      } catch (e) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const users = await prisma.user.findMany({ include: { cars: true } });
      const safeUsers = users.map(({ password, ...rest }) => rest);
      return res.status(200).json(safeUsers);
    }

    if (req.method === "POST") {
      const { name, email, phone, password } = req.body || {};
      if (!name || !isNonEmptyString(name)) return res.status(400).json({ error: "Name is required" });
      if (!email || !isNonEmptyString(email)) return res.status(400).json({ error: "Email is required" });
      if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email" });
      if (phone && !isValidPhone(phone)) return res.status(400).json({ error: "Invalid phone" });
      if (!password) return res.status(400).json({ error: "Password is required" });
      if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

      // Hash password before storing (10 salt rounds)
      const hashed = await bcrypt.hash(String(password), 10);
      try {
        const user = await prisma.user.create({
          data: { name, email, phone, password: hashed },
          select: { id: true, name: true, email: true, phone: true, createdAt: true, updatedAt: true },
        });

        const token = signToken(user.id);
        return res.status(201).json({ token, user });
      } catch (err) {
        // Prisma unique constraint on email
        if ((err as any)?.code === "P2002" || (err as Prisma.PrismaClientKnownRequestError)?.code === "P2002") {
          return res.status(409).json({ error: "Email already in use" });
        }
        throw err;
      }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    const { handleServerError } = await import("../lib/errors.js");
    return handleServerError(res, error);
  }
}
