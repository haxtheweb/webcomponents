import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import { wipeSlot } from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-spinner/paper-spinner.js";
/**
 * `cms-views`
 * @customElement cms-views
 * `Render and process a  / views from a content management system.`
 */
class CMSViews extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          min-width: 112px;
          min-height: 112px;
          transition: 0.6s all ease;
          background-color: transparent;
        }
        paper-spinner {
          visibility: hidden;
          opacity: 0;
          height: 80px;
          width: 80px;
          padding: 16px;
        }
        #replacementcontent {
          visibility: visible;
          opacity: 1;
        }
        :host([loading]) {
          text-align: center;
        }
        :host([loading]) paper-spinner {
          visibility: visible;
          opacity: 1;
        }
        :host([loading]) #replacementcontent {
          opacity: 0;
          visibility: hidden;
        }
      </style>
      <iron-ajax
        id="viewsrequest"
        method="GET"
        params="[[bodyData]]"
        url="[[viewsEndPoint]]"
        handle-as="json"
        last-response="{{viewsData}}"
      ></iron-ajax>
      <paper-spinner active="[[loading]]"></paper-spinner>
      <span id="replacementcontent"><slot></slot></span>
    `;
  }
  static get tag() {
    return "cms-views";
  }
  static get properties() {
    return {
      /**
       * Loading state
       */
      loading: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * Name of the views to render
       */
      viewsName: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * Display from the views
       */
      viewsDisplay: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * views end point updated, change the way we do processing.
       */
      viewsEndPoint: {
        type: String
      },
      /**
       * Body data which is just views with some encapsulation.
       */
      bodyData: {
        type: Object,
        computed: "_generateBodyData(viewsName, viewsDisplay)",
        observer: "_viewsChanged"
      },
      /**
       * views data from the end point.
       */
      viewsData: {
        type: String,
        observer: "_handleviewsResponse"
      },
      /**
       * Prefix for the views to be processed
       */
      viewsPrefix: {
        type: String,
        observer: "["
      },
      /**
       * Suffix for the views to be processed
       */
      viewsSuffix: {
        type: String,
        observer: "]"
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
      microTask.run(() => {
        let frag = document.createElement("span");
        frag.innerHTML = newValue.content;
        let newNode = frag.cloneNode(true);
        this.appendChild(newNode);
        setTimeout(() => {
          this.loading = false;
        }, 600);
      });
    }
  }
  /**
   * views end point changed
   */
  _viewsChanged(newValue, oldValue) {
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
        microTask.run(() => {
          this.shadowRoot.querySelector("#viewsrequest").generateRequest();
        });
      }
    }
  }
  /**
   * Attached to the DOM, now fire.
   */
  connectedCallback() {
    super.connectedCallback();
    if (
      typeof this.viewsName !== typeof undefined &&
      this.viewsName !== null &&
      this.viewsName !== ""
    ) {
      let slot = FlattenedNodesObserver.getFlattenedNodes(this);
      // only kick off request if there's nothing in it
      // if it has something in it that means we did some
      // remote rendering ahead of time
      if (slot.length === 0 && !this.loading) {
        // support for autoloading the views data needed for the request from globals
        if (
          typeof this.viewsEndPoint === typeof undefined &&
          typeof window.cmsviewsEndPoint !== typeof undefined
        ) {
          this.viewsEndPoint = window.cmsviewsEndPoint;
        }
        if (this.viewsEndPoint) {
          this.loading = true;
          microTask.run(() => {
            this.shadowRoot.querySelector("#viewsrequest").generateRequest();
          });
        }
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
