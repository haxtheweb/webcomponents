import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import { FlattenedNodesObserver } from "./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "./lib/scary-image.js";
let ScaryGallery = Polymer({
  _template: html`
    <style>
      :host {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }
    </style>
    <slot></slot>
`,
  is: "scary-gallery",
  properties: {
    minHeight: { type: Number, value: 200 },
    gap: { type: Number, value: 4 }
  },
  observers: ["_init(minHeight, gap)"],
  attached: function() {
    this._observer = new FlattenedNodesObserver(this, this._init);
    this._boundResize = this._resize.bind(this);
    window.addEventListener("resize", this._boundResize);
  },
  detached: function() {
    dom(this).unobserveNodes(this._observer);
    window.removeEventListener("resize", this._boundResize);
  },
  _init: function() {
    this.debounce(
      "init",
      function() {
        this._firstResize = !0;
        this._children = Array.prototype.slice.call(
          dom(this).querySelectorAll("scary-image")
        );
        this._resize();
      },
      50
    );
  },
  _resize: function() {
    this.debounce(
      "resize",
      function() {
        var loaded = !0,
          rows = [],
          row = [],
          rowWidth = 0;
        this._maxWidth = this.offsetWidth;
        this._children.forEach(
          function(img) {
            img.style.margin = (this.gap / 2).toString(10) + "px";
            if (img.loaded) {
              var width =
                (this.minHeight / img.naturalHeight) * img.naturalWidth +
                this.gap;
              if (rowWidth + width > this._maxWidth) {
                if (0 < row.length) {
                  rows.push({ images: row, width: rowWidth });
                  row = [];
                }
                rowWidth = 0;
              }
              rowWidth += width;
              img.tmpWidth = width;
              row.push(img);
            } else {
              loaded = !1;
            }
          }.bind(this)
        );
        if (0 < row.length) {
          rows.push({ images: row, width: rowWidth });
        }
        rows.forEach(
          function(row) {
            var totalGap = row.images.length * this.gap,
              targetWidth = this._maxWidth - totalGap,
              rowWidth = row.width - totalGap,
              targetHeight = (this.minHeight * targetWidth) / rowWidth;
            row.images.forEach(
              function(img) {
                img.height = targetHeight;
                img.width =
                  (targetHeight / img.naturalHeight) * img.naturalWidth;
              }.bind(this)
            );
          }.bind(this)
        );
        if (!loaded) {
          this._resize();
        }
        if (loaded && this._firstResize) {
          this._firstResize = !1;
          this._resize();
        }
      },
      50
    );
  }
});
export { ScaryGallery };
