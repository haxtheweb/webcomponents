/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import { SimpleColors } from "../../simple-colors.js";
import "../simple-colors-picker.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";

/**
 * `simple-colors-contrasts`
 * `a select element for changing simple-colors contrasting color in demos`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/contrasts.html demo
 * @see "../simple-colors.js"
 * @see "./demo/simple-colors-picker.js"
 */
class SimpleColorsContrasts extends SimpleColors {
  // render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
        }
        tt {
          font-family: sans-serif;
        }
        li[disabled] label {
        }
        li[disabled] label:after {
          content: "N/A";
          color: red;
          margin-left: 10px;
          text-decoration: none;
        }
        li:last-child > div {
          line-height: 40px;
        }
        div.question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
        }
        div.question > * {
          margin-right: 10px;
          flex: 0 0 auto;
        }
        div.question > *:last-child {
          margin-right: 0px;
          flex: 1 0 auto;
        }
        .swatches,
        .swatch > div {
          display: flex;
          align-items: stretch;
          justify-content: flex-start;
        }
        .swatches {
          flex-wrap: wrap;
          width: 100%;
        }
        .swatch {
          flex: 1 1 50%;
        }
        .swatch > div {
          margin: 5px;
        }
        .swatch > div > * {
          padding: 0 5px;
          line-height: 30px;
        }
        .decoration {
          width: 40px;
          height: 30px;
        }
      </style>
      <ol>
        <li>
          <div class="question">
            <label for="color">What is your main color?</label>
            <simple-colors-picker 
              id="color" 
              dark$="[[dark]]" 
              on-change="_handleColorChange"
              shades
              value$="{{color}}">
            </simple-colors-picker>
           </div>
        </li>
        <li>
          <div class="question">
            <label for="bg">Are you using it as the background-color?</label>
            <input 
              id="bg"
              type="checkbox"
              name="bg" 
              on-change="_handleChange"
              value$="{{usedAsBg}}">
          </div>
        </li>
        <li>
          <div class="question">
            <label for="contrast">What color would you like to contrast?</label>
            <simple-colors-picker 
              id="contrast" 
              dark$="[[dark]]" 
              on-change="_handleContrastChange"
              value$="{{contrast}}">
            </div>
          </li>
          <li>
            <div class="question">
              <label for="decorative">Is the content decorative (like an outline or a border)?<label>
              <input 
                id="decorative"
                type="checkbox" 
                name="decorative" 
                on-change="_handleChange"
                value$="{{decorative}}">
            </div>
          </li>
          <li disabled$="[[decorative]]">
            <div class="question">
              <label for ="disabled">Is the item disabled?</label>
              <input 
                id="disabled"
                type="checkbox"
                hidden$="[[decorative]]" 
                name="disabled" 
                on-change="_handleChange"
                value$="{{disabledUi}}">
            </div>
          </li>
          <li disabled$="[[__disabledFont]]">
            <div class="question">
              <label for="font">What is the font-size?</label>
              <input 
                id="font"
                hidden$="[[__disabledFont]]" 
                type="text" 
                placeholder="14pt" 
                on-change="_handleChange"
                value$="{{fontsize}}">
            </div>
          </li>
         <li disabled$="[[__disabledFont]]">
          <div class="question">
            <label for="bold">Is the font bold?</label>
            <input 
              id="bold"
              type="checkbox" 
              hidden$="[[__disabledFont]]" 
              name="bold" 
              on-change="_handleChange"
              value$="{{bold}}">
          </div>
        </li>
        <li>
          <div>The following colors would meet WCAG 2.0 AA for contrasting <tt id="colorvar"></tt> in your use case:</div>
          <div class="swatches">
            <template is="dom-repeat" items="[[contrasts]]" as="shade">
              <div class="swatch" style$="[[shade.font]]">
                <div>
                  <div class="decoration" style$="[[shade.color]]"></div>
                  <tt class="text">[[shade.value]]</tt>
                </div>
              </div>
            </template>
          </div>
        </li>
      </ol>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Is the text bold?
       */
      bold: {
        name: "bold",
        type: Boolean,
        value: false
      },
      /**
       * The main color
       */
      color: {
        name: "color",
        type: String,
        value: "--simple-colors-default-theme-grey-1"
      },
      /**
       * The name of the contrasting color
       */
      contrast: {
        name: "contrast",
        type: String,
        value: "grey"
      },
      /**
       * Does the content serve a purely decorative purpose? If so, there is no contrast requirement.
       */
      decorative: {
        name: "decorative",
        type: Boolean,
        value: false
      },
      /**
       * Is the UI element disabled? Element does not need higher contrast when disabled.
       */
      __disabledFont: {
        name: "__disabledFont",
        type: Boolean,
        computed: "_getDisabledFont(decorative,disabledUi)"
      },
      /**
       * Is the UI element disabled? Element does not need higher contrast when disabled.
       */
      disabledUi: {
        name: "disabledUi",
        type: Boolean,
        value: false
      },
      /**
       * Font-size of content.
       */
      fontSize: {
        name: "fontSize",
        type: String,
        value: "14pt"
      },

      /**
       * Show all shades instead of just main accent-colors
       */
      shades: {
        name: "shades",
        type: Boolean,
        value: true,
        readOnly: true
      },

      /**
       * Show all shades instead of just main accent-colors
       */
      usedAsBg: {
        name: "usedAsBg",
        type: Boolean,
        value: false
      },

      /**
             * An array of options for the picker, eg.: `
      [
        {
          "icon": "editor:format-paint",      //Optional. Used if the picker is used as an icon picker.
          "alt": "Blue",                      //Required for accessibility. Alt text description of the choice.
          "style": "background-color: blue;", //Optional. Used to set an option's style.
          ...                                 //Optional. Any other properties that should be captured as part of the selected option's value
        },...
      ]`
        */
      contrasts: {
        name: "contrasts",
        type: Array,
        computed:
          "_getContrasts(bold,color,colors,contrast,dark,__disabledFont,fontSize,usedAsBg)",
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
    return "simple-colors-contrasts";
  }

  /**
   * gets the simple-colors behaviors
   */
  static get behaviors() {
    return [SimpleColors];
  }

  /**
   * sets color when contrast color picker changes
   */
  _handleColorChange(e) {
    this.color = e.detail.value;
  }

  /**
   * sets contrast when contrast picker changed
   */
  _handleContrastChange(e) {
    this.contrast = e.detail.value;
  }

  /**
   * sets values when checkboxes or input changes
   */
  _handleChange(e) {
    switch (e.path[0].id) {
      case "decorative":
        this.decorative = e.path[0].checked;
        break;
      case "disabled":
        this.disabledUi = e.path[0].checked;
        break;
      case "bold":
        this.bold = e.path[0].checked;
        break;
      case "font":
        this.fontSize = e.path[0].value;
        break;
      case "bg":
        this.usedAsBg = e.path[0].checked;
        break;
    }
  }

  /**
   * gets options for the selectors
   *
   * @param {boolean} if the item is decorative
   * @param {boolean} if the item is disabled
   * @returns {boolean} whether or not to show the font options
   */
  _getDisabledFont(decorative, disabledUi) {
    console.log("_getDisabledFont", decorative || disabledUi ? true : false);
    return decorative || disabledUi ? true : false;
  }

  /**
   * gets options for the selectors
   *
   * @param {boolean} if the item is decorative
   * @param {boolean} if the item is disabled
   * @param {object} the options object to convert
   */
  _getContrasts(
    bold,
    color,
    colors,
    contrast,
    dark,
    __disabledFont,
    fontSize = "14pt",
    usedAsBg
  ) {
    console.log(this.__disabledFont);
    let options = [],
      disabled = this.__disabledFont !== false,
      wcag = this.__wcagContrast,
      fontUnit = fontSize.includes("pt") ? "pt" : "px",
      fontVal = parseInt(fontSize.replace(fontUnit, "")),
      minBold = fontUnit === "pt" ? 14 : 18.66,
      minReg = fontUnit === "pt" ? 18 : 24,
      size =
        (bold && fontVal > minBold) || fontVal > minReg ? "large" : "small",
      colorData = this.color.replace("--", "").split("-"),
      theme = colorData[2],
      grey =
        colorData[4] === "grey" || contrast === "grey"
          ? "greyOnColor"
          : "colorOnColor",
      level = colorData[5],
      min = disabled ? 1 : wcag[grey][size][level - 1].minLevelContrast,
      max = disabled
        ? this.colors[contrast].length
        : wcag[grey][size][level - 1].maxLevelContrast;
    for (let i = min; i <= max; i++) {
      let color2 = "--simple-colors-" + theme + "-theme-" + contrast + "-" + i;

      options.push({
        value: color2,
        font: "font-size: " + fontVal + fontUnit + ";",
        color: "background-color: var(" + color2 + ");"
      });
    }
    this.$.colorvar.innerHTML = color;
    return options;
  }
}

export { SimpleColorsContrasts };

window.customElements.define(SimpleColorsContrasts.tag, SimpleColorsContrasts);
