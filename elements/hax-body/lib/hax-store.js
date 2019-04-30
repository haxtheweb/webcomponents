import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import { setPassiveTouchGestures } from "@polymer/polymer/lib/utils/settings.js";
import { getRange } from "./shadows-safari.js";
import {
  encapScript,
  wipeSlot
} from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import { MediaBehaviorsVideo } from "@lrnwebcomponents/media-behaviors/media-behaviors.js";
import { HAXElement } from "@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";
import { CodeSample } from "@lrnwebcomponents/code-sample/code-sample.js";
import "./hax-app.js";
import "./hax-stax.js";
import "./hax-stax-browser.js";
import "./hax-blox.js";
import "./hax-blox-browser.js";

class HaxStore extends HAXElement(MediaBehaviorsVideo(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>
      <slot></slot>
      <iron-ajax
        id="appstore"
        url="[[appStore.url]]"
        params="[[appStore.params]]"
        method="GET"
        content-type="application/json"
        handle-as="json"
        last-response="{{__appStoreData}}"
      ></iron-ajax>
      <hal-9000 id="hal" debug="debug" commands="[[voiceCommands]]"></hal-9000>
    `;
  }
  static get tag() {
    return "hax-store";
  }
  /**
   * Complex observer composites used for initial timing since this is a skeleton setup
   */
  static get observers() {
    return [
      "_loadAppStoreData(__ready, __appStoreData, haxAutoloader)",
      "_storePiecesAllHere(haxAutoloader,activeHaxBody, haxPanel, haxToast, haxExport, haxPreferences, haxManager, haxStaxPicker, haxAppPicker)"
    ];
  }

  static get properties() {
    return Object.assign(
      {
        /**
         * skipHAXConfirmation
         */
        skipHAXConfirmation: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },
        /**
         * Local storage bridge
         */
        storageData: {
          type: Object,
          value: {},
          observer: "_storageDataChanged"
        },
        /**
         * Hax app picker element.
         */
        haxAppPicker: {
          type: Object
        },
        /**
         * Hax stax picker element.
         */
        haxStaxPicker: {
          type: Object
        },
        /**
         * Hax manager element.
         */
        haxManager: {
          type: Object
        },
        /**
         * Hax autoloader element.
         */
        haxAutoloader: {
          type: Object
        },
        /**
         * A list of all haxBodies that exist
         */
        haxBodies: {
          type: Array,
          value: []
        },
        /**
         * An active place holder item reference. This is used
         * for inline drag and drop event detection so that we
         * know what element replace in context.
         */
        activePlaceHolder: {
          type: Object,
          value: null
        },
        /**
         * The hax-body that is currently active.
         */
        activeHaxBody: {
          type: Object
        },
        /**
         * Possible appStore endpoint for loading in things dynamically.
         */
        appStore: {
          type: Object,
          observer: "_appStoreChanged"
        },
        /**
         * HAX Toast message.
         */
        haxToast: {
          type: Object
        },
        /**
         * Hax panel element.
         */
        haxPanel: {
          type: Object
        },
        /**
         * Hax export dialog element.
         */
        haxExport: {
          type: Object
        },
        /**
         * Hax preferences dialog element.
         */
        haxPreferences: {
          type: Object
        },
        /**
         * Active HAX Element if we have one we are working on.
         */
        activeHaxElement: {
          type: Object
        },
        /**
         * Active Node.
         */
        activeNode: {
          type: Object
        },
        /**
         * Active container Node, 2nd highest parent of activeNode.
         */
        activeContainerNode: {
          type: Object
        },
        /**
         * Session object bridged in from a session method of some kind
         */
        sessionObject: {
          type: Object,
          value: {}
        },
        /**
         * editMode
         */
        editMode: {
          type: Boolean,
          value: false,
          observer: "_editModeChanged"
        },
        /**
         * Boolean for if this instance has backends that support uploading
         */
        canSupportUploads: {
          type: Boolean,
          value: false
        },
        /**
         * skip the exit trap to prevent losing data
         */
        skipExitTrap: {
          type: Boolean,
          value: false
        },
        /**
         * Default settings that can be overridden as needed
         */
        defaults: {
          type: Object,
          value: {
            image: {
              src: "stock.jpg",
              alt: "A beachfront deep in the heart of Alaska."
            },
            iframe: {
              src: "https://www.wikipedia.org/"
            }
          }
        },
        /**
         * Available gizmos.
         */
        gizmoList: {
          type: Array,
          value: []
        },
        /**
         * Available elements keyed by tagName and with
         * their haxProperties centrally registered.
         */
        elementList: {
          type: Object,
          value: {}
        },
        /**
         * Available apps of things supplying media / content.
         */
        appList: {
          type: Array,
          value: []
        },
        /**
         * Available hax stax which are just re-usable templates
         */
        staxList: {
          type: Array,
          value: []
        },
        /**
         * Available hax blox which are grid plate / layout elements
         */
        bloxList: {
          type: Array,
          value: []
        },
        /**
         * Global preferences that HAX can write to and
         * other elements can use to go off of.
         */
        globalPreferences: {
          type: Object,
          value: {},
          observer: "_globalPreferencesChanged"
        },
        /**
         * Globally active app, used for brokering communications
         */
        activeApp: {
          type: Object,
          value: {}
        },
        /**
         * Valid tag list, tag only and including primatives for a baseline.
         */
        validTagList: {
          type: Array,
          value: [
            "p",
            "div",
            "ol",
            "ul",
            "li",
            "a",
            "strong",
            "kbd",
            "em",
            "i",
            "b",
            "hr",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "blockquote",
            "code",
            "figure",
            "img",
            "iframe",
            "video",
            "audio",
            "section",
            "grid-plate",
            "template",
            "webview"
          ]
        },
        /**
         * Gizmo types which can be used to bridge apps to gizmos.
         */
        validGizmoTypes: {
          type: Array,
          value: [
            "data",
            "video",
            "audio",
            "text",
            "link",
            "file",
            "pdf",
            "image",
            "csv",
            "doc",
            "content",
            "text",
            "inline",
            "*"
          ]
        },
        /**
         * Sandboxed environment test
         */
        _isSandboxed: {
          type: Boolean,
          value: function() {
            let test = document.createElement("webview");
            // if this function exists it means that our deploy target
            // is in a sandboxed environment and is not able to run iframe
            // content with any real stability. This is beyond edge case but
            // as this is an incredibly useful tag we want to make sure it
            // can mutate to work in chromium and android environments
            // which support such sandboxing
            if (typeof test.reload === "function") {
              return true;
            }
            return false;
          }
        },
        /**
         * Internal app store data property after request
         */
        __appStoreData: {
          type: Object
        },
        __ready: {
          type: Boolean
        },
        voiceCommands: {
          type: Object
        },
        /**
         * Support for deploy specific rewriting for things like JWTs
         */
        connectionRewrites: {
          type: Object,
          value: {}
        }
      },
      super.properties
    );
  }
  /**
   * Local storage data changed; callback to store this data in user storage
   */
  _storageDataChanged(newValue) {
    if (newValue && window.HaxStore.ready && this.__storageDataProcessed) {
      if (window.localStorage.getItem("haxConfirm")) {
        window.localStorage.setItem("haxUserData", JSON.stringify(newValue));
      } else if (window.sessionStorage.getItem("haxConfirm")) {
        window.sessionStorage.setItem("haxUserData", JSON.stringify(newValue));
      }
    }
  }
  /**
   * If this is a text node or not so we know if the inline context
   * operations are valid.
   */
  isTextElement(node) {
    if (
      node != null &&
      this.validTagList.includes(node.tagName.toLowerCase())
    ) {
      if (
        [
          "p",
          "ol",
          "ul",
          "li",
          "a",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "span",
          "i",
          "bold",
          "em",
          "strong",
          "blockquote",
          "code",
          "figure"
        ].includes(node.tagName.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * test for being a valid grid plate, li is here because
   * nested lists make this really complicated
   */
  isGridPlateElement(node) {
    let tag = node.tagName.toLowerCase();
    if (this.validTagList.includes(tag)) {
      if (
        [
          "p",
          "ol",
          "ul",
          "li",
          "div",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "blockquote",
          "code",
          "figure",
          "grid-plate"
        ].includes(tag)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Notice _appStore changed.
   */
  _appStoreChanged(newValue, oldValue) {
    // if we have an endpoint defined, pull it
    if (typeof newValue !== typeof undefined && newValue != null) {
      // support having the request or remote loading
      // depending on the integration type
      if (typeof newValue.apps === typeof undefined) {
        this.shadowRoot.querySelector("#appstore").generateRequest();
      } else {
        // directly injected json object into the DOM, allow some time to propagate data
        // otherwise we might not have a haxAutoloader object ready in time for the paint
        setTimeout(() => {
          this.__appStoreData = newValue;
        }, 500);
      }
    }
  }

  /**
   * Load and attach items from the app store.
   */
  _loadAppStoreData(ready, appDataResponse, haxAutoloader) {
    if (
      ready &&
      typeof appDataResponse !== typeof undefined &&
      appDataResponse != null
    ) {
      var items = {};
      // autoload elements
      if (typeof appDataResponse.autoloader !== typeof undefined) {
        // ensure the list is in the right order so we can async dynamic imports
        // regardless of if its an array or object of values in the right format
        // force this to be an object
        appDataResponse.autoloader = Object.assign(
          {},
          appDataResponse.autoloader
        );
        for (var i in appDataResponse.autoloader) {
          let CEname = i;
          let CEimport = appDataResponse.autoloader[i];
          // helps support array or object based appstore
          // array was originally in the standard so this lets us support both
          if (!isNaN(CEname)) {
            CEname = appDataResponse.autoloader[i];
            CEimport = `@lrnwebcomponents/${CEname}/${CEname}.js`;
          }
          // force this into the valid tag list so early paints will
          // correctly include the tag without filtering it out incorrectly
          this.push("validTagList", CEname);
          items[CEname] = CEimport;
        }
      }
      // load apps automatically
      if (typeof appDataResponse.apps !== typeof undefined) {
        var apps = appDataResponse.apps;
        for (var i = 0; i < apps.length; i++) {
          let app = document.createElement("hax-app");
          app.data = apps[i];
          // see if anything coming across claims to be a backend for adding items
          // and then enable the upload button
          if (apps[i].connection.operations.add) {
            window.HaxStore.write("canSupportUploads", true, this);
          }
          window.HaxStore.instance.appendChild(app);
        }
      }
      // load in stax dynamically
      if (typeof appDataResponse.stax !== typeof undefined) {
        var staxs = appDataResponse.stax;
        for (var i = 0; i < staxs.length; i++) {
          let stax = document.createElement("hax-stax");
          stax.data = staxs[i];
          window.HaxStore.instance.appendChild(stax);
        }
      }
      // load in blox dynamically
      if (typeof appDataResponse.blox !== typeof undefined) {
        var bloxs = appDataResponse.blox;
        for (var i = 0; i < bloxs.length; i++) {
          let blox = document.createElement("hax-blox");
          blox.data = bloxs[i];
          window.HaxStore.instance.appendChild(blox);
        }
      }
      this.dispatchEvent(
        new CustomEvent("hax-store-app-store-loaded", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true
        })
      );
      // now process the dynamic imports
      this._handleDynamicImports(items, haxAutoloader);
    }
  }
  /**
   * Handle all the dynamic imports of things told to autoload
   * This ensures we get the definitions very quickly as far as
   * what is a safe / valid tag above but then we import in a way
   * that allows us to correctly associate the hax schema to where
   * it came from.
   */
  async _handleDynamicImports(items, haxAutoloader) {
    const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
    for (var i in items) {
      await import(`${basePath}../../../${items[i]}`)
        .then(response => {
          for (var cVal in response) {
            // get the custom element definition we used to add that file
            let CEClass = response[cVal];
            if (typeof CEClass.getHaxProperties === "function") {
              this.setHaxProperties(CEClass.getHaxProperties(), i);
            } else if (typeof CEClass.HAXWiring === "function") {
              this.setHaxProperties(CEClass.HAXWiring.getHaxProperties(), i);
            } else if (CEClass.haxProperties) {
              this.setHaxProperties(CEClass.haxProperties, i);
            } else {
              // this is the less optimized / legacy polymer element method to inlcude
              // this item. It's a good reason to skip on this though because you'll
              // have a faster boot up time with newer ES6 methods then previous ones.
              dom(haxAutoloader).appendChild(document.createElement(i));
            }
          }
        })
        .catch(error => {
          /* Error handling */
          console.log(error);
        });
    }
  }
  _editModeChanged(newValue) {
    if (newValue && this.globalPreferences.haxVoiceCommands) {
      this.shadowRoot.querySelector("#hal").auto = true;
    } else {
      this.shadowRoot.querySelector("#hal").auto = false;
    }
  }
  _globalPreferencesChanged(newValue, oldValue) {
    // regardless of what it is, reflect it globally but only after setup
    if (
      this.__storageDataProcessed &&
      newValue &&
      typeof newValue.haxVoiceCommands !== typeof undefined &&
      window.HaxStore.ready
    ) {
      let storageData = this.storageData;
      storageData.globalPreferences = newValue;
      this.set("storageData", {});
      this.set("storageData", storageData);
      if (newValue.haxVoiceCommands && this.editMode) {
        this.shadowRoot.querySelector("#hal").auto = true;
      } else {
        this.shadowRoot.querySelector("#hal").auto = false;
      }
    }
  }
  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    // notice hax property definitions coming from anywhere
    window.removeEventListener(
      "hax-register-properties",
      this._haxStoreRegisterProperties.bind(this)
    );
    // app registration can come in automatically from app-stores
    // or through direct definition in the DOM
    document.body.removeEventListener(
      "hax-register-app",
      this._haxStoreRegisterApp.bind(this)
    );
    // register stax which are groupings of haxElements
    document.body.removeEventListener(
      "hax-register-stax",
      this._haxStoreRegisterStax.bind(this)
    );
    // register blox which are grid plate configurations
    // with lots of sane visual defaults
    document.body.removeEventListener(
      "hax-register-blox",
      this._haxStoreRegisterBlox.bind(this)
    );
    // register the pieces of the body of what we call HAX
    // think of this like the core of the system required
    // to do anything like have buttons or state management

    // write data to the store
    document.body.removeEventListener(
      "hax-store-write",
      this._writeHaxStore.bind(this)
    );
    // register the manager panel / modal
    document.body.removeEventListener(
      "hax-register-manager",
      this._haxStoreRegisterManager.bind(this)
    );
    // register the autoloader area for elements
    document.body.removeEventListener(
      "hax-register-autoloader",
      this._haxStoreRegisterAutoloader.bind(this)
    );
    // register a body, kind of a big deal
    document.body.removeEventListener(
      "hax-register-body",
      this._haxStoreRegisterBody.bind(this)
    );
    // register the interaction panel / menu
    document.body.removeEventListener(
      "hax-register-panel",
      this._haxStoreRegisterPanel.bind(this)
    );
    // register the app picker for contextual setting / option
    document.body.removeEventListener(
      "hax-register-app-picker",
      this._haxStoreRegisterAppPicker.bind(this)
    );
    // stax modal
    document.body.removeEventListener(
      "hax-register-stax-picker",
      this._haxStoreRegisterStaxPicker.bind(this)
    );
    // blox modal
    document.body.removeEventListener(
      "hax-register-blox-picker",
      this._haxStoreRegisterBloxPicker.bind(this)
    );
    // preferences modal
    document.body.removeEventListener(
      "hax-register-preferences",
      this._haxStoreRegisterPreferences.bind(this)
    );
    // export modal
    document.body.removeEventListener(
      "hax-register-export",
      this._haxStoreRegisterExport.bind(this)
    );

    // notice content insert and help it along to the body
    document.body.removeEventListener(
      "hax-insert-content",
      this._haxStoreInsertContent.bind(this)
    );
    document.body.removeEventListener(
      "hax-insert-content-array",
      this._haxStoreInsertMultiple.bind(this)
    );
    window.removeEventListener(
      "hax-add-voice-command",
      this._addVoiceCommand.bind(this)
    );
    // capture events and intercept them globally
    window.removeEventListener(
      "onbeforeunload",
      this._onBeforeUnload.bind(this)
    );
    window.removeEventListener(
      "hax-consent-tap",
      this._haxConsentTap.bind(this)
    );
    window.removeEventListener("paste", this._onPaste.bind(this));
    // send that hax store is ready to go so now we can setup the rest
    this.dispatchEvent(
      new CustomEvent("hax-store-ready", {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: false
      })
    );
    window.HaxStore.ready = false;
    super.disconnectedCallback();
  }
  /**
   * This only send if they consented to storage of data locally
   */
  _haxConsentTap(e) {
    // store for future local storage usage
    window.localStorage.setItem("haxConfirm", true);
    // most likely nothing but set it anyway
    window.localStorage.setItem(
      "haxUserData",
      JSON.stringify(this.storageData)
    );
  }
  /**
   * ready life cycle
   */
  ready() {
    super.ready();
    afterNextRender(this, function() {
      // see if a global was used to prevent this check
      // this is useful when in trusted environments where the statement
      // has been consented to in the application this is utilized in
      if (this.skipHAXConfirmation) {
        window.sessionStorage.setItem("haxConfirm", true);
        window.localStorage.setItem("haxConfirm", true);
      }
      // check for local storage object
      // if not, then store it in sessionStorage so that all our checks
      // and balances are the same. This could allow for storing these
      // settings on a server in theory
      let haxConfirm =
        window.sessionStorage.getItem("haxConfirm") ||
        window.localStorage.getItem("haxConfirm");
      if (!haxConfirm) {
        // this way it isn't shown EVERY reload, but if they didn't confirm
        // it will show up in the future
        window.sessionStorage.setItem("haxConfirm", true);
        let msg = `
      The HAX content editor keeps preferences in order to improve your experience.
      This data is stored in your browser and is never sent anywhere.
      Click to accept.
      `;
        window.HaxStore.toast(
          msg,
          "-1",
          "fit-bottom",
          "I Accept",
          "hax-consent-tap"
        );
      } else {
        if (
          window.sessionStorage.getItem("haxConfirm") &&
          !window.localStorage.getItem("haxConfirm")
        ) {
          // verify there is something there
          try {
            let globalData = window.sessionStorage.getItem("haxUserData")
              ? JSON.parse(window.sessionStorage.getItem("haxUserData"))
              : {};
            this.set("storageData", globalData);
          } catch (e) {}
        } else {
          try {
            let globalData = window.localStorage.getItem("haxUserData")
              ? JSON.parse(window.localStorage.getItem("haxUserData"))
              : {};
            this.set("storageData", globalData);
          } catch (e) {}
        }
      }
    });
  }
  /**
   * attached.
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      // capture events and intercept them globally
      window.addEventListener(
        "hax-consent-tap",
        this._haxConsentTap.bind(this)
      );
      window.addEventListener(
        "onbeforeunload",
        this._onBeforeUnload.bind(this)
      );
      window.addEventListener("paste", this._onPaste.bind(this));
      // set this global flag so we know it's safe to start trusting data
      // that is written to global preferences / storage bin
      setTimeout(() => {
        this.__storageDataProcessed = true;
        if (this.storageData.globalPreferences) {
          window.HaxStore.write(
            "globalPreferences",
            this.storageData.globalPreferences,
            this
          );
        }
      }, 325);
    });
  }
  _storePiecesAllHere(
    haxAutoloader,
    activeHaxBody,
    haxPanel,
    haxToast,
    haxExport,
    haxPreferences,
    haxManager,
    haxStaxPicker,
    haxAppPicker
  ) {
    if (
      !this.__ready &&
      activeHaxBody &&
      haxAutoloader &&
      haxPanel &&
      haxToast &&
      haxExport &&
      haxPreferences &&
      haxManager &&
      haxStaxPicker &&
      haxAppPicker
    ) {
      // send that hax store is ready to go so now we can setup the rest
      this.dispatchEvent(
        new CustomEvent("hax-store-ready", {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: true
        })
      );
      window.HaxStore.ready = true;
      this.__ready = true;
      // register built in primitive definitions
      this._buildPrimitiveDefinitions();
      // initialize voice commands
      this.voiceCommands = this._initVoiceCommands();
    }
  }
  /**
   * Build a list of common voice commands
   */
  _initVoiceCommands() {
    var commands = {};
    commands[
      `${this.shadowRoot.querySelector("#hal").respondsTo} scroll up`
    ] = () => {
      window.scrollBy({
        top: -(window.innerHeight * 0.5),
        left: 0,
        behavior: "smooth"
      });
    };
    commands[
      `${this.shadowRoot.querySelector("#hal").respondsTo} scroll (down)`
    ] = () => {
      window.scrollBy({
        top: window.innerHeight * 0.5,
        left: 0,
        behavior: "smooth"
      });
    };
    commands[
      `hey ${this.shadowRoot.querySelector("#hal").respondsTo}`
    ] = () => {
      this.shadowRoot.querySelector("#hal").speak("Yeah what do you want");
    };
    commands[
      `${this.shadowRoot.querySelector("#hal").respondsTo} find media`
    ] = () => {
      window.HaxStore.write("activeHaxElement", {}, window.HaxStore.instance);
      window.HaxStore.instance.haxManager.resetManager(1);
      window.HaxStore.instance.haxManager.toggleDialog(false);
    };
    return commands;
  }
  /**
   * allow uniform method of adding voice commands
   */
  addVoiceCommand(command) {
    this.push("voiceCommands", command);
    this.notifyPath("voiceCommands.*");
  }
  /**
   * event driven version
   */
  _addVoiceCommand(e) {
    this.addVoiceCommand(e.detail);
  }
  /**
   * Before the browser closes / changes paths, ask if they are sure they want to leave
   */
  _onBeforeUnload(e) {
    // ensure we don't leave DURING edit mode
    if (
      !window.HaxStore.instance.skipExitTrap &&
      window.HaxStore.instance.editMode
    ) {
      return "Are you sure you want to leave? Your work will not be saved!";
    }
  }
  /**
   * Intercept paste event and clean it up before inserting the contents
   */
  _onPaste(e) {
    // only perform this on a text element that is active
    if (
      window.HaxStore.instance.isTextElement(
        window.HaxStore.instance.activeNode
      ) &&
      !window.HaxStore.instance.haxManager.opened
    ) {
      e.preventDefault();
      let text = "";
      // intercept paste event
      if (e.clipboardData || e.originalEvent.clipboardData) {
        text = (e.originalEvent || e).clipboardData.getData("text/plain");
      } else if (window.clipboardData) {
        text = window.clipboardData.getData("Text");
      }
      // find the correct selection object
      let sel = window.HaxStore.getSelection();
      var range;
      if ((range = window.HaxStore.getRange())) {
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
      }
    }
  }
  /**
   * Created life-cycle to ensure a single global store.
   */
  constructor() {
    super();
    import("@lrnwebcomponents/hal-9000/hal-9000.js");
    setPassiveTouchGestures(true);
    // claim the instance spot. This way we can easily
    // be referenced globally
    if (window.HaxStore.instance == null) {
      window.HaxStore.instance = this;
    }
    this.haxToast = window.SimpleToast.requestAvailability();
    // notice hax property definitions coming from anywhere
    window.addEventListener(
      "hax-register-properties",
      this._haxStoreRegisterProperties.bind(this)
    );
    // app registration can come in automatically from app-stores
    // or through direct definition in the DOM
    document.body.addEventListener(
      "hax-register-app",
      this._haxStoreRegisterApp.bind(this)
    );
    // register stax which are groupings of haxElements
    document.body.addEventListener(
      "hax-register-stax",
      this._haxStoreRegisterStax.bind(this)
    );
    // register blox which are grid plate configurations
    // with lots of sane visual defaults
    document.body.addEventListener(
      "hax-register-blox",
      this._haxStoreRegisterBlox.bind(this)
    );
    // register the pieces of the body of what we call HAX
    // think of this like the core of the system required
    // to do anything like have buttons or state management

    // write data to the store
    document.body.addEventListener(
      "hax-store-write",
      this._writeHaxStore.bind(this)
    );
    // register the manager panel / modal
    document.body.addEventListener(
      "hax-register-manager",
      this._haxStoreRegisterManager.bind(this)
    );
    // register the autoloader area for elements
    document.body.addEventListener(
      "hax-register-autoloader",
      this._haxStoreRegisterAutoloader.bind(this)
    );
    // register a body, kind of a big deal
    document.body.addEventListener(
      "hax-register-body",
      this._haxStoreRegisterBody.bind(this)
    );
    // register the interaction panel / menu
    document.body.addEventListener(
      "hax-register-panel",
      this._haxStoreRegisterPanel.bind(this)
    );
    // register the app picker for contextual setting / option
    document.body.addEventListener(
      "hax-register-app-picker",
      this._haxStoreRegisterAppPicker.bind(this)
    );
    // stax modal
    document.body.addEventListener(
      "hax-register-stax-picker",
      this._haxStoreRegisterStaxPicker.bind(this)
    );
    // blox modal
    document.body.addEventListener(
      "hax-register-blox-picker",
      this._haxStoreRegisterBloxPicker.bind(this)
    );
    // preferences modal
    document.body.addEventListener(
      "hax-register-preferences",
      this._haxStoreRegisterPreferences.bind(this)
    );
    // export modal
    document.body.addEventListener(
      "hax-register-export",
      this._haxStoreRegisterExport.bind(this)
    );

    // notice content insert and help it along to the body
    document.body.addEventListener(
      "hax-insert-content",
      this._haxStoreInsertContent.bind(this)
    );
    document.body.addEventListener(
      "hax-insert-content-array",
      this._haxStoreInsertMultiple.bind(this)
    );
    window.addEventListener(
      "hax-add-voice-command",
      this._addVoiceCommand.bind(this)
    );
    document.body.style.setProperty("--hax-ui-headings", "#d4ff77");
  }

  /**
   * Build HAX property definitions for primitives that we support.
   */
  _buildPrimitiveDefinitions() {
    // sandboxes need a webview definition
    // we don't want people making them but we need to
    // know how to edit them if asked
    if (window.HaxStore.instance._isSandboxed) {
      let webview = {
        canScale: true,
        canPosition: true,
        canEditSource: false,
        settings: {
          quick: [
            {
              attribute: "src",
              title: "Source",
              description: "The URL for this video.",
              inputMethod: "textfield",
              icon: "link",
              required: true,
              validationType: "url"
            }
          ],
          configure: [
            {
              attribute: "src",
              title: "Source",
              description: "The URL for this video.",
              inputMethod: "textfield",
              icon: "link",
              required: true,
              validationType: "url"
            }
          ],
          advanced: []
        }
      };
      this.setHaxProperties(webview, "webview");
    }
    let iframe = {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Basic iframe",
        description: "A basic iframe",
        icon: "icons:fullscreen",
        color: "grey",
        groups: ["Content"],
        handles: [
          {
            type: "link",
            source: "src",
            height: "height",
            width: "width"
          }
        ],
        meta: {
          author: "W3C"
        }
      },
      settings: {
        quick: [
          {
            attribute: "src",
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          }
        ],
        configure: [
          {
            attribute: "src",
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(iframe, "iframe");
    let img = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Image",
        description: "A basic img tag",
        icon: "image:image",
        color: "grey",
        groups: ["Image", "Media"],
        handles: [
          {
            type: "link",
            source: "src"
          },
          {
            type: "image",
            source: "src",
            height: "height",
            width: "width"
          }
        ],
        meta: {
          author: "W3C"
        }
      },
      settings: {
        quick: [
          {
            attribute: "src",
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            attribute: "alt",
            title: "Alt text",
            description: "Useful for screen readers and improved SEO.",
            inputMethod: "alt",
            icon: "accessibility"
          },
          {
            attribute: "height",
            title: "Height",
            description: "height in pixels of the item",
            inputMethod: "textfield",
            icon: "icons:swap-vert"
          },
          {
            attribute: "width",
            title: "Width",
            description: "width in pixels of the item",
            inputMethod: "textfield",
            icon: "icons:swap-horiz"
          }
        ],
        configure: [
          {
            attribute: "src",
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "haxupload",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            attribute: "alt",
            title: "Alt text",
            description: "Useful for screen readers and improved SEO.",
            inputMethod: "alt",
            icon: "accessibility"
          },
          {
            attribute: "height",
            title: "Height",
            description: "height in pixels of the item",
            inputMethod: "textfield",
            icon: "icons:swap-vert"
          },
          {
            attribute: "width",
            title: "Width",
            description: "width in pixels of the item",
            inputMethod: "textfield",
            icon: "icons:swap-horiz"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(img, "img");
    let ahref = {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Basic link",
        description: "A basic a tag",
        icon: "icons:link",
        color: "grey",
        groups: ["Link"],
        handles: [
          {
            type: "link",
            source: "href",
            title: "innerText",
            alt: "title"
          }
        ],
        meta: {
          author: "W3C"
        }
      },
      settings: {
        quick: [
          {
            attribute: "href",
            title: "Link",
            description: "The URL for this video.",
            inputMethod: "textfield",
            icon: "icons:link",
            required: true,
            validationType: "url"
          },
          {
            attribute: "title",
            title: "Title text",
            description: "Useful for screen readers and improved SEO.",
            inputMethod: "textfield",
            icon: "icons:accessibility"
          }
        ],
        configure: [
          {
            attribute: "innerText",
            title: "Text",
            description: "Text of the link",
            inputMethod: "textfield",
            required: true
          },
          {
            attribute: "href",
            title: "Link",
            description: "The URL for this video.",
            inputMethod: "haxupload",
            icon: "icons:link",
            required: true,
            validationType: "url"
          },
          {
            attribute: "title",
            title: "Title text",
            description: "Useful for screen readers and improved SEO.",
            inputMethod: "textfield",
            icon: "icons:accessibility"
          },
          {
            attribute: "target",
            title: "Target",
            description: "Where to place the link.",
            inputMethod: "select",
            icon: "icons:launch",
            options: {
              "": "Same window",
              _blank: "New window",
              _top: "Top window",
              _parent: "Parent window"
            }
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(ahref, "a");
    let p = {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      settings: {
        quick: [],
        configure: [],
        advanced: []
      }
    };
    this.setHaxProperties(p, "p");
    let hr = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      settings: {
        quick: [],
        configure: [],
        advanced: []
      }
    };
    this.setHaxProperties(hr, "hr");
    this.setHaxProperties(CodeSample.haxProperties, CodeSample.tag);
  }

  /**
   * Set the haxManager node so we can interface with it.
   * This also allows for using a different manager that supplies
   * the same functions if that would be desired at some point.
   */
  _haxStoreRegisterManager(e) {
    if (e.detail && typeof this.haxManager === typeof undefined) {
      this.haxManager = e.detail;
    }
  }

  /**
   * Register autoloader so we can ship to it from app-store spec
   */
  _haxStoreRegisterAutoloader(e) {
    if (e.detail && typeof this.haxAutoloader === typeof undefined) {
      this.haxAutoloader = e.detail;
    }
  }

  /**
   * Set the appPicker node so we can interface with it.
   * This helps with picking between multiple options when we need the user
   * to decide between a sub-set of options
   */
  _haxStoreRegisterAppPicker(e) {
    if (e.detail && typeof this.haxAppPicker === typeof undefined) {
      this.haxAppPicker = e.detail;
    }
  }

  /**
   * Set the stax picker so that we have an element in charge
   * of the listing of available stax.
   */
  _haxStoreRegisterStaxPicker(e) {
    if (e.detail && typeof this.haxStaxPicker === typeof undefined) {
      this.haxStaxPicker = e.detail;
    }
  }

  /**
   * Set the blox picker so that we have an element in charge
   * of the listing of available blox.
   */
  _haxStoreRegisterBloxPicker(e) {
    if (e.detail && typeof this.haxBloxPicker === typeof undefined) {
      this.haxBloxPicker = e.detail;
    }
  }

  /**
   * Close all drawers
   */
  closeAllDrawers(active = false) {
    // walk all drawers, close everything
    // except active. This also will allow them
    // to close everything then.
    let drawers = [
      "haxManager",
      "haxBloxPicker",
      "haxStaxPicker",
      "haxPreferences",
      "haxExport"
    ];
    for (var i in drawers) {
      if (active === this[drawers[i]]) {
        active.open();
        if (drawers[i] === "haxManager") {
          setTimeout(() => {
            if (
              active.querySelector("#activepage .iron-selected paper-input") !=
              null
            ) {
              active
                .querySelector("#activepage .iron-selected paper-input")
                .focus();
            }
          }, 325);
        } else {
          setTimeout(() => {
            if (
              active.querySelector(
                "paper-checkbox,paper-input,textarea,paper-button"
              ) != null
            ) {
              active
                .querySelector(
                  "paper-checkbox,paper-input,textarea,paper-button"
                )
                .focus();
            }
          }, 325);
        }
      } else {
        this[drawers[i]].close();
      }
    }
  }

  /**
   * Insert content in the body.
   */
  _haxStoreInsertContent(e) {
    if (e.detail) {
      var properties = {};
      // support for properties to be set automatically optionally
      if (typeof e.detail.properties !== typeof undefined) {
        properties = e.detail.properties;
      }
      // ensure better UX for text based operations
      this.activeHaxBody.__activeHover = null;
      // invoke insert or replacement on body, same function so it's easier to trace
      if (e.detail.replace && e.detail.replacement) {
        let node = window.HaxStore.haxElementToNode(
          e.detail.tag,
          e.detail.content,
          properties
        );
        if (this.activeNode !== this.activeContainerNode) {
          this.activeHaxBody.haxReplaceNode(
            this.activeNode,
            node,
            this.activeContainerNode
          );
        } else {
          this.activeHaxBody.haxReplaceNode(this.activeNode, node);
        }
      } else if (
        typeof e.detail.__type !== typeof undefined &&
        e.detail.__type === "inline"
      ) {
        let node = window.HaxStore.haxElementToNode(
          e.detail.tag,
          e.detail.content,
          properties
        );
        // replace what WAS the active selection w/ this new node
        if (this.activePlaceHolder !== null) {
          this.activePlaceHolder.deleteContents();
          this.activePlaceHolder.insertNode(node);
        }
        // set it to nothing
        this.activePlaceHolder = null;
      } else {
        this.activeHaxBody.haxInsert(
          e.detail.tag,
          e.detail.content,
          properties
        );
      }
    }
  }
  /**
   * Optional send array, to improve performance and event bubbling better
   */
  _haxStoreInsertMultiple(e) {
    if (e.detail) {
      var properties;
      for (var i in e.detail) {
        properties = {};
        // support for properties to be set automatically optionally
        if (typeof e.detail[i].properties !== typeof undefined) {
          properties = e.detail[i].properties;
        }
        this.activeHaxBody.haxInsert(
          e.detail[i].tag,
          e.detail[i].content,
          properties,
          false
        );
      }
      setTimeout(() => {
        this.activeHaxBody.breakUpdateLock();
      }, 300);
    }
  }

  /**
   * Set the activeHaxBody and add to the list so we know what to insert into.
   */
  _haxStoreRegisterBody(e) {
    if (e.detail) {
      this.haxBodies.push(e.detail);
      // default active the whatever is last here
      this.activeHaxBody = e.detail;
      // needed so that higher order things can respond to us having a body
      window.HaxStore.write("activeHaxBody", this.activeHaxBody, this);
      window.HaxStore.write("editMode", this.editMode, this);
    }
  }

  /**
   * Set the haxPanel so we know what to insert into.
   */
  _haxStoreRegisterPanel(e) {
    if (e.detail && typeof this.haxPanel === typeof undefined) {
      this.haxPanel = e.detail;
    }
  }
  /**
   * Set the haxExport so we know who to call for exporting
   */
  _haxStoreRegisterExport(e) {
    if (e.detail && typeof this.haxExport === typeof undefined) {
      this.haxExport = e.detail;
    }
  }

  /**
   * Set the haxPreferences so we know what has global preferences
   */
  _haxStoreRegisterPreferences(e) {
    if (e.detail && typeof this.haxPreferences === typeof undefined) {
      this.haxPreferences = e.detail;
    }
  }

  /**
   * Feature detect on the bar.
   */
  computePolyfillSafe() {
    /**
     * These are our bad actors in polyfill'ed browsers.
     * This means that https://github.com/webcomponents/webcomponentsjs/commit/ce464bb533bf39b544c312906499a6044ee0d30d
     * explains things but basically if shadow-dom is polyfilled
     * then we can't safely execute a DOM manipulating execCommand.
     * This
     */
    if (document.head.createShadowRoot || document.head.attachShadow) {
      return true;
    } else {
      console.log("Shadow DOM missing, certain operations hidden");
      return false;
    }
  }

  /**
   * Write store event callback.
   */
  _writeHaxStore(e) {
    // ensure we have a valid store write
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property &&
      e.detail.owner
    ) {
      if (typeof e.detail.value === "object") {
        this.set(e.detail.property, {});
      }
      this.set(e.detail.property, e.detail.value);
      this.dispatchEvent(
        new CustomEvent("hax-store-property-updated", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            property: e.detail.property,
            value: e.detail.value,
            owner: e.detail.owner
          }
        })
      );
    }
  }

  /**
   * Notice that an app was set in HAX; register it
   */
  _haxStoreRegisterApp(e) {
    if (e.detail) {
      e.detail.index = this.appList.length;
      this.push("appList", e.detail);
      window.HaxStore.write("appList", this.appList, this);
      // we don't care about this after it's launched
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-STORE"
      ) {
        dom(e.target.parentElement).removeChild(e.target);
      }
    }
  }

  /**
   * Notice that a stax was set in HAX; register it
   */
  _haxStoreRegisterStax(e) {
    if (e.detail) {
      e.detail.index = this.staxList.length;
      this.push("staxList", e.detail);
      window.HaxStore.write("staxList", this.staxList, this);
      // we don't care about this after it's launched
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-STORE"
      ) {
        dom(e.target.parentElement).removeChild(e.target);
      }
    }
  }

  /**
   * Notice that a blox was set in HAX; register it
   */
  _haxStoreRegisterBlox(e) {
    if (e.detail) {
      e.detail.index = this.bloxList.length;
      this.push("bloxList", e.detail);
      window.HaxStore.write("bloxList", this.bloxList, this);
      // we don't care about this after it's launched
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-STORE"
      ) {
        dom(e.target.parentElement).removeChild(e.target);
      }
    }
  }

  /**
   * Notice that a property off an element was set in HAX some place; register it here
   */
  _haxStoreRegisterProperties(e) {
    if (e.detail && e.detail.properties && e.detail.tag) {
      // only register tag if we don't know about it already
      if (typeof this.elementList[e.detail.tag] === typeof undefined) {
        // look for a gizmo; it's not required, technically.
        let gizmo = e.detail.properties.gizmo;
        if (gizmo) {
          gizmo.tag = e.detail.tag;
          let gizmos = this.gizmoList;
          gizmos.push(gizmo);
          window.HaxStore.write("gizmoList", gizmos, this);
        }
        this.set("elementList." + e.detail.tag, e.detail.properties);
        // only push new values on if we got something new
        if (
          !this.validTagList.find(element => {
            return element === e.detail.tag;
          })
        ) {
          this.push("validTagList", e.detail.tag);
        }
      }
      // delete this tag if it was in the autoloader as it has served it's purpose.
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-AUTOLOADER"
      ) {
        dom(this.haxAutoloader).removeChild(e.target);
      }
    }
  }
}
/**
 * Trick to write the store to the DOM if it wasn't there already.
 * This is not used yet but could be if you wanted to dynamically
 * load the store based on something else calling for it. Like
 * store lazy loading but it isn't tested.
 */
window.HaxStore = window.HaxStore || {};
window.HaxStore.instance = null;
window.HaxStore.requestAvailability = function() {
  if (!window.HaxStore.instance) {
    window.HaxStore.instance = document.createElement("hax-store");
    document.body.appendChild(window.HaxStore.instance);
  }
  return window.HaxStore.instance;
};
/**
 * Simple Array smashing function to ensure Object is array.
 */
window.HaxStore.toArray = obj => {
  return Object.keys(obj).map(function(key) {
    return obj[key];
  });
};
/**
 * Helper to convert camel case to dash; important when setting attributes.
 */
window.HaxStore.camelToDash = str => {
  return str
    .replace(/\W+/g, "-")
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .toLowerCase();
};
/**
 * Helper to convert dash to camel; important when reading attributes.
 */
window.HaxStore.dashToCamel = str => {
  return str.replace(/-([a-z])/g, function(g) {
    return g[1].toUpperCase();
  });
};
/**
 * Convert HTML into HAX Elements
 */
window.HaxStore.htmlToHaxElements = html => {
  let elements = [];
  const validTags = window.HaxStore.instance.validTagList;
  let fragment = document.createElement("div");
  fragment.innerHTML = html;
  const children = fragment.childNodes;
  // loop over the new nodes
  for (var i = 0; i < children.length; i++) {
    // verify this tag is a valid one
    if (
      typeof children[i].tagName !== typeof undefined &&
      validTags.includes(children[i].tagName.toLowerCase())
    ) {
      elements.push(window.HaxStore.nodeToHaxElement(children[i], null));
    }
  }
  return elements;
};
/**
 * Convert a node to a HAX element. Hax elements ensure
 * a certain level of sanitization by verifying tags and
 * properties / attributes that have values.
 */
window.HaxStore.nodeToHaxElement = (node, eventName = "insert-element") => {
  if (!node) {
    return null;
  }
  // build out the properties to send along
  var props = {};
  // support basic styles
  if (typeof node.style !== typeof undefined) {
    props.style = node.getAttribute("style");
  }
  // don't set a null style
  if (props.style === null || props.style === "null") {
    delete props.style;
  }
  // test if a class exists, not everything scopes
  if (typeof node.attributes.class !== typeof undefined) {
    props.class = node.attributes.class.nodeValue.replace("hax-active", "");
  }
  // test if a id exists as its a special case in attributes... of course
  if (typeof node.attributes.id !== typeof undefined) {
    props.id = node.getAttribute("id");
  }
  let tmpProps = node.properties;
  if (typeof tmpProps === typeof undefined) {
    tmpProps = node.__data;
  }
  // complex elements need complex support
  if (typeof tmpProps !== typeof undefined) {
    // run through attributes, though non-reflected props won't be here
    // run through props, we always defer to property values
    for (var property in tmpProps) {
      // make sure we only set things that have a value
      if (
        property != "class" &&
        property != "style" &&
        tmpProps.hasOwnProperty(property) &&
        typeof node[property] !== undefined &&
        node[property] != null &&
        node[property] != ""
      ) {
        props[property] = node[property];
      }
      // special support for false boolean
      else if (node[property] === false) {
        props[property] = node[property];
      } else {
      }
    }
    for (var attribute in node.attributes) {
      // make sure we only set things that have a value
      if (
        typeof node.attributes[attribute].name !== typeof undefined &&
        node.attributes[attribute].name != "class" &&
        node.attributes[attribute].name != "style" &&
        node.attributes[attribute].name != "id" &&
        node.attributes.hasOwnProperty(attribute) &&
        typeof node.attributes[attribute].value !== undefined &&
        node.attributes[attribute].value != null &&
        node.attributes[attribute].value != "" &&
        !tmpProps.hasOwnProperty(
          window.HaxStore.dashToCamel(node.attributes[attribute].name)
        )
      ) {
        props[window.HaxStore.dashToCamel(node.attributes[attribute].name)] =
          node.attributes[attribute].value;
      } else {
        // note: debug here if experiencing attributes that won't bind
      }
    }
  } else {
    // much easier case, usually just in primatives
    for (var attribute in node.attributes) {
      // make sure we only set things that have a value
      if (
        typeof node.attributes[attribute].name !== typeof undefined &&
        node.attributes[attribute].name != "class" &&
        node.attributes[attribute].name != "style" &&
        node.attributes[attribute].name != "id" &&
        node.attributes.hasOwnProperty(attribute) &&
        typeof node.attributes[attribute].value !== undefined &&
        node.attributes[attribute].value != null &&
        node.attributes[attribute].value != ""
      ) {
        props[window.HaxStore.dashToCamel(node.attributes[attribute].name)] =
          node.attributes[attribute].value;
      }
    }
  }
  // support sandboxed environments which
  // will hate iframe tags but love webview
  let tag = node.tagName.toLowerCase();
  if (window.HaxStore.instance._isSandboxed && tag === "iframe") {
    tag = "webview";
  }
  let slotContent = window.HaxStore.getHAXSlot(node);
  // special edge case for slot binding in primatives
  if (tag === "a") {
    props.innerText = slotContent;
  } else if (tag === "p" || tag === "ol" || tag === "ul" || tag === "div") {
    props.innerHTML = slotContent;
  }
  let element = {
    tag: tag,
    properties: props,
    content: slotContent
  };

  if (eventName !== null) {
    element.eventName = eventName;
  }
  return element;
};
/**
 * Convert a haxElement to a DOM node.
 */
window.HaxStore.haxElementToNode = (tag, content, properties) => {
  // support sandboxed environments which
  // will hate iframe tags but love webview
  if (window.HaxStore.instance._isSandboxed && tag === "iframe") {
    tag = "webview";
  }
  var frag = document.createElement(tag);
  frag.innerHTML = content;
  // clone the fragment which will force an escalation to full node
  var newNode = frag.cloneNode(true);

  // support for properties if they exist
  for (var property in properties) {
    let attributeName = window.HaxStore.camelToDash(property);
    if (properties.hasOwnProperty(property)) {
      // special supporting for boolean because html is weird :p
      if (properties[property] === true) {
        newNode.setAttribute(attributeName, properties[property]);
      } else if (properties[property] === false) {
        newNode.removeAttribute(attributeName);
      } else if (
        properties[property] != null &&
        properties[property].constructor === Array
      ) {
        // do nothing if we have additional data to suggest this is actually readOnly
        // polymer / typed specific thing
        if (
          frag.properties &&
          frag.properties[property] &&
          frag.properties[property].readOnly
        ) {
        } else {
          newNode.set(attributeName, properties[property]);
        }
      } else if (
        properties[property] != null &&
        properties[property].constructor === Object
      ) {
        // do nothing if we have additional data to suggest this is actually readOnly
        // polymer / typed specific thing
        if (
          frag.properties &&
          frag.properties[property] &&
          frag.properties[property].readOnly
        ) {
        } else {
          newNode.set(attributeName, properties[property]);
        }
      } else {
        newNode.setAttribute(attributeName, properties[property]);
      }
    }
  }
  return newNode;
};
/**
 * Convert a node to the correct content object for saving.
 */
window.HaxStore.haxNodeToContent = node => {
  if (
    window.HaxStore.instance.activeHaxBody.globalPreferences.haxDeveloperMode
  ) {
    console.log(node);
  }
  // ensure we have access to all the member functions of the custom element
  let prototype = Object.getPrototypeOf(node);
  // support for deep API call
  if (typeof prototype.preProcessHaxNodeToContent !== typeof undefined) {
    let clone = node.cloneNode(true);
    node = prototype.preProcessHaxNodeToContent(clone);
  }
  let tag = node.tagName.toLowerCase();
  // support sandboxed environments which
  // will hate iframe tags but love webview
  if (window.HaxStore.instance._isSandboxed && tag === "webview") {
    tag = "iframe";
  }
  var content = "";
  // start to rebuild the same tag we got in a generalized way
  content += "<" + tag;
  // account for things that say NOT to save slot values
  var props = window.HaxStore.instance.elementList[tag];
  var propvals = {};
  // grab all of the original's attributes, and pass them to the replacement
  for (var j = 0, l = node.attributes.length; j < l; ++j) {
    var nodeName = node.attributes.item(j).nodeName;
    var value = node.attributes.item(j).value;
    // encode objects and arrays because they are special
    if (
      nodeName != "style" &&
      (typeof value === typeof Object || value.constructor === Array)
    ) {
      propvals[nodeName] = JSON.stringify(value).replace(
        new RegExp('"', "g"),
        "&quot;"
      );
    }
    // only write things that aren't empty
    else if (value != null && value != "null") {
      if (value === true || value === "true") {
        propvals[nodeName] = true;
      } else if (value === false) {
        // do nothing, no reason to record false unless written as text
        // in which case below will capture it
      } else {
        // ensure that value doesn't have " in it unencoded
        if (typeof value === "string" && value !== "") {
          value = value.replace(new RegExp('"', "g"), "&quot;");
          propvals[nodeName] = value;
        }
        // special handling for empty string cause it might mean boolean
        // or it might be a string
        else if (value === "") {
          if (value == "" && node.attributes.item(j).value != "") {
            value = node.attributes.item(j).value;
          }
          propvals[nodeName] = value;
        } else {
          propvals[nodeName] = value;
        }
      }
    }
  }
  // now look through properties
  if (typeof node.properties !== typeof undefined) {
    for (var j in node.properties) {
      var nodeName = window.HaxStore.camelToDash(j);
      var value = null;
      // prefer local value over properties object if possible
      if (typeof node[j] !== typeof undefined) {
        value = node[j];
      }
      // never allow read only things to recorded as they
      // are run-time creation 99% of the time
      if (!node.properties[j].readOnly && value !== node.properties[j].value) {
        // encode objects and arrays because they are special
        if (
          value != null &&
          (typeof value === typeof Object || value.constructor === Array)
        ) {
          propvals[nodeName] = JSON.stringify(value).replace(
            new RegExp('"', "g"),
            "&quot;"
          );
        }
        // only write things that aren't empty
        else if (value != null && value != "null") {
          if (value === true || value === "true") {
            propvals[nodeName] = true;
          } else if (value === false) {
            // do nothing, no reason to record false unless written as text
            // in which case below will capture it
          } else {
            // ensure that value doesn't have " in it unencoded
            if (typeof value === "string" && value !== "") {
              value = value.replace(new RegExp('"', "g"), "&quot;");
              propvals[nodeName] = value;
            }
            // special handling for empty string cause it might mean boolean
            // or it might be a string
            else if (value === "") {
              if (value == "" && node.properties[j].value != "") {
                value = node.properties[j].value;
              } else if (value === "" && node.properties[j].value == "") {
                // do nothing, the default value is empty
                // so lets record less data
              }
            } else {
              propvals[nodeName] = value;
            }
          }
        }
      }
    }
  }
  // support for tag defining which properties NOT to save
  // for simplification, everything is an attribute during this
  // operation
  if (
    typeof props !== typeof undefined &&
    typeof props.saveOptions.unsetAttributes !== typeof undefined
  ) {
    for (var i in props.saveOptions.unsetAttributes) {
      delete propvals[props.saveOptions.unsetAttributes[i]];
    }
  }
  // specialized clean up for some that can leak through from above
  // and are edge case things because #hashtag gotta love HTML attributes
  // and the webview tag. facepalm.
  let delProps = ["inner-text", "tabindex", "guestinstance"];
  for (var delProp in delProps) {
    if (typeof propvals[delProps[delProp]] !== typeof undefined) {
      delete propvals[delProps[delProp]];
    }
  }
  // remove id attribute if it's empty, somehow misses above
  if (typeof propvals.id !== typeof undefined && propvals.id === "") {
    delete propvals.id;
  }
  // run through the properties
  for (var i in propvals) {
    if (propvals[i] === true) {
      content += " " + i;
    } else {
      content += " " + i + '="' + propvals[i] + '"';
    }
  }
  // set the opening tag, support self-closing void tags
  let voidTags = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ];
  if (voidTags.includes(tag)) {
    content += "/>";
  } else {
    content += ">";
  }
  // try and work against anything NOT a P tag
  if (typeof props === typeof undefined || !props.saveOptions.wipeSlot) {
    // get content that is in the slots
    let slotnodes = dom(node).getEffectiveChildNodes();
    // ensure there's something inside of this
    if (slotnodes.length > 0) {
      // loop through everything found in the slotted area and put it back in
      for (var j = 0, len2 = slotnodes.length; j < len2; j++) {
        if (typeof slotnodes[j].tagName !== typeof undefined) {
          // if we're a custom element, keep digging, otherwise a simple
          // self append is fine unless template tag cause it's a special
          // case for the web in general as it'll register as not a primative
          // even though it is...
          if (
            !window.HaxStore.HTMLPrimativeTest(slotnodes[j].tagName) &&
            slotnodes[j].tagName !== "TEMPLATE"
          ) {
            content += window.HaxStore.haxNodeToContent(slotnodes[j]);
          } else {
            slotnodes[j].setAttribute("data-editable", false);
            slotnodes[j].removeAttribute("data-hax-ray");
            slotnodes[j].contentEditable = false;
            content += slotnodes[j].outerHTML;
          }
        }
        // keep comments with a special case since they need wrapped
        else if (slotnodes[j].nodeType === 8) {
          content += "<!-- " + slotnodes[j].textContent + " -->";
        }
        // keep everything NOT an element at this point, this helps
        // preserve whitespace because we're crazy about accuracy
        else if (
          slotnodes[j].nodeType !== 1 &&
          typeof slotnodes[j].textContent !== typeof undefined &&
          slotnodes[j].textContent !== "undefined"
        ) {
          content += slotnodes[j].textContent;
        }
      }
    }
  }
  // don't put return for span since it's an inline tag
  if (tag === "span") {
    content += "</" + tag + ">";
  } else if (tag === "hr" || tag === "br" || tag === "img") {
    // do nothing for self-closing tags they'll resolve themselves
  }
  // close the tag, placing a return in output for block elements
  else {
    content += "</" + tag + ">" + "\n";
  }
  if (
    window.HaxStore.instance.activeHaxBody.globalPreferences.haxDeveloperMode
  ) {
    console.log(content);
  }
  // support postProcess text rewriting for the node that's been
  // converted to a string for storage
  if (node.postProcesshaxNodeToContent === "function") {
    content = node.postProcesshaxNodeToContent(content);
  }
  return content;
};
/**
 * Basic HTML Primitives test
 */
window.HaxStore.HTMLPrimativeTest = node => {
  if (
    typeof node.tagName !== typeof undefined &&
    node.tagName.indexOf("-") == -1
  ) {
    return true;
  }
  return false;
};
/**
 * Slot content w/ support for custom elements in slot.
 */
window.HaxStore.getHAXSlot = node => {
  let content = "";
  var slotnodes = dom(node).children;
  // ensure there's something inside of this
  if (slotnodes.length > 0) {
    // loop through everything found in the slotted area and put it back in
    for (var j = 0, len2 = slotnodes.length; j < len2; j++) {
      if (typeof slotnodes[j].tagName !== typeof undefined) {
        // if we're a custom element, keep digging, otherwise a simple
        // self append is fine.
        if (slotnodes[j].tagName.indexOf("-") > 0) {
          content +=
            "  " + window.HaxStore.haxNodeToContent(slotnodes[j]) + "\n";
        } else {
          content += "  " + slotnodes[j].outerHTML + "\n";
        }
      }
      // keep comments with a special case since they need wrapped
      else if (slotnodes[j].nodeType === 8) {
        content += "<!-- " + slotnodes[j].textContent + " -->";
      }
      // keep everything NOT an element at this point, this helps
      // preserve whitespace because we're crazy about accuracy
      else if (
        slotnodes[j].nodeType !== 1 &&
        typeof slotnodes[j].textContent !== typeof undefined &&
        slotnodes[j].textContent !== "undefined"
      ) {
        content += slotnodes[j].textContent;
      }
    }
  }
  return content;
};
/**
 * Shortcut to standardize the write / read process.
 */
window.HaxStore.write = (prop, value, obj) => {
  obj.dispatchEvent(
    new CustomEvent("hax-store-write", {
      composed: true,
      bubbles: true,
      cancelable: false,
      detail: { property: prop, value: value, owner: obj }
    })
  );
};
/**
 * Guess the type of Gizmo when given some information about what we have.
 */
window.HaxStore.guessGizmoType = guess => {
  if (typeof guess.source !== typeof undefined) {
    if (guess.source.indexOf(".mp3") != -1) {
      return "audio";
    } else if (
      guess.source.indexOf(".png") != -1 ||
      guess.source.indexOf(".jpg") != -1 ||
      guess.source.indexOf(".jpeg") != -1 ||
      guess.source.indexOf(".gif") != -1
    ) {
      return "image";
    } else if (guess.source.indexOf(".pdf") != -1) {
      return "pdf";
    } else if (guess.source.indexOf(".svg") != -1) {
      return "svg";
    } else if (guess.source.indexOf(".csv") != -1) {
      return "csv";
    }
    // if it's external we can't assume what it actually is
    else if (
      window.HaxStore.instance.getVideoType(guess.source) != "external"
    ) {
      return "video";
    } else {
      // we don't know how to handle this so let's just
      // try ANYTHING that matches
      return "*";
    }
  }
};
/**
 * Try and guess the Gizmo based on what we were just handed
 */
window.HaxStore.guessGizmo = (guess, values, skipPropMatch = false) => {
  var matches = [];
  if (typeof guess !== typeof undefined) {
    var store = window.HaxStore.instance;
    // verify type
    if (store.validGizmoTypes.includes(guess)) {
      // now we can look through them
      // look for a match
      for (var gizmoposition in store.gizmoList) {
        var gizmo = store.gizmoList[gizmoposition];
        var props = {};
        // reset match per gizmo
        var match = false;
        if (gizmo.handles) {
          for (var i = 0; i < gizmo.handles.length; i++) {
            // WHAT!??!?!?!?!
            if (guess === gizmo.handles[i].type || (guess === "*" && !match)) {
              for (var property in gizmo.handles[i]) {
                // ignore type.. but again.. WHAT?!?!?!
                if (property !== "type") {
                  // check the values that came across to see if there's a match
                  // of any kind, we only need one but can then bind to multiple
                  if (typeof values[property] !== typeof undefined) {
                    match = true;
                    props[gizmo.handles[i][property]] = values[property];
                  }
                }
              }
              // omg... we just found a match on a property from who knows where!
              if (match || skipPropMatch) {
                matches.push(
                  window.HaxStore.haxElementPrototype(gizmo, props, "")
                );
              }
            }
          }
        }
      }
    }
  }
  return matches;
};

/**
 * Filter app store apps to those that accept this file source.
 */
window.HaxStore.getHaxAppStoreTargets = type => {
  let targets = window.HaxStore.instance.appList.filter(app => {
    if (typeof app.connection.operations.add !== typeof undefined) {
      let add = app.connection.operations.add;
      if (
        typeof add.acceptsGizmoTypes !== typeof undefined &&
        add.acceptsGizmoTypes.includes(type)
      ) {
        return true;
      }
    }
    return false;
  });
  return targets;
};

/**
 * Generate Hax Element prototype.
 */
window.HaxStore.haxElementPrototype = (gizmo, properties, content = "") => {
  return {
    tag: gizmo.tag,
    properties: properties,
    content: content,
    gizmo: gizmo
  };
};

/**
 * Wipe out the slot of an element.
 */
window.HaxStore.wipeSlot = (element, slot = "") => {
  wipeSlot(element, slot);
};
/**
 * HTML encapsulation of a string on script and style tags
 */
window.HaxStore.encapScript = html => {
  return encapScript(html);
};
/**
 * Global toast bridge so we don't have to keep writing custom event
 */
window.HaxStore.toast = (
  message,
  duration = 4000,
  classStyle = "",
  closeText = null,
  eventCallback = null
) => {
  const evt = new CustomEvent("simple-toast-show", {
    bubbles: true,
    composed: true,
    cancelable: true,
    detail: {
      text: message,
      duration: duration,
      classStyle: classStyle,
      closeText: closeText,
      eventCallback: eventCallback
    }
  });
  window.dispatchEvent(evt);
};

/**
 * Selection normalizer
 */
window.HaxStore.getSelection = () => {
  // try and obtain the selection from the nearest shadow
  // which would give us the selection object when running native ShadowDOM
  // with fallback support for the entire window which would imply Shady
  if (window.HaxStore.instance.activeHaxBody.parentNode) {
    // native API
    if (window.HaxStore.instance.activeHaxBody.parentNode.getSelection) {
      return window.HaxStore.instance.activeHaxBody.parentNode.getSelection();
    }
    // ponyfill from google
    else if (getRange(window.HaxStore.instance.activeHaxBody.parentNode)) {
      return getRange(window.HaxStore.instance.activeHaxBody.parentNode);
    }
  }
  // missed on both, hope the normal one will work
  return window.getSelection();
};
/**
 * Get a normalized range based on current selection
 */
window.HaxStore.getRange = () => {
  let sel = window.HaxStore.getSelection();
  if (sel.getRangeAt && sel.rangeCount) {
    return sel.getRangeAt(0);
  } else if (sel) {
    return sel;
  } else false;
};

window.customElements.define(HaxStore.tag, HaxStore);
export { HaxStore };
