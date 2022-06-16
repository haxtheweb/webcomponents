import { LitElement, css, html } from "lit";
import { MicroFrontendRegistry } from "../micro-frontend-registry.js";
import { enableServices } from '../lib/microServices.js';
import "@lrnwebcomponents/simple-img/simple-img.js";

export class MfHtmlExample extends LitElement {
  static get tag() {
    return "mf-htmlmd-example";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .wrap {
          display: flex;
          border: 2px solid black;
        }
      `,
    ];
  }
  constructor() {
    super();
    // enable these services
    enableServices(['haxcms', 'experimental', 'core']);
  }

  render() {
    return html` <div>
        <label for="src">source url</label>
        <input
          type="text"
          id="src"
          value="https://ftw.usatoday.com/wp-content/uploads/sites/90/2017/05/spongebob.jpg?w=1000&h=600&crop=1"
          size="100"
        />
        <label for="height">height</label>
        <input type="number" id="height" value="200" min="10" max="1000" />
        <label for="width">width</label>
        <input type="number" id="width" value="300" min="10" max="1000" />
        <label for="quality">quality</label>
        <input
          type="range"
          id="quality"
          value="80"
          min="5"
          max="100"
          step="5"
        />
      </div>
      <simple-img></simple-img>
      <div>
        <label>Duck duck go</label>
        <input type="text" id="search" />
        <button id="searchbtn">Search</button>
      </div>
      <div>
        <label>URL of HAXcms site</label>
        <input type="url" id="haxcmsurl" />
        <button id="haxcms">HTML entire site</button>
        <button id="epub">EPUB entire site</button>
        <div id="haxcmssite"></div>
      </div>
      <div class="wrap">
        <div>
          MD
          <textarea id="md" cols="50" rows="25"></textarea>
        </div>
        <div style="text-align:center;width:200px;margin-top:100px;">
          <div>
            <button id="mdtohtml">--&gt;</button>
          </div>
          <div>
            <button id="htmltomd">&lt;--</button>
          </div>
          <div>
            <label>Treat as link</label><input type="checkbox" id="link" />
          </div>
          <div>
            <button id="hydrate">--&gt; Hydrate SSRs</button>
          </div>
        </div>
        <div>
          HTML
          <textarea id="html" cols="50" rows="25"></textarea>
        </div>
      </div>`;
  }

  htmlToMdCallback(data) {
    this.shadowRoot.querySelector("#md").value = data.data;
  }
  mdToHtmlCallback(data) {
    this.shadowRoot.querySelector("#html").value = data.data;
  }
  hydrateCallback(data) {
    this.shadowRoot.querySelector("#haxcmssite").innerHTML = data.data;
  }
  haxcmsCallback(data) {
    this.shadowRoot.querySelector("#haxcmssite").innerHTML = data.data;
  }
  haxcmsepubCallback(data) {
    console.log(data);
    // fake download
  }
  ddgCallback(data) {
    console.log(data);
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot.querySelector("#mdtohtml").addEventListener("click", () => {
      const params = {
        md: this.shadowRoot.querySelector("#md").value,
        type: this.shadowRoot.querySelector("#link").checked ? "link" : "",
      };
      MicroFrontendRegistry.call(
        "@core/mdToHtml",
        params,
        this.mdToHtmlCallback.bind(this)
      );
    });
    this.shadowRoot.querySelector("#htmltomd").addEventListener("click", () => {
      const params = {
        html: this.shadowRoot.querySelector("#html").value,
        type: this.shadowRoot.querySelector("#link").checked ? "link" : "",
      };
      MicroFrontendRegistry.call(
        "@core/htmlToMd",
        params,
        this.htmlToMdCallback.bind(this)
      );
    });
    this.shadowRoot.querySelector("#hydrate").addEventListener("click", () => {
      const params = {
        html: this.shadowRoot.querySelector("#html").value,
        type: this.shadowRoot.querySelector("#link").checked ? "link" : "",
      };
      MicroFrontendRegistry.call(
        "@experiments/hydrateSsr",
        params,
        this.hydrateCallback.bind(this)
      );
    });
    this.shadowRoot.querySelector("#haxcms").addEventListener("click", () => {
      const params = {
        url: this.shadowRoot.querySelector("#haxcmsurl").value,
      };
      MicroFrontendRegistry.call(
        "@haxcms/siteToHtml",
        params,
        this.haxcmsCallback.bind(this)
      );
    });
    this.shadowRoot.querySelector("#epub").addEventListener("click", () => {
      const params = {
        url: this.shadowRoot.querySelector("#haxcmsurl").value,
      };
      MicroFrontendRegistry.call(
        "@haxcms/siteToEpub",
        params,
        this.haxcmsepubCallback.bind(this)
      );
    });
    this.shadowRoot
      .querySelector("#searchbtn")
      .addEventListener("click", () => {
        const params = {
          q: this.shadowRoot.querySelector("#search").value,
        };
        MicroFrontendRegistry.call("@core/duckDuckGo", params, this.ddgCallback.bind(this));
      });
    ["src", "width", "height", "quality"].forEach((key) => {
      this.shadowRoot.querySelector(`#${key}`).addEventListener("input", () => {
        this.shadowRoot.querySelector("simple-img")[key] =
          this.shadowRoot.querySelector(`#${key}`).value;
      });
    });
  }
}

customElements.define(MfHtmlExample.tag, MfHtmlExample);
