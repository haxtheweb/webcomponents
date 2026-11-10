/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * HAX UI admin layer: the admin icon names (hax:admin-*), one per meaning.
 * Part of @haxtheweb/d-d-d/lib/HaxUiAdminStyles.js, which re-exports it
 * with the rest of the layer. Import this file directly when an element
 * needs only this piece, so a page does not download the whole layer.
 */

/**
 * One name per admin meaning. Admin chrome uses the hax:admin-* family
 * only (see "Admin icons" in hax-ui-admin.md); pick the icon by what it
 * means here instead of typing a name, so every surface draws the same
 * glyph for the same action:
 *
 *   <simple-icon-lite icon="${HaxUiAdminIcons.close}"></simple-icon-lite>
 *
 * Section icons (the rail, panel groups, system settings) have keys
 * here too, named for the section (structure, appearance, seo...), so a
 * section draws the same glyph wherever it is listed.
 * Content icons (block icons, hax:file-*, brand marks) are not admin
 * chrome and stay what they are.
 */
export const HaxUiAdminIcons = Object.freeze({
  about: "hax:admin-about",
  accessibility: "hax:admin-accessibility",
  add: "hax:admin-add",
  advanced: "hax:admin-advanced",
  api: "hax:admin-api",
  appearance: "hax:admin-appearance",
  author: "hax:admin-author",
  back: "hax:admin-back",
  blocks: "hax:admin-blocks",
  branding: "hax:admin-branding",
  check: "hax:admin-check",
  chevron: "hax:admin-chevron",
  chevronLeft: "hax:admin-chevron-left",
  clearFormat: "hax:admin-clear-format",
  close: "hax:admin-close",
  cms: "hax:admin-cms",
  community: "hax:admin-community",
  components: "hax:admin-components",
  content: "hax:admin-content",
  copy: "hax:admin-copy",
  delete: "hax:admin-delete",
  details: "hax:admin-details",
  docs: "hax:admin-docs",
  download: "hax:admin-download",
  drag: "hax:admin-drag",
  edit: "hax:admin-edit",
  editor: "hax:admin-editor",
  enter: "hax:admin-enter",
  error: "hax:admin-error",
  external: "hax:admin-external",
  features: "hax:admin-features",
  files: "hax:admin-files",
  findReplace: "hax:admin-find-replace",
  freshness: "hax:admin-freshness",
  hide: "hax:admin-hide",
  history: "hax:admin-history",
  home: "hax:admin-home",
  image: "hax:admin-media",
  importExport: "hax:admin-import-export",
  info: "hax:admin-info",
  instructional: "hax:admin-instructional",
  issues: "hax:admin-issues",
  key: "hax:admin-key",
  language: "hax:admin-language",
  link: "hax:admin-links",
  lock: "hax:admin-lock",
  metadata: "hax:admin-metadata",
  more: "hax:admin-more",
  moveDown: "hax:admin-move-down",
  movePanel: "hax:admin-move-panel",
  moveUp: "hax:admin-move-up",
  page: "hax:admin-page",
  palette: "hax:admin-palette",
  preview: "hax:admin-preview",
  prettify: "hax:admin-prettify",
  railCollapse: "hax:admin-rail-collapse",
  railExpand: "hax:admin-rail-expand",
  refresh: "hax:admin-refresh",
  regions: "hax:admin-regions",
  reports: "hax:admin-reports",
  search: "hax:admin-search",
  selectAll: "hax:admin-select-all",
  seo: "hax:admin-seo",
  shortcuts: "hax:admin-shortcuts",
  structure: "hax:admin-structure",
  text: "hax:admin-text",
  theme: "hax:admin-theme",
  tutorials: "hax:admin-tutorials",
  unlock: "hax:admin-unlock",
  upload: "hax:admin-upload",
  views: "hax:admin-views",
  voice: "hax:admin-voice",
  warning: "hax:admin-warning",
});
