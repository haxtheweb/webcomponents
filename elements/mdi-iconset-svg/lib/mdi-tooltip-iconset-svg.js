/**
 * Material design: [Icons](https://material.io/guidelines/style/icons.html)
 * `mdi-tooltip-iconset-svg` is a iconset for the Material Design Icons collection with the "tooltip" tag
 *
 * Example:
 *   <iron-icon icon="mdi-tooltip:tooltip-outline"></iron-icon>
 *
 * @demo demo/index.html
 */
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";

import { html } from "@polymer/polymer/lib/utils/html-tag.js";

const template = html`
  <iron-iconset-svg name="mdi-tooltip" size="24">
    <svg>
      <g id="tooltip">
        <path
          d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2Z"
        ></path>
      </g>

      <g id="tooltip-edit">
        <path
          d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M18,14V12H12.5L10.5,14H18M6,14H8.5L15.35,7.12C15.55,6.93 15.55,6.61 15.35,6.41L13.59,4.65C13.39,4.45 13.07,4.45 12.88,4.65L6,11.53V14Z"
        ></path>
      </g>

      <g id="tooltip-image">
        <path
          d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M19,15V7L15,11L13,9L7,15H19M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5Z"
        ></path>
      </g>

      <g id="tooltip-outline">
        <path
          d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M4,4V16H8.83L12,19.17L15.17,16H20V4H4Z"
        ></path>
      </g>

      <g id="tooltip-text">
        <path
          d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M5,5V7H19V5H5M5,9V11H15V9H5M5,13V15H17V13H5Z"
        ></path>
      </g>
    </svg>
  </iron-iconset-svg>
`;

document.head.appendChild(template.content);
