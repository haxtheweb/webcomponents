"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleTourManager = exports.TourStop = exports.SimpleTour = void 0;

var _litElement = require("lit-element/lit-element.js");

var _render = require("lit-html/lib/render.js");

var _unsafeHtml = require("lit-html/directives/unsafe-html.js");

require("@lrnwebcomponents/simple-toolbar/simple-toolbar.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

require("./simple-popover-manager.js");

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "",
    '\n          <h2 class="subheading" slot="body">\n            ',
    "\n          </h2>\n          ",
    "",
    "",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '<h1 class="title" slot="heading">\n          ',
    ',\n        <span class="xofy">',
    "/",
    '</span\n        >\n      </h1>\n      <simple-icon-button-lite\n        slot="heading"\n        @click="',
    '"\n        label="Stop Tour"\n        icon="close">\n      </simple-icon-button-lite>\n      <simple-icon-button-lite\n        slot="nav"\n        @click="',
    '"\n        ?disabled="',
    '"\n        label="Prev"\n        icon="arrow-back"\n        show-text-label>\n      </simple-icon-button-lite>\n      <simple-icon-button-lite\n        slot="nav"\n        @click="',
    '"\n        ?disabled="',
    '"\n        label="Next"\n        icon="arrow-forward"\n        show-text-label>\n      </simple-icon-button-lite>',
  ]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(
    Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })
  );
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

var SimpleTour =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(SimpleTour, _LitElement);

    function SimpleTour() {
      var _this;

      _classCallCheck(this, SimpleTour);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleTour).call(this)
      );
      _this.stacks = {};
      _this.orientation = "lr";
      _this.active = null;
      _this.tourInfo = {};
      _this.activeElementDelay = 500;
      _this.stop = -1;
      window.addEventListener(
        "simple-tour-register",
        _this.registerNewTourEvent.bind(_assertThisInitialized(_this))
      );
      window.addEventListener(
        "simple-tour-create-tour-stop",
        _this.createTourStopEvent.bind(_assertThisInitialized(_this))
      );
      return _this;
    }

    _createClass(
      SimpleTour,
      [
        {
          key: "registerNewTourEvent",
          value: function registerNewTourEvent(e) {
            this.registerNewTour(e.detail);
          },
        },
        {
          key: "registerNewTour",
          value: function registerNewTour(newTour) {
            if (!this.stacks[newTour.key]) {
              this.stacks[newTour.key] = [];
            }

            if (!this.tourInfo[newTour.key]) {
              this.tourInfo[newTour.key] = newTour;
            }

            return this.stacks[newTour.key];
          },
          /**
           * create tour stop via events
           */
        },
        {
          key: "createTourStopEvent",
          value: function createTourStopEvent(e) {
            this.createTourStop(
              e.detail.name,
              e.detail.target,
              e.detail.title,
              e.detail.description
            );
          },
          /**
           * Create a tour stop, add to the stack, then return the stop object
           */
        },
        {
          key: "createTourStop",
          value: function createTourStop(name, target, title, description) {
            var s = new TourStop();
            s.target = target;
            s.title = title;
            s.description = description;
            this.addStops(name, [s]);
            return s;
          },
          /**
           * It's possible we drop a target from the DOM and then
           * have to remove it from the tour
           */
        },
        {
          key: "removeTarget",
          value: function removeTarget(name, target) {
            var _this2 = this;

            var dropList = [];
            this.stacks[name].forEach(function (item, index) {
              if (item.target === target) {
                dropList.push(index);
              }
            });
            dropList.forEach(function (i) {
              _this2.stacks[name].splice(i, 1);
            });
          },
          /**
           * Add stops to the tour
           */
        },
        {
          key: "addStops",
          value: function addStops(name, stops) {
            if (!this.stacks[name]) {
              this.stacks[name] = [];
            }

            this.stacks[name] = this.stacks[name].concat(stops);
          },
        },
        {
          key: "hasNext",
          value: function hasNext() {
            return this.stop < this.stacks[this.active].length - 1;
          },
        },
        {
          key: "hasPrev",
          value: function hasPrev() {
            return this.stop > 0;
          },
          /**
           * Move ahead or back in the stack
           */
        },
        {
          key: "nextStop",
          value: function nextStop(e) {
            if (this.stop < this.stacks[this.active].length - 1) {
              this.stop += 1;
            }
          },
        },
        {
          key: "prevStop",
          value: function prevStop(e) {
            if (this.stop > 0) {
              this.stop -= 1;
            }
          },
        },
        {
          key: "startTour",
          value: function startTour(name) {
            this.active = name;
          },
        },
        {
          key: "stopTour",
          value: function stopTour(e) {
            window.SimplePopoverManager.requestAvailability().setPopover(
              this,
              this,
              false,
              this.orientation
            );
            this.stop = -1;
            this.active = null;
          },
          /**
           * Render tour buttons as block
           */
        },
        {
          key: "tourButtons",
          value: function tourButtons() {
            return (0, _litElement.html)(
              _templateObject(),
              this.tourInfo[this.active].name,
              this.stop + 1,
              this.stacks[this.active].length,
              this.stopTour.bind(this),
              this.prevStop.bind(this),
              !this.hasPrev(),
              this.nextStop.bind(this),
              !this.hasNext()
            );
          },
          /**
           * Simple utility to do nice scrolling or only scroll if we can't see it
           * as that is better behavior but not in all browsers
           */
        },
        {
          key: "scrollHere",
          value: function scrollHere(node) {
            // scroll to it
            if (typeof node.scrollIntoViewIfNeeded === "function") {
              node.scrollIntoViewIfNeeded(true);
            } else {
              node.scrollIntoView({
                behavior: "smooth",
                inline: "center",
              });
            }
          },
          /**
           * The manager was called and he's pissed. Do not cross Go, do not collect $200 in tips.
           * You're fired. Me, you, every body. We're fired because someone just asked for the manager
           * to do something else and we were already taking people on a tour and now the kitchen
           * is on fire and someone must be blamed.
           *
           * Also, global calls this to clean up local state when global is hijacked by another project
           * that also leverages the singleton and wants to ensure everyone cleans up after themselves
           * instead of flipping tables on their way out the door. We'll call this function pack up
           * on a Friday to avoid incidents.
           */
        },
        {
          key: "managerReset",
          value: function managerReset() {
            this.stopTour();
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (propName == "active" && _this3.active) {
                _this3.stop = 0;
              }

              if (
                (propName == "stop" && _this3.stop != -1) ||
                (propName == "active" && _this3.active)
              ) {
                (0, _render.render)(
                  document.createElement("div"),
                  window.SimplePopoverManager.requestAvailability()
                );
                var content = (0, _litElement.html)(
                  _templateObject2(),
                  _this3.tourButtons(),
                  (0, _unsafeHtml.unsafeHTML)(
                    "<span>" +
                      _this3.stacks[_this3.active][_this3.stop].title +
                      "</span>"
                  ),
                  (0, _unsafeHtml.unsafeHTML)(
                    '<p slot="body">' +
                      _this3.stacks[_this3.active][_this3.stop].description +
                      "</p>"
                  ),
                  _this3.tourInfo[_this3.active].style
                    ? (0, _unsafeHtml.unsafeHTML)(
                        "<style>" +
                          _this3.tourInfo[_this3.active].style +
                          "</style>"
                      )
                    : ""
                );
                (0, _render.render)(
                  content,
                  window.SimplePopoverManager.requestAvailability()
                );
                window.SimplePopoverManager.requestAvailability().setPopover(
                  _this3,
                  _this3.stacks[_this3.active][_this3.stop].target,
                  true,
                  _this3.orientation
                );

                _this3.scrollHere(
                  _this3.stacks[_this3.active][_this3.stop].target
                );

                var target = _this3.stacks[_this3.active][_this3.stop].target;

                var part = _this3.stacks[_this3.active][
                  _this3.stop
                ].target.getAttribute("part");

                target.setAttribute("part", "simple-tour-active");
                setTimeout(function () {
                  if (part == null || part == "simple-tour-active") {
                    target.removeAttribute("part");
                  } else {
                    target.setAttribute("part", part);
                  }
                }, _this3.activeElementDelay);
              }
            });
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              stop: {
                type: Number,
              },
              active: {
                type: String,
              },
              stacks: {
                type: Object,
              },
              activeElementDelay: {
                type: Number,
              },
            };
          },
        },
      ]
    );

    return SimpleTour;
  })(_litElement.LitElement);
/**
 * Simple Tour Stop object for consistency
 */

exports.SimpleTour = SimpleTour;

var TourStop = function TourStop() {
  _classCallCheck(this, TourStop);

  this.target = null;
  this.title = "Title";
  this.description = "<p>Description</p>";
};

exports.TourStop = TourStop;
customElements.define("simple-tour", SimpleTour);
// register globally so we can make sure there is only one
window.SimpleTourManager = window.SimpleTourManager || {}; // request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal

window.SimpleTourManager.requestAvailability = function () {
  if (!window.SimpleTourManager.instance) {
    window.SimpleTourManager.instance = document.createElement("simple-tour");
    document.body.appendChild(window.SimpleTourManager.instance);
  }

  return window.SimpleTourManager.instance;
}; // self append

var SimpleTourManager = window.SimpleTourManager.requestAvailability();
exports.SimpleTourManager = SimpleTourManager;
