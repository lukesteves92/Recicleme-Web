import type { NextApiRequest, NextApiResponse } from "next";
import AssistantV2 from "ibm-watson/assistant/v2";
import { IamAuthenticator } from "ibm-cloud-sdk-core";

const assistant = new AssistantV2({
  version: "2021-11-27",
  authenticator: new IamAuthenticator({ apikey: process.env.WATSON_API_KEY! }),
  serviceUrl: process.env.WATSON_ASSISTANT_URL,
});

const ASSISTANT_ID = process.env.WATSON_ASSISTANT_ID!;
const ENV_ID = process.env.WATSON_ENVIRONMENT_ID || "production";
const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

let sessionId: string | null = null;
async function ensureSession() {
  if (sessionId) return sessionId;
  const res = await assistant.createSession({ assistantId: ASSISTANT_ID, environmentId: ENV_ID });
  sessionId = (res.result as any).session_id;
  return sessionId!;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const sid = await ensureSession();
    const userInput = req.body?.message ?? "";

    const watsonRes = await assistant.message({
      assistantId: ASSISTANT_ID,
      environmentId: ENV_ID,
      sessionId: sid,
      input: { message_type: "text", text: userInput, options: { return_context: true } },
    });

    const ctx: any = (watsonRes.result as any).context || {};
    const userDef = ctx?.skills?.["main skill"]?.user_defined || {};
    const action = userDef?.action as string | undefined;

    let actionResult: any = null;

    if (action === "list_points") {
      const r = await fetch(`${BASE}/api/platform/points`, { method: "GET" });
      actionResult = await r.json();
    }

    if (action === "create_point") {
      const payload = userDef?.point || {};
      const r = await fetch(`${BASE}/api/platform/points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      actionResult = await r.json();
    }

    res.status(200).json({ watson: watsonRes.result, actionResult });
  } catch (e: any) {
    sessionId = null;
    res.status(500).json({ error: e?.message || "unknown error" });
  }
}
