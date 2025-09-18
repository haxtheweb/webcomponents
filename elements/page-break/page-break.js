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
import { pageBreakManager } from "./lib/page-break-manager.js";
import { DDDExtra } from "@haxtheweb/d-d-d/lib/DDDStyles.js";

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
    this.t = {
      newPage: "New page",
      pageBreak: "Page break",
      selectToEditPageDetails: "Select to edit Page details",
      clickToUnlock: "Click to unlock",
      noParent: "No parent",
      toggleLock: "Toggle lock",
      togglePublished: "Toggle published",
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
      _haxState: { type: Boolean },
    };
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
    super.disconnectedCallback();
  }
  // setup the target data
  setupTargetData(newTarget) {
    if (this.target) {
      this.remoteHeadingobserver.disconnect();
    }
    this.target = newTarget;
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
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
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
          opacity: 0;
        }
        :host([data-hax-ray]) {
          display: block;
          margin: var(--ddd-spacing-4) 0;
          padding: var(--ddd-spacing-4);
          border: 2px dotted var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-theme-default-limestoneMaxLight);
          position: relative;
          opacity: 0.9;
          transition:
            opacity 0.2s ease-in-out,
            border-color 0.2s ease-in-out,
            background-color 0.2s ease-in-out;
        }
        :host([data-hax-ray]:hover) {
          opacity: 1;
          border-color: var(--ddd-theme-default-coalyGray);
          background-color: var(--ddd-theme-default-white);
        }
        :host([data-hax-active]) {
          opacity: 1;
          border-color: var(--ddd-theme-default-skyBlue);
          background-color: var(--ddd-theme-default-white);
          box-shadow: var(--ddd-boxShadow-sm);
        }
        :host([data-hax-ray]) .mid,
        :host([data-hax-ray]) .text {
          display: block;
        }
        .mid {
          display: none;
          border: none;
          border-top: 2px solid var(--ddd-theme-default-skyBlue);
          overflow: visible;
          margin: var(--ddd-spacing-2) 0;
          padding: 0;
          height: 0;
        }
        .text {
          display: none;
          font-weight: var(--ddd-font-weight-medium);
          color: var(--ddd-theme-default-coalyGray);
          background-color: var(--ddd-theme-default-skyBlue);
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          position: absolute;
          top: calc(-1 * var(--ddd-spacing-2));
          left: var(--ddd-spacing-2);
          z-index: 10;
          color: var(--ddd-theme-default-white);
          box-shadow: var(--ddd-boxShadow-sm);
        }
        simple-icon-lite {
          margin-right: var(--ddd-spacing-2);
        }
        simple-icon-button-lite {
          position: absolute;
          top: var(--ddd-spacing-1);
          right: var(--ddd-spacing-1);
          color: var(--ddd-theme-default-coalyGray);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-1);
          box-shadow: var(--ddd-boxShadow-sm);
        }
        simple-icon-button-lite:hover {
          color: var(--ddd-theme-default-skyBlue);
          background-color: var(--ddd-theme-default-limestoneMaxLight);
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
      <style></style>
      <a .href="${this.slug}" .name="#${this.itemId}" class="sr-only"
        >${this.title}</a
      >
      <hr class="mid" />
      <div class="text">
        <simple-icon-lite icon="${this.iconType}"></simple-icon-lite>${this.t
          .selectToEditPageDetails}
      </div>
      ${this.locked
        ? html`<simple-icon-button-lite
            @click="${this.haxClickLockInPage}"
            icon="icons:lock"
            title="${this.t.clickToUnlock}"
          ></simple-icon-button-lite>`
        : ``}
    `;
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
