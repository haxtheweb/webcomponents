import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "./map-styles.js";
/* styles scoped to inside a custom element must be in a style module */
class MapLayer extends PolymerElement {
  static get template() {
    return html`
      <style include="map-styles">
        :host {
          display: none;
        }
      </style>
      <!-- hide any feature, image or tile elements the author includes -->
      <slot></slot>
    `;
  }

  static get tag() {
    return "map-layer";
  }

  static get properties() {
    return {
      _apiToggleChecked: true,
      src: {
        type: String,
        reflectToAttribute: true,
        observer: "_srcChanged"
      },
      label: {
        type: String,
        value: "Layer",
        reflectToAttribute: true,
        observer: "_labelChanged"
      },
      // changing checked turns the layer on or off, and reflects that in the
      // user interface/ layer control.
      checked: {
        type: Boolean,
        reflectToAttribute: true,
        observer: "_toggleChecked"
      },
      // changing disabled does nothing; it is supposed to be read-only to the api,
      // and indicates if the layer is visible, i.e. if turned on it would be in
      // the map extent / zoom bounds of the map and will be updated on zoom/pan
      // by the map.  If a layer is disabled, it is 'greyed out' in the layer control
      // and can't be clicked on, although it can still be checked/unchecked via the api.
      disabled: {
        type: Boolean,
        reflectToAttribute: true
      },
      // hidden allows a layer to be added to the map but not displayed in the
      // layer control.  Changing hidden removes/adds it to the layer control,
      // but does not change the status of the layer on the map. It is 'hidden'
      // from the user interface.
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        observer: "_toggleHidden"
      },
      legendLinks: {
        type: Object,
        reflectToAttribute: false,
        // default value if property (this.legendLinks) not otherwise set
        value() {
          return [];
        }
      }
    };
  }

  _srcChanged() {
    // this should only be invoked after the ready callback
    if (this._layer) {
      this._layer.initialize(this.src, this);
    }
  }

  _labelChanged() {
    var map = this.parentElement && this.parentElement._map;
    if (map) {
      this._toggleHidden(false);
    }
  }
  _toggleChecked() {
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
      this._apiToggleChecked = true;
    }
  }

  _onLayerExtentLoad(e) {
    // the mapml document associated to this layer can in theory contain many
    // link[@rel=legend] elements with different @type or other attributes;
    // currently only support a single link, don't care about type, lang etc.
    // TODO: add support for full LayerLegend object, and > one link.
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
    if (this._layer._title && this.label === "Layer") {
      this.label = this._layer._title;
    }
    // make sure local content layer has the chance to set its extent properly
    // which is important for the layer control and the disabled property
    if (this._layer._map) {
      this._layer.dispatchEvent(
        new CustomEvent("attached", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true
        })
      );
    }
  }

  _validateDisabled() {
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
  }

  _onLayerChange() {
    if (this._layer._map) {
      // can't disable observers, have to set a flag telling it where
      // the 'event' comes from: either the api or a user click/tap
      this._apiToggleChecked = false;
      this.checked = this._layer._map.hasLayer(this._layer);
    }
  }

  _toggleHidden(hide) {
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
  }

  disconnectedCallback() {
    // if the map-layer node is removed from the dom, the layer should be
    // removed from the map and the layer control

    if (this._layer._map) {
      this._layer._map.removeLayer(this._layer);
    }

    if (this._layerControl && !this.hidden) {
      this._layerControl.removeLayer(this._layer);
    }
    this._removeEvents();
    super.disconnectedCallback();
  }

  ready() {
    super.ready();

    // the layer might not be attached to a map
    // so we need a way for non-src based layers to establish what their
    // zoom range, extent and projection are.  meta elements in content to
    // allow the author to provide this explicitly are one way, they will
    // be parsed from the second parameter here
    // IE 11 did not have a value for this.baseURI for some reason
    var base = this.baseURI ? this.baseURI : document.baseURI;
    this._layer = M.mapMLLayer(
      this.src ? new URI(this.src).resolve(new URI(base)).toString() : null,
      this
    );
    this._layer.on("extentload", this._onLayerExtentLoad, this);
    this._setUpEvents();
  }

  _attachedToMap() {
    // set i to the position of this layer element in the set of layers
    var i = 0,
      position = 1;
    for (var nodes = dom(this).parentNode.children; i < nodes.length; i++) {
      if (dom(this).parentNode.children[i].nodeName === "LAYER-") {
        if (dom(this).parentNode.children[i] === this) {
          break;
        }
        position++;
      }
    }
    L.setOptions(this._layer, {
      zIndex: position,
      opacity: window.getComputedStyle(this).opacity
    });
    // make sure the Leaflet layer has a reference to the map
    this._layer._map = dom(this).parentNode._map;
    // notify the layer that it is attached to a map (layer._map)
    this._layer.dispatchEvent(
      new CustomEvent("attached", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true
      })
    );

    if (this.checked) {
      this._layer.addTo(this._layer._map);
    }
    // add the handler which toggles the 'checked' property based on the
    // user checking/unchecking the layer from the layer control
    // this must be done *after* the layer is actually added to the map
    this._layer.on("add remove", this._onLayerChange, this);

    // if controls option is enabled, insert the layer into the overlays array
    if (dom(this).parentNode.controls && !this.hidden) {
      this._layerControl = dom(this).parentNode._layerControl;
      this._layerControl.addOrUpdateOverlay(this._layer, this.label);
    }
    // toggle the this.disabled attribute depending on whether the layer
    // is: same prj as map, within view/zoom of map
    this._layer._map.on("moveend", this._validateDisabled, this);
    // this is necessary to get the layer control to compare the layer
    // extents with the map extent & zoom, but it needs to be rethought TODO
    // for one thing, layers which are checked by the author before
    // adding to the map are displayed despite that they are not visible
    // See issue #26
    this._layer._map.dispatchEvent(
      new CustomEvent("moveend", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true
      })
    );
  }

  connectedCallback() {
    super.connectedCallback();
    if (dom(this).parentNode.nodeName !== "MAP") {
      console.log(
        "ERROR: " +
          this.localName +
          "#" +
          this.id +
          " must be a child of a map element"
      );
      return;
    }
    // if the map has been attached, set this layer up wrt Leaflet map
    if (dom(this).parentNode._map) {
      this._attachedToMap();
    }
  }

  _removeEvents() {
    if (this._layer) {
      this._layer.off("loadstart", false, this);
    }
  }

  _setUpEvents() {
    this._layer.on(
      "loadstart",
      () => {
        this.dispatchEvent(
          new CustomEvent("loadstart", {
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
window.customElements.define(MapLayer.tag, MapLayer);
export { MapLayer };
