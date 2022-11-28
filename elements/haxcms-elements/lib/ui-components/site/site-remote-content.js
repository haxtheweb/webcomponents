/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
 import { LitElement, html, css } from "lit";
 import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
 import { HAXCMSI18NMixin } from "../../core/utils/HAXCMSI18NMixin.js";
 import { wipeSlot, lightChildrenToShadowRootSelector, unwrap } from "@lrnwebcomponents/utils/utils.js";
 import { enableServices } from "@lrnwebcomponents/micro-frontend-registry/lib/microServices.js";
 import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
 import "@lrnwebcomponents/citation-element/citation-element.js";
 enableServices(['haxcms']);
 /**
  * `site-remote-content`
  * `Remote render of content given a site URL and UUID`
  *
  * @demo demo/index.html
  */
class SiteRemoteContent extends HAXCMSI18NMixin(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: inline;
        }
        #slot {
          display: none;
        }
        :host #content {
          border-left: 10px solid #EEEEEE;
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
          width: 4px;
          height: 4px;
          border-radius: 50%;
          position: absolute;
          -webkit-animation: load5 1.1s infinite ease;
          animation: load5 1.1s infinite ease;
          -webkit-transform: translateZ(0);
          -ms-transform: translateZ(0);
          transform: translateZ(0);
        }
        @-webkit-keyframes load5 {
          0%,
          100% {
            box-shadow: 0em -2.6em 0em 0em var(--enhanced-text-color, #000000),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.5),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
          }
          12.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7),
              1.8em -1.8em 0 0em var(--enhanced-text-color, #000000),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
          }
          25% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7),
              2.5em 0em 0 0em var(--enhanced-text-color, #000000),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          37.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.7),
              1.75em 1.75em 0 0em var(--enhanced-text-color, #000000),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7),
              0em 2.5em 0 0em var(--enhanced-text-color, #000000),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          62.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.7),
              -1.8em 1.8em 0 0em var(--enhanced-text-color, #000000),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          75% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7),
              -2.6em 0em 0 0em var(--enhanced-text-color, #000000),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          87.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.7),
              -1.8em -1.8em 0 0em var(--enhanced-text-color, #000000);
          }
        }
        @keyframes load5 {
          0%,
          100% {
            box-shadow: 0em -2.6em 0em 0em var(--enhanced-text-color, #000000),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.5),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
          }
          12.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7),
              1.8em -1.8em 0 0em var(--enhanced-text-color, #000000),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
          }
          25% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7),
              2.5em 0em 0 0em var(--enhanced-text-color, #000000),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          37.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.7),
              1.75em 1.75em 0 0em var(--enhanced-text-color, #000000),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7),
              0em 2.5em 0 0em var(--enhanced-text-color, #000000),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          62.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.7),
              -1.8em 1.8em 0 0em var(--enhanced-text-color, #000000),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          75% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7),
              -2.6em 0em 0 0em var(--enhanced-text-color, #000000),
              -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
          }
          87.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
              1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
              2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
              1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
              0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
              -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5),
              -2.6em 0em 0 0em rgba(255, 255, 255, 0.7),
              -1.8em -1.8em 0 0em var(--enhanced-text-color, #000000);
          }
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
    this.circularBlock = false;
    this.itemManifest = {};
    this.loading = false;
    this.uuid = null;
    this.siteurl = '';
    this.showTitle = false;
    this.breakreference = false;
    this._remoteTitle = null;
    this.t = {
      selectPage: "Select page"
    };
    let pNode = this;
    let pCounter = 0;
    // ensure we don't have too deep a reference to avoid infinite remotes
    while (pNode && pNode.tagName) {
      pNode = pNode.parentNode;
      if (pNode && pNode.tagName && pNode.tagName === 'SITE-REMOTE-CONTENT') {
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
    <div class="loading"></div>
    ${this.showTitle && this._remoteTitle ? html`<h3>${this._remoteTitle}</h3>` : ``}
    <div id="slot"><slot></slot></div>
    <div id="content"></div>
    `;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'uuid' && this[propName] && !this.breakreference && !this.loading && !this.circularBlock) {
        this.loading = true;
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
      if (propName === 'siteurl' && window.HaxStore && !this.loading && !this.circularBlock) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          this.loading = true;
          // forces the form to update as opposed to deferring to what it loaded initially
          this.__refresh = true;
          window.HaxStore.instance.refreshActiveNodeForm();
        }, 1500);
      }
      // this is crazy, take that content and spill it into lightDom
      // and it should be modifiable
      if (propName === 'breakreference' && this[propName]) {
        // find the content area in shadow
        const cid = this.shadowRoot.querySelector('#content');
        let child = cid.firstElementChild;
        while (child) {
          this.appendChild(child);
          child = cid.firstElementChild;
        }
      }
      // used to be break reference, now we as re-establishing the reference
      else if (propName === 'breakreference' && !this[propName] && oldValue && !this.circularBlock) {
        this.loading = true;
        wipeSlot(this);
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
    });
  }
  renderContentResponse(response) {
    if (response.data) {
      // if HAX is actively editing, don't capture these mutations
      // in hax-body or the nodes become contenteditable when they
      // should not be
      if (window.HaxStore && !this.breakreference) {
        window.HaxStore.instance.activeBodyIgnoreActive(true);
      }
      // find the content area in shadow
      const cid = this.shadowRoot.querySelector('#content');
      // remove past stuff
      wipeSlot(cid);
      // build fake div and encap the content from endpoint
      let div = document.createElement('div');
      // encap script just to be paranoid
      let html = response.data.content.replace(/<script[\s\S]*?>/gi, "&lt;script&gt;");
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
        lightChildrenToShadowRootSelector(this, '#content');
      }
      if (this.itemManifest && response.data && !this.breakreference) {
        window.HaxStore.instance.activeBodyIgnoreActive(false);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        // create and inject these values into the dom node NEXT to this one.
        if (!this.nextElementSibling || (this.nextElementSibling && this.nextElementSibling.tagName !== 'CITATION-ELEMENT')) {
          let ce = document.createElement('citation-element');
          ce.title = `${this.itemManifest.title} - ${response.data.title}`;
          ce.source = `${response.data.site}${response.data.slug}`;
          ce.date = `${dd}/${mm}/${yyyy}`;
          ce.scope = "sibling";
          ce.license = this.itemManifest.license;
          ce.creator = this.itemManifest.metadata.author.name;
          this.insertAdjacentElement('afterend', ce);
        }
        // already exists, so just update the one next to it
        else if (this.nextElementSibling && this.nextElementSibling.tagName === 'CITATION-ELEMENT') {
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
      // to avoid confusion w/ the site itself
      siteurl: {
        type: String
      },
      showTitle: {
        type: Boolean,
        attribute: 'show-title'
      },
      _remoteTitle: { 
        type: String
      },
      loading: {
        type: Boolean,
        reflect: true,
      },
      breakreference: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (this.children.length > 0) {
      let cid = this.shadowRoot.querySelector('#content');
      wipeSlot(cid);
      lightChildrenToShadowRootSelector(this, '#content');
    }
  }
  /**
  * haxProperties integration via file reference
  */
  static get haxProperties() {
    return {
      type: "grid",
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
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "siteurl",
            title: "Site address",
            description: "Paste address to reference content from if not the current site",
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
            description: "Checking this box copies the remote content for editing locally but removes the association. It will no longer get updates when the reference material updates.",
            inputMethod: "boolean",
          },
          {
            property: "showTitle",
            title: "Show title",
            description: "Toggle on to render the title of the resource being displayed",
            inputMethod: "boolean"
          }
        ],
      },
      demoSchema: [
        {
          tag: "site-remote-content",
          properties: {
            showTitle: true,
            _remoteTitle: "Select content",
          },
          content: "<div>Select content to load</div>"
        }
      ],
      saveOptions: {
        unsetAttributes: ["t", "_remote-title"]
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
    return this.shadowRoot.querySelector('#content').innerHTML;
  }
  /**
   * Allow for dynamic setting of the parent field if we have the store around
   * with values to do so
   */
  async haxsetupActiveElementForm(props) {
    if (window.HAXCMS) {
      if (Object.keys(this.itemManifest).length === 0 || this.__refresh) {
        this.__refresh = false;
        // support remore vs local look up
        if (this.siteurl) {
          const response = await MicroFrontendRegistry.call(
            "@haxcms/siteManifest",
            {
              site: this.siteurl
            }
          );
          if (response.data) {
            this.itemManifest = response.data;
          }
        }
        else {
          this.itemManifest.items = store.getManifestItems(true);
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
            itemBuilder = this.itemManifest.items.find((i) => i.id == itemBuilder.parent);
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
        }
        else if (attr.property === "siteurl") {
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
 