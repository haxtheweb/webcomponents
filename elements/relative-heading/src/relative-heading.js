/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RelativeHeadingLite } from "./lib/relative-heading-lite.js";
import "@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js";

/**
 * `relative-heading`
 * `outputs the correct heading hierarchy based on parent heading`
 *
 * @demo demo/index.html
 * @demo demo/nolinks.html Disable Links
 * @demo demo/rightalign.html Right-Align Links
 * @element relative-heading
 */
class RelativeHeading extends RelativeHeadingLite {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "relative-heading";
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.linkAlignRight = false;
    this.disableLink = false;
    this.linkIcon = "link";
    this.linkLabel = "Get link";
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.disableLink) this.manager.useCopyLink();
  }

  /**
   * gets whether heading is currently anchored
   * @readonly
   * @returns {boolean}
   */
  get anchored() {
    return window.AnchorBehaviors && window.AnchorBehaviors.getTarget
      ? window.AnchorBehaviors.getTarget(this)
      : false;
  }

  get button() {
    console.log(this.disableLink);
    return this.disableLink
      ? html``
      : html`
          <paper-icon-button
            controls="relative-heading-toast"
            .aria-describedby="${this.id}"
            .icon="${this.linkIcon}"
            .title="${this.linkLabel}"
            ?hidden="${this.disableLink}"
            ?disabled="${this.disableLink}"
            @click="${this._handleCopyClick}"
          >
          </paper-icon-button>
        `;
  }
  _handleCopyClick() {
    if (!this.disableLink && this.manager && this.manager.copyLink)
      this.manager.copyLink(this);
  }
}
window.customElements.define(RelativeHeading.tag, RelativeHeading);
export { RelativeHeading };
