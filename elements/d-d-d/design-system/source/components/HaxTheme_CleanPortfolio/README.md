# HaxTheme_CleanPortfolio

A clean HAXcms portfolio theme with a boxed site title, top navigation and large serif page headings.

- Package `@haxtheweb/clean-portfolio-theme` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "clean-portfolio-theme"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/clean-portfolio-theme/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 29 distinct design-system variables. By family: palette (71), lightDark (42), theme (4), boxShadow (4), spacing (3), icon (2). Most used: `--ddd-palette-light`, `--ddd-lightDark-text`, `--ddd-lightDark-1`, `--ddd-palette-5`, `--ddd-palette-2`, `--ddd-palette-4`.
