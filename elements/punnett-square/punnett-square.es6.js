/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */import{LitElement,html}from"./node_modules/@polymer/lit-element/lit-element.js";import"./node_modules/@polymer/paper-input/paper-input.js";/**
 * `punnett-square`
 * ``
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */class PunnettSquare extends LitElement{/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */tag(){return"punnett-square"}static get properties(){return{variant1:{type:String},variant2:{type:String},editable:{type:Boolean}}}// life cycle
constructor(){super();this.variant1="";this.variant2="";this.editable=!1}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback()}/**
   * Ensures that the value is a multidimensional array
   */__ensureArray(value){let toplevel="string"===typeof value?value.split(",").map(i=>i.trim()):[];return toplevel.map(i=>"string"===typeof i?i.split("").map(i=>i.trim()):[])}render(){let value1=this.__ensureArray(this.variant1),value2=this.__ensureArray(this.variant2);return html`
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
        Variant1: <div class="input">${this.editable?html`<paper-input value="${this.variant1}" @value-changed=${e=>this.variant1=e.detail.value}></paper-input>`:html`${this.variant1}`}</div>
        Variant2: <div class="input">${this.editable?html`<paper-input value="${this.variant2}" @value-changed=${e=>this.variant2=e.detail.value}></paper-input>`:html`${this.variant2}`}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            ${value1.map(allele1=>html`
                ${allele1.map(i=>html`
                    <th>${i}</th>
                  `)}
              `)}
          </tr>
        <tbody>
          ${value2.map((allele2,index)=>allele2.map(allele=>html`
                <tr>
                  <th>${allele}</th>
                  ${value1.map(v1=>v1.map(allele1=>html`
                        <td>${allele1}${allele}</td>
                      `))}
                </tr>
              `))}
        </tbody>
        </thead>
      </table>
    `}// static get observedAttributes() {
//   return [];
// }
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}customElements.define("punnett-square",PunnettSquare);export{PunnettSquare};