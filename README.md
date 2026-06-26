# tw-spacing-semantics-plugin

A production-ready **Tailwind CSS v4** plugin that adds a semantic spacing layer — `p-md`, `gap-xl`, `mx-2xl` — built on an isolated `--space-*` custom property system that never touches Tailwind's own spacing scale.

---

## Why this exists

Tailwind's built-in spacing utilities use numeric keys: `p-4`, `gap-8`, `mt-12`. These are structural primitives tied to the raw `--spacing` unit. They work great for low-level layout work, but design systems benefit from named, semantic tokens: _is this the "comfortable" padding or the "tight" padding?_

Also, changing `--spacing-xl`, for example, will modify classes that already have semantic variants such as `max-w-xl`, forcing you to create your custom spacings with another prefix like `max-w-s-xl`.

This plugin adds that semantic layer **without touching** Tailwind's internals. Utilities like `max-w-xl`, `w-4`, `h-screen`, and `gap-8` continue working exactly as Tailwind intended.

The default token scale is based on the concepts of [**Refactoring UI**](https://refactoringui.com/) by Adam Wathan & Steve Schoger. Yes, the Tailwind creators!.

---

## Features

- Fully isolated `--space-*` namespace — zero interference with Tailwind internals
- Generates **only** `p-*`, `m-*`, `-m-*` and `gap-*` utilities
- Two-level customization: global scale factor + individual token override
- Native Tailwind v4 responsive variants (`sm:px-xl`, `md:gap-2xl`)
- CSS-first, ESM, npm-publishable
- JIT tree-shakable — only used utilities appear in output
- Zero Tailwind internals mutated

---

## Installation

```sh
pnpm add tw-spacing-semantics-plugin
```

---

## Setup

In your Tailwind v4 CSS entry file:

```css
@import 'tailwindcss';
@import 'tw-spacing-semantics-plugin';
```

That's it. All semantic utilities are now available.

---

## Default token reference

At Tailwind's default `--spacing: 0.25rem`:

| Token  | Multiplier | Value (rem) | Value (px) |
| ------ | ---------- | ----------- | ---------- |
| `none` | —          | `0`         | `0px`      |
| `3xs`  | × 0.5      | `0.125rem`  | `2px`      |
| `2xs`  | × 1        | `0.25rem`   | `4px`      |
| `xs`   | × 2        | `0.5rem`    | `8px`      |
| `sm`   | × 3        | `0.75rem`   | `12px`     |
| `md`   | × 4        | `1rem`      | `16px`     |
| `lg`   | × 6        | `1.5rem`    | `24px`     |
| `xl`   | × 8        | `2rem`      | `32px`     |
| `2xl`  | × 12       | `3rem`      | `48px`     |
| `3xl`  | × 16       | `4rem`      | `64px`     |
| `4xl`  | × 24       | `6rem`      | `96px`     |
| `5xl`  | × 32       | `8rem`      | `128px`    |
| `6xl`  | × 48       | `12rem`     | `192px`    |
| `7xl`  | × 64       | `16rem`     | `256px`    |
| `8xl`  | × 96       | `24rem`     | `384px`    |
| `9xl`  | × 128      | `32rem`     | `512px`    |
| `10xl` | × 192      | `48rem`     | `768px`    |
| `11xl` | × 256      | `64rem`     | `1024px`   |

---

## Generated utilities

Every token is available across spacing axes.

### Padding

| Classes generated                                             |
| ------------------------------------------------------------- |
| `p-{t}` `px-{t}` `py-{t}` `pt-{t}` `pr-{t}` `pb-{t}` `pl-{t}` |

> Padding does NOT support negative values.

---

### Margin and negative margin

| Classes generated                                                    |
| -------------------------------------------------------------------- |
| `m-{t}` `mx-{t}` `my-{t}` `mt-{t}` `mr-{t}` `mb-{t}` `ml-{t}`        |
| `-m-{t}` `-mx-{t}` `-my-{t}` `-mt-{t}` `-mr-{t}` `-mb-{t}` `-ml-{t}` |

---

### Gap

| Classes generated                 |
| --------------------------------- |
| `gap-{t}` `gap-x-{t}` `gap-y-{t}` |

> Gap does NOT support negative values in CSS.

Only the classes you actually used will appear in the final CSS.

---

## Usage

```html
<!-- Semantic padding -->
<article class="p-md">…</article>

<!-- Responsive semantic padding -->
<section class="px-sm sm:px-md lg:px-xl">…</section>

<!-- Semantic gap in a grid -->
<div class="grid grid-cols-3 gap-lg">…</div>

<!-- Responsive gap -->
<div class="flex flex-col gap-sm md:gap-lg">…</div>

<!-- Margin -->
<div class="mt-md mb-lg">…</div>

<!-- Negative margin -->
<div class="-mt-md -mb-lg"></div>

<!-- Horizontal negative margin -->
<div class="-mx-xl"></div>

<!-- Mixed layout: Tailwind structural + semantic spacing -->
<div class="max-w-xl mx-auto px-md py-lg">
	<!-- max-w-xl → max-width: var(--container-xl) -->
	<!-- px-md    → padding-inline: var(--space-md) -->
</div>
```

---

## Customization

### By changing `--spacing`

If you have a custom `--spacing` theme, the plugin will automatically adapt the utilities to use your custom spacing.

```css
@import 'tailwindcss';
@import 'tw-spacing-semantics-plugin';

@theme {
	--spacing: 4rem;
}
```

### Individual token overrides

Pin a specific token to an exact value.

```css
@theme {
	--space-md: 1.5rem; /* always 24px, regardless of --spacing */
	--space-xl: 2.75rem; /* always 44px, regardless of --spacing */
}
```

### Add new tokens

If you need more tokens you can add them.

````css
@theme {
	--space-4xs: calc(var(--spacing) * 0.25)
	--space-12xl: calc(var(--spacing) * 512)
}
```

## Responsive variants

All semantic utilities participate in Tailwind v4's full variant system with no extra configuration:

```html
<!-- Responsive -->
<div class="py-sm md:py-lg xl:py-2xl">…</div>
<div class="gap-md lg:gap-xl">…</div>

<!-- State-based -->
<button class="px-md hover:px-lg transition-all">…</button>

<!-- Combined -->
<section class="p-sm sm:p-md lg:p-xl dark:p-lg">…</section>
```

---

## License

MIT
