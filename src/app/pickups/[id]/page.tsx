import { prisma } from "@/lib/prisma"

export default async function PickupDetail({ params }: { params: { id: string } }) {
  const pickup = await prisma.pickupRequest.findUnique({
    where: { id: params.id },
    include: { address: true, photos: true, categories: { include: { category: true } } }
  })
  if (!pickup) return <div className="card">Coleta não encontrada.</div>

  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-2">Coleta #{pickup.id.slice(0,6)}</h1>
        <p className="text-white/80">Status: {pickup.status}</p>
        <p className="text-white/70 text-sm">Solicitada em: {new Date(pickup.requestedAt).toLocaleString()}</p>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Endereço</h2>
        <p>{pickup.address.street} {pickup.address.number || ""} - {pickup.address.city}/{pickup.address.state}</p>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Materiais</h2>
        <div className="flex flex-wrap gap-2">
          {pickup.categories.map(pc => (
            <span key={pc.categoryId} className="px-3 py-1 rounded-xl bg-white/5 border border-white/20">{pc.category.name}</span>
          ))}
        </div>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Fotos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pickup.photos.length === 0 && <p className="text-white/70">Sem fotos.</p>}
          {pickup.photos.map(ph => (
            <img key={ph.id} src={ph.url} alt="foto" className="rounded-xl border border-white/10" />
          ))}
        </div>
      </div>
    </div>
  )
}
