import { css, html } from "lit";
import { CollectionList } from "@haxtheweb/collection-list/collection-list.js";
import "@haxtheweb/collection-list/lib/collection-item.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

// site-collection-list that automatically renders based on criteria from the sitee.json
export class SiteCollectionList extends CollectionList {
  constructor() {
    super();
    this.editMode = false;
    this.conditions = {};
    this.sortObj = {};
    this.results = [];
    this.breakSmartCollection = false;
    this.limit = 8;
    this.sort = "title";
    this.parent = "";
    this.tags = "";
    this.pageType = "";
    this.published = "true";
    this.hideInMenu = "";
    this.relatedItems = "";

    this.t = {
      allItems: "All items",
      topLevelItems: "Top level items",
    };
  }
  render() {
    return html`
      <site-query
        @result-changed="${this.resultEvent}"
        .sort="${this.sortObj}"
        .conditions="${this.conditions}"
        limit="${this.limit}"
      ></site-query>
      <collection-list
        items-per-row="${this.itemsPerRow}"
        ?lock-items="${this.editMode}"
      >
        ${this.results.map(
          (item) => html`
            <collection-item
              line1="${item.title}"
              line2="${item.description}"
              url="${item.slug}"
              image="${item.metadata.image}"
              tags="${item.metadata.tags}"
              icon="${item.metadata.icon}"
              accent-color="${item.metadata.accentColor}"
            ></collection-item>
          `,
        )}
      </collection-list>
    `;
  }
  resultEvent(e) {
    this.results = [...e.detail.value];
  }
  /**
   * Props
   */
  static get properties() {
    return {
      ...super.properties,
      editMode: { type: Boolean },
      /**
       * Conditions that can be used to slice the data differently in the manifest
       */
      conditions: {
        type: Object,
      },

      limit: { type: Number },
      sort: { type: String },
      parent: { type: String },
      tags: { type: String },
      pageType: { type: String, attribute: "page-type" },
      published: { type: String },
      hideInMenu: { type: String, attribute: "hide-in-menu" },
      relatedItems: { type: String, attribute: "related-items" },

      /**
       * Establish the order items should be displayed in
       */
      sortObj: {
        type: Object,
      },
      results: {
        type: Array,
      },
      // allow breakeing smart list into own collection
      breakSmartCollection: {
        type: Boolean,
        attribute: "break-smart-collection",
        reflect: true,
      },
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (this.shadowRoot && propName == "results") {
        this.dispatchEvent(
          new CustomEvent("results-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      if (
        this.shadowRoot &&
        [
          "parent",
          "tags",
          "pageType",
          "published",
          "hideInMenu",
          "relatedItems",
        ].includes(propName)
      ) {
        let conditions = {};
        if (this.parent !== "") {
          conditions.parent = this.parent;
        }
        if (this.tags !== "" && this.tags !== null) {
          conditions["metadata.tags"] = this.tags;
        }
        if (this.pageType !== "" && this.pageType !== null) {
          conditions["metadata.pageType"] = this.pageType;
        }
        if (this.published !== "null") {
          conditions["metadata.published"] =
            this.published === "true" ? true : false;
        }
        if (this.hideInMenu != "null") {
          conditions["metadata.hideInMenu"] =
            this.hideInMenu === "true" ? true : false;
        }
        if (this.relatedItems != "" && this.relatedItems !== null) {
          conditions["metadata.relatedItems"] = this.relatedItems;
        }
        this.conditions = { ...conditions };
      }
      if (this.shadowRoot && propName === "sort") {
        let sortObj = {};
        sortObj[this[propName]] = "ASC";
        this.sortObj = { ...sortObj };
      }
      // convert to editable list
      if (propName === "breakSmartCollection" && this.breakSmartCollection) {
        // find the content area in shadow
        let clone = this.shadowRoot
          .querySelector("collection-list")
          .cloneNode(true);
        clone.removeAttribute("lock-items"); // otherwise everything is locked
        this.parentNode.insertBefore(clone, this);
        // remove self after clone of root data so it's broken off
        setTimeout(() => {
          this.remove();
        }, 0);
      }
    });
  }
  /**
   * haxHooks
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
      setupActiveElementForm: "haxsetupActiveElementForm",
    };
  }

  haxeditModeChanged(value) {
    this.editMode = value;
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this.editMode = value;
    }
  }
  /**
   * Allow for dynamic setting of the parent field if we have the store around
   * with values to do so
   */
  haxsetupActiveElementForm(props) {
    const itemManifest = store.getManifestItems(true);
    // default to null parent as the whole site
    var items = [];
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
    // apply same logic of the items in the active site to
    // parent and related items
    props.settings.configure.forEach((attr, index) => {
      if (attr.property === "parent") {
        props.settings.configure[index].inputMethod = "select";
        props.settings.configure[index].itemsList = [
          {
            text: `-- ${this.t.allItems} --`,
            value: "",
          },
          {
            text: `-- ${this.t.topLevelItems} --`,
            value: null,
          },
          ...items,
        ];
      }
      if (attr.property === "relatedItems") {
        props.settings.configure[index].inputMethod = "select";
        props.settings.configure[index].itemsList = [
          {
            text: `-- ${this.t.allItems} --`,
            value: "",
          },
          ...items,
        ];
      }
    });
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-10) 0;
        }
      `,
    ];
  }
  static get tag() {
    return "site-collection-list";
  }
}

customElements.define(SiteCollectionList.tag, SiteCollectionList);
