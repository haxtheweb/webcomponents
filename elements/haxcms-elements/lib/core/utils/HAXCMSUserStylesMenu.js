/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css, html } from "lit";
import {
  normalizeEventPath,
  localStorageGet,
  localStorageSet,
} from "@haxtheweb/utils/utils.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import { toJS, autorun } from "mobx";
import { store } from "../haxcms-site-store.js";

const HAXCMSUserStylesMenuMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      this.t.A = "A";
      this.t.increaseFontSize = "Increase font size";
      this.t.decreaseFontSize = "Decrease font size";
      this.t.setFontToSerif = "Set font to serif";
      this.t.setFontToSansSerif = "Set font to sans serif";
      this.t.serif = "Serif";
      this.t.sansSerif = "Sans serif";
      this.t.day = "Day";
      this.t.sepia = "Sepia";
      this.t.night = "Night";
      this.t.textSettings = "Text settings";
      this.hideUserStylesMenu = true;
      this.fontSize = localStorageGet("haxcms-userPref-fontSize", 1);
      this.fontFamily = localStorageGet("haxcms-userPref-fontFamily", 0);
      this.colorTheme = localStorageGet("haxcms-userPref-colorTheme", 0);
      this.addEventListener("click", this.checkUserStylesMenuOpen.bind(this));
      autorun(() => {
        const _mobx_val_0 = toJS(store.darkMode);
        Promise.resolve().then(() => {
          const dark = _mobx_val_0;
          let local = localStorageGet("haxcms-userPref-colorTheme", 0);
          if (dark) {
            this.colorTheme = 2;
          } else {
            if (local === 2) {
              this.colorTheme = 0;
            } else {
              this.colorTheme = local;
            }
          }
        });
      });
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        css`
          :host([color-theme="0"]) {
            --haxcms-user-styles-color-theme-color-color: var(
              --ddd-theme-default-black,
              #000000
            );
            --haxcms-user-styles-color-theme-color-background: var(
              --ddd-theme-default-white,
              #ffffff
            );
            --haxcms-user-styles-color-theme-color-1: var(
              --simple-colors-fixed-theme-light-blue-12,
              #001b36
            );
            --haxcms-user-styles-color-theme-color-2: var(
              --ddd-theme-default-disabled,
              #f4f4f4
            );
            --haxcms-user-styles-color-theme-color-3: var(
              --ddd-theme-default-disabled,
              #f4f4f4
            );
            --haxcms-user-styles-color-theme-color-4: var(
              --simple-colors-default-theme-blue-8,
              #4183c4
            );
          }
          :host([color-theme="1"]) {
            --haxcms-user-styles-color-theme-color-color: var(
              --ddd-theme-default-warning,
              #663c00
            );
            --haxcms-user-styles-color-theme-color-background: var(
              --simple-colors-fixed-theme-amber-1,
              #fff2d4
            );
            --haxcms-user-styles-color-theme-color-1: var(
              --ddd-theme-default-warning,
              #663c00
            );
            --haxcms-user-styles-color-theme-color-2: var(
              --simple-colors-fixed-theme-amber-1,
              #fff2d4
            );
            --haxcms-user-styles-color-theme-color-3: var(
              --simple-colors-fixed-theme-grey-10,
              #222222
            );
            --haxcms-user-styles-color-theme-color-4: var(
              --ddd-theme-default-shrineLight,
              #f7f2ee
            );
          }
          :host([color-theme="2"]) {
            --haxcms-user-styles-color-theme-color-color: var(
              --ddd-theme-default-slateLight,
              #ccdae6
            );
            --haxcms-user-styles-color-theme-color-background: var(
              --simple-colors-fixed-theme-blue-grey-12,
              #0f1518
            );
            --haxcms-user-styles-color-theme-color-1: var(
              --ddd-theme-default-limestoneGray,
              #a2aaad
            );
            --haxcms-user-styles-color-theme-color-2: var(
              --simple-colors-fixed-theme-light-blue-12,
              #001b36
            );
            --haxcms-user-styles-color-theme-color-3: var(
              --simple-colors-fixed-theme-light-blue-12,
              #001b36
            );
            --haxcms-user-styles-color-theme-color-4: var(
              --ddd-theme-default-disabled,
              #f4f4f4
            );
          }
          :host([color-theme="0"]) .hcusm {
            border-color: var(--simple-colors-fixed-theme-grey-10, #222222);
          }
          :host([color-theme="0"]) .hcusm simple-popover {
            --simple-popover-color: var(
              --simple-colors-fixed-theme-grey-10,
              #222222
            );
            --simple-popover-background-color: var(
              --ddd-theme-default-white,
              #ffffff
            );
          }
          #slot ::slotted(*) {
            color: var(--haxcms-user-styles-color-theme-color-color);
          }
          simple-icon-button-lite:not(:defined),
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
            color: var(--ddd-theme-default-limestoneGray, #a2aaad);
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
            font-size: var(--hax-ui-admin-font-size);
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
            background: var(--simple-colors-fixed-theme-grey-2, #eeeeee);
            color: var(--simple-colors-fixed-theme-grey-7, #666666);
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
            border-color: var(--simple-colors-fixed-theme-grey-10, #222222);
          }
          :host([color-theme="1"]) simple-popover {
            --simple-popover-color: var(
              --simple-colors-fixed-theme-grey-6,
              #999999
            );
            --simple-popover-background-color: var(
              --simple-colors-fixed-theme-grey-11,
              #111111
            );
          }
          :host([color-theme="1"]) .hcusm .dropdown-caret .caret-inner {
            border-bottom: 9px solid
              var(--simple-colors-fixed-theme-grey-11, #111111);
          }
          :host([color-theme="1"]) .hcusm .hcusm-buttons {
            border-color: var(--simple-colors-fixed-theme-blue-grey-5, #7a8f98);
          }
          :host([color-theme="1"]) .hcusm .hcusm-button {
            color: var(--simple-colors-fixed-theme-grey-6, #999999);
          }
          :host([color-theme="1"]) .hcusm .hcusm-button:hover,
          :host([color-theme="1"]) .hcusm .hcusm-button:focus,
          :host([color-theme="1"]) .hcusm .hcusm-button:active {
            color: var(--ddd-theme-default-shrineLight, #f7f2ee);
          }
          /*
          * Theme 2
          */
          :host([color-theme="2"]) simple-popover {
            --simple-popover-color: var(
              --simple-colors-fixed-theme-grey-4,
              #cccccc
            );
            --simple-popover-background-color: var(
              --simple-colors-fixed-theme-light-blue-12,
              #001b36
            );
          }
          :host([color-theme="2"]) .hcusm {
            border-color: var(
              --simple-colors-fixed-theme-light-blue-12,
              #001b36
            );
          }
          :host([color-theme="2"]) .hcusm .dropdown-caret .caret-inner {
            border-bottom: 9px solid
              var(--simple-colors-fixed-theme-light-blue-12, #001b36);
          }
          :host([color-theme="2"]) .hcusm .hcusm-buttons {
            border-color: var(
              --simple-colors-fixed-theme-light-blue-12,
              #001b36
            );
          }
          :host([color-theme="2"]) .hcusm .hcusm-button {
            color: var(--simple-colors-fixed-theme-grey-4, #cccccc);
          }
          :host([color-theme="2"]) .hcusm .hcusm-button:hover,
          :host([color-theme="2"]) .hcusm .hcusm-button:focus,
          :host([color-theme="2"]) .hcusm .hcusm-button:active {
            color: var(--ddd-theme-default-disabled, #f4f4f4);
          }
          simple-icon-button-lite {
            color: inherit;
          }
        `,
      ];
    }
    HAXCMSUserStylesMenu() {
      import("@haxtheweb/simple-icon/simple-icon.js");
      import("@haxtheweb/simple-icon/lib/simple-icons.js");
      import("@haxtheweb/simple-icon/lib/simple-icon-button-lite.js");
      import("@haxtheweb/simple-popover/simple-popover.js");
      import("@haxtheweb/simple-tooltip/simple-tooltip.js");
      return html`
        <simple-icon-button-lite
          .part="${this.editMode ? `edit-mode-active` : ``}"
          class="btn"
          label="${this.t.textSettings}"
          icon="editor:format-size"
          @click="${this.toggleUserStylesMenu}"
          id="haxcmsuserstylesmenupopover"
        ></simple-icon-button-lite>
        <simple-tooltip for="haxcmsuserstylesmenupopover">
          ${this.t.textSettings}
        </simple-tooltip>
        <simple-popover
          aria-label="${this.t.textSettings}"
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
                title="${this.t.decreaseFontSize}"
              >
                ${this.t.A}
              </button>
              <button
                class="hcusm-button size-2 font-enlarge"
                @click="${this.UserStylesSizeUp}"
                title="${this.t.increaseFontSize}"
              >
                ${this.t.A}
              </button>
            </div>
            <div class="hcusm-buttons">
              <button
                class="hcusm-button size-2"
                data-font="0"
                title="${this.t.setFontToSerif}"
                @click="${this.UserStylesFontFamilyChange}"
              >
                ${this.t.serif}
              </button>
              <button
                class="hcusm-button size-2"
                title="${this.t.setFontToSansSerif}"
                data-font="1"
                @click="${this.UserStylesFontFamilyChange}"
              >
                ${this.t.sansSerif}
              </button>
            </div>
            <div class="hcusm-buttons">
              <button
                class="hcusm-button size-3"
                data-theme="0"
                @click="${this.UserStylesColorThemeChange}"
              >
                ${this.t.day}
              </button>
              <button
                class="hcusm-button size-3"
                data-theme="1"
                @click="${this.UserStylesColorThemeChange}"
              >
                ${this.t.sepia}
              </button>
              <button
                class="hcusm-button size-3"
                data-theme="2"
                @click="${this.UserStylesColorThemeChange}"
              >
                ${this.t.night}
              </button>
            </div>
          </div>
        </simple-popover>
      `;
    }
    static get properties() {
      let props = super.properties || {};
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
      let target = normalizeEventPath(e);
      if (
        !this.hideUserStylesMenu &&
        !target.includes(this.toggleUserStylesMenuTarget) &&
        !target.includes(
          this.shadowRoot.querySelector("#haxcmsuserstylesmenu"),
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
        "#haxcmsuserstylesmenupopover",
      );
      // hook up the pop over menu
      this.shadowRoot.querySelector("#haxcmsuserstylesmenu").target =
        this.toggleUserStylesMenuTarget;
    }
    toggleUserStylesMenu(_e) {
      this.hideUserStylesMenu = !this.hideUserStylesMenu;
    }
    UserStylesSizeDown(_e) {
      if (this.fontSize > 0) {
        this.fontSize = this.fontSize - 1;
        localStorageSet("haxcms-userPref-fontSize", this.fontSize);
      }
    }
    UserStylesSizeUp(_e) {
      if (this.fontSize < 4) {
        this.fontSize = this.fontSize + 1;
        localStorageSet("haxcms-userPref-fontSize", this.fontSize);
      }
    }
    UserStylesFontFamilyChange(e) {
      let target = normalizeEventPath(e)[0];
      this.fontFamily = parseInt(target.getAttribute("data-font"));
      localStorageSet("haxcms-userPref-fontFamily", this.fontFamily);
    }
    UserStylesColorThemeChange(e) {
      let target = normalizeEventPath(e)[0];
      this.colorTheme = parseInt(target.getAttribute("data-theme"));
      localStorageSet("haxcms-userPref-colorTheme", this.colorTheme);
    }
  };
};

export { HAXCMSUserStylesMenuMixin };
