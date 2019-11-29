import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icon/iron-icon.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";

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
        type: Boolean
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
        paper-tooltip {
          font-size: 16px;
          --paper-tooltip-background: #000000;
          --paper-tooltip-opacity: 1;
          --paper-tooltip-text-color: #ffffff;
          --paper-tooltip-delay-in: 0;
          --paper-tooltip-duration-in: 200ms;
          --paper-tooltip-duration-out: 0;
        }
      `
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <custom-style>
        <style>
          paper-tooltip {
            --paper-tooltip: {
              border-radius: 0;
              font-size: 14px;
            }
          }
        </style>
      </custom-style>
      <paper-button raised id="button" .disabled="${this.disabled}">
        <div class="button-inner">
          <iron-icon icon="${this.icon}"></iron-icon>
        </div>
      </paper-button>
      <paper-tooltip for="button" position="bottom" offset="10">
        ${this.label}
      </paper-tooltip>
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
customElements.define(HAXPanelItem.tag, HAXPanelItem);
export { HAXPanelItem };
