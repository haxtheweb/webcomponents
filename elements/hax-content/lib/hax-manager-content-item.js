import "@polymer/polymer/polymer.js";
Polymer({
  _template: `
    <style>
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        font-size: 1em;
      }
      :host > *:not(.overlay) {
      }
      h3 {
        margin: none;
        margin-bottom: .8em;
        text-align: center;
      }
      .overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(220, 255, 251, 0.87);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3em;
        color: white;
        text-shadow: 1px 1px 5px black;
        text-align: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity .3s ease-in-out;
        z-index: 5;
        line-height: 1;
      }
      :host:hover .overlay,
      :host:focus {
        opacity: 1;
      }
    </style>
    <h3>[[value]]</h3>
    <a class="overlay" tabindex="-1">Select [[type]]</a>
`,

  is: "hax-manager-content-item",

  properties: {
    type: String,
    value: {
      type: String,
      observer: "_changedValue"
    }
  },

  listeners: {
    tap: "_tappedRoot"
  },

  _changedValue: function(value, old) {
    if (value !== old) {
      let node = document.createElement(value);
      Polymer.dom(this.root).appendChild(node);
      let placeHolder = this.$$(value);
      if (placeHolder) {
        if (typeof placeHolder._demoInit == "function") {
          const demo = placeHolder._demoInit();
          if (demo) {
            placeHolder.parentElement.removeChild(placeHolder);
            Polymer.dom(this.root).appendChild(demo);
          }
        }
      }
    }
  },

  _tappedRoot: function(e) {
    this.fire("hax-item-selected", { value: this.value });
  }
});
