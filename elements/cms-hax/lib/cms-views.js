import { LitElement, html, css } from "lit-element/lit-element.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `cms-views`
 * @customElement cms-views
 * `Render and process a  / views from a content management system.`
 */
class CMSViews extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          min-width: 112px;
          min-height: 112px;
          transition: 0.6s all ease;
          background-color: transparent;
        }
        #replacementcontent {
          visibility: visible;
          opacity: 1;
        }
        :host([loading]) {
          text-align: center;
        }
        :host([loading]) #replacementcontent {
          opacity: 0;
          visibility: hidden;
        }
      `
    ];
  }
  render() {
    return html`
      <iron-ajax
        id="viewsrequest"
        method="GET"
        url="${this.viewsEndPoint}"
        handle-as="json"
        @last-response-changed="${this.viewsDataChanged}"
      ></iron-ajax>
      ${this.loading
        ? html`
            <hexagon-loader
              item-count="4"
              loading
              size="small"
            ></hexagon-loader>
          `
        : html``}
      <span id="replacementcontent"><slot></slot></span>
    `;
  }
  viewsDataChanged(e) {
    this.viewsData = e.detail.value;
  }
  static get tag() {
    return "cms-views";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.loading = false;
    this.viewsPrefix = "[";
    this.viewsSuffix = "]";
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["viewsName", "viewsDisplay"].includes(propName)) {
        this.bodyData = this._generateBodyData(
          this.viewsName,
          this.viewsDisplay
        );
      }
      if (propName == "bodyData") {
        this._viewsChanged(this[propName]);
      }
      if (propName == "viewsData") {
        this._handleviewsResponse(this[propName]);
      }
    });
  }
  static get properties() {
    return {
      /**
       * Loading state
       */
      loading: {
        type: Boolean,
        reflect: true
      },
      /**
       * Name of the views to render
       */
      viewsName: {
        type: String,
        reflect: true,
        attribute: "views-name"
      },
      /**
       * Display from the views
       */
      viewsDisplay: {
        type: String,
        reflect: true,
        attribute: "views-display"
      },
      /**
       * views end point updated, change the way we do processing.
       */
      viewsEndPoint: {
        type: String,
        attribute: "views-end-point"
      },
      /**
       * Prefix for the views to be processed
       */
      viewsPrefix: {
        type: String,
        attribute: "views-prefix"
      },
      /**
       * Suffix for the views to be processed
       */
      viewsSuffix: {
        type: String,
        attribute: "views-suffix"
      },
      /**
       * Body data which is just views with some encapsulation.
       */
      bodyData: {
        type: Object
      },
      /**
       * views data from the end point.
       */
      viewsData: {
        type: String,
        attribute: "views-data"
      }
    };
  }
  /**
   * Generate body data.
   */
  _generateBodyData(name, display) {
    if (name !== null && name !== "") {
      return {
        name: `${name}`,
        display: `${display}`
      };
    }
  }
  /**
   * Handle the response from the views processing endpoint
   */
  _handleviewsResponse(newValue, oldValue) {
    if (newValue !== null && typeof newValue.content !== typeof undefined) {
      // store the text and url callbacks
      if (document.getElementById("cmstokenidtolockonto") != null) {
        document
          .getElementById("cmstokenidtolockonto")
          .setAttribute("href", newValue.editEndpoint);
        document.getElementById("cmstokenidtolockonto").innerHTML =
          newValue.editText;
      }
      // wipe our own slot here
      wipeSlot(this);
      // now inject the content we got
      let frag = document.createElement("span");
      frag.innerHTML = newValue.content;
      let newNode = frag.cloneNode(true);
      this.appendChild(newNode);
      this.loading = false;
    }
  }
  /**
   * views end point changed
   */
  _viewsChanged(newValue) {
    // ensure we have something and are not loading currently
    if (
      typeof newValue !== typeof undefined &&
      newValue !== "" &&
      !this.loading
    ) {
      // support going from a null element to a real one
      if (
        typeof this.viewsEndPoint === typeof undefined &&
        typeof window.cmsviewsEndPoint !== typeof undefined
      ) {
        this.viewsEndPoint = window.cmsviewsEndPoint;
      }
      if (this.viewsEndPoint) {
        this.loading = true;
        this.shadowRoot.querySelector("#viewsrequest").body = newValue;
        this.shadowRoot.querySelector("#viewsrequest").generateRequest();
      }
    }
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "CMS View",
        description: "CMS views rendered on the backend",
        icon: "icons:view-module",
        color: "light-blue",
        groups: ["CMS"],
        handles: [
          {
            type: "cmsviews",
            views: "views"
          }
        ],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "viewsName",
            title: "Name",
            description: "Name of the view from our CMS",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "viewsDisplay",
            title: "Display",
            description: "Display within that view from our CMS",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      },
      saveOptions: {
        wipeSlot: true,
        unsetAttributes: [
          "loading",
          "views-data",
          "body-data",
          "views-end-point"
        ]
      }
    };
  }
  /**
   * Implements getHaxJSONSchema post processing callback.
   */
  postProcessgetHaxJSONSchema(schema) {
    schema.properties["__editThis"] = {
      type: "string",
      component: {
        name: "a",
        properties: {
          id: "cmstokenidtolockonto",
          href: "",
          target: "_blank"
        },
        slot: "Edit this view"
      }
    };
    return schema;
  }
}
window.customElements.define(CMSViews.tag, CMSViews);
export { CMSViews };
