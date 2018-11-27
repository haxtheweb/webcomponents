define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/iron-ajax/iron-ajax.js",
  "./node_modules/@polymer/iron-list/iron-list.js",
  "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@polymer/paper-card/paper-card.js",
  "./node_modules/@polymer/iron-image/iron-image.js",
  "./node_modules/@polymer/iron-icon/iron-icon.js",
  "./node_modules/@polymer/iron-icons/iron-icons.js",
  "./node_modules/@polymer/iron-icons/av-icons.js",
  "./node_modules/@polymer/app-layout/app-drawer/app-drawer.js",
  "./node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js",
  "./node_modules/@polymer/app-layout/app-header/app-header.js",
  "./node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js",
  "./node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js",
  "./node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "./node_modules/@polymer/app-route/app-location.js",
  "./node_modules/@polymer/app-route/app-route.js",
  "./node_modules/@polymer/iron-pages/iron-pages.js",
  "./node_modules/@polymer/iron-selector/iron-selector.js",
  "./node_modules/@polymer/paper-icon-button/paper-icon-button.js"
], function(
  _polymerLegacy,
  _ironAjax,
  _ironList,
  _materializecssStyles,
  _paperButton,
  _paperCard,
  _ironImage,
  _ironIcon,
  _ironIcons,
  _avIcons,
  _appDrawer,
  _appDrawerLayout,
  _appHeader,
  _appHeaderLayout,
  _appScrollEffects,
  _appToolbar,
  _appLocation,
  _appRoute,
  _ironPages,
  _ironSelector,
  _paperIconButton
) {
  "use strict";
  function _templateObject_14c48b70f1e511e8a2224342059b0d1c() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles">\n      :host {\n        --app-primary-color: #4285f4;\n        --app-secondary-color: black;\n\n        display: block;\n      }\n\n      app-drawer-layout:not([narrow]) [drawer-toggle] {\n        display: none;\n      }\n\n      app-header {\n        color: #fff;\n        background-color: var(--app-primary-color);\n      }\n\n      app-header paper-icon-button {\n        --paper-icon-button-ink-color: white;\n      }\n\n      .drawer-list {\n        margin: 0 20px;\n      }\n\n      .drawer-list a {\n        display: block;\n        padding: 0 16px;\n        text-decoration: none;\n        color: var(--app-secondary-color);\n        line-height: 40px;\n      }\n\n      .drawer-list a.iron-selected {\n        color: black;\n        font-weight: bold;\n      }\n    </style>\n\n    <app-location route="{{route}}" url-space-regex="^[[rootPath]]">\n    </app-location>\n\n    <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">\n    </app-route>\n\n    <app-drawer-layout fullbleed="" narrow="{{narrow}}">\n      <!-- Drawer content -->\n      <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">\n        <app-toolbar>Menu</app-toolbar>\n        <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">\n          <a name="view1" href="[[rootPath]]">Home</a>\n          <a name="view2" href="[[rootPath]]recipes">Recipes</a>\n          <a name="view3" href="https://github.com/LRNWebComponents/contenta-polymer">Github</a>\n          <a name="view4" href="https://www.contentacms.org/">ContentaCMS website</a>\n        </iron-selector>\n      </app-drawer>\n\n      <!-- Main content -->\n      <app-header-layout has-scrolling-region="">\n\n        <app-header slot="header" condenses="" reveals="" effects="waterfall">\n          <app-toolbar>\n            <paper-icon-button icon="menu" drawer-toggle=""></paper-icon-button>\n            <div main-title="">Mmmm Cooking</div>\n          </app-toolbar>\n        </app-header>\n\n        <iron-pages selected="[[page]]" attr-for-selected="name" fallback-selection="view404" role="main">\n          <my-view1 name="view1"></my-view1>\n          <my-view2 name="view2"></my-view2>\n          <my-view404 name="view404"></my-view404>\n        </iron-pages>\n      </app-header-layout>\n    </app-drawer-layout>\n'
    ]);
    _templateObject_14c48b70f1e511e8a2224342059b0d1c = function _templateObject_14c48b70f1e511e8a2224342059b0d1c() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_14c48b70f1e511e8a2224342059b0d1c()
    ),
    is: "contenta-polymer",
    properties: {},
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
