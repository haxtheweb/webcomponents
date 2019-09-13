/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/web-map/web-map.js";
/**
 * `map-element`
 * `A mapping data bound element`
 *
 * @demo demo/index.html
 */
class MapElement extends SchemaBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <map
        is="web-map"
        zoom="17"
        lat="45.398043"
        lon="-75.70683"
        width="700"
        height="400"
        controls=""
      >
        <layer-
          id="osm"
          src="https://geogratis.gc.ca/mapml/en/osmtile/osm/"
          label="Open Street Map"
          checked=""
          hidden=""
        ></layer->
        <layer-
          id="cbmt"
          src="https://geogratis.gc.ca/mapml/en/osmtile/cbmt/"
          label="Canada Base Map"
        ></layer->
        <layer-
          id="canvec"
          src="https://geogratis.gc.ca/api/beta/vectors/canvec/50k/features/"
          label="CanVec+ 031G"
          class="transparency"
        ></layer->
        <layer- id="marker" label="Marker layer" src="marker.mapml"></layer->
        <area
          is="map-area"
          id="marker2"
          href="https://example.com/marker/"
          alt="Marker"
          coords="265,185"
          shape="marker"
        />
        <area
          is="map-area"
          id="line"
          href="https://example.com/line/"
          alt="Line"
          coords="275,275,540,107"
          shape="line"
        />
        <area
          is="map-area"
          id="doughnut"
          alt="Circle"
          href="https://example.com/circle/"
          coords="250,250,25"
          shape="circle"
          style="fill: white; stroke: aqua; stroke-width: 5px;fill-opacity: 0.0"
        />
        <area
          is="map-area"
          id="hole"
          coords="250,250,7"
          shape="circle"
          style="fill: blue; stroke: none;fill-opacity: 0.3;"
        />
        <area
          is="map-area"
          id="rect"
          href="https://example.com/rectangle/"
          alt="Rectangle"
          coords="345,290,415,320"
          shape="rect"
          style="fill: greenyellow; stroke: blue; stroke-width: 3px;fill-opacity: 0.4"
        />
        <area
          is="map-area"
          id="poly"
          href="https://example.com/polygon/"
          alt="Polygon"
          coords="392,116,430,100,441,128,405,145"
          shape="poly"
          style="fill: pink; stroke: blue; stroke-width: 3px;fill-opacity: 0.4"
        />
      </map>
    `;
  }
  static get tag() {
    return "map-element";
  }
  static get properties() {
    let props = {
      /**
       * Title
       */
      title: {
        type: String
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Sample gizmo",
        description: "The user will be able to see this for selection in a UI.",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "video",
            url: "source"
          }
        ],
        meta: {
          author: "Your organization on github"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
  }
}
window.customElements.define(MapElement.tag, MapElement);
export { MapElement };
