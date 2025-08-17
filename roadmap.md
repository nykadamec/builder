# Roadmap

> Moderní, přehledný a akční plán pro projekt „builder" — zaměřeno na rychlé hodnoty, transparentní priority a konkrétní milníky.

## Vize

Cílem projektu builder je umožnit vývojářům a týmům rychle vytvářet, konfigurovat a nasazovat webové komponenty a aplikace s důrazem na UX, rozšiřitelnost a automatizaci.

## Tematické okruhy (Themes)

- UX & Design System
- Core: jádro, výkon, stabilita
- Integrace: CI/CD, externí služby, API
- Developer Experience (DX): CLI, dokumentace, šablony
- Kvalita: testy, linting, monitoring
- Community & Contributions

## Priorita: Now / Next / Later

### Now (0-4 týdny)
- [x] Stabilizovat build pipeline (CI)
- [ ] Přidat základní dokumentaci k instalaci a rychlému startu
- [ ] Implementovat automatické lintování TypeScript kódu
- Nápady a funkce:
  - Hot-reload pro vývoj lokálně
  - Zjednodušený CLI: init, build, serve

### Next (1-3 měsíce)
- [ ] Design system: základní komponenty (Button, Input, Modal)
- [ ] Plugin systém pro rozšíření builderu
- [ ] Integrace s GitHub Actions pro automatické nasazení
- Nápady a funkce:
  - Šablony projektů (starter templates)
  - Generátor komponent s testy
  - Dashboard pro sledování buildů a nasazení

### Later (3-12 měsíců)
- [ ] Pokročilé optimalizace výkonu a cache
- [ ] Multiplatformní export (static, SPA, SSR)
- [ ] Marketplace šablon a pluginů
- Nápady a funkce:
  - Vizualní builder (drag & drop) pro tvorbu UI
  - Integrace s third-party auth a databázemi
  - Analytika runtime využití komponent

## Milníky (konkrétní cíle)
- Milník 1 — MVP: CLI, build, serve, README (4 týdny)
- Milník 2 — DX: šablony + generator + integrace CI (3 měsíce)
- Milník 3 — Ekosystém: marketplace + vizuální builder (9-12 měsíců)

## Metriky úspěchu
- Doba od clonování repo po spuštění lokálního dev serveru < 10 minut
- Počet stažených starter šablon / měsíc
- Počet PRs od externích přispěvatelů
- Průměrná doba CI buildu

## Backlog (rychlé nápady)
- Internationalizace (i18n) šablon
- Podpora monorepa
- Předpřipravené accessibility testy
- Command palette pro CLI

## Jak přispět
1. Zkontroluj issues a přidej komentář, že na tom pracuješ
2. Vytvoř feature branch: feature/krátký-popis
3. Přidej testy a aktualizuj dokumentaci
4. Otevři PR, označ štítek (feature/bugfix/docs)

## Stavy a vizualizace
- Použij GitHub Projects (Kanban) s osami: Backlog / In progress / Review / Done
- Každý milník má vlastní projekt board

## Designové a technické doporučení
- Používat TypeScript s přísným nastavením (strict: true)
- Komponenty izolovat a dokumentovat v Storybooku
- CI: GitHub Actions + caching závislostí + paralelní joby

---

Pokud chceš, mohu tento roadmap rozdělit na jednotlivé issues (MVP, DX, Ecosystem) a automaticky je vytvořit v repo.