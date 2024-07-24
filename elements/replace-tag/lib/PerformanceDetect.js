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
    this.details = this.updateDetails();
  }
  static get tag() {
    return "performance-detect";
  }
  // test device for ANY poor setting
  async badDevice() {
    for (const [key, value] of Object.entries(await this.details)) {
      if (value) {
        return true;
      }
    }
    return false;
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
    }
    return this.details;
  }
  async updateDetails() {
    let details = {
      lowMemory: false,
      lowProcessor: false,
      lowBattery: false,
      poorConnection: false,
      dataSaver: false,
    };
    if (navigator) {
      // if less than a gig we know its bad
      if (navigator.deviceMemory && globalThis.navigator.deviceMemory < 1) {
        details.lowMemory = true;
      }
      // even phones have multi-core processors so another sign
      if (
        navigator.hardwareConcurrency &&
        globalThis.navigator.hardwareConcurrency < 2
      ) {
        details.lowProcessor = true;
      }
      // some platforms support getting the battery status
      if (navigator.getBattery) {
        globalThis.navigator.getBattery().then(function (battery) {
          // if we are not charging AND we have under 25% be kind
          if (!battery.charging && battery.level < 0.25) {
            details.lowBattery = true;
          }
        });
      }
      // some things report the "type" of internet connection speed
      // for terrible connections lets save frustration
      if (
        globalThis.navigator.connection &&
        globalThis.navigator.connection.effectiveType &&
        ["slow-2g", "2g", "3g"].includes(navigator.connection.effectiveType)
      ) {
        details.poorConnection = true;
      }
      // see if they said "hey, save me data"
      if (navigator.connection && globalThis.navigator.connection.saveData) {
        details.dataSaver = true;
      }
    }
    return details;
  }
}
customElements.define(PerformanceDetect.tag, PerformanceDetect);
export { PerformanceDetect };
