import { store } from "./haxcms-site-store.js";
import { toJS } from "mobx";
import { LitElement, html, css } from "lit";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@lrnwebcomponents/micro-frontend-registry/lib/microServices.js";
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "@github/time-elements/dist/relative-time-element.js";
import "@lrnwebcomponents/iframe-loader/lib/loading-indicator.js";
enableServices(["haxcms", "core"]);

/**
 * `haxcms-outline-editor-dialog`
 * `Dialog for presenting an editable outline`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
class HAXCMSShareDialog extends HAXCMSI18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          overflow: auto;
        }
      `,
    ];
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'activeTab' && this[propName]) {
        this.refreshData();
      }
    })
  }

  _insightResponse(data) {
    this.loading = false;
    this.data = data.data;
  }
  refreshData() {
    var base = "";
    if (document.querySelector("base")) {
      base = document.querySelector("base").href;
    }
    const site = toJS(store.manifest);
    const params = {
      type: "site",
      site: {
        file: base + "site.json",
        id: site.id,
        title: site.title,
        author: site.author,
        description: site.description,
        license: site.license,
        metadata: site.metadata,
        items: site.items,
      },
      activeId: this.shadowRoot.querySelector('#selector').value,
      link: base,
    };
    this.loading = true;
    switch (this.activeTab) {
      case 'insights':
        MicroFrontendRegistry.call(
          "@haxcms/insights",
          params,
          this._insightResponse.bind(this),
          this
        );
      break;
      case 'linkchecker':
        MicroFrontendRegistry.call(
          "@haxcms/linkChecker",
          params,
          this._insightResponse.bind(this),
          this
        );
      break;
      // bad selection
      default: 
        this.loading = false;
      break;
    }
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-insights";
  }
  getReadingTime(value) {
    let readVal = [];
    var hours = Math.floor(value / 60);
    var minutes = Math.floor(value - hours * 60);
    // handle hours of reading
    if (hours === 1) {
      readVal.push(`${hours} ${this.t.hour}`);
    } else if (hours === 0) {
      // do nothing for 0
    } else {
      readVal.push(`${hours} ${this.t.hours}`);
    }
    // minutes
    if (minutes === 1) {
      readVal.push(`${minutes} ${this.t.minute}`);
    } else if (minutes === 0) {
      // do nothing for 0
    } else {
      readVal.push(`${minutes} ${this.t.minutes}`);
    }
    return readVal.join(", ");
  }
  closeModal() {
    window.dispatchEvent(new CustomEvent('simple-modal-hide'));
  }
  activeChanged(e) {
    this.activeTab = e.detail.activeTab;
  }
  // render function
  render() {
    const data = this.data;
    return html`
    ${this.pageSelector()}
    <button @click="${this.refreshData}" icon="refresh" ?disabled="${this.loading}">${this.t.updateInsights}</button>
    <a11y-tabs id="tabs" full-width @a11y-tabs-active-changed="${this.activeChanged}">
      <a11y-tab id="insights" icon="communication:import-contacts" label="${this.t.insights}">
      ${this.activeTab === 'insights' ? html`
      <loading-indicator full ?loading="${this.loading}"></loading-indicator>
      ${this.loading ? html`<p>${this.t.loading}...</p>`: html`
        <div>
          <h2>${data.title}</h2>
          <ul>
            <li><strong>${data.objectives}</strong> ${this.t.learningObjectives}</li>
            <li><strong>${data.specialTags}</strong> ${this.t.specialElements}</li>
            <li><strong>${data.headings}</strong> ${this.t.headings}</li>
            <li><strong>${data.links}</strong> ${this.t.externalLinks}</li>
            ${data.video == 0 ? `` : html`<li><strong>${data.video}</strong> ${this.t.videos} ${data.videoLength != 0 ? html`(<strong>${toHHMMSS(data.videoLength)}</strong>)` : ``}</li>`}
            <li><strong>${data.pages}</strong> ${this.t.pages}</li>
            <li><strong>${this.getReadingTime(data.readTime)}</strong> ${this.t.ofReading}</li>
            ${data.readability ? html`
            <li><strong>${data.readability.gradeLevel}</strong> ${this.t.gradeReadingLevel}</li>
            <li><strong>${data.readability.lexiconCount}</strong> ${this.t.words} (${this.t.difficultWords} ${this.t.longWords})</li>
            ` : ``}
            <li>${this.t.created}:
              <relative-time datetime="${data.created}">
              </relative-time></li>
            <li>${this.t.lastUpdated}:
              <relative-time datetime="${data.updated}">
              </relative-time></li>
            <li>${this.t.recentUpdates}:
              <ol>
                ${data.updatedItems.map((item) => html`
                <li>
                  <a @click="${this.closeModal}" href="${item.slug}">${item.title} <relative-time datetime="${item.metadata.updated}"></relative-time></a>
                </li>`)}
              </ol>
            </li>
          </ul>
        </div>
      `}
      ` : ``}
      </a11y-tab>
      <a11y-tab id="linkchecker" icon="editor:format-list-bulleted" label="${this.t.linkChecker}">
      ${this.activeTab == 'linkchecker' ? html`
        <loading-indicator full ?loading="${this.loading}"></loading-indicator>
          ${this.loading ? html`<p>${this.t.loading}...</p>`: html`
          <div>
            <h2>${this.t.linkReport}</h2>
            <ul>
            ${
              data.linkData ? Object.keys(data.linkData).map((key) => html`
                <li>
                ${!data.badLinks[key] ? html`<simple-icon icon="check" accent-color="green"></simple-icon>` : html`<simple-icon icon="clear" accent-color="red" title="${data.badLinks[key].status}"></simple-icon>`}
                ${!data.badLinks[key] ? html`<a href="${key}" target="_blank" rel="noopener nofollow noreferrer">${key}</a>` : html`${key}`} (${data.linkData[key].map(linkUsage => html`
                <strong>${linkUsage.linkTitle}</strong> ${this.t.onPage} ${this.renderItemLinkById(linkUsage.itemId)}
                `)})  
              </li>
              `) : html`${this.t.noLinksInSelectedPages}`}
            </ul>
          </div>
        `}
      ` : ``}
      </a11y-tab>
    </a11y-tabs>
    `;
  }

  renderItemLinkById(itemId) {
    const item = toJS(store.findItem(itemId));
    return html`<a href="${item.slug}" @click="${this.closeModal}">${item.title}</a>`;
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      noLinksInSelectedPages: "No links in selected pages",
      recentUpdates: "Recent updates",
      created: "Created",
      lastUpdated: "Last updated",
      updateInsights: "Update insights",
      onPage: "on page",
      learningObjectives: "learning objectives",
      specialElements: "Special elements",
      headings: "Headings",
      externalLinks: "External links",
      pages: "Pages",
      videos: "videos",
      ofReading: "of reading",
      gradeReadingLevel: "grade reading level",
      words: "Words",
      longWords: "long words",
      linkReport: "Link report",
      loading: "Loading",
      fullSite: "Full site",
      insights: "Insights",
      linkChecker: "Link checker",
      mediaBrowser: "Media browser",
      contentBrowser: "Content browser",
      hour: "hour",
      hours: "hours",
      minute: "minute",
      minutes: "minutes"
    };
    this.data = {
      readability: {},
      updatedItems: []
    };
    this.activeTab = 'insights';
    this.loading = false;
  }
  static get properties() {
    return {
      ...super.properties,
      data: {
        type: Object,
      },
      activeTab: {
        type: String,
      },
      loading: { type: Boolean, reflect: true},
    }
  }
  pageSelector() {
    const itemManifest = store.getManifestItems(true);
    // default to null parent as the whole site
    var items = [
      {
        text: `-- ${this.t.fullSite} --`,
        value: null,
      },
    ];
    itemManifest.forEach((el) => {
      // calculate -- depth so it looks like a tree
      let itemBuilder = el;
      // walk back through parent tree
      let distance = "- ";
      while (itemBuilder && itemBuilder.parent != null) {
        itemBuilder = itemManifest.find((i) => i.id == itemBuilder.parent);
        // double check structure is sound
        if (itemBuilder) {
          distance = "--" + distance;
        }
      }
      items.push({
        text: distance + el.title,
        value: el.id,
      });
    });
    return html`<select id="selector">
      ${
        items.map(item => html`
        <option .value="${item.value}" ?selected="${toJS(store.activeId) == item.value}">${item.text}</option>
      `)}
      </select>`;
  }
}
window.customElements.define(
  HAXCMSShareDialog.tag,
  HAXCMSShareDialog
);
export { HAXCMSShareDialog };

// convert seconds back into full time stamp
function toHHMMSS(seconds) {
  var out = "";
  var snum = parseInt(seconds, 10);
  var hours = Math.floor(snum / 3600);
  var minutes = Math.floor((snum - hours * 3600) / 60);

  if (hours !== 0) {
    out += `${hours} hour`;
    if (hours !== 1) {
      out += "s";
    }
    out += ", ";
  }
  if (minutes !== 0) {
    out += `${minutes} minute`;
    if (hours !== 1) {
      out += "s";
    }
  }
  return out;
}