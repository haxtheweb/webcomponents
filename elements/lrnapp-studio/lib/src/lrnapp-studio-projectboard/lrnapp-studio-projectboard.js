import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "scary-gallery/scary-gallery.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "../lrnapp-studio-displayboard/lrnapp-studio-displayboard.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <app-location route="{{route}}"></app-location>
    <app-route route="{{route}}" pattern="/projectboard/:projectId" data="{{routeData}}" tail="{{subroute}}" active="{{active}}">
    </app-route>

THIS IS SUPPOSED TO BE THE STUDIO. CLICK ON ONE
     <scary-gallery min-height="100">
            <scary-image class="projectboard-item" src="https://unsplash.it/300"></scary-image>
            <scary-image class="projectboard-item" src="https://unsplash.it/300"></scary-image>
            <scary-image class="projectboard-item" src="https://unsplash.it/300"></scary-image>
            <scary-image class="projectboard-item" src="https://unsplash.it/300"></scary-image>
            <scary-image class="projectboard-item" src="https://unsplash.it/300"></scary-image>
            <scary-image class="projectboard-item" src="https://unsplash.it/300"></scary-image>
        </scary-gallery>

    <template is="dom-if" if="[[active]]">

      <lrnapp-studio-displayboard id="[[routeData.projectId]]"></lrnapp-studio-displayboard>

    </template>
`,

  is: "lrnapp-studio-projectboard",

  properties: {
    prop1: {
      type: String,
      value: "lrnapp-studio-app"
    },
    route: {
      type: Object
    }
  },

  ready: function() {
    this.$$(".projectboard-item").addEventListener("click", function(e) {
      // you find the id of the project board item here
      window.location.href = "/projectboard/1";
    });
  }
});
