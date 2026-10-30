/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Site admin section registry: one ordered list of every section the
 * Site settings launcher shows. The launcher, the section rail, Features
 * gating (route -> platform capability) and the one admin dialog all read
 * it, so adding a section is one entry here. See haxtheweb/issues#3180.
 *
 * `shell: true` sections render inside haxcms-site-admin (the one admin
 * dialog). Structure's import step, Revisions and the full-screen theme
 * preview still open through their own openers in haxcms-site-editor-ui.
 */

/**
 * @typedef {Object} SiteAdminSection
 * @property {string} route        key in ADMIN_ROUTE_QUERY_PATHS (?admin=)
 * @property {"primary"|"advanced"|"help"} group  rail and launcher group:
 *   primary first, then advanced, then help (About) on its own at the end
 * @property {string} labelKey     i18n key on haxcms-site-admin's `t`
 * @property {string} descriptionKey i18n key for the one-line help
 * @property {string} icon         simple-icon name
 * @property {?string} capability  platform feature key, null = always allowed
 * @property {boolean} shell       true = renders inside the one admin dialog
 * @property {string} [tag]        section element (shell sections)
 * @property {Function} [load]     lazy import of the section element
 * @property {"form"|"selection"|"none"} [footer] action bar mode:
 *   form = status, Discard and Save; selection = "N selected", Clear and
 *   the section's bulk actions; none = no bar
 * @property {boolean} [header] false when the section draws its own header
 * @property {boolean} [fill] true when the section scrolls inside itself
 *   and should fill the dialog body (Structure)
 * @property {SiteAdminChild[]} [children] parts of the section, listed
 *   under it in the rail and in its hover tooltip
 */

/**
 * A part of a section. `route` children are their own pages (Reports'
 * screens, SEO's Author); `anchor` children are headings inside the
 * section's page, which the dialog scrolls to (and opens, when the heading
 * is a collapsed group). Anchors resolve to `[data-anchor]`, then
 * `[data-group]`, then `#id`, then `#group-id` in the section's shadow root.
 * @typedef {Object} SiteAdminChild
 * @property {string} key          unique within the section
 * @property {string} labelKey     i18n key on haxcms-site-admin's `t`
 * @property {string} [descriptionKey] one-line help for a route child
 * @property {string} [icon]       shown in the narrow icon rail
 * @property {string} [route]      shell route this child opens
 * @property {string} [anchor]     heading id inside the section
 * @property {string} [tag]        a route child with its own screen: the
 *   element to render instead of the section's (with `load`, `footer`,
 *   `fill`, `header` as on a section)
 */

/** @type {SiteAdminSection[]} */
export const SITE_ADMIN_SECTIONS = [
  {
    route: "reports",
    group: "primary",
    labelKey: "reports",
    descriptionKey: "reportsDescription",
    icon: "hax:admin-reports",
    // "insights" is the compatibility platform feature key for Reports
    capability: "insights",
    shell: true,
    // Insights: nine screens computed in the browser; each is a route
    tag: "haxcms-site-reports",
    load: () => import("../insights/haxcms-site-reports.js"),
    footer: "none",
    children: [
      {
        key: "accessibility",
        labelKey: "reportsAccessibility",
        descriptionKey: "reportsAccessibilityDescription",
        icon: "hax:admin-accessibility",
        route: "reports-accessibility",
      },
      {
        key: "content",
        labelKey: "reportsContent",
        descriptionKey: "reportsContentDescription",
        icon: "hax:admin-text",
        route: "reports-content",
      },
      {
        key: "links",
        labelKey: "reportsLinks",
        descriptionKey: "reportsLinksDescription",
        icon: "hax:admin-links",
        route: "reports-links",
      },
      {
        key: "media",
        labelKey: "reportsMedia",
        descriptionKey: "reportsMediaDescription",
        icon: "hax:admin-media",
        route: "reports-media",
      },
      {
        key: "instructional",
        labelKey: "reportsInstructional",
        descriptionKey: "reportsInstructionalDescription",
        icon: "hax:admin-instructional",
        route: "reports-instructional",
      },
      {
        key: "freshness",
        labelKey: "reportsFreshness",
        descriptionKey: "reportsFreshnessDescription",
        icon: "hax:admin-freshness",
        route: "reports-freshness",
      },
      {
        key: "metadata",
        labelKey: "reportsMetadata",
        descriptionKey: "reportsMetadataDescription",
        icon: "hax:admin-metadata",
        route: "reports-metadata",
      },
      {
        key: "components",
        labelKey: "reportsComponents",
        descriptionKey: "reportsComponentsDescription",
        icon: "hax:admin-components",
        route: "reports-components",
      },
    ],
  },
  {
    route: "content",
    group: "primary",
    labelKey: "content",
    descriptionKey: "contentDescription",
    icon: "hax:admin-content",
    capability: null,
    shell: true,
    tag: "haxcms-content-admin-dialog",
    load: () => import("../haxcms-content-admin-dialog.js"),
    footer: "selection",
    children: [
      {
        key: "history",
        labelKey: "pageHistory",
        descriptionKey: "pageHistoryDescription",
        icon: "hax:admin-history",
        route: "revisions",
        // its own screen, not Content's: every saved version of one page
        tag: "haxcms-page-revisions-dialog",
        load: () => import("../haxcms-page-revisions-dialog.js"),
        footer: "none",
        fill: true,
      },
    ],
  },
  {
    route: "structure",
    group: "primary",
    labelKey: "structure",
    descriptionKey: "structureDescription",
    icon: "hax:admin-structure",
    capability: "outlineDesigner",
    shell: true,
    tag: "haxcms-outline-editor-dialog",
    load: () => import("../haxcms-outline-editor-dialog.js"),
    // outline-designer scrolls inside itself and keeps its own Save
    // Outline button (in its toolbar) and confirm, so the shell draws no
    // action bar; the titlebar names it, so no page header either and the
    // outline gets the height
    fill: true,
    header: false,
  },
  {
    route: "files",
    group: "primary",
    labelKey: "files",
    descriptionKey: "filesDescription",
    icon: "hax:admin-files",
    capability: "uploadMedia",
    shell: true,
    tag: "haxcms-files-admin-dialog",
    load: () => import("../haxcms-files-admin-dialog.js"),
    footer: "selection",
  },
  {
    route: "appearance",
    group: "primary",
    labelKey: "appearance",
    descriptionKey: "appearanceDescription",
    icon: "hax:admin-appearance",
    capability: "themeManifest",
    shell: true,
    tag: "haxcms-appearance-admin-dialog",
    load: () => import("../haxcms-appearance-admin-dialog.js"),
    footer: "form",
    children: [
      {
        key: "theme",
        labelKey: "theme",
        icon: "hax:admin-theme",
        anchor: "theme",
      },
      {
        key: "palette",
        labelKey: "palette",
        icon: "hax:admin-palette",
        anchor: "palette",
      },
      {
        key: "branding",
        labelKey: "branding",
        icon: "hax:admin-branding",
        anchor: "branding",
      },
      {
        key: "regions",
        labelKey: "regions",
        icon: "hax:admin-regions",
        anchor: "regions",
      },
    ],
  },
  {
    route: "views",
    group: "advanced",
    labelKey: "views",
    descriptionKey: "viewsDescription",
    icon: "hax:admin-views",
    capability: null,
    shell: true,
    tag: "haxcms-views-admin-dialog",
    load: () => import("../haxcms-views-admin-dialog.js"),
    footer: "none",
    children: [
      {
        key: "source",
        labelKey: "viewsSource",
        icon: "hax:admin-content",
        anchor: "source",
      },
      {
        key: "show",
        labelKey: "viewsShow",
        icon: "hax:admin-preview",
        anchor: "show",
      },
      {
        key: "filter",
        labelKey: "viewsFilter",
        icon: "hax:admin-search",
        anchor: "filter",
      },
      {
        key: "sort",
        labelKey: "viewsSort",
        icon: "hax:admin-import-export",
        anchor: "sort",
      },
    ],
  },
  {
    route: "blocks",
    group: "advanced",
    labelKey: "blocks",
    descriptionKey: "blocksDescription",
    icon: "hax:admin-blocks",
    capability: "siteManifest",
    shell: true,
    tag: "haxcms-allowed-blocks-ui",
    load: () => import("../ui/haxcms-allowed-blocks-ui.js"),
    footer: "form",
  },
  {
    route: "features",
    group: "advanced",
    labelKey: "features",
    descriptionKey: "featuresDescription",
    icon: "hax:admin-features",
    capability: null,
    shell: true,
    tag: "haxcms-site-platform-ui",
    load: () => import("../ui/haxcms-site-platform-ui.js"),
    footer: "form",
    children: [
      {
        key: "cms",
        labelKey: "featuresCms",
        icon: "hax:admin-cms",
        anchor: "cms",
      },
      {
        key: "hax",
        labelKey: "featuresEditor",
        icon: "hax:admin-editor",
        anchor: "hax",
      },
    ],
  },
  {
    route: "site",
    group: "advanced",
    labelKey: "details",
    descriptionKey: "detailsDescription",
    icon: "hax:admin-details",
    capability: "siteManifest",
    shell: true,
    tag: "haxcms-site-details-dialog",
    load: () => import("../haxcms-site-details-dialog.js"),
    footer: "form",
    children: [
      {
        key: "advanced",
        labelKey: "advanced",
        icon: "hax:admin-advanced",
        anchor: "advanced",
      },
    ],
  },
  {
    route: "editor",
    group: "advanced",
    labelKey: "editor",
    descriptionKey: "editorDescription",
    icon: "hax:admin-editor",
    capability: "siteManifest",
    shell: true,
    tag: "haxcms-editor-settings-dialog-ui",
    load: () => import("../ui/haxcms-editor-settings-dialog-ui.js"),
    footer: "form",
  },
  {
    route: "seo",
    group: "advanced",
    labelKey: "seo",
    descriptionKey: "seoDescription",
    icon: "hax:admin-seo",
    capability: "seoManifest",
    shell: true,
    tag: "haxcms-seo-admin-dialog",
    load: () => import("../haxcms-seo-admin-dialog.js"),
    footer: "form",
    children: [
      {
        key: "author",
        labelKey: "author",
        descriptionKey: "authorDescription",
        icon: "hax:admin-author",
        route: "author",
      },
    ],
  },
  {
    route: "transfer",
    group: "advanced",
    labelKey: "importExport",
    descriptionKey: "importExportDescription",
    icon: "hax:admin-import-export",
    capability: null,
    shell: true,
    tag: "haxcms-site-import-export-dashboard",
    load: () => import("../haxcms-site-import-export-dashboard.js"),
    footer: "none",
    children: [
      {
        key: "import",
        labelKey: "import",
        icon: "hax:admin-upload",
        anchor: "import",
      },
      {
        key: "export-page",
        labelKey: "exportPage",
        icon: "hax:admin-download",
        anchor: "export-page",
      },
      {
        key: "export-site",
        labelKey: "exportSite",
        icon: "hax:admin-download",
        anchor: "export-site",
      },
    ],
  },
  {
    route: "about",
    group: "help",
    labelKey: "about",
    descriptionKey: "aboutDescription",
    icon: "hax:admin-about",
    capability: null,
    shell: true,
    tag: "haxcms-about-dialog-ui",
    load: () => import("../ui/haxcms-about-dialog-ui.js"),
    footer: "none",
    children: [
      {
        key: "community",
        labelKey: "aboutCommunity",
        icon: "hax:admin-community",
        anchor: "community",
      },
      {
        key: "tutorials",
        labelKey: "aboutTutorials",
        icon: "hax:admin-tutorials",
        anchor: "tutorials",
      },
      {
        key: "api",
        labelKey: "aboutApi",
        icon: "hax:admin-api",
        anchor: "api",
      },
      {
        key: "shortcuts",
        labelKey: "aboutShortcuts",
        icon: "hax:admin-shortcuts",
        anchor: "shortcuts",
      },
    ],
  },
];

/**
 * Shell routes that are not launcher entries: they render a parent
 * section (marked current in the rail) with their own title.
 */
export const SITE_ADMIN_CHILD_SECTIONS = Object.freeze(
  SITE_ADMIN_SECTIONS.reduce((map, section) => {
    (section.children || []).forEach((child) => {
      if (child.route && child.route !== section.route) {
        map[child.route] = {
          parent: section.route,
          key: child.key,
          labelKey: child.labelKey,
          descriptionKey: child.descriptionKey || section.descriptionKey,
          icon: child.icon || section.icon,
          view: child.tag
            ? {
                tag: child.tag,
                load: child.load,
                footer: child.footer,
                fill: child.fill,
                header: child.header,
              }
            : null,
        };
      }
    });
    return map;
  }, {}),
);

/**
 * Routes that open from a section but are not launcher entries, with the
 * capability that gates them.
 */
const CHILD_ROUTE_CAPABILITIES = {
  "theme-preview": "themeManifest",
  author: "authorManifest",
  "structure-import": "outlineDesigner",
};

/**
 * Route -> platform capability for every admin route. A route not listed
 * here has no capability gate (null).
 */
export const SITE_ADMIN_ROUTE_CAPABILITIES = Object.freeze(
  SITE_ADMIN_SECTIONS.reduce(
    (map, section) => {
      map[section.route] = section.capability;
      // a child route takes its section's gate unless it has its own
      // (author keeps authorManifest)
      (section.children || []).forEach((child) => {
        if (
          child.route &&
          !Object.prototype.hasOwnProperty.call(map, child.route)
        ) {
          map[child.route] = section.capability;
        }
      });
      return map;
    },
    Object.assign({}, CHILD_ROUTE_CAPABILITIES),
  ),
);

/**
 * @param {string} route
 * @returns {?SiteAdminSection}
 */
export function getSiteAdminSection(route) {
  return SITE_ADMIN_SECTIONS.find((section) => section.route === route) || null;
}

/**
 * @param {string} route
 * @returns {?string} the platform capability gating this route, or null
 */
export function siteAdminRouteCapability(route) {
  if (
    typeof route === "string" &&
    Object.prototype.hasOwnProperty.call(SITE_ADMIN_ROUTE_CAPABILITIES, route)
  ) {
    return SITE_ADMIN_ROUTE_CAPABILITIES[route];
  }
  return null;
}

/**
 * True when the route renders inside the one admin dialog. The launcher
 * ("admin") always does.
 * @param {string} route
 */
export function isSiteAdminShellRoute(route) {
  if (route === "admin") {
    return true;
  }
  const resolved = resolveSiteAdminRoute(route);
  return !!(resolved && resolved.section.shell);
}

/**
 * The section a shell route renders, plus its own label and icon (child
 * routes such as "author" render their parent section).
 * @param {string} route
 * @returns {?{route: string, section: SiteAdminSection, labelKey: string,
 *   descriptionKey: string, icon: string}}
 */
export function resolveSiteAdminRoute(route) {
  const section = getSiteAdminSection(route);
  if (section) {
    return {
      route: route,
      section: section,
      labelKey: section.labelKey,
      descriptionKey: section.descriptionKey,
      icon: section.icon,
    };
  }
  const child = Object.prototype.hasOwnProperty.call(
    SITE_ADMIN_CHILD_SECTIONS,
    route,
  )
    ? SITE_ADMIN_CHILD_SECTIONS[route]
    : null;
  const parent = child ? getSiteAdminSection(child.parent) : null;
  if (!parent) {
    return null;
  }
  return {
    route: route,
    section: parent,
    childKey: child.key,
    labelKey: child.labelKey,
    descriptionKey: child.descriptionKey,
    icon: child.icon,
    view: child.view,
  };
}

/**
 * What a resolved route renders: its own screen for a route child that has
 * one (Page history), else its section's.
 * @param {?Object} resolved from resolveSiteAdminRoute
 * @returns {?{tag: string, load: Function, footer: string, fill: boolean,
 *   header: boolean, shell: boolean}}
 */
export function siteAdminRouteView(resolved) {
  if (!resolved) {
    return null;
  }
  const section = resolved.section;
  if (resolved.view) {
    return Object.assign({ shell: section.shell }, resolved.view);
  }
  return {
    tag: section.tag,
    load: section.load,
    footer: section.footer,
    fill: section.fill,
    header: section.header,
    shell: section.shell,
  };
}

/**
 * Shared simple-modal styles for the one admin dialog, so no opener carries
 * its own copy. Values are DDD tokens; the titlebar uses the proposed
 * --hax-ui-titlebar pair (coalyGray / potentialMidnight) written as DDD.
 */
/**
 * The admin titlebar on its own: the same look for dialogs that are not in
 * the shell yet (Structure, its import step, Revisions), so every admin
 * screen's breadcrumb sits at the same size and spacing.
 */
export const SITE_ADMIN_TITLEBAR_STYLES = Object.freeze({
  "--simple-modal-titlebar-background":
    "light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-potentialMidnight))",
  "--simple-modal-titlebar-color": "var(--ddd-theme-default-white)",
  "--simple-modal-titlebar-height": "48px",
  "--simple-modal-titlebar-padding": "0 var(--ddd-spacing-3, 12px) 0 16px",
  "--simple-modal-titlebar-font-size": "16px",
  "--simple-modal-titlebar-font-weight": "var(--ddd-font-weight-bold, 700)",
  "--simple-modal-title-icon-size": "18px",
  "--simple-modal-breadcrumb-gap": "6px",
  "--simple-modal-breadcrumb-icon-gap": "6px",
  "--simple-modal-title-text-offset": "0",
  "--simple-modal-titlebar-icon-height": "20px",
  "--simple-modal-titlebar-icon-width": "20px",
});

/**
 * The admin dialog takes nearly the whole screen: the margin around it
 * grows from 0 on a phone to 32px on a wide screen (2vw less 8px, clamped),
 * so a phone gets the full screen with square corners and a desktop keeps a
 * thin frame of the page.
 */
const SITE_ADMIN_MODAL_GAP = "clamp(0px, 2vw - 8px, 32px)";
export const SITE_ADMIN_MODAL_SIZE = Object.freeze({
  "--simple-modal-width": `calc(100vw - 2 * ${SITE_ADMIN_MODAL_GAP})`,
  "--simple-modal-max-width": "1680px",
  "--simple-modal-min-width": "300px",
  "--simple-modal-height": `calc(100dvh - 2 * ${SITE_ADMIN_MODAL_GAP})`,
  "--simple-modal-max-height": "100dvh",
  "--simple-modal-min-height": "360px",
  "--simple-modal-container-padding": "0",
  "--simple-modal-border-radius": "clamp(0px, 1vw - 4px, 8px)",
});
export const SITE_ADMIN_MODAL_STYLES = Object.freeze({
  ...SITE_ADMIN_TITLEBAR_STYLES,
  ...SITE_ADMIN_MODAL_SIZE,
  "--simple-modal-z-index": "100000000",
  "--simple-modal-content-padding": "0",
  "--simple-modal-content-container-background":
    "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
});
