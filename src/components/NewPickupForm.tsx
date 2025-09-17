'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Category = { id: string; name: string }
type Address = { id: string; street: string; number: string | null; city: string; state: string }

export default function NewPickupForm({ categories, addresses }:{categories: Category[]; addresses: Address[]}) {
  const [addressId, setAddressId] = useState(addresses[0]?.id || '')
  const [notes, setNotes] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  function toggle(cat: string) {
    setSelected(prev => prev.includes(cat) ? prev.filter(i => i !== cat) : [...prev, cat])
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('addressId', addressId)
    fd.append('notes', notes)
    fd.append('categories', JSON.stringify(selected))
    if (file) fd.append('photo', file)

    const res = await fetch('/api/pickups', { method: 'POST', body: fd })
    if (res.ok) {
      const { id } = await res.json()
      router.push(`/pickups/${id}`)
    } else {
      alert('Erro ao criar coleta')
    }
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Nova coleta</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="label">Endereço</label>
        <select className="input" value={addressId} onChange={e=>setAddressId(e.target.value)}>
          {addresses.map(a => (
            <option key={a.id} value={a.id}>
              {a.street} {a.number || ""} - {a.city}/{a.state}
            </option>
          ))}
        </select>

        <label className="label">Materiais</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button type="button" key={c.id}
              className={`px-3 py-1 rounded-xl border ${selected.includes(c.id) ? 'bg-emerald-500 border-emerald-400' : 'bg-white/5 border-white/20'}`}
              onClick={()=>toggle(c.id)}>
              {c.name}
            </button>
          ))}
        </div>

        <label className="label">Foto (opcional)</label>
        <input className="input" type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} />

        <label className="label">Observações</label>
        <textarea className="input" value={notes} onChange={e=>setNotes(e.target.value)} rows={4} />

        <button className="btn mt-2">Solicitar coleta</button>
      </form>
    </div>
  )
}
