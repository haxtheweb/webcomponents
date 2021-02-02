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
          #morebutton {
            flex: 0 0 auto;
            justify-content: flex-end;
          }
          ::slotted(.group) {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-evenly;
            align-items: stretch;
            padding: var(--simple-toolbar-group-padding, 0 3px);
            margin: 0;
            flex: 0 1 auto;
            overflow-y: visible;
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
          :host([collapsed]) ::slotted(*[collapse-hide]) {
            display: none !important;
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
         * show text label for more button.
         */
        moreShortcut: {
          name: "moreShortcut",
          type: Boolean,
          attribute: "more-shortcut",
        },
        /**
         * Optional space-sperated list of keyboard shortcuts for editor
         * to fire this button, see iron-a11y-keys for more info.
         */
        shortcutKeys: {
          name: "shortcutKeys",
          attribute: "shoertcut-keys",
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
         * whether there is no need to collapse
         */
        __collapseDisabled: {
          type: Boolean,
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
        @toggle="${(e) => (this.collapsed = !this.collapsed)}"
        ?disabled=${this.__collapseDisabled}
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
      this.__collapseDisabled = false;
      this.__focused = false;
      this.__hovered = false;
      this.moreIcon = "more-vert";
      this.moreLabel = "More Buttons";
      this.moreLabelToggled = "Fewer Buttons";
      this.moreShowTextLabel = false;
      this.moreShortcut = "ctrl+shift+;";
      this.sticky = false;
      this.shortcutKeys = {};
      this.addEventListener("register-button", this._handleButtonRegister);
      this.addEventListener("deregister-button", this._handleButtonDeregister);
      this.addEventListener("update-button-registry", this._handleButtonUpdate);
    }
    /**
     * Called every time the element is inserted into the DOM. Useful for
     * running setup code, such as fetching resources or rendering.
     * Generally, you should try to delay work until this time.
     */
    connectedCallback() {
      super.connectedCallback();
      if (this.collapsed)
        window.addEventListener("resize", this._handleResize.bind(this));
      this.addEventListener("keypress", this._handleShortcutKeys);
    }
    /**
     * Called every time the element is removed from the DOM. Useful for
     * running clean up code (removing event listeners, etc.).
     */
    disconnectedCallback() {
      if (this.collapsed)
        window.removeEventListener("resize", this._handleResize.bind(this));
      super.disconnectedCallback();
      this.addEventListener("keypress", this._handleShortcutKeys);
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
        if (propName === "collapsed") {
          if (this.collapsed) {
            this.resizeToolbar();
            window.addEventListener("resize", this._handleResize.bind(this));
          } else {
            window.removeEventListener("resize", this._handleResize.bind(this));
          }
        }
        if (propName === "hidden")
          this.setAttribute("aria-hidden", this.hidden ? "true" : "false");
      });
      this.resizeToolbar();
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
     * empties toolbar and registered buttons
     *
     * @returns
     * @memberof SimpleToolbar
     */
    clearToolbar() {
      this.innerHTML = "";
      this.__buttons = [];
      this.shortcutKeys = {};
      this.shortcutKeys[this.moreShortcut] = this.shadowRoot
        ? this.shadowRoot.querySelector("#morebutton")
        : undefined;
    }
    /**
     * removes registered button when moved/removed
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    deregisterButton(button) {
      this.__buttons = this.__buttons.filter((b) => b !== button);
      (button.shortcutKeys || "")
        .split(" ")
        .forEach((key) => delete this.shortcutKeys[key]);
    }
    /**
     * registers button when appended
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    registerButton(button) {
      this.__buttons.push(button);
      this.__buttons = [...new Set(this.__buttons)];
      (button.shortcutKeys || "")
        .split(" ")
        .forEach((key) => (this.shortcutKeys[key] = button));
    }

    resizeToolbar() {
      if (!this.collapsed) return;
      let items = [...(this.children || [])],
        shown = true;
      items.forEach((item) => {
        if (item.removeAttribute) item.removeAttribute("collapse-hide");
        if (item.offsetTop && item.offsetTop > 0) {
          item.setAttribute("collapse-hide", true);
          shown = false;
        } else if (!shown) {
          item.setAttribute("collapse-hide", true);
        }
      });
      this.__collapseDisabled = shown;
    }
    /**
     * updates registered button, it needed
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    updateButton(button) {
      if (button) this.deregisterButton(button);
      if (button) this.registerButton(button);
    }
    /**
     * updates buttons based on change in config
     */
    updateToolbar() {
      if (!this || !this.config || this.config.length == 0) return;
      this.clearToolbar();
      if (typeof this.config != typeof []) this.config = JSON.parse(config);
      this.config.forEach((config) => {
        if (config.type === "button-group") {
          this.addButtonGroup(config, this);
        } else {
          this.addButton(config, this);
        }
      });
      this.resizeToolbar();
    }
    /**
     * handles appended button
     *
     * @param {event} e
     */
    _handleButtonRegister(e) {
      e.stopPropagation();
      this.registerButton(e.detail);
      this.resizeToolbar();
    }
    /**
     * handles moved/removed button
     *
     * @param {event} e
     */
    _handleButtonDeregister(e) {
      e.stopPropagation();
      this.deregisterButton(e.detail);
      this.resizeToolbar();
    }
    /**
     * handles updated button
     *
     * @param {event} e
     */
    _handleButtonUpdate(e) {
      e.stopPropagation();
      this.updateButton(e.detail);
    }
    /**
     * resizes toolbar on window resize
     *
     */
    _handleResize(e) {
      this.resizeToolbar();
    }
    /**
     * handles shortcut keys for buttons
     *
     * @param {event} e
     * @event shortcut-key-pressed
     */
    _handleShortcutKeys(e) {
      let key = this._shortcutKeysMatch(e);
      if (key) {
        e.preventDefault();
        this.shortcutKeys[key]._handleShortcutKeys(e, key);
        this.dispatchEvent(
          new CustomEvent("shortcut-key-pressed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              ...e.detail,
              button: this,
              shortcutKey: this,
            },
          })
        );
      }
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
    /**
     * determines if a keyup event matches a shortcut
     *
     * @param {*} keyEvt
     * @returns
     */
    _shortcutKeysMatch(keyEvt) {
      let shortcutKey = false;
      Object.keys(this.shortcutKeys || {}).forEach((shortcut) => {
        let keys = (shortcut || "").toLowerCase().split("+"),
          altKey = keys.includes("alt"),
          ctrlKey = keys.includes("ctrl"),
          metaKey = keys.includes("meta") || keys.includes("cmd"),
          shiftKey = keys.includes("shift"),
          uppercase = keyEvt.shiftKey && keyEvt.code > 65 && keyEvt.code < 91,
          filter = keys
            .filter((key) => key.length == 1)
            .map((key) => (!!uppercase ? key.toUpperCase() : key)),
          key = filter[0],
          match =
            altKey === keyEvt.altKey &&
            (ctrlKey === keyEvt.ctrlKey ||
              ((ctrlKey === window.navigator.platform) === "MacIntel" &&
                e.metaKey)) &&
            metaKey === keyEvt.metaKey &&
            shiftKey === keyEvt.shiftKey &&
            (keyEvt.key ? keyEvt.key === key : !key);
        if (match) shortcutKey = shortcut;
        return;
      });
      return shortcutKey;
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
