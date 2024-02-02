import { html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

export class BlockQuote extends SimpleColors {
  static get properties() {
    return {
      ...super.properties,
      citation: { type: String },
      image: { type: String },
      alt: { type: String },
    };
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  constructor() {
    super();
    this.citation = "";
    this.image = "";
    this.alt = "";
    this.accentColor = "grey";
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
      ...super.styles,
      css`
        :host {
          background-color: var(
            --simple-colors-default-theme-accent-2,
            #f5f5f5
          );
          color: var(--simple-colors-default-theme-accent-12, #000000);
          display: block;
        }

        #wrap {
          display: flex;
          border-left-color: var(
            --simple-colors-default-theme-accent-3,
            #747474
          );
          border-left: solid;
          border-left-width: 8px;
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
          color: var(--simple-colors-default-theme-accent-7, #747474);
          height: var(--ddd-icon-xs);
          width: var(--ddd-icon-xs);
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
            border-color: var(--simple-colors-default-theme-accent-3, #747474);
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
