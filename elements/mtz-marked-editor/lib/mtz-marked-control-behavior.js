export const mtzMarkedControlBehavior = function(SuperClass) {
  return class extends SuperClass {
    static get properties() {
      let props = {
        /* Reference to the editor. Set programatically */
        __editor: Object
      };
      if (super.properties) {
        props = Object.assign(props, super.properties);
      }
      return props;
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
          detail: true
        })
      );
    }
  };
};
