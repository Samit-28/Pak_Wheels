// backend/api/wishlist.ts
import { prisma } from "../lib/prisma";
import { setCors } from "../lib/cors";
import { getUserIdFromAuthHeader } from "../lib/auth";

interface ReqLike { method?: string; body?: any; query?: any; headers?: any }
interface ResLike { status: (code: number) => ResLike; json: (body: any) => ResLike; setHeader: (name: string, value: any) => void; end: (body?: any) => void }

export default async function handler(req: ReqLike, res: ResLike) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const authHeader = req.headers?.authorization ?? req.headers?.Authorization;
    let userId: number;

    try {
      userId = getUserIdFromAuthHeader(authHeader);
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "GET") {
      const wishlist = await prisma.user.findUnique({
        where: { id: userId },
        include: { wishlist: true },
      });
      return res.status(200).json(wishlist?.wishlist || []);
    }

    if (req.method === "POST") {
      const { carId } = req.body || {};
      if (!carId) return res.status(400).json({ error: "carId is required" });

      const car = await prisma.car.findUnique({ where: { id: Number(carId) } });
      if (!car) return res.status(404).json({ error: "Car not found" });

      await prisma.user.update({
        where: { id: userId },
        data: { wishlist: { connect: { id: Number(carId) } } },
      });

      const refreshed = await prisma.user.findUnique({ where: { id: userId }, include: { wishlist: true } });
      return res.status(200).json(refreshed?.wishlist || []);
    }

    if (req.method === "DELETE") {
      const carId = req.body?.carId ?? req.query?.carId;
      if (!carId) return res.status(400).json({ error: "carId is required" });

      const car = await prisma.car.findUnique({ where: { id: Number(carId) } });
      if (!car) return res.status(404).json({ error: "Car not found" });

      await prisma.user.update({
        where: { id: userId },
        data: { wishlist: { disconnect: { id: Number(carId) } } },
      });

      const refreshed = await prisma.user.findUnique({ where: { id: userId }, include: { wishlist: true } });
      return res.status(200).json(refreshed?.wishlist || []);
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    const { handleServerError } = await import("../lib/errors.js");
    return handleServerError(res, error);
  }
}
