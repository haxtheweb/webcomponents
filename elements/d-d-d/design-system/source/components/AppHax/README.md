# AppHax

HAX and HAXcms as a full application: the site dashboard, site creation and the editing experience.

- Package `@haxtheweb/app-hax` 26.8.0

## Using it

`<app-hax>` needs a HAXcms backend for its dashboard and site creation. It has no preview here: alone it bundles to about 3.8 MB, more than this system can carry, and it renders nothing useful without a backend.

## DDD usage

Its source references 43 distinct design-system variables. By family: theme (72), spacing (45), font (28), icon (12), border (10), radius (7). Most used: `--ddd-theme-default-white`, `--ddd-spacing-2`, `--ddd-theme-default-coalyGray`, `--ddd-font-primary`, `--ddd-theme-default-slateGray`, `--ddd-theme-default-keystoneYellow`.
