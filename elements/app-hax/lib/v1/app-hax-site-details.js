// dependencies / things imported
import { html, css } from 'lit';
import '@lrnwebcomponents/simple-datetime/simple-datetime.js';
import { toJS } from "mobx";
import { store } from './AppHaxStore.js';
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

// wrapper to simplify the slug if it has additional values on it
function makeSlug(url) {
  let slug = 'site';
  if (url) {
    let tmp = url.split('sites/');
    if (tmp.length > 1) {
      slug = tmp.pop().replace('/','');
    }
  }
  return slug;
}
// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class AppHaxSiteDetails extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'app-hax-site-details';
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.need = 'all need to succeed';
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
      {
        name: "Delete",
        op: "deleteSite",
        icon: "icons:delete-forever",
      },
    ]
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      details: { type: Object },
      siteId: {type: String,  attribute: 'site-id'}
    };
  }

  // CSS - specific to Lit
  static get styles() {
    return [...super.styles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
        align-items: stretch;
        background-color: var(--simple-colors-default-theme-grey-2);
        height: 208px;
      }

      .flex-container {
        flex: 1;
        background-color: var(--simple-colors-default-theme-grey-2);
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
        background-color: var(--simple-colors-default-theme-grey-4, #EEEEEE);
        outline: 2px solid var(--simple-colors-default-theme-grey-12);
        outline-offset: 1px;
      }

      .info-headings {
        font-size: 12px;
      }
      .info-item {
        font-family: 'Press Start 2P', sans-serif;
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--simple-colors-default-theme-grey-12);
        line-height: 12px;
        max-width: 100%;
        font-size: 12px;
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
        color: var(--simple-colors-default-theme-grey-12);
        line-height: 12px;
        font-size: 12px;
      }

      .info-icon {
        --simple-icon-width: 49px;
        --simple-icon-height: 49px;
        --simple-icon-button-border-radius: 0px;
        --simple-icon-button-border: 0px;
        outline: 0;
        border: 2px solid var(--simple-colors-default-theme-grey-12);
        border-radius: 4px;
        padding: 4px;
        width: 80%;
      }
      #op-deleteSite {
        color: var(--simple-colors-default-theme-red-7);
      }
      .info-icon::part(button) {
        outline: none;
      }
      @media (max-width: 500px) {
        .btn-group button {
          padding: 4px;
          margin: 4px 0;
        }
        .flex-container > div {
          margin: 0px;
        }
      }
    `];
  }


  // eslint-disable-next-line class-methods-use-this
  siteOperation(e){
    // let elements;
    store.appEl.playSound('click');
    var target = e.target;
    // avoid label trigger
    if (target.tagName === "DIV") {
      target = target.parentNode;
    }
    const div = document.createElement('div');
    const op = target.getAttribute("data-site-operation");
    const opName = target.getAttribute("data-site-operation-name");
    const siteID = target.getAttribute("data-site");
    store.activeSiteOp = op;
    store.activeSiteId = siteID;
    import('@lrnwebcomponents/simple-modal/simple-modal.js').then(() => {
      setTimeout(() => {
        const site = toJS(store.manifest.items.filter((item) => item.id === siteID).pop());
        div.appendChild(
          document.createTextNode(`Are you sure you want to ${op} ${site.metadata.site.name}?`)
        );
        if (op === "deleteSite") {
          let undone = document.createElement('div');
          undone.style.color="red";
          undone.style.fontWeight="bold";
          undone.appendChild(
            document.createTextNode(`This can not be undone.`)
          );
          div.appendChild(undone);
        }
        const bcontainer = document.createElement("div");
        const b = document.createElement('button');
        b.innerText = "Confirm";
        b.addEventListener('click', this.confirmOperation.bind(this));
        bcontainer.appendChild(b);
        const b2 = document.createElement('button');
        b2.innerText = "Cancel";
        b2.addEventListener('click', this.cancelOperation.bind(this));
        bcontainer.appendChild(b2);
        this.dispatchEvent(new CustomEvent('simple-modal-show', {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            title: `${opName} ${site.metadata.site.name}?`,
            elements: { content: div, buttons: bcontainer },
            invokedBy: target,
            styles: {
              "--simple-modal-titlebar-background": "orange",
              "--simple-modal-titlebar-color": "black",
              "--simple-modal-width": "20vw",
              "--simple-modal-min-width": "300px",
              "--simple-modal-z-index": "100000000",
              "--simple-modal-height": "20vh",
              "--simple-modal-min-height": "400px",
              "--simple-modal-titlebar-height": "60px",
            },
          },
        })
        );
      },0);
    });
  }

 cancelOperation() {
  store.activeSiteOp = '';
  store.activeSiteId = null;
  window.dispatchEvent(new CustomEvent('simple-modal-hide'));
  store.appEl.playSound('error');
 }

  async confirmOperation() {
    const op = toJS(store.activeSiteOp);
    const site = toJS(store.activeSite);
    // @todo bother to implement these / translate to the path via switch
    await store.AppHaxAPI.makeCall(op, {site: { name: site.name}});
    window.dispatchEvent(new CustomEvent('simple-modal-hide'));
    store.appEl.playSound('success');
    store.toast(`${site.metadata.site.name} ${op} successful!`, 3000, { hat: "random"});
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
            <a href="${this.details.url}" class="info-item" id="slug">${makeSlug(this.details.url)}</a>
          </div>
      </div>
        <div class="flex-container" id="actions">
          ${this.detailOps.map(item => html`
            <div class="info-group">
              <simple-icon-button-lite data-site="${this.siteId}" data-site-operation="${item.op}" data-site-operation-name="${item.name}" icon="${item.icon}" id="op-${item.op}" class="info-icon" @click=${this.siteOperation}>
                <div class="info-item">${item.name.toLowerCase()}</div>
              </simple-icon-button-lite>  
              <simple-tooltip for="op-${item.op}" position="bottom">${item.name} Site</simple-tooltip>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}
customElements.define(AppHaxSiteDetails.tag, AppHaxSiteDetails);
