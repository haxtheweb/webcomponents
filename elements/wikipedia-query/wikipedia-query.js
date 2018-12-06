import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/citation-element/citation-element.js";
/**
 * `wikipedia-query`
 * `Query and present information from wikipedia.`
 *
 * @demo demo/index.html
 */
let WikipediaQuery = Polymer({
  _template: html`
    <custom-style>
      <style>
        :host {
          display: block;
          --wikipedia-query-body-height: 160px;
        }
        #result {
          height: var(--wikipedia-query-body-height);
          overflow: scroll;
          border: 1px grey solid;
          padding: 8px 16px;
        }
        citation-element {
          background-color: #f8f8f8;
          padding: 16px 8px;
          font-size: 12px;
        }
      </style>
    </custom-style>
    <iron-ajax
      auto
      url$="https://en.wikipedia.org/w/api.php?origin=*&amp;action=query&amp;titles=[[search]]&amp;prop=extracts&amp;format=json"
      handle-as="json"
      on-response="handleResponse"
      debounce-duration="100"
      last-response="{{searchResponse}}"
    ></iron-ajax>
    <h3 hidden$="[[!showTitle]]">[[search]] Wikipedia article</h3>
    <div id="result" hidden$="[[!__rendercontent]]"></div>
    <citation-element
      hidden$="[[!__rendercontent]]"
      creator="{Wikipedia contributors}"
      scope="sibling"
      license="by-sa"
      title="[[search]] --- {Wikipedia}{,} The Free Encyclopedia"
      source="https://en.wikipedia.org/w/index.php?title=[[search]]"
      date="[[__now]]"
    ></citation-element>
  `,

  is: "wikipedia-query",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: {
    /**
     * ShowTitle
     */
    showTitle: {
      type: Boolean,
      value: true
    },
    /**
     * Search string.
     */
    search: {
      type: String,
      value: "Polymer (library)"
    },
    /**
     * Render the response as..
     */
    renderAs: {
      type: String,
      value: "content",
      observer: "_renderAsUpdated"
    },
    /**
     * Response to parse.
     */
    searchResponse: {
      type: Object
    }
  },

  /**
   * attached
   */
  attached: function() {
    let date = new Date(Date.now());
    this.__now =
      date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Wikipedia article",
        description:
          "This can display a wikipedia article in context in a variety of formats.",
        icon: "book",
        color: "green",
        groups: ["Content", "Creative Commons"],
        handles: [
          {
            type: "content",
            title: "search"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "search",
            title: "Search term",
            description: "Word to search wikipedia for.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true
          },
          {
            property: "showTitle",
            title: "Show title",
            description: "Whether or not to render the title of the article.",
            inputMethod: "boolean",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "search",
            title: "Search term",
            description: "Word to search wikipedia for.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true
          }
        ]
      },
      saveOptions: {
        wipeSlot: true
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * Convert renderas into a variable.
   */
  _renderAsUpdated: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this._resetRenderMethods();
      this["__render" + newValue] = true;
    }
  },

  /**
   * Validate input method.
   */
  _validRenderMethods: function() {
    var methods = ["content"];
    return methods;
  },

  /**
   * Reset all our meta attributes.
   */
  _resetRenderMethods: function() {
    let methods = this._validRenderMethods();
    for (var i = 0; i < methods.length; i++) {
      this["__render" + methods[i]] = false;
    }
  },

  /**
   * Process response from wikipedia.
   */
  handleResponse: function(response) {
    // the key of pages is a number so need to look for it
    if (typeof this.searchResponse !== typeof undefined) {
      for (var key in this.searchResponse.query.pages) {
        // skip anything that's prototype object
        if (!this.searchResponse.query.pages.hasOwnProperty(key)) continue;
        // load object response
        var obj = this.searchResponse.query.pages[key];
        let html = obj.extract;
        html = html.replace(/<script[\s\S]*?>/gi, "&lt;script&gt;");
        html = html.replace(/<\/script>/gi, "&lt;/script&gt;");
        html = html.replace(/<style[\s\S]*?>/gi, "&lt;style&gt;");
        html = html.replace(/<\/style>/gi, "&lt;/style&gt;");
        // need to innerHTML this or it won't set
        this.$.result.innerHTML = html;
      }
    }
  }
});
export { WikipediaQuery };
