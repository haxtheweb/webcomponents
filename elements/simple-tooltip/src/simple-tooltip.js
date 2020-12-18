/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `simple-tooltip`
 * `a simple tooltip forked from paper-tooltip with the same api minus apply removal`
    ### Styling
    The following custom properties and mixins are available for styling:

    Custom property | Description | Default
    ----------------|-------------|----------
    `--simple-tooltip-background` | The background color of the tooltip | `#616161`
    `--simple-tooltip-opacity` | The opacity of the tooltip | `0.9`
    `--simple-tooltip-text-color` | The text color of the tooltip | `white`
    `--simple-tooltip-delay-in` | Delay before tooltip starts to fade in | `500`
    `--simple-tooltip-delay-out` | Delay before tooltip starts to fade out | `0`
    `--simple-tooltip-duration-in` | Timing for animation when showing tooltip | `500`
    `--simple-tooltip-duration-out` | Timing for animation when hiding tooltip | `0`
 * @demo demo/index.html
 * @element simple-tooltip
 */
class SimpleTooltip extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Convention we use
   */
  static get tag() {
    return "simple-tooltip";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.manualMode = false;
    this.position = "bottom";
    this.fitToVisibleBounds = false;
    this.offset = 14;
    this.marginTop = 14;
    this.animationEntry = "";
    this.animationExit = "";
    this.animationConfig = {
      entry: [{ name: "fade-in-animation", node: this, timing: { delay: 0 } }],
      exit: [{ name: "fade-out-animation", node: this }],
    };
    setTimeout(() => {
      this.addEventListener(
        "webkitAnimationEnd",
        this._onAnimationEnd.bind(this)
      );
      this.addEventListener("mouseenter", this.hide.bind(this));
    }, 0);
  }
  /**
   * Returns the target element that this tooltip is anchored to. It is
   * either the element given by the `for` attribute, or the immediate parent
   * of the tooltip.
   *
   * @type {Node}
   */
  get target() {
    var parentNode = this.parentNode;
    // If the parentNode is a document fragment, then we need to use the host.
    var ownerRoot = this.getRootNode();
    var target;
    if (this.for) {
      target = ownerRoot.querySelector("#" + this.for);
    } else {
      target =
        parentNode.nodeType == Node.DOCUMENT_FRAGMENT_NODE
          ? ownerRoot.host
          : parentNode;
    }
    return target;
  }
  /**
   * @return {void}
   * @override
   */
  disconnectedCallback() {
    if (!this.manualMode) {
      this._removeListeners();
    }
    super.disconnectedCallback();
  }

  /**
   * @deprecated Use show and hide instead.
   * @param {string} type Either `entry` or `exit`
   */
  playAnimation(type) {
    if (type === "entry") {
      this.show();
    } else if (type === "exit") {
      this.hide();
    }
  }

  /**
   * Cancels the animation and either fully shows or fully hides tooltip
   */
  cancelAnimation() {
    // Short-cut and cancel all animations and hide
    this.shadowRoot.querySelector("#tooltip").classList.add("cancel-animation");
  }

  /**
   * Shows the tooltip programatically
   * @return {void}
   */
  show() {
    // If the tooltip is already showing, there's nothing to do.
    if (this._showing) return;

    if (this.textContent.trim() === "") {
      // Check if effective children are also empty
      var allChildrenEmpty = true;
      var effectiveChildren = this.children;
      for (var i = 0; i < effectiveChildren.length; i++) {
        if (effectiveChildren[i].textContent.trim() !== "") {
          allChildrenEmpty = false;
          break;
        }
      }
      if (allChildrenEmpty) {
        return;
      }
    }

    this._showing = true;
    this.shadowRoot.querySelector("#tooltip").classList.remove("hidden");
    this.shadowRoot
      .querySelector("#tooltip")
      .classList.remove("cancel-animation");
    this.shadowRoot
      .querySelector("#tooltip")
      .classList.remove(this._getAnimationType("exit"));
    this.updatePosition();
    this._animationPlaying = true;
    this.shadowRoot
      .querySelector("#tooltip")
      .classList.add(this._getAnimationType("entry"));
  }

  /**
   * Hides the tooltip programatically
   * @return {void}
   */
  hide() {
    // If the tooltip is already hidden, there's nothing to do.
    if (!this._showing) {
      return;
    }

    // If the entry animation is still playing, don't try to play the exit
    // animation since this will reset the opacity to 1. Just end the animation.
    if (this._animationPlaying) {
      this._showing = false;
      this._cancelAnimation();
      return;
    } else {
      // Play Exit Animation
      this._onAnimationFinish();
    }
    this._showing = false;
    this._animationPlaying = true;
    // force hide if we are open too long
    // helps older platforms and the monster known as Safari
    clearTimeout(this.__debounceCancel);
    this.__debounceCancel = setTimeout(() => {
      this._cancelAnimation();
    }, 5000);
  }

  /**
   * @return {void}
   */
  updatePosition() {
    if (!this._target || !this.offsetParent) return;
    var offset = this.offset;
    // If a marginTop has been provided by the user (pre 1.0.3), use it.
    if (this.marginTop != 14 && this.offset == 14) offset = this.marginTop;
    var parentRect = this.offsetParent.getBoundingClientRect();
    var targetRect = this._target.getBoundingClientRect();
    var thisRect = this.getBoundingClientRect();
    var horizontalCenterOffset = (targetRect.width - thisRect.width) / 2;
    var verticalCenterOffset = (targetRect.height - thisRect.height) / 2;
    var targetLeft = targetRect.left - parentRect.left;
    var targetTop = targetRect.top - parentRect.top;
    var tooltipLeft, tooltipTop;
    switch (this.position) {
      case "top":
        tooltipLeft = targetLeft + horizontalCenterOffset;
        tooltipTop = targetTop - thisRect.height - offset;
        break;
      case "bottom":
        tooltipLeft = targetLeft + horizontalCenterOffset;
        tooltipTop = targetTop + targetRect.height + offset;
        break;
      case "left":
        tooltipLeft = targetLeft - thisRect.width - offset;
        tooltipTop = targetTop + verticalCenterOffset;
        break;
      case "right":
        tooltipLeft = targetLeft + targetRect.width + offset;
        tooltipTop = targetTop + verticalCenterOffset;
        break;
    }
    // TODO(noms): This should use IronFitBehavior if possible.
    if (this.fitToVisibleBounds) {
      // Clip the left/right side
      if (parentRect.left + tooltipLeft + thisRect.width > window.innerWidth) {
        this.style.right = "0px";
        this.style.left = "auto";
      } else {
        this.style.left = Math.max(0, tooltipLeft) + "px";
        this.style.right = "auto";
      }
      // Clip the top/bottom side.
      if (parentRect.top + tooltipTop + thisRect.height > window.innerHeight) {
        this.style.bottom = parentRect.height - targetTop + offset + "px";
        this.style.top = "auto";
      } else {
        this.style.top = Math.max(-parentRect.top, tooltipTop) + "px";
        this.style.bottom = "auto";
      }
    } else {
      this.style.left = tooltipLeft + "px";
      this.style.top = tooltipTop + "px";
    }
  }

  _addListeners() {
    if (this._target) {
      this._target.addEventListener("mouseenter", this.show.bind(this));
      this._target.addEventListener("focus", this.show.bind(this));
      this._target.addEventListener("mouseleave", this.hide.bind(this));
      this._target.addEventListener("blur", this.hide.bind(this));
      this._target.addEventListener("tap", this.hide.bind(this));
    }
  }

  _findTarget() {
    if (!this.manualMode) this._removeListeners();
    this._target = this.target;
    if (!this.manualMode) this._addListeners();
  }

  _manualModeChanged() {
    if (this.manualMode) this._removeListeners();
    else this._addListeners();
  }

  _cancelAnimation() {
    // Short-cut and cancel all animations and hide
    this.shadowRoot
      .querySelector("#tooltip")
      .classList.remove(this._getAnimationType("entry"));
    this.shadowRoot
      .querySelector("#tooltip")
      .classList.remove(this._getAnimationType("exit"));
    this.shadowRoot
      .querySelector("#tooltip")
      .classList.remove("cancel-animation");
    this.shadowRoot.querySelector("#tooltip").classList.add("hidden");
  }

  _onAnimationFinish() {
    if (this._showing) {
      this.shadowRoot
        .querySelector("#tooltip")
        .classList.remove(this._getAnimationType("entry"));
      this.shadowRoot
        .querySelector("#tooltip")
        .classList.remove("cancel-animation");
      this.shadowRoot
        .querySelector("#tooltip")
        .classList.add(this._getAnimationType("exit"));
    }
  }

  _onAnimationEnd() {
    // If no longer showing add class hidden to completely hide tooltip
    this._animationPlaying = false;
    if (!this._showing) {
      this.shadowRoot
        .querySelector("#tooltip")
        .classList.remove(this._getAnimationType("exit"));
      this.shadowRoot.querySelector("#tooltip").classList.add("hidden");
    }
  }

  _getAnimationType(type) {
    // These properties have priority over animationConfig values
    if (type === "entry" && this.animationEntry !== "") {
      return this.animationEntry;
    }
    if (type === "exit" && this.animationExit !== "") {
      return this.animationExit;
    }
    // If no results then return the legacy value from animationConfig
    if (
      this.animationConfig[type] &&
      typeof this.animationConfig[type][0].name === "string"
    ) {
      // Checking Timing and Update if necessary - Legacy for animationConfig
      if (
        this.animationConfig[type][0].timing &&
        this.animationConfig[type][0].timing.delay &&
        this.animationConfig[type][0].timing.delay !== 0
      ) {
        var timingDelay = this.animationConfig[type][0].timing.delay;
        // Has Timing Change - Update CSS
        if (type === "entry") {
          document.documentElement.style.setProperty(
            "--simple-tooltip-delay-in",
            timingDelay + "ms"
          );
        } else if (type === "exit") {
          document.documentElement.style.setProperty(
            "--simple-tooltip-delay-out",
            timingDelay + "ms"
          );
        }
      }
      return this.animationConfig[type][0].name;
    }
  }

  _removeListeners() {
    if (this._target) {
      this._target.removeEventListener("mouseover", this.show.bind(this));
      this._target.removeEventListener("focusin", this.show.bind(this));
      this._target.removeEventListener("mouseout", this.hide.bind(this));
      this._target.removeEventListener("focusout", this.hide.bind(this));
      this._target.removeEventListener("click", this.hide.bind(this));
    }
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    this.setAttribute("role", "tooltip");
    this.setAttribute("tabindex", -1);
    this._findTarget();
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "for") {
        this._findTarget(this[propName], oldValue);
      }
      if (propName == "manualMode") {
        this._manualModeChanged(this[propName], oldValue);
      }
      if (propName == "animationDelay") {
        this._delayChange(this[propName], oldValue);
      }
    });
  }
  _delayChange(newValue) {
    // Only Update delay if different value set
    if (newValue !== 500) {
      document.documentElement.style.setProperty(
        "--simple-tooltip-delay-in",
        newValue + "ms"
      );
    }
  }
}
customElements.define(SimpleTooltip.tag, SimpleTooltip);
export { SimpleTooltip };
