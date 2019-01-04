import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "./simple-colors-picker-swatch.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";

Polymer({
  _template: html`
    <custom-style>
      <style is="custom-style">
        :host {
          display: inline-block;
          position: relative;
        }
        :host,
        :host #button,
        :host #palette {
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
          transition: all 0.3s;
          transition-delay: 0.3s;
        }
        :host #palette {
          position: absolute;
          left: 0;
          right: 0;
          display: table;
          border-collapse: collapse;
          z-index: 1000;
          border: 1px solid;
          border-color: var(
            --simple-colors-picker-button-border-color,
            --simple-colors-background3
          );
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
          color: var(
            --simple-colors-picker-button-color,
            --simple-colors-foreground2
          );
          border-color: var(
            --simple-colors-picker-button-border-color,
            --simple-colors-background3
          );
          background-color: var(
            --simple-colors-picker-button-bg-color,
            --simple-colors-background2
          );
        }
        :host([disabled]) #button,
        :host #button[disabled] {
          color: var(
            --simple-colors-picker-button-disabled-color,
            --simple-colors-foreground4
          );
          border-color: var(
            --simple-colors-picker-button-disabled-border-color,
            --simple-colors-background5
          );
          background-color: var(
            --simple-colors-picker-button-disabled-bg-color,
            --simple-colors-background4
          );
          cursor: not-allowed;
        }
        :host(:not([disabled])) #button:focus,
        :host(:not([disabled])) #button:hover {
          color: var(
            --simple-colors-picker-button-hover-color,
            --simple-colors-foreground1
          );
          border-color: var(
            --simple-colors-picker-button-hover-color,
            --simple-colors-background5
          );
          background-color: var(
            --simple-colors-picker-button-hover-bg-color,
            --simple-colors-background1
          );
        }
        :host #button > div {
          margin: 5px;
          border: 1px solid;
          flex-grow: 1;
          border-color: var(
            --simple-colors-picker-button-hover-color,
            --simple-colors-background5
          );
          display: inline-block;
        }
        :host #button > div,
        :host #button > div iron-icon {
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
    </custom-style>
    <button id="button" label="[[label]]" disabled\$="[[disabled]]">
      <div id="swatch" style="[[selectedStyle]]">
        <iron-icon id="texture" icon="image:texture"></iron-icon>
      </div>
      <span id="icon"><iron-icon icon="arrow-drop-down"></iron-icon></span>
    </button>
    <div id="collapse" aria-collapsed="[[collapse]]">
      <div id="palette">
        <div id="empty">No colors available.</div>
        <template
          id="rows"
          is="dom-repeat"
          items="[[swatches]]"
          as="row"
          index-as="level"
        >
          <div class="row">
            <span id="level" class="sr-only">lightness level [[level]]</span>
            <template
              id="swatches"
              is="dom-repeat"
              items="[[row]]"
              as="swatch"
              index-as="order"
            >
              <simple-colors-picker-swatch
                aria-describedby="level"
                disabled="[[disabled]]"
                hex="[[swatch.hex]]"
                label="[[swatch.label]]"
                level="[[swatch.level]]"
                order="[[order]]"
                role="button"
                selected="[[swatch.selected]]"
                tabindex="0"
              >
              </simple-colors-picker-swatch>
            </template>
          </div>
        </template>
      </div>
    </div>
  `,

  is: "simple-colors-picker",

  listeners: {
    "click-swatch": "_onClickSwatch",
    "previous-swatch": "_onPreviousSwatch",
    "next-swatch": "_onNextSwatch",
    "previous-level": "_onPreviousLevel",
    "next-level": "_onNextLevel"
  },

  properties: {
    /**
     * The theme for the color variables
     */
    theme: {
      type: String,
      value: null
    },
    /**
     * Only show colors that contrast with supplied color variable?
     */
    contrast: {
      type: String,
      value: null
    },
    /**
     * Expand contrasting colors to WCAG 2.0 AA for large text?
     * Default is WCAG 2.0 AA small text.
     */
    contrastLargeText: {
      type: Boolean,
      value: false
    },
    /**
     * is the picker disabled?
     */
    disabled: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * is the picker collapsed?
     */
    collapsed: {
      type: Boolean,
      value: true,
      reflectToAttribute: true
    },
    /**
     * The label for the color picker input
     */
    label: {
      type: String,
      value: "Pick a color."
    },
    /**
     * The swatches for the color picker
     */
    swatches: {
      type: Array,
      value: []
    },
    /**
     * An object with the variable and hex code for the selected color
     */
    value: {
      type: Object,
      value: null
    },
    /**
     * CSS to preview selected swatch
     */
    selectedStyle: {
      type: String,
      computed: "_setSelectedStyle(value)"
    }
  },

  /**
   * Load swatches and listen for button click
   */
  ready: function() {
    let root = this;
    root.updateSwatches(root.contrast, root.contrastLargeText);

    // click button to expand swatches
    root.$.button.addEventListener("click", function() {
      root.toggleCollapse();
    });

    // use spacebar or enter keys on button to expand swatches
    root.$.button.addEventListener("keyup", function(e) {
      if (e.keyCode === 13 || e.keyCode === 32) root.toggleCollapse(false);
    });
  },

  /**
   * updates swatches
   */
  updateSwatches: function(contrast, contrastLargeText) {
    contrast = contrast !== null ? contrast : this.contrast;
    contrastLargeText =
      contrastLargeText !== null ? contrastLargeText : this.contrastLargeText;
    this.contrast = contrast;
    this.contrastLargeText = contrastLargeText;
    let root = this,
      hasContrast = contrast !== undefined && contrast !== null,
      isColor = false,
      level = 1,
      isForeground = true,
      rows = [],
      count = 0;
    if (root.__hexCodes !== undefined && root.__hexCodes !== null) {
      if (hasContrast) {
        let cssVariable = contrast
            .replace("--simple-colors-", "")
            .split("-theme-"),
          theme = cssVariable.length > 1 ? cssVariable[0] : "",
          colorLevelFg = cssVariable[cssVariable.length - 1].split("-");
        isColor = colorLevelFg[0].length > 1;
        let levelFg = colorLevelFg[colorLevelFg.length - 1];
        (isForeground = levelFg.indexOf("foreground") > -1),
          (size = !contrastLargeText);
        level = levelFg[levelFg.length - 1];
      }
      for (let i = 0; i < root.__hexCodes.colorLevels.length; i++) {
        let swatches = [];
        for (let property in root.__hexCodes) {
          let temp =
              isColor || property !== "grey"
                ? root.__wcagaa.colors
                : root.__wcagaa.greys,
            highestLevel = contrastLargeText
              ? temp.large[parseInt(level) - 1]
              : temp.small[parseInt(level) - 1];
          if (
            property !== "colorLevels" &&
            property !== "accent" &&
            root.__hexCodes.hasOwnProperty(property)
          ) {
            let disabledColor = isColor && property !== "grey",
              disabledLevel = false,
              lightFg =
                (root.theme === "light" && isForeground) ||
                (root.theme === "dark" && !isForeground);
            if (!lightFg && (i < 5 || 10 - i > highestLevel)) {
              disabledLevel = true;
            } else if (lightFg && (i > 4 || i + 1 > highestLevel)) {
              disabledLevel = true;
            }
            if (!hasContrast || (!disabledColor && !disabledLevel)) {
              swatches.push({
                label: property,
                level: i + 1,
                hex: root.__hexCodes[property][i],
                selected: false
              });
              count++;
            }
          }
        }
        rows.push(swatches);
      }
    }
    root.$.empty.style.display = count > 0 ? "none" : "block";
    root.$.rows.style.display = count === 0 ? "none" : "block";
    root._updateSelection(rows);
  },

  /**
   * action for when a swatch was selected
   */
  _onClickSwatch: function(e) {
    console.log("_onClickSwatch", e);
    let dark = this.theme === "dark",
      theme = this.theme === null ? "" : "-" + this.theme + "-theme",
      color = e.detail.label.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
      isForeground,
      suffix,
      level = parseInt(e.detail.level),
      hex = e.detail.hex;
    if (!dark) {
      if (e.detail.level < 6) {
        isForeground = true;
      } else {
        isForeground = false;
        level = 11 - level;
      }
    } else {
      if (e.detail.level < 6) {
        isForeground = false;
      } else {
        isForeground = true;
        level = 11 - level;
      }
    }
    if (theme === "dark") isForeground = !isForeground;
    color = color === "grey" ? "" : color;
    //close swatches, set value and fire event
    suffix = isForeground ? "foreground" : "background";
    this.value = {
      cssVariable:
        "--simple-colors" + theme + "-" + color + "-" + suffix + level,
      hexCode: hex
    };
    this._updateSelection(this.swatches);
    this.toggleCollapse(true);
  },

  /**
   * navigate swatch cursor to left
   */
  _updateSelection: function(swatches) {
    let root = this,
      hasHex =
        root.value !== undefined &&
        root.value !== null &&
        root.value.hexCode !== undefined;
    if (swatches !== undefined && swatches.length > 0) {
      let rows = [];
      for (let i = 0; i < swatches.length; i++) {
        let row = [];
        for (let j = 0; j < swatches[i].length; j++) {
          let swatch = swatches[i][j];
          swatch.selected = hasHex && root.value.hexCode === swatch.hex;
          row.push(swatch);
        }
        rows.push(row);
      }
      root.set("swatches", []);
      root.$.rows.render();
      root.set("swatches", rows);
      root.$.rows.render();
    }
  },

  /**
   * navigate swatch cursor to left
   */
  _onPreviousSwatch: function(e) {
    let target = this.shadowRoot.querySelector(
      'simple-colors-picker-swatch[order="' +
        (e.detail.order - 1) +
        '"][level="' +
        e.detail.level +
        '"]'
    );
    if (target !== null) target.focus();
  },

  /**
   * navigate swatch cursor to right
   */
  _onNextSwatch: function(e) {
    let target = this.shadowRoot.querySelector(
      'simple-colors-picker-swatch[order="' +
        (e.detail.order + 1) +
        '"][level="' +
        e.detail.level +
        '"]'
    );
    if (target !== null) target.focus();
  },

  /**
   * navigate swatch cursor down
   */
  _onPreviousLevel: function(e) {
    let target = this.shadowRoot.querySelector(
      'simple-colors-picker-swatch[order="' +
        e.detail.order +
        '"][level="' +
        (e.detail.level + 1) +
        '"]'
    );
    if (target !== null) target.focus();
  },

  /**
   * navigate swatch cursor up
   */
  _onNextLevel: function(e) {
    let target = this.shadowRoot.querySelector(
      'simple-colors-picker-swatch[order="' +
        e.detail.order +
        '"][level="' +
        (e.detail.level - 1) +
        '"]'
    );
    if (target !== null) target.focus();
  },

  /**
   * update selected swatch preview's background color
   */
  _setSelectedStyle: function(value) {
    let hex = value !== null ? value.hexCode : "transparent";
    this.$.texture.style.display = value !== null ? "none" : "block";
    if (this.__init !== undefined) {
      this.__init = true;
    } else {
      this.fire("change", this.value);
    }
    return "background: " + hex + ";";
  },

  /**
   * toggle the collapse
   */
  toggleCollapse: function(collapse) {
    collapse = collapse !== undefined ? collapse : !this.collapsed;
    this.collapsed = collapse;
    this.fire("toggleCollapse", this);
  }
});
