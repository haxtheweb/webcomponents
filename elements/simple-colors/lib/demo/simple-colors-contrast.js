import "../simple-colors.js";
import "../simple-colors-picker.js";
/* This is strictly to demo the other tools */
Polymer({
  _template: html`
    <style is="custom-style">
      .theme-selector {
        border: 1px solid;
        border-color: var(--simple-colors-picker-button-border-color, --simple-colors-background3);
        padding: 15px;
        margin: 5px;
      }
      .theme-selector > div > * {
        align-self: middle;
      } 
      .theme-selector-inner {
        margin: 15px 0;
      }
      .theme-selector-inner > div > * {
        align-self: center;
      }
      .theme-selector-inner > div {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 5px;
      }
      .theme-selector-inner simple-colors-picker {
        margin-left: 0.5em;
        display: inline-flex;
        --simple-colors-picker-preview-size: 15px;
      }
      .theme-selector-inner select { 
        margin-left: 1em;
        border-radius: 0.25em;
        border: 1px solid;
        height: 27px;
        color: var(--simple-colors-picker-button-color, --simple-colors-foreground2);
        border-color: var(--simple-colors-picker-button-border-color, --simple-colors-background3);
        background-color: var(--simple-colors-picker-button-bg-color, --simple-colors-background2);
      }
      #preview {
        border: 1px solid;
        border-color: var(--simple-colors-picker-button-border-color, --simple-colors-background3);
        border-radius: 0.25em;
        padding: 20px;
        text-align: center;
        display: none;
      }
      @media screen and (min-width: 900px) {
        .theme-selector-inner {
          display: flex;
          justify-content: space-around;
        }
        .theme-selector > div {
          align-self: middle;
        } 
        .theme-selector-inner > div {
          align-self: center;
        }
      }
    </style>
    <div class="theme-selector">
      <div>Select WCAG 2.0 AA-compliant contrasting colors. (The contrasting color options will update for you as you select text size, theme and color.)</div>
      <div class="theme-selector-inner">
        <div class="dropdown">
          <label for="theme">Theme: </label>
          <select id="theme">
            <option>light</option>
            <option>dark</option>
          </select>
        </div>
        <div class="dropdown">
          <label for="size">Text Size: </label>
          <select id="size">
            <option>small text</option>
            <option>large text</option>
          </select>
        </div>
        <div>
          <label for="color">Color:</label>
          <simple-colors-picker id="color"></simple-colors-picker>
        </div>
        <div>
          <label for="contrast">Contrasting Color:</label>
          <simple-colors-picker id="contrast" disabled=""></simple-colors-picker>
        </div>
      </div> 
      <div id="preview">
        <p><span id="fgColor"></span><span id="fgHex"></span></p>
        <p><span id="bgColor"></span><span id="bgHex"></span></p>
      </div>
    </div>
`,

  is: "simple-colors-contrast",
  behaviors: [simpleColorsBehaviors],

  ready: function() {
    let root = this;
    root.$.theme.addEventListener("change", function() {
      root.$.color.theme = root.$.theme[root.$.theme.selectedIndex].innerText;
      root.$.color.value = null;
      root.$.color.updateSwatches();
    });
    root.$.size.addEventListener("change", function() {
      let swatch =
          root.$.color.value !== null ? root.$.color.value.cssVariable : null,
        isLargeText =
          root.$.size[root.$.size.selectedIndex].innerText !== "small text";
      root.$.contrast.value = null;
      root.$.preview.style.fontSize = isLargeText ? "18pt" : "14pt";
      root.$.contrast.updateSwatches(swatch, isLargeText);
    });
    root.$.color.addEventListener("change", function() {
      root.$.contrast.toggleCollapse(true);
      root.$.contrast.value = null;
      if (root.$.color.value !== null) {
        root.$.contrast.disabled = false;
        root.$.contrast.theme =
          root.$.theme[root.$.theme.selectedIndex].innerText;
        root.$.contrast.updateSwatches(
          root.$.color.value.cssVariable,
          root.$.size[root.$.size.selectedIndex].innerText !== "small text"
        );
      } else {
        root.$.contrast.disabled = true;
      }
    });
    root.$.contrast.addEventListener("change", function() {
      if (root.$.contrast.value !== null) {
        let fg =
            root.$.color.value.cssVariable.indexOf("foreground") > -1
              ? root.$.color.value
              : root.$.contrast.value,
          bg =
            root.$.color.value.cssVariable.indexOf("foreground") < 0
              ? root.$.color.value
              : root.$.contrast.value;
        root.$.fgColor.innerText = fg.cssVariable;
        root.$.fgHex.innerText = " (" + fg.hexCode + ")";
        root.$.bgColor.innerText = bg.cssVariable;
        root.$.bgHex.innerText = " (" + bg.hexCode + ")";
        root.$.preview.style.color = fg.hexCode;
        root.$.preview.style.backgroundColor = bg.hexCode;
        root.$.preview.style.display = "block";
      } else {
        root.$.preview.style.display = "none";
      }
    });
  }
});
