import { autorun, toJS } from "mobx";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { HAXCMSAllowedBlocksUI } from "@haxtheweb/haxcms-elements/lib/core/ui/haxcms-allowed-blocks-ui.js";

/**
 * `haxcms-system-allowed-blocks`
 * AppHAX scoped extension of haxcms-allowed-blocks-ui so system-level
 * appStore loading / enabled-block state does not affect site editor context.
 */
class HAXCMSSystemAllowedBlocks extends HAXCMSAllowedBlocksUI {
  static get tag() {
    return "haxcms-system-allowed-blocks";
  }

  constructor() {
    super();
    this.__inventoryBootstrapPending = false;
    this.__inventoryBootstrapComplete = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._bootstrapInventoryFromSystemBlocks();
    const enabledBlocksDisposer = autorun(() => {
      const platformConfig = toJS(HAXStore.platformConfig);
      if (platformConfig) {
        return;
      }
      const appStoreData = toJS(HAXStore.__appStoreData);
      if (
        !appStoreData ||
        !Object.prototype.hasOwnProperty.call(appStoreData, "enabledBlocks")
      ) {
        return;
      }
      const enabledBlocks = appStoreData.enabledBlocks;
      if (!Array.isArray(enabledBlocks)) {
        return;
      }
      this.allowedBlocksDefined = true;
      this.allowedBlocks = new Set(enabledBlocks);
    });
    this.__disposer.push(enabledBlocksDisposer);
  }

  _backendApi() {
    if (
      globalThis &&
      globalThis.AppHaxAPI &&
      typeof globalThis.AppHaxAPI.requestAvailability === "function"
    ) {
      return globalThis.AppHaxAPI.requestAvailability();
    }
    if (globalThis && globalThis.AppHaxAPI && globalThis.AppHaxAPI.instance) {
      return globalThis.AppHaxAPI.instance;
    }
    return null;
  }
  _supportsCall(callKey = "") {
    const normalizedCallKey = `${callKey || ""}`.trim();
    if (!normalizedCallKey) {
      return false;
    }
    const api = this._backendApi();
    return !!(
      api &&
      typeof api.supportsCall === "function" &&
      api.supportsCall(normalizedCallKey)
    );
  }

  _hasSystemBlocksEndpoint() {
    return this._supportsCall("systemBlocksList");
  }

  async _ensureAutoloader() {
    if (!globalThis.customElements.get("hax-autoloader")) {
      await import("@haxtheweb/hax-body/lib/hax-autoloader.js");
    }
    if (!HAXStore.haxAutoloader) {
      const autoloader = globalThis.document.createElement("hax-autoloader");
      autoloader.style.display = "none";
      globalThis.document.body.appendChild(autoloader);
      HAXStore.haxAutoloader = autoloader;
    }
  }

  async _fetchSystemBlocksData() {
    const api = this._backendApi();
    if (!api || typeof api.makeCall !== "function") {
      return null;
    }
    const response = await api.makeCall("systemBlocksList");
    if (!response || response.status !== 200) {
      return null;
    }
    return response;
  }

  async _bootstrapInventoryFromSystemBlocks() {
    if (this.__inventoryBootstrapPending || this.__inventoryBootstrapComplete) {
      return;
    }
    this.__inventoryBootstrapPending = true;
    try {
      if (
        !this._hasSystemBlocksEndpoint() &&
        HAXStore.appStoreLoaded &&
        Array.isArray(HAXStore.gizmoList)
      ) {
        this.__inventoryBootstrapComplete = true;
        return;
      }
      await this._ensureAutoloader();
      const appStoreData = await this._fetchSystemBlocksData();
      if (
        appStoreData &&
        typeof HAXStore._loadAppStoreData === "function" &&
        HAXStore.haxAutoloader
      ) {
        HAXStore.__appStoreData = appStoreData;
        await HAXStore._loadAppStoreData(appStoreData);
      }
      this.__inventoryBootstrapComplete = true;
    } catch (e) {
      this.__inventoryBootstrapComplete = false;
    }
    this.__inventoryBootstrapPending = false;
  }
}

globalThis.customElements.define(
  HAXCMSSystemAllowedBlocks.tag,
  HAXCMSSystemAllowedBlocks,
);

export { HAXCMSSystemAllowedBlocks };
