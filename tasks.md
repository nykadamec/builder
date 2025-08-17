# Plán úkolů pro AI Web App Builder - MVP

## Přehled projektu
Vytvořit webovou aplikaci podobnou Lovable.dev a CreateAnything.com - AI-powered app builder, který umožňuje uživatelům vytvářet full-stack Next.js aplikace pomocí přirozených jazykových promptů.

## Specifikace projektu (na základě požadavků)

### Cílová skupina:
- **Primární:** Vývojáři (rychlé prototypování, boilerplate generování)
- **Sekundární:** Non-tech uživatelé (jednoduché aplikace s guided workflow)

### Technologický stack:
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Backend:** Next.js API routes + PostgreSQL
- **AI:** Gemini API (primární) + možnost konfigurace jiných API
- **Deployment:** Vlastní hosting řešení
- **Monetizace:** Freemium model + předplatné

### Klíčové funkce MVP:
- Chat interface pro komunikaci s AI
- Generování Next.js 15 aplikací s Tailwind CSS
- PostgreSQL databáze integrace
- Live preview generovaných aplikací
- Export/download projektů
- Základní user management
- Freemium limity (počet projektů, AI calls)

## AKTUÁLNÍ STAV PROJEKTU (17. srpna 2025)

### ✅ Dokončeno:
- **Next.js 15 setup** - Plně funkční
- **Databáze a Prisma** - Schéma pro users, projects, files
- **Autentifikace** - NextAuth.js s Google/GitHub OAuth
- **UI komponenty** - Tailwind, základní komponenty (Button, Card, atd.)
- **Project management** - CRUD operace, ZIP export
- **Landing page** - Moderní design s animacemi
- **Internationalizace** - i18n systém s CS/EN locale
- **Basic AI integrace** - Gemini API pro generování

### 🔄 Rozpracováno/Částečně:
- **AI generování** - Základní implementace, potřeba rozšíření
- **Dashboard UI** - Základní layout, potřeba vylepšení
- **Project settings** - Částečně implementováno

### ❌ Nedokončeno/Chybí:
- **Real-time chat interface** - Klíčová funkce
- **Live preview systém** - Iframe s generovanými aplikacemi
- **Advanced AI prompts** - Specializované template pro komponenty/stránky
- **Rate limiting** - Ochrana API
- **Freemium systém** - Stripe integrace, usage tracking
- **File management UI** - Lepší práce se soubory projektů
- **Error handling** - Robustní error states
- **Testing** - Unit a E2E testy
- **Production deployment** - Docker, monitoring

## PRIORITNÍ ÚKOLY PRO DALŠÍ IMPLEMENTACI

### 🎯 Nejvyšší priorita (týden 1-2):
1. **Real-time Chat Interface**
   - WebSocket/SSE pro real-time komunikaci
   - Chat UI s message bubbles
   - Typing indicators a loading states
   - Message history persistence

2. **Enhanced AI generování**
   - Lepší prompt engineering pro Next.js komponenty
   - Structured output parsing
   - Multiple AI provider support (OpenAI backup)
   - Code validation a syntax checking

3. **Live Preview System**
   - Iframe sandbox pro bezpečné preview
   - Hot reload při změnách kódu
   - Mobile/desktop responsive toggle
   - Error boundary a debug info

### 🎯 Vysoká priorita (týden 3-4):
4. **File Management Enhancement**
   - File explorer tree view
   - Code editor integrace (Monaco/CodeMirror)
   - File upload/delete/rename
   - Search v kódu

5. **Project Templates**
   - Předpřipravené šablony projektů
   - Template gallery
   - Custom template creation
   - Import z GitHub repo

6. **Rate Limiting & Security**
   - Redis-based rate limiting
   - Input sanitization
   - CSRF protection
   - API key management

### 🎯 Střední priorita (týden 5-6):
7. **Freemium Monetization**
   - Stripe integrace pro platby
   - Usage tracking (AI calls, projects)
   - Plan limits enforcement
   - Billing dashboard

8. **UX Improvements**
   - Better loading states
   - Error handling UI
   - Onboarding flow
   - Help tooltips a documentation

9. **Performance Optimization**
   - Code splitting
   - Caching strategies
   - Database query optimization
   - Image optimization

### 🎯 Nižší priorita (týden 7+):
10. **Testing Suite**
    - Jest unit tests
    - Playwright E2E tests
    - AI response validation
    - Load testing

11. **Production Deployment**
    - Docker containerization
    - CI/CD pipeline
    - Monitoring & logging
    - Backup strategies

12. **Advanced Features**
    - Collaboration (shared projects)
    - Version control integration
    - API for third-party access
    - Mobile-responsive builder

## TECHNICKÉ DLUHY K VYŘEŠENÍ:
- [ ] Async cookies API handling v layout.tsx
- [ ] Error boundary pro AI responses
- [ ] Optimizace bundle size
- [ ] Database indexing pro performance
- [ ] Memory management při velkých projektech
- [ ] WebSocket connection handling
- [ ] File upload size limits
- [ ] CORS pro preview iframe

## MVP Plán úkolů (aktualizovaný podle současného stavu)

### Fáze 1: Základní Next.js 15 setup (Týden 1) ✅ HOTOVO
1. **Inicializace Next.js 15 projektu** ✅
   - `npx create-next-app@latest` s TypeScript ✅
   - Konfigurace Tailwind CSS ✅
   - Nastavení ESLint a Prettier ✅
   - Základní folder struktura ✅

2. **Databáze setup** ✅
   - PostgreSQL připojení (Prisma ORM) ✅
   - Databázové schéma pro uživatele, projekty, AI konverzace ✅
   - Migrace a seeding ✅

3. **Autentifikace** ✅
   - NextAuth.js setup ✅
   - Google/GitHub OAuth ✅
   - JWT session management ✅
   - Protected routes middleware ✅

4. **Internationalizace** ✅ (NOVĚ PŘIDÁNO)
   - I18n provider a hook systém ✅
   - Locale soubory (cs.json, en.json) ✅
   - Cookie-based locale persistence ✅
   - Dynamické metadata podle jazyka ✅
   - Landing page a UI komponenty lokalizace ✅

### Fáze 2: AI integrace (Týden 2) 🔄 ROZPRACOVÁNO
4. **Gemini API integrace** ⚠️ ČÁSTEČNĚ
   - Google AI Studio API setup ✅
   - Konfigurovatelné AI providers (OpenAI, Claude jako backup) ❌
   - Rate limiting a error handling ❌
   - Prompt templates pro Next.js generování ❌

5. **Kód generátor engine** ⚠️ ČÁSTEČNĚ
   - Parser uživatelských požadavků ❌
   - Next.js 15 komponenty generátor ❌
   - API routes generátor ❌
   - Prisma schema generátor ❌
   - Tailwind CSS styling generátor ❌

### Fáze 3: Core MVP funkcionalita (Týden 3-4) ❌ NEPOKRAČOVÁNO
6. **Chat Interface** ❌
   - Real-time chat s AI (Socket.io nebo Server-Sent Events) ❌
   - Message history a context management ❌
   - Typing indicators a loading states ❌
   - Chat customizace (model selection, temperature) ❌

7. **Project Management Dashboard** ⚠️ ZÁKLADY
   - Vytváření nových projektů ✅
   - Seznam projektů s preview ✅
   - Základní project settings ⚠️
   - Export jako ZIP soubor ✅

8. **Live Preview System** ❌
   - Iframe preview generovaných aplikací ❌
   - Hot reload při změnách ❌
   - Mobile/desktop responsive preview ❌
   - Error handling a debugging info ❌

### Fáze 4: Freemium a User Management (Týden 5) ❌ NEPOKRAČOVÁNO
9. **Freemium systém** ❌
   - Usage tracking (AI calls, projekty, export) ❌
   - Subscription management (Stripe integrace) ❌
   - Plan limits enforcement ❌
   - Upgrade prompts a billing ❌

10. **User Experience** ⚠️ ČÁSTEČNĚ
    - Onboarding flow pro non-tech uživatele ❌
    - Guided templates a examples ❌
    - Help dokumentace a tutorials ❌
    - Feedback systém ❌

11. **Performance optimalizace** ❌
    - Code splitting a lazy loading ❌
    - Caching strategie (Redis) ❌
    - Database query optimalizace ❌
    - Image optimalizace ❌

### Fáze 5: Testing a Security (Týden 6) ❌ NEPOKRAČOVÁNO
12. **Testování** ❌
    - Jest unit testy pro utils a API ❌
    - Playwright E2E testy pro kritické flows ❌
    - AI response validation testy ❌
    - Load testing pro AI endpoints ❌

13. **Security a Production readiness** ⚠️ ČÁSTEČNĚ
    - Input sanitization a validation ⚠️
    - Rate limiting (Redis-based) ❌
    - CSRF protection ❌
    - Security headers a HTTPS ❌
    - Environment variables management ✅

### Fáze 6: Deployment a Launch (Týden 7) ❌ NEPOKRAČOVÁNO
14. **Production deployment** ❌
    - Docker kontejnerizace ❌
    - Vlastní server setup (VPS/dedicated) ❌
    - Domain a SSL konfigurace ❌
    - Database backup strategie ❌
    - Monitoring (logs, metrics, alerts) ❌

15. **Launch příprava** ❌
    - Beta testing s vybranými uživateli ❌
    - Performance monitoring ❌
    - Bug fixes a optimalizace ❌
    - Marketing landing page ⚠️ (základy hotové)

## Finální technologický stack

### Core:
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **AI:** Gemini API (+ OpenAI/Claude backup)

### Infrastructure:
- **Caching:** Redis
- **File Storage:** Local/S3-compatible
- **Payments:** Stripe
- **Deployment:** Docker + vlastní server
- **Monitoring:** Custom logging + metrics

### Development:
- **Testing:** Jest + Playwright
- **Code Quality:** ESLint + Prettier
- **Version Control:** Git + GitHub

## MVP Timeline: 7 týdnů (AKTUALIZOVÁNO)

### Stávající Progress:
- **Týden 1-2:** ✅ Základy hotové (setup, auth, i18n, základní UI)

### Zbývající Milestones:
- **Týden 3:** 🎯 Real-time chat + enhanced AI generování
- **Týden 4:** 🎯 Live preview systém + file management  
- **Týden 5:** 🎯 Templates + rate limiting + security
- **Týden 6:** 🎯 Freemium systém a billing
- **Týden 7:** 🎯 Testing + production deployment

### Kritické úkoly pro funkční MVP:
1. **Chat Interface** - bez toho není funkční AI builder
2. **Live Preview** - musí vidět výsledek v real-time
3. **Enhanced AI** - lepší kód generování
4. **Rate Limiting** - ochrana před abuse
5. **File Management** - editace generovaného kódu

## Post-MVP rozšíření:
- Collaboration features (sdílení projektů)
- Template marketplace
- Advanced customizace (themes, components)
- Mobile app
- API pro third-party integrace
- White-label řešení pro firmy

## Success metriky:
- Počet registrovaných uživatelů
- Počet vygenerovaných projektů
- Conversion rate free → paid
- User retention (7-day, 30-day)
- AI response quality score