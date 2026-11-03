# Galvão Aerial

Site de divulgação da cobertura de eventos com drone no Distrito Federal e no entorno, com área administrativa para emitir ordem de serviço em PDF.

## Stack

- Next.js (App Router) e TypeScript
- Tailwind CSS
- Lucide para ícones
- Zod para validação
- SQLite local via libSQL, ou Turso na Vercel
- pdf-lib para o arquivo PDF
- FormSubmit para o formulário público, no plano gratuito

## Estrutura

```text
src/
  app/                landing, administração e PDF
  components/         seções do site e a ordem de serviço
  config/site.ts      nome, telefone, WhatsApp e e-mail
  data/content.ts     serviços, cidades e perguntas
  lib/                sessão, banco, validação e PDF
```

## Como rodar localmente

Requisitos: Node.js 22 ou superior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A área administrativa fica em [http://localhost:3000/admin](http://localhost:3000/admin).

Outros comandos:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local`. Nenhum segredo deve ir para o Git.

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública, sem barra no final |
| `ADMIN_EMAIL` | E-mail do administrador |
| `ADMIN_PASSWORD` | Senha do administrador |
| `AUTH_SECRET` | Segredo da sessão, com pelo menos 16 caracteres |
| `DATABASE_URL` | `file:data/galvao-aerial.db` no computador, ou `libsql://...` na Vercel |
| `DATABASE_AUTH_TOKEN` | Token do Turso. Vazio no banco local |

O banco local é criado em `data/` na primeira ordem salva. Essa pasta não entra no Git.

## Conteúdo do site

- Telefone, WhatsApp, e-mail e textos: `src/config/site.ts`
- Serviços, cidades e perguntas: `src/data/content.ts`
- Fotos: `public/images`

O formulário público envia pelo [FormSubmit](https://formsubmit.co/) para o e-mail definido em `site.email`. Na primeira vez, o Hotmail recebe um link **Activate Form**.

## Ordem de serviço

Depois do login, o administrador emite a ordem, salva no banco e pode:

- imprimir pelo navegador, escolhendo **Salvar como PDF** no diálogo
- baixar o PDF gerado pelo servidor

## Deploy

O projeto é publicado na Vercel. Push na branch `main` gera produção.

Na Vercel, em **Settings → Environment Variables**, repita as variáveis do `.env.local`, com `NEXT_PUBLIC_SITE_URL` apontando para o domínio publicado.

O arquivo SQLite não persiste na Vercel. Crie um banco gratuito no [Turso](https://turso.tech/) e use:

```text
DATABASE_URL=libsql://seu-banco.turso.io
DATABASE_AUTH_TOKEN=o-token
```

Sem essas duas variáveis, a landing continua no ar e a área administrativa avisa que o banco ainda não grava.
