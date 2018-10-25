import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
`haxcms-site-builder`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 - This is a factory element, it doesn't do much on its own visually
 - it loads a site.json file and then utilizes this data in order to construct
   what theme it should load (element) in order to get everything off and running

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host #slot {
        background-color: white;
        opacity: .2;
        transition: all 1s linear;
        visibility: hidden;
      }
      :host[loading] #slot {
        opacity: .8;
      }
      :host[theme-loaded] #slot {
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
    <haxcms-editor-builder></haxcms-editor-builder>
    <paper-progress hidden\$="[[!loading]]" value="100" indeterminate="" bottom-item=""></paper-progress>
    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>
    <app-route route="{{route}}" pattern=":page" data="{{data}}" tail="{{tail}}" query-params="{{queryParams}}">
    </app-route>
    <iron-ajax id="manifest" url="[[outlineLocation]][[file]][[__timeStamp]]" handle-as="json" debounce-duration="250" last-response="{{manifest}}"></iron-ajax>
    <iron-ajax id="activecontent" url="[[outlineLocation]][[activeItem.location]][[__timeStamp]]" handle-as="text" loading="{{loading}}" debounce-duration="250" last-response="{{_activeItemContent}}"></iron-ajax>
    <div id="slot">
      <slot></slot>
    </div>
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
      type: String
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
        "outline-player": "../outline-player/outline-player.html",
        "simple-blog": "../simple-blog/simple-blog.html",
        "infinite-scroll-site":
          "../infinite-scroll-site/infinite-scroll-site.html",
        "haxcms-dev-theme": "../haxcms-elements/haxcms-dev-theme.html"
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
    _activeItemContent: {
      type: String,
      observer: "_activeItemContentChanged"
    },
    /**
     * Location of the site.json file
     */
    file: {
      type: String,
      observer: "_fileChanged"
    }
  },

  /**
   * ready life cycle
   */
  created: function() {
    document.body.addEventListener(
      "haxcms-trigger-update",
      this._triggerUpdatedData.bind(this)
    );
    document.body.addEventListener(
      "haxcms-trigger-update-page",
      this._triggerUpdatedPage.bind(this)
    );
    document.body.addEventListener(
      "json-outline-schema-active-item-changed",
      this._setActiveItem.bind(this)
    );
  },

  /**
   * Detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "haxcms-trigger-update",
      this._triggerUpdatedData.bind(this)
    );
    document.body.removeEventListener(
      "haxcms-trigger-update-page",
      this._triggerUpdatedPage.bind(this)
    );
    document.body.removeEventListener(
      "json-outline-schema-active-item-changed",
      this._setActiveItem.bind(this)
    );
  },

  /**
   * Query params changed
   */
  _setupActiveFromQuery: function() {
    if (
      typeof this.queryParams.page !== typeof undefined &&
      typeof this.manifest.items !== typeof undefined
    ) {
      let find = this.manifest.items.filter(item => {
        if (item.id !== this.queryParams.page) {
          return false;
        }
        return true;
      });
      // if we found one, make it the active page
      if (find.length > 0) {
        let found = find.pop();
        if (typeof Polymer.cmsSiteEditor !== typeof undefined) {
          Polymer.cmsSiteEditor.initialActiveItem = found;
        }
        // @todo figure out why this is required in order for all timing to line up
        setTimeout(() => {
          this.fire("haxcms-active-item-changed", found);
        }, 250);
      }
    }
  },

  /**
   * set global active item
   */
  _setActiveItem: function(e) {
    this.set("activeItem", e.detail);
    this.set("queryParams.page", e.detail.id);
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
        this.async(() => {
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
    else if (
      typeof newValue.id === typeof undefined &&
      typeof oldValue.id !== typeof undefined
    ) {
      this.async(() => {
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
    if (
      typeof newValue !== typeof undefined &&
      typeof newValue.id !== typeof undefined
    ) {
      this.themeElementName = newValue.metadata.theme;
      // account for editor not being there
      if (typeof Polymer.cmsSiteEditor !== typeof undefined) {
        Polymer.cmsSiteEditor.jsonOutlineSchema = newValue;
      }
      this.fire("json-outline-schema-changed", newValue);
    }
  },

  /**
   * notice theme changes and ensure slot is rebuilt.
   */
  _themeNameChanged: function(newValue, oldValue) {
    if (newValue && oldValue) {
      if (
        typeof Polymer.cmsSiteEditor.instance.haxCmsSiteEditorElement !==
        typeof undefined
      ) {
        Polymer.cmsSiteEditor.instance.appendChild(
          Polymer.cmsSiteEditor.instance.haxCmsSiteEditorElement
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
          this.importHref(this.resolveUrl(this.themeData[themeName]), e => {
            // add it into ourselves so it unpacks and we kick this off!
            dom(this).appendChild(this.themeElement);
            this.__imported[themeName] = themeName;
            this.themeLoaded = true;
          });
        } catch (err) {
          // error in the event this is a double registration
          // also strange to be able to reach this but technically possible
          dom(this).appendChild(this.themeElement);
          this.themeLoaded = true;
        }
      }
      // establish initial routing
      this._setupActiveFromQuery();
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
