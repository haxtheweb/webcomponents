/**
 * Copyright 2024
 * @license , see License.md for full fs.
 */
import { html } from "lit";
import { DDD } from "../d-d-d.js";
/**
 * `d-d-docs`
 * `design, develop, destroy the competition, documentation`
 * @demo demo/index.html
 * @element d-d-docs
 */
export const styleGuideTopics = {
  Typography: "Typography",
  FW: "FW",
  FS: "FS",
  BS: "BS",
  Breakpoints: "Breakpoints",
  MP: "MP",
  PolarisColors: "PolarisColors",
  PolarisFunctionalColors: "PolarisFunctionalColors",
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
          gap: var(--ddd-spacing-4);
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--ddd-spacing-4);
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 0.5fr 1.5fr;
          gap: var(--ddd-spacing-4);
        }
        .spacing-demo {
          display: grid;
          height: 100%;
        }
        .font-beaverBlue {
          color: var(--ddd-polaris-beaverBlue);
        }
        .bg-limestoneMaxLight {
          background-color: var(--ddd-polaris-limestoneMaxLight);
        }
        .bg-potentialMidnight {
          background-color: var(--ddd-polaris-potentialMidnight);
        }
        .bg-white {
          background-color: var(--ddd-polaris-white);
        }
      `,
    ];
  }

  renderTypography() {
    return html`
      <h1>Typography</h1>
      <h2>Available Typefaces</h2>
      <hr>
      <p>Primary Font: <span class="fw-3">Roboto</span></p>
      <p>Class: <span class="fw-3">ddd-font-primary</span></p>
      <p>Weights: 400(regular),<span class="fw-2">500(medium)</span><span class="fw-3">700(bold)</span><span class="fw-4">900(black)</span></p>
      
      <div class="">
        
      </div>
      <!--
      <h3 class="my-20 font-beaverBlue">Headers</h3>
      <h6>Default Header 6</h6>
      <h5>Default Header 5</h5>
      <h4>Default Header 4</h4>
      <h3>Default Header 3</h3>
      <h2>Default Header 2</h2>
      <h1>Default Header 1</h1>
      <p>Default Body</p>
      <span class="ddd-nav">Default Navigation</span>
      -->
    `;
  }

  renderFW() {
    return html`
      <h3 class="my-20 font-beaverBlue">Font Weights</h3>
      <div class="ml-10 bg-limestoneMaxLight">
        <h3 class="fw-0">Font Weight 0 (nav only)</h3>
        <h3 class="fw-1">Font Weight 1 (header only)</h3>
        <h3 class="fw-2">Font Weight 2 (header only)</h3>
        <h3 class="fw-3">Font Weight 3 (default)</h3>
        <h3 class="fw-4">Font Weight 4 (header only)</h3>
      </div>
      <h6 class="fw-2 ml-10">
        Accessible using class: <span class="fw-4">fw-x</span>
      </h6>
    `;
  }

  renderFS() {
    return html`
      <h3 class="my-20 font-beaverBlue">Font Sizes</h3>
      <div class="ml-10 bg-limestoneMaxLight">
        <h3 class="fs-4xs flex">Font Size 4xs</h3>
        <h3 class="fs-3xs flex">Font Size 3xs</h3>
        <h3 class="fs-xxs flex">Font Size xxs</h3>
        <h3 class="fs-xs flex">Font Size xs</h3>
        <h3 class="fs-s flex">Font Size s</h3>
        <h3 class="fs-ms flex">Font Size ms</h3>
        <h3 class="fs-m flex">Font Size m</h3>
        <h3 class="fs-ml flex">Font Size ml</h3>
        <h3 class="fs-l flex">Font Size l</h3>
        <h3 class="fs-xl flex">Font Size xl</h3>
        <h3 class="fs-xxl flex">Font Size xxl</h3>
        <h3 class="fs-3xl flex">Font Size 3xl</h3>
        <h3 class="fs-4xl flex">Font Size 4xl</h3>
      </div>
      <h6 class="fw-2 ml-10">
        Accessible using class: <span class="fw-4">fs-x</span>
      </h6>
    `;
  }

  renderBS() {
    return html`
      <h3 class="my-20 font-beaverBlue">Borders & Shadows</h3>
      <div class="mt-10 grid-4 ml-10">
        <div class="p-10 b-1"><h5>Border 1</h5></div>
        <div class="p-10 b-2"><h5>Border 2</h5></div>
        <div class="p-10 b-3"><h5>Border 3</h5></div>
        <div class="p-10 b-4"><h5>Border 4</h5></div>
      </div>
      <h6 class="fw-2 ml-10 mb-15">
        Accessible using classes:
        <span class="fw-4">b-x, bt-x, br-x, bb-x, bl-x</span>
      </h6>
      <div class="grid-4 mt-10 ml-10">
        <div class="p-10 boxshadow-1"><h5>Box Shadow 1</h5></div>
        <div class="p-10 boxshadow-2"><h5>Box Shadow 2</h5></div>
        <div class="p-10 boxshadow-3"><h5>Box Shadow 3</h5></div>
        <div class="p-10 boxshadow-4"><h5>Box Shadow 4</h5></div>
      </div>
      <h6 class="fw-2 ml-10 mb-15">
        Accessible using class: <span class="fw-4">boxshadow-x</span>
      </h6>
      <div class="grid-4 mt-10 ml-10">
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

  renderBreakpoints() {
    return html`
      <h3 class="my-20 font-beaverBlue">Breakpoints</h3>
      <div class="grid-2 mt-10 ml-10 mb-5">
        <h4>sm</h4>
        <h4>360px</h4>
        <h4>md</h4>
        <h4>768px</h4>
        <h4>lg</h4>
        <h4>1080px</h4>
        <h4>xl</h4>
        <h4>1440px</h4>
      </div>
      <h6 class="fw-2 ml-10 mb-15">
        Accessible via css variables:
        <span class="fw-4">--ddd-breakpoint-x</span>
      </h6>
    `;
  }

  renderMP() {
    return html`
      <h3 class="my-20 font-beaverBlue">Margin & Padding</h3>
      <div class="grid-3 mt-10 mb-5 ml-20 ">
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

  renderPolarisColors() {
    return html`
      <h3 class="my-20 font-beaverBlue">Polaris Colors</h3>
      <div class="grid-2 my-30 ml-10">
        <h5>--ddd-polaris-beaverBlue</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-beaverBlue);"
        ></div>
        <h5>--ddd-polaris-landgrantBrown</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-landgrantBrown);"
        ></div>
        <h5>--ddd-polaris-nittanyNavy</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-nittanyNavy);"
        ></div>
        <h5>--ddd-polaris-navy40</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-navy40);"
        ></div>
        <h5>--ddd-polaris-navy65</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-navy65);"
        ></div>
        <h5>--ddd-polaris-navy80</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-navy80);"
        ></div>
        <h5>--ddd-polaris-potentialMidnight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-potentialMidnight);"
        ></div>
        <h5>--ddd-polaris-potential50</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-potential50);"
        ></div>
        <h5>--ddd-polaris-pughBlue</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-pughBlue);"
        ></div>
        <h5>--ddd-polaris-coalyGray</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-coalyGray);"
        ></div>
        <h5>--ddd-polaris-keystoneYellow</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-keystoneYellow);"
        ></div>
        <h5>--ddd-polaris-slateGray</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-slateGray);"
        ></div>
        <h5>--ddd-polaris-slateLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-slateLight);"
        ></div>
        <h5>--ddd-polaris-slateMaxLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-slateMaxLight);"
        ></div>
        <h5>--ddd-polaris-skyBlue</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-skyBlue);"
        ></div>
        <h5>--ddd-polaris-skyLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-skyLight);"
        ></div>
        <h5>--ddd-polaris-skyMaxlight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-skyMaxlight);"
        ></div>
        <h5>--ddd-polaris-limestoneGray</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-limestoneGray);"
        ></div>
        <h5>--ddd-polaris-limestoneLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-limestoneLight);"
        ></div>
        <h5>--ddd-polaris-limestoneMaxLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-limestoneMaxLight);"
        ></div>
        <h5>--ddd-polaris-white</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-white);"
        ></div>
        <h5>--ddd-polaris-shrineLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-shrineLight);"
        ></div>
        <h5>--ddd-polaris-shrineMaxLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-shrineMaxLight);"
        ></div>
        <h5>--ddd-polaris-creekTeal</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-creekTeal);"
        ></div>
        <h5>--ddd-polaris-creekLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-creekLight);"
        ></div>
        <h5>--ddd-polaris-creekMaxLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-creekMaxLight);"
        ></div>
        <h5>--ddd-polaris-shrineTan</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-shrineTan);"
        ></div>
        <h5>--ddd-polaris-roarGolden</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-roarGolden);"
        ></div>
        <h5>--ddd-polaris-roarLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-roarLight);"
        ></div>
        <h5>--ddd-polaris-roarMaxlight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-roarMaxlight);"
        ></div>
        <h5>--ddd-polaris-forestGreen</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-forestGreen);"
        ></div>
        <h5>--ddd-polaris-athertonViolet</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-athertonViolet);"
        ></div>
        <h5>--ddd-polaris-original87Pink</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-original87Pink);"
        ></div>
        <h5>--ddd-polaris-discoveryCoral</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-discoveryCoral);"
        ></div>
        <h5>--ddd-polaris-futureLime</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-futureLime);"
        ></div>
        <h5>--ddd-polaris-wonderPurple</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-wonderPurple);"
        ></div>
        <h5>--ddd-polaris-inventOrange</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-inventOrange);"
        ></div>
        <h5>--ddd-polaris-opportunityGreen</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-polaris-opportunityGreen);"
        ></div>
      </div>
    `;
  }

  renderPolarisFunctionalColors() {
    return html`
      <h3 class="my-20 font-beaverBlue">Polaris Functional Colors</h3>
      <div class="grid-2 my-30 ml-10">
        <h5>--ddd-link</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-link);"
        ></div>
        <h5>--ddd-linkLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-linkLight);"
        ></div>
        <h5>--ddd-disabled</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-disabled);"
        ></div>
        <h5>--ddd-error</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-error);"
        ></div>
        <h5>--ddd-errorLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-errorLight);"
        ></div>
        <h5>--ddd-warning</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-warning);"
        ></div>
        <h5>--ddd-warningLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-warningLight);"
        ></div>
        <h5>--ddd-info</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-info);"
        ></div>
        <h5>--ddd-infoLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-infoLight);"
        ></div>
        <h5>--ddd-success</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-success);"
        ></div>
        <h5>--ddd-successLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-successLight);"
        ></div>
      </div>
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