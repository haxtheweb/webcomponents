/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import {
  HAXCMSLitElementTheme,
  css,
  html,
  store,
  autorun,
  toJS,
} from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  CLASSIC_DESKTOP_SYSTEM,
  activateClassicDesktopDesignSystem,
} from "./lib/ClassicDesktopDesignSystem.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-print-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * `wysiwyg96-theme`
 * An homage to the first WYSIWYG web editors of 1995-96: the site drawn as
 * two desktop windows. "Explorer" holds the site outline; the page window
 * has a title bar naming the page file, a menu bar of the site's top pages,
 * a toolbar of real site actions, the page on the classic gray canvas and a
 * status bar. The windows roll up, minimize and maximize, and View HTML
 * opens a dialog that can be moved around the screen. Its chrome reads only
 * --ddd-* tokens, so it takes any design system; it starts on Classic
 * Desktop.
 *
 * @title WYSIWYG 96
 * @haxcms-theme-category Website, Personal
 * @haxcms-theme-priority 40
 * @demo demo/index.html
 * @element wysiwyg96-theme
 */
class Wysiwyg96Theme extends DDDSuper(HAXCMSLitElementTheme) {
  static get tag() {
    return "wysiwyg96-theme";
  }

  /** its chrome reads only --ddd-* tokens, so a site can pick any system */
  static get acceptsDesignSystems() {
    return true;
  }

  /** the system it starts on when the site has not picked one */
  static get defaultDesignSystem() {
    return CLASSIC_DESKTOP_SYSTEM;
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        wysiwyg96-theme li::marker {
          color: currentColor;
        }
        wysiwyg96-theme hr {
          border: 0;
          height: 2px;
          box-shadow:
            inset 0 1px 0
              light-dark(
                var(--ddd-theme-default-limestoneGray),
                var(--ddd-theme-default-white)
              ),
            inset 0 -1px 0 var(--ddd-theme-default-white);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
      explorer: "Explorer",
      siteOutline: "Site outline",
      page: "Page",
      siteNavigation: "Site navigation",
      pageTools: "Page tools",
      pageNavigation: "Page navigation",
      location: "Location",
      searchSite: "Search site",
      search: "Search",
      viewHtml: "View HTML",
      pageHtml: "Page HTML",
      htmlSource: "Source",
      original: "Original",
      generated: "Generated",
      close: "Close",
      highContrast: "High Contrast",
      rollUp: "Roll up {name}",
      rollDown: "Roll down {name}",
      minimize: "Minimize {name}",
      maximize: "Maximize {name}",
      restore: "Restore {name}",
      moveHint:
        "Drag the title bar, or focus it and use the arrow keys, to move this window.",
      ready: "Ready",
      editing: "Editing",
      updated: "Updated {date}",
      position: "Page {index} of {count}",
    };
    I18NManagerStore.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.HAXCMSThemeSettings.autoScroll = true;
    // window states: rolled up (title bar only), minimized (an icon on the
    // desktop) and, for the page window, maximized (fills the desktop)
    this.explorerOpen = true;
    this.explorerRolled = false;
    this.pageRolled = false;
    this.pageMinimized = false;
    this.pageMaximized = false;
    this._mobile = false;
    this._dark = false;
    this._file = "";
    this._slug = "";
    this._depth = 0;
    this._updated = "";
    this._position = "";
    this._siteTitle = "";
    this._htmlMode = "original";
    this._htmlSource = "";
    this.__disposers = [];
    this.__drag = null;
    activateClassicDesktopDesignSystem();
  }

  static get properties() {
    return {
      ...super.properties,
      explorerOpen: {
        type: Boolean,
        reflect: true,
        attribute: "explorer-open",
      },
      explorerRolled: {
        type: Boolean,
        reflect: true,
        attribute: "explorer-rolled",
      },
      pageRolled: { type: Boolean, reflect: true, attribute: "page-rolled" },
      pageMinimized: {
        type: Boolean,
        reflect: true,
        attribute: "page-minimized",
      },
      pageMaximized: {
        type: Boolean,
        reflect: true,
        attribute: "page-maximized",
      },
      _mobile: { type: Boolean, state: true },
      _dark: { type: Boolean, state: true },
      _file: { type: String, state: true },
      _slug: { type: String, state: true },
      _depth: { type: Number, state: true },
      _updated: { type: String, state: true },
      _position: { type: String, state: true },
      _siteTitle: { type: String, state: true },
      _htmlMode: { type: String, state: true },
      _htmlSource: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          min-height: calc(100dvh - var(--haxcms-theme-offset-top, 0px));
          font-family: var(--ddd-font-primary);
          color-scheme: light dark;
          --wysiwyg96-ink: light-dark(
            var(--ddd-theme-default-black),
            var(--ddd-theme-default-white)
          );
          --wysiwyg96-face: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-black)
          );
          --wysiwyg96-field: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-black)
          );
          --wysiwyg96-title: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-wonderPurple)
          );
          --wysiwyg96-title-ink: var(--ddd-theme-default-white);
          --wysiwyg96-select: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-white)
          );
          --wysiwyg96-select-ink: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-black)
          );
          --wysiwyg96-hi: var(--ddd-theme-default-white);
          --wysiwyg96-lo: light-dark(
            var(
              --classic-desktop-palette-gray,
              var(--ddd-theme-default-limestoneGray)
            ),
            var(--ddd-theme-default-white)
          );
          --wysiwyg96-dk: light-dark(
            var(--ddd-theme-default-black),
            var(--ddd-theme-default-white)
          );
          --wysiwyg96-raised:
            inset -1px -1px 0 var(--wysiwyg96-dk),
            inset 1px 1px 0 var(--wysiwyg96-hi),
            inset -2px -2px 0 var(--wysiwyg96-lo);
          --wysiwyg96-sunken:
            inset 1px 1px 0 var(--wysiwyg96-lo),
            inset -1px -1px 0 var(--wysiwyg96-hi),
            inset 2px 2px 0 var(--wysiwyg96-dk);
          --wysiwyg96-ui-font: var(--ddd-font-navigation);
          --wysiwyg96-desktop: light-dark(
            var(
              --classic-desktop-palette-teal,
              var(--ddd-theme-default-creekTeal)
            ),
            var(--ddd-theme-default-black)
          );
          background-color: var(--wysiwyg96-desktop);
          color: var(--wysiwyg96-ink);
        }
        :host([data-palette]) {
          --wysiwyg96-desktop: light-dark(
            var(--ddd-palette-color-2),
            var(--ddd-theme-default-black)
          );
        }
        .skip-link {
          position: absolute;
          left: var(--ddd-spacing-2);
          top: var(--ddd-spacing-2);
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          z-index: 10;
          padding: var(--ddd-spacing-0);
          background: var(--wysiwyg96-face);
          color: var(--wysiwyg96-ink);
          box-shadow: var(--wysiwyg96-raised);
          font-family: var(--wysiwyg96-ui-font);
        }
        .skip-link:focus {
          width: auto;
          height: auto;
          clip: auto;
          overflow: visible;
          min-height: 24px;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        }
        :host([edit-mode]) .skip-link {
          display: none;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        a:focus-visible,
        button:focus-visible,
        input:focus-visible,
        [tabindex]:focus-visible {
          outline: 2px dotted var(--wysiwyg96-ink);
          outline-offset: -4px;
        }
        .desktop {
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3);
          align-items: start;
          box-sizing: border-box;
          min-height: calc(100dvh - var(--haxcms-theme-offset-top, 0px));
        }
        :host(:not([explorer-open])) .desktop,
        :host([page-maximized]) .desktop {
          grid-template-columns: minmax(0, 1fr);
        }
        :host([page-maximized]) .desktop {
          padding: var(--ddd-spacing-0);
        }
        :host(:not([explorer-open])) .explorer,
        :host([page-maximized]) .explorer,
        :host([page-minimized]) .editor {
          display: none;
        }
        .window {
          background-color: var(--wysiwyg96-face);
          color: var(--wysiwyg96-ink);
          box-shadow:
            var(--wysiwyg96-raised),
            0 0 0 1px var(--wysiwyg96-dk);
          padding: var(--ddd-spacing-1);
          min-width: 0;
          font-family: var(--wysiwyg96-ui-font);
          font-size: var(--ddd-font-size-4xs);
        }
        .titlebar {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          min-height: 28px;
          padding: 2px;
          background-color: var(--wysiwyg96-title);
          color: var(--wysiwyg96-title-ink);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
        }
        .titlebar .caption {
          flex: 1 1 auto;
          min-width: 0;
          overflow-wrap: anywhere;
          text-align: center;
        }
        .winbtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex: none;
          padding: var(--ddd-spacing-0);
          border: 0;
          border-radius: 0;
          background-color: var(--wysiwyg96-face);
          color: var(--wysiwyg96-ink);
          box-shadow: var(--wysiwyg96-raised);
          font-family: var(--wysiwyg96-ui-font);
          font-size: 10px;
          line-height: 1;
          cursor: pointer;
        }
        .winbtn:active {
          box-shadow: var(--wysiwyg96-sunken);
        }
        /* the bar is a border, so forced colors still draw it */
        .winbtn.sys::before {
          content: "";
          width: 12px;
          height: 0;
          border-top: 3px solid var(--wysiwyg96-ink);
          box-shadow: 0 0 0 1px var(--wysiwyg96-hi);
        }
        .winbtn.min::before {
          content: "\\25BC";
        }
        .winbtn.max::before {
          content: "\\25B2";
        }
        :host([page-maximized]) .editor .winbtn.max::before {
          content: "\\25B2\\A\\25BC";
          white-space: pre;
          font-size: 7px;
          line-height: 0.9;
        }
        .menubar {
          display: flex;
          align-items: center;
          min-height: 28px;
          padding: 0 2px;
          border-bottom: 1px solid var(--wysiwyg96-lo);
          overflow-x: auto;
        }
        site-top-menu {
          --site-top-menu-bg: transparent;
          --site-top-menu-link-color: var(--wysiwyg96-ink);
          --site-top-menu-indicator-color: transparent;
          --site-top-menu-link-active-color: var(--wysiwyg96-select-ink);
          font-family: var(--wysiwyg96-ui-font);
          font-size: var(--ddd-font-size-4xs);
        }
        site-top-menu::part(button) {
          font-family: var(--wysiwyg96-ui-font);
          font-size: var(--ddd-font-size-4xs);
          color: var(--wysiwyg96-ink);
          background: transparent;
          border: 0;
          border-radius: 0;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          min-height: 26px;
          text-transform: none;
        }
        site-top-menu::part(button):hover {
          background-color: var(--wysiwyg96-select);
          color: var(--wysiwyg96-select-ink);
        }
        site-top-menu::part(indicator) {
          display: none;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 2px;
          padding: var(--ddd-spacing-1) 2px;
          border-bottom: 1px solid var(--wysiwyg96-lo);
          box-shadow: 0 1px 0 var(--wysiwyg96-hi);
        }
        .toolbar .sep {
          width: 2px;
          height: 24px;
          margin: 0 var(--ddd-spacing-1);
          box-shadow:
            inset 1px 0 0 var(--wysiwyg96-lo),
            inset -1px 0 0 var(--wysiwyg96-hi);
        }
        .tool,
        .toolbar site-print-button,
        .toolbar site-modal,
        .toolbar site-menu-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 30px;
          background-color: var(--wysiwyg96-face);
          color: var(--wysiwyg96-ink);
          box-shadow: var(--wysiwyg96-raised);
          border: 0;
          border-radius: 0;
          padding: 0 var(--ddd-spacing-1);
          font-family: var(--wysiwyg96-ui-font);
          font-size: var(--ddd-font-size-4xs);
          cursor: pointer;
          box-sizing: border-box;
          --simple-icon-color: var(--wysiwyg96-ink);
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
          --simple-icon-button-border-radius: 0;
          --simple-icon-button-padding: 4px;
        }
        .toolbar site-print-button,
        .toolbar site-modal {
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          --simple-icon-button-padding: 0px;
        }
        .tool[aria-pressed="true"] {
          box-shadow: var(--wysiwyg96-sunken);
          font-weight: var(--ddd-font-weight-bold);
        }
        .tool:active {
          box-shadow: var(--wysiwyg96-sunken);
        }
        .tool .label {
          padding: 0 var(--ddd-spacing-1);
        }
        site-menu-button::part(button) {
          background: transparent;
          border: 0;
          color: var(--wysiwyg96-ink);
          min-width: 28px;
          min-height: 28px;
          cursor: pointer;
        }
        site-menu-button[disabled] {
          opacity: 0.55;
        }
        .addressrow {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-1) 2px;
          font-size: var(--ddd-font-size-4xs);
        }
        .addressrow .field {
          flex: 1 1 auto;
          min-width: 0;
          min-height: 26px;
          display: flex;
          align-items: center;
          padding: 0 var(--ddd-spacing-2);
          background-color: var(--wysiwyg96-field);
          box-shadow: var(--wysiwyg96-sunken);
          overflow-wrap: anywhere;
        }
        site-breadcrumb {
          --site-breadcrumb-color: var(--wysiwyg96-ink);
          --site-breadcrumb-last-color: var(--wysiwyg96-ink);
          font-family: var(--wysiwyg96-ui-font);
          font-size: var(--ddd-font-size-4xs);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        .canvas {
          margin-top: var(--ddd-spacing-1);
          background-color: var(--wysiwyg96-face);
          box-shadow: var(--wysiwyg96-sunken);
          padding: 2px;
        }
        .page {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5)
            var(--ddd-spacing-6);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.5;
          color: var(--wysiwyg96-ink);
        }
        site-active-title {
          display: block;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-ml);
          color: var(--wysiwyg96-ink);
        }
        .pager {
          display: flex;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-1) 2px;
        }
        .statusbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          gap: var(--ddd-spacing-1);
          margin-top: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
        }
        .statusbar span {
          padding: 3px var(--ddd-spacing-2);
          box-shadow: var(--wysiwyg96-sunken);
          overflow-wrap: anywhere;
          min-height: 18px;
        }
        .explorer .tree {
          margin-top: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-1);
          background-color: var(--wysiwyg96-field);
          box-shadow: var(--wysiwyg96-sunken);
          max-height: calc(100dvh - 120px);
          overflow: auto;
        }
        site-menu {
          --site-menu-color: var(--wysiwyg96-ink);
          --site-menu-active-color: var(--wysiwyg96-select-ink);
          --site-menu-item-active-item-color: var(--wysiwyg96-select-ink);
          --site-menu-item-active-item-background-color: var(
            --wysiwyg96-select
          );
          --site-menu-font-family: var(--wysiwyg96-ui-font);
          --map-menu-item-a-active-color: var(--wysiwyg96-select-ink);
          --map-menu-item-a-active-background-color: var(--wysiwyg96-select);
          --map-menu-item-a-color: var(--wysiwyg96-ink);
          --map-menu-font-family: var(--wysiwyg96-ui-font);
          font-family: var(--wysiwyg96-ui-font);
          font-size: var(--ddd-font-size-4xs);
          color: var(--wysiwyg96-ink);
          height: auto;
        }
        /* a minimized window: an icon on the desktop, as the classic
           desktop parked one along its bottom edge */
        .icons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-4);
          grid-column: 1 / -1;
          align-self: end;
        }
        .icons[hidden] {
          display: none;
        }
        .desk-icon {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-1);
          min-width: 88px;
          max-width: 140px;
          padding: var(--ddd-spacing-1);
          border: 0;
          background: transparent;
          color: var(--wysiwyg96-ink);
          font-family: var(--wysiwyg96-ui-font);
          font-size: var(--ddd-font-size-4xs);
          cursor: pointer;
          --simple-icon-width: 32px;
          --simple-icon-height: 32px;
          --simple-icon-color: var(--wysiwyg96-ink);
        }
        .desk-icon .glyph {
          display: inline-flex;
          padding: var(--ddd-spacing-1);
          background-color: var(--wysiwyg96-face);
          box-shadow: var(--wysiwyg96-raised);
        }
        .desk-icon .name {
          padding: 1px var(--ddd-spacing-1);
          background-color: var(--wysiwyg96-field);
          overflow-wrap: anywhere;
          max-width: 100%;
        }
        dialog {
          padding: var(--ddd-spacing-1);
          border: 0;
          width: min(720px, calc(100vw - 24px));
          max-height: calc(100dvh - 24px);
          background-color: var(--wysiwyg96-face);
          color: var(--wysiwyg96-ink);
          box-shadow:
            var(--wysiwyg96-raised),
            0 0 0 1px var(--wysiwyg96-dk),
            4px 4px 0 0 var(--ddd-theme-default-black);
          font-family: var(--wysiwyg96-ui-font);
          font-size: var(--ddd-font-size-4xs);
          overscroll-behavior: contain;
        }
        dialog.moved {
          margin: var(--ddd-spacing-0);
          right: auto;
          bottom: auto;
        }
        dialog::backdrop {
          background: transparent;
        }
        dialog .titlebar {
          cursor: move;
          touch-action: none;
          user-select: none;
        }
        dialog pre {
          margin: var(--ddd-spacing-2) 0;
          padding: var(--ddd-spacing-2);
          max-height: 50dvh;
          overflow: auto;
          background-color: var(--wysiwyg96-field);
          color: var(--wysiwyg96-ink);
          box-shadow: var(--wysiwyg96-sunken);
          font-family: var(--ddd-font-mono);
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.35;
          white-space: pre-wrap;
          word-break: break-word;
        }
        dialog .row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-1) 2px;
        }
        dialog .row .grow {
          flex: 1 1 auto;
        }
        dialog fieldset {
          border: 0;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-4);
        }
        dialog label {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: 28px;
          cursor: pointer;
        }
        dialog input[type="radio"] {
          width: 20px;
          height: 20px;
          margin: var(--ddd-spacing-0);
          accent-color: var(--wysiwyg96-ink);
        }
        dialog .push {
          min-width: 88px;
          height: 30px;
          padding: 0 var(--ddd-spacing-3);
          border: 0;
          border-radius: 0;
          background-color: var(--wysiwyg96-face);
          color: var(--wysiwyg96-ink);
          box-shadow:
            var(--wysiwyg96-raised),
            0 0 0 1px var(--wysiwyg96-dk);
          font-family: var(--wysiwyg96-ui-font);
          font-size: var(--ddd-font-size-4xs);
          cursor: pointer;
        }
        dialog .push:active {
          box-shadow: var(--wysiwyg96-sunken);
        }
        @media (forced-colors: active) {
          .window,
          .winbtn,
          .tool,
          .canvas,
          .addressrow .field,
          .statusbar span,
          .desk-icon .glyph,
          dialog,
          dialog .push,
          dialog pre {
            border: 1px solid CanvasText;
          }
          .titlebar {
            border-bottom: 1px solid CanvasText;
          }
          .tool[aria-pressed="true"] {
            border-width: 2px;
          }
        }
        @media (max-width: 900px) {
          .desktop {
            grid-template-columns: minmax(0, 1fr);
            padding: var(--ddd-spacing-1);
            gap: var(--ddd-spacing-1);
          }
          .page {
            padding: var(--ddd-spacing-2) var(--ddd-spacing-3)
              var(--ddd-spacing-4);
            font-size: var(--ddd-font-size-4xs);
          }
          .statusbar {
            grid-template-columns: minmax(0, 1fr) auto;
          }
          .statusbar .wide {
            display: none;
          }
          .tool .label {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: var(--ddd-spacing-0);
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
          }
        }
      `,
    ];
  }

  _label(key, name) {
    return this.t[key].replace("{name}", () => name);
  }

  render() {
    const pageName = this._siteTitle || this.t.page;
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <div class="desktop">
        <section
          class="window explorer"
          id="explorer"
          aria-label="${this.t.explorer}"
          ?inert="${!this.explorerOpen || this.pageMaximized}"
        >
          <div class="titlebar">
            <button
              class="winbtn sys"
              aria-label="${this._label(
                this.explorerRolled ? "rollDown" : "rollUp",
                this.t.explorer,
              )}"
              aria-expanded="${this.explorerRolled ? "false" : "true"}"
              aria-controls="tree"
              @click="${this.toggleExplorerRolled}"
            ></button>
            <span class="caption">${this.t.explorer}</span>
            <button
              class="winbtn min"
              aria-label="${this._label("minimize", this.t.explorer)}"
              @click="${this.minimizeExplorer}"
            ></button>
          </div>
          <nav
            class="tree"
            id="tree"
            aria-label="${this.t.siteOutline}"
            ?hidden="${this.explorerRolled}"
          >
            <site-menu></site-menu>
          </nav>
        </section>
        <div class="window editor" ?inert="${this.pageMinimized}">
          <div class="titlebar">
            <button
              class="winbtn sys"
              aria-label="${this._label(
                this.pageRolled ? "rollDown" : "rollUp",
                pageName,
              )}"
              aria-expanded="${this.pageRolled ? "false" : "true"}"
              aria-controls="pagebody"
              ?disabled="${this.editMode}"
              @click="${this.togglePageRolled}"
            ></button>
            <span class="caption">${this._siteTitle} - [${this._file}]</span>
            <button
              class="winbtn min"
              aria-label="${this._label("minimize", pageName)}"
              ?disabled="${this.editMode}"
              @click="${this.minimizePage}"
            ></button>
            <button
              class="winbtn max"
              aria-label="${this._label(
                this.pageMaximized ? "restore" : "maximize",
                pageName,
              )}"
              aria-pressed="${this.pageMaximized ? "true" : "false"}"
              @click="${this.togglePageMaximized}"
            ></button>
          </div>
          <div id="pagebody" ?hidden="${this.pageRolled}">
            <nav class="menubar" aria-label="${this.t.siteNavigation}">
              <site-top-menu noink indicator="none"></site-top-menu>
            </nav>
            <div
              class="toolbar"
              role="toolbar"
              aria-label="${this.t.pageTools}"
            >
              <button
                class="tool"
                aria-pressed="${
                  this.explorerOpen && !this.pageMaximized ? "true" : "false"
                }"
                aria-controls="explorer"
                @click="${this.toggleExplorer}"
              >
                <simple-icon-lite icon="icons:list"></simple-icon-lite
                ><span class="label">${this.t.explorer}</span>
              </button>
              <span class="sep" aria-hidden="true"></span>
              <site-menu-button
                type="prev"
                position="bottom"
              ></site-menu-button>
              <site-menu-button
                type="next"
                position="bottom"
              ></site-menu-button>
              <span class="sep" aria-hidden="true"></span>
              <site-print-button position="bottom"></site-print-button>
              <site-modal
                ?disabled="${this.editMode}"
                icon="icons:search"
                title="${this.t.searchSite}"
                button-label="${this.t.search}"
                position="bottom"
              >
                <site-search></site-search>
              </site-modal>
              <span class="sep" aria-hidden="true"></span>
              <button class="tool" @click="${this.openViewHtml}">
                <simple-icon-lite icon="icons:code"></simple-icon-lite
                ><span class="label">${this.t.viewHtml}</span>
              </button>
              <button
                class="tool"
                aria-pressed="${this._dark ? "true" : "false"}"
                @click="${this.toggleDarkMode}"
              >
                <simple-icon-lite icon="image:brightness-6"></simple-icon-lite
                ><span class="label">${this.t.highContrast}</span>
              </button>
            </div>
            <div class="addressrow">
              <span id="location-label">${this.t.location}:</span>
              <div class="field" role="group" aria-labelledby="location-label">
                ${
                  this._depth > 0
                    ? html`<site-breadcrumb></site-breadcrumb>`
                    : html`<span>/${this._slug}</span>`
                }
              </div>
            </div>
            <main class="canvas">
              <div class="page">
                <site-active-title></site-active-title>
                <article id="contentcontainer">
                  <section id="slot"><slot></slot></section>
                </article>
                <nav class="pager" aria-label="${this.t.pageNavigation}">
                  <site-menu-button
                    type="prev"
                    position="top"
                  ></site-menu-button>
                  <site-menu-button
                    type="next"
                    position="top"
                  ></site-menu-button>
                </nav>
              </div>
            </main>
            <footer class="statusbar">
              <span>${this.editMode ? this.t.editing : this.t.ready}</span>
              <span class="wide">${this._updated}</span>
              <span>${this._position}</span>
            </footer>
          </div>
        </div>
        <div class="icons" ?hidden="${!this.pageMinimized}">
          <button
            class="desk-icon"
            aria-label="${this._label("restore", pageName)}"
            @click="${this.restorePage}"
          >
            <span class="glyph" aria-hidden="true"
              ><simple-icon-lite icon="icons:description"></simple-icon-lite
            ></span>
            <span class="name" aria-hidden="true">${pageName}</span>
          </button>
        </div>
      </div>
      <dialog
        id="viewhtml"
        aria-labelledby="viewhtml-title"
        @close="${this._dialogClosed}"
      >
        <div
          class="titlebar"
          tabindex="0"
          aria-describedby="viewhtml-move"
          @pointerdown="${this._dragStart}"
          @pointermove="${this._dragMove}"
          @pointerup="${this._dragEnd}"
          @pointercancel="${this._dragEnd}"
          @keydown="${this._dragKey}"
        >
          <span class="winbtn sys" aria-hidden="true"></span>
          <span class="caption" id="viewhtml-title">${this.t.viewHtml}</span>
        </div>
        <span class="sr-only" id="viewhtml-move">${this.t.moveHint}</span>
        <pre tabindex="0" aria-label="${this.t.pageHtml}">
${this._htmlSource}</pre>
        <div class="row">
          <fieldset>
            <legend class="sr-only">${this.t.htmlSource}</legend>
            <label
              ><input
                type="radio"
                name="htmlmode"
                value="original"
                .checked="${this._htmlMode === "original"}"
                @change="${this._modeChanged}"
              />${this.t.original}</label
            >
            <label
              ><input
                type="radio"
                name="htmlmode"
                value="generated"
                .checked="${this._htmlMode === "generated"}"
                @change="${this._modeChanged}"
              />${this.t.generated}</label
            >
          </fieldset>
          <span class="grow"></span>
          <button class="push" @click="${this.closeViewHtml}">
            ${this.t.close}
          </button>
        </div>
      </dialog>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__mq = globalThis.matchMedia("(max-width: 900px)");
    this.__mqHandler = (e) => {
      this._mobile = e.matches;
      this.explorerOpen = !e.matches;
    };
    this.__mq.addEventListener("change", this.__mqHandler);
    this.__mqHandler(this.__mq);
    this.__disposers.push(
      autorun(() => {
        this._dark = !!toJS(store.darkMode);
      }),
    );
    this.__disposers.push(
      autorun(() => {
        const manifest = toJS(store.manifest);
        this._siteTitle = manifest && manifest.title ? manifest.title : "";
      }),
    );
    this.__disposers.push(
      autorun(() => {
        const item = toJS(store.activeItem);
        const items =
          toJS(store.routerManifest && store.routerManifest.items) || [];
        if (item) {
          // the page's own file, written the way the desktop wrote paths
          this._file = (item.location || "").replace(/\//g, "\\");
          this._slug = item.slug || "";
          this._depth = parseInt(item.indent || 0, 10) || (item.parent ? 1 : 0);
          const stamp =
            item.metadata && item.metadata.updated
              ? new Date(parseInt(item.metadata.updated, 10) * 1000)
              : null;
          this._updated =
            stamp && !isNaN(stamp)
              ? this.t.updated.replace("{date}", () =>
                  stamp.toLocaleDateString(),
                )
              : "";
          const index = items.findIndex((i) => i.id === item.id);
          this._position =
            index > -1
              ? this.t.position
                  .replace("{index}", () => String(index + 1))
                  .replace("{count}", () => String(items.length))
              : "";
        }
        // going to a page shows it, whatever state its window was left in
        this.pageRolled = false;
        this.pageMinimized = false;
        if (this._mobile) {
          this.explorerOpen = false;
        }
      }),
    );
  }

  disconnectedCallback() {
    if (this.__mq) {
      this.__mq.removeEventListener("change", this.__mqHandler);
    }
    this.__disposers.forEach((dispose) => dispose());
    this.__disposers = [];
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // editing needs the page on screen
    if (
      changedProperties.has("editMode") &&
      this.editMode &&
      (this.pageRolled || this.pageMinimized)
    ) {
      this.pageRolled = false;
      this.pageMinimized = false;
    }
  }

  toggleExplorer() {
    if (this.pageMaximized) {
      this.pageMaximized = false;
      this.explorerOpen = true;
    } else {
      this.explorerOpen = !this.explorerOpen;
    }
    if (this.explorerOpen) {
      this.explorerRolled = false;
    }
  }

  toggleExplorerRolled() {
    this.explorerRolled = !this.explorerRolled;
  }

  minimizeExplorer() {
    this.explorerOpen = false;
    this._focusAfterRender(".toolbar .tool");
  }

  togglePageRolled() {
    this.pageRolled = !this.pageRolled;
  }

  minimizePage() {
    this.pageMinimized = true;
    this._focusAfterRender(".desk-icon");
  }

  restorePage() {
    this.pageMinimized = false;
    this._focusAfterRender(".editor .winbtn.min");
  }

  togglePageMaximized() {
    this.pageMaximized = !this.pageMaximized;
  }

  /** keep focus on a control that still exists after a window changes state */
  async _focusAfterRender(selector) {
    await this.updateComplete;
    const target = this.shadowRoot.querySelector(selector);
    if (target) {
      target.focus();
    }
  }

  toggleDarkMode() {
    store.darkMode = !store.darkMode;
  }

  async _loadHtml() {
    if (this._htmlMode === "generated") {
      // what the browser is showing right now, HAX elements and all
      const slot = this.shadowRoot.querySelector("#slot slot");
      const nodes = slot ? slot.assignedNodes({ flatten: true }) : [];
      this._htmlSource = nodes
        .map((n) => (n.nodeType === 1 ? n.outerHTML : n.textContent))
        .join("")
        .trim();
      return;
    }
    // the page file as saved
    const item = toJS(store.activeItem);
    this._htmlSource = "";
    if (item && item.location) {
      try {
        const res = await fetch(item.location);
        this._htmlSource = res.ok ? (await res.text()).trim() : "";
      } catch {
        this._htmlSource = "";
      }
    }
  }

  async openViewHtml() {
    await this._loadHtml();
    const dialog = this.shadowRoot.querySelector("#viewhtml");
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }

  closeViewHtml() {
    const dialog = this.shadowRoot.querySelector("#viewhtml");
    if (dialog && dialog.open) {
      dialog.close();
    }
    this._resetDialogPosition();
  }

  /** closed with Close or Escape */
  _dialogClosed() {
    this._htmlMode = "original";
    this._resetDialogPosition();
  }

  /** the next time it opens, it opens in the middle of the screen again */
  _resetDialogPosition() {
    const dialog = this.shadowRoot.querySelector("#viewhtml");
    if (dialog) {
      dialog.classList.remove("moved");
      dialog.style.removeProperty("left");
      dialog.style.removeProperty("top");
    }
  }

  _modeChanged(e) {
    this._htmlMode = e.target.value;
    this._loadHtml();
  }

  /** put the View HTML window at x, y, kept fully on screen */
  _moveDialogTo(x, y) {
    const dialog = this.shadowRoot.querySelector("#viewhtml");
    if (!dialog) {
      return;
    }
    const rect = dialog.getBoundingClientRect();
    const maxX = Math.max(0, globalThis.innerWidth - rect.width);
    const maxY = Math.max(0, globalThis.innerHeight - rect.height);
    dialog.classList.add("moved");
    dialog.style.left = `${Math.round(Math.min(Math.max(0, x), maxX))}px`;
    dialog.style.top = `${Math.round(Math.min(Math.max(0, y), maxY))}px`;
  }

  _dragStart(e) {
    if (e.button !== 0) {
      return;
    }
    const dialog = this.shadowRoot.querySelector("#viewhtml");
    const rect = dialog.getBoundingClientRect();
    this.__drag = {
      id: e.pointerId,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  _dragMove(e) {
    if (!this.__drag || this.__drag.id !== e.pointerId) {
      return;
    }
    this._moveDialogTo(e.clientX - this.__drag.dx, e.clientY - this.__drag.dy);
  }

  _dragEnd(e) {
    if (this.__drag && this.__drag.id === e.pointerId) {
      this.__drag = null;
    }
  }

  /** arrow keys move the window from its title bar, as the keyboard could */
  _dragKey(e) {
    const steps = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const step = steps[e.key];
    if (!step) {
      return;
    }
    e.preventDefault();
    const distance = e.shiftKey ? 50 : 10;
    const rect = this.shadowRoot
      .querySelector("#viewhtml")
      .getBoundingClientRect();
    this._moveDialogTo(
      rect.left + step[0] * distance,
      rect.top + step[1] * distance,
    );
  }
}
globalThis.customElements.define(Wysiwyg96Theme.tag, Wysiwyg96Theme);
export { Wysiwyg96Theme };
