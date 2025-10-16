import type { NextApiRequest, NextApiResponse } from "next";

let state = {
  flags: {
    systemExchangeEnabled: true,
    notificationsEnabled: true,
    referralProgramEnabled: false,
  },
  params: {
    pickupLimitPerDay: 50,
    minAppVersion: "1.0.0",
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const body = req.body || {};
    if (body.flags) state.flags = body.flags;
    if (body.params) state.params = body.params;
    return res.status(200).json({ ok: true, state });
  }
  if (req.method === "GET") {
    return res.status(200).json(state);
  }
  return res.status(405).json({ error: "Method not allowed" });
}
