/**
 * Material design: [Icons](https://material.io/guidelines/style/icons.html)
 * `mdi-filter-iconset-svg`
 * @customElement mdi-filter-iconset-svg is a iconset for the Material Design Icons collection with the "filter" tag
 *
 * Example:
 *   <iron-icon icon="mdi-filter:filter"></iron-icon>
 *
 * @demo demo/index.html
 */
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";

import { html } from "@polymer/polymer/lib/utils/html-tag.js";

const template = html`
  <iron-iconset-svg name="mdi-filter" size="24">
    <svg>
      <g id="filter">
        <path
          d="M3,2H21V2H21V4H20.92L14,10.92V22.91L10,18.91V10.91L3.09,4H3V2Z"
        ></path>
      </g>

      <g id="filter-remove">
        <path
          d="M14.76,20.83L17.6,18L14.76,15.17L16.17,13.76L19,16.57L21.83,13.76L23.24,15.17L20.43,18L23.24,20.83L21.83,22.24L19,19.4L16.17,22.24L14.76,20.83M2,2H20V2H20V4H19.92L13,10.92V22.91L9,18.91V10.91L2.09,4H2V2Z"
        ></path>
      </g>

      <g id="filter-remove-outline">
        <path
          d="M14.73,20.83L17.58,18L14.73,15.17L16.15,13.76L19,16.57L21.8,13.76L23.22,15.17L20.41,18L23.22,20.83L21.8,22.24L19,19.4L16.15,22.24L14.73,20.83M2,2H20V2H20V4H19.92L14,9.92V22.91L8,16.91V9.91L2.09,4H2V2M10,16.08L12,18.08V9H12.09L17.09,4H4.92L9.92,9H10V16.08Z"
        ></path>
      </g>
    </svg>
  </iron-iconset-svg>
`;

document.head.appendChild(template.content);
