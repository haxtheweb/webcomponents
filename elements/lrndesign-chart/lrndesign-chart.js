/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { ChartistRenderSuper } from "@haxtheweb/chartist-render/chartist-render.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { DDDChartStyles } from "@haxtheweb/d-d-d/lib/DDDChart.js";
import { DDDTableStyles } from "@haxtheweb/d-d-d/lib/DDDTable.js";
/**
 * `lrndesign-chart`
 * common properties and behaviors for lrndesign chart types
 *
 * Renders as a DDD block: a header ("Data · Bar chart", "Line chart" or
 * "Pie chart") titled from `chart-title` or the heading slot, the
 * description under it, the chart, a legend of the series, and the data
 * table (the chart's text alternative). Header actions show / hide the
 * table (`show-table`) and download the CSV when there is a `data-source`.
 *
 * Series colours come from the shared DDD chart palette (DDDChart.js:
 * --ddd-chart-1 ... --ddd-chart-8, light / dark pairs that stay apart for
 * colour-blind readers); `accent-color` sets the first series colour.
 * Surfaces, gridlines and labels follow light / dark mode; `dark` forces
 * the dark scheme.
 *
 * @extends ChartistRenderSuper
 * @see @haxtheweb/chartist-render/chartist-render.js
 * @see @haxtheweb/d-d-d/d-d-d.js
 */
const LrndesignChart = function (SuperClass) {
  return class extends I18NMixin(ChartistRenderSuper(SuperClass)) {
    //styles function
    static get styles() {
      return [
        super.styles,
        DDDBlockStyles,
        DDDAccentStyles,
        DDDChartStyles,
        DDDTableStyles,
        css`
          /* chartist reads --chartist-color-1 ... 15; they come from the
             shared DDD chart palette and repeat after eight. accent-color
             only changes the first series */
          :host {
            background-color: transparent;
            color: light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
            --chartist-padding: 0;
            --chartist-color-1: var(--ddd-accent-color, var(--ddd-chart-1));
            --chartist-color-2: var(--ddd-chart-2);
            --chartist-color-3: var(--ddd-chart-3);
            --chartist-color-4: var(--ddd-chart-4);
            --chartist-color-5: var(--ddd-chart-5);
            --chartist-color-6: var(--ddd-chart-6);
            --chartist-color-7: var(--ddd-chart-7);
            --chartist-color-8: var(--ddd-chart-8);
            --chartist-color-9: var(--ddd-chart-1);
            --chartist-color-10: var(--ddd-chart-2);
            --chartist-color-11: var(--ddd-chart-3);
            --chartist-color-12: var(--ddd-chart-4);
            --chartist-color-13: var(--ddd-chart-5);
            --chartist-color-14: var(--ddd-chart-6);
            --chartist-color-15: var(--ddd-chart-7);
          }

          /* grey is the SimpleColors default every element starts with, so
             it reads as no accent chosen and series 1 keeps the palette */
          :host([accent-color="grey"]) {
            --chartist-color-1: var(--ddd-chart-1);
          }

          :host([dark]) {
            color-scheme: dark;
            --ddd-block-background: var(--ddd-theme-default-potentialMidnight);
          }

          .ddd-block-title[hidden],
          .desc[hidden] {
            display: none;
          }
          /* the slotted heading is the title line; it keeps its own element
             (and stays editable in HAX) but takes the block title look */
          .ddd-block-title ::slotted(*) {
            margin: 0 !important;
            padding: 0 !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            letter-spacing: normal !important;
            text-transform: none !important;
            color: inherit !important;
          }
          .ddd-block-body {
            padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          }
          .desc {
            font-size: var(--ddd-font-size-4xs);
            line-height: var(--ddd-lh-140);
            border-bottom: var(--ddd-border-xs);
            border-color: light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
          }
          .desc ::slotted(*) {
            margin: 0;
          }

          #chart {
            font-family: var(--ddd-font-navigation);
            --chartist-grid-color: var(--ddd-chart-grid);
            --chartist-bg-color: transparent;
            --chartist-text-color: var(--ddd-chart-label);
          }

          :host([label-position="inside"]) .ct-label,
          :host(:not([label-position="outside"])) svg.ct-chart-pie .ct-label {
            --chartist-text-color: light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-potentialMidnight)
            );
          }

          .table:not(.sr-only) {
            margin-top: var(--ddd-spacing-3);
            overflow-x: auto;
          }
          /* the data table takes the shared DDD table look (DDDTable.js) */

          ul.legend {
            display: flex;
            flex-wrap: wrap;
            gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
            list-style: none;
            margin: var(--ddd-spacing-2) 0 0;
            padding: 0;
            font-family: var(--ddd-font-navigation);
            font-size: var(--ddd-font-size-5xs);
            font-weight: var(--ddd-font-weight-medium);
            color: var(--ddd-chart-label);
          }
          ul.legend li {
            display: inline-flex;
            align-items: center;
            gap: var(--ddd-spacing-2);
          }
          .swatch {
            display: inline-block;
            flex: none;
            width: var(--ddd-spacing-3);
            height: var(--ddd-spacing-3);
            border-radius: var(--ddd-radius-xs);
          }
        `,
      ];
    }

    /**
     * Header label for this chart type.
     */
    get blockLabel() {
      if (this.type === "line") return this.t.lineChart;
      if (this.type === "pie") return this.t.pieChart;
      return this.t.barChart;
    }

    /**
     * Names for the legend, in series order: the slices of a pie (or a bar
     * chart with distribute-series) are the column headings; the series of a
     * bar or line chart are the row headings. Falls back to "Series n" when
     * the data names nothing.
     */
    get legendItems() {
      const data = this.data;
      if (!Array.isArray(data) || data.length === 0) return [];
      const rowHeads = !!(data[1] && data[1][0] && isNaN(data[1][0])),
        colHeads = !!(
          data[0] &&
          data[0][rowHeads ? 1 : 0] &&
          isNaN(data[0][rowHeads ? 1 : 0])
        ),
        // a trailing newline in a CSV leaves an empty row; it is no series
        body = (colHeads ? data.slice(1) : data).filter(
          (row) =>
            Array.isArray(row) &&
            row.some((cell) => cell !== "" && cell !== undefined),
        ),
        fallback = (i) => String(this.t.series).replace("{n}", String(i + 1));
      let names = [];
      if (
        this.type === "pie" ||
        (this.type === "bar" && this.distributeSeries)
      ) {
        const first = body[0] || [];
        const count = rowHeads ? first.length - 1 : first.length;
        const heads = colHeads ? (rowHeads ? data[0].slice(1) : data[0]) : [];
        for (let i = 0; i < count; i++) {
          names.push(heads[i] !== undefined ? String(heads[i]) : fallback(i));
        }
      } else {
        names = body.map((row, i) =>
          rowHeads && row[0] !== undefined ? String(row[0]) : fallback(i),
        );
      }
      if (this.reverseData) names.reverse();
      return names;
    }

    _lrndesignSlotChange(e) {
      const slot = e.target,
        has = slot
          .assignedNodes({ flatten: true })
          .some((node) => (node.textContent || "").trim() !== "");
      if (slot.name === "heading") {
        this._hasHeading = has;
        if (this.__headingSlotChange) this.__headingSlotChange();
      } else if (slot.name === "desc") {
        this._hasDesc = has;
      }
    }

    /**
     * Cell text: tables read from the light DOM carry innerHTML, so turn
     * markup and entities into plain text rather than rendering them.
     */
    _cellText(cell) {
      const str = cell === undefined || cell === null ? "" : String(cell);
      if (!/[<&]/.test(str) || !globalThis.DOMParser) return str;
      return new globalThis.DOMParser().parseFromString(str, "text/html").body
        .textContent;
    }

    _isNumeric(cell) {
      return (
        typeof cell === "number" ||
        (typeof cell === "string" &&
          cell.trim() !== "" &&
          !isNaN(cell.trim().replace(/[$,%]/g, "")))
      );
    }

    /**
     * The data as a DDD styled table: the chart's text alternative, shown
     * with the table toggle. Column headings from the first row and row
     * headings from the first column when the data has them, the same
     * reading chartist-render uses.
     */
    renderDataTable() {
      const data = this.data;
      if (!Array.isArray(data) || data.length === 0) return nothing;
      const rowHeads = !!(data[1] && data[1][0] && isNaN(data[1][0])),
        colHeads = !!(
          data[0] &&
          data[0][rowHeads ? 1 : 0] &&
          isNaN(data[0][rowHeads ? 1 : 0])
        ),
        body = (colHeads ? data.slice(1) : data).filter(
          (row) =>
            Array.isArray(row) &&
            row.some((cell) => cell !== "" && cell !== undefined),
        );
      return html`<table class="data ddd-table">
        ${
          colHeads
            ? html`<thead>
                <tr>
                  ${data[0].map(
                    (cell, i) =>
                      html`<th
                        scope="col"
                        class="${i > 0 || !rowHeads ? "num" : ""}"
                      >
                        ${this._cellText(cell)}
                      </th>`,
                  )}
                </tr>
              </thead>`
            : nothing
        }
        <tbody>
          ${body.map(
            (row) =>
              html`<tr>
                ${row.map((cell, i) =>
                  rowHeads && i === 0
                    ? html`<th scope="row">${this._cellText(cell)}</th>`
                    : html`<td class="${this._isNumeric(cell) ? "num" : ""}">
                        ${this._cellText(cell)}
                      </td>`,
                )}
              </tr>`,
          )}
        </tbody>
      </table>`;
    }

    _toggleTable() {
      this.showTable = !this.showTable;
    }

    // render function
    render() {
      const id = this.__chartId,
        hasTitle = !!this.chartTitle || !!this._hasHeading,
        hasDesc = !!this.chartDesc || !!this._hasDesc,
        legend = this.legendItems;
      return html`<div
        class="ddd-block"
        part="frame"
        role="group"
        aria-labelledby="${id}-hdr"
      >
        ${renderDDDBlockHeader({
          id: `${id}-hdr`,
          icon:
            this.type === "pie"
              ? "editor:pie-chart-outlined"
              : this.type === "line"
                ? "editor:show-chart"
                : "editor:insert-chart",
          label: this.blockLabel,
          after: html`<span
            class="ddd-block-title title"
            id="${id}-title"
            ?hidden="${!hasTitle}"
            >${this.chartTitle}<slot
              name="heading"
              @slotchange="${this._lrndesignSlotChange}"
            ></slot
          ></span>`,
          actions: html`<button
              type="button"
              class="ddd-block-action"
              id="table-toggle"
              aria-pressed="${this.showTable ? "true" : "false"}"
              aria-controls="${id}-table"
              aria-label="${this.t.showDataTable}"
              title="${this.t.showDataTable}"
              @click="${this._toggleTable}"
            >
              <simple-icon-lite
                icon="editor:border-all"
                aria-hidden="true"
              ></simple-icon-lite></button
            >${
              this.dataSource
                ? html`<a
                    class="ddd-block-action"
                    id="download"
                    href="${this.dataSource}"
                    download
                    aria-label="${this.t.downloadData}"
                    title="${this.t.downloadData}"
                    ><simple-icon-lite
                      icon="icons:file-download"
                      aria-hidden="true"
                    ></simple-icon-lite
                  ></a>`
                : nothing
            }`,
        })}
        <div id="${id}-desc" class="ddd-block-body desc" ?hidden="${!hasDesc}">
          ${this.chartDesc}<slot
            name="desc"
            @slotchange="${this._lrndesignSlotChange}"
          ></slot>
        </div>
        <div class="ddd-block-body">
          <div
            id="chart"
            chart="${id}"
            role="img"
            aria-label="${this.__chartLabel}"
            aria-describedby="${id}-table ${id}-desc"
            class="ct-chart ${this.scale}"
          ></div>
          ${
            legend.length
              ? html`<ul class="legend">
                  ${legend.map(
                    (name, i) =>
                      html`<li>
                        <span
                          class="swatch"
                          aria-hidden="true"
                          style="background-color: var(--chartist-color-${
                            (i % 15) + 1
                          })"
                        ></span
                        >${name}
                      </li>`,
                  )}
                </ul>`
              : nothing
          }
          <div
            id="${id}-table"
            class="${this.showTable ? "table" : "table sr-only"}"
          >
            ${this.renderDataTable()}
          </div>
          <!-- the authored / generated table is the data source; what is
               shown (and read) is the DDD styled copy above -->
          <div class="source" hidden><slot></slot></div>
        </div>
      </div>`;
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,

        /**
         * Location of the CSV file.
         */
        accentColor: {
          type: String,
          attribute: "accent-color",
          reflect: true,
        },
        /**
         * Location of the CSV file.
         */
        dark: {
          type: Boolean,
          attribute: "dark",
          reflect: true,
        },
        /**
         * Fixed height for the chart as a string (i.e. '100px' or '50%').
         */
        height: {
          type: String,
        },
        /**
         * Reverse data including labels, the series order as well as
         * the whole series data arrays.
         */
        reverseData: {
          type: Boolean,
          attribute: "reverse-data",
        },
        /**
         * Fixed width for the chart as a string (i.e. '100px' or '50%').
         */
        width: {
          type: String,
        },
        _hasHeading: { type: Boolean, state: true },
        _hasDesc: { type: Boolean, state: true },
      };
    }

    constructor() {
      super();
      this.t = {
        ...this.t,
        barChart: "Data · Bar chart",
        lineChart: "Data · Line chart",
        pieChart: "Data · Pie chart",
        barChartLabel: "bar chart",
        lineChartLabel: "line chart",
        pieChartLabel: "pie chart",
        showDataTable: "Show data table",
        downloadData: "Download data (.csv)",
        series: "Series {n}",
      };
      this.registerLocalization({
        context: this,
        namespace: "lrndesign-chart",
        localesPath: new URL("./locales/", import.meta.url).href,
      });
      this._hasHeading = false;
      this._hasDesc = false;
      this.setProperties();
      this.makeChart();
    }

    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "lrndesign-chart";
    }

    /**
     * gets axis title options
     * @readonly
     */
    get axisTitles() {
      let axisTitles = {};
      if (this.axisXTitle)
        axisTitles.axisX = {
          axisTitle: this.axisXTitle,
          offset: { x: this.axisXTitleOffsetX, y: this.axisXTitleOffsetY },
          textAnchor: ["start", "end", "middle"].includes(this.axisXTitleAnchor)
            ? this.axisXTitleAnchor
            : "middle",
        };
      if (this.axisYTitle)
        axisTitles.axisY = {
          axisTitle: this.axisYTitle,
          offset: { x: this.axisYTitleOffsetX, y: this.axisYTitleOffsetY },
          textAnchor: ["start", "end", "middle"].includes(this.axisYTitleAnchor)
            ? this.axisYTitleAnchor
            : "middle",
        };
      return this.axisXTitle || this.axisYTitle ? axisTitles : undefined;
    }

    //properties common to line and bar charts
    static get lineBarProperties() {
      return {
        /**
         * Offset X of labels for X-axis
         */
        axisXLabelOffsetX: {
          attribute: "axis-x-label-offset-x",
          type: Number,
        },
        /**
         * Offset Y of labels for X-axis
         */
        axisXLabelOffsetY: {
          attribute: "axis-x-label-offset-y",
          type: Number,
        },
        /**
         * The offset of the chart drawing area to the border of the container.
         */
        axisXOffset: {
          attribute: "axis-x-offset",
          type: Number,
        },
        /**
         * Position where labels are placed.
         * Can be set to `start` or `end`
         * where `start` is equivalent to left or top on vertical axis
         * and `end` is equivalent to right or bottom on horizontal axis.
         */
        axisXPosition: {
          attribute: "axis-x-position",
          type: String,
        },
        /**
         * Show axis X grid?
         */
        axisXShowGrid: {
          attribute: "axis-x-show-grid",
          type: Boolean,
        },
        /**
         * Show axis X labels?
         */
        axisXShowLabel: {
          attribute: "axis-x-show-label",
          type: Boolean,
        },
        /**
         * Optional title of x-axis
         */
        axisXTitle: {
          attribute: "axis-x-title",
          type: String,
        },
        /**
         * Optional x-offset for x-axis title
         */
        axisXTitleOffsetX: {
          attribute: "axis-x-title-offset",
          type: Number,
        },
        /**
         * Optional y-offset for x-axis title
         */
        axisXTitleOffsetY: {
          attribute: "axis-x-title-offset",
          type: Number,
        },
        /**
         * Optional title of x-axis. Possible values are 'start', 'end' and 'middle'.
         */
        axisXTitleAnchor: {
          attribute: "axis-x-title-anchor",
          type: String,
        },
        /**
         /**
          * Offset X of labels for Y-axis
          */
        axisYLabelOffsetX: {
          attribute: "axis-y-label-offset-x",
          type: Number,
        },
        /**
         * Offset Y of labels for Y-axis
         */
        axisYLabelOffsetY: {
          attribute: "axis-y-label-offset-y",
          type: Number,
        },
        /**
         * Position where labels are placed.
         * Can be set to `start` or `end`
         * where `start` is equivalent to left or top on vertical axis
         * and `end` is equivalent to right or bottom on horizontal axis.
         */
        axisYPosition: {
          attribute: "axis-y-position",
          type: String,
        },
        /**
         * Specifies minimum height in pixel of scale steps
         */
        axisYScaleMinSpace: {
          attribute: "axis-y-scale-min-space",
          type: Number,
        },
        /**
         * The offset of the chart drawing area to the border of the container.
         */
        axisYOffset: {
          attribute: "axis-y-offset",
          type: Number,
        },
        /**
         * Use only integer values (whole numbers) for the scale steps
         */
        axisYOnlyInteger: {
          attribute: "axis-y-only-integer",
          type: Boolean,
        },
        /**
         * Show axis Y grid?
         */
        axisYshowGrid: {
          attribute: "axis-y-show-grid",
          type: Boolean,
        },
        /**
         * Show axis Y labels?
         */
        axisYShowLabel: {
          attribute: "axis-y-show-label",
          type: Boolean,
        },
        /**
         * Position labels at top-left of axis?
         */
        axisYTopLeft: {
          attribute: "axis-y-top-left",
          type: Boolean,
        },
        /**
         * Optional title of y-axis
         */
        axisYTitle: {
          attribute: "axis-y-title",
          type: String,
        },
        /**
         * Optional x-offset for y-axis title.
         * Please note, x and y offset values for axisY are flipped due to the rotation of the axisY title by 90 degrees.
         * Therefore changing y moves left/right.
         */
        axisYTitleOffsetX: {
          attribute: "axis-y-title-offset",
          type: Number,
        },
        /**
         * Optional y-offset for y-axis title.
         * Please note, x and y offset values for axisY are flipped due to the rotation of the axisY title by 90 degrees.
         * Therefore changing the x value moves up/down the chart.
         */
        axisYTitleOffsetY: {
          attribute: "axis-y-title-offset",
          type: Number,
        },
        /**
         * Optional title of y-axis. Possible values are 'start', 'end' and 'middle'.
         */
        axisYTitleAnchor: {
          attribute: "axis-y-title-anchor",
          type: String,
        },
        /**
         * Optional title of y-axis
         */
        axisYTitleFlip: {
          attribute: "axis-y-title-flip",
          type: Boolean,
        },

        /**
         * Padding below chart drawing area
         */
        chartPaddingBottom: {
          attribute: "chart-padding-bottom",
          type: String,
        },

        /**
         * Padding left of chart drawing area
         */
        chartPaddingLeft: {
          attribute: "chart-padding-left",
          type: String,
        },

        /**
         * Padding right of chart drawing area
         */
        chartPaddingRight: {
          attribute: "chart-padding-right",
          type: String,
        },

        /**
         * Padding above chart drawing area
         */
        chartPaddingTop: {
          attribute: "chart-padding-top",
          type: String,
        },
        /**
         * Overriding the natural high of the chart allows you to zoom in
         * or limit the charts highest displayed value.
         */
        high: {
          type: Number,
        },
        /**
         * Overriding the natural low of the chart allows you to zoom in
         * or limit the charts lowest displayed value.
         */
        low: {
          type: Number,
        },
        /**
         * If the bar chart should add a background fill to the .ct-grids group.
         */
        showGridBackground: {
          attribute: "show-grid-background",
          type: Boolean,
        },
      };
    }

    /**
     * override this with type-specific options
     * @returns {object} options specific to both bar and line charts
     * @readonly
     * @memberof LrndesignChart
     * @memberof LrndesignChart
     */
    get lineBarOptions() {
      return {
        high: this.high,
        low: this.low,
        axisX: {
          labelOffset: {
            x: this.axisXLabelOffsetX,
            y: this.axisXLabelOffsetY,
            offset: this.axisXOffset,
          },
          position: this.axisXPosition,
          showGrid: this.axisXShowGrid,
          showLabel: this.axisXShowLabel,
        },
        axisY: {
          labelOffset: {
            x: this.axisYLabelOffsetX,
            y: this.axisYLabelOffsetY,
            offset: this.axisYOffset,
          },
          position: this.axisYPosition,
          showGrid: this.axisYShowGrid,
          showLabel: this.axisYShowLabel,
          onlyInteger: this.axisYOnlyInteger,
          scaleMinSpace: this.axisYScaleMinSpace,
        },
        showGridBackground: this.showGridBackground,
        chartPadding: {
          bottom: this.chartPaddingBottom + (this.axisXTitle ? 40 : 0),
          left: this.chartPaddingLeft + (this.axisYTitle ? 30 : 0),
          right: this.chartPaddingRight + (this.axisYTitle ? 15 : 0),
          top: this.chartPaddingTop + (this.axisXTitle ? 20 : 0),
        },
      };
    }

    /**
     *
     * override this with type-specific options
     * @returns {object} options
     * @readonly
     * @memberof LrndesignChart
     */
    get options() {
      return {
        reverseData: this.reverseData,
      };
    }

    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        if (
          (propName.indexOf("axisXTitle") > -1 ||
            propName.indexOf("axisYTitle") > -1) &&
          this[propName] !== oldValue
        ) {
          this.pluginAxisTitle = this.axisTitles;
        }
      });
      if (super.updated) super.updated(changedProperties);
    }

    /**
     * Sets properties for chart.
     * Specific chart types can extend this function
     * with type-specific properties.
     */
    setProperties() {
      this.dark = false;
      this.scale = "ct-minor-seventh";
      this.reverseData = false;
      this.rawData = "";
    }

    /**
     * Sets properties specific to bar and line charts.
     * Bar and line charts can include this function
     * in their extended setProperties function.
     */
    setBarLineProperties() {
      this.high = undefined;
      this.low = undefined;
      this.axisXLabelOffsetX = 0;
      this.axisXLabelOffsetY = 0;
      this.axisXOffset = 30;
      this.axisXPosition = "end";
      this.axisXShowGrid = true;
      this.axisXShowLabel = true;
      this.axisXTopLeft = false;
      this.axisXTitleOffsetX = 0;
      this.axisXTitleOffsetY = 50;
      this.axisXTitleAnchor = "middle";
      this.axisYTitleOffsetX = 0;
      this.axisYTitleOffsetY = -25;
      this.axisYTitleAnchor = "middle";
      this.axisYTitleFlip = false;
      this.axisYLabelOffsetX = 0;
      this.axisYLabelOffsetY = 0;
      this.axisYOffset = 30;
      this.axisYOnlyInteger = false;
      this.axisYPosition = "start";
      this.axisYScaleMinSpace = 20;
      this.axisYShowGrid = true;
      this.axisYShowLabel = true;
      this.axisYTopLeft = true;
      this.showGridBackground = false;
      this.chartPaddingBottom = 15;
      this.chartPaddingLeft = 15;
      this.chartPaddingRight = 15;
      this.chartPaddingTop = 15;
    }
    /**
     * life cycle, element is removed from the DOM
     */
    //disconnectedCallback() {}
  };
};
export { LrndesignChart };
