<div align="right">
<strong>Jazyk:</strong> <a href="./README.md">English</a> | Čeština
</div>

<div align="center">

# AI Web App Builder

Stavějte moderní webové aplikace z přirozených textových požadavků. Postaveno na Next.js 15, React 19, Tailwind CSS 4, Prisma a AI (Gemini).

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=061d2a)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38b2ac?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)](https://www.prisma.io/)
[![NextAuth.js](https://img.shields.io/badge/Auth-NextAuth.js-000?logo=auth0&logoColor=white)](https://next-auth.js.org/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-45ba4b?logo=playwright)](https://playwright.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-%F0%9F%90%B1-ffa500?logo=pnpm)](https://pnpm.io/)

</div>

## Přehled

AI Web App Builder je platforma pro vývojáře, která pomáhá vytvářet a rozvíjet webové aplikace popisem toho, co chcete postavit. Integruje AI generování kódu (Gemini) s čistým, modulárním Next.js kódem a sadu stavebních bloků (komponenty, API routy, datové modely).

Design je inspirovaný Aceternity UI s decentními přechody, plynulými animacemi a dark-first tématem.

## Funkce

- AI builder UI (Gemini) s režimy chat/builder a psacím efektem placeholderu
- Modulární architektura Next.js 15 App Router s React 19 + TypeScript 5
- Autentizace přes NextAuth (Google, GitHub) s Prisma adapterem
- Databáze PostgreSQL přes Prisma (Projects, Files, Templates, Conversations, Messages)
- Tailwind CSS v4 + Framer Motion animace
- Lokalizace (EN, CS) pomocí jednoduchého locale provideru
- E2E testy s Playwright (headless i UI mód)
- Čisté utility rozdělené do tematických modulů (strings, files, dom, usage, project, tree, code)

## Tech Stack

- Framework: Next.js 15 (App Router) + React 19
- Jazyk: TypeScript 5
- UI: Tailwind CSS v4, Framer Motion (motion), Lucide ikony
- Auth: NextAuth.js s Google/GitHub providery + Prisma adapter
- DB: PostgreSQL + Prisma ORM
- AI: @google/generative-ai (Gemini 1.5) [stuby pro OpenAI/Anthropic]
- Testy: Playwright
- Správce balíčků: pnpm

## Rychlý start

Předpoklady:
- Node.js 20+
- pnpm
- PostgreSQL (lokálně nebo hosted)

1) Instalace závislostí

```bash
pnpm install
```

2) Konfigurace prostředí

Vytvořte soubor `.env.local` v kořeni projektu:

```env
# Aplikace
+NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=nahraďte-dlouhým-náhodným-řetězcem

# Databáze
DATABASE_URL=postgresql://UZIVATEL:HESLO@HOST:PORT/DB_JMENO?schema=public

# OAuth poskytovatelé (dle potřeby)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# AI (Gemini)
GEMINI_API_KEY=...
```

3) Prisma client a migrace DB

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

4) Spuštění aplikace

```bash
pnpm dev
```

Otevřete http://localhost:3000

## Skripty

- dev: Dev server (TurboPack)
- build: Produkční build
- start: Produkční server
- lint: ESLint
- test:e2e: Playwright testy
- test:e2e:ui: Playwright v UI režimu
- test:e2e:report: Zobrazení posledního reportu

## Struktura projektu

```
src/
  app/
    api/
    landing/
    builder/
    dashboard/
    auth/
  components/
    layout/
    builder/
    ui/
    blocks/
    providers/
  lib/
    ai.ts
    auth.ts
    prisma.ts
    useTypewriter.ts
    useElementSize.ts
    utils/
  locales/
  types/
prisma/
  schema.prisma
  migrations/
```

## Důležité routy

- / — Landing page
- /builder — Builder rozhraní (přesunuto z landing)
- /auth/login, /auth/register — přihlašování/registrace
- /dashboard — domovská stránka dashboardu
- /api/auth/[...nextauth] — NextAuth handler
- /api/generate — AI generování (dle implementace)
- /api/projects — CRUD pro projekty

## Testování (Playwright)

```bash
pnpm test:e2e
pnpm test:e2e:ui
pnpm test:e2e:report
```

## Poznámky k vývoji

- Tailwind CSS v4 s utility přístupem
- Mobilní navigace: overlay + panel pevně pod headerem
- i18n: viz `src/components/providers/locale-provider` a `src/locales/*`
- Utility moduly re-exportované přes `src/lib/utils.ts` pro zpětnou kompatibilitu
- AI služba používá Gemini (`GEMINI_API_KEY`); OpenAI/Anthropic jsou připravené k doplnění

## Řešení problémů

- Prisma nepřipojí DB:
  - Ověřte `DATABASE_URL`
  - Běží PostgreSQL a je dostupný?
  - Spusťte `pnpm prisma generate` a `pnpm prisma migrate dev`

- Problémy s NextAuth:
  - Zkontrolujte `NEXTAUTH_URL` a `NEXTAUTH_SECRET`
  - Redirect URI musí odpovídat lokální/produkční adrese

- Chyby AI:
  - Nastavte `GEMINI_API_KEY`
  - Zkontrolujte nastavení provideru/modelu v `src/lib/ai.ts`

## Roadmap

- Rozšíření AI providerů (OpenAI / Anthropic)
- Více šablon a generátorů
- Bohatší dashboard a limity využití
- Přístupnost a klávesová navigace

---

## Screenshoty

Několik rychlých snímků aplikace (vygenerováno skriptem `tools/screenshot.js` a uloženo v repozitáři):

- Domovská stránka: `screenshots/home.png`

  ![Domovská stránka](screenshots/home.png)

- Přihlášení: `screenshots/login.png`

  ![Přihlášení](screenshots/login.png)

- Registrace: `screenshots/register.png`

  ![Registrace](screenshots/register.png)

- Builder: `screenshots/builder.png`

  ![Builder](screenshots/builder.png)


Vyrobeno s ❤️ od [nykadamec](https://github.com/nykadamec)
