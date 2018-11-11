define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js"
], function(_exports, _polymerElement) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.BeakerBroker = void 0;
  function _templateObject_3c2a7b60e5f711e8a0c7df9e51483f59() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_3c2a7b60e5f711e8a0c7df9e51483f59 = function() {
      return data;
    };
    return data;
  }
  var BeakerBroker = (function(_PolymerElement) {
    babelHelpers.inherits(BeakerBroker, _PolymerElement);
    function BeakerBroker() {
      babelHelpers.classCallCheck(this, BeakerBroker);
      return babelHelpers.possibleConstructorReturn(
        this,
        (BeakerBroker.__proto__ || Object.getPrototypeOf(BeakerBroker)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      BeakerBroker,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                BeakerBroker.prototype.__proto__ ||
                  Object.getPrototypeOf(BeakerBroker.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            if (
              ("undefined" === typeof DatArchive
                ? "undefined"
                : babelHelpers.typeof(DatArchive)) === "undefined"
            ) {
              console.log(
                "Beaker is not available from this site loading methodology"
              );
            }
          }
        },
        {
          key: "_datUrlChanged",
          value: (function() {
            var _datUrlChanged2 = babelHelpers.asyncToGenerator(
              regeneratorRuntime.mark(function _callee(newValue) {
                return regeneratorRuntime.wrap(
                  function(_context) {
                    while (1) {
                      switch ((_context.prev = _context.next)) {
                        case 0:
                          if (
                            ("undefined" === typeof DatArchive
                              ? "undefined"
                              : babelHelpers.typeof(DatArchive)) !==
                              "undefined" &&
                            newValue
                          ) {
                            this.set("archive", new DatArchive(newValue));
                          }
                        case 1:
                        case "end":
                          return _context.stop();
                      }
                    }
                  },
                  _callee,
                  this
                );
              })
            );
            return function _datUrlChanged() {
              return _datUrlChanged2.apply(this, arguments);
            };
          })()
        },
        {
          key: "write",
          value: (function() {
            var _write = babelHelpers.asyncToGenerator(
              regeneratorRuntime.mark(function _callee2(path, data) {
                return regeneratorRuntime.wrap(
                  function(_context2) {
                    while (1) {
                      switch ((_context2.prev = _context2.next)) {
                        case 0:
                          _context2.next = 2;
                          return this.archive.writeFile(path, data);
                        case 2:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  },
                  _callee2,
                  this
                );
              })
            );
            return function write() {
              return _write.apply(this, arguments);
            };
          })()
        },
        {
          key: "read",
          value: (function() {
            var _read = babelHelpers.asyncToGenerator(
              regeneratorRuntime.mark(function _callee3(path, type) {
                var ftype, response, buf, blob, str;
                return regeneratorRuntime.wrap(
                  function(_context3) {
                    while (1) {
                      switch ((_context3.prev = _context3.next)) {
                        case 0:
                          ftype = "utf8";
                          _context3.t0 = type;
                          _context3.next =
                            "jpeg" === _context3.t0
                              ? 4
                              : "jpg" === _context3.t0
                                ? 4
                                : "png" === _context3.t0
                                  ? 11
                                  : "base64" === _context3.t0
                                    ? 18
                                    : 23;
                          break;
                        case 4:
                          ftype = "binary";
                          _context3.next = 7;
                          return this.archive.readFile(path, ftype);
                        case 7:
                          buf = _context3.sent;
                          blob = new Blob([buf], { type: "image/jpeg" });
                          response = URL.createObjectURL(blob);
                          return _context3.abrupt("break", 28);
                        case 11:
                          ftype = "binary";
                          _context3.next = 14;
                          return this.archive.readFile(path, ftype);
                        case 14:
                          buf = _context3.sent;
                          blob = new Blob([buf], { type: "image/png" });
                          response = URL.createObjectURL(blob);
                          return _context3.abrupt("break", 28);
                        case 18:
                          _context3.next = 20;
                          return this.archive.readFile(path, type);
                        case 20:
                          str = _context3.sent;
                          response = "data:image/png;base64," + str;
                          return _context3.abrupt("break", 28);
                        case 23:
                          _context3.next = 25;
                          return this.archive.readFile(path, type);
                        case 25:
                          str = _context3.sent;
                          response = str;
                          return _context3.abrupt("break", 28);
                        case 28:
                          _context3.next = 30;
                          return response;
                        case 30:
                          return _context3.abrupt("return", _context3.sent);
                        case 31:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  },
                  _callee3,
                  this
                );
              })
            );
            return function read() {
              return _read.apply(this, arguments);
            };
          })()
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_3c2a7b60e5f711e8a0c7df9e51483f59()
            );
          }
        },
        {
          key: "haxProperties",
          get: function get() {
            return {};
          }
        },
        {
          key: "properties",
          get: function get() {
            return {
              archive: { type: Object, notify: !0 },
              datUrl: {
                type: String,
                value: "window.location.host",
                observer: "_datUrlChanged",
                notify: !0
              }
            };
          }
        },
        {
          key: "tag",
          get: function get() {
            return "beaker-broker";
          }
        }
      ]
    );
    return BeakerBroker;
  })(_polymerElement.PolymerElement);
  _exports.BeakerBroker = BeakerBroker;
  window.customElements.define(BeakerBroker.tag, BeakerBroker);
});
