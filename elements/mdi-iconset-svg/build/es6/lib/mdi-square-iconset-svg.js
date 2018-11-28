import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js";
import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
const template = html`<iron-iconset-svg name="mdi-square" size="24">
  <svg>

    <g id="houzz-box">
      <path d="M12,4L7.41,6.69V12L12,9.3V4M12,9.3V14.7L12,20L16.59,17.31V12L16.59,6.6L12,9.3M12,14.7L7.41,12V17.4L12,14.7M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3Z"></path>
    </g>

    <g id="rss-box">
      <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M7.5,15A1.5,1.5 0 0,0 6,16.5A1.5,1.5 0 0,0 7.5,18A1.5,1.5 0 0,0 9,16.5A1.5,1.5 0 0,0 7.5,15M6,10V12A6,6 0 0,1 12,18H14A8,8 0 0,0 6,10M6,6V8A10,10 0 0,1 16,18H18A12,12 0 0,0 6,6Z"></path>
    </g>

  </svg>
</iron-iconset-svg>`;
document.head.appendChild(template.content);
