import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * `simple-blog-footer`
 * `Footer to blog posts`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - footer of the page for blog posts relating back to the main overview page
 */
class SimpleBlogFooter extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-blog-footer";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        :host *[hidden] {
          display: none;
        }
        .background-closer-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          text-indent: -9999px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0.4;
          transition: all 0.6s linear;
        }
        .background-closer-image-wrap {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.9);
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          text-indent: -9999px;
          transition: all 0.6s linear;
          opacity: 1;
        }
        :host([active]) .background-closer-image {
          opacity: 0.8;
        }
        :host([active]) .background-closer-image-wrap {
          background-color: rgba(0, 0, 0, 0.2);
        }
        .inner {
          width: 100%;
          position: relative;
          z-index: 99;
          max-width: 640px;
          padding: 32px 0;
          text-align: center;
          margin: 0 auto;
        }
        .blog-title {
          margin: 0;
          padding: 0 0 10px;
          font-size: 50px;
          text-align: center;
          font-weight: 700;
          letter-spacing: -2px;
          outline: 0;
          line-height: 50px;
          word-break: break-word;
          color: white;
          text-shadow: 0 1px 16px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 0, 0, 0.5);
        }
        .blog-description {
          margin: 0 0 50px;
          padding: 0 32px;
          font-size: 18px;
          line-height: 1.5;
          color: white;
          text-align: center;
          font-weight: 400;
          text-shadow: 0 1px 16px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 0, 0, 0.5);
        }
        paper-button,
        site-menu-button:not([disabled]) {
          display: block;
          text-align: center;
          letter-spacing: -0.32px;
          font-size: 15px;
          font-weight: 400;
          font-style: normal;
          text-decoration: none;
          cursor: pointer;
          height: 44px;
          background-color: var(--haxcms-color, red);
          color: black;
          box-sizing: border-box;
          border-radius: none;
          line-height: 44px;
          margin: 16px 0;
          padding: 0;
          --site-menu-button-button: {
            height: 44px;
            width: 100%;
          }
        }
        paper-button:focus,
        paper-button:active,
        paper-button:hover,
        site-menu-button:focus,
        site-menu-button:active,
        site-menu-button:hover {
          outline: 2px solid var(--haxcms-color);
          outline-offset: 8px;
        }
        simple-datetime {
          letter-spacing: -0.32px;
          font-weight: 300;
          font-style: normal;
          font-size: 16px;
          line-height: 1.3;
          color: black;
          display: inline-flex;
        }
      </style>
      <div class="background-closer-image-wrap">
        <div
          class="background-closer-image"
          style\$="background-image: url([[manifest.metadata.image]])"
        ></div>
      </div>
      <div class="inner">
        <site-menu-button type="prev" position="right" label="Previous post">
          <simple-datetime
            format="M jS"
            timestamp="[[nextChanged]]"
            unix
            slot="suffix"
          >
          </simple-datetime>
          <span slot="suffix">[[nextTitle]]</span>
        </site-menu-button>
        <site-menu-button type="next" position="right" label="Next post">
          <simple-datetime
            format="M jS"
            timestamp="[[prevChanged]]"
            unix
            slot="prefix"
          ></simple-datetime>
          <span slot="prefix">[[prevTitle]]</span>
        </site-menu-button>
        <paper-button raised on-click="_backButtonTap"
          >Back to list</paper-button
        >
        <h2 class="blog-title">[[manifest.title]]</h2>
        <h3 class="blog-description">[[manifest.description]]</h3>
      </div>
    `;
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    return {
      /**
       * active manifest index, key to location in the manifest itemsarray
       */
      activeManifestIndex: {
        type: Number,
        observer: "_activeManifestIndexChanged"
      },
      /**
       * Manifest, JSON Outline Schema object
       */
      manifest: {
        type: Object
      }
    };
  }
  _activeManifestIndexChanged(newValue) {
    if (this.manifest.items[newValue - 1]) {
      this.prevTitle = " - " + this.manifest.items[newValue - 1].title;
      this.prevChanged = this.manifest.items[newValue - 1].metadata.created;
    } else {
      this.prevTitle = "";
      this.prevChanged = "";
    }
    if (this.manifest.items[newValue + 1]) {
      this.nextTitle = " - " + this.manifest.items[newValue + 1].title;
      this.nextChanged = this.manifest.items[newValue + 1].metadata.created;
    } else {
      this.nextTitle = "";
      this.nextChanged = "";
    }
  }
  constructor() {
    super();
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js");
    import("@polymer/paper-button/paper-button.js");
    import("@lrnwebcomponents/simple-datetime/simple-datetime.js");
  }
  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = [];
    autorun(reaction => {
      this.manifest = toJS(store.routerManifest);
      if (typeof this.manifest.title !== typeof undefined) {
        document.title = this.manifest.title;
      }
      if (
        typeof this.manifest.metadata !== typeof undefined &&
        typeof this.manifest.metadata.cssVariable !== typeof undefined
      ) {
        // json outline schema changed, allow other things to react
        // fake way of forcing an update of these items
        let ary = this.manifest.metadata.cssVariable
          .replace("--simple-colors-default-theme-", "")
          .split("-");
        ary.pop();
        this.accentColor = ary.join("-");
        // set this directly instead of messing w/ accentColor
        document.body.style.setProperty(
          "--haxcms-color",
          this.manifest.metadata.hexCode
        );
      }
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });
  }
  /**
   * detatched life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }

  /**
   * Fire event to unset the global activeItem.
   */
  _backButtonTap(e) {
    window.history.pushState(null, null, store.location.baseUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}
window.customElements.define(SimpleBlogFooter.tag, SimpleBlogFooter);
export { SimpleBlogFooter };
