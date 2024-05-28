/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
/**
 * `site-uuid-link`
 * `UUID to render an accurate link and title in the site`
 *
 * @demo demo/index.html
 */
class SiteUuidLink extends LitElement {
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
    return "site-uuid-link";
  }
  constructor() {
    super();
    this.uuid = null;
  }
  /**
   * LitElement
   */
  render() {
    return html`
      <a href="${this.getLinkFromUUID(this.uuid)}" @click="${this.testOpen}">
        ${this.getTitleFromUUID(this.uuid)}
      </a>
    `;
  }
  testOpen(e) {
    if (this._haxstate) {
      // do not do default so we can select this
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }
  // get title from uuid
  getLinkFromUUID(uuid) {
    if (uuid && store.findItem(uuid)) {
      const item = toJS(store.findItem(uuid));
      return item.slug;
    }
    return "";
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
    };
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: false,
      gizmo: {
        title: "HAX link",
        description:
          "A link to a specific resource in the site your working on.",
        icon: "icons:link",
        color: "grey",
        tags: [
          "Other",
          "haxcms",
          "content",
          "remote",
          "reference",
          "url",
          "resource",
        ],
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
        ],
      },
    };
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
      setupActiveElementForm: "haxsetupActiveElementForm",
    };
  }
  haxeditModeChanged(value) {
    this._haxstate = value;
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  /**
   * Allow for dynamic setting of the parent field if we have the store around
   * with values to do so
   */
  haxsetupActiveElementForm(props) {
    if (globalThis.HAXCMS) {
      const itemManifest = store.getManifestItems(true);
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
customElements.define(SiteUuidLink.tag, SiteUuidLink);
export { SiteUuidLink };
