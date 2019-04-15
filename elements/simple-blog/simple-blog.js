import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSThemeWiring.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { DynamicImporter } from "@lrnwebcomponents/dynamic-importer/dynamic-importer.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./lib/simple-blog-listing.js";
import "./lib/simple-blog-post.js";
/**
 * `simple-blog`
 * `A simple blog and associated elements`
 * @demo demo/index.html
 */
class SimpleBlog extends DynamicImporter(HAXCMSTheme(PolymerElement)) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-blog";
  }
  /**
   * Dynamically import these late so we can load faster
   */
  dynamicImports() {
    return {
      "iron-pages": "@polymer/iron-pages/iron-pages.js",
      "paper-icon-button": "@polymer/paper-icon-button/paper-icon-button.js",
      "simple-blog-header":
        "@lrnwebcomponents/simple-blog/lib/simple-blog-header.js",
      "simple-blog-footer":
        "@lrnwebcomponents/simple-blog/lib/simple-blog-footer.js"
    };
  }
  // render function
  static get template() {
    return html`
      <custom-style>
        <style>
          html,
          body {
            background-color: #fafafa;
          }
        </style>
      </custom-style>
      <style include="simple-colors">
        :host {
          display: block;
          font-family: "Roboto", "Noto", sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 14px;
          background-color: #fafafa;
          font-family: "Open Sans", "MundoSans", helvetica neue, Arial,
            Helvetica, sans-serif;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-font-feature-settings: "liga=1, dlig=1";
          -ms-font-feature-settings: "liga", "dlig";
          -webkit-font-feature-settings: "liga", "dlig";
          -o-font-feature-settings: "liga", "dlig";
          font-feature-settings: "liga", "dlig";
        }
        #backbutton {
          position: fixed;
          top: 0px;
          left: 0px;
          padding: 2px;
          width: 40px;
          height: 40px;
          margin: 8px;
          z-index: 1000;
          color: black;
          background-color: rgba(250, 250, 250, 0.5);
          opacity: 0.5;
          border-radius: 50%;
          transition: all 0.6s linear;
        }
        #backbutton:focus,
        #backbutton:hover {
          opacity: 1;
          color: white;
          background-color: var(--haxcms-color, black);
        }
        iron-pages,
        iron-pages section {
          width: 100vw;
          height: 100vh;
        }
        #post {
          transition: all 0.6s ease-in-out;
          visibility: hidden;
        }
        :host([selected-page="0"]) #post {
          visibility: visible;
          opacity: 0;
          visibility: hidden;
        }
        :host([selected-page="1"]) #post {
          visibility: visible;
          opacity: 1;
        }
        a, a:* {
          color: inherit;
        }
      </style>
      <iron-pages selected="[[selectedPage]]">
        <section>
          <simple-blog-header></simple-blog-header>
          <simple-blog-listing id="listing"></simple-blog-listing>
        </section>
        <section>
          <paper-icon-button
            id="backbutton"
            icon="icons:arrow-back"
            on-tap="_goBack"
          ></paper-icon-button>
          <paper-tooltip
            for="backbutton"
            position="right"
            offset="14"
            animation-delay="100"
            >Back to listing
          </paper-tooltip>
          <simple-blog-post id="post" edit-mode="[[editMode]]"
            ><slot></slot
          ></simple-blog-post>
          <simple-blog-footer id="footer"></simple-blog-footer>
        </section>
      </iron-pages>
    `;
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    let props = super.properties;
    props.selectedPage = {
      type: Number,
      reflectToAttribute: true,
      value: 0
    };
    return props;
  }
  constructor() {
    super();
    this.__disposer = [];
    autorun(reaction => {
      this.activeId = toJS(store.activeId);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this._locationChanged(store.location);
      this.__disposer.push(reaction);
    });
  }
  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, () => {
      this.contentContainer = this.$.post.$.contentcontainer;
    });
  }
  /**
   * detatched life cycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    // clean up state
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
  }
  /**
   * Listen for router location changes
   * @param {event} e
   */
  _locationChanged(location) {
    if (!location || typeof location.route === "undefined") return;
    const name = location.route.name;
    if (name === "home" || name === "404") {
      this.selectedPage = 0;
    } else {
      window.scrollTo({
        top: 0,
        left: 0
      });
      this.selectedPage = 1;
    }
  }
  /**
   * Reset the active item to reset state
   */
  _goBack(e) {
    const prevActiveItemId = store.activeId;
    window.history.pushState(null, null, store.location.baseUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
    // should help account for starting on a page where popstate isn't set
    // and also generate data model mirroring
    if (prevActiveItemId) {
      setTimeout(() => {
        let active = this.$.listing.shadowRoot.querySelector(
          'simple-blog-overview[item-id="' + prevActiveItemId + '"]'
        );
        if (active) {
          active.scrollIntoView(true);
          active.focus();
        }
      }, 100);
    } else {
      window.scrollTo({
        top: 0,
        left: 0
      });
    }
    const evt = new CustomEvent("json-outline-schema-active-item-changed", {
      bubbles: true,
      cancelable: true,
      detail: {}
    });
    this.dispatchEvent(evt);
    this.selectedPage = 0;
  }
}
window.customElements.define(SimpleBlog.tag, SimpleBlog);
export { SimpleBlog };
