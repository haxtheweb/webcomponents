/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `html-block`
 * `A basic HTML block that provides HAXschema wiring`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */
class HtmlBlock extends HTMLElement {
  
  // render function
  get html() {
    return `
<style>

        </style>
<slot></slot>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Html block",
    "description": "A basic HTML block that provides HAXschema wiring",
    "icon": "icons:warning",
    "color": "red",
    "groups": ["Block"],
    "handles": [
      {
        "type": "html",
        "content": "slot"
      }
    ],
    "meta": {
      "author": "btopro",
      "owner": "The Pennsylvania State University"
    }
  },
  "settings": {
    "quick": [],
    "configure": [
      {
        "slot": "",
        "title": "HTML",
        "description": "HTML code you want to present in content",
        "inputMethod": "code-editor"
      }
    ],
    "advanced": []
  }
}
;
  }
  // properties available to the custom element for data binding
    static get properties() {
    return {...super.properties}
;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "html-block";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();

    // set tag for later use
    this.tag = HtmlBlock.tag;
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/HtmlBlock-properties.json
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    // default we block all script unless the user says to do so
    // @todo ensure HAX actually respects this down the road, right now it sanitizes it
    this.allowscript = false;
    this.__ignoreChange = false;
    this.style.display = "block";
    // ensure we keep applying sanitization as needed while monitoring the tree
    this.__observer = new MutationObserver(this.render.bind(this));
    this.__observer.observe(this, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
  }
  render() {
    if (!this.__ignoreChange) {
      if (
        this.allowscript == null ||
        !this.allowscript ||
        typeof this.allowscript === typeof undefined
      ) {
        this.__sanitizeHTML();
      }
    } else {
      this.__ignoreChange = false;
    }
  }

  static get observedAttributes() {
    return ["allowscript"];
  }
  get allowscript() {
    return this.getAttribute("allowscript");
  }
  set allowscript(value) {
    if (value) {
      this.setAttribute("allowscript", "allowscript");
    } else {
      this.removeAttribute("allowscript");
    }
  }
  // disconnectedCallback() {}
  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === "allowscript") {
      if (
        newValue == null ||
        !newValue ||
        typeof newValue === typeof undefined
      ) {
        // we should sanitize innerHTML but create a holding pen for the rawHTML first
        this.__sanitizeHTML();
      } else {
        // see if we had anything in the holding pen
        if (this.__rawHTML) {
          this.__ignoreChange = true;
          this.innerHTML = this.__rawHTML;
        }
      }
    }
  }
  __sanitizeHTML() {
    if (!this.__pen) {
      this.__pen = document.createElement("div");
    }
    this.__pen.innerHTML = this.innerHTML;
    this.__rawHTML = this.__pen.cloneNode(true).innerHTML;
    // clear it up
    if (typeof this.innerHTML === "function") {
      this.innerHTML = this.innerHTML.replace(
        /<script[\s\S]*?>/gi,
        "&lt;script&gt;"
      );
      this.innerHTML = this.innerHTML.replace(
        /<\/script>/gi,
        "&lt;/script&gt;"
      );
    }
  }
}
window.customElements.define(HtmlBlock.tag, HtmlBlock);
export { HtmlBlock };
