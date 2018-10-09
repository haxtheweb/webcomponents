import "@polymer/polymer/polymer.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-icons/iron-icons.js";
import "simple-colors/simple-colors.js";
import "vaadin-upload/vaadin-upload.js";
import "materializecss-styles/materializecss-styles.js";
import "./hax-preview.js";
import "./hax-app-browser.js";
import "./hax-gizmo-browser.js";
/**
`hax-manager`
A LRN element for brokering the UI for api endpoints both in querying and uploading of new media to eventually bubble up an event for hax-body to have content inserted into it. This is a wiring closet of sorts to ensure we can talk to any backend that's returning a slew of widgets / media to insert.

@demo demo/index.html

@microcopy - the mental model for this element
 - hax-manager - the modal for selecting a app for getting something added to hax-body. This will bubble an event up to an app which will then invoke the haxInsert function on hax-body in order to get the selected item onto the body area for usage.
 - hax-body - the body tag that's beening clicked / focused and built; our WYSIWYG replacement.
 - hax-panel - a panel off to the side that has possible options. Clicking in this panel is most likely what invokes hax-manager to display though this is also managed by a higher app (lrnapp-book in initial development)
 - app - an API end point for querying and returning possible items for insert. For example, if a youtube is a source then it'll be expected to return data that can be mapped in such a way that it can display a grid of videos. Hitting vimeo we'd expect the same thing; enough data to be able to assemble a grid of videos to select / work with.
 - endpoints - much of hax-manager is about routing data to and from the current application to backends. So uploads need to go some place, this is managing the UI aspect of that transaction while expecting to be fed an endpoint to handle the backend aspect.

*/
Polymer({
  _template: `
    <style is="custom-style" include="materializecss-styles">
      :host {
        display: block;
        --hax-manager-steps-color: #FFFFFF;
        --hax-manager-ink-color: #FFFFFF;
        --hax-accent: var(--simple-colors-light-green-background1);
        color: #FFFFFF;
      }
      #dialog {
        color: #FFFFFF;
        z-index: 10000;
        margin-top: 64px;
        --app-drawer-width: 400px;
        --app-drawer-content-container: {
          background-color: rgba(0, 0, 0, 0.7);
        };
      }
      :host[active-page="0"] #dialog {
        --app-drawer-width: 400px;
      }
      :host[active-page="1"] #dialog {
        --app-drawer-width: 800px;
      }
      :host[active-page="2"] #dialog {
        --app-drawer-width: 800px;
      }
      :host[active-step] #dialog {
        --app-drawer-width: 1000px;
      }
      :host[searching] #dialog {
        --app-drawer-width: 1000px;
      }
      .title {
        text-align: center;
        padding: 16px;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 32px;
        font-weight: bold;
        font-family: sans-serif;
        text-transform: uppercase;
        color: #a0ff52;
      }
      #activepage {
      }
      #preview {
        height: 100%;
      }
      vaadin-upload {
        --primary-color: var(--hax-accent);
        --primary-font-color: #FFFFFF;
        --dark-primary-color: #FFFFFF;
        --light-primary-color: var(--hax-accent);
        --error-color: darkred;
        color: #FFFFFF;
        display: block;
        padding: 32px !important;
        --vaadin-upload-button-add-wrapper: {
          border: 2px solid #FFFFFF;
          background-color: var(--hax-accent);
          color: #FFFFFF;
          display: block;
        };
        --vaadin-upload-buttons-primary: {
          display: block;
          width: 100%;
          flex: unset;
          -webkit-flex: unset;
        };
        --vaadin-upload-button-add: {
          color: #000000;
          display: block;
          flex: unset;
          -webkit-flex: unset;
          text-align: center;
        };
        --vaadin-upload-drop-label: {
          color: #FFFFFF;
          display: block;
          padding: 16px;
        };
        --vaadin-upload-drop-label-dragover: {
          color: #FFFFFF;
        };
        --vaadin-upload-file-list: {
          padding: 16px;
          margin: 0;
          color: #FFFFFF;
        };
        --vaadin-upload-file: {
          color: #FFFFFF;
        };
      }
      vaadin-upload[dragover] {
        border-color: #396;
      }
      vaadin-upload-file {
        --disabled-text-color: #222222;
      }
      .add-area-content-wrapper {
        padding: 0 16px;
      }
      .add-url-are,
      .add-upload-area {
        margin: 16px 0;
      }
      .url-description {
        font-size: 18px;
        color: #FFFFFF;
        line-height: 22px;
        font-family: sans-serif;
        letter-spacing: 1px;
      }
      #steppages {
        height: 100%;
      }
      #newassetconfigure {
        width: 100%;
        margin: 0;
        padding: 16px;
        background-color: #a0ff52;
        color: #000000;
      }
      paper-input {
        color: #FFFFFF;
        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3);
        --secondary-text-color: #FFFFFF;
        --primary-text-color: #FFFFFF;
        --paper-input-container-input-color: #FFFFFF;
        --paper-input-container-color: #FFFFFF;
        --paper-input-container-focus-color: var(--simple-colors-light-green-background1);
      }
      @media screen and (max-width: 550px) {
        .hide-on-mobile {
          opacity: 0;
          visibility: hidden;
          position: absolute;
          left: -9999px;
        }
        .page-area.hax-manager {
          padding: 6px;
        }
      }
    </style>
    <app-drawer id="dialog" opened="{{opened}}" disable-swipe="">
      <div class="dialog-contents" id="dialogcontent" style="height: 100%; overflow: auto;">
        <iron-pages id="steppages" selected="{{activeStep}}" fallback-selection="select" role="main">
          <div data-value="select">
            <iron-pages id="activepage" selected="{{activePage}}" fallback-selection="link">
              <div class="page-area add-area">
                <h3 class="title">[[addTitle]]</h3>
                <div class="add-area-content-wrapper">
                  <div class="add-url-area">
                    <paper-input id="url" label="URL" type="url" auto-validate=""></paper-input>
                  <div class="url-description">A full URL with https:// referencing a link that already exists on the web.</div>
                  </div>
                  <div class="add-upload-area">
                    <vaadin-upload form-data-name="file-upload" id="fileupload" hidden\$="[[!canSupportUploads]]"></vaadin-upload>
                  </div>
                  <paper-button id="newassetconfigure" raised="">Configure item</paper-button>
                </div>
              </div>
              <div class="page-area">
                <hax-app-browser id="appbrowser">
                  <slot></slot>
                </hax-app-browser>
              </div>
              <div class="page-area">
                <hax-gizmo-browser id="gizmobrowser"></hax-gizmo-browser>
              </div>
            </iron-pages>
          </div>
          <div style="height:100%;">
            <hax-preview id="preview" element="{{activeHaxElement}}"></hax-preview>
          </div>
        </iron-pages>
      </div>
    </app-drawer>
`,

  is: "hax-manager",

  listeners: {
    "dialog.iron-overlay-canceled": "close",
    "dialog.iron-overlay-closed": "close",
    "newassetconfigure.tap": "newAssetConfigure",
    "fileupload.upload-before": "_fileAboutToUpload",
    "fileupload.upload-response": "_fileUploadResponse"
  },

  properties: {
    /**
     * Track visibility status.
     */
    opened: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: "_openedChanged"
    },
    /**
     * Title when open.
     */
    editExistingNode: {
      type: Boolean,
      value: false
    },
    /**
     * Title when open.
     */
    editTitle: {
      type: String,
      computed: "_computeEditTitle(editExistingNode)"
    },
    /**
     * Active title
     */
    addTitle: {
      type: String,
      value: "Add content"
    },
    /**
     * Active step currently selected
     */
    activeStep: {
      type: Boolean,
      reflectToAttribute: true,
      value: false,
      observer: "_activeStepChanged"
    },
    /**
     * Searching mode
     */
    searching: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    },
    /**
     * Active page currently selected
     */
    activePage: {
      type: String,
      reflectToAttribute: true,
      value: 0,
      observer: "_activePageChanged"
    },
    /**
     * If this can support uploads or not based on presense of a backend
     * this property is synced down from the store
     */
    canSupportUploads: {
      type: Boolean,
      value: false
    },
    /**
     * Active element
     */
    activeHaxElement: {
      type: Object,
      observer: "_activeHaxElementChanged"
    },
    /**
     * List of apps so they can be added
     */
    appList: {
      type: Array,
      value: []
    },
    /**
     * Helper so we can upload after prompting where to go.
     */
    __allowUpload: {
      type: Boolean,
      value: false
    },
    /**
     * Support for JWTs if name of the JWT is used
     */
    appendJwt: {
      type: String,
      value: null
    },
    /**
     * Support for other data that's generated dynamically
     */
    appendUploadEndPoint: {
      type: String,
      value: null
    }
  },

  /**
   * Created life cycle.
   */
  ready: function() {
    document.body.appendChild(this);
  },

  /**
   * Attached to the DOM, now fire that we exist.
   */
  attached: function() {
    // fire an event that this is the manager
    this.fire("hax-register-manager", this);
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.addEventListener(
      "hax-app-picker-selection",
      this._haxAppPickerSelection.bind(this)
    );
    // specialized support for the place-holder tag
    // and a drag and drop event
    document.body.addEventListener(
      "place-holder-file-drop",
      this._placeHolderFileDrop.bind(this)
    );
  },

  /**
   * Detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.removeEventListener(
      "hax-app-picker-selection",
      this._haxAppPickerSelection.bind(this)
    );
    document.body.removeEventListener(
      "place-holder-file-drop",
      this._placeHolderFileDrop.bind(this)
    );
  },

  /**
   * Toggle panel size
   */
  togglePanelSize: function(e) {
    this.$.dialog.classList.toggle("grow");
    this.updateStyles();
    window.dispatchEvent(new Event("resize"));
  },

  /**
   * compute title for edit mode
   */
  _computeEditTitle: function(updateExisting) {
    if (typeof this.activeHaxElement !== typeof undefined && updateExisting) {
      return "Update";
    } else {
      return "Insert";
    }
  },

  /**
   * A file event was detected from a drag and drop in the interface, most likely
   * from a place-holder tag
   */
  _placeHolderFileDrop: function(e) {
    // reset the manager back to the first page
    this.resetManager();
    // trigger a self open request
    this.open();
    // reference the active place holder element since place holders are
    // the only things possible for seeing these
    Polymer.HaxStore.instance.activePlaceHolder = e.detail.placeHolderElement;
    // ! I can't believe this actually works. This takes the event
    // ! that was a drop event else where on the page and then repoints
    // ! it to simulate the drop event using the same event structure that
    // ! would have happened if they had used this element in the first place
    this.$.fileupload._onDrop(e.detail);
  },

  /**
   * Respond to uploading a file
   */
  _fileAboutToUpload: function(e) {
    if (!this.__allowUpload) {
      // cancel the event so we can jump in
      e.preventDefault();
      e.stopPropagation();
      // look for a match as to what gizmo types it supports
      let values = {
        source: e.detail.file.name,
        type: e.detail.file.type
      };
      // we have no clue what this is.. let's try and guess..
      var type = Polymer.HaxStore.guessGizmoType(values);
      // find targets that support this type
      let targets = Polymer.HaxStore.getHaxAppStoreTargets(type);
      // make sure we have targets
      if (targets.length != 0) {
        Polymer.HaxStore.instance.haxAppPicker.presentOptions(
          targets,
          type,
          "Where would you like to upload this " + type + "?",
          "app"
        );
      } else {
        Polymer.HaxStore.toast(
          "Sorry, you don't have a storage location that can handle " +
            type +
            " uploads!",
          5000
        );
      }
    } else {
      this.__allowUpload = false;
    }
  },

  /**
   * Event for an app being selected from a picker
   * This happens when multiple upload targets support the given type
   */
  _haxAppPickerSelection: function(e) {
    // details for where to upload the file
    let connection = e.detail.connection;
    this.__appUsed = e.detail;
    this.$.fileupload.method = connection.operations.add.method;
    let requestEndPoint = connection.protocol + "://" + connection.url;
    // ensure we build a url correctly
    if (requestEndPoint.substr(requestEndPoint.length - 1) != "/") {
      requestEndPoint += "/";
    }
    // support local end point modification
    if (typeof connection.operations.add.endPoint !== typeof undefined) {
      requestEndPoint += connection.operations.add.endPoint;
    }
    // support jwt hijacking
    if (this.appendUploadEndPoint != null) {
      requestEndPoint += "?" + this.appendUploadEndPoint;
    }
    if (this.appendJwt != null) {
      requestEndPoint +=
        "&" + this.appendJwt + "=" + localStorage.getItem(this.appendJwt);
    }
    this.$.fileupload.headers = connection.headers;
    this.$.fileupload.target = requestEndPoint;
    // invoke file uploading...
    this.__allowUpload = true;
    this.$.fileupload.uploadFiles();
  },

  /**
   * Respond to successful file upload, now inject url into url field and
   * do a gizmo guess from there!
   */
  _fileUploadResponse: function(e) {
    // convert response to object
    let response = JSON.parse(e.detail.xhr.response);
    // access the app that did the upload
    let map = this.__appUsed.connection.operations.add.resultMap;
    let data = {};
    let item = {};
    // look for the items element to draw our data from at its root
    if (
      typeof this._resolveObjectPath(map.item, response) !== typeof undefined
    ) {
      data = this._resolveObjectPath(map.item, response);
    }
    item.type = map.defaultGizmoType;
    // pull in prop matches
    for (var prop in map.gizmo) {
      item[prop] = this._resolveObjectPath(map.gizmo[prop], data);
    }
    // another sanity check, if we don't have a url but have a source bind that too
    if (
      typeof item.url === typeof undefined &&
      typeof item.source !== typeof undefined
    ) {
      item.url = item.source;
    }
    // gizmo type is also supported in the mapping element itself
    // Think an asset management backend as opposed to a specific
    // type of asset like video. If the item coming across can
    // effectively check what kind of gizmo is required for it
    // to work then we need to support that asset declaring the
    // gizmo type needed
    if (typeof map.gizmo.type !== typeof undefined) {
      item.type = this._resolveObjectPath(map.gizmo.type, data);
    }
    this.$.url.value = item.url;
    // @todo put in logic to support the response actually
    // just outright returning a haxElement. This is rare
    // but if the HAX developer has control over the endpoint
    // then they could get HAX to streamline some workflows
    // or by-pass the gizmo selection step to improve UX
    // for end users even further. Examples could be a media
    // management system that has remote rendering (cms-token)
    // or a highly specific endpoint that we know we can only
    // present in one way effectively Box / Google doc viewer.
    this.newAssetConfigure();
  },

  /**
   * Notice page changed.
   */
  _activePageChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.searching = false;
      this.updateStyles();
      if (newValue === 1) {
        this.$.appbrowser.resetBrowser();
      } else if (newValue === 2) {
        this.$.gizmobrowser.resetBrowser();
      }
    }
  },

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      this.set(e.detail.property, e.detail.value);
    }
  },

  /**
   * Notice active element changed.
   */
  _activeHaxElementChanged: function(newValue, oldValue) {
    if (typeof oldValue !== typeof undefined) {
      this.$.preview.advancedForm = false;
      if (typeof newValue.tag === typeof undefined) {
        this.resetManager();
      } else {
        // reset files so it doesn't bloat up
        this.$.fileupload.set("files", []);
        this.$.dialog.scrollTop = 0;
        this.selectStep("configure");
      }
    }
  },

  /**
   * Bubble up insert event.
   */
  insertHaxElement: function(e) {
    // bubble up the inject event / element to the body
    let previewNode = this.$.preview.previewNode;
    let element = Polymer.HaxStore.nodeToHaxElement(previewNode);
    element.replace = this.editExistingNode;
    if (typeof this.activeHaxElement.__type !== typeof undefined) {
      element.__type = this.activeHaxElement.__type;
    }
    element.replacement = previewNode;
    this.fire("hax-insert-content", element);
    let toast = "New element added!";
    if (this.editExistingNode) {
      toast = "Element updated!";
    }
    Polymer.HaxStore.toast(toast, 2000);
    // close window
    this.close();
  },

  /**
   * Reset things on the display to their defaults.
   */
  resetManager: function(activePage = 0) {
    this.selectStep("select");
    this.activePage = activePage;
    document.body.style.overflow = null;
    this.appList = Polymer.HaxStore.instance.appList;
    this.searching = false;
    Polymer.HaxStore.write("activeApp", null, this);
    window.dispatchEvent(new Event("resize"));
    this.editExistingNode = false;
    this.$.url.value = "";
    this.$.fileupload.headers = "";
    this.$.fileupload.method = "";
    this.$.fileupload.target = "";
    this.__allowUpload = false;
  },

  /**
   * Cancel interaction with the modal
   */
  cancel: function(e) {
    // reset and close dialog
    this.close();
  },

  /**
   * Open state change.
   */
  _openedChanged: function(newValue, oldValue) {
    if (oldValue && !newValue) {
      document.body.style.overflow = null;
    } else if (newValue && !oldValue) {
      document.body.style.overflow = "hidden";
    }
  },

  /**
   * Respond to the modal closing
   */
  close: function(e) {
    var normalizedEvent = Polymer.dom(e);
    var local = normalizedEvent.localTarget;
    if (typeof e === typeof undefined || local === this.$.dialog) {
      // reset the active element which will force this to reset the manager
      Polymer.HaxStore.write("activeHaxElement", {}, this);
      this.opened = false;
      this.resetManager();
    }
  },

  /**
   * Open the dialog
   */
  open: function(e) {
    this.opened = true;
  },

  /**
   * Configure asset after upload or URL passed in.
   */
  newAssetConfigure: function() {
    let values = {
      source: this.$.url.value
    };
    // we have no clue what this is.. let's try and guess..
    var type = Polymer.HaxStore.guessGizmoType(values);
    let haxElements = Polymer.HaxStore.guessGizmo(type, values);
    // see if we got anything
    if (haxElements.length > 0) {
      if (haxElements.length === 1) {
        if (typeof haxElements[0].tag !== typeof undefined) {
          Polymer.HaxStore.write("activeHaxElement", haxElements[0], this);
        }
      } else {
        // hand off to hax-app-picker to deal with the rest of this
        Polymer.HaxStore.instance.haxAppPicker.presentOptions(
          haxElements,
          type,
          "Pick how to present the " + type,
          "gizmo"
        );
      }
    } else {
      Polymer.HaxStore.toast(
        "Sorry, HAX doesn't know how to handle that type of link yet."
      );
    }
  },

  /**
   * Toggle ourselves.
   */
  toggleDialog: function(toggle = true) {
    if (this.opened && toggle) {
      this.close();
    } else {
      Polymer.HaxStore.instance.closeAllDrawers(this);
    }
  },

  /**
   * Set step to configure or insert
   */
  selectStep: function(step) {
    if (step == "configure") {
      this.activeStep = true;
    } else {
      this.activeStep = false;
    }
  },

  /**
   * Notice step changes
   */
  _activeStepChanged: function(newValue, oldValue) {
    if (newValue || !newValue) {
      this.updateStyles();
      window.dispatchEvent(new Event("resize"));
    }
  },

  /**
   * Helper to take a multi-dimensional object and convert
   * it's reference into the real value. This allows for variable input defined
   * in a string to actually hit the deeper part of an object structure.
   */
  _resolveObjectPath: function(path, obj) {
    return path.split(".").reduce(function(prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  }
});
