import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@haxtheweb/code-sample/code-sample.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
 * `haxcms-share-dialog`
 * `Dialog for sharing site content with links and embed codes`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
class HAXCMSShareDialog extends HAXCMSI18NMixin(DDDSuper(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          overflow: auto;
          padding: var(--d-d-d-spacing-4);
        }

        .field-group {
          margin-bottom: var(--d-d-d-spacing-6);
        }

        .field-group:last-child {
          margin-bottom: 0;
        }

        label {
          display: block;
          margin-bottom: var(--d-d-d-spacing-2);
          font-size: var(--d-d-d-font-size-l);
          font-weight: var(--d-d-d-font-weight-medium);
          color: var(--d-d-d-color-text-primary);
        }

        input {
          font-size: var(--d-d-d-font-size-m);
          padding: var(--d-d-d-spacing-3);
          border: 2px solid var(--d-d-d-color-border);
          border-radius: var(--d-d-d-border-radius-s);
          width: 100%;
          box-sizing: border-box;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        input[readonly] {
          background-color: var(--d-d-d-color-surface-2);
          cursor: text;
          font-family: var(--d-d-d-font-family-mono);
          font-size: var(--d-d-d-font-size-s);
        }

        input:focus {
          outline: none;
          border-color: var(--d-d-d-color-primary);
          box-shadow: 0 0 0 3px var(--d-d-d-color-primary-alpha-20);
        }

        #link {
          min-width: 600px;
          overflow: auto;
        }

        code-sample {
          margin-top: var(--d-d-d-spacing-2);
          font-size: var(--d-d-d-font-size-m);
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-share-dialog";
  }
  // render function
  render() {
    return html`
      <div>
        <div class="field-group">
          <label for="link">Share Link</label>
          <input
            type="text"
            id="link"
            value="${this.link}"
            readonly
            title="Click to select all"
          />
        </div>

        <div class="field-group">
          <label for="iframe">Embed Code</label>
          <code-sample
            type="html"
            copy-clipboard-button
            id="iframe"
          ></code-sample>
        </div>

        <div class="field-group">
          <label for="height">Embed Height</label>
          <input
            id="height"
            type="text"
            name="height"
            value="600px"
            @input="${this.calculateShareCode}"
            placeholder="e.g., 600px, 50vh, 400px"
          />
        </div>
      </div>
    `;
  }

  // generate the share
  calculateShareCode() {
    // Get the height value from the input field
    const heightInput = this.shadowRoot.querySelector("#height");
    const height = heightInput ? heightInput.value : "600px";

    // Use current URL as the share link
    this.link = globalThis.location.href;

    // Generate the embed code
    var shareCode = `<template>
      <iframe
        src="${this.link}"
        height="${height}"
        width="100%"
        frameborder="0"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    </template>`;

    const codeElement = this.shadowRoot.querySelector("code-sample");
    if (codeElement) {
      codeElement.innerHTML = shareCode;
      codeElement._updateContent();
    }
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.calculateShareCode();
  }
  static get properties() {
    return {
      ...super.properties,
      link: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.link = globalThis.location.href;
  }
}
globalThis.customElements.define(HAXCMSShareDialog.tag, HAXCMSShareDialog);
export { HAXCMSShareDialog };
