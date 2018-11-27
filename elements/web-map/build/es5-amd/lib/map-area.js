define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./map-styles.js"
], function(_polymerLegacy, _polymerDom, _mapStyles) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="map-area">\n<style include="map-styles">\n :host {\n   display: none;\n }\n</style>\n\n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "map-area",
    extends: "area",
    properties: {
      alt: { type: String, reflectToAttribute: !0 },
      coords: { type: String, reflectToAttribute: !0 },
      href: { type: String, reflectToAttribute: !0 },
      shape: { type: String, value: "default", reflectToAttribute: !0 },
      rel: { type: String, reflectToAttribute: !0 },
      type: { type: String, reflectToAttribute: !0 },
      target: { type: String, reflectToAttribute: !0 }
    },
    attached: function attached() {
      if (this.parentElement._map) {
        this._attachedToMap();
      }
    },
    _attachedToMap: function _attachedToMap() {
      this._map = this.parentElement._map;
      var map = this.parentElement._map;
      if (!this._feature) {
        var options = this._styleToPathOptions(window.getComputedStyle(this)),
          points = this.coords ? this._coordsToArray(this.coords) : null;
        if (points && this.parentElement.poster) {
          for (
            var worig = this.parentElement.poster.width,
              wresp = this.parentElement.width,
              wadjstmnt = (worig - wresp) / 2,
              i = 0;
            i < points.length;
            i++
          ) {
            points[i][0] = points[i][0] - wadjstmnt;
          }
        }
        if ("marker" === this.shape) {
          if (this.alt) {
            options.title = this.alt;
          }
          this._feature = L.marker(
            map.containerPointToLatLng(points[0]),
            options
          ).addTo(map);
        } else if ("circle" === this.shape) {
          var pixelRadius = parseInt(this.coords.split(",")[2]),
            pointOnCirc = L.point(points[0]).add(L.point(0, pixelRadius)),
            latLngOnCirc = map.containerPointToLatLng(pointOnCirc),
            latLngCenter = map.containerPointToLatLng(points[0]),
            radiusInMeters = map.distance(latLngCenter, latLngOnCirc);
          this._feature = L.circle(latLngCenter, radiusInMeters, options).addTo(
            map
          );
        } else if (!this.shape || "rect" === this.shape) {
          var bounds = L.latLngBounds(
            map.containerPointToLatLng(points[0]),
            map.containerPointToLatLng(points[1])
          );
          this._feature = L.rectangle(bounds, options).addTo(map);
        } else if ("line" === this.shape) {
          this._feature = L.polyline(
            this._pointsToLatLngs(points),
            options
          ).addTo(map);
        } else if ("poly" === this.shape) {
          this._feature = L.polygon(
            this._pointsToLatLngs(points),
            options
          ).addTo(map);
        } else if ("default" === this.shape) {
          this._feature = L.rectangle(map.getBounds(), options).addTo(map);
        }
        if ("marker" !== this.shape && this.alt) {
          var title = L.SVG.create("title"),
            titleText = document.createTextNode(this.alt);
          (0, _polymerDom.dom)(title).appendChild(titleText);
          (0, _polymerDom.dom)(this._feature._path).appendChild(title);
        }
        if (this.href) {
          this._feature.on(
            "click",
            function() {
              if (this.href) {
                window.open(this.href);
              }
            },
            this
          );
        }
      }
    },
    detached: function detached() {
      this._map.removeLayer(this._feature);
      delete this._feature;
    },
    _coordsToArray: function _coordsToArray(containerPoints) {
      for (
        var i = 1, points = [], coords = containerPoints.split(",");
        i < coords.length;
        i += 2
      ) {
        points.push([parseInt(coords[i - 1]), parseInt(coords[i])]);
      }
      return points;
    },
    _pointsToLatLngs: function _pointsToLatLngs(points) {
      var latLngArray = [];
      if (this._map) {
        for (var i = 0, map = this._map; i < points.length; i++) {
          latLngArray.push(map.containerPointToLatLng(points[i]));
        }
      }
      return latLngArray;
    },
    _styleToPathOptions: function _styleToPathOptions(style) {
      var options = {};
      if ("none" !== style.stroke) {
        options.stroke = !0;
        options.color = style.stroke;
        options.opacity = style.strokeOpacity;
        options.weight = parseInt(style.strokeWidth);
        options.dashArray = style.strokeDasharray;
        options.lineCap = style.strokeLinecap;
        options.lineJoin = style.strokeLinejoin;
      } else {
        options.stroke = !1;
      }
      if ("none" !== style.fill) {
        options.fill = !0;
        options.fillColor = style.fill;
        options.fillOpacity = style.fillOpacity;
        options.fillRule = style.fillRule;
      } else {
        options.fill = !1;
      }
      return options;
    }
  });
});
