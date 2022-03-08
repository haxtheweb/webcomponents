"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndUserDoc = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-fields/lib/simple-fields-field.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject37() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          display: block;\n          color: #444;\n          font-weight: 300;\n          font-family: sans-serif;\n        }\n        :host([hidden]) {\n          display: none;\n        }\n        :host([hidden]),\n        [hidden] {\n          display: none!important;\n        }\n        h1,h2,h3,h4,h5,h6,caption {\n        font-family: serif;\n        }\n        ol[part=upper-roman]{\n          list-style: upper-roman;\n        }\n        ol[part=upper-alpha]{\n          list-style: upper-alpha;\n        }\n        ol[part=lower-alpha]{\n          list-style: lower-alpha;\n        }\n        ol[part=lower-roman]{\n          list-style: lower-roman;\n        }\n        table {\n        border-collapse: collapse;\n        }\n        caption {\n          color: #000; \n          text-align: left;\n          font-weight: bold;\n        }\n        th {\n          font-weight: 400;\n        }\n        th,td {\n          border: 1px solid #999;\n          padding: 2px 5px;\n        }\n        thead tr {\n          background-color: #f0f0f0;\n          color: #000; \n        }\n        tbody tr:nth-child(2n+1){\n          background-color: #f8f8f8;\n        }\n        figure {\n        display: inline-flex;\n        width: min-content;\n        flex-direction: column;\n        }\n        figcaption {\n          font-size: 85%;\n        }\n        img[part=image] {\n          display: block;\n        }\n        table, \n        figure, \n        img[part=image], \n        p, \n        ol {\n        margin: 1em 0;\n        }\n        li > ol {\n        margin: 0.25em 0 0.5em;\n        }\n        img[part=image],figure,table {\n          max-width: 100%;\n        }\n        table:first-child, \n        figure:first-child, \n        img[part=image]:first-child,\n        p:first-child, \n        ol:first-child {\n        margin-top: 0 ;\n        }\n        table:last-child, \n        figure:last-child, \n        img[part=image]:last-child,\n        p:last-child, \n        ol:last-child, \n        li:last-child > ol {\n        margin-bottom: 0;\n        }\n        li > ol:last-child {\n        margin-bottom: 0.5em;\n        }\n        p[part=navback] {\n          display: inline-block;\n        }\n        ul[part=\"breadcrumbs\"]{\n          list-style: none;\n          padding-inline-start: 0;\n          display: flex;\n          font-size: 85%;\n        }\n        li[part=\"breadcrumb\"]{\n          display: inline;\n        }\n        li[part=\"breadcrumb\"]:before {\n          content: '>';\n          color: #444;\n          text-decoration: none;\n          padding: 0 0.5em;\n        }\n        li[part=\"breadcrumb\"]:first-child:before {\n          content: '';\n          padding: 0;\n        }\n        button[part=navbutton] {\n          display: inline;\n          color: #444;\n          font-weight: 300;\n          font-family: sans-serif;\n          font-size: inherit;\n          border: none;\n          text-decoration: underline;\n          color: blue;\n          background-color: transparent;\n          padding: 0;\n        }\n        ul[part=preview] button[part=navbutton]:after {\n          content: ': ';\n        }\n        li[part=\"breadcrumb\"] button[part=navbutton] {\n          display: inline;\n          margin: 0;\n        }\n        #skipNavLink {\n          position: absolute;\n          left: -99999px;\n          height: 0;\n          width: 0;\n          overflow: hidden;\n        }\n        div[part=search]{\n          text-align: right;\n        }\n        div[part=search]+h1{\n          margin-top: 0px;\n        }\n        simple-fields-field[part=searchfield]{\n          text-align: left;\n        }\n        simple-fields-field[part=searchfield]:not([value]),\n        simple-fields-field[part=searchfield][value=''] {\n          --simple-fields-border-bottom-size: 0px;\n          --simple-fields-border-bottom-focus-size: 0px;\n        }\n        simple-fields-field[part=searchfield]:focus-within,\n        simple-fields-field[part=searchfield]:hover {\n          --simple-fields-border-bottom-size: 1px;\n          --simple-fields-border-bottom-focus-size: 1px;\n        }\n        simple-fields-field[part=searchfield]:not([value]),\n        simple-fields-field[part=searchfield][value=''] {\n          display: inline-block;\n          width:40px;\n          transition: 0.5s ease-in-out width;\n        }\n        simple-fields-field[part=searchfield],\n        simple-fields-field[part=searchfield]:focus-within,\n        simple-fields-field[part=searchfield]:hover {\n          width:100%;\n          transition: 0.5s ease-in-out width;\n        }\n        simple-fields-field[part=searchfield]:not([value])::part(option-input),\n        simple-fields-field[part=searchfield][value='']::part(option-input){\n          width:0px;\n        }\n        simple-fields-field[part=searchfield]::part(option-input):focus-within,\n        simple-fields-field[part=searchfield]::part(option-input):hover{\n          width:calc(100% - 4px);\n        }\n        simple-fields-field[part=searchfield]:not([value]) simple-icon-button-lite[part=cancelsearch],\n        simple-fields-field[part=searchfield][value=''] simple-icon-button-lite[part=cancelsearch]{\n          display: none;\n        }\n        simple-fields-field[part=searchfield]:focus-within simple-icon-button-lite[part=cancelsearch],\n        simple-fields-field[part=searchfield]:hover simple-icon-button-lite[part=cancelsearch]{\n          display: block;\n        }\n      "]);

  _templateObject37 = function _templateObject37() {
    return data;
  };

  return data;
}

function _templateObject36() {
  var data = _taggedTemplateLiteral(["<p>Overview of this feature</p>"]);

  _templateObject36 = function _templateObject36() {
    return data;
  };

  return data;
}

function _templateObject35() {
  var data = _taggedTemplateLiteral(["<kbd>ctrl+x</kbd>"]);

  _templateObject35 = function _templateObject35() {
    return data;
  };

  return data;
}

function _templateObject34() {
  var data = _taggedTemplateLiteral(["<kbd>ctrl+x</kbd>"]);

  _templateObject34 = function _templateObject34() {
    return data;
  };

  return data;
}

function _templateObject33() {
  var data = _taggedTemplateLiteral(["<kbd>ctrl+x</kbd>"]);

  _templateObject33 = function _templateObject33() {
    return data;
  };

  return data;
}

function _templateObject32() {
  var data = _taggedTemplateLiteral(["<p>Welcome!</p>"]);

  _templateObject32 = function _templateObject32() {
    return data;
  };

  return data;
}

function _templateObject31() {
  var data = _taggedTemplateLiteral(["<a id=\"", "\"></a>"]);

  _templateObject31 = function _templateObject31() {
    return data;
  };

  return data;
}

function _templateObject30() {
  var data = _taggedTemplateLiteral(["<h6 id=\"", "\" part=\"section-heading\">", "</h6>"]);

  _templateObject30 = function _templateObject30() {
    return data;
  };

  return data;
}

function _templateObject29() {
  var data = _taggedTemplateLiteral(["<h5 id=\"", "\" part=\"section-heading\">", "</h5>"]);

  _templateObject29 = function _templateObject29() {
    return data;
  };

  return data;
}

function _templateObject28() {
  var data = _taggedTemplateLiteral(["<h4 id=\"", "\" part=\"section-heading\">", "</h4>"]);

  _templateObject28 = function _templateObject28() {
    return data;
  };

  return data;
}

function _templateObject27() {
  var data = _taggedTemplateLiteral(["<h3 id=\"", "\" part=\"section-heading\">", "</h3>"]);

  _templateObject27 = function _templateObject27() {
    return data;
  };

  return data;
}

function _templateObject26() {
  var data = _taggedTemplateLiteral(["<h2 id=\"", "\" part=\"section-heading\">", "</h2>"]);

  _templateObject26 = function _templateObject26() {
    return data;
  };

  return data;
}

function _templateObject25() {
  var data = _taggedTemplateLiteral(["<h1 id=\"", "\" part=\"section-heading\">", "</h1>"]);

  _templateObject25 = function _templateObject25() {
    return data;
  };

  return data;
}

function _templateObject24() {
  var data = _taggedTemplateLiteral(["<li>\n            ", "\n            ", "\n          </li>"]);

  _templateObject24 = function _templateObject24() {
    return data;
  };

  return data;
}

function _templateObject23() {
  var data = _taggedTemplateLiteral(["\n      <ol part=\"", "\">\n        ", "\n      </ol>\n    "]);

  _templateObject23 = function _templateObject23() {
    return data;
  };

  return data;
}

function _templateObject22() {
  var data = _taggedTemplateLiteral(["<td>", "</td>"]);

  _templateObject22 = function _templateObject22() {
    return data;
  };

  return data;
}

function _templateObject21() {
  var data = _taggedTemplateLiteral(["\n              <tr>", "</tr>\n            "]);

  _templateObject21 = function _templateObject21() {
    return data;
  };

  return data;
}

function _templateObject20() {
  var data = _taggedTemplateLiteral(["\n            <tbody>\n              ", "\n        </tbody>\n          "]);

  _templateObject20 = function _templateObject20() {
    return data;
  };

  return data;
}

function _templateObject19() {
  var data = _taggedTemplateLiteral(["<th scope=\"col\">", "</th>"]);

  _templateObject19 = function _templateObject19() {
    return data;
  };

  return data;
}

function _templateObject18() {
  var data = _taggedTemplateLiteral(["\n            <thead>\n              <tr>", "</tr>\n            </thead>\n          "]);

  _templateObject18 = function _templateObject18() {
    return data;
  };

  return data;
}

function _templateObject17() {
  var data = _taggedTemplateLiteral(["<caption id=\"", "\">", "</caption>"]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  var data = _taggedTemplateLiteral(["\n      <table part=\"cheatsheet\">\n        ", "\n        ", "\n        ", "\n      </table>\n    "]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = _taggedTemplateLiteral(["\n          <div>\n            <figure part=\"figure\">\n              ", "\n              <figcaption>", "</figcaption>\n            </figure>\n          </div>\n        "]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = _taggedTemplateLiteral(["<img \n      part=\"", "\" \n      alt=\"", "\" \n      src=\"", "\" \n      .srcset=\"", "\"\n      .sizes=\"", "\"\n      loading=\"lazy\">"]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = _taggedTemplateLiteral(["\n            <li>\n              <button id=\"link-", "\" part=\"navbutton\" @click=\"", "\">", "</button>\n              ", "\n            </li>\n          "]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = _taggedTemplateLiteral(["\n        <ul part=\"", "\">\n          ", "\n        </ul>"]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["<div>", "</div>"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["\n      ", "\n      ", "\n    "]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n                  <li part=\"breadcrumb\">\n                    <button \n                      part=\"navbutton\" \n                      @click=\"", "\">\n                      ", "\n                    </button>\n                  </li>"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["<li part=\"breadcrumb\" aria-current=\"page\">", "</li>"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n          <a id=\"skipNavLink\" href=\"#", "\">\n            ", "\n          </a>\n          <nav aria-label=\"", "\">\n            <ul part=\"breadcrumbs\">\n              ", "\n            </ul>\n          </nav>\n        "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n      ", "\n  "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n          ", "\n          ", "\n        "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n        <div part=\"search\" ?hidden=", ">\n          <simple-fields-field\n            id=\"searchfield\"\n            part=\"searchfield\"\n            label=\"", "\"\n            .value=\"", "\"\n            @value-changed=\"", "\"\n          >\n            <simple-icon-lite part=\"searchicon\" icon=\"icons:search\" slot=\"prefix\"></simple-icon-lite>\n            <simple-icon-button-lite part=\"cancelsearch\" icon=\"icons:close\" slot=\"suffix\" @click=\"", "\"></simple-icon-button-lite>\n          </simple-fields-field>\n        </div>\n      "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      ", "\n      ", "\n      \n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * `end-user-doc`
 * `given an array of feature documentation, will generate end user documentation (good for modular, customizable tools where documentation whould be based on what is enabled or added on)`
 * @demo demo/index.html overview
 * @demo demo/demo.html demo-mode
 * @demo demo/display.html display-mode
 * @demo demo/search.html search
 * @demo demo/schema.html schema
 * @element end-user-doc
 */
var EndUserDoc =
/*#__PURE__*/
function (_LitElement) {
  _inherits(EndUserDoc, _LitElement);

  _createClass(EndUserDoc, [{
    key: "appendToSection",

    /**
     * adds new content at beginiing of section with given id
     * @param {object} schema schema of content to be added
     * @param {string} sectionId section id where content will be appended 
     * @returns {boolean} whether successful
     */
    value: function appendToSection(schema, sectionId) {
      return this.insertIntoSection(schema, sectionId);
    }
    /**
     * 
     * adds new content at end of section with given id
     * @param {object} schema schema of content to be added
     * @param {string} sectionId section id where content will be prepended 
     * @returns {boolean} whether successful
     */

  }, {
    key: "prependToSection",
    value: function prependToSection(schema, sectionId) {
      return this.insertIntoSection(schema, sectionId, 0);
    }
    /**
     * 
     * inserts content before a sibling with given id
     * @param {object} schema schema of content to be added
     * @param {string} siblingId sibling id of before which content will be inserted
     * @returns {boolean} whether successful
     */

  }, {
    key: "insertIntoSectionBefore",
    value: function insertIntoSectionBefore(schema, siblingId) {
      var section = siblingId && this.parentByContentId[siblingId] ? this.parentByContentId[siblingId] : undefined,
          index = this._getContentIndexById(siblingId, section);

      return index < 0 ? false : this.insertIntoSection(schema, section.id, index);
    }
    /**
     * inserts content after a sibling with given id
     * @param {object} schema schema of content to be added
     * @param {string} siblingId sibling id of after which content will be inserted
     * @returns {boolean} whether successful
     */

  }, {
    key: "insertIntoSectionAfter",
    value: function insertIntoSectionAfter(schema, siblingId) {
      var section = siblingId && this.parentByContentId[siblingId] ? this.parentByContentId[siblingId] : undefined,
          index = this._getContentIndexById(siblingId, section);

      return index < 0 ? false : this.insertIntoSection(schema, section.id, index + 1);
    }
    /**
     * 
     * replaces content of a given in a section with given id
     * @param {object} schema schema of content to be added
     * @param {string} replaceId sibling id of after which content will be inserted
     * @returns {boolean} whether successful
     */

  }, {
    key: "replaceSectionContent",
    value: function replaceSectionContent(schema, replaceId) {
      var section = replaceId && this.parentByContentId[replaceId] ? this.parentByContentId[replaceId] : undefined,
          index = this._getContentIndexById(replaceId, section);

      return index < 0 ? false : this.insertIntoSection(schema, section.id, index, true);
    }
    /**
     * removes content with a given Id
     * @param {string} id id of content to remove
     * @returns {boolean} whether successful
     */

  }, {
    key: "removeSectionContent",
    value: function removeSectionContent(id) {
      var section = id && this.parentByContentId[id] ? this.parentByContentId[id] : undefined,
          index = this._getContentIndexById(id, section);

      return index < 0 ? false : this.insertIntoSection([], section.id, index, true);
    }
    /**
     * 
     * adds new content into section with given id at a given index
     * @param {object} schema schema of content to be added
     * @param {*} sectionId id of section where section content will be inserted
     * @param {*} index index where section content will be inserted
     * @param {boolean} replace if given, replaces idem currently at index
     * @returns {boolean} whether successful
     */

  }, {
    key: "insertIntoSection",
    value: function insertIntoSection(schema, sectionId, index) {
      var replace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      if (!schema) return false;
      var section = sectionId && this.contentsById[sectionId] ? this.contentsById[sectionId] : undefined;
      var sectionContents = section && section.id && section.contents ? _toConsumableArray(section.contents) : undefined;
      var replaceItems = replace ? 1 : 0;
      if (!sectionContents) return false;
      if (_typeof(index) == (typeof undefined === "undefined" ? "undefined" : _typeof(undefined)) || index > sectionContents.length) index = sectionContents.length;

      if (Array.isArray(schema)) {
        sectionContents.splice.apply(sectionContents, [index, replaceItems].concat(_toConsumableArray(schema)));
      } else {
        sectionContents.splice(index, replaceItems, schema);
      }

      this.contentsById[sectionId].contents = _toConsumableArray(sectionContents);
      this.requestUpdate();
      return true;
    }
    /**
     * index of where content appears in section
     * @param {string} id unique Id of content
     * @param {object} section section that contains content
     * @returns {number} 
     */

  }, {
    key: "_getContentIndexById",
    value: function _getContentIndexById(id, section) {
      var parentContents = section && section.id && section.contents ? (section.contents || []).map(function (section) {
        return section.id;
      }) : undefined;
      return parentContents.indexOf(id);
    }
    /**
     * adds cheat to end of a cheat sheet
     * @param {array} cheat array of row info for a cheat on cheatsheet table
     * @param {string} sheetId id of cheatsheet where cheat row will be inserted
     * @returns {boolean} whether successful
     */

  }, {
    key: "appendCheat",
    value: function appendCheat(cheat, sheetId) {
      if (!cheat || !Array.isArray(cheat) || cheat.length < 1) return false;
      return this.insertCheatAt(cheat, sheetId);
    }
    /**
     * adds cheat to beginning of a cheat sheet
     * @param {array} cheat array of row info for a cheat on cheatsheet table
     * @param {string} sheetId id of cheatsheet where cheat row will be inserted
     * @returns {boolean} whether successful
     */

  }, {
    key: "prependCheat",
    value: function prependCheat(cheat, sheetId) {
      if (!cheat || !Array.isArray(cheat) || cheat.length < 1) return false;
      return this.insertCheatAt(cheat, sheetId, 0);
    }
    /**
     * adds cheat to a sheet with given id before a given sibling
     * @param {array} cheat array of row info for a cheat on cheatsheet table
     * @param {array} sibling array of row info for a reference cheat next to the one to be inserted
     * @param {string} sheetId id of cheatsheet where cheat row will be inserted
     * @returns {boolean} whether successful
     */

  }, {
    key: "insertCheatBefore",
    value: function insertCheatBefore(cheat, sibling, sheetId) {
      if (!cheat || !Array.isArray(cheat) || cheat.length < 1) return false;

      var index = this._getCheatIndexById(sibling, sheetId);

      return index && this.insertCheatAt(cheat, sheetId, index);
    }
    /**
     * adds cheat to a sheet with given id after a given sibling
     * @param {array} cheat array of row info for a cheat on cheatsheet table
     * @param {array} sibling array of row info for a reference cheat next to the one to be inserted
     * @param {string} sheetId id of cheatsheet where cheat row will be inserted
     * @returns {boolean} whether successful
     */

  }, {
    key: "insertCheatAfter",
    value: function insertCheatAfter(cheat, sibling, sheetId) {
      if (!cheat || !Array.isArray(cheat) || cheat.length < 1) return false;

      var index = this._getCheatIndexById(sibling, sheetId);

      return index && this.insertCheatAt(cheat, sheetId, index + 1);
    }
    /**
     * 
     * replaces cheat on a sheet with given id
     * @param {array} newCheat array of row info for a cheat on cheatsheet table
     * @param {array} oldCheat array of row info for a cheat to replace on cheatsheet table
     * @param {string} sheetId id of cheatsheet where cheat row will be inserted
     * @returns {boolean} whether successful
     */

  }, {
    key: "replaceCheat",
    value: function replaceCheat(newCheat, _replaceCheat, sheetId) {
      if (!newCheat || !Array.isArray(newCheat) || newCheat.length < 1) return false;

      var index = this._getCheatIndexById(_replaceCheat, sheetId, true);

      return index && this.insertCheatAt(newCheat, sheetId, index, true);
    }
    /**
     * adds cheat to a sheet with given id at a given index
     * @param {array} cheat array of row info for a cheat on cheatsheet table
     * @param {string} sheetId id of cheatsheet where cheat row will be inserted
     * @param {number} index index where cheat will be inserted
     * @param {boolean} replace if given, replaces idem currently at index
     * @returns {boolean} whether successful
     */

  }, {
    key: "insertCheatAt",
    value: function insertCheatAt(cheat, sheetId, index) {
      var replace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var rows = this._getRowsBySheetId(sheetId),
          replaceItems = replace ? 1 : 0;

      if (!rows) return false;
      if (_typeof(index) == (typeof undefined === "undefined" ? "undefined" : _typeof(undefined)) || index > rows.length) index = rows.length;

      if (cheat.length == 0 || cheat[0] && Array.isArray(cheat[0])) {
        rows.splice.apply(rows, [index, replaceItems].concat(_toConsumableArray(cheat)));
      } else {
        rows.splice(index, replaceItems, cheat);
      }

      this.requestUpdate();
      return true;
    }
    /**
     * removes a given cheat from cheatsheet with a given Id
     * @param {array} cheat array of row info for a cheat on cheatsheet table
     * @param {string} sheetId id of cheatsheet where cheat row will be removed
     * @returns {boolean} whether successful
     */

  }, {
    key: "removeCheat",
    value: function removeCheat(cheat, sheetId) {
      var index = this._getCheatIndexById(cheat, sheetId, true);

      return index && this.insertCheatAt([], sheetId, index, true);
    }
    /**
     * gets cheatsheet rows array if given cheatsheet id
     * @param {string} id unique Id of cheatsheet
     * @returns {array}
     */

  }, {
    key: "_getRowsBySheetId",
    value: function _getRowsBySheetId(id) {
      var sheet = id && this.contentsById[id] && this.contentsById[id].cheatsheet ? this.contentsById[id].cheatsheet : undefined;
      return sheet && sheet.rows && Array.isArray(sheet.rows) ? sheet.rows : undefined;
    }
    /**
     * index of where cheat appears in cheatsheet
     * @param {object} section section that contains content
     * @param {string} id unique Id of cheatsheet
     * @param {boolean} stringMatch index of doesn't have to be the exact item from the array
     * @returns {number} 
     */

  }, {
    key: "_getCheatIndexById",
    value: function _getCheatIndexById(cheat, id) {
      var stringMatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var rows = this._getRowsBySheetId(id),
          findIndex = rows && cheat,
          matchedString = findIndex && rows.map(function (item) {
        return JSON.stringify(item);
      }).indexOf(JSON.stringify(cheat)) ? rows.map(function (item) {
        return JSON.stringify(item);
      }).indexOf(JSON.stringify(cheat)) : undefined;

      return matchedString ? matchedString : findIndex && rows.indexOf(cheat) > -1 ? rows.indexOf(cheat) : undefined;
    } // Template return function

  }, {
    key: "render",
    value: function render() {
      var section = this.currentSection && this.contentsById[this.currentSection];
      return (0, _litElement.html)(_templateObject(), !this.searchable ? '' : (0, _litElement.html)(_templateObject2(), section, this.searchLabel, this.searchText || '', this._handleSearch, this._handleSearchCancel), !!this.searchResults && !section ? this._links(this.searchResults, true) : (0, _litElement.html)(_templateObject3(), !this.currentSection || !section || this.hideBreadcrumbs ? '' : this._breadcrumb(), this._content(this.renderedSection, 0)));
    }
  }, {
    key: "_handleSearchCancel",
    value: function _handleSearchCancel(e) {
      this.searchText = '';
      this.__searchResults = undefined;
    }
  }, {
    key: "_handleSearch",
    value: function _handleSearch(e) {
      this.searchText = e.detail.value || '';
      var target = this.demoMode ? this.demoContents : this.contents;

      if (!this.searchText || this.searchText == '') {
        this.__searchResults = undefined;
        return;
      }

      this.__searchResults = {};

      var score = this._searchSection(target, this.searchText);

      if (score) this.__searchResults[target.id] = score;
    }
  }, {
    key: "_searchSection",
    value: function _searchSection(section, search) {
      var _this = this;

      var score = 0;
      if (!section || !section.id) return false;
      score += this._searchScore(section.title, search, 1000, 100);
      score += this._searchScore(section.searchTerms, search, 1000, 100);

      if (section.contents) {
        var content = (0, _litElement.html)(_templateObject4(), section.contents.filter(function (item) {
          return !item.contents;
        }).map(function (item) {
          return _this._content(item, 1);
        }));
        score += this._searchContent(content, search, 100, 10);
        section.contents.forEach(function (item) {
          if (!item.id) return;

          var score2 = _this._searchSection(item, search);

          if (score2) _this.__searchResults[item.id] = score2;
        });
      }

      if (section.cheatsheet) score += this._searchContent(this._cheatsheet(section), search, 100, 10);
      if (section.steps) score += this._searchContent(this._steps(section), search, 100, 10);
      return score;
    }
  }, {
    key: "_searchContent",
    value: function _searchContent() {
      var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var search = arguments.length > 1 ? arguments[1] : undefined;
      var exactScore = arguments.length > 2 ? arguments[2] : undefined;
      var termScore = arguments.length > 3 ? arguments[3] : undefined;
      var temp = document.createElement("div");
      (0, _litElement.render)(content, temp);
      return this._searchScore(temp.textContent, search, exactScore, termScore);
    }
  }, {
    key: "_searchScore",
    value: function _searchScore(content, search, exactScore, termScore) {
      var score = 0,
          contentLC = content && content.toLowerCase ? content.toLowerCase() : undefined,
          searchLC = search && search.toLowerCase ? search.toLowerCase() : undefined,
          terms = searchLC ? searchLC.split('\W') : [];
      if (!searchLC || !contentLC) return 0;

      if (contentLC.match(searchLC)) {
        score += exactScore;
      }

      terms.forEach(function (term) {
        if (contentLC.match(term)) score += termScore;
      });
      return score;
    }
    /**
     * gets breadcrumbs
     * @returns {object} html
     */

  }, {
    key: "_breadcrumb",
    value: function _breadcrumb() {
      var _this2 = this;

      var breadcrumbs = [],
          target = this.currentSection && this.contentsById[this.currentSection] ? this.contentsById[this.currentSection] : undefined;
      if (!!target) breadcrumbs.push(target);

      while (!!target) {
        var parent = this.parentByContentId[target.id];
        if (!!parent) breadcrumbs.push(parent);
        target = parent;
      }

      return (0, _litElement.html)(_templateObject5(), !this.currentSection || !this.contentsById[this.currentSection] || breadcrumbs.length < 1 ? '' : (0, _litElement.html)(_templateObject6(), !this.currentSection || !this.contentsById[this.currentSection] ? this.contents.id : this.contentsById[this.currentSection].id, this.skipNavLabel || "Skip ".concat(this.breadcrumbsLabel || 'Breadcrumbs'), this.breadcrumbsLabel || 'Breadcrumbs', breadcrumbs.reverse().map(function (breadcrumb, index) {
        return index == breadcrumbs.length - 1 ? (0, _litElement.html)(_templateObject7(), breadcrumb.title) : (0, _litElement.html)(_templateObject8(), function (e) {
          return _this2.currentSection = index < 1 ? undefined : breadcrumb.id;
        }, breadcrumb.title);
      })));
    }
    /**
     * determins if an item is lit html
     * @param {object} item 
     * @returns {boolean}
     */

  }, {
    key: "_isHTML",
    value: function _isHTML(item) {
      return !!item && _typeof(item) == "object" && item["_$litType$"] && item["_$litType$"] == 1;
    }
    /**
     * renders section
     * @param {object} section schema for a section
     * @param {number} level heading level
     * @returns {object} html
     */

  }, {
    key: "_section",
    value: function _section() {
      var section = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return (0, _litElement.html)(_templateObject9(), this._heading(section, level), this._body(section, level));
    }
    /**
     * renders section body content, including any subsections
     * @param {array} section schema for a section contents
     * @param {number} level heading level
     * @returns {object} 
     */

  }, {
    key: "_body",
    value: function _body() {
      var _this3 = this;

      var section = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var contents = section.contents || [],
          //if max items for display is a number, get max
      max = !!this.displayMode && this.displayMode !== "all" && parseInt(this.displayMode) ? parseInt(this.displayMode) : undefined,
          //show all content instead of toc
      showAll = contents.cheatsheet || contents.src || contents.steps || this.displayMode === "all" ? true : section.toc ? false : !max || contents.filter(function (item) {
        return !!item.title;
      }).length < max,
          //content items with toc lists if needed
      items = showAll ? contents : this._toc(contents);
      return (0, _litElement.html)(_templateObject10(), items.map(function (item) {
        return _this3._content(item, level);
      }));
    }
    /**
     * renders section content by type
     * @param {object} content section content
     * @param {number} level heading level of section
     * @returns {object} html
     */

  }, {
    key: "_content",
    value: function _content() {
      var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return this._isHTML(content) ? content : typeof content == "string" ? (0, _litElement.html)(_templateObject11(), content) : content.steps ? this._steps(content.steps, content.listStyle) : content.cheatsheet ? this._cheatsheet(content) : content.src ? this._image(content) : content.links ? this._links(content.contents) : content.contents ? this._section(content, level + 1) : '';
    }
    /**
     * gets contents with toc link schema
     * @param {object} content section content
     * @returns {object} content object with link schema
     */

  }, {
    key: "_toc",
    value: function _toc(contents) {
      var toc = [];
      contents.forEach(function (item) {
        if (!item.title) {
          toc.push(item);
        } else {
          if (!toc[toc.length - 1] || !toc[toc.length - 1].links) toc.push({
            links: true,
            contents: []
          });
          toc[toc.length - 1].contents.push(item);
        }
      });
      return toc;
    }
    /**
     * renders link list
     * @param {array} links arry of content to link
     * @returns {object} html
     */

  }, {
    key: "_links",
    value: function _links(links) {
      var _this4 = this;

      var preview = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var linkContent = function linkContent(link) {
        var temp = document.createElement("div");
        (0, _litElement.render)(_this4._content(link), temp);
        return temp.textContent.substring(0, 200);
      };

      return !links || links.length < 1 ? '' : (0, _litElement.html)(_templateObject12(), preview ? 'preview' : 'toc', links.map(function (link) {
        return (0, _litElement.html)(_templateObject13(), link.id, function (e) {
          return _this4.currentSection = link.id;
        }, link.title, !preview ? '' : linkContent(link));
      }));
    }
    /**
     * renders image
     * @param {object} image schema for image or figure
     * @param {number} level heading level
     * @returns {object} 
     */

  }, {
    key: "_image",
    value: function _image(image) {
      var img = (0, _litElement.html)(_templateObject14(), image.caption ? 'figure-image' : 'image', image.alt, image.src, image.srcset ? image.srcset : "", image.sizes ? image.sizes : "");
      return image.caption ? (0, _litElement.html)(_templateObject15(), img, image.caption) : img;
    }
    /**
     * renders cheatsheet table
     * @param {object} item schema for a cheatsheet
     * @returns {object} 
     */

  }, {
    key: "_cheatsheet",
    value: function _cheatsheet(item) {
      var cheatsheet = item.cheatsheet;
      return (0, _litElement.html)(_templateObject16(), !item.title ? '' : (0, _litElement.html)(_templateObject17(), item.id, item.title), !cheatsheet.columns ? '' : (0, _litElement.html)(_templateObject18(), cheatsheet.columns.map(function (column) {
        return (0, _litElement.html)(_templateObject19(), column);
      })), !cheatsheet.rows ? '' : (0, _litElement.html)(_templateObject20(), cheatsheet.rows.map(function (rows) {
        return (0, _litElement.html)(_templateObject21(), (rows || []).map(function (row) {
          return (0, _litElement.html)(_templateObject22(), row);
        }));
      })));
    }
    /**
     * renders step-by-step list, including substeps
     * @param {array} steps array of steps that may include nested sybstep arrays
     * @param {string} [listStyles="decimal lower-alpha lower-roman"] numbering style as a space-separated list styles in order of least nested to most nested
     * @returns {object}
     */

  }, {
    key: "_steps",
    value: function _steps() {
      var _this5 = this;

      var steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var listStyles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "decimal lower-alpha lower-roman";
      var listArray = listStyles.split(' '),
          childArray = listArray.slice(0 - (listArray.length - 1));
      return !steps || steps.length < 1 ? '' : (0, _litElement.html)(_templateObject23(), listArray[0], steps.map(function (step, i) {
        return _this5._isHTML(step) || typeof step == "string" ? (0, _litElement.html)(_templateObject24(), step, _typeof(steps[i + 1]) == "object" ? _this5._steps(steps[i + 1], childArray.join(' ')) : '') : '';
      }));
    }
    /**
     * renders section heading and/or anchors based on section schema
     * @param {array} section schema for a section contents
     * @param {number} level heading level
     * @returns 
     */

  }, {
    key: "_heading",
    value: function _heading() {
      var section = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var level = arguments.length > 1 ? arguments[1] : undefined;
      return section.title && level == 1 ? (0, _litElement.html)(_templateObject25(), section.id, section.title) : section.title && level == 2 ? (0, _litElement.html)(_templateObject26(), section.id, section.title) : section.title && level == 3 ? (0, _litElement.html)(_templateObject27(), section.id, section.title) : section.title && level == 4 ? (0, _litElement.html)(_templateObject28(), section.id, section.title) : section.title && level == 5 ? (0, _litElement.html)(_templateObject29(), section.id, section.title) : section.title ? (0, _litElement.html)(_templateObject30(), section.id, section.title) : section.id ? (0, _litElement.html)(_templateObject31(), section.id) : '';
    } // properties available to the custom element for data binding

  }, {
    key: "demoContents",

    /**
     * a schema object that can be rendered in demo mode
     *
     * @readonly
     * @memberof EndUserDoc
     */
    get: function get() {
      return {
        id: "demo",
        title: "End User Documentation",
        toc: true,
        contents: [{
          id: "laptop-banner",
          alt: "laptop computer with coffee and sketch notebook",
          src: "https://picsum.photos/id/2/400/150",
          srcset: "https://picsum.photos/id/2/400/150 400w, https://picsum.photos/id/2/800/175 800w, https://picsum.photos/id/2/1200/200 1200w, https://picsum.photos/id/2/1600/225 1600w",
          sizes: "(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1600px"
        }, (0, _litElement.html)(_templateObject32()), {
          id: "gettingstarted",
          title: "Getting Started",
          contents: [{
            alt: "",
            src: ""
          }, {
            listStyle: "decimal lower-alpha",
            steps: ["Step one.", ["step 1a.", "step 1b."], "Step two.", "Step three."]
          }]
        }, {
          id: "keyboardshortcuts",
          title: "Keyboard Shortcuts",
          cheatsheet: {
            columns: ["Shortcut", "Description"],
            rows: [[(0, _litElement.html)(_templateObject33()), "cut"], [(0, _litElement.html)(_templateObject34()), "copy"], [(0, _litElement.html)(_templateObject35()), "paste"]]
          }
        }, {
          id: "feature",
          title: "Feature",
          contents: [(0, _litElement.html)(_templateObject36()), {
            id: "laptop",
            alt: "laptop computer with coff and mobile phone",
            src: "https://picsum.photos/id/0/400/300",
            caption: "Features you can access on your laptop"
          }, {
            id: "feature-usecase-x",
            title: "Using Feature to X",
            contents: [{
              steps: ["Step one.", "Step two.", ["step 2a.", "step 2b."], "Step three."]
            }]
          }, {
            id: "feature-usecase-y",
            title: "Using Feature to Y",
            contents: [{
              listStyle: "upper-alpha",
              steps: ["Step A.", "Step B."]
            }]
          }, {
            id: "feature-usecase-z",
            title: "Using Feature to Z",
            contents: [{
              listStyle: "upper-roman upper-alpha decimal",
              steps: ["Step I.", ["step IA."[("step IA1.", "step IA2.")],, "step IB."], "Step II."]
            }]
          }]
        }]
      };
    }
    /**
     * creates an object that lists content by id
     *
     * @readonly
     * @memberof EndUserDoc
     */

  }, {
    key: "contentsById",
    get: function get() {
      var contentById = {},
          getIDs = function getIDs(contents) {
        //get content id but only if it is unique so far
        if (contents.id && !contentById[contents.id]) contentById[contents.id] = contents; //get subsection content as well

        if (_typeof(contents) == "object") (contents.contents || []).forEach(function (item) {
          return getIDs(item);
        });
      };

      if (this.demoMode) {
        getIDs(this.demoContents);
      } else if (this.contents) {
        getIDs(this.contents);
      }

      return contentById;
    }
    /**
     * creates an object that lists parents by id of its content
     *
     * @readonly
     * @memberof EndUserDoc
     */

  }, {
    key: "parentByContentId",
    get: function get() {
      var contentById = {},
          getIDs = function getIDs(contents, parent) {
        //get content id but only if it has a parent and is unique so far
        if (parent && contents.id && !contentById[contents.id]) contentById[contents.id] = parent; //get subsection content as well

        if (_typeof(contents) == "object") (contents.contents || []).forEach(function (item) {
          return getIDs(item, contents);
        });
      };

      if (this.demoMode) {
        getIDs(this.demoContents, undefined);
      } else if (this.contents) {
        getIDs(this.contents, undefined);
      }

      return contentById;
    }
  }, {
    key: "renderedSection",
    get: function get() {
      return this.currentSection && this.contentsById[this.currentSection] ? this.contentsById[this.currentSection] : this.demoMode ? this.demoContents : this.contents;
    }
  }, {
    key: "searchResults",
    get: function get() {
      var _this6 = this;

      return !this.__searchResults || !this.searchText || this.searchText == '' ? false : Object.keys(this.__searchResults || {}).map(function (id) {
        return [_this6.__searchResults[id], id];
      }).sort(function (a, b) {
        return a[0] == b[0] ? a[1] - b[1] : b[0] - a[0];
      }).map(function (item) {
        return _this6.contentsById[item[1]];
      });
    }
  }], [{
    key: "styles",
    //styles function
    get: function get() {
      return [(0, _litElement.css)(_templateObject37())];
    }
  }, {
    key: "properties",
    get: function get() {
      return _objectSpread({}, _get(_getPrototypeOf(EndUserDoc), "properties", this), {
        /** 
         * aria label for breadcrumbs
         */
        breadcrumbsLabel: {
          attribute: "breadcrumbs-label",
          type: String,
          reflect: true
        },

        /** 
         * schema object of content to be rendered
         */
        contents: {
          attribute: "contents",
          type: Object
        },

        /** 
         * determines which section to display
         */
        currentSection: {
          attribute: "current-section",
          type: String,
          reflect: true
        },

        /** 
         * render demo contents instead of contents
         */
        demoMode: {
          attribute: "demo-mode",
          type: Boolean,
          reflect: true
        },

        /** 
         * determines how contents are displayed
         */
        displayMode: {
          attribute: "display-mode",
          type: String,
          reflect: true
        },

        /** 
         * hides breadcrumbs
         */
        hideBreadcrumbs: {
          attribute: "hide-breadcrumbs",
          type: Boolean,
          reflect: true
        },

        /** 
         * adds searching to docs
         */
        searchable: {
          attribute: "searchable",
          type: Boolean,
          reflect: true
        },

        /** 
         * label for search
         */
        searchLabel: {
          attribute: "search-label",
          type: String,
          reflect: true
        },

        /** 
         * text of search
         */
        searchText: {
          attribute: "search-text",
          type: String,
          reflect: true
        },

        /** 
         * label for skip nav link
         */
        skipNavLabel: {
          attribute: "skip-nav-label",
          type: String,
          reflect: true
        },

        /** 
         * raw, weighted search results by section id
         */
        __searchResults: {
          type: Object
        }
      });
    }
    /**
    * Convention we use
    */

  }, {
    key: "tag",
    get: function get() {
      return "end-user-doc";
    }
    /**
    * HTMLElement
    */

  }]);

  function EndUserDoc() {
    _classCallCheck(this, EndUserDoc);

    return _possibleConstructorReturn(this, _getPrototypeOf(EndUserDoc).call(this));
  }
  /**
  * LitElement ready
  */


  _createClass(EndUserDoc, [{
    key: "firstUpdated",
    value: function firstUpdated(changedProperties) {}
    /**
    * LitElement life cycle - property changed
    */

  }, {
    key: "updated",
    value: function updated(changedProperties) {
      changedProperties.forEach(function (oldValue, propName) {});
    }
  }]);

  return EndUserDoc;
}(_litElement.LitElement);

exports.EndUserDoc = EndUserDoc;
customElements.define(EndUserDoc.tag, EndUserDoc);