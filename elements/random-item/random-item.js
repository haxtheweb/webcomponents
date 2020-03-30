/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `random-item`
 * @element random-item
 * `show a random item from a list of items`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @demo demo/index.html
 */
class RandomItem extends HTMLElement {
  // render function
  get html() {
    return `
<style>
:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
        </style>
${this.dataPoint}`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Random item",
        description: "Show a random item from a list of items",
        icon: "communication:rss-feed",
        color: "red",
        groups: ["Item"],
        handles: [],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "field",
            title: "Field",
            description: "Field in the file to show",
            inputMethod: "textfield",
            required: false
          },
          {
            property: "source",
            title: "Source",
            description: "URL pointing to a CSV file",
            inputMethod: "haxupload",
            required: true
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      source: {
        name: "source",
        type: String
      },
      field: {
        name: "field",
        type: String
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "random-item";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();

    // set tag for later use
    this.tag = RandomItem.tag;
    this.template = document.createElement("template");

    this.attachShadow({ mode: "open" });

    if (!delayRender) {
      this.render();
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
  }

  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["source", "field"];
  }
  // disconnectedCallback() {}
  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === "source" && newValue) {
      this.source = newValue;
      this.sourceChanged(newValue);
    } else if (attr === "field" && newValue) {
      this.field = newValue;
      if (this.source) {
        this.setDataWithRandom();
      }
    }
  }
  /**
   * source changed
   */
  async sourceChanged(value) {
    let data = await fetch(value).then(function(response) {
      return response.text();
    });
    this.items = this.CSVtoArray(data);
    var heading = this.items.shift();
    this.qKey = heading;
    this.entryPoint = 0;
    this.setDataWithRandom();
  }
  /**
   * Set data with a random value
   */
  setDataWithRandom() {
    for (let key in this.qKey) {
      if (this.qKey[key] === this.field) {
        this.entryPoint = Number(key);
      }
    }
    var qKey = Math.floor(Math.random() * this.items.length);
    this.dataPoint = this.items[qKey][this.entryPoint];
    this.render();
  }
  /**
   * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
   */
  CSVtoArray(text) {
    let p = "",
      row = [""],
      ret = [row],
      i = 0,
      r = 0,
      s = !0,
      l;
    for (l in text) {
      l = text[l];
      if ('"' === l) {
        if (s && l === p) row[i] += l;
        s = !s;
      } else if ("," === l && s) l = row[++i] = "";
      else if ("\n" === l && s) {
        if ("\r" === p) row[i] = row[i].slice(0, -1);
        row = ret[++r] = [(l = "")];
        i = 0;
      } else row[i] += l;
      p = l;
    }
    return ret;
  }
}
window.customElements.define(RandomItem.tag, RandomItem);
export { RandomItem };
