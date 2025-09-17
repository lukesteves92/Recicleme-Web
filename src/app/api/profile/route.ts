import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1) })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const data = schema.parse(body)
  await prisma.user.update({ where: { id: session.user.id }, data: { name: data.name } })
  return NextResponse.json({ ok: true })
}
