/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `IntersectionObserverMixin`
 * `Wiring to provide basic IntersectionObserver support to any web component`
 */
const IntersectionObserverMixin = function (SuperClass) {
  // SuperClass so we can write any web component library / base class
  return class extends SuperClass {
    /**
     * Constructor
     */
    constructor() {
      super();
      // listen for this to be true in your element
      this.elementVisible = false;
      // threasholds to check for, every 25%
      this.IOThresholds = [0.0, 0.25, 0.5, 0.75, 1.0];
      // margin from root element
      this.IORootMargin = "0px";
      // wait till at least 50% of the item is visible to claim visible
      this.IOVisibleLimit = 0.5;
      // drop the observer once we are visible
      this.IORemoveOnVisible = true;
      // delay in observing, performance reasons for minimum at 100
      this.IODelay = 100;
      // root element of the viewport; null means the screen
      this.IORoot = null;
    }
    /**
     * Properties, LitElement format
     */
    static get properties() {
      let props = {};
      if (super.properties) {
        props = super.properties;
      }
      return {
        ...props,
        elementVisible: {
          type: Boolean,
          attribute: "element-visible",
          reflect: true,
        },
      };
    }
    /**
     * HTMLElement specification
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      // setup the intersection observer, only if we are not visible
      if (!this.elementVisible) {
        this.intersectionObserver = new IntersectionObserver(
          this.handleIntersectionCallback.bind(this),
          {
            root: this.IORoot,
            rootMargin: this.IORootMargin,
            threshold: this.IOThresholds,
            delay: this.IODelay,
          }
        );
        this.intersectionObserver.observe(this);
      }
    }
    /**
     * HTMLElement specification
     */
    disconnectedCallback() {
      // if we have an intersection observer, disconnect it
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
        // edge case where element is moved in the DOM so that
        // connnected will set the event back up accurately
        this.elementVisible = false;
      }
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
    /**
     * Very basic IntersectionObserver callback which will set elementVisible to true
     */
    handleIntersectionCallback(entries) {
      for (let entry of entries) {
        let ratio = Number(entry.intersectionRatio).toFixed(2);
        // ensure ratio is higher than our limit before trigger visibility
        if (ratio >= this.IOVisibleLimit) {
          this.elementVisible = true;
          // remove the observer if we've reached our target of being visible
          if (this.IORemoveOnVisible) {
            this.intersectionObserver.disconnect();
          }
        } else {
          this.elementVisible = false;
        }
      }
    }
  };
};

export { IntersectionObserverMixin };
