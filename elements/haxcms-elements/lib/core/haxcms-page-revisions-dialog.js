/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { sanitizeHTMLString } from "@haxtheweb/utils/utils.js";
import {
  REVISION_FILTERS,
  describeRevision,
  revisionMatchesFilter,
  revisionTime,
  groupRevisionsByDay,
  diffPageText,
  diffPageSource,
  collapseUnchanged,
  diffItemMetadata,
} from "./revisions/revision-model.js";

const PAGE_SIZE = 25;

/**
 * `haxcms-page-revisions-dialog`
 * Page history: every saved version of one page, what changed it and who,
 * and a restore that says what it will do first. A section of the site
 * admin dialog (Content › Page history); see haxtheweb/issues#3191.
 *
 * Talks to haxcms-site-editor through the same events as before:
 * haxcms-load-node-revisions / -revision and haxcms-restore-node-revision,
 * answered by haxcms-node-revisions-loaded, haxcms-node-revision-loaded,
 * haxcms-node-revision-restored and haxcms-node-revision-restore-failed.
 * @element haxcms-page-revisions-dialog
 */
class HAXCMSPageRevisionsDialog extends I18NMixin(LitElement) {
  static get tag() {
    return "haxcms-page-revisions-dialog";
  }

  static get properties() {
    return {
      nodeId: { type: String, attribute: "node-id" },
      nodeTitle: { type: String, attribute: "node-title" },
      /** set by the site admin dialog before it connects */
      inShell: { type: Boolean, reflect: true, attribute: "in-shell" },
      revisions: { type: Array },
      total: { type: Number },
      selectedHash: { type: String, attribute: "selected-hash" },
      /** "change": what this revision did; "now": it against the current */
      compareMode: { type: String, attribute: "compare-mode", reflect: true },
      /** "text" word diff, "rendered" the version, "source" HTML diff */
      viewMode: { type: String, attribute: "view-mode", reflect: true },
      filter: { type: String },
      loading: { type: Boolean, reflect: true },
      restoring: { type: Boolean, reflect: true },
      _details: { state: true },
      _confirm: { state: true },
      _error: { state: true },
      _showAll: { state: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      pageHistory: "Page history",
      loadingRevisions: "Loading page history…",
      revisionCountSingular: "{count} saved version",
      revisionCountPlural: "{count} saved versions",
      noRevisionsFound: "No saved versions of this page yet.",
      noneMatch: "No versions match this filter.",
      filterBy: "Show changes",
      filterAll: "All",
      filterContent: "Content",
      filterStructure: "Structure",
      filterDetails: "Page details",
      filterRestore: "Restores",
      today: "Today",
      yesterday: "Yesterday",
      showOlder: "Show older versions",
      current: "Current",
      agent: "AI agent",
      system: "System",
      unlabelled: "Not labelled",
      unlabelledHelp:
        "Made outside HAX, or by a tool that did not say what it changed. It can be viewed and restored, but not replayed.",
      opContent: "Content edit",
      opReplace: "Find and replace",
      opOutline: "Outline change",
      opSlugs: "Addresses updated",
      opDeleted: "Page deleted",
      opDetails: "Page details",
      opCreated: "Page created",
      opSiteCreated: "Site created",
      opRestore: "Restore",
      opDirect: "Direct edit",
      opSystem: "System update",
      opExternal: "Outside HAX",
      opOther: "Other change",
      by: "by {name}",
      unknownAuthor: "Unknown",
      thisChange: "This change",
      compareWithNow: "Compare with now",
      compareMode: "What to compare",
      viewMode: "How to show it",
      viewText: "Text",
      viewRendered: "Rendered",
      viewSource: "HTML",
      isCurrent: "This is the current version of the page.",
      addedWords: "+{count} words",
      removedWords: "−{count} words",
      addedLines: "+{count} lines",
      removedLines: "−{count} lines",
      noTextChange: "The page's text did not change.",
      noTextChangeStructure:
        "The page's content wasn't edited; this change moved or renamed it. Use Structure to change where it sits.",
      noSourceChange: "The page's HTML did not change.",
      firstVersion:
        "This is the first saved version, so everything in it was added.",
      needsOlder: "Load older versions to see what this one changed.",
      legendAdded: "Added",
      legendRemoved: "Removed",
      legendRestoreAdds: "Comes back on restore",
      legendRestoreRemoves: "Goes away on restore",
      unchangedWords: "… {count} unchanged words …",
      unchangedLines: "… {count} unchanged lines …",
      loadingVersion: "Loading this version…",
      showFullText: "Show the full text",
      detailsChanged: "Page details changed",
      field: "Field",
      before: "Before",
      after: "After",
      fieldTitle: "Title",
      fieldDescription: "Description",
      fieldSlug: "Address",
      fieldPublished: "Published",
      fieldHideInMenu: "Hidden from menus",
      fieldLocked: "Locked",
      yes: "Yes",
      no: "No",
      empty: "(empty)",
      technical: "Technical details",
      techOp: "Operation",
      techActor: "Made by",
      techTxn: "Request",
      techCommit: "Commit",
      techMessage: "Commit message",
      techDate: "Saved",
      actorH: "Person (H)",
      actorA: "AI agent (A)",
      actorS: "System (S)",
      actorX: "Not labelled (X)",
      guessed: "worked out from the message wording",
      restoreThis: "Restore this version",
      restoreTitle: "Restore the version from {when}?",
      restoreWhat: "What happens",
      restoreContent:
        "The page's content goes back to this version ({added}, {removed} compared with now).",
      restoreContentPlain: "The page's content goes back to this version.",
      restoreDetails: "Its title and description go back to this version too.",
      restoreStays:
        "Where the page sits in the outline and its address stay as they are.",
      restoreNothingLost:
        "Nothing is deleted: the current version stays in the history and can be restored later.",
      restoreUndoes: "This undoes {count} later changes:",
      restoreUndoesOne: "This undoes 1 later change:",
      restoreRecorded: "Recorded as a new change: {message}",
      cancel: "Cancel",
      restoring: "Restoring…",
      restoreFailed: "The version could not be restored. Nothing changed.",
      selectVersion: "Choose a version to see what changed.",
      historyOf: "Page history: {title}",
      historyDescription:
        "Every saved version of this page, what changed it and who. Restoring adds a new version; nothing is lost.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.nodeId = "";
    this.nodeTitle = "";
    this.inShell = false;
    this.revisions = [];
    this.total = 0;
    this.selectedHash = "";
    this.compareMode = "change";
    this.viewMode = "text";
    this.filter = "all";
    this.loading = false;
    this.restoring = false;
    this._details = {};
    this._confirm = null;
    this._error = "";
    this._showAll = false;
    this.__pending = new Set();
    this.__appending = false;
    this.__selectAfterLoad = "";
    this._onRevisionsLoaded = this._onRevisionsLoaded.bind(this);
    this._onRevisionLoaded = this._onRevisionLoaded.bind(this);
    this._onRevisionRestored = this._onRevisionRestored.bind(this);
    this._onRestoreFailed = this._onRestoreFailed.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.__controller = new AbortController();
    const signal = this.__controller.signal;
    globalThis.addEventListener(
      "haxcms-node-revisions-loaded",
      this._onRevisionsLoaded,
      { signal },
    );
    globalThis.addEventListener(
      "haxcms-node-revision-loaded",
      this._onRevisionLoaded,
      { signal },
    );
    globalThis.addEventListener(
      "haxcms-node-revision-restored",
      this._onRevisionRestored,
      { signal },
    );
    globalThis.addEventListener(
      "haxcms-node-revision-restore-failed",
      this._onRestoreFailed,
      { signal },
    );
  }

  disconnectedCallback() {
    if (this.__controller) {
      this.__controller.abort();
      this.__controller = null;
    }
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (
      this.inShell &&
      (changedProperties.has("nodeTitle") || changedProperties.has("inShell"))
    ) {
      // the dialog header names the page
      this.dispatchEvent(
        new CustomEvent("haxcms-admin-section-state", {
          bubbles: false,
          composed: false,
          detail: {
            headerText: {
              title: this.nodeTitle
                ? this.t.historyOf.replace("{title}", () => this.nodeTitle)
                : this.t.pageHistory,
              description: this.t.historyDescription,
            },
          },
        }),
      );
    }
    if (changedProperties.has("nodeId")) {
      this.revisions = [];
      this.total = 0;
      this.selectedHash = "";
      this._details = {};
      this.__pending = new Set();
      this._loadRevisions(0);
    }
    if (changedProperties.has("_confirm") && this._confirm) {
      requestAnimationFrame(() => {
        const cancel = this.shadowRoot.querySelector(".confirm .cancel");
        if (cancel) {
          cancel.focus();
        }
      });
    }
  }

  // --- data -------------------------------------------------------------

  _nodeId() {
    return typeof this.nodeId === "string"
      ? this.nodeId.trim()
      : this.nodeId
        ? String(this.nodeId)
        : "";
  }

  _loadRevisions(offset) {
    const nodeId = this._nodeId();
    if (!nodeId) {
      return;
    }
    this.loading = true;
    this.__appending = offset > 0;
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-load-node-revisions", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          nodeId: nodeId,
          limit: PAGE_SIZE,
          offset: offset,
          source: "haxcms-page-revisions-dialog",
        },
      }),
    );
  }

  /** ask for a version's content once; the answer lands in _details */
  _ensureDetail(hash) {
    const nodeId = this._nodeId();
    if (
      !nodeId ||
      !hash ||
      Object.prototype.hasOwnProperty.call(this._details, hash) ||
      this.__pending.has(hash)
    ) {
      return;
    }
    this.__pending.add(hash);
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-load-node-revision", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          nodeId: nodeId,
          hash: hash,
          source: "haxcms-page-revisions-dialog",
        },
      }),
    );
  }

  _isForThisPage(e) {
    const data = e && e.detail && e.detail.data ? e.detail.data : null;
    if (!data) {
      return null;
    }
    const incoming =
      data.nodeId !== undefined && data.nodeId !== null
        ? String(data.nodeId).trim()
        : "";
    return incoming && incoming === this._nodeId() ? data : null;
  }

  _onRevisionsLoaded(e) {
    const data = this._isForThisPage(e);
    if (!data) {
      return;
    }
    this.loading = false;
    const rows = (Array.isArray(data.revisions) ? data.revisions : [])
      .filter((row) => row && typeof row === "object")
      .map((row) => describeRevision(row));
    // keep git's order (newest first): "This change" compares each version
    // with the one after it in this list, so dates must not reorder it
    const merged = this.__appending ? this.revisions.concat(rows) : rows;
    this.revisions = merged;
    this.total =
      typeof data.total === "number" ? data.total : this.revisions.length;
    if (typeof data.nodeTitle === "string" && data.nodeTitle.trim()) {
      this.nodeTitle = data.nodeTitle.trim();
    }
    const want = this.__selectAfterLoad || this.selectedHash;
    this.__selectAfterLoad = "";
    const keep = this.revisions.find((r) => r.hash === want);
    this._select(
      keep ? keep.hash : this.revisions.length ? this.revisions[0].hash : "",
    );
  }

  _onRevisionLoaded(e) {
    const data = this._isForThisPage(e);
    if (!data || !data.revision || !data.revision.hash) {
      return;
    }
    const full = data.revision.hash;
    // the list may hold the full hash or a prefix of it
    const row = this.revisions.find(
      (r) => r.hash === full || (r.hash && full.indexOf(r.hash) === 0),
    );
    const key = row ? row.hash : full;
    this.__pending.delete(key);
    this._details = Object.assign({}, this._details, {
      [key]: {
        content: typeof data.content === "string" ? data.content : "",
        itemMetadata:
          data.itemMetadata && typeof data.itemMetadata === "object"
            ? data.itemMetadata
            : null,
        hasItemMetadata: !!data.hasItemMetadata,
      },
    });
  }

  _onRevisionRestored(e) {
    const data = this._isForThisPage(e);
    if (!data) {
      return;
    }
    this.restoring = false;
    this._confirm = null;
    this._error = "";
    this._details = {};
    this.__pending = new Set();
    // the restore is the newest version now: show it
    this.selectedHash = "";
    this.__selectAfterLoad = "";
    this._loadRevisions(0);
  }

  _onRestoreFailed(e) {
    const detail = e && e.detail ? e.detail : {};
    if (detail.nodeId && String(detail.nodeId) !== this._nodeId()) {
      return;
    }
    this.restoring = false;
    this._error = this.t.restoreFailed;
  }

  // --- selection --------------------------------------------------------

  _index(hash) {
    for (let i = 0; i < this.revisions.length; i++) {
      if (this.revisions[i].hash === hash) {
        return i;
      }
    }
    return -1;
  }

  _select(hash) {
    this.selectedHash = hash || "";
    this._showAll = false;
    if (!hash) {
      return;
    }
    const index = this._index(hash);
    this._ensureDetail(hash);
    if (index > 0 || this.compareMode === "now") {
      this._ensureDetail(this.revisions[0].hash);
    }
    if (index >= 0 && index + 1 < this.revisions.length) {
      this._ensureDetail(this.revisions[index + 1].hash);
    }
  }

  _setCompare(mode) {
    this.compareMode = mode;
    this._showAll = false;
    if (this.revisions.length) {
      this._ensureDetail(this.revisions[0].hash);
    }
  }

  _onRowKeydown(e) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
      return;
    }
    const rows = Array.from(this.shadowRoot.querySelectorAll("button.rev"));
    const at = rows.indexOf(e.currentTarget);
    const next = rows[at + (e.key === "ArrowDown" ? 1 : -1)];
    if (next) {
      e.preventDefault();
      next.focus();
      this._select(next.getAttribute("data-hash"));
    }
  }

  // --- restore ----------------------------------------------------------

  _openRestore() {
    const index = this._index(this.selectedHash);
    if (index <= 0) {
      return;
    }
    this._error = "";
    this._confirm = { hash: this.selectedHash };
  }

  _restore() {
    if (!this._confirm || this.restoring) {
      return;
    }
    this.restoring = true;
    this._error = "";
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-restore-node-revision", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          nodeId: this._nodeId(),
          hash: this._confirm.hash,
          source: "haxcms-page-revisions-dialog",
        },
      }),
    );
  }

  _cancelRestore() {
    if (this.restoring) {
      return;
    }
    this._confirm = null;
    this._error = "";
    requestAnimationFrame(() => {
      const btn = this.shadowRoot.querySelector(".restore-btn");
      if (btn) {
        btn.focus();
      }
    });
  }

  _onConfirmKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      this._cancelRestore();
    }
  }

  // --- formatting -------------------------------------------------------

  _label(revision) {
    return this.t[revision.labelKey] || revision.labelKey;
  }

  _time(revision) {
    const time = revisionTime(revision);
    if (!time) {
      return "";
    }
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(time));
  }

  _dateTime(revision) {
    const time = revisionTime(revision);
    if (!time) {
      return "";
    }
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(time));
  }

  _ago(revision) {
    const time = revisionTime(revision);
    if (!time || typeof Intl.RelativeTimeFormat !== "function") {
      return "";
    }
    const delta = time - Date.now();
    const units = [
      ["year", 31536000000],
      ["month", 2592000000],
      ["week", 604800000],
      ["day", 86400000],
      ["hour", 3600000],
      ["minute", 60000],
    ];
    let unit = ["minute", 60000];
    for (let i = 0; i < units.length; i++) {
      if (Math.abs(delta) >= units[i][1]) {
        unit = units[i];
        break;
      }
    }
    return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
      Math.round(delta / unit[1]),
      unit[0],
    );
  }

  _dayLabel(group) {
    if (group.kind === "today") {
      return this.t.today;
    }
    if (group.kind === "yesterday") {
      return this.t.yesterday;
    }
    if (!group.time) {
      return this.t.unknownAuthor;
    }
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year:
        new Date(group.time).getFullYear() === new Date().getFullYear()
          ? undefined
          : "numeric",
    }).format(new Date(group.time));
  }

  _count(key, count) {
    return this.t[key].replace("{count}", () => count);
  }

  _metaValue(field, value) {
    if (typeof value === "boolean") {
      return value ? this.t.yes : this.t.no;
    }
    if (value === undefined || value === null || value === "") {
      return this.t.empty;
    }
    return String(value);
  }

  // --- styles -----------------------------------------------------------

  static get styles() {
    return [
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          display: block;
          height: 100%;
          min-height: 0;
          box-sizing: border-box;
          color-scheme: var(--hax-ui-color-scheme, inherit);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          /* proposed --hax-ui-success-soft, written from the token it
             would wrap until it is adopted */
          --revisions-ins-bg: color-mix(
            in srgb,
            var(--hax-ui-success) 18%,
            transparent
          );
          --revisions-del-bg: var(--hax-ui-danger-soft);
          --revisions-sunken: light-dark(
            var(--ddd-theme-default-limestoneMaxLight, #f2f2f4),
            rgba(0, 0, 0, 0.22)
          );
          --revisions-primary: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-linkLight, #cce9ff)
          );
          --revisions-on-primary: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          position: relative;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        button {
          font-family: inherit;
          font-size: inherit;
          color: inherit;
        }
        button:focus-visible,
        summary:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        simple-icon-lite {
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
          --simple-icon-color: currentColor;
          flex: none;
        }
        .layout {
          display: grid;
          grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
          height: 100%;
          min-height: 0;
        }

        /* timeline */
        .list {
          display: flex;
          flex-direction: column;
          min-height: 0;
          border-right: 1px solid var(--hax-ui-line);
          background-color: var(--revisions-sunken);
        }
        .list-head {
          padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-lg)
            var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .count {
          margin: 0 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap);
        }
        .chip {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          height: 26px;
          padding: 0 var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-pill);
          font-size: var(--hax-ui-admin-font-size-xs);
          background-color: var(--hax-ui-surface);
        }
        .chip:hover {
          background-color: var(--hax-ui-hover);
        }
        .chip:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .chip[aria-pressed="true"] {
          font-weight: var(--ddd-font-weight-bold, 700);
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        .chip .n {
          font-variant-numeric: tabular-nums;
          color: var(--hax-ui-text-muted);
        }
        .scroll {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: 0 var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
        }
        .day {
          margin: 0;
          padding: var(--hax-ui-gap-lg) var(--hax-ui-gap) var(--hax-ui-gap);
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
          position: sticky;
          top: 0;
          z-index: 1;
          background-color: var(--revisions-sunken);
        }
        ol,
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .rev {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2px var(--hax-ui-gap-md);
          width: 100%;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          margin-bottom: 2px;
        }
        .rev:hover {
          background-color: var(--hax-ui-hover);
        }
        .rev:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        .rev[aria-current="true"] {
          background-color: var(--hax-ui-selected);
          box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
        }
        .rev .what {
          font-weight: var(--ddd-font-weight-bold, 700);
          min-width: 0;
        }
        .rev .when {
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .rev .sum {
          grid-column: 1 / -1;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rev .who {
          grid-column: 1 / -1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        /* outlined so it reads on a selected row too; the check and the
           word carry it, not the colour */
        .hax-ui-pill[data-tone="current"] {
          color: var(--hax-ui-text);
          background-color: transparent;
          box-shadow: inset 0 0 0 1px var(--hax-ui-success);
        }
        .hax-ui-pill[data-tone="current"] simple-icon-lite {
          --simple-icon-width: 12px;
          --simple-icon-height: 12px;
          color: var(--hax-ui-success);
        }
        .hax-ui-pill[data-tone="muted"] {
          color: var(--hax-ui-text-muted);
          background-color: transparent;
          box-shadow: inset 0 0 0 1px var(--hax-ui-line-strong);
        }
        .more {
          margin: var(--hax-ui-gap-md) var(--hax-ui-gap);
        }
        .empty {
          margin: var(--hax-ui-gap-lg) var(--hax-ui-gap);
          padding: var(--ddd-spacing-4, 16px);
          text-align: center;
          color: var(--hax-ui-text-muted);
          border: 1px dashed var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
        }

        /* one version */
        .detail {
          display: flex;
          flex-direction: column;
          min-height: 0;
          min-width: 0;
        }
        .detail-scroll {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px);
        }
        .detail h3 {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin: 0;
          font-size: 18px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.3;
        }
        .detail .sub {
          margin: var(--hax-ui-gap) 0 0;
          color: var(--hax-ui-text-muted);
        }
        .note {
          margin: var(--hax-ui-gap-md) 0 0;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          background-color: var(--revisions-sunken);
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
          margin: var(--hax-ui-gap-lg) 0 var(--hax-ui-gap-md);
        }
        .seg {
          display: inline-flex;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
        }
        .seg button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          height: 30px;
          padding: 0 var(--hax-ui-gap-lg);
          font-size: 13px;
          border-right: 1px solid var(--hax-ui-line-strong);
        }
        .seg button:last-child {
          border-right: 0;
        }
        .seg button:hover {
          background-color: var(--hax-ui-hover);
        }
        .seg button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        .seg button[aria-pressed="true"] {
          font-weight: var(--ddd-font-weight-bold, 700);
          background-color: var(--hax-ui-accent-soft);
        }
        .seg button[disabled] {
          cursor: default;
          color: var(--hax-ui-text-muted);
          background-color: transparent;
        }
        .stats {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .stats .plus {
          color: var(--hax-ui-success);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .stats .minus {
          color: var(--hax-ui-danger);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .legend {
          display: inline-flex;
          gap: var(--hax-ui-gap-md);
        }
        .diff {
          margin-top: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          line-height: 1.6;
          overflow-wrap: anywhere;
        }
        .diff.source {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas,
            monospace;
          font-size: 12px;
          line-height: 1.5;
        }
        /* each run keeps its own spaces and line breaks; the box ignores
           the template's */
        .diff .eq,
        .diff ins,
        .diff del {
          white-space: pre-wrap;
        }
        ins,
        del {
          text-decoration-thickness: 1.5px;
          border-radius: 2px;
        }
        ins {
          text-decoration: underline;
          background-color: var(--revisions-ins-bg);
        }
        del {
          text-decoration: line-through;
          background-color: var(--revisions-del-bg);
        }
        .skip {
          display: block;
          margin: var(--hax-ui-gap) 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-style: italic;
          color: var(--hax-ui-text-muted);
        }
        .rendered {
          margin-top: var(--hax-ui-gap-md);
          padding: var(--ddd-spacing-4, 16px);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          font-family: var(--ddd-font-primary, sans-serif);
          overflow: auto;
        }
        .rendered img,
        .rendered video,
        .rendered iframe {
          max-width: 100%;
        }
        .linkish {
          all: unset;
          cursor: pointer;
          color: var(--hax-ui-accent);
          text-decoration: underline;
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .linkish:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        h4 {
          margin: var(--ddd-spacing-5, 20px) 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--hax-ui-admin-font-size-xs);
          border: 1px solid var(--hax-ui-line);
        }
        th {
          text-align: left;
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text-muted);
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line-strong);
        }
        td {
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
          vertical-align: top;
          overflow-wrap: anywhere;
        }
        details.tech {
          margin-top: var(--ddd-spacing-5, 20px);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
        }
        details.tech summary {
          cursor: pointer;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        dl {
          display: grid;
          grid-template-columns: max-content 1fr;
          gap: var(--hax-ui-gap) var(--hax-ui-gap-lg);
          margin: 0;
          padding: 0 var(--hax-ui-gap-lg) var(--hax-ui-gap-lg);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        dt {
          color: var(--hax-ui-text-muted);
        }
        dd {
          margin: 0;
          overflow-wrap: anywhere;
        }
        code {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas,
            monospace;
        }
        .actions {
          flex: none;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-lg);
          min-height: 56px;
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px);
          border-top: 1px solid var(--hax-ui-line);
        }
        .actions .hint {
          flex: 1;
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        .btn {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          font-weight: var(--ddd-font-weight-medium, 500);
          white-space: nowrap;
          background-color: var(--hax-ui-surface);
        }
        .btn:hover {
          background-color: var(--hax-ui-hover);
        }
        .btn:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .btn.primary {
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--revisions-on-primary);
          background-color: var(--revisions-primary);
          border-color: var(--revisions-primary);
        }
        .btn[disabled] {
          cursor: default;
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-surface);
          border-color: var(--hax-ui-line-strong);
        }

        /* restore confirmation */
        .scrim {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: grid;
          place-items: center;
          padding: var(--ddd-spacing-4, 16px);
          background-color: rgba(0, 3, 33, 0.32);
        }
        .confirm {
          width: min(560px, 100%);
          max-height: 100%;
          overflow: auto;
          padding: var(--ddd-spacing-5, 20px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .confirm h3 {
          margin: 0 0 var(--hax-ui-gap-lg);
          font-size: 17px;
        }
        .confirm ul.facts {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
          margin: 0 0 var(--hax-ui-gap-lg);
        }
        .confirm ul.facts > li {
          display: flex;
          gap: var(--hax-ui-gap-md);
          align-items: flex-start;
        }
        .confirm ul.undone {
          margin: var(--hax-ui-gap) 0 0;
          padding-left: var(--hax-ui-gap-lg);
          border-left: 2px solid var(--hax-ui-line-strong);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .confirm .recorded {
          margin: 0 0 var(--hax-ui-gap-lg);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .confirm .error {
          margin: 0 0 var(--hax-ui-gap-lg);
          color: var(--hax-ui-danger);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .confirm .acts {
          display: flex;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
        }

        @media (max-width: 760px) {
          .layout {
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: minmax(160px, 40%) minmax(0, 1fr);
          }
          .list {
            border-right: 0;
            border-bottom: 1px solid var(--hax-ui-line);
          }
        }
      `,
    ];
  }

  // --- render -----------------------------------------------------------

  render() {
    return html`
      <div class="layout">${this._renderList()} ${this._renderDetail()}</div>
      ${this._confirm ? this._renderConfirm() : nothing}
    `;
  }

  _renderList() {
    const counts = {};
    REVISION_FILTERS.forEach((f) => {
      counts[f] = this.revisions.filter((r) =>
        revisionMatchesFilter(r, f),
      ).length;
    });
    const shown = this.revisions.filter((r) =>
      revisionMatchesFilter(r, this.filter),
    );
    const groups = groupRevisionsByDay(shown);
    const labels = {
      all: this.t.filterAll,
      content: this.t.filterContent,
      structure: this.t.filterStructure,
      details: this.t.filterDetails,
      restore: this.t.filterRestore,
    };
    const newest = this.revisions.length ? this.revisions[0].hash : "";
    return html`
      <aside class="list" aria-label="${this.t.pageHistory}">
        <div class="list-head">
          <p class="count" role="status" aria-live="polite">
            ${this.loading && !this.revisions.length
              ? this.t.loadingRevisions
              : this._count(
                  this.total === 1
                    ? "revisionCountSingular"
                    : "revisionCountPlural",
                  this.total,
                )}
          </p>
          <div class="chips" role="group" aria-label="${this.t.filterBy}">
            ${REVISION_FILTERS.map(
              (f) => html`
                <button
                  type="button"
                  class="chip"
                  data-filter="${f}"
                  aria-pressed="${this.filter === f ? "true" : "false"}"
                  @click="${() => {
                    this.filter = f;
                  }}"
                >
                  ${labels[f]} <span class="n">${counts[f]}</span>
                </button>
              `,
            )}
          </div>
        </div>
        <div class="scroll">
          ${!this.loading && !this.revisions.length
            ? html`<p class="empty">${this.t.noRevisionsFound}</p>`
            : !shown.length && this.revisions.length
              ? html`<p class="empty">${this.t.noneMatch}</p>`
              : html`<ol class="timeline">
                  ${groups.map(
                    (group) => html`
                      <li>
                        <h3 class="day">${this._dayLabel(group)}</h3>
                        <ul>
                          ${group.items.map((r) =>
                            this._renderRow(r, r.hash === newest),
                          )}
                        </ul>
                      </li>
                    `,
                  )}
                </ol>`}
          ${this.revisions.length && this.revisions.length < this.total
            ? html`<button
                type="button"
                class="btn more"
                ?disabled="${this.loading}"
                @click="${() => this._loadRevisions(this.revisions.length)}"
              >
                ${this.loading ? this.t.loadingRevisions : this.t.showOlder}
              </button>`
            : nothing}
        </div>
      </aside>
    `;
  }

  _actorPills(revision, isCurrent) {
    return html`${isCurrent
      ? html`<span class="hax-ui-pill" data-tone="current"
          ><simple-icon-lite
            icon="hax:admin-check"
            aria-hidden="true"
          ></simple-icon-lite
          >${this.t.current}</span
        >`
      : nothing}
    ${revision.actor === "A"
      ? html`<span class="hax-ui-pill" data-tone="accent"
          ><simple-icon-lite
            icon="hax:admin-advanced"
            aria-hidden="true"
          ></simple-icon-lite
          >${this.t.agent}</span
        >`
      : nothing}
    ${revision.actor === "S"
      ? html`<span class="hax-ui-pill" data-tone="muted"
          >${this.t.system}</span
        >`
      : nothing}
    ${revision.external
      ? html`<span
          class="hax-ui-pill"
          data-tone="muted"
          title="${this.t.unlabelledHelp}"
          >${this.t.unlabelled}</span
        >`
      : nothing}`;
  }

  _renderRow(revision, isCurrent) {
    return html`
      <li>
        <button
          type="button"
          class="rev"
          data-hash="${revision.hash}"
          data-family="${revision.family}"
          aria-current="${revision.hash === this.selectedHash
            ? "true"
            : "false"}"
          @click="${() => this._select(revision.hash)}"
          @keydown="${this._onRowKeydown}"
        >
          <span class="what">${this._label(revision)}</span>
          <span class="when">${this._time(revision)}</span>
          ${revision.summary
            ? html`<span class="sum" title="${revision.summary}"
                >${revision.summary}</span
              >`
            : nothing}
          <span class="who"
            >${this.t.by.replace(
              "{name}",
              () => revision.author || this.t.unknownAuthor,
            )}
            ${this._actorPills(revision, isCurrent)}</span
          >
        </button>
      </li>
    `;
  }

  /**
   * The two versions being compared for the selected revision, or a reason
   * there is nothing to compare.
   */
  _comparison(index, mode) {
    const selected = this.revisions[index];
    const mine = this._details[selected.hash];
    if (mode === "now") {
      const now = this._details[this.revisions[0].hash];
      if (!mine || !now) {
        return { loading: true };
      }
      // read as "what restoring this version would do to the page now"
      return { before: now, after: mine, restoreView: true };
    }
    const parentRow = this.revisions[index + 1];
    if (!parentRow) {
      if (this.revisions.length < this.total) {
        return { needsOlder: true };
      }
      if (!mine) {
        return { loading: true };
      }
      return { before: { content: "" }, after: mine, first: true };
    }
    const parent = this._details[parentRow.hash];
    if (!mine || !parent) {
      return { loading: true };
    }
    return { before: parent, after: mine };
  }

  _renderDetail() {
    const index = this._index(this.selectedHash);
    if (index < 0) {
      return html`<section class="detail">
        <div class="detail-scroll">
          ${this.loading
            ? html`<p class="note">${this.t.loadingRevisions}</p>`
            : html`<p class="empty">${this.t.selectVersion}</p>`}
        </div>
      </section>`;
    }
    const revision = this.revisions[index];
    const isCurrent = index === 0;
    const mode = isCurrent ? "change" : this.compareMode;
    return html`
      <section class="detail" aria-labelledby="rev-title">
        <div class="detail-scroll">
          <h3 id="rev-title">
            ${this._label(revision)} ${this._actorPills(revision, isCurrent)}
          </h3>
          <p class="sub">
            ${this.t.by.replace(
              "{name}",
              () => revision.author || this.t.unknownAuthor,
            )}
            ·
            <time title="${revision.date || ""}"
              >${this._dateTime(revision)}</time
            >
            ${this._ago(revision) ? html`(${this._ago(revision)})` : nothing}
          </p>
          ${revision.summary && revision.summary !== this._label(revision)
            ? html`<p class="sub">${revision.summary}</p>`
            : nothing}
          ${isCurrent ? html`<p class="note">${this.t.isCurrent}</p>` : nothing}
          <div class="controls">
            <div class="seg" role="group" aria-label="${this.t.compareMode}">
              <button
                type="button"
                data-compare="change"
                aria-pressed="${mode === "change" ? "true" : "false"}"
                @click="${() => this._setCompare("change")}"
              >
                ${this.t.thisChange}
              </button>
              <button
                type="button"
                data-compare="now"
                aria-pressed="${mode === "now" ? "true" : "false"}"
                ?disabled="${isCurrent}"
                @click="${() => this._setCompare("now")}"
              >
                ${this.t.compareWithNow}
              </button>
            </div>
            <div class="seg" role="group" aria-label="${this.t.viewMode}">
              ${["text", "rendered", "source"].map(
                (v) =>
                  html`<button
                    type="button"
                    data-view="${v}"
                    aria-pressed="${this.viewMode === v ? "true" : "false"}"
                    @click="${() => {
                      this.viewMode = v;
                      this._showAll = false;
                    }}"
                  >
                    ${v === "text"
                      ? this.t.viewText
                      : v === "rendered"
                        ? this.t.viewRendered
                        : this.t.viewSource}
                  </button>`,
              )}
            </div>
          </div>
          ${this._renderBody(index, revision, mode)}
          ${this._renderTechnical(revision)}
        </div>
        <div class="actions">
          ${this._error && !this._confirm
            ? html`<span class="hint" role="alert">${this._error}</span>`
            : html`<span class="hint"></span>`}
          <button
            type="button"
            class="btn ${isCurrent ? "" : "primary"} restore-btn"
            data-action="restore"
            data-hash="${revision.hash}"
            ?disabled="${isCurrent || this.restoring}"
            @click="${this._openRestore}"
          >
            <simple-icon-lite
              icon="hax:admin-history"
              aria-hidden="true"
            ></simple-icon-lite>
            ${this.t.restoreThis}
          </button>
        </div>
      </section>
    `;
  }

  _renderBody(index, revision, mode) {
    const cmp = this._comparison(index, mode);
    if (cmp.needsOlder) {
      return html`<p class="note">${this.t.needsOlder}</p>
        <button
          type="button"
          class="btn more"
          @click="${() => this._loadRevisions(this.revisions.length)}"
        >
          ${this.t.showOlder}
        </button>`;
    }
    if (cmp.loading) {
      return html`<p class="note" role="status">${this.t.loadingVersion}</p>`;
    }
    const metaChanges = diffItemMetadata(
      cmp.before.itemMetadata,
      cmp.after.itemMetadata,
    );
    let body;
    if (this.viewMode === "rendered") {
      // security (JS-XSS-001): revision HTML is stored editor content, so it
      // is sanitized before the unsafeHTML sink
      body = html`<div class="rendered">
        ${unsafeHTML(sanitizeHTMLString(cmp.after.content || ""))}
      </div>`;
    } else {
      const source = this.viewMode === "source";
      const d = source
        ? diffPageSource(cmp.before.content, cmp.after.content)
        : diffPageText(cmp.before.content, cmp.after.content);
      const added = this._count(source ? "addedLines" : "addedWords", d.added);
      const removed = this._count(
        source ? "removedLines" : "removedWords",
        d.removed,
      );
      const structural =
        revision.family === "structure" || revision.op === "deleteItem";
      const runs = this._showAll
        ? d.runs
        : collapseUnchanged(d.runs, source ? 3 : 14);
      const collapsed = runs.some((r) => r.type === "skip");
      body = html`
        <div class="stats">
          ${d.changed
            ? html`<span class="plus">${added}</span
                ><span class="minus">${removed}</span>
                <span class="legend">
                  <ins
                    >${cmp.restoreView
                      ? this.t.legendRestoreAdds
                      : this.t.legendAdded}</ins
                  >
                  <del
                    >${cmp.restoreView
                      ? this.t.legendRestoreRemoves
                      : this.t.legendRemoved}</del
                  >
                </span>`
            : html`<span
                >${source
                  ? this.t.noSourceChange
                  : structural && mode === "change"
                    ? this.t.noTextChangeStructure
                    : this.t.noTextChange}</span
              >`}
          ${collapsed && d.changed
            ? html`<button
                type="button"
                class="linkish"
                @click="${() => {
                  this._showAll = true;
                }}"
              >
                ${this.t.showFullText}
              </button>`
            : nothing}
        </div>
        ${cmp.first
          ? html`<p class="note">${this.t.firstVersion}</p>`
          : nothing}
        ${d.changed || this._showAll
          ? html`<div class="diff ${source ? "source" : ""}">
              ${this._renderRuns(runs, source)}
            </div>`
          : nothing}
      `;
    }
    return html`
      ${metaChanges.length
        ? html`<h4>${this.t.detailsChanged}</h4>
            <table>
              <caption class="hax-ui-sr-only">
                ${this.t.detailsChanged}
              </caption>
              <thead>
                <tr>
                  <th scope="col">${this.t.field}</th>
                  <th scope="col">${this.t.before}</th>
                  <th scope="col">${this.t.after}</th>
                </tr>
              </thead>
              <tbody>
                ${metaChanges.map(
                  (c) =>
                    html`<tr data-field="${c.field}">
                      <td>
                        ${this.t[
                          "field" +
                            c.field.charAt(0).toUpperCase() +
                            c.field.slice(1)
                        ] || c.field}
                      </td>
                      <td><del>${this._metaValue(c.field, c.before)}</del></td>
                      <td><ins>${this._metaValue(c.field, c.after)}</ins></td>
                    </tr>`,
                )}
              </tbody>
            </table>`
        : nothing}
      ${body}
    `;
  }

  /** diff runs as inline marks; no whitespace of its own, the box keeps it */
  _renderRuns(runs, source) {
    return runs.map((run) =>
      run.type === "ins"
        ? html`<ins>${run.text}</ins>`
        : run.type === "del"
          ? html`<del>${run.text}</del>`
          : run.type === "skip"
            ? html`<span class="skip"
                >${this._count(
                  source ? "unchangedLines" : "unchangedWords",
                  run.words,
                )}</span
              >`
            : html`<span class="eq">${run.text}</span>`,
    );
  }

  _renderTechnical(revision) {
    return html`
      <details class="tech">
        <summary>${this.t.technical}</summary>
        <dl>
          <dt>${this.t.techOp}</dt>
          <dd>
            <code>${revision.op || "—"}</code>
            ${revision.inferred ? html`(${this.t.guessed})` : nothing}
          </dd>
          <dt>${this.t.techActor}</dt>
          <dd>${this.t["actor" + revision.actor] || revision.actor}</dd>
          ${revision.txn
            ? html`<dt>${this.t.techTxn}</dt>
                <dd><code>${revision.txn}</code></dd>`
            : nothing}
          <dt>${this.t.techCommit}</dt>
          <dd><code>${revision.hash}</code></dd>
          <dt>${this.t.techMessage}</dt>
          <dd><code>${revision.message || ""}</code></dd>
          <dt>${this.t.techDate}</dt>
          <dd>${revision.date || ""}</dd>
        </dl>
      </details>
    `;
  }

  _renderConfirm() {
    const index = this._index(this._confirm.hash);
    if (index <= 0) {
      return nothing;
    }
    const revision = this.revisions[index];
    const mine = this._details[revision.hash];
    const now = this._details[this.revisions[0].hash];
    const d = mine && now ? diffPageText(now.content, mine.content) : null;
    const later = this.revisions.slice(0, index);
    const message =
      "Page revision restored: " +
      (this.nodeTitle || this.t.pageHistory) +
      " (" +
      this._nodeId() +
      ") from " +
      String(revision.hash).substring(0, 12);
    return html`
      <div class="scrim" @keydown="${this._onConfirmKeydown}">
        <div
          class="confirm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <h3 id="confirm-title">
            ${this.t.restoreTitle.replace("{when}", () =>
              this._dateTime(revision),
            )}
          </h3>
          ${this._error
            ? html`<p class="error" role="alert">${this._error}</p>`
            : nothing}
          <ul class="facts">
            <li>
              <simple-icon-lite
                icon="hax:admin-content"
                aria-hidden="true"
              ></simple-icon-lite>
              <span
                >${d
                  ? this.t.restoreContent
                      .replace("{added}", () =>
                        this._count("addedWords", d.added),
                      )
                      .replace("{removed}", () =>
                        this._count("removedWords", d.removed),
                      )
                  : this.t.restoreContentPlain}</span
              >
            </li>
            ${mine && mine.hasItemMetadata
              ? html`<li>
                  <simple-icon-lite
                    icon="hax:admin-details"
                    aria-hidden="true"
                  ></simple-icon-lite>
                  <span>${this.t.restoreDetails}</span>
                </li>`
              : nothing}
            <li>
              <simple-icon-lite
                icon="hax:admin-structure"
                aria-hidden="true"
              ></simple-icon-lite>
              <span>${this.t.restoreStays}</span>
            </li>
            <li>
              <simple-icon-lite
                icon="hax:admin-history"
                aria-hidden="true"
              ></simple-icon-lite>
              <span
                >${later.length === 1
                  ? this.t.restoreUndoesOne
                  : this._count("restoreUndoes", later.length)}
                <ul class="undone">
                  ${later.map(
                    (r) =>
                      html`<li>
                        ${this._label(r)} ·
                        ${this.t.by.replace(
                          "{name}",
                          () => r.author || this.t.unknownAuthor,
                        )}
                        · ${this._dateTime(r)}
                        ${r.actor === "A" ? html`· ${this.t.agent}` : nothing}
                      </li>`,
                  )}
                </ul></span
              >
            </li>
            <li>
              <simple-icon-lite
                icon="hax:admin-check"
                aria-hidden="true"
              ></simple-icon-lite>
              <span>${this.t.restoreNothingLost}</span>
            </li>
          </ul>
          <p class="recorded">
            ${this.t.restoreRecorded.replace("{message}", () => message)}
          </p>
          <div class="acts">
            <button
              type="button"
              class="btn cancel"
              ?disabled="${this.restoring}"
              @click="${this._cancelRestore}"
            >
              ${this.t.cancel}
            </button>
            <button
              type="button"
              class="btn primary confirm-restore"
              ?disabled="${this.restoring}"
              @click="${this._restore}"
            >
              ${this.restoring ? this.t.restoring : this.t.restoreThis}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSPageRevisionsDialog.tag,
  HAXCMSPageRevisionsDialog,
);

export { HAXCMSPageRevisionsDialog };
