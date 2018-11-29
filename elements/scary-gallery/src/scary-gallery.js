import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "./lib/scary-image.js";
/**
`<scary-gallery>` will (try to) layout any of its `<scary-image>` children
to make best use of available space, and rearranges the images, when the
size changes.

Sample usage:
```
<scary-gallery>
  <scary-image src="img1.jpg"></scary-image>
  <scary-image src="img2.jpg"></scary-image>
  <scary-image src="img3.jpg"></scary-image>
  <scary-image src="img4.jpg"></scary-image>
  <scary-image src="img5.jpg"></scary-image>
  <scary-image src="img6.jpg"></scary-image>
</scary-gallery>
```

Disclaimer:

Work in progress, the algorithm to layout the images is far from perfect.

@demo demo/index.html
*/
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
    /**
     * Minimum height of photos, unless they are too wide to fit.
     */
    minHeight: {
      type: Number,
      value: 200
    },

    /**
     * Spacing between the images in pixels
     */
    gap: {
      type: Number,
      value: 4
    }
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
        this._firstResize = true;
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
        var loaded = true;
        var rows = [];
        var row = [];
        var rowWidth = 0;
        this._maxWidth = this.offsetWidth;
        this._children.forEach(
          function(img) {
            img.style.margin = (this.gap / 2).toString(10) + "px";
            if (img.loaded) {
              var width =
                (this.minHeight / img.naturalHeight) * img.naturalWidth +
                this.gap;
              if (rowWidth + width > this._maxWidth) {
                if (row.length > 0) {
                  rows.push({
                    images: row,
                    width: rowWidth
                  });
                  row = [];
                }
                rowWidth = 0;
              }
              rowWidth += width;
              img.tmpWidth = width;
              row.push(img);
            } else {
              loaded = false;
            }
          }.bind(this)
        );
        if (row.length > 0) {
          rows.push({
            images: row,
            width: rowWidth
          });
        }

        rows.forEach(
          function(row) {
            var totalGap = row.images.length * this.gap;
            var targetWidth = this._maxWidth - totalGap;
            var rowWidth = row.width - totalGap;
            var targetHeight = (this.minHeight * targetWidth) / rowWidth;

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
          // Unfortunately there is no way (I know of) to detect size changes
          // because of scrollbars appearing after the initial load.
          // Therefore I trigger a second _resize() manually here.
          this._firstResize = false;
          this._resize();
        }
      },
      50
    );
  }
});
export { ScaryGallery };
