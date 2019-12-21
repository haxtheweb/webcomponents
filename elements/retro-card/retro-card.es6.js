/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';

/**
 * `retro-card`
 * `Simple card in a cool retro design`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @customElement retro-card
 */
class RetroCard extends LitElement {
  
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
<div>${this.title}</div>
<div>${this.subtitle}</div>
<div>${this.tags}</div>
<div>${this.source}</div>
<div>${this.hoverSource}</div>
<div>${this.color}</div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Retro card",
    "description": "Simple card in a cool retro design",
    "icon": "icons:android",
    "color": "green",
    "groups": [
      "Card"
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
        "property": "title",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "subtitle",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "tags",
        "description": "",
        "inputMethod": "array",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "source",
        "description": "",
        "inputMethod": "textfield",
        "required": true,
        "icon": "icons:link",
        "validationType": "url"
      },
      {
        "property": "hoverSource",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "color",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      }
    ],
    "advanced": []
  }
};
  }
  // properties available to the custom element for data binding
  static get properties() {
    let props = {
  "title": {
    "name": "title",
    "type": "String",
    "value": "",
    "reflectToAttribute": false,
    "observer": false
  },
  "subtitle": {
    "name": "subtitle",
    "type": "String",
    "value": "",
    "reflectToAttribute": false,
    "observer": false
  },
  "tags": {
    "name": "tags",
    "type": "Array",
    "value": "[]",
    "reflectToAttribute": false,
    "observer": false
  },
  "source": {
    "name": "source",
    "type": "String",
    "value": "",
    "reflectToAttribute": false,
    "observer": false
  },
  "hoverSource": {
    "name": "hoverSource",
    "type": "String",
    "value": "",
    "reflectToAttribute": false,
    "observer": false
  },
  "color": {
    "name": "color",
    "type": "String",
    "value": "",
    "reflectToAttribute": true,
    "observer": false
  }
};
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "retro-card";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
  
}
customElements.define(RetroCard.tag, RetroCard);
export { RetroCard };
