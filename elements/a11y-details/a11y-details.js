/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `a11y-details`
 * accessible progressive disclosure with detail and summary
### Styling
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
--a11y-details-left | left position | 0
--a11y-details-right | right position | 0
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
class A11yDetails extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host,
        details {
          display: inline-flex;
          overflow: visible;
        }

        :host([hidden]) {
          display: none !important;
        }

        summary {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--a11y-details-summary-fontSize, 0.8em);
          color: var(--a11y-details-summary-color, #000);
          background-color: var(--a11y-details-summary-backgroundColor, #fff);
          border-color: var(--a11y-details-summary-borderColor, #ddd);
          border-width: var(--a11y-details-summary-borderWidth, 1px);
          border-style: var(--a11y-details-summary-borderStyle, solid);
          border-radius: var(--a11y-details-summary-borderRadius, 3px);
          padding: var(--a11y-details-summary-padding, 0.5em);
        }

        summary:focus {
          outline: var(--a11y-details-summary-focus-outline, 1px solid #006688);
          color: var(
            --a11y-details-summary-focus-color,
            var(--a11y-details-summary-color, #000)
          );
          background-color: var(
            --a11y-details-summary-focus-backgroundColor,
            var(--a11y-details-summary-backgroundColor, #fff)
          );
          border-color: var(
            --a11y-details-summary-focus-borderColor,
            var(--a11y-details-borderColor, #999)
          );
          border-width: var(
            --a11y-details-summary-focus-borderWidth,
            var(--a11y-details-summary-borderWidth, 1px)
          );
          border-style: var(
            --a11y-details-summary-focus-borderStyle,
            var(--a11y-details-summary-borderStyle, dotted)
          );
          border-radius: var(
            --a11y-details-summary-focus-borderRadius,
            var(--a11y-details-summary-borderRadius, 3px)
          );
        }

        #details-inner {
          position: absolute;
          display: none;
          max-height: 0px;
          transition: all 0.7s ease-in-out 0.2s;
          overflow-y: auto;
          padding: 0;
          font-size: var(--a11y-details-fontSize, 0.8em);
          color: var(--a11y-details-color, #000);
          background-color: var(
            --a11y-details-backgroundColor,
            rgba(255, 255, 255, 0.8)
          );
          border-color: var(--a11y-details-borderColor, #999);
          border-width: var(--a11y-details-borderWidth, 1px);
          border-style: var(--a11y-details-borderStyle, solid);
          border-radius: var(--a11y-details-borderRadius, 3px);
        }

        ::slotted(*:not[slot="summary"]) {
          display: none;
        }

        .close-text,
        details[open] .open-text,
        details:not([open]) .has-open-text,
        details[open] .has-close-text {
          display: none;
        }

        details[open] .close-text {
          display: inline;
        }

        ::slotted([slot="details"]) {
          display: block;
          height: auto;
          max-height: 0;
          overflow: hidden;
          transition: all 0.7s ease-in-out 0.2s;
        }

        details[open] ::slotted([slot="details"]) {
          max-height: var(--a11y-details-maxHeight, 400px);
          transition: all 0.7s ease-in-out 0.2s;
        }

        details[open] #details-inner {
          z-index: 9999999999;
          display: block;
          left: var(--a11y-details-left, unset);
          right: var(--a11y-details-right, unset);
          padding: var(--a11y-details-padding, 0.5em);
          max-height: var(--a11y-details-maxHeight, 400px);
          padding: var(--a11y-details-padding, 0.5em);
          width: calc(auto - 2 * var(--a11y-details-padding, 0.5em));
          transition: all 0.7s ease-in-out 0.2s;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <details id="details">
        <summary
          @click="${this._handleClick}"
          @keyup="${this._handleKeyup}"
          tabindex="0"
          role="button"
        >
          <span class="open-text">${this.openText}</span>
          <span class="close-text">${this.closeText}</span>
          <slot name="summary" class="${this.summaryClasses}"></slot>
        </summary>
        <div id="details-inner"><slot name="details"></slot></div>
      </details>
      <slot hidden></slot>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Accessible Details Button",
        description:
          "Accessible progressive disclosure with detail and summary",
        icon: "icons:arrow-drop-down",
        color: "grey",
        groups: ["11"],
        handles: [
          {
            type: "",
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
            slot: "summary",
            title: "Button",
            description:
              'Summary of the content that if concealed, eg. "info", "medatadata", etc. ',
            inputMethod: "code-editor",
          },
          {
            slot: "details",
            title: "Decription",
            description: "Detailed description that can be hidden or shown",
            inputMethod: "code-editor",
          },
          {
            slot: "",
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
          tag: "a11y-details",
          properties: {
            openText: "Show Aenean",
            closeText: "Hide Aenean",
          },
          content:
            '<div slot="summary">Show Aenean</div>\n<div slot="details">Aenean eget nisl volutpat, molestie purus eget, bibendum metus. Pellentesque magna velit, tincidunt quis pharetra id, gravida placerat erat. Maecenas id dui pretium risus pulvinar feugiat vel nec leo. Praesent non congue tellus. Suspendisse ac tincidunt purus. Donec eu dui a metus vehicula bibendum sed nec tortor. Nunc convallis justo sed nibh consectetur, at pharetra nulla accumsan.\n</div>',
        },
      ],
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * optional text for when summary button is open,
       * eg. "Hide", "Less" or "Close"
       */
      closeText: {
        type: String,
        attribute: "close-text",
        reflect: true,
      },
      /**
       * optional text for when summary button is closed,
       * eg. "Show", "More" or "Open"
       */
      openText: {
        type: String,
        attribute: "open-text",
        reflect: true,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "a11y-details";
  }

  // life cycle
  constructor() {
    super();
    this.closeText = "";
    this.openText = "";
    this.tag = A11yDetails.tag;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    super.disconnectedCallback();
  }
  firstUpdated() {
    if (super.firstUpdated) super.firstUpdated();
    this._updateElement();
    this.observer.observe(this, { childList: true, subtree: true });
  }
  /**
   * gets the details element in shadowRoot
   *
   * @readonly
   * @memberof A11yDetails
   */
  get details() {
    return this && this.shadowRoot && this.shadowRoot.querySelector("details")
      ? this.shadowRoot.querySelector("details")
      : undefined;
  }
  /**
   * gets classe sfor summary to hide summary slot if open/closed text is provided
   *
   * @readonly
   * @memberof A11yDetails
   */
  get summaryClasses() {
    return [
      this.openText && this.openText.trim && this.openText.trim() !== ""
        ? "has-open-text"
        : "",
      this.closeText && this.closeText.trim && this.closeText.trim() !== ""
        ? "has-close-text"
        : "",
    ].join(" ");
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
  get detailsObserver() {
    let callback = () => this._updateElement();
    return new MutationObserver(callback);
  }
  /**
   * provides click for keyboard if open property is not supported by browser
   *
   * @param {event} e
   * @memberof A11yDetails
   */
  _handleClick(e) {
    if (this.details && typeof this.details.open === "undefined") {
      this.toggleOpen();
      e.preventDefault();
      e.stopPropagation();
    }
  }
  /**
   * provides support for keyboard if open property is not supported by browser
   *
   * @param {event} e
   * @memberof A11yDetails
   */
  _handleKeyup(e) {
    if (
      (this.details &&
        typeof this.details.open === "undefined" &&
        e.keyCode == 13) ||
      e.keyCode == 32
    ) {
      this.toggleOpen();
      e.preventDefault();
      e.stopPropagation();
    }
  }
  /**
   * toggles the element
   */
  toggleOpen() {
    if (this.details.hasAttribute("open")) {
      this.details.removeAttribute("open");
      if (this.details.open) this.details.open = false;
    } else {
      this.details.setAttribute("open", "");
      if (this.details.open) this.details.open = true;
    }
  }
  /**
   * updates an element based on changes in slot
   *
   * @memberof A11yDetails
   */
  _updateElement() {
    let details = this.querySelector("* > details"),
      summary = details ? details.querySelector("* > summary") : undefined;
    if (summary) this._copyToSlot("summary", summary.cloneNode(true));
    if (details) {
      let clone = details.cloneNode(true),
        filtered = clone.querySelectorAll("* > summary");
      Object.keys(filtered || {}).forEach((i) => filtered[i].remove());
      this._copyToSlot("details", clone, "div");
    }
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
      this.detailsObserver.observe(this.querySelector("* > details"), {
        childList: true,
        subtree: true,
        characterData: true,
      });
    } else if (
      this._hasMutations(mutationsList, "removedNodes") &&
      !this.querySelector("* > details") &&
      this.detailsObserver.disconnect
    ) {
      this.detailsObserver.disconnect();
    }
  }
  /**
   * searches a mutations list to see if a <details/> element was added or removed
   *
   * @param {object} mutationsList
   * @param {string} [nodeListType="addedNodes"] "addedNodes" of "removedNodes"
   * @returns {boolean}
   * @memberof A11yDetails
   */
  _hasMutations(mutationsList, nodeListType = "addedNodes") {
    return (
      Object.keys(mutationsList || {}).filter((i) => {
        let nodes = mutationsList[i][nodeListType];
        return (
          Object.keys(nodes || {}).filter((j) => {
            let nodeName = nodes[j].tagName;
            return nodeName === "DETAILS";
          }).length > 0
        );
      }).length > 0
    );
  }
  /**
   * moves content cloned from unnamed slot to designated named slot
   *
   * @param {string} slotName 'details' or 'summary' slot
   * @param {string} tagName the tag that will become a slot
   * @param {object} clone content cloned from unnamed slot
   * @memberof A11yDetails
   */
  _copyToSlot(slotName, clone, tagName = "span") {
    let filteredNodes = Object.keys(clone.childNodes || {})
      .filter((i) => {
        let node = clone.childNodes[i];
        return !!node.tagName || node.textContent.trim().length > 0;
      })
      .map((i) => clone.childNodes[parseInt(i)]);
    if (filteredNodes.length === 1 && filteredNodes[0].tagName) {
      clone = filteredNodes[0];
      tagName = clone.tagName;
    }
    let slot = this._getSlot(slotName, tagName);
    slot.innerHTML = clone.innerHTML;
    clone.remove();
  }
  /**
   * gets an existing named slot or makes one
   *
   * @param {string} slotName
   * @returns {object}
   * @memberof A11yDetails
   */
  _getSlot(slotName, tagName = "span") {
    let slot = this.querySelector(`[slot=${slotName}]`);
    if (slot && slot.tagName !== tagName) slot.remove();
    if (!slot) {
      slot = document.createElement(tagName);
      slot.slot = slotName;
      this.append(slot);
    }
    return slot;
  }
}
customElements.define("a11y-details", A11yDetails);
export { A11yDetails };
