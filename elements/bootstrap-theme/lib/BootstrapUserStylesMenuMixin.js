import { css, html } from "lit";
import {
  normalizeEventPath,
  localStorageGet,
  localStorageSet,
} from "@haxtheweb/utils/utils.js";
import { autorun, toJS } from "mobx";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

const BootstrapUserStylesMenuMixin = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.hideUserStylesMenu = true;
      this.fontSize = localStorageGet("haxcms-bootstrap-userPref-fontSize", 1);
      this.fontFamily = localStorageGet("haxcms-bootstrap-userPref-fontFamily", 0);
      this.colorTheme = localStorageGet("haxcms-bootstrap-userPref-colorTheme", 0);
      this._bootstrapPath = this._resolveBootstrapStylesheetPath();
      this.addEventListener("click", this.checkUserStylesMenuOpen.bind(this));
      autorun(() => {
        const darkMode = toJS(store.darkMode);
        const localColorTheme = localStorageGet(
          "haxcms-bootstrap-userPref-colorTheme",
          0,
        );
        if (darkMode) {
          this.colorTheme = 1;
        } else if (localColorTheme === 1) {
          this.colorTheme = 0;
        } else {
          this.colorTheme = localColorTheme;
        }
      });
    }
    _resolveBootstrapStylesheetPath() {
      if (typeof this._resolveVendorAssetPath === "function") {
        return this._resolveVendorAssetPath(
          "bootstrap",
          "dist/css/bootstrap.min.css",
        );
      }
      const packageURL = decodeURIComponent(import.meta.url);
      if (packageURL.indexOf("/node_modules/@haxtheweb/") !== -1) {
        return new URL("../../bootstrap/dist/css/bootstrap.min.css", packageURL)
          .href;
      }
      return new URL(
        "../../node_modules/bootstrap/dist/css/bootstrap.min.css",
        packageURL,
      ).href;
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        css`
          :host {
            --bootstrap-theme-user-font-scale: 1;
            --bootstrap-theme-user-line-height: 1.5;
            --bootstrap-theme-user-font-family: var(
              --ddd-font-primary,
              "Helvetica Neue",
              Helvetica,
              Arial,
              sans-serif
            );
          }
          :host([font-size="0"]) {
            --bootstrap-theme-user-font-scale: 0.9;
          }
          :host([font-size="1"]) {
            --bootstrap-theme-user-font-scale: 1;
          }
          :host([font-size="2"]) {
            --bootstrap-theme-user-font-scale: 1.1;
          }
          :host([font-size="3"]) {
            --bootstrap-theme-user-font-scale: 1.2;
          }
          :host([font-size="4"]) {
            --bootstrap-theme-user-font-scale: 1.3;
          }
          :host([font-family="0"]) {
            --bootstrap-theme-user-font-family: var(
              --ddd-font-primary,
              "Helvetica Neue",
              Helvetica,
              Arial,
              sans-serif
            );
          }
          :host([font-family="1"]) {
            --bootstrap-theme-user-font-family: var(
              --ddd-font-monospace,
              "Courier New",
              Courier,
              monospace
            );
          }

          .main-section {
            font-size: calc(1rem * var(--bootstrap-theme-user-font-scale));
            line-height: var(--bootstrap-theme-user-line-height);
            font-family: var(--bootstrap-theme-user-font-family);
          }
          .main-section p,
          .main-section li,
          .main-section td,
          .main-section th {
            font-size: calc(1em * var(--bootstrap-theme-user-font-scale));
            line-height: var(--bootstrap-theme-user-line-height);
          }
          .main-section h1,
          .main-section h2,
          .main-section h3,
          .main-section h4,
          .main-section h5,
          .main-section h6,
          .page-title {
            font-family: var(--bootstrap-theme-user-font-family);
          }
          :host([color-theme="0"]) {
          }

          :host([color-theme="0"]) .hcusm {
            border-color: #222222;
          }
          :host([color-theme="0"]) .hcusm simple-popover {
            --simple-popover-color: #222222;
            --simple-popover-background-color: #fafafa;
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
          * Light Theme
          */
          .btn-size,
          .btn-font {
            background-color: var(
              --bootstrap-theme-light-secondary-background-color
            );
            color: var(--bootstrap-theme-light-color);
          }

          .btn-size.size-2 {
            font-size: 16px;
          }

          /*
          * Dark Theme
          */

          :host([color-theme="1"]) {
          }

          :host([color-theme="1"]) .hcusm {
            border-color: #222222;
          }

          :host([color-theme="1"])
            .btn-group
            .btn[type="size"]
            .btn[type="font"] {
            background-color: var(
              --bootstrap-theme-light-secondary-background-color
            );
            color: var(--bootstrap-theme-dark-color) !important;
          }

          :host([color-theme="1"]) simple-popover {
            --simple-popover-color: white;
            --simple-popover-background-color: var(
              --bootstrap-theme-dark-secondary-background-color
            );
          }
          :host([color-theme="1"]) .hcusm .dropdown-caret .caret-inner {
            border-bottom: 9px solid
              var(--bootstrap-dark-theme-secondary-background-color);
          }
          :host([color-theme="1"]) .hcusm .hcusm-buttons {
            border-color: #7e888b;
          }
          :host([color-theme="1"]) .hcusm .hcusm-button {
            color: white;
          }
          :host([color-theme="1"]) .hcusm .hcusm-button:hover,
          :host([color-theme="1"]) .hcusm .hcusm-button:focus,
          :host([color-theme="1"]) .hcusm .hcusm-button:active {
            color: #eee8e0;
          }

          /* palenight theme */
          :host([color-theme="2"]) {
            --haxcms-user-styles-color-theme-color-color: var(
              --simple-colors-default-theme-light-blue-1,
              #cfd4e3
            );
          }

          :host([color-theme="2"]) .hcusm {
            border-color: var(--bootstrap-theme-palenight-background-color);
          }

          :host([color-theme="2"]) .btn[type="size"] .btn[type="font"] {
            background-color: var(
              --bootstrap-theme-light-secondary-background-color
            );
            color: var(--bootstrap-theme-palenight-background-color);
          }

          :host([color-theme="2"]) simple-popover {
            --simple-popover-color: white;
            --simple-popover-background-color: var(
              --bootstrap-theme-palenight-secondary-background-color
            );
          }

          :host([color-theme="2"]) .hcusm .dropdown-caret .caret-inner {
            border-bottom: 9px solid
              var(--bootstrap-theme-palenight-secondary-background-color);
          }

          simple-icon-button-lite {
            color: inherit;
          }

          .open {
            text-align: center;
          }

          .btn-group-title {
            font-weight: bold;
          }

          .btn-palenight {
            background-color: var(
              --bootstrap-theme-palenight-secondary-background-color
            );
            color: var(--bootstrap-theme-palenight-color);
          }

          /* override bootstrap default */
          .btn-palenight:hover {
            color: var(--bootstrap-theme-palenight-color);
          }

          .btn-dark {
            background-color: var(
              --bootstrap-theme-dark-secondary-background-color
            );
          }

          .btn-light {
            background-color: var(
              --bootstrap-theme-light-secondary-background-color
            );
          }
        `,
      ];
    }
    BootstrapUserStylesMenu() {
      import("@haxtheweb/simple-icon/simple-icon.js");
      import("@haxtheweb/simple-icon/lib/simple-icons.js");
      import("@haxtheweb/simple-icon/lib/simple-icon-button-lite.js");
      import("@haxtheweb/simple-popover/simple-popover.js");
      import("@haxtheweb/simple-tooltip/simple-tooltip.js");
      return html`
        <link rel="stylesheet" href="${this._bootstrapPath}" />
        <simple-icon-button-lite
          .part="${this.editMode ? `edit-mode-active` : ``}"
          class="btn"
          aria-label="Text settings"
          icon="editor:format-size"
          @click="${this.toggleUserStylesMenu}"
          id="haxcmsuserstylesmenupopover"
        ></simple-icon-button-lite>
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
            <div class="btn-group-title">Font Size</div>
            <div class="btn-group" role="group">
              <button class="btn btn-size" @click="${this.UserStylesSizeDown}">
                A
              </button>
              <button
                class="btn btn-size size-2"
                @click="${this.UserStylesSizeUp}"
              >
                A
              </button>
            </div>
            <div class="btn-group-title">Font Family</div>
            <div class="btn-group" role="group">
              <button
                class="btn btn-font"
                data-font="0"
                @click="${this.UserStylesFontFamilyChange}"
              >
                Sans
              </button>
              <button
                class="btn btn-font"
                data-font="1"
                @click="${this.UserStylesFontFamilyChange}"
              >
                Monospace
              </button>
            </div>
            <div class="btn-group-title">Theme Color</div>
            <div class="btn-group">
              <button
                class="btn btn-light"
                data-theme="0"
                @click="${this.UserStylesColorThemeChange}"
              >
                Light
              </button>
              <button
                class="btn btn-palenight"
                data-theme="2"
                @click="${this.UserStylesColorThemeChange}"
              >
                Palenight
              </button>
              <button
                class="btn btn-dark"
                data-theme="1"
                @click="${this.UserStylesColorThemeChange}"
              >
                Dark
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
      var target = normalizeEventPath(e);
      const localTarget = target && target[0] ? target[0] : null;
      const isButtonTarget =
        localTarget && localTarget.tagName && localTarget.tagName === "BUTTON";
      if (
        !this.hideUserStylesMenu &&
        !target.includes(this.toggleUserStylesMenuTarget) &&
        !target.includes(
          this.shadowRoot.querySelector("#haxcmsuserstylesmenu"),
        ) &&
        !isButtonTarget
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
    toggleUserStylesMenu(e) {
      this.hideUserStylesMenu = !this.hideUserStylesMenu;
    }
    _eventPathButtonTarget(e) {
      const targetPath = normalizeEventPath(e);
      for (let i = 0; i < targetPath.length; i++) {
        if (
          targetPath[i] &&
          targetPath[i].tagName &&
          targetPath[i].tagName === "BUTTON"
        ) {
          return targetPath[i];
        }
      }
      return null;
    }
    UserStylesSizeDown(e) {
      if (this.fontSize > 0) {
        this.fontSize = this.fontSize - 1;
        localStorageSet("haxcms-bootstrap-userPref-fontSize", this.fontSize);
      }
    }
    UserStylesSizeUp(e) {
      if (this.fontSize < 4) {
        this.fontSize = this.fontSize + 1;
        localStorageSet("haxcms-bootstrap-userPref-fontSize", this.fontSize);
      }
    }
    UserStylesFontFamilyChange(e) {
      const target = this._eventPathButtonTarget(e);
      if (!target) {
        return;
      }
      this.fontFamily = parseInt(target.getAttribute("data-font"), 10);
      localStorageSet("haxcms-bootstrap-userPref-fontFamily", this.fontFamily);
    }
    UserStylesColorThemeChange(e) {
      const target = this._eventPathButtonTarget(e);
      if (!target) {
        return;
      }
      this.colorTheme = parseInt(target.getAttribute("data-theme"), 10);
      localStorageSet(
        "haxcms-bootstrap-userPref-colorTheme",
        this.colorTheme,
      );
    }
  };
};

export { BootstrapUserStylesMenuMixin };
