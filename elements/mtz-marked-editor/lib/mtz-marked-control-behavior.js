export const mtzMarkedControlBehavior = function (SuperClass) {
  return class extends SuperClass {
    static get properties() {
      return {
        ...super.properties,

        /* Reference to the editor. Set programatically */
        __editor: Object,
      };
    }
    /**
     * Registers the control with the editor to obtain the editor instance
     * @fires register-control
     */
    connectedCallback() {
      super.connectedCallback();
      this.dispatchEvent(
        new CustomEvent("register-control", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true,
        })
      );
    }
  };
};
