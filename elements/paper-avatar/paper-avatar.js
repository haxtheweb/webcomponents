import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { Polymer } from "@polymer/polymer/lib/legacy/polymer-fn.js";
import "./lib/jdenticon-1.4.0.min.js";
import "./lib/md5.min.js";
/**
`paper-avatar`
User avatar in material style

### Styling

To change the background color:

    paper-avatar {
      --paper-avatar-color: red;
    }
	
To change the size of the avatar:

    paper-avatar {
      --paper-avatar-width: 60px;
    }

Custom property | Description | Default
----------------|-------------|----------
`--paper-avatar-width` | Size (width and height) of the avatar image | `40px`
`--paper-avatar-color` | Background color of the avatar image | 


@demo demo/index.html 
*/
Polymer({
  is: "paper-avatar",

  properties: {
    /**
     * Image address or base64
     */
    src: {
      type: String
    },

    /**
     *	Label with username
     */
    label: {
      type: String,
      observer: "_observerLabel"
    },

    /**
     * Show two chars in avatar
     */
    twoChars: {
      type: Boolean,
      value: false
    },

    /**
     * Array of colors for avatar background
     */
    colors: {
      type: Array
    },

    /**
     * Set true if you want use a jdenticon avatar
     */
    jdenticon: {
      type: Boolean,
      value: false
    }
  },

  _observerLabel: function(label) {
    if (label) {
      if (this.jdenticon) {
        this.$.label.hidden = true;

        jdenticon.config = {
          lightness: {
            color: [1, 1],
            grayscale: [1, 1]
          },
          saturation: 1
        };

        jdenticon.update(this.$.jdenticon, md5(label));
      }

      this.updateStyles({
        "--paper-avatar-bgcolor": this._parseColor(label)
      });
    }
  },

  _label: function(label) {
    if (!label) return "";

    if (this.twoChars) {
      if (this.label.indexOf(" ") > -1) {
        var matches = this.label.match(/\b(\w)/g);
        return matches[0] + matches[1];
      } else {
        return label.substring(0, 2);
      }
    }

    return label.charAt(0);
  },

  _onImgLoad: function(e) {
    e.currentTarget.hidden = false;
  },

  _onImgError: function(e) {
    e.currentTarget.hidden = true;
  },

  _parseColor: function(label) {
    var colors = this.colors
      ? this.colors
      : [
          "#F44336",
          "#E91E63",
          "#9C27B0",
          "#673AB7",
          "#3F51B5",
          "#2196F3",
          "#03A9F4",
          "#00BCD4",
          "#795548",
          "#009688",
          "#4CAF50",
          "#8BC34A",
          "#CDDC39",
          "#FFEB3B",
          "#FFC107",
          "#FF9800",
          "#FF5722",
          "#9E9E9E",
          "#607D8B"
        ];

    var hash = 0;

    for (var a = 0; a < label.length; a++) hash += label.charCodeAt(a) << 5;

    if (hash >= colors.length) return colors[hash % colors.length];

    return colors[hash];
  }
});
