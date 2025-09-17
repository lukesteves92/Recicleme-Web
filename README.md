# ReUse! Web (Next.js 14 + Prisma + Postgres)

Web da plataforma ReUse!, espelhando funcionalidades do app mobile (login/cadastro, dashboard, agendamento de coleta com foto, pontos de coleta e perfil).

## Stack
- Next.js 14 (App Router) + TypeScript
- Prisma ORM
- Postgres
- NextAuth (Credentials) + argon2
- Tailwind CSS

## Funcionalidades
- **Autenticação** (e-mail/senha) e cadastro.
- **Dashboard** com listagem de coletas.
- **Nova coleta** com seleção de endereço, categorias e upload de foto.
- **Detalhe da coleta** com status, materiais e fotos.
- **Pontos de coleta** (lista a partir do DB).
- **Perfil** (edição de nome).

## Setup

1. Clone e instale:
```bash
pnpm i # ou npm i / yarn
```
2. Configure `.env` a partir de `.env.example`:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/reuse?schema=public"
AUTH_SECRET="uma_chave_forte"
NEXTAUTH_SECRET="uma_chave_forte"
NEXTAUTH_URL="http://localhost:3000"
```
3. Migrações e seed:
```bash
pnpm prisma:dev
pnpm seed
```
4. Rodar:
```bash
pnpm dev
# http://localhost:3000
```

## Rotas
- `/` Landing pública
- `/auth/sign-in` e `/auth/sign-up`
- `/dashboard` (protegida)
- `/pickups/new`, `/pickups/[id]`
- `/points`
- `/profile`

## Observações
- Upload salva arquivos localmente em `public/uploads` (adequar para S3/Cloudinary em produção).
- Middleware protege rotas autenticadas.
- Schema Prisma contempla usuários, endereços, coletas, fotos, categorias e pontos de coleta.

## Scripts
- `pnpm prisma:dev` – `prisma migrate dev`
- `pnpm prisma:deploy` – `prisma migrate deploy`
- `pnpm seed` – popula categorias e um usuário admin (`admin@reuse.local` / `admin123`)

## Licença
MIT
