/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full details.
 */
import { LitElement, css } from "lit";
import { SimpleColorsSuper } from "@lrnwebcomponents/simple-colors/simple-colors.js";

/**
 * `d-d-d`
 * `design, develop, destroy the competition`
 * @demo demo/index.html
 */
export const styleGuideTopics = {
  Headers: "Headers",
  FW: "FW",
  FS: "FS",
  BS: "BS",
  Breakpoints: "Breakpoints",
  MP: "MP",
  PolarisColors: "PolarisColors",
  PolarisFunctionalColors: "PolarisFunctionalColors",
};

//export const styleGuideHeaders = {css``}

class DDD extends SimpleColorsSuper(LitElement) {
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
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      //styleGuideHeaders,
      css`
        :host {
          /* base polaris colors */
          --ddd-theme-polaris-beaverBlue: #1e407c;
          --ddd-theme-polaris-beaver70: rgba(30, 64, 124, 0.7);
          --ddd-theme-polaris-beaver80: rgba(30, 64, 124, 0.8);
          --ddd-theme-polaris-landgrantBrown: #6a3028;
          --ddd-theme-polaris-nittanyNavy: #001e44;
          --ddd-theme-polaris-navy40: rgba(0, 30, 68, 0.4);
          --ddd-theme-polaris-navy60: rgba(0, 30, 68, 0.60);
          --ddd-theme-polaris-navy65: rgba(0, 30, 68, 0.65);
          --ddd-theme-polaris-navy70: rgba(0, 30, 68, 0.70);
          --ddd-theme-polaris-navy80: rgba(0, 30, 68, 0.8);
          --ddd-theme-polaris-potentialMidnight: #000321;
          --ddd-theme-polaris-potential0: rgba(0, 3, 33, 0);
          --ddd-theme-polaris-potential50: rgba(0, 3, 33, 0.5);
          --ddd-theme-polaris-potential70: rgba(0, 3, 33, 0.7);
          --ddd-theme-polaris-potential75: rgba(0, 3, 33, 0.75);
          --ddd-theme-polaris-pughBlue: #96bee6;
          --ddd-theme-polaris-coalyGray: #262626;
          --ddd-theme-polaris-keystoneYellow: #ffd100;
          --ddd-theme-polaris-slateGray: #314d64;
          --ddd-theme-polaris-slateLight: #ccdae6;
          --ddd-theme-polaris-slateMaxLight: #eef3f7;
          --ddd-theme-polaris-skyBlue: #009cde;
          --ddd-theme-polaris-skyLight: #ccf0ff;
          --ddd-theme-polaris-skyMaxlight: #e6f7ff;
          --ddd-theme-polaris-limestoneGray: #a2aaad;
          --ddd-theme-polaris-limestoneLight: #e4e5e7;
          --ddd-theme-polaris-limestoneMaxLight: #f2f2f4;
          --ddd-theme-polaris-white: #ffffff;
          --ddd-theme-polaris-shrineLight: #f7f2ee;
          --ddd-theme-polaris-shrineMaxLight: #fdfbf5;
          --ddd-theme-polaris-creekTeal: #3ea39e;
          --ddd-theme-polaris-creekLight: #cfeceb;
          --ddd-theme-polaris-creekMaxLight: #edf8f7;
          --ddd-theme-polaris-shrineTan: #b88965;
          --ddd-theme-polaris-roarGolden: #bf8226;
          --ddd-theme-polaris-roarLight: #f9eddc;
          --ddd-theme-polaris-roarMaxlight: #fffaf2;
          --ddd-theme-polaris-forestGreen: #4a7729;
          --ddd-theme-polaris-athertonViolet: #ac8dce;
          --ddd-theme-polaris-original87Pink: #bc204b;
          --ddd-theme-polaris-discoveryCoral: #f2665e;
          --ddd-theme-polaris-futureLime: #99cc00;
          --ddd-theme-polaris-wonderPurple: #491d70;
          --ddd-theme-polaris-inventOrange: #e98300;
          --ddd-theme-polaris-opportunityGreen: #008755;
          --ddd-theme-polaris-accent: #96bee6;



          /* 
            base colors, cannot be modified by user; SimpleColors hijacks this
            
            Theme level color, components pick up hues of theme color
            
            User can override these colors with their own theme colors
            */

          /* functional colors */
          --ddd-theme-polaris-link: #005fa9;
          --ddd-theme-polaris-link80: rgba(0, 95, 169, 0.8);
          --ddd-theme-polaris-linkLight: #cce9ff;
          --ddd-theme-polaris-disabled: #f4f4f4;
          --ddd-theme-polaris-error: #5f2120;
          --ddd-theme-polaris-errorLight: #fdeded;
          --ddd-theme-polaris-warning: #663c00;
          --ddd-theme-polaris-warningLight: #fff4e5;
          --ddd-theme-polaris-info: #014361;
          --ddd-theme-polaris-infoLight: #e5f6fd;
          --ddd-theme-polaris-success: #1e4620;
          --ddd-theme-polaris-successLight: #edf7ed;
          --ddd-theme-polaris-alertImmediate: #f8d3de;
          --ddd-theme-polaris-alertUrgent: #fff6cc;
          --ddd-theme-polaris-alertAllClear: #f2ffcc;
          --ddd-theme-polaris-alertNonEmergency: #e6f7ff;

          /* simplecolors needs to be included ->  */

          /*fonts*/
          --ddd-font-primary: "Roboto", "Franklin Gothic Medium", Tahoma, sans-serif;
          --ddd-font-primary-regular: 400; /* default weight for body */
          --ddd-font-primary-medium: 500;
          --ddd-font-primary-bold: 700; /* default weight for headers */
          --ddd-font-primary-black: 900;

          --ddd-font-secondary: "Roboto Slab", serif;
          --ddd-font-secondary-bold: 700;

          --ddd-font-navigation: "Roboto Condensed", sans-serif; /* navigation font */
          --ddd-font-navigation-light: 300;
          --ddd-font-navigation-bold: 700;

          /* font sizes */
          --ddd-font-size-4xs: 16px;
          --ddd-font-size-3xs: 18px; /* body default */
          --ddd-font-size-xxs: 20px;
          --ddd-font-size-xs: 22px;
          --ddd-font-size-s: 24px; /* h6 */
          --ddd-font-size-ms: 28px; /* h5 */
          --ddd-font-size-m: 32px; /* h4 */
          --ddd-font-size-ml: 36px; /* h3 */
          --ddd-font-size-l: 40px; /* h2 */
          --ddd-font-size-xl: 48px; /* h1 */
          --ddd-font-size-xxl: 56px;
          --ddd-font-size-3xl: 64px;
          --ddd-font-size-4xl: 72px;

          /* spacing */
          --ddd-spacing-0: 0px;
          --ddd-spacing-1: 4px; /*  body default */
          --ddd-spacing-2: 8px;
          --ddd-spacing-3: 12px; /* h6 */
          --ddd-spacing-4: 16px; /* h5 */
          --ddd-spacing-5: 20px; /* h4 */
          --ddd-spacing-6: 24px; /* h3 */
          --ddd-spacing-7: 28px; /* h2 */
          --ddd-spacing-8: 32px; /* h1 */
          --ddd-spacing-9: 36px;
          --ddd-spacing-10: 40px;
          --ddd-spacing-11: 44px;
          --ddd-spacing-12: 48px;
          --ddd-spacing-13: 52px;
          --ddd-spacing-14: 56px;
          --ddd-spacing-15: 60px;
          --ddd-spacing-16: 64px;
          --ddd-spacing-17: 68px;
          --ddd-spacing-18: 72px;
          --ddd-spacing-19: 76px;
          --ddd-spacing-20: 80px;
          --ddd-spacing-21: 84px;
          --ddd-spacing-22: 88px;
          --ddd-spacing-23: 92px;
          --ddd-spacing-24: 96px;
          --ddd-spacing-25: 100px;
          --ddd-spacing-26: 104px;
          --ddd-spacing-27: 108px;
          --ddd-spacing-28: 112px;
          --ddd-spacing-29: 116px;
          --ddd-spacing-30: 120px;

          /* borders */
          --ddd-border-size-0: 0px;
          --ddd-border-size-1: 1px;
          --ddd-border-size-2: 2px;
          --ddd-border-size-3: 3px;
          --ddd-border-size-4: 4px;

          /* shadows */
          --ddd-shadow-0: 0px 0px 0px 0px rgba(0, 0, 0, 0);
          --ddd-shadow-1: rgba(0, 3, 33, 0.063) 0px 4px 8px 0px;
          --ddd-shadow-2: rgba(0, 3, 33, 0.063) 0px 8px 16px 0px;
          --ddd-shadow-3: rgba(0, 3, 33, 0.063) 0px 12px 24px 0px;
          --ddd-shadow-4: rgba(0, 3, 33, 0.063) 0px 16px 32px 0px;

          /* breakpoints */
          --ddd-breakpoint-sm: 360px;
          --ddd-breakpoint-md: 768px;
          --ddd-breakpoint-lg: 1080px;
          --ddd-breakpoint-xl: 1440px;

          /* Radius */
          --ddd-radius-0: 0px;
          --ddd-radius-xs: 4px;
          --ddd-radius-sm: 8px;
          --ddd-radius-md: 12px;
          --ddd-radius-lg: 16px;
          --ddd-radius-xl: 20px;
          --ddd-radius-rounded: 100px;
          --ddd-radius-circle: 100%;

        }
        /* border & shadows */
        .b-0 {
          border: none;
        }
        .b-1 {
          border: 1px solid var(--ddd-polaris-beaverBlue);
        }
        .b-2 {
          border: 2px solid var(--ddd-polaris-beaverBlue);
        }
        .b-3 {
          border: 3px solid var(--ddd-polaris-beaverBlue);
        }
        .b-4 {
          border: 4px solid var(--ddd-polaris-beaverBlue);
        }
        .bt-0 {
          border-top: none;
        }
        .bt-1 {
          border-top: 1px solid var(--ddd-polaris-beaverBlue);
        }
        .bt-2 {
          border-top: 2px solid var(--ddd-polaris-beaverBlue);
        }
        .bt-3 {
          border-top: 3px solid var(--ddd-polaris-beaverBlue);
        }
        .bt-4 {
          border-top: 4px solid var(--ddd-polaris-beaverBlue);
        }
        .br-0 {
          border-right: none;
        }
        .br-1 {
          border-right: 1px solid var(--ddd-polaris-beaverBlue);
        }
        .br-2 {
          border-right: 2px solid var(--ddd-polaris-beaverBlue);
        }
        .br-3 {
          border-right: 3px solid var(--ddd-polaris-beaverBlue);
        }
        .br-4 {
          border-right: 4px solid var(--ddd-polaris-beaverBlue);
        }
        .bb-0 {
          border-bottom: none;
        }
        .bb-1 {
          border-bottom: 1px solid var(--ddd-polaris-beaverBlue);
        }
        .bb-2 {
          border-bottom: 2px solid var(--ddd-polaris-beaverBlue);
        }
        .bb-3 {
          border-bottom: 3px solid var(--ddd-polaris-beaverBlue);
        }
        .bb-4 {
          border-bottom: 4px solid var(--ddd-polaris-beaverBlue);
        }
        .bl-0 {
          border-left: none;
        }
        .bl-1 {
          border-left: 1px solid var(--ddd-polaris-beaverBlue);
        }
        .bl-2 {
          border-left: 2px solid var(--ddd-polaris-beaverBlue);
        }
        .bl-3 {
          border-left: 3px solid var(--ddd-polaris-beaverBlue);
        }
        .bl-4 {
          border-left: 4px solid var(--ddd-polaris-beaverBlue);
        }
        
        /* margin & padding */
        .m-auto {
          margin: auto;
        }
        .m-0 {
          margin: var(--ddd-spacing-0);
        }
        .m-1 {
          margin: var(--ddd-spacing-1);
        }
        .m-2 {
          margin: var(--ddd-spacing-2);
        }
        .m-3 {
          margin: var(--ddd-spacing-3);
        }
        .m-4 {
          margin: var(--ddd-spacing-4);
        }
        .m-5 {
          margin: var(--ddd-spacing-5);
        }
        .m-6 {
          margin: var(--ddd-spacing-6);
        }
        .m-7 {
          margin: var(--ddd-spacing-7);
        }
        .m-8 {
          margin: var(--ddd-spacing-8);
        }
        .m-9 {
          margin: var(--ddd-spacing-9);
        }
        .m-10 {
          margin: var(--ddd-spacing-10);
        }
        .m-11 {
          margin: var(--ddd-spacing-11);
        }
        .m-12 {
          margin: var(--ddd-spacing-12);
        }
        .m-13 {
          margin: var(--ddd-spacing-13);
        }
        .m-14 {
          margin: var(--ddd-spacing-14);
        }
        .m-15 {
          margin: var(--ddd-spacing-15);
        }
        .m-16 {
          margin: var(--ddd-spacing-16);
        }
        .m-17 {
          margin: var(--ddd-spacing-17);
        }
        .m-18 {
          margin: var(--ddd-spacing-18);
        }
        .m-19 {
          margin: var(--ddd-spacing-19);
        }
        .m-20 {
          margin: var(--ddd-spacing-20);
        }
        .m-21 {
          margin: var(--ddd-spacing-21);
        }
        .m-22 {
          margin: var(--ddd-spacing-22);
        }
        .m-23 {
          margin: var(--ddd-spacing-23);
        }
        .m-24 {
          margin: var(--ddd-spacing-24);
        }
        .m-25 {
          margin: var(--ddd-spacing-25);
        }
        .m-26 {
          margin: var(--ddd-spacing-26);
        }
        .m-27 {
          margin: var(--ddd-spacing-27);
        }
        .m-28 {
          margin: var(--ddd-spacing-28);
        }
        .m-29 {
          margin: var(--ddd-spacing-29);
        }
        .m-30 {
          margin: var(--ddd-spacing-30);
        }
        .mt-auto {
          margin-top: auto;
        }
        .mt-0 {
          margin-top: var(--ddd-spacing-0);
        }
        .mt-1 {
          margin-top: var(--ddd-spacing-1);
        }
        .mt-2 {
          margin-top: var(--ddd-spacing-2);
        }
        .mt-3 {
          margin-top: var(--ddd-spacing-3);
        }
        .mt-4 {
          margin-top: var(--ddd-spacing-4);
        }
        .mt-5 {
          margin-top: var(--ddd-spacing-5);
        }
        .mt-6 {
          margin-top: var(--ddd-spacing-6);
        }
        .mt-7 {
          margin-top: var(--ddd-spacing-7);
        }
        .mt-8 {
          margin-top: var(--ddd-spacing-8);
        }
        .mt-9 {
          margin-top: var(--ddd-spacing-9);
        }
        .mt-10 {
          margin-top: var(--ddd-spacing-10);
        }
        .mt-11 {
          margin-top: var(--ddd-spacing-11);
        }
        .mt-12 {
          margin-top: var(--ddd-spacing-12);
        }
        .mt-13 {
          margin-top: var(--ddd-spacing-13);
        }
        .mt-14 {
          margin-top: var(--ddd-spacing-14);
        }
        .mt-15 {
          margin-top: var(--ddd-spacing-15);
        }
        .mt-16 {
          margin-top: var(--ddd-spacing-16);
        }
        .mt-17 {
          margin-top: var(--ddd-spacing-17);
        }
        .mt-18 {
          margin-top: var(--ddd-spacing-18);
        }
        .mt-19 {
          margin-top: var(--ddd-spacing-19);
        }
        .mt-20 {
          margin-top: var(--ddd-spacing-20);
        }
        .mt-21 {
          margin-top: var(--ddd-spacing-21);
        }
        .mt-22 {
          margin-top: var(--ddd-spacing-22);
        }
        .mt-23 {
          margin-top: var(--ddd-spacing-23);
        }
        .mt-24 {
          margin-top: var(--ddd-spacing-24);
        }
        .mt-25 {
          margin-top: var(--ddd-spacing-25);
        }
        .mt-26 {
          margin-top: var(--ddd-spacing-26);
        }
        .mt-27 {
          margin-top: var(--ddd-spacing-27);
        }
        .mt-28 {
          margin-top: var(--ddd-spacing-28);
        }
        .mt-29 {
          margin-top: var(--ddd-spacing-29);
        }
        .mt-30 {
          margin-top: var(--ddd-spacing-30);
        }
        .mb-auto {
          margin-bottom: auto;
        }
        .mb-0 {
          margin-bottom: var(--ddd-spacing-0);
        }
        .mb-1 {
          margin-bottom: var(--ddd-spacing-1);
        }
        .mb-2 {
          margin-bottom: var(--ddd-spacing-2);
        }
        .mb-3 {
          margin-bottom: var(--ddd-spacing-3);
        }
        .mb-4 {
          margin-bottom: var(--ddd-spacing-4);
        }
        .mb-5 {
          margin-bottom: var(--ddd-spacing-5);
        }
        .mb-6 {
          margin-bottom: var(--ddd-spacing-6);
        }
        .mb-7 {
          margin-bottom: var(--ddd-spacing-7);
        }
        .mb-8 {
          margin-bottom: var(--ddd-spacing-8);
        }
        .mb-9 {
          margin-bottom: var(--ddd-spacing-9);
        }
        .mb-10 {
          margin-bottom: var(--ddd-spacing-10);
        }
        .mb-11 {
          margin-bottom: var(--ddd-spacing-11);
        }
        .mb-12 {
          margin-bottom: var(--ddd-spacing-12);
        }
        .mb-13 {
          margin-bottom: var(--ddd-spacing-13);
        }
        .mb-14 {
          margin-bottom: var(--ddd-spacing-14);
        }
        .mb-15 {
          margin-bottom: var(--ddd-spacing-15);
        }
        .mb-16 {
          margin-bottom: var(--ddd-spacing-16);
        }
        .mb-17 {
          margin-bottom: var(--ddd-spacing-17);
        }
        .mb-18 {
          margin-bottom: var(--ddd-spacing-18);
        }
        .mb-19 {
          margin-bottom: var(--ddd-spacing-19);
        }
        .mb-20 {
          margin-bottom: var(--ddd-spacing-20);
        }
        .mb-21 {
          margin-bottom: var(--ddd-spacing-21);
        }
        .mb-22 {
          margin-bottom: var(--ddd-spacing-22);
        }
        .mb-23 {
          margin-bottom: var(--ddd-spacing-23);
        }
        .mb-24 {
          margin-bottom: var(--ddd-spacing-24);
        }
        .mb-25 {
          margin-bottom: var(--ddd-spacing-25);
        }
        .mb-26 {
          margin-bottom: var(--ddd-spacing-26);
        }
        .mb-27 {
          margin-bottom: var(--ddd-spacing-27);
        }
        .mb-28 {
          margin-bottom: var(--ddd-spacing-28);
        }
        .mb-29 {
          margin-bottom: var(--ddd-spacing-29);
        }
        .mb-30 {
          margin-bottom: var(--ddd-spacing-30);
        }
        .ml-auto {
          margin-left: auto;
        }
        .ml-0 {
          margin-left: var(--ddd-spacing-0);
        }
        .ml-1 {
          margin-left: var(--ddd-spacing-1);
        }
        .ml-2 {
          margin-left: var(--ddd-spacing-2);
        }
        .ml-3 {
          margin-left: var(--ddd-spacing-3);
        }
        .ml-4 {
          margin-left: var(--ddd-spacing-4);
        }
        .ml-5 {
          margin-left: var(--ddd-spacing-5);
        }
        .ml-6 {
          margin-left: var(--ddd-spacing-6);
        }
        .ml-7 {
          margin-left: var(--ddd-spacing-7);
        }
        .ml-8 {
          margin-left: var(--ddd-spacing-8);
        }
        .ml-9 {
          margin-left: var(--ddd-spacing-9);
        }
        .ml-10 {
          margin-left: var(--ddd-spacing-10);
        }
        .ml-11 {
          margin-left: var(--ddd-spacing-11);
        }
        .ml-12 {
          margin-left: var(--ddd-spacing-12);
        }
        .ml-13 {
          margin-left: var(--ddd-spacing-13);
        }
        .ml-14 {
          margin-left: var(--ddd-spacing-14);
        }
        .ml-15 {
          margin-left: var(--ddd-spacing-15);
        }
        .ml-16 {
          margin-left: var(--ddd-spacing-16);
        }
        .ml-17 {
          margin-left: var(--ddd-spacing-17);
        }
        .ml-18 {
          margin-left: var(--ddd-spacing-18);
        }
        .ml-19 {
          margin-left: var(--ddd-spacing-19);
        }
        .ml-20 {
          margin-left: var(--ddd-spacing-20);
        }
        .ml-21 {
          margin-left: var(--ddd-spacing-21);
        }
        .ml-22 {
          margin-left: var(--ddd-spacing-22);
        }
        .ml-23 {
          margin-left: var(--ddd-spacing-23);
        }
        .ml-24 {
          margin-left: var(--ddd-spacing-24);
        }
        .ml-25 {
          margin-left: var(--ddd-spacing-25);
        }
        .ml-26 {
          margin-left: var(--ddd-spacing-26);
        }
        .ml-27 {
          margin-left: var(--ddd-spacing-27);
        }
        .ml-28 {
          margin-left: var(--ddd-spacing-28);
        }
        .ml-29 {
          margin-left: var(--ddd-spacing-29);
        }
        .ml-30 {
          margin-left: var(--ddd-spacing-30);
        }
        .mr-auto {
          margin-right: auto;
        }
        .mr-0 {
          margin-right: var(--ddd-spacing-0);
        }
        .mr-1 {
          margin-right: var(--ddd-spacing-1);
        }
        .mr-2 {
          margin-right: var(--ddd-spacing-2);
        }
        .mr-3 {
          margin-right: var(--ddd-spacing-3);
        }
        .mr-4 {
          margin-right: var(--ddd-spacing-4);
        }
        .mr-5 {
          margin-right: var(--ddd-spacing-5);
        }
        .mr-6 {
          margin-right: var(--ddd-spacing-6);
        }
        .mr-7 {
          margin-right: var(--ddd-spacing-7);
        }
        .mr-8 {
          margin-right: var(--ddd-spacing-8);
        }
        .mr-9 {
          margin-right: var(--ddd-spacing-9);
        }
        .mr-10 {
          margin-right: var(--ddd-spacing-10);
        }
        .mr-11 {
          margin-right: var(--ddd-spacing-11);
        }
        .mr-12 {
          margin-right: var(--ddd-spacing-12);
        }
        .mr-13 {
          margin-right: var(--ddd-spacing-13);
        }
        .mr-14 {
          margin-right: var(--ddd-spacing-14);
        }
        .mr-15 {
          margin-right: var(--ddd-spacing-15);
        }
        .mr-16 {
          margin-right: var(--ddd-spacing-16);
        }
        .mr-17 {
          margin-right: var(--ddd-spacing-17);
        }
        .mr-18 {
          margin-right: var(--ddd-spacing-18);
        }
        .mr-19 {
          margin-right: var(--ddd-spacing-19);
        }
        .mr-20 {
          margin-right: var(--ddd-spacing-20);
        }
        .mr-21 {
          margin-right: var(--ddd-spacing-21);
        }
        .mr-22 {
          margin-right: var(--ddd-spacing-22);
        }
        .mr-23 {
          margin-right: var(--ddd-spacing-23);
        }
        .mr-24 {
          margin-right: var(--ddd-spacing-24);
        }
        .mr-25 {
          margin-right: var(--ddd-spacing-25);
        }
        .mr-26 {
          margin-right: var(--ddd-spacing-26);
        }
        .mr-27 {
          margin-right: var(--ddd-spacing-27);
        }
        .mr-28 {
          margin-right: var(--ddd-spacing-28);
        }
        .mr-29 {
          margin-right: var(--ddd-spacing-29);
        }
        .mr-30 {
          margin-right: var(--ddd-spacing-30);
        }
        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }
        .mx-0 {
          margin-left: var(--ddd-spacing-0);
          margin-right: var(--ddd-spacing-0);
        }
        .mx-1 {
          margin-left: var(--ddd-spacing-1);
          margin-right: var(--ddd-spacing-1);
        }
        .mx-2 {
          margin-left: var(--ddd-spacing-2);
          margin-right: var(--ddd-spacing-2);
        }
        .mx-3 {
          margin-left: var(--ddd-spacing-3);
          margin-right: var(--ddd-spacing-3);
        }
        .mx-4 {
          margin-left: var(--ddd-spacing-4);
          margin-right: var(--ddd-spacing-4);
        }
        .mx-5 {
          margin-left: var(--ddd-spacing-5);
          margin-right: var(--ddd-spacing-5);
        }
        .mx-6 {
          margin-left: var(--ddd-spacing-6);
          margin-right: var(--ddd-spacing-6);
        }
        .mx-7 {
          margin-left: var(--ddd-spacing-7);
          margin-right: var(--ddd-spacing-7);
        }
        .mx-8 {
          margin-left: var(--ddd-spacing-8);
          margin-right: var(--ddd-spacing-8);
        }
        .mx-9 {
          margin-left: var(--ddd-spacing-9);
          margin-right: var(--ddd-spacing-9);
        }
        .mx-10 {
          margin-left: var(--ddd-spacing-10);
          margin-right: var(--ddd-spacing-10);
        }
        .mx-11 {
          margin-left: var(--ddd-spacing-11);
          margin-right: var(--ddd-spacing-11);
        }
        .mx-12 {
          margin-left: var(--ddd-spacing-12);
          margin-right: var(--ddd-spacing-12);
        }
        .mx-13 {
          margin-left: var(--ddd-spacing-13);
          margin-right: var(--ddd-spacing-13);
        }
        .mx-14 {
          margin-left: var(--ddd-spacing-14);
          margin-right: var(--ddd-spacing-14);
        }
        .mx-15 {
          margin-left: var(--ddd-spacing-15);
          margin-right: var(--ddd-spacing-15);
        }
        .mx-16 {
          margin-left: var(--ddd-spacing-16);
          margin-right: var(--ddd-spacing-16);
        }
        .mx-17 {
          margin-left: var(--ddd-spacing-17);
          margin-right: var(--ddd-spacing-17);
        }
        .mx-18 {
          margin-left: var(--ddd-spacing-18);
          margin-right: var(--ddd-spacing-18);
        }
        .mx-19 {
          margin-left: var(--ddd-spacing-19);
          margin-right: var(--ddd-spacing-19);
        }
        .mx-20 {
          margin-left: var(--ddd-spacing-20);
          margin-right: var(--ddd-spacing-20);
        }
        .mx-21 {
          margin-left: var(--ddd-spacing-21);
          margin-right: var(--ddd-spacing-21);
        }
        .mx-22 {
          margin-left: var(--ddd-spacing-22);
          margin-right: var(--ddd-spacing-22);
        }
        .mx-23 {
          margin-left: var(--ddd-spacing-23);
          margin-right: var(--ddd-spacing-23);
        }
        .mx-24 {
          margin-left: var(--ddd-spacing-24);
          margin-right: var(--ddd-spacing-24);
        }
        .mx-25 {
          margin-left: var(--ddd-spacing-25);
          margin-right: var(--ddd-spacing-25);
        }
        .mx-26 {
          margin-left: var(--ddd-spacing-26);
          margin-right: var(--ddd-spacing-26);
        }
        .mx-27 {
          margin-left: var(--ddd-spacing-27);
          margin-right: var(--ddd-spacing-27);
        }
        .mx-28 {
          margin-left: var(--ddd-spacing-28);
          margin-right: var(--ddd-spacing-28);
        }
        .mx-29 {
          margin-left: var(--ddd-spacing-29);
          margin-right: var(--ddd-spacing-29);
        }
        .mx-30 {
          margin-left: var(--ddd-spacing-30);
          margin-right: var(--ddd-spacing-30);
        }
        .my-auto {
          margin-top: auto;
          margin-bottom: auto;
        }
        .my-0 {
          margin-top: var(--ddd-spacing-0);
          margin-bottom: var(--ddd-spacing-0);
        }
        .my-1 {
          margin-top: var(--ddd-spacing-1);
          margin-bottom: var(--ddd-spacing-1);
        }
        .my-2 {
          margin-top: var(--ddd-spacing-2);
          margin-bottom: var(--ddd-spacing-2);
        }
        .my-3 {
          margin-top: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-3);
        }
        .my-4 {
          margin-top: var(--ddd-spacing-4);
          margin-bottom: var(--ddd-spacing-4);
        }
        .my-5 {
          margin-top: var(--ddd-spacing-5);
          margin-bottom: var(--ddd-spacing-5);
        }
        .my-6 {
          margin-top: var(--ddd-spacing-6);
          margin-bottom: var(--ddd-spacing-6);
        }
        .my-7 {
          margin-top: var(--ddd-spacing-7);
          margin-bottom: var(--ddd-spacing-7);
        }
        .my-8 {
          margin-top: var(--ddd-spacing-8);
          margin-bottom: var(--ddd-spacing-8);
        }
        .my-9 {
          margin-top: var(--ddd-spacing-9);
          margin-bottom: var(--ddd-spacing-9);
        }
        .my-10 {
          margin-top: var(--ddd-spacing-10);
          margin-bottom: var(--ddd-spacing-10);
        }
        .my-11 {
          margin-top: var(--ddd-spacing-11);
          margin-bottom: var(--ddd-spacing-11);
        }
        .my-12 {
          margin-top: var(--ddd-spacing-12);
          margin-bottom: var(--ddd-spacing-12);
        }
        .my-13 {
          margin-top: var(--ddd-spacing-13);
          margin-bottom: var(--ddd-spacing-13);
        }
        .my-14 {
          margin-top: var(--ddd-spacing-14);
          margin-bottom: var(--ddd-spacing-14);
        }
        .my-15 {
          margin-top: var(--ddd-spacing-15);
          margin-bottom: var(--ddd-spacing-15);
        }
        .my-16 {
          margin-top: var(--ddd-spacing-16);
          margin-bottom: var(--ddd-spacing-16);
        }
        .my-17 {
          margin-top: var(--ddd-spacing-17);
          margin-bottom: var(--ddd-spacing-17);
        }
        .my-18 {
          margin-top: var(--ddd-spacing-18);
          margin-bottom: var(--ddd-spacing-18);
        }
        .my-19 {
          margin-top: var(--ddd-spacing-19);
          margin-bottom: var(--ddd-spacing-19);
        }
        .my-20 {
          margin-top: var(--ddd-spacing-20);
          margin-bottom: var(--ddd-spacing-20);
        }
        .my-21 {
          margin-top: var(--ddd-spacing-21);
          margin-bottom: var(--ddd-spacing-21);
        }
        .my-22 {
          margin-top: var(--ddd-spacing-22);
          margin-bottom: var(--ddd-spacing-22);
        }
        .my-23 {
          margin-top: var(--ddd-spacing-23);
          margin-bottom: var(--ddd-spacing-23);
        }
        .my-24 {
          margin-top: var(--ddd-spacing-24);
          margin-bottom: var(--ddd-spacing-24);
        }
        .my-25 {
          margin-top: var(--ddd-spacing-25);
          margin-bottom: var(--ddd-spacing-25);
        }
        .my-26 {
          margin-top: var(--ddd-spacing-26);
          margin-bottom: var(--ddd-spacing-26);
        }
        .my-27 {
          margin-top: var(--ddd-spacing-27);
          margin-bottom: var(--ddd-spacing-27);
        }
        .my-28 {
          margin-top: var(--ddd-spacing-28);
          margin-bottom: var(--ddd-spacing-28);
        }
        .my-29 {
          margin-top: var(--ddd-spacing-29);
          margin-bottom: var(--ddd-spacing-29);
        }
        .my-30 {
          margin-top: var(--ddd-spacing-30);
          margin-bottom: var(--ddd-spacing-30);
        }

        .p-0 {
          padding: var(--ddd-spacing-0);
        }
        .p-1 {
          padding: var(--ddd-spacing-1);
        }
        .p-2 {
          padding: var(--ddd-spacing-2);
        }
        .p-3 {
          padding: var(--ddd-spacing-3);
        }
        .p-4 {
          padding: var(--ddd-spacing-4);
        }
        .p-5 {
          padding: var(--ddd-spacing-5);
        }
        .p-6 {
          padding: var(--ddd-spacing-6);
        }
        .p-7 {
          padding: var(--ddd-spacing-7);
        }
        .p-8 {
          padding: var(--ddd-spacing-8);
        }
        .p-9 {
          padding: var(--ddd-spacing-9);
        }
        .p-10 {
          padding: var(--ddd-spacing-10);
        }
        .p-11 {
          padding: var(--ddd-spacing-11);
        }
        .p-12 {
          padding: var(--ddd-spacing-12);
        }
        .p-13 {
          padding: var(--ddd-spacing-13);
        }
        .p-14 {
          padding: var(--ddd-spacing-14);
        }
        .p-15 {
          padding: var(--ddd-spacing-15);
        }
        .p-16 {
          padding: var(--ddd-spacing-16);
        }
        .p-17 {
          padding: var(--ddd-spacing-17);
        }
        .p-18 {
          padding: var(--ddd-spacing-18);
        }
        .p-19 {
          padding: var(--ddd-spacing-19);
        }
        .p-20 {
          padding: var(--ddd-spacing-20);
        }
        .p-21 {
          padding: var(--ddd-spacing-21);
        }
        .p-22 {
          padding: var(--ddd-spacing-22);
        }
        .p-23 {
          padding: var(--ddd-spacing-23);
        }
        .p-24 {
          padding: var(--ddd-spacing-24);
        }
        .p-25 {
          padding: var(--ddd-spacing-25);
        }
        .p-26 {
          padding: var(--ddd-spacing-26);
        }
        .p-27 {
          padding: var(--ddd-spacing-27);
        }
        .p-28 {
          padding: var(--ddd-spacing-28);
        }
        .p-29 {
          padding: var(--ddd-spacing-29);
        }
        .p-30 {
          padding: var(--ddd-spacing-30);
        }
        .pt-0 {
          padding-top: var(--ddd-spacing-0);
        }
        .pt-1 {
          padding-top: var(--ddd-spacing-1);
        }
        .pt-2 {
          padding-top: var(--ddd-spacing-2);
        }
        .pt-3 {
          padding-top: var(--ddd-spacing-3);
        }
        .pt-4 {
          padding-top: var(--ddd-spacing-4);
        }
        .pt-5 {
          padding-top: var(--ddd-spacing-5);
        }
        .pt-6 {
          padding-top: var(--ddd-spacing-6);
        }
        .pt-7 {
          padding-top: var(--ddd-spacing-7);
        }
        .pt-8 {
          padding-top: var(--ddd-spacing-8);
        }
        .pt-9 {
          padding-top: var(--ddd-spacing-9);
        }
        .pt-10 {
          padding-top: var(--ddd-spacing-10);
        }
        .pt-11 {
          padding-top: var(--ddd-spacing-11);
        }
        .pt-12 {
          padding-top: var(--ddd-spacing-12);
        }
        .pt-13 {
          padding-top: var(--ddd-spacing-13);
        }
        .pt-14 {
          padding-top: var(--ddd-spacing-14);
        }
        .pt-15 {
          padding-top: var(--ddd-spacing-15);
        }
        .pt-16 {
          padding-top: var(--ddd-spacing-16);
        }
        .pt-17 {
          padding-top: var(--ddd-spacing-17);
        }
        .pt-18 {
          padding-top: var(--ddd-spacing-18);
        }
        .pt-19 {
          padding-top: var(--ddd-spacing-19);
        }
        .pt-20 {
          padding-top: var(--ddd-spacing-20);
        }
        .pt-21 {
          padding-top: var(--ddd-spacing-21);
        }
        .pt-22 {
          padding-top: var(--ddd-spacing-22);
        }
        .pt-23 {
          padding-top: var(--ddd-spacing-23);
        }
        .pt-24 {
          padding-top: var(--ddd-spacing-24);
        }
        .pt-25 {
          padding-top: var(--ddd-spacing-25);
        }
        .pt-26 {
          padding-top: var(--ddd-spacing-26);
        }
        .pt-27 {
          padding-top: var(--ddd-spacing-27);
        }
        .pt-28 {
          padding-top: var(--ddd-spacing-28);
        }
        .pt-29 {
          padding-top: var(--ddd-spacing-29);
        }
        .pt-30 {
          padding-top: var(--ddd-spacing-30);
        }
        .pb-0 {
          padding-bottom: var(--ddd-spacing-0);
        }
        .pb-1 {
          padding-bottom: var(--ddd-spacing-1);
        }
        .pb-2 {
          padding-bottom: var(--ddd-spacing-2);
        }
        .pb-3 {
          padding-bottom: var(--ddd-spacing-3);
        }
        .pb-4 {
          padding-bottom: var(--ddd-spacing-4);
        }
        .pb-5 {
          padding-bottom: var(--ddd-spacing-5);
        }
        .pb-6 {
          padding-bottom: var(--ddd-spacing-6);
        }
        .pb-7 {
          padding-bottom: var(--ddd-spacing-7);
        }
        .pb-8 {
          padding-bottom: var(--ddd-spacing-8);
        }
        .pb-9 {
          padding-bottom: var(--ddd-spacing-9);
        }
        .pb-10 {
          padding-bottom: var(--ddd-spacing-10);
        }
        .pb-11 {
          padding-bottom: var(--ddd-spacing-11);
        }
        .pb-12 {
          padding-bottom: var(--ddd-spacing-12);
        }
        .pb-13 {
          padding-bottom: var(--ddd-spacing-13);
        }
        .pb-14 {
          padding-bottom: var(--ddd-spacing-14);
        }
        .pb-15 {
          padding-bottom: var(--ddd-spacing-15);
        }
        .pb-16 {
          padding-bottom: var(--ddd-spacing-16);
        }
        .pb-17 {
          padding-bottom: var(--ddd-spacing-17);
        }
        .pb-18 {
          padding-bottom: var(--ddd-spacing-18);
        }
        .pb-19 {
          padding-bottom: var(--ddd-spacing-19);
        }
        .pb-20 {
          padding-bottom: var(--ddd-spacing-20);
        }
        .pb-21 {
          padding-bottom: var(--ddd-spacing-21);
        }
        .pb-22 {
          padding-bottom: var(--ddd-spacing-22);
        }
        .pb-23 {
          padding-bottom: var(--ddd-spacing-23);
        }
        .pb-24 {
          padding-bottom: var(--ddd-spacing-24);
        }
        .pb-25 {
          padding-bottom: var(--ddd-spacing-25);
        }
        .pb-26 {
          padding-bottom: var(--ddd-spacing-26);
        }
        .pb-27 {
          padding-bottom: var(--ddd-spacing-27);
        }
        .pb-28 {
          padding-bottom: var(--ddd-spacing-28);
        }
        .pb-29 {
          padding-bottom: var(--ddd-spacing-29);
        }
        .pb-30 {
          padding-bottom: var(--ddd-spacing-30);
        }
        .pl-0 {
          padding-left: var(--ddd-spacing-0);
        }
        .pl-1 {
          padding-left: var(--ddd-spacing-1);
        }
        .pl-2 {
          padding-left: var(--ddd-spacing-2);
        }
        .pl-3 {
          padding-left: var(--ddd-spacing-3);
        }
        .pl-4 {
          padding-left: var(--ddd-spacing-4);
        }
        .pl-5 {
          padding-left: var(--ddd-spacing-5);
        }
        .pl-6 {
          padding-left: var(--ddd-spacing-6);
        }
        .pl-7 {
          padding-left: var(--ddd-spacing-7);
        }
        .pl-8 {
          padding-left: var(--ddd-spacing-8);
        }
        .pl-9 {
          padding-left: var(--ddd-spacing-9);
        }
        .pl-10 {
          padding-left: var(--ddd-spacing-10);
        }
        .pl-11 {
          padding-left: var(--ddd-spacing-11);
        }
        .pl-12 {
          padding-left: var(--ddd-spacing-12);
        }
        .pl-13 {
          padding-left: var(--ddd-spacing-13);
        }
        .pl-14 {
          padding-left: var(--ddd-spacing-14);
        }
        .pl-15 {
          padding-left: var(--ddd-spacing-15);
        }
        .pl-16 {
          padding-left: var(--ddd-spacing-16);
        }
        .pl-17 {
          padding-left: var(--ddd-spacing-17);
        }
        .pl-18 {
          padding-left: var(--ddd-spacing-18);
        }
        .pl-19 {
          padding-left: var(--ddd-spacing-19);
        }
        .pl-20 {
          padding-left: var(--ddd-spacing-20);
        }
        .pl-21 {
          padding-left: var(--ddd-spacing-21);
        }
        .pl-22 {
          padding-left: var(--ddd-spacing-22);
        }
        .pl-23 {
          padding-left: var(--ddd-spacing-23);
        }
        .pl-24 {
          padding-left: var(--ddd-spacing-24);
        }
        .pl-25 {
          padding-left: var(--ddd-spacing-25);
        }
        .pl-26 {
          padding-left: var(--ddd-spacing-26);
        }
        .pl-27 {
          padding-left: var(--ddd-spacing-27);
        }
        .pl-28 {
          padding-left: var(--ddd-spacing-28);
        }
        .pl-29 {
          padding-left: var(--ddd-spacing-29);
        }
        .pl-30 {
          padding-left: var(--ddd-spacing-30);
        }
        .pr-0 {
          padding-right: var(--ddd-spacing-0);
        }
        .pr-1 {
          padding-right: var(--ddd-spacing-1);
        }
        .pr-2 {
          padding-right: var(--ddd-spacing-2);
        }
        .pr-3 {
          padding-right: var(--ddd-spacing-3);
        }
        .pr-4 {
          padding-right: var(--ddd-spacing-4);
        }
        .pr-5 {
          padding-right: var(--ddd-spacing-5);
        }
        .pr-6 {
          padding-right: var(--ddd-spacing-6);
        }
        .pr-7 {
          padding-right: var(--ddd-spacing-7);
        }
        .pr-8 {
          padding-right: var(--ddd-spacing-8);
        }
        .pr-9 {
          padding-right: var(--ddd-spacing-9);
        }
        .pr-10 {
          padding-right: var(--ddd-spacing-10);
        }
        .pr-11 {
          padding-right: var(--ddd-spacing-11);
        }
        .pr-12 {
          padding-right: var(--ddd-spacing-12);
        }
        .pr-13 {
          padding-right: var(--ddd-spacing-13);
        }
        .pr-14 {
          padding-right: var(--ddd-spacing-14);
        }
        .pr-15 {
          padding-right: var(--ddd-spacing-15);
        }
        .pr-16 {
          padding-right: var(--ddd-spacing-16);
        }
        .pr-17 {
          padding-right: var(--ddd-spacing-17);
        }
        .pr-18 {
          padding-right: var(--ddd-spacing-18);
        }
        .pr-19 {
          padding-right: var(--ddd-spacing-19);
        }
        .pr-20 {
          padding-right: var(--ddd-spacing-20);
        }
        .pr-21 {
          padding-right: var(--ddd-spacing-21);
        }
        .pr-22 {
          padding-right: var(--ddd-spacing-22);
        }
        .pr-23 {
          padding-right: var(--ddd-spacing-23);
        }
        .pr-24 {
          padding-right: var(--ddd-spacing-24);
        }
        .pr-25 {
          padding-right: var(--ddd-spacing-25);
        }
        .pr-26 {
          padding-right: var(--ddd-spacing-26);
        }
        .pr-27 {
          padding-right: var(--ddd-spacing-27);
        }
        .pr-28 {
          padding-right: var(--ddd-spacing-28);
        }
        .pr-29 {
          padding-right: var(--ddd-spacing-29);
        }
        .pr-30 {
          padding-right: var(--ddd-spacing-30);
        }
        .px-0 {
          padding-left: var(--ddd-spacing-0);
          padding-right: var(--ddd-spacing-0);
        }
        .px-1 {
          padding-left: var(--ddd-spacing-1);
          padding-right: var(--ddd-spacing-1);
        }
        .px-2 {
          padding-left: var(--ddd-spacing-2);
          padding-right: var(--ddd-spacing-2);
        }
        .px-3 {
          padding-left: var(--ddd-spacing-3);
          padding-right: var(--ddd-spacing-3);
        }
        .px-4 {
          padding-left: var(--ddd-spacing-4);
          padding-right: var(--ddd-spacing-4);
        }
        .px-5 {
          padding-left: var(--ddd-spacing-5);
          padding-right: var(--ddd-spacing-5);
        }
        .px-6 {
          padding-left: var(--ddd-spacing-6);
          padding-right: var(--ddd-spacing-6);
        }
        .px-7 {
          padding-left: var(--ddd-spacing-7);
          padding-right: var(--ddd-spacing-7);
        }
        .px-8 {
          padding-left: var(--ddd-spacing-8);
          padding-right: var(--ddd-spacing-8);
        }
        .px-9 {
          padding-left: var(--ddd-spacing-9);
          padding-right: var(--ddd-spacing-9);
        }
        .px-10 {
          padding-left: var(--ddd-spacing-10);
          padding-right: var(--ddd-spacing-10);
        }
        .px-11 {
          padding-left: var(--ddd-spacing-11);
          padding-right: var(--ddd-spacing-11);
        }
        .px-12 {
          padding-left: var(--ddd-spacing-12);
          padding-right: var(--ddd-spacing-12);
        }
        .px-13 {
          padding-left: var(--ddd-spacing-13);
          padding-right: var(--ddd-spacing-13);
        }
        .px-14 {
          padding-left: var(--ddd-spacing-14);
          padding-right: var(--ddd-spacing-14);
        }
        .px-15 {
          padding-left: var(--ddd-spacing-15);
          padding-right: var(--ddd-spacing-15);
        }
        .px-16 {
          padding-left: var(--ddd-spacing-16);
          padding-right: var(--ddd-spacing-16);
        }
        .px-17 {
          padding-left: var(--ddd-spacing-17);
          padding-right: var(--ddd-spacing-17);
        }
        .px-18 {
          padding-left: var(--ddd-spacing-18);
          padding-right: var(--ddd-spacing-18);
        }
        .px-19 {
          padding-left: var(--ddd-spacing-19);
          padding-right: var(--ddd-spacing-19);
        }
        .px-20 {
          padding-left: var(--ddd-spacing-20);
          padding-right: var(--ddd-spacing-20);
        }
        .px-21 {
          padding-left: var(--ddd-spacing-21);
          padding-right: var(--ddd-spacing-21);
        }
        .px-22 {
          padding-left: var(--ddd-spacing-22);
          padding-right: var(--ddd-spacing-22);
        }
        .px-23 {
          padding-left: var(--ddd-spacing-23);
          padding-right: var(--ddd-spacing-23);
        }
        .px-24 {
          padding-left: var(--ddd-spacing-24);
          padding-right: var(--ddd-spacing-24);
        }
        .px-25 {
          padding-left: var(--ddd-spacing-25);
          padding-right: var(--ddd-spacing-25);
        }
        .px-26 {
          padding-left: var(--ddd-spacing-26);
          padding-right: var(--ddd-spacing-26);
        }
        .px-27 {
          padding-left: var(--ddd-spacing-27);
          padding-right: var(--ddd-spacing-27);
        }
        .px-28 {
          padding-left: var(--ddd-spacing-28);
          padding-right: var(--ddd-spacing-28);
        }
        .px-29 {
          padding-left: var(--ddd-spacing-29);
          padding-right: var(--ddd-spacing-29);
        }
        .px-30 {
          padding-left: var(--ddd-spacing-30);
          padding-right: var(--ddd-spacing-30);
        }
        .py-0 {
          padding-top: var(--ddd-spacing-0);
          padding-bottom: var(--ddd-spacing-0);
        }
        .py-1 {
          padding-top: var(--ddd-spacing-1);
          padding-bottom: var(--ddd-spacing-1);
        }
        .py-2 {
          padding-top: var(--ddd-spacing-2);
          padding-bottom: var(--ddd-spacing-2);
        }
        .py-3 {
          padding-top: var(--ddd-spacing-3);
          padding-bottom: var(--ddd-spacing-3);
        }
        .py-4 {
          padding-top: var(--ddd-spacing-4);
          padding-bottom: var(--ddd-spacing-4);
        }
        .py-5 {
          padding-top: var(--ddd-spacing-5);
          padding-bottom: var(--ddd-spacing-5);
        }
        .py-6 {
          padding-top: var(--ddd-spacing-6);
          padding-bottom: var(--ddd-spacing-6);
        }
        .py-7 {
          padding-top: var(--ddd-spacing-7);
          padding-bottom: var(--ddd-spacing-7);
        }
        .py-8 {
          padding-top: var(--ddd-spacing-8);
          padding-bottom: var(--ddd-spacing-8);
        }
        .py-9 {
          padding-top: var(--ddd-spacing-9);
          padding-bottom: var(--ddd-spacing-9);
        }
        .py-10 {
          padding-top: var(--ddd-spacing-10);
          padding-bottom: var(--ddd-spacing-10);
        }
        .py-11 {
          padding-top: var(--ddd-spacing-11);
          padding-bottom: var(--ddd-spacing-11);
        }
        .py-12 {
          padding-top: var(--ddd-spacing-12);
          padding-bottom: var(--ddd-spacing-12);
        }
        .py-13 {
          padding-top: var(--ddd-spacing-13);
          padding-bottom: var(--ddd-spacing-13);
        }
        .py-14 {
          padding-top: var(--ddd-spacing-14);
          padding-bottom: var(--ddd-spacing-14);
        }
        .py-15 {
          padding-top: var(--ddd-spacing-15);
          padding-bottom: var(--ddd-spacing-15);
        }
        .py-16 {
          padding-top: var(--ddd-spacing-16);
          padding-bottom: var(--ddd-spacing-16);
        }
        .py-17 {
          padding-top: var(--ddd-spacing-17);
          padding-bottom: var(--ddd-spacing-17);
        }
        .py-18 {
          padding-top: var(--ddd-spacing-18);
          padding-bottom: var(--ddd-spacing-18);
        }
        .py-19 {
          padding-top: var(--ddd-spacing-19);
          padding-bottom: var(--ddd-spacing-19);
        }
        .py-20 {
          padding-top: var(--ddd-spacing-20);
          padding-bottom: var(--ddd-spacing-20);
        }
        .py-21 {
          padding-top: var(--ddd-spacing-21);
          padding-bottom: var(--ddd-spacing-21);
        }
        .py-22 {
          padding-top: var(--ddd-spacing-22);
          padding-bottom: var(--ddd-spacing-22);
        }
        .py-23 {
          padding-top: var(--ddd-spacing-23);
          padding-bottom: var(--ddd-spacing-23);
        }
        .py-24 {
          padding-top: var(--ddd-spacing-24);
          padding-bottom: var(--ddd-spacing-24);
        }
        .py-25 {
          padding-top: var(--ddd-spacing-25);
          padding-bottom: var(--ddd-spacing-25);
        }
        .py-26 {
          padding-top: var(--ddd-spacing-26);
          padding-bottom: var(--ddd-spacing-26);
        }
        .py-27 {
          padding-top: var(--ddd-spacing-27);
          padding-bottom: var(--ddd-spacing-27);
        }
        .py-28 {
          padding-top: var(--ddd-spacing-28);
          padding-bottom: var(--ddd-spacing-28);
        }
        .py-29 {
          padding-top: var(--ddd-spacing-29);
          padding-bottom: var(--ddd-spacing-29);
        }
        .py-30 {
          padding-top: var(--ddd-spacing-30);
          padding-bottom: var(--ddd-spacing-30);
        }

        /* font base states */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: var(--ddd-font-primary);
          font-weight: var(--ddd-font-primary-bold);
        }
        .fw-0 {
          font-weight: var(
            --ddd-font-primary-light
          ); /* available for navigation */
        }
        .fw-1 {
          font-weight: var(
            --ddd-font-primary-regular
          ); /* available for headers */
        }
        .fw-2 {
          font-weight: var(
            --ddd-font-primary-medium
          ); /* available for headers */
        }
        .fw-3 {
          font-weight: var(
            --ddd-font-primary-bold
          ); /* default for headers, body & navigation */
        }
        .fw-4 {
          font-weight: var(
            --ddd-font-primary-black
          ); /* available for headers */
        }
        h1 {
          font-size: var(--ddd-font-size-xl);
          margin: var(--ddd-spacing-8) 0;
        }
        h2 {
          font-size: var(--ddd-font-size-l);
          margin: var(--ddd-spacing-7) 0;
        }
        h3 {
          font-size: var(--ddd-font-size-ml);
          margin: var(--ddd-spacing-6) 0;
        }
        h4 {
          font-size: var(--ddd-font-size-m);
          margin: var(--ddd-spacing-5) 0;
        }
        h5 {
          font-size: var(--ddd-font-size-ms);
          margin: var(--ddd-spacing-4) 0;
        }
        h6 {
          font-size: var(--ddd-font-size-s);
          margin: var(--ddd-spacing-3) 0;
        }
        p {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-3xs);
          margin: var(--ddd-spacing-1) 0;
          font-weight: var(--ddd-font-secondary-regular);
        }
        .ddd-font-nav {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-navigation-bold);
        }
        .ddd-font-primary {
          font-family: var(--ddd-font-primary);
        }
        .ddd-font-secondary {
          font-family: var(--ddd-font-secondary);
        }


        /* font sizes */
        .fs-4xs {
          font-size: var(--ddd-font-size-4xs);
        }
        .fs-3xs {
          font-size: var(--ddd-font-size-3xs);
        }
        .fs-xxs {
          font-size: var(--ddd-font-size-xxs);
        }
        .fs-xs {
          font-size: var(--ddd-font-size-xs);
        }
        .fs-s {
          font-size: var(--ddd-font-size-s);
        }
        .fs-ms {
          font-size: var(--ddd-font-size-ms);
        }
        .fs-m {
          font-size: var(--ddd-font-size-m);
        }
        .fs-ml {
          font-size: var(--ddd-font-size-ml);
        }
        .fs-l {
          font-size: var(--ddd-font-size-l);
        }
        .fs-xl {
          font-size: var(--ddd-font-size-xl);
        }
        .fs-xxl {
          font-size: var(--ddd-font-size-xxl);
        }
        .fs-3xl {
          font-size: var(--ddd-font-size-3xl);
        }
        .fs-4xl {
          font-size: var(--ddd-font-size-4xl);
        }



        .boxshadow-0 {
          box-shadow: none;
        }
        .boxshadow-xs {
          box-shadow: var(--ddd-shadow-1);
        }
        .boxshadow-sm {
          box-shadow: var(--ddd-shadow-2);
        }
        .boxshadow-md {
          box-shadow: var(--ddd-shadow-3);
        }
        .boxshadow-lg {
          box-shadow: var(--ddd-shadow-4);
        }
        .textshadow-0 {
          text-shadow: none;
        }
        /* no current text shadow comp to use */
        /*.textshadow-1{
            text-shadow: black 0px 0px 10px;
          }
          .textshadow-2{
            text-shadow: var(--ddd-shadow-2);
          }
          .textshadow-3{
            text-shadow: var(--ddd-shadow-3);
          }
          .textshadow-4{
            text-shadow: var(--ddd-shadow-4);
          }*/
      `,
    ];
  }

  renderHeaders() {
    return html`
      <h3 class="my-20 font-beaverBlue">Headers</h3>
      <h6>Default Header 6</h6>
      <h5>Default Header 5</h5>
      <h4>Default Header 4</h4>
      <h3>Default Header 3</h3>
      <h2>Default Header 2</h2>
      <h1>Default Header 1</h1>
      <p>Default Body</p>
      <span class="ddd-nav">Default Navigation</span>
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
        <h5>--ddd-theme-polaris-beaverBlue</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-beaverBlue);"
        ></div>
        <h5>--ddd-theme-polaris-landgrantBrown</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-landgrantBrown);"
        ></div>
        <h5>--ddd-theme-polaris-nittanyNavy</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-nittanyNavy);"
        ></div>
        <h5>--ddd-theme-polaris-navy40</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-navy40);"
        ></div>
        <h5>--ddd-theme-polaris-navy65</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-navy65);"
        ></div>
        <h5>--ddd-theme-polaris-navy80</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-navy80);"
        ></div>
        <h5>--ddd-theme-polaris-potentialMidnight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-potentialMidnight);"
        ></div>
        <h5>--ddd-theme-polaris-potential50</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-potential50);"
        ></div>
        <h5>--ddd-theme-polaris-pughBlue</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-pughBlue);"
        ></div>
        <h5>--ddd-theme-polaris-coalyGray</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-coalyGray);"
        ></div>
        <h5>--ddd-theme-polaris-keystoneYellow</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-keystoneYellow);"
        ></div>
        <h5>--ddd-theme-polaris-slateGray</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-slateGray);"
        ></div>
        <h5>--ddd-theme-polaris-slateLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-slateLight);"
        ></div>
        <h5>--ddd-theme-polaris-slateMaxLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-slateMaxLight);"
        ></div>
        <h5>--ddd-theme-polaris-skyBlue</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-skyBlue);"
        ></div>
        <h5>--ddd-theme-polaris-skyLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-skyLight);"
        ></div>
        <h5>--ddd-theme-polaris-skyMaxlight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-skyMaxlight);"
        ></div>
        <h5>--ddd-theme-polaris-limestoneGray</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-limestoneGray);"
        ></div>
        <h5>--ddd-theme-polaris-limestoneLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-limestoneLight);"
        ></div>
        <h5>--ddd-theme-polaris-limestoneMaxLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-limestoneMaxLight);"
        ></div>
        <h5>--ddd-theme-polaris-white</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-white);"
        ></div>
        <h5>--ddd-theme-polaris-shrineLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-shrineLight);"
        ></div>
        <h5>--ddd-theme-polaris-shrineMaxLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-shrineMaxLight);"
        ></div>
        <h5>--ddd-theme-polaris-creekTeal</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-creekTeal);"
        ></div>
        <h5>--ddd-theme-polaris-creekLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-creekLight);"
        ></div>
        <h5>--ddd-theme-polaris-creekMaxLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-creekMaxLight);"
        ></div>
        <h5>--ddd-theme-polaris-shrineTan</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-shrineTan);"
        ></div>
        <h5>--ddd-theme-polaris-roarGolden</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-roarGolden);"
        ></div>
        <h5>--ddd-theme-polaris-roarLight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-roarLight);"
        ></div>
        <h5>--ddd-theme-polaris-roarMaxlight</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-roarMaxlight);"
        ></div>
        <h5>--ddd-theme-polaris-forestGreen</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-forestGreen);"
        ></div>
        <h5>--ddd-theme-polaris-athertonViolet</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-athertonViolet);"
        ></div>
        <h5>--ddd-theme-polaris-original87Pink</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-original87Pink);"
        ></div>
        <h5>--ddd-theme-polaris-discoveryCoral</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-discoveryCoral);"
        ></div>
        <h5>--ddd-theme-polaris-futureLime</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-futureLime);"
        ></div>
        <h5>--ddd-theme-polaris-wonderPurple</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-wonderPurple);"
        ></div>
        <h5>--ddd-theme-polaris-inventOrange</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-inventOrange);"
        ></div>
        <h5>--ddd-theme-polaris-opportunityGreen</h5>
        <div
          class="m-5 p-10 border-1"
          style="background-color: var(--ddd-theme-polaris-opportunityGreen);"
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
    return "d-d-d";
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
        icon: "icons:android",
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
          tag: "d-d-d",
          content: "",
          properties: {},
        },
      ],
    };
  }
}
customElements.define(DDD.tag, DDD);
export { DDD };