# UI Design System

## Overview

This design system is inspired by [Aceternity UI](https://ui.aceternity.com/) and built with Tailwind CSS and Framer Motion. It provides a cohesive visual language for the AI App Builder platform with modern, elegant components and animations.

## Design Principles

### 1. **Dark-First Design**
- Primary background: `#0b0b12` (deep dark blue)
- Text hierarchy using white opacity variants
- Subtle borders and backgrounds with transparency

### 2. **Aurora & Gradient Effects**
- Radial gradients for atmospheric backgrounds
- Gradient text effects for emphasis
- Glow effects for interactive elements

### 3. **Smooth Animations**
- Framer Motion for entrance animations
- Staggered timing for sequential reveals
- Easing functions: `easeOut` for natural feel

## Color Palette

### Primary Colors
```css
/* Background */
--bg-primary: #0b0b12;
--bg-secondary: rgba(255, 255, 255, 0.05);
--bg-tertiary: rgba(255, 255, 255, 0.10);

/* Text */
--text-primary: rgba(255, 255, 255, 1);
--text-secondary: rgba(255, 255, 255, 0.80);
--text-tertiary: rgba(255, 255, 255, 0.70);
--text-muted: rgba(255, 255, 255, 0.60);

/* Borders */
--border-primary: rgba(255, 255, 255, 0.10);
--border-secondary: rgba(255, 255, 255, 0.15);
```

### Gradient Colors
```css
/* Primary Gradient */
--gradient-primary: linear-gradient(to top right, #6366f1, #8b5cf6, #d946ef);

/* Text Gradient */
--gradient-text: linear-gradient(to top right, #a5b4fc, #c4b5fd, #f0abfc);

/* Aurora Effects */
--aurora-purple: rgba(124, 58, 237, 0.25);
--aurora-pink: rgba(236, 72, 153, 0.12);
--aurora-indigo: rgba(79, 70, 229, 0.18);
--aurora-violet: rgba(168, 85, 247, 0.14);
```

## Typography

### Font Hierarchy
```css
/* Headings */
.heading-xl {
  @apply text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight;
}

.heading-lg {
  @apply text-3xl sm:text-4xl font-bold leading-tight;
}

.heading-md {
  @apply text-xl sm:text-2xl font-semibold;
}

/* Body Text */
.body-lg {
  @apply text-lg text-white/70;
}

.body-md {
  @apply text-base text-white/80;
}

.body-sm {
  @apply text-sm text-white/70;
}

.body-xs {
  @apply text-xs text-white/60;
}
```

## Components

### 1. Navigation Bar
```tsx
// Clean, minimal navigation with backdrop blur
<header className="relative z-20">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
    {/* Logo with gradient background */}
    {/* Navigation links */}
    {/* CTA button */}
  </div>
</header>
```

### 2. Gradient Text
```tsx
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-tr from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_6px_40px_rgba(168,85,247,0.25)]">
      {children}
    </span>
  );
}
```

### 3. Primary Button
```tsx
// Gradient button with glow effect
<a className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-base font-semibold shadow-lg shadow-fuchsia-500/20 transition hover:shadow-fuchsia-500/30 focus:outline-none">
  <span className="relative z-10 inline-flex items-center gap-2">
    <Icon className="h-4 w-4" /> Button Text
  </span>
  <GlowBorder />
</a>
```

### 4. Secondary Button
```tsx
// Glass morphism button
<a className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 backdrop-blur transition hover:bg-white/[0.07]">
  Button Text <Icon className="h-4 w-4" />
</a>
```

### 5. Badge/Pill
```tsx
// Subtle badge with border and backdrop blur
<div className="mb-6 w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur">
  <span className="inline-flex items-center gap-2">
    <Icon className="h-4 w-4" />
    <span className="text-white/80">Badge Text</span>
  </span>
</div>
```

## Animations

### Entrance Animations
```tsx
// Staggered fade-in with slide up
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
>
  Content
</motion.div>
```

### Animation Timing
- **Duration**: 0.6-0.7s for smooth feel
- **Easing**: `easeOut` for natural deceleration
- **Stagger**: 0.05s increments for sequential reveals
- **Distance**: 6-8px for subtle movement

## Background Effects

### Aurora Backdrop
```tsx
function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Multiple radial gradients for depth */}
      {/* Grid overlay for texture */}
      {/* Fade gradients for edge blending */}
    </div>
  );
}
```

### Glow Effects
```tsx
function GlowBorder() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-indigo-500/0 via-fuchsia-500/20 to-fuchsia-500/0 blur-xl"
    />
  );
}
```

## Layout Patterns

### Centered Hero Layout
```css
.hero-container {
  @apply flex min-h-screen flex-col bg-[#0b0b12] text-white antialiased;
  @apply selection:bg-white/10 selection:text-white;
}

.hero-content {
  @apply flex flex-1 flex-col items-center justify-center px-6 text-center;
}
```

### Content Spacing
- **Section padding**: `py-20` (80px vertical)
- **Container max-width**: `max-w-6xl`
- **Content max-width**: `max-w-3xl` for readability
- **Element spacing**: `mt-6`, `mt-10`, `mt-12` for hierarchy

## Accessibility

### Focus States
```css
.focus-visible {
  @apply focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#0b0b12];
}
```

### Color Contrast
- Ensure minimum 4.5:1 contrast ratio
- Use `text-white/70` or higher for body text
- Use `text-white/80` or higher for interactive elements

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  .motion-reduce {
    @apply transition-none;
  }
}
```

## Usage Guidelines

### Do's
- Use consistent spacing scale (4px, 8px, 12px, 16px, 24px, 32px)
- Apply backdrop blur to floating elements
- Use subtle shadows for depth
- Implement smooth transitions for interactions

### Don'ts
- Avoid pure white text (use opacity variants)
- Don't use harsh borders (prefer subtle transparency)
- Avoid abrupt animations (use easing functions)
- Don't mix different gradient directions inconsistently

## Implementation Notes

### Required Dependencies
```json
{
  "framer-motion": "^10.x.x",
  "lucide-react": "^0.x.x",
  "tailwindcss": "^3.x.x"
}
```

### Tailwind Configuration
Ensure these utilities are available in your Tailwind config:
- Backdrop blur utilities
- Custom color opacity variants
- Drop shadow utilities
- Gradient utilities

This design system provides a foundation for building consistent, modern interfaces that align with the Aceternity UI aesthetic while maintaining accessibility and performance standards.
