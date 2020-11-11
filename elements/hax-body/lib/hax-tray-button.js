import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
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
    this.disabled = false;
    this.mini = false;
    this.wide = false;
    this.eventData = null;
    this.eventName = null;
    this.icon = null;
    this.colorMeaning = false;
    this._defaultHoverColor = "";
    this._defaultColor = "";
    this.accentColor = this._defaultColor;
    this.hoverAccentColor = this._defaultColor;
    this.addEventListener("focusin", this._focusIn.bind(this));
    this.addEventListener("focusout", this._focusOut.bind(this));
    this.addEventListener("mouseover", this._focusIn.bind(this));
    this.addEventListener("mouseout", this._focusOut.bind(this));
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Voice command to append for things that support data-voicecommand.
       */
      voiceCommand: {
        type: String,
        attribute: "voice-command",
      },
      iconDark: {
        type: Boolean,
      },
      mini: {
        type: Boolean,
        reflect: true,
      },
      colorMeaning: {
        type: Boolean,
        attribute: "color-meaning",
      },
      wide: {
        type: Boolean,
        reflect: true,
      },
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Index position in the original list of imports
       */
      index: {
        type: Number,
      },
      eventName: {
        type: String,
        attribute: "event-name",
      },
      eventData: {
        type: String,
        attribute: "event-data",
      },
      /**
       * label
       */
      label: {
        type: String,
      },
      /**
       * Icon for the button, optional.
       */
      icon: {
        type: String,
      },
      /**
       * color name of the item
       */
      color: {
        type: String,
      },
    };
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --hax-tray-panel-accent-text: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --hax-tray-panel-accent: var(
            --simple-colors-default-theme-purple-8,
            #8a009b
          );
          --simple-fields-accent-color: var(
            --simple-colors-default-theme-purple-8,
            #8a009b
          );
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          margin: 1px 0;
          transition: all 0.5ms ease-in-out;
        }
        :host([disabled]) {
          pointer-events: none;
          opacity: 0.2;
        }
        simple-icon {
          --simple-icon-height: 20px;
          --simple-icon-width: 20px;
          transform: var(--hax-tray-button-rotate);
        }
        .item-label {
          margin-top: 4px;
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
        :host([wide]) button {
          align-items: center;
          justify-content: space-around;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
        button {
          text-transform: none;
          color: var(
            --hax-quick-button-accent-text,
            var(--simple-colors-default-theme-grey-12, #000)
          );
          background-color: var(
            --hax-quick-button-accent,
            var(--simple-colors-default-theme-grey-2, #eee)
          );
          border: 1px solid
            var(
              --hax-quick-button-accent,
              var(--simple-colors-default-theme-grey-3, #dddddd)
            );
          min-width: unset;
          cursor: pointer;
          align-items: center;
          height: 40px;
          display: flex;
          width: 100%;
          padding: 4px;
          margin: 0px;
          border-radius: 0;
          transition: all 0.5ms ease-in-out;
        }
        button:active,
        button:focus,
        button:hover {
          color: var(
            --hax-tray-panel-accent-text,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          background-color: var(
            --hax-tray-panel-accent,
            var(--hax-contextual-action-color)
          );
          border-color: var(
            --hax-tray-panel-accent,
            var(--hax-contextual-action-color)
          );
          transition: all 0.5ms ease-in-out;
        }
        button simple-icon {
          display: inline-block;
        }
        :host([mini]) {
          height: 30px;
          width: 30px;
        }
        :host([mini]) button {
          height: 30px;
          width: 30px;
        }
        :host([mini]) button simple-icon {
          --simple-icon-height: 18px;
          --simple-icon-width: 18px;
        }
        .item-title {
          margin-top: 8px;
          color: var(--simple-colors-default-theme-grey-12, #000);
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
          --simple-tooltip-background: var(
            --simple-colors-default-theme-grey-12,
            #000
          );
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: var(
            --simple-colors-default-theme-grey-1,
            #dddddd
          );
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-duration-in: 100ms;
          --simple-tooltip-duration-out: 0;
          --simple-tooltip-border-radius: 0;
          --simple-tooltip-font-size: 14px;
        }
      `,
    ];
  }
  render() {
    return html`
      <button
        title="${this.label}"
        ?disabled="${this.disabled}"
        @click="${this._fireEvent}"
      >
        ${this.icon
          ? html`
              <div class="button-inner">
                <simple-icon
                  icon="${this.icon}"
                  accent-color="${this.colorMeaning
                    ? this.accentColor
                    : "white"}"
                  ?dark="${this.colorMeaning ? true : this.iconDark}"
                ></simple-icon>
              </div>
            `
          : html``}
        ${this.mini
          ? html``
          : html` <div class="item-label">${this.label}</div> `}
      </button>
      ${this.mini ? html` <simple-tooltip>${this.label}</simple-tooltip> ` : ``}
    `;
  }
  _focusIn(e) {
    this.accentColor =
      this.hoverAccentColor === this._defaultColor
        ? this._defaultHoverColor
        : this.hoverAccentColor;
    if (this.hoverAccentColor) {
      this.iconDark = true;
    }
  }
  _focusOut(e) {
    if (!this.colorMeaning) {
      this.accentColor = this._defaultColor;
    } else {
      this.accentColor = this.color;
    }
    if (this.hoverAccentColor) {
      this.iconDark = false;
    }
  }
  _voiceEvent(e) {
    this._fireEvent(e);
    this.click();
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
          value: this.eventData,
        },
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
      if (propName == "voiceCommand") {
        this.dispatchEvent(
          new CustomEvent("hax-add-voice-command", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: {
              command: ":name: " + this[propName],
              context: this,
              callback: "_voiceEvent",
            },
          })
        );
      }
      if (propName == "color") {
        if (
          (!this.accentColor || this.color !== this._defaultColor) &&
          this.colors[this.color]
        ) {
          this.hoverAccentColor = this.color;
        }
      }
      if (propName == "colorMeaning" && this.colorMeaning) {
        this.accentColor = this.color;
      }
    });
  }
}
customElements.define(HAXTrayButton.tag, HAXTrayButton);
export { HAXTrayButton };
