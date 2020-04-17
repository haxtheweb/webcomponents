import { LitElement, html, css } from "lit-element/lit-element.js";
import { haxElementToNode } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@material/mwc-switch/mwc-switch.js";
import "@material/mwc-button/mwc-button.js";
import "@material/mwc-formfield/mwc-formfield.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "../product-card.js";
class HAXElementCardList extends LitElement {
  constructor() {
    super();
    this.list = [];
    this._layout = "1-1-1";
    window.SimpleModal.requestAvailability();
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
                  <li>
                    <strong>Tags:</strong> ${el.schema.gizmo.groups.map(
                      group =>
                        html`
                          ${group},
                        `
                    )}
                  </li>
                  <li><strong>Tag name:</strong> <code>${el.tag}</code></li>
                  <li><strong>Developer usage:</strong> <code>import "${el.file}";</code></li>
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
                          <mwc-button data-tag="${demoItem.tag}" @click="${this._viewDemo}">Pop up demo</mwc-button>
                          <div class="demo">${this._haxElementToNode(demoItem)}</div>
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
  _viewDemo(e) {
    if (e.target && e.target.nextElementSibling) {
      console.log(e.target.nextElementSibling);
      window.dispatchEvent(new CustomEvent("simple-modal-show", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          title: "Demo of " + e.target.getAttribute('data-tag'),
          styles: {
            "--simple-modal-width": "75vw",
            "--simple-modal-max-width": "75vw"
          },
          elements: {
            content: e.target.nextElementSibling,
          },
          invokedBy: e.target,
          clone: true,
          modal: true
        }
      }));
    }
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
    // send up so list can update
    this.dispatchEvent(
      new CustomEvent("enabled-changed", {
        detail: {
          tag: e.path[0].getAttribute("data-tag"),
          status: e.path[0].checked
        }
      })
    );
    this.requestUpdate();
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
    });
  }
}
customElements.define(HAXElementCardList.tag, HAXElementCardList);
export { HAXElementCardList };
