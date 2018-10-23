import "@polymer/polymer/polymer.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "hax-body-behaviors/hax-body-behaviors.js";
import "@polymer/paper-spinner/paper-spinner.js";
const $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="cms-views">
  <template strip-whitespace="">
    <style>
      :host {
        display: block;
        min-width: 112px;
        min-height: 112px;
        transition: .6s all ease;
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
      :host[loading] {
        text-align: center;
      }
      :host[loading] paper-spinner {
        visibility: visible;
        opacity: 1;
      }
      :host[loading] #replacementcontent {
        opacity: 0;
        visibility: hidden;
      }
    </style>
    <iron-ajax id="viewsrequest" method="GET" params="[[bodyData]]" url="[[viewsEndPoint]]" handle-as="json" last-response="{{viewsData}}"></iron-ajax>
    <paper-spinner active="[[loading]]"></paper-spinner>
    <span id="replacementcontent"><slot></slot></span>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer);
/**
`cms-views`
Render and process a  / views from a content management system.

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  is: "cms-views",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
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
  },
  /**
   * Generate body data.
   */
  _generateBodyData: function(name, display) {
    if (name !== null && name !== "") {
      return {
        name: `${name}`,
        display: `${display}`
      };
    }
  },
  /**
   * Handle the response from the views processing endpoint
   */
  _handleviewsResponse: function(newValue, oldValue) {
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
      this.wipeSlot(Polymer.dom(this));
      // now inject the content we got
      this.async(() => {
        let frag = document.createElement("span");
        frag.innerHTML = newValue.content;
        let newNode = frag.cloneNode(true);
        Polymer.dom(this).appendChild(newNode);
        setTimeout(() => {
          this.loading = false;
        }, 600);
      });
    }
  },
  /**
   * wipe out the slot
   */
  wipeSlot: function(element) {
    while (element.firstChild !== null) {
      element.removeChild(element.firstChild);
    }
  },
  /**
   * views end point changed
   */
  _viewsChanged: function(newValue, oldValue) {
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
        this.async(() => {
          this.$.viewsrequest.generateRequest();
        });
      }
    }
  },
  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    if (
      typeof this.viewsName !== typeof undefined &&
      this.viewsName !== null &&
      this.viewsName !== ""
    ) {
      let slot = Polymer.dom(this).getEffectiveChildNodes();
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
          this.async(() => {
            this.$.viewsrequest.generateRequest();
          });
        }
      }
    }
    // Establish hax property binding
    let props = {
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
          author: "LRNWebComponents"
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
    this.setHaxProperties(props);
  },
  /**
   * Implements getHaxJSONSchema post processing callback.
   */
  postProcessgetHaxJSONSchema: function(schema) {
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
});
