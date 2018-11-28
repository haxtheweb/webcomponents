define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-card/paper-card.js",
  "../node_modules/@lrnwebcomponents/simple-datetime/simple-datetime.js"
], function(_polymerLegacy, _paperCard, _simpleDatetime) {
  "use strict";
  function _templateObject_359accb0f32f11e880147b5ac6e8ccac() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        outline: none;\n        text-transform: none;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        width: 100%;\n        min-width: unset;\n      }\n      paper-card {\n        padding: 32px 16px;\n        margin: 0;\n        min-width: unset;\n        width: 100%;\n        background-color: transparent;\n      }\n      .post-title {\n        letter-spacing: -.32px;\n        font-weight: 700;\n        font-style: normal;\n        display: block;\n        font-size: 28px;\n        line-height: 1.1;\n        margin: 0;\n      }\n      .post-title a {\n        text-decoration: none;\n        color: #333332;\n      }\n      .post-excerpt {\n        letter-spacing: -.32px;\n        font-weight: 300;\n        font-style: normal;\n        font-size: 16px;\n        line-height: 1.3;\n        color: #666665;\n      }\n      .post-excerpt p {\n        text-transform: none;\n      }\n      :host([elevation="2"]) .post-excerpt,\n      :host([elevation="2"]) simple-datetime {\n        color: #333335;\n      }\n      .post-meta {\n        font-size: 14px;\n        color: #b3b3b1;\n        line-height: 30px;\n      }\n    </style>\n    <paper-button>\n    <paper-card elevation="[[elevation]]">\n    <article class="post" itemtype="http://schema.org/BlogPosting" role="article">\n      <div class="article-item">\n        <header class="post-header">\n          <a tabindex="-1" href$="[[link]]" itemprop="url"></a>\n          <h2 class="post-title" itemprop="name">[[title]]</h2>\n        </header>\n        <section class="post-excerpt" itemprop="description">\n          <p>[[description]]</p>\n        </section>\n        <div class="post-meta">\n          <simple-datetime format="M jS, Y" timestamp="[[changed]]" unix=""></simple-datetime>\n        </div>\n      </div>\n    </article>\n    </paper-card>\n    </paper-button>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        outline: none;\n        text-transform: none;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        width: 100%;\n        min-width: unset;\n      }\n      paper-card {\n        padding: 32px 16px;\n        margin: 0;\n        min-width: unset;\n        width: 100%;\n        background-color: transparent;\n      }\n      .post-title {\n        letter-spacing: -.32px;\n        font-weight: 700;\n        font-style: normal;\n        display: block;\n        font-size: 28px;\n        line-height: 1.1;\n        margin: 0;\n      }\n      .post-title a {\n        text-decoration: none;\n        color: #333332;\n      }\n      .post-excerpt {\n        letter-spacing: -.32px;\n        font-weight: 300;\n        font-style: normal;\n        font-size: 16px;\n        line-height: 1.3;\n        color: #666665;\n      }\n      .post-excerpt p {\n        text-transform: none;\n      }\n      :host([elevation="2"]) .post-excerpt,\n      :host([elevation="2"]) simple-datetime {\n        color: #333335;\n      }\n      .post-meta {\n        font-size: 14px;\n        color: #b3b3b1;\n        line-height: 30px;\n      }\n    </style>\n    <paper-button>\n    <paper-card elevation="[[elevation]]">\n    <article class="post" itemtype="http://schema.org/BlogPosting" role="article">\n      <div class="article-item">\n        <header class="post-header">\n          <a tabindex="-1" href\\$="[[link]]" itemprop="url"></a>\n          <h2 class="post-title" itemprop="name">[[title]]</h2>\n        </header>\n        <section class="post-excerpt" itemprop="description">\n          <p>[[description]]</p>\n        </section>\n        <div class="post-meta">\n          <simple-datetime format="M jS, Y" timestamp="[[changed]]" unix=""></simple-datetime>\n        </div>\n      </div>\n    </article>\n    </paper-card>\n    </paper-button>\n'
      ]
    );
    _templateObject_359accb0f32f11e880147b5ac6e8ccac = function _templateObject_359accb0f32f11e880147b5ac6e8ccac() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_359accb0f32f11e880147b5ac6e8ccac()
    ),
    is: "simple-blog-overview",
    listeners: {
      tap: "_itemTap",
      mousedown: "tapEventOn",
      mouseover: "tapEventOn",
      mouseout: "tapEventOff",
      focusin: "tapEventOn",
      focusout: "tapEventOff"
    },
    properties: {
      itemId: { type: String },
      title: { type: String },
      body: { type: String },
      link: { type: String },
      changed: { type: Number },
      elevation: { type: Number, value: 0, reflectToAttribute: !0 }
    },
    _itemTap: function _itemTap(e) {
      this.fire("active-item-selected", this.itemId);
    },
    tapEventOn: function tapEventOn(e) {
      this.elevation = 2;
    },
    tapEventOff: function tapEventOff(e) {
      this.elevation = 0;
    }
  });
});
