/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
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

 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
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
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        figure {
          position: relative;
        }
        figcaption {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          margin: var(--a11y-figure-figcaption-margin, 0);
          padding: var(--a11y-figure-figcaption-padding, 0);
          font-size: var(--a11y-figure-figcaption-fontSize, unset);
          background-color: var(--a11y-figure-figcaption-backgroundColor, #fff);
          color: var(--a11y-figure-figcaption-color, #000);
        }
        ::slotted([slot="figcaption"]) {
          margin: 0;
        }
        ::slotted([slot="image"]) {
          width: 100%;
        }
      `
    ];
  }

  // render function
  render() {
    return html`
      <figure>
        <slot name="image"></slot>
        <figcaption>
          <slot name="figcaption"></slot>
          <a11y-details>
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
    let haxProps = JSON.parse(JSON.stringify(super.haxProperties));
    haxProps.gizmo = {
      title: "Accessible Details Button",
      description: "Accessible progressive disclosure with detail and summary",
      icon: "icons:android",
      color: "green",
      groups: ["11"],
      handles: [
        {
          type: ""
        }
      ],
      meta: {
        author: "nikkimk",
        owner: "The Pennsylvania State University"
      }
    };
    haxProps.demoSchema = [
      {
        tag: "a11y-details",
        properties: {
          openText: "Show Aenean",
          closeText: "Hide Aenean",
          position: "bottom"
        },
        content:
          '<div slot="summary">Show Aenean</div>\n<div slot="details">Aenean eget nisl volutpat, molestie purus eget, bibendum metus. Pellentesque magna velit, tincidunt quis pharetra id, gravida placerat erat. Maecenas id dui pretium risus pulvinar feugiat vel nec leo. Praesent non congue tellus. Suspendisse ac tincidunt purus. Donec eu dui a metus vehicula bibendum sed nec tortor. Nunc convallis justo sed nibh consectetur, at pharetra nulla accumsan.\n</div>'
      }
    ];
    return haxProps;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return { ...super.properties };
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
    let callback = mutationsList => this._watchChildren(mutationsList);
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
      figcaption = figure ? figure.querySelector("* > figcaption") : undefined,
      details = figcaption
        ? figcaption.querySelector("* > details")
        : undefined;
    console.log('_updateElement',figure,image,details,figcaption);
    if (image) {
      (this.querySelectorAll('[slot=image]') || []).forEach(image=>image.remove());
      image.cloneNode();
      image.slot = 'image';
      this.appendChild(image);
    }
    if (details) {
      (this.querySelectorAll('[slot=details]') || []).forEach(image=>image.remove());
      details.cloneNode();
      details.slot = 'details';
      this.appendChild(details);
    }
    if (figcaption) {
      let clone = figcaption.cloneNode(true),
        filtered = details;
        console.log('clone',clone,filtered);
      Object.keys(filtered || {}).forEach(i => filtered[i].remove());
      this._copyToSlot("figcaption", clone);
    }
  }
  /**
   * watches the element's slots for a <details/> element
   *
   * @param {object} mutationsList
   * @memberof A11yDetails
   */
  _watchChildren(mutationsList) {
    console.log('_watchChildren');
    if (this._hasMutations(mutationsList)) {
      console.log('watching figure');
      this._updateElement();
      this.figureObserver.observe(this.querySelector("* > figure"), {
        childList: true,
        subtree: true,
        characterData: true
      });
    } else if (
      this._hasMutations(mutationsList, "removedNodes") &&
      !this.querySelector("* > figureObserver") &&
      this.detailsObserver.disconnect
    ) {
      console.log('end watching figure');
      this.detailsObserver.disconnect();
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(A11yFigure.haxProperties, A11yFigure.tag, this);
  }
}
customElements.define("a11y-figure", A11yFigure);
export { A11yFigure };
