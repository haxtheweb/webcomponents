/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { SimpleIconsetStore } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
import { pageBreakManager } from "./lib/page-break-manager.js";

/**
 * `page-break`
 * `a visual break but also helps manage hierarchy`
 *
 * @demo demo/index.html
 * @element page-break
 */
export class PageBreak extends IntersectionObserverMixin(
  I18NMixin(SchemaBehaviors(LitElement))
) {
  static get tag() {
    return "page-break";
  }
  constructor() {
    super();
    this.status = "";
    this.t = {
      newPage: "New page",
      pageBreak: "Page break",
      pageDetails: "Page details",
      clickToUnlock: "Click to unlock",
    };
    this.pathAuto = false;
    this.title = this.t.newPage;
    this.slug = "#";
    this.published = false;
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
    // default break type for the vast majority of situations
    this.breakType = "node";
  }
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      pathAuto: { type: Boolean, reflect: true, attribute: "path-auto" },
      order: { type: Number },
      title: { type: String, reflect: true },
      slug: { type: String },
      parent: { type: String, reflect: true },
      published: { type: Boolean, reflect: true },
      locked: { type: Boolean, reflect: true },
      depth: { type: Number, reflect: true },
      itemId: { type: String, attribute: "item-id", reflect: true },
      breakType: { type: String, attribute: "break-type" },
      status: { type: String },
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
          this.nextElementSibling.tagName
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
                this.nextElementSibling.tagName
              )
            ) {
              this.title = this.nextElementSibling.innerText;
              this.target = this.nextElementSibling;
              this.setupTargetData(this.target);
            } else {
              let tagName = this.depth === 0 ? `h2` : `h${this.depth + 2}`;
              let newH = document.createElement(tagName);
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
    window.dispatchEvent(
      new CustomEvent("page-break-registration", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this,
          action: "add",
        },
      })
    );
    window.dispatchEvent(
      new CustomEvent("page-break-change", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this,
        },
      })
    );
  }
  disconnectedCallback() {
    window.dispatchEvent(
      new CustomEvent("page-break-registration", {
        detail: {
          value: this,
          action: "remove",
        },
      })
    );
    window.dispatchEvent(
      new CustomEvent("page-break-change", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this,
        },
      })
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
      // align schema ID w/ the ID from itemId
      if (propName === "itemId" && this[propName] != null) {
        this.schemaResourceID = this.itemId;
      } else if (propName === "schemaResourceID" && this.itemId == null) {
        this.itemId = this.schemaResourceID.replace("#", "");
      }
      // when visible, "click" the thing so that it's activated
      if (
        propName === "elementVisible" &&
        this.elementVisible &&
        this.itemId &&
        this.shadowRoot
      ) {
        setTimeout(() => {
          pageBreakManager.updateVisibleAsActive();
        }, 0);
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
        window.dispatchEvent(
          new CustomEvent("page-break-change", {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
              value: this,
            },
          })
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
                      el.getAttribute("data-original-level").replace("H", "")
                    )
                  : new Number(el.tagName.replace("H", ""))) + this.depth;
              tagNumber = tagNumber > 6 ? 6 : tagNumber;
              const newH = document.createElement(`h${tagNumber}`);
              newH.setAttribute("data-original-level", el.tagName);
              for (var i = 0, l = el.attributes.length; i < l; ++i) {
                newH.setAttribute(
                  el.attributes.item(i).nodeName,
                  el.attributes.item(i).nodeValue
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
                    el.getAttribute("data-original-level").replace("H", "")
                  );
                  const newH = document.createElement(`h${tagNumber}`);
                  for (var i = 0, l = el.attributes.length; i < l; ++i) {
                    newH.setAttribute(
                      el.attributes.item(i).nodeName,
                      el.attributes.item(i).nodeValue
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
                        el.getAttribute("data-original-level").replace("H", "")
                      )
                    : new Number(el.tagName.replace("H", ""))) + this.depth;
                tagNumber = tagNumber > 6 ? 6 : tagNumber;
                const newH = document.createElement(`h${tagNumber}`);
                newH.setAttribute("data-original-level", el.tagName);
                for (var i = 0, l = el.attributes.length; i < l; ++i) {
                  newH.setAttribute(
                    el.attributes.item(i).nodeName,
                    el.attributes.item(i).nodeValue
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
        var iconPath;
        if (this[propName] === "node") {
          iconPath = SimpleIconsetStore.getIcon("editor:format-page-break");
          this.shadowRoot.querySelector("style").innerHTML = `
          :host([data-hax-ray]:hover) .mid::before {
            content: "${this.t.pageBreak}";
          }`;
        } else {
          iconPath = SimpleIconsetStore.getIcon("hax:page-details");
          this.shadowRoot.querySelector("style").innerHTML = `
          :host([data-hax-ray]:hover) .mid::before {
            content: "${this.t.pageDetails}";
          }`;
        }
        // set background of the tag itself to the icon based on mode
        this.style.backgroundImage = `url("${iconPath}")`;
      }
    });
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          opacity: 0;
          height: 1px;
        }
        :host([data-hax-ray]) {
          display: block;
          margin: 20px 0;
          padding: 20px;
          opacity: 0.2;
          background-position: center;
          background-repeat: no-repeat;
          transition: all 0.2s linear;
        }
        .mid {
          border: none;
          border-top: 2px solid #cccccc;
          overflow: visible;
          margin: 4px 0 0 0;
          padding: 0;
          height: 0;
        }
        :host([data-hax-ray]:hover) {
          opacity: 1;
        }
        :host([data-hax-ray]:hover) .mid::before {
          font-weight: bold;
          color: #000000;
          background-color: #ffffff;
          font-size: 16px;
          left: calc(50% - 2.5em);
          top: -16px;
          position: relative;
          height: 0;
          line-height: 36px;
        }
        simple-icon-lite {
          float: right;
          color: red;
          --simple-icon-width: 36px;
          --simple-icon-height: 36px;
          margin-top: -28px;
          margin-right: -46px;
        }
        .sr-only {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
      `,
    ];
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  render() {
    return html`
      <style>
        :host([data-hax-ray]:hover) .mid::before {
          content: "${this.t.pageBreak}";
        }
      </style>
      <a .href="${this.slug}" .name="#${this.itemId}" class="sr-only"
        >${this.title}</a
      >
      <hr class="mid" />
      ${this.locked
        ? html`<simple-icon-lite
            @click="${this.haxClickLockInPage}"
            icon="icons:lock"
            title="${this.t.clickToUnlock}"
          ></simple-icon-lite>`
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
    if (window.HAXCMS) {
      const itemManifest = window.HAXCMS.requestAvailability().store.getManifestItems(
        true
      );
      var items = [];
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
      props.settings.configure.forEach((attr, index) => {
        if (attr.property === "parent") {
          props.settings.configure[index].inputMethod = "select";
          props.settings.configure[index].itemsList = items;
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
        label: "Toggle Lock",
      },
      {
        icon: this.published ? "lrn:view" : "lrn:view-off",
        callback: "haxClickInlinePublished",
        label: "Toggle published",
      },
      // @todo these are both not the correct test to be performing at this time
      // these should be coming from the store for haxcms and all we have to do
      // is either
      // assign the parent of our parent (so an outdent) while taking parent's order + 1 (so next to it)
      // assign the parent of our sibling (so an indent) while resetting order to be 0 (1st thing indented)
      {
        icon: "editor:format-indent-increase",
        callback: "haxIndentParent",
        label: "Move under parent page break",
        disabled: !pageBreakManager.getParent(this, "indent"),
      },
      {
        icon: "editor:format-indent-decrease",
        callback: "haxOutdentParent",
        label: "Move out of parent page break",
        disabled: !pageBreakManager.getParent(this, "outdent"),
      },
    ];
  }
  haxClickLockInPage(e) {
    this.locked = !this.locked;
    window.dispatchEvent(new CustomEvent("hax-refresh-tray-form", {}));
  }
  haxClickInlineLock(e) {
    this.locked = !this.locked;
    return true;
  }
  haxClickInlinePublished(e) {
    this.published = !this.published;
    return true;
  }
  haxIndentParent(e) {
    if (pageBreakManager.getParent(this, "indent")) {
      this.parent = pageBreakManager.getParent(this, "indent").slug;
    }
    return true;
  }
  haxOutdentItem(e) {
    if (pageBreakManager.getParent(this, "outdent")) {
      this.parent = pageBreakManager.getParent(this, "outdent").slug;
    } else if (
      this.parent &&
      pageBreakManager.getParent(this, "outdent") === null
    ) {
      this.parent = null;
    }
    return true;
  }
}
customElements.define(PageBreak.tag, PageBreak);
