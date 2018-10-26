import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";

/** @polymerBehavior FancyCarouselAnimationBehaviour */
window.FancyCarouselAnimationBehaviourImpl = {
  properties: {
    _isWorking: false
  },

  observers: [],

  _getNatureSpriteUrl: function() {
    return "url('" + this.resolveUrl("images/nature-sprite.png") + "')";
  },

  _getUrbanSpriteUrl: function() {
    return "url('" + this.resolveUrl("images/urban-sprite.png") + "')";
  },

  _getShiftSpriteUrl: function() {
    return "url('" + this.resolveUrl("images/building-sprite.png") + "')";
  },

  _getCollaspeSpriteUrl: function() {
    return "url('" + this.resolveUrl("images/building-sprite-2.png") + "')";
  },

  _preloadAnimationSprites: function() {
    var dummyDiv1 = document.createElement("div");
    dummyDiv1.style.backgroundImage = this._getNatureSpriteUrl();
    dummyDiv1.style.visibility = "hidden";
    dummyDiv1.setAttribute("class", "dummy");
    dom(this).appendChild(dummyDiv1);

    var dummyDiv2 = document.createElement("div");
    dummyDiv2.style.backgroundImage = this._getUrbanSpriteUrl();
    dummyDiv2.style.visibility = "hidden";
    dummyDiv2.setAttribute("class", "dummy");
    dom(this).appendChild(dummyDiv2);

    var dummyDiv3 = document.createElement("div");
    dummyDiv3.style.backgroundImage = this._getShiftSpriteUrl();
    dummyDiv3.style.visibility = "hidden";
    dummyDiv3.setAttribute("class", "dummy");
    dom(this).appendChild(dummyDiv3);

    var dummyDiv4 = document.createElement("div");
    dummyDiv4.style.backgroundImage = this._getCollaspeSpriteUrl();
    dummyDiv4.style.visibility = "hidden";
    dummyDiv4.setAttribute("class", "dummy");
    dom(this).appendChild(dummyDiv4);
  },

  _resetZIndex: function(elements, current) {
    for (var i = 0; i < elements.length; i++) {
      if (current && current.src === elements[i].src) {
        elements[i].style.zIndex = "2";
      } else {
        elements[i].style.zIndex = "1";
      }
    }
  },

  _startTransition: function(direction, selected, nextElem) {
    if (
      this.transitionType === "spread" ||
      this.transitionType === "paint" ||
      this.transitionType === "shift" ||
      this.transitionType === "collapse"
    ) {
      this._animateTransition(direction, selected, nextElem);
    } else {
      if (this._isWorking) return;
      this._isWorking = true;

      nextElem.style.zIndex = "50";

      var oldSelected = selected;
      this._translateX(oldSelected, 0);
      this._translateX(nextElem, this.offsetWidth * direction);

      // Start the transition
      this.selected = nextElem;
      this._translateX(
        oldSelected,
        -this.offsetWidth * direction,
        true /* transition */
      );
      this._translateX(nextElem, 0, true /* transition */);

      this._resetZIndex(dom(this).children, selected);
      nextElem.style.zIndex = "100";

      this._isWorking = false;
    }
  },

  _animateTransition: function(direction, selected, nextElem) {
    var self = this;

    if (self._isWorking) return;
    self._isWorking = true;

    nextElem.style.zIndex = "50";
    selected.className = this.transitionType;

    if (this.transitionType === "spread") {
      selected.style.mask = this._getNatureSpriteUrl();
      selected.style.webkitMask = this._getNatureSpriteUrl();
    } else if (this.transitionType === "paint") {
      selected.style.mask = this._getUrbanSpriteUrl();
      selected.style.webkitMask = this._getUrbanSpriteUrl();
    } else if (this.transitionType === "collapse") {
      selected.style.mask = this._getCollaspeSpriteUrl();
      selected.style.webkitMask = this._getCollaspeSpriteUrl();
    } else if (this.transitionType === "shift") {
      selected.style.mask = this._getShiftSpriteUrl();
      selected.style.webkitMask = this._getShiftSpriteUrl();
    }

    setTimeout(function() {
      selected.className = "";
      selected.style.mask = "";
      selected.style.webkitMask = "";
      self._resetZIndex(dom(self).children);
      nextElem.style.zIndex = "100";
      self.selected = nextElem;
      self._isWorking = false;
    }, 1400);
  },

  listeners: {
    transitionend: "_resetChildrenStyles",
    touchstart: "_touchstart",
    touchmove: "_touchmove",
    touchend: "_touchend"
  },

  _resetChildrenStyles: function() {
    var elem = this.firstElementChild;
    while (elem) {
      elem.style.display = "";
      elem.style.transition = "";
      elem.style.transform = "";
      elem = elem.nextElementSibling;
    }
  },

  _translateX: function(elem, x, transition) {
    elem.style.display = "block";
    elem.style.transition = transition ? "transform 0.2s" : "";
    elem.style.transform = "translate3d(" + x + "px, 0, 0)";
  },

  _touchstart: function(event) {
    // No transition if less than two images
    if (this.childElementCount < 2) {
      return;
    }

    // Save start coordinates
    if (!this._touchDir) {
      this._startX = event.changedTouches[0].clientX;
      this._startY = event.changedTouches[0].clientY;
    }
  },

  _touchmove: function(event) {
    // No transition if less than two images
    if (this.childElementCount < 2) {
      return;
    }

    // Is touchmove mostly horizontal or vertical?
    if (!this._touchDir) {
      var absX = Math.abs(event.changedTouches[0].clientX - this._startX);
      var absY = Math.abs(event.changedTouches[0].clientY - this._startY);
      this._touchDir = absX > absY ? "x" : "y";
    }

    if (this._touchDir === "x") {
      // Prevent vertically scrolling when swiping
      event.preventDefault();

      var dx = Math.round(event.changedTouches[0].clientX - this._startX);
      var prevChild = this.selected.previousElementSibling;
      var nextChild = this.selected.nextElementSibling;

      // Don't translate past the current image if there's no adjacent image in that direction
      if ((!prevChild && dx > 0) || (!nextChild && dx < 0)) {
        dx = 0;
      }

      this._translateX(this.selected, dx);
      if (prevChild) {
        this._translateX(prevChild, dx - this.offsetWidth);
      }
      if (nextChild) {
        this._translateX(nextChild, dx + this.offsetWidth);
      }
    }
  },

  _touchend: function(event) {
    // No transition if less than two images
    if (this.childElementCount < 2) {
      return;
    }

    // Don't finish swiping if there are still active touches.
    if (event.touches.length) {
      return;
    }

    if (this._touchDir === "x") {
      var dx = Math.round(event.changedTouches[0].clientX - this._startX);
      var prevChild = this.selected.previousElementSibling;
      var nextChild = this.selected.nextElementSibling;

      // Don't translate past the current image if there's no adjacent image in that direction
      if ((!prevChild && dx > 0) || (!nextChild && dx < 0)) {
        dx = 0;
      }

      if (dx > 0) {
        var prevChild = this.selected.previousElementSibling;
        if (prevChild) {
          if (dx > 100) {
            if (dx === this.offsetWidth) {
              // No transitionend will fire (since we're already in the final state),
              // so reset children styles now
              this._resetChildrenStyles();
            } else {
              this._translateX(prevChild, 0, true);
              this._translateX(this.selected, this.offsetWidth, true);
            }
            this.selected = prevChild;
          } else {
            this._translateX(prevChild, -this.offsetWidth, true);
            this._translateX(this.selected, 0, true);
          }
        }
      } else if (dx < 0) {
        var nextChild = this.selected.nextElementSibling;
        if (nextChild) {
          if (dx < -100) {
            if (dx === -this.offsetWidth) {
              // No transitionend will fire (since we're already in the final state),
              // so reset children styles now
              this._resetChildrenStyles();
            } else {
              this._translateX(this.selected, -this.offsetWidth, true);
              this._translateX(nextChild, 0, true);
            }
            this.selected = nextChild;
          } else {
            this._translateX(this.selected, 0, true);
            this._translateX(nextChild, this.offsetWidth, true);
          }
        }
      } else {
        // No transitionend will fire (since we're already in the final state),
        // so reset children styles now
        this._resetChildrenStyles();
      }
    }

    // Reset touch direction
    this._touchDir = null;
  }
};

/** @polymerBehavior */
window.FancyCarouselAnimationBehaviour = [
  window.FancyCarouselAnimationBehaviourImpl
];
