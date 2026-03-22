// register globally so we can make sure there is only one
globalThis.PerformanceDetectManager = globalThis.PerformanceDetectManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.PerformanceDetectManager.requestAvailability = () => {
  if (!globalThis.PerformanceDetectManager.instance) {
    globalThis.PerformanceDetectManager.instance =
      globalThis.document.createElement("performance-detect");
    globalThis.document.body.appendChild(
      globalThis.PerformanceDetectManager.instance,
    );
  }
  return globalThis.PerformanceDetectManager.instance;
};
export const DeviceDetails =
  globalThis.PerformanceDetectManager.requestAvailability();
class PerformanceDetect extends HTMLElement {
  constructor() {
    super();
    this.details = {
      lowMemory: false,
      lowProcessor: false,
      lowBattery: false,
      poorConnection: false,
      dataSaver: false,
      mobileDevice: false,
    };
    this.updateDetails();
  }
  static get tag() {
    return "performance-detect";
  }
  // test device for ANY poor setting
  async badDevice() {
    const details = await this.updateDetails();
    return (
      details.lowMemory ||
      details.lowProcessor ||
      details.lowBattery ||
      details.poorConnection ||
      details.dataSaver
    );
  }
  mobileDevice() {
    return this.detectMobileDevice();
  }
  // return any details
  getDetails(detail = null) {
    switch (detail) {
      case "memory":
        return this.details.lowMemory;
        break;
      case "processor":
        return this.details.lowProcessor;
        break;
      case "battery":
        return this.details.lowBattery;
        break;
      case "connection":
        return this.details.poorConnection;
        break;
      case "data":
        return this.details.dataSaver;
        break;
      case "mobile":
        return this.details.mobileDevice;
        break;
    }
    return this.details;
  }
  detectMobileDevice() {
    const userAgent =
      globalThis.navigator && globalThis.navigator.userAgent
        ? globalThis.navigator.userAgent
        : "";
    const touchPoints =
      globalThis.navigator &&
      typeof globalThis.navigator.maxTouchPoints === "number"
        ? globalThis.navigator.maxTouchPoints
        : 0;
    const mobileUserAgent =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
        userAgent,
      );
    const iPadDesktopMode = /Macintosh/i.test(userAgent) && touchPoints > 1;
    const coarsePointer =
      globalThis.matchMedia &&
      globalThis.matchMedia("(pointer: coarse)").matches;
    return (
      mobileUserAgent ||
      iPadDesktopMode ||
      (coarsePointer && touchPoints > 0)
    );
  }
  async updateDetails() {
    let details = {
      lowMemory: false,
      lowProcessor: false,
      lowBattery: false,
      poorConnection: false,
      dataSaver: false,
      mobileDevice: this.detectMobileDevice(),
    };
    if (globalThis.navigator) {
      // if less than a gig we know its bad
      if (
        globalThis.navigator.deviceMemory &&
        globalThis.navigator.deviceMemory < 1
      ) {
        details.lowMemory = true;
      }
      // even phones have multi-core processors so another sign
      if (
        globalThis.navigator.hardwareConcurrency &&
        globalThis.navigator.hardwareConcurrency < 2
      ) {
        details.lowProcessor = true;
      }
      // some platforms support getting the battery status
      if (globalThis.navigator.getBattery) {
        try {
          const battery = await globalThis.navigator.getBattery();
          // if we are not charging AND we have under 25% be kind
          if (!battery.charging && battery.level < 0.25) {
            details.lowBattery = true;
          }
        } catch (e) {
          // ignore
        }
      }
      // some things report the "type" of internet connection speed
      // for terrible connections lets save frustration
      if (
        globalThis.navigator.connection &&
        globalThis.navigator.connection.effectiveType &&
        ["slow-2g", "2g", "3g"].includes(
          globalThis.navigator.connection.effectiveType,
        )
      ) {
        details.poorConnection = true;
      }
      // see if they said "hey, save me data"
      if (
        globalThis.navigator.connection &&
        globalThis.navigator.connection.saveData
      ) {
        details.dataSaver = true;
      }
    }
    this.details = details;
    return details;
  }
}
globalThis.customElements.define(PerformanceDetect.tag, PerformanceDetect);
export { PerformanceDetect };
