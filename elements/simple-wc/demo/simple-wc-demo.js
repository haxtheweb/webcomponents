import { createSWC } from "../simple-wc.js";
// create a very simple web component
createSWC({
  // name of the web component to register
  name: "simple-button",
  // HTML contents, el is the element itself and html is the processing function
  html: (el, html) => {
    return html`
      <button id="stuff"><iron-icon icon="save"></iron-icon>${el.title}</button>
    `;
  },
  // CSS styles, el is the element itself and css is the processing function
  css: (el, css) => {
    return css`
      :host {
        display: block;
      }
      :host([color-value="blue"]) button {
        background-color: blue;
        font-size: 16px;
        color: yellow;
      }
      :host([color-value="green"]) button {
        background-color: green;
        font-size: 16px;
        color: yellow;
      }
      iron-icon {
        padding-right: 8px;
      }
    `;
  },
  // dynamically imported dependencies
  deps: [
    "@polymer/iron-icon/iron-icon.js",
    "@polymer/iron-icons/iron-icons.js",
  ],
  // data handling and properties
  data: {
    // default values
    values: {
      colorValue: "blue",
      title: "Button",
    },
    // reflect to css attribute
    reflect: ["colorValue"],
  },
});

// create a slightly more complex "simple" web component
createSWC({
  // name of the web component to register
  name: "simple-wc-demo",
  // HTML contents, el is the element itself and html is the processing function
  html: (el, html) => {
    return html`
      <paper-card raised>
        <simple-button
          id="stuff"
          color-value="${el.color}"
          title="${el.title}"
        ></simple-button>
      </paper-card>
    `;
  },
  // CSS styles, el is the element itself and css is the processing function
  css: (el, css) => {
    return css`
      :host {
        display: block;
      }
    `;
  },
  // dynamically imported dependencies
  deps: ["@polymer/paper-card/paper-card.js"],
  // events to listenr for and react to
  events: {
    // window events are added on connection and disconnection
    window: {
      "hax-app-selected": "_appSelected",
      "hax-store-property-updated": "_haxStorePropertyUpdated",
    },
    // after shadowRoot is available, querySelect the key, then apply the event and callback
    shadow: {
      "#stuff": {
        click: "_clickedStuff",
      },
    },
  },
  // data handling and properties
  data: {
    // default values
    values: {
      shadow: 0,
      border: true,
      color: "blue",
      title: "My Title",
      anotherValue: 1,
    },
    // reflect to css attribute
    reflect: ["color"],
    // fire up an event whatever-changed on value change
    notify: ["shadow", "color"],
    // run this function when these values change
    // 3rd optional parameter is what value to compute based on the others
    observe: [
      [["border", "color"], "computeShadow", "shadow"],
      [["color"], "colorChanged"],
    ],
    // HAX data wiring
    hax: {
      color: "colorpicker",
      border: "number",
    },
  },
  // callbacks available to the above code
  // this is where all the logic is put into action
  callbacks: {
    colorChanged(newValue, oldValue) {
      console.log(newValue);
    },
    computeShadow(border, color) {
      console.log(border, color);
    },
    _appSelected(e) {},
    _haxStorePropertyUpdated(e) {},
    _clickedStuff(e) {
      console.log("click");
    },
  },
});
