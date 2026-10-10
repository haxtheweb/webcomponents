# HaxTheme_SimpleBlog

A HAXcms blog theme that pairs a bold header with a listing of recent posts.

- Package `@haxtheweb/simple-blog` 26.8.0

## Using it

A HAXcms theme. Select it in a site's `site.json` (`metadata.theme.element: "simple-blog"`). The preview boots the theme's own demo site with `haxcms-site-builder`; the site ships under `runtime/sites/simple-blog/`.

Themes extend `HAXCMSLitElement` with DDD and must follow the theme-header contract in the pattern library.

## DDD usage

Its source references 25 distinct design-system variables. By family: font (29), accent (21), spacing (20), theme (4), primary (4), radius (2). Most used: `--ddd-accent-6`, `--ddd-spacing-8`, `--ddd-font-weight-bold`, `--ddd-font-size-xs`, `--ddd-font-body`, `--ddd-primary-4`.
