import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "chartist-render/chartist-render.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
`lrndesign-pie`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <iron-ajax auto="" url="{{dataSource}}" handle-as="text" last-response="{{rawData}}" on-response="handleResponse"></iron-ajax>
    <chartist-render id="chartist" type="pie" scale\$="[[scale]]" chart-title\$="[[chartTitle]]" chart-desc\$="[[chartDesc]]" data\$="[[data]]" options\$="{{options}}" responsive-options\$="[[responsiveOptions]]"></chartist-render>
`,

  is: "lrndesign-pie",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * The chart title used for accessibility.
     */
    chartTitle: {
      type: String,
      value: null
    },
    /**
     * The chart description used for accessibility.
     */
    chartDesc: {
      type: String,
      value: ""
    },
    /**
     * Scale of the chart.
     */
    scale: {
      type: String,
      notify: true,
      value: "ct-octave"
    },
    /**
     * Data as an array.
     */
    data: {
      type: Array,
      notify: true,
      value: []
    },
    /**
     * Options as an array.
     */
    options: {
      type: Object,
      notify: true,
      value: {}
    },
    /**
     * Fixed width for the chart as a string (i.e. '100px' or '50%').
     */
    width: {
      type: String,
      value: undefined
    },
    /**
     * Fixed height for the chart as a string (i.e. '100px' or '50%').
     */
    height: {
      type: String,
      value: undefined
    },
    /**
     *  Padding-top for chart.
     */
    paddingTop: {
      type: Number,
      value: 5
    },
    /**
     *  Padding-right for chart.
     */
    paddingRight: {
      type: Number,
      value: 5
    },
    /**
     *  Padding-bottom for chart.
     */
    paddingBottom: {
      type: Number,
      value: 5
    },
    /**
     *  Padding-left for chart.
     */
    paddingLeft: {
      type: Number,
      value: 5
    },
    /**
     *  Start angle of the pie chart in degrees where 0 points north.
     * A higher value offsets the start angle clockwise..
     */
    startAngle: {
      type: Number,
      value: 0
    },
    /**
     * Optional total you can specify. By specifying a total value,
     * the sum of the values in the series must be this total in order
     * to draw a full pie. You can use this parameter to draw only parts
     * of a pie or gauge charts.
     */
    total: {
      type: Number,
      value: undefined
    },
    /**
     * Displays chart as donut instead of pie.
     */
    donut: {
      type: Boolean,
      value: false
    },
    /**
     * If a label should be shown.
     */
    showLabel: {
      type: Boolean,
      value: true
    },
    /**
     * Label position offset from the standard position
     * which is half distance of the radius.
     * This value can be either positive or negative.
     * Positive values will position the label away from the center.
     */
    labelOffset: {
      type: Number,
      value: 0
    },
    /**
     * This option can be set to 'inside', 'outside' or 'center'.
     * Positioned with 'inside' the labels will be placed on half the distance
     * of the radius to the border of the Pie by respecting the 'labelOffset'.
     * The 'outside' option will place the labels at the border of the pie
     * and 'center' will place the labels in the absolute center point
     * of the chart. The 'center' option only makes sense
     * in conjunction with the 'labelOffset' option.
     */
    labelPosition: {
      type: String,
      value: "inside"
    },
    /**
     * Label direction can be 'neutral', 'explode' or 'implode'.
     * The labels anchor will be positioned based on those settings
     * as well as the fact if the labels are on the right or
     * left side of the center of the chart.
     * Usually explode is useful when labels are positioned
     * far away from the center.
     */
    labelDirection: {
      type: String,
      value: "neutral"
    },
    /**
     * Reverse data including labels, the series order as well as
     * the whole series data arrays.
     */
    reverseData: {
      type: Boolean,
      value: false
    },
    /**
     * Empty values will be ignored to avoid drawing
     * unncessary slices and labels
     */
    ignoreEmptyValues: {
      type: Boolean,
      value: false
    },
    /**
     * The responsive options.
     * (See https://gionkunz.github.io/chartist-js/api-documentation.html.)
     */
    responsiveOptions: {
      type: Array,
      value: []
    },
    /**
     * Location of the CSV file.
     */
    dataSource: {
      type: String,
      notify: true
    },
    /**
     * Raw data pulled in from the csv file.
     */
    rawData: {
      type: String,
      notify: true,
      value: ""
    }
  },

  /**
   * Convert from csv text to an array in the table function
   */
  handleResponse: function(e) {
    let root = this;
    let raw = root.CSVtoArray(root.rawData);
    root.data = {
      labels: raw[0],
      series: raw.slice(1, raw.length)[0]
    };
    //root.options = root._getOptions();
    let chart = root.$.chartist.makeChart();
  },

  /**
   * wire it for hax-body
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Pie Chart",
        description: "Creates an accessible pie chart based on a CSV.",
        icon: "editor:pie-chart",
        color: "green darken-4",
        groups: ["Data", "Presentation"],
        handles: [
          {
            type: "data",
            url: "csvFile"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
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
            required: true
          },
          {
            property: "chartTitle",
            title: "Chart Title",
            description: "Accessible alt text for your chart.",
            inputMethod: "textfield",
            icon: "text-field",
            required: true
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
    };

    this.setHaxProperties(props);
  },

  /**
   * returns options as an array
   */
  _getOptions: function() {
    console.log("getting options");
    let options = {
      width: this.width,
      height: this.height,
      /*'chartPadding': {
        'top': this.paddingTop,
        'right': this.paddingRight,
        'bottom': this.paddingBottom,
        'left': this.paddingLeft
      },*/
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

  /**
   * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
   */
  CSVtoArray: function(text) {
    let p = "",
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
        if (row[i].trim().match(/^\d+$/m) !== null)
          row[i] = parseInt(row[i].trim());
        l = row[++i] = "";
      } else if ("\n" === l && s) {
        if ("\r" === p) row[i] = row[i].slice(0, -1);
        if (row[i].trim().match(/^\d+$/m) !== null)
          row[i] = parseInt(row[i].trim());
        row = ret[++r] = [(l = "")];
        i = 0;
      } else row[i] += l;
      p = l;
    }
    if (row[i].trim().match(/^\d+$/m) !== null)
      row[i] = parseInt(row[i].trim());
    return ret;
  }
});
