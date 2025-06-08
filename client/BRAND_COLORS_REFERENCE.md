# StreamlineHR Brand Colors Reference

## 🎨 Color Palette Overview

This document outlines the brand colors implemented in your Tailwind CSS theme and how to use them effectively across your application.

## 🎯 Primary Brand Color

### Electric Indigo (`#5729FF`)

- **Usage**: Primary buttons, links, brand highlights, CTAs
- **Tailwind Class**: `bg-primary`, `text-primary`, `border-primary`
- **Available Shades**: `primary-50` through `primary-900`

```jsx
// Examples
<button className="bg-primary text-white">Primary Button</button>
<h1 className="text-primary">Brand Heading</h1>
<div className="border-primary border-2">Branded Border</div>
```

## ⚪️ Neutral Colors

### Light Gray (`#F5F7FA`)

- **Usage**: Main background color
- **Tailwind Class**: `bg-neutral-light`

### Cool Gray (`#D1D5DB`)

- **Usage**: Borders, input fields, subtle elements
- **Tailwind Class**: `bg-neutral-medium`, `border-neutral-medium`

### Charcoal (`#2E2E2E`)

- **Usage**: Main text color, headings
- **Tailwind Class**: `text-neutral-dark`

### White (`#FFFFFF`)

- **Usage**: Cards, modals, UI surfaces
- **Tailwind Class**: `bg-neutral-white`

```jsx
// Examples
<div className="bg-neutral-light min-h-screen">
  <div className="bg-neutral-white border border-neutral-medium">
    <h2 className="text-neutral-dark">Card Title</h2>
  </div>
</div>
```

## 🔵 Accent Colors

### Sky Blue (`#3A8DFF`)

- **Usage**: Info alerts, secondary buttons, informational elements
- **Tailwind Class**: `bg-accent-blue`, `text-accent-blue`

### Mint Green (`#4ADE80`)

- **Usage**: Success states, positive feedback
- **Tailwind Class**: `bg-accent-green`, `text-accent-green`

### Sunset Orange (`#FB923C`)

- **Usage**: Warnings, attention-grabbing elements
- **Tailwind Class**: `bg-accent-orange`, `text-accent-orange`

### Rose Red (`#EF4444`)

- **Usage**: Errors, destructive actions
- **Tailwind Class**: `bg-accent-red`, `text-accent-red`

```jsx
// Examples
<div className="bg-accent-green text-white">Success Message</div>
<div className="bg-accent-orange text-white">Warning Alert</div>
<div className="bg-accent-red text-white">Error Message</div>
<div className="bg-accent-blue text-white">Info Banner</div>
```

## 🎨 Secondary Support Colors

### Lavender (`#BFA8FF`)

- **Usage**: Soft backgrounds, tooltips, subtle highlights
- **Tailwind Class**: `bg-secondary-lavender`, `text-secondary-lavender`

### Deep Navy (`#1E1B4B`)

- **Usage**: Headers, navigation, dark themes
- **Tailwind Class**: `bg-secondary-navy`, `text-secondary-navy`

```jsx
// Examples
<nav className="bg-secondary-navy text-white">Navigation</nav>
<div className="bg-secondary-lavender/20">Soft Background</div>
```

## 🚀 Semantic Color Classes

For quick access to meaningful colors:

```jsx
// Semantic classes that map to accent colors
<span className="text-success">Success text</span>
<span className="text-warning">Warning text</span>
<span className="text-error">Error text</span>
<span className="text-info">Info text</span>

<div className="bg-success">Success background</div>
<div className="bg-warning">Warning background</div>
<div className="bg-error">Error background</div>
<div className="bg-info">Info background</div>
```

## 🎛️ Pre-built Component Classes

### Button Styles

```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-outline">Outline Button</button>
```

### Card Component

```jsx
<div className="card p-6">
  <h3>Card Title</h3>
  <p>Card content with consistent styling</p>
</div>
```

### Input Fields

```jsx
<input className="input-field" placeholder="Styled input field" />
```

## 🎨 Color Usage Guidelines

### Do's ✅

- Use `primary` for main CTAs and brand elements
- Use neutral colors for text hierarchy
- Use accent colors for status indicators
- Combine colors with appropriate opacity (`/10`, `/20`, etc.)

### Don'ts ❌

- Don't use hardcoded hex values (use the theme classes instead)
- Don't mix too many accent colors in one component
- Don't use primary color for error states
- Avoid using accent colors for large backgrounds

## 🎯 Brand Consistency Examples

### Hero Section

```jsx
<section className="bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10">
  <h1 className="text-neutral-dark">
    Transform <span className="text-primary">Your Business</span>
  </h1>
  <button className="btn-primary">Get Started</button>
</section>
```

### Status Indicators

```jsx
<div className="flex items-center">
  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
  <span className="text-accent-green">Online</span>
</div>
```

### Cards with Brand Accent

```jsx
<div className="card hover:border-primary transition-colors">
  <div className="w-10 h-10 bg-primary rounded-lg">
    <Icon className="text-white" />
  </div>
  <h3 className="text-neutral-dark">Feature Title</h3>
</div>
```

## 📱 Responsive Design Notes

- All colors work seamlessly across light themes
- Use opacity modifiers (`/10`, `/20`, `/50`) for layering
- Consider accessibility when combining colors
- Test color combinations for sufficient contrast

## 🔄 Migration Tips

When updating existing components:

1. Replace `bg-indigo-600` with `bg-primary`
2. Replace `text-gray-900` with `text-neutral-dark`
3. Replace `bg-white` with `bg-neutral-white`
4. Replace generic color classes with branded ones

## 🎨 CSS Custom Properties

Available CSS variables for complex styling:

```css
:root {
  --color-primary: #5729ff;
  --color-neutral-light: #f5f7fa;
  --color-neutral-dark: #2e2e2e;
  --color-accent-green: #4ade80;
  /* ... and more */
}
```

Use these for custom animations or complex styling where Tailwind classes aren't sufficient.
