/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, LitElement, nothing } from "lit";
import "./simple-icons.js";
import "./simple-icon-lite.js";

/**
 *
 * @class SimpleIconButtonBehaviors
 */
export const SimpleIconButtonBehaviors = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.ariaLabelledby = "";
      this.controls = "";
      this.disabled = false;
      this.form = "";
      this.label = "";
      this.fieldName = "";
      this.type = "";
      this.value = "";
      this.icon = "";
      this.noColorize = false;
    }

    static get styles() {
      return [
        ...[super.styles || []],
        css`
          :host([hidden]) {
            display: none;
          }
          :host([icon=""]) simple-icon-lite {
            display: none;
          }
          :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: relative;
            vertical-align: middle;
            border-radius: var(--simple-icon-button-border-radius, 50%);
            background-color: var(
              --simple-icon-button-background-color,
              transparent
            );
            padding: 0;
            margin: 0;
            color: inherit;
          }
          button {
            color: inherit;
            cursor: pointer;
            opacity: var(--simple-icon-button-opacity, 1);
            border: var(--simple-icon-button-border, 0);
            border-radius: var(--simple-icon-button-border-radius, 50%);
            background-color: var(
              --simple-icon-button-background-color,
              transparent
            );
            padding: var(--simple-icon-button-padding, 0px);
            margin: 0px;
            width: 100%;
            height: 100%;
          }
          button[aria-pressed] {
            opacity: var(--simple-icon-button-toggled-opacity, 1);
            --simple-icon-button-border: var(
              --simple-icon-toggled-button-border
            );
            --simple-icon-color: var(--simple-icon-button-toggled-color);
            --simple-icon-button-background-color: var(
              --simple-icon-button-toggled-background-color
            );
          }
          button:focus,
          button:hover {
            opacity: var(--simple-icon-button-focus-opacity, 0.8);
            --simple-icon-button-border: var(--simple-icon-button-focus-border);
            --simple-icon-color: var(--simple-icon-button-focus-color);
            --simple-icon-button-background-color: var(
              --simple-icon-button-focus-background-color
            );
          }
          /* held down: an overlay over the button's own fill (the HAX UI
             pressed token where there is one) */
          button:active:not([disabled]) {
            box-shadow: inset 0 0 0 999px
              var(
                --simple-icon-button-pressed-overlay,
                var(--hax-ui-pressed, rgba(128, 128, 128, 0.28))
              );
          }
          button:disabled,
          button[disabled] {
            opacity: var(--simple-icon-button-disabled-opacity, 0.5);
            --simple-icon-button-border: var(
              --simple-icon-button-disabled-border
            );
            --simple-icon-color: var(--simple-icon-button-disabled-color);
            --simple-icon-button-background-color: var(
              --simple-icon-button-disabled-background-color
            );
            cursor: not-allowed;
          }

          simple-icon-lite {
            color: inherit;
            height: calc(
              var(--simple-icon-height, 24px) - 2 *
                var(--simple-icon-button-padding, 0px)
            );
            width: calc(
              var(--simple-icon-width, 24px) - 2 *
                var(--simple-icon-button-padding, 0px)
            );
          }
        `,
      ];
    }

    /**
     * Fallback name for a button given no label: its visible text when it
     * has some, else the host title, else the icon name made readable
     * ("icons:create" reads "create"), never the raw machine name.
     * Give every icon-only button a real label; this only keeps an
     * unlabeled one from being announced as "icons colon create".
     *
     * @readonly
     */
    get iconLabel() {
      // visible text in the button names it; never override that
      if (this.textContent && this.textContent.trim() !== "") return "";
      // a title on the host is the author's own name for the button
      const title = this.getAttribute("title");
      if (title && title.trim() !== "") return title.trim();
      if (!this.icon) return "";
      const name = String(this.icon).split(":").pop();
      return name.replace(/[-_]+/g, " ").trim();
    }

    updated(changedProperties) {
      if (super.updated) super.updated(changedProperties);
      this._syncAriaReferences();
      // nothing to name it by: say so once, for the author
      if (
        !this.__warnedUnnamed &&
        !this.label &&
        !(this.textContent && this.textContent.trim() !== "") &&
        !this.iconLabel &&
        !this.ariaLabelledby &&
        !this.hasAttribute("aria-label")
      ) {
        this.__warnedUnnamed = true;
        console.warn(
          `${this.localName} has no label, icon or text, so its button has no accessible name; set label`,
          this,
        );
      }
    }

    /**
     * aria-labelledby and controls name ids that live beside this element,
     * outside its shadow root, so an id on the inner button could never
     * match. Look them up where this element lives and hand the inner
     * button element references instead; an id that does not resolve
     * leaves no broken reference behind.
     */
    _syncAriaReferences() {
      const button = this.shadowRoot && this.shadowRoot.querySelector("button");
      if (!button) return;
      const root = this.getRootNode();
      const lookup = (ids) => {
        if (!ids || !root || typeof root.getElementById !== "function") {
          return null;
        }
        const found = String(ids)
          .split(/\s+/)
          .filter((id) => id !== "")
          .map((id) => root.getElementById(id))
          .filter((el) => !!el);
        return found.length > 0 ? found : null;
      };
      // clearing a reflected property would leave an empty attribute, so a
      // reference that does not resolve removes the attribute instead
      const labels = lookup(this.ariaLabelledby);
      if (labels && "ariaLabelledByElements" in button) {
        button.ariaLabelledByElements = labels;
      } else if (button.hasAttribute("aria-labelledby")) {
        button.removeAttribute("aria-labelledby");
      }
      const controlled = lookup(this.controls);
      if (controlled && "ariaControlsElements" in button) {
        button.ariaControlsElements = controlled;
      } else if (button.hasAttribute("aria-controls")) {
        button.removeAttribute("aria-controls");
      }
    }

    /**
     * Delegates focus to the internal native button so consumers (e.g.
     * roving-tabindex widgets) can move focus without reaching into this
     * element's shadow root (haxtheweb/issues#3107)
     */
    focus() {
      const button = this.shadowRoot && this.shadowRoot.querySelector("button");
      if (button) {
        button.focus();
      } else if (super.focus) {
        super.focus();
      }
    }

    // render function
    render() {
      return html`
        <button
          ?autofocus="${this.autofocus}"
          aria-pressed="${
            this.toggles ? (this.toggled ? "true" : "false") : nothing
          }"
          role="${this.buttonRole || nothing}"
          aria-checked="${
            this.ariaChecked === undefined
              ? nothing
              : this.ariaChecked
                ? "true"
                : "false"
          }"
          tabindex="${
            this.buttonTabindex === undefined || this.buttonTabindex === null
              ? nothing
              : this.buttonTabindex
          }"
          part="button"
          ?disabled="${this.disabled}"
          form="${this.form}"
          label="${this.label}"
          aria-label="${this.label || this.iconLabel || nothing}"
          name="${this.fieldName}"
          .type="${this.type}"
          value="${this.value}"
        >
          <simple-icon-lite
            icon="${this.icon}"
            part="icon"
            ?no-colorize="${this.noColorize}"
          ></simple-icon-lite>
          <slot></slot>
        </button>
      `;
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        autofocus: {
          type: Boolean,
        },
        ariaLabelledby: {
          attribute: "aria-labelledby",
          type: String,
        },
        controls: {
          type: String,
        },
        disabled: {
          type: Boolean,
        },
        fieldName: {
          attribute: "field-name",
          type: String,
        },
        form: {
          type: String,
        },
        icon: {
          type: String,
          reflect: true,
        },
        /**
         * whether to disable the contrast-based colorization of the
         * nested icon (passes through as the no-colorize attribute)
         */
        noColorize: {
          type: Boolean,
          attribute: "no-colorize",
        },
        label: {
          type: String,
        },
        type: {
          type: String,
        },
        value: {
          type: String,
          reflect: true,
        },
        toggles: {
          type: Boolean,
          reflect: true,
        },
        toggled: {
          type: Boolean,
          reflect: true,
        },
        /**
         * role forwarded to the internal native button so consumers can
         * put widget semantics (e.g. role="radio") on the real interactive
         * element while this host stays a semantic-free wrapper, which
         * keeps axe nested-interactive clean (haxtheweb/issues#3107)
         */
        buttonRole: {
          attribute: "button-role",
          type: String,
        },
        /**
         * aria-checked state forwarded to the internal native button; it
         * only renders when defined so plain button usages are
         * unaffected (haxtheweb/issues#3107)
         */
        ariaChecked: {
          attribute: "aria-checked",
          type: Boolean,
        },
        /**
         * tabindex forwarded to the internal native button; it only
         * renders when defined so roving-tabindex widgets can manage
         * their tab stops through the real button (haxtheweb/issues#3107)
         */
        buttonTabindex: {
          attribute: "button-tabindex",
          type: Number,
        },
      };
    }
  };
};
/**
 * `simple-icon`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @extends LitElement
 * @extends SimpleIconButtonBehaviors
 * @demo demo/button-lite.html
 * @element simple-icon
 */
class SimpleIconButtonLite extends SimpleIconButtonBehaviors(LitElement) {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-icon-button-lite";
  }
  constructor() {
    super();
    this.type = "button";
  }
}
globalThis.customElements.define(
  SimpleIconButtonLite.tag,
  SimpleIconButtonLite,
);
export { SimpleIconButtonLite };
