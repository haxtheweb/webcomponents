import { LitElement, css, html } from "lit";
import { MicroFrontend, MicroFrontendRegistry } from "../micro-frontend-registry.js";
import "@lrnwebcomponents/simple-img/simple-img.js";

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
    mdToHtml.endpoint = '/api/services/media/format/mdToHtml';
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
    htmlToMd.endpoint = '/api/services/media/format/htmlToMd';
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
    hydrate.endpoint = '/api/experiments/hydrateFromAutoloader';
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
    haxcms.endpoint = '/api/apps/haxcms/site/html';
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
    epub.endpoint = '/api/apps/haxcms/site/epub';
    epub.name = "haxcms-site-epub";
    epub.title = "HAXcms site EPUB";
    epub.description = "EPUB entire HAXcms site via URL";
    epub.params = {
      url: 'location of the HAXcms site',
    };
    MicroFrontendRegistry.define(epub);

    // DUCKDUCKGO
    // Example endpoint
    const ddg = new MicroFrontend();
    ddg.endpoint = '/api/services/search/duckduckgo';
    ddg.name = "ddg";
    ddg.title = "Duck duck go";
    ddg.description = "Search duck duck go";
    ddg.params = {
      q: 'query param to search on',
    };
    MicroFrontendRegistry.define(ddg);
  }

  render() {
    return html`
    <div>
      <label for="src">source url</label>
      <input type="text" id="src" value="https://ftw.usatoday.com/wp-content/uploads/sites/90/2017/05/spongebob.jpg?w=1000&h=600&crop=1" size="100" />
      <label for="height">height</label>
      <input type="number" id="height" value="200" min="10" max="1000" />
      <label for="width">width</label>
      <input type="number" id="width" value="300" min="10" max="1000" />
      <label for="quality">quality</label>
      <input type="range" id="quality" value="80" min="5" max="100" step="5" />
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
  ddgCallback(data) {
    console.log(data);
  }
  simpleImgCallback(data) {
    this.shadowRoot.querySelector('simple-img').value = data.data;
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
    this.shadowRoot.querySelector('#searchbtn').addEventListener('click', () => {
      const params = {
        q: this.shadowRoot.querySelector('#search').value,
      };
      MicroFrontendRegistry.call('ddg', params, this.ddgCallback.bind(this));
    });
    this.shadowRoot.querySelector('#src').addEventListener('input', () => {
      const params = {
        src: this.shadowRoot.querySelector('#src').value,
      };
      MicroFrontendRegistry.call('simple-img', params, this.simpleImgCallback.bind(this));
    });
  }
}

customElements.define(MfHtmlExample.tag, MfHtmlExample);