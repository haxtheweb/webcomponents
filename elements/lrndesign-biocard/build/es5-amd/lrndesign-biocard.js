define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/paper-card/paper-card.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@polymer/iron-icons/iron-icons.js",
  "./node_modules/@lrnwebcomponents/paper-contact/paper-contact.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_64f28ed0e11911e889769780e2d6296d() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <paper-card image="[[image]]">\n  <div class="card-content">\n    <div class="cafe-header">[[instructorName]]\n    </div>\n    <p>Contact Me:<br>\n <paper-contact-list>    \n    <paper-contact-address latitude="51.5287718" longitude="-0.2416798">[[address]]</paper-contact-address>\n    <paper-contact-email>[[email]]</paper-contact-email>\n    <paper-contact-phone>[[phone]]</paper-contact-phone>\n    <paper-contact-mobile>[[phone]]</paper-contact-mobile>\n</paper-contact-list>\n    </p><p><slot></slot></p>\n      <p><iron-icon icon="icons:query-builder"></iron-icon> Office Hours: </p>\n      [[officeHours]]\n      <p><a href="mailto:[[email]]">\n  <paper-button raised=""><iron-icon icon="icons:today"></iron-icon> Schedule Appointment</paper-button>\n</a></p>\n<p>Social\n<paper-contact-list style="width: 300px;">\n    <paper-contact-linkedin>[[linkedin]]</paper-contact-linkedin>\n    <paper-contact-twitter>[[twitter]]</paper-contact-twitter>\n    <paper-contact-skype>[[videoConf]]</paper-contact-skype>\n</paper-contact-list>\n</p>\n</div>\n</paper-card>\n'
    ]);
    _templateObject_64f28ed0e11911e889769780e2d6296d = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_64f28ed0e11911e889769780e2d6296d()
    ),
    is: "lrndesign-biocard",
    properties: {
      title: { type: String, value: "lrndesign-biocard" },
      image: { type: String, value: "" },
      instructorName: { type: String, value: "" },
      address: { type: String, value: "" },
      phone: { type: String, value: "" },
      email: { type: String, value: "" },
      officeHours: { type: String, value: "" },
      linkedin: { type: String, value: "" },
      twitter: { type: String, value: "" },
      videoConf: { type: String, value: "" }
    }
  });
});
