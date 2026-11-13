/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
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
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
class MapMenuHeader extends I18NMixin(LitElement) {
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
          transition: var(--ddd-duration-normal, 0.3s) ease-in all;
        }

        :host([hovered]) {
          opacity: var(--ddd-opacity-80, 0.8);
        }
        :host(:hover),
        :host(:focus) {
          opacity: 1;
        }

        a,
        a:visited {
          display: block;
          color: var(--map-menu-item-a-color, inherit);
          text-decoration: var(--map-menu-header-a-text-decoration, none);
          transition: background-color var(--ddd-duration-normal, 0.3s) ease;
          background-color: transparent;
        }

        :host(:dir(rtl)) {
          --map-menu-item-active-accent-direction: -1;
        }
        :host([active]) button {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color, inherit)
          );
          font-weight: var(--map-menu-item-button-active-font-weight, bold);
          text-decoration: var(
            --map-menu-active-item-text-decoration,
            var(--map-menu-header-a-text-decoration-hover, none)
          );
          background-color: var(--map-menu-item-a-active-background-color);
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
        :host([hovered]) button,
        a:hover button,
        a:focus-within button,
        a:focus button {
          color: var(
            --map-menu-item-a-active-color,
            var(--map-menu-item-a-color, inherit)
          );
          text-decoration: var(--map-menu-header-a-text-decoration-hover, none);
          background-color: var(--map-menu-item-a-active-background-color);
          border-radius: var(--map-menu-item-border-radius, 0px);
        }

        #link {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
        }

        :host([hovered]) simple-icon-lite,
        :host(:hover) simple-icon-lite,
        :host(:focus-within) simple-icon-lite,
        :host(:focus) simple-icon-lite {
          visibility: none;
          opacity: 0;
          pointer-events: none;
        }

        :host .progress-mark[data-progress] simple-icon-lite {
          visibility: visible;
          opacity: 1;
          margin: 0;
        }
        :host .active-ring .ddd-ring simple-icon-lite {
          visibility: visible;
          opacity: 1;
          margin: 0;
        }

        simple-icon-lite {
          color: inherit;
          margin-left: 4px;
          display: inline-flex;
          --simple-icon-height: var(--map-menu-item-icon-height);
          --simple-icon-width: var(--map-menu-item-icon-height);
        }

        .title {
          text-transform: var(--map-menu-text-transform, none);
          font-size: var(--map-menu-font-size);
          font-weight: var(--map-menu-font-weight);
          text-overflow: ellipsis;
          vertical-align: middle;
          max-width: 240px;
          margin-left: var(--map-menu-header-title-margin, 8px);
          white-space: nowrap;
          overflow: hidden;
          word-break: break-all;
        }

        button {
          transition: var(--ddd-duration-normal, 0.3s) ease-in all;
          cursor: pointer;
          font-family: inherit;
          color: inherit;
          display: flex;
          background-color: transparent;
          text-transform: none;
          width: 100%;
          justify-content: left;
          margin: 0;
          border: 0px;
          padding: var(--map-menu-header-button-padding, 10px 20px);
          text-align: left;
          border-radius: 0px;
          vertical-align: middle;
          line-height: var(
            --map-menu-item-button-height,
            var(--map-menu-item-height)
          );
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
          color: var(--simple-colors-default-theme-red-10, red);
        }
        :host([hide-in-menu]) {
          display: none !important;
        }
        :host(:not([icon=""])) button {
          padding-left: 0;
        }
        :host(:not([icon=""])[is-flex]) button {
          padding: var(--map-menu-header-button-padding);
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
          color: var(
            --map-menu-item-a-active-color,
            var(--ddd-theme-default-black, black)
          );
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
                      part="icon"
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
                : ``
          }
          ${renderProgressMark(this.progress)}
          <div class="title">${this.renderTitle()}</div>
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
    // without an icon of its own the row's control is the expand chevron:
    // the ring traces it instead of standing beside it
    return html`${renderActiveRing(
      this.activeProgress,
      this.icon,
      "icon",
      !this.icon,
    )}
    ${
      this.icon && this.iconLabel
        ? html`<simple-tooltip for="icon">${this.iconLabel}</simple-tooltip>`
        : ``
    }`;
  }
  // the title, then what is spoken after it
  renderTitle() {
    return html`${this.itemtitle}${this.renderProgress()}${this.renderActiveProgress()}`;
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
    return "map-menu-header";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.editControls = false;
    this.isFlex = false;
    this.iconLabel = null;
    this.icon = null;
    this.url = "";
    this.status = "";
    this.opened = false;
    this.active = false;
    this.published = true;
    this.hideInMenu = false;
    this.hovered = false;
    this.locked = false;
    this.itemtitle = "";
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
      this.addEventListener("click", this.__tap.bind(this));
      this.addEventListener("keydown", this.__keydown.bind(this));
    }, 0);
  }

  /**
   * LitElement life cycle - willUpdate: derive reactive state before render
   * so it batches into the current update cycle. Setting __collapseIcon /
   * __collapseAria in updated() scheduled a redundant second update
   * (Lit change-in-update warning).
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (
      changedProperties.has("opened") &&
      changedProperties.get("opened") !== undefined
    ) {
      if (this.opened) {
        this.__collapseIcon = "icons:expand-more";
        this.__collapseAria = "collapse menu";
      } else {
        this.__collapseIcon = "icons:chevron-right";
        this.__collapseAria = "expand menu";
      }
    }
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
  /**
   * LitElement life cycle - properties definition
   */
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      opened: {
        type: Boolean,
        reflect: true,
      },
      itemtitle: {
        type: String,
      },
      iconLabel: {
        type: String,
        attribute: "icon-label",
      },
      editControls: {
        type: Boolean,
        attribute: "edit-controls",
      },
      isFlex: {
        type: Boolean,
        attribute: "is-flex",
      },
      url: {
        type: String,
      },
      hideInMenu: {
        type: Boolean,
        reflect: true,
        attribute: "hide-in-menu",
      },
      id: {
        type: String,
        reflect: true,
      },
      icon: {
        type: String,
        reflect: true,
      },
      active: {
        type: Boolean,
        reflect: true,
      },
      hovered: {
        type: Boolean,
        reflect: true,
      },
      published: {
        type: Boolean,
        reflect: true,
      },
      locked: {
        type: Boolean,
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
      selected: {
        type: String,
        reflect: true,
      },
      __collapseIcon: {
        type: String,
      },
      __collapseAria: {
        type: String,
      },
    };
  }
  _openedChanged(newValue, _oldValue) {
    if (newValue) {
      this.__collapseIcon = "icons:expand-more";
      this.__collapseAria = "collapse menu";
    } else {
      this.__collapseIcon = "icons:chevron-right";
      this.__collapseAria = "expand menu";
    }
  }
  __selectedChanged(selected, id) {
    // guard empties: an unset id and an unset selected are both empty
    // strings on first paint and must not count as a match (they used to,
    // which auto-opened the submenu via toggle-header)
    if (selected && id && selected === id) {
      if (!this.parentNode.expanded) {
        this.dispatchEvent(
          new CustomEvent("toggle-header", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: true,
          }),
        );
      }
      this.dispatchEvent(
        new CustomEvent("active-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );
    }
  }

  __tap(e) {
    // send to toggle event
    this.__toggleEventHandler(e);
  }

  __keydown(e) {
    // send to toggle event
    if (e.key === "Enter") {
      this.__toggleEventHandler(e);
    }
  }

  __toggleEventHandler(_e) {
    if (!this.parentNode.expanded) {
      this.dispatchEvent(
        new CustomEvent("toggle-header", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true,
        }),
      );
    }
  }
}
globalThis.customElements.define(MapMenuHeader.tag, MapMenuHeader);
export { MapMenuHeader };
