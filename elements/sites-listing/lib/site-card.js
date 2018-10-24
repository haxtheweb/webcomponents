import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-card/paper-card.js";
/**
`site-card`
A simple card for representing a site
@demo demo/index.html

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-flex;
        min-width: 250px;
      }
      :host:focus {
        outline: none;
      }
    
      :host[size="micro"] {
        transform: scale(.5);
      }
    
      :host[size="small"] {
        transform: scale(.8);
      }
    
      paper-card {
        border-radius: 4px;
        margin: 0;
        width: 100%;
      }
    
      .card-actions {
        background-color: #f5f5f5;
        border-radius: 0 0 4px 4px;
        padding: 0 .5em;
      }
    
      .card-actions .card-action-details {
        display: inline-block;
        vertical-align: middle;
        vertical-align: -webkit-baseline-middle;
        width: 80%;
      }
    
      .card-control-height {
        height: 15rem;
      }
    
      [elevation="0"] {
        border: solid 1px #EEEEEE;
      }
    
      .text-right {
        text-align: right;
      }
    
      .text-left {
        text-align: left;
      }
    
      .name,
      .title {
        color: #222;
        font-size: .8em;
        font-weight: 600;
        line-height: 1.25em;
        padding: 0 .75em;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: .5em;
      }
    
      .title {
        font-size: .7em;
        font-weight: 400;
      }
    
      .divider {
        height: 1px;
        width: 100%;
        background: #efefef;
      }
    
      .site-icon {
        display: inline-block;
        vertical-align: text-top;
        transform: scale(.8);
        --iron-icon-height: 100%;
        --iron-icon-width: 100%;
        overflow: hidden;
        color: grey;
        margin: -1em .5em 0 0;
        position: absolute;
        right: 0;
      }
    
      .site-icon:hover,
      .site-icon:focus {
        color: black;
      }
    
      .center {
        margin: auto;
        width: 80%;
        padding: 1em;
      }
    
      .link {
        font-size: 1em;
        line-height: 1em;
      }
    
      .site-info {
        width: 100%;
      }
    
      .site-preview {
        height: 10em;
      }
      .card-content {
        padding: 0;
        margin: 0;
        overflow: hidden;
      }
    
      .inline {
        display: inline;
      }
    </style>
    <paper-card elevation="[[elevation]]">
      <div class="card-content card-control-height card-control-center">
        <div class="site-preview">
          <iron-image style="width:100%; height:100%; background-color: lightgray;" sizing="cover" preload="" fade="" src="[[image]]" hidden\$="[[!image]]"></iron-image>
        </div>
        <iron-icon class="site-icon" icon="[[icon]]" hidden\$="[[!icon]]"></iron-icon>
        <div class="site-info">
          <div class="divider"></div>
          <div class="name">[[name]]</div>
          <div class="title">[[title]]</div>
        </div>
      </div>
      <div class="card-actions" hidden="">
        <div class="card-action-details">
        </div>
      </div>
    </paper-card>
`,

  is: "site-card",

  listeners: {
    mouseover: "_mouseEnter",
    focusin: "_mouseEnter",
    mousedown: "_mouseEnter",
    mouseleave: "_mouseLeave",
    mouseout: "_mouseLeave",
    focusout: "_mouseLeave"
  },

  hostAttributes: {
    tabindex: "0"
  },

  properties: {
    /**
     * Scale of the card.
     */
    size: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Cover image src.
     */
    image: {
      type: String
    },
    /**
     * Icon to use if image isn't there.
     */
    icon: {
      type: String,
      value: false
    },
    /**
     * name of the course like sing100
     */
    name: {
      type: String,
      value: ""
    },
    /**
     * title of the course like Intro to studies
     */
    title: {
      type: String,
      value: ""
    },
    /**
     * Visual elevation of the item off the UI via paper element height
     */
    elevation: {
      type: Number,
      value: 1,
      reflectToAttribute: true
    }
  },

  /**
   * Increase elevation while hovering.
   */
  _mouseEnter: function(e) {
    this.__oldElevation = this.elevation;
    if (this.elevation + 2 > 5) {
      this.elevation = 5;
    } else {
      this.elevation += 2;
    }
  },

  /**
   * Reset the elevation.
   */
  _mouseLeave: function(e) {
    this.elevation = this.__oldElevation;
  }
});
