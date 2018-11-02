import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/polymer/lib/elements/dom-if.js";
Polymer({
  is: "paper-avatar",
  _template: html`
    <style>
			:host {
				--paper-avatar-width: 40px;
			}
			:host {
				display: inline-block;
				box-sizing: border-box;
				position: relative;
				width: var(--paper-avatar-width);
				height:  var(--paper-avatar-width);
				border-radius: 50%;
				cursor: default;
				background-color: var(--paper-avatar-color, var(--paper-avatar-bgcolor));
				-webkit-user-select: none;
				   -moz-user-select: none;
				    -ms-user-select: none;
						user-select: none;
			}
			
			:host > * {
				pointer-events: none;
			}
			
			#label, #img, #jdenticon {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
			#label {
				overflow: hidden;
				display: -ms-flexbox;
				display: -webkit-flex;
				display: flex;
				-webkit-flex-direction: row;
					-ms-flex-direction: row;
						flex-direction: row;
				-webkit-align-items: center;
					 -ms-flex-align: center;
					 	align-items: center;
			}
			#label span {
				display: block;
				width: 100%;
				font-weight: 400;
				color: rgba(255, 255, 255, .8);
				text-transform: capitalize;
				font-family: 'Roboto', 'Noto', sans-serif;
				-webkit-font-smoothing: antialiased;
				text-align: center;
				font-size: calc(var(--paper-avatar-width) / 1.65);
			}
			#jdenticon {
				width: var(--paper-avatar-width);
				height: var(--paper-avatar-width);
			}
			
			*[hidden] {
				display: none !important;
			}
		</style>

		<div id="label" title="[[label]]"><span>[[_label(label)]]</span></div>

		<svg id="jdenticon" width="40" height="40">
      <slot></slot>
    </svg>

		<template is="dom-if" if="[[src]]">
			<img id="img" src="[[src]]" title="[[label]]" on-load="_onImgLoad" on-error="_onImgError" title="[[color]]">
		</template>
  `,
  properties: {
    src: { type: String },
    label: { type: String, observer: "_observerLabel" },
    twoChars: { type: Boolean, value: !1 },
    colors: { type: Array },
    jdenticon: { type: Boolean, value: !1 }
  },
  _observerLabel: function(label) {
    if (label) {
      if (this.jdenticon) {
        this.$.label.hidden = !0;
        jdenticon.config = {
          lightness: { color: [1, 1], grayscale: [1, 1] },
          saturation: 1
        };
      }
      this.updateStyles({ "--paper-avatar-bgcolor": this._parseColor(label) });
    }
  },
  _label: function(label) {
    if (!label) return "";
    if (this.twoChars) {
      if (-1 < this.label.indexOf(" ")) {
        var matches = this.label.match(/\b(\w)/g);
        return matches[0] + matches[1];
      } else {
        return label.substring(0, 2);
      }
    }
    return label.charAt(0);
  },
  _onImgLoad: function(e) {
    e.currentTarget.hidden = !1;
  },
  _onImgError: function(e) {
    e.currentTarget.hidden = !0;
  },
  _parseColor: function(label) {
    for (
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
            ],
        hash = 0,
        a = 0;
      a < label.length;
      a++
    )
      hash += label.charCodeAt(a) << 5;
    if (hash >= colors.length) return colors[hash % colors.length];
    return colors[hash];
  }
});
