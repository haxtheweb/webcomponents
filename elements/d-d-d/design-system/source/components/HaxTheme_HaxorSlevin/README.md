# HaxTheme_HaxorSlevin

Tech blogger theme.

- Package `@haxtheweb/haxor-slevin` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "haxor-slevin"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/haxor-slevin/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 12 distinct design-system variables. By family: theme (22), spacing (5), icon (4), font (2), boxShadow (1). Most used: `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-theme-default-link`, `--ddd-icon-sm`, `--ddd-theme-default-beaverBlue`, `--ddd-spacing-6`.
