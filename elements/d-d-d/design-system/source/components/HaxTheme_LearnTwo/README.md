# HaxTheme_LearnTwo

Learn2 theme for HAXcms.

- Package `@haxtheweb/learn-two-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "learn-two-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/learn-two-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 21 distinct design-system variables. By family: theme (48), spacing (8), icon (4), font (4), boxShadow (1), radius (1). Most used: `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-theme-default-limestoneLight`, `--ddd-theme-default-potentialMidnight`, `--ddd-icon-xl`, `--ddd-theme-default-link`.
