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

## 🧩 Painel Administrativo – Node-RED (Fase 6)

Nesta fase, desenvolvemos um painel administrativo **low-code** utilizando **Node-RED**, integrado à plataforma ReUse (Recicle-Me).

### 🚀 Objetivo
Permitir o controle interno da plataforma, com:
- Ativação/desativação de funcionalidades (Trocas, Notificações, Programa de Indicação)
- Configuração de parâmetros operacionais
- Publicação de anúncios para usuários

### ⚙️ Estrutura
Os arquivos do painel estão em [`/node-red`](./node-red):

- `reuse_admin_flow.json` → fluxo importável no Node-RED  
- `README_NodeRED_Admin.md` → documentação técnica

### 🔗 Integração com APIs
O painel comunica-se diretamente com rotas internas do projeto:
- `PUT /api/admin/feature-flags`  
- `POST /api/admin/announcements`  

Essas rotas estão em:  
`src/pages/api/admin/feature-flags.ts`  
`src/pages/api/admin/announcements.ts`

### 🖥️ Como executar o painel
1. Execute o Node-RED localmente ou via Docker:
   ```bash
   docker run -it -p 1880:1880 --name nodered nodered/node-red
2. Acesse http://localhost:1880

3. Importe o arquivo reuse_admin_flow.json

4. Ajuste o campo BASE_URL no nó Bootstrap defaults para:

```bash
https://recicleme-web.vercel.app
```


5. Clique em Deploy e acesse o painel em http://localhost:1880/ui

## Licença
MIT
