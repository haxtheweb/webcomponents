import { autorun, toJS } from "mobx";
import { html, css } from "lit";
import { store } from "./AppHaxStore.js";
import { WiredDarkmodeToggle } from "../wired-darkmode-toggle/wired-darkmode-toggle.js";
import { SimpleTourFinder } from "@haxtheweb/simple-popover/lib/SimpleTourFinder.js";

export class AppHAXWiredToggle extends SimpleTourFinder(WiredDarkmodeToggle) {
  constructor() {
    super();
    this.tourName = "hax";
    // Create a media query to monitor platform color scheme changes
    this.darkModeMediaQuery = globalThis.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    // Function to handle both autorun updates and media query changes
    this._updateToggleState = () => {
      this.checked = toJS(store.darkMode);
      // Disable toggle when platform is in dark mode, preventing switch to light mode
      if (this.darkModeMediaQuery.matches) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    };

    // Set up autorun for store changes
    autorun(this._updateToggleState);

    // Listen for platform color scheme changes
    this.darkModeMediaQuery.addEventListener("change", this._updateToggleState);
  }

  static get tag() {
    return "app-hax-wired-toggle";
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up media query event listener
    if (this.darkModeMediaQuery && this._updateToggleState) {
      this.darkModeMediaQuery.removeEventListener(
        "change",
        this._updateToggleState,
      );
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "checked" && oldValue !== undefined) {
      store.darkMode = this[propName];
      }
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* Screen reader only text */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `
    ];
  }
  render() {
    return html`
      <div
        data-simple-tour-stop
        data-stop-title="data-label"
        data-label="${this.label}"
        aria-describedby="dark-mode-desc"
      >
        ${super.render()}
        <div id="dark-mode-desc" class="sr-only">
          Toggle between light and dark mode themes
        </div>
        <div data-stop-content style="display:none;">
          You can toggle your user interface between "light" and "dark" for your
          viewing enjoyment.
        </div>
      </div>
    `;
  }
}
customElements.define(AppHAXWiredToggle.tag, AppHAXWiredToggle);
