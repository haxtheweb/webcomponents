import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";
class ElmsmediaDashboardFilters extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        paper-dropdown-menu {
          display: block;
          width: 100%;
        }
      </style>

      <paper-dropdown-menu label="Order">
        <paper-listbox
          slot="dropdown-content"
          attr-for-selected="name"
          selected="{{form.order}}"
        >
          <paper-item name="ASC">Ascending</paper-item>
          <paper-item name="DESC">Descending</paper-item>
        </paper-listbox>
      </paper-dropdown-menu>

      <paper-dropdown-menu label="Media Type">
        <paper-listbox
          slot="dropdown-content"
          attr-for-selected="name"
          selected="{{form.media_type}}"
        >
          <paper-item name="elmsmedia_image">Image</paper-item>
          <paper-item name="h5p">H5P</paper-item>
          <paper-item name="video">Video</paper-item>
          <paper-item name="external_video">External Video</paper-item>
          <paper-item name="audio">audio</paper-item>
        </paper-listbox>
      </paper-dropdown-menu>
    `;
  }
  static get tag() {
    return "elmsmedia-dashboard-filters";
  }
  static get properties() {
    return {
      form: {
        type: Object,
        value: {}
      }
    };
  }

  static get observers() {
    return ["_formChanged(form.*)"];
  }

  _formChanged(form) {
    const path = form.path.replace("form.", "");
    const propValue = form.value;
    this.dispatchEvent(
      new CustomEvent("add-filter", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          path: path,
          propValue: propValue
        }
      })
    );
  }
}
window.customElements.define(
  ElmsmediaDashboardFilters.tag,
  ElmsmediaDashboardFilters
);
export { ElmsmediaDashboardFilters };
