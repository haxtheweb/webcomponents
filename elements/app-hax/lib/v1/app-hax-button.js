import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import { html, css } from "lit";

export class AppHaxButton extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-button";
  }

  constructor() {
    super();
    this.icon = "save";
    this.type = "";
    this.value = null;
    this.disabled = false;
    this.elevation = "2";
    this.active = false;
    this.addEventListener("click", this._handleClick);
    this.addEventListener("click", this._handleClick);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this.addEventListener("mouseover", this._handleFocus);
    this.addEventListener("mouseout", this._handleBlur);
  }

  _handleFocus() {
    this.active = true;
    this.elevation = "4";
  }

  _handleBlur() {
    this.active = false;
    this.elevation = "2";
  }

  _handleClick() {
    if (!this.disabled) {
      this.shadowRoot.querySelector(".haxButton").blur();
    }
  }

  static get properties() {
    return {
      ...super.properties,
      icon: { type: String },
      type: { type: String, reflect: true },
      value: { type: String },
      disabled: { type: Boolean, reflect: true },
      elevation: { type: Number },
      active: { type: Boolean, reflect: true },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "type") {
        switch (this.type) {
          case "Technology":
            this.icon = "hardware:desktop-mac";
            this.value = "technology";
            break;
          case "Business":
            this.icon = "maps:local-atm";
            this.value = "business";
            break;
          case "Art":
            this.icon = "image:palette";
            this.value = "art";
            break;
          case "6w":
            this.icon = "hax:messages-6";
            this.value = "6 Week";
            break;
          case "15w":
            this.icon = "social:school";
            this.value = "15 Week";
            break;
          case "training":
            this.icon = "hax:bricks";
            this.value = "Training";
            break;
          default:
            this.icon = "image:photo-filter";
            this.value = "own";
            this.type = "Create Your Own";
            break;
        }
      }
    });
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          --background-color: transparent;
          --background-color-active: white;
          font-family: "Press Start 2P", sans-serif;
        }
        :host([active]) .haxButton {
          color: var(
            --app-hax-background-color,
            var(--background-color-active)
          );
          background-color: var(--app-hax-accent-color, var(--accent-color));
        }
        :host([active]) simple-icon-lite {
          --simple-icon-color: var(
            --app-hax-background-color,
            var(--background-color-active)
          );
        }
        :host([active]) .type {
          background-color: var(--app-hax-accent-color, var(--accent-color));
          color: var(
            --app-hax-background-color,
            var(--background-color-active)
          );
        }

        #container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          width: 132px;
          height: 112px;
        }
        .haxButton {
          background-color: var(
            --app-hax-background-color,
            var(--background-color)
          );
          color: var(--app-hax-accent-color, var(--accent-color));
          display: inline-flex;
        }
        simple-icon-lite {
          --simple-icon-width: 60px;
          --simple-icon-height: 60px;
          --simple-icon-color: var(--app-hax-accent-color, var(--accent-color));
        }
        .type {
          font-size: 10px;
          color: var(--app-hax-accent-color, var(--accent-color));
        }
      `,
    ];
  }

  render() {
    return html`
      <wired-button
        elevation=${this.elevation}
        ?disabled=${this.disabled}
        class="haxButton"
      >
        <div id="container">
          <simple-icon-lite icon=${this.icon}> </simple-icon-lite>
          <div class="type">${this.type}</div>
        </div>
      </wired-button>
    `;
  }
}
customElements.define(AppHaxButton.tag, AppHaxButton);
