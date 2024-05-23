/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "../../core/utils/HAXCMSI18NMixin.js";
import {
  wipeSlot,
  lightChildrenToShadowRootSelector,
  unwrap,
} from "@haxtheweb/utils/utils.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "@haxtheweb/citation-element/citation-element.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

enableServices(["haxcms"]);
/**
 * `site-remote-content`
 * `Remote render of content given a site URL and UUID`
 *
 * @demo demo/index.html
 */
class SiteRemoteContent extends HAXCMSI18NMixin(
  IntersectionObserverMixin(LitElement),
) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        #slot {
          display: none;
        }
        :host(:not([hide-reference])) #content {
          border-left: 10px solid #eeeeee;
          margin-left: -10px;
        }
        :host([breakreference]) #slot {
          display: block;
        }
        :host([breakreference]) #content {
          display: none;
          border-left: unset;
          margin-left: unset;
        }
        :host([loading]) .loading {
          margin: 8px 0 0 -12px;
          font-size: 2px;
          width: 20px;
          height: 20px;
          --simple-icon-height: 20px;
          --simple-icon-width: 20px;
          position: absolute;
        }
        :host([player][loading]) .loading {
          margin: 8px 0px 0px -12px;
          font-size: 2px;
          height: 100%;
          --simple-icon-height: 100px;
          --simple-icon-width: 100px;
          width: 400px;
          display: flex;
          justify-content: center;
          position: relative;
          top: 25px;
          left: 25px;
        }

        :host([player][loading]) .loading simple-icon-lite {
          height: 100%;
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
    this.HAXCMSI18NMixinBase = "../../../";
    this.__disposer = [];
    this.player = false;
    this.circularBlock = false;
    this.itemManifest = {};
    this.loading = false;
    this.uuid = null;
    this.hideReference = false;
    this.siteurl = "";
    this.showTitle = false;
    this.breakreference = false;
    this._remoteTitle = null;
    this.t.selectPage = "Select page";
    let pNode = this;
    let pCounter = 0;
    // ensure we don't have too deep a reference to avoid infinite remotes
    while (pNode && pNode.tagName) {
      pNode = pNode.parentNode;
      if (pNode && pNode.tagName && pNode.tagName === "SITE-REMOTE-CONTENT") {
        pCounter++;
        if (pCounter >= 3) {
          this.circularBlock = true;
        }
      }
    }
  }
  /**
   * LitElement
   */
  render() {
    return html`
      ${this.elementVisible
        ? html`
            <div class="loading">
              ${this.loading
                ? html`<simple-icon-lite icon="hax:loading"></simple-icon-lite>`
                : ``}
            </div>
            ${this.showTitle && this._remoteTitle
              ? html`<h3>${this._remoteTitle}</h3>`
              : ``}
            <div id="slot"><slot></slot></div>
          `
        : ``}
      <div id="content"></div>
    `;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // no calls until we're actually visible
      if (this.elementVisible) {
        if (
          (propName === "uuid" || propName === "elementVisible") &&
          this[propName] &&
          !this.breakreference &&
          !this.loading &&
          !this.circularBlock
        ) {
          this.loading = true;
          let url = this.siteurl;
          if (url == "" && globalThis.HAXCMS && globalThis.location) {
            url = `${globalThis.location.origin}${globalThis.HAXCMS.instance.store.location.baseUrl}`;
          }
          // when UUID changes, remote load the content from it, replacing our own light dom material
          MicroFrontendRegistry.call(
            "@haxcms/pageCache",
            {
              site: url,
              type: "link",
              uuid: this.uuid,
              data: true,
            },
            this.renderContentResponse.bind(this),
          );
        }
        // aggressive, only run this if we actually are an author of material / have HAX tools
        if (
          propName === "siteurl" &&
          globalThis.HaxStore &&
          !this.loading &&
          !this.circularBlock
        ) {
          clearTimeout(this.__debounce);
          this.__debounce = setTimeout(() => {
            this.loading = true;
            // forces the form to update as opposed to deferring to what it loaded initially
            this.__refresh = true;
            globalThis.HaxStore.instance.refreshActiveNodeForm();
          }, 1500);
        }
        // this is crazy, take that content and spill it into lightDom
        // and it should be modifiable
        if (propName === "breakreference" && this[propName]) {
          // find the content area in shadow
          const cid = this.shadowRoot.querySelector("#content");
          let child = cid.firstElementChild;
          while (child) {
            this.appendChild(child);
            child = cid.firstElementChild;
          }
        }
        // used to be break reference, now we as re-establishing the reference
        else if (
          propName === "breakreference" &&
          !this[propName] &&
          oldValue &&
          !this.circularBlock
        ) {
          this.loading = true;
          wipeSlot(this);
          let url = this.siteurl;
          if (url == "" && globalThis.HAXCMS && globalThis.location) {
            url = `${globalThis.location.origin}${globalThis.HAXCMS.instance.store.location.baseUrl}`;
          }
          MicroFrontendRegistry.call(
            "@haxcms/pageCache",
            {
              site: url,
              type: "link",
              uuid: this.uuid,
              data: true,
            },
            this.renderContentResponse.bind(this),
          );
        }
      }
    });
  }
  renderContentResponse(response) {
    if (response.data) {
      // if HAX is actively editing, don't capture these mutations
      // in hax-body or the nodes become contenteditable when they
      // should not be
      if (globalThis.HaxStore && !this.breakreference) {
        globalThis.HaxStore.instance.activeBodyIgnoreActive(true);
      }
      // find the content area in shadow
      const cid = this.shadowRoot.querySelector("#content");
      // remove past stuff
      wipeSlot(cid);
      // build fake div and encap the content from endpoint
      let div = globalThis.document.createElement("div");
      // encap script just to be paranoid
      let html = response.data.content.replace(
        /<script[\s\S]*?>/gi,
        "&lt;script&gt;",
      );
      html = html.replace(/<\/script>/gi, "&lt;/script&gt;");
      div.innerHTML = html;
      // append as child of this element
      this.appendChild(div);
      // kill the div, the children spill into this tag
      unwrap(div);
      // update title and loading status
      this._remoteTitle = response.data.title;
      this.loading = false;
      // if we break the linkage, we blow this instance of the tag up
      // and we'll have everything in the state the user expects but
      // without the reference to the original
      // if we don't break the reference, the childNodes are moved
      // into the shadow selector for content so they can't be modified
      if (!this.breakreference) {
        lightChildrenToShadowRootSelector(this, "#content");
      }
      if (
        !this.hideReference &&
        this.itemManifest &&
        this.itemManifest.title &&
        response.data &&
        !this.breakreference
      ) {
        globalThis.HaxStore.instance.activeBodyIgnoreActive(false);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        // create and inject these values into the dom node NEXT to this one.
        if (
          !this.nextElementSibling ||
          (this.nextElementSibling &&
            this.nextElementSibling.tagName !== "CITATION-ELEMENT")
        ) {
          let ce = globalThis.document.createElement("citation-element");
          ce.title = `${this.itemManifest.title} - ${response.data.title}`;
          ce.source = `${response.data.site}${response.data.slug}`;
          ce.date = `${dd}/${mm}/${yyyy}`;
          ce.scope = "sibling";
          ce.license = this.itemManifest.license;
          ce.creator = this.itemManifest.metadata.author.name;
          this.insertAdjacentElement("afterend", ce);
        }
        // already exists, so just update the one next to it
        else if (
          this.nextElementSibling &&
          this.nextElementSibling.tagName === "CITATION-ELEMENT"
        ) {
          let ce = this.nextElementSibling;
          ce.title = `${this.itemManifest.title} - ${response.data.title}`;
          ce.source = `${response.data.site}${response.data.slug}`;
          ce.date = `${dd}/${mm}/${yyyy}`;
          ce.scope = "sibling";
          ce.license = this.itemManifest.license;
          ce.creator = this.itemManifest.metadata.author.name;
        }
      }
    }
  }
  /**
   * Props
   */
  static get properties() {
    return {
      ...super.properties,
      uuid: {
        type: String,
      },
      player: {
        type: Boolean,
        reflect: true,
      },
      // to avoid confusion w/ the site itself
      siteurl: {
        type: String,
      },
      showTitle: {
        type: Boolean,
        attribute: "show-title",
      },
      _remoteTitle: {
        type: String,
      },
      loading: {
        type: Boolean,
        reflect: true,
      },
      breakreference: {
        type: Boolean,
        reflect: true,
      },
      hideReference: {
        type: Boolean,
        reflect: true,
        attribute: "hide-reference",
      },
    };
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (this.children.length > 0) {
      let cid = this.shadowRoot.querySelector("#content");
      wipeSlot(cid);
      lightChildrenToShadowRootSelector(this, "#content");
    }
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return {
      type: "grid",
      canScale: false,

      canEditSource: false,
      gizmo: {
        title: "Remote Content",
        description: "Reuse content from one site in another.",
        icon: "hax:remote",
        color: "grey",
        tags: [
          "Resource",
          "haxcms",
          "content",
          "remote",
          "reference",
          "url",
          "resource",
        ],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "siteurl",
            title: "Site address",
            description:
              "Paste address to reference content from if not the current site",
            inputMethod: "textfield",
          },
          {
            property: "uuid",
            title: "Item",
            description: "Item to render for the link / title data",
            inputMethod: "textfield",
          },
          {
            property: "breakreference",
            title: "Break reference",
            description:
              "Checking this box copies the remote content for editing locally but removes the association. It will no longer get updates when the reference material updates.",
            inputMethod: "boolean",
          },
          {
            property: "showTitle",
            title: "Show title",
            description:
              "Toggle on to render the title of the resource being displayed",
            inputMethod: "boolean",
          },
        ],
      },
      demoSchema: [
        {
          tag: "site-remote-content",
          properties: {
            showTitle: true,
            _remoteTitle: "Select content",
          },
          content: "<div>Select content to load</div>",
        },
      ],
      saveOptions: {
        unsetAttributes: ["t", "_remote-title"],
      },
    };
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      // need to add the nodeToContent hook / progressive enhancement
      progressiveEnhancement: "haxprogressiveEnhancement",
      setupActiveElementForm: "haxsetupActiveElementForm",
    };
  }
  // render the shadow root hidden content to lightDom
  // so we can pull it in on initial page load
  haxprogressiveEnhancement(el) {
    if (this.shadowRoot && this.shadowRoot.querySelector("#content")) {
      return this.shadowRoot.querySelector("#content").innerHTML;
    }
  }
  /**
   * Allow for dynamic setting of the parent field if we have the store around
   * with values to do so
   */
  async haxsetupActiveElementForm(props) {
    if (globalThis.HAXCMS) {
      if (Object.keys(this.itemManifest).length === 0 || this.__refresh) {
        this.__refresh = false;
        // support remore vs local look up
        if (this.siteurl) {
          const response = await MicroFrontendRegistry.call(
            "@haxcms/siteManifest",
            {
              site: this.siteurl,
            },
          );
          if (response.data) {
            this.itemManifest = response.data;
          }
        } else {
          this.itemManifest = store.getManifest(true);
        }
      }
      // default to null parent as the whole site
      var items = [
        {
          text: this.t.selectPage,
          value: null,
        },
      ];
      this.itemManifest.items.forEach((el) => {
        if (el.id != this.itemId) {
          // calculate -- depth so it looks like a tree
          let itemBuilder = el;
          // walk back through parent tree
          let distance = "- ";
          while (itemBuilder && itemBuilder.parent != null) {
            itemBuilder = this.itemManifest.items.find(
              (i) => i.id == itemBuilder.parent,
            );
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
          props.settings.configure[index].disabled = false;
          props.settings.configure[index].inputMethod = "select";
          props.settings.configure[index].itemsList = items;
          // disable changes if we broke a reference
          if (this.breakreference) {
            props.settings.configure[index].disabled = true;
          }
        } else if (attr.property === "siteurl") {
          props.settings.configure[index].disabled = false;
          // disable changes if we broke a reference
          if (this.breakreference) {
            props.settings.configure[index].disabled = true;
          }
        }
      });
      // end loading indicator as data should be present now
      this.loading = false;
    }
  }
}
customElements.define(SiteRemoteContent.tag, SiteRemoteContent);
export { SiteRemoteContent };
