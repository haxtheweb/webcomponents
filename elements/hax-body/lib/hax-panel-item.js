import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/iron-icon/iron-icon.js";
/**
 * `hax-panel-item`
 * @customElement hax-panel-item
 * `A single button in the hax panel for consistency.`
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 */
class HAXPanelItem extends LitElement {
  constructor() {
    super();
    this.disabled = false;
    this.edged = "";
    this.icon = "editor:text-fields";
    this.label = "editor:text-fields";
    this.eventName = "button";
    this.value = "";
    setTimeout(() => {
      this.addEventListener("click", this._fireEvent);
    }, 0);
  }
  static get properties() {
    return {
      /**
       * Variant on button style for light
       */
      light: {
        type: Boolean,
        reflect: true
      },
      /**
       * Voice command to append for things that support data-voicecommand.
       */
      voiceCommand: {
        type: String,
        attribute: "voice-command"
      },
      /**
       * Support for disabled state buttons
       */
      disabled: {
        type: Boolean,
        reflect: true
      },
      /**
       * If we should apply a rounded edge to the button, opposite
       * to the direction that it's came from.
       */
      edged: {
        type: String,
        reflect: true
      },
      /**
       * Icon for the button.
       */
      icon: {
        type: String,
        reflect: true
      },
      /**
       * Label for the button.
       */
      label: {
        type: String,
        reflect: true
      },
      /**
       * Name of the event to bubble up as being tapped.
       * This can be used to tell other elements what was
       * clicked so it can take action appropriately.
       */
      eventName: {
        type: String,
        reflect: true,
        attribute: "event-name"
      },
      /**
       * Possible value to send along as well with the event.
       * Can help with normalized event names / selection of
       * options.
       */
      value: {
        type: String,
        reflect: true
      }
    };
  }
  static get tag() {
    return "hax-panel-item";
  }
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
        }
        paper-button {
          height: 48px;
          line-height: 48px;
          width: 48px;
          overflow: hidden;
          margin: 0;
          text-transform: none;
          background-color: var(--hax-panel-item-bg);
          color: var(--hax-panel-item-text);
          display: flex;
          padding: 8px;
          border-radius: 50%;
          border: 1px solid var(--hax-panel-item-border-color);
          min-width: unset;
          --paper-button-ink-color: var(--hax-panel-item-ink, black);
        }
        paper-button .button-inner {
          text-align: center;
          margin: 0 auto;
        }
        paper-button iron-icon {
          height: 24px;
          width: 24px;
          display: inline-flex;
        }
        paper-button:hover,
        paper-button:focus {
          color: var(--hax-panel-item-active);
          border: 1px solid var(--hax-panel-item-active-border-color);
        }

        paper-button[disabled] {
          opacity: 0.5;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
        :host([dark]) paper-button {
          border: solid 2px #000000;
          background-color: #000000 !important;
          color: var(--hax-color-bg-accent);
        }
        :host([large]) paper-button {
          height: 40px;
          width: 40px;
        }
        :host([dark]) paper-button:hover iron-icon,
        :host([dark]) paper-button:focus iron-icon {
          color: #ffffff !important;
        }
        :host([dark]) paper-button:hover {
          border: solid #0085ba 1px;
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
  /**
   * LitElement render
   */
  render() {
    return html`
      <paper-button raised id="button" .disabled="${this.disabled}">
        <div class="button-inner">
          <iron-icon icon="${this.icon}"></iron-icon>
        </div>
      </paper-button>
      <simple-tooltip for="button" position="bottom" offset="10">
        ${this.label}
      </simple-tooltip>
    `;
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
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
              callback: "_fireEvent"
            }
          })
        );
      }
    });
  }
  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent(e) {
    if (!this.disabled) {
      this.dispatchEvent(
        new CustomEvent("hax-item-selected", {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: {
            target: this,
            value: this.value,
            eventName: this.eventName
          }
        })
      );
    }
  }
}
customElements.define(HAXPanelItem.tag, HAXPanelItem);
export { HAXPanelItem };
