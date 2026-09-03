import { LitElement, html, css } from "lit";
import {
  SimpleFieldsBaseStyles,
  SimpleFieldsLabelStyles,
  SimpleFieldsDescriptionStyles,
  SimpleFieldsRowStyles,
  SIMPLE_FIELDS_INLINE_DESCRIPTION_MAX_WORDS,
} from "./simple-fields-ui.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

/**
 * @class SimpleFieldsContainerBehaviors
 */
const SimpleFieldsContainerBehaviors = function (SuperClass) {
  return class extends SuperClass {
    static get tag() {
      return "simple-fields-container";
    }
    static get styles() {
      return [
        ...SimpleFieldsBaseStyles,
        ...SimpleFieldsLabelStyles,
        ...SimpleFieldsDescriptionStyles,
        ...SimpleFieldsRowStyles,
        css`
          .info-toggle {
            --simple-fields-info-icon-size: var(--ddd-icon-4xs);
            width: var(--simple-fields-info-icon-size);
            height: var(--simple-fields-info-icon-size);
            --simple-icon-width: var(
              --simple-fields-info-icon-size);
            --simple-icon-height: var(--simple-fields-info-icon-size);
            color: var(
              --simple-fields-info-icon-color,
              var(--simple-fields-meta-color, currentColor)
            );
            margin: -2px 8px 0 8px;
            flex: initial;
          }
          .label-main {
            display: flex;
            align-items: center;
          }
          .label-text {
            display: flex;
            flex-direction: column;
          }
          :host {
            display: block;
          }
          :host([error]) {
            color: var(--simple-fields-error-color, #b40000);
            transition: color 0.3s ease-in-out;
          }
          :host([disabled]) {
            color: var(--simple-fields-disabled-color, #999999);
          }
          .field-main.inline,
          .field-main > div,
          #field-bottom {
            display: flex;
            align-items: stretch;
            justify-content: flex-start;
          }
          /* Ubuntu-style row layout for slotted fields (issue #2996):
             the field-inner group pins right and sizes to content instead
             of stretching full-width, so a slotted control (e.g.
             simple-colors-picker) sits compact on the right. */
          .field-main.row-layout [part="field-inner"] {
            flex: 0 1 auto;
          }
          .field-main.row-layout ::slotted([slot="field"]) {
            flex: 0 0 auto;
            width: auto;
          }
          /* Phase 5: slotted text entry fields (issue #2996) fill the right
             side of the row (vs compact slotted pickers), so the field-inner
             grows and the slotted input/textarea fills it. Scoped by the
             reflected [type] host attribute. */
          :host([type="text"]) .field-main.row-layout [part="field-inner"],
          :host([type="textarea"]) .field-main.row-layout [part="field-inner"],
          :host([type="password"]) .field-main.row-layout [part="field-inner"],
          :host([type="email"]) .field-main.row-layout [part="field-inner"],
          :host([type="tel"]) .field-main.row-layout [part="field-inner"],
          :host([type="url"]) .field-main.row-layout [part="field-inner"],
          :host([type="search"]) .field-main.row-layout [part="field-inner"] {
            flex: 1 1 auto;
          }
          .field-main.row-layout ::slotted(input[type="text"]),
          .field-main.row-layout ::slotted(input[type="password"]),
          .field-main.row-layout ::slotted(input[type="email"]),
          .field-main.row-layout ::slotted(input[type="tel"]),
          .field-main.row-layout ::slotted(input[type="url"]),
          .field-main.row-layout ::slotted(input[type="search"]),
          .field-main.row-layout ::slotted(textarea) {
            flex: 1 1 auto;
            width: 100%;
            min-width: 0;
          }
          * {
            flex: 1 1 auto;
          }
          #fieldmeta {
            text-align: right;
          }
          .field,
          ::slotted([slot="field"]) {
            width: auto;
            border: var(--simple-fields-input-border, none);
            color: var(--simple-fields-color, currentColor);
            background-color: var(
              --simple-fields-input-background-color,
              transparent
            );
            transition: opacity ease-in-out;
            flex: 1 0 auto;
          }
          ::slotted([slot="field"]:focus) {
            outline: none;
          }
          :host[inline] ::slotted([slot="field"]:focus),
          ::slotted([type="checkbox"][slot="radio"]:focus),
          ::slotted([type="checkbox"][slot="field"]:focus) {
            outline: unset;
          }
          .field-main.inline .field,
          .field-main.inline ::slotted([slot="field"]) {
            min-width: var(--simple-fields-detail-line-height, 22px);
            height: var(--simple-fields-detail-line-height, 22px);
            margin: 0 var(--simple-fields-margin-small, 8px) 0 0;
          }
          .field[disabled],
          :host([readonly]) ::slotted([slot="field"]) {
            opacity: var(--simple-fields-disabled-opacity, 0.7);
            transition: opacity ease-in-out;
          }
          .field[readonly],
          .field[disabled],
          :host([readonly]) ::slotted([slot="field"]),
          :host([disabled]) ::slotted([slot="field"]) {
            cursor: not-allowed;
            pointer-events: none;
          }
          ::slotted(label:hover),
          ::slotted(label:focus),
          ::slotted(label:focus-within) {
            color: var(--simple-fields-accent-color, #3f51b5);
            transition: background-color 0.3s ease-in-out;
          }
          ::slotted(input) {
            padding: 0px;
          }
          ::slotted(textarea[slot="field"]) {
            margin: 0;
            transition: height 0.6s ease-in-out;
            box-sizing: border-box;
            vertical-align: bottom;
          }
          ::slotted(fieldset[slot="field"]) {
            margin: 0;
            padding: 0;
            border: none;
            font-size: var(--simple-fields-font-size, 16px);
            font-family: var(--simple-fields-font-family, sans-serif);
            line-height: var(--simple-fields-line-height, 22px);
            display: var(--simple-fields-radio-option-display, block);
            flex-wrap: var(--simple-fields-radio-option-flex-wrap, wrap);
            transition: color 0.3s ease-in-out;
          }
          ::slotted(fieldset[slot="field"]:hover),
          ::slotted(fieldset[slot="field"]:focus),
          ::slotted(fieldset[slot="field"]:focus-within) {
            color: var(--simple-fields-accent-color, #3f51b5);
          }
        `,
      ];
    }
    render() {
      return html` ${this.fieldMainTemplate} ${this.fieldBottom} `;
    }
    static get properties() {
      return {
        /**
         * Automatically validate field
         */
        autovalidate: {
          type: Boolean,
        },
        /**
         * a counter text and textareas: "character", "word" or unset for none
         */
        counter: {
          type: String,
        },
        /**
         * Optional description of the field (or use slot="description")
         */
        description: {
          type: String,
        },
        /**
         * Whether the form control is disabled
         */
        disabled: {
          type: Boolean,
          reflect: true,
        },
        /**
         * Optional validation error message to display
         */
        defaultErrorMessage: {
          type: String,
        },
        /**
         * Optional required validation error message to display
         */
        defaultRequiredMessage: {
          type: String,
        },
        /**
         * Whether field has errors
         */
        error: {
          type: Boolean,
          reflect: true,
        },
        /**
         * Validation error message to display
         */
        errorMessage: {
          type: String,
        },
        /**
         * Whether the field is hidden
         */
        hidden: {
          type: Boolean,
          reflect: true,
        },
        /**
         * Field element
         */
        field: {
          type: Object,
        },
        /**
         * Unique id
         */
        id: {
          type: String,
          reflect: true,
        },
        /**
         * Whether field and label should be inline
         */
        inline: {
          type: Boolean,
          reflect: true,
        },
        /**
         * Label for the field (or use slot="label")
         */
        label: {
          type: String,
        },
        /**
         * Minimum number of checked items in fieldset
         */
        minchecked: {
          type: Number,
        },
        /**
         * Minimum number of checked items in fieldset
         */
        maxchecked: {
          type: Number,
        },
        /**
         * Maximum number of words in textarea
         */
        maxwords: {
          type: Number,
        },
        /**
         * Name of the input form control. Submitted with the form as part of a name/value pair.
         */
        name: {
          type: String,
          reflect: true,
        },
        /**
         * error message when number of items selected is not between min and max
         */
        numberMessage: {
          type: String,
        },
        /**
         * regex pattern the value must match to be valid
         */
        pattern: {
          type: String,
        },
        /**
         * error message when field does not match pattern
         */
        patternMessage: {
          type: String,
        },
        /**
         * Optional prefix string (or use slot="prefix")
         */
        prefix: {
          type: String,
        },
        /**
         * Value is not editable
         */
        readonly: {
          type: Boolean,
          reflect: true,
        },
        /**
         * Whether field is required
         */
        required: {
          type: Boolean,
          reflect: true,
        },
        /**
         * error message when field is required and has no value
         */
        requiredMessage: {
          type: String,
        },
        /**
         * Optional suffix string (or use slot="suffix")
         */
        suffix: {
          type: String,
        },
        /**
         * Type of input form control
         */
        type: {
          type: String,
          reflect: true,
        },
        /**
         * List of valid field types
         */
        validTypes: {
          type: Array,
        },
        /**
         * a simple boolean so that we can easily select ALL
         * things derived from simple fields regardless of
         * their eventual tag name
         */
        isSimpleFieldType: {
          type: Boolean,
          reflect: true,
          attribute: "is-simple-field-type",
        },
        /**
         * Value of field
         */
        value: {
          type: Object,
        },
        /**
         * delays focus even until field is attached
         */
        __delayedFocus: {
          type: Boolean,
        },
      };
    }
    constructor() {
      super();
      this.isSimpleFieldType = true;
      this.counter = "none";
      this.autovalidate = false;
      this.disabled = false;
      this.hidden = false;
      this.error = false;
      this.id = this._generateUUID();
      this.inline = false;
      this.blockList = false;
      this.validTypes = [
        "checkbox",
        "color",
        "date",
        "datetime-local",
        "email",
        "file",
        "fieldset",
        "hidden",
        "month",
        "number",
        "password",
        "radio",
        "range",
        "search",
        "select",
        "tel",
        "text",
        "textarea",
        "time",
        "url",
        "week",
      ];
      this._observeAndListen();
      this.addEventListener("click", this.focus);
    }
    disconnectedCallback() {
      this.removeEventListener("click", this.focus);
      super.disconnectedCallback();
    }

    /**
     * makes a field autogrow
     *
     * @memberof SimpleFieldsContainer
     */
    autoGrow(field = this.field) {
      if (this.field) {
        this.field.style.height = "auto";
        // @todo this breaks if we're inside of a tab / element is not visible
        // when value changes
        this.field.style.height = `${this.field.scrollHeight}px`;
        this.field.style.overflowY = "hidden";
      }
    }
    /**
     * updates slotted field
     *
     * @memberof SimpleFieldsContainer
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) super.firstUpdated(changedProperties);
      this._updateField();
    }
    /**
     * updates for slotted input
     * overrride for shadow DOM
     *
     * @param {*} changedProperties
     * @memberof SimpleFieldsContainer
     */
    updated(changedProperties) {
      // mirror isRowBasedField onto the host as a [row-layout] attribute
      // (issue #2996) so shared :host([row-layout]) hover/focus/description
      // CSS applies to slotted-field containers (e.g. simple-colors-picker)
      // the same way it applies to shadow-DOM simple-fields-field hosts.
      if (this.isRowBasedField) this.setAttribute("row-layout", "");
      else this.removeAttribute("row-layout");
      let errorChanged = false;
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "error" && this.error !== oldValue)
          errorChanged = true;
        if (propName === "errorMessage" && this.errorMessage !== oldValue)
          errorChanged = true;
        if (propName === "error" && this.field) {
          this.field.setAttribute(
            "aria-invalid",
            this.error ? "true" : "false",
          );
        }
      });
      if (errorChanged) this._fireErrorChanged();
    }

    /**
     * whether this field type has been converted to the Ubuntu-style
     * settings row layout (issue #2996), where the label/description
     * live to the left of the control and the description is rendered
     * inline under the label (or behind an info-icon tooltip) instead
     * of in the field-bottom area
     *
     * @readonly
     * @returns {boolean}
     * @memberof SimpleFieldsContainer
     */
    get isRowBasedField() {
      // multi-option fieldsets (checkbox/radio groups) render a <legend>
      // instead of the label template, so the group-level description
      // is handled in the fieldset legend (see simple-fields-field.js
      // fieldsetTemplate); they do not adopt the horizontal row layout.
      // Single (non-multiple) selects join the row layout; multiple
      // selects keep the legacy full-width list-box treatment. A number
      // field with min/max/step is effectively a bounded stepper, so it
      // adopts the row layout too; plain numbers stay full-width.
      // Color fields adopt the row layout: the raw <input type="color">
      // case (shadow DOM) and the slotted simple-colors-picker case (the
      // legacy "accent color" combobox) both render label/description left
      // with a compact swatch control right (Phase 4, issue #2996).
      // Phase 5: text entry fields (text, textarea, password, email, tel,
      // url, search) adopt the row layout so label/description sit left
      // and the input fills the right side, with the focus underline
      // preserved for text/textarea. Plain file/range/date/time/month/
      // week keep the legacy full-width treatment.
      return (
        (this.type === "checkbox" && !this.hasFieldset) ||
        (this.type === "select" && !this.multiple) ||
        this.type === "color" ||
        ["text", "number", "textarea", "password", "email", "tel", "url", "search"].includes(
          this.type,
        ) ||
        (this.field &&
          this.field.tagName.toLowerCase() === "simple-colors-picker")
      );
    }
    /**
     * template for slotted or shadow DOM description
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get descriptionTemplate() {
      // The description is rendered as inline subtext under the label (short)
      // or behind the (i) info-icon tooltip (long) in labelTemplate, so the
      // standalone field-desc block is suppressed for any field with a
      // description. This applies to every field type (row-based, fieldset,
      // and legacy full-width) so the inline/info-icon behavior is uniform
      // (issue #2996). Fields with no description render nothing here.
      if (this.hasInlineDescription || this.hasInfoTooltip) return ``;
      return html`
        <div id="description" part="field-desc">
          <slot name="description"></slot>
          ${this.description}
        </div>
      `;
    }

    /**
     * template for slotted or shadow DOM error message
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get errorTemplate() {
      return html`
        <div
          id="error-message"
          ?hidden="${!this.error}"
          role="alert"
          part="error-msg"
        >
          ${this.errorMessage}
        </div>
      `;
    }

    /**
     *
     * gets bottom (metadata, description, and error message) of a field
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get fieldBottom() {
      return html`
        <div id="field-bottom">
          <div id="error-desc">
            ${this.descriptionTemplate} ${this.errorTemplate}
          </div>
          ${this.fieldMeta}
        </div>
      `;
    }

    /**
     * gets field's id
     *
     * @readonly
     * @returns {string}
     * @memberof SimpleFieldsContainer
     */
    get fieldId() {
      return `${this.id || "field"}.input`;
    }

    /**
     * template for slotted or shadow DOM label
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get fieldMainTemplate() {
      return html`
        <div
          class="${this.inline ||
          ["checkbox", "color", "radio"].includes(this.type || "text")
            ? "field-main inline"
            : "field-main"} ${this.isRowBasedField
            ? "row-layout"
            : ""}"
          part="field-main"
        >
          ${this.labelTemplate}
          <div part="field-inner">
            ${this.prefixTemplate}
            <slot name="field"></slot>
            ${this.suffixTemplate}
          </div>
        </div>
      `;
    }
    /**
     *
     * gets field metadata
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get fieldMeta() {
      return html`
        <div id="fieldmeta" aria-live="polite" part="field-meta">
          <slot name="field-meta"></slot>
        </div>
      `;
    }

    get hasFieldset() {
      return this.type === "fieldset";
    }

    /**
     * template for slotted or shadow DOM label
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get labelTemplate() {
      return html`
        <label
          id="${this.fieldId}-label"
          for="${this.fieldId}"
          class="label-main"
          ?hidden="${this.type === "fieldset"}"
          part="label"
        >
          <span class="label-text">
            <span>
              <slot name="label-prefix"></slot>
              <slot name="label"></slot>
              ${this.label}${this.error || this.required ? "*" : ""}
            </span>
            ${this.inlineDescriptionTemplate}
          </span>
          ${this.infoToggleTemplate}
        </label>
      `;
    }
    /**
     * whether the description is short enough to render as plain subtext
     * under the label (Ubuntu-style row layout) instead of behind a
     * click-triggered info icon
     *
     * @readonly
     * @returns {boolean}
     * @memberof SimpleFieldsContainer
     */
    get hasInlineDescription() {
      // Applies to every field type (not just row-based) so that short
      // descriptions consistently render as subtext under the label and
      // long descriptions collapse behind the (i) info icon. Radio/
      // checkbox fieldset groups render this via their legend in
      // simple-fields-field.js fieldsetTemplate (issue #2996).
      return (
        !!this.description &&
        this.description.trim().split(/\s+/).filter(Boolean).length <=
          SIMPLE_FIELDS_INLINE_DESCRIPTION_MAX_WORDS
      );
    }
    /**
     * whether the description is long enough to require the
     * (i) info icon / tooltip instead of inline subtext
     *
     * @readonly
     * @returns {boolean}
     * @memberof SimpleFieldsContainer
     */
    get hasInfoTooltip() {
      // Applies to every field type (not just row-based) so that long
      // descriptions consistently collapse behind the (i) info icon. Radio/
      // checkbox fieldset groups render this via their legend in
      // simple-fields-field.js fieldsetTemplate (issue #2996).
      return (
        !!this.description &&
        this.description.trim().split(/\s+/).filter(Boolean).length >
          SIMPLE_FIELDS_INLINE_DESCRIPTION_MAX_WORDS
      );
    }
    /**
     * template for description subtext rendered under the label
     * when the description is short enough to display inline
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get inlineDescriptionTemplate() {
      return !this.hasInlineDescription
        ? ``
        : html` <span id="description" part="field-desc"
            >${this.description}</span
          >`;
    }
    /**
     * template for the (i) info icon and its tooltip, used when a
     * description is too long (over 5 words) to render as inline
     * subtext. The tooltip is native (shows on hover/focus, hides on
     * blur/mouseleave) and positioned above the icon.
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get infoToggleTemplate() {
      if (!this.hasInfoTooltip) return ``;
      const infoId = `${this.fieldId}-info`.replaceAll('.', '-');
      return html`
        <simple-icon-button-lite
          id="${infoId}"
          icon="icons:info-outline"
          label="${this.label ? `${this.label} details` : `Field details`}"
          part="info-toggle"
          class="info-toggle"
          @click="${(e) => e.stopPropagation()}"
        ></simple-icon-button-lite>
        <simple-tooltip
          for="${infoId}"
          position="bottom"
          fit-to-visible-bounds
          part="info-tooltip"
        >
          ${this.description}
        </simple-tooltip>
      `;
    }
    get multicheck() {
      return (
        this.hasFieldset && this.field.querySelector("input[type=checkbox]")
      );
    }

    /**
     * determines if number of items selected
     * is not between min and max
     *
     * @readonly
     * @memberof SimpleFieldsContainer
     */
    get numberError() {
      let items = this._getFieldValue() ? this._getFieldValue().length : false,
        min =
          this.type === "select"
            ? this.min
            : this.multicheck
              ? this.minchecked
              : false,
        max =
          this.type === "select"
            ? this.max
            : this.multicheck
              ? this.maxchecked
              : false;
      let more = min && items && min > items ? min - items : false,
        less = max && items && max < items ? max - items : more;
      return less;
    }

    /**
     * determines if field is numeric
     *
     * @readonly
     * @returns {boolean}
     * @memberof SimpleFieldsContainer
     */
    get numeric() {
      return [
        "date",
        "month",
        "week",
        "time",
        "datetime-local",
        "number",
        "range",
      ].includes(this.type);
    }
    /**
     * determines if value does not match regex pattern
     *
     * @readonly
     * @memberof SimpleFieldsContainer
     */
    get patternError() {
      return (
        this.pattern &&
        this.pattern !== "" &&
        this._getFieldValue() &&
        (!this.field.multiple
          ? !this._getFieldValue().match(this.pattern)
          : this._getFieldValue().filter((value) => !value.match(this.pattern)))
      );
    }

    /**
     * template for slotted or shadow DOM prefix
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get prefixTemplate() {
      return html`
        <slot name="prefix"></slot>
        ${this.prefix}
      `;
    }
    /**
     * determines if field is required and blank
     *
     * @readonly
     * @memberof SimpleFieldsContainer
     */
    get requiredError() {
      return !this._getFieldValue() && this.required;
    }

    /**
     * mutation observer that updates field property with slotted field
     * override for shadow DOM field
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get slottedFieldObserver() {
      return new MutationObserver(this._updateField);
    }

    /**
     * template for slotted or shadow DOM suffix
     *
     * @readonly
     * @returns {object}
     * @memberof SimpleFieldsContainer
     */
    get suffixTemplate() {
      return html` ${this.suffix
        ? html`${this.suffix}`
        : html`<slot name="suffix"></slot>`}`;
    }
    /**
     * focuses on field
     * @memberof SimpleFieldsContainer
     */
    focus() {
      if (this.field) {
        this.field.focus();
        this.__delayedFocus = false;
      } else {
        this.__delayedFocus = true;
      }
    }
    /**
     * shift cursor to end of field
     */
    cursorAtEnd() {
      if (this.field) {
        this.field.selectionStart = this.field.selectionEnd =
          this.field.value.length;
      }
    }

    /**
     * selects all text
     * @memberof SimpleFieldsContainer
     */
    select() {
      if (this.field && (this.type === "text" || this.type === "textarea"))
        this.field.select();
    }

    /**
     * replaces a range of text
     * @param {string} replacement string to insert
     * @param {number=selectionStart} start 0-based index first character to replace
     * @param {number=selectionEnd} end 0-based index after last character to replace
     * @param {selectMode} after the text has been replaced:
     * "select" selects the newly inserted text,
     * "start" moves the selection to just before the inserted text,
     * "end" moves the selection to just after the inserted text, and
     * "preserve" attempts to preserve the selection. This is the default.
     * @memberof SimpleFieldsContainer
     */
    setRangeText(replacement, start, end, selectMode) {
      if (this.field && (this.type === "text" || this.type === "textarea"))
        this.field.setRangeText(replacement, start, end, selectMode);
    }

    /**
     * selects a range of text
     * @param {string} replacement string to insert
     * @param {selectionStart} start 0-based index first character
     * @param {selectionEnd} end 0-based index after last character
     * @param {selectMode} selection direction: "forward", "backward", or default "none"
     * @memberof SimpleFieldsContainer
     */
    setSelectionRange(selectionStart, selectionEnd, selectionDirection) {
      if (this.field && (this.type === "text" || this.type === "textarea"))
        this.field.setSelectionRange(
          selectionStart,
          selectionEnd,
          selectionDirection,
        );
    }
    /**
     * decrements by a multiple of step
     *
     * @param {number} [n=1]
     * @memberof SimpleFieldsContainer
     */
    stepDown(n = 1) {
      if (this.field && this.numeric) this.field.stepDown();
    }

    /**
     * increments by a multiple of step
     *
     * @param {number} [n=1]
     * @memberof SimpleFieldsContainer
     */
    stepUp(n = 1) {
      if (this.field && this.numeric) this.field.stepUp();
    }

    /**
     * checks validation constraints and returns error data
     * @memberof SimpleFieldsContainer
     */
    validate() {
      let legend = this.field.querySelector("legend");
      if (this.requiredError) {
        this.error = true;
        this.errorMessage = this.requiredMessage || `required`;
      } else if (this.numberError) {
        this.error = true;
        this.errorMessage =
          this.numberMessage ||
          (this.numberError > 0
            ? `select ${this.numberError} more`
            : `select ${0 - this.numberError} fewer`);
      } else if (this.patternError) {
        this.error = true;
        this.errorMessage = this.patternMessage || `invalid format`;
      }
      if (this.hasFieldset && legend) {
        legend.innerHTML = legend.innerHTML.replace(
          /\**\s*$/,
          this.error ? "*" : "",
        );
        legend.style.color = this.error
          ? "var(--simple-fields-error-color, #b40000)"
          : "";
      }
      // return true if we have no errors
      // return false if we DO have errors
      return !this.error;
    }

    /**
     * fires when error changes
     * @event error-changed
     */
    _fireErrorChanged() {
      this.dispatchEvent(
        new CustomEvent("error-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );
    }
    /**
     * generates a unique id
     * @returns {string } unique id
     */
    _generateUUID() {
      return "ss-s-s-s-sss".replace(
        /s/g,
        Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1),
      );
    }

    _getFieldsetValue() {
      let checked, value;
      if (this.field.querySelector("input[type=radio]")) {
        checked = this.field.querySelector("input:checked");
        value = checked ? checked.value : undefined;
      } else if (this.field.querySelector("input[type=checkbox]")) {
        value = [];
        checked = this.field.querySelectorAll("input:checked");
        checked.forEach((input) => value.push(input.value));
      }
      return value;
    }

    /**
     * gets the value of a field based on field type
     *
     * @memberof SimpleFieldsContainer
     */
    _getFieldValue() {
      let value;
      if (this.field) {
        if (this.hasFieldset) {
          value = this._getFieldsetValue();
        } else if (this.type === "checkbox") {
          value = this.field.checked ? true : false;
        } else if (this.type === "radio") {
          value = this.field.checked ? true : false;
        } else if (this.type === "select") {
          value = this.multiple
            ? Object.keys(this.field.selectedOptions).map(
                (option) => this.field.selectedOptions[option].value,
              )
            : this.field.selectedOptions[0].value;
        } else {
          value = this.field.value;
        }
      }
      return value;
    }
    /**
     * gets a valid version of a given type
     *
     * @param {string} type
     * @returns {string}
     * @memberof SimpleFieldsContainer
     */
    _getValidType(type) {
      if (type === "datetime" && this.validTypes.includes(type)) {
        return "datetime-local";
      } else if (this.validTypes.includes(type)) {
        return type;
      }
      return "text";
    }
    /**
     * handles field changes by field type
     *
     * @memberof SimpleFieldsContainer
     */
    _handleFieldChange() {
      if (this.type === "text" || this.type === "textarea") this._updateCount();
      if (this.autovalidate) this.validate();
      this.value = this._getFieldValue();
      if (this.type === "textarea") this.autoGrow();
    }
    /**
     * observes slotted field and listens for focusout
     * override for fields in shadow DOM
     *
     * @param {boolean} [init=true] whether to start observing or disconnect observer
     * @memberof SimpleFieldsContainer
     */
    _observeAndListen(init = true) {
      if (init) {
        this.slottedFieldObserver.observe(this, {
          attributeFilter: ["disabled", "readonly", "required", "slot"],
          childlist: true,
        });
        this._updateField();
        this.addEventListener("click", this.focus);
        this.addEventListener("focusout", this._onFocusout);
        this.addEventListener("focusin", this._onFocusin);
      } else {
        this.slottedFieldObserver.disconnect();
        this.removeEventListener("click", this.focus);
        this.removeEventListener("focusout", this._onFocusout);
        this.removeEventListener("focusin", this._onFocusin);
      }
    }
    /**
     * handles focusout validation
     *
     * @memberof SimpleFieldsContainer
     */
    _onFocusin() {
      this.error = false;
    }
    /**
     * handles focusout validation
     *
     * @memberof SimpleFieldsContainer
     */
    _onFocusout() {
      if (this.autovalidate) this.validate();
    }

    /**
     * updates field an type
     *
     * @memberof SimpleFieldsContainer
     */
    _updateField() {
      let oldfield = this.field;
      this.field =
        this.querySelector && this.querySelector("[slot=field]")
          ? this.querySelector("[slot=field]")
          : undefined;
      this.id = `${this.fieldId || ""}-wrapper`;
      if (this.field) {
        let tag = this.field.tagName.toLowerCase(),
          type = this.field.getAttribute("type") || "text";
        this.type = this._getValidType(tag === "input" ? type : tag);
        this.required = this.field.required;
        this.disabled = this.field.disabled;
        this.readonly = this.field.readonly;
        this.field.setAttribute("aria-describedby", "field-bottom");
        /** add event listeners */
        this.addEventListener("change", this._handleFieldChange);
        this.addEventListener("input", this._handleFieldChange);

        /** field type-specific adjustments */
        if (this.type === "select") this.multiple = this.field.multiple;
        if (this.type === "textarea") {
          if (!this.field.getAttribute("rows"))
            this.field.setAttribute("rows", 1);
          this.field.addEventListener("keydown", (e) => e.stopPropagation());
        }
        if (this.type === "fieldset") {
          let legend = this.querySelector("legend");
          if (legend) {
            legend.style.fontSize =
              "var(--simple-fields-detail-font-size, 12px)";
            legend.style.fontFamily =
              "var(--simple-fields-detail-font-family, sans-serif)";
            legend.style.lineHeight =
              "var(--simple-fields-detail-line-height, 22px)";
            legend.style.paddingInlineStart = 0;
            legend.style.paddingInlineEnd = 0;
          }
          this.querySelectorAll("label, input").forEach(
            (el) =>
              (el.style.marginRight = "var(--simple-fields-margin, 16px)"),
          );
          this.querySelectorAll("label input").forEach(
            (el) =>
              (el.style.marginLeft =
                "calc(0 - var(--simple-fields-margin, 16px))"),
          );
        }
      } else {
        this.disabled = false;
        this.readonly = false;
        this.required = false;
        this.type = undefined;

        /** remove event listeners from old field */
        if (oldfield) {
          if (oldfield.tagName.toLowerCase() === "textarea")
            oldfield.addEventListener("keydown", (e) => e.stopPropagation());
          oldfield.removeEventListener("change", this._handleFieldChange);
          oldfield.removeEventListener("input", this._handleFieldChange);
        }
      }
      if (this.field && this.__delayedFocus) this.focus();
    }

    /**
     * updates counter and sets maximum word count
     *
     * @memberof SimpleFieldsContainer
     */
    _updateCount() {
      let count = ``,
        word = `[\\w\\-\\']+`,
        wordcounter = new RegExp(word, "gim"),
        maxlength =
          this.field.getAttribute("maxlength") || this.maxlength || false,
        maxword = this.maxwords || false,
        countmax = this.counter === "word" ? maxword : maxlength,
        regex = new RegExp(`.{0,${maxlength || 1}}`, "g"),
        wordregex = new RegExp(`(${word}\\W*){0,${maxword || 1}}`, "g"),
        matchval = (regex) => {
          return ((this.field || {}).value || "").match(regex);
        },
        length = () => (!this.field.value ? 0 : this.field.value.length),
        wordlength = () => {
          return !this.field || !this.field.value || !matchval(wordcounter)
            ? 0
            : matchval(wordcounter).length;
        },
        correctLength = (length, max, regex) => {
          if (length && max && max < length && this.field.value.match(regex)) {
            this.field.value = matchval(regex)[0].trim();
          }
        };
      correctLength(length(), maxlength, regex);
      correctLength(wordlength(), maxword, wordregex);
      count = this.counter === "word" ? wordlength() : length();
      if (
        this.counter !== "none" &&
        this.shadowRoot &&
        this.shadowRoot.querySelector("#fieldmeta")
      )
        this.shadowRoot.querySelector("#fieldmeta").innerHTML = countmax
          ? `${count}/${countmax}`
          : count;
    }
  };
};

/**
 *`simple-fields-container`
 * Progressive enhanced container HTML fields
 * with label, description, error massage,
 * and aria-invalid functionality if needed.
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-container
 * @demo ./demo/container.html
 * @class SimpleFieldsContainer
 * @extends {SimpleFieldsContainerBehaviors(LitElement)}
 */
class SimpleFieldsContainer extends SimpleFieldsContainerBehaviors(
  LitElement,
) {}
globalThis.customElements.define(
  SimpleFieldsContainer.tag,
  SimpleFieldsContainer,
);
export { SimpleFieldsContainer, SimpleFieldsContainerBehaviors };
