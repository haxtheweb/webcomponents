/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';

/**
 * `type-writer`
 * `typewritter effect`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @customElement type-writer
 */
class TypeWriter extends LitElement {
  
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
      `
    ];
  }

  // render function
  render() {
    return html`

<slot></slot>
<div>${this.delay}</div>
<div>${this.cursorDuration}</div>
<div>${this.text}</div>
<div>${this.speed}</div>
<div>${this.eraseSpeed}</div>
<div>${this.typing}</div>
<div>${this._length}</div>
<div>${this._oldText}</div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Type writer",
    "description": "typewritter effect",
    "icon": "icons:android",
    "color": "green",
    "groups": [
      "Writer"
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
    "quick": [],
    "configure": [
      {
        "property": "delay",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "cursorDuration",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "text",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "speed",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "eraseSpeed",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "typing",
        "description": "",
        "inputMethod": "boolean",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "_length",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "_oldText",
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
    return {
  ...super.properties,
  
  "delay": {
    "name": "delay",
    "type": Number,
    "value": "0",
    "reflectToAttribute": false,
    "observer": false
  },
  "cursorDuration": {
    "name": "cursorDuration",
    "type": Number,
    "value": "0",
    "reflectToAttribute": false,
    "observer": false
  },
  "text": {
    "name": "text",
    "type": String,
    "value": "",
    "reflectToAttribute": false,
    "observer": false
  },
  "speed": {
    "name": "speed",
    "type": Number,
    "value": "150",
    "reflectToAttribute": false,
    "observer": false
  },
  "eraseSpeed": {
    "name": "eraseSpeed",
    "type": Number,
    "value": "150",
    "reflectToAttribute": false,
    "observer": false
  },
  "typing": {
    "name": "typing",
    "type": Boolean,
    "value": "false",
    "reflectToAttribute": true,
    "observer": false
  },
  "_length": {
    "name": "_length",
    "type": Number,
    "value": "0",
    "reflectToAttribute": false,
    "observer": false
  },
  "_oldText": {
    "name": "_oldText",
    "type": String,
    "value": "",
    "reflectToAttribute": false,
    "observer": false
  }
};
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "type-writer";
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
customElements.define(TypeWriter.tag, TypeWriter);
export { TypeWriter };
