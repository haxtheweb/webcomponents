"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleColorsSharedStylesGlobal = exports.SimpleColorsSharedStyles = void 0;

var _litElement = require("lit-element/lit-element.js");

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n        html {\n          --simple-colors-default-theme-accent-1: #ffffff;\n          --simple-colors-default-theme-accent-2: #eeeeee;\n          --simple-colors-default-theme-accent-3: #dddddd;\n          --simple-colors-default-theme-accent-4: #cccccc;\n          --simple-colors-default-theme-accent-5: #bbbbbb;\n          --simple-colors-default-theme-accent-6: #999999;\n          --simple-colors-default-theme-accent-7: #666666;\n          --simple-colors-default-theme-accent-8: #444444;\n          --simple-colors-default-theme-accent-9: #333333;\n          --simple-colors-default-theme-accent-10: #222222;\n          --simple-colors-default-theme-accent-11: #111111;\n          --simple-colors-default-theme-accent-12: #000000;\n\n          --simple-colors-default-theme-grey-1: #ffffff;\n          --simple-colors-default-theme-grey-2: #eeeeee;\n          --simple-colors-default-theme-grey-3: #dddddd;\n          --simple-colors-default-theme-grey-4: #cccccc;\n          --simple-colors-default-theme-grey-5: #bbbbbb;\n          --simple-colors-default-theme-grey-6: #999999;\n          --simple-colors-default-theme-grey-7: #666666;\n          --simple-colors-default-theme-grey-8: #444444;\n          --simple-colors-default-theme-grey-9: #333333;\n          --simple-colors-default-theme-grey-10: #222222;\n          --simple-colors-default-theme-grey-11: #111111;\n          --simple-colors-default-theme-grey-12: #000000;\n\n          --simple-colors-default-theme-red-1: #ffdddd;\n          --simple-colors-default-theme-red-2: #ffaeae;\n          --simple-colors-default-theme-red-3: #ff8f8f;\n          --simple-colors-default-theme-red-4: #ff7474;\n          --simple-colors-default-theme-red-5: #fd5151;\n          --simple-colors-default-theme-red-6: #ff2222;\n          --simple-colors-default-theme-red-7: #ee0000;\n          --simple-colors-default-theme-red-8: #ac0000;\n          --simple-colors-default-theme-red-9: #850000;\n          --simple-colors-default-theme-red-10: #670000;\n          --simple-colors-default-theme-red-11: #520000;\n          --simple-colors-default-theme-red-12: #3f0000;\n\n          --simple-colors-default-theme-pink-1: #ffe6f1;\n          --simple-colors-default-theme-pink-2: #ffa5cf;\n          --simple-colors-default-theme-pink-3: #ff87c0;\n          --simple-colors-default-theme-pink-4: #ff73b5;\n          --simple-colors-default-theme-pink-5: #fd60aa;\n          --simple-colors-default-theme-pink-6: #ff3996;\n          --simple-colors-default-theme-pink-7: #da004e;\n          --simple-colors-default-theme-pink-8: #b80042;\n          --simple-colors-default-theme-pink-9: #980036;\n          --simple-colors-default-theme-pink-10: #78002b;\n          --simple-colors-default-theme-pink-11: #5a0020;\n          --simple-colors-default-theme-pink-12: #440019;\n\n          --simple-colors-default-theme-purple-1: #fce6ff;\n          --simple-colors-default-theme-purple-2: #f4affd;\n          --simple-colors-default-theme-purple-3: #f394ff;\n          --simple-colors-default-theme-purple-4: #f07cff;\n          --simple-colors-default-theme-purple-5: #ed61ff;\n          --simple-colors-default-theme-purple-6: #e200ff;\n          --simple-colors-default-theme-purple-7: #a500ba;\n          --simple-colors-default-theme-purple-8: #8a009b;\n          --simple-colors-default-theme-purple-9: #6c0079;\n          --simple-colors-default-theme-purple-10: #490052;\n          --simple-colors-default-theme-purple-11: #33003a;\n          --simple-colors-default-theme-purple-12: #200025;\n\n          --simple-colors-default-theme-deep-purple-1: #f3e4ff;\n          --simple-colors-default-theme-deep-purple-2: #ddacff;\n          --simple-colors-default-theme-deep-purple-3: #c97eff;\n          --simple-colors-default-theme-deep-purple-4: #bb63f9;\n          --simple-colors-default-theme-deep-purple-5: #b44aff;\n          --simple-colors-default-theme-deep-purple-6: #a931ff;\n          --simple-colors-default-theme-deep-purple-7: #7e00d8;\n          --simple-colors-default-theme-deep-purple-8: #5d009f;\n          --simple-colors-default-theme-deep-purple-9: #4c0081;\n          --simple-colors-default-theme-deep-purple-10: #3a0063;\n          --simple-colors-default-theme-deep-purple-11: #2a0049;\n          --simple-colors-default-theme-deep-purple-12: #1d0033;\n\n          --simple-colors-default-theme-indigo-1: #e5ddff;\n          --simple-colors-default-theme-indigo-2: #c3b2ff;\n          --simple-colors-default-theme-indigo-3: #af97ff;\n          --simple-colors-default-theme-indigo-4: #9e82ff;\n          --simple-colors-default-theme-indigo-5: #9373ff;\n          --simple-colors-default-theme-indigo-6: #835fff;\n          --simple-colors-default-theme-indigo-7: #3a00ff;\n          --simple-colors-default-theme-indigo-8: #2801b0;\n          --simple-colors-default-theme-indigo-9: #20008c;\n          --simple-colors-default-theme-indigo-10: #160063;\n          --simple-colors-default-theme-indigo-11: #100049;\n          --simple-colors-default-theme-indigo-12: #0a0030;\n\n          --simple-colors-default-theme-blue-1: #e2ecff;\n          --simple-colors-default-theme-blue-2: #acc9ff;\n          --simple-colors-default-theme-blue-3: #95baff;\n          --simple-colors-default-theme-blue-4: #74a5ff;\n          --simple-colors-default-theme-blue-5: #5892fd;\n          --simple-colors-default-theme-blue-6: #4083ff;\n          --simple-colors-default-theme-blue-7: #0059ff;\n          --simple-colors-default-theme-blue-8: #0041bb;\n          --simple-colors-default-theme-blue-9: #003494;\n          --simple-colors-default-theme-blue-10: #002569;\n          --simple-colors-default-theme-blue-11: #001947;\n          --simple-colors-default-theme-blue-12: #001333;\n\n          --simple-colors-default-theme-light-blue-1: #cde8ff;\n          --simple-colors-default-theme-light-blue-2: #a1d1ff;\n          --simple-colors-default-theme-light-blue-3: #92c9ff;\n          --simple-colors-default-theme-light-blue-4: #65b3ff;\n          --simple-colors-default-theme-light-blue-5: #58adff;\n          --simple-colors-default-theme-light-blue-6: #41a1ff;\n          --simple-colors-default-theme-light-blue-7: #007ffc;\n          --simple-colors-default-theme-light-blue-8: #0066ca;\n          --simple-colors-default-theme-light-blue-9: #0055a8;\n          --simple-colors-default-theme-light-blue-10: #003f7d;\n          --simple-colors-default-theme-light-blue-11: #002850;\n          --simple-colors-default-theme-light-blue-12: #001b36;\n\n          --simple-colors-default-theme-cyan-1: #ddf8ff;\n          --simple-colors-default-theme-cyan-2: #9beaff;\n          --simple-colors-default-theme-cyan-3: #77e2ff;\n          --simple-colors-default-theme-cyan-4: #33d4ff;\n          --simple-colors-default-theme-cyan-5: #1ccfff;\n          --simple-colors-default-theme-cyan-6: #00c9ff;\n          --simple-colors-default-theme-cyan-7: #009dc7;\n          --simple-colors-default-theme-cyan-8: #007999;\n          --simple-colors-default-theme-cyan-9: #005970;\n          --simple-colors-default-theme-cyan-10: #003f50;\n          --simple-colors-default-theme-cyan-11: #002c38;\n          --simple-colors-default-theme-cyan-12: #001a20;\n\n          --simple-colors-default-theme-teal-1: #d9fff0;\n          --simple-colors-default-theme-teal-2: #98ffd7;\n          --simple-colors-default-theme-teal-3: #79ffcb;\n          --simple-colors-default-theme-teal-4: #56ffbd;\n          --simple-colors-default-theme-teal-5: #29ffac;\n          --simple-colors-default-theme-teal-6: #00ff9c;\n          --simple-colors-default-theme-teal-7: #009d75;\n          --simple-colors-default-theme-teal-8: #007658;\n          --simple-colors-default-theme-teal-9: #004e3a;\n          --simple-colors-default-theme-teal-10: #003829;\n          --simple-colors-default-theme-teal-11: #002a20;\n          --simple-colors-default-theme-teal-12: #001b14;\n\n          --simple-colors-default-theme-green-1: #e1ffeb;\n          --simple-colors-default-theme-green-2: #acffc9;\n          --simple-colors-default-theme-green-3: #79ffa7;\n          --simple-colors-default-theme-green-4: #49ff88;\n          --simple-colors-default-theme-green-5: #24ff70;\n          --simple-colors-default-theme-green-6: #00f961;\n          --simple-colors-default-theme-green-7: #008c37;\n          --simple-colors-default-theme-green-8: #00762e;\n          --simple-colors-default-theme-green-9: #005a23;\n          --simple-colors-default-theme-green-10: #003d18;\n          --simple-colors-default-theme-green-11: #002a11;\n          --simple-colors-default-theme-green-12: #001d0c;\n\n          --simple-colors-default-theme-light-green-1: #ebffdb;\n          --simple-colors-default-theme-light-green-2: #c7ff9b;\n          --simple-colors-default-theme-light-green-3: #b1ff75;\n          --simple-colors-default-theme-light-green-4: #a1fd5a;\n          --simple-colors-default-theme-light-green-5: #8efd38;\n          --simple-colors-default-theme-light-green-6: #6fff00;\n          --simple-colors-default-theme-light-green-7: #429d00;\n          --simple-colors-default-theme-light-green-8: #357f00;\n          --simple-colors-default-theme-light-green-9: #296100;\n          --simple-colors-default-theme-light-green-10: #1b3f00;\n          --simple-colors-default-theme-light-green-11: #143000;\n          --simple-colors-default-theme-light-green-12: #0d2000;\n\n          --simple-colors-default-theme-lime-1: #f1ffd2;\n          --simple-colors-default-theme-lime-2: #dfff9b;\n          --simple-colors-default-theme-lime-3: #d4ff77;\n          --simple-colors-default-theme-lime-4: #caff58;\n          --simple-colors-default-theme-lime-5: #bdff2d;\n          --simple-colors-default-theme-lime-6: #aeff00;\n          --simple-colors-default-theme-lime-7: #649900;\n          --simple-colors-default-theme-lime-8: #4d7600;\n          --simple-colors-default-theme-lime-9: #3b5a00;\n          --simple-colors-default-theme-lime-10: #293f00;\n          --simple-colors-default-theme-lime-11: #223400;\n          --simple-colors-default-theme-lime-12: #182400;\n\n          --simple-colors-default-theme-yellow-1: #ffffd5;\n          --simple-colors-default-theme-yellow-2: #ffffac;\n          --simple-colors-default-theme-yellow-3: #ffff90;\n          --simple-colors-default-theme-yellow-4: #ffff7c;\n          --simple-colors-default-theme-yellow-5: #ffff3a;\n          --simple-colors-default-theme-yellow-6: #f6f600;\n          --simple-colors-default-theme-yellow-7: #929100;\n          --simple-colors-default-theme-yellow-8: #787700;\n          --simple-colors-default-theme-yellow-9: #585700;\n          --simple-colors-default-theme-yellow-10: #454400;\n          --simple-colors-default-theme-yellow-11: #303000;\n          --simple-colors-default-theme-yellow-12: #242400;\n\n          --simple-colors-default-theme-amber-1: #fff2d4;\n          --simple-colors-default-theme-amber-2: #ffdf92;\n          --simple-colors-default-theme-amber-3: #ffd677;\n          --simple-colors-default-theme-amber-4: #ffcf5e;\n          --simple-colors-default-theme-amber-5: #ffc235;\n          --simple-colors-default-theme-amber-6: #ffc500;\n          --simple-colors-default-theme-amber-7: #b28900;\n          --simple-colors-default-theme-amber-8: #876800;\n          --simple-colors-default-theme-amber-9: #614b00;\n          --simple-colors-default-theme-amber-10: #413200;\n          --simple-colors-default-theme-amber-11: #302500;\n          --simple-colors-default-theme-amber-12: #221a00;\n\n          --simple-colors-default-theme-orange-1: #ffebd7;\n          --simple-colors-default-theme-orange-2: #ffca92;\n          --simple-colors-default-theme-orange-3: #ffbd75;\n          --simple-colors-default-theme-orange-4: #ffb05c;\n          --simple-colors-default-theme-orange-5: #ff9e36;\n          --simple-colors-default-theme-orange-6: #ff9625;\n          --simple-colors-default-theme-orange-7: #e56a00;\n          --simple-colors-default-theme-orange-8: #ae5100;\n          --simple-colors-default-theme-orange-9: #833d00;\n          --simple-colors-default-theme-orange-10: #612d00;\n          --simple-colors-default-theme-orange-11: #3d1c00;\n          --simple-colors-default-theme-orange-12: #2c1400;\n\n          --simple-colors-default-theme-deep-orange-1: #ffe7e0;\n          --simple-colors-default-theme-deep-orange-2: #ffb299;\n          --simple-colors-default-theme-deep-orange-3: #ffa588;\n          --simple-colors-default-theme-deep-orange-4: #ff8a64;\n          --simple-colors-default-theme-deep-orange-5: #ff7649;\n          --simple-colors-default-theme-deep-orange-6: #ff6c3c;\n          --simple-colors-default-theme-deep-orange-7: #f53100;\n          --simple-colors-default-theme-deep-orange-8: #b92500;\n          --simple-colors-default-theme-deep-orange-9: #8a1c00;\n          --simple-colors-default-theme-deep-orange-10: #561100;\n          --simple-colors-default-theme-deep-orange-11: #3a0c00;\n          --simple-colors-default-theme-deep-orange-12: #240700;\n\n          --simple-colors-default-theme-brown-1: #f0e2de;\n          --simple-colors-default-theme-brown-2: #e5b8aa;\n          --simple-colors-default-theme-brown-3: #c59485;\n          --simple-colors-default-theme-brown-4: #b68373;\n          --simple-colors-default-theme-brown-5: #ac7868;\n          --simple-colors-default-theme-brown-6: #a47060;\n          --simple-colors-default-theme-brown-7: #85574a;\n          --simple-colors-default-theme-brown-8: #724539;\n          --simple-colors-default-theme-brown-9: #5b3328;\n          --simple-colors-default-theme-brown-10: #3b1e15;\n          --simple-colors-default-theme-brown-11: #2c140e;\n          --simple-colors-default-theme-brown-12: #200e09;\n\n          --simple-colors-default-theme-blue-grey-1: #e7eff1;\n          --simple-colors-default-theme-blue-grey-2: #b1c5ce;\n          --simple-colors-default-theme-blue-grey-3: #9badb6;\n          --simple-colors-default-theme-blue-grey-4: #8d9fa7;\n          --simple-colors-default-theme-blue-grey-5: #7a8f98;\n          --simple-colors-default-theme-blue-grey-6: #718892;\n          --simple-colors-default-theme-blue-grey-7: #56707c;\n          --simple-colors-default-theme-blue-grey-8: #40535b;\n          --simple-colors-default-theme-blue-grey-9: #2f3e45;\n          --simple-colors-default-theme-blue-grey-10: #1e282c;\n          --simple-colors-default-theme-blue-grey-11: #182023;\n          --simple-colors-default-theme-blue-grey-12: #0f1518;\n          --simple-colors-fixed-theme-accent-1: #ffffff;\n          --simple-colors-fixed-theme-accent-2: #eeeeee;\n          --simple-colors-fixed-theme-accent-3: #dddddd;\n          --simple-colors-fixed-theme-accent-4: #cccccc;\n          --simple-colors-fixed-theme-accent-5: #bbbbbb;\n          --simple-colors-fixed-theme-accent-6: #999999;\n          --simple-colors-fixed-theme-accent-7: #666666;\n          --simple-colors-fixed-theme-accent-8: #444444;\n          --simple-colors-fixed-theme-accent-9: #333333;\n          --simple-colors-fixed-theme-accent-10: #222222;\n          --simple-colors-fixed-theme-accent-11: #111111;\n          --simple-colors-fixed-theme-accent-12: #000000;\n\n          --simple-colors-fixed-theme-grey-1: #ffffff;\n          --simple-colors-fixed-theme-grey-2: #eeeeee;\n          --simple-colors-fixed-theme-grey-3: #dddddd;\n          --simple-colors-fixed-theme-grey-4: #cccccc;\n          --simple-colors-fixed-theme-grey-5: #bbbbbb;\n          --simple-colors-fixed-theme-grey-6: #999999;\n          --simple-colors-fixed-theme-grey-7: #666666;\n          --simple-colors-fixed-theme-grey-8: #444444;\n          --simple-colors-fixed-theme-grey-9: #333333;\n          --simple-colors-fixed-theme-grey-10: #222222;\n          --simple-colors-fixed-theme-grey-11: #111111;\n          --simple-colors-fixed-theme-grey-12: #000000;\n\n          --simple-colors-fixed-theme-red-1: #ffdddd;\n          --simple-colors-fixed-theme-red-2: #ffaeae;\n          --simple-colors-fixed-theme-red-3: #ff8f8f;\n          --simple-colors-fixed-theme-red-4: #ff7474;\n          --simple-colors-fixed-theme-red-5: #fd5151;\n          --simple-colors-fixed-theme-red-6: #ff2222;\n          --simple-colors-fixed-theme-red-7: #ee0000;\n          --simple-colors-fixed-theme-red-8: #ac0000;\n          --simple-colors-fixed-theme-red-9: #850000;\n          --simple-colors-fixed-theme-red-10: #670000;\n          --simple-colors-fixed-theme-red-11: #520000;\n          --simple-colors-fixed-theme-red-12: #3f0000;\n\n          --simple-colors-fixed-theme-pink-1: #ffe6f1;\n          --simple-colors-fixed-theme-pink-2: #ffa5cf;\n          --simple-colors-fixed-theme-pink-3: #ff87c0;\n          --simple-colors-fixed-theme-pink-4: #ff73b5;\n          --simple-colors-fixed-theme-pink-5: #fd60aa;\n          --simple-colors-fixed-theme-pink-6: #ff3996;\n          --simple-colors-fixed-theme-pink-7: #da004e;\n          --simple-colors-fixed-theme-pink-8: #b80042;\n          --simple-colors-fixed-theme-pink-9: #980036;\n          --simple-colors-fixed-theme-pink-10: #78002b;\n          --simple-colors-fixed-theme-pink-11: #5a0020;\n          --simple-colors-fixed-theme-pink-12: #440019;\n\n          --simple-colors-fixed-theme-purple-1: #fce6ff;\n          --simple-colors-fixed-theme-purple-2: #f4affd;\n          --simple-colors-fixed-theme-purple-3: #f394ff;\n          --simple-colors-fixed-theme-purple-4: #f07cff;\n          --simple-colors-fixed-theme-purple-5: #ed61ff;\n          --simple-colors-fixed-theme-purple-6: #e200ff;\n          --simple-colors-fixed-theme-purple-7: #a500ba;\n          --simple-colors-fixed-theme-purple-8: #8a009b;\n          --simple-colors-fixed-theme-purple-9: #6c0079;\n          --simple-colors-fixed-theme-purple-10: #490052;\n          --simple-colors-fixed-theme-purple-11: #33003a;\n          --simple-colors-fixed-theme-purple-12: #200025;\n\n          --simple-colors-fixed-theme-deep-purple-1: #f3e4ff;\n          --simple-colors-fixed-theme-deep-purple-2: #ddacff;\n          --simple-colors-fixed-theme-deep-purple-3: #c97eff;\n          --simple-colors-fixed-theme-deep-purple-4: #bb63f9;\n          --simple-colors-fixed-theme-deep-purple-5: #b44aff;\n          --simple-colors-fixed-theme-deep-purple-6: #a931ff;\n          --simple-colors-fixed-theme-deep-purple-7: #7e00d8;\n          --simple-colors-fixed-theme-deep-purple-8: #5d009f;\n          --simple-colors-fixed-theme-deep-purple-9: #4c0081;\n          --simple-colors-fixed-theme-deep-purple-10: #3a0063;\n          --simple-colors-fixed-theme-deep-purple-11: #2a0049;\n          --simple-colors-fixed-theme-deep-purple-12: #1d0033;\n\n          --simple-colors-fixed-theme-indigo-1: #e5ddff;\n          --simple-colors-fixed-theme-indigo-2: #c3b2ff;\n          --simple-colors-fixed-theme-indigo-3: #af97ff;\n          --simple-colors-fixed-theme-indigo-4: #9e82ff;\n          --simple-colors-fixed-theme-indigo-5: #9373ff;\n          --simple-colors-fixed-theme-indigo-6: #835fff;\n          --simple-colors-fixed-theme-indigo-7: #3a00ff;\n          --simple-colors-fixed-theme-indigo-8: #2801b0;\n          --simple-colors-fixed-theme-indigo-9: #20008c;\n          --simple-colors-fixed-theme-indigo-10: #160063;\n          --simple-colors-fixed-theme-indigo-11: #100049;\n          --simple-colors-fixed-theme-indigo-12: #0a0030;\n\n          --simple-colors-fixed-theme-blue-1: #e2ecff;\n          --simple-colors-fixed-theme-blue-2: #acc9ff;\n          --simple-colors-fixed-theme-blue-3: #95baff;\n          --simple-colors-fixed-theme-blue-4: #74a5ff;\n          --simple-colors-fixed-theme-blue-5: #5892fd;\n          --simple-colors-fixed-theme-blue-6: #4083ff;\n          --simple-colors-fixed-theme-blue-7: #0059ff;\n          --simple-colors-fixed-theme-blue-8: #0041bb;\n          --simple-colors-fixed-theme-blue-9: #003494;\n          --simple-colors-fixed-theme-blue-10: #002569;\n          --simple-colors-fixed-theme-blue-11: #001947;\n          --simple-colors-fixed-theme-blue-12: #001333;\n\n          --simple-colors-fixed-theme-light-blue-1: #cde8ff;\n          --simple-colors-fixed-theme-light-blue-2: #a1d1ff;\n          --simple-colors-fixed-theme-light-blue-3: #92c9ff;\n          --simple-colors-fixed-theme-light-blue-4: #65b3ff;\n          --simple-colors-fixed-theme-light-blue-5: #58adff;\n          --simple-colors-fixed-theme-light-blue-6: #41a1ff;\n          --simple-colors-fixed-theme-light-blue-7: #007ffc;\n          --simple-colors-fixed-theme-light-blue-8: #0066ca;\n          --simple-colors-fixed-theme-light-blue-9: #0055a8;\n          --simple-colors-fixed-theme-light-blue-10: #003f7d;\n          --simple-colors-fixed-theme-light-blue-11: #002850;\n          --simple-colors-fixed-theme-light-blue-12: #001b36;\n\n          --simple-colors-fixed-theme-cyan-1: #ddf8ff;\n          --simple-colors-fixed-theme-cyan-2: #9beaff;\n          --simple-colors-fixed-theme-cyan-3: #77e2ff;\n          --simple-colors-fixed-theme-cyan-4: #33d4ff;\n          --simple-colors-fixed-theme-cyan-5: #1ccfff;\n          --simple-colors-fixed-theme-cyan-6: #00c9ff;\n          --simple-colors-fixed-theme-cyan-7: #009dc7;\n          --simple-colors-fixed-theme-cyan-8: #007999;\n          --simple-colors-fixed-theme-cyan-9: #005970;\n          --simple-colors-fixed-theme-cyan-10: #003f50;\n          --simple-colors-fixed-theme-cyan-11: #002c38;\n          --simple-colors-fixed-theme-cyan-12: #001a20;\n\n          --simple-colors-fixed-theme-teal-1: #d9fff0;\n          --simple-colors-fixed-theme-teal-2: #98ffd7;\n          --simple-colors-fixed-theme-teal-3: #79ffcb;\n          --simple-colors-fixed-theme-teal-4: #56ffbd;\n          --simple-colors-fixed-theme-teal-5: #29ffac;\n          --simple-colors-fixed-theme-teal-6: #00ff9c;\n          --simple-colors-fixed-theme-teal-7: #009d75;\n          --simple-colors-fixed-theme-teal-8: #007658;\n          --simple-colors-fixed-theme-teal-9: #004e3a;\n          --simple-colors-fixed-theme-teal-10: #003829;\n          --simple-colors-fixed-theme-teal-11: #002a20;\n          --simple-colors-fixed-theme-teal-12: #001b14;\n\n          --simple-colors-fixed-theme-green-1: #e1ffeb;\n          --simple-colors-fixed-theme-green-2: #acffc9;\n          --simple-colors-fixed-theme-green-3: #79ffa7;\n          --simple-colors-fixed-theme-green-4: #49ff88;\n          --simple-colors-fixed-theme-green-5: #24ff70;\n          --simple-colors-fixed-theme-green-6: #00f961;\n          --simple-colors-fixed-theme-green-7: #008c37;\n          --simple-colors-fixed-theme-green-8: #00762e;\n          --simple-colors-fixed-theme-green-9: #005a23;\n          --simple-colors-fixed-theme-green-10: #003d18;\n          --simple-colors-fixed-theme-green-11: #002a11;\n          --simple-colors-fixed-theme-green-12: #001d0c;\n\n          --simple-colors-fixed-theme-light-green-1: #ebffdb;\n          --simple-colors-fixed-theme-light-green-2: #c7ff9b;\n          --simple-colors-fixed-theme-light-green-3: #b1ff75;\n          --simple-colors-fixed-theme-light-green-4: #a1fd5a;\n          --simple-colors-fixed-theme-light-green-5: #8efd38;\n          --simple-colors-fixed-theme-light-green-6: #6fff00;\n          --simple-colors-fixed-theme-light-green-7: #429d00;\n          --simple-colors-fixed-theme-light-green-8: #357f00;\n          --simple-colors-fixed-theme-light-green-9: #296100;\n          --simple-colors-fixed-theme-light-green-10: #1b3f00;\n          --simple-colors-fixed-theme-light-green-11: #143000;\n          --simple-colors-fixed-theme-light-green-12: #0d2000;\n\n          --simple-colors-fixed-theme-lime-1: #f1ffd2;\n          --simple-colors-fixed-theme-lime-2: #dfff9b;\n          --simple-colors-fixed-theme-lime-3: #d4ff77;\n          --simple-colors-fixed-theme-lime-4: #caff58;\n          --simple-colors-fixed-theme-lime-5: #bdff2d;\n          --simple-colors-fixed-theme-lime-6: #aeff00;\n          --simple-colors-fixed-theme-lime-7: #649900;\n          --simple-colors-fixed-theme-lime-8: #4d7600;\n          --simple-colors-fixed-theme-lime-9: #3b5a00;\n          --simple-colors-fixed-theme-lime-10: #293f00;\n          --simple-colors-fixed-theme-lime-11: #223400;\n          --simple-colors-fixed-theme-lime-12: #182400;\n\n          --simple-colors-fixed-theme-yellow-1: #ffffd5;\n          --simple-colors-fixed-theme-yellow-2: #ffffac;\n          --simple-colors-fixed-theme-yellow-3: #ffff90;\n          --simple-colors-fixed-theme-yellow-4: #ffff7c;\n          --simple-colors-fixed-theme-yellow-5: #ffff3a;\n          --simple-colors-fixed-theme-yellow-6: #f6f600;\n          --simple-colors-fixed-theme-yellow-7: #929100;\n          --simple-colors-fixed-theme-yellow-8: #787700;\n          --simple-colors-fixed-theme-yellow-9: #585700;\n          --simple-colors-fixed-theme-yellow-10: #454400;\n          --simple-colors-fixed-theme-yellow-11: #303000;\n          --simple-colors-fixed-theme-yellow-12: #242400;\n\n          --simple-colors-fixed-theme-amber-1: #fff2d4;\n          --simple-colors-fixed-theme-amber-2: #ffdf92;\n          --simple-colors-fixed-theme-amber-3: #ffd677;\n          --simple-colors-fixed-theme-amber-4: #ffcf5e;\n          --simple-colors-fixed-theme-amber-5: #ffc235;\n          --simple-colors-fixed-theme-amber-6: #ffc500;\n          --simple-colors-fixed-theme-amber-7: #b28900;\n          --simple-colors-fixed-theme-amber-8: #876800;\n          --simple-colors-fixed-theme-amber-9: #614b00;\n          --simple-colors-fixed-theme-amber-10: #413200;\n          --simple-colors-fixed-theme-amber-11: #302500;\n          --simple-colors-fixed-theme-amber-12: #221a00;\n\n          --simple-colors-fixed-theme-orange-1: #ffebd7;\n          --simple-colors-fixed-theme-orange-2: #ffca92;\n          --simple-colors-fixed-theme-orange-3: #ffbd75;\n          --simple-colors-fixed-theme-orange-4: #ffb05c;\n          --simple-colors-fixed-theme-orange-5: #ff9e36;\n          --simple-colors-fixed-theme-orange-6: #ff9625;\n          --simple-colors-fixed-theme-orange-7: #e56a00;\n          --simple-colors-fixed-theme-orange-8: #ae5100;\n          --simple-colors-fixed-theme-orange-9: #833d00;\n          --simple-colors-fixed-theme-orange-10: #612d00;\n          --simple-colors-fixed-theme-orange-11: #3d1c00;\n          --simple-colors-fixed-theme-orange-12: #2c1400;\n\n          --simple-colors-fixed-theme-deep-orange-1: #ffe7e0;\n          --simple-colors-fixed-theme-deep-orange-2: #ffb299;\n          --simple-colors-fixed-theme-deep-orange-3: #ffa588;\n          --simple-colors-fixed-theme-deep-orange-4: #ff8a64;\n          --simple-colors-fixed-theme-deep-orange-5: #ff7649;\n          --simple-colors-fixed-theme-deep-orange-6: #ff6c3c;\n          --simple-colors-fixed-theme-deep-orange-7: #f53100;\n          --simple-colors-fixed-theme-deep-orange-8: #b92500;\n          --simple-colors-fixed-theme-deep-orange-9: #8a1c00;\n          --simple-colors-fixed-theme-deep-orange-10: #561100;\n          --simple-colors-fixed-theme-deep-orange-11: #3a0c00;\n          --simple-colors-fixed-theme-deep-orange-12: #240700;\n\n          --simple-colors-fixed-theme-brown-1: #f0e2de;\n          --simple-colors-fixed-theme-brown-2: #e5b8aa;\n          --simple-colors-fixed-theme-brown-3: #c59485;\n          --simple-colors-fixed-theme-brown-4: #b68373;\n          --simple-colors-fixed-theme-brown-5: #ac7868;\n          --simple-colors-fixed-theme-brown-6: #a47060;\n          --simple-colors-fixed-theme-brown-7: #85574a;\n          --simple-colors-fixed-theme-brown-8: #724539;\n          --simple-colors-fixed-theme-brown-9: #5b3328;\n          --simple-colors-fixed-theme-brown-10: #3b1e15;\n          --simple-colors-fixed-theme-brown-11: #2c140e;\n          --simple-colors-fixed-theme-brown-12: #200e09;\n\n          --simple-colors-fixed-theme-blue-grey-1: #e7eff1;\n          --simple-colors-fixed-theme-blue-grey-2: #b1c5ce;\n          --simple-colors-fixed-theme-blue-grey-3: #9badb6;\n          --simple-colors-fixed-theme-blue-grey-4: #8d9fa7;\n          --simple-colors-fixed-theme-blue-grey-5: #7a8f98;\n          --simple-colors-fixed-theme-blue-grey-6: #718892;\n          --simple-colors-fixed-theme-blue-grey-7: #56707c;\n          --simple-colors-fixed-theme-blue-grey-8: #40535b;\n          --simple-colors-fixed-theme-blue-grey-9: #2f3e45;\n          --simple-colors-fixed-theme-blue-grey-10: #1e282c;\n          --simple-colors-fixed-theme-blue-grey-11: #182023;\n          --simple-colors-fixed-theme-blue-grey-12: #0f1518;\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([""]);

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

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
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

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

window.SimpleColorsSharedStyles = {};
window.SimpleColorsSharedStyles.instance = null;

var SimpleColorsSharedStyles =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(SimpleColorsSharedStyles, _LitElement);

    _createClass(
      SimpleColorsSharedStyles,
      [
        {
          key: "render",
          // render function
          value: function render() {
            return (0, _litElement.html)(_templateObject());
          }, // properties available to the custom element for data binding
        },
      ],
      [
        {
          key: "styles",
          //styles function
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(
                _getPrototypeOf(SimpleColorsSharedStyles),
                "properties",
                this
              ),
              {
                /**
                 * The colors object.
                 * Each color contains an array of shades as hex codes from lightest to darkest.
                 */
                colors: {
                  attribute: "colors",
                  type: Object,
                },

                /**
        * Object with information on which color combinations are WCAG 2.0AA compliant, "eg": 
        {
        "greyColor": {          //if either the color or its contrast will be a grey
          "aaLarge": [          //if bold text >= 14pt, text >= 18pt, decorative only, or disabled
            {                 //for the first shade of a color
              "min": 7,         //index of the lightest contrasting shade of another color
              "max": 12         //index of the darkest contrasting shade of another color
            },
            ...
          ],
          "aa": [ ... ]         //if bold text < 14pt, or text < 18pt
        },
        "colorColor": { ... }   //if neither the color nor its contrast are grey
        }
        */
                contrasts: {
                  attribute: "contrasts",
                  type: Object,
                },
              }
            );
          },
        },
      ]
    );

    function SimpleColorsSharedStyles() {
      var _this;

      _classCallCheck(this, SimpleColorsSharedStyles);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleColorsSharedStyles).call(this)
      );
      _this.colors = {
        grey: [
          "#ffffff",
          "#eeeeee",
          "#dddddd",
          "#cccccc",
          "#bbbbbb",
          "#999999",
          "#666666",
          "#444444",
          "#333333",
          "#222222",
          "#111111",
          "#000000",
        ],
        red: [
          "#ffdddd",
          "#ffaeae",
          "#ff8f8f",
          "#ff7474",
          "#fd5151",
          "#ff2222",
          "#ee0000",
          "#ac0000",
          "#850000",
          "#670000",
          "#520000",
          "#3f0000",
        ],
        pink: [
          "#ffe6f1",
          "#ffa5cf",
          "#ff87c0",
          "#ff73b5",
          "#fd60aa",
          "#ff3996",
          "#da004e",
          "#b80042",
          "#980036",
          "#78002b",
          "#5a0020",
          "#440019",
        ],
        purple: [
          "#fce6ff",
          "#f4affd",
          "#f394ff",
          "#f07cff",
          "#ed61ff",
          "#e200ff",
          "#a500ba",
          "#8a009b",
          "#6c0079",
          "#490052",
          "#33003a",
          "#200025",
        ],
        "deep-purple": [
          "#f3e4ff",
          "#ddacff",
          "#c97eff",
          "#bb63f9",
          "#b44aff",
          "#a931ff",
          "#7e00d8",
          "#5d009f",
          "#4c0081",
          "#3a0063",
          "#2a0049",
          "#1d0033",
        ],
        indigo: [
          "#e5ddff",
          "#c3b2ff",
          "#af97ff",
          "#9e82ff",
          "#9373ff",
          "#835fff",
          "#3a00ff",
          "#2801b0",
          "#20008c",
          "#160063",
          "#100049",
          "#0a0030",
        ],
        blue: [
          "#e2ecff",
          "#acc9ff",
          "#95baff",
          "#74a5ff",
          "#5892fd",
          "#4083ff",
          "#0059ff",
          "#0041bb",
          "#003494",
          "#002569",
          "#001947",
          "#001333",
        ],
        "light-blue": [
          "#cde8ff",
          "#a1d1ff",
          "#92c9ff",
          "#65b3ff",
          "#58adff",
          "#41a1ff",
          "#007ffc",
          "#0066ca",
          "#0055a8",
          "#003f7d",
          "#002850",
          "#001b36",
        ],
        cyan: [
          "#ddf8ff",
          "#9beaff",
          "#77e2ff",
          "#33d4ff",
          "#1ccfff",
          "#00c9ff",
          "#009dc7",
          "#007999",
          "#005970",
          "#003f50",
          "#002c38",
          "#001a20",
        ],
        teal: [
          "#d9fff0",
          "#98ffd7",
          "#79ffcb",
          "#56ffbd",
          "#29ffac",
          "#00ff9c",
          "#009d75",
          "#007658",
          "#004e3a",
          "#003829",
          "#002a20",
          "#001b14",
        ],
        green: [
          "#e1ffeb",
          "#acffc9",
          "#79ffa7",
          "#49ff88",
          "#24ff70",
          "#00f961",
          "#008c37",
          "#00762e",
          "#005a23",
          "#003d18",
          "#002a11",
          "#001d0c",
        ],
        "light-green": [
          "#ebffdb",
          "#c7ff9b",
          "#b1ff75",
          "#a1fd5a",
          "#8efd38",
          "#6fff00",
          "#429d00",
          "#357f00",
          "#296100",
          "#1b3f00",
          "#143000",
          "#0d2000",
        ],
        lime: [
          "#f1ffd2",
          "#dfff9b",
          "#d4ff77",
          "#caff58",
          "#bdff2d",
          "#aeff00",
          "#649900",
          "#4d7600",
          "#3b5a00",
          "#293f00",
          "#223400",
          "#182400",
        ],
        yellow: [
          "#ffffd5",
          "#ffffac",
          "#ffff90",
          "#ffff7c",
          "#ffff3a",
          "#f6f600",
          "#929100",
          "#787700",
          "#585700",
          "#454400",
          "#303000",
          "#242400",
        ],
        amber: [
          "#fff2d4",
          "#ffdf92",
          "#ffd677",
          "#ffcf5e",
          "#ffc235",
          "#ffc500",
          "#b28900",
          "#876800",
          "#614b00",
          "#413200",
          "#302500",
          "#221a00",
        ],
        orange: [
          "#ffebd7",
          "#ffca92",
          "#ffbd75",
          "#ffb05c",
          "#ff9e36",
          "#ff9625",
          "#e56a00",
          "#ae5100",
          "#833d00",
          "#612d00",
          "#3d1c00",
          "#2c1400",
        ],
        "deep-orange": [
          "#ffe7e0",
          "#ffb299",
          "#ffa588",
          "#ff8a64",
          "#ff7649",
          "#ff6c3c",
          "#f53100",
          "#b92500",
          "#8a1c00",
          "#561100",
          "#3a0c00",
          "#240700",
        ],
        brown: [
          "#f0e2de",
          "#e5b8aa",
          "#c59485",
          "#b68373",
          "#ac7868",
          "#a47060",
          "#85574a",
          "#724539",
          "#5b3328",
          "#3b1e15",
          "#2c140e",
          "#200e09",
        ],
        "blue-grey": [
          "#e7eff1",
          "#b1c5ce",
          "#9badb6",
          "#8d9fa7",
          "#7a8f98",
          "#718892",
          "#56707c",
          "#40535b",
          "#2f3e45",
          "#1e282c",
          "#182023",
          "#0f1518",
        ],
      };
      _this.contrasts = {
        greyColor: {
          aaLarge: [
            {
              min: 7,
              max: 12,
            },
            {
              min: 7,
              max: 12,
            },
            {
              min: 7,
              max: 12,
            },
            {
              min: 7,
              max: 12,
            },
            {
              min: 8,
              max: 12,
            },
            {
              min: 10,
              max: 12,
            },
            {
              min: 1,
              max: 3,
            },
            {
              min: 1,
              max: 5,
            },
            {
              min: 1,
              max: 6,
            },
            {
              min: 1,
              max: 6,
            },
            {
              min: 1,
              max: 6,
            },
            {
              min: 1,
              max: 6,
            },
          ],
          aa: [
            //if bold text < 14pt, or text < 18pt
            {
              min: 7,
              max: 12,
            },
            {
              min: 7,
              max: 12,
            },
            {
              min: 7,
              max: 12,
            },
            {
              min: 8,
              max: 12,
            },
            {
              min: 8,
              max: 12,
            },
            {
              min: 11,
              max: 12,
            },
            {
              min: 1,
              max: 2,
            },
            {
              min: 1,
              max: 7,
            },
            {
              min: 1,
              max: 7,
            },
            {
              min: 1,
              max: 6,
            },
            {
              min: 1,
              max: 6,
            },
            {
              min: 1,
              max: 6,
            },
          ],
        },
        colorColor: {
          //if neither the color nor its contrast are grey
          aaLarge: [
            {
              min: 7,
              max: 12,
            },
            {
              min: 7,
              max: 12,
            },
            {
              min: 8,
              max: 12,
            },
            {
              min: 9,
              max: 12,
            },
            {
              min: 10,
              max: 12,
            },
            {
              min: 11,
              max: 12,
            },
            {
              min: 1,
              max: 2,
            },
            {
              min: 1,
              max: 3,
            },
            {
              min: 1,
              max: 4,
            },
            {
              min: 1,
              max: 5,
            },
            {
              min: 1,
              max: 6,
            },
            {
              min: 1,
              max: 6,
            },
          ],
          aa: [
            {
              min: 8,
              max: 12,
            },
            {
              min: 8,
              max: 12,
            },
            {
              min: 9,
              max: 12,
            },
            {
              min: 9,
              max: 12,
            },
            {
              min: 11,
              max: 12,
            },
            {
              min: 12,
              max: 12,
            },
            {
              min: 1,
              max: 1,
            },
            {
              min: 1,
              max: 2,
            },
            {
              min: 1,
              max: 4,
            },
            {
              min: 1,
              max: 4,
            },
            {
              min: 1,
              max: 5,
            },
            {
              min: 1,
              max: 5,
            },
          ],
        },
      };
      return _this;
    }
    /**
     * Store the tag name to make it easier to obtain directly.
     */

    _createClass(
      SimpleColorsSharedStyles,
      [
        {
          key: "getColorInfo",

          /**
           * gets the color information of a given CSS variable or class
           *
           * @param {string} the CSS variable (eg. `--simple-colors-fixed-theme-red-3`)
           * @param {object} an object that includes the theme, color, and shade information
           */
          value: function getColorInfo(colorName) {
            var temp1 = colorName
                .replace(/(simple-colors-)?(-text)?(-border)?/g, "")
                .split("-theme-"),
              theme = temp1.length > 0 ? temp1[0] : "default",
              temp2 =
                temp1.length > 0 ? temp1[1].split("-") : temp1[0].split("-"),
              color =
                temp2.length > 1
                  ? temp2.slice(1, temp2.length - 1).join("-")
                  : "grey",
              shade = temp2.length > 1 ? temp2[temp2.length - 1] : "1";
            return {
              theme: theme,
              color: color,
              shade: shade,
            };
          },
          /**
           * returns a variable based on color name, shade, and fixed theme
           *
           * @param {string} the color name
           * @param {number} the color shade
           * @param {boolean} the color shade
           * @returns {string} the CSS Variable
           */
        },
        {
          key: "makeVariable",
          value: function makeVariable() {
            var color =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : "grey";
            var shade =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : 1;
            var theme =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : "default";
            return ["--simple-colors", theme, "theme", color, shade].join("-");
          },
          /**
           * for large or small text given a color and its shade,
           * lists all the shades of another color that would be
           * WCAG 2.0 AA-compliant for contrast
           *
           * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
           * @param {string} color name, e.g. "deep-purple"
           * @param {string} color shade, e.g. 3
           * @param {string} contrasting color name, e.g. "grey"
           * @param {array} all of the WCAG 2.0 AA-compliant shades of the contrasting color
           */
        },
        {
          key: "getContrastingShades",
          value: function getContrastingShades(
            isLarge,
            colorName,
            colorShade,
            contrastName
          ) {
            var hasGrey =
                colorName === "grey" || contrastName === "grey"
                  ? "greyColor"
                  : "colorColor",
              aa = isLarge ? "aaLarge" : "aa",
              index = parseInt(colorShade),
              range = this.contrasts[hasGrey][aa][index];
            return Array(range.max - range.min + 1)
              .fill()
              .map(function (_, idx) {
                return range.min + idx;
              });
          },
          /**
           * for large or small text given a color and its shade,
           * lists all the colors and shades that would be
           * WCAG 2.0 AA-compliant for contrast
           *
           * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
           * @param {string} color name, e.g. "deep-purple"
           * @param {string} color shade, e.g. 3
           * @param {object} all of the WCAG 2.0 AA-compliant colors and shades
           */
        },
        {
          key: "getContrastingColors",
          value: function getContrastingColors(colorName, colorShade, isLarge) {
            var _this2 = this;

            var result = {};
            Object.keys(this.colors).forEach(function (color) {
              result[color] = _this2.getContrastingShades(
                isLarge,
                colorName,
                colorShade,
                color
              );
            });
            return result.color;
          },
          /**
           * determines if two shades are WCAG 2.0 AA-compliant for contrast
           *
           * @param {boolean} large text? >= 18pt || (bold && >= 14pt)
           * @param {string} color name, e.g. "deep-purple"
           * @param {string} color shade, e.g. 3
           * @param {string} contrasting color name, e.g. "grey"
           * @param {string} contrast shade, e.g. 12
           * @param {boolean} whether or not the contrasting shade is WCAG 2.0 AA-compliant
           */
        },
        {
          key: "isContrastCompliant",
          value: function isContrastCompliant(
            isLarge,
            colorName,
            colorShade,
            contrastName,
            contrastShade
          ) {
            var hasGrey =
                colorName === "grey" || contrastName === "grey"
                  ? "greyColor"
                  : "colorColor",
              aa = isLarge ? "aaLarge" : "aa",
              index = parseInt(colorShade) + 1,
              range = this.contrasts[hasGrey][aa][index];
            return contrastShade >= range.min && ontrastShade >= range.max;
          },
          /**
           * gets the current shade based on the index
           *
           * @param {string} the index
           * @param {number} the shade
           */
        },
        {
          key: "indexToShade",
          value: function indexToShade(index) {
            return parseInt(index) + 1;
          },
          /**
           * gets the current shade based on the index
           *
           * @param {string} the shade
           * @param {number} the index
           */
        },
        {
          key: "shadeToIndex",
          value: function shadeToIndex(shade) {
            return parseInt(shade) - 1;
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "simple-colors-shared-styles";
          },
        },
      ]
    );

    return SimpleColorsSharedStyles;
  })(_litElement.LitElement);

exports.SimpleColorsSharedStyles = SimpleColorsSharedStyles;
window.customElements.define(
  SimpleColorsSharedStyles.tag,
  SimpleColorsSharedStyles
);

/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.SimpleColorsSharedStyles.requestAvailability = function () {
  if (window.SimpleColorsSharedStyles.instance == null) {
    window.SimpleColorsSharedStyles.instance = document.createElement(
      "simple-colors-shared-styles"
    );
    window.SimpleColorsSharedStyles.colors =
      window.SimpleColorsSharedStyles.instance.colors;
    window.SimpleColorsSharedStyles.contrasts =
      window.SimpleColorsSharedStyles.instance.contrasts;
    window.SimpleColorsSharedStyles.stylesheet = document.createElement(
      "style"
    );
    window.SimpleColorsSharedStyles.stylesheet.innerHTML = "".concat(
      SimpleColorsSharedStyles.styles[0].cssText
    );
    document.head.appendChild(window.SimpleColorsSharedStyles.stylesheet);
  }

  return window.SimpleColorsSharedStyles.instance;
};

var SimpleColorsSharedStylesGlobal = window.SimpleColorsSharedStyles.requestAvailability();
exports.SimpleColorsSharedStylesGlobal = SimpleColorsSharedStylesGlobal;
