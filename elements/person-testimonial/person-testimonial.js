import { html, css } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
/**
 * `person-testimonial`
 * @element person-testimonial
 * `Leaving a testimonial from a person to say your company rocks!`
 * @demo demo/index.html
 */
class PersonTestimonial extends SchemaBehaviors(SimpleColors) {
  static get styles() {
    return [
      super.styles,
      css`
        /* greys migrate to DDD light-dark pairs; the accentColor-driven
           accent shade keeps SimpleColors (DDD lacks that shade mechanism)
           with a DDD primary fallback */
        :host {
          display: block;
          --person-testimonial-font-family: var(--ddd-font-primary);
          --person-testimonial-bg: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
          --person-testimonial-color: var(
            --simple-colors-default-theme-accent-7,
            var(--ddd-theme-primary, var(--ddd-theme-default-beaverBlue))
          );
          --person-testimonial-text: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }

        /* the dark attribute drives color-scheme so the light-dark() pairs
           track it alongside the SimpleColors accent flip */
        :host([dark]) {
          color-scheme: dark;
        }

        div.card {
          display: inline-flex;
          background-color: var(--person-testimonial-bg);
          color: var(--person-testimonial-text);
          font-family: var(--person-testimonial-font-family);
          box-shadow: var(--ddd-boxShadow-sm);
        }

        .image img {
          display: block;
          width: 150px;
          height: 100%;
        }
        .image img {
          max-width: 200px;
        }
        .image {
          padding-right: var(--ddd-spacing-1);
          background-color: var(--person-testimonial-color);
        }

        svg {
          fill: var(--person-testimonial-color);
          height: var(--ddd-icon-xxs);
          width: var(--ddd-icon-xxs);
        }

        .wrap {
          margin: var(--ddd-spacing-4);
        }

        .testimonial {
          line-height: var(--ddd-lh-140);
          font-size: var(--ddd-font-size-4xs);
          font-style: italic;
        }

        .name {
          font-size: var(--ddd-font-size-xs);
          text-transform: uppercase;
          font-weight: var(--ddd-font-weight-bold);
          margin-top: var(--ddd-spacing-5);
        }

        .position {
          font-size: var(--ddd-font-size-5xs);
          margin-top: var(--ddd-spacing-1);
        }

        .arrow_right {
          width: 0;
          height: 0;
          border-top: 15px solid var(--person-testimonial-bg);
          border-bottom: 15px solid var(--person-testimonial-bg);
          border-left: solid 15px transparent;
          background-color: var(--person-testimonial-color);
          position: relative;
          top: 55px;
        }

        #quotestart {
          display: inline-flex;
          transform: rotateY(180deg);
        }
        div ::slotted(*) {
          display: inline;
        }

        :host([data-hax-ray][data-hax-active]) [data-layout-slotname] {
          outline: var(
            --hax-body-editable-outline,
            1px solid var(--hax-ui-disabled-color, #ddd)
          );
          outline-style: dotted;
          outline-offset: var(--hax-layout-container-outline-offset, 0px);
        }
        :host([data-hax-ray][data-hax-active]) [data-layout-slotname]:hover {
          outline-style: solid;
        }
        :host([data-hax-ray][data-hax-active].hax-hovered)
          [data-layout-slotname].active {
          outline: var(
            --hax-body-active-drag-outline,
            1px solid var(--hax-ui-color-accent, #009dc7)
          );
          outline-width: 2px;
        }

        #quoteend {
          display: inline-flex;
        }
        @media screen and (max-width: 850px) {
          div.card {
            display: flex;
            flex-wrap: wrap;
          }
          .image img {
            display: block;
            border-radius: 50%;
            width: 200px;
            height: 200px;
          }
          .image {
            margin-top: var(--ddd-spacing-6);
            border-radius: 50%;
            padding: var(--ddd-spacing-1);
            margin-left: auto;
            margin-right: auto;
          }
          .arrow_right {
            display: none;
          }
          .name,
          .position {
            text-align: center;
          }
        }
        @media screen and (max-width: 600px) {
          .image img {
            width: 150px;
            height: 150px;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="card">
        ${this.image
          ? html` <div class="image">
              <img
                property="oer:image"
                src="${this.image}"
                loading="lazy"
                alt="${this.name || this.position || 'Person giving this testimonial'}"
                aria-describedby="${ifDefined(this.describedBy)}"
              />
            </div>`
          : ``}
        <div class="arrow_right"></div>
        <div class="wrap">
          <div class="testimonial" data-layout-slotname="Quote">
            <svg id="quotestart">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
            </svg>
            <slot property="oer:description"></slot>
            <svg id="quoteend">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
            </svg>
          </div>
          <div class="name" property="oer:name">${this.name}</div>
          <div class="position">${this.position}</div>
        </div>
      </div>
    `;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.setAttribute("typeof", "oer:SupportingMaterial");
  }
  static get tag() {
    return "person-testimonial";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Aria-describedby data passed down to appropriate tag
       */
      describedBy: {
        type: String,
        attribute: "described-by",
      },
      /**
       * The profile image to display to the left of the quote.
       */
      image: {
        type: String,
      },
      /**
       * Name of the person making the quote.
       */
      name: {
        type: String,
      },
      /**
       * The title / position of the person in question.
       */
      position: {
        type: String,
      },
    };
  }
  static get haxProperties() {
    return new URL(
      "./lib/person-testimonial.haxProperties.json",
      import.meta.url,
    ).href;
  }
}
globalThis.customElements.define(PersonTestimonial.tag, PersonTestimonial);
export { PersonTestimonial };
