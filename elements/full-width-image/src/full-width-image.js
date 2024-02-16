/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `full-width-image`
 * `full width image that flows beyond boundaries`
 *
 * @microcopy - language worth noting:
 *  - images are best used when stretched across content
 *
 * @demo demo/index.html
 * @element full-width-image
 */
class FullWidthImage extends LitElement {
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

        #image {
          left: 0;
          right: 0;
          position: relative;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          width: 100%;
          text-align: center;
        }

        .wrapper {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.6);
          padding: 100px;
          height: 100px;
          transition: 0.3s all ease-in-out;
        }

        .wrapper:hover {
          opacity: 0;
          background-color: transparent;
        }

        .caption {
          padding: 35px 0;
          font-size: var(--full-width-image-font-size, 25px);
          line-height: 40px;
          color: #fff;
          font-style: italic;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div id="image">
      <div class="wrapper">
        <div class="caption">
          ${this.caption}
          <slot></slot>
        </div>
      </div>
    </div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      source: {
        type: String,
        reflect: true,
      },
      caption: {
        type: String,
        reflect: true,
      },
    };
  }

  /**
   * convention
   */
  static get tag() {
    return "full-width-image";
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "source") {
        this._sourceChanged(this[propName]);
      }
    });
  }

  _sourceChanged(newValue) {
    if (typeof newValue !== typeof undefined) {
      this.shadowRoot.querySelector("#image").style.backgroundImage =
        `url("${newValue}")`;
    }
  }
}
customElements.define("full-width-image", FullWidthImage);
export { FullWidthImage };
