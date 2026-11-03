import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminScheme,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import { MerlinDarkScheme } from "./super-daemon-hax-ui.js";

export class SuperDaemonRow extends I18NMixin(SimpleColors) {
  constructor() {
    super();
    this.t = {
      moreDetails: "More details",
      details: "Details",
      opensInNewWindow: "Opens in a new window",
    };
    this.registerLocalization({
      context: this,
      namespace: "super-daemon",
      basePath: import.meta.url + "/../../",
    });
    this.title = null;
    this.path = null;
    this.icon = null;
    this.image = null;
    this.textCharacter = null;
    this.eventName = null;
    this.shortcut = null;
    this.externalLink = false;
    this.more = false;
    this.showDetails = false;
    this.value = {};
    this.tags = [];
    this.groupLabel = null;
    this.detailsInPane = false;
    this.shadowRootOptions = {
      ...SimpleColors.shadowRootOptions,
      delegatesFocus: true,
    };
    this.active = false;
  }
  static get tag() {
    return "super-daemon-row";
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      path: { type: String },
      icon: { type: String },
      mini: { type: Boolean, reflect: true },
      image: { type: String },
      textCharacter: { type: String, attribute: "text-character" },
      more: { type: Boolean },
      showDetails: { type: Boolean },
      eventName: { type: String, attribute: "event-name" },
      shortcut: { type: String },
      externalLink: { type: Boolean, attribute: "external-link" },
      value: { type: Object },
      tags: { type: Array },
      active: { type: Boolean, reflect: true },
      striped: { type: Boolean, reflect: true },
      groupLabel: { type: String, attribute: "group-label" },
      detailsInPane: {
        type: Boolean,
        reflect: true,
        attribute: "details-in-pane",
      },
    };
  }

  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminScheme,
      MerlinDarkScheme,
      css`
        /* HAX UI row: the same row as site admin and outline-designer.
           Selection (keyboard or hover) is the rail look: a soft accent
           fill plus a 3px accent bar on the left edge. */
        :host {
          display: block;
          margin: 0 var(--hax-ui-gap-md);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: transparent;
          --super-daemon-row-icon: var(--hax-ui-icon);
        }
        :host([mini]) {
          margin: 0 var(--hax-ui-gap);
        }
        .group-label {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
          padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-md) var(--hax-ui-gap);
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .group-label::after {
          content: "";
          flex: 1;
          border-top: 1px solid var(--hax-ui-line);
        }
        :host([mini]) .group-label {
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-md) 2px;
        }
        :host([mini]) .group-label::after {
          display: none;
        }
        button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
          width: 100%;
          min-height: calc(var(--hax-ui-row-height) + var(--hax-ui-gap-lg));
          padding: 6px var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          font-family: inherit;
          font-size: inherit;
          color: inherit;
          text-align: left;
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
        }
        :host([mini]) button {
          gap: var(--hax-ui-gap-md);
          min-height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
        }
        :host([active]) button {
          background-color: var(--hax-ui-selected);
          box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
        }
        button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        /* modal rows: the icon sits in the site admin card tile (.acard .ic) */
        .tile {
          flex: none;
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
          overflow: hidden;
        }
        :host([active]) .tile {
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        :host([mini]) .tile {
          width: auto;
          height: auto;
          background-color: transparent;
          color: var(--hax-ui-text-muted);
        }
        :host([mini][active]) .tile {
          background-color: transparent;
        }
        .result-icon {
          display: inline-flex;
          --simple-icon-height: var(--super-daemon-row-icon);
          --simple-icon-width: var(--super-daemon-row-icon);
          --simple-icon-color: currentColor;
        }
        .result-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        :host([mini]) .result-image {
          width: var(--hax-ui-icon);
          height: var(--hax-ui-icon);
          border-radius: 2px;
        }
        .result-textCharacter {
          display: inline-flex;
          font-size: 18px;
          line-height: 1;
        }
        :host([mini]) .result-textCharacter {
          font-size: var(--hax-ui-icon);
        }
        .label-wrap {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2px;
        }
        .label-wrap .action {
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-medium, 500);
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        :host([mini]) .label-wrap .action {
          font-weight: var(--ddd-font-weight-regular, 400);
        }
        :host([active]) .label-wrap .action {
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .label-wrap .path {
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.2;
          color: var(--hax-ui-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        /* Tags never render in Merlin rows: the .tags markup was removed
           as dead DOM (it was display: none in every mode). The tags
           property stays on the element API for programmatic consumers. */
        .shortcut {
          flex: none;
          display: inline-grid;
          place-items: center;
          height: 20px;
          padding: 0 6px;
          font-family: inherit;
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1;
          white-space: nowrap;
          border-radius: var(--hax-ui-radius);
          border: 1px solid var(--hax-ui-line-strong);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-surface);
        }
        .external-link-icon {
          flex: none;
          display: inline-flex;
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          color: var(--hax-ui-text-muted);
        }
        .enter-icon {
          flex: none;
          display: none;
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          color: var(--hax-ui-accent-strong);
        }
        :host([active]) .enter-icon {
          display: inline-flex;
        }
        .more {
          flex: none;
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          width: var(--hax-ui-icon);
          height: var(--hax-ui-icon);
          display: block;
          color: var(--hax-ui-text-muted);
        }
        div.more {
          display: none;
        }
        /* in the modal the side pane shows details on wide screens, so the
           inline toggle hides there; under 800px the pane is hidden and the
           toggle comes back */
        @media screen and (min-width: 801px) {
          :host([details-in-pane]) .more,
          :host([details-in-pane]) details {
            display: none;
          }
        }
        summary {
          display: none;
        }
        @keyframes details-show {
          from {
            opacity: 0;
            transform: var(--details-translate, translateY(-0.5em));
          }
          to {
            opacity: 1;
            transform: var(--details-translate, translateY(0));
          }
        }
        details[open] {
          padding: 0 var(--hax-ui-gap-lg) var(--hax-ui-gap-lg)
            calc(32px + 2 * var(--hax-ui-gap-lg));
          animation: details-show 100ms ease-in-out;
          line-height: 1.4;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        @media (prefers-reduced-motion: reduce) {
          button {
            transition: none;
          }
          details[open] {
            animation: none;
          }
        }
      `,
    ];
  }

  keyEvent(e) {
    // ensure that the daemon dialog does not accidentally duplicate or get this
    // when our focus was on a specific item while using the keyboard
    if (e.code === "Enter" || e.code === "Space") {
      this.selected();
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  clickEvent(_e) {
    this.selected();
  }

  selected() {
    // execute the event
    this.dispatchEvent(
      new CustomEvent("super-daemon-row-selected", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: this,
      }),
    );
    this.dispatchEvent(
      new CustomEvent(this.eventName, {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: this.value,
      }),
    );
    // programs will run in the same window so we don't want to close the dialog
    // as every non-program running a single command would have to declare
    // when it wanted the dialog closed so we just do it automatically
    if (this.eventName !== "super-daemon-run-program") {
      // close dialog bc we executed that command
      this.dispatchEvent(
        new CustomEvent("super-daemon-close", {
          composed: true,
          bubbles: true,
          cancelable: true,
          detail: this,
        }),
      );
    }
  }
  _focusIn(_e) {
    this.active = true;
  }
  _focusOut(_e) {
    this.active = false;
  }

  focus() {
    this.shadowRoot.querySelector("button").focus();
  }

  /**
   * Option paths read as breadcrumbs: "CMS/action/add/page" becomes
   * "CMS › action › add › page". Developer and slash prefixes drop.
   * @param {string} path
   * @returns {string}
   */
  pathLabel(path) {
    if (!path || typeof path !== "string") {
      return "";
    }
    return path
      .replace(/^[>/]+/, "")
      .split("/")
      .filter((part) => part !== "")
      .join(" \u203a ");
  }

  pickColor(val) {
    if (val === 0) {
      return "blue";
    }
    return "orange";
  }
  render() {
    return html`
      <!-- aria-selected lives on the host (role=option, set dynamically by
           super-daemon-ui); hardcoding it on the inner button as false
           conflicted with the host value for assistive tech -->
      ${this.groupLabel
        ? html`<div class="group-label" part="group-label" aria-hidden="true">
            ${this.groupLabel}
          </div>`
        : ``}
      <button
        part="button"
        tabindex="-1"
        @click="${this.clickEvent}"
        @keydown="${this.keyEvent}"
        @mouseover="${this._focusIn}"
        @mouseout="${this._focusOut}"
        @focusin="${this._focusIn}"
        @focusout="${this._focusOut}"
      >
        ${this.icon || this.image || this.textCharacter
          ? html`<span class="tile" part="tile">
              ${this.icon
                ? html`<simple-icon-lite
                    icon="${this.icon}"
                    class="result-icon"
                  ></simple-icon-lite>`
                : ``}
              ${this.image
                ? html`<img src="${this.image}" class="result-image" alt="" />`
                : ``}
              ${this.textCharacter
                ? html`<span class="result-textCharacter"
                    >${this.textCharacter}</span
                  >`
                : ``}
            </span>`
          : ``}
        <div class="label-wrap" part="label-wrap">
          <div class="action" part="action">${this.title}</div>
          ${!this.mini && this.pathLabel(this.path)
            ? html`<div class="path" part="path">
                ${this.pathLabel(this.path)}
              </div>`
            : ``}
        </div>
        ${this.shortcut
          ? html`<kbd class="shortcut" part="shortcut" aria-hidden="true"
              >${this.shortcut}</kbd
            >`
          : ""}
        ${this.externalLink
          ? html`<simple-icon-lite
              icon="${HaxUiAdminIcons.external}"
              class="external-link-icon"
              title="${this.t.opensInNewWindow}"
              aria-hidden="true"
            ></simple-icon-lite>`
          : ""}
        ${this.more
          ? html`<simple-icon-button
              class="more"
              ?dark="${this.dark}"
              accent-color="${this.accentColor}"
              label="${this.t.moreDetails || "More details"}"
              icon="${HaxUiAdminIcons.more}"
              aria-controls="details"
              @click="${this.toggleDetailsClick}"
              @keydown="${this.toggleDetailsKey}"
            ></simple-icon-button>`
          : html`<div class="more"></div>`}
        <simple-icon-lite
          icon="${HaxUiAdminIcons.enter}"
          class="enter-icon"
          aria-hidden="true"
        ></simple-icon-lite>
      </button>
      ${this.more
        ? html`<details
            id="details"
            ?open="${this.showDetails}"
            @toggle="${this.openChanged}"
          >
            <summary>${this.t.details || "Details"}</summary>
            <div>
              <slot></slot>
            </div>
          </details>`
        : ``}
    `;
  }
  // toggle on click but prevent the event from bubbling up
  toggleDetailsKey(e) {
    if (e.key === "Enter" || e.key === "Space") {
      this.showDetails = !this.showDetails;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  // toggle on click but prevent the event from bubbling up
  toggleDetailsClick(e) {
    this.showDetails = !this.showDetails;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  openChanged(e) {
    this.showDetails = e.target.open;
  }
}

globalThis.customElements.define(SuperDaemonRow.tag, SuperDaemonRow);
