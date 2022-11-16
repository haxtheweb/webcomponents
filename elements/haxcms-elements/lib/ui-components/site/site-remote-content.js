/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
 import { LitElement, html, css } from "lit";
 import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
 import { toJS } from "mobx";
 import { enableServices } from "@lrnwebcomponents/micro-frontend-registry/lib/microServices.js";
 import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
 enableServices(['haxcms']);
 /**
  * `site-uuid-link`
  * `UUID to render an accurate link and title in the site`
  *
  * @demo demo/index.html
  */
class SiteRemoteContent extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: inline;
        }
      `,
    ];
  }
  /**
  * Store the tag name to make it easier to obtain directly.
  */
  static get tag() {
    return "site-remote-content";
  }
  constructor() {
    super();
    this.uuid = null;
    this.siteurl = 'https://haxtheweb.org/';
  }
  /**
  * LitElement
  */
  render() {
    return html`
    ${this.showTitle ? html`${this.getTitleFromUUID(this.uuid)}` : ``}
    <div id="content">Load the content in</div>
    `;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'uuid' && this[propName]) {
        // when UUID changes, remote load the content from it, replacing our own light dom material
        MicroFrontendRegistry.call(
          "@haxcms/pageCache",
          {
            site: this.siteurl,
            type: "link",
            uuid: this.uuid,
            data: true
          },
          this.renderContentResponse.bind(this)
        );
      }
      // aggressive, only run this if we actually are an author of material / have HAX tools
      if (propName === 'siteurl' && window.HaxStore) {
        window.HaxStore.instance.refreshActiveNodeForm();
      }
    });
  }
  renderContentResponse(response) {
    if (response.data.content) {
      const cid = this.shadowRoot.querySelector('#content');
      cid.innerHTML = '';
      let div = document.createElement('div');
      div.innerHTML = response.data.content;
      cid.innerHTML = div.innerHTML;
    }
  }

  // get title from uuid
  getTitleFromUUID(uuid) {
    if (uuid && store.findItem(uuid)) {
      const item = toJS(store.findItem(uuid));
      return item.title;
    }
    return "";
  }
  /**
  * Props
  */
  static get properties() {
    return {
      uuid: {
        type: String,
      },
      // to avoid confusion w/ the site itself
      siteurl: {
        type: String
      }
    };
  }
  /**
  * haxProperties integration via file reference
  */
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Site Content",
        description:
          "Reuse content from one site in another.",
        icon: "hax:remote",
        color: "grey",
        groups: ["Content", "CMS"],
        handles: [
          {
            type: "inline",
            text: "term",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "uuid",
            title: "Item",
            description: "Item to render for the link / title data",
            inputMethod: "textfield",
          },
          {
            property: "siteurl",
            title: "Site address",
            description: "Paste address to reference content from if not the current site",
            inputMethod: "textfield",
          },
        ],
      },
    };
  }
  /**
  * Implements haxHooks to tie into life-cycle if hax exists.
  */
  haxHooks() {
    return {
      setupActiveElementForm: "haxsetupActiveElementForm",
    };
  }
  /**
   * Allow for dynamic setting of the parent field if we have the store around
   * with values to do so
   */
  async haxsetupActiveElementForm(props) {
    if (window.HAXCMS) {
      let itemManifest = [];
      // support remore vs local look up
      if (this.siteurl) {
        const response = await MicroFrontendRegistry.call(
          "@haxcms/siteManifest",
          {
            site: this.siteurl
          }
        );
        if (response.data && response.data.items) {
          itemManifest = response.data.items;
        }
      }
      else {
        itemManifest = store.getManifestItems(true);
      }
      // default to null parent as the whole site
      var items = [
        {
          text: `Select page`,
          value: null,
        },
      ];
      itemManifest.forEach((el) => {
        if (el.id != this.itemId) {
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
        }
      });
      props.settings.configure.forEach((attr, index) => {
        if (attr.property === "uuid") {
          props.settings.configure[index].inputMethod = "select";
          props.settings.configure[index].itemsList = items;
        }
      });
     }
   }
 }
 customElements.define(SiteRemoteContent.tag, SiteRemoteContent);
 export { SiteRemoteContent };
 