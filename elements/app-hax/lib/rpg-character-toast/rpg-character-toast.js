import { css, html, unsafeCSS } from "lit";
import { SimpleToastEl } from "@lrnwebcomponents/simple-toast/lib/simple-toast-el.js";
import "@lrnwebcomponents/rpg-character/rpg-character.js";
import "@lrnwebcomponents/future-terminal-text/future-terminal-text.js";

const SpeechBubbleL = new URL("./images/SpeechBubbleL.svg", import.meta.url)
  .href;
const SpeechBubbleMiddle = new URL(
  "./images/SpeechBubbleMiddle.svg",
  import.meta.url
).href;
const SpeechBubbleR = new URL("./images/SpeechBubbleR.svg", import.meta.url)
  .href;
export class RPGCharacterToast extends SimpleToastEl {
  static get tag() {
    return "rpg-character-toast";
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.setDefaultToast();
    this.key = null;
    this.merlin = false;
    this.phrases = {};
    this.future = false;
    this.fire = false;
    this.text = "";
    this.hat = "coffee";
    this.walking = false;
    this.word = null;
    this.addEventListener("click", () => {
      this.opened = false;
    });
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host([opened]) {
          display: block;
        }

        future-terminal-text {
          width: 500px;
        }

        .merlin {
          --simple-icon-height: 100px;
          --simple-icon-width: 100px;
          background-color: var(--simple-colors-default-theme-accent-1, white);
          display: block;
          height: 150px;
          width: 100px;
          margin: 6px 0 0 0;
          padding: 16px;
        }
        :host([hidden]) {
          display: none;
        }
        :host {
          --simple-toast-bottom: 0px;
          height: 142px;
          display: none;
          width: var(--simple-toast-width, auto);
          color: var(
            --simple-toast-color,
            var(--simple-colors-default-theme-accent-12, black)
          );
          background-color: transparent;
          top: var(--simple-toast-top);
          margin: var(--simple-toast-margin, 4px);
          padding: var(--simple-toast-padding, 4px);
          bottom: var(--simple-toast-bottom, 36px);
          right: var(--simple-toast-right, 0px);
          border: var(--simple-toast-border);
          z-index: var(--simple-toast-z-index, 10000000);
          font-size: var(--simple-toast-font-size, 18px);
          font-family: "Press Start 2P", sans-serif;
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
        }
        rpg-character {
          margin: 30px -30px 0 -30px;
          width: 145px;
        }
        .bubble {
          height: 142px;
          display: inline-flex;
          margin-top: 6px;
        }
        .mid {
          line-height: 142px;
          background-color: white;
          background-repeat: repeat-x;
          background-image: url("${unsafeCSS(SpeechBubbleMiddle)}");
        }
        .leftedge {
          background-image: url("${unsafeCSS(SpeechBubbleL)}");
          width: 24px;
          background-color: white;
        }
        .rightedge {
          background-image: url("${unsafeCSS(SpeechBubbleR)}");
          width: 54px;
          background-color: white;
        }
        :host([dark-mode]) .mid,
        :host([dark-mode]) .leftedge,
        :host([dark-mode]) .rightedge {
          filter: invert(1);
        }
        @media (max-width: 800px) {
          :host {
            --simple-toast-width: 80vw;
            --simple-toast-font-size: 12px;
          }
          rpg-character {
            width: 100px;
            margin: 70px -24px 0 -24px;
          }
        }
        @media (max-width: 500px) {
          :host {
            height: 50px;
            line-height: 50px;
            border: none;
          }
          rpg-character {
            display: none;
          }
          .rightedge {
            display: none;
          }
          .leftedge {
            display: none;
          }
          .mid {
            height: 50px;
            line-height: 50px;
            background-image: unset;
          }
          .bubble {
            height: 50px;
            margin: 0;
            border: 2px solid black;
            border-radius: 5px;
          }
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      darkMode: {
        type: Boolean,
        reflect: true,
        attribute: "dark-mode",
      },
      fire: { type: Boolean },
      hat: { type: String },
      walking: { type: Boolean },
      /**
       * Opened state of the toast, use event to change
       */
      opened: {
        type: Boolean,
        reflect: true,
      },
      merlin: {
        type: Boolean,
      },
      future: {
        type: Boolean,
      },
      /**
       * Plain text based message to display
       */
      text: {
        type: String,
      },
      /**
       * Class name, fit-bottom being a useful one
       */
      classStyle: {
        type: String,
        attribute: "class-style",
      },
      /**
       * How long the toast message should be displayed
       */
      duration: {
        type: Number,
      },
      /**
       * Event callback when hide is called
       */
      eventCallback: {
        type: String,
        attribute: "event-callback",
      },
    };
  }

  render() {
    return html` <div class="bubble">
      <span class="bubble leftedge"></span>
      <span class="bubble mid">
        <slot name="pre"></slot>
        ${this.future ? html`
        <future-terminal-text fadein glitch glitch-max="3" glitch-duration="40">${this.text}</future-terminal-text>`: `${this.text}`}
        <slot></slot>
      </span>
      <span class="bubble rightedge"></span>
      ${this.merlin ? html`
      <simple-icon
        class="merlin"
        icon="hax:wizard-hat"
        accent-color="purple"></simple-icon>` : 
      html`
      <rpg-character
        height="130"
        width="130"
        seed="${this.userName}"
        ?fire="${this.fire}"
        hat="${this.hat}"
        ?walking="${this.walking}"
      ></rpg-character>
      `}
    </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "rpg-character-toast-hide",
      this.hideSimpleToast.bind(this), { signal: this.windowControllers.signal });
    window.addEventListener(
      "rpg-character-toast-show",
      this.showSimpleToast.bind(this), { signal: this.windowControllers.signal });
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  /**
   * Hide callback
   */
  hideSimpleToast() {
    this.hide();
  }

  openedChanged(e) {
    this.opened = e.detail.value;
  }

  setDefaultToast() {
    this.opened = false;
    this.text = "Saved";
    this.merlin = false;
    this.classStyle = "";
    this.future = false;
    this.duration = 3000;
    this.accentColor = "grey";
    this.dark = false;
    this.eventCallback = null;
    while (this.firstChild !== null) {
      this.removeChild(this.firstChild);
    }
  }

  /**
   * Show / available callback
   */
  showSimpleToast(e) {
    this.hideSimpleToast();
    // establish defaults and then let event change settings
    this.setDefaultToast();
    // add your code to run when the singleton is called for
    if (e.detail.duration) {
      this.duration = e.detail.duration;
    }
    if (e.detail.fire) {
      this.fire = e.detail.fire;
    }
    if (e.detail.hat) {
      this.hat = e.detail.hat;
    }
    if (e.detail.merlin) {
      this.merlin = e.detail.merlin;
    }
    if (e.detail.walking) {
      this.walking = e.detail.walking;
    }
    if (e.detail.text) {
      this.text = e.detail.text;
    }
    if (e.detail.future) {
      this.future = e.detail.future;
    }
    if (e.detail.classStyle) {
      this.classStyle = e.detail.classStyle;
    }
    if (e.detail.eventCallback) {
      this.eventCallback = e.detail.eventCallback;
    }
    if (e.detail.slot) {
      this.appendChild(e.detail.slot);
    }
    if (e.detail.accentColor) {
      this.accentColor = e.detail.accentColor;
    }
    if (e.detail.dark) {
      this.dark = e.detail.dark;
    }
    this.show();
  }

  show() {
    this.opened = true;
  }

  hide() {
    this.duration = 0;
    this.fire = false;
    this.text = "";
    this.future = false;
    this.hat = "coffee";
    this.walking = false;
    if (this.eventCallback) {
      const evt = new CustomEvent(this.eventCallback, {
        bubbles: true,
        cancelable: true,
        detail: true,
        composed: true,
      });
      this.dispatchEvent(evt);
    }
    this.opened = false;
  }
}
customElements.define(RPGCharacterToast.tag, RPGCharacterToast);
