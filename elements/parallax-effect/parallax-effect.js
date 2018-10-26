import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "jarallax/src/jarallax.esm.js";
import "jarallax/src/jarallax-video.esm.js";
import "jarallax/src/jarallax-element.esm.js";
/**
 * `parallax-effect`
 * `Apply a scroll by effect`
 *
 * @demo demo/index.html
 */
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }

      .jarallax {
        position: relative;
        z-index: 0;
        height: 400px;
        overflow: hidden;
      }

      .jarallax>.jarallax-img {
        position: absolute;
        object-fit: cover;
        /* support for plugin https://github.com/bfred-it/object-fit-images */
        font-family: 'object-fit: cover;';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }

      #title_contain {
        display: flex;
        /* flex-direction: column; */
        justify-content: center;
        padding-top: 170px;
      }

      .title {
        background: rgba(0, 0, 0, 0.3);
        display: block;
        padding: 20px 15px;
        text-align: center;
        width: 40%;
        color: #fff;
        font-size: 2em;
        position: absolute;
        border: solid 1px;
      }

      @media screen and (max-width: 900px) {
        .title {
          font-size: 18px;
        }
      }

      @media screen and (max-width: 600px) {
        .title {
          font-size: 14px;
        }
      }
    </style>

    <a href="[[url]]" target\$="[[_urlTarget(url)]]">
      <div class="parallax_contain">
        <div class="jarallax">
          <template is="dom-if" if="[[title]]">
            <div id="title_contain">
              <div class="title">[[title]]</div>
            </div>
          </template>
        </div>
      </div>
    </a>
`,

  is: "parallax-effect",

  properties: {
    /**
     * Types of parallax (image / video)
     */
    type: {
      type: String,
      value: "image",
      reflectToAttribute: true
    },
    /**
     * Source of (image / video)
     */
    src: {
      type: String,
      value: "",
      reflectToAttribute: true
    },

    /**
     * Alt text for image
     */
    alt: {
      type: String,
      value: "",
      reflectToAttribute: true
    },
    /**
     * Title for parallax panel
     */
    title: {
      type: String,
      value: "",
      reflectToAttribute: true
    },
    /**
     * Url for parallax panel
     */
    url: {
      type: String,
      value: "",
      reflectToAttribute: true
    }
  },

  attached: function() {
    const targets = this.querySelectorAll(".jarallax");
    const options = {
      speed: 0.2,
      videoStartTime: 6,
      videoEndTime: 23
      // disableParallax: /iPad|iPhone|iPod|Android/,
    };

    switch (this.type) {
      case "image":
        options.imgSrc = this.src;
        break;

      case "video":
        options.videoSrc = this.src;
        break;

      default:
        options.imgSrc = this.src;
        break;
    }

    new Jarallax(targets, options);
  },

  /**
   * Internal function to check if a url is external
   */
  _outsideLink: function(url) {
    if (url.indexOf("http") != 0) return false;
    var loc = location.href,
      path = location.pathname,
      root = loc.substring(0, loc.indexOf(path));
    return url.indexOf(root) != 0;
  },

  _urlTarget: function(url) {
    if (url) {
      const external = this._outsideLink(url);
      if (external) {
        return "_blank";
      }
    }
    return false;
  }
});
