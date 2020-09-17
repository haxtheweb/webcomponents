import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/a11y-compare-image/a11y-compare-image.js";
/**
 * `image-compare-slider`
 * hax-wired a11y-compare-image
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
        }
        :host([hidden]) {
          display: none !important;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.opacity = false;
  }
  render() {
    return html`
      <a11y-compare-image ?opacity="${this.opacity}">
        <div slot="heading">
          ${this.title ? html` <h2>${this.title}</h2> ` : ``}
          <slot name="heading"></slot>
        </div>
        <div id="description"><slot name="description"></slot></div>
        <img
          slot="bottom"
          src="${this.bottomSrc}"
          alt="${this.bottomAlt}"
          aria-describedby="${this.bottomDescriptionId || "description"}"
        />
        <img
          slot="top"
          src="${this.topSrc}"
          alt="${this.topAlt}"
          aria-describedby="${this.topDescriptionId || "description"}"
        />
      </a11y-compare-image>
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
        attribute: "bottom-alt",
      },
      /**
       * aria-describedby for top image
       */
      bottomDescriptionId: {
        type: String,
        attribute: "bottom-description-id",
      },
      /**
       * src for top image
       */
      bottomSrc: {
        type: String,
        attribute: "bottom-src",
      },
      /**
       * mode for the slider: wipe
       */
      opacity: {
        type: Boolean,
      },
      /**
       * @deprecated Use `slot=heading`
       */
      title: {
        type: String,
      },
      /**
       * src for top image
       */
      topAlt: {
        type: String,
        attribute: "top-alt",
      },
      /**
       * aria-describedby for top image
       */
      topDescriptionId: {
        type: String,
        attribute: "top-description-id",
      },
      /**
       * src for top image
       */
      topSrc: {
        type: String,
        attribute: "top-src",
      },
    };
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
            title: "title",
          },
        ],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        quick: [
          {
            slot: "heading",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "opacity",
            title: "Slider Behavior",
            description:
              "Do you want the slider to wipe the top image across the bottom one (default), or to adjust the opacity of the top image?",
            inputMethod: "boolean",
            icon: "image:compare",
          },
        ],
        configure: [
          {
            slot: "heading",
            title: "Title",
            inputMethod: "textfield",
          },
          {
            slot: "description",
            title: "Description",
            description: "Recommended description for accessibility.",
            inputMethod: "code-editor",
          },
          {
            property: "topSrc",
            title: "Top image",
            description: "The base image to swipe over",
            inputMethod: "haxupload",
            validationType: "url",
            required: true,
          },
          {
            property: "topAlt",
            title: "Top image alt text",
            description: "Required alternate text for accessibility",
            inputMethod: "alt",
            required: true,
          },
          {
            property: "bottomSrc",
            title: "Bottom image",
            description: "The base image to swipe over",
            inputMethod: "haxupload",
            validationType: "url",
            required: true,
          },
          {
            property: "bottomAlt",
            title: "Bottom image alt text",
            description: "Required alternate text for accessibility",
            inputMethod: "alt",
            required: true,
          },
        ],
        advanced: [
          {
            property: "title",
            title: "Title (Deprecated)",
            description: "Use heading instead",
            inputMethod: "textfield",
          },
          {
            property: "topDescriptionId",
            title: "Top aria-decsribedby",
            description:
              "Space-separated id list for long descriptions that appear elsewhere",
            inputMethod: "textfield",
          },
          {
            property: "bottomDescriptionId",
            title: "Bottom aria-decsribedby",
            description:
              "Space-separated id list for long descriptions that appear elsewhere",
            inputMethod: "textfield",
          },
        ],
      },
      demoSchema: [
        {
          tag: "image-compare-slider",
          properties: {
            topSrc: "./demo/images/Matterhorn02.png",
            topAlt: "Matterhorn no snow.",
            topDescription: "cloudy",
            bottomSrc: "./demo/images/Matterhorn01.png",
            bottomAlt: "Matterhorn with snow.",
            bottomDescription: "snowy",
            style: "width:100%;max-width:400px",
          },
          content: `<h2 slot="heading">Image Compare Slider Default</h2><p slot="description">The image on the top or when slider is moved all the way to the right is the <span id="cloudy">Matterhorn on a cloudy day without snow</span>. As you move the slider to the left, the image below it reveals the <span id="snowy">Matterhorn on a clear day with snow</span>.</p>`,
        },
        {
          tag: "image-compare-slider",
          properties: {
            opacity: true,
            topSrc: "./demo/images/Matterhorn02.png",
            topAlt: "Matterhorn no snow.",
            topDescriptionId: "cloudy",
            bottomSrc: "./demo/images/Matterhorn01.png",
            bottomAlt: "Matterhorn with snow.",
            bottomDescriptionId: "snowy",
            style: "width:100%;max-width:400px",
          },
          content: `
            <h2 slot="heading">Image Compare Slider Opacity</h2>
            <div slot="description">
              The slider will fade away the top image
              <span id="cloudy">(Matterhorn on a cloudy day without snow)</span> 
              to reveal the bottom image
              <span id="snowy">(Matterhorn on a clear day with snow)</span>.
            </div>`,
        },
      ],
    };
  }
}
window.customElements.define(ImageCompareSlider.tag, ImageCompareSlider);
export { ImageCompareSlider };
