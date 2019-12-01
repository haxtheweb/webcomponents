/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
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
class CountUpElement extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
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
          font-weight: var(--count-up-number-font-weight);
          font-size: var(--count-up-number-font-size);
        }
      `
    ];
  }
  // render function
  render() {
    return html`
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
        type: Number
      },
      /**
       * End point for counting stopping
       */
      end: {
        type: Number
      },
      /**
       * Duration to count
       */
      duration: {
        type: Number
      },
      /**
       * Disable easing animation
       */
      noeasing: {
        type: Boolean
      },
      /**
       * decimal places to show
       */
      decimalplaces: {
        type: Number
      },
      /**
       * separator for 100s groupings
       */
      separator: {
        type: String
      },
      /**
       * decimal point character
       */
      decimal: {
        type: String
      },
      /**
       * prefix string before the number counting
       */
      prefixtext: {
        type: String
      },
      /**
       * suffix string after the number counting
       */
      suffixtext: {
        type: String
      },
      thresholds: {
        type: Array
      },
      rootMargin: {
        type: String,
        attribute: "root-margin"
      },
      ratio: {
        type: Number,
        reflect: true
      },
      visibleLimit: {
        type: Number,
        reflect: true,
        attribute: "visible-limit"
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
  constructor() {
    super();
    this.start = 0;
    this.end = 100;
    this.duration = 2.5;
    this.noeasing = false;
    this.decimalplaces = 0;
    this.separator = ",";
    this.decimal = ".";
    this.prefixtext = " ";
    this.suffixtext = " ";
    this.thresholds = [0.0, 0.25, 0.5, 0.75, 1.0];
    this.rootMargin = "0px";
    this.visibleLimit = 0.5;
  }
  /**
   * HTMLElement
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
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    this.observer.disconnect();
    super.disconnectedCallback();
  }
  /**
   * LitElement ready
   */
  firstUpdated() {
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
    if (this._countUp) {
      for (let entry of entries) {
        this.ratio = Number(entry.intersectionRatio).toFixed(2);
        if (this.ratio >= this.visibleLimit) {
          // now we care
          this._countUp.start();
        }
      }
    }
  }
}
customElements.define(CountUpElement.tag, CountUpElement);
export { CountUpElement, CountUp };
