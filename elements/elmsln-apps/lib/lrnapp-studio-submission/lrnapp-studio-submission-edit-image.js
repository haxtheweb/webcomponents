import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-image/iron-image.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
class LrnappStudioSubmissionEditImage extends PolymerElement {
  static get template() {
    return html`
      <custom-style>
        <style is="custom-style">
          :host {
            display: inline-flex;
            justify-content: space-around;
            min-height: 100px;
            position: relative;
          }

          iron-image {
            --iron-image-height: 200px;
            display: block;
          }
        </style>
      </custom-style>
      <lrnapp-studio-submission-media-editoverlay
        on-delete="_delete"
        data-index\$="[[index]]"
        embedcode="{{embedcode}}"
      >
        <iron-image
          src="[[thumbnail]]"
          style="width:200px; height:200px; background-color: lightgray;"
          sizing="contain"
          class="contain"
          preload=""
          fade=""
        ></iron-image>
      </lrnapp-studio-submission-media-editoverlay>
    `;
  }

  static get tag() {
    return "lrnapp-studio-submission-edit-image";
  }
  static get properties() {
    return {
      image: {
        type: Object,
        notify: true
      },
      thumbnail: {
        type: String,
        notify: true,
        computed: "_getThumbnail(image)"
      },
      embedcode: {
        type: String,
        computed: "_computeEmbedCode(image)"
      }
    };
  }

  _getThumbnail(image) {
    return image.url;
  }

  _computeEmbedCode(image) {
    return "![Alternative Text Here](" + image.url + ")";
  }

  _delete(e) {
    this.dispatchEvent(
      new CustomEvent("deleted", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true
      })
    );
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditImage.tag,
  LrnappStudioSubmissionEditImage
);
export { LrnappStudioSubmissionEditImage };
