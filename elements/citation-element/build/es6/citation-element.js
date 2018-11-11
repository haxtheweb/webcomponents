import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        color: var('--license-text-color');
      }
      :host([display-method="footnote"]) {
        visibility: hidden;
        opacity: 0;
      }
      :host([display-method="popup"]) {
        display: block;
      }
      .license-link {
        font-size: 16px;
        line-height: 16px;
        font-style: italic;
      }
      .citation-date {
        font-size: 16px;
        line-height: 16px;
        font-style: italic;
      }
      .license-link img {
        height: 16px;
        min-width: 16px;
        margin-right: 8px;
      }
    </style>
    <meta about\$="[[relatedResource]]" property="cc:attributionUrl" content\$="[[source]]">
    <meta about\$="[[relatedResource]]" property="cc:attributionName" typeof="oer:Text" content\$="[[title]]">
    <meta rel="cc:license" href\$="[[licenseLink]]" content\$="License: [[licenseName]]">
    <cite><a target="_blank" href="[[source]]">[[title]]</a> by [[creator]], licensed under <a class="license-link" target="_blank" href="[[licenseLink]]"><img alt="[[licenseName]] graphic" src="[[licenseImage]]" hidden&="[[!licenseImage]]">[[licenseName]]</a>. Accessed <span class="citation-date">[[date]]</span>.</cite>
`,
  is: "citation-element",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: {
    title: { type: String },
    scope: { type: String, value: "sibling", observer: "_scopeChanged" },
    displayMethod: { type: String, reflectToAttribute: !0 },
    creator: { type: String },
    source: { type: String },
    date: { type: String },
    licenseName: { type: String },
    licenseLink: { type: String },
    license: { type: String, observer: "_licenseUpdated" },
    _aboutLink: {
      type: Object,
      computed: "_generateAboutLink(relatedResource, licenseLink)"
    },
    _licenseLink: { type: Object, computed: "_generateLicenseLink(source)" }
  },
  _generateLicenseLink(source) {
    if (this._licenseLink) {
      document.head.removeChild(this._licenseLink);
    }
    let link = document.createElement("link");
    link.setAttribute("typeof", "resource");
    link.setAttribute("rel", "license");
    link.setAttribute("src", source);
    document.head.appendChild(link);
    return link;
  },
  _generateAboutLink(relatedResource, licenseLink) {
    if (this._aboutLink) {
      document.head.removeChild(this._aboutLink);
    }
    let link = document.createElement("link");
    link.setAttribute("about", relatedResource);
    link.setAttribute("property", "cc:license");
    link.setAttribute("content", licenseLink);
    document.head.appendChild(link);
    return link;
  },
  _scopeChanged: function(newValue) {
    if ("sibling" === newValue && null !== dom(this).previousElementSibling) {
      if (dom(this).previousElementSibling.getAttribute("resource")) {
        this.relatedResource = dom(this).previousElementSibling.getAttribute(
          "resource"
        );
      } else {
        let uuid = this.generateResourceID();
        this.relatedResource = uuid;
        dom(this).previousElementSibling.setAttribute("resource", uuid);
      }
      dom(this).previousElementSibling.setAttribute(
        "prefix",
        this.getAttribute("prefix")
      );
    } else if ("parent" === newValue) {
      if (dom(this).parentNode.getAttribute("resource")) {
        this.relatedResource = dom(this).parentNode.getAttribute("resource");
      } else {
        let uuid = this.generateResourceID();
        this.relatedResource = uuid;
        dom(this).parentNode.setAttribute("resource", uuid);
      }
      dom(this).parentNode.setAttribute("prefix", this.getAttribute("prefix"));
    }
  },
  attached: function() {
    let props = {
      canScale: !1,
      canPosition: !1,
      canEditSource: !1,
      gizmo: {
        title: "Citation",
        description: "A basic citation element with 3 presentation modes",
        icon: "editor:title",
        color: "grey",
        groups: ["Content", "Text", "Copyright"],
        handles: [
          {
            type: "citation",
            source: "source",
            title: "title",
            author: "creator",
            license: "license",
            accessDate: "date"
          },
          { type: "inline", text: "title" }
        ],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the work being cited.",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the work being cited.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "source",
            title: "Source link",
            description: "The source url for the element this is citing.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url"
          },
          {
            property: "date",
            title: "Date accessed",
            description: "The date this was accessed.",
            inputMethod: "textfield",
            icon: "link"
          },
          {
            property: "scope",
            title: "Scope",
            description: "Scope of what to cite.",
            inputMethod: "select",
            options: { sibling: "Sibling element", parent: "Parent element" },
            icon: "code"
          },
          {
            property: "license",
            title: "License",
            description: "The source url for the element this is citing.",
            inputMethod: "select",
            options: this.licenseList("select"),
            icon: "link"
          },
          {
            property: "creator",
            title: "Creator",
            description: "Who made or owns this.",
            inputMethod: "textfield",
            icon: "link"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },
  licenseList: function(mode = "full") {
    let list = {
      by: {
        name: "Attribution",
        link: "https://creativecommons.org/licenses/by/4.0/",
        image: "https://i.creativecommons.org/l/by/4.0/88x31.png"
      },
      "by-sa": {
        name: "Attribution Share a like",
        link: "https://creativecommons.org/licenses/by-sa/4.0/",
        image: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
      },
      "by-nd": {
        name: "Attribution No derivatives",
        link: "https://creativecommons.org/licenses/by-nd/4.0/",
        image: "https://i.creativecommons.org/l/by-nd/4.0/88x31.png"
      },
      "by-nc": {
        name: "Attribution non-commercial",
        link: "https://creativecommons.org/licenses/by-nc/4.0/",
        image: "https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
      },
      "by-nc-sa": {
        name: "Attribution non-commercial share a like",
        link: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        image: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
      },
      "by-nc-nd": {
        name: "Attribution Non-commercial No derivatives",
        link: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
        image: "https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
      }
    };
    if ("select" == mode) {
      var select = {};
      for (var i in list) {
        select[i] = list[i].name;
      }
      return select;
    }
    return list;
  },
  _licenseUpdated: function(newValue) {
    if (typeof newValue !== typeof void 0) {
      var list = this.licenseList();
      if (typeof list[newValue] !== typeof void 0) {
        this.licenseName = list[newValue].name;
        this.licenseLink = list[newValue].link;
        this.licenseImage = list[newValue].image;
      }
    }
  }
});
