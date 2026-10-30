/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import {
  SITE_ADMIN_SECTIONS,
  resolveSiteAdminRoute,
  siteAdminRouteView,
} from "./site-admin-sections.js";

/**
 * Remembers, across the page reload that follows a successful save, that the
 * section the person was on was just saved. Browser storage can be blocked;
 * every read and write is guarded and the shell works without it.
 */
const SAVED_FLAG_KEY = "haxcms-site-admin-saved";
const SAVED_FLAG_MAX_AGE = 15000;
/** which rail sections are opened out, per browser */
const EXPANDED_KEY = "haxcms-site-admin-rail-open";
/** whether the rail is collapsed to icons, per browser */
const COLLAPSED_KEY = "haxcms-site-admin-rail-collapsed";
/** at or below this width the rail starts as icons and opens over the page */
const NARROW_QUERY = "(max-width: 768px)";

/**
 * `haxcms-site-admin`
 * The one admin dialog for site admin (haxtheweb/issues#3180): the Site
 * settings launcher, a section rail, the page header, the section body and
 * an action bar this shell owns. Lives inside simple-modal, which keeps the
 * titlebar, breadcrumb, focus trap and close button.
 *
 * Sections that render here implement the section contract:
 * - fire `haxcms-admin-section-state` whenever their state changes, with
 *   - form sections: `{ dirty, changes, canSave, count }`; `count` is
 *     optional, for when `changes` summarises many edits ("12 blocks")
 *   - selection sections: `{ selected, actions: [{ id, label, icon,
 *     danger, disabled }], selectionText }`; `selectionText` is optional
 *     wording for the bar when the count is not a selection ("3 pages match")
 *   - any section: `headerActions: [{ id, label, icon, disabled }]`
 *   - any section: `headerText: { title, description }` to name what it
 *     shows (Page history names the page)
 * - `save()` runs their existing save (the same `haxcms-save-*` event and
 *   payload as before) and returns true when a save was sent
 * - `discard()` restores the values they loaded
 * - selection sections: `clearSelection()` and `runAction(id)`
 * - header actions: `runHeaderAction(id)`
 * - `inShell` is set to true before they connect; with it they never
 *   render their own Save button or close the modal after saving
 *
 * Saves report back through `haxcms-admin-save-result` on globalThis.
 *
 * @fires haxcms-site-admin-navigate - detail `{ route }`; the editor routes it
 * @element haxcms-site-admin
 */
class HAXCMSSiteAdmin extends I18NMixin(LitElement) {
  static get tag() {
    return "haxcms-site-admin";
  }

  static get properties() {
    return {
      /** admin route: "admin" for the launcher, else a section route */
      route: { type: String, reflect: true },
      /** (route) => boolean, whether Features allow a route */
      allowRoute: { attribute: false },
      /**
       * (route, element) => void, called before a section connects so the
       * editor can hand it per-open values and listeners
       */
      configureSection: { attribute: false },
      _selected: { state: true },
      _expanded: { state: true },
      _railCollapsed: { state: true },
      _narrow: { state: true },
      _railOpen: { state: true },
      _tip: { state: true },
      _moreOpen: { state: true },
      _badges: { state: true },
      _anchor: { state: true },
      _selectionText: { state: true },
      _actions: { state: true },
      _headerActions: { state: true },
      _headerText: { state: true },
      _status: { state: true },
      _changes: { state: true },
      _canSave: { state: true },
      _leave: { state: true },
      _sectionEl: { state: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      siteSettings: "Site settings",
      launcherDescription: "Choose a section to manage this site.",
      advanced: "Advanced",
      adminSections: "Admin sections",
      appearance: "Appearance",
      appearanceDescription: "Theme, colors and regions",
      structure: "Structure",
      structureDescription: "Reorder, nest and import pages",
      content: "Content",
      contentDescription: "Search, filter and replace across pages",
      reports: "Dashboard",
      reportsDescription: "How this site is doing and what to fix next",
      about: "About",
      aboutDescription: "Help, shortcuts and API links",
      files: "Files",
      filesDescription: "Uploads and media",
      views: "Views",
      viewsDescription: "Saved queries shown as blocks",
      features: "Features",
      featuresDescription: "Turn capabilities on or off",
      editor: "Editor",
      editorDescription: "Experience level and toolbar",
      blocks: "Blocks",
      blocksDescription: "Blocks authors can add",
      seo: "SEO",
      seoDescription: "Search, sharing and author",
      importExport: "Import / Export",
      importExportDescription: "Move content in and out",
      details: "Details",
      detailsDescription: "The site's name, where it starts, and how it loads.",
      author: "Author",
      authorDescription: "Who made this site, for credits and sharing.",
      nothingSelected: "Nothing selected",
      includes: "Includes: {list}",
      collapseMenu: "Collapse menu",
      expandMenu: "Expand menu",
      showParts: "Show parts of {section}",
      hideParts: "Hide parts of {section}",
      theme: "Theme",
      palette: "Palette",
      branding: "Branding",
      regions: "Regions",
      aboutCommunity: "HAX and community",
      aboutTutorials: "Tutorials and how-to",
      aboutApi: "API links",
      aboutShortcuts: "Keyboard shortcuts",
      viewsSource: "Source",
      viewsShow: "Show",
      viewsFilter: "Filter",
      viewsSort: "Sort",
      featuresCms: "CMS features",
      featuresEditor: "Editor features",
      import: "Import",
      exportPage: "Export this page",
      exportSite: "Export this site",
      reportsOverview: "Overview",
      reportsOverviewDescription:
        "Site health and what to fix next, checked in your browser.",
      reportsAccessibility: "Accessibility",
      reportsAccessibilityDescription:
        "Image alt text, headings, captions and contrast.",
      reportsContent: "Content",
      reportsContentDescription:
        "Length, structure and readability of every page.",
      reportsLinks: "Links",
      reportsLinksDescription: "Links between pages, link text and embeds.",
      reportsMedia: "Media",
      reportsMediaDescription: "Videos, images and pages without media.",
      reportsInstructional: "Instructional",
      reportsInstructionalDescription:
        "Objectives, practice and activities across the course.",
      reportsFreshness: "Freshness",
      reportsFreshnessDescription:
        "When pages were last edited and what may be out of date.",
      reportsMetadata: "Metadata",
      reportsMetadataDescription:
        "Titles, descriptions and what search engines and AI tools see.",
      reportsComponents: "Components",
      reportsComponentsDescription: "Which HAX blocks and HTML each page uses.",
      pageHistory: "Page history",
      pageHistoryDescription:
        "Every saved version of a page: what changed, who changed it, and restore.",
      oneSelected: "1 selected",
      manySelected: "{count} selected",
      clearSelection: "Clear",
      moreActions: "More",
      moreActionsLabel: "More actions for the selection",
      save: "Save",
      saving: "Saving…",
      discard: "Discard",
      noUnsavedChanges: "No unsaved changes",
      unsavedChange: "1 unsaved change",
      unsavedChanges: "{count} unsaved changes",
      allChangesSaved: "All changes saved",
      savingFailed: "Saving failed.",
      changesKept: "Your changes are still here.",
      leaveTitle: "Leave {section} with unsaved changes?",
      leaveDescription:
        "If you leave now, these changes are lost unless you save them first.",
      stay: "Stay",
      discardAndLeave: "Discard and leave",
      saveAndLeave: "Save and leave",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.route = "admin";
    this.allowRoute = null;
    this.configureSection = null;
    this._expanded = this._loadExpanded();
    this._railCollapsed = this._loadCollapsed();
    this._narrow = false;
    this._railOpen = false;
    this._tip = null;
    this._moreOpen = false;
    this.__narrowQuery = null;
    this._badges = {};
    this._anchor = "";
    this.__pendingAnchor = null;
    this._selected = 0;
    this._selectionText = "";
    this._actions = [];
    this._headerActions = [];
    this._headerText = null;
    this._status = "clean";
    this._changes = [];
    this._changeCount = 0;
    this._canSave = false;
    this._leave = null;
    this._sectionEl = null;
    this.__allowNextClose = false;
    this.__pendingLeave = null;
    this.__loadToken = 0;
    this._onSectionState = this._onSectionState.bind(this);
    this._onSaveResult = this._onSaveResult.bind(this);
    this._onModalWillClose = this._onModalWillClose.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onNarrowChange = this._onNarrowChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.__windowControllers = new AbortController();
    const signal = this.__windowControllers.signal;
    globalThis.addEventListener(
      "haxcms-admin-save-result",
      this._onSaveResult,
      {
        signal,
      },
    );
    globalThis.addEventListener(
      "simple-modal-will-close",
      this._onModalWillClose,
      { signal },
    );
    this.addEventListener("keydown", this._onKeydown);
    this.__keyboardFocus = false;
    this.addEventListener(
      "pointerdown",
      () => {
        this.__keyboardFocus = false;
      },
      { signal },
    );
    if (typeof globalThis.matchMedia === "function") {
      this.__narrowQuery = globalThis.matchMedia(NARROW_QUERY);
      this._narrow = !!this.__narrowQuery.matches;
      if (typeof this.__narrowQuery.addEventListener === "function") {
        this.__narrowQuery.addEventListener("change", this._onNarrowChange, {
          signal,
        });
      }
    }
  }

  _onNarrowChange(e) {
    this._narrow = !!(e && e.matches);
    this._railOpen = false;
    this._tip = null;
  }

  /**
   * True while the rail shows icons only: the person collapsed it, or the
   * screen is narrow and the rail is not opened over the page.
   */
  get railCollapsed() {
    return this._narrow ? !this._railOpen : !!this._railCollapsed;
  }

  /** collapse the rail to icons, or open it out again */
  toggleRail() {
    this._tip = null;
    if (this._narrow) {
      this._railOpen = !this._railOpen;
      return;
    }
    this._railCollapsed = !this._railCollapsed;
    try {
      globalThis.localStorage.setItem(
        COLLAPSED_KEY,
        this._railCollapsed ? "1" : "0",
      );
    } catch {
      // storage blocked: the rail just forgets the choice
    }
  }

  _loadCollapsed() {
    try {
      return globalThis.localStorage.getItem(COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  }

  /** show the name of a rail icon beside it while the rail is collapsed */
  _showTip(e) {
    if (!this.railCollapsed) {
      return;
    }
    // on focus, only for keyboard use: the dialog focusing its first
    // control when it opens should not pop a tooltip over the page
    if (e && e.type === "focusin" && !this.__keyboardFocus) {
      return;
    }
    const target =
      e && e.target && e.target.closest ? e.target.closest("[data-tip]") : null;
    if (!target) {
      return;
    }
    const box = target.getBoundingClientRect();
    const host = this.getBoundingClientRect();
    this._tip = {
      text: target.getAttribute("data-tip"),
      top: box.top - host.top + box.height / 2,
      left: box.right - host.left + 8,
    };
  }

  _hideTip(e) {
    if (!this._tip) {
      return;
    }
    // moving between the parts of one button keeps its tip
    const next = e && e.relatedTarget;
    const from =
      e && e.target && e.target.closest ? e.target.closest("[data-tip]") : null;
    if (from && next && from.contains(next)) {
      return;
    }
    this._tip = null;
  }

  disconnectedCallback() {
    if (this.__windowControllers) {
      this.__windowControllers.abort();
      this.__windowControllers = null;
    }
    this.removeEventListener("keydown", this._onKeydown);
    super.disconnectedCallback();
  }

  /**
   * True while a section holds edits that were not saved. A save in flight
   * does not count, so "Save and leave" can proceed once it reports back.
   */
  get hasUnsavedChanges() {
    return (
      this.route !== "admin" &&
      (this._status === "dirty" || this._status === "error")
    );
  }

  /**
   * Ask before leaving the current section with unsaved changes. Runs
   * `proceed` right away when there is nothing to lose.
   * @param {Function} proceed
   * @returns {boolean} true when it proceeded immediately
   */
  requestLeave(proceed) {
    if (!this.hasUnsavedChanges) {
      // a section that keeps its own save (Structure) asks in its own words
      if (this._sectionAsksToLeave() && !this._sectionEl.confirmLeave()) {
        return false;
      }
      if (typeof proceed === "function") {
        proceed();
      }
      return true;
    }
    this._leave = { proceed: typeof proceed === "function" ? proceed : null };
    return false;
  }

  /**
   * True when leaving needs a check first: unsaved edits the shell tracks,
   * or a section with its own save (Structure) that holds unsaved changes.
   */
  get needsLeaveCheck() {
    return this.hasUnsavedChanges || this._sectionAsksToLeave();
  }

  _sectionAsksToLeave() {
    const el = this._sectionEl;
    return !!(
      this.route !== "admin" &&
      el &&
      typeof el.confirmLeave === "function" &&
      el.hasUnsavedChanges === true
    );
  }

  /** sections the launcher and rail may show, in registry order */
  get visibleSections() {
    return SITE_ADMIN_SECTIONS.filter((section) =>
      typeof this.allowRoute === "function"
        ? this.allowRoute(section.route)
        : true,
    );
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("route")) {
      const resolved = resolveSiteAdminRoute(this.route);
      if (
        resolved &&
        resolved.section.children &&
        resolved.section.children.length &&
        !this._expanded.has(resolved.section.route)
      ) {
        // the section you are in shows its parts
        const next = new Set(this._expanded);
        next.add(resolved.section.route);
        this._expanded = next;
      }
      this._loadSection();
    }
  }

  /**
   * Build the current section again, for a re-open of the same route with
   * new values (the Reports page scope, say).
   */
  reload() {
    return this._loadSection();
  }

  async _loadSection() {
    const token = ++this.__loadToken;
    this._leave = null;
    this._changes = [];
    this._changeCount = 0;
    this._canSave = false;
    this._selected = 0;
    this._selectionText = "";
    this._actions = [];
    this._moreOpen = false;
    this._headerActions = [];
    this._headerText = null;
    this._status = this._consumeSavedFlag(this.route) ? "saved" : "clean";
    if (this._sectionEl) {
      this._sectionEl.removeEventListener(
        "haxcms-admin-section-state",
        this._onSectionState,
      );
      // the section lives in light DOM (slotted) so pages and tests can
      // reach it as a descendant of the modal
      if (this._sectionEl.parentNode === this) {
        this.removeChild(this._sectionEl);
      }
    }
    const resolved = resolveSiteAdminRoute(this.route);
    const section = siteAdminRouteView(resolved);
    if (!section || !section.shell) {
      this._sectionEl = null;
      return;
    }
    if (typeof section.load === "function") {
      await section.load();
    }
    // a newer route won while this one was loading
    if (token !== this.__loadToken) {
      return;
    }
    const el = globalThis.document.createElement(section.tag);
    el.inShell = true;
    el.addEventListener("haxcms-admin-section-state", this._onSectionState);
    if (typeof this.configureSection === "function") {
      this.configureSection(this.route, el);
    }
    this.appendChild(el);
    this._sectionEl = el;
    this._anchor = "";
    if (this.__pendingAnchor) {
      const pending = this.__pendingAnchor;
      this.__pendingAnchor = null;
      // let the section render its data before looking for the heading
      setTimeout(() => this._reveal(pending.anchor, pending.key), 50);
    }
  }

  _onSectionState(e) {
    const detail = e && e.detail ? e.detail : {};
    if (Array.isArray(detail.headerActions)) {
      this._headerActions = detail.headerActions;
    }
    if (detail.headerText && typeof detail.headerText === "object") {
      this._headerText = {
        title: String(detail.headerText.title || ""),
        description: String(detail.headerText.description || ""),
      };
    }
    if (detail.railBadges && typeof detail.railBadges === "object") {
      this._badges = Object.assign({}, this._badges, detail.railBadges);
    }
    if (typeof detail.selected === "number") {
      if (!detail.selected) {
        this._moreOpen = false;
      }
      this._selected = detail.selected;
      this._selectionText =
        typeof detail.selectionText === "string" ? detail.selectionText : "";
    }
    if (Array.isArray(detail.actions)) {
      this._actions = detail.actions;
    }
    if (
      !Object.prototype.hasOwnProperty.call(detail, "dirty") &&
      !Object.prototype.hasOwnProperty.call(detail, "changes")
    ) {
      return;
    }
    const dirty = !!detail.dirty;
    this._changes = Array.isArray(detail.changes) ? detail.changes : [];
    this._changeCount =
      typeof detail.count === "number" ? detail.count : this._changes.length;
    this._canSave = dirty && detail.canSave !== false;
    if (this._status === "saving") {
      return;
    }
    if (dirty) {
      this._status = "dirty";
    } else if (this._status !== "saved") {
      this._status = "clean";
    }
  }

  _save() {
    if (!this._sectionEl || !this._canSave || this._status === "saving") {
      return false;
    }
    if (typeof this._sectionEl.save !== "function") {
      return false;
    }
    if (this._sectionEl.save() === false) {
      return false;
    }
    this._status = "saving";
    return true;
  }

  _discard() {
    if (this._sectionEl && typeof this._sectionEl.discard === "function") {
      this._sectionEl.discard();
    }
    this._changes = [];
    this._canSave = false;
    this._status = "clean";
  }

  _onSaveResult(e) {
    if (this._status !== "saving") {
      return;
    }
    const ok = !!(e && e.detail && e.detail.ok);
    if (ok) {
      this._status = "saved";
      this._changes = [];
      this._canSave = false;
      this._setSavedFlag(this.route);
      if (this.__pendingLeave) {
        const proceed = this.__pendingLeave;
        this.__pendingLeave = null;
        proceed();
      }
      return;
    }
    this.__pendingLeave = null;
    this._status = "error";
  }

  _onModalWillClose(e) {
    if (!this.isConnected || this.__allowNextClose) {
      this.__allowNextClose = false;
      return;
    }
    if (!this.hasUnsavedChanges) {
      return;
    }
    e.preventDefault();
    this._leave = {
      proceed: () => {
        this.__allowNextClose = true;
        globalThis.dispatchEvent(
          new CustomEvent("simple-modal-hide", {
            bubbles: true,
            cancelable: true,
            detail: {},
          }),
        );
      },
    };
  }

  _onKeydown(e) {
    if (e.key === "Tab" || e.key.indexOf("Arrow") === 0) {
      this.__keyboardFocus = true;
    }
    if (e.key === "Escape" && this._tip) {
      e.stopPropagation();
      this._tip = null;
      return;
    }
    if (e.key === "Escape" && this._narrow && this._railOpen && !this._leave) {
      e.stopPropagation();
      this._railOpen = false;
      const toggle = this.shadowRoot.querySelector(".rail-collapse");
      if (toggle) {
        toggle.focus();
      }
      return;
    }
    if (e.key === "Escape" && this._leave) {
      e.stopPropagation();
      this._stay();
      return;
    }
    // Ctrl+Shift+S saves, matching the editor's save shortcut
    if (
      (e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      (e.key === "S" || e.key === "s") &&
      this._canSave
    ) {
      e.preventDefault();
      e.stopPropagation();
      this._save();
    }
  }

  _go(route) {
    this._tip = null;
    if (this._narrow) {
      this._railOpen = false;
    }
    if (!route || route === this.route) {
      return;
    }
    this.requestLeave(() => {
      this.dispatchEvent(
        new CustomEvent("haxcms-site-admin-navigate", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: { route: route },
        }),
      );
    });
  }

  _stay() {
    this._leave = null;
    this.__pendingLeave = null;
    this.__pendingAnchor = null;
    requestAnimationFrame(() => {
      const target = this.shadowRoot.querySelector(".ftr .primary");
      if (target) {
        target.focus();
      }
    });
  }

  _discardAndLeave() {
    const leave = this._leave;
    this._discard();
    this._leave = null;
    if (leave && leave.proceed) {
      leave.proceed();
    }
  }

  _saveAndLeave() {
    const leave = this._leave;
    this._leave = null;
    if (this._save()) {
      this.__pendingLeave = leave && leave.proceed ? leave.proceed : null;
    }
  }

  _setSavedFlag(route) {
    try {
      globalThis.sessionStorage.setItem(
        SAVED_FLAG_KEY,
        JSON.stringify({ route: route, at: Date.now() }),
      );
    } catch {
      // storage blocked: the saved state just does not survive the reload
    }
  }

  _consumeSavedFlag(route) {
    try {
      const raw = globalThis.sessionStorage.getItem(SAVED_FLAG_KEY);
      if (!raw) {
        return false;
      }
      globalThis.sessionStorage.removeItem(SAVED_FLAG_KEY);
      const flag = JSON.parse(raw);
      return !!(
        flag &&
        flag.route === route &&
        Date.now() - flag.at < SAVED_FLAG_MAX_AGE
      );
    } catch {
      return false;
    }
  }

  _label(section) {
    return this.t[section.labelKey] || section.labelKey;
  }

  _description(section) {
    return this.t[section.descriptionKey] || "";
  }

  _callSection(method, arg) {
    if (this._sectionEl && typeof this._sectionEl[method] === "function") {
      this._sectionEl[method](arg);
    }
  }

  static get styles() {
    return [
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          display: block;
          box-sizing: border-box;
          /* follow the HAX UI theme switch, not only the OS, so light-dark()
             here and in the slotted sections agree with the --hax-ui-*
             colors; without HAX UI styles it inherits as before */
          color-scheme: var(--hax-ui-color-scheme, inherit);
          position: relative;
          height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                48px
              )
          );
          min-height: 320px;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          /* proposed tokens, written as their DDD values until adopted:
             --hax-ui-sunken, --hax-ui-primary(-hover), --hax-ui-on-primary */
          --haxcms-site-admin-sunken: light-dark(
            var(--ddd-theme-default-limestoneMaxLight, #f2f2f4),
            rgba(0, 0, 0, 0.22)
          );
          --haxcms-site-admin-primary: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-linkLight, #cce9ff)
          );
          --haxcms-site-admin-primary-hover: light-dark(
            var(--ddd-theme-default-beaverBlue, #1e407c),
            var(--ddd-theme-default-skyLight, #ccf0ff)
          );
          --haxcms-site-admin-on-primary: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
          flex: none;
        }
        button {
          font-family: inherit;
        }
        button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }

        /* launcher */
        .launcher {
          height: 100%;
          overflow: auto;
          padding: var(--ddd-spacing-5, 20px) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-6, 24px);
        }
        .launcher h2 {
          margin: 0;
          font-size: 22px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.2;
        }
        .launcher > p {
          margin: var(--hax-ui-gap) 0 var(--ddd-spacing-5, 20px);
          color: var(--hax-ui-text-muted);
        }
        .primary-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: var(--hax-ui-gap-lg);
        }
        .pcard {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2, 8px);
          min-height: 150px;
          padding: var(--ddd-spacing-4, 16px);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          transition: border-color var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .pcard:hover {
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-hover);
        }
        .pcard:focus-visible,
        .acard:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .pcard .ic {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: var(--hax-ui-radius-lg);
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
          --simple-icon-width: 28px;
          --simple-icon-height: 28px;
        }
        .pcard .name {
          font-size: 17px;
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .card-desc {
          font-size: 13px;
          line-height: 1.35;
          color: var(--hax-ui-text-muted);
        }
        .group-title {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
          margin: var(--ddd-spacing-6, 24px) 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .group-title::after {
          content: "";
          flex: 1;
          border-top: 1px solid var(--hax-ui-line);
        }
        .advanced-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--hax-ui-gap-md);
        }
        .acard {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
          min-height: 56px;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          transition: border-color var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .acard:hover {
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-hover);
        }
        .acard .ic {
          width: 32px;
          height: 32px;
          flex: none;
          display: grid;
          place-items: center;
          border-radius: var(--hax-ui-radius);
          background-color: var(--haxcms-site-admin-sunken);
        }
        .acard .name {
          display: block;
          font-size: 15px;
          font-weight: var(--ddd-font-weight-bold, 700);
        }

        /* section layout */
        .section {
          display: flex;
          height: 100%;
          min-height: 0;
        }
        .section {
          position: relative;
          --haxcms-site-admin-rail-width: 192px;
          /* proposed --hax-ui-rail-width-collapsed */
          --haxcms-site-admin-rail-collapsed: 56px;
        }
        .rail {
          width: var(--haxcms-site-admin-rail-width);
          flex: none;
          transition: width var(--hax-ui-duration) var(--hax-ui-easing);
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: var(--hax-ui-gap-md);
          overflow: auto;
          background-color: var(--haxcms-site-admin-sunken);
          border-right: 1px solid var(--hax-ui-line);
        }
        .rail ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .rail-help {
          margin-top: auto;
          padding-top: var(--hax-ui-gap-md);
          border-top: 1px solid var(--hax-ui-line);
        }
        .rail-label {
          padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-md) var(--hax-ui-gap);
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .rail-item {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          width: 100%;
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text);
        }
        .rail-item:hover {
          background-color: var(--hax-ui-hover);
        }
        .rail-item:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        .rail-row {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .rail-row .rail-item {
          flex: 1;
          min-width: 0;
        }
        .rail-toggle {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          flex: none;
          display: grid;
          place-items: center;
          width: 24px;
          height: var(--hax-ui-row-height);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text-muted);
        }
        .rail-toggle:hover {
          background-color: var(--hax-ui-hover);
          color: var(--hax-ui-text);
        }
        .rail-toggle:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        .rail-toggle simple-icon-lite {
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .rail-toggle[aria-expanded="true"] simple-icon-lite {
          transform: rotate(90deg);
        }
        /* parts sit one indent in, under a guide line from the section's
           icon with a tick into each part, like outline-designer's tree */
        .rail-sub {
          margin: 2px 0 var(--hax-ui-gap);
        }
        .rail-sub > li {
          position: relative;
          padding-left: var(--hax-ui-indent);
          margin-left: calc(var(--hax-ui-gap-md) + var(--hax-ui-icon) / 2);
        }
        .rail-sub > li::before,
        .rail-sub > li::after {
          content: "";
          position: absolute;
          left: 0;
          background-color: var(--hax-ui-line-strong);
        }
        .rail-sub > li::before {
          top: 0;
          bottom: 0;
          width: 1px;
        }
        .rail-sub > li:last-child::before {
          bottom: 50%;
        }
        .rail-sub > li::after {
          top: 50%;
          width: calc(var(--hax-ui-indent) - 6px);
          height: 1px;
        }
        .rail-item.sub {
          height: calc(var(--hax-ui-row-height) - 4px);
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .rail-item.sub simple-icon-lite {
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          opacity: 0.8;
        }
        .rail-item.sub .label {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rail-item[aria-current="true"] {
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .rail-item.sub[aria-current="location"] {
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
        }
        .rail-badge {
          flex: none;
          min-width: 20px;
          padding: 0 6px;
          border-radius: var(--hax-ui-radius-pill);
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.6;
          text-align: center;
          font-variant-numeric: tabular-nums;
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-hover);
        }
        .rail-badge[data-tone="danger"] {
          color: var(--hax-ui-danger);
          background-color: var(--hax-ui-danger-soft);
        }
        .rail-badge[data-tone="warning"] {
          color: light-dark(#8a5300, #ffcf80);
          background-color: light-dark(
            var(--ddd-theme-default-warningLight, #fff4e5),
            rgba(255, 174, 0, 0.14)
          );
        }
        .rail-item[aria-current="page"] {
          font-weight: var(--ddd-font-weight-bold, 700);
          background-color: var(--hax-ui-selected);
          box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
        }
        .rail-collapse {
          margin-bottom: var(--hax-ui-gap);
          color: var(--hax-ui-text-muted);
        }
        .rail-collapse:hover {
          color: var(--hax-ui-text);
        }
        .rail-collapse .label {
          font-size: var(--hax-ui-admin-font-size-xs);
        }

        /* collapsed: icons only, each named in a tooltip */
        .rail-collapsed .rail {
          width: var(--haxcms-site-admin-rail-collapsed);
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap);
          overflow-x: hidden;
        }
        .rail-collapsed .rail-item,
        .rail-collapsed .rail-item.sub {
          position: relative;
          justify-content: center;
          padding: 0;
        }
        .rail-collapsed .rail-item .label,
        .rail-collapsed .rail-label .label {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        .rail-collapsed .rail-label {
          margin: var(--hax-ui-gap-md) var(--hax-ui-gap);
          padding: 0;
          border-top: 1px solid var(--hax-ui-line-strong);
        }
        /* the open section's parts sit in one sunken group under it */
        .rail-collapsed .rail-sub {
          margin: 2px 0 var(--hax-ui-gap);
          padding: 2px 0;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
        }
        .rail-collapsed .rail-sub > li {
          padding-left: 0;
          margin-left: 0;
        }
        .rail-collapsed .rail-sub > li::before,
        .rail-collapsed .rail-sub > li::after {
          display: none;
        }
        .rail-collapsed .rail-item.sub simple-icon-lite {
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
        }
        .rail-collapsed .rail-item.sub[aria-current="page"],
        .rail-collapsed .rail-item.sub[aria-current="location"] {
          background-color: var(--hax-ui-selected);
          box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
        }
        /* a badge becomes a dot on the icon; its number stays for readers */
        .rail-collapsed .rail-badge {
          position: absolute;
          top: 3px;
          right: 6px;
          min-width: 0;
          width: 8px;
          height: 8px;
          padding: 0;
          overflow: hidden;
          font-size: 0;
          line-height: 0;
          background-color: var(--hax-ui-text-muted);
        }
        .rail-collapsed .rail-badge[data-tone="danger"] {
          background-color: var(--hax-ui-danger);
        }
        .rail-collapsed .rail-badge[data-tone="warning"] {
          background-color: light-dark(#8a5300, #ffcf80);
        }
        .rail-tip {
          position: absolute;
          z-index: 4;
          transform: translateY(-50%);
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-medium, 500);
          white-space: nowrap;
          pointer-events: none;
          color: var(--haxcms-site-admin-on-primary);
          background-color: var(--haxcms-site-admin-primary);
          box-shadow: var(--hax-ui-shadow-popover);
        }

        /* narrow screens: icons hold their place, the open rail lays over
           the section until a pick, Esc or a click outside closes it */
        .narrow .rail {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 3;
        }
        .narrow .main {
          margin-left: var(--haxcms-site-admin-rail-collapsed);
        }
        .rail-overlay .rail {
          width: min(260px, 85%);
          box-shadow: var(--hax-ui-shadow-popover);
          /* the sunken tint is see-through in dark; lay it on the surface */
          background-color: var(--hax-ui-surface);
          background-image: linear-gradient(
            var(--haxcms-site-admin-sunken),
            var(--haxcms-site-admin-sunken)
          );
        }
        .rail-scrim {
          position: absolute;
          inset: 0;
          z-index: 3;
          background-color: rgba(0, 3, 33, 0.32);
        }

        .main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          /* keep a section's own stacking (sticky toolbars) under the rail,
             its tooltip and the open menu */
          isolation: isolate;
        }
        .ph {
          display: flex;
          align-items: flex-start;
          gap: var(--hax-ui-gap-lg);
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px)
            var(--hax-ui-gap-lg);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .ph-text {
          flex: 1;
          min-width: 0;
        }
        .ph-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
        }
        .ph h2 {
          margin: 0;
          font-size: 22px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.2;
        }
        .ph p {
          margin: var(--hax-ui-gap) 0 0;
          color: var(--hax-ui-text-muted);
        }
        .body {
          flex: 1;
          min-height: 0;
          overflow: auto;
        }
        /* a section that scrolls inside itself (Structure) fills the body */
        .body.fill {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .body.fill ::slotted(*) {
          flex: 1 1 auto;
          min-height: 0;
        }

        /* action bar */
        .ftr {
          flex: none;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
          min-height: 56px;
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px);
          border-top: 1px solid var(--hax-ui-line);
        }
        .st {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          font-size: 13px;
        }
        .st .muted,
        .st.muted {
          color: var(--hax-ui-text-muted);
        }
        .st .list {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--hax-ui-text-muted);
        }
        .st.error {
          color: var(--hax-ui-danger);
        }
        .st.saved {
          color: var(--hax-ui-text);
        }
        .st.saved simple-icon-lite {
          color: var(--hax-ui-success);
        }
        .dot {
          width: 8px;
          height: 8px;
          flex: none;
          border-radius: 50%;
          background-color: var(--hax-ui-accent-strong);
        }
        .btn {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--hax-ui-gap);
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          font-weight: var(--ddd-font-weight-medium, 500);
          white-space: nowrap;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        .btn:hover {
          background-color: var(--hax-ui-hover);
        }
        .btn:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .btn.ghost {
          border-color: transparent;
        }
        .btn.primary {
          min-width: 88px;
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--haxcms-site-admin-on-primary);
          background-color: var(--haxcms-site-admin-primary);
          border-color: var(--haxcms-site-admin-primary);
        }
        .btn.primary:hover {
          background-color: var(--haxcms-site-admin-primary-hover);
          border-color: var(--haxcms-site-admin-primary-hover);
        }
        .btn[disabled] {
          cursor: default;
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-surface);
          border-color: var(--hax-ui-line-strong);
        }
        .btn.danger:not([disabled]) {
          color: var(--hax-ui-danger);
          border-color: var(--hax-ui-danger);
        }
        .btn.ghost[disabled] {
          border-color: transparent;
          opacity: 0.6;
        }

        /* bulk actions that do not fit a narrow bar */
        .more-wrap {
          position: relative;
        }
        .more-btn simple-icon-lite {
          transform: rotate(-90deg);
        }
        .more-btn[aria-expanded="true"] simple-icon-lite {
          transform: rotate(90deg);
        }
        .more-menu {
          position: absolute;
          right: 0;
          bottom: calc(100% + 6px);
          z-index: 4;
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
          min-width: 200px;
          padding: var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .more-menu .btn {
          justify-content: flex-start;
          width: 100%;
        }

        /* narrow: a compact page header and bars that stay one row */
        .narrow .ph {
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          gap: var(--hax-ui-gap-md);
        }
        .narrow .ph h2 {
          font-size: 18px;
        }
        .narrow .ph p {
          font-size: var(--hax-ui-admin-font-size-xs);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .narrow .ftr {
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          min-height: 52px;
        }
        .narrow .st {
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .narrow .st b {
          white-space: nowrap;
        }

        /* leave prompt */
        .scrim {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: grid;
          place-items: center;
          padding: var(--ddd-spacing-4, 16px);
          background-color: rgba(0, 3, 33, 0.32);
        }
        .leave {
          width: min(460px, 100%);
          padding: var(--ddd-spacing-4, 16px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .leave h3 {
          margin: 0;
          font-size: 15px;
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .leave p {
          margin: var(--hax-ui-gap) 0 var(--hax-ui-gap-lg);
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        .leave .acts {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
        }

        @media (max-width: 1080px) {
          .primary-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .advanced-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          .primary-grid,
          .advanced-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .pcard {
            min-height: 0;
          }
          .ftr {
            flex-wrap: wrap;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pcard,
          .acard,
          .rail {
            transition: none;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      ${this.route === "admin" ? this._renderLauncher() : this._renderSection()}
      ${this._leave ? this._renderLeavePrompt() : nothing}
    `;
  }

  _renderLauncher() {
    const sections = this.visibleSections;
    const primary = sections.filter((s) => s.group === "primary");
    // About (help) sits last, after the advanced sections
    const advanced = sections
      .filter((s) => s.group === "advanced")
      .concat(sections.filter((s) => s.group === "help"));
    return html`
      <div class="launcher">
        <h2>${this.t.siteSettings}</h2>
        <p>${this.t.launcherDescription}</p>
        <div class="primary-grid">
          ${primary.map(
            (section) => html`
              <button
                type="button"
                class="pcard"
                data-route="${section.route}"
                title="${this._includesText(section)}"
                @click="${() => this._go(section.route)}"
              >
                <span class="ic"
                  ><simple-icon-lite
                    icon="${section.icon}"
                    aria-hidden="true"
                  ></simple-icon-lite
                ></span>
                <span class="name">${this._label(section)}</span>
                <span class="card-desc">${this._description(section)}</span>
              </button>
            `,
          )}
        </div>
        ${advanced.length
          ? html`
              <h3 class="group-title" id="advanced-title">
                ${this.t.advanced}
              </h3>
              <div
                class="advanced-grid"
                role="group"
                aria-labelledby="advanced-title"
              >
                ${advanced.map(
                  (section) => html`
                    <button
                      type="button"
                      class="acard"
                      data-route="${section.route}"
                      title="${this._includesText(section)}"
                      @click="${() => this._go(section.route)}"
                    >
                      <span class="ic"
                        ><simple-icon-lite
                          icon="${section.icon}"
                          aria-hidden="true"
                        ></simple-icon-lite
                      ></span>
                      <span>
                        <span class="name">${this._label(section)}</span>
                        <span class="card-desc"
                          >${this._description(section)}</span
                        >
                      </span>
                    </button>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  /** "Includes: a, b, c" for a section's hover tooltip */
  _includesText(section) {
    const parts = (section.children || []).map((child) => this._label(child));
    const base = this._description(section);
    return parts.length
      ? `${base}\n${this.t.includes.replace("{list}", () => parts.join(", "))}`
      : base;
  }

  _badge(key) {
    const badge =
      this._badges && Object.prototype.hasOwnProperty.call(this._badges, key)
        ? this._badges[key]
        : null;
    if (
      !badge ||
      badge.badge === null ||
      badge.badge === undefined ||
      badge.badge === "" ||
      badge.badge === 0
    ) {
      return nothing;
    }
    return html`<span class="rail-badge" data-tone="${badge.tone || ""}"
      >${badge.badge}</span
    >`;
  }

  _toggleExpanded(route) {
    const next = new Set(this._expanded);
    if (next.has(route)) {
      next.delete(route);
    } else {
      next.add(route);
    }
    this._expanded = next;
    this._saveExpanded();
  }

  _saveExpanded() {
    try {
      globalThis.localStorage.setItem(
        EXPANDED_KEY,
        JSON.stringify(Array.from(this._expanded)),
      );
    } catch {
      // storage blocked: the rail just forgets what was open
    }
  }

  _loadExpanded() {
    try {
      const raw = globalThis.localStorage.getItem(EXPANDED_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(list) ? list : []);
    } catch {
      return new Set();
    }
  }

  _goChild(section, child) {
    if (this._narrow) {
      this._railOpen = false;
    }
    if (child.route) {
      this._anchor = "";
      this._go(child.route);
      return;
    }
    const resolved = resolveSiteAdminRoute(this.route);
    if (resolved && resolved.section.route === section.route) {
      this._reveal(child.anchor, child.key);
      return;
    }
    this.__pendingAnchor = { anchor: child.anchor, key: child.key };
    this._go(section.route);
    // nothing to leave behind: the route change cleared it
    if (!this._leave && this.route === section.route) {
      this.__pendingAnchor = null;
    }
  }

  /**
   * Scroll the open section to a heading and open it when it is a
   * collapsed group. Finds [data-anchor], [data-group], #id or #group-id.
   */
  async _reveal(anchor, key) {
    const el = this._sectionEl;
    if (!el || !anchor) {
      return false;
    }
    if (el.updateComplete) {
      await el.updateComplete;
    }
    const root = el.shadowRoot || el;
    const target =
      root.querySelector(`[data-anchor="${anchor}"]`) ||
      root.querySelector(`[data-group="${anchor}"]`) ||
      root.querySelector(`#${anchor}`) ||
      root.querySelector(`#group-${anchor}`);
    if (!target) {
      return false;
    }
    const group =
      target.tagName === "DETAILS"
        ? target
        : target.closest
          ? target.closest("details")
          : null;
    if (group && !group.open) {
      group.open = true;
    }
    const heading =
      target.tagName === "DETAILS"
        ? target.querySelector("summary") || target
        : target;
    const reduce =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof heading.scrollIntoView === "function") {
      heading.scrollIntoView({
        block: "start",
        behavior: reduce ? "auto" : "smooth",
      });
    }
    if (!heading.hasAttribute("tabindex") && heading.tagName !== "SUMMARY") {
      heading.setAttribute("tabindex", "-1");
    }
    if (typeof heading.focus === "function") {
      heading.focus({ preventScroll: true });
    }
    this._anchor = key || anchor;
    return true;
  }

  _renderRailItems(sections) {
    const resolved = resolveSiteAdminRoute(this.route);
    const current = resolved ? resolved.section.route : this.route;
    const collapsed = this.railCollapsed;
    return sections.map((section) => {
      const children = section.children || [];
      const onSection = section.route === current;
      // collapsed to icons there is no toggle, so the open section's
      // parts show and the rest stay folded
      const open =
        children.length > 0 &&
        (collapsed ? onSection : this._expanded.has(section.route));
      return html`
        <li>
          <div class="rail-row">
            <button
              type="button"
              class="rail-item"
              data-route="${section.route}"
              aria-current="${onSection &&
              (this.route === section.route || !children.length)
                ? "page"
                : onSection
                  ? "true"
                  : "false"}"
              title="${collapsed ? "" : this._includesText(section)}"
              data-tip="${this._label(section)}"
              @click="${() => this._go(section.route)}"
            >
              <simple-icon-lite
                icon="${section.icon}"
                aria-hidden="true"
              ></simple-icon-lite>
              <span class="label">${this._label(section)}</span>
            </button>
            ${children.length && !collapsed
              ? html`<button
                  type="button"
                  class="rail-toggle"
                  data-route="${section.route}"
                  aria-expanded="${open ? "true" : "false"}"
                  aria-controls="sub-${section.route}"
                  aria-label="${(open
                    ? this.t.hideParts
                    : this.t.showParts
                  ).replace("{section}", () => this._label(section))}"
                  @click="${() => this._toggleExpanded(section.route)}"
                >
                  <simple-icon-lite
                    icon="hax:admin-chevron"
                    aria-hidden="true"
                  ></simple-icon-lite>
                </button>`
              : nothing}
          </div>
          ${open
            ? html`<ul class="rail-sub" id="sub-${section.route}">
                ${children.map((child) => {
                  const here = child.route
                    ? this.route === child.route
                    : onSection && this._anchor === child.key;
                  return html`<li>
                    <button
                      type="button"
                      class="rail-item sub ${child.icon ? "has-icon" : ""}"
                      data-route="${child.route || section.route}"
                      data-child="${child.key}"
                      aria-current="${here
                        ? child.route
                          ? "page"
                          : "location"
                        : "false"}"
                      title="${collapsed ? "" : this._label(child)}"
                      data-tip="${this._label(child)}"
                      @click="${() => this._goChild(section, child)}"
                    >
                      ${child.icon
                        ? html`<simple-icon-lite
                            icon="${child.icon}"
                            aria-hidden="true"
                          ></simple-icon-lite>`
                        : nothing}
                      <span class="label">${this._label(child)}</span>
                      ${this._badge(child.route || child.key)}
                    </button>
                  </li>`;
                })}
              </ul>`
            : nothing}
        </li>
      `;
    });
  }

  _renderSection() {
    const resolved = resolveSiteAdminRoute(this.route);
    if (!resolved) {
      return nothing;
    }
    const section = siteAdminRouteView(resolved);
    const sections = this.visibleSections;
    const primary = sections.filter((s) => s.group === "primary");
    const advanced = sections.filter((s) => s.group === "advanced");
    const help = sections.filter((s) => s.group === "help");
    const collapsed = this.railCollapsed;
    const overlay = this._narrow && this._railOpen;
    const toggleLabel = collapsed ? this.t.expandMenu : this.t.collapseMenu;
    return html`
      <div
        class="section ${collapsed ? "rail-collapsed" : ""} ${this._narrow
          ? "narrow"
          : ""} ${overlay ? "rail-overlay" : ""}"
      >
        ${overlay
          ? html`<div
              class="rail-scrim"
              aria-hidden="true"
              @click="${() => {
                this._railOpen = false;
              }}"
            ></div>`
          : nothing}
        <nav
          class="rail"
          id="rail"
          aria-label="${this.t.adminSections}"
          @pointerover="${this._showTip}"
          @pointerout="${this._hideTip}"
          @focusin="${this._showTip}"
          @focusout="${this._hideTip}"
        >
          <button
            type="button"
            class="rail-item rail-collapse"
            aria-expanded="${collapsed ? "false" : "true"}"
            aria-controls="rail"
            aria-label="${toggleLabel}"
            data-tip="${toggleLabel}"
            @click="${this.toggleRail}"
          >
            <simple-icon-lite
              icon="${collapsed
                ? "hax:admin-rail-expand"
                : "hax:admin-rail-collapse"}"
              aria-hidden="true"
            ></simple-icon-lite>
            <span class="label" aria-hidden="true">${toggleLabel}</span>
          </button>
          <ul>
            ${this._renderRailItems(primary)}
          </ul>
          ${advanced.length
            ? html`<div class="rail-label">
                  <span class="label">${this.t.advanced}</span>
                </div>
                <ul>
                  ${this._renderRailItems(advanced)}
                </ul>`
            : nothing}
          ${help.length
            ? html`<ul class="rail-help">
                ${this._renderRailItems(help)}
              </ul>`
            : nothing}
        </nav>
        <div class="main">
          ${section.header === false ? nothing : this._renderHeader(resolved)}
          <div class="body ${section.fill ? "fill" : ""}"><slot></slot></div>
          ${section.footer === "form"
            ? this._renderFormBar()
            : section.footer === "selection"
              ? this._renderSelectionBar()
              : nothing}
        </div>
        ${this._tip
          ? html`<div
              class="rail-tip"
              aria-hidden="true"
              style="${styleMap({
                top: `${this._tip.top}px`,
                left: `${this._tip.left}px`,
              })}"
            >
              ${this._tip.text}
            </div>`
          : nothing}
      </div>
    `;
  }

  _renderHeader(resolved) {
    return html`
      <div class="ph">
        <div class="ph-text">
          <h2>
            ${this._headerText && this._headerText.title
              ? this._headerText.title
              : this._label(resolved)}
          </h2>
          <p>
            ${this._headerText && this._headerText.description
              ? this._headerText.description
              : this._description(resolved)}
          </p>
        </div>
        ${this._headerActions.length
          ? html`<div class="ph-actions">
              ${this._headerActions.map(
                (action) => html`
                  <button
                    type="button"
                    class="btn header-action"
                    data-action="${action.id}"
                    ?disabled="${!!action.disabled}"
                    @click="${() =>
                      this._callSection("runHeaderAction", action.id)}"
                  >
                    ${action.icon
                      ? html`<simple-icon-lite
                          icon="${action.icon}"
                          aria-hidden="true"
                        ></simple-icon-lite>`
                      : nothing}
                    ${action.label}
                  </button>
                `,
              )}
            </div>`
          : nothing}
      </div>
    `;
  }

  _renderSelectionBar() {
    const count = this._selected;
    const text = this._selectionText
      ? this._selectionText
      : count === 0
        ? this.t.nothingSelected
        : count === 1
          ? this.t.oneSelected
          : this.t.manySelected.replace("{count}", () => count);
    return html`
      <div class="ftr selection">
        <div
          class="st ${count ? "" : "muted"}"
          role="status"
          aria-live="polite"
        >
          ${count ? html`<b>${text}</b>` : text}
        </div>
        ${count
          ? html`<button
              type="button"
              class="btn ghost clear"
              @click="${() => this._callSection("clearSelection")}"
            >
              ${this.t.clearSelection}
            </button>`
          : nothing}
        ${this._narrow && this._actions.length > 1
          ? html`${this._renderBulk(this._actions[0], count)}
              <div class="more-wrap">
                <button
                  type="button"
                  class="btn more-btn"
                  aria-haspopup="true"
                  aria-expanded="${this._moreOpen ? "true" : "false"}"
                  aria-controls="more-actions"
                  aria-label="${this.t.moreActionsLabel}"
                  ?disabled="${!count}"
                  @click="${this._toggleMore}"
                >
                  ${this.t.moreActions}
                  <simple-icon-lite
                    icon="hax:admin-chevron"
                    aria-hidden="true"
                  ></simple-icon-lite>
                </button>
                ${this._moreOpen && count
                  ? html`<div
                      class="more-menu"
                      id="more-actions"
                      role="group"
                      aria-label="${this.t.moreActionsLabel}"
                      @keydown="${this._onMoreKeydown}"
                    >
                      ${this._actions
                        .slice(1)
                        .map((action) => this._renderBulk(action, count))}
                    </div>`
                  : nothing}
              </div>`
          : this._actions.map((action) => this._renderBulk(action, count))}
      </div>
    `;
  }

  _renderBulk(action, count) {
    return html`<button
      type="button"
      class="btn bulk ${action.danger ? "danger" : ""}"
      data-action="${action.id}"
      ?disabled="${!count || !!action.disabled}"
      @click="${() => {
        this._moreOpen = false;
        this._callSection("runAction", action.id);
      }}"
    >
      ${action.icon
        ? html`<simple-icon-lite
            icon="${action.icon}"
            aria-hidden="true"
          ></simple-icon-lite>`
        : nothing}
      ${action.label}
    </button>`;
  }

  _toggleMore() {
    this._moreOpen = !this._moreOpen;
    if (this._moreOpen) {
      requestAnimationFrame(() => {
        const first = this.shadowRoot.querySelector(".more-menu .btn");
        if (first) {
          first.focus();
        }
      });
    }
  }

  _onMoreKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      this._moreOpen = false;
      const btn = this.shadowRoot.querySelector(".more-btn");
      if (btn) {
        btn.focus();
      }
    }
  }

  _statusLine() {
    switch (this._status) {
      case "dirty": {
        const count = this._changeCount || this._changes.length || 1;
        const text =
          count === 1
            ? this.t.unsavedChange
            : this.t.unsavedChanges.replace("{count}", () => count);
        return html`<span class="dot" aria-hidden="true"></span><b>${text}</b
          ><span class="list">${this._changes.join(" · ")}</span>`;
      }
      case "saving":
        return html`<span class="muted">${this.t.saving}</span>`;
      case "saved":
        return html`<simple-icon-lite
            icon="hax:admin-check"
            aria-hidden="true"
          ></simple-icon-lite
          >${this.t.allChangesSaved}`;
      case "error":
        return html`<b>${this.t.savingFailed}</b> ${this.t.changesKept}`;
      default:
        return html`${this.t.noUnsavedChanges}`;
    }
  }

  _renderFormBar() {
    const busy = this._status === "saving";
    const canDiscard = this._status === "dirty" || this._status === "error";
    const stClass =
      this._status === "error"
        ? "error"
        : this._status === "saved"
          ? "saved"
          : this._status === "dirty"
            ? ""
            : "muted";
    return html`
      <div class="ftr">
        <div
          class="st ${stClass}"
          role="${this._status === "error" ? "alert" : "status"}"
          aria-live="polite"
        >
          ${this._statusLine()}
        </div>
        <button
          type="button"
          class="btn ghost discard"
          ?disabled="${!canDiscard || busy}"
          @click="${this._discard}"
        >
          ${this.t.discard}
        </button>
        <button
          type="button"
          class="btn ${this._canSave && !busy ? "primary" : ""} save"
          ?disabled="${!this._canSave || busy}"
          @click="${this._save}"
        >
          ${busy ? this.t.saving : this.t.save}
        </button>
      </div>
    `;
  }

  _renderLeavePrompt() {
    const resolved = resolveSiteAdminRoute(this.route);
    const name = resolved ? this._label(resolved) : "";
    return html`
      <div class="scrim">
        <div
          class="leave"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="leave-title"
          aria-describedby="leave-desc"
        >
          <h3 id="leave-title">
            ${this.t.leaveTitle.replace("{section}", () => name)}
          </h3>
          <p id="leave-desc">
            ${this._changes.length
              ? this._changes.join(" · ")
              : this.t.leaveDescription}
          </p>
          <div class="acts">
            <button type="button" class="btn ghost stay" @click="${this._stay}">
              ${this.t.stay}
            </button>
            <button
              type="button"
              class="btn discard-leave"
              @click="${this._discardAndLeave}"
            >
              ${this.t.discardAndLeave}
            </button>
            <button
              type="button"
              class="btn primary save-leave"
              ?disabled="${!this._canSave}"
              @click="${this._saveAndLeave}"
            >
              ${this.t.saveAndLeave}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has("_leave") && this._leave) {
      requestAnimationFrame(() => {
        const stay = this.shadowRoot.querySelector(".leave .stay");
        if (stay) {
          stay.focus();
        }
      });
    }
  }
}

globalThis.customElements.define(HAXCMSSiteAdmin.tag, HAXCMSSiteAdmin);
export { HAXCMSSiteAdmin };
