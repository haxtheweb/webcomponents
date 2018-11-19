<?php
  include_once '../../../system/lib/bootstrapHAX.php';
  include_once $HAXCMS->configDirectory . '/config.php';
  $appSettings = $HAXCMS->appJWTConnectionSettings();
?>
<link rel="import" href="../polymer/polymer.html">
<link rel="import" href="../jwt-login/jwt-login.html">
<!--
`haxcms-jwt`
a simple element to check for and fetch JWTs

@demo demo/index.html

@microcopy - the mental model for this element
- jwt - a json web token which is an encrypted security token to talk

-->

<dom-module id="haxcms-jwt">
  <template>
    <style>
      :host {
        display: block;
      }
    </style>
    <jwt-login id="jwt" url="[[jwtLoginLocation]]" url-logout="[[jwtLogoutLocation]]" jwt="{{jwt}}"></jwt-login>
  </template>
  <script>
    window.appSettings = <?php print json_encode($appSettings); ?>;
    Polymer({
      is: 'haxcms-jwt',
      properties: {
        /**
         * Location of what endpoint to hit for
         */
        jwtLoginLocation: {
          type: String,
          value: window.appSettings.login,
        },
        /**
         * Location of what endpoint to hit for logging out
         */
        jwtLogoutLocation: {
          type: String,
          value: window.appSettings.logout,
        },
        /**
         * JSON Web token, it'll come from a global call if it's available
         */
        jwt: {
          type: String,
        },
      },
      /**
       * Attached life cycle
       */
      created: function () {
        document.body.addEventListener('jwt-token', this._jwtTokenFired.bind(this));
        document.body.addEventListener('json-outline-schema-active-item-changed', this.initialItem.bind(this));      
        document.body.addEventListener('json-outline-schema-changed', this.initialManifest.bind(this));      
        document.body.addEventListener('json-outline-schema-active-body-changed', this.initialBody.bind(this));
      },
      initialItem: function (e) {
        this.__item = e.detail;
      },
      initialManifest: function (e) {
        this.__manifest = e.detail;
      },
      initialBody: function (e) {
        this.__body = e.detail;
      },
      /**
       * JWT token fired, let's capture it
       */
      _jwtTokenFired: function (e) {
        this.jwt = e.detail;
      },
      /**
       * Attached life cycle
       */
      attached: function () {
        if (this.jwt != null) {
          // attempt to dynamically import the hax cms site editor
          // which will appear to be injecting into the page
          // but because of this approach it should be non-blocking
          try {
            this.importHref(this.resolveUrl('haxcms-site-editor.html'), (e) => {
              let haxCmsSiteEditorElement = document.createElement('haxcms-site-editor');
              haxCmsSiteEditorElement.jwt = this.jwt;
              haxCmsSiteEditorElement.savePagePath = window.appSettings.savePagePath;
              haxCmsSiteEditorElement.saveManifestPath = window.appSettings.saveManifestPath;
              haxCmsSiteEditorElement.saveOutlinePath = window.appSettings.saveOutlinePath;
              haxCmsSiteEditorElement.publishPath = window.appSettings.publishPath;
              haxCmsSiteEditorElement.appStore = window.appSettings.appStore;
              // pass along the initial state management stuff that may be missed
              // based on timing on the initial setup
              if (typeof this.__item !== typeof undefined) {
                haxCmsSiteEditorElement.activeItem = this.__item;
              }
              if (typeof this.__manifest !== typeof undefined) {
                console.log('well it was here');
                haxCmsSiteEditorElement.manifest = this.__manifest;
              }
              if (typeof this.__body !== typeof undefined) {
                haxCmsSiteEditorElement.__body = this.__body;
              }
              Polymer.cmsSiteEditor.instance.haxCmsSiteEditorElement = haxCmsSiteEditorElement;
              Polymer.cmsSiteEditor.instance.appendTarget.appendChild(haxCmsSiteEditorElement);
            }, (e) => {
              //import failed
            });
          }
          catch (err) {
            // error in the event this is a double registration
          }
        }
      },
    });
  </script>
</dom-module>