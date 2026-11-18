# papermod-theme

Twelve HAXcms themes that pay homage to well known Hugo, Jekyll and Astro themes. Each is an ordinary HAXcms theme: it works with the editor like any other, and a site's pages stay the same when the theme changes.

They are layouts over parts HAXcms already ships, styled with DDD tokens. None adds a design system of its own.

## Themes

Single column: a header with the site name, the top level pages and the tools, over one centered column.

| Tag | Name | Pays homage to | What sets it apart |
|---|---|---|---|
| `papermod-theme` | PaperMod | PaperMod (Hugo) | tinted page, section pages as rounded cards |
| `minima-theme` | Minima | Minima (Jekyll) | heavy rule over the header, pages listed by date |
| `astropaper-theme` | AstroPaper | AstroPaper (Astro) | monospace headings on a warm page, accent titles |
| `astro-cactus-theme` | Astro Cactus | Astro Cactus (Astro) | navigation under the site name, one line per page |
| `coder-theme` | Coder | Coder (Hugo) | spare header, one line per page |
| `terminal-theme` | Terminal | Terminal (Hugo) | dark by design, monospace, orange accent |
| `al-folio-theme` | al-folio | al-folio (Jekyll) | fixed top bar, wide column, light headings |
| `astrowind-theme` | AstroWind | AstroWind (Astro) | fixed top bar, widest column, pages as a grid of cards |

Sidebar: a fixed column with the site name, its description, the site menu and the tools, beside the page.

| Tag | Name | Pays homage to | What sets it apart |
|---|---|---|---|
| `hyde-theme` | Hyde | Hyde (Jekyll) | dark sidebar with its contents at the foot |
| `chirpy-theme` | Chirpy | Chirpy (Jekyll) | tinted sidebar, on this page column, pages as cards |
| `minimal-mistakes-theme` | Minimal Mistakes | Minimal Mistakes (Jekyll) | top bar, slim sidebar, on this page column |
| `astrofy-theme` | Astrofy | Astrofy (Astro) | centered sidebar, page on a rounded surface |

## How they are built

| File | What it is |
|---|---|
| `lib/HomageThemeBase.js` | What every theme shares: page head, content slot, the list of pages under the active page, previous and next, search, the dark mode switch, the footer region |
| `lib/HomageColumnTheme.js` | The single column layout |
| `lib/HomageSidebarTheme.js` | The sidebar layout |
| `lib/homage-page-list.js` | The pages under the active page, as title, date and description: a post index or the contents of a section |
| `papermod-theme.js`, `lib/<tag>.js` | One theme each: a layout, a few options, and its `--homage-*` colors, fonts and widths |

A page with pages under it lists them after its own content, so a "Posts" page becomes the post index with no block to add. A page inside a section shows the date it was written under its title.

## Attribution

Each theme credits the theme it honors in its source and in `NOTICE`. No code, styles or assets from those themes are used. These are independent HAX themes, not affiliated with or endorsed by their authors.
