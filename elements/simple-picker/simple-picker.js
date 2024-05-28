/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { cache } from "lit/directives/cache.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@lit-labs/virtualizer";
import "./lib/simple-picker-option.js";
/**
   * `simple-picker`
   * a simple picker for options, icons, etc.
   *
  ### Styling
  
  `<simple-picker>` provides the following custom properties and mixins
  for styling:
  
  Custom property | Description | Default
  ----------------|-------------|----------
  `--simple-picker-display` | default display for simple-picker | inline-flex
  `--simple-picker-font-family` | Main font-family. | inherit
  `--simple-picker-font-size` | Main font-size. | inherit
  `--simple-picker-color` | Main text color. | black
  `--simple-picker-color-active` | Color of sample text when button is focused within or hovered. | --simple-picker-color
  `--simple-picker-color-disabled` | Disabled text color. | #555
  `--simple-picker-background-color` | Background color for button. | #f0f0f0
  `--simple-picker-background-color-disabled` | Background color for button when picker is disabled. | #e8e8e8
  `--simple-picker-border-radius` | Main border-radius. | 2px
  `--simple-picker-border-width` | Default border width. | 1px
  `--simple-picker-border-style` | Default border style. | solid
  `--simple-picker-border-color` | Default border color. | --simple-picker-color-disabled
  `--simple-picker-focus-border-width` | Border width when focused within or hovered. | --simple-picker-border-width
  `--simple-picker-focus-border-style` | Border style when focused within or hovered. | --simple-picker-border-style
  `--simple-picker-focus-border-color` | Border color when focused within or hovered. | --simple-picker-border-color
  `--simple-picker-listbox-border-width` | Border width of listbox. | --simple-picker-border-width
  `--simple-picker-listbox-border-style` | Border style of listbox. | --simple-picker-border-style
  `--simple-picker-listbox-border-color` | Border color of listbox. | --simple-picker-border-color
  `--simple-picker-label-color` | Label text color. | --simple-picker-color
  `--simple-picker-float-label-color` | Floating label text color. | --simple-picker-color-disabled
  `--simple-picker-float-label-active-color` | Floating label text color when picker is focused or hovered. | --simple-picker-color-disabled
  `--simple-picker-icon-transform` | Rotation of arrow icon by default. | rotate(0deg)
  `--simple-picker-expanded-icon-transform` | Rotation of arrow icon when picker is expanded. | rotate(0deg)
  `--simple-picker-sample-color` | Sample option text color. | --simple-picker-color
  `--simple-picker-sample-padding` | Sample option padding. | 2px
  `--simple-picker-sample-background-color` | Sample option background-color. | transparent
  `--simple-picker-option-size` | Height of option. | 24px
  `--simple-picker-option-selected-background-color` | Outline for currently sselected option. | --simple-picker-options-background-color
  `--simple-picker-option-active-background-color` | Outline for currently active option. | #aaddff
  `--simple-picker-option-padding` | padding within each simple picker option | 2px 10px
  `--simple-picker-option-label-padding` | adding within each simple picker option's label | --simple-picker-option-padding
  `--simple-picker-options-max-height` | Maximum amount of space listbox can use before scrolling. Use `unset` for now vertical scroll. | 250px
  `--simple-picker-options-border-width` | Border width of listbox. | --simple-picker-border-width
  `--simple-picker-options-border-style` | Border style of listbox. | --simple-picker-border-style
  `--simple-picker-options-border-color` | Border color of listbox. | --simple-picker-border-color
  `--simple-picker-options-background-color` | Background color for listbox. | #fff
  `--simple-picker-height` | Calculation based on option size, padding, and border. DO NOT EDIT. | --simple-picker-option-size - --simple-picker-sample-padding * 2 - --simple-picker-border-width * 2
 *
 * @class SimplePickerBehaviors
 * @demo ./demo/index.html
 */
const SimplePickerBehaviors = function (SuperClass) {
  return class extends SuperClass {
    //styles function
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        css`
          :host {
            --simple-picker-background-color: var(
              --simple-fields-background-color
            );
            --simple-picker-options-background-color: var(
              --simple-fields-background-color
            );
            --simple-picker-color: var(--simple-fields-color, black);
            --simple-picker-color-active: var(
              --simple-fields-faded-background-color,
              orange
            );
            --simple-picker-option-active-color: var(
              --simple-fields-background-color
            );
            --simple-picker-option-active-background-color: var(
              --simple-fields-faded-background-color,
              var(--simple-fields-color)
            );
            display: var(--simple-picker-display, inline-flex);
            align-items: center;
            color: var(--simple-picker-color, currentColor);
            font-family: var(--simple-picker-font-family, inherit);
            font-size: var(--simple-picker-font-size, inherit);
            --simple-picker-height: calc(
              var(--simple-picker-option-size, 24px) +
                var(--simple-picker-sample-padding, 2px) * 2 +
                var(--simple-picker-border-width, 1px) * 2
            );
            min-height: var(--simple-picker-height);
            max-height: var(--simple-picker-height);
          }

          lit-virtualizer {
            min-height: var(--simple-picker-height);
            max-height: var(--simple-picker-height);
            width: 100%;
            display: block;
          }

          :host([block-label]) {
            display: block;
            margin: 0 0 15px;
            max-height: unset;
          }

          :host([disabled]) {
            --simple-picker-color: var(--simple-picker-color-disabled, #545454);
            --simple-picker-background-color: var(
              --simple-picker-background-color-disabled,
              #e8e8e8
            );
            cursor: not-allowed;
            pointer-events: none;
          }

          *[disabled] {
            cursor: not-allowed;
            pointer-events: none !important;
          }

          :host([hidden]) {
            display: none;
          }

          div {
            margin: unset;
            padding: unset;
          }

          label:not([hidden]) {
            display: flex;
            align-items: center;
            padding-right: 5px;
            font-family: var(--simple-picker-font-family, inherit);
            color: var(
              --simple-picker-label-color,
              var(--simple-picker-color, currentColor)
            );
          }

          :host([block-label]) label:not([hidden]) {
            display: block;
            padding-right: 0px;
            color: var(
              --simple-picker-float-label-color,
              var(--simple-picker-color-disabled, #555)
            );
            transition: all 0.5s;
            max-height: unset;
          }

          :host([block-label]:focus-within) label,
          :host([block-label]:hover) label {
            color: var(
              --simple-picker-float-label-active-color,
              var(--simple-picker-color, currentColor)
            );
            transition: all 0.5s;
          }

          #sample,
          .rows {
            margin: 0;
            padding: 0;
          }

          #listbox {
            cursor: pointer;
            position: relative;
            flex: 1 0 auto;
            min-height: var(--simple-picker-height);
            max-height: var(--simple-picker-height);
          }

          #sample {
            display: flex;
            flex: 1 0 auto;
            justify-content: space-between;
            align-items: center;
            min-height: calc(
              var(
                  --simple-picker-height - 2 *
                    var(--simple-picker-sample-padding, 2px)
                ) - 2 * var(--simple-picker-border-width, 1px)
            );
            max-height: calc(
              var(
                  --simple-picker-height - 2 *
                    var(--simple-picker-sample-padding, 2px)
                ) - 2 * var(--simple-picker-border-width, 1px)
            );
            padding: var(--simple-picker-sample-padding, 2px);
            border-radius: var(--simple-picker-border-radius, 2px);
            color: var(--simple-picker-sample-color, currentColor);
            background-color: var(--simple-picker-background-color, #f0f0f0);
            border-width: var(--simple-picker-border-width, 1px);
            border-style: var(--simple-picker-border-style, solid);
            border-color: var(
              --simple-picker-border-color,
              var(--simple-picker-color-disabled, #555)
            );
          }

          :host([hide-sample]) #sample {
            width: var(--simple-picker-option-size);
            overflow: visible;
          }

          :host(:not([disabled]):focus-within) #sample {
            border-width: var(
              --simple-picker-focus-border-width,
              var(--simple-picker-border-width, 1px)
            );
            border-style: var(
              --simple-picker-focus-border-style,
              var(--simple-picker-border-style, solid)
            );
            border-color: var(
              --simple-picker-focus-border-color,
              var(
                --simple-picker-border-color,
                var(--simple-picker-color-disabled, #555)
              )
            );
            transition: all 0.5s;
          }

          :host(:not([disabled]):focus-within) #listbox {
            border-width: var(
              --simple-picker-listbox-border-width,
              var(--simple-picker-border-width, 1px)
            );
            border-style: var(
              --simple-picker-listbox-border-width,
              var(--simple-picker-border-style, solid)
            );
            border-color: var(
              --simple-picker-listbox-border-width,
              var(
                --simple-picker-border-color,
                var(--simple-picker-color-disabled, #555)
              )
            );
          }

          :host(:not([disabled])) #listbox:focus-within,
          :host(:not([disabled]):focus-within) #listbox {
            outline: var(--simple-picker-listbox-outline, unset);
          }

          #icon {
            width: var(--simple-picker-icon-size, 16px);
            height: var(--simple-picker-icon-size, 16px);
            --simple-icon-width: var(--simple-picker-icon-size, 16px);
            --simple-icon-height: var(--simple-picker-icon-size, 16px);
            transform: var(--simple-picker-icon-transform, rotate(0deg));
            transition: transform 0.25s;
          }

          :host([hide-option-labels]) #icon {
            margin-left: calc(-0.125 * var(--simple-picker-icon-size, 16px));
          }

          :host([expanded]) #icon {
            transform: var(
              --simple-picker-expanded-icon-transform,
              rotate(0deg)
            );
            transition: transform 0.25s;
          }

          #collapse {
            display: none;
            position: absolute;
            top: var(--simple-picker-options-top);
            z-index: 2;
            transition: z-index 0s;
          }

          :host([expanded]:not([disabled])) #collapse {
            display: block;
            position: var(--simple-picker-expanded-display, absolute);
            background-color: var(
              --simple-picker-options-background-color,
              #fff
            );
          }

          .rows {
            display: block;
            top: calc(
              var(--simple-picker-option-size, 24px) + 2 *
                var(--simple-picker-options-border-width)
            );
            border-width: var(
              --simple-picker-options-border-width,
              var(--simple-picker-border-width, 1px)
            );
            border-style: var(
              --simple-picker-options-border-style,
              var(--simple-picker-border-style, solid)
            );
            border-color: var(
              --simple-picker-options-border-color,
              var(
                --simple-picker-border-color,
                var(--simple-picker-color-disabled, #555)
              )
            );
            background-color: var(
              --simple-picker-options-background-color,
              #fff
            );
            max-height: var(--simple-picker-options-max-height, 250px);
            overflow-y: auto;
            border: var(--simple-picker-options-border);
            transition: z-index 0s;
          }

          .rows:focus-within {
            border: var(
              --simple-picker-options-focus-border,
              var(--simple-picker-options-border)
            );
          }

          :host([align-right]) #collapse .rows {
            left: unset;
            right: calc(
              var(
                  --simple-picker-options-border-width,
                  var(--simple-picker-border-width, 1px)
                ) * 2
            );
          }

          :host([justify]) #collapse .rows {
            left: 0px;
            right: 0px;
          }

          .row {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
          }

          simple-picker-option {
            z-index: 1;
            flex: 1 1 auto;
            justify-content: flex-start;
            max-height: unset;
            min-height: var(--simple-picker-option-size, 24px);
            min-width: var(--simple-picker-option-size, 24px);
            line-height: var(--simple-picker-option-size, 24px);
            color: var(--simple-picker-color, currentColor);
            background-color: var(
              --simple-picker-options-background-color,
              #fff
            );
            transition: max-height 2s;
            transition: z-index 0s;
          }

          simple-picker-option[selected] {
            z-index: 50;
            color: var(--simple-picker-color, currentColor);
            background-color: var(
              --simple-picker-option-selected-background-color,
              var(--simple-picker-options-background-color, #fff)
            );
          }

          simple-picker-option[active] {
            z-index: 100;
            cursor: pointer;
            color: var(
              --simple-picker-option-active-color,
              var(--simple-picker-color, currentColor)
            );
            background-color: var(
              --simple-picker-option-active-background-color,
              #aaddff
            );
          }

          #sample simple-picker-option {
            color: var(--simple-picker-color, currentColor);
            background-color: var(
              --simple-picker-sample-background-color,
              transparent
            );
            --simple-picker-option-padding: var(
                --simple-picker-sample-padding,
                2px
              )
              0;
            border: none;
          }

          :host([hide-sample]) #sample simple-picker-option {
            position: absolute;
            left: -9999px;
            overflow: hidden;
            width: 0;
            height: 0;
          }

          :host(:focus-within) #sample simple-picker-option,
          :host(:hover) #sample simple-picker-option {
            --simple-picker-color: var(
              --simple-picker-color-active,
              var(--simple-picker-color, currentColor)
            );
          }

          :host(:not([expanded])) #collapse simple-picker-option {
            max-height: 0;
            transition: max-height 1.5s;
          }

          @media screen and (max-width: 600px) {
            :host {
              position: static;
            }

            #collapse {
              top: 0;
              margin-top: 0;
              position: relative;
            }

            .rows {
              position: absolute;
            }
          }
        `,
      ];
    }

    // render function
    render() {
      return html` <label
          id="listLabel"
          for="listbox"
          .hidden="${!this.label || this.label.trim() === ""}"
          part="label"
        >
          ${this.label && this.label.trim() !== "" ? this.label.trim() : ""}
        </label>
        <div
          id="listbox"
          .aria-activedescendant="${this.__activeDesc}"
          .aria-labelledby="${this.ariaLabelledby}"
          .disabled="${this.disabled || !this.__options}"
          part="input"
          tabindex="0"
          @click="${this._handleListboxClick}"
          @mousedown="${this._handleListboxMousedown}"
          @keydown="${this._handleListboxKeydown}"
        >
          <div id="sample" part="sample">
            <simple-picker-option
              ?hide-option-labels="${this.hideOptionLabels}"
              ?title-as-html="${this.titleAsHtml}"
              .icon="${this.__selectedOption
                ? this.__selectedOption.icon
                : false}"
              .label="${this.__selectedOption
                ? this.__selectedOption.alt
                : false}"
              part="sample-option"
              .style=${this.__selectedOption
                ? this.__selectedOption.style
                : false}
              aria-hidden="true"
            >
            </simple-picker-option>
            <simple-icon-lite
              id="icon"
              aria-hidden="true"
              icon="arrow-drop-down"
            ></simple-icon-lite>
          </div>
          <div id="collapse" part="listbox">
            <div class="rows" part="listbox-rows">
              ${cache(
                this.expanded && this.__options
                  ? this._renderOptions(this.__options)
                  : nothing,
              )}
            </div>
          </div>
        </div>`;
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,

        /**
         * allow a null value?
         * Default behavior/false will select first option and set value accordingly.
         */
        allowNull: {
          type: Boolean,
          reflect: true,
          attribute: "allow-null",
        },

        /**
         * Align right edges of listbox and button?
         * Default behavior/false aligns to left edges.
         */
        alignRight: {
          type: Boolean,
          reflect: true,
          attribute: "align-right",
        },

        /**
         * Optional. Sets aria-labelledby attribute
         */
        ariaLabelledby: {
          type: String,
          attribute: "aria-labelledby",
        },

        /**
         * Position label above select dropdown?
         */
        blockLabel: {
          type: Boolean,
          reflect: true,
          attribute: "block-label",
        },

        /**
         * Is picker disabled?
         */
        disabled: {
          type: Boolean,
          reflect: true,
          attribute: "disabled",
        },

        /**
         * Is it expanded?
         */
        expanded: {
          type: Boolean,
          reflect: true,
          attribute: "expanded",
        },

        /**
         * Hide option labels? As color-picker or icon-picker, labels may be redundant.
         * This option would move labels off-screen so that only screen-readers will have them.
         */
        hideOptionLabels: {
          type: Boolean,
          reflect: true,
          attribute: "hide-option-labels",
        },
        /**
         * hide the null option
         * Default behavior/false will select first option and set value accordingly.
         */
        hideNullOption: {
          type: Boolean,
          reflect: true,
          attribute: "hide-null-option",
        },

        /**
         * Hide selected item sample?
         * Default behavior/false shows a sample without expanding menu.
         */
        hideSample: {
          type: Boolean,
          reflect: true,
          attribute: "hide-sample",
        },

        /**
         * Box is 100% width of the ui
         */
        justify: {
          type: Boolean,
          reflect: true,
          attribute: "justify",
        },

        /**
         * Optional. Label for picker input
         */
        label: {
          type: String,
        },

        /**
      * An array of options for picker, eg.: 
   [
     [
       {
         "icon": "editor:format-paint",      //Optional. Used if picker is used as an icon picker.
         "alt": "Blue",                      //Required for accessibility. Alt text description of choice.
         "style": "background-color: blue;", //Optional. Used to set an option's style.
         ...                                 //Optional. Any other properties that should be captured as part of selected option's value
       },...
     ]
   ]
      */
        options: {
          type: Array,
        },

        /**
         * Renders html as title. (Good for titles with HTML in them.)
         */
        titleAsHtml: {
          type: Boolean,
          attribute: "title-as-html",
        },

        /**
         * An string that stores current value for picker
         */
        value: {
          type: String,
          reflect: true,
        },

        /**
         * Aria-activedescendant attribute (active option's ID)
         */
        __activeDesc: {
          type: String,
        },

        /**
      * An array of options for picker, eg.: `
   [
     [
       {
         "icon": "editor:format-paint",      //Optional. Used if picker is used as an icon picker.
         "alt": "Blue",                      //Required for accessibility. Alt text description of choice.
         "style": "background-color: blue;", //Optional. Used to set an option's style.
         ...                                 //Optional. Any other properties that should be captured as part of selected option's value
       },...
     ]
   ]`
      */
        __options: {
          type: Array,
        },

        /**
         * Selected option based on value of picker
         */
        __selectedOption: {
          type: Object,
        },
        /**
         *
         */
        __ready: {
          type: Boolean,
        },
      };
    }

    /**
     * Store the tag name to make it easier to obtain directly.
     * @notice function name must be here for tooling to operate correctly
     */
    static get tag() {
      return "simple-picker";
    }

    // life cycle
    constructor() {
      super();
      this.tag = SimplePicker.tag;
      this.allowNull = false;
      this.alignRight = false;
      this.ariaLabelledby = null;
      this.blockLabel = false;
      this.disabled = false;
      this.expanded = false;
      this.hideOptionLabels = false;
      this.hideSample = false;
      this.label = null;
      this.__ready = false;
      this.options = [];
      this.titleAsHtml = false;
      this.value = null;
      this.__activeDesc = "option-0-0";
      this.__hasLabel = true;
      this.__selectedOption = {};
      this.addEventListener("blur", function (e) {
        this.expanded = false;
      });
      // map our imported properties json to real props on the element
      // @notice static getter of properties is built via tooling
      // to edit modify src/test-lit-properties.json
      let obj = SimplePicker.properties;
      for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
          if (this.hasAttribute(p)) {
            this[p] = this.getAttribute(p);
          } else {
            if (p.reflect) this.setAttribute(p, obj[p].value);
            this[p] = obj[p].value;
          }
        }
      }
    }
    get hideNull() {
      return !this.allowNull || this.hideNullOption;
    }

    _renderOptions(options) {
      return html` <lit-virtualizer
        scroller
        .items=${options || []}
        .renderItem=${this.renderItem.bind(this)}
      ></lit-virtualizer>`;
    }
    renderItem(row, rownum) {
      return html`<div class="row" ?hidden="${!this._isRowHidden(row)}">
        ${Array.isArray(row) ? this._renderRow(row, rownum) : nothing}
      </div>`;
    }
    _isRowHidden(row) {
      return (
        !Array.isArray(row) ||
        row.filter((col) => !!col.value || !this.hideNull).length < 1
      );
    }
    _renderRow(row, rownum) {
      return html`${(row || []).map(
        (option, colnum) => html`
          <simple-picker-option
            @option-focus="${this._handleOptionFocus.bind(this)}"
            @set-selected-option="${this._handleSetSelectedOption}"
            ?active="${`${this.__activeDesc}` === `option-${rownum}-${colnum}`}"
            ?hide-option-labels="${this.hideOptionLabels}"
            ?hidden="${this.hideNull && !option.value}"
            ?selected="${this.value === option.value}"
            ?title-as-html="${this.titleAsHtml}"
            .data="${this.data}"
            .icon="${option.icon}"
            .id="option-${rownum}-${colnum}"
            .label="${option.alt}"
            .style=${option.style}
            aria-selected="${this.value === option.value ? "true" : "false"}"
            role="option"
            tabindex="-1"
            value="${option.value}"
          >
          </simple-picker-option>
        `,
      )}`;
    }
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "value") this._valueChanged(oldValue);
        if (propName === "options") this._optionsChanged(oldValue);
        if (propName === "expanded" && this.shadowRoot && this.expanded) {
          // delay to allow virtualizer to calculate how many
          setTimeout(() => {
            const virtualizer =
              this.shadowRoot.querySelector("lit-virtualizer");
            // only apply the 1st time opening
            if (
              virtualizer &&
              virtualizer.querySelector(".row") &&
              virtualizer.style.width == ""
            ) {
              // gutter accounts for the scrollbar
              let gutter = 40;
              let rowData = virtualizer
                .querySelector(".row")
                .getBoundingClientRect();
              // null initial option which some things allow in their options provided
              if (rowData.width === 0) {
                [...virtualizer.querySelectorAll(".row")].map((item) =>
                  item.getBoundingClientRect().width > rowData.width
                    ? (rowData = item.getBoundingClientRect())
                    : (rowData = rowData),
                );
              }
              // if 1st item is null, we need to account for that when having multiple
              // items in a single row
              if (
                !this.allowNull &&
                ["SIMPLE-SYMBOL-PICKER", "SIMPLE-EMOJI-PICKER"].includes(
                  this.tagName,
                )
              ) {
                gutter =
                  gutter +
                  virtualizer
                    .querySelector(".row")
                    .querySelector(":last-child")
                    .getBoundingClientRect().width;
              }
              // width is what a common row is
              virtualizer.style.width = parseInt(rowData.width + gutter) + "px";
              // test if height is smaller than our lowest value is it doesn't look odd
              // but if we're going to scroll then allow it to scroll
              if (
                rowData.height * virtualizer.querySelectorAll(".row").length <
                150
              ) {
                virtualizer.style.minHeight =
                  parseInt(
                    rowData.height *
                      virtualizer.querySelectorAll(".row").length +
                      2,
                  ) + "px";
              }
              // apply row style so it fills the container when it can
              requestAnimationFrame(() => {
                [...virtualizer.querySelectorAll(".row")].map(
                  (item) => (item.style.width = "-webkit-fill-available"),
                );
              });
              requestAnimationFrame(() => {
                let listbox = this.getBoundingClientRect();
                virtualizer.style.minWidth = parseInt(listbox.width) + "px";
              });
            }
          }, 100);
        }
      });
      /**
       * Fires when properties change
       * @event changed
       */
      this.dispatchEvent(
        new CustomEvent("changed", {
          detail: this,
        }),
      );
    }

    /**
     * returns value of selected option.
     *
     * @param {array} options array of options
     * @param {string} optionId selected option's id
     * @returns {object} selected option
     */
    _getOption(options, optionId) {
      if (
        options !== undefined &&
        optionId !== undefined &&
        optionId !== null
      ) {
        let coords = optionId.split("-");
        return options[coords[1]][coords[2]];
      }
      return null;
    }

    /**
     * sets a new active descendant and sets focus on it
     *
     * @param {number} rownum row number to be tested
     * @param {number} colnum column number to be tested
     * @returns {void}
     */
    _goToOption(rownum, colnum) {
      let target = this.shadowRoot.querySelector(`#option-${rownum}-${colnum}`),
        active = this.shadowRoot.querySelector("#" + this.__activeDesc);
      if (target !== null) {
        target.tabindex = 0; //allow item to be focusable.
        target.focus();
        active.tabindex = -1; //prevent tabbing between options.
      }
    }

    /**
     * handles listbox click event
     * @param {event} e event
     * @returns {void}
     */
    _handleListboxClick(e) {
      if (this.disabled) return;
      /**
       * handles listbox click event
       * @event click
       */
      this.dispatchEvent(new CustomEvent("click", { detail: this }));
      this._toggleListbox();
    }

    /**
     * handles listbox mousedown event
     * @param {event} e event
     * @returns {void}
     */
    _handleListboxMousedown(e) {
      if (this.disabled) return;
      /**
       * fires with listbox mousedown event
       * @event mousedown
       */
      this.dispatchEvent(new CustomEvent("mousedown", { detail: this }));
    }

    /**
     * handles listbox keyboard events
     * @param {event} e event
     * @returns {void}
     */
    _handleListboxKeydown(e) {
      /**
       * fires with listbox keyboard events
       * @event keydown
       */
      if (this.disabled) return;
      this.dispatchEvent(new CustomEvent("keydown", { detail: this }));
      let coords = this.__activeDesc.split("-"),
        rownum = parseInt(coords[1]),
        colnum = parseInt(coords[2]);
      if (e.keyCode === 32) {
        //spacebar
        e.preventDefault();
        this._toggleListbox();
      } else if (this.expanded && [9, 35, 36, 38, 40].includes(e.keyCode)) {
        e.preventDefault();
        if (e.keyCode === 35) {
          //end
          let lastrow = (this.options || []).length - 1,
            lastcol = this.options[lastrow].length - 1;
          this._goToOption(lastrow, lastcol); //move to last option
        } else if (e.keyCode === 36) {
          //home
          this._goToOption(0, 0); //move to first option
        } else if (e.keyCode === 38) {
          //previous (up arrow)
          if (colnum > 0) {
            this._goToOption(rownum, colnum - 1); //move up to previous column
          } else if (rownum > 0) {
            this._goToOption(rownum - 1, this.options[rownum - 1].length - 1); //move up to end of previous row
          }
        } else if (e.keyCode === 40) {
          //next (down arrow)
          if (colnum < this.options[rownum].length - 1) {
            //move down to next column
            this._goToOption(rownum, colnum + 1);
          } else if (rownum < (this.options || []).length - 1) {
            //move down to beginning of next row
            this._goToOption(rownum + 1, [0]);
          }
        }
      }
    }

    /**
     * handles option focus event and sets active descendant
     * @param {event} e event
     * @returns {void}
     */
    _handleOptionFocus(e) {
      this._setActiveOption(e.detail.id);
    }

    /**
     * sets  active descendant to a given option's id
     * @param {string} id option id
     * @returns {void}
     */
    _setActiveOption(id) {
      this.__activeDesc = id;
      /**
       * fires when active descendant changes
       * @event option-focus
       */
      this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
    }

    /**
     * handles change in value
     *
     * @param {object} newValue new value for picker
     * @param {object} oldValue old value for picker
     * @returns {void}
     */
    _valueChanged(oldValue) {
      this._setSelectedOption();
      /**
       * fires when value changes
       * @event value-changed
       */
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          detail: this,
        }),
      );
    }

    /**
     * handles change in options
     * @param {object} newValue new options for picker
     * @param {object} oldValue old options for picker
     * @returns {void}
     */
    _optionsChanged(oldValue) {
      this.__ready = (this.options || []).length > 0;
      if (this.__ready) this._setSelectedOption();
    }

    /**
     * sets selected option to a given option's id
     * @returns {void}
     */
    _setSelectedOption() {
      if (this.__selectedOption && this.__selectedOption.value === this.value)
        return;
      let sel =
        !this.allowNull &&
        (this.options || []).length > 0 &&
        this.options[0].length > 0
          ? this.options[0][0].value
          : null;
      if (this.options && this.options.length > 0) {
        this.__options =
          typeof this.options === "string"
            ? JSON.parse(this.options)
            : this.options;
        //if nulls are allowed, set active descendant to first not null option
        this.__activeDesc = this.allowNull ? "option-0-0" : null;
        for (var i = 0; i < this.__options.length; i++) {
          let found = false;
          for (var j = 0; j < this.__options[i].length; j++) {
            //if unset, set active descendant to first not null option
            if (this.value !== null && this.__activeDesc === null)
              this.__activeDesc = `option-${i}-${j}`;
            if (`${this.__options[i][j].value}` === `${this.value}`) {
              //set active descendant to option that matches value
              this.__activeDesc = `option-${i}-${j}`;
              sel = this.__options[i][j];
              j = this.__options[i].length;
              found = true;
            }
          }
          if (found) i = (this.__options || []).length;
        }
        if (sel === null) this.value = null;
        this.__selectedOption = sel;
      }

      /**
       * fires when options or value changes
       * @event change
       */
      this.dispatchEvent(
        new CustomEvent("change", { bubbles: true, detail: this }),
      );
    }

    /**
     * toggles listbox
     *
     * @param {boolean} open whether to open
     * @returns {void}
     */
    _toggleListbox(open = !this.expanded) {
      if (this.disabled) return;
      let active = this.shadowRoot.querySelector("#" + this.__activeDesc);
      this.expanded = open;
      if (open) {
        if (active !== null) active.focus();
        /**
         * fires when listbox is expanded
         * @event expand
         */
        this.dispatchEvent(new CustomEvent("expand", { detail: this }));
      } else {
        if (active !== null) this.value = active.value;
        /**
         * fires when listbox is collapsed
         * @event collapse
         */
        this.dispatchEvent(new CustomEvent("collapse", { detail: this }));
      }
    }

    /**
     * sets options for picker
     *
     * @param {array} options nested array of options
     * @returns {void}
     */
    setOptions(options) {
      this.set("options", [[]]);
      this.set("options", options);
    }
    /**
     * life cycle, element is removed from DOM
     */
    disconnectedCallback() {
      this.removeEventListener("blur", function (e) {
        this.expanded = false;
      });
      super.disconnectedCallback();
    }
  };
};
/**
 *
 * `simple-picker`
 * a simple picker for options, icons, etc.
 * @demo ./demo/index.html
 *
 * @class SimplePicker
 * @element simple-picker
 * @extends {SimplePickerBehaviors(LitElement)}
 */
class SimplePicker extends SimplePickerBehaviors(LitElement) {}

customElements.define(SimplePicker.tag, SimplePicker);
export { SimplePickerBehaviors, SimplePicker };
