import { autorun, toJS } from "mobx";
import { html } from "lit";
import { store } from "./AppHaxStore.js";
import { WiredDarkmodeToggle } from "@haxtheweb/haxcms-elements/lib/core/ui/wired-darkmode-toggle/wired-darkmode-toggle.js";
import { SimpleTourFinder } from "@haxtheweb/simple-popover/lib/SimpleTourFinder.js";

export class AppHAXWiredToggle extends SimpleTourFinder(WiredDarkmodeToggle) {
  constructor() {
    super();
    this.tourName = "hax";
    autorun(() => {
      this.checked = toJS(store.darkMode);
      if (globalThis.matchMedia("(prefers-color-scheme: dark)").matches) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    });
  }

  static get tag() {
    return "app-hax-wired-toggle";
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "checked" && oldValue !== undefined) {
        store.darkMode = this[propName];
        store.appEl.playSound("click");
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
globalThis.customElements.define(AppHAXWiredToggle.tag, AppHAXWiredToggle);
