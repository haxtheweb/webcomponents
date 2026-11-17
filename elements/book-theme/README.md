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

## Attribution

The layout pays homage to the [Hugo Book](https://github.com/alex-shpak/hugo-book) theme by Alex Shpak (MIT). No code, styles or assets from Hugo Book are used. See `NOTICE`. This is an independent HAX theme, not affiliated with or endorsed by its author.
