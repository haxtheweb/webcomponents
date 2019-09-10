/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `editable-table-iconset`
 * `An icon set of sort and filter icons specifically for editable-table.`
 *
 * Example:
 *   <script>import "@lrnwebcomponents/hax-iconset/editable-table-iconset.js";</script>
 *   <iron-icon icon="editable-table:filter"></iron-icon>
 *
 * @polymer
 * @pseudoElement editable-table-iconset
 * @demo demo/display.html
 */
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";

import { html } from "@polymer/polymer/lib/utils/html-tag.js";

const template = html`
  <iron-iconset-svg size="24" name="editable-table">
    <!-- filter -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="filter">
          <path d="M5,7l7,7,7-7Z"></path>
          <rect x="11" y="13" width="2" height="4"></rect>
        </g>
      </defs>
    </svg>
    <!-- filter off -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="filter-off">
          <polygon
            points="19.26 6.95 10.7 6.95 14.98 11.23 19.26 6.95"
          ></polygon>
          <polygon
            points="5 4.92 7.03 6.95 5.26 6.95 11.26 12.95 11.26 16.95 13.26 16.95 13.26 13.18 17.57 17.49 18.49 16.57 5.92 4 5 4.92"
          ></polygon>
        </g>
      </defs>
    </svg>
    <!-- sortable -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="sortable">
          <path d="M7,13l5,5l5-5H7z M17,11l-5-5l-5,5H17z"></path>
        </g>
      </defs>
    </svg>
  </iron-iconset-svg>
`;

document.head.appendChild(template.content);
