import { LitElement, html, css } from "lit";
import "@haxtheweb/es-global-bridge/es-global-bridge.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import * as md5 from "./lib/md5.min.js";
/**
`paper-avatar`
User avatar in material style

### Styling
Custom property | Description | Default
----------------|-------------|----------
`--paper-avatar-width` | Size (width and height) of the avatar image | 40px
`--paper-avatar-color` | Background color of the avatar image | `--paper-avatar-calculated-bg`
`--paper-avatar-text-color` | Text color of the avatar image | #fff
`--paper-avatar-calculated-bg` | Do NOT use. Thi is an automatically set variable that can be overriden `--paper-avatar-color` | #000


* @demo demo/index.html 
*/
class PaperAvatar extends LitElement {
  /**
   * LitElement style method
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          box-sizing: border-box;
          position: relative;
          width: var(--paper-avatar-width, 40px);
          height: var(--paper-avatar-width, 40px);
          border-radius: 50%;
          cursor: default;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          color: var(--paper-avatar-text-color, #ffffff);
          background-color: var(
            --paper-avatar-color,
            var(--paper-avatar-calculated-bg, #000)
          );
        }

        :host > * {
          pointer-events: none;
        }
        img {
          width: var(--paper-avatar-width, 40px);
          height: var(--paper-avatar-width, 40px);
        }
        #label,
        #img,
        #jdenticon {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        #label {
          overflow: hidden;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -webkit-flex-direction: row;
          -ms-flex-direction: row;
          flex-direction: row;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          --simple-icon-width: calc(var(--paper-avatar-width, 40px) * 0.9);
          --simple-icon-height: calc(var(--paper-avatar-width, 40px) * 0.9);
        }
        #label[hidden] {
          display: none;
        }
        #label span {
          display: block;
          width: 100%;
          font-weight: 400;
          color: var(--paper-avatar-text-color, #ffffff);
          text-transform: capitalize;
          font-family: "Roboto", "Noto", sans-serif;
          -webkit-font-smoothing: antialiased;
          text-align: center;
          font-size: calc(var(--paper-avatar-width, 40px) * 0.7);
          opacity: 0.8;
        }
        #label span[two-chars] {
          font-size: calc(var(--paper-avatar-width, 40px) * 0.5);
        }
        #label simple-icon-lite {
          margin: 0 auto;
          opacity: 0.8;
        }
        #jdenticon {
          width: var(--paper-avatar-width, 40px);
          height: var(--paper-avatar-width, 40px);
        }
        #jdenticon * {
          fill: var(--paper-avatar-text-color, #ffffff);
          opacity: 0.8;
        }
        :host #jdenticon ::slotted(*) {
          fill: var(--paper-avatar-text-color, #ffffff);
          opacity: 0.8;
        }
      `,
    ];
  }
  /**
   * A convention our team uses
   */
  static get tag() {
    return "paper-avatar";
  }
  /**
   * LitElement render method
   */
  render() {
    return html`
      <svg id="jdenticon" width="40" height="40"><slot></slot></svg>
      <div
        id="label"
        title="${this.label}"
        ?hidden="${this.jdenticonExists && this.jdenticon}"
      >
        ${this.icon
          ? html` <simple-icon-lite icon="${this.icon}"></simple-icon-lite> `
          : html`
              <span ?two-chars="${this.twoChars}"
                >${this._label(this.label)}
              </span>
            `}
      </div>
      ${this.src
        ? html`
            <img
              id="img"
              loading="lazy"
              .src="${this.src || ""}"
              @load="${this._onImgLoad}"
              @error="${this._onImgError}"
              aria-hidden="true"
            />
          `
        : ``}
    `;
  }
  /**
   * HTMLElement specification
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.dark = false;
    this.label = null;
    this.src = null;
    this.jdenticonExists = false;
    this.twoChars = false;
    this.jdenticon = false;
  }
  /**
   * LitElement specific property update life cycle
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "label") {
        this._observerLabel(this[propName]);
      }
    });
  }
  /**
   * LitElement / popular library convention
   */
  static get properties() {
    return {
      /**
       * Optional simple-icon
       */
      accentColor: {
        type: String,
        attribute: "accent-color",
      },
      /**
       * dark mode
       */
      dark: {
        type: Boolean,
      },
      /**
       * Optional simple-icon
       */
      icon: {
        type: String,
      },
      /**
       * Image address or base64
       */
      src: {
        type: String,
      },
      /**
       *	Label with username
       */
      label: {
        type: String,
      },
      /**
       * Ensure we can support jdenticon before invoking it
       */
      jdenticonExists: {
        type: Boolean,
      },
      /**
       * Show two chars in avatar
       */
      twoChars: {
        type: Boolean,
        attribute: "two-chars",
      },

      /**
       * Array of colors for avatar background
       */
      colors: {
        type: Array,
      },

      /**
       * Set true if you want use a jdenticon avatar
       */
      jdenticon: {
        type: Boolean,
      },
    };
  }
  /**
   * Generate the correct label from change with optional jdenticon md5 hash
   */
  _observerLabel(label) {
    if (label) {
      if (this.jdenticonExists && this.jdenticon) {
        this.shadowRoot.querySelector("#label").hidden = true;

        window.jdenticon.update(
          this.shadowRoot.querySelector("#jdenticon"),
          window.md5(label),
        );
      }
      if (!this.accentColor)
        this.style.setProperty(
          "--paper-avatar-calculated-bg",
          this._parseColor(label),
        );
    }
  }
  /**
   * LitElement life cycle - shadowDom / properties mapped
   */
  firstUpdated(changedProperties) {
    const location = new URL("./lib/jdenticon-1.4.0.min.js", import.meta.url)
      .href;
    window.addEventListener(
      "es-bridge-jdenticon-loaded",
      this._jdenticonLoaded.bind(this),
      { signal: this.windowControllers.signal },
    );

    window.ESGlobalBridge.requestAvailability().load("jdenticon", location);
  }
  /**
   * HTMLElement life cycle
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  /**
   * Callback once we know that the jdenticon library is globally loaded.
   */
  _jdenticonLoaded(e) {
    this.jdenticonExists = true;
    this._observerLabel(this.label);
  }
  /**
   * convert label in context
   */
  _label(label) {
    if (!label) return "";

    if (this.twoChars) {
      if (this.label.indexOf(" ") > -1) {
        var matches = this.label.match(/\b(\w)/g);
        return matches[0] + matches[1];
      } else {
        return label.substring(0, 2);
      }
    }

    return label.charAt(0);
  }
  _onImgLoad(e) {
    e.currentTarget.hidden = false;
  }
  _onImgError(e) {
    e.currentTarget.hidden = true;
  }
  _parseColor(label) {
    var colors = this.colors
      ? this.colors
      : [
          "#F44336",
          "#E91E63",
          "#9C27B0",
          "#673AB7",
          "#3F51B5",
          "#2196F3",
          "#03A9F4",
          "#00BCD4",
          "#795548",
          "#009688",
          "#4CAF50",
          "#8BC34A",
          "#CDDC39",
          "#FFEB3B",
          "#FFC107",
          "#FF9800",
          "#FF5722",
          "#9E9E9E",
          "#607D8B",
        ];

    var hash = 0;

    for (var a = 0; a < label.length; a++) hash += label.charCodeAt(a) << 5;

    if (hash >= colors.length) return colors[hash % colors.length];

    return colors[hash];
  }
}
customElements.define(PaperAvatar.tag, PaperAvatar);
export { PaperAvatar };
