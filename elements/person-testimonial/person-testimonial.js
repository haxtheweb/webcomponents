import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-image/iron-image.js";
/**
 * `person-testimonial`
 * @element person-testimonial
 * `Leaving a testimonial from a person to say your company rocks!`
 * @demo demo/index.html
 */
class PersonTestimonial extends SimpleColors {
  constructor() {
    super();
    this.elevation = 1;
  }
  static get styles() {
    return [
      ...super.styles,
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

        paper-card {
          display: inline-flex;
          background-color: var(--person-testimonial-bg);
          color: var(--person-testimonial-text);
          font-family: var(--person-testimonial-font-family);
        }

        iron-image {
          display: block;
          width: 150px;
          height: 100%;
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

        #quoteend {
          display: inline-flex;
        }
        @media screen and (max-width: 850px) {
          paper-card {
            display: flex;
            flex-wrap: wrap;
          }
          iron-image {
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
          iron-image {
            width: 150px;
            height: 150px;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <paper-card elevation="${this.elevation}">
        <div class="image">
          <iron-image
            src="${this.image}"
            sizing="cover"
            preload
            fade
            aria-describedby="${this.describedBy}"
          ></iron-image>
        </div>
        <div class="arrow_right"></div>
        <div class="wrap">
          <div class="testimonial">
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
      </paper-card>
    `;
  }
  static get tag() {
    return "person-testimonial";
  }
  static get properties() {
    return {
      ...super.properties,

      /**
       * Visual height of the card.
       */
      elevation: {
        type: Number,
        reflect: true,
      },
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
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Testimonial",
        description: "A person saying a nice thing about us",
        icon: "editor:format-quote",
        color: "orange",
        groups: ["Content", "Presentation"],
        handles: [
          {
            type: "image",
            source: "image",
            title: "name",
            caption: "position",
            ariaDescribedby: "describedBy",
          },
        ],
        meta: {
          author: "EberlyODL / LRNWebComponents",
        },
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "image",
            title: "Image",
            description: "Adds image to testimonial",
            inputMethod: "haxupload",
            icon: "editor:insert-photo",
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color use",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill",
          },
          {
            property: "dark",
            title: "Dark",
            description: "Use dark theme",
            inputMethod: "boolean",
            icon: "invert-colors",
          },
          {
            property: "name",
            title: "Full Name",
            description: "Credit the person making the testimonial",
            inputMethod: "textfield",
            icon: "account-circle",
          },
          {
            property: "position",
            title: "Position or Job Title",
            description: "List the position and job title",
            inputMethod: "textfield",
            icon: "icons:work",
          },
          {
            slot: "",
            title: "User's testimonial:",
            description: "This is where you enter your testimonial.",
            inputMethod: "code-editor",
            required: true,
          },
        ],
        advanced: [
          {
            property: "describedBy",
            title: "aria-describedby",
            description:
              "Space-separated list of IDs for elements that describe the image.",
            inputMethod: "textfield",
          },
        ],
      },
    };
  }
}
window.customElements.define(PersonTestimonial.tag, PersonTestimonial);
export { PersonTestimonial };
