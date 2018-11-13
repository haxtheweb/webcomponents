define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../node_modules/@lrnwebcomponents/chartist-render/chartist-render.js",
  "../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "../node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_ea33a2c0e70711e88d4837be723c7b45() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <iron-ajax auto="" url="{{dataSource}}" handle-as="text" last-response="{{rawData}}" on-response="handleResponse"></iron-ajax>\n    <chartist-render id="chartist" type="pie" scale$="[[scale]]" chart-title$="[[chartTitle]]" chart-desc$="[[chartDesc]]" data$="[[data]]" options$="{{options}}" responsive-options$="[[responsiveOptions]]"></chartist-render>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <iron-ajax auto="" url="{{dataSource}}" handle-as="text" last-response="{{rawData}}" on-response="handleResponse"></iron-ajax>\n    <chartist-render id="chartist" type="pie" scale\\$="[[scale]]" chart-title\\$="[[chartTitle]]" chart-desc\\$="[[chartDesc]]" data\\$="[[data]]" options\\$="{{options}}" responsive-options\\$="[[responsiveOptions]]"></chartist-render>\n'
      ]
    );
    _templateObject_ea33a2c0e70711e88d4837be723c7b45 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_ea33a2c0e70711e88d4837be723c7b45()
    ),
    is: "lrndesign-pie",
    behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
    properties: {
      chartTitle: { type: String, value: null },
      chartDesc: { type: String, value: "" },
      scale: { type: String, notify: !0, value: "ct-octave" },
      data: { type: Array, notify: !0, value: [] },
      options: { type: Object, notify: !0, value: {} },
      width: { type: String, value: void 0 },
      height: { type: String, value: void 0 },
      paddingTop: { type: Number, value: 5 },
      paddingRight: { type: Number, value: 5 },
      paddingBottom: { type: Number, value: 5 },
      paddingLeft: { type: Number, value: 5 },
      startAngle: { type: Number, value: 0 },
      total: { type: Number, value: void 0 },
      donut: { type: Boolean, value: !1 },
      showLabel: { type: Boolean, value: !0 },
      labelOffset: { type: Number, value: 0 },
      labelPosition: { type: String, value: "inside" },
      labelDirection: { type: String, value: "neutral" },
      reverseData: { type: Boolean, value: !1 },
      ignoreEmptyValues: { type: Boolean, value: !1 },
      responsiveOptions: { type: Array, value: [] },
      dataSource: { type: String, notify: !0 },
      rawData: { type: String, notify: !0, value: "" }
    },
    handleResponse: function handleResponse() {
      var root = this,
        raw = root.CSVtoArray(root.rawData);
      root.data = { labels: raw[0], series: raw.slice(1, raw.length)[0] };
      root.$.chartist.makeChart();
    },
    attached: function attached() {
      this.setHaxProperties({
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "Pie Chart",
          description: "Creates an accessible pie chart based on a CSV.",
          icon: "editor:pie-chart",
          color: "green darken-4",
          groups: ["Data", "Presentation"],
          handles: [{ type: "data", url: "csvFile" }],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [
            {
              property: "data-source",
              title: "CSV File",
              description: "The URL for your CSV file.",
              inputMethod: "textfield",
              icon: "link",
              validationType: "url",
              required: !0
            },
            {
              property: "chartTitle",
              title: "Chart Title",
              description: "Accessible alt text for your chart.",
              inputMethod: "textfield",
              icon: "text-field",
              required: !0
            },
            {
              property: "chartDesc",
              title: "Chart Description",
              description: "Accessible description of your chart.",
              inputMethod: "textfield",
              icon: "text-field"
            },
            {
              property: "donut",
              title: "Display as donut?",
              description: "Display as a donut chart instead of a pie chart.",
              inputMethod: "boolean",
              icon: "check-box"
            }
          ],
          configure: [
            {
              property: "width",
              title: "Width",
              description: "The width of the chart.",
              inputMethod: "textfield",
              icon: "text-field"
            },
            {
              property: "height",
              title: "Height",
              description: "The height of the chart.",
              inputMethod: "textfield",
              icon: "text-field"
            },
            {
              property: "paddingTop",
              title: "Padding-Top",
              description: "The padding at the top of the chart.",
              inputMethod: "textfield",
              icon: "text-field"
            },
            {
              property: "paddingRight",
              title: "Padding-Right",
              description: "The padding at the right of the chart.",
              inputMethod: "textfield",
              icon: "text-field"
            },
            {
              property: "paddingBottom",
              title: "Padding-Bottom",
              description: "The padding at the bottom of the chart.",
              inputMethod: "textfield",
              icon: "text-field"
            },
            {
              property: "paddingLeft",
              title: "Padding-Left",
              description: "The padding at the left of the chart.",
              inputMethod: "textfield",
              icon: "text-field"
            }
          ],
          advanced: [
            {
              property: "scale",
              title: "Scale Name",
              description:
                "The ratio of width:height of the chart (See https://gionkunz.github.io/chartist-js/getting-started.html#default-sass-settings for $ct-scales and $ct-scales-names).",
              inputMethod: "textfield",
              icon: "text-field"
            },
            {
              property: "startAngle",
              title: "Start Angle",
              description: "The angle where pie slices will start.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            },
            {
              property: "total",
              title: "Total of All Slices",
              description:
                "Optional total you can specify. By specifying a total value, the sum of the values in the series must be this total in order to draw a full pie. You can use this parameter to draw only parts of a pie or gauge charts.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            },
            {
              property: "showLabel",
              title: "Show labels?",
              description: "Should chart labels be shown?",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "labelOffset",
              title: "Label Offset",
              description:
                "Label position offset from the standard position which is half distance of the radius. This value can be either positive or negative. Positive values will position the label away from the center.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            },
            {
              property: "labelPosition",
              title: "Label Position",
              description:
                'This option can be set to "inside", "outside" or "center". Positioned with "inside" the labels will be placed on half the distance of the radius to the border of the Pie by respecting the "Label Offset". The "outside" option will place the labels at the border of the pie and "center" will place the labels in the absolute center point of the chart. The "center" option only makes sense in conjunction with the "Label Offset" option.',
              inputMethod: "textfield",
              icon: "text-field"
            },
            {
              property: "labelDirection",
              title: "Label Direction",
              description:
                'Label direction can be "neutral", "explode" or "implode". The label\'s anchor will be positioned based on those settings as well as the fact if the labels are on the right or left side of the center of the chart. Usually explode is useful when labels are positioned far away from the center.',
              inputMethod: "textfield",
              icon: "text-field"
            },
            {
              property: "reverseData",
              title: "Reverse Data",
              description:
                "Reverse data including labels, the series order as well as the whole series data arrays.",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "ignoreEmptyValues",
              title: "Ignore empty values?",
              description:
                "Empty values will be ignored to avoid drawing unncessary slices and labels.",
              inputMethod: "boolean",
              icon: "check-box"
            }
          ]
        }
      });
    },
    _getOptions: function _getOptions() {
      console.log("getting options");
      var options = {
        width: this.width,
        height: this.height,
        startAngle: this.startAngle,
        total: this.total,
        donut: this.donut,
        showLabel: this.showLabel,
        labelOffset: this.labelOffset,
        labelPosition: this.labelPosition,
        labelDirection: this.labelDirection,
        reverseData: this.reverseData,
        ignoreEmptyValues: this.ignoreEmptyValues
      };
      console.log(options);
      return options;
    },
    CSVtoArray: function CSVtoArray(text) {
      var p = "",
        row = [""],
        ret = [row],
        i = 0,
        r = 0,
        s = !0,
        l;
      for (l in text) {
        l = text[l];
        if ('"' === l) {
          if (s && l === p) row[i] += l;
          s = !s;
        } else if ("," === l && s) {
          if (null !== row[i].trim().match(/^\d+$/m))
            row[i] = parseInt(row[i].trim());
          l = row[++i] = "";
        } else if ("\n" === l && s) {
          if ("\r" === p) row[i] = row[i].slice(0, -1);
          if (null !== row[i].trim().match(/^\d+$/m))
            row[i] = parseInt(row[i].trim());
          row = ret[++r] = [(l = "")];
          i = 0;
        } else row[i] += l;
        p = l;
      }
      if (null !== row[i].trim().match(/^\d+$/m))
        row[i] = parseInt(row[i].trim());
      return ret;
    }
  });
});
