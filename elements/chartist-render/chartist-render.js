/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { generateResourceID } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@polymer/iron-ajax/iron-ajax.js";

const ChartistRenderSuper = function(SuperClass) {
  return class extends SuperClass {
    
  //styles function 
  static get styles() {
    return  [
      
      css`
.ct-label {
  fill: rgba(0, 0, 0, 0.4);
  color: rgba(0, 0, 0, 0.4);
  font-size: 0.75rem;
  line-height: 1; }

.ct-chart-line .ct-label,
.ct-chart-bar .ct-label {
  display: block;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex; }

.ct-chart-pie .ct-label,
.ct-chart-donut .ct-label {
  dominant-baseline: central; }

.ct-label.ct-horizontal.ct-start {
  -webkit-box-align: flex-end;
  -webkit-align-items: flex-end;
  -ms-flex-align: flex-end;
  align-items: flex-end;
  -webkit-box-pack: flex-start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: flex-start;
  justify-content: flex-start;
  text-align: left;
  text-anchor: start; }

.ct-label.ct-horizontal.ct-end {
  -webkit-box-align: flex-start;
  -webkit-align-items: flex-start;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  -webkit-box-pack: flex-start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: flex-start;
  justify-content: flex-start;
  text-align: left;
  text-anchor: start; }

.ct-label.ct-vertical.ct-start {
  -webkit-box-align: flex-end;
  -webkit-align-items: flex-end;
  -ms-flex-align: flex-end;
  align-items: flex-end;
  -webkit-box-pack: flex-end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: flex-end;
  justify-content: flex-end;
  text-align: right;
  text-anchor: end; }

.ct-label.ct-vertical.ct-end {
  -webkit-box-align: flex-end;
  -webkit-align-items: flex-end;
  -ms-flex-align: flex-end;
  align-items: flex-end;
  -webkit-box-pack: flex-start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: flex-start;
  justify-content: flex-start;
  text-align: left;
  text-anchor: start; }

.ct-chart-bar .ct-label.ct-horizontal.ct-start {
  -webkit-box-align: flex-end;
  -webkit-align-items: flex-end;
  -ms-flex-align: flex-end;
  align-items: flex-end;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-align: center;
  text-anchor: start; }

.ct-chart-bar .ct-label.ct-horizontal.ct-end {
  -webkit-box-align: flex-start;
  -webkit-align-items: flex-start;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-align: center;
  text-anchor: start; }

.ct-chart-bar.ct-horizontal-bars .ct-label.ct-horizontal.ct-start {
  -webkit-box-align: flex-end;
  -webkit-align-items: flex-end;
  -ms-flex-align: flex-end;
  align-items: flex-end;
  -webkit-box-pack: flex-start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: flex-start;
  justify-content: flex-start;
  text-align: left;
  text-anchor: start; }

.ct-chart-bar.ct-horizontal-bars .ct-label.ct-horizontal.ct-end {
  -webkit-box-align: flex-start;
  -webkit-align-items: flex-start;
  -ms-flex-align: flex-start;
  align-items: flex-start;
  -webkit-box-pack: flex-start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: flex-start;
  justify-content: flex-start;
  text-align: left;
  text-anchor: start; }

.ct-chart-bar.ct-horizontal-bars .ct-label.ct-vertical.ct-start {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: flex-end;
  -webkit-justify-content: flex-end;
  -ms-flex-pack: flex-end;
  justify-content: flex-end;
  text-align: right;
  text-anchor: end; }

.ct-chart-bar.ct-horizontal-bars .ct-label.ct-vertical.ct-end {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: flex-start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: flex-start;
  justify-content: flex-start;
  text-align: left;
  text-anchor: end; }

.ct-grid {
  stroke: rgba(0, 0, 0, 0.2);
  stroke-width: 1px;
  stroke-dasharray: 2px; }

.ct-grid-background {
  fill: none; }

.ct-point {
  stroke-width: 10px;
  stroke-linecap: round; }

.ct-line {
  fill: none;
  stroke-width: 4px; }

.ct-area {
  stroke: none;
  fill-opacity: 0.1; }

.ct-bar {
  fill: none;
  stroke-width: 10px; }

.ct-slice-donut {
  fill: none;
  stroke-width: 60px; }

.ct-series-a .ct-point, .ct-series-a .ct-line, .ct-series-a .ct-bar, .ct-series-a .ct-slice-donut {
  stroke: #d70206; }

.ct-series-a .ct-slice-pie, .ct-series-a .ct-slice-donut-solid, .ct-series-a .ct-area {
  fill: #d70206; }

.ct-series-b .ct-point, .ct-series-b .ct-line, .ct-series-b .ct-bar, .ct-series-b .ct-slice-donut {
  stroke: #f05b4f; }

.ct-series-b .ct-slice-pie, .ct-series-b .ct-slice-donut-solid, .ct-series-b .ct-area {
  fill: #f05b4f; }

.ct-series-c .ct-point, .ct-series-c .ct-line, .ct-series-c .ct-bar, .ct-series-c .ct-slice-donut {
  stroke: #f4c63d; }

.ct-series-c .ct-slice-pie, .ct-series-c .ct-slice-donut-solid, .ct-series-c .ct-area {
  fill: #f4c63d; }

.ct-series-d .ct-point, .ct-series-d .ct-line, .ct-series-d .ct-bar, .ct-series-d .ct-slice-donut {
  stroke: #d17905; }

.ct-series-d .ct-slice-pie, .ct-series-d .ct-slice-donut-solid, .ct-series-d .ct-area {
  fill: #d17905; }

.ct-series-e .ct-point, .ct-series-e .ct-line, .ct-series-e .ct-bar, .ct-series-e .ct-slice-donut {
  stroke: #453d3f; }

.ct-series-e .ct-slice-pie, .ct-series-e .ct-slice-donut-solid, .ct-series-e .ct-area {
  fill: #453d3f; }

.ct-series-f .ct-point, .ct-series-f .ct-line, .ct-series-f .ct-bar, .ct-series-f .ct-slice-donut {
  stroke: #59922b; }

.ct-series-f .ct-slice-pie, .ct-series-f .ct-slice-donut-solid, .ct-series-f .ct-area {
  fill: #59922b; }

.ct-series-g .ct-point, .ct-series-g .ct-line, .ct-series-g .ct-bar, .ct-series-g .ct-slice-donut {
  stroke: #0544d3; }

.ct-series-g .ct-slice-pie, .ct-series-g .ct-slice-donut-solid, .ct-series-g .ct-area {
  fill: #0544d3; }

.ct-series-h .ct-point, .ct-series-h .ct-line, .ct-series-h .ct-bar, .ct-series-h .ct-slice-donut {
  stroke: #6b0392; }

.ct-series-h .ct-slice-pie, .ct-series-h .ct-slice-donut-solid, .ct-series-h .ct-area {
  fill: #6b0392; }

.ct-series-i .ct-point, .ct-series-i .ct-line, .ct-series-i .ct-bar, .ct-series-i .ct-slice-donut {
  stroke: #f05b4f; }

.ct-series-i .ct-slice-pie, .ct-series-i .ct-slice-donut-solid, .ct-series-i .ct-area {
  fill: #f05b4f; }

.ct-series-j .ct-point, .ct-series-j .ct-line, .ct-series-j .ct-bar, .ct-series-j .ct-slice-donut {
  stroke: #dda458; }

.ct-series-j .ct-slice-pie, .ct-series-j .ct-slice-donut-solid, .ct-series-j .ct-area {
  fill: #dda458; }

.ct-series-k .ct-point, .ct-series-k .ct-line, .ct-series-k .ct-bar, .ct-series-k .ct-slice-donut {
  stroke: #eacf7d; }

.ct-series-k .ct-slice-pie, .ct-series-k .ct-slice-donut-solid, .ct-series-k .ct-area {
  fill: #eacf7d; }

.ct-series-l .ct-point, .ct-series-l .ct-line, .ct-series-l .ct-bar, .ct-series-l .ct-slice-donut {
  stroke: #86797d; }

.ct-series-l .ct-slice-pie, .ct-series-l .ct-slice-donut-solid, .ct-series-l .ct-area {
  fill: #86797d; }

.ct-series-m .ct-point, .ct-series-m .ct-line, .ct-series-m .ct-bar, .ct-series-m .ct-slice-donut {
  stroke: #b2c326; }

.ct-series-m .ct-slice-pie, .ct-series-m .ct-slice-donut-solid, .ct-series-m .ct-area {
  fill: #b2c326; }

.ct-series-n .ct-point, .ct-series-n .ct-line, .ct-series-n .ct-bar, .ct-series-n .ct-slice-donut {
  stroke: #6188e2; }

.ct-series-n .ct-slice-pie, .ct-series-n .ct-slice-donut-solid, .ct-series-n .ct-area {
  fill: #6188e2; }

.ct-series-o .ct-point, .ct-series-o .ct-line, .ct-series-o .ct-bar, .ct-series-o .ct-slice-donut {
  stroke: #a748ca; }

.ct-series-o .ct-slice-pie, .ct-series-o .ct-slice-donut-solid, .ct-series-o .ct-area {
  fill: #a748ca; }

.ct-square {
  display: block;
  position: relative;
  width: 100%; }
  .ct-square:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 100%; }
  .ct-square:after {
    content: "";
    display: table;
    clear: both; }
  .ct-square > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-minor-second {
  display: block;
  position: relative;
  width: 100%; }
  .ct-minor-second:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 93.75%; }
  .ct-minor-second:after {
    content: "";
    display: table;
    clear: both; }
  .ct-minor-second > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-major-second {
  display: block;
  position: relative;
  width: 100%; }
  .ct-major-second:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 88.88889%; }
  .ct-major-second:after {
    content: "";
    display: table;
    clear: both; }
  .ct-major-second > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-minor-third {
  display: block;
  position: relative;
  width: 100%; }
  .ct-minor-third:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 83.33333%; }
  .ct-minor-third:after {
    content: "";
    display: table;
    clear: both; }
  .ct-minor-third > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-major-third {
  display: block;
  position: relative;
  width: 100%; }
  .ct-major-third:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 80%; }
  .ct-major-third:after {
    content: "";
    display: table;
    clear: both; }
  .ct-major-third > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-perfect-fourth {
  display: block;
  position: relative;
  width: 100%; }
  .ct-perfect-fourth:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 75%; }
  .ct-perfect-fourth:after {
    content: "";
    display: table;
    clear: both; }
  .ct-perfect-fourth > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-perfect-fifth {
  display: block;
  position: relative;
  width: 100%; }
  .ct-perfect-fifth:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 66.66667%; }
  .ct-perfect-fifth:after {
    content: "";
    display: table;
    clear: both; }
  .ct-perfect-fifth > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-minor-sixth {
  display: block;
  position: relative;
  width: 100%; }
  .ct-minor-sixth:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 62.5%; }
  .ct-minor-sixth:after {
    content: "";
    display: table;
    clear: both; }
  .ct-minor-sixth > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-golden-section {
  display: block;
  position: relative;
  width: 100%; }
  .ct-golden-section:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 61.8047%; }
  .ct-golden-section:after {
    content: "";
    display: table;
    clear: both; }
  .ct-golden-section > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-major-sixth {
  display: block;
  position: relative;
  width: 100%; }
  .ct-major-sixth:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 60%; }
  .ct-major-sixth:after {
    content: "";
    display: table;
    clear: both; }
  .ct-major-sixth > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-minor-seventh {
  display: block;
  position: relative;
  width: 100%; }
  .ct-minor-seventh:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 56.25%; }
  .ct-minor-seventh:after {
    content: "";
    display: table;
    clear: both; }
  .ct-minor-seventh > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-major-seventh {
  display: block;
  position: relative;
  width: 100%; }
  .ct-major-seventh:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 53.33333%; }
  .ct-major-seventh:after {
    content: "";
    display: table;
    clear: both; }
  .ct-major-seventh > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-octave {
  display: block;
  position: relative;
  width: 100%; }
  .ct-octave:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 50%; }
  .ct-octave:after {
    content: "";
    display: table;
    clear: both; }
  .ct-octave > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-major-tenth {
  display: block;
  position: relative;
  width: 100%; }
  .ct-major-tenth:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 40%; }
  .ct-major-tenth:after {
    content: "";
    display: table;
    clear: both; }
  .ct-major-tenth > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-major-eleventh {
  display: block;
  position: relative;
  width: 100%; }
  .ct-major-eleventh:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 37.5%; }
  .ct-major-eleventh:after {
    content: "";
    display: table;
    clear: both; }
  .ct-major-eleventh > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-major-twelfth {
  display: block;
  position: relative;
  width: 100%; }
  .ct-major-twelfth:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 33.33333%; }
  .ct-major-twelfth:after {
    content: "";
    display: table;
    clear: both; }
  .ct-major-twelfth > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

.ct-double-octave {
  display: block;
  position: relative;
  width: 100%; }
  .ct-double-octave:before {
    display: block;
    float: left;
    content: "";
    width: 0;
    height: 0;
    padding-bottom: 25%; }
  .ct-double-octave:after {
    content: "";
    display: table;
    clear: both; }
  .ct-double-octave > svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0; }

:host {
  display: block;
  width: 100%;
  padding: var(--chartist-padding, 0px);
  margin: var(--chartist-margin, 15px 0);
  background-color: var(--chartist-bg-color, transparent);
  color: var(--chartist-text-color, #000); }

.sr-only {
  position: absolute;
  left: -999999px;
  height: 0;
  overflow: hidden; }

.ct-axis-title {
  fill: var(--chartist-text-color); }

::slotted(table) {
  border: 1px solid var(--chartist-text-color);
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  overflow: auto; }

.ct-label {
  fill: var(--chartist-text-color, #000);
  color: var(--chartist-text-color, #000);
  font-size: var(--chartist-text-size, 0.75rem);
  line-height: var(--chartist-line-height, 1); }

.ct-grid {
  stroke: var(--chartist-grid-color, rgba(0, 0, 0, 0.2));
  stroke-width: 1px;
  stroke-dasharray: 2px; }

.ct-series-a .ct-point, .ct-series-a .ct-line, .ct-series-a .ct-bar, .ct-series-a .ct-slice-donut {
  stroke: var(--chartist-color-1, #d70206); }

.ct-series-a .ct-slice-pie, .ct-series-a .ct-slice-donut-solid, .ct-series-a .ct-area {
  fill: var(--chartist-color-1, #d70206); }

.ct-series-b .ct-point, .ct-series-b .ct-line, .ct-series-b .ct-bar, .ct-series-b .ct-slice-donut {
  stroke: var(--chartist-color-2, #f05b4f); }

.ct-series-b .ct-slice-pie, .ct-series-b .ct-slice-donut-solid, .ct-series-b .ct-area {
  fill: var(--chartist-color-2, #f05b4f); }

.ct-series-c .ct-point, .ct-series-c .ct-line, .ct-series-c .ct-bar, .ct-series-c .ct-slice-donut {
  stroke: var(--chartist-color-3, #f4c63d); }

.ct-series-c .ct-slice-pie, .ct-series-c .ct-slice-donut-solid, .ct-series-c .ct-area {
  fill: var(--chartist-color-3, #f4c63d); }

.ct-series-d .ct-point, .ct-series-d .ct-line, .ct-series-d .ct-bar, .ct-series-d .ct-slice-donut {
  stroke: var(--chartist-color-4, #d17905); }

.ct-series-d .ct-slice-pie, .ct-series-d .ct-slice-donut-solid, .ct-series-d .ct-area {
  fill: var(--chartist-color-4, #d17905); }

.ct-series-e .ct-point, .ct-series-e .ct-line, .ct-series-e .ct-bar, .ct-series-e .ct-slice-donut {
  stroke: var(--chartist-color-5, #453d3f); }

.ct-series-e .ct-slice-pie, .ct-series-e .ct-slice-donut-solid, .ct-series-e .ct-area {
  fill: var(--chartist-color-5, #453d3f); }

.ct-series-f .ct-point, .ct-series-f .ct-line, .ct-series-f .ct-bar, .ct-series-f .ct-slice-donut {
  stroke: var(--chartist-color-6, #59922b); }

.ct-series-f .ct-slice-pie, .ct-series-f .ct-slice-donut-solid, .ct-series-f .ct-area {
  fill: var(--chartist-color-6, #59922b); }

.ct-series-g .ct-point, .ct-series-g .ct-line, .ct-series-g .ct-bar, .ct-series-g .ct-slice-donut {
  stroke: var(--chartist-color-7, #0544d3); }

.ct-series-g .ct-slice-pie, .ct-series-g .ct-slice-donut-solid, .ct-series-g .ct-area {
  fill: var(--chartist-color-7, #0544d3); }

.ct-series-h .ct-point, .ct-series-h .ct-line, .ct-series-h .ct-bar, .ct-series-h .ct-slice-donut {
  stroke: var(--chartist-color-8, #6b0392); }

.ct-series-h .ct-slice-pie, .ct-series-h .ct-slice-donut-solid, .ct-series-h .ct-area {
  fill: var(--chartist-color-8, #6b0392); }

.ct-series-i .ct-point, .ct-series-i .ct-line, .ct-series-i .ct-bar, .ct-series-i .ct-slice-donut {
  stroke: var(--chartist-color-9, #f05b4f); }

.ct-series-i .ct-slice-pie, .ct-series-i .ct-slice-donut-solid, .ct-series-i .ct-area {
  fill: var(--chartist-color-9, #f05b4f); }

.ct-series-j .ct-point, .ct-series-j .ct-line, .ct-series-j .ct-bar, .ct-series-j .ct-slice-donut {
  stroke: var(--chartist-color-10, #dda458); }

.ct-series-j .ct-slice-pie, .ct-series-j .ct-slice-donut-solid, .ct-series-j .ct-area {
  fill: var(--chartist-color-10, #dda458); }

.ct-series-k .ct-point, .ct-series-k .ct-line, .ct-series-k .ct-bar, .ct-series-k .ct-slice-donut {
  stroke: var(--chartist-color-11, #eacf7d); }

.ct-series-k .ct-slice-pie, .ct-series-k .ct-slice-donut-solid, .ct-series-k .ct-area {
  fill: var(--chartist-color-11, #eacf7d); }

.ct-series-l .ct-point, .ct-series-l .ct-line, .ct-series-l .ct-bar, .ct-series-l .ct-slice-donut {
  stroke: var(--chartist-color-12, #86797d); }

.ct-series-l .ct-slice-pie, .ct-series-l .ct-slice-donut-solid, .ct-series-l .ct-area {
  fill: var(--chartist-color-12, #86797d); }

.ct-series-m .ct-point, .ct-series-m .ct-line, .ct-series-m .ct-bar, .ct-series-m .ct-slice-donut {
  stroke: var(--chartist-color-13, #b2c326); }

.ct-series-m .ct-slice-pie, .ct-series-m .ct-slice-donut-solid, .ct-series-m .ct-area {
  fill: var(--chartist-color-13, #b2c326); }

.ct-series-n .ct-point, .ct-series-n .ct-line, .ct-series-n .ct-bar, .ct-series-n .ct-slice-donut {
  stroke: var(--chartist-color-14, #6188e2); }

.ct-series-n .ct-slice-pie, .ct-series-n .ct-slice-donut-solid, .ct-series-n .ct-area {
  fill: var(--chartist-color-14, #6188e2); }

.ct-series-o .ct-point, .ct-series-o .ct-line, .ct-series-o .ct-bar, .ct-series-o .ct-slice-donut {
  stroke: var(--chartist-color-15, #a748ca); }

.ct-series-o .ct-slice-pie, .ct-series-o .ct-slice-donut-solid, .ct-series-o .ct-area {
  fill: var(--chartist-color-15, #a748ca); }
      `
    ];
  }
  // render function
  render() {
    return html`

<div id="${this.__chartId}-title" class="title">
  ${this.chartTitle}
  <slot name="heading"></slot>
</div>
<div id="${this.__chartId}-desc" class="desc">
  ${this.chartDesc}
  <slot name="desc"></slot>
</div>
<div id="chart" 
  chart="${this.__chartId}" 
  role="presentation"
  aria-labelledby="${this.__chartId}-title"
  aria-describedby="${this.__chartId}-table ${this.__chartId}-desc"
  class="ct-chart ${this.scale}">
</div>
<div 
  id="${this.__chartId}-table" 
  class="${this.showTable ? 'table' : 'table sr-only'}">
  <slot></slot>
</div>
<iron-ajax
  auto
  handle-as="text"
  url="${this.dataSource}"
  @response="${this._handleResponse}"
></iron-ajax>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * The unique identifier of the chart.
   */
  "id": {
    "type": String
  },
  /**
   * The type of chart:bar, line, or pie
   */
  "type": {
    "type": String
  },
  /**
   * The scale of the chart. (See https://gionkunz.github.io/chartist-js/api-documentation.html)```
Container class	Ratio
.ct-square          1
.ct-minor-second	  15:16
.ct-major-second	  8:9
.ct-minor-third	    5:6
.ct-major-third	    4:5
.ct-perfect-fourth	3:4
.ct-perfect-fifth	  2:3
.ct-minor-sixth	    5:8
.ct-golden-section	1:1.618
.ct-major-sixth	    3:5
.ct-minor-seventh	  9:16
.ct-major-seventh	  8:15
.ct-octave	        1:2
.ct-major-tenth	    2:5
.ct-major-eleventh	3:8
.ct-major-twelfth	  1:3
.ct-double-octave	  1:4```
   */
  "scale": {
    "type": String
  },
  /**
   * DEPRECATED: Use heading slot instead for progressive enhancement.
   */
  "chartTitle": {
    "type": String,
    "attribute": "chart-title"
  },
  /**
   * DEPRECATED: Use desc slot instead for progressive enhancement.
   */
  "chartDesc": {
    "type": String,
    "attribute": "chart-desc"
  },
  /**
   * DEPRECATED: Use an accessible table in unnamed slot for maxium accessibility and SEO.
   * As table:
   * <table>
   *     <thead><tr><th scope="col">label 1</th>...</tr></thead>
   *     <tbody><tr><td>1</td>...</tr>...</tbody>
   * </table>

   * DEPRECATED Method: 
   * {
   *   labels: ["label 1", "label 2", "label 3"]
   *   series: [
   *     [1,2,3],
   *     [4,5,6]
   *   ]
   * }
   */
  "data": {
    "type": Object
  },
  /**
   * Location of the CSV file.
   */
  "dataSource": {
    "type": String,
    "attribute": "data-source",
    "reflect": true
  },
  /**
   * The options available at  https://gionkunz.github.io/chartist-js/api-documentation.html.
   */
  "options": {
    "type": Object
  },
  /**
   * Optional data for chartist-plugin-axistitle, 
   * as in { axisX: { axisTitle: "Time (mins)", offset: { x: 0, y: 50 }, textAnchor: "middle" }, axisY: { axisTitle: "Goals", axisClass: "ct-axis-title", offset: { x: 0, y: -1 }, flipTitle: false } } 
   * See https://github.com/alexstanbury/chartist-plugin-axistitle
   */
  "pluginAxisTitle": {
    "type": Object
  },
  /**
   * Optional data for chartist-plugin-pointlabels, 
   * as in { labelOffset: { x: 0, y: -10 }, textAnchor: 'middle', labelInterpolationFnc: Chartist.noop } 
   * See https://github.com/gionkunz/chartist-plugin-pointlabels
   */
  "pluginPointLabels": {
    "type": Object
  },
  /**
   * Optional array of items for chartist-plugin-filldonut, 
   * as in items : [{ class : '', id: '', content : 'fillText', position: 'center', offsetY: 0, offsetX: 0 }]
   * See https://github.com/moxx/chartist-plugin-fill-donut
   */
  "pluginFillDonutItems": {
    "type": Array
  },
  /**
   * Raw data pulled in from the csv file.
   */
  "rawData": {
    "type": String,
    "attribute": "raw-data"
  },
  /**
   * The responsive options.

    From https://gionkunz.github.io/chartist-js/api-documentation.html:

    In addition to the regular options we specify responsive option 
    overrides that will override the default configutation based 
    on the matching media queries.

    `var responsiveOptions = [
      ['screen and (min-width: 641px) and (max-width: 1024px)', {
        showPoint: false,
        axisX: {
          labelInterpolationFnc: function(value) {
            // Will return Mon, Tue, Wed etc. on medium screens
            return value.slice(0, 3);
          }
        }
      }],
      ['screen and (max-width: 640px)', {
        showLine: false,
        axisX: {
          labelInterpolationFnc: function(value) {
            // Will return M, T, W etc. on small screens
            return value[0];
          }
        }
      }]
    ];`
   */
  "responsiveOptions": {
    "type": Array,
    "attribute": "responsive-options"
  },
  /**
   * The show data in table form as well? Default is false.
   */
  "showTable": {
    "type": Boolean,
    "attribute": "show-table"
  }
}
;
  }

    constructor() {
      super();
      this.id = "chart";
      this.type = "bar";
      this.scale = "ct-minor-seventh";
      this.responsiveOptions = [];
      this.showTable = false;
      this.__chartId = generateResourceID("chart-");
      window.ESGlobalBridge.requestAvailability();
      this._loadScripts("chartistLib", "lib/chartist/dist/chartist.min.js");
      this._renderChart();
      this.observer.observe(this, {
        attributes: false,
        childList: true,
        subtree: true
      });
      /**
       * Fired once once chart is ready.
       *
       * @event chartist-render-ready
       *
       */
      this.dispatchEvent(
        new CustomEvent("chartist-render-ready", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
      if (typeof Chartist === "object") this._chartistLoaded.bind(this);
    }
    _loadScripts(classname, path) {
      let basePath = this.pathFromUrl(decodeURIComponent(import.meta.url)),
        location = `${basePath}${path}`;
      window.addEventListener(
        `es-bridge-${classname}-loaded`,
        this._chartistLoaded.bind(this)
      );
      window.ESGlobalBridge.instance.load(classname, location);
    }

    /**
     * Store the tag name to make it easier to obtain directly.
     * @notice function name must be here for tooling to operate correctly
     */
    static get tag() {
      return "chartist-render";
    }

    get plugins() {
      return [
        [
          "Chartist.plugins.ctAxisTitle",
          "lib/chartist-plugin-axistitle/dist/chartist-plugin-axistitle.min.js"
        ],
        [
          "Chartist.plugins.CtPointLabels",
          "lib/chartist-plugin-pointlabels/dist/chartist-plugin-pointlabels.min.js"
        ],
        [
          "Chartist.plugins.fillDonut",
          "lib/chartist-plugin-pointlabels/dist/chartist-plugin-pointlabels.min.js"
        ]
      ];
    }
    /**
     * mutation observer for table
     * @readonly
     * @returns {object}
     */
    get observer() {
      let callback = () => this._renderChart();
      return new MutationObserver(callback);
    }

    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "data" && this.data !== oldValue) {
          /**
           * Fires when data changes
           * @event data-changed
           */
          this.dispatchEvent(
            new CustomEvent("data-changed", {
              detail: this
            })
          );
          this._renderTable();
        } else if (propName === "dataSource" && this.data !== oldValue) {
          /**
           * Fires when data-source changes
           * @event data-source-changed
           */
          this.dispatchEvent(
            new CustomEvent("data-source-changed", {
              detail: this
            })
          );
          this._renderTable();
        } else if (propName === "rawData"){
          /**
           * Fires when raw-data changes
           * @event raw-data-changed
           */
          this.dispatchEvent(
            new CustomEvent("raw-data-changed", {
              detail: this
            })
          );
        } else {
          this._renderChart();
        }
      });
    }

    /**
     * Makes chart and returns the chart object.
     * @memberof ChartistRender
     */
    makeChart() {
      setTimeout(() => {
        this.chart = this._renderChart();
      }, 100);
    }

    // simple path from a url modifier
    pathFromUrl(url) {
      return url.substring(0, url.lastIndexOf("/") + 1);
    }

    disconnectedCallback() {
      window.removeEventListener(
        "es-bridge-chartistLib-loaded",
        this._chartistLoaded.bind(this)
      );
      this.plugins.forEach(plugin =>
        window.removeEventListener(
          `es-bridge-${plugin[0]}-loaded`,
          this._pluginLoaded.bind(this)
        )
      );
      super.disconnectedCallback();
    }

    /**
     * determines if char is ready
     */
    _chartistLoaded() {
      this.__chartistLoaded = true;
      this._renderChart();
      this.plugins.forEach(plugin => this._loadScripts(plugin[0], plugin[1]));
    }

    /**
     * determines if char is ready
     */
    _pluginLoaded() {
      this._renderChart();
    }

    /**
     * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
     * @param {string} text csv data
     * @returns {array} chart data
     */
    _CSVtoArray(text) {
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

    /**
     * Convert from csv text to an array in the table function
     * @param {event} e event data
     * @memberof ChartistRender
     */
    _handleResponse(e) {
      this.rawData = this._CSVtoArray(e.detail.response);
      let raw = this.rawData, 
        body = this.type !== "pie" ? raw.slice(1, raw.length) : raw[1],
        series = this.type !== "pie" && isNaN(body[0][0]) ? body.map(tr=>tr.slice(1, tr.length)) : body,
        legend = this.type !== "pie" && isNaN(body[0][0]) ? [raw[0][0]] : undefined
        if(legend) body.forEach(tr=>legend.push(tr[0]));
      this.__dataReady = true;
      this.data = {
        labels: this.type !== "pie" && isNaN(body[0][0]) ? raw[0].slice(1, raw[0].length): raw[0],
        series: series,
        legend: legend
      };
      console.log('_handleResponse',this.rawData,this.data,raw);
    }
    /**
     * replaces existing slotted table with a new one based on data
     * @memberof ChartistRender
     */
    _renderTable() {
      let html = "",
        table = this.querySelector("table");
      if (this.data) {
        if (table) table.remove();
        table = document.createElement("table");
        if (this.data.labels)
          html += `<thead><tr>
              ${this.data.legend ? `<th scope="row">${this.data.legend[0]}</th>` : ``}
              ${(this.data.labels || []).map(label => `<th scope="col">${label}</th>`).join("")}
            </tr></thead>`;
        console.log('_renderTable',this.data);
        if (this.data.series)
          html += `<tbody>
            ${
              this.data.series && Array.isArray(this.data.series[0])
                ? (this.data.series || [])
                    .map(
                      (row,i) =>
                        `<tr>
                          ${this.data.legend && this.data.legend[i+1] ? `<th scope="row">${this.data.legend[i+1]}</th>` : ``}
                          ${(row || []).map(col => `<td>${col}</td>`).join("")}
                        </tr>`
                    )
                    .join("")
                : `<tr>${(this.data.series || [])
                    .map(col => `<td>${col}</td>`)
                    .join("")}</tr>`
            }
          </tbody>`;
        table.innerHTML = html;
        this.appendChild(table);
        console.log('_renderTable',this.data,html,table);
      }
    }
    get fullOptions() {
      let options = { ...this.options };
      if (Chartist.plugins) {
        options.plugins = [];
        if (
          this.type !== "pie" &&
          this.pluginAxisTitle &&
          Chartist.plugins.ctAxisTitle
        ) {
          options.plugins.push(Chartist.plugins.ctAxisTitle(this.pluginAxisTitle));
        }
        if(this.type === 'line' && this.pluginPointLabels && Chartist.plugins.ctPointLabels){
          if(!this.pluginPointLabels.labelInterpolationFnc) this.pluginPointLabels.labelInterpolationFnc = Chartist.noop;
          options.plugins.push(Chartist.plugins.ctPointLabels(this.pluginPointLabels));
        }
        if(this.type === 'pie' && options.donut && this.pluginFillDonutItems && Chartist.plugins.fillDonut){
          options.plugins.push(Chartist.plugins.fillDonut(this.pluginFillDonutItems));
        }
      }
      return options;
    }

    /**
     * Renders chart and returns the chart object.
     */
    _renderChart() {
      let chart = null,
        target = this.shadowRoot.querySelector("#chart"),
        table = this.querySelector("table")
          ? this.querySelector("table").cloneNode(true)
          : false,
        data = !table
          ? false
          : {
              labels: (
                [...table.querySelectorAll("thead th[scope=col]")] || []
              ).map(label => (label.innerHTML || "").trim()),
              series: ([...table.querySelectorAll("tbody tr")] || []).map(row =>
                ([...row.querySelectorAll("td")] || []).map(td => {
                  let cell = (td.innerHTML || "").trim();
                  return cell && cell !== null && cell !== ""
                    ? parseFloat(cell)
                    : "null";
                })
              ),
              legend: ([...table.querySelectorAll("th[scope=row]")] || []).map(legend => (legend.innerHTML || "").trim())
            };

      if (target !== null && typeof Chartist === "object" && data) {
        console.log('_renderChart',table,data,table.querySelectorAll("th[scope=row]"),[...table.querySelectorAll("th[scope=row]")]);
        if (this.type == "bar") {
          if (
            this.responsiveOptions !== undefined &&
            this.responsiveOptions.length > 0
          ) {
            this.responsiveOptions.forEach(option => {
              if (option[1] !== undefined) {
                if (
                  option[1].axisX &&
                  option[1].axisX.labelInterpolationFnc == "noop"
                )
                  option[1].axisX.labelInterpolationFnc = Chartist.noop;
                if (
                  option[1].axisY &&
                  option[1].axisY.labelInterpolationFnc == "noop"
                )
                  option[1].axisY.labelInterpolationFnc = Chartist.noop;
              }
            });
          }
          chart = Chartist.Bar(
            target,
            data,
            this.fullOptions,
            this.responsiveOptions
          );
        } else if (this.type === "line") {
          chart = Chartist.Line(
            target,
            data,
            this.fullOptions,
            this.responsiveOptions
          );
        } else if (this.type === "pie") {
          chart = Chartist.Pie(
            target,
            {
              labels: data.labels || [],
              series: data.series ? data.series[0] : []
            },
            this.fullOptions,
            this.responsiveOptions
          );
        }
        /**
         * Fired when chart is being drawn.
         *
         * @event chartist-render-draw
         *
         */
        this.dispatchEvent(
          new CustomEvent("chartist-render-draw", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: chart
          })
        );
        if (chart)
          chart.on("created", () => {
            /**
             * Fired once chart is created and accessibility features are added.
             *
             * @event chartist-render-created
             *
             */
            this.dispatchEvent(
              new CustomEvent("chartist-render-created", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: chart
              })
            );
          });
      }
      return chart;
    }

    /**
     * Get unique ID from the chart
     * @param {string} prefix for unique ID
     * @returns {string} unique ID
     */
    _getUniqueId(prefix) {
      let id = prefix + Date.now();
      return id;
    }
  };
};
/**
 * @element chartist-render
 * @extends SchemaBehaviors
 * @demo ./demo/index.html 
 * @demo ./demo/csv.html CSV Loading
 * 
 * `chartist-render`
 * uses chartist library to render a chart
 *
### Styling

`<chartist-render>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--chartist-bg-padding` | padding inside chartist-render | 0px
`--chartist-bg-margin` | margin chartist chartist-render | 15px 0
`--chartist-text-color` | default label color for charts | #000
`--chartist-bg-color` | default label color for charts | #000
`--chartist-text-color` | default label color for charts | #000
`--chartist-color-a` | background color for 1st series |  #d70206
`--chartist-color-label-a` | color for 1st series label |  `--chartist-label-color`
`--chartist-color-b` | background color for 2nd series |  #f05b4f
`--chartist-color-label-b` | color for 2nd series label |  `--chartist-label-color`
`--chartist-color-c` | background color for 3rd series |  #f4c63d
`--chartist-color-label-c` | color for 3rd series label |  `--chartist-label-color`
`--chartist-color-d` | background color for 4th series |  #d17905
`--chartist-color-label-d` | color for 4th series label |  `--chartist-label-color`
`--chartist-color-e` | background color for 5th series |  #453d3f
`--chartist-color-label-e` | color for 5th series label |  `--chartist-label-color`
`--chartist-color-f` | background color for 6th series |  #59922b
`--chartist-color-label-f` | color for 6th series label |  `--chartist-label-color`
`--chartist-color-g` | background color for 7th series |  #0544d3
`--chartist-color-label-g` | color for 7th series label |  `--chartist-label-color`
`--chartist-color-h` | background color for 8th series |  #6b0392
`--chartist-color-label-h` | color for 8th series label |  `--chartist-label-color`
`--chartist-color-i` | background color for 9th series |  #f05b4f
`--chartist-color-label-i` | color for 9th series label |  `--chartist-label-color`
`--chartist-color-j` | background color for 10th series |  #dda458
`--chartist-color-label-j` | color for 10th series label |  `--chartist-label-color`
`--chartist-color-k` | background color for 11th series |  #eacf7d
`--chartist-color-label-k` | color for 11th series label |  `--chartist-label-color`
`--chartist-color-l` | background color for 12th series |  #86797d
`--chartist-color-label-l` | color for 12th series label |  `--chartist-label-color`
`--chartist-color-m` | background color for 13th series |  #b2c326
`--chartist-color-label-m` | color for 13th series label |  `--chartist-label-color`
`--chartist-color-n` | background color for 14th series |  #6188e2
`--chartist-color-label-n` | color for 15th series label |  `--chartist-label-color`
`--chartist-color-0` | background color for 15th series |  #a748ca
`--chartist-color-label-o` | color for 15th series label |  `--chartist-label-color`
 */
class ChartistRender extends ChartistRenderSuper(LitElement) {}
window.customElements.define(ChartistRender.tag, ChartistRender);
export { ChartistRender, ChartistRenderSuper };
