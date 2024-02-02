import { html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class BlockQuoteProposed extends (DDD) {
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
                style="align-items: start"
              ></simple-icon-lite>
              <span><slot></slot></span>
              <span><slot name="quote"></slot></span>
              <simple-icon-lite icon="editor:format-quote" style="align-items: start"></simple-icon-lite>
            </div>
            <div id="citation">
              ${this.citation ? html` <p><span class="dash">--</span> ${this.citation}</p> ` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "block-quote-proposed";
  }
  static get styles() {
    return [...super.styles,
      css`
        :host {
          background-color: var(--ddd-component-block-quote-background, var(--ddd-theme-polaris-limestoneMaxLight, #f5f5f5));
          display: block;
          align-items: start;
          width: fit-content;
        }

        #wrap {
          display: flex;
          border-left: var(--ddd-border-lg);
          border-color: var(--ddd-component-block-quote-border-color, var(--ddd-theme-accent-color ,var(--ddd-theme-polaris-limestoneGray)));
          padding: var(--ddd-spacing-6);
          text-align: center;
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
          padding: var(--ddd-spacing-5) var(--ddd-spacing-5) 0;
        }

        div ::slotted(*) {
          display: inline;
        }

        #quote {
          align-items: center;
          font-style: italic;
          line-height: var(--ddd-lh-140);
        }

        #iconflip {
          -moz-transform: scaleX(-1);
          -o-transform: scaleX(-1);
          -webkit-transform: scaleX(-1);
          transform: scaleX(-1);
          filter: FlipH;
          -ms-filter: "FlipH";
        }

        .dash{
          letter-spacing: -0.5em;
          margin-right: var(--ddd-spacing-2);
        }

        simple-icon-lite {
          align-self: flex-start;
          color: var(--ddd-component-block-quote-icon, var(--ddd-theme-accent-color ,var(--ddd-theme-polaris-limestoneGray)));
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
            margin: 0 auto;
            border: var(--ddd-border-lg);
            border-color: var(--ddd-component-block-quote-image-border, var(--ddd-theme-accent-color, var(--ddd-theme-polaris-limestoneGray)));
            border-radius: var(--ddd-radius-circle);
          }
        }
      `,
    ];
  }
}

customElements.define(BlockQuoteProposed.tag, BlockQuoteProposed);
