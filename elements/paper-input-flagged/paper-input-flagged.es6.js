/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
`paper-input-flagged`
A LRN element

* @demo demo/index.html

@microcopy - the mental model for this element
 - flagged - a piece of content with a status message indicating there's an issue with the input by the user. This isn't formal validation but more of feedback or suggestions about what they are entering. The default is feedback for alt metadata, useful for images.
*/
class PaperInputFlagged extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        iron-icon {
          transition: 0.6s all ease-in;
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
        paper-tooltip {
          --paper-tooltip-delay-in: 100;
          font-size: 11px;
        }
        #icon {
          color: var(--paper-grey-400);
          background-color: transparent;
        }
        :host([status="info"]) #icon {
          color: var(--paper-green-400);
        }
        :host([status="notice"]) #icon {
          color: var(--paper-grey-400);
        }
        :host([status="warning"]) #icon {
          color: var(--paper-yellow-700);
        }
        :host([status="error"]) #icon {
          color: var(--paper-red-900);
        }
        .element-invisible {
          position: absolute !important;
          clip: rect(1px, 1px, 1px, 1px);
          overflow: hidden;
          height: 1px;
        }
      </style>
      <paper-input
        label="[[label]]"
        value="{{value}}"
        char-counter="[[charCounter]]"
        disabled="[[disabled]]"
        minlength="[[minlength]]"
        maxlength="[[minlength]]"
      >
        <iron-icon id="icon" icon="[[icon]]" slot="prefix"></iron-icon>
      </paper-input>
      <div class="element-invisible">[[__activeMessage]]</div>
      <paper-tooltip
        for="icon"
        position="top"
        offset="20"
        fit-to-visible-bounds
      >
        [[__activeMessage]]
      </paper-tooltip>
    `;
  }
  static get tag() {
    return "paper-input-flagged";
  }
  static get properties() {
    return {
      /**
       * Icon based on status
       */
      icon: {
        type: String,
        computed: "_iconFromStatus(status)"
      },
      /**
       * Status based on test for flagged words
       */
      status: {
        type: String,
        reflectToAttribute: true,
        computed: "testStatus(flaggedInput, value)"
      },
      /**
       * value
       */
      value: {
        type: String,
        notify: true,
        value: ""
      },
      /**
       * Input to trap and offer feedback about.
       */
      flaggedInput: {
        type: Array,
        value: [
          {
            match: null,
            message:
              "Alt data is required for everything except decoration images.",
            status: "notice"
          },
          {
            match: "image",
            message:
              "Screenreaders will say the word image, don't put it in the descriptive text",
            status: "error"
          },
          {
            match: "photo",
            message:
              "Screenreaders will say the word image, don't put photo in the descriptive text",
            status: "error"
          },
          {
            match: "picture",
            message:
              "Screenreaders will say the word image, don't put picture in the descriptive text",
            status: "error"
          },
          {
            match: 3,
            message:
              "Description not effective enough. This should be at least a sentance about what the image is.",
            status: "error"
          },
          {
            match: 10,
            message:
              "Make sure your alt text is descriptive enough for those that can't see the media.",
            status: "warning"
          }
        ]
      },
      /**
       * Passed tests / success data.
       */
      inputSuccess: {
        type: Object,
        value: {
          message: "You passed our simple accessibility checks.",
          status: "info"
        }
      }
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
window.customElements.define(PaperInputFlagged.tag, PaperInputFlagged);
export { PaperInputFlagged };
