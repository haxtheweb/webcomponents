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

        @media screen and (min-width: 920px) {
          #column-wrap {
            display: flex;
          }
        }

        #accent-color {
          background-color: #e2801e;
          width: 80px;
          height: 5px;
        }
  
        @media screen and (min-width: 320px) {
          .text {
            width: 100%;
            border-right: none;
            border-bottom: solid 5px #e2801e;
            padding: 0;
        }
  
        @media screen and (min-width: 920px) {
          .text {
             width: 50%;
             border-bottom: none;
             border-right: solid 5px #e2801e;
             padding-right: 25px;
          }
        }

        @media screen and (min-width: 320px) {
          .text {
            font-size: 18px;
        }
  
        @media screen and (min-width: 920px) {
          .text {
            font-size: 24px;
          }
        }

        @media screen and (min-width: 320px) {
          .images {
            width: 100%;
            margin: 25px 0 0 0;
        }
  
        @media screen and (min-width: 920px) {
          .images {
            width: 50%;
            margin: 25px 0 0 25px;
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

customElements.define("model-info", ModelInfo);

export { ModelInfo };
