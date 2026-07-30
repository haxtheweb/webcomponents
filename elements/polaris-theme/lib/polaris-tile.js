import { LitElement, html, css } from "lit";

export class PolarisTile extends LitElement {
  static get tag() {
    return "polaris-tile";
  }
  constructor() {
    super();
    this.type = null;
    this.line1 = null;
    this.line2 = null;
    this.image = null;
    this.link = null;
    this.editMode = false;
  }

  static get properties() {
    return {
      type: { type: String, reflect: true },
      line1: { type: String },
      line2: { type: String },
      image: { type: String },
      link: { type: String },
      editMode: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        color-scheme: light dark;
      }

      :host .button {
        position: absolute;
        bottom: 14px;
        right: 14px;
        width: 24px;
        height: 24px;
        color: var(--ddd-theme-default-white, #fff);
        transition: transform 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      :host([type="2"]) .button {
        color: light-dark(
          var(--ddd-theme-default-nittanyNavy, #001e44),
          var(--ddd-theme-default-white, #fff)
        );
      }

      :host([type]) .button:hover {
        transform: scale(1.3);
      }
      a:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }
      @media (prefers-reduced-motion: reduce) {
        :host .button {
          transition: none;
        }
        :host([type]) .button:hover {
          transform: none;
        }
      }

      .tile.clickable:hover {
        cursor: pointer;
      }

      .tile {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 281px;
        width: 336px;
        max-width: 100%;
        font-family: "Roboto", "Franklin Gothic Medium", Tahoma, sans-serif;
        font-size: 32px;
        color: white;
        box-shadow: rgba(0, 3, 33, 0.1) 0px 8px 16px 0px;
        position: relative;
      }

      .splitspacer {
        width: 242px;
        margin: auto;
      }

      .split-line {
        margin: 0 0 16px 0;
        border: 16px;
        height: 3px;
        /* inherit the tile's per-type text color (white on dark types,
           navy on type-2 light, white on type-2 dark) so the line is
           always visible against its background. */
        background-color: currentColor;
      }

      .additionalText {
        font-family: Tahoma;
        display: block;
        /* inherit the tile's per-type text color for guaranteed contrast. */
        color: inherit;
        font-size: 18px;
        font-weight: normal;
        margin: 0 0 20px 0;
        border: 0;
        padding: 0 47px;
      }

      .name {
        margin: 0 0 16px 0;
        border: 0;
        padding: 0 47px;
        margin-bottom: 18px;
      }

      :host([type]) .tile,
      :host([type="1"]) .tile {
        background-color: rgb(30, 64, 124);
      }
      :host([type="2"]) .tile {
        background-color: light-dark(
          #ffffff,
          var(--ddd-theme-default-coalyGray, #262626)
        );
        color: light-dark(
          rgb(0, 30, 68),
          var(--ddd-theme-default-white, #fff)
        );
      }

      :host([type="3"]) .tile {
        background-color: rgba(0, 0, 0, 0);
        background-image: linear-gradient(
          rgb(30, 64, 124) 0%,
          rgb(0, 30, 68) 65%,
          rgb(0, 30, 68) 100%
        );
      }

      :host([type="4"]) .tile {
        background-color: rgb(0, 30, 68);
      }

      :host([type="5"]) .tile {
        background-blend-mode: multiply;
        background-color: rgba(0, 3, 33, 0.5);
        background-position: 50% 50%;
        background-size: cover;
      }
    `;
  }

  render() {
    return html`
      <div
        class="tile"
        style="${this.image ? `background-image: url(${this.image});` : ``}"
      >
        <div class="content">
          <div class="name">
            <slot>${this.line1}</slot>
          </div>
          ${this.line2
            ? html`
                <div class="splitspacer">
                  <hr class="split-line" />
                </div>
                <div class="additionalText">${this.line2}</div>
              `
            : ``}
          ${this.link
            ? html`<a
                class="button"
                href="${this.link}"
                @click="${this._clickLink}"
                aria-label="${this.line1
                  ? this.line1
                  : "Additional details about this fact"}"
                title="${this.line1
                  ? this.line1
                  : "Additional details about this fact"}"
              ><svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  focusable="false"
                ><path
                    fill="currentColor"
                    d="M14 3v2h3.59l-9.3 9.3 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z"
                  ></path></svg></a>`
            : ``}
        </div>
      </div>
    `;
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  /**
   * Set a flag to test if we should block link clicking while in edit mode.
   */
  haxeditModeChanged(val) {
    this.editMode = val;
  }

  /**
   * Prevent navigation while editing in HAX.
   */
  _clickLink(e) {
    if (this.editMode) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  /**
   * Ensure edit mode state is in sync with active element changes.
   */
  haxactiveElementChanged(el, val) {
    this.editMode = val;
    return false;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(PolarisTile.tag, PolarisTile);
