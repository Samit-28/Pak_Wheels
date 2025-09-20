import multer from "multer";
import cloudinary from "../../lib/cloudinary";
import { setCors } from "../../lib/cors";

interface ReqLike { method?: string; query?: any; body?: any; files?: any }
interface ResLike { status: (code: number) => ResLike; json: (body: any) => ResLike; setHeader: (name: string, value: any) => void; end: (body?: any) => void }

// Multer config (store file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

// Convert multer to promise-based handler
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
    // Accept up to 10 files
    await runMiddleware(req, res, upload.array("images", 10));

    if (!req.files || req.files.length === 0) 
      return res.status(400).json({ error: "At least one image file required" });

    // Upload all images to Cloudinary
    const uploadResults = await Promise.all(
      req.files.map(
        (file: any) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "cars" }, (err, result) => {
              if (err) return reject(err);
              resolve(result);
            });
            stream.end(file.buffer);
          })
      )
    );

    // Extract URLs
    const urls = uploadResults.map((r: any) => r.secure_url);

    return res.status(200).json({ urls });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
