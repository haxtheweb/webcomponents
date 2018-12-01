import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icons/image-icons.js";
import "./simple-colors-picker-swatch.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
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
    theme: { type: String, value: null },
    contrast: { type: String, value: null },
    contrastLargeText: { type: Boolean, value: !1 },
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    collapsed: { type: Boolean, value: !0, reflectToAttribute: !0 },
    label: { type: String, value: "Pick a color." },
    swatches: { type: Array, value: [] },
    value: { type: Object, value: null },
    selectedStyle: { type: String, computed: "_setSelectedStyle(value)" }
  },
  ready: function() {
    let root = this;
    root.updateSwatches(root.contrast, root.contrastLargeText);
    root.$.button.addEventListener("click", function() {
      root.toggleCollapse();
    });
    root.$.button.addEventListener("keyup", function(e) {
      if (13 === e.keyCode || 32 === e.keyCode) root.toggleCollapse(!1);
    });
  },
  updateSwatches: function(contrast, contrastLargeText) {
    contrast = null !== contrast ? contrast : this.contrast;
    contrastLargeText =
      null !== contrastLargeText ? contrastLargeText : this.contrastLargeText;
    this.contrast = contrast;
    this.contrastLargeText = contrastLargeText;
    let root = this,
      hasContrast = contrast !== void 0 && null !== contrast,
      isColor = !1,
      level = 1,
      isForeground = !0,
      rows = [],
      count = 0;
    if (root.__hexCodes !== void 0 && null !== root.__hexCodes) {
      if (hasContrast) {
        let cssVariable = contrast
            .replace("--simple-colors-", "")
            .split("-theme-"),
          theme = 1 < cssVariable.length ? cssVariable[0] : "",
          colorLevelFg = cssVariable[cssVariable.length - 1].split("-");
        isColor = 1 < colorLevelFg[0].length;
        let levelFg = colorLevelFg[colorLevelFg.length - 1];
        (isForeground = -1 < levelFg.indexOf("foreground")),
          (size = !contrastLargeText);
        level = levelFg[levelFg.length - 1];
      }
      for (let i = 0, swatches; i < root.__hexCodes.colorLevels.length; i++) {
        swatches = [];
        for (let property in root.__hexCodes) {
          let temp =
              isColor || "grey" !== property
                ? root.__wcagaa.colors
                : root.__wcagaa.greys,
            highestLevel = contrastLargeText
              ? temp.large[parseInt(level) - 1]
              : temp.small[parseInt(level) - 1];
          if (
            "colorLevels" !== property &&
            "accent" !== property &&
            root.__hexCodes.hasOwnProperty(property)
          ) {
            let disabledColor = isColor && "grey" !== property,
              disabledLevel = !1,
              lightFg =
                ("light" === root.theme && isForeground) ||
                ("dark" === root.theme && !isForeground);
            if (!lightFg && (5 > i || 10 - i > highestLevel)) {
              disabledLevel = !0;
            } else if (lightFg && (4 < i || i + 1 > highestLevel)) {
              disabledLevel = !0;
            }
            if (!hasContrast || (!disabledColor && !disabledLevel)) {
              swatches.push({
                label: property,
                level: i + 1,
                hex: root.__hexCodes[property][i],
                selected: !1
              });
              count++;
            }
          }
        }
        rows.push(swatches);
      }
    }
    root.$.empty.style.display = 0 < count ? "none" : "block";
    root.$.rows.style.display = 0 === count ? "none" : "block";
    root._updateSelection(rows);
  },
  _onClickSwatch: function(e) {
    console.log("_onClickSwatch", e);
    let dark = "dark" === this.theme,
      theme = null === this.theme ? "" : "-" + this.theme + "-theme",
      color = e.detail.label.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
      isForeground,
      suffix,
      level = parseInt(e.detail.level),
      hex = e.detail.hex;
    if (!dark) {
      if (6 > e.detail.level) {
        isForeground = !0;
      } else {
        isForeground = !1;
        level = 11 - level;
      }
    } else {
      if (6 > e.detail.level) {
        isForeground = !1;
      } else {
        isForeground = !0;
        level = 11 - level;
      }
    }
    if ("dark" === theme) isForeground = !isForeground;
    color = "grey" === color ? "" : color;
    suffix = isForeground ? "foreground" : "background";
    this.value = {
      cssVariable:
        "--simple-colors" + theme + "-" + color + "-" + suffix + level,
      hexCode: hex
    };
    this._updateSelection(this.swatches);
    this.toggleCollapse(!0);
  },
  _updateSelection: function(swatches) {
    let root = this,
      hasHex =
        root.value !== void 0 &&
        null !== root.value &&
        root.value.hexCode !== void 0;
    if (swatches !== void 0 && 0 < swatches.length) {
      let rows = [];
      for (let i = 0, row; i < swatches.length; i++) {
        row = [];
        for (let j = 0, swatch; j < swatches[i].length; j++) {
          swatch = swatches[i][j];
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
  _onPreviousSwatch: function(e) {
    let target = this.shadowRoot.querySelector(
      'simple-colors-picker-swatch[order="' +
        (e.detail.order - 1) +
        '"][level="' +
        e.detail.level +
        '"]'
    );
    if (null !== target) target.focus();
  },
  _onNextSwatch: function(e) {
    let target = this.shadowRoot.querySelector(
      'simple-colors-picker-swatch[order="' +
        (e.detail.order + 1) +
        '"][level="' +
        e.detail.level +
        '"]'
    );
    if (null !== target) target.focus();
  },
  _onPreviousLevel: function(e) {
    let target = this.shadowRoot.querySelector(
      'simple-colors-picker-swatch[order="' +
        e.detail.order +
        '"][level="' +
        (e.detail.level + 1) +
        '"]'
    );
    if (null !== target) target.focus();
  },
  _onNextLevel: function(e) {
    let target = this.shadowRoot.querySelector(
      'simple-colors-picker-swatch[order="' +
        e.detail.order +
        '"][level="' +
        (e.detail.level - 1) +
        '"]'
    );
    if (null !== target) target.focus();
  },
  _setSelectedStyle: function(value) {
    let hex = null !== value ? value.hexCode : "transparent";
    this.$.texture.style.display = null !== value ? "none" : "block";
    if (this.__init !== void 0) {
      this.__init = !0;
    } else {
      this.fire("change", this.value);
    }
    return "background: " + hex + ";";
  },
  toggleCollapse: function(collapse) {
    collapse = collapse !== void 0 ? collapse : !this.collapsed;
    this.collapsed = collapse;
    this.fire("toggleCollapse", this);
  }
});
