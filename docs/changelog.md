# Changelog

## 0.2.0

- **Implementována nová landing page jako main page** (`src/app/page.tsx`)
  - Přepsána původní page.tsx s moderním dark designem inspirovaným Aceternity UI
  - Přidány Framer Motion animace pro smooth entrance effects
  - Implementován Aurora backdrop s radiálními gradienty
  - Gradient text efekty pro hlavní nadpisy
  - Glass morphism efekty pro tlačítka a navigaci
  - Responsive design s mobile-first přístupem

- **Vytvořen kompletní UI Design System** (`docs/UI_design_system.md`)
  - Definována barevná paleta s dark-first přístupem
  - Typografická hierarchie a komponenty
  - Animační systém s Framer Motion
  - Gradient efekty a glow borders
  - Accessibility guidelines
  - Implementation notes a best practices
  - Inspirováno Aceternity UI knihovnou

## 0.1.0

- Added Playwright to devDependencies and verified installation
- Created Playwright config: `playwright.config.ts`
- Added example E2E test: `tests/example.spec.ts`
- Added E2E scripts to package.json: test:e2e, test:e2e:ui, test:e2e:report
- Created docs: `docs/Playwright.md`
- Created `config.json` with app meta and Playwright settings

