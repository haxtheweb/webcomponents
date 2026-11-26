/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import "./lib/h-a-x-dependencies.js";
import { localStorageGet } from "@haxtheweb/utils/utils.js";
import { editableTableDisplayStyles } from "@haxtheweb/editable-table/lib/editable-table-behaviors.js";
import { shadowSafeSheet } from "@haxtheweb/utils/lib/shadow-sheets.js";

/**
 * `h-a-x`
 * @element h-a-x
 * `Single tag to transform authoring`
 *
 * @microcopy - language worth noting:
 *  - HAX - Headless Authoring eXperience
 *  - Body - the editable area that can be worked on and gets saved as a string / blob
 *

 * @demo demo/index.html
 */
class HAX extends HTMLElement {
  // render function
  get html() {
    return `
    <style>
    ${editableTableDisplayStyles
      .map((s) =>
        s.cssText.replace(
          /:host(?!\()/g,
          ":host(:not([in-place])) hax-body table",
        ),
      )
      .join(" ")}

    :host,h-a-x {
      display: block;
    }

    :host([hidden]),h-a-x([hidden]) {
      display: none;
    }

    :host img, h-a-x img {
      max-width: 100%;
      max-width: -moz-available;
      max-width: -webkit-fill-available;
      max-width: fill-available;
    }

    /* in-place: this editor stands in for content the page renders itself
       (a HAXcms theme's content column), so the editable copy looks the way
       that content does. It inherits its type from the page instead of
       taking DDD's base type for hax-body, and tables in it do not get the
       editable-table display box above, which the published page does not
       have. Otherwise text and tables change size on entering edit mode and
       the content reflows. */
    :host([in-place]) hax-body {
      font-size: inherit;
      line-height: inherit;
      font-family: inherit;
      letter-spacing: inherit;
      text-align: inherit;
    }

    hax-body[edit-mode] page-break[data-hax-active],
    hax-body[edit-mode] [data-hax-active][contenteditable] {
      outline-offset: 8px;
      outline: var(--hax-body-active-outline, 2px solid var(--hax-ui-color-focus, #000)) !important;
      caret-color: var(--hax-ui-caret-color, auto);
    }
    </style>
    <hax-body>
        <slot></slot>
    </hax-body>`;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "h-a-x";
  }
  /**
   * HTMLElement
   */
  constructor(delayRender = false) {
    super();
    this.windowControllers = new AbortController();
    this.windowControllersLoaded = new AbortController();
    this.windowControllersReady = new AbortController();
    this.__rendered = false;
    this.__canAdoptConstructedStylesheets = null;
    // set tag for later use
    this.tag = HAX.tag;
    this.template = globalThis.document.createElement("template");
    this.attachShadow({ mode: "open" });
    // if we shouldn't delay rendering
    if (!delayRender) {
      this.render();
    }
    // setup events, only run them once and remove
    globalThis.addEventListener("hax-store-ready", this.storeReady.bind(this), {
      once: true,
      passive: true,
      signal: this.windowControllersReady.signal,
    });

    globalThis.addEventListener(
      "hax-store-app-store-loaded",
      this.appStoreReady.bind(this),
      {
        once: true,
        passive: true,
        signal: this.windowControllersLoaded.signal,
      },
    );
    // map events from tray
    globalThis.addEventListener("hax-cancel", this.cancelEvent.bind(this), {
      signal: this.windowControllers.signal,
    });
    globalThis.addEventListener("hax-save", this.saveEvent.bind(this), {
      signal: this.windowControllers.signal,
    });
  }
  __getHAXAdoptedSheets() {
    if (
      !globalThis.document ||
      !globalThis.document.adoptedStyleSheets ||
      !globalThis.document.adoptedStyleSheets.length
    ) {
      return [];
    }
    // these sheets were written for the document, where :host matches
    // nothing; adopt copies without it so (for one) DDD's ":root, :host"
    // token block does not set every token again on h-a-x and undo what the
    // page around the editor changed
    return Array.from(globalThis.document.adoptedStyleSheets)
      .filter((sheet) => sheet && sheet.hax)
      .map((sheet) => shadowSafeSheet(sheet));
  }
  __supportsShadowSheetAdoption() {
    if (typeof this.__canAdoptConstructedStylesheets === "boolean") {
      return this.__canAdoptConstructedStylesheets;
    }
    if (
      !this.shadowRoot ||
      !globalThis.Document ||
      !globalThis.ShadowRoot ||
      !globalThis.CSSStyleSheet
    ) {
      this.__canAdoptConstructedStylesheets = false;
      return this.__canAdoptConstructedStylesheets;
    }
    if (
      !(globalThis.Document.prototype instanceof Object) ||
      !(globalThis.ShadowRoot.prototype instanceof Object) ||
      !(globalThis.CSSStyleSheet.prototype instanceof Object) ||
      !(
        "adoptedStyleSheets" in globalThis.Document.prototype &&
        "adoptedStyleSheets" in globalThis.ShadowRoot.prototype &&
        "replaceSync" in globalThis.CSSStyleSheet.prototype
      )
    ) {
      this.__canAdoptConstructedStylesheets = false;
      return this.__canAdoptConstructedStylesheets;
    }
    try {
      const existingSheets = Array.from(
        this.shadowRoot.adoptedStyleSheets || [],
      );
      const testSheet = new globalThis.CSSStyleSheet();
      testSheet.replaceSync(":host{}");
      this.shadowRoot.adoptedStyleSheets = [...existingSheets, testSheet];
      this.shadowRoot.adoptedStyleSheets = existingSheets;
      this.__canAdoptConstructedStylesheets = true;
    } catch {
      this.__canAdoptConstructedStylesheets = false;
    }
    return this.__canAdoptConstructedStylesheets;
  }
  __sheetToCSSText(sheet) {
    if (!sheet) {
      return "";
    }
    try {
      if (!sheet.cssRules) {
        return "";
      }
      return Array.from(sheet.cssRules)
        .map((rule) => rule.cssText)
        .join("\n");
    } catch {
      return "";
    }
  }
  __applyHAXAdoptedStylesToShadowRoot() {
    if (!this.shadowRoot) {
      return;
    }
    const haxSheets = this.__getHAXAdoptedSheets();
    let fallbackStyle = this.shadowRoot.querySelector(
      "style[data-hax-sheet-fallback]",
    );
    if (haxSheets.length === 0) {
      if (fallbackStyle) {
        fallbackStyle.remove();
      }
      return;
    }
    let adopted = false;
    if (this.__supportsShadowSheetAdoption()) {
      try {
        // drop .hax sheets this root adopted earlier that the document no
        // longer has (a design system switched off), so the editor does not
        // keep styling content with a system the page dropped
        const previous = this.__haxAdoptedSheets || [];
        const existingSheets = Array.from(
          this.shadowRoot.adoptedStyleSheets || [],
        ).filter(
          (sheet) => !previous.includes(sheet) || haxSheets.includes(sheet),
        );
        const newSheets = haxSheets.filter(
          (sheet) => !existingSheets.includes(sheet),
        );
        if (
          newSheets.length > 0 ||
          existingSheets.length !== this.shadowRoot.adoptedStyleSheets.length
        ) {
          this.shadowRoot.adoptedStyleSheets = [
            ...existingSheets,
            ...newSheets,
          ];
        }
        this.__haxAdoptedSheets = haxSheets;
        adopted = haxSheets.every((sheet) =>
          this.shadowRoot.adoptedStyleSheets.includes(sheet),
        );
      } catch {
        adopted = false;
      }
    }
    if (adopted) {
      if (fallbackStyle) {
        fallbackStyle.remove();
      }
      return;
    }
    const fallbackCSSText = haxSheets
      .map((sheet) => this.__sheetToCSSText(sheet))
      .filter((text) => text)
      .join("\n");
    if (!fallbackCSSText) {
      return;
    }
    if (!fallbackStyle) {
      fallbackStyle = globalThis.document.createElement("style");
      fallbackStyle.setAttribute(
        "data-hax-sheet-fallback",
        "data-hax-sheet-fallback",
      );
    }
    fallbackStyle.textContent = fallbackCSSText;
    this.shadowRoot.appendChild(fallbackStyle);
  }
  __syncPageClasses() {
    const body = globalThis.document.body;
    const classes = body ? body.className.trim() : "";
    if (classes) {
      this.setAttribute("data-page-classes", classes);
    } else {
      this.removeAttribute("data-page-classes");
    }
  }
  /**
   * Adopt the document's .hax stylesheets (the design system and, in HAXcms,
   * the theme's edit mode content sheet) into this shadow root. Safe to call
   * again; sheets already adopted are kept once.
   */
  applyHAXStyles() {
    this.__applyHAXAdoptedStylesToShadowRoot();
  }
  cancelEvent(_e) {
    this.importSlotToHaxBody();
  }
  async saveEvent(e) {
    const body = await HAXStore.activeHaxBody.haxToContent();
    // eslint-disable-next-line haxtheweb-html/unsanitized-html-sink -- haxToContent is the editor's own serialization of content sanitized on the way in
    this.innerHTML = body;
    this.dispatchEvent(
      new CustomEvent("hax-save-body-value", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: body,
          keepEditMode: (e.detail && e.detail.keepEditMode) || false,
        },
      }),
    );
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.__applyHAXAdoptedStylesToShadowRoot();
    // the content being edited lives in this shadow root, out of sight of the
    // page's autoloader; have it load definitions here too, so a block shows
    // in the editor whether or not the page had loaded it yet
    if (
      globalThis.WCAutoload &&
      typeof globalThis.WCAutoload.requestAvailability === "function"
    ) {
      const loader = globalThis.WCAutoload.requestAvailability();
      if (loader && typeof loader.observeRoot === "function") {
        loader.observeRoot(this.shadowRoot);
      }
    }
    // page level rules keyed to body classes ("body.dark-mode a") are
    // adopted here as ':host([data-page-classes~="dark-mode"]) a' (see
    // utils/lib/shadow-sheets.js), so carry body's classes
    this.__syncPageClasses();
    if (!this.__pageClassObserver && globalThis.document.body) {
      this.__pageClassObserver = new MutationObserver(() =>
        this.__syncPageClasses(),
      );
    }
    if (this.__pageClassObserver) {
      this.__pageClassObserver.observe(globalThis.document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
    // this ensures it's only applied once
    if (!this.__HAXApplied && !globalThis.__HAXApplied) {
      globalThis.__HAXApplied = this.__HAXApplied = this.applyHAX();
    }
  }

  /**
   * Store is ready, now we can pass along the app store definition
   * which HAX will react to an load the data it finds.
   */
  storeReady(e) {
    if (e.detail) {
      setTimeout(() => {
        try {
          let appStore = {
            ...JSON.parse(this.getAttribute("app-store")),
          };
          if (typeof appStore === "object") {
            HAXStore.appStore = appStore;
          }
        } catch (e) {
          console.warn(e);
        }
        if (this.hidePanelOps === "hide-panel-ops") {
          this.hidePanelOps = true;
        }
        HAXStore.haxTray.hidePanelOps = this.hidePanelOps;
        if (this.hideToolbar === "hide-toolbar") {
          this.hideToolbar = true;
        }
        HAXStore.haxTray.hideToolbar = this.hideToolbar;
        HAXStore.haxTray.offsetMargin = this.offsetMargin;
        HAXStore.elementAlign = this.elementAlign;
        this.__applyHAXAdoptedStylesToShadowRoot();
      }, 0);
      this.windowControllersReady.abort();
    }
  }
  // import into the active body if there's content
  // obtain the nodes that have been assigned to the slot of our element
  importSlotToHaxBody() {
    let nodes = [];
    if (this.shadowRoot.querySelector("slot")) {
      nodes = this.shadowRoot.querySelector("slot").assignedNodes();
    } else {
      nodes = this.children;
    }
    let body = "";
    // loop the nodes and if it has an outerHTML attribute, append as string
    for (let i in nodes) {
      if (typeof nodes[i].outerHTML !== typeof undefined) {
        body += nodes[i].outerHTML;
      }
    }
    HAXStore.activeHaxBody.importContent(body);
  }
  /**
   * Appstore has been loaded, NOW we can safely do an import
   */
  appStoreReady(e) {
    if (e.detail) {
      this.importSlotToHaxBody();
      this.windowControllersLoaded.abort();
    }
  }
  render() {
    this.__rendered = true;
    this.shadowRoot.innerHTML = null;
    // eslint-disable-next-line haxtheweb-html/unsanitized-html-sink -- this element's own static template (fixed markup and shipped translations, no author data)
    this.template.innerHTML = this.html;
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    this.__applyHAXAdoptedStylesToShadowRoot();
  }
  /**
   * Apply tags to the screen to establish HAX
   */
  applyHAX() {
    // store needs to come before anyone else, use it's availability request mechanism
    let store = globalThis.HaxStore.requestAvailability();
    // now everyone else
    let tray = globalThis.document.createElement("hax-tray");
    tray.hidePanelOps = this.hidePanelOps;
    tray.hideToolbar = this.hideToolbar;
    this.elementAlign = localStorageGet("hax-tray-elementAlign");
    if (
      !this.elementAlign ||
      this.elementAlign == null ||
      this.elementAlign == ""
    ) {
      this.elementAlign = "left";
    }
    store.elementAlign = this.elementAlign;
    globalThis.document.body.appendChild(tray);
    globalThis.document.body.appendChild(
      globalThis.document.createElement("hax-app-picker"),
    );
    globalThis.document.body.appendChild(
      globalThis.document.createElement("hax-autoloader"),
    );
    globalThis.document.body.appendChild(
      globalThis.document.createElement("hax-cancel-dialog"),
    );
    return true;
  }
  disconnectedCallback() {
    if (this.windowControllers) {
      this.windowControllers.abort();
    }
    if (this.windowControllersLoaded) {
      this.windowControllersLoaded.abort();
    }
    if (this.windowControllersReady) {
      this.windowControllersReady.abort();
    }
    if (this.__pageClassObserver) {
      this.__pageClassObserver.disconnect();
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  static get observedAttributes() {
    return ["element-align", "offset-margin", "app-store", "hide-panel-ops"];
  }
  get elementAlign() {
    return this.getAttribute("element-align");
  }
  set elementAlign(newValue) {
    if (this.__rendered) {
      this.setAttribute("element-align", newValue);
      // bind to the hax store global on change
      HAXStore.elementAlign = newValue;
    }
  }
  get offsetMargin() {
    return this.getAttribute("offset-margin");
  }
  set offsetMargin(newValue) {
    this.setAttribute("offset-margin", newValue);
    if (this.__rendered) {
      // bind to the hax store global on change
      HAXStore.haxTray.offsetMargin = newValue;
    }
  }
  get hideToolbar() {
    return this.getAttribute("hide-toolbar");
  }
  set hideToolbar(newValue) {
    if (newValue) {
      this.setAttribute("hide-toolbar", "hide-toolbar");
      if (this.__rendered) {
        // bind to the hax store global on change
        HAXStore.haxTray.hideToolbar = newValue;
      }
    }
  }
  get hidePanelOps() {
    return this.getAttribute("hide-panel-ops");
  }
  set hidePanelOps(newValue) {
    if (newValue) {
      this.setAttribute("hide-panel-ops", "hide-panel-ops");
      if (this.__rendered) {
        // bind to the hax store global on change
        HAXStore.haxTray.hidePanelOps = newValue;
      }
    }
  }
  get appStore() {
    return this.getAttribute("app-store");
  }
  set appStore(newValue) {
    this.setAttribute("app-store", newValue);
    if (this.__rendered) {
      // bind to the hax store global on change
      HAXStore.appStore = {
        ...JSON.parse(this.getAttribute("app-store")),
      };
    }
  }
  attributeChangedCallback(_attr, _oldValue, _newValue) {}
}
globalThis.customElements.define("h-a-x", HAX);
export { HAX };
