import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";

export class BlockQuote extends LitElement {
  static get properties() {
    return {
      citation: { type: String },
      image: { type: String },
      alt: { type: String },
    };
  }

  static get haxProperties() {
    return new URL("./block-quote.haxProperties.json", import.meta.url).href;
  }

  constructor() {
    super();
    this.citation = "";
    this.image = "";
    this.alt = "";
  }

  render() {
    return html`
      <div id="wrap">
        ${this.image
          ? html`
              <div
                id="image"
                style="background-image:url('${this.image}');"
                alt="${this.alt}"
              ></div>
            `
          : ""}
        <div id="quote_wrap">
          <div id="inner_wrap">
            <div id="quote">
              <simple-icon-lite
                id="iconflip"
                icon="editor:format-quote"
              ></simple-icon-lite>
              <span><slot></slot></span>
              <span><slot name="quote"></slot></span>
              <simple-icon-lite icon="editor:format-quote"></simple-icon-lite>
            </div>
            <div id="citation">
              ${this.citation ? html` <p>-- ${this.citation}</p> ` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "block-quote";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        #wrap {
          display: flex;
          background-color: var(--block-quote-background-color, #f5f5f5);
          border-left: solid;
          border-left-width: 8px;
          border-left-color: var(--block-quote-border-color, #747474);
          padding: 25px;
        }

        @media screen and (max-width: 1200px) {
          #wrap {
            flex-direction: column;
            border: none;
          }
        }

        #inner_wrap {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          padding: 20px 20px 0;
        }

        div ::slotted(*) {
          display: inline;
        }

        #quote {
          font-style: italic;
          line-height: 1.4;
        }

        #iconflip {
          -moz-transform: scaleX(-1);
          -o-transform: scaleX(-1);
          -webkit-transform: scaleX(-1);
          transform: scaleX(-1);
          filter: FlipH;
          -ms-filter: "FlipH";
        }

        simple-icon-lite {
          color: #747474;
          height: 30px;
          width: 30px;
        }

        #image {
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          width: 100%;
          max-width: var(--block-quote-image-max-width, 200px);
          height: auto;
        }

        @media screen and (max-width: 1200px) {
          #image {
            height: 200px;
            margin: 0 auto 0;
            border: solid;
            border-width: 6px;
            border-color: var(--block-quote-border-color, #747474);
            border-radius: 50%;
          }
        }

        #citation {
          font-size: 16px;
        }
      `,
    ];
  }
}

customElements.define(BlockQuote.tag, BlockQuote);
