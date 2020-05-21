/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `r-coder`
 * `R coder interface for the r-service backend.`
 * @demo demo/index.html
 * @element r-coder
 */
class RCoder extends LitElement {
  
  //styles function
  static get styles() {
    return  [
      
      css`
:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

#editor {
  height: var(--r-coder-editor-height, 300px);
  width: var(--r-coder-editor-width, 100%);
}

#button {
  margin: var(--r-code-button-margin, 10px 0);
}
      `
    ];
  }
  // render function
  render() {
    return html`

<code-editor id="editor" language="r"></code-editor>
<paper-button id="button" ?disabled="${!this.__connected}" @click="${this.process}" raised>Process</paper-button>
<div id="output"></div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "R coder",
    "description": "R coder interface for the r-service backend.",
    "icon": "icons:android",
    "color": "green",
    "groups": ["Coder"],
    "handles": [
      {
        "type": "todo:read-the-docs-for-usage"
      }
    ],
    "meta": {
      "author": "heymp",
      "owner": "PSU"
    }
  },
  "settings": {
    "quick": [],
    "configure": [
      {
        "property": "endpoint",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      }
    ],
    "advanced": []
  }
}
;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
  
  ...super.properties,
  
  "endpoint": {
    "type": String
  },
  "__connected": {
    "type": Boolean
  }
}
;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "r-coder";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated() {
    this.ping();
    this.shadowRoot.getElementById(
      "editor"
    ).editorValue = this.textContent.trim();
  }
  constructor() {
    super();
    this.endpoint = "/service/r-service";
    setTimeout(() => {
      import("@polymer/paper-button/paper-button.js");
      import("@lrnwebcomponents/code-editor/code-editor.js");
    }, 0);
  }

  async ping() {
    const status = await fetch(this.endpoint, {
      method: "GET"
    }).then(res => res.status);
    this.__connected = status === 200;
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}

  async process() {
    const code = this.shadowRoot.getElementById("editor").value;
    const data = await fetch(this.endpoint, {
      method: "POST",
      body: code
    }).then(res => res.text());
    this.shadowRoot.getElementById("output").innerText = data;
  }
}
window.customElements.define(RCoder.tag, RCoder);

export { RCoder };
