/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
/**
 * `lrnsys-button`
 * `A simple button for use in systems`
 * @demo demo/index.html
 */
class LrnsysButton extends PolymerElement {
  constructor() {
    super();
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }
  static get template() {
    return html`
      <style include="materializecss-styles-colors">
        :host {
          display: block;
          @apply --paper-font-common-base;
          @apply --paper-button;
          --lrnsys-button-height: 48px;
        }
        a {
          text-decoration: none;
          display: block;
          color: #000000;
          display: flex;
        }
        paper-button {
          padding: 0;
          margin: 0;
          min-width: 0.16px;
          height: inherit;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          text-transform: unset;
          border-radius: unset;
          display: flex;
        }
        paper-button iron-icon {
          height: var(--lrnsys-button-height);
          margin: 0 4px;
        }
        paper-button iron-icon:first-child {
          margin: 0 4px 0 0;
        }
        paper-button iron-icon:last-child {
          margin: 0 0 0 4px;
        }
        paper-button div.inner {
          height: var(--lrnsys-button-height);
          line-height: var(--lrnsys-button-height);
          display: flex;
          padding: 0 16px;
        }
        paper-button span.label {
          height: var(--lrnsys-button-height);
          line-height: var(--lrnsys-button-height);
        }
        .no-margin {
          margin: 0 !important;
        }
        .no-right-padding {
          padding-right: 0 !important;
        }
        .no-left-padding {
          padding-left: 0 !important;
        }
      </style>
      <a
        tabindex="-1"
        id="lrnsys-button-link"
        href\$="[[showHref]]"
        data-prefetch-hover\$="[[prefetch]]"
        target\$="[[target]]"
      >
        <paper-button
          id="button"
          title="[[alt]]"
          raised="[[raised]]"
          class\$="[[buttonClass]] [[color]] [[textColor]]"
          disabled\$="[[disabled]]"
        >
          <div class\$="inner [[innerClass]]">
            <slot name="prefix"></slot>
            <iron-icon
              icon="[[icon]]"
              id="icon"
              class\$="[[iconClass]]"
              hidden\$="[[!icon]]"
            ></iron-icon>
            <span class="label" hidden\$="[[!label]]"> [[label]] </span>
            <slot></slot>
          </div>
        </paper-button>
      </a>
      <paper-tooltip
        for="lrnsys-button-link"
        animation-delay="0"
        hidden\$="[[!alt]]"
        >[[alt]]</paper-tooltip
      >
    `;
  }

  static get tag() {
    return "lrnsys-button";
  }

  static get properties() {
    return {
      /**
       * Standard href pass down
       */
      href: {
        type: String,
        value: "#",
        reflectToAttribute: true
      },
      showHref: {
        type: String,
        value: false,
        reflectToAttribute: true,
        computed: "_getShowHref(href,disabled)"
      },
      /**
       * If the button should be visually lifted off the UI.
       */
      raised: {
        type: Boolean,
        reflectToAttribute: true
      },
      /**
       * Label to place in the text area
       */
      label: {
        type: String,
        value: ""
      },
      /**
       * Support for target to open in new windows.
       */
      target: {
        type: String,
        value: ""
      },
      /**
       * iron-icon to use (with iconset if needed)
       */
      icon: {
        type: String,
        value: false
      },
      /**
       * Classes to add / subtract based on the item being hovered.
       */
      hoverClass: {
        type: String
      },
      /**
       * Button class.
       */
      buttonClass: {
        type: String
      },
      /**
       * Icon class in the event you want it to look different from the text.
       */
      iconClass: {
        type: String
      },
      /**
       * Inner container classes.
       */
      innerClass: {
        type: String
      },
      /**
       * Color class work to apply
       */
      color: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * materializeCSS color class for text
       */
      textColor: {
        type: String
      },
      /**
       * Allow for prefetch data on hover
       */
      prefetch: {
        type: String
      },
      /**
       * Alt via tooltip.
       */
      alt: {
        type: String
      },
      /**
       * Disabled state.
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * Tracks if focus state is applied
       */
      focusState: {
        type: Boolean,
        value: false
      }
    };
  }
  /**
   * attached life cycle
   */
  ready() {
    super.ready();
    afterNextRender(this, function() {
      this.addEventListener("mousedown", this.tapEventOn.bind(this));
      this.addEventListener("mouseover", this.tapEventOn.bind(this));
      this.addEventListener("mouseout", this.tapEventOff.bind(this));
      this.$.button.addEventListener(
        "focused-changed",
        this.focusToggle.bind(this)
      );
    });
  }
  /**
   * detached event listener
   */
  disconnectedCallback() {
    this.removeEventListener("mousedown", this.tapEventOn.bind(this));
    this.removeEventListener("mouseover", this.tapEventOn.bind(this));
    this.removeEventListener("mouseout", this.tapEventOff.bind(this));
    this.$.button.removeEventListener(
      "focused-changed",
      this.focusToggle.bind(this)
    );
    super.disconnectedCallback();
  }

  /**
   * Generate the pass down href if it exists. This helps
   * ensure that if a button is disabled it won't do anything
   * even if it has a resource reference.
   */
  _getShowHref(href, disabled) {
    if (href && !disabled) {
      return href;
    }
  }

  /**
   * Class processing on un-tap / hover
   */
  tapEventOn(e) {
    if (typeof this.hoverClass !== typeof undefined && !this.disabled) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          this.$.button.classList.add(item);
          if (item.indexOf("-") != -1) {
            this.$.icon.classList.add(item);
          }
        }
      });
    }
  }

  /**
   * Undo class processing on un-tap / hover
   */
  tapEventOff(e) {
    if (typeof this.hoverClass !== typeof undefined && !this.disabled) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          this.$.button.classList.remove(item);
          if (item.indexOf("-") != -1) {
            this.$.icon.classList.remove(item);
          }
        }
      });
    }
  }
  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  focusToggle(e) {
    // weird but reality... focus event is the button inside of here
    if (typeof this.hoverClass !== typeof undefined && !this.disabled) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          if (!this.focusState) {
            this.$.button.classList.add(item);
            if (item.indexOf("-") != -1) {
              this.$.icon.classList.add(item);
            }
          } else {
            this.$.button.classList.remove(item);
            if (item.indexOf("-") != -1) {
              this.$.icon.classList.remove(item);
            }
          }
        }
      });
    }
    this.focusState = !this.focusState;
  }
}
window.customElements.define(LrnsysButton.tag, LrnsysButton);
export { LrnsysButton };
