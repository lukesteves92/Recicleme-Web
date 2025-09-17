'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const params = useSearchParams()
  const router = useRouter()
  const from = params.get('from') || '/dashboard'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res && !res.error) router.push(from)
    else alert('Credenciais inválidas')
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="label">E-mail</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@exemplo.com" />
        <label className="label">Senha</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        <button className="btn mt-2" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
      <p className="text-sm mt-3">Não tem conta? <a className="link" href="/auth/sign-up">Criar conta</a></p>
    </div>
  )
}
