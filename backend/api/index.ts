import { setCors } from "../lib/cors";

interface ReqLike { method?: string }
interface ResLike { status: (code: number) => ResLike; setHeader: (name: string, value: any) => void; end: (body?: any) => void }

export default function handler(req: ReqLike, res: ResLike) {
	setCors(res);
	if (req.method === "OPTIONS") return res.status(200).end();
	res.setHeader("Content-Type", "application/json");
	return res.status(200).end(JSON.stringify({ message: "Backend is healthy!" }));
}
