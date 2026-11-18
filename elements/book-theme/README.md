# book-theme

Book is a quiet documentation theme for HAXcms. The site menu runs down the left, the page sits in the middle, and the headings of the active page run down the right.

## What it is made of

The theme is a layout over parts HAXcms already ships, styled with DDD tokens. It adds no design system of its own, so a site can pair it with any DDD-capable design system.

| Part | Element |
|---|---|
| Site name | `site-title` |
| Search | `site-modal` with `site-search` |
| Site menu | `site-menu` |
| Breadcrumb, title, tags | `site-breadcrumb`, `site-active-title`, `site-active-tags` |
| On this page | `site-menu-content` |
| Last updated | `simple-datetime` |
| Previous and next | `site-menu-button` |
| Footer | `site-region` named `footerPrimary` |

## Layout

- Above 1200px: three columns, in a container capped at `--book-theme-container-width`.
- 1200px and below: the on this page list folds into a button above the page title.
- 900px and below: the site menu overlays the page, opened from a short header. Escape or the scrim closes it.

Widths are set by `--book-theme-menu-width`, `--book-theme-toc-width` and `--book-theme-container-width`.

## Themes built on Book

`lib/` holds four more documentation themes that extend `book-theme` with its two layout options and their own colors.

| Tag | Name | Pays homage to | What sets it apart |
|---|---|---|---|
| `just-the-docs-theme` | Just the Docs | Just the Docs (Jekyll) | tinted menu column, on this page list kept in its button |
| `handbook-theme` | Handbook | Docsy (Hugo) | solid top bar, ruled columns |
| `manual-theme` | Manual | Docusaurus classic | light top bar, green accent, previous and next as cards |
| `guidebook-theme` | Guidebook | Starlight (Astro) | slim top bar, violet accent |

Options a theme built on Book sets in its constructor: `bookLayout = "topbar"` keeps the header on every screen size and moves the site name, search and dark mode switch into it; `tocFold = true` keeps the on this page list in its button at every width.

## Attribution

The layout pays homage to the [Hugo Book](https://github.com/alex-shpak/hugo-book) theme by Alex Shpak (MIT). No code, styles or assets from Hugo Book are used. The themes in `lib/` credit the themes they honor the same way. See `NOTICE`. This is an independent HAX theme, not affiliated with or endorsed by its author.
