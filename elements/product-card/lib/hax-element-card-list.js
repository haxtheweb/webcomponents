import { LitElement, html, css } from "lit-element/lit-element.js";
import { haxElementToNode } from "@lrnwebcomponents/utils/utils.js";
import "@material/mwc-switch/mwc-switch.js";
import "@material/mwc-button/mwc-button.js";
import "@material/mwc-formfield/mwc-formfield.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@lrnwebcomponents/hexagon-loader/hexagon-loader.js";
import "../product-card.js";
class HAXElementCardList extends LitElement {
  constructor() {
    super();
    this.showCardList = false;
    this.list = [];
    this.value = {};
    this.cols = 2;
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
          min-height: 100px;
        }
        product-card {
          display: block;
        }
        product-card div[slot="details-collapse-content"] {
          max-height: 125px;
          overflow-y: auto;
        }
        .grid {
          display: grid;
          align-items: stretch;
          grid-template-columns: var(--hax-element-card--cols, repeat(2, 1fr));
          grid-gap: 15px;
          overflow-x: auto;
          padding: 2px;
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
      value: {
        type: Object
      },
      hidden: {
        type: Boolean
      },
      showCardList: {
        type: Boolean
      },
      _layout: {
        type: String
      },
      _firstList: {
        type: Array
      },
      _firstValue: {
        type: Array
      }
    };
  }
  render() {
    return !this.showCardList
      ? ``
      : html`
          <hexagon-loader
            item-count="4"
            color="blue"
            ?loading="${this.loading}"
            size="large"
          ></hexagon-loader>
          <h2 ?hidden="${!this.loading}">Loading HAX elements..</h2>
          <div
            class="grid"
            style="--hax-element-card--cols: repeat(${this.cols}, 1fr)"
          >
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
                    <mwc-formfield
                      label="${el.status ? `Enabled` : `Disabled`}"
                    >
                      <mwc-switch
                        ?checked="${el.status}"
                        @change="${e => this.elementStatusChange(el)}"
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
                      <li>
                        <strong>Developer usage:</strong>
                        <code>import "${el.file}";</code>
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
                              <mwc-button
                                data-tag="${demoItem.tag}"
                                @click="${this._viewDemo}"
                                >Pop up demo</mwc-button
                              >
                              <div class="demo">
                                ${this._haxElementToNode(demoItem)}
                              </div>
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
          </div>
        `;
  }
  _viewDemo(e) {
    if (e.target && e.target.nextElementSibling) {
      window.dispatchEvent(
        new CustomEvent("simple-modal-show", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            title: "Demo of " + e.target.getAttribute("data-tag"),
            styles: {
              "--simple-modal-width": "75vw",
              "--simple-modal-max-width": "75vw"
            },
            elements: {
              content: e.target.nextElementSibling
            },
            invokedBy: e.target,
            clone: true,
            modal: true
          }
        })
      );
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
  elementStatusChange(el, status) {
    if (!status) status = !el.status;
    el.status = status;
    this._updateItem(el.tag, el.file, status);
    // send up so list can update
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: this
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
  _updateItem(tag, file, status = false) {
    if (!status) {
      delete this.value[tag];
    } else {
      this.value[tag] = file;
    }
  }
  /**
   * only set these once both the initial list and values are available
   */
  _updateList() {
    if (this._firstValue && this._firstList) {
      this.value = JSON.stringify(JSON.parse(this.value));
      this.value = {};
      this.list.forEach(item => {
        this._updateItem(
          item.tag,
          item.file,
          this._firstValue[item.tag] ? true : false
        );
        this.value[item.tag] = item.file;
      });
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    console.log(
      "updated",
      this._firstList,
      this.list,
      this._firstValue,
      this.value
    );
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "list" && this.list !== oldValue && !this._firstList)
        this._firstList = true;
      if (propName == "value" && !this._firstValue) this._firstValue = true;
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
    console.log(
      "updated 2",
      this._firstList,
      this.list,
      this._firstValue,
      this.value
    );
  }
}
customElements.define(HAXElementCardList.tag, HAXElementCardList);
export { HAXElementCardList };
