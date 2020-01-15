import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `hax-input-mixer`
 * @customElement hax-input-mixer
 * A context menu that provides common custom-element based authoring options. While
 * trying to call for haxProperties which can automatically generate the buttons
 * required for populating input.
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of custom-element based buttons and events for use in a larger solution.
 */
class HaxInputMixer extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 0;
          border: none;
          padding: 0;
          border: 1px solid var(--hax-color-border-outline);
        }
        .wrapper {
          background-color: #ffffff;
          color: #222222;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        hax-context-item {
          margin: 0;
        }
        #elementoptions {
          height: inherit;
        }
        #input {
          color: var(--hax-color-text);
        }
        paper-checkbox {
          --paper-checkbox-label-color: var(--hax-color-text);
        }
        paper-textarea,
        paper-input {
          height: 40px;
          font-size: 14px;
          margin-bottom: 6px;
        }
        .input-method {
          color: var(--hax-color-text);
          padding: 0 8px;
          width: 80%;
        }
        #updatebutton {
          outline: 1px solid black;
        }
        #updatebutton:hover {
          border: none;
        }
      `
    ];
  }
  constructor() {
    super();
    this.value = null;
    this.options = {};
    this.icon = "android";
    this.inputMethod = null;
    this.__inputtextarea = false;
    this.__inputtextfield = false;
    this.__inputboolean = false;
    this.__inputcolorpicker = false;
    this.__inputflipboolean = false;
    import("@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js");
    import("@polymer/paper-input/paper-textarea.js");
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-checkbox/paper-checkbox.js");
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
  }
  render() {
    return html`
      <custom-style>
        <style>
          paper-textarea,
          paper-input {
            --paper-input-container: {
              padding: 0;
              font-size: 14px;
            }
            --paper-input-container-label-floating: {
              color: var(--hax-color-text);
              font-size: 12px;
            }
            --paper-input-container-underline: {
              margin: 0;
            }
            --paper-input-container-color: var(--hax-color-text);
            --paper-input-container-focus-color: var(--hax-color-text);
            --paper-input-container-invalid-color: var(--hax-color-text);
            --paper-input-container-input-color: var(--hax-color-text);
            --paper-input-container-shared-input-style: {
              color: var(--hax-color-text);
              background: transparent;
              margin: 0;
              padding: 0;
              line-height: 14px;
              font-size: 14px;
              outline: none;
              border: none;
            }
          }
        </style>
      </custom-style>
      <div class="wrapper">
        ${this.__inputselect
          ? html`
              <span class="input-mixer-label">${this.label}</span>
              <hax-context-item-menu
                selected-value="${this.__selectedValue}"
                @selected-value-changed="${this.__selectedValueChanged}"
                .icon="${this.icon}"
                id="input"
              >
                <slot></slot>
              </hax-context-item-menu>
            `
          : html``}
        <span class="input-method">
          ${this.__inputtextarea
            ? html`
                <paper-textarea
                  id="input"
                  label="${this.label}"
                  .value="${this.value}"
                  @value-changed="${this.valueChanged}"
                  auto-validate=""
                  pattern="${this.validation}"
                  required="${this.required}"
                ></paper-textarea>
              `
            : html``}
          ${this.__inputtextfield
            ? html`
                <paper-input
                  id="input"
                  type="${this.validationType}"
                  label="${this.label}"
                  .value="${this.value}"
                  @value-changed="${this.valueChanged}"
                  auto-validate=""
                  pattern="${this.validation}"
                  required="${this.required}"
                ></paper-input>
              `
            : html``}
          ${this.__inputboolean
            ? html`
                <paper-checkbox
                  id="input"
                  .checked="${this.value}"
                  @checked-changed="${this.valueChanged}"
                  >${this.label}</paper-checkbox
                >
              `
            : html``}
          ${this.__inputflipboolean
            ? html`
                <paper-checkbox
                  id="input"
                  .checked="${this.value}"
                  @checked-changed="${this.valueChanged}"
                  >${this.label}</paper-checkbox
                >
              `
            : html``}
          ${this.__inputcolorpicker
            ? html`
                <span>${this.label}</span>
                <simple-colors-picker
                  id="input"
                  .value="${this.value}"
                  @value-changed="${this.valueChanged}"
                ></simple-colors-picker>
              `
            : html``}
        </span>
        <simple-tooltip for="input" position="top" offset="14">
          ${this.description}
        </simple-tooltip>
        <hax-context-item
          id="updatebutton"
          icon="subdirectory-arrow-right"
          label="Update ${this.label}"
          event-name="hax-update-tap"
        ></hax-context-item>
      </div>
    `;
  }
  __selectedValueChanged(e) {
    this.__selectedValue = e.detail.value;
  }
  /**
   * value changes but trap for null to ensure it's mapped to an empty string
   */
  valueChanged(e) {
    if (typeof e.detail.value !== typeof undefined) {
      this.value = e.detail.value;
    } else {
      this.value = e.detail;
    }
  }
  static get tag() {
    return "hax-input-mixer";
  }
  static get properties() {
    return {
      /**
       * value, where the magic happens.
       */
      value: {
        type: String
      },
      /**
       * Label for the input
       */
      label: {
        type: String,
        reflect: true
      },
      /**
       * Optional regex Validation for input and textarea fields
       */
      validation: {
        type: String,
        reflect: true
      },
      /**
       * Optional input type validation; use on input field
       */
      validationType: {
        type: String,
        reflect: true,
        attribute: "validation-type"
      },
      /**
       * Required; used on input and textarea fields
       */
      required: {
        type: Boolean,
        reflect: true
      },
      /**
       * Options for the input if it's a select of some form
       */
      options: {
        type: Object
      },
      /**
       * Optional icon that represents the item mixing.
       */
      icon: {
        type: String,
        reflect: true
      },
      /**
       * longer description for the input
       */
      description: {
        type: String,
        reflect: true
      },
      /**
       * longer description for the input
       */
      inputMethod: {
        type: String,
        reflect: true
      },
      /**
       * longer description for the input
       */
      propertyToBind: {
        type: String,
        reflect: true,
        attribute: "property-to-bind"
      },
      /**
       * slot to bind input back to
       */
      slotToBind: {
        type: String,
        reflect: true,
        attribute: "slot-to-bind"
      },
      __inputflipboolean: { type: Boolean },
      __inputcolorpicker: { type: Boolean },
      __inputboolean: { type: Boolean },
      __inputtextfield: { type: Boolean },
      __inputtextarea: { type: Boolean }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "inputMethod") {
        this._inputMethodChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * Ensure our weird data binding for templates is set initially.
   */
  firstUpdated(changedProperties) {
    // prime methods even though invisible most likely
    this._resetInputMethods();
    setTimeout(() => {
      this.addEventListener(
        "hax-context-item-selected",
        this._haxContextOperation.bind(this)
      );
    }, 0);
  }
  /**
   * Input method changes, allow our templates to rebind correctly.
   */
  _inputMethodChanged(newValue, oldValue) {
    if (newValue != null) {
      let method = newValue;
      let methods = this.validInputMethods();
      // ensure this is a valid method of input
      if (methods.includes(method)) {
        // set everything false to force a correct rebind of template tags
        this._resetInputMethods();
        // this is weird looking, I know...
        this["__input" + method] = true;
        // hide the menu if it was open previously
        // need to paint into the slot so clean it out and repaint
        while (this.firstChild !== null) {
          this.removeChild(this.firstChild);
        }
        // select needs to inject settings into the slot
        if (method === "select" && typeof this.options !== typeof undefined) {
          // this hits the key => value relationship correctly
          var item;
          for (var val in this.options) {
            item = document.createElement("paper-item");
            item.attributes.value = val;
            item.innerHTML = this.options[val];
            this.appendChild(item.cloneNode(true));
          }
        }
        // try and force cursor to focus on this element
        setTimeout(() => {
          if (
            this.shadowRoot.querySelector("#input") &&
            typeof this.shadowRoot.querySelector("#input").hideMenu ===
              "function"
          ) {
            this.shadowRoot.querySelector("#input").hideMenu();
          }
          this.shadowRoot.querySelector("#input").focus();
        }, 500);
      }
    }
  }

  /**
   * Validate input method.
   */
  validInputMethods() {
    var methods = [
      "flipboolean",
      "boolean",
      "select",
      "textfield",
      "textarea",
      "datepicker",
      "haxupload",
      "colorpicker",
      "iconpicker",
      "alt",
      "number",
      "code-editor",
      "array"
    ];
    return methods;
  }
  /**
   * Reset all our meta attributes.
   */
  _resetInputMethods() {
    let methods = this.validInputMethods();
    for (var i = 0; i < methods.length; i++) {
      this["__input" + methods[i]] = false;
    }
  }
  /**
   * Respond to simple modifications.
   */
  _haxContextOperation(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "hax-update-tap":
        // minor dataType conversion for boolean
        if (this.inputMethod == "boolean") {
          this.value = this.value;
        }
        // opposite value for a flip-boolean
        else if (this.inputMethod == "flipboolean") {
          this.value = !this.value;
        } else if (this.inputMethod == "select") {
          var count = 0;
          // convert value into key value
          for (var val in this.options) {
            if (count == this.__selectedValue) {
              this.value = val;
            }
            count++;
          }
        }
        let mixer = {
          value: this.value,
          propertyToBind: this.propertyToBind,
          slotToBind: this.slotToBind
        };
        // retarget event with all the guts of this item
        // this way we can do whatever we want in hax-body which is
        // basically notice that we got asked to do some data binding
        // and then actually do it and hide this item!!!!
        this.dispatchEvent(
          new CustomEvent("hax-input-mixer-update", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { inputMixer: mixer }
          })
        );
        break;
    }
  }
}
window.customElements.define(HaxInputMixer.tag, HaxInputMixer);
export { HaxInputMixer };
