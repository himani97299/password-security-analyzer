# Fortify — Password Strength Checker

A professional, portfolio-worthy cybersecurity tool that analyzes passwords, teaches security concepts, and helps users create stronger credentials.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/password-checker run dev` — run the frontend (port 19334)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter, Tailwind CSS, shadcn/ui, framer-motion, next-themes
- API: Express 5
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod validation schemas
- `artifacts/api-server/src/lib/passwordAnalyzer.ts` — core password analysis engine
- `artifacts/api-server/src/lib/passwordGenerator.ts` — secure password generator
- `artifacts/api-server/src/routes/passwords.ts` — password API routes
- `artifacts/password-checker/src/` — React frontend

## Architecture decisions

- Password analysis is entirely server-side; passwords are never stored or logged.
- Entropy estimation uses charset-size × log₂ formula; crack time assumes 10B guesses/sec (GPU estimate).
- API uses mutation hooks (POST) for both analyze and generate — stateless, no DB needed.
- Dark-first theme using next-themes; light mode fully supported.
- No database provisioned — this app is stateless by design (passwords must not be persisted).

## Product

- `/` — Landing page with live inline password tester
- `/checker` — Full analyzer: score 0-100, entropy, crack time, breakdown, suggestions
- `/generator` — Configurable secure password generator with inline analysis
- `/learn` — Educational hub: entropy, MFA, passphrases, social engineering, phishing, etc.
- `/quiz` — Interactive multiple-choice password security quiz
- `/about` — How it works + privacy policy

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- No DATABASE_URL needed — this app is intentionally stateless.
- After any OpenAPI spec change, always re-run codegen before touching routes or frontend.
- The password analysis route uses POST (not GET) so passwords never appear in server access logs.
