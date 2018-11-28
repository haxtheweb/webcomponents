import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import { pathFromUrl } from "../node_modules/@polymer/polymer/lib/utils/resolve-url.js";
window.FancyCarouselAnimationBehaviourImpl = {
  properties: { _isWorking: !1 },
  observers: [],
  _getNatureSpriteUrl: function() {
    let basePath = pathFromUrl(import.meta.url);
    return "url('" + `${basePath}images/nature-sprite.png` + "')";
  },
  _getUrbanSpriteUrl: function() {
    let basePath = pathFromUrl(import.meta.url);
    return "url('" + `${basePath}images/urban-sprite.png` + "')";
  },
  _getShiftSpriteUrl: function() {
    let basePath = pathFromUrl(import.meta.url);
    return "url('" + `${basePath}images/building-sprite.png` + "')";
  },
  _getCollaspeSpriteUrl: function() {
    let basePath = pathFromUrl(import.meta.url);
    return "url('" + `${basePath}images/building-sprite-2.png` + "')";
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
      "spread" === this.transitionType ||
      "paint" === this.transitionType ||
      "shift" === this.transitionType ||
      "collapse" === this.transitionType
    ) {
      this._animateTransition(direction, selected, nextElem);
    } else {
      if (this._isWorking) return;
      this._isWorking = !0;
      nextElem.style.zIndex = "50";
      var oldSelected = selected;
      this._translateX(oldSelected, 0);
      this._translateX(nextElem, this.offsetWidth * direction);
      this.selected = nextElem;
      this._translateX(oldSelected, -this.offsetWidth * direction, !0);
      this._translateX(nextElem, 0, !0);
      this._resetZIndex(dom(this).children, selected);
      nextElem.style.zIndex = "100";
      this._isWorking = !1;
    }
  },
  _animateTransition: function(direction, selected, nextElem) {
    var self = this;
    if (self._isWorking) return;
    self._isWorking = !0;
    nextElem.style.zIndex = "50";
    selected.className = this.transitionType;
    if ("spread" === this.transitionType) {
      selected.style.mask = this._getNatureSpriteUrl();
      selected.style.webkitMask = this._getNatureSpriteUrl();
    } else if ("paint" === this.transitionType) {
      selected.style.mask = this._getUrbanSpriteUrl();
      selected.style.webkitMask = this._getUrbanSpriteUrl();
    } else if ("collapse" === this.transitionType) {
      selected.style.mask = this._getCollaspeSpriteUrl();
      selected.style.webkitMask = this._getCollaspeSpriteUrl();
    } else if ("shift" === this.transitionType) {
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
      self._isWorking = !1;
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
    if (2 > this.childElementCount) {
      return;
    }
    if (!this._touchDir) {
      this._startX = event.changedTouches[0].clientX;
      this._startY = event.changedTouches[0].clientY;
    }
  },
  _touchmove: function(event) {
    var _Mathabs = Math.abs;
    if (2 > this.childElementCount) {
      return;
    }
    if (!this._touchDir) {
      var absX = _Mathabs(event.changedTouches[0].clientX - this._startX),
        absY = _Mathabs(event.changedTouches[0].clientY - this._startY);
      this._touchDir = absX > absY ? "x" : "y";
    }
    if ("x" === this._touchDir) {
      event.preventDefault();
      var dx = Math.round(event.changedTouches[0].clientX - this._startX),
        prevChild = this.selected.previousElementSibling,
        nextChild = this.selected.nextElementSibling;
      if ((!prevChild && 0 < dx) || (!nextChild && 0 > dx)) {
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
    if (2 > this.childElementCount) {
      return;
    }
    if (event.touches.length) {
      return;
    }
    if ("x" === this._touchDir) {
      var dx = Math.round(event.changedTouches[0].clientX - this._startX),
        prevChild = this.selected.previousElementSibling,
        nextChild = this.selected.nextElementSibling;
      if ((!prevChild && 0 < dx) || (!nextChild && 0 > dx)) {
        dx = 0;
      }
      if (0 < dx) {
        var prevChild = this.selected.previousElementSibling;
        if (prevChild) {
          if (100 < dx) {
            if (dx === this.offsetWidth) {
              this._resetChildrenStyles();
            } else {
              this._translateX(prevChild, 0, !0);
              this._translateX(this.selected, this.offsetWidth, !0);
            }
            this.selected = prevChild;
          } else {
            this._translateX(prevChild, -this.offsetWidth, !0);
            this._translateX(this.selected, 0, !0);
          }
        }
      } else if (0 > dx) {
        var nextChild = this.selected.nextElementSibling;
        if (nextChild) {
          if (-100 > dx) {
            if (dx === -this.offsetWidth) {
              this._resetChildrenStyles();
            } else {
              this._translateX(this.selected, -this.offsetWidth, !0);
              this._translateX(nextChild, 0, !0);
            }
            this.selected = nextChild;
          } else {
            this._translateX(this.selected, 0, !0);
            this._translateX(nextChild, this.offsetWidth, !0);
          }
        }
      } else {
        this._resetChildrenStyles();
      }
    }
    this._touchDir = null;
  }
};
window.FancyCarouselAnimationBehaviour = [
  window.FancyCarouselAnimationBehaviourImpl
];
