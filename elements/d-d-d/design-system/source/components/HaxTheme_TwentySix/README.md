# HaxTheme_TwentySix

HAXcms Twenty Fifteen inspired blog theme.

- Package `@haxtheweb/twenty-six-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "twenty-six-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/twenty-six-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 48 distinct design-system variables. By family: spacing (37), font (19), palette (15), simple-colors (13), theme (11), border (8). Most used: `--ddd-theme-default-black`, `--ddd-spacing-4`, `--ddd-spacing-8`, `--ddd-spacing-5`, `--ddd-font-navigation`, `--ddd-spacing-10`.
