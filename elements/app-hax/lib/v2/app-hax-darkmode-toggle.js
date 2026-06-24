import { autorun, toJS } from "mobx";
import { DarkmodeToggle } from "@haxtheweb/haxcms-elements/lib/core/ui/darkmode-toggle/darkmode-toggle.js";
import { store } from "./AppHaxStore.js";

export class AppHAXDarkmodeToggle extends DarkmodeToggle {
  constructor() {
    super();
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
    return "app-hax-darkmode-toggle";
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
}
globalThis.customElements.define(AppHAXDarkmodeToggle.tag, AppHAXDarkmodeToggle);
