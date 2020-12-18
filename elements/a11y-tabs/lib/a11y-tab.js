/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `a11y-tab`
 * a single tab within `a11y-tabs`
 * 
### Styling

`<a11y-tab>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-tab-height` | tab height | `--a11y-tabs-height`
`--a11y-tabs-tab-overflow` | tab overflow | `--a11y-tabs-overflow`
 *
 * @element a11y-tab
 * @see ../a11y-tabs.js
 */
class A11yTab extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: var(--a11y-tabs-tab-height, --a11y-tabs-height);
          overflow: var(--a11y-tabs-tab-overflow, --a11y-tabs-overflow);
        }
        :host([hidden]) {
          display: none;
        }
        .sr-only {
          position: absolute;
          left: -99999px;
          height: 0;
          overflow: hidden;
        }
        #content-inner {
          max-width: 100%;
          overflow: auto;
        }
        ::slotted(*[slot="label"]) {
          display: none;
        }
      `,
    ];
  }
  render() {
    return html`
      <span class="sr-only">Tab ${this.xOfY}</span>
      <slot name="label"></slot>
      <div id="content-inner"><slot></slot></div>
      <span class="sr-only">
        End of tab ${this.xOfY}. Back to <a href="#${this.id}">tabs</a>.
      </span>
    `;
  }
  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Tab",
        description: "A single tab.",
        icon: "view-day",
        color: "grey",
        groups: ["Content", "Presentation", "Tabs"],
      },
      settings: {
        configure: [
          {
            property: "icon",
            title: "Tab Icon",
            inputMethod: "iconpicker",
          },
          {
            property: "disabled",
            title: "Disabled",
            inputMethod: "boolean",
          },
          {
            property: "label",
            title: "Tab Label",
            inputMethod: "textfield",
          },
          {
            slot: "",
            title: "Tab Content",
            description: "A content of the tab.",
            inputMethod: "code-editor",
          },
        ],
        advanced: [
          {
            property: "id",
            title: "Unique ID",
            inputMethod: "textfield",
          },
          {
            property: "flag",
            title: "Optional Flag Text",
            inputMethod: "textfield",
          },
          {
            property: "flagIcon",
            title: "Optional Flag Icon",
            inputMethod: "iconpicker",
          },
        ],
      },
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ariaLabelledby: {
        type: String,
        reflect: true,
        attribute: "aria-labelledby",
      },
      /**
       * optional flag the tab, eg. `new`, `alert`, or `error`
       */
      flag: {
        type: String,
        reflect: true,
      },
      /**
       * optional flag icon the tab, eg. `av:fiber-new`, `icons:warning`, or `icons:error`
       */
      flagIcon: {
        type: String,
        attribute: "flag-icon",
      },
      /**
       * whether the tabbed interface is disabled
       */
      disabled: {
        type: Boolean,
        reflect: true,
        attribute: "disabled",
      },
      /**
       * whether the tab is hidden
       */
      hidden: {
        type: Boolean,
        reflect: true,
        attribute: "hidden",
      },
      /**
       * icon for this tab, eg. `maps:local-airport`, `maps:local-bar`, or `notification:wifi`
       */
      icon: {
        type: String,
      },
      /**
       * the unique identifier and anchor for the tab
       */
      id: {
        type: String,
        reflect: true,
        attribute: "id",
      },
      /**
       * label for the tab
       */
      label: {
        type: String,
      },
      /**
       * order of the tab
       */
      order: {
        type: Number,
      },
      role: {
        type: String,
        reflect: true,
        attribute: "role",
      },
      /**
       * total number of tabs
       */
      tabindex: {
        type: Number,
      },
      /**
       * total number of tabs
       */
      total: {
        type: Number,
      },
    };
  }
  constructor() {
    super();
    this.disabled = false;
    this.hidden = false;
    this.order = 1;
    this.role = "tabpanel";
    this.total = 1;
    this.tabindex = 0;
    this.flag = "";
    this.addEventListener("a11y-tab-flag", (e) => this.handleFlag(e));
  }

  /**
   * returns mutation observer
   * @readonly
   * @returns {object} MutationObserver to unwrap contents
   */
  get observer() {
    let lc = (e) => this._labelChanged();
    return new MutationObserver(lc);
  }
  /**
   * gets x of y string
   *
   * @readonly
   * @returns {string} eg., "1 of 2"
   */
  get xOfY() {
    return `${this.order} of ${this.total}`;
  }

  connectedCallback() {
    super.connectedCallback();
    this._labelChanged();
    this.observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    this.observer.disconnect();
    this.removeEventListener("a11y-tab-flag", (e) => this.handleFlag(e));
    this._fireTabChanged();
    super.disconnectedCallback();
  }
  /**
   * @fires a11y-tab-changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["id", "order"].includes(propName) && !this.id)
        this.id = `tab-${this.order}`;
      if (["label", "order"].includes(propName) && !this.label)
        this._labelChanged();
      if (propName === "flag") this._fireTabChanged();
      if (propName === "flagIcon") this._fireTabChanged();
      if (propName === "icon") this._fireTabChanged();
      if (propName === "id") {
        this.ariaLabelledby = `${this.id}-button`;
        this._fireTabChanged();
      }
      if (propName === "label") this._fireTabChanged();
      if (propName === "disabled" && this.disabled) this._fireTabChanged();
    });
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "a11y-tab";
  }

  /**
   * handles any change in flag
   * @param {event} e the tab change event
   */
  _handleFlag(e) {
    this.flag = e.detail.flag;
    this.flagIcon = e.detail.flagIcon;
  }
  /**
   * handles any change in the label
   */
  _labelChanged() {
    if (!this.label || this.label.trim() === "")
      this.label = this.querySelector('*[slot="label"]')
        ? this.querySelector('*[slot="label"]').innerHTML
        : `Tab ${this.order}`;
  }
  /**
   * handles any change in the tab attributes
   * @event a11y-tab-changed
   */
  _fireTabChanged() {
    this.dispatchEvent(
      new CustomEvent("a11y-tab-changed", {
        bubbles: true,
        cancelable: true,
        composed: false,
        detail: this,
      })
    );
  }
}
window.customElements.define(A11yTab.tag, A11yTab);
export { A11yTab };
