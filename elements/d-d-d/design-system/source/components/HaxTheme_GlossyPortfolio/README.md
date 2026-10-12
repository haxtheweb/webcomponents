# HaxTheme_GlossyPortfolio

A HAXcms portfolio theme with a dark, glossy look across a home page, project grid and about/contact pages.

- Package `@haxtheweb/glossy-portfolio-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "glossy-portfolio-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/glossy-portfolio-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 9 distinct design-system variables. By family: font (9), theme (3). Most used: `--ddd-theme-default-white`, `--ddd-font-size-xxs`, `--ddd-font-size-3xs`, `--ddd-font-size-ms`, `--ddd-font-size-3xl`, `--ddd-font-size-l`.
