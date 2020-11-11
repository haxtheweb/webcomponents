/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/accent-card/accent-card.js";

/**
 * `elmsln-studio-submission-card`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-submission-card
 * @lit-html
 * @lit-element
 * @demo demo/submission.html
 */
class ElmslnStudioSubmissionCard extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-submission-card";
  }

  static get styles() {
    return [
      css`
        :host,
        accent-card {
          line-height: 160%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: stretch;
        }
        accent-card {
          width: auto;
          flex: 1 1 auto;
          --accent-card-padding: 0;
          --accent-card-heading-min-height: 30px;
          --accent-card-heading-padding-top: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-heading-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-heading-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-subheading-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-subheading-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-content-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-content-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-content-padding-bottom: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-left: calc(
            0.25 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-right: calc(
            0.25 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-top: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-bottom: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-image-padding-bottom: 5px;
          --accent-card-image-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-image-width: 33.33333%;
          --accent-card-image-height: 200px;
        }
        accent-card:focus-within,
        accent-card:hover {
          outline: 2px solid var(--accent-card-border-color);
        }
        [slot="feature"] {
          margin-top: var(--elmsln-studio-margin, 20px);
          height: calc(
            var(--accent-card-image-height, 200px) -
              var(--elmsln-studio-margin, 20px)
          );
          overflow: auto;
        }
        [slot="heading"] {
          font-weight: var(--elmsln-studio-FontWeightLight, 300);
          font-size: 22px;
        }
        [slot="corner"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 12px;
        }
        [slot="subheading"] {
          font-weight: var(--elmsln-studio-FontWeightBold, 500);
          font-size: 18px;
          font-style: normal;
          color: #5d5e5f;
        }
        [slot="content"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 14px;
          color: #7e7e7e;
        }
        [slot="footer"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 12px;
          text-transform: uppercase;
          text-align: right;
          color: #95989a;
        }
        [slot="footer"] elmsln-studio-link {
          margin: 0 calc(0.5 * var(--elmsln-studio-margin, 20px));
          text-align: right;
          --elmsln-studio-link-Color: #7e7e7e;
        }
        [slot="footer"] elmsln-studio-link:focus,
        [slot="footer"] elmsln-studio-link:focus-within,
        [slot="footer"] elmsln-studio-link:hover {
          --elmsln-studio-link-Color: #95989a;
          --elmsln-studio-link-TextDecoration: none !important;
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
      <accent-card
        image-src="${this.imageSrc || ""}"
        .image-alt="${this.imageAlt || undefined}"
        ?horizontal="${this.horizontal}"
        .image-align="${this.imageAlign}"
        .image-valign="${this.imageValign}"
        .gravity="${this.imageGravity}"
        no-border
      >
        <slot name="student" slot="heading"></slot>
        <slot name="datetime" slot="corner"></slot>
        <slot name="assigmment" slot="subheading"></slot>
        <slot name="project" slot="content"></slot>
        <slot name="feature" slot="content"></slot>
        <slot name="feedback" slot="footer"></slot>
      </accent-card>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      imageSrc: {
        type: String,
        attribute: "image-src",
      },
      imageAlt: {
        type: String,
        attribute: "image-alt",
      },
      imageAlign: {
        type: String,
        attribute: "image-align",
      },
      imageValign: {
        type: String,
        attribute: "image-valign",
      },
      horizontal: {
        type: Boolean,
        attribute: "horizontal",
      },
    };
  }

  // life cycle
  constructor() {
    super();
    this.horizontal = false;
    this.tag = ElmslnStudioSubmissionCard.tag;
  }
}
customElements.define(
  "elmsln-studio-submission-card",
  ElmslnStudioSubmissionCard
);
export { ElmslnStudioSubmissionCard };
