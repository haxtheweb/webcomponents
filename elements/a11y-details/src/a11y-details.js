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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
