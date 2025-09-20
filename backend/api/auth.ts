// backend/api/auth.ts
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../lib/auth";
import { setCors } from "../lib/cors";

interface ReqLike { method?: string; body?: any }
interface ResLike { status: (code: number) => ResLike; json: (body: any) => ResLike; setHeader: (name: string, value: any) => void; end: (body?: any) => void }

export default async function handler(req: ReqLike, res: ResLike) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "POST") {
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });

      const user = await prisma.user.findUnique({ where: { email: String(email) } });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const valid = await bcrypt.compare(String(password), user.password);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });

      const token = signToken(user.id);
      const { password: _pw, ...safe } = user as any;
      return res.status(200).json({ token, user: safe });
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    const { handleServerError } = await import("../lib/errors.js");
    return handleServerError(res, err);
  }
}