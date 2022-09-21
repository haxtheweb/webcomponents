import { store } from "./haxcms-site-store.js";
import { toJS } from "mobx";
import { LitElement, html, css } from "lit";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@lrnwebcomponents/micro-frontend-registry/lib/microServices.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "@github/time-elements/dist/relative-time-element.js";
import "@lrnwebcomponents/iframe-loader/lib/loading-indicator.js";
enableServices(["haxcms"]);

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

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.refreshData();
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
    const ancestor = toJS(store.ancestorItem);
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
      activeId: toJS(store.activeId),
      ancestorId: ancestor ? ancestor.id : null,
      link: base,
    };
    this.loading = true;
    MicroFrontendRegistry.call(
      "@haxcms/insights",
      params,
      this._insightResponse.bind(this),
      this
    );
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
  // render function
  render() {
    const site = this.data.site;
    const branch = this.data.branch;
    const page = this.data.page;
    return html`
    <simple-icon-button-lite @click="${this.refreshData}" icon="refresh" ?disabled="${this.loading}">${this.t.refresh}</simple-icon-button-lite>
    <a11y-tabs id="tabs" full-width>
      <a11y-tab id="course" icon="communication:import-contacts" label="${this.t.course}">
      <loading-indicator full ?loading="${this.loading}"></loading-indicator>
      ${this.loading ? html`<p>${this.t.loading}...</p>`: html`
        <div>
          <h2>Course insights</h2>
          <ul>
            <li><strong>${site.objectives}</strong> ${site.objectives == 0 ? html`objectives, why not add some?` : html`objectives in this course`}</li>
            <li><strong>${site.specialTags}</strong> special elements</li>
            <li><strong>${site.headings}</strong> headings</li>
            <li><strong>${site.links}</strong> links</li>
            ${site.video == 0 ? `` : html`<li><strong>${site.video}</strong> videos ${site.videoLength != 0 ? html`(<strong>${toHHMMSS(site.videoLength)}</strong>)` : ``}</li>`}
            <li><strong>${site.pages}</strong> Pages</li>
            <li><strong>${this.getReadingTime(site.readTime)}</strong> of reading</li>
            <li><strong>${site.readability.gradeLevel}</strong> grade reading level</li>
            <li><strong>${site.readability.lexiconCount}</strong> words</li>
            <li><strong>${site.readability.difficultWords}</strong> difficult words</li>
            <li>Created:
              <relative-time datetime="${site.created}">
              </relative-time></li>
            <li>Last updated:
              <relative-time datetime="${site.updated}">
              </relative-time></li>
            <li>Recent updates:
              <ol>
                ${site.updatedItems.map((item) => html`
                <li>
                  <a @click="${this.closeModal}" href="${item.slug}">${item.title} <relative-time datetime="${item.metadata.updated}"></relative-time></a>
                </li>`)}
              </ol>
            </li>
          </ul>
        </div>
      `}
      </a11y-tab>
      <a11y-tab id="lesson" icon="editor:format-list-bulleted" label="${this.t.lesson}">
        <loading-indicator full ?loading="${this.loading}"></loading-indicator>
        <div>
        ${this.loading ? html`<p>${this.t.loading}...</p>`: html`
        <h2>Lesson insights</h2>
          <ul>
            ${branch.video == 0 ? `` : html`<li><strong>${branch.video}</strong> videos ${branch.videoLength != 0 ? html`(<strong>${toHHMMSS(branch.videoLength)}</strong>)` : ``}</li>`}
            <li><strong>${branch.objectives}</strong> ${branch.objectives == 0 ? html`objectives, why not add some?` : html`objectives in this course`}</li>
            <li><strong>${branch.specialTags}</strong> special elements</li>
            <li><strong>${branch.headings}</strong> headings</li>
            <li><strong>${branch.links}</strong> links</li>
                <li><strong>${branch.pages}</strong> Pages</li>
                <li><strong>${this.getReadingTime(branch.readTime)}</strong> of reading</li>
                <li><strong>${branch.readability.gradeLevel}</strong> grade reading level</li>
                <li><strong>${branch.readability.lexiconCount}</strong> words</li>
                <li><strong>${branch.readability.difficultWords}</strong> difficult words</li>
            <li>Created:
              <relative-time datetime="${branch.created}">
              </relative-time>
            </li>
            <li>Last updated:
              <relative-time datetime="${branch.updated}">
              </relative-time>
            </li>
          </ul>
          `}
        </div>
      </a11y-tab>
      <a11y-tab id="page" icon="icons:subject" label="${this.t.page}">
        <div>
        <loading-indicator full ?loading="${this.loading}"></loading-indicator>
        ${this.loading ? html`<p>${this.t.loading}...</p>`: html`
            <h2>Page insights</h2>
            <ul>
              ${page.objectives == 0 ? `` : html`<li><strong>${page.objectives}</strong> objectives</li>`}
              ${page.video == 0 ? `` : html`<li><strong>${page.video}</strong> videos ${page.videoLength != 0 ? html`(<strong>${toHHMMSS(page.videoLength)}</strong>)` : ``}</li>`}
              <li><strong>${page.specialTags}</strong> special elements</li>
              <li><strong>${page.headings}</strong> headings</li>
              <li><strong>${page.links}</strong> links</li>
              <li><strong>${page.pages}</strong> Pages</li>
              <li><strong>${this.getReadingTime(page.readTime)}</strong> of reading</li>
              <li><strong>${page.readability.gradeLevel}</strong> grade reading level</li>
              <li><strong>${page.readability.lexiconCount}</strong> words</li>
              <li><strong>${page.readability.difficultWords}</strong> difficult words</li>
              <li>Created:
                <relative-time datetime="${page.created}">
                </relative-time></li>
              <li>Last updated:
                <relative-time datetime="${page.updated}">
                </relative-time></li>
            </ul>
          `}
          </div>
        </a11y-tab>
      </a11y-tabs>
    `;
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      refresh: "Refresh",
      loading: "Loading",
      course: "Course",
      lesson: "Lesson",
      page: "Page",
      hour: "hour",
      hours: "hours",
      minute: "minute",
      minutes: "minutes"
    };
    this.data = {
      site: {
        readability: {},
        updatedItems: []
      },
      branch: {
        readability: {}
      },
      page: {
        readability: {}
      }
    };
    this.loading = false;
  }
  static get properties() {
    return {
      ...super.properties,
      data: {
        type: Object
      },
      loading: { type: Boolean, reflect: true},
    }
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