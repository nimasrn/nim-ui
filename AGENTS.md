# Agent Instructions — nim-ui

This file is the root policy for the standalone `nim-ui` repository.
[README.md](README.md) documents principles and the token
contract — read it first; it is authoritative for this dir.

## Facts and constraints

- Library-mode Vite build: artifacts are exactly `dist/nim.js` + `dist/nim.css`
  (token contract + React kit). Don't add runtime deps beyond current set
  without strong justification.
- The gallery under `docs/` builds into `dist-docs/` via
  `npm run build:docs`. The separate `nim-zone` repository republishes that
  output to `public/uikit/`; after kit changes, rebuild and update the site so
  consumers stay current.
- `Button` renders an `<a>` when `href` is set, and `loading`/`disabled` are
  typed out of that branch — there is no disabled link in HTML, and faking one
  with `aria-disabled` leaves it in the tab order still navigating.
- vlora-app is the reference architecture: token naming and component patterns
  should stay consistent with it. Breaking token changes are cross-family
  changes — coordinate with consumers (nim, vlora-app) in one task.
- The flows layer has two tiers and they must stay separable: the PARTS
  (`AuthScreen`, `PhoneField`, `OtpInput`, `PasswordField`, `PlanCard`,
  `ProfileHeader`, `TabBar`) are stateless and composable; the SCREENS
  (`SignInFlow`, `PlanPicker`, `ProfileScreen`, `AppShell`, `Onboarding`) hold
  their own state and are mounted as-is. A screen may only add state and
  assembly — never markup or CSS a part could have owned.
- Flow and chat components add no new tokens. One that needs a literal is a
  missing token, not an exception.
- A flow screen never imports a router, an API client, or a payment SDK. A
  handler resolving IS success; what happens next is the app's, decided in one
  place rather than at each of the flow's exits.
- `AdminShell`'s workspace carries `flex: 1` and its nav carries
  `align-content: start`. Both are load-bearing and both failed silently
  before 0.8: a flex item without `flex: 1` is sized from its content, so a
  page whose own width is `100%` collapses to a narrow column with the window
  empty beside it; and a grid given free height by `flex: 1` distributes that
  slack BETWEEN its rows, which spread the nav groups down the sidebar and
  stretched the active item into a tall block.
- `AppShell` is responsive by default: past 64rem the frame widens to
  `--nim-frame-max-wide` and the tab bar becomes a side rail. It is a MEDIA
  query on purpose — an app frame answers the window it owns, unlike
  `AdminShell`, which is often embedded. The shell also carries
  `min-block-size: 100dvh`; do not remove it in favour of `block-size: 100%`,
  which silently depends on every ancestor being full height.
- `.nim-button__label` is a flex row on purpose. `reset.css` makes every SVG in
  the kit `display: block`, so an icon handed to `Button` as a CHILD instead of
  through `iconStart` would break the line inside the label and stack above the
  text. Prefer `iconStart`/`iconEnd`; the flex label is the guard, not the API.
- A `<dialog>` is hidden by the UA stylesheet's `display: none` when closed.
  Any `display` the kit gives `.nim-dialog` belongs on `[open]` — an
  unconditional one draws every closed dialog inline on the page that mounted
  it.
- `AdminShell`'s responsive switch is a CONTAINER query, not a media query, and
  the layout is a flex row so the size-dependent rules can live on descendants
  (a container query may not style its own container). A console is often
  embedded, and one that answers the window instead of its own box is wrong in
  the case it is embedded in.
- Money is never computed, rounded, or currency-formatted by the kit.
  `OrderSummary`, `PlanCard` and `ActionBar` take already-formatted nodes; a
  component that accepts a number and a currency code has taken a decision that
  belongs to the product.
- `TaskProgress` keeps failure as a state of a STEP. Do not collapse a failed
  job into an error panel that hides the stage list — which stage failed is the
  whole diagnostic.
- Chat plays media in the platform's own `<audio>`/`<video>`, never a
  re-implemented player: that is where the decoder, media keys, PiP and captions
  come from. Recording is feature-detected (`MediaRecorder` + `getUserMedia`)
  and hidden when absent, and every exit path — including unmount — must stop
  the stream's tracks, or the microphone indicator outlives the recording.
- The transcript auto-scrolls only when the viewer is already within 48px of the
  bottom. Do not "fix" this into an unconditional scroll.
- `lib/countries.ts` carries ISO code + dialling code only. Names come from
  `Intl.DisplayNames` at runtime and flags from regional indicators; never add a
  name column, it cannot be kept correct in every locale the kit is read in.
- Icons come from lucide-react. Which ones mirror under RTL is decided by the
  `DIRECTIONAL` set in `components/icon.tsx` — never by a per-component
  `[dir='rtl'] … svg { scale: -1 1 }`, which flips checkmarks too.
- RTL is a layout concern (`dir`) and Persian typography is a script concern
  (`lang`). Corrections keyed to the script live in `theme/persian.css`; never
  key them to `dir`.
- Anything portalled to `<body>` (sheet, menu, popover, toast) lands outside
  `.nim-root` and inherits the document's default serif. `reset.css` lists the
  portal roots and re-establishes the kit's typography — add new portalled
  surfaces to that list.
- `Calendar`/`DateField`/`DatePicker` draw both calendars since 0.4, and the
  `Intl` formatters follow the grid's system rather than pinning one — the label
  and the cells must always name the same calendar. The value is an ISO
  Gregorian date in every system; a component that returns a Jalali string has
  broken the contract.
- `lib/calendars.ts` deliberately has no conversion table and no leap rule:
  `Intl` with `-u-ca-persian` is the source of truth and the inverse is a
  corrected estimate checked against it. Do not replace this with a hand-written
  algorithm or a date library — and if you touch it, re-run the 1900–2100
  round-trip check before claiming it works.
- Appearance is TWO axes, not a theme list: styles (`ledger`, `vlora`,
  `console`) own shape, elevation geometry, type voice and press; colourways
  (`vermilion`, `oxblood`, `coral`, `teal`, `sable`) own surfaces, ink, lines,
  accent, status and shadow tint. A style must name no colour and a colourway
  must name no radius — if a new token does not clearly belong to one axis, it
  is in the wrong place. `contract.css` carries a checklist per axis.
- Colourway values are `light-dark()` pairs resolved by `color-scheme`, set in
  `contract.css`. Never add a `prefers-color-scheme` block to a colourway, and
  never add a second dark rule — that duplication is what let a preset inherit
  another's dark palette before 0.2.
- Density is applied where a height is USED
  (`calc(var(--nim-control-md) * var(--nim-density))` in `components.css`), never
  folded into the control tokens. A custom property that references another is
  substituted where it is DECLARED, so baking density into `--nim-control-md`
  freezes it at the root and a subtree override silently does nothing.
- `Accordion`'s panel is a `grid-template-rows: 0fr → 1fr` row, and a closed
  panel is `inert`. Do not "fix" it into `max-height` (which has to guess a
  height and overshoots) or into `<details>` (which cannot animate its own open
  state and cannot be driven from outside). `inert` is what takes the collapsed
  controls out of the tab order; removing it leaves them reachable at zero
  pixels tall.
- A `Chip` is an object (a filter, a recipient, a tag) and a `Badge` is a label
  about one. Only the chip is interactive, and its remove control is a SIBLING
  button — a button nested in a button is invalid and the inner one stops being
  reachable.
- `Rating` and `FileDrop` are painted over real platform inputs (a radio set, a
  file input). Replacing either with buttons and key handlers is what makes
  those two controls unusable by keyboard everywhere else on the web.
- `FileDrop` takes files and nothing else. It has no upload, no progress and no
  retry: a component that owned the request would have chosen a transport, an
  auth scheme and an error vocabulary on the product's behalf.
- Anything the kit says with FILL alone is invisible under `forced-colors`,
  which drops backgrounds AND box-shadows — so the focus ring goes too. The
  block at the foot of `components.css` restates each such state with a border,
  an outline or a system colour; a new component whose selected state is a
  background belongs in that list.
- `linear-gradient` takes physical directions, so it is the one thing logical
  properties do not mirror for free. The slider's filled rail is corrected once
  under `[dir='rtl']`; a new gradient that carries meaning needs the same.
- A RUN in `Chat` — consecutive messages from one speaker within `runGap` — is
  what makes a transcript read like a conversation instead of a log. The avatar
  gutter is held open through the whole run and only the LAST bubble gets a face
  and a tail; the name and the timestamp belong to the run, not to each message.
  Do not move either back onto every bubble.
- A retracted message keeps its bubble and says it is gone. Removing the row
  leaves the reply above it answering nothing.
- `Chat` renders the per-message menu and calls back; it never decides what
  reply, forward, pin or delete DO. Same for `onReact`: the pill is a toggle
  over a count the caller owns.
- `AssistantThread` is not a variant of `Chat` and must not be merged into one.
  Bubbles are for short lines alternating quickly; a model's answer is a
  document, and a document does not go in a bubble. Its `content` is rendered
  as given — the kit parses no markdown and sanitises no HTML, because what a
  model's output may contain is a threat-model decision that belongs to the
  product, once, and not to a component making it silently for everyone.
- `Chart` assigns colour by series POSITION from `--nim-series-*`, never by
  meaning. The picture is `aria-hidden` and the numbers are a real table in the
  same figure — do not "improve" this into an alt string summarising a trend.
  Categories repeat (two Tuesdays, two regions named alike), so every list in
  the chart is keyed by index; keying by label silently drops marks.
- `MapView` ships no tiles, no key and no SDK: `tiles` is the product's picture
  and `attribution` is not optional decoration where a licence applies. Markers
  are placed by Web Mercator against the declared bounds, in percentages on
  `inset-inline-start`, so nothing has to be re-thought under RTL.
- `MediaPlayer` is a transport over a real `<audio>`/`<video>`, for the same
  reason chat is: the decoder, media keys, PiP and captions live there. Its
  scrubber is an `<input type="range">` — a dragged div loses Home, End, the
  arrows and the page keys. Full screen is requested on the FRAME so the
  transport goes with the picture.
- `Messenger`'s responsive switch is a container query and which room is open
  is the CALLER's `activeId` — the same state that decides which transcript to
  fetch. Do not mirror it into local state here.
- `--nim-shadow-focus` is a two-shadow value, so `box-shadow: inset var(…)` only
  insets the first half. Surfaces that cannot afford an outset ring use
  `outline` with a negative `outline-offset` instead.

## Verification

```bash
npm run typecheck && npm run lint && npm run build && npm run build:docs
```

## Docs duty

Token or component changes ⇒ update README.md contract section and rebuild the
gallery in the same task.

## Release duty

A version bump in `package.json` is not finished until, in the same task:

1. README.md gains a "What changed in X.Y" section for it.
2. `content/docs/nim-ui.json` and `content/fa/docs/nim-ui.json` in the sibling
   `nim-zone` repository gain a newest-first `changelog` entry
   and their `version` field matches it — the site generator fails the build
   when it does not — with `stats`, `status`, `use_cases`, and `roadmap`
   corrected wherever the release made them untrue.
3. `npm run build:docs` validates the gallery, and `npm run uikit` in the
   sibling `nim-zone` repository republishes it and regenerates the site.

The release checklist above is authoritative for this repository.
