import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
/**
 * `person-testimonial`
 * @element person-testimonial
 * `Leaving a testimonial from a person to say your company rocks!`
 * @demo demo/index.html
 */
class PersonTestimonial extends SimpleColors {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --person-testimonial-font-family: sans-serif;
          --person-testimonial-bg: var(--simple-colors-default-theme-grey-1);
          --person-testimonial-color: var(
            --simple-colors-default-theme-accent-7
          );
          --person-testimonial-text: var(--simple-colors-default-theme-grey-12);
        }

        div.card {
          display: inline-flex;
          background-color: var(--person-testimonial-bg);
          color: var(--person-testimonial-text);
          font-family: var(--person-testimonial-font-family);
          box-shadow: 0 2px 2px rgba(59, 43, 91, 0.7);
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
          padding-right: 5px;
          background-color: var(--person-testimonial-color);
        }

        svg {
          fill: var(--person-testimonial-color);
          height: 24px;
          width: 24px;
        }

        .wrap {
          margin: 15px;
        }

        .testimonial {
          line-height: 24px;
          font-size: 16px;
          font-style: italic;
        }

        .name {
          font-size: 21px;
          text-transform: uppercase;
          font-weight: bold;
          margin-top: 20px;
        }

        .position {
          font-size: 14px;
          margin-top: 5px;
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
            ---hax-body-editable-outline,
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
            margin-top: 25px;
            border-radius: 50%;
            padding: 5px;
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
                src="${this.image}"
                loading="lazy"
                aria-describedby="${this.describedBy}"
              />
            </div>`
          : ``}
        <div class="arrow_right"></div>
        <div class="wrap">
          <div class="testimonial" data-layout-slotname="Quote">
            <svg id="quotestart">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
            </svg>
            <slot></slot>
            <svg id="quoteend">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
            </svg>
          </div>
          <div class="name">${this.name}</div>
          <div class="position">${this.position}</div>
        </div>
      </div>
    `;
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
