import type { NextApiRequest, NextApiResponse } from "next";

type Point = {
  id: string;
  name: string;
  address?: string | null;
  latitude: number;
  longitude: number;
  website?: string | null;
};

const pointsData: Point[] = [
  {
    id: "p1",
    name: "Eco Ponto Centro",
    address: "Rua das Flores, 123 - Centro, SP",
    latitude: -23.55052,
    longitude: -46.63331,
    website: "https://exemplo.com/ecoponto-centro",
  },
  {
    id: "p2",
    name: "Coleta Verde",
    address: "Av. Paulista, 1000 - Bela Vista, SP",
    latitude: -23.5614,
    longitude: -46.6559,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, points: pointsData });
  }

  if (req.method === "POST") {
    const { name, address, latitude, longitude, website } = req.body || {};
    if (!name || typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ ok: false, error: "name, latitude e longitude são obrigatórios" });
    }
    const p: Point = {
      id: `p${Date.now()}`,
      name,
      address: address || null,
      latitude,
      longitude,
      website: website || null,
    };
    pointsData.push(p);
    return res.status(201).json({ ok: true, point: p });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
