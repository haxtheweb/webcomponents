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
 * dialog). The rest still open through their existing opener in
 * haxcms-site-editor-ui until they move into the shell, one per PR.
 */

/**
 * @typedef {Object} SiteAdminSection
 * @property {string} route        key in ADMIN_ROUTE_QUERY_PATHS (?admin=)
 * @property {"primary"|"advanced"} group  launcher group, in today's order
 * @property {string} labelKey     i18n key on haxcms-site-admin's `t`
 * @property {string} descriptionKey i18n key for the one-line help
 * @property {string} icon         simple-icon name
 * @property {?string} capability  platform feature key, null = always allowed
 * @property {boolean} shell       true = renders inside the one admin dialog
 * @property {string} [tag]        section element (shell sections)
 * @property {Function} [load]     lazy import of the section element
 * @property {"form"|"selection"|"none"} [footer] action bar mode
 */

/** @type {SiteAdminSection[]} */
export const SITE_ADMIN_SECTIONS = [
  {
    route: "appearance",
    group: "primary",
    labelKey: "appearance",
    descriptionKey: "appearanceDescription",
    icon: "lrn:palette",
    capability: "themeManifest",
    shell: false,
  },
  {
    route: "structure",
    group: "primary",
    labelKey: "structure",
    descriptionKey: "structureDescription",
    icon: "hax:site-map",
    capability: "outlineDesigner",
    shell: false,
  },
  {
    route: "content",
    group: "primary",
    labelKey: "content",
    descriptionKey: "contentDescription",
    icon: "editor:insert-drive-file",
    capability: null,
    shell: false,
  },
  {
    route: "reports",
    group: "primary",
    labelKey: "reports",
    descriptionKey: "reportsDescription",
    icon: "hax:graph",
    // "insights" is the compatibility platform feature key for Reports
    capability: "insights",
    shell: false,
  },
  {
    route: "about",
    group: "primary",
    labelKey: "about",
    descriptionKey: "aboutDescription",
    icon: "help",
    capability: null,
    shell: false,
  },
  {
    route: "files",
    group: "advanced",
    labelKey: "files",
    descriptionKey: "filesDescription",
    icon: "icons:folder",
    capability: "uploadMedia",
    shell: false,
  },
  {
    route: "views",
    group: "advanced",
    labelKey: "views",
    descriptionKey: "viewsDescription",
    icon: "hax:view-gallery",
    capability: null,
    shell: false,
  },
  {
    route: "features",
    group: "advanced",
    labelKey: "features",
    descriptionKey: "featuresDescription",
    icon: "hax:add-item",
    capability: null,
    shell: false,
  },
  {
    route: "editor",
    group: "advanced",
    labelKey: "editor",
    descriptionKey: "editorDescription",
    icon: "hax:page-edit",
    capability: "siteManifest",
    shell: false,
  },
  {
    route: "blocks",
    group: "advanced",
    labelKey: "blocks",
    descriptionKey: "blocksDescription",
    icon: "hax:blocks",
    capability: "siteManifest",
    shell: false,
  },
  {
    route: "seo",
    group: "advanced",
    labelKey: "seo",
    descriptionKey: "seoDescription",
    icon: "icons:search",
    capability: "seoManifest",
    shell: false,
  },
  {
    route: "transfer",
    group: "advanced",
    labelKey: "importExport",
    descriptionKey: "importExportDescription",
    icon: "icons:file-download",
    capability: null,
    shell: false,
  },
  {
    route: "site",
    group: "advanced",
    labelKey: "details",
    descriptionKey: "detailsDescription",
    icon: "settings",
    capability: "siteManifest",
    shell: true,
    tag: "haxcms-site-details-dialog",
    load: () => import("../haxcms-site-details-dialog.js"),
    footer: "form",
  },
];

/**
 * Routes that open from a section but are not launcher entries, with the
 * capability that gates them.
 */
const CHILD_ROUTE_CAPABILITIES = {
  "theme-preview": "themeManifest",
  author: "authorManifest",
  "structure-import": "outlineDesigner",
  revisions: null,
};

/**
 * Route -> platform capability for every admin route. A route not listed
 * here has no capability gate (null).
 */
export const SITE_ADMIN_ROUTE_CAPABILITIES = Object.freeze(
  SITE_ADMIN_SECTIONS.reduce(
    (map, section) => {
      map[section.route] = section.capability;
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
  const section = getSiteAdminSection(route);
  return !!(section && section.shell);
}

/**
 * Shared simple-modal styles for the one admin dialog, so no opener carries
 * its own copy. Values are DDD tokens; the titlebar uses the proposed
 * --hax-ui-titlebar pair (coalyGray / potentialMidnight) written as DDD.
 */
export const SITE_ADMIN_MODAL_STYLES = Object.freeze({
  "--simple-modal-titlebar-background":
    "light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-potentialMidnight))",
  "--simple-modal-titlebar-color": "var(--ddd-theme-default-white)",
  "--simple-modal-titlebar-height": "48px",
  "--simple-modal-z-index": "100000000",
  "--simple-modal-width": "80vw",
  "--simple-modal-max-width": "80vw",
  "--simple-modal-min-width": "300px",
  "--simple-modal-height": "80vh",
  "--simple-modal-max-height": "80vh",
  "--simple-modal-min-height": "400px",
  "--simple-modal-content-padding": "0",
  "--simple-modal-content-container-background":
    "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
});
