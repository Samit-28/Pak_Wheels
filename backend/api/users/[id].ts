// backend/api/users/[id].ts
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { setCors } from "../../lib/cors";
import bcrypt from "bcryptjs";
import { isValidEmail } from "../../lib/validation";
import { isValidPhone } from "../../lib/validation";
import { getUserIdFromAuthHeader } from "../../lib/auth";

interface ReqLike { method?: string; query?: any; body?: any }
interface ResLike { status: (code: number) => ResLike; json: (body: any) => ResLike; setHeader: (name: string, value: any) => void; end: (body?: any) => void }

export default async function handler(req: ReqLike, res: ResLike) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const userId = Number(req.query?.id);
  if (!userId) return res.status(400).json({ error: "Invalid user id" });

  try {
    if (req.method === "GET") {
      const user = await prisma.user.findUnique({ where: { id: userId }, include: { cars: true, wishlist: true } });
      if (!user) return res.status(404).json({ error: "User not found" });
      // strip password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safe } = user as any;
      return res.status(200).json(safe);
    }

    if (req.method === "PUT") {
      // Only the user themself may update their profile
      const authHeader = (req as any).headers?.authorization ?? (req as any).headers?.Authorization;
      let tokenUserId: number;
      try {
        tokenUserId = getUserIdFromAuthHeader(authHeader);
      } catch (e) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (tokenUserId !== userId) return res.status(403).json({ error: "Forbidden" });

      const body = req.body || {};
      const updatable = ["name", "email", "phone", "password"];
      const data: Record<string, any> = {};
      for (const k of updatable) {
        if (Object.prototype.hasOwnProperty.call(body, k)) {
          data[k] = body[k];
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, "password")) {
        const raw = data.password;
        if (!raw || typeof raw !== "string" || raw.length < 8) {
          return res.status(400).json({ error: "Password must be a string with at least 8 characters" });
        }
        const hashed = await bcrypt.hash(raw, 10);
        data.password = hashed;
      }

      if (Object.prototype.hasOwnProperty.call(data, 'email') && !isValidEmail(data.email)) {
        return res.status(400).json({ error: 'Invalid email' });
      }
      if (Object.prototype.hasOwnProperty.call(data, 'phone') && !isValidPhone(data.phone)) {
        return res.status(400).json({ error: 'Invalid phone' });
      }

      if (Object.keys(data).length === 0) return res.status(400).json({ error: "No updatable fields provided" });

      // ensure user exists
      const existing = await prisma.user.findUnique({ where: { id: userId } });
      if (!existing) return res.status(404).json({ error: "User not found" });

      try {
        const updated = await prisma.user.update({ where: { id: userId }, data });
        const { password: _pw, ...safe } = updated as any;
        return res.status(200).json(safe);
      } catch (err) {
        // Handle unique constraint (email) violation
        if ((err as any)?.code === "P2002" || (err as Prisma.PrismaClientKnownRequestError)?.code === "P2002") {
          return res.status(409).json({ error: "Email already in use" });
        }
        throw err; // let outer catch handle other errors
      }
    }

    if (req.method === "DELETE") {
      // Only the user themself may delete their account
      const authHeader = (req as any).headers?.authorization ?? (req as any).headers?.Authorization;
      let tokenUserId: number;
      try {
        tokenUserId = getUserIdFromAuthHeader(authHeader);
      } catch (e) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (tokenUserId !== userId) return res.status(403).json({ error: "Forbidden" });

      // ensure user exists first
      const existing = await prisma.user.findUnique({ where: { id: userId } });
      if (!existing) return res.status(404).json({ error: "User not found" });
      const deleted = await prisma.user.delete({ where: { id: userId } });
      const { password: _pw, ...safe } = deleted as any;
      return res.status(200).json(safe);
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    const { handleServerError } = await import("../../lib/errors.js");
    return handleServerError(res, error);
  }
}