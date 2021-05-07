"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxTray = void 0;

var _litElement = require("lit-element/lit-element.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

var _HAXFields = require("@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js");

var _SimpleTourFinder = require("@lrnwebcomponents/simple-popover/lib/SimpleTourFinder");

var _haxStore = require("./hax-store.js");

var _mobx = require("mobx");

var _haxUiStyles = require("@lrnwebcomponents/hax-body/lib/hax-ui-styles.js");

require("@lrnwebcomponents/simple-fields/simple-fields.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js");

require("./hax-tray-upload.js");

require("./hax-gizmo-browser.js");

require("./hax-app-browser.js");

require("./hax-stax-browser.js");

require("./hax-map.js");

require("./hax-preferences-dialog.js");

var _I18NMixin2 = require("@lrnwebcomponents/i18n-manager/lib/I18NMixin.js");

var _undoManager = require("@lrnwebcomponents/undo-manager/undo-manager.js");

require("@lrnwebcomponents/iframe-loader/lib/loading-indicator.js");

function _templateObject16() {
  var data = _taggedTemplateLiteral([
    '\n        :host {\n          z-index: 1000;\n          position: fixed;\n          top: 0;\n          font-family: var(--hax-ui-font-family);\n          font-size: var(--hax-ui-font-size);\n          color: var(--hax-ui-color);\n          transition: 0s color linear 0s;\n        }\n        :host([edit-mode][element-align="custom"]) {\n          left: var(--hax-tray-custom-x);\n          left: clamp(\n            0px,\n            var(--hax-tray-custom-x),\n            calc(100vw - var(--hax-tray-width, 300px))\n          );\n        }\n        :host([element-align="left"]) {\n          left: 0;\n        }\n        :host([element-align="right"]) {\n          right: 0;\n        }\n        :host(:focus-within),\n        :host(:hover) {\n          z-index: var(--hax-ui-focus-z-index);\n        }\n        .wrapper {\n          display: flex;\n          align-items: stretch;\n          flex-direction: row-reverse;\n          opacity: 0;\n          visibility: visible;\n          pointer-events: none;\n          width: var(--hax-tray-width, 300px);\n          overflow-x: hidden;\n          overflow-y: auto;\n          background-color: var(--hax-ui-background-color);\n          transition: 0.2s width ease-in-out 0s, 0.5s left ease-in-out 0.3s,\n            0.5s right ease-in-out 0.3s, 0s background-color linear,\n            0s border linear;\n          height: 100vh;\n        }\n        :host([collapsed]) .wrapper {\n          overflow-x: visible;\n        }\n        :host([element-align="left"]) .wrapper,\n        :host([element-align="custom"]) .wrapper {\n          left: -1000px;\n          flex-direction: row;\n        }\n        :host([element-align="right"]) .wrapper {\n          right: -1000px;\n        }\n        :host([edit-mode][element-align="left"]) .wrapper,\n        :host([edit-mode][element-align="custom"]) .wrapper {\n          left: 0;\n        }\n        :host([edit-mode][element-align="right"]) .wrapper {\n          right: 0;\n        }\n        :host([edit-mode]) .wrapper {\n          opacity: 1;\n          visibility: visible;\n          pointer-events: all;\n        }\n        #menubar {\n          display: inline-flex;\n          flex-direction: column;\n          align-items: stretch;\n          width: var(--hax-tray-menubar-min-width, 44px);\n          overflow: visible;\n          flex: 0 0 auto;\n          /*transition:0.3s width ease-in-out 0s;*/\n          z-index: 6;\n        }\n        :host([collapsed]) #menubar {\n          width: unset;\n        }\n        #menubar > * {\n          background-color: var(--hax-ui-background-color);\n        }\n        #menubar > *::part(button) {\n          padding: 2px;\n        }\n        #menubar > *::part(label) {\n          opacity: 0;\n          margin: 0px;\n          width: 0%;\n          font-size: 10px;\n          padding: 0px;\n          visibility: hidden;\n          overflow: hidden;\n          display: inline-block;\n          text-align: left;\n          transition: 0.2s width ease-in-out 0s, 0.2s margin ease-in-out 0s,\n            0.2s padding ease-in-out 0s, 0s opacity linear 0.2s,\n            0s visibility linear 0.2s;\n        }\n        :host([collapsed]) #menubar > *::part(label) {\n          opacity: 1;\n          width: 100%;\n          visibility: visible;\n          overflow: unset;\n          transition: 0.2s width ease-in-out 0s, 0.2s margin ease-in-out 0s,\n            0.2s padding ease-in-out 0s, 0s opacity linear 0s,\n            0s visibility linear 0s, 0s overflow linear 0.2s;\n        }\n        loading-indicator {\n          --loading-indicator-background-color: var(\n            --simple-colors-default-theme-accent-2,\n            grey\n          );\n          --loading-indicator-color: var(\n            --simple-colors-default-theme-accent-10,\n            black\n          );\n        }\n        .detail {\n          flex: 1 1 auto;\n          opacity: 1;\n          visibility: visible;\n          pointer-events: all;\n          transition: 0s opacity ease-in-out 0, 0s visibility ease-in-out 0s,\n            0s border linear;\n          border: 1px solid var(--hax-ui-border-color);\n        }\n        :host([collapsed]) .detail {\n          width: 0px;\n          overflow: hidden;\n          opacity: 0;\n          visibility: hidden;\n          pointer-events: none;\n          max-height: 100vh;\n          overflow-y: auto;\n          transition: 0s opacity ease-in-out 0.7s,\n            0s visibility ease-in-out 0.7s;\n        }\n        #tray-detail {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: calc(\n            var(--hax-tray-width) - var(--hax-tray-menubar-min-width, 44px) - 2 *\n              var(--hax-ui-spacing)\n          );\n          padding: 0 var(--hax-ui-spacing) var(--hax-ui-spacing);\n          height: 100vh;\n          overflow-y: auto;\n        }\n        :host([element-align="left"]) #tray-detail,\n        :host([element-align="custom"]) #tray-detail {\n          left: unset;\n          right: 0;\n        }\n        :host([edit-mode]:not([collapsed])) #tray-detail {\n          display: block;\n        }\n        #haxcancelbutton::part(dropdown-icon) {\n          display: none;\n        }\n        .tray-detail-titlebar {\n          background-color: var(--hax-ui-color-accent);\n          padding: var(--hax-ui-spacing-sm) var(--hax-ui-spacing);\n          margin: 0 calc(0px - var(--hax-ui-spacing)) var(--hax-ui-spacing);\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          height: var(--simple-modal-titlebar-height, unset);\n          line-height: var(--simple-modal-titlebar-line-height, unset);\n          position: sticky;\n          z-index: 2;\n          top: 0;\n        }\n        .tray-detail-titlebar h4 {\n          flex: 1 1 auto;\n          font-size: var(--hax-ui-font-size);\n          font-family: var(--hax-ui-font-family);\n        }\n        #toggle-tray-size {\n          flex: 0 0 auto;\n        }\n        hax-tray-button,\n        hax-app-browser,\n        hax-gizmo-browser {\n          transition: 0.2s all ease-in-out;\n          transition: 0s color linear !important;\n          transition: 0s background-color linear !important;\n          transition: 0s border-color linear !important;\n          visibility: visible;\n        }\n        hax-tray-button:not(:defined),\n        hax-app-browser:not(:defined),\n        hax-gizmo-browser:not(:defined) {\n          visibility: hidden;\n        }\n        hax-tray-upload {\n          flex: 0 0 auto;\n        }\n        *[hidden] {\n          display: none;\n        }\n        :host([element-align="right"]) #button {\n          right: 0;\n        }\n        :host([element-align="left"]) #button {\n          left: 0;\n        }\n\n        #button {\n          position: fixed;\n          top: 0;\n          visibility: visible;\n          margin: var(--hax-ui-spacing-xs);\n        }\n        :host([edit-mode]) #button {\n          visibility: hidden;\n          opacity: 0;\n        }\n        #button:hover {\n          opacity: 1;\n        }\n        /** This is mobile layout for controls */\n        @media screen and (max-width: 800px) {\n          :host {\n            --hax-tray-width: 100%;\n            --hax-tray-menubar-min-width: 32px;\n            width: 100%;\n          }\n          .wrapper {\n            width: 100%;\n            overflow-x: hidden;\n            overflow-y: hidden;\n            flex-direction: column;\n            align-items: stretch;\n            height: 100vh;\n            max-height: 100vh;\n            transition: background-color linear, 0s border linear;\n          }\n          :host([collapsed]) .wrapper {\n            height: auto;\n          }\n          #menubar {\n            position: sticky;\n            flex-direction: row;\n            left: 0;\n            top: 0;\n            height: auto;\n            flex: 0 0 auto;\n            width: 100%;\n          }\n          #menubar > * {\n            flex: 1 0 auto;\n            min-width: var(--hax-tray-menubar-min-width, 32px);\n          }\n          #menubar > *::part(button) {\n            min-width: var(--hax-tray-menubar-min-width, 32px);\n            justify-content: space-around;\n          }\n          #menubar > *::part(label) {\n            display: none;\n          }\n          .detail {\n            width: 100%;\n            position: relative;\n            flex: 1 1 100%;\n          }\n          :host([collapsed]) .detail {\n            flex: 0 0 0px;\n          }\n          #tray-detail {\n            top: 0;\n            width: 100%;\n          }\n        }\n        @media screen and (max-width: 600px) {\n          :host([edit-mode]) .hide-small {\n            display: none;\n          }\n        }\n      ',
  ]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = _taggedTemplateLiteral([
    ' <hax-tray-upload ?hidden="',
    '"></hax-tray-upload>\n      <h5 ?hidden="',
    '">',
    '</h5>\n      <hax-app-browser id="appbrowser" ?hidden="',
    '"></hax-app-browser>',
  ]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = _taggedTemplateLiteral([
    '<hax-map\n      controls="content-map"\n      ?hidden="',
    '"\n    ></hax-map>',
  ]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = _taggedTemplateLiteral([
    ' <hax-gizmo-browser\n        id="gizmobrowser"\n        ?hidden="',
    '"\n      ></hax-gizmo-browser>\n      <h5 ?hidden="',
    '">',
    '</h5>\n      <hax-stax-browser\n        id="staxbrowser"\n        ?hidden="',
    '"\n      ></hax-stax-browser>',
  ]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = _taggedTemplateLiteral([
    ' <simple-fields\n      id="settingsform"\n      disable-responsive\n      code-theme="',
    '"\n      ?hidden="',
    '"\n    ></simple-fields>',
  ]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral([
    ' <hax-preferences-dialog\n      id="advanced-settings"\n      ?hidden="',
    '"\n    ></hax-preferences-dialog>',
  ]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    ' <div\n      id="tray-detail"\n      aria-live="polite"\n      aria-disabled="',
    '"\n      tabindex="',
    '"\n      selected-detail="',
    '"\n    >\n      <div class="tray-detail-titlebar">\n        <h4>\n          ',
    '\n        </h4>\n        <hax-tray-button\n          voice-command="collapse menu"\n          id="toggle-tray-size"\n          event-name="toggle-tray-size"\n          icon="close"\n          label="Close"\n        >\n        </hax-tray-button>\n      </div>\n      ',
    " ",
    "\n      ",
    " ",
    "\n      ",
    "\n    </div>",
  ]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    '<hax-tray-button\n        id="exportbtn"\n        icon="code"\n        label="',
    '"\n        voice-command="view (page) source"\n        data-simple-tour-stop\n        data-stop-title="label"\n        icon-position="left"\n        show-text-label\n        show-tooltip\n        align-horizontal="',
    '"\n      >\n        <div data-stop-content>\n          Every change you make in HAX is ultimately writing HTML. Know HTML?\n          Awesome, pop open the source view and make any changes you like. HTML\n          is always behind the scenes ensuring that content is portable, well\n          formatted and easy to read.\n        </div>\n      </hax-tray-button>\n      <hax-tray-button\n        ?hidden="',
    '"\n        id="advanced-settings"\n        event-name="advanced-settings"\n        icon="settings"\n        label="',
    '"\n        voice-command="select settings (menu)"\n        data-simple-tour-stop\n        data-stop-title="label"\n        controls="tray-detail"\n        toggles\n        ?toggled="',
    '"\n        icon-position="left"\n        show-text-label\n        show-tooltip\n        align-horizontal="',
    '"\n      >\n        <div data-stop-content>\n          Some advanced options for developers and experimental purposes.\n        </div>\n      </hax-tray-button>\n      <hax-tray-button\n        event-name="',
    '"\n        icon="help"\n        label="',
    '"\n        voice-command="start tour"\n        toggles\n        ?toggled="',
    '"\n        icon-position="left"\n        show-text-label\n        show-tooltip\n        align-horizontal="',
    '"\n      ></hax-tray-button> ',
  ]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([
    ' <hax-tray-button\n        event-name="content-add"\n        icon="add-box"\n        id="content-add"\n        label="',
    '"\n        voice-command="select blocks (menu)"\n        data-simple-tour-stop\n        data-stop-title="label"\n        controls="tray-detail"\n        toggles\n        ?toggled="',
    '"\n        icon-position="left"\n        show-text-label\n        show-tooltip\n        align-horizontal="',
    '"\n      >\n        <div slot="tour" data-stop-content>\n          When you want to add any content to the page from text, to images, to\n          anything more advanced; you can always find items to add under the Add\n          content menu. Click to expand, then either drag and drop items into\n          the page or click and have them placed near whatever you are actively\n          working on.\n        </div>\n      </hax-tray-button>\n      <hax-tray-button\n        event-name="media-add"\n        icon="image:collections"\n        id="media-add"\n        label="',
    '"\n        voice-command="select media (menu)"\n        data-simple-tour-stop\n        data-stop-title="label"\n        controls="tray-detail"\n        toggles\n        ?toggled="',
    '"\n        icon-position="left"\n        show-text-label\n        show-tooltip\n        align-horizontal="',
    '"\n      >\n        <div slot="tour" data-stop-content>\n          Search for media and content anywhere that your copy of HAX has access\n          to. Pick what to search, perform the search and then click or drag the\n          item into the contnet.\n        </div>\n      </hax-tray-button>\n      <hax-tray-button\n        event-name="content-edit"\n        icon="build"\n        id="content-edit"\n        label="',
    '"\n        ?disabled="',
    '"\n        voice-command="(modify)(configure)(edit) selected"\n        data-simple-tour-stop\n        data-stop-title="label"\n        controls="tray-detail"\n        tooltip="',
    " ",
    '"\n        toggles\n        ?toggled="',
    '"\n        icon-position="left"\n        show-text-label\n        show-tooltip\n        align-horizontal="',
    '"\n      >\n        <div slot="tour" data-stop-content>\n          When you want to add any content to the page from text, to images, to\n          anything more advanced; you can always find items to add under the Add\n          content menu. Click to expand, then either drag and drop items into\n          the page or click and have them placed near whatever you are actively\n          working on.\n        </div>\n      </hax-tray-button>\n      <hax-tray-button\n        event-name="content-map"\n        icon="icons:toc"\n        id="content-map"\n        label="',
    '"\n        voice-command="select structure (menu)"\n        data-simple-tour-stop\n        data-stop-title="label"\n        controls="tray-detail"\n        toggles\n        ?toggled="',
    '"\n        icon-position="left"\n        show-text-label\n        show-tooltip\n        align-horizontal="',
    '"\n      >\n        <div data-stop-content>\n          This is a simple list of all the block areas of the page that are\n          clickable to jump through items quickly as well as review some simple\n          overview stats.\n        </div>\n      </hax-tray-button>',
  ]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    ' <hax-tray-button\n        icon="icons:undo"\n        ?disabled="',
    '"\n        label="',
    '"\n        event-name="undo"\n        voice-command="undo"\n        data-simple-tour-stop\n        data-stop-title="label"\n        icon-position="left"\n        show-text-label\n        show-tooltip\n        align-horizontal="',
    '"\n      >\n        <div slot="tour" data-stop-content>\n          Undo the previous operation in the content, whether typing or adding a\n          widget.\n        </div>\n      </hax-tray-button>\n      <hax-tray-button\n        icon="icons:redo"\n        ?disabled="',
    '"\n        label="',
    '"\n        event-name="redo"\n        voice-command="redo"\n        data-simple-tour-stop\n        data-stop-title="label"\n        icon-position="left"\n        show-text-label\n        show-tooltip\n        align-horizontal="',
    '"\n      >\n        <div slot="tour" data-stop-content>\n          Redo the last action that you hit Undo on.\n        </div>\n      </hax-tray-button>',
  ]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    '\n          <hax-tray-button\n            @click="',
    '"\n            icon="save"\n            icon-position="left"\n            id="haxsavebutton"\n            label="',
    '"\n            event-name="save"\n            voice-command="save page"\n            show-text-label\n            show-tooltip\n            align-horizontal="',
    '"\n          ></hax-tray-button>\n          <hax-toolbar-menu\n            icon="cancel"\n            id="haxcancelbutton"\n            label="',
    '"\n            icon-position="left"\n            show-text-label\n            show-tooltip\n            align-horizontal="',
    '"\n          >\n            <simple-toolbar-menu-item slot="menuitem">\n              <hax-tray-button\n                role="menuitem"\n                danger\n                align-horizontal="left"\n                icon="warning"\n                id="haxcancelbutton"\n                label="',
    '"\n                warning\n                event-name="cancel"\n                voice-command="cancel edit"\n                icon-position="left"\n                show-text-label\n                show-tooltip\n              ></hax-tray-button>\n            </simple-toolbar-menu-item>\n          </hax-toolbar-menu>\n        ',
  ]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n        <hax-tray-button\n          show-text-label\n          show-tooltip\n          align-horizontal="',
    '"\n          id="',
    '"\n          event-name="toggle-element-align"\n          icon="arrow-',
    '"\n          label="',
    '"\n          index="',
    '"\n          tooltip="',
    " ",
    '"\n        >\n        </hax-tray-button>\n    </div>\n    ',
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    ' <div id="menubar" class="collapse-menu">\n      ',
    " ",
    " ",
    "\n      ",
    '\n      <slot name="tray-buttons-pre"></slot>\n      ',
    "\n    </div>",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["", "", ""]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n          <hax-tray-button\n            large\n            voice-command="edit page"\n            .data-opened="',
    '"\n            @click="',
    '"\n            icon="create"\n            id="button"\n            feature\n            show-text-label\n            show-tooltip\n            label="',
    '"\n          ></hax-tray-button>\n        ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n      ",
    '\n      <div class="wrapper">\n        ',
    '\n        <div class="detail">\n          <loading-indicator\n            ?loading="',
    '"\n          ></loading-indicator>\n          ',
    "\n        </div>\n      </div>\n    ",
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

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
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

/**
 * `hax-tray`
 * `The tray / dashboard area which allows for customization of all major settings`
 * @element hax-tray
 */
var HaxTray =
  /*#__PURE__*/
  (function (_I18NMixin) {
    _inherits(HaxTray, _I18NMixin);

    _createClass(HaxTray, null, [
      {
        key: "tag",

        /**
         * Convention we use
         */
        get: function get() {
          return "hax-tray";
        },
        /**
         * HTMLElement
         */
      },
    ]);

    function HaxTray() {
      var _this$t;

      var _this;

      _classCallCheck(this, HaxTray);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxTray).call(this)
      );
      _this.tourName = "hax";
      _this.__winEvents = {
        "can-redo-changed": "_redoChanged",
        "can-undo-changed": "_undoChanged",
        "hax-drop-focus-event": "_expandSettingsPanel",
      };
      _this.t =
        ((_this$t = {
          structure: "Outline",
          structureTip: "View Page Structure",
          editSelected: "Edit selected",
          edit: "Edit",
          save: "Save",
          move: "Move",
          moveMenu: "Move",
          menuAlignment: "Menu Alignment",
          left: "Top Left",
          right: "Top Right",
          bottomLeft: "Bottom Left",
          bottomRight: "Bottom Right",
          menuPosition: "Menu position",
          changeSideVisually:
            "Change which side of the screen the menu is affixed to visually.",
          expand: "Expand",
          collapse: "Collapse",
          menuSize: "Menu size",
          menuSizeDescription: "Expand or collapse the menu visually.",
          takeATour: "Help",
          settings: "Settings",
          source: "Source",
          undo: "Undo",
          redo: "Redo",
          media: "Media",
          blocks: "Blocks",
          cancel: "Cancel",
          cancelWithoutSaving: "Cancel without saving",
          configure: "Configure",
          advanced: "Advanced",
          layout: "Layout",
          alignment: "Alignment",
        }),
        _defineProperty(_this$t, "left", "Left"),
        _defineProperty(_this$t, "center", "Center"),
        _defineProperty(_this$t, "right", "Right"),
        _defineProperty(_this$t, "search", "Search"),
        _defineProperty(_this$t, "templates", "Templates"),
        _defineProperty(_this$t, "width", "Width"),
        _this$t);

      _this.registerLocalization({
        context: _assertThisInitialized(_this),
        namespace: "hax",
        updateCallback: "_updateTrayDetail",
      });

      _this._initial = true;
      _this.activeValue = {
        settings: {
          layout: {
            __position: "hax-align-left",
            __scale: 100,
          },
          configure: {},
          advanced: {},
        },
      };
      _this.collapsed = true;
      _this.activeTab = "item-0";
      _this.activeSchema = [];
      _this.canUndo = false;
      _this.canRedo = false;
      _this.elementAlign = "right";
      _this.trayDetail = "content-edit";
      _this.activeTagName = "";
      _this.traySizeIcon = "hax:arrow-expand-right";
      _this.__setup = false;
      setTimeout(function () {
        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("./hax-tray-button.js"));
        });
        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("./hax-toolbar-menu.js"));
        });
        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu-item.js")
          );
        });

        _this.addEventListener(
          "hax-tray-button-click",
          _this._processTrayEvent.bind(_assertThisInitialized(_this))
        );
      }, 0);
      (0, _mobx.autorun)(function () {
        _this.activeGizmo = (0, _mobx.toJS)(_haxStore.HAXStore.activeGizmo);
      });
      (0, _mobx.autorun)(function () {
        _this.activeNode = (0, _mobx.toJS)(_haxStore.HAXStore.activeNode);
      });
      (0, _mobx.autorun)(function () {
        _this.tourOpened = (0, _mobx.toJS)(_haxStore.HAXStore.tourOpened);
      });
      (0, _mobx.autorun)(function () {
        _this.appStoreLoaded = (0, _mobx.toJS)(
          _haxStore.HAXStore.appStoreLoaded
        );
      });
      (0, _mobx.autorun)(function () {
        _this.globalPreferences = (0, _mobx.toJS)(
          _haxStore.HAXStore.globalPreferences
        );
        _this.haxUiTheme = (_this.globalPreferences || {}).haxUiTheme || "hax";
        document.body.setAttribute("hax-ui-theme", _this.haxUiTheme);
      });
      (0, _mobx.autorun)(function () {
        _this.editMode = (0, _mobx.toJS)(_haxStore.HAXStore.editMode);
      });
      return _this;
    }

    _createClass(
      HaxTray,
      [
        {
          key: "_expandSettingsPanel",
          value: function _expandSettingsPanel(e) {
            this.shadowRoot.querySelector("#content-edit").click();
          },
        },
        {
          key: "_redoChanged",
          value: function _redoChanged(e) {
            this.canRedo = e.detail.value;
          },
        },
        {
          key: "_undoChanged",
          value: function _undoChanged(e) {
            this.canUndo = e.detail.value;
          },
          /**
           * LitElement render styles
           */
        },
        {
          key: "render",

          /**
           * LitElement render
           */
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.panelOpsTemplate,
              this.menuToolbarTemplate,
              !this.appStoreLoaded,
              this.trayDetailTemplate
            );
          },
        },
        {
          key: "__simpleFieldsClick",
          value: function __simpleFieldsClick(e) {
            try {
              this.activeTab = this.shadowRoot
                .querySelector("#settingsform")
                .shadowRoot.querySelector("simple-fields").activeTab;
            } catch (e) {
              // in case it missed somehow like w/ an incredibly slow repaints
              this.activeTab = "item-0";
            }
          },
        },
        {
          key: "_refreshAddData",
          value: function _refreshAddData() {
            this.shadowRoot
              .querySelector("#gizmobrowser")
              .resetList((0, _mobx.toJS)(_haxStore.HAXStore.gizmoList));
            this.shadowRoot.querySelector(
              "#staxbrowser"
            ).staxList = _toConsumableArray(
              (0, _mobx.toJS)(_haxStore.HAXStore.staxList)
            );
          },
          /**
           * Process event for simple content inserts.
           */
        },
        {
          key: "_processTrayEvent",
          value: function _processTrayEvent(e) {
            var target = (0, _utils.normalizeEventPath)(e)[0]; // support a simple insert event to bubble up or everything else

            switch (e.detail.eventName) {
              case "insert-stax":
                this.dispatchEvent(
                  new CustomEvent("hax-insert-content-array", {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: target.stax,
                  })
                );
                break;

              case "insert-tag":
                var gizmo = {
                  tag: e.detail.value,
                };
                var haxElement; // get schema for that version of events

                var schema = _haxStore.HAXStore.haxSchemaFromTag(
                  e.detail.value
                );

                if (
                  target.getAttribute("data-demo-schema") &&
                  schema &&
                  schema.demoSchema &&
                  schema.demoSchema[0]
                ) {
                  haxElement = schema.demoSchema[0];
                } else {
                  // support if anything else is manually defining what to inject
                  // or a baseline if we didn't have a demonstration schema supplied
                  var properties = JSON.parse(
                    target.getAttribute("event-properties")
                  );
                  var innerContent = target.getAttribute("event-content");

                  if (properties == null) {
                    properties = {};
                  }

                  if (innerContent == null) {
                    innerContent = "";
                  } // most likely empty values but just to be safe

                  haxElement = _haxStore.HAXStore.haxElementPrototype(
                    gizmo,
                    properties,
                    innerContent
                  );
                }

                this.dispatchEvent(
                  new CustomEvent("hax-insert-content", {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: haxElement,
                  })
                );
                break;

              case "advanced-settings":
                this.trayDetail = e.detail.eventName;
                this.collapsed = false;
                break;

              case "toggle-element-align":
                var directions = ["left", "right"],
                  direction = !!directions[e.detail.index]
                    ? directions[e.detail.index]
                    : "right";
                if (e.detail.index > 1) this.collapsed = true;
                this.style.setProperty("--hax-tray-custom-y", null);
                this.style.setProperty("--hax-tray-custom-x", null);
                this.elementAlign = direction;
                break;

              case "toggle-tray-size":
                this.collapsed = !this.collapsed;
                break;

              case "content-map":
                this.trayDetail = e.detail.eventName;
                this.collapsed = false;
                break;

              case "content-edit":
                this.trayDetail = e.detail.eventName;
                this.collapsed = false;
                break;

              case "content-add":
                this.trayDetail = e.detail.eventName;
                this.collapsed = false;
                break;

              case "media-add":
                this.trayDetail = e.detail.eventName;
                this.collapsed = false;
                break;

              case "start-tour":
                this.startTour();
                break;

              case "stop-tour":
                window.SimpleTourManager.requestAvailability().stopTour("hax");
                break;

              case "undo":
                _haxStore.HAXStore.activeHaxBody.undo();

                break;

              case "redo":
                _haxStore.HAXStore.activeHaxBody.redo();

                break;

              case "cancel":
                if (
                  confirm(
                    "Changes have not been saved, Click OK to close HAX or Cancel to continue editing."
                  )
                ) {
                  _haxStore.HAXStore.editMode = false;
                  this.dispatchEvent(
                    new CustomEvent("hax-cancel", {
                      bubbles: true,
                      composed: true,
                      cancelable: false,
                      detail: e.detail,
                    })
                  );
                }

                break;
            }
          },
        },
        {
          key: "startTour",
          value: function startTour() {
            this.__tour =
              this.__tour || window.SimpleTourManager.requestAvailability();
            window.addEventListener(
              "tour-changed",
              this._handleTourChanged.bind(this)
            );

            this.__tour.startTour("hax");
          },
        },
        {
          key: "stopTour",
          value: function stopTour() {
            this.__tour =
              this.__tour || window.SimpleTourManager.requestAvailability();

            this.__tour.stopTour("hax");

            window.removeEventListener(
              "tour-changed",
              this._handleTourChanged.bind(this)
            );
          },
        },
        {
          key: "_handleTourChanged",
          value: function _handleTourChanged(e) {
            this.tourOpened = e.detail.active == this.tourName;
          },
          /**
           * LitElement / popular convention
           */
        },
        {
          key: "firstUpdated",

          /**
           * LitElement ready life cycle
           */
          value: function firstUpdated(changedProperties) {
            var _this2 = this;

            if (
              _get(_getPrototypeOf(HaxTray.prototype), "firstUpdated", this)
            ) {
              _get(
                _getPrototypeOf(HaxTray.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            }

            if (!this.__setup) {
              this.shadowRoot.querySelector("#settingsform").schematizer =
                _HAXFields.HaxSchematizer;
              this.shadowRoot.querySelector("#settingsform").elementizer =
                _HAXFields.HaxElementizer;
              setTimeout(function () {
                _this2.shadowRoot.querySelector(".wrapper").style.margin =
                  _this2.offsetMargin;
              }, 1000);
              this.__setup = true;
              this.shadowRoot
                .querySelector("#settingsform")
                .addEventListener("click", this.__simpleFieldsClick.bind(this));
              this.shadowRoot
                .querySelector("#settingsform")
                .addEventListener(
                  "value-changed",
                  this.__valueChangedEvent.bind(this)
                ); // fire an event that this is a core piece of the system

              this.dispatchEvent(
                new CustomEvent("hax-register-core-piece", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: {
                    piece: "haxTray",
                    object: this,
                  },
                })
              );
              this.dispatchEvent(
                new CustomEvent("hax-add-voice-command", {
                  bubbles: true,
                  composed: true,
                  cancelable: false,
                  detail: {
                    command:
                      ":name: (collapse)(open)(expand)(toggle) Blocks (menu)",
                    context: this.shadowRoot.querySelector("#content-add"),
                    callback: "click",
                  },
                })
              );
              this.dispatchEvent(
                new CustomEvent("hax-add-voice-command", {
                  bubbles: true,
                  composed: true,
                  cancelable: false,
                  detail: {
                    command:
                      ":name: (collapse)(open)(expand)(toggle) element settings (menu)",
                    context: this.shadowRoot.querySelector(
                      "#advanced-settings"
                    ),
                    callback: "click",
                  },
                })
              );
              this.dispatchEvent(
                new CustomEvent("hax-add-voice-command", {
                  bubbles: true,
                  composed: true,
                  cancelable: false,
                  detail: {
                    command:
                      ":name: (collapse)(open)(expand)(toggle) search (menu)",
                    context: this.shadowRoot.querySelector("#media-add"),
                    callback: "click",
                  },
                })
              );
            }
          },
          /**
           * LitElement properties changed
           */
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            return regeneratorRuntime.async(
              function updated$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      if (
                        _get(
                          _getPrototypeOf(HaxTray.prototype),
                          "updated",
                          this
                        )
                      ) {
                        _get(
                          _getPrototypeOf(HaxTray.prototype),
                          "updated",
                          this
                        ).call(this, changedProperties);
                      }

                      changedProperties.forEach(function _callee(
                        oldValue,
                        propName
                      ) {
                        return regeneratorRuntime.async(function _callee$(
                          _context
                        ) {
                          while (1) {
                            switch ((_context.prev = _context.next)) {
                              case 0:
                                if (!(propName == "editMode")) {
                                  _context.next = 5;
                                  break;
                                }

                                if (!_this3.editMode) {
                                  _context.next = 4;
                                  break;
                                }

                                _context.next = 4;
                                return regeneratorRuntime.awrap(
                                  _haxStore.HAXStore.refreshActiveNodeForm()
                                );

                              case 4:
                                _this3._editModeChanged(_this3.editMode);

                              case 5:
                                if (propName == "offsetMargin") {
                                  setTimeout(function () {
                                    _this3.shadowRoot.querySelector(
                                      ".wrapper"
                                    ).style.margin = _this3.offsetMargin;
                                  }, 0);
                                } // change tray detail

                                if (propName == "trayDetail") {
                                  _this3._updateTrayDetail(_this3[propName]);
                                } // collaped menu state change

                                if (
                                  propName == "collapsed" &&
                                  _this3[propName]
                                ) {
                                  _this3._editModeChanged(_this3.editMode);
                                } // active Gizmo changed

                                if (propName == "activeGizmo") {
                                  if (_this3.activeGizmo) {
                                    _this3.activeTagName =
                                      _this3.activeGizmo.title;

                                    if (
                                      (!oldValue ||
                                        _this3.trayDetail !== "content-edit") &&
                                      _this3.trayDetail !== "content-map"
                                    ) {
                                      _this3.trayDetail = "content-edit";
                                    }
                                  } else {
                                    _this3.activeTagName = ""; // force a gizmo change (which then implies adding to the page)
                                    // to select the edit tab if we just added something into the page
                                    // from our two content adding panes

                                    if (
                                      !["content-add", "content-map"].includes(
                                        _this3.trayDetail
                                      )
                                    ) {
                                      _this3.trayDetail = "content-add";
                                    }
                                  }
                                } // active node changed

                                if (!(propName == "activeNode")) {
                                  _context.next = 17;
                                  break;
                                }

                                if (
                                  !(
                                    _this3.activeNode &&
                                    _this3.activeNode.tagName
                                  )
                                ) {
                                  _context.next = 16;
                                  break;
                                }

                                if (!_this3.editMode) {
                                  _context.next = 14;
                                  break;
                                }

                                _context.next = 14;
                                return regeneratorRuntime.awrap(
                                  _haxStore.HAXStore.refreshActiveNodeForm()
                                );

                              case 14:
                                _context.next = 17;
                                break;

                              case 16:
                                _this3.activeTagName = "";

                              case 17:
                              case "end":
                                return _context.stop();
                            }
                          }
                        });
                      });

                    case 2:
                    case "end":
                      return _context2.stop();
                  }
                }
              },
              null,
              this
            );
          },
          /**
           * When we end dragging ensure we remove the mover class.
           */
        },
        {
          key: "_dragEnd",
          value: function _dragEnd(e) {
            var menu = (0, _utils.normalizeEventPath)(e)
              ? (0, _utils.normalizeEventPath)(e)[0]
              : undefined;
            if (menu) menu.close(true);
            this.collapsed = true;
            this.style.setProperty("--hax-tray-custom-y", e.clientY + "px");
            this.style.setProperty("--hax-tray-custom-x", e.clientX + "px");
            this.elementAlign = "custom";
          },
          /**
           * Drag start so we know what target to set
           */
        },
        {
          key: "_dragStart",
          value: function _dragStart(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            var menu = (0, _utils.normalizeEventPath)(e)
              ? (0, _utils.normalizeEventPath)(e)[0]
              : undefined;
            this.collapsed = true;
            if (menu) menu.close(true);
          },
          /**
           * When the preview node is updated, pull schema associated with it
           */
        },
        {
          key: "_setupForm",
          value: function _setupForm() {
            var _this4 = this;

            var activeNode = this.activeNode;
            this._initial = true;
            this.activeValue = {
              settings: {
                layout: {
                  __position: "hax-align-left",
                  __scale: 100,
                },
                configure: {},
                advanced: {},
              },
            };
            this.shadowRoot.querySelector("#settingsform").fields = [];
            this.shadowRoot.querySelector("#settingsform").value = {}; // see if we can get schema off of this.

            if (
              activeNode &&
              activeNode.tagName &&
              _haxStore.HAXStore.elementList[activeNode.tagName.toLowerCase()]
            ) {
              var props =
                _haxStore.HAXStore.elementList[
                  activeNode.tagName.toLowerCase()
                ]; // generate a human name for this

              if (
                _typeof(props.gizmo.title) ===
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                this.humanName = activeNode.tagName
                  .replace("-", " ")
                  .toLowerCase();
              } else {
                this.humanName = props.gizmo.title;
              } // first, allow element properties to dictate defaults

              for (var property in this.activeHaxElement.properties) {
                props.settings.configure.forEach(function (el) {
                  if (el.property === property) {
                    _this4.activeValue.settings.configure[property] =
                      _this4.activeHaxElement.properties[property];
                  }

                  if (el.attribute === property) {
                    _this4.activeValue.settings.configure[property] =
                      _this4.activeHaxElement.properties[property];
                  }

                  if (el.slot === property) {
                    _this4.activeValue.settings.configure[property] =
                      _this4.activeHaxElement.properties[property];
                  }
                });
                props.settings.advanced.forEach(function (el) {
                  if (el.property === property) {
                    _this4.activeValue.settings.advanced[property] =
                      _this4.activeHaxElement.properties[property];
                  }

                  if (el.attribute === property) {
                    _this4.activeValue.settings.advanced[property] =
                      _this4.activeHaxElement.properties[property];
                  }

                  if (el.slot === property) {
                    _this4.activeValue.settings.advanced[property] =
                      _this4.activeHaxElement.properties[property];
                  }
                });
              } // now we need to parse through for slotted items
              // build a fake tree, then walk the configuration / Settings
              // looking for slot types

              var tmp = document.createElement("div");
              tmp.innerHTML = this.activeHaxElement.content; // step through each key

              tmp.childNodes.forEach(function (el) {
                // ensure we have a dom node and it isnt empty
                if (
                  el.nodeType === 1 &&
                  el.innerHTML !==
                    (typeof undefined === "undefined"
                      ? "undefined"
                      : _typeof(undefined))
                ) {
                  // walk props looking for a match
                  props.settings.configure.forEach(function (prop) {
                    // if we have a slot to match in the property AND it matches the attr
                    if (prop.slot === el.getAttribute("slot")) {
                      _this4.activeValue.settings.configure[prop.slot] =
                        el.innerHTML;
                    } // no slot and it didnt match so it has no slot
                    else if (
                      prop.slot == "" &&
                      (el.getAttribute("slot") == null ||
                        el.getAttribute("slot") == "null")
                    ) {
                      _this4.activeValue.settings.configure[prop.slot] =
                        el.innerHTML;
                    }
                  }); // now advanced

                  props.settings.advanced.forEach(function (prop) {
                    if (prop.slot === el.getAttribute("slot")) {
                      _this4.activeValue.settings.advanced[prop.slot] =
                        el.innerHTML;
                    } // no slot and it didnt match so it has no slot
                    else if (
                      prop.slot == "" &&
                      (el.getAttribute("slot") == null ||
                        el.getAttribute("slot") == "null")
                    ) {
                      _this4.activeValue.settings.advanced[prop.slot] =
                        el.innerHTML;
                    }
                  });
                }
              }); // then we need to work on the layout piece

              if (activeNode.style.width != "") {
                this.activeValue.settings.layout.__scale = activeNode.style.width.replace(
                  "%",
                  ""
                );
              } else {
                this.activeValue.settings.layout.__scale = 100;
              }

              if (
                activeNode.style.display == "block" &&
                activeNode.style.margin == "0px auto" &&
                activeNode.style["float"] == "right"
              ) {
                this.activeValue.settings.layout.__position = "hax-align-right";
              } else if (
                activeNode.style.display == "block" &&
                activeNode.style.margin == "0px auto"
              ) {
                this.activeValue.settings.layout.__position =
                  "hax-align-center";
              } else {
                this.activeValue.settings.layout.__position = "hax-align-left";
              }

              this.activeHaxElement.properties.__scale = this.activeValue.settings.layout.__scale;
              this.activeHaxElement.properties.__position = this.activeValue.settings.layout.__position; // tabs / deep objects require us to preview the value w/ the path correctly

              props.settings.configure.forEach(function (val, key) {
                if (props.settings.configure[key].attribute) {
                  props.settings.configure[key].property =
                    props.settings.configure[key].attribute;
                }

                if (props.settings.configure[key].slot) {
                  props.settings.configure[key].property =
                    props.settings.configure[key].slot;
                }
              });
              props.settings.advanced.forEach(function (val, key) {
                if (props.settings.advanced[key].attribute) {
                  props.settings.advanced[key].property =
                    props.settings.advanced[key].attribute;
                }

                if (props.settings.advanced[key].slot) {
                  props.settings.advanced[key].property =
                    props.settings.advanced[key].slot;
                }
              });
              props.settings.layout = []; // test if this element can be aligned

              if (props.canPosition) {
                props.settings.layout.push({
                  property: "__position",
                  title: this.t.alignment,
                  inputMethod: "select",
                  value: this.activeValue.settings.layout.__position,
                  options: {
                    "hax-align-left": this.t.left,
                    "hax-align-center": this.t.center,
                    "hax-align-right": this.t.right,
                  },
                });
              } // test if this element can be scaled

              if (props.canScale) {
                props.settings.layout.push({
                  property: "__scale",
                  title: this.t.width,
                  inputMethod: "slider",
                  value: this.activeValue.settings.layout.__scale,
                  min: props.canScale.min ? props.canScale.min : 12.5,
                  max: props.canScale.max ? props.canScale.max : 100,
                  step: props.canScale.step ? props.canScale.step : 12.5,
                });
              } // establish tabs container

              this.activeSchema = [
                {
                  property: "settings",
                  inputMethod: "tabs",
                  properties: [],
                },
              ]; // array of things to forcibly disable

              var disable = []; // see if we have any configure settings or disable

              if (props.settings.configure.length > 0) {
                this.activeSchema[0].properties.push({
                  property: "configure",
                  title: this.t.configure,
                  properties: props.settings.configure,
                });
              } else {
                this.activeSchema[0].properties.push({
                  property: "configure",
                  title: this.t.configure,
                  disabled: true,
                });
              } // see if we have any layout settings or disable

              if (props.settings.layout.length > 0) {
                this.activeSchema[0].properties.push({
                  property: "layout",
                  title: this.t.layout,
                  properties: props.settings.layout,
                });
              } else {
                this.activeSchema[0].properties.push({
                  property: "layout",
                  title: this.t.layout,
                  disabled: true,
                });
              } // see if we have any configure settings or disable

              if (props.settings.advanced.length > 0) {
                this.activeSchema[0].properties.push({
                  property: "advanced",
                  title: this.t.advanced,
                  properties: props.settings.advanced,
                });
              } else {
                this.activeSchema[0].properties.push({
                  property: "advanced",
                  title: this.t.advanced,
                  disabled: true,
                });
              }

              this.__activePropSchema = props;
              this.shadowRoot.querySelector(
                "#settingsform"
              ).fields = this.activeSchema;
              this.shadowRoot.querySelector(
                "#settingsform"
              ).value = this.activeValue;
            }
          },
          /**
           * Convert an object to an array
           */
        },
        {
          key: "_toArray",
          value: function _toArray(obj) {
            if (obj == null) {
              return [];
            }

            return Object.keys(obj).map(function (key) {
              return obj[key];
            });
          },
          /**
           * update hax map
           */
        },
        {
          key: "updateMap",
          value: function updateMap() {
            if (
              this.shadowRoot &&
              this.shadowRoot.querySelector("hax-map") &&
              this.trayDetail == "content-map"
            )
              this.shadowRoot.querySelector("hax-map").updateHAXMap();
          },
        },
        {
          key: "_updateTrayDetail",
          value: function _updateTrayDetail(newValue) {
            if (newValue == "content-add") {
              this.trayLabel = this.t.blocks;

              this._refreshAddData();
            } else if (newValue == "media-add") {
              this.trayLabel = this.t.media;
            } else if (newValue == "content-map") {
              this.trayLabel = this.t.structure;
              this.shadowRoot.querySelector("hax-map").updateHAXMap();
            } else if (newValue == "advanced-settings") {
              this.trayLabel = this.t.settings;
              this.shadowRoot
                .querySelector("hax-preferences-dialog")
                .reloadPreferencesForm();
            } else if (
              newValue == "content-edit" &&
              (!this.activeTagName ||
                this.activeTagName == "" ||
                !this.activeNode ||
                !this.activeNode.tagName)
            ) {
              this.trayDetail = "content-add";
            } else if (!newValue || newValue == "") {
              this.trayDetail = "content-edit";
            } else {
              this.trayLabel = undefined;
            }

            this.requestUpdate();
          },
          /**
           * Notice change in values from below
           */
        },
        {
          key: "__valueChangedEvent",
          value: function __valueChangedEvent(e) {
            var _this5 = this;

            if (this.editMode && e.detail.value && e.detail.value.settings) {
              var setAhead;
              var propTmp;
              var tmpel;
              var attr;

              (function () {
                var settings = e.detail.value.settings;
                var settingsKeys = {
                  advanced: "advanced",
                  configure: "configure",
                  layout: "layout",
                };

                var _loop = function _loop(key) {
                  var _loop2 = function _loop2(prop) {
                    setAhead = false;

                    if (
                      settings[key][prop] != null &&
                      !settings[key][prop].readOnly
                    ) {
                      // prefix is a special attribute and must be handled this way
                      if (prop === "prefix" && settings[key][prop] != "") {
                        _this5.activeNode.setAttribute(
                          "prefix",
                          settings[key][prop]
                        );

                        setAhead = true;
                      } // innerText is another special case since it cheats on slot content
                      // that is only a text node (like a link)
                      else if (prop === "innerText") {
                        _this5.activeNode.innerText = settings[key][prop];
                        setAhead = true;
                      } // this is a special internal held "property" for layout stuff
                      else if (key === "layout" && prop === "__position") {
                        setAhead = true;

                        if (!_this5._initial) {
                          clearTimeout(_this5.__contextValueDebounce);
                          _this5.__contextValueDebounce = setTimeout(
                            function () {
                              _this5.dispatchEvent(
                                new CustomEvent("hax-context-item-selected", {
                                  bubbles: true,
                                  composed: true,
                                  detail: {
                                    eventName: settings[key][prop],
                                    value: settings[key][prop],
                                  },
                                })
                              );
                            },
                            50
                          );
                        }
                      } // this is a special internal held "property" for layout stuff
                      else if (key === "layout" && prop === "__scale") {
                        setAhead = true;

                        if (!_this5._initial) {
                          clearTimeout(_this5.__contextSizeDebounce);
                          _this5.__contextSizeDebounce = setTimeout(
                            function () {
                              _this5.dispatchEvent(
                                new CustomEvent("hax-context-item-selected", {
                                  bubbles: true,
                                  composed: true,
                                  detail: {
                                    eventName: "hax-size-change",
                                    value: settings[key][prop],
                                  },
                                })
                              );
                            },
                            50
                          );
                        }
                      } // try and set the pop directly if it is a prop already set
                      // check on prototype, then in properties object if it has one
                      // then by seeing if we have an array / object
                      else if (
                        _this5.activeNode.hasOwnProperty(prop) ||
                        (_this5.activeNode.properties &&
                          _this5.activeNode.properties.hasOwnProperty(prop)) ||
                        (settings[key][prop] != null &&
                          settings[key][prop].constructor === Array) ||
                        (settings[key][prop] != null &&
                          settings[key][prop].constructor === Object)
                      ) {
                        try {
                          if (settings[key][prop].constructor === Array) {
                            _this5.activeNode[prop] = _toConsumableArray(
                              settings[key][prop]
                            );
                          } else if (
                            settings[key][prop].constructor === Object
                          ) {
                            _this5.activeNode[prop] = _objectSpread(
                              {},
                              settings[key][prop]
                            );
                          } else {
                            _this5.activeNode[prop] = settings[key][prop];
                          }

                          setAhead = true;
                        } catch (e) {
                          console.warn(e);
                          setAhead = false;
                        }
                      } else {
                        // need to specifically walk through slots if there is anything
                        // that says it has to come from a slot
                        for (propTmp in _this5.__activePropSchema.settings[
                          key
                        ]) {
                          if (
                            _this5.__activePropSchema.settings[key][propTmp]
                              .slot == prop
                          ) {
                            var slotTag = "span";

                            if (
                              _this5.__activePropSchema.settings[key][propTmp]
                                .slotWrapper
                            ) {
                              slotTag =
                                _this5.__activePropSchema.settings[key][propTmp]
                                  .slotWrapper;
                            } else if (
                              _this5.activeNode.tagName.toLowerCase() ===
                              "code-editor"
                            ) {
                              slotTag = "template";
                            }

                            tmpel = document.createElement(slotTag);

                            if (
                              _this5.__activePropSchema.settings[key][propTmp]
                                .slotAttributes
                            ) {
                              for (attr in _this5.__activePropSchema.settings[
                                key
                              ][propTmp].slotAttributes) {
                                tmpel.setAttribute(
                                  attr,
                                  _this5.__activePropSchema.settings[key][
                                    propTmp
                                  ].slotAttributes[attr]
                                );
                              }
                            } // support unnamed slots

                            if (
                              _this5.__activePropSchema.settings[key][propTmp]
                                .slot !== ""
                            ) {
                              tmpel.slot =
                                _this5.__activePropSchema.settings[key][
                                  propTmp
                                ].slot;
                            }

                            tmpel.innerHTML = settings[key][prop];
                            var cloneIt = tmpel.cloneNode(true);
                            setAhead = true; // inject the slotted content but use text nodes if this is a text element

                            if (
                              _haxStore.HAXStore.isTextElement(
                                _this5.activeNode
                              )
                            ) {
                              _this5.activeNode.innerHTML = tmpel.innerHTML;
                            } else {
                              // wipe just the slot in question
                              (0, _utils.wipeSlot)(
                                _this5.activeNode,
                                _this5.__activePropSchema.settings[key][propTmp]
                                  .slot
                              );

                              _this5.activeNode.appendChild(cloneIt);
                            }
                          }
                        }
                      } // this will get reached often but tough to know if we had a slot

                      if (!setAhead) {
                        try {
                          // silly but this is the spec way to do a boolean
                          if (settings[key][prop] === true) {
                            _this5.activeNode.setAttribute(
                              (0, _utils.camelCaseToDash)(prop),
                              (0, _utils.camelCaseToDash)(prop)
                            );
                          } else if (
                            settings[key][prop] === false ||
                            settings[key][prop] === ""
                          ) {
                            _this5.activeNode.removeAttribute(
                              (0, _utils.camelCaseToDash)(prop)
                            );
                          } else {
                            _this5.activeNode.setAttribute(
                              (0, _utils.camelCaseToDash)(prop),
                              settings[key][prop]
                            );
                          }
                        } catch (e) {
                          console.warn(e);
                          console.warn(prop, settings[key][prop]);
                        }
                      }
                    } else {
                      _this5.activeNode.removeAttribute(
                        (0, _utils.camelCaseToDash)(prop)
                      );
                    }
                  };

                  for (var prop in settings[key]) {
                    _loop2(prop);
                  }
                };

                for (var key in settingsKeys) {
                  _loop(key);
                }
              })();
            }

            setTimeout(function () {
              if (_this5._initial) {
                _this5._initial = false;
              }
            }, 51);
          },
          /**
           * _editModeChanged
           */
        },
        {
          key: "_editModeChanged",
          value: function _editModeChanged(newValue) {
            if (
              !this.hidePanelOps &&
              this.shadowRoot &&
              this.shadowRoot.querySelector("#button")
            ) {
              if (newValue) {
                this.shadowRoot.querySelector("#button").icon = "save";
              } else {
                this.shadowRoot.querySelector("#button").icon = "create";
              }
            }
          },
          /**
           * Edit clicked, activate
           */
        },
        {
          key: "_clickEditButton",
          value: function _clickEditButton(e) {
            _haxStore.HAXStore.editMode = true;
            window.dispatchEvent(
              new CustomEvent("simple-modal-hide", {
                bubbles: true,
                cancelable: true,
                detail: {},
              })
            );
          },
          /**
           * Toggle the drawer when the button is clicked.
           */
        },
        {
          key: "_clickSaveButton",
          value: function _clickSaveButton(e) {
            _haxStore.HAXStore.editMode = false;
            this.dispatchEvent(
              new CustomEvent("hax-save", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: e.detail,
              })
            );
            window.dispatchEvent(
              new CustomEvent("simple-modal-hide", {
                bubbles: true,
                cancelable: true,
                detail: {},
              })
            );
          },
        },
        {
          key: "panelOpsTemplate",
          get: function get() {
            return this.hidePanelOps
              ? ""
              : (0, _litElement.html)(
                  _templateObject2(),
                  this.editMode,
                  this._clickEditButton,
                  this.editMode ? this.t.save : this.t.edit
                );
          },
        },
        {
          key: "toolbarsTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject3(),
              this.opsToolbarTemplate,
              this.trayToolbarTemplate
            );
          },
        },
        {
          key: "menuToolbarTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject4(),
              this.menuButtons,
              this.saveButtons,
              this.doButtons,
              this.contentButtons,
              this.moreButtons
            );
          },
        },
        {
          key: "menuButtons",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject5(),
              this.collapsed ? "left" : "center",
              this.elementAlign == "left" ? "right" : "left",
              this.elementAlign == "left" ? "forward" : "back",
              this.elementAlign == "left" ? this.t.right : this.t.left,
              this.elementAlign == "left" ? "1" : "0",
              this.t.moveMenu,
              this.elementAlign == "left" ? this.t.right : this.t.left
            );
          },
        },
        {
          key: "saveButtons",
          get: function get() {
            return this.hidePanelOps
              ? ""
              : (0, _litElement.html)(
                  _templateObject6(),
                  this._clickSaveButton,
                  this.editMode ? this.t.save : this.t.edit,
                  this.collapsed ? "left" : "center",
                  this.t.cancel,
                  this.collapsed ? "left" : "center",
                  this.t.cancelWithoutSaving
                );
          },
        },
        {
          key: "doButtons",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject7(),
              !this.canUndo,
              this.t.undo,
              this.collapsed ? "left" : "center",
              !this.canRedo,
              this.t.redo,
              this.collapsed ? "left" : "center"
            );
          },
        },
        {
          key: "contentButtons",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject8(),
              this.t.blocks,
              this.trayDetail === "content-add",
              this.collapsed ? "left" : "center",
              this.t.media,
              this.trayDetail === "media-add",
              this.collapsed ? "left" : "center",
              this.t.edit,
              !this.activeTagName ||
                this.activeTagName == "" ||
                !this.activeNode ||
                !this.activeNode.tagName,
              this.t.editSelected,
              this.activeTagName,
              this.trayDetail === "content-edit",
              this.collapsed ? "left" : "center",
              this.t.structure,
              this.trayDetail === "content-map",
              this.collapsed ? "left" : "center"
            );
          },
        },
        {
          key: "moreButtons",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject9(),
              this.t.source,
              this.collapsed ? "left" : "center",
              this.hidePreferencesButton,
              this.t.settings,
              this.trayDetail === "advanced-settings",
              this.collapsed ? "left" : "center",
              this.tourOpened ? "stop-tour" : "start-tour",
              this.t.takeATour,
              this.tourOpened,
              this.collapsed ? "left" : "center"
            );
          },
        },
        {
          key: "trayDetailTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject10(),
              this.collapsed ? "true" : "false",
              this.collapsed ? "-1" : "0",
              this.trayDetail,
              this.trayLabel ||
                "".concat(this.t.editSelected, " ").concat(this.activeTagName),
              this.advancedSettingsTemplate,
              this.contentMapTemplate,
              this.contentEditTemplate,
              this.contentAddTemplate,
              this.mediaTemplate
            );
          },
        },
        {
          key: "advancedSettingsTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject11(),
              this.trayDetail !== "advanced-settings"
            );
          },
        },
        {
          key: "contentEditTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject12(),
              this.haxUiTheme == "system"
                ? "auto"
                : this.haxUiTheme == "haxdark"
                ? "vs-dark"
                : "vs",
              this.trayDetail !== "content-edit"
            );
          },
        },
        {
          key: "contentAddTemplate",
          get: function get() {
            var hidden = this.trayDetail !== "content-add";
            return (0, _litElement.html)(
              _templateObject13(),
              hidden,
              hidden,
              this.t.templates,
              hidden
            );
          },
        },
        {
          key: "contentMapTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject14(),
              this.trayDetail !== "content-map"
            );
          },
        },
        {
          key: "mediaTemplate",
          get: function get() {
            var hidden = this.trayDetail !== "media-add";
            return (0, _litElement.html)(
              _templateObject15(),
              hidden,
              hidden,
              this.t.search,
              hidden
            );
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(HaxTray), "styles", this) || []
              ),
              _toConsumableArray(_haxUiStyles.HaxTrayDetail),
              _toConsumableArray(_haxUiStyles.HaxComponentStyles),
              [(0, _litElement.css)(_templateObject16())]
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(HaxTray), "properties", this),
              {
                offsetMargin: {
                  type: String,
                  attribute: "offset-margin",
                },
                collapsed: {
                  type: Boolean,
                  reflect: true,
                },
                traySizeIcon: {
                  type: String,
                },
                appStoreLoaded: {
                  type: Boolean,
                },

                /**
                 * Form values for active node
                 */
                activeValue: {
                  type: Object,
                },

                /**
                 * Form schema for active node
                 */
                activeSchema: {
                  type: Object,
                },

                /**
                 * Alignment of the initial edit button
                 */
                elementAlign: {
                  type: String,
                  reflect: true,
                  attribute: "element-align",
                },

                /**
                 * Light variant for save button
                 */
                light: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * If we can currently undo based on stack position
                 */
                canUndo: {
                  type: Boolean,
                  attribute: "can-undo",
                },

                /**
                 * If we can currently redo based on stack position
                 */
                canRedo: {
                  type: Boolean,
                  attribute: "can-redo",
                },
                haxUiTheme: {
                  type: String,
                },

                /**
                 * Showing preferences area.
                 */
                hidePreferencesButton: {
                  type: Boolean,
                  reflect: true,
                  attribute: "hide-preferences-button",
                },

                /**
                 * Showing button area at all a well as internal
                 * state managing buttons like cancel and save
                 */
                hidePanelOps: {
                  type: Boolean,
                  reflect: true,
                  attribute: "hide-panel-ops",
                },

                /**
                 * Global preferences for HAX overall
                 */
                globalPreferences: {
                  type: Object,
                },

                /**
                 * Global active node so we know if we need to disable contextual settings
                 */
                activeNode: {
                  type: Object,
                },

                /**
                 * Element name / what to display based on active element
                 */
                activeTagName: {
                  type: String,
                },
                activeGizmo: {
                  type: Object,
                },

                /**
                 * State of the panel
                 */
                editMode: {
                  type: Boolean,
                  reflect: true,
                  attribute: "edit-mode",
                },

                /**
                 * id of toggled section in tray
                 */
                trayDetail: {
                  type: String,
                },

                /**
                 * heading of toggled section in tray
                 */
                trayLabel: {
                  type: String,
                },
                tourOpened: {
                  type: String,
                },
                __tour: {
                  type: Object,
                },
              }
            );
          },
        },
      ]
    );

    return HaxTray;
  })(
    (0, _I18NMixin2.I18NMixin)(
      (0, _SimpleTourFinder.SimpleTourFinder)(
        (0, _utils.winEventsElement)(_litElement.LitElement)
      )
    )
  );

exports.HaxTray = HaxTray;
window.customElements.define(HaxTray.tag, HaxTray);
