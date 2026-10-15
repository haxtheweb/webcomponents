# HaxTheme_Spacebook

A HAXcms notes and blog theme inspired by the 11ty SpaceBook starter, with a collapsible sidebar, search modal and dark mode.

- Package `@haxtheweb/spacebook-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "spacebook-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/spacebook-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 11 distinct design-system variables. By family: theme (12), simple-colors (7). Most used: `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-theme-default-limestoneMaxLight`, `--ddd-theme-default-limestoneLight`, `--simple-colors-default-theme-grey-2`, `--simple-colors-default-theme-grey-5`.
