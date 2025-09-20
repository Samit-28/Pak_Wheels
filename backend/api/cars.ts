// backend/api/cars.ts
import { prisma, Condition } from "../lib/prisma";
import { setCors } from "../lib/cors";
import { isValidYear, isPositivePrice, isNonEmptyString, isKnownMake, isKnownModel } from "../lib/validation";
import { getUserIdFromAuthHeader } from "../lib/auth";
import multer from "multer";
import cloudinary from "../lib/cloudinary";

interface ReqLike { method?: string; query?: any; body?: any; file?: any; files?: any }
interface ResLike { status: (code: number) => ResLike; json: (body: any) => ResLike; setHeader: (name: string, value: any) => void; end: (body?: any) => void }

export const config = {
  api: {
    bodyParser: false, // required for multer
  },
};

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { files: 10 } }); // max 10 files

// Helper to run multer as promise
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req: ReqLike, res: ResLike) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // =====================
    // GET: List/search cars
    // =====================
    if (req.method === "GET") {
      const {
        search, make, model, minPrice, maxPrice, minYear, maxYear,
        condition, location, page = "1", perPage = "20",
        sortBy = "createdAt", sortOrder = "desc",
      } = req.query || {};

      const take = Math.min(Number(perPage) || 20, 100);
      const skip = ((Number(page) || 1) - 1) * take;

      const where: any = { isActive: true };

      if (search) {
        const q = String(search);
        where.OR = [
          { make: { contains: q, mode: "insensitive" } },
          { model: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
        ];
      }
      if (make) where.make = { equals: String(make), mode: "insensitive" };
      if (model) where.model = { equals: String(model), mode: "insensitive" };
      if (location) where.location = { contains: String(location), mode: "insensitive" };

      if (minPrice || maxPrice) {
        where.price = {} as any;
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }
      if (minYear || maxYear) {
        where.year = {} as any;
        if (minYear) where.year.gte = Number(minYear);
        if (maxYear) where.year.lte = Number(maxYear);
      }

      const ALLOWED_CONDITIONS = ["New", "Used"];
      if (condition) {
        if (!ALLOWED_CONDITIONS.includes(String(condition))) {
          return res.status(400).json({ error: "Invalid condition" });
        }
        where.condition = String(condition);
      }

      const orderBy = { [String(sortBy)]: String(sortOrder).toLowerCase() === "asc" ? "asc" : "desc" } as any;

      const [cars, total] = await Promise.all([
        prisma.car.findMany({ where, orderBy, skip, take }),
        prisma.car.count({ where }),
      ]);

      return res.status(200).json({ data: cars, page: Number(page), perPage: take, total });
    }

    // =====================
    // POST: Create new car
    // =====================
    if (req.method === "POST") {
      // Run multer middleware to handle image uploads (max 10)
      await runMiddleware(req, res, upload.array("images", 10));

      // Authenticate user
      const authHeader = (req as any).headers?.authorization ?? (req as any).headers?.Authorization;
      let sellerIdNum: number;
      try {
        sellerIdNum = getUserIdFromAuthHeader(authHeader);
      } catch (e) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // When bodyParser is false (multipart), some frameworks put a stringified JSON body in req.body
      const parsedBody = req.body && typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { make, model, year, price, location, condition, description, mileage, color, engine, transmission, fuelType } = parsedBody;

      if (!isNonEmptyString(make) || !isNonEmptyString(model) || year === undefined || price === undefined || !isNonEmptyString(location) || !isNonEmptyString(String(condition))) {
        return res.status(400).json({ error: "Missing or invalid required fields" });
      }

      if (!isKnownMake(make)) return res.status(400).json({ error: 'Unknown make' });
      if (!isKnownModel(model)) return res.status(400).json({ error: 'Invalid model' });

      const yearNum = Number(year);
      const priceNum = Number(price);
      const mileageNum = mileage !== undefined ? Number(mileage) : undefined;

      if (!isValidYear(yearNum)) return res.status(400).json({ error: "Invalid year" });
      if (!isPositivePrice(priceNum)) return res.status(400).json({ error: "Invalid price" });

      const seller = await prisma.user.findUnique({ where: { id: sellerIdNum } });
      if (!seller) return res.status(404).json({ error: "Seller not found" });

      // Upload images to Cloudinary and collect URLs
      let imageUrls: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        const uploads = req.files.slice(0, 10).map(file => new Promise<string | null>(resolve => {
          const stream = cloudinary.uploader.upload_stream({ folder: "cars" }, (err, result) => {
            if (err) {
              // Log and resolve null to allow partial success
              console.error('Cloudinary upload error:', err);
              return resolve(null);
            }
            return resolve(result?.secure_url || null);
          });
          stream.end(file.buffer);
        }));
        const results = await Promise.all(uploads);
        // Filter out failed uploads
        imageUrls = results.filter((u): u is string => typeof u === 'string' && u.length > 0);
        if (results.length > 0 && imageUrls.length === 0) {
          // All uploads failed
          return res.status(502).json({ error: 'Failed to upload images to Cloudinary' });
        }
      }

      // Use first image as main imageUrl
      const mainImageUrl = imageUrls[0] || null;

      const car = await prisma.car.create({
        data: {
          make: String(make),
          model: String(model),
          year: yearNum,
          price: priceNum,
          location: String(location),
          condition: String(condition) as Condition,
          sellerId: sellerIdNum,
          description: description ?? null,
          imageUrl: mainImageUrl,
          imageUrls, // store all uploaded URLs
          mileage: mileageNum ?? null,
          color: color ?? null,
          engine: engine ?? null,
          transmission: transmission ?? null,
          fuelType: fuelType ?? null,
        },
      });

      return res.status(201).json(car);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    const { handleServerError } = await import("../lib/errors.js");
    return handleServerError(res, error);
  }
}
