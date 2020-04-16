import { LitElement, html, css } from "lit-element/lit-element.js";
import { haxElementToNode } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@material/mwc-switch/mwc-switch.js";
import "@material/mwc-formfield/mwc-formfield.js";
import "../product-card.js";
class HAXElementCardList extends LitElement {
  constructor() {
    super();
    this.list = [];
    this.enabled = {};
    this._layout = "1-1-1";
  }
  static get tag() {
    return "hax-element-card-list";
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
        product-card div[slot="collapse-header"] {
          padding: 8px 0;
        }
        product-card div[slot="details-collapse-content"] {
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
      },
      cols: {
        type: Number
      },
      _layout: {
        type: String
      }
    };
  }
  render() {
    return html`
      <grid-plate .layout="${this._layout}" hide-ops>
        ${this.list.map(
          (el, i) => html`
            <product-card
              .slot="col-${this.__getCol(i)}"
              ?disabled="${!el.status}"
              ?has-demo="${el.schema.demoSchema}"
              heading="${el.schema.gizmo.title}"
              icon="${el.schema.gizmo.icon}"
              subheading="${el.schema.gizmo.description}"
              accent-color="${el.schema.gizmo.color}"
              data-index="${i}"
              @product-card-demo-show="${this.toggleShowDemo}"
              @product-card-demo-hide="${this.toggleShowDemo}"
            >
              <div class="switch">
                <mwc-formfield label="${el.status ? `Enabled` : `Disabled`}">
                  <mwc-switch
                    data-index="${i}"
                    data-tag="${el.tag}"
                    data-file="${el.file}"
                    checked
                    @change="${this.elementStatusChange}"
                  ></mwc-switch>
                </mwc-formfield>
              </div>
              <div slot="details-collapse-header">Details</div>
              <div slot="details-collapse-content">
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
                ${el.schema.demoSchema && el.showDemo
                  ? html`
                      ${el.schema.demoSchema.map(
                        demoItem => html`
                          ${this._haxElementToNode(demoItem)}
                          <code-sample copy-clipboard-button>
                            <template>
                              ${this._haxElementToNode(demoItem)}
                            </template>
                          </code-sample>
                        `
                      )}
                    `
                  : ``}
              </div>
            </product-card>
          `
        )}
      </grid-plate>
    `;
  }
  /**
   * Effectively event binding to the expanded state
   */
  toggleShowDemo(e) {
    this.list[e.path[0].getAttribute("data-index")].showDemo =
      e.detail.expanded;
    this.requestUpdate();
  }
  /**
   * Wrap our call so that we can dynamically import code sample since it has a dep tree
   */
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
      new CustomEvent("enabled-changed", {
        bubbles: true,
        composed: true,
        detail: {
          value: this.enabled
        }
      })
    );
  }
  __getCol(i) {
    i++;
    while (i > this.cols) {
      i = i - this.cols;
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
          new CustomEvent("enabled-changed", {
            bubbles: true,
            composed: true,
            detail: {
              value: this.enabled
            }
          })
        );
      }
      if (propName == "cols") {
        switch (this[propName]) {
          case 3:
            this._layout = "1-1-1";
            break;
          case 4:
            this._layout = "1-1-1-1";
            break;
          case 5:
            this._layout = "1-1-1-1-1";
            break;
          case 6:
            this._layout = "1-1-1-1-1-1";
            break;
          default:
            this._layout = "1-1";
            break;
        }
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
customElements.define(HAXElementCardList.tag, HAXElementCardList);
export { HAXElementCardList };
