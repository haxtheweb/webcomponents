/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./lib/simple-toolbar-more-button.js";

const SimpleToolbarBehaviors = function (SuperClass) {
  return class extends SuperClass {
    /**
     * Store the tag name to make it easier to obtain directly.
     * @notice function name must be here for tooling to operate correctly
     */
    tag() {
      return "simple-toolbar";
    }

    // render function for styles
    static get baseStyles() {
      return [
        css`
          :host {
            display: flex;
            align-items: flex-start;
            opacity: 1;
            z-index: 2;
            margin: 0;
            justify-content: space-between;
            background-color: var(--rich-text-editor-bg);
            border: var(--rich-text-editor-border);
            font-size: 12px;
            transition: all 0.5s;
          }
          :host([hidden]) {
            z-index: -1;
            visibility: hidden;
            opacity: 0;
            height: 0;
          }
          :host([sticky]) {
            position: sticky;
            top: 0;
          }
          #buttons {
            display: flex;
            align-items: stretch;
            flex-wrap: wrap;
            justify-content: flex-start;
            max-height: unset;
            flex: 1 1 auto;
          }
          #buttons.collapsed {
            max-height: calc(2px + var(--simple-toolbar-button-height, 24px));
            overflow: hidden;
          }
          #morebutton {
            flex: 0 0 auto;
            justify-content: flex-end;
          }
          .group {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-evenly;
            align-items: stretch;
            padding: 0 3px;
          }
          .group:not(:last-of-type) {
            margin-right: 3px;
            border-right: var(--rich-text-editor-border);
          }
          .button {
            display: flex;
            flex: 0 0 auto;
            align-items: stretch;
          }
        `,
      ];
    }

    static get styles() {
      return [...this.baseStyles];
    }

    // properties available to custom element for data binding
    static get properties() {
      return {
        /**
         * is toolbar collapsed?
         */
        collapsed: {
          name: "collapsed",
          type: Boolean,
          attribute: "collapsed",
          reflect: true,
        },
        /**
         * Custom configuration of toolbar groups and buttons.
         * (See default value for example using default configuration.)
         */
        config: {
          name: "config",
          type: Array,
          attribute: "config",
        },
        /**
         * unique id
         */
        id: {
          name: "id",
          type: String,
          attribute: "id",
          reflect: true,
        },
        /**
         * icon for more button.
         */
        moreIcon: {
          name: "moreIcon",
          type: String,
          attribute: "more-icon",
        },
        /**
         * label for more button.
         */
        moreLabel: {
          name: "moreLabel",
          type: String,
          attribute: "more-label",
        },
        /**
         * label for more button when toggled.
         */
        moreLabelToggled: {
          name: "moreLabelToggled",
          type: String,
          attribute: "more-label-toggled",
          value: "Fewer Buttons",
        },
        /**
         * show text label for more button.
         */
        moreShowTextLabel: {
          name: "moreShowTextLabel",
          type: Boolean,
          attribute: "more-show-text-label",
        },
        /**
         * size of editor.
         */
        responsiveSize: {
          name: "responsiveSize",
          type: String,
          attribute: "responsive-size",
          reflect: true,
        },
        /**
         * Optional space-sperated list of keyboard shortcuts for editor
         * to fire this button, see iron-a11y-keys for more info.
         */
        shortcutKeys: {
          name: "shortcutKeys",
          type: Object,
        },
        /**
         * Should toolbar stick to top so that it is always visible?
         */
        sticky: {
          name: "sticky",
          type: Boolean,
          attribute: "sticky",
          reflect: true,
        },
        /**
         * raw array of buttons
         */
        __buttons: {
          name: "__buttons",
          type: Array,
        },
        /**
         * whether toolbar has focus
         */
        __focused: {
          name: "__focused",
          type: Boolean,
        },
        /**
         * whether toolbar is hovered
         */
        __hovered: {
          name: "__hovered",
          type: Boolean,
        },
      };
    }

    // render function for template
    render() {
      console.log("render");
      return this.toolbarTemplate;
    }
    /**
     * array of rendered buttons
     *
     * @readonly
     * @memberof SimpleToolbar
     */
    get buttons() {
      return this.__buttons;
    }
    /**
     * does toolbar have focus
     *
     * @readonly
     * @memberof SimpleToolbar
     */
    get focused() {
      return this.__focused;
    }
    /**
     * is mouseover toolbar
     *
     * @readonly
     * @memberof SimpleToolbar
     */
    get hovered() {
      return this.__hovered;
    }

    /**
     * more button's template
     *
     * @readonly
     * @memberof SimpleToolbar
     */
    get moreButton() {
      console.log("moreButton");
      return html` <simple-toolbar-more-button
        id="morebutton"
        aria-controls="buttons"
        class="button"
        @click="${(e) => (this.collapsed = !this.collapsed)}"
        icon="${this.moreIcon}"
        label="${this.moreLabel}"
        ?label-toggled="${this.moreLabelToggled}"
        ?show-text-label="${this.moreShowTextLabel}"
        ?toggled="${!this.collapsed}"
      >
      </simple-toolbar-more-button>`;
    }

    /**
     * toolbar element's template
     *
     * @readonly
     * @memberof SimpleToolbar
     */
    get toolbarTemplate() {
      console.log("toolbarTemplate");
      return html`
        <div id="buttons" class="${this.collapsed ? "collapsed" : ""}">
          <slot></slot>
        </div>
        ${this.moreButton}
      `;
    }

    // life cycle
    constructor() {
      super();
      window.ResponsiveUtility.requestAvailability();
      this.collapsed = true;
      this.config = [];
      this.__focused = false;
      this.__hovered = false;
      this.moreIcon = "more-vert";
      this.moreLabel = "More Buttons";
      this.moreLabelToggled = "Fewer Buttons";
      this.moreShowTextLabel = false;
      this.responsiveSize = "xs";
      this.sticky = false;
      this.shortcutKeys = [];
      this.setAttribute("aria-live", "polite");
      this.onfocus = (e) => (this.__focused = true);
      this.onblur = (e) => (this.__focused = false);
      this.onmouseover = (e) => (this.__hovered = true);
      this.onmouseout = (e) => (this.__hovered = false);
      this.addEventListener("register-button", (e) =>
        this._registerButtonShortcuts(e.detail)
      );
      this.addEventListener("deregister-button", (e) =>
        this._deregisterButtonShortcuts(e.detail)
      );
      this.addEventListener("change-shortcut-keys", (e) =>
        this._updateButtonShortcuts(
          e.detail,
          e.detail ? e.detail.button : undefined
        )
      );
      this.updateToolbar();
    }
    firstUpdated(changedProperties) {
      console.log("firstUpdated");
      if (super.firstUpdated) super.firstUpdated(changedProperties);
      this.updateToolbar();
    }
    updated(changedProperties) {
      if (super.updated) super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "config") this.updateToolbar();
        if (propName === "hidden")
          this.setAttribute("aria-hidden", this.hidden ? "true" : "false");
      });
    }
    /**
     * adds a button to a div
     *
     * @param {object} config object containing configuration for a button
     * @param {object} div element that acts as a button group
     * @returns {object} button element
     * @memberof SimpleToolbar
     */
    addButton(config, div) {
      console.log("add", config, div);
      let button = this._renderButton(config);
      div = div || this;
      div.appendChild(button);
      return button;
    }
    /**
     * adds a group of buttons to a parent container
     *
     * @param {object} config object containing configuration for a group of buttons
     * @param {object} container parent node
     * @returns {object} div element as a button group
     * @memberof SimpleToolbar
     */
    addButtonGroup(config, parent) {
      console.log("addButtonGroup", config, parent);
      let group = this._renderButtonGroup(config);
      console.log("add group", config.buttons, parent, group);
      (parent || this).appendChild(group);
      config.buttons.forEach((buttonConfig) =>
        this.addButton(buttonConfig, group)
      );
      return group;
    }
    /**
     * clears toolbar and resets shortcuts
     *
     * @returns
     * @memberof SimpleToolbar
     */
    clearToolbar() {
      this.innerHTML = "";
      this.shortcutKeys = {};
      this.__buttons = [];
    }
    /**
     * updates buttons based on change in config
     */
    updateToolbar() {
      if (!this) return;
      this.clearToolbar();
      if (typeof this.config != typeof []) this.config = JSON.parse(config);
      this.config.forEach((config) => {
        console.log("foreach", config.type);
        if (config.type === "button-group") {
          this.addButtonGroup(config, this);
        } else {
          this.addButton(config, this);
        }
      });
    }
    /**
     * registers shortcut keys
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    _registerButtonShortcuts(button) {
      if (button.shortcutKeys) this.shortcutKeys[button.shortcutKeys] = button;
      this.__buttons.push(button);
      this.__buttons = [...new Set(this.__buttons)];
      console.log(this, this.buttons, this.shortcutKeys);
    }
    /**
     * registers shortcut keys
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    _updateButtonShortcuts(oldValue, button) {
      if (oldValue) this._deregisterButtonShortcuts(oldValue);
      if (button) this._registerButtonShortcuts(button);
    }
    /**
     * registers shortcut keys
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    _deregisterButtonShortcuts(button) {
      if (button.shortcutKeys) delete this.shortcutKeys[button.shortcutKeys];
      this.__buttons = this.__buttons.filter((b) => b !== button);
      console.log(this, this.buttons, this.shortcutKeys);
    }
    /**
     * creates a button element based on config object
     *
     * @param {object} config configuration object
     * @returns {object} button node
     * @memberof SimpleToolbar
     */
    _renderButton(config) {
      let button = document.createElement(config.type);
      Object.keys(config).forEach((key) => (button[key] = config[key]));
      button.setAttribute("class", "button");
      button.addEventListener("button-command", this._handleButton);
      return button;
    }
    /**
     * creates a div element to contain/group buttons based on config object
     *
     * @param {object} config object containing configuration for a group of buttons
     * @returns {object} div element as a button group
     * @memberof SimpleToolbar
     */
    _renderButtonGroup(config) {
      console.log("_renderButtonGroup", config);
      let group = document.createElement("div");
      group.setAttribute("class", "group");
      Object.keys(config).forEach((key) => (group[key] = config[key]));
      return group;
    }
  };
};

/**
 * `simple-toolbar`
 * `a customizable toolbar`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class SimpleToolbar extends SimpleToolbarBehaviors(LitElement) {}
customElements.define("simple-toolbar", SimpleToolbar);
export { SimpleToolbar };
