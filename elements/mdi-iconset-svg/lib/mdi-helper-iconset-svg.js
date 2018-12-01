/**
 * Material design: [Icons](https://material.io/guidelines/style/icons.html)
 * `mdi-helper-iconset-svg` is a iconset for the Material Design Icons collection with the "helper" tag
 *
 * Example:
 *   <iron-icon icon="mdi-helper:color-helper"></iron-icon>
 *
 * @demo demo/index.html
 */
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";

import { html } from "@polymer/polymer/lib/utils/html-tag.js";

const template = html`
  <iron-iconset-svg name="mdi-helper" size="24">
    <svg>
      <g id="color-helper"><path d="M0,24H24V20H0V24Z"></path></g>
    </svg>
  </iron-iconset-svg>
`;

document.head.appendChild(template.content);
