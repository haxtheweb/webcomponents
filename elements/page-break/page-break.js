/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/haxcms-elements/lib/core/micros/haxcms-button-add.js";
import { pageBreakManager } from "./lib/page-break-manager.js";
import { DDDExtra } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

/**
 * `page-break`
 * `a visual break but also helps manage hierarchy`
 *
 * @demo demo/index.html
 * @element page-break
 */
export class PageBreak extends IntersectionObserverMixin(
  I18NMixin(SchemaBehaviors(LitElement)),
) {
  static get tag() {
    return "page-break";
  }
  constructor() {
    super();
    this.relatedItems = null;
    this.icon = null;
    this.accentColor = null;
    this.entityType = "page";
    this.status = "";
    this.author = null;
    this.linkUrl = null;
    this.linkTarget = "_self";
    this.t = {
      newPage: "New page",
      pageBreak: "Page break",
      selectToEditPageDetails: "Select to edit Page details",
      noParent: "No parent",
      toggleLock: "Toggle lock",
      togglePublished: "Toggle published",
      linkMessage: "Users will be redirected to:",
      linkOpensInNewWindow: "Opens in new window",
      linkOpensInSameWindow: "Opens in same window",
      pageActions: "Page Actions",
      editPage: "Edit page",
      modifyPageTitle: "Modify page title",
      modifyPageIcon: "Modify page icon",
      editMedia: "Edit Media",
      editTags: "Edit tags",
      lock: "Lock",
      unlock: "Unlock",
      publish: "Publish",
      unpublish: "Unpublish",
      savePage: "Save page",
      saveAndEdit: "Save & Edit",
      cancel: "Cancel",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/page-break.es.json", import.meta.url).href + "/../",
    });
    this.description = null;
    this.hideInMenu = false;
    this.noderefs = [];
    this.developerTheme = null;
    this.tags = null;
    this.title = this.t.newPage;
    this.pageType = null;
    this.slug = "";
    this.published = false;
    this.image = null;
    this.target = null;
    this.locked = false;
    this.order = null;
    this.depth = 0;
    this.itemId = null;
    this._haxState = false;
    this.IORemoveOnVisible = false;
    this.IODelay = 250;
    this.remoteHeadingobserver = new MutationObserver(() => {
      // lock ensures that title update, then updating hte innerText
      // doesn't generate another mutation record
      if (this.title != this.target.innerText) {
        this.__moUpdate = true;
        this.title = this.target.innerText;
      }
    });
    this.iconType = "editor:format-page-break";
    // default break type for the vast majority of situations
    this.breakType = "node";
    this.isLoggedIn = false;
    this._editingUILoaded = false;
    this.__disposer = [];
    // Set up HAXcms store observer for login status
    autorun((reaction) => {
      this.isLoggedIn = toJS(store.isLoggedIn);
      this.__disposer.push(reaction);
    });
  }

  static get properties() {
    let props = super.properties || {};
    return {
      ...props,
      iconType: { type: String },
      noderefs: {
        type: Array,
        attribute: false,
      },
      relatedItems: {
        type: String,
        attribute: "related-items",
      },
      icon: { type: String },
      accentColor: { type: String, attribute: "accent-color" },
      entityType: { type: String, attribute: "entity-type" },
      description: { type: String },
      order: { type: Number },
      hideInMenu: { type: Boolean, reflect: true, attribute: "hide-in-menu" },
      tags: { type: String, reflect: true },
      developerTheme: { type: String, attribute: "developer-theme" },
      title: { type: String, reflect: true },
      slug: { type: String },
      image: { type: String },
      parent: { type: String, reflect: true },
      published: { type: Boolean, reflect: true },
      locked: { type: Boolean, reflect: true },
      depth: { type: Number, reflect: true },
      itemId: { type: String, attribute: "item-id", reflect: true },
      breakType: { type: String, attribute: "break-type" },
      status: { type: String },
      pageType: { type: String, attribute: "page-type" },
      author: { type: String },
      linkUrl: { type: String, attribute: "link-url" },
      linkTarget: { type: String, attribute: "link-target" },
      _haxState: { type: Boolean },
      /**
       * Platform-controlled visibility - when true, page-break won't show in editor
       * even when data-hax-ray is set
       */
      platformHidden: {
        type: Boolean,
        attribute: "platform-hidden",
        reflect: true,
      },
      isLoggedIn: { type: Boolean, reflect: true, attribute: "is-logged-in" },
    };
  }
  async _ensureEditingUI() {
    if (!this._editingUILoaded) {
      await Promise.all([
        import("@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js"),
        import("@haxtheweb/simple-fields/lib/simple-context-menu.js"),
      ]);
      this._editingUILoaded = true;
      this.requestUpdate();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.breakType === "node") {
      if (
        this.nextElementSibling &&
        this.nextElementSibling.tagName &&
        ["H1", "H2", "H3", "H4", "H5", "H6"].includes(
          this.nextElementSibling.tagName,
        )
      ) {
        this.title = this.nextElementSibling.innerText;
        this.target = this.nextElementSibling;
        this.setupTargetData(this.target);
      } else {
        // we are going to inject a title element possibly so pause
        // to make sure there wasn't some timing in rendering before
        // we accidentally inject an element
        setTimeout(() => {
          if (this.target === null) {
            if (
              this.nextElementSibling &&
              this.nextElementSibling.tagName &&
              ["H1", "H2", "H3", "H4", "H5", "H6"].includes(
                this.nextElementSibling.tagName,
              )
            ) {
              this.title = this.nextElementSibling.innerText;
              this.target = this.nextElementSibling;
              this.setupTargetData(this.target);
            } else {
              let tagName = this.depth === 0 ? `h2` : `h${this.depth + 2}`;
              let newH = globalThis.document.createElement(tagName);
              newH.setAttribute("data-original-level", "H2");
              newH.innerText = this.title;
              this.parentNode.insertBefore(newH, this.nextElementSibling);
              // account for HAX which might mess w/ the tag on insert
              setTimeout(() => {
                this.setupTargetData(this.nextElementSibling);
              }, 100);
            }
          }
        }, 0);
      }
    }
    globalThis.dispatchEvent(
      new CustomEvent("page-break-registration", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this,
          action: "add",
        },
      }),
    );
    globalThis.dispatchEvent(
      new CustomEvent("page-break-change", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this,
        },
      }),
    );
  }
  disconnectedCallback() {
    globalThis.dispatchEvent(
      new CustomEvent("page-break-registration", {
        detail: {
          value: this,
          action: "remove",
        },
      }),
    );
    globalThis.dispatchEvent(
      new CustomEvent("page-break-change", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this,
        },
      }),
    );
    this.remoteHeadingobserver.disconnect();
    // Clean up store observers
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  // setup the target data
  setupTargetData(newTarget) {
    if (this.target) {
      this.remoteHeadingobserver.disconnect();
    }
    this.target = newTarget;
    // Validate that target is a valid DOM Node before observing
    if (!this.target || !(this.target instanceof Node)) {
      console.warn('page-break: setupTargetData called with invalid target', this.target);
      return;
    }
    // add a backdoor for hax to have a hook into this
    this._haxSibling = this;
    // @todo need to add some kind of "if this gets deleted let me know"
    // or a hook that basically blocks this being deleted because it
    // is under control of the page-break tag
    this.remoteHeadingobserver.observe(this.target, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  }
  /**
   * Helper method to get current user from available stores
   */
  getCurrentUser() {
    // Check HAXcms store for user data first
    if (
      globalThis.HAXCMS &&
      globalThis.HAXCMS.requestAvailability().store.userData &&
      globalThis.HAXCMS.requestAvailability().store.userData.userName
    ) {
      return globalThis.HAXCMS.requestAvailability().store.userData.userName;
    }
    // Fallback to app-hax store if available
    else if (
      globalThis.store &&
      globalThis.store.user &&
      globalThis.store.user.name
    ) {
      return globalThis.store.user.name;
    }
    return null;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // Load editing UI when user logs in
      if (
        propName === "isLoggedIn" &&
        this.isLoggedIn &&
        !this._editingUILoaded
      ) {
        this._ensureEditingUI();
      }
      // Auto-update author when content-related properties change
      // This indicates the page has been modified
      if (
        ["title", "description", "tags", "published", "locked"].includes(
          propName,
        ) &&
        oldValue !== undefined
      ) {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser !== this.author) {
          this.author = currentUser;
        }
      }
      // @todo noderefs will have a nested object
      // we need to build a non-nested object for the schema
      // which we use to build a string based `thing,stuff,whatever` value
      // this then is computed from noderefs changes HOWEVER noderefs changes
      // is not saved while this is.
      if (propName === "noderefs") {
        let str = [];
        for (let i = 0; i < this.noderefs.length; i++) {
          str.push(this.noderefs[i].node);
        }
        this.relatedItems = str.join(",");
      }
      if (
        propName === "schemaResourceID" &&
        this.itemId == null &&
        oldValue !== undefined
      ) {
        this.itemId = this.schemaResourceID.replace("#", "item-");
      }
      // replicate locked aross elements between here and next page break
      if (this.locked && propName === "locked") {
        pageBreakManager.elementsBetween(this).forEach((el) => {
          el.setAttribute("data-hax-lock", "data-hax-lock");
        });
      }
      // was true, not locked
      else if (!this.locked && propName === "locked" && oldValue) {
        pageBreakManager.elementsBetween(this).forEach((el) => {
          el.removeAttribute("data-hax-lock");
        });
      }
      // update CE menu when these change if it is around
      if (
        this._ceMenu &&
        ["locked", "parent", "published"].includes(propName)
      ) {
        this._updateHAXCEMenu();
      }
      // fire event for reaction so we can update sgtate elsewhere
      if (["title", "parent", "slug"].includes(propName)) {
        globalThis.dispatchEvent(
          new CustomEvent("page-break-change", {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
              value: this,
            },
          }),
        );
      }
      // while the most common, only do these when we have a target
      if (this.breakType === "node" && this.target) {
        if (propName === "title" && this[propName]) {
          // change title text to match title if updated but delay
          // to avoid input spamming as this could generate a lot of change records
          // but don't just set it as it would generate another change record
          if (this.__moUpdate) {
            // skips the update of innerText to match
            this.__moUpdate = false;
          } else if (this.title != this.target.innerText) {
            this.target.innerText = this.title;
          }
        }
        // the magic a11y rewriter
        if (!this._haxState && propName === "depth" && this.depth >= 0) {
          pageBreakManager
            .elementsBetween(this, "page-break", "h1,h2,h3,h4,h5,h6")
            .forEach((el) => {
              let tagNumber =
                (el.getAttribute("data-original-level")
                  ? new Number(
                      el.getAttribute("data-original-level").replace("H", ""),
                    )
                  : new Number(el.tagName.replace("H", ""))) + this.depth;
              tagNumber = tagNumber > 6 ? 6 : tagNumber;
              const newH = globalThis.document.createElement(`h${tagNumber}`);
              newH.setAttribute("data-original-level", el.tagName);
              for (var i = 0, l = el.attributes.length; i < l; ++i) {
                newH.setAttribute(
                  el.attributes.item(i).nodeName,
                  el.attributes.item(i).nodeValue,
                );
              }
              newH.innerHTML = el.innerHTML;
              this.setupTargetData(newH);
              el.parentNode.replaceChild(newH, el);
            });
        }
        // hax state is a special case bc we want to edit in whats saved
        // not what's interpretted
        if (propName === "_haxState" && oldValue !== undefined) {
          if (this._haxState) {
            pageBreakManager
              .elementsBetween(this, "page-break", "h1,h2,h3,h4,h5,h6")
              .forEach((el) => {
                if (el.getAttribute("data-original-level")) {
                  let tagNumber = new Number(
                    el.getAttribute("data-original-level").replace("H", ""),
                  );
                  const newH = globalThis.document.createElement(
                    `h${tagNumber}`,
                  );
                  for (var i = 0, l = el.attributes.length; i < l; ++i) {
                    newH.setAttribute(
                      el.attributes.item(i).nodeName,
                      el.attributes.item(i).nodeValue,
                    );
                  }
                  newH.innerHTML = el.innerHTML;
                  el.parentNode.replaceChild(newH, el);
                  this.setupTargetData(newH);
                }
              });
          } else {
            pageBreakManager
              .elementsBetween(this, "page-break", "h1,h2,h3,h4,h5,h6")
              .forEach((el) => {
                let tagNumber =
                  (el.getAttribute("data-original-level")
                    ? new Number(
                        el.getAttribute("data-original-level").replace("H", ""),
                      )
                    : new Number(el.tagName.replace("H", ""))) + this.depth;
                tagNumber = tagNumber > 6 ? 6 : tagNumber;
                const newH = globalThis.document.createElement(`h${tagNumber}`);
                newH.setAttribute("data-original-level", el.tagName);
                for (var i = 0, l = el.attributes.length; i < l; ++i) {
                  newH.setAttribute(
                    el.attributes.item(i).nodeName,
                    el.attributes.item(i).nodeValue,
                  );
                }
                newH.innerHTML = el.innerHTML;
                el.parentNode.replaceChild(newH, el);
                this.setupTargetData(newH);
              });
          }
        }
      }
      // allow for haxcms page style association to allow users to edit the
      // current page's details
      if (propName === "breakType") {
        if (this[propName] === "node") {
          this.iconType = "editor:format-page-break";
        } else {
          this.iconType = "hax:page-details";
        }
      }
    });
  }
  static get styles() {
    return [
      DDDExtra,
      css`
        :host {
          display: block;
          position: relative;
          height: 0;
        }
        /* Platform configuration can force page-break to always be hidden */
        :host([platform-hidden]) {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none;
        }
        :host([data-hax-ray]) {
          display: block;
          margin: var(--ddd-spacing-1) 0 var(--ddd-spacing-20) 0;
          padding: var(--ddd-spacing-4);
          border: 2px solid var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-theme-default-limestoneMaxLight);
          position: relative;
          opacity: 0.9;
          transition:
            opacity 0.2s ease-in-out,
            border-color 0.2s ease-in-out,
            background-color 0.2s ease-in-out;
        }
        /* Increase bottom margin when link URL is present to prevent clipping */
        :host([data-hax-ray][link-url]) {
          margin-bottom: var(--ddd-spacing-24);
        }
        :host([data-hax-ray]:hover) {
          opacity: 1;
          background-color: var(--ddd-theme-default-white);
        }
        :host([data-hax-active]) {
          opacity: 1;
          border-color: var(--ddd-theme-default-skyBlue);
          background-color: var(--ddd-theme-default-white);
          box-shadow: var(--ddd-boxShadow-sm);
        }
        :host([data-hax-ray]) .text {
          display: block;
        }
        .link-info {
          display: none;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-coalyGray)
          );
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-3);
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-xs);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host([data-hax-ray]) .link-info {
          display: block;
        }
        .link-url {
          font-family: monospace;
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-theme-default-slateGray)
            );
          display: inline-block;
          margin: var(--ddd-spacing-1) 0;
          word-break: break-all;
          text-decoration: none;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneLight)
          );
          transition: all 0.2s ease;
        }
        .link-url:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-slateMaxLight)
          );
          color: var(--ddd-theme-default-skyBlue);
          border-color: var(--ddd-theme-default-skyBlue);
        }
        .text {
          display: none;
          font-weight: var(--ddd-font-weight-medium);
          color: var(--ddd-theme-default-coalyGray);
          background-color: var(--ddd-theme-default-skyBlue);
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-4);
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          color: var(--ddd-theme-default-white);
          height: 24px;
          line-height: 24px;
        }
        simple-toolbar-button.menu-button,
        simple-toolbar-button.save-button,
        simple-toolbar-button.save-edit-button,
        simple-toolbar-button.cancel-button {
          position: absolute;
          top: 0;
          right: 0;
          --simple-toolbar-button-height: 20px;
          --simple-toolbar-button-width: 20px;
          padding: var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          box-shadow: var(--ddd-boxShadow-sm);
          --simple-toolbar-button-hover-border-color: transparent;
        }
        simple-toolbar-button.menu-button {
          top: -8px;
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-circle);
          box-shadow: var(--ddd-boxShadow-sm);
          --simple-toolbar-button-height: 12px;
          --simple-toolbar-button-width: 12px;
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-skyBlue);
        }
        simple-toolbar-button.save-edit-button {
          right: 32px;
        }

        simple-toolbar-button.save-button {
          right: 64px;
        }

        simple-toolbar-button.save-button,
        simple-toolbar-button.save-edit-button,
        simple-toolbar-button.cancel-button {
          --simple-toolbar-button-height: 20px;
          --simple-toolbar-button-width: 20px;
          background-color: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
          border-color: var(--ddd-theme-default-limestoneGray);
          border-width: 1px;
        }

        simple-toolbar-button.cancel-button {
          background-color: var(--ddd-theme-default-discoveryCoral);
        }

        simple-toolbar-button.menu-item {
          --simple-toolbar-button-justify: flex-start;
          cursor: pointer;
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
        }
        simple-toolbar-button.menu-item simple-icon-lite {
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
        }
        simple-toolbar-button.menu-item-delete {
          --simple-toolbar-button-justify: flex-start;
          --simple-toolbar-button-hover-border-color: transparent;
          cursor: pointer;
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
          border-top: var(--ddd-border-sm) solid var(--ddd-theme-default-limestoneGray);
          margin-top: var(--ddd-spacing-2);
          padding-top: var(--ddd-spacing-2);
        }
        simple-toolbar-button.menu-item-delete:focus,
        simple-toolbar-button.menu-item-delete:hover {
          color: black;
          background-color: var(--ddd-theme-default-discoveryCoral);
        }
      `,
    ];
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.relatedItems) {
      const items = this.relatedItems.split(",");
      for (let i = 0; i < items.length; i++) {
        this.noderefs.push({
          node: items[i],
        });
      }
    }
    // align schema ID w/ the ID from itemId on load
    if (this.itemId != null) {
      this.schemaResourceID = this.itemId;
    }
  }
  render() {
    return html`
      <a .href="${this.slug}" .name="#${this.itemId}" class="sr-only">${this.title}</a>
      <div class="text">
        <simple-icon-lite icon="${this.iconType}"></simple-icon-lite>${this.t
          .selectToEditPageDetails}
      </div>
      ${this.linkUrl
        ? html`<div class="link-info">
            <div>
              <strong>${this.t.linkMessage}</strong>
            </div>
            <a
              class="link-url"
              href="${this.linkUrl}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${this.linkUrl}
            </a>
            <div>
              ${this.linkTarget === "_blank"
                ? this.t.linkOpensInNewWindow
                : this.t.linkOpensInSameWindow}
            </div>
          </div>`
        : ``}
      ${this.isLoggedIn && !this._haxState
        ? html`
            <simple-toolbar-button
              class="menu-button"
              icon="icons:create"
              label="${this.t.pageActions}"
              @click="${this._toggleMenu}"
            ></simple-toolbar-button>
            <simple-context-menu id="menu" title="${this.t.pageActions}">
              <simple-toolbar-button
                class="menu-item"
                icon="hax:page-edit"
                label="${this.t.editPage}"
                show-text-label
                @click="${this._editPage}"
                ?disabled="${this.locked}"
                autofocus
              ></simple-toolbar-button>
              <simple-toolbar-button
                class="menu-item"
                icon="editor:title"
                label="${this.t.modifyPageTitle}"
                show-text-label
                @click="${this._editTitle}"
                ?disabled="${this.locked}"
              ></simple-toolbar-button>
              <simple-toolbar-button
                class="menu-item"
                icon="hax:hax2022"
                label="${this.t.modifyPageIcon}"
                show-text-label
                @click="${this._editIcon}"
                ?disabled="${this.locked}"
              ></simple-toolbar-button>
              <simple-toolbar-button
                class="menu-item"
                icon="image:photo-library"
                label="${this.t.editMedia}"
                show-text-label
                @click="${this._editMedia}"
                ?disabled="${this.locked}"
              ></simple-toolbar-button>
              <simple-toolbar-button
                class="menu-item"
                icon="icons:label"
                label="${this.t.editTags}"
                show-text-label
                @click="${this._editTags}"
                ?disabled="${this.locked}"
              ></simple-toolbar-button>
              <simple-toolbar-button
                class="menu-item"
                icon="${this.published
                  ? "icons:visibility-off"
                  : "icons:visibility"}"
                label="${this.published ? this.t.unpublish : this.t.publish}"
                show-text-label
                @click="${this._togglePublished}"
                ?disabled="${this.locked}"
              ></simple-toolbar-button>
              <simple-toolbar-button
                class="menu-item"
                icon="${this.locked ? "icons:lock" : "icons:lock-open"}"
                label="${this.locked ? this.t.unlock : this.t.lock}"
                show-text-label
                @click="${this._toggleLocked}"
              ></simple-toolbar-button>
              <simple-toolbar-button
                class="menu-item-delete"
                icon="icons:delete"
                label="${this.t.delete || 'Delete'}"
                show-text-label
                @click="${this._deletePage}"
                ?disabled="${this.locked}"
              ></simple-toolbar-button>
            </simple-context-menu>
          `
        : ``}
      ${this.isLoggedIn && this._haxState
        ? html`
            <simple-toolbar-button
              class="save-button"
              icon="icons:save"
              label="${this.t.savePage}"
              @click="${this._savePage}"
            ></simple-toolbar-button>
            <simple-toolbar-button
              class="save-edit-button"
              icon="hax:page-edit"
              label="${this.t.saveAndEdit}"
              @click="${this._saveAndEdit}"
            ></simple-toolbar-button>
            <simple-toolbar-button
              class="cancel-button"
              icon="icons:cancel"
              label="${this.t.cancel}"
              @click="${this._cancelEdit}"
            ></simple-toolbar-button>
          `
        : ``}
    `;
  }
  _toggleMenu(e) {
    e.stopPropagation();
    const menu = this.shadowRoot.querySelector("#menu");
    if (!menu) return;
    menu.toggle(e.target);
  }

  _editPage(e) {
    // Don't allow edit if locked
    if (this.locked) {
      const menu = this.shadowRoot.querySelector("#menu");
      if (menu) menu.close();
      store.toast("This page is locked. Unlock it first to edit.", 3000, { hat: "error" });
      store.playSound("error");
      return;
    }
    const menu = this.shadowRoot.querySelector("#menu");
    if (menu) menu.close();
    store.cmsSiteEditor.haxCmsSiteEditorUIElement._editButtonTap();
  }

  _saveAndEdit(e) {
    store.cmsSiteEditor.haxCmsSiteEditorUIElement._saveAndEditButtonTap();
  }

  _cancelEdit(e) {
    store.cmsSiteEditor.haxCmsSiteEditorUIElement._cancelButtonTap(e);
  }

  async _editTitle(e) {
    // Don't allow edit if locked
    if (this.locked) {
      const menu = this.shadowRoot.querySelector("#menu");
      if (menu) menu.close();
      store.toast("This page is locked. Unlock it first to edit.", 3000, { hat: "error" });
      store.playSound("error");
      return;
    }
    const menu = this.shadowRoot.querySelector("#menu");
    if (menu) menu.close();

    const item = toJS(store.activeItem);
    if (!item || !item.id) {
      console.warn("page-break _editTitle: No active item found");
      return;
    }

    if (!globalThis.SuperDaemonManager) {
      console.error("page-break _editTitle: SuperDaemonManager not available");
      return;
    }

    const SuperDaemonInstance =
      globalThis.SuperDaemonManager.requestAvailability();
    store.playSound("click");

    // Trigger the edit-title program
    // The program will automatically show the current title from the store
    SuperDaemonInstance.waveWand([
      "",  // Empty input - let program show current title
      "/",
      {},
      "edit-title",
      "Edit title",
    ]);
  }

  async _editIcon(e) {
    // Don't allow edit if locked
    if (this.locked) {
      const menu = this.shadowRoot.querySelector("#menu");
      if (menu) menu.close();
      store.toast("This page is locked. Unlock it first to edit.", 3000, { hat: "error" });
      store.playSound("error");
      return;
    }
    const menu = this.shadowRoot.querySelector("#menu");
    if (menu) menu.close();

    const { SimpleIconsetStore } = await import("@haxtheweb/simple-icon/lib/simple-iconset.js");
    const item = toJS(store.activeItem);
    if (!item || !item.id) return;

    const SuperDaemonInstance =
      globalThis.SuperDaemonManager.requestAvailability();
    store.playSound("click");

    const allIcons =
      SimpleIconsetStore && SimpleIconsetStore.iconlist
        ? [...SimpleIconsetStore.iconlist].sort()
        : [];

    SuperDaemonInstance.defineOption({
      title: "Edit Icon",
      icon: "icons:image",
      priority: -10000,
      tags: ["edit", "icon"],
      eventName: "super-daemon-run-program",
      path: "CMS/edit/icon",
      value: {
        name: "edit-icon",
        machineName: "edit-icon",
        placeholder: "Type to search icons by name",
        program: async (input) => {
          const searchTerm = input ? input.toLowerCase() : "";
          const results = [];

          const filteredIcons = searchTerm
            ? allIcons.filter((icon) => icon.toLowerCase().includes(searchTerm))
            : allIcons.slice(0, 50);

          filteredIcons.forEach((icon) => {
            const friendlyName = icon
              .replace(/^.*:/, "")
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            results.push({
              title: `${friendlyName} (${icon})`,
              icon: icon,
              tags: ["icon"],
              value: {
                target: globalThis,
                method: "dispatchEvent",
                args: [
                  new CustomEvent("haxcms-save-node-details", {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    detail: {
                      id: item.id,
                      operation: "setIcon",
                      icon: icon,
                    },
                  }),
                ],
              },
              eventName: "super-daemon-element-method",
              path: `CMS/edit/icon/${icon}`,
            });
          });

          if (results.length === 0) {
            return [
              {
                title: searchTerm
                  ? `No icons found for "${searchTerm}"`
                  : "No icons available",
                icon: "icons:search",
                tags: ["empty"],
                value: { disabled: true },
                eventName: "disabled",
                path: "No results",
              },
            ];
          }

          if (!searchTerm && allIcons.length > 50) {
            results.push({
              title: `Showing 50 of ${allIcons.length} icons - type to search`,
              icon: "icons:info",
              tags: ["hint"],
              value: { disabled: true },
              eventName: "disabled",
              path: "Hint",
            });
          }

          return results;
        },
      },
    });

    SuperDaemonInstance.waveWand(["", "/", {}, "edit-icon", "Edit Icon"]);
  }

  async _editMedia(e) {
    // Don't allow edit if locked
    if (this.locked) {
      const menu = this.shadowRoot.querySelector("#menu");
      if (menu) menu.close();
      store.toast("This page is locked. Unlock it first to edit.", 3000, { hat: "error" });
      store.playSound("error");
      return;
    }
    const menu = this.shadowRoot.querySelector("#menu");
    if (menu) menu.close();

    const SuperDaemonInstance =
      globalThis.SuperDaemonManager.requestAvailability();
    store.playSound("click");

    SuperDaemonInstance.waveWand(["", "/", {}, "hax-agent", "Agent"]);
  }

  async _editTags(e) {
    // Don't allow edit if locked
    if (this.locked) {
      const menu = this.shadowRoot.querySelector("#menu");
      if (menu) menu.close();
      store.toast("This page is locked. Unlock it first to edit.", 3000, { hat: "error" });
      store.playSound("error");
      return;
    }
    const menu = this.shadowRoot.querySelector("#menu");
    if (menu) menu.close();

    const item = toJS(store.activeItem);
    if (!item || !item.id) return;

    const SuperDaemonInstance = globalThis.SuperDaemonManager.requestAvailability();
    // Ensure Merlin / SuperDaemon is in a clean state before launching the
    // edit-tags program. In practice this helps avoid any lingering program
    // context from a previous run interfering with subsequent tag edits.
    SuperDaemonInstance.close();
    store.playSound("click");

    const currentTags = (item.metadata && item.metadata.tags) || "";
    this._originalTags = currentTags;

    // Use the globally defined edit-tags program
    SuperDaemonInstance.waveWand([
      currentTags,
      "/",
      {},
      "edit-tags",
      "Edit tags",
    ]);

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        this.tags = this._originalTags;
        globalThis.removeEventListener("keydown", handleEscape);
      }
    };
    globalThis.addEventListener("keydown", handleEscape, { once: true });
  }

  async _toggleLocked(e) {
    const menu = this.shadowRoot.querySelector("#menu");
    if (menu) menu.close();

    const item = toJS(store.activeItem);
    if (!item || !item.id) return;

    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: item.id,
          operation: "setLocked",
          locked: !this.locked,
        },
      }),
    );
  }

  async _togglePublished(e) {
    // Don't allow toggling published if locked
    if (this.locked) {
      const menu = this.shadowRoot.querySelector("#menu");
      if (menu) menu.close();
      store.toast("This page is locked. Unlock it first to change publish status.", 3000, { hat: "error" });
      store.playSound("error");
      return;
    }
    const menu = this.shadowRoot.querySelector("#menu");
    if (menu) menu.close();

    const item = toJS(store.activeItem);
    if (!item || !item.id) return;

    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: item.id,
          operation: "setPublished",
          published: !this.published,
        },
      }),
    );
  }

  async _savePage(e) {
    store.cmsSiteEditor.haxCmsSiteEditorUIElement._editButtonTap();
  }

  _addPage(e) {
    const menu = this.shadowRoot.querySelector("#menu");
    if (menu) menu.close();
    // Trigger the merlin mini interface for adding a page
    // This is handled by haxcms-button-add internally
  }

  _deletePage(e) {
    // Don't allow delete if locked
    if (this.locked) {
      const menu = this.shadowRoot.querySelector("#menu");
      if (menu) menu.close();
      store.toast("This page is locked. Unlock it first to delete.", 3000, { hat: "error" });
      store.playSound("error");
      return;
    }
    const menu = this.shadowRoot.querySelector("#menu");
    if (menu) menu.close();
    store.cmsSiteEditor.haxCmsSiteEditorUIElement._deleteButtonTap();
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/page-break.haxProperties.json`, import.meta.url).href;
  }
  /**
   * haxHooks
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      inlineContextMenu: "haxinlineContextMenu",
      activeElementChanged: "haxactiveElementChanged",
      setupActiveElementForm: "haxsetupActiveElementForm",
      preProcessInsertContent: "haxpreProcessInsertContent",
      trayDragNDropToNode: "haxtrayDragNDropToNode",
    };
  }
  /**
   * on insert, test for other page-break tags via manager to see
   * if we're able to steal sane defaults from there
   */
  async haxpreProcessInsertContent(details, activeNode) {
    // look up the current page breaks from manager
    // if a haxcms one exists then use that for defaults
    // if activeNode would have us be at a different page-break, use this
    // as the target for drawing the following settings:
    // for parent (same parent), order (+1 from it), published (mirror), locked (mirror)

    // this ensures we look at the level just below the body container level
    let testNode = activeNode;
    if (testNode && testNode.parentNode) {
      while (testNode.parentNode.tagName !== "HAX-BODY") {
        testNode = testNode.parentNode;
      }
      const closestPB = await pageBreakManager.associatedPageBreak(testNode);

      if (closestPB) {
        details.properties.parent = closestPB.parent;
        details.properties.order = closestPB.order + 1;
        details.properties.published = closestPB.published;
        details.properties.locked = closestPB.locked;
      }
    }
    return details;
  }
  /**
   * Same as the above hook in capability however because of the interim state
   * of a drag event, we need a specialized hook that is for when the new
   * element has been dropped into the page
   */
  async haxtrayDragNDropToNode(activeNode) {
    // look up the current page breaks from manager
    // if a haxcms one exists then use that for defaults
    // if activeNode would have us be at a different page-break, use this
    // as the target for drawing the following settings:
    // for parent (same parent), order (+1 from it), published (mirror), locked (mirror)

    // this ensures we look at the level just below the body container level
    let testNode = activeNode;
    while (testNode.parentNode.tagName !== "HAX-BODY") {
      testNode = testNode.parentNode;
    }
    const closestPB = await pageBreakManager.associatedPageBreak(testNode);
    if (closestPB) {
      activeNode.parent = closestPB.parent;
      activeNode.order = closestPB.order + 1;
      activeNode.published = closestPB.published;
      activeNode.locked = closestPB.locked;
    }
  }
  /**
   * Allow for dynamic setting of the parent field if we have the store around
   * with values to do so
   */
  haxsetupActiveElementForm(props) {
    if (globalThis.HAXCMS) {
      const itemManifest =
        globalThis.HAXCMS.requestAvailability().store.getManifestItems(true);
      // default to null parent as the whole site
      var items = [
        {
          text: `-- ${this.t.noParent} --`,
          value: null,
        },
      ];
      itemManifest.forEach((el) => {
        if (el.id != this.itemId) {
          // calculate -- depth so it looks like a tree
          let itemBuilder = el;
          // walk back through parent tree
          let distance = "- ";
          while (itemBuilder && itemBuilder.parent != null) {
            itemBuilder = itemManifest.find((i) => i.id == itemBuilder.parent);
            // double check structure is sound
            if (itemBuilder) {
              distance = "--" + distance;
            }
          }
          items.push({
            text: distance + el.title,
            value: el.id,
          });
        }
      });
      // apply same logic of the items in the active site to
      // parent and related items
      props.settings.advanced.forEach((attr, index) => {
        if (attr.property === "parent") {
          props.settings.advanced[index].inputMethod = "select";
          props.settings.advanced[index].itemsList = items;
        }
        if (attr.property === "noderefs") {
          props.settings.advanced[index].properties[0].inputMethod = "select";
          props.settings.advanced[index].properties[0].itemsList = items;
        }
      });
      // pull theme list from the registry
      props.settings.developer.forEach((attr, index) => {
        // pull theme list from the registry
        if (
          attr.property === "developerTheme" &&
          globalThis.appSettings &&
          globalThis.appSettings.themes
        ) {
          var themes = [
            {
              text: "",
              value: null,
            },
          ];
          Object.keys(globalThis.appSettings.themes).map((key) => {
            themes.push({
              text: globalThis.appSettings.themes[key].name,
              value: globalThis.appSettings.themes[key].element,
            });
          });
          props.settings.developer[index].inputMethod = "select";
          props.settings.developer[index].itemsList = themes;
        }
      });
      // Auto-populate author with current user if available
      props.settings.developer.forEach((attr, index) => {
        if (attr.property === "author") {
          const currentUser = this.getCurrentUser();

          // Set the current user as the default value if we found one and author is empty
          if (currentUser && !this.author) {
            this.author = currentUser;
            // Update the props to show the current value
            props.settings.developer[index].value = currentUser;
          }
        }
      });
    }
  }
  /**
   * Ensure that if we WERE active and now are not
   * and have a reference to the custom element menu in hax
   * and are the right break type, that we reset these items
   */
  haxactiveElementChanged(element, value) {
    if (!value && this._ceMenu) {
      if (this.breakType === "site") {
        this._ceMenu.disableOps = false;
        this._ceMenu.canMoveElement = true;
        this._ceMenu.insertAbove = true;
      } else {
        this._ceMenu.disableDuplicate = false;
      }
    }
  }
  /**
   * ensure that when we flip states here that we are actively switching the original level var
   */
  haxeditModeChanged(value) {
    this._haxState = value;
  }
  /**
   * add buttons when it is in context
   */
  haxinlineContextMenu(ceMenu) {
    this._ceMenu = ceMenu;
    this._updateHAXCEMenu();
    // forcibly prevent duplication and deleting of the node controlling the page itself
    if (this.breakType === "site") {
      this._ceMenu.disableOps = true;
      this._ceMenu.canMoveElement = false;
      this._ceMenu.insertAbove = false;
    } else {
      this._ceMenu.disableDuplicate = true;
    }
  }
  // update custom element buttons so we can do live status changes
  _updateHAXCEMenu() {
    this._ceMenu.ceButtons = [
      {
        icon: this.locked ? "icons:lock" : "icons:lock-open",
        callback: "haxClickInlineLock",
        label: this.t.toggleLock,
      },
      {
        icon: this.published ? "lrn:view" : "lrn:view-off",
        callback: "haxClickInlinePublished",
        label: this.t.togglePublished,
      },
    ];
  }
  haxClickLockInPage(e) {
    this.locked = !this.locked;
    globalThis.dispatchEvent(new CustomEvent("hax-refresh-tray-form", {}));
  }
  haxClickInlineLock(e) {
    this.locked = !this.locked;
    return true;
  }
  haxClickInlinePublished(e) {
    this.published = !this.published;
    return true;
  }
}
globalThis.customElements.define(PageBreak.tag, PageBreak);
