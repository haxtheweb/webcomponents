/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import { pageBreakManager } from "./lib/page-break-manager.js";
/**
 * `page-break`
 * `a visual break but also helps manage hierarchy`
 *
 * @demo demo/index.html
 * @element page-break
 */
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { SimpleIconsetStore } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
export class PageBreak extends IntersectionObserverMixin(
  I18NMixin(SchemaBehaviors(LitElement))
) {
  static get tag() {
    return "page-break";
  }
  constructor() {
    super();
    this.t = {
      newPage: "New page",
      pageBreak: "Page break",
      pageDetails: "Page details",
    };
    this.title = this.t.newPage;
    this.path = "#";
    this.published = true;
    this.lock = false;
    this.target = null;
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
      title: { type: String, reflect: true },
      path: { type: String },
      parent: { type: String, reflect: true },
      published: { type: Boolean, reflect: true },
      locked: { type: Boolean, reflect: true },
      depth: { type: Number, reflect: true },
      itemId: { type: String, attribute: "item-id", reflect: true },
      breakType: { type: String, attribute: "break-type" },
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
      // replicate lock status
      if (this.lock && propName === "lock") {
        pageBreakManager.elementsBetween(this).forEach((el) => {
          el.setAttribute("data-hax-lock", "data-hax-lock");
        });
      }
      // was true, not locked
      else if (!this.lock && propName === "lock" && oldValue) {
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
      // fire event for reaction so we can update state elsewhere
      if (["title", "parent", "path"].includes(propName)) {
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
      // we only support haxcms break types when using haxcms
      // this setting will be enforced by the system itself and no human
      // will have the option of doing this setting
      if (
        this.breakType === "haxcms" &&
        propName === "title" &&
        this[propName] &&
        window.HAXCMS
      ) {
        // set the title directly in the activeItem in the store
        // while not permanent, this will allow us to update things
        // on the fly and see them reflected
        window.HAXCMS.requestAvailability().store.activeItem.title = this.title;
      }
      // allow for haxcms page style association to allow users to edit the
      // current page's details
      if (propName === "breakType") {
        var iconPath;
        if (this[propName] === "node") {
          iconPath = SimpleIconsetStore.getIcon("editor:format-page-break");
          this._stateStyle.innerHTML = `
          :host([data-hax-ray]:hover) .mid::before {
            content: "${this.t.pageBreak}";
          }`;
        } else {
          iconPath = SimpleIconsetStore.getIcon("hax:page-details");
          this._stateStyle.innerHTML = `
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
      `,
    ];
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._stateStyle = document.createElement("style");
    this.shadowRoot.appendChild(this._stateStyle);
  }
  render() {
    return html`
      <a .href="${this.path}" .name="#${this.itemId}" aria-hidden="true"></a>
      <hr class="mid" />
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
    };
  }
  /**
   * Ensure that if we WERE active and now are not
   * and have a reference to the custom element menu in hax
   * and are the right break type, that we reset these items
   */
  haxactiveElementChanged(element, value) {
    if (this.breakType === "haxcms" && !value && this._ceMenu) {
      this._ceMenu.disableOps = false;
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
    if (this.breakType === "haxcms") {
      this._ceMenu.disableOps = true;
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
      this.parent = pageBreakManager.getParent(this, "indent").path;
    }
    return true;
  }
  haxOutdentItem(e) {
    if (pageBreakManager.getParent(this, "outdent")) {
      this.parent = pageBreakManager.getParent(this, "outdent").path;
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
