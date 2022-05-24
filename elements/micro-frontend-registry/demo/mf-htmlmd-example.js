import { LitElement, css, html } from "lit";
import { MicroFrontend, MicroFrontendRegistry } from "../micro-frontend-registry.js";
// support for local resolution of vercel vs serve
const base = window.location.origin.replace(/localhost:8(.*)/, "localhost:3000");

export class MfHtmlExample extends LitElement {
  static get tag() {
    return 'mf-htmlmd-example';
  }
  static get styles() {
    return [css`
    :host {
      display: block;
    }
   .wrap {
        display: flex;
        border: 2px solid black;
      }
    `];
  }
  constructor() {
    super();
    // MARKDOWN
    // CONVERTED
    // TO
    // HTML
    const mdToHtml = new MicroFrontend();
    mdToHtml.endpoint = `${base}/api/util/mdToHtml`;
    mdToHtml.name = "md-to-html";
    mdToHtml.title = "Markdown to HTML";
    mdToHtml.description = "Convert Markdown string (or file) to HTML";
    mdToHtml.params = {
      md: 'MD or link to be converted',
      type: 'link for processing as link otherwise unused',
    };
    MicroFrontendRegistry.define(mdToHtml);

    // HTML
    // CONVERTED
    // TO
    // MARKDOWN
    const htmlToMd = new MicroFrontend();
    htmlToMd.endpoint = `${base}/api/util/htmlToMd`;
    htmlToMd.name = "html-to-md";
    htmlToMd.title = "Markdown to HTML";
    htmlToMd.description = "Convert Markdown string (or file) to HTML";
    htmlToMd.params = {
      html: 'HTML or link to be converted',
      type: 'link for processing as link otherwise unused',
    };
    MicroFrontendRegistry.define(htmlToMd);

    // HTML
    // HYDRATED
    const hydrate = new MicroFrontend();
    hydrate.endpoint = `${base}/api/util/hydrateFromAutoloader`;
    hydrate.name = "hydrate-ssr";
    hydrate.title = "";
    hydrate.description = "Server side hydrate web components from CDN";
    hydrate.params = {
      html: 'Link to SSR',
      type: 'link',
    };
    MicroFrontendRegistry.define(hydrate);

    // HAXCMS
    // LOAD ENTIRE SITE CONTENT
    const haxcms = new MicroFrontend();
    haxcms.endpoint = `${base}/api/haxcms/site/html`;
    haxcms.name = "haxcms-site-html";
    haxcms.title = "HAXcms Site HTML";
    haxcms.description = "Load entire HAXcms site via URL";
    haxcms.params = {
      url: 'location of the HAXcms site',
    };
    MicroFrontendRegistry.define(haxcms);

    // HAXCMS
    // EPUB ENTIRE SITE CONTENT
    const epub = new MicroFrontend();
    epub.endpoint = `${base}/api/haxcms/site/epub`;
    epub.name = "haxcms-site-epub";
    epub.title = "HAXcms site EPUB";
    epub.description = "EPUB entire HAXcms site via URL";
    epub.params = {
      url: 'location of the HAXcms site',
    };
    MicroFrontendRegistry.define(epub);
  }

  render() {
    return html`
    <div>
      <label>URL of HAXcms site</label>
      <input type="url" id="haxcmsurl" />
      <button id="haxcms">HTML entire site</button>
      <button id="epub">EPUB entire site</button>
      <div id="haxcmssite"></div>
    </div>
    <div class="wrap">
      <div>MD
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
        <label>Treat as link</label><input type="checkbox" id="link"/>
      </div>
      <div>
        <button id="hydrate">--&gt; Hydrate SSRs</button>
      </div>
      </div>
      <div>HTML
        <textarea id="html" cols="50" rows="25"></textarea>
      </div>
    </div>`;
  }

  htmlToMdCallback(data) {
    this.shadowRoot.querySelector('#md').value = data.data;
  }
  mdToHtmlCallback(data) {
    this.shadowRoot.querySelector('#html').value = data.data;
  }
  hydrateCallback(data) {
    this.shadowRoot.querySelector('#html').value = data.data;
  }
  haxcmsCallback(data) {
    this.shadowRoot.querySelector('#haxcmssite').innerHTML = data.data;
  }
  haxcmsepubCallback(data) {
    console.log(data);
    // fake download
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot.querySelector('#mdtohtml').addEventListener('click', () => {
      const params = {
        md: this.shadowRoot.querySelector('#md').value,
        type: this.shadowRoot.querySelector('#link').checked ? 'link' : '',
      };
      MicroFrontendRegistry.call('md-to-html', params, this.mdToHtmlCallback.bind(this));
    });
    this.shadowRoot.querySelector('#htmltomd').addEventListener('click', () => {
      const params = {
        html: this.shadowRoot.querySelector('#html').value,
        type: this.shadowRoot.querySelector('#link').checked ? 'link' : '',
      };
      MicroFrontendRegistry.call('html-to-md', params, this.htmlToMdCallback.bind(this));
    });
    this.shadowRoot.querySelector('#hydrate').addEventListener('click', () => {
      const params = {
        html: this.shadowRoot.querySelector('#md').value,
        type: 'link',
      };
      MicroFrontendRegistry.call('hydrate-ssr', params, this.hydrateCallback.bind(this));
    });
    this.shadowRoot.querySelector('#haxcms').addEventListener('click', () => {
      const params = {
        url: this.shadowRoot.querySelector('#haxcmsurl').value,
      };
      MicroFrontendRegistry.call('haxcms-site-html', params, this.haxcmsCallback.bind(this));
    });
    this.shadowRoot.querySelector('#epub').addEventListener('click', () => {
      const params = {
        url: this.shadowRoot.querySelector('#haxcmsurl').value,
      };
      MicroFrontendRegistry.call('haxcms-site-epub', params, this.haxcmsepubCallback.bind(this));
    });
  }
}

customElements.define(MfHtmlExample.tag, MfHtmlExample);