import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./map-styles.js";
/* styles scoped to inside a custom element must be in a style module */
class MapArea extends PolymerElement {
  static get template() {
    return html`
      <style include="map-styles">
        :host {
          display: none;
        }
      </style>
    `;
  }
  static get tag() {
    return "map-area";
  }
  static get properties() {
    return {
      alt: {
        type: String,
        reflectToAttribute: true
      },
      coords: {
        type: String,
        reflectToAttribute: true
      },
      href: {
        type: String,
        reflectToAttribute: true
      },
      shape: {
        type: String,
        /* to HTML5's default, circle, poly and rect, add marker, line */
        value: "default",
        reflectToAttribute: true
      },
      rel: {
        type: String,
        reflectToAttribute: true
      },
      type: {
        type: String,
        reflectToAttribute: true
      },
      target: {
        type: String,
        reflectToAttribute: true
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    // if the map has been attached, set this layer up wrt Leaflet map
    if (this.parentElement._map) {
      this._attachedToMap();
    }
  }
  _attachedToMap() {
    // need the map to convert container points to LatLngs
    this._map = this.parentElement._map;
    var map = this.parentElement._map;

    // don't go through this if already done
    if (!this._feature) {
      // TODO??? SCALE this.coords if the this._map.poster exists because
      // the img might have been scaled by CSS.
      // compute the style properties to be applied to the feature
      var options = this._styleToPathOptions(window.getComputedStyle(this)),
        points = this.coords ? this._coordsToArray(this.coords) : null;
      // scale points if the poster exists because responsive areas
      if (points && this.parentElement.poster) {
        var worig = this.parentElement.poster.width,
          wresp = this.parentElement.width,
          wadjstmnt = (worig - wresp) / 2;
        for (var i = 0; i < points.length; i++) {
          points[i][0] = points[i][0] - wadjstmnt;
        }
      }

      if (this.shape === "marker") {
        if (this.alt) {
          // Leaflet markers use the options.title as a tooltip
          options["title"] = this.alt;
        }
        this._feature = L.marker(
          map.containerPointToLatLng(points[0]),
          options
        ).addTo(map);
      } else if (this.shape === "circle") {
        var pixelRadius = parseInt(this.coords.split(",")[2]),
          pointOnCirc = L.point(points[0]).add(L.point(0, pixelRadius)),
          latLngOnCirc = map.containerPointToLatLng(pointOnCirc),
          latLngCenter = map.containerPointToLatLng(points[0]),
          radiusInMeters = map.distance(latLngCenter, latLngOnCirc);
        this._feature = L.circle(latLngCenter, radiusInMeters, options).addTo(
          map
        );
      } else if (!this.shape || this.shape === "rect") {
        var bounds = L.latLngBounds(
          map.containerPointToLatLng(points[0]),
          map.containerPointToLatLng(points[1])
        );
        this._feature = L.rectangle(bounds, options).addTo(map);
      } else if (this.shape === "line") {
        this._feature = L.polyline(
          this._pointsToLatLngs(points),
          options
        ).addTo(map);
      } else if (this.shape === "poly") {
        this._feature = L.polygon(this._pointsToLatLngs(points), options).addTo(
          map
        );
      } else if (this.shape === "default") {
        // whole initial area of map is a hyperlink
        this._feature = L.rectangle(map.getBounds(), options).addTo(map);
      }
      if (this.shape !== "marker" && this.alt) {
        // other Leaflet features are implemented via SVG.  SVG displays tooltips
        // based on the <svg:title> graphics child element.
        var title = L.SVG.create("title"),
          titleText = document.createTextNode(this.alt);
        title.appendChild(titleText);
        this._feature._path.appendChild(title);
      }
      if (this.href) {
        // conditionally act on click on an area link.  If no link it should be an
        // inert area, but Leaflet doesn't quite support this.  For a full
        // implementation, we could actually use an image map replete with area
        // children which would provide the linking / cursor change behaviours
        // that are familiar to HTML authors versed in image maps.
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
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._map.removeLayer(this._feature);
    delete this._feature;
  }
  _coordsToArray(containerPoints) {
    // returns an array of arrays of coordinate pairs coordsToArray("1,2,3,4") -> [[1,2],[3,4]]
    for (
      var i = 1, points = [], coords = containerPoints.split(",");
      i < coords.length;
      i += 2
    ) {
      points.push([parseInt(coords[i - 1]), parseInt(coords[i])]);
    }
    return points;
  }
  _pointsToLatLngs(points) {
    // points should be an array of nested container coordinates [[x1,y1],[x2,y2](,[xN,yN])]
    var latLngArray = [];
    if (this._map) {
      for (var i = 0, map = this._map; i < points.length; i++) {
        latLngArray.push(map.containerPointToLatLng(points[i]));
      }
    }
    return latLngArray;
  }
  _styleToPathOptions(style) {
    var options = {};
    if (style.stroke !== "none") {
      options["stroke"] = true;
      options["color"] = style.stroke;
      options["opacity"] = style.strokeOpacity;
      options["weight"] = parseInt(style.strokeWidth);
      options["dashArray"] = style.strokeDasharray;
      options["lineCap"] = style.strokeLinecap;
      options["lineJoin"] = style.strokeLinejoin;
    } else {
      options["stroke"] = false;
    }
    if (style.fill !== "none") {
      options["fill"] = true;
      options["fillColor"] = style.fill;
      options["fillOpacity"] = style.fillOpacity;
      options["fillRule"] = style.fillRule;
    } else {
      options["fill"] = false;
    }
    return options;
  }
}
window.customElements.define(MapArea.tag, MapArea);
export { MapArea };
