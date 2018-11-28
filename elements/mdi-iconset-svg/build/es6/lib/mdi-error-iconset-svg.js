import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js";
import { html } from "../node_modules/@polymer/polymer/lib/utils/html-tag.js";
const template = html`<iron-iconset-svg name="mdi-error" size="24">
  <svg>

    <g id="alert">
      <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"></path>
    </g>

  </svg>
</iron-iconset-svg>`;
document.head.appendChild(template.content);
