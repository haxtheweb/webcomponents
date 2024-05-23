import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-fields/lib/simple-tag.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

export class SuperDaemonRow extends SimpleColors {
  constructor() {
    super();
    this.title = null;
    this.path = null;
    this.icon = null;
    this.image = null;
    this.textCharacter = null;
    this.eventName = null;
    this.more = false;
    this.showDetails = false;
    this.value = {};
    this.tags = [];
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
      value: { type: Object },
      tags: { type: Array },
      active: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: block;
          margin: 8px 16px;
          color: var(--simple-colors-default-theme-accent-12, black);
          background-color: var(--simple-colors-default-theme-accent-1, white);
        }
        :host([active]) {
          cursor: pointer;
          border-radius: 4px;
          background-color: var(
            --super-daemon-row-hover,
            rgba(0, 100, 200, 0.1)
          );
          outline: 1px solid black;
        }
        :host([mini]) {
          margin: 0;
          --super-daemon-row-label: 14px;
          --super-daemon-row-path: 10px;
        }
        button {
          display: flex;
          padding: 8px;
          width: 100%;
          border-radius: 0;
          color: var(--simple-colors-default-theme-accent-12, black);
          background-color: var(--simple-colors-default-theme-accent-1, white);
          border: none;
          align-items: middle;
          justify-content: space-between;
          background-color: transparent;
        }
        :host([mini]) button {
          padding: 4px;
          justify-content: flex-start;
          align-items: center;
        }
        .result-icon {
          display: inline-flex;
          --simple-icon-height: var(--super-daemon-row-icon, 50px);
          --simple-icon-width: var(--super-daemon-row-icon, 50px);
        }
        :host([mini]) .result-icon {
          --simple-icon-height: var(--super-daemon-row-icon, 20px);
          --simple-icon-width: var(--super-daemon-row-icon, 20px);
        }
        .result-image {
          display: inline-flex;
          height: 64px;
          width: 100px;
        }
        .result-textCharacter {
          display: inline-flex;
          max-height: 64px;
          max-width: 100px;
          font-size: 42px;
        }
        :host([mini]) .result-textCharacter {
          font-size: 20px;
          height: 20px;
          width: 20px;
        }
        :host([mini]) .result-image {
          height: 32px;
          width: 50px;
        }
        .label-wrap {
          margin-left: 16px;
          min-width: 70%;
          overflow: hidden;
          text-align: left;
        }
        :host([mini]) .label-wrap {
          width: 100%;
          margin-left: 12px;
        }
        .tags {
          line-height: 32px;
          height: 64px;
          text-align: left;
          overflow: hidden;
        }
        :host([mini]) .tags {
          display: none;
        }
        .label-wrap .action {
          font-size: var(--super-daemon-row-label, 32px);
          font-weight: bold;
          max-width: 90%;
          word-break: break-all;
          overflow: hidden;
          line-height: var(--super-daemon-row-label, 32px);
          height: var(--super-daemon-row-label, 32px);
        }
        :host([mini]) .label-wrap .action {
          max-width: unset;
        }
        .label-wrap .path {
          font-size: var(--super-daemon-row-path, 20px);
          font-style: italic;
          margin-top: 6px;
          overflow-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
          max-width: 80%;
          line-height: var(--super-daemon-row-path, 20px);
          height: var(--super-daemon-row-path, 20px);
        }
        :host([mini]) .label-wrap .path {
          max-width: unset;
        }
        .more {
          --simple-icon-width: 40px;
          --simple-icon-height: 40px;
          width: 40px;
          height: 40px;
          display: block;
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
          padding: 0 16px 16px 16px;
          animation: details-show 100ms ease-in-out;
          line-height: 16px;
          font-size: 12px;
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

  clickEvent(e) {
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
  _focusIn(e) {
    this.active = true;
  }
  _focusOut(e) {
    this.active = false;
  }

  focus() {
    this.shadowRoot.querySelector("button").focus();
  }

  pickColor(val) {
    if (val === 0) {
      return "blue";
    }
    return "orange";
  }
  render() {
    return html`
      <button
        part="button"
        @click="${this.clickEvent}"
        @keydown="${this.keyEvent}"
        @mouseover="${this._focusIn}"
        @mouseout="${this._focusOut}"
        @focusin="${this._focusIn}"
        @focusout="${this._focusOut}"
      >
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
        <div class="label-wrap" part="label-wrap">
          <div class="action" part="action">${this.title}</div>
          <div class="path" part="path">${this.path}</div>
        </div>
        <div class="tags" part="tags">
          ${this.tags.map(
            (tag, i) =>
              html` <simple-tag
                accent-color="${this.pickColor(i)}"
                value="${tag}"
                part="tag tag-${i}"
              ></simple-tag>`,
          )}
        </div>
        ${this.more
          ? html`<simple-icon-button
              class="more"
              ?dark="${this.dark}"
              accent-color="${this.accentColor}"
              label="More details"
              icon="more-vert"
              aria-controls="details"
              @click="${this.toggleDetailsClick}"
              @keydown="${this.toggleDetailsKey}"
            ></simple-icon-button>`
          : html`<div class="more"></div>`}
      </button>
      ${this.more
        ? html`<details
            id="details"
            ?open="${this.showDetails}"
            @toggle="${this.openChanged}"
          >
            <summary>Details</summary>
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

customElements.define(SuperDaemonRow.tag, SuperDaemonRow);
