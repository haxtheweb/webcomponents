import { LitElement, html, css } from "lit";

class ModelOption extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      url: { type: String },
      src: { type: String },
    };
  }
  constructor() {
    super();
    this.title = "";
    this.url = "";
    this.src = "";
  }
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        a {
          text-decoration: none;
          color: var(--ddd-theme-default-white, #fff);
          display: block;
          background: var(--ddd-theme-default-coalyGray, #262626);
        }

        h2 {
          margin-bottom: var(--ddd-spacing-2);
        }

        @media screen and (min-width: 320px) {
          h2 {
            font-size: var(--ddd-font-size-s);
        }
  
        @media screen and (min-width: 920px) {
          h2 {
            font-size: var(--ddd-font-size-ml);
          }
        }

        #option-wrap {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-6)
            var(--ddd-spacing-4);
        }

        #accent-color {
          background-color: var(--ddd-theme-default-inventOrange);
          width: 80px;
          height: 5px;
        }

        .button {
          width: 100%;
        }
      `,
    ];
  }

  render() {
    return html`
      <a
        role="button"
        tabindex="0"
        @click="${this._handleClick}"
        @keydown="${this._handleKeydown}"
      >
        <div class="button">
          <div id="option-wrap">
            <div id="accent-color"></div>
            <div id="title">
              <h2>${this.title}</h2>
            </div>
            <slot></slot>
          </div>
        </div>
      </a>
    `;
  }

  /**
   * Sends custom event 'model-select' to 'course-model'.
   */
  _handleClick(e) {
    let modelSelect = new CustomEvent("model-select", {
      detail: this,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(modelSelect);
  }

  /**
   * Activates the selection card from the keyboard like a button.
   */
  _handleKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._handleClick(e);
    }
  }

  static get tag() {
    return "model-option";
  }
}

globalThis.customElements.define("model-option", ModelOption);

export { ModelOption };
