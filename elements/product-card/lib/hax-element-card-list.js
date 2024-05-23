import { LitElement, html, css } from "lit";
import { haxElementToNode } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import "@haxtheweb/hexagon-loader/hexagon-loader.js";
import "../product-card.js";
class HAXElementCardList extends LitElement {
  constructor() {
    super();
    this.showCardList = false;
    this.list = [];
    this.filteredTags = [];
    this.value = {};
    this.cols = 2;
    this._layout = "1-1-1";
    globalThis.SimpleModal.requestAvailability();
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
          --hexagon-color: var(--simple-colors-default-theme-light-blue-8);
        }
        :host([loading]) {
          border: 1px solid var(--simple-colors-default-theme-grey-6);
        }
        product-card {
          display: block;
          max-width: 100%;
          overflow-x: auto;
          --mdc-theme-on-primary: var(--simple-colors-default-theme-grey-1);
          --mdc-theme-primary: var(--simple-colors-default-theme-accent-8);
        }
        product-card[hidden] {
          display: none;
        }
        product-card div[slot="details-collapse-content"] {
          max-height: 125px;
          overflow-y: auto;
        }
        product-card label[slot="card-header"] {
          float: right;
          line-height: 1.5em;
        }
        button {
          text-transform: unset;
          margin-bottom: 5px;
        }
        .sr-only {
          position: absolute;
          left: -9999999999px;
          width: 0;
          overflow: hidden;
        }
        .grid {
          display: grid;
          align-items: stretch;
          grid-template-columns: var(--hax-element-card--cols, repeat(2, 1fr));
          grid-gap: var(--hax-element-card--gridGap, 15px);
          overflow-x: auto;
          padding: 2px;
        }
        hexagon-loader {
          margin: 0 auto;
          display: block;
        }
        .loaderText > strong {
          text-align: center;
          display: block;
        }
        .checkbox {
          height: 36px;
          width: 36px;
        }
      `,
    ];
  }
  static get properties() {
    return {
      list: {
        type: Array,
      },
      enabled: {
        type: Object,
      },
      filteredTags: {
        type: Object,
      },
      cols: {
        type: Number,
      },
      value: {
        type: Object,
      },
      hidden: {
        type: Boolean,
      },
      loading: {
        type: Boolean,
        reflect: true,
      },
      showCardList: {
        type: Boolean,
      },
      _layout: {
        type: String,
      },
    };
  }
  render() {
    return !this.showCardList
      ? ``
      : html`
          <p class="loaderText" ?hidden="${!this.loading}">
            <strong
              >Scanning Web Component Registry for more HAX elements..</strong
            ><hexagon-loader
              item-count="4"
              ?loading="${this.loading}"
              size="small"
            ></hexagon-loader>
          </p>
          <div
            class="grid"
            style="--hax-element-card--cols: repeat(${this.cols}, 1fr)"
          >
            ${this.productList.map(
              (el, i) => html`
                <product-card
                  .slot="col-${this.__getCol(i)}"
                  ?disabled="${!el.status}"
                  ?hidden="${!(
                    this.filteredTags && this.filteredTags.includes(el.tag)
                  )}"
                  ?has-demo="${el.schema.demoSchema}"
                  heading="${el.schema.gizmo.title}"
                  icon="${el.schema.gizmo.icon}"
                  subheading="${el.schema.gizmo.description}"
                  accent-color="${el.schema.gizmo.color}"
                  @product-card-demo-show="${(e) => this.toggleShowDemo(e, i)}"
                  @product-card-demo-hide="${(e) => this.toggleShowDemo(e, i)}"
                >
                  <label slot="card-header">
                    <span class="sr-only"
                      >${el.status ? `Enabled` : `Disabled`}</span
                    >
                    <input
                      class="checkbox"
                      type="checkbox"
                      ?checked="${el.status}"
                      @change="${(e) => this.elementStatusChange(el)}"
                    />
                  </label>
                  <div slot="details-collapse-header">Details</div>
                  <div slot="details-collapse-content">
                    <ul>
                      <li>
                        <strong>Tags:</strong> ${el.schema.gizmo.tags.map(
                          (group) => html` ${group}, `,
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
                              (mel) => html`
                                <li>
                                  <strong>${this.capFirst(mel)}:</strong>
                                  <span>${el.schema.gizmo.meta[mel]}</span>
                                </li>
                              `,
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
                            (demoItem) => html`
                              <button
                                data-tag="${demoItem.tag}"
                                outlined
                                @click="${this._viewDemo}"
                              >
                                Pop up demo
                              </button>
                              <div class="demo">
                                ${this._haxElementToNode(demoItem)}
                              </div>
                              <code-sample copy-clipboard-button>
                                <template>
                                  ${this._haxElementToNode(demoItem)}
                                </template>
                              </code-sample>
                            `,
                          )}
                        `
                      : ``}
                  </div>
                </product-card>
              `,
            )}
          </div>
        `;
  }
  /**
   * updated list with status based on current value
   *
   * @readonly
   * @memberof HAXElementCardList
   */
  get productList() {
    return this.list.map((item) => {
      return {
        tag: item.tag,
        file: item.file,
        schema: item.schema,
        showDemo: item.showDemo,
        status: this.value[item.tag] ? true : false,
      };
    });
  }
  _viewDemo(e) {
    if (e.target && e.target.nextElementSibling) {
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-show", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            title: "Demo of " + e.target.getAttribute("data-tag"),
            styles: {
              "--simple-modal-width": "75vw",
              "--simple-modal-max-width": "75vw",
              "--simple-modal-z-index": "100000000",
              "--simple-modal-min-height": "50vh",
            },
            elements: {
              content: e.target.nextElementSibling,
            },
            invokedBy: e.target,
            clone: true,
            modal: true,
          },
        }),
      );
    }
  }
  /**
   * Effectively event binding to the expanded state
   */
  toggleShowDemo(e, index) {
    this.list[index].showDemo = e.detail.expanded;
    this.requestUpdate();
  }
  /**
   * Wrap our call so that we can dynamically import code sample since it has a dep tree
   */
  _haxElementToNode(schema) {
    if (schema && schema.tag) {
      import("@haxtheweb/code-sample/code-sample.js");
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
        detail: this,
      }),
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
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "list")
        this.dispatchEvent(
          new CustomEvent("hax-element-card-list-changed", {
            detail: {
              bubbles: true,
              value: this[propName],
            },
          }),
        );
      if (propName == "cols") {
        switch (this[propName]) {
          case 3:
            this._layout = "1-1-1";
            break;
          case 4:
            this._layout = "1-1-1-1";
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
