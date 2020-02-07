/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `IntersectionElementSuper`
 * `Wiring to provide basic IntersectionObserver support to any web component`
 */
const IntersectionElementSuper = function(SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.elementVisible = false;
      this.thresholds = [0.0, 0.25, 0.5, 0.75, 1.0];
      this.rootMargin = "0px";
      this.visibleLimit = 0.5;
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      // setup the intersection observer
      this.intersectionObserver = new IntersectionObserver(
        this.handleIntersectionCallback.bind(this),
        {
          root: document.rootElement,
          rootMargin: this.rootMargin,
          threshold: this.thresholds
        }
      );
      this.intersectionObserver.observe(this);
    }

    disconnectedCallback() {
      this.intersectionObserver.disconnect();
      if (super.disconnectedCallback) {}
      super.disconnectedCallback();
    }
    /**
     * Very basic IntersectionObserver callback which will set elementVisible to true
     */
    handleIntersectionCallback(entries) {
      for (let entry of entries) {
        this.ratio = Number(entry.intersectionRatio).toFixed(2);
        if (this.ratio >= this.visibleLimit) {
          this.elementVisible = true;
        }
      }
    }
  }
}

export { IntersectionElementSuper };