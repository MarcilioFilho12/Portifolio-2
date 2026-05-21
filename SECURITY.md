# Modo segurança — portfólio estático

## Headers HTTP (produção)

| Host | Arquivo |
|------|---------|
| Vercel | `vercel.json` |
| Netlify / Cloudflare Pages | `public/_headers` |
| Apache | `public/.htaccess` |
| Dev / preview Vite | `vite.config.ts` → `server.headers` / `preview.headers` |

Inclui: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` (Vercel).

## Arquivos públicos

- Não colocar CVs de rascunho em `public/media/cv/`.
- Padrões ignorados no Git: `*-backup*`, `*-backup.pdf`, `.env*`.

## Build

- `build.sourcemap: false` — não expõe código-fonte no deploy.

## Manutenção

```bash
npm audit
npm run build
```

Revisar dependências a cada release e antes do deploy.
