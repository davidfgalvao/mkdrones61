# MKDrones61

Site de divulgação da cobertura de eventos com drone no Distrito Federal e no entorno, com área administrativa para emitir ordem de serviço em PDF.

## Stack

- Next.js (App Router) e TypeScript
- Tailwind CSS
- Lucide para ícones
- Zod para validação
- SQLite local via libSQL, ou Turso na Vercel
- pdf-lib para o arquivo PDF

## Estrutura

```text
src/
  app/                landing, administração e PDF
  components/         seções do site e a ordem de serviço
  config/site.ts      nome, telefone e WhatsApp
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
| `NEXT_PUBLIC_SITE_URL` | URL pública, sem barra no final. Se ficar vazia na Vercel, o site usa o domínio de produção do projeto |
| `ADMIN_EMAIL` | Usuário do administrador |
| `ADMIN_PASSWORD` | Senha do administrador |
| `AUTH_SECRET` | Segredo da sessão, com pelo menos 16 caracteres |
| `DATABASE_URL` | `file:data/mkdrones61.db` no computador. Na Vercel, o Turso entra por `TURSO_DATABASE_URL` |
| `DATABASE_AUTH_TOKEN` | Token do banco remoto, se `DATABASE_URL` não for arquivo. No Turso da Vercel o nome é `TURSO_AUTH_TOKEN` |

O banco local é criado em `data/` na primeira ordem salva. Essa pasta não entra no Git.

## Conteúdo do site

- Telefone, WhatsApp e textos: `src/config/site.ts`
- Serviços, cidades e perguntas: `src/data/content.ts`
- Fotos ilustrativas: `public/images`
- Trabalhos realizados e marca: `public/trabalhos` e `public/marca`

O contato público é só pelo WhatsApp.

## Ordem de serviço

Depois do login, o administrador emite a ordem, salva no banco e pode:

- imprimir pelo navegador, escolhendo **Salvar como PDF** no diálogo
- baixar o PDF gerado pelo servidor

## Deploy

O projeto é publicado na Vercel. Push na branch `main` gera produção.

Na Vercel, em **Settings → Environment Variables**, repita as variáveis do `.env.local`, com `NEXT_PUBLIC_SITE_URL` apontando para o domínio publicado.

A Vercel não guarda arquivo SQLite entre as execuções. Em produção as ordens ficam no Turso, plano Starter gratuito, no banco `mkdrones61`. As variáveis `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` já estão no projeto. No computador, `DATABASE_URL=file:data/mkdrones61.db` continua valendo.

Sem o banco remoto, a landing continua no ar e a área administrativa avisa que as ordens não gravam.
