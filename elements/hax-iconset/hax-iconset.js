/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `hax-iconset` is a iconset for HAX
 *
 * Example:
 *   <script>import "@lrnwebcomponents/hax-iconset/hax-iconset.js";</script>
 *   <iron-icon icon="hax:vocab"></iron-icon>
 *
 * @pseudoElement hax-iconset
 * @demo demo/index.html
 */
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";

import { html } from "@polymer/polymer/lib/utils/html-tag.js";

const template = html`
  <iron-iconset-svg size="24" name="hax">
    <!-- paragraph -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="paragraph">
        <path d="M8.48,14.31V22h3.08V5.08h3.08V22h3.08V5.08h3.08V2H8.48c-3.4,0-6.15,2.75-6.15,6.15S5.08,14.31,8.48,14.31z M20.78,20.46">
        </g>
      </defs>
    </svg>
    <!-- vocab -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="vocab">
          <polygon points="5.25,13.12 8.29,13.12 6.77,9.06 	"/>
          <path d="M20.5,4.45c-1.07-0.32-2.19-0.48-3.3-0.47C15.36,3.9,13.54,4.39,12,5.4c-1.54-1-3.36-1.5-5.19-1.42
            C4.97,3.9,3.16,4.39,1.62,5.4v13.83c0.02,0.25,0.22,0.45,0.47,0.47c0.09,0,0.14,0,0.24,0c1.41-0.66,2.93-1.03,4.48-1.09
            c1.84-0.08,3.65,0.41,5.19,1.42c1.59-0.88,3.37-1.37,5.19-1.42c1.55-0.04,3.09,0.3,4.48,0.99c0.07,0.04,0.15,0.05,0.24,0.05
            c0.25-0.02,0.45-0.22,0.47-0.47V5.4C21.81,4.98,21.17,4.66,20.5,4.45z M9.5,16.33l-0.72-1.89H4.77l-0.72,1.89H2.61l3.53-9h1.28
            l3.52,9H9.5z M20.5,17.2c-1.07-0.32-2.18-0.48-3.3-0.47c-1.82,0.05-3.6,0.53-5.19,1.42V7.28c1.59-0.88,3.37-1.37,5.19-1.42
            c1.12-0.01,2.23,0.15,3.3,0.47V17.2z"/>
          <polygon points="19.66,7.34 13.14,7.34 13.14,8.6 17.76,8.6 13.11,15.32 13.11,16.33 19.81,16.33 19.81,15.08 15,15.08 19.66,8.33 
              "/>
        </g>
      </defs>
    </svg>
    <!-- math -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="math">
          <polygon points="11,5.5 7.5,5.5 7.5,2 5.5,2 5.5,5.5 2,5.5 2,7.5 5.5,7.5 5.5,11 7.5,11 7.5,7.5 11,7.5 "/>
          <rect x="13" y="5.5" width="9" height="1.99"/>
          <polygon points="11.02,14.39 9.61,12.98 6.5,16.09 3.41,13 2,14.41 5.09,17.5 1.97,20.62 3.38,22.03 6.5,18.91 9.61,22.02 
            11.02,20.61 7.91,17.5 "/>
          <rect x="13" y="16.5" width="9" height="1.99"/>
          <rect x="16.5" y="13" width="1.99" height="1.99"/>
          <rect x="16.5" y="20.01" width="1.99" height="1.99"/>
        </g>
      </defs>
    </svg>
    <!-- pi -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="pi">
          <path d="M8.8,6.89C7.96,6.96,7.17,6.96,6.41,7.1C5.33,7.31,4.71,8.16,4.15,9.04C3.95,9.34,3.76,9.52,3.36,9.38
            C3.78,7.86,4.34,6.43,5.48,5.3c0.53-0.53,1.19-0.74,1.91-0.81c0.62-0.06,1.25-0.1,1.88-0.1c3.49-0.01,6.99,0,10.48,0
            c0.15,0,0.31,0,0.49,0c0,0.85,0,1.67,0,2.55c-1.29,0-2.6,0-3.94,0c-0.09,1.28-0.18,2.51-0.25,3.74c-0.08,1.45-0.15,2.91-0.19,4.36
            c-0.01,0.55,0.07,1.11,0.17,1.65c0.15,0.82,0.66,1.27,1.46,1.37c0.81,0.1,1.49-0.23,1.84-0.93c0.17-0.35,0.27-0.73,0.41-1.12
            c0.14,0,0.31,0,0.5,0c-0.14,1.15-0.37,2.24-0.96,3.21c-0.8,1.34-2.24,1.89-3.83,1.49c-1.41-0.36-2.31-1.54-2.32-3.23
            c-0.01-1.36,0.11-2.72,0.21-4.07c0.17-2.13,0.38-4.25,0.58-6.41c-1.21,0-2.4,0-3.63,0c-0.1,1.36-0.18,2.72-0.3,4.07
            c-0.21,2.52-0.42,5.05-1.12,7.49c-0.13,0.47-0.31,0.94-0.56,1.35c-0.62,1.01-1.98,1.24-2.93,0.54c-0.55-0.41-0.81-1.07-0.57-1.72
            c0.18-0.48,0.41-0.97,0.72-1.37c1.93-2.46,2.78-5.31,3.05-8.38C8.66,8.32,8.72,7.67,8.8,6.89z"/>
        </g>
      </defs>
    </svg>
    <!-- oerschema -->
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
      <defs>
        <g id="oerschema">
          <path d="M14.42,14.68c0,0.74,0,1.46,0,2.18c-1.1,0.03-2.53-0.38-3.75-1.74c-0.83,0.95-1.87,1.54-3.13,1.71
            c-1.4,0.19-2.65-0.18-3.73-1.07c-2.32-1.91-2.28-5.15-0.51-7.08c1.84-2,5.19-2.27,7.38,0.18c1-1.12,2.24-1.75,3.76-1.75
            c1.52,0,2.76,0.63,3.77,1.76c0.98-1.13,2.22-1.74,3.76-1.77c0,0.75,0,1.47,0,2.14c-0.44,0.15-0.89,0.24-1.28,0.45
            c-0.75,0.4-1.24,1.05-1.31,1.9c-0.07,0.91-0.05,1.84-0.06,2.75c0,0.1,0,0.19,0,0.3c-0.74,0-1.46,0-2.22,0c0-0.5,0-1.01,0-1.53
            c-1.26,0-2.49,0-3.74,0c0-0.76,0-1.49,0-2.25c1.15,0,2.3,0,3.46,0c-0.36-0.95-1.48-1.63-2.56-1.53c-1.38,0.13-2.28,1.11-2.44,2.27
            C11.64,12.87,12.43,14.56,14.42,14.68z M9.55,12.01c0.04-1.42-1.13-2.66-2.62-2.67c-1.5,0-2.65,1.17-2.66,2.6
            c-0.02,1.59,1.2,2.71,2.66,2.71C8.4,14.65,9.57,13.47,9.55,12.01z"/>
        </g>
      </defs>
    </svg>
    <!-- basic layout bar icons -->
    <svg>
        <g id="12" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="24" height="100%"></rect>
        </g>  
        <g id="8/4" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="16" height="100%"></rect>
          <rect x="18" y="0" width="6" height="100%"></rect>
        </g>
        <g id="6/6" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="11" height="100%"></rect>
          <rect x="12" y="0" width="11" height="100%"></rect>
        </g>
        <g id="4/8" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="6" height="100%"></rect>
          <rect x="8" y="0" width="16" height="100%"></rect>
        </g>
        <g id="4/4/4" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="7" height="100%"></rect>
          <rect x="8" y="0" width="7" height="100%"></rect>
          <rect x="16" y="0" width="7" height="100%"></rect>
        </g>
        <g id="3/3/3/3" style="fill:#CCCCCC;" height="20">
          <rect x="0" y="0" width="5" height="100%"></rect>
          <rect x="6" y="0" width="5" height="100%"></rect>
          <rect x="12" y="0" width="5" height="100%"></rect>
          <rect x="18" y="0" width="5" height="100%"></rect>
        </g>
    </svg>
  </iron-iconset-svg>
  
`;

document.head.appendChild(template.content);
