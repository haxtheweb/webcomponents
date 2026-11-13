/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import {
  MapMenuProgressStrings,
  mapMenuProgressStyles,
  renderProgressLabel,
  renderProgressMark,
  mapMenuActiveRingStyles,
  hasActiveRing,
  activeRingText,
  renderActiveRing,
  renderActiveRingLabel,
  updateActiveRing,
} from "./map-menu-progress.js";
class MapMenuItem extends I18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      mapMenuProgressStyles,
      ...mapMenuActiveRingStyles,
      css`
        :host {
          display: block;
          position: relative;
          font-size: var(--map-menu-font-size);
          overflow: var(--map-menu-item-overflow, hidden);
        }
        simple-icon-lite {
          display: inline-flex;
          --simple-icon-height: var(--map-menu-item-icon-height);
          --simple-icon-width: var(--map-menu-item-icon-height);
          margin-right: 8px;
        }
        :host(:not([published])) {
          text-decoration: line-through;
          color: red;
          opacity: 0.5;
        }

        :host([hide-in-menu]) {
          display: none !important;
        }

        .title {
          text-transform: var(--map-menu-text-transform, none);
          font-size: var(--map-menu-font-size);
          font-weight: var(--map-menu-font-weight);
          text-overflow: ellipsis;
          vertical-align: middle;
          width: auto;
          white-space: nowrap;
          overflow: hidden;
          word-break: break-all;
        }
        a,
        a:visited {
          display: block;
          color: var(--map-menu-item-a-color, inherit);
          text-decoration: var(--map-menu-item-a-text-decoration, none);
        }
        :host(:dir(rtl)) {
          --map-menu-item-active-accent-direction: -1;
        }
        :host([active]) button,
        :host([active]) a button {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color, inherit)
          );
          font-weight: var(--map-menu-item-button-active-font-weight, bold);
          text-decoration: var(
            --map-menu-active-item-text-decoration,
            var(--map-menu-header-a-text-decoration-hover, none)
          );
          background-color: var(
            --map-menu-item-a-active-background-color,
            black
          );
          border-radius: var(--map-menu-item-border-radius, 0px);
          /* optional accent bar on the start edge of the active row, off
             unless a theme sets --map-menu-item-active-accent-width */
          box-shadow: inset
            calc(
              var(--map-menu-item-active-accent-direction, 1) *
                var(--map-menu-item-active-accent-width, 0px)
            )
            0 0 0
            var(
              --map-menu-item-active-accent-color,
              var(--ddd-theme-primary, currentColor)
            );
        }

        a:hover button,
        a:active button,
        a:focus button {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color, inherit)
          );
          text-decoration: var(--map-menu-header-a-text-decoration-hover, none);
          background-color: var(
            --map-menu-item-a-active-background-color,
            black
          );
          border-radius: var(--map-menu-item-border-radius, 0px);
        }
        button {
          cursor: pointer;
          color: inherit;
          transition: var(--ddd-duration-normal, 0.3s) ease-in all;
          display: flex;
          font-family: inherit;
          background-color: transparent;
          text-transform: none;
          width: 100%;
          justify-content: left;
          margin: 0px;
          border: 0;
          line-height: var(
            --map-menu-item-button-height,
            var(--map-menu-item-height)
          );
          padding: 10px 0 10px 30px;
          text-align: left;
          border-radius: 0;
          vertical-align: middle;
        }
        :host([is-nested]) button {
          padding: 10px 20px;
          text-align: left;
        }
        :host(:not([icon=""])) button {
          padding: 10px 0 10px 4px;
        }
        /* the ring of the page open now stands where an icon would */
        :host(:not([is-nested])) button.ring-no-icon {
          padding-left: var(--ddd-spacing-4);
        }
        :host([status="new"]) a::after {
          border-right: 8px solid green;
          content: "";
          margin-left: -8px;
        }
        :host([status="modified"]) a::after {
          border-right: 8px solid orange;
          content: "";
          margin-left: -8px;
        }
        :host([status="delete"]) a::after {
          border-right: 8px solid red;
          content: "";
          margin-left: -8px;
        }
        #unpublished {
          color: red;
        }
        .no-icon {
          display: inline-flex;
        }
        .ops {
          position: absolute;
          display: block;
          right: 0px;
          height: 40px;
          top: 0px;
          z-index: 2;
          margin: 0 4px 0 0;
        }
        .ops .op {
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
          --haxcms-page-operations-ops-icon-size: 12px;
          --haxcms-page-operations-ops-height: 16px;
          --haxcms-page-operations-ops-width: 16px;
          margin: 4px;
          color: var(--map-menu-item-a-active-color, black);
        }

        /* nothing moves with prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          :host,
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
          }
        }
      `,
    ];
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    const ring = hasActiveRing(this.activeProgress);
    return html` <a
        tabindex="-1"
        href="${this.url}"
        title="${this.linkTitle()}"
      >
        <button class="${ring && !this.icon ? "ring-no-icon" : ""}">
          ${
            !this.published
              ? html`<simple-icon-lite
                  id="unpublished"
                  title="${this.t.pageIsUnpublished}"
                  icon="icons:visibility-off"
                ></simple-icon-lite>`
              : ``
          }
          ${
            ring
              ? this.renderActiveRing()
              : this.icon
                ? html`
                    <simple-icon-lite
                      icon="${this.icon}"
                      id="icon"
                    ></simple-icon-lite>
                    ${
                      this.iconLabel
                        ? html`<simple-tooltip for="icon"
                            >${this.iconLabel}</simple-tooltip
                          >`
                        : ``
                    }
                  `
                : html`<div class="no-icon"></div>`
          }
          ${renderProgressMark(this.progress)}
          <span class="title"
            >${this.itemtitle}${this.renderProgress()}${this.renderActiveProgress()}</span
          >
        </button>
      </a>
      ${
        this.editControls && this.active
          ? html` <div class="ops">
              <haxcms-page-operations
                class="op"
                action-id="${this.id}"
              ></haxcms-page-operations>
            </div>`
          : ``
      }`;
  }
  // hover text of the link: the title, plus the percent of the page open now
  linkTitle() {
    return hasActiveRing(this.activeProgress)
      ? `${this.itemtitle}, ${activeRingText(this.activeProgress, this.t)}`
      : this.itemtitle;
  }
  // the ring around the icon area of the page open now (keeps the icon and
  // its page type tooltip)
  renderActiveRing() {
    return html`${renderActiveRing(this.activeProgress, this.icon, "icon")}
    ${
      this.icon && this.iconLabel
        ? html`<simple-tooltip for="icon">${this.iconLabel}</simple-tooltip>`
        : ``
    }`;
  }
  // spoken percent of the page open now (", 49% complete")
  renderActiveProgress() {
    return renderActiveRingLabel(this.activeProgress, this.t);
  }
  // spoken progress after the title (", Done"); nothing without progress
  renderProgress() {
    return renderProgressLabel(this.progress, this.t);
  }
  static get tag() {
    return "map-menu-item";
  }
  constructor() {
    super();
    this.editControls = false;
    this.isNested = false;
    this.icon = null;
    this.iconLabel = null;
    this.itemtitle = "";
    this.url = "";
    this.active = false;
    this.hovered = false;
    this.hideInMenu = false;
    this.published = false;
    this.locked = false;
    this.status = "";
    this.progress = "";
    this.activeProgress = null;
    this.t = {
      pageIsUnpublished: "Page is unpublished",
      ...MapMenuProgressStrings,
    };
    this.registerLocalization({
      context: this,
      namespace: "map-menu",
      localesPath:
        new URL("../locales/map-menu.es.json", import.meta.url).href + "/../",
    });
    setTimeout(() => {
      this.addEventListener("focusin", this.__active.bind(this));
      this.addEventListener("focusout", this.__deactive.bind(this));
      this.addEventListener("mouseover", this.__active.bind(this));
      this.addEventListener("mouseleave", this.__deactive.bind(this));
    }, 0);
  }

  __active() {
    this.hovered = true;
  }
  __deactive() {
    this.hovered = false;
  }
  /**
   * LitElement life cycle - properties definition
   */
  static get properties() {
    return {
      ...super.properties,
      icon: {
        type: String,
        reflect: true,
      },
      editControls: {
        type: Boolean,
        attribute: "edit-controls",
      },
      isNested: {
        type: Boolean,
        attribute: "is-nested",
      },
      hovered: {
        type: Boolean,
        reflect: true,
      },
      iconLabel: {
        type: String,
        attribute: "icon-label",
      },
      itemtitle: {
        type: String,
      },
      url: {
        type: String,
      },
      id: {
        type: String,
        reflect: true,
      },
      active: {
        type: Boolean,
        reflect: true,
      },
      selected: {
        type: String,
      },
      published: {
        type: Boolean,
        reflect: true,
      },
      hideInMenu: {
        type: Boolean,
        reflect: true,
        attribute: "hide-in-menu",
      },
      locked: {
        type: Boolean,
        reflect: true,
      },
      status: {
        type: String,
        reflect: true,
      },
      /**
       * Learner progress mark: done, in-progress, visited or not-started.
       * Empty (the default) shows no mark.
       */
      progress: {
        type: String,
        reflect: true,
      },
      /**
       * Percent (0 to 1) of the page this item opens, set only while it is
       * the page open now: a ring around the icon area shows it. null (the
       * default) shows no ring.
       */
      activeProgress: {
        type: Number,
        attribute: "active-progress",
      },
    };
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["id", "selected"].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
    });
    updateActiveRing(this, changedProperties);
  }
  __selectedChanged(selected, id) {
    if (selected === id) {
      Promise.resolve().then(() => {
        this.dispatchEvent(
          new CustomEvent("active-item", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this,
          }),
        );
      });
    }
  }

  _click() {
    this.blur();
    this.dispatchEvent(
      new CustomEvent("link-clicked", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { id: this.id },
      }),
    );
  }
}
globalThis.customElements.define(MapMenuItem.tag, MapMenuItem);
export { MapMenuItem };
