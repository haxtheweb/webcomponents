import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `parallax-image`
 * @demo demo/index.html
 * @element parallax-image
 */
class ParallaxImage extends SchemaBehaviors(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --parallax-image-background: "";
          --parallax-title-background: rgba(0, 0, 0, 0.3);
          --parallax-title-font: #fff;
        }

        .parallax_container {
          height: 400px;
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
        }

        .parallax {
          background-image: var(--parallax-image-background);
          background-attachment: fixed;
          background-position: top center;
          background-repeat: no-repeat;
          background-size: cover;
          width: 100%;
          height: 100%;
          justify-content: center;
        }

        #bgParallax {
          display: flex;
          align-items: center;
        }

        .title {
          background: var(--parallax-title-background);
          display: block;
          padding: 20px 15px;
          text-align: center;
          width: 40%;
          color: var(--parallax-title-font);
          font-size: 32px;
          position: absolute;
          margin-top: 120px;
        }

        @media screen and (max-width: 900px) {
          .title {
            font-size: 16px;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <div
        class="parallax_container"
        aria-describedby="${this.describedBy || ""}"
      >
        <div id="bgParallax" class="parallax">
          <div class="title" id="titleParallax">
            <slot name="parallax_heading"></slot>
          </div>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "parallax-image";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Image
       */
      imageBg: {
        type: String,
        attribute: "image-bg",
        reflect: true,
      },
      /**
       * Aria-describedby data passed down to appropriate tag
       */
      describedBy: {
        type: String,
        attribute: "described-by",
      },
    };
  }
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.imageBg = "";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "imageBg") {
        this.style.setProperty(
          "--parallax-image-background",
          `url(${this.imageBg})`,
        );
      }
    });
  }

  scrollBy(e) {
    const bgParallax = this.shadowRoot.querySelector("#bgParallax");
    const titleParallax = this.shadowRoot.querySelector("#titleParallax");
    const yParallaxPosition = window.scrollY * -0.2;
    const yParallaxPositionTitle = yParallaxPosition * 1.4;
    bgParallax.style.backgroundPosition = `center ${yParallaxPosition}px`;
    titleParallax.style.transform = `translate3D(0, ${yParallaxPositionTitle}px, 0)`;
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      window.addEventListener("scroll", this.scrollBy.bind(this), {
        signal: this.windowControllers.signal,
      });
    }, 0);
  }
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Parallax image",
        description: "Image scroll by",
        icon: "av:play-circle-filled",
        color: "grey",
        tags: ["Images", "Media", "style"],
        handles: [
          {
            type: "image",
            url: "source",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "imageBg",
            title: "Image",
            description: "image to be involved in the background",
            inputMethod: "haxupload",
            noVoiceRecord: true,
          },
          {
            slot: "parallax_heading",
            title: "Heading area",
            description: "Heading text area",
            inputMethod: "textarea",
          },
        ],
        advanced: [],
      },
    };
  }
}
customElements.define(ParallaxImage.tag, ParallaxImage);
export { ParallaxImage };
