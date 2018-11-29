/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-header-layout/app-header-layout.js";
import "@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-selector/iron-selector.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
/**
`contenta-polymer`
A polymer app to talk to Contenta to serve up it's content in a visually awesome way

@demo ../../demo/index.html

@microcopy - the mental model for this app
 - contenta - the future of Drupal and web development, a decoupled CMS.
 -

*/
let ContentaPolymer = Polymer({
  _template: html`
  <custom-style>
    <style is="custom-style" include="materializecss-styles">
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
  </custom-style>
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

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
export { ContentaPolymer };
