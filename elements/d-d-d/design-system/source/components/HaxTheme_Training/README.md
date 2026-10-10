# HaxTheme_Training

Theme for training content in HAXcms.

- Package `@haxtheweb/training-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "training-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/training-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 43 distinct design-system variables. By family: spacing (55), theme (47), font (33), lh (9), radius (4), boxShadow (1). Most used: `--ddd-spacing-0`, `--ddd-theme-default-white`, `--ddd-theme-default-slateLight`, `--ddd-spacing-4`, `--ddd-spacing-2`, `--ddd-font-size-6xs`.
