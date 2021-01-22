/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
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
    static get stickyStyles() {
      return [
        css`
          :host([sticky]) {
            position: sticky;
            top: 0;
          }
        `,
      ];
    }

    // render function for styles
    static get baseStyles() {
      return [
        css`
          :host {
            position: relative;
            display: flex;
            align-items: flex-start;
            opacity: 1;
            z-index: 2;
            margin: 0;
            justify-content: space-between;
            background-color: var(--simple-toolbar-border-bg);
            font-size: 12px;
            transition: all 0.5s;
            margin: 0;
            padding: 0;
          }
          :host([hidden]) {
            z-index: -1;
            visibility: hidden;
            opacity: 0;
            height: 0;
          }
          #buttons {
            flex-wrap: wrap;
            display: flex;
            justify-content: flex-start;
            flex: 1 1 auto;
            overflow-y: visible;
          }
          #buttons.collapsed {
            flex-wrap: nowrap;
            flex: 0 1 auto;
            max-width: calc(100% - 40px);
          }
          #morebutton {
            flex: 0 0 auto;
            justify-content: flex-end;
          }
          ::slotted(.group) {
            min-width: 0;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-evenly;
            align-items: stretch;
            padding: var(--simple-toolbar-group-padding, 0 3px);
            margin: 0;
            flex: 0 1 auto;
            overflow-y: visible;
            white-space: nowrap;
          }
          ::slotted(.group:not(:last-child)) {
            border-right: var(
                --simple-toolbar-group-border-width,
                var(--simple-toolbar-border-width, 1px)
              )
              solid
              var(
                --simple-toolbar-border-color,
                var(--simple-toolbar-group-border-color, transparent)
              );
          }
        `,
      ];
    }

    static get styles() {
      return [...this.baseStyles, ...this.stickyStyles];
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
      this.collapsed = true;
      this.config = [];
      this.__buttons = [];
      this.__focused = false;
      this.__hovered = false;
      this.moreIcon = "more-vert";
      this.moreLabel = "More Buttons";
      this.moreLabelToggled = "Fewer Buttons";
      this.moreShowTextLabel = false;
      this.sticky = false;
      this.shortcutKeys = [];
      this.addEventListener("register-button", this._handleButtonRegister);
      this.addEventListener("deregister-button", this._handleButtonDeregister);
      this.addEventListener("update-button-registry", this._handleButtonUpdate);
    }
    firstUpdated(changedProperties) {
      this.setAttribute("aria-live", "polite");
      this.onfocus = (e) => (this.__focused = true);
      this.onblur = (e) => (this.__focused = false);
      this.onmouseover = (e) => (this.__hovered = true);
      this.onmouseout = (e) => (this.__hovered = false);
      if (super.firstUpdated) super.firstUpdated(changedProperties);
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
      let group = this._renderButtonGroup(config);
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
     * removes registered button when moved/removed
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    deregisterButton(button) {
      if (button.shortcutKeys) delete this.shortcutKeys[button.shortcutKeys];
      this.__buttons = this.__buttons.filter((b) => b !== button);
    }
    /**
     * registers button when appended
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    registerButton(button) {
      if (button.shortcutKeys) this.shortcutKeys[button.shortcutKeys] = button;
      this.__buttons.push(button);
      this.__buttons = [...new Set(this.__buttons)];
    }
    /**
     * updates registered button when shortcut keys change
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    updateButtonShortcuts(oldValue, button) {
      if (oldValue) this.deregisterButton(oldValue);
      if (button) this.registerButton(button);
    }
    /**
     * updates buttons based on change in config
     */
    updateToolbar() {
      if (!this || this.config.length == 0) return;
      this.clearToolbar();
      if (typeof this.config != typeof []) this.config = JSON.parse(config);
      this.config.forEach((config) => {
        if (config.type === "button-group") {
          this.addButtonGroup(config, this);
        } else {
          this.addButton(config, this);
        }
      });
    }
    /**
     * handles appended button
     *
     * @param {event} e
     */
    _handleButtonRegister(e) {
      e.stopPropagation();
      this.registerButton(e.detail);
    }
    /**
     * handles moved/removed button
     *
     * @param {event} e
     */
    _handleButtonDeregister(e) {
      e.stopPropagation();
      this.deregisterButton(e.detail);
    }
    /**
     * handles updated button
     *
     * @param {event} e
     */
    _handleButtonUpdate(e) {
      e.stopPropagation();
      if (e.detail && e.detail.button && e.detail.shortcutKeys)
        this.updateButtonShortcuts(e.detail, e.detail.button);
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
      Object.keys(config).forEach((key) => {
        button[key] = config[key];
        button.setAttribute(key, config[key]);
      });
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
      let group = document.createElement("div");
      group.setAttribute("class", "group");
      Object.keys(config).forEach((key) => (group[key] = config[key]));
      return group;
    }
  };
};

/**
 * `simple-toolbar`
 * a customizable toolbar
 *
### Styling

`<simple-toolbar>` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
--simple-toolbar-border-color | default border color | transparent
--simple-toolbar-border-width | default border width | 1px
--simple-toolbar-group-border-color | border color for button groups | --simple-toolbar-border-color
--simple-toolbar-group-border-width | border width for button groups | --simple-toolbar-border-width
--simple-toolbar-group-padding | padding for button groups | 0 3px
 * 
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class SimpleToolbar extends SimpleToolbarBehaviors(LitElement) {}
customElements.define("simple-toolbar", SimpleToolbar);
export { SimpleToolbar, SimpleToolbarBehaviors };
