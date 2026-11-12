/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "./insights-styles.js";
import {
  BLOCK_SAVE_MAX_PAGES,
  blockSaveAvailable,
  groupBlockEdits,
  saveBlockEdits,
} from "./insights-block-save.js";

const LIST_LIMIT = 50;

/**
 * `insights-block-editor`
 * A Reports table of attribute rows (one attribute on one element, from the
 * analyzer) that a person edits and saves through the block operations API
 * (haxtheweb/issues#3321). Two modes:
 *  - edit: each row has a text field for its new value
 *  - preview: `proposals` (row index -> new value) are shown old -> new with
 *    a checkbox each; the checked ones are saved
 * Saving writes one change per page, a capped number of pages per click,
 * and never overwrites an element that changed since the scan. On a
 * published copy with no backend, nothing can be saved.
 *
 * The host screen passes its own translated `labels` (heading, column
 * names, the Save button) and, for edit mode, `statusOf(row, value)` so a
 * row's status updates as a person types.
 *
 * @fires insights-open-page - detail `{ slug }` to visit a page
 * @fires insights-block-saved - detail `{ saved, failed }` after a save
 * @element insights-block-editor
 */
class InsightsBlockEditor extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-block-editor";
  }

  static get properties() {
    return {
      /** attribute rows: { pageId, pageTitle, slug, tag, attribute, value, src } */
      rows: { type: Array, attribute: false },
      /** preview mode: row index -> proposed value; null for edit mode */
      proposals: { type: Object, attribute: false },
      /**
       * { heading, hint, caption, value, newValue, save, empty } in the host
       * screen's language
       */
      labels: { type: Object, attribute: false },
      /** commit note the backend adds to each page's change */
      note: { type: String },
      /** "text" or "url": the kind of value, for the input */
      kind: { type: String },
      /** pages saved per click */
      maxPages: { type: Number, attribute: "max-pages" },
      /** tag -> [attribute names] that tell two elements on a page apart */
      srcAttributes: { type: Object, attribute: false },
      /** (row, value) -> { status, tone, text } for edit mode */
      statusOf: { attribute: false },
      /** status ids to filter by, in order, with { id: label } in labels.statuses */
      statuses: { type: Array, attribute: false },
      density: { type: String, reflect: true },
      _edits: { state: true },
      _unchecked: { state: true },
      _filter: { state: true },
      _showAll: { state: true },
      _canSave: { state: true },
      _confirming: { state: true },
      _saving: { state: true },
      _progress: { state: true },
      _rowState: { state: true },
      _saveNote: { state: true },
      _announce: { state: true },
    };
  }

  constructor() {
    super();
    this.rows = [];
    this.proposals = null;
    this.labels = {};
    this.note = "";
    this.kind = "text";
    this.maxPages = BLOCK_SAVE_MAX_PAGES;
    this.srcAttributes = {};
    this.statusOf = null;
    this.statuses = [];
    this.density = "default";
    this._edits = {};
    this._unchecked = {};
    this._filter = "all";
    this._showAll = false;
    this._canSave = false;
    this._confirming = false;
    this._saving = false;
    this._progress = null;
    this._rowState = {};
    this._saveNote = null;
    this._announce = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      all: "All",
      filter: "Filter rows",
      editedNote: "{n} edited, not saved",
      checkedNote: "{n} of {total} selected",
      editHint: "Type in a field to try a new value.",
      previewHint: "Clear a row's box to leave it as it is.",
      discard: "Discard edits",
      selectAll: "Select all",
      selectNone: "Select none",
      saveNotAvailable:
        "Saving needs this site open on its HAXcms server. Open page fixes one element in the editor.",
      saveHint:
        "Saving writes each edited page as its own change, up to {max} pages per click.",
      confirmSave: "Save {n} changes on {pages} pages?",
      confirmSaveOne: "Save 1 change on 1 page?",
      confirmSaveOnePage: "Save {n} changes on 1 page?",
      confirmCap:
        "This click saves the first {max} pages; click Save again for the other {rest}.",
      confirmEditor:
        "Close these pages in the editor first. A page that changed since this scan is skipped, never overwritten.",
      saveNow: "Save now",
      cancel: "Cancel",
      savingPage: "Saving page {done} of {total}: {title}",
      savedSummary: "Saved {n} changes on {pages} pages.",
      savedSummaryOne: "Saved 1 change on 1 page.",
      savedSummaryOnePage: "Saved {n} changes on 1 page.",
      notSavedSummary: "{n} not saved; see the rows marked Not saved.",
      pagesLeftSummary: "{n} more pages have edits; click Save again.",
      pagesLeftSummaryOne: "1 more page has edits; click Save again.",
      rateLimited:
        "Stopped: the site's limit on content changes was reached. Try again in {n} seconds.",
      savedRow: "Saved",
      notSavedRow: "Not saved",
      failStale:
        "This element changed on the server since the scan. Rescan, then edit it again.",
      failLocked: "The page is locked.",
      failRefused: "The server refused this value: {detail}",
      failMissing: "The page no longer exists.",
      failError: "Could not save: {detail}",
      element: "Element and page",
      status: "Status",
      actions: "Actions",
      include: "Include",
      includeRow: "Change {attribute} on {page}",
      valueFor: "{attribute} on {element}, {page}",
      notSet: "not set",
      edited: "edited",
      openPage: "Open page",
      openPageLabel: "Open page: {title}",
      showAll: "Show all {n}",
      noRows: "Nothing to list on these pages.",
      noRowsInFilter: "Nothing in this group.",
      statusChanged: "{element}: {status}",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    blockSaveAvailable()
      .then((ok) => {
        this._canSave = ok;
      })
      .catch(() => {
        this._canSave = false;
      });
  }

  willUpdate(changed) {
    if (
      (changed.has("rows") && changed.get("rows") !== undefined) ||
      (changed.has("proposals") && changed.get("proposals") !== undefined)
    ) {
      this._edits = {};
      this._unchecked = {};
      this._rowState = {};
      this._confirming = false;
      this._showAll = false;
    }
  }

  static get styles() {
    return [
      ...InsightsStyles,
      css`
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin-bottom: var(--hax-ui-gap-md);
        }
        .toolbar .grow {
          flex: 1;
          min-width: 0;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        @container insights-screen (max-width: 560px) {
          .toolbar > .grow {
            flex: 1 1 100%;
            order: 1;
          }
        }
        td {
          padding-top: var(--hax-ui-gap);
          padding-bottom: var(--hax-ui-gap);
        }
        .meta {
          display: block;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .value-input {
          width: 100%;
          min-width: 160px;
          height: calc(var(--insights-row) - 4px);
          padding: 0 var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
        }
        .value-input[data-tone="danger"] {
          border-color: var(--hax-ui-danger);
        }
        .value-col {
          width: 40%;
        }
        .url {
          word-break: break-all;
        }
        .old {
          text-decoration: line-through;
          color: var(--hax-ui-text-muted);
        }
        .note {
          margin-top: var(--hax-ui-gap-md);
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
        .save-panel {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin-bottom: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
        }
        .save-panel p {
          flex: 1 1 100%;
          margin: 0;
        }
        .save-panel .question {
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .save-panel .actions {
          display: flex;
          gap: var(--hax-ui-gap);
        }
        .save-progress {
          flex: 0 0 160px;
        }
        .save-note {
          margin-bottom: var(--hax-ui-gap-md);
        }
        .save-state[data-state="failed"] {
          color: var(--hax-ui-danger);
        }
        .save-state[data-state="saved"] {
          color: var(--hax-ui-success);
        }
      `,
    ];
  }

  _f(str, map) {
    let out = String(str);
    Object.keys(map).forEach((k) => {
      out = out.split(`{${k}}`).join(String(map[k]));
    });
    return out;
  }

  _n(value) {
    return typeof value === "number" ? value.toLocaleString() : "0";
  }

  _label(key, fallback) {
    const l = this.labels || {};
    return typeof l[key] === "string" && l[key] !== "" ? l[key] : fallback;
  }

  _statusLabel(id) {
    const map = (this.labels && this.labels.statuses) || {};
    return map[id] || id;
  }

  _preview() {
    return !!this.proposals && typeof this.proposals === "object";
  }

  _openPage(slug) {
    if (!slug) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("insights-open-page", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { slug: slug },
      }),
    );
  }

  /** what would be saved: row index -> value */
  _pendingEdits() {
    if (!this._preview()) {
      return this._edits;
    }
    const out = {};
    Object.keys(this.proposals).forEach((key) => {
      if (!this._unchecked[key] && !this._isDone(key)) {
        out[key] = this.proposals[key];
      }
    });
    return out;
  }

  _isDone(key) {
    const st = this._rowState[key];
    return !!st && st.state === "saved";
  }

  _saveOptions() {
    return {
      note: this.note || "",
      srcAttributes: this.srcAttributes || {},
      allowEmpty: false,
    };
  }

  _pendingPages() {
    return groupBlockEdits(
      this.rows || [],
      this._pendingEdits(),
      this._saveOptions(),
    );
  }

  /** each row with its current (possibly edited) value and live status */
  _items() {
    const rows = this.rows || [];
    const preview = this._preview();
    const out = [];
    rows.forEach((row, i) => {
      if (preview && !Object.prototype.hasOwnProperty.call(this.proposals, i)) {
        return;
      }
      const edited =
        !preview && Object.prototype.hasOwnProperty.call(this._edits, i);
      const value = edited ? this._edits[i] : row.value;
      let st = { status: row.status || "", tone: "", text: "" };
      if (typeof this.statusOf === "function") {
        st = this.statusOf(row, value) || st;
      }
      out.push({ i, row, value, edited, st });
    });
    return out;
  }

  _elementName(row) {
    return `<${row.tag}>`;
  }

  _onInput(e, item) {
    const value = e.target.value;
    const orig = item.row.value;
    const edits = Object.assign({}, this._edits);
    const same = value === orig || (orig === null && value === "");
    if (same) {
      delete edits[item.i];
    } else {
      edits[item.i] = value;
    }
    this._edits = edits;
    if (this._rowState[item.i]) {
      const rowState = Object.assign({}, this._rowState);
      delete rowState[item.i];
      this._rowState = rowState;
    }
    if (typeof this.statusOf === "function") {
      const next = this.statusOf(item.row, same ? orig : value);
      if (next && next.status !== item.st.status) {
        this._announce = this._f(this.t.statusChanged, {
          element: this._elementName(item.row),
          status: this._statusLabel(next.status),
        });
      }
    }
  }

  _onKeydown(e, item) {
    if (e.key === "Escape" && item.edited) {
      e.preventDefault();
      e.stopPropagation();
      const edits = Object.assign({}, this._edits);
      delete edits[item.i];
      this._edits = edits;
      e.target.value = item.row.value === null ? "" : item.row.value;
    }
  }

  _toggle(i, checked) {
    const unchecked = Object.assign({}, this._unchecked);
    if (checked) {
      delete unchecked[i];
    } else {
      unchecked[i] = true;
    }
    this._unchecked = unchecked;
  }

  _setAll(checked) {
    if (checked) {
      this._unchecked = {};
      return;
    }
    const unchecked = {};
    Object.keys(this.proposals || {}).forEach((key) => {
      unchecked[key] = true;
    });
    this._unchecked = unchecked;
  }

  _askSave() {
    if (!this._pendingPages().length) {
      return;
    }
    this._confirming = true;
    this._saveNote = null;
    this.updateComplete.then(() => {
      const btn = this.shadowRoot && this.shadowRoot.querySelector(".save-now");
      if (btn) {
        btn.focus();
      }
    });
  }

  _cancelSave() {
    this._confirming = false;
    this.updateComplete.then(() => {
      const btn =
        this.shadowRoot && this.shadowRoot.querySelector(".save-rows");
      if (btn) {
        btn.focus();
      }
    });
  }

  async _runSave() {
    const rows = this.rows || [];
    const edits = this._pendingEdits();
    this._confirming = false;
    this._saving = true;
    this._saveNote = null;
    this._progress = { done: 0, total: 0, title: "" };
    let outcome = null;
    try {
      outcome = await saveBlockEdits(
        rows,
        edits,
        Object.assign(this._saveOptions(), {
          maxPages: this.maxPages,
          onProgress: (p) => {
            this._progress = p;
            if (p.title) {
              this._announce = this._f(this.t.savingPage, {
                done: p.done + 1,
                total: p.total,
                title: p.title,
              });
            }
          },
        }),
      );
    } catch (e) {
      outcome = {
        saved: {},
        failed: {},
        pagesSaved: 0,
        pagesLeft: 0,
        stopped: null,
        error: String((e && e.message) || e),
      };
    }
    this._applyOutcome(rows, outcome);
    this._saving = false;
    this._progress = null;
    this.dispatchEvent(
      new CustomEvent("insights-block-saved", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { saved: outcome.saved, failed: outcome.failed },
      }),
    );
  }

  _failText(f) {
    const detail = f.message || "";
    switch (f.kind) {
      case "stale":
        return this.t.failStale;
      case "locked":
        return detail || this.t.failLocked;
      case "refused":
        return this._f(this.t.failRefused, { detail: detail });
      case "missing":
        return this.t.failMissing;
      default:
        return this._f(this.t.failError, { detail: detail || "-" });
    }
  }

  _applyOutcome(rows, outcome) {
    const edits = Object.assign({}, this._edits);
    const rowState = Object.assign({}, this._rowState);
    const savedRows = Object.keys(outcome.saved);
    savedRows.forEach((key) => {
      const i = Number(key);
      if (rows[i] && !this._preview()) {
        // the stored value is now the edit; rescan to refresh other screens
        rows[i].value = outcome.saved[key];
        if (typeof this.statusOf === "function") {
          const st = this.statusOf(rows[i], rows[i].value);
          if (st && st.status) {
            rows[i].status = st.status;
          }
        }
      }
      delete edits[i];
      rowState[i] = { state: "saved", text: this.t.savedRow };
    });
    Object.keys(outcome.failed).forEach((key) => {
      rowState[Number(key)] = {
        state: "failed",
        text: this._failText(outcome.failed[key]),
      };
    });
    this._edits = edits;
    this._rowState = rowState;
    const failedCount = Object.keys(outcome.failed).length;
    const parts = [];
    if (savedRows.length) {
      parts.push(
        outcome.pagesSaved === 1
          ? savedRows.length === 1
            ? this.t.savedSummaryOne
            : this._f(this.t.savedSummaryOnePage, {
                n: this._n(savedRows.length),
              })
          : this._f(this.t.savedSummary, {
              n: this._n(savedRows.length),
              pages: this._n(outcome.pagesSaved),
            }),
      );
    }
    if (failedCount) {
      parts.push(this._f(this.t.notSavedSummary, { n: this._n(failedCount) }));
    }
    if (outcome.error) {
      parts.push(this._f(this.t.failError, { detail: outcome.error }));
    }
    if (outcome.stopped) {
      parts.push(
        outcome.stopped.message ||
          this._f(this.t.rateLimited, { n: outcome.stopped.retryAfter || 60 }),
      );
    }
    if (outcome.pagesLeft > 0 && !outcome.stopped) {
      parts.push(
        outcome.pagesLeft === 1
          ? this.t.pagesLeftSummaryOne
          : this._f(this.t.pagesLeftSummary, {
              n: this._n(outcome.pagesLeft),
            }),
      );
    }
    const tone =
      failedCount || outcome.stopped || outcome.error ? "warning" : "success";
    this._saveNote = { tone: tone, text: parts.join(" ") };
    this._announce = this._saveNote.text;
  }

  render() {
    const items = this._items();
    const preview = this._preview();
    const counts = { all: items.length };
    (this.statuses || []).forEach((id) => {
      counts[id] = 0;
    });
    items.forEach((x) => {
      if (Object.prototype.hasOwnProperty.call(counts, x.st.status)) {
        counts[x.st.status]++;
      }
    });
    const shown = items.filter(
      (x) =>
        preview ||
        this._filter === "all" ||
        x.st.status === this._filter ||
        x.edited ||
        this._rowState[x.i],
    );
    const limited = this._showAll ? shown : shown.slice(0, LIST_LIMIT);
    const pending = Object.keys(this._pendingEdits()).length;
    const heading = this._label("heading", "");
    return html`<section aria-labelledby="block-editor-title">
      ${
        heading
          ? html`<h3 class="block" id="block-editor-title">
              ${heading}
              <span class="hint">${this._label("hint", "")}</span>
            </h3>`
          : nothing
      }
      <div class="toolbar">
        ${
          !preview && (this.statuses || []).length
            ? html`<div
                class="hax-ui-seg wrap row-filter"
                role="group"
                aria-label="${this.t.filter}"
              >
                ${["all"].concat(this.statuses).map(
                  (id) =>
                    html`<button
                      type="button"
                      data-filter="${id}"
                      aria-pressed="${this._filter === id ? "true" : "false"}"
                      @click="${() => {
                        this._filter = id;
                      }}"
                    >
                      ${id === "all" ? this.t.all : this._statusLabel(id)}
                      <span class="num">${counts[id] || 0}</span>
                    </button>`,
                )}
              </div>`
            : nothing
        }
        <span class="grow pending-note"
          >${
            preview
              ? this._f(this.t.checkedNote, {
                  n: this._n(pending),
                  total: this._n(items.length),
                })
              : pending
                ? this._f(this.t.editedNote, { n: this._n(pending) })
                : this._label("editHint", this.t.editHint)
          }</span
        >
        ${
          preview
            ? html`<button
                  type="button"
                  class="sbtn select-all"
                  ?disabled="${this._saving}"
                  @click="${() => this._setAll(true)}"
                >
                  ${this.t.selectAll}
                </button>
                <button
                  type="button"
                  class="sbtn select-none"
                  ?disabled="${this._saving}"
                  @click="${() => this._setAll(false)}"
                >
                  ${this.t.selectNone}
                </button>`
            : html`<button
                type="button"
                class="sbtn discard"
                ?disabled="${!pending || this._saving}"
                @click="${() => {
                  this._edits = {};
                  this._rowState = {};
                  this._confirming = false;
                  this._announce = "";
                }}"
              >
                ${this.t.discard}
              </button>`
        }
        <button
          type="button"
          class="sbtn save-rows"
          ?disabled="${!pending || !this._canSave || this._saving}"
          aria-describedby="block-save-hint"
          @click="${this._askSave}"
        >
          ${this._label("save", this.t.saveNow)}
        </button>
        <span class="sr-only" id="block-save-hint"
          >${
            this._canSave
              ? this._f(this.t.saveHint, { max: this.maxPages })
              : this.t.saveNotAvailable
          }</span
        >
      </div>
      ${this._renderSavePanel()}
      ${
        !items.length
          ? html`<p class="hax-ui-empty empty">
              ${this._label("empty", this.t.noRows)}
            </p>`
          : !shown.length
            ? html`<p class="hax-ui-empty empty">${this.t.noRowsInFilter}</p>`
            : html`<div class="tbl-wrap">
                <table class="block-table">
                  <caption class="sr-only">
                    ${this._label("caption", heading)}
                  </caption>
                  <thead>
                    <tr>
                      ${
                        preview
                          ? html`<th scope="col">
                              <span class="sr-only">${this.t.include}</span>
                            </th>`
                          : nothing
                      }
                      <th scope="col">${this.t.element}</th>
                      <th scope="col" class="value-col">
                        ${this._label("value", "")}
                      </th>
                      <th scope="col">${this.t.status}</th>
                      <th scope="col">
                        <span class="sr-only">${this.t.actions}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    ${limited.map((x) =>
                      preview ? this._renderPreviewRow(x) : this._renderRow(x),
                    )}
                  </tbody>
                </table>
              </div>`
      }
      ${
        shown.length > limited.length
          ? html`<button
              type="button"
              class="sbtn more show-all"
              @click="${() => {
                this._showAll = true;
              }}"
            >
              ${this._f(this.t.showAll, { n: shown.length })}
            </button>`
          : nothing
      }
      <p class="hax-ui-note note">
        ${
          this._canSave
            ? this._f(this.t.saveHint, { max: this.maxPages })
            : this.t.saveNotAvailable
        }
      </p>
      <div class="sr-only" role="status" aria-live="polite">
        ${this._announce}
      </div>
    </section>`;
  }

  _renderSavePanel() {
    if (this._saving && this._progress) {
      const p = this._progress;
      return html`<div class="save-panel" role="status">
        <progress
          class="save-progress"
          max="${p.total || 1}"
          .value="${p.done}"
          aria-label="${this._label("save", this.t.saveNow)}"
        ></progress>
        <span
          >${
            p.title
              ? this._f(this.t.savingPage, {
                  done: p.done + 1,
                  total: p.total,
                  title: p.title,
                })
              : ""
          }</span
        >
      </div>`;
    }
    if (this._confirming) {
      const pages = this._pendingPages();
      const n = pages.reduce((sum, page) => sum + page.items.length, 0);
      const question =
        pages.length === 1
          ? n === 1
            ? this.t.confirmSaveOne
            : this._f(this.t.confirmSaveOnePage, { n: this._n(n) })
          : this._f(this.t.confirmSave, {
              n: this._n(n),
              pages: this._n(pages.length),
            });
      return html`<div
        class="save-panel confirm"
        role="group"
        aria-labelledby="block-save-question"
      >
        <p id="block-save-question" class="question">${question}</p>
        ${
          pages.length > this.maxPages
            ? html`<p class="cap">
                ${this._f(this.t.confirmCap, {
                  max: this.maxPages,
                  rest: this._n(pages.length - this.maxPages),
                })}
              </p>`
            : nothing
        }
        <p class="meta">${this.t.confirmEditor}</p>
        <div class="actions">
          <button type="button" class="sbtn save-now" @click="${this._runSave}">
            ${this.t.saveNow}
          </button>
          <button
            type="button"
            class="sbtn cancel-save"
            @click="${this._cancelSave}"
          >
            ${this.t.cancel}
          </button>
        </div>
      </div>`;
    }
    if (this._saveNote) {
      return html`<p
        class="hax-ui-note save-note"
        data-tone="${this._saveNote.tone}"
      >
        ${this._saveNote.text}
      </p>`;
    }
    return nothing;
  }

  _renderElementCell(row) {
    return html`<td>
      <code>${this._elementName(row)}</code>
      <span class="meta">${row.attribute}</span>
      ${row.src ? html`<span class="meta url">${row.src}</span>` : nothing}
      <span class="meta">${row.pageTitle}</span>
    </td>`;
  }

  _renderStateCell(x) {
    const state = this._rowState[x.i];
    return html`<td id="st-${x.i}">
      ${
        x.st.status
          ? html`<span class="hax-ui-pill row-status" data-tone="${x.st.tone}"
              >${this._statusLabel(x.st.status)}</span
            >`
          : nothing
      }
      ${x.st.text ? html`<span class="meta reason">${x.st.text}</span>` : nothing}
      ${
        state
          ? html`<span class="meta save-state" data-state="${state.state}"
              >${
                state.state === "saved"
                  ? this.t.savedRow
                  : html`<strong>${this.t.notSavedRow}:</strong> ${state.text}`
              }</span
            >`
          : nothing
      }
    </td>`;
  }

  _renderOpenCell(row) {
    return html`<td>
      <button
        type="button"
        class="sbtn open-page"
        aria-label="${this._f(this.t.openPageLabel, { title: row.pageTitle })}"
        data-slug="${row.slug}"
        @click="${() => this._openPage(row.slug)}"
      >
        ${this.t.openPage}
      </button>
    </td>`;
  }

  _renderRow(x) {
    const row = x.row;
    const value = x.value === null || x.value === undefined ? "" : x.value;
    return html`<tr
      data-row="${x.i}"
      data-status="${x.st.status}"
      data-save="${this._rowState[x.i] ? this._rowState[x.i].state : ""}"
    >
      ${this._renderElementCell(row)}
      <td>
        <input
          class="value-input"
          type="${this.kind === "url" ? "url" : "text"}"
          data-tone="${x.st.tone === "danger" ? "danger" : ""}"
          .value="${value}"
          placeholder="${row.value === null ? this.t.notSet : ""}"
          aria-label="${this._f(this.t.valueFor, {
            attribute: row.attribute,
            element: this._elementName(row),
            page: row.pageTitle,
          })}"
          aria-describedby="st-${x.i}"
          ?disabled="${this._saving}"
          @input="${(e) => this._onInput(e, x)}"
          @keydown="${(e) => this._onKeydown(e, x)}"
        />
        ${x.edited ? html`<span class="meta">${this.t.edited}</span>` : nothing}
      </td>
      ${this._renderStateCell(x)} ${this._renderOpenCell(row)}
    </tr>`;
  }

  _renderPreviewRow(x) {
    const row = x.row;
    const next = this.proposals[x.i];
    const checked = !this._unchecked[x.i] && !this._isDone(x.i);
    return html`<tr
      data-row="${x.i}"
      data-save="${this._rowState[x.i] ? this._rowState[x.i].state : ""}"
    >
      <td>
        <input
          type="checkbox"
          class="include"
          .checked="${checked}"
          ?disabled="${this._saving || this._isDone(x.i)}"
          aria-label="${this._f(this.t.includeRow, {
            attribute: row.attribute,
            page: row.pageTitle,
          })}"
          @change="${(e) => this._toggle(x.i, e.target.checked)}"
        />
      </td>
      ${this._renderElementCell(row)}
      <td>
        <span class="meta url old">${row.value}</span>
        <span class="url new">${next}</span>
      </td>
      ${this._renderStateCell(x)} ${this._renderOpenCell(row)}
    </tr>`;
  }
}

globalThis.customElements.define(InsightsBlockEditor.tag, InsightsBlockEditor);
export { InsightsBlockEditor };
