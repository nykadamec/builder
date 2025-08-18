# Authentication System - Quick Start Guide

## 🚀 Rychlé spuštění

### 1. Instalace závislostí
```bash
pnpm install
```

### 2. Nastavení prostředí
Zkopírujte `.env` soubor a upravte podle potřeby:
```bash
cp .env .env.local
```

### 3. Databáze
```bash
# Spuštění migrace
pnpm prisma migrate dev

# Generování Prisma klienta
pnpm prisma generate
```

### 4. Spuštění aplikace
```bash
pnpm dev
```

Aplikace poběží na `http://localhost:3000` (nebo dalším dostupném portu).

## 📱 Testování autentifikace

### Testovací stránka
Přejděte na `/test-auth` pro kompletní testování všech autentifikačních funkcí.

### Registrace nového uživatele
1. Přejděte na `/register`
2. Vyplňte formulář s:
   - Email (povinný)
   - Username (volitelný)
   - Heslo (musí splňovat požadavky)
   - Jméno (volitelné)

### Přihlášení
1. Přejděte na `/login`
2. Použijte email nebo username a heslo

### Testování ochrany tras
1. **Bez přihlášení**: Zkuste přistoupit na `/builder`, `/dashboard`, `/profile`
   - Budete přesměrováni na `/login` s return URL
2. **Po přihlášení**: Zkuste přistoupit na `/login` nebo `/register`
   - Budete přesměrováni na `/dashboard`
3. **Return URL**: Po přihlášení budete přesměrováni na původně požadovanou stránku

### Správa profilu
1. Po přihlášení přejděte na `/profile`
2. Můžete:
   - Upravit profil
   - Změnit heslo
   - Smazat účet

## 🔧 API Endpointy

### Autentifikace
- `POST /api/auth/register` - Registrace
- `POST /api/auth/login` - Přihlášení
- `POST /api/auth/logout` - Odhlášení
- `GET /api/auth/me` - Aktuální uživatel

### Správa účtu
- `PUT /api/auth/profile` - Aktualizace profilu
- `POST /api/auth/change-password` - Změna hesla
- `DELETE /api/auth/delete-account` - Smazání účtu

## 🧪 Testování

```bash
# Spuštění všech testů
pnpm test

# Testy s pokrytím
pnpm test:coverage

# E2E testy
pnpm test:e2e
```

## 🔒 Bezpečnostní funkce

### Implementované
✅ **Hashování hesel** - bcrypt s 12 rounds
✅ **JWT tokeny** - Secure access a refresh tokeny
✅ **Rate limiting** - Ochrana proti brute force útokům
✅ **Input validace** - Zod schémata pro všechny vstupy
✅ **Sanitizace** - Ochrana proti XSS a injection útokům
✅ **CORS konfigurace** - Bezpečné cross-origin požadavky
✅ **Security headers** - CSP, HSTS, X-Frame-Options
✅ **HTTP-only cookies** - Bezpečné ukládání tokenů
✅ **Route protection** - Next.js middleware pro ochranu tras
✅ **Return URLs** - Automatické přesměrování po přihlášení
✅ **Context management** - React context pro stav autentifikace

### Požadavky na heslo
- Minimálně 8 znaků
- Velké písmeno (A-Z)
- Malé písmeno (a-z)
- Číslo (0-9)
- Speciální znak (!@#$%^&*)

### Rate limity
- Přihlášení: 5 pokusů za 15 minut na email
- Registrace: 5 pokusů za 15 minut na IP
- Aktualizace profilu: 10 za 15 minut na uživatele
- Změna hesla: 5 za 15 minut na uživatele

## 📚 Dokumentace

Kompletní dokumentace je k dispozici v:
- `docs/authentication.md` - Detailní dokumentace systému
- `docs/changelog.md` - Seznam změn

## 🛠️ Konfigurace

### Prostředí (.env)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
BCRYPT_ROUNDS=12
PASSWORD_MIN_LENGTH=8
```

### Aplikace (config.json)
Konfigurace aplikace včetně autentifikačních funkcí je v `config.json`.

## 🚨 Produkční nasazení

### Před nasazením změňte:
1. **JWT_SECRET** - Silný náhodný klíč
2. **NEXTAUTH_SECRET** - Silný náhodný klíč  
3. **DATABASE_URL** - Produkční databáze
4. **CORS origins** - Pouze vaše domény
5. **Rate limity** - Podle potřeby

### Doporučené nastavení pro produkci:
```env
NODE_ENV=production
JWT_SECRET="super-strong-secret-key-256-bits"
NEXTAUTH_SECRET="another-super-strong-secret"
BCRYPT_ROUNDS=14
```

## 🐛 Řešení problémů

### Časté problémy:
1. **Databáze není dostupná** - Zkontrolujte DATABASE_URL
2. **JWT chyby** - Ověřte JWT_SECRET
3. **Rate limiting** - Zkontrolujte limity v .env
4. **CORS chyby** - Nastavte správné origins

### Debug režim:
```env
NODE_ENV=development
DEBUG=auth:*
```

## 📞 Podpora

Pro otázky a problémy:
1. Zkontrolujte dokumentaci v `docs/`
2. Spusťte testy: `pnpm test`
3. Zkontrolujte logy aplikace
4. Ověřte konfiguraci v `.env`

---

**Vytvořeno:** 17.8.2024  
**Verze:** 0.3.0  
**Autor:** nykadamec
