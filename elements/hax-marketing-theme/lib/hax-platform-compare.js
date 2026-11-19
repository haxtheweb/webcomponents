/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

const RATING = {
  y: { mark: "✅", word: "yes" },
  p: { mark: "🟡", word: "partly" },
  n: { mark: "❌", word: "no" },
};

/**
 * `hax-platform-compare`
 * `Head to head: pick any two platforms and see how they stack up`
 *
 * Reads a JSON file of platforms and features. Every platform is its own
 * column; none are grouped. Each cell shows a mark, the word for it and a
 * short reason, so the meaning never rests on the mark or a color alone.
 *
 * @demo demo/index.html
 * @element hax-platform-compare
 */
class HaxPlatformCompare extends I18NMixin(DDD) {
  static get tag() {
    return "hax-platform-compare";
  }

  static get properties() {
    return {
      ...super.properties,
      /** JSON file with { platforms, features } */
      source: { type: String },
      /** platform id on the left */
      a: { type: String, reflect: true },
      /** platform id on the right */
      b: { type: String, reflect: true },
      _pinned: { type: String, state: true },
      _data: { type: Object },
    };
  }

  // the block's settings in the HAX editor; the rows live in the JSON file
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  constructor() {
    super();
    this.source = "files/platforms.json";
    this.a = "hax";
    this.b = "wordpress";
    this._data = null;
    this._pinned = "";
    this.t = {
      loading: "Loading the comparison.",
      yes: "Yes",
      partly: "Partly",
      no: "No",
      compare: "Compare",
      with: "With",
      vs: "vs",
      caption: "{a} and {b}, feature by feature",
      feature: "Feature",
      clearYes: "{count} of {total} a clear yes",
      seeForYourself: "See for yourself:",
      why: "Why",
      and: "and",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(`../locales/${this.tag}.es.json`, import.meta.url).href +
        "/../",
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    fetch(new URL(this.source, globalThis.document.baseURI))
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (json && Array.isArray(json.platforms) && json.platforms.length) {
          this._data = json;
        }
      })
      .catch(() => {});
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --hpc-ink: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --hpc-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --hpc-soft: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --hpc-line: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          color: var(--hpc-ink);
          font-family: var(--ddd-font-primary);
          margin: var(--ddd-spacing-8) var(--ddd-spacing-0);
        }
        .board {
          border: var(--ddd-border-size-md) solid var(--hm-edge, var(--hpc-ink));
          border-radius: var(--ddd-radius-lg);
          background-color: var(--hpc-surface);
          box-shadow: var(--ddd-spacing-2) var(--ddd-spacing-2)
            var(--ddd-spacing-0)
            var(--hm-shade, var(--ddd-theme-default-keystoneYellow));
          overflow: hidden;
        }
        .pick {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: var(--ddd-spacing-3);
          align-items: end;
          padding: var(--ddd-spacing-5);
          background-color: var(--hpc-soft);
          border-bottom: var(--ddd-border-size-md) solid
            var(--hm-edge, var(--hpc-ink));
        }
        .vs {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-weight: var(--ddd-font-weight-black);
          font-size: var(--ddd-font-size-s);
          padding-bottom: var(--ddd-spacing-2);
        }
        label {
          display: block;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          margin-bottom: var(--ddd-spacing-1);
        }
        select {
          width: 100%;
          min-height: var(--ddd-spacing-12);
          font: inherit;
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--hpc-ink);
          background-color: var(--hpc-surface);
          border: var(--ddd-border-size-md) solid var(--hpc-line);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        }
        select:focus-visible,
        a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .kind {
          font-size: var(--ddd-font-size-4xs);
          margin: var(--ddd-spacing-1) var(--ddd-spacing-0) var(--ddd-spacing-0);
        }
        .score {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: var(--ddd-border-size-sm) solid var(--hpc-line);
        }
        .score div {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-5);
        }
        .score div + div {
          border-left: var(--ddd-border-size-sm) solid var(--hpc-line);
        }
        .score strong {
          display: block;
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-m);
          line-height: var(--ddd-lh-120);
        }
        .score span {
          font-size: var(--ddd-font-size-4xs);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        caption {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
        }
        thead th {
          text-align: left;
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-xxs);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          background-color: var(--hpc-soft);
          border-bottom: var(--ddd-border-size-sm) solid var(--hpc-line);
        }
        thead th span {
          display: block;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-regular);
        }
        col.what {
          width: 30%;
        }
        tbody tr + tr {
          border-top: var(--ddd-border-size-xs) solid var(--hpc-line);
        }
        tbody th {
          text-align: left;
          vertical-align: middle;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
        }
        td {
          vertical-align: middle;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
          border-left: var(--ddd-border-size-xs) solid var(--hpc-line);
        }
        .mark {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .mark span[aria-hidden] {
          font-size: var(--ddd-font-size-s);
          line-height: 1;
        }
        td {
          position: relative;
        }
        .mark .word {
          flex: 1 1 auto;
        }
        .info {
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--ddd-spacing-6);
          height: var(--ddd-spacing-6);
          padding: var(--ddd-spacing-0);
          border: var(--ddd-border-size-sm) solid currentColor;
          border-radius: 50%;
          background-color: transparent;
          color: inherit;
          font-family: var(--ddd-font-secondary, serif);
          font-size: var(--ddd-font-size-4xs);
          font-style: italic;
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1;
          cursor: pointer;
        }
        .info:hover,
        .info[aria-expanded="true"] {
          background-color: var(--hpc-ink);
          color: var(--hpc-surface);
        }
        .info:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .tip {
          display: none;
          position: absolute;
          z-index: 2;
          top: calc(100% - var(--ddd-spacing-1));
          right: var(--ddd-spacing-2);
          left: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--hpc-ink);
          color: var(--hpc-surface);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-regular);
          line-height: var(--ddd-lh-140);
          box-shadow: var(--ddd-boxShadow-sm);
        }
        .info:hover + .tip,
        .info:focus-visible + .tip,
        .tip.pinned {
          display: block;
        }
        .foot {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-5);
          font-size: var(--ddd-font-size-4xs);
          border-top: var(--ddd-border-size-sm) solid var(--hpc-line);
          margin: var(--ddd-spacing-0);
        }
        a {
          color: inherit;
          display: inline-block;
          min-height: var(--ddd-spacing-6);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-0);
        }
        @media (max-width: 620px) {
          .pick {
            grid-template-columns: 1fr;
            padding: var(--ddd-spacing-3);
          }
          .vs {
            padding: var(--ddd-spacing-0);
            text-align: center;
          }
          /* the feature name takes its own line above the two answers */
          col.what {
            width: 0;
          }
          thead th:first-child {
            display: none;
          }
          table,
          thead,
          tbody {
            display: block;
            width: 100%;
          }
          .mark .word {
            overflow-wrap: normal;
          }
          tbody tr {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          tbody th {
            grid-column: 1 / -1;
            background-color: var(--hpc-soft);
            padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          }
          thead tr {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          td,
          thead th,
          .foot {
            padding-left: var(--ddd-spacing-3);
            padding-right: var(--ddd-spacing-3);
          }
          td:first-of-type {
            border-left: none;
          }
        }
      `,
    ];
  }

  _platform(id) {
    return (
      this._data.platforms.find((p) => p.id === id) || this._data.platforms[0]
    );
  }

  _set(side, e) {
    const id = e.target.value;
    if (this._data.platforms.some((p) => p.id === id)) {
      this[side] = id;
    }
  }

  _select(side, label) {
    const kinds = [...new Set(this._data.platforms.map((p) => p.kind))];
    return html`
      <div>
        <label for="${side}">${label}</label>
        <select id="${side}" @change="${(e) => this._set(side, e)}">
          ${kinds.map(
            (kind) => html`
              <optgroup label="${kind}">
                ${this._data.platforms
                  .filter((p) => p.kind === kind)
                  .map(
                    (p) =>
                      html`<option
                        value="${p.id}"
                        ?selected="${p.id === this[side]}"
                      >
                        ${p.name}
                      </option>`,
                  )}
              </optgroup>
            `,
          )}
        </select>
        <p class="kind">${this._platform(this[side]).kind}</p>
      </div>
    `;
  }

  _count(id) {
    return this._data.features.filter(
      (f) => f.cells[id] && f.cells[id].r === "y",
    ).length;
  }

  _clearYes(id, total) {
    return this.t.clearYes
      .replace("{count}", this._count(id))
      .replace("{total}", total);
  }

  _pin(key) {
    this._pinned = this._pinned === key ? "" : key;
  }
  _unpin(e) {
    if (e.key === "Escape") {
      this._pinned = "";
    }
  }
  // the mark and its word up front; the reason waits behind the (i)
  _cell(feature, id, row) {
    const cell = feature.cells[id] || { r: "n", note: "" };
    const rating = RATING[cell.r] || RATING.n;
    const key = `tip-${row}-${id}`;
    return html`
      <td class="${rating.word}">
        <div class="mark">
          <span aria-hidden="true">${rating.mark}</span
          ><span class="word">${this.t[rating.word]}</span>
          ${
            cell.note
              ? html`<button
                    type="button"
                    class="info"
                    aria-label="${this.t.why}"
                    aria-describedby="${key}"
                    aria-expanded="${this._pinned === key ? "true" : "false"}"
                    @click="${() => this._pin(key)}"
                    @keydown="${this._unpin}"
                  >
                    i</button
                  ><span
                    class="tip ${this._pinned === key ? "pinned" : ""}"
                    role="tooltip"
                    id="${key}"
                    >${cell.note}</span
                  >`
              : ``
          }
        </div>
      </td>
    `;
  }
  render() {
    if (!this._data) {
      return html`<p>${this.t.loading}</p>`;
    }
    const a = this._platform(this.a);
    const b = this._platform(this.b);
    const total = this._data.features.length;
    return html`
      <div class="board">
        <div class="pick">
          ${this._select("a", this.t.compare)}
          <div class="vs" aria-hidden="true">${this.t.vs}</div>
          ${this._select("b", this.t.with)}
        </div>
        <table>
          <caption>
            ${this.t.caption.replace("{a}", a.name).replace("{b}", b.name)}
          </caption>
          <colgroup>
            <col class="what" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">${this.t.feature}</th>
              <th scope="col">
                ${a.name}<span>✅ ${this._clearYes(a.id, total)}</span>
              </th>
              <th scope="col">
                ${b.name}<span>✅ ${this._clearYes(b.id, total)}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            ${this._data.features.map(
              (feature, row) => html`
                <tr>
                  <th scope="row">${feature.label}</th>
                  ${this._cell(feature, a.id, row)}${this._cell(
                    feature,
                    b.id,
                    row,
                  )}
                </tr>
              `,
            )}
          </tbody>
        </table>
        <p class="foot">
          ${this.t.seeForYourself}
          <a href="${a.url}">${a.name}</a> ${this.t.and}
          <a href="${b.url}">${b.name}</a>.
        </p>
      </div>
    `;
  }
}
globalThis.customElements.define(HaxPlatformCompare.tag, HaxPlatformCompare);
export { HaxPlatformCompare };
