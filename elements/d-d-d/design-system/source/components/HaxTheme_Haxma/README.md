# HaxTheme_Haxma

HAXma theme for HAXcms inspired by Figma documentation design.

- Package `@haxtheweb/haxma-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "haxma-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/haxma-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 11 distinct design-system variables. By family: spacing (42), theme (14). Most used: `--ddd-spacing-4`, `--ddd-spacing-8`, `--ddd-spacing-2`, `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-theme-default-black`.
