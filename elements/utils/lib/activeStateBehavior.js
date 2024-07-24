export const activeStateBehavior = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.isUserSelected = false;
      setTimeout(() => {
        if (this.addEventListener) {
          this.addEventListener("mouseover", (e) => {
            this.isUserSelected = true;
          });
          this.addEventListener("focusin", (e) => {
            this.isUserSelected = true;
          });

          this.addEventListener("mouseout", (e) => {
            this.isUserSelected = false;
          });
          this.addEventListener("focusout", (e) => {
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
