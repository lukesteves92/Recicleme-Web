'use client'
import { useState } from 'react'

export default function ProfileForm({ user }: { user: { id: string, name: string | null, email: string } }) {
  const [name, setName] = useState(user.name || '')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    setLoading(false)
    if (!res.ok) alert('Erro ao atualizar')
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Perfil</h1>
      <div className="text-sm text-white/70 mb-3">{user.email}</div>
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="label">Nome</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        <button className="btn" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
      </form>
    </div>
  )
}
