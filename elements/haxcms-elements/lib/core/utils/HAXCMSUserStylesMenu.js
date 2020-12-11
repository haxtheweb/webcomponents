import { css, html } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";

const HAXCMSUserStylesMenuMixin = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.hideUserStylesMenu = true;
      this.fontSize = 1;
      this.fontFamily = 0;
      this.colorTheme = 0;
      this.addEventListener("click", this.checkUserStylesMenuOpen.bind(this));
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        ...styles,
        css`
          :host([font-family="0"]) {
            font-family: Georgia, serif;
          }
          :host([font-family="1"]) {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          }
          :host([font-size="0"]) {
            --haxcms-base-styles-body-font-size: 1.2rem;
            --hax-base-styles-p-font-size: 1.2rem;
            --hax-base-styles-list-font-size: 1.2rem;
            --hax-base-styles-a-font-size: 1.2rem;
            --hax-base-styles-h1-font-size: 2.2rem;
            --hax-base-styles-h2-font-size: 2rem;
            --hax-base-styles-h3-font-size: 1.8rem;
            --hax-base-styles-h4-font-size: 1.6rem;
            --hax-base-styles-h5-font-size: 1.4rem;
            --hax-base-styles-h6-font-size: 1.2rem;
          }
          :host([font-size="1"]) {
            --haxcms-base-styles-body-font-size: 1.4rem;
            --hax-base-styles-p-font-size: 1.4rem;
            --hax-base-styles-list-font-size: 1.4rem;
            --hax-base-styles-a-font-size: 1.4rem;
            --hax-base-styles-h1-font-size: 2.4rem;
            --hax-base-styles-h2-font-size: 2.2rem;
            --hax-base-styles-h3-font-size: 2rem;
            --hax-base-styles-h4-font-size: 1.8rem;
            --hax-base-styles-h5-font-size: 1.6rem;
            --hax-base-styles-h6-font-size: 1.4rem;
          }
          :host([font-size="2"]) {
            --haxcms-base-styles-body-font-size: 1.6rem;
            --hax-base-styles-p-font-size: 1.6rem;
            --hax-base-styles-list-font-size: 1.6rem;
            --hax-base-styles-a-font-size: 1.6rem;
            --hax-base-styles-h1-font-size: 2.6rem;
            --hax-base-styles-h2-font-size: 2.4rem;
            --hax-base-styles-h3-font-size: 2.2rem;
            --hax-base-styles-h4-font-size: 2rem;
            --hax-base-styles-h5-font-size: 1.8rem;
            --hax-base-styles-h6-font-size: 1.6rem;
          }
          :host([font-size="3"]) {
            --haxcms-base-styles-body-font-size: 1.8rem;
            --hax-base-styles-p-font-size: 1.8rem;
            --hax-base-styles-list-font-size: 1.8rem;
            --hax-base-styles-a-font-size: 1.8rem;
            --hax-base-styles-h1-font-size: 2.8rem;
            --hax-base-styles-h2-font-size: 2.6rem;
            --hax-base-styles-h3-font-size: 2.4rem;
            --hax-base-styles-h4-font-size: 2.2rem;
            --hax-base-styles-h5-font-size: 2rem;
            --hax-base-styles-h6-font-size: 1.8rem;
          }
          :host([font-size="4"]) {
            --haxcms-base-styles-body-font-size: 2rem;
            --hax-base-styles-p-font-size: 2rem;
            --hax-base-styles-list-font-size: 2rem;
            --hax-base-styles-a-font-size: 2rem;
            --hax-base-styles-h1-font-size: 3rem;
            --hax-base-styles-h2-font-size: 2.8rem;
            --hax-base-styles-h3-font-size: 2.6rem;
            --hax-base-styles-h4-font-size: 2.4rem;
            --hax-base-styles-h5-font-size: 2.2rem;
            --hax-base-styles-h6-font-size: 2rem;
          }
          :host([color-theme="0"]) {
            --haxcms-user-styles-color-theme-color-color: #000000;
            --haxcms-user-styles-color-theme-color-background: #ffffff;
            --haxcms-user-styles-color-theme-color-1: #252737;
            --haxcms-user-styles-color-theme-color-2: #f5f5f5;
            --haxcms-user-styles-color-theme-color-3: #f5f5f5;
            --haxcms-user-styles-color-theme-color-4: var(
              --simple-colors-default-theme-blue-8,
              #4183c4
            );
            --hax-base-styles-a-color-visited: var(
              --simple-colors-default-theme-blue-7,
              #4183c4
            );
            --hax-base-styles-a-color: var(
              --simple-colors-default-theme-blue-7,
              #4183c4
            );
            --hax-base-styles-a-color-active: #000000;
          }
          :host([color-theme="1"]) {
            --haxcms-user-styles-color-theme-color-color: #704214;
            --haxcms-user-styles-color-theme-color-background: #f3eacb;
            --haxcms-user-styles-color-theme-color-1: #704214;
            --haxcms-user-styles-color-theme-color-2: #f3eacb;
            --haxcms-user-styles-color-theme-color-3: #1c1c1c;
            --haxcms-user-styles-color-theme-color-4: #eee8e0;
            --hax-base-styles-a-color-visited: #704214;
            --hax-base-styles-a-color: #704214;
            --hax-base-styles-a-color-active: #000000;
          }
          :host([color-theme="2"]) {
            --haxcms-user-styles-color-theme-color-color: var(
              --simple-colors-default-theme-light-blue-1,
              #cfd4e3
            );
            --haxcms-user-styles-color-theme-color-background: #1c1f2b;
            --haxcms-user-styles-color-theme-color-1: #a6a6a6;
            --haxcms-user-styles-color-theme-color-2: #252737;
            --haxcms-user-styles-color-theme-color-3: #252737;
            --haxcms-user-styles-color-theme-color-4: #f4f4f5;
            --hax-base-styles-a-color-visited: var(
              --simple-colors-default-theme-light-blue-2,
              #3eb1d0
            );
            --hax-base-styles-a-color: var(
              --simple-colors-default-theme-light-blue-2,
              #3eb1d0
            );
            --hax-base-styles-a-color-active: #ffffff;
          }
          :host([color-theme="0"]) .hcusm {
            border-color: #222222;
          }
          :host([color-theme="0"]) .hcusm simple-popover {
            --simple-popover-color: #222222;
            --simple-popover-background-color: #fafafa;
          }
          #slot ::slotted(*) {
            font-size: var(--haxcms-base-styles-body-font-size, 1em);
            color: var(--haxcms-user-styles-color-theme-color-color);
          }
          simple-icon-button:not(:defined),
          simple-popover:not(:defined) {
            display: none;
          }
          simple-popover {
            padding: 2px;
          }
          .hcusm .hcusm-buttons .hcusm-button.size-2 {
            width: 50%;
          }

          .hcusm .hcusm-buttons .hcusm-button {
            border: 0;
            background-color: transparent;
            color: #a6a6a6;
            width: 100%;
            text-align: center;
            float: left;
            line-height: 1.42857143;
            padding: 8px 4px;
          }
          .hcusm-button.size-2 {
            width: 50%;
          }
          .hcusm .hcusm-buttons .hcusm-button.size-3 {
            width: 33%;
          }
          .hcusm.open {
            display: block;
          }
          .hcusm {
            min-width: 160px;
            padding: 0;
            margin: 2px 0 0;
            list-style: none;
            font-size: 14px;
            background-color: transparent;
          }
          .hcusm .hcusm-buttons:after,
          .hcusm .hcusm-buttons:before {
            content: " ";
            display: table;
            line-height: 0;
          }
          .hcusm-buttons:after,
          .hcusm-buttons:before {
            content: " ";
            display: table;
            line-height: 0;
          }
          .hcusm-button {
            border: 0;
            background-color: transparent;
            background: #eee;
            color: #666;
            width: 100%;
            text-align: center;
            float: left;
            line-height: 1.42857143;
            padding: 8px 4px;
          }
          .hcusm button,
          .hcusm input[type="button"],
          .hcusm input[type="reset"],
          .hcusm input[type="submit"] {
            -webkit-appearance: button;
            cursor: pointer;
          }
          .hcusm button,
          .hcusm select {
            text-transform: none;
          }
          .hcusm button,
          .hcusm input {
            line-height: normal;
          }
          .hcusm button,
          .hcusm input,
          .hcusm select,
          .hcusm textarea {
            font-family: inherit;
            font-size: 100%;
            margin: 0;
          }

          .hcusm-settings-container[hidden] {
            display: none;
          }
          /*
          * Theme 1
          */
          :host([color-theme="1"]) .hcusm {
            border-color: #222222;
          }
          :host([color-theme="1"]) simple-popover {
            --simple-popover-color: #afa790;
            --simple-popover-background-color: #111111;
          }
          :host([color-theme="1"]) .hcusm .dropdown-caret .caret-inner {
            border-bottom: 9px solid #111111;
          }
          :host([color-theme="1"]) .hcusm .hcusm-buttons {
            border-color: #7e888b;
          }
          :host([color-theme="1"]) .hcusm .hcusm-button {
            color: #afa790;
          }
          :host([color-theme="1"]) .hcusm .hcusm-button:hover,
          :host([color-theme="1"]) .hcusm .hcusm-button:focus,
          :host([color-theme="1"]) .hcusm .hcusm-button:active {
            color: #eee8e0;
          }
          /*
          * Theme 2
          */
          :host([color-theme="2"]) simple-popover {
            --simple-popover-color: #cccccc;
            --simple-popover-background-color: #2d3143;
          }
          :host([color-theme="2"]) .hcusm {
            border-color: #272a3a;
          }
          :host([color-theme="2"]) .hcusm .dropdown-caret .caret-inner {
            border-bottom: 9px solid #2d3143;
          }
          :host([color-theme="2"]) .hcusm .hcusm-buttons {
            border-color: #272a3a;
          }
          :host([color-theme="2"]) .hcusm .hcusm-button {
            color: #cccccc;
          }
          :host([color-theme="2"]) .hcusm .hcusm-button:hover,
          :host([color-theme="2"]) .hcusm .hcusm-button:focus,
          :host([color-theme="2"]) .hcusm .hcusm-button:active {
            color: #f4f4f5;
          }
        `,
      ];
    }
    HAXCMSUserStylesMenu() {
      import("@lrnwebcomponents/simple-icon/simple-icon.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icons.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icon-button.js");
      import("@lrnwebcomponents/simple-popover/simple-popover.js");
      return html`
        <simple-icon-button
          .part="${this.editMode ? `edit-mode-active` : ``}"
          class="btn"
          aria-label="Text settings"
          icon="editor:format-size"
          @click="${this.toggleUserStylesMenu}"
          id="haxcmsuserstylesmenupopover"
        ></simple-icon-button>
        <simple-tooltip for="haxcmsuserstylesmenupopover">
          Text settings
        </simple-tooltip>
        <simple-popover
          class="hcusm pull-left font-settings js-toolbar-action hcusm-settings-container"
          ?hidden="${this.hideUserStylesMenu}"
          id="haxcmsuserstylesmenu"
          auto
        >
          <div class="open">
            <div class="hcusm-caret">
              <span class="hcusm-caret-outer"></span>
              <span class="hcusm-caret-inner"></span>
            </div>
            <div class="hcusm-buttons">
              <button
                class="hcusm-button size-2 font-reduce"
                @click="${this.UserStylesSizeDown}"
              >
                A
              </button>
              <button
                class="hcusm-button size-2 font-enlarge"
                @click="${this.UserStylesSizeUp}"
              >
                A
              </button>
            </div>
            <div class="hcusm-buttons">
              <button
                class="hcusm-button size-2"
                data-font="0"
                @click="${this.UserStylesFontFamilyChange}"
              >
                Serif
              </button>
              <button
                class="hcusm-button size-2"
                data-font="1"
                @click="${this.UserStylesFontFamilyChange}"
              >
                Sans
              </button>
            </div>
            <div class="hcusm-buttons">
              <button
                class="hcusm-button size-3"
                data-theme="0"
                @click="${this.UserStylesColorThemeChange}"
              >
                Day
              </button>
              <button
                class="hcusm-button size-3"
                data-theme="1"
                @click="${this.UserStylesColorThemeChange}"
              >
                Sepia
              </button>
              <button
                class="hcusm-button size-3"
                data-theme="2"
                @click="${this.UserStylesColorThemeChange}"
              >
                Night
              </button>
            </div>
          </div>
        </simple-popover>
      `;
    }
    static get properties() {
      let props = {};
      if (super.properties) {
        props = super.props;
      }
      return {
        ...props,
        hideUserStylesMenu: {
          type: Boolean,
        },
        fontSize: {
          type: Number,
          reflect: true,
          attribute: "font-size",
        },
        fontFamily: {
          type: Number,
          reflect: true,
          attribute: "font-family",
        },
        colorTheme: {
          type: Number,
          reflect: true,
          attribute: "color-theme",
        },
      };
    }
    checkUserStylesMenuOpen(e) {
      var target = normalizeEventPath(e);
      if (
        !this.hideUserStylesMenu &&
        !target.includes(this.toggleUserStylesMenuTarget) &&
        !target.includes(
          this.shadowRoot.querySelector("#haxcmsuserstylesmenu")
        ) &&
        target.tagName !== "BUTTON"
      ) {
        this.hideUserStylesMenu = true;
      }
    }
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        if (propName == "editMode" && this[propName]) {
          // edit mode has been activated
          this.hideUserStylesMenu = true;
        }
      });
    }
    /**
     * life cycle, element is afixed to the DOM
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      this.toggleUserStylesMenuTarget = this.shadowRoot.querySelector(
        "#haxcmsuserstylesmenupopover"
      );
      // hook up the pop over menu
      this.shadowRoot.querySelector(
        "#haxcmsuserstylesmenu"
      ).target = this.toggleUserStylesMenuTarget;
    }
    toggleUserStylesMenu(e) {
      this.hideUserStylesMenu = !this.hideUserStylesMenu;
    }
    UserStylesSizeDown(e) {
      if (this.fontSize > 0) {
        this.fontSize = this.fontSize - 1;
      }
    }
    UserStylesSizeUp(e) {
      if (this.fontSize < 4) {
        this.fontSize = this.fontSize + 1;
      }
    }
    UserStylesFontFamilyChange(e) {
      var target = normalizeEventPath(e)[0];
      this.fontFamily = parseInt(target.getAttribute("data-font"));
    }
    UserStylesColorThemeChange(e) {
      var target = normalizeEventPath(e)[0];
      this.colorTheme = parseInt(target.getAttribute("data-theme"));
    }
  };
};

export { HAXCMSUserStylesMenuMixin };
