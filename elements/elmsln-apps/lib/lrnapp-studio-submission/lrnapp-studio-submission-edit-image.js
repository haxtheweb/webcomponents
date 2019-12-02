import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-image/iron-image.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
class LrnappStudioSubmissionEditImage extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
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
      `
    ];
  }
  render() {
    return html`
      <lrnapp-studio-submission-media-editoverlay
        data-index="${this.index}"
        embedcode="${this.embedcode}"
      >
        <iron-image
          src="${this.thumbnail}"
          style="width:200px; height:200px; background-color: lightgray;"
          sizing="contain"
          class="contain"
          preload=""
          fade=""
        ></iron-image>
      </lrnapp-studio-submission-media-editoverlay>
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == 'image') {
        this.embedcode = this._computeEmbedCode(this.image);
        this.thumbnail = this._getThumbnail(this.image);
        // notify
        this.dispatchEvent(
          new CustomEvent("image-changed", {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      if (propName == 'thumbnail') {
        // notify
        this.dispatchEvent(
          new CustomEvent("thumbnail-changed", {
            detail: {
              value: this[propName],
            }
          })
        );
      }
    });
  }
  static get tag() {
    return "lrnapp-studio-submission-edit-image";
  }
  static get properties() {
    return {
      index: {
        type: String,
      },
      image: {
        type: Object,
      },
      thumbnail: {
        type: String,
      },
      embedcode: {
        type: String,
      }
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
