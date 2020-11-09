import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
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

          img.image {
            height: 200px;
            display: block;
          }
        </style>
      </custom-style>
      <lrnapp-studio-submission-media-editoverlay
        data-index$="[[index]]"
        embedcode="{{embedcode}}"
      >
        <img
          src="[[thumbnail]]"
          style="width:200px; height:200px; background-color: lightgray;"
          class="contain"
          loading="lazy"
        />
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
        notify: true,
      },
      thumbnail: {
        type: String,
        notify: true,
        computed: "_getThumbnail(image)",
      },
      embedcode: {
        type: String,
        computed: "_computeEmbedCode(image)",
      },
    };
  }

  _getThumbnail(image) {
    return image.url;
  }

  _computeEmbedCode(image) {
    return "![Alternative Text Here](" + image.url + ")";
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditImage.tag,
  LrnappStudioSubmissionEditImage
);
export { LrnappStudioSubmissionEditImage };
