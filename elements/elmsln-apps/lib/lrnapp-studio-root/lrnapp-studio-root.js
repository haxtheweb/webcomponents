<link rel="import" href="../../bower_components/polymer/polymer.html">
<link rel="import" href="../../bower_components/app-route/app-location.html">
<link rel="import" href="../../bower_components/app-route/app-route.html">
<link rel="import" href="../../bower_components/iron-icon/iron-icon.html">
<link rel="import" href="../../bower_components/lrnsys-button/lrnsys-button.html">
<link rel="import" href="../../bower_components/iron-list/iron-list.html">
<link rel="import" href="../../bower_components/elmsln-loading/elmsln-loading.html">
<link rel="import" href="../../bower_components/iron-ajax/iron-ajax.html">
<link rel="import" href="../../bower_components/paper-card/paper-card.html">
<link rel="import" href="../../bower_components/iron-selector/iron-selector.html">
<link rel="import" href="../../bower_components/iron-pages/iron-pages.html">
<link rel="import" href="../../../lrnapp-studio-dashboard/src/lrnapp-studio-dashboard/lrnapp-studio-dashboard.html">
<link rel="import" href="../../../lrnapp-studio-kanban/src/lrnapp-studio-kanban/lrnapp-studio-kanban.html">
<link rel="import" href="../../../lrnapp-open-studio/src/lrnapp-open-studio/lrnapp-open-studio.html">

<dom-module id="lrnapp-studio-root">
  <template>
    <style>
      :host {
        display: block;
      }
    </style>

    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>
    <app-route
        route="{{route}}"
        pattern="[[basePath]]/:page"
        data="{{data}}"
        tail="{{tail}}"
        query-params="{{queryParams}}">
    </app-route>

    <iron-selector selected="{{data.page}}" attr-for-selected="name" role="navigation">
      <a tabindex="-1" name="lrnapp-studio-dashboard" on-tap="_dashboardClicked">A</a>
      <a tabindex="-1" name="lrnapp-studio-kanban" on-tap="_kanbanClicked">B</a>
      <a tabindex="-1" name="lrnapp-open-studio" on-tap="_openstudioClicked">C</a>
    </iron-selector>

    <iron-pages
      selected="{{data.page}}"
      attr-for-selected="name"
      fallback-selection="lrnapp-studio-dashboard"
      role="main">
      <lrnapp-studio-dashboard name="lrnapp-studio-dashboard" csrf-token="[[csrfToken]]" end-point="[[_endPoint('lrnapp-studio-dashboard')]]" base-path="[[basePath]]" elmsln-course="[[elmslnCourse]]" elmsln-section="[[elmslnSection]]" route="[[tail]]">
      </lrnapp-studio-dashboard>
      <lrnapp-studio-kanban name="lrnapp-studio-kanban" csrf-token="[[csrfToken]]" end-point="[[_endPoint('lrnapp-studio-dashboard')]]" base-path="[[basePath]]" source-path="[[_sourcePath('lrnapp-studio-kanban/kanban-data')]]" elmsln-course="[[elmslnCourse]]" elmsln-section="[[elmslnSection]]" route="[[tail]]"></lrnapp-studio-kanban>
      <lrnapp-open-studio name="lrnapp-open-studio" csrf-token="[[csrfToken]]" end-point="[[_endPoint('lrnapp-open-studio')]]" base-path="[[basePath]]" source-path="[[_sourcePath('lrnapp-open-studio/data')]]" elmsln-course="[[elmslnCourse]]" elmsln-section="[[elmslnSection]]" route="[[tail]]">
      </lrnapp-open-studio>
    </iron-pages>
  </template>

  <script>
    Polymer({
      is: 'lrnapp-studio-root',
      properties: {
        /**
         * sourcePath for submission data.
         */
        sourcePath: {
          type: String,
          notify: true,
          reflectToAttribute: true,
        },
        elmslnSection: {
          type: String,
          notify: true,
          reflectToAttribute: true,
        },
        elmslnCourse: {
          type: String,
          notify: true,
          reflectToAttribute: true,
        },
        csrfToken: {
          type: String,
          notify: true,
          reflectToAttribute: true,
        },
        /**
         * base path for the app
         */
        basePath: {
          type: String,
          notify: true,
        },
        _endPoint: function (path) {
          return this.basePath + path;
        },
        _sourcePath: function (path) {
          return this.basePath + path + '?token=' + this.csrfToken;
        },
        listeners: {
          'route-change': '_routeChange',
        },
        observers: [
          '_routeChanged(route, basePath)',
          '_deleteToast(queryParams.deletetoast)'
        ],
        // If the current route is outside the scope of our app
        // then allow the website to break out of the single page
        // application routing
        _routeChanged: function(route, basePath) {
          if (typeof route.path === 'string') {
            if (typeof basePath === 'string') {
              if (route.path.startsWith(basePath)) {
                return;
              }
            }
            // reload the page which since route changed will load that page
            window.location.reload();
          }
        },
        /**
         * Change route from deeper in the app.
         */
        _routeChange: function(e) {
          var details = e.detail;
          if (typeof details.queryParams.assignment !== typeof undefined) {
            this.set('queryParams.assignment', details.queryParams.assignment);
          }
          if (typeof details.queryParams.project !== typeof undefined) {
            this.set('queryParams.project', details.queryParams.project);
          }
          if (typeof details.queryParams.author !== typeof undefined) {
            this.set('queryParams.author', details.queryParams.author);
          }
          if (typeof details.data.page !== typeof undefined) {
            this.set('data.page', details.data.page);
          }
        },
        /**
         * Support having a toast message because of delete or error elsewhere.
         */
        _deleteToast: function (deletetoast, old) {
          if (typeof deletetoast !== typeof undefined) {
            if (deletetoast == 'error') {
              this.$.toast.show('That submission on longer exists!');
            }
            else {
              this.$.toast.show('Submission deleted successfully!');
            }
            this.set('queryParams.deletetoast', undefined);
          }
        },
        _dashboardClicked: function (e) {
          this.set('route.path', this.basePath + '/lrnapp-studio-dashboard');
        },
        _kanbanClicked: function (e) {
          this.set('route.path', this.basePath + '/lrnapp-studio-kanban');
        },
        _openstudioClicked: function (e) {
          this.set('route.path', this.basePath + '/lrnapp-open-studio');
        },
        /**
         * Simple way to convert from object to array.
         */
        _toArray: function(obj) {
          return Object.keys(obj).map(function(key) {
            return obj[key];
          });
        }
      },
    });
  </script>
</dom-module>