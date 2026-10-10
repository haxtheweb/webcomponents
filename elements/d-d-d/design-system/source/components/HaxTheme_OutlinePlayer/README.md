# HaxTheme_OutlinePlayer

A HAXcms theme for outlined documentation: a navigation drawer mirroring the outline, content in the centre, and search, print and paging controls.

- Package `@haxtheweb/outline-player` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "outline-player"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/outline-player/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 6 distinct design-system variables. By family: accent (16), primary (12), font (3), theme (1). Most used: `--ddd-accent-6`, `--ddd-primary-4`, `--ddd-font-navigation`, `--ddd-font-weight-light`, `--ddd-font-size-3xs`, `--ddd-theme-default-linkLight`.
