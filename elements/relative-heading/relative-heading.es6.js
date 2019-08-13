/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
/**
 * `relative-heading`
 * `outputs the correct heading hierarchy based on parent&#39;s heading`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RelativeHeading extends PolymerElement {
  
  // render function
  static get template() {
    return html`
<style>:host {
  display: block;
}
:host([hidden]) {
  display: none;
}
:host h1,
:host h2,
:host h3,
:host h4,
:host h5,
:host h6 {
  
  @apply --relative-heading-style;
}
:host h1 {
  @apply --relative-heading-h1;
}
:host h2 {
  @apply --relative-heading-h2;
}
:host h3 {
  @apply --relative-heading-h3;
}
:host h4 {
  @apply --relative-heading-h4;
}
:host h5 {
  @apply --relative-heading-h5;
}
:host h6 {
  @apply --relative-heading-h6;
}</style>
<h1 aria-live="polite" hidden="[[!__isLevel1]]">[[text]]</h1>
<h2 aria-live="polite" hidden="[[!__isLevel2]]">[[text]]</h2>
<h3 aria-live="polite" hidden="[[!__isLevel3]]">[[text]]</h3>
<h4 aria-live="polite" hidden="[[!__isLevel4]]">[[text]]</h4>
<h5 aria-live="polite" hidden="[[!__isLevel5]]">[[text]]</h5>
<h6 aria-live="polite" hidden="[[!__isLevel6]]">[[text]]</h6>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Relative heading",
    "description": "outputs the correct heading hierarchy based on parent's heading",
    "icon": "icons:android",
    "color": "green",
    "groups": ["Heading"],
    "handles": [
      {
        "type": "todo:read-the-docs-for-usage"
      }
    ],
    "meta": {
      "author": "nikkimk",
      "owner": "The Pennsylvania State University"
    }
  },
  "settings": {
    "quick": [],
    "configure": [
      {
        "property": "parentHeading",
        "description": "",
        "inputMethod": "array",
        "required": false,
        "icon": "icons:android"
      },
      {
        "property": "tag",
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
    let props = {
  /**
   * The default heading level (1-6), eg., 1 for <h1>, if there  is no parent.
   */
  "defaultLevel": {
    "name": "defaultLevel",
    "type": Number,
    "value": 1
  },
  /**
   * The relative-heading's UUID.
   */
  "id": {
    "name": "id",
    "type": String,
    "value": null,
    "observer": "_updateChildren"
  },
  /**
   * The parent relative-heading's UUID.
   */
  "parentId": {
    "name": "parentId",
    "type": String,
    "value": null
  },
  /**
   * The heading text.
   */
  "text": {
    "name": "text",
    "type": String,
    "value": null
  },
  /**
   * The heading level (1-6), eg., 1 for <h1>
   */
  "level": {
    "name": "level",
    "type": Number,
    "reflectToAttribute": true,
    "computed": "_getLevel(parentId,defaultLevel)",
    "observer": "_updateChildren"
  },
  /**
   * Is the heading an h1?
   */
  "__isLevel1": {
    "name": "__isLevel1",
    "type": Boolean,
    "computed": "_isLevel(level,1)"
  },
  /**
   * Is the heading an h2?
   */
  "__isLevel2": {
    "name": "__isLevel2",
    "type": Boolean,
    "computed": "_isLevel(level,2)"
  },
  /**
   * Is the heading an h3?
   */
  "__isLevel3": {
    "name": "__isLevel3",
    "type": Boolean,
    "computed": "_isLevel(level,3)"
  },
  /**
   * Is the heading an h4?
   */
  "__isLevel4": {
    "name": "__isLevel4",
    "type": Boolean,
    "computed": "_isLevel(level,4)"
  },
  /**
   * Is the heading an h5?
   */
  "__isLevel5": {
    "name": "__isLevel5",
    "type": Boolean,
    "computed": "_isLevel(level,5)"
  },
  /**
   * Is the heading an h6?
   */
  "__isLevel6": {
    "name": "__isLevel6",
    "type": Boolean,
    "computed": "_isLevel(level,6)"
  }
}
;
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "relative-heading";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(
      RelativeHeading.haxProperties,
      RelativeHeading.tag,
      this
    );
  }
  /**
   * update this level when the parent id changes
   */
  _getLevel(parentId, defaultLevel) {
    let root = this,
      parent = document.querySelector("#" + parentId),
      parentLvl =
        parent !== null && parent.level !== undefined
          ? parent.level
          : defaultLevel - 1,
      level = parentLvl < 6 ? parentLvl + 1 : 6;
    return level;
  }
  _updateChildren() {
    document
      .querySelectorAll('relative-heading[parent-id="' + this.id + '"]')
      .forEach(child => {
        child.parentId = null;
        child.parentId = this.id;
      });
  }
  /**
   * determines if the level matches a specific level
   *
   * @param {number} the heading level
   * @param {number} the level it might match
   * @returns {boolean} whether or not they match
   */
  _isLevel(level, testLevel) {
    return level === testLevel;
  }
  /**
   * life cycle, element is removed from the DOM
   * /
  disconnectedCallback() {
  }*/
}
window.customElements.define(RelativeHeading.tag, RelativeHeading);
export { RelativeHeading };
