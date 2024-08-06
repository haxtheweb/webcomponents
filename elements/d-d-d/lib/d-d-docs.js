/**
 * Copyright 2024
 * @license , see License.md for full fs.
 */
import { html, css } from "lit";
import { DDD } from "../d-d-d.js";
import { DDDAllStyles, ApplicationAttributeData } from "./DDDStyles.js";
import "@haxtheweb/page-section/page-section.js";
import "@haxtheweb/simple-cta/simple-cta.js";
import "@haxtheweb/video-player/video-player.js";
import "@haxtheweb/figure-label/figure-label.js";
import "@haxtheweb/stop-note/stop-note.js";
import "@haxtheweb/course-design/lib/learning-component.js";
import "@haxtheweb/course-design/lib/block-quote.js";
import "@haxtheweb/self-check/self-check.js";
import "@haxtheweb/media-image/media-image.js";
import "@haxtheweb/accent-card/accent-card.js";
/**
 * `d-d-docs`
 * `design, develop, destroy the competition, documentation`
 * @demo demo/index.html
 * @element d-d-docs
 */
export const styleGuideTopics = {
  DDDelementsList: "DDDelementsList",
  Breakpoints: "Breakpoints",
  DataAttributes: "DataAttributes",
  Borders: "Borders",
  DefaultColors: "DefaultColors",
  DefaultFunctionalColors: "DefaultFunctionalColors",
  Gradients: "Gradients",
  Radius: "Radius",
  Shadows: "Shadows",
  Spacing: "Spacing",
  HeaderSample: "HeaderSample",
  Typography: "Typography",
  RichText: "RichText",
  InstructionalComponents: "InstructionalComponents",
  Buttons: "Buttons",
  PageSections: "PageSections",
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
    return [
      super.styles,
      DDDAllStyles,
      css`
        /* used for demo */
        :host {
          display: block;
        }
        /** some specific hacks for presenting things nicer */
        .radius {
          overflow-x: auto;
        }
        .radius div p.b-sm {
          height: var(--ddd-spacing-10);
        }
        details div div {
          font-size: var(--ddd-font-size-4xs);
        }

        .DefaultColors h5,
        .DefaultFunctionalColors h5 {
          margin: var(--ddd-spacing-8) 0 0 0;
          padding: 0;
          font-size: var(--ddd-font-size-4xs);
        }

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
          grid-template-columns: 0.75fr 1.25fr;
        }
        .grid-2-narrow {
          display: grid;
          grid-template-columns: 0.1fr 5fr;
        }
        .grid-5 {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
        }
        .grid-6 {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
        }
        .grid-7 {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        .spacing-demo {
          display: grid;
          height: 100%;
        }
        .font-beaverBlue {
          color: var(--ddd-theme-default-beaverBlue);
        }
        .bg-limestoneMaxLight {
          background-color: var(--ddd-theme-default-limestoneMaxLight);
        }
        .bg-potentialMidnight {
          background-color: var(--ddd-theme-default-potentialMidnight);
        }
        .bg-white {
          background-color: var(--ddd-theme-default-white);
        }
        .text-center {
          text-align: center;
        }
        .overflow-hidden h3 {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .grid-2-narrow p {
          margin: auto 0;
        }

        tr th {
          background-color: var(--ddd-theme-default-pughBlue);
          padding: 10px 50px;
          border-top: none;
        }
        tr td {
          padding: 10px 50px;
          background-color: var(--ddd-theme-default-skyMaxlight);
          border-left: 1px solid var(--ddd-theme-default-limestoneLight);
          border-top: 1px solid var(--ddd-theme-default-limestoneLight);
        }
        tr:nth-child(odd) {
          background-color: var(--ddd-theme-default-skyMaxLight);
        }
        table {
          border-collapse: collapse;
          border-radius: 0px;
          overflow: hidden;
          border: 1px solid var(--ddd-theme-default-limestoneLight);
        }
        td:first-child,
        th:first-child {
          border-left: none;
        }

        simple-cta + simple-cta {
          margin-left: 0 var(--ddd-spacing-4);
        }

        .my-16 {
          margin: var(--ddd-spacing-4) 0;
        }

        .buttonContainer {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          width: 60%;
          gap: 10px;
          border: 1px solid var(--ddd-theme-default-limestoneLight);
          padding: 10px;
        }
        .buttonContainer:first-of-type {
          border-bottom: none;
        }
        .buttonContainer:not(:first-of-type) {
          border-top: none;
        }
        .buttonContainer:not(:last-of-type) {
          border-bottom: none;
        }
      `,
    ];
  }

  renderDataAttributes() {
    return html`${Object.keys(ApplicationAttributeData).map(
        (key) => html`
          <h2>${key}</h2>
          <div>
            ${Object.keys(ApplicationAttributeData[key]).map(
              (key2) => html`
                <d-d-d-sample type="${key}" option="${key2}"
                  ><em style="margin-left:12px;"
                    >data-${key}="${key2}"</em
                  ></d-d-d-sample
                >
              `,
            )}
          </div>
        `,
      )}
      <h5 style="margin-top: 64px;">
        Note: Pointer events are disabled so the pulsing will not self-remove on
        hover
      </h5>
      <div
        style="display: grid; grid-template-columns: repeat(4, 1fr); margin: 32px 64px 64px; row-gap: 32px; pointer-events: none;"
      >
        ${Object.keys(ApplicationAttributeData.primary).map(
          (key) => html`
            <simple-cta data-primary="${key}" data-pulse
              >Primary-${key}</simple-cta
            >
            <simple-cta data-primary="${key}" data-pulse light
              >Primary-${key}</simple-cta
            >
          `,
        )}
      </div> `;
  }

  renderHeaderSample() {
    let headers = [];
    for (let i = 0; i < 22; i++) {
      headers.push(html`
        <details style="max-width: 100%; margin: 0 64px;">
          <summary data-primary="${i}" style="color: var(--ddd-theme-primary);">
            Header Sample ${i}
          </summary>
          ${Array(6)
            .fill()
            .map(
              (_, y) => html`
                <div
                  class="my-16"
                  data-accent
                  data-primary="${i}"
                  style="--ddd-theme-accent: var(--ddd-accent-${y}); border: var(--ddd-border-sm); border-color: var(--ddd-theme-primary);"
                >
                  <h2 data-primary="${i}" data-design-treatment="horz">
                    Discover Penn State
                  </h2>
                  <p>ddd-primary-${i}</p>
                  <p>ddd-accent-${y}</p>
                </div>
              `,
            )}
          <p
            data-primary="${i}"
            data-design-treatment="dropCap"
            data-accent="2"
          >
            Penn State is a top-ranked research university and Pennsylvania's
            sole land-grant institution, founded with a mission of high-quality
            teaching, expert research, and global service. Discover a
            community—more than 775,000 strong—driven to make a difference.
          </p>
          ${Array(6)
            .fill()
            .map((_, n) => {
              if (n === 0) {
                return html`<h2
                  data-primary="${i}"
                  data-design-treatment="vert"
                >
                  Sample Header
                </h2>`;
              } else if (n === 1) {
                return html`<h2
                  data-primary="${i}"
                  data-design-treatment="horz"
                >
                  Sample Header
                </h2>`;
              } else if (n === 2) {
                return html`<h2 data-primary="${i}" data-design-treatment="bg">
                  Sample Header
                </h2>`;
              } else if (n === 3) {
                return html`<h2 data-primary="${i}" data-instructional-action>
                  Sample Header
                </h2>`;
              } else if (n === 4) {
                return html`<h2
                  data-primary="${i}"
                  data-instructional-action
                  data-design-treatment="horz"
                >
                  Sample Header
                </h2>`;
              } else if (n === 5) {
                return html`<h2
                  data-primary="${i}"
                  data-instructional-action
                  data-design-treatment="bg"
                >
                  Sample Header
                </h2>`;
              }
            })}
        </details>
      `);
    }
    return headers;
  }

  renderDDDelementsList() {
    return html`
      <h2>DDD Enabled Elements</h2>
      <ul>
        <li>DDD</li>
        <li>figure-label</li>
        <li>stop-note</li>
        <li>learning-component</li>
        <li>block-quote</li>
        <li>self-check</li>
        <li>media-image</li>
        <li>accent-card</li>
        <li>page-section</li>
        <li>simple-cta</li>
        <li>video-player</li>
        <li>citation-element</li>
        <li>license-element</li>
        <li>simple-modal</li>
      </ul>
      <h3>Testing</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut
        <span
          style="color: var(--ddd-theme-default-opportunityGreen); text-decoration: underline; padding: 4px; cursor: pointer;"
          ><simple-icon-lite
            icon="icons:language"
            style="--simple-icon-color: var(--ddd-theme-default-opportunityGreen);"
          ></simple-icon-lite
          >aliquip</span
        >
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    `;
  }

  renderBorders() {
    return html`
      <h2 class="fs-s mt-0 mb-5 pb-5 bb-sm">Available Borders</h2>
      <div class="grid-4 gap-10 mx-5 my-15">
        <div class="p-10 b-xs bs-sm">
          <p class="bb-xs mb-5"></p>
          <p>Class: <span class="fw-3">b-xs</span></p>
          <p class="mb-5">
            css variable: <span class="fw-3">--ddd-border-xs</span>
          </p>
        </div>
        <div class="p-10 b-xs bs-sm">
          <p class="bb-sm mb-5"></p>
          <p>Class: <span class="fw-3">b-sm</span></p>
          <p class="mb-5">
            css variable: <span class="fw-3">--ddd-border-sm</span>
          </p>
        </div>
        <div class="p-10 b-xs bs-sm">
          <p class="bb-md mb-5"></p>
          <p>Class: <span class="fw-3">b-md</span></p>
          <p class="mb-5">
            css variable: <span class="fw-3">--ddd-border-md</span>
          </p>
        </div>
        <div class="p-10 b-xs bs-sm">
          <p class="bb-lg mb-5"></p>
          <p>Class: <span class="fw-3">b-lg</span></p>
          <p class="mb-5">
            css variable: <span class="fw-3">--ddd-border-lg</span>
          </p>
        </div>
      </div>
    `;
  }

  renderBreakpoints() {
    return html`
      <h2 class="fs-s mt-0 mb-5 pb-5 bb-sm">Available Breakpoints</h2>
      <table class="my-15 mx-5">
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
        <span class="fw-3">--ddd-breakpoint-x</span>
      </p>
    `;
  }

  renderDefaultColors() {
    return html`
      <h2 class="fs-s mt-0 mb-2 pb-5 bb-sm">
        Available Colors from the Polaris Theme
      </h2>
      <div class="grid-2 gap-1 my-5">
        <h5>--ddd-theme-default-beaverBlue</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-beaverBlue);"
          title="#1e407c"
        ></div>
        <h5>--ddd-theme-default-beaver70</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-beaver70);"
          title="rgba(30, 64, 124, 0.7)"
        ></div>
        <h5>--ddd-theme-default-beaver80</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-beaver80);"
          title="rgba(30, 64, 124, 0.8)"
        ></div>
        <h5>--ddd-theme-default-landgrantBrown</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-landgrantBrown);"
          title="#6a3028"
        ></div>
        <h5>--ddd-theme-default-nittanyNavy</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-nittanyNavy);"
          title="#001e44"
        ></div>
        <h5>--ddd-theme-default-navy40</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-navy40);"
          title="rgba(0, 30, 68, 0.4)"
        ></div>
        <h5>--ddd-theme-default-navy60</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-navy60);"
          title="rgba(0, 30, 68, 0.60)"
        ></div>
        <h5>--ddd-theme-default-navy65</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-navy65);"
          title="rgba(0, 30, 68, 0.65)"
        ></div>
        <h5>--ddd-theme-default-navy70</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-navy70);"
          title="rgba(0, 30, 68, 0.70)"
        ></div>
        <h5>--ddd-theme-default-navy80</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-navy80);"
          title="rgba(0, 30, 68, 0.8)"
        ></div>
        <h5>--ddd-theme-default-potentialMidnight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-potentialMidnight);"
          title="#000321"
        ></div>
        <h5>--ddd-theme-default-potential0</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-potential0);"
          title="rgba(0, 3, 33, 0)"
        ></div>
        <h5>--ddd-theme-default-potential50</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-potential50);"
          title="rgba(0, 3, 33, 0.5)"
        ></div>
        <h5>--ddd-theme-default-potential70</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-potential70);"
          title="rgba(0, 3, 33, 0.7)"
        ></div>
        <h5>--ddd-theme-default-potential75</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-potential75);"
          title="rgba(0, 3, 33, 0.75)"
        ></div>
        <h5>--ddd-theme-default-pughBlue</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-pughBlue);"
          title="#96bee6"
        ></div>
        <h5>--ddd-theme-default-coalyGray</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-coalyGray);"
          title="#262626"
        ></div>
        <h5>--ddd-theme-default-keystoneYellow</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-keystoneYellow);"
          title="#ffd100"
        ></div>
        <h5>--ddd-theme-default-slateGray</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-slateGray);"
          title="#314d64"
        ></div>
        <h5>--ddd-theme-default-slateLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-slateLight);"
          title="#ccdae6"
        ></div>
        <h5>--ddd-theme-default-slateMaxLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-slateMaxLight);"
          title="#eef3f7"
        ></div>
        <h5>--ddd-theme-default-skyBlue</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-skyBlue);"
          title="#009cde"
        ></div>
        <h5>--ddd-theme-default-skyLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-skyLight);"
          title="#ccf0ff"
        ></div>
        <h5>--ddd-theme-default-skyMaxLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-skyMaxLight);"
          title="#e6f7ff"
        ></div>
        <h5>--ddd-theme-default-limestoneGray</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-limestoneGray);"
          title="#a2aaad"
        ></div>
        <h5>--ddd-theme-default-limestoneLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-limestoneLight);"
          title="#e4e5e7"
        ></div>
        <h5>--ddd-theme-default-limestoneMaxLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-limestoneMaxLight);"
          title="#f2f2f4"
        ></div>
        <h5>--ddd-theme-default-white</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-white);"
          title="#ffffff"
        ></div>
        <h5>--ddd-theme-default-shrineLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-shrineLight);"
          title="#f7f2ee"
        ></div>
        <h5>--ddd-theme-default-shrineMaxLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-shrineMaxLight);"
          title="#fdfbf5"
        ></div>
        <h5>--ddd-theme-default-creekTeal</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-creekTeal);"
          title="#3ea39e"
        ></div>
        <h5>--ddd-theme-default-creekLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-creekLight);"
          title="#cfeceb"
        ></div>
        <h5>--ddd-theme-default-creekMaxLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-creekMaxLight);"
          title="#edf8f7"
        ></div>
        <h5>--ddd-theme-default-shrineTan</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-shrineTan);"
          title="#b88965"
        ></div>
        <h5>--ddd-theme-default-roarGolden</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-roarGolden);"
          title="#bf8226"
        ></div>
        <h5>--ddd-theme-default-roarLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-roarLight);"
          title="#f9eddc"
        ></div>
        <h5>--ddd-theme-default-roarMaxlight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-roarMaxlight);"
          title="#fffaf2"
        ></div>
        <h5>--ddd-theme-default-forestGreen</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-forestGreen);"
          title="#4a7729"
        ></div>
        <h5>--ddd-theme-default-athertonViolet</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-athertonViolet);"
          title="#ac8dce"
        ></div>
        <h5>--ddd-theme-default-original87Pink</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-original87Pink);"
          title="#bc204b"
        ></div>
        <h5>--ddd-theme-default-discoveryCoral</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-discoveryCoral);"
          title="#f2665e"
        ></div>
        <h5>--ddd-theme-default-futureLime</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-futureLime);"
          title="#99cc00"
        ></div>
        <h5>--ddd-theme-default-wonderPurple</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-wonderPurple);"
          title="#491d70"
        ></div>
        <h5>--ddd-theme-default-inventOrange</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-inventOrange);"
          title="#e98300"
        ></div>
        <h5>--ddd-theme-default-opportunityGreen</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-opportunityGreen);"
          title="#008755"
        ></div>
        <h5>--ddd-theme-default-globalNeon</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-globalNeon);"
          title="#00a99d"
        ></div>
        <h5>--ddd-theme-default-accent</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-accent);"
          title="#96bee6"
        ></div>
      </div>
    `;
  }

  renderDefaultFunctionalColors() {
    return html`
      <h2 class="fs-s mt-0 mb-2 pb-5 bb-sm">
        Available Functional Colors from the Polaris Theme
      </h2>
      <div class="grid-2 gap-1 my-5">
        <h5>--ddd-theme-default-link</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-link);"
          title="#005fa9"
        ></div>
        <h5>--ddd-theme-default-link80</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-link80);"
          title="rgba(0, 95, 169, 0.8)"
        ></div>
        <h5>--ddd-theme-default-linkLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-linkLight);"
          title="#cce9ff"
        ></div>
        <h5>--ddd-theme-default-disabled</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-disabled);"
          title="#f4f4f4"
        ></div>
        <h5>--ddd-theme-default-error</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-error);"
          title="#5f2120"
        ></div>
        <h5>--ddd-theme-default-errorLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-errorLight);"
          title="#fdeded"
        ></div>
        <h5>--ddd-theme-default-warning</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-warning);"
          title="#663c00"
        ></div>
        <h5>--ddd-theme-default-warningLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-warningLight);"
          title="#fff4e5"
        ></div>
        <h5>--ddd-theme-default-info</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-info);"
          title="#014361"
        ></div>
        <h5>--ddd-theme-default-infoLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-infoLight);"
          title="#e5f6fd"
        ></div>
        <h5>--ddd-theme-default-success</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-success);"
          title="#1e4620"
        ></div>
        <h5>--ddd-theme-default-successLight</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-successLight);"
          title="#edf7ed"
        ></div>
        <h5>--ddd-theme-default-alertImmediate</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-alertImmediate);"
          title="#f8d3de"
        ></div>
        <h5>--ddd-theme-default-alertUrgent</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-alertUrgent);"
          title="#fff6cc"
        ></div>
        <h5>--ddd-theme-default-alertAllClear</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-alertAllClear);"
          title="#f2ffcc"
        ></div>
        <h5>--ddd-theme-default-alertNonEmergency</h5>
        <div
          class="m-5 p-10 b-xs"
          style="background-color: var(--ddd-theme-default-alertNonEmergency);"
          title="#e6f7ff"
        ></div>
      </div>
    `;
  }

  renderGradients() {
    return html`
      <h2 class="fs-s mt-0 mb-2 pb-5 bb-sm">
        Available Gradients from the Polaris Theme
      </h2>
      <div class="grid-6 my-15 ml-10">
        <div>
          <p class="mx-2 p-24 px-10 r-md b-xs bs-lg bg-gradient-navBar"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bg-gradient-navBar</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable:
            <span class="fw-3">--ddd-theme-default-gradient-navBar</span>
          </p>
        </div>
        <div>
          <p class="mx-2 p-24 px-10 r-md b-xs bs-lg bg-gradient-footer"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bg-gradient-footer</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable:
            <span class="fw-3">--ddd-theme-default-gradient-footer</span>
          </p>
        </div>
        <div>
          <p
            class="mx-2 p-24 px-10 r-md b-xs bs-lg bg-gradient-newsFeature"
          ></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bg-gradient-newsFeature</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable:
            <span class="fw-3">--ddd-theme-default-gradient-newsFeature</span>
          </p>
        </div>
        <div>
          <p class="mx-2 p-24 px-10 r-md b-xs bs-lg bg-gradient-buttons"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bg-gradient-buttons</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable:
            <span class="fw-3">--ddd-theme-default-gradient-buttons</span>
          </p>
        </div>
        <div>
          <p class="mx-2 p-24 px-10 r-md b-xs bs-lg bg-gradient-hero"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bg-gradient-hero</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable:
            <span class="fw-3">--ddd-theme-default-gradient-hero</span>
          </p>
        </div>
        <div>
          <p class="mx-2 p-24 px-10 r-md b-xs bs-lg bg-gradient-hero2"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bg-gradient-hero2</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable:
            <span class="fw-3">--ddd-theme-default-gradient-hero2</span>
          </p>
        </div>
      </div>
    `;
  }

  renderRadius() {
    return html`
      <h2 class="fs-s mt-0 mb-2 pb-5 bb-sm">Available Radius classes</h2>
      <div class="grid-7 my-15 mx-5 gap-2 radius">
        <div>
          <p class="p-20 r-xs b-sm bs-sm"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">r-xs</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-radius-xs</span>
          </p>
        </div>
        <div>
          <p class="p-20 r-sm b-sm bs-sm"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">r-sm</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-radius-sm</span>
          </p>
        </div>
        <div>
          <p class="p-20 r-md b-sm bs-sm"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">r-md</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-radius-md</span>
          </p>
        </div>
        <div>
          <p class="p-20 r-lg b-sm bs-sm"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">r-lg</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-radius-lg</span>
          </p>
        </div>
        <div>
          <p class="p-20 r-xl b-sm bs-sm"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">r-xl</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-radius-xl</span>
          </p>
        </div>
        <div>
          <p class="p-20 r-rounded b-sm bs-sm"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">r-rounded</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-radius-rounded</span>
          </p>
        </div>
        <div>
          <p class="my-4 p-20 r-circle b-sm bs-sm"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">r-circle</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-radius-circle</span>
          </p>
        </div>
      </div>
    `;
  }

  renderShadows() {
    return html`
      <h2 class="fs-s mt-0 mb-2 pb-5 bb-sm">Available Shadow classes</h2>
      <div class="grid-4 my-15 mx-30 gap-10">
        <div>
          <p class="py-20 b-sm bs-sm"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bs-sm</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-boxShadow-sm</span>
          </p>
        </div>
        <div>
          <p class="py-20 b-sm bs-md"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bs-md</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-boxShadow-md</span>
          </p>
        </div>
        <div>
          <p class="py-20 b-sm bs-lg"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bs-lg</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-boxShadow-lg</span>
          </p>
        </div>
        <div>
          <p class="py-20 b-sm bs-xl"></p>
          <p class="mt-5 mx-auto text-center">
            class: <span class="fw-3">bs-xl</span>
          </p>
          <p class="mb-5 mx-auto text-center">
            css variable: <span class="fw-3">--ddd-boxShadow-xl</span>
          </p>
        </div>
      </div>
    `;
  }

  renderSpacing() {
    return html`
      <h2 class="fs-s mt-0 mb-2 pb-5 bb-sm">Available Spacing classes</h2>
      <h6 class="fw-2 ml-10 mb-15">
        CSS Variable:<span class="fw-3">--ddd-spacing-x</span> (1-30)
      </h6>
      <div class="grid-3 gap-4 mt-10 mb-5 mx-20">
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
        <span class="fw-3">(m or p)(side [optional])-x</span>
      </h6>
      <h6 class="fw-2 ml-10">
        Sides: Top (t), Right (r), Bottom (b), Left (l), X (x), Y (y)
      </h6>
      <h6 class="fw-2 ml-10 mb-15">
        Example: <span class="fw-3">mt-1</span> = margin-top: 4px
      </h6>
    `;
  }

  renderTypography() {
    return html`
      <h2 class="fs-s mt-0 mb-5 pb-5 bb-sm">Available Typefaces</h2>
      <div class="mx-5">
        <p>
          Primary Font:
          <span class="fw-3"
            >Roboto (ddd-font-primary) [--ddd-font-primary]</span
          >
        </p>
        <p class="mb-10">
          Weights: 400 (fw-1) [--ddd-font-weight-regular],
          <span class="fw-2">500 (fw-2) [--ddd-font-weight-medium],</span>
          <span class="fw-3"
            ><< Default >> 700 (fw-3) [--ddd-font-weight-bold],</span
          >
          <span class="fw-3">900 (fw-3) [--ddd-font-weight-black]</span>
        </p>
      </div>
      <div
        class="b-xs grid-2-narrow gap-4 py-8 px-4 boxshadow-sm overflow-hidden m-10"
      >
        <p>16</p>
        <h3 class="fs-4xs my-1 mx-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>18</p>
        <h3 class="fs-3xs my-1 mx-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>20</p>
        <h3 class="fs-xxs m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>24</p>
        <h3 class="fs-xs m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>28</p>
        <h3 class="fs-s m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>32</p>
        <h3 class="fs-ms m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>36</p>
        <h3 class="fs-m m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>40</p>
        <h3 class="fs-ml m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>44</p>
        <h3 class="fs-l m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>48</p>
        <h3 class="fs-xl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>56</p>
        <h3 class="fs-xxl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>64</p>
        <h3 class="fs-3xl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>72</p>
        <h3 class="fs-4xl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
      </div>
      <div class="mx-5">
        <p>
          Primary Font:
          <span class="fw-3"
            >Roboto Slab (ddd-font-secondary) [--ddd-font-secondary]</span
          >
        </p>
        <p class="mb-10">
          Weights:
          <span class="fw-3">700 (fw-3) [--ddd-font-weight-bold]</span>
        </p>
      </div>
      <div
        class="b-xs grid-2-narrow gap-4 py-8 px-4 boxshadow-sm overflow-hidden m-10"
      >
        <p>16</p>
        <h3 class="ddd-font-secondary fs-4xs my-1 mx-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>18</p>
        <h3 class="ddd-font-secondary fs-3xs my-1 mx-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>20</p>
        <h3 class="ddd-font-secondary fs-xxs m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>24</p>
        <h3 class="ddd-font-secondary fs-xs m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>28</p>
        <h3 class="ddd-font-secondary fs-s m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>32</p>
        <h3 class="ddd-font-secondary fs-ms m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>36</p>
        <h3 class="ddd-font-secondary fs-m m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>40</p>
        <h3 class="ddd-font-secondary fs-ml m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>44</p>
        <h3 class="ddd-font-secondary fs-l m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>48</p>
        <h3 class="ddd-font-secondary fs-xl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>56</p>
        <h3 class="ddd-font-secondary fs-xxl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>64</p>
        <h3 class="ddd-font-secondary fs-3xl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>72</p>
        <h3 class="ddd-font-secondary fs-4xl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
      </div>
      <div class="mx-5">
        <p>
          Primary Font:
          <span class="fw-3"
            >Roboto Condensed (ddd-font-nav) [--ddd-font-navigation]</span
          >
        </p>
        <p class="mb-10">
          Weights:
          <span class="fw-0">300 (fw-0) [--ddd-font-weight-light],</span>
          <span class="fw-1">400 (fw-1) [--ddd-font-weight-regular],</span>
          <span class="fw-3">700 (fw-3) [--ddd-font-weight-bold]</span>
        </p>
      </div>
      <div
        class="b-1 grid-2-narrow gap-4 py-8 px-4 boxshadow-sm overflow-hidden m-10"
      >
        <p>16</p>
        <h3 class="ddd-font-navigation fs-4xs my-1 mx-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>18</p>
        <h3 class="ddd-font-navigation fs-3xs my-1 mx-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>20</p>
        <h3 class="ddd-font-navigation fs-xxs m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>24</p>
        <h3 class="ddd-font-navigation fs-xs m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>28</p>
        <h3 class="ddd-font-navigation fs-s m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>32</p>
        <h3 class="ddd-font-navigation fs-ms m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>36</p>
        <h3 class="ddd-font-navigation fs-m m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>40</p>
        <h3 class="ddd-font-navigation fs-ml m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>44</p>
        <h3 class="ddd-font-navigation fs-l m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>48</p>
        <h3 class="ddd-font-navigation fs-xl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>56</p>
        <h3 class="ddd-font-navigation fs-xxl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>64</p>
        <h3 class="ddd-font-navigation fs-3xl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p>72</p>
        <h3 class="ddd-font-navigation fs-4xl m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
      </div>
      <div class="mx-5">
        <h2 class="mt-0 mb-5 pb-5 ">Letter Spacing</h2>
        <h6>CSS Variable is same as class name, with '--ddd-' prefix</h6>
        <table class="my-10">
          <thead>
            <th>Class</th>
            <th>Value</th>
            <th>Example</th>
          </thead>
          <tr>
            <td>ls-16-sm</td>
            <td>0.08px</td>
            <td><span class="ls-16-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-18-sm</td>
            <td>0.09px</td>
            <td><span class="ls-18-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-20-sm</td>
            <td>0.1px</td>
            <td><span class="ls-20-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-24-sm</td>
            <td>0.12px</td>
            <td><span class="ls-24-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-28-sm</td>
            <td>0.14px</td>
            <td><span class="ls-28-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-32-sm</td>
            <td>0.16px</td>
            <td><span class="ls-32-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-36-sm</td>
            <td>0.18px</td>
            <td><span class="ls-36-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-40-sm</td>
            <td>0.2px</td>
            <td><span class="ls-40-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-44-sm</td>
            <td>0.22px</td>
            <td><span class="ls-44-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-48-sm</td>
            <td>0.24px</td>
            <td><span class="ls-48-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-56-sm</td>
            <td>0.28px</td>
            <td><span class="ls-56-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-64-sm</td>
            <td>0.32px</td>
            <td><span class="ls-64-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-72-sm</td>
            <td>0.36px</td>
            <td><span class="ls-72-sm fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-16-lg</td>
            <td>0.24px</td>
            <td><span class="ls-16-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-18-lg</td>
            <td>0.27px</td>
            <td><span class="ls-18-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-20-lg</td>
            <td>0.3px</td>
            <td><span class="ls-20-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-24-lg</td>
            <td>0.36px</td>
            <td><span class="ls-24-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-28-lg</td>
            <td>0.42px</td>
            <td><span class="ls-28-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-32-lg</td>
            <td>0.48px</td>
            <td><span class="ls-32-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-36-lg</td>
            <td>0.54px</td>
            <td><span class="ls-36-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-40-lg</td>
            <td>0.6px</td>
            <td><span class="ls-40-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-44-lg</td>
            <td>0.66px</td>
            <td><span class="ls-44-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-48-lg</td>
            <td>0.72px</td>
            <td><span class="ls-48-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-56-lg</td>
            <td>0.84px</td>
            <td><span class="ls-56-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-64-lg</td>
            <td>0.96px</td>
            <td><span class="ls-64-lg fw-1">DDD-FLEX</span></td>
          </tr>
          <tr>
            <td>ls-72-lg</td>
            <td>1.08px</td>
            <td><span class="ls-72-lg fw-1">DDD-FLEX</span></td>
          </tr>
        </table>
        <h2 class="fs-s mt-4 mb-5 pb-5 ">Line Height</h2>
        <div class="grid-4 gap-4">
          <div>
            <p class="lh-120 p-5 b-xs bs-sm mb-10">
              So, I came across your post because I was facing the same issue,
              but I've found a solution.
            </p>
            <p class="text-center">Class: <span class="fw-3">lh-120</span></p>
            <p class="text-center">
              CSS Variable: <span class="fw-3">--ddd-lh-120</span>
            </p>
          </div>
          <div>
            <p class="lh-140 p-5 b-xs bs-sm mb-10">
              So, I came across your post because I was facing the same issue,
              but I've found a solution.
            </p>
            <p class="text-center">Class: <span class="fw-3">lh-140</span></p>
            <p class="text-center">
              CSS Variable: <span class="fw-3">--ddd-lh-140</span>
            </p>
          </div>
          <div>
            <p class="lh-150 p-5 b-xs bs-sm mb-10">
              So, I came across your post because I was facing the same issue,
              but I've found a solution.
            </p>
            <p class="text-center">Class: <span class="fw-3">lh-150</span></p>
            <p class="text-center">
              CSS Variable: <span class="fw-3">--ddd-lh-150</span>
            </p>
          </div>
          <div>
            <p class="lh-auto p-5 b-xs bs-sm mb-10">
              So, I came across your post because I was facing the same issue,
              but I've found a solution.
            </p>
            <p class="text-center">Class: <span class="fw-3">lh-auto</span></p>
            <p class="text-center">
              CSS Variable: <span class="fw-3">N/A</span>
            </p>
          </div>
        </div>
      </div>
    `;
  }

  renderRichText() {
    return html`
      <h2 class="fs-s mt-0 mb-5 pb-5 bb-sm">
        Rich text formatting and other data displays
      </h2>
      <div class="b-xs py-8 px-4 my-10 mx-30">
        <h1>h1 Heading</h1>
        <h2>h2 Heading</h2>
        <h3>h3 Heading</h3>
        <h4>h4 Heading</h4>
        <h5>h5 Heading</h5>
        <h6>h6 Heading</h6>
        <p>
          Body text - It is a long established fact that a reader will be
          distracted by the readable content of a page when looking at its
          layout. The point of using Lorem Ipsum is that it has a more-or-less
          normal distribution of leteters, as opposed to using 'Content here,
          content here', making it look like readable English.
        </p>
        <p class="my-2"><a>HyperLink</a></p>
        <p class="my-2"><b>Bold Text</b></p>
        <p class="my-2"><i>Italic Text</i></p>
        <u>Underlined Text</u>
        <p>Unordered List</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
        <p>Ordered List</p>
        <ol>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ol>
        <blockquote>
          The Pennsylvania State University is a multi-campus, land-grant,
          public research university that educates students from around the
          world and supports individuals and communities through integrated
          programs of teaching, research, and service.
        </blockquote>
        <h2 class="hr-horz">Sample Text</h2>
        <h2 class="hr-vert">Sample Text</h2>
        <ul class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#">Departments</a></li>
          <li><a href="#">Electrical Engineering</a></li>
        </ul>
        <details class="my-5">
          <summary>U.S. News & World Report</summary>
          <p>Details text</p>
        </details>
        <p>
          This is an example of code:<code>Console.log("Hello World!");</code>
          in a paragraph
        </p>
        <textarea></textarea>
        <code class="block-code">
          Here is an example of a block of code on it's own, using class
          'block-code', redundant, but avoids common 'block' class name
        </code>
        <pre>
    Here is an    example of a    block using the    'pre'    tag on it's    own</pre
        >
        <p>Here is a good example of some <mark>Highlighted Text</mark></p>
        <p>
          Here is an example of an abbreviation:
          <abbr title="Pennsylvania State University">Penn State</abbr>
        </p>
        <ul class="ddd-link-list">
          <li><a href="#">All Degrees</a></li>
          <li>
            <a href="#">NEW: Interdisciplinary Science and Business Degree</a>
          </li>
          <li><a href="#">NEW: Polymer Engineering and Science Degree</a></li>
          <li><a href="#">NEW: Digital Media Arts and Technology</a></li>
        </ul>
      </div>
    `;
  }

  renderButtons() {
    let headers = [];
    for (let i = 0; i < 22; i++) {
      let random = Math.floor(Math.random() * 14);
      headers.push(html`
        <div class="grid-3 ">
          <simple-cta data-primary="${i}">Primary-${i}</simple-cta>
          <simple-cta data-primary="${i}" light>Primary-${i} Light</simple-cta>
          <simple-cta data-primary="${i}" Hotline
            >Primary-${i} Hotline</simple-cta
          >
          <simple-cta data-primary="${i}" large>Primary-${i} large</simple-cta>
          <simple-cta data-primary="${i}" hide-icon
            >Primary-${i} hide-icon</simple-cta
          >
          <simple-cta data-primary="${i}" saturate
            >Primary-${i} saturate</simple-cta
          >
        </div>
      `);
    }
    headers.push(html`
      <div
        style="display: inline-flex; width: fit-content; align-items: center;"
      >
        <simple-cta>Default</simple-cta>
        <simple-cta light>Default Light</simple-cta>
        <simple-cta Hotline>Default Hotline</simple-cta>
        <simple-cta large>Default large</simple-cta>
        <simple-cta hide-icon>Default hide-icon</simple-cta>
        <simple-cta light saturate>Default saturate</simple-cta>
      </div>
      <h3>Buttons also support data-accent!</h3>
      <div
        style="display: inline-flex; width: fit-content; align-items: center;"
      >
        <simple-cta data-primary="11" data-accent="7" light
          >Accent-7</simple-cta
        >
        <simple-cta data-primary="1" data-accent="9" light>Accent-9</simple-cta>
        <simple-cta data-primary="1" data-accent="14" light
          >Accent-14</simple-cta
        >
        <simple-cta data-primary="19" data-accent="10" light
          >Accent-10</simple-cta
        >
        <simple-cta data-primary="19" data-accent="13" light
          >Accent-13</simple-cta
        >
      </div>
      <h5>
        Note: Accent color will not be applied if the primary color does not
        meet constrast requirements
      </h5>
      <div
        style="display: inline-flex; width: fit-content; align-items: center; margin-bottom: 64px;"
      >
        <simple-cta data-primary="15" data-accent="10" light
          >Accent-10</simple-cta
        >
        <simple-cta data-primary="8" data-accent="7" light>Accent-7</simple-cta>
        <simple-cta data-primary="11" data-accent="11" light
          >Accent-11</simple-cta
        >
      </div>
    `);
    return headers;
  }

  renderPageSections() {
    return html`
      <div class="b-xs">
        <page-section
          large
          full
          filter
          bg="blue"
          fold
          scroller
          image="http://staging-static.vmhost.psu.edu/components/img/homepage-hero/homepage-hero-test-0.jpg"
        >
          <h1>We'll meet you where you are.</h1>
          <hr />
          <p>
            We're ready for you, future Nittany Lions! From virtual tours,
            online orientation experiences to connecting with current students,
            staff, and faculty in real time.
          </p>
        </page-section>
        <page-section
          large
          id="section-1"
          full=""
          class="section top"
          filter=""
          accent-color="blue"
          fold
          scroller=""
          scroller-label="Let's learn about HAX"
          image="https://hax.psu.edu/assets/images/splash.jpg"
        >
          <h1>
            Create
            <future-terminal-text
              white=""
              glitch=""
              class="create"
              accent-color="green"
              >ANYTHING</future-terminal-text
            >
            easily with
            <future-terminal-text glitch="" class="hax" accent-color="green"
              >HAX</future-terminal-text
            >
          </h1>
          <p slot="entice">Part of <strong>Penn State</strong>?</p>
          <simple-cta
            hotline
            filled
            outlined
            slot="buttons"
            link="https://haxtheweb.org/"
            >Log in</simple-cta
          >
          <simple-cta
            hide-icon
            filled
            white
            slot="buttons"
            link="https://haxtheweb.org/"
            >Learn HAX</simple-cta
          >
        </page-section>
        <page-section
          fold
          id="section-2"
          class="section"
          scroller=""
          scroller-label="By the numbers"
          accent-color="blue"
        >
          <h2>What is HAX?</h2>
          <hr />
          <p>
            <strong
              >A radically simple approach to <em>web authoring</em> and
              <em>content ownership</em>.</strong
            >
          </p>
          <p>
            HAX is built on the premise that any and everyone should be able to
            create rich, engaging content without the need for complex
            platforms, installations or vendor lock-in. The HAX block system
            allows for sustainable content creation that is easy to click and
            build for novices while outputting clean, semantic HTML for experts.
          </p>
        </page-section>
        <page-section preset="lines" scroller>
          <h1>This is University Text</h1>
          <hr />
          <p>
            There's a reason University consistently ranks among the top one
            percent of the world's universities. Across University campuses, our
            University students and University faculty and staff know the real
            measure of success goes beyond the classroom—it's the positive
            impact made on communities across the world.
          </p>
        </page-section>
        <page-section preset="antihero" scroller>
          <h1>This is University Text</h1>
          <hr />
          <p>
            There’s a reason University consistently ranks among the top one
            percent of the world’s universities. Across University campuses, our
            University students and University faculty and staff know the real
            measure of success goes beyond the classroom—it’s the positive
            impact made on communities across the world.
          </p>
        </page-section>
        <page-section
          preset="antihero-light"
          id="section-6"
          class="section"
          fold=""
          accent-color="blue"
        >
          <grid-plate layout="1-1">
            <div slot="col-1">
              <h3>About</h3>
              <p>
                HAX is a service provided through a collaboration between Penn
                State College of Arts and Architecture, Eberly College of
                Science, College of Information Sciences and Technology, and
                University libraries. The platform is powered by HAXcms,
                originally developed to power 100s of high scale online courses.
                Interested in collabora ting? Contact
                <a href="mailto:bmr1@psu.edu">Bill Rose, Product Owner</a>.
              </p>
            </div>
            <div slot="col-2">
              <h3>Privacy policy</h3>
              <p>
                Penn State IT does not monitor websites and does not assume
                responsibility for any published content. The content authors
                are responsible for the content of their websites. Use of this
                service is governed by
                <a
                  href="https://security.psu.edu/awareness/psu-policies/"
                  target="_blank"
                  rel="nofollow noopener"
                  >Penn State policies and guidelines</a
                >, including
                <a
                  href="https://policy.psu.edu/policies/ad54"
                  target="_blank"
                  rel="nofollow noopener"
                  >Penn State IT Web Services Policy</a
                >. All pages must be compliant with
                <a
                  href="https://policies.psu.edu/policies/ad69"
                  target="_blank"
                  rel="noopener"
                  >Accessibility Standards, Policy AD69</a
                >.
              </p>
            </div>
          </grid-plate>
        </page-section>
        <page-section id="section-7" class="section" accent-color="blue">
          <h3>Frequently Asked Questions</h3>
          <hr />
          <details>
            <summary>Who can use HAX?</summary>
            <p>
              Anyone, anywhere! Thanks to HAX being open source, all you need is
              a web server and a domain name to get s tarted. We also support
              publishing directly to GitHub pages and other static publishing
              tools for advanced developer use-cases. If you are part of Penn
              State though you can just click
              <a href="https://iam.hax.psu.edu/login.php">log in</a> t
            </p>
          </details>
        </page-section>
        <page-section full preset="video">
          <video-player
            source="https://www.youtube.com/watch?v=BlLoHvqiIzg"
            media-title="A walk through time"
          ></video-player>
        </page-section>
      </div>
    `;
  }

  renderInstructionalComponents() {
    return html`
      <div class="b-xs">
        <div class="m-10">
          <h3>figure-label</h3>
          <figure-label
            accent-color="red"
            title="1.3"
            description="Default color styling (accent color enabled)"
          ></figure-label>
          <div style="--ddd-theme-accent: var(--ddd-theme-default-pughBlue);">
            <figure-label
              title="1.3"
              description="Application override color set"
            ></figure-label>
            <!-- application override -->
            <div
              style="--ddd-component-figure-label-title: var(--ddd-theme-default-link80); --ddd-component-figure-label-background: var(--ddd-theme-default-infoLight);"
            >
              <figure-label
                title="1.3"
                description="Component override color set"
              ></figure-label>
            </div>
          </div>
        </div>
        <div class="m-10">
          <h3>stop-note</h3>
          <stop-note
            title="Error Message"
            url="https://www.google.com"
            status="stop"
          >
            <span slot="message"
              >You can write any error message you want here.</span
            >
          </stop-note>
          <stop-note title="Warning Message" status="warning">
            <span slot="message"
              >You can write any warning message you want here.</span
            >
          </stop-note>
          <stop-note
            title="Confirmation Message"
            url="https://www.google.com"
            status="success"
          >
            <span slot="message"
              >You can write any confirmation message you want here.</span
            >
          </stop-note>
          <stop-note title="Read the Textbook" status="info">
            <span slot="message"
              >You can write anything you want here (chapters, pages,
              etc.).</span
            >
          </stop-note>
        </div>
        <div class="m-10">
          <h3>learning-component</h3>
          <learning-component
            subtitle="Step 2: Interview Potential Customers"
            url="https://www.google.com/"
            accent-color="blue"
            title="Learning Objectives"
            icon="courseicons:learning-objectives"
          >
            <p>This step includes three parts:</p>
            <ul>
              <li>
                <a href="/step2-part1">Part 1: Figure Out What To Ask</a>
              </li>
              <li>
                <a href="/step2-part2">Part 2: Find People To Interview</a>
              </li>
              <li>
                <a href="/step2-part3">Part 3: Conduct Customer Interviews</a>
              </li>
            </ul>
            <p>
              In Step 2, you will be interviewing potential customers to find
              out if your assumptions are correct or where they fall short. This
              process helps you make sure that you are building something that
              solves a real problem for real customers.
            </p>
          </learning-component>
        </div>
        <div class="m-10">
          <h3>block-quote</h3>
          <block-quote
            citation="Dog"
            image="https://www.vidavetcare.com/wp-content/uploads/sites/234/2022/04/golden-retriever-dog-breed-info.jpeg"
          >
            <span slot="quote">
              I was sitting in a chair in the patent office at Bern, when all of
              a sudden a thought occurred to me: 'If a person falls freely, he
              will not feel his own weight.
            </span>
          </block-quote>
          <div style="width: 450px;" class="mt-5">
            <block-quote
              citation="Dog"
              image="https://www.vidavetcare.com/wp-content/uploads/sites/234/2022/04/golden-retriever-dog-breed-info.jpeg"
            >
              <span slot="quote">
                I was sitting in a chair in the patent office at Bern, when all
                of a sudden a thought occurred to me: 'If a person falls freely,
                he will not feel his own weight.
              </span>
            </block-quote>
          </div>
        </div>
        <div class="m-10">
          <h3>self-check</h3>
          <self-check
            accent-color="light-blue"
            title="Sharks Self Check"
            image="https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg"
            alt="Great White Shark"
          >
            <span slot="question"
              >How large can the average great white shark grow to be?</span
            >
            The Great White shark can grow to be 15 ft to more than 20 ft in
            length and weigh 2.5 tons or more.
          </self-check>
        </div>
        <div class="m-10">
          <h3>media-image</h3>
          <media-image
            source="http://unsplash.it/600"
            figure-label-title="1.3"
            figure-label-description="This is the description of the figure."
          >
            <div slot="citation">This is my citation.</div>
            <div slot="caption">
              Curabitur aliquet quam id dui posuere blandit. Praesent sapien
              massa, convallis a pellentesque nec, egestas non nisi. Vestibulum
              ante ipsum primis in faucibus orci luctus et ultrices posuere
              cubilia Curae; Donec velit neque, auctor sit amet aliquam vel,
              ullamcorper sit amet ligula. Cras ultricies ligula sed magna
              dictum porta. Proin eget tortor risus. Praesent sapien massa,
              convallis a pellentesque nec, egestas non nisi. Donec sollicitudin
              molestie malesuada. Mauris blandit aliquet elit, eget tincidunt
              nibh pulvinar a. Vestibulum ac diam sit amet quam vehicula
              elementum sed sit amet dui. Vivamus suscipit tortor eget felis
              porttitor volutpat.
            </div>
          </media-image>
        </div>
        <div class="m-10">
          <h3>accent-card</h3>
          <accent-card
            dark
            link="https://google.com"
            accent-color="orange"
            image-src="https://dogtime.com/wp-content/uploads/sites/12/2023/08/GettyImages-463043655-1.jpg?resize=1200,630"
          >
            <h3 slot="heading">Default Orientation</h3>
            <div slot="content">This card has the default orientation.</div>
            <div slot="footer">Read More...</div>
          </accent-card>
          <accent-card
            accent-background
            horizontal
            accent-color="red"
            link="https://google.com"
            image-width=""
            image-src="https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg"
          >
            <h5 slot="heading">Default Orientation</h5>
            <div slot="content">This card has the default orientation.</div>
            <div slot="footer">Read More...</div>
          </accent-card>
        </div>
      </div>
    `;
  }

  selectOption() {
    return html`
      <h1 class="fs-m my-2">Select an option to render</h1>
      <select
        class="mb-5"
        @change="${(e) => {
          this.option = e.target.value;
          this.shadowRoot.querySelector("select").value = this.option;
        }}"
      >
        <option value="*">Full styleguide</option>
        ${this.options.map(
          (option) => html`<option value="${option}">${option}</option>`,
        )}
      </select>
    `;
  }

  /**
   * LitElement render callback
   */
  render() {
    if (this.options.includes(this.option)) {
      const renderMethod = this[`render${this.option}`];
      if (typeof renderMethod === "function") {
        return html` ${this.selectOption()} ${renderMethod.call(this)} `;
      } else {
        console.error(`Render method for option "${this.option}" not found.`);
      }
    } else {
      return html`
        ${this.selectOption()}
        ${this.options.map((option) => {
          const renderMethod = this[`render${option}`];
          if (typeof renderMethod === "function") {
            return html`<details style="max-width: 100%;" class="${option}">
              <summary>${option}</summary>
              ${renderMethod.call(this)}
            </details>`;
          } else {
            console.error(`Render method for option "${option}" not found.`);
            return html``; // Return empty template if method not found
          }
        })}
      `;
    }
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
