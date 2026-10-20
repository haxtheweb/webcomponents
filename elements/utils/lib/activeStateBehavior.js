export const activeStateBehavior = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.isUserSelected = false;
      setTimeout(() => {
        if (this.addEventListener) {
          this.addEventListener("mouseover", (_e) => {
            this.isUserSelected = true;
          });
          this.addEventListener("focusin", (_e) => {
            this.isUserSelected = true;
          });

          this.addEventListener("mouseout", (_e) => {
            this.isUserSelected = false;
          });
          this.addEventListener("focusout", (_e) => {
            this.isUserSelected = false;
          });
        }
      }, 0);
    }
    static get properties() {
      let prop = {};
      if (super.properties) {
        prop = super.properties;
      }
      prop.isUserSelected = {
        type: Boolean,
        reflect: true,
        attribute: "is-user-selected",
      };
      return prop;
    }
  };
};
