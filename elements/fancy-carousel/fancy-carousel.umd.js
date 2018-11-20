import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "./lib/fancy-carousel-behaviour.js";
import "./lib/fancy-carousel-shared-styles.js";
/**
`fancy-carousel`
Carousel which gives you options for multiple fancy transistions and different ways to include images.

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style include="fancy-carousel-shared-styles">
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        width: 100%;
        contain: content;
      }

      :host(:after) {
        display: block;
        content: '';
        padding-top: 75%; /* 4:3 = height is 75% of width */
      }

      #prevBtn {
        left: 12px;
        z-index: 1000;
      }

      #nextBtn {
        right: 12px;
        z-index: 1000;
      }
    </style>

    <div id="content-wrapper">
      <slot></slot>
    </div>

    <button id="prevBtn" on-click="previous">❮</button>
    <button id="nextBtn" on-click="next">❯</button>
`,

  is: "fancy-carousel",

  behaviors: [FancyCarouselBehaviour],

  properties: {
    selected: {
      observer: "_selectedChanged"
    },
    imageTopic: {
      type: String
    },
    searchEngineCx: {
      type: String
    },
    apiKey: {
      type: String
    },
    transitionType: {
      value: "default",
      type: String,
      notify: true
    },
    noControls: {
      type: Boolean,
      value: false
    },
    transitionTimer: {
      type: Number,
      value: 0,
      observer: "_timerChanged"
    }
  },

  attached: function() {
    this._resetZIndex(dom(this).children);
    this.selected = dom(this).querySelectorAll("img")[0];
    if (this.selected) {
      this.selected.style.zIndex = "100";
    }
    if (this.noControls) {
      this.$.prevBtn.style.display = "none";
      this.$.nextBtn.style.display = "none";
    }
    if (this.imageTopic) {
      this._loadCustomImages(this.imageTopic);
    }

    this._preloadAnimationSprites();
  },

  /**
   * Changes the carousel to the previous image
   */
  previous: function() {
    var elem = this.selected.previousElementSibling;
    while (elem && elem.getAttribute("class") === "dummy") {
      elem = elem.previousElementSibling;
    }
    if (elem && !this._touchDir) {
      this._startTransition(-1, this.selected, elem);
    }
  },

  /**
   * Changes the carousel to the next image
   */
  next: function() {
    var elem = this._getNextElement();
    if (elem && !this._touchDir) {
      this._startTransition(1, this.selected, elem);
    }
  }
});
