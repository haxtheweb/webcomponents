import { LitElement, html, css } from "lit";

class ModelInfo extends LitElement {
  static get properties() {
    return {
      title: { type: String },
    };
  }
  constructor() {
    super();
    this.title = "";
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

        @media screen and (min-width: 920px) {
          #column-wrap {
            display: flex;
          }
        }

        #accent-color {
          background-color: var(--ddd-theme-default-inventOrange);
          width: 80px;
          height: 5px;
        }
  
        @media screen and (min-width: 320px) {
          .text {
            width: 100%;
            border-right: none;
            border-bottom: solid 5px var(--ddd-theme-default-inventOrange);
            padding: 0;
        }
  
        @media screen and (min-width: 920px) {
          .text {
             width: 50%;
             border-bottom: none;
             border-right: solid 5px var(--ddd-theme-default-inventOrange);
             padding-right: var(--ddd-spacing-6);
          }
        }

        @media screen and (min-width: 320px) {
          .text {
            font-size: var(--ddd-font-size-3xs);
        }
  
        @media screen and (min-width: 920px) {
          .text {
            font-size: var(--ddd-font-size-s);
          }
        }

        @media screen and (min-width: 320px) {
          .images {
            width: 100%;
            margin: var(--ddd-spacing-6) 0 0 0;
        }
  
        @media screen and (min-width: 920px) {
          .images {
            width: 50%;
            margin: var(--ddd-spacing-6) 0 0 var(--ddd-spacing-6);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div id="info-wrap">
        <div id="accent-color"></div>
        <div id="title">
          <h2>${this.title}</h2>
        </div>

        <div id="column-wrap">
          <div class="text">
            <slot></slot>
          </div>
          <div class="images">
            <slot name="images"></slot>
          </div>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "model-info";
  }
}

globalThis.customElements.define("model-info", ModelInfo);

export { ModelInfo };
