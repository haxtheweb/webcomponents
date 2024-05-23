import { LitElement, html, css } from "lit";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@haxtheweb/code-sample/code-sample.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
 * `haxcms-outline-editor-dialog`
 * `Dialog for presenting an editable outline`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
class HAXCMSShareDialog extends HAXCMSI18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          overflow: auto;
        }
        .buttons {
          position: absolute;
          bottom: 0;
          z-index: 1000000;
          background-color: var(--simple-modal-titlebar-background, #000000);
          color: var(--simple-modal-titlebar-color, #ffffff);
          left: 0;
          right: 0;
        }
        .buttons button {
          color: black;
          background-color: white;
        }
        simple-icon {
          margin-right: 4px;
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
      <form>
        <label for="access">Who are you sharing with?</label>
        <select @change="${this.calculateShareCode}" name="access" id="access">
          <option value="oer">Open to anyone</option>
          <option value="courses">Account required to view</option>
          <option value="iam">Editor rights required</option>
        </select>
        <details>
          <summary>Disable features</summary>
          <div>
            ${[
              "left-col",
              "right-col",
              "search",
              "breadcrumb",
              "print",
              "rss",
              "git-link",
              "footer",
              "qr-code",
            ].map(
              (item) => html`
                <input
                  type="checkbox"
                  name="disable-features"
                  id="${item}"
                  value="${item}"
                  @change="${this.calculateShareCode}"
                /><label for="${item}">${item.replace("-", " ")}</label><br />
              `,
            )}
          </div>
        </details>
        <label for="link">Link</label
        ><input type="text" id="link" value="${this.link}" size="125" /><br />
        <label for="iframe">Embed</label>
        <code-sample
          type="html"
          copy-clipboard-button
          id="iframe"
        ></code-sample>
        <label for="height">Embed height</label>
        <input
          id="height"
          type="text"
          name="height"
          value="600px"
          @input="${this.calculateShareCode}"
        />
      </form>
    `;
  }

  // generate the share
  calculateShareCode() {
    const formData = new FormData(this.shadowRoot.querySelector("form"));
    let form = {};
    for (var pair of formData.entries()) {
      if (form[pair[0]]) {
        form[pair[0]] += `,${pair[1]}`;
      } else {
        form[pair[0]] = pair[1];
      }
    }
    this.link = `${globalThis.location.href.replace(
      "iam.",
      `${form.access}.`,
    )}${
      form["disable-features"]
        ? `?disable-features=${form["disable-features"]}`
        : ``
    }`;
    var shareCode = `<template>
      <iframe
        src="${this.link}"
        height="${form.height}"
        width="100%"
        frameborder="0"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    </template>`;
    this.shadowRoot.querySelector("code-sample").innerHTML = shareCode;
    this.shadowRoot.querySelector("code-sample")._updateContent();
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
customElements.define(HAXCMSShareDialog.tag, HAXCMSShareDialog);
export { HAXCMSShareDialog };
