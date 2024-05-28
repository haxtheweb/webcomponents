import { LitElement, css, html } from "lit";
import { MicroFrontendRegistry } from "../micro-frontend-registry.js";
import { enableServices } from "../lib/microServices.js";
import "@haxtheweb/simple-img/simple-img.js";

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
    this.img = false;
    this.ddg = false;
    this.haxcms = false;
    this.mdhtml = false;
    // enable these services
    enableServices(["haxcms", "experimental", "core"]);
  }

  static get properties() {
    return {
      img: { type: Boolean },
      ddg: { type: Boolean },
      haxcms: { type: Boolean },
      mdhtml: { type: Boolean },
    };
  }

  render() {
    return html`${this.img
      ? html`<div>
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
          <simple-img></simple-img>`
      : ``}
    ${this.ddg
      ? html`<div>
          <label>Duck duck go</label>
          <input type="text" id="search" />
          <button id="searchbtn">Search</button>
          <div id="ddgresult"></div>
        </div>`
      : ``}
    ${this.haxcms
      ? html`
          <div>
            <label style="display:block;">URL of HAXcms site</label>
            <input type="url" id="haxcmsurl" />
            <label style="display:block;">Parent ID</label>
            <input type="text" id="haxcmsparentid" />
            <label style="display:block;">magic</label>
            <input type="text" id="haxcmsmagic" />
            <label style="display:block;">base URL</label>
            <input type="text" id="haxcmsbase" />
            <button id="haxcms">HTML entire site</button>
            <button id="epub">EPUB entire site</button>
            <div id="haxcmssite"></div>
          </div>
        `
      : ``}
    ${this.mdhtml
      ? html` <div class="wrap">
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
        </div>`
      : ``}`;
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
    console.log(data.data.RelatedTopics);
    this.shadowRoot.querySelector("#ddgresult").innerHTML = `<code><pre>
    ${JSON.stringify(data.data.RelatedTopics, null, 4)}
    </pre></code>`;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.shadowRoot.querySelector("#mdtohtml")) {
      this.shadowRoot
        .querySelector("#mdtohtml")
        .addEventListener("click", () => {
          const params = {
            md: this.shadowRoot.querySelector("#md").value,
            type: this.shadowRoot.querySelector("#link").checked ? "link" : "",
          };
          MicroFrontendRegistry.call(
            "@core/mdToHtml",
            params,
            this.mdToHtmlCallback.bind(this),
          );
        });
    }
    if (this.shadowRoot.querySelector("#htmltomd")) {
      this.shadowRoot
        .querySelector("#htmltomd")
        .addEventListener("click", () => {
          const params = {
            html: this.shadowRoot.querySelector("#html").value,
            type: this.shadowRoot.querySelector("#link").checked ? "link" : "",
          };
          MicroFrontendRegistry.call(
            "@core/htmlToMd",
            params,
            this.htmlToMdCallback.bind(this),
          );
        });
    }
    if (this.shadowRoot.querySelector("#hydrate")) {
      this.shadowRoot
        .querySelector("#hydrate")
        .addEventListener("click", () => {
          const params = {
            html: this.shadowRoot.querySelector("#html").value,
            type: this.shadowRoot.querySelector("#link").checked ? "link" : "",
          };
          MicroFrontendRegistry.call(
            "@experiments/hydrateSsr",
            params,
            this.hydrateCallback.bind(this),
          );
        });
    }
    if (this.shadowRoot.querySelector("#haxcms")) {
      this.shadowRoot.querySelector("#haxcms").addEventListener("click", () => {
        const params = {
          site: this.shadowRoot.querySelector("#haxcmsurl").value,
          base: this.shadowRoot.querySelector("#haxcmsbase").value,
          magic: this.shadowRoot.querySelector("#haxcmsmagic").value,
          ancestor:
            this.shadowRoot.querySelector("#haxcmsparentid").value || null,
          type: "link",
          __method: "GET",
        };
        MicroFrontendRegistry.call(
          "@haxcms/siteToHtml",
          params,
          this.haxcmsCallback.bind(this),
        );
      });
    }
    if (this.shadowRoot.querySelector("#epub")) {
      this.shadowRoot.querySelector("#epub").addEventListener("click", () => {
        const params = {
          url: this.shadowRoot.querySelector("#haxcmsurl").value,
          __method: "GET",
        };
        MicroFrontendRegistry.call(
          "@haxcms/siteToEpub",
          params,
          this.haxcmsepubCallback.bind(this),
        );
      });
    }
    if (this.shadowRoot.querySelector("#searchbtn")) {
      this.shadowRoot
        .querySelector("#searchbtn")
        .addEventListener("click", () => {
          const params = {
            q: this.shadowRoot.querySelector("#search").value,
          };
          MicroFrontendRegistry.call(
            "@core/duckDuckGo",
            params,
            this.ddgCallback.bind(this),
          );
        });
    }
    ["src", "width", "height", "quality"].forEach((key) => {
      if (this.shadowRoot.querySelector(`#${key}`)) {
        this.shadowRoot
          .querySelector(`#${key}`)
          .addEventListener("input", () => {
            this.shadowRoot.querySelector("simple-img")[key] =
              this.shadowRoot.querySelector(`#${key}`).value;
          });
      }
    });
  }
}

customElements.define(MfHtmlExample.tag, MfHtmlExample);
