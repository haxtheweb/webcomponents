DDD is the design system under everything in HAXTheWeb: web components, HAXcms themes, docs and tooling. It is a set of CSS custom properties, a reset that styles plain HTML, and HAX data attributes that let authors theme a block without writing CSS. It aims to be clear, academic-professional, high-contrast and accessible in light and dark.

## Using DDD

- In a web component, import `@haxtheweb/d-d-d/d-d-d.js` and extend `DDD` (or `DDDSuper(...)` in a mixin chain). `super.styles` brings the variables, reset and data attributes.
- Style with `var(--ddd-…)` tokens: fonts, colours, spacing, radii, borders, shadows and icon sizes. Never hardcode a value DDD already names.
- Prefer the token directly over a local alias. Add a component alias only at a theming boundary (`--my-card-bg: var(--ddd-accent-2)`).
- SimpleColors is a fallback only, for a hue or shade DDD lacks. Migrate SimpleColors usage to DDD when you touch a component.
- Run `hax audit` before shipping a component or theme. Check it in dark mode too.

## Colour

DDD has three layers.

1. **Base palette.** `--ddd-theme-default-<name>`: brand colours with campus names (`beaverBlue`, `nittanyNavy`, `keystoneYellow`…), their `Light` and `MaxLight` tints, translucent steps (`navy70`, `potential50`), and functional colours (`link`, `error`, `warning`, `info`, `success` and their `Light` pairs).
2. **Numbered scales.** `--ddd-primary-0…25` alias the strong colours and `--ddd-accent-0…14` alias the pale tints. These are what authors pick in HAX.
3. **Live theme slots.** `data-primary="N"` sets `--ddd-theme-primary`, and `data-accent="N"` sets `--ddd-theme-accent`. Components read the slots, never a specific number: `border-color: var(--ddd-theme-primary)`.

Rules:

- Body ink is `ddd-theme-default-coalyGray` on `white`. Headings and titles on cards use `nittanyNavy`.
- Links are `ddd-theme-default-link` (6.5:1 on white), bold, and not underlined until hover. In dark mode links use `linkLight` and are always underlined.
- Primary actions use a `nittanyNavy` fill with white text. On hover or focus they shift to `--ddd-theme-primary` (default `beaverBlue`).
- Text on a `--ddd-theme-primary` fill uses `--ddd-theme-bgContrast` (white) or `--lowContrast-override` (black). DDD sets one of these per primary. Every `ddd-primary-N` note says which one, with both ratios.
- `pughBlue`, `limestoneGray`, `athertonViolet`, `inventOrange`, `keystoneYellow`, `futureLime` and `globalNeon` are fills. Never set them as text on white or on the accents; the source flags each of these.
- Accents are pale block backgrounds behind body text: callouts, highlighted lists, `data-accent` paragraphs. Do not use them as text colours.
- Status colours come in pairs: `error`/`errorLight`, `warning`/`warningLight`, `info`/`infoLight`, `success`/`successLight`. Put the dark one on the light one, and always add a word or icon too. The four status darks are all deep and close in lightness, so colour alone does not tell them apart.
- Gradients are navy-to-blue only (`ddd-theme-default-gradient-*`). Use them for nav bars, footers, hero scrims and `type1` hero words.
- Use `data-primary`/`data-accent` for single-colour theming of a block. Use `data-palette` for a coordinated 7-colour palette across a region or site (see Palettes). These tools do different jobs; one is not a substitute for the other.

### SimpleColors

SimpleColors is DDD's extended palette. Reach for it only when DDD has no workable colour: charts, instructional-action icons, palettes and the `accent-color` attribute many elements still accept.

- 19 hues (`red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`, `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`, `yellow`, `amber`, `orange`, `deep-orange`, `brown`, `grey`, `blue-grey`), 12 shades each, from 1 (palest) to 12 (deepest).
- `--simple-colors-default-theme-<hue>-<n>` flips in dark mode: shade n becomes shade 13−n. Use it for UI that should follow the scheme. `--simple-colors-fixed-theme-<hue>-<n>` never flips. Use it where a colour must stay put, like brand fills, charts and palette swatches.
- `--simple-colors-default-theme-accent-<n>` follows an element's `accent-color` attribute; with none set it is grey. Shade 7 is the element's native CSS `accent-color`.
- Contrast rule from the source: put text from the far end of the scale on a fill. Shades 1–6 take shades 7–12 (8–12 for small text), and vice versa. Grey pairs are a little more permissive.
- Instructional actions take their colour from shade 8 of a fixed hue per action: Reflect is amber, Watch is pink, Quiz is blue, and so on.

### Dark mode

DDD sets `color-scheme: light dark` and resolves colour pairs with `light-dark()` inside components. The base palette does not change. The `ddd-scheme-*` tokens name the exact pairs DDD's own CSS uses (surface, ink, heading, border, link, summary, code, pre), so their Dark values are the real dark-mode values. Use them when a new component needs the same switch. `body.dark-mode` forces dark.

Measured contrast for the scheme pairs: ink on surface is 15.1:1 in both themes. Heading is 16.6 (light) and 15.1 (dark). Link is 6.5 and 12.0. Summary ink on summary background is 14.8 and 16.1. Code is 16.7.

## Typography

- Three families: `--ddd-font-primary` (Roboto, with Franklin Gothic Medium and Tahoma fallbacks) for everything by default; `--ddd-font-secondary` (Roboto Slab) when a theme or block opts in with `.ddd-font-secondary` or `data-font-family="secondary"`; `--ddd-font-navigation` (Roboto Condensed) for nav, breadcrumbs and button labels. All three load from Google Fonts at weights 300, 400, 500, 700 and 900.
- Headings `h1`–`h6` are Roboto bold, line-height normal, sized from `--ddd-theme-h1…h6-font-size` (40, 32, 28, 24, 22, 20). Themes resize headings through those variables, not with new values.
- Body text is `--ddd-theme-body-font-size` (20px) at `--ddd-lh-150`. Use `--ddd-font-size-4xs` (16px) for card descriptions, captions and tooltips.
- Pick sizes only from the `--ddd-font-size-*` scale (12 → 72, then `type1` at 80/150/200). Pair a size with its letter-spacing token `--ddd-ls-<px>-sm` or `-lg`.
- Display: `h1.type1` is black weight (900), white, centered over a gradient. `h2.type2` is 72px Beaver blue. `h2.type3` is 56px Nittany navy.

## Spacing and layout

- Use the 4px scale `--ddd-spacing-0…30` (0–120px) for every margin, padding and gap. Gutters are about `--ddd-spacing-6` (24px).
- Reset rhythm: `h1` has `spacing-12` above and `spacing-8` below. `h2`–`h6` have `spacing-8` above and `spacing-4` below. Paragraphs have `spacing-6` vertical margin. List items are `spacing-3` apart.
- Breakpoints are 360, 768, 1080 and 1440 (`--ddd-breakpoint-*`). Write the literal px in `@media`. The HAX `data-width`, `data-padding` and `data-margin` attributes only apply from 600px up.
- Size icons with `--ddd-icon-*` (16–96px), not spacing tokens. On `simple-icon-lite`, set `--simple-icon-width` and `--simple-icon-height` to the token. Inline icons are `icon-xs` (32px); button icons are `icon-sm` (40px). The Foundations › Icon sizing card shows every size on a real icon.
- Inputs and selects are `--ddd-textfield-height-md` (48px) by default. `sm` (40px) still clears the WCAG 2.5.8 minimum.

## Shape, borders, depth

- Small controls, code and mark use `radius-xs`/`sm`. Containers and cards use `md`/`lg`/`xl`; `ddd-card` uses `xl` (20px). Pills and icon buttons use `rounded`; step numbers and avatars use `circle`. Keep one corner family per component.
- Borders are `--ddd-border-xs…lg`: 1–4px solid `limestoneLight`. Recolour a border with `border-color: var(--ddd-theme-primary)`.
- Prefer borders and tonal separation to shadows. When hierarchy needs depth, use `--ddd-boxShadow-sm…xl`. Dark mode swaps the navy shadow for a faint Pugh-blue glow, so elevation stays visible.
- Heading treatments: `data-design-treatment="vert"` adds a primary-coloured left rule. `horz-*` adds a primary underline, 4px thick and 84px long by default (`10p`, `25p`, `50p`, `full`, `md`, `lg` change the length). `bg` fills the heading with the primary colour.

## Focus, motion, layering

- Focus is `--ddd-focus-ring` (2px solid `link`) at `--ddd-focus-offset` (2px). It is 6.5:1 on white. On dark surfaces use `linkLight`.
- Transitions run `150ms`/`300ms`/`600ms` (`--ddd-duration-fast/normal/slow`) on `--ddd-timing-ease` (cubic-bezier(0.4, 0, 0.2, 1)). HAX attribute changes animate at 0.3s ease-in-out.
- Layers: `--ddd-z-dropdown` 100, `sticky` 200, `overlay` 300, `tooltip` 500, `modal` 10000.

## Content

HAX is educational. Plain HTML authored in HAX should look designed without classes, so the reset styles `h1`–`h6`, `p`, lists, `blockquote`, `details`/`summary`, `code`, `pre`, `mark`, `abbr`, tables and `dl` directly.

- Name things the way the source does. Colour names are sentence case ("Beaver blue", "Keystone yellow"). Option labels are short ("Rounded", "Rounder", "Roundest"; "Drop shadow").
- Instructional headings use `data-instructional-action` with a learning verb or noun. Verbs: Connection, Did You Know?, Learning Strategy, Discuss, Listen, Make, Observe, Present, Read, Reflect, Research, Watch, Write. Nouns: Content, Assessment, Quiz, Submission, Lesson, Module, Task, Activity, Project, Practice, Unit, Learning Objectives. Each one draws its icon before the heading in a fixed colour.
- Card buttons default to the label "Explore" followed by ">". Lists of links (`ul.link-list`) end each item with a chevron.

## Iconography

- Icons come from the HAX iconsets (`hax:`, `lrn:`, `courseicons:`, `icons:`) through `simple-icon-lite`, and `simple-icon-button-lite` for icon-only actions. `-lite` icons inherit `color` from light DOM. Prefer them over `simple-icon`.
- Size icons with `--ddd-icon-*`. Instructional-action icons are `icon-sm` masks filled with `--ddd-theme-primary`.

## Components

Every element in the webcomponents monorepo that extends DDD has a card here, rendered live from the published 26.8 build. Two are the exceptions: `app-hax` is documented without a preview, and `awesome-explosion` is left out because it does not work. The Components view runs Foundations first, then Design system, Cards and callouts, Actions and navigation, Learning, Media, Data and documents, Layout and Forms and authoring. Themes come last, as their own section. Each README gives the HAX settings the consumer provides, real usage markup and the DDD variables the source uses.

- Build new elements on `DDD`; reuse an existing card before inventing one. The pattern library (Foundations › Pattern library) shows how they compose into molecules, organisms and templates.
- Honour the authoring attributes (`data-primary`, `data-accent`, `data-palette`, `data-design-treatment` and the rest) rather than adding parallel props.
- Themes extend `HAXCMSLitElement`, render through `haxcms-site-builder` and follow the theme-header contract. Each theme card boots that theme's demo site.
- Foundations cards render `d-d-docs` itself, one topic each, so they always match the shipping style guide.

### How the previews run

- `components/bundle.js` (namespace `DDD`) holds the real elements, bundled from the published build. Two very large elements, `sheet-music` and `slide-deck`, load from `components/lib/` instead.
- Assets the elements fetch at runtime ship under `runtime/`: `icons/` holds every iconset as data URIs, `nm/` the helper scripts (Chartist, QR, Lunr), `sites/` the theme demo sites, and `data/` and `media/` the demo files.
- Elements that call outside services can't reach them in a preview. These are github-preview, linkedin-embed, wikipedia-query, web-container, the installer, YouTube media and the chat agent's AI. Each README says what you'll see.

## Intentional additions

- `ddd-scheme-*` colours do not exist as variables in DDD. They name the `light-dark()` pairs DDD's CSS writes inline, so a design tool can show the dark theme. In code, keep writing `light-dark(var(--ddd-theme-default-…), …)` with the same pair.

## Known gaps

- The source does not agree on what DDD stands for. The docs site says "Develop, Design, Destroy!". The package README says "design, develop, destroy the competition". The PRAW skill says "Design, Develop, Deliver".
- The PRAW guidance says headlines are set in Roboto Slab. The reset sets `h1`–`h6` in `--ddd-font-primary` (Roboto). This system follows the code.
- The comment on `--ddd-font-size-3xs` says "body default" (18px). The applied body size is `--ddd-theme-body-font-size` = `xxs` (20px).
- PRAW notes mention `--ddd-inset-*`, `--ddd-gap-*`, `--ddd-text-*` and `--ddd-duration-instant/rapid`. None of these exist in `DDDStyles.js`, so do not use them.
- SimpleColors' JavaScript colour table disagrees with its CSS for two shades: `cyan-1` (#ddf8ff in JS, #ccf3fd in CSS) and `teal-1` (#d9fff0 vs #d4ffee). Dark mode uses the JS values for cyan-12 and teal-12. Tokens here follow the CSS that renders.
- Palette `wisdom-walk-green` text-color-4 fails contrast, as its own source notes.
- The source's own "logical gaps" are still open: heading colour pairings, when to use a chevron with links, gradient rotation, and the "//" after headers. They are tracked as recipe-only atoms in the pattern library.
