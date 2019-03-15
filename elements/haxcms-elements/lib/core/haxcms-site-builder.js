import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { setPassiveTouchGestures } from "@polymer/polymer/lib/utils/settings.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-progress/paper-progress.js";
import { observable, decorate, computed } from "mobx";
import { store } from "./haxcms-site-store.js";
import "./haxcms-site-router.js";
import "./haxcms-editor-builder.js";

/**
 * `haxcms-site-builder`
 * `build the site and everything off of this`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - This is a factory element, it doesn't do much on its own visually
 * - it loads a site.json file and then utilizes this data in order to construct
 *   what theme it should load (element) in order to get everything off and running
 */
let HAXCMSSiteBuilder = Polymer({
  _template: html`
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
  },

  /**
   * ready life cycle
   */
  created: function() {
    this.__timeStamp = "";
    // attempt to set polymer passive gestures globally
    // this decreases logging and improves performance on scrolling
    setPassiveTouchGestures(true);
    window.JSONOutlineSchema.requestAvailability();
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
    window.SimpleModal.requestAvailability();
    window.SimpleToast.requestAvailability();
    this.editorBuilder = document.createElement("haxcms-editor-builder");
    // attach editor builder after we've appended to the screen
    document.body.appendChild(this.editorBuilder);
    // prep simple toast notification
    async.microTask.run(() => {
      if (window.cmsSiteEditor && this.manifest) {
        window.cmsSiteEditor.jsonOutlineSchema = this.manifest;
      }
      // get fresh data if not published
      if (this.editorBuilder.getContext() !== "published") {
        this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
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
    var time = 2000;
    if (window.HaxStore && window.HaxStore.ready) {
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
      var html = newValue;
      // only append if not empty
      if (html !== null) {
        this.wipeSlot(this.themeElement, "*");
        html = this.encapScript(newValue);
        // insert the content as quickly as possible, then work on the dynamic imports
        async.microTask.run(() => {
          setTimeout(() => {
            let frag = document.createRange().createContextualFragment(html);
            dom(this.themeElement).appendChild(frag);
            this.fire("json-outline-schema-active-body-changed", html);
            if (!window.HaxStore || !window.HaxStore.ready) {
              setTimeout(() => {
                if (
                  window.cmsSiteEditor.instance &&
                  window.cmsSiteEditor.haxCmsSiteEditorUIElement
                ) {
                  window.HaxStore.instance.activeHaxBody.importContent(html);
                }
              }, 2000);
            }
          }, 50);
        });
        // if there are, dynamically import them
        if (this.manifest.metadata.dynamicElementLoader) {
          let tagsFound = this.findTagsInHTML(html);
          const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
          for (var i in tagsFound) {
            const tagName = tagsFound[i];
            if (
              this.manifest.metadata.dynamicElementLoader[tagName] &&
              !window.customElements.get(tagName)
            ) {
              import(`${basePath}../../../../${
                this.manifest.metadata.dynamicElementLoader[tagName]
              }`)
                .then(response => {
                  //console.log(tagName + ' dynamic import');
                })
                .catch(error => {
                  /* Error handling */
                  console.log(error);
                });
            }
          }
        }
      }
    }
  },
  findTagsInHTML: function(html) {
    let tags = {};
    let tag = "";
    var matches = html.match(/<\/(\S*?)-(\S*?)>/g);
    for (var i in matches) {
      tag = matches[i].replace("</", "").replace(">", "");
      tags[tag] = tag;
    }
    return tags;
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
      // get fresh data if not published
      if (this.editorBuilder.getContext() !== "published") {
        this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
      }
      this.$.activecontent.generateRequest();
    }
    // we had something, now we don't. wipe out the content area of the theme
    else if (typeof newValue.id === typeof undefined) {
      // fire event w/ nothing, this is because there is no content
      this.fire("json-outline-schema-active-body-changed", null);
    }
  },

  /**
   * got a message that we need to update our json manifest data
   */
  _triggerUpdatedData: function(e) {
    // get fresh data if not published
    if (this.editorBuilder.getContext() !== "published") {
      this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
    }
    this.$.manifest.generateRequest();
  },

  /**
   * got a message that we need to update our page content
   */
  _triggerUpdatedPage: function(e) {
    // get fresh data if not published
    if (this.editorBuilder.getContext() !== "published") {
      this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
    }
    // ensure we don't get a miss on initial load
    if (this.activeItem.location) {
      this.$.activecontent.generateRequest();
    }
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
      if (!newValue.metadata.dynamicElementLoader) {
        newValue.metadata.dynamicElementLoader = {
          "a11y-gif-player":
            "@lrnwebcomponents/a11y-gif-player/a11y-gif-player.js",
          "citation-element":
            "@lrnwebcomponents/citation-element/citation-element.js",
          "hero-banner": "@lrnwebcomponents/hero-banner/hero-banner.js",
          "image-compare-slider":
            "@lrnwebcomponents/image-compare-slider/image-compare-slider.js",
          "license-element":
            "@lrnwebcomponents/license-element/license-element.js",
          "lrn-aside": "@lrnwebcomponents/lrn-aside/lrn-aside.js",
          "lrn-calendar": "@lrnwebcomponents/lrn-calendar/lrn-calendar.js",
          "lrn-math": "@lrnwebcomponents/lrn-math/lrn-math.js",
          "lrn-table": "@lrnwebcomponents/lrn-table/lrn-table.js",
          "lrn-vocab": "@lrnwebcomponents/lrn-vocab/lrn-vocab.js",
          "lrndesign-blockquote":
            "@lrnwebcomponents/lrndesign-blockquote/lrndesign-blockquote.js",
          "magazine-cover":
            "@lrnwebcomponents/magazine-cover/magazine-cover.js",
          "media-behaviors":
            "@lrnwebcomponents/media-behaviors/media-behaviors.js",
          "media-image": "@lrnwebcomponents/media-image/media-image.js",
          "meme-maker": "@lrnwebcomponents/meme-maker/meme-maker.js",
          "multiple-choice":
            "@lrnwebcomponents/multiple-choice/multiple-choice.js",
          "paper-audio-player":
            "@lrnwebcomponents/paper-audio-player/paper-audio-player.js",
          "person-testimonial":
            "@lrnwebcomponents/person-testimonial/person-testimonial.js",
          "place-holder": "@lrnwebcomponents/place-holder/place-holder.js",
          "q-r": "@lrnwebcomponents/q-r/q-r.js",
          "full-width-image":
            "@lrnwebcomponents/full-width-image/full-width-image.js",
          "self-check": "@lrnwebcomponents/self-check/self-check.js",
          "simple-concept-network":
            "@lrnwebcomponents/simple-concept-network/simple-concept-network.js",
          "stop-note": "@lrnwebcomponents/stop-note/stop-note.js",
          "tab-list": "@lrnwebcomponents/tab-list/tab-list.js",
          "task-list": "@lrnwebcomponents/task-list/task-list.js",
          "video-player": "@lrnwebcomponents/video-player/video-player.js",
          "wave-player": "@lrnwebcomponents/wave-player/wave-player.js",
          "wikipedia-query":
            "@lrnwebcomponents/wikipedia-query/wikipedia-query.js"
        };
      }
      store.manifest = newValue;
      window.cmsSiteEditor.jsonOutlineSchema = newValue;
      // only set these if the path changes
      if (
        this.themeData &&
        this.themeData.path === newValue.metadata.theme.path
      ) {
      } else {
        // this is a forcible set which means it'll trigger a new value each time
        // ensure that the theme data actually DOES change or this causes unneeded state rebuilding
        this.set("themeData", newValue.metadata.theme);
      }
      this.fire("json-outline-schema-changed", newValue);
    }
  },

  /**
   * notice theme changes and ensure slot is rebuilt.
   */
  _themeChanged: function(newValue, oldValue) {
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
      let theme = newValue;
      // wipe out what we got
      this.wipeSlot(this, "*");
      // create the 'theme' as a new element
      this.themeElement = document.createElement(theme.element);
      // give it our manifest
      this.themeElement.manifest = this.manifest;
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

export { HAXCMSSiteBuilder };
