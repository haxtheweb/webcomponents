// dependencies / things imported
import { html, css } from "lit";
import "@haxtheweb/simple-datetime/simple-datetime.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { toJS } from "mobx";
import { store } from "./AppHaxStore.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "./app-hax-confirmation-modal.js";

// wrapper to simplify the slug if it has additional values on it
function makeSlug(url) {
  let slug = "site";
  if (url) {
    let tmp = url.split("sites/");
    if (tmp.length > 1) {
      slug = tmp.pop().replace("/", "");
    }
  }
  return slug;
}
// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class AppHaxSiteDetails extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-site-details";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.need = "all need to succeed";
    this.details = {};
    this.siteId = "";
    this.detailOps = [
      {
        name: "Copy",
        op: "copySite",
        icon: "icons:content-copy",
      },
      {
        name: "Download",
        op: "downloadSite",
        icon: "file-download",
      },
      {
        name: "Archive",
        op: "archiveSite",
        icon: "icons:archive",
      },
    ];
    if (globalThis.HAXCMSContext && globalThis.HAXCMSContext === "php") {
      this.detailOps.push({
        name: "Git",
        op: "gitList",
        icon: "hax:git",
      });
    }
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      details: { type: Object },
      siteId: { type: String, attribute: "site-id" },
    };
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 12px;
          align-items: stretch;
          background-color: var(--simple-colors-default-theme-light-blue-11);
          color: var(--simple-colors-default-theme-light-blue-1);
          max-width: 220px;
          height: 208px;
          border-radius: 8px;
        }

        .flex-container {
          flex: 1;
          background-color: var(--simple-colors-default-theme-light-blue-11);
          margin: 8px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
        }
        .info-group {
          height: 100%;
          max-width: 25%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          padding: 0px;
          flex: 1;
        }
        simple-icon-button-lite:active,
        simple-icon-button-lite:hover,
        simple-icon-button-lite:focus {
          background-color: var(
            --simple-colors-default-theme-light-blue-8,
            #cde8ff
          );
          outline: 2px solid var(--simple-colors-default-theme-light-blue-1);
          outline-offset: 1px;
        }

        .info-headings {
          font-size: 12px;
        }
        .info-item {
          font-family: sans-serif;
          display: block;
          text-overflow: ellipsis;
          overflow: hidden;
          color: var(--simple-colors-default-theme-light-blue-1);
          line-height: 12px;
          max-width: 100%;
          font-size: 14px;
        }
        .pre ::slotted(*) {
          padding: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 50%;
          display: inline-flex;
        }
        a {
          text-decoration: underline;
        }
        .info-date {
          color: var(--simple-colors-default-theme-light-blue-1);
          line-height: 12px;
          font-size: 12px;
        }

        .info-icon {
          --simple-icon-width: 49px;
          --simple-icon-height: 49px;
          --simple-icon-button-border-radius: 0px;
          --simple-icon-button-border: 0px;
          outline: 0;
          border: 2px solid var(--simple-colors-default-theme-light-blue-1);
          border-radius: 4px;
          padding: 4px;
          width: 80%;
        }
        .info-icon::part(button) {
          outline: none;
        }
        @media (max-width: 640px) {
          :host {
            height: 140px;
          }
          .btn-group button {
            padding: 4px;
            margin: 4px 0;
          }
          .flex-container > div {
            margin: 0px;
          }
          .info-headings {
            font-size: 8px;
          }
          .info-date {
            font-size: 8px;
            line-height: 10px;
          }
          .info-icon {
            --simple-icon-width: 30px;
            --simple-icon-height: 30px;
            padding: 2px;
            border-radius: none;
          }
          .info-item {
            font-size: 8px;
          }
          .flex-container {
            margin: 2px;
          }
          .pre ::slotted(*) {
            padding: 0px;
            margin-top: 8px;
          }
          .info-group {
            height: 24px;
          }
        }
      `,
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  siteOperation(e) {
    // let elements;
    store.appEl.playSound("click");
    var target = e.target;
    // avoid label trigger
    if (target.tagName === "DIV") {
      target = target.parentNode;
    }
    const op = target.getAttribute("data-site-operation");
    const opName = target.getAttribute("data-site-operation-name");
    const siteID = target.getAttribute("data-site");
    store.activeSiteOp = op;
    store.activeSiteId = siteID;

    const site = toJS(
      store.manifest.items.filter((item) => item.id === siteID).pop(),
    );

    // gitlist opens in a new window
    if (op === "gitList") {
      // php library is basis for this button, rare instance
      if (globalThis.HAXCMSContext === "php") {
        // open link in new window
        globalThis.open(
          `gitlist/${site.metadata.site.name}`,
          "_blank",
          "noopener noreferrer",
        );
      }
    } else {
      // Create and configure the confirmation modal
      const modal = document.createElement("app-hax-confirmation-modal");
      modal.title = `${opName} ${site.metadata.site.name}?`;
      modal.message = `Are you sure you want to ${op.replace("Site", "")} ${site.metadata.site.name}?`;
      modal.confirmText = "Confirm";
      modal.cancelText = "Cancel";

      // Mark archive operations as dangerous for red styling
      modal.dangerous = op === "archiveSite";

      modal.confirmAction = this.confirmOperation.bind(this);
      modal.cancelAction = this.cancelOperation.bind(this);

      // Add modal to document and show it
      document.body.appendChild(modal);
      modal.openModal();

      // Clean up modal when it closes
      modal.addEventListener(
        "close",
        () => {
          document.body.removeChild(modal);
        },
        { once: true },
      );
    }
  }

  cancelOperation() {
    store.activeSiteOp = "";
    store.activeSiteId = null;
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
      }),
    );
    // Error sound for cancel is now handled centrally in
    // app-hax-confirmation-modal to avoid duplicate sounds.
  }

  async confirmOperation() {
    const op = toJS(store.activeSiteOp);
    const site = toJS(store.activeSite);
    // @todo bother to implement these / translate to the path via switch
    await store.AppHaxAPI.makeCall(
      op,
      {
        site: {
          name: site.metadata.site.name,
          id: site.id,
        },
      },
      true,
      () => {
        const activeOp = toJS(store.activeSiteOp);
        // download is weird relative to the others
        if (activeOp === "downloadSite") {
          const response = store.AppHaxAPI.lastResponse.downloadSite;
          if (response && response.data && response.data.link) {
            const link = response.data.link;
            const name = response.data.name || "";
            // Use an anchor element so this is treated as a real navigation
            // and not blocked as a popup by the browser.
            const a = globalThis.document.createElement("a");
            a.href = link;
            if (name) {
              a.setAttribute("download", name);
            }
            a.style.display = "none";
            globalThis.document.body.appendChild(a);
            a.click();
            globalThis.document.body.removeChild(a);
          } else {
            console.error(
              "downloadSite response missing data.link:",
              response,
            );
          }
        } else {
          store.refreshSiteListing();
        }
      },
    );
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
      }),
    );
    // Success sound for confirm is now handled centrally in
    // app-hax-confirmation-modal to avoid duplicate sounds.
    store.toast(
      `${site.metadata.site.name} ${op.replace("Site", "")} successful!`,
      3000,
      {
        hat: "random",
      },
    );
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div class="pre"><slot name="pre"></slot></div>
      <div class="flex-container" id="infomation">
          <div class="info-group">
            <div class="info-headings">created</div>
            <simple-datetime
                format="m/j/y"
                .timestamp="${this.details.created}"
                unix
                class="info-date"
            ></simple-datetime>
          </div>
          <div class="info-group">
            <div class="info-headings">updated</div>
            <simple-datetime
                format="m/j/y"
                .timestamp="${this.details.updated}"
                unix
                class="info-date"
            ></simple-datetime>
          </div>
          <div class = info-group>
            <div class="info-headings">pages</div>
            <div class="info-item">${this.details.pages}</div>
          </div>
          <div class = info-group>
            <div class="info-headings">URL</div>
            <a href="${
              this.details.url
            }" class="info-item" id="slug">${makeSlug(this.details.url)}</a>
          </div>
      </div>
        <div class="flex-container" id="actions">
          ${this.detailOps.map(
            (item) => html`
              <div class="info-group">
                <simple-icon-button-lite
                  data-site="${this.siteId}"
                  data-site-operation="${item.op}"
                  data-site-operation-name="${item.name}"
                  icon="${item.icon}"
                  id="op-${item.op}"
                  class="info-icon"
                  @click=${this.siteOperation}
                >
                  <div class="info-item">${item.name.toLowerCase()}</div>
                </simple-icon-button-lite>
                <simple-tooltip for="op-${item.op}" position="bottom"
                  >${item.op != "gitList" ? "" : "View"} ${item.name}
                  ${item.op != "gitList" ? "Site" : "source"}</simple-tooltip
                >
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }
}
customElements.define(AppHaxSiteDetails.tag, AppHaxSiteDetails);
