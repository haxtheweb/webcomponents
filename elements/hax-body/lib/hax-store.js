import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  winEventsElement,
  getRange,
  encapScript,
  wipeSlot,
  stripMSWord
} from "@lrnwebcomponents/utils/utils.js";
import { HAXElement } from "@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";
/**
 * @customElement hax-store
 */
class HaxStore extends winEventsElement(HAXElement(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: none;
        }
      `
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <slot></slot>
      <undoer-element></undoer-element>
      <iron-ajax
        id="appstore"
        url="${this.appStore.url}"
        .params="${this.appStore.params}"
        method="GET"
        content-type="application/json"
        handle-as="json"
        @last-response-changed="${this.__appStoreDataChanged}"
      ></iron-ajax>
      <hal-9000
        id="hal"
        .responds-to="${this.voiceRespondsTo}"
        .debug="${this.voiceDebug}"
      ></hal-9000>
    `;
  }
  __appStoreDataChanged(e) {
    this.__appStoreData = e.detail.value;
  }
  /**
   * convention
   */
  static get tag() {
    return "hax-store";
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      openDrawer: {
        type: Object
      },
      voiceDebug: {
        type: Boolean
      },
      activeGizmo: {
        type: Object,
      },
      voiceRespondsTo: {
        type: String,
        attribute: "voice-responses-to"
      },
      /**
       * skipHAXConfirmation
       */
      skipHAXConfirmation: {
        type: Boolean,
        reflect: true,
        attribute: "skip-hax-confirmation"
      },
      /**
       * Local storage bridge
       */
      storageData: {
        type: Object
      },
      /**
       * Hax tray
       */
      haxTray: {
        type: Object
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
       * Hax stax picker element.
       */
      haxBloxPicker: {
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
        type: Array
      },
      /**
       * An active place holder item reference. This is used
       * for inline drag and drop event detection so that we
       * know what element replace in context.
       */
      activePlaceHolder: {
        type: Object
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
        type: Object
      },
      /**
       * HAX Toast message.
       */
      haxToast: {
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
        type: Object
      },
      /**
       * editMode
       */
      editMode: {
        type: Boolean
      },
      /**
       * Boolean for if this instance has backends that support uploading
       */
      canSupportUploads: {
        type: Boolean
      },
      /**
       * skip the exit trap to prevent losing data
       */
      skipExitTrap: {
        type: Boolean
      },
      /**
       * Available gizmos.
       */
      gizmoList: {
        type: Array
      },
      /**
       * Available elements keyed by tagName and with
       * their haxProperties centrally registered.
       */
      elementList: {
        type: Object
      },
      /**
       * Available apps of things supplying media / content.
       */
      appList: {
        type: Array
      },
      /**
       * Available hax stax which are just re-usable templates
       */
      staxList: {
        type: Array
      },
      /**
       * Available hax blox which are grid plate / layout elements
       */
      bloxList: {
        type: Array
      },
      /**
       * Global preferences that HAX can write to and
       * other elements can use to go off of.
       */
      globalPreferences: {
        type: Object
      },
      /**
       * Globally active app, used for brokering communications
       */
      activeApp: {
        type: Object
      },
      /**
       * Valid tag list, tag only and including primatives for a baseline.
       */
      validTagList: {
        type: Array
      },
      /**
       * Gizmo types which can be used to bridge apps to gizmos.
       */
      validGizmoTypes: {
        type: Array
      },
      /**
       * Sandboxed environment test
       */
      _isSandboxed: {
        type: Boolean
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
      /**
       * Support for deploy specific rewriting for things like JWTs
       */
      connectionRewrites: {
        type: Object
      }
    };
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
    let tag;
    // resolve HAXelements vs nodes
    if (node != null && node.tagName) {
      tag = node.tagName.toLowerCase();
    } else if (node != null && node.tag) {
      tag = node.tag.toLowerCase();
    }
    if (tag && this.validTagList.includes(tag)) {
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
          "strike",
          "u",
          "b",
          "sub",
          "sup",
          "span",
          "i",
          "bold",
          "em",
          "strong",
          "blockquote",
          "code",
          "figure"
        ].includes(tag)
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
    let tag;
    // resolve HAXelements vs nodes
    if (node && node.tagName) {
      tag = node.tagName.toLowerCase();
    } else if (node && node.tag) {
      tag = node.tag.toLowerCase();
    }
    if (tag && this.validTagList.includes(tag)) {
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
    if (
      typeof newValue !== typeof undefined &&
      newValue != null &&
      typeof oldValue !== typeof undefined
    ) {
      // support having the request or remote loading
      // depending on the integration type
      if (
        typeof newValue.apps === typeof undefined &&
        this.shadowRoot &&
        this.shadowRoot.querySelector("#appstore") &&
        this.shadowRoot.querySelector("#appstore").generateRequest
      ) {
        this.shadowRoot.querySelector("#appstore").generateRequest();
      } else {
        // directly injected json object into the DOM
        this.__appStoreData = newValue;
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
          // helps support array or object based app store spec
          // array was originally in the standard so this lets us support both
          if (!isNaN(CEname)) {
            CEname = appDataResponse.autoloader[i];
            CEimport = `@lrnwebcomponents/${CEname}/${CEname}.js`;
          }
          // force this into the valid tag list so early paints will
          // correctly include the tag without filtering it out incorrectly
          this.validTagList.push(CEname);
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
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  /**
   * Handle all the dynamic imports of things told to autoload
   * This ensures we get the definitions very quickly as far as
   * what is a safe / valid tag above but then we import in a way
   * that allows us to correctly associate the hax schema to where
   * it came from.
   */
  async _handleDynamicImports(items, haxAutoloader) {
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    for (var i in items) {
      // seems redundant but this can help polyfill'ed browsers
      if (!window.customElements.get(i)) {
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
                // this is the less optimized / legacy polymer element or an element
                // that did not provide an export
                haxAutoloader.appendChild(document.createElement(i));
              }
            }
          })
          .catch(error => {
            /* Error handling */
            console.warn(error);
          });
      } else {
        // get the custom element definition we used to add that file
        let CEClass = window.customElements.get(i);
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
          haxAutoloader.appendChild(document.createElement(i));
        }
      }
    }
  }
  _editModeChanged(newValue) {
    if (newValue && this.globalPreferences.haxVoiceCommands) {
      this.__hal.auto = true;
    } else {
      this.__hal.auto = false;
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
      this.storageData = storageData;
      this._storageDataChanged(this.storageData);
      if (newValue.haxVoiceCommands && this.editMode) {
        this.__hal.auto = true;
      } else {
        this.__hal.auto = false;
      }
    }
  }
  _haxContextOperation(e) {
    let detail = e.detail;
    if (this.activeNode) {
      // support a simple insert event to bubble up or everything else
      switch (detail.eventName) {
        // directional / proportion operations
        case "hax-align-left":
          this.activeNode.style.float = null;
          this.activeNode.style.margin = null;
          this.activeNode.style.display = null;
          break;
        case "hax-align-center":
          this.activeNode.style.float = null;
          this.activeNode.style.margin = "0 auto";
          this.activeNode.style.display = "block";
          break;
        case "hax-align-right":
          this.activeNode.style.float = "right";
          this.activeNode.style.margin = "0 auto";
          this.activeNode.style.display = "block";
          break;
        case "hax-size-change":
          this.activeNode.style.width = detail.value + "%";
          break;
      }
    }
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
  updated(changedProperties) {
    let loadAppStoreData = false;
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "openDrawer") {
        this.openDrawersCallback(this[propName], oldValue);
      }
      if (propName == "appStore") {
        this._appStoreChanged(this[propName], oldValue);
      }
      if (propName == "globalPreferences") {
        this._globalPreferencesChanged(this[propName], oldValue);
      }
      if (propName == "editMode") {
        this._editModeChanged(this[propName], oldValue);
      }
      if (propName == "activeNode") {
        this.activeGizmo = this._calculateActiveGizmo(this[propName]);
      }
      // composite obervation
      if (["__ready", "__appStoreData", "haxAutoloader"].includes(propName)) {
        loadAppStoreData = true;
      }
      if (
        [
          "haxAutoloader",
          "activeHaxBody",
          "haxToast",
          "haxExport",
          "haxPreferences",
          "haxAppPicker",
          "haxTray"
        ].includes(propName)
      ) {
        // allow this to verify if everything is here or not
        this._storePiecesAllHere(
          this.haxAutoloader,
          this.activeHaxBody,
          this.haxToast,
          this.haxExport,
          this.haxPreferences,
          this.haxAppPicker,
          this.haxTray
        );
      }
    });
    if (loadAppStoreData) {
      this._loadAppStoreData(
        this.__ready,
        this.__appStoreData,
        this.haxAutoloader
      );
    }
  }
  _calculateActiveGizmo(activeNode) {
    for (var gizmoposition in this.gizmoList) {
      var gizmo = this.gizmoList[gizmoposition];
      if (gizmo.tag === activeNode.tagName.toLowerCase()) {
        return gizmo;
      }
    }
  }
  /**
   * ready life cycle
   */
  firstUpdated(changedProperties) {
    import("@polymer/iron-ajax/iron-ajax.js").then(esModule => {
      if (this.shadowRoot.querySelector("#appstore")) {
        this.shadowRoot.querySelector("#appstore").generateRequest();
      }
    });
    // import voice command stuff in the background
    // @todo only activate if the setting to use it is in place
    import("@lrnwebcomponents/hal-9000/hal-9000.js").then(esModule => {
      this.__hal = this.shadowRoot.querySelector("#hal");
    });
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
    }, 100);

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
          this.storageData = globalData;
          this._storageDataChanged(this.storageData);
        } catch (e) {}
      } else {
        try {
          let globalData = window.localStorage.getItem("haxUserData")
            ? JSON.parse(window.localStorage.getItem("haxUserData"))
            : {};
          this.storageData = globalData;
          this._storageDataChanged(this.storageData);
        } catch (e) {}
      }
    }
  }
  _storePiecesAllHere(
    haxAutoloader,
    activeHaxBody,
    haxToast,
    haxExport,
    haxPreferences,
    haxAppPicker,
    haxTray
  ) {
    if (
      !this.__ready &&
      activeHaxBody &&
      haxAutoloader &&
      haxToast &&
      haxExport &&
      haxPreferences &&
      haxAppPicker &&
      haxTray
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
      this._initVoiceCommands();
      this.__hal.commands = { ...this.voiceCommands };
    }
  }
  /**
   * Build a list of common voice commands
   */
  _initVoiceCommands() {
    this.__voiceInit = true;
    this.voiceCommands[`scroll up ${this.voiceRespondsTo}`] = () => {
      window.scrollBy({
        top: -(window.innerHeight * 0.5),
        left: 0,
        behavior: "smooth"
      });
    };
    this.voiceCommands[`scroll (down) ${this.voiceRespondsTo}`] = () => {
      window.scrollBy({
        top: window.innerHeight * 0.5,
        left: 0,
        behavior: "smooth"
      });
    };
    // trolling
    this.voiceCommands[`hey ${this.voiceRespondsTo}`] = () => {
      this.__hal.speak("Yeah what do you want");
    };
    this.voiceCommands[`${this.voiceRespondsTo} close`] = () => {
      window.HaxStore.write("openDrawer", false, this);
    };
  }
  /**
   * allow uniform method of adding voice commands
   */
  addVoiceCommand(command, context, callback) {
    command = command.replace(":name:", this.voiceRespondsTo).toLowerCase();
    this.voiceCommands[command] = context[callback].bind(context);
    if (this.__voiceInit) {
      this.__hal.commands = { ...this.voiceCommands };
    }
  }
  /**
   * event driven version
   */
  _addVoiceCommand(e) {
    this.addVoiceCommand(e.detail.command, e.detail.context, e.detail.callback);
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
      )
    ) {
      let pasteContent = "";
      // intercept paste event
      if (e.clipboardData || e.originalEvent.clipboardData) {
        pasteContent = (e.originalEvent || e).clipboardData.getData(
          "text/html"
        );
      } else if (window.clipboardData) {
        pasteContent = window.clipboardData.getData("Text");
      }
      // detect word garbage
      var mswTest = pasteContent.replace(/(class=(")?Mso[a-zA-Z]+(")?)/g, "");
      let wordPaste = false;
      // the string to import as sanitized by hax
      let newContent = "";
      mswTest = mswTest.replace("mso-style-", "");
      if (pasteContent != mswTest) {
        wordPaste = true;
      }
      // clear empty span tags that can pop up
      pasteContent = pasteContent.replace(/<span>\s*?<\/span>/g, " ");
      // clean up div tags that can come in from contenteditable pastes
      // p tags make more sense in the content area
      pasteContent = pasteContent.replace(/<div/g, "<p");
      pasteContent = pasteContent.replace(/<\/div>/g, "</p>");
      // NOW we can safely handle paste from word cases
      pasteContent = stripMSWord(pasteContent);
      // edges that some things preserve empty white space needlessly
      let haxElements = window.HaxStore.htmlToHaxElements(pasteContent);
      // if interpretation as HTML fails then let's ignore this whole thing
      // as we allow normal contenteditable to handle the paste
      // we only worry about HTML structures
      if (haxElements.length === 0) {
        // wrap in a paragraph tag if there is any this ensures it correctly imports
        // as it might not have evaluated above as having elements bc of the scrubber
        if (wordPaste) {
          newContent = pasteContent;
        } else {
          return false;
        }
      }
      // account for incredibly basic pastes of single groups of characters
      else if (haxElements.length === 1 && haxElements[0].tag === "p") {
        return false;
      }
      // account for broken pastes in resolution, just let browser handle it
      else if (!this.isGridPlateElement(haxElements[0])) {
        return false;
      } else {
        for (var i in haxElements) {
          // special traps for word / other styles bleeding through
          delete haxElements[i].properties.style;
          delete haxElements[i].properties.start;
          delete haxElements[i].properties.align;
          // this is not the right function.
          let node = window.HaxStore.haxElementToNode(
            haxElements[i].tag,
            haxElements[i].content.replace(/<span>&nbsp;<\/span>/g, " ").trim(),
            haxElements[i].properties
          );
          newContent += window.HaxStore.nodeToContent(node);
        }
      }
      // if we got here then we have HTML structures to pull together
      // this ensures that the below works out
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      try {
        // get the range that's active and selection
        let range = window.HaxStore.getRange();
        let sel = window.HaxStore.getSelection();
        // tee up a wrapper so we can walk and put every element in
        let newNodes = document.createElement("div");
        newNodes.innerHTML = newContent;
        if (range && sel && typeof range.deleteContents === "function") {
          range.deleteContents();
          while (newNodes.lastChild) {
            range.insertNode(newNodes.lastChild);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }
  __validTags() {
    return [
      "p",
      "div",
      "span",
      "table",
      "caption",
      "sup",
      "sub",
      "u",
      "strike",
      "tr",
      "th",
      "td",
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
    ];
  }
  __validGizmoTypes() {
    return [
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
      "archive",
      "markdown",
      "html",
      "wikipedia",
      "content",
      "text",
      "inline",
      "*"
    ];
  }
  /**
   * Created life-cycle to ensure a single global store.
   */
  constructor() {
    super();
    this.__winEvents = {
      "hax-register-properties": "_haxStoreRegisterProperties",
      "hax-consent-tap": "_haxConsentTap",
      "hax-context-item-selected": "_haxContextOperation",
      onbeforeunload: "_onBeforeUnload",
      paste: "_onPaste",
      "hax-register-app": "_haxStoreRegisterApp",
      "hax-register-stax": "_haxStoreRegisterStax",
      "hax-register-blox": "_haxStoreRegisterBlox",
      "hax-store-write": "_writeHaxStore",
      "hax-register-core-piece": "_haxStorePieceRegistrationManager",
      "hax-register-body": "_haxStoreRegisterBody",
      "grid-plate-add-item": "haxInsertAnything",
      "hax-insert-content": "_haxStoreInsertContent",
      "hax-insert-content-array": "_haxStoreInsertMultiple",
      "hax-add-voice-command": "_addVoiceCommand"
    };
    this.voiceRespondsTo = "(worker)";
    this.voiceCommands = {};
    this.skipHAXConfirmation = false;
    this.storageData = {};
    this.appStore = {
      url: "",
      params: {}
    };
    this.activeContainerNode = null;
    this.activeNode = null;
    this.haxBodies = [];
    this.activePlaceHolder = null;
    this.sessionObject = {};
    this.editMode = false;
    this.canSupportUploads = false;
    this.skipExitTrap = false;
    this.gizmoList = [];
    this.elementList = {};
    this.appList = [];
    this.staxList = [];
    this.bloxList = [];
    this.globalPreferences = {};
    this.activeApp = {};
    this.connectionRewrites = {};
    // change this in order to debug voice commands
    this.voiceDebug = false;
    this.validTagList = this.__validTags();
    this.validGizmoTypes = this.__validGizmoTypes();
    // test for sandboxed env
    let test = document.createElement("webview");
    this._isSandboxed = typeof test.reload === "function";
    // claim the instance spot. This way we can easily
    // be referenced globally
    if (window.HaxStore.instance == null) {
      window.HaxStore.instance = this;
    }
    import("./hax-app.js");
    import("./hax-stax.js");
    import("./hax-blox.js");
    import("@polymer/polymer/lib/utils/settings.js").then(esModule => {
      esModule.setPassiveTouchGestures(true);
    });
    import("@lrnwebcomponents/simple-toast/simple-toast.js").then(() => {
      this.haxToast = window.SimpleToast.requestAvailability();
    });
    import("@lrnwebcomponents/code-sample/code-sample.js").then(esModule => {
      this.setHaxProperties(
        esModule.CodeSample.haxProperties,
        esModule.CodeSample.tag
      );
    });

    import("@lrnwebcomponents/media-behaviors/media-behaviors.js");
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
        advanced: [
          {
            attribute: "loading",
            title: "Loading method",
            description: "Whether or not to lazy load this",
            inputMethod: "select",
            options: {
              lazy: "Load when visible",
              auto: "Automatic"
            }
          }
        ]
      }
    };
    this.setHaxProperties(iframe, "iframe");
    let img = {
      canScale: {
        min: 10,
        step: 5
      },
      canPosition: true,
      canEditSource: true,
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
            type_exclusive: true,
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
            attribute: "alt",
            title: "Alt text",
            description: "Useful for screen readers and improved SEO.",
            inputMethod: "alt",
            icon: "accessibility"
          },
          {
            attribute: "height",
            title: "Height",
            description:
              "height in pixels of the item. Leave blank to respond to the natural resolution",
            inputMethod: "textfield",
            icon: "icons:swap-vert"
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
            description:
              "height in pixels of the item. Leave blank to respond to the natural resolution",
            inputMethod: "textfield",
            icon: "icons:swap-vert"
          }
        ],
        advanced: [
          {
            attribute: "loading",
            title: "Loading method",
            description: "Whether or not to lazy load this",
            inputMethod: "select",
            options: {
              lazy: "Load when visible",
              auto: "Automatic"
            }
          }
        ]
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
        handles: [],
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
    // anything can be presented as a link
    this.validGizmoTypes.forEach(val => {
      ahref.gizmo.handles.push({
        type: val,
        source: "href",
        title: "innerText",
        alt: "title"
      });
    });
    this.setHaxProperties(ahref, "a");
    let p = {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Paragraph",
        description: "A basic text area",
        icon: "editor:short-text",
        color: "grey",
        groups: ["Text"],
        handles: [
          {
            type: "content",
            content: ""
          }
        ],
        meta: {
          author: "W3C"
        }
      },
      settings: {
        quick: [],
        configure: [],
        advanced: []
      }
    };
    this.setHaxProperties(p, "p");
    let hr = {
      canScale: {
        min: 25,
        step: 25
      },
      canPosition: false,
      canEditSource: false,
      settings: {
        quick: [],
        configure: [],
        advanced: []
      }
    };
    this.setHaxProperties(hr, "hr");
  }
  /**
   * A standard event for registering the different pieces of HAX that check in
   * at run time. This allows for additional flexibility down the road as well as
   * registering pieces we never thought of for custom environments.
   *
   * @param {CustomEvent} e an event that has the piece to register and the object
   */
  _haxStorePieceRegistrationManager(e) {
    if (e.detail && e.detail.piece && e.detail.object) {
      this[e.detail.piece] = e.detail.object;
    }
  }

  /**
   * Close all drawers
   */
  openDrawersCallback(active = false, oldValue) {
    // walk all drawers, close everything
    // except active. This also will allow them
    // to close everything then.
    let drawers = ["haxAppPicker", "haxPreferences", "haxExport"];
    for (var i in drawers) {
      if (active === this[drawers[i]]) {
        active.open();
        setTimeout(() => {
          if (
            active.querySelector(
              "paper-checkbox,paper-input,textarea,paper-button"
            ) != null
          ) {
            active
              .querySelector("paper-checkbox,paper-input,textarea,paper-button")
              .focus();
          }
          var evt = document.createEvent("UIEvents");
          evt.initUIEvent("resize", true, false, window, 0);
          window.dispatchEvent(evt);
        }, 325);
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
      let details = e.detail;
      if (window.customElements.get(details.tag)) {
        let prototype = Object.getPrototypeOf(
          document.createElement(details.tag)
        );
        // support for deep API call to clean up special elements
        if (typeof prototype.preProcessHaxInsertContent !== typeof undefined) {
          details = prototype.preProcessHaxInsertContent(details);
        }
      }
      var properties = {};
      // support for properties to be set automatically optionally
      if (typeof details.properties !== typeof undefined) {
        properties = details.properties;
      }
      // support / clean up properties / attributes that have innerHTML / innerText
      // these are reserved words but required for certain bindings
      if (properties.innerHTML) {
        if (details.content == "") {
          details.content = properties.innerHTML;
        }
        delete properties.innerHTML;
      }
      if (properties.innerText) {
        if (details.content == "") {
          details.content = properties.innerText;
        }
        delete properties.innerText;
      }
      // ensure better UX for text based operations
      this.activeHaxBody.__activeHover = null;
      // invoke insert or replacement on body, same function so it's easier to trace
      if (details.replace && details.replacement) {
        let node = window.HaxStore.haxElementToNode(
          details.tag,
          details.content,
          properties
        );
        if (this.activePlaceHolder) {
          this.activeHaxBody.haxReplaceNode(
            this.activePlaceHolder,
            node,
            this.activePlaceHolder.parentNode
          );
          this.activePlaceHolder = null;
        } else {
          this.activeHaxBody.haxReplaceNode(
            this.activeNode,
            node,
            this.activeNode.parentNode
          );
        }
      } else if (
        typeof details.__type !== typeof undefined &&
        details.__type === "inline"
      ) {
        let node = window.HaxStore.haxElementToNode(
          details.tag,
          details.content,
          properties
        );
        // replace what WAS the active selection w/ this new node
        if (this.activePlaceHolder !== null) {
          this.activePlaceHolder.deleteContents();
          this.activePlaceHolder.insertNode(node);
        }
        // set it to nothing
        this.activePlaceHolder = null;
      } else if (this.activeContainerNode != null) {
        let node = window.HaxStore.haxElementToNode(
          details.tag,
          details.content,
          properties
        );
        // allow for inserting things into things but not grid plate
        if (
          this.activeContainerNode &&
          this.activeContainerNode.tagName === "GRID-PLATE"
        ) {
          // support slot if we have one on the activeNode (most likely)
          if (this.activeNode.getAttribute("slot") != null) {
            node.setAttribute("slot", this.activeNode.getAttribute("slot"));
          }
          this.activeHaxBody.haxInsert(
            details.tag,
            details.content,
            properties
          );
          this.activeHaxBody.shadowRoot.querySelector(
            "#textcontextmenu"
          ).highlightOps = false;
          this.activeHaxBody.__updateLockFocus = node;
          // wait so that the DOM can have the node to then attach to
          setTimeout(() => {
            this.activeHaxBody.breakUpdateLock();
          }, 50);
        } else {
          this.activeHaxBody.haxInsert(
            details.tag,
            details.content,
            properties
          );
        }
      } else {
        this.activeHaxBody.haxInsert(details.tag, details.content, properties);
      }
    }
  }
  /**
   * Present all elements to potentially insert
   */
  haxInsertAnything(e) {
    let props = {};
    if (e && e.detail && e.detail.properties) {
      props = e.detail.properties;
    }
    let haxElements = [];
    for (var i in window.HaxStore.instance.gizmoList) {
      haxElements.push(
        window.HaxStore.haxElementPrototype(
          window.HaxStore.instance.gizmoList[i],
          props,
          ""
        )
      );
    }
    // hand off to hax-app-picker to deal with the rest of this
    window.HaxStore.instance.haxAppPicker.presentOptions(
      haxElements,
      "element",
      "Add an element",
      "gizmo"
    );
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
      console.warn("Shadow DOM missing, certain operations hidden");
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
      if (e.detail.value == null) {
        this[e.detail.property] = null;
      } else if (typeof e.detail.value === "object") {
        this[e.detail.property] = {};
      }
      if (this.globalPreferences && this.globalPreferences.haxDeveloperMode) {
        console.warn(e.detail.property);
      }
      this[e.detail.property] = e.detail.value;
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
      this.appList = [...this.appList, e.detail];
      window.HaxStore.write("appList", this.appList, this);
      // preconnect apps at registration time
      if (
        e.detail.connection &&
        e.detail.connection.protocol &&
        e.detail.connection.url
      ) {
        let preconnectlink = document.createElement("link");
        preconnectlink.rel = "preconnect";
        preconnectlink.href =
          e.detail.connection.protocol + "://" + e.detail.connection.url;
        document.head.appendChild(preconnectlink);
      }
      // we don't care about this after it's launched
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-STORE"
      ) {
        e.target.parentElement.removeChild(e.target);
      }
    }
  }

  /**
   * Notice that a stax was set in HAX; register it
   */
  _haxStoreRegisterStax(e) {
    if (e.detail) {
      e.detail.index = this.staxList.length;
      this.staxList = [...this.staxList, e.detail];
      window.HaxStore.write("staxList", this.staxList, this);
      // we don't care about this after it's launched
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-STORE"
      ) {
        e.target.parentElement.removeChild(e.target);
      }
    }
  }

  /**
   * Notice that a blox was set in HAX; register it
   */
  _haxStoreRegisterBlox(e) {
    if (e.detail) {
      e.detail.index = this.bloxList.length;
      this.bloxList = [...this.bloxList, e.detail];
      window.HaxStore.write("bloxList", this.bloxList, this);
      // we don't care about this after it's launched
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-STORE"
      ) {
        e.target.parentElement.removeChild(e.target);
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
        this.elementList[e.detail.tag] = e.detail.properties;
        // only push new values on if we got something new
        if (
          !this.validTagList.find(element => {
            return element === e.detail.tag;
          })
        ) {
          this.validTagList.push(e.detail.tag);
        }
      }
      // delete this tag if it was in the autoloader as it has served it's purpose.
      if (
        typeof e.target.parentElement !== typeof undefined &&
        e.target.parentElement.tagName === "HAX-AUTOLOADER"
      ) {
        this.haxAutoloader.removeChild(e.target);
      }
    }
  }
}
window.customElements.define(HaxStore.tag, HaxStore);
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
  let tmpProps;
  // relatively cross library
  if (customElements.get(node.tagName.toLowerCase())) {
    tmpProps = customElements.get(node.tagName.toLowerCase()).properties;
  }
  // weak fallback
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
  // support fallback on inner text if there were no nodes
  if (slotContent == "") {
    slotContent = node.innerText;
  }
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
          if (newNode.set) {
            newNode.set(attributeName, properties[property]);
          } else {
            newNode[attributeName] = [...properties[property]];
          }
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
          if (newNode.set) {
            newNode.set(attributeName, properties[property]);
          } else {
            newNode[attributeName] = { ...properties[property] };
          }
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
 * This DOES NOT acccept a HAXElement which is similar
 */
window.HaxStore.nodeToContent = node => {
  if (
    window.HaxStore.instance.activeHaxBody.globalPreferences.haxDeveloperMode
  ) {
    console.warn(node);
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
  let tmpProps;
  // relatively cross library
  if (customElements.get(tag)) {
    tmpProps = customElements.get(tag).properties;
  }
  // weak fallback
  if (typeof tmpProps === typeof undefined) {
    tmpProps = node.__data;
  }
  if (typeof tmpProps !== typeof undefined) {
    for (var j in tmpProps) {
      var nodeName = window.HaxStore.camelToDash(j);
      var value = null;
      // prefer local value over properties object if possible
      if (typeof node[j] !== typeof undefined) {
        value = node[j];
      }
      // never allow read only things to recorded as they
      // are run-time creation 99% of the time
      // this is very polymer specific but it allows readOnly and computed props
      if (
        !tmpProps[j].readOnly &&
        !tmpProps[j].computed &&
        value !== tmpProps[j].value
      ) {
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
              if (value == "" && tmpProps[j].value != "") {
                value = tmpProps[j].value;
              } else if (value === "" && tmpProps[j].value == "") {
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
  let delProps = ["inner-text", "inner-html", "tabindex", "guestinstance"];
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
    let slotnodes = node.childNodes;
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
            content += window.HaxStore.nodeToContent(slotnodes[j]);
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
  // optional support for intentional progressive enhancement
  if (typeof node.haxProgressiveEnhancement === "function") {
    content += node.haxProgressiveEnhancement();
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
    console.warn(content);
  }
  // spacing niceness for output readability
  content = content.replace(/&nbsp;/gm, " ");
  // target and remove hax specific things from output if they slipped through
  content = content.replace(/ data-editable="(\s|.)*?"/gim, "");
  content = content.replace(/ data-hax-ray="(\s|.)*?"/gim, "");
  content = content.replace(/ class=""/gim, "");
  content = content.replace(/ class="hax-active"/gim, "");
  content = content.replace(/ contenteditable="(\s|.)*?"/gim, "");
  // wipe pure style spans which can pop up on copy paste if we didn't catch it
  // also ensure that we then remove purely visual chars laying around
  // this also helps clean up when we did a normal contenteditable paste
  // as opposed to our multi-element sanitizing option that we support
  content = content.replace(/<span style="(.*?)">/gim, "<span>");
  content = content.replace(/<span>\s*?<\/span>/g, " ");
  content = content.replace(/<span><br\/><\/span>/gm, "");
  // account for things taht on normal paste would pick up too many css vars
  content = content.replace(/<strong style="(.*?)">/gim, "<strong>");
  content = content.replace(/<b style="(.*?)">/gim, "<b>");
  content = content.replace(/<strike style="(.*?)">/gim, "<strike>");
  content = content.replace(/<em style="(.*?)">/gim, "<em>");
  content = content.replace(/<i style="(.*?)">/gim, "<i>");
  // empty with lots of space
  content = content.replace(/<p>(\s*)<\/p>/gm, "<p></p>");
  // empty p / more or less empty
  content = content.replace(/<p>&nbsp;<\/p>/gm, "<p></p>");
  // br somehow getting through here
  content = content.replace(/<p><br\/><\/p>/gm, "<p></p>");
  content = content.replace(/<p><br><\/p>/gm, "<p></p>");
  // whitespace in reverse of the top case now that we've cleaned it up
  content = content.replace(/<\/p>(\s*)<p>/gm, "</p><p>");
  content = content
    .split("\n\r")
    .join("\n")
    .split("\r")
    .join("\n")
    .split("\n\n")
    .join("\n")
    .split("\n\n")
    .join("\n")
    .split("\n\n")
    .join("\n");
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
  // we can skip all of this if we have a text element / HTML prim!
  if (window.HaxStore.instance.isTextElement(node)) {
    return node.innerHTML;
  }
  let content = "";
  var slotnodes = node.childNodes;
  // ensure there's something inside of this
  if (slotnodes.length > 0) {
    // loop through everything found in the slotted area and put it back in
    for (var j = 0, len2 = slotnodes.length; j < len2; j++) {
      if (typeof slotnodes[j].tagName !== typeof undefined) {
        // if we're a custom element, keep digging, otherwise a simple
        // self append is fine.
        if (slotnodes[j].tagName.indexOf("-") > 0) {
          content += "  " + window.HaxStore.nodeToContent(slotnodes[j]) + "\n";
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
  if (obj) {
    obj.dispatchEvent(
      new CustomEvent("hax-store-write", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: { property: prop, value: value, owner: obj }
      })
    );
  }
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
    } else if (guess.source.indexOf(".md") != -1) {
      return "markdown";
    } else if (
      guess.source.indexOf(".html") != -1 ||
      guess.source.indexOf(".htm") != -1
    ) {
      return "html";
    } else if (
      guess.source.indexOf(".txt") != -1 ||
      guess.source.indexOf(".doc") != -1 ||
      guess.source.indexOf(".docx") != -1 ||
      guess.source.indexOf(".xls") != -1 ||
      guess.source.indexOf(".xlsx") != -1 ||
      guess.source.indexOf(".ppt") != -1
    ) {
      return "document";
    } else if (
      guess.source.indexOf(".zip") != -1 ||
      guess.source.indexOf(".tar.gz") != -1 ||
      guess.source.indexOf(".tar") != -1
    ) {
      return "archive";
    }
    // if it's external we can't assume what it actually is
    else if (
      window.MediaBehaviors.Video.getVideoType(guess.source) != "external"
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
window.HaxStore.guessGizmo = (
  guess,
  values,
  skipPropMatch = false,
  preferExclusive = false
) => {
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
                if (preferExclusive && gizmo.handles[i].type_exclusive) {
                  return [
                    window.HaxStore.haxElementPrototype(gizmo, props, "")
                  ];
                } else {
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
  classStyle = "capsule",
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
import { Undoer } from "undoer/undoer.js";
class UndoerElement extends HTMLElement {
  static get observedAttributes() {
    return ["state"];
  }

  constructor() {
    super();
    this.openDrawer = false;
    this._root = this.attachShadow({ mode: "open" });

    // hide from the first attributeChangedCallback call
    this._selfAttributeChange = true;
    window.setTimeout(() => {
      this._selfAttributeChange = false;
    });

    const callback = data => {
      const { value, attr } = data;
      this._updateAttribute(attr ? value : null);

      // hooray! tell the client
      this.dispatchEvent(new CustomEvent("state", { detail: value }));
    };

    // set up initial zero undo state from attr
    const zero = this.getAttribute("state");
    const attr = this.hasAttribute("state");
    this._undoer = new Undoer(callback, { value: zero, attr });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "state" && !this._selfAttributeChange) {
      this._internalSet(newValue, true);
    }
  }

  set state(value) {
    if (!this.isConnected) {
      throw new Error("can't push state while disconnected");
    }

    // render if simple "attribute safe" state
    const attr = typeof value === "string" || typeof value === "number";
    this._internalSet(value, attr);
  }

  get state() {
    const { value } = this._undoer.data;
    return value;
  }

  _updateAttribute(value) {
    this._selfAttributeChange = true;
    try {
      if (value) {
        this.setAttribute("state", value);
      } else {
        this.removeAttribute("state");
      }
    } finally {
      this._selfAttributeChange = false;
    }
  }

  _internalSet(value, attr) {
    this._updateAttribute(attr ? value : null);
    this._undoer.push({ value, attr }, this._root);
  }
}
window.customElements.define("undoer-element", UndoerElement);
export { HaxStore, UndoerElement };
