/**
 * Copyright 2024
 * @license , see License.md for full fs.
 */
import { html, css } from "lit";
import { DDD } from "../d-d-d.js";
import { EditableTable } from "../../editable-table/editable-table.js";
/**
 * `d-d-docs`
 * `design, develop, destroy the competition, documentation`
 * @demo demo/index.html
 * @element d-d-docs
 */
export const styleGuideTopics = {
  Borders: "Borders",
  Breakpoints: "Breakpoints",
  PolarisColors: "PolarisColors",
  PolarisFunctionalColors: "PolarisFunctionalColors",
  BS: "BS",
  MP: "MP",
  Typography: "Typography",
};

class DDDocs extends DDD {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.option = "*";
    this.options = Object.keys(styleGuideTopics);
  }
  static get properties() {
    return {
      option: { type: String },
      options: { type: Array },
    };
  }
  static get styles() {
    return [...super.styles,
      css`
        /* used for demo */
        .flex {
          display: flex;
        }
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 0.5fr 1.5fr;
        }
        .grid-2-narrow{
          display: grid;
          grid-template-columns: 0.1fr 5fr;
        }
        .spacing-demo {
          display: grid;
          height: 100%;
        }
        .font-beaverBlue {
          color: var(--ddd-theme-polaris-beaverBlue);
        }
        .bg-limestoneMaxLight {
          background-color: var(--ddd-theme-polaris-limestoneMaxLight);
        }
        .bg-potentialMidnight {
          background-color: var(--ddd-theme-polaris-potentialMidnight);
        }
        .bg-white {
          background-color: var(--ddd-theme-polaris-white);
        }
        .text-center {
          text-align: center;
        }
        .overflow-hidden h3{
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .grid-2-narrow p{
          margin: auto 0;
        }
        
        tr th {
          background-color: var(--ddd-theme-polaris-pughBlue);
          padding: 10px 50px;
          border-top: none;
        }
        tr td {
          padding: 10px 50px;
          background-color: var(--ddd-theme-polaris-skyMaxlight);
          border-left: 1px solid var(--ddd-theme-polaris-limestoneLight);
          border-top: 1px solid var(--ddd-theme-polaris-limestoneLight);
        }
        tr:nth-child(odd) {
          background-color: var(--ddd-theme-polaris-skyMaxLight);
        }
        table {
          border-collapse: collapse;
          border-radius: 0px;
          overflow: hidden;
          border: 1px solid var(--ddd-theme-polaris-limestoneLight);
        }
        td:first-child, th:first-child {
          border-left: none;
        }
      `,
    ];
  }

  renderBorders() {
    return html `
      <h1 class="fs-m my-2">Borders</h1>
      <h2 class="fs-s mt-0 mb-5 pb-5 bb-xs">Available Borders</h2>
      <div class="mx-10">
      <div class="grid-4 gap-10">
        <div class="p-10 b-xs bs-sm"><p class="bb-xs mb-5"></p><p>Class: <span class="fw-3">xs</span></p></div>
        <div class="p-10 b-xs bs-sm"><p class="bb-sm mb-5"></p><p>Class: <span class="fw-3">sm</span></p></div>
        <div class="p-10 b-xs bs-sm"><p class="bb-md mb-5"></p><p>Class: <span class="fw-3">md</span></p></div>
        <div class="p-10 b-xs bs-sm"><p class="bb-lg mb-5"></p><p>Class: <span class="fw-3">lg</span></p></div>
    `;
  }

  renderBreakpoints() {
    return html`
      <h1 class="fs-m mt-20 mb-2">Breakpoints</h1>
      <h2 class="fs-s mt-0 mb-5 pb-5 bb-xs">Available Breakpoints</h2>
      <table class="my-20 mx-10">
        <thead>
          <tr>
            <th>Breakpoint</th>
            <th>Size</th>
          </tr>
        </thead>
          <tr>
            <td>sm</td>
            <td>360px</td>
          </tr>
          <tr>
            <td>md</td>
            <td>768px</td>
          </tr>
          <tr>
            <td>lg</td>
            <td>1080px</td>
          </tr>
          <tr>
            <td>xl</td>
            <td>1440px</td>
          </tr>
      </table>
      <p class="fw-2 ml-10 mb-15">
        Accessible via css variables:
        <span class="fw-4">--ddd-breakpoint-x</span>
      </p>
    `;
  }

  renderPolarisColors() {
    return html`
      <h3 class="my-20 font-beaverBlue">Polaris Colors</h3>
      <div class="grid-2 gap-4 my-30 ml-10">
      <h5>--ddd-theme-polaris-beaverBlue</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-beaverBlue);" title="#1e407c"></div>
      <h5>--ddd-theme-polaris-beaver70</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-beaver70);" title="rgba(30, 64, 124, 0.7)"></div>
      <h5>--ddd-theme-polaris-beaver80</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-beaver80);" title="rgba(30, 64, 124, 0.8)"></div>
      <h5>--ddd-theme-polaris-landgrantBrown</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-landgrantBrown);" title="#6a3028"></div>
      <h5>--ddd-theme-polaris-nittanyNavy</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-nittanyNavy);" title="#001e44"></div>
      <h5>--ddd-theme-polaris-navy40</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-navy40);" title="rgba(0, 30, 68, 0.4)"></div>
      <h5>--ddd-theme-polaris-navy60</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-navy60);" title="rgba(0, 30, 68, 0.60)"></div>
      <h5>--ddd-theme-polaris-navy65</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-navy65);" title="rgba(0, 30, 68, 0.65)"></div>
      <h5>--ddd-theme-polaris-navy70</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-navy70);" title="rgba(0, 30, 68, 0.70)"></div>
      <h5>--ddd-theme-polaris-navy80</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-navy80);" title="rgba(0, 30, 68, 0.8)"></div>
      <h5>--ddd-theme-polaris-potentialMidnight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-potentialMidnight);" title="#000321"></div>
      <h5>--ddd-theme-polaris-potential0</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-potential0);" title="rgba(0, 3, 33, 0)"></div>
      <h5>--ddd-theme-polaris-potential50</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-potential50);" title="rgba(0, 3, 33, 0.5)"></div>
      <h5>--ddd-theme-polaris-potential70</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-potential70);" title="rgba(0, 3, 33, 0.7)"></div>
      <h5>--ddd-theme-polaris-potential75</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-potential75);" title="rgba(0, 3, 33, 0.75)"></div>
      <h5>--ddd-theme-polaris-pughBlue</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-pughBlue);" title="#96bee6"></div>
      <h5>--ddd-theme-polaris-coalyGray</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-coalyGray);" title="#262626"></div>
      <h5>--ddd-theme-polaris-keystoneYellow</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-keystoneYellow);" title="#ffd100"></div>
      <h5>--ddd-theme-polaris-slateGray</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-slateGray);" title="#314d64"></div>
      <h5>--ddd-theme-polaris-slateLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-slateLight);" title="#ccdae6"></div>
      <h5>--ddd-theme-polaris-slateMaxLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-slateMaxLight);" title="#eef3f7"></div>
      <h5>--ddd-theme-polaris-skyBlue</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-skyBlue);" title="#009cde"></div>
      <h5>--ddd-theme-polaris-skyLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-skyLight);" title="#ccf0ff"></div>
      <h5>--ddd-theme-polaris-skyMaxLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-skyMaxLight);" title="#e6f7ff"></div>
      <h5>--ddd-theme-polaris-limestoneGray</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-limestoneGray);" title="#a2aaad"></div>
      <h5>--ddd-theme-polaris-limestoneLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-limestoneLight);" title="#e4e5e7"></div>
      <h5>--ddd-theme-polaris-limestoneMaxLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-limestoneMaxLight);" title="#f2f2f4"></div>
      <h5>--ddd-theme-polaris-white</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-white);" title="#ffffff"></div>
      <h5>--ddd-theme-polaris-shrineLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-shrineLight);" title="#f7f2ee"></div>
      <h5>--ddd-theme-polaris-shrineMaxLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-shrineMaxLight);" title="#fdfbf5"></div>
      <h5>--ddd-theme-polaris-creekTeal</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-creekTeal);" title="#3ea39e"></div>
      <h5>--ddd-theme-polaris-creekLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-creekLight);" title="#cfeceb"></div>
      <h5>--ddd-theme-polaris-creekMaxLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-creekMaxLight);" title="#edf8f7"></div>
      <h5>--ddd-theme-polaris-shrineTan</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-shrineTan);" title="#b88965"></div>
      <h5>--ddd-theme-polaris-roarGolden</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-roarGolden);" title="#bf8226"></div>
      <h5>--ddd-theme-polaris-roarLight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-roarLight);" title="#f9eddc"></div>      
      <h5>--ddd-theme-polaris-roarMaxlight</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-roarMaxlight);" title="#fffaf2"></div>
      <h5>--ddd-theme-polaris-forestGreen</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-forestGreen);" title="#4a7729"></div>
      <h5>--ddd-theme-polaris-athertonViolet</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-athertonViolet);" title="#ac8dce"></div>
      <h5>--ddd-theme-polaris-original87Pink</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-original87Pink);" title="#bc204b"></div>
      <h5>--ddd-theme-polaris-discoveryCoral</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-discoveryCoral);" title="#f2665e"></div>
      <h5>--ddd-theme-polaris-futureLime</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-futureLime);" title="#99cc00"></div>
      <h5>--ddd-theme-polaris-wonderPurple</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-wonderPurple);" title="#491d70"></div>
      <h5>--ddd-theme-polaris-inventOrange</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-inventOrange);" title="#e98300"></div>
      <h5>--ddd-theme-polaris-opportunityGreen</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-opportunityGreen);" title="#008755"></div>
      <h5>--ddd-theme-polaris-accent</h5>
      <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-accent);" title="#96bee6"></div>
      </div>
    `;
  }

  renderPolarisFunctionalColors() {
    return html`
      <h3 class="my-20 font-beaverBlue">Polaris Functional Colors</h3>
      <div class="grid-2 gap-4 my-30 ml-10">
        <h5>--ddd-theme-polaris-link</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-link);" title="#005fa9"></div>
        <h5>--ddd-theme-polaris-link80</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-link80);" title="rgba(0, 95, 169, 0.8)"></div>
        <h5>--ddd-theme-polaris-linkLight</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-linkLight);" title="#cce9ff"></div>
        <h5>--ddd-theme-polaris-disabled</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-disabled);" title="#f4f4f4"></div>
        <h5>--ddd-theme-polaris-error</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-error);" title="#5f2120"></div>
        <h5>--ddd-theme-polaris-errorLight</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-errorLight);" title="#fdeded"></div>
        <h5>--ddd-theme-polaris-warning</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-warning);" title="#663c00"></div>
        <h5>--ddd-theme-polaris-warningLight</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-warningLight);" title="#fff4e5"></div>
        <h5>--ddd-theme-polaris-info</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-info);" title="#014361"></div>
        <h5>--ddd-theme-polaris-infoLight</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-infoLight);" title="#e5f6fd"></div>
        <h5>--ddd-theme-polaris-success</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-success);" title="#1e4620"></div>
        <h5>--ddd-theme-polaris-successLight</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-successLight);" title="#edf7ed"></div>
        <h5>--ddd-theme-polaris-alertImmediate</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-alertImmediate);" title="#f8d3de"></div>
        <h5>--ddd-theme-polaris-alertUrgent</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-alertUrgent);" title="#fff6cc"></div>
        <h5>--ddd-theme-polaris-alertAllClear</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-alertAllClear);" title="#f2ffcc"></div>
        <h5>--ddd-theme-polaris-alertNonEmergency</h5>
        <div class="m-5 p-10 b-xs" style="background-color: var(--ddd-theme-polaris-alertNonEmergency);" title="#e6f7ff"></div>
      </div>
    `;
  }

  renderGradients() {} // Pickup Here

  renderTypography() {
    return html`
      <h1 class="fs-m my-2">Typography</h1>
      <h2 class="fs-s mt-0 mb-5 pb-5 bb-xs">Available Typefaces</h2>
      <div class="mx-10">
        <p>Primary Font: <span class="fw-3">Roboto</span></p>
        <p>Class: <span class="fw-3">ddd-font-primary</span></p>
        <p class="mb-10">Weights: 400(regular), <span class="fw-2">500(medium),</span> <span class="fw-3">700(bold),</span> <span class="fw-4">900(black)</span></p>
      </div>
      <div class="b-xs grid-2-narrow gap-4 py-8 px-4 boxshadow-sm overflow-hidden m-10">
        <p>16</p><h3 class="fs-4xs my-1 mx-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>18</p><h3 class="fs-3xs my-1 mx-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>20</p><h3 class="fs-xxs m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>24</p><h3 class="fs-xs m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>28</p><h3 class="fs-s m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>32</p><h3 class="fs-ms m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>36</p><h3 class="fs-m m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>40</p><h3 class="fs-ml m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>44</p><h3 class="fs-l m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>48</p><h3 class="fs-xl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>56</p><h3 class="fs-xxl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>64</p><h3 class="fs-3xl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>72</p><h3 class="fs-4xl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      </div>
      <div class="mx-10">
        <p>Primary Font: <span class="fw-3">Roboto Slab</span></p>
        <p>Class: <span class="fw-3">ddd-font-secondary</span></p>
        <p class="mb-10">Weights: <span class="fw-3">700(bold)</span></p>
      </div>
      <div class="b-xs grid-2-narrow gap-4 py-8 px-4 boxshadow-sm overflow-hidden m-10">
        <p>16</p><h3 class="ddd-font-secondary fs-4xs my-1 mx-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>18</p><h3 class="ddd-font-secondary fs-3xs my-1 mx-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>20</p><h3 class="ddd-font-secondary fs-xxs m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>24</p><h3 class="ddd-font-secondary fs-xs m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>28</p><h3 class="ddd-font-secondary fs-s m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>32</p><h3 class="ddd-font-secondary fs-ms m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>36</p><h3 class="ddd-font-secondary fs-m m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>40</p><h3 class="ddd-font-secondary fs-ml m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>44</p><h3 class="ddd-font-secondary fs-l m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>48</p><h3 class="ddd-font-secondary fs-xl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>56</p><h3 class="ddd-font-secondary fs-xxl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>64</p><h3 class="ddd-font-secondary fs-3xl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
        <p>72</p><h3 class="ddd-font-secondary fs-4xl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      </div>
      <div class="mx-10">
      <p>Primary Font: <span class="fw-3">Roboto Condesned</span></p>
      <p>Class: <span class="fw-3">ddd-font-nav</span></p>
      <p class="mb-10">Weights: <span class="fw-0">300(light),</span> <span class="fw-3">700(bold)</span></p>
    </div>
    <div class="b-1 grid-2-narrow gap-4 py-8 px-4 boxshadow-sm overflow-hidden m-10">
      <p>16</p><h3 class="ddd-font-nav fs-4xs my-1 mx-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>18</p><h3 class="ddd-font-nav fs-3xs my-1 mx-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>20</p><h3 class="ddd-font-nav fs-xxs m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>24</p><h3 class="ddd-font-nav fs-xs m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>28</p><h3 class="ddd-font-nav fs-s m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>32</p><h3 class="ddd-font-nav fs-ms m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>36</p><h3 class="ddd-font-nav fs-m m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>40</p><h3 class="ddd-font-nav fs-ml m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>44</p><h3 class="ddd-font-nav fs-l m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>48</p><h3 class="ddd-font-nav fs-xl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>56</p><h3 class="ddd-font-nav fs-xxl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>64</p><h3 class="ddd-font-nav fs-3xl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
      <p>72</p><h3 class="ddd-font-nav fs-4xl m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h3>
    </div>
    <div class="mx-10">
    <h1 class="fs-m my-2 bb-xs">Accessing Classes</h1>
    <h2 class="fs-s mt-0 mb-5 pb-5 ">Font Families</h2>
    <p class="mb-10">Classes: ddd-font-primary, ddd-font-secondary, ddd-font-nav</p>
    <h2 class="fs-s mt-0 mb-5 pb-5 ">Font Weights</h2>
    <p class="mb-10">Classes: fw-0, fw-1, fw-2, fw-3, fw-4</p>
    <h2 class="fs-s mt-0 mb-5 pb-5 ">Font Sizes</h2>
    <p class="mb-10">Classes: fs-x (4xs, 3xs, 2xs, xs, s, ms, m, ml, l, xl, 2xl, 3xl, 4xl)</p>
    <h2 class="fs-s mt-0 mb-5 pb-5 ">Letter Spacing</h2>
    <table class="my-10">
      <thead><th>Class</th><th>Value</th><th>Example</th></thead>
      <tr><td>ls-16-sm</td><td>0.08px</td><td><span class="ls-16-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-18-sm</td><td>0.09px</td><td><span class="ls-18-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-20-sm</td><td>0.1px</td><td><span class="ls-20-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-24-sm</td><td>0.12px</td><td><span class="ls-24-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-28-sm</td><td>0.14px</td><td><span class="ls-28-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-32-sm</td><td>0.16px</td><td><span class="ls-32-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-36-sm</td><td>0.18px</td><td><span class="ls-36-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-40-sm</td><td>0.2px</td><td><span class="ls-40-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-44-sm</td><td>0.22px</td><td><span class="ls-44-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-48-sm</td><td>0.24px</td><td><span class="ls-48-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-56-sm</td><td>0.28px</td><td><span class="ls-56-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-64-sm</td><td>0.32px</td><td><span class="ls-64-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-72-sm</td><td>0.36px</td><td><span class="ls-72-sm fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-16-lg</td><td>0.24px</td><td><span class="ls-16-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-18-lg</td><td>0.27px</td><td><span class="ls-18-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-20-lg</td><td>0.3px</td><td><span class="ls-20-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-24-lg</td><td>0.36px</td><td><span class="ls-24-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-28-lg</td><td>0.42px</td><td><span class="ls-28-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-32-lg</td><td>0.48px</td><td><span class="ls-32-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-36-lg</td><td>0.54px</td><td><span class="ls-36-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-40-lg</td><td>0.6px</td><td><span class="ls-40-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-44-lg</td><td>0.66px</td><td><span class="ls-44-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-48-lg</td><td>0.72px</td><td><span class="ls-48-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-56-lg</td><td>0.84px</td><td><span class="ls-56-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-64-lg</td><td>0.96px</td><td><span class="ls-64-lg fw-1">PSU-FLEX</span></td></tr>
      <tr><td>ls-72-lg</td><td>1.08px</td><td><span class="ls-72-lg fw-1">PSU-FLEX</span></td></tr>
    </table>
    <h2 class="fs-s mt-0 mb-5 pb-5 ">Line Height</h2>
    <div class="grid-4 gap-4">
      <div>
        <p class="lh-120 p-5 b-xs bs-sm mb-10">So, I came across your post because I was facing the same issue, but I've found a solution.</p>
        <p class="text-center">Class: <span class="fw-3">lh-120</span></p>
      </div>
      <div>
        <p class="lh-140 p-5 b-xs bs-sm mb-10">So, I came across your post because I was facing the same issue, but I've found a solution.</p>
        <p class="text-center">Class: <span class="fw-3">lh-140</span></p>
      </div>
      <div>
        <p class="lh-150 p-5 b-xs bs-sm mb-10">So, I came across your post because I was facing the same issue, but I've found a solution.</p>
        <p class="text-center">Class: <span class="fw-3">lh-150</span></p>
      </div>
      <div>
        <p class="lh-160 p-5 b-xs bs-sm mb-10">So, I came across your post because I was facing the same issue, but I've found a solution.</p>
        <p class="text-center">Class: <span class="fw-3">lh-160</span></p>
      </div>
    </div>
    </div>
    `;
  }



  renderBS() {
    return html`
      <h3 class="my-20 font-beaverBlue">Borders & Shadows</h3>
      <div class="mt-10 grid-4 gap-4 ml-10">
        <div class="p-10 b-xs"><h5>Border 1</h5></div>
        <div class="p-10 b-sm"><h5>Border 2</h5></div>
        <div class="p-10 b-md"><h5>Border 3</h5></div>
        <div class="p-10 b-lg"><h5>Border 4</h5></div>
      </div>
      <h6 class="fw-2 ml-10 mb-15">
        Accessible using classes:
        <span class="fw-4">b-x, bt-x, br-x, bb-x, bl-x</span>
      </h6>
      <div class="grid-4 gap-4 mt-10 ml-10">
        <div class="p-10 boxshadow-1"><h5>Box Shadow 1</h5></div>
        <div class="p-10 boxshadow-2"><h5>Box Shadow 2</h5></div>
        <div class="p-10 boxshadow-3"><h5>Box Shadow 3</h5></div>
        <div class="p-10 boxshadow-4"><h5>Box Shadow 4</h5></div>
      </div>
      <h6 class="fw-2 ml-10 mb-15">
        Accessible using class: <span class="fw-4">boxshadow-x</span>
      </h6>
      <div class="grid-4 gap-4 mt-10 ml-10">
        <div class="p-10 textshadow-1"><h5>Text Shadow 1</h5></div>
        <div class="p-10 textshadow-2"><h5>Text Shadow 2</h5></div>
        <div class="p-10 textshadow-3"><h5>Text Shadow 3</h5></div>
        <div class="p-10 textshadow-4"><h5>Text Shadow 4</h5></div>
      </div>
      <h6 class="fw-2 ml-10 mb-15">
        Accessible using class: <span class="fw-4">textshadow-x</span>
      </h6>
    `;
  }

  renderMP() {
    return html`
      <h3 class="my-20 font-beaverBlue">Margin & Padding</h3>
      <div class="grid-3 gap-4 mt-10 mb-5 ml-20 ">
        <h4>Class Name</h4>
        <h4>Value</h4>
        <h4>Example</h4>
        <h5>m-0</h5>
        <h5>0px</h5>
        <div class="bg-potentialMidnight">
          <span class="m-0 bg-white spacing-demo"></span>
        </div>
        <h5>m-1</h5>
        <h5>4px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-1 bg-white spacing-demo"></span>
        </div>
        <h5>m-2</h5>
        <h5>8px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-2 bg-white spacing-demo"></span>
        </div>
        <h5>m-3</h5>
        <h5>12px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-3 bg-white spacing-demo"></span>
        </div>
        <h5>m-4</h5>
        <h5>16px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-4 bg-white spacing-demo"></span>
        </div>
        <h5>m-5</h5>
        <h5>20px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-5 bg-white spacing-demo"></span>
        </div>
        <h5>m-6</h5>
        <h5>24px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-6 bg-white spacing-demo"></span>
        </div>
        <h5>m-7</h5>
        <h5>28px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-7 bg-white spacing-demo"></span>
        </div>
        <h5>m-8</h5>
        <h5>32px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-8 bg-white spacing-demo"></span>
        </div>
        <h5>m-9</h5>
        <h5>36px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-9 bg-white spacing-demo"></span>
        </div>
        <h5>m-10</h5>
        <h5>40px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-10 bg-white spacing-demo"></span>
        </div>
        <h5>m-11</h5>
        <h5>44px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-11 bg-white spacing-demo"></span>
        </div>
        <h5>m-12</h5>
        <h5>48px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-12 bg-white spacing-demo"></span>
        </div>
        <h5>m-13</h5>
        <h5>52px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-13 bg-white spacing-demo"></span>
        </div>
        <h5>m-14</h5>
        <h5>56px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-14 bg-white spacing-demo"></span>
        </div>
        <h5>m-15</h5>
        <h5>60px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-15 bg-white spacing-demo"></span>
        </div>
        <h5>m-16</h5>
        <h5>64px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-16 bg-white spacing-demo"></span>
        </div>
        <h5>m-17</h5>
        <h5>68px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-17 bg-white spacing-demo"></span>
        </div>
        <h5>m-18</h5>
        <h5>72px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-18 bg-white spacing-demo"></span>
        </div>
        <h5>m-19</h5>
        <h5>76px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-19 bg-white spacing-demo"></span>
        </div>
        <h5>m-20</h5>
        <h5>80px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-20 bg-white spacing-demo"></span>
        </div>
        <h5>m-21</h5>
        <h5>84px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-21 bg-white spacing-demo"></span>
        </div>
        <h5>m-22</h5>
        <h5>88px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-22 bg-white spacing-demo"></span>
        </div>
        <h5>m-23</h5>
        <h5>92px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-23 bg-white spacing-demo"></span>
        </div>
        <h5>m-24</h5>
        <h5>96px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-24 bg-white spacing-demo"></span>
        </div>
        <h5>m-25</h5>
        <h5>100px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-25 bg-white spacing-demo"></span>
        </div>
        <h5>m-26</h5>
        <h5>104px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-26 bg-white spacing-demo"></span>
        </div>
        <h5>m-27</h5>
        <h5>108px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-27 bg-white spacing-demo"></span>
        </div>
        <h5>m-28</h5>
        <h5>112px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-28 bg-white spacing-demo"></span>
        </div>
        <h5>m-29</h5>
        <h5>116px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-29 bg-white spacing-demo"></span>
        </div>
        <h5>m-30</h5>
        <h5>120px</h5>
        <div class="bg-potentialMidnight">
          <span class="ml-30 bg-white spacing-demo"></span>
        </div>
      </div>
      <h6 class="fw-2 ml-10 my-0">
        Accessible using format:
        <span class="fw-4">(m or p)(side [optional])-x</span>
      </h6>
      <h6 class="fw-2 ml-10 mb-15">
        Sides: Top (t), Right (r), Bottom (b), Left (l), X (x), Y (y)
      </h6>
    `;
  }



  /**
   * LitElement render callback
   */
  render() {
    if (this.options.includes(this.option)) {
      return html`${this[`render${this.option}`]()}`;
    }
    return html`${this.options.map((option) => this[`render${option}`]())}`;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "d-d-docs";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return {
      api: "1",
      type: "element",
      editingElement: "core",
      hideDefaultSettings: false,
      canScale: true,
      canPosition: true,
      canEditSource: true,
      contentEditable: false,
      gizmo: {
        title: "Design, Develop, Destroy",
        description: "Design system implementation for HAX",
        icon: "hax:hax2022",
        color: "purple",
        tags: ["Other", "developer", "design"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "option",
            title: "Option to render",
            type: "select",
            options: { "*": "Full styleguide", ...styleGuideTopics },
          },
        ],
        advanced: [],
        developer: [],
      },
      saveOptions: {
        unsetAttributes: [],
      },
      documentation: {
        howTo: null,
        purpose: null,
      },
      demoSchema: [
        {
          tag: "d-d-docs",
          content: "",
          properties: {},
        },
      ],
    };
  }
}
customElements.define(DDDocs.tag, DDDocs);
export { DDDocs };