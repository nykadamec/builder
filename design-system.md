# Design System

> Modularní a konzistentní knihovna komponent pro projekt builder.

## Principy
- **Jednotnost:** stejný vzhled a chování napříč aplikací.
- **Modularita:** malé, izolované a znovupoužitelné komponenty.
- **Přístupnost:** WCAG AA compliance pro všechny komponenty.
- **Theming:** snadná úprava barev a typografie skrze CSS proměnné.
- **Dokumentace:** každý komponent v Storybooku s příklady.

## Design Tokens
```css
:root {
  /* Barvy */
  --color-primary: #1e88e5;
  --color-primary-hover: #1565c0;
  --color-secondary: #e53935;
  --color-background: #ffffff;
  --color-surface: #f5f5f5;
  --color-text: #212121;

  /* Typografie */
  --font-family-base: 'Inter', sans-serif;
  --font-size-base: 16px;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}
```

## Komponenty

### Button
- Varianty: `primary`, `secondary`, `tertiary`, `danger`
- Velikosti: `sm`, `md`, `lg`
- Stavy: `default`, `hover`, `active`, `disabled`, `loading`
- API (TypeScript):
  ```ts
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    icon?: ReactNode;
    children: ReactNode;
  }
  ```

### Input
- Typy: `text`, `password`, `email`, `number`, `search`
- Stavy: `default`, `focused`, `error`, `disabled`
- API:
  ```ts
  interface InputProps {
    type?: string;
    value: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    onChange: (value: string) => void;
  }
  ```

### Modal
- Varianty: `standard`, `fullscreen`
- Props:
  ```ts
  interface ModalProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    children: ReactNode;
  }
  ```
- Implementation: Portals, focus trap, ESC key, přístupnost.

### Checkbox & Radio
- Jednoduché stavy: `checked`, `unchecked`, `indeterminate`
- API:
  ```ts
  interface CheckboxProps {
    checked: boolean;
    indeterminate?: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
  }
  interface RadioProps {
    name: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    label?: string;
  }
  ```

### Switch (Toggle)
- Stylizovaný checkbox pro boolean hodnotu.

### Select
- Supports single/multi select, custom render, search/filter.

### Tooltip
- Aktivační mechanismy: `hover`, `focus`, `click`
- Delay a pozice: top/right/bottom/left

### Card
- Container pro náhledy obsahu, podporuje `header`, `body`, `footer`, `actions`.

### Badge & Tag
- Různé varianty barvy a velikosti.

### Avatar
- Podpora obrázku, initials, fallback.

## Integrace a nástroje
- **Storybook**: dokumentace a vizuální testování.
- **CSS Modules** nebo **styled-components** s podporou tematických proměnných.
- **Testing Library** + **jest** pro unit a accessibility testy (axe).
- **TypeScript** s `strict` nastavením.
- **CI**: GitHub Actions workflows pro lint, testy a publikaci.

## Další kroky
1. Scaffold projekt `packages/design-system`.
2. Nastavit Storybook a základní konfiguraci.
3. Vytvořit první komponenty: Button, Input, Modal.
4. Přidat testy a dokumentaci.
5. Publikovat do internal NPM registry a CI pipeline.