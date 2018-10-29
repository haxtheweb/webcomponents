import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/iron-ajax/iron-ajax.js";
import "./node_modules/@polymer/iron-list/iron-list.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@polymer/paper-card/paper-card.js";
import "./node_modules/@polymer/iron-image/iron-image.js";
import "./node_modules/@polymer/iron-icon/iron-icon.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/iron-icons/av-icons.js";
import "./node_modules/@polymer/app-layout/app-drawer/app-drawer.js";
import "./node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "./node_modules/@polymer/app-layout/app-header/app-header.js";
import "./node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js";
import "./node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "./node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "./node_modules/@polymer/app-route/app-location.js";
import "./node_modules/@polymer/app-route/app-route.js";
import "./node_modules/@polymer/iron-pages/iron-pages.js";
import "./node_modules/@polymer/iron-selector/iron-selector.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
Polymer({
  _template: html`
    <style include="materializecss-styles">
      :host {
        --app-primary-color: #4285f4;
        --app-secondary-color: black;

        display: block;
      }

      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }

      app-header {
        color: #fff;
        background-color: var(--app-primary-color);
      }

      app-header paper-icon-button {
        --paper-icon-button-ink-color: white;
      }

      .drawer-list {
        margin: 0 20px;
      }

      .drawer-list a {
        display: block;
        padding: 0 16px;
        text-decoration: none;
        color: var(--app-secondary-color);
        line-height: 40px;
      }

      .drawer-list a.iron-selected {
        color: black;
        font-weight: bold;
      }
    </style>

    <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
    </app-location>

    <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
    </app-route>

    <app-drawer-layout fullbleed="" narrow="{{narrow}}">
      <!-- Drawer content -->
      <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
        <app-toolbar>Menu</app-toolbar>
        <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
          <a name="view1" href="[[rootPath]]">Home</a>
          <a name="view2" href="[[rootPath]]recipes">Recipes</a>
          <a name="view3" href="https://github.com/LRNWebComponents/contenta-polymer">Github</a>
          <a name="view4" href="https://www.contentacms.org/">ContentaCMS website</a>
        </iron-selector>
      </app-drawer>

      <!-- Main content -->
      <app-header-layout has-scrolling-region="">

        <app-header slot="header" condenses="" reveals="" effects="waterfall">
          <app-toolbar>
            <paper-icon-button icon="menu" drawer-toggle=""></paper-icon-button>
            <div main-title="">Mmmm Cooking</div>
          </app-toolbar>
        </app-header>

        <iron-pages selected="[[page]]" attr-for-selected="name" fallback-selection="view404" role="main">
          <my-view1 name="view1"></my-view1>
          <my-view2 name="view2"></my-view2>
          <my-view404 name="view404"></my-view404>
        </iron-pages>
      </app-header-layout>
    </app-drawer-layout>
`,
  is: "contenta-polymer",
  properties: {},
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
