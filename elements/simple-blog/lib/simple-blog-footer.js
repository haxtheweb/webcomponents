import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { varExists, varGet } from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `simple-blog-footer`
 * @customElement simple-blog-footer
 * `Footer to blog posts`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - footer of the page for blog posts relating back to the main overview page
 */
class SimpleBlogFooter extends SimpleColors {
  /**
   * LitElement style render
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          position: relative;
          overflow: hidden;
          opacity: 1;
          transition: 0.2s opacity linear;
        }
        :host([edit-mode]) {
          pointer-events: none;
          opacity: 0.2;
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
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-blog-footer";
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <custom-style>
        <style>
          paper-button,
          site-menu-button:not([disabled]) {
            --site-menu-button-button: {
              height: 44px;
              width: 100%;
            }
          }
        </style>
      </custom-style>
      <div class="background-closer-image-wrap">
        <div
          class="background-closer-image"
          style="background-image: url(${this.manifest.metadata.theme.variables
            .image})"
        ></div>
      </div>
      <div class="inner">
        <site-menu-button type="prev" position="right" label="Previous post">
          <simple-datetime
            format="M jS"
            timestamp="${this.nextChanged}"
            unix
            slot="suffix"
          >
          </simple-datetime>
          <span slot="suffix">${this.nextTitle}</span>
        </site-menu-button>
        <site-menu-button type="next" position="right" label="Next post">
          <simple-datetime
            format="M jS"
            timestamp="${this.prevChanged}"
            unix
            slot="prefix"
          ></simple-datetime>
          <span slot="prefix">${this.prevTitle}</span>
        </site-menu-button>
        <paper-button raised @click="${this._backButtonTap}"
          >Back to list</paper-button
        >
        <h2 class="blog-title">${this.manifest.title}</h2>
        <h3 class="blog-description">${this.manifest.description}</h3>
      </div>
    `;
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "activeManifestIndex") {
        this._activeManifestIndexChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      /**
       * active manifest index, key to location in the manifest itemsarray
       */
      activeManifestIndex: {
        type: Number,
        attribute: "active-manifest-index"
      },
      /**
       * Manifest, JSON Outline Schema object
       */
      manifest: {
        type: Object
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode"
      }
    };
  }
  _activeManifestIndexChanged(newValue) {
    if (this.manifest) {
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
  }
  constructor() {
    super();
    this.__disposer = [];
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js");
    import("@polymer/paper-button/paper-button.js");
    import("@lrnwebcomponents/simple-datetime/simple-datetime.js");
    autorun(reaction => {
      this.manifest = toJS(store.routerManifest);
      if (varExists(this.manifest, "title")) {
        document.title = this.manifest.title;
      }
      if (varExists(this.manifest, "metadata.theme.variables.cssVariable")) {
        // json outline schema changed, allow other things to react
        // fake way of forcing an update of these items
        let ary = this.manifest.metadata.theme.variables.cssVariable
          .replace("--simple-colors-default-theme-", "")
          .split("-");
        ary.pop();
        this.accentColor = ary.join("-");
      }
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
  }
  /**
   * HTMLElement
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
