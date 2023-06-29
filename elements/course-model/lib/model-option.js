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
          color: #fff;
        }

        h2 {
          margin-bottom: 10px;
        }

        @media screen and (min-width: 320px) {
          h2 {
            font-size: 24px;
        }
  
        @media screen and (min-width: 920px) {
          h2 {
            font-size: 36px;
          }
        }

        #option-wrap {
          padding: 15px 25px 15px;
        }

        #accent-color {
          background-color: #e2801e;
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
      <a @click="${this._handleClick}">
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

  static get tag() {
    return "model-option";
  }
}

customElements.define("model-option", ModelOption);

export { ModelOption };
