import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { css, html } from "lit";

export class BlockQuote extends DDD {
  static get properties() {
    return {
      ...super.properties,
      citation: { type: String },
      image: { type: String },
      alt: { type: String },
      dataTextAlign: {
        type: String,
        attribute: "data-text-align",
        reflect: true,
      },
      noBorder: { type: Boolean, attribute: "no-border", reflect: true },
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
    this.dataTextAlign = "center";
    this.noBorder = false;
  }

  render() {
    return html`
      <div id="wrap">
        ${this.image
          ? html` <img id="image" src="${this.image}" alt="${this.alt}" /> `
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
              ${this.citation
                ? html` <p><span class="dash">--</span> ${this.citation}</p> `
                : ""}
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
      super.styles,
      css`
        :host {
          background-color: light-dark(
            var(
              --ddd-component-block-quote-background,
              var(--ddd-theme-default-limestoneMaxLight, inherit)
            ),
            var(
              --ddd-component-block-quote-background,
              var(--ddd-theme-default-coalyGray, inherit)
            )
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray, inherit),
            var(--ddd-theme-default-limestoneMaxLight, inherit)
          );
          --ddd-component-block-quote-border-color-default: light-dark(
            var(--ddd-theme-accent, var(--ddd-theme-default-limestoneGray)),
            var(
              --ddd-theme-default-limestoneLight,
              var(--ddd-theme-default-limestoneGray)
            )
          );
          --ddd-component-block-quote-icon-color-default: light-dark(
            var(--ddd-theme-accent, var(--ddd-theme-default-limestoneGray)),
            var(
              --ddd-theme-default-limestoneLight,
              var(--ddd-theme-default-limestoneGray)
            )
          );
          display: flex;
          align-items: start;
          width: 100%;
          container-type: inline-size;
        }

        :host([data-accent]) {
          --ddd-component-block-quote-border-color: var(
            --ddd-theme-accent,
            var(--ddd-theme-default-limestoneGray)
          );
        }

        :host([data-primary]) {
          --ddd-component-block-quote-border-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-limestoneGray)
          );
        }

        :host([data-text-align="left"]) #wrap {
          text-align: left;
        }
        :host([data-text-align="center"]) #wrap {
          text-align: center;
        }
        :host([data-text-align="right"]) #wrap {
          text-align: right;
        }
        :host([data-text-align="justify"]) #wrap {
          text-align: justify;
        }

        :host([data-border-radius="xs"]) #wrap {
          border-radius: var(--ddd-radius-xs);
        }
        :host([data-border-radius="sm"]) #wrap {
          border-radius: var(--ddd-radius-sm);
        }
        :host([data-border-radius="md"]) #wrap {
          border-radius: var(--ddd-radius-md);
        }
        :host([data-border-radius="lg"]) #wrap {
          border-radius: var(--ddd-radius-lg);
        }
        :host([data-border-radius="xl"]) #wrap {
          border-radius: var(--ddd-radius-xl);
        }

        :host([data-box-shadow="sm"]) {
          box-shadow: var(--ddd-boxShadow-sm);
        }
        :host([data-box-shadow="md"]) {
          box-shadow: var(--ddd-boxShadow-md);
        }
        :host([data-box-shadow="lg"]) {
          box-shadow: var(--ddd-boxShadow-lg);
        }
        :host([data-box-shadow="xl"]) {
          box-shadow: var(--ddd-boxShadow-xl);
        }

        #wrap {
          display: flex;
          border-left: var(--ddd-border-lg);
          border-color: var(
            --ddd-component-block-quote-border-color,
            var(--ddd-component-block-quote-border-color-default)
          );
          padding: var(--ddd-spacing-6);
        }

        :host(:not([data-border])) #wrap {
          border-width: var(
            --ddd-theme-border-size,
            var(--ddd-border-size-lg)
          );
        }
        :host([data-border="xs"]) #wrap,
        :host([data-border="sm"]) #wrap,
        :host([data-border="md"]) #wrap,
        :host([data-border="lg"]) #wrap {
          border-width: var(--ddd-theme-border-size);
        }
        :host([no-border]) #wrap {
          border-left: none;
        }
        :host([data-padding]) #wrap {
          padding: inherit;
        }
        :host([data-margin="center"]) {
          margin-left: auto;
          margin-right: auto;
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

        .dash {
          letter-spacing: -0.5em;
          margin-right: var(--ddd-spacing-2);
        }

        simple-icon-lite {
          align-self: flex-start;
          color: var(
            --ddd-component-block-quote-icon,
            var(--ddd-component-block-quote-icon-color-default)
          );
          height: var(--ddd-icon-xs);
          width: var(--ddd-icon-xs);
        }

        #image {
          background-size: scale-down;
          width: 100%;
          max-width: var(--block-quote-image-max-width, 200px);
          height: auto;
        }

        @container (max-width: 499px) {
          #wrap {
            flex-direction: column;
            border: none;
          }
          #image {
            height: 200px;
            margin: 0 auto;
            border: var(--ddd-border-lg);
            border-color: var(
              --ddd-component-block-quote-image-border,
              var(
                --ddd-component-block-quote-border-color,
                var(--ddd-component-block-quote-border-color-default)
              )
            );
            border-radius: var(--ddd-radius-circle);
          }
        }
      `,
    ];
  }
}

globalThis.customElements.define(BlockQuote.tag, BlockQuote);
