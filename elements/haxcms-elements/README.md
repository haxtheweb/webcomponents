# `@haxtheweb/haxcms-elements`

The HAXcms front-end — a collection of ~90 web components that deliver a full content management system built on HAX. Importing the single entry point bootstraps the CMS: a MobX-backed site store, a router, a site editor/builder, the outline editor, admin dialogs, and backend adapters. Themes extend `HAXCMSLitElementTheme` and compose `site-*` UI components to render published content and the in-place authoring experience.

## Install / Import

```bash
npm i @haxtheweb/haxcms-elements
```

```js path=null start=null
// Bootstrap the CMS core: backends, editor, builder, router, store
import '@haxtheweb/haxcms-elements/haxcms-elements.js';
```

The entry point (`haxcms-elements.js`) imports the beaker/demo/php backends, the editor builder, outline editor dialog, site builder, site editor UI, site editor, site router, and site store. A running site mounts `<haxcms-site-builder file="site.json">`, which loads the JSON Outline Schema manifest and renders the active theme.

Individual components can be imported on their own from their `lib/` paths (see the inventory below for module paths).

## Architecture

The package is organized into two layers under `lib/`:

- **`lib/core/`** — the CMS engine. The MobX `store`, router, site editor/builder, admin dialogs, backend adapters, built-in themes, and the `HAXCMSLitElementTheme` base class that all themes extend.
- **`lib/ui-components/`** — the `site-*` building blocks that themes compose: navigation, layout, active-item widgets, content blocks, query/render helpers, routes, and "magic" dynamic views.

State flows through a single MobX store (`lib/core/haxcms-site-store.js`, exported as `store`). `HAXCMSLitElementTheme` uses `autorun`/`toJS` to mirror `store.editMode`, `store.activeItemContent`, `store.isLoggedIn`, and `store.location` onto reactive properties, so every theme instance stays in sync with the CMS without manual event wiring. The `HAXCMSTheme` mixin (`lib/core/HAXCMSThemeWiring.js`) connects a theme's `contentContainer` to the site editor and listens for the global `haxcms-active-item-changed`, `haxcms-edit-mode-changed`, and `haxcms-trigger-update` events.

## Themes

All themes extend `HAXCMSLitElementTheme` (which extends `HAXCMSTheme(ResponsiveUtilityBehaviors(LitElement))`). The base class establishes the content-slot contract — a `#contentcontainer > #slot > <slot>` structure — and hides the slot during `edit-mode` so the HAX editor takes over rendering.

| Tag | Module | Notes |
|---|---|---|
| `haxcms-basic-theme` | `lib/core/themes/haxcms-basic-theme.js` | Reference theme; composes `site-top-menu`, `site-breadcrumb`, `site-menu-button`, `site-active-title`, `site-children-block`, `site-footer`, `site-modal`, `scroll-button`. |
| `haxcms-blank-theme` | `lib/core/themes/haxcms-blank-theme.js` | Empty canvas for custom theme development. |
| `haxcms-custom-theme` | `lib/core/themes/haxcms-custom-theme.js` | User-customizable theme. |
| `haxcms-json-theme` | `lib/core/themes/haxcms-json-theme.js` | Theme driven by JSON Outline Schema theme variables. |
| `haxcms-print-theme` | `lib/core/themes/haxcms-print-theme.js` | Print-optimized layout. |
| `haxcms-slide-theme` | `lib/core/themes/haxcms-slide-theme.js` | Presentation/slide layout. |
| `haxcms-dev-theme` | `lib/development/haxcms-dev-theme.js` | Developer/testing theme. |

### Theme base class contract

A theme extends `HAXCMSLitElementTheme` and must define a `#contentcontainer` wrapping a `#slot` wrapping the default `<slot>`. The base class provides:

- Reactive properties: `editMode`, `trayStatus`, `isLoggedIn`, `emptyContent`, `color`, `hexColor`, `contentContainer`, `_location`, `responsiveSize`.
- `HAXCMSThemeSettings` bucket: `autoScroll`, `scrollTarget`, `scrollSettings`, `locationStartViewTransition`.
- `HAXCMSGlobalStyleSheetContent()` — global styles rendered into `store.themeStyleElement` (copyable headings, editable-table display styles).
- Heading click-to-copy-anchor-link behavior.
- Skip-link, `prefers-reduced-motion`, and responsive content min-heights.
- Events dispatched: `edit-mode-changed`, `is-logged-in-changed`, `content-container-changed`.

After modifying a theme, run `yarn run build` in the element directory to regenerate `custom-elements.json` — never hand-edit the manifest.

## Backends

Backend adapters in `lib/core/backends/` provide the storage layer for the CMS. The active backend is selected based on context (`globalThis.HAXCMSContext`).

| Tag | Module | Storage target |
|---|---|---|
| `haxcms-backend-php` | `lib/core/backends/haxcms-backend-php.js` | PHP HAXcms server. |
| `haxcms-backend-nodejs` | `lib/core/backends/haxcms-backend-nodejs.js` | Node.js HAXcms server. |
| `haxcms-backend-beaker` | `lib/core/backends/haxcms-backend-beaker.js` | Beaker browser (peer-to-peer / Dat). |
| `haxcms-backend-userfs` | `lib/core/backends/haxcms-backend-userfs.js` | Browser FileSystem API (local user storage). |
| `haxcms-backend-demo` | `lib/core/backends/haxcms-backend-demo.js` | In-memory demo backend (no persistence). |

## Element inventory

The following tables list every custom element in the package, grouped by the `lib/ui-components/` subdirectory (and `lib/core/`). "HAX" marks elements that ship `haxProperties` and can be dropped into authored content via the HAX editor; their gizmo title follows in parentheses. Module paths are relative to the package root.

### Layout (`lib/ui-components/layout/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `site-region` | `name`, `contentItemIds` | — | Named region for content injection. |
| `site-footer` | `siteTitle`, `manifest`, `editMode` | — | Site footer with title and manifest context. |
| `site-drawer` | `align`, `icon`, `opened` | — | Slide-in drawer panel. |
| `site-modal` | `disabled`, `dark`, `accentColor`, `title`, `icon`, `buttonLabel`, `position` | — | Modal dialog triggered by a button. |

### Active item (`lib/ui-components/active-item/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `site-active-title` | `icon`, `dynamicMethodology`, `editMode`, `activePageBreak` | — | Renders the active page's title. |
| `site-active-fields` | `fields` | — | Renders custom fields for the active page. |
| `site-active-tags` | `tags`, `autoAccentColor`, `accentColor`, `editMode` | — | Renders the active page's tags. |
| `site-active-media-banner` | `mediaSource`, `fileExt`, `mediaType`, `playing`, `canPlay`, `icon`, `description` | — | Media banner for the active page. |
| `site-git-corner` | `circle`, `size`, `activeGitFileLink`, `direction` | — | Git-corner link to the active page's source. |
| `site-share-widget` | `activeItem`, `show`, `alt`, `icon` | — | Social share widget for the active page. |

### Site (`lib/ui-components/site/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `site-title` | `siteTitle`, `homeLink`, `icon`, `notitle`, `disabled`, `editMode` | — | Site title link / logo. |
| `site-search` | `dataSource`, `whileLoading`, `showDate`, `showPath`, `hideInput`, `search` | — | Site-wide search input and results. |
| `site-print-button` | `icon`, `disabled`, `label`, `position`, `type` | — | Print button. |
| `site-rss-button` | `disabled`, `href`, `icon`, `type`, `position` | — | RSS feed button. |
| `site-remote-content` | `uuid`, `siteurl`, `player`, `showTitle`, `breakreference`, `hideReference` | HAX (Remote Content) | Reuse content from one site in another. |
| `site-uuid-link` | `uuid` | HAX (HAX link) | Link to a specific resource by UUID. |
| `site-random-content` | `page`, `editMode` | HAX (Random Page Content) | Display a random top-level element from a selected page. |

### Navigation (`lib/ui-components/navigation/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `site-menu` | `manifest`, `activeId`, `editMode` (and more) | — | Full site navigation menu. |
| `site-menu-button` | `icon`, `type`, `position`, `disabled` (and more) | — | Next/previous menu navigation button. |
| `site-menu-content` | — | — | Menu content wrapper. |
| `site-top-menu` | `manifest`, `activeId` (and more) | — | Top navigation bar. |
| `site-breadcrumb` | `manifest`, `activeId` (and more) | — | Breadcrumb trail of the active page. |
| `site-dot-indicator` | `manifest`, `activeId` (and more) | — | Dot indicator showing position in the outline. |

### Blocks (`lib/ui-components/blocks/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `site-outline-block` | `manifest`, `activeId`, `sticky`, `indicator`, `notitle`, `showindex` | — | Outline/navigation block. |
| `site-children-block` | `dynamicMethodology`, `start`, `end`, `parent`, `fixedId`, `editMode` | HAX (HAXcms: child block) | Dynamic block showing children of the current page. |
| `site-recent-content-block` | `limit`, `startIndex`, `sort`, `conditions`, `title`, `activeId` | — | Recent content listing block. |

### Query & render (`lib/ui-components/query/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `site-query` | `routerManifest`, `activeId`, `conditions`, `sort`, `limit`, `startIndex`, `random`, `entity`, `forceRebuild` | — | Query the manifest with conditions/sort/limit. |
| `site-query-menu-slice` | `start`, `end`, `parent`, `dynamicMethodology`, `fixedId`, `noDynamicLevel` | — | Slice the menu by level and parent. |
| `site-render-query` | `conditions`, `sort`, `grid` | — | Render query results, optionally as a grid. |

### Routes (`lib/ui-components/routes/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `site-home-route` | — | — | Home route handler. |
| `site-search-route` | `search` | — | Search UI route. |
| `site-tags-route` | `search`, `params`, `filteredItems`, `resultsTags` | — | Tag-filtered listing route. |
| `site-random-route` | — | — | Random page route. |
| `site-print-route` | `errorMessage` | — | Print route handler. |
| `site-theme-style-guide-route` | `styleGuideContent` | — | Theme style-guide route. |

### Magic / dynamic views (`lib/ui-components/magic/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `site-view` | — | HAX (Site View) | Dynamic view driven by query/conditions. |
| `site-collection-list` | — | HAX (Smart Collection) | Smart collection list. |
| `site-ai-chat` | — | — | AI chat integration. |
| `active-when-visible` | — | — | Activate content when it scrolls into view. |

### Lesson overview (`lib/ui-components/lesson-overview/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `lesson-overview` | — | HAX (Lesson Overview) | Lesson overview container. |
| `lesson-highlight` | — | HAX (Lesson Highlight) | Highlight block within a lesson. |

### Utilities & templates (`lib/ui-components/utilities/`, `lib/ui-components/templates/`)

| Tag | Key properties | HAX | Purpose |
|---|---|---|---|
| `site-available-themes` | `themes`, `loading`, `error`, `viewMode`, `showDetails`, `showAllThemes`, `columns`, `currentTheme` | HAX (Available Themes) | Gallery/table of available HAXcms themes with live preview. |
| `basic-template` | — | — | Template mixin used by the basic theme. |

### Core CMS (`lib/core/`)

| Tag | Module | Purpose |
|---|---|---|
| `haxcms-site-builder` | `lib/core/haxcms-site-builder.js` | Top-level site builder; loads the manifest and mounts the theme. |
| `haxcms-site-store` | `lib/core/haxcms-site-store.js` | MobX store singleton (`globalThis.HAXCMS.requestAvailability()`). |
| `haxcms-site-router` | `lib/core/haxcms-site-router.js` | Client-side router. |
| `haxcms-site-editor` | `lib/core/haxcms-site-editor.js` | In-place HAX editor integration. |
| `haxcms-site-editor-ui` | `lib/core/haxcms-site-editor-ui.js` | Editor toolbar/UI chrome. |
| `haxcms-editor-builder` | `lib/core/haxcms-editor-builder.js` | Builds the editor instance. |
| `haxcms-site-dashboard` | `lib/core/haxcms-site-dashboard.js` | Site dashboard. |
| `haxcms-site-settings-dashboard` | `lib/core/haxcms-site-settings-dashboard.js` | Site settings dashboard. |
| `haxcms-site-import-export-dashboard` | `lib/core/haxcms-site-import-export-dashboard.js` | Import/export dashboard. |
| `haxcms-site-insights` | `lib/core/haxcms-site-insights.js` | Site analytics/insights. |
| `haxcms-theme-picker` | `lib/core/haxcms-theme-picker.js` | Theme selector. |
| `haxcms-toast` | `lib/core/haxcms-toast.js` | Global toast notification. |
| `haxcms-darkmode-toggle` | `lib/core/haxcms-darkmode-toggle.js` | Dark-mode toggle. |
| `hax-router` | `lib/core/hax-router.js` | HAX app router. |
| `hax-file-actions` | `lib/core/hax-file-actions.js` | File action handler. |

#### Admin dialogs (`lib/core/`)

| Tag | Module | Purpose |
|---|---|---|
| `haxcms-content-admin-dialog` | `lib/core/haxcms-content-admin-dialog.js` | Page content admin. |
| `haxcms-outline-editor-dialog` | `lib/core/haxcms-outline-editor-dialog.js` | Outline / site structure editor. |
| `haxcms-seo-admin-dialog` | `lib/core/haxcms-seo-admin-dialog.js` | SEO settings. |
| `haxcms-appearance-admin-dialog` | `lib/core/haxcms-appearance-admin-dialog.js` | Appearance settings. |
| `haxcms-files-admin-dialog` | `lib/core/haxcms-files-admin-dialog.js` | File manager. |
| `haxcms-views-admin-dialog` | `lib/core/haxcms-views-admin-dialog.js` | Views configuration. |
| `haxcms-page-revisions-dialog` | `lib/core/haxcms-page-revisions-dialog.js` | Page revision history. |
| `haxcms-site-details-dialog` | `lib/core/haxcms-site-details-dialog.js` | Site details. |

#### Core UI (`lib/core/ui/`)

| Tag | Module | Purpose |
|---|---|---|
| `app-hax-top-bar` | `lib/core/ui/app-hax-top-bar.js` | App top bar. |
| `app-hax-user-menu` | `lib/core/ui/app-hax-user-menu.js` | User dropdown menu. |
| `app-hax-user-menu-button` | `lib/core/ui/app-hax-user-menu-button.js` | User menu trigger button. |
| `app-hax-user-menu-toggle` | `lib/core/ui/app-hax-user-menu-toggle.js` | User menu toggle. |
| `hax-confirm-dialog` | `lib/core/ui/hax-confirm-dialog.js` | Confirmation dialog. |
| `haxcms-about-dialog-ui` | `lib/core/ui/haxcms-about-dialog-ui.js` | About dialog. |
| `haxcms-allowed-blocks-ui` | `lib/core/ui/haxcms-allowed-blocks-ui.js` | Allowed blocks configuration. |
| `haxcms-editor-settings-dialog-ui` | `lib/core/ui/haxcms-editor-settings-dialog-ui.js` | Editor settings dialog. |
| `haxcms-page-get-started` | `lib/core/ui/haxcms-page-get-started.js` | Get-started onboarding. |
| `haxcms-site-platform-ui` | `lib/core/ui/haxcms-site-platform-ui.js` | Platform settings UI. |
| `haxcms-theme-preview-panel` | `lib/core/ui/haxcms-theme-preview-panel.js` | Theme live-preview panel. |
| `rpg-character-toast` | `lib/core/ui/rpg-character-toast/rpg-character-toast.js` | RPG character welcome toast. |
| `darkmode-toggle` | `lib/core/ui/darkmode-toggle/darkmode-toggle.js` | Standalone dark-mode toggle. |

#### Micros (`lib/core/micros/`)

| Tag | Module | Purpose |
|---|---|---|
| `haxcms-button-add` | `lib/core/micros/haxcms-button-add.js` | Add-content button micro. |
| `haxcms-page-operations` | `lib/core/micros/haxcms-page-operations.js` | Page operations micro. |

### Core utilities & mixins (`lib/core/utils/`)

Not custom elements, but shared infrastructure imported by the core and themes:

- `HAXCMSButton`, `HAXCMSI18NMixin`, `HAXCMSKeyboardShortcuts`, `HAXCMSMobileMenu`, `HAXCMSOperationButtons`, `HAXCMSRememberRoute`, `HAXCMSThemeParts`, `HAXCMSUserStylesMenu`
- Page-edit programs: `EditTitleProgram`, `EditSlugProgram`, `EditTagsProgram`, `EditDescriptionProgram`
- Export/share: `ExportPageProgram`, `ExportSiteProgram`, `SharePageProgram`, `PrintProgram`, `PageAsDataProgram`
- Mixins: `QRCodeMixin`, `PDFPageMixin`, `PrintBranchMixin`, `EmailPageMixin`, `LTIResizingMixin`
- Views: `haxcms-views-render-utility`, `haxcms-views-spec-utility`
- `haxcms-site-api-registry`, `site-skeleton-generator`, `import-export-options`

See `KEYBOARD_SHORTCUTS.md` for the full keyboard shortcut reference.

## HAX-capable elements

These nine elements ship `haxProperties` and can be dropped into authored content via the HAX editor:

| Tag | Gizmo | Icon | Description |
|---|---|---|---|
| `site-remote-content` | Remote Content | `hax:remote` | Reuse content from one site in another. |
| `site-uuid-link` | HAX link | `icons:link` | Link to a specific resource in the current site. |
| `site-random-content` | Random Page Content | `icons:shuffle` | Display a random top-level element from a selected page. |
| `site-children-block` | HAXcms: child block | `av:call-to-action` | Dynamic block showing children of the current page. |
| `site-collection-list` | Smart Collection | — | Smart collection list. |
| `site-view` | Site View | — | Dynamic view driven by query/conditions. |
| `site-available-themes` | Available Themes | `image:collections` | Gallery of available themes with live preview. |
| `lesson-overview` | Lesson Overview | — | Lesson overview container. |
| `lesson-highlight` | Lesson Highlight | — | Highlight block within a lesson. |

## Theme development

To build a custom theme:

1. Extend `HAXCMSLitElementTheme` (import from `lib/core/HAXCMSLitElementTheme.js`). With mixins, `HAXCMSLitElementTheme` must be the base: `class MyTheme extends SomeMixin(HAXCMSLitElementTheme) {}`.
2. Define a `render()` with the `#contentcontainer > #slot > <slot>` contract so the editor can target the content area.
3. Set `this.contentContainer` to the `#contentcontainer` node in `firstUpdated` (the base class does this if you call `super.firstUpdated`).
4. Compose `site-*` UI components (`site-menu`, `site-breadcrumb`, `site-active-title`, `site-children-block`, `site-footer`, etc.) in your template.
5. Use DDD design tokens and SimpleColors custom properties for styling; the base class exposes `--haxcms-color`, `--haxcms-theme-content-min-height`, and related variables.
6. Register the theme element with `customElements.define`.
7. Run `yarn run build` to regenerate `custom-elements.json` — never hand-edit it.

The `haxcms-basic-theme` is the reference implementation; start from it or `haxcms-blank-theme`.

## Demo / Develop

The demo simulates a full HAXcms site in `demo/`:

```bash path=null start=null
npm start
```

This runs `cd demo && yarn start`, which serves `demo/index.html`. The demo mounts `<haxcms-site-builder file="site.json">`, sets `globalThis.HAXCMSContext = 'demo'` to use the in-memory backend, and configures `appSettings` with mock JSON endpoints under `dist/dev/`. A `wc-registry.json` drives the autoloader so components hydrate on demand.

## Contributing

1. Fork it! `git clone git@github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

Apache-2.0 © The Pennsylvania State University
