/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { A11yDetails } from "@lrnwebcomponents/a11y-details/a11y-details.js";
/**
 * `a11y-figure`
 * accessible progressive disclosure with detail and summary
### Styling
#### Figure Caption
Custom property | Description | Default
----------------|-------------|----------
--a11y-details-figcaption-fontSize | font-size | unset
--a11y-details-figcaption-color | text color | #000
--a11y-details-figcaption-backgroundColor | background-color | #fff
--a11y-details-figcaption-margin | padding | 0
--a11y-details-figcaption-padding | padding | 0

#### Summary Button
Custom property | Description | Default
----------------|-------------|----------
--a11y-details-summary-fontSize | font-size | 0.8em
--a11y-details-summary-color | text color | #000
--a11y-details-summary-backgroundColor | background-color | #fff
--a11y-details-summary-borderColor | border-color | #000
--a11y-details-summary-borderWidth | border-width | 1px
--a11y-details-summary-borderStyle | border-style | solid
--a11y-details-summary-borderRadius | border-radius | 3px
--a11y-details-summary-padding | padding | 0.5em

#### Summary Button (:focus state)
Custom property | Description | Default
----------------|-------------|----------
--a11y-details-summary-focus-color | text color | #000
--a11y-details-summary-focus-backgroundColor | background-color | #fff
--a11y-details-summary-focus-borderColor | border-color | #000
--a11y-details-summary-focus-borderWidth | border-width | 1px
--a11y-details-summary-focus-borderStyle | border-style | dotted
--a11y-details-summary-focus-borderRadius | border-radius | 3px

#### Details
Custom property | Description | Default
----------------|-------------|----------
--a11y-details-fontSize | font-size  | 0.8em
--a11y-details-color | text color | #000
--a11y-details-backgroundColor | background-color | rgba(255,255,255,0.8)
--a11y-details-borderColor | border-color | #000
--a11y-details-borderWidth | border-width | 1px
--a11y-details-borderStyle | border-style | solid
--a11y-details-borderRadius | border-radius | 3px
--a11y-details-padding | padding | 0.5em
--a11y-details-maxHeight | max-height | 400px
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class A11yFigure extends A11yDetails {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          padding: 5px;
          border: 1px solid #ddd;
        }
        :host([hidden]) {
          display: none;
        }
        figure {
          display: inline-table;
          position: relative;
          margin: 0;
        }
        figcaption {
          display: table-caption;
          caption-side: bottom;
          position: relative;
          margin: var(--a11y-figure-figcaption-margin, 0);
          padding: var(--a11y-figure-figcaption-padding, 0);
          font-size: var(--a11y-figure-figcaption-fontSize, unset);
          background-color: var(--a11y-figure-figcaption-backgroundColor, #fff);
          color: var(--a11y-figure-figcaption-color, #000);
          --a11y-details-left: var(--a11y-figure-details-left, 0);
          --a11y-details-right: var(--a11y-figure-details-right, 0);
          --a11y-details-fontSize: var(--a11y-figure-details-fontSize, 0.8em);
        }
        ::slotted([slot="figcaption"]) {
          margin: 0;
          flex: 1 1 auto;
        }
        img,
        ::slotted([slot="image"]) {
          width: 100%;
        }
        a11y-details:not([hidden]) {
          display: flex;
          justify-content: flex-end;
        }
      `,
    ];
  }

  // render function
  render() {
    return html`
      <figure>
        ${this.imgSrc
          ? html` <img src="${this.imgSrc}" alt="${this.imgAlt}" /> `
          : ``}
        <slot name="image" ?hidden="${this.imgSrc}"></slot>
        <figcaption>
          <slot name="figcaption"></slot>
          <a11y-details
            open-text="${this.openText}"
            close-text="${this.closeText}"
            ?hidden="${!this.__hasDetail}"
          >
            <div slot="summary"><slot name="summary"></slot></div>
            <div slot="details"><slot name="details"></slot></div>
            <slot name="figdetails"></slot>
          </a11y-details>
        </figcaption>
      </figure>
      <slot hidden></slot>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Accessible Figure",
        description: "Accessible figure with long description",
        icon: "av:call-to-action",
        color: "grey",
        groups: ["11"],
        handles: [
          {
            type: "image",
            source: "imgSrc",
            alt: "imgAlt",
            caption: "figcaption",
            ariaDescribedby: "describedBy",
          },
        ],
        meta: {
          author: "nikkimk",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "imgSrc",
            title: "Image",
            inputMethod: "haxupload",
          },
          {
            property: "imgAlt",
            title: "Alt Text",
            inputMethod: "alt",
            required: true,
          },
          {
            slot: "figcaption",
            title: "Figure Caption",
            description: "Figure caption text that is always visible.",
            inputMethod: "code-editor",
          },
          {
            slot: "details",
            title: "Decription",
            description:
              "Detailed image description that can be hidden or shown",
            inputMethod: "code-editor",
          },
          {
            slot: "summary",
            title: "Decription Button",
            description:
              'Default for button that shows/hides description text, eg. "info", "medatadata", etc. ',
            inputMethod: "code-editor",
          },
        ],
        advanced: [
          {
            property: "openText",
            title: "Optional summary text when details are open",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "closeText",
            title: "Optional summary text when details are closed",
            inputMethod: "textfield",
            required: false,
          },
        ],
      },
      demoSchema: [
        {
          tag: "a11y-figure",
          properties: {
            imgSrc: "//placekitten.com/400/300",
            imgAlt: "random kitten",
            openText: "Show Description",
            closeText: "Hide Description",
            style: "max-width:400px",
          },
          content:
            '<h4 slot="figcaption">Random Kitten</h4>\n<div slot="summary">Image Description</div>\n<div slot="details">Aenean eget nisl volutpat, molestie purus eget, bibendum metus. Pellentesque magna velit, tincidunt quis pharetra id, gravida placerat erat. Maecenas id dui pretium risus pulvinar feugiat vel nec leo. Praesent non congue tellus. Suspendisse ac tincidunt purus. Donec eu dui a metus vehicula bibendum sed nec tortor. Nunc convallis justo sed nibh consectetur, at pharetra nulla accumsan.</div>',
        },
      ],
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      imgSrc: {
        type: String,
        attribute: "img-src",
      },
      imgAlt: {
        type: String,
        attribute: "img-alt",
      },
      __hasDetail: {
        type: Boolean,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "a11y-figure";
  }

  // life cycle
  constructor() {
    super();
    this.tag = A11yFigure.tag;
  }

  /**
   * mutation observer for a11y-details
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = (mutationsList) => this._watchChildren(mutationsList);
    return new MutationObserver(callback);
  }

  /**
   * mutation observer for <details/> in unnamed slot
   * @readonly
   * @returns {object}
   */
  get figureObserver() {
    let callback = () => this._updateElement();
    return new MutationObserver(callback);
  }
  /**
   * updates an element based on changes in slot
   *
   * @memberof A11yDetails
   */
  _updateElement() {
    let figure = this.querySelector("* > figure"),
      image = figure ? figure.querySelector("* > img") : undefined,
      figcaption = figure ? figure.querySelector("* > figcaption") : undefined;
    if (image) {
      (this.querySelectorAll("[slot=image]") || []).forEach((image) =>
        image.remove()
      );
      image.cloneNode();
      image.slot = "image";
      this.appendChild(image);
    }
    this.__hasDetail =
      !!this.querySelector("summary") ||
      !!this.querySelector("*[slot=summary]");
    console.log(
      this.querySelector("summary"),
      this.querySelector("*[slot=summary]"),
      !!this.querySelector("summary") || !!this.querySelector("*[slot=summary]")
    );
    if (figcaption) {
      this._copyAndFilter(figcaption.cloneNode(true), [
        "figcaption",
        "details",
        "summary",
      ]);
    }
  }
  _copyAndFilter(clone, nodenames = [], i = 0) {
    let childname = nodenames[i + 1],
      child =
        clone && childname
          ? clone.querySelector(`* > ${childname}`)
          : undefined;
    if (child) {
      this._copyAndFilter(child, nodenames, i + 1);
      Object.keys(child || {}).forEach((index) => child[index].remove());
    }
    this._copyToSlot(nodenames[i], clone);
  }
  /**
   * watches the element's slots for a <details/> element
   *
   * @param {object} mutationsList
   * @memberof A11yDetails
   */
  _watchChildren(mutationsList) {
    if (this._hasMutations(mutationsList)) {
      this._updateElement();
      this.figureObserver.observe(this.querySelector("* > figure"), {
        childList: true,
        subtree: true,
        characterData: true,
      });
    } else if (
      this._hasMutations(mutationsList, "removedNodes") &&
      !this.querySelector("* > figureObserver") &&
      this.detailsObserver.disconnect
    ) {
      this.detailsObserver.disconnect();
    }
  }
}
customElements.define("a11y-figure", A11yFigure);
export { A11yFigure };
