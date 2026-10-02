import { LitElement, html, css } from "lit";
import { LoremDataBehaviors } from "./lib/lorem-data-behaviors.js";
// all random* generators, date helpers and text helpers live in
// lib/lorem-data-behaviors.js; the element no longer shadows them
// (haxtheweb/issues#3105)
/**
 * `lorem-data`
 * a threaded discussions component
 * 
### Styling

`<lorem-data>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--lorem-data-FontSize` | default font-size | 14px
 *
 * @element lorem-data
 * @demo demo/index.html demo
 */

class LoremData extends LoremDataBehaviors(LitElement) {
  static get styles() {
    return [
      css`
        label {
          font-size: var(--ddd-font-size-4xs, 14px);
          font-family: var(--ddd-font-primary, sans-serif);
        }
        textarea {
          width: 100%;
          min-height: var(--ddd-textfield-height-lg, 200px);
        }
      `,
    ];
  }
  __revokeRemovedSchemaUrls() {
    const activeKeys = Object.keys(this.schemas || {});
    Object.keys(this.__downloadUrls || {}).forEach((key) => {
      if (!activeKeys.includes(key)) {
        globalThis.URL.revokeObjectURL(this.__downloadUrls[key]);
        delete this.__downloadUrls[key];
      }
    });
  }
  __revokeAllDownloadUrls() {
    Object.keys(this.__downloadUrls || {}).forEach((key) => {
      globalThis.URL.revokeObjectURL(this.__downloadUrls[key]);
      delete this.__downloadUrls[key];
    });
  }

  static get tag() {
    return "lorem-data";
  }

  static get properties() {
    return {
      schemas: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.schemas = {};
    this.__downloadUrls = {};
  }

  render() {
    return html`
      <button @click="${this.saveAll}">Save All</button>
      ${Object.keys(this.schemas || []).map(
        (key) => html`
          <p>
            <label>
              <a
                href="${this.saveDataUrl(this.schemas[key], key)}"
                download="${key}"
                >${key}:
              </a>
              <br />
              <textarea>${this.getJson(this.schemas[key])}</textarea>
            </label>
          </p>
        `,
      )}
      <button @click="${this.saveAll}">Save All</button>
    `;
  }
  /**
   * downloads all generated schema JSON files
   *
   * @memberof LoremData
   */
  saveAll() {
    if (
      this.shadowRoot &&
      this.shadowRoot.querySelectorAll("a") &&
      confirm(`Save the following: ${Object.keys(this.schemas).join(", ")}?`)
    ) {
      this.shadowRoot.querySelectorAll("a").forEach((a) => a.click());
    }
  }

  /**
   * converts generated schema to JSON
   *
   * @memberof LoremData
   * @param {object} schema
   * @returns {string}
   */
  getJson(schema) {
    return JSON.stringify(this.randomType(schema));
  }
  /**
   * genertates a url to download schema JSON
   *
   * @param {object} schema
   * @returns {string}
   * @memberof LoremData
   */
  saveDataUrl(schema, key = "default") {
    if (this.__downloadUrls[key]) {
      globalThis.URL.revokeObjectURL(this.__downloadUrls[key]);
    }
    let json = this.getJson(schema),
      blob = new Blob([json], { type: "octet/stream" });
    this.__downloadUrls[key] = globalThis.URL.createObjectURL(blob);
    return this.__downloadUrls[key];
  }
  get data() {
    let data = {};
    Object.keys(this.schemas || []).forEach(
      (key) => (data[key] = this.randomType(this.schemas[key])),
    );
    return data;
  }
  filterQuery(records, filter) {
    return records.filter((record, index) => filter(record, index));
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (changedProperties.has("schemas")) {
      this.__revokeRemovedSchemaUrls();
    }
    changedProperties.forEach((oldValue, propName) => {});
  }

  disconnectedCallback() {
    this.__revokeAllDownloadUrls();
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
}
globalThis.customElements.define(LoremData.tag, LoremData);
export { LoremData };
