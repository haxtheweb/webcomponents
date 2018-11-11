import {
  html,
  PolymerElement
} from "./node_modules/@polymer/polymer/polymer-element.js";
import "./node_modules/@polymer/iron-icon/iron-icon.js";
import "./node_modules/@polymer/marked-element/marked-element.js";
export { IconsetDemo };
class IconsetDemo extends PolymerElement {
  static get template() {
    return html`
<style>:host {
  display: block;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
}
:host .demo-container {
  padding: 20px 40px;
}
:host .demo-container .iconset:not(:first-of-type) {
  border-top: 1px solid #ddd;
}
:host ul {
  list-style-type: none;
  padding: 0;
}
:host li {
  display: inline-block;
  width: 160px;
  margin: 16px 8px;
  text-align: center;
}
:host iron-icon {
  font-size: 14px;
  color: rgb(97,97,97);
  display: inline-block;
}
:host .iconset:nth-of-type(9n+2) iron-icon {
  color: #BE3300;
}
:host .iconset:nth-of-type(9n+3) iron-icon {
  color: #0000B5;
}
:host .iconset:nth-of-type(9n+4) iron-icon {
  color: #750075;
}
:host .iconset:nth-of-type(9n+5) iron-icon {
  color: #AA5D00;
}
:host .iconset:nth-of-type(9n+6) iron-icon {
  color: #DB0A5B;
}
:host .iconset:nth-of-type(9n+7) iron-icon {
  color: #005500;
}
:host .iconset:nth-of-type(9n+8) iron-icon {
  color: #CF000F;
}
:host .iconset:nth-of-type(9n) iron-icon {
  color: #005f8b;
}
:host #icon-text {
  margin-top: 8px;
  font-size: 10px;
  color: black;
  text-align: center;
}
:host .code-container {
  margin: 0;
  background-color: var(--google-grey-100,#f5f5f5);
  border-top: 1px solid #e0e0e0;
}
:host code {
  padding: 20px 40px;
  display: block;
  margin: 0;
  font-size: 13px;
}
:host .tag {
  color: #905;
}
:host .attr-name {
  color: #690;
}
:host .attr-value {
  color: #07a;
}</style>
<div class="demo-container">
    <template is="dom-repeat" items="[[items]]" as="iconset">
        <div class="iconset">
            <p><strong>[[iconset.name]]</strong></p>
            <ul>
                <template is="dom-repeat" items="[[iconset.icons]]" as="icon">
                    <li>
                    <div id="icon">
                        <iron-icon icon\$="[[iconset.prefix]][[icon]]"></iron-icon>
                        <div id="icon-text">[[iconset.prefix]][[icon]]</div>
                    </div>
                    </li>
                </template>
            </ul>
        </div>
    </template>
</div>
<div class="code-container">
    <code><span class="tag">&lt;iron-icon</span> <span class="attr-name">icon="<strong><em><span class="attr-value">optional_iconset_name:icon_name</span></em></strong>"</span><span class="tag">&gt;&lt;/iron-icon&gt;</span></code>
</div>`;
  }
  static get properties() {
    return {
      items: {
        name: "items",
        type: "Array",
        value: [],
        reflectToAttribute: !1,
        observer: !1
      }
    };
  }
  static get tag() {
    return "iconset-demo";
  }
  connectedCallback() {
    this._getIconsFromNodeList();
    super.connectedCallback();
  }
  _getIconsFromNodeList() {
    let set = document.head.querySelectorAll("iron-iconset-svg");
    this.set("items", []);
    for (let i = 0; i < set.length; i++) {
      let setName = set[i].getAttribute("name"),
        g = set[i].querySelectorAll("svg > defs > g, svg > g"),
        icons = [];
      for (let j = 0; j < g.length; j++) {
        icons.push(g[j].getAttribute("id"));
      }
      this.push("items", {
        name: setName !== void 0 && null !== setName ? setName + " " : "Icons",
        prefix: setName !== void 0 && null !== setName ? setName + ":" : "",
        icons: icons
      });
    }
  }
}
window.customElements.define(IconsetDemo.tag, IconsetDemo);
