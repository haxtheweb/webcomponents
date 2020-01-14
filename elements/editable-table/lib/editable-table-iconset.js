/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `editable-table-iconset`
 * @customElement editable-table-iconset
 * `An icon set of sort and filter icons specifically for editable-table.`
 *
 * Example:
 *   <script>import "@lrnwebcomponents/hax-iconset/editable-table-iconset.js";</script>
 *   <iron-icon icon="editable-table:filter"></iron-icon>
 *
 * @polymer
 * @pseudoElement editable-table-iconset
 * @demo ./demo/display.html
 */
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";

import { html } from "@polymer/polymer/lib/utils/html-tag.js";

const template = html`
  <iron-iconset-svg size="24" name="editable-table">
    <!-- column headers -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="column-headers">
          <rect style="opacity: 0.7" x="3" y="3" width="18" height="6" />
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"
          />
        </g>
      </defs>
    </svg>
    <!-- row-headers -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="row-headers">
          <rect style="opacity: 0.7" x="3" y="3" width="6" height="18" />
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"
          />
        </g>
      </defs>
    </svg>
    <!-- row-striped -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="row-striped">
          <rect style="opacity: 0.4" x="3" y="3" width="18" height="6" />
          <rect style="opacity: 0.4" x="3" y="15" width="18" height="6" />
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"
          />
        </g>
      </defs>
    </svg>
    <!-- footer -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="footer">
          <rect style="opacity: 0.7" x="3" y="15" width="18" height="6" />
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"
          />
        </g>
      </defs>
    </svg>
    <!-- filter -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="filter">
          <path d="M5,7l7,7,7-7Z"></path>
          <rect x="11" y="13" width="2" height="4"></rect>
        </g>
      </defs>
    </svg>
    <!-- row-condensed -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="row-condensed">
          <path
            d="M20,2H4A2,2,0,0,0,2,4V20a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V4A2,2,0,0,0,20,2ZM8,20H4V17.5H8Zm0-4.5H4V13H8ZM8,11H4V8.74H8ZM8,6.5H4V4H8ZM14,20H10V17.5h4Zm0-4.5H10V13h4ZM14,11H10V8.74h4Zm0-4.5H10V4h4ZM20,20H16V17.5h4Zm0-4.5H16V13h4ZM20,11H16V8.5h4Zm0-4.5H16V4h4Z"
          />
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
