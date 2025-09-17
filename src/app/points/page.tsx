import { prisma } from "@/lib/prisma"

export default async function PointsPage() {
  const points = await prisma.collectionPoint.findMany({ orderBy: { name: "asc" } })
  return (
    <div className="card">
      <h1 className="text-2xl font-semibold mb-3">Pontos de coleta</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {points.length === 0 && <p className="text-white/70">Nenhum ponto cadastrado ainda.</p>}
        {points.map(p => (
          <div key={p.id} className="border border-white/10 rounded-xl p-3">
            <div className="font-medium">{p.name}</div>
            <div className="text-white/80">{p.address}</div>
            <div className="text-sm text-white/60">Lat {p.latitude.toFixed(4)} | Lng {p.longitude.toFixed(4)}</div>
            {p.website && <a className="link" href={p.website} target="_blank">Website</a>}
          </div>
        ))}
      </div>
    </div>
  )
}
