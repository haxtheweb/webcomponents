import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/iron-ajax/iron-ajax.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./node_modules/@lrnwebcomponents/citation-element/citation-element.js";
Polymer({
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
          background-color: #F8F8F8;
          padding: 16px 8px;
          font-size: 12px;
        }
      </style>
    </custom-style>
    <iron-ajax auto url$="https://en.wikipedia.org/w/api.php?origin=*&amp;action=query&amp;titles=[[search]]&amp;prop=extracts&amp;format=json" handle-as="json" on-response="handleResponse" debounce-duration="100" last-response="{{searchResponse}}"></iron-ajax>
    <h3 hidden$="[[!showTitle]]">[[search]] Wikipedia article</h3>
    <div id="result" hidden$="[[!__rendercontent]]"></div>
    <citation-element hidden$="[[!__rendercontent]]" creator="{Wikipedia contributors}" scope="sibling" license="by-sa" title="[[search]] --- {Wikipedia}{,} The Free Encyclopedia" source="https://en.wikipedia.org/w/index.php?title=[[search]]" date="[[__now]]"></citation-element>
`,
  is: "wikipedia-query",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: {
    showTitle: { type: Boolean, value: !0 },
    search: { type: String, value: "Polymer (library)" },
    renderAs: { type: String, value: "content", observer: "_renderAsUpdated" },
    searchResponse: { type: Object }
  },
  attached: function() {
    let date = new Date(Date.now());
    this.__now =
      date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    let props = {
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Wikipedia article",
        description:
          "This can display a wikipedia article in context in a variety of formats.",
        icon: "book",
        color: "green",
        groups: ["Content", "Creative Commons"],
        handles: [{ type: "content", title: "search" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "search",
            title: "Search term",
            description: "Word to search wikipedia for.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: !0
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
            required: !0
          }
        ]
      },
      saveOptions: { wipeSlot: !0 }
    };
    this.setHaxProperties(props);
  },
  _renderAsUpdated: function(newValue, oldValue) {
    if (typeof newValue !== typeof void 0) {
      this._resetRenderMethods();
      this["__render" + newValue] = !0;
    }
  },
  _validRenderMethods: function() {
    var methods = ["content"];
    return methods;
  },
  _resetRenderMethods: function() {
    let methods = this._validRenderMethods();
    for (var i = 0; i < methods.length; i++) {
      this["__render" + methods[i]] = !1;
    }
  },
  handleResponse: function(response) {
    if (typeof this.searchResponse !== typeof void 0) {
      for (var key in this.searchResponse.query.pages) {
        if (!this.searchResponse.query.pages.hasOwnProperty(key)) continue;
        var obj = this.searchResponse.query.pages[key];
        let html = obj.extract;
        html = html.replace(/<script[\s\S]*?>/gi, "&lt;script&gt;");
        html = html.replace(/<\/script>/gi, "&lt;/script&gt;");
        html = html.replace(/<style[\s\S]*?>/gi, "&lt;style&gt;");
        html = html.replace(/<\/style>/gi, "&lt;/style&gt;");
        this.$.result.innerHTML = html;
      }
    }
  }
});
