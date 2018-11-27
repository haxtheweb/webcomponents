define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "../node_modules/@polymer/paper-card/paper-card.js",
  "../node_modules/@polymer/iron-image/iron-image.js",
  "../node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js"
], function(
  _polymerLegacy,
  _materializecssStyles,
  _paperCard,
  _ironImage,
  _lrndesignAvatar,
  _ironIcon
) {
  "use strict";
  function _templateObject_67f93ec0f1e611e8a92ccde37bfe9ae7() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles"></style>\n    <style>\n       :host {\n        display: inline-flex;\n      }\n      :host([size="micro"]) {\n        transform: scale(.5);\n      }\n      :host([size="small"]) {\n        transform: scale(.8);\n      }\n\n      paper-card {\n        border-radius: 4px;\n        margin: 0;\n        width: 100%;\n      }\n\n      .card-actions {\n        background-color: #f5f5f5;\n        border-radius: 0 0 4px 4px;\n        padding: 0 8px;\n      }\n      .card-actions .card-action-details{\n        display: inline-block;\n        vertical-align: middle;\n        vertical-align: -webkit-baseline-middle;\n        width: 80%;\n      }\n      #avatar {\n        display: inline-block;\n        vertical-align: text-top;\n        transform: scale(.8);\n      }\n\n      .card-control-height {\n        height: 240px;\n      }\n\n      [elevation="0"] {\n        border: solid 1px #EEEEEE;\n      }\n\n      .text-right {\n        text-align: right;\n      }\n\n      .text-left {\n        text-align: left;\n      }\n\n      .name, .title {\n        color: #222;\n        font-size: 12.8px;\n        font-weight: 600;\n        line-height: 20px;\n        padding: 0 12px;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        margin-top: 8px;\n      }\n\n      .title {\n        font-size: 11.2px;\n        font-weight: 400;\n      }\n\n      .divider {\n        height: 1px;\n        width: 100%;\n        background: #efefef;\n      }\n\n      .course-icon {\n        --iron-icon-height: 100%;\n        --iron-icon-width: 100%;\n        overflow: hidden;\n        color: grey;\n      }\n      .course-icon:hover,\n      .course-icon:focus {\n        color: black;\n      }\n\n      .center {\n        margin: auto;\n        width: 80%;\n        padding: 16px;\n      }\n\n      .link {\n        font-size: 16px;\n        line-height: 16px;\n      }\n\n      .course-info {\n        width: 100%;\n      }\n      .course-preview {\n        height: 160px;\n      }\n      lrndesign-avatar {\n        margin: -16px 8px 0 0;\n        position: absolute;\n        right: 0;\n      }\n\n      .card-content {\n        padding: 0;\n        margin: 0;\n        overflow: hidden;\n      }\n\n      .inline {\n        display: inline;\n      }\n\n    </style>\n    <paper-card elevation="[[elevation]]">\n      <div class="card-content card-control-height card-control-center">\n        <div class="course-preview">\n          <iron-icon class="course-icon" icon="[[icon]]" hidden$="[[!icon]]"></iron-icon>\n          <iron-image style="width:100%; height:100%; background-color: lightgray;" sizing="cover" preload="" fade="" src="[[image]]" hidden$="[[!image]]"></iron-image>\n        </div>\n        <lrndesign-avatar label="[[name]]" jdenticon="" color="[[color]] darken-4">\n        </lrndesign-avatar>\n        <div class="course-info">\n          <div class="divider"></div>\n          <div class="name">[[name]]</div>\n          <div class="title">[[title]]</div>\n        </div>\n      </div>\n      <div class="card-actions" hidden="">\n        <div class="card-action-details">\n        </div>\n      </div>\n    </paper-card>\n'
      ],
      [
        '\n    <style include="materializecss-styles"></style>\n    <style>\n       :host {\n        display: inline-flex;\n      }\n      :host([size="micro"]) {\n        transform: scale(.5);\n      }\n      :host([size="small"]) {\n        transform: scale(.8);\n      }\n\n      paper-card {\n        border-radius: 4px;\n        margin: 0;\n        width: 100%;\n      }\n\n      .card-actions {\n        background-color: #f5f5f5;\n        border-radius: 0 0 4px 4px;\n        padding: 0 8px;\n      }\n      .card-actions .card-action-details{\n        display: inline-block;\n        vertical-align: middle;\n        vertical-align: -webkit-baseline-middle;\n        width: 80%;\n      }\n      #avatar {\n        display: inline-block;\n        vertical-align: text-top;\n        transform: scale(.8);\n      }\n\n      .card-control-height {\n        height: 240px;\n      }\n\n      [elevation="0"] {\n        border: solid 1px #EEEEEE;\n      }\n\n      .text-right {\n        text-align: right;\n      }\n\n      .text-left {\n        text-align: left;\n      }\n\n      .name, .title {\n        color: #222;\n        font-size: 12.8px;\n        font-weight: 600;\n        line-height: 20px;\n        padding: 0 12px;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        margin-top: 8px;\n      }\n\n      .title {\n        font-size: 11.2px;\n        font-weight: 400;\n      }\n\n      .divider {\n        height: 1px;\n        width: 100%;\n        background: #efefef;\n      }\n\n      .course-icon {\n        --iron-icon-height: 100%;\n        --iron-icon-width: 100%;\n        overflow: hidden;\n        color: grey;\n      }\n      .course-icon:hover,\n      .course-icon:focus {\n        color: black;\n      }\n\n      .center {\n        margin: auto;\n        width: 80%;\n        padding: 16px;\n      }\n\n      .link {\n        font-size: 16px;\n        line-height: 16px;\n      }\n\n      .course-info {\n        width: 100%;\n      }\n      .course-preview {\n        height: 160px;\n      }\n      lrndesign-avatar {\n        margin: -16px 8px 0 0;\n        position: absolute;\n        right: 0;\n      }\n\n      .card-content {\n        padding: 0;\n        margin: 0;\n        overflow: hidden;\n      }\n\n      .inline {\n        display: inline;\n      }\n\n    </style>\n    <paper-card elevation="[[elevation]]">\n      <div class="card-content card-control-height card-control-center">\n        <div class="course-preview">\n          <iron-icon class="course-icon" icon="[[icon]]" hidden\\$="[[!icon]]"></iron-icon>\n          <iron-image style="width:100%; height:100%; background-color: lightgray;" sizing="cover" preload="" fade="" src="[[image]]" hidden\\$="[[!image]]"></iron-image>\n        </div>\n        <lrndesign-avatar label="[[name]]" jdenticon="" color="[[color]] darken-4">\n        </lrndesign-avatar>\n        <div class="course-info">\n          <div class="divider"></div>\n          <div class="name">[[name]]</div>\n          <div class="title">[[title]]</div>\n        </div>\n      </div>\n      <div class="card-actions" hidden="">\n        <div class="card-action-details">\n        </div>\n      </div>\n    </paper-card>\n'
      ]
    );
    _templateObject_67f93ec0f1e611e8a92ccde37bfe9ae7 = function _templateObject_67f93ec0f1e611e8a92ccde37bfe9ae7() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_67f93ec0f1e611e8a92ccde37bfe9ae7()
    ),
    is: "lrnapp-cis-course-card",
    listeners: { mouseenter: "_mouseEnter", mouseleave: "_mouseLeave" },
    properties: {
      size: { type: String },
      image: { type: String },
      icon: { type: String, value: !1 },
      name: { type: String, value: "" },
      title: { type: String, value: "" },
      color: { type: String, value: "grey" },
      elevation: { type: Number, value: 1, reflectToAttribute: !0 }
    },
    _mouseEnter: function _mouseEnter(e) {
      this.__oldElevation = this.elevation;
      if (5 < this.elevation + 2) {
        this.elevation = 5;
      } else {
        this.elevation += 2;
      }
    },
    _mouseLeave: function _mouseLeave(e) {
      this.elevation = this.__oldElevation;
    }
  });
});
