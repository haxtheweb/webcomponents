# HaxTheme_Chamfer

Fixed-width HAXcms theme with a left navigation column and a chamfered.

- Package `@haxtheweb/chamfer-theme` 26.8.1

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "chamfer-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/chamfer-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 17 distinct design-system variables. By family: spacing (21), theme (12), font (3), border (2), icon (2). Most used: `--ddd-spacing-0`, `--ddd-theme-default-coalyGray`, `--ddd-spacing-4`, `--ddd-theme-default-white`, `--ddd-theme-default-limestoneLight`, `--ddd-spacing-2`.

## Preview notes

A fixed-width theme; at narrow preview widths its body column is cropped.
