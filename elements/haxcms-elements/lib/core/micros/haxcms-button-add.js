import { store } from "../haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { HAXCMSButton } from "../utils/HAXCMSButton.js";
import { SimpleToolbarButtonBehaviors } from "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { toJS } from "mobx";
import { css } from "lit";
export class HAXCMSButtonAdd extends SimpleToolbarButtonBehaviors(
  HAXCMSButton,
) {
  static get tag() {
    return "haxcms-button-add";
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.t = this.t || {};
    this.t.newPageAdded = "New page added";
    this.t.newPage = "Page";
    this.t.copy = "Copy";
    this.t.newChildPage = "Child";
    this.t.duplicatePage = "Clone";
    this.icon = null;
    this.voiceCommand = "add page";
    this.type = "sibling";
    this.autoEdit = false;
    this.showTextLabel = false;
    this.iconPosition = "left";
    this.actionId = null;
    this.alignHorizontal = "left";
    this.addEventListener("click", this.HAXCMSButtonClick);
  }
  static get styles() {
    return [
      super.styles,
      ...this.iconStyles,
      ...this.labelStyles,
      ...this.tooltipStyles,
      ...this.simpleButtonCoreStyles,
      ...this.simpleButtonLayoutStyles,
      ...this.simpleButtonThemeStyles,
      css`:host {
        --simple-toolbar-border-radius: 0;
      }`
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      autoEdit: { type: Boolean, attribute: "auto-edit" },
      actionId: { type: String, attribute: "action-id" },
      type: { type: String },
      merlin: { type: Boolean, reflect: true },
    };
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    switch (this.type) {
      case "sibling":
        if (!this.icon) {
          this.icon = "hax:add-page";
        }
        if (!this.label) {
          this.label = this.t.newPage;
        }
        break;
      case "child":
        if (!this.icon) {
          this.icon = "hax:add-child-page";
        }
        if (!this.label) {
          this.label = this.t.newChildPage;
        }
        break;
      case "duplicate":
        if (!this.icon) {
          this.icon = "hax:duplicate";
        }
        if (!this.label) {
          this.label = this.t.duplicatePage;
        }
        break;
    }
  }

  render() {
    return this.buttonTemplate;
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(
      "haxcms-create-node-success",
      this.HAXCMSButtonClickResponse.bind(this),
      { signal: this.windowControllers.signal },
    );
  }

  disconnectedCallback() {
    this.windowControllers.abort();

    super.disconnectedCallback();
  }

  async HAXCMSButtonClick() {
    store.playSound("click");

    // If merlin flag is set, invoke the unified page creation program in mini-Merlin mode
    if (this.merlin) {
      const SuperDaemonInstance =
        globalThis.SuperDaemonManager.requestAvailability();

      // Use waveWand for proper mini-Merlin invocation like drag/drop does
      SuperDaemonInstance.waveWand([
        "", // no initial search term
        "/", // program context
        {}, // no initial values
        "create-page", // unified program machine name
        "Create Page", // program display name
        "", // no initial search
      ]);
      return;
    }
    // Original button behavior when merlin flag is not set
    let order = null;
    let title = this.t.newPage;
    let parent = null;
    let item = {};
    // support for button defining the id of the associated item
    if (this.actionId) {
      // support for null as in top of heirarchy
      if (this.actionId == "null" || this.actionId == null) {
        item = toJS(await store.getLastChildItem(null));
      } else {
        item = await store.findItemAsObject(this.actionId);
      }
    }
    // if we lacked dedicated context, assume the active Item
    else {
      item = toJS(store.activeItem);
    }
    if (item) {
      if (this.type === "sibling") {
        parent = item.parent;
        order = parseInt(item.order) + 1;
      } else if (this.type === "child") {
        parent = item.id;
        // see if we have a last child of the current item
        let item2 = toJS(await store.getLastChildItem(item.id));
        order = 0;
        if (item2.order) {
          order = parseInt(item2.order) + 1;
        }
      } else if (this.type === "duplicate") {
        title = item.title + " " + this.t.copy;
        parent = item.parent;
        order = parseInt(item.order) + 1;
      }
    }
    // sanity fallback in case a translation system is bricked
    if (title === "") {
      title = "New";
    }
    var payload = {
      node: {
        title: title,
        location: "",
      },
      order: order,
      parent: parent,
    };
    // special flag for duplicating the content of an existing item
    if (this.type === "duplicate") {
      payload.node.duplicate = item.id;
    }
    // wrapper on CustomEvent to ensure uniformity
    this.HAXCMSFireButtonEvent("haxcms-create-node", this, payload);
  }
  HAXCMSButtonClickResponse(e) {
    // only respond to this if the event was generated by this element
    // this helps avoid multiple instances of a button colliding
    if (this === e.detail.originalTarget) {
      if (this.autoEdit) {
        // force hax tray to open
        HAXStore.haxTray.collapsed = false;
        // hax-body's ContentStateManager now handles timing internally
        // no delay needed - edit mode will wait for content stability
        store.editMode = true;
      }
    }
  }
}

globalThis.customElements.define(HAXCMSButtonAdd.tag, HAXCMSButtonAdd);
