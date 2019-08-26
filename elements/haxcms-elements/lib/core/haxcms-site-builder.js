import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { setPassiveTouchGestures } from "@polymer/polymer/lib/utils/settings.js";
import { updateStyles } from "@polymer/polymer/lib/mixins/element-mixin.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import { JsonOutlineSchema } from "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
import {
  encapScript,
  findTagsInHTML,
  wipeSlot,
  varExists,
  varGet
} from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { store } from "./haxcms-site-store.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "./haxcms-site-router.js";

/**
 * `haxcms-site-builder`
 * `build the site and everything off of this`
 * @microcopy - the mental model for this element
 * - This is a factory element, it doesn't do much on its own visually
 * - it loads a site.json file and then utilizes this data in order to construct
 *   what theme it should load (element) in order to get everything off and running
 */
class HAXCMSSiteBuilder extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-site-builder";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host #slot {
          transition: all 0.2s ease-in-out;
          background-color: var(--haxcms-color, white);
          opacity: 0.2;
          visibility: hidden;
        }
        :host([dashboard-opened]) {
          display: inline-block !important;
          margin-left: 50vw;
          height: 100vh;
          transition: 1s linear margin;
          pointer-events: none;
          opacity: 0.5;
          width: 100vw;
        }
        :host([theme-loaded]) #slot {
          opacity: 1;
          visibility: visible;
        }
        paper-progress {
          display: block;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: transparent;
          z-index: 1000;
          --paper-progress-active-color: var(
            --haxcms-color,
            rgba(255, 255, 255, 0.5)
          );
          --paper-progress-container-color: transparent;
        }
      </style>
      <haxcms-site-router base-uri="[[baseURI]]"></haxcms-site-router>
      <paper-progress hidden\$="[[!loading]]" indeterminate></paper-progress>
      <iron-ajax
        id="manifest"
        url="[[outlineLocation]][[file]][[_timeStamp]]"
        handle-as="json"
        last-response="{{manifest}}"
        last-error="{{lastError}}"
      ></iron-ajax>
      <iron-ajax
        id="activecontent"
        url="[[outlineLocation]][[activeItem.location]][[_timeStamp]]"
        handle-as="text"
        loading="{{loading}}"
        last-response="{{activeItemContent}}"
        last-error="{{lastError}}"
      ></iron-ajax>
      <div id="slot"><slot></slot></div>
    `;
  }
  static get properties() {
    return {
      /**
       * Singular error reporter / visual based on requests erroring
       */
      lastError: {
        type: Object,
        observer: "_lastErrorChanged"
      },
      _timeStamp: {
        type: String
      },
      dashboardOpened: {
        type: Boolean,
        observer: "_dashboardOpenedChanged",
        reflectToAttribute: true
      },
      /**
       * queryParams
       */
      queryParams: {
        type: Object
      },
      /**
       * Loading status of the page to render.
       */
      loading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * support for alternate locations.
       */
      outlineLocation: {
        type: String,
        notify: true,
        reflectToAttribute: true
      },
      /**
       * Manifest from file
       */
      manifest: {
        type: Object,
        notify: true,
        observer: "_manifestChanged"
      },
      /**
       * Theme, used to boot a design element
       */
      themeData: {
        type: Object,
        observer: "_themeChanged"
      },
      /**
       * Theme, used to boot a design element
       */
      themeElement: {
        type: Object
      },
      /**
       * Imported items so we can allow theme flipping dynamically
       */
      __imported: {
        type: Object,
        value: {}
      },
      /**
       * theme loaded to indicate to the theme we have a theme ready to go
       */
      themeLoaded: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * Active item which is in JSON Outline Schema
       */
      activeItem: {
        type: Object,
        notify: true,
        observer: "_activeItemChanged"
      },
      /**
       * Active item content
       */
      activeItemContent: {
        type: String,
        notify: true,
        observer: "_activeItemContentChanged"
      },
      /**
       * Location of the site.json file
       */
      file: {
        type: String,
        observer: "_fileChanged"
      },
      /**
       * Injected by HAXcms
       */
      baseURI: {
        type: String
      }
    };
  }
  _lastErrorChanged(newValue) {
    if (newValue) {
      console.error(newValue);
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: newValue.statusText
        }
      });
      window.dispatchEvent(evt);
    }
  }
  /**
   * ready life cycle
   */
  constructor() {
    super();
    window.addEventListener("hax-store-ready", this.storeReady.bind(this));
    import("@polymer/paper-progress/paper-progress.js");
    import("@lrnwebcomponents/simple-toast/simple-toast.js");
    // attempt to set polymer passive gestures globally
    // this decreases logging and improves performance on scrolling
    setPassiveTouchGestures(true);
    // hide the outdated fallback
    if (document.getElementById("haxcmsoutdatedfallback")) {
      document.getElementById("haxcmsoutdatedfallback").style.display = "none";
    }
    this.__disposer = [];
    autorun(reaction => {
      this.dashboardOpened = toJS(store.dashboardOpened);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.themeData = toJS(store.themeData);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.activeItem = toJS(store.activeItem);
      this.__disposer.push(reaction);
    });
    this._timeStamp = "";
  }
  _dashboardOpenedChanged(newValue, oldValue) {
    if (newValue) {
      this.setAttribute("aria-hidden", "aria-hidden");
      this.setAttribute("tabindex", "-1");
    } else if (!newValue && oldValue) {
      this.removeAttribute("aria-hidden");
      this.removeAttribute("tabindex");
    }
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.dispatchEvent(
        new CustomEvent("haxcms-ready", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this
        })
      );
      if (document.getElementById("haxcmsoutdatedfallback")) {
        document.body.removeChild(
          document.getElementById("haxcmsoutdatedfallback")
        );
      }
      window.addEventListener(
        "haxcms-trigger-update",
        this._triggerUpdatedData.bind(this)
      );
      window.addEventListener(
        "haxcms-trigger-update-node",
        this._triggerUpdatedNode.bind(this)
      );
      // dyanmcially import the editor builder which figures out if we should have one
      import("@lrnwebcomponents/haxcms-elements/lib/core/haxcms-editor-builder.js")
        .then(response => {
          this.editorBuilder = document.createElement("haxcms-editor-builder");
          // attach editor builder after we've appended to the screen
          document.body.appendChild(this.editorBuilder);
          // get fresh data if not published / demo which is a form of published
          if (
            this.editorBuilder.getContext() !== "published" &&
            this.editorBuilder.getContext() !== "demo"
          ) {
            this._timeStamp = "?" + Math.floor(Date.now() / 1000);
          }
        })
        .catch(error => {
          /* Error handling */
          console.log(error);
        });
      var evt = document.createEvent("UIEvents");
      evt.initUIEvent("resize", true, false, window, 0);
      window.dispatchEvent(evt);
    });
  }
  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    window.removeEventListener(
      "haxcms-trigger-update",
      this._triggerUpdatedData.bind(this)
    );
    window.removeEventListener(
      "haxcms-trigger-update-node",
      this._triggerUpdatedNode.bind(this)
    );
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    window.removeEventListener("hax-store-ready", this.storeReady.bind(this));
    super.disconnectedCallback();
  }
  storeReady(e) {
    // append UI element to body to avoid stack order issues
    if (
      store.cmsSiteEditor &&
      store.cmsSiteEditor.instance &&
      window.HaxStore.instance.activeHaxBody &&
      store.activeItemContent
    ) {
      window.HaxStore.instance.activeHaxBody.importContent(
        store.activeItemContent
      );
    }
  }
  /**
   * React to content being loaded from a page.
   */
  _activeItemContentChanged(newValue, oldValue) {
    if (newValue) {
      var html = newValue;
      // only append if not empty
      if (html !== null) {
        wipeSlot(this.themeElement, "*");
        html = encapScript(newValue);
        // set in the store
        store.activeItemContent = html;
        // insert the content as quickly as possible, then work on the dynamic imports
        // @todo this might be why we get a double render some times
        setTimeout(() => {
          if (dom(this.themeElement).getEffectiveChildNodes().length === 0) {
            let frag = document.createRange().createContextualFragment(html);
            dom(this.themeElement).appendChild(frag);
            this.dispatchEvent(
              new CustomEvent("json-outline-schema-active-body-changed", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: html
              })
            );
          }
        }, 5);
        // if there are, dynamically import them
        if (varExists(this.manifest, "metadata.node.dynamicElementLoader")) {
          let tagsFound = findTagsInHTML(html);
          const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
          for (var i in tagsFound) {
            const tagName = tagsFound[i];
            if (
              this.manifest.metadata.node.dynamicElementLoader[tagName] &&
              !window.customElements.get(tagName)
            ) {
              import(`${basePath}../../../../${
                this.manifest.metadata.node.dynamicElementLoader[tagName]
              }`)
                .then(response => {
                  // useful to debug if dynamic references are coming in
                  //console.log(tagName + ' dynamic import');
                })
                .catch(error => {
                  /* Error handling */
                  console.log(error);
                  console.log(tagName);
                });
            }
          }
        }
      }
    }
  }
  /**
   * Active item updated, let's request the content from it
   */
  _activeItemChanged(newValue, oldValue) {
    if (newValue && typeof newValue.id !== typeof undefined) {
      this.set("queryParams.nodeId", newValue.id);
      this.notifyPath("queryParams.nodeId");
      // if published, keep it static on request
      // @todo might revisit this in the future
      if (
        this.editorBuilder &&
        this.editorBuilder.getContext() === "published"
      ) {
        this._timeStamp = "";
      } else {
        this._timeStamp = "?" + Math.floor(Date.now() / 1000);
      }
      this.$.activecontent.generateRequest();
    }
    // we had something, now we don't. wipe out the content area of the theme
    else if (oldValue && !newValue) {
      // fire event w/ nothing, this is because there is no content
      this.dispatchEvent(
        new CustomEvent("json-outline-schema-active-body-changed", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: null
        })
      );
    }
  }

  /**
   * got a message that we need to update our json manifest data
   */
  _triggerUpdatedData(e) {
    // get fresh data if not published
    if (this.editorBuilder && this.editorBuilder.getContext() !== "published") {
      this._timeStamp = "?" + Math.floor(Date.now() / 1000);
    }
    this.$.manifest.generateRequest();
  }

  /**
   * got a message that we need to update our page content
   */
  _triggerUpdatedNode(e) {
    // get fresh data if not published
    if (
      this.editorBuilder &&
      this.editorBuilder.getContext() !== "published" &&
      this.editorBuilder.getContext() !== "demo"
    ) {
      this._timeStamp = "?" + Math.floor(Date.now() / 1000);
    }
    // ensure we don't get a miss on initial load
    if (this.activeItem.location) {
      this.$.activecontent.generateRequest();
    }
  }
  /**
   * File changed so let's pull from the location
   */
  _fileChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.$.manifest.generateRequest();
    }
  }
  /**
   * notice manifest changes and ensure slot is rebuilt.
   */
  _manifestChanged(newValue, oldValue) {
    if (newValue && newValue.metadata && newValue.items) {
      // @todo replace this with a schema version mapper
      // once we have versions
      if (varExists(newValue, "metadata.siteName")) {
        let git = varGet(newValue, "publishing.git", {});
        newValue.metadata.site = {
          name: newValue.metadata.siteName,
          git: git,
          created: newValue.metadata.created,
          updated: newValue.metadata.updated
        };
        newValue.metadata.theme.variables = {
          image: newValue.metadata.image,
          icon: newValue.metadata.icon,
          hexCode: newValue.metadata.hexCode,
          cssVariable: newValue.metadata.cssVariable
        };
        newValue.metadata.node = {
          dynamicElementLoader: newValue.metadata.dynamicElementLoader,
          fields: newValue.metadata.fields
        };
        delete newValue.metadata.publishing;
        delete newValue.metadata.created;
        delete newValue.metadata.updated;
        delete newValue.metadata.siteName;
        delete newValue.metadata.image;
        delete newValue.metadata.icon;
        delete newValue.metadata.hexCode;
        delete newValue.metadata.cssVariable;
        delete newValue.metadata.dynamicElementLoader;
        delete newValue.metadata.fields;
      }
      var site = new JsonOutlineSchema();
      // we already have our items, pass them in
      var nodes = site.itemsToNodes(newValue.items);
      // smash outline into flat to get the correct order
      var correctOrder = site.nodesToItems(nodes);
      var newItems = [];
      // build a new array in the correct order by pushing the old items around
      for (var key in correctOrder) {
        newItems.push(
          newValue.items.find(element => {
            return element.id === correctOrder[key].id;
          })
        );
      }
      newValue.items = newItems;
      store.manifest = newValue;
      this.dispatchEvent(
        new CustomEvent("json-outline-schema-changed", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: newValue
        })
      );
    }
  }
  /**
   * notice theme changes and ensure slot is rebuilt.
   */
  _themeChanged(newValue, oldValue) {
    if (newValue && oldValue) {
      if (
        store.cmsSiteEditor &&
        store.cmsSiteEditor.instance &&
        typeof store.cmsSiteEditor.instance.haxCmsSiteEditorElement !==
          typeof undefined
      ) {
        store.cmsSiteEditor.instance.appendChild(
          store.cmsSiteEditor.instance.haxCmsSiteEditorElement
        );
      }
    }
    if (newValue) {
      this.themeLoaded = false;
      let theme = newValue;
      // wipe out what we got
      wipeSlot(this, "*");
      // create the 'theme' as a new element
      this.themeElement = document.createElement(theme.element);
      // weird but definition already here so we should be able
      // to just use this without an import, it's possible..
      if (typeof this.__imported[theme.element] !== typeof undefined) {
        dom(this).appendChild(this.themeElement);
        this.themeLoaded = true;
      } else {
        // import the reference to the item dynamically, if we can
        try {
          import(pathFromUrl(decodeURIComponent(import.meta.url)) +
            "../../../../" +
            newValue.path).then(e => {
            // add it into ourselves so it unpacks and we kick this off!
            dom(this).appendChild(this.themeElement);
            this.__imported[theme.element] = theme.element;
            this.themeLoaded = true;
          });
        } catch (err) {
          // error in the event this is a double registration
          // also strange to be able to reach this but technically possible
          dom(this).appendChild(this.themeElement);
          this.themeLoaded = true;
        }
      }
      // delay for theme switching to reapply the css variable associations
      setTimeout(() => {
        updateStyles();
      }, 500);
    }
  }
}
window.customElements.define(HAXCMSSiteBuilder.tag, HAXCMSSiteBuilder);
// this global allows a backdoor into activating the HAXcms editor UI
// this is only going to be visually enabled but it won't actually
// be able to talk to the backend correctly bc the JWT won't exist
// the endpoints are also fictional. also useful for testing purposes
window.HAXme = function(context = null) {
  if (context == null) {
    // fake a demo
    context = "demo";
    // fake endpoints
    window.appSettings = {
      login: "dist/dev/login.json",
      logout: "dist/dev/logout.json",
      saveNodePath: "dist/dev/saveNode.json",
      saveManifestPath: "dist/dev/saveManifestPath.json",
      createNodePath: "dist/dev/saveNode.json",
      deleteNodePath: "dist/dev/saveNode.json",
      saveOutlinePath: "dist/dev/saveNode.json",
      publishSitePath: "dist/dev/saveNode.json",
      getNodeFieldsPath: "dist/dev/getNodeFieldsPath.json",
      getSiteFieldsPath: "dist/dev/getSiteFieldsPath.json",
      revertSitePath: "dist/dev/saveNode.json",
      getFormToken: "adskjadshjudfu823u823u8fu8fij",
      appStore: {
        url: "dist/dev/appstore.json"
      },
      // add your custom theme here if testing locally and wanting to emulate the theme selector
      // this isn't really nessecary though
      themes: {
        "haxcms-dev-theme": {
          element: "haxcms-dev-theme",
          path: "@lrnwebcomponents/haxcms-elements/lib/haxcms-dev-theme.js",
          name: "Developer theme"
        }
      }
    };
  }
  if (context == "demo") {
    window.__haxCMSContextDemo = true;
  }
  // apply context
  document.body.querySelector("haxcms-editor-builder").applyContext(context);
};
export { HAXCMSSiteBuilder };
