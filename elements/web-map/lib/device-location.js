import { Polymer } from "@polymer/polymer/polymer-legacy.js";
Polymer({
  is: "device-location",
  properties: {
    lat: {
      type: Number,
      value: 0,
      reflectToAttribute: false
    },
    lon: {
      type: Number,
      value: 0,
      reflectToAttribute: false
    },
    centered: {
      type: Boolean,
      reflectToAttribute: true
    }
  },
  observers: ["_toggleCentered(centered)"],
  _toggleCentered: function(centered) {
    if (centered) {
      // TODO create a point feature on the controls pane at the map center
      // DONE register a watchPosition function to move the map as the device
      // location changes
      var self = this,
        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
      function moveTo(position) {
        self.lat = position.coords.latitude;
        self.lon = position.coords.longitude;
        if (self.parentNode.zoomTo && self.parentNode._map) {
          // TODO when the zoomTo bug is fixed, remove zoom+1
          self.parentNode.zoomTo(self.lat, self.lon, self.parentNode.zoom + 1);
        }
      }
      this._watchID = navigator.geolocation.watchPosition(
        moveTo,
        null,
        options
      );
    } else {
      this._deleteWatch();
      // TODO replace the marker on the control pane at the center of the map
      // with an actual point feature , or simply move that point from
      // the control pane to the vector pane

      // TODO register a navigator.geolocation.watchPosition function to
      // update the location of the above point feature
    }
  },
  detached: function() {
    this._deleteWatch();
    // TODO if there is a point associated to this control, remove/delete it
  },
  attached: function() {
    this._deleteWatch();
    this._createWatch();
    if (this.parentNode.controls) {
      // add the device-location radio button control to the controls pane
      this._map = this.parentNode._map;
    }
  },
  ready: function() {
    if (this.centered) {
      var self = this,
        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
      function moveTo(position) {
        self.lat = position.coords.latitude;
        self.lon = position.coords.longitude;
        if (self.parentNode.zoomTo && self.parentNode._map) {
          // TODO when the zoomTo bug is fixed, remove zoom+1
          self.parentNode.zoomTo(self.lat, self.lon, self.parentNode.zoom + 1);
        }
      }
      this._watchID = navigator.geolocation.watchPosition(
        moveTo,
        null,
        options
      );
    }
  },

  _deleteWatch: function() {
    if (this._watchID) {
      navigator.geolocation.clearWatch(this._watchID);
      delete this._watchID;
    }
  },
  _createWatch: function() {
    if (this.centered) {
      var self = this,
        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
      function moveTo(position) {
        self.lat = position.coords.latitude;
        self.lon = position.coords.longitude;
        if (self.parentNode.zoomTo && self.parentNode._map) {
          // TODO when the zoomTo bug is fixed, remove zoom+1
          self.parentNode.zoomTo(self.lat, self.lon, self.parentNode.zoom + 1);
        }
      }
      this._watchID = navigator.geolocation.watchPosition(
        moveTo,
        null,
        options
      );
    }
  }
});
