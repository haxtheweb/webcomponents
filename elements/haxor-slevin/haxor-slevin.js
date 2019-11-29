/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { varExists, varGet } from "@lrnwebcomponents/hax-body/lib/haxutils.js";
/**
 * `haxor-slevin`
 * @customElement haxor-slevin
 * `Tech blogger theme`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
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

        :host([hidden]) {
          display: none;
        }
        :host([is-logged-in]) {
          margin-left: 48px;
        }
        :host([is-logged-in][edit-mode]) {
          padding-left: 12px;
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
          max-width: 740px;
          margin: 0 auto;
          box-sizing: border-box;
          padding-left: 20px;
          padding-right: 20px;
        }
        simple-blog-card {
          padding: 8px;
          min-height: 100px;
          min-width: 100px;
        }
        .simple-blog-card-wrapper {
          margin: 0 auto;
          width: 100%;
        }
        .evenly {
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
        app-toolbar {
          padding: 0 20px;
          height: 54px;
          max-width: 1032px;
          margin: 0 auto;
        }
        .backbutton {
          height: 54px;
          border-radius: 0;
          min-width: unset;
          text-transform: unset;
        }
        app-header {
          z-index: 100;
          @apply --layout-fixed-top;
          color: #ffffff;
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
          background-color: var(--haxcms-color, rgba(255, 0, 116, 1));
          --app-header-background-rear-layer: {
            background-color: var(--haxcms-color, rgba(255, 0, 116, 1));
          }
        }
        paper-icon-button {
          --paper-icon-button-ink-color: white;
        }
        site-active-title {
          --site-active-title-heading: {
            font-size: 42px;
            font-family: Georgia, Cambria, "Times New Roman", Times, serif;
            font-weight: 400;
            font-style: normal;
            font-weight: 400;
            line-height: 1.25;
            letter-spacing: 0;
          }
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
          right: 0;
          box-shadow: 0 -3px 10px 0 rgba(0, 0, 0, 0.0785);
          padding: 10px 0;
          height: 50px;
          z-index: 100;
          opacity: 1;
          transition: 0.2s opacity linear;
        }
        .annoy-user.disable-items {
          pointer-events: none;
          opacity: 0 !important;
        }
        iron-icon {
          height: 40px;
          width: 40px;
          display: flex;
          padding-right: 20px;
        }
        .annoy-user iron-icon {
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
          max-width: 700px;
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
          --site-rss-color: #000000;
          --site-rss-bg-color: var(--haxcms-color, rgba(255, 0, 116, 1));
          --site-rss-paper-button-padding: 0 4px;
          --site-rss-paper-button-margin: 0;
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
          }
          .evenly {
            display: unset;
            justify-content: unset;
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
      `
    ];
  }
  render() {
    return html`
      <app-header reveals>
        <app-toolbar>
          <div>
            <paper-button
              class="backbutton"
              @click="${this._goBack}"
              title="Back to listing"
            >
              <iron-icon icon="${this.icon}"></iron-icon>
              <span class="hide-small"
                >${this.title} - ${this.activeTitle}</span
              >
            </paper-button>
          </div>
          <div main-title>
            <iron-image
              src="${this.image}"
              preload
              sizing="cover"
              style="height:46px;width:100%;margin: 4px 0 2px 0;"
            ></iron-image>
          </div>
          <div>
            <site-modal
              icon="icons:search"
              title="Search site"
              button-label="Search"
            >
              <site-search></site-search>
            </site-modal>
          </div>
        </app-toolbar>
      </app-header>
      <div class="wrapper">
        <iron-pages selected="${this.selectedPage}">
          <div id="home">
            <site-query
              @result-changed="${this.__mainPostsChanged}"
              limit="2"
              sort='{"created": "ASC"}'
            ></site-query>
            <div class="simple-blog-card-wrapper evenly">
              ${this.__mainPosts.map(
                post => html`
                  <simple-blog-card
                    alt="${post.metadata.fields &&
                    post.metadata.fields.images &&
                    post.metadata.fields.images[0] &&
                    post.metadata.fields.images[0].alt
                      ? post.metadata.fields.images[0].alt
                      : ""}"
                    color="${this.color}"
                    .title="${post.title}"
                    size="large"
                    .link="${post.location}"
                    .image="${this._showImage(
                      post.metadata.fields &&
                        post.metadata.fields.images &&
                        post.metadata.fields.images[0] &&
                        post.metadata.fields.images[0].alt
                        ? post.metadata.fields.images[0].alt
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
              limit="6"
              sort='{"created": "ASC"}'
            ></site-query>
            <div class="simple-blog-card-wrapper">
              ${this.__extraPosts.map(
                post => html`
                  <simple-blog-card
                    alt="${post.metadata.fields &&
                    post.metadata.fields.images &&
                    post.metadata.fields.images[0] &&
                    post.metadata.fields.images[0].alt
                      ? post.metadata.fields.images[0].alt
                      : ""}"
                    color="${this.color}"
                    .title="${post.title}"
                    size="medium"
                    .link="${post.location}"
                    .image="${this._showImage(
                      post.metadata.fields &&
                        post.metadata.fields.images &&
                        post.metadata.fields.images[0] &&
                        post.metadata.fields.images[0].alt
                        ? post.metadata.fields.images[0].alt
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
          <div class="contentcontainer-wrapper">
            <div id="contentcontainer">
              <site-git-corner position="right"></site-git-corner>
              <site-active-title></site-active-title>
              <h3 class="subtitle" .hidden="${!this.subtitle}">
                ${this.subtitle}
              </h3>
              <div id="slot">
                <slot></slot>
              </div>
            </div>
            <site-query
              @result-changed="${this.__followUpPostsChanged}"
              limit="3"
              start-index="${this.activeManifestIndexCounter}"
              sort='{"created": "ASC"}'
            ></site-query>
            <div class="simple-blog-card-wrapper">
              ${this.__followUpPosts.map(
                post => html`
                  <simple-blog-card
                    alt="${post.metadata.fields &&
                    post.metadata.fields.images &&
                    post.metadata.fields.images[0] &&
                    post.metadata.fields.images[0].alt
                      ? post.metadata.fields.images[0].alt
                      : ""}"
                    color="${this.color}"
                    .title="${post.title}"
                    size="small"
                    .link="${post.location}"
                    .image="${this._showImage(
                      post.metadata.fields &&
                        post.metadata.fields.images &&
                        post.metadata.fields.images[0] &&
                        post.metadata.fields.images[0].alt
                        ? post.metadata.fields.images[0].alt
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
            <div class="social-float hide-small ${this.stateClass}">
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
            </div>
            <div class="annoy-user ${this.stateClass}">
              <div class="annoy-inner">
                <iron-icon icon="${this.icon}" class="hide-small"></iron-icon>
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
            </div>
          </div>
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
    this.__followUpPosts = e.detail.value;
  }
  static get properties() {
    return {
      ...super.properties,

      manifest: {
        type: Object
      },
      color: {
        type: String
      },
      selectedPage: {
        type: Number,
        reflect: true,
        attribute: "selected-page"
      },
      stateClass: {
        type: String
      },
      __mainPosts: {
        type: Array
      },
      __extraPosts: {
        type: Array
      },
      __followUpPosts: {
        type: Array
      }
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
  constructor() {
    super();
    this.__mainPosts = [];
    this.__extraPosts = [];
    this.__followUpPosts = [];
    this.selectedPage = 0;
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js");
    import("@polymer/iron-pages/iron-pages.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-share-widget.js");
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-image/iron-image.js");
    import("@lrnwebcomponents/simple-blog-card/simple-blog-card.js");
    import("@polymer/app-layout/app-header/app-header.js");
    import("@polymer/app-layout/app-toolbar/app-toolbar.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-git-corner.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js");
    import("@lrnwebcomponents/social-share-link/social-share-link.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@polymer/iron-icons/device-icons.js");
    import("@polymer/iron-icons/hardware-icons.js");
    import("@polymer/iron-icons/communication-icons.js");
    import("@polymer/iron-icons/social-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@polymer/iron-icons/maps-icons.js");
    import("@polymer/iron-icons/places-icons.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js");
    autorun(reaction => {
      let location = toJS(store.location);
      this._noticeLocationChange(location);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
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
    autorun(reaction => {
      this.activeManifestIndexCounter = toJS(store.activeManifestIndexCounter);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.activeTitle = toJS(store.activeTitle);
      this.shareUrl = document.location.href;
      this.shareMsg = this.activeTitle + " " + this.shareUrl;
      if (varGet(store.activeItem, "metadata.fields.subtitle", false)) {
        this.subtitle = store.activeItem.metadata.fields.subtitle;
      } else {
        this.subtitle = false;
      }
      // look for image on the post and make it the pin share
      if (varGet(store.activeItem, "metadata.fields.images.0.src", false)) {
        this.activeImage = store.activeItem.metadata.fields.images[0].src;
      }
      this.__disposer.push(reaction);
    });
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
        left: 0
      });
      this.selectedPage = 1;
    }
    setTimeout(() => {
      var evt = document.createEvent("UIEvents");
      evt.initUIEvent("resize", true, false, window, 0);
      window.dispatchEvent(evt);
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
      left: 0
    });
    const evt = new CustomEvent("json-outline-schema-active-item-changed", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {}
    });
    this.dispatchEvent(evt);
    this.selectedPage = 0;
  }
}
window.customElements.define(HaxorSlevin.tag, HaxorSlevin);
export { HaxorSlevin };
