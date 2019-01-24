import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-progress/paper-progress.js";
import "@polymer/app-route/app-route.js";
import "./haxcms-site-router.js";
/**
 * `haxcms-site-builder`
 * `build the site and everything off of this`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - This is a factory element, it doesn't do much on its own visually
 * - it loads a site.json file and then utilizes this data in order to construct
 *   what theme it should load (element) in order to get everything off and running
 */
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host #slot {
        background-color: white;
        opacity: 0.2;
        transition: all 1s linear;
        visibility: hidden;
      }
      :host([loading]) #slot {
        opacity: 0.8;
      }
      :host([theme-loaded]) #slot {
        opacity: 1;
        visibility: visible;
      }
      paper-progress {
        display: block;
        width: 100%;
        --paper-progress-active-color: rgba(255, 255, 255, 0.5);
        --paper-progress-container-color: transparent;
      }
    </style>
    <haxcms-site-router
      manifest="[[manifest]]"
      base-uri="[[baseURI]]"
    ></haxcms-site-router>
    <haxcms-editor-builder></haxcms-editor-builder>
    <paper-progress
      hidden\$="[[!loading]]"
      value="100"
      indeterminate=""
      bottom-item=""
    ></paper-progress>
    <iron-ajax
      id="manifest"
      url="[[outlineLocation]][[file]][[__timeStamp]]"
      handle-as="json"
      debounce-duration="250"
      last-response="{{manifest}}"
    ></iron-ajax>
    <iron-ajax
      id="activecontent"
      url="[[outlineLocation]][[activeItem.location]][[__timeStamp]]"
      handle-as="text"
      loading="{{loading}}"
      debounce-duration="250"
      last-response="{{activeItemContent}}"
    ></iron-ajax>
    <div id="slot"><slot></slot></div>
  `,

  is: "haxcms-site-builder",

  properties: {
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
    themeElementName: {
      type: String,
      reflectToAttribute: true,
      observer: "_themeNameChanged"
    },
    /**
     * Theme, used to boot a design element
     */
    themeElement: {
      type: Object
    },
    /**
     * registry to map theme names to locations
     */
    themeData: {
      type: Object,
      value: {
        "simple-blog": "../../../@lrnwebcomponents/simple-blog/simple-blog.js",
        "outline-player":
          "../../../@lrnwebcomponents/outline-player/outline-player.js",
        "lrnapp-book":
          "../../../@lrnwebcomponents/elmsln-apps/lib/lrnapp-book/lrnapp-book.js",
        "haxcms-dev-theme": "haxcms-dev-theme.js"
      }
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
  },

  /**
   * ready life cycle
   */
  created: function() {
    window.JSONOutlineSchema.requestAvailability();
    window.SimpleModal.requestAvailability();
    window.SimpleToast.requestAvailability();
    window.addEventListener(
      "haxcms-trigger-update",
      this._triggerUpdatedData.bind(this)
    );
    window.addEventListener(
      "haxcms-trigger-update-page",
      this._triggerUpdatedPage.bind(this)
    );
    window.addEventListener(
      "json-outline-schema-active-item-changed",
      this._setActiveItem.bind(this)
    );
  },
  attached: function() {
    // prep simple toast notification
    async.microTask.run(() => {
      if (window.cmsSiteEditor && this.manifest) {
        window.cmsSiteEditor.jsonOutlineSchema = this.manifest;
      }
    });
  },
  /**
   * Detached life cycle
   */
  detached: function() {
    window.removeEventListener(
      "haxcms-trigger-update",
      this._triggerUpdatedData.bind(this)
    );
    window.removeEventListener(
      "haxcms-trigger-update-page",
      this._triggerUpdatedPage.bind(this)
    );
    window.removeEventListener(
      "json-outline-schema-active-item-changed",
      this._setActiveItem.bind(this)
    );
  },

  /**
   * set global active item
   */
  _setActiveItem: function(e) {
    this.set("activeItem", e.detail);
    this.notifyPath("activeItem.*");
    this.set("queryParams.page", e.detail.id);
    this.notifyPath("queryParams.page");
    // check for authoring xp by just asking for the object
    // timeout helps w/ some initial setup work
    var time = 500;
    if (window.HaxStore.ready) {
      time = 10;
    }
    setTimeout(() => {
      if (
        window.cmsSiteEditor.instance &&
        window.cmsSiteEditor.haxCmsSiteEditorUIElement
      ) {
        window.cmsSiteEditor.haxCmsSiteEditorUIElement.set(
          "activeItem",
          this.activeItem
        );
      }
    }, time);
  },

  /**
   * React to content being loaded from a page.
   */
  _activeItemContentChanged: function(newValue, oldValue) {
    if (newValue) {
      // only append if not empty
      if (newValue !== null) {
        this.wipeSlot(this.themeElement, "*");
        newValue = this.encapScript(newValue);
        async.microTask.run(() => {
          let frag = document.createRange().createContextualFragment(newValue);
          dom(this.themeElement).appendChild(frag);
        });
      }
      this.fire("json-outline-schema-active-body-changed", newValue);
    }
  },

  /**
   * Encapsulate script and style tags correctly
   */
  encapScript: function(html) {
    html = html.replace(/<script[\s\S]*?>/gi, "&lt;script&gt;");
    html = html.replace(/<\/script>/gi, "&lt;/script&gt;");
    html = html.replace(/<style[\s\S]*?>/gi, "&lt;style&gt;");
    html = html.replace(/<\/style>/gi, "&lt;/style&gt;");
    // special case, it's inside a template tag
    html = html.replace(
      /<template[\s\S]*?>[\s\S]*?&lt;script[\s\S]*?&gt;[\s\S]*?&lt;\/script&gt;/gi,
      function(match, contents, offset, input_string) {
        match = match.replace("&lt;script&gt;", "<script>");
        match = match.replace("&lt;/script&gt;", "</script>");
        match = match.replace("&lt;style&gt;", "<style>");
        match = match.replace("&lt;/style&gt;", "</style>");
        return match;
      }
    );
    return html;
  },

  /**
   * Active item updated, let's request the content from it
   */
  _activeItemChanged: function(newValue, oldValue) {
    if (typeof newValue.id !== typeof undefined) {
      this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
      this.$.activecontent.generateRequest();
    }
    // we had something, now we don't. wipe out the content area of the theme
    else if (typeof newValue.id === typeof undefined) {
      async.microTask.run(() => {
        this.wipeSlot(this.themeElement, "*");
      });
      // fire event w/ nothing, this is because there is no content
      this.fire("json-outline-schema-active-body-changed", null);
    }
  },

  /**
   * got a message that we need to update our json manifest data
   */
  _triggerUpdatedData: function(e) {
    // append a value so we know we get fresher data
    this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
    this.$.manifest.generateRequest();
  },

  /**
   * got a message that we need to update our page content
   */
  _triggerUpdatedPage: function(e) {
    // append a value so we know we get fresher data
    this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
    this.$.activecontent.generateRequest();
  },

  /**
   * File changed so let's pull from the location
   */
  _fileChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.$.manifest.generateRequest();
    }
  },

  /**
   * notice manifest changes and ensure slot is rebuilt.
   */
  _manifestChanged: function(newValue, oldValue) {
    if (newValue) {
      window.cmsSiteEditor.jsonOutlineSchema = newValue;
      this.themeElementName = newValue.metadata.theme;
      this.fire("json-outline-schema-changed", newValue);
    }
  },

  /**
   * notice theme changes and ensure slot is rebuilt.
   */
  _themeNameChanged: function(newValue, oldValue) {
    if (newValue && oldValue) {
      if (
        typeof window.cmsSiteEditor.instance.haxCmsSiteEditorElement !==
        typeof undefined
      ) {
        window.cmsSiteEditor.instance.appendChild(
          window.cmsSiteEditor.instance.haxCmsSiteEditorElement
        );
      }
    }
    if (newValue) {
      this.themeLoaded = false;
      var themeName = newValue;
      // trap for blowing up the world ;)
      if (typeof this.themeData[themeName] === typeof undefined) {
        console.log(
          "HAXCMS developer: " + themeName + " is not a valid theme name"
        );
        this.themeElementName = "simple-blog";
        return false;
      }
      // wipe out what we got
      this.wipeSlot(this, "*");
      // create the 'theme' as a new element
      this.themeElement = document.createElement(themeName);
      // give it our manifest
      this.themeElement.manifest = this.manifest;
      // weird but definition already here so we should be able
      // to just use this without an import, it's possible..
      if (typeof this.__imported[themeName] !== typeof undefined) {
        dom(this).appendChild(this.themeElement);
        this.themeLoaded = true;
      } else {
        // import the reference to the item dynamically, if we can
        try {
          import(pathFromUrl(import.meta.url) + this.themeData[themeName]).then(
            e => {
              // add it into ourselves so it unpacks and we kick this off!
              dom(this).appendChild(this.themeElement);
              this.__imported[themeName] = themeName;
              this.themeLoaded = true;
            }
          );
        } catch (err) {
          // error in the event this is a double registration
          // also strange to be able to reach this but technically possible
          dom(this).appendChild(this.themeElement);
          this.themeLoaded = true;
        }
      }
    }
  },

  /**
   * Wipe slotted content
   */
  wipeSlot: function(element, slot = "*") {
    // 100% clean slate
    if (slot === "*") {
      while (dom(element).firstChild !== null) {
        dom(element).removeChild(dom(element).firstChild);
      }
    } else {
      for (var i in dom(element).childNodes) {
        // test for element nodes to be safe
        if (
          typeof dom(element).childNodes[i] !== typeof undefined &&
          dom(element).childNodes[i].slot === slot
        ) {
          dom(element).removeChild(dom(element).childNodes[i]);
        }
      }
    }
  }
});
