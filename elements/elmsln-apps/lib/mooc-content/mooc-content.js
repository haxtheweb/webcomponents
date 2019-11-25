import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-styles/color.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js";
import "@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
const makeSlot = name => {
  const slot = document.createElement("slot");
  if (name) {
    slot.name = name;
  }
  return slot;
};
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
class MoocContent extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: 16px;
          box-sizing: content-box;
        }
        #content[data-loading] {
          opacity: 0.2 !important;
          pointer-events: none;
        }
        #content {
          opacity: 1;
          visibility: visible;
          transition: all 0.4s ease;
        }
      `
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__modal = window.SimpleModal.requestAvailability();
    this.requestParams = {
      node: null
    };
    this.pageData = {};
    this.outlineData = {};
    this.resetScroll = false;
    this.responseData = {};
    this.loading = false;
    this.activeNodeItem = null;
    this.shadowRoot.appendChild(makeSlot("outlinemodal"));
    this.shadowRoot.appendChild(makeSlot("navigation"));
    this.shadowRoot.appendChild(makeSlot("options"));
    this.shadowRoot.appendChild(makeSlot("outline"));
    this.shadowRoot.appendChild(makeSlot("content"));
    this.shadowRoot.appendChild(makeSlot("blocks"));
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.removedNodes.forEach(node => {
          if (node.nodeType !== Node.COMMENT_NODE) {
            this.appendChild(node);
          }
        });
      });
    });
    this.observer.observe(this, {
      childList: true
    });
  }
  /**
   * LitElement shadow root thing
   */
  createRenderRoot() {
    this.attachShadow({ mode: "open" });
    return this;
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <custom-style>
        <style include="materializecss-styles"></style>
      </custom-style>
      <div id="hackycontainer"><style id="hackycsspotterhates"></style></div>
      <iron-ajax
        id="fulloutlinepath"
        url="${this.fullOutlinePath}"
        handle-as="json"
        @response="${this.handleOutlineResponse}"
        @last-response-changed="${this.outlineDataChanged}"
      ></iron-ajax>
      <iron-ajax
        id="pageajax"
        .params="${this.requestParams}"
        url="${this.sourcePath}"
        handle-as="json"
        @response="${this.handleResponse}"
        @last-response-changed="${this.pageDataChanged}"
        loading="${this._loading}"
        @loading-changed="${this._loadingChanged}"
      ></iron-ajax>
      <app-location
        route="${this.route}"
        @route-changed="${this.routeChangedEvent}"
        .query-params="${this.queryParams}"
        @query-params-changed="${this.queryParamsChanged}"
      ></app-location>
      <app-route
        route="${this.route}"
        @route-changed="${this.routeChangedEvent}"
        pattern="${this.endPoint}/:type/:id"
        data="${this.data}"
        @data-changed="${this.dataChanged}"
        tail="${this.tail}"
        @tail-changed="${this.tailChanged}"
        .query-params="${this.queryParams}"
        @query-params-changed="${this.queryParamsChanged}"
      >
      </app-route>
      <main id="etb-tool-nav" data-offcanvas="">
        <div id="anchor"></div>
        <div class="inner-wrap">
          <section class="main-section etb-book" style="min-height: 318px;">
            <h2 class="element-invisible">Content navigation</h2>
            <div class="r-header row">
              <div class="r-header__left">
                <div
                  class="book-navigation-header book-sibling-nav-container book-navigation-header-2"
                >
                  <div
                    class="book-navigation-header book-sibling-nav-container"
                  >
                    <lrnsys-dialog
                      id="outlinepopover"
                      data-voicecommand="open outline"
                      label="Outline"
                      header="Outline"
                    >
                      <span slot="button">
                        <iron-icon icon="explore"></iron-icon>
                        Outline
                      </span>
                      <div
                        class="elmsln-modal-content"
                        id="block-mooc-helper-mooc-helper-toc-nav-modal"
                      >
                        <div id="outlinemodal" on-click="_modalTap">
                          <slot name="outlinemodal"></slot>
                        </div>
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
                  <section
                    id="block-mooc-nav-block-mooc-nav-nav"
                    class="mooc-nav-block-left block block-mooc-nav-block contextual-links-region block-mooc-nav-block-mooc-nav column"
                    role="navigation"
                    aria-label="${this.outlineTitle}"
                  >
                    <div
                      class="block-mooc-nav-block-mooc-title black white-text"
                    >
                      ${this.outlineTitle}
                    </div>
                    <div id="outline"><slot name="outline"></slot></div>
                  </section>
                  <div id="blocks"><slot name="blocks"></slot></div>
                </responsive-grid-col>
                <responsive-grid-col xl="8" lg="8" md="9" sm="7" xs="12">
                  <a
                    id="main-content"
                    class="scrollspy"
                    data-scrollspy="scrollspy"
                  ></a>
                  <div class="column">
                    <div id="content" ?data-loading="${this.loading}">
                      <slot name="content"></slot>
                    </div>
                  </div>
                </responsive-grid-col>
              </responsive-grid-row>
            </div>
          </section>
          <a class="exit-off-canvas"></a>
        </div>
      </main>
    `;
  }
  tailChanged(e) {
    this.tail = e.detail.value;
  }
  dataChanged(e) {
    this.data = e.detail.value;
  }
  queryParamsChanged(e) {
    this.queryParams = e.detail.value;
  }
  routeChangedEvent(e) {
    this.route = e.detail.value;
  }
  outlineDataChanged(e) {
    this.outlineData = e.detail.value;
  }
  _loadingChanged(e) {
    this._loading = e.detail.value;
  }
  pageDataChanged(e) {
    this.pageData = e.detail.value;
  }
  static get tag() {
    return "mooc-content";
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String,
        attribute: "elmsln-course"
      },
      elmslnSection: {
        type: String,
        attribute: "elmsln-section"
      },
      basePath: {
        type: String,
        attribute: "base-path"
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token"
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      /**
       * Source of data
       */
      sourcePath: {
        type: String,
        attribute: "source-path"
      },
      /**
       * Full outline path
       */
      fullOutlinePath: {
        type: String,
        attribute: "full-outline-path"
      },
      /**
       * App route tracking.
       */
      route: {
        type: Object
      },
      /**
       * Title for the content
       */
      currentTitle: {
        type: String,
        attribute: "current-title"
      },
      /**
       * Params for the request for outline/book to load.
       */
      requestParams: {
        type: Object
      },
      /**
       * Returned data for processing.
       */
      pageData: {
        type: Object
      },
      /**
       * Returned data for processing.
       */
      outlineData: {
        type: Object
      },
      /**
       * Ensure scrolling doesn't influence during a transition.
       */
      resetScroll: {
        type: Boolean,
        attribute: "reset-scroll"
      },
      /**
       * Store current page data.
       */
      responseData: {
        type: Object
      },
      /**
       * nav title
       */
      outlineTitle: {
        type: String,
        attribute: "outline-title"
      },
      /**
       * Node ID
       */
      nid: {
        type: Number
      },
      /**
       * loading pegged to the ajax call running
       */
      _loading: {
        type: Boolean
      },
      /**
       * loading pegged to the ajax call running
       */
      loading: {
        type: Boolean,
        reflect: true
      },
      /**
       * Aliases
       */
      aliases: {
        type: Array
      },
      /**
       * active item for tracking reference after clicks.
       */
      activeNodeItem: {
        type: Object
      }
    };
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["data", "route", "endPoint"].includes(propName)) {
        this._routeChanged(this.data, this.route, this.endPoint);
      }
      if (propName === "route") {
        // notify
        this.dispatchEvent(
          new CustomEvent("route-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName === "requestParams") {
        // notify
        this.dispatchEvent(
          new CustomEvent("request-params-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName === "_loading") {
        this._contentLoading(this[propName], oldValue);
      }
    });
  }
  /**
   * Ensure modal is closed on tap of an item.
   */
  _modalTap(e) {
    var local = e.target;
    // verify that it is a buttonß
    if (local.tagName === "LRNSYS-BUTTON") {
      if (this.activeNodeItem != null) {
        this.activeNodeItem.classList.remove("book-menu-item-active");
      }
      this.activeNodeItem = local;
      this.activeNodeItem.classList.add("book-menu-item-active");
      this.shadowRoot.querySelector("#outlinepopover").toggleDialog();
    }
  }
  /**
   * Notice loading state has changed.
   */
  _contentLoading(newValue, oldValue) {
    if (
      (typeof newValue === "undefined" ? "undefined" : typeof newValue) !==
        (typeof undefined === "undefined" ? "undefined" : typeof undefined) &&
      !newValue
    ) {
      setTimeout(() => {
        this.loading = false;
        this._resetScroll("anchor");
        this.shadowRoot.querySelector("#main-content").focus();
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
        this.route.path = data.ops.redirect;
        this._routeChanged(this.data, this.route, this.endPoint);
      } else {
        this.outlineTitle = data.bookOutline.subject;
        this.shadowRoot.querySelector("#content").innerHTML = data.content;
        this.shadowRoot.querySelector("#navigation").innerHTML =
          data.topNavigation;
        this.shadowRoot.querySelector("#outline").innerHTML =
          data.bookOutline.content;
        this.shadowRoot.querySelector("#options").innerHTML = data.options;
        // inject styles, destroying previous ones
        this.__injectStyle(data.styles);
        // fire drupal behaviors.. this is evil. Polymer is invoking Drupal behaviors..
        if (window.Drupal) {
          window.Drupal.attachBehaviors(document, window.Drupal.settings);
        }
        // first time this fires let's get the outline block in the background
        if (
          typeof this.outlineData.data ===
          (typeof undefined === "undefined" ? "undefined" : typeof undefined)
        ) {
          this.shadowRoot.querySelector("#fulloutlinepath").generateRequest();
        }
        window.dispatchEvent(new Event("resize"));
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
      this.shadowRoot.querySelector("#outlinemodal").innerHTML = data.outline;
      this.aliases = data.aliases;
    }
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (window.Drupal) {
      window.Drupal.attachBehaviors(document, window.Drupal.settings);
    }
    this.observer.disconnect();
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
          this.shadowRoot.querySelector("#pageajax").generateRequest();
          // if open, close this
          if (this.__modal && this.__modal.opened) {
            window.dispatchEvent(
              new CustomEvent("simple-modal-hide", {
                bubbles: true,
                cancelable: true,
                detail: {}
              })
            );
          }
          return;
        } else if (tmp[tmp.length - 1] == "edit") {
          window.location.reload();
        }
      }
      // test for an node alias, then send off
      else if (
        typeof this.aliases[urlAlias] !==
        (typeof undefined === "undefined" ? "undefined" : typeof undefined)
      ) {
        this.nid = this.aliases[urlAlias].replace("node/", "");
        // trigger change if data location changed
        this.requestParams.node = this.nid;
        this.shadowRoot.querySelector("#pageajax").generateRequest();
        // if this is open, close it
        if (this.__modal && this.__modal.opened) {
          window.dispatchEvent(
            new CustomEvent("simple-modal-hide", {
              bubbles: true,
              cancelable: true,
              detail: {}
            })
          );
        }
        return;
      }
      // implies front page on first load, so fix that
      else if (urlAlias == "") {
        this.requestParams.node = this.nid;
        // ensure that we don't see this again
        this.route.path = "/" + this.elmslnCourse + "/node/" + this.nid;
        this.shadowRoot.querySelector("#pageajax").generateRequest();
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
  /**
   * Reset scroll position visually and internally data wise.
   */
  _resetScroll() {
    var item =
      arguments.length > 0 && arguments[0] !== undefined
        ? arguments[0]
        : "anchor";
    this.resetScroll = true;
    this.shadowRoot
      .querySelector("#" + item)
      .scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
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
    if (this.shadowRoot.querySelector("#hackycsspotterhates") != null) {
      this.shadowRoot.querySelector("#hackycontainer").innerHTML = "";
    }
    // construct a new style tag and inject it overtop of what was there previously
    var customStyle = document.createElement("style", "custom-style");
    customStyle.id = "hackycsspotterhates";
    // inject our styles
    customStyle.textContent = style;
    // we have now successfully ruined something encapsulated and once beautiful
    this.shadowRoot.querySelector("#hackycontainer").appendChild(customStyle);
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
