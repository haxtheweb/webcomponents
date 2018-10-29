import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./fancy-carousel-animation-behaviour.js";
window.FancyCarouselBehaviourImpl = {
  properties: {},
  observers: [],
  _loadCustomImages: function(searchTerm) {
    var that = this,
      imgUrls;
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
    for (var numUrls = imgUrls.length, i = 0; i < numUrls; i++) {
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
    while (elem && "dummy" === elem.getAttribute("class")) {
      elem = elem.nextElementSibling;
    }
    if (!elem) {
      elem = dom(this).querySelectorAll("img")[0];
    }
    return elem;
  },
  _timerChanged: function(newValue) {
    var that = this;
    if (0 != newValue) {
      setInterval(function() {
        that.next();
      }, 1e3 * newValue);
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
window.FancyCarouselBehaviour = [
  window.FancyCarouselBehaviourImpl,
  window.FancyCarouselAnimationBehaviour
];
