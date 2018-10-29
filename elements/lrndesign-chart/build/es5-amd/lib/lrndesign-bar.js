define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../node_modules/@lrnwebcomponents/chartist-render/chartist-render.js",
  "../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "../node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_6135fab0db3411e8a3c2fda6dbff6d88() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <iron-ajax id="datasource" url="{{dataSource}}" handle-as="text" last-response="{{rawData}}" on-response="handleResponse"></iron-ajax>\n    <chartist-render id="chartist" type="bar" scale$="[[scale]]" chart-title$="[[chartTitle]]" chart-desc$="[[chartDesc]]" data$="[[data]]" options$="{{options}}" responsive-options$="[[responsiveOptions]]"></chartist-render>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <iron-ajax id="datasource" url="{{dataSource}}" handle-as="text" last-response="{{rawData}}" on-response="handleResponse"></iron-ajax>\n    <chartist-render id="chartist" type="bar" scale\\$="[[scale]]" chart-title\\$="[[chartTitle]]" chart-desc\\$="[[chartDesc]]" data\\$="[[data]]" options\\$="{{options}}" responsive-options\\$="[[responsiveOptions]]"></chartist-render>\n'
      ]
    );
    _templateObject_6135fab0db3411e8a3c2fda6dbff6d88 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_6135fab0db3411e8a3c2fda6dbff6d88()
    ),
    is: "lrndesign-bar",
    behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
    properties: {
      chartId: { type: String, value: "chart" },
      chartTitle: { type: String, value: null },
      chartDesc: { type: String, value: "" },
      scale: { type: String, notify: !0 },
      data: { type: Object, value: {}, observer: "_dataUpdated" },
      options: { type: Object, notify: !0, value: {} },
      width: { type: String, value: void 0 },
      height: { type: String, value: void 0 },
      paddingTop: { type: Number, value: 5 },
      paddingRight: { type: Number, value: 5 },
      paddingBottom: { type: Number, value: 5 },
      paddingLeft: { type: Number, value: 5 },
      high: { type: Number, value: void 0 },
      low: { type: Number, value: void 0 },
      referenceValue: { type: Number, value: 0 },
      seriesBarDistance: { type: Number, value: 15 },
      stackBars: { type: Boolean, value: !1 },
      stackModeAccumulate: { type: Boolean, value: !0 },
      horizontalBars: { type: Boolean, value: !1 },
      distributeSeries: { type: Boolean, value: !1 },
      reverseData: { type: Boolean, value: !1 },
      showGridBackground: { type: Boolean, value: !1 },
      axisXOffset: { type: Number, value: 30 },
      axisYOffset: { type: Number, value: 30 },
      axisXTopLeft: { type: Boolean, value: !1 },
      axisYTopLeft: { type: Boolean, value: !0 },
      axisXLabelOffsetX: { type: Number, value: 0 },
      axisXLabelOffsetY: { type: Number, value: 0 },
      axisYLabelOffsetX: { type: Number, value: 0 },
      axisYLabelOffsetY: { type: Number, value: 0 },
      axisXShowLabel: { type: Boolean, value: !0 },
      axisYshowLabel: { type: Boolean, value: !0 },
      axisXShowGrid: { type: Boolean, value: !0 },
      axisYshowGrid: { type: Boolean, value: !0 },
      axisXOnlyInteger: { type: Boolean, value: !1 },
      axisYOnlyInteger: { type: Boolean, value: !1 },
      responsiveOptions: { type: Array, value: [] },
      dataSource: { type: String, notify: !0, observer: "_dataSourceChanged" },
      rawData: { type: String, notify: !0, value: "" }
    },
    _dataSourceChanged: function _dataSourceChanged(newValue) {
      if (babelHelpers.typeof(newValue) !== void 0) {
        this.$.datasource.generateRequest();
      }
    },
    handleResponse: function handleResponse() {
      var raw = this.CSVtoArray(this.rawData);
      this.set("data", {});
      this.set("data", { labels: raw[0], series: raw.slice(1, raw.length) });
    },
    _dataUpdated: function _dataUpdated() {
      this.set("options", {});
      this.set("options", this._getOptions());
      this.$.chartist.makeChart();
    },
    attached: function attached() {
      this.setHaxProperties({
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "Bar Chart",
          description: "Creates an accessible bar chart based on a CSV.",
          icon: "editor:nsert-chart",
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
              property: "stackBars",
              title: "Stacked bars?",
              description: "Display as a stacked bar graph.",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "horizontalBars",
              title: "Horizonal bars?",
              description: "Display as a horizonal bar graph.",
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
            },
            {
              property: "high",
              title: "Highest Displayed Value",
              description:
                "Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            },
            {
              property: "low",
              title: "Lowest Displayed Value",
              description:
                "Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            },
            {
              property: "referenceValue",
              title: "Reference Value",
              description:
                "Unless low/high are explicitly set, bar chart will be centered at zero by default. Set referenceValue to null to auto scale.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            },
            {
              property: "axisXShowGrid",
              title: "X-Axis Grid",
              description: "Should axis X grid be shown?",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "axisYShowGrid",
              title: "Y-Axis Grid",
              description: "Should Y-axis grid be shown?",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "showGridBackground",
              title: "Show Grid Background?",
              description:
                "If the bar chart should add a background fill to the .ct-grids group.",
              inputMethod: "boolean",
              icon: "check-box"
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
              property: "reverseData",
              title: "Reverse Data",
              description:
                "Reverse data including labels, the series order as well as the whole series data arrays.",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "stackModeAccumulate",
              title: "Stacked Bars Accumulate",
              description:
                'If set to "true" this property will form a total for each series point. If set to "false" this property will force the stacked bars to draw from the zero line. This will also influence the y-axis and the overall bounds of the chart. In stacked mode the seriesBarDistance property will have no effect.',
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "distributeSeries",
              title: "Distribute Series",
              description:
                'If set to "true" then each bar will represent a series and the data array is expected to be a one dimensional array of data values rather than a series array of series. This is useful if the bar chart should represent a profile rather than some data over time.',
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "axisXOnlyInteger",
              title: "X-Axis Integers",
              description: "Round X-Axis Scale to Integers",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "axisYOnlyInteger",
              title: "Y-Axis Integers",
              description: "Round Y-Axis Scale to Integers",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "axisXShowLabel",
              title: "X-Axis Labels",
              description: "Should axis X labels be shown?",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "axisYShowLabel",
              title: "Y-Axis Labels",
              description: "Should Y-axis labels be shown?",
              inputMethod: "boolean",
              icon: "check-box"
            },
            {
              property: "axisXLabelOffsetX",
              title: "X-Axis Label X-Offset",
              description: "Horizontal Offset offset of X-Axis labels.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            },
            {
              property: "axisXLabelOffsetY",
              title: "X-Axis Label Y-Offset",
              description: "Vertical Offset offset of X-Axis labels.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            },
            {
              property: "axisYLabelOffsetX",
              title: "Y-Axis Label X-Offset",
              description: "Horizontal Offset offset of Y-Axis labels.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            },
            {
              property: "axisYLabelOffsetY",
              title: "Y-Axis Label Y-Offset",
              description: "Vertical Offset offset of Y-Axis labels.",
              inputMethod: "textfield",
              icon: "text-field",
              validationType: "number"
            }
          ]
        }
      });
    },
    _getOptions: function _getOptions() {
      return {
        width: this.width,
        height: this.height,
        high: this.high,
        low: this.low,
        chartPadding: {
          top: this.paddingTop,
          right: this.paddingRight,
          bottom: this.paddingBottom,
          left: this.paddingLeft
        },
        referenceValue: this.referenceValue,
        seriesBarDistance: this.seriesBarDistance,
        stackBars: this.stackBars,
        stackMode: !0 == this.stackModeAccumulate ? "accumulate" : "overlap",
        horizontalBars: this.horizontalBars,
        distributeSeries: this.distributeSeries,
        reverseData: this.reverseData,
        showGridBackground: this.showGridBackground,
        axisX: {
          offset: this.axisXOffset,
          position: !0 == this.axisXTopLeft ? "start" : "end",
          labelOffset: { x: this.axisXLabelOffsetX, y: this.axisXLabelOffsetY },
          showLabel: this.axisXShowLabel,
          showGrid: this.axisXShowGrid,
          onlyInteger: this.axisXOnlyInteger
        },
        axisY: {
          offset: this.axisYOffset,
          position: !0 == this.axisYTopLeft ? "start" : "end",
          labelOffset: { x: this.axisYLabelOffsetX, y: this.axisYLabelOffsetY },
          showLabel: this.axisYShowLabel,
          showGrid: this.axisYShowGrid,
          onlyInteger: this.axisYOnlyInteger
        }
      };
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
