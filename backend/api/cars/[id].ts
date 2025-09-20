// backend/api/cars/[id].ts
import { prisma } from "../../lib/prisma";
import { setCors } from "../../lib/cors";
import { isValidYear, isPositivePrice } from "../../lib/validation";
import { isNonEmptyString, isKnownMake, isKnownModel } from "../../lib/validation";
import { getUserIdFromAuthHeader } from "../../lib/auth";
import multer from "multer";
import cloudinary from "../../lib/cloudinary";

interface ReqLike { method?: string; query?: any; body?: any; files?: any }
interface ResLike { status: (code: number) => ResLike; json: (body: any) => ResLike; setHeader: (name: string, value: any) => void; end: (body?: any) => void }

export default async function handler(req: ReqLike, res: ResLike) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const carId = Number(req.query?.id);
  if (!carId) return res.status(400).json({ error: "Invalid car id" });

  try {
    if (req.method === "GET") {
      const car = await prisma.car.findUnique({ where: { id: carId } });
      if (!car) return res.status(404).json({ error: "Car not found" });
      return res.status(200).json(car);
    }

    if (req.method === "DELETE") {
      // Only seller may delete
      const authHeader = (req as any).headers?.authorization ?? (req as any).headers?.Authorization;
      let tokenUserId: number;
      try {
        tokenUserId = getUserIdFromAuthHeader(authHeader);
      } catch (e) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const existing = await prisma.car.findUnique({ where: { id: carId } });
      if (!existing) return res.status(404).json({ error: "Car not found" });
      if (existing.sellerId !== tokenUserId) return res.status(403).json({ error: "Forbidden" });

      // --- NEW: delete images from Cloudinary ---
      if (existing.imageUrls && Array.isArray(existing.imageUrls)) {
        const deletions = existing.imageUrls.map(async (url) => {
          // Extract public_id from Cloudinary URL
          const parts = url.split("/");
          const filename = parts.pop() || "";
          const publicId = filename.split(".")[0];
          try {
            await cloudinary.uploader.destroy(`cars/${publicId}`);
          } catch (err) {
            console.error("Cloudinary delete failed for:", url, err);
          }
        });
        await Promise.all(deletions);
      }

      // Delete car from DB
      const deleted = await prisma.car.delete({ where: { id: carId } });
      return res.status(200).json(deleted);
    }

    if (req.method === "PUT") {
      // Use multer for file uploads (max 10)
      const storage = multer.memoryStorage();
      const upload = multer({ storage, limits: { files: 10 } });
      await new Promise<void>((resolve, reject) => {
        upload.array("images", 10)(req as any, res as any, (err: any) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Authenticate user
      const authHeader = (req as any).headers?.authorization ?? (req as any).headers?.Authorization;
      let tokenUserId: number;
      try {
        tokenUserId = getUserIdFromAuthHeader(authHeader);
      } catch (e) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Parse body if it's a string (multipart forms may send JSON as a string)
      const body = req.body && typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const updatable = [
        "make",
        "model",
        "year",
        "price",
        "location",
        "condition",
        "description",
        "imageUrl",
        "imageUrls",
        "mileage",
        "color",
        "engine",
        "transmission",
        "fuelType",
        "isActive",
      ];

      const data: Record<string, any> = {};
      for (const key of updatable) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          data[key] = body[key];
        }
      }

      if (Object.keys(data).length === 0 && (!req.files || req.files.length === 0)) {
        return res.status(400).json({ error: "No updatable fields or images provided" });
      }

      // Check existence first
      const existing = await prisma.car.findUnique({ where: { id: carId } });
      if (!existing) return res.status(404).json({ error: "Car not found" });

      // Authorization
      if (existing.sellerId !== tokenUserId) return res.status(403).json({ error: "Forbidden" });

      // Validate fields if provided
      if (Object.prototype.hasOwnProperty.call(data, 'year') && !isValidYear(data.year)) {
        return res.status(400).json({ error: 'Invalid year' });
      }
      if (Object.prototype.hasOwnProperty.call(data, 'price') && !isPositivePrice(data.price)) {
        return res.status(400).json({ error: 'Invalid price' });
      }
      if (Object.prototype.hasOwnProperty.call(data, 'make') && !isNonEmptyString(data.make)) {
        return res.status(400).json({ error: 'Invalid make' });
      }
      if (Object.prototype.hasOwnProperty.call(data, 'model') && !isNonEmptyString(data.model)) {
        return res.status(400).json({ error: 'Invalid model' });
      }
      if (Object.prototype.hasOwnProperty.call(data, 'make') && !isKnownMake(data.make)) {
        return res.status(400).json({ error: 'Unknown make' });
      }
      if (Object.prototype.hasOwnProperty.call(data, 'model') && !isKnownModel(data.model)) {
        return res.status(400).json({ error: 'Invalid model' });
      }

      // Validate condition enum
      const ALLOWED_CONDITIONS = ['New', 'Used'];
      if (Object.prototype.hasOwnProperty.call(data, 'condition')) {
        const cond = String(data.condition);
        if (!ALLOWED_CONDITIONS.includes(cond)) {
          return res.status(400).json({ error: 'Invalid condition' });
        }
        data.condition = cond;
      }

      // Coerce numeric fields
      if (Object.prototype.hasOwnProperty.call(data, 'year')) data.year = Number(data.year);
      if (Object.prototype.hasOwnProperty.call(data, 'price')) data.price = Number(data.price);
      if (Object.prototype.hasOwnProperty.call(data, 'mileage')) data.mileage = data.mileage === null ? null : Number(data.mileage);

      // Handle uploaded images
      let newImageUrls: string[] = [];
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const uploads = req.files.map(file =>
          new Promise<string | null>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "cars" },
              (err, result) => {
                if (err) return resolve(null);
                resolve(result?.secure_url || null);
              }
            );
            stream.end(file.buffer);
          })
        );
        const results = await Promise.all(uploads);
        newImageUrls = results.filter(
          (u): u is string => typeof u === "string" && u.length > 0
        );
      }

      // Handle deletion of a single image
      const imageToDelete: string | undefined = body.imageToDelete;
      let remainingOldImages = Array.isArray(existing.imageUrls)
        ? existing.imageUrls
        : [];

      if (imageToDelete) {
        // Remove the deleted one from DB array
        remainingOldImages = remainingOldImages.filter(url => url !== imageToDelete);

        // OPTIONAL: delete from Cloudinary too
        const publicId = imageToDelete.split('/').pop()?.split('.')[0];
        if (publicId) await cloudinary.uploader.destroy(`cars/${publicId}`);
      }

      // Merge old + new images (max 10)
      const mergedImageUrls = [...remainingOldImages, ...newImageUrls].slice(0, 10);

      // Always update DB consistently
      data.imageUrls = mergedImageUrls;
      data.imageUrl = mergedImageUrls[0] || null;


      const updatedCar = await prisma.car.update({
        where: { id: carId },
        data,
      });

      return res.status(200).json(updatedCar);
    }

    res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    const { handleServerError } = await import("../../lib/errors.js");
    return handleServerError(res, error);
  }
}
