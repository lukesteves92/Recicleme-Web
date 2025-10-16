
# ReUse — Painel Administrativo (Node-RED)

Este repositório contém um *flow* do Node-RED que implementa um painel administrativo **low-code** para o projeto ReUse/Recicle.me.  
O painel permite **gerenciar Feature Flags e Parâmetros** (e.g., ativar/desativar Trocas, Notificações, Limite de Coletas/dia, Min App Version) e **publicar anúncios** (com mensagem e agendamento).

---

## 🚀 Funcionalidades

- **Feature Flags** (ui_switch):  
  - `systemExchangeEnabled`  
  - `notificationsEnabled`  
  - `referralProgramEnabled`  

- **Parâmetros**:  
  - `pickupLimitPerDay` (numérico)  
  - `minAppVersion` (texto)

- **Anúncios**:  
  - `message`  
  - `scheduledAt` (string ISO, ex: `2025-10-16T18:00:00-03:00`)  
  - Envio via `POST /api/admin/announcements` da sua aplicação web.

- **APIs expostas pelo Node-RED** (útil para integração e testes):  
  - `GET /admin/flags` — retorna flags/params atuais do painel  
  - `PUT /admin/flags` — atualiza flags/params do painel  
  - `POST /admin/announce` — *proxy* para `POST /api/admin/announcements` (sua Web/API)

---

## 🧩 Integração com sua Web/API

O flow assume uma variável `BASE_URL` no *state* do Node-RED apontando para sua base web (por padrão: **https://YOUR_WEB_BASE_URL**).  
Atualize-a no **nó "Bootstrap defaults"** ou altere via **nó Function** para ler de variável de ambiente.

### Exemplo de rotas **Next.js** (API Routes)

Crie em `src/pages/api/admin/feature-flags.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";

let state = {
  flags: {
    systemExchangeEnabled: true,
    notificationsEnabled: true,
    referralProgramEnabled: false,
  },
  params: {
    pickupLimitPerDay: 50,
    minAppVersion: "1.0.0",
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const body = req.body || {};
    if (body.flags)  state.flags  = body.flags;
    if (body.params) state.params = body.params;
    return res.status(200).json({ ok: true, state });
  }
  if (req.method === "GET") {
    return res.status(200).json(state);
  }
  return res.status(405).json({ error: "Method not allowed" });
}
```

E em `src/pages/api/admin/announcements.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";

type Announcement = { message: string; scheduledAt?: string };
const history: Announcement[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body: Announcement = req.body || { message: "" };
    history.push(body);
    // TODO: integrar FCM/Email/Push/DB de produção aqui
    return res.status(200).json({ ok: true, saved: body, total: history.length });
  }
  if (req.method === "GET") {
    return res.status(200).json({ items: history });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
```

> **Dica:** Para produção, persista `state` e `history` em um banco (Postgres/Prisma, Firestore, etc.) e aplique autenticação no painel (e.g., por *reverse proxy* com Basic Auth).

---

## 🛠️ Como rodar o Node-RED

1. **Instale** Node-RED (local ou Docker).
   - Local: `npm i -g --unsafe-perm node-red` e depois `node-red`
   - Docker:
     ```bash
     docker run -it -p 1880:1880 --name nodered nodered/node-red
     ```

2. Acesse `http://localhost:1880` e **importe** o arquivo `reuse_admin_flow.json`.

3. No nó **"Bootstrap defaults"**, ajuste `BASE_URL` para a URL da sua Web/API (ex.: `https://recicleme-web.vercel.app`).

4. Clique **Deploy**. Abra o Dashboard (`/ui`) para usar o painel.

---

## 🔌 Endpoints para correção/demonstração

- Dashboard: `http://localhost:1880/ui`  
- GET Flags/Params: `http://localhost:1880/admin/flags`  
- PUT Flags/Params: `http://localhost:1880/admin/flags` (JSON body)  
- POST Anúncio (proxy): `http://localhost:1880/admin/announce`

Exemplo de **PUT**:
```bash
curl -X PUT http://localhost:1880/admin/flags   -H "Content-Type: application/json"   -d '{"flags": {"systemExchangeEnabled": false}, "params": {"pickupLimitPerDay": 30}}'
```

---

## 🔐 Autenticação (opcional para entrega)

- Proteja o acesso ao `/ui` e endpoints via **reverse proxy** (Nginx com Basic Auth) ou configure *middlewares* na própria instância.
- Alternativamente, crie um *subflow* de verificação de token no início dos fluxos HTTP IN.

---

## 📂 Repositório

Crie um repositório, por exemplo: **`reuse-node-red-admin`** e inclua:
- `reuse_admin_flow.json`
- `README.md` (este arquivo)
- (opcional) `screenshots/` do dashboard
- (opcional) Export do `flows_cred.json` sem segredos

Sugerido: https://github.com/lukesteves92/reuse-node-red-admin

---

## ✅ Escopo que atende a avaliação

- **65% Node-RED**: tela útil (flags/params/announces), persistência de estado via context, dashboard funcional e claro.
- **35% APIs**: integração pronta com rotas Next.js (`/api/admin/feature-flags` e `/api/admin/announcements`), além de endpoints HTTP expostos pelo próprio Node-RED para consumo bidirecional.

---

## 🧪 Testes rápidos

1. Mude um *switch* no painel → verifique seu backend recebendo `PUT /api/admin/feature-flags`.
2. Publique um anúncio → verifique `POST /api/admin/announcements` recebendo os dados.
3. Faça `GET /admin/flags` no Node-RED → confira os valores refletidos.

---

## 📞 Suporte

Qualquer ajuste para integrar com o **Recicleme-Web**: configurar `BASE_URL`, autenticação e persistência conforme o ambiente de vocês.
