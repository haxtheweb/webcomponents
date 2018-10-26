import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "./fancy-carousel-animation-behaviour.js";
/** @polymerBehavior FancyCarouselBehaviour */
window.FancyCarouselBehaviourImpl = {
  properties: {},

  observers: [],

  _loadCustomImages: function(searchTerm) {
    var that = this;
    var imgUrls;
    findImages(searchTerm, this.searchEngineCx, this.apiKey, function(urls) {
      if (!urls) {
        console.log("Error loading images");
        return;
      }
      imgUrls = urls;
      console.log(imgUrls);
      that._addImageNodes(imgUrls);
    });
  },

  _addImageNodes: function(imgUrls) {
    var numUrls = imgUrls.length;
    for (var i = 0; i < numUrls; i++) {
      if (!imgUrls[i]) {
        continue;
      }
      var newImage = document.createElement("img");
      newImage.setAttribute("src", imgUrls[i]);
      newImage.style.width = "100%";
      newImage.style.height = "100%";
      dom(this).appendChild(newImage);
    }
  },

  _getNextElement: function() {
    var elem = this.selected.nextElementSibling;
    while (elem && elem.getAttribute("class") === "dummy") {
      elem = elem.nextElementSibling;
    }
    if (!elem) {
      elem = dom(this).querySelectorAll("img")[0];
    }
    return elem;
  },

  _timerChanged: function(newValue, oldValue) {
    var that = this;
    if (newValue != 0) {
      setInterval(function() {
        that.next();
      }, newValue * 1000);
    }
  },

  _selectedChanged: function(selected, oldSelected) {
    if (oldSelected) {
      oldSelected.removeAttribute("selected");
    }
    if (selected) {
      selected.setAttribute("selected", "");
      this.$.prevBtn.disabled = !selected.previousElementSibling;
      this.$.nextBtn.disabled = !selected.nextElementSibling;

      this._loadImage(selected);
      this._loadImage(selected.previousElementSibling);
      this._loadImage(selected.nextElementSibling);
    }
  },

  _loadImage: function(img) {
    if (img && !img.src) {
      img.src = img.getAttribute("data-src");
    }
  }
};

/** @polymerBehavior */
window.FancyCarouselBehaviour = [
  window.FancyCarouselBehaviourImpl,
  window.FancyCarouselAnimationBehaviour
];
