/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
// from CountUp
var __assign =
  (this && this.__assign) ||
  function() {
    return (__assign =
      Object.assign ||
      function(t) {
        for (var i, a = 1, s = arguments.length; a < s; a++)
          for (var n in (i = arguments[a]))
            Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]);
        return t;
      }).apply(this, arguments);
  };
const CountUp = (function() {
  function t(t, i, a) {
    var h = this;
    (this.target = t),
      (this.endVal = i),
      (this.options = a),
      (this.version = "2.0.3"),
      (this.defaults = {
        startVal: 0,
        decimalPlaces: 0,
        duration: 2,
        useEasing: !0,
        useGrouping: !0,
        smartEasingThreshold: 999,
        smartEasingAmount: 333,
        separator: ",",
        decimal: ".",
        prefix: "",
        suffix: ""
      }),
      (this.finalEndVal = null),
      (this.useEasing = !0),
      (this.countDown = !1),
      (this.error = ""),
      (this.startVal = 0),
      (this.paused = !0),
      (this.count = function(t) {
        h.startTime || (h.startTime = t);
        var i = t - h.startTime;
        (h.remaining = h.duration - i),
          h.useEasing
            ? h.countDown
              ? (h.frameVal =
                  h.startVal -
                  h.easingFn(i, 0, h.startVal - h.endVal, h.duration))
              : (h.frameVal = h.easingFn(
                  i,
                  h.startVal,
                  h.endVal - h.startVal,
                  h.duration
                ))
            : h.countDown
            ? (h.frameVal =
                h.startVal - (h.startVal - h.endVal) * (i / h.duration))
            : (h.frameVal =
                h.startVal + (h.endVal - h.startVal) * (i / h.duration)),
          h.countDown
            ? (h.frameVal = h.frameVal < h.endVal ? h.endVal : h.frameVal)
            : (h.frameVal = h.frameVal > h.endVal ? h.endVal : h.frameVal),
          (h.frameVal = Math.round(h.frameVal * h.decimalMult) / h.decimalMult),
          h.printValue(h.frameVal),
          i < h.duration
            ? (h.rAF = requestAnimationFrame(h.count))
            : null !== h.finalEndVal
            ? h.update(h.finalEndVal)
            : h.callback && h.callback();
      }),
      (this.formatNumber = function(t) {
        var i,
          a,
          s,
          n,
          e,
          r = t < 0 ? "-" : "";

        if (
          ((i = Math.abs(t).toFixed(h.options.decimalPlaces)),
          (s = (a = (i += "").split("."))[0]),
          (n = 1 < a.length ? h.options.decimal + a[1] : ""),
          h.options.useGrouping)
        ) {
          e = "";

          for (var o = 0, l = s.length; o < l; ++o)
            0 !== o && o % 3 == 0 && (e = h.options.separator + e),
              (e = s[l - o - 1] + e);

          s = e;
        }

        return (
          h.options.numerals &&
            h.options.numerals.length &&
            ((s = s.replace(/[0-9]/g, function(t) {
              return h.options.numerals[+t];
            })),
            (n = n.replace(/[0-9]/g, function(t) {
              return h.options.numerals[+t];
            }))),
          r + h.options.prefix + s + n + h.options.suffix
        );
      }),
      (this.easeOutExpo = function(t, i, a, s) {
        return (a * (1 - Math.pow(2, (-10 * t) / s)) * 1024) / 1023 + i;
      }),
      (this.options = __assign({}, this.defaults, a)),
      (this.formattingFn = this.options.formattingFn
        ? this.options.formattingFn
        : this.formatNumber),
      (this.easingFn = this.options.easingFn
        ? this.options.easingFn
        : this.easeOutExpo),
      (this.startVal = this.validateValue(this.options.startVal)),
      (this.frameVal = this.startVal),
      (this.endVal = this.validateValue(i)),
      (this.options.decimalPlaces = Math.max(this.options.decimalPlaces)),
      (this.decimalMult = Math.pow(10, this.options.decimalPlaces)),
      this.resetDuration(),
      (this.options.separator = String(this.options.separator)),
      (this.useEasing = this.options.useEasing),
      "" === this.options.separator && (this.options.useGrouping = !1),
      (this.el = "string" == typeof t ? document.getElementById(t) : t),
      this.el
        ? this.printValue(this.startVal)
        : (this.error = "[CountUp] target is null or undefined");
  }

  return (
    (t.prototype.determineDirectionAndSmartEasing = function() {
      var t = this.finalEndVal ? this.finalEndVal : this.endVal;
      this.countDown = this.startVal > t;
      var i = t - this.startVal;

      if (Math.abs(i) > this.options.smartEasingThreshold) {
        this.finalEndVal = t;
        var a = this.countDown ? 1 : -1;
        (this.endVal = t + a * this.options.smartEasingAmount),
          (this.duration = this.duration / 2);
      } else (this.endVal = t), (this.finalEndVal = null);

      this.finalEndVal
        ? (this.useEasing = !1)
        : (this.useEasing = this.options.useEasing);
    }),
    (t.prototype.start = function(t) {
      this.error ||
        ((this.callback = t),
        0 < this.duration
          ? (this.determineDirectionAndSmartEasing(),
            (this.paused = !1),
            (this.rAF = requestAnimationFrame(this.count)))
          : this.printValue(this.endVal));
    }),
    (t.prototype.pauseResume = function() {
      this.paused
        ? ((this.startTime = null),
          (this.duration = this.remaining),
          (this.startVal = this.frameVal),
          this.determineDirectionAndSmartEasing(),
          (this.rAF = requestAnimationFrame(this.count)))
        : cancelAnimationFrame(this.rAF),
        (this.paused = !this.paused);
    }),
    (t.prototype.reset = function() {
      cancelAnimationFrame(this.rAF),
        (this.paused = !0),
        this.resetDuration(),
        (this.startVal = this.validateValue(this.options.startVal)),
        (this.frameVal = this.startVal),
        this.printValue(this.startVal);
    }),
    (t.prototype.update = function(t) {
      cancelAnimationFrame(this.rAF),
        (this.startTime = null),
        (this.endVal = this.validateValue(t)),
        this.endVal !== this.frameVal &&
          ((this.startVal = this.frameVal),
          this.finalEndVal || this.resetDuration(),
          this.determineDirectionAndSmartEasing(),
          (this.rAF = requestAnimationFrame(this.count)));
    }),
    (t.prototype.printValue = function(t) {
      var i = this.formattingFn(t);
      "INPUT" === this.el.tagName
        ? (this.el.value = i)
        : "text" === this.el.tagName || "tspan" === this.el.tagName
        ? (this.el.textContent = i)
        : (this.el.innerHTML = i);
    }),
    (t.prototype.ensureNumber = function(t) {
      return "number" == typeof t && !isNaN(t);
    }),
    (t.prototype.validateValue = function(t) {
      var i = Number(t);
      return this.ensureNumber(i)
        ? i
        : ((this.error = "[CountUp] invalid start or end value: " + t), null);
    }),
    (t.prototype.resetDuration = function() {
      (this.startTime = null),
        (this.duration = 1e3 * Number(this.options.duration)),
        (this.remaining = this.duration);
    }),
    t
  );
})();

/**
 * `count-up`
 * `count up js wrapper with minimal styling`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
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
      /**
       * Starting point for counting
       */
      start: {
        name: "start",
        type: "Number",
        value: 0
      },
      /**
       * End point for counting stopping
       */
      end: {
        name: "end",
        type: "Number",
        value: 100
      },
      /**
       * Duration to count
       */
      duration: {
        name: "duration",
        type: "Number",
        value: 2.5
      },
      /**
       * Disable easing animation
       */
      noeasing: {
        name: "noeasing",
        type: "Boolean",
        value: false
      },
      /**
       * decimal places to show
       */
      decimalplaces: {
        name: "decimalPlaces",
        type: "Number",
        value: 0
      },
      /**
       * separator for 100s groupings
       */
      separator: {
        name: "separator",
        type: "String",
        value: ","
      },
      /**
       * decimal point character
       */
      decimal: {
        name: "decimal",
        type: "String",
        value: "."
      },
      /**
       * prefix string before the number counting
       */
      prefixtext: {
        name: "prefixtext",
        type: "String",
        value: " "
      },
      /**
       * suffix string after the number counting
       */
      suffixtext: {
        name: "suffixtext",
        type: "String",
        value: " "
      },
      thresholds: {
        type: "Array",
        value: [0.0, 0.25, 0.5, 0.75, 1.0]
      },
      rootMargin: {
        type: "String",
        value: "0px"
      },
      ratio: {
        type: "Number",
        reflectToAttribute: true,
        readOnly: true
      },
      visibleLimit: {
        type: "Number",
        value: 0.5,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "count-up";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(CountUpElement.haxProperties, "count-up", this);
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
    this._countUp = new CountUp(this.$.counter, this.end, options);
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
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("count-up", CountUpElement);
export { CountUpElement, CountUp };
