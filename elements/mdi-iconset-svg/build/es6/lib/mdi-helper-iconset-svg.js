import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js";
import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
const template = html`<iron-iconset-svg name="mdi-helper" size="24">
  <svg>

    <g id="color-helper">
      <path d="M0,24H24V20H0V24Z"></path>
    </g>

  </svg>
</iron-iconset-svg>`;
document.head.appendChild(template.content);
