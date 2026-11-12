/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import {
  winEventsElement,
  camelToDash,
  isURLAttribute,
  sanitizeURLValue,
  sanitizeEmbeddableURL,
  wipeSlot,
  normalizeEventPath,
  localStorageSet,
  sanitizeHTMLString,
} from "@haxtheweb/utils/utils.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";
import {
  HaxComponentStyles,
  HaxTrayDetail,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import { HaxUiAdminSidePanelFields } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-fields/lib/simple-fields-tab.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "./hax-tray-upload.js";
import "./hax-app-search.js";
import "./hax-gizmo-browser.js";
import "./hax-gizmo-browser.js";
import "./hax-view-source.js";
import "./hax-stax-browser.js";
import "./hax-map.js";
import "./hax-tray-button.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/undo-manager/undo-manager.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

/**
 * `hax-tray`
 * `The tray / dashboard area which allows for customization of all major settings`
 * @element hax-tray
 */
class HaxTray extends I18NMixin(winEventsElement(SimpleColors)) {
  /**
   * Convention we use
   */
  static get tag() {
    return "hax-tray";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.dragController = new AbortController();
    this.__winEvents = {
      "can-redo-changed": "_redoChanged",
      "can-undo-changed": "_undoChanged",
      "hax-drop-focus-event": "_expandSettingsPanel",
      "hax-toggle-active-node-lock": "_handleActiveNodeLock",
    };
    this.trayIcon = "image:tune";
    this.resizeDrag = false;
    this.hideToolbar = false;
    this.dark = false;
    this.__moveX = 0;
    this.t = {
      structure: "Structure",
      htmlSource: "HTML Source",
      markdownSource: "Markdown Source",
      sourceFormat: "Source format",
      html: "HTML",
      markdown: "Markdown",
      structureTip: "View Page Structure",
      edit: "Edit",
      save: "Save",
      saveAndEdit: "Save and edit",
      move: "Move",
      close: "Close",
      menuAlignment: "Menu Alignment",
      menuLeft: "Move",
      menuRight: "Move",
      menuPosition: "Menu position",
      changeSideVisually:
        "Change which side of the screen the menu is affixed to visually.",
      expand: "Expand",
      collapse: "Collapse",
      menuSize: "Menu size",
      menuSizeDescription: "Expand or collapse the menu visually.",
      merlin: "Merlin",
      summonMerlin: "Summon Merlin",
      settings: "Settings",
      source: "Source",
      undo: "Undo",
      redo: "Redo",
      media: "Media",
      blocks: "Blocks",
      cancel: "Cancel",
      cancelWithoutSaving: "Cancel without saving",
      configure: "Configure",
      advanced: "Advanced",
      developer: "Developer",
      alignment: "Alignment",
      left: "Left",
      center: "Center",
      right: "Right",
      search: "Search",
      pages: "Pages",
      templates: "Templates",
      width: "Width",
      content: "Content",
      linkHtmlContentDescription:
        "HTML inside this link. Nested elements like images are preserved; edit carefully.",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
      updateCallback: "_updateTrayDetail",
    });
    this._initial = true;
    this.activeValue = {
      settings: {
        configure: {},
        advanced: {},
        developer: {},
      },
    };
    this.collapsed = true;
    // what the add panel browses: "blocks" or "templates"
    this.addView = "blocks";
    this.locked = false;
    this.activeSchema = [
      {
        property: "settings",
        inputMethod: "collapse",
        properties: [],
      },
    ];
    this.canUndo = false;
    this.canRedo = false;
    this.trayDetail = "content-edit";
    this.activeTagName = "";
    this.traySizeIcon = "hax:arrow-expand-right";
    this.__setup = false;
    this.addEventListener(
      "hax-tray-button-click",
      this._processTrayEvent.bind(this),
    );
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeGizmo);
      Promise.resolve().then(() => {
        this.activeGizmo = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeNode);
      Promise.resolve().then(() => {
        this.activeNode = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.elementAlign);
      Promise.resolve().then(() => {
        this.elementAlign = _mobx_val_0;
        if (globalThis.document && globalThis.document.body) {
          if (this.elementAlign === "left") {
            globalThis.document.body.style.setProperty(
              "--hax-tray-element-align-margin",
              `0 0 0 var(--hax-tray-element-custom-width, calc(
              var(--hax-tray-width) - var(--hax-tray-menubar-min-width)
            ))`,
            );
          } else {
            globalThis.document.body.style.setProperty(
              "--hax-tray-element-align-margin",
              `0 var(--hax-tray-element-custom-width, calc(
              var(--hax-tray-width) - var(--hax-tray-menubar-min-width)
            )) 0 0`,
            );
          }
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.globalPreferences);
      Promise.resolve().then(() => {
        this.globalPreferences = _mobx_val_0;
        this.haxUiTheme = (this.globalPreferences || {}).haxUiTheme || "hax";
        this.dark = this.haxUiTheme === "haxdark";
        globalThis.document.body.setAttribute("hax-ui-theme", this.haxUiTheme);
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.editMode);
      Promise.resolve().then(() => {
        this.editMode = _mobx_val_0;
      });
    });
  }
  _expandSettingsPanel(_e) {
    if (!this.hideToolbar) {
      this.shadowRoot.querySelector("#content-edit").click();
    }
  }
  _redoChanged(e) {
    this.canRedo = e.detail.value;
  }
  _undoChanged(e) {
    this.canUndo = e.detail.value;
  }
  _handleActiveNodeLock(e) {
    if (!e.detail || !e.detail.node) {
      return;
    }
    // Only react when this tray's active node is the one being locked/unlocked
    if (this.activeNode !== e.detail.node) {
      return;
    }
    const wasLocked = this.locked;
    this.locked = !!e.detail.lock;
    // If nothing actually changed, do nothing to avoid extra refreshes
    if (wasLocked === this.locked) {
      return;
    }
    // Toggle enabled/disabled state of existing fields immediately
    if (this.shadowRoot && this.shadowRoot.querySelector("#settingsform")) {
      try {
        this.__lockAllSettings(this.locked);
      } catch {
        // settings form may not be initialized yet; fail silently
      }
    }
    // Trigger a single rebuild of the active node form so schema and
    // values are in sync with the new lock state. Because we guard on
    // wasLocked !== this.locked, this only runs once per toggle and
    // won't create a value-changed feedback loop.
    if (HAXStore && typeof HAXStore.refreshActiveNodeForm === "function") {
      HAXStore.refreshActiveNodeForm();
    }
    this.requestUpdate();
  }
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      ...(super.styles || []),
      ...HaxTrayDetail,
      ...HaxComponentStyles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminSidePanelFields,
      css`
        :host {
          --simple-fields-detail-font-family: var(--hax-ui-font-family);
          --simple-fields-font-family: var(--hax-ui-font-family);
          --simple-fields-input-background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-fields-input-border: 1px solid black;
          z-index: calc(var(--hax-ui-focus-z-index) - 1);
          top: 0;
          font-family: var(--hax-ui-font-family);
          font-size: var(--hax-ui-font-size);
          color: var(--hax-ui-color);
        }

        /* HAX UI side panel title bar: icon, title at the left, Move */
        .tray-detail-titlebar-icon {
          --simple-icon-height: var(--ddd-icon-4xs, 20px);
          --simple-icon-width: var(--ddd-icon-4xs, 20px);
          flex: 0 0 auto;
        }
        .wrapper {
          position: fixed;
          /* flex lives on the base state (not only edit mode) so leaving
             edit mode slides the whole full-height panel away instead of
             collapsing it to its content height mid-transition */
          display: flex;
          align-items: stretch;
          flex-direction: row-reverse;
          opacity: 0;
          visibility: visible;
          pointer-events: none;
          overflow: hidden;
          top: 0;
          bottom: 0;
          min-width: calc(var(--hax-tray-width) - 100px);
          max-width: 70vw;
          height: calc(100vh - 64px);
          max-height: calc(100vh - 64px);
          z-index: var(--hax-ui-focus-z-index);
          /* slide + fade on transform and opacity only so the edit-mode
             toggle never animates a layout property (haxtheweb/issues#3263) */
          transition:
            transform var(--ddd-duration-slow, 0.6s)
              var(--ddd-timing-ease, ease-in-out),
            opacity var(--ddd-duration-slow, 0.6s)
              var(--ddd-timing-ease, ease-in-out);
        }
        :host([collapsed]) #resize {
          display: none;
        }
        :host([resize-drag]) {
          cursor: col-resize;
          -webkit-user-select: none; /* Safari */
          -ms-user-select: none; /* IE 10 and IE 11 */
          user-select: none; /* Standard syntax */
          opacity: 1;
        }
        #resize {
          cursor: col-resize;
          background-color: transparent;
          height: 100%;
          padding: 0 12px 0 0;
          flex-shrink: 0;
          position: relative;
          z-index: var(--hax-ui-focus-z-index);
        }
        :host([element-align="right"]) #resize {
          padding: 0 0 0 12px;
        }
        #resize .resize-visual:hover {
          cursor: col-resize;
        }
        #resize .resize-visual {
          background-color: var(--ddd-theme-default-coalyGray);
          height: 100%;
          width: 6px;
        }
        :host(:hover) .wrapper {
          overflow: visible;
        }
        /* parked just off its edge while not editing; edit mode drops the
           transform so it rests at left / right 0 exactly as before */
        :host([element-align="left"]) .wrapper {
          left: 0px;
          flex-direction: row;
          transform: translateX(-100%);
        }
        :host([element-align="right"]) .wrapper {
          right: 0px;
          /* same order as edit mode so the panel does not flip mid-slide */
          flex-direction: row-reverse;
          transform: translateX(100%);
        }
        :host([tray-detail="view-source"]) .detail {
          width: 50vw;
          min-height: 300px;
          min-width: calc(var(--hax-tray-width) - 100px);
          resize: both;
          flex: unset;
        }
        :host([tray-detail="view-source"]) #resize {
          display: none;
        }
        :host([edit-mode]) .wrapper {
          opacity: 1;
          visibility: visible;
          pointer-events: all;
        }
        :host([edit-mode][element-align="left"]) .wrapper {
          left: 0px;
          transform: none;
        }
        :host([edit-mode][element-align="right"]) .wrapper {
          right: 0px;
          flex-direction: row-reverse;
          transform: none;
        }

        :host([edit-mode]) .wrapper.full-panel {
          width: unset;
          left: 0;
          right: 0;
        }

        :host([edit-mode][collapsed]) .wrapper {
          width: unset;
        }

        #menubar {
          display: inline-flex;
          flex-direction: column;
          align-items: stretch;
          overflow: visible;
          flex: 0 0 auto;
          z-index: 6;
          background-color: var(--hax-ui-background-color);
        }
        :host([collapsed]) #menubar {
          width: unset;
        }
        #menubar > * {
          background-color: var(--hax-ui-background-color);
        }
        #menubar > *::part(button) {
          padding: var(--hax-ui-spacing-xs);
        }
        #menubar > *::part(label) {
          margin: 0px;
          font-size: 10px;
          display: inline-block;
          text-align: left;
          opacity: 1;
          visibility: visible;
          padding: 0px var(--hax-ui-spacing-sm);
          overflow: unset;
        }
        #haxMenuAlign {
          --simple-toolbar-button-width: 18px;
          --simple-toolbar-button-height: 18px;
          margin: 0;
          height: var(--hax-ui-row-height);
          width: var(--hax-ui-row-height);
        }
        .detail {
          resize: horizontal;
          visibility: visible;
          pointer-events: all;
          background-color: var(--hax-ui-surface);
          max-height: calc(100vh - 64px);
          width: var(
            --hax-tray-element-custom-width,
            calc(var(--hax-tray-width) - var(--hax-tray-menubar-min-width))
          );
          max-width: 70vw;
          min-width: 200px;
          overflow-x: auto;
          opacity: 1;
        }
        .detail::-webkit-scrollbar-track {
          border-radius: 0;
          background-color: var(--ddd-theme-default-coalyGray);
        }

        .detail::-webkit-scrollbar {
          width: 8px;
          background-color: var(--ddd-theme-default-coalyGray);
        }
        .detail::-webkit-scrollbar-thumb {
          border-radius: 4px;
          -webkit-box-shadow: inset 0 0 4px
            var(--ddd-theme-default-limestoneGray);

          box-shadow: inset 0 0 4px var(--ddd-theme-default-limestoneGray);
          background-color: var(--ddd-theme-default-limestoneGray);
        }
        /* collapsed: the panel is also inert (render), so nothing inside
           it, including children that force visibility: visible, can be
           reached with Tab or by assistive technology */
        :host([collapsed]) .detail {
          width: 0px;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          max-height: 100vh;
          overflow-y: auto;
        }
        #tray-detail {
          width: auto;
          padding: 0;
          transition: opacity var(--ddd-duration-normal, 0.3s) ease-in-out;
          opacity: 1;
          /* clip, not hidden: hidden makes this the scroll box for sticky
             children, so the title bar and the Blocks filter scrolled away
             with the panel instead of staying at its top */
          overflow: clip;
        }
        .wrapper:focus #tray-detail,
        .wrapper:focus-within #tray-detail,
        .wrapper:hover #tray-detail,
        #tray-detail:hover,
        #tray-detail:focus,
        #tray-detail:focus-within {
          opacity: 1;
        }
        #haxcancelbutton::part(dropdown-icon) {
          display: none;
        }
        /* same Coaly gray as the HAXcms editor top bar it sits under */
        #tray-detail {
          --hax-tray-detail-title-font-size: var(--hax-ui-font-size);
        }
        #tray-detail h4.tray-detail-titlebar {
          box-sizing: border-box;
          height: var(--hax-ui-titlebar-height, 48px);
          padding: 0 var(--hax-ui-gap-md) 0 var(--hax-ui-gap-lg);
          gap: var(--hax-ui-gap-md);
          justify-content: flex-start;
          background-color: var(--hax-ui-titlebar);
          color: var(--hax-ui-on-titlebar, var(--ddd-theme-default-white));
          font-family: var(--hax-ui-admin-font-family);
          word-break: normal;
        }
        .tray-detail-titlebar .tray-detail-titlebar-label {
          display: block;
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: start;
        }
        .tray-detail-titlebar-actions {
          flex: 0 0 auto;
          display: flex;
        }
        /* Source format switch: quiet on the dark title bar, the chosen
           format filled */
        .source-format {
          flex: 0 0 auto;
          display: inline-flex;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
          overflow: hidden;
        }
        .source-format button {
          padding: var(--hax-ui-gap, 4px) var(--hax-ui-gap-md, 8px);
          border: 0;
          background-color: transparent;
          color: var(--hax-ui-on-titlebar, var(--ddd-theme-default-white));
          font-family: var(--hax-ui-font-family);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          font-weight: 400;
          line-height: 1.3;
          cursor: pointer;
        }
        .source-format button + button {
          border-inline-start: 1px solid var(--hax-ui-line-strong);
        }
        .source-format button[aria-pressed="true"] {
          background-color: var(
            --hax-ui-on-titlebar,
            var(--ddd-theme-default-white)
          );
          color: var(--hax-ui-titlebar);
          font-weight: 700;
        }
        .source-format button:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        /* phone: the Markdown mark alone stands in for the long title */
        @media screen and (max-width: 800px) {
          :host([tray-detail="view-source"][view-source-format="markdown"])
            .tray-detail-titlebar-label {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
          }
          :host([tray-detail="view-source"]) .source-format {
            margin-inline-start: auto;
          }
        }
        #haxMenuAlign::part(button) {
          width: var(--hax-ui-row-height);
          height: var(--hax-ui-row-height);
          padding: 0;
          justify-content: center;
          border-color: transparent;
          background-color: transparent;
          color: var(--hax-ui-on-titlebar, var(--ddd-theme-default-white));
        }
        #haxMenuAlign:hover::part(button),
        #haxMenuAlign:focus-within::part(button) {
          background-color: rgba(255, 255, 255, 0.12);
        }
        #settingsform {
          margin: 0;
          padding: 0;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          --a11y-collapse-padding-top: 0;
          --a11y-collapse-padding-bottom: 0;
          --a11y-collapse-vertical-padding: 0;
          --a11y-collapse-horizontal-padding: 0;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .block-add-wrapper {
          /* the panel (.detail) scrolls; no scroll box here, so the Blocks
             filter can stick under the title bar */
          overflow-y: visible;
          overflow-x: clip;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .block-add-wrapper > * {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        #settingsform * {
          box-sizing: border-box;
        }
        #settingsform simple-fields-tab,
        #settingsform a11y-collapse,
        #settingsform a11y-collapse-group {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        #settingsform hax-upload-field {
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        /* groups (Configure, Advanced, Developer) are HAX UI fieldset rows:
           32px, chevron first, bold label, a line under */
        #settingsform a11y-collapse {
          margin: 0px;
          --a11y-collapse-margin: 0;
          --a11y-collapse-border: none;
          --a11y-collapse-border-between: none;
          --a11y-collapse-vertical-padding: 0;
          --a11y-collapse-horizontal-padding: 0;
          --a11y-collapse-heading-font-weight: 700;
          --a11y-collapse-heading-color: var(--hax-ui-text);
          /* hax:admin-chevron points right: closed as is, open turned down */
          --a11y-collapse-transform-deg: 90deg;
          --a11y-collapse-transform-rotated-deg: 0deg;
          /* square rows with no hover wash: the content look (rounded
             frame, tinted hover) is for collapses on the page */
          --a11y-collapse-border-radius: 0;
          --a11y-collapse-group-radius: 0;
          --a11y-collapse-heading-hover-background-color: transparent;
        }
        #settingsform a11y-collapse::part(heading-id) {
          flex-direction: row-reverse;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
          min-height: calc(var(--hax-ui-row-height) - 1px);
          padding: 0 var(--hax-ui-gap-lg);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        /* a plain chevron, not the round toggle collapses get on the
           page */
        #settingsform a11y-collapse::part(icon) {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          width: var(--hax-ui-icon);
          height: var(--hax-ui-icon);
          border: none;
          border-radius: 0;
          background-color: transparent;
          color: inherit;
        }
        /* the row names itself; no "expand" / "collapse" tooltip */
        #settingsform a11y-collapse::part(tooltip) {
          display: none;
        }
        #settingsform a11y-collapse span[slot="heading"] {
          display: block;
          margin: 0;
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--hax-ui-admin-font-size);
          line-height: calc(var(--hax-ui-row-height) - 1px);
          color: var(--hax-ui-text);
        }
        #settingsform a11y-collapse a11y-collapse::part(heading-id) {
          padding-inline-start: calc(var(--hax-ui-gap-lg) * 2);
        }
        #settingsform a11y-collapse-group {
          margin: 0;
          padding: 0;
          --a11y-collapse-group-margin: 0;
          --a11y-collapse-margin: 0;
        }
        hax-tray-button,
        hax-gizmo-browser {
          visibility: visible;
          --a11y-collapse-heading-color: var(
            --simple-colors-default-theme-accent-12
          );
        }
        hax-tray-button:not(:defined),
        hax-gizmo-browser:not(:defined) {
          visibility: hidden;
        }
        /* Blocks / Templates: a segmented switch that stays under the
           title bar with the Blocks filter */
        .add-switch {
          position: sticky;
          top: var(--hax-ui-titlebar-height, 48px);
          z-index: 3;
          box-sizing: border-box;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          background-color: var(--hax-ui-surface);
        }
        /* with Templates showing there is no filter under it, so the
           switch draws the line */
        .add-switch.templates {
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .block-add-wrapper {
          --hax-gizmo-browser-sticky-offset: calc(
            2 * var(--hax-ui-gap-md) + var(--hax-ui-row-height)
          );
          --hax-gizmo-browser-toolbar-padding-top: 0;
        }
        .add-switch-group {
          box-sizing: border-box;
          display: flex;
          height: var(--hax-ui-row-height);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
        }
        .add-switch-group button {
          flex: 1 1 0;
          margin: 0;
          padding: 0 var(--hax-ui-gap-md);
          border: 0;
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          cursor: pointer;
        }
        .add-switch-group button + button {
          border-left: 1px solid var(--hax-ui-line-strong);
        }
        .add-switch-group button:hover {
          background-color: var(--hax-ui-hover);
        }
        .add-switch-group button[aria-pressed="true"] {
          background-color: var(--hax-ui-accent-soft);
          font-weight: 700;
          box-shadow: inset 0 calc(-1 * var(--ddd-border-size-md, 2px)) 0
            var(--hax-ui-accent-strong);
        }
        .add-switch-group button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        /* upload: a dashed drop box, its name and hint on the left and the
           sources on the right */
        hax-tray-upload {
          display: block;
          box-sizing: border-box;
          margin: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.3;
          --simple-fields-margin: 0px;
          --simple-fields-margin-small: 0px;
          --simple-file-upload-padding: 0;
        }
        hax-tray-upload::part(fieldset) {
          position: relative;
          box-sizing: border-box;
          min-inline-size: 0;
          margin: 0;
          padding: var(--hax-ui-gap-md);
          border: 1px dashed var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
        }
        /* the name sits over the hint; the sources center on both lines */
        hax-tray-upload::part(legend) {
          position: absolute;
          top: var(--hax-ui-gap-md);
          inset-inline-start: var(--hax-ui-gap-md);
          margin: 0;
          padding: 0;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: 700;
          text-transform: capitalize;
        }
        hax-tray-upload::part(upload),
        hax-tray-upload::part(drop-zone),
        hax-tray-upload::part(source-row) {
          position: static;
          margin: 0;
          padding: 0;
        }
        hax-tray-upload::part(source-row) {
          justify-content: space-between;
          flex-wrap: nowrap;
          gap: var(--hax-ui-gap-md);
          width: 100%;
        }
        hax-tray-upload::part(drop-area-text) {
          flex: 1 1 auto;
          min-width: 0;
          padding-top: 1.3em;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: 400;
          line-height: 1.3;
        }
        hax-tray-upload::part(sources) {
          display: flex;
          flex: 0 0 auto;
          gap: var(--hax-ui-gap);
        }
        hax-tray-upload::part(merlin),
        hax-tray-upload::part(browse),
        hax-tray-upload::part(take-photo),
        hax-tray-upload::part(record-audio),
        hax-tray-upload::part(record-screen) {
          margin: 0;
          color: var(--hax-ui-text);
          --simple-toolbar-button-height: var(--hax-ui-icon);
          --simple-toolbar-button-width: var(--hax-ui-icon);
          --simple-toolbar-button-min-width: calc(
            var(--hax-ui-row-height) - 6px
          );
          --simple-toolbar-button-padding: calc(
            (var(--hax-ui-row-height) - 6px - var(--hax-ui-icon)) / 2
          );
          --simple-toolbar-button-border-color: var(--hax-ui-line-strong);
          --simple-toolbar-button-border-radius: var(--hax-ui-radius);
          --simple-toolbar-button-bg: var(--hax-ui-surface);
          --simple-toolbar-button-hover-bg: var(--hax-ui-hover);
          --simple-toolbar-button-hover-border-color: var(--hax-ui-line-strong);
        }
        /* phones: the hint on one line, the sources spread below it */
        @media screen and (max-width: 800px) {
          /* the wide Upload button comes first, then the name and hint
             on one line, then the sources */
          hax-tray-upload::part(add-button) {
            float: none;
            box-sizing: border-box;
            width: 100%;
            height: var(--hax-ui-row-height);
            margin: 0 0 var(--hax-ui-gap);
            border: 1px solid var(--hax-ui-line-strong);
            border-radius: var(--hax-ui-radius);
            background-color: var(--hax-ui-surface);
            color: var(--hax-ui-text);
            font-family: var(--hax-ui-admin-font-family);
            font-size: var(--hax-ui-admin-font-size);
          }
          hax-tray-upload::part(add-button)::before {
            content: "";
            display: inline-block;
            width: var(--hax-ui-icon);
            height: var(--hax-ui-icon);
            margin-inline-end: var(--hax-ui-gap-md);
            vertical-align: middle;
            background-color: currentColor;
            /* hax:admin-upload */
            mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z'/%3E%3C/svg%3E")
              center / contain no-repeat;
          }
          hax-tray-upload::part(legend) {
            top: calc(
              var(--hax-ui-gap-md) + var(--hax-ui-row-height) +
                var(--hax-ui-gap)
            );
          }
          hax-tray-upload::part(drop-area-text) {
            padding-top: 0;
            /* room for the name before the hint on the same line */
            padding-inline-start: 7.25em;
          }
          hax-tray-upload::part(sources) {
            justify-content: space-between;
            width: 100%;
            margin-top: var(--hax-ui-gap);
          }
          hax-tray-upload::part(source-row) {
            flex-wrap: wrap;
          }
          hax-tray-upload::part(merlin),
          hax-tray-upload::part(browse),
          hax-tray-upload::part(take-photo),
          hax-tray-upload::part(record-audio),
          hax-tray-upload::part(record-screen) {
            --simple-toolbar-button-min-width: calc(
              var(--hax-ui-row-height) - 2px
            );
            --simple-toolbar-button-padding: calc(
              (var(--hax-ui-row-height) - 2px - var(--hax-ui-icon)) / 2
            );
          }
        }
        *[hidden] {
          display: none;
        }
        :host([element-align="right"]) #button {
          right: 0;
        }
        :host([element-align="left"]) #button {
          left: 0;
        }

        #button {
          position: fixed;
          top: 0;
          visibility: visible;
          margin: var(--hax-ui-spacing-xs);
        }
        :host([edit-mode]) #button {
          visibility: hidden;
          opacity: 0;
        }
        #button:hover {
          opacity: 1;
        }
        /** This is mobile layout for controls */
        @media screen and (max-width: 800px) {
          :host {
            width: 100%;
          }
          #resize {
            display: none;
          }
          :host([edit-mode]) .wrapper.full-panel .detail {
            max-width: 70vw;
            max-height: unset;
          }
          .detail {
            max-width: 70vw;
          }
          #tray-detail {
            max-width: 70vw;
            max-height: unset;
          }
          .wrapper {
            width: unset;
            top: 0px;
            left: 0px;
            right: 0px;
            flex-direction: column;
          }
          /* on small screens the tray drops in from the top */
          :host([element-align]) .wrapper {
            transform: translateY(-100%);
          }
          :host([edit-mode]) .wrapper {
            top: 0;
            pointer-events: none;
          }
          :host([collapsed]) .wrapper {
            height: var(--hax-tray-menubar-min-height);
          }
          :host([element-align="left"]) .wrapper {
            left: 0px;
            flex-direction: column;
          }
          #menubar {
            position: sticky;
            flex-direction: row;
            left: 0;
            top: 0;
            height: auto;
            flex: 0 0 auto;
            width: 100%;
            pointer-events: all;
          }
          #menubar > * {
            flex: 1 0 auto;
            min-width: var(--hax-tray-menubar-min-width);
          }
          #menubar > *::part(button) {
            min-width: var(--hax-tray-menubar-min-width);
            justify-content: space-around;
          }
          #menubar > *::part(label) {
            display: none;
          }
          #haxMenuAlign {
            display: none;
          }
          :host([tray-detail="view-source"]) .detail {
            width: 100%;
            resize: unset;
            height: 100vh;
          }
          :host([tray-detail="view-source"]) #tray-detail {
            overflow: hidden;
          }
          .detail {
            position: relative;
            flex: 1 1 100%;
            pointer-events: all;
          }
          :host([collapsed]) .detail {
            flex: 0 0 0px;
          }
        }
        @media screen and (max-width: 600px) {
          :host([edit-mode]) .hide-small {
            display: none;
          }
        }
        /* reduced motion: no slide, the tray just fades in place */
        @media (prefers-reduced-motion: reduce) {
          .wrapper {
            transition: opacity var(--ddd-duration-fast, 0.15s)
              var(--ddd-timing-linear, linear);
          }
        }
      `,
    ];
  }
  /**
   * Once simple-fields builds the Configure form: give its groups
   * (Configure, Advanced, Developer) the HAX UI admin chevron, pointing
   * right when closed and down when open (the rotation is in the
   * #settingsform a11y-collapse styles), and the admin info icon on
   * each field's (i) button.
   */
  _haxUiSettingsForm(e) {
    const form = e && e.detail && e.detail.querySelectorAll ? e.detail : null;
    if (!form) {
      return;
    }
    form.querySelectorAll("a11y-collapse").forEach((collapse) => {
      collapse.icon = HaxUiAdminIcons.chevron;
    });
    // the (i) after each label uses the admin info icon
    form
      .querySelectorAll(
        "simple-fields-field, simple-fields-container, hax-upload-field",
      )
      .forEach((field) => {
        field.infoIcon = HaxUiAdminIcons.info;
      });
  }
  get trayStatus() {
    let status = this.collapsed
      ? "collapsed"
      : this.trayDetail == "view-source"
        ? "full-panel"
        : "side-panel";
    HAXStore.trayStatus = status;
    HAXStore.trayDetail = this.trayDetail;
    return status;
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      ${this.panelOpsTemplate}
      <div class="wrapper ${this.trayStatus}">
        ${this.hideToolbar ? `` : html`${this.menuToolbarTemplate}`}
        <div class="detail" ?inert="${this.collapsed}">
          ${this.trayDetailTemplate}
        </div>
        <div
          class="resize"
          id="resize"
          @mousedown="${this.resizeDown}"
          @dblclick="${this.resetSize}"
        >
          <div class="resize-visual"></div>
        </div>
      </div>
    `;
  }

  resetSize(_e) {
    this.resizeDrag = false;
    this.dragController.abort();
    setTimeout(() => {
      this.shadowRoot.querySelector(".detail").style.removeProperty("width");
    }, 10);
  }

  resizeDown(e) {
    this.resizeDrag = true;
    this.__moveX = e.x;
    this.dragController = new AbortController();
    // set listeners now that we've decided to move at all
    this.addEventListener(
      "mousemove",
      (e) => {
        // edge case of clicking away from the item, letting go outside detection then coming back in
        if (e.which === 0) {
          this.resizeDrag = false;
          this.dragController.abort();
        }
        if (this.resizeDrag) {
          this.__moveX = e.x;
          let base = 44;
          if (this.hideToolbar) {
            base = 0;
          }
          if (this.elementAlign === "right") {
            globalThis.document.body.style.setProperty(
              "--hax-tray-element-custom-width",
              globalThis.innerWidth - this.__moveX - base + "px",
            );
          } else {
            globalThis.document.body.style.setProperty(
              "--hax-tray-element-custom-width",
              this.__moveX - base + "px",
            );
          }
        }
      },
      { signal: this.dragController.signal },
    );
    this.addEventListener(
      "mouseup",
      (_e) => {
        this.resizeDrag = false;
        this.dragController.abort();
      },
      { signal: this.dragController.signal },
    );
  }

  get panelOpsTemplate() {
    return this.hidePanelOps
      ? ``
      : html`
          <hax-tray-button
            large
            voice-command="edit page"
            .data-opened="${this.editMode}"
            @click="${this._clickEditButton}"
            icon="create"
            id="button"
            feature
            show-text-label
            show-tooltip
            label="${this.editMode ? this.t.save : this.t.edit}"
          ></hax-tray-button>
        `;
  }
  get toolbarsTemplate() {
    return html`${this.opsToolbarTemplate}${this.trayToolbarTemplate}`;
  }
  get menuToolbarTemplate() {
    return html` <div id="menubar" class="collapse-menu">
      ${this.saveButtons} ${this.doButtons} ${this.contentButtons}
      <slot name="tray-buttons-pre"></slot>
      ${this.moreButtons}
    </div>`;
  }
  get menuButtons() {
    return html`
      <hax-tray-button
        show-tooltip
        align-horizontal="${this.collapsed ? "left" : "center"}"
        id="haxMenuAlign"
        event-name="toggle-element-align"
        icon="arrow-${this.elementAlign === "left" ? "forward" : "back"}"
        label="${
          this.elementAlign == "left" ? this.t.menuRight : this.t.menuLeft
        }"
        index="${this.elementAlign == "left" ? "1" : "0"}"
        tooltip="${this.t.move} ${
          this.elementAlign == "left" ? this.t.right : this.t.left
        }"
      >
      </hax-tray-button>
    `;
  }
  get saveButtons() {
    return this.hidePanelOps
      ? ``
      : html`
          <hax-tray-button
            @click="${this._clickSaveButton}"
            icon="save"
            icon-position="left"
            id="haxsavebutton"
            label="${this.editMode ? this.t.save : this.t.edit}"
            event-name="save"
            voice-command="save page"
            show-text-label
            show-tooltip
            align-horizontal="${this.collapsed ? "left" : "center"}"
          ></hax-tray-button>
          <hax-tray-button
            @click="${this._clickSaveAndEditButton}"
            icon="hax:page-edit"
            icon-position="left"
            id="haxsaveandeditbutton"
            label="${this.t.saveAndEdit}"
            event-name="save-and-edit"
            voice-command="save and edit page"
            show-text-label
            show-tooltip
            align-horizontal="${this.collapsed ? "left" : "center"}"
            ?hidden="${!this.editMode}"
          ></hax-tray-button>
          <hax-tray-button
            icon="cancel"
            id="haxcancelbutton"
            label="${this.t.cancel}"
            icon-position="left"
            show-text-label
            show-tooltip
            align-horizontal="${this.collapsed ? "left" : "center"}"
          ></hax-tray-button>
        `;
  }
  get doButtons() {
    return html` <hax-tray-button
        icon="icons:undo"
        ?disabled="${!this.canUndo}"
        label="${this.t.undo}"
        event-name="undo"
        voice-command="undo"
        icon-position="left"
        show-text-label
        show-tooltip
        align-horizontal="${this.collapsed ? "left" : "center"}"
      >
      </hax-tray-button>
      <hax-tray-button
        icon="icons:redo"
        ?disabled="${!this.canRedo}"
        label="${this.t.redo}"
        event-name="redo"
        voice-command="redo"
        icon-position="left"
        show-text-label
        show-tooltip
        align-horizontal="${this.collapsed ? "left" : "center"}"
      >
      </hax-tray-button>`;
  }
  get contentButtons() {
    return html` <hax-tray-button
        event-name="content-edit"
        icon="image:tune"
        id="content-edit"
        label="${this.t.edit}"
        ?disabled="${
          !this.activeTagName ||
          this.activeTagName == "" ||
          !this.activeNode ||
          !this.activeNode.tagName
        }"
        voice-command="(modify)(configure)(edit) selected"
        controls="tray-detail"
        tooltip="${this.t.edit} ${this.activeTagName}"
        toggles
        ?toggled="${!this.collapsed && this.trayDetail === "content-edit"}"
        icon-position="left"
        show-text-label
        show-tooltip
        align-horizontal="${this.collapsed ? "left" : "center"}"
      >
      </hax-tray-button>
      <hax-tray-button
        event-name="content-add"
        icon="hax:add-brick"
        id="content-add"
        label="${this.t.blocks}"
        voice-command="select blocks (menu)"
        controls="tray-detail"
        toggles
        ?toggled="${!this.collapsed && this.trayDetail === "content-add"}"
        icon-position="left"
        show-text-label
        show-tooltip
        align-horizontal="${this.collapsed ? "left" : "center"}"
      >
      </hax-tray-button>
      <hax-tray-button
        icon="hax:multimedia"
        label="${this.t.media}"
        voice-command="select media (menu)"
        controls="tray-detail"
        toggles
        icon-position="left"
        show-text-label
        show-tooltip
        align-horizontal="${this.collapsed ? "left" : "center"}"
        @click="${this._clickMediaButton}"
      >
      </hax-tray-button>
      <hax-tray-button
        event-name="content-map"
        icon="icons:toc"
        id="content-map"
        label="${this.t.structure}"
        voice-command="select structure (menu)"
        controls="tray-detail"
        toggles
        ?toggled="${!this.collapsed && this.trayDetail === "content-map"}"
        icon-position="left"
        show-text-label
        show-tooltip
        align-horizontal="${this.collapsed ? "left" : "center"}"
      >
      </hax-tray-button>`;
  }
  _clickMediaButton(_e) {
    SuperDaemonInstance.runProgram("");
    SuperDaemonInstance.open();
  }
  get moreButtons() {
    return html`<hax-tray-button
        id="exportbtn"
        icon="hax:html-code"
        label="${this.t.source}"
        event-name="view-source"
        voice-command="view (page) source"
        toggles
        ?toggled="${!this.collapsed && this.trayDetail === "view-source"}"
        icon-position="left"
        show-text-label
        show-tooltip
        align-horizontal="${this.collapsed ? "left" : "center"}"
      >
      </hax-tray-button>
      <hax-tray-button
        event-name="super-daemon"
        icon="hax:wand"
        label="${this.t.merlin}"
        voice-command="${this.t.merlin}"
        toggles
        ?toggled="${!this.collapsed}"
        icon-position="left"
        tooltip="${this.t.summonMerlin}"
        show-text-label
        show-tooltip
        align-horizontal="${this.collapsed ? "left" : "center"}"
      ></hax-tray-button> `;
  }
  get trayDetailTemplate() {
    const title = this.trayLabel || `${this.activeTagName}`;
    const lockPrefix = this.locked ? "🔒 " : "";
    return html` <div
      id="tray-detail"
      aria-live="polite"
      aria-disabled="${this.collapsed ? "true" : "false"}"
      tabindex="${this.collapsed ? "-1" : "0"}"
      selected-detail="${this.trayDetail}"
    >
      <h4 class="tray-detail-titlebar">
        <simple-icon-lite
          class="tray-detail-titlebar-icon"
          icon="${this.trayIcon}"
        ></simple-icon-lite>
        <div class="tray-detail-titlebar-label">
          ${title ? `${lockPrefix}${title}` : ""}
        </div>
        ${this.trayDetail === "view-source" ? this.sourceFormatSwitch : ""}
        <div class="tray-detail-titlebar-actions">${this.menuButtons}</div>
      </h4>
      ${this.viewSourceTemplate} ${this.contentMapTemplate}
      ${this.contentEditTemplate} ${this.contentAddTemplate}
    </div>`;
  }
  get viewSourceTemplate() {
    return html` <hax-view-source
      id="view-source"
      ?hidden="${this.trayDetail !== "view-source"}"
      ?tray-active="${
        this.trayDetail === "view-source" && !this.collapsed && this.editMode
      }"
      @source-format-changed="${this._sourceFormatChanged}"
    ></hax-view-source>`;
  }
  /**
   * HTML / Markdown switch for Source, in the panel title bar
   */
  get sourceFormatSwitch() {
    const md = this.viewSourceFormat === "markdown";
    return html`<div
      class="source-format"
      role="group"
      aria-label="${this.t.sourceFormat}"
    >
      <button
        type="button"
        aria-pressed="${!md}"
        @click="${() => this._setSourceFormat("html")}"
      >
        ${this.t.html}
      </button>
      <button
        type="button"
        aria-pressed="${md}"
        @click="${() => this._setSourceFormat("markdown")}"
      >
        ${this.t.markdown}
      </button>
    </div>`;
  }
  _setSourceFormat(format) {
    const source = this.shadowRoot.querySelector("#view-source");
    if (source) {
      source.setFormat(format);
    }
  }
  _sourceFormatChanged(e) {
    this.viewSourceFormat = e.detail.value;
  }
  get contentEditTemplate() {
    return html` <simple-fields
      id="settingsform"
      class="hax-ui-side-panel"
      ?dark="${this.haxUiTheme == "haxdark"}"
      disable-responsive
      code-theme="${
        this.haxUiTheme == "system"
          ? "auto"
          : this.haxUiTheme == "haxdark"
            ? "vs-dark"
            : "vs"
      }"
      ?hidden="${this.trayDetail !== "content-edit"}"
    ></simple-fields>`;
  }
  get contentAddTemplate() {
    let hidden = this.trayDetail !== "content-add";
    const hasTemplates =
      HAXStore.platformAllows("pageTemplates") ||
      HAXStore.platformAllows("blockTemplates");
    // without templates there is nothing to switch to
    const view = hasTemplates ? this.addView : "blocks";
    return html`<div class="block-add-wrapper">
      ${
        hasTemplates
          ? html`<div class="add-switch ${view}" ?hidden="${hidden}">
              <div class="add-switch-group" role="group">
                <button
                  type="button"
                  aria-pressed="${view === "blocks" ? "true" : "false"}"
                  @click="${() => (this.addView = "blocks")}"
                >
                  ${this.t.blocks}
                </button>
                <button
                  type="button"
                  aria-pressed="${view === "templates" ? "true" : "false"}"
                  @click="${() => (this.addView = "templates")}"
                >
                  ${this.t.templates}
                </button>
              </div>
            </div>`
          : ""
      }
      ${
        HAXStore.platformAllows("pageTemplates")
          ? html`<hax-stax-browser
              id="pagesbrowser"
              ?hidden="${hidden || view !== "templates"}"
              label="${this.t.pages}"
              template-type="page"
            ></hax-stax-browser>`
          : ""
      }
      ${
        HAXStore.platformAllows("blockTemplates")
          ? html`<hax-stax-browser
              id="staxbrowser"
              ?hidden="${hidden || view !== "templates"}"
              label="${this.t.templates}"
              template-type="area"
            ></hax-stax-browser>`
          : ""
      }
      <hax-gizmo-browser
        id="gizmobrowser"
        ?hidden="${hidden || view !== "blocks"}"
      >
        <hax-tray-upload
          slot="after-filter"
          ?hidden="${hidden || !HAXStore.platformAllows("uploadMedia")}"
          show-sources
        ></hax-tray-upload>
      </hax-gizmo-browser>
      <hax-app-search ?hidden="${hidden}" id="haxappsearch"></hax-app-search>
    </div>`;
  }
  get contentMapTemplate() {
    return html`<hax-map
      controls="content-map"
      ?hidden="${this.trayDetail !== "content-map"}"
    ></hax-map>`;
  }

  _refreshAddData() {
    this.shadowRoot
      .querySelector("#gizmobrowser")
      .resetList(toJS(HAXStore.gizmoList));
    const staxList = toJS(HAXStore.staxList);
    if (HAXStore.platformAllows("blockTemplates")) {
      this.shadowRoot.querySelector("#staxbrowser").staxList = [...staxList];
    }
    if (HAXStore.platformAllows("pageTemplates")) {
      this.shadowRoot.querySelector("#pagesbrowser").staxList = [...staxList];
    }
  }
  /**
   * Process event for simple content inserts.
   */
  _processTrayEvent(e) {
    let target = normalizeEventPath(e)[0],
      evt = e.detail.eventName;
    // allow buttons to toggle collapse if desired by user
    if (
      target.tagName === "HAX-TRAY-BUTTON" &&
      e.detail.eventName === this.trayDetail
    ) {
      this.collapsed = !this.collapsed;
    } else {
      this.collapsed = false;
    }
    // support a simple insert event to bubble up or everything else
    switch (evt) {
      case "insert-stax":
        this.dispatchEvent(
          new CustomEvent("hax-insert-content-array", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: target.stax,
          }),
        );
        break;
      case "insert-tag": {
        let gizmo = {
          tag: e.detail.value,
        };
        let haxElement;
        // get schema for that version of events
        let schema = HAXStore.haxSchemaFromTag(e.detail.value);

        HAXStore.recentGizmoList.push(schema.gizmo);
        if (
          (target.getAttribute("data-demo-schema") || e.detail.demoSchema) &&
          schema &&
          schema.demoSchema &&
          schema.demoSchema[0]
        ) {
          haxElement = schema.demoSchema[0];
        } else {
          // support if anything else is manually defining what to inject
          // or a baseline if we didn't have a demonstration schema supplied
          let properties = JSON.parse(target.getAttribute("event-properties"));
          let innerContent = target.getAttribute("event-content");
          // allow event to have supplied this
          if (e.detail.properties) {
            properties = e.detail.properties;
          }
          if (properties == null) {
            properties = {};
          }
          if (e.detail.content) {
            innerContent = e.detail.content;
          }
          if (innerContent == null) {
            innerContent = "";
          }
          // most likely empty values but just to be safe
          haxElement = HAXStore.haxElementPrototype(
            gizmo,
            properties,
            innerContent,
          );
        }
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: haxElement,
          }),
        );
        break;
      }
      case "toggle-element-align": {
        let directions = ["left", "right"],
          direction = directions[e.detail.index]
            ? directions[e.detail.index]
            : "left";
        HAXStore.elementAlign = direction;
        //set local storage
        localStorageSet("hax-tray-elementAlign", direction);
        break;
      }
      case "super-daemon":
        SuperDaemonInstance.open();
        this.collapsed = false;
        break;
      case "content-map":
        this.trayDetail = e.detail.eventName;
        break;
      case "content-edit":
        this.trayDetail = e.detail.eventName;
        break;
      case "content-add":
        this.trayDetail = e.detail.eventName;
        break;
      case "undo":
        HAXStore.activeHaxBody.undo();
        break;
      case "redo":
        HAXStore.activeHaxBody.redo();
        break;
      case "view-source":
        this.trayDetail = e.detail.eventName;
        this.shadowRoot.querySelector("#view-source").openSource();
        this.collapsed = false;
        break;
    }
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      offsetMargin: {
        type: String,
        attribute: "offset-margin",
      },
      trayIcon: {
        type: String,
      },
      resizeDrag: {
        type: Boolean,
        attribute: "resize-drag",
        reflect: true,
      },
      collapsed: {
        type: Boolean,
        reflect: true,
      },
      traySizeIcon: {
        type: String,
      },
      /**
       * Form values for active node
       */
      activeValue: {
        type: Object,
      },
      /**
       * Form schema for active node
       */
      activeSchema: {
        type: Array,
      },
      /**
       * Alignment of the initial edit button
       */
      elementAlign: {
        type: String,
        reflect: true,
        attribute: "element-align",
      },
      /**
       * Light variant for save button
       */
      light: {
        type: Boolean,
        reflect: true,
      },
      /**
       * If we can currently undo based on stack position
       */
      canUndo: {
        type: Boolean,
        attribute: "can-undo",
      },
      /**
       * If we can currently redo based on stack position
       */
      canRedo: {
        type: Boolean,
        attribute: "can-redo",
      },
      haxUiTheme: {
        type: String,
      },
      /**
       * Showing button area at all a well as internal
       * state managing buttons like cancel and save
       */
      hidePanelOps: {
        type: Boolean,
        reflect: true,
        attribute: "hide-panel-ops",
      },
      /**
       * Ability to hide entire toolbar
       */
      hideToolbar: {
        type: Boolean,
        reflect: true,
        attribute: "hide-toolbar",
      },
      /**
       * Global preferences for HAX overall
       */
      globalPreferences: {
        type: Object,
      },
      /**
       * Global active node so we know if we need to disable contextual settings
       */
      activeNode: {
        type: Object,
      },
      /**
       * Element name / what to display based on active element
       */
      activeTagName: {
        type: String,
      },
      activeGizmo: {
        type: Object,
      },
      locked: {
        type: Boolean,
      },
      /**
       * State of the panel
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      /**
       * id of toggled section in tray
       */
      trayDetail: {
        type: String,
        reflect: true,
        attribute: "tray-detail",
      },
      /**
       * What the add panel browses: "blocks" or "templates"
       */
      addView: {
        type: String,
        attribute: "add-view",
      },
      /**
       * heading of toggled section in tray
       */
      trayLabel: {
        type: String,
      },
      /**
       * Format Source is in (html or markdown), mirrored from hax-view-source
       */
      viewSourceFormat: {
        type: String,
        reflect: true,
        attribute: "view-source-format",
      },
    };
  }
  /**
   * LitElement ready life cycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (!this.__setup) {
      const source = this.shadowRoot.querySelector("#view-source");
      if (source) {
        this.viewSourceFormat = source.sourceFormat;
      }
      this.shadowRoot.querySelector("#settingsform").schematizer =
        HaxSchematizer;
      this.shadowRoot.querySelector("#settingsform").elementizer =
        HaxElementizer;
      setTimeout(() => {
        this.shadowRoot.querySelector(".wrapper").style.margin =
          this.offsetMargin;
      }, 1000);
      this.__setup = true;
      this.shadowRoot
        .querySelector("#settingsform")
        .addEventListener("value-changed", this.__valueChangedEvent.bind(this));
      // simple-fields builds the groups (Configure, Advanced, Developer);
      // give each the HAX UI admin chevron once the form is built
      this.shadowRoot
        .querySelector("#settingsform")
        .addEventListener("fields-ready", this._haxUiSettingsForm.bind(this));
      // fire an event that this is a core piece of the system
      this.dispatchEvent(
        new CustomEvent("hax-register-core-piece", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            piece: "haxTray",
            object: this,
          },
        }),
      );
    }
  }
  /**
   * LitElement willUpdate — derive reactive state before render so it
   * batches into the current update cycle. Setting activeTagName,
   * trayDetail, trayIcon, and trayLabel in updated() scheduled redundant
   * second updates (Lit change-in-update warning).
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // active Gizmo changed -> activeTagName + trayDetail
    if (
      changedProperties.has("activeGizmo") &&
      this.trayDetail !== "view-source"
    ) {
      const oldValue = changedProperties.get("activeGizmo");
      if (this.activeGizmo) {
        this.activeTagName = this.activeGizmo.title;
        // Structure stays open while blocks get selected from it (or the
        // active block is put back after the content is exported, as on
        // save and View source); anywhere else, a block selected from
        // nothing opens Configure
        if (
          (!oldValue && this.trayDetail !== "content-map") ||
          !["content-map", "content-edit", "content-add"].includes(
            this.trayDetail,
          )
        ) {
          this.trayDetail = "content-edit";
        }
      } else {
        // force a gizmo change (which then implies adding to the page)
        // to select the edit tab if we just added something into the page
        // from our two content adding panes
        if (!["content-add", "content-map"].includes(this.trayDetail)) {
          this.trayDetail = "content-add";
        }
      }
    }
    // trayDetail -> trayIcon + trayLabel (pure mapping)
    if (
      changedProperties.has("trayDetail") ||
      changedProperties.has("viewSourceFormat")
    ) {
      const v = this.trayDetail;
      if (v == "content-add") {
        this.trayIcon = "hax:add-brick";
        this.trayLabel = this.t.blocks;
      } else if (v == "content-map") {
        this.trayIcon = "editor:format-line-spacing";
        this.trayLabel = this.t.structure;
      } else if (v == "view-source") {
        const md = this.viewSourceFormat === "markdown";
        this.trayIcon = md ? "hax:markdown" : "hax:html-code";
        this.trayLabel = md ? this.t.markdownSource : this.t.htmlSource;
      } else if (v == "content-edit") {
        this.trayIcon = "image:tune";
        this.trayLabel = null;
      } else if (!v || v == "") {
        this.trayIcon = "image:tune";
      } else {
        this.trayIcon = "image:tune";
        this.trayLabel = null;
      }
    }
  }
  /**
   * LitElement properties changed
   */
  async updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach(async (oldValue, propName) => {
      if (propName == "editMode") {
        if (this.editMode) {
          await HAXStore.refreshActiveNodeForm();
        }
        this._editModeChanged(this.editMode);
      }
      if (propName == "offsetMargin") {
        setTimeout(() => {
          this.shadowRoot.querySelector(".wrapper").style.margin =
            this.offsetMargin;
        }, 0);
      }
      // change tray detail (DOM + edge-case handling only; trayIcon /
      // trayLabel derivation lives in willUpdate)
      if (propName == "trayDetail") {
        this._applyTrayDetailDom(this[propName]);
      }
      // collaped menu state change
      if (propName == "collapsed" && this[propName]) {
        this._editModeChanged(this.editMode);
      }
      // active node changed
      if (propName == "activeNode") {
        if (this.activeNode && this.activeNode.tagName) {
          if (this.editMode) {
            await HAXStore.refreshActiveNodeForm();
          }
        }
      }
    });
  }
  /**
   * When the preview node is updated, pull schema associated with it
   */
  async _setupForm() {
    let activeNode = this.activeNode;
    this.locked = this._isNodeLocked(activeNode);
    this._initial = true;
    this.activeValue = {
      settings: {
        configure: {},
        advanced: {},
        developer: {},
      },
    };
    // see if we can get schema off of this.
    if (
      activeNode &&
      activeNode.tagName &&
      HAXStore.elementList[activeNode.tagName.toLowerCase()]
    ) {
      let props = { ...HAXStore.elementList[activeNode.tagName.toLowerCase()] };
      // Normalize the three settings containers to arrays. Some HAX schemas
      // only declare a subset of configure/advanced/developer (e.g. figure,
      // figcaption, iframe, p, table, hr, webview) and can reach the tray via
      // paths that skip setHaxProperties normalization. Without this guard the
      // iteration below throws "Cannot read properties of undefined (reading
      // 'forEach')". Default missing containers to [] and build a new settings
      // object so the shared elementList entry is not mutated.
      if (!props.settings) {
        props.settings = {};
      }
      props.settings = {
        ...props.settings,
        configure: props.settings.configure || [],
        advanced: props.settings.advanced || [],
        developer: props.settings.developer || [],
      };
      // generate a human name for this
      if (typeof props.gizmo.title === typeof undefined) {
        this.humanName = activeNode.tagName.replace("-", " ").toLowerCase();
      } else {
        this.humanName = props.gizmo.title;
      }

      // Adaptive link content field: when an <a> wraps HTML (e.g. an image
      // brought in via content migration), edit its content as HTML through a
      // code editor so nested markup is preserved instead of being destroyed.
      // Text-only links keep the default innerText textfield (no change).
      if (
        activeNode.tagName.toLowerCase() === "a" &&
        this.activeHaxElement &&
        this.activeHaxElement.properties &&
        this.activeHaxElement.properties.__htmlContent
      ) {
        props.settings.configure = (props.settings.configure || []).map(
          (field) => {
            if (field.attribute === "innerText") {
              return {
                ...field,
                attribute: "innerHTML",
                title: this.t.content,
                description: this.t.linkHtmlContentDescription,
                inputMethod: "code-editor",
                required: false,
              };
            }
            return field;
          },
        );
      }
      // first, allow element properties to dictate defaults
      for (let property in this.activeHaxElement.properties) {
        // step through the 3 keys we have so we write less code
        Object.keys(props.settings).forEach((propContainer) => {
          // see if this container has settings that match a prop name
          // so that we can set the default value at the correct location
          // this is effectively converting a flat html data object in the page
          // into the hierarchy matching the SimpleFieldsSchema of the form structure
          // keys and depth have to match for SimpleFields to pick up the right value
          // then we flatten it back into HTML on @value-change __valueChangedEvent
          props.settings[propContainer].forEach((el, i) => {
            // see if we match on prop name, attr, or slot, falling back to collapse
            if (
              [
                "contenteditable",
                "data-hax-active",
                "data-hax-grid",
                "data-hax-layout",
              ].includes(property)
            ) {
              // no need to dig for these bc they are part of HAX / web platform operations
            } else if (el.property === property) {
              this.activeValue.settings[propContainer][property] =
                this.activeHaxElement.properties[property];
            } else if (el.attribute === property) {
              this.activeValue.settings[propContainer][property] =
                this.activeHaxElement.properties[property];
            } else if (el.slot === property) {
              this.activeValue.settings[propContainer][property] =
                this.activeHaxElement.properties[property];
            }
            // if that didn't work, look for a collapse because that means
            // visually we are nesting data however the data needs to recall flat
            // this will not impact Array based data as that is structural and visual
            else if (
              el.inputMethod === "collapse" &&
              props.settings[propContainer][i].properties
            ) {
              // we are a collapse
              props.settings[propContainer][i].properties.forEach(
                (collapseContainer, collapseIndex) => {
                  // sanity check that they put props under a collapse container w/ a label
                  if (collapseContainer.title && collapseContainer.properties) {
                    props.settings[propContainer][i].properties[
                      collapseIndex
                    ].properties.forEach((nested) => {
                      if (nested.property === property) {
                        // ensure nesting if 1st value here
                        if (
                          !this.activeValue.settings[propContainer][el.property]
                        ) {
                          this.activeValue.settings[propContainer][
                            el.property
                          ] = {};
                        }
                        // ensure nesting if 1st value under this container
                        if (
                          !this.activeValue.settings[propContainer][
                            el.property
                          ][collapseContainer.property]
                        ) {
                          this.activeValue.settings[propContainer][el.property][
                            collapseContainer.property
                          ] = {};
                        }
                        this.activeValue.settings[propContainer][el.property][
                          collapseContainer.property
                        ][property] =
                          this.activeHaxElement.properties[property];
                      }
                      if (nested.attribute === property) {
                        // ensure nesting if 1st value here
                        if (
                          !this.activeValue.settings[propContainer][el.property]
                        ) {
                          this.activeValue.settings[propContainer][
                            el.property
                          ] = {};
                        }
                        // ensure nesting if 1st value under this container
                        if (
                          !this.activeValue.settings[propContainer][
                            el.property
                          ][collapseContainer.property]
                        ) {
                          this.activeValue.settings[propContainer][el.property][
                            collapseContainer.property
                          ] = {};
                        }
                        this.activeValue.settings[propContainer][el.property][
                          collapseContainer.property
                        ][property] =
                          this.activeHaxElement.properties[property];
                      }
                    });
                  }
                },
              );
            } else {
              // not a problem but worth debugging possibly
              //console.warn(`${property} no match on a value under ${propContainer}, but is in HTML`);
            }
          });
        });
      }
      // now we need to parse through for slotted items
      // build a fake tree, then walk the configuration / Settings
      // looking for slot types
      let tmp = globalThis.document.createElement("div");
      // security: parse a sanitized copy, this is a live element
      tmp.innerHTML = sanitizeHTMLString(this.activeHaxElement.content);
      // step through each key
      tmp.childNodes.forEach((el) => {
        // ensure we have a dom node and it isnt empty
        if (el.nodeType === 1 && el.innerHTML !== typeof undefined) {
          // walk props looking for a match
          props.settings.configure.forEach((prop) => {
            // if we have a slot to match in the property AND it matches the attr
            if (prop.slot === el.getAttribute("slot")) {
              this.activeValue.settings.configure[prop.slot] = el.innerHTML;
            }
            // no slot and it didnt match so it has no slot
            else if (
              prop.slot == "" &&
              (el.getAttribute("slot") == null ||
                el.getAttribute("slot") === "null")
            ) {
              this.activeValue.settings.configure[prop.slot] = el.innerHTML;
            }
          });
          // now advanced
          props.settings.advanced.forEach((prop) => {
            if (prop.slot === el.getAttribute("slot")) {
              this.activeValue.settings.advanced[prop.slot] = el.innerHTML;
            }
            // no slot and it didnt match so it has no slot
            else if (
              prop.slot == "" &&
              (el.getAttribute("slot") == null ||
                el.getAttribute("slot") === "null")
            ) {
              this.activeValue.settings.advanced[prop.slot] = el.innerHTML;
            }
          });
          // now developer
          props.settings.developer.forEach((prop) => {
            if (prop.slot === el.getAttribute("slot")) {
              this.activeValue.settings.developer[prop.slot] = el.innerHTML;
            }
            // no slot and it didnt match so it has no slot
            else if (
              prop.slot == "" &&
              (el.getAttribute("slot") == null ||
                el.getAttribute("slot") === "null")
            ) {
              this.activeValue.settings.developer[prop.slot] = el.innerHTML;
            }
          });
        }
      });
      // tabs / deep objects require us to preview the value w/ the path correctly
      let isGrid = !!props.type && props.type === "grid";
      props.settings.configure.forEach((val, key) => {
        if (props.settings.configure[key].attribute) {
          props.settings.configure[key].property =
            props.settings.configure[key].attribute;
        }
        if (props.settings.configure[key].slot) {
          props.settings.configure[key].property =
            props.settings.configure[key].slot;
        }
      });
      props.settings.advanced.forEach((val, key) => {
        if (props.settings.advanced[key].attribute) {
          props.settings.advanced[key].property =
            props.settings.advanced[key].attribute;
        }
        if (props.settings.advanced[key].slot) {
          props.settings.advanced[key].property =
            props.settings.advanced[key].slot;
        }
      });
      props.settings.developer.forEach((val, key) => {
        if (props.settings.developer[key].attribute) {
          props.settings.developer[key].property =
            props.settings.developer[key].attribute;
        }
        if (props.settings.developer[key].slot) {
          props.settings.developer[key].property =
            props.settings.developer[key].slot;
        }
      });

      // establish tabs container
      this.activeSchema = [
        {
          property: "settings",
          inputMethod: "collapse",
          properties: [],
        },
      ];
      // array of things to forcibly disable
      let setProps = (propName, propTitle, settings = []) => {
        let filteredProps = !isGrid
          ? settings
          : settings.filter(
              (prop) =>
                prop.slot !== "" &&
                !prop.slot &&
                (!prop.attribute || prop.attribute != "slot"),
            );
        const isLocked = this.locked;
        const shouldAutoExpandConfigure =
          !isLocked &&
          propName === "configure" &&
          (isGrid || !HAXStore.isTextElement(activeNode));
        // If the menu is advanced or developer, check the current platform audience. Else default to visible.
        const isExpertSetting =
          propName === "advanced" || propName === "developer"
            ? !HAXStore.isPlatformAudience("expert")
            : false;
        this.activeSchema[0].properties.push({
          property: propName,
          title: propTitle,
          properties: filteredProps.length > 0 ? filteredProps : undefined,
          disabled: isLocked || filteredProps.length < 1,
          hidden: isExpertSetting || isLocked || filteredProps.length < 1,
          // we only auto expand (and hence auto focus) active nodes if they are NOT text based
          // grid plates are the exception to the rule here
          expanded: shouldAutoExpandConfigure,
          accordion: true,
        });
      };
      // @see haxHook: setupActiveElementForm - allow elements to modify the properties to be rendered
      if (HAXStore.testHook(activeNode, "setupActiveElementForm")) {
        await HAXStore.runHook(activeNode, "setupActiveElementForm", [props]);
      }
      // see if we have any configure settings or disable
      setProps("configure", this.t.configure, props.settings.configure);
      // see if we have any configure settings or disable
      setProps("advanced", this.t.advanced, props.settings.advanced);
      // see if we have any configure settings or disable
      setProps("developer", this.t.developer, props.settings.developer);
      this.__activePropSchema = props;
      this.shadowRoot.querySelector("#settingsform").fields = [];
      this.shadowRoot.querySelector("#settingsform").value = {};
      this.shadowRoot.querySelector("#settingsform").fields = this.activeSchema;
      this.shadowRoot.querySelector("#settingsform").value = this.activeValue;
      if (this.locked) {
        setTimeout(() => {
          this.__lockAllSettings(true);
        }, 0);
      }
    }
  }
  _isNodeLocked(node) {
    if (!node || !node.getAttribute) {
      return false;
    }
    if (node.getAttribute("data-hax-lock") != null) {
      return true;
    }
    if (
      node.parentNode &&
      node.parentNode.getAttribute &&
      node.parentNode.getAttribute("data-hax-lock") != null
    ) {
      return true;
    }
    return false;
  }
  /**
   * update hax map
   */
  updateMap() {
    if (
      this.shadowRoot &&
      this.shadowRoot.querySelector("hax-map") &&
      this.trayDetail == "content-map"
    )
      this.shadowRoot.querySelector("hax-map").updateHAXMap();
  }
  _updateTrayDetail(newValue) {
    // trayIcon / trayLabel derivation lives in willUpdate; this wrapper is
    // kept for the i18n updateCallback path (invoked outside the update
    // cycle when translations load, where requestUpdate is safe). It
    // performs the DOM/edge-case work and then forces a re-render so the
    // newly loaded t.* strings repaint.
    this._applyTrayDetailDom(newValue);
    this.requestUpdate();
  }
  /**
   * DOM + edge-case work for a trayDetail change. Safe to call from
   * updated() because it does NOT set trayIcon/trayLabel (those are
   * derived in willUpdate) and does NOT call requestUpdate. The only
   * reactive sets here are the rare content-edit-with-no-active-node and
   * empty-trayDetail normalizations, which are edge cases.
   */
  _applyTrayDetailDom(newValue) {
    if (
      newValue &&
      this.shadowRoot &&
      this.shadowRoot.querySelector(".detail")
    ) {
      globalThis.document.body.style.setProperty(
        "--hax-tray-element-custom-width",
        null,
      );
      this.shadowRoot.querySelector(".detail").style.height = "";
    }
    if (newValue == "content-add") {
      this._refreshAddData();
    } else if (newValue == "content-map") {
      this.shadowRoot.querySelector("hax-map").updateHAXMap();
    } else if (
      newValue == "content-edit" &&
      (!this.activeTagName ||
        this.activeTagName == "" ||
        !this.activeNode ||
        !this.activeNode.tagName)
    ) {
      if (!HAXStore.platformAllows("addBlock")) {
        try {
          // if adding blocks is disabled, try to find a valid activeNode
          // and stay in the edit menu
          const activeHaxBody = HAXStore && HAXStore.activeHaxBody;
          HAXStore.activeNode = Array.from(activeHaxBody.children).find(
            (child) => {
              const tag = child.tagName.toLowerCase();
              return (
                HAXStore.platformAllows(tag) ||
                HAXStore.requiredPrimitives.has(tag)
              );
            },
          );
          this.collapsed = false;
        } catch {
          // collapse as a fallback if there are no valid nodes
          this.collapsed = true;
        }
      } else {
        this.trayDetail = "content-add";
      }
    } else if (!newValue || newValue == "") {
      this.trayDetail = "content-edit";
    }
  }

  // this helper ensures that objcets are not deeply nested, while avoiding smashing together array based data
  flattenObject = (obj) => {
    return Object.assign(
      {},
      ...(function _flatten(o) {
        if (o) {
          return [].concat(
            ...Object.keys(o).map((k) =>
              typeof o[k] === "object" && !Array.isArray(o[k])
                ? _flatten(o[k])
                : { [k]: o[k] },
            ),
          );
        }
        return o;
      })(obj),
    );
  };
  /**
   * Notice change in values from below
   */
  __valueChangedEvent(e) {
    if (this.editMode && e.detail.value && e.detail.value.settings) {
      // ensure it's a clone of an object
      let settings = { ...e.detail.value.settings };
      let props = {
        ...HAXStore.elementList[this.activeNode.tagName.toLowerCase()],
      };
      let isGrid = props.type == "grid";
      let settingsKeys = {
        configure: "configure",
        advanced: "advanced",
        developer: "developer",
      };
      // support flattening empty keys
      for (let key in settingsKeys) {
        // loop count (one pass per child key) is intentional: each pass
        // flattens one more level of nesting
        // eslint-disable-next-line no-unused-vars
        for (let prop in settings[key]) {
          // if we get an empty key, we need to flatten the values
          // we are writing to HTML in the end and not some infinitely nested object
          // this means we are NOT assigning a name to the collapse, by design.
          // collapse also has 2 levels of nesting, so if we're putting values under it we need to assume they are in a similarly unnamed container
          // for the time being
          // this will only support a single collapse hiding a whole bunch of values
          settings[key] = this.flattenObject(settings[key]);
        }
      }
      let setAhead;
      clearTimeout(this.__contextPropDebounce);
      this.__contextPropDebounce = setTimeout(() => {
        for (let key in settingsKeys) {
          for (let prop in settings[key]) {
            setAhead = false;
            if (settings[key][prop] != null && !settings[key][prop].readOnly) {
              const dashProp = camelToDash(prop);
              if (
                typeof settings[key][prop] === "string" &&
                isURLAttribute(dashProp)
              ) {
                if (/(^|[-_:])(src|source)$/.test(dashProp)) {
                  settings[key][prop] = sanitizeEmbeddableURL(
                    settings[key][prop],
                    "",
                  );
                } else {
                  settings[key][prop] = sanitizeURLValue(
                    settings[key][prop],
                    "",
                  );
                }
              }
              // prefix is a special attribute and must be handled this way
              if (prop === "prefix" && settings[key][prop] != "") {
                this.activeNode.setAttribute("prefix", settings[key][prop]);
                setAhead = true;
              }
              // prefix is a special attribute and must be handled this way
              else if (prop === "data-hax-lock") {
                this.locked = !!settings[key][prop];
                // broadcast that we just LOCKED it
                this.dispatchEvent(
                  new CustomEvent("hax-toggle-active-node-lock", {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    detail: {
                      lock: this.locked,
                      node: this.activeNode,
                    },
                  }),
                );
                // also lock all fields except us
                this.__lockAllSettings(this.locked);
                this.requestUpdate();
              }
              // innerText is another special case since it cheats on slot content
              // that is only a text node (like a link)
              else if (prop === "innerText") {
                this.activeNode.innerText = settings[key][prop];
                setAhead = true;
              }
              // innerHTML is the HTML-wrapping link case (content migrations):
              // write as HTML so nested elements survive instead of being
              // coerced into a text node the way innerText would.
              else if (prop === "innerHTML") {
                // security: form value is author-typed HTML, sanitize it
                this.activeNode.innerHTML = sanitizeHTMLString(
                  settings[key][prop],
                );
                setAhead = true;
              }
              // try and set the pop directly if it is a prop already set
              // check on prototype, then in properties object if it has one
              // then by seeing if we have an array / object
              else if (
                Object.prototype.hasOwnProperty.call(this.activeNode, prop) ||
                (this.activeNode.properties &&
                  Object.prototype.hasOwnProperty.call(
                    this.activeNode.properties,
                    prop,
                  )) ||
                (settings[key][prop] != null &&
                  settings[key][prop].constructor === Array) ||
                (settings[key][prop] != null &&
                  settings[key][prop].constructor === Object)
              ) {
                // in case your typing quickly don't instantly hammer a prop
                try {
                  if (settings[key][prop].constructor === Array) {
                    this.activeNode[prop] = [...settings[key][prop]];
                  } else if (settings[key][prop].constructor === Object) {
                    this.activeNode[prop] = { ...settings[key][prop] };
                  } else {
                    this.activeNode[prop] = settings[key][prop];
                  }
                  setAhead = true;
                } catch (e) {
                  console.warn(e);
                  setAhead = false;
                }
              } else if (!isGrid) {
                // need to specifically walk through slots if there is anything
                // that says it has to come from a slot
                for (let propTmp in this.__activePropSchema.settings[key]) {
                  if (
                    this.__activePropSchema.settings[key][propTmp].slot == prop
                  ) {
                    let slotTag = "span";
                    if (
                      this.__activePropSchema.settings[key][propTmp].slotWrapper
                    ) {
                      slotTag =
                        this.__activePropSchema.settings[key][propTmp]
                          .slotWrapper;
                    } else if (
                      //selects first wrapper from allowed list
                      this.__activePropSchema.settings[key][propTmp]
                        .allowedSlotWrappers &&
                      this.__activePropSchema.settings[key][propTmp]
                        .allowedSlotWrappers[0]
                    ) {
                      slotTag =
                        this.__activePropSchema.settings[key][propTmp]
                          .allowedSlotWrappers[0];
                    } else if (
                      this.activeNode.tagName.toLowerCase() === "code-editor"
                    ) {
                      slotTag = "template";
                    } else {
                      //selects wrapper that is not excluded
                      let wrappers = ["span", "div", "p"],
                        exclusions =
                          this.__activePropSchema.settings[key][propTmp]
                            .excludedSlotWrappers || [];
                      if (exclusions)
                        wrappers = wrappers.filter(
                          (wrapper) => !exclusions.includes(wrapper),
                        );
                    }
                    let tmpel = globalThis.document.createElement(slotTag);
                    if (
                      this.__activePropSchema.settings[key][propTmp]
                        .slotAttributes
                    ) {
                      for (let attr in this.__activePropSchema.settings[key][
                        propTmp
                      ].slotAttributes) {
                        tmpel.setAttribute(
                          attr,
                          this.__activePropSchema.settings[key][propTmp]
                            .slotAttributes[attr],
                        );
                      }
                    }
                    // support unnamed slots
                    if (
                      this.__activePropSchema.settings[key][propTmp].slot !== ""
                    ) {
                      tmpel.slot =
                        this.__activePropSchema.settings[key][propTmp].slot;
                    }
                    // security: slot values are author-typed HTML
                    tmpel.innerHTML = sanitizeHTMLString(settings[key][prop]);
                    const cloneIt = tmpel.cloneNode(true);
                    setAhead = true;
                    // inject the slotted content but use text nodes if this is a text element
                    if (HAXStore.isTextElement(this.activeNode)) {
                      this.activeNode.innerHTML = tmpel.innerHTML;
                    } else {
                      // wipe just the slot in question
                      wipeSlot(
                        this.activeNode,
                        this.__activePropSchema.settings[key][propTmp].slot,
                      );
                      this.activeNode.appendChild(cloneIt);
                    }
                  }
                }
              }
              // this will get reached often but tough to know if we had a slot
              if (!setAhead && camelToDash(prop) != "") {
                try {
                  // silly but this is the spec way to do a boolean
                  if (settings[key][prop] === true) {
                    this.activeNode.setAttribute(
                      camelToDash(prop),
                      camelToDash(prop),
                    );
                  } else if (
                    settings[key][prop] === false ||
                    settings[key][prop] === ""
                  ) {
                    this.activeNode.removeAttribute(camelToDash(prop));
                  } else {
                    this.activeNode.setAttribute(
                      camelToDash(prop),
                      settings[key][prop],
                    );
                  }
                } catch (e) {
                  console.warn(e);
                  console.warn(prop, settings[key][prop]);
                }
              }
            } else {
              if (prop === "data-hax-lock") {
                this.locked = false;
                // broadcast that we just UNLOCKED it
                this.dispatchEvent(
                  new CustomEvent("hax-toggle-active-node-lock", {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    detail: {
                      lock: this.locked,
                      node: this.activeNode,
                    },
                  }),
                );
                this.__lockAllSettings(false);
                this.requestUpdate();
              }
              this.activeNode.removeAttribute(camelToDash(prop));
            }
          }
        }
      }, 100);
    }
    setTimeout(() => {
      if (this._initial) {
        this._initial = false;
      }
    }, 51);
  }
  /**
   * Lock / unlock all settings on the tray for the active node form
   */
  __lockAllSettings(status) {
    this.shadowRoot
      .querySelectorAll(
        "simple-fields-tab *[is-simple-field-type]:not([name='settings.advanced.data-hax-lock'])",
      )
      .forEach((node) => {
        node.disabled = status;
      });
  }
  /**
   * _editModeChanged
   */
  _editModeChanged(newValue) {
    if (
      !this.hidePanelOps &&
      this.shadowRoot &&
      this.shadowRoot.querySelector("#button")
    ) {
      if (newValue) {
        this.shadowRoot.querySelector("#button").icon = "save";
      } else {
        this.shadowRoot.querySelector("#button").icon = "create";
      }
    }
    if (!newValue) {
      this.setAttribute("tabindex", "-1");
    } else {
      this.removeAttribute("tabindex");
    }
  }
  /**
   * Edit clicked, activate
   */
  _clickEditButton(_e) {
    HAXStore.editMode = true;
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }

  /**
   * Toggle the drawer when the button is clicked.
   */
  _clickSaveButton(e) {
    HAXStore.editMode = false;
    this.dispatchEvent(
      new CustomEvent("hax-save", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: e.detail,
      }),
    );
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }

  /**
   * Save and continue editing - save content but stay in edit mode
   */
  _clickSaveAndEditButton(e) {
    // Don't change edit mode - keep it as true
    this.dispatchEvent(
      new CustomEvent("hax-save", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          ...e.detail,
          keepEditMode: true,
        },
      }),
    );
    // Don't hide the modal - keep editing interface open
  }
}

globalThis.customElements.define(HaxTray.tag, HaxTray);
export { HaxTray };
