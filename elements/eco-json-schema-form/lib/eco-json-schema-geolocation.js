import "@polymer/polymer/polymer.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/app-localize-behavior/app-localize-behavior.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-input/paper-input-container.js";
import "@polymer/paper-input/paper-input-error.js";
import "@polymer/paper-styles/typography.js";
import "geo-location/geo-location.js";
import "google-map/google-map.js";
import "google-map/google-map-marker.js";
const $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="eco-json-schema-geolocation">

	
	

	
	
	
	

	

	
	

	<template>
		<style is="custom-style" include="iron-flex iron-flex-alignment">
			:host {
				display: block;
				overflow: hidden
			}

			:host google-map {
				height: 16em;
				width: 16em;
				border: none
			}

			paper-input {
				padding: 2px;
				--paper-input-container-label: {
					white-space: normal;
					position: static;
					font-size: 22px;
					color: #212121;
				}
			}
		</style>

		<!--<geo-location watch-pos-->
		<geo-location high-accuracy="" latitude="{{latitude}}" longitude="{{longitude}}" on-geo-error="geoError">
		</geo-location>

		<!-- information text above the map -->
		<template is="dom-if" if="{{!latitude}}">
			{{localize('location-unknown')}}
		</template>


		<template is="dom-if" if="{{latitude}}">
			<paper-material elevation="0" class="layout">
				<paper-material elevation="0" class="layout">
					latitud: <span>{{latitude}}</span>, longitud: <span>{{longitude}}</span>
					<!--,{{localize('accuracy')}}: <span>{{accuracy}}</span>m-->
				</paper-material>
			</paper-material>
		</template>

		<div>
			<google-map id="map2" longitude="[[longitude]]" latitude="[[latitude]]" zoom="15">
				<google-map-marker longitude="{{longitude}}" latitude="{{latitude}}" draggable="true"></google-map-marker>
			</google-map>
		</div>

		<template is="dom-if" if="[[errorMessage]]">
			<paper-input-error aria-live="assertive">[[errorMessage]]</paper-input-error>
		</template>

	</template>

	

</dom-module>`;

document.head.appendChild($_documentContainer);
/**
`eco-json-schema-geolocation` takes in a JSON schema of type number and string and
contains a `paper-geolocation`, exposing a `value` property that represents the schema.

Validation is handled for strings and number/integers by mapping JSON schema
validation keywords to `paper-geolocation` attributes; form elements will automatically
try and validate themselves as users provide input:

Please see the `eco-json-schema-object` documentation for further information.

@group eco Elements
@element eco-json-schema-geolocation
@demo demo/index.html
*/
Polymer({
  is: "eco-json-schema-geolocation",
  behaviors: [Polymer.AppLocalizeBehavior],

  properties: {
    language: {
      value: "es"
    },
    resources: {
      type: Object,
      notify: true
    },
    schema: {
      type: Object,
      observer: "_schemaChanged"
    },
    value: {
      type: Object,
      notify: true,
      computed: "_geoLocationComp(latitude,longitude)"
    },
    error: {
      type: String,
      observer: "_errorChanged",
      value: null
    },
    latitude: {
      type: Number,
      //observer: '_geoChange',
      notify: true,
      value: 1
    },
    longitude: {
      type: Number,
      //observer: '_geoChange',
      notify: true,
      value: 1
    },
    zoom: {
      type: Number,
      notify: true
    }
  },
  ready: function() {
    this.set("latitude", 0);
    this.set("longitude", 0);
    //this._geoLocationComp(this.latitude,this.longitude);
  },
  _schemaChanged: function() {
    var schema = this.schema;
  },
  _errorChanged: function() {
    if (this.error) {
      this.errorMessage = this.error;
    } else {
      this.errorMessage = null;
    }
  },
  geoError: function(event) {
    var error = event.detail;
    console.error(error);
    this.error = JSON.stringify(error);
  },
  _geoLocationComp: function(latitude, longitude) {
    return {
      latitude: latitude,
      longitude: longitude
    };
  }
});
