/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import "@polymer/paper-input/paper-input.js";

/**
 * `punnett-square`
 * @element punnett-square
 * @lit-element
 * @demo demo/index.html
 */
class PunnettSquare extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "punnett-square";
  }

  static get properties() {
    return {
      /**
       * Varient 1 - example XY
       */
      variant1: { type: String },
      /**
       * Varient 2 - example XX
       */
      variant2: { type: String },
      /**
       * Editable - allow users to change the varient values
       */
      editable: { type: Boolean },
      __results: { type: Array },
    };
  }

  // life cycle
  constructor() {
    super();
    this.variant1 = "";
    this.variant2 = "";
    this.editable = false;
    // Gather Lightdom Rendered Results
    const results = this.querySelectorAll("[data-variant]");
    let _renderedResults = [];
    for (let result of results) {
      let variant = result.getAttribute("data-variant");
      variant = this.__sortVariant(variant);
      let item = {
        variant,
        ref: result,
      };
      _renderedResults = [..._renderedResults, item];
    }
    this.__results = _renderedResults;
  }

  __sortVariant(variant) {
    return variant.split("").sort().join("");
  }

  /**
   * Ensures that the value is a multidimensional array
   */
  __ensureArray(value) {
    let toplevel =
      typeof value === "string" ? value.split(",").map((i) => i.trim()) : [];
    return toplevel.map((i) =>
      typeof i === "string" ? i.split("").map((i) => i.trim()) : []
    );
  }

  render() {
    let value1 = this.__ensureArray(this.variant1);
    let value2 = this.__ensureArray(this.variant2);

    const asdf = value1[0].length < 1 && value2[0].length < 1;
    console.log("asdf:", asdf);

    return html`
      <style>
        :host {
          display: block;
          --punnett-square-table-border: 1px solid black;
          --punnett-square-table-padding: 1em;
          --punnett-square-input-font-size: 2em;
          --punnett-square-input-text-align: center;
        }

        table {
          border-collapse: var(--punnett-square-table-border-collapse, collapse);
          width: var(--punnett-square-table-width, 100%);
          border: var(--punnett-square-table-border);
        }

        th {
          border: var(--punnett-square-th-border, var(--punnett-square-table-border));
          padding: var(--punnett-square-th-padding, var(--punnett-square-table-padding));
        }

        td {
          border: var(--punnett-square-td-border, var(--punnett-square-table-border));
          text-align: var(--punnett-square-table-text-align, center);
          padding: var(--punnett-square-td-padding, var(--punnett-square-table-padding));
        }

        #inputs {
          display: var(--punnett-square-inputs-display, flex);
          align-items: var(--punnett-square-inputs-align-items, center);
        }

        .input {
          font-size: var(--punnett-square-input-font-size);
          text-align: var(--punnett-square-input-text-align);
        }

        paper-input {
          --paper-input-container-input: {
            font-size: var(--punnett-square-paper-input-font-size, --punnett-square-input-font-size);
            text-align: var(--punnett-square-paper-input-text-align, --punnett-square-input-text-align);
          }
        }
      </style>
      <div id="inputs">
        Variant1: <div class="input">${
          this.editable
            ? html`
                <paper-input
                  value="${this.variant1}"
                  @value-changed=${(e) => (this.variant1 = e.detail.value)}
                ></paper-input>
              `
            : html` ${this.variant1} `
        }</div>
        Variant2: <div class="input">${
          this.editable
            ? html`
                <paper-input
                  value="${this.variant2}"
                  @value-changed=${(e) => (this.variant2 = e.detail.value)}
                ></paper-input>
              `
            : html` ${this.variant2} `
        }</div>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            ${value1.map(
              (allele1) => html` ${allele1.map((i) => html` <th>${i}</th> `)} `
            )}
          </tr>
        <tbody>
          ${value2.map((allele2, index) =>
            allele2.map(
              (allele) =>
                html`
                  <tr>
                    <th>${allele}</th>
                    ${value1.map((v1) =>
                      v1.map(
                        (allele1) =>
                          html`
                            <td>
                              ${this.renderVariant(`${allele1}${allele}`)}
                            </td>
                          `
                      )
                    )}
                  </tr>
                `
            )
          )}
        </tbody>
        </thead>
      </table>
    `;
  }

  renderVariant(variant) {
    const _variant = this.__sortVariant(variant);
    const result = this.__results.find((i) => i.variant === _variant);
    if (result) {
      return html` ${unsafeHTML(result.ref.outerHTML)} `;
    } else {
      return html` ${_variant} `;
    }
  }
}

customElements.define(PunnettSquare.tag, PunnettSquare);

export { PunnettSquare };
