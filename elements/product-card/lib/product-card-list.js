import { LitElement, html, css } from "lit-element/lit-element.js";
import { haxElementToNode } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@material/mwc-switch/mwc-switch.js";
import "../product-card.js";
class ProductCardList extends LitElement {
  constructor() {
    super();
    this.list = [];
    this.enabled = {};
  }
  static get tag() {
    return "product-card-list";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          border: 2px solid green;
          min-height: 100px;
        }
        product-card {
          display: block;
        }
        h2 {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
          padding: 0;
        }
        product-card div[slot="collapse-header"] {
          padding: 8px 0;
        }
        label {
          font-weight: bold;
        }
        .card-content {
          max-height: 125px;
          overflow-y: auto;
        }
      `
    ];
  }
  static get properties() {
    return {
      list: {
        type: Array
      },
      enabled: {
        type: Object
      }
    };
  }
  render() {
    return html`
      <grid-plate layout="1-1-1">
        ${this.list.map(
          (el, i) => html`
            ${i}
            <product-card
              .slot="col-${this.__getCol(i)}"
              ?disabled="${!el.status}"
              ?has-demo="${el.schema.demoSchema}"
              heading="${el.schema.gizmo.title}"
              icon="${el.schema.gizmo.icon}"
              subheading="${el.schema.gizmo.description}"
              accent-color="${el.schema.gizmo.color}"
            >
              <div class="switch">
                <mwc-switch
                  id="switch-${i}"
                  data-index="${i}"
                  data-tag="${el.tag}"
                  data-file="${el.file}"
                  checked
                  @change="${this.elementStatusChange}"
                ></mwc-switch>
                <label for="switch-${i}"
                  >${el.status
                    ? html`
                        Enabled
                      `
                    : html`
                        Disabled
                      `}</label
                >
              </div>
              <div slot="details-collapse-header">Details</div>
              <div slot="details-collapse-content" class="card-content">
                <ul>
                  <li><strong>Location:</strong> <code>${el.file}</code></li>
                  <li><strong>Name:</strong> <code>${el.tag}</code></li>
                  <li>
                    <strong>Tags:</strong> ${el.schema.gizmo.groups.map(
                      group =>
                        html`
                          ${group},
                        `
                    )}
                  </li>
                  ${el.schema.gizmo.meta
                    ? html`
                        ${Object.keys(el.schema.gizmo.meta).map(
                          mel => html`
                            <li>
                              <strong>${this.capFirst(mel)}:</strong>
                              <span>${el.schema.gizmo.meta[mel]}</span>
                            </li>
                          `
                        )}
                      `
                    : ``}
                </ul>
              </div>
              <div slot="demo-collapse-header">Demo</div>
              <div slot="demo-collapse-content">
                ${el.schema.demoSchema
                  ? html`
                      ${this._haxElementToNode(el.schema.demoSchema)}
                      <code-sample copy-clipboard-button>
                        <template>
                          ${this._haxElementToNode(el.schema.demoSchema)}
                        </template>
                      </code-sample>
                    `
                  : ``}
              </div>
            </product-card>
          `
        )}
      </grid-plate>
    `;
  }
  _haxElementToNode(schema) {
    if (schema && schema.tag) {
      import("@lrnwebcomponents/code-sample/code-sample.js");
      return haxElementToNode(schema);
    }
    return "";
  }
  capFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  elementStatusChange(e) {
    this.list[parseInt(e.path[0].getAttribute("data-index"))].status =
      e.path[0].checked;
    if (e.path[0].checked) {
      this.enabled[e.path[0].getAttribute("data-tag")] = e.path[0].getAttribute(
        "data-file"
      );
    } else {
      delete this.enabled[e.path[0].getAttribute("data-tag")];
    }
    this.requestUpdate();
    // bubble up enabled
    this.dispatchEvent(
      new CustomEvent(`enabled-changed`, {
        detail: {
          value: this.enabled
        }
      })
    );
  }
  __getCol(i) {
    i++;
    while (i > 3) {
      i = i - 3;
    }
    return i;
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // notify
      if (propName == "enabled") {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "list") {
        this._listChanged(this[propName]);
      }
    });
  }
  _listChanged(list) {
    this.enabled = {};
    list.forEach(el => {
      if (el.status) {
        this.enabled[el.tag] = el.file;
      }
    });
  }
}
customElements.define(ProductCardList.tag, ProductCardList);
export { ProductCardList };
