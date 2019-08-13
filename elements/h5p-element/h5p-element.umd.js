/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
/**
 * `h5p-element`
 * `h5p wrapper for loading and presenting .h5p files`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class H5PElement extends LitElement {
  
  // render function
  render() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>${this.source}</div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "H 5-p-element",
    "description": "h5p wrapper for loading and presenting .h5p files",
    "icon": "icons:android",
    "color": "green",
    "groups": [
      "5"
    ],
    "handles": [
      {
        "type": "todo:read-the-docs-for-usage"
      }
    ],
    "meta": {
      "author": "btopro",
      "owner": "The Pennsylvania State University"
    }
  },
  "settings": {
    "quick": [
      {
        "property": "source",
        "description": "",
        "inputMethod": "textfield",
        "required": true,
        "icon": "icons:link",
        "validationType": "url"
      }
    ],
    "configure": [
      {
        "property": "source",
        "description": "",
        "inputMethod": "textfield",
        "required": true,
        "icon": "icons:link",
        "validationType": "url"
      }
    ],
    "advanced": []
  }
};
  }
  // properties available to the custom element for data binding
  static get properties() {
    let props = {
  "source": {
    "name": "source",
    "type": "String",
    "value": "",
    "reflectToAttribute": false,
    "observer": false
  }
};
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "h5p-element";
  }
  /**
   * Register CSS styles
   */
  static get styles() {
    return css`
    :host {
      display: block;
    }
  `;
  }

  // life cycle
  constructor() {
    super();
    
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(H5PElement.haxProperties, H5PElement.tag, this);
  }
  /**
   * life cycle, element removed from DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  // attributeChangedCallback(attr, oldValue, newValue) {}
  
}
customElements.define("h5p-element", H5PElement);
export { H5PElement };
