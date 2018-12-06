import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";
let ElmsmediaDashboardFilters = Polymer({
  _template: html`
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
  `,

  is: "elmsmedia-dashboard-filters",

  properties: {
    form: {
      type: Object,
      value: {}
    }
  },

  observers: ["_formChanged(form.*)"],

  _formChanged: function(form) {
    const path = form.path.replace("form.", "");
    const propValue = form.value;
    this.fire("add-filter", {
      path: path,
      propValue: propValue
    });
  }
});
export { ElmsmediaDashboardFilters };
