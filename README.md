# nim

The front-end design system and UI kit shared across nim products.

nim is two things in one package: a **token contract** that defines the vocabulary
a product interface is allowed to speak, and a **React kit** that speaks only that
vocabulary. Swapping the theme changes every screen at once, because nothing
downstream of the contract holds a literal value.

Reference implementation: `../vlora-app` — its architecture (flat CSS-variable
tokens, thin components that compose semantic class names, all styling in
`@layer components`, RTL- and mobile-first) is the shape nim generalises.

```bash
npm install
npm run dev        # the docs gallery — every token, component, variant, state
npm run build      # the distributable kit  → dist/nim.js + dist/nim.css
npm run typecheck
```

---

## Principles

1. **Tokens are the system.** A colour, radius, shadow, or type value may appear
   in exactly one place: a theme file. A literal in `components.css` is a bug —
   it is a decision that escaped the contract.
2. **Semantic names only.** `--nim-accent`, never `--nim-orange`. `--nim-surface`,
   never `--nim-gray-100`. Names describe the role, so a theme can answer them
   however it wants.
3. **Thin components.** A component maps props to class names and renders the
   right element. It does not hold styles, and it does not hold layout opinions
   about the page around it.
4. **The platform first.** Checkboxes are `<input>`, tabs are `role="tablist"`,
   a row that does something is a `<button>` or an `<a>`. Behaviour that the
   browser already gets right is never re-implemented.
5. **Logical properties only.** No `left`/`right`. RTL therefore needs no mirror
   stylesheet — direction is a single `dir` attribute.
6. **Spacing belongs to the page.** No component sets outer margin. `Stack` and
   `Inline` express rhythm at the call site.

---

## Architecture

```
src/
  theme/
    contract.css        the vocabulary — invariants + the list every theme must answer
    themes/ledger.css   preset · paper, ink, signal vermilion, square, hairline
    themes/vlora.css    preset · warm cream, coral, rounded, soft elevation
    reset.css           scoped to .nim-root, never global
    components.css      the only file that draws anything
    index.css           import entry (order is load-bearing)
  components/           one file per component, thin by construction
  lib/                  cn(), the kit's only helper
  index.ts              the public surface
docs/                   the gallery — the kit's first consumer
```

Import order in `index.css` matters: contract → themes → reset → components.
Themes win over each other by specificity rather than by accident, and the reset
is applied inside `.nim-root` so nim can live beside another design system.

---

## Themes

Two presets ship. They differ in **colour, shape, elevation, and type voice** —
never in markup, and never in component code.

| | `ledger` (default) | `vlora` |
|---|---|---|
| Canvas | warm paper `#f7f4ee` | warm cream `#faf9f6` |
| Ink | near-black `#17150f` | slate `#131314` |
| Accent | print vermilion `#b82f18` | coral `#d97757` |
| Radius | `0` — square | `8–24px` — rounded |
| Elevation | hard offset register mark | soft ambient shadow |
| Labels | mono, uppercase, wide-tracked | text face, sentence case |
| Press | shifts into its shadow | compresses |
| Script | Latin-first | Persian-first (Vazirmatn) |

Both presets ship a light and a dark scheme, each balanced separately rather
than filtered from the other, and both honour `prefers-color-scheme` when the
host has not pinned one.

```tsx
import { NimProvider } from 'nim'   // the stylesheet comes with the import

<NimProvider defaultTheme="vlora" defaultScheme="light" direction="rtl">
  <App />
</NimProvider>
```

`NimProvider` writes `data-nim-theme` / `data-nim-scheme` / `dir` onto both its
own wrapper and `<html>`, so portalled surfaces — sheets, toasts — inherit the
theme from outside the React tree.

### Adding a third theme

Copy `themes/ledger.css`, answer every name in the "required of a theme" block
at the bottom of `contract.css`, and add the theme's id to the `NimTheme` union.
Nothing else changes: no component, no class name, no markup.

---

## Components

| Group | Exports |
|---|---|
| Actions | `Button` · `IconButton` |
| Content | `Card` · `Badge` · `Stat` · `Avatar` · `SectionHeader` |
| Forms | `Input` · `Textarea` · `Select` · `Checkbox` · `Switch` · `Slider` · `Segmented` |
| Collections | `List` · `ListRow` |
| Feedback | `Banner` · `EmptyState` · `Spinner` · `Progress` · `Skeleton` · `ToastProvider` / `useToast` |
| Surfaces | `Sheet` |
| Type | `Display` · `Title` · `Body` · `Label` · `Caption` · `Rule` |
| Layout | `AppFrame` · `Stack` · `Inline` |
| System | `NimProvider` · `useNim` · `useSchemeToggle` · `Icon` / `iconNames` · `cn` |

Icons are addressed by **role**, not by vendor name (`<Icon name="trash" />`).
The registry in `components/icon.tsx` is the whole point: it keeps the set
finite and reviewable, stops two screens meaning "delete" with two glyphs, and
makes swapping icon libraries a one-file change.

### Accessibility floor

Every interactive element ships a hover, a press, a focus ring drawn outside its
box, a disabled state, and a 44px minimum target. `IconButton` requires a
`label`. `Sheet` locks the page behind it, closes on Escape, moves focus in on
open and restores it on close. Form controls wire label/hint/error ids to the
control automatically — the part most often got wrong by hand.

---

## Using it in an app

```tsx
import { Button, Card, Stack, Stat, Title, NimProvider, ToastProvider } from 'nim'

export function Screen() {
  return (
    <NimProvider defaultTheme="ledger">
      <ToastProvider>
        <Stack gap="loose">
          <Title>Today</Title>
          <Card variant="raised">
            <Stat value="18M" unit="/min" label="Events" delta="+12%" />
          </Card>
          <Button iconEnd="arrow-forward">Continue</Button>
        </Stack>
      </ToastProvider>
    </NimProvider>
  )
}
```

### Adopting nim in `vlora-app`

The `vlora` preset carries that app's exact palette, radii, shadows, and type
voice, so adoption is mechanical rather than a restyle:

1. Wrap the tree in `<NimProvider defaultTheme="vlora" direction="rtl">` — the
   stylesheet arrives with the first `nim` import.
2. Repoint `src/components/ui/index.ts` at `nim` re-exports, one component at a
   time — the prop APIs were modelled on Vlora's own.
3. Delete the corresponding blocks from `src/theme/tailwind.css` as each
   component moves over.
4. Keep app-specific surfaces (scanner, mascot, reflect flow) in the app. nim
   owns the shared vocabulary, not the product's own domain UI.

Nothing in `vlora-app` has been modified by this package.
