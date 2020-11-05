/**
 * Material design: [Icons](https://material.io/guidelines/style/icons.html)
 * `mdi-auth-iconset-svg`
 * @element mdi-auth-iconset-svg is a iconset for the Material Design Icons collection with the "authentication" tag
 *
 * Example:
 *   <simple-icon icon="mdi-auth:login"></simple-icon>
 *
 * @demo demo/index.html
 */
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";

import { html } from "@polymer/polymer/lib/utils/html-tag.js";

const template = html`
  <iron-iconset-svg name="mdi-auth" size="24">
    <svg>
      <g id="login">
        <path
          d="M10,17.25V14H3V10H10V6.75L15.25,12L10,17.25M8,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H8A2,2 0 0,1 6,20V16H8V20H17V4H8V8H6V4A2,2 0 0,1 8,2Z"
        ></path>
      </g>
    </svg>
  </iron-iconset-svg>
`;

document.head.appendChild(template.content);
