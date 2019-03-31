/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@polymer/iron-ajax/iron-ajax.js";
import { autorun, toJS } from "mobx";
/**
 * `site-render-item`
 * `Title of the active page in the site`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteRenderItem extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-render-item";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <iron-ajax
        id="content"
        url="[[location]]"
        handle-as="text"
        loading="{{loading}}"
        debounce-duration="250"
        last-response="{{itemContent}}"
      ></iron-ajax>
      <slot></slot>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      render: {
        type: Boolean,
        value: false
      },
      itemId: {
        type: String
      },
      location: {
        type: String,
        computed: "_computeLocation(itemId, render)",
        observer: "locationChanged"
      },
      /**
       * item content
       */
      itemContent: {
        type: String,
        notify: true,
        observer: "_itemContentChanged"
      }
    };
  }
  _computeLocation(itemId, render) {
    if (itemId && render) {
      let item = store.findItem(itemId);
      // ensure it loads fresh
      return item.location + "?" + Math.floor(Date.now() / 1000);
    }
  }
  locationChanged(newValue) {
    if (newValue) {
      this.$.content.generateRequest();
    }
  }
  /**
   * React to content being loaded from a page.
   */
  _itemContentChanged(newValue, oldValue) {
    if (newValue) {
      var html = newValue;
      // only append if not empty
      if (html !== null) {
        html = this.encapScript(newValue);
        this.wipeSlot(this, "*");
        // insert the content as quickly as possible, then work on the dynamic imports
        microTask.run(() => {
          setTimeout(() => {
            let frag = document.createRange().createContextualFragment(html);
            dom(this).appendChild(frag);
          }, 5);
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
              import(`${basePath}../../../../../${
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
  }
  findTagsInHTML(html) {
    let tags = {};
    let tag = "";
    var matches = html.match(/<\/(\S*?)-(\S*?)>/g);
    for (var i in matches) {
      tag = matches[i].replace("</", "").replace(">", "");
      tags[tag] = tag;
    }
    return tags;
  }
  /**
   * Encapsulate script and style tags correctly
   */
  encapScript(html) {
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
  }
  /**
   * Wipe slotted content
   */
  wipeSlot(element, slot = "*") {
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
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = [];
    autorun(reaction => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i];
    }
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteRenderItem.tag, SiteRenderItem);
export { SiteRenderItem };
