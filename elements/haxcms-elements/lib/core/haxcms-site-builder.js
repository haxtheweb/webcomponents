import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { setPassiveTouchGestures } from "@polymer/polymer/lib/utils/settings.js";
import { updateStyles } from "@polymer/polymer/lib/mixins/element-mixin.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import { DynamicImporter } from "@lrnwebcomponents/dynamic-importer/dynamic-importer.js";
import {
  encapScript,
  findTagsInHTML,
  wipeSlot
} from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import { autorun, toJS } from "mobx";
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
class HAXCMSSiteBuilder extends DynamicImporter(PolymerElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-site-builder";
  }
  /**
   * Dynamically import these late so we can load faster
   */
  dynamicImports() {
    return {
      "paper-progress": "@polymer/paper-progress/paper-progress.js"
    };
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
        last-response="{{manifest}}"
      ></iron-ajax>
      <iron-ajax
        id="activecontent"
        url="[[outlineLocation]][[activeItem.location]][[__timeStamp]]"
        handle-as="text"
        loading="{{loading}}"
        last-response="{{activeItemContent}}"
      ></iron-ajax>
      <div id="slot"><slot></slot></div>
    `;
  }
  static get properties() {
    return {
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
  /**
   * ready life cycle
   */
  constructor() {
    super();
    // attempt to set polymer passive gestures globally
    // this decreases logging and improves performance on scrolling
    setPassiveTouchGestures(true);
    // hide the outdated fallback
    if (document.getElementById("haxcmsoutdatedfallback")) {
      document.getElementById("haxcmsoutdatedfallback").style.display = "none";
    }
    this.__disposer = [];
    autorun(reaction => {
      this.themeData = toJS(store.themeData);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.activeItem = toJS(store.activeItem);
      this.__disposer.push(reaction);
    });
    this.__timeStamp = "";
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
      const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
      import(`${basePath}haxcms-editor-builder.js`)
        .then(response => {
          this.editorBuilder = document.createElement("haxcms-editor-builder");
          // attach editor builder after we've appended to the screen
          document.body.appendChild(this.editorBuilder);
          // get fresh data if not published
          if (
            this.editorBuilder.getContext() !== "published" &&
            this.editorBuilder.getContext() !== "demo"
          ) {
            this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
          }
        })
        .catch(error => {
          /* Error handling */
          console.log(error);
        });
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
    super.disconnectedCallback();
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
        // @todo this ight be why we get a double render some times
        microTask.run(() => {
          setTimeout(() => {
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
            if (!window.HaxStore || !window.HaxStore.ready) {
              setTimeout(() => {
                if (
                  store.cmsSiteEditor &&
                  store.cmsSiteEditor.instance &&
                  store.cmsSiteEditor.haxCmsSiteEditorUIElement
                ) {
                  window.HaxStore.instance.activeHaxBody.importContent(html);
                }
              }, 1000);
            }
          }, 5);
        });
        // if there are, dynamically import them
        if (this.manifest.metadata.dynamicElementLoader) {
          let tagsFound = findTagsInHTML(html);
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
                  // useful to debug if dynamic references are coming in
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
  }
  /**
   * Active item updated, let's request the content from it
   */
  _activeItemChanged(newValue, oldValue) {
    if (newValue && typeof newValue.id !== typeof undefined) {
      this.set("queryParams.nodeId", newValue.id);
      this.notifyPath("queryParams.nodeId");
      // get fresh data if not published
      if (
        this.editorBuilder &&
        this.editorBuilder.getContext() !== "published" &&
        this.editorBuilder.getContext() !== "demo"
      ) {
        this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
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
    if (
      this.editorBuilder &&
      this.editorBuilder.getContext() !== "published" &&
      this.editorBuilder.getContext() !== "demo"
    ) {
      this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
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
      this.__timeStamp = "?" + Math.floor(Date.now() / 1000);
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
      // ensure there's a dynamicELementLoader defined
      // @todo this could also be a place to mix in criticals
      // that are system required yet we lazy load like grid-plate
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
export { HAXCMSSiteBuilder };
