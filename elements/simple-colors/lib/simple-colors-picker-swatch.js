import "../simple-colors.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        padding: 0;
        margin: 0;
        border-radius: 0;
        box-sizing: content-box;
      }
      :host[disabled] {
        opacity: 0.5;
      }
      :host:not([disabled]):focus,
      :host:not([disabled]):hover {
        cursor: pointer;
      }
      :host[disabled]:focus,
      :host[disabled]:hover {
        cursor: not-allowed;
      }
      :host[selected] {
        outline: 1px solid white;
      }
      :host[dark][selected]{
        outline: 1px solid black;
      }
      :host:focus,
      :host:hover {
        outline: 1px dotted white;
      }
      :host[dark]:focus,
      :host[dark]:hover {
        outline: 1px dotted black;
      }
    </style>
`,

  is: "simple-colors-picker-swatch",

  properties: {
    /**
     * is the swatch disabled?
     */
    disabled: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * The hex code of the color
     */
    hex: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
    /**
     * The name of the color
     */
    label: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
    /**
     * The level of the color
     */
    level: {
      type: Number,
      value: null,
      reflectToAttribute: true
    },
    /**
     * The order of the color
     */
    order: {
      type: Number,
      value: null,
      reflectToAttribute: true
    },
    /**
     * is the swatch selected?
     */
    selected: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }
  },

  /**
   * sets event listeners
   */
  ready: function() {
    let root = this;
    if (root.level > 5) root.setAttribute("dark", "dark");
    root.style.backgroundColor = root.hex;
    root.addEventListener("click", function(e) {
      root.fire("click-swatch", root);
    });
    root.addEventListener("keyup", function(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        root.fire("click-swatch", root);
      } else if (e.keyCode === 37) {
        root.fire("previous-swatch", root);
      } else if (e.keyCode === 39) {
        root.fire("next-swatch", root);
      } else if (e.keyCode === 38) {
        root.fire("next-level", root);
      } else if (e.keyCode === 40) {
        root.fire("previous-level", root);
      }
    });
  }
});
