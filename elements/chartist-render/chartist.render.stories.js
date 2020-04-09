import { html } from "lit-element/lit-element.js";
import { ChartistRender } from "@lrnwebcomponents/chartist-render/chartist-render.js";
import {
  withKnobs,
  withWebComponentsKnobs,
  text,
  select,
  boolean
} from "@open-wc/demoing-storybook";
import { StorybookUtilities } from "@lrnwebcomponents/storybook-utilities/storybook-utilities.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors";

export default {
  title: "Charts|Chartist",
  component: "chartist-render",
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    options: { selectedPanel: "storybookjs/knobs/panel" }
  }
};

const utils = new StorybookUtilities(),
  scale = {
    "ct-square": "ct-square (1:1)",
    "ct-minor-second": "ct-minor-second  (15:16)",
    "ct-major-second": "ct-major-second  (8:9)",
    "ct-minor-third": "ct-minor-third  (5:6)",
    "ct-major-third": "ct-major-third  (4:5)",
    "ct-perfect-fourth": "ct-perfect-fourth  (3:4)",
    "ct-perfect-fifth": "ct-perfect-fifth  (2:3)",
    "ct-minor-sixth": "ct-minor-sixth  (5:8)",
    "ct-golden-section": "ct-golden-section  (1:1.618)",
    "ct-major-sixth": "ct-major-sixth  (3:5)",
    "ct-minor-seventh": "ct-minor-seventh  (9:16)",
    "ct-major-seventh": "ct-major-seventh  (8:15)",
    "ct-octave": "ct-octave  (1:2)",
    "ct-major-tenth": "ct-major-tenth  (2:5)",
    "ct-major-eleventh": "ct-major-eleventh  (3:8)",
    "ct-major-twelfth": "ct-major-twelfth  (1:3)",
    "ct-double-octave": "ct-double-octave  (1:4`)"
  };
export const ChartistRenderPieStory = () => {
  let pie = {
      labels: ["Bananas", "Apples", "Grapes"],
      series: [20, 15, 40]
    },
    props = { ...ChartistRender.properties },
    input;
  /**
   *
   * [
   *   {
   *     title: "User-friendly title",
   *     property: "propertyName",
   *     slot: "slotName",
   *     inputMethod: "HAXschema-compatible inputMethod",
   *     options: {"value": "select field options object"},
   *     defaultValue: "optional default value to override random value generator",
   *   }
   * ]
   */
  delete props.chartData;
  delete props.type;
  delete props.scale;
  delete props.data;
  input = utils.getElementProperties(props);
  input = [
    ...input,
    ...[
      {
        property: "accentColor",
        inputMethod: "colorpicker",
        defaultValue: utils.getRandomColor()
      },
      { property: "dark", inputMethod: "boolean" },
      { 
        property: "data", 
        inputMethod: "object", 
        defaultValue: { "labels": ["Bananas", "Apples", "Grapes"], "series": [20, 15, 40] } },
      {
        property: "scale",
        inputMethod: "select",
        options: scale,
        defaultValue: "ct-square"
      },
      {
        property: "type",
        inputMethod: "select",
        options: ["bar", "line", "pie"],
        defaultValue: "pie"
      },
      { slot: "", inputMethod: "textarea" },
      {
        slot: "heading",
        inputMethod: "textarea",
        defaultValue: utils.getRandomTextarea()
      },
      {
        slot: "desc",
        inputMethod: "textarea",
        defaultValue: utils.getRandomTextarea()
      }
    ]
  ];
  console.log(props, input);
  return utils.makeElementFromClass(ChartistRender);
  /*return html`
    <chartist-render
      id=${text("Chart Id (id)", "line-or-pie", "property")}
      chart-title=${text("Chart Title (chartTitle)", "Chart Title", "property")}
      chart-desc=${text(
        "Chart Description (chartDesc)",
        "This is a pie chart",
        "property"
      )}
      .data=${pie}
      ?show-table=${boolean("Show Table (showTable)", false, "property")}
      scale=${select("Scale (scale)", scale, "ct-quarter", "property")}
      type="pie"
    >
    </chartist-render>
  `;*/
};
/*export const ChartistRenderLineOrBarStory = () => {
  let data = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      series: [
        [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9],
        [
          10,
          15,
          null,
          12,
          null,
          10,
          12,
          15,
          null,
          null,
          12,
          null,
          14,
          null,
          null,
          null
        ],
        [null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null, null, null]
      ]
    },
    options = {
      fullWidth: true,
      low: 0
    };
  return html`
    <chartist-render
      id=${text("Chart Id (id)", "line-or-pie", "property")}
      chart-title=${text("Chart Title (chartTitle)", "Chart Title", "property")}
      chart-desc=${text(
        "Chart Description (chartDesc)",
        "This is a bor or a line chart",
        "property"
      )}
      .data=${data}
      .options=${options}
      ?show-table=${boolean("Show Table (showTable)", false, "property")}
      scale=${select("Scale (scale)", scale, "ct-quarter", "property")}
      type=${select("Type (type)", ["line", "bar"], "line", "property")}
    >
    </chartist-render>
  `;
};*/
