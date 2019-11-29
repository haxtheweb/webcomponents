import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `parallax-image`
 * @customElement parallax-image
 * @demo demo/index.html
 */
class ParallaxImage extends SchemaBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style>
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
      </style>

      <a href="[[url]]" target$="[[_urlTarget(url)]]">
        <div class="parallax_container">
          <div id="bgParallax" class="parallax">
            <div class="title" id="titleParallax">
              <slot name="parallax_heading"></slot>
            </div>
          </div>
        </div>
      </a>
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
        value: "",
        reflectToAttribute: true
      },
      /**
       * Url
       */
      url: {
        type: String,
        value: "",
        reflectToAttribute: true
      }
    };
  }

  static get observers() {
    return ["__updateStyles(imageBg)"];
  }

  _urlTarget(url) {
    if (url) {
      const external = this._outsideLink(url);
      if (external) {
        return "_blank";
      }
    }
    return false;
  }
  /**
   * Internal function to check if a url is external
   */
  _outsideLink(url) {
    if (url.indexOf("http") != 0) return false;
    var loc = location.href,
      path = location.pathname,
      root = loc.substring(0, loc.indexOf(path));
    return url.indexOf(root) != 0;
  }
  __updateStyles(imageBg) {
    this.updateStyles({ "--parallax-image-background": `url(${imageBg})` });
  }
  ready() {
    super.ready();
    const bgParallax = this.shadowRoot.querySelector("#bgParallax");
    const titleParallax = this.shadowRoot.querySelector("#titleParallax");
    window.addEventListener("scroll", e => {
      const yParallaxPosition = window.scrollY * -0.2;
      const yParallaxPositionTitle = yParallaxPosition * 1.4;
      bgParallax.style.backgroundPosition = `center ${yParallaxPosition}px`;
      titleParallax.style.transform = `translate3D(0, ${yParallaxPositionTitle}px, 0)`;
    });
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", e => {
      const yParallaxPosition = window.scrollY * -0.2;
      const yParallaxPositionTitle = yParallaxPosition * 1.4;
      bgParallax.style.backgroundPosition = `center ${yParallaxPosition}px`;
      titleParallax.style.transform = `translate3D(0, ${yParallaxPositionTitle}px, 0)`;
    });
    super.disconnectedCallback();
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Sample gizmo",
        description: "The user will be able to see this for selection in a UI.",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "video",
            url: "source"
          }
        ],
        meta: {
          author: "Your organization on github"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
  }
}
window.customElements.define(ParallaxImage.tag, ParallaxImage);
export { ParallaxImage };
