import type { NextApiRequest, NextApiResponse } from "next";

type Announcement = { message: string; scheduledAt?: string };
const history: Announcement[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body: Announcement = req.body || { message: "" };
    history.push(body);
    return res.status(200).json({ ok: true, saved: body, total: history.length });
  }
  if (req.method === "GET") {
    return res.status(200).json({ items: history });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
