/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
/**
`paper-input-flagged`
A LRN element

* @demo demo/index.html

@microcopy - the mental model for this element
 - flagged - a piece of content with a status message indicating there's an issue with the input by the user. This isn't formal validation but more of feedback or suggestions about what they are entering. The default is feedback for alt metadata, useful for images.
*/
class PaperInputFlagged extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        simple-icon {
          transition: 0.6s all ease-in;
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
        simple-tooltip {
          --simple-tooltip-delay-in: 100;
          font-size: 11px;
        }
        /* DDD functional tokens replace the legacy paper-* palette;
           light-dark() pairs the dark functional hues with their Light
           variants so the status icon stays legible in dark mode */
        #icon {
          color: var(--ddd-theme-default-limestoneGray, #a2aaad);
          background-color: transparent;
        }
        :host([status="info"]) #icon {
          color: light-dark(
            var(--ddd-theme-default-success, #1e4620),
            var(--ddd-theme-default-successLight, #edf7ed)
          );
        }
        :host([status="notice"]) #icon {
          color: var(--ddd-theme-default-limestoneGray, #a2aaad);
        }
        :host([status="warning"]) #icon {
          color: light-dark(
            var(--ddd-theme-default-warning, #663c00),
            var(--ddd-theme-default-warningLight, #fff4e5)
          );
        }
        :host([status="error"]) #icon {
          color: light-dark(
            var(--ddd-theme-default-error, #5f2120),
            var(--ddd-theme-default-errorLight, #fdeded)
          );
        }
        .element-invisible {
          position: absolute !important;
          clip: rect(1px, 1px, 1px, 1px);
          overflow: hidden;
          height: 1px;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.disabled = false;
    this.charCounter = false;
    this.label = "";
    this.value = "";
    this.inputSuccess = {
      message: "You passed our simple accessibility checks.",
      status: "info",
    };
    this.flaggedInput = [
      {
        match: null,
        message:
          "Alt data is required for everything except decoration images.",
        status: "notice",
      },
      {
        match: "image",
        message:
          "Screenreaders will say the word image, don't put it in the descriptive text",
        status: "error",
      },
      {
        match: "photo",
        message:
          "Screenreaders will say the word image, don't put photo in the descriptive text",
        status: "error",
      },
      {
        match: "picture",
        message:
          "Screenreaders will say the word image, don't put picture in the descriptive text",
        status: "error",
      },
      {
        match: 3,
        message:
          "Description not effective enough. This should be at least a sentance about what the image is.",
        status: "error",
      },
      {
        match: 10,
        message:
          "Make sure your alt text is descriptive enough for those that can't see the media.",
        status: "warning",
      },
    ];
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["value"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      if (propName == "status") {
        this.icon = this._iconFromStatus(this.status);
      }
      if (propName == "flaggedInput" || propName == "value") {
        this.status = this.testStatus(this.flaggedInput, this.value);
      }
    });
  }
  valueEvent(e) {
    this.value = e.detail.value;
  }
  render() {
    return html`
      <simple-fields-field
        label="${this.label}"
        value="${this.value}"
        @value-changed="${this.valueEvent}"
        ?char-counter="${this.charCounter}"
        ?disabled="${this.disabled}"
        minlength="${this.minlength}"
        maxlength="${this.maxlength}"
      >
        <simple-icon id="icon" icon="${this.icon}" slot="prefix"></simple-icon>
      </simple-fields-field>
      <div class="element-invisible">${this.__activeMessage}</div>
      <simple-tooltip
        for="icon"
        position="top"
        offset="20"
        fit-to-visible-bounds
      >
        ${this.__activeMessage}
      </simple-tooltip>
    `;
  }
  static get tag() {
    return "paper-input-flagged";
  }
  static get properties() {
    return {
      label: {
        type: String,
      },
      disabled: {
        type: Boolean,
      },
      /**
       * Forward the character counter flag to the underlying field
       */
      charCounter: {
        type: Boolean,
        attribute: "char-counter",
      },
      /**
       * Icon based on status
       */
      icon: {
        type: String,
      },
      maxlength: {
        type: Number,
      },
      minlength: {
        type: Number,
      },
      /**
       * Status based on test for flagged words
       */
      status: {
        type: String,
        reflect: true,
      },
      /**
       * value
       */
      value: {
        type: String,
      },
      /**
       * Input to trap and offer feedback about.
       */
      flaggedInput: {
        type: Array,
        attribute: "flagged-input",
      },
      /**
       * Passed tests / success data.
       */
      inputSuccess: {
        type: Object,
        attribute: "input-success",
      },
      __activeMessage: {
        type: String,
      },
    };
  }
  /**
   * testStatus based on current input
   */
  testStatus(test, value) {
    for (var i in test) {
      // special case for null if testing empty
      if (test[i].match === null && (value === "" || value === null)) {
        this.__activeMessage = test[i].message;
        return test[i].status;
      } else if (
        !isNaN(test[i].match) &&
        value.split(/\s+/g).length < parseInt(test[i].match)
      ) {
        this.__activeMessage = test[i].message;
        return test[i].status;
      }
      // see if we match on a piece of the rest of it
      else if (value.toLowerCase().includes(test[i].match)) {
        this.__activeMessage = test[i].message;
        return test[i].status;
      }
    }
    // if we beat all the test then display some nominal woo msg
    this.__activeMessage = this.inputSuccess.message;
    return this.inputSuccess.status;
  }
  /**
   * Compute icon from status
   */
  _iconFromStatus(status) {
    switch (status) {
      case "error":
        return "icons:error";
        break;
      case "warning":
      case "notice":
        return "icons:warning";
        break;
      case "info":
        return "icons:info-outline";
        break;
      default:
        return "icons:info";
        break;
    }
  }
}
globalThis.customElements.define(PaperInputFlagged.tag, PaperInputFlagged);
export { PaperInputFlagged };
