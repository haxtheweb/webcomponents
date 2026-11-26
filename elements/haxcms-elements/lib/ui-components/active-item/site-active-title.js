/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html } from "lit";
import {
  store,
  iconFromPageType,
} from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { applyFromStore } from "../../core/utils/storeApply.js";

/**
 * `site-active-title`
 * `Title of the active page in the site`
 *
 * @demo demo/index.html
 */
class SiteActiveTitle extends I18NMixin(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-active-title";
  }
  /**
   * LitElement
   */
  render() {
    return html`
      <style>
        site-active-title {
          display: block;
          text-align: start;
          position: relative;
        }
        site-active-title[edit-mode][active-pagebreak]:hover {
          cursor: pointer;
          outline: 2px solid var(--hax-ui-color-hover, #0001);
          transition: 0.3s outline-width ease-in-out;
          outline-offset: 8px;
        }
        /* the page's "Hide page title" setting: still the page's h1 for
           screen readers and the outline, just not drawn; while editing it
           stays visible (dimmed) so the author can reach it */
        site-active-title[hide-title]:not([edit-mode]) h1 {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
          border: 0;
        }
        site-active-title[hide-title][edit-mode] h1 {
          opacity: 0.5;
        }
        site-active-title h1 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        h1 .site-active-title-icon {
          --simple-icon-height: 32px;
          --simple-icon-width: 32px;
          flex-shrink: 0;
        }
        site-active-title .title-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
      </style>
      ${
        this.__title
          ? html`
              <h1>
                <div class="title-wrapper">
                  ${
                    this.icon
                      ? html`
                          <simple-icon-lite
                            class="site-active-title-icon"
                            icon="${this.icon}"
                          ></simple-icon-lite>
                        `
                      : ``
                  }
                  ${this.__title}
                </div>
              </h1>
            `
          : ``
      }
    `;
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "dynamicMethodology") {
        this._applyHideTitle();
        this.__title = this._makeTitle(
          this.dynamicMethodology,
          this.activeTitle,
          this.parentTitle,
          this.ancestorTitle,
        );
      }
      if (propName == "editMode" && oldValue !== undefined) {
        if (this.editMode) {
          // micro-task so slotted children are inhjected correctly
          setTimeout(() => {
            if (!globalThis.HaxStore) {
              return;
            }
            const haxStore = globalThis.HaxStore.requestAvailability();
            if (!haxStore || !haxStore.activeHaxBody) {
              return;
            }
            this.activateController = new AbortController();
            if (this.activePageBreak) {
              this.addEventListener(
                "click",
                (_e) => {
                  haxStore.activeNode =
                    haxStore.activeHaxBody.querySelector("page-break");
                },
                { signal: this.activateController.signal },
              );
            }
            this._inProgressPageBreak = new MutationObserver((mutationList) => {
              mutationList.forEach((mutation) => {
                switch (mutation.type) {
                  case "attributes":
                    switch (mutation.attributeName) {
                      case "title": {
                        const pageBreakTitle =
                          haxStore.activeHaxBody.querySelector("page-break");
                        if (pageBreakTitle) {
                          this.activeTitle = pageBreakTitle.title;
                          this.__title = this._makeTitle(
                            this.dynamicMethodology,
                            this.activeTitle,
                            this.parentTitle,
                            this.ancestorTitle,
                          );
                        }
                        break;
                      }
                      case "hide-title": {
                        const pageBreakHide =
                          haxStore.activeHaxBody.querySelector("page-break");
                        this._activeHideTitle = !!(
                          pageBreakHide && pageBreakHide.hideTitle
                        );
                        this._applyHideTitle();
                        break;
                      }
                      case "icon":
                      case "page-type": {
                        const pageBreakIcon =
                          haxStore.activeHaxBody.querySelector("page-break");
                        if (pageBreakIcon && pageBreakIcon.icon) {
                          this.icon = pageBreakIcon.icon;
                        } else if (pageBreakIcon && pageBreakIcon.pageType) {
                          this.icon = iconFromPageType(pageBreakIcon.pageType);
                        } else {
                          this.icon = null;
                        }
                        break;
                      }
                    }
                    break;
                }
              });
            });
            const pageBreak =
              haxStore.activeHaxBody.querySelector("page-break");
            if (pageBreak) {
              this._inProgressPageBreak.observe(pageBreak, {
                attributeFilter: ["title", "page-type", "icon", "hide-title"],
                attributes: true,
              });
            }
          }, 0);
        } else {
          this.noFallback = false;
          if (this.activateController) {
            this.activateController.abort();
          }
          if (this._inProgressPageBreak) {
            this._inProgressPageBreak.disconnect();
          }
        }
      }
    });
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      __title: {
        type: String,
      },
      icon: {
        type: String,
      },
      dynamicMethodology: {
        type: String,
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      activePageBreak: {
        type: Boolean,
        reflect: true,
        attribute: "active-pagebreak",
      },
      /**
       * The active page's "Hide page title" setting (metadata.hideTitle).
       * Only applies to the active page's own title.
       */
      hideTitle: {
        type: Boolean,
        reflect: true,
        attribute: "hide-title",
      },
      t: {
        type: Object,
      },
    };
  }
  /**
   * Hide only when this shows the active page's own title, not a parent's
   */
  _applyHideTitle() {
    this.hideTitle =
      !!this._activeHideTitle &&
      (!this.dynamicMethodology || this.dynamicMethodology === "active");
  }
  /**
   * Generate title based on context
   */
  _makeTitle(dynamicMethodology, activeTitle, parentTitle, ancestorTitle) {
    switch (dynamicMethodology) {
      case "above":
        if (parentTitle === "" && !this.noFallback) {
          return activeTitle;
        }
        return parentTitle;
      case "ancestor":
        if (ancestorTitle === "" && !this.noFallback) {
          return activeTitle;
        }
        return ancestorTitle;
      default:
        return activeTitle;
    }
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.activateController = new AbortController();
    this.noFallback = false;
    this.dynamicMethodology = "active";
    this.__title = "";
    this.icon = null;
    this.hideTitle = false;
    this._activeHideTitle = false;
    this.activePageBreak = store.platformAllows("pageBreak");
    this.__disposer = [];
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.editMode);
        applyFromStore(_reaction, () => {
          this.editMode = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.activeItem);
        applyFromStore(_reaction, () => {
          const activeItem = _mobx_val_0;
          this._activeHideTitle = !!(
            activeItem &&
            activeItem.metadata &&
            activeItem.metadata.hideTitle === true
          );
          this._applyHideTitle();
          if (activeItem && activeItem.metadata && activeItem.metadata.icon) {
            this.icon = activeItem.metadata.icon;
          } else {
            this.icon = null;
          }
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.activeTitle);
        applyFromStore(_reaction, () => {
          this.activeTitle = _mobx_val_0;
          this.__title = this._makeTitle(
            this.dynamicMethodology,
            this.activeTitle,
            this.parentTitle,
            this.ancestorTitle,
          );
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.ancestorTitle);
        applyFromStore(_reaction, () => {
          this.ancestorTitle = _mobx_val_0;
          this.__title = this._makeTitle(
            this.dynamicMethodology,
            this.activeTitle,
            this.parentTitle,
            this.ancestorTitle,
          );
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.parentTitle);
        applyFromStore(_reaction, () => {
          this.parentTitle = _mobx_val_0;
          this.__title = this._makeTitle(
            this.dynamicMethodology,
            this.activeTitle,
            this.parentTitle,
            this.ancestorTitle,
          );
        });
      }),
    );
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    // clean up state
    for (let i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    super.disconnectedCallback();
  }
  /**
   * Break shadowRoot
   */
  createRenderRoot() {
    return this;
  }
}
globalThis.customElements.define(SiteActiveTitle.tag, SiteActiveTitle);
export { SiteActiveTitle };
