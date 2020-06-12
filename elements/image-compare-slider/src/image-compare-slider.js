import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { A11yDetails } from "@lrnwebcomponents/a11y-details/a11y-details.js";
/**
 * `image-compare-slider`
 * Layers images over each other with a slider interface to compare them
 * @demo demo/index.html
 * @element image-compare-slider
 */
class ImageCompareSlider extends SchemaBehaviors(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          margin: 15px 0;
        }
        :host([hidden]) {
          display: none !important;
        }
        figure {
          margin: 0;
        }
        #description > div {
          display: flex;
          align-items:flex-end;
          justify-content: space-between;
        }
        a11y-details {
          font-size: 85%;
        }
        #container,
        #container > div {
          margin: 0;
          padding: 0;
        }
        #container > div {
          position: relative;
        }
        #top {
          top: 0;
          left: 0;
          position: absolute;
          opacity: var(--image-compare-slider-opacity, 1);
          width: var(--image-compare-slider-width, 50%);
          overflow: hidden;
        }
        #top img {
          width: var(--image-compare-slider-image-width);
        }
        #top img, 
        #bottom {
          display: block;
        }
        #bottom {
          width: 100%;
        }
        #slider {
          width: calc(100% + 32px);
          margin: -15px 0 0 -16px;
        }
      `
    ];
  }
  constructor() {
    super();
    this.opacity = false;
    import("@lrnwebcomponents/user-action/user-action.js");
    import("@polymer/iron-image/iron-image.js");
    import("@polymer/paper-slider/paper-slider.js");
  }
  render() {
    return html`
      <figure>
        <figcaption>
          ${this.title
            ? html`
                <h2>${this.title}</h2>
              `
            : ""}
          <slot name="heading"></slot>
          <div id="description">
            <slot name="description"></slot>
            <div>
              <a11y-details id="top-desc" 
                ?hidden="${!this.topLongdesc}">
                <details>
                  <summary>${this.topAlt}</summary>
                  ${this.topLongdesc}
                </details>
              </a11y-details>
              <a11y-details id="bottom-desc" 
                ?hidden="${!this.bottomLongdesc}">
                <details>
                  <summary>${this.bottomAlt}</summary>
                  ${this.bottomLongdesc}
                </details>
              </a11y-details>
            </div>
          </div>
        </figcaption>
        <div id="container">
          <div>
            <img id="bottom" src="${this.bottomSrc}" alt="${this.bottomAlt}" aria-describedby="${this.bottomDescribedby}"/>
            <div id="top">
              <img src="${this.topSrc}" alt="${this.topAlt}" aria-describedby="${this.topDescribedby}"/>
            </div>
          </div>
        </div>
        <user-action track="click">
          <paper-slider id="slider" value="50"></paper-slider>
        </user-action>
        <div></div>
      </figure>
    `;
  }

  static get tag() {
    return "image-compare-slider";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * src for top image
       */
      bottomAlt: {
        type: String,
        attribute: "bottom-alt"
      },
      /**
       * src for top image
       */
      bottomAriaDescribedby: {
        type: String,
        attribute: "bottom-aria-describedby"
      },
      /**
       * src for top image
       */
      bottomLongdesc: {
        type: String,
        attribute: "bottom-longdesc"
      },
      /**
       * src for top image
       */
      bottomSrc: {
        type: String,
        attribute: "bottom-src"
      },
      /**
       * mode for the slider: wipe
       */
      opacity: {
        type: Boolean
      },
      /**
       * @deprecated Use `slot=heading`
       */
      title: {
        type: String
      },
      /**
       * src for top image
       */
      topAlt: {
        type: String,
        attribute: "top-alt"
      },
      /**
       * src for top image
       */
      topAriaDescribedby: {
        type: String,
        attribute: "top-aria-describedby"
      },
      /**
       * src for top image
       */
      topLongdesc: {
        type: String,
        attribute: "top-longdesc"
      },
      /**
       * src for top image
       */
      topSrc: {
        type: String,
        attribute: "top-src"
      }
    };
  }

  /**
   * mutation observer for tabs
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this.slotUpdate();
    return new MutationObserver(callback);
  }
  connectedCallback() {
    super.connectedCallback();
    this.slotUpdate();
    this.observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false
    });
  }
  disconnectedCallback() {
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    if (super.disconnectedCallback) super.disconnectedCallback();
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["topSrc"].includes(propName)) {
        this._slide();
      }
    });
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Image comparison",
        description:
          "Simple element to allow one image to swipe over top of the other.",
        icon: "image:compare",
        color: "orange",
        groups: ["Image", "Media"],
        handles: [
          {
            type: "image",
            source: "bottomSrc",
            source2: "topSrc",
            title: "title"
          }
        ],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [
          {
            slot: "heading",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "opacity",
            title: "Slider Behavior",
            description:
              "Do you want the slider to wipe the top image across the bottom one (default), or to adjust the opacity of the top image?",
            inputMethod: "boolean",
            icon: "image:compare"
          }
        ],
        configure: [
          {
            slot: "heading",
            title: "Title",
            inputMethod: "textfield"
          },
          {
            slot: "description",
            title: "Optional Desscription",
            inputMethod: "code-editor"
          },
          {
            property: "topSrc",
            title: "Top image",
            description: "The base image to swipe over",
            inputMethod: "haxupload",
            validationType: "url",
            required: true
          },
          {
            property: "topAlt",
            title: "Top image alt text",
            description: "Required alternate text for accessibility",
            inputMethod: "alt",
            required: true
          },
          {
            slot: "topDesc",
            title: "Top image description",
            description: "Recommended long description for accessibility",
            inputMethod: "code-editor"
          },
          {
            property: "bottomSrc",
            title: "Bottom image",
            description: "The base image to swipe over",
            inputMethod: "haxupload",
            validationType: "url",
            required: true
          },
          {
            property: "bottomAlt",
            title: "Bottom image alt text",
            description: "Required alternate text for accessibility",
            inputMethod: "alt",
            required: true
          },
          {
            slot: "bottomDesc",
            title: "Bottom image description",
            description: "Recommended long description for accessibility",
            inputMethod: "code-editor"
          }
        ],
        advanced: [
          {
            property: "topAriaDescribedby",
            title: "Top aria-decsribedby",
            description: "Space-separated id list for long descriptions that appear elsewhere",
            inputMethod: "textfield"
          },
          {
            property: "bottomAriaDescribedby",
            title: "Bottom aria-decsribedby",
            description: "Space-separated id list for long descriptions that appear elsewhere",
            inputMethod: "textfield"
          }

        ]
      },
      demoSchema: [
        {
          tag: "image-compare-slider",
          properties: {
            topSrc: new URL(`./demo/images/Matterhorn02.png`, import.meta.url),
            topAlt: "Matterhorn no snow.",
            topLongdesc: `<p>The image on the top or when slider is moved all the way to the right is the Matterhorn on a cloudy day without snow.</p>`,
            bottomSrc: new URL(
              `./demo/images/Matterhorn01.png`,
              import.meta.url
            ),
            bottomAlt: "Matterhorn with snow.",
            bottomLongdesc: `<p>As you move the slider to the left, the image below it reveals the Matterhorn on a clear day with snow.</p>`,
            style: "width:100%;max-width:400px"
          },
          content: `<h2 slot="heading">Image Compare Slider Default</h2><p slot="description">The slider will fade away the top image.</p>`
        },
        {
          tag: "image-compare-slider",
          properties: {
            opacity: true,
            topSrc: new URL(`./demo/images/Matterhorn02.png`, import.meta.url),
            topAlt: "Matterhorn no snow.",
            topLongdesc: "longdesc",
            bottomSrc: new URL(
              `./demo/images/Matterhorn01.png`,
              import.meta.url
            ),
            bottomAlt: "Matterhorn with snow.",
            bottomLongdesc: "longdesc",
            style: "width:100%;max-width:400px"
          },
          content: `<h2 slot="heading">Image Compare Slider Wipe</h2><div slot="description"><p>The slider will wipe away the top image.</p><p id="longdesc">The image on the top or when slider is moved all the way to the right is the Matterhorn on a cloudy day without snow. As you move the slider to the left, the image below it reveals the Matterhorn on a clear day with snow.</p></div>`
        }
      ]
    };
  }
  firstUpdated() {
    this.shadowRoot
      .querySelector("#slider")
      .addEventListener("immediate-value-changed", e => {
        this._slide();
      });
  }
  /**
   *  calculated aria-describedby attribute for top image
   *
   * @readonly
   * @memberof ImageCompareSlider
   */
  get topDescribedby(){
    this._getDescribedby(this.topLongdesc ? 'top-desc' : undefined,this.topAriaDescribedby);
  }
  /**
   *  calculated aria-describedby attribute for bottom image
   *
   * @readonly
   * @memberof ImageCompareSlider
   */
  get bottomDescribedby(){
    this._getDescribedby(this.bottomLongdesc ? 'bottom-desc' : undefined,this.bottomAriaDescribedby);
  }
  /**
   * calculate aria-describedby attribute for image
   * 
   * @param {string} longdesc a long description
   * @param {string} ariaDescribedBy manual aria-describedby attribute
   * @returns {string}
   * @memberof ImageCompareSlider
   */
  _getDescribedby(longdesc,ariaDescribedBy){
    return !longdesc 
      && !ariaDescribedBy 
      ? "description" 
      : `${longdesc} ${ariaDescribedBy}`.trim()
  }
  /**
   * updates element based on slotted data
   * @memberof ImageCompareSlider
   */
  slotUpdate() {
    this._imageFromSlot("top");
    this._imageFromSlot("bottom");
  }
  _imageFromSlot(type){
    let image = this.querySelector(`[slot=${type}]`);
    if(image){
      if (image.getAttribute("src")) this[`${type}Src`] = image.getAttribute("src");
      if (image.getAttribute("alt")) this[`${type}Alt`] = image.getAttribute("alt");
      if (image.getAttribute("aria-describedby")) this[`${type}DescribedBy`] = image.getAttribute("aria-describedby");
    }
  }
  /**
   * updates the slider
   */
  _slide() {
    let top = this.shadowRoot.querySelector("#top"), 
    slider = this.shadowRoot.querySelector("#slider");
    if (this.opacity === false) {
      top.style.setProperty('--image-compare-slider-width', slider.immediateValue + "%");
      top.style.setProperty('--image-compare-slider-image-width', (10000/slider.immediateValue) + "%");
      top.style.setProperty('--image-compare-slider-opacity', 1);
    } else {
      top.style.setProperty('--image-compare-slider-width', "100%");
      top.style.setProperty('--image-compare-slider-image-width',  "100%");
      top.style.setProperty('--image-compare-slider-opacity', slider.immediateValue / 100);
    }
  }
}
window.customElements.define(ImageCompareSlider.tag, ImageCompareSlider);
export { ImageCompareSlider };
