/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { SimpleColorsSuper } from "@haxtheweb/simple-colors/simple-colors.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { varExists, varGet } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/anchor-behaviors/anchor-behaviors.js";
import "@haxtheweb/disqus-embed/lib/haxcms-site-disqus.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@haxtheweb/full-width-image/full-width-image.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js";
import "@haxtheweb/date-card/lib/date-chip.js";
import "@haxtheweb/accent-card/accent-card.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
/**
 * `haxor-slevin`
 * `Tech blogger theme`
 * @demo demo/index.html
 * @element haxor-slevin
 */
class HaxorSlevin extends HAXCMSThemeParts(
  SimpleColorsSuper(DDDSuper(HAXCMSLitElementTheme)),
) {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          background-color: var(--simple-colors-default-theme-grey-1);
          color: var(--simple-colors-default-theme-grey-12);
          transition:
            0.6s ease-in-out color,
            0.6s ease-in-out background-color;
        }
        site-modal:not(:defined),
        site-rss-button:not(:defined),
        site-share-widget:not(:defined),
        site-active-title:not(:defined),
        site-git-corner:not(:defined),
        social-share-link:not(:defined) {
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
        :host([edit-mode]) accent-card {
          opacity: 0.2;
          pointer-events: none;
        }
        accent-card {
          overflow: hidden;
          font-weight: normal;
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
          padding-top: 64px;
        }
        #home {
          max-width: 1032px;
          padding-left: 20px;
          padding-right: 20px;
          margin: 0 auto;
        }
        :host([selected-page="1"]) #home {
          display: none;
        }
        :host([selected-page="0"]) .contentcontainer-wrapper {
          display: none;
        }
        .contentcontainer-wrapper {
          max-width: 900px;
          margin: 0 auto;
          box-sizing: border-box;
          padding-left: 20px;
          padding-right: 20px;
        }
        full-width-image {
          --full-width-image-font-size: 54px;
        }
        date-chip {
          float: right;
          --date-chip-font-size: 40px;
          --date-chip-month-font-size: 24px;
          margin: -64px 16px 16px;
        }
        .article-link,
        .article-link-bottom {
          text-decoration: none;
          opacity: 0.9;
          -webkit-filter: saturate(30%);
          filter: saturate(30%);
          transition:
            0.3s ease-in-out opacity,
            0.3s ease-in-out filter;
          cursor: pointer;
        }
        .article-link:nth-of-type(1) {
          -webkit-filter: saturate(80%);
          filter: saturate(80%);
        }
        .article-link:nth-of-type(2n) {
          -webkit-filter: saturate(30%);
          filter: saturate(30%);
        }
        .article-link accent-card::part(image) {
          -webkit-filter: saturate(0%);
          filter: saturate(0%);
          transition: 0.3s ease-in-out all;
        }
        .article-link:nth-of-type(1) accent-card::part(image) {
          -webkit-filter: saturate(80%);
          filter: saturate(80%);
        }
        .article-link:nth-of-type(2n) accent-card::part(image) {
          -webkit-filter: saturate(30%);
          filter: saturate(30%);
        }
        .article-link:focus accent-card::part(image),
        .article-link:hover accent-card::part(image) {
          -webkit-filter: saturate(200%);
          filter: saturate(200%);
        }
        .article-link-bottom:focus,
        .article-link-bottom:hover,
        .article-link:focus,
        .article-link:hover {
          opacity: 1;
          -webkit-filter: saturate(100%);
          filter: saturate(100%);
        }
        .article-link:hover span {
          text-decoration: underline;
        }
        .header-wrapper {
          padding: 12px 24px;
          display: flex;
          margin: 0 auto;
          z-index: 100;
          color: var(--simple-colors-default-theme-accent-1);
          justify-content: center;
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
          background-color: var(--simple-colors-default-theme-accent-10);
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
          color: var(--simple-colors-default-theme-accent-1);
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
          --social-share-button-color: var(
            --simple-colors-default-theme-accent-1
          );
          --social-share-button-bg: var(--simple-colors-default-theme-accent-7);
          --social-share-button-padding: 8px;
          --social-share-button-border-radius: 50%;
          --social-share-button-hover-bg: var(
            --simple-colors-default-theme-accent-10
          );
          --social-share-button-hover-color: var(
            --simple-colors-default-theme-accent-2
          );
        }

        .annoy-user {
          color: var(--simple-colors-default-theme-accent-12);
          background-color: var(--simple-colors-default-theme-accent-2);
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
          color: var(--simple-colors-default-theme-accent-12);
          --site-rss-color: var(--simple-colors-default-theme-accent-10);
          --site-rss-bg-color: var(--simple-colors-default-theme-accent-10);
          --site-rss-simple-icon-button-padding: 0 4px;
          --site-rss-simple-icon-button-margin: 0;
        }

        @media screen and (max-width: 800px) {
          #contentcontainer,
          #home {
            padding-left: 8px;
            padding-right: 8px;
            transition: 0.5s opacity ease-in-out;
          }
          .hide-small {
            display: none !important;
          }
          .annoy-user {
            display: none;
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
          >
            <span class="hide-small">Home</span>
          </simple-icon-button-lite>
        </div>
        <site-region name="header"></site-region>
      </header>
      <div class="wrapper">
        <div id="home">
          <site-query
            @result-changed="${this.__mainPostsChanged}"
            limit="10"
            sort='{"created": "ASC"}'
          ></site-query>
          ${this.__mainPosts.map(
            (post) =>
              html` <a class="article-link" href="${post.slug}">
                <accent-card
                  image-align="center"
                  image-valign="top"
                  accent-background
                  accent-color="${this.color}"
                  accent-heading
                  horizontal
                  image-src="${post.metadata && post.metadata.image
                    ? post.metadata.image
                    : this.image}"
                >
                  <div slot="heading"><h3>${post.title}</h3></div>
                  <p slot="content">
                    <date-chip
                      unix
                      timestamp="${post.metadata.created}"
                      accent-color="${this.color}"
                    ></date-chip>
                    ${post.description}
                  </p>
                </accent-card></a
              >`,
          )}
          <site-region name="footerPrimary"></site-region>
        </div>
        <main class="contentcontainer-wrapper">
          <article id="contentcontainer">
            <site-region name="contentTop"></site-region>
            <site-git-corner position="right"></site-git-corner>
            ${this.activeItem &&
            this.activeItem.metadata &&
            this.activeItem.metadata.image
              ? html`<full-width-image
                  source="${this.activeItem.metadata.image}"
                  caption="${this.activeItem.title}"
                ></full-width-image>`
              : html`<site-active-title></site-active-title>`}
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
            limit="6"
            start-index="${this.activeManifestIndexCounter}"
            sort='{"created": "ASC"}'
          ></site-query>
          ${this.__followUpPosts.map(
            (post) => html`
              <a class="article-link-bottom" href="${post.slug}">
                <accent-card
                  image-align="center"
                  image-valign="top"
                  accent-background
                  accent-color="${this.color}"
                  accent-heading
                  horizontal
                  image-src="${post.metadata && post.metadata.image
                    ? post.metadata.image
                    : this.image}"
                >
                  <div slot="heading"><h3>${post.title}</h3></div>
                  <div slot="subheading">
                    <simple-datetime
                      unix
                      timestamp="${post.metadata.created}"
                    ></simple-datetime>
                  </div>
                  <div slot="content">
                    <p>${post.description}</p>
                  </div>
                </accent-card></a
              >
            `,
          )}
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
        </main>
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
    if (
      this.activeItem &&
      this.activeItem.metadata &&
      this.activeItem.metadata.relatedItems
    ) {
      const ids = this.activeItem.metadata.relatedItems.split(",");
      ids.map((id) => {
        if (store.findItem(id)) {
          posts.push(toJS(store.findItem(id)));
        }
      });
    } else {
      posts = e.detail.value;
    }
    this.__followUpPosts = posts;
  }
  static get properties() {
    return {
      ...super.properties,
      color: {
        type: String,
      },
      selectedPage: {
        type: Number,
        reflect: true,
        attribute: "selected-page",
      },
      activeManifestIndexCounter: {
        type: Number,
      },
      activeItem: {
        type: Object,
      },
      stateClass: {
        type: String,
      },
      __mainPosts: {
        type: Array,
      },
      __followUpPosts: {
        type: Array,
      },
    };
  }
  _getStateClass(editMode) {
    if (editMode) {
      return "disable-items";
    }
    return "";
  }
  _getColor(manifest) {
    if (
      manifest &&
      varExists(manifest, "metadata.theme.variables.cssVariable")
    ) {
      return manifest.metadata.theme.variables.cssVariable
        .replace("--simple-colors-default-theme-", "")
        .replace("-7", "");
    }
  }
  /**
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
    );
  }
  constructor() {
    super();
    // to avoid error
    this.icon = "icons:search";
    this.__disposer = [];
    this.__mainPosts = [];
    this.__followUpPosts = [];
    this.activeItem = {};
    this.selectedPage = 0;
    this.activeManifestIndexCounter = 0;
    autorun((reaction) => {
      let location = toJS(store.location);
      this._noticeLocationChange(location);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      let manifest = toJS(store.manifest);
      this.color = this._getColor(manifest);
      this.title = varGet(manifest, "title", "");
      this.image = varGet(
        manifest,
        "metadata.theme.variables.image",
        "assets/banner.jpg",
      );
      this.icon = varGet(
        manifest,
        "metadata.theme.variables.icon",
        "icons:record-voice-over",
      );
      this.author = varGet(manifest, "metadata.author", {});
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeManifestIndexCounter = toJS(store.activeManifestIndexCounter);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeTitle = toJS(store.activeTitle);
      this.shareUrl = globalThis.document.location.href;
      this.shareMsg = this.activeTitle + " " + this.shareUrl;
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeItem = toJS(store.activeItem);
      this.__disposer.push(reaction);
    });
  }
  /**
   * LitElement shadowDom ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-share-widget.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-git-corner.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-rss-button.js"
    );
    import("@haxtheweb/social-share-link/social-share-link.js");
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js"
    );
    // haxor is a bit odd bc it has this anti-pattern currently
    setTimeout(() => {
      let location = toJS(store.location);
      this._noticeLocationChange(location);
    }, 1000);
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode") {
        this.stateClass = this._getStateClass(this[propName]);
      }
    });
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
      globalThis.scrollTo({
        top: 0,
        left: 0,
      });
      this.selectedPage = 1;
      // @todo hacky timing thing
      setTimeout(() => {
        // try scrolling to the target ID after content gets imported
        globalThis.AnchorBehaviors.getTarget(store.themeElement);
      }, 1000);
    }
    setTimeout(() => {
      globalThis.dispatchEvent(new Event("resize"));
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
    globalThis.history.pushState(null, null, store.location.baseUrl);
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
    // should help account for starting on a page where popstate isn't set
    // and also generate data model mirroring
    globalThis.scrollTo({
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
