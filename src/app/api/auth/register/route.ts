import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import argon2 from "argon2"

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  const body = await req.json()
  const data = schema.parse(body)
  const exists = await prisma.user.findUnique({ where: { email: data.email } })
  if (exists) return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
  const passwordHash = await argon2.hash(data.password)
  await prisma.user.create({ data: { email: data.email, name: data.name, passwordHash } })
  return NextResponse.json({ ok: true })
}
