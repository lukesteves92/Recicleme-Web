import { prisma } from "@/lib/prisma"
import NewPickupForm from "@/components/NewPickupForm"

export default async function NewPickupPage() {
  const categories = await prisma.materialCategory.findMany({ orderBy: { name: "asc" } })
  const addresses = await prisma.address.findMany()
  return <NewPickupForm categories={categories} addresses={addresses} />
}
