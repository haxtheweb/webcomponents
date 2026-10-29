/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
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
} from "./site-admin-sections.js";

/**
 * Remembers, across the page reload that follows a successful save, that the
 * section the person was on was just saved. Browser storage can be blocked;
 * every read and write is guarded and the shell works without it.
 */
const SAVED_FLAG_KEY = "haxcms-site-admin-saved";
const SAVED_FLAG_MAX_AGE = 15000;

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
      _selectionText: { state: true },
      _actions: { state: true },
      _headerActions: { state: true },
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
      reports: "Reports",
      reportsDescription: "Stats and checks for this site",
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
      oneSelected: "1 selected",
      manySelected: "{count} selected",
      clearSelection: "Clear",
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
    this._selected = 0;
    this._selectionText = "";
    this._actions = [];
    this._headerActions = [];
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
      if (typeof proceed === "function") {
        proceed();
      }
      return true;
    }
    this._leave = { proceed: typeof proceed === "function" ? proceed : null };
    return false;
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
    this._headerActions = [];
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
    const section = resolved ? resolved.section : null;
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
  }

  _onSectionState(e) {
    const detail = e && e.detail ? e.detail : {};
    if (Array.isArray(detail.headerActions)) {
      this._headerActions = detail.headerActions;
    }
    if (typeof detail.selected === "number") {
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
        .rail {
          width: 192px;
          flex: none;
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
        .rail-item[aria-current="page"] {
          font-weight: var(--ddd-font-weight-bold, 700);
          background-color: var(--hax-ui-selected);
          box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
        }
        .main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
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

        /* leave prompt */
        .scrim {
          position: absolute;
          inset: 0;
          z-index: 2;
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
          .rail {
            width: 56px;
          }
          .rail-item {
            justify-content: center;
            padding: 0;
          }
          .rail-item .label,
          .rail-label {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
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
          .section {
            flex-direction: column;
          }
          .rail {
            width: auto;
            flex-direction: row;
            overflow-x: auto;
            border-right: 0;
            border-bottom: 1px solid var(--hax-ui-line);
          }
          .rail ul {
            flex-direction: row;
          }
          .rail-item {
            width: var(--hax-ui-row-height);
          }
          .ftr {
            flex-wrap: wrap;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pcard,
          .acard {
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
    const advanced = sections.filter((s) => s.group === "advanced");
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

  _renderRailItems(sections) {
    const resolved = resolveSiteAdminRoute(this.route);
    const current = resolved ? resolved.section.route : this.route;
    return sections.map(
      (section) => html`
        <li>
          <button
            type="button"
            class="rail-item"
            data-route="${section.route}"
            aria-current="${section.route === current ? "page" : "false"}"
            title="${this._label(section)}"
            @click="${() => this._go(section.route)}"
          >
            <simple-icon-lite
              icon="${section.icon}"
              aria-hidden="true"
            ></simple-icon-lite>
            <span class="label">${this._label(section)}</span>
          </button>
        </li>
      `,
    );
  }

  _renderSection() {
    const resolved = resolveSiteAdminRoute(this.route);
    if (!resolved) {
      return nothing;
    }
    const section = resolved.section;
    const sections = this.visibleSections;
    const primary = sections.filter((s) => s.group === "primary");
    const advanced = sections.filter((s) => s.group === "advanced");
    return html`
      <div class="section">
        <nav class="rail" aria-label="${this.t.adminSections}">
          <ul>
            ${this._renderRailItems(primary)}
          </ul>
          ${advanced.length
            ? html`<div class="rail-label">${this.t.advanced}</div>
                <ul>
                  ${this._renderRailItems(advanced)}
                </ul>`
            : nothing}
        </nav>
        <div class="main">
          ${section.header === false ? nothing : this._renderHeader(resolved)}
          <div class="body"><slot></slot></div>
          ${section.footer === "form"
            ? this._renderFormBar()
            : section.footer === "selection"
              ? this._renderSelectionBar()
              : nothing}
        </div>
      </div>
    `;
  }

  _renderHeader(resolved) {
    return html`
      <div class="ph">
        <div class="ph-text">
          <h2>${this._label(resolved)}</h2>
          <p>${this._description(resolved)}</p>
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
        ${this._actions.map(
          (action) => html`
            <button
              type="button"
              class="btn bulk ${action.danger ? "danger" : ""}"
              data-action="${action.id}"
              ?disabled="${!count || !!action.disabled}"
              @click="${() => this._callSection("runAction", action.id)}"
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
      </div>
    `;
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
            icon="icons:check"
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
