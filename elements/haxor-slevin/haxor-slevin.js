/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { varExists, varGet } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/anchor-behaviors/anchor-behaviors.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@lrnwebcomponents/full-width-image/full-width-image.js";
/**
 * `haxor-slevin`
 * `Tech blogger theme`
 * @demo demo/index.html
 * @element haxor-slevin
 */
class HaxorSlevin extends HAXCMSLitElementTheme {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: #ffffff;
          color: rgba(0, 0, 0, 0.84);
          --hax-base-styles-a-color: var(--haxcms-color, #2196f3);
          --hax-base-styles-a-color-visited: var(--haxcms-color, #2196f3);
          --hax-base-styles-a-color-active: var(--haxcms-color, #2196f3);
        }
        site-modal:not(:defined),
        site-rss-button:not(:defined),
        iron-pages:not(:defined),
        site-share-widget:not(:defined),
        site-active-title:not(:defined),
        site-git-corner:not(:defined),
        social-share-link:not(:defined),
        simple-blog-card:not(:defined) {
          display: none;
        }
        :host([hidden]) {
          display: none;
        }

        /**
        * Hide the slotted content during edit mode. This must be here to work.
        */
        :host([edit-mode]) #slot {
          display: none;
        }
        :host([edit-mode]) .contentcontainer-wrapper simple-blog-card {
          opacity: 0.2;
          pointer-events: none;
        }
        #slot {
          min-height: 50vh;
        }
        site-active-title {
          font-size: 36px;
        }
        site-modal {
          display: inline-flex;
        }
        .wrapper {
          padding-bottom: 80px;
        }
        #home {
          max-width: 1032px;
          padding-left: 20px;
          padding-right: 20px;
          margin: 0 auto;
        }
        .contentcontainer-wrapper {
          max-width: 900px;
          margin: 0 auto;
          box-sizing: border-box;
          padding-left: 20px;
          padding-right: 20px;
        }
        simple-blog-card {
          padding: 16px;
          min-height: 100px;
          border: 2px solid lightgray;
          margin: 8px;
          text-align: center;
        }
        .simple-blog-card-wrapper {
          display: flex;
          justify-content: space-evenly;
        }
        simple-blog-card[size="micro"] {
          padding: 4px;
        }
        iron-pages {
          padding-top: 64px;
        }
        dom-repeat {
          padding-bottom: 16px;
          min-height: 300px;
        }
        full-width-image {
          --full-width-image-font-size: 54px;
        }
        .header-wrapper {
          padding: 0 20px;
          display: flex;
          margin: 0 auto;
          z-index: 100;
          color: #ffffff;
          justify-content: center;
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
          background-color: var(--haxcms-color, rgba(255, 0, 116, 1));
        }
        .header-wrapper div {
          display: inline-flex;
        }
        .backbutton {
          height: 54px;
          cursor: pointer;
          text-align: center;
          line-height: 32px;
          background-color: transparent;
          border: none;
          display: inline-flex;
          color: white;
          min-width: 100px;
          text-transform: unset;
          margin: 0px 16px;
        }

        .social-float {
          top: 160px;
          position: fixed;
          z-index: 99;
          margin-left: -10vw;
          opacity: 1;
          transition: 0.2s opacity linear;
        }
        .social-float.disable-items {
          pointer-events: none;
          opacity: 0.2 !important;
        }
        .social-float ul {
          padding: 0;
          margin: 0;
          list-style: none;
        }

        site-share-widget {
          --site-share-widget-bg: var(--haxcms-color, rgba(255, 0, 116, 1));
        }
        site-share-widget:hover,
        site-share-widget:focus,
        site-share-widget:active {
          --site-share-widget-bg: var(--haxcms-system-action-color, blue);
        }

        social-share-link {
          --social-share-button-bg: var(--haxcms-color, rgba(255, 0, 116, 1));
          --social-share-button-padding: 8px;
          --social-share-button-border-radius: 50%;
        }

        .annoy-user {
          background-color: rgba(255, 255, 255, 0.9);
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          overflow: hidden;
          right: 0;
          box-shadow: 0 -3px 10px 0 rgba(0, 0, 0, 0.0785);
          padding: 10px 0;
          height: 36px;
          z-index: 100;
          opacity: 1;
          transition: 0.2s opacity linear;
        }
        .annoy-user.disable-items {
          pointer-events: none;
          opacity: 0 !important;
        }
        simple-icon-lite {
          height: 40px;
          width: 40px;
          --simple-icon-height: 40px;
          --simple-icon-width: 40px;
          display: flex;
          padding-right: 20px;
        }
        .annoy-user simple-icon-lite {
          color: black;
        }
        .annoy-user span {
          flex: 1 1 auto;
          height: 40px;
          display: flex;
          vertical-align: middle;
          line-height: 40px;
        }
        .annoy-inner strong {
          padding: 0 4px;
        }
        .annoy-user .rss {
          margin-left: 50px;
        }
        .annoy-inner {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
        }
        .subtitle {
          font-family: "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans",
            Geneva, Arial, sans-serif;
          letter-spacing: -0.02em;
          font-weight: 300;
          font-style: normal;
          letter-spacing: 0;
          font-size: 28px;
          line-height: 1.22;
          letter-spacing: -0.012em;
        }
        site-rss-button {
          margin: 0 4px;
          padding: 0;
          color: black;
          --site-rss-color: #000000;
          --site-rss-bg-color: var(--haxcms-color, rgba(255, 0, 116, 1));
          --site-rss-simple-icon-button-padding: 0 4px;
          --site-rss-simple-icon-button-margin: 0;
        }

        @media screen and (max-width: 800px) {
          .simple-blog-card-wrapper simple-blog-card {
            margin: 0 10vw;
          }
          .simple-blog-card-wrapper {
            text-align: center;
          }
          #contentcontainer,
          #home {
            padding-left: 8px;
            padding-right: 8px;
            transition: 0.5s opacity ease-in-out;
          }
          simple-blog-card {
            padding: 0;
          }
          .hide-small {
            display: none !important;
          }
          .annoy-user .rss {
            margin-left: unset;
          }
          .annoy-user {
            position: relative;
            bottom: unset;
            left: unset;
            right: unset;
            padding: 0;
            height: unset;
          }
          .annoy-user span {
            height: unset;
            line-height: unset;
          }
          .annoy-inner {
            max-width: unset;
            margin: 0;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <header class="header-wrapper">
        <div>
          <site-modal
            @site-modal-click="${this.siteModalClick}"
            icon="icons:search"
            title="Search site"
            button-label="Search"
            dark
          >
            <site-search></site-search>
          </site-modal>
        </div>
        <div>
          <simple-icon-button-lite
          class="backbutton"
          @click="${this._goBack}"
            icon="${this.icon}"
            style="color:white;"
          >
          <span class="hide-small">Home</span>
        </simple-icon-button-lite>
        </div>
        <site-region name="header"></site-region>
      </header>
      <div class="wrapper">
        <iron-pages .selected="${this.selectedPage}">
          <div id="home">
            <site-query
              @result-changed="${this.__mainPostsChanged}"
              limit="2"
              sort='{"created": "ASC"}'
            ></site-query>
            <div class="simple-blog-card-wrapper">
              ${this.__mainPosts.map(
                (post) => html`
                  <simple-blog-card
                    color="${this.color}"
                    .title="${post.title}"
                    size="large"
                    .link="${post.slug}"
                    .image="${this._showImage(
                      post.metadata &&
                        post.metadata.image
                        ? post.metadata.image
                        : false
                    )}"
                    .author="${this.author.name}"
                    .timestamp="${post.metadata.created}"
                    .readtime="${post.metadata.readtime}"
                    .authorimage="${this.author.image}"
                    .placeholder="${this.image}"
                    .authorlink="${this.author.socialLink}"
                  >
                    ${post.description}
                  </simple-blog-card>
                `
              )}
            </div>
            <site-query
              @result-changed="${this.__extraPostsChanged}"
              start-index="2"
              limit="4"
              sort='{"created": "ASC"}'
            ></site-query>
            <div class="simple-blog-card-wrapper">
              ${this.__extraPosts.map(
                (post) => html`
                  <simple-blog-card
                    color="${this.color}"
                    .title="${post.title}"
                    size="small"
                    .link="${post.slug}"
                    .image="${this._showImage(
                      post.metadata &&
                        post.metadata.image
                        ? post.metadata.image
                        : false
                    )}"
                    .author="${this.author.name}"
                    .timestamp="${post.metadata.created}"
                    .readtime="${post.metadata.readtime}"
                    .authorimage="${this.author.image}"
                    .placeholder="${this.image}"
                    .authorlink="${this.author.socialLink}"
                  >
                    ${post.description}
                  </simple-blog-card>
                `
              )}
            </div>
          </div>
          <main class="contentcontainer-wrapper">
            <article id="contentcontainer">
              <site-region name="contentTop"></site-region>
              <site-git-corner position="right"></site-git-corner>
              ${this.activeItem && this.activeItem.metadata && this.activeItem.metadata.image ?
              html`<full-width-image source="${this.activeItem.metadata.image}" caption="${this.activeItem.title}"></full-width-image>` : html`<site-active-title></site-active-title>`}
              <h3 class="subtitle" .hidden="${!this.subtitle}">
                ${this.subtitle}
              </h3>
              <section id="slot">
                <slot></slot>
              </section>
              <site-region name="contentBottom"></site-region>
            </article>
            <site-query
              @result-changed="${this.__followUpPostsChanged}"
              limit="3"
              start-index="${this.activeManifestIndexCounter}"
              sort='{"created": "ASC"}'
            ></site-query>
            <div class="simple-blog-card-wrapper">
              ${this.__followUpPosts.map(
                (post) => html`
                  <simple-blog-card
                    color="${this.color}"
                    .title="${post.title}"
                    size="small"
                    .link="${post.slug}"
                    .image="${this._showImage(
                      post.metadata &&
                        post.metadata.image
                        ? post.metadata.image
                        : false
                    )}"
                    .author="${this.author.name}"
                    .timestamp="${post.metadata.created}"
                    .readtime="${post.metadata.readtime}"
                    .authorimage="${this.author.image}"
                    .placeholder="${this.image}"
                    .authorlink="${this.author.socialLink}"
                  >
                    ${post.description}
                  </simple-blog-card>
                `
              )}
            </div>
            <nav class="social-float hide-small ${this.stateClass}">
              <ul>
                <li>
                  <social-share-link
                    title="Share on twitter"
                    button-style
                    mode="icon-only"
                    message="${this.shareMsg}"
                    type="Twitter"
                  >
                  </social-share-link>
                </li>
                <li>
                  <social-share-link
                    title="Share on LinkedIn"
                    button-style
                    mode="icon-only"
                    message="${this.shareMsg}"
                    url="${this.shareUrl}"
                    type="LinkedIn"
                  >
                  </social-share-link>
                </li>
                <li>
                  <social-share-link
                    title="Share on Facebook"
                    button-style
                    mode="icon-only"
                    url="${this.shareUrl}"
                    message="${this.shareMsg}"
                    type="Facebook"
                  >
                  </social-share-link>
                </li>
                <li>
                  <social-share-link
                    title="Share on Pinterest"
                    button-style
                    mode="icon-only"
                    message="${this.shareMsg}"
                    image="${this.activeImage}"
                    url="${this.shareUrl}"
                    type="Pinterest"
                  >
                  </social-share-link>
                </li>
              </ul>
            </nav>
            <footer class="annoy-user ${this.stateClass}">
              <div class="annoy-inner">
                <simple-icon-lite
                  icon="${this.icon}"
                  class="hide-small"
                  style="color:black;"
                ></simple-icon-lite>
                <span class="hide-small">
                  Never miss a story from <strong>${this.title}</strong> use RSS
                  today!
                </span>
                <span class="rss">
                  <site-rss-button type="atom"></site-rss-button>
                  <site-rss-button type="rss"></site-rss-button>
                </span>
                <site-share-widget
                  alt="Share on social media"
                ></site-share-widget>
              </div>
            </footer>
            <site-region name="footerPrimary"></site-region>
          </main>
        </iron-pages>
      </div>
    `;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxor-slevin";
  }
  __mainPostsChanged(e) {
    this.__mainPosts = e.detail.value;
  }
  __followUpPostsChanged(e) {
    var posts = [];
    // support for posts to define their own related content
    if (this.activeItem && this.activeItem.metadata && this.activeItem.metadata.relatedItems) {
      const ids = this.activeItem.metadata.relatedItems.split(',');
      ids.map((id) => {
        posts.push(store.findItem(id));
      });
    }
    else {
      posts = e.detail.value;
    }
    this.__followUpPosts = posts;
  }
  static get properties() {
    return {
      ...super.properties,

      manifest: {
        type: Object,
      },
      color: {
        type: String,
      },
      selectedPage: {
        type: Number,
        reflect: true,
        attribute: "selected-page",
      },
      activeItem: {
        type: Object
      },
      stateClass: {
        type: String,
      },
      __mainPosts: {
        type: Array,
      },
      __extraPosts: {
        type: Array,
      },
      __followUpPosts: {
        type: Array,
      },
    };
  }
  __extraPostsChanged(e) {
    this.__extraPosts = e.detail.value;
  }
  _getStateClass(editMode) {
    if (editMode) {
      return "disable-items";
    }
    return "";
  }
  _getColor(manifest) {
    if (manifest && varExists(manifest, "metadata.theme.variables.hexCode")) {
      return manifest.metadata.theme.variables.hexCode;
    }
  }
  /**
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js"
    );
  }
  constructor() {
    super();
    // to avoid error
    this.icon = "icons:search";
    this.__disposer = [];
    this.__mainPosts = [];
    this.__extraPosts = [];
    this.__followUpPosts = [];
    this.activeItem = {};
    this.selectedPage = 0;
    import("@polymer/iron-pages/iron-pages.js");
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js"
    );
    import("@lrnwebcomponents/simple-blog-card/simple-blog-card.js");
    autorun((reaction) => {
      let location = toJS(store.location);
      this._noticeLocationChange(location);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      let manifest = toJS(store.manifest);
      this.title = varGet(manifest, "title", "");
      this.image = varGet(
        manifest,
        "metadata.theme.variables.image",
        "assets/banner.jpg"
      );
      this.icon = varGet(
        manifest,
        "metadata.theme.variables.icon",
        "icons:record-voice-over"
      );
      this.author = varGet(manifest, "metadata.author", {});
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeManifestIndexCounter = toJS(
        store.activeManifestIndexCounter
      );
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeTitle = toJS(store.activeTitle);
      this.shareUrl = document.location.href;
      this.shareMsg = this.activeTitle + " " + this.shareUrl;
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeItem = toJS(store.activeItem);
      this.__disposer.push(reaction);
    })
  }
  /**
   * LitElement shadowDom ready
   */
  firstUpdated() {
    if (super.firstUpdated) {
      super.firstUpdated();
    }
    setTimeout(() => {
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js"
      );
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-share-widget.js"
      );
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-git-corner.js"
      );
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js"
      );
      import("@lrnwebcomponents/social-share-link/social-share-link.js");
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js"
      );
    }, 0);
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "manifest") {
        this.color = this._getColor(this[propName]);
      }
      if (propName == "editMode") {
        this.stateClass = this._getStateClass(this[propName]);
      }
    });
  }
  _showImage(image) {
    if (image) {
      return image;
    }
    if (this.image) {
      return this.image;
    }
    return false;
  }
  /**
   * Listen for router location changes and select page to match
   */
  _noticeLocationChange(location) {
    if (!location || typeof location.route === "undefined") return;
    const name = location.route.name;
    if (name === "home" || name === "404") {
      this.selectedPage = 0;
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
      });
      this.selectedPage = 1;
      // @todo hacky timing thing
      setTimeout(() => {
        // try scrolling to the target ID after content gets imported
        window.AnchorBehaviors.getTarget(store.themeElement);
      }, 1000);
    }
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  /**
   * Manage the back button to get to the home page of items
   */
  _goBack(e) {
    window.history.pushState(null, null, store.location.baseUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
    // should help account for starting on a page where popstate isn't set
    // and also generate data model mirroring
    window.scrollTo({
      top: 0,
      left: 0,
    });
    const evt = new CustomEvent("json-outline-schema-active-item-changed", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {},
    });
    this.dispatchEvent(evt);
    this.selectedPage = 0;
  }
}
customElements.define(HaxorSlevin.tag, HaxorSlevin);
export { HaxorSlevin };
