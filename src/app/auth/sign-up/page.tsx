'use client'
import { useState } from 'react'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    setLoading(false)
    if (res.ok) window.location.href = '/auth/sign-in?from=/dashboard'
    else alert('Erro ao criar conta')
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Criar conta</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="label">Nome</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        <label className="label">E-mail</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@exemplo.com" />
        <label className="label">Senha</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="mínimo 6 caracteres" />
        <button className="btn mt-2" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
      </form>
      <p className="text-sm mt-3">Já tem conta? <a className="link" href="/auth/sign-in">Entrar</a></p>
    </div>
  )
}
