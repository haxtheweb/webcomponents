// LoadingHelper super class which works in vanilla and LitElement
export const LoadingHelper = function (SuperClass) {
  return class extends SuperClass {
    /**
     * HTMLElement life-cycle
     */
    constructor() {
      super();
      // it is not loaded yet
      this.loaded = false;
    }
    /**
     * LitElement specific callback
     */
    static get properties() {
      return { ...super.properties, loaded: { type: Boolean, reflect: true } };
    }
    /**
     * LitElement specific callback
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      this.loaded = true;
    }
    /**
     * HTMLElement life-cycle
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      // support for LitElement which firstUpdated will supply ready state as we async render
      if (!super.firstUpdated) {
        this.loaded = true;
      }
    }
  };
};
