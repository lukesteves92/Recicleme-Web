import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ProfileForm from "@/components/ProfileForm"

export default async function ProfilePage() {
  const session = await auth()
  const user = await prisma.user.findUnique({ where: { id: session?.user?.id as string } })
  return <ProfileForm user={user!} />
}
