/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "./lib/simple-toolbar-more-button.js";
import "./lib/simple-toolbar-help-button.js";
import "./lib/simple-toolbar-field.js";
import "./lib/simple-toolbar-button-group.js";
import "@lrnwebcomponents/end-user-doc/end-user-doc.js";
import { SimpleToolbarGlobalProperties } from "./lib/simple-toolbar-button.js";
/**
 * @customElement
 * @class
 */
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
            background-color: var(--simple-toolbar-bg);
            font-size: inherit;
            margin: 0;
            padding: 0;
            transition: all 0.5s;
            transition: z-index 0s;
          }
          :host([hidden]) {
            z-index: -1;
            visibility: hidden;
            opacity: 0;
            height: 0;
          }
          :host([disabled]) {
            opacity: 0.6;
            pointer-events: none;
            z-index: 0;
          }
          :host(:focus-within) {
            border: 1px solid
              var(
                --simple-toolbar-hover-border-color,
                var(--simple-toolbar-button-hover-border-color)
              );
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
          }
          ::slotted(.group) {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            align-items: stretch;
            margin: 0;
            flex: 0 1 auto;
            overflow-y: visible;
            border-width: 0px;
            border-style: solid;
            padding: var(--simple-toolbar-group-padding, 0 3px);
            border-color: var(
              --simple-toolbar-border-color,
              var(--simple-toolbar-group-border-color, transparent)
            );
          }
          ::slotted(.group:not(:last-child)) {
            border-right-width: var(
              --simple-toolbar-group-border-width,
              var(--simple-toolbar-border-width, 1px)
            );
          }
          ::slotted(*:hover),
          ::slotted(*:focus-wthin) {
            z-index: var(--simple-toolbar-focus-z-index, 100);
            transition: z-index 0s;
          }
          :host([collapsed]:not([always-expanded]))
            ::slotted(*[collapse-hide]) {
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
        ...SimpleToolbarGlobalProperties,
        /**
         * always expanded so more button is unnecessary?
         */
        alwaysExpanded: {
          name: "alwaysExpanded",
          type: Boolean,
          attribute: "always-expanded",
          reflect: true,
        },
        /**
         * id of element controlled by toolbar
         */
        ariaControls: {
          name: "ariaControls",
          type: String,
          attribute: "aria-controls",
          reflect: true,
        },
        /**
         * label for the toolbar
         */
        ariaLabel: {
          name: "ariaLabel",
          type: String,
          attribute: "aria-label",
          reflect: true,
        },
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
         * collection of documentation for help button modal 
         */
        documentation: {
          attribute: "documentation",
          type: Object
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
         * Optional space-sperated list of keyboard shortcuts for editor
         * to fire this button, see iron-a11y-keys for more info.
         */
        moreShortcuts: {
          name: "moreShortcuts",
          attribute: "more-shortcuts",
          type: Object,
        },
        /**
         * Optional space-sperated list of keyboard shortcuts for editor
         * to fire this button, see iron-a11y-keys for more info.
         */
        shortcutKeys: {
          name: "shortcutKeys",
          attribute: "shortcut-keys",
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
         * first simple-toolbar-help-button
         */
        __helpModalButton: {
          name: "__helpModalButton",
          type: Object,
        },
        /**
         * end-user-doc element
         */
        __helpDocs: {
          name: "__helpDocs",
          type: Object,
        },
        /**
         * schema for shortcutDocs
         */
        __shortcutDocs: {
          name: "__shortcutDocs",
          type: Object,

        },
        /**
         * whether there is no need to collapse
         */
        collapseDisabled: {
          type: Boolean,
          attribute: "collapse-disabled",
          reflect: true,
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
        .align-horizontal="${this.alignHorizontal}"
        .align-vertical="${this.alignVertical}"
        aria-controls="buttons"
        class="button"
        @click="${(e) => (this.collapsed = !this.collapsed)}"
        ?disabled=${this.collapseDisabled}
        @toggle="${(e) => (this.collapsed = !this.collapsed)}"
        ?hidden=${this.collapseDisabled}
        .icon="${this.icon}"
        .icon-position="${this.iconPosition}"
        .label="${this.label}"
        .shortcut="${this.shortcut}"
        ?show-text-label="${this.showTextLabel}"
        ?toggled="${!this.collapsed}"
        .toggled-icon="${this.toggledIcon}"
        .toggled-label="${this.toggledLabel}"
        .toggled-tooltip="${this.toggledTooltip}"
        .tooltip-direction="${this.tooltipDirection}"
        part="morebutton"
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
        <div
          id="buttons"
          class="${!this.alwaysExpanded && this.collapsed ? "collapsed" : ""}"
          part="buttons"
        >
          <slot></slot>
        </div>
        ${this.alwaysExpanded ? "" : this.moreButton}
      `;
    }

    // life cycle
    constructor() {
      super();
      this.collapsed = true;
      this.collapseDisabled = false;
      this.config = [];
      this.__buttons = [];
      this.__focused = false;
      this.__hovered = false;
      this.icon = "more-vert";
      this.label = "More Buttons";
      this.toggledLabel = "Fewer Buttons";
      this.showTextLabel = false;
      this.shortcut = "ctrl+shift+;";
      this.sticky = false;
      this.shortcutKeys = {};
      this.__helpDocs = document.createElement('end-user-doc');
      this.addEventListener("register-button", this._handleButtonRegister);
      this.addEventListener("deregister-button", this._handleButtonDeregister);
      this.addEventListener("end-user-docs-connected", this._handleHelpDocsRegister);
      this.addEventListener("end-user-docs-disconnected", this._handleHelpDocsDeregister);
      this.addEventListener("update-button-registry", this._handleButtonUpdate);
      this.addEventListener("toggle-toolbar", this._handleToggleToolbar);
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
      this.setAttribute("role", "toolbar");
      this.onfocus = (e) => (this.__focused = true);
      this.onblur = (e) => (this.__focused = false);
      this.onmouseover = (e) => (this.__hovered = true);
      this.onmouseout = (e) => (this.__hovered = false);
      this.addEventListener("keydown", this._handleKeydown);
      if (super.firstUpdated) super.firstUpdated(changedProperties);
      this.__endUserDocSchema = {
        id: 'main',
        title: 'Documentation',
        contents: []
      }
    }
    /**
     * end-user-doc component
     *
     * @readonly
     */
    get endUserDoc(){
      return this.__helpDocs;
    }

    /**
     * end-user-doc component's content schema
     *
     * @readonly
     */
    get endUserDocContents(){
      return !this.endUserDoc ? undefined : this.endUserDoc.contents;
    }

    /**
     * top-level id for end-user-doc component's content
     *
     * @readonly
     */
    get endUserDocId(){
      return !this.endUserDocContents ? undefined : this.endUserDocContents.id;
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
      this.checkDocSection(changedProperties,"shortcutKeys","__shortcutDocs",'_getShortcutDocs');
      if (!this.currentItem && this.buttons)
        this.setCurrentItem(this.buttons[0]);
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
    addButtonGroup(config = {}, parent) {
      if (!config.buttons || config.buttons.length < 1) return;
      let group = this._renderButtonGroup(config);
      (parent || this).appendChild(group);
      this._addConfigItems(config.buttons, group);
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
      this.shortcutKeys[this.shortcut] = this.shadowRoot
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
      //remove button from list of buttons
      this.__buttons = this.__buttons.filter((b) => b !== button);

      //remove button shortcut keys
      (button.shortcutKeys || "")
        .split(" ")
        .forEach((key) => {
          if(this.shortcutKeys[key] === button) delete this.shortcutKeys[key]
        });

      //add end-user-doc shortcut schema if there is none
      if(!this.endUserDocId) this.updateDocSection('__shortcutDocs','_getShortcutDocs',true,true);

      //remove button event listeners
      button.removeEventListener("blur", (e) =>
        this._handleFocusChange(button)
      );
      button.removeEventListener("focus", (e) =>
        this._handleFocusChange(button)
      );
    }
    /**
     * deregisters help docs when removed
     * 
     * @param {object} docs simple-toolbar-help-docs component
     */
    deregisterHelpDocs(docs){
      this.__helpDocs = undefined;
    }
    /**
     * registers button when appended
     *
     * @param {object} button button node
     * @memberof SimpleToolbar
     */
    registerButton(button) {
      //add button to list of buttons
      this.__buttons.push(button);
      this.__buttons = [...new Set(this.__buttons)];

      //get all button shortcut keys
      (button.shortcutKeys || "")
        .split(" ")
        .forEach((key) => {
          if(key && key != '') this.shortcutKeys[key] = button;
        });
      if (button.role !== "menuitem") button.isCurrentItem = false;

      //add end-user-doc schema if there is none
      if(!this.endUserDocId) this.updateDocSection('__shortcutDocs','_getShortcutDocs',true,true);

      //add button event listeners
      button.addEventListener("blur", (e) => this._handleFocusChange(button));
      button.addEventListener("focus", (e) => this._handleFocusChange(button));
      if (!this.currentItem) this.setCurrentItem(button);
    }
    /**
     * registers help docs when appended
     * 
     * @param {object} docs simple-toolbar-help-docs component
     */
    registerHelpDocs(docs){
      this.__helpDocs = docs;

      //add end-user-doc shortcut schema if there is none
      if(!this.endUserDocId) this.updateDocSection('__shortcutDocs','_getShortcutDocs',true,true);
    }
    /**
     * gets all shortcut key documentation into a single cheatsheet
     */
    _getShortcutDocs(){
      if(!this.shortcutKeys) return undefined;
      let keys = Object.keys(this.shortcutKeys || {}),
        schema = {
        id: "keyboard-shortcuts",
        title: "Keyboard Shortcuts",
        cheatsheet: {
          columns: ["Keys","Shortcut"],
          rows: []
        }
      };
      if(keys.length > 0) keys.forEach(key=>{
        if(this.shortcutKeys[key]) schema.cheatsheet.rows.push([html`<code>${key}</code>`,this.shortcutKeys[key].label])
      });
      console.log(schema);
      return schema;
    }
    /**
     * 
     * @param {array} changedProperties changed properties fomr lifecycle update
     * @param {string} dataProp name of property for section data
     * @param {string} sectionProp name of property for section of end-user-doc contents schema object
     * @param {string} updateFunction name of function to return new content schema object to replace section
     * @param {string} enabledProp name of property for whether or not section is enabled
     * @param {string} parentId id of parent section
     * @returns 
     */
    checkDocSection(changedProperties,dataProp,sectionProp,updateFunction,enabledProp,parentId){
      if(!updateFunction) return;
      let enabledChanged = false, docsChanged = false;
      changedProperties.forEach((oldValue, propName) => {
        if (!!enabledProp && propName === enabledProp)  {
          enabledChanged = true;
        }
        if (propName === dataProp)  {
          docsChanged = true;
          enabledChanged = true;
        }
      });
      if(enabledChanged) this.updateDocSection(sectionProp,updateFunction,docsChanged,enabledChanged,parentId);
    }

    /**
     * shows or hides a documentation section based on whether or not section is enabled
     * 
     * @param {string} sectionProp name of property for section of end-user-doc contents schema object
     * @param {string} updateFunction name of function to return new content schema object to replace section
     * @param {boolean} changed whether or not section content has changed
     * @param {boolean} enabled whether or not section is enabled
     * @param {string} [parentId=this.endUserDocId] id of parent section
     * @returns 
     */
    updateDocSection(sectionProp,updateFunction,changed,enabled,parentId){
      console.log('updateDocSection',sectionProp,updateFunction,changed,enabled,parentId);
      if(!this.endUserDoc || !updateFunction) return;

      //add end user doc schema if there is none
      if(!this.endUserDocId) this.endUserDoc.contents = this.__endUserDocSchema;

      if((!enabled || changed) && !!this[sectionProp]) {
        //remove markdown section from docs
        if(!!this[sectionProp] && this[sectionProp].id && this.endUserDoc.contentsById[this[sectionProp].id]) 
          this.endUserDoc.removeSectionContent(this[sectionProp].id);
      }
      if(enabled){
        //add markdown patterns and add markdown section to docs
        if(!this[sectionProp] || changed) this[sectionProp] = this[updateFunction]();
        //add markdown section schema exists add it to docs
        if(!!this[sectionProp]) this.endUserDoc.appendToSection({...this[sectionProp]},parentId || this.endUserDocId);
        console.log('updateDocSection',this[sectionProp],this.endUserDocId,this.endUserDocContents);
      }
    }

    /**
     * resizes toolbar based on element positions
     *
     */
    resizeToolbar() {
      if (this.alwaysExpanded) return;
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
      this.collapseDisabled = !!shown;
      if (!this.currentItem) this.setCurrentItem(this.firstItem);
    }
    /**
     * gets first main menu item
     *
     * @readonly
     */
    get firstItem() {
      return !this.mainItems ? undefined : this.mainItems[0];
    }
    /**
     * gets next main menu item
     *
     * @readonly
     */
    get nextItem() {
      return this.getItem();
    }
    /**
     * gets next main menu item
     *
     * @readonly
     */
    get previousItem() {
      return this.getItem(-1);
    }
    /**
     * gets last main menu item
     *
     * @readonly
     */
    get lastItem() {
      return !this.buttons
        ? undefined
        : this.mainItems[this.mainItems.length - 1];
    }
    /**
     * gets main menu items
     *
     * @readonly
     */
    get mainItems() {
      return this.buttons.filter((b) => b.role !== "menuitem");
    }
    /**
     * gets button's index in main menu
     *
     * @param {object} [item=this.currentItem]
     * @returns
     */
    getItemIndex(item = this.currentItem) {
      let index = -1;
      this.mainItems.forEach((b, i) => {
        if (b === item) index = i;
      });
      return index;
    }
    /**
     * gets previous or next item based on offset
     *
     * @param {number} [offset=1]
     * @returns
     */
    getItem(offset = 1) {
      let index = this.getItemIndex(this.currentItem) + offset;
      return !this.mainItems || index < 0 || this.mainItems.length <= index
        ? undefined
        : this.mainItems[index];
    }
    /**
     * sets current item
     *
     * @param {object} item
     */
    setCurrentItem(item) {
      if (this.currentItem) this.currentItem.isCurrentItem = false;
      if (item && item.closest("[collapse-hide=true]")) this.collapsed = false;
      this.currentItem = item;
      if (this.currentItem) this.currentItem.isCurrentItem = true;
    }
    /**
     * focuses on an item
     *
     * @param {object} item
     */
    focusOn(item) {
      let delay = item && item.closest("[collapse-hide=true]");
      if (this.currentItem.close) this.currentItem.close(true);
      this.setCurrentItem(item);
      if (delay) {
        setTimeout(() => this.currentItem.focus(), 300);
      } else {
        this.currentItem.focus();
      }
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
    updateToolbar(config = this.config) {
      if (!this || !this.config || this.config.length == 0) return;
      this.clearToolbar();
      if (typeof this.config != typeof []) this.config = JSON.parse(config);
      this._addConfigItems(this.config);
      this.resizeToolbar();
    }
    /**
     * loops through config to add items
     *
     * @param {array} items
     */
    _addConfigItems(items = this.config, parent = this) {
      (items || []).forEach((config) => {
        if (
          config.type === "button-group" ||
          config.type === "simple-toolbar-button-group"
        ) {
          this.addButtonGroup(config, parent);
        } else {
          this.addButton(config, parent);
        }
      });
    }
    /**
     * key codes by key
     *
     * @readonly
     */
    get keyCode() {
      return {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
      };
    }
    /**
     * handles keydown events, as prescribed in
     * {@link https://www.w3.org/TR/wai-aria-practices/examples/toolbar/toolbar.html}
     *
     * @param {event} e
     * @returns
     */
    _handleKeydown(e) {
      let finished = false;
      let key = this._shortcutKeysMatch(e);
      if (key) return;
      switch (e.keyCode) {
        case this.keyCode.RIGHT:
          this.focusOn(this.nextItem || this.firstItem);
          finished = true;
          break;

        case this.keyCode.LEFT:
          this.focusOn(this.previousItem || this.lastItem);
          finished = true;
          break;

        case this.keyCode.HOME:
          this.focusOn(this.firstItem);
          finished = true;
          break;

        case this.keyCode.END:
          this.focusOn(this.lastItem);
          finished = true;
          break;

        case this.keyCode.UP:
          this.focusOn(this.previousItem || this.lastItem);
          finished = true;
          break;

        case this.keyCode.DOWN:
          this.focusOn(this.nextItem || this.firstItem);
          finished = true;
          break;

        default:
          break;
      }

      if (finished) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    /**
     * handles focus changes and determines if toolbar still has focus;
     *
     */
    _handleFocusChange() {
      this.__focused = this.contains(document.activeElement);
    }
    /**
     * handles appended help documentation
     *
     * @param {event} e
     */
    _handleHelpDocsRegister(e) {
      console.log('reg',e);
      e.stopPropagation();
      this.registerHelpDocs(e.detail);
    }
    /**
     * handles moved/removed help documentation
     *
     * @param {event} e
     */
    _handleHelpDocsDeregister(e) {
      e.stopPropagation();
      this.deregisterHelpDocs(e.detail);
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
    _handleToggleToolbar(e) {
      this.collapsed =
        e.detail && typeof e.detail !== typeof undefined
          ? e.detail
          : !this.collapsed;
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
      let type =
        !!config.type && config.type === "simpletoolbar-button-group"
          ? config.type
          : "div";
      let group = document.createElement(type);
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
 * @extends SimpleToolbarBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 * @demo demo/grid.html Grid
 * @demo ./demo/buttons.html Buttons
 * @demo ./demo/menu.html Menu
 */
class SimpleToolbar extends SimpleToolbarBehaviors(LitElement) {}
customElements.define("simple-toolbar", SimpleToolbar);
export { SimpleToolbar, SimpleToolbarBehaviors };
