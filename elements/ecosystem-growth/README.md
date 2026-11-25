# ecosystem-growth

How a project grew over time, and what its reuse saves, drawn as a crystal. Built for [hax.cloud](https://hax.cloud) beside [`ecosystem-web`](../ecosystem-web) (it adds a lens, it doesn't replace the web), and usable on any HAX site that points it at the data.

It reads the growth data layer PRAW publishes at `https://hax.cloud/data/growth/` ([haxtheweb/issues#3409](https://github.com/haxtheweb/issues/issues/3409)): `repos.json`, `themes.json`, `elements.json`, `payload.json` and `series.json`. Nothing is baked into the element; point `src` at another folder with the same files to draw another project.

```html
<ecosystem-growth src="https://hax.cloud/data/growth/"></ecosystem-growth>
```

## Views

One time slider and Play drive every view.

- **Themes**: every theme appears in the order it was made and bonds to the shared theme core; families (homage, book) branch off their own base. Hexagons are drawn to scale (area is gzipped code), so select a theme to see it against the core, and what it costs to load cold or after another site.
- **Elements**: every element package, the most depended-on in the middle, with their dependency links; select one to see what it depends on (orange) and what uses it (blue).
- **Platforms**: the network-bar properties in their network colours and the runtimes, around site.json. Size grows with commits; a ring pulses with each month's activity.
- **Cache**: a visitor moving site by site and page by page (same site vs next site), or theme by theme, on one host: which files are fetched and which come from the cache.
- **Growth over time**: every series on one axis, log or linear, each series on or off, with the figures in a table under it.

## Properties

| Attribute | Default | What it does |
| --- | --- | --- |
| `src` | `https://hax.cloud/data/growth/` | Folder holding the five growth JSON files. |
| `view` | `themes` | The view that opens first: `themes`, `elements`, `platforms` or `cache`. |

## For agents (WebMCP)

Where the browser offers `document.modelContext`, the element registers four read-only tools over the same model the drawing uses, and withdraws them when it leaves the page ([haxtheweb/issues#3131](https://github.com/haxtheweb/issues/issues/3131)):

- `growth_series`: a monthly series between two months.
- `growth_theme_cost`: a theme's own code against the core, and what it fetches with other themes already cached.
- `growth_element_dependencies`: what an element depends on and what uses it.
- `growth_simulate_journey`: bytes needed, fetched and cached for each step of a visitor's path across sites and pages.

## Accessibility

Every figure the drawing shows is also in the panel as text, and the chart's figures are in a table. Buttons are 44px, the slider is a native range with the date as its value text, colour is never the only signal (the chart's lines also differ by dash), and with reduced motion nothing animates until you press Play.

## Commands

- `yarn run build`: format, analyze and write `lib/ecosystem-growth.docs.json`
- `yarn run test`: run the tests (headless Chromium through web-test-runner)

The demo ships a snapshot of the growth data in `demo/growth/`.
