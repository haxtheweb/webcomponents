define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./map-styles.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_0f345f90e11a11e898b57f5745d22d59() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="map-styles">\n     :host {\n       display: none;\n     }\n    </style>\n    <!-- hide any feature, image or tile elements the author includes -->\n    <slot></slot>\n'
    ]);
    _templateObject_0f345f90e11a11e898b57f5745d22d59 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_0f345f90e11a11e898b57f5745d22d59()
    ),
    is: "layer-",
    properties: {
      src: { type: String, reflectToAttribute: !0, observer: "_srcChanged" },
      label: {
        type: String,
        value: "Layer",
        reflectToAttribute: !0,
        observer: "_labelChanged"
      },
      checked: {
        type: Boolean,
        reflectToAttribute: !0,
        observer: "_toggleChecked"
      },
      disabled: { type: Boolean, reflectToAttribute: !0 },
      hidden: {
        type: Boolean,
        reflectToAttribute: !0,
        observer: "_toggleHidden"
      },
      legendLinks: {
        type: Object,
        reflectToAttribute: !1,
        value: function value() {
          return [];
        }
      }
    },
    _srcChanged: function _srcChanged() {
      if (this._layer) {
        this._layer.initialize(this.src, this);
      }
    },
    _labelChanged: function _labelChanged() {
      var map = this.parentElement && this.parentElement._map;
      if (map) {
        this._toggleHidden(!1);
      }
    },
    _apiToggleChecked: !0,
    _toggleChecked: function _toggleChecked() {
      var map = this.parentElement && this.parentElement._map;
      if (map) {
        if (this._apiToggleChecked) {
          if (map.hasLayer(this._layer)) {
            map.removeLayer(this._layer);
          } else {
            map.addLayer(this._layer);
          }
          this._validateDisabled();
        }
        this._apiToggleChecked = !0;
      }
    },
    _onLayerExtentLoad: function _onLayerExtentLoad() {
      if (this._layer._legendUrl) {
        this.legendLinks = [
          {
            type: "application/octet-stream",
            href: this._layer._legendUrl,
            rel: "legend",
            lang: null,
            hreflang: null,
            sizes: null
          }
        ];
      }
      if (this._layer._title && "Layer" === this.label) {
        this.label = this._layer._title;
      }
      if (this._layer._map) {
        this._layer.fire("attached", this._layer);
      }
    },
    _validateDisabled: function _validateDisabled() {
      var layer = this._layer,
        map = layer._map;
      if (map) {
        var zoomBounds = layer.getZoomBounds(),
          zoom = map.getZoom(),
          withinZoomBounds =
            zoomBounds && zoomBounds.min <= zoom && zoom <= zoomBounds.max,
          projectionMatches = layer._projectionMatches(map),
          visible =
            projectionMatches &&
            withinZoomBounds &&
            map.getPixelBounds().intersects(layer.getLayerExtentBounds(map));
        this.disabled = !visible;
      }
    },
    _onLayerChange: function _onLayerChange() {
      if (this._layer._map) {
        this._apiToggleChecked = !1;
        this.checked = this._layer._map.hasLayer(this._layer);
      }
    },
    _toggleHidden: function _toggleHidden(hide) {
      var map = this.parentElement && this.parentElement._map;
      if (map && this.parentElement.controls) {
        if (hide) {
          this.parentElement._layerControl.removeLayer(this._layer);
        } else {
          this._layerControl = this.parentElement._layerControl;
          this._layerControl.addOrUpdateOverlay(this._layer, this.label);
        }
        this._validateDisabled();
      }
    },
    detached: function detached() {
      if (this._layer._map) {
        this._layer._map.removeLayer(this._layer);
      }
      if (this._layerControl && !this.hidden) {
        this._layerControl.removeLayer(this._layer);
      }
      this._removeEvents();
    },
    ready: function ready() {
      var base = this.baseURI ? this.baseURI : document.baseURI;
      this._layer = M.mapMLLayer(
        this.src ? new URI(this.src).resolve(new URI(base)).toString() : null,
        this
      );
      this._layer.on("extentload", this._onLayerExtentLoad, this);
      this._setUpEvents();
    },
    _attachedToMap: function _attachedToMap() {
      for (
        var i = 0,
          position = 1,
          nodes = (0, _polymerDom.dom)(this).parentNode.children;
        i < nodes.length;
        i++
      ) {
        if (
          "LAYER-" ===
          (0, _polymerDom.dom)(this).parentNode.children[i].nodeName
        ) {
          if ((0, _polymerDom.dom)(this).parentNode.children[i] === this) {
            break;
          }
          position++;
        }
      }
      L.setOptions(this._layer, {
        zIndex: position,
        opacity: window.getComputedStyle(this).opacity
      });
      this._layer._map = (0, _polymerDom.dom)(this).parentNode._map;
      this._layer.fire("attached");
      if (this.checked) {
        this._layer.addTo(this._layer._map);
      }
      this._layer.on("add remove", this._onLayerChange, this);
      if ((0, _polymerDom.dom)(this).parentNode.controls && !this.hidden) {
        this._layerControl = (0, _polymerDom.dom)(
          this
        ).parentNode._layerControl;
        this._layerControl.addOrUpdateOverlay(this._layer, this.label);
      }
      this._layer._map.on("moveend", this._validateDisabled, this);
      this._layer._map.fire("moveend");
    },
    attached: function attached() {
      if ("MAP" !== (0, _polymerDom.dom)(this).parentNode.nodeName) {
        console.log(
          "ERROR: " +
            this.localName +
            "#" +
            this.id +
            " must be a child of a map element"
        );
        return;
      }
      if ((0, _polymerDom.dom)(this).parentNode._map) {
        this._attachedToMap();
      }
    },
    _removeEvents: function _removeEvents() {
      if (this._layer) {
        this._layer.off("loadstart", !1, this);
      }
    },
    _setUpEvents: function _setUpEvents() {
      this._layer.on(
        "loadstart",
        function() {
          this.fire("loadstart", { target: this });
        },
        this
      );
    }
  });
});
