import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@polymer/paper-styles/color.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js";
import "@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "../elmsln-base-deps.js";
/**
 * `lrnapp-book`
 * A LRN element
 *
 * @demo demo/index.html
 * @microcopy
 * - node / circle - A progress circle on the line
 * - nodes / items - the list of items in the progress bar
 * - bubble - reserved for when events fire out of an element or value is tracking events
 * - percentage - amount complete either in the bar or the nodes themselves
 * - bar - the underlayed bar that's tracking overall progression
 * - author mode - authoring mode
 */
class MoocContent extends PolymerElement {
  static get template() {
    return html`
    <style include="materializecss-styles">
      :host {
        display: block;
        font-size: 16px;
        box-sizing: content-box;
      }
      #content[data-loading] {
        opacity: .2 !important;
        pointer-events: none;
      }
      #content {
        opacity: 1;
        visibility: visible;
        transition: all .4s ease;
      }
    </style>
    <div id="hackycontainer"><style id="hackycsspotterhates"></style></div>
    <iron-ajax
      id="fulloutlinepath"
      url="[[fullOutlinePath]]"
      handle-as="json"
      on-response="handleOutlineResponse"
      last-response="{{outlineData}}"></iron-ajax>
    <iron-ajax
      id="pageajax"
      params="[[requestParams]]"
      url="[[sourcePath]]"
      handle-as="json"
      on-response="handleResponse"
      last-response="{{pageData}}"
      loading="{{_loading}}"></iron-ajax>
    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>
    <app-route
      route="{{route}}"
      pattern="[[endPoint]]/:type/:id"
      data="{{data}}"
      tail="{{tail}}"
      query-params="{{queryParams}}">
    </app-route>
    <main id="etb-tool-nav" data-offcanvas="">
      <div id="anchor"></div>
      <div class="inner-wrap">
        <section class="main-section etb-book" style="min-height: 318px;">
          <h2 class="element-invisible">Content navigation</h2>
          <div class="r-header row">
            <div class="r-header__left">
              <div class="book-navigation-header book-sibling-nav-container book-navigation-header-2">
                <div class="book-navigation-header book-sibling-nav-container">
                  <lrnsys-dialog id="outlinepopover" data-voicecommand="open outline" label="Outline" header="Outline">
                    <span slot="button">
                      <simple-icon icon="explore"></simple-icon>
                      Outline
                    </span>
                    <div class="elmsln-modal-content" id="block-mooc-helper-mooc-helper-toc-nav-modal">
                      <div id="outlinemodal" on-click="_modalTap"><slot name="outlinemodal"></slot></div>
                    </div>
                  </lrnsys-dialog>
                  <div id="navigation"><slot name="navigation"></slot></div>
                </div>
              </div>
            </div>
            <div id="options" class="r-header__right">
              <slot name="options"></slot>
            </div>
          </div>
          <div class="elmsln-content-wrap" role="main">
          <responsive-grid-row gutter="4">
            <responsive-grid-col xl="3" lg="3" md="3" sm="4" xs="12">
              <section id="block-mooc-nav-block-mooc-nav-nav" class="mooc-nav-block-left block block-mooc-nav-block contextual-links-region block-mooc-nav-block-mooc-nav column" role="navigation" aria-label$="[[outlineTitle]]">
                <div class="block-mooc-nav-block-mooc-title black white-text">[[outlineTitle]]</div>
                <div id="outline"><slot name="outline"></slot></div>
              </section>
              <div id="blocks"><slot name="blocks"></slot></div>
            </responsive-grid-col>
            <responsive-grid-col xl="8" lg="8" md="9" sm="7" xs="12">
              <a id="main-content" class="scrollspy" data-scrollspy="scrollspy"></a>
              <div class="column">
                <div id="content" data-loading$="[[loading]]"><slot name="content"></slot></div>
              </div>
            </responsive-grid-col>
          </responsive-grid-row>
        </section>
        <a class="exit-off-canvas"></a>
      </div>
    </main>`;
  }
  static get tag() {
    return "mooc-content";
  }
  static get observers() {
    return ["_routeChanged(data, route, endPoint)"];
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String,
      },
      elmslnSection: {
        type: String,
      },
      basePath: {
        type: String,
      },
      csrfToken: {
        type: String,
      },
      endPoint: {
        type: String,
      },
      /**
       * Source of data
       */
      sourcePath: {
        type: String,
      },
      /**
       * Full outline path
       */
      fullOutlinePath: {
        type: String,
      },
      /**
       * App route tracking.
       */
      route: {
        type: Object,
        notify: true,
      },
      /**
       * Title for the content
       */
      currentTitle: {
        type: String,
      },
      /**
       * Params for the request for outline/book to load.
       */
      requestParams: {
        type: Object,
        notify: true,
        value: {
          node: null,
        },
      },
      /**
       * Returned data for processing.
       */
      pageData: {
        type: Object,
        value: {},
      },
      /**
       * Returned data for processing.
       */
      outlineData: {
        type: Object,
        value: {},
      },
      /**
       * Ensure scrolling doesn't influence during a transition.
       */
      resetScroll: {
        type: Boolean,
        value: false,
      },
      /**
       * Store current page data.
       */
      responseData: {
        type: Object,
        value: {},
      },
      /**
       * BasePath from drupal
       */
      basePath: {
        type: String,
      },
      /**
       * elmslnCourse from drupal
       */
      elmslnCourse: {
        type: String,
      },
      /**
       * nav title
       */
      outlineTitle: {
        type: String,
      },
      /**
       * Node ID
       */
      nid: {
        type: Number,
      },
      /**
       * loading pegged to the ajax call running
       */
      _loading: {
        type: Boolean,
        observer: "_contentLoading",
      },
      /**
       * loading pegged to the ajax call running
       */
      loading: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
      },
      /**
       * Aliases
       */
      aliases: {
        type: Array,
      },
      /**
       * active item for tracking reference after clicks.
       */
      activeNodeItem: {
        type: Object,
        value: null,
      },
    };
  }
  /**
   * Ensure modal is closed on tap of an item.
   */
  _modalTap(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // verify that it is a buttonß
    if (local.tagName === "LRNSYS-BUTTON") {
      if (this.activeNodeItem != null) {
        this.activeNodeItem.classList.remove("book-menu-item-active");
      }
      this.activeNodeItem = local;
      this.activeNodeItem.classList.add("book-menu-item-active");
      this.$.outlinepopover.toggleDialog();
    }
  }
  /**
   * Notice loading state has changed.
   */
  _contentLoading(newValue, oldValue) {
    var _this = this;
    if (
      (typeof newValue === "undefined" ? "undefined" : typeof newValue) !==
        (typeof undefined === "undefined" ? "undefined" : typeof undefined) &&
      !newValue
    ) {
      setTimeout(function () {
        _this.loading = false;
        _this._resetScroll("anchor");
        _this.$["main-content"].focus();
      }, 500);
    } else {
      this.loading = true;
    }
  }
  /**
   * Callback to push the data into the page.
   */
  handleResponse(e) {
    // handle the HTML we just got
    if (
      typeof this.pageData.data !==
      (typeof undefined === "undefined" ? "undefined" : typeof undefined)
    ) {
      var data = this.pageData.data;
      // test for advanced ops
      if (
        typeof data.ops.redirect !==
        (typeof undefined === "undefined" ? "undefined" : typeof undefined)
      ) {
        this.set("route.path", data.ops.redirect);
        this._routeChanged(this.data, this.route, this.endPoint);
      } else {
        this.outlineTitle = data.bookOutline.subject;
        this.$.content.innerHTML = data.content;
        this.$.navigation.innerHTML = data.topNavigation;
        this.$.outline.innerHTML = data.bookOutline.content;
        this.$.options.innerHTML = data.options;
        // inject styles, destroying previous ones
        this.__injectStyle(data.styles);
        // fire drupal behaviors.. this is evil. Polymer is invoking Drupal behaviors..
        if (window.Drupal) {
          window.Drupal.attachBehaviors(document, window.Drupal.settings);
        }
        if (window.WCAutoload) {
          window.WCAutoload.process();
        }
        // first time this fires let's get the outline block in the background
        if (
          typeof this.outlineData.data ===
          (typeof undefined === "undefined" ? "undefined" : typeof undefined)
        ) {
          this.$.fulloutlinepath.generateRequest();
        }
        microTask.run(() => {
          window.dispatchEvent(new Event("resize"));
        });
      }
    }
  }
  /**
   * Callback to push the data into the page.
   */
  handleOutlineResponse(e) {
    // handle the HTML we just got
    var data = this.outlineData.data;
    if (
      (typeof data === "undefined" ? "undefined" : typeof data) !==
      (typeof undefined === "undefined" ? "undefined" : typeof undefined)
    ) {
      this.$.outlinemodal.innerHTML = data.outline;
      this.aliases = data.aliases;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (window.Drupal) {
      window.Drupal.attachBehaviors(document, window.Drupal.settings);
    }
  }
  /**
   * If the current route is outside the scope of our app then allow
   * the website to break out of the single page application routing.
   *
   * This is really critical that we get happy paths that don't trigger a redirec
   * loop so some of the logic will seem a bit repetative but we're trying to trap
   * may different potentially valid addresses / use-cases which still must trigger
   * a reload within the app (without looping) and still allow outbound links to go
   * through as they should.
   */
  _routeChanged(data, route, endPoint) {
    if (typeof route.path === "string") {
      // target for url alias that might be delivered into content
      // and menu items throughout the UI
      var urlAlias = route.path.replace("/" + this.elmslnCourse + "/", "");
      if (route.path.startsWith("/" + this.elmslnCourse + "/node/")) {
        var tmp = route.path.split("/");
        // ensure this is a number so we know what we're doing
        if (
          !isNaN(parseFloat(tmp[tmp.length - 1])) &&
          isFinite(tmp[tmp.length - 1])
        ) {
          this.nid = tmp[tmp.length - 1];
          // trigger change if data location changed
          this.requestParams.node = this.nid;
          // send request out the door to the actual end point
          this.$.pageajax.generateRequest();
          // if open, close this
          if (this.__modal && this.__modal.opened) {
            window.dispatchEvent(
              new CustomEvent("simple-modal-hide", {
                bubbles: true,
                cancelable: true,
                detail: {},
              })
            );
          }
          return;
        } else if (tmp[tmp.length - 1] == "edit") {
          window.location.reload();
        }
      }
      // test for an node alias, then send off
      else if (this.aliases && urlAlias && this.aliases[urlAlias]) {
        this.nid = this.aliases[urlAlias].replace("node/", "");
        // trigger change if data location changed
        this.requestParams.node = this.nid;
        this.$.pageajax.generateRequest();
        // if this is open, close it
        if (this.__modal && this.__modal.opened) {
          window.dispatchEvent(
            new CustomEvent("simple-modal-hide", {
              bubbles: true,
              cancelable: true,
              detail: {},
            })
          );
        }
        return;
      }
      // implies front page on first load, so fix that
      else if (urlAlias == "") {
        this.requestParams.node = this.nid;
        // ensure that we don't see this again
        this.set("route.path", "/" + this.elmslnCourse + "/node/" + this.nid);
        this.$.pageajax.generateRequest();
        return;
      }
    }
    // ensure nothing went super wrong which may be leading to a busted site
    // so we can avoid an infinite loop
    if (this.elmslnCourse != "") {
      // reload the page which since route changed will load that page
      window.location.reload();
    }
  }
  ready() {
    super.ready();
    this.__modal = window.SimpleModal.requestAvailability();
  }
  /**
   * Reset scroll position visually and internally data wise.
   */
  _resetScroll() {
    var item =
      arguments.length > 0 && arguments[0] !== undefined
        ? arguments[0]
        : "anchor";
    this.resetScroll = true;
    this.$[item].scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  }
  /**
   * Inject styles dynamically from inline CSS blocks.
   * This is a function and capability that will drive Potter nuts.
   * Because of this we're using the unheard of ___ convention. This
   * means that it's such a private function that we wish we'd never
   * actually have thought of it. Fortunately, it came from a stackoverflow
   * article so we don't have to take credit for our own undoing with
   * what this enables.
   */
  __injectStyle(style) {
    // target and wipe our id area by force
    if (this.$.hackycsspotterhates != null) {
      dom(this.$.hackycontainer).innerHTML = "";
    }
    // construct a new style tag and inject it overtop of what was there previously
    var customStyle = document.createElement("style", "custom-style");
    customStyle.id = "hackycsspotterhates";
    // inject our styles
    customStyle.textContent = style;
    // we have now successfully ruined something encapsulated and once beautiful
    dom(this.$.hackycontainer).appendChild(customStyle);
  }
  /**
   * highjack shadowDom
   */
  _attachDom(dom) {
    this.appendChild(dom);
  }
}
window.customElements.define(MoocContent.tag, MoocContent);
export { MoocContent };
