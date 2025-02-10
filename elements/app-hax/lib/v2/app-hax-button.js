import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "wired-elements/lib/wired-button.js";
import { html, css, LitElement } from "lit";
const postIt = new URL("../assets/images/PostIt.svg", import.meta.url).href;
const betaPostIt = new URL("../assets/images/BetaPostIt.svg", import.meta.url)
  .href;

export class AppHaxButton extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-button";
  }

  constructor() {
    super();
    this.icon = "save";
    this.type = null;
    this.value = null;
    this.disabled = false;
    this.elevation = 2;
    this.active = false;
    this.comingSoon = false;
    this.prompt = null;
    this.callback = null;
    this.param = null;
    this.beta = false;
    this.addEventListener("click", this._handleClick);
    this.addEventListener("click", this._handleClick);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this.addEventListener("mouseover", this._handleFocus);
    this.addEventListener("mouseout", this._handleBlur);
  }

  _handleFocus() {
    if (!this.disabled && !this.comingSoon) {
      this.active = true;
      this.elevation = "4";
    }
  }

  _handleBlur() {
    if (!this.disabled && !this.comingSoon) {
      this.active = false;
      this.elevation = "2";
    }
  }

  _handleClick() {
    if (!this.disabled && !this.comingSoon) {
      this.shadowRoot.querySelector(".haxButton").blur();
    }
  }

  static get properties() {
    return {
      icon: { type: String },
      type: { type: String, reflect: true },
      disabled: { type: Boolean, reflect: true },
      elevation: { type: Number },
      active: { type: Boolean, reflect: true },
      comingSoon: { type: Boolean, reflect: true, attribute: "coming-soon" },
      beta: { type: Boolean, reflect: true },
      prompt: { type: String },
      callback: { type: String },
      param: { type: String },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "type") {
        switch (this.type) {
          case "technology":
            this.icon = "hardware:desktop-mac";
            this.value = "technology";
            break;
          case "business":
            this.icon = "maps:local-atm";
            this.value = "business";
            break;
          case "art":
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
          case "docx import":
            this.icon = "hax:file-docx";
            this.value = "docx";
            break;
          case "docx":
            this.icon = "hax:file-docx";
            this.value = "docx";
            break;
          case "evolution":
            this.icon = "communication:business";
            this.value = "evo";
            break;
          case "pressbooks":
            this.icon = "hax:wordpress";
            this.value = "pressbooks";
            break;
          case "gitbook":
            this.icon = "mdi-social:github-circle";
            this.value = "gitbook";
            break;
          case "elms:ln":
            this.icon = "lrn:network";
            this.value = "elmsln";
            break;
          case "haxcms":
            this.icon = "hax:hax2022";
            this.value = "haxcms";
            break;
          case "notion":
            this.icon = "book";
            this.value = "notion";
            break;
          case "html":
            this.icon = "icons:code";
            this.value = "HTML";
            break;
          case "Blog":
            this.icon = "social:public";
            this.value = "Blog";
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
      css`
        :host {
          display: block;
          --background-color: transparent;
          --background-color-active: white;
          font-family: "Press Start 2P", sans-serif;
        }
        :host([coming-soon]) .haxButton {
          pointer-events: none;
          background-color: var(--simple-colors-default-theme-grey-6);
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
        .coming-soon {
          display: block;
          height: 114px;
          width: 140px;
          z-index: 1;
          position: absolute;
          margin-top: -75px;
        }
        .beta {
          display: block;
          height: 100px;
          width: 120px;
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          margin-left: -50px;
          margin-top: -10px;
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
        @media (max-width: 800px) {
          #container {
            width: 100px;
            height: 75px;
          }

          .beta,
          .coming-soon {
            margin-top: -50px;
            height: 114px;
            width: 100px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <wired-button
        elevation=${this.elevation}
        ?disabled=${this.disabled || this.comingSoon}
        class="haxButton"
      >
        <div id="container">
          <simple-icon-lite icon=${this.icon}> </simple-icon-lite>
          <div class="type">${this.type}</div>
        </div>
        ${this.comingSoon
          ? html`<img
              src="${postIt}"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              alt="Feature coming soon"
              class="coming-soon"
            />`
          : ``}
        ${this.beta
          ? html`<img
              src="${betaPostIt}"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              alt="Feature in beta"
              class="beta"
            />`
          : ``}
      </wired-button>
    `;
  }
}
customElements.define(AppHaxButton.tag, AppHaxButton);
