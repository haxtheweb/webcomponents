/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSThemeWiring.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";

/**
 * `haxor-slevin`
 * `Tech blogger theme`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HaxorSlevin extends HAXCMSTheme(PolymerElement) {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          background-color: #ffffff;
          color: rgba(0, 0, 0, 0.84);
        }

        :host([hidden]) {
          display: none;
        }

        :host([edit-mode]) #slot {
          display: none;
        }
        #slot {
          min-height: 50vh;
        }
        #slot ::slotted(p) {
          margin-top: 29px;
          font-family: Georgia, Cambria, "Times New Roman", Times, serif;
          letter-spacing: 0.01rem;
          font-weight: 400;
          font-style: normal;
          font-size: 21px;
          line-height: 1.58;
          letter-spacing: -0.003em;
          margin-bottom: 0;
        }
        #slot ::slotted(h1, h2, h3, h4, h5, h6) {
          font-family: "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans",
            Geneva, Arial, sans-serif;
          letter-spacing: -0.02em;
          font-style: normal;
          letter-spacing: 0;
          font-size: 34px;
          line-height: 1.15;
          letter-spacing: -0.015em;
          font-weight: 600;
          margin-top: 53px;
        }
        #slot ::slotted(h2, h3) {
          font-size: 34px;
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
          background-color: var(--haxcms-color);
          --app-header-background-rear-layer: {
            background-color: var(--haxcms-color);
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
        }
        .social-float ul {
          padding: 0;
          margin: 0;
          list-style: none;
        }

        social-share-link {
          --social-share-button-bg: var(--haxcms-color);
          --social-share-button: {
            padding: 8px;
            border-radius: 50%;
          }
        }

        .annoy-user {
          background-color: rgba(255, 255, 255, 0.9);
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          box-shadow: 0 -3px 10px 0 rgba(0, 0, 0, 0.0785);
          right: 0;
          padding: 10px 0;
          height: 50px;
          z-index: 100;
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
          --site-rss-bg-color: var(--haxcms-color);
          --site-rss-paper-button: {
            padding: 0 4px;
            margin: 0;
          }
        }

        @media screen and (max-width: 800px) {
          #contentcontainer,
          #home {
            padding-left: 8px;
            padding-right: 8px;
          }
          simple-blog-card {
            padding: 0;
          }
          .hide-small {
            display: none;
          }
        }
      </style>
      <custom-style>
        <style>
          html,
          body {
            background-color: #ffffff;
          }
          :root,
          html,
          body,
          a {
            color: rgba(0, 0, 0, 0.84);
          }
        </style>
      </custom-style>
      <app-header reveals>
        <app-toolbar>
          <div>
            <paper-button class="backbutton" on-click="_goBack">
              <iron-icon icon="[[icon]]"></iron-icon>
              <span class="hide-small">[[title]] - [[activeTitle]]</span>
            </paper-button>
          </div>
          <div main-title>
            <iron-image
              src="[[image]]"
              preload
              sizing="cover"
              style="height:46px;width:100%;margin: 4px 0 2px 0;"
            ></iron-image>
          </div>
        </app-toolbar>
      </app-header>
      <div class="wrapper">
        <iron-pages selected="[[selectedPage]]">
          <div id="home">
            <site-query
              result="{{__mainPosts}}"
              limit="2"
              sort='{"created": "ASC"}'
            ></site-query>
            <div class="simple-blog-card-wrapper evenly">
              <dom-repeat items="[[__mainPosts]]" as="post" mutable-data>
                <template>
                  <simple-blog-card
                    alt="[[post.metadata.fields.images.0.alt]]"
                    color="[[color]]"
                    title="[[post.title]]"
                    size="large"
                    link="[[post.location]]"
                    image="[[_showImage(post.metadata.fields.images.0.src)]]"
                    author="[[author.name]]"
                    timestamp="[[post.created]]"
                    readtime="[[post.metadata.readtime]]"
                    authorimage="[[author.image]]"
                    placeholder="[[image]]"
                    authorlink="[[author.socialLink]]"
                  >
                    [[post.description]]
                  </simple-blog-card>
                </template>
              </dom-repeat>
            </div>
            <site-query
              result="{{__posts}}"
              start-index="2"
              limit="6"
              sort='{"created": "ASC"}'
            ></site-query>
            <div class="simple-blog-card-wrapper">
              <dom-repeat items="[[__posts]]" as="post" mutable-data>
                <template>
                  <simple-blog-card
                    placeholder="[[image]]"
                    alt="[[post.metadata.fields.images.0.alt]]"
                    color="[[color]]"
                    title="[[post.title]]"
                    size="medium"
                    link="[[post.location]]"
                    image="[[_showImage(post.metadata.fields.images.0.src)]]"
                    author="[[author.name]]"
                    timestamp="[[post.created]]"
                    readtime="[[post.metadata.readtime]]"
                    authorimage="[[author.image]]"
                    authorlink="[[author.socialLink]]"
                  >
                    [[post.description]]
                  </simple-blog-card>
                </template>
              </dom-repeat>
            </div>
          </div>
          <div class="contentcontainer-wrapper">
            <div id="contentcontainer">
              <site-active-title></site-active-title>
              <h3 class="subtitle" hidden$="[[!subtitle]]">[[subtitle]]</h3>
              <div id="slot">
                <slot></slot>
              </div>
            </div>
            <site-query
              result="{{__followUpPosts}}"
              limit="3"
              start-index="[[activeManifestIndexCounter]]"
              sort='{"created": "ASC"}'
            ></site-query>
            <div class="simple-blog-card-wrapper">
              <dom-repeat items="[[__followUpPosts]]" as="post" mutable-data>
                <template>
                  <simple-blog-card
                    alt="[[post.metadata.fields.images.0.alt]]"
                    color="[[color]]"
                    title="[[post.title]]"
                    size="small"
                    link="[[post.location]]"
                    image="[[_showImage(post.metadata.fields.images.0.src)]]"
                    author="[[author.name]]"
                    placeholder="[[image]]"
                    timestamp="[[post.created]]"
                    readtime="[[post.metadata.readtime]]"
                    authorimage="[[author.image]]"
                    authorlink="[[author.socialLink]]"
                  >
                    [[post.description]]
                  </simple-blog-card>
                </template>
              </dom-repeat>
            </div>
            <div class="social-float hide-small">
              <ul>
                <li>
                  <social-share-link
                    button-style
                    mode="icon-only"
                    message="[[shareMsg]]"
                    type="Twitter"
                  >
                  </social-share-link>
                </li>
                <li>
                  <social-share-link
                    button-style
                    mode="icon-only"
                    message="[[shareMsg]]"
                    url="[[shareUrl]]"
                    type="LinkedIn"
                  >
                  </social-share-link>
                </li>
                <li>
                  <social-share-link
                    button-style
                    mode="icon-only"
                    url="[[shareUrl]]"
                    message="[[shareMsg]]"
                    type="Facebook"
                  >
                  </social-share-link>
                </li>
                <li>
                  <social-share-link
                    button-style
                    mode="icon-only"
                    message="[[shareMsg]]"
                    image="[[activeImage]]"
                    url="[[shareUrl]]"
                    type="Pinterest"
                  >
                  </social-share-link>
                </li>
              </ul>
            </div>
            <div class="annoy-user hide-small">
              <div class="annoy-inner">
                <iron-icon icon="[[icon]]"></iron-icon>
                <span>
                  Never miss a story from <strong>[[title]]</strong> use RSS
                  today!
                </span>
                <span class="rss">
                  <site-rss-button type="atom"></site-rss-button>
                  <site-rss-button type="rss"></site-rss-button>
                </span>
              </div>
            </div>
          </div>
        </iron-pages>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxor-slevin";
  }
  static get properties() {
    return Object.assign(super.properties, {
      manifest: {
        type: Object
      },
      color: {
        type: String,
        computed: "_getColor(manifest)"
      },
      selectedPage: {
        type: Number,
        reflectToAttribute: true,
        value: 0
      }
    });
  }
  _getColor(manifest) {
    if (manifest && manifest.metadata && manifest.metadata.hexCode) {
      return manifest.metadata.hexCode;
    }
  }
  constructor() {
    super();
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-image/iron-image.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js");
    import("@lrnwebcomponents/simple-blog-card/simple-blog-card.js");
    import("@polymer/app-layout/app-header/app-header.js");
    import("@polymer/app-layout/app-toolbar/app-toolbar.js");
    import("@lrnwebcomponents/social-share-link/social-share-link.js");
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
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = [];
    autorun(reaction => {
      let manifest = toJS(store.manifest);
      this.title = manifest.title;
      this.image = manifest.metadata.image;
      this.icon = manifest.metadata.icon;
      this.author = manifest.metadata.author;
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this._noticeLocationChange(store.location);
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
      if (
        store.activeItem &&
        store.activeItem.metadata &&
        store.activeItem.metadata.fields &&
        store.activeItem.metadata.fields.subtitle
      ) {
        this.subtitle = store.activeItem.metadata.fields.subtitle;
      } else {
        this.subtitle = false;
      }
      // look for image on the post and make it the pin share
      if (
        store.activeItem &&
        store.activeItem.metadata &&
        store.activeItem.metadata.fields &&
        store.activeItem.metadata.fields.images &&
        store.activeItem.metadata.fields.images[0] &&
        store.activeItem.metadata.fields.images[0].src
      ) {
        this.activeImage = store.activeItem.metadata.fields.images[0].src;
      }
      this.__disposer.push(reaction);
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
      detail: {}
    });
    this.dispatchEvent(evt);
    this.selectedPage = 0;
  }
}
window.customElements.define(HaxorSlevin.tag, HaxorSlevin);
export { HaxorSlevin };
