# HaxTheme_Resume

Single-page résumé theme for HAXcms.

- Package `@haxtheweb/resume-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "resume-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/resume-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 33 distinct design-system variables. By family: theme (42), spacing (32), font (15), radius (7), focus (4), boxShadow (2). Most used: `--ddd-theme-default-white`, `--ddd-spacing-4`, `--ddd-spacing-8`, `--ddd-spacing-6`, `--ddd-radius-circle`, `--ddd-theme-default-pughBlue`.
