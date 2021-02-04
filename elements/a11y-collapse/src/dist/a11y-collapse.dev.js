"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.A11yCollapse = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

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

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="heading">\n        <div id="text"><slot name="heading"></slot></div>\n        <simple-icon-button-lite\n          id="expand"\n          class="',
    '"\n          @click="',
    '"\n          ?disabled="',
    '"\n          .label="',
    '"\n          .icon="',
    '"\n          aria-controls="content"\n          aria-expanded="',
    '"\n        >\n        </simple-icon-button-lite>\n        <simple-tooltip for="expand"\n          >',
    "</simple-tooltip\n        >\n      </div>\n    ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n      <div\n        id="heading"\n        aria-controls="content"\n        aria-expanded="',
    '"\n        role="button"\n        @click="',
    '"\n        ?disabled="',
    '"\n        .label="',
    '"\n      >\n        <div id="text"><slot name="heading"></slot></div>\n        <simple-icon-lite\n          id="expand"\n          class="',
    '"\n          .icon="',
    '"\n          aria-hidden="true"\n        >\n        </simple-icon-lite>\n      </div>\n      <simple-tooltip for="heading"\n        >',
    "</simple-tooltip\n      >\n    ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n        :host {\n          display: block;\n          margin: var(--a11y-collapse-margin, 15px 0);\n          border: var(--a11y-collapse-border, 1px solid);\n          border-color: var(--a11y-collapse-border-color, inherit);\n          transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);\n        }\n        :host(:not(:first-of-type)) {\n          border-top: var(\n            --a11y-collapse-border-between,\n            var(--a11y-collapse-border, 1px solid)\n          );\n        }\n        :host([disabled]) {\n          opacity: 0.5;\n        }\n        *[aria-controls="content"][disabled] {\n          cursor: not-allowed;\n        }\n        #heading {\n          display: flex;\n          justify-content: stretch;\n          align-items: center;\n          padding: 0\n            var(\n              --a11y-collapse-padding-right,\n              var(--a11y-collapse-horizontal-padding, 16px)\n            )\n            0\n            var(\n              --a11y-collapse-padding-left,\n              var(--a11y-collapse-horizontal-padding, 16px)\n            );\n          font-weight: var(--a11y-collapse-heading-font-weight, bold);\n          margin: var(--a11y-collapse-margin, unset);\n          color: var(--a11y-collapse-heading-color, unset);\n          background-color: var(\n            --a11y-collapse-heading-background-color,\n            unset\n          );\n        }\n        :host([disabled]) #heading {\n          color: var(--a11y-collapse-disabled-heading-color, unset);\n          background-color: var(\n            --a11y-collapse-heading-disabled-background-color,\n            unset\n          );\n        }\n        #text {\n          flex-grow: 1;\n          overflow: hidden;\n        }\n        #expand {\n          transform: rotate(0deg);\n          transition: transform 0.75s ease;\n          padding: (--a11y-collapse-icon-padding, unset);\n        }\n        #content {\n          padding: var(\n              --a11y-collapse-padding-top,\n              var(--a11y-collapse-vertical-padding, 16px)\n            )\n            var(\n              --a11y-collapse-padding-right,\n              var(--a11y-collapse-horizontal-padding, 16px)\n            )\n            var(\n              --a11y-collapse-padding-bottom,\n              var(--a11y-collapse-vertical-padding, 16px)\n            )\n            var(\n              --a11y-collapse-padding-left,\n              var(--a11y-collapse-horizontal-padding, 16px)\n            );\n          border-top: var(--a11y-collapse-border, 1px solid);\n          border-color: var(--a11y-collapse-border-color, inherit);\n        }\n        @media screen {\n          #expand.rotated {\n            transform: rotate(-90deg);\n            transition: transform 0.75s ease;\n          }\n          :host #content {\n            padding: 0\n              var(\n                --a11y-collapse-padding-right,\n                var(--a11y-collapse-horizontal-padding, 16px)\n              )\n              0\n              var(\n                --a11y-collapse-padding-left,\n                var(--a11y-collapse-horizontal-padding, 16px)\n              );\n            border-top: 0px solid;\n            border-color: var(--a11y-collapse-border-color, inherit);\n            max-height: 0;\n            transition: all 0.75s ease;\n            overflow-y: hidden;\n          }\n          :host #content-inner {\n            max-height: 0;\n            overflow-y: var(--a11y-collapse-overflow-y, hidden);\n          }\n          :host([expanded]) #content {\n            padding: var(\n                --a11y-collapse-padding-top,\n                var(--a11y-collapse-vertical-padding, 16px)\n              )\n              var(\n                --a11y-collapse-padding-right,\n                var(--a11y-collapse-horizontal-padding, 16px)\n              )\n              var(\n                --a11y-collapse-padding-bottom,\n                var(--a11y-collapse-vertical-padding, 16px)\n              )\n              var(\n                --a11y-collapse-padding-left,\n                var(--a11y-collapse-horizontal-padding, 16px)\n              );\n            border-top: var(--a11y-collapse-border, 1px solid);\n            border-color: var(--a11y-collapse-border-color, inherit);\n            max-height: 200000000000vh;\n          }\n          :host([expanded]) #content-inner {\n            max-height: var(--a11y-collapse-max-height, 200000000000vh);\n            transition: max-height 0.75s ease;\n          }\n        }\n      ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n      ",
    '\n      <div\n        id="content"\n        aria-hidden="',
    '"\n        aria-labelledby="heading"\n        aria-live="polite"\n      >\n        <div id="content-inner">\n          <slot name="content"></slot>\n          <slot></slot>\n        </div>\n      </div>\n    ',
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
 * `a11y-collapse`
 * an accessible expand collapse
 * 
### Styling

`<a11y-collapse>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-collapse-margin` | margin around a11y-collapse | 15px 0
`--a11y-collapse-border` | border around a11y-collapse | 1px solid
`--a11y-collapse-horizontal-padding` | horizontal padding inside a11y-collapse | 16px
`--a11y-collapse-horizontal-padding-left` | left padding inside a11y-collapse | `--a11y-collapse-horizontal-padding`
`--a11y-collapse-horizontal-padding-right` | right padding inside a11y-collapse | `--a11y-collapse-horizontal-padding`
`--a11y-collapse-vertical-padding` | vertical padding inside a11y-collapse | 16px
`--a11y-collapse-horizontal-padding-top` | top padding inside a11y-collapse | `--a11y-collapse-vertical-padding`
`--a11y-collapse-horizontal-padding-bottom` | bottom padding inside a11y-collapse | --a11y-collapse-vertical-padding
`--a11y-collapse-border-between` | border between a11y-collapse heading and content | --a11y-collapse-border
`--a11y-collapse-heading-font-weight` | font-weight for a11y-collapse heading | bold
`--a11y-collapse-heading-color` | text color for a11y-collapse heading | unset
`--a11y-collapse-heading-background-color` | background-color for a11y-collapse heading | unset
`--a11y-collapse-overflow-y` | override default overflow behavior | hidden
`--a11y-collapse-max-height` | override maximum height of collapse section | 200000000000vh, so that aanimation effect works
 *
 * @customElement
 * @extends LitElement
 * @demo demo/index.html
 * @demo ./demo/group.html collapse groups
 */
var A11yCollapse =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(A11yCollapse, _LitElement);

    _createClass(
      A11yCollapse,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.headingButton || this.accordion
                ? this._makeHeadingButton()
                : this._makeIconButton(),
              this.expanded ? "false" : "true"
            );
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
          },
        },
        {
          key: "tag",
          get: function get() {
            return "a11y-collapse";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Heading is the expand button.
               */
              headingButton: {
                type: Boolean,
                reflect: true,
                attribute: "heading-button",
              },

              /**
               * disbled
               */
              disabled: {
                type: Boolean,
                reflect: true,
                attribute: "disabled",
              },

              /**
               * hidden
               */
              hidden: {
                type: Boolean,
                reflect: true,
                attribute: "hidden",
              },

              /**
               * icon when expanded
               */
              expanded: {
                type: Boolean,
                reflect: true,
              },

              /**
               * icon for the button
               */
              icon: {
                type: String,
              },

              /**
               * icon when expanded
               */
              iconExpanded: {
                type: String,
                attribute: "icon-expanded",
              },

              /**
               * label for the button
               */
              label: {
                type: String,
              },

              /**
               * optional label for the button when expanded
               */
              labelExpanded: {
                type: String,
                attribute: "label-expanded",
              },

              /**
               * tooltip for the button
               */
              tooltip: {
                type: String,
              },

              /**
               * optional tooltip for the button when expanded
               */
              tooltipExpanded: {
                type: String,
                attribute: "tooltip-expanded",
              },

              /**
               * @deprecated Use {@link headingButton} instead
               */
              accordion: {
                type: Boolean,
                reflect: true,
                attribute: "accordion",
              },
            };
          },
        },
      ]
    );

    function A11yCollapse() {
      var _this;

      _classCallCheck(this, A11yCollapse);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(A11yCollapse).call(this)
      );
      _this.headingButton = false;
      _this.accordion = false;
      _this.disabled = false;
      _this.hidden = false;
      _this.expanded = false;
      _this.icon = "icons:expand-more";
      _this.label = "expand / collapse";
      _this.tooltip = "toggle expand / collapse";
      return _this;
    }

    _createClass(
      A11yCollapse,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            var _this2 = this;

            _get(
              _getPrototypeOf(A11yCollapse.prototype),
              "connectedCallback",
              this
            ).call(this);

            setTimeout(function () {
              /**
               * Fires when constructed, so that parent radio group can listen for it.
               *
               * @event a11y-collapse-attached
               */
              _this2.dispatchEvent(
                new CustomEvent("a11y-collapse-attached", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: _this2,
                })
              );
            }, 0);
          },
          /**
           * Let the group know that this is gone.
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            /**
             * Fires when detatched, so that parent radio group will no longer listen for it.
             *
             * @event a11y-collapse-detached
             */
            this.dispatchEvent(
              new CustomEvent("a11y-collapse-detached", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );

            _get(
              _getPrototypeOf(A11yCollapse.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
          /**
           * Collapses the content
           */
        },
        {
          key: "collapse",
          value: function collapse() {
            this.toggle(false);
          },
          /**
           * Expands the content
           */
        },
        {
          key: "expand",
          value: function expand() {
            this.toggle(true);
          },
          /**
           * Toggles based on mode
           * @param {boolean} open whether to toggle open
           */
        },
        {
          key: "toggle",
          value: function toggle() {
            var open =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : !this.expanded;
            this.expanded = open;
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (propName === "expanded") _this3._fireToggleEvents();
            });
          },
          /**
           * Fires toggling events
           */
        },
        {
          key: "_fireToggleEvents",
          value: function _fireToggleEvents() {
            /**
             * Fires when toggled.
             *
             * @event toggle
             */
            this.dispatchEvent(
              new CustomEvent("toggle", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
            /**
             * Fires when toggled. @deprecated Use `toggle` instead
             *
             * @event a11y-collapse-toggle
             */

            this.dispatchEvent(
              new CustomEvent("a11y-collapse-toggle", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );

            if (this.expanded) {
              /**
               * Fires when expanded.
               *
               * @event expand
               */
              this.dispatchEvent(
                new CustomEvent("expand", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: this,
                })
              );
            } else {
              /**
               * Fires when collapsed.
               *
               * @event collapse
               */
              this.dispatchEvent(
                new CustomEvent("collapse", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: this,
                })
              );
            }
          },
          /**
           * determines the property based on expanded state
           * @param {string} defaultProp default property
           * @param {string} expandedProp property when expanded
           * @param {boolean} expanded whether a11y-collapse is expanded
           * @returns {string} property based on expanded state
           */
        },
        {
          key: "_getExpanded",
          value: function _getExpanded(defaultProp, expandedProp, expanded) {
            return expanded && expandedProp ? expandedProp : defaultProp;
          },
          /**
           * renders collapse item where only entire heading is clickable button
           * @returns {object} html template for a heading as a clickable button
           */
        },
        {
          key: "_makeHeadingButton",
          value: function _makeHeadingButton() {
            return (0, _litElement.html)(
              _templateObject3(),
              this.expanded ? "true" : "false",
              this._onClick,
              this.disabled,
              this._getExpanded(this.label, this.labelExpanded, this.expanded),
              !this.expanded && !this.iconExpanded ? "rotated" : "",
              this._getExpanded(
                this.icon || "icons:expand-more",
                this.iconExpanded,
                this.expanded
              ),
              this._getExpanded(
                this.tooltip,
                this.tooltipExpanded,
                this.expanded
              )
            );
          },
          /**
           * renders collapse item where only icon is a clickable button
           * @returns {object} html template for a heading with an icon button
           */
        },
        {
          key: "_makeIconButton",
          value: function _makeIconButton() {
            return (0, _litElement.html)(
              _templateObject4(),
              !this.expanded && !this.iconExpanded ? "rotated" : "",
              this._onClick,
              this.disabled,
              this._getExpanded(this.label, this.labelExpanded, this.expanded),
              this._getExpanded(
                this.icon || "icons:expand-more",
                this.iconExpanded,
                this.expanded
              ),
              this.expanded ? "true" : "false",
              this._getExpanded(
                this.tooltip,
                this.tooltipExpanded,
                this.expanded
              )
            );
          },
          /**
           * Handle click
           */
        },
        {
          key: "_onClick",
          value: function _onClick() {
            if (!this.disabled) {
              this.toggle();
              /**
               * Fires when clicked.
               *
               * @event a11y-collapse-click
               */

              this.dispatchEvent(
                new CustomEvent("a11y-collapse-click", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: this,
                })
              );
            }
          },
          /**
           *  @deprecated Use  {@link _makeHeadingButton} instead
           *
           * @memberof A11yCollapse
           */
        },
        {
          key: "_makeAccordionButton",
          value: function _makeAccordionButton() {
            this._makeHeadingButton();
          },
        },
      ],
      [
        {
          key: "haxProperties",
          get: function get() {
            return {
              canScale: false,
              canPosition: true,
              canEditSource: true,
              gizmo: {
                title: "Single Expand Collapse",
                description: "A single instance of an expand collapse.",
                icon: "view-day",
                color: "grey",
                groups: ["Content", "Presentation", "Collapse"],
              },
              settings: {
                configure: [
                  {
                    slot: "heading",
                    title: "Heading",
                    description: "The heading for the collapse.",
                    inputMethod: "textfield",
                  },
                  {
                    slot: "content",
                    title: "Content",
                    description: "The content for the collapse.",
                    inputMethod: "code-editor",
                  },
                  {
                    property: "headingButton",
                    title: "Heading Button",
                    description:
                      "Make entire heading clickble instead of just the icon.",
                    inputMethod: "boolean",
                  },
                  {
                    property: "expanded",
                    title: "Expanded",
                    description: "Expand by default",
                    inputMethod: "boolean",
                  },
                  {
                    property: "disabled",
                    title: "Disabled",
                    inputMethod: "boolean",
                  },
                  {
                    property: "icon",
                    title: "Icon",
                    description:
                      "The icon for the toggle expand/collapse button.",
                    inputMethod: "iconpicker",
                    options: [],
                  },
                  {
                    property: "iconExpanded",
                    title: "Icon (when expanded)",
                    description:
                      "Optional: The icon for the toggle expand/collapse button when expanded",
                    inputMethod: "iconpicker",
                    options: [],
                  },
                  {
                    property: "label",
                    title: "Label",
                    description:
                      "The label of the toggle expand/collapse button",
                    inputMethod: "textfield",
                  },
                  {
                    property: "labelExpanded",
                    title: "Label (when expanded)",
                    description:
                      "The label of the toggle expand/collapse button when expanded.",
                    inputMethod: "textfield",
                  },
                  {
                    property: "tooltip",
                    title: "Tooltip",
                    description:
                      "The tooltip for the toggle expand/collapse button",
                    inputMethod: "textfield",
                  },
                  {
                    property: "tooltipExpanded",
                    title: "Tooltip (when expanded)",
                    description:
                      "The tooltip for the toggle expand/collapse button when expanded",
                    inputMethod: "textfield",
                  },
                ],
                advanced: [
                  {
                    property: "hidden",
                    title: "Hidden",
                    inputMethod: "boolean",
                  },
                ],
              },
            };
          },
        },
      ]
    );

    return A11yCollapse;
  })(_litElement.LitElement);

exports.A11yCollapse = A11yCollapse;
window.customElements.define(A11yCollapse.tag, A11yCollapse);
