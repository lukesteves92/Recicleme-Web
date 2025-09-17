import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id as string
  const pickups = await prisma.pickupRequest.findMany({
    where: { userId },
    orderBy: { requestedAt: "desc" },
    include: { address: true, categories: { include: { category: true } } }
  })

  return (
    <div className="grid gap-4">
      <div className="card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Olá, {session?.user?.name || session?.user?.email}</h1>
          <p className="text-white/70">Acompanhe suas coletas ou solicite uma nova.</p>
        </div>
        <Link href="/pickups/new" className="btn">Nova coleta</Link>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Minhas coletas</h2>
        <div className="grid gap-3">
          {pickups.length === 0 && <p className="text-white/70">Nenhuma coleta ainda.</p>}
          {pickups.map(p => (
            <Link key={p.id} href={`/pickups/${p.id}`} className="block border border-white/10 rounded-xl p-3 hover:bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Status: {p.status}</div>
                  <div className="text-sm text-white/70">{new Date(p.requestedAt).toLocaleString()}</div>
                </div>
                <div className="text-sm text-white/80">
                  {p.address.street}, {p.address.number || ""} - {p.address.city}/{p.address.state}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
