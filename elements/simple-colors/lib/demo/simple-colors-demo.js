import "../simple-colors.js";
/* This is strictly to demo the other tools */
Polymer({
  _template: `
    <style is="custom-style">
      .theme-selector {
        border: 1px solid #ddd;
        padding: 15px;
      }
      .theme-selector,
      .theme-selector > div {
        margin-bottom: 5px;
      }
      .theme-selector .prompt {
        margin-bottom: 15px;
      }
      .theme-selector select { 
        margin-left: 1em;
        border-radius: 0.25em;
        border: 1px solid;
        height: 27px;
        color: var(--simple-colors-picker-button-color, --simple-colors-foreground2);
        border-color: var(--simple-colors-picker-button-border-color, --simple-colors-background3);
        background-color: var(--simple-colors-picker-button-bg-color, --simple-colors-background2);
      }
      @media screen and (min-width: 900px) {
        .theme-selector,
        .theme-selector > div {
          display: flex;
          justify-content: space-around;
        }
        .theme-selector > div, 
        .theme-selector > div > * {
          align-self: middle;
        } 
      }
    </style>
    <slot name="preselector"></slot>
    <div class="theme-selector">
      <div class="prompt">Change the theme and/or accent color: </div>
      <div>
        <label for="theme">Theme: </label>
        <select id="theme">
          <option>light (default)</option>
          <option>dark</option>
        </select>
      </div>
      <div>
        <label for="accent">Accent Color: </label>
        <select id="accent">
          <option>none (default)</option>
          <option>red</option>
          <option>pink</option>
          <option>purple</option>
          <option>deep-purple</option>
          <option>indigo</option>
          <option>blue</option>
          <option>light-blue</option>
          <option>cyan</option>
          <option>teal</option>
          <option>green</option>
          <option>light-green</option>
          <option>lime</option>
          <option>yellow</option>
          <option>amber</option>
          <option>orange</option>
          <option>deep-orange</option>
          <option>brown</option>
          <option>blue-grey</option>
        </select>
      </div>
    </div>
    <slot></slot>
`,

  is: "simple-colors-demo",
  behaviors: [simpleColorsBehaviors],

  properties: {
    target: {
      type: String,
      value: null
    }
  },

  ready: function() {
    let root = this,
      accent = root.$.accent,
      theme = root.$.theme,
      span,
      updateSpan = function(content) {
        let ac =
            accent.selectedIndex > 0
              ? ' accent-color="' +
                accent.options[accent.selectedIndex].innerText +
                '"'
              : "",
          dark =
            theme.options[theme.selectedIndex].innerText === "dark"
              ? " dark"
              : "";
        if (span === undefined) {
          span = document.createElement("span");
          span.style.fontWeight = "700";
          let code = document.getElementById(root.target);
          if (code !== undefined && code !== null) {
            code.querySelector("code span span").appendChild(span);
          }
        }
        span.innerHTML = dark + ac;
      };

    accent.onchange = function() {
      updateSpan();
      root.accentColor = accent.options[accent.selectedIndex].innerText;
    };
    theme.onchange = function() {
      updateSpan();
      root.dark = theme.options[theme.selectedIndex].innerText === "dark";
    };
  }
});
