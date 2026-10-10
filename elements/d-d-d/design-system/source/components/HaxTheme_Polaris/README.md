# HaxTheme_Polaris

A polaris PSU based branding styled theme.

- Package `@haxtheweb/polaris-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "polaris-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/polaris-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 55 distinct design-system variables. By family: theme (104), spacing (36), font (35), palette (32), accent (8), primary (6). Most used: `--ddd-theme-default-nittanyNavy`, `--ddd-theme-default-white`, `--ddd-spacing-2`, `--ddd-font-navigation`, `--ddd-theme-default-coalyGray`, `--ddd-accent-6`.
