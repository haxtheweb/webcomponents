/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `vhs-blog-console`
 * A walnut console TV cabinet: the "vcr" slot sits on top of the cabinet,
 * the default slot is the screen, with a control panel and drawers around
 * it. Purely a frame; it holds no state and every part is decorative.
 *
 * @element vhs-blog-console
 */
export class VhsBlogConsole extends LitElement {
  static get tag() {
    return "vhs-blog-console";
  }

  static get properties() {
    return {
      plate: { type: String },
      channel: { type: String },
    };
  }

  constructor() {
    super();
    this.plate = "HAXTRON";
    this.channel = "03";
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          color-scheme: only dark;
        }
        .top-shelf {
          width: min(600px, 100%);
          margin: 0 0 0 48px;
        }
        .cab {
          position: relative;
          border-radius: 8px 8px 4px 4px;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.08) 0 2px,
              transparent 2px 7px,
              rgba(255, 255, 255, 0.03) 7px 8px,
              transparent 8px 15px
            ),
            linear-gradient(180deg, #6a3519, #4a220f);
          box-shadow: 0 30px 40px rgba(0, 0, 0, 0.6);
        }
        .top {
          height: 18px;
          border-radius: 8px 8px 0 0;
          background: linear-gradient(180deg, #8a4a26, #5c2c13);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.4);
        }
        .body {
          display: flex;
          gap: 18px;
          padding: 20px 20px 16px;
        }
        .tvbox {
          flex: 1;
          min-width: 0;
          padding: 16px;
          border-radius: 14px;
          background: #1c0e07;
          box-shadow:
            inset 0 0 0 3px #2c160a,
            inset 0 8px 16px rgba(0, 0, 0, 0.7);
        }
        .ctrl {
          flex: 0 0 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 12px 10px;
          border-radius: 8px;
          background: linear-gradient(180deg, #5a2c14, #3f1d0c);
          box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.35);
        }
        .plate {
          font-family: "Archivo Black", sans-serif;
          font-size: 13px;
          letter-spacing: 0.12em;
          color: #e9d9b0;
          background: #2a1408;
          padding: 4px 8px;
          border-radius: 2px;
        }
        .chan {
          font-family: "VT323", monospace;
          font-size: 30px;
          color: #ffb347;
          background: #120803;
          border-radius: 4px;
          padding: 0 10px;
        }
        .knob {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #d9c79a, #7a6438 70%);
          box-shadow: 0 3px 0 #1a0d05;
          position: relative;
        }
        .knob::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 6px;
          width: 4px;
          height: 16px;
          margin-left: -2px;
          background: #2a1408;
          border-radius: 2px;
          transform-origin: 50% 21px;
          transform: rotate(35deg);
        }
        .grille {
          width: 100%;
          flex: 1;
          min-height: 90px;
          border-radius: 6px;
          background: repeating-linear-gradient(
            0deg,
            #2a1408 0 3px,
            #4a250f 3px 6px
          );
        }
        .drawers {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          padding: 0 20px 20px;
        }
        .drawer {
          height: 84px;
          border-radius: 4px;
          background: linear-gradient(180deg, #5c2c13, #47210e);
          box-shadow:
            inset 0 0 0 2px rgba(0, 0, 0, 0.3),
            inset 0 0 0 8px rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pull {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 4px solid #c9a34a;
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
          position: relative;
          top: 6px;
        }
        .pull::before {
          content: "";
          position: absolute;
          left: 50%;
          top: -12px;
          width: 14px;
          height: 8px;
          margin-left: -7px;
          background: #c9a34a;
          border-radius: 2px;
        }
        @media (max-width: 760px) {
          .ctrl,
          .drawers {
            display: none;
          }
          .top-shelf {
            margin-left: 0;
          }
          .body {
            padding: 12px;
          }
          .tvbox {
            padding: 10px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="top-shelf"><slot name="vcr"></slot></div>
      <div class="cab" part="cabinet">
        <div class="top"></div>
        <div class="body">
          <div class="tvbox"><slot></slot></div>
          <div class="ctrl" aria-hidden="true">
            <span class="plate">${this.plate}</span>
            <span class="chan">${this.channel}</span>
            <span class="knob"></span>
            <span class="knob"></span>
            <span class="grille"></span>
          </div>
        </div>
        <div class="drawers" aria-hidden="true">
          <span class="drawer"><span class="pull"></span></span>
          <span class="drawer"><span class="pull"></span></span>
          <span class="drawer"><span class="pull"></span></span>
        </div>
      </div>
    `;
  }
}
globalThis.customElements.define(VhsBlogConsole.tag, VhsBlogConsole);
