import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-fields/lib/simple-tag.js";

export class SuperDaemonRow extends LitElement {
  constructor() {
    super();
    this.title = null;
    this.path = null;
    this.icon = null;
    this.key = null;
    this.eventName = null;
    this.value = {};
    this.tags = [];
    this.shadowRootOptions = {
      ...LitElement.shadowRootOptions,
      delegatesFocus: true,
    };
  }
  static get tag() {
    return "super-daemon-row";
  }

  static get properties() {
    return {
      title: { type: String },
      path: { type: String },
      icon: { type: String },
      key: { type: String },
      eventName: { type: String, attribute: "event-name" },
      value: { type: Object },
      tags: { type: Array },
    };
  }

  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host {
          display: block;
          margin: 8px 16px;
        }
        button:focus,
        button:hover {
          background-color: var(
            --super-daemon-row-hover,
            rgba(0, 100, 200, 0.1)
          );
          outline: 2px solid black;
        }
        button {
          display: flex;
          padding: 16px;
          width: 100%;
          border-radius: 8px;
          border: none;
          align-items: middle;
          justify-content: space-between;
          background-color: transparent;
        }
        :host simple-icon-lite {
          display: inline-flex;
          --simple-icon-height: 50px;
          --simple-icon-width: 50px;
        }
        .label-wrap {
          min-width: 50%;
          overflow: hidden;
          text-align: left;
        }
        .tags {
          width: 30%;
          line-height: 32px;
          height: 64px;
          overflow: hidden;
        }
        .label-wrap .action {
          font-size: 32px;
          font-weight: bold;
        }
        .label-wrap .path {
          font-size: 20px;
          font-style: italic;
          margin-top: 8px;
        }
        .key-combo {
          font-size: 42px;
          font-weight: bold;
          font-style: italic;
        }
        .keyboard-shortcut {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          color: rgba(0, 0, 0, 0.7);
          box-shadow: rgb(209 213 219) 0px -4px 0px inset,
            rgb(0 0 0 / 40%) 0px 1px 1px;
          padding: 6px 8px;
          margin: 0px auto;
          display: block;
          font-size: 14px;
          word-spacing: 1px;
          letter-spacing: -2px;
          font-family: "Press Start 2P", "Trebuchet MS", "Lucida Sans Unicode",
            "Lucida Grande", "Lucida Sans", Arial, sans-serif;
        }
      `,
    ];
  }

  selected(e) {
    // execute the event
    this.dispatchEvent(
      new CustomEvent(this.eventName, {
        composed: true,
        bubbles: true,
        detail: this.value,
      })
    );
    // close dialog bc we executed that command
    this.dispatchEvent(
      new CustomEvent("super-daemon-close", {
        composed: true,
        bubbles: true,
        detail: true,
      })
    );
  }
  pickColor(val) {
    if (val === 0) {
      return "blue";
    }
    return "orange";
  }
  render() {
    return html`
      <button @click="${this.selected}">
        <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
        <div class="label-wrap">
          <div class="action">${this.title}</div>
          <div class="path">${this.path}</div>
        </div>
        <div class="tags">
          ${this.tags.map(
            (tag, i) => html` <simple-tag
              accent-color="${this.pickColor(i)}"
              value="${tag}"
            ></simple-tag>`
          )}
        </div>
        <div class="key-combo">
          ${this.key
            ? html`<kbd class="keyboard-shortcut">${this.key}</kbd>`
            : ``}
        </div>
      </button>
    `;
  }
}

customElements.define(SuperDaemonRow.tag, SuperDaemonRow);
