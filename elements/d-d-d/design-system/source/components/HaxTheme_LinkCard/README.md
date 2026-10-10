# HaxTheme_LinkCard

HAXcms link-card theme for single-page personal profile and menu-link.

- Package `@haxtheweb/link-card-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "link-card-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/link-card-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 35 distinct design-system variables. By family: spacing (27), palette (10), font (9), border (8), radius (7), theme (6). Most used: `--ddd-border-sm`, `--ddd-spacing-4`, `--ddd-spacing-30`, `--ddd-radius-circle`, `--ddd-spacing-3`, `--ddd-palette-color-5`.
