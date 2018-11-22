/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";

export { SimpleColorsSelect };
/**
 * `simple-colors-select`
 * `a seclect element for changing simple-colors attributes`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @see "./simple-colors-select.js"
 * @see "../simple-colors.js"
 * @demo demo/index.html
 */
class SimpleColorsSelect extends PolymerElement {
  // render function
  static get template() {
    return html`
<style is="custom-style">
  :host {
    display: inline-block;
    position: relative;
  }
  :host, :host #button, :host #palette {
    margin: 0;
    padding: 0;
  }
  :host #collapse {
    position: absolute;
    top: var(--simple-colors-picker-preview-size, 20px);
    margin-top: 12px;
  }
  :host([disabled]) #collapse,
  :host([collapsed]) #collapse {
    height: 0;
    overflow: hidden;
    transition: all 0.25s;
    transition-delay: 0.25s;
  }
  :host #palette {
    position: absolute;
    left: 0;
    right: 0;
    display: table;
    border-collapse: collapse;
    z-index: 1000;
    border: 1px solid;
    border-color: var(--simple-colors-picker-button-border-color, --simple-colors-background3);
  }
  :host .row {
    display: table-row;
  }
  :host simple-colors-picker-swatch {
    display: table-cell;
    padding-top: var(--simple-colors-picker-swatch-size, 20px);
    padding-left: var(--simple-colors-picker-swatch-size, 20px);
  }
  :host simple-colors-picker-swatch[disabled] {
    display: none;
  }
  :host .sr-only {
    display: table-cell;
    font-size: 0;
  }
  :host #button {
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: 4px;
    color: var(--simple-colors-picker-button-color, --simple-colors-foreground2);
    border-color: var(--simple-colors-picker-button-border-color, --simple-colors-background3);
    background-color: var(--simple-colors-picker-button-bg-color, --simple-colors-background2);
  }
  :host([disabled]) #button, 
  :host #button[disabled] {
    color: var(--simple-colors-picker-button-disabled-color, --simple-colors-foreground4);
    border-color: var(--simple-colors-picker-button-disabled-border-color, --simple-colors-background5);
    background-color: var(--simple-colors-picker-button-disabled-bg-color, --simple-colors-background4);
    cursor: not-allowed;
  }
  :host(:not([disabled])) #button:focus,
  :host(:not([disabled])) #button:hover {
    color: var(--simple-colors-picker-button-hover-color, --simple-colors-foreground1);
    border-color: var(--simple-colors-picker-button-hover-color, --simple-colors-background5);
    background-color: var(--simple-colors-picker-button-hover-bg-color, --simple-colors-background1);
  }
  :host #button > div {
    margin: 5px;
    border: 1px solid;
    flex-grow: 1;
    border-color: var(--simple-colors-picker-button-hover-color, --simple-colors-background5);
    display: inline-block;
  }
  :host #button > div, :host #button > div iron-icon {
    width: var(--simple-colors-picker-preview-size, 20px);
    height: var(--simple-colors-picker-preview-size, 20px);
  }
  :host(:not([collapsed])) #icon {
    transform: rotate(-90deg);
    transition: transform 0.25s;
  }
  :host #empty {
    padding: 15px;
  }
  @media screen and (max-width: 600px) {
    :host {
      position: static;
    }
    :host #collapse {
      top: 0;
      margin-top: 0;
      position: relative;
    } 
    :host #palette {
      position: sticky;
    }  
  }
</style>
<button id="button" label="[[label]]" disabled\$="[[disabled]]">
<div id="swatch" style="[[selectedStyle]]"><iron-icon id="texture" icon="image:texture"></iron-icon></div>
<span id="icon"><iron-icon icon="arrow-drop-down"></iron-icon></span>
</button>
<div id="collapse" aria-collapsed="[[collapse]]">
<div id="palette">
  <div id="empty">No colors available.</div>
  <template id="rows" is="dom-repeat" items="[[swatches]]" as="row" index-as="level">
    <div class="row">
      <span id="level" class="sr-only">lightness level [[level]]</span>
      <template id="swatches" is="dom-repeat" items="[[row]]" as="swatch" index-as="order">
        <simple-colors-picker-swatch aria-describedby="level" disabled="[[disabled]]" hex="[[swatch.hex]]" label="[[swatch.label]]" level="[[swatch.level]]" order="[[order]]" role="button" selected="[[swatch.selected]]" tabindex="0">
        </simple-colors-picker-swatch>
      </template>
    </div>
  </template>
</div>
</div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * the value of the accent-color `<select>`
       */
      accentColor: {
        name: "accentColor",
        type: "String",
        value: "grey",
        reflectToAttribute: true,
        observer: false
      },
      /**
       * sets the label for the accent-color <select>
       */
      accentLabel: {
        name: "accentLabel",
        type: "String",
        value: "accent-color",
        reflectToAttribute: true,
        observer: false
      },
      /**
       * Show the option as code?
       */
      asCode: {
        name: "nested",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
      },
      /**
       * the colors object, eg.:
`{
    "grey": [ "#ffffff", "#eeeeee", ... "#111111","#000000" ],
    "red": [ "#ffdddd", "#ffaeae", ... "#520000", "#3f0000" ],
    ...
  }`
       */
      colors: {
        name: "colors",
        type: "String",
        value: null,
        reflectToAttribute: false,
        observer: false
      },
      /**
       * the value of the dark `<select>`
       */
      dark: {
        name: "dark",
        type: "String",
        value: "false",
        reflectToAttribute: true,
        observer: false
      },
      /**
       * sets the label for the dark <select>
       */
      darkLabel: {
        name: "darkLabel",
        type: "String",
        value: "dark",
        reflectToAttribute: true,
        observer: false
      },
      /**
       * Can the element inherit attributes from a parent?
       */
      inherit: {
        name: "inherit",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
      },
      /**
       * the colors object, eg.:
`{
    "grey": [ "#ffffff", "#eeeeee", ... "#111111","#000000" ],
    "red": [ "#ffdddd", "#ffaeae", ... "#520000", "#3f0000" ],
    ...
  }`
       */
      options: {
        name: "options",
        type: "Array",
        computed: "_getOptions(colors)",
        reflectToAttribute: false,
        observer: false
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-select";
  }

  /**
   * determines if a given `<option>` is selected based on the option's value and this element's accent-color
   *
   * @param {String} the option's value
   */
  _accentSelected(option) {
    return this.accentColor === option ? "selected" : "";
  }

  /**
   * determines if the element can inherit attirbutes from a parent
   *
   * @param {boolean} the element's inherit property
   */
  _canInherit(inherit) {
    return inherit !== "false" && inherit !== false;
  }

  /**
   * gets the `<option>` text
   *
   * @param {String} the attr that will be set
   * @param {String} the value that will be assigned to the attribute
   */
  _getOption(attr, val) {
    if (val === "parent") {
      if (this.asCode !== false) {
        return (
          attr +
          '$="[[' +
          attr.replace(/-([a-z])/g, function(g) {
            return g[1].toUpperCase();
          }) +
          ']]"'
        );
      } else {
        return "inherit " + attr;
      }
    } else {
      if (this.asCode !== false) {
        return attr + '="' + val + '"';
      } else {
        return val;
      }
    }
  }

  /**
   * gets options for the selectors
   *
   * @param {object} the object to convert
   */
  _getOptions(obj) {
    let colors = JSON.parse(obj),
      options = { dark: [], accent: [] };
    options.dark.push({ name: "", value: "" });
    if (this.inherit !== false)
      options.dark.push({
        name: this._getOption("dark", "parent"),
        value: "parent"
      });
    options.dark.push({ name: this._getOption("dark", "dark"), value: "dark" });
    options.accent.push({ name: "", value: "" });
    if (this.inherit !== false)
      options.accent.push({
        name: this._getOption("accent-color", "parent"),
        value: "parent"
      });
    for (let key in colors) {
      options.accent.push({
        name: this._getOption("accent-color", key),
        value: key
      });
    }
    return options;
  }

  /**
   * fired when select changes
   *
   * @event change
   * @param {object} the event that fires
   */
  _handleSelectChange(e) {
    let val = e.path[0].value !== null ? e.path[0].value : "";
    if (e.path[0].id === "accent") {
      this.accentColor = val;
      this.dispatchEvent(new CustomEvent("accent-change"));
    } else if (e.path[0].id === "dark") {
      this.dark = val;
      this.dispatchEvent(new CustomEvent("dark-change"));
    }
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleColorsSelect.tag, SimpleColorsSelect);
