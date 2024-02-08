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

//export const styleGuideHeaders = {css``}

export const styleGuideTopics = {
  Borders: "Borders",
  Breakpoints: "Breakpoints",
  PolarisColors: "PolarisColors",
  PolarisFunctionalColors: "PolarisFunctionalColors",
  Gradients: "Gradients",
  Radius: "Radius",
  Shadows: "Shadows",
  Spacing: "Spacing",
  Typography: "Typography",
};

export const DDDFonts = [
  "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&display=swap",
  "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap",
  "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap",
];
// super class so we can mix styles into other things more easily
export const DDDSuper = function (SuperClass) {
  return class extends SimpleColorsSuper(SuperClass) {
    constructor() {
      super();
    }
    // call this to load all the fonts that are official
    loadDDDFonts(fonts) {
      if (
        globalThis &&
        globalThis.document &&
        !globalThis.document.querySelector('[data-ddd="font"]')
      ) {
        fonts.forEach((font) => {
          const link = globalThis.document.createElement("link");
          link.setAttribute("href", font);
          link.setAttribute("rel", "stylesheet");
          link.setAttribute("fetchpriority", "low");
          link.setAttribute("data-ddd", "font");
          globalThis.document.head.appendChild(link);
        });
      }
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
          body,
          html,
          :root,
          :host {
            /* global override font styles for light-dom content */
            --ddd-theme-body-font-size: var(--ddd-font-size-3xs);
            --ddd-theme-h1-font-size: var(--ddd-font-size-l);
            --ddd-theme-h2-font-size: var(--ddd-font-size-m);
            --ddd-theme-h3-font-size: var(--ddd-font-size-ms);
            --ddd-theme-h4-font-size: var(--ddd-font-size-s);
            --ddd-theme-h5-font-size: var(--ddd-font-size-xs);
            --ddd-theme-h6-font-size: var(--ddd-font-size-xxs);

            --ddd-font-size-4xs: 16px;
            --ddd-font-size-3xs: 18px; /* body default */
            --ddd-font-size-xxs: 20px; /* h6 */
            --ddd-font-size-xs: 22px; /* h5 */
            --ddd-font-size-s: 24px; /* h4 */
            --ddd-font-size-ms: 28px; /* h3 */
            --ddd-font-size-m: 32px; /* h2 */
            --ddd-font-size-ml: 36px;
            --ddd-font-size-l: 40px; /* h1 */
            --ddd-font-size-xl: 48px;
            --ddd-font-size-xxl: 56px;
            --ddd-font-size-3xl: 64px;
            --ddd-font-size-4xl: 72px;
            /* base polaris colors */
            --ddd-theme-polaris-beaverBlue: #1e407c;
            --ddd-theme-polaris-beaver70: rgba(30, 64, 124, 0.7);
            --ddd-theme-polaris-beaver80: rgba(30, 64, 124, 0.8);
            --ddd-theme-polaris-landgrantBrown: #6a3028;
            --ddd-theme-polaris-nittanyNavy: #001e44;
            --ddd-theme-polaris-navy40: rgba(0, 30, 68, 0.4);
            --ddd-theme-polaris-navy60: rgba(0, 30, 68, 0.6);
            --ddd-theme-polaris-navy65: rgba(0, 30, 68, 0.65);
            --ddd-theme-polaris-navy70: rgba(0, 30, 68, 0.7);
            --ddd-theme-polaris-navy80: rgba(0, 30, 68, 0.8);
            --ddd-theme-polaris-potentialMidnight: #000321;
            --ddd-theme-polaris-potential0: rgba(0, 3, 33, 0);
            --ddd-theme-polaris-potential50: rgba(0, 3, 33, 0.5);
            --ddd-theme-polaris-potential70: rgba(0, 3, 33, 0.7);
            --ddd-theme-polaris-potential75: rgba(0, 3, 33, 0.75);
            --ddd-theme-polaris-pughBlue: #96bee6;
            --ddd-theme-polaris-coalyGray: #262626;
            --ddd-theme-polaris-coaly45: rgba(38, 38, 38, 0.45);
            --ddd-theme-polaris-coaly60: rgba(38, 38, 38, 0.6);
            --ddd-theme-polaris-coaly75: rgba(38, 38, 38, 0.75);
            --ddd-theme-polaris-coaly90: rgba(38, 38, 38, 0.9);
            --ddd-theme-polaris-keystoneYellow: #ffd100;
            --ddd-theme-polaris-slateGray: #314d64;
            --ddd-theme-polaris-slateLight: #ccdae6;
            --ddd-theme-polaris-slateMaxLight: #eef3f7;
            --ddd-theme-polaris-skyBlue: #009cde;
            --ddd-theme-polaris-skyLight: #ccf0ff;
            --ddd-theme-polaris-skyMaxLight: #e6f7ff;
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

            --ddd-theme-polaris-background: #eff2f5;

            /* simplecolors needs to be included ->  */

            /* 
          Come back to grid in style guide - > decide number of columns based on container breakpoints
          */

            /*fonts*/
            --ddd-font-primary: "Roboto", "Franklin Gothic Medium", Tahoma,
              sans-serif;
            --ddd-font-primary-regular: 400; /* default weight for body */
            --ddd-font-primary-medium: 500;
            --ddd-font-primary-bold: 700; /* default weight for headers */
            --ddd-font-primary-black: 900;

            --ddd-font-secondary: "Roboto Slab", serif;
            --ddd-font-secondary-bold: 700;

            --ddd-font-navigation: "Roboto Condensed", sans-serif; /* navigation font */
            --ddd-font-navigation-light: 300;
            --ddd-font-navigation-regular: 400;
            --ddd-font-navigation-bold: 700;

            /* font sizes */
            --ddd-font-size-4xs: 16px;
            --ddd-font-size-3xs: 18px; /* body default */
            --ddd-font-size-xxs: 20px; /* h6 */
            --ddd-font-size-xs: 22px; /* h5 */
            --ddd-font-size-s: 24px; /* h4 */
            --ddd-font-size-ms: 28px; /* h3 */
            --ddd-font-size-m: 32px; /* h2 */
            --ddd-font-size-ml: 36px;
            --ddd-font-size-l: 40px; /* h1 */
            --ddd-font-size-xl: 48px;
            --ddd-font-size-xxl: 56px;
            --ddd-font-size-3xl: 64px;
            --ddd-font-size-4xl: 72px;

            /* letter spacing */
            --ddd-ls-16-sm: 0.08px;
            --ddd-ls-18-sm: 0.09px;
            --ddd-ls-20-sm: 0.1px;
            --ddd-ls-22-sm: 0.11px;
            --ddd-ls-24-sm: 0.12px;
            --ddd-ls-28-sm: 0.14px;
            --ddd-ls-32-sm: 0.16px;
            --ddd-ls-36-sm: 0.18px;
            --ddd-ls-40-sm: 0.2px;
            --ddd-ls-48-sm: 0.24px;
            --ddd-ls-56-sm: 0.28px;
            --ddd-ls-64-sm: 0.32px;
            --ddd-ls-72-sm: 0.36px;
            --ddd-ls-16-lg: 0.24px;
            --ddd-ls-18-lg: 0.27px;
            --ddd-ls-20-lg: 0.3px;
            --ddd-ls-22-lg: 0.33px;
            --ddd-ls-24-lg: 0.36px;
            --ddd-ls-28-lg: 0.42px;
            --ddd-ls-32-lg: 0.48px;
            --ddd-ls-36-lg: 0.54px;
            --ddd-ls-40-lg: 0.6px;
            --ddd-ls-48-lg: 0.72px;
            --ddd-ls-56-lg: 0.84px;
            --ddd-ls-64-lg: 0.96px;
            --ddd-ls-72-lg: 1.08px;

            /* line height */
            --ddd-lh-120: 120%;
            --ddd-lh-140: 140%;
            --ddd-lh-150: 150%;

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
            --ddd-border-xs: 1px solid var(--ddd-theme-polaris-limestoneLight);
            --ddd-border-sm: 2px solid var(--ddd-theme-polaris-limestoneLight);
            --ddd-border-md: 3px solid var(--ddd-theme-polaris-limestoneLight);
            --ddd-border-lg: 4px solid var(--ddd-theme-polaris-limestoneLight);

            /* shadows */
            --ddd-boxShadow-0: 0px 0px 0px 0px rgba(0, 0, 0, 0);
            --ddd-boxShadow-xs: rgba(0, 3, 33, 0.063) 0px 4px 8px 0px;
            --ddd-boxShadow-sm: rgba(0, 3, 33, 0.063) 0px 8px 16px 0px;
            --ddd-boxShadow-md: rgba(0, 3, 33, 0.063) 0px 12px 24px 0px;
            --ddd-boxShadow-lg: rgba(0, 3, 33, 0.063) 0px 16px 32px 0px;

            --ddd-textShadow-0: 0px 0px 0px rgba(0, 0, 0, 0); /* No shadow */
            --ddd-textShadow-xs: rgba(0, 3, 33, 0.063) 0px 2px 4px;
            --ddd-textShadow-sm: rgba(0, 3, 33, 0.063) 0px 4px 8px;
            --ddd-textShadow-md: rgba(0, 3, 33, 0.063) 0px 6px 12px;
            --ddd-textShadow-lg: rgba(0, 3, 33, 0.063) 0px 8px 16px;

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

            /* Gradients */
            --ddd-theme-polaris-gradient-navBar: linear-gradient(
              90deg,
              rgb(0, 30, 68) 0%,
              rgb(0, 30, 68) 31%,
              rgb(30, 64, 124) 76%,
              rgb(0, 3, 33) 100%
            );
            --ddd-theme-polaris-gradient-footer: linear-gradient(
              rgb(30, 64, 124) 0%,
              rgb(0, 30, 68) 65%,
              rgb(0, 30, 68) 100%
            );
            --ddd-theme-polaris-gradient-newsFeature: linear-gradient(
              360deg,
              rgb(30, 64, 124) 20%,
              rgb(0, 156, 222) 100%
            );
            --ddd-theme-polaris-gradient-buttons: linear-gradient(
              rgb(0, 156, 222) 0%,
              rgb(30, 64, 124) 85%
            );
            --ddd-theme-polaris-gradient-hero: linear-gradient(
              360deg,
              rgba(0, 30, 68, 0.8) 0%,
              rgba(0, 30, 68, 0.4) 50%,
              rgba(0, 3, 33, 0) 100%
            );
            --ddd-theme-polaris-gradient-hero2: linear-gradient(
              360deg,
              rgb(0, 30, 68) 0%,
              rgba(0, 30, 68, 0.4) 50%,
              rgba(0, 3, 33, 0) 100%
            );
            --ddd-theme-polaris-gradient-antihero: linear-gradient(
              180deg,
              rgba(0, 30, 68, 0.8) 0%,
              rgba(0, 30, 68, 0.4) 50%,
              rgba(0, 3, 33, 0) 100%
            );
            --ddd-theme-polaris-gradient-antihero2: linear-gradient(
              180deg,
              rgb(0, 30, 68) 0%,
              rgba(0, 30, 68, 0.4) 50%,
              rgba(0, 3, 33, 0) 100%
            );

            --ddd-icon-3xs: 20px;
            --ddd-icon-xxs: 24px;
            --ddd-icon-xs: 32px;
            --ddd-icon-sm: 40px;
            --ddd-icon-md: 48px;
            --ddd-icon-lg: 56px;
            --ddd-icon-xl: 64px;
            --ddd-icon-2xl: 72px;
            --ddd-icon-3xl: 84px;
            --ddd-icon-4xl: 96px;

            /* borrowed from base styling */

            scroll-behavior: smooth;
          }
          /* border & shadows */
          .b-0 {
            border: none;
          }
          .b-xs {
            border: var(--ddd-border-xs);
          }
          .b-sm {
            border: var(--ddd-border-sm);
          }
          .b-md {
            border: ;
          }
          .b-lg {
            border: ;
          }
          .bt-0 {
            border-top: none;
          }
          .bt-xs {
            border-top: var(--ddd-border-xs);
          }
          .bt-sm {
            border-top: var(--ddd-border-sm);
          }
          .bt-md {
            border-top: 3px solid var(--ddd-theme-polaris-limestoneLight);
          }
          .bt-lg {
            border-top: 4px solid var(--ddd-theme-polaris-limestoneLight);
          }
          .br-0 {
            border-right: none;
          }
          .br-xs {
            border-right: var(--ddd-border-xs);
          }
          .br-sm {
            border-right: var(--ddd-border-sm);
          }
          .br-md {
            border-right: 3px solid var(--ddd-theme-polaris-limestoneLight);
          }
          .br-lg {
            border-right: 4px solid var(--ddd-theme-polaris-limestoneLight);
          }
          .bb-0 {
            border-bottom: none;
          }
          .bb-xs {
            border-bottom: var(--ddd-border-xs);
          }
          .bb-sm {
            border-bottom: var(--ddd-border-sm);
          }
          .bb-md {
            border-bottom: 3px solid var(--ddd-theme-polaris-limestoneLight);
          }
          .bb-lg {
            border-bottom: 4px solid var(--ddd-theme-polaris-limestoneLight);
          }
          .bl-0 {
            border-left: none;
          }
          .bl-xs {
            border-left: var(--ddd-border-xs);
          }
          .bl-sm {
            border-left: var(--ddd-border-sm);
          }
          .bl-md {
            border-left: 3px solid var(--ddd-theme-polaris-limestoneLight);
          }
          .bl-lg {
            border-left: 4px solid var(--ddd-theme-polaris-limestoneLight);
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
          .p-auto {
            padding: auto;
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
          .pt-auto {
            padding-top: auto;
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
          .pb-auto {
            padding-bottom: auto;
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
          .pl-auto {
            padding-left: auto;
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
          .pr-auto {
            padding-right: auto;
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
          .px-auto {
            padding-left: auto;
            padding-right: auto;
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
          .py-auto {
            padding-top: auto;
            padding-bottom: auto;
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
          .gap-0 {
            gap: var(--ddd-spacing-0);
          }
          .gap-1 {
            gap: var(--ddd-spacing-1);
          }
          .gap-2 {
            gap: var(--ddd-spacing-2);
          }
          .gap-3 {
            gap: var(--ddd-spacing-3);
          }
          .gap-4 {
            gap: var(--ddd-spacing-4);
          }
          .gap-5 {
            gap: var(--ddd-spacing-5);
          }
          .gap-6 {
            gap: var(--ddd-spacing-6);
          }
          .gap-7 {
            gap: var(--ddd-spacing-7);
          }
          .gap-8 {
            gap: var(--ddd-spacing-8);
          }
          .gap-9 {
            gap: var(--ddd-spacing-9);
          }
          .gap-10 {
            gap: var(--ddd-spacing-10);
          }
          .gap-11 {
            gap: var(--ddd-spacing-11);
          }
          .gap-12 {
            gap: var(--ddd-spacing-12);
          }
          .gap-13 {
            gap: var(--ddd-spacing-13);
          }
          .gap-14 {
            gap: var(--ddd-spacing-14);
          }
          .gap-15 {
            gap: var(--ddd-spacing-15);
          }
          .gap-16 {
            gap: var(--ddd-spacing-16);
          }
          .gap-17 {
            gap: var(--ddd-spacing-17);
          }
          .gap-18 {
            gap: var(--ddd-spacing-18);
          }
          .gap-19 {
            gap: var(--ddd-spacing-19);
          }
          .gap-20 {
            gap: var(--ddd-spacing-20);
          }
          .gap-21 {
            gap: var(--ddd-spacing-21);
          }
          .gap-22 {
            gap: var(--ddd-spacing-22);
          }
          .gap-23 {
            gap: var(--ddd-spacing-23);
          }
          .gap-24 {
            gap: var(--ddd-spacing-24);
          }
          .gap-25 {
            gap: var(--ddd-spacing-25);
          }
          .gap-26 {
            gap: var(--ddd-spacing-26);
          }
          .gap-27 {
            gap: var(--ddd-spacing-27);
          }
          .gap-28 {
            gap: var(--ddd-spacing-28);
          }
          .gap-29 {
            gap: var(--ddd-spacing-29);
          }
          .gap-30 {
            gap: var(--ddd-spacing-30);
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
          * {
            font-family: var(--ddd-font-primary);
          }
          h1 {
            font-size: var(--ddd-theme-h1-font-size);
            margin: var(--ddd-spacing-10) 0 var(--ddd-spacing-5);
            line-height: auto;
            letter-spacing: auto;
          }
          h2,
          h3,
          h4,
          h5,
          h6 {
            margin: var(--ddd-spacing-7) 0 var(--ddd-spacing-3);
            padding: 0;
            line-height: auto;
            letter-spacing: auto;
          }
          h2 {
            font-size: var(--ddd-theme-h2-font-size);
          }
          h3 {
            font-size: var(--ddd-theme-h3-font-size);
          }
          h4 {
            font-size: var(--ddd-theme-h4-font-size);
          }
          h5 {
            font-size: var(--ddd-theme-h5-font-size);
          }
          h6 {
            font-size: var(--ddd-theme-h6-font-size);
          }
          p,
          div {
            font-family: var(--ddd-font-primary);
            font-size: var(
              --ddd-theme-body-font-size,
              var(--ddd-theme-haxcms-font-size)
            );
            font-weight: var(--ddd-font-primary-regular);
            letter-spacing: normal;
          }
          p {
            line-height: var(--ddd-lh-140);
            margin: var(--ddd-spacing-4) 0;
          }
          a,
          a:-webkit-any-link {
            line-break: anywhere;
            color: var(--ddd-theme-polaris-link);
            font-weight: var(--ddd-font-primary-bold);
            text-decoration: none;
            font-size: var(--ddd-theme-body-font-size);
          }
          a:hover {
            text-decoration: underline;
            cursor: pointer;
          }
          .ddd-font-nav {
            font-family: var(--ddd-font-navigation);
            font-size: var(--ddd-theme-h4-font-size);
            font-weight: var(--ddd-font-navigation-bold);
          }
          .ddd-font-primary {
            font-family: var(--ddd-font-primary);
          }
          .ddd-font-secondary {
            font-family: var(--ddd-font-secondary);
          }

          thead,
          tbody,
          tfoot,
          tr,
          td,
          th {
            font-size: var(--ddd-theme-body-font-size);
            font-family: var(--ddd-font-primary);
          }
          ul,
          ol {
            font-size: var(
              --ddd-theme-body-font-size,
              var(--ddd-theme-haxcms-font-size)
            );
            display: flex;
            flex-flow: column;
            gap: 1rem;
            font-family: var(--ddd-font-primary);
            margin: .5em 0;
          }
          ul li,
          ol li {
            font-size: var(
              --ddd-theme-body-font-size,
              var(--ddd-theme-haxcms-font-size)
            );
          }
          ul li::marker,
          ol li::marker {
            unicode-bidi: isolate;
            font-variant-numeric: tabular-nums;
            text-transform: none;
            text-indent: 0px;
            text-align: start;
            text-align-last: start;
          }
          ul {
            list-style: square;
          }
          ul li::marker {
            color: var(--ddd-theme-polaris-skyBlue);
          }
          blockquote {
            font-family: var(--ddd-font-primary);
            font-size: var(
              --ddd-theme-body-font-size,
              var(--ddd-theme-haxcms-font-size)
            );
            font-style: italic;
            border-left: var(--ddd-spacing-1) solid
              var(--ddd-theme-polaris-pughBlue);
            padding-left: var(--ddd-spacing-6);
            padding-bottom: var(--ddd-spacing-2);
            margin: var(--ddd-spacing-9) 0 var(--ddd-spacing-9)
              var(--ddd-spacing-10);
            line-height: var(--ddd-lh-150);
          }
          hr {
            display: block;
            border: none;
            border-top: 3px solid var(--ddd-theme-polaris-skyBlue);
            width: var(--ddd-theme-h1-font-size);
            margin: 0;
            padding: 0;
          }
          .hr-vert {
            border-bottom: none;
            border-left: 3px solid var(--ddd-theme-polaris-skyBlue);
            display: inline-block;
            padding-left: var(--ddd-spacing-3);
          }
          .breadcrumb {
            font-weight: var(--ddd-font-navigation-light);
            margin: var(--ddd-spacing-6) 0;
            padding: 0;
            pointer-events: auto;
            list-style: "/ ";
            gap: var(--ddd-spacing-5);
            display: flex;
            flex-flow: row;
            color: var(--ddd-theme-polaris-link);
          }
          .breadcrumb li::marker {
            color: black;
            font-weight: var(--ddd-font-primary-regular);
          }
          .breadcrumb li:first-child {
            list-style: none;
          }
          .breadcrumb li:last-child a {
            color: black;
            pointer-events: none;
          }
          .breadcrumb li a {
            padding-left: var(--ddd-spacing-1);
            font-family: var(--ddd-font-navigation);
            font-weight: var(--ddd-font-navigation-regular);
            text-decoration: none;
          }
          .breadcrumb li a:hover {
            text-decoration: underline;
            pointer-events: auto;
          }

          summary {
            display: flex;
            font-size: var(--ddd-theme-h4-font-size);
            font-weight: var(--ddd-font-primary-bold);
            cursor: pointer;
            text-wrap: wrap;
            align-items: center;
            padding: 0 var(--ddd-spacing-5) var(--ddd-spacing-5) 0;
            user-select: none;
            color: black;
          }
          summary::marker {
            content: "";
          }
          summary::after {
            content: "+";
            margin-left: auto;
            text-align: right;
            color: var(--ddd-theme-polaris-link);
            font-weight: var(--ddd-font-primary-regular);
            font-size: var(--ddd-font-size-m);
            line-height: 1;
          }
          details {
            transition: max-height 7s ease-out;
            overflow: hidden;
            max-height: 50px;
            display: flex;
            border-bottom: 2px solid var(--ddd-theme-polaris-slateMaxLight);
            position: relative;
            max-width: 650px;
            padding: 0 0 0 var(--ddd-spacing-5);
            color: black;
            margin: var(--ddd-spacing-6) 0;
          }
          details[open] {
            max-height: 10000px; /* Adjust this value to fit your content */
          }
          details[open] > summary {
            color: var(--ddd-theme-polaris-link);
          }
          details[open] > summary::after {
            content: "--";
            font-size: var(--ddd-font-size-m);
            letter-spacing: -1.8px;
            padding-right: 2px;
          }
          code {
            transition: all 0.2s ease 0s;
            display: inline-block;
            padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
            margin: 0 var(--ddd-spacing-1);
            font-size: var(
              --ddd-theme-body-font-size,
              var(--ddd-theme-haxcms-font-size)
            );
            background-color: var(
              --ddd-theme-polaris-limestoneLight,
              var(
                --hax-base-styles-code-background-color,
                rgba(175, 184, 193, 0.2)
              )
            );
            border-radius: var(--ddd-radius-xs);
            border: var(--ddd-border-lg);
            border-style: groove;
            border-color: var(--ddd-theme-polaris-limestoneMaxLight);
            font-family: var(--ddd-font-primary);
            letter-spacing: var(--ddd-ls-16-lg);
            cursor: grab;
            pointer-events: auto;
            position: relative;
          }
          code.block-code {
            padding: var(--ddd-spacing-2);
            margin: var(--ddd-spacing-5) 0;
          }
          code::-moz-selection {
            /* Code for Firefox */
            background: transparent;
          }
          code::selection {
            background: transparent;
          }
          code:focus::after,
          code:active::after,
          code:hover::after {
            content: attr(popupText);
            position: absolute;
            white-space: nowrap;
            font-style: normal;
            position: absolute;
            bottom: 100%;
            left: 0;
            width: fit-content;
            height: fit-content;
            padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
            color: var(
              --ddd-theme-font-color,
              var(--ddd-theme-polaris-white, #fff)
            );
            background-color: var(
              --ddd-theme-accent-color,
              var(--ddd-theme-polaris-info, , rgba(175, 184, 193, 0.2))
            );
            font-size: var(
              --ddd-theme-body-font-size,
              var(--ddd-theme-haxcms-font-size)
            );
            font-weight: var(--ddd-font-primary-regular);
            border-radius: var(--ddd-radius-xs);
          }

          pre {
            display: inline-block;
            padding: var(--ddd-spacing-4);
            overflow: auto;
            line-height: var(--ddd-lh-140);
            background-color: var(
              --ddd-theme-polaris-limestoneMaxLight,
              var(
                --hax-base-styles-pre-background-color,
                rgba(175, 184, 193, 0.2)
              )
            );
            border-radius: var(--ddd-radius-sm);
            margin: var(--ddd-spacing-1) 0;
            word-break: normal;
            word-wrap: normal;
            font-size: var(
              --ddd-theme-body-font-size,
              var(--ddd-theme-haxcms-font-size)
            );
          }
          mark {
            font-weight: var(--ddd-font-primary-medium);
            padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
            border-radius: var(--ddd-radius-xs);
            background-color: var(--ddd-theme-polaris-keystoneYellow);
          }
          abbr {
            transition: all 0.2s ease 0s;
            padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
            font-style: italic;
            text-decoration: underline;
            pointer-events: auto;
            cursor: pointer;
            outline-color: var(
              --ddd-theme-polaris-info,
              var(--hax-base-styles-abbr-outline, #ffff33)
            );
            position: relative;
          }
          abbr:focus,
          abbr:active,
          abbr:hover {
            text-decoration: none;
            background-color: var(
              --ddd-theme-polaris-infoLight,
              var(--hax-base-styles-abbr-outline, #ffff33)
            );
            outline-offset: 2px;
            outline-style: dotted;
            outline-width: 2px;
          }
          abbr:focus::after,
          abbr:active::after,
          abbr:hover::after {
            content: attr(title);
            position: absolute;
            white-space: nowrap;
            font-style: normal;
            position: absolute;
            bottom: 100%;
            left: 0;
            width: fit-content;
            height: fit-content;
            padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
            color: var(
              --ddd-theme-font-color,
              var(--ddd-theme-polaris-white, #fff)
            );
            background-color: var(
              --ddd-theme-accent-color,
              var(--ddd-theme-polaris-info, , rgba(175, 184, 193, 0.2))
            );
            font-size: var(
              --ddd-theme-body-font-size,
              var(--ddd-theme-haxcms-font-size)
            );
            font-weight: var(--ddd-font-primary-regular);
            border-radius: var(--ddd-radius-xs);
          }
          div[slot="citation"]{
             font-size: var(--ddd-font-size-4xs);
          }
          *::selection {
            background-color: var(--ddd-theme-polaris-linkLight);
          }

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

          .ls-16-sm {
            letter-spacing: var(--ddd-ls-16-sm);
          }
          .ls-18-sm {
            letter-spacing: var(--ddd-ls-18-sm);
          }
          .ls-20-sm {
            letter-spacing: var(--ddd-ls-20-sm);
          }
          .ls-22-sm {
            letter-spacing: var(--ddd-ls-22-sm);
          }
          .ls-24-sm {
            letter-spacing: var(--ddd-ls-24-sm);
          }
          .ls-28-sm {
            letter-spacing: var(--ddd-ls-28-sm);
          }
          .ls-32-sm {
            letter-spacing: var(--ddd-ls-32-sm);
          }
          .ls-36-sm {
            letter-spacing: var(--ddd-ls-36-sm);
          }
          .ls-40-sm {
            letter-spacing: var(--ddd-ls-40-sm);
          }
          .ls-48-sm {
            letter-spacing: var(--ddd-ls-48-sm);
          }
          .ls-56-sm {
            letter-spacing: var(--ddd-ls-56-sm);
          }
          .ls-64-sm {
            letter-spacing: var(--ddd-ls-64-sm);
          }
          .ls-72-sm {
            letter-spacing: var(--ddd-ls-72-sm);
          }
          .ls-16-lg {
            letter-spacing: var(--ddd-ls-16-lg);
          }
          .ls-18-lg {
            letter-spacing: var(--ddd-ls-18-lg);
          }
          .ls-20-lg {
            letter-spacing: var(--ddd-ls-20-lg);
          }
          .ls-22-lg {
            letter-spacing: var(--ddd-ls-22-lg);
          }
          .ls-24-lg {
            letter-spacing: var(--ddd-ls-24-lg);
          }
          .ls-28-lg {
            letter-spacing: var(--ddd-ls-28-lg);
          }
          .ls-32-lg {
            letter-spacing: var(--ddd-ls-32-lg);
          }
          .ls-36-lg {
            letter-spacing: var(--ddd-ls-36-lg);
          }
          .ls-40-lg {
            letter-spacing: var(--ddd-ls-40-lg);
          }
          .ls-48-lg {
            letter-spacing: var(--ddd-ls-48-lg);
          }
          .ls-56-lg {
            letter-spacing: var(--ddd-ls-56-lg);
          }
          .ls-64-lg {
            letter-spacing: var(--ddd-ls-64-lg);
          }
          .ls-72-lg {
            letter-spacing: var(--ddd-ls-72-lg);
          }

          .lh-120 {
            line-height: var(--ddd-lh-120);
          }
          .lh-140 {
            line-height: var(--ddd-lh-140);
          }
          .lh-150 {
            line-height: var(--ddd-lh-150);
          }
          .lh-auto {
            line-height: normal;
          }

          .bs-0 {
            box-shadow: none;
          }
          .bs-xs {
            box-shadow: var(--ddd-boxShadow-xs);
          }
          .bs-sm {
            box-shadow: var(--ddd-boxShadow-sm);
          }
          .bs-md {
            box-shadow: var(--ddd-boxShadow-md);
          }
          .bs-lg {
            box-shadow: var(--ddd-boxShadow-lg);
          }

          .textShadow-0 {
            text-shadow: none;
          }
          .textshadow-1 {
            text-shadow: var(--ddd-textShadow-xs);
          }
          .textShadow-2 {
            text-shadow: var(--ddd-textShadow-sm);
          }
          .textShadow-3 {
            text-shadow: var(--ddd-textShadow-md);
          }
          .textShadow-4 {
            text-shadow: var(--ddd-textShadow-lg);
          }

          .r-0 {
            border-radius: var(--ddd-radius-0);
          }
          .r-xs {
            border-radius: var(--ddd-radius-xs);
          }
          .r-sm {
            border-radius: var(--ddd-radius-sm);
          }
          .r-md {
            border-radius: var(--ddd-radius-md);
          }
          .r-lg {
            border-radius: var(--ddd-radius-lg);
          }
          .r-xl {
            border-radius: var(--ddd-radius-xl);
          }
          .r-rounded {
            border-radius: var(--ddd-radius-rounded);
          }
          .r-circle {
            border-radius: var(--ddd-radius-circle);
          }

          .bg-transparent {
            background-color: transparent;
          }
          .bg-white {
            background-color: var(--ddd-theme-polaris-white);
          }
          .bg-gradient-navBar {
            background: var(--ddd-theme-polaris-gradient-navBar);
          }
          .bg-gradient-footer {
            background: var(--ddd-theme-polaris-gradient-footer);
          }
          .bg-gradient-newsFeature {
            background: var(--ddd-theme-polaris-gradient-newsFeature);
          }
          .bg-gradient-buttons {
            background: var(--ddd-theme-polaris-gradient-buttons);
          }
          .bg-gradient-hero {
            background: var(--ddd-theme-polaris-gradient-hero);
          }
          .bg-gradient-hero2 {
            background: var(--ddd-theme-polaris-gradient-hero2);
          }

          select{
            display: flex;
            box-sizing: border-box;
            transition: all 0.2s ease 0s;
            cursor: pointer;
            color: var(--ddd-theme-polaris-coalyGray);
            width: fit-content;
            border: var(--ddd-border-xs);
            background-color: var(--ddd-theme-polaris-white);
            font-family: var(--ddd-font-primary);
            font-weight: var(--ddd-font-primary-regular);
            font-size: var(--ddd-theme-body-font-size);
            line-height: 150%;
            letter-spacing: normal;
            padding: var(--ddd-spacing-2);
            border-radius: var(--ddd-radius-xs);
            border-color: var(--ddd-theme-polaris-potential50);
          }
        `,
      ];
    }
  };
};

// autoloads fonts and gives it a tag name; this is useful
class DDD extends DDDSuper(LitElement) {
  constructor() {
    super();
    this.loadDDDFonts(DDDFonts);
  }
  static get tag() {
    return "d-d-d";
  }
}

customElements.define(DDD.tag, DDD);
export { DDD };

/**
 * Checks to see if there is an instance available, and if not appends one.
 * then it injects the styles into the global document scope so that they can be used anywhere
 */
globalThis.DDDSharedStyles = globalThis.DDDSharedStyles || {};
globalThis.DDDSharedStyles.requestAvailability = () => {
  if (globalThis.DDDSharedStyles.instance == null && globalThis.document) {
    // convert css into text content of arrays mashed together
    // this way we can inject it into a global style sheet
    let globalStyles = DDD.styles.map((st) => st.cssText).join("");
    globalThis.DDDSharedStyles.instance =
      globalThis.document.createElement("style");
    // marker for debugging to make it easier to find
    globalThis.DDDSharedStyles.instance.setAttribute(
      "data-ddd",
      "global-styles",
    );
    globalThis.DDDSharedStyles.instance.innerHTML = `${globalStyles}`;
    globalThis.document.head.appendChild(globalThis.DDDSharedStyles.instance);
  }
  return globalThis.DDDSharedStyles.instance;
};
// self-appending on call
export const DDDSharedStylesGlobal =
  globalThis.DDDSharedStyles.requestAvailability();
