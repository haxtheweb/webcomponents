define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PersonTestimonial = void 0;
  function _templateObject_061d3010d70311e8aa2713eea5729803() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_061d3010d70311e8aa2713eea5729803 = function() {
      return data;
    };
    return data;
  }
  var PersonTestimonial = (function(_PolymerElement) {
    babelHelpers.inherits(PersonTestimonial, _PolymerElement);
    function PersonTestimonial() {
      babelHelpers.classCallCheck(this, PersonTestimonial);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          PersonTestimonial.__proto__ ||
          Object.getPrototypeOf(PersonTestimonial)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      PersonTestimonial,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                PersonTestimonial.prototype.__proto__ ||
                  Object.getPrototypeOf(PersonTestimonial.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              PersonTestimonial.haxProperties,
              PersonTestimonial.tag,
              this
            );
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_061d3010d70311e8aa2713eea5729803()
            );
          }
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              canScale: !0,
              canPosition: !0,
              canEditSource: !1,
              gizmo: {
                title: "Person testimonial",
                description: "Automated conversion of person-testimonial/",
                icon: "icons:android",
                color: "green",
                groups: ["Testimonial"],
                handles: [{ type: "todo:read-the-docs-for-usage" }],
                meta: {
                  author: "btopro",
                  owner: "The Pennsylvania State University"
                }
              },
              settings: { quick: [], configure: [], advanced: [] }
            };
          }
        },
        {
          key: "properties",
          get: function get() {
            return {};
          }
        },
        {
          key: "tag",
          get: function get() {
            return "person-testimonial";
          }
        }
      ]
    );
    return PersonTestimonial;
  })(_polymerElement.PolymerElement);
  _exports.PersonTestimonial = PersonTestimonial;
  window.customElements.define(PersonTestimonial.tag, PersonTestimonial);
});
