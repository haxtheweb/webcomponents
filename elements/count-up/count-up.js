/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { CountUp } from "countup.js";

/**
 * `count-up`
 * @customElement count-up
 * `count up js wrapper with minimal styling`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @lit-element
 * @demo demo/index.html
 */
class CountUpElement extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          --count-up-color: #000000;
        }

        :host([hidden]) {
          display: none;
        }

        .wrapper {
          display: block;
          text-align: center;
          width: 100%;
          height: 100%;
        }

        #counter {
          color: var(--count-up-color);
          @apply --count-up-number;
        }
      </style>
      <div class="wrapper">
        <slot name="prefix"></slot>
        <div id="counter"></div>
        <slot name="suffix"></slot>
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Count up",
        description: "count up js wrapper with minimal styling",
        icon: "icons:android",
        color: "green",
        groups: ["Up"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "start",
            description: "",
            inputMethod: "textfield"
          },
          {
            property: "end",
            description: "",
            inputMethod: "textfield"
          },
          {
            property: "duration",
            description: "",
            inputMethod: "textfield"
          },
          {
            property: "noeasing",
            description: "",
            inputMethod: "boolean"
          },
          {
            property: "decimalplaces",
            description: "",
            inputMethod: "textfield"
          },
          {
            property: "separator",
            description: "",
            inputMethod: "textfield"
          },
          {
            property: "decimal",
            description: "",
            inputMethod: "textfield"
          },
          {
            property: "prefix",
            description: "",
            inputMethod: "textfield"
          },
          {
            property: "suffix",
            description: "",
            inputMethod: "textfield"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Starting point for counting
       */
      start: {
        name: "start",
        type: Number,
        value: 0
      },
      /**
       * End point for counting stopping
       */
      end: {
        name: "end",
        type: Number,
        value: 100
      },
      /**
       * Duration to count
       */
      duration: {
        name: "duration",
        type: Number,
        value: 2.5
      },
      /**
       * Disable easing animation
       */
      noeasing: {
        name: "noeasing",
        type: Boolean,
        value: false
      },
      /**
       * decimal places to show
       */
      decimalplaces: {
        name: "decimalPlaces",
        type: Number,
        value: 0
      },
      /**
       * separator for 100s groupings
       */
      separator: {
        name: "separator",
        type: String,
        value: ","
      },
      /**
       * decimal point character
       */
      decimal: {
        name: "decimal",
        type: String,
        value: "."
      },
      /**
       * prefix string before the number counting
       */
      prefixtext: {
        name: "prefixtext",
        type: String,
        value: " "
      },
      /**
       * suffix string after the number counting
       */
      suffixtext: {
        name: "suffixtext",
        type: String,
        value: " "
      },
      thresholds: {
        type: Array,
        value: [0.0, 0.25, 0.5, 0.75, 1.0]
      },
      rootMargin: {
        type: String,
        value: "0px"
      },
      ratio: {
        type: Number,
        reflectToAttribute: true,
        readOnly: true
      },
      visibleLimit: {
        type: Number,
        value: 0.5,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "count-up";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    // setup the intersection observer
    this.observer = new IntersectionObserver(
      this.handleIntersectionCallback.bind(this),
      {
        root: document.rootElement,
        rootMargin: this.rootMargin,
        threshold: this.thresholds
      }
    );
    this.observer.observe(this);
    const options = {
      startVal: this.start,
      decimalPlaces: this.decimalplaces,
      duration: this.duration,
      useEasing: !this.noeasing,
      separator: this.separator,
      decimal: this.decimal,
      prefix: this.prefixtext,
      suffix: this.suffixtext
    };
    this._countUp = new CountUp(
      this.shadowRoot.querySelector("#counter"),
      this.end,
      options
    );
  }
  handleIntersectionCallback(entries) {
    for (let entry of entries) {
      this._setRatio(Number(entry.intersectionRatio).toFixed(2));
      if (this.ratio >= this.visibleLimit) {
        // now we care
        this._countUp.start();
      }
    }
  }
}
customElements.define(CountUpElement.tag, CountUpElement);
export { CountUpElement, CountUp };
