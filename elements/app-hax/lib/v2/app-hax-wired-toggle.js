import { autorun, toJS } from "mobx";
import { html } from "lit";
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
  render() {
    return html`
      <div
        data-simple-tour-stop
        data-stop-title="data-label"
        data-label="${this.label}"
      >
        ${super.render()}
        <div data-stop-content style="display:none;">
          You can toggle your user interface between "light" and "dark" for you
          viewing enjoyment.
        </div>
      </div>
    `;
  }
}
customElements.define(AppHAXWiredToggle.tag, AppHAXWiredToggle);
