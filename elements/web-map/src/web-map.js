import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "./lib/map-layer.js";
import "./lib/map-area.js";
import "./lib/map-styles.js";

/* styles scoped to inside a custom element must be in a style module */
/* web-map is an HTML &lt;map&gt; customized built-in element */
class WebMap extends PolymerElement {
  static get template() {
    return html`
      <!-- use the leaflet-styles style module -->
      <style include="map-styles">
        /* make sure the map element doesn't get selected and styled by document styles */
        :host {
          display: inline-block !important;
          position: relative !important;
        }
        /* try to constrain the map and the leaflet div#map to the size of the container */
        :host,
        :host #map {
          max-width: 100%;
          min-width: 100%;
        }
        /* this is a hack for shady DOM, as max-width messes with Leaflet tiles */
        :host img {
          max-width: none !important;
        }
        #map:focus {
          outline: 2px double lightskyblue;
        }
      </style>
      <!-- giving the map div a tabindex allows the map to display its focus. -->
      <!-- see the #map:focus selector in styles, above. -->
      <div id="map" tabindex="0"></div>
      <slot></slot>
    `;
  }

  static get tag() {
    return "web-map";
  }

  factoryImpl(width, height, lat, lon, zoom, projection, controls) {
    this.width = width;
    this.height = height;
    this.lat = lat || this.lat;
    this.lon = lon || this.lon;
    this.zoom = zoom || this.zoom;
    this.projection = projection || "OSMTILE";
    this.controls = controls || this.controls;
  }

  static get properties() {
    return {
      lat: {
        type: Number,
        value: 0,
        reflectToAttribute: true
      },
      lon: {
        type: Number,
        value: 0,
        reflectToAttribute: true
      },
      zoom: {
        type: Number,
        value: 0,
        reflectToAttribute: true
      },
      projection: {
        type: String,
        value: "OSMTILE",
        reflectToAttribute: false
      },
      width: {
        type: Number,
        value: null,
        reflectToAttribute: true
      },
      height: {
        type: Number,
        value: null,
        reflectToAttribute: true
      },
      layers: {
        type: Object,
        value() {
          return this.getElementsByTagName("layer-");
        }
      },
      areas: {
        type: Object,
        value() {
          return this.getElementsByTagName("area");
        }
      },
      controls: {
        type: Boolean,
        reflectToAttribute: true
      }
    };
  }

  static get observers() {
    return [
      "_widthChanged(width)",
      "_heightChanged(height)",
      "_toggleControls(controls)"
    ];
  }

  _toggleControls(controls) {
    if (this._map) {
      if (controls) {
        this._zoomControl = L.control.zoom().addTo(this._map);
        this._layerControl = M.mapMlLayerControl(null, {
          collapsed: true
        }).addTo(this._map);
        for (var i = 0; i < this.layers.length; i++) {
          if (!this.layers[i].hidden) {
            this._layerControl.addOverlay(
              this.layers[i]._layer,
              this.layers[i].label
            );
            this._map.on(
              "moveend",
              this.layers[i]._validateDisabled,
              this.layers[i]
            );
            this.layers[i]._layerControl = this._layerControl;
          }
        }
      } else {
        this._map.removeControl(this._layerControl);
        this._map.removeControl(this._zoomControl);
      }
    }
  }

  _widthChanged(width) {
    this.style.width = width + "px";
    this.shadowRoot.querySelector("#map").style.width = width + "px";
    if (this._map) {
      this._map.invalidateSize(false);
    }
  }

  _heightChanged(height) {
    this.style.height = height + "px";
    this.shadowRoot.querySelector("#map").style.height = height + "px";
    if (this._map) {
      this._map.invalidateSize(false);
    }
  }

  zoomTo(lat, lon, zoom) {
    zoom = zoom || this.zoom;
    var location = new L.LatLng(lat, lon);
    this._map.setView(location, zoom);
    this.zoom = zoom;
    this.lat = location.lat;
    this.lon = location.lng;
  }

  _updateMapCenter() {
    // remember to tell Leaflet event handler that 'this' in here refers to
    //  something other than the map in this case the custom polymer element
    this.lat = this._map.getCenter().lat;
    this.lon = this._map.getCenter().lng;
    this.zoom = this._map.getZoom();
  }
  ready() {
    super.ready();
    // when used in a custom element, the leaflet script element is hidden inside
    // the import's shadow dom.
    L.Icon.Default.imagePath = (function() {
      var imp = document.querySelector(
          'link[rel="import"][href*="web-map.html"]'
        ),
        doc = imp ? imp.import : document,
        scripts = doc.getElementsByTagName("script"),
        leafletRe = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;

      var i, len, src, path;

      for (i = 0, len = scripts.length; i < len; i++) {
        src = scripts[i].src;

        if (src.match(leafletRe)) {
          path = src.split(leafletRe)[0];
          return (path ? path + "/" : "") + "images";
        }
      }
    })();
    if (this.hasAttribute("name")) {
      var name = this.getAttribute("name");
      if (name) {
        this.poster = document.querySelector(
          "img[usemap=" + '"#' + name + '"]'
        );
        // firefox has an issue where the attribution control's use of
        // _container.innerHTML does not work properly if the engine is throwing
        // exceptions because there are no area element children of the image map
        // for firefox only, a workaround is to actually remove the image...
        if (this.poster) {
          if (L.Browser.gecko) {
            this.poster.removeAttribute("usemap");
          }
          this.shadowRoot.querySelector("#map").appendChild(this.poster);
        }
      }
    }
  }
  disconnectedCallback() {
    this._removeEvents();
    super.disconnectedCallback();
  }
  connectedCallback() {
    super.connectedCallback();
    async.microTask.run(() => {
      // the dimension attributes win, if they're there. A map does not
      // have an intrinsic size, unlike an image or video, and so must
      // have a defined width and height.
      var s = window.getComputedStyle(this),
        wpx = s.width,
        hpx = s.height,
        w = parseInt(wpx.replace("px", "")),
        h = parseInt(hpx.replace("px", ""));

      if (wpx === "" || hpx === "") {
        return;
      }

      if (!this.width || this.width !== w) {
        this.shadowRoot.querySelector("#map").style.width = wpx;
        this.width = w;
      } else {
        this.shadowRoot.querySelector("#map").style.width = this.width + "px";
      }

      if (!this.height || this.height !== h) {
        this.shadowRoot.querySelector("#map").style.height = h;
        this.height = h;
      } else {
        this.shadowRoot.querySelector("#map").style.height = this.height + "px";
      }

      // create the Leaflet map if this is the first time attached is called
      if (!this._map) {
        this._map = L.map(this.shadowRoot.querySelector("#map"), {
          center: new L.LatLng(this.lat, this.lon),
          projection: this.projection,
          crs: M[this.projection],
          zoom: this.zoom,
          zoomControl: false,
          // because the M.MapMLLayer invokes _tileLayer._onMoveEnd when
          // the mapml response is received the screen tends to flash.  I'm sure
          // there is a better configuration than that, but at this moment
          // I'm not sure how to approach that issue.
          // See https://github.com/Maps4HTML/MapML-Leaflet-Client/issues/24
          fadeAnimation: true
        });

        // optionally add controls to the map
        if (this.controls) {
          this._layerControl = M.mapMlLayerControl(null, {
            collapsed: true
          }).addTo(this._map);
          this._zoomControl = L.control.zoom().addTo(this._map);
        }
        // the attribution control is not optional
        this._attributionControl = this._map.attributionControl.setPrefix(
          '<a href="https://www.w3.org/community/maps4html/" title="W3C Maps4HTML Community Group">Maps4HTML</a> | <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
        );

        // make sure the layer knows about the map it belongs to.
        for (var i = 0; i < this.layers.length; i++) {
          this.layers[i]._attachedToMap();
        }

        // the area elements need the map to convert their coordinates to LatLng
        for (var i = 0; i < this.areas.length; i++) {
          this.areas[i]._attachedToMap();
        }
        // undisplay the image if *the first* layer works.  This is not perfect, as it
        // relies on the server to have responded by now.
        if (
          this.layers[0] &&
          typeof this.layers[0]._layer.error === "undefined" &&
          this.layers[0]._layer._extent
        ) {
          if (this.poster) {
            this.poster.style.display = "none";
          }
        }
        this._setUpEvents();
        this.dispatchEvent(
          new CustomEvent("load", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { target: this }
          })
        );
      }
    }, 10);
  }
  _removeEvents() {
    if (this._map) {
      this._map.off(
        "preclick click dblclick mousemove mouseover mouseout mousedown mouseup contextmenu",
        false,
        this
      );
      this._map.off(
        "load movestart move moveend zoomstart zoom zoomend",
        false,
        this
      );
    }
  }
  _setUpEvents() {
    this._map.on(
      "load",
      function() {
        this.dispatchEvent(
          new CustomEvent("load", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { target: this }
          })
        );
      },
      this
    );
    this._map.on(
      "preclick",
      function(e) {
        this.dispatchEvent(
          new CustomEvent("preclick", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              x: e.containerPoint.x,
              y: e.containerPoint.y
            }
          })
        );
      },
      this
    );
    this._map.on(
      "click",
      function(e) {
        this.dispatchEvent(
          new CustomEvent("click", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              x: e.containerPoint.x,
              y: e.containerPoint.y
            }
          })
        );
      },
      this
    );
    this._map.on(
      "dblclick",
      function(e) {
        this.dispatchEvent(
          new CustomEvent("dblclick", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              x: e.containerPoint.x,
              y: e.containerPoint.y
            }
          })
        );
      },
      this
    );
    this._map.on(
      "mousemove",
      function(e) {
        this.dispatchEvent(
          new CustomEvent("mousemove", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              x: e.containerPoint.x,
              y: e.containerPoint.y
            }
          })
        );
      },
      this
    );
    this._map.on(
      "mouseover",
      function(e) {
        this.dispatchEvent(
          new CustomEvent("mouseover", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              x: e.containerPoint.x,
              y: e.containerPoint.y
            }
          })
        );
      },
      this
    );
    this._map.on(
      "mouseout",
      function(e) {
        this.dispatchEvent(
          new CustomEvent("mouseout", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              x: e.containerPoint.x,
              y: e.containerPoint.y
            }
          })
        );
      },
      this
    );
    this._map.on(
      "mousedown",
      function(e) {
        this.dispatchEvent(
          new CustomEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              x: e.containerPoint.x,
              y: e.containerPoint.y
            }
          })
        );
      },
      this
    );
    this._map.on(
      "mouseup",
      function(e) {
        this.dispatchEvent(
          new CustomEvent("mouseup", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              x: e.containerPoint.x,
              y: e.containerPoint.y
            }
          })
        );
      },
      this
    );
    this._map.on(
      "contextmenu",
      function(e) {
        this.dispatchEvent(
          new CustomEvent("contextmenu", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
              x: e.containerPoint.x,
              y: e.containerPoint.y
            }
          })
        );
      },
      this
    );
    this._map.on(
      "movestart",
      function() {
        this._updateMapCenter();
        this.dispatchEvent(
          new CustomEvent("movestart", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { target: this }
          })
        );
      },
      this
    );
    this._map.on(
      "move",
      function() {
        this._updateMapCenter();
        this.dispatchEvent(
          new CustomEvent("move", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { target: this }
          })
        );
      },
      this
    );
    this._map.on(
      "moveend",
      function() {
        this._updateMapCenter();
        this.dispatchEvent(
          new CustomEvent("moveend", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { target: this }
          })
        );
      },
      this
    );
    this._map.on(
      "zoomstart",
      function() {
        this._updateMapCenter();
        this.dispatchEvent(
          new CustomEvent("zoomstart", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { target: this }
          })
        );
      },
      this
    );
    this._map.on(
      "zoom",
      function() {
        this._updateMapCenter();
        this.dispatchEvent(
          new CustomEvent("zoom", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { target: this }
          })
        );
      },
      this
    );
    this._map.on(
      "zoomend",
      function() {
        this._updateMapCenter();
        this.dispatchEvent(
          new CustomEvent("zoomend", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { target: this }
          })
        );
      },
      this
    );
  }
}
window.customElements.define(WebMap.tag, WebMap);
export { WebMap };
