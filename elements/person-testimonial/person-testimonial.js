import { html, css } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
/**
 * `person-testimonial`
 * @element person-testimonial
 * `Leaving a testimonial from a person to say your company rocks!`
 * @demo demo/index.html
 */
class PersonTestimonial extends SchemaBehaviors(DDD) {
  static get styles() {
    return [
      super.styles,
      css`
        /* light card: light-dark() pairs flip with the site color-scheme and
           the accent (image ring, quote marks) is DDD primary, with the HAX
           brand blue as the fallback when no primary is set */
        :host {
          display: block;
          --person-testimonial-font-family: var(--ddd-font-primary);
          --person-testimonial-bg: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --person-testimonial-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-beaverBlue)
          );
          --person-testimonial-text: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }

        div.card {
          box-sizing: border-box;
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-5);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          background-color: var(--person-testimonial-bg);
          color: var(--person-testimonial-text);
          font-family: var(--person-testimonial-font-family);
        }

        /* fixed round crop + object-fit keeps the person at an appropriate
           size instead of scrunching the photo */
        .image {
          flex: 0 0 auto;
        }
        .image img {
          display: block;
          box-sizing: border-box;
          width: var(--ddd-icon-xl);
          height: var(--ddd-icon-xl);
          border-radius: var(--ddd-radius-circle);
          object-fit: cover;
        }

        svg {
          fill: var(--person-testimonial-color);
          height: var(--ddd-icon-4xs);
          width: var(--ddd-icon-4xs);
          vertical-align: text-top;
        }

        .wrap {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          flex: 1 1 auto;
          min-width: 0;
        }

        .testimonial {
          line-height: var(--ddd-lh-150);
          font-size: var(--ddd-font-size-3xs);
        }

        .byline {
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-150);
        }

        .name,
        .position {
          display: inline;
        }

        .name {
          font-weight: var(--ddd-font-weight-bold);
        }

        .position,
        .sep {
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }

        /* the old speech bubble pointer is not part of the light card */
        .arrow_right {
          display: none;
        }

        #quotestart {
          display: inline-flex;
          transform: rotateY(180deg);
          margin-inline-end: var(--ddd-spacing-1);
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
          margin-inline-start: var(--ddd-spacing-1);
        }
        @media screen and (max-width: 600px) {
          div.card {
            flex-direction: column;
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
                alt="${this.name ||
                this.position ||
                "Person giving this testimonial"}"
                aria-describedby="${ifDefined(this.describedBy)}"
              />
            </div>`
          : ``}
        <div class="arrow_right"></div>
        <div class="wrap">
          <div class="testimonial" data-layout-slotname="Quote">
            <svg id="quotestart" aria-hidden="true">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
            </svg>
            <slot property="oer:description"></slot>
            <svg id="quoteend" aria-hidden="true">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
            </svg>
          </div>
          <div class="byline">
            <div class="name" property="oer:name">${this.name}</div>
            ${this.name && this.position
              ? html`<span class="sep" aria-hidden="true"> · </span>`
              : ``}
            <div class="position">${this.position}</div>
          </div>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "person-testimonial";
  }
  constructor() {
    super();
    this.typeof = "oer:SupportingMaterial";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
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
