/**
 * Material design: [Icons](https://material.io/guidelines/style/icons.html)
 * `mdi-currency-iconset-svg` is a iconset for the Material Design Icons collection with the "currency" tag
 *
 * Example:
 *   <iron-icon icon="mdi-currency:currency-usd"></iron-icon>
 *
 * @demo demo/index.html
 */
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";

import { html } from "@polymer/polymer/lib/utils/html-tag.js";

const template = html`<iron-iconset-svg name="mdi-currency" size="24">
  <svg>

    <g id="currency-btc">
      <path d="M4.5,5H8V2H10V5H11.5V2H13.5V5C19,5 19,11 16,11.25C20,11 21,19 13.5,19V22H11.5V19H10V22H8V19H4.5L5,17H6A1,1 0 0,0 7,16V8A1,1 0 0,0 6,7H4.5V5M10,7V11C10,11 14.5,11.25 14.5,9C14.5,6.75 10,7 10,7M10,12.5V17C10,17 15.5,17 15.5,14.75C15.5,12.5 10,12.5 10,12.5Z"></path>
    </g>

    <g id="currency-eur">
      <path d="M7.07,11L7,12L7.07,13H17.35L16.5,15H7.67C8.8,17.36 11.21,19 14,19C16.23,19 18.22,17.96 19.5,16.33V19.12C18,20.3 16.07,21 14,21C10.08,21 6.75,18.5 5.5,15H2L3,13H5.05L5,12L5.05,11H2L3,9H5.5C6.75,5.5 10.08,3 14,3C16.5,3 18.8,4.04 20.43,5.71L19.57,7.75C18.29,6.08 16.27,5 14,5C11.21,5 8.8,6.64 7.67,9H19.04L18.19,11H7.07Z"></path>
    </g>

    <g id="currency-gbp">
      <path d="M6.5,21V19.75C7.44,19.29 8.24,18.57 8.81,17.7C9.38,16.83 9.67,15.85 9.68,14.75L9.66,13.77L9.57,13H7V11H9.4C9.25,10.17 9.16,9.31 9.13,8.25C9.16,6.61 9.64,5.33 10.58,4.41C11.5,3.5 12.77,3 14.32,3C15.03,3 15.64,3.07 16.13,3.2C16.63,3.32 17,3.47 17.31,3.65L16.76,5.39C16.5,5.25 16.19,5.12 15.79,5C15.38,4.9 14.89,4.85 14.32,4.84C13.25,4.86 12.5,5.19 12,5.83C11.5,6.46 11.29,7.28 11.3,8.28L11.4,9.77L11.6,11H15.5V13H11.79C11.88,14 11.84,15 11.65,15.96C11.35,17.16 10.74,18.18 9.83,19H18V21H6.5Z"></path>
    </g>

    <g id="currency-usd">
      <path d="M11.8,10.9C9.53,10.31 8.8,9.7 8.8,8.75C8.8,7.66 9.81,6.9 11.5,6.9C13.28,6.9 13.94,7.75 14,9H16.21C16.14,7.28 15.09,5.7 13,5.19V3H10V5.16C8.06,5.58 6.5,6.84 6.5,8.77C6.5,11.08 8.41,12.23 11.2,12.9C13.7,13.5 14.2,14.38 14.2,15.31C14.2,16 13.71,17.1 11.5,17.1C9.44,17.1 8.63,16.18 8.5,15H6.32C6.44,17.19 8.08,18.42 10,18.83V21H13V18.85C14.95,18.5 16.5,17.35 16.5,15.3C16.5,12.46 14.07,11.5 11.8,10.9Z"></path>
    </g>

  </svg>
</iron-iconset-svg>`;

document.head.appendChild(template.content);
