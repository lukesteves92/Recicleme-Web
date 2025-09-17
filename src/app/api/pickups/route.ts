import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export const dynamic = 'force-dynamic'

const schema = z.object({
  addressId: z.string().cuid(),
  notes: z.string().optional(),
  categories: z.array(z.string().cuid()).min(1),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await req.formData()
  const parsed = schema.parse({
    addressId: form.get('addressId'),
    notes: (form.get('notes') as string) || undefined,
    categories: JSON.parse(form.get('categories') as string),
  })

  const photo = form.get('photo') as File | null
  let photoUrl: string | null = null

  if (photo && photo.size > 0) {
    const bytes = Buffer.from(await photo.arrayBuffer())
    const dir = path.join(process.cwd(), "public", "uploads")
    await mkdir(dir, { recursive: true })
    const filename = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.]/g,'_')}`
    const filePath = path.join(dir, filename)
    await writeFile(filePath, bytes)
    photoUrl = `/uploads/${filename}`
  }

  const result = await prisma.$transaction(async (tx) => {
    const pickup = await tx.pickupRequest.create({
      data: {
        userId: session.user.id!,
        addressId: parsed.addressId,
        notes: parsed.notes,
      }
    })
    await tx.pickupCategory.createMany({
      data: parsed.categories.map((c) => ({ pickupId: pickup.id, categoryId: c })),
    })
    if (photoUrl) {
      await tx.pickupPhoto.create({ data: { pickupId: pickup.id, url: photoUrl } })
    }
    return pickup
  })

  return NextResponse.json({ id: result.id })
}
