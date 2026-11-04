import "@haxtheweb/simple-modal/simple-modal.js";
/**
 * SuperClass to add in accessible clicking capabilities to anything
 * to pop passed in items up via...
 * @var {string} this.modalTitle - title to display in modal
 * @var {object} this.modalContent - HTML element to display as content
 * @var {object} this.modalStyles - optional simple-modal CSS variables for the
 *   dialog; when unset the handler keeps its original 50vw x 50vh sizing
 * @var {string} this.modalTitleIcon - optional icon drawn before the title
 */
export const SimpleModalHandler = function (SuperClass) {
  return class extends SuperClass {
    connectedCallback() {
      super.connectedCallback();
      // respect an author-provided tabindex instead of clobbering it
      if (!this.hasAttribute("tabindex")) {
        this.setAttribute("tabindex", "0");
      }
    }
    constructor() {
      super();
      setTimeout(() => {
        globalThis.SimpleModal.requestAvailability();
        if (this.addEventListener) {
          this.addEventListener(
            "click",
            this.__SimpleModalHandlerClick.bind(this),
          );
          this.addEventListener("keydown", this._keydown.bind(this));
        }
      }, 0);
    }
    /**
     * A11y because we are delegating keyboard function to hit the link when enter pressed
     */
    _keydown(e) {
      switch (e.key) {
        case "Enter":
          // simulate click to go to whatever link / action it has
          this.click();
          break;
      }
    }
    /**
     * Click callback
     */
    __SimpleModalHandlerClick(_e) {
      // fire event
      const evt = new CustomEvent("simple-modal-show", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          title: this.modalTitle,
          titleIcon: this.modalTitleIcon || null,
          elements: {
            content: this.modalContent,
          },
          styles: this.modalStyles || {
            "--simple-modal-min-width": "50vw",
            "--simple-modal-min-height": "50vh",
          },
          invokedBy: this,
          clone: false,
        },
      });
      this.dispatchEvent(evt);
    }
  };
};
