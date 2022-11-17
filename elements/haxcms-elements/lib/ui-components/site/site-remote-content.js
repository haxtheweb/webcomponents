/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
 import { LitElement, html, css } from "lit";
 import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
 import { HAXCMSI18NMixin } from "../../core/utils/HAXCMSI18NMixin.js";
 import { wipeSlot, lightChildrenToShadowRootSelector, unwrap, encapScript } from "@lrnwebcomponents/utils/utils.js";
 import { enableServices } from "@lrnwebcomponents/micro-frontend-registry/lib/microServices.js";
 import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
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
    this.loading = false;
    this.uuid = null;
    this.siteurl = 'https://haxtheweb.org/';
    this.showTitle = false;
    this.breakreference = false;
    this._remoteTitle = null;
    this.t = {
      selectPage: "Select page"
    };
  }
  /**
  * LitElement
  */
  render() {
    return html`
    <div class="loading"></div>
    ${this.showTitle && this._remoteTitle ? html`<h3>${this._remoteTitle}</h3>` : ``}
    <div id="content"></div>
    `;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'uuid' && this[propName]) {
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
      if (propName === 'siteurl' && window.HaxStore) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          this.loading = true;
          window.HaxStore.instance.refreshActiveNodeForm();
        }, 500);
      }
      // this is crazy, self explode if asked to do so!
      if (propName === 'breakreference' && this[propName]) {
        // get one last copy of this before blowing up
        this.loading = true;
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
      div.innerHTML = encapScript(response.data.content);
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
      else {
        // lol, self destruct, on purpose
        unwrap(this);
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
      }
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
            property: "showTitle",
            title: "Show title",
            description: "Toggle on to render the title of the resource being displayed",
            inputMethod: "boolean"
          }
        ],
        advanced: [
          {
            property: "breakreference",
            title: "Break reference",
            description: "Checking this box copies the remote content for editing locally but removes the association. It will no longer get updates when the reference material updates.",
            inputMethod: "boolean",
          }
        ]
      },
      demoSchema: [
        {
          tag: "site-remote-content",
          properties: {
            showTitle: true,
            _remoteTitle: "Select content",
          },
          content: "<div>Remote rendered material</div>"
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
          text: this.t.selectPage,
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
      // end loading indicator as data should be present now
      this.loading = false;
    }
  }
 }
 customElements.define(SiteRemoteContent.tag, SiteRemoteContent);
 export { SiteRemoteContent };
 