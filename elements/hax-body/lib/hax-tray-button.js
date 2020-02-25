import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
/**
 * `hax-tray-button`
 * `A button in the tray`
 */
class HAXTrayButton extends SimpleColors {
  static get tag() {
    return "hax-tray-button";
  }
  constructor() {
    super();
    this.mini = false;
    this.wide = false;
    this.eventData = null;
    this.eventName = null;
    this.icon = null;
    this.hoverAccentColor = "green";
    this.addEventListener("focusin", this._focusIn.bind(this));
    this.addEventListener("focusout", this._focusOut.bind(this));
    this.addEventListener("mouseover", this._focusIn.bind(this));
    this.addEventListener("mouseout", this._focusOut.bind(this));
  }
  static get properties() {
    return {
      ...super.properties,
      mini: {
        type: Boolean,
        reflect: true
      },
      wide: {
        type: Boolean,
        reflect: true
      },
      /**
       * Index position in the original list of imports
       */
      index: {
        type: Number
      },
      eventName: {
        type: String,
        attribute: "event-name"
      },
      eventData: {
        type: String,
        attribute: "event-data"
      },
      /**
       * label
       */
      label: {
        type: String
      },
      /**
       * Icon for the button, optional.
       */
      icon: {
        type: String
      },
      /**
       * color name of the item
       */
      color: {
        type: String
      }
    };
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          margin: 1px 0;
          background-color: var(--simple-colors-default-theme-accent-8, #000);
        }
        iron-icon {
          width: 20px;
          height: 20px;
          color: var(--simple-colors-default-theme-grey-1, #fff);
        }
        .item-label {
          margin-top: 4px;
          color: var(--simple-colors-default-theme-grey-1, #fff);
          width: 60px;
          font-size: 10px;
          line-height: 10px;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-word;
        }
        :host([wide]) {
          display: block;
          width: 100%;
        }
        :host([wide]) .item-label {
          width: unset;
        }
        :host([wide]) paper-button {
          align-items: center;
          justify-content: space-around;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
        paper-button {
          color: var(--hax-color-text);
          text-transform: none;
          background-color: var(--hax-color-bg-accent);
          min-width: unset;
          cursor: pointer;
          height: 40px;
          display: flex;
          padding: 4px;
          margin: 0px;
          color: #ffffff;
          border-radius: 0;
          transition: box-shadow 0.3s;
        }
        paper-button iron-icon {
          height: 20px;
          width: 20px;
          color: var(--simple-colors-default-theme-grey-1);
          display: inline-block;
        }
        :host([mini]) {
          height: 30px;
          width: 30px;
        }
        :host([mini]) paper-button {
          height: 30px;
          width: 30px;
        }
        :host([mini]) paper-button iron-icon {
          height: 18px;
          width: 18px;
        }
        .item-title {
          margin-top: 8px;
          color: var(--hax-color-text);
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          line-height: 12px;
          height: 12px;
          text-align: center;
        }
        .button-inner {
          display: flex;
        }
        simple-tooltip {
          font-size: 16px;
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-duration-in: 100ms;
          --simple-tooltip-duration-out: 0;
          --simple-tooltip-border-radius: 0;
          --simple-tooltip-font-size: 14px;
        }
      `
    ];
  }
  render() {
    return html`
      <paper-button
        title="${this.label}"
        raised
        @click="${this._fireEvent}"
        .data-voicecommand="select ${this.title}"
      >
        ${this.icon
          ? html`
              <div class="button-inner">
                <iron-icon icon="${this.icon}"></iron-icon>
              </div>
            `
          : html``}
        ${this.mini
          ? html``
          : html`
              <div class="item-label">${this.label}</div>
            `}
      </paper-button>
      ${this.mini
        ? html`
            <simple-tooltip>${this.label}</simple-tooltip>
          `
        : ``}
    `;
  }
  _focusIn(e) {
    this.accentColor =
      this.hoverAccentColor === "grey" ? "green" : this.hoverAccentColor;
  }
  _focusOut(e) {
    this.accentColor = null;
  }
  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent(e) {
    this.dispatchEvent(
      new CustomEvent("hax-tray-button-click", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          eventName: this.eventName,
          index: this.index,
          value: this.eventData
        }
      })
    );
  }
  /**
   * LitElement life cycle - properties changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "color") {
        this._getAccentColor(this[propName], oldValue);
      }
    });
  }
  _getAccentColor(color) {
    if (
      (!this.accentColor || this.accentColor === "grey") &&
      this.colors[color]
    ) {
      this.hoverAccentColor = color;
    }
  }
}
customElements.define(HAXTrayButton.tag, HAXTrayButton);
export { HAXTrayButton };
